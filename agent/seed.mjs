import fs from "node:fs";
import path from "node:path";
import { readData, writeData, fileExists, log, ROOT, DATA_FILES } from "./lib.mjs";

/**
 * seed — the baseline pipeline step.
 *
 * The /data/*.json files are the source of truth that drives the Next.js site
 * (they were seeded from the live commercetools-insights dashboard). This step:
 *   1. validates every data file is present and parseable,
 *   2. recomputes all derived counters so the dashboard headline numbers can
 *      never drift from the underlying content, and
 *   3. writes a run manifest to agent/last-run.json.
 */
export async function seed({ stamp = false } = {}) {
  log.step("Validating data files");
  const missing = Object.keys(DATA_FILES).filter((k) => !fileExists(k));
  if (missing.length) {
    log.err(`Missing data files: ${missing.join(", ")}`);
    process.exit(1);
  }
  const site = readData("site");
  const newsletter = readData("newsletter");
  const plan = readData("quarterlyPlan");
  const accelerators = readData("accelerators");
  const projects = readData("projects");
  log.ok("All 5 data files present and valid JSON");

  log.step("Recomputing derived counters");

  // --- Quarterly plan per-quarter stats ---
  let totalInitiatives = 0;
  for (const q of plan.quarters) {
    const initiatives = q.initiatives.length;
    const done = q.initiatives.filter(
      (i) => String(i.status).toLowerCase() === "done"
    ).length;
    q.stats = { initiatives, done, open: initiatives - done };
    totalInitiatives += initiatives;
  }

  // --- Accelerator rollups ---
  const acceleratorCount = accelerators.accelerators.length;
  const totalBenefits = accelerators.accelerators.reduce(
    (n, a) => n + a.keyBenefits.length,
    0
  );

  // --- Project rollups ---
  const projectCount = projects.projects.length;
  const totalPeople = projects.projects.reduce(
    (n, p) => n + p.members.length,
    0
  );

  // --- Dashboard cards ---
  const cardByHref = (href) =>
    site.dashboard.cards.find((c) => c.href === href);

  const nl = cardByHref("/newsletter");
  if (nl)
    nl.stats = [
      { value: String(newsletter.trends.length), label: "trends" },
      { value: String(newsletter.blogOpportunities.length), label: "blog ideas" },
      { value: String(newsletter.releases.length), label: "releases" },
      { value: String(newsletter.roadmap.length), label: "roadmaps" },
    ];

  const qp = cardByHref("/quarterly-plan");
  if (qp)
    qp.stats = [
      { value: String(plan.quarters.length), label: "quarters" },
      { value: String(totalInitiatives), label: "initiatives" },
    ];

  const ac = cardByHref("/accelerators");
  if (ac) {
    ac.stats = [
      { value: String(acceleratorCount), label: "accelerators" },
      { value: String(totalBenefits), label: "customer benefits" },
      { value: String(acceleratorCount), label: "platform areas" },
    ];
    ac.items = accelerators.accelerators.map((a) => ({
      n: a.n,
      status: a.status,
      name: a.name,
      tagline: a.tagline,
    }));
  }

  const pr = cardByHref("/projects");
  if (pr) {
    pr.stats = [
      { value: String(projectCount), label: "projects" },
      { value: String(totalPeople), label: "people" },
      { value: String(totalPeople), label: "team seats" },
    ];
    pr.chips = projects.projects.map((p) => p.name);
  }

  if (stamp) {
    const human = new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
    newsletter.meta.generated = `Generated ${human}`;
    plan.meta.generated = `Generated: ${human}`;
    site.dashboard.latestSweep = `Newsletter generated ${human} · Quarterly plan generated ${human}.`;
    log.info(`Stamped generated dates to ${human}`);
  }

  writeData("site", site);
  writeData("quarterlyPlan", plan);
  log.ok("Derived counters recomputed and written");

  const manifest = {
    mode: "seed",
    timestamp: new Date().toISOString(),
    stamped: stamp,
    counts: {
      trends: newsletter.trends.length,
      releases: newsletter.releases.length,
      blogOpportunities: newsletter.blogOpportunities.length,
      roadmaps: newsletter.roadmap.length,
      quarters: plan.quarters.length,
      initiatives: totalInitiatives,
      accelerators: acceleratorCount,
      customerBenefits: totalBenefits,
      projects: projectCount,
      people: totalPeople,
    },
  };
  fs.writeFileSync(
    path.join(ROOT, "agent", "last-run.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );

  log.ok("Wrote agent/last-run.json");
  console.log("");
  log.info("Summary: " + JSON.stringify(manifest.counts));
  return manifest;
}
