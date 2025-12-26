// work.js
// Single source of truth for all works.

window.WORKS = [
  {
    slug: "insync-maze",
    title: "InSync",
    category: "Maze Installation",
    year: 2025,
    blurb: "A non visual multisensory maze guided entirely by touch",
    tags: ["installation", "exhibition", "collaborative"],
    cover: "res/bg.png",
    selected: true,

    intro:
      "Designed and fabricated a 9×12 inch tactile maze installation exploring intuitive bodily perception of space and texture.",
    gallery: ["res/bg.png", "res/bg.png"],
    credits: [
      { label: "Role", value: "Maze and Experience Designer" }
    ]
  },

  {
    slug: "how-to-pet-your-cat",
    title: "How to Pet Your Cat",
    category: "alt ctrl Experience",
    year: 2025,
    blurb: "A physical digital experience featuring a custom built controller",
    tags: ["installation", "exhibition", "digital", "collaborative"],
    cover: "res/bg.png",
    selected: true,

    intro:
      "An absurd controller driven experience built for live showcases, focusing on playful interaction and high energy crowd flow.",
    gallery: ["res/bg.png", "res/bg.png"],
    credits: [
      { label: "Role", value: "Experience Designer and Installation Artist" }
    ]
  },

  {
    slug: "noah-had-no-wing",
    title: "Noah Had No Wing",
    category: "Video Game",
    year: 2023,
    blurb: "A narrative focused game experiment",
    tags: ["digital", "individual"],
    cover: "res/bg.png",
    selected: false,

    intro:
      "A small game project exploring mood, pacing, and storytelling through interaction.",
    gallery: ["res/bg.png"],
    credits: [
      { label: "Role", value: "Designer" }
    ]
  },

  {
    slug: "dice-valley",
    title: "Dice Valley",
    category: "Unity Game",
    year: 2022,
    blurb: "A 3D puzzle game about rolling and transforming a dice to reach the goal face up",
    tags: ["digital", "individual"],
    cover: "res/bg.png",
    selected: true,

    intro:
      "Made for GMTK Game Jam 2022. Players roll and transform a dice to land on the destination with the correct face up.",
    gallery: ["res/bg.png", "res/bg.png"],
    credits: [
      { label: "Date", value: "July 2022" },
      { label: "Role", value: "Game Designer, Game Artist" },
      { label: "Engine", value: "Unity" }
    ]
  }
];
