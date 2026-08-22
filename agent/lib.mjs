import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(__dirname, "..");
export const DATA_DIR = path.join(ROOT, "data");

export const DATA_FILES = {
  site: "site.json",
  newsletter: "newsletter.json",
  quarterlyPlan: "quarterly-plan.json",
  accelerators: "accelerators.json",
  projects: "projects.json",
};

export function readData(key) {
  const file = path.join(DATA_DIR, DATA_FILES[key]);
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function writeData(key, obj) {
  const file = path.join(DATA_DIR, DATA_FILES[key]);
  fs.writeFileSync(file, JSON.stringify(obj, null, 2) + "\n", "utf8");
}

export function fileExists(key) {
  return fs.existsSync(path.join(DATA_DIR, DATA_FILES[key]));
}

const COLORS = {
  reset: "\x1b[0m",
  dim: "\x1b[2m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

export const log = {
  step: (m) => console.log(`${COLORS.cyan}▸${COLORS.reset} ${m}`),
  ok: (m) => console.log(`${COLORS.green}✓${COLORS.reset} ${m}`),
  warn: (m) => console.log(`${COLORS.yellow}!${COLORS.reset} ${m}`),
  err: (m) => console.log(`${COLORS.red}✗${COLORS.reset} ${m}`),
  info: (m) => console.log(`${COLORS.dim}  ${m}${COLORS.reset}`),
};

export function today() {
  return new Date().toISOString().slice(0, 10);
}
