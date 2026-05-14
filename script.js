(function () {
  const projectField = document.getElementById("dreamProjectField");
  const anotherDreamButton = document.getElementById("anotherDreamButton");
  const dreamStatus = document.getElementById("dreamStatus");

  if (!projectField || !anotherDreamButton) {
    return;
  }

  const reducedMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;

  const state = {
    works: normalizeWorks(window.WORKS),
    currentWork: null,
    reducedMotion: Boolean(reducedMotionQuery && reducedMotionQuery.matches),
    isShuffling: false
  };

  if (!state.works.length) {
    renderEmptyState();
    return;
  }

  if (reducedMotionQuery) {
    const syncReducedMotion = event => {
      state.reducedMotion = event.matches;
    };

    if (typeof reducedMotionQuery.addEventListener === "function") {
      reducedMotionQuery.addEventListener("change", syncReducedMotion);
    } else if (typeof reducedMotionQuery.addListener === "function") {
      reducedMotionQuery.addListener(syncReducedMotion);
    }
  }

  anotherDreamButton.addEventListener("click", showAnotherDream);

  renderDream(pickNextWork());

  function normalizeWorks(works) {
    if (!Array.isArray(works)) {
      return [];
    }

    return works
      .filter(work => work && work.slug && work.title)
      .map((work, index) => {
        const gallery = Array.isArray(work.gallery) ? work.gallery.filter(Boolean) : [];
        const year = work.year == null ? "" : String(work.year);
        const cover = work.cover || gallery[0] || "";
        const description = summarizeDescription(work);

        return {
          ...work,
          year,
          cover,
          description,
          href: `work.html?slug=${encodeURIComponent(work.slug)}`,
          imageCandidates: uniqueValues([cover].concat(gallery)).filter(Boolean),
          placeholderImage: buildPlaceholderImage({
            title: work.title,
            category: work.category || "Dream",
            year
          }),
          order: index
        };
      });
  }

  function summarizeDescription(work) {
    const raw = work.description || work.blurb || work.intro || "";
    const normalized = String(raw).replace(/\s+/g, " ").trim();

    if (!normalized) {
      return "A drifting fragment from the dream archive.";
    }

    if (normalized.length <= 150) {
      return normalized;
    }

    return `${normalized.slice(0, 147).trimEnd()}...`;
  }

  function uniqueValues(values) {
    return Array.from(new Set((values || []).filter(Boolean)));
  }

  function buildPlaceholderImage(work) {
    const title = escapeSvg(work.title || "Untitled Dream");
    const meta = escapeSvg([work.category, work.year].filter(Boolean).join(" / "));

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 800">
        <rect width="800" height="800" fill="#17131b"/>
        <rect x="52" y="52" width="696" height="696" fill="#221c25" stroke="#d8beb7" stroke-opacity="0.32" stroke-width="2"/>
        <circle cx="236" cy="244" r="128" fill="#69314a" fill-opacity="0.46"/>
        <circle cx="586" cy="542" r="152" fill="#264842" fill-opacity="0.34"/>
        <text x="88" y="610" fill="#f4ebe7" font-family="'Times New Roman', serif" font-size="76" letter-spacing="4">${title}</text>
        <text x="92" y="664" fill="#c8b8b6" font-family="'Courier New', monospace" font-size="24" letter-spacing="6">${meta}</text>
      </svg>
    `;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function escapeSvg(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&apos;");
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  function shuffle(list) {
    const copy = list.slice();

    for (let index = copy.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      const temp = copy[index];
      copy[index] = copy[swapIndex];
      copy[swapIndex] = temp;
    }

    return copy;
  }

  function getDreamPool() {
    const featured = shuffle(state.works.filter(work => work.selected));
    const archive = shuffle(state.works.filter(work => !work.selected));
    const combined = featured.concat(archive);

    return combined.length ? combined : shuffle(state.works);
  }

  function pickNextWork() {
    const pool = getDreamPool();

    if (!state.currentWork) {
      return pool[0] || null;
    }

    const next = pool.find(work => work.slug !== state.currentWork.slug);
    return next || state.currentWork;
  }

  function renderDream(work) {
    projectField.innerHTML = "";

    if (!work) {
      renderEmptyState();
      return;
    }

    state.currentWork = work;

    const projectBubble = buildDreamBubble(work);
    projectField.appendChild(projectBubble);

    if (dreamStatus) {
      dreamStatus.textContent = `Showing dream: ${work.title}.`;
    }
  }

  function buildDreamBubble(work) {
    const wrap = document.createElement("article");
    const meta = [work.category, work.year].filter(Boolean).join(" / ");

    wrap.className = "dream-bubble-wrap";
    wrap.innerHTML = `
      <a class="dream-bubble" href="${work.href}">
        <span class="dream-bubble-shell">
          <span class="dream-bubble-image">
            <img alt="" loading="lazy" decoding="async" />
          </span>
        </span>
      </a>
      <div class="dream-bubble-copy">
        <div class="dream-bubble-meta">${escapeHtml(meta || "Dream")}</div>
        <h2 class="dream-bubble-title">${escapeHtml(work.title)}</h2>
        <p class="dream-bubble-description">${escapeHtml(work.description)}</p>
        <div class="dream-bubble-hint">Open dream</div>
      </div>
    `;

    const bubble = wrap.querySelector(".dream-bubble");
    const image = wrap.querySelector("img");

    if (bubble) {
      bubble.setAttribute(
      "aria-label",
      `${work.title}${meta ? `. ${meta}.` : "."} Open project detail.`
      );
      bubble.addEventListener("click", handleBubbleClick);
    }

    if (image) {
      assignBubbleImage(image, work);
    }

    return wrap;
  }

  function assignBubbleImage(image, work) {
    const candidates = work.imageCandidates.slice();

    function setNextSource() {
      const nextSource = candidates.shift();

      if (nextSource) {
        image.src = nextSource;
        return;
      }

      image.onerror = null;
      image.src = work.placeholderImage;
    }

    image.onerror = setNextSource;
    setNextSource();
  }

  function handleBubbleClick(event) {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    event.preventDefault();

    const bubble = event.currentTarget;
    const wrap = bubble ? bubble.closest(".dream-bubble-wrap") : null;

    if (!bubble || !wrap || wrap.classList.contains("is-opening")) {
      return;
    }

    wrap.classList.add("is-opening");

    window.setTimeout(() => {
      window.location.href = bubble.href;
    }, state.reducedMotion ? 90 : 240);
  }

  function showAnotherDream() {
    if (state.isShuffling) {
      return;
    }

    state.isShuffling = true;
    anotherDreamButton.disabled = true;
    projectField.classList.add("is-shuffling");

    window.setTimeout(() => {
      renderDream(pickNextWork());
      projectField.classList.remove("is-shuffling");
      anotherDreamButton.disabled = false;
      state.isShuffling = false;
    }, state.reducedMotion ? 100 : 240);
  }

  function renderEmptyState() {
    projectField.innerHTML = `
      <div class="dream-empty">
        No projects are drifting right now. Try the archive in <a href="all.html">All Works</a>.
      </div>
    `;
  }
})();
