import type { Metadata } from "next";
import { SiteHeader } from "@/components/SiteHeader";
import { SetupGuide } from "@/components/SetupGuide";
import "./setup.css";

export const metadata: Metadata = {
  title: "Codexの初期設定ガイド",
  description: "Mac・Windowsでのフォルダ作成から、Codexのプロジェクト設定、最初の依頼まで。図解とコピーできる依頼文付きの勉強会資料。",
};

export default function Page() {
  return <><SiteHeader/><main id="main" className="setup-shell"><SetupGuide/></main></>;
}
