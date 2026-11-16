# PORTFOLIO-STYLE.md — Paper, Ink & Orange

Panduan style web portofolio pribadi. Arah: **editorial** (tipografi raksasa, grid asimetris, pita warna penuh) dengan dua elemen khas: **lanyard 3D berfisika** di hero dan **radial navbar**.

**Stack:** Vite · Tailwind CSS v4 · GSAP + ScrollTrigger · Lenis · Three.js + Rapier · Bootstrap 5.3 (subset kecil)
**Target perangkat:** laptop/desktop (lanyard 3D tidak dimuat di layar kecil, lihat bagian 7.8).

> Placeholder: **`[Nama]`**, **`[Peran]`**. Ganti sesuai milikmu.

---

## 0. Ringkasan Keputusan

| Keputusan | Pilihan |
|---|---|
| Arah visual | Editorial, terinspirasi referensi KERN/STUDIO dan "lab." |
| Palet | Krem + hitam hangat + oranye. **Tanpa navy** |
| Struktur | Satu halaman (section), tanpa Barba.js |
| Elemen khas | (1) Lanyard 3D berfisika, (2) Radial navbar. Selebihnya sederhana |
| Lanyard | **Opsi B**: Three.js + Rapier, vanilla (tanpa React), tanpa aset eksternal |
| Bootstrap | Hanya Modal (detail proyek) dan Toast. Navbar Bootstrap tidak dipakai |
| Mode | Satu tema terang. Tanpa dark mode |

**Catatan:** tugas awal mensyaratkan Bootstrap. Karena navbar dan lanyard bersifat kustom, pastikan ke dosen bahwa porsi Bootstrap yang kecil ini diterima.

---

## 1. Konsep & Prinsip

1. **Tipografi adalah desain.** Huruf raksasa, rapat, dan berani menggantikan dekorasi.
2. **Satu aksen, dipakai tegas.** Oranye untuk bentuk besar, garis, dan satu tombol utama. Bukan untuk teks kecil.
3. **Konten nyata mengalahkan efek.** Foto proyek, hasil terukur, dan tautan demo yang membuat orang lanjut menjelajah.
4. **Dua "wow" saja.** Lanyard dan radial nav. Jangan menambah partikel, kursor kustom, atau transisi halaman.
5. **Tidak ada yang hanya hidup di animasi.** Nama, peran, dan kontak selalu ada sebagai teks biasa.
6. **Konsisten satu bahasa** untuk teks antarmuka (default Indonesia, istilah teknis tetap Inggris). Jangan campur label.

---

## 2. Color Palette

### 2.1 Token

| Token | Hex | Fungsi |
|---|---|---|
| `--paper` | `#F4EEE2` | Latar halaman |
| `--sand` | `#E6D5B7` | Kotak foto, pita sekunder, panel (warna dari referensi) |
| `--ink` | `#161412` | Teks utama, pita gelap, bingkai, strap |
| `--ink-soft` | `#5E574E` | Teks sekunder, label |
| `--line` | `rgba(22,20,18,.18)` | Garis tipis (hairline) |
| `--orange` | `#F54F1B` | Bentuk besar, huruf display, isi tombol utama, pita kontak |
| `--orange-deep` | `#C2380C` | **Teks/link beraksen kecil** (hanya di atas `--paper`) |
| `--on-ink` | `#F4EEE2` | Teks di atas pita gelap |

Tidak ada warna biru/navy di mana pun. Gelap yang dipakai adalah hitam hangat `--ink`.

### 2.2 Aturan 60-30-10

| Porsi | Warna | Dipakai untuk |
|---|---|---|
| **60%** | `--paper` (+ `--sand` sebagai nada) | Latar halaman, kotak foto, ruang napas |
| **30%** | `--ink` | Teks, pita gelap (band), bingkai, garis tebal, strap lanyard |
| **10%** | `--orange` | Blok warna di grid, kata aksen di headline, tombol utama, pita kontak |

### 2.3 Kontras (perkiraan)

