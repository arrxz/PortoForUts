import * as THREE from 'three';
import { createPhysics, PhysicsSystem } from './physics';
import { createCardMesh } from './card';
import { createStrapMesh } from './strap';

export async function initLanyard(container: HTMLElement) {
  // 1. Fallback Checks (Section 7.8)
  const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isMobile = window.innerWidth < 1024 || window.matchMedia('(pointer: coarse)').matches;

  // WebGL support check
  let hasWebGL = false;
  try {
    const testCanvas = document.createElement('canvas');
    hasWebGL = Boolean(window.WebGLRenderingContext && (testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl')));
  } catch {
    hasWebGL = false;
  }

  const staticCard = document.getElementById('static-lanyard-card');

  if (isReduced || isMobile || !hasWebGL) {
    // Keep static card visible and return without loading 3D
    if (staticCard) {
      staticCard.classList.remove('hidden');
    }
    return null;
  }

  // 2. Setup Three.js Scene, Camera, Renderer
  const width = container.clientWidth || 450;
  const height = container.clientHeight || 560;

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

  // 3. Lighting (Clean, no external files)
  const ambientLight = new THREE.AmbientLight(0xfff6ea, 1.2);
  scene.add(ambientLight);

  const dirLight = new THREE.DirectionalLight(0xffffff, 2.0);
  dirLight.position.set(5, 10, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 1024;
  dirLight.shadow.mapSize.height = 1024;
  dirLight.shadow.bias = -0.0005;
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0xe6d5b7, 0.8);
  fillLight.position.set(-5, -2, 5);
  scene.add(fillLight);

  // 4. Create Card & Strap
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

  // Fade out static fallback once 3D canvas is ready
  if (staticCard) {
    staticCard.style.opacity = '0';
    setTimeout(() => staticCard.classList.add('hidden'), 300);
  }

  // 6. Raycasting & Drag Interaction
  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const intersectPoint = new THREE.Vector3();

  function getPointerWorldPos(e: PointerEvent): THREE.Vector3 | null {
    const rect = canvasEl.getBoundingClientRect();
    pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    raycaster.setFromCamera(pointer, camera);
    if (raycaster.ray.intersectPlane(planeZ, intersectPoint)) {
      return intersectPoint;
    }
    return null;
  }

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
      const worldPos = getPointerWorldPos(e);
      if (worldPos) {
        physics.startDrag(worldPos);
      }
    }
  });

  canvasEl.addEventListener('pointermove', (e) => {
    if (physics?.isDragging) {
      const worldPos = getPointerWorldPos(e);
      if (worldPos) {
        physics.updateDrag(worldPos);
      }
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

  // 7. Animation Loop with Visibility & Intersection Observer
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

    // Physics Step
    physics.step(dt);

    // Sync Three.js Card Position & Rotation
    const cardTrans = physics.cardBody.translation();
    const cardRot = physics.cardBody.rotation();
    cardMesh.position.set(cardTrans.x, cardTrans.y, cardTrans.z);
    cardMesh.quaternion.set(cardRot.x, cardRot.y, cardRot.z, cardRot.w);

    // Sync Strap Curve Points
    const anchorTrans = physics.anchorBody.translation();
    const strapPoints = [
      new THREE.Vector3(anchorTrans.x, anchorTrans.y, anchorTrans.z),
      ...physics.segmentBodies.map((b) => {
        const t = b.translation();
        return new THREE.Vector3(t.x, t.y, t.z);
      }),
      new THREE.Vector3(cardTrans.x, cardTrans.y + 1.15, cardTrans.z),
    ];
    updateStrap(strapPoints);

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
