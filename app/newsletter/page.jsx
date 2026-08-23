import PageHero from "@/components/PageHero";
import data from "@/data/newsletter.json";

export const metadata = {
  title: "commercetools Trend & Content Opportunities — Royal Cyber",
};

function Section({ n, title, children }) {
  return (
    <section className="container-page py-8">
      <div className="mb-5 flex items-baseline gap-3">
        <span className="text-sm font-bold text-brand-500">{n}</span>
        <h2 className="text-xl font-bold tracking-tight text-ink">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Score({ label, value }) {
  return (
    <span className="pill border-slate-200 bg-slate-50 text-ink-soft">
      {label} <span className="font-semibold text-ink">{value}</span>
    </span>
  );
}

function Badge({ children }) {
  return (
    <span className="pill border-brand-100 bg-brand-50 text-brand-700">
      {children}
    </span>
  );
}

export default function NewsletterPage() {
  const { meta } = data;
  return (
    <>
      <PageHero
        title={meta.title}
        description={`${meta.intro} · ${meta.generated}`}
        meta={[
          `Breakout: ${meta.breakout}`,
          `Lookback window: ${meta.lookbackWindow}`,
          `Focus: ${meta.focus}`,
        ]}
      />

      <Section n="01" title="Top Emerging Trends">
        <p className="mb-4 max-w-3xl text-sm text-ink-faint">
          Clusters ranked by momentum (signal volume, recency weighting, and
          source diversity). Every cluster below cleared the momentum threshold
          and is anchored to dated releases, roadmap items, or documented
          capabilities.
        </p>
        <ol className="space-y-4">
          {data.trends.map((t) => (
            <li key={t.rank} className="card p-5">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
                  {t.rank}
                </span>
                <div>
                  <h3 className="text-base font-semibold text-ink">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                    {t.body}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {t.badges.map((b, i) => (
                      <Badge key={i}>{b}</Badge>
                    ))}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Section>

      <Section n="02" title="Release Updates">
        <div className="card overflow-x-auto">
          <table className="prose-table">
            <thead>
              <tr>
                <th>Product</th>
                <th>Date</th>
                <th>Release Highlight</th>
                <th>Type</th>
              </tr>
            </thead>
            <tbody>
              {data.releases.map((r, i) => (
                <tr key={i}>
                  <td className="font-medium text-ink">{r.product}</td>
                  <td className="whitespace-nowrap">{r.date}</td>
                  <td>
                    {r.highlight}
                    <span className="mt-1 block text-xs text-brand-500">
                      {r.source}
                    </span>
                  </td>
                  <td className="whitespace-nowrap">{r.type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section n="03" title="Upcoming Events">
        <div className="card overflow-x-auto">
          <table className="prose-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>When / Format</th>
                <th>Focus</th>
                <th>Register</th>
              </tr>
            </thead>
            <tbody>
              {data.events.map((e, i) => (
                <tr key={i}>
                  <td className="font-medium text-ink">{e.event}</td>
                  <td>{e.when}</td>
                  <td>{e.focus}</td>
                  <td>
                    <a
                      className="font-semibold text-brand-600 hover:underline"
                      href={e.register}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Register ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section n="04" title="Royal Cyber Events">
        <p className="mb-4 max-w-3xl text-sm text-ink-faint">
          Royal Cyber's own commercetools webinars and networking events — register directly on royalcyber.com.
        </p>
        <div className="card overflow-x-auto">
          <table className="prose-table">
            <thead>
              <tr>
                <th>Event</th>
                <th>When / Format</th>
                <th>Focus</th>
                <th>Register</th>
              </tr>
            </thead>
            <tbody>
              {data.royalCyberEvents.map((e, i) => (
                <tr key={i}>
                  <td className="font-medium text-ink">{e.event}</td>
                  <td>{e.when}</td>
                  <td>{e.focus}</td>
                  <td>
                    <a
                      className="font-semibold text-brand-600 hover:underline"
                      href={e.register}
                      target="_blank"
                      rel="noreferrer"
                    >
                      Register ↗
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section n="05" title="Product Roadmap">
        <p className="mb-4 max-w-3xl text-sm text-ink-faint">
          Near-term items pulled from the current / Now / Q2 sections of each
          product page. Forward-looking and informational only — commercetools
          states roadmaps are not binding and may change.
        </p>
        <div className="grid gap-5 md:grid-cols-2">
          {data.roadmap.map((g, i) => (
            <div key={i} className="card p-5">
              <p className="eyebrow">{g.horizon}</p>
              <h3 className="mt-1 text-base font-semibold text-ink">
                {g.title}
              </h3>
              <ul className="mt-3 space-y-1.5 text-sm text-ink-soft">
                {g.items.map((it, j) => (
                  <li key={j} className="flex gap-2">
                    <span className="text-brand-400">•</span>
                    <span>{it}</span>
                  </li>
                ))}
              </ul>
              <a
                className="mt-3 inline-block text-sm font-semibold text-brand-600 hover:underline"
                href={g.link}
                target="_blank"
                rel="noreferrer"
              >
                View roadmap →
              </a>
            </div>
          ))}
        </div>
      </Section>

      <Section n="06" title="High-Value Blog Opportunities">
        <div className="grid gap-5 md:grid-cols-2">
          {data.blogOpportunities.map((b, i) => (
            <div key={i} className="card p-5">
              <h3 className="text-base font-semibold text-ink">{b.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {b.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Score label="Audience:" value={b.audience} />
                <Score label="Difficulty:" value={b.difficulty} />
                <Score label="Engagement" value={b.engagement} />
                <Score label="Uniqueness" value={b.uniqueness} />
                <span className="pill border-brand-100 bg-brand-50 text-brand-700">
                  Composite priority{" "}
                  <span className="font-semibold">{b.composite}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section n="07" title="Whitepaper Opportunities">
        <div className="grid gap-5 md:grid-cols-2">
          {data.whitepaperOpportunities.map((w, i) => (
            <div key={i} className="card p-5">
              <h3 className="text-base font-semibold text-ink">{w.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {w.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Score label="Audience:" value={w.audience} />
                <Score label="Difficulty:" value={w.difficulty} />
                <Score label="Engagement" value={w.engagement} />
                <Score label="Uniqueness" value={w.uniqueness} />
                <span className="pill border-brand-100 bg-brand-50 text-brand-700">
                  Composite priority{" "}
                  <span className="font-semibold">{w.composite}</span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section n="08" title="LinkedIn Post Ideas">
        <div className="grid gap-5 md:grid-cols-2">
          {data.linkedinPosts.map((p, i) => (
            <div key={i} className="card p-5">
              <h3 className="text-base font-semibold text-ink">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">
                {p.body}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Score label="Audience:" value={p.audience} />
                <Score label="Engagement" value={p.engagement} />
                <Score label="Uniqueness" value={p.uniqueness} />
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section n="09" title="Competitive Insight">
        <div className="card overflow-x-auto">
          <table className="prose-table">
            <thead>
              <tr>
                <th>Theme</th>
                <th>commercetools Position</th>
                <th>Competitor Position</th>
                <th>Opportunity</th>
              </tr>
            </thead>
            <tbody>
              {data.competitive.map((c, i) => (
                <tr key={i}>
                  <td className="font-medium text-ink">{c.theme}</td>
                  <td>{c.commercetools}</td>
                  <td>{c.competitor}</td>
                  <td>{c.opportunity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section n="10" title="Recommended Immediate Actions">
        <div className="space-y-4">
          {data.immediateActions.map((a) => (
            <div key={a.rank} className="card flex items-start gap-4 p-5">
              <span className="flex h-8 w-8 flex-none items-center justify-center rounded-full bg-brand-50 text-sm font-bold text-brand-600">
                {a.rank}
              </span>
              <div>
                <h3 className="text-base font-semibold text-ink">{a.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                  {a.body}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="pill border-brand-100 bg-brand-50 text-brand-700">
                    Composite priority{" "}
                    <span className="font-semibold">{a.composite}</span>
                  </span>
                  <span className="pill border-slate-200 bg-slate-50 text-ink-soft">
                    Format: {a.format}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Section>

      <Section n="11" title="Next 7 Days">
        <ul className="card space-y-3 p-6">
          {data.next7Days.map((item, i) => (
            <li key={i} className="flex gap-3 text-sm text-ink-soft">
              <span className="text-brand-400">•</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
