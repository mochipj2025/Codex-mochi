# Codexの教科書 Web版

もちもちのCodex勉強会教材サイトです。Cloudflare Workers + Static Assets で動作します。

## セットアップ

```sh
npm install
npm run dev
```

ローカルでスキル図書館まで確認する場合は、Git管理対象外の `.dev.vars` に次の値を設定します。

```dotenv
SKILL_LIBRARY_PASSPHRASE=ローカル確認用の合言葉
SKILL_MARKDOWN=ローカル確認用のSKILL.md本文
COOKIE_SECRET=十分に長いランダム値
```

## デプロイ

本番の秘密変数を Cloudflare に登録してからデプロイします。値をコマンド引数やリポジトリへ書かないでください。

```sh
npx wrangler secret put SKILL_LIBRARY_PASSPHRASE
npx wrangler secret put SKILL_MARKDOWN
npx wrangler secret put COOKIE_SECRET
npm run deploy
```

秘密変数が未設定のとき、公開ページは表示されますがスキル図書館は安全に `503` を返し、保護本文を表示しません。

## 検証

```sh
npm run check
npm run deploy:dry
```
