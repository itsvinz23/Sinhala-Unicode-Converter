import { useState, useCallback, useRef, useEffect } from "react";
import { fmAbayaToUnicode, unicodeToDlManel, singlishToUnicode } from "sinhala-unicode-coverter";
import "./index.css";

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconCopy = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IconCheck = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);
const IconClear = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
  </svg>
);
const IconSwap = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4m0 0L3 8m4-4 4 4"/><path d="M17 8v12m0 0 4-4m-4 4-4-4"/>
  </svg>
);
const IconPlay = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="5 3 19 12 5 21 5 3"/>
  </svg>
);
const IconDownload = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);
const IconText = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="4 7 4 4 20 4 20 7"/><line x1="9" y1="20" x2="15" y2="20"/><line x1="12" y1="4" x2="12" y2="20"/>
  </svg>
);
const IconVolume = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
  </svg>
);
const IconFont = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 7V4h16v3"/><path d="M9 20h6"/><path d="M12 4v16"/>
  </svg>
);
const IconBrush = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18.37 2.63 14 7l-1.59-1.59a2 2 0 0 0-2.82 0L8 7l9 9 1.59-1.59a2 2 0 0 0 0-2.82L17 10l4.37-4.37a2.12 2.12 0 0 0-3-3Z"/>
    <path d="M9 8c-2 3-4 3.5-7 4l8 10c2-1 6-5 6-7"/><path d="M14.5 17.5 4.5 15"/>
  </svg>
);

// ─── Soundboard data ─────────────────────────────────────────────────────────
const SOUNDS = [
  { id: 1, title: "Apita Kohenda Kiri", emoji: "🐄", desc: "Viral Sinhala meme", url: null },
  { id: 2, title: "Ado Ado!", emoji: "😂", desc: "Classic reaction", url: null },
  { id: 3, title: "Loku Ayiya", emoji: "👊", desc: "Trending voice clip", url: null },
  { id: 4, title: "Eka Niyamayi", emoji: "🎯", desc: "Viral phrase", url: null },
  { id: 5, title: "Machan Machan", emoji: "🤙", desc: "Sri Lankan slangs", url: null },
  { id: 6, title: "Suba Anek", emoji: "🙏", desc: "Blessing send-off", url: null },
  { id: 7, title: "Wahala!", emoji: "🔥", desc: "Hype moment", url: null },
  { id: 8, title: "Gedi Paarak", emoji: "⚡", desc: "Epic highlight sound", url: null },
];

// ─── Fonts data ───────────────────────────────────────────────────────────────
const FONTS = [
  {
    id: 1,
    name: "FM Abhaya",
    desc: "The most popular legacy Sinhala font used in print and video editing. Required for CapCut Sinhala text.",
    preview: "සිංහල",
    url: "https://www.fonts.lk/fonts/fm-abhaya.zip",
    note: "FM Abhaya, FM Malithi compatible",
  },
  {
    id: 2,
    name: "FM Bindumathi",
    desc: "Bold, clean legacy font. Great for subtitles and captions in videos.",
    preview: "අකුරු",
    url: "https://www.fonts.lk/fonts/fm-bindumathi.zip",
    note: "Wide usage in Sri Lankan media",
  },
  {
    id: 3,
    name: "Iskoola Pota",
    desc: "Microsoft's free Unicode Sinhala font. Safe default for web and social media.",
    preview: "කතාව",
    url: "https://fonts.google.com/noto/specimen/Noto+Sans+Sinhala",
    note: "Unicode standard — works everywhere",
  },
  {
    id: 4,
    name: "Noto Sans Sinhala",
    desc: "Google's open-source Sinhala font. Modern, clean, and perfect for YouTube thumbnails.",
    preview: "දිනය",
    url: "https://fonts.google.com/noto/specimen/Noto+Sans+Sinhala",
    note: "Free Google Fonts — perfect for digital",
  },
];

