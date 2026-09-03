import { cookies } from "next/headers";
import { authToken, getSkillMarkdown } from "@/lib/content";

export async function GET() {
  const passphrase = process.env.SKILL_LIBRARY_PASSPHRASE ?? "";
  const cookieSecret = process.env.COOKIE_SECRET ?? "";
  const skillMarkdown = getSkillMarkdown();
  if (!passphrase || !cookieSecret || !skillMarkdown) {
    return new Response("スキル図書館は準備中です。", { status: 503 });
  }
  const jar = await cookies();
  if (jar.get("skill_access")?.value !== await authToken(passphrase, cookieSecret)) {
    return new Response("合言葉が必要です。", { status: 401 });
  }
  return new Response(skillMarkdown, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Content-Disposition": 'attachment; filename="SKILL.md"',
    },
  });
}
