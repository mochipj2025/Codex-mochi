import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "Codexの教科書 Web版", template: "%s｜Codexの教科書" },
  description: "作りながらCodexを学ぶ、もちもちのオンライン教材。勉強会の教材・アーカイブ・プロンプトメーカーを公開しています。",
  keywords: ["Codex", "ChatGPT", "AI勉強会", "プロンプト", "画像生成", "オンライン教材"],
  openGraph: { title: "Codexの教科書 Web版", description: "作りながら覚える、もちもちのCodex学習ノート。", type: "website", locale: "ja_JP" },
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <body className="antialiased">{children}</body>
    </html>
  );
}
