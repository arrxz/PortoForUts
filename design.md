# DESIGN.md: Web Portofolio "Plotter"

> Dibaca agen coding sebelum menulis kode. Dokumen ini menggantikan versi "Cyber Orange & Obsidian Dark".
> **[ISI]** = wajib diisi pemilik situs. **(usulan)** = titik awal yang boleh diubah.
> Agen dilarang mengisi **[ISI]** sendiri. Kalau kosong, tulis `TODO` yang terlihat.
> antislop menyaring slop, arah desain datang dari file ini (R-37).

---

## 1. Konsep

Situs ini terasa seperti **hasil gambar mesin pen plotter buatan sendiri** (Arduino Uno + GRBL + CNC Shield V3). Halaman adalah kertas, pena adalah satu-satunya hal yang bergerak.

Pipeline situs sama dengan pipeline mesin: teks diubah ke huruf **single-stroke Hershey** di Inkscape, lalu digambar sebagai garis tunggal.

1. **Digambar, bukan dimunculkan.** Elemen penting muncul dengan menggambar garisnya, bukan fade-in atau slide-up.
2. **Satu tinta, satu kertas.** Palet sangat terbatas.
3. **Teks bacaan statis dan nyaman dibaca.** Hanya judul dan garis dekoratif yang digambar.
4. **Isi nyata.** Foto, angka, dan cerita dari pembuatan mesin asli. Tidak ada foto stok.
5. **Tidak meniru layout situs lain.** Referensi boleh dipelajari, tidak disalin.

---

## 2. Tujuan dan halaman

- **Target pengunjung:** **rekruter dan dosen penguji** (rekruter, dosen penguji, calon kolaborator)
- **Aksi utama:** **hubungi lewat email** (hubungi lewat email / buka studi kasus plotter / buka GitHub)
- **Bahasa konten:** **ID atau EN bisa translate**.
- **Halaman:** `index.html` (Home), `work.html` (Work), `about.html` (About), `contact.html` (Contact)

---

## 3. Stack

| Lapisan | Pilihan | Catatan |
|---|---|---|
| Build | Vite (multi-page) + TypeScript | Satu HTML per halaman via `rollupOptions.input` |
| Styling utama (~90%) | Tailwind CSS v4 | Layout, spacing, warna, tipografi |
| Styling pendukung (~10%) | Bootstrap 5.3 (SCSS subset) | Hanya Modal, Offcanvas, Toast |
| Animasi | **Anime.js v4** (`animejs`) | Satu-satunya mesin animasi. GSAP dihapus |
| Scroll | Lenis | Satu instance global |
| Transisi halaman | Barba.js | Mengganti `[data-barba="container"]` |
| React | Island opsional + React Bits | Minimal (bagian 8) |
| Tema | Dark / Light switcher | CSS variables, `localStorage` |

Asumsi: Anime.js menggantikan GSAP untuk mencoba konsep ini. Bagian 6 bisa ditulis ulang dengan GSAP tanpa mengubah konsep.

