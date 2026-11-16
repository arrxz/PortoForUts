# Web Portofolio — Paper, Ink & Orange

Website portofolio rekayasa pribadi untuk **Agna Aryaputra Rahman**. Mengusung konsep **editorial visual** dengan tipografi berani, palet kertas hangat & aksen oranye, serta dua fitur interaktif khas: **Lanyard 3D Berfisika (Three.js + Rapier)** dan **Radial Navbar**.

---

## ⚡ Tech Stack & Arsitektur

| Lapisan | Teknologi | Catatan Implementasi |
|---|---|---|
| **Build** | Vite + TypeScript | Target kompilasi ES2020 |
| **Styling Utama (~90%)** | Tailwind CSS v4 | Layout grid asimetris, token warna CSS variables, tipografi editorial |
| **Styling Interaktif (~10%)** | Bootstrap 5.3 (Subset SCSS) | Hanya Modal (detail arsitektur proyek) dan Toast (salin email) |
| **Scroll** | Lenis | Smooth scrolling inersia tersinkronisasi ke ticker GSAP |
| **Animasi & Interaktivitas** | GSAP + ScrollTrigger | Reveal headline berbaris, scrub parallax pada pita kata raksasa, radial nav |
| **Fisika 3D** | Three.js + Rapier3D + MeshLine | Lanyard ID card berfisika di hero (dimuat malas / dynamic import hanya pada desktop) |
| **Aksesibilitas** | WCAG AA Compliant | Kontras teks tinggi, navigasi keyboard penuh, dukungan `prefers-reduced-motion` |

---

## 🎨 Palet Warna (Paper, Ink & Orange)

- **`--paper`**: `#F4EEE2` (Latar kertas utama)
- **`--sand`**: `#E6D5B7` (Kotak foto, panel sekunder)
- **`--ink`**: `#161412` (Teks utama, pita gelap, bingkai)
- **`--ink-soft`**: `#5E574E` (Label teknis & teks sekunder)
- **`--line`**: `rgba(22, 20, 18, 0.18)` (Garis tipis hairline)
- **`--orange`**: `#F54F1B` (Bentuk besar, tombol utama, pita kontak)
- **`--orange-deep`**: `#C2380C` (Teks aksen kecil di atas paper)
- **`--on-ink`**: `#F4EEE2` (Teks di atas pita gelap)

---

## 📁 Struktur Direktori

```text
UTS/
├── index.html                   # Halaman tunggal editorial
├── design.md                    # Dokumen spesifikasi desain
├── README.md                    # Dokumentasi arsitektur proyek
└── src/
    ├── content.ts               # Sumber data tunggal profil & proyek
    ├── main.ts                  # Entry point aplikasi
    ├── radial-nav.ts            # Logika menu radial fixed
    ├── project-modal.ts         # Integrasi modal Bootstrap
    ├── motion/
    │   ├── lenis.ts             # Global instance Lenis scroll
    │   ├── gsap-setup.ts        # Sinkronisasi GSAP & ScrollTrigger
    │   ├── hero.ts              # Entrance timeline hero
    │   ├── band.ts              # Scrub parallax pita kata raksasa
    │   └── reveal.ts            # Reveal efek tile proyek
    ├── lanyard/                 # Simulasi kartu 3D berfisika
    │   ├── index.ts             # Inisialisasi, loop render, observer
    │   ├── physics.ts           # Dunia Rapier, rantai joint, drag
    │   ├── card.ts              # Geometri kartu & klip
    │   ├── strap.ts             # MeshLine kurva tali lanyard
    │   └── textures.ts          # Tekstur canvas 2D kartu & strap
    └── styles/
        ├── app.css              # Tailwind v4, token warna, reset interaksi
        └── bootstrap-subset.scss# Parsial SCSS Bootstrap
```

---

## 🚀 Menjalankan Proyek

```bash
# Instalasi dependensi
npm install

# Server pengembangan
npm run dev

# Kompilasi build produksi
npm run build

# Preview build produksi
npm run preview
```
