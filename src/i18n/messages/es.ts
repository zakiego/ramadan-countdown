import type { RamadanData } from "@/data/ramadan";
import { daysBetweenUtc } from "@/utils/date";
import type { Faq, Messages } from "./types";

const hijri = (h: string): string => h.replace(/H$/, " H");
const daysWord = (n: number): string => (n === 1 ? "día" : "días");
const totalRamadanDays = (r: RamadanData): number =>
  daysBetweenUtc(r.ramadanStart, r.ramadanEnd) + 1;

function howLongFaq(target: RamadanData, fmtShort: (d: Date) => string): Faq {
  return {
    question: "¿Cuánto dura el Ramadán?",
    answer: `El Ramadán dura 29 o 30 días, un mes lunar completo. Se espera que el Ramadán ${hijri(
      target.hijriYear,
    )} (${target.year}) dure ${totalRamadanDays(target)} días, del ${fmtShort(
      target.ramadanStart,
    )} al ${fmtShort(target.ramadanEnd)}.`,
  };
}

function whenIsEidFaq(target: RamadanData, fmtFull: (d: Date) => string): Faq {
  return {
    question: `¿Cuándo es el Eid al-Fitr ${target.year}?`,
    answer: `El Eid al-Fitr ${
      target.year
    }, la fiesta que marca el fin del Ramadán, se espera el ${fmtFull(
      target.eidAlFitr,
    )} (1 de Shawwal ${hijri(target.hijriYear)}).`,
  };
}

const WHAT_IS_RAMADAN_FAQ: Faq = {
  question: "¿Qué es el Ramadán?",
  answer:
    "El Ramadán (también escrito Ramadhan o Ramazán) es el noveno mes del calendario islámico, cuando los musulmanes de todo el mundo ayunan desde el amanecer hasta el atardecer, dan caridad y aumentan la oración y la recitación del Corán. Termina con la celebración del Eid al-Fitr.",
};

const WHAT_IS_EID_FAQ: Faq = {
  question: "¿Qué es el Eid al-Fitr?",
  answer:
    "El Eid al-Fitr (también escrito Eid ul-Fitr) es la fiesta de la ruptura del ayuno, celebrada el 1 de Shawwal, el día después de que termina el Ramadán. Los musulmanes lo celebran con la oración del Eid, la caridad del zakat al-fitr, comidas festivas y visitas a familiares y amigos.",
};

const EID_VS_ADHA_FAQ: Faq = {
  question: "¿Es el Eid al-Fitr lo mismo que el Eid al-Adha?",
  answer:
    "No. El Eid al-Fitr llega justo después del Ramadán, mientras que el Eid al-Adha cae unos 70 días después, el 10 de Dhul-Hijjah durante la temporada del Hajj. Esta página hace la cuenta atrás hasta el Eid al-Fitr.",
};

function weeksAnswer(year: number, days: number): string {
  const weeks = Math.floor(days / 7);
  if (weeks < 1) {
    return `Falta menos de una semana para el Ramadán ${year}: solo quedan ${days} ${daysWord(
      days,
    )}.`;
  }
  return `Quedan unas ${weeks} ${
    weeks === 1 ? "semana" : "semanas"
  } (${days} ${daysWord(days)}) para el Ramadán ${year}.`;
}

function monthsAnswer(year: number, days: number, startShort: string): string {
  const months = Math.round(days / 30.44);
  if (months < 1) {
    return `Falta menos de un mes para el Ramadán ${year}: solo ${days} ${daysWord(
      days,
    )}.`;
  }
  const label =
    months === 1 ? "aproximadamente 1 mes" : `aproximadamente ${months} meses`;
  return `${months === 1 ? "Queda" : "Quedan"} ${label} (${days} ${daysWord(
    days,
  )}) para el Ramadán ${year}, que se espera que comience el ${startShort}.`;
}

