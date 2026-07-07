import Countdown from "@/components/Countdown";
import { ramadanData } from "@/data/ramadan";
import { getFutureRamadans } from "@/utils/ramadan";
import { createFileRoute } from "@tanstack/react-router";

const SITE_URL = "https://ramadan.zakiego.com";

/**
 * The Ramadan used for SEO copy: the first one that hasn't ended yet,
 * falling back to the last known entry. Evaluated at prerender (build)
 * time, so redeploy after each Eid / when adding a new year.
 */
function getSeoRamadan() {
  const futureRamadans = getFutureRamadans();
  return futureRamadans[0] ?? ramadanData[ramadanData.length - 1];
}

export const Route = createFileRoute("/")({
  head: () => {
    const seoRamadan = getSeoRamadan();
    const title = `Ramadan Countdown ${seoRamadan.year}`;
    const description = `Count down to Ramadan ${seoRamadan.year}. Find out exactly how many days, hours, minutes, and seconds are left until the holy month begins.`;

    const jsonLd = {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: title,
      description,
      applicationCategory: "EducationalApplication",
      operatingSystem: "All",
      url: SITE_URL,
      author: {
        "@type": "Person",
        name: "Zakiyuddin Munziri",
      },
    };

    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:image", content: `${SITE_URL}/icon.png` },
        { name: "twitter:title", content: title },
        { name: "twitter:description", content: description },
        { name: "twitter:image", content: `${SITE_URL}/icon.png` },
      ],
      scripts: [
        {
          type: "application/ld+json",
          children: JSON.stringify(jsonLd),
        },
      ],
    };
  },
  component: Home,
});

function Home() {
  return (
    <div className="relative flex flex-col items-center pt-20 pb-10 md:pt-0 md:pb-0 md:justify-center min-h-screen bg-radial-[ellipse_at_top] from-[#1a4a3e] via-[#0d2e26] to-[#051410] px-4 md:px-0 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px] animate-float-delayed" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 mb-8 text-center drop-shadow-sm tracking-tight font-serif animate-slide-up">
          Ramadan Countdown
        </h1>

        <Countdown ramadans={ramadanData} />

        <div className="mt-16 flex flex-col md:flex-row items-center gap-4 md:gap-6 opacity-40 hover:opacity-100 transition-opacity duration-500 text-[10px] tracking-[0.2em] uppercase font-medium text-center">
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
      </div>
    </div>
  );
}
