import fs from "node:fs";
import path from "node:path";

const BUNDLES_DIR = path.resolve(process.cwd(), "bundles");
const FILE_START = "===FILE:";
const FILE_END = "===END===";

function ensureDir(p) { fs.mkdirSync(path.dirname(p), { recursive: true }); }

function expandBundle(filePath) {
  const name = path.basename(filePath);
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);

  let i = 0, created = [];
  while (i < lines.length) {
    if (lines[i].startsWith(FILE_START)) {
      const rel = lines[i].slice(FILE_START.length).trim().replace(/^\.?\//, "");
      let j = i + 1, buf = [];
      while (j < lines.length && lines[j].trim() !== FILE_END) { buf.push(lines[j]); j++; }
      if (j >= lines.length) { console.warn(`⚠️ Missing ${FILE_END} after ${rel} in ${name}`); break; }
      const dest = path.resolve(process.cwd(), rel);
      ensureDir(dest);
      fs.writeFileSync(dest, buf.join("\n"), "utf8");
      created.push(rel);
      i = j + 1;
    } else { i++; }
  }
  return created;
}

function main() {
  if (!fs.existsSync(BUNDLES_DIR)) { console.error(`No bundles folder at ${BUNDLES_DIR}`); process.exit(1); }
  const files = fs.readdirSync(BUNDLES_DIR).filter(f => f.endsWith(".txt"));
  if (!files.length) { console.error("No .txt bundles found in /bundles"); process.exit(1); }

  let total = 0;
  for (const f of files) {
    const out = expandBundle(path.join(BUNDLES_DIR, f));
    total += out.length;
    console.log(`✅ ${f}: wrote ${out.length} file(s)`);
  }
  console.log(`✨ Done. Created/updated ${total} file(s).`);
}
main();
