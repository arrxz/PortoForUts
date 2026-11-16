import './styles/bootstrap-subset.scss';
import './styles/app.css';
import { lenis } from './motion/lenis';
import { initHeroMotion } from './motion/hero';
import { initBandMotion } from './motion/band';
import { initReveals } from './motion/reveal';
import { initRadialNav } from './radial-nav';
import { initProjectModal } from './project-modal';
import { Toast } from 'bootstrap';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Inisialisasi Gerak Utama (GSAP + ScrollTrigger + Lenis)
  initHeroMotion();
  initBandMotion();
  initReveals();
  initRadialNav();
  initProjectModal();

  // 2. Dynamic Import Lanyard 3D (Desktop Only, Lazy Load, Section 7.7)
  const lanyardContainer = document.getElementById('lanyard-canvas-container');
  if (lanyardContainer && window.innerWidth >= 1024 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    import('./lanyard').then(({ initLanyard }) => {
      initLanyard(lanyardContainer);
    });
  }

  // 3. Salin Email & Bootstrap Toast
  const copyBtn = document.getElementById('btn-copy-email');
  const emailToastEl = document.getElementById('emailToast');
  if (copyBtn && emailToastEl) {
    const toast = Toast.getOrCreateInstance(emailToastEl, { delay: 3000 });
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.getAttribute('data-email') || 'arrxz.dev@gmail.com';
      try {
        await navigator.clipboard.writeText(email);
        toast.show();
      } catch (err) {
        console.error('Gagal menyalin email', err);
      }
    });
  }

  // 4. Smooth scroll on regular in-page links
  document.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (href && href !== '#' && href.length > 1) {
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          lenis.scrollTo(target as HTMLElement, { offset: -20, duration: 1.1 });
        }
      }
    });
  });

  // 5. Update tahun dinamis di footer
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
});
