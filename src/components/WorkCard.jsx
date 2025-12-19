import { Link } from "react-router-dom";

export default function WorkCard({ work }) {
  if (!work) return null;

  const cover = work.images?.[0];

  return (
    <Link
      to={`/works/${work.slug}`}
      className="group block space-y-3"
    >
      {/* 图片容器：强制比例 */}
      <div className="aspect-[4/3] overflow-hidden rounded-md bg-neutral-200">
        {cover && (
          <img
            src={cover}
            alt={work.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        )}
      </div>

      {/* 标题 */}
      <h3 className="text-base font-medium leading-tight">
        {work.title}
      </h3>

      {/* 分类 / 年份 */}
      <p className="text-sm text-gray-500">
        {work.category}, {work.year}
      </p>
    </Link>
  );
}
