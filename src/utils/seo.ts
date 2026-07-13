import type { RamadanData } from "@/data/ramadan";
import {
  DEFAULT_LOCALE,
  LOCALE_META,
  type Locale,
  type PageKey,
  alternateLinks,
  localePath,
} from "@/i18n/config";
import { getMessages } from "@/i18n/messages";
import type { Faq, PageSeo } from "@/i18n/messages/types";
import { addDaysUtc, daysBetweenUtc, makeDateFmt, toUtcMidnight } from "./date";

export const SITE_URL = "https://ramadan.zakiego.com";

export type { Faq, PageSeo } from "@/i18n/messages/types";
export { daysBetweenUtc } from "./date";

/**
 * The moment the site was built, injected by Vite `define`. All prerendered
 * SEO copy derives from this single timestamp so the server HTML and the
 * hydrating client bundle always agree (no hydration mismatch). CI rebuilds
 * daily to keep it fresh. Falls back to the current time in environments
 * without the define (e.g. Vitest).
 */
export function getBuildDate(): Date {
  return typeof __BUILD_DATE__ === "string"
    ? new Date(__BUILD_DATE__)
    : new Date();
}

function totalRamadanDays(ramadan: RamadanData): number {
  return daysBetweenUtc(ramadan.ramadanStart, ramadan.ramadanEnd) + 1;
}

// ---------------------------------------------------------------------------
// Phase detection (which copy the page should carry, resolved at build time).
// Locale-independent: only the words differ per language, not the phase.
// ---------------------------------------------------------------------------

export type HomeSeoPhase =
  | { mode: "pre"; target: RamadanData; daysUntil: number }
  | {
      mode: "during";
      target: RamadanData;
      dayOf: number;
      totalDays: number;
      daysUntilEid: number;
    }
  | { mode: "eid"; target: RamadanData };

export function getHomeSeoPhase(
  ramadans: RamadanData[],
  now: Date,
): HomeSeoPhase {
  const today = toUtcMidnight(now);
  const sorted = [...ramadans].sort(
    (a, b) => a.ramadanStart.getTime() - b.ramadanStart.getTime(),
  );

  for (const ramadan of sorted) {
    if (today.getTime() === toUtcMidnight(ramadan.eidAlFitr).getTime()) {
      return { mode: "eid", target: ramadan };
    }
    if (
      today >= toUtcMidnight(ramadan.ramadanStart) &&
      today <= toUtcMidnight(ramadan.ramadanEnd)
    ) {
      return {
        mode: "during",
        target: ramadan,
        dayOf: daysBetweenUtc(ramadan.ramadanStart, today) + 1,
        totalDays: totalRamadanDays(ramadan),
        daysUntilEid: daysBetweenUtc(today, ramadan.eidAlFitr),
      };
    }
  }

  const next = sorted.find((r) => toUtcMidnight(r.ramadanStart) > today);
  const target = next ?? sorted[sorted.length - 1];
  return {
    mode: "pre",
    target,
    daysUntil: Math.max(0, daysBetweenUtc(today, target.ramadanStart)),
  };
}

/** Eid page: celebration copy on Eid day and the two days after it. */
export type EidSeoPhase =
  | { mode: "pre"; target: RamadanData; daysUntil: number }
  | { mode: "day"; target: RamadanData };

export function getEidSeoPhase(
  ramadans: RamadanData[],
  now: Date,
): EidSeoPhase {
  const today = toUtcMidnight(now);
  const sorted = [...ramadans].sort(
    (a, b) => a.eidAlFitr.getTime() - b.eidAlFitr.getTime(),
  );

  for (const ramadan of sorted) {
    const eid = toUtcMidnight(ramadan.eidAlFitr);
    if (today >= eid && today <= addDaysUtc(eid, 2)) {
      return { mode: "day", target: ramadan };
    }
  }

  const next = sorted.find((r) => toUtcMidnight(r.eidAlFitr) > today);
  const target = next ?? sorted[sorted.length - 1];
  return {
    mode: "pre",
    target,
    daysUntil: Math.max(0, daysBetweenUtc(today, target.eidAlFitr)),
  };
}

// ---------------------------------------------------------------------------
// Copy builders. Phase detection lives here; the words come from the locale.
// `locale` defaults to English so existing callers and tests are unaffected.
// ---------------------------------------------------------------------------

