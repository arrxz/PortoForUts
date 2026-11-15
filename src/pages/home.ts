import { gsap, mm } from '../lib/gsap';

let ctx: gsap.Context | null = null;

export function initHome(container: HTMLElement) {
  ctx = gsap.context(() => {
    mm.add('(prefers-reduced-motion: no-preference)', () => {
      let alreadyDrawn = false;
      try {
        alreadyDrawn = Boolean(sessionStorage.getItem('plotter_hero_drawn'));
      } catch {
        alreadyDrawn = false;
      }

      const strokePaths = container.querySelectorAll<SVGPathElement>('.hero-stroke path, path.single-stroke-path');

      if (!alreadyDrawn && strokePaths.length > 0) {
        // Hitung panjang path dan set strokeDashoffset
        strokePaths.forEach((path) => {
          const length = path.getTotalLength ? path.getTotalLength() : 300;
          path.style.strokeDasharray = `${length}`;
          path.style.strokeDashoffset = `${length}`;
        });

        // Animasikan penggambaran garis single-stroke (2.2 detik)
        gsap.to(strokePaths, {
          strokeDashoffset: 0,
          duration: 2.2,
          ease: 'power2.inOut',
          stagger: 0.15,
          onComplete: () => {
            try {
              sessionStorage.setItem('plotter_hero_drawn', '1');
            } catch {
              // noop
            }
          },
        });
      } else {
        // Tampilkan langsung jika sudah pernah digambar dalam sesi ini
        strokePaths.forEach((path) => {
          path.style.strokeDashoffset = '0';
        });
      }

      // Garis margin atau ruler dekoratif yang digambar saat scroll
      container.querySelectorAll<SVGLineElement>('.scroll-ruler-line').forEach((line) => {
        gsap.from(line, {
          scrollTrigger: {
            trigger: line,
            start: 'top 90%',
            end: 'top 50%',
            scrub: true,
          },
          scaleX: 0,
          transformOrigin: 'left center',
          ease: 'none',
        });
      });
    });
  }, container);
}

export function destroyHome() {
  ctx?.revert();
  ctx = null;
}
