"use client";

import { useState } from "react";
import StatusPill from "./StatusPill";

export default function QuarterlyPlanView({ data }) {
  const [active, setActive] = useState(0);
  const q = data.quarters[active];

  return (
    <div className="container-page py-8">
      <div className="mb-6 flex flex-wrap gap-2">
        {data.quarters.map((quarter, i) => (
          <button
            key={quarter.id}
            onClick={() => setActive(i)}
            className={
              "rounded-lg border px-4 py-2 text-sm font-semibold transition " +
              (i === active
                ? "border-brand-500 bg-brand-500 text-white"
                : "border-slate-200 bg-white text-ink-soft hover:border-brand-200")
            }
          >
            {quarter.tab}
          </button>
        ))}
      </div>

      <div className="card p-6">
        <h2 className="text-xl font-bold tracking-tight text-ink">{q.title}</h2>
        <p className="mt-1 text-sm text-ink-faint">
          {q.window} | {q.subtitle}
        </p>

        <div className="mt-4 flex flex-wrap gap-6">
          <div>
            <span className="text-2xl font-bold text-ink">
              {q.stats.initiatives}
            </span>
            <span className="ml-1 text-sm text-ink-faint">initiatives</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-emerald-600">
              {q.stats.done}
            </span>
            <span className="ml-1 text-sm text-ink-faint">done</span>
          </div>
          <div>
            <span className="text-2xl font-bold text-brand-600">
              {q.stats.open}
            </span>
            <span className="ml-1 text-sm text-ink-faint">open</span>
          </div>
        </div>

        {q.note ? (
          <p className="mt-4 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800">
            {q.note}
          </p>
        ) : null}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {q.tracks.map((t) => (
          <div key={t.name} className="card p-4">
            <h3 className="text-sm font-semibold text-brand-700">{t.name}</h3>
            <p className="mt-1 text-xs leading-relaxed text-ink-soft">
              {t.description}
            </p>
          </div>
        ))}
      </div>

      <div className="card mt-6 overflow-x-auto">
        <table className="prose-table">
          <thead>
            <tr>
              <th>Month</th>
              <th>Initiative</th>
              <th>Track</th>
              <th>Owner</th>
              <th>Department</th>
              <th>Goal</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {q.initiatives.map((it, i) => (
              <tr key={i}>
                <td className="whitespace-nowrap font-medium text-ink">
                  {it.month}
                </td>
                <td className="min-w-[16rem]">{it.initiative}</td>
                <td className="whitespace-nowrap">{it.track}</td>
                <td className="whitespace-nowrap">{it.owner}</td>
                <td className="whitespace-nowrap">{it.department}</td>
                <td>{it.goal}</td>
                <td className="whitespace-nowrap">
                  <StatusPill status={it.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
