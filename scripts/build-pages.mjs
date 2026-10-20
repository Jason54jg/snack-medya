/**
 * Build GitHub Pages (export statique).
 * Met de côté temporairement /api et middleware (incompatibles avec output:export)
 * sans les retirer du dépôt — l’hébergement Pages est temporaire.
 */
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const bakRoot = path.join(root, ".pages-bak");

const items = [
  {
    from: path.join(root, "src", "app", "api"),
    to: path.join(bakRoot, "api"),
  },
  {
    from: path.join(root, "src", "middleware.ts"),
    to: path.join(bakRoot, "middleware.ts"),
  },
  // Redirections client (utilisent next-intl/headers) — hors export Pages
  {
    from: path.join(root, "src", "app", "[locale]", "menu"),
    to: path.join(bakRoot, "menu"),
  },
  {
    from: path.join(root, "src", "app", "[locale]", "contact"),
    to: path.join(bakRoot, "contact"),
  },
  {
    from: path.join(root, "src", "app", "[locale]", "configurateur"),
    to: path.join(bakRoot, "configurateur"),
  },
];

function stash(from, to) {
  if (!fs.existsSync(from)) return false;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  fs.rmSync(from, { recursive: true, force: true });
  return true;
}

function restore(from, to) {
  if (!fs.existsSync(from)) return;
  fs.mkdirSync(path.dirname(to), { recursive: true });
  if (fs.existsSync(to)) fs.rmSync(to, { recursive: true, force: true });
  fs.cpSync(from, to, { recursive: true });
  fs.rmSync(from, { recursive: true, force: true });
}

fs.mkdirSync(bakRoot, { recursive: true });
const stashed = [];

try {
  for (const item of items) {
    if (stash(item.from, item.to)) stashed.push(item);
  }

  execSync("npx next build", {
    stdio: "inherit",
    env: {
      ...process.env,
      GITHUB_PAGES: "true",
      GITHUB_REPOSITORY:
        process.env.GITHUB_REPOSITORY ?? "Jason54jg/snack-medya",
    },
  });
} finally {
  for (const item of stashed.reverse()) {
    restore(item.to, item.from);
  }
  if (fs.existsSync(bakRoot)) {
    fs.rmSync(bakRoot, { recursive: true, force: true });
  }
}
