(function () {
  const tagRow = document.getElementById("tagRow");
  const yearRow = document.getElementById("yearRow");
  const cards = Array.from(document.querySelectorAll(".work-card"));
  const noResults = document.getElementById("noResults");
  if (!tagRow || !yearRow || !noResults) return;

  const tagButtons = Array.from(tagRow.querySelectorAll(".tag"));
  const availableTags = new Set(
    tagButtons
      .map(button => normalizeTag(button.dataset.tag))
      .filter(tag => tag && tag !== "all")
  );
  const selectedTags = new Set();
  let selectedYear = "all";

  // Populate year filter buttons
  const years = new Set(window.WORKS.map(work => work.year.toString()));
  const sortedYears = Array.from(years).sort((a, b) => b - a);
  sortedYears.forEach(year => {
    const button = document.createElement("button");
    button.className = "tag";
    button.dataset.year = year;
    button.textContent = year;
    yearRow.appendChild(button);
  });
  const yearButtons = Array.from(yearRow.querySelectorAll(".tag"));

  function normalizeTag(value) {
    return (value || "").trim().toLowerCase();
  }

  function setButtonState(button, isActive) {
    button.classList.toggle("is-active", isActive);
    button.setAttribute("aria-pressed", isActive ? "true" : "false");
  }

  function syncButtons() {
    tagButtons.forEach(button => {
      const tag = normalizeTag(button.dataset.tag);
      const isAll = tag === "all";
      const isActive = isAll ? selectedTags.size === 0 : selectedTags.has(tag);
      setButtonState(button, isActive);
    });
    yearButtons.forEach(button => {
      const year = button.dataset.year;
      setButtonState(button, year === selectedYear);
    });
  }

  function filterByTagsAndYear() {
    let visibleCount = 0;

    cards.forEach(card => {
      let cardTags = [];
      try {
        cardTags = JSON.parse(card.getAttribute("data-tags") || "[]")
          .map(normalizeTag)
          .filter(Boolean);
      } catch (error) {
        cardTags = [];
      }
      const cardYear = card.querySelector(".work-sub span:last-child").textContent;

      const tagMatch =
        selectedTags.size === 0 ||
        Array.from(selectedTags).every(tag => cardTags.includes(tag));
      
      const yearMatch = selectedYear === "all" || cardYear === selectedYear;

      const show = tagMatch && yearMatch;

      card.style.display = show ? "" : "none";
      if (show) visibleCount += 1;
    });

    noResults.hidden = visibleCount !== 0;
  }

  function syncURL() {
    const url = new URL(window.location.href);
    url.searchParams.delete("tag");
    url.searchParams.delete("tags");
    url.searchParams.delete("year");

    Array.from(selectedTags).forEach(tag => {
      url.searchParams.append("tag", tag);
    });
    if (selectedYear !== "all") {
      url.searchParams.set("year", selectedYear);
    }

    history.replaceState(null, "", url);
  }

  function readTagsFromURL() {
    const params = new URLSearchParams(window.location.search);
    const repeatedTags = params.getAll("tag").map(normalizeTag).filter(Boolean);
    const csvTags = (params.get("tags") || "")
      .split(",")
      .map(normalizeTag)
      .filter(Boolean);

    return Array.from(new Set([...repeatedTags, ...csvTags]))
      .filter(tag => availableTags.has(tag));
  }
  
  function readYearFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get("year") || "all";
  }

  function applyFiltersFromURL() {
    const urlTags = readTagsFromURL();
    if (urlTags.length > 0) {
      const singleTag = urlTags[0];
      if (singleTag && singleTag !== "all") {
        selectedTags.add(singleTag);
      }
    }

    selectedYear = readYearFromURL();

    syncButtons();
    filterByTagsAndYear();

    const grid = document.getElementById("workGrid");
    if (grid) grid.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  tagRow.addEventListener("click", event => {
    const button = event.target.closest(".tag");
    if (!button) return;

    const tag = normalizeTag(button.dataset.tag || "all");

    if (tag === "all") {
      selectedTags.clear();
    } else {
      selectedTags.clear();
      selectedTags.add(tag);
    }

    syncButtons();
    filterByTagsAndYear();
    syncURL();
  });

  yearRow.addEventListener("click", event => {
    const button = event.target.closest(".tag");
    if (!button) return;

    selectedYear = button.dataset.year || "all";

    syncButtons();
    filterByTagsAndYear();
    syncURL();
  });

  syncButtons();
  filterByTagsAndYear();
  applyFiltersFromURL();
})();
