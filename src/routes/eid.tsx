import { DatesTable } from "@/components/DatesTable";
import EidCountdown from "@/components/EidCountdown";
import { FaqSection } from "@/components/FaqSection";
import { SiteFooter } from "@/components/SiteFooter";
import { ramadanData } from "@/data/ramadan";
import { SITE_URL, faqJsonLd, getBuildDate, getEidSeo } from "@/utils/seo";
import { Link, createFileRoute } from "@tanstack/react-router";

const PAGE_URL = `${SITE_URL}/eid`;

/** Same build-time SEO approach as the home page; see index.tsx. */
const buildDate = getBuildDate();
const seo = getEidSeo(ramadanData, buildDate);

export const Route = createFileRoute("/eid")({
  head: () => ({
    meta: [
      { title: seo.title },
      { name: "description", content: seo.description },
      { property: "og:title", content: seo.title },
      { property: "og:description", content: seo.description },
      { property: "og:url", content: PAGE_URL },
      { property: "og:image", content: `${SITE_URL}/og-eid.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:alt", content: "Eid al-Fitr Countdown" },
      { name: "twitter:title", content: seo.title },
      { name: "twitter:description", content: seo.description },
      { name: "twitter:image", content: `${SITE_URL}/og-eid.png` },
    ],
    links: [{ rel: "canonical", href: PAGE_URL }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(faqJsonLd(seo.faqs)),
      },
    ],
  }),
  component: EidPage,
});

function EidPage() {
  return (
    <div className="relative flex flex-col items-center pb-10 md:pb-16 min-h-screen bg-radial-[ellipse_at_top] from-[#1a4a3e] via-[#0d2e26] to-[#051410] px-4 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-amber-500/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-float-delayed" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in">
        {/* Hero keeps the single-viewport centering on desktop */}
        <div className="flex flex-col items-center w-full pt-20 pb-4 md:pt-0 md:pb-0 md:justify-center md:min-h-screen">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 mb-8 text-center drop-shadow-sm tracking-tight font-serif animate-slide-up">
            {seo.h1}
          </h1>

          <EidCountdown ramadans={ramadanData} />

          <p className="mt-8 max-w-2xl text-center text-base md:text-lg text-emerald-100/80 leading-relaxed">
            {seo.answer}
          </p>
        </div>

        <FaqSection faqs={seo.faqs} />

        <DatesTable ramadans={ramadanData} now={buildDate} />

        <p className="relative z-10 mt-12 text-center text-sm md:text-base text-emerald-100/70">
          Counting down to the holy month itself? See the{" "}
          <Link
            to="/"
            className="text-amber-200 underline decoration-amber-200/40 underline-offset-4 hover:text-amber-100 transition-colors"
          >
            Ramadan countdown
          </Link>
          .
        </p>

        <SiteFooter internalLink={{ to: "/", label: "Ramadan Countdown" }} />
      </div>
    </div>
  );
}
