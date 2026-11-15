import './styles/bootstrap-subset.scss';
import './styles/app.css';
import { lenis } from './lib/lenis';
import { mountIslands } from './lib/islands';
import { initBarba } from './lib/barba';
import { initPage } from './pages';
import { initThemeToggle, applyTheme, getInitialTheme } from './lib/theme';
import { Offcanvas } from 'bootstrap';

// Terapkan tema sesegera mungkin
applyTheme(getInitialTheme());

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();

  const container = document.querySelector<HTMLElement>('[data-barba="container"]');
  if (container) {
    mountIslands(container);
    initPage(container.dataset.barbaNamespace || 'home', container);
  }

  initBarba();

  // Setup Bootstrap Offcanvas mobile menu auto-close
  const mobileNav = document.getElementById('mobileNav');
  if (mobileNav) {
    const offcanvas = Offcanvas.getOrCreateInstance(mobileNav);
    mobileNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        offcanvas.hide();
      });
    });
  }

  // Back to top button (minimal technical pointer)
  const backToTopBtn = document.getElementById('btn-back-to-top');
  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      if (scrollPos > 300) {
        backToTopBtn.classList.remove('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.add('opacity-100', 'pointer-events-auto', 'translate-y-0');
      } else {
        backToTopBtn.classList.add('opacity-0', 'pointer-events-none', 'translate-y-4');
        backToTopBtn.classList.remove('opacity-100', 'pointer-events-auto', 'translate-y-0');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      lenis.scrollTo(0, { duration: 0.8 });
    });
  }

  // Dynamic current year
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear().toString();
  }
});
