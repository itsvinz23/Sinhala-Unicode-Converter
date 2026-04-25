# <p align="center">✨ සිංහල Unicode Converter | BETA v1.01 ✨</p>

<div align="center">
  <img src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJidm9idjJidm9idjJidm9idjI/l41lTjJ9zV5Lw8Yy8/giphy.gif" width="600" alt="Animated Banner" />
  <br />
  <p align="center">
    <b>A high-fidelity, bidirectional conversion engine for Sinhala Typography.</b>
    <br />
    <sub>Engineered by <a href="https://github.com/itsvinz23">VinZ</a> • Software Engineering Student @ NIBM</sub>
  </p>

  <img src="https://img.shields.io/badge/Status-BETA_v1.01-red?style=for-the-badge&logo=git&logoColor=white" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Production-Ready-green?style=for-the-badge" />
</div>

---

## 🚀 The Mission
This tool was engineered to solve the "Web-to-Print" gap. While the internet uses **Unicode**, professional design suites (Photoshop, Premiere Pro, FL Studio) still rely heavily on **FM Abhaya** (Legacy/ASCII) encoding for advanced typography. 

This converter allows you to write in modern Sinhala and instantly flip it into a legacy format compatible with your favorite production tools.

---

## ✨ Features
- **⚡ Longest-Match-First Algorithm:** Correctly handles complex Sinhala ligatures (Kombuwa, Hal-kiriema).
- **🔄 Fully Bidirectional:** Convert `Unicode → FM` or `FM → Unicode` with zero friction.
- **🎨 Premium Glassmorphism UI:** A sleek, developer-centric interface with gold accents.
- **📋 Smart Clipboard:** One-tap copy with animated visual feedback.

---

## 🛤️ Expected Roadmap
| Phase | Milestone | Description |
| :--- | :--- | :--- |
| **Q2 2026** | **v1.02: Smart Filtering** | Auto-detect English text and numbers to prevent scrambling. |
| **Q3 2026** | **v1.03: Live Preview** | Toggle between Unicode and FM font rendering in the output box. |
| **Q4 2026** | **v1.04: Mobile Sync** | Optimized PWA support for mobile production tweaks. |
| **2027** | **v2.0: API Access** | Public API for other developers to integrate the conversion logic. |

---

## ⚠️ KNOWN ERRORS (The "Beta" Reality)
- **English Scrambling:** Latin text (like *"Valorant"* or *"Hit Registration"*) gets scrambled because FM encoding reuses Latin keys.
- **Missing Characters:** Rare characters like **ඥ, ඤ** or **ළු** may pass through unchanged in this version.
- **Visual Glitch:** Output will look like "gibberish" until you apply the **FM Abhaya** font in your software.

---

## 🛠️ Installation

```bash
# Clone the repository
git clone [https://github.com/itsvinz23/Sinhala-Unicode-Converter.git](https://github.com/itsvinz23/Sinhala-Unicode-Converter.git)

# Install dependencies
npm install

# Launch Development Server
npm run dev
