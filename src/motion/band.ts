import { gsap, ScrollTrigger } from './gsap-setup';

export function initBandMotion() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const band = document.querySelector('.editorial-band');
  const text = document.querySelector('.editorial-band-text');

  if (band && text) {
    gsap.to(text, {
      scrollTrigger: {
        trigger: band,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      },
      xPercent: -6,
      ease: 'none',
    });
  }
}
