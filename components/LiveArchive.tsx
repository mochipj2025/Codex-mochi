import "./live-archive.css";

export const liveArchiveUrl = "https://mochiketu2026.substack.com/p/codex?utm_campaign=post&utm_medium=web";

export function LiveArchive() {
  return (
    <section className="live-archive" aria-labelledby="live-archive-title">
      <div>
        <p className="eyebrow">LESSON 01 · LIVE ARCHIVE</p>
        <h2 id="live-archive-title">LIVEのアーカイブができました</h2>
        <p>2026年9月4日のCodex勉強会。背景透過ステッカーづくりの実演を、教材と一緒に振り返れます。</p>
      </div>
      <a className="button" href={liveArchiveUrl} target="_blank" rel="noopener noreferrer">
        <span>LIVEアーカイブを見る ↗<small>Substack・別タブで開きます</small></span>
      </a>
    </section>
  );
}
