import data from "@/data/casestudy.json";

export const metadata = {
  title: "commercetools Customer Case Studies — Royal Cyber",
  description:
    "Royal Cyber customer outcomes on commercetools across D2C and B2B composable commerce, multibrand platforms, customer service and regulated marketplaces — each mapped to the challenge, solution and value delivered.",
};

function CaseStudy({ c }) {
  return (
    <section id={c.slug} className="scroll-mt-24 border-b border-slate-200 py-12">
      <div className="flex flex-wrap items-center gap-3">
        <span className="badge-num h-8 w-8 rounded-lg text-xs">{c.n}</span>
        <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
          {c.category}
        </span>
        <span className="pill-solid">{c.product}</span>
      </div>

      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        {c.name}
      </h2>
      <p className="mt-1 text-base text-brand-700">
        {c.name} Commerce Journey · {c.industry}
      </p>
      <p className="mt-3 max-w-4xl text-lg font-semibold text-ink">
        {c.headline}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {c.chips.map((chip, i) => (
          <span key={i} className="pill border-brand-100 bg-brand-50 text-brand-700">
            {chip}
          </span>
        ))}
      </div>

      <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink-faint">
        Key Features
      </h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2">
        {c.keyFeatures.map((f, i) => (
          <div key={i} className="card p-4">
            <h4 className="text-sm font-semibold text-ink">{f.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{f.body}</p>
          </div>
        ))}
      </div>

      <p className="mt-6 text-xs text-ink-faint">Website: {c.website}</p>
    </section>
  );
}

export default function CaseStudyPage() {
  const { meta, cases, cta } = data;
  return (
    <>
      <section>
        <div className="container-page py-12 sm:py-16">
          <p className="eyebrow">{meta.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-1 text-lg font-medium text-brand-700">
            {meta.subtitle}
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
            {meta.intro} · {meta.updated}
          </p>

          <div className="mt-6 flex flex-wrap gap-6">
            {meta.stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-xl font-bold text-ink">{s.value}</span>
                <span className="text-xs text-ink-faint">{s.label}</span>
              </div>
            ))}
          </div>

          <nav className="mt-6 flex flex-wrap gap-2">
            {cases.map((c) => (
              <a
                key={c.slug}
                href={`#${c.slug}`}
                className="pill border-brand-100 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700"
              >
                {c.n} {c.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container-page">
        {cases.map((c) => (
          <CaseStudy key={c.slug} c={c} />
        ))}

        <section className="py-12">
          <div className="card bg-gradient-to-r from-brand-900 via-brand-800 to-brand-600 p-8 text-white">
            <h2 className="text-xl font-bold">{cta.title}</h2>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-brand-50">
              {cta.body}
            </p>
            <a
              href={cta.href}
              target="_blank"
              rel="noreferrer"
              className="mt-4 inline-flex items-center gap-1 rounded-full bg-accent px-4 py-2 text-sm font-semibold text-ink hover:bg-accent-600"
            >
              {cta.label} →
            </a>
          </div>
        </section>
      </div>
    </>
  );
}
