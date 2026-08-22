#!/usr/bin/env node
import { seed } from "./seed.mjs";
import { generate } from "./generate.mjs";
import { deploy } from "./deploy.mjs";
import { log } from "./lib.mjs";

const [, , cmd, ...rest] = process.argv;
const flags = new Set(rest);
const opts = {
  stamp: flags.has("--stamp"),
  confirm: flags.has("--confirm"),
};

function usage() {
  console.log(`
commercetools Insights — content agent

Usage: node agent/index.mjs <command> [flags]

Commands:
  seed        Validate data files and recompute all derived counters.
  generate    Refresh the data set (live research when configured; else seed).
  deploy      Push the site to Vercel (safe dry run unless --confirm).

Flags:
  --stamp     Update the "generated" dates to today (seed/generate).
  --confirm   Actually deploy (deploy only). Requires Vercel credentials.

Examples:
  npm run agent:seed
  npm run agent:generate -- --stamp
  npm run agent:deploy            # dry run
  npm run agent:deploy -- --confirm
`);
}

async function main() {
  switch (cmd) {
    case "seed":
      await seed(opts);
      break;
    case "generate":
      await generate({ stamp: opts.stamp });
      break;
    case "deploy":
      await deploy(opts);
      break;
    case "help":
    case undefined:
      usage();
      break;
    default:
      log.err(`Unknown command: ${cmd}`);
      usage();
      process.exit(1);
  }
}

main().catch((e) => {
  log.err(e?.stack || String(e));
  process.exit(1);
});
