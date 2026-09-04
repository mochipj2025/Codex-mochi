# Codexの教科書 Web版

もちもちのCodex勉強会で使う教材サイトです。Cloudflare Workers上で動作します。

公開表紙の正本もこのリポジトリに置きます。GPT Sitesは今後の公開・確認には使いません。

## ローカル開発

```sh
npm install
npm run dev
```

## 検証

```sh
npm run build
npm test
npm run deploy:dry
```

## デプロイ

保護されたスキル図書館には、Cloudflareの秘密変数が必要です。値をリポジトリへコミットしないでください。

```sh
npx wrangler secret put SKILL_LIBRARY_PASSPHRASE
npx wrangler secret put SKILL_MARKDOWN
npx wrangler secret put COOKIE_SECRET
npm run deploy
```

公開URL: <https://codex-mochi.mochilabo.workers.dev>

## コピペ中心の新しい入口（Claude引き継ぎ）

[仕様書](experiences/first-step/docs/SPEC.md) と [Claudeへ渡す依頼文](experiences/first-step/docs/HANDOFF.md) を用意しています。

見本・透過キャラクター3点・サイトアイコンは `experiences/first-step` で管理します。公開トップへの移植は別工程です。

```sh
npm run guide:dev
npm run guide:test
npm run guide:build
```

[アイコンの見本](experiences/first-step/icons/preview.png)

## 育つ教科書の表紙（2026-09-05）

公開層の新仕様は [表紙の仕様と引き継ぎ](docs/cover-spec-ja.md)。ソースは `index.html`、更新履歴の正本は `changelog.md` です。`npm run cover:dev` / `cover:test` / `cover:build` で確認できます。鍵と既存サイトへの統合は同仕様書の未完了事項を確認してください。

### ローカルで表紙を見る

```sh
npm run cover:dev
```

Node.js 22.13以降があれば、表紙のローカル表示には追加パッケージのインストールは不要です。ブラウザで <http://127.0.0.1:4173> を開きます。終了はターミナルで `Ctrl+C` です。

### リポジトリから表紙を公開する

`.github/workflows/publish-cover.yml` が、mainへの表紙関連の変更を検知して `changelog.md` から静的ファイルを生成し、`cover-dist` だけをGitHub Pagesへ公開します。初回だけGitHubの **Settings → Pages → Source** で **GitHub Actions** を選びます。mainへ統合する前の確認は、このドラフトPRとローカル表示を使います。
