/**
 * Adds deploy-only asset routing to the wrangler config emitted by the build.
 *
 * The routing sends unmatched paths to a static 404 from the asset store, so
 * bot probes (/wp-login.php and friends) never wake the Worker. It cannot live
 * in wrangler.jsonc: the prerender step fetches every page from a dev server
 * governed by that same config, and during prerender those pages are not
 * assets yet, so they would be answered with the 404 page and the build would
 * die with "Failed to fetch /ar".
 *
 * Patching the build output instead sidesteps that entirely — this runs after
 * prerendering, and wrangler.jsonc stays the single source of truth for
 * everything else.
 *
 * Run after `vite build`, then deploy with:
 *   wrangler deploy -c dist/server/wrangler.json
 */
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const CONFIG = join(root, "dist", "server", "wrangler.json");

let config;
try {
  config = JSON.parse(readFileSync(CONFIG, "utf8"));
} catch (cause) {
  throw new Error(
    `Could not read ${CONFIG}. Run \`pnpm run build\` before this script.`,
    { cause },
  );
}

config.assets = {
  ...config.assets,
  // Only the clock-dependent endpoints need the Worker. Every page is
  // prerendered and /api/history is a static asset, so everything else is
  // served from the asset store, which does not bill Workers requests.
  run_worker_first: ["/api/countdown", "/api/ramadan"],
  // Unmatched paths get public/404.html from the asset store rather than
  // waking the Worker to render a not-found page.
  not_found_handling: "404-page",
};

writeFileSync(CONFIG, `${JSON.stringify(config, null, 2)}\n`);

console.log(
  "patched dist/server/wrangler.json: run_worker_first + not_found_handling",
);
