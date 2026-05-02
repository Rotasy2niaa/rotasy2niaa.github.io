(function () {
  const RESUME_VERSIONS = {
    "en-designer": {
      label: "English / Designer",
      file: "res/File/Shan%20Lin%20resume2025.pdf"
    },
    "en-producer": {
      label: "English / Producer",
      file: ""
    },
    "zh-designer": {
      label: "\u4e2d\u6587 / \u8bbe\u8ba1",
      file: ""
    },
    "zh-producer": {
      label: "\u4e2d\u6587 / \u5236\u4f5c\u4eba",
      file: ""
    }
  };

  const buttons = Array.from(document.querySelectorAll(".resume-option"));
  const frame = document.getElementById("resumeFrame");
  const status = document.getElementById("resumeStatus");
  const openLink = document.getElementById("resumeOpenLink");
  const fallbackLink = document.getElementById("resumeFallbackLink");
  const missing = document.getElementById("resumeMissing");

  if (!buttons.length || !frame || !status || !openLink || !fallbackLink || !missing) return;

  const firstAvailableKey = Object.keys(RESUME_VERSIONS).find(
    key => RESUME_VERSIONS[key].file
  ) || "en-designer";

  function setActiveButton(activeKey) {
    buttons.forEach(button => {
      const isActive = button.dataset.resumeKey === activeKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function setOpenLink(file) {
    if (file) {
      openLink.href = file;
      fallbackLink.href = file;
      openLink.removeAttribute("aria-disabled");
      openLink.classList.remove("is-disabled");
      openLink.tabIndex = 0;
      return;
    }

    openLink.href = "#";
    fallbackLink.href = "#";
    openLink.setAttribute("aria-disabled", "true");
    openLink.classList.add("is-disabled");
    openLink.tabIndex = -1;
  }

  function showVersion(key) {
    const version = RESUME_VERSIONS[key] || RESUME_VERSIONS[firstAvailableKey];
    const hasFile = Boolean(version.file);

    setActiveButton(key);
    status.textContent = version.label;
    setOpenLink(version.file);

    if (hasFile) {
      frame.hidden = false;
      frame.data = version.file;
      missing.hidden = true;
      return;
    }

    frame.hidden = true;
    frame.removeAttribute("data");
    missing.hidden = false;
  }

  openLink.addEventListener("click", event => {
    if (openLink.getAttribute("aria-disabled") === "true") {
      event.preventDefault();
    }
  });

  buttons.forEach(button => {
    button.addEventListener("click", () => {
      showVersion(button.dataset.resumeKey);
    });
  });

  showVersion(firstAvailableKey);
})();
