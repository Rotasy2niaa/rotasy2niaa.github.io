// src/components/TagFilter.jsx

function TagFilter({ tags, activeTag, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.18em]">
      <button
        type="button"
        onClick={() => onChange("all")}
        className={
          "px-3 py-1 rounded-full border transition " +
          (activeTag === "all"
            ? "bg-ink text-paper border-ink"
            : "bg-paper/80 text-ink/70 border-line hover:text-ink")
        }
      >
        all
      </button>
      {tags.map((tag) => (
        <button
          key={tag}
          type="button"
          onClick={() => onChange(tag)}
          className={
            "px-3 py-1 rounded-full border transition " +
            (activeTag === tag
              ? "bg-ink text-paper border-ink"
              : "bg-paper/80 text-ink/70 border-line hover:text-ink")
          }
        >
          {tag}
        </button>
      ))}
    </div>
  );
}

export default TagFilter;
