export default function Home() {
  return (
    <div className="container mx-auto px-6 py-16">
      
      {/* ASCII Title */}
      <h1 className="ascii-title text-center mb-6">
        ★ ROTASY · PERSONAL ARCHIVE ★
      </h1>

      {/* ASCII Divider */}
      <div className="ascii-divider">
        ════ ⋆★⋆ ═══════════════════════════ ⋆★⋆ ════
      </div>

      {/* Intro Paragraph */}
      <p className="max-w-2xl mx-auto text-center text-sm opacity-80 mb-16 leading-relaxed">
        A soft–digital archive of zines, paintings, ASCII drawings, 
        experiments, and dream–logic artifacts.<br />
        Exploring softness, glitch, print textures, and early-internet nostalgia.
      </p>

      {/* Selected Works */}
      <h2 className="ascii-title text-center mb-4" style={{ fontSize: "2rem" }}>
        SELECTED WORKS
      </h2>

      <div className="ascii-divider">⋆✧⋆</div>

      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">

        {/* CARD 1 */}
        <div className="relative zine-card">
          <img src="/Art/sweetdream.jpg" className="img-zine w-full mb-4" />
          <h3 className="font-bold">Sweet Dream</h3>
          <p className="text-xs opacity-70 mb-2">Zine / Printed Matter • 2024</p>
          <p className="text-xs opacity-80">
            dreamy pixel-script lettering and lace motifs.
          </p>
        </div>

        {/* CARD 2 */}
        <div className="relative zine-card">
          <img src="/Art/butterfly.jpg" className="img-zine w-full mb-4" />
          <h3 className="font-bold">ASCII Butterfly</h3>
          <p className="text-xs opacity-70 mb-2">ASCII Text Drawing • 2023</p>
          <p className="text-xs opacity-80">
            Soft grid, mirrored symmetry, emotional resonance.
          </p>
        </div>

      </div>

    </div>
  );
}
