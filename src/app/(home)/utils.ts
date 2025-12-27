import { keystaticReader } from "@/utils/keystatic";
import { sortBy } from "lodash";
import { cache } from "react";
import { z } from "zod";

export const getHistory = async () => {
  const rawData = await keystaticReader.collections.ramadan.all();

  const schema = z.array(
    z.object({
      slug: z.coerce.number(),
      entry: z.object({
        year: z.coerce.number(),
        ramadanStart: z.coerce.date(),
        ramadanEnd: z.coerce.date(),
        eidAlFitr: z.coerce.date(),
      }),
    }),
  );

  const parsed = schema.parse(rawData);
  const data = sortBy(
    parsed.map((r) => r.entry),
    (ramadan) => ramadan.ramadanStart,
  );

  return data;
};

export const getNextRamadan = cache(async () => {
  const data = await getHistory();

  // find the next ramadan
  const now = new Date();
  const nextRamadan = data.find((ramadan) => ramadan.ramadanStart > now);

  if (!nextRamadan) {
    throw new Error("Could not find next ramadan");
  }

  return nextRamadan;
});
