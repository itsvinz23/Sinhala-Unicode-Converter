import { useState, useCallback } from "react";

// ─── Mappings ────────────────────────────────────────────────────────────────
const UNICODE_TO_FM = {
  // Vowels
  "අ": "w", "ආ": "wd", "ඇ": "we", "ඈ": "wE",
  "ඉ": "b", "ඊ": "B", "උ": "W", "ඌ": "U",
  "එ": "t", "ඒ": "T", "ඔ": "f", "ඕ": "F",
  "ඍ": "re", "ඎ": "rE",

  // Consonants + vowel combos (longer first is handled by sort, but grouping helps reading)
  "කා": "ld", "කි": "ls", "කී": "lS", "කු": "l=", "කූ": "l==",
  "කෙ": "fl", "කේ": "Tl", "කො": "fld", "කෝ": "Tld", "ක": "l",

  "ඛා": "Ld", "ඛ": "L",
  "ගා": ".d", "ගි": ".s", "ග": ".",
  "ඝ": ">", "ඞ": "Z",
  "චා": "pid", "චි": "pis", "ච": "pi",
  "ජා": "cd", "ජ": "c", "ඤ": "Z",
  "ටා": "`d", "ට": "`", "ඩ": "v", "ණ": "K",
  "තා": "Nd", "ති": "Ns", "ත": "N",
  "ථ": "O",
  "දා": "od", "දි": "os", "ද": "o", "ධ": "O",
  "නා": "kd", "න": "k",
  "පා": "md", "පි": "ms", "පී": "mS", "පු": "m=", "ප": "m",
  "ඵ": "M", "බා": "nd", "බ": "n", "භ": "P",
  "මා": "ud", "ම": "u",
  "යා": "hd", "ය": "h",
  "රා": "rd", "ර": "r",
  "ලා": ",d", "ල": ",",
  "වා": "jd", "ව": "j",
  "ශ": "Y", "ෂ": "I",
  "සා": "id", "ස": "i",
  "හා": "yd", "හ": "y",
  "ළා": "Ad", "ළ": "A",
  "ෆ": "-",

  // Vowel signs / diacritics
  "ා": "d", "ි": "s", "ී": "S",
  "ු": "=", "ූ": "==",
  "ෙ": "f", "ේ": "T",
  "ෛ": "TT", "ො": "fd", "ෝ": "Td", "ෞ": "TTd",
  "ං": "x", "ඃ": "X",
  "්": ";",
  "ෘ": "q", "ෲ": "Q",

  // Special
  "\u200d": "a",  // ZWJ
};

// ─── Converter engine ─────────────────────────────────────────────────────────
function buildReverseMap(forward) {
  const reverse = {};
  Object.entries(forward).forEach(([unicode, fm]) => {
    if (!reverse[fm]) reverse[fm] = unicode;
  });
  return reverse;
}

const FM_TO_UNICODE = buildReverseMap(UNICODE_TO_FM);

