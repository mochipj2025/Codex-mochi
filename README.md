# Codexの教科書 Web版

もちもちのCodex勉強会で使う教材サイトです。Cloudflare Workers上で動作します。

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
