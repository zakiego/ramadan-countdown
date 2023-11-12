import { keystaticReader } from "@/utils/keystatic";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
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

  const data = await schema.parseAsync(
    await keystaticReader.collections.ramadan.all(),
  );

  return NextResponse.json(data.map((ramadan) => ramadan.entry));
}
