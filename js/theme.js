/**
 * theme.js — Dark / light mode manager.
 *
 * On load, applies data-theme="dark" to <html> if:
 *   1. localStorage["theme"] === "dark", OR
 *   2. No stored preference AND prefers-color-scheme: dark matches.
 *
 * Exposes toggleTheme() globally so the header button can call it.
 * layout.js calls this automatically, so every page gets dark mode for free.
 */

(function () {
  const STORAGE_KEY = 'theme';
  const html = document.documentElement;

  function getPreferred() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
    }
    // Update toggle button icon if already rendered
    const btn = document.getElementById('theme-toggle-btn');
    if (btn) {
      btn.querySelector('i').className = theme === 'dark' ? 'uil uil-sun' : 'uil uil-moon';
      btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
    }
  }

  // Apply immediately (before paint) to avoid flash of wrong theme
  applyTheme(getPreferred());

  window.toggleTheme = function () {
    const current = html.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem(STORAGE_KEY, next);
    applyTheme(next);
  };

  // Re-apply after DOM ready so the toggle button icon is correct
  document.addEventListener('DOMContentLoaded', function () {
    applyTheme(getPreferred());
  });
})();
