import { PREFIXED_LOCALES } from "@/i18n/config";
import { Outlet, createFileRoute, notFound } from "@tanstack/react-router";

/**
 * Layout for the prefixed locales (`/es`, `/ar`, `/hi`, `/zh`). Validates the
 * segment once for every child page: unknown values and `/en` (English is
 * canonical at `/`, not `/en`) 404 instead of rendering duplicate content.
 */
export const Route = createFileRoute("/$locale")({
  beforeLoad: ({ params }) => {
    if (!(PREFIXED_LOCALES as readonly string[]).includes(params.locale)) {
      throw notFound();
    }
  },
  component: () => <Outlet />,
});
