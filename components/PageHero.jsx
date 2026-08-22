export default function PageHero({ eyebrow, title, description, meta }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="container-page py-10 sm:py-14">
        {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
            {description}
          </p>
        ) : null}
        {meta && meta.length ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {meta.map((m, i) => (
              <span
                key={i}
                className="pill border-brand-100 bg-brand-50 text-brand-700"
              >
                {m}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}