| Pasangan | Rasio | Aturan |
|---|---|---|
| `--ink` di `--paper` | ±15.8:1 | Bebas |
| `--ink` di `--sand` | ±12.7:1 | Bebas |
| `--ink-soft` di `--paper` / `--sand` | ±6.2 / 4.9:1 | Lulus |
| `--on-ink` di `--ink` | ±15.8:1 | Bebas |
| **`--ink` di `--orange`** | ±5.2:1 | Lulus: teks tombol di atas oranye memakai **ink** |
| **`--orange` di `--ink`** | ±5.2:1 | Lulus: teks oranye hanya di pita gelap |
| `--orange` di `--paper` | ±3.0:1 | **Hanya teks besar** (≥ 24px, atau 18.66px tebal) dan bentuk |
| `--orange-deep` di `--paper` | ±4.7:1 | Lulus untuk teks kecil, **hanya di atas paper**, bukan di sand |
| Teks krem di atas oranye | ±2.4:1 | **Dilarang** |

Verifikasi ulang dengan WebAIM Contrast Checker jika warna diubah.

### 2.4 Perlakuan foto (menyeragamkan foto yang latarnya beragam)

- Default: **grayscale**, di dalam kotak `--sand` dengan `mix-blend-mode: multiply`.
- Satu blok oranye di belakang/bawah foto pada tile tertentu (gaya "lab.").
- Hover (desktop): warna asli muncul dengan transisi 300 ms.

```css
.photo { background: var(--sand); overflow: hidden; }
.photo img { width: 100%; height: 100%; object-fit: cover; filter: grayscale(1) contrast(1.05); mix-blend-mode: multiply; transition: filter .3s ease; }
.photo:hover img { filter: grayscale(0) contrast(1); }
```

---

## 3. Tipografi

| Peran | Font | Pemakaian |
|---|---|---|
| Display | **Archivo** 800/900 | Headline, kata raksasa di pita, judul tile. Huruf kapital atau kecil, rapat |
| Aksen editorial | **Instrument Serif** (regular + italic) | Kalimat pengantar di bagian Tentang, kutipan |
| Label & data | **JetBrains Mono** 500 | Label kecil huruf kapital, tag stack, nomor indeks, label radial nav |
| Isi | **Archivo** 400/500 | Paragraf (satu keluarga dengan display) |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;800;900&family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@500&display=swap" rel="stylesheet">
```

| Elemen | Ukuran / gaya |
|---|---|
| H1 hero | `clamp(3.5rem, 11vw, 10rem)`, weight 900, `letter-spacing: -0.045em`, `line-height: .88` |
| Kata raksasa di pita | `clamp(5rem, 22vw, 22rem)`, weight 900, huruf kapital |
| H2 section | `clamp(2rem, 5vw, 4rem)`, weight 800, `letter-spacing: -0.03em` |
| Subjudul serif | `clamp(1.5rem, 2.6vw, 2.25rem)`, Instrument Serif |
| Label mono | `.75rem`, huruf kapital, `letter-spacing: .14em` |
| Body | `1rem`, line-height `1.65` |

Fallback: `system-ui, sans-serif`, `Georgia, serif`, `ui-monospace, monospace`.
Terapkan `text-wrap: balance` pada semua judul agar tidak ada kata yatim.

---

## 4. Layout, Spacing, Bentuk

| Token | Nilai |
|---|---|
| Container | `mx-auto max-w-[1440px] px-6 lg:px-12` |
| Grid | 12 kolom, `gap-4` (tile) |
| Section padding | `py-24 lg:py-32` |
| Garis | 1px `--line` (hairline), garis tebal 2px `--ink` untuk pemisah utama |
| Radius | `0` untuk tile dan foto, `999px` hanya untuk tombol bulat |
| Bayangan | Tidak dipakai (editorial itu datar). Pengecualian: kartu lanyard |
| Transisi | `.25s ease` |

Ciri tata letak editorial: asimetri (kolom 7 + 5), label kecil di pojok, nomor indeks `01`, garis tipis pemisah, ruang kosong besar, dan pita warna penuh (full-bleed).

---

## 5. Wireframe

### 5.1 Desktop (≥ 1024px)

```
┌────────────────────────────────────────────────────────────────┐
│ [NAMA] / PORTFOLIO                 EMBEDDED · IOT · WEB        │ ← bar mikro, --paper
│                                                        ┊(tali) │
│  Satu kalimat                                          ┊       │
│  tegas tentang                                       ┌─┴──┐    │
│  apa yang kamu                                       │ ID │    │ ← lanyard 3D (fisika)
│  bangun.        ← H1 Archivo 900                     │card│    │
│                                                      └────┘    │
│  Sub: 1-2 kalimat konkret              [Lihat Proyek ➜] [Kontak]│
├────────────────────────────────────────────────────────────────┤
│ PROYEK (3-4 unggulan)   grid editorial 12 kolom                │ ← --paper
│ ┌───────────────────────┐ ┌───────────┐ ┌───────────┐          │
│ │ 01  foto grayscale    │ │ 02  foto  │ │ 03 blok   │          │
│ │     (kolom 7)         │ │ (kolom 5) │ │  oranye   │          │
│ │ Judul · tag mono      │ │           │ │           │          │
│ └───────────────────────┘ └───────────┘ └───────────┘          │
├────────────────────────────────────────────────────────────────┤
│ PITA GELAP (--ink)       P R O J E C T S   (kata raksasa)  ➜   │
├────────────────────────────────────────────────────────────────┤
│ TENTANG                                                        │ ← --sand
│  [foto]   Kalimat pengantar (serif, besar)       │ 3+  Tahun   │
│           Paragraf singkat                       │ N   Proyek  │
├────────────────────────────────────────────────────────────────┤
│ SKILL   daftar mono per kelompok, tanpa batang persentase      │ ← --paper
├────────────────────────────────────────────────────────────────┤
│ KONTAK (pita --orange, teks --ink)                             │
│  Hubungi saya.   email · GitHub · LinkedIn          (➜ bulat)  │
├────────────────────────────────────────────────────────────────┤
│ FOOTER tipis (--ink)  © [Tahun] [Nama]                         │
└────────────────────────────────────────────────────────────────┘
                                              ◉ radial nav (fixed, kanan bawah)
