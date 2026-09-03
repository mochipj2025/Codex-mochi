import type {Metadata} from "next"; import {SiteHeader} from "@/components/SiteHeader"; import {PromptMaker} from "@/components/PromptMaker";
export const metadata:Metadata={title:"プロンプトメーカー",description:"絵本風キャラクターを連続生成する基本プロンプトを組み立てます。"};
export default function Page(){return <><SiteHeader/><main id="main"><header className="page-head"><p className="eyebrow">PROMPT MAKER</p><h1>プロンプトを、<br/>迷わず組み立てる。</h1><p>6つの項目を書き換えると、シリーズ画像用の指示文が完成します。</p></header><PromptMaker/></main></>}
