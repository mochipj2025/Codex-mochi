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
  const labels = {
    subject: "主役", medium: "画材", atmosphere: "時代・地域の雰囲気", palette: "配色",
    features: "顔・体型", pose: "ポーズ", invariants: "固定条件", count: "枚数",
  };
  const generate = () => {
    const data = new FormData(promptForm);
    const lines = ["背景透過ステッカーを生成してください。", ""];
    for (const [key, label] of Object.entries(labels)) {
      const value = String(data.get(key) || "").trim();
      if (value) lines.push(`${label}: ${value}`);
    }
    lines.push("", "要件:", "- 1枚ずつ連続生成する", "- 主役の同一性と固定条件を厳密に守る", "- 変更するのは指定したポーズと表情だけ", "- 背景は完全な透過（アルファチャンネル）", "- 文字・ロゴ・透かし・余計な小物を入れない");
    output.textContent = lines.join("\n");
    status.textContent = "入力内容からプロンプトを更新しました。";
  };
  promptForm.addEventListener("input", generate);
  promptForm.addEventListener("submit", (event) => { event.preventDefault(); generate(); output.focus(); });
  document.querySelector("[data-copy-prompt]")?.addEventListener("click", (event) => copyText(output.textContent || "", event.currentTarget));
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
  let index = 0;
  total.textContent = String(slides.length);
  const show = (next) => {
    index = (next + slides.length) % slides.length;
    slides.forEach((slide, slideIndex) => slide.classList.toggle("active", slideIndex === index));
    current.textContent = String(index + 1);
    document.title = `${index + 1}/${slides.length}｜講義スライド｜Codexの教科書`;
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
