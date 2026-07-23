import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const source = readFileSync(new URL("../dashboard/frontend/src/main.ts", import.meta.url), "utf8");
const styles = readFileSync(new URL("../dashboard/frontend/src/style.css", import.meta.url), "utf8");
const pkg = JSON.parse(readFileSync(new URL("../package.json", import.meta.url), "utf8"));

describe("dashboard v3 settings view", () => {
  it("registers settings tests in frontend/default test scripts", () => {
    assert.match(pkg.scripts.test, /test\/dashboard-settings-view\.test\.mjs/);
    assert.match(pkg.scripts["test:fe"], /test\/dashboard-settings-view\.test\.mjs/);
    assert.match(pkg.scripts["test:all"], /test\/dashboard-settings-view\.test\.mjs/);
  });

  it("reactive source defines a settings view backed by existing settings API", () => {
    assert.match(source, /function SettingsView\(/);
    assert.match(source, /getJson<Settings>\("\/api\/settings"\)/);
    assert.match(source, /fetch\("\/api\/settings",\s*\{/s);
    assert.match(source, /method:\s*"PATCH"/);
    assert.match(source, /activeView === "settings"/);
  });

  it("settings view exposes the desktop backend picker from v2", () => {
    assert.match(source, /getJson<DesktopBackend>\("\/api\/desktop-backend"\)/);
    assert.match(source, /fetch\("\/api\/desktop-backend",\s*\{/s);
    assert.match(source, /backendOrigin/);
    assert.match(source, /href:\s*"\/desktop\/backend"/);
    assert.match(source, /Desktop backend origin/);
    assert.match(source, /href:\s*"\/classic\.html"/);
    assert.match(source, /Open classic v2/);
  });

  it("settings view groups known settings and keeps unknown settings visible", () => {
    assert.match(source, /SETTING_GROUPS/);
    assert.match(source, /Automation/);
    assert.match(source, /External Services/);
    assert.match(source, /Code Workspace/);
    assert.match(source, /Command Runtime/);
    assert.match(source, /Dashboard Backend/);
    assert.match(source, /Other/);
    assert.match(source, /unknownSettings/);
  });

  it("settings view renders correct controls and save/reset UX", () => {
    assert.match(source, /inputTypeForSetting/);
    assert.match(source, /type:\s*inputTypeForSetting\(setting\.key\)/);
    assert.match(source, /textarea/);
    assert.match(source, /Save settings/);
    assert.match(source, /Reset changes/);
    assert.match(source, /DB key/);
  });

  it("settings save is hardened with diffs, validation, and read-only unknown settings", () => {
    assert.match(source, /changedSettingsPayload/);
    assert.match(source, /validateSettingsDraft/);
    assert.match(source, /normalizeSettingValue/);
    assert.match(source, /allowUnknownSettings/);
    assert.match(source, /Edit unknown/);
    assert.match(source, /read-only/);
    assert.match(source, /Only settings you change will be sent on save/);
    assert.match(source, /Fix validation errors before saving/);
    assert.match(source, /response\.ok \? payload : Promise\.reject/);
    assert.match(source, /Number\.isFinite/);
  });

  it("settings stylesheet provides grouped cards and form treatments", () => {
    assert.match(styles, /\.forge-v3-settings-grid\s*\{[^}]*grid-template-columns/s);
    assert.match(styles, /\.forge-v3-settings-card/);
    assert.match(styles, /\.forge-v3-setting-row/);
    assert.match(styles, /\.forge-v3-setting-control/);
    assert.match(styles, /\.forge-v3-settings-errors/);
    assert.match(styles, /\.forge-v3-other-unlock/);
  });
});
