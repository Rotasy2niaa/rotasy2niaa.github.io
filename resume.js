(function () {
  const RESUME_VERSIONS = {
    "en-designer": {
      label: "English / Designer",
      openUrl: "https://drive.google.com/file/d/1ywteaSgiErVN4RNzRLbX16KqsMTxPs-w/view?usp=drive_link",
      embedUrl: "https://drive.google.com/file/d/1ywteaSgiErVN4RNzRLbX16KqsMTxPs-w/preview"
    },
    "en-producer": {
      label: "English / Producer",
      openUrl: "https://drive.google.com/file/d/1FXapVvFKslPeYGyRjx465IwHNzYF5BSp/view?usp=drive_link",
      embedUrl: "https://drive.google.com/file/d/1FXapVvFKslPeYGyRjx465IwHNzYF5BSp/preview"
    },
    "zh-designer": {
      label: "\u4e2d\u6587 / \u8bbe\u8ba1",
      openUrl: "",
      embedUrl: ""
    },
    "zh-producer": {
      label: "\u4e2d\u6587 / \u5236\u4f5c\u4eba",
      openUrl: "",
      embedUrl: ""
    }
  };

  const buttons = Array.from(document.querySelectorAll(".resume-option"));
  const frame = document.getElementById("resumeFrame");
  const status = document.getElementById("resumeStatus");
  const openLink = document.getElementById("resumeOpenLink");
  const fallback = document.getElementById("resumeFallback");
  const fallbackLink = document.getElementById("resumeFallbackLink");
  const missing = document.getElementById("resumeMissing");

  if (!buttons.length || !frame || !status || !openLink || !fallback || !fallbackLink || !missing) return;

  const firstAvailableKey = Object.keys(RESUME_VERSIONS).find(
    key => RESUME_VERSIONS[key].openUrl || RESUME_VERSIONS[key].embedUrl
  ) || "en-designer";

  function setActiveButton(activeKey) {
    buttons.forEach(button => {
      const isActive = button.dataset.resumeKey === activeKey;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-pressed", isActive ? "true" : "false");
    });
  }

  function setOpenLink(url) {
    if (url) {
      openLink.href = url;
      fallbackLink.href = url;
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
    const frameUrl = version.embedUrl || version.openUrl;
    const hasFile = Boolean(frameUrl);

    setActiveButton(key);
    status.textContent = version.label;
    setOpenLink(version.openUrl || frameUrl);

    if (hasFile) {
      frame.hidden = false;
      frame.src = frameUrl;
      fallback.hidden = false;
      missing.hidden = true;
      return;
    }

    frame.hidden = true;
    frame.removeAttribute("src");
    fallback.hidden = true;
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
