/**
 * ==========================================================================
 * Theme Management Module — Light / Dark Mode Toggle
 * ==========================================================================
 */

export function getInitialTheme(): 'dark' | 'light' {
  const saved = localStorage.getItem('theme');
  if (saved === 'dark' || saved === 'light') {
    return saved;
  }
  return 'dark'; // Default Dark Theme
}

export function applyTheme(theme: 'dark' | 'light') {
  const root = document.documentElement;
  if (theme === 'light') {
    root.classList.add('light');
    root.classList.remove('dark');
    root.setAttribute('data-theme', 'light');
    root.setAttribute('data-bs-theme', 'light');
  } else {
    root.classList.remove('light');
    root.classList.add('dark');
    root.setAttribute('data-theme', 'dark');
    root.setAttribute('data-bs-theme', 'dark');
  }
  localStorage.setItem('theme', theme);
  updateToggleButtons(theme);
}

export function toggleTheme() {
  const isLight = document.documentElement.classList.contains('light');
  const nextTheme = isLight ? 'dark' : 'light';
  applyTheme(nextTheme);
}

export function updateToggleButtons(theme: 'dark' | 'light') {
  document.querySelectorAll<HTMLElement>('.theme-toggle-btn').forEach((btn) => {
    const iconSun = btn.querySelector('.theme-icon-sun');
    const iconMoon = btn.querySelector('.theme-icon-moon');
    const labelText = btn.querySelector('.theme-label-text');

    if (theme === 'light') {
      iconSun?.classList.add('hidden');
      iconMoon?.classList.remove('hidden');
      if (labelText) labelText.textContent = 'Gelap';
      btn.setAttribute('aria-label', 'Beralih ke tema gelap');
      btn.setAttribute('title', 'Beralih ke tema gelap');
    } else {
      iconSun?.classList.remove('hidden');
      iconMoon?.classList.add('hidden');
      if (labelText) labelText.textContent = 'Terang';
      btn.setAttribute('aria-label', 'Beralih ke tema terang');
      btn.setAttribute('title', 'Beralih ke tema terang');
    }
  });
}

export function initThemeToggle() {
  // Pasang listener pada semua tombol toggle tema
  document.querySelectorAll('.theme-toggle-btn').forEach((btn) => {
    btn.removeEventListener('click', toggleTheme);
    btn.addEventListener('click', toggleTheme);
  });

  const currentTheme = getInitialTheme();
  updateToggleButtons(currentTheme);
}
