import { ramadanData } from "@/data/ramadan";
import { createCountdown } from "@/utils/countdown";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const timezoneOffset = z.coerce
    .number()
    .parse(searchParams.get("timezoneOffset") || 7);

  // Find next Ramadan based on current time
  const now = new Date();
  const nextRamadan = ramadanData.find((r) => r.ramadanStart > now);

  if (!nextRamadan) {
    return NextResponse.json(
      { error: "No upcoming Ramadan data available" },
      { status: 404 }
    );
  }

  const countdown = createCountdown({
    nextRamadan: nextRamadan.ramadanStart,
    timezoneOffset,
  });

  return NextResponse.json({
    ...countdown,
    repository: "https://github.com/zakiego/ramadan-countdown",
  });
}
