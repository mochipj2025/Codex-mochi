"use client";

import { useMemo, useState } from "react";
import { CopyButton } from "@/components/CopyButton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import "./PromptMaker.css";

type Choice = {
  id: string;
  label: string;
  detail: string;
  prompt: string;
};

type ChoiceKey = "purpose" | "subject" | "style" | "mood" | "pose";

const groups: Array<{ key: ChoiceKey; label: string; hint: string; choices: Choice[] }> = [
  {
    key: "purpose",
    label: "何をつくる？",
    hint: "完成形を選択",
    choices: [
      { id: "sticker", label: "透過ステッカー", detail: "全身・背景なし", prompt: "背景を完全に透明にした、全身の透過ステッカー画像" },
      { id: "icon", label: "SNSアイコン", detail: "正方形・顔を大きく", prompt: "正方形のSNSアイコン用イラスト" },
      { id: "picturebook", label: "絵本の挿絵", detail: "横長・物語の1場面", prompt: "絵本の見開きに使う横長の挿絵" },
    ],
  },
  {
    key: "subject",
    label: "主役は？",
    hint: "キャラクターを選択",
    choices: [
      { id: "capybara", label: "カピバラ", detail: "おっとり", prompt: "2頭身の丸い体、半分閉じた目、丸い頬、小さな口を持つ、眠そうなカピバラのゆるキャラ" },
      { id: "cat", label: "ねこ", detail: "きまぐれ", prompt: "2頭身の丸い体、三角の耳、丸い頬、小さな口を持つ、のんびりしたねこのゆるキャラ" },
      { id: "shiba", label: "柴犬", detail: "元気", prompt: "2頭身の丸い体、立った耳、くるんとした尻尾を持つ、親しみやすい柴犬のゆるキャラ" },
      { id: "rabbit", label: "うさぎ", detail: "やさしい", prompt: "2頭身の丸い体、長い耳、丸い頬、小さな口を持つ、やさしいうさぎのゆるキャラ" },
    ],
  },
  {
    key: "style",
    label: "画風は？",
    hint: "質感を選択",
    choices: [
      { id: "pencil", label: "色鉛筆", detail: "素朴な線", prompt: "色鉛筆の細い線と、紙の粒子がわかるやわらかな塗り" },
      { id: "watercolor", label: "水彩", detail: "淡いにじみ", prompt: "透明水彩の淡いにじみと、手描きのゆらぎが残る塗り" },
      { id: "crayon", label: "クレヨン", detail: "あたたかい", prompt: "クレヨンのかすれと重なりを活かした、あたたかい手描き表現" },
    ],
  },
  {
    key: "mood",
    label: "雰囲気は？",
    hint: "色と世界観を選択",
    choices: [
      { id: "retro", label: "レトロ絵本", detail: "茶・ミント・コーラル", prompt: "1960年代ヨーロッパのお菓子缶のようなレトロ絵本風。暖かい茶色、くすみミント、クリーム、落ち着いたコーラルの配色" },
      { id: "nordic", label: "北欧ナチュラル", detail: "青・生成り・赤", prompt: "北欧の児童書のような、静かで素朴な雰囲気。深い青、生成り、レンガ色の落ち着いた配色" },
      { id: "pop", label: "明るいポップ", detail: "黄・水色・ピンク", prompt: "明るく楽しいポップな絵本風。たまご色、水色、やわらかなピンクの軽やかな配色" },
    ],
  },
  {
    key: "pose",
    label: "何をしている？",
    hint: "ポーズを選択",
    choices: [
      { id: "wave", label: "手を振る", detail: "こんにちは", prompt: "片手を上げて、こちらに小さく手を振っている" },
      { id: "sleep", label: "すやすや眠る", detail: "リラックス", prompt: "体を丸め、安心した表情ですやすや眠っている" },
      { id: "flower", label: "花を持つ", detail: "ありがとう", prompt: "小さな花を両手で大切そうに持っている" },
      { id: "jump", label: "ぴょんと跳ぶ", detail: "うれしい", prompt: "うれしそうな表情で、両手を上げて小さく跳びはねている" },
    ],
  },
];

