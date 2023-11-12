import { keystaticReader } from "@/utils/keystatic";
import { sortBy } from "lodash";
import { z } from "zod";

export async function getNextRamadan() {
  const schema = z.array(
    z.object({
      slug: z.coerce.number(),
      entry: z.object({
        year: z.coerce.number(),
        ramadanStart: z.coerce.date(),
        ramadanEnd: z.coerce.date(),
        eidAlFitr: z.coerce.date(),
        notes: z.any(),
      }),
    }),
  );

  const data = sortBy(
    await schema.parseAsync(await keystaticReader.collections.ramadan.all()),
    (ramadan) => ramadan.entry.ramadanStart,
  );

  // find the next ramadan
  const now = new Date();
  const nextRamadan = data.find((ramadan) => ramadan.entry.ramadanStart > now);

  if (!nextRamadan) {
    throw new Error("Could not find next ramadan");
  }

  return nextRamadan;
}
