# STREVO - Habit & Fitness Tracking MVP

STREVO is a minimalist habit and fitness tracking app focused on tracking workout sessions and generating premium, shareable social stories automatically.

## Tech Stack
- **Mobile**: React Native, Expo, TypeScript, Zustand, React Navigation.
- **Backend**: NestJS, Prisma, PostgreSQL, JWT Authentication.
- **Image Generation**: Node Canvas (server-side generation).

---

## 🚀 Running Locally

### Prerequisites
1. **Node.js** (v18+)
2. **PostgreSQL** database (Local or Supabase/Neon).

### Backend Setup
1. Open terminal and navigate to \`backend\` directory:
   \`\`\`bash
   cd backend
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Create a \`.env\` file in the \`backend\` directory and add your Postgres URL:
   \`\`\`env
   DATABASE_URL="postgresql://user:password@localhost:5432/strevo"
   \`\`\`
4. Run Prisma Migrations:
   \`\`\`bash
   npx prisma migrate dev --name init
   \`\`\`
5. Start the backend server:
   \`\`\`bash
   npm run start:dev
   \`\`\`

The server will be running on \`http://localhost:3000\`.

### Mobile App Setup
1. Open a new terminal and navigate to \`mobile\` directory:
   \`\`\`bash
   cd mobile
   \`\`\`
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`
3. Start the Expo development server:
   \`\`\`bash
   npx expo start
   \`\`\`
4. Press \`a\` to open on Android emulator, or \`i\` for iOS simulator, or scan the QR code with the Expo Go app on your physical device.

**Note**: By default, the mobile app connects to \`http://10.0.2.2:3000\` (which is localhost for Android Emulators). If you're testing on an iOS simulator or a physical device, update \`API_URL\` in \`mobile/src/config/api.ts\` to your machine's local IP address (e.g., \`http://192.168.1.5:3000\`).

---

## 🌐 Deployment Steps

### Backend Deployment (Railway / Render)
1. Push your code to GitHub.
2. Go to [Railway.app](https://railway.app/) or [Render.com](https://render.com/).
3. Create a new PostgreSQL database service.
4. Create a new Web Service and link your GitHub repository.
5. Set the following Environment Variables in the service settings:
   - \`DATABASE_URL\` (URL to the Postgres DB you just created)
   - \`PORT\` (usually handled automatically by Railway/Render, but good to know)
6. Set the Build Command:
   \`\`\`bash
   npm install && npx prisma generate && npm run build
   \`\`\`
7. Set the Start Command:
   \`\`\`bash
   npm run start:prod
   \`\`\`
   *(Note: Ensure you run migrations on deployment. You might need to add \`npx prisma migrate deploy\` before starting the server).*

### Mobile App Deployment (Expo EAS)
1. Install EAS CLI:
   \`\`\`bash
   npm install -g eas-cli
   \`\`\`
2. Login to Expo:
   \`\`\`bash
   eas login
   \`\`\`
3. Configure the project:
   \`\`\`bash
   eas build:configure
   \`\`\`
4. Update \`API_URL\` in \`mobile/src/config/api.ts\` to point to your deployed backend URL.
5. Build for Android:
   \`\`\`bash
   eas build -p android --profile preview
   \`\`\`
6. Build for iOS:
   \`\`\`bash
   eas build -p ios --profile preview
   \`\`\`

---

## 💡 Architecture & Implementation Details
- **Clean Architecture**: The NestJS backend separates concerns into modules, services, and controllers.
- **Background Timer**: The active workout's start time is persisted using Zustand and AsyncStorage, allowing the timer to continue calculating even if the app closes.
- **Streaks**: A server-side cron or per-workout check mechanism. Currently calculated accurately at the time of workout submission in the \`StreaksService\`.
- **Premium Stories**: The backend uses \`canvas\` to programmatically generate a beautiful 1080x1920 PNG image. Various themes are implemented (Dark Minimal, Neon Fitness, Clean White).
- **Share Flow**: On the mobile app, when generating a story, the app fetches the URL, downloads it using \`expo-file-system\`, and invokes the native share sheet with \`expo-sharing\`.
