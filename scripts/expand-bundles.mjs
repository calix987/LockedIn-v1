// scripts/expand-bundles.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const BUNDLES_DIR = path.resolve(ROOT, "bundles");
const FILE_START = "===FILE:";
const FILE_END = "===END===";

function ensureDirFor(p) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
}

function cleanRelPath(input) {
  let rel = String(input || "").trim();

  // drop leading "./" or "/" (so paths are repo-relative)
  rel = rel.replace(/^\.?\//, "");

  // drop any leftover "===" or stray "=" from filenames
  rel = rel.replace(/[=]+$/, "");

  // normalize to posix separators and prevent path escape
  rel = rel.replace(/\\/g, "/");
  rel = path.posix.normalize(rel);
  while (rel.startsWith("../")) rel = rel.slice(3);

  return rel;
}

function expandBundle(filePath) {
  const name = path.basename(filePath);
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);

  let i = 0;
  const created = [];

  while (i < lines.length) {
    if (lines[i].startsWith(FILE_START)) {
      const rawRel = lines[i].slice(FILE_START.length);
      const rel = cleanRelPath(rawRel);

      let j = i + 1;
      const buf = [];
      while (j < lines.length && lines[j].trim() !== FILE_END) {
        buf.push(lines[j]);
        j++;
      }

      if (j >= lines.length) {
        console.warn(`⚠️  Missing ${FILE_END} after ${rel} in ${name}`);
        break;
      }

      const dest = path.resolve(ROOT, rel);
      ensureDirFor(dest);
      fs.writeFileSync(dest, buf.join("\n"), "utf8");
      created.push(rel);

      i = j + 1; // skip past END
    } else {
      i++;
    }
  }

  if (created.length) {
    console.log(`✅ ${name}: wrote ${created.length} file(s)`);
  } else {
    console.log(`🟡 ${name}: no files found in bundle`);
  }
  return created;
}

function main() {
  if (!fs.existsSync(BUNDLES_DIR)) {
    console.log(`ℹ️  No bundles folder at ${BUNDLES_DIR}; nothing to assemble.`);
    return;
  }

  const files = fs
    .readdirSync(BUNDLES_DIR)
    .filter((f) => f.endsWith(".txt"))
    .map((f) => path.join(BUNDLES_DIR, f));

  if (!files.length) {
    console.log("ℹ️  No .txt bundles found in /bundles; nothing to assemble.");
    return;
  }

  let total = 0;
  for (const f of files) total += expandBundle(f).length;

  console.log(`✨ Done. Created/updated ${total} file(s).`);
}

main();
