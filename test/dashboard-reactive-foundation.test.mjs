import { describe, test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { FORGE_DIR } from "./helpers.mjs";

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

function read(path) {
  return readFileSync(path, "utf8");
}

describe("dashboard reactive frontend foundation", () => {
  test("package scripts and dependencies define the dashboard reactive toolchain", () => {
    const pkg = readJson(`${FORGE_DIR}/package.json`);

    assert.match(pkg.dependencies?.preact ?? "", /^\^10\./);
    assert.match(pkg.devDependencies?.["@preact/preset-vite"] ?? "", /^\^2\./);
    assert.match(pkg.devDependencies?.vite ?? "", /^\^6\./);
    assert.equal(pkg.scripts?.["dashboard:dev"], "vite --config dashboard/frontend/vite.config.mjs");
    assert.equal(pkg.scripts?.["dashboard:build"], "vite build --config dashboard/frontend/vite.config.mjs");
    assert.equal(pkg.scripts?.["dashboard:check"], "tsc --noEmit -p dashboard/frontend/tsconfig.json");
  });

  test("legacy dashboard shell has a contained reactive app mount", () => {
    const html = read(`${FORGE_DIR}/dashboard/public/index.html`);

    assert.match(html, /id="forge-react-root"/);
    assert.match(html, /data-reactive-dashboard-root/);
    assert.match(html, /type="module" src="v3\/forge-dashboard\.js"/);
    assert.match(html, /href="v3\/forge-dashboard\.css"/);
  });

  test("Vite config builds stable assets into the existing public static tree", () => {
    const configPath = `${FORGE_DIR}/dashboard/frontend/vite.config.mjs`;
    assert.equal(existsSync(configPath), true);

    const config = read(configPath);
    assert.match(config, /outDir:\s*['"]\.\.\/public\/v3['"]/);
    assert.match(config, /entry:\s*['"]src\/main\.ts['"]/);
    assert.match(config, /entryFileNames:\s*['"]forge-dashboard\.js['"]/);
    assert.match(config, /assetFileNames:\s*['"]forge-dashboard\.css['"]/);
  });

  test("minimal Preact app source mounts without taking over legacy app.js", () => {
    const tsconfigPath = `${FORGE_DIR}/dashboard/frontend/tsconfig.json`;
    assert.equal(existsSync(tsconfigPath), true);

    const tsconfig = readJson(tsconfigPath);
    assert.equal(tsconfig.compilerOptions?.strict, true);
    assert.equal(tsconfig.compilerOptions?.noEmit, true);

    const srcPath = `${FORGE_DIR}/dashboard/frontend/src/main.ts`;
    assert.equal(existsSync(srcPath), true);

    const src = read(srcPath);
    assert.match(src, /from\s+['"]preact['"]/);
    assert.match(src, /render\(/);
    assert.match(src, /forge-react-root/);
    assert.doesNotMatch(src, /from\s+['"]\.\.\/\.\.\/public\/app\.js['"]/);
  });
});
