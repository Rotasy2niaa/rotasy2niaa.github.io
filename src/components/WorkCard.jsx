// src/components/WorkCard.jsx
import { Link } from "react-router-dom";

export default function WorkCard({ work }) {
  if (!work) return null;

  const cover = work.images?.[0];

  return (
    <Link
      to={`/works/${work.slug}`}
      className="group block space-y-3"
    >
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-neutral-200">
        {cover && (
          <img
            src={cover}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform"
          />
        )}
      </div>

      <div>
        <h3 className="text-base font-medium">{work.title}</h3>
        <p className="text-sm text-gray-500">
          {work.category}, {work.year}
        </p>
      </div>
    </Link>
  );
}
