// src/components/WorkCard.jsx
import { Link } from "react-router-dom";

function WorkCard({ work }) {
  return (
    <Link
      to={`/works/${work.id}`}
      className="group block bg-paper/80 shadow-zine rounded-zine p-4 hover:-translate-y-1 hover:shadow-[0_0_0_1px_rgba(0,0,0,0.08),10px_10px_0_rgba(0,0,0,0.22)] transition-transform shadow-ink/10"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-[0.9rem] border border-line bg-[#f0efee]">
        <img
          src={work.thumbnail}
          alt={work.title}
          className="h-full w-full object-cover mix-blend-multiply grayscale-[0.2] group-hover:grayscale-0 group-hover:scale-[1.03] transition-all duration-500"
        />
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="font-display text-xl tracking-[0.08em] text-ink">
          {work.title}
        </h3>
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink/70">
          {work.category} · {work.year}
        </p>
        <p className="text-xs text-ink/75 line-clamp-2">{work.description}</p>
      </div>
    </Link>
  );
}

export default WorkCard;
