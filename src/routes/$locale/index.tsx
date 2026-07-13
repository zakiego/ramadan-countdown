import { HomeView } from "@/components/HomeView";
import { ramadanData } from "@/data/ramadan";
import { DEFAULT_LOCALE, type Locale, isLocale } from "@/i18n/config";
import { buildPageHead, getBuildDate, getHomeSeo } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

const buildDate = getBuildDate();

/** The parent layout has already validated the param; this narrows the type. */
function resolveLocale(raw: string): Locale {
  return isLocale(raw) ? raw : DEFAULT_LOCALE;
}

export const Route = createFileRoute("/$locale/")({
  head: ({ params }) => {
    const locale = resolveLocale(params.locale);
    return buildPageHead(
      locale,
      "home",
      getHomeSeo(ramadanData, buildDate, locale),
    );
  },
  component: LocalizedHome,
});

function LocalizedHome() {
  const locale = resolveLocale(Route.useParams().locale);
  return (
    <HomeView
      seo={getHomeSeo(ramadanData, buildDate, locale)}
      now={buildDate}
    />
  );
}
