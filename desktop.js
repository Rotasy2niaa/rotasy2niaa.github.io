const desktop = document.querySelector("#desktop");
const windows = document.querySelector("#windows");
const tasks = document.querySelector("#tasks");
const template = document.querySelector("#window-template");
const mobile = matchMedia("(max-width: 640px), (pointer: coarse)");
const launchers = [...document.querySelectorAll("[data-app]")];
const applications = {
  home: { title: "Home/", url: "index.html" },
  work: { title: "Work/" },
  about: { title: "About/", url: "about.html" },
  cv: { title: "CV", url: "cv.html" }
};
const projects = (window.WORKS || []).filter(project => project.listed !== false);
const openWindows = new Map();
let active = null;
let layer = 1;
let sequence = 0;
let selectedLauncher = launchers[0];

function clamp(value, minimum, maximum) {
  return Math.min(Math.max(value, minimum), maximum);
}

function fit(rect) {
  const width = clamp(rect.width, Math.min(320, desktop.clientWidth), desktop.clientWidth);
  const height = clamp(rect.height, Math.min(220, desktop.clientHeight), desktop.clientHeight);
  return {
    width,
    height,
    left: clamp(rect.left, 0, desktop.clientWidth - width),
    top: clamp(rect.top, 0, desktop.clientHeight - height)
  };
}

function layout(item) {
  const rect = mobile.matches || item.maximized
    ? { left: 0, top: 0, width: desktop.clientWidth, height: desktop.clientHeight }
    : fit(item.rect);
  for (const [key, value] of Object.entries(rect)) item.element.style[key] = value + "px";
  item.element.classList.toggle("is-maximized", item.maximized);
}

function updateVisibility() {
  for (const item of openWindows.values()) {
    item.element.hidden = item.minimized || (mobile.matches && active !== item);
    item.element.classList.toggle("is-active", active === item);
    item.task.setAttribute("aria-pressed", String(active === item));
  }
}

function focusWindow(item, moveFocus = true) {
  active = item;
  item.minimized = false;
  item.order = ++layer;
  item.element.style.zIndex = item.order;
  updateVisibility();
  if (moveFocus) item.element.focus({ preventScroll: true });
}

function selectNext() {
  const next = [...openWindows.values()]
    .filter(item => !item.minimized)
    .sort((first, second) => second.order - first.order)[0];
  if (next) focusWindow(next);
  else {
    active = null;
    updateVisibility();
    selectedLauncher.focus();
  }
}

function bindPointer(item, handle, resize) {
  handle.addEventListener("pointerdown", event => {
    if (mobile.matches || item.maximized || event.button !== 0 || event.target.closest("button")) return;
    event.preventDefault();
    focusWindow(item);
    const initial = fit(item.rect);
    const startX = event.clientX;
    const startY = event.clientY;
    const pointer = event.pointerId;
    handle.setPointerCapture(pointer);
    item.element.classList.add("is-moving");

    function move(next) {
      if (next.pointerId !== pointer) return;
      const x = next.clientX - startX;
      const y = next.clientY - startY;
      if (resize) {
        const maxWidth = desktop.clientWidth - initial.left;
        const maxHeight = desktop.clientHeight - initial.top;
        item.rect = {
          ...initial,
          width: clamp(initial.width + x, Math.min(320, maxWidth), maxWidth),
          height: clamp(initial.height + y, Math.min(220, maxHeight), maxHeight)
        };
      } else {
        item.rect = fit({ ...initial, left: initial.left + x, top: initial.top + y });
      }
      layout(item);
    }

    function finish() {
      handle.removeEventListener("pointermove", move);
      item.element.classList.remove("is-moving");
    }

    handle.addEventListener("pointermove", move);
    handle.addEventListener("lostpointercapture", finish, { once: true });
  });
}

