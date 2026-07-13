import type { RamadanData } from "@/data/ramadan";
import { daysBetweenUtc } from "@/utils/date";
import type { Faq, Messages } from "./types";

// Arabic (RTL). Digits stay Latin (see makeDateFmt) so counts match the live
// countdown boxes. Counted nouns follow standard MSA number agreement.

const hijri = (h: string): string => h.replace(/H$/, " هـ");
const totalRamadanDays = (r: RamadanData): number =>
  daysBetweenUtc(r.ramadanStart, r.ramadanEnd) + 1;

/** "{n} days" with correct MSA form: يوم / يومان / أيام / يومًا. */
function daysPhrase(n: number): string {
  if (n === 1) return "يوم واحد";
  if (n === 2) return "يومان";
  if (n >= 3 && n <= 10) return `${n} أيام`;
  return `${n} يومًا`;
}

function weeksPhrase(n: number): string {
  if (n === 1) return "أسبوع واحد";
  if (n === 2) return "أسبوعان";
  if (n >= 3 && n <= 10) return `${n} أسابيع`;
  return `${n} أسبوعًا`;
}

function monthsPhrase(n: number): string {
  if (n === 1) return "شهر واحد";
  if (n === 2) return "شهران";
  if (n >= 3 && n <= 10) return `${n} أشهر`;
  return `${n} شهرًا`;
}

function howLongFaq(target: RamadanData, fmtShort: (d: Date) => string): Faq {
  return {
    question: "كم يستمر رمضان؟",
    answer: `يستمر رمضان 29 أو 30 يومًا، أي شهرًا قمريًا كاملًا. من المتوقع أن يستمر رمضان ${hijri(
      target.hijriYear,
    )} (${target.year}) ${daysPhrase(totalRamadanDays(target))}، من ${fmtShort(
      target.ramadanStart,
    )} إلى ${fmtShort(target.ramadanEnd)}.`,
  };
}

function whenIsEidFaq(target: RamadanData, fmtFull: (d: Date) => string): Faq {
  return {
    question: `متى عيد الفطر ${target.year}؟`,
    answer: `من المتوقع أن يكون عيد الفطر ${
      target.year
    }، العيد الذي يمثل نهاية رمضان، في ${fmtFull(
      target.eidAlFitr,
    )} (1 شوال ${hijri(target.hijriYear)}).`,
  };
}

const WHAT_IS_RAMADAN_FAQ: Faq = {
  question: "ما هو رمضان؟",
  answer:
    "رمضان هو الشهر التاسع في التقويم الهجري، حيث يصوم المسلمون حول العالم من الفجر حتى غروب الشمس، ويتصدقون، ويكثرون من الصلاة وتلاوة القرآن. وينتهي بعيد الفطر.",
};

const WHAT_IS_EID_FAQ: Faq = {
  question: "ما هو عيد الفطر؟",
  answer:
    "عيد الفطر هو عيد إفطار الصائمين، ويُحتفل به في 1 شوال، اليوم التالي لانتهاء رمضان. يحييه المسلمون بصلاة العيد وزكاة الفطر والولائم وزيارة الأهل والأصدقاء.",
};

const EID_VS_ADHA_FAQ: Faq = {
  question: "هل عيد الفطر هو نفسه عيد الأضحى؟",
  answer:
    "لا. يأتي عيد الفطر مباشرة بعد رمضان، بينما يأتي عيد الأضحى بعده بنحو 70 يومًا، في 10 ذي الحجة خلال موسم الحج. تعدّ هذه الصفحة تنازليًا حتى عيد الفطر.",
};

function weeksAnswer(year: number, days: number): string {
  const weeks = Math.floor(days / 7);
  if (weeks < 1) {
    return `باقٍ أقل من أسبوع حتى رمضان ${year}: ${daysPhrase(days)} فقط.`;
  }
  return `باقٍ نحو ${weeksPhrase(weeks)} (${daysPhrase(
    days,
  )}) حتى رمضان ${year}.`;
}

function monthsAnswer(year: number, days: number, startShort: string): string {
  const months = Math.round(days / 30.44);
  if (months < 1) {
    return `باقٍ أقل من شهر حتى رمضان ${year}: ${daysPhrase(days)} فقط.`;
  }
  return `باقٍ نحو ${monthsPhrase(months)} (${daysPhrase(
    days,
  )}) حتى رمضان ${year}، المتوقع أن يبدأ في ${startShort}.`;
}

