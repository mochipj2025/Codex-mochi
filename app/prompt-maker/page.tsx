import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { PromptMaker } from "@/components/PromptMaker";

export const metadata: Metadata = {
  title: "1分プロンプトメーカー",
  description: "5つの選択肢から選ぶだけで、画像生成用プロンプトを約1分で作れます。",
};

export default function Page() {
  return <><SiteHeader/><main id="main"><header className="page-head prompt-page-head"><p className="eyebrow">PROMPT MAKER</p><h1>選ぶだけ。<br/>1分でプロンプト。</h1><p>文章を考えなくても大丈夫。おすすめを選んだ状態から、変えたいところだけ選べます。</p></header><PromptMaker/></main></>;
}
