import { useI18n } from "@/i18n/context";
import { Link } from "@tanstack/react-router";

export function NotFound() {
  const { ui } = useI18n();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-radial-[ellipse_at_top] from-[#1a4a3e] via-[#0d2e26] to-[#051410] px-4 text-white">
      <h1 className="text-6xl font-bold text-amber-100 font-serif mb-4">404</h1>
      <p className="text-emerald-100/70 mb-8">{ui.notFoundMessage}</p>
      <Link
        to="/"
        className="px-6 py-3 rounded-full bg-emerald-900/20 border border-emerald-500/10 text-emerald-50 hover:text-amber-200 transition-colors"
      >
        {ui.notFoundBack}
      </Link>
    </div>
  );
}
