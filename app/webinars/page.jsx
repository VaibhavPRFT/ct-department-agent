import data from "@/data/webinars.json";
import WebinarsView from "@/components/WebinarsView";

export const metadata = {
  title: "Webinar Series Tracker — Royal Cyber commercetools Insights",
  description:
    "commercetools + MetafyAI webinar series: session schedule, weekly task plan by team, and the weekly review of risks and fixes.",
};

export default function WebinarsPage() {
  const { meta, weeks } = data;
  const all = weeks.flatMap((w) => w.tasks);
  const done = all.filter((t) => t.status === "Done").length;
  const stats = [
    { value: data.sessions.length, label: "sessions" },
    { value: weeks.length, label: "weeks published" },
    { value: all.length, label: "tasks" },
    { value: `${done}/${all.length}`, label: "done" },
  ];

  return (
    <>
      <section>
        <div className="container-page py-12 sm:py-16">
          <p className="eyebrow">{meta.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-soft">
            {meta.summary} · {meta.updated}
          </p>
          <div className="mt-6 flex flex-wrap gap-6">
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col">
                <span className="text-xl font-bold text-ink">{s.value}</span>
                <span className="text-xs text-ink-faint">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
      <WebinarsView data={data} />
    </>
  );
}