function openWindow(key, app = applications[key], options = {}) {
  let item = openWindows.get(key);
  if (item) {
    if (options.filters) item.setFilters(options.filters);
    focusWindow(item);
    return;
  }

  const element = template.content.firstElementChild.cloneNode(true);
  const title = element.querySelector("h2");
  title.textContent = app.title;
  title.id = "window-title-" + ++sequence;
  element.setAttribute("aria-labelledby", title.id);
  const offset = ((sequence - 1) % 5) * 28;
  const task = document.createElement("button");
  task.type = "button";
  task.textContent = app.title;
  item = {
    element, task, minimized: false, maximized: false,
    rect: fit({
      left: Math.min(136, desktop.clientWidth * .14) + offset,
      top: 28 + offset,
      width: Math.min(960, desktop.clientWidth * .76),
      height: Math.min(710, desktop.clientHeight * .84)
    })
  };
  openWindows.set(key, item);
  windows.append(element);
  tasks.append(task);
  const content = element.querySelector(".window-content");
  if (key === "work") item.setFilters = buildExplorer(content, options.filters);
  else mountPage(content, app, item);

  task.addEventListener("click", () => focusWindow(item));
  element.addEventListener("pointerdown", () => focusWindow(item, false));
  element.addEventListener("focusin", () => {
    if (active !== item) focusWindow(item, false);
  });
  element.querySelector('[data-action="close"]').addEventListener("click", () => {
    openWindows.delete(key);
    element.remove();
    task.remove();
    selectNext();
  });
  element.querySelector('[data-action="minimize"]').addEventListener("click", () => {
    item.minimized = true;
    selectNext();
  });
  const maximize = element.querySelector('[data-action="maximize"]');
  maximize.addEventListener("click", () => {
    item.maximized = !item.maximized;
    const label = item.maximized ? "Restore" : "Maximize";
    maximize.setAttribute("aria-label", label);
    maximize.title = label;
    maximize.textContent = item.maximized ? "❐" : "□";
    layout(item);
  });
  bindPointer(item, element.querySelector(".title-bar"), false);
  bindPointer(item, element.querySelector(".resize-grip"), true);
  layout(item);
  focusWindow(item, options.focus !== false);
}

function openProject(project) {
  openWindow("project:" + project.slug, {
    title: project.title,
    url: "work.html?slug=" + encodeURIComponent(project.slug)
  });
}

function mountPage(content, app, item) {
  const frame = document.createElement("iframe");
  frame.title = app.title;
  frame.addEventListener("load", () => {
    const doc = frame.contentDocument;
    if (!doc) return;
    const style = doc.createElement("style");
    style.textContent = ".site-header { display:none; }";
    doc.head.append(style);
    doc.documentElement.dataset.theme = document.documentElement.dataset.theme;
    doc.documentElement.style.colorScheme = document.documentElement.dataset.theme;
    doc.addEventListener("pointerdown", () => focusWindow(item, false), true);
    doc.addEventListener("focusin", () => {
      if (active !== item) focusWindow(item, false);
    });

    function route(event) {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      const badge = event.target.closest("[data-filter-url]");
      const anchor = event.target.closest("a[href]");
      if (!badge && (!anchor || anchor.target === "_blank" || anchor.hasAttribute("download"))) return;
      const url = new URL(badge?.dataset.filterUrl || anchor.href, doc.URL);
      if (url.origin !== location.origin) return;
      const page = url.pathname.split("/").pop();
      if (page === "work.html") {
        const project = projects.find(candidate => candidate.slug === url.searchParams.get("slug"));
        if (!project) return;
        event.preventDefault();
        event.stopPropagation();
        openProject(project);
      } else {
        const key = { "index.html": "home", "all.html": "work", "about.html": "about", "cv.html": "cv" }[page];
        if (!key || (url.hash && url.pathname === new URL(doc.URL).pathname)) return;
        event.preventDefault();
        event.stopPropagation();
        openWindow(key, applications[key], key === "work" ? { filters: url.searchParams } : {});
      }
    }

    doc.addEventListener("click", route, true);
    doc.addEventListener("keydown", event => {
      if ((event.key === "Enter" || event.key === " ") && event.target.closest("[data-filter-url]")) route(event);
    }, true);
  });
  frame.src = app.url;
  content.append(frame);
}

