import Lenis from 'lenis';

const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export const lenis = new Lenis({
  autoRaf: false,
  smoothWheel: !isReduced(),
});

// Pause during modal open
document.addEventListener('show.bs.modal', () => {
  lenis.stop();
});

document.addEventListener('hidden.bs.modal', () => {
  lenis.start();
});
