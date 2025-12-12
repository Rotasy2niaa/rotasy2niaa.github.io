// src/pages/WorkDetail.jsx
import { useParams, Link } from "react-router-dom";
import { works } from "../data/works";

export default function WorkDetail() {
  const { slug } = useParams();
  const work = works.find(w => w.slug === slug);

  if (!work) {
    return <p>Work not found</p>;
  }

  return (
    <article className="space-y-10">
      <Link to="/works" className="text-sm text-gray-500">
        ← Back to Works
      </Link>

      <header className="space-y-3">
        <h1 className="text-4xl font-display">{work.title}</h1>
        <p className="text-sm text-gray-500">
          {work.category}, {work.year}
        </p>
        <p className="max-w-2xl">{work.description}</p>
      </header>

      <section className="space-y-6">
        {work.images.map((img, i) => (
          <img key={i} src={img} alt="" className="w-full rounded-md" />
        ))}
      </section>
    </article>
  );
}
