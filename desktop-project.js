function renderProject(content, project) {
  const article = document.createElement("article");
  article.className = "os-document project-document";

  function add(parent, tag, value, className) {
    const element = document.createElement(tag);
    if (value) element.textContent = value;
    if (className) element.className = className;
    parent.append(element);
    return element;
  }

  function section(title) {
    const element = add(article, "section", "", "document-section");
    add(element, "h4", title);
    return element;
  }

  function link(parent, label, url) {
    const element = add(parent, "a", label);
    element.href = url;
    return element;
  }

  function image(parent, src, alt) {
    const element = add(parent, "img");
    element.src = src;
    element.alt = alt;
    element.loading = "lazy";
  }

  add(article, "h3", project.title);
  const metadata = add(article, "div", "", "document-links");
  const tag = project.tags?.[0];
  if (project.category && tag) link(metadata, project.category, "desktop.html?app=work&tag=" + encodeURIComponent(tag));
  else if (project.category) add(metadata, "span", project.category);
  if (project.year) link(metadata, String(project.year), "desktop.html?app=work&year=" + project.year);
  if (project.collaboration) add(metadata, "span", project.collaboration === "individual" ? "solo" : project.collaboration);
  if (project.intro || project.blurb) add(article, "p", project.intro || project.blurb);
  if (project.cover) image(article, project.cover, project.title + " cover");

  if (project.credits?.length) {
    const credits = add(section("Credits"), "dl", "", "project-credits");
    for (const credit of project.credits) {
      add(credits, "dt", credit.label);
      add(credits, "dd", credit.value);
    }
  }
  if (project.contributions?.length) {
    const list = add(section("Contribution"), "ul");
    for (const contribution of project.contributions) add(list, "li", contribution);
  }
  for (const entry of project.sections || []) {
    const details = section(entry.heading);
    // Section bodies are authored markup in the local project data.
    add(details, "div").innerHTML = entry.text || "";
  }
  if (project.links?.length) {
    const links = add(section("Links"), "div", "", "document-links");
    for (const entry of project.links) {
      const element = link(links, entry.label, entry.url);
      element.target = "_blank";
      element.rel = "noopener";
    }
  }
  const gallery = (project.gallery || [])
    .flatMap(entry => typeof entry === "string" ? [entry] : entry.items || [])
    .filter(src => src !== project.cover);
  if (gallery.length) {
    const media = add(section("Gallery"), "div", "", "project-gallery");
    gallery.forEach((src, index) => {
      const original = link(media, "", src);
      original.target = "_blank";
      original.rel = "noopener";
      image(original, src, project.title + " gallery image " + (index + 1) + " · open original");
    });
  }
  if (project.videos?.length) {
    const videos = section(project.videoSectionTitle || "Video");
    for (const video of project.videos) {
      const caption = video.label || project.title;
      if (video.type === "local") {
        const player = add(videos, "video");
        player.src = video.src;
        player.controls = true;
        player.preload = "metadata";
        player.playsInline = true;
        player.setAttribute("aria-label", caption);
      } else {
        const source = video.url || (video.type === "vimeo"
          ? "https://vimeo.com/" + video.id
          : "https://www.youtube.com/watch?v=" + video.id);
        const watch = link(add(videos, "p"), caption + " ↗", source);
        watch.target = "_blank";
        watch.rel = "noopener";
      }
    }
  }
  content.append(article);
}
