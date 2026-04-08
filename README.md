# Al-Rahma Frontend (Vite + React)

## Local Development

1. Install dependencies:
	npm install
2. Copy environment template:
	copy .env.example .env.local
3. Start dev server:
	npm run dev

## Backend Connection

The frontend resolves prayer times in this order:

1. Firebase Realtime Database (`mosque/prayerTimes`)
2. Public fallback API (`api.aladhan.com`)

## Deploy To Vercel

1. Import the `vite-project` folder in Vercel.
2. Framework preset: `Vite`.
3. Build command: `npm run build`.
4. Output directory: `dist`.
5. Add all `VITE_...` variables from `.env.example` in Vercel Project Settings -> Environment Variables.
6. Redeploy.
