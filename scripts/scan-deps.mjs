import fs from "node:fs";
import path from "node:path";

const repoRoot = path.resolve(process.cwd());

const PKG_JSON_PATH = path.join(repoRoot, "package.json");
const pkg = JSON.parse(fs.readFileSync(PKG_JSON_PATH, "utf8"));

const deps = Object.keys(pkg.dependencies ?? {});
const devDeps = Object.keys(pkg.devDependencies ?? {});

const IGNORE_DIRS = new Set([
  ".git",
  "node_modules",
  "dist",
  "build",
  "coverage",
  ".vercel",
  ".next",
  ".turbo",
]);

const SCAN_EXTS = new Set([
  ".ts",
  ".tsx",
  ".js",
  ".jsx",
  ".mjs",
  ".cjs",
  ".json",
  ".css",
  ".html",
]);

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isDirectory()) {
      if (IGNORE_DIRS.has(entry.name)) continue;
      walk(path.join(dir, entry.name), acc);
      continue;
    }
    const filePath = path.join(dir, entry.name);
    if (SCAN_EXTS.has(path.extname(entry.name))) acc.push(filePath);
  }
  return acc;
}

function extractSpecifiers(text) {
  const specs = [];

  // import ... from "x"
  // export ... from "x"
  const reFrom =
    /\b(?:import|export)\s+(?:type\s+)?[\s\S]*?\sfrom\s*["']([^"']+)["']/g;

  // import("x")
  const reDyn = /\bimport\s*\(\s*["']([^"']+)["']\s*\)/g;

  // require("x")
  const reReq = /\brequire\s*\(\s*["']([^"']+)["']\s*\)/g;

  for (const re of [reFrom, reDyn, reReq]) {
    let m;
    while ((m = re.exec(text))) specs.push(m[1]);
  }

  return specs;
}

function normalizePackageName(spec) {
  if (!spec) return null;
  if (spec.startsWith(".") || spec.startsWith("/") || spec.startsWith("~")) {
    return null;
  }
  if (spec.startsWith("@/")) return null; // Vite/TS path alias

  // For scoped packages, keep "@scope/name" (first 2 segments).
  // For normal packages, keep first segment.
  const parts = spec.split("/");
  if (spec.startsWith("@")) {
    if (parts.length >= 2) return `${parts[0]}/${parts[1]}`;
    return spec;
  }
  return parts[0];
}

const files = walk(repoRoot);
const used = new Map(); // pkgName -> Set<file>

for (const file of files) {
  const text = fs.readFileSync(file, "utf8");
  const specs = extractSpecifiers(text);
  for (const s of specs) {
    const pkgName = normalizePackageName(s);
    if (!pkgName) continue;
    const set = used.get(pkgName) ?? new Set();
    set.add(path.relative(repoRoot, file));
    used.set(pkgName, set);
  }
}

function asSorted(arr) {
  return [...arr].sort((a, b) => a.localeCompare(b));
}

function reportList(title, list) {
  console.log(JSON.stringify({ title, items: list }, null, 2));
}

const unusedDeps = asSorted(deps.filter((d) => !used.has(d)));
const unusedDevDeps = asSorted(devDeps.filter((d) => !used.has(d)));

// Dependencies that appear to be used but aren't declared (helpful for sanity).
const declared = new Set([...deps, ...devDeps]);
const undeclaredUsed = asSorted(
  [...used.keys()].filter((u) => !declared.has(u))
);

reportList("unusedDependencies", unusedDeps);
reportList("unusedDevDependencies", unusedDevDeps);
reportList("usedButNotDeclared", undeclaredUsed);

// Also print a compact “where used” for declared deps (optional, can be noisy).
// Consumers can re-run locally and inspect, so keep output minimal by default.
