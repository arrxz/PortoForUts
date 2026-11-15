import { gsap, mm } from '../lib/gsap';

let ctx: gsap.Context | null = null;

export function initWork(container: HTMLElement) {
  ctx = gsap.context(() => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      // Subtle reveal for work content
      gsap.from('.work-card-anim', {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: 'power2.out',
      });
    });
  }, container);
}

export function destroyWork() {
  ctx?.revert();
  ctx = null;
}
