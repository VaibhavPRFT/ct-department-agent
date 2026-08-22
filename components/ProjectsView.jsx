"use client";

import { useMemo, useState } from "react";

const GROUPINGS = [
  { key: "project", label: "By Project", field: "name" },
  { key: "pm", label: "By Project Manager", field: "pm" },
  { key: "account", label: "By Account Manager", field: "account" },
  { key: "delivery", label: "By Delivery Manager", field: "delivery" },
];

export default function ProjectsView({ data }) {
  const [status, setStatus] = useState("current");
  const [grouping, setGrouping] = useState(GROUPINGS[0]);
  const [selected, setSelected] = useState(null);

  const projects = status === "current" ? data.projects : [];

  const groups = useMemo(() => {
    const map = new Map();
    for (const p of projects) {
      const key = p[grouping.field] || "Unassigned";
      const memberCount = p.members.length;
      if (!map.has(key)) map.set(key, { key, memberCount: 0, projects: 0 });
      const g = map.get(key);
      g.memberCount += memberCount;
      g.projects += 1;
    }
    return Array.from(map.values()).sort((a, b) => b.memberCount - a.memberCount);
  }, [projects, grouping]);

  const maxCount = Math.max(1, ...groups.map((g) => g.memberCount));

  const visibleProjects = selected
    ? projects.filter((p) => (p[grouping.field] || "Unassigned") === selected)
    : projects;

  function pickGrouping(g) {
    setGrouping(g);
    setSelected(null);
  }

  return (
    <div className="container-page py-8">
      <div className="flex flex-wrap items-center gap-6">
        <div>
          <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Status
          </span>
          <div className="mt-1 inline-flex rounded-lg border border-slate-200 bg-white p-1">
            {["current", "past"].map((s) => (
              <button
                key={s}
                onClick={() => {
                  setStatus(s);
                  setSelected(null);
                }}
                className={
                  "rounded-md px-3 py-1 text-sm font-medium capitalize transition " +
                  (status === s
                    ? "bg-brand-500 text-white"
                    : "text-ink-soft hover:bg-slate-100")
                }
              >
                {s} projects
              </button>
            ))}
          </div>
        </div>

        <div>
          <span className="mr-2 text-xs font-semibold uppercase tracking-wide text-ink-faint">
            Group by
          </span>
          <div className="mt-1 flex flex-wrap gap-1">
            {GROUPINGS.map((g) => (
              <button
                key={g.key}
                onClick={() => pickGrouping(g)}
                className={
                  "rounded-lg border px-3 py-1 text-sm font-medium transition " +
                  (grouping.key === g.key
                    ? "border-brand-500 bg-brand-50 text-brand-700"
                    : "border-slate-200 bg-white text-ink-soft hover:border-brand-200")
                }
              >
                {g.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {projects.length === 0 ? (
        <p className="mt-10 rounded-xl border border-slate-200 bg-white p-6 text-sm text-ink-faint">
          No past projects to show.
        </p>
      ) : (
        <>
          <div className="card mt-8 p-6">
            <h2 className="text-base font-semibold text-ink">
              Team members {grouping.label.toLowerCase()}
            </h2>
            <p className="mt-1 text-xs text-ink-faint">
              Click a bar to filter the projects below
            </p>
            <div className="mt-4 space-y-3">
              {groups.map((g) => {
                const activeBar = selected === g.key;
                return (
                  <button
                    key={g.key}
                    onClick={() => setSelected(activeBar ? null : g.key)}
                    className="block w-full text-left"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <span
                        className={
                          "font-medium " +
                          (activeBar ? "text-brand-700" : "text-ink")
                        }
                      >
                        {g.key}
                      </span>
                      <span className="text-xs text-ink-faint">
                        {g.memberCount} members · {g.projects} project
                        {g.projects === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="mt-1 h-3 w-full rounded-full bg-slate-100">
                      <div
                        className={
                          "h-3 rounded-full transition-all " +
                          (activeBar ? "bg-brand-600" : "bg-brand-400")
                        }
                        style={{
                          width: `${(g.memberCount / maxCount) * 100}%`,
                        }}
                      />
                    </div>
                  </button>
                );
              })}
            </div>
            {selected ? (
              <button
                onClick={() => setSelected(null)}
                className="mt-4 text-xs font-semibold text-brand-600 hover:underline"
              >
                Clear filter ✕
              </button>
            ) : null}
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            {visibleProjects.map((p) => (
              <div key={p.name} className="card p-5">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-bold text-ink">{p.name}</h3>
                  <span className="text-xs text-ink-faint">
                    {p.members.length} members
                  </span>
                </div>
                <p className="mt-1 text-xs text-ink-faint">
                  PM: <span className="font-medium text-ink-soft">{p.pm}</span>{" "}
                  · Delivery:{" "}
                  <span className="font-medium text-ink-soft">{p.delivery}</span>{" "}
                  · Account:{" "}
                  <span className="font-medium text-ink-soft">{p.account}</span>
                </p>
                <table className="prose-table mt-4">
                  <thead>
                    <tr>
                      <th className="w-8">#</th>
                      <th>Team Member</th>
                      <th>Designation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {p.members.map((m, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td>
                          <span className="inline-flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-50 text-[10px] font-bold text-brand-600">
                              {m.initials}
                            </span>
                            <span className="font-medium text-ink">
                              {m.name}
                            </span>
                          </span>
                        </td>
                        <td>{m.designation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
