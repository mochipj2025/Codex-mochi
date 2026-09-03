import assert from "node:assert/strict";
import test from "node:test";
import worker from "../worker.js";

if (!crypto.subtle.timingSafeEqual) {
  crypto.subtle.timingSafeEqual = (left, right) => {
    const a = new Uint8Array(left.buffer ?? left, left.byteOffset ?? 0, left.byteLength);
    const b = new Uint8Array(right.buffer ?? right, right.byteOffset ?? 0, right.byteLength);
    if (a.byteLength !== b.byteLength) throw new Error("length mismatch");
    let result = 0;
    for (let index = 0; index < a.byteLength; index += 1) result |= a[index] ^ b[index];
    return result === 0;
  };
}

const PASSPHRASE = crypto.randomUUID();
const MARKDOWN = crypto.randomUUID();
const COOKIE_SECRET = `${crypto.randomUUID()}${crypto.randomUUID()}`;
const env = {
  SKILL_LIBRARY_PASSPHRASE: PASSPHRASE,
  SKILL_MARKDOWN: MARKDOWN,
  COOKIE_SECRET,
  ASSETS: { fetch: async () => new Response("asset") },
};

function request(path, init = {}) {
  return new Request(`https://example.test${path}`, init);
}

test("static requests use the assets binding and security headers", async () => {
  const response = await worker.fetch(request("/"), env);
  assert.equal(response.status, 200);
  assert.equal(await response.text(), "asset");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("content-security-policy"), /default-src 'self'/);
});

test("unconfigured library fails closed", async () => {
  const response = await worker.fetch(request("/api/library/content"), { ASSETS: env.ASSETS });
  assert.equal(response.status, 503);
  assert.doesNotMatch(await response.text(), new RegExp(MARKDOWN));
});

test("wrong passphrase is rejected without a cookie", async () => {
  const response = await worker.fetch(request("/api/library/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://example.test" },
    body: JSON.stringify({ passphrase: crypto.randomUUID() }),
  }), env);
  assert.equal(response.status, 401);
  assert.equal(response.headers.get("set-cookie"), null);
});

test("cross-origin login is rejected", async () => {
  const response = await worker.fetch(request("/api/library/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://attacker.invalid" },
    body: JSON.stringify({ passphrase: PASSPHRASE }),
  }), env);
  assert.equal(response.status, 403);
});

test("valid login creates a protected session and enables content and download", async () => {
  const login = await worker.fetch(request("/api/library/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", Origin: "https://example.test" },
    body: JSON.stringify({ passphrase: PASSPHRASE }),
  }), env);
  assert.equal(login.status, 200);
  const setCookie = login.headers.get("set-cookie");
  assert.match(setCookie, /HttpOnly/);
  assert.match(setCookie, /Secure/);
  assert.match(setCookie, /SameSite=Lax/);
  const cookie = setCookie.split(";", 1)[0];

  const content = await worker.fetch(request("/api/library/content", { headers: { Cookie: cookie } }), env);
  assert.equal(content.status, 200);
  assert.equal((await content.json()).markdown, MARKDOWN);
  assert.equal(content.headers.get("cache-control"), "no-store");

  const download = await worker.fetch(request("/api/library/download", { headers: { Cookie: cookie } }), env);
  assert.equal(download.status, 200);
  assert.equal(await download.text(), MARKDOWN);
  assert.match(download.headers.get("content-disposition"), /SKILL\.md/);
});

test("tampered session is rejected", async () => {
  const response = await worker.fetch(request("/api/library/content", { headers: { Cookie: "codex_textbook_session=altered.invalid" } }), env);
  assert.equal(response.status, 401);
  assert.doesNotMatch(await response.text(), new RegExp(MARKDOWN));
});
