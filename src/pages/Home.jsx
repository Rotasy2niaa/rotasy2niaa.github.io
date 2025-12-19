// src/pages/Home.jsx

console.log("NEW HOME RENDERED");

import WorkCard from "../components/WorkCard";
import { works } from "../data/works";

export default function Home() {
  const selectedWorks = works.slice(0, 3);

  return (
    <div className="space-y-16">
      {/* Persona */}
      <section className="space-y-4">
        <h1 className="text-4xl font-display">
          Game Designer & World Creator
        </h1>

        <p className="max-w-xl text-gray-600">
          Creating thoughtful, aesthetic-driven work at the intersection of
          art, design, and human experience.
        </p>
      </section>

      {/* Selected Works */}
      <section className="space-y-6">
        <h2 className="text-xl font-medium">Selected Works</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {selectedWorks.map(work => (
            <WorkCard key={work.slug} work={work} />
          ))}
        </div>
      </section>
    </div>
  );
}
