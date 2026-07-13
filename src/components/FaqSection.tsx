import { useI18n } from "@/i18n/context";
import type { Faq } from "@/utils/seo";

/**
 * Server-rendered FAQ. The question-form headings mirror the highest-volume
 * search queries ("how many days until ramadan", "how many weeks/months
 * left"), so the literal answers must exist in the prerendered HTML.
 */
export function FaqSection({ faqs }: { faqs: Faq[] }) {
  const { ui } = useI18n();
  return (
    <section
      id="faq"
      className="relative z-10 w-full max-w-2xl mx-auto mt-20 md:mt-24"
    >
      <h2 className="text-2xl md:text-3xl font-bold font-serif text-amber-100 text-center mb-10">
        {ui.faqHeading}
      </h2>
      <div className="space-y-8">
        {faqs.map((faq) => (
          <div key={faq.question}>
            <h3 className="text-lg md:text-xl font-semibold font-serif text-amber-100/90 mb-2">
              {faq.question}
            </h3>
            <p className="text-sm md:text-base text-emerald-100/70 leading-relaxed">
              {faq.answer}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
