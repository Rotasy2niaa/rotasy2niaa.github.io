const desktop = document.querySelector("#desktop");
const windows = document.querySelector("#windows");
const tasks = document.querySelector("#tasks");
const template = document.querySelector("#window-template");
const mobile = matchMedia("(max-width: 640px), (pointer: coarse)");
const launchers = [...document.querySelectorAll("[data-app]")];
const applications = {
  featured: { title: "Selected Works" },
  work: { title: "Archive/" },
  research: { title: "Research/" },
  notes: { title: "Notes/" },
  involuntary: { title: "Involuntary Hold" },
  about: { title: "About/" },
  cv: { title: "CV" }
};
const projectsBySlug = new Map(window.WORKS.map(project => [project.slug, project]));
const projects = window.WORKS.filter(project => project.listed !== false);
const openWindows = new Map();
let active = null;
let layer = 1;
let sequence = 0;
let selectedLauncher = launchers[0];
let linkedProject = null;

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
      top: key === "featured" ? Math.min(190, desktop.clientHeight * .28) : 28 + offset,
      width: Math.min(960, desktop.clientWidth * .76),
      height: Math.min(710, desktop.clientHeight * (key === "featured" ? .7 : .84))
    })
  };
  openWindows.set(key, item);
  windows.append(element);
  tasks.append(task);
  const content = element.querySelector(".window-content");
  if (key === "work") item.setFilters = buildExplorer(content, options.filters);
  else if (key === "featured") buildFeatured(content);
  else if (key === "cv" || key === "about") {
    content.append(document.querySelector("#" + key + "-content").content.cloneNode(true));
    if (key === "about") bindAboutContact(content);
  }
  else if (key === "notes") buildNotes(content);
  else if (app.note) buildNote(content, app.note);
  else if (key === "research" || key === "involuntary") buildDocument(content, key);
  else renderProject(content, projectsBySlug.get(app.project));

  task.addEventListener("click", () => {
    if (app.project) setProjectUrl(app.project, "pushState");
    focusWindow(item);
  });
  element.addEventListener("pointerdown", () => focusWindow(item, false));
  element.addEventListener("focusin", () => {
    if (active !== item) focusWindow(item, false);
  });
  element.querySelector('[data-action="close"]').addEventListener("click", () => {
    if (app.project && linkedProject === app.project) setProjectUrl(null, "replaceState");
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

function setProjectUrl(slug, method) {
  if (linkedProject === slug) return;
  const url = new URL(location.href);
  if (slug) url.searchParams.set("project", slug);
  else url.searchParams.delete("project");
  history[method](null, "", url);
  linkedProject = slug;
}

function openProject(project, updateHistory = true) {
  if (updateHistory) setProjectUrl(project.slug, "pushState");
  openWindow("project:" + project.slug, {
    title: project.title,
    project: project.slug
  });
}

function bindAboutContact(content) {
  const address = content.querySelector(".contact-address");
  const status = content.querySelector(".contact-status");
  content.querySelector("[data-copy-email]").addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(address.value);
      address.hidden = true;
      status.textContent = "Copied " + address.value;
    } catch {
      address.hidden = false;
      status.textContent = "Copy this email address:";
      address.focus();
      address.select();
    }
  });
}

function buildProjectFile(project, showDescription = false) {
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
  if (showDescription && project.blurb) {
    const description = document.createElement("p");
    description.textContent = project.blurb;
    button.append(description);
  }
  button.addEventListener("click", () => openProject(project));
  return button;
}

function buildFeatured(content) {
  content.innerHTML = `
    <div class="explorer featured">
      <div class="featured-header">
        <h3>Selected Works</h3>
        <button type="button">Browse Archive →</button>
      </div>
      <div class="file-list featured-files"></div>
    </div>`;
  content.querySelector("button").addEventListener("click", () => openWindow("work"));
  const featured = projects.filter(project => project.selected);
  content.querySelector(".file-list").append(...featured.map(project => buildProjectFile(project, true)));
}

