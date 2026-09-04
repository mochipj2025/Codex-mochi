import type { Metadata } from "next";
import Link from "next/link";
import { SiteHeader } from "@/components/SiteHeader";
import { RecapPrompt } from "@/components/RecapPrompt";
import { continuousOpening, continuousPrompt, resumePrompt } from "@/lib/lesson-recap";
import "./recap.css";

export const metadata: Metadata = {
  title: "3分で復習｜連続生成の実演まとめ",
  description: "5枚以上を連続生成するときの指示の順番、キャラクターの統一、背景透過、修正・再開のコツを短く確認。コピーできるプロンプト付き。",
};

export default function Page() {
  return <><SiteHeader/><main id="main" className="recap-shell">
    <header className="recap-head"><p className="eyebrow">LESSON 01 · QUICK RECAP</p><h1>3分で復習。<br/>連続生成の実演まとめ</h1><p>講義スライドとは別の、作業中に見返す短いメモ。<br/>背景透過ステッカーづくりで、覚えておきたいポイントだけ。</p><small>もちもちのCodex勉強会 · 2026年9月4日</small></header>
    <article>
      <section className="recap-key" aria-labelledby="recap-key-title"><span className="recap-number">01</span><div><p className="recap-label">いちばん大事</p><h2 id="recap-key-title">5枚以上の連続生成は、<br/>プロンプトのいちばん最初に。</h2><p>最初に<strong>「合計何枚」「1枚ずつ」「続けてほしい」</strong>を宣言し、その後に絵柄やポーズを書きます。「5枚以上」だけでなく、5枚・8枚など必要な総枚数を決めましょう。</p><RecapPrompt title="先頭に置く指示（5枚の例）" text={continuousOpening}/><p className="recap-note">「1枚ずつ」は出力の単位、「連続で」は進め方。両方を書くのがコツです。枚数を変えるときは、本文中の枚数とポーズの数も揃えます。</p></div></section>
      <div className="recap-points">
        <section><span className="recap-number">02</span><h2>同じキャラにする条件を固定</h2><p>顔・体型・頭身・配色・線・質感を揃える。1枚目を基準にし、2枚目以降も参照します。別のチャットで続けるなら、基準画像を添付しましょう。</p><p className="recap-note">初めての絵柄なら、まず1枚だけ試して確認し、気に入った画像を基準に連続生成へ進むと直しやすくなります。</p></section>
        <section><span className="recap-number">03</span><h2>変えるのはポーズ・表情・小物</h2><p>1枚ごとの変更点を番号付きで指定。「同じ感じで」だけで済ませず、<strong>変えない条件と今回の変更点</strong>を分けて伝えます。</p><p className="recap-mini-example">例：顔と絵柄はそのまま。今回は「片手で小さく手を振る」だけ変更。</p></section>
        <section><span className="recap-number">04</span><h2>「透過っぽい背景」で終わらせない</h2><p><strong>完全に透明な背景・PNG・全身・透明な余白</strong>まで指定。白背景や影、市松模様そのものが描かれていないか、保存した画像でも確認します。</p><p className="recap-note">白・黒・色付きの背景に重ねると、背景の残りや輪郭の縁取りを見つけやすくなります。</p></section>
        <section><span className="recap-number">05</span><h2>失敗した条件だけを直す</h2><p>顔が変わったら顔、背景が残ったら背景を指定して修正。うまくできた部分まで一度に変えず、成功したプロンプトは<strong>prompts</strong>、完成品は<strong>outputs</strong>へ残しましょう。</p><p className="recap-note">これは初期設定ガイドで作った保存先の例です。保存できたか、実際のフォルダでも確認してください。</p></section>
      </div>
      <section className="recap-section" id="copy-example"><h2>そのまま使うなら、この例文</h2><p>現在の作業フォルダを確認してから使ってください。最初の行で「合計5枚の連続生成」を伝えています。8枚なら、枚数の指定と変更点の一覧を8枚分に直します。</p><details className="recap-details"><summary>5枚連続生成のプロンプト全文を開く</summary><RecapPrompt title="5枚連続生成のプロンプト全文" text={continuousPrompt}/></details></section>
      <section className="recap-section" id="quick-fixes"><h2>こんなときは、このひと言</h2><dl className="recap-fixes"><div><dt>5体が1枚に並んだ</dt><dd>「1枚に1体、別々の画像ファイルで。コラージュにしないでください」</dd></div><div><dt>別の顔になった</dt><dd>「基準画像の顔・体型・配色を保ち、ポーズだけを変更してください」</dd></div><div><dt>背景が残った</dt><dd>「白や市松模様ではなく、本当に透明な背景のPNGにしてください」</dd></div><div><dt>体が切れた</dt><dd>「耳・手足まで全身を枠内に収め、周囲に透明な余白を残してください」</dd></div></dl></section>
      <section className="recap-section" id="resume"><h2>途中で止まったら、残りだけ再開</h2><p>まず、完成した枚数と止まった理由を確認。「もう一度全部」ではなく、<strong>未完成の番号だけ</strong>を依頼します。</p><details className="recap-details"><summary>途中から再開する依頼文を開く</summary><RecapPrompt title="残りだけ再開する依頼文" text={resumePrompt}/></details><p className="recap-caution">連続生成の指定は、最後までの実行を保証するものではありません。利用上限、権限確認、エラーなどで止まることがあります。必要な確認は省略せず、上限に達した場合は再開できる状態になってから続けましょう。</p></section>
      <p className="recap-closing">枚数と進め方を先頭に。<br/>固定条件を揃えて、変更点だけを伝える。</p>
    </article>
    <nav className="recap-links" aria-label="関連する教材"><Link className="button" href="/live">講義モードへ →</Link><Link className="button" href="/prompt-maker#demo-prompts">実演プロンプトへ →</Link><Link className="button" href="/setup">初期設定ガイド →</Link><Link className="button" href="/lessons/01">詳しい教材 →</Link></nav>
    <aside className="recap-sources"><p>「枚数と連続生成の指示を先頭に置く」は、この勉強会での伝え方のコツです。固定条件・変更点の分け方や、少しずつ修正する考え方は、<a href="https://developers.openai.com/cookbook/examples/multimodal/image-gen-models-prompting-guide#2-prompting-fundamentals" target="_blank" rel="noopener noreferrer">OpenAI公式の画像プロンプトガイド ↗</a>も参考にしています。</p></aside>
  </main></>;
}
