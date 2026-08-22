import { execSync } from "node:child_process";
import { log, ROOT } from "./lib.mjs";

/**
 * deploy — push the current data-driven site to Vercel.
 *
 * SAFE BY DEFAULT: without --confirm this only prints the plan. Nothing is
 * published until you pass --confirm AND provide credentials via env vars,
 * so you (not the agent) trigger the deploy. Configure Vercel details later:
 *
 *   VERCEL_DEPLOY_HOOK_URL   a Vercel Deploy Hook (recommended, simplest)
 *   VERCEL_TOKEN             a Vercel access token (uses the Vercel CLI)
 *   DEPLOY_MODE              force "hook" | "cli" (otherwise auto-detected)
 */
function resolveMode() {
  if (process.env.DEPLOY_MODE) return process.env.DEPLOY_MODE;
  if (process.env.VERCEL_DEPLOY_HOOK_URL) return "hook";
  if (process.env.VERCEL_TOKEN) return "cli";
  return "none";
}

export async function deploy({ confirm = false } = {}) {
  const mode = resolveMode();
  log.step(`deploy — target mode: ${mode}`);

  if (mode === "none") {
    log.warn("No Vercel credentials configured yet.");
    log.info("Set ONE of the following (see .env.example), then re-run:");
    log.info("  VERCEL_DEPLOY_HOOK_URL=https://api.vercel.com/v1/integrations/deploy/...");
    log.info("  VERCEL_TOKEN=xxxxxxxx   (deploys with the Vercel CLI)");
    return { deployed: false, mode };
  }

  if (!confirm) {
    log.warn("Dry run. Re-run with --confirm to actually deploy.");
    if (mode === "hook")
      log.info("Would POST to VERCEL_DEPLOY_HOOK_URL to trigger a redeploy.");
    if (mode === "cli")
      log.info("Would run: npx vercel deploy --prod --yes");
    return { deployed: false, mode, dryRun: true };
  }

  if (mode === "hook") {
    const url = process.env.VERCEL_DEPLOY_HOOK_URL;
    log.step("Triggering Vercel deploy hook");
    const res = await fetch(url, { method: "POST" });
    if (!res.ok) {
      log.err(`Deploy hook returned ${res.status}`);
      process.exit(1);
    }
    log.ok(`Deploy hook accepted (${res.status}). Vercel is building.`);
    return { deployed: true, mode };
  }

  if (mode === "cli") {
    log.step("Deploying with the Vercel CLI");
    const token = process.env.VERCEL_TOKEN;
    execSync(`npx --yes vercel deploy --prod --yes --token=${token}`, {
      cwd: ROOT,
      stdio: "inherit",
    });
    log.ok("Vercel CLI deploy complete");
    return { deployed: true, mode };
  }

  log.err(`Unknown DEPLOY_MODE: ${mode}`);
  process.exit(1);
}
