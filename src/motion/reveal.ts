import { gsap, ScrollTrigger } from './gsap-setup';

export function initReveals() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const tiles = document.querySelectorAll('.project-tile');
  if (tiles.length > 0) {
    gsap.from(tiles, {
      scrollTrigger: {
        trigger: '#proyek',
        start: 'top 80%',
        once: true,
      },
      clipPath: 'inset(100% 0% 0% 0%)',
      duration: 0.8,
      stagger: 0.1,
      ease: 'power3.out',
    });
  }

  const sections = document.querySelectorAll('.section-reveal');
  sections.forEach((sec) => {
    gsap.from(sec, {
      scrollTrigger: {
        trigger: sec,
        start: 'top 85%',
        once: true,
      },
      y: 30,
      autoAlpha: 0,
      duration: 0.7,
      ease: 'power2.out',
    });
  });
}
