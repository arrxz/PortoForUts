import { gsap, mm } from '../lib/gsap';

let ctx: gsap.Context | null = null;

export function initAbout(container: HTMLElement) {
  ctx = gsap.context(() => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.from('.about-reveal', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
      });
    });
  }, container);
}

export function destroyAbout() {
  ctx?.revert();
  ctx = null;
}
