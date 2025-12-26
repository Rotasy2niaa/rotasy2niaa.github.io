// render.js
// Responsible for rendering work cards and detail pages

function buildWorkCard(work) {
  const a = document.createElement("a");
  a.className = "work-card";
  a.href = `work.html?slug=${encodeURIComponent(work.slug)}`;
  a.setAttribute("aria-label", work.title);
  a.dataset.tags = work.tags.join(" ");

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

/* ---------- Home: Selected Works ---------- */

function renderSelected(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  const selectedWorks = window.WORKS.filter(w => w.selected);
  selectedWorks.forEach(work => {
    container.appendChild(buildWorkCard(work));
  });
}

/* ---------- All Works ---------- */

function renderAll(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;

  window.WORKS.forEach(work => {
    container.appendChild(buildWorkCard(work));
  });
}

/* ---------- Work Detail ---------- */

function renderWorkDetail() {
  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  const container = document.getElementById("workDetail");
  if (!container || !slug) return;

  const work = window.WORKS.find(w => w.slug === slug);
  if (!work) {
    container.innerHTML = "<p>Work not found.</p>";
    return;
  }

  container.innerHTML = `
    <a href="all.html" class="back-link">← Back to All Works</a>

    <h1>${work.title}</h1>
    <p class="work-meta-line">
      ${work.category} · ${work.year}
    </p>

    <p class="work-intro">${work.intro || ""}</p>

    <div class="tag-row">
      ${work.tags.map(tag => `<span class="tag">${tag}</span>`).join("")}
    </div>

    <div class="work-gallery">
      ${work.gallery
        .map(src => `<img src="${src}" alt="${work.title}" />`)
        .join("")}
    </div>

    ${
      work.credits
        ? `
      <div class="work-credits">
        ${work.credits
          .map(c => `<div><strong>${c.label}:</strong> ${c.value}</div>`)
          .join("")}
      </div>
      `
        : ""
    }
  `;
}
