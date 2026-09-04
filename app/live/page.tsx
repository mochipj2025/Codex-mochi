import type {Metadata} from "next";
import Link from "next/link";
import {SiteHeader} from "@/components/SiteHeader";
import "./live.css";
import "./download.css";
export const metadata:Metadata={title:"第1回 講義モード",description:"第1回Codex勉強会のスライドと実演用ツールを一画面にまとめた講義ページです。",robots:{index:false,follow:false}};
export default function Page() {
  return <><SiteHeader/><main id="main" className="live-shell">
    <header className="live-head"><div><p className="eyebrow">LESSON 01 · LIVE MODE</p><h1>第1回｜背景透過ステッカーを5枚つくる</h1></div><div className="live-status"><span aria-hidden="true"></span>講義用ページ</div></header>
    <section className="lecture-setup" aria-labelledby="codex-download-title">
      <div>
        <p className="eyebrow">参加前の準備</p>
        <h2 id="codex-download-title">Codexを使うアプリをダウンロード</h2>
        <p>公式サイトで、お使いのパソコンに合うChatGPTデスクトップアプリを選んでください。インストール後、ChatGPTアカウントでログインしてCodexを開きます。</p>
      </div>
      <div className="lecture-setup-actions">
        <Link className="button lecture-download" href="/setup">初期設定ガイドを見る →<small>フォルダ・プロジェクトの図解＆コピペ</small></Link>
        <a className="lecture-download-link" href="https://chatgpt.com/download/" target="_blank" rel="noopener noreferrer">公式ダウンロードページへ <span aria-hidden="true">↗</span><small>別タブで開きます</small></a>
      </div>
    </section>
    <section className="slide-stage" aria-label="講義スライド"><iframe src="/downloads/Codex勉強会_第1回_配布用.pdf#view=FitH&toolbar=1" title="Codex勉強会 第1回の講義スライド"/></section>
    <nav className="lecture-dock" aria-label="講義中に使う資料"><a className="lecture-primary" href="/downloads/Codex勉強会_第1回_配布用.pdf" target="_blank" rel="noreferrer"><small>01</small><strong>スライドを全画面で開く</strong><span>↗</span></a><Link href="/prompt-maker"><small>02</small><strong>プロンプトメーカー</strong><span>→</span></Link><Link href="/prompt-maker#demo-prompts"><small>03</small><strong>実演プロンプト</strong><span>→</span></Link><Link href="/lessons/01"><small>04</small><strong>教材を確認</strong><span>→</span></Link><a href="/downloads/03_失敗時の予備画像5枚.zip"><small>05</small><strong>予備画像</strong><span>↓</span></a></nav>
    <Link className="lecture-recap" href="/recap"><div><strong>3分で復習｜実演のまとめ</strong><p>5枚以上の連続生成・固定する条件・失敗時の直し方。スライドとは別に、要点だけ確認できます。</p></div><span aria-hidden="true">→</span></Link>
    <section className="lecture-note"><strong>進行メモ</strong><ol><li>スライドでゴールを共有</li><li>プロンプトメーカーで条件を組み立てる</li><li>Codexへ貼り付けて1枚ずつ実演</li><li>失敗時は予備画像に切り替える</li><li>最後に教材とスキル図書館を案内</li></ol></section>
  </main></>;
}
