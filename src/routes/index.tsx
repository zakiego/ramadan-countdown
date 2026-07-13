import { HomeView } from "@/components/HomeView";
import { ramadanData } from "@/data/ramadan";
import { buildPageHead, getBuildDate, getHomeSeo } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

/**
 * English home page (the default locale, served at `/`). Other languages live
 * under `/$locale`. SEO copy is resolved from the build timestamp, so the
 * prerendered HTML carries a literal, current answer ("N days from today"). CI
 * rebuilds the site daily to keep it fresh, and the copy switches to "days
 * left" phrasing automatically while Ramadan is running.
 */
const buildDate = getBuildDate();
const seo = getHomeSeo(ramadanData, buildDate);

export const Route = createFileRoute("/")({
  head: () => buildPageHead("en", "home", seo),
  component: Home,
});

function Home() {
  return <HomeView seo={seo} now={buildDate} />;
}
