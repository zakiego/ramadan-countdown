import type { RamadanData } from "@/data/ramadan";
import { daysBetweenUtc } from "@/utils/date";
import type { Faq, Messages } from "./types";

// English is the reference locale. Its copy must match the strings asserted in
// src/utils/seo.test.ts verbatim.

const hijri = (h: string): string => h.replace(/H$/, " AH");
const daysWord = (n: number): string => (n === 1 ? "day" : "days");

const totalRamadanDays = (r: RamadanData): number =>
  daysBetweenUtc(r.ramadanStart, r.ramadanEnd) + 1;

function howLongFaq(target: RamadanData, fmtShort: (d: Date) => string): Faq {
  return {
    question: "How long does Ramadan last?",
    answer: `Ramadan lasts 29 or 30 days, one full lunar month. Ramadan ${hijri(
      target.hijriYear,
    )} (${target.year}) is expected to run for ${totalRamadanDays(
      target,
    )} days, from ${fmtShort(target.ramadanStart)} to ${fmtShort(
      target.ramadanEnd,
    )}.`,
  };
}

function whenIsEidFaq(target: RamadanData, fmtFull: (d: Date) => string): Faq {
  return {
    question: `When is Eid al-Fitr ${target.year}?`,
    answer: `Eid al-Fitr ${
      target.year
    }, the festival marking the end of Ramadan, is expected on ${fmtFull(
      target.eidAlFitr,
    )} (1 Shawwal ${hijri(target.hijriYear)}).`,
  };
}

const WHAT_IS_RAMADAN_FAQ: Faq = {
  question: "What is Ramadan?",
  answer:
    "Ramadan (also spelled Ramzan, Ramadhan, or Ramazan) is the ninth month of the Islamic calendar, when Muslims around the world fast from dawn to sunset, give charity, and increase prayer and Quran recitation. It ends with the Eid al-Fitr celebration.",
};

const WHAT_IS_EID_FAQ: Faq = {
  question: "What is Eid al-Fitr?",
  answer:
    "Eid al-Fitr (also written Eid ul-Fitr) is the festival of breaking the fast, celebrated on 1 Shawwal, the day after Ramadan ends. Muslims mark it with the Eid prayer, zakat al-fitr charity, festive meals, and visits to family and friends.",
};

const EID_VS_ADHA_FAQ: Faq = {
  question: "Is Eid al-Fitr the same as Eid al-Adha?",
  answer:
    "No. Eid al-Fitr comes right after Ramadan, while Eid al-Adha falls about 70 days later, on 10 Dhul-Hijjah during the Hajj season. This page counts down to Eid al-Fitr.",
};

function weeksAnswer(year: number, days: number): string {
  const weeks = Math.floor(days / 7);
  if (weeks < 1) {
    return `Less than a week is left until Ramadan ${year}: just ${days} ${daysWord(
      days,
    )} to go.`;
  }
  return `About ${weeks} ${weeks === 1 ? "week" : "weeks"} (${days} ${daysWord(
    days,
  )}) are left until Ramadan ${year}.`;
}

function monthsAnswer(year: number, days: number, startShort: string): string {
  const months = Math.round(days / 30.44);
  if (months < 1) {
    return `Less than a month is left until Ramadan ${year}: just ${days} ${daysWord(
      days,
    )}.`;
  }
  const label = months === 1 ? "about 1 month" : `about ${months} months`;
  return `There ${months === 1 ? "is" : "are"} ${label} (${days} ${daysWord(
    days,
  )}) left until Ramadan ${year}, which is expected to begin on ${startShort}.`;
}

