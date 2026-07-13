import { DevDatePicker } from "@/components/DevDatePicker";
import { DevDateProvider } from "@/context/DevDateContext";
import appCss from "@/styles/app.css?url";
import { HeadContent, Scripts, createRootRoute } from "@tanstack/react-router";
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