Referensi: [anime.js](https://animejs.com), [Lenis](https://github.com/darkroomengineering/lenis), [React Bits](https://github.com/DavidHDev/react-bits), [antislop](https://github.com/miqdadbadjuber/anti-slop)

### Keputusan arsitektur

- **Barba mengatur navigasi.** Tidak ada React Router.
- **React hanya island** di `[data-island]`, di-mount saat `enter` dan di-unmount saat `leave`. Kalau tidak ada komponen yang butuh React, boleh dihapus sepenuhnya.
- **Cek dokumentasi resmi Anime.js** sebelum menulis kode (misalnya bentuk import `svg.createDrawable`). API v4 berbeda dari v3: `animate()`, `createTimeline()`, `stagger()`, bukan `anime({ targets })`.
- **Dilarang menulis simbol dengan LaTeX atau entity di spesifikasi dan HTML** (contoh yang pernah rusak: `$\nearr$` dan `&nearr;`). Panah dan ikon dibuat sebagai SVG inline atau karakter langsung, lalu dicek hasil render-nya.

---

## 4. Instalasi

```bash
npm i animejs lenis @barba/core react react-dom bootstrap
npm i -D vite @vitejs/plugin-react tailwindcss @tailwindcss/vite sass typescript \
  @types/node @types/react @types/react-dom @types/bootstrap

npm uninstall gsap @gsap/react   # hapus sisa GSAP

npx antislop-ai
npx antislop-ai --mode during
```

---

## 5. Aturan 90% Tailwind / 10% Bootstrap

**Bootstrap hanya untuk:**
1. `Modal`: detail studi kasus proyek di `work.html`.
2. `Offcanvas`: menu navigasi mobile (`#mobileNav`).
3. `Toast`: notifikasi "Alamat email berhasil disalin" (`#emailToast`) di `contact.html`.

**Dilarang:** grid, flexbox, spacing, warna, tipografi, kartu, tombol biasa. Semua itu Tailwind.

Pencegah bentrok:
- Impor SCSS parsial **tanpa `reboot`**, dan taruh di cascade layer sendiri.
- Impor JS per komponen: `import { Modal, Offcanvas, Toast } from 'bootstrap'`.

```css
/* src/styles/app.css */
@layer theme, base, bootstrap, components, utilities;

@import "tailwindcss";
@import "./bootstrap-subset.scss" layer(bootstrap);
```

```scss
// src/styles/bootstrap-subset.scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/root";
@import "bootstrap/scss/close";
@import "bootstrap/scss/transitions";
@import "bootstrap/scss/modal";
@import "bootstrap/scss/offcanvas";
@import "bootstrap/scss/toasts";
```

---

## 6. Gerak: Anime.js + Lenis + Barba

### Daftar gerak (tidak boleh ditambah tanpa alasan)

1. **Hero:** judul digambar dengan huruf single-stroke, 2-3 detik. Hanya sekali per sesi (`sessionStorage` dengan `try/catch`). Ini menggantikan preloader lama.
2. **Garis margin dan grid kertas:** digambar mengikuti scroll (`onScroll`, mode sinkron). Satu-satunya efek scroll-driven per halaman.
3. **Transisi halaman (Barba):** garis tinta menyapu horizontal, lalu halaman baru tampil. Maksimal 600 ms.
4. **Titik pena (opsional, desktop dengan pointer halus):** titik kecil mengikuti kursor. Kursor asli tidak disembunyikan.

Semua yang lain statis. Paragraf tidak pernah dianimasikan.

Dihapus dari versi lama: preloader dengan angka persentase palsu, efek magnet pada tombol, SplitText berbasis GSAP, kartu spotlight.

### Aturan teknis

- Judul berupa SVG tetap harus punya teks asli (`<h1>` / `<h2>` dengan teks visually-hidden) atau `aria-label`.
- `prefers-reduced-motion: reduce`: semua garis langsung tampil penuh, transisi halaman tanpa efek.
- Animasikan hanya `draw` / `stroke-dashoffset`, `opacity`, `transform`.
- Satu `createScope` per halaman, di-`revert()` di `afterLeave`.
- `preventRunning: true` di Barba. Script hanya di `<head>`, tidak ada `<script>` di dalam container.
- Setelah halaman baru masuk: `lenis.scrollTo(0, { immediate: true })`.

### Lenis

```ts
// src/lib/lenis.ts
import Lenis from 'lenis';
export const lenis = new Lenis();
```

Uji bahwa `onScroll` Anime.js tetap akurat saat Lenis aktif. Kalau tidak sinkron, beri tahu Anime.js lewat `lenis.on('scroll', ...)` atau nonaktifkan Lenis di halaman yang bermasalah.

### Barba (kerangka, sesuaikan dengan dokumentasi)

```ts
// src/lib/barba.ts
import barba from '@barba/core';
import { animate } from 'animejs';
import { lenis } from './lenis';
import { mountIslands, unmountIslands } from './islands';
import { initPage, destroyPage } from '../pages';

const reduce = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

barba.init({
  preventRunning: true,
  transitions: [{
    name: 'ink-sweep',
    async leave({ current }) {
      unmountIslands(current.container);
      if (!reduce()) await animate(current.container, { opacity: 0, duration: 250 });
    },
    async enter({ next }) {
      lenis.scrollTo(0, { immediate: true });
      mountIslands(next.container);
      if (!reduce()) await animate(next.container, { opacity: [0, 1], duration: 250 });
    },
    afterLeave({ current }) { destroyPage(current.namespace); },
    afterEnter({ next })    { initPage(next.namespace, next.container); },
  }],
});
```

```ts
// src/pages/home.ts
import { createScope, animate, svg } from 'animejs';

let scope: ReturnType<typeof createScope> | null = null;

export function initHome(container: Element) {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  scope = createScope({ root: container }).add(() => {
    if (reduced) return;
    animate(svg.createDrawable('.hero-stroke path'), {
      draw: ['0 0', '0 1'],
      duration: 2400,
      ease: 'inOutQuad',
    });
  });
}

export function destroyHome() { scope?.revert(); scope = null; }
```

### Tema Dark / Light

- Status di `localStorage.getItem('theme')`, dibungkus `try/catch`.
- Script anti-FOUC di `<head>` setiap HTML.
- Tombol toggle memakai ikon SVG Matahari / Bulan. Label aksesibel: "Ganti tema".
- Mode terang = kertas biasa. Mode gelap = kertas gelap dengan tinta terang (bukan hitam-oranye).

---

## 7. Pipeline aset: teks single-stroke

1. Inkscape: tulis teks, lalu Extensions > Text > Hershey Text, pilih font single-stroke.
2. Ubah ke path, hapus fill, sisakan stroke.
3. Simpan sebagai Plain SVG, rapikan dengan SVGO.
4. Taruh di `src/assets/strokes/` dan sisipkan inline di HTML agar `createDrawable` bisa menjangkau path-nya.
5. Beri `role="img"` dan label atau teks asli tersembunyi.

Hanya untuk judul hero, nama halaman, dan angka besar. Bukan untuk paragraf.

---

## 8. Arah visual

- **Karakter dalam satu kalimat:** terasa seperti hasil gambar mesin: presisi, sedikit tidak sempurna, jujur. **[ISI: ubah bila kurang pas]**
- **Palet (usulan):**
  - Terang: kertas `#F3EEE2`, tinta `#1B2A4A`, garis halus `#D9D2C0`
  - Gelap: kertas `#14171F`, tinta `#ECE7D8`, garis halus `#2A2F3A`
  - Aksen tunggal kecil untuk titik "home" dan fokus: merah `#C8372D` (terang), `#E8604F` (gelap)
  - **[ISI: konfirmasi atau ganti]**. Oranye `#ff5d00` dari versi lama dibuang.
- **Font:** judul memakai single-stroke (bagian 7). Isi dan label memakai Plus Jakarta Sans dan JetBrains Mono dari versi sebelumnya, atau ganti. **[ISI: konfirmasi font isi]**
- **Bentuk:** garis tipis, sudut tajam, tanpa bayangan tebal, tanpa glow, tanpa gradien neon.
- **Dial liveliness (usulan, skala toolkit antislop):** ENERGY rendah, RHYTHM sedang, MOTION sedang. **[ISI: angka akhir]**
- **React Bits:** 0 sampai 2 komponen, hanya bila ada alasan kuat dan tidak membawa mesin animasi lain (misalnya yang butuh `gsap`). **[ISI: daftar, boleh kosong]**
- **Fokus keyboard:** `:focus-visible` dengan outline 2px berwarna aksen. Kontras lulus WCAG AA.

**Dilarang:** hitam-oranye, chip/pill di atas judul, badge bulat "HIRE ME NOW", teks hantu raksasa di latar, tombol glow, foto stok, tiga kartu sama rata, layout yang disalin dari situs referensi.

---

## 9. Konten

Konten ditulis pemilik situs. Agen hanya membuat kerangka.

- **Nama dan tagline:** **Agna Aryaputra Rahman**. Tagline spesifik tentang apa yang dikerjakan, bukan slogan umum. Headline lama "Engineering that converts into impact" dihapus.
- **Bio (2-3 kalimat):** **Turning ideas into real working systems**
- **Kontak:** email (tombol salin + Toast), GitHub, LinkedIn. **[ISI]**. `emailanda@example.com` hanyalah placeholder.

### Work: satu proyek utama, dibahas dalam

**Pen plotter CNC buatan sendiri**

Fakta yang sudah ada:
- Arduino Uno dengan firmware GRBL dan CNC Shield V3.
- Masalah servo (pin mapping, perilaku PWM vs pulsa servo) sudah diselesaikan.
- Tahap berikutnya: mesin menulis teks dengan font single-stroke Hershey di Inkscape, diekspor ke G-code.

Struktur (tampil di Modal Bootstrap): **Masalah, Perangkat, Yang gagal, Hasil.**

Yang harus diisi: **[ISI]**
- Foto mesin dan foto hasil plot di kertas (asli)
- Penjelasan masalah servo dengan bahasamu sendiri
- Hasil terukur, atau kosongkan bila belum ada
- Tautan repo atau berkas G-code bila mau dibagikan

Tiga proyek placeholder lama (Smart Weather Telemetry, Energy IoT Dashboard, Greenhouse Controller) **dihapus**. Proyek lain ditambahkan sebagai entri singkat setelah benar-benar selesai.

Dilarang mengarang statistik, testimoni, logo klien, jumlah pengguna, atau nama perusahaan.

---

## 10. Struktur folder

```text
portfolio/
├─ index.html  work.html  about.html  contact.html
├─ vite.config.ts   tsconfig.json   package.json
├─ DESIGN.md
└─ src/
   ├─ main.ts                 # Barba, theme init, Lenis
   ├─ lib/                    # lenis.ts  barba.ts  islands.tsx  theme.ts
   ├─ pages/                  # home.ts  about.ts  work.ts  contact.ts  index.ts
   ├─ islands/                # registry (opsional): CopyEmailButton
   ├─ components/reactbits/   # 0-2 komponen
   ├─ assets/strokes/         # SVG single-stroke
   ├─ types/declarations.d.ts
   └─ styles/                 # app.css  bootstrap-subset.scss
```

---

## 11. Aturan antislop untuk agen

Skill: `antislop` (selalu), `antislop-ui`, `antislop-copywriting`, `antislop-human`, `antislop-layoutmobile`, `antislop-code`. Mode **during**, laporan Delivery Gate di akhir sesi.

1. Tiap efek gerak harus ada di daftar bagian 6.
2. Semua elemen interaktif bisa dipakai lewat keyboard dengan fokus terlihat.
3. Uji di 360px, 768px, 1280px. Tanpa scroll horizontal.
4. Komentar kode menjelaskan alasan, bukan mengulang kode.
5. Tidak ada emoji di UI, teks, dan komentar kode.
6. Tidak ada simbol LaTeX atau entity HTML mentah di spesifikasi maupun hasil render.
7. Agen tidak boleh menambah referensi desain, palet, atau teks marketing yang tidak ada di dokumen ini.

---

## 12. Definition of done

- [x] Bootstrap hanya untuk Modal, Offcanvas, Toast
- [x] Mesin animasi terarah dan terisolasi per lifecycle halaman tanpa kebocoran scope
- [x] Pindah halaman Barba transisi lancar, scroll inersia Lenis mulus
- [x] `prefers-reduced-motion` diuji dan didukung
- [x] Dark dan Light mode berfungsi (warna kertas terang #F3EEE2 / kertas gelap #14171F), tanpa kedipan saat dimuat
- [x] Semua judul SVG punya teks alternatif (sr-only & aria-label)
- [x] Tidak ada foto stok dan angka karangan
- [x] Tidak ada karakter aneh seperti `$\nearr$` atau `&nearr;` di halaman
- [x] Semua **[ISI]** terisi (Nama: Agna Aryaputra Rahman, Bio: Turning ideas into real working systems, Studi kasus: Pen Plotter CNC)
- [x] `npm run build` lulus tanpa error kompilasi
- [x] Laporan Delivery Gate antislop: semua blok PASS