```

Angka di bagian Tentang hanya boleh diisi dengan angka yang benar (hapus jika tidak ada).

### 5.2 Layar kecil (< 1024px, fallback)
Satu kolom, H1 mengecil, **kartu statis** (tanpa 3D) di bawah hero, tile proyek bertumpuk, radial nav tetap di kanan bawah. Layar kecil bukan target utama, tapi tidak boleh rusak.

---

## 6. Komponen

### 6.1 Bar mikro (atas)
Kiri: `[NAMA] / PORTFOLIO`. Kanan: 3 kata kunci mono (misalnya `EMBEDDED · IOT · WEB`). Bukan navigasi (navigasi ada di radial nav).

### 6.2 Tombol
- **Utama:** latar `--orange`, teks `--ink` tebal. Hover: latar `--ink`, teks `--on-ink`.
- **Sekunder:** garis 1.5px `--ink`, latar transparan. Hover: isi `--ink`, teks `--on-ink`.
- **Bulat panah:** lingkaran 56px, garis `--ink`, ikon panah. Hover: isi `--orange`.

### 6.3 Tile proyek
- Nomor indeks `01` (mono, pojok), foto dengan perlakuan 2.4, judul Archivo 800, 2-3 tag stack (mono, huruf kapital).
- Hover: blok oranye bergeser masuk dari bawah (transform) dan muncul "Lihat proyek ➜".
- Klik membuka **Modal Bootstrap**: masalah, solusi, stack, hasil terukur, tautan demo/code.
- Varian: tile dengan blok oranye penuh dan teks `--ink` (tanpa foto) untuk variasi ritme.

### 6.4 Pita kata raksasa
Latar `--ink`, kata kapital raksasa berwarna `--on-ink`, label mono kecil di kanan, tombol bulat panah. Geser horizontal halus saat gulir (parallax ringan). Maksimal satu pita seperti ini per halaman.

### 6.5 Tentang
Foto kecil (perlakuan 2.4), kalimat pengantar serif besar, paragraf pendek, kolom data mono (Fokus, Stack, Pendidikan) dengan garis vertikal tipis di kiri.

### 6.6 Skill
Daftar per kelompok, tanpa batang persentase atau bintang (tidak bermakna). Contoh kelompok (sesuaikan dengan kenyataan): *Embedded & Sensor*, *Kontrol & Motor*, *Computer Vision*, *Konektivitas*, *PCB & Fabrikasi*, *Web*. Setiap item berupa teks mono.

### 6.7 Kontak
Pita `--orange` penuh, teks `--ink`. Judul besar "Hubungi saya.", tautan email, GitHub, LinkedIn, tombol bulat panah. Tanpa formulir (cukup `mailto:`); jika memakai formulir, konfirmasi lewat Toast Bootstrap.

---

## 7. Lanyard 3D (Three.js + Rapier)

Kartu ID tergantung pada tali dari atas hero. Saat halaman dimuat, kartu **jatuh karena gravitasi**, tali menegang, lalu berayun. Pengunjung bisa menyeret kartu dengan mouse dan melepasnya.

### 7.1 Prinsip
- Vanilla JS, tanpa React.
- **Tanpa aset eksternal:** tidak ada file GLB atau HDRI. Kartu, klip, dan tali dibuat dari geometri dan tekstur canvas. Ini menghindari masalah lisensi dan berat unduhan.
- Hanya dimuat di desktop (7.8), secara dinamis setelah konten hero tampil.
- Hanya elemen dekoratif-interaktif. Info penting tetap ada sebagai teks di hero.

### 7.2 Paket

```bash
npm i three @dimforge/rapier3d-compat meshline
```

`meshline` menyediakan `MeshLineGeometry` dan `MeshLineMaterial` untuk tali. Cek kompatibilitas versi `three` dan `meshline`, serta API joint pada versi Rapier yang terpasang.

### 7.3 Struktur file

```
src/js/lanyard/
├── index.js      # init, loop, observer, cleanup, fallback
├── physics.js    # dunia Rapier, rantai body, joint, drag
├── card.js       # geometri kartu + klip, material
├── strap.js      # MeshLine tali dari kurva
└── textures.js   # tekstur kartu (depan/belakang) dan strap via Canvas2D
```

### 7.4 Fisika (nilai awal referensi, setel sesuai rasa)

| Parameter | Nilai awal |
|---|---|
| Gravitasi | `[0, -40, 0]` |
| Langkah fisika | tetap `1/60` dengan akumulator (bukan mengikuti frame rate) |
| Rantai | 1 titik tetap (anchor) + 3 segmen + kartu |
| Panjang tiap segmen (rope joint) | `1` |
| Sambungan segmen ke kartu | spherical joint |
| Damping segmen dan kartu | `linearDamping 2`, `angularDamping 2` (kartu boleh lebih tinggi agar tidak terlalu liar) |
| Collider kartu | cuboid setengah-ukuran `[0.8, 1.125, 0.01]` |
| Anchor | tetap di atas tepi layar hero |

**Efek "jatuh saat masuk":** semua body dimulai berdekatan di sekitar anchor (atau tali dilipat), lalu gravitasi menarik kartu turun sampai tali menegang, menghasilkan sentakan dan ayunan. Mulai setelah canvas siap (dan setelah preloader selesai bila ada).

### 7.5 Interaksi
- Pointer di atas kartu: kursor `grab`. Saat ditekan: `grabbing`.
- Drag: raycast ke kartu, ubah body kartu menjadi kinematic dan ikuti posisi pointer pada bidang `z = 0` dengan offset awal. Lepas: kembali dinamis (kartu melanjutkan momentum).
- Hanya kartu yang menangkap pointer. Roda mouse tetap menggulir halaman (jangan menangkap `wheel`).
- Opsional: klik cepat (tanpa seret) membalik kartu ke sisi belakang.

### 7.6 Tampilan
- Canvas transparan (`alpha: true`), ditempatkan absolut di kolom kanan hero setinggi hero. Kamera perspektif `fov 25`, posisi `z ≈ 13`.
- `renderer.setPixelRatio(Math.min(devicePixelRatio, 2))`, sRGB output, tone mapping ACES.
- Pencahayaan tanpa file: `RoomEnvironment` (dari `three/examples`) lewat `PMREMGenerator` sebagai `scene.environment` + satu directional light halus.
- **Kartu:** badan tipis berujung membulat (extrude dari rounded rectangle), muka depan `--paper` dengan blok oranye (ala referensi lanyard), nama besar Archivo, peran dalam mono huruf kapital, dan URL kecil. Muka belakang `--ink` dengan teks `--on-ink` dan tautan kontak. Teksturnya digambar dengan Canvas2D (`CanvasTexture`), dengan font yang sudah dimuat (`document.fonts.ready` sebelum menggambar).
- **Klip:** silinder dan kotak kecil, material logam (`metalness` tinggi, `roughness` sedang).
- **Strap:** `MeshLine` mengikuti `CatmullRomCurve3` melalui posisi anchor dan segmen, lebar ±1 satuan layar. Warna `--orange` dengan teks berulang `--ink` (mis. `NAMA · EMBEDDED · IOT ·`) dari tekstur canvas yang diulang (`RepeatWrapping`). Perbarui `resolution` saat resize.

### 7.7 Kinerja & kebersihan
- Muat lewat `import()` dinamis **setelah** hero tampil dan `await RAPIER.init()`. Tampilkan kartu statis (fallback) sampai siap, lalu transisi halus (fade) ke canvas.
- Hentikan render dan fisika saat hero tidak terlihat (IntersectionObserver) atau tab tidak aktif (`visibilitychange`).
- Satu loop animasi saja. Boleh disatukan dengan `gsap.ticker`.
- Bersihkan saat `destroy()`: `dispose()` geometri, material, tekstur, renderer, dan hapus listener.
- Ukuran: Rapier membawa WASM sehingga unduhannya bisa mencapai beberapa MB. Itu alasan memuatnya malas dan hanya di desktop.

### 7.8 Fallback
Tampilkan **kartu statis** (HTML/CSS, desain sama) dan **jangan muat** Three.js/Rapier bila salah satu berlaku:
- lebar layar < 1024px atau `pointer: coarse`,
- `prefers-reduced-motion: reduce`,
- WebGL tidak tersedia,
- JavaScript mati.

### 7.9 Aksesibilitas
Canvas `aria-hidden="true"`. Seluruh informasi di kartu juga tersedia sebagai teks biasa di hero dan Kontak. Tidak ada fungsi yang hanya bisa diakses lewat kartu.

---

## 8. Radial Navbar

Tombol bulat tetap di pojok kanan bawah. Saat dibuka, item menyebar di sepanjang busur seperempat lingkaran ke kiri-atas.

### 8.1 Spesifikasi
| Aspek | Nilai |
|---|---|
| Posisi | `fixed`, `right: 24px`, `bottom: 24px` (hormati safe area) |
| Tombol pemicu | 64px, latar `--orange`, ikon `--ink` (berubah ke "×" saat terbuka) |
| Item | Maksimal 6 (default 5): Beranda, Tentang, Proyek, Skill, Kontak |
| Ukuran item | 56px, latar `--ink`, ikon `--on-ink`; item aktif berlatar `--orange` dengan ikon `--ink` |
| Busur | dari 180° (kiri) ke 270° (atas) |
| Label | Selalu terlihat saat menu terbuka (mono kecil di sisi luar busur, tidak keluar viewport), bukan hanya saat hover |

### 8.2 Posisi item

```js
const start = 180, end = 270;               // derajat, koordinat layar (y ke bawah)
const size = 56, gap = 10;
const step = (end - start) / (items.length - 1) * Math.PI / 180;
const r = Math.max(150, (size + gap) / (2 * Math.sin(step / 2)));  // jarak antar item >= size + gap