export const es: Messages = {
  home: {
    pre({ target, daysUntil, eveOfStart, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      return {
        title: `¿Cuántos días faltan para el Ramadán ${year}? Cuenta atrás`,
        description: `El Ramadán ${year} comenzará el ${fmt.short(
          target.ramadanStart,
        )}, dentro de ${daysUntil} ${daysWord(
          daysUntil,
        )}. Cuenta atrás en vivo de los días, semanas y meses que faltan.`,
        h1: `Cuenta atrás del Ramadán ${year}`,
        answer: `El Ramadán ${year} comenzará, inshaAllah, el ${fmt.full(
          target.ramadanStart,
        )}. Faltan ${daysUntil} ${daysWord(daysUntil)} desde hoy.`,
        faqs: [
          {
            question: `¿Cuántos días faltan para el Ramadán ${year}?`,
            answer: `Faltan ${daysUntil} ${daysWord(
              daysUntil,
            )} para el Ramadán ${year}. Se espera que el primer día de ayuno sea el ${fmt.full(
              target.ramadanStart,
            )} (1 de Ramadán ${h}), según el avistamiento de la luna creciente.`,
          },
          {
            question: `¿Cuándo empieza el Ramadán ${year}?`,
            answer: `Se espera que el Ramadán ${year} comience al atardecer del ${fmt.full(
              eveOfStart,
            )}, con el primer día completo de ayuno el ${fmt.full(
              target.ramadanStart,
            )}. La fecha exacta depende del avistamiento de la luna en tu país.`,
          },
          {
            question: `¿Cuántas semanas faltan para el Ramadán ${year}?`,
            answer: weeksAnswer(year, daysUntil),
          },
          {
            question: `¿Cuántos meses faltan para el Ramadán ${year}?`,
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
      const quedan = daysUntilEid === 1 ? "Queda" : "Quedan";
      return {
        title: `¿Cuántos días quedan de Ramadán ${year}? Día ${dayOf} de ${totalDays}`,
        description: `Hoy es el día ${dayOf} de ${totalDays} del Ramadán ${year}. Quedan ${daysUntilEid} ${daysWord(
          daysUntilEid,
        )} para el Eid al-Fitr, previsto para el ${fmt.short(
          target.eidAlFitr,
        )}. Sigue el seguimiento diario en vivo.`,
        h1: `Ramadán ${year}`,
        answer: `Hoy es el día ${dayOf} de ${totalDays} del Ramadán ${h} (${year}). ${quedan} ${daysUntilEid} ${daysWord(
          daysUntilEid,
        )} para el Eid al-Fitr, previsto para el ${fmt.full(
          target.eidAlFitr,
        )}, inshaAllah.`,
        faqs: [
          {
            question: `¿Cuántos días quedan de Ramadán ${year}?`,
            answer: `Hoy es el día ${dayOf} de ${totalDays} del Ramadán ${h}. ${quedan} ${daysUntilEid} ${daysWord(
              daysUntilEid,
            )} para el Eid al-Fitr, previsto para el ${fmt.full(
              target.eidAlFitr,
            )}.`,
          },
          {
            question: `¿Cuándo termina el Ramadán ${year}?`,
            answer: `Se espera que el último día de ayuno sea el ${fmt.full(
              target.ramadanEnd,
            )}, con el Eid al-Fitr el ${fmt.full(
              target.eidAlFitr,
            )}, según el avistamiento de la luna.`,
          },
          {
            question: `¿Cuándo empezó el Ramadán ${year}?`,
            answer: `El Ramadán ${h} comenzó el ${fmt.full(
              target.ramadanStart,
            )} (1 de Ramadán).`,
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
          question: `¿Cuándo es el Eid al-Fitr ${year}?`,
          answer: `El Eid al-Fitr ${year} cae el ${fmt.full(
            target.eidAlFitr,
          )} (1 de Shawwal ${h}), marcando el fin del Ramadán.`,
        },
      ];
      if (next) {
        faqs.push({
          question: `¿Cuándo es el Ramadán ${next.year}?`,
          answer: `Se espera que el Ramadán ${next.year} (1 de Ramadán ${hijri(
            next.hijriYear,
          )}) comience el ${fmt.full(next.ramadanStart)}.`,
        });
      }
      faqs.push(howLongFaq(target, fmt.short), WHAT_IS_RAMADAN_FAQ);
      return {
        title: `¡Eid Mubarak! El Eid al-Fitr ${year} ya está aquí`,
        description: `Hoy es Eid al-Fitr, 1 de Shawwal ${h}, que marca el fin del Ramadán ${year}. Taqabbalallahu minna wa minkum, ¡Eid Mubarak!`,
        h1: `Eid al-Fitr ${year}`,
        answer: `Hoy, ${fmt.full(
          target.eidAlFitr,
        )}, es Eid al-Fitr (1 de Shawwal ${h}), la celebración que marca el fin del Ramadán ${year}. ¡Eid Mubarak!`,
        faqs,
      };
    },
  },
  eidPage: {
    pre({ target, daysUntil, ramadanStarted, fmt }) {
      const year = target.year;
      const h = hijri(target.hijriYear);
      return {
        title: `¿Cuántos días faltan para el Eid al-Fitr ${year}? Cuenta atrás`,
        description: `El Eid al-Fitr ${year} se espera el ${fmt.short(
          target.eidAlFitr,
        )}, dentro de ${daysUntil} ${daysWord(
          daysUntil,
        )}. Cuenta atrás en vivo hasta el Eid ul-Fitr en días, horas, minutos y segundos.`,
        h1: `Cuenta atrás del Eid al-Fitr ${year}`,
        answer: `El Eid al-Fitr ${year} se espera el ${fmt.full(
          target.eidAlFitr,
        )} (1 de Shawwal ${h}), inshaAllah. Faltan ${daysUntil} ${daysWord(
          daysUntil,
        )} desde hoy.`,
        faqs: [
          {
            question: `¿Cuántos días faltan para el Eid al-Fitr ${year}?`,
            answer: `Faltan ${daysUntil} ${daysWord(
              daysUntil,
            )} para el Eid al-Fitr ${year}, previsto para el ${fmt.full(
              target.eidAlFitr,
            )}, según el avistamiento de la luna.`,
          },
          {
            question: `¿Cuándo es el Eid al-Fitr ${year}?`,
            answer: `El Eid al-Fitr ${year} (1 de Shawwal ${h}) se espera el ${fmt.full(
              target.eidAlFitr,
            )}. Marca el fin del Ramadán, que ${
              ramadanStarted ? "comenzó" : "se espera que comience"
            } el ${fmt.short(target.ramadanStart)}.`,
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
          question: "¿Cuándo es el próximo Eid al-Fitr?",
          answer: `El próximo Eid al-Fitr (${
            next.year
          }) se espera el ${fmt.full(next.eidAlFitr)} (1 de Shawwal ${hijri(
            next.hijriYear,
          )}).`,
        });
      }
      return {
        title: `¡Eid Mubarak! El Eid al-Fitr ${year} ya llegó`,
        description: `El Eid al-Fitr ${year} (1 de Shawwal ${h}) ha llegado. Taqabbalallahu minna wa minkum, ¡Eid Mubarak!`,
        h1: `Eid al-Fitr ${year}`,
        answer: `¡Eid Mubarak! El Eid al-Fitr ${year} (1 de Shawwal ${h}) comenzó el ${fmt.full(
          target.eidAlFitr,
        )}. Taqabbalallahu minna wa minkum.`,
        faqs,
      };
    },
  },
  ui: {
    days: "Días",
    hours: "Horas",
    minutes: "Minutos",
    seconds: "Segundos",
    ramadanComingOn: (hijriYear) => ({
      before: `El Ramadán ${hijriYear} llegará, inshaAllah, el `,
      after: "",
    }),
    eidCelebratedOn: (hijriYear) => ({
      before: `El Eid al-Fitr ${hijriYear} se celebrará, inshaAllah, el `,
      after: "",
    }),
    ramadanLabel: (hijriYear) => `Ramadán ${hijriYear}`,
    dayOfRamadan: "Día de Ramadán",
    lailatulQadrPeriod: "Periodo de Lailatul Qadr",
    nightOfDecreeQuote: '"La Noche del Decreto es mejor que mil meses"',
    eidMubarak: "¡Eid Mubarak!",
    shawwal: (hijriYear) => `1 de Shawwal ${hijriYear}`,
    taqabbal: "Taqabbalallahu minna wa minkum",
    datesTableHeading: "Fechas del Ramadán por año",
    colYear: "Año",
    colFirstDay: "Primer día de ayuno",
    colEid: "Eid al-Fitr",
    colHijri: "Año hégira",
    datesTableNote:
      "Las fechas siguen el calendario astronómico Umm al-Qura y pueden variar un día según el avistamiento oficial de la luna en tu país.",
    datesTable2030Note:
      "2030 es un raro año doble: se espera que un segundo Ramadán (1452 H) comience alrededor del 26 de diciembre de 2030.",
    faqHeading: "Preguntas frecuentes",
    crossToEid: {
      before: "¿Prefieres esperar la celebración? Sigue la ",
      link: "cuenta atrás del Eid al-Fitr",
      after: ".",
    },
    crossToRamadan: {
      before: "¿Cuentas los días para el mes sagrado? Mira la ",
      link: "cuenta atrás del Ramadán",
      after: ".",
    },
    footerEidCountdown: "Cuenta atrás del Eid",
    footerRamadanCountdown: "Cuenta atrás del Ramadán",
    footerApi: "API",
    footerBuiltBy: "Hecho por zakiego.com",
    notFoundMessage: "No se encontró esta página.",
    notFoundBack: "Volver a la cuenta atrás",
    languageLabel: "Idioma",
  },
};