function buildDocument(content, key) {
  const documents = {
    research: '<h3>Research files</h3><button type="button">Involuntary Hold</button>',
    involuntary: '<h3>Involuntary Hold</h3><p>Research-creation project · Twine · 2026</p><p>Explores how institutional routines constrain player agency in a psychiatric unit. A daily schedule and rooms that open at specific times shape what the player can do in Twine.</p>'
  };
  content.innerHTML = '<article class="explorer">' + documents[key] + '</article>';
  content.querySelector("button")?.addEventListener("click", () => openWindow("involuntary"));
}

async function buildNotes(content) {
  content.innerHTML = '<article class="os-document"><h3>Notes</h3><p role="status">Loading notes…</p><ol class="note-list"></ol></article>';
  const status = content.querySelector('[role="status"]');
  const list = content.querySelector("ol");
  try {
    const response = await fetch("notes/index.json", { cache: "no-cache" });
    if (!response.ok) throw new Error("Notes index unavailable");
    const notes = await response.json();
    notes.sort((a, b) => b.date.localeCompare(a.date));
    for (const note of notes) {
      const item = document.createElement("li");
      const date = document.createElement("time");
      date.dateTime = note.date;
      date.textContent = note.date;
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = note.title;
      button.addEventListener("click", () => openWindow("note:" + note.file, { title: note.title, note }));
      item.append(date, button);
      list.append(item);
    }
    status.textContent = notes.length ? "" : "No public notes yet.";
  } catch {
    status.textContent = "Notes could not be loaded. Close and reopen Notes to try again.";
  }
}

async function buildNote(content, note) {
  const article = document.createElement("article");
  article.className = "os-document";
  const heading = document.createElement("h3");
  heading.textContent = note.title;
  const date = document.createElement("time");
  date.dateTime = note.date;
  date.textContent = note.date;
  const entry = document.createElement("p");
  entry.className = "note-entry";
  entry.textContent = "Loading note…";
  article.append(heading, date, entry);
  content.append(article);
  try {
    if (!/^[a-z0-9][a-z0-9-]*\.txt$/.test(note.file)) throw new Error("Invalid note filename");
    const response = await fetch("notes/" + note.file, { cache: "no-cache" });
    if (!response.ok) throw new Error("Note unavailable");
    entry.textContent = await response.text();
  } catch {
    entry.textContent = "This note could not be loaded. Close and reopen it to try again.";
  }
}

function buildExplorer(content, initialFilters) {
  content.innerHTML = `
    <div class="explorer">
      <h3>Archive / All files</h3>
      <div class="explorer-layout">
      <div class="filters">
        <label>Search <input type="search" placeholder="Project name"></label>
        <label>Medium <select name="medium"><option value="">All media</option></select></label>
        <label>Year <select name="year"><option value="">All years</option></select></label>
      </div>
      <div>
        <p role="status"></p>
        <div class="file-list"></div>
      </div>
      </div>
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
    const button = buildProjectFile(project);
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
function restoreProjectFromUrl() {
  const slug = new URLSearchParams(location.search).get("project");
  const project = projectsBySlug.get(slug);
  const previous = openWindows.get("project:" + linkedProject);
  if (previous && linkedProject !== slug) previous.minimized = true;
  linkedProject = project?.slug || null;
  if (project) openProject(project, false);
  else if (previous) selectNext();
}

windows.addEventListener("click", event => {
  if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
  const link = event.target.closest("a[href]");
  if (!link || link.target === "_blank") return;
  const url = new URL(link.href);
  if (url.origin !== location.origin || url.pathname !== location.pathname) return;
  const project = projectsBySlug.get(url.searchParams.get("project"));
  if (project) {
    event.preventDefault();
    openProject(project);
  } else if (url.searchParams.get("app") === "work") {
    event.preventDefault();
    openWindow("work", applications.work, { filters: url.searchParams });
  }
});

addEventListener("popstate", restoreProjectFromUrl);
const initial = new URLSearchParams(location.search);
const initialApp = initial.get("app");
if (["about", "cv", "work"].includes(initialApp)) {
  openWindow(initialApp, applications[initialApp], { focus: false, filters: initial });
} else {
  openWindow("featured", applications.featured, { focus: false });
}
restoreProjectFromUrl();
