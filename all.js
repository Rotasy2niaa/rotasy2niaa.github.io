(function () {
  const tagRow = document.getElementById("tagRow");
  const cards = Array.from(document.querySelectorAll(".work-card"));
  const noResults = document.getElementById("noResults");

  function setActiveTag(btn) {
    const buttons = Array.from(tagRow.querySelectorAll(".tag"));
    buttons.forEach(b => {
      const isActive = b === btn;
      b.classList.toggle("is-active", isActive);
      b.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function filterByTag(tag) {
    let visibleCount = 0;

    cards.forEach(card => {
      const tags = (card.getAttribute("data-tags") || "")
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean);

      const show = (tag === "all") || tags.includes(tag);
      card.style.display = show ? "" : "none";
      if (show) visibleCount += 1;
    });

    noResults.hidden = visibleCount !== 0;
  }

  // NEW: apply ?tag=xxx on page load
  function applyTagFromURL() {
    const params = new URLSearchParams(window.location.search);
    const rawTag = params.get("tag");
    const tag = (rawTag || "").toLowerCase();
    if (!tag) return false;

    // Find the matching button and simulate a click
    // CSS.escape makes it safe for unusual tag strings
    const btn = tagRow.querySelector(`.tag[data-tag="${CSS.escape(tag)}"]`);
    if (!btn) return false;

    setActiveTag(btn);
    filterByTag(tag);

    // Optional: scroll results into view
    const grid = document.getElementById("workGrid");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });

    return true;
  }

  tagRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag");
    if (!btn) return;

    const tag = (btn.dataset.tag || "all").toLowerCase();
    setActiveTag(btn);
    filterByTag(tag);

    // Optional: keep URL in sync when user clicks tags
    const url = new URL(window.location.href);
    if (tag === "all") url.searchParams.delete("tag");
    else url.searchParams.set("tag", tag);
    history.replaceState(null, "", url);
  });

  // Default
  filterByTag("all");

  // If URL has tag, override default
  applyTagFromURL();
})();