function buildExplorer(content, initialFilters) {
  content.innerHTML = `
    <div class="explorer">
      <h3>Project files</h3>
      <div class="filters">
        <label>Search <input type="search" placeholder="Project name"></label>
        <label>Medium <select name="medium"><option value="">All media</option></select></label>
        <label>Year <select name="year"><option value="">All years</option></select></label>
      </div>
      <p role="status"></p>
      <div class="file-list"></div>
    </div>`;
  const search = content.querySelector("input");
  const medium = content.querySelector('[name="medium"]');
  const year = content.querySelector('[name="year"]');
  const count = content.querySelector('[role="status"]');
  const files = content.querySelector(".file-list");
  const tags = [...new Set(projects.flatMap(project => project.tags || []))].sort();
  const years = [...new Set(projects.map(project => project.year))].sort((a, b) => b - a);
  tags.forEach(tag => medium.add(new Option(tag.replaceAll("-", " "), tag)));
  years.forEach(value => year.add(new Option(value, value)));
  const cards = projects.map(project => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "project-file";
    if (project.cover) {
      const image = document.createElement("img");
      image.src = project.cover;
      image.loading = "lazy";
      image.alt = "";
      button.append(image);
    }
    const title = document.createElement("strong");
    title.textContent = project.title;
    const metadata = document.createElement("small");
    metadata.textContent = [project.category, project.year].filter(Boolean).join(" / ");
    button.append(title, metadata);
    button.addEventListener("click", () => openProject(project));
    files.append(button);
    return { project, button };
  });

  function filter() {
    const query = search.value.trim().toLowerCase();
    let visible = 0;
    for (const { project, button } of cards) {
      button.hidden = !project.title.toLowerCase().includes(query)
        || Boolean(medium.value && !project.tags?.includes(medium.value))
        || Boolean(year.value && String(project.year) !== year.value);
      if (!button.hidden) visible++;
    }
    count.textContent = visible + (visible === 1 ? " project" : " projects");
  }

  function setFilters(params = new URLSearchParams()) {
    medium.value = params.get("tag") || "";
    year.value = params.get("year") || "";
    search.value = "";
    filter();
  }

  search.addEventListener("input", filter);
  medium.addEventListener("change", filter);
  year.addEventListener("change", filter);
  setFilters(initialFilters);
  return setFilters;
}

for (const button of launchers) {
  button.addEventListener("click", event => {
    selectedLauncher = button;
    for (const launcher of launchers) launcher.classList.toggle("is-selected", launcher === button);
    if (mobile.matches || event.detail === 0) openWindow(button.dataset.app);
  });
  button.addEventListener("dblclick", () => openWindow(button.dataset.app));
}

document.querySelector("#show-desktop").addEventListener("click", () => {
  for (const item of openWindows.values()) item.minimized = true;
  selectNext();
});

const themeButton = document.querySelector("#desktop-theme");
const systemTheme = matchMedia("(prefers-color-scheme: dark)");
function setTheme(theme) {
  const dark = theme === "dark";
  document.documentElement.dataset.theme = theme;
  themeButton.setAttribute("aria-pressed", String(dark));
  themeButton.textContent = dark ? "Light mode" : "Dark mode";
  for (const frame of windows.querySelectorAll("iframe")) {
    const root = frame.contentDocument?.documentElement;
    if (root) {
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
    }
  }
}
const themeKey = "shanlin-desktop-theme";
setTheme(localStorage.getItem(themeKey) || (systemTheme.matches ? "dark" : "light"));
themeButton.addEventListener("click", () => {
  const theme = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
  localStorage.setItem(themeKey, theme);
  setTheme(theme);
});

new ResizeObserver(() => {
  for (const item of openWindows.values()) layout(item);
}).observe(desktop);
mobile.addEventListener("change", () => {
  for (const item of openWindows.values()) layout(item);
  updateVisibility();
});
openWindow("home", applications.home, { focus: false });
