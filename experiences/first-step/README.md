# Codexの教科書：コピーして、そのまま使う入口

「学習よりすぐ使える、簡単、迷わない」を優先する初心者向けの見本です。

- [実装仕様・決定事項](docs/SPEC.md)
- [Claudeへそのまま渡せる依頼文](docs/HANDOFF.md)
- [アイコンの見本](icons/preview.png)

既存GitHub mochipj2025/Codex-mochi の experiences/first-step として管理します。

## 動かす

このディレクトリで npm run dev を実行し、http://127.0.0.1:4173 を開きます。
npm test で振る舞いと素材参照を確認し、npm run build で dist へ静的配布物を作成します。追加npm依存はありません。

リポジトリルートでは npm run guide:dev / guide:test / guide:build が同じ操作です。

## 素材

images/mascot が背景透過済み3点、icons がサイズ変換版。
python scripts/build-icons.py（Pillow必要）でアイコンを再作成できます。
images/mochisura-reference.png は設定資料で、背景は透過していません。

## 配置

本人限定の見本URLはローカルの引き継ぎメモに保管しています。

既存公開サイト：https://codex-mochi.mochilabo.workers.dev

既存公開トップへの移植は未実施です。ビルドは公開用ファイルだけをコピーし、仕様書やGit情報は配布物に含めません。本人限定の配置設定と認証情報は、この公開リポジトリに含めません。
