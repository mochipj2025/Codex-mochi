"use client";

import { useState } from "react";
import "./PassphraseInput.css";

export function PassphraseInput() {
  const [visible, setVisible] = useState(false);

  return (
    <>
      <label htmlFor="passphrase">合言葉</label>
      <div className="passphrase-field">
        <input
          id="passphrase"
          name="passphrase"
          type={visible ? "text" : "password"}
          autoComplete="current-password"
          autoCapitalize="none"
          spellCheck={false}
          lang="ja"
          required
        />
        <button
          className="passphrase-toggle"
          type="button"
          aria-controls="passphrase"
          aria-label="入力した合言葉を表示"
          aria-pressed={visible}
          onClick={() => setVisible((current) => !current)}
        >
          {visible ? "非表示" : "表示"}
        </button>
      </div>
    </>
  );
}
