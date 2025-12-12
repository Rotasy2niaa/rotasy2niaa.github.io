import works from "../data/works";

export default function Works() {

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">

      {/* Title */}
      <h1 className="text-3xl font-light mb-2 tracking-wide">All Works</h1>

      {/* Intro */}
      <p className="text-sm text-gray-600 max-w-2xl mb-12 leading-relaxed">
        A comprehensive collection of my creative work spanning multiple disciplines and years.
        Each project represents a unique exploration of aesthetic principles and design thinking.
      </p>

      {/* Gallery grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {works.map(work => (
          <div key={work.id} className="group">
            
            {/* Image */}
            <div className="aspect-[4/3] overflow-hidden rounded-md bg-neutral-200">
              <img
                src={work.images[0]}
                className="w-full h-full object-cover group-hover:scale-[1.02] transition duration-300"
                alt={work.title}
              />
            </div>

            {/* Title */}
            <h2 className="text-base font-medium mt-3">{work.title}</h2>

            {/* Meta */}
            <p className="text-sm text-gray-500">
              {work.category}, {work.year}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