export const ar: Messages = {
  home: {
    pre({ target, daysUntil, eveOfStart, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      return {
        title: `كم يومًا باقٍ حتى رمضان ${year}؟ العد التنازلي`,
        description: `يبدأ رمضان ${year} المتوقع في ${fmt.short(
          target.ramadanStart,
        )}، أي بعد ${daysPhrase(
          daysUntil,
        )} من اليوم. عد تنازلي مباشر للأيام والأسابيع والأشهر المتبقية.`,
        h1: `العد التنازلي لرمضان ${year}`,
        answer: `من المتوقع أن يبدأ رمضان ${year} في ${fmt.full(
          target.ramadanStart,
        )}، بإذن الله. أي بعد ${daysPhrase(daysUntil)} من اليوم.`,
        faqs: [
          {
            question: `كم يومًا باقٍ حتى رمضان ${year}؟`,
            answer: `باقٍ ${daysPhrase(
              daysUntil,
            )} حتى رمضان ${year}. من المتوقع أن يكون أول أيام الصيام في ${fmt.full(
              target.ramadanStart,
            )} (1 رمضان ${h})، حسب رؤية هلال رمضان.`,
          },
          {
            question: `متى يبدأ رمضان ${year}؟`,
            answer: `من المتوقع أن يبدأ رمضان ${year} عند غروب شمس ${fmt.full(
              eveOfStart,
            )}، على أن يكون أول يوم صيام كامل في ${fmt.full(
              target.ramadanStart,
            )}. يعتمد الموعد الدقيق على رؤية الهلال في بلدك.`,
          },
          {
            question: `كم أسبوعًا باقٍ حتى رمضان ${year}؟`,
            answer: weeksAnswer(year, daysUntil),
          },
          {
            question: `كم شهرًا باقٍ حتى رمضان ${year}؟`,
            answer: monthsAnswer(
              year,
              daysUntil,
              fmt.short(target.ramadanStart),
            ),
          },
          howLongFaq(target, fmt.short),
          whenIsEidFaq(target, fmt.full),
          WHAT_IS_RAMADAN_FAQ,
        ],
      };
    },
    during({ target, dayOf, totalDays, daysUntilEid, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      return {
        title: `كم يومًا باقٍ في رمضان ${year}؟ اليوم ${dayOf} من ${totalDays}`,
        description: `اليوم هو اليوم ${dayOf} من ${totalDays} من رمضان ${year}. باقٍ ${daysPhrase(
          daysUntilEid,
        )} حتى عيد الفطر، المتوقع في ${fmt.short(
          target.eidAlFitr,
        )}. تابع عدّاد الأيام المباشر.`,
        h1: `رمضان ${year}`,
        answer: `اليوم هو اليوم ${dayOf} من ${totalDays} من رمضان ${h} (${year}). باقٍ ${daysPhrase(
          daysUntilEid,
        )} حتى عيد الفطر، المتوقع في ${fmt.full(target.eidAlFitr)}، بإذن الله.`,
        faqs: [
          {
            question: `كم يومًا باقٍ في رمضان ${year}؟`,
            answer: `اليوم هو اليوم ${dayOf} من ${totalDays} من رمضان ${h}. باقٍ ${daysPhrase(
              daysUntilEid,
            )} حتى عيد الفطر، المتوقع في ${fmt.full(target.eidAlFitr)}.`,
          },
          {
            question: `متى ينتهي رمضان ${year}؟`,
            answer: `من المتوقع أن يكون آخر أيام الصيام في ${fmt.full(
              target.ramadanEnd,
            )}، وعيد الفطر في ${fmt.full(target.eidAlFitr)}، حسب رؤية الهلال.`,
          },
          {
            question: `متى بدأ رمضان ${year}؟`,
            answer: `بدأ رمضان ${h} في ${fmt.full(
              target.ramadanStart,
            )} (1 رمضان).`,
          },
          howLongFaq(target, fmt.short),
          whenIsEidFaq(target, fmt.full),
          WHAT_IS_RAMADAN_FAQ,
        ],
      };
    },
    eid({ target, next, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      const faqs: Faq[] = [
        {
          question: `متى عيد الفطر ${year}؟`,
          answer: `يوافق عيد الفطر ${year} يوم ${fmt.full(
            target.eidAlFitr,
          )} (1 شوال ${h})، ويمثل نهاية رمضان.`,
        },
      ];
      if (next) {
        faqs.push({
          question: `متى رمضان ${next.year}؟`,
          answer: `من المتوقع أن يبدأ رمضان ${next.year} (1 رمضان ${hijri(
            next.hijriYear,
          )}) في ${fmt.full(next.ramadanStart)}.`,
        });
      }
      faqs.push(howLongFaq(target, fmt.short), WHAT_IS_RAMADAN_FAQ);
      return {
        title: `عيد مبارك! حلّ عيد الفطر ${year}`,
        description: `اليوم هو عيد الفطر، 1 شوال ${h}، الذي يمثل نهاية رمضان ${year}. تقبل الله منا ومنكم، عيد مبارك!`,
        h1: `عيد الفطر ${year}`,
        answer: `اليوم، ${fmt.full(
          target.eidAlFitr,
        )}، هو عيد الفطر (1 شوال ${h})، الاحتفال الذي يمثل نهاية رمضان ${year}. عيد مبارك!`,
        faqs,
      };
    },
  },
  eidPage: {
    pre({ target, daysUntil, ramadanStarted, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      return {
        title: `كم يومًا باقٍ حتى عيد الفطر ${year}؟ العد التنازلي`,
        description: `من المتوقع أن يكون عيد الفطر ${year} في ${fmt.short(
          target.eidAlFitr,
        )}، أي بعد ${daysPhrase(
          daysUntil,
        )} من اليوم. عد تنازلي مباشر حتى عيد الفطر بالأيام والساعات والدقائق والثواني.`,
        h1: `العد التنازلي لعيد الفطر ${year}`,
        answer: `من المتوقع أن يكون عيد الفطر ${year} في ${fmt.full(
          target.eidAlFitr,
        )} (1 شوال ${h})، بإذن الله. أي بعد ${daysPhrase(daysUntil)} من اليوم.`,
        faqs: [
          {
            question: `كم يومًا باقٍ حتى عيد الفطر ${year}؟`,
            answer: `باقٍ ${daysPhrase(
              daysUntil,
            )} حتى عيد الفطر ${year}، المتوقع في ${fmt.full(
              target.eidAlFitr,
            )}، حسب رؤية الهلال.`,
          },
          {
            question: `متى عيد الفطر ${year}؟`,
            answer: `من المتوقع أن يكون عيد الفطر ${year} (1 شوال ${h}) في ${fmt.full(
              target.eidAlFitr,
            )}. وهو يمثل نهاية رمضان الذي ${
              ramadanStarted ? "بدأ" : "يُتوقع أن يبدأ"
            } في ${fmt.short(target.ramadanStart)}.`,
          },
          WHAT_IS_EID_FAQ,
          EID_VS_ADHA_FAQ,
        ],
      };
    },
    day({ target, next, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      const faqs: Faq[] = [WHAT_IS_EID_FAQ, EID_VS_ADHA_FAQ];
      if (next) {
        faqs.push({
          question: "متى عيد الفطر القادم؟",
          answer: `من المتوقع أن يكون عيد الفطر القادم (${
            next.year
          }) في ${fmt.full(next.eidAlFitr)} (1 شوال ${hijri(next.hijriYear)}).`,
        });
      }
      return {
        title: `عيد مبارك! حلّ عيد الفطر ${year}`,
        description: `حلّ عيد الفطر ${year} (1 شوال ${h}). تقبل الله منا ومنكم، عيد مبارك!`,
        h1: `عيد الفطر ${year}`,
        answer: `عيد مبارك! بدأ عيد الفطر ${year} (1 شوال ${h}) في ${fmt.full(
          target.eidAlFitr,
        )}. تقبل الله منا ومنكم.`,
        faqs,
      };
    },
  },
  ui: {
    days: "أيام",
    hours: "ساعات",
    minutes: "دقائق",
    seconds: "ثوانٍ",
    ramadanComingOn: (hijriYear) => ({
      before: `سيبدأ رمضان ${hijri(hijriYear)} بإذن الله في `,
      after: "",
    }),
    eidCelebratedOn: (hijriYear) => ({
      before: `سيُحتفل بعيد الفطر ${hijri(hijriYear)} بإذن الله في `,
      after: "",
    }),
    ramadanLabel: (hijriYear) => `رمضان ${hijri(hijriYear)}`,
    dayOfRamadan: "من أيام رمضان",
    lailatulQadrPeriod: "فترة ليلة القدر",
    nightOfDecreeQuote: "«ليلة القدر خير من ألف شهر»",
    eidMubarak: "عيد مبارك!",
    shawwal: (hijriYear) => `1 شوال ${hijri(hijriYear)}`,
    taqabbal: "تقبل الله منا ومنكم",
    datesTableHeading: "مواعيد رمضان حسب السنة",
    colYear: "السنة",
    colFirstDay: "أول أيام الصيام",
    colEid: "عيد الفطر",
    colHijri: "السنة الهجرية",
    datesTableNote:
      "تتبع المواعيد تقويم أم القرى الفلكي وقد تتغير بيوم واحد حسب رؤية الهلال الرسمية في بلدك.",
    datesTable2030Note:
      "عام 2030 سنة مزدوجة نادرة: يُتوقع أن يبدأ رمضان ثانٍ (1452 هـ) نحو 26 ديسمبر 2030.",
    faqHeading: "الأسئلة الشائعة",
    crossToEid: {
      before: "تنتظر الاحتفال بدلاً من ذلك؟ تابع ",
      link: "العد التنازلي لعيد الفطر",
      after: ".",
    },
    crossToRamadan: {
      before: "تعدّ الأيام حتى الشهر الفضيل نفسه؟ شاهد ",
      link: "العد التنازلي لرمضان",
      after: ".",
    },
    footerEidCountdown: "عدّاد عيد الفطر",
    footerRamadanCountdown: "عدّاد رمضان",
    footerApi: "API",
    footerBuiltBy: "من إنشاء zakiego.com",
    notFoundMessage: "تعذّر العثور على هذه الصفحة.",
    notFoundBack: "العودة إلى العد التنازلي",
    languageLabel: "اللغة",
  },
};
