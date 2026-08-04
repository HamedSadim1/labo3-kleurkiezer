/**
 * Guards the folder structure of `src/`:
 *
 * 1. Exactly one `components` directory may exist, at `src/components`.
 * 2. Component (.tsx) files may only live at the `src/` root (entry points
 *    like `App.tsx`/`main.tsx`) or inside `src/components`.
 * 3. The README project-structure block must match the real `src/` tree
 *    (README is the single source of truth for the documented structure).
 *
 * Run locally with `npm run check:structure`; also wired into CI.
 */
import { readFileSync, readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("../src/", import.meta.url));
const README = fileURLToPath(new URL("../README.md", import.meta.url));

const componentsDirs = [];
const misplacedFiles = [];

function walk(dir) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === "components") componentsDirs.push(full);
      walk(full);
    } else if (entry.isFile() && entry.name.endsWith(".tsx")) {
      const parent = relative(SRC, dir);
      const inComponents =
        parent === "components" || parent.startsWith(`components${sep}`);
      if (parent !== "" && !inComponents) {
        misplacedFiles.push(relative(SRC, full));
      }
    }
  }
}

/** Parse the README ```text structure block into relative src/ paths. */
function readmeEntries() {
  const readme = readFileSync(README, "utf8");
  const block = readme.match(/```text\r?\n([\s\S]*?)\r?\n```/);
  if (!block) {
    console.error('✖ README.md has no "```text" project-structure block.');
    process.exit(1);
  }
  const entries = new Set();
  const dirStack = [];
  for (const line of block[1].split(/\r?\n/)) {
    const match = /^([│\s]*)([├└]──\s+)(.+)$/.exec(line);
    if (!match) continue;
    const depth = match[1].length / 4;
    if (!Number.isInteger(depth)) {
      console.error(
        `✖ Unexpected tree formatting in README line: ${line.trim()}`,
      );
      process.exit(1);
    }
    const raw = match[3];
    const isDir = raw.endsWith("/");
    const name = isDir ? raw.slice(0, -1) : raw;
    const path = [...dirStack.slice(0, depth), name].join("/");
    entries.add(isDir ? `${path}/` : path);
    if (isDir) {
      dirStack[depth] = name;
      dirStack.length = depth + 1;
    }
  }
  return entries;
}

/** Collect the real src/ tree as relative paths (directories end with "/"). */
function actualEntries() {
  const entries = new Set();
  function collect(dir, rel) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const path = rel ? `${rel}/${entry.name}` : entry.name;
      if (entry.isDirectory()) {
        entries.add(`${path}/`);
        collect(join(dir, entry.name), path);
      } else {
        entries.add(path);
      }
    }
  }
  collect(SRC, "");
  return entries;
}

try {
  walk(SRC);
} catch (error) {
  console.error(`✖ Could not inspect src/ (${error.message})`);
  process.exit(1);
}

let failed = false;

const hasExactlyOneComponents =
  componentsDirs.length === 1 &&
  relative(SRC, componentsDirs[0]) === "components";

if (!hasExactlyOneComponents) {
  failed = true;
  console.error(
    `✖ Expected exactly one "components" folder at src/components, found ${componentsDirs.length}:`,
  );
  for (const dir of componentsDirs) {
    console.error(`  - ${relative(SRC, dir)}`);
  }
}

if (misplacedFiles.length > 0) {
  failed = true;
  console.error("✖ Component files found outside src/ or src/components:");
  for (const file of misplacedFiles) {
    console.error(`  - ${file}`);
  }
}

const expected = readmeEntries();
const actual = actualEntries();
const notOnDisk = [...expected].filter((entry) => !actual.has(entry));
const notInReadme = [...actual].filter((entry) => !expected.has(entry));

if (notOnDisk.length > 0) {
  failed = true;
  console.error("✖ README lists entries that do not exist on disk:");
  for (const entry of notOnDisk) {
    console.error(`  - ${entry}`);
  }
}

if (notInReadme.length > 0) {
  failed = true;
  console.error("✖ Entries on disk are missing from the README structure:");
  for (const entry of notInReadme) {
    console.error(`  - ${entry}`);
  }
}

if (failed) {
  process.exit(1);
}

console.log("✔ Structure OK: single components folder, README matches src/");
