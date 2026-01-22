"use client";

import { useDevDate } from "@/context/DevDateContext";
import { ramadanData } from "@/data/ramadan";
import { useMemo, useState } from "react";

export function DevDatePicker() {
  const { simulatedDate, setSimulatedDate, isSimulating } = useDevDate();
  const [isMinimized, setIsMinimized] = useState(true);

  // Find the most relevant Ramadan year for presets
  // Hook must be called before any conditional return
  const relevantRamadan = useMemo(() => {
    const now = new Date();
    // Find the first Ramadan that hasn't ended yet, or use the last one
    return (
      ramadanData.find((r) => r.ramadanEnd > now) ??
      ramadanData[ramadanData.length - 1]
    );
  }, []);

  const presets = useMemo(() => {
    const r = relevantRamadan;
    return [
      {
        label: "Before Ramadan",
        description: "1 week before",
        date: new Date(r.ramadanStart.getTime() - 7 * 24 * 60 * 60 * 1000),
      },
      {
        label: "Day 1 Ramadan",
        description: "First day",
        date: r.ramadanStart,
      },
      {
        label: "Day 15 Ramadan",
        description: "Mid-Ramadan",
        date: new Date(r.ramadanStart.getTime() + 14 * 24 * 60 * 60 * 1000),
      },
      {
        label: "Lailatul Qadr",
        description: "Day 21 - Last 10 nights",
        date: new Date(r.ramadanStart.getTime() + 20 * 24 * 60 * 60 * 1000),
      },
      {
        label: "Eid al-Fitr",
        description: r.eidAlFitr.toLocaleDateString(),
        date: r.eidAlFitr,
      },
      {
        label: "After Eid",
        description: "1 day after Eid",
        date: new Date(r.eidAlFitr.getTime() + 1 * 24 * 60 * 60 * 1000),
      },
    ];
  }, [relevantRamadan]);

  // Only render in development - must be after all hooks
  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const formatDateTimeLocal = (date: Date) => {
    const pad = (n: number) => n.toString().padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
      date.getDate(),
    )}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value) {
      setSimulatedDate(new Date(value));
    }
  };

  if (isMinimized) {
    return (
      <button
        type="button"
        onClick={() => setIsMinimized(false)}
        className={`fixed bottom-4 right-4 z-50 p-3 rounded-full shadow-lg transition-all hover:scale-110 ${
          isSimulating
            ? "bg-amber-500 text-white"
            : "bg-gray-800 text-gray-300 hover:bg-gray-700"
        }`}
        title={
          isSimulating
            ? `Simulating: ${simulatedDate?.toLocaleDateString()}`
            : "Open Date Picker"
        }
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        {isSimulating && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-72 bg-gray-900 border border-gray-700 rounded-lg shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-gray-800 border-b border-gray-700">
        <span className="text-sm font-medium text-gray-200">
          Dev Date Picker
        </span>
        <button
          type="button"
          onClick={() => setIsMinimized(true)}
          className="p-1 text-gray-400 hover:text-white transition-colors"
          aria-label="Minimize date picker"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>

      <div className="p-3 space-y-3">
        {/* Current Status */}
        <div className="text-xs text-gray-400">
          {isSimulating ? (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
              <span>
                Simulating:{" "}
                <span className="text-amber-400">
                  {simulatedDate?.toLocaleString()}
                </span>
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full" />
              <span>Using real time</span>
            </div>
          )}
        </div>

        {/* Date Input */}
        <div>
          <label
            htmlFor="dev-date-input"
            className="block text-xs text-gray-400 mb-1"
          >
            Custom Date & Time
          </label>
          <input
            id="dev-date-input"
            type="datetime-local"
            value={simulatedDate ? formatDateTimeLocal(simulatedDate) : ""}
            onChange={handleDateChange}
            className="w-full px-2 py-1.5 text-sm bg-gray-800 border border-gray-600 rounded text-gray-200 focus:outline-none focus:border-emerald-500"
          />
        </div>

        {/* Quick Presets */}
        <div>
          <div className="text-xs text-gray-400 mb-2">
            Quick Presets ({relevantRamadan.year})
          </div>
          <div className="grid grid-cols-3 gap-2">
            {presets.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => setSimulatedDate(preset.date)}
                className="px-2 py-1.5 text-xs bg-gray-800 hover:bg-gray-700 border border-gray-600 rounded text-gray-300 transition-colors text-left"
              >
                <div className="font-medium">{preset.label}</div>
                <div className="text-gray-500 text-[10px]">
                  {preset.description}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <button
          type="button"
          onClick={() => setSimulatedDate(null)}
          disabled={!isSimulating}
          className="w-full px-3 py-1.5 text-sm bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-700 disabled:text-gray-500 text-white rounded transition-colors"
        >
          Reset to Real Time
        </button>
      </div>
    </div>
  );
}
