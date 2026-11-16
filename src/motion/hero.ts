import { gsap } from './gsap-setup';

export function initHeroMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

  const h1Lines = document.querySelectorAll('.hero-line-inner');
  if (h1Lines.length > 0) {
    tl.from(h1Lines, {
      yPercent: 100,
      duration: 0.9,
      stagger: 0.08,
    });
  }

  const subItems = document.querySelectorAll('.hero-fade-item');
  if (subItems.length > 0) {
    tl.from(
      subItems,
      {
        y: 24,
        autoAlpha: 0,
        duration: 0.6,
        stagger: 0.08,
      },
      '-=0.4'
    );
  }
}
