import * as THREE from 'three';
import { createCardTextures } from './textures';

export function createCardMesh(): {
  cardMesh: THREE.Group;
  materials: THREE.Material[];
} {
  const group = new THREE.Group();
  const { front, back } = createCardTextures();

  // Dimensi kartu: 1.6 x 2.25 x 0.02
  const cardWidth = 1.6;
  const cardHeight = 2.25;
  const cardDepth = 0.02;

  const cardGeo = new THREE.BoxGeometry(cardWidth, cardHeight, cardDepth);

  const edgeMaterial = new THREE.MeshStandardMaterial({
    color: 0x161412,
    roughness: 0.8,
  });

  const frontMaterial = new THREE.MeshStandardMaterial({
    map: front,
    roughness: 0.35,
    metalness: 0.05,
  });

  const backMaterial = new THREE.MeshStandardMaterial({
    map: back,
    roughness: 0.35,
    metalness: 0.05,
  });

  // BoxGeometry face materials: right, left, top, bottom, front (+Z), back (-Z)
  const materials = [
    edgeMaterial,
    edgeMaterial,
    edgeMaterial,
    edgeMaterial,
    frontMaterial,
    backMaterial,
  ];

  const cardBody = new THREE.Mesh(cardGeo, materials);
  cardBody.castShadow = true;
  cardBody.receiveShadow = true;
  group.add(cardBody);

  // Metal clip at top
  const clipGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.25, 16);
  const clipMat = new THREE.MeshStandardMaterial({
    color: 0xd9d9d9,
    metalness: 0.9,
    roughness: 0.25,
  });
  const clipMesh = new THREE.Mesh(clipGeo, clipMat);
  clipMesh.rotation.z = Math.PI / 2;
  clipMesh.position.set(0, cardHeight / 2 + 0.1, 0);
  group.add(clipMesh);

  return { cardMesh: group, materials: [...materials, clipMat] };
}
