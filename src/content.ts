export interface Project {
  slug: string;
  index: string;
  title: string;
  role: string;
  problem: string;
  solution: string;
  stack: string[];
  result: string;
  image: string;
  links: { label: string; url: string }[];
}

export const PROFILE = {
  name: 'Agna Aryaputra Rahman',
  initials: 'AAR',
  tagline: 'Merancang dan membangun perangkat keras tertanam, otomasi CNC, dan sistem web presisi.',
  subline: 'Fokus pada integrasi mikrokontroler, kalibrasi mekanik, dan rekayasa antarmuka web tanpa dependensi yang berlebihan.',
  keywords: ['EMBEDDED', 'CNC AUTOMATION', 'WEB'],
  email: 'arrxz.dev@gmail.com',
  github: 'https://github.com/arrxz',
  linkedin: 'https://linkedin.com/in/arrxz',
  location: 'Indonesia',
};

export const PROJECTS: Project[] = [
  {
    slug: 'pen-plotter-cnc',
    index: '01',
    title: 'Pen Plotter CNC 2-Axis (Arduino + GRBL)',
    role: 'Perancang Perangkat Keras & Firmware',
    problem: 'Firmware GRBL bawaan ditujukan untuk motor spindle mesin bor, bukan untuk pulsa PWM periode 20ms penggerak motor servo RC pena naik-turun.',
    solution: 'Merakit rangka profil aluminium dan akrilik, menghubungkan CNC Shield V3 ke Arduino Uno, dan memetakan ulang sinyal PWM ke pin D11 dengan konfigurasi firmware kustom.',
    stack: ['Arduino Uno', 'CNC Shield V3', 'GRBL v1.1', 'NEMA 17', 'SG90 Servo'],
    result: 'Penggambaran kurva vektor 2D dan penulisan huruf single-stroke Hershey stabil tanpa getaran pena pada media kertas.',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=900&auto=format&fit=crop&q=80',
    links: [
      { label: 'Repositori GitHub', url: 'https://github.com/arrxz/PortoForUts' },
    ],
  },
  {
    slug: 'smart-weather-telemetry',
    index: '02',
    title: 'Stasiun Telemetri Cuaca Hemat Daya',
    role: 'Pengembang Sistem Tertanam & Sensor',
    problem: 'Pemantauan mikroklimat mandiri membutuhkan transmisi nirkabel berdaya sangat rendah dengan ketahanan terhadap interupsi jaringan.',
    solution: 'Mengimplementasikan mikrokontroler ESP32 dengan sensor lingkungan BME280, memanfaatkan mode deep-sleep dan protokol MQTT berbobot ringan.',
    stack: ['ESP32', 'BME280', 'MQTT', 'C++', 'FreeRTOS'],
    result: 'Konsumsi arus mode tidur terukur stabil di bawah 15 mikroampere dengan transmisi data berkala setiap interval 60 detik.',
    image: 'https://images.unsplash.com/photo-1558346490-a72e53ae2d4f?w=900&auto=format&fit=crop&q=80',
    links: [
      { label: 'Lihat Kode Sensor', url: 'https://github.com/arrxz' },
    ],
  },
  {
    slug: 'industrial-iot-dashboard',
    index: '03',
    title: 'Dashboard Telemetri Web Real-Time',
    role: 'Frontend & Web Architecture',
    problem: 'Menampilkan arus data telemetri multi-sensor secara langsung tanpa menyebabkan stutter pada thread utama peramban.',
    solution: 'Merancang antarmuka web berbasis Tailwind CSS dan koneksi WebSocket asinkron dengan rendering grafik berbasis canvas.',
    stack: ['TypeScript', 'Tailwind CSS v4', 'WebSocket', 'Canvas API', 'Vite'],
    result: 'Grafik telemetri mempertahankan kecepatan render 60 FPS dengan latensi pembaruan data di bawah 100 milidetik.',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=900&auto=format&fit=crop&q=80',
    links: [
      { label: 'Lihat Demo Repositori', url: 'https://github.com/arrxz' },
    ],
  },
];

export const ABOUT = {
  quote: 'Saya meyakini bahwa rekayasa terbaik lahir saat konsep perangkat lunak bertemu langsung dengan presisi mekanik dan fisika perangkat keras.',
  paragraphs: [
    'Saya adalah mahasiswa Teknik Informatika yang mengeksplorasi jembatan antara mikrokontroler fisik dan aplikasi web modern. Mulai dari perakitan rangka mekanik plotter, pemetaan pulsa PWM servo, hingga pengoptimalan antarmuka web performa tinggi.',
    'Pendekatan kerja saya selalu berakar pada bukti terukur: kode yang bersih, minim kebergantungan yang tidak perlu, dan fungsionalitas yang teruji secara nyata.',
  ],
  details: [
    { label: 'STATUS AKADEMIK', value: 'Teknik Informatika (Semester 3)' },
    { label: 'FOKUS RISET', value: 'Embedded Hardware & CNC Automation' },
    { label: 'LOKASI', value: 'Indonesia' },
  ],
};

export const SKILL_GROUPS = [
  {
    name: 'Embedded & Sensor',
    skills: ['Arduino Uno', 'ESP32', 'BME280', 'I2C / SPI / UART', 'ADC Telemetry'],
  },
  {
    name: 'Kontrol & Mekanik',
    skills: ['NEMA 17 Stepper', 'A4988 Driver', 'SG90 Micro Servo', 'GT2 Timing Belt'],
  },
  {
    name: 'Firmware & Bahasa',
    skills: ['C', 'C++', 'Python', 'TypeScript', 'FreeRTOS'],
  },
  {
    name: 'Otomasi & CNC',
    skills: ['GRBL v1.1 Custom', 'G-code Streamer', 'Hershey Single-Stroke Toolpath'],
  },
  {
    name: 'Rekayasa Web',
    skills: ['HTML5 Semantik', 'Tailwind CSS v4', 'Vite Bundler', 'GSAP Motion'],
  },
];
