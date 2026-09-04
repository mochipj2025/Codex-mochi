export const workshopFolder = "Codex-workshop";

export const setupPrompts = [
  {
    id: "prepare",
    title: "最初に送る｜作業場所を整える",
    hint: "Codex-workshopをプロジェクトに指定してから、Codexの入力欄に貼り付けます。",
    text: `これからCodexの勉強会で、背景透過のステッカーを作ります。
私は初心者です。説明は日本語で、短くわかりやすくお願いします。

まず、現在の作業フォルダの名前と保存場所を確認してください。
作業フォルダが「Codex-workshop」ではない場合は、ファイルを作らずに教えてください。

「Codex-workshop」で作業できる場合だけ、次の準備をしてください。
1. このフォルダの中に「references」「prompts」「outputs」を作る。
2. README.mdに、勉強会の目的と各フォルダの使い方を日本語で書く。
3. 作成したものと保存場所を一覧で教える。

referencesは参考画像、promptsは依頼文、outputsは完成品の保存先です。
同じ名前のフォルダやファイルがある場合は、削除や上書きをせず、状況を教えてください。
この作業フォルダ以外は変更しないでください。
ソフトの追加インストール、外部への送信・公開、GitHubへの接続はまだ行わないでください。
権限が足りない場合は、必要な操作と理由を説明して確認を待ってください。
今回は準備だけです。画像生成はまだ始めないでください。`,
  },
  {
    id: "help",
    title: "困ったとき｜今の状態を確認する",
    hint: "フォルダを選べたかわからない、保存先が見つからないときに使います。",
    text: `Codexの初期設定で困っています。日本語で案内してください。
今の作業フォルダの名前と保存場所を確認し、「Codex-workshop」か教えてください。
この作業フォルダの直下だけを確認し、references・prompts・outputs・README.mdがあるか一覧にしてください。
ファイルの作成・変更・削除、追加インストールはしないでください。
確認できないことは推測せず、私が次に確認する画面や操作を1つずつ教えてください。`,
  },
  {
    id: "resume",
    title: "次回から｜同じプロジェクトで再開する",
    hint: "次回は新しいフォルダを作らず、同じプロジェクトを開いて送ります。",
    text: `このプロジェクトで勉強会の作業を再開します。
現在の作業フォルダが「Codex-workshop」か確認してください。
違う場合は、そのことだけ教えて作業を止めてください。
合っていればREADME.mdを読み、references・prompts・outputsの中のファイル名を確認してください。
既存のファイルは変更・削除せず、今あるものと続きの候補を短く教えてください。
実際の制作は、私が今回の依頼を送ってから始めてください。`,
  },
] as const;

export const setupHandout = `Codexの初期設定ガイド｜もちもちのCodex勉強会
確認日：2026年9月4日
図解付きWeb版：https://codex-mochi.mochilabo.workers.dev/setup

ゴール：専用フォルダをCodexに指定し、最初の依頼を送れる状態にする。
この例はパソコンのデスクトップアプリで進めます。画面名はバージョンにより異なります。

【3つの言葉】
フォルダ＝パソコン上のファイルの置き場所
プロジェクト＝関連する作業をまとめ、フォルダを指定する場所
チャット／タスク＝1つの目的についてCodexに依頼する会話

【0 アプリの準備】
公式：https://chatgpt.com/download/
インストールしてChatGPTアカウントでログインし、Codexを開きます。
MacはAppleメニュー→このMacについてでチップを確認。Apple MシリーズなどはApple Silicon、Intelと表示されればIntel Macを選びます。

【1 専用フォルダを作る】
Windows：エクスプローラーで「ドキュメント」を開き、何もない場所を右クリック→新規作成→フォルダー。
Mac：Finderで「書類」を開き、ファイル→新規フォルダ。
名前は「Codex-workshop」。既にある場合は中身を確認し、削除しないでください。
ドキュメント／書類全体ではなく、この専用フォルダだけをCodexに指定します。

【2 プロジェクトにフォルダを指定】
デスクトップアプリのプロジェクト追加操作から、ローカルのフォルダを使うプロジェクトを作成し、Codex-workshopを選択します。
既存のプロジェクトならメニューのEdit project（プロジェクトを編集）→Add folder（フォルダを追加）で指定できます。
ブラウザ版ChatGPTのプロジェクトと、PCのフォルダを使うローカルプロジェクトは別です。
最初はフォルダを1つだけ指定します。この練習のためにGitHubへ公開する必要はありません。

【3 プロジェクトから新しいチャットを開く】
作ったプロジェクトを選び、新しいチャット／New chat（表示によってはタスク）を開始します。
作業場所がCodex-workshopか確認します。名前の例：第1回・ステッカー準備。

【4 最初の依頼を送る】
以下の「最初に送る」をコピーしてCodexの入力欄へ貼り付け、内容を確認して送信します。
許可の確認が出たら、対象と操作を読んで判断します。わからない許可はそのまま承認せず講師に確認してください。
依頼文だけで安全が保証されるわけではありません。アプリ側の権限設定も確認します。

【準備後のフォルダ構成】
Codex-workshop/
  references/  参考画像
  prompts/     依頼文
  outputs/     完成品
  README.md    作業メモ

${setupPrompts.map((prompt) => `【${prompt.title}】\n${prompt.text}`).join("\n\n")}

【できたら】
Codexの返答だけでなく、Finder／エクスプローラーでも保存場所を確認します。
準備が済んだら講義ページまたはプロンプトメーカーへ進みます。
https://codex-mochi.mochilabo.workers.dev/live
https://codex-mochi.mochilabo.workers.dev/prompt-maker#demo-prompts

【参考にした公式案内】
https://developers.openai.com/codex/quickstart
https://learn.chatgpt.com/docs/projects
https://support.apple.com/ja-jp/116943
`;
