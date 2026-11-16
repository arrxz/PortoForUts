import RAPIER from '@dimforge/rapier3d-compat';
import * as THREE from 'three';

export interface PhysicsSystem {
  world: RAPIER.World;
  cardBody: RAPIER.RigidBody;
  segmentBodies: RAPIER.RigidBody[];
  anchorBody: RAPIER.RigidBody;
  step: (deltaTime: number) => void;
  startDrag: (worldPoint: THREE.Vector3) => void;
  updateDrag: (worldPoint: THREE.Vector3) => void;
  endDrag: () => void;
  isDragging: boolean;
  dispose: () => void;
}

export async function createPhysics(): Promise<PhysicsSystem> {
  await RAPIER.init();

  const gravity = { x: 0.0, y: -40.0, z: 0.0 };
  const world = new RAPIER.World(gravity);

  // 1. Anchor fixed at top of hero view
  const anchorPos = { x: 0, y: 4.2, z: 0 };
  const anchorDesc = RAPIER.RigidBodyDesc.fixed().setTranslation(anchorPos.x, anchorPos.y, anchorPos.z);
  const anchorBody = world.createRigidBody(anchorDesc);

  // 2. Strap segments (3 segments between anchor and card)
  const segmentBodies: RAPIER.RigidBody[] = [];
  const numSegments = 3;
  const segLength = 1.0;

  let prevBody = anchorBody;

  // "Drop on enter": start bodies slightly folded near anchor
  for (let i = 0; i < numSegments; i++) {
    const y = anchorPos.y - (i + 1) * (segLength * 0.4); // compressed initially
    const segDesc = RAPIER.RigidBodyDesc.dynamic()
      .setTranslation(anchorPos.x + (Math.random() - 0.5) * 0.1, y, 0)
      .setLinearDamping(2.0)
      .setAngularDamping(2.0);

    const segBody = world.createRigidBody(segDesc);
    const segCollider = RAPIER.ColliderDesc.ball(0.06);
    world.createCollider(segCollider, segBody);

    // Connect with spherical joint
    const jointData = RAPIER.JointData.spherical(
      { x: 0, y: i === 0 ? 0 : -segLength * 0.5, z: 0 },
      { x: 0, y: segLength * 0.5, z: 0 }
    );
    world.createImpulseJoint(jointData, prevBody, segBody, true);

    segmentBodies.push(segBody);
    prevBody = segBody;
  }

  // 3. Card rigid body & cuboid collider
  const cardHalfExtents = { x: 0.8, y: 1.125, z: 0.01 };
  const cardInitialY = anchorPos.y - (numSegments + 1) * (segLength * 0.45);

  const cardDesc = RAPIER.RigidBodyDesc.dynamic()
    .setTranslation(anchorPos.x, cardInitialY, 0)
    .setLinearDamping(2.5)
    .setAngularDamping(2.5);

  const cardBody = world.createRigidBody(cardDesc);
  const cardCollider = RAPIER.ColliderDesc.cuboid(
    cardHalfExtents.x,
    cardHalfExtents.y,
    cardHalfExtents.z
  );
  world.createCollider(cardCollider, cardBody);

  // Connect last segment to top of card
  const cardJoint = RAPIER.JointData.spherical(
    { x: 0, y: -segLength * 0.5, z: 0 },
    { x: 0, y: cardHalfExtents.y + 0.1, z: 0 }
  );
  world.createImpulseJoint(cardJoint, prevBody, cardBody, true);

  // Fixed timestep accumulator
  let accumulator = 0;
  const fixedDelta = 1 / 60;

  function step(dt: number) {
    accumulator += Math.min(dt, 0.1);
    while (accumulator >= fixedDelta) {
      world.step();
      accumulator -= fixedDelta;
    }
  }

  // Drag Interaction
  let isDragging = false;
  const dragOffset = new THREE.Vector3();
  let lastPos = new THREE.Vector3();
  let lastTime = 0;
  const releaseVelocity = new THREE.Vector3();

  function startDrag(worldPoint: THREE.Vector3) {
    isDragging = true;
    const currentTranslation = cardBody.translation();
    dragOffset.set(
      currentTranslation.x - worldPoint.x,
      currentTranslation.y - worldPoint.y,
      0
    );
    cardBody.setBodyType(RAPIER.RigidBodyType.KinematicPositionBased, true);
    lastPos.copy(worldPoint);
    lastTime = performance.now();
  }

  function updateDrag(worldPoint: THREE.Vector3) {
    if (!isDragging) return;
    const now = performance.now();
    const dt = Math.max((now - lastTime) / 1000, 0.001);

    const targetX = worldPoint.x + dragOffset.x;
    const targetY = worldPoint.y + dragOffset.y;

    releaseVelocity.set(
      (targetX - cardBody.translation().x) / dt,
      (targetY - cardBody.translation().y) / dt,
      0
    );
    releaseVelocity.clampLength(0, 30);

    cardBody.setNextKinematicTranslation({
      x: targetX,
      y: targetY,
      z: 0,
    });

    lastPos.copy(worldPoint);
    lastTime = now;
  }

  function endDrag() {
    if (!isDragging) return;
    isDragging = false;
    cardBody.setBodyType(RAPIER.RigidBodyType.Dynamic, true);
    cardBody.setLinvel(
      {
        x: releaseVelocity.x,
        y: releaseVelocity.y,
        z: 0,
      },
      true
    );
  }

  function dispose() {
    world.free();
  }

  return {
    world,
    cardBody,
    segmentBodies,
    anchorBody,
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
