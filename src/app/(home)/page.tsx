import Countdown from "@/app/(home)/countdown";
import { getFutureRamadans } from "@/app/(home)/utils";
import { ramadanData } from "@/data/ramadan";

export async function generateMetadata() {
  const futureRamadans = getFutureRamadans();
  // Use first future Ramadan for SEO, fallback to last known Ramadan
  const api = futureRamadans[0] ?? ramadanData[ramadanData.length - 1];

  const title = `Ramadan Countdown ${api.year}`;
  const description = `Count down to Ramadan ${api.year}. Find out exactly how many days, hours, minutes, and seconds are left until the holy month begins.`;

  return {
    title: {
      absolute: title,
    },
    description,
    openGraph: {
      title,
      description,
      images: [
        {
          url: "/icon.png",
          width: 512,
          height: 512,
          alt: "Ramadan Countdown",
        },
      ],
    },
    twitter: {
      title,
      description,
      images: ["/icon.png"],
    },
  };
}

export default async function Page() {
  const futureRamadans = getFutureRamadans();
  // Use first future Ramadan for SEO, fallback to last known Ramadan
  const api = futureRamadans[0] ?? ramadanData[ramadanData.length - 1];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: `Ramadan Countdown ${api.year}`,
    description: `Count down to Ramadan ${api.year}. Find out exactly how many days, hours, minutes, and seconds are left until the holy month begins.`,
    applicationCategory: "EducationalApplication",
    operatingSystem: "All",
    url: "https://ramadan.zakiego.com",
    author: {
      "@type": "Person",
      name: "Zakiyuddin Munziri",
    },
  };

  // Serialize dates for client component
  const ramadansForClient = ramadanData.map((r) => ({
    year: r.year,
    hijriYear: r.hijriYear,
    ramadanStart: r.ramadanStart.toISOString(),
    ramadanEnd: r.ramadanEnd.toISOString(),
    eidAlFitr: r.eidAlFitr.toISOString(),
  }));

  return (
    <div className="relative flex flex-col items-center pt-20 pb-10 md:pt-0 md:pb-0 md:justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a4a3e] via-[#0d2e26] to-[#051410] px-4 md:px-0 text-white overflow-hidden">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px] animate-float-delayed" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 mb-8 text-center drop-shadow-sm tracking-tight font-serif animate-slide-up">
          Ramadan Countdown
        </h1>

        <Countdown ramadans={ramadansForClient} />

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
