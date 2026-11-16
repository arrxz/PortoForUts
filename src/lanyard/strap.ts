import * as THREE from 'three';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import { createStrapTexture } from './textures';

export function createStrapMesh(): {
  strapMesh: THREE.Mesh;
  updateStrap: (points: THREE.Vector3[]) => void;
  dispose: () => void;
} {
  const strapTexture = createStrapTexture();
  const geometry = new MeshLineGeometry();

  // Initial curve points (from anchor to top of card)
  const initialPoints = [
    new THREE.Vector3(0, 4.5, 0),
    new THREE.Vector3(0, 3.0, 0),
    new THREE.Vector3(0, 1.5, 0),
    new THREE.Vector3(0, 0, 0),
  ];
  geometry.setPoints(initialPoints);

  const material = new MeshLineMaterial({
    useMap: 1,
    map: strapTexture,
    repeat: new THREE.Vector2(3, 1),
    lineWidth: 0.22,
    color: new THREE.Color(0xf54f1b),
    resolution: new THREE.Vector2(window.innerWidth, window.innerHeight),
    sizeAttenuation: 1,
  });

  const strapMesh = new THREE.Mesh(geometry, material);

  function updateStrap(points: THREE.Vector3[]) {
    const curve = new THREE.CatmullRomCurve3(points);
    const smoothPoints = curve.getPoints(32);
    geometry.setPoints(smoothPoints);
  }

  function dispose() {
    geometry.dispose();
    material.dispose();
    strapTexture.dispose();
  }

  return { strapMesh, updateStrap, dispose };
}
