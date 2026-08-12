import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";

const source = fs.readFileSync(
  new URL("./MainGuideMobilePathNav.jsx", import.meta.url),
  "utf8"
);

test("mobile learning path uses a compact premium control", () => {
  assert.match(source, /min-h-\[76px\]/);
  assert.match(source, /md:hidden/);
  assert.match(source, /min-h-11/);
  assert.match(source, /translateText\("Learning path"\)/);
  assert.match(source, /translateText\("Change"\)/);
});

test("stage chooser is keyboard and screen-reader accessible", () => {
  assert.match(source, /role="dialog"/);
  assert.match(source, /aria-modal="true"/);
  assert.match(source, /aria-current=\{selected \? "step" : undefined\}/);
  assert.match(source, /event\.key === "Escape"/);
  assert.match(source, /event\.key !== "Tab"/);
  assert.match(source, /triggerRef\.current\?\.focus\(\{ preventScroll: true \}\)/);
});
