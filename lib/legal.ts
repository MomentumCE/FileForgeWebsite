import fs from "node:fs";
import path from "node:path";

const LEGAL_DIR = path.join(process.cwd(), "content", "legal");

export function getLegalDoc(filename: string): string | null {
  const filePath = path.join(LEGAL_DIR, `${filename}.md`);
  if (!fs.existsSync(filePath)) return null;
  return fs.readFileSync(filePath, "utf8");
}
