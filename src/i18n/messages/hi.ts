import type { RamadanData } from "@/data/ramadan";
import { daysBetweenUtc } from "@/utils/date";
import type { Faq, Messages } from "./types";

// Hindi (Devanagari). "दिन" and "सप्ताह" don't inflect when counted; "महीना"
// does (महीना/महीने). Digits stay Latin for consistency with the countdown.

const hijri = (h: string): string => h.replace(/H$/, " हिजरी");
const monthsWord = (n: number): string => `${n} ${n === 1 ? "महीना" : "महीने"}`;
const totalRamadanDays = (r: RamadanData): number =>
  daysBetweenUtc(r.ramadanStart, r.ramadanEnd) + 1;

function howLongFaq(target: RamadanData, fmtShort: (d: Date) => string): Faq {
  return {
    question: "रमज़ान कितने दिन का होता है?",
    answer: `रमज़ान 29 या 30 दिन का होता है, यानी एक पूरा चंद्र महीना। रमज़ान ${hijri(
      target.hijriYear,
    )} (${target.year}) के ${totalRamadanDays(
      target,
    )} दिन चलने की उम्मीद है, ${fmtShort(target.ramadanStart)} से ${fmtShort(
      target.ramadanEnd,
    )} तक।`,
  };
}

function whenIsEidFaq(target: RamadanData, fmtFull: (d: Date) => string): Faq {
  return {
    question: `ईद अल-फ़ितर ${target.year} कब है?`,
    answer: `रमज़ान के अंत का त्योहार ईद अल-फ़ितर ${target.year} ${fmtFull(
      target.eidAlFitr,
    )} (1 शव्वाल ${hijri(target.hijriYear)}) को होने की उम्मीद है।`,
  };
}

const WHAT_IS_RAMADAN_FAQ: Faq = {
  question: "रमज़ान क्या है?",
  answer:
    "रमज़ान (जिसे रमजान या रमादान भी लिखा जाता है) इस्लामी कैलेंडर का नौवाँ महीना है, जब दुनिया भर के मुसलमान भोर से सूर्यास्त तक रोज़ा रखते हैं, दान करते हैं, और नमाज़ व क़ुरआन की तिलावत बढ़ाते हैं। यह ईद अल-फ़ितर के जश्न के साथ समाप्त होता है।",
};

const WHAT_IS_EID_FAQ: Faq = {
  question: "ईद अल-फ़ितर क्या है?",
  answer:
    "ईद अल-फ़ितर (जिसे ईद उल-फ़ितर भी लिखा जाता है) रोज़ा खोलने का त्योहार है, जो 1 शव्वाल को, रमज़ान ख़त्म होने के अगले दिन, मनाया जाता है। मुसलमान इसे ईद की नमाज़, ज़कात अल-फ़ितर, दावतों और परिवार व दोस्तों से मुलाक़ात के साथ मनाते हैं।",
};

const EID_VS_ADHA_FAQ: Faq = {
  question: "क्या ईद अल-फ़ितर और ईद अल-अज़हा एक ही हैं?",
  answer:
    "नहीं। ईद अल-फ़ितर रमज़ान के तुरंत बाद आती है, जबकि ईद अल-अज़हा लगभग 70 दिन बाद, हज के मौसम में 10 ज़ुल-हिज्जा को आती है। यह पेज ईद अल-फ़ितर की उलटी गिनती करता है।",
};

function weeksAnswer(year: number, days: number): string {
  const weeks = Math.floor(days / 7);
  if (weeks < 1) {
    return `रमज़ान ${year} आने में एक सप्ताह से भी कम बचा है: बस ${days} दिन बाकी हैं।`;
  }
  return `रमज़ान ${year} आने में लगभग ${weeks} सप्ताह (${days} दिन) बाकी हैं।`;
}

function monthsAnswer(year: number, days: number, startShort: string): string {
  const months = Math.round(days / 30.44);
  if (months < 1) {
    return `रमज़ान ${year} आने में एक महीने से भी कम बचा है: बस ${days} दिन।`;
  }
  return `रमज़ान ${year} आने में लगभग ${monthsWord(
    months,
  )} (${days} दिन) बाकी हैं, जो ${startShort} को शुरू होने की उम्मीद है।`;
}

