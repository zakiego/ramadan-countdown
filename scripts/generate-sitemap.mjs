// Writes public/sitemap.xml with a fresh lastmod. Runs as the first step of
// `pnpm build` (see package.json), so the daily CI rebuild also refreshes the
// sitemap. The file is gitignored; it only exists as a build artifact.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://ramadan.zakiego.com";
const lastmod = new Date().toISOString().slice(0, 10);

const urls = [
  { loc: SITE_URL, priority: "1.0" },
  { loc: `${SITE_URL}/eid`, priority: "0.8" },
];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>
`;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "public", "sitemap.xml");
writeFileSync(target, xml);
console.log(`Wrote ${target} (lastmod ${lastmod})`);
