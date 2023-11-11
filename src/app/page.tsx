import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ramadan Countdown",
  description: "Ramadan Countdown",
};

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-white to-gray-100 ">
      <h1 className="text-4xl font-bold text-gray-800  mb-6">
        Ramadan Countdown
      </h1>
      <div className="bg-white  shadow-lg rounded-lg p-8">
        <div className="grid grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-2xl font-semibold text-gray-800 ">Days</p>
            <p className="text-6xl font-bold text-gray-800">30</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-800 ">Hours</p>
            <p className="text-6xl font-bold text-gray-800">23</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-800 ">Minutes</p>
            <p className="text-6xl font-bold text-gray-800 ">59</p>
          </div>
          <div>
            <p className="text-2xl font-semibold text-gray-800 ">Seconds</p>
            <p className="text-6xl font-bold text-gray-800 ">60</p>
          </div>
        </div>
      </div>
    </div>
  );
}
