import type { Metadata } from "next";
import { cookies } from "next/headers";
import { SiteHeader } from "@/components/SiteHeader";
import { CopyButton } from "@/components/CopyButton";
import { authToken, getSkillMarkdown } from "@/lib/content";

export const metadata: Metadata = {
  title: "スキル図書館",
  description: "勉強会参加者向けのSKILL.md図書館です。",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function Page({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const passphrase = process.env.SKILL_LIBRARY_PASSPHRASE ?? "";
  const cookieSecret = process.env.COOKIE_SECRET ?? "";
  const skillMarkdown = getSkillMarkdown();
  const configured = Boolean(passphrase && cookieSecret && skillMarkdown);
  const jar = await cookies();
  const open = configured && jar.get("skill_access")?.value === await authToken(passphrase, cookieSecret);
  const query = await searchParams;

  return <><SiteHeader/><main id="main">{!open?<section className="gate"><p className="eyebrow">SKILL LIBRARY · LOCKED</p><h1>合言葉をどうぞ。</h1><p>勉強会でお伝えした合言葉を入力すると、配布用スキルを読んだりコピーしたりできます。</p><form action="/api/unlock" method="post"><label htmlFor="passphrase">合言葉</label><input id="passphrase" name="passphrase" type="password" autoComplete="current-password" required/>{query.error&&<p role="alert">合言葉が違うようです。もう一度お試しください。</p>}<button type="submit">図書館を開く</button></form></section>:<><header className="page-head"><p className="eyebrow">SKILL LIBRARY · OPEN</p><h1>絵本風キャラクター<br/>連続生成スキル</h1><p>そのままコピーするか、SKILL.mdとしてダウンロードできます。</p></header><div className="content-grid"><article className="prose"><div className="skill-actions"><CopyButton text={skillMarkdown} label="全文をコピー"/><a className="button" href="/api/skill-download">SKILL.mdを保存</a></div><pre>{skillMarkdown}</pre></article><aside className="side-card"><strong>使い方</strong><p>コピーした内容をSKILL.mdという名前で保存してください。</p><form action="/api/lock" method="post"><button className="button" type="submit">図書館を閉じる</button></form></aside></div></>}</main></>;
}
