import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";

const developmentPreviewMeta =
  /<meta(?=[^>]*\bname=["']codex-preview["'])(?=[^>]*\bcontent=["']development["'])[^>]*>/i;

test("renders development preview metadata", async () => {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  const response = await worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );

  assert.equal(response.status, 200);
  assert.match(
    response.headers.get("content-type") ?? "",
    /^text\/html\b/i,
  );
  const html = await response.text();
  assert.match(html, developmentPreviewMeta);
  assert.match(html, /要素を埋めて、基本プロンプトを組み立てます。/);
  assert.match(html, /作りながら覚える、/);
});

test("keeps the passphrase and protected skill body out of public source", async () => {
  const contentSource = await readFile(new URL("../lib/content.ts", import.meta.url), "utf8");
  const skillsPageSource = await readFile(new URL("../app/skills/page.tsx", import.meta.url), "utf8");

  assert.doesNotMatch(contentSource, /picturebook-character-series/);
  assert.doesNotMatch(skillsPageSource, /\|\|\s*["']もちもち["']/);
});

test("prompt maker is a one-minute selection flow", async () => {
  const pageSource = await readFile(new URL("../app/prompt-maker/page.tsx", import.meta.url), "utf8");
  const makerSource = await readFile(new URL("../components/PromptMaker.tsx", import.meta.url), "utf8");

  assert.match(pageSource, /1分でプロンプト/);
  assert.match(makerSource, /RadioGroup/);
  assert.match(makerSource, /5つ選んだら、できあがり/);
  assert.match(makerSource, /実演プロンプト/);
  assert.match(makerSource, /TabsTrigger/);
  assert.doesNotMatch(makerSource, /<input/);
});

test("live mode opens the interactive demonstration prompts", async () => {
  const liveSource = await readFile(new URL("../app/live/page.tsx", import.meta.url), "utf8");

  assert.match(liveSource, /\/prompt-maker#demo-prompts/);
});
