import { EidView } from "@/components/EidView";
import { ramadanData } from "@/data/ramadan";
import { DEFAULT_LOCALE, type Locale, isLocale } from "@/i18n/config";
import { buildPageHead, getBuildDate, getEidSeo } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

const buildDate = getBuildDate();

function resolveLocale(raw: string): Locale {
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

export const Route = createFileRoute("/$locale/eid")({
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return buildPageHead(
      locale,
      "eid",
      getEidSeo(ramadanData, buildDate, locale),
    );
  },
  component: LocalizedEid,
});

function LocalizedEid() {
  const locale = resolveLocale(Route.useParams().locale);
  return (
    <EidView seo={getEidSeo(ramadanData, buildDate, locale)} now={buildDate} />
  );
}
