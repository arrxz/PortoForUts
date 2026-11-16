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

  // Gravity: natural downward pull
  const gravity = { x: 0.0, y: -28.0, z: 0.0 };
  const world = new RAPIER.World(gravity);

  // 1. Fixed anchor at top of hero view
  const fixedPos = { x: 0.0, y: 4.0, z: 0.0 };
  const fixedDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(fixedPos.x, fixedPos.y, fixedPos.z);
  const fixed = world.createRigidBody(fixedDesc);

  // 2. Intermediate rope joints (j1, j2, j3)
  // "Drop on enter": start bodies slightly folded near anchor
  const j1Desc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.05, 3.6, 0.02)
    .setLinearDamping(3.0)
    .setAngularDamping(3.0);
  const j1 = world.createRigidBody(j1Desc);
  world.createCollider(RAPIER.ColliderDesc.ball(0.08).setDensity(1.5), j1);

  const j2Desc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(-0.05, 3.2, -0.02)
    .setLinearDamping(3.0)
    .setAngularDamping(3.0);
  const j2 = world.createRigidBody(j2Desc);
  world.createCollider(RAPIER.ColliderDesc.ball(0.08).setDensity(1.5), j2);

  const j3Desc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.02, 2.7, 0.01)
    .setLinearDamping(3.0)
    .setAngularDamping(3.0);
  const j3 = world.createRigidBody(j3Desc);
  world.createCollider(RAPIER.ColliderDesc.ball(0.08).setDensity(1.5), j3);

  // Rope joints: length constraint 1.0 between nodes
  world.createImpulseJoint(RAPIER.JointData.rope(1.0, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), fixed, j1, true);
  world.createImpulseJoint(RAPIER.JointData.rope(1.0, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), j1, j2, true);
  world.createImpulseJoint(RAPIER.JointData.rope(1.0, { x: 0, y: 0, z: 0 }, { x: 0, y: 0, z: 0 }), j2, j3, true);

  // 3. Card rigid body: cuboid collider (half-extents 0.8 x 1.125 x 0.02)
  const cardDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(0.0, 1.4, 0.0) // Start above resting height for realistic entrance drop
    .setLinearDamping(1.8)
    .setAngularDamping(3.5);
  const card = world.createRigidBody(cardDesc);
  world.createCollider(RAPIER.ColliderDesc.cuboid(0.8, 1.125, 0.02).setDensity(0.8), card);

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
    // Offset between the clicked point on the card and the card center
    dragOffset.set(
      grabWorldPoint.x - cardTrans.x,
      grabWorldPoint.y - cardTrans.y,
      grabWorldPoint.z - cardTrans.z
    );

    card.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    lastPos.copy(grabWorldPoint);
    lastTime = performance.now();

    // Wake up all bodies immediately
    [fixed, j1, j2, j3, card].forEach((b) => b.wakeUp());
  }

  function updateDrag(pointerPos3D: THREE.Vector3) {
    if (!isDragging) return;

    const now = performance.now();
    const dt = Math.max((now - lastTime) / 1000, 0.001);

    // Target card center based on pointer and initial grab offset
    const target = new THREE.Vector3(
      pointerPos3D.x - dragOffset.x,
      pointerPos3D.y - dragOffset.y,
      0
    );

    // Clamp distance from anchor to prevent over-stretching the rope
    const maxRopeLength = 3.6;
    const fromAnchor = new THREE.Vector3(target.x - fixedPos.x, target.y - fixedPos.y, 0);
    if (fromAnchor.length() > maxRopeLength) {
      fromAnchor.setLength(maxRopeLength);
      target.set(fixedPos.x + fromAnchor.x, fixedPos.y + fromAnchor.y, 0);
    }

    // Keep card slightly forward to prevent clipping behind other elements
    target.z = 0.0;

    // Track fling release velocity
    const currentTrans = card.translation();
    releaseVelocity.set(
      (target.x - currentTrans.x) / dt,
      (target.y - currentTrans.y) / dt,
      0
    );
    releaseVelocity.clampLength(0, 20);

    card.setNextKinematicTranslation({
      x: target.x,
      y: target.y,
      z: target.z,
    });

    // Keep connected joints awake so they follow the movement
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
        x: releaseVelocity.x * 0.8,
        y: releaseVelocity.y * 0.8,
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
