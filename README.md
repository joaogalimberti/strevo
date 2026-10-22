<div align="center">

# STREVO

**Consistency is your edge.**

Log workouts, keep your streak alive, and turn every session into a story.

<br />

[![Demo](https://img.shields.io/badge/demo-online-00F5A0?style=for-the-badge&logo=githubpages&logoColor=black)](https://joaogalimberti.github.io/strevo/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev)

<br />

[**Live demo**](https://joaogalimberti.github.io/strevo/) · [Quick start](#-quick-start) · [Features](#-features) · [Deploy](#-deploy)

</div>

<br />

## ◆ About

STREVO is a high-performance app for workout tracking and fitness consistency, featuring a **futuristic dark-mode aesthetic**, gamified stats, and social media story generation.

The web version is **100% client-side**, responsive, and built with portfolios in mind: on desktop it runs inside a realistic iPhone shell; on mobile it goes full screen. No database, no server required.

<br />

## ◆ Quick start

```bash
npm run dev
```

Open **http://localhost:5173** and use **demo mode** to jump in with one click.

<br />

## ◆ Features

| | Feature | What it delivers |
|:-:|---|---|
| 🏠 | **Dashboard** | Animated streak with consistency ring, weekly progress (Mon–Sun), last session card, and rotating motivational quotes |
| ⏱️ | **Active session** | High-precision timer with SVG pulse ring, estimated calories, pace, and focus phrases |
| ✅ | **Workout logging** | Categories (Gym, Running, Cycling, Yoga, HIIT, Calisthenics), muscle groups, intensity with dynamic calorie calculation, photo, and notes |
| 🎨 | **Story generator** | **1080×1920 (9:16)** canvas with 4 themes, photo, workout data, streak, and @username. One-click PNG download and native sharing |
| 📅 | **Calendar** | Month navigation, neon-glow workout days, detail modal, and chronological history |
| 👤 | **Profile** | Athlete level with XP bar, achievements and badges, lifetime metrics, and account switching |
| 🔐 | **Auth & onboarding** | Login, sign-up, and instant demo mode |

<details>
<summary><b>Story generator themes</b></summary>

<br />

| Theme | Style |
|---|---|
| **Neon Cyber** | High contrast, neon glow |
| **Obsidian Minimal** | Dark and clean |
| **Solar Flame** | Warm, energetic tones |
| **Clean White** | Light and editorial |

</details>

<br />

## ◆ Structure

```
strevo/
├── frontend/    React + TypeScript + Vite   → web app (portfolio)
├── backend/     NestJS + Prisma             → API (SQLite / PostgreSQL)
├── mobile/      React Native + Expo         → native app
└── package.json                             → orchestration scripts
```

<br />

## ◆ Commands

| Command | Description |
|---|---|
| `npm run dev` | Starts the frontend on port `5173` |
| `npm run build` | Builds for production into `frontend/dist` |
| `npm run deploy` | Publishes the build to the `gh-pages` branch |
| `npm run dev:backend` | Starts the NestJS API in dev mode |
| `npm run dev:mobile` | Starts the mobile app with Expo |

<br />

