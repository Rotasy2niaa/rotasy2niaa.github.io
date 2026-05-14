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

function sanitizeHexColor(value) {
  const raw = (value || "").trim();
  if (!raw) return "";
  return /^#[0-9a-fA-F]{3,8}$/.test(raw) ? raw : "";
}

function buildCoverMediaStyle(work) {
  const styleParts = [];
  if (work && work.cover) {
    const escapedSrc = work.cover.replace(/'/g, "\\'");
    styleParts.push(`--cover-image: url('${escapedSrc}')`);
  }

  const customBackdropColor = sanitizeHexColor(work && work.coverBackdropColor);
  if (customBackdropColor) {
    styleParts.push(`--cover-backdrop-color: ${customBackdropColor}`);
  }

  return styleParts.length ? ` style="${styleParts.join("; ")}"` : "";
}

function getCoverFit(work) {
  return work && work.coverFit === "cover" ? "cover" : "contain";
}

function getCoverBackdrop(work) {
  if (!work) return "image";
  if (sanitizeHexColor(work.coverBackdropColor)) return "custom";
  if (work.coverBackdrop === "black") return "black";
  if (work.coverBackdrop === "white") return "white";
  return "image";
}

function buildCoverMediaAttrs(work) {
  return ` data-cover-fit="${getCoverFit(work)}" data-cover-backdrop="${getCoverBackdrop(work)}"`;
}

function buildWorkMedia(work, mediaClass = "", overlayMarkup = "") {
  const className = ["work-media", mediaClass].filter(Boolean).join(" ");

  if (work.cover) {
    return `
      <div class="${className}"${buildCoverMediaAttrs(work)}${buildCoverMediaStyle(work)}>
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

function buildTagLinks(tags, options = {}) {
  const filterableTags = getFilterableTags(tags);
  if (!filterableTags.length) return "";

  const tagLinkClass = options.variant === "inline"
    ? "tag-link work-meta-boxed work-meta-link work-hero-tag-link"
    : "tag-link";

  const tagLinks = filterableTags
    .map(
      tag => `
        <a class="${tagLinkClass}" href="all.html?tag=${encodeURIComponent(tag)}">
          ${tag}
        </a>
      `
    )
    .join("");

  if (options.variant === "inline") {
    return `
      <div class="tag-row work-hero-tags">
        ${tagLinks}
      </div>
    `;
  }

  return `
    <div class="detail-panel">
      <div class="tag-row">
        ${tagLinks}
      </div>
    </div>
  `;
}

function buildLinksSection(work) {
  const links = work.links;
  if (!links || !links.length) return "";

  function getSteamAppId(url) {
    const match = /store\.steampowered\.com\/app\/(\d+)/i.exec(url || "");
    return match ? match[1] : "";
  }

  function isItchLink(url) {
    return /^https?:\/\/([^.]+)\.itch\.io\/([^/?#]+)/i.test(url || "");
  }

  function getHostLabel(url) {
    try {
      const parsed = new URL(url);
      return parsed.hostname.replace(/^www\./i, "");
    } catch {
      return "external link";
    }
  }

  function buildLinkPreview(link) {
    const steamAppId = getSteamAppId(link.url);
    if (!steamAppId) return "";

    return `
      <div class="link-preview link-preview-steam">
        <iframe
          src="https://store.steampowered.com/widget/${steamAppId}/?l=english"
          title="${link.label} preview"
          loading="lazy">
        </iframe>
      </div>
    `;
  }

  function buildExternalPreview(link) {
    const summary = work.blurb || work.intro || "";
    const hostLabel = getHostLabel(link.url);

    return `
      <div class="link-preview link-preview-external">
        <div class="link-preview-external-media"${buildCoverMediaAttrs(work)}${buildCoverMediaStyle(work)}>
          ${work.cover
            ? `<img src="${work.cover}" alt="${work.title} cover" loading="lazy" />`
            : `<div class="link-preview-external-placeholder">${work.title}</div>`}
        </div>
        <div class="link-preview-external-shell">
          <div class="link-preview-external-kicker">${hostLabel}</div>
          <div class="link-preview-external-head">
            <div class="link-preview-external-title">${work.title}</div>
          </div>
          ${summary ? `<p class="link-preview-external-copy">${summary}</p>` : ""}
          <div class="link-preview-external-meta">${link.label}</div>
          <div class="detail-links">
            <a class="detail-link" href="${link.url}" target="_blank" rel="noopener">
              Open site
            </a>
          </div>
        </div>
      </div>
    `;
  }

  return `
    <div class="detail-panel detail-section">
      <h2 class="detail-h2">Links</h2>
      <div class="link-card-grid">
        ${links
          .map(link => {
            const itchOnlyButton = isItchLink(link.url);
            return `
              <div class="link-card">
                <div class="detail-links">
                  <a class="detail-link" href="${link.url}" target="_blank" rel="noopener">
                    ${link.label}
                  </a>
                </div>
                ${itchOnlyButton ? "" : buildLinkPreview(link) || buildExternalPreview(link)}
              </div>
            `;
          })
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
                --ambient-top: ${item.top || "-18vh"};
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

function buildHeroBanner(work) {
  if (!work.cover) return "";

  return `
    <section class="detail-section work-banner-section" aria-label="${work.title} cover image">
      <div class="work-banner-media">
        <img src="${work.cover}" alt="${work.title} cover" loading="eager" fetchpriority="high" />
      </div>
    </section>
  `;
}

function buildIntroSection(introText) {
  if (!introText) return "";

  return `
    <section class="detail-panel work-intro-section">
      <p class="work-intro">${introText}</p>
    </section>
  `;
}

function buildCreditsSection(credits, contributions) {
  const hasCredits = credits && credits.length;
  const hasContributions = contributions && contributions.length;
  if (!hasCredits && !hasContributions) return "";

  const boxes = [];

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

  const galleryItems = (work.cover
    ? work.gallery.filter(item => item !== work.cover)
    : work.gallery.slice())
    .filter(Boolean);

  if (!galleryItems.length) return "";

  function buildGalleryImage(src, extraClass = "") {
    const className = ["work-gallery-image", extraClass].filter(Boolean).join(" ");
    return `<img class="${className}" src="${src}" alt="${work.title}" loading="lazy" />`;
  }

  function buildGalleryItem(item) {
    if (typeof item === "string") {
      return buildGalleryImage(item);
    }

    if (!item || typeof item !== "object") {
      return "";
    }

    if (item.type === "row" && Array.isArray(item.items)) {
      const rowItems = item.items
        .filter(Boolean)
        .map(src => buildGalleryImage(src))
        .join("");

      if (!rowItems) return "";

      return `<div class="work-gallery-row">${rowItems}</div>`;
    }

    if (item.src) {
      return buildGalleryImage(item.src);
    }

    return "";
  }

  return `
    <div class="work-gallery">
      ${galleryItems
        .map(buildGalleryItem)
        .join("")}
    </div>
  `;
}

function buildVideosSection(work) {
  if (!work.videos || !work.videos.length) return "";
  const sectionTitle = work.videoSectionTitle || "Video";

  function getYouTubeId(value) {
    const raw = (value || "").trim();
    if (!raw) return "";
    if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

    try {
      const parsed = new URL(raw);
      const host = parsed.hostname.toLowerCase();

      if (host === "youtu.be") {
        return parsed.pathname.replace(/^\/+/, "").split("/")[0] || "";
      }

      if (host === "youtube.com" || host === "www.youtube.com" || host === "m.youtube.com") {
        const videoId = parsed.searchParams.get("v");
        if (videoId) return videoId;

        const parts = parsed.pathname.split("/").filter(Boolean);
        if (parts[0] === "embed" && parts[1]) return parts[1];
        if (parts[0] === "shorts" && parts[1]) return parts[1];
      }
    } catch {
      return "";
    }

    return "";
  }

  return `
    <div class="detail-section">
      <h2 class="detail-h2">${sectionTitle}</h2>
      <div class="video-grid">
        ${work.videos
          .map(video => {
            if (video.type === "youtube") {
              const youtubeId = getYouTubeId(video.id || video.url || "");
              if (!youtubeId) return "";

              return `
                <div class="video-card">
                  <div class="video-embed">
                    <iframe
                      src="https://www.youtube.com/embed/${youtubeId}"
                      title="${video.label || work.title}"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerpolicy="strict-origin-when-cross-origin"
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

let itchApiLoadPromise = null;

function ensureItchApiLoaded() {
  if (window.Itch) return Promise.resolve(window.Itch);
  if (itchApiLoadPromise) return itchApiLoadPromise;

  itchApiLoadPromise = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://static.itch.io/api.js";
    script.async = true;
    script.dataset.itchApi = "true";
    script.onload = () => resolve(window.Itch);
    script.onerror = () => reject(new Error("Failed to load itch.io API"));
    document.head.appendChild(script);
  });

  return itchApiLoadPromise;
}

function enhanceItchPreviews(container) {
  const cards = Array.from(container.querySelectorAll(".link-preview-itch[data-itch-user][data-itch-game]"));
  if (!cards.length) return;

  ensureItchApiLoaded()
    .then(Itch => {
      if (!Itch) return;

      cards.forEach(card => {
        const { itchUser, itchGame } = card.dataset;
        const buyButton = card.querySelector("[data-itch-buy-button]");
        const price = card.querySelector("[data-itch-price]");
        const meta = card.querySelector("[data-itch-meta]");

        if (buyButton && Itch.attachBuyButton) {
          Itch.attachBuyButton(buyButton, {
            user: itchUser,
            game: itchGame,
            width: 720,
            height: 480
          });
        }

        if (!meta || !Itch.getGameData) return;

        Itch.getGameData({
          user: itchUser,
          game: itchGame,
          onComplete: data => {
            if (!data) return;

            if (price && data.price) {
              price.textContent = data.price;
              price.hidden = false;
            }

            if (!meta) return;

            const metaParts = [];
            if (data.sale && data.sale.rate && data.original_price) {
              metaParts.push(`was ${data.original_price}`);
              metaParts.push(`${data.sale.rate}% off`);
            } else if (data.price) {
              metaParts.push("Available on itch.io");
            }

            if (metaParts.length) {
              meta.textContent = metaParts.join(" · ");
            }
          }
        });
      });
    })
    .catch(() => {
      // Leave the direct itch.io link intact if the API script is blocked.
    });
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
  const heroTags = buildTagLinks(work.tags, { variant: "inline" });

  container.innerHTML = `
    ${buildAmbientDecor(work)}
    <article class="work-detail">
      <a href="all.html" class="back-link">Back to All Works</a>

      ${buildHeroBanner(work)}

      <header class="work-hero-main">
        <div class="work-hero-topline">
          <div class="work-hero-meta-stack">
            ${heroTags}
            <p class="work-meta-line">
              <span class="work-sub">
                <a class="work-meta-boxed work-meta-link" href="${categoryFilterUrl}">${work.category}</a>
                <a class="work-meta-boxed work-meta-link" href="${yearFilterUrl}">${work.year}</a>
              </span>
            </p>
          </div>
          ${projectStatus ? `<span class="work-collaboration">${projectStatus}</span>` : ""}
        </div>
        <h1>${work.title}</h1>
      </header>

      ${buildCreditsSection(work.credits, work.contributions)}
      ${buildIntroSection(work.intro)}

      ${work.sections && work.sections.length ? buildSections(work.sections) : ""}
      ${buildVideosSection(work)}
      ${buildGallery(work)}
      ${buildLinksSection(work)}
    </article>
  `;

  enhanceItchPreviews(container);
}
