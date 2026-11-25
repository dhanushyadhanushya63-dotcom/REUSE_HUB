// ReUseHub Instant Theme Loader & Switcher
// Applies saved dark/light theme instantly to avoid white flash (FOUC)
(function() {
  const savedTheme = localStorage.getItem('reusehub_theme') || 
    (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  document.documentElement.setAttribute('data-bs-theme', savedTheme);
  document.documentElement.setAttribute('data-theme', savedTheme);
})();

window.toggleTheme = function() {
  const current = document.documentElement.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light';
  const newTheme = current === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-bs-theme', newTheme);
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('reusehub_theme', newTheme);
  window.updateThemeIcons(newTheme);
  if (typeof window.showToast === 'function') {
    window.showToast(`${newTheme === 'dark' ? '🌙 Dark' : '☀️ Light'} mode activated!`);
  }
};

window.updateThemeIcons = function(theme) {
  const isDark = theme === 'dark';
  document.querySelectorAll('#themeToggleBtn, .theme-toggle-btn').forEach(btn => {
    btn.innerHTML = isDark 
      ? '<i class="bi bi-sun-fill text-warning fs-5"></i>' 
      : '<i class="bi bi-moon-stars-fill text-secondary fs-5"></i>';
    btn.setAttribute('title', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
    btn.setAttribute('aria-label', isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode');
  });
};

document.addEventListener('DOMContentLoaded', () => {
  const current = document.documentElement.getAttribute('data-bs-theme') || 'light';
  window.updateThemeIcons(current);
});
