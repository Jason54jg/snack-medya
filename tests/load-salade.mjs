import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import ts from "typescript";
const root = new URL("../", import.meta.url);
/** Charge les vrais modules TypeScript avec leurs alias, sans serveur Next. */
export function loadTypescript(entry) {
  const cache = new Map();
  function load(filename) {
    const candidate = [filename, `${filename}.ts`, `${filename}.tsx`].find((file) => fs.existsSync(file) && fs.statSync(file).isFile());
    if (!candidate) throw new Error(`Module introuvable : ${filename}`);
    if (!/\.tsx?$/.test(candidate)) return createRequire(import.meta.url)(candidate);
    if (cache.has(candidate)) return cache.get(candidate).exports;
    const loaded = { exports: {} };
    cache.set(candidate, loaded);
    const nativeRequire = createRequire(candidate);
    const require = (id) => id.startsWith("@/")
      ? load(path.join(fileURLToPath(root), "src", id.slice(2)))
      : id.startsWith(".") ? load(path.resolve(path.dirname(candidate), id)) : nativeRequire(id);
    const source = ts.transpileModule(fs.readFileSync(candidate, "utf8"), {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
    }).outputText;
    new Function("require", "module", "exports", source)(require, loaded, loaded.exports);
    return loaded.exports;
  }
  return load(fileURLToPath(new URL(entry, root)));
}
