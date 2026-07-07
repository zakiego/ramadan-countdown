import { DevDatePicker } from "@/components/DevDatePicker";
import { DevDateProvider } from "@/context/DevDateContext";
import appCss from "@/styles/app.css?url";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";

const SITE_URL = "https://ramadan.zakiego.com";
const DESCRIPTION =
  "Track the time remaining until the next Ramadan with our accurate countdown timer.";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "theme-color", content: "#0f172a" },
      { title: "Ramadan Countdown" },
      { name: "description", content: DESCRIPTION },
      {
        name: "keywords",
        content: "Ramadan, Countdown, Islam, Hijri, Muslim, Fasting",
      },
      { name: "author", content: "Zakiyuddin Munziri" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "en_US" },
      { property: "og:url", content: SITE_URL },
      { property: "og:title", content: "Ramadan Countdown" },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:site_name", content: "Ramadan Countdown" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Ramadan Countdown" },
      { name: "twitter:description", content: DESCRIPTION },
      { name: "twitter:creator", content: "@zakiego" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico" },
      { rel: "apple-touch-icon", href: "/icon.png" },
      { rel: "canonical", href: SITE_URL },
    ],
  }),
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <DevDateProvider>
          {children}
          <DevDatePicker />
        </DevDateProvider>
        <Scripts />
      </body>
    </html>
  );
}
