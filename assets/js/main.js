/**
 * ==========================================================================
 * Main JavaScript File — Dark Tech Portfolio
 * Tech Stack: Barba.js + Lenis + GSAP (ScrollTrigger) + React Bits (Vanilla) + Bootstrap
 * ==========================================================================
 */

let lenisInstance = null;

// ==========================================================================
// 1. LENIS SMOOTH SCROLL + GSAP INTEGRATION
// ==========================================================================
function initLenis() {
  if (typeof Lenis === "undefined") return;

  // Hancurkan instance lama jika ada (saat transisi Barba)
  if (lenisInstance) {
    lenisInstance.destroy();
  }

  lenisInstance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
  });

  // Sinkronisasi Lenis dengan GSAP ScrollTrigger
  if (typeof ScrollTrigger !== "undefined") {
    lenisInstance.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisInstance.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);
  }

  // Smooth scroll untuk link anchor (#hash)
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          e.preventDefault();
          lenisInstance.scrollTo(targetElement, { offset: -80 });
        }
      }
    });
  });
}

// ==========================================================================
// 2. REACT BITS — SPOTLIGHT CARD
// Efek glow radial yang mengikuti koordinat kursor mouse
// ==========================================================================
function initReactBitsSpotlight() {
  const cards = document.querySelectorAll(".spotlight-card");

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });
}

// ==========================================================================
// 3. REACT BITS — MAGNET BUTTON (GSAP Elastic)
// Tombol yang tertarik mengikuti arah kursor mouse
// ==========================================================================
function initReactBitsMagnet() {
  const magnetButtons = document.querySelectorAll(".magnet-btn");

  magnetButtons.forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - (rect.left + rect.width / 2);
      const y = e.clientY - (rect.top + rect.height / 2);

      gsap.to(btn, {
        x: x * 0.35,
        y: y * 0.35,
        duration: 0.3,
        ease: "power2.out",
      });
    });

    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.7,
        ease: "elastic.out(1, 0.3)",
      });
    });
  });
}

// ==========================================================================
// 4. REACT BITS — DECRYPTED TEXT (Hacker / Cyber Scramble Text)
// Mengacak teks sebelum mengunci ke huruf aslinya
// ==========================================================================
function initReactBitsDecryptedText() {
  const decryptElements = document.querySelectorAll("[data-decrypt-text]");
  const chars = "!@#$%^&*()_+-=~[]{}|;:,.<>?/0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  decryptElements.forEach((el) => {
    const originalText = el.getAttribute("data-decrypt-text") || el.innerText;
    let iteration = 0;
    let interval = null;

    function runDecryption() {
      clearInterval(interval);
      iteration = 0;

      interval = setInterval(() => {
        el.innerText = originalText
          .split("")
          .map((letter, index) => {
            if (index < iteration) {
              return originalText[index];
            }
            if (letter === " ") return " ";
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join("");

        if (iteration >= originalText.length) {
          clearInterval(interval);
        }

        iteration += 1 / 2;
      }, 30);
    }

    runDecryption();

    // Trigger ulang saat hover jika disukai
    el.addEventListener("mouseenter", () => {
      if (iteration >= originalText.length) {
        runDecryption();
      }
    });
  });
}

