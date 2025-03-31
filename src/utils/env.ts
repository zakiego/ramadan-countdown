import { z } from "zod";

export const ENV_SCHEMA = z.object({
  NODE_ENV: z.enum(["development", "production"]).default("development"),
});

export const ENV = ENV_SCHEMA.parse(process.env);

export const createEndpoint = (path: string) => {
  const basePath =
    ENV.NODE_ENV === "production"
      ? "https://ramadan.zakiego.com/api"
      : "http://localhost:3000/api";

  // Ensure path starts with a slash if not already
  const formattedPath = path.startsWith("/") ? path : `/${path}`;

  return `${basePath}${formattedPath}`;
};