export function getHomeSeo(
  ramadans: RamadanData[],
  now: Date,
  locale: Locale = DEFAULT_LOCALE,
): PageSeo {
  const phase = getHomeSeoPhase(ramadans, now);
  const fmt = makeDateFmt(LOCALE_META[locale].dateLocale);
  const t = getMessages(locale);

  if (phase.mode === "during") {
    return t.home.during({
      target: phase.target,
      dayOf: phase.dayOf,
      totalDays: phase.totalDays,
      daysUntilEid: phase.daysUntilEid,
      fmt,
    });
  }

  if (phase.mode === "eid") {
    const next = ramadans.find(
      (r) => r.ramadanStart.getTime() > phase.target.ramadanStart.getTime(),
    );
    return t.home.eid({ target: phase.target, next, fmt });
  }

  return t.home.pre({
    target: phase.target,
    daysUntil: phase.daysUntil,
    eveOfStart: addDaysUtc(phase.target.ramadanStart, -1),
    fmt,
  });
}

export function getEidSeo(
  ramadans: RamadanData[],
  now: Date,
  locale: Locale = DEFAULT_LOCALE,
): PageSeo {
  const phase = getEidSeoPhase(ramadans, now);
  const fmt = makeDateFmt(LOCALE_META[locale].dateLocale);
  const t = getMessages(locale);

  if (phase.mode === "day") {
    const next = ramadans.find(
      (r) => r.eidAlFitr.getTime() > phase.target.eidAlFitr.getTime(),
    );
    return t.eidPage.day({ target: phase.target, next, fmt });
  }

  const ramadanStarted =
    toUtcMidnight(now) >= toUtcMidnight(phase.target.ramadanStart);
  return t.eidPage.pre({
    target: phase.target,
    daysUntil: phase.daysUntil,
    ramadanStarted,
    fmt,
  });
}

// ---------------------------------------------------------------------------
// Per-page <head>: title, description, canonical, hreflang alternates, OG /
// Twitter cards and JSON-LD. Shared by the English root routes and the
// prefixed `$locale` routes so every language emits consistent tags.
// ---------------------------------------------------------------------------

export function canonicalUrl(locale: Locale, page: PageKey): string {
  const path = localePath(locale, page);
  return path === "/" ? SITE_URL : `${SITE_URL}${path}`;
}

export function buildPageHead(locale: Locale, page: PageKey, seo: PageSeo) {
  const canonical = canonicalUrl(locale, page);
  const image =
    page === "eid" ? `${SITE_URL}/og-eid.png` : `${SITE_URL}/og.png`;
  const imageAlt =
    page === "eid" ? "Eid al-Fitr Countdown" : "Ramadan Countdown";

  const scripts: Array<{ type: string; children: string }> = [];
  if (page === "home") {
    scripts.push({
      type: "application/ld+json",
      children: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "WebApplication",
        name: "Ramadan Countdown",
        description: seo.description,
        applicationCategory: "EducationalApplication",
        operatingSystem: "All",
        url: canonical,
        inLanguage: LOCALE_META[locale].htmlLang,
        author: { "@type": "Person", name: "Zakiyuddin Munziri" },
      }),
    });
  }
  scripts.push({
    type: "application/ld+json",
    children: JSON.stringify(faqJsonLd(seo.faqs)),
  });

  return {
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:url", content: canonical },
      { property: "og:locale", content: LOCALE_META[locale].ogLocale },
      { property: "og:image", content: image },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: imageAlt },
      { name: "twitter:title", content: seo.title },
      { name: "twitter:description", content: seo.description },
      { name: "twitter:image", content: image },
    ],
    links: [
      { rel: "canonical", href: canonical },
      ...alternateLinks(SITE_URL, page).map((alt) => ({
        rel: "alternate",
        // TanStack emits head-link keys verbatim; use the lowercase HTML name.
        hreflang: alt.hreflang,
        href: alt.href,
      })),
    ],
    scripts,
  };
}

// ---------------------------------------------------------------------------
// Structured data
// ---------------------------------------------------------------------------

export function faqJsonLd(faqs: Faq[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: { "@type": "Answer", text: faq.answer },
    })),
  };
}
