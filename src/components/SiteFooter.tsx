import { type PageKey, localeLinkProps } from "@/i18n/config";
import { useI18n } from "@/i18n/context";
import { Link } from "@tanstack/react-router";

/**
 * Shared footer. Cross-links to the other page (in the active locale), which
 * also gives crawlers a plain HTML path between them.
 */
export function SiteFooter({ page }: { page: PageKey }) {
  const { ui, locale } = useI18n();
  const otherPage: PageKey = page === "eid" ? "home" : "eid";
  const otherLabel =
    otherPage === "eid" ? ui.footerEidCountdown : ui.footerRamadanCountdown;

  return (
    <div className="mt-16 flex flex-col md:flex-row items-center gap-4 md:gap-6 opacity-40 hover:opacity-100 transition-opacity duration-200 text-[10px] tracking-[0.2em] uppercase font-medium text-center">
      <Link
        {...localeLinkProps(locale, otherPage)}
        className="hover:text-amber-200 transition-colors"
      >
        {otherLabel}
      </Link>

      <span className="hidden md:block text-emerald-100/20">/</span>

      <a
        href="https://x.com/ramadancountdn"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-amber-200 transition-colors"
      >
        Twitter @ramadancountdn
      </a>

      <span className="hidden md:block text-emerald-100/20">/</span>

      <a
        href="/api/countdown?timezoneOffset=8"
        className="hover:text-amber-200 transition-colors"
      >
        {ui.footerApi}
      </a>

      <span className="hidden md:block text-emerald-100/20">/</span>

      <a
        href="https://zakiego.com?utm_source=ramadan-countdown&utm_medium=footer&utm_campaign=ramadan_2025"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-amber-200 transition-colors"
      >
        {ui.footerBuiltBy}
      </a>
    </div>
  );
}
