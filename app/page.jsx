import Link from "next/link";
import site from "@/data/site.json";

function Stat({ value, label }) {
  return (
    <div className="flex flex-col">
      <span className="text-xl font-bold text-ink">{value}</span>
      <span className="text-xs text-ink-faint">{label}</span>
    </div>
  );
}

function DashboardCard({ card }) {
  return (
    <Link
      href={card.href}
      className="card group flex flex-col gap-4 p-6 transition hover:-translate-y-0.5 hover:border-brand-200 hover:shadow-md"
    >
      <p className="eyebrow">{card.source}</p>
      <h2 className="text-lg font-semibold text-ink">{card.title}</h2>
      <p className="text-sm leading-relaxed text-ink-soft">{card.description}</p>

      {card.stats ? (
        <div className="mt-1 flex flex-wrap gap-6">
          {card.stats.map((s, i) => (
            <Stat key={i} value={s.value} label={s.label} />
          ))}
        </div>
      ) : null}

      {card.items ? (
        <ul className="mt-1 space-y-2">
          {card.items.map((it, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
              <span className="mt-0.5 font-mono text-xs text-brand-500">
                {it.n}
              </span>
              <span>
                <span className="font-medium text-ink">{it.name}</span>
                <span className="ml-2 text-xs text-ink-faint">{it.status}</span>
                <span className="block text-xs text-ink-faint">{it.tagline}</span>
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {card.chips ? (
        <div className="flex flex-wrap gap-2">
          {card.chips.map((c, i) => (
            <span
              key={i}
              className="pill border-slate-200 bg-slate-50 text-ink-soft"
            >
              {c}
            </span>
          ))}
        </div>
      ) : null}

      <span className="mt-auto inline-flex items-center gap-1 text-sm font-semibold text-brand-600 group-hover:gap-2">
        {card.cta} <span aria-hidden>→</span>
      </span>
    </Link>
  );
}

export default function DashboardPage() {
  const { dashboard } = site;
  return (
    <>
      <section className="border-b border-slate-200 bg-white">
        <div className="container-page py-12 sm:py-16">
          <p className="eyebrow">{dashboard.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {dashboard.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
            {dashboard.intro}
          </p>
        </div>
      </section>

      <div className="container-page py-10">
        <div className="grid gap-6 md:grid-cols-2">
          {dashboard.cards.map((card, i) => (
            <DashboardCard key={i} card={card} />
          ))}
        </div>

        <a
          href={dashboard.resource.href}
          target="_blank"
          rel="noreferrer"
          className="card mt-6 flex flex-col gap-2 p-6 transition hover:border-brand-200 hover:shadow-md"
        >
          <p className="eyebrow">{dashboard.resource.source}</p>
          <h2 className="text-lg font-semibold text-ink">
            {dashboard.resource.title}
          </h2>
          <p className="text-sm leading-relaxed text-ink-soft">
            {dashboard.resource.description}
          </p>
          <span className="mt-1 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
            {dashboard.resource.cta} <span aria-hidden>↗</span>
          </span>
        </a>

        <div className="mt-10 rounded-xl border border-slate-200 bg-white p-5">
          <h3 className="text-sm font-semibold text-ink">Latest sweep</h3>
          <p className="mt-1 text-sm text-ink-soft">{dashboard.latestSweep}</p>
        </div>
      </div>
    </>
  );
}
