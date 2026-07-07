import { ramadanData } from "@/data/ramadan";
import { REPOSITORY_URL, jsonHeaders } from "@/utils/api";
import { getRamadanState } from "@/utils/ramadan-state";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

export const Route = createFileRoute("/api/ramadan")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const searchParams = new URL(request.url).searchParams;

        const parsed = z.coerce
          .number()
          .safeParse(searchParams.get("timezoneOffset") || 7);

        if (!parsed.success) {
          return Response.json(
            { error: "timezoneOffset must be a number" },
            { status: 400, headers: jsonHeaders },
          );
        }

        const timezoneOffset = parsed.data;

        // Apply timezone offset to current time
        const now = new Date();
        const nowWithTimezoneOffset = new Date(
          now.getTime() + timezoneOffset * 60 * 60 * 1000,
        );

        const state = getRamadanState(ramadanData, nowWithTimezoneOffset);

        const baseResponse = {
          isTodayRamadan:
            state.type === "ramadan" || state.type === "lailatul_qadr",
          status: state.type,
          hijriYear: state.hijriYear,
          repository: REPOSITORY_URL,
        };

        if (state.type === "ramadan" || state.type === "lailatul_qadr") {
          return Response.json(
            {
              ...baseResponse,
              daysElapsedSinceStart: state.day,
              totalDays: state.totalDays,
            },
            { headers: jsonHeaders },
          );
        }

        return Response.json(baseResponse, { headers: jsonHeaders });
      },
    },
  },
});
