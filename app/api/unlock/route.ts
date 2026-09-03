import { NextResponse } from "next/server";
import { authToken, getSkillMarkdown, safeSecretEqual } from "@/lib/content";

export async function POST(request: Request) {
  const form = await request.formData();
  const entered = String(form.get("passphrase") ?? "").normalize("NFKC");
  const passphrase = (process.env.SKILL_LIBRARY_PASSPHRASE ?? "").normalize("NFKC");
  const cookieSecret = process.env.COOKIE_SECRET ?? "";
  if (!passphrase || !cookieSecret || !getSkillMarkdown()) {
    return new Response("スキル図書館は準備中です。", { status: 503 });
  }
  if (!entered || !(await safeSecretEqual(entered, passphrase))) {
    return NextResponse.redirect(new URL("/skills?error=1", request.url), 303);
  }
  const response = NextResponse.redirect(new URL("/skills", request.url), 303);
  response.cookies.set("skill_access", await authToken(passphrase, cookieSecret), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return response;
}