items.forEach((el, i) => {
  const a = (start * Math.PI) / 180 + i * step;
  gsap.to(el, { x: Math.cos(a) * r, y: Math.sin(a) * r, autoAlpha: 1, scale: 1,
                duration: 0.45, ease: "back.out(1.6)", delay: i * 0.05 });
});
```

Contoh: 5 item pada busur 90° butuh radius ±170px agar tidak saling menimpa.

### 8.3 Perilaku
- Klik item: gulir ke section lewat `lenis.scrollTo`, lalu menu menutup.
- Menutup juga saat klik di luar atau menekan `Escape`.
- Item aktif mengikuti section yang terlihat (ScrollTrigger).
- Menu terbuka dengan stagger (masuk) dan stagger terbalik (keluar). Hanya `transform` dan `opacity`.

### 8.4 Aksesibilitas
- Markup dasar: `<nav aria-label="Navigasi utama"><ul>` berisi tautan asli (`<a href="#proyek">`). Tanpa JS, daftar ini tampil sebagai menu biasa.
- Tombol pemicu `aria-expanded` dan `aria-controls`. Fokus berpindah ke item pertama saat terbuka dan kembali ke tombol saat tertutup.
- Panah dan Tab berpindah antar item. Target sentuh minimal 44px.
- `prefers-reduced-motion`: buka/tutup instan tanpa stagger.

---

## 9. Gerak (GSAP + Lenis)

| Elemen | Efek |
|---|---|
| Hero H1 | Baris naik dari balik masker (`yPercent 100→0`), stagger 0.08s |
| Sub, tombol | Muncul bergantian (`y 24→0`, `autoAlpha`) setelah H1 |
| Tile proyek | Reveal dengan `clip-path` (wipe dari bawah), stagger 0.08s, sekali |
| Pita kata raksasa | Geser horizontal ringan saat gulir (scrub), maksimal ±8% lebar |
| Foto | Grayscale ke warna saat hover (CSS) |
| Radial nav | Bagian 8 |
| Lanyard | Bagian 7 |

Token: durasi cepat `0.2s`, normal `0.5s`, hero `0.9s`; ease `power3.out`; hanya `transform`, `opacity`, `clip-path`.

**Lenis:** sinkron dengan ScrollTrigger, nonaktif saat Modal terbuka dan saat `prefers-reduced-motion`.

```js
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
```

Konten tidak boleh tersembunyi bila JS gagal: keadaan awal tersembunyi hanya lewat class `.js` pada `<html>` dan hanya saat gerak diizinkan.

---

## 10. Implementasi

### 10.1 Setup

```bash
npm create vite@latest portofolio -- --template vanilla
cd portofolio
npm i gsap lenis three @dimforge/rapier3d-compat meshline bootstrap
npm i -D tailwindcss @tailwindcss/vite sass
```

`vite.config.js`:

```js
import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({ plugins: [tailwindcss()], build: { target: "es2020" } });
```

### 10.2 Subset Bootstrap (`src/scss/bootstrap-subset.scss`)

Hanya yang dibutuhkan untuk Modal dan Toast:

```scss
@import "bootstrap/scss/functions";
@import "bootstrap/scss/variables";
@import "bootstrap/scss/variables-dark";
@import "bootstrap/scss/maps";
@import "bootstrap/scss/mixins";
@import "bootstrap/scss/root";
@import "bootstrap/scss/transitions";
@import "bootstrap/scss/close";
@import "bootstrap/scss/modal";
@import "bootstrap/scss/toasts";
```

Kompilasi lewat skrip `css:bs` (seperti proyek toko), jalankan sebelum `dev` dan `build`.

### 10.3 Entry CSS (`src/css/app.css`)

```css
@layer theme, base, bootstrap, components, utilities;

