# Marily Tamm — Creative Technologist Portfolio

A bilingual (Estonian / English) personal portfolio built with React and Vite, featuring an interactive particle cloud animation, data visualizations, and a clean dark aesthetic.

🌐 **Live site:** [your-project.vercel.app](https://your-project.vercel.app)  
💻 **GitHub:** [github.com/marily77](https://github.com/marily77)

---

## Features

- **Bilingual** — full Estonian / English language toggle powered by i18next
- **Interactive particle cloud** — generative canvas animation on the hero section
- **Data visualization** — interactive charts built with Recharts
- **Project showcase** — cards driven by a local JSON data source
- **Responsive design** — mobile-friendly layout with fluid typography using `clamp()`
- **Dark theme** — custom design system with CSS variables and a signature yellow accent

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + Vite 8 |
| Routing | React Router DOM v7 |
| Internationalisation | i18next + react-i18next |
| Data visualisation | Recharts |
| Animation | Canvas API (vanilla) |
| Styling | CSS custom properties |
| Deployment | Vercel |

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Navigation + language toggle
│   ├── ParticleCloud.jsx   # Generative canvas animation
│   └── Footer.jsx
├── pages/
│   ├── Home.jsx            # Hero section
│   ├── Projects.jsx        # Project cards from JSON
│   ├── DataViz.jsx         # Interactive charts
│   ├── About.jsx           # Background and skills
│   └── Contact.jsx
├── i18n/
│   ├── index.js            # i18next configuration
│   └── locales/
│       ├── en.json         # English translations
│       └── et.json         # Estonian translations
├── data/
│   └── projects.json       # Project data source
├── App.jsx                 # Router setup
├── main.jsx
└── index.css               # Global design system
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
git clone https://github.com/marily77/minu-portfolio.git
cd minu-portfolio
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

---

## Design System

The visual identity is built on a minimal dark palette with a signature yellow accent:

| Token | Value | Usage |
|---|---|---|
| `--bg` | `#0e0e0e` | Page background |
| `--accent` | `#e8ff6b` | Highlights, CTAs |
| `--text` | `#c8c4bc` | Body text |
| `--text-heading` | `#f0ece4` | Headings |
| `--font-heading` | Syne 800 | Display text |
| `--font-body` | DM Mono | Body and UI |

---

## About

Marily Valkijainen is a designer-developer with a background spanning graphic design, interactive graphics, floristry, and fine art — now expanding into frontend development and data science.

This portfolio reflects that multidisciplinary identity: technical precision meets visual sensibility.

---

## License

MIT