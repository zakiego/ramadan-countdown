/**
 * i18n configuration: the set of supported locales and their metadata.
 *
 * English is the default and lives at the root paths (`/`, `/eid`) so the
 * site's existing URLs and SEO are preserved. Every other locale is served
 * under a path prefix (`/es`, `/ar/eid`, ...). Adding a language is a single
 * entry here plus its message file in `messages/`.
 */

export const DEFAULT_LOCALE = "en" as const;

/** All locales, in the order we surface them in the language switcher. */
export const LOCALES = ["en", "ar", "es", "hi", "zh"] as const;

export type Locale = (typeof LOCALES)[number];

/** Locales that carry a URL prefix (everything except the default). */
export const PREFIXED_LOCALES = LOCALES.filter(
  (l): l is Exclude<Locale, typeof DEFAULT_LOCALE> => l !== DEFAULT_LOCALE,
);

export interface LocaleMeta {
  /** Value for the `<html lang>` attribute. */
  htmlLang: string;
  /** Text direction for the `<html dir>` attribute. */
  dir: "ltr" | "rtl";
  /** BCP-47 tag passed to Intl for date formatting. */
  dateLocale: string;
  /** Open Graph locale (`og:locale`). */
  ogLocale: string;
  /** Endonym shown in the language switcher. */
  nativeName: string;
}

export const LOCALE_META: Record<Locale, LocaleMeta> = {
  en: {
    htmlLang: "en",
    dir: "ltr",
    dateLocale: "en-US",
    ogLocale: "en_US",
    nativeName: "English",
  },
  ar: {
    htmlLang: "ar",
    dir: "rtl",
    dateLocale: "ar",
    ogLocale: "ar_AR",
    nativeName: "العربية",
  },
  es: {
    htmlLang: "es",
    dir: "ltr",
    dateLocale: "es-ES",
    ogLocale: "es_ES",
    nativeName: "Español",
  },
  hi: {
    htmlLang: "hi",
    dir: "ltr",
    dateLocale: "hi-IN",
    ogLocale: "hi_IN",
    nativeName: "हिन्दी",
  },
  zh: {
    htmlLang: "zh-Hans",
    dir: "ltr",
    dateLocale: "zh-CN",
    ogLocale: "zh_CN",
    nativeName: "中文",
  },
};

export function isLocale(value: string): value is Locale {
  return (LOCALES as readonly string[]).includes(value);
}

/**
 * Derive the active locale from a pathname. `/es`, `/es/eid`, `/ar` map to
 * their locale; everything else (including `/` and `/eid`) is the default.
 */
export function localeFromPathname(pathname: string): Locale {
  const first = pathname.split("/").filter(Boolean)[0];
  if (first && isLocale(first) && first !== DEFAULT_LOCALE) {
    return first;
  }
  return DEFAULT_LOCALE;
}

export type PageKey = "home" | "eid";

/** The prefixed path for a page in a locale, e.g. ("es","eid") -> "/es/eid". */
export function localePath(locale: Locale, page: PageKey): string {
  const suffix = page === "eid" ? "/eid" : "";
  if (locale === DEFAULT_LOCALE) {
    return suffix === "" ? "/" : suffix;
  }
  return `/${locale}${suffix}`;
}

/**
 * `<Link>` props for a page in a locale. Keeps navigation type-safe: default
 * locale uses the root routes, others use the `$locale` param routes.
 */
export function localeLinkProps(locale: Locale, page: PageKey) {
  if (locale === DEFAULT_LOCALE) {
    return page === "eid" ? ({ to: "/eid" } as const) : ({ to: "/" } as const);
  }
  return page === "eid"
    ? ({ to: "/$locale/eid", params: { locale } } as const)
    : ({ to: "/$locale", params: { locale } } as const);
}

/**
 * hreflang alternates for a page across every locale, plus x-default (English).
 * Absolute URLs, as required by search engines.
 */
export function alternateLinks(
  siteUrl: string,
  page: PageKey,
): Array<{ hreflang: string; href: string }> {
  const links = LOCALES.map((locale) => ({
    hreflang: LOCALE_META[locale].htmlLang,
    href: `${siteUrl}${localePath(locale, page)}`.replace(/\/$/, "") || siteUrl,
  }));
  links.push({
    hreflang: "x-default",
    href:
      `${siteUrl}${localePath(DEFAULT_LOCALE, page)}`.replace(/\/$/, "") ||
      siteUrl,
  });
  return links;
}
