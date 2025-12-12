// src/components/WorkCard.jsx
import { Link } from "react-router-dom";

export default function WorkCard({ work }) {
  if (!work) return null;
  const cover = work.images?.[0];

  return (
    <Link
      to={`/works/${work.slug}`}
      className="group block"
    >
      {/* 图片 */}
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-neutral-200">
        {cover && (
          <img
            src={cover}
            alt={work.title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
          />
        )}
      </div>

      {/* 标题 */}
      <h3 className="text-base font-medium mt-3">
        {work.title}
      </h3>

      {/* 分类 */}
      <p className="text-sm text-gray-500">
        {work.category}, {work.year}
      </p>
    </Link>
  );
}
