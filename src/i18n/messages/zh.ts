import type { RamadanData } from "@/data/ramadan";
import { daysBetweenUtc } from "@/utils/date";
import type { Faq, Messages } from "./types";

// Simplified Chinese. No plural inflection and no spaces between characters.
// 斋月 = Ramadan, 开斋节 = Eid al-Fitr, 盖德尔夜 = Laylat al-Qadr.

/** Strip the trailing "H" from a Hijri year, e.g. "1447H" -> "1447". */
const hy = (h: string): string => h.replace(/H$/, "");
const totalRamadanDays = (r: RamadanData): number =>
  daysBetweenUtc(r.ramadanStart, r.ramadanEnd) + 1;

function howLongFaq(target: RamadanData, fmtShort: (d: Date) => string): Faq {
  return {
    question: "斋月持续多少天？",
    answer: `斋月持续29或30天，即一个完整的太阴月。${
      target.year
    }年斋月（伊斯兰历${hy(target.hijriYear)}年）预计持续${totalRamadanDays(
      target,
    )}天，从${fmtShort(target.ramadanStart)}到${fmtShort(target.ramadanEnd)}。`,
  };
}

function whenIsEidFaq(target: RamadanData, fmtFull: (d: Date) => string): Faq {
  return {
    question: `${target.year}年开斋节是哪一天？`,
    answer: `标志斋月结束的节日——${target.year}年开斋节，预计为${fmtFull(
      target.eidAlFitr,
    )}（伊斯兰历${hy(target.hijriYear)}年闪瓦鲁月1日）。`,
  };
}

const WHAT_IS_RAMADAN_FAQ: Faq = {
  question: "斋月是什么？",
  answer:
    "斋月（Ramadan，也译作莱麦丹月）是伊斯兰历的第九个月。在这个月里，全世界的穆斯林从黎明到日落斋戒、施舍，并增加礼拜和诵读《古兰经》。斋月以开斋节的庆祝活动结束。",
};

const WHAT_IS_EID_FAQ: Faq = {
  question: "开斋节是什么？",
  answer:
    "开斋节（Eid al-Fitr）是开斋的节日，在闪瓦鲁月1日、斋月结束的次日庆祝。穆斯林会举行会礼、缴纳开斋捐（宰卡特），享用节日美食，并探访亲友。",
};

const EID_VS_ADHA_FAQ: Faq = {
  question: "开斋节和宰牲节是同一个节日吗？",
  answer:
    "不是。开斋节紧接在斋月之后，而宰牲节（古尔邦节）大约在70天后，即朝觐季节的伊斯兰历12月10日。本页面倒计时的是开斋节。",
};

function weeksAnswer(year: number, days: number): string {
  const weeks = Math.floor(days / 7);
  if (weeks < 1) {
    return `距离${year}年斋月还有不到一周：仅剩${days}天。`;
  }
  return `距离${year}年斋月还有大约${weeks}周（${days}天）。`;
}

function monthsAnswer(year: number, days: number, startShort: string): string {
  const months = Math.round(days / 30.44);
  if (months < 1) {
    return `距离${year}年斋月还有不到一个月：仅${days}天。`;
  }
  return `距离${year}年斋月还有大约${months}个月（${days}天），斋月预计于${startShort}开始。`;
}