// ─── Text Style Presets data ─────────────────────────────────────────────────
const PRESETS = [
  {
    id: 1,
    name: "🔥 Flame Glow",
    preview: "ශ්‍රී ලංකා",
    style: {
      color: "#ff4500",
      textShadow: "0 0 10px #ff4500, 0 0 25px #ff6000, 0 0 50px #ff8c00",
      fontWeight: 900,
      fontSize: 26,
      fontFamily: "Noto Sans Sinhala, sans-serif",
    },
    css: "color: #ff4500;\ntext-shadow: 0 0 10px #ff4500, 0 0 25px #ff6000;\nfont-weight: 900;",
  },
  {
    id: 2,
    name: "💎 Diamond Neon",
    preview: "ශ්‍රී ලංකා",
    style: {
      color: "#00f0ff",
      textShadow: "0 0 8px #00f0ff, 0 0 20px #0066ff",
      fontWeight: 900,
      fontSize: 26,
      fontFamily: "Noto Sans Sinhala, sans-serif",
    },
    css: "color: #00f0ff;\ntext-shadow: 0 0 8px #00f0ff, 0 0 20px #0066ff;\nfont-weight: 900;",
  },
  {
    id: 3,
    name: "👑 Gold King",
    preview: "ශ්‍රී ලංකා",
    style: {
      background: "linear-gradient(135deg, #ffd700, #ff8c00)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 900,
      fontSize: 26,
      fontFamily: "Noto Sans Sinhala, sans-serif",
    },
    css: "background: linear-gradient(135deg, #ffd700, #ff8c00);\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;\nfont-weight: 900;",
  },
  {
    id: 4,
    name: "🌸 Pink Anime",
    preview: "ශ්‍රී ලංකා",
    style: {
      color: "#ff79c6",
      textShadow: "0 0 8px #ff79c6, 0 2px 4px rgba(0,0,0,0.8)",
      fontWeight: 700,
      fontSize: 26,
      fontFamily: "Noto Sans Sinhala, sans-serif",
    },
    css: "color: #ff79c6;\ntext-shadow: 0 0 8px #ff79c6, 0 2px 4px rgba(0,0,0,0.8);\nfont-weight: 700;",
  },
  {
    id: 5,
    name: "⚡ Electric",
    preview: "ශ්‍රී ලංකා",
    style: {
      color: "#f9ca24",
      textShadow: "0 0 6px #f9ca24, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000",
      fontWeight: 900,
      fontSize: 26,
      fontFamily: "Noto Sans Sinhala, sans-serif",
    },
    css: "color: #f9ca24;\ntext-shadow: 0 0 6px #f9ca24;\nfont-weight: 900;",
  },
  {
    id: 6,
    name: "🌊 Ocean Wave",
    preview: "ශ්‍රී ලංකා",
    style: {
      background: "linear-gradient(135deg, #00b4db, #0083b0)",
      WebkitBackgroundClip: "text",
      WebkitTextFillColor: "transparent",
      fontWeight: 900,
      fontSize: 26,
      fontFamily: "Noto Sans Sinhala, sans-serif",
    },
    css: "background: linear-gradient(135deg, #00b4db, #0083b0);\n-webkit-background-clip: text;\n-webkit-text-fill-color: transparent;\nfont-weight: 900;",
  },
];

