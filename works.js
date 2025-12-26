// works.js
// Single source of truth for all works.

window.WORKS = [
  {
    slug: "ethereal-spaces",
    title: "Ethereal Spaces",
    category: "Interior Design",
    year: 2024,
    blurb: "A minimalist approach to contemporary living spaces",
    tags: ["installation", "individual", "residential"],
    cover: "res/bg.png",
    selected: true,

    // detail page content
    intro: "This project explores soft light, quiet geometry, and restrained material palettes.",
    gallery: ["res/bg.png", "res/bg.png"],
    credits: [
      { label: "Role", value: "Designer" },
      { label: "Tools", value: "SketchUp, Blender" }
    ]
  },
  {
    slug: "urban-canvas",
    title: "Urban Canvas",
    category: "Photography",
    year: 2024,
    blurb: "Finding rhythm and color in everyday structures",
    tags: ["digital", "individual"],
    cover: "res/bg.png",
    selected: true,
    intro: "Street compositions as graphic studies.",
    gallery: ["res/bg.png"]
  },
  {
    slug: "textile-dreams",
    title: "Textile Dreams",
    category: "Textile Design",
    year: 2023,
    blurb: "Pattern studies inspired by memory and repetition",
    tags: ["handmade", "series"],
    cover: "res/bg.png",
    selected: false,
    intro: "A small series of pattern experiments.",
    gallery: ["res/bg.png"]
  }
];
