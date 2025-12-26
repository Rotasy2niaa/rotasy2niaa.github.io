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

  tagRow.addEventListener("click", (e) => {
    const btn = e.target.closest(".tag");
    if (!btn) return;

    const tag = (btn.dataset.tag || "all").toLowerCase();
    setActiveTag(btn);
    filterByTag(tag);
  });

  filterByTag("all");
})();
