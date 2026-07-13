import Countdown from "@/components/Countdown";
import { DatesTable } from "@/components/DatesTable";
import { FaqSection } from "@/components/FaqSection";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { SiteFooter } from "@/components/SiteFooter";
import { ramadanData } from "@/data/ramadan";
import { localeLinkProps } from "@/i18n/config";
import { useI18n } from "@/i18n/context";
import type { PageSeo } from "@/utils/seo";
import { Link } from "@tanstack/react-router";

/** Home page body, shared by the English `/` route and the `/$locale` routes. */
export function HomeView({ seo, now }: { seo: PageSeo; now: Date }) {
  const { ui, locale } = useI18n();
  return (
    <div className="relative flex flex-col items-center pb-10 md:pb-16 min-h-screen bg-radial-[ellipse_at_top] from-[#1a4a3e] via-[#0d2e26] to-[#051410] px-4 text-white overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-500/5 rounded-full blur-[120px] animate-float-delayed" />
      </div>

      <div className="z-10 flex flex-col items-center w-full max-w-4xl mx-auto animate-fade-in">
        {/* Hero keeps the original single-viewport centering on desktop */}
        <div className="flex flex-col items-center w-full pt-20 pb-4 md:pt-0 md:pb-0 md:justify-center md:min-h-screen">
          <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-100 via-yellow-50 to-amber-100 mb-8 text-center drop-shadow-sm tracking-tight font-serif animate-slide-up">
            {seo.h1}
          </h1>

          <Countdown ramadans={ramadanData} />

          <p className="mt-8 max-w-2xl text-center text-base md:text-lg text-emerald-100/80 leading-relaxed">
            {seo.answer}
          </p>
        </div>

        <FaqSection faqs={seo.faqs} />

        <DatesTable ramadans={ramadanData} now={now} />

        <p className="relative z-10 mt-12 text-center text-sm md:text-base text-emerald-100/70">
          {ui.crossToEid.before}
          <Link
            {...localeLinkProps(locale, "eid")}
            className="text-amber-200 underline decoration-amber-200/40 underline-offset-4 hover:text-amber-100 transition-colors"
          >
            {ui.crossToEid.link}
          </Link>
          {ui.crossToEid.after}
        </p>

        <LocaleSwitcher page="home" />

        <SiteFooter page="home" />
      </div>
    </div>
  );
}
