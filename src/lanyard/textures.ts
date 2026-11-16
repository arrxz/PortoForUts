import * as THREE from 'three';
import { PROFILE } from '../content';

export function createCardTextures(): { front: THREE.CanvasTexture; back: THREE.CanvasTexture } {
  // Canvas Ukuran 512 x 720 (rasio kartu ID)
  const width = 512;
  const height = 720;

  // 1. Front Texture
  const canvasFront = document.createElement('canvas');
  canvasFront.width = width;
  canvasFront.height = height;
  const ctxF = canvasFront.getContext('2d')!;

  // Background Paper
  ctxF.fillStyle = '#F4EEE2';
  ctxF.fillRect(0, 0, width, height);

  // Top Orange Accent Block
  ctxF.fillStyle = '#F54F1B';
  ctxF.fillRect(0, 0, width, 180);

  // Clip hole slot marker at top center
  ctxF.fillStyle = '#161412';
  ctxF.beginPath();
  ctxF.roundRect(width / 2 - 40, 24, 80, 16, 8);
  ctxF.fill();

  // Badge Header Text
  ctxF.fillStyle = '#161412';
  ctxF.font = 'bold 22px Archivo, sans-serif';
  ctxF.fillText('ID CARD // VERIFIED', 40, 95);

  ctxF.font = '500 16px "JetBrains Mono", monospace';
  ctxF.fillStyle = '#161412';
  ctxF.fillText('HARDWARE & WEB LAB', 40, 130);

  // Photo Box on Card
  ctxF.fillStyle = '#E6D5B7';
  ctxF.fillRect(40, 210, 150, 180);
  ctxF.strokeStyle = '#161412';
  ctxF.lineWidth = 2;
  ctxF.strokeRect(40, 210, 150, 180);

  // Name & Role on Paper
  ctxF.fillStyle = '#161412';
  ctxF.font = '900 36px Archivo, sans-serif';
  ctxF.fillText('AGNA', 210, 260);
  ctxF.fillText('ARYAPUTRA', 210, 305);

  ctxF.fillStyle = '#5E574E';
  ctxF.font = '500 16px "JetBrains Mono", monospace';
  ctxF.fillText('EMBEDDED & CNC', 210, 345);
  ctxF.fillText('NO. 2026.01.AAR', 210, 375);

  // Divider Line
  ctxF.strokeStyle = 'rgba(22, 20, 18, 0.2)';
  ctxF.lineWidth = 2;
  ctxF.beginPath();
  ctxF.moveTo(40, 430);
  ctxF.lineTo(width - 40, 430);
  ctxF.stroke();

  // Bottom Technical Specs
  ctxF.fillStyle = '#5E574E';
  ctxF.font = '14px "JetBrains Mono", monospace';
  ctxF.fillText('CORE: ARDUINO / ESP32 / C++', 40, 475);
  ctxF.fillText('SYSTEM: CNC SHIELD / GRBL v1.1', 40, 510);
  ctxF.fillText('WEB: TAILWIND v4 / TS / VITE', 40, 545);

  // Barcode Lines at bottom
  ctxF.fillStyle = '#161412';
  const barY = 600;
  for (let x = 40; x < width - 40; x += Math.random() * 8 + 3) {
    ctxF.fillRect(x, barY, Math.random() > 0.5 ? 2 : 4, 60);
  }

  const frontTexture = new THREE.CanvasTexture(canvasFront);
  frontTexture.colorSpace = THREE.SRGBColorSpace;

  // 2. Back Texture (Dark Ink)
  const canvasBack = document.createElement('canvas');
  canvasBack.width = width;
  canvasBack.height = height;
  const ctxB = canvasBack.getContext('2d')!;

  ctxB.fillStyle = '#161412';
  ctxB.fillRect(0, 0, width, height);

  // Back Clip hole slot
  ctxB.fillStyle = '#F4EEE2';
  ctxB.beginPath();
  ctxB.roundRect(width / 2 - 40, 24, 80, 16, 8);
  ctxB.fill();

  ctxB.fillStyle = '#F54F1B';
  ctxB.font = '900 28px Archivo, sans-serif';
  ctxB.fillText('PORTFOLIO CARD', 50, 140);

  ctxB.fillStyle = '#F4EEE2';
  ctxB.font = '16px "JetBrains Mono", monospace';
  ctxB.fillText('GITHUB: github.com/arrxz', 50, 220);
  ctxB.fillText('EMAIL: arrxz.dev@gmail.com', 50, 260);
  ctxB.fillText('PROJECT: PEN PLOTTER CNC', 50, 300);

  ctxB.fillStyle = '#5E574E';
  ctxB.font = '14px Archivo, sans-serif';
  ctxB.fillText('Tarik atau seret kartu ini dengan mouse.', 50, 480);
  ctxB.fillText('Halaman digerakkan dengan simulasi fisika 3D.', 50, 510);

  const backTexture = new THREE.CanvasTexture(canvasBack);
  backTexture.colorSpace = THREE.SRGBColorSpace;

  return { front: frontTexture, back: backTexture };
}

export function createStrapTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d')!;

  ctx.fillStyle = '#F54F1B';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#161412';
  ctx.font = 'bold 22px Archivo, sans-serif';
  ctx.textBaseline = 'middle';
  ctx.fillText('AGNA ARYAPUTRA  ·  EMBEDDED  ·  CNC  ·  WEB  ·  ', 10, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 1);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}
