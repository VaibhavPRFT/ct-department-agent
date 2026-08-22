const STYLES = {
  done: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "production-ready": "border-emerald-200 bg-emerald-50 text-emerald-700",
  "in progress": "border-amber-200 bg-amber-50 text-amber-700",
  scheduled: "border-sky-200 bg-sky-50 text-sky-700",
  planning: "border-sky-200 bg-sky-50 text-sky-700",
  "to do": "border-slate-200 bg-slate-50 text-slate-600",
  proposed: "border-violet-200 bg-violet-50 text-violet-700",
};

export default function StatusPill({ status }) {
  const key = String(status || "").toLowerCase();
  const cls = STYLES[key] || "border-slate-200 bg-slate-50 text-slate-600";
  return <span className={"pill " + cls}>{status}</span>;
}
