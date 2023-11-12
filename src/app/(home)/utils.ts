import { keystaticReader } from "@/utils/keystatic";
import { sortBy } from "lodash";
import { z } from "zod";

export async function getNextRamadan() {
  const resp = await fetch("https://ramadan.zakiego.com/api/history").then(
    (r) => r.json(),
  );

  const schema = z.array(
    z.object({
      year: z.coerce.number(),
      ramadanStart: z.coerce.date(),
      ramadanEnd: z.coerce.date(),
      eidAlFitr: z.coerce.date(),
    }),
  );

  const data = sortBy(schema.parse(resp), (ramadan) => ramadan.ramadanStart);

  // find the next ramadan
  const now = new Date();
  const nextRamadan = data.find((ramadan) => ramadan.ramadanStart > now);

  if (!nextRamadan) {
    throw new Error("Could not find next ramadan");
  }

  return nextRamadan;
}
