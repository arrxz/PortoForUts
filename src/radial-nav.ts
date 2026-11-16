import { gsap, ScrollTrigger } from './motion/gsap-setup';
import { lenis } from './motion/lenis';

export function initRadialNav() {
  const navContainer = document.getElementById('radial-nav');
  const triggerBtn = document.getElementById('radial-nav-trigger');
  const navList = document.getElementById('radial-nav-list');
  const items = Array.from(document.querySelectorAll<HTMLElement>('.radial-item'));
  const triggerIcon = triggerBtn?.querySelector('.trigger-icon');

  if (!navContainer || !triggerBtn || !navList || items.length === 0) {
    return;
  }

  const btn = triggerBtn;
  const list = navList;

  let isOpen = false;
  const isReduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Arc configuration from Section 8.2
  const startDeg = 180;
  const endDeg = 270;
  const itemSize = 56;
  const gap = 12;
  const count = items.length;
  const stepRad = ((endDeg - startDeg) / (count - 1)) * (Math.PI / 180);
  const radius = Math.max(160, (itemSize + gap) / (2 * Math.sin(stepRad / 2)));

  function openMenu() {
    isOpen = true;
    btn.setAttribute('aria-expanded', 'true');
    list.classList.remove('pointer-events-none');
    list.classList.add('pointer-events-auto');

    if (triggerIcon) {
      gsap.to(triggerIcon, { rotation: 45, duration: 0.25, ease: 'power2.out' });
    }

    if (isReduced()) {
      items.forEach((el, i) => {
        const a = (startDeg * Math.PI) / 180 + i * stepRad;
        gsap.set(el, {
          x: Math.cos(a) * radius,
          y: Math.sin(a) * radius,
          autoAlpha: 1,
          scale: 1,
        });
      });
    } else {
      items.forEach((el, i) => {
        const a = (startDeg * Math.PI) / 180 + i * stepRad;
        gsap.to(el, {
          x: Math.cos(a) * radius,
          y: Math.sin(a) * radius,
          autoAlpha: 1,
          scale: 1,
          duration: 0.4,
          ease: 'back.out(1.6)',
          delay: i * 0.04,
        });
      });
    }

    // Set focus to the first item for keyboard accessibility (R-32)
    const firstLink = items[0]?.querySelector('a');
    firstLink?.focus();
  }

  function closeMenu() {
    isOpen = false;
    btn.setAttribute('aria-expanded', 'false');
    list.classList.add('pointer-events-none');
    list.classList.remove('pointer-events-auto');

    if (triggerIcon) {
      gsap.to(triggerIcon, { rotation: 0, duration: 0.25, ease: 'power2.out' });
    }

    if (isReduced()) {
      items.forEach((el) => {
        gsap.set(el, { x: 0, y: 0, autoAlpha: 0, scale: 0.5 });
      });
    } else {
      items.forEach((el, i) => {
        gsap.to(el, {
          x: 0,
          y: 0,
          autoAlpha: 0,
          scale: 0.5,
          duration: 0.25,
          ease: 'power2.in',
          delay: (count - 1 - i) * 0.02,
        });
      });
    }
  }

  // Toggle button click
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    if (isOpen) {
      closeMenu();
      btn.focus();
    } else {
      openMenu();
    }
  });

  // Link click: smooth scroll & close
  items.forEach((item) => {
    const link = item.querySelector<HTMLAnchorElement>('a');
    if (!link) return;

    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      if (targetId && targetId.startsWith('#')) {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          lenis.scrollTo(targetEl as HTMLElement, {
            offset: -30,
            duration: 1.2,
          });
        }
      }
      closeMenu();
      btn.focus();
    });
  });

  // Close on outside click
  document.addEventListener('click', (e) => {
    if (isOpen && !navContainer.contains(e.target as Node)) {
      closeMenu();
    }
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (isOpen && e.key === 'Escape') {
      closeMenu();
      btn.focus();
    }
  });

  // ScrollTrigger to highlight active section in radial nav
  const sections = ['#hero', '#proyek', '#tentang', '#skill', '#kontak'];
  sections.forEach((secId) => {
    const secEl = document.querySelector(secId);
    if (!secEl) return;

    ScrollTrigger.create({
      trigger: secEl,
      start: 'top 50%',
      end: 'bottom 50%',
      onEnter: () => setActiveNav(secId),
      onEnterBack: () => setActiveNav(secId),
    });
  });

  function setActiveNav(targetHref: string) {
    items.forEach((item) => {
      const link = item.querySelector<HTMLAnchorElement>('a');
      const href = link?.getAttribute('href');
      if (href === targetHref) {
        item.classList.add('is-active');
        item.classList.remove('bg-ink', 'text-on-ink');
        item.classList.add('bg-orange', 'text-ink');
      } else {
        item.classList.remove('is-active', 'bg-orange', 'text-ink');
        item.classList.add('bg-ink', 'text-on-ink');
      }
    });
  }
}
