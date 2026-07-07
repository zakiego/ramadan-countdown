import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

// Ramadan date math in getRamadanState runs in local time, and it only ever
// executes on UTC hosts (Cloudflare Workers + CI). Pin tests to UTC so day
// counts stay deterministic regardless of the developer's machine timezone
// (e.g. DST-observing zones would otherwise miscount days spanning a DST change).
process.env.TZ = "UTC";

export default defineConfig({
  test: {
    environment: "node",
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
