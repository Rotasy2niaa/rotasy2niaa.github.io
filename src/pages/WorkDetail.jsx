// src/pages/WorkDetail.jsx
import { useParams, Link } from "react-router-dom";
import { works } from "../data/works";

export default function WorkDetail() {
  const { slug } = useParams();

  const workIndex = works.findIndex(w => w.slug === slug);
  const work = workIndex >= 0 ? works[workIndex] : null;

  if (!work) {
    return (
      <div className="text-center space-y-4">
        <h1 className="text-3xl">Work not found</h1>
        <Link to="/works">← back to all works</Link>
      </div>
    );
  }

  const next = works[(workIndex + 1) % works.length];

  return (
    <article className="space-y-8">
      <Link to="/works" className="text-sm opacity-70">
        ← back to all works
      </Link>

      <header className="space-y-3">
        <h1 className="text-4xl">{work.title}</h1>
        <p className="text-sm opacity-70">
          {work.category} · {work.year}
        </p>
        <p className="max-w-2xl">{work.description}</p>
      </header>

      <section className="space-y-6">
        {work.images.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`${work.title} ${i + 1}`}
            className="w-full rounded-md"
          />
        ))}
      </section>

      <footer className="flex justify-between text-sm opacity-70">
        <span>{work.medium}</span>
        <Link to={`/works/${next.slug}`}>
          next → {next.title}
        </Link>
      </footer>
    </article>
  );
}
