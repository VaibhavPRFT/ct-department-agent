import { log } from "./lib.mjs";
import { seed } from "./seed.mjs";

/**
 * Sources the live Department Agent would sweep to regenerate the newsletter.
 * Wire these up when moving from seed data to autonomous generation.
 */
export const SOURCES = [
  { name: "Release notes", url: "https://docs.commercetools.com/docs/release-notes" },
  { name: "Product / roadmap", url: "https://commercetools.com/products" },
  { name: "Press releases", url: "https://commercetools.com/press-releases" },
  { name: "Events", url: "https://commercetools.com/events" },
  { name: "Blog", url: "https://commercetools.com/blog" },
];

/**
 * gather() — placeholder for the live research pass.
 *
 * The real implementation fetches SOURCES, extracts dated releases / events /
 * roadmap items within the lookback window, clusters them into trends, scores
 * blog / whitepaper / LinkedIn opportunities, and returns a newsletter object
 * in the same shape as data/newsletter.json. It needs a model/API key and web
 * access, both provided later. Until then we DO NOT fabricate content.
 */
async function gather() {
  const enabled = process.env.CT_RESEARCH === "1";
  const hasModel = Boolean(
    process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY
  );
  if (!enabled || !hasModel) {
    return { ready: false, hasModel, enabled };
  }
  // TODO: implement fetch + cluster + score against SOURCES.
  return { ready: false, hasModel, enabled, note: "gather() not yet implemented" };
}

export async function generate({ stamp = true } = {}) {
  log.step("generate — refresh the dashboard data set");

  const research = await gather();
  if (!research.ready) {
    log.warn("Live research is not active — running the seed pipeline instead.");
    if (!research.enabled)
      log.info("Set CT_RESEARCH=1 to enable the live sweep.");
    if (!research.hasModel)
      log.info("Provide ANTHROPIC_API_KEY (or OPENAI_API_KEY) for content generation.");
    log.info(
      "Sources it will sweep: " + SOURCES.map((s) => s.name).join(", ")
    );
  }

  // Keep counters and (optionally) dates consistent.
  const manifest = await seed({ stamp });
  manifest.mode = "generate";
  manifest.researchActive = Boolean(research.ready);
  log.ok("generate complete");
  return manifest;
}
