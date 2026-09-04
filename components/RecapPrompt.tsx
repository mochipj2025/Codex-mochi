"use client";

import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";

export function RecapPrompt({ title, text }: { title: string; text: string }) {
  const field = useRef<HTMLTextAreaElement>(null);
  const [status, setStatus] = useState("");
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
      setStatus("コピーしました。Codexに貼り付け、内容を確認して送信してください。");
    } catch {
      field.current?.focus();
      field.current?.select();
      setStatus("本文を選択しました。Macは⌘C、WindowsはCtrl+Cでコピーしてください。");
    }
  }
  return <div className="recap-prompt">
    <div className="recap-prompt-head"><strong>{title}</strong><Button type="button" onClick={copy} aria-label={`${title}をコピー`}>コピーする</Button></div>
    <textarea ref={field} aria-label={`${title}の本文`} value={text} readOnly spellCheck={false} rows={Math.min(text.split("\n").length + 1, 17)}/>
    <pre className="recap-print-text">{text}</pre>
    <p role="status">{status || "ボタンを押すだけでは生成は始まりません。"}</p>
  </div>;
}
