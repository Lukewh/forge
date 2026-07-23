/**
 * Forge — Scheduler launcher (standalone, long-lived process)
 * Run via: node start-scheduler.mjs
 */

import { createJiti } from "jiti";
import { fileURLToPath } from "url";

const jiti = createJiti(fileURLToPath(import.meta.url), { interopDefault: true });

const { ForgeDB }        = jiti(new URL("./db.ts", import.meta.url).pathname);
const { ForgeScheduler } = jiti(new URL("./scheduler.ts", import.meta.url).pathname);

const db        = new ForgeDB();
const scheduler = new ForgeScheduler(db, (msg) => console.log(msg));

scheduler.start();
console.log(`[forge:scheduler] PID ${process.pid} — running`);

process.on("SIGINT",  () => { scheduler.stop(); db.close(); process.exit(0); });
process.on("SIGTERM", () => { scheduler.stop(); db.close(); process.exit(0); });

// Keep alive
setInterval(() => {}, 60_000);