const defaults: Record<ChoiceKey, string> = {
  purpose: "sticker",
  subject: "capybara",
  style: "pencil",
  mood: "retro",
  pose: "wave",
};

function selectedChoice(key: ChoiceKey, id: string) {
  const group = groups.find((item) => item.key === key);
  return group?.choices.find((choice) => choice.id === id) ?? group!.choices[0];
}

export function PromptMaker() {
  const [selection, setSelection] = useState(defaults);

  const chosen = useMemo(
    () => ({
      purpose: selectedChoice("purpose", selection.purpose),
      subject: selectedChoice("subject", selection.subject),
      style: selectedChoice("style", selection.style),
      mood: selectedChoice("mood", selection.mood),
      pose: selectedChoice("pose", selection.pose),
    }),
    [selection],
  );

  const prompt = useMemo(() => {
    const format = selection.purpose === "sticker"
      ? "床、風景、影、白背景、文字、枠、透かしは入れないでください。全身を枠内に収め、周囲に透明の余白を確保してください。"
      : selection.purpose === "icon"
        ? "キャラクターの顔と表情が小さな表示でも伝わるよう、中央に大きく配置してください。背景はシンプルな単色にしてください。"
        : "キャラクターを主役として読みやすく配置し、余白のある穏やかな背景を添えてください。文字、枠、透かしは入れないでください。";

    return `${chosen.purpose.prompt}を1枚生成してください。\n\n${chosen.style.prompt}で描く、${chosen.subject.prompt}。${chosen.mood.prompt}。\n\n今回のポーズ：${chosen.pose.prompt}。\n\n顔、体型、頭身、配色、線、画材の質感を統一してください。${format}1回につき1枚だけ生成してください。`;
  }, [chosen, selection.purpose]);

  const demoSteps = useMemo(() => [
    {
      id: "01",
      shortLabel: "基準",
      title: "1枚目｜基準のキャラクター",
      note: "最初だけ、選んだ条件をすべて伝えます。生成後の画像を次の実演でも使います。",
      prompt,
    },
    {
      id: "02",
      shortLabel: "お菓子",
      title: "2枚目｜お菓子を持つ",
      note: "1枚目の画像を添付して、変える部分だけを指示します。",
      prompt: "直前の画像と同じキャラクターとして作成してください。\n顔、体型、頭身、配色、線、画材の質感、背景の条件を固定します。\n今回の変更点だけ：小さなキャンディーを両手で持ち、うれしそうに微笑む。\n1枚だけ生成してください。",
    },
    {
      id: "03",
      shortLabel: "あいさつ",
      title: "3枚目｜手を振る",
      note: "直前の画像を添付し、同じキャラクターであることを明記します。",
      prompt: "直前の画像と同じキャラクターとして作成してください。\n顔、体型、頭身、配色、線、画材の質感、背景の条件を固定します。\n今回の変更点だけ：片手を上げて、同じ表情のまま小さく手を振る。\n1枚だけ生成してください。",
    },
    {
      id: "04",
      shortLabel: "びっくり",
      title: "4枚目｜びっくりする",
      note: "顔立ちは変えず、表情と手の位置だけを変えます。",
      prompt: "直前の画像と同じキャラクターとして作成してください。\n顔、体型、頭身、配色、線、画材の質感、背景の条件を固定します。\n今回の変更点だけ：両手を頬に添え、目を少し開いて驚いている。\n1枚だけ生成してください。",
    },
    {
      id: "05",
      shortLabel: "おやすみ",
      title: "5枚目｜おやすみ",
      note: "最後も直前の画像を基準にし、小物とポーズだけを変更します。",
      prompt: "直前の画像と同じキャラクターとして作成してください。\n顔、体型、頭身、配色、線、画材の質感、背景の条件を固定します。\n今回の変更点だけ：座って目を閉じ、小さな枕を抱えて眠っている。\n1枚だけ生成してください。",
    },
  ], [prompt]);

  return (
    <section className="maker-shell" aria-labelledby="maker-title">
      <div className="maker-toolbar">
        <div>
          <p className="eyebrow">5 CHOICES · ABOUT 1 MINUTE</p>
          <h2 id="maker-title">5つ選んだら、できあがり。</h2>
        </div>
        <div className="maker-progress" aria-label="5項目すべて選択済み">
          <span>選択済み</span>
          <strong>5 / 5</strong>
        </div>
      </div>

      <div className="maker-grid">
        <form className="maker-form" onSubmit={(event) => event.preventDefault()}>
          {groups.map((group, index) => (
            <fieldset className="prompt-step" key={group.key}>
              <legend>
                <span className="step-number">0{index + 1}</span>
                <span><strong>{group.label}</strong><small>{group.hint}</small></span>
              </legend>
              <RadioGroup
                className="choice-grid"
                value={selection[group.key]}
                onValueChange={(value) => setSelection((current) => ({ ...current, [group.key]: value }))}
                aria-label={group.label}
              >
                {group.choices.map((choice) => {
                  const id = `${group.key}-${choice.id}`;
                  return (
                    <div className="choice-card" key={choice.id}>
                      <RadioGroupItem id={id} value={choice.id} />
                      <label htmlFor={id}>
                        <strong>{choice.label}</strong>
                        <small>{choice.detail}</small>
                      </label>
                    </div>
                  );
                })}
              </RadioGroup>
            </fieldset>
          ))}
          <button className="maker-reset" type="button" onClick={() => setSelection(defaults)}>おすすめに戻す</button>
        </form>

        <aside className="prompt-output" aria-label="完成したプロンプト">
          <div className="code-head">
            <span>完成したプロンプト</span>
            <CopyButton text={prompt} label="プロンプトをコピー" />
          </div>
          <div className="prompt-summary" aria-hidden="true">
            {[chosen.purpose, chosen.subject, chosen.style, chosen.mood, chosen.pose].map((choice) => <span key={choice.id}>{choice.label}</span>)}
          </div>
          <pre aria-live="polite">{prompt}</pre>
          <p className="copy-hint">コピーして、そのまま画像生成へ貼り付けられます。</p>
        </aside>
      </div>

      <section className="demo-prompts" id="demo-prompts" aria-labelledby="demo-prompts-title">
        <header className="demo-prompts-head">
          <div>
            <p className="eyebrow">LIVE DEMONSTRATION · 5 PROMPTS</p>
            <h2 id="demo-prompts-title">実演プロンプト</h2>
            <p>1枚目を基準にして、2枚目からは変更点だけを伝えます。番号順にコピーして使ってください。</p>
          </div>
          <a className="button" href="/downloads/01_実演用の基本プロンプト.md" download>まとめて保存</a>
        </header>

        <Tabs className="demo-tabs" defaultValue="01">
          <TabsList className="demo-tabs-list" aria-label="実演する画像を選択">
            {demoSteps.map((step) => <TabsTrigger key={step.id} value={step.id}><span>{step.id}</span>{step.shortLabel}</TabsTrigger>)}
          </TabsList>
          {demoSteps.map((step) => (
            <TabsContent className="demo-tab-content" key={step.id} value={step.id}>
              <div className="demo-instruction">
                <span className="demo-step-badge">STEP {step.id}</span>
                <h3>{step.title}</h3>
                <p>{step.note}</p>
              </div>
              <div className="demo-code">
                <div className="code-head">
                  <span>Codexへ貼り付ける文</span>
                  <CopyButton text={step.prompt} label={`${step.id}をコピー`} />
                </div>
                <pre>{step.prompt}</pre>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>
    </section>
  );
}
