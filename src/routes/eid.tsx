import { EidView } from "@/components/EidView";
import { ramadanData } from "@/data/ramadan";
import { buildPageHead, getBuildDate, getEidSeo } from "@/utils/seo";
import { createFileRoute } from "@tanstack/react-router";

/** English Eid page (served at `/eid`); localized versions live at `/$locale/eid`. */
const buildDate = getBuildDate();
const seo = getEidSeo(ramadanData, buildDate);

export const Route = createFileRoute("/eid")({
  head: () => buildPageHead("en", "eid", seo),
  component: EidPage,
});

function EidPage() {
  return <EidView seo={seo} now={buildDate} />;
}
