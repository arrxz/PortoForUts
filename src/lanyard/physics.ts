import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export interface PhysicsSystem {
  world: RAPIER.World;
  fixed: RAPIER.RigidBody;
  j1: RAPIER.RigidBody;
  j2: RAPIER.RigidBody;
  j3: RAPIER.RigidBody;
  card: RAPIER.RigidBody;
  step: (deltaTime: number) => void;
  startDrag: (grabPoint: THREE.Vector3) => void;
  updateDrag: (pointerPos3D: THREE.Vector3) => void;
  endDrag: () => void;
  isDragging: boolean;
  dispose: () => void;
}

export async function createPhysics(): Promise<PhysicsSystem> {
  await RAPIER.init();

  // Natural gravity pull
  const gravity = { x: 0.0, y: -25.0, z: 0.0 };
  const world = new RAPIER.World(gravity);

  // 1. Fixed anchor at top of hero view (y = 3.8)
  const fixedPos = { x: 0.0, y: 3.8, z: 0.0 };
  const fixedDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(fixedPos.x, fixedPos.y, fixedPos.z);
  const fixed = world.createRigidBody(fixedDesc);

  // 2. Intermediate rope joints (j1, j2, j3)
  // Length per segment is 0.6 (total strap length 1.8) so the card rests right in the upper-middle hero area
  const segLen = 0.6;
  const segmentMass = 0.4;

  const j1Desc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.04, 3.4, 0.02)
    .setLinearDamping(2.5)
    .setAngularDamping(2.5)
    .setAdditionalMass(segmentMass);
  const j1 = world.createRigidBody(j1Desc);
  world.createCollider(RAPIER.ColliderDesc.ball(0.08), j1);

  const j2Desc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(-0.04, 3.0, -0.02)
    .setLinearDamping(2.5)
    .setAngularDamping(2.5)
    .setAdditionalMass(segmentMass);
  const j2 = world.createRigidBody(j2Desc);
  world.createCollider(RAPIER.ColliderDesc.ball(0.08), j2);

  const j3Desc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.02, 2.5, 0.01)
    .setLinearDamping(2.5)
    .setAngularDamping(2.5)
    .setAdditionalMass(segmentMass);
  const j3 = world.createRigidBody(j3Desc);
  world.createCollider(RAPIER.ColliderDesc.ball(0.08), j3);

  // Rope joints: max distance segLen between nodes
  world.createImpulseJoint(RAPIER.JointData.rope(segLen, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), fixed, j1, true);
  world.createImpulseJoint(RAPIER.JointData.rope(segLen, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), j1, j2, true);
  world.createImpulseJoint(RAPIER.JointData.rope(segLen, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), j2, j3, true);

  // 3. Card rigid body: cuboid collider (half-extents 0.8 x 1.125 x 0.02)
  // Equal mass matching the strap segments prevents Rapier solver constraint slip
  const cardDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 1.8, 0.0) // Drops slightly from 1.8 down to resting height 0.65
    .setLinearDamping(1.5)
    .setAngularDamping(3.5)
    .setAdditionalMass(segmentMass);
  const card = world.createRigidBody(cardDesc);
  world.createCollider(RAPIER.ColliderDesc.cuboid(0.8, 1.125, 0.02), card);

  // Spherical joint connecting j3 to the top clip of the card
  world.createImpulseJoint(RAPIER.JointData.spherical({ x: 0, y: 0, z: 0 }, { x: 0, y: 1.35, z: 0 }), j3, card, true);

  // Fixed timestep physics accumulator
  let accumulator = 0;
  const fixedDelta = 1 / 60;

  function step(dt: number) {
    accumulator += Math.min(dt, 0.1);
    while (accumulator >= fixedDelta) {
      world.step();
      accumulator -= fixedDelta;
    }
  }

  // Drag state management
  let isDragging = false;
  const dragOffset = new THREE.Vector3();
  const lastPos = new THREE.Vector3();
  let lastTime = performance.now();
  const releaseVelocity = new THREE.Vector3();

  function startDrag(grabWorldPoint: THREE.Vector3) {
    isDragging = true;
    const cardTrans = card.translation();
    dragOffset.set(
      grabWorldPoint.x - cardTrans.x,
      grabWorldPoint.y - cardTrans.y,
      grabWorldPoint.z - cardTrans.z
    );

    card.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    lastPos.copy(grabWorldPoint);
    lastTime = performance.now();

    [fixed, j1, j2, j3, card].forEach((b) => b.wakeUp());
  }

  function updateDrag(pointerPos3D: THREE.Vector3) {
    if (!isDragging) return;

    const now = performance.now();
    const dt = Math.max((now - lastTime) / 1000, 0.001);

    const target = new THREE.Vector3(
      pointerPos3D.x - dragOffset.x,
      pointerPos3D.y - dragOffset.y,
      0
    );

    // Limit maximum drag reach to prevent strap over-stretching
    const maxRopeLength = 2.4;
    const fromAnchor = new THREE.Vector3(target.x - fixedPos.x, target.y - fixedPos.y, 0);
    if (fromAnchor.length() > maxRopeLength) {
      fromAnchor.setLength(maxRopeLength);
      target.set(fixedPos.x + fromAnchor.x, fixedPos.y + fromAnchor.y, 0);
    }

    target.z = 0.0;

    const currentTrans = card.translation();
    releaseVelocity.set(
      (target.x - currentTrans.x) / dt,
      (target.y - currentTrans.y) / dt,
      0
    );
    releaseVelocity.clampLength(0, 18);

    card.setNextKinematicTranslation({
      x: target.x,
      y: target.y,
      z: target.z,
    });

    [fixed, j1, j2, j3, card].forEach((b) => b.wakeUp());

    lastPos.copy(pointerPos3D);
    lastTime = now;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;

    card.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    card.setLinvel(
      {
        x: releaseVelocity.x * 0.7,
        y: releaseVelocity.y * 0.7,
        z: 0,
      },
      true
    );

    [fixed, j1, j2, j3, card].forEach((b) => b.wakeUp());
  }

  function dispose() {
    world.free();
  }

  return {
    world,
    fixed,
    j1,
    j2,
    j3,
    card,
    step,
    startDrag,
    updateDrag,
    endDrag,
    get isDragging() {
      return isDragging;
    },
    dispose,
  };
}
