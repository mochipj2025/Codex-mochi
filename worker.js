const SESSION_COOKIE = "codex_textbook_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const encoder = new TextEncoder();

const SECURITY_HEADERS = {
  "Content-Security-Policy": "default-src 'self'; img-src 'self' data:; style-src 'self'; script-src 'self'; connect-src 'self'; font-src 'self'; object-src 'none'; base-uri 'self'; frame-ancestors 'none'; form-action 'self'",
  "Cross-Origin-Opener-Policy": "same-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
};

function json(data, init = {}) {
  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json; charset=utf-8");
  headers.set("Cache-Control", "no-store");
  return new Response(JSON.stringify(data), { ...init, headers });
}

function withSecurityHeaders(response) {
  const headers = new Headers(response.headers);
  for (const [name, value] of Object.entries(SECURITY_HEADERS)) headers.set(name, value);
  return new Response(response.body, { status: response.status, statusText: response.statusText, headers });
}

function isConfigured(env) {
  return Boolean(env.SKILL_LIBRARY_PASSPHRASE && env.SKILL_MARKDOWN && env.COOKIE_SECRET);
}

function getCookie(request, name) {
  const cookieHeader = request.headers.get("Cookie") || "";
  for (const part of cookieHeader.split(";")) {
    const [key, ...value] = part.trim().split("=");
    if (key === name) return value.join("=");
  }
  return null;
}

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function base64UrlToBytes(value) {
  try {
    const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
  } catch {
    return null;
  }
}

async function sha256(value) {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", encoder.encode(value)));
}

async function safeSecretEqual(provided, expected) {
  const [providedHash, expectedHash] = await Promise.all([sha256(provided), sha256(expected)]);
  return crypto.subtle.timingSafeEqual(providedHash, expectedHash);
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return new Uint8Array(await crypto.subtle.sign("HMAC", key, encoder.encode(value)));
}

async function createSession(secret) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = `${expiresAt}.${crypto.randomUUID()}`;
  const signature = bytesToBase64Url(await hmac(payload, secret));
  return `${bytesToBase64Url(encoder.encode(payload))}.${signature}`;
}

async function hasValidSession(request, secret) {
  const token = getCookie(request, SESSION_COOKIE);
  if (!token) return false;
  const [payloadPart, signaturePart, extra] = token.split(".");
  if (!payloadPart || !signaturePart || extra) return false;
  const payloadBytes = base64UrlToBytes(payloadPart);
  const signature = base64UrlToBytes(signaturePart);
  if (!payloadBytes || !signature) return false;
  const payload = new TextDecoder().decode(payloadBytes);
  const expectedSignature = await hmac(payload, secret);
  if (signature.byteLength !== expectedSignature.byteLength) return false;
  if (!crypto.subtle.timingSafeEqual(signature, expectedSignature)) return false;
  const expiresAt = Number(payload.split(".", 1)[0]);
  return Number.isFinite(expiresAt) && expiresAt > Math.floor(Date.now() / 1000);
}

function cookieFor(token, maxAge) {
  return `${SESSION_COOKIE}=${token}; Path=/; Max-Age=${maxAge}; HttpOnly; Secure; SameSite=Lax`;
}

function sameOrigin(request) {
  const origin = request.headers.get("Origin");
  return !origin || origin === new URL(request.url).origin;
}

async function readPassphrase(request) {
  const contentType = request.headers.get("Content-Type") || "";
  if (contentType.includes("application/json")) {
    const body = await request.json();
    return typeof body?.passphrase === "string" ? body.passphrase : "";
  }
  if (contentType.includes("application/x-www-form-urlencoded")) {
    const form = await request.formData();
    const value = form.get("passphrase");
    return typeof value === "string" ? value : "";
  }
  return "";
}

async function handleApi(request, env, pathname) {
  if (!isConfigured(env)) {
    return json({ ok: false, error: "スキル図書館は現在準備中です。管理者が秘密変数を設定すると利用できます。" }, { status: 503 });
  }

  if (pathname === "/api/library/login" && request.method === "POST") {
    if (!sameOrigin(request)) return json({ ok: false, error: "無効な送信元です。" }, { status: 403 });
    const passphrase = (await readPassphrase(request)).normalize("NFKC");
    if (!passphrase || passphrase.length > 256) return json({ ok: false, error: "合言葉を正しく入力してください。" }, { status: 400 });
    const isValid = await safeSecretEqual(passphrase, env.SKILL_LIBRARY_PASSPHRASE.normalize("NFKC"));
    if (!isValid) return json({ ok: false, error: "合言葉が違います。もう一度お確かめください。" }, { status: 401 });
    const token = await createSession(env.COOKIE_SECRET);
    return json({ ok: true }, { headers: { "Set-Cookie": cookieFor(token, SESSION_TTL_SECONDS) } });
  }

  if (pathname === "/api/library/logout" && request.method === "POST") {
    if (!sameOrigin(request)) return json({ ok: false, error: "無効な送信元です。" }, { status: 403 });
    return json({ ok: true }, { headers: { "Set-Cookie": cookieFor("", 0) } });
  }

  if (pathname === "/api/library/content" && request.method === "GET") {
    if (!(await hasValidSession(request, env.COOKIE_SECRET))) return json({ ok: false, error: "認証が必要です。" }, { status: 401 });
    return json({ ok: true, markdown: env.SKILL_MARKDOWN });
  }

  if (pathname === "/api/library/download" && request.method === "GET") {
    if (!(await hasValidSession(request, env.COOKIE_SECRET))) return json({ ok: false, error: "認証が必要です。" }, { status: 401 });
    return new Response(env.SKILL_MARKDOWN, {
      headers: {
        "Cache-Control": "no-store",
        "Content-Disposition": 'attachment; filename="SKILL.md"',
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });
  }

  return json({ ok: false, error: "見つかりません。" }, { status: 404 });
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    try {
      const response = url.pathname.startsWith("/api/")
        ? await handleApi(request, env, url.pathname)
        : await env.ASSETS.fetch(request);
      return withSecurityHeaders(response);
    } catch (error) {
      console.error(JSON.stringify({ message: "request failed", path: url.pathname, error: error instanceof Error ? error.message : String(error) }));
      return withSecurityHeaders(json({ ok: false, error: "一時的な問題が発生しました。" }, { status: 500 }));
    }
  },
};
