import Countdown from "@/app/(home)/countdown";
import { getNextRamadan } from "@/app/(home)/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const api = await getNextRamadan();

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
  const api = await getNextRamadan();

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

  return (
    <div className="relative flex flex-col items-center pt-20 md:pt-0 md:justify-center min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1a4a3e] via-[#0d2e26] to-[#051410] px-4 md:px-0 text-white overflow-hidden">
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px]" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 mb-8 text-center drop-shadow-sm tracking-tight font-serif">
          Ramadan Countdown
        </h1>

        <Countdown nextRamadan={api.ramadanStart} />

        <div className="mt-12 opacity-60 hover:opacity-100 transition-opacity duration-300">
          <p className="text-emerald-100/60 text-sm font-medium tracking-wide">
            API available{" "}
            <a
              href="/api/countdown?timezoneOffset=8"
              className="text-amber-200/80 hover:text-amber-100 underline decoration-amber-200/30 hover:decoration-amber-100 transition-colors"
            >
              here
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
