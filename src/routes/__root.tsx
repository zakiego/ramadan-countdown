import { DevDatePicker } from "@/components/DevDatePicker";
import { DevDateProvider } from "@/context/DevDateContext";
import { LOCALE_META, localeFromPathname } from "@/i18n/config";
import { I18nProvider } from "@/i18n/context";
import appCss from "@/styles/app.css?url";
import {
  HeadContent,
  Scripts,
  createRootRoute,
  useRouterState,
} from "@tanstack/react-router";
import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

// Page-specific tags (title, description, canonical, og:url, og:image and
// the twitter/og text variants) live in each route's head() so the home and
// Eid pages carry their own copy. Only shared, page-independent tags go here.
export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0d2e26" },
      { title: "Ramadan Countdown" },
      { name: "author", content: "Zakiyuddin Munziri" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:site_name", content: "Ramadan Countdown" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:creator", content: "@zakiego" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/icon.png" },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  // Derive the active locale from the URL so the document's lang/dir and the
  // i18n context are correct for both the prerendered HTML and client nav.
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const locale = localeFromPathname(pathname);
  const meta = LOCALE_META[locale];

  return (
    <html lang={meta.htmlLang} dir={meta.dir}>
      <head>
        <HeadContent />
      </head>
      <body>
        <I18nProvider locale={locale}>
          <MotionConfig reducedMotion="user">
            <DevDateProvider>
              {children}
              <DevDatePicker />
            </DevDateProvider>
          </MotionConfig>
        </I18nProvider>
        <Scripts />
      </body>
    </html>
  );
}
