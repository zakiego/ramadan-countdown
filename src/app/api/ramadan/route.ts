import { ramadanData } from "@/data/ramadan";
import { getRamadanState } from "@/utils/ramadan-state";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  const timezoneOffset = z.coerce
    .number()
    .parse(searchParams.get("timezoneOffset") || 7);

  // Apply timezone offset to current time
  const now = new Date();
  const nowWithTimezoneOffset = new Date(
    now.getTime() + timezoneOffset * 60 * 60 * 1000,
  );

  const state = getRamadanState(ramadanData, nowWithTimezoneOffset);

  const baseResponse = {
    isTodayRamadan: state.type === "ramadan" || state.type === "lailatul_qadr",
    status: state.type,
    hijriYear: state.hijriYear,
    repository: "https://github.com/zakiego/ramadan-countdown",
  };

  if (state.type === "ramadan" || state.type === "lailatul_qadr") {
    return NextResponse.json({
      ...baseResponse,
      daysElapsedSinceStart: state.day,
      totalDays: state.totalDays,
    });
  }

  return NextResponse.json(baseResponse);
}
