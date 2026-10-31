/** Export Pages : déplacement réversible des routes serveur, sans copie/suppression. */
import { spawnSync } from "node:child_process";
import { createRequire } from "node:module";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
const require = createRequire(import.meta.url);
const root = fileURLToPath(new URL("../", import.meta.url));
const backup = path.join(root, ".pages-bak");
const paths = ["src/app/api", "src/middleware.ts", "src/app/[locale]/menu", "src/app/[locale]/contact", "src/app/[locale]/configurateur"];
if (fs.existsSync(backup)) {
  throw new Error("Une sauvegarde .pages-bak existe déjà. Restaurer ses sources avant de relancer le build ; aucun fichier ne sera écrasé.");
}
// Un précédent build serveur peut laisser des routes incompatibles dans les artefacts.
fs.rmSync(path.join(root, ".next"), { recursive: true, force: true });
fs.mkdirSync(backup);
const moved = [];
let status = 1;
try {
  for (const [index, relative] of paths.entries()) {
    const from = path.join(root, relative);
    if (!fs.existsSync(from)) continue;
    const to = path.join(backup, String(index));
    fs.renameSync(from, to);
    moved.push({ from, to });
  }
  const result = spawnSync(process.execPath, [require.resolve("next/dist/bin/next"), "build"], {
    cwd: root,
    stdio: "inherit",
    env: { ...process.env, GITHUB_PAGES: "true", GITHUB_REPOSITORY: process.env.GITHUB_REPOSITORY ?? "Jason54jg/snack-medya" },
  });
  if (result.error) throw result.error;
  status = result.status ?? 1;
} finally {
  for (const { from, to } of moved.reverse()) {
    if (fs.existsSync(from)) throw new Error(`Restauration interrompue pour ne pas écraser ${from}. La sauvegarde reste dans ${backup}.`);
    fs.renameSync(to, from);
  }
  // Ne retirer que le dossier vide : une sauvegarde non restaurée reste intacte.
  fs.rmdirSync(backup);
}
process.exitCode = status;
