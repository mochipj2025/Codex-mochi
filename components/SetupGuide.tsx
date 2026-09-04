"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Folder, MessageSquare, PanelsTopLeft, ArrowRight, Check, Download, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { setupHandout, setupPrompts, workshopFolder } from "@/lib/setup-guide";

function CopyBlock({ id, title, text, hint }: { id: string; title: string; text: string; hint: string }) {
  const field = useRef<HTMLTextAreaElement>(null);
  const [message, setMessage] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setMessage(id === "folder-name" ? "コピーしました。新しいフォルダの名前に貼り付けてください。" : "コピーしました。Codexの入力欄に貼り付けてください。");
    } catch {
      field.current?.focus();
      field.current?.select();
      setMessage("自動コピーができないため本文を選択しました。Macは⌘C、WindowsはCtrl+Cでコピーしてください。");
    }
  }
  return <section className="setup-copy" aria-labelledby={`${id}-title`}>
    <div className="setup-copy-head"><h3 id={`${id}-title`}>{title}</h3><Button type="button" onClick={copy} className="setup-copy-button" aria-label={`${title}をコピー`}>コピーする</Button></div>
    <p className="setup-copy-hint">{hint}</p>
    <textarea ref={field} aria-label={`${title}の本文`} readOnly value={text} rows={Math.min(text.split("\n").length + 1, 15)} spellCheck={false}/>
    <pre className="setup-print-text">{text}</pre>
    <p className="setup-copy-status" role="status">{message || (id === "folder-name" ? "フォルダ名は半角の英字とハイフンです。" : "この依頼文は編集せず、そのまま使えます。")}</p>
  </section>;
}