// ─── Mode Config ─────────────────────────────────────────────────────────────
const MODES = [
  { id: "unicode-to-fm", label: "Unicode → FM", badge: "to-fm", badgeLabel: "FM ABHAYA" },
  { id: "fm-to-unicode", label: "FM → Unicode", badge: "to-unicode", badgeLabel: "UNICODE" },
  { id: "singlish", label: "Singlish → Unicode", badge: "singlish", badgeLabel: "PHONETIC" },
];

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [activeTab, setActiveTab] = useState("translator");
  const [mode, setMode] = useState("unicode-to-fm");
  const [input, setInput] = useState("");
  const [copied, setCopied] = useState(false);
  const [copiedPresetId, setCopiedPresetId] = useState(null);
  const [playingId, setPlayingId] = useState(null);

  const cardRef = useRef(null);

  // ── Real-time conversion
  const output = (() => {
    if (!input.trim()) return "";
    try {
      if (mode === "unicode-to-fm") return unicodeToDlManel(input);
      if (mode === "fm-to-unicode") return fmAbayaToUnicode(input);
      if (mode === "singlish") return singlishToUnicode(input);
    } catch {
      return "⚠️ Conversion error";
    }
    return "";
  })();

  // ── 3D Mouse Tilt
  const handleMouseMove = useCallback((e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -7;
    const rotateY = ((x - cx) / cx) * 7;
    card.style.transform = `perspective(1200px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    card.style.boxShadow = `
      ${-rotateY * 2}px ${rotateX * 2}px 40px -10px rgba(139, 92, 246, 0.2),
      0 30px 60px -20px rgba(0, 0, 0, 0.6)
    `;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = "perspective(1200px) rotateX(0deg) rotateY(0deg)";
    card.style.boxShadow = "0 30px 60px -20px rgba(0, 0, 0, 0.6)";
  }, []);

  // ── Copy output
  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  // ── Swap
  const handleSwap = () => {
    if (!output) return;
    setInput(output);
  };

  // ── Clear
  const handleClear = () => setInput("");

  // ── Play sound (placeholder — vibrates / shows playing state)
  const handlePlaySound = (id) => {
    setPlayingId(id);
    setTimeout(() => setPlayingId(null), 2000);
  };

  // ── Copy Preset CSS
  const handleCopyPreset = (preset) => {
    navigator.clipboard.writeText(preset.css).then(() => {
      setCopiedPresetId(preset.id);
      setTimeout(() => setCopiedPresetId(null), 2000);
    });
  };

  const activeMode = MODES.find((m) => m.id === mode);

  return (
    <>
      {/* 3D Background Grid */}
      <div className="bg-grid-container">
        <div className="bg-grid" />
        <div className="bg-glow-spot glow-purple" />
        <div className="bg-glow-spot glow-cyan" />
      </div>

      <div className="app-container">
        {/* ── Header ── */}
        <div className="badge-3d">
          <span>v2.0</span>
          <span className="badge-divider" />
          <span className="badge-accent">Sri Lankan Creator Toolkit</span>
        </div>

        <h1 className="title-3d">
          සිංහල <span className="title-glow">Creator Studio</span>
        </h1>
        <p className="subtitle-3d">
          All-in-one toolkit for Sri Lankan CapCut & Video Creators
        </p>

        {/* ── Tab Navigation ── */}
        <nav className="nav-tabs">
          <button className={`tab-btn ${activeTab === "translator" ? "active" : ""}`} onClick={() => setActiveTab("translator")}>
            <IconText /> Translator
          </button>
          <button className={`tab-btn ${activeTab === "soundboard" ? "active" : ""}`} onClick={() => setActiveTab("soundboard")}>
            <IconVolume /> Soundboard
          </button>
          <button className={`tab-btn ${activeTab === "fonts" ? "active" : ""}`} onClick={() => setActiveTab("fonts")}>
            <IconFont /> Fonts
          </button>
          <button className={`tab-btn ${activeTab === "presets" ? "active" : ""}`} onClick={() => setActiveTab("presets")}>
            <IconBrush /> Presets
          </button>
        </nav>

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: TRANSLATOR */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === "translator" && (
          <>
            {/* Mode + Utility Controls */}
            <div className="control-switch-bar">
              <div className="mode-selector-group">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    className={`mode-btn ${mode === m.id ? "active" : ""}`}
                    onClick={() => { setMode(m.id); setInput(""); }}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
              <div className="top-util-group">
                <button className="btn-3d btn-grey" onClick={handleSwap} disabled={!output} title="Swap to input">
                  <IconSwap />
                </button>
                <button className="btn-3d btn-grey" onClick={handleClear} disabled={!input} title="Clear">
                  <IconClear />
                </button>
              </div>
            </div>

            {/* 3D Tilt Card */}
            <div className="tilt-card-wrapper">
              <div
                className="tilt-card"
                ref={cardRef}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="workspace-console">
                  {/* Input Pane */}
                  <div>
                    <div className="section-header">
                      <span className="section-label">Input</span>
                      <span className="section-count">{input.length} chars</span>
                    </div>
                    <textarea
                      className="textarea-3d"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder={
                        mode === "singlish"
                          ? "Type in English (e.g. api kohomada)…"
                          : mode === "fm-to-unicode"
                          ? "Paste FM Abhaya text here…"
                          : "Type or paste Sinhala Unicode text…"
                      }
                      spellCheck={false}
                    />
                  </div>

                  {/* Output Pane */}
                  <div>
                    <div className="section-header">
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span className="section-label">Output</span>
                        {output && (
                          <span className={`badge-mode ${activeMode?.badge}`}>
                            {activeMode?.badgeLabel}
                          </span>
                        )}
                      </div>
                      <button
                        className={`btn-3d ${copied ? "btn-cyan" : "btn-grey"}`}
                        style={{ padding: "5px 12px", fontSize: 11, borderRadius: 9 }}
                        onClick={handleCopy}
                        disabled={!output}
                      >
                        {copied ? <IconCheck /> : <IconCopy />}
                        {copied ? "Copied!" : "Copy"}
                      </button>
                    </div>
                    <div className={`output-box-3d ${output ? "active" : ""}`}>
                      {output || (
                        <span className="output-placeholder">
                          — converted text appears here in real time —
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {output && (
              <div className="stats-panel-3d">
                <span>In: <span className="stats-val">{input.length}</span></span>
                <span className="stats-dot">·</span>
                <span>Out: <span className="stats-val">{output.length}</span></span>
                <span className="stats-dot">·</span>
                <span>Ratio: <span className="stats-val">{(output.length / input.length).toFixed(2)}x</span></span>
              </div>
            )}
          </>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: SOUNDBOARD */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === "soundboard" && (
          <div className="tilt-card-wrapper">
            <div className="tilt-card">
              <div className="section-header" style={{ marginBottom: 24 }}>
                <div>
                  <span className="section-label" style={{ fontSize: 13, display: "block", marginBottom: 4 }}>🔊 Sri Lankan Meme Soundboard</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Popular sounds for CapCut & TikTok reactions. Click to play.
                  </span>
                </div>
              </div>
              <div className="soundboard-grid">
                {SOUNDS.map((s) => (
                  <div key={s.id} className="sound-card">
                    <div className="sound-icon-box">
                      <span style={{ fontSize: 22 }}>{s.emoji}</span>
                    </div>
                    <div>
                      <div className="sound-title">{s.title}</div>
                      <div className="sound-desc">{s.desc}</div>
                    </div>
                    <div className="sound-btn-group">
                      <button
                        className={`btn-3d btn-sound-play ${playingId === s.id ? "btn-cyan" : "btn-violet"}`}
                        onClick={() => handlePlaySound(s.id)}
                      >
                        <IconPlay /> {playingId === s.id ? "Playing…" : "Play"}
                      </button>
                      <button className="btn-3d btn-grey btn-sound-dl">
                        <IconDownload />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <p style={{ marginTop: 24, fontSize: 11, color: "var(--text-muted)", textAlign: "center", fontFamily: "monospace" }}>
                🚧 Audio clips coming soon — Connect your own MP3 links to the SOUNDS array in App.jsx
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: FONTS */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === "fonts" && (
          <div className="tilt-card-wrapper">
            <div className="tilt-card">
              <div className="section-header" style={{ marginBottom: 24 }}>
                <div>
                  <span className="section-label" style={{ fontSize: 13, display: "block", marginBottom: 4 }}>📁 Sinhala Font Downloads</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Download & import these fonts into CapCut, Premiere Pro, or any editing software.
                  </span>
                </div>
              </div>
              <div className="fonts-grid">
                {FONTS.map((f) => (
                  <div key={f.id} className="font-card">
                    <div className="font-info">
                      <h3>{f.name}</h3>
                      <p>{f.desc}</p>
                    </div>
                    <div className="font-preview">{f.preview}</div>
                    <div style={{ fontSize: 10, color: "var(--text-muted)", fontFamily: "monospace" }}>{f.note}</div>
                    <a href={f.url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                      <button className="btn-3d btn-violet" style={{ width: "100%" }}>
                        <IconDownload /> Download Font
                      </button>
                    </a>
                  </div>
                ))}
              </div>
              <div style={{ marginTop: 24, background: "#06080b", border: "1px solid #1e293b", borderRadius: 16, padding: 20 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8 }}>📱 How to add fonts to CapCut (Mobile)</p>
                <ol style={{ fontSize: 12, color: "var(--text-secondary)", lineHeight: 2, paddingLeft: 18 }}>
                  <li>Download the <strong>.ttf</strong> or <strong>.otf</strong> font file to your phone</li>
                  <li>Open <strong>CapCut</strong> → New Project → Text → My Fonts</li>
                  <li>Tap <strong>Import</strong> and select the downloaded font</li>
                  <li>Use the <strong>Translator</strong> tab to convert text, then paste in CapCut</li>
                </ol>
              </div>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════════════════ */}
        {/* TAB: TEXT PRESETS */}
        {/* ═══════════════════════════════════════════════════════ */}
        {activeTab === "presets" && (
          <div className="tilt-card-wrapper">
            <div className="tilt-card">
              <div className="section-header" style={{ marginBottom: 24 }}>
                <div>
                  <span className="section-label" style={{ fontSize: 13, display: "block", marginBottom: 4 }}>🎨 Text Style Presets</span>
                  <span style={{ fontSize: 12, color: "var(--text-muted)" }}>
                    Viral Sinhala text styles for CapCut, TikTok & YouTube thumbnails. Copy CSS to use.
                  </span>
                </div>
              </div>
              <div className="presets-grid">
                {PRESETS.map((p) => (
                  <div key={p.id} className="preset-card">
                    <div className="preset-name">{p.name}</div>
                    <div className="preset-preview-container">
                      <span style={{ ...p.style }}>{p.preview}</span>
                    </div>
                    <div className="preset-css">{p.css}</div>
                    <button
                      className={`btn-3d ${copiedPresetId === p.id ? "btn-cyan" : "btn-grey"}`}
                      style={{ width: "100%", fontSize: 12 }}
                      onClick={() => handleCopyPreset(p)}
                    >
                      {copiedPresetId === p.id ? <IconCheck /> : <IconCopy />}
                      {copiedPresetId === p.id ? "Copied!" : "Copy CSS"}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="footer-text-3d">
          Powered by UCSC LTRL · Built for Sri Lankan Creators 🇱🇰<br />
          සිංහල Creator Studio v2.0
        </div>
      </div>
    </>
  );
}
