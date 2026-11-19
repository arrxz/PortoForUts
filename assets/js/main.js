const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
gsap.registerPlugin(ScrollTrigger);

// Smooth scroll, driven by GSAP's ticker so ScrollTrigger stays in sync.
const lenis = reduceMotion ? null : new Lenis({ lerp: 0.1 });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

const panel = document.querySelector('.transition-panel');
gsap.set(panel, { y: 0, yPercent: 100 });

// Wrap each letter in .char (words kept unbreakable in .word); nested tags like <em> survive.
function splitChars(el) {
  const heading = el.closest('h1, h2');
  if (heading && !heading.hasAttribute('aria-label')) heading.setAttribute('aria-label', heading.textContent.trim().replace(/\s+/g, ' '));
  const walk = (node) => {
    [...node.childNodes].forEach((n) => {
      if (n.nodeType === Node.ELEMENT_NODE) return walk(n);
      if (n.nodeType !== Node.TEXT_NODE) return;
      const frag = document.createDocumentFragment();
      n.textContent.split(/(\s+)/).forEach((part) => {
        if (!part) return;
        if (/^\s+$/.test(part)) return frag.append(part);
        const word = document.createElement('span');
        word.className = 'word';
        word.setAttribute('aria-hidden', 'true');
        [...part].forEach((c) => {
          const ch = document.createElement('span');
          ch.className = 'char';
          ch.textContent = c;
          word.append(ch);
        });
        frag.append(word);
      });
      n.replaceWith(frag);
    });
  };
  walk(el);
  return el.querySelectorAll('.char');
}

// Card entrance: the card "opens" upward from its bottom edge while rising.
const CARD_HIDDEN = { clipPath: 'inset(100% 0% 0% 0% round 1.5rem)', y: 70 };
const CARD_SHOWN = { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)', y: 0, duration: 1.15, ease: 'expo.out', clearProps: 'clipPath,transform' };

// `start` = seconds to wait before playing, so hidden states can be set while a cover (loader/panel) is still up.
function initPage(scope, start = 0) {
  return gsap.context(() => {
    if (reduceMotion) return;

    // Cards already on screen play right away (in order); the rest wait for scroll.
    const inView = (el) => el.getBoundingClientRect().top < innerHeight * 0.95;
    const cards = gsap.utils.toArray('.bento');
    gsap.set(cards, CARD_HIDDEN);
    gsap.to(cards.filter(inView), { ...CARD_SHOWN, stagger: 0.09, delay: start });
    const later = cards.filter((el) => !inView(el));
    if (later.length) ScrollTrigger.batch(later, { start: 'top 95%', once: true, onEnter: (els) => gsap.to(els, { ...CARD_SHOWN, stagger: 0.09 }) });

    // Headline: letters tip up from below the mask, one after another.
    scope.querySelectorAll('.line-mask > span').forEach((line, i) => {
      gsap.from(splitChars(line), {
        yPercent: 120, rotationX: -60, opacity: 0, transformPerspective: 1200, transformOrigin: '50% 100%',
        duration: 1.2, ease: 'expo.out', stagger: 0.035, delay: start + 0.35 + i * 0.12,
      });
    });

    // Cards: reveal in small staggered batches as they enter the viewport.
    // Smaller bits inside cards (subtitle, email, lists) fade up after their card.
    const bits = gsap.utils.toArray('[data-reveal]').filter((el) => !el.classList.contains('bento') && !el.querySelector('.bento'));
    const BIT_SHOWN = { y: 0, opacity: 1, duration: 0.9, ease: 'expo.out', stagger: 0.08 };
    gsap.set(bits, { y: 24, opacity: 0 });
    gsap.to(bits.filter(inView), { ...BIT_SHOWN, delay: start + 0.45 });
    const laterBits = bits.filter((el) => !inView(el));
    if (laterBits.length) ScrollTrigger.batch(laterBits, { start: 'top 95%', once: true, onEnter: (els) => gsap.to(els, { ...BIT_SHOWN, delay: 0.3 }) });

    // Orbs pop in, then drift slowly.
    gsap.utils.toArray('[data-float]').forEach((el, i) => {
      gsap.from(el, { scale: 0, duration: 1.1, ease: 'back.out(1.6)', delay: start + 0.6 + i * 0.06 });
      gsap.to(el, {
        y: 'random(-14, 14)', rotation: 'random(-6, 6)',
        duration: 'random(3.5, 6)', ease: 'sine.inOut', yoyo: true, repeat: -1,
      });
    });

    // svgOrigin = circle centre in viewBox units; default origin is the text's bbox, which wobbles.
    gsap.to('[data-spin]', { rotation: 360, svgOrigin: '60 60', duration: 14, ease: 'none', repeat: -1 });
  }, scope);
}