function convert(input, map) {
  if (!input.trim()) return "";
  const sorted = Object.keys(map).sort((a, b) => b.length - a.length);
  let result = input;
  for (const key of sorted) {
    result = result.split(key).join(map[key]);
  }
  return result;
}

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconCopy = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
  </svg>
);
const IconSwap = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M7 16V4m0 0L3 8m4-4 4 4"/><path d="M17 8v12m0 0 4-4m-4 4-4-4"/>
  </svg>
);
const IconClear = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 6h18M19 6l-1 14H6L5 6M10 11v6M14 11v6M9 6V4h6v2"/>
  </svg>
);
const IconCheck = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6L9 17l-5-5"/>
  </svg>
);

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState(null); // "toFM" | "toUnicode"
  const [copied, setCopied] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const handleInput = (val) => {
    setInput(val);
    setCharCount(val.length);
    setOutput("");
    setMode(null);
  };

  const doConvert = useCallback((direction) => {
    if (!input.trim()) return;
    const map = direction === "toFM" ? UNICODE_TO_FM : FM_TO_UNICODE;
    setOutput(convert(input, map));
    setMode(direction);
  }, [input]);

  const handleCopy = () => {
    if (!output) return;
    navigator.clipboard.writeText(output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleSwap = () => {
    if (!output) return;
    setInput(output);
    setOutput("");
    setMode(null);
    setCharCount(output.length);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setMode(null);
    setCharCount(0);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0f0f0f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "flex-start",
      padding: "48px 20px 80px",
      fontFamily: "'Georgia', serif",
    }}>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 10,
          background: "#1a1a1a",
          border: "1px solid #2a2a2a",
          borderRadius: 40,
          padding: "6px 16px",
          marginBottom: 24,
        }}>
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#555", letterSpacing: 2, textTransform: "uppercase" }}>v1.0</span>
          <span style={{ width: 1, height: 12, background: "#2a2a2a" }} />
          <span style={{ fontFamily: "monospace", fontSize: 11, color: "#888", letterSpacing: 1 }}>Unicode ↔ FM Abhaya</span>
        </div>
        <h1 style={{
          fontSize: "clamp(32px, 5vw, 52px)",
          fontWeight: 400,
          color: "#f0ede8",
          margin: "0 0 12px",
          letterSpacing: "-0.5px",
          lineHeight: 1.1,
        }}>
          සිංහල
          <span style={{ color: "#c8a97e", marginLeft: 12 }}>Converter</span>
        </h1>
        <p style={{ color: "#555", fontSize: 14, fontFamily: "monospace", margin: 0, letterSpacing: 0.5 }}>
          Sinhala Unicode · FM Abhaya · bidirectional
        </p>
      </div>

      {/* Main card */}
      <div style={{
        width: "100%",
        maxWidth: 760,
        background: "#141414",
        border: "1px solid #222",
        borderRadius: 16,
        overflow: "hidden",
      }}>

        {/* Input section */}
        <div style={{ padding: "24px 24px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#444", letterSpacing: 1.5, textTransform: "uppercase" }}>Input</span>
            <span style={{ fontSize: 11, fontFamily: "monospace", color: "#333" }}>{charCount} chars</span>
          </div>
          <textarea
            value={input}
            onChange={e => handleInput(e.target.value)}
            placeholder="Paste or type Sinhala text here..."
            style={{
              width: "100%",
              minHeight: 140,
              background: "#0f0f0f",
              border: "1px solid #222",
              borderRadius: 10,
              color: "#e8e4de",
              fontSize: 18,
              lineHeight: 1.8,
              padding: "14px 16px",
              resize: "vertical",
              outline: "none",
              fontFamily: "'Noto Sans Sinhala', 'Iskoola Pota', Georgia, serif",
              boxSizing: "border-box",
              transition: "border-color 0.2s",
            }}
            onFocus={e => e.target.style.borderColor = "#333"}
            onBlur={e => e.target.style.borderColor = "#222"}
          />
        </div>

        {/* Action buttons */}
        <div style={{ padding: "16px 24px", display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={() => doConvert("toFM")}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: mode === "toFM" ? "#c8a97e" : "#1e1e1e",
              border: `1px solid ${mode === "toFM" ? "#c8a97e" : "#2a2a2a"}`,
              borderRadius: 10,
              color: mode === "toFM" ? "#0f0f0f" : "#888",
              fontSize: 13,
              fontFamily: "monospace",
              letterSpacing: 0.5,
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={e => { if (mode !== "toFM") { e.target.style.background = "#222"; e.target.style.color = "#aaa"; }}}
            onMouseLeave={e => { if (mode !== "toFM") { e.target.style.background = "#1e1e1e"; e.target.style.color = "#888"; }}}
          >
            <span style={{ fontSize: 12 }}>Unicode</span>
            <span style={{ opacity: 0.6 }}>→</span>
            <span style={{ fontSize: 12 }}>FM Abhaya</span>
          </button>

          <button
            onClick={() => doConvert("toUnicode")}
            style={{
              flex: 1,
              padding: "12px 16px",
              background: mode === "toUnicode" ? "#7eb5c8" : "#1e1e1e",
              border: `1px solid ${mode === "toUnicode" ? "#7eb5c8" : "#2a2a2a"}`,
              borderRadius: 10,
              color: mode === "toUnicode" ? "#0f0f0f" : "#888",
              fontSize: 13,
              fontFamily: "monospace",
              letterSpacing: 0.5,
              cursor: "pointer",
              transition: "all 0.15s",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
            onMouseEnter={e => { if (mode !== "toUnicode") { e.target.style.background = "#222"; e.target.style.color = "#aaa"; }}}
            onMouseLeave={e => { if (mode !== "toUnicode") { e.target.style.background = "#1e1e1e"; e.target.style.color = "#888"; }}}
          >
            <span style={{ fontSize: 12 }}>FM Abhaya</span>
            <span style={{ opacity: 0.6 }}>→</span>
            <span style={{ fontSize: 12 }}>Unicode</span>
          </button>

          <div style={{ display: "flex", gap: 6 }}>
            <button
              onClick={handleSwap}
              title="Swap input / output"
              style={{
                width: 40, height: 40,
                background: "#1e1e1e",
                border: "1px solid #2a2a2a",
                borderRadius: 10,
                color: "#555",
                cursor: output ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: output ? 1 : 0.4,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (output) e.target.style.color = "#888"; }}
              onMouseLeave={e => e.target.style.color = "#555"}
            >
              <IconSwap />
            </button>
            <button
              onClick={handleClear}
              title="Clear all"
              style={{
                width: 40, height: 40,
                background: "#1e1e1e",
                border: "1px solid #2a2a2a",
                borderRadius: 10,
                color: "#555",
                cursor: input ? "pointer" : "not-allowed",
                display: "flex", alignItems: "center", justifyContent: "center",
                opacity: input ? 1 : 0.4,
                transition: "all 0.15s",
              }}
              onMouseEnter={e => { if (input) e.target.style.color = "#888"; }}
              onMouseLeave={e => e.target.style.color = "#555"}
            >
              <IconClear />
            </button>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "#1e1e1e", margin: "0 24px" }} />

        {/* Output section */}
        <div style={{ padding: "0 24px 24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 10px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 11, fontFamily: "monospace", color: "#444", letterSpacing: 1.5, textTransform: "uppercase" }}>Output</span>
              {mode && (
                <span style={{
                  fontSize: 10,
                  fontFamily: "monospace",
                  background: mode === "toFM" ? "#2a2010" : "#101a2a",
                  color: mode === "toFM" ? "#c8a97e" : "#7eb5c8",
                  border: `1px solid ${mode === "toFM" ? "#3a3020" : "#1a2a3a"}`,
                  padding: "2px 8px",
                  borderRadius: 20,
                  letterSpacing: 1,
                }}>
                  {mode === "toFM" ? "FM Abhaya" : "Unicode"}
                </span>
              )}
            </div>
            <button
              onClick={handleCopy}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px",
                background: copied ? "#1a2a1a" : "#1e1e1e",
                border: `1px solid ${copied ? "#2a4a2a" : "#2a2a2a"}`,
                borderRadius: 8,
                color: copied ? "#6abf6a" : "#555",
                fontSize: 12,
                fontFamily: "monospace",
                cursor: output ? "pointer" : "not-allowed",
                opacity: output ? 1 : 0.4,
                transition: "all 0.2s",
              }}
            >
              {copied ? <IconCheck /> : <IconCopy />}
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>

          <div style={{
            minHeight: 140,
            background: "#0a0a0a",
            border: "1px solid #1e1e1e",
            borderRadius: 10,
            padding: "14px 16px",
            color: output ? "#e8e4de" : "#333",
            fontSize: 18,
            lineHeight: 1.8,
            fontFamily: "'Noto Sans Sinhala', 'Iskoola Pota', Georgia, serif",
            whiteSpace: "pre-wrap",
            wordBreak: "break-all",
            userSelect: output ? "text" : "none",
          }}>
            {output || (
              <span style={{ fontFamily: "monospace", fontSize: 13, fontStyle: "normal" }}>
                — result appears here —
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Stats row */}
      {output && (
        <div style={{
          display: "flex",
          gap: 16,
          marginTop: 16,
          fontFamily: "monospace",
          fontSize: 12,
          color: "#444",
        }}>
          <span>{input.length} chars in</span>
          <span style={{ color: "#2a2a2a" }}>·</span>
          <span>{output.length} chars out</span>
          <span style={{ color: "#2a2a2a" }}>·</span>
          <span>ratio {(output.length / input.length).toFixed(2)}×</span>
        </div>
      )}

      {/* Mapping count footer */}
      <div style={{
        marginTop: 48,
        fontFamily: "monospace",
        fontSize: 11,
        color: "#2a2a2a",
        letterSpacing: 1,
        textAlign: "center",
      }}>
        {Object.keys(UNICODE_TO_FM).length} mappings loaded · longest-match-first algorithm
      </div>
    </div>
  );
}