// ==========================================================================
// 5. GSAP SCROLLTRIGGER & ENTRANCE ANIMATIONS
// ==========================================================================
function initGSAPAnimations(container = document) {
  if (typeof gsap === "undefined" || typeof ScrollTrigger === "undefined") return;

  gsap.registerPlugin(ScrollTrigger);

  // Bersihkan trigger lama untuk container baru
  ScrollTrigger.getAll().forEach((st) => st.kill());

  // 5.1 Hero Section Entrance Timeline
  const heroBadge = container.querySelector(".hero-badge");
  const heroTitle = container.querySelector(".hero-title");
  const heroSubtitle = container.querySelector(".hero-subtitle");
  const heroDesc = container.querySelector(".hero-desc");
  const heroButtons = container.querySelector(".hero-buttons");
  const heroVisual = container.querySelector(".hero-visual");

  if (heroTitle) {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    if (heroBadge) tl.from(heroBadge, { opacity: 0, y: 15, duration: 0.6 });
    tl.from(heroTitle, { opacity: 0, y: 25, duration: 0.7 }, "-=0.4");
    if (heroSubtitle) tl.from(heroSubtitle, { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");
    if (heroDesc) tl.from(heroDesc, { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");
    if (heroButtons) tl.from(heroButtons, { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");
    if (heroVisual) tl.from(heroVisual, { opacity: 0, scale: 0.95, duration: 0.8 }, "-=0.6");
  }

  // 5.2 Section Titles Reveal
  container.querySelectorAll(".gsap-reveal-title").forEach((title) => {
    gsap.from(title, {
      scrollTrigger: {
        trigger: title,
        start: "top 85%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 30,
      duration: 0.8,
      ease: "power2.out",
    });
  });

  // 5.3 Project Cards Stagger
  const projectCards = container.querySelectorAll(".spotlight-card");
  if (projectCards.length > 0) {
    gsap.from(projectCards, {
      scrollTrigger: {
        trigger: projectCards[0].parentElement,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 40,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }

  // 5.4 Skills Groups Stagger
  const skillGroups = container.querySelectorAll(".skill-group-card");
  if (skillGroups.length > 0) {
    gsap.from(skillGroups, {
      scrollTrigger: {
        trigger: skillGroups[0].parentElement,
        start: "top 80%",
        toggleActions: "play none none none",
      },
      opacity: 0,
      y: 35,
      duration: 0.8,
      stagger: 0.15,
      ease: "power3.out",
    });
  }

  // Refresh ScrollTrigger setelah layout settle
  ScrollTrigger.refresh();
}

// ==========================================================================
// 6. UI UTILITIES (Back to Top, Mobile Menu, Form, Year)
// ==========================================================================
function initUIUtilities(container = document) {
  // 6.1 Tahun Dinamis
  const yearElement = container.querySelector("#current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // 6.2 Tombol Back to Top dengan Lenis
  const backToTopBtn = document.getElementById("btn-back-to-top");
  if (backToTopBtn) {
    window.addEventListener("scroll", () => {
      const scrollPos = window.scrollY || document.documentElement.scrollTop;
      if (scrollPos > 300) {
        backToTopBtn.classList.remove("opacity-0", "pointer-events-none", "translate-y-4");
        backToTopBtn.classList.add("opacity-100", "pointer-events-auto", "translate-y-0");
      } else {
        backToTopBtn.classList.add("opacity-0", "pointer-events-none", "translate-y-4");
        backToTopBtn.classList.remove("opacity-100", "pointer-events-auto", "translate-y-0");
      }
    });

    backToTopBtn.addEventListener("click", () => {
      if (lenisInstance) {
        lenisInstance.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }

  // 6.3 Tutup Otomatis Navbar Mobile (Bootstrap 10%)
  const navLinks = document.querySelectorAll("#nav .nav-link-custom");
  const navCollapse = document.getElementById("nav");
  if (navCollapse && window.bootstrap) {
    const bsCollapse = bootstrap.Collapse.getOrCreateInstance(navCollapse, { toggle: false });
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        if (window.innerWidth < 992 && navCollapse.classList.contains("show")) {
          bsCollapse.hide();
        }
      });
    });
  }

  // 6.4 Validasi Form Kontak (Bootstrap 10%)
  const contactForm = container.querySelector("#contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      if (!contactForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault();
        alert("Pesan Anda telah berhasil dikirim! Terima kasih telah menghubungi.");
        contactForm.reset();
        contactForm.classList.remove("was-validated");
        return;
      }
      contactForm.classList.add("was-validated");
    });
  }
}

// Inisialisasi Seluruh Modul pada Container Aktif
function initAllModules(container = document) {
  initLenis();
  initReactBitsSpotlight();
  initReactBitsMagnet();
  initReactBitsDecryptedText();
  initGSAPAnimations(container);
  initUIUtilities(container);
}

// ==========================================================================
// 7. BARBA.JS PAGE TRANSITIONS
// Perpindahan halaman mulus dengan tirai animasi GSAP
// ==========================================================================
function initBarba() {
  if (typeof barba === "undefined") {
    // Fallback jika Barba CDN tidak aktif
    initAllModules();
    return;
  }

  const curtain = document.querySelector(".transition-curtain");

  barba.init({
    sync: true,
    transitions: [
      {
        name: "curtain-transition",
        async leave(data) {
          // Tirai naik dari bawah ke atas menutup layar
          return gsap.to(curtain, {
            scaleY: 1,
            transformOrigin: "bottom center",
            duration: 0.5,
            ease: "power3.inOut",
          });
        },
        async enter(data) {
          // Scroll kembali ke atas dengan Lenis
          if (lenisInstance) {
            lenisInstance.scrollTo(0, { immediate: true });
          } else {
            window.scrollTo(0, 0);
          }

          // Inisialisasi ulang semua efek GSAP, React Bits, dan Lenis untuk container baru
          initAllModules(data.next.container);

          // Tirai ditarik ke atas menghilang
          return gsap.to(curtain, {
            scaleY: 0,
            transformOrigin: "top center",
            duration: 0.6,
            ease: "power3.inOut",
            delay: 0.1,
          });
        },
      },
    ],
  });
}

// ==========================================================================
// DOM READY EXECUTION
// ==========================================================================
document.addEventListener("DOMContentLoaded", () => {
  initAllModules();
  initBarba();
});
