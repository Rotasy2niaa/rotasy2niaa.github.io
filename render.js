// render.js

function getWorks() {
  return (window.WORKS || []).slice();
}

function buildCard(work) {
  const a = document.createElement("a");
  a.className = "work-card";
  a.href = `work.html?slug=${encodeURIComponent(work.slug)}`;
  a.setAttribute("data-tags", work.tags.join(" "));
  a.setAttribute("aria-label", work.title);

  a.innerHTML = `
    <div class="work-media">
      <img src="${work.cover}" alt="${work.title} cover" loading="lazy" />
    </div>
    <div class="work-meta">
      <div class="work-title">${work.title}</div>
      <div class="work-sub">${work.category}, ${work.year}</div>
    </div>
  `;
  return a;
}

function renderGrid(containerId, works) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = "";
  works.forEach(w => grid.appendChild(buildCard(w)));
}

function renderSelected(containerId) {
  const works = getWorks().filter(w => w.selected);
  renderGrid(containerId, works);
}

function renderAll(containerId) {
  renderGrid(containerId, getWorks());
}

function getQueryParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

function renderWorkDetail() {
  const slug = getQueryParam("slug");
  const works = getWorks();
  const work = works.find(w => w.slug === slug);

  const root = document.getElementById("workDetail");
  if (!root) return;

  if (!work) {
    root.innerHTML = `<p>Work not found.</p>`;
    return;
  }

  const tagsHtml = (work.tags || [])
    .map(t => `<span class="pill">${t}</span>`)
    .join("");

  const galleryHtml = (work.gallery || [])
    .map(src => `<img class="detail-img" src="${src}" alt="${work.title} image" loading="lazy" />`)
    .join("");

  const creditsHtml = (work.credits || [])
    .map(item => `<div class="kv"><div class="k">${item.label}</div><div class="v">${item.value}</div></div>`)
    .join("");

  root.innerHTML = `
    <a class="back-link" href="all.html">← Back to All Works</a>

    <div class="detail-head">
      <h1 class="detail-title">${work.title}</h1>

      <div class="detail-sub">
        <span>${work.category}</span>
        <span class="dot">•</span>
        <span>${work.year}</span>
      </div>

      <p class="detail-blurb">${work.blurb || ""}</p>

      <div class="pill-row">${tagsHtml}</div>
    </div>

    <div class="detail-gallery">
      ${galleryHtml}
    </div>

    ${work.intro ? `<div class="detail-text">${work.intro}</div>` : ""}

    ${creditsHtml ? `<div class="detail-credits">${creditsHtml}</div>` : ""}
  `;
}
