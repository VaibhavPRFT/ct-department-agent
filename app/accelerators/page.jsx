import data from "@/data/accelerators.json";
import StatusPill from "@/components/StatusPill";

export const metadata = {
  title: "Royal Cyber Accelerators — commercetools Center of Excellence",
};

function Media({ item }) {
  if (item.type === "video") {
    return (
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-black">
        <video controls preload="none" className="aspect-video w-full">
          <source src={item.url} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <p className="bg-slate-50 px-3 py-1.5 text-xs text-ink-faint">
          {item.label}
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <iframe
        src={item.url}
        title={item.label}
        loading="lazy"
        allowFullScreen
        className="aspect-video w-full"
      />
      <p className="bg-slate-50 px-3 py-1.5 text-xs text-ink-faint">
        {item.label}
      </p>
    </div>
  );
}

function Accelerator({ a }) {
  return (
    <section id={a.slug} className="scroll-mt-24 border-b border-slate-200 py-12">
      <div className="flex flex-wrap items-center gap-3">
        <span className="badge-num h-8 w-8 rounded-lg text-xs">{a.n}</span>
        <span className="text-xs font-medium uppercase tracking-wide text-ink-faint">
          {a.category}
        </span>
        <StatusPill status={a.status} />
      </div>

      <h2 className="mt-3 text-2xl font-bold tracking-tight text-ink">
        {a.name}
      </h2>
      <p className="mt-1 text-base text-brand-700">{a.tagline}</p>

      <p className="mt-4 max-w-4xl text-sm leading-relaxed text-ink-soft">
        {a.description}
      </p>

      <div className="mt-4 rounded-xl border border-brand-100 bg-brand-50 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-brand-600">
          Customer value
        </span>
        <p className="mt-1 text-sm text-ink">{a.customerValue}</p>
      </div>

      {a.media ? (
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {a.media.map((m, i) => (
            <Media key={i} item={m} />
          ))}
        </div>
      ) : null}

      <h3 className="mt-8 text-sm font-semibold uppercase tracking-wide text-ink-faint">
        Key Benefits
      </h3>
      <div className="mt-3 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {a.keyBenefits.map((b, i) => (
          <div key={i} className="card p-4">
            <h4 className="text-sm font-semibold text-ink">{b.title}</h4>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">{b.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
            The Challenge
          </h3>
          <h4 className="mt-2 text-base font-semibold text-ink">
            {a.challenge.title}
          </h4>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            {a.challenge.body}
          </p>
        </div>
        <div className="card p-5">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
            How This Accelerator Resolves It
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {a.resolves.map((r, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-400">•</span>
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
            Ideal Customer Profile
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">{a.icp}</p>
          <h3 className="mt-5 text-sm font-semibold uppercase tracking-wide text-ink-faint">
            Signals to Look For
          </h3>
          <div className="mt-2 flex flex-wrap gap-2">
            {a.signals.map((s, i) => (
              <span
                key={i}
                className="pill border-slate-200 bg-slate-50 text-ink-soft"
              >
                {s}
              </span>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
            Technical Standpoint
          </h3>
          <ul className="mt-2 space-y-1.5 text-sm text-ink-soft">
            {a.technical.map((t, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-brand-400">•</span>
                <span>{t}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-ink">
            Value for commercetools
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            {a.valueForCommercetools}
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
          <h3 className="text-sm font-semibold text-ink">
            Value for Royal Cyber
          </h3>
          <p className="mt-1 text-sm leading-relaxed text-ink-soft">
            {a.valueForRoyalCyber}
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AcceleratorsPage() {
  const { meta, accelerators, cta } = data;
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
          <nav className="mt-6 flex flex-wrap gap-2">
            {accelerators.map((a) => (
              <a
                key={a.slug}
                href={`#${a.slug}`}
                className="pill border-brand-100 bg-white text-ink-soft hover:border-brand-300 hover:text-brand-700"
              >
                {a.n} {a.name}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="container-page">
        {accelerators.map((a) => (
          <Accelerator key={a.slug} a={a} />
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