export const hi: Messages = {
  home: {
    pre({ target, daysUntil, eveOfStart, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      return {
        title: `रमज़ान ${year} आने में कितने दिन बाकी हैं? लाइव उलटी गिनती`,
        description: `रमज़ान ${year} ${fmt.short(
          target.ramadanStart,
        )} को शुरू होने की उम्मीद है, आज से ${daysUntil} दिन बाद। बचे हुए दिनों, सप्ताहों और महीनों की लाइव उलटी गिनती।`,
        h1: `रमज़ान ${year} उलटी गिनती`,
        answer: `रमज़ान ${year} इंशाअल्लाह ${fmt.full(
          target.ramadanStart,
        )} को शुरू होने की उम्मीद है। यह आज से ${daysUntil} दिन बाद है।`,
        faqs: [
          {
            question: `रमज़ान ${year} आने में कितने दिन बाकी हैं?`,
            answer: `रमज़ान ${year} में ${daysUntil} दिन बाकी हैं। रोज़े का पहला दिन ${fmt.full(
              target.ramadanStart,
            )} (1 रमज़ान ${h}) होने की उम्मीद है, जो हिलाल (नए चाँद) के दिखने पर निर्भर करता है।`,
          },
          {
            question: `रमज़ान ${year} कब शुरू होता है?`,
            answer: `रमज़ान ${year} ${fmt.full(
              eveOfStart,
            )} की शाम को शुरू होने की उम्मीद है, और रोज़े का पहला पूरा दिन ${fmt.full(
              target.ramadanStart,
            )} को होगा। सटीक तारीख़ आपके देश में चाँद दिखने पर निर्भर करती है।`,
          },
          {
            question: `रमज़ान ${year} आने में कितने सप्ताह बाकी हैं?`,
            answer: weeksAnswer(year, daysUntil),
          },
          {
            question: `रमज़ान ${year} आने में कितने महीने बाकी हैं?`,
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
        title: `रमज़ान ${year} में कितने दिन बचे हैं? दिन ${dayOf}/${totalDays}`,
        description: `आज रमज़ान ${year} का ${dayOf}वाँ दिन है, कुल ${totalDays} में से। ईद अल-फ़ितर में ${daysUntilEid} दिन बाकी हैं, जो ${fmt.short(
          target.eidAlFitr,
        )} को होने की उम्मीद है। लाइव दिन ट्रैकर देखें।`,
        h1: `रमज़ान ${year}`,
        answer: `आज रमज़ान ${h} (${year}) का ${dayOf}वाँ दिन है, कुल ${totalDays} में से। ईद अल-फ़ितर में ${daysUntilEid} दिन बाकी हैं, जो इंशाअल्लाह ${fmt.full(
          target.eidAlFitr,
        )} को होगी।`,
        faqs: [
          {
            question: `रमज़ान ${year} में कितने दिन बचे हैं?`,
            answer: `आज रमज़ान ${h} का ${dayOf}वाँ दिन है, कुल ${totalDays} में से। ईद अल-फ़ितर में ${daysUntilEid} दिन बाकी हैं, जो ${fmt.full(
              target.eidAlFitr,
            )} को होने की उम्मीद है।`,
          },
          {
            question: `रमज़ान ${year} कब ख़त्म होता है?`,
            answer: `रोज़े का आख़िरी दिन ${fmt.full(
              target.ramadanEnd,
            )} होने की उम्मीद है, और ईद अल-फ़ितर ${fmt.full(
              target.eidAlFitr,
            )} को, जो चाँद दिखने पर निर्भर करता है।`,
          },
          {
            question: `रमज़ान ${year} कब शुरू हुआ?`,
            answer: `रमज़ान ${h} ${fmt.full(
              target.ramadanStart,
            )} (1 रमज़ान) को शुरू हुआ।`,
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
          question: `ईद अल-फ़ितर ${year} कब है?`,
          answer: `ईद अल-फ़ितर ${year} ${fmt.full(
            target.eidAlFitr,
          )} (1 शव्वाल ${h}) को है, जो रमज़ान के अंत का प्रतीक है।`,
        },
      ];
      if (next) {
        faqs.push({
          question: `रमज़ान ${next.year} कब है?`,
          answer: `रमज़ान ${next.year} (1 रमज़ान ${hijri(
            next.hijriYear,
          )}) ${fmt.full(next.ramadanStart)} को शुरू होने की उम्मीद है।`,
        });
      }
      faqs.push(howLongFaq(target, fmt.short), WHAT_IS_RAMADAN_FAQ);
      return {
        title: `ईद मुबारक! ईद अल-फ़ितर ${year} आ गई`,
        description: `आज ईद अल-फ़ितर है, 1 शव्वाल ${h}, जो रमज़ान ${year} के अंत का प्रतीक है। तक़ब्बलल्लाहु मिन्ना व मिन्कुम, ईद मुबारक!`,
        h1: `ईद अल-फ़ितर ${year}`,
        answer: `आज, ${fmt.full(
          target.eidAlFitr,
        )}, ईद अल-फ़ितर है (1 शव्वाल ${h}), वह जश्न जो रमज़ान ${year} के अंत का प्रतीक है। ईद मुबारक!`,
        faqs,
      };
    },
  },
  eidPage: {
    pre({ target, daysUntil, ramadanStarted, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      const startClause = ramadanStarted
        ? `${fmt.short(target.ramadanStart)} को शुरू हुआ`
        : `${fmt.short(target.ramadanStart)} को शुरू होने की उम्मीद है`;
      return {
        title: `ईद अल-फ़ितर ${year} आने में कितने दिन बाकी हैं? उलटी गिनती`,
        description: `ईद अल-फ़ितर ${year} ${fmt.short(
          target.eidAlFitr,
        )} को होने की उम्मीद है, आज से ${daysUntil} दिन बाद। दिन, घंटे, मिनट और सेकंड में ईद उल-फ़ितर की लाइव उलटी गिनती।`,
        h1: `ईद अल-फ़ितर ${year} उलटी गिनती`,
        answer: `ईद अल-फ़ितर ${year} इंशाअल्लाह ${fmt.full(
          target.eidAlFitr,
        )} (1 शव्वाल ${h}) को होने की उम्मीद है। यह आज से ${daysUntil} दिन बाद है।`,
        faqs: [
          {
            question: `ईद अल-फ़ितर ${year} आने में कितने दिन बाकी हैं?`,
            answer: `ईद अल-फ़ितर ${year} में ${daysUntil} दिन बाकी हैं, जो ${fmt.full(
              target.eidAlFitr,
            )} को होने की उम्मीद है, चाँद दिखने पर निर्भर।`,
          },
          {
            question: `ईद अल-फ़ितर ${year} कब है?`,
            answer: `ईद अल-फ़ितर ${year} (1 शव्वाल ${h}) ${fmt.full(
              target.eidAlFitr,
            )} को होने की उम्मीद है। यह रमज़ान के अंत का प्रतीक है, जो ${startClause}।`,
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
          question: "अगली ईद अल-फ़ितर कब है?",
          answer: `अगली ईद अल-फ़ितर (${next.year}) ${fmt.full(
            next.eidAlFitr,
          )} (1 शव्वाल ${hijri(next.hijriYear)}) को होने की उम्मीद है।`,
        });
      }
      return {
        title: `ईद मुबारक! ईद अल-फ़ितर ${year} यहाँ है`,
        description: `ईद अल-फ़ितर ${year} (1 शव्वाल ${h}) आ गई है। तक़ब्बलल्लाहु मिन्ना व मिन्कुम, ईद मुबारक!`,
        h1: `ईद अल-फ़ितर ${year}`,
        answer: `ईद मुबारक! ईद अल-फ़ितर ${year} (1 शव्वाल ${h}) ${fmt.full(
          target.eidAlFitr,
        )} को शुरू हुई। तक़ब्बलल्लाहु मिन्ना व मिन्कुम।`,
        faqs,
      };
    },
  },
  ui: {
    days: "दिन",
    hours: "घंटे",
    minutes: "मिनट",
    seconds: "सेकंड",
    ramadanComingOn: (hijriYear) => ({
      before: `रमज़ान ${hijri(hijriYear)} इंशाअल्लाह `,
      after: " को आएगा",
    }),
    eidCelebratedOn: (hijriYear) => ({
      before: `ईद अल-फ़ितर ${hijri(hijriYear)} इंशाअल्लाह `,
      after: " को मनाई जाएगी",
    }),
    ramadanLabel: (hijriYear) => `रमज़ान ${hijri(hijriYear)}`,
    dayOfRamadan: "रमज़ान का दिन",
    lailatulQadrPeriod: "लैलतुल क़द्र का समय",
    nightOfDecreeQuote: "“क़द्र की रात हज़ार महीनों से बेहतर है”",
    eidMubarak: "ईद मुबारक!",
    shawwal: (hijriYear) => `1 शव्वाल ${hijri(hijriYear)}`,
    taqabbal: "तक़ब्बलल्लाहु मिन्ना व मिन्कुम",
    datesTableHeading: "साल के अनुसार रमज़ान की तारीख़ें",
    colYear: "साल",
    colFirstDay: "रोज़े का पहला दिन",
    colEid: "ईद अल-फ़ितर",
    colHijri: "हिजरी साल",
    datesTableNote:
      "तारीख़ें उम्म अल-क़ुरा खगोलीय कैलेंडर के अनुसार हैं और आपके देश में आधिकारिक चाँद दिखने के अनुसार एक दिन आगे-पीछे हो सकती हैं।",
    datesTable2030Note:
      "2030 एक दुर्लभ दोहरा साल है: एक दूसरा रमज़ान (1452 हिजरी) लगभग 26 दिसंबर 2030 को शुरू होने की उम्मीद है।",
    faqHeading: "अक्सर पूछे जाने वाले सवाल",
    crossToEid: {
      before: "इसके बजाय जश्न का इंतज़ार है? देखें ",
      link: "ईद अल-फ़ितर की उलटी गिनती",
      after: "।",
    },
    crossToRamadan: {
      before: "पवित्र महीने की उलटी गिनती चाहिए? देखें ",
      link: "रमज़ान की उलटी गिनती",
      after: "।",
    },
    footerEidCountdown: "ईद उलटी गिनती",
    footerRamadanCountdown: "रमज़ान उलटी गिनती",
    footerApi: "API",
    footerBuiltBy: "zakiego.com द्वारा निर्मित",
    notFoundMessage: "यह पेज नहीं मिल सका।",
    notFoundBack: "उलटी गिनती पर वापस जाएँ",
    languageLabel: "भाषा",
  },
};
