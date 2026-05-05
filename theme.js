(() => {
  const STORAGE_KEY = "shanlin-theme";
  const root = document.documentElement;

  function getStoredTheme() {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function storeTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      // Ignore storage issues and keep the current session theme.
    }
  }

  function prefersDarkTheme() {
    return Boolean(
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function resolveTheme() {
    const storedTheme = getStoredTheme();
    if (storedTheme === "light" || storedTheme === "dark") return storedTheme;
    return prefersDarkTheme() ? "dark" : "light";
  }

  function updateToggleButtons(theme) {
    const nextTheme = theme === "dark" ? "light" : "dark";

    document.querySelectorAll(".theme-toggle").forEach(button => {
      button.dataset.theme = theme;
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      button.setAttribute("aria-label", `Current theme: ${theme}. Click to switch to ${nextTheme}.`);
      button.title = `Switch to ${nextTheme} theme`;
      button.innerHTML = `
        <span class="theme-toggle-option theme-toggle-option-light">Light</span>
        <span class="theme-toggle-separator">/</span>
        <span class="theme-toggle-option theme-toggle-option-dark">Dark</span>
      `;
    });
  }

  function applyTheme(theme) {
    const resolvedTheme = theme === "dark" ? "dark" : "light";
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
    updateToggleButtons(resolvedTheme);
  }

  function toggleTheme() {
    const nextTheme = (root.dataset.theme || "light") === "dark" ? "light" : "dark";
    storeTheme(nextTheme);
    applyTheme(nextTheme);
  }

  function createToggleButton() {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-toggle";
    button.addEventListener("click", toggleTheme);
    return button;
  }

  function ensureToggleButtons() {
    document.querySelectorAll(".nav").forEach(nav => {
      if (!nav.querySelector(".theme-toggle")) {
        nav.appendChild(createToggleButton());
      }
    });

    updateToggleButtons(root.dataset.theme || "light");
  }

  function watchSystemTheme() {
    if (!window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const storedTheme = getStoredTheme();
      if (storedTheme === "light" || storedTheme === "dark") return;
      applyTheme(resolveTheme());
    };

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);
      return;
    }

    if (typeof mediaQuery.addListener === "function") {
      mediaQuery.addListener(handleChange);
    }
  }

  applyTheme(resolveTheme());

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", ensureToggleButtons);
  } else {
    ensureToggleButtons();
  }

  watchSystemTheme();
})();
