import * as THREE from 'three';
import { createPhysics, PhysicsSystem } from './physics';
import { createCardMesh } from './card';
import { createStrapMesh } from './strap';

export async function initLanyard(container: HTMLElement) {
  // 1. Fallback Checks (Section 7.8)
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches;

  let hasWebGL = false;
  try {
    const testCanvas = document.createElement('canvas');
    hasWebGL = Boolean(
      window.WebGLRenderingContext &&
        (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl'))
    );
  } catch {
    hasWebGL = false;
  }

  const staticCard = document.getElementById('static-lanyard-card');

  if (isReduced || isMobile || !hasWebGL) {
    if (staticCard) {
      staticCard.classList.remove('hidden');
    }
    return null;
  }

  // 2. Setup Scene, Camera, Renderer
  const width = container.clientWidth || 450;
  const height = container.clientHeight || 580;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(25, width / height, 0.1, 100);
  camera.position.set(0, 0, 13);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance',
  });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const canvasEl = renderer.domElement;
  canvasEl.className = 'w-full h-full block cursor-grab select-none';
  canvasEl.setAttribute('aria-hidden', 'true');
  container.appendChild(canvasEl);

  // 3. Lighting Setup
  const ambientLight = new THREE.AmbientLight(0xfff5ea, 1.3);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.2);
  dirLight.position.set(6, 12, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.bias = -0.0004;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xe6d5b7, 0.9);
  fillLight.position.set(-6, -2, 6);
  scene.add(fillLight);

  // 4. Create Card & Strap Meshes
  const { cardMesh, materials } = createCardMesh();
  scene.add(cardMesh);

  const { strapMesh, updateStrap, dispose: disposeStrap } = createStrapMesh();
  scene.add(strapMesh);

  // 5. Initialize Physics
  let physics: PhysicsSystem | null = null;
  try {
    physics = await createPhysics();
  } catch (err) {
    console.warn('Physics initialization failed, falling back to static card', err);
    if (staticCard) staticCard.classList.remove('hidden');
    canvasEl.remove();
    return null;
  }

  // Smoothly fade out static fallback once 3D canvas is ready
  if (staticCard) {
    staticCard.style.opacity = '0';
    setTimeout(() => staticCard.classList.add('hidden'), 350);
  }

  // 6. Raycasting & Precision Drag Interaction
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const vec = new THREE.Vector3();
  const dir = new THREE.Vector3();

  canvasEl.addEventListener('pointerdown', (e) => {
    const rect = canvasEl.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);

    const intersects = raycaster.intersectObjects(cardMesh.children, true);
    if (intersects.length > 0 && physics) {
      canvasEl.setPointerCapture(e.pointerId);
      canvasEl.classList.remove('cursor-grab');
      canvasEl.classList.add('cursor-grabbing');

      physics.startDrag(intersects[0].point);
    }
  });

  canvasEl.addEventListener('pointermove', (e) => {
    if (physics?.isDragging) {
      const rect = canvasEl.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      // Unproject pointer to 3D world space coordinates on z=0 plane
      vec.set(pointer.x, pointer.y, 0.5).unproject(camera);
      dir.copy(vec).sub(camera.position).normalize();
      const dist = -camera.position.z / dir.z;
      const worldPos = camera.position.clone().add(dir.multiplyScalar(dist));

      physics.updateDrag(worldPos);
    }
  });

  const stopDrag = (e: PointerEvent) => {
    if (physics?.isDragging) {
      try {
        canvasEl.releasePointerCapture(e.pointerId);
      } catch {
        // noop
      }
      canvasEl.classList.remove('cursor-grabbing');
      canvasEl.classList.add('cursor-grab');
      physics.endDrag();
    }
  };

  canvasEl.addEventListener('pointerup', stopDrag);
  canvasEl.addEventListener('pointercancel', stopDrag);

  // 7. Animation Loop
  let isVisible = true;
  let isTabActive = true;
  let animationFrameId = 0;
  let lastTime = performance.now();

  const observer = new IntersectionObserver(
    (entries) => {
      isVisible = entries[0].isIntersecting;
    },
    { threshold: 0.1 }
  );
  observer.observe(container);

  const handleVisibilityChange = () => {
    isTabActive = !document.hidden;
  };
  document.addEventListener('visibilitychange', handleVisibilityChange);

  function animate(now: number) {
    animationFrameId = requestAnimationFrame(animate);

    if (!isVisible || !isTabActive || !physics) return;

    const dt = (now - lastTime) / 1000;
    lastTime = now;

    // Step physics with fixed delta accumulator
    physics.step(dt);

    // Sync Three.js Card Position & Rotation
    const cardTrans = physics.card.translation();
    const cardRot = physics.card.rotation();
    cardMesh.position.set(cardTrans.x, cardTrans.y, cardTrans.z);
    cardMesh.quaternion.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w);

    // Sync Strap Curve Points (fixed -> j1 -> j2 -> j3)
    const fT = physics.fixed.translation();
    const j1T = physics.j1.translation();
    const j2T = physics.j2.translation();
    const j3T = physics.j3.translation();

    updateStrap([
      new THREE.Vector3(fT.x, fT.y, fT.z),
      new THREE.Vector3(j1T.x, j1T.y, j1T.z),
      new THREE.Vector3(j2T.x, j2T.y, j2T.z),
      new THREE.Vector3(j3T.x, j3T.y, j3T.z),
    ]);

    renderer.render(scene, camera);
  }

  animationFrameId = requestAnimationFrame(animate);

  // Resize handler
  function handleResize() {
    if (!container) return;
    const w = container.clientWidth;
    const h = container.clientHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  }
  window.addEventListener('resize', handleResize);

  // Cleanup function (Section 7.7)
  return function destroy() {
    cancelAnimationFrame(animationFrameId);
    window.removeEventListener('resize', handleResize);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
    observer.disconnect();

    physics?.dispose();
    disposeStrap();
    materials.forEach((m) => m.dispose());
    renderer.dispose();
    canvasEl.remove();
  };
}
