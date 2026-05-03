# STREVO - Premium Habit & Fitness Tracking

STREVO is a high-impact, motivational habit tracking application designed to transform the workout experience. Built for consistency, it features dynamic storytelling, visual streaks, and a premium dark-mode aesthetic.

## ✨ Core Features

- **Dynamic Home Dashboard**: Real-time motivational headers, premium streak visualization, and weekly activity progress.
- **Hierarchical Workout Tracking**: Fast and fluid workout logging with a two-level selection system (Category → Subcategory).
- **Social-Ready Stories**: Programmatic 1080x1920 image generation for social sharing, featuring dynamic phrases, workout stats, and optional user photo composition.
- **Interactive Calendar & History**: A complete month-view grid highlighting workout consistency and providing detailed session breakdowns.
- **Smart Timer**: Persistent, timestamp-based background timer that remains accurate even if the app is minimized.
- **Gamified Engagement**: Streak-based rewards and human-centric motivational copy throughout the user journey.

## 🛠 Tech Stack

### Mobile (Expo)
- **Framework**: React Native with Expo.
- **State Management**: Zustand & AsyncStorage.
- **Navigation**: React Navigation (Stack).
- **Media**: Expo Image Picker, Camera, Media Library, and Sharing APIs.
- **Icons**: Lucide React Native.

### Backend (NestJS)
- **Core**: NestJS (Node.js framework).
- **Database**: SQLite (Development) / PostgreSQL (Production) via Prisma ORM.
- **Authentication**: JWT Strategy with Passport.
- **Graphics**: Node Canvas for high-performance server-side image generation.

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18+)
- **NPM** or **Yarn**
- **Expo Go** app on your physical device (optional but recommended)

### 1. Project Initialization
At the root of the project, run:
```bash
npm install
```
This will automatically install dependencies for both the `backend` and `mobile` folders.

### 2. Backend Setup
1. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
2. Set up your environment:
   - Create a `.env` file (see `.env.example`).
   - SQLite is used by default for rapid development.
3. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```
4. Start the server:
   ```bash
   npm run start:dev
   ```
The API will be available at `http://localhost:3000`.

### 3. Mobile Setup
1. Navigate to the `mobile` folder:
   ```bash
   cd mobile
   ```
2. Update the API connection:
   - Edit `src/config/api.ts` and set the `API_URL` to your machine's **local IP address** (e.g., `http://192.168.1.5:3000`) so your physical device can connect to the local server.
3. Start the development server:
   ```bash
   npx expo start
   ```
4. Scan the QR code with **Expo Go**.

---

## 🌐 Deployment

### Backend (Railway/Render)
- Link your GitHub repository.
- Set `DATABASE_URL` to a production PostgreSQL instance.
- Build Command: `npm install && npx prisma generate && npm run build`
- Start Command: `npx prisma migrate deploy && npm run start:prod`

### Mobile (EAS)
- Install EAS CLI: `npm install -g eas-cli`
- Update `API_URL` to your production endpoint.
- Build your distribution: `eas build -p [android|ios] --profile preview`

---

## 💡 Implementation Highlights
- **Server-Side Rendering (SSR) for Media**: STREVO doesn't just overlay text; it uses `Node Canvas` on the backend to bake stats and user photos into a high-quality PNG, ensuring branding consistency across all platforms.
- **Consistency Engine**: The `StreaksService` calculates active streaks in real-time during workout submission, ensuring the user's progress is always up-to-date.
- **Zero-Latency Timer**: By calculating duration based on start timestamps rather than a simple interval counter, the app remains reliable even under OS-level process suspension.

---

Built with ❤️ by the STREVO Team.
