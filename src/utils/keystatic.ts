import { createReader } from "@keystatic/core/reader";
import { keystaticConfig } from "../../keystatic.config";

export const keystaticReader = createReader(process.cwd(), keystaticConfig);
