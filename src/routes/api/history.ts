import { ramadanData } from "@/data/ramadan";
import { jsonHeaders } from "@/utils/api";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/api/history")({
  server: {
    handlers: {
      GET: async () => {
        return Response.json(ramadanData, { headers: jsonHeaders });
      },
    },
  },
});
