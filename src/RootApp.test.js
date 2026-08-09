import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { fileURLToPath } from "node:url";

const rootAppPath = fileURLToPath(new URL("./RootApp.jsx", import.meta.url));

test("route changes reset the document scroll position before paint", async () => {
  const source = await readFile(rootAppPath, "utf8");

  assert.match(source, /useLayoutEffect\(\(\) => \{[\s\S]*?window\.scrollTo\(\{ top: 0, left: 0, behavior: "auto" \}\);[\s\S]*?\}, \[pathname\]\);/);
  assert.match(source, /window\.history\.scrollRestoration = "manual";/);
  assert.match(source, /window\.history\.scrollRestoration = previousScrollRestoration;/);
});