export const en: Messages = {
  home: {
    pre({ target, daysUntil, eveOfStart, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      return {
        title: `How Many Days Until Ramadan ${year}? Live Countdown`,
        description: `Ramadan ${year} is expected to begin on ${fmt.short(
          target.ramadanStart,
        )}, ${daysUntil} ${daysWord(
          daysUntil,
        )} from today. Live countdown of the days, weeks, and months left.`,
        h1: `Ramadan Countdown ${year}`,
        answer: `Ramadan ${year} is expected to begin on ${fmt.full(
          target.ramadanStart,
        )}, inshaAllah. That is ${daysUntil} ${daysWord(
          daysUntil,
        )} from today.`,
        faqs: [
          {
            question: `How many days until Ramadan ${year}?`,
            answer: `There are ${daysUntil} ${daysWord(
              daysUntil,
            )} until Ramadan ${year}. The first day of fasting is expected to be ${fmt.full(
              target.ramadanStart,
            )} (1 Ramadan ${h}), depending on the sighting of the crescent moon.`,
          },
          {
            question: `When does Ramadan ${year} start?`,
            answer: `Ramadan ${year} is expected to begin at sunset on ${fmt.full(
              eveOfStart,
            )}, with the first full day of fasting on ${fmt.full(
              target.ramadanStart,
            )}. The exact date depends on the moon sighting in your country.`,
          },
          {
            question: `How many weeks until Ramadan ${year}?`,
            answer: weeksAnswer(year, daysUntil),
          },
          {
            question: `How many months until Ramadan ${year}?`,
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
        title: `How Many Days Left in Ramadan ${year}? Day ${dayOf} of ${totalDays}`,
        description: `Today is day ${dayOf} of ${totalDays} of Ramadan ${year}. ${daysUntilEid} ${daysWord(
          daysUntilEid,
        )} left until Eid al-Fitr, expected on ${fmt.short(
          target.eidAlFitr,
        )}. Follow the live day tracker.`,
        h1: `Ramadan ${year}`,
        answer: `Today is day ${dayOf} of ${totalDays} of Ramadan ${h} (${year}). ${daysUntilEid} ${daysWord(
          daysUntilEid,
        )} ${
          daysUntilEid === 1 ? "is" : "are"
        } left until Eid al-Fitr, expected on ${fmt.full(
          target.eidAlFitr,
        )}, inshaAllah.`,
        faqs: [
          {
            question: `How many days are left in Ramadan ${year}?`,
            answer: `Today is day ${dayOf} of ${totalDays} of Ramadan ${h}. There ${
              daysUntilEid === 1 ? "is" : "are"
            } ${daysUntilEid} ${daysWord(
              daysUntilEid,
            )} left until Eid al-Fitr, expected on ${fmt.full(
              target.eidAlFitr,
            )}.`,
          },
          {
            question: `When does Ramadan ${year} end?`,
            answer: `The last day of fasting is expected to be ${fmt.full(
              target.ramadanEnd,
            )}, with Eid al-Fitr on ${fmt.full(
              target.eidAlFitr,
            )}, depending on the moon sighting.`,
          },
          {
            question: `When did Ramadan ${year} start?`,
            answer: `Ramadan ${h} began on ${fmt.full(
              target.ramadanStart,
            )} (1 Ramadan).`,
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
          question: `When is Eid al-Fitr ${year}?`,
          answer: `Eid al-Fitr ${year} falls on ${fmt.full(
            target.eidAlFitr,
          )} (1 Shawwal ${h}), marking the end of Ramadan.`,
        },
      ];
      if (next) {
        faqs.push({
          question: `When is Ramadan ${next.year}?`,
          answer: `Ramadan ${next.year} (1 Ramadan ${hijri(
            next.hijriYear,
          )}) is expected to begin on ${fmt.full(next.ramadanStart)}.`,
        });
      }
      faqs.push(howLongFaq(target, fmt.short), WHAT_IS_RAMADAN_FAQ);
      return {
        title: `Eid Mubarak! Eid al-Fitr ${year} Has Arrived`,
        description: `Today is Eid al-Fitr, 1 Shawwal ${h}, marking the end of Ramadan ${year}. Taqabbalallahu minna wa minkum, Eid Mubarak!`,
        h1: `Eid al-Fitr ${year}`,
        answer: `Today, ${fmt.full(
          target.eidAlFitr,
        )}, is Eid al-Fitr (1 Shawwal ${h}), the celebration marking the end of Ramadan ${year}. Eid Mubarak!`,
        faqs,
      };
    },
  },
  eidPage: {
    pre({ target, daysUntil, ramadanStarted, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      return {
        title: `How Many Days Until Eid al-Fitr ${year}? Countdown`,
        description: `Eid al-Fitr ${year} is expected on ${fmt.short(
          target.eidAlFitr,
        )}, ${daysUntil} ${daysWord(
          daysUntil,
        )} from today. Live countdown to Eid ul-Fitr in days, hours, minutes, and seconds.`,
        h1: `Eid al-Fitr Countdown ${year}`,
        answer: `Eid al-Fitr ${year} is expected on ${fmt.full(
          target.eidAlFitr,
        )} (1 Shawwal ${h}), inshaAllah. That is ${daysUntil} ${daysWord(
          daysUntil,
        )} from today.`,
        faqs: [
          {
            question: `How many days until Eid al-Fitr ${year}?`,
            answer: `There are ${daysUntil} ${daysWord(
              daysUntil,
            )} until Eid al-Fitr ${year}, expected on ${fmt.full(
              target.eidAlFitr,
            )}, depending on the moon sighting.`,
          },
          {
            question: `When is Eid al-Fitr ${year}?`,
            answer: `Eid al-Fitr ${year} (1 Shawwal ${h}) is expected on ${fmt.full(
              target.eidAlFitr,
            )}. It marks the end of Ramadan, which ${
              ramadanStarted ? "began" : "is expected to begin"
            } on ${fmt.short(target.ramadanStart)}.`,
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
          question: "When is the next Eid al-Fitr?",
          answer: `The next Eid al-Fitr (${
            next.year
          }) is expected on ${fmt.full(next.eidAlFitr)} (1 Shawwal ${hijri(
            next.hijriYear,
          )}).`,
        });
      }
      return {
        title: `Eid Mubarak! Eid al-Fitr ${year} Is Here`,
        description: `Eid al-Fitr ${year} (1 Shawwal ${h}) has arrived. Taqabbalallahu minna wa minkum, Eid Mubarak!`,
        h1: `Eid al-Fitr ${year}`,
        answer: `Eid Mubarak! Eid al-Fitr ${year} (1 Shawwal ${h}) began on ${fmt.full(
          target.eidAlFitr,
        )}. Taqabbalallahu minna wa minkum.`,
        faqs,
      };
    },
  },
  ui: {
    days: "Days",
    hours: "Hours",
    minutes: "Minutes",
    seconds: "Seconds",
    ramadanComingOn: (hijriYear) => ({
      before: `Ramadan ${hijriYear} will, inshaAllah, be coming on `,
      after: "",
    }),
    eidCelebratedOn: (hijriYear) => ({
      before: `Eid al-Fitr ${hijriYear} will, inshaAllah, be celebrated on `,
      after: "",
    }),
    ramadanLabel: (hijriYear) => `Ramadan ${hijriYear}`,
    dayOfRamadan: "Day of Ramadan",
    lailatulQadrPeriod: "Lailatul Qadr Period",
    nightOfDecreeQuote:
      '"The Night of Decree is better than a thousand months"',
    eidMubarak: "Eid Mubarak!",
    shawwal: (hijriYear) => `1 Shawwal ${hijriYear}`,
    taqabbal: "Taqabbalallahu minna wa minkum",
    datesTableHeading: "Ramadan dates by year",
    colYear: "Year",
    colFirstDay: "First day of fasting",
    colEid: "Eid al-Fitr",
    colHijri: "Hijri year",
    datesTableNote:
      "Dates follow the Umm al-Qura astronomical calendar and can shift by a day with the official moon sighting in your country.",
    datesTable2030Note:
      "2030 is a rare double year: a second Ramadan (1452 AH) is expected to begin around December 26, 2030.",
    faqHeading: "Frequently asked questions",
    crossToEid: {
      before: "Waiting for the celebration instead? Track the ",
      link: "Eid al-Fitr countdown",
      after: ".",
    },
    crossToRamadan: {
      before: "Counting down to the holy month itself? See the ",
      link: "Ramadan countdown",
      after: ".",
    },
    footerEidCountdown: "Eid Countdown",
    footerRamadanCountdown: "Ramadan Countdown",
    footerApi: "API",
    footerBuiltBy: "Built by zakiego.com",
    notFoundMessage: "This page could not be found.",
    notFoundBack: "Back to the countdown",
    languageLabel: "Language",
  },
};
