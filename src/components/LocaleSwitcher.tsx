import {
  LOCALES,
  LOCALE_META,
  type PageKey,
  localeLinkProps,
} from "@/i18n/config";
import { useI18n } from "@/i18n/context";
import { Link } from "@tanstack/react-router";

/**
 * Row of links to the same page in every supported language. Each link carries
 * `hreflang` so it doubles as a crawler signal, and points at the equivalent
 * page (home or Eid) in the target locale.
 */
export function LocaleSwitcher({ page }: { page: PageKey }) {
  const { locale: active, ui } = useI18n();

  return (
    <nav
      aria-label={ui.languageLabel}
      className="relative z-10 mt-12 flex flex-wrap items-center justify-center gap-2"
    >
      {LOCALES.map((locale) => {
        const isActive = locale === active;
        return (
          <Link
            key={locale}
            {...localeLinkProps(locale, page)}
            hrefLang={LOCALE_META[locale].htmlLang}
            lang={LOCALE_META[locale].htmlLang}
            aria-current={isActive ? "true" : undefined}
            className={
              isActive
                ? "rounded-full border border-amber-300/40 bg-amber-400/10 px-3 py-1.5 text-xs font-medium text-amber-100"
                : "rounded-full border border-emerald-500/10 bg-emerald-900/20 px-3 py-1.5 text-xs font-medium text-emerald-100/70 transition-colors hover:border-amber-300/30 hover:text-amber-100"
            }
          >
            {LOCALE_META[locale].nativeName}
          </Link>
        );
      })}
    </nav>
  );
}
