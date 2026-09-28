"use client";

import { useMemo, useState } from "react";

const TEAMS = ["All", "Sales", "Marketing", "Practice", "Partnership"];

const STATUS_STYLE = {
  "Not Started": "border-slate-200 bg-slate-50 text-slate-600",
  "In Progress": "border-brand-200 bg-brand-50 text-brand-700",
  Done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Blocked: "border-rose-200 bg-rose-50 text-rose-700",
  "N/A": "border-slate-200 bg-white text-slate-400",
};

const REVIEW_STYLE = {
  risk: { label: "Risk", cls: "border-rose-200 bg-rose-50", tag: "bg-rose-600" },
  load: { label: "Workload", cls: "border-amber-200 bg-amber-50", tag: "bg-amber-500" },
  fix: { label: "Fix", cls: "border-brand-200 bg-brand-50", tag: "bg-brand-600" },
  ok: { label: "Checked", cls: "border-emerald-200 bg-emerald-50", tag: "bg-emerald-600" },
};

function fmtDate(iso, opts = { month: "short", day: "numeric" }) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    ...opts,
    timeZone: "UTC",
  });
}

function Status({ s }) {
  return (
    <span className={"pill whitespace-nowrap " + (STATUS_STYLE[s] || STATUS_STYLE["Not Started"])}>
      {s}
    </span>
  );
}

function Review({ items }) {
  if (!items?.length) return null;
  return (
    <div className="mt-6">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-ink-faint">
        Weekly review
      </h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {items.map((r, i) => {
          const st = REVIEW_STYLE[r.level] || REVIEW_STYLE.fix;
          return (
            <div key={i} className={"rounded-xl border p-4 " + st.cls}>
              <div className="flex items-center gap-2">
                <span className={"rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white " + st.tag}>
                  {st.label}
                </span>
                <h4 className="text-sm font-semibold text-ink">{r.title}</h4>
              </div>
              <p className="mt-2 text-xs leading-relaxed text-ink-soft">{r.body}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Week({ week }) {
  const [team, setTeam] = useState("All");
  const tasks = useMemo(
    () => week.tasks.filter((t) => team === "All" || t.team === team),
    [week, team]
  );
  const byDay = useMemo(() => {
    const m = new Map();
    for (const t of tasks) {
      const k = t.date;
      if (!m.has(k)) m.set(k, []);
      m.get(k).push(t);
    }
    return [...m.entries()].sort(([a], [b]) => a.localeCompare(b));
  }, [tasks]);

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold tracking-tight text-ink">{week.title}</h2>
      <p className="mt-2 text-sm text-ink-soft">
        <span className="font-semibold text-ink">Anchor:</span> {week.anchor}
      </p>
      <p className="mt-1 text-sm text-ink-soft">
        <span className="font-semibold text-ink">Also in motion:</span> {week.alsoInMotion}
      </p>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Object.entries(week.progress).map(([t, p]) => {
          const pct = p.total ? Math.round((p.done / p.total) * 100) : 0;
          return (
            <div key={t} className="rounded-xl border border-slate-200 p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-ink-faint">{t}</p>
              <p className="mt-1 text-lg font-bold text-ink">
                {p.done} <span className="text-sm font-normal text-ink-faint">of {p.total} done</span>
              </p>
              <div className="mt-2 h-1.5 rounded-full bg-slate-100">
                <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: pct + "%" }} />
              </div>
            </div>
          );
        })}
      </div>

      <Review items={week.review} />

      <div className="mt-8 flex flex-wrap items-center gap-2">
        <span className="mr-1 text-xs font-semibold uppercase tracking-wide text-ink-faint">Team</span>
        {TEAMS.map((t) => (
          <button
            key={t}
            onClick={() => setTeam(t)}
            className={
              "rounded-full border px-3 py-1 text-xs font-semibold transition " +
              (t === team
                ? "border-ink bg-ink text-white"
                : "border-brand-100 bg-white text-ink-soft hover:border-brand-300")
            }
          >
            {t}
          </button>
        ))}
        <span className="ml-auto text-xs text-ink-faint">{tasks.length} tasks</span>
      </div>

      {byDay.map(([date, list]) => (
        <div key={date} className="mt-6">
          <h3 className="border-b border-slate-200 pb-1 text-sm font-semibold text-ink">
            {fmtDate(date, { weekday: "long", month: "short", day: "numeric" })}
            <span className="ml-2 font-normal text-ink-faint">{list.length} tasks</span>
          </h3>
          <div className="mt-2 overflow-x-auto">
            <table className="prose-table min-w-[720px]">
              <thead>
                <tr>
                  <th className="w-20">ID</th>
                  <th className="w-28">Team</th>
                  <th>Task</th>
                  <th className="w-24">Session</th>
                  <th className="w-28">Status</th>
                </tr>
              </thead>
              <tbody>
                {list.map((t) => (
                  <tr key={t.id}>
                    <td className="whitespace-nowrap font-mono text-xs">{t.id}</td>
                    <td className="text-xs">
                      <span className="font-medium text-ink">{t.team}</span>
                      <span className="block text-ink-faint">{t.owner}</span>
                    </td>
                    <td className="text-xs">
                      {t.task}
                      <span className="mt-0.5 block text-ink-faint">Done when: {t.deliverable}</span>
                      {t.notes ? <span className="mt-0.5 block text-amber-700">{t.notes}</span> : null}
                    </td>
                    <td className="whitespace-nowrap text-xs">{t.session}</td>
                    <td><Status s={t.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function WebinarsView({ data }) {
  const [active, setActive] = useState(0);
  const week = data.weeks[active];

  return (
    <div className="container-page pb-12">
      <section className="card p-6">
        <h2 className="text-lg font-bold text-ink">Series schedule</h2>
        <div className="mt-3 overflow-x-auto">
          <table className="prose-table min-w-[820px]">
            <thead>
              <tr>
                <th className="w-10">#</th>
                <th className="w-20">Date</th>
                <th className="w-28">Practice</th>
                <th>Session</th>
                <th className="w-24">Speakers</th>
                <th className="w-24">Reg target</th>
                <th className="w-24">Health</th>
              </tr>
            </thead>
            <tbody>
              {data.sessions.map((s) => (
                <tr key={s.n}>
                  <td className="font-semibold text-ink">{s.n}</td>
                  <td className="whitespace-nowrap text-xs">{fmtDate(s.date, { month: "short", day: "numeric", year: "2-digit" })}</td>
                  <td className="text-xs">{s.practice}</td>
                  <td className="text-xs">
                    <span className="font-medium text-ink">{s.title}</span>
                    <span className="block text-ink-faint">
                      {s.format} · {s.wave} · CTA: {s.offer}
                    </span>
                  </td>
                  <td className="text-xs">{Math.round((s.speakers?.readiness || 0) * 100)}% ready</td>
                  <td className="text-xs">
                    {s.registered} / {s.regTarget}
                  </td>
                  <td className="text-xs">{s.health}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mb-4 mt-10 flex flex-wrap gap-2">
        {data.weeks.map((w, i) => (
          <button
            key={w.tab}
            onClick={() => setActive(i)}
            className={
              "rounded-full border px-4 py-2 text-sm font-semibold transition " +
              (i === active
                ? "border-ink bg-ink text-white"
                : "border-brand-100 bg-white text-ink-soft hover:border-brand-300")
            }
          >
            {w.tab}
          </button>
        ))}
      </div>
      <Week key={week.tab} week={week} />
    </div>
  );
}
