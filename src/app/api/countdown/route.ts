import { getNextRamadan } from "@/app/(home)/utils";
import { createCountdown } from "@/utils/countdown";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const timezoneOffset = z.coerce
    .number()
    .parse(searchParams.get("timezoneOffset") || 7);

  const nextRamadan = await getNextRamadan();

  const countdown = await createCountdown({
    nextRamadan: nextRamadan.ramadanStart,
    timezoneOffset,
  });

  return NextResponse.json({
    ...countdown,
    repository: "https://github.com/zakiego/ramadan-countdown",
  });
}
