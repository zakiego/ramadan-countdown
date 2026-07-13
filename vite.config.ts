import { cloudflare } from "@cloudflare/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  // Single build timestamp shared by the server and client bundles so
  // prerendered SEO copy (day counts, FAQ text) hydrates without mismatch
  define: {
    __BUILD_DATE__: JSON.stringify(new Date().toISOString()),
  },
  server: {
    port: 3000,
  },
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    cloudflare({ viteEnvironment: { name: "ssr" } }),
    tanstackStart({
      // Dynamic `$locale` routes aren't auto-discovered, so list every
      // localized page explicitly. `/` and `/eid` are still found by static
      // path discovery. Keep this in sync with LOCALES in src/i18n/config.ts.
      pages: [
        { path: "/ar" },
        { path: "/ar/eid" },
        { path: "/es" },
        { path: "/es/eid" },
        { path: "/hi" },
        { path: "/hi/eid" },
        { path: "/zh" },
        { path: "/zh/eid" },
      ],
      prerender: {
        enabled: true,
        // The API routes must stay dynamic, never bake them into static files
        crawlLinks: false,
        filter: ({ path }) => !path.startsWith("/api"),
      },
    }),
    viteReact(),
  ],
});