export const zh: Messages = {
  home: {
    pre({ target, daysUntil, eveOfStart, fmt }) {
      const year = target.year;
      const h = hy(target.hijriYear);
      return {
        title: `距离${year}年斋月还有多少天？实时倒计时`,
        description: `${year}年斋月预计于${fmt.short(
          target.ramadanStart,
        )}开始，距今还有${daysUntil}天。实时倒计时，显示剩余的天数、周数和月数。`,
        h1: `${year}年斋月倒计时`,
        answer: `${year}年斋月预计于${fmt.full(
          target.ramadanStart,
        )}开始，因沙安拉。距今还有${daysUntil}天。`,
        faqs: [
          {
            question: `距离${year}年斋月还有多少天？`,
            answer: `距离${year}年斋月还有${daysUntil}天。斋戒的第一天预计为${fmt.full(
              target.ramadanStart,
            )}（伊斯兰历${h}年斋月1日），具体取决于新月的观测。`,
          },
          {
            question: `${year}年斋月何时开始？`,
            answer: `${year}年斋月预计于${fmt.full(
              eveOfStart,
            )}日落时开始，第一个完整的斋戒日为${fmt.full(
              target.ramadanStart,
            )}。确切日期取决于你所在国家的月亮观测。`,
          },
          {
            question: `距离${year}年斋月还有几周？`,
            answer: weeksAnswer(year, daysUntil),
          },
          {
            question: `距离${year}年斋月还有几个月？`,
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
      const h = hy(target.hijriYear);
      return {
        title: `${year}年斋月还剩多少天？第${dayOf}天／共${totalDays}天`,
        description: `今天是${year}年斋月的第${dayOf}天（共${totalDays}天）。距离开斋节还有${daysUntilEid}天，预计为${fmt.short(
          target.eidAlFitr,
        )}。查看实时天数追踪。`,
        h1: `${year}年斋月`,
        answer: `今天是${year}年斋月（伊斯兰历${h}年）的第${dayOf}天，共${totalDays}天。距离开斋节还有${daysUntilEid}天，预计为${fmt.full(
          target.eidAlFitr,
        )}，因沙安拉。`,
        faqs: [
          {
            question: `${year}年斋月还剩多少天？`,
            answer: `今天是斋月（伊斯兰历${h}年）的第${dayOf}天，共${totalDays}天。距离开斋节还有${daysUntilEid}天，预计为${fmt.full(
              target.eidAlFitr,
            )}。`,
          },
          {
            question: `${year}年斋月何时结束？`,
            answer: `斋戒的最后一天预计为${fmt.full(
              target.ramadanEnd,
            )}，开斋节为${fmt.full(target.eidAlFitr)}，具体取决于月亮的观测。`,
          },
          {
            question: `${year}年斋月何时开始的？`,
            answer: `伊斯兰历${h}年斋月于${fmt.full(
              target.ramadanStart,
            )}（斋月1日）开始。`,
          },
          howLongFaq(target, fmt.short),
          whenIsEidFaq(target, fmt.full),
          WHAT_IS_RAMADAN_FAQ,
        ],
      };
    },
    eid({ target, next, fmt }) {
      const year = target.year;
      const h = hy(target.hijriYear);
      const faqs: Faq[] = [
        {
          question: `${year}年开斋节是哪一天？`,
          answer: `${year}年开斋节为${fmt.full(
            target.eidAlFitr,
          )}（伊斯兰历${h}年闪瓦鲁月1日），标志着斋月的结束。`,
        },
      ];
      if (next) {
        faqs.push({
          question: `${next.year}年斋月是哪一天？`,
          answer: `${next.year}年斋月（伊斯兰历${hy(
            next.hijriYear,
          )}年斋月1日）预计于${fmt.full(next.ramadanStart)}开始。`,
        });
      }
      faqs.push(howLongFaq(target, fmt.short), WHAT_IS_RAMADAN_FAQ);
      return {
        title: `开斋节快乐！${year}年开斋节已到来`,
        description: `今天是开斋节，伊斯兰历${h}年闪瓦鲁月1日，标志着${year}年斋月的结束。愿主接受我们和你们的善功，开斋节快乐！`,
        h1: `${year}年开斋节`,
        answer: `今天，${fmt.full(
          target.eidAlFitr,
        )}，是开斋节（伊斯兰历${h}年闪瓦鲁月1日），庆祝${year}年斋月的结束。开斋节快乐！`,
        faqs,
      };
    },
  },
  eidPage: {
    pre({ target, daysUntil, ramadanStarted, fmt }) {
      const year = target.year;
      const h = hy(target.hijriYear);
      const startClause = ramadanStarted
        ? `已于${fmt.short(target.ramadanStart)}开始`
        : `预计于${fmt.short(target.ramadanStart)}开始`;
      return {
        title: `距离${year}年开斋节还有多少天？倒计时`,
        description: `${year}年开斋节预计为${fmt.short(
          target.eidAlFitr,
        )}，距今还有${daysUntil}天。以天、时、分、秒实时倒计时至开斋节。`,
        h1: `${year}年开斋节倒计时`,
        answer: `${year}年开斋节预计为${fmt.full(
          target.eidAlFitr,
        )}（伊斯兰历${h}年闪瓦鲁月1日），因沙安拉。距今还有${daysUntil}天。`,
        faqs: [
          {
            question: `距离${year}年开斋节还有多少天？`,
            answer: `距离${year}年开斋节还有${daysUntil}天，预计为${fmt.full(
              target.eidAlFitr,
            )}，具体取决于月亮的观测。`,
          },
          {
            question: `${year}年开斋节是哪一天？`,
            answer: `${year}年开斋节（伊斯兰历${h}年闪瓦鲁月1日）预计为${fmt.full(
              target.eidAlFitr,
            )}。它标志着斋月的结束，斋月${startClause}。`,
          },
          WHAT_IS_EID_FAQ,
          EID_VS_ADHA_FAQ,
        ],
      };
    },
    day({ target, next, fmt }) {
      const year = target.year;
      const h = hy(target.hijriYear);
      const faqs: Faq[] = [WHAT_IS_EID_FAQ, EID_VS_ADHA_FAQ];
      if (next) {
        faqs.push({
          question: "下一个开斋节是什么时候？",
          answer: `下一个开斋节（${next.year}年）预计为${fmt.full(
            next.eidAlFitr,
          )}（伊斯兰历${hy(next.hijriYear)}年闪瓦鲁月1日）。`,
        });
      }
      return {
        title: `开斋节快乐！${year}年开斋节已到来`,
        description: `${year}年开斋节（伊斯兰历${h}年闪瓦鲁月1日）已到来。愿主接受我们和你们的善功，开斋节快乐！`,
        h1: `${year}年开斋节`,
        answer: `开斋节快乐！${year}年开斋节（伊斯兰历${h}年闪瓦鲁月1日）于${fmt.full(
          target.eidAlFitr,
        )}开始。愿主接受我们和你们的善功。`,
        faqs,
      };
    },
  },
  ui: {
    days: "天",
    hours: "小时",
    minutes: "分钟",
    seconds: "秒",
    ramadanComingOn: (hijriYear) => ({
      before: `斋月（伊斯兰历${hy(hijriYear)}年）将于`,
      after: "到来，因沙安拉。",
    }),
    eidCelebratedOn: (hijriYear) => ({
      before: `开斋节（伊斯兰历${hy(hijriYear)}年）将于`,
      after: "庆祝，因沙安拉。",
    }),
    ramadanLabel: (hijriYear) => `伊斯兰历${hy(hijriYear)}年斋月`,
    dayOfRamadan: "斋月天数",
    lailatulQadrPeriod: "盖德尔夜期间",
    nightOfDecreeQuote: "“盖德尔夜胜过一千个月”",
    eidMubarak: "开斋节快乐！",
    shawwal: (hijriYear) => `伊斯兰历${hy(hijriYear)}年闪瓦鲁月1日`,
    taqabbal: "愿主接受我们和你们的善功",
    datesTableHeading: "各年份斋月日期",
    colYear: "年份",
    colFirstDay: "斋戒首日",
    colEid: "开斋节",
    colHijri: "伊斯兰历年份",
    datesTableNote:
      "日期依据乌姆库拉（Umm al-Qura）天文历，可能因你所在国家的官方月亮观测而前后相差一天。",
    datesTable2030Note:
      "2030年是罕见的双斋月年：第二个斋月（伊斯兰历1452年）预计于2030年12月26日前后开始。",
    faqHeading: "常见问题",
    crossToEid: {
      before: "想等待节日的到来？追踪",
      link: "开斋节倒计时",
      after: "。",
    },
    crossToRamadan: {
      before: "想为圣月本身倒计时？查看",
      link: "斋月倒计时",
      after: "。",
    },
    footerEidCountdown: "开斋节倒计时",
    footerRamadanCountdown: "斋月倒计时",
    footerApi: "API",
    footerBuiltBy: "由 zakiego.com 制作",
    notFoundMessage: "找不到该页面。",
    notFoundBack: "返回倒计时",
    languageLabel: "语言",
  },
};
