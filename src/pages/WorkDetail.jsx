// src/pages/WorkDetail.jsx
import { useParams, Link } from "react-router-dom";
import { works } from "../data/works.js";

function WorkDetail() {
  const { id } = useParams();
  const workIndex = works.findIndex((w) => w.id === id);
  const work = workIndex >= 0 ? works[workIndex] : null;

  if (!work) {
    return (
      <div className="text-center space-y-4">
        <h1 className="font-display text-3xl">work not found</h1>
        <Link
          to="/works"
          className="text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:text-ink"
        >
          ← back to all works
        </Link>
      </div>
    );
  }

  const next = works[(workIndex + 1) % works.length];

  return (
    <article className="space-y-8">
      <Link
        to="/works"
        className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink/70 hover:text-ink"
      >
        ← back to all works
      </Link>

      <header className="space-y-3">
        <h1 className="font-display text-4xl tracking-[0.08em] text-blush">
          {work.title}
        </h1>
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink/70">
          {work.category} · {work.year}
        </p>
        <p className="text-sm max-w-2xl text-ink/85">{work.description}</p>

        <div className="flex flex-wrap gap-2 mt-2">
          {work.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 rounded-full border border-line bg-paper/80 text-[11px] uppercase tracking-[0.18em] text-ink/80"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <section className="space-y-4">
        {work.images.map((src, index) => (
          <figure
            key={index}
            className="border border-line rounded-zine p-4 shadow-zine bg-paper/80"
          >
            <div className="overflow-hidden rounded-[0.9rem] border border-line bg-[#f0efee]">
              <img
                src={src}
                alt={`${work.title} ${index + 1}`}
                className="w-full object-cover mix-blend-multiply"
              />
            </div>
          </figure>
        ))}
      </section>

      <footer className="pt-6 border-t border-line flex items-center justify-between text-[11px] uppercase tracking-[0.18em] text-ink/70">
        <span>medium: {work.medium}</span>
        <Link
          to={`/works/${next.id}`}
          className="hover:text-ink flex items-center gap-1"
        >
          next project → {next.title}
        </Link>
      </footer>
    </article>
  );
}

export default WorkDetail;
