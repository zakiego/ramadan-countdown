import { Link } from "@tanstack/react-router";

/**
 * Shared footer. `internalLink` cross-links the two pages, which also gives
 * crawlers a plain HTML path between them.
 */
export function SiteFooter({
  internalLink,
}: {
  internalLink: { to: "/" | "/eid"; label: string };
}) {
  return (
    <div className="mt-16 flex flex-col md:flex-row items-center gap-4 md:gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500 text-[10px] tracking-[0.2em] uppercase font-medium text-center">
      <Link
        to={internalLink.to}
        className="hover:text-amber-200 transition-colors"
      >
        {internalLink.label}
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
        API
      </a>

      <span className="hidden md:block text-emerald-100/20">/</span>

      <a
        href="https://zakiego.com?utm_source=ramadan-countdown&utm_medium=footer&utm_campaign=ramadan_2025"
        target="_blank"
        rel="noopener noreferrer"
        className="hover:text-amber-200 transition-colors"
      >
        Built by zakiego.com
      </a>
    </div>
  );
}