export function SetupGuide() {
  const [downloadError, setDownloadError] = useState("");
  function download() {
    try {
      const url = URL.createObjectURL(new Blob(["\uFEFF", setupHandout], { type: "text/plain;charset=utf-8" }));
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = "Codex_初期設定ガイド.txt";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
      setDownloadError("");
    } catch {
      setDownloadError("保存できませんでした。「図解ごと印刷／PDF保存」をお使いください。");
    }
  }
  return <>
    <header className="setup-head">
      <p className="eyebrow">START HERE · はじめての方へ</p>
      <h1>Codexの初期設定</h1>
      <p>専用フォルダをつくって、プロジェクトにつなぐ。<br/>最初の依頼は、このページからコピーできます。</p>
      <div className="setup-tools"><Button type="button" onClick={() => window.print()} className="button"><Printer aria-hidden="true"/>図解ごと印刷／PDF保存</Button><Button type="button" onClick={download} className="button"><Download aria-hidden="true"/>手順・依頼文を保存（TXT）</Button></div>
      {downloadError && <p role="alert">{downloadError}</p>}
      <p className="setup-meta">デスクトップアプリ向け · 確認日：2026年9月4日</p>
    </header>

    <nav className="setup-route" aria-label="初期設定の順番">
      {[['create-folder', '01', 'フォルダを作る'], ['create-project', '02', 'プロジェクトに指定'], ['start-chat', '03', 'チャットを開く'], ['first-request', '04', '依頼文をコピペ']].map(([id, num, label]) => <a key={id} href={`#${id}`}><span>{num}</span><strong>{label}</strong><ArrowRight aria-hidden="true"/></a>)}
    </nav>

    <section className="setup-map" aria-labelledby="setup-map-title">
      <h2 id="setup-map-title">まずは、3つの言葉だけ。</h2>
      <div className="setup-map-grid">
        <div><Folder aria-hidden="true"/><h3>フォルダ</h3><p>パソコン上の<br/><strong>ファイルの置き場所</strong></p><small>例：Codex-workshop</small></div>
        <span className="setup-map-arrow" aria-hidden="true">→</span>
        <div><PanelsTopLeft aria-hidden="true"/><h3>プロジェクト</h3><p>関連する作業をまとめる<br/><strong>Codex側の作業場所</strong></p><small>使うフォルダを指定する</small></div>
        <span className="setup-map-arrow" aria-hidden="true">→</span>
        <div><MessageSquare aria-hidden="true"/><h3>チャット／タスク</h3><p>1つの目的について<br/><strong>依頼する会話</strong></p><small>例：第1回・ステッカー準備</small></div>
      </div>
      <p className="setup-caption">フォルダをプロジェクトに指定し、その中でチャットを始めます。<br/>※仕組みを説明する図です。実際のアプリ画面ではありません。</p>
    </section>

    <details className="setup-preflight"><summary>アプリのインストール・ログインがまだの方はこちら</summary>
      <p><a href="https://chatgpt.com/download/" target="_blank" rel="noopener noreferrer">公式ダウンロードページ ↗</a>で、お使いのパソコンに合うアプリを選びます。インストール後、ChatGPTアカウントでログインしてCodexを開いてください。</p>
      <p>Macは左上の  →「このMacについて」を確認。<strong>Apple MシリーズなどならApple Silicon、Intelと表示されればIntel Mac</strong>を選びます。</p>
      <p>アプリによってはChatGPTの切り替えメニューからCodexを選びます。表示名や位置はバージョンによって変わるため、迷ったら<a href="https://developers.openai.com/codex/quickstart" target="_blank" rel="noopener noreferrer">公式の初期設定手順 ↗</a>も確認してください。</p>
    </details>

    <section id="create-folder" className="setup-step">
      <div className="setup-step-heading"><span>01</span><div><p>パソコンで操作</p><h2>勉強会専用のフォルダを作る</h2></div></div>
      <p>まずは「ドキュメント」または「書類」の中に、空の作業フォルダを1つ作りましょう。<strong>フォルダ名は下からコピーできます。</strong></p>
      <Tabs defaultValue="mac" className="setup-os">
        <TabsList aria-label="お使いのパソコン"><TabsTrigger value="mac">Mac</TabsTrigger><TabsTrigger value="windows">Windows</TabsTrigger></TabsList>
        <TabsContent value="mac"><h3>Macでフォルダを作る</h3><ol><li><strong>Finder</strong>を開く。</li><li>サイドバーなどから<strong>「書類」</strong>を開く。</li><li>メニューの<strong>「ファイル」→「新規フォルダ」</strong>を選ぶ。</li><li>名前を<strong>Codex-workshop</strong>にする。</li></ol><p className="setup-location">保存場所の例：書類 ／ Codex-workshop</p></TabsContent>
        <TabsContent value="windows"><h3>Windowsでフォルダを作る</h3><ol><li><strong>エクスプローラー</strong>を開く。</li><li><strong>「ドキュメント」</strong>を開く。</li><li>何もない場所を右クリックし、<strong>「新規作成」→「フォルダー」</strong>を選ぶ。</li><li>名前を<strong>Codex-workshop</strong>にする。</li></ol><p className="setup-location">保存場所の例：ドキュメント ／ Codex-workshop</p></TabsContent>
      </Tabs>
      <div className="setup-print-only"><p>Mac：Finder → 書類 → ファイル → 新規フォルダ。</p><p>Windows：エクスプローラー → ドキュメント → 何もない場所を右クリック → 新規作成 → フォルダー。</p></div>
      <CopyBlock id="folder-name" title="フォルダ名" text={workshopFolder} hint="新しいフォルダの名前を入力する場所に貼り付けます。"/>
      <p className="setup-tip"><strong>大切：</strong>すでに同名のフォルダがある場合は中身を確認し、消さないでください。個人情報や仕事の大事なファイルは、この練習用フォルダには入れません。</p>
    </section>

    <section id="create-project" className="setup-step">
      <div className="setup-step-heading"><span>02</span><div><p>Codexで操作</p><h2>フォルダをプロジェクトに指定する</h2></div></div>
      <ol><li>デスクトップアプリで、<strong>プロジェクトを追加する操作</strong>を選びます。</li><li><strong>ローカルのフォルダを使うプロジェクト</strong>として、さっき作った<strong>Codex-workshop</strong>を選びます。</li><li>選択したフォルダの名前・場所を確認して開きます。最初は<strong>このフォルダ1つだけ</strong>で大丈夫です。</li></ol>
      <p className="setup-tip">既存のプロジェクトに指定する場合は、プロジェクトのメニュー → <strong>Edit project（プロジェクトを編集）→ Add folder（フォルダを追加）</strong>。画面名はバージョンにより異なります。<a href="https://learn.chatgpt.com/docs/projects#use-local-projects-for-folders-and-codebases" target="_blank" rel="noopener noreferrer">公式案内 ↗</a></p>
      <figure className="setup-folder-diagram">
        <div className="setup-folder-parent"><Folder aria-hidden="true"/><strong>書類 / ドキュメント</strong><span>ここ全体は指定しない</span></div>
        <div className="setup-folder-selected"><Folder aria-hidden="true"/><strong>Codex-workshop</strong><span><Check aria-hidden="true"/> このフォルダだけ選ぶ</span></div>
        <figcaption>作業に必要なフォルダだけを指定すると、保存先がわかりやすくなります。</figcaption>
      </figure>
      <p><strong>ブラウザ版ChatGPTの「プロジェクト」とは別です。</strong>今回は、PCのフォルダを使えるデスクトップ側のローカルプロジェクトで進めます。この練習のためにGitHubへ公開する必要はありません。</p>
    </section>

    <section id="start-chat" className="setup-step">
      <div className="setup-step-heading"><span>03</span><div><p>プロジェクトの中で操作</p><h2>最初のチャットを開く</h2></div></div>
      <ol><li>作ったプロジェクトを選びます。</li><li><strong>新しいチャット／New chat</strong>を始めます。表示によっては「タスク」と呼ばれます。</li><li>作業場所が<strong>Codex-workshop</strong>になっているか確認します。</li></ol>
      <figure className="setup-workspace-diagram">
        <div className="setup-workspace-sidebar"><span>プロジェクト</span><strong><Folder aria-hidden="true"/> Codex-workshop</strong><span>└ 第1回・ステッカー準備</span></div>
        <div className="setup-workspace-chat"><span>このプロジェクトの新しいチャット</span><div>ここに依頼文を貼り付ける <span aria-hidden="true">↗</span></div><small>作業場所：Codex-workshop</small></div>
        <figcaption>位置関係を示す模式図です。実際のボタンの位置・名前はアプリで確認してください。</figcaption>
      </figure>
      <p>会話の名前は「第1回・ステッカー準備」など、後で見つけやすいものに。次回も同じプロジェクトを開けば、同じファイルを使って続けられます。</p>
    </section>

    <section id="first-request" className="setup-step">
      <div className="setup-step-heading"><span>04</span><div><p>コピー → Codexに貼り付け → 内容を確認して送信</p><h2>最初の依頼を送ってみよう</h2></div></div>
      <p>この依頼では、保存先のフォルダと作業メモだけを作ります。<strong>画像生成はまだ始めません。</strong></p>
      <CopyBlock {...setupPrompts[0]}/>
      <p className="setup-paste-help">貼り付け：<strong>Macは⌘V ／ WindowsはCtrl+V</strong>。このページのボタンを押すだけでは、Codexに送信されません。</p>
      <div className="setup-safety"><h3>「許可しますか？」が出たら</h3><p>対象がこの作業フォルダか、何をする許可かを読んで判断してください。全ファイルへのアクセスや外部送信など、わからない許可はそのまま承認せず講師に確認しましょう。</p><p>依頼文だけで安全が保証されるわけではありません。アプリ側の権限設定も確認してください。</p></div>
      <figure className="setup-result"><figcaption>準備が終わった後のフォルダ構成（例）</figcaption><pre>{`Codex-workshop/
├─ references/  ← 参考画像
├─ prompts/     ← 依頼文
├─ outputs/     ← 完成品
└─ README.md    ← 作業メモ`}</pre></figure>
      <p className="setup-tip"><strong>できたか確認：</strong>Codexの返答だけでなく、Finder／エクスプローラーでも3つのフォルダとREADME.mdを確認してください。</p>
    </section>

    <section className="setup-step" id="setup-help"><h2>困ったとき・次回のためのコピペ</h2><p>今の状態の確認や再開にも使えます。初回は上の依頼文だけで大丈夫です。</p>{setupPrompts.slice(1).map((prompt) => <CopyBlock key={prompt.id} {...prompt}/>)}</section>
    <section className="setup-finish"><Check aria-hidden="true"/><div><h2>保存場所ができたら、準備完了。</h2><p>次は講義に戻って、つくりたいものの依頼文を選びましょう。</p><div className="setup-tools"><Link className="button" href="/live">講義ページへ戻る →</Link><Link className="button" href="/prompt-maker#demo-prompts">実演プロンプトへ →</Link></div></div></section>
    <aside className="setup-sources"><h2>参考にした公式案内</h2><p>この教材のフォルダ名・保存先の構成・依頼文は、勉強会用の例です。アプリの表示や利用できる機能はバージョン・アカウントによって異なります。</p><ul><li><a href="https://developers.openai.com/codex/quickstart" target="_blank" rel="noopener noreferrer">OpenAI：インストールと最初の作業 ↗</a></li><li><a href="https://learn.chatgpt.com/docs/projects" target="_blank" rel="noopener noreferrer">OpenAI：プロジェクトとローカルフォルダ ↗</a></li><li><a href="https://support.apple.com/ja-jp/116943" target="_blank" rel="noopener noreferrer">Apple：Apple Silicon／Intelの確認 ↗</a></li></ul></aside>
  </>;
}
