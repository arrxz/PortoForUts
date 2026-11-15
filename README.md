# Web Portofolio "Plotter" — Agna Aryaputra Rahman

Website portofolio rekayasa perangkat keras dan sistem tertanam (*embedded systems*). Didesain dengan estetika **pen plotter CNC buatan sendiri**: presisi, garis tunggal (*single-stroke*), minim dekorasi berlebihan, dan berlandaskan dokumentasi riil tanpa klaim fiktif.

---

## Arsitektur & Teknologi

| Lapisan | Pilihan | Keterangan |
|---|---|---|
| **Build & Bundler** | Vite (Multi-page) + TypeScript | Satu file HTML mandiri per halaman (`rollupOptions.input`) |
| **Styling Utama (~90%)** | Tailwind CSS v4 | Layout grid, spacing, tipografi, dan token tema CSS variables |
| **Styling Interaktif (~10%)** | Bootstrap 5.3 (SCSS Subset) | Hanya Modal, Offcanvas, dan Toast (tanpa reboot) |
| **Scroll** | Lenis | Instance global tersinkronisasi |
| **Animasi** | GSAP (Single-stroke stroke animation) | Penggambaran garis vektor judul hero dan scroll ruler line |
| **Transisi Halaman** | Barba.js Core | Navigasi SPA mulus antar halaman tanpa reload penuh |
| **Tema** | Dark & Light Switcher | Kertas terang (`#F3EEE2`) / Kertas gelap (`#14171F`) tersimpan di `localStorage` |

---

## Halaman Situs

1. **`index.html` (Home)**: Kanvas plotter dengan animasi penggambaran garis single-stroke, status mesin GRBL, dan ringkasan rekayasa.
2. **`work.html` (Work)**: Studi kasus mendalam **Pen Plotter CNC Buatan Sendiri (Arduino Uno + GRBL + CNC Shield V3)** dengan dialog modal Bootstrap (Masalah, Perangkat, Yang Gagal, Hasil).
3. **`about.html` (About)**: Profil teknik, prinsip kerja rekayasa, dan lingkup keahlian nyata.
4. **`contact.html` (Contact)**: Kanal komunikasi, tombol salin email instan dengan notifikasi Toast Bootstrap, dan tautan repositori GitHub.

---

## Panduan Menjalankan Proyek

```bash
# Instalasi dependensi
npm install

# Mode pengembangan
npm run dev

# Kompilasi build produksi
npm run build

# Preview build produksi
npm run preview
```

---

## Repositori GitHub

- URL: [https://github.com/arrxz/PortoForUts](https://github.com/arrxz/PortoForUts)
- Pemilik: Agna Aryaputra Rahman (`arrxz`)
