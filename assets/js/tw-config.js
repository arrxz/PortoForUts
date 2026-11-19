tailwind.config = {
  // Bootstrap supplies reboot + .container; avoid clashing with Tailwind's versions.
  corePlugins: { preflight: false, container: false },
  // Bootstrap utilities (px-5, gap-3, border...) are !important; match it so Tailwind wins on name clashes.
  // Side effect: don't put Tailwind transform classes on GSAP-animated elements.
  important: true,
  theme: {
    extend: {
      // Hex mirrors of the :root tokens in style.css — Tailwind needs raw values for opacity modifiers (text-ink/10).
      colors: {
        paper: '#F4EEE2',
        sand: '#E6D5B7',
        ink: '#161412',
        'ink-soft': '#5E574E',
        line: 'rgba(22, 20, 18, 0.18)',
        orange: '#F54F1B',
        'orange-deep': '#C2380C',
        'on-ink': '#F4EEE2',
        violet: '#6C4CF5',
        'violet-deep': '#4B2FD1',
        butter: '#F7C948',
      },
      fontFamily: {
        sans: ['"Inter Tight"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
};
