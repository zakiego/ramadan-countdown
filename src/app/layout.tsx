import { DevDatePicker } from "@/components/DevDatePicker";
import { DevDateProvider } from "@/context/DevDateContext";
import type { Metadata } from "next";
import type { Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#0f172a",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "Ramadan Countdown",
    template: "%s | Ramadan Countdown",
  },
  description:
    "Track the time remaining until the next Ramadan with our accurate countdown timer.",
  metadataBase: new URL("https://ramadan.zakiego.com"),
  keywords: ["Ramadan", "Countdown", "Islam", "Hijri", "Muslim", "Fasting"],
  authors: [{ name: "Zakiyuddin Munziri", url: "https://zakiego.com" }],
  creator: "Zakiyuddin Munziri",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://ramadan.zakiego.com",
    title: "Ramadan Countdown",
    description:
      "Track the time remaining until the next Ramadan with our accurate countdown timer.",
    siteName: "Ramadan Countdown",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ramadan Countdown",
    description:
      "Track the time remaining until the next Ramadan with our accurate countdown timer.",
    creator: "@zakiego",
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <DevDateProvider>
          {children}
          <DevDatePicker />
        </DevDateProvider>
      </body>
    </html>
  );
}
