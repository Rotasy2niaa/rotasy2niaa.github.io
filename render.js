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

  // Links section (optional)
  const linksHtml =
    work.links && work.links.length
      ? `
    <div class="detail-section">
      <h2 class="detail-h2">Links</h2>
      <div class="detail-links">
        ${work.links
          .map(
            l => `
          <a class="detail-link"
             href="${l.url}"
             target="_blank"
             rel="noopener">
            ${l.label}
          </a>
        `
          )
          .join("")}
      </div>
    </div>
  `
      : "";

  // Videos section (optional)
  const videosHtml =
    work.videos && work.videos.length
      ? `
    <div class="detail-section">
      <h2 class="detail-h2">Video</h2>
      <div class="video-grid">
        ${work.videos
          .map(v => {
            if (v.type === "youtube") {
              return `
                <div class="video-card">
                  <div class="video-embed">
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/${v.id}"
                      title="${v.label || work.title}"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen>
                    </iframe>
                  </div>
                  ${v.label ? `<div class="video-caption">${v.label}</div>` : ""}
                </div>
              `;
            }

            if (v.type === "vimeo") {
              return `
                <div class="video-card">
                  <div class="video-embed">
                    <iframe
                      src="https://player.vimeo.com/video/${v.id}"
                      title="${v.label || work.title}"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowfullscreen>
                    </iframe>
                  </div>
                  ${v.label ? `<div class="video-caption">${v.label}</div>` : ""}
                </div>
              `;
            }

            return "";
          })
          .join("")}
      </div>
    </div>
  `
      : "";

  container.innerHTML = `
    <a href="all.html" class="back-link">← Back to All Works</a>

    <h1>${work.title}</h1>
    <p class="work-meta-line">
      ${work.category} · ${work.year}
    </p>

    <p class="work-intro">${work.intro || ""}</p>

    <div class="tag-row">
      ${(work.tags || [])
        .map(
          tag => `
        <a class="tag tag-link" href="all.html?tag=${encodeURIComponent(tag)}">
          ${tag}
        </a>
      `
        )
        .join("")}
    </div>


    ${
  work.sections
    ? `
  <div class="work-sections">
    ${work.sections
      .map(
        section => `
      <div class="work-section">
        <h3>${section.heading}</h3>
        <p>${section.text}</p>
      </div>
    `
      )
      .join("")}
  </div>
  `
    : ""
}


    <div class="work-gallery">
      ${(work.gallery || [])
        .map(src => `<img src="${src}" alt="${work.title}" loading="lazy" />`)
        .join("")}
    </div>

    ${linksHtml}
    ${videosHtml}

    ${
      work.credits && work.credits.length
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
