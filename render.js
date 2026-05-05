function normalizeTagValue(value) {
  return (value || "").trim().toLowerCase();
}

function getFilterableTags(tags) {
  return (tags || []).filter(tag => normalizeTagValue(tag));
}

function getProjectStatus(collaboration) {
  const normalized = normalizeTagValue(collaboration);
  if (normalized === "individual") return "solo";
  if (normalized === "solo" || normalized === "collaborative") return normalized;

  return "";
}

function getPrimaryFilterTag(tags) {
  const filterableTags = getFilterableTags(tags || []);
  return filterableTags.length ? filterableTags[0] : "";
}

function getCategoryFilterUrl(work) {
  const primaryTag = getPrimaryFilterTag(work.tags);
  return primaryTag ? `all.html?tag=${encodeURIComponent(primaryTag)}` : "all.html";
}

function getYearFilterUrl(year) {
  return `all.html?year=${encodeURIComponent(String(year))}`;
}

function buildMetaBadge(label, url, options = {}) {
  const attributes = [];
  if (options.yearValue !== undefined) {
    attributes.push(`data-meta-year="${options.yearValue}"`);
  }

  return `
    <span class="work-meta-boxed work-meta-linklike" role="link" tabindex="0" data-filter-url="${url}" ${attributes.join(" ")}>
      ${label}
    </span>
  `;
}

function attachMetaBadgeNavigation(card) {
  function navigateWithBadge(event) {
    const badge = event.target.closest("[data-filter-url]");
    if (!badge) return;

    event.preventDefault();
    event.stopPropagation();

    const destination = badge.getAttribute("data-filter-url");
    if (destination) {
      window.location.href = destination;
    }
  }

  card.addEventListener("click", navigateWithBadge);
  card.addEventListener("keydown", event => {
    if (event.key !== "Enter" && event.key !== " ") return;
    navigateWithBadge(event);
  });
}

function buildWorkMedia(work, mediaClass = "", overlayMarkup = "") {
  const className = ["work-media", mediaClass].filter(Boolean).join(" ");

  if (work.cover) {
    return `
      <div class="${className}">
        <img src="${work.cover}" alt="${work.title} cover" loading="lazy" />
        ${overlayMarkup}
      </div>
    `;
  }

  return `
    <div class="${className} work-media-placeholder" aria-hidden="true">
      <span>${work.title}</span>
    </div>
  `;
}

function buildIntroOverlay(introText) {
  if (!introText) return "";

  return `
    <div class="selected-work-overlay" aria-hidden="true">
      <p class="selected-work-overlay-copy">${introText}</p>
    </div>
  `;
}

function buildWorkCard(work, options = {}) {
  const variant = options.variant || "default";
  const a = document.createElement("a");
  const filterableTags = getFilterableTags(work.tags || []);
  const projectStatus = getProjectStatus(work.collaboration);
  const introText = work.intro || work.blurb || "";
  const categoryFilterUrl = getCategoryFilterUrl(work);
  const yearFilterUrl = getYearFilterUrl(work.year);

  a.className = ["work-card", introText ? "work-card-has-overlay" : "", variant === "selected" ? "selected-work-card" : ""].filter(Boolean).join(" ");
  a.href = `work.html?slug=${encodeURIComponent(work.slug)}`;
  a.setAttribute("aria-label", work.title);
  a.dataset.tags = JSON.stringify(filterableTags);
  a.dataset.year = String(work.year);

  if (variant === "selected") {
    a.innerHTML = `
      ${buildWorkMedia(work, "selected-work-media", buildIntroOverlay(introText))}
      <div class="work-copy selected-work-copy">
        <div class="work-title">${work.title}</div>
        <div class="work-meta-row">
          <div class="work-sub">
            ${buildMetaBadge(work.category, categoryFilterUrl)}
            ${buildMetaBadge(work.year, yearFilterUrl, { yearValue: work.year })}
          </div>
          ${projectStatus ? `<div class="work-collaboration">${projectStatus}</div>` : ""}
        </div>
      </div>
    `;

    attachMetaBadgeNavigation(a);
    return a;
  }

  a.innerHTML = `
    ${buildWorkMedia(work, "", buildIntroOverlay(introText))}
    <div class="work-copy">
      <div class="work-title">${work.title}</div>
      <div class="work-meta-row">
        <div class="work-sub">
          ${buildMetaBadge(work.category, categoryFilterUrl)}
          ${buildMetaBadge(work.year, yearFilterUrl, { yearValue: work.year })}
        </div>
        ${projectStatus ? `<div class="work-collaboration">${projectStatus}</div>` : ""}
      </div>
    </div>
  `;

  attachMetaBadgeNavigation(a);
  return a;
}