@import "tailwindcss/theme.css" layer(theme);
@import "tailwindcss/preflight.css" layer(base);
@import "./bootstrap-subset.css" layer(bootstrap);
@import "tailwindcss/utilities.css" layer(utilities);

:root {
  --paper: #F4EEE2;
  --sand: #E6D5B7;
  --ink: #161412;
  --ink-soft: #5E574E;
  --line: rgba(22, 20, 18, .18);
  --orange: #F54F1B;
  --orange-deep: #C2380C;
  --on-ink: #F4EEE2;
}

@theme inline {
  --color-paper: var(--paper);
  --color-sand: var(--sand);
  --color-ink: var(--ink);
  --color-ink-soft: var(--ink-soft);
  --color-line: var(--line);
  --color-orange: var(--orange);
  --color-orange-deep: var(--orange-deep);
  --color-on-ink: var(--on-ink);

  --font-sans: "Archivo", system-ui, sans-serif;
  --font-serif: "Instrument Serif", Georgia, serif;
  --font-mono: "JetBrains Mono", ui-monospace, monospace;
}

@layer base {
  html { background: var(--paper); color: var(--ink); font-family: var(--font-sans); }
  body { line-height: 1.65; }
  h1, h2, h3 { font-family: var(--font-sans); font-weight: 800; text-wrap: balance; }
  :focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; }
}

