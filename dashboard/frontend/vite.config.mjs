import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import preact from "@preact/preset-vite";

const root = fileURLToPath(new URL(".", import.meta.url));

export default defineConfig({
  root,
  plugins: [preact()],
  build: {
    emptyOutDir: true,
    outDir: "../public/v3",
    lib: {
      entry: "src/main.ts",
      name: "ForgeDashboardV3",
      formats: ["es"],
    },
    rollupOptions: {
      output: {
        entryFileNames: "forge-dashboard.js",
        assetFileNames: "forge-dashboard.css",
      },
    },
  },
});
