# Codexの教科書を引き継ぐ方へ

2026-09-05の最新方針は、公開層を「育つ教科書」の表紙にすることです。最初に `docs/cover-spec-ja.md` を読んでください。ルートの `index.html` と `changelog.md` が表紙の正本です。公開確認はローカル表示とGitHubのPRで行い、GPT Sitesへアップしません。鍵の統合・FAQラベルの配置には未確認事項が残っています。

今回のコピペ中心の入口は `experiences/first-step` にあります。最初に以下を読んでください。

- `experiences/first-step/docs/SPEC.md`：目的、画面、素材、実装状況、残課題。
- `experiences/first-step/docs/HANDOFF.md`：Claudeへの具体的な依頼文。

ユーザー方針は「学習よりすぐ使える、簡単、迷わない」。主な入口は用意された文章をコピーする操作です。初心者向け画面にキー操作の学習や長い準備を必須化しないでください。

リポジトリ直下は現在の公開教材サイト、first-stepは独立した静的見本です。後者の追加だけでは公開トップは変わりません。既存の教材と図書館の保護を維持してください。

作業開始時にgit statusを確認し、他の作業者の変更を上書きしないでください。入口用コマンドはguide:dev / guide:test / guide:build。本体用コマンドとは分かれています。認証情報やSubstack管理URLをソース・公開画面に含めないでください。
