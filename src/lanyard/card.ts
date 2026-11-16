import * as THREE from 'three';
import { createCardTextures } from './textures';

export function createCardMesh(): {
  cardMesh: THREE.Group;
  materials: THREE.Material[];
} {
  const group = new THREE.Group();
  const { front, back } = createCardTextures();

  // Dimensi kartu ID: 1.6 lebar x 2.25 tinggi x 0.02 tebal
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

  // BoxGeometry face order: right (+X), left (-X), top (+Y), bottom (-Y), front (+Z), back (-Z)
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

  // Metal clip holding the card to the strap at joint anchor (y ≈ 1.25 to 1.35)
  const clipGroup = new THREE.Group();

  // Horizontal clip bar
  const clipBarGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.32, 16);
  const clipMat = new THREE.MeshStandardMaterial({
    color: 0xc4c4c4,
    metalness: 0.9,
    roughness: 0.25,
  });
  const clipBar = new THREE.Mesh(clipBarGeo, clipMat);
  clipBar.rotation.z = Math.PI / 2;
  clipBar.position.set(0, 1.2, 0);
  clipGroup.add(clipBar);

  // Vertical swivel ring connecting to strap
  const ringGeo = new THREE.TorusGeometry(0.09, 0.025, 12, 24);
  const ringMesh = new THREE.Mesh(ringGeo, clipMat);
  ringMesh.position.set(0, 1.32, 0);
  clipGroup.add(ringMesh);

  group.add(clipGroup);

  return { cardMesh: group, materials: [...materials, clipMat] };
}
