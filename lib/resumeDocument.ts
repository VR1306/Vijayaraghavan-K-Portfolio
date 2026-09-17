import { readFileSync } from "fs";
import path from "path";

let cached: string | null = null;

/** Reads and base64-encodes public/resume.pdf once per server instance, for use as a document content block. */
export function getResumeBase64(): string {
  if (cached) return cached;
  const filePath = path.join(process.cwd(), "public", "resume.pdf");
  cached = readFileSync(filePath).toString("base64");
  return cached;
}