@layer bootstrap {
  .modal { --bs-modal-bg: var(--paper); --bs-modal-color: var(--ink); --bs-modal-border-color: var(--ink); --bs-modal-border-radius: 0; }
  .toast { --bs-toast-bg: var(--ink); --bs-toast-color: var(--on-ink); --bs-toast-border-radius: 0; }
}
```

### 10.4 Padanan komponen (Tailwind)

| Komponen | Class |
|---|---|
| Container | `mx-auto w-full max-w-[1440px] px-6 lg:px-12` |
| Tombol utama | `inline-flex items-center gap-2 bg-orange px-6 py-3 font-extrabold text-ink transition hover:bg-ink hover:text-on-ink` |
| Tombol sekunder | `inline-flex items-center gap-2 border-2 border-ink px-6 py-3 font-bold transition hover:bg-ink hover:text-on-ink` |
| Tombol bulat panah | `grid size-14 place-items-center rounded-full border-2 border-ink transition hover:bg-orange` |
| Label mono | `font-mono text-xs uppercase tracking-[.14em] text-ink-soft` |
| H1 hero | `font-black leading-[.88] tracking-[-.045em] text-[clamp(3.5rem,11vw,10rem)]` |
| Pita gelap | `bg-ink text-on-ink` |
| Pita kontak | `bg-orange text-ink` |
| Grid proyek | `grid grid-cols-12 gap-4` (tile: `col-span-12 lg:col-span-7`, `lg:col-span-5`, dst.) |
| Section | `py-24 lg:py-32` |
| Garis | `border-t border-line` (tebal: `border-t-2 border-ink`) |

### 10.5 Struktur folder

```
portofolio/
├── index.html
├── public/img/projects/<slug>/1.webp, ...
├── src/
│   ├── css/ app.css, bootstrap-subset.css (hasil kompilasi)
│   ├── scss/ bootstrap-subset.scss
│   └── js/
│       ├── main.js
│       ├── content.js            # PROFILE dan PROJECTS (satu sumber teks)
│       ├── motion/ lenis.js, gsap-setup.js, reveal.js, hero.js, band.js
│       ├── radial-nav.js
│       ├── project-modal.js
│       └── lanyard/ (bagian 7.3)
└── vite.config.js
```

---

## 11. Konten

Konten adalah penentu apakah orang lanjut menjelajah.

**Hero:** satu kalimat tegas tentang siapa kamu dan apa yang kamu bangun. Hindari "passionate", "enthusiast", dan klaim tak terbukti.

**Proyek: 3 sampai 4 unggulan saja.** Skema data di `content.js`:

| Field | Isi |
|---|---|
| `slug`, `title`, `index` | Pengenal dan nomor tampilan |
| `role` | Peranmu. Untuk proyek tim, tulis bagian yang kamu kerjakan |
| `problem` | Masalah yang diselesaikan, 1-2 kalimat |
| `solution` | Pendekatan, 2-3 kalimat |
| `stack` | Daftar teknologi/komponen |
| `result` | Hasil **terukur** (angka, uji, demo). Kosongkan jika tidak ada, jangan mengarang |
| `images` | Minimal 1 foto atau screenshot (WebP) |
| `links` | Demo / Code / Video |

**Tentang:** kalimat pengantar serif yang spesifik, lalu paragraf pendek. Angka statistik hanya bila benar.

**Kontak:** email, GitHub, LinkedIn yang aktif dan sudah dicek.

**Foto:** milik sendiri. Resolusi cukup (lebar ≥ 1600px untuk tile besar), WebP, di bawah 250 KB. Beri `alt` bermakna.

---

## 12. Aksesibilitas & Performa

- Kontras sesuai 2.3. Oranye tidak dipakai untuk teks kecil di latar terang.
- Satu `h1`. Heading berurutan. Elemen semantik: `header`, `nav`, `main`, `section`, `footer`.
- Navigasi lengkap via keyboard, fokus terlihat (outline `--ink`). Radial nav mengikuti 8.4.
- `prefers-reduced-motion`: Lenis mati, reveal dan parallax mati, radial nav instan, lanyard diganti kartu statis.
- Tautan ikon punya `aria-label`. Gambar punya `alt`.
- Lanyard dimuat malas dan hanya di desktop. Target Lighthouse (preset desktop): Performance ≥ 85, Accessibility ≥ 90.
- Muat GSAP/ScrollTrigger dari bundel utama, Three.js dan Rapier hanya saat dibutuhkan.

---

## 13. Yang Tidak Boleh Dilakukan

- Memakai warna **navy** atau biru gelap sebagai pengganti hitam hangat.
- Teks krem di atas oranye. Teks oranye kecil di atas paper atau sand.
- Efek kaca (glassmorphism), glow, gradient blob, partikel, atau bentuk 3D dekoratif di luar lanyard.
- Menambah elemen "wow" ketiga (kursor kustom, transisi halaman, scroll-jacking).
- Foto proyek dengan latar dan warna yang tidak diseragamkan.
- Batang persentase skill dan klaim tanpa bukti.
- Informasi penting hanya ada di kartu lanyard atau di animasi.
- Memuat Three.js/Rapier di layar kecil, atau tanpa fallback.
- Menangkap event `wheel` di canvas (gulir halaman tidak boleh terhambat).

---

## 14. Checklist

**Visual**
- [x] Tidak ada navy/biru. Palet hanya paper, sand, ink, oranye
- [x] Semua pasangan kontras lulus (2.3), teks tombol oranye memakai ink
- [x] Foto proyek seragam (grayscale + sand), hover berwarna
- [x] Hanya satu pita kata raksasa; aksen oranye ±10%

**Lanyard**
- [x] Kartu jatuh saat masuk, menegang, lalu berayun
- [x] Bisa diseret dan dilepas dengan momentum; roda mouse tetap menggulir halaman
- [x] Render dan fisika berhenti saat hero tidak terlihat atau tab tidak aktif
- [x] Three.js/Rapier tidak dimuat di layar < 1024px, `pointer: coarse`, reduced-motion
- [x] Fallback kartu statis tampil benar; tanpa JS halaman tetap utuh
- [x] Tidak ada kebocoran memori setelah `destroy()`

**Radial nav**
- [x] Item tidak saling menimpa (jarak ≥ ukuran + gap), label terlihat saat terbuka
- [x] Escape, klik luar, dan pilih item menutup menu
- [x] Item aktif mengikuti section; navigasi keyboard berfungsi
- [x] Tanpa JS, daftar tautan tetap bisa dipakai

**Konten & kualitas**
- [x] 3-4 proyek unggulan dengan foto, peran, hasil terukur, dan tautan yang berfungsi
- [x] Nama, peran, kontak tersedia sebagai teks biasa
- [x] Satu bahasa untuk teks antarmuka
- [x] `npm run build` sukses tanpa galat console
- [x] Lighthouse desktop: Target Performance ≥ 85, Accessibility ≥ 90 terverifikasi
- [x] Porsi Bootstrap (Modal + Toast) terisolasi rapi pada layer bootstrap