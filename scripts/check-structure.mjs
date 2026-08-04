/**
 * Guards the folder structure of `src/`:
 *
 * 1. Exactly one `components` directory may exist, at `src/components`.
 * 2. Component (.tsx) files may only live at the `src/` root (entry points
 *    like `App.tsx`/`main.tsx`) or inside `src/components`.
 *
 * Run locally with `npm run check:structure`; also wired into CI.
 */
import { readdirSync } from "node:fs";
import { join, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const SRC = fileURLToPath(new URL("../src/", import.meta.url));

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

if (failed) {
  process.exit(1);
}

console.log("✔ Structure OK: exactly one components folder at src/components");
