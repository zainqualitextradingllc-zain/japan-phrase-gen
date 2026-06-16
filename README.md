# Japan Business Phrase Generator

**「ビジネス日本語フレーズ生成ツール」**

A mobile-first web app that helps foreign workers, international students, and professionals in Japan find the perfect Japanese business phrase for any situation.

**Live URL:** `https://YOUR_USERNAME.github.io/japan-phrase-gen/`

> Replace `YOUR_USERNAME` with your GitHub username after deploying.

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

1. Create a new GitHub repo named `japan-phrase-gen`
2. Push this folder to the `main` branch
3. Go to **Settings → Pages → Build and deployment**
4. Set source to **GitHub Actions**
5. The workflow in `.github/workflows/deploy.yml` deploys automatically on push

Your app will be live at: `https://[username].github.io/japan-phrase-gen/`

---

## Branding

**TechReads®** — Powered by Qualitex Trading LLC

© 2026 TechReads® All Rights Reserved