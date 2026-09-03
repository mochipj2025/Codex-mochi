export const basePrompt = `色鉛筆で描いた海外ヴィンテージ絵本風の、眠そうなカピバラのゆるキャラ。
1960年代ヨーロッパの伝統的なお菓子の缶に描かれているような、少しガーリーなレトロイラスト。
暖かい茶色、くすみミント、クリーム色、落ち着いたコーラルを使用。
2頭身の丸い体型、半分閉じた眠そうな目、丸い頬、小さな口、柔らかな色鉛筆の線と紙の質感。
顔、体型、頭身、配色、線、質感を全5枚で統一してください。
背景は完全に透明。床、風景、影、光の輪、白背景、文字、枠、透かしは入れないでください。
全身を枠内に収め、周囲に十分な透明の余白を確保してください。
1回につき1枚だけ生成してください。`;

export function getSkillMarkdown() {
  return process.env.SKILL_MARKDOWN ?? "";
}

function toHex(bytes: ArrayBuffer) {
  return Array.from(new Uint8Array(bytes))
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
}

export async function safeSecretEqual(left: string, right: string) {
  const encoder = new TextEncoder();
  const [leftHash, rightHash] = await Promise.all([
    crypto.subtle.digest("SHA-256", encoder.encode(left)),
    crypto.subtle.digest("SHA-256", encoder.encode(right)),
  ]);
  const leftBytes = new Uint8Array(leftHash);
  const rightBytes = new Uint8Array(rightHash);
  let mismatch = 0;
  for (let index = 0; index < leftBytes.length; index += 1) {
    mismatch |= leftBytes[index] ^ rightBytes[index];
  }
  return mismatch === 0;
}

export async function authToken(passphrase: string, cookieSecret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(cookieSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return toHex(await crypto.subtle.sign("HMAC", key, encoder.encode(`codex-textbook:${passphrase}`)));
}
