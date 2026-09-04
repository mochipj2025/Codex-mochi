import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

const dataSource = await readFile(new URL("../lib/setup-guide.ts", import.meta.url), "utf8");
const { outputText } = ts.transpileModule(dataSource, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
const { setupPrompts, setupHandout, workshopFolder } = await import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);

async function render(path) {
  const { default: worker } = await import("../dist/server/index.js");
  const response = await worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
  assert.equal(response.status, 200);
  return response.text();
}

test("setup guide renders four steps, readable diagrams, OS tabs and copy blocks", async () => {
  const html = await render("/setup");
  for (const id of ["create-folder", "create-project", "start-chat", "first-request"]) {
    assert.ok(html.includes(`id="${id}"`));
    assert.ok(html.includes(`href="#${id}"`));
  }
  assert.match(html, /<h1>Codexの初期設定<\/h1>/);
  assert.match(html, /実際のアプリ画面ではありません/);
  assert.match(html, /位置関係を示す模式図/);
  assert.match(html, /role="tablist"/);
  assert.match(html, /role="tab"[^>]*>Mac<\/button>/);
  assert.match(html, /role="tab"[^>]*>Windows<\/button>/);
  assert.equal((html.match(/<textarea\b/g) ?? []).length, 4);
  assert.equal((html.match(/aria-label="[^"]+をコピー"/g) ?? []).length, 4);
  assert.match(html, /図解ごと印刷／PDF保存/);
  assert.match(html, /手順・依頼文を保存（TXT）/);
  assert.match(html, /このページのボタンを押すだけでは、Codexに送信されません/);
});

test("lecture and shared navigation link to setup without removing existing resources", async () => {
  const html = await render("/live");
  assert.ok((html.match(/href="\/setup"/g) ?? []).length >= 2);
  for (const link of ["/prompt-maker#demo-prompts", "/lessons/01", "https://chatgpt.com/download/"]) assert.ok(html.includes(link));
  assert.ok(html.indexOf("初期設定ガイドを見る") < html.indexOf("<iframe"));
});

test("handout uses the exact same copy prompts and limits the initial operation", () => {
  assert.equal(workshopFolder, "Codex-workshop");
  assert.equal(new Set(setupPrompts.map(({ id }) => id)).size, 3);
  for (const { text } of setupPrompts) assert.ok(setupHandout.includes(text));
  for (const term of ["Mac：Finder", "Windows：エクスプローラー", "README.md", "references", "outputs", "prompts"]) assert.ok(setupHandout.includes(term));
  assert.match(setupPrompts[0].text, /ファイルを作らずに/);
  assert.match(setupPrompts[0].text, /削除や上書きをせず/);
  assert.match(setupPrompts[0].text, /この作業フォルダ以外は変更しない/);
  assert.match(setupPrompts[0].text, /画像生成はまだ始めない/);
});

test("copy has a manual fallback and print preserves complete prompts and both OS instructions", async () => {
  const component = await readFile(new URL("../components/SetupGuide.tsx", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/setup/setup.css", import.meta.url), "utf8");
  assert.match(component, /navigator\.clipboard\.writeText\(text\)/);
  assert.match(component, /field\.current\?\.select\(\)/);
  assert.match(component, /role="status"/);
  assert.match(component, /<pre className="setup-print-text">\{text\}<\/pre>/);
  assert.match(component, /window\.print\(\)/);
  assert.match(component, /URL\.revokeObjectURL\(url\)/);
  assert.match(css, /@media print/);
  assert.match(css, /\.setup-print-text,\.setup-print-only\{display:block\}/);
});
