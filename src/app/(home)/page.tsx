import Countdown from "@/app/(home)/countdown";
import { getNextRamadan } from "@/app/(home)/utils";
import { Metadata } from "next";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Ramadan Countdown",
  description: "Ramadan Countdown",
};

export default async function Page() {
  const api = await getNextRamadan();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-white to-gray-100 ">
      <h1 className="text-4xl font-bold text-gray-800  mb-6">
        Ramadan Countdown
      </h1>
      <Countdown nextRamadan={api.entry.ramadanStart} />
    </div>
  );
}
