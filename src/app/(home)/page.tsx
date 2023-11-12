import Countdown from "@/app/(home)/countdown";
import { getNextRamadan } from "@/app/(home)/utils";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const api = await getNextRamadan();

  return {
    title: `Ramadan Countdown ${api.year}`,
    description: `Ramadan Countdown ${api.year}`,
  };
}

export default async function Page() {
  const api = await getNextRamadan();

  return (
    <div className="relative flex flex-col items-center pt-20 md:pt-0 md:justify-center min-h-screen bg-gradient-to-r from-white to-gray-100 px-4 md:px-0">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">
        Ramadan Countdown
      </h1>
      <Countdown nextRamadan={api.ramadanStart} />
      <div className="absolute bottom-4 opacity-70">
        <p className="text-gray-600 text-sm">
          API available{" "}
          <a
            href="/api/countdown?timezoneOffset=8"
            className="text-blue-500 hover:underline"
          >
            here
          </a>
        </p>
      </div>
    </div>
  );
}
