const menuButton = document.querySelector("[data-menu-button]");
const siteNav = document.querySelector("[data-site-nav]");

if (menuButton && siteNav) {
  menuButton.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.opacity = "0";
    document.body.append(textarea);
    textarea.select();
    document.execCommand("copy");
    textarea.remove();
  }
  const original = button.textContent;
  button.textContent = "コピーしました ✓";
  window.setTimeout(() => { button.textContent = original; }, 1800);
}

document.querySelectorAll("[data-copy-text]").forEach((button) => {
  button.addEventListener("click", () => copyText(button.dataset.copyText || "", button));
});

document.querySelectorAll("[data-copy-target]").forEach((button) => {
  button.addEventListener("click", () => {
    const target = document.querySelector(button.dataset.copyTarget);
    if (target) copyText(target.textContent || "", button);
  });
});

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

const promptForm = document.querySelector("[data-prompt-form]");
if (promptForm) {
  const output = document.querySelector("[data-prompt-output]");
  const status = document.querySelector("[data-prompt-status]");
  const presets = {
    subjectPreset: {
      capybara: { subject: "小さなカピバラ", features: "クリーム色の口元、小さな丸い耳、濃い茶色の楕円の鼻、短くて丈夫な体型", invariants: "キャラメル色の毛、焼けたオレンジ色のネッカチーフ、同じ顔・体型・画風・色" },
      cat: { subject: "ふわふわした白いねこ", features: "丸い顔、三角の小さな耳、ピンクの鼻、短い手足、ふわふわの体型", invariants: "真っ白な毛、ミント色の首輪、同じ顔・体型・画風・色" },
      shiba: { subject: "ころんとした赤柴犬", features: "丸い眉、三角耳、白い口元、短い足、ころんとした体型", invariants: "赤茶色の毛、クリーム色の口元と胸、深い青緑のバンダナ、同じ顔・体型・画風・色" },
      bird: { subject: "ミント色の小鳥", features: "丸い頭、小さなくちばし、つぶらな目、短い翼、ふっくらした体型", invariants: "ミント色の羽、クリーム色のお腹、焼けたオレンジ色の小さなくちばし、同じ顔・体型・画風・色" },
      penguin: { subject: "小さなペンギン", features: "丸い頭、白いお腹、小さなくちばし、短い翼、ずんぐりした体型", invariants: "濃い茶色の背中、白いお腹、焼けたオレンジ色のマフラー、同じ顔・体型・画風・色" },
      bear: { subject: "丸顔のこぐま", features: "丸い耳、クリーム色の口元、小さな黒い鼻、短い手足、ふっくらした体型", invariants: "はちみつ色の毛、クリーム色の口元、えんじ色の蝶ネクタイ、同じ顔・体型・画風・色" },
    },
    stylePreset: {
      retroEurope: { medium: "色鉛筆と少しワックス感のあるクレヨン", atmosphere: "1960年代ヨーロッパのレトロ絵本", palette: "クリーム、焼けたオレンジ、くすみミント、濃い茶色" },
      retroJapan: { medium: "透明水彩と細い色鉛筆", atmosphere: "昭和40年代の日本の児童書", palette: "クリーム、えんじ、からし色、深い青緑" },
      nordic: { medium: "不透明グアッシュと紙のテクスチャ", atmosphere: "1950年代北欧の子ども向けポスター", palette: "オフホワイト、くすみ青、山吹色、テラコッタ" },
      candy: { medium: "やわらかな太線のクレヨン", atmosphere: "昔のヨーロッパのお菓子缶ラベル", palette: "ミルク色、いちごピンク、淡いミント、ココア色" },
    },
    posePreset: {
      cheer: { pose: "1.手を振る 2.ジャンプして喜ぶ 3.親指を立てる 4.応援する 5.両手を上げて完成を喜ぶ", count: "5枚" },
      work: { pose: "1.メモを取る 2.パソコンに向かう 3.腕を組んで考える 4.ひらめく 5.完成して喜ぶ", count: "5枚" },
      feelings: { pose: "1.にっこり笑う 2.びっくりする 3.しょんぼりする 4.照れる 5.安心してほほえむ", count: "5枚" },
      daily: { pose: "1.おやつを食べる 2.飲み物を持つ 3.元気に歩く 4.座ってひと休み 5.手を振って帰る", count: "5枚" },
    },
  };
  const labels = {
    subject: "主役", medium: "画材", atmosphere: "時代・地域の雰囲気", palette: "配色",
    features: "顔・体型", pose: "ポーズ", invariants: "固定条件", count: "枚数",
  };
  const applyPreset = (group, key) => {
    const values = presets[group]?.[key];
    if (!values) return;
    for (const [name, value] of Object.entries(values)) {
      const field = promptForm.elements.namedItem(name);
      if (field) field.value = value;
    }
  };
  const generate = () => {
    const data = new FormData(promptForm);
    const lines = ["同じキャラクターで、背景透過ステッカーを生成してください。", ""];
    for (const [key, label] of Object.entries(labels)) {
      const value = String(data.get(key) || "").trim();
      if (value) lines.push(`${label}: ${value}`);
    }
    lines.push("", "生成方法:", "- まず1枚目だけを生成し、確認を待つ", "- 確認後、同じ会話で残りを1枚ずつ連続生成する", "- 主役の同一性と固定条件を厳密に守る", "- 各画像で変更するのは指定したポーズと表情だけ", "- 全身を入れ、ステッカーの周囲に十分な余白を取る", "- 背景は完全な透過（実際のアルファチャンネル）", "- 文字・ロゴ・透かし・余計な小物を入れない");
    output.textContent = lines.join("\n");
    status.textContent = "選んだ内容でプロンプトを自動更新しました。";
  };
  for (const group of Object.keys(presets)) {
    const selected = promptForm.querySelector(`[name="${group}"]:checked`);
    if (selected) applyPreset(group, selected.value);
  }
  promptForm.addEventListener("input", (event) => {
    const group = event.target.name;
    if (presets[group]) applyPreset(group, event.target.value);
    generate();
  });
  promptForm.addEventListener("submit", (event) => { event.preventDefault(); generate(); output.focus(); });
  document.querySelector("[data-copy-prompt]")?.addEventListener("click", (event) => copyText(output.textContent || "", event.currentTarget));
  document.querySelector("[data-randomize]")?.addEventListener("click", () => {
    for (const [group, choices] of Object.entries(presets)) {
      const keys = Object.keys(choices);
      const key = keys[crypto.getRandomValues(new Uint32Array(1))[0] % keys.length];
      const radio = promptForm.querySelector(`[name="${group}"][value="${key}"]`);
      radio.checked = true;
      applyPreset(group, key);
    }
    generate();
    status.textContent = "おまかせセットを選びました。もう一度押すと別の組み合わせになります。";
  });
  generate();
}

