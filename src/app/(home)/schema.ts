import { z } from "zod";

export const ramadanSchema = z.array(
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
