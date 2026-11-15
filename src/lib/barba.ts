import barba from '@barba/core';
import { gsap, ScrollTrigger } from './gsap';
import { lenis } from './lenis';
import { mountIslands, unmountIslands } from './islands';
import { initPage, destroyPage } from '../pages';
import { initThemeToggle } from './theme';

const prefersReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function initBarba() {
  barba.init({
    preventRunning: true,
    transitions: [
      {
        name: 'ink-sweep',
        async leave({ current }: any) {
          unmountIslands(current.container);

          if (prefersReduced()) {
            return;
          }

          // Maksimal 250ms ink transition
          await gsap.to(current.container, {
            opacity: 0,
            duration: 0.25,
            ease: 'power2.inOut',
          });
        },
        async enter({ next }: any) {
          lenis.scrollTo(0, { immediate: true });
          mountIslands(next.container);

          if (prefersReduced()) {
            return;
          }

          await gsap.fromTo(
            next.container,
            { opacity: 0 },
            { opacity: 1, duration: 0.25, ease: 'power2.inOut' }
          );
        },
        afterLeave({ current }: any) {
          destroyPage(current.namespace);
        },
        afterEnter({ next }: any) {
          initPage(next.namespace, next.container);
          initThemeToggle();
          ScrollTrigger.refresh();
        },
      },
    ],
  });
}
