import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

test("the skills gate starts masked and exposes a non-submitting visibility toggle", async () => {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(
    new Request("http://localhost/skills", { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /<input(?=[^>]*id="passphrase")(?=[^>]*type="password")[^>]*>/);
  assert.match(html, /<button(?=[^>]*type="button")(?=[^>]*aria-controls="passphrase")(?=[^>]*aria-pressed="false")[^>]*>表示<\/button>/);
  assert.doesNotMatch(html, /<input[^>]*(?:value|placeholder)="[^"]+"/);
});

test("visibility only changes the input type, without publishing or persisting the passphrase", async () => {
  const source = await readFile(new URL("../components/PassphraseInput.tsx", import.meta.url), "utf8");
  assert.ok(source.includes('type={visible ? "text" : "password"}'));
  assert.ok(source.includes("setVisible((current) => !current)"));
  assert.ok(source.includes('{visible ? "非表示" : "表示"}'));
  assert.doesNotMatch(source, /もちもち|process\.env|localStorage|sessionStorage|defaultValue|console\./);
});