const libraryRoot = document.querySelector("[data-library]");
if (libraryRoot) {
  const form = libraryRoot.querySelector("[data-login-form]");
  const loginPanel = libraryRoot.querySelector("[data-login-panel]");
  const contentPanel = libraryRoot.querySelector("[data-content-panel]");
  const content = libraryRoot.querySelector("[data-skill-content]");
  const message = libraryRoot.querySelector("[data-library-message]");
  const showLogin = (text = "") => {
    loginPanel.hidden = false;
    contentPanel.hidden = true;
    message.textContent = text;
  };
  const showContent = (markdown) => {
    loginPanel.hidden = true;
    contentPanel.hidden = false;
    content.textContent = markdown;
    message.textContent = "";
  };
  const loadContent = async () => {
    try {
      const response = await fetch("/api/library/content", { headers: { Accept: "application/json" } });
      const data = await response.json();
      if (response.ok) showContent(data.markdown);
      else showLogin(response.status === 401 ? "" : data.error);
    } catch {
      showLogin("通信できませんでした。時間をおいてお試しください。");
    }
  };
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    message.textContent = "確認しています…";
    const passphrase = new FormData(form).get("passphrase");
    try {
      const response = await fetch("/api/library/login", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ passphrase }),
      });
      const data = await response.json();
      if (!response.ok) { showLogin(data.error); return; }
      form.reset();
      await loadContent();
    } catch {
      showLogin("通信できませんでした。時間をおいてお試しください。");
    }
  });
  libraryRoot.querySelector("[data-copy-skill]").addEventListener("click", (event) => copyText(content.textContent || "", event.currentTarget));
  libraryRoot.querySelector("[data-logout]").addEventListener("click", async () => {
    await fetch("/api/library/logout", { method: "POST", headers: { Accept: "application/json" } });
    content.textContent = "";
    showLogin("ログアウトしました。");
  });
  loadContent();
}

const deck = document.querySelector("[data-deck]");
if (deck) {
  const slides = [...deck.querySelectorAll("[data-slide]")];
  const current = document.querySelector("[data-slide-current]");
  const total = document.querySelector("[data-slide-total]");
  const phase = document.querySelector("[data-slide-phase]");
  const progress = document.querySelector("[data-slide-progress]");
  let index = 0;
  total.textContent = String(slides.length);
  progress.max = slides.length;
  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === index));
    current.textContent = String(index + 1);
    phase.textContent = slides[index].dataset.phase || "";
    progress.value = index + 1;
    document.title = `${index + 1}/${slides.length}｜講義スライド｜Codexの教科書`;
    window.scrollTo(0, 0);
  };
  document.querySelector("[data-slide-prev]").addEventListener("click", () => show(index - 1));
  document.querySelector("[data-slide-next]").addEventListener("click", () => show(index + 1));
  document.querySelector("[data-fullscreen]").addEventListener("click", async () => {
    if (!document.fullscreenElement) await document.documentElement.requestFullscreen();
    else await document.exitFullscreen();
  });
  document.addEventListener("keydown", (event) => {
    if (["ArrowRight", "PageDown", " "].includes(event.key)) { event.preventDefault(); show(index + 1); }
    if (["ArrowLeft", "PageUp"].includes(event.key)) { event.preventDefault(); show(index - 1); }
    if (event.key === "Home") show(0);
    if (event.key === "End") show(slides.length - 1);
  });
  show(0);
}
