// Writes public/sitemap.xml with a fresh lastmod. Runs as the first step of
// `pnpm build` (see package.json), so the daily CI rebuild also refreshes the
// sitemap. The file is gitignored; it only exists as a build artifact.
//
// Every page is emitted once per locale, and each <url> carries the full set of
// hreflang <xhtml:link> alternates (plus x-default) so search engines serve the
// right language. Keep LOCALES in sync with src/i18n/config.ts.
import { writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const SITE_URL = "https://ramadan.zakiego.com";
const lastmod = new Date().toISOString().slice(0, 10);

// [locale prefix, hreflang]. English is the default and has no prefix.
const LOCALES = [
  ["", "en"],
  ["/ar", "ar"],
  ["/es", "es"],
  ["/hi", "hi"],
  ["/zh", "zh-Hans"],
];

// [path suffix, priority]. Home is the highest-priority page.
const PAGES = [
  ["", "1.0"],
  ["/eid", "0.8"],
];

const url = (prefix, suffix) => `${SITE_URL}${prefix}${suffix}` || SITE_URL;

function alternatesFor(suffix) {
  const links = LOCALES.map(
    ([prefix, hreflang]) =>
      `    <xhtml:link rel="alternate" hreflang="${hreflang}" href="${url(
        prefix,
        suffix,
      )}"/>`,
  );
  links.push(
    `    <xhtml:link rel="alternate" hreflang="x-default" href="${url(
      "",
      suffix,
    )}"/>`,
  );
  return links.join("\n");
}

const entries = [];
for (const [suffix, priority] of PAGES) {
  const alternates = alternatesFor(suffix);
  for (const [prefix] of LOCALES) {
    entries.push(`  <url>
    <loc>${url(prefix, suffix)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${priority}</priority>
${alternates}
  </url>`);
  }
}

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join("\n")}
</urlset>
`;

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const target = join(root, "public", "sitemap.xml");
writeFileSync(target, xml);
console.log(`Wrote ${target} (${entries.length} URLs, lastmod ${lastmod})`);
