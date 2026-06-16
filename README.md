# Japan Business Phrase Generator

**「ビジネス日本語フレーズ生成ツール」**

*Type your situation → Get the perfect Japanese business phrase instantly*

A mobile-first web app that helps foreign workers, international students, and professionals living and working in Japan find the right Japanese business phrase for any situation.

**Live URL:** [https://zainqualitextradingllc-zain.github.io/japan-phrase-gen/](https://zainqualitextradingllc-zain.github.io/japan-phrase-gen/)

**Repository:** [https://github.com/zainqualitextradingllc-zain/japan-phrase-gen](https://github.com/zainqualitextradingllc-zain/japan-phrase-gen)

---

## Features

- **30 curated business phrases** across 8 real-world categories (email, meetings, phone, interviews, and more)
- **Browse by situation** — tap a category to see commonly used phrases
- **Live keyword search** — filter by English, Japanese, romaji, or tags
- **Phrase detail view** — Japanese, romaji, English, usage context, and example dialogue
- **Copy to clipboard** — one tap to copy the Japanese phrase
- **Text-to-speech** — hear pronunciation via Web Speech API (`ja-JP`)
- **Favorites** — save phrases with ❤️ for quick access
- **Progress tracker** — visual bar showing explored phrases (saved in `localStorage`)
- **Quiz mode** — guess the English meaning from Japanese (10 questions, score tracked)
- **Formality filters** — All / Very Formal / Formal / Casual
- **PWA support** — install on your phone for offline access
- **Smooth slide transitions** between screens
- **Bottom navigation** — Home, Browse, Search, Favorites, Quiz

---

## Tech Stack

- Pure HTML5, CSS3, and Vanilla JavaScript
- No frameworks, no npm, no external JS libraries
- Google Fonts only (Playfair Display, Noto Sans JP, Noto Serif JP)
- GitHub Pages compatible (relative paths)

---

## Project Structure

```
japan-phrase-gen/
├── index.html
├── manifest.json
├── sw.js
├── css/
│   └── styles.css
├── js/
│   ├── data.js       # Phrase database
│   ├── utils.js      # Copy, TTS, toast, localStorage
│   └── app.js        # Navigation, UI, quiz, favorites
├── assets/
│   ├── favicon.ico
│   ├── favicon.svg
│   ├── icon-192.png
│   └── icon-512.png
└── .github/workflows/deploy.yml
```

---

## Local Development

Open `index.html` in a browser, or serve the folder with any static server:

```bash
# Python
python -m http.server 8080

# Then visit http://localhost:8080
```

> Service worker and PWA features require HTTPS or `localhost`.

---

## Deploy to GitHub Pages

This project auto-deploys via GitHub Actions on every push to `main`.

1. Push to `https://github.com/zainqualitextradingllc-zain/japan-phrase-gen`
2. Go to **Settings → Pages → Build and deployment**
3. Set source to **GitHub Actions**
4. The workflow in `.github/workflows/deploy.yml` publishes the site automatically

---

## Branding & Copyright

| | |
|---|---|
| **Product** | Japan Business Phrase Generator |
| **Brand** | TechReads® |
| **Parent company** | Qualitex Trading LLC |
| **Relationship** | TechReads® is a sub-brand of Qualitex Trading LLC |

**TechReads®** — Powered by Qualitex Trading LLC

Copyright © 2026 **Qualitex Trading LLC**. All Rights Reserved.

TechReads® is a registered trademark of Qualitex Trading LLC. Unauthorized reproduction, distribution, or modification of this application or its content is prohibited without prior written permission from Qualitex Trading LLC.

For licensing, partnerships, or commercial use inquiries, contact Qualitex Trading LLC.