function renderWorkList(containerId, works, options = {}) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.classList.toggle("selected-work-grid", options.variant === "selected");
  container.innerHTML = "";
  works.forEach(work => {
    container.appendChild(buildWorkCard(work, options));
  });
}

function renderSelected(containerId) {
  const selectedWorks = window.WORKS.filter(work => work.selected);
  renderWorkList(containerId, selectedWorks, { variant: "selected" });
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

function buildAmbientDecor(work) {
  if (!work.ambientItems || !work.ambientItems.length) return "";

  return `
    <div class="work-ambient" aria-hidden="true">
      ${work.ambientItems
        .map(
          item => `
            <img
              class="work-ambient-item work-ambient-item-${item.side || "left"}"
              src="${item.src}"
              alt=""
              loading="lazy"
              style="
                --ambient-x: ${item.x || "24px"};
                --ambient-size: ${item.size || "60px"};
                --ambient-duration: ${item.duration || "16s"};
                --ambient-delay: ${item.delay || "0s"};
                --ambient-drift: ${item.drift || "0px"};
                --ambient-rotate-start: ${item.rotateStart || "0deg"};
                --ambient-rotate-end: ${item.rotateEnd || "180deg"};
                --ambient-opacity: ${item.opacity || "0.9"};
              "
            />
          `
        )
        .join("")}
    </div>
  `;
}

function buildCreditsSection(credits, contributions) {
  const hasCredits = credits && credits.length;
  const hasContributions = contributions && contributions.length;
  if (!hasCredits && !hasContributions) return "";

  const boxes = [];

  if (hasContributions) {
    boxes.push(`
      <section class="detail-panel detail-meta-panel detail-panel-wide">
        <div class="credit-item">
          <div class="credit-label">Contribution</div>
          <ul class="detail-list">
            ${contributions.map(item => `<li>${item}</li>`).join("")}
          </ul>
        </div>
      </section>
    `);
  }

  if (hasCredits) {
    credits.forEach(credit => {
      boxes.push(`
        <section class="detail-panel detail-meta-panel">
          <div class="credit-item">
            <div class="credit-label">${credit.label}</div>
            <div class="credit-value">${credit.value}</div>
          </div>
        </section>
      `);
    });
  }

  return `
    <div class="detail-meta-grid">
      ${boxes.join("")}
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

            if (video.type === "local") {
              return `
                <div class="video-card">
                  <div class="video-embed">
                    <video
                      src="${video.src}"
                      title="${video.label || work.title}"
                      controls
                      preload="metadata"
                      playsinline>
                    </video>
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
  container.className = "work-detail-shell";
  container.removeAttribute("data-work-slug");

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

  container.className = ["work-detail-shell", work.shellClass || ""].filter(Boolean).join(" ");
  container.dataset.workSlug = work.slug;

  const projectStatus = getProjectStatus(work.collaboration);
  const categoryFilterUrl = getCategoryFilterUrl(work);
  const yearFilterUrl = getYearFilterUrl(work.year);
  const metaLine = `
    <span class="work-sub">
      <a class="work-meta-boxed work-meta-link" href="${categoryFilterUrl}">${work.category}</a>
      <a class="work-meta-boxed work-meta-link" href="${yearFilterUrl}">${work.year}</a>
    </span>
    ${projectStatus ? `<span class="work-collaboration">${projectStatus}</span>` : ""}
  `;

  container.innerHTML = `
    ${buildAmbientDecor(work)}
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
      ${buildCreditsSection(work.credits, work.contributions)}
    </article>
  `;
}