function setActiveNav(namespace) {
  document.documentElement.classList.toggle('page-home', namespace === 'home');
  document.querySelectorAll('[data-nav]').forEach((a) => {
    if (a.dataset.nav === namespace) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

// Menu (Bootstrap offcanvas): pause smooth scroll while open, close on navigation.
const menuEl = document.getElementById('menu');
menuEl.addEventListener('show.bs.offcanvas', () => {
  lenis?.stop();
  document.documentElement.classList.add('menu-seen');
  try { localStorage.setItem('menu-seen', '1'); } catch {}
});

// Draw the eye to the menu once per visitor: ping dot (CSS) + a single wiggle.
let menuSeen = false;
try { menuSeen = localStorage.getItem('menu-seen') === '1'; } catch {}
if (menuSeen) document.documentElement.classList.add('menu-seen');
menuEl.addEventListener('hidden.bs.offcanvas', () => lenis?.start());
menuEl.querySelectorAll('a').forEach((a) =>
  a.addEventListener('click', () => bootstrap.Offcanvas.getInstance(menuEl)?.hide())
);

const firstContainer = document.querySelector('[data-barba="container"]');
let ctx = null;
setActiveNav(firstContainer.dataset.barbaNamespace);

// First load: count 0→100 (never finishing before window load), then lift the loader.
function runLoader() {
  const loader = document.querySelector('.loader');
  if (reduceMotion) { loader.remove(); return Promise.resolve(); }
  lenis?.stop();
  const bounce = gsap.to('.loader-orbs > span', { y: -28, duration: 0.35, ease: 'power1.out', yoyo: true, repeat: -1, stagger: 0.12 });
  const progress = { v: 0 };
  gsap.set('.loader-bar', { scaleX: 0, transformOrigin: 'left center' });
  const counting = gsap.to(progress, {
    v: 100, duration: 1.6, ease: 'power2.inOut',
    onUpdate: () => {
      loader.querySelector('.loader-count').textContent = Math.round(progress.v);
      gsap.set('.loader-bar', { scaleX: progress.v / 100 });
    },
  });
  const loaded = document.readyState === 'complete' ? Promise.resolve() : new Promise((r) => addEventListener('load', r, { once: true }));
  return Promise.all([counting, loaded])
    .then(() => {
      ctx = initPage(firstContainer, 0.45);
      gsap.fromTo('header, footer', CARD_HIDDEN, { ...CARD_SHOWN, stagger: 0.1, delay: 0.4 });
      return gsap.to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' });
    })
    .then(() => { bounce.kill(); loader.remove(); lenis?.start(); });
}

runLoader().then(() => {
  if (reduceMotion) ctx = initPage(firstContainer);
  if (!menuSeen && !reduceMotion) {
    gsap.fromTo('.menu-btn', { rotation: 0 }, { rotation: -5, duration: 0.1, yoyo: true, repeat: 5, delay: 1.5, ease: 'power1.inOut', clearProps: 'transform' });
  }
});

// Page change: orange panel rises showing the destination's name, then lifts off.
const pageLabels = { 'index.html': 'BERANDA', '': 'BERANDA', 'work.html': 'KARYA', 'contact.html': 'KONTAK' };
let dotsBounce = null;

barba.init({
  preventRunning: true,
  transitions: [{
    name: 'panel-wipe',
    leave({ current, next }) {
      if (reduceMotion) return;
      const file = next.url.path.split('/').pop();
      panel.querySelector('.panel-label').textContent = pageLabels[file] ?? '';
      dotsBounce = gsap.to('.panel-dots i', { y: -14, duration: 0.3, ease: 'power1.out', yoyo: true, repeat: -1, stagger: 0.1 });
      // Old cards fold away upward (reverse of their entrance) before the panel covers the screen.
      const oldCards = current.container.querySelectorAll('.bento');
      return gsap.timeline()
        .fromTo(oldCards,
          { clipPath: 'inset(0% 0% 0% 0% round 1.5rem)' },
          { clipPath: 'inset(0% 0% 100% 0% round 1.5rem)', y: -40, duration: 0.5, ease: 'power3.in', stagger: 0.04, overwrite: true })
        .to(panel, { yPercent: 0, duration: 0.6, ease: 'power3.inOut' }, '-=0.2')
        .fromTo('.panel-label', { yPercent: 110 }, { yPercent: 0, duration: 0.5, ease: 'power4.out' }, '-=0.15');
    },
    enter() {
      window.scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true, force: true });
      if (reduceMotion) return;
      return gsap.timeline({ delay: 0.25 })
        .to('.panel-label', { yPercent: -110, duration: 0.4, ease: 'power3.in' })
        .to(panel, { yPercent: -100, duration: 0.6, ease: 'power3.inOut' }, '-=0.1')
        .add(() => { dotsBounce?.kill(); gsap.set('.panel-dots i', { y: 0 }); gsap.set(panel, { yPercent: 100 }); });
    },
  }],
});

// New container is in the DOM but still under the panel: set hidden states now, play as the panel lifts (~0.6s).
barba.hooks.beforeEnter(({ current, next }) => {
  // Barba only removes the old container after `enter`; hide it now or it shows under the lifting panel.
  // !important: Tailwind runs with important:true, so the container's `grid`/`flex` class would beat a plain inline style.
  current.container.style.setProperty('display', 'none', 'important');
  ctx?.revert();
  setActiveNav(next.namespace);
  window.scrollTo(0, 0); lenis?.scrollTo(0, { immediate: true, force: true });
  ctx = initPage(next.container, 0.6);
});

barba.hooks.after(() => ScrollTrigger.refresh());
