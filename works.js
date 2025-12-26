// works.js
// Single source of truth for all works.
//
// Tag system (must match your All Works filter tags):
// video-game, board-game, collaborative, individual, installation, exhibition, mixed-media,
// painting, film, photography, article, processing, arduino
//
// Rule: every work must include EXACTLY ONE of: individual / collaborative
// You specified: Life Cycle, Cyber Agent, Get Ashore, Rain Collection are individual.
// Everything else is collaborative.

window.WORKS = [
  // =========================
  // 2025
  // =========================

  {
    slug: "insync-maze",
    title: "InSync",
    category: "Maze Installation",
    year: 2025,
    blurb: "A non visual multisensory tactile maze guided entirely by touch",
    tags: ["installation", "exhibition", "collaborative"],
    cover: "res/insyncposter.jpg",
    selected: true,

    links: [],
    videos: [{ label: "Trailer", type: "youtube", id: "YOUR_ID" }],

    intro:
      "Designed and fabricated a 9×12 inch tactile maze installation exploring intuitive bodily perception of space and texture.",
    gallery: ["res/insync poster.png", "res/insync maze.png"],
    credits: [{ label: "Role", value: "Maze and Experience Designer" }]
  },

  {
    slug: "how-to-pet-your-cat",
    title: "How to Pet Your Cat",
    category: "Alt Ctrl Experience",
    year: 2025,
    blurb: "A physical digital experience featuring a custom built controller",
    tags: ["installation", "exhibition", "arduino", "collaborative"],
    cover: "res/bg.png",
    selected: true,

    links: [],
    videos: [],

    intro:
      "A physical digital experience featuring a custom built controller, designed for live showcases and playful crowd flow.",
    gallery: ["res/bg.png", "res/bg.png"],
    credits: [{ label: "Role", value: "Experience Designer and Installation Artist" }]
  },

  // =========================
  // 2023
  // =========================

  {
    slug: "cyber-agent",
    title: "Cyber Agent",
    category: "Board Game",
    year: 2023,
    blurb: "A two player tabletop game about espionage on the internet",
    tags: ["board-game", "individual"],
    cover: "res/ShanLinPortfolio-Final-11.png",
    selected: true,

    links: [],
    videos: [],

    intro:
      "A two player tabletop game about internet espionage, designed as an individual project for personal interest.",
    gallery: [
      "res/ShanLinPortfolio-Final-11.png",
      "res/ShanLinPortfolio-Final-12.png",
      "res/ShanLinPortfolio-Final-13.png",
      "res/ShanLinPortfolio-Final-14.png",
      "res/ShanLinPortfolio-Final-15.png",
      "res/ShanLinPortfolio-Final-16.png",
      "res/ShanLinPortfolio-Final-17.png",
      "res/ShanLinPortfolio-Final-18.png"
    ],
    credits: [
      { label: "Date", value: "August 2023" },
      { label: "Role", value: "Game Designer, Game Artist" },
      { label: "Team", value: "Individual" }
    ]
  },

  {
    slug: "discriminative-touch",
    title: "Discriminative Touch",
    category: "Unity Game",
    year: 2023,
    blurb: "A narrative simulation about blindness and sensory perception",
    tags: ["video-game", "collaborative"],
    cover: "res/ShanLinPortfolio-Final-28.png",
    selected: true,

    links: [{ label: "Play on itch.io", url: "https://rotasy2niaa.itch.io/discriminative-touch" }],
    videos: [],

    intro:
      "A heartwarming narrative and simulation game about a person who is blind and must rely on touch, hearing, smell, and taste. Made in CiGA Game Jam 2023 (Theme: Touch), Shenzhen.",
    gallery: ["res/ShanLinPortfolio-Final-29.png"],
    credits: [
      { label: "Date", value: "July 2023" },
      { label: "Role", value: "Project Leader, Game Designer, Game Artist" },
      { label: "Engine", value: "Unity" }
    ]
  },

  {
    slug: "unspeakable",
    title: "Unspeakable",
    category: "Installation Series",
    year: 2023,
    blurb: "Arduino and Processing based installations exploring emotion beyond spoken language",
    tags: ["installation", "arduino", "processing", "collaborative"],
    cover: "res/bg.png",
    selected: false,

    links: [{ label: "View project page", url: "https://rotasy2niaa.github.io/2023/03/08/Unspeakable/" }],
    videos: [],

    intro:
      "A series of artworks exploring how feelings and emotions can be expressed and communicated through aesthetics without spoken language. Built with electronics and creative coding.",
    gallery: ["res/bg.png"],
    credits: [
      { label: "Date", value: "May 2023" },
      { label: "Role", value: "Programmer, Designer, Artist" },
      { label: "Tools", value: "Arduino, Processing" }
    ]
  },

  {
    slug: "noah-had-no-wings",
    title: "Noah Had No Wings",
    category: "Web Game (Figma)",
    year: 2023,
    blurb: "A warm healing conversation based simulation game",
    tags: ["video-game", "collaborative"],
    cover: "res/NoahCover.png",
    selected: false,

    links: [{ label: "Play on itch.io", url: "https://rotasy2niaa.itch.io/noah-had-no-wings" }],
    videos: [],

    intro:
      "A conversation focused simulation game with a warm and healing tone. Made in Artificial Nature Game Jam.",
    gallery: [
      "res/ShanLinPortfolio-Final-27.png",
      "res/Noah1.png",
      "res/Noah2.png",
      "res/Noah4.png",
      "res/Noah5.png",
      "res/Noah6.png",
      "res/Noah7.png"
    ],
    credits: [
      { label: "Date", value: "April 2023" },
      { label: "Role", value: "Game Designer, Pixel Artist" },
      { label: "Platform", value: "Web (Figma)" }
    ]
  },

  {
    slug: "root-up",
    title: "Root Up",
    category: "Unity Game",
    year: 2023,
    blurb: "A sci fi RTS about building survival structures via a grid based pipe system",
    tags: ["video-game", "collaborative"],
    cover: "res/bg.png",
    selected: false,

    links: [{ label: "Play on itch.io", url: "https://rotasy2niaa.itch.io/root-up" }],
    videos: [],

    intro:
      "A sci fi real time strategy game where players explore an underworld using a grid based pipe system and manage resources to build structures for survival in the upper world. Made in Global Game Jam 2023 (Theme: Root), Shenzhen.",
    gallery: ["res/bg.png"],
    credits: [
      { label: "Date", value: "February 2023" },
      { label: "Role", value: "Game Artist" },
      { label: "Engine", value: "Unity" }
    ]
  },

  // =========================
  // 2022
  // =========================

  {
    slug: "get-ashore",
    title: "Get Ashore",
    category: "Prototype Game",
    year: 2022,
    blurb: "A narrative point and click game about an East Asian get ashore culture",
    tags: ["video-game", "individual"],
    cover: "res/GETASHORECOVER.png",
    selected: false,

    links: [{ label: "Watch video", url: "https://youtu.be/Lha_cyLymxo" }],
    videos: [{ label: "Video", type: "youtube", id: "Lha_cyLymxo" }],

    intro:
      "A narrative point and click prototype exploring the special get ashore culture in East Asian society, made for personal interest.",
    gallery: [
      "res/ShanLinPortfolio-Final-03.png",
      "res/ShanLinPortfolio-Final-04.png",
      "res/ShanLinPortfolio-Final-05.png",
      "res/ShanLinPortfolio-Final-06.png",
      "res/ShanLinPortfolio-Final-07.png",
      "res/ShanLinPortfolio-Final-08.png",
      "res/ShanLinPortfolio-Final-09.png",
      "res/ShanLinPortfolio-Final-10.png"
    ],
    credits: [
      { label: "Date", value: "December 2022" },
      { label: "Role", value: "Game Designer, Pixel Artist" }
    ]
  },

  {
    slug: "nightmare-yuanmeng",
    title: "Nightmare 渊梦",
    category: "Unity Game",
    year: 2022,
    blurb: "A 2D platformer about a girl fighting against her fear",
    tags: ["video-game", "collaborative"],
    cover: "res/bg.png",
    selected: false,

    links: [{ label: "Play on itch.io", url: "https://vappa.itch.io/yuanmeng" }],
    videos: [],

    intro:
      "A 2D platform game about a girl fighting against her fear. Made in Yi-youweijin (益·游未尽) 72 hour Game Jam (Theme: Healing).",
    gallery: ["res/bg.png"],
    credits: [
      { label: "Date", value: "August 2022" },
      { label: "Role", value: "Game Designer, Pixel Artist" },
      { label: "Engine", value: "Unity" }
    ]
  },

  {
    slug: "the-human-beings-museum",
    title: "The Human Beings Museum",
    category: "VR Immersive Experience",
    year: 2022,
    blurb: "A VR museum where the player time travels through an extinct human beings archive",
    tags: ["video-game", "collaborative"],
    cover: "res/bg.png",
    selected: false,

    links: [{ label: "Watch video", url: "https://youtu.be/HbX2ajx4_Xo" }],
    videos: [{ label: "Video", type: "youtube", id: "HbX2ajx4_Xo" }],

    intro:
      "A VR immersive experience where the player is a human being time traveler visiting a museum about extinct human beings. Made in UCLA online summer course Introduction to Immersive Experience Design.",
    gallery: [
      "res/ShanLinPortfolio-Final-30.png",
      "res/ShanLinPortfolio-Final-31.png",
      "res/ShanLinPortfolio-Final-32.png"
    ],
    credits: [
      { label: "Date", value: "August 2022" },
      { label: "Role", value: "Project Leader, Programmer, Designer, Artist" },
      { label: "Engine", value: "Unity" }
    ]
  },

  {
    slug: "dice-valley",
    title: "Dice Valley",
    category: "Unity Game",
    year: 2022,
    blurb: "A 3D puzzle game about rolling and transforming a dice to reach the goal face up",
    tags: ["video-game", "collaborative"],
    cover: "res/DiceValley2.png",
    selected: false,

    links: [{ label: "Play on itch.io", url: "https://nortus.itch.io/dice-valley" }],
    videos: [],

    intro:
      "Made for GMTK Game Jam 2022 (Theme: Dice). Players roll and transform a dice to land on the destination with the correct face up.",
    gallery: ["res/ShanLinPortfolio-Final-23.png"],
    credits: [
      { label: "Date", value: "July 2022" },
      { label: "Role", value: "Game Designer, Game Artist" },
      { label: "Engine", value: "Unity" }
    ]
  },

  {
    slug: "tricky-life",
    title: "Tricky Life",
    category: "Unity Game",
    year: 2022,
    blurb: "An RPG about quarantine, hallucination, and searching for missing pills",
    tags: ["video-game", "collaborative"],
    cover: "res/bg.png",
    selected: false,

    links: [{ label: "Play on itch.io", url: "https://rotasy2niaa.itch.io/tricky-life" }],
    videos: [],

    intro:
      "A role playing game about a girl with DID who runs out of pills during quarantine, hallucinates, and leaves her apartment to search for the pills. Made in CiGA Game Jam 2022 (Theme: Trick), Shenzhen.",
    gallery: ["res/bg.png"],
    credits: [
      { label: "Date", value: "June 2022" },
      { label: "Role", value: "Game Designer, Game Artist" },
      { label: "Engine", value: "Unity" }
    ]
  },

  // =========================
  // 2021
  // =========================

  {
    slug: "life-cycle",
    title: "Life Cycle",
    category: "2D Mixed Media Art Series",
    year: 2021,
    blurb: "A series exploring eternity, life cycles, and the relationship between death and death",
    tags: ["mixed-media", "individual"],
    cover: "res/AP2D_Piano.jpg",
    selected: false,

    links: [{ label: "Watch video", url: "https://youtu.be/SDsiw6OvkbI" }],
    videos: [{ label: "Video", type: "youtube", id: "SDsiw6OvkbI" }],

    intro:
      "A series of 2D mixed media artworks exploring eternity, the life cycle, and the relationship between death and death. Made in AP 2D Art and Design.",
    gallery: [
      "res/AP2D_WatercolorSkull.jpg",
      "res/AP2D_Planet.jpg",
      "res/AP2D_Circulation.jpg",
      "res/AP2D_Flower.jpg",
      "res/AP2D_AdamAndEve.jpg",
      "res/AP2D_Infant2.jpg",
      "res/AP2D_Nirvana.jpg"
    ],
    credits: [
      { label: "Date", value: "May 2022" },
      { label: "Role", value: "Artist" }
    ]
  },

  {
    slug: "rain-collection",
    title: "Rain Collection",
    category: "Installation / Experimental Work",
    year: 2021,
    blurb: "An experimental collection exploring rain, sensing, and material presence",
    tags: ["installation", "individual"],
    cover: "res/bg.png",
    selected: false,

    links: [],
    videos: [],

    intro:
      "An ongoing experimental collection exploring rain as a sensory and material phenomenon. Documentation and format are currently in progress.",
    gallery: ["res/bg.png"],
    credits: [{ label: "Role", value: "Artist / Designer" }]
  }
];
