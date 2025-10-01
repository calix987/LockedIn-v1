// scripts/expand-bundles.mjs
// Expands "bundle" .txt files into real repo files.
// Each bundle uses markers:
//   ===FILE: relative/path/to/file.ext
//   ...file contents...
//   ===END===
//
// Example:
// ===FILE: apps/web/src/app/page.tsx
// import React from "react";
// export default function Page(){ return <div/> }
// ===END===

import fs from "node:fs";
import path from "node:path";

const BUNDLES_DIR = path.resolve(process.cwd(), "bundles");
const FILE_START = "===FILE:";
const FILE_END = "===END===";

function ensureDir(filePath) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
}

function expandBundle(filePath) {
  const name = path.basename(filePath);
  const text = fs.readFileSync(filePath, "utf8");
  const lines = text.split(/\r?\n/);

  let i = 0;
  const created = [];

  while (i < lines.length) {
    if (lines[i].startsWith(FILE_START)) {
      // Get relative path after marker and normalize it
      const rel = lines[i]
        .slice(FILE_START.length)
        .trim()
        .replace(/^[./\\]+/, ""); // strip ./ or .\ or leading slashes

      let j = i + 1;
      const buf = [];

      // Gather until FILE_END (or EOF)
      while (j < lines.length && lines[j].trim() !== FILE_END) {
        buf.push(lines[j]);
        j++;
      }

      if (j >= lines.length) {
        console.warn(`⚠️  Missing ${FILE_END} after "${rel}" in ${name}. Writing what we have.`);
      }

      const dest = path.resolve(process.cwd(), rel);
      ensureDir(dest);

      // Ensure trailing newline for prettier diffs
      const contents = buf.join("\n") + "\n";
      fs.writeFileSync(dest, contents, "utf8");
      created.push(rel);

      // Move past the END marker if it was found
      i = j < lines.length ? j + 1 : j;
    } else {
      i++;
    }
  }

  return created;
}

function main() {
  // If there's no bundles dir yet, don't fail the workflow—just skip.
  if (!fs.existsSync(BUNDLES_DIR)) {
    console.log("ℹ️  No /bundles folder yet — skipping assembly.");
    process.exit(0);
  }

  const files = fs.readdirSync(BUNDLES_DIR).filter((f) => f.endsWith(".txt"));

  if (!files.length) {
    console.log("ℹ️  No .txt bundles found in /bundles — skipping assembly.");
    process.exit(0);
  }

  let total = 0;

  for (const f of files) {
    const abs = path.join(BUNDLES_DIR, f);
    const out = expandBundle(abs);
    total += out.length;
    const summary =
      out.length > 0
        ? `🧩 ${f}: wrote ${out.length} file(s)`
        : `🧩 ${f}: no files found in bundle`;
    console.log(summary);
  }

  console.log(`✨ Done. Created/updated ${total} file(s).`);
}

main();
