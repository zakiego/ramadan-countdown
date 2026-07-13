import type { RamadanData } from "@/data/ramadan";
import { useI18n } from "@/i18n/context";
import { daysBetweenUtc } from "@/utils/date";

/**
 * Upcoming Ramadan and Eid dates, server-rendered as a plain table so
 * long-tail "when is ramadan 2029" style queries find the answer in HTML.
 */
export function DatesTable({
  ramadans,
  now,
}: {
  ramadans: RamadanData[];
  now: Date;
}) {
  const { ui, fmt } = useI18n();
  const rows = ramadans.filter((r) => daysBetweenUtc(now, r.eidAlFitr) >= 0);
  if (rows.length === 0) {
    return null;
  }

  return (
    <section
      id="dates"
      className="relative z-10 w-full max-w-2xl mx-auto mt-16 md:mt-20"
    >
      <h2 className="text-2xl md:text-3xl font-bold font-serif text-amber-100 text-center mb-8">
        {ui.datesTableHeading}
      </h2>
      <table className="w-full text-left text-sm md:text-base">
        <thead>
          <tr className="text-xs uppercase tracking-widest text-emerald-100/50">
            <th className="py-3 pr-4 font-medium">{ui.colYear}</th>
            <th className="py-3 pr-4 font-medium">{ui.colFirstDay}</th>
            <th className="py-3 pr-4 font-medium">{ui.colEid}</th>
            <th className="py-3 font-medium">{ui.colHijri}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.year} className="border-t border-emerald-500/10">
              <td className="py-3 pr-4 font-semibold text-amber-100">
                {r.year}
              </td>
              <td className="py-3 pr-4 text-emerald-100/80">
                {fmt.short(r.ramadanStart)}
              </td>
              <td className="py-3 pr-4 text-emerald-100/80">
                {fmt.short(r.eidAlFitr)}
              </td>
              <td className="py-3 text-emerald-100/60">{r.hijriYear}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className="mt-4 text-xs md:text-sm text-emerald-100/50 leading-relaxed">
        {ui.datesTableNote}
        {rows.some((r) => r.year === 2030) && ` ${ui.datesTable2030Note}`}
      </p>
    </section>
  );
}
