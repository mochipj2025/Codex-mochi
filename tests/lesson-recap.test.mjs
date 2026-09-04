import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const source = await readFile(new URL("../lib/lesson-recap.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { continuousOpening, continuousPrompt, resumePrompt } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

async function render(path) {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(new Request(`http://localhost${path}`),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} });
  assert.equal(response.status, 200);
  return response.text();
}

test("continuous generation instructions are literally first and specify five separate images", () => {
  assert.ok(continuousPrompt.startsWith(continuousOpening));
  assert.match(continuousPrompt.split("\n")[0], /^合計5枚.*1枚ずつ.*連続生成/);
  assert.match(continuousPrompt, /別々の画像ファイルを5枚/);
  assert.equal((continuousPrompt.match(/^[1-5]枚目：/gm) ?? []).length, 5);
  assert.match(continuousPrompt, /止まった理由/);
  assert.match(resumePrompt, /完成済みの画像は作り直したり上書きしたりせず/);
});

test("separate recap article renders concise rules, copy examples and limitations without slides", async () => {
  const html = await render("/recap");
  assert.match(html, /5枚以上の連続生成は、/);
  assert.match(html, /プロンプトのいちばん最初に。/);
  assert.match(html, /最後までの実行を保証するものではありません/);
  assert.match(html, /途中で止まったら、残りだけ再開/);
  assert.match(html, /OpenAI公式の画像プロンプトガイド/);
  assert.doesNotMatch(html, /<iframe/);
  assert.equal((html.match(/<textarea\b/g) ?? []).length, 3);
  assert.equal((html.match(/aria-label="[^"]+をコピー"/g) ?? []).length, 3);
});

test("lecture links to standalone recap and preserves the lecture slide", async () => {
  const html = await render("/live");
  assert.ok((html.match(/href="\/recap"/g) ?? []).length >= 2);
  assert.match(html, /3分で復習｜実演のまとめ/);
  assert.match(html, /<iframe/);
  assert.match(html, /\/prompt-maker#demo-prompts/);
});

test("live, recap and archive pages link to the Substack recording safely", async () => {
  for (const path of ["/live", "/recap", "/archive"]) {
    const html = await render(path);
    assert.match(html, /LIVEのアーカイブができました/);
    assert.match(html, /href="https:\/\/mochiketu2026\.substack\.com\/p\/codex\?utm_campaign=post&amp;utm_medium=web" target="_blank" rel="noopener noreferrer"/);
    assert.match(html, /Substack・別タブで開きます/);
    assert.equal((html.match(/id="live-archive-title"/g) ?? []).length, 1);
  }
});
