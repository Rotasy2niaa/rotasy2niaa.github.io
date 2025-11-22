import { works } from "../data/works.js";

export default function Works() {
  const allTags = Array.from(new Set(works.flatMap(w => w.tags)));

  return (
    <div className="container">
      {/* Title */}
      <h1 className="h-title mb-6">All Works</h1>

      {/* Intro text */}
      <p className="mb-10 text-sm opacity-75">
        A growing index of pieces across different mediums. Use tags to filter by
        mood, format, or structure.
      </p>

      {/* Tag list */}
      <div className="flex flex-wrap gap-2 mb-12">
        {allTags.map(tag => (
          <span key={tag} className="tag">{tag}</span>
        ))}
      </div>

      {/* Works grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {works.map(work => (
          <div key={work.id} className="zine-border texture">
            {/* Cover image */}
            <img 
              src={work.images[0]} 
              className="img-soft mb-4"
              alt={work.title}
            />

            {/* Title */}
            <h2 className="h-title">{work.title}</h2>

            {/* Meta */}
            <p className="text-sm mt-1 mb-4 opacity-70">
              {work.category} / {work.year}
            </p>

            {/* Description */}
            <p className="text-sm">{work.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
