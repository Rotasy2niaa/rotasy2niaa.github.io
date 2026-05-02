const META_ONLY_TAGS = new Set(["individual", "collaborative"]);

function normalizeTagValue(value) {
  return (value || "").trim().toLowerCase();
}

function getFilterableTags(tags) {
  return (tags || []).filter(tag => !META_ONLY_TAGS.has(normalizeTagValue(tag)));
}

function getProjectStatus(tags) {

  return "";
}

function buildWorkCard(work) {
  const a = document.createElement("a");
  const filterableTags = getFilterableTags(work.tags || []);
  const projectStatus = getProjectStatus(work.tags || []);

  a.className = "work-card";
  a.href = `work.html?slug=${encodeURIComponent(work.slug)}`;
  a.setAttribute("aria-label", work.title);
  a.dataset.tags = JSON.stringify(filterableTags);

  a.innerHTML = `
    <div class="work-media">
      <img src="${work.cover}" alt="${work.title} cover" loading="lazy" />
    </div>
    <div class="work-copy">
      <div class="work-title">${work.title}</div>
      <div class="work-sub">
        <span>${work.category}</span>
        <span aria-hidden="true">/</span>
        <span>${work.year}</span>
      </div>
      ${projectStatus ? `<div class="work-status">${projectStatus}</div>` : ""}
    </div>
  `;

  return a;
}

function renderWorkList(containerId, works) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  works.forEach(work => {
    container.appendChild(buildWorkCard(work));
  });
}

function renderSelected(containerId) {
  const selectedWorks = window.WORKS.filter(work => work.selected);
  renderWorkList(containerId, selectedWorks);
}

function renderAll(containerId) {
  renderWorkList(containerId, window.WORKS);
}

function buildTagLinks(tags) {
  const filterableTags = getFilterableTags(tags);
  if (!filterableTags.length) return "";

  return `
    <div class="detail-panel">
      <div class="tag-row">
        ${filterableTags
          .map(
            tag => `
              <a class="tag-link" href="all.html?tag=${encodeURIComponent(tag)}">
                ${tag}
              </a>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function buildLinksSection(links) {
  if (!links || !links.length) return "";

  return `
    <div class="detail-panel detail-section">
      <h2 class="detail-h2">Links</h2>
      <div class="detail-links">
        ${links
          .map(
            link => `
              <a class="detail-link" href="${link.url}" target="_blank" rel="noopener">
                ${link.label}
              </a>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function buildCreditsSection(credits) {
  if (!credits || !credits.length) return "";

  return `
    <div class="detail-panel">
      <div class="work-credits">
        ${credits
          .map(
            credit => `
              <div class="credit-item">
                <div class="credit-label">${credit.label}</div>
                <div class="credit-value">${credit.value}</div>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function buildSections(sections) {
  if (!sections || !sections.length) return "";

  return `
    <div class="work-sections">
      ${sections
        .map(
          section => `
            <section class="work-section">
              <h2>${section.heading}</h2>
              <div class="work-section-copy">${section.text}</div>
            </section>
          `
        )
        .join("")}
    </div>
  `;
}

function buildGallery(work) {
  if (!work.gallery || !work.gallery.length) return "";

  return `
    <div class="work-gallery">
      ${work.gallery
        .map(src => `<img src="${src}" alt="${work.title}" loading="lazy" />`)
        .join("")}
    </div>
  `;
}

function buildVideosSection(work) {
  if (!work.videos || !work.videos.length) return "";

  return `
    <div class="detail-section">
      <h2 class="detail-h2">Video</h2>
      <div class="video-grid">
        ${work.videos
          .map(video => {
            if (video.type === "youtube") {
              return `
                <div class="video-card">
                  <div class="video-embed">
                    <iframe
                      src="https://www.youtube-nocookie.com/embed/${video.id}"
                      title="${video.label || work.title}"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowfullscreen>
                    </iframe>
                  </div>
                  ${video.label ? `<div class="video-caption">${video.label}</div>` : ""}
                </div>
              `;
            }

            if (video.type === "vimeo") {
              return `
                <div class="video-card">
                  <div class="video-embed">
                    <iframe
                      src="https://player.vimeo.com/video/${video.id}"
                      title="${video.label || work.title}"
                      allow="autoplay; fullscreen; picture-in-picture"
                      allowfullscreen>
                    </iframe>
                  </div>
                  ${video.label ? `<div class="video-caption">${video.label}</div>` : ""}
                </div>
              `;
            }

            return "";
          })
          .join("")}
      </div>
    </div>
  `;
}

function renderWorkDetail() {
  const container = document.getElementById("workDetail");
  if (!container) return;

  const params = new URLSearchParams(window.location.search);
  const slug = params.get("slug");

  if (!slug) {
    container.innerHTML = `
      <a href="all.html" class="back-link">Back to All Works</a>
      <p class="missing-work">Work not found.</p>
    `;
    return;
  }

  const work = window.WORKS.find(item => item.slug === slug);
  if (!work) {
    container.innerHTML = `
      <a href="all.html" class="back-link">Back to All Works</a>
      <p class="missing-work">Work not found.</p>
    `;
    return;
  }

  const metaLine = `
    <span class="work-meta-boxed">${work.category}</span>
    <span class="work-meta-boxed">${work.year}</span>
  `;

  container.innerHTML = `
    <article class="work-detail">
      <a href="all.html" class="back-link">Back to All Works</a>

      <header class="work-hero-main">
        <p class="work-meta-line">${metaLine}</p>
        <h1>${work.title}</h1>
        ${work.intro ? `<p class="work-intro">${work.intro}</p>` : ""}
      </header>

      ${buildTagLinks(work.tags)}

      ${work.sections && work.sections.length ? buildSections(work.sections) : ""}
      ${buildGallery(work)}
      ${buildLinksSection(work.links)}
      ${buildVideosSection(work)}
      ${buildCreditsSection(work.credits)}
    </article>
  `;
}
