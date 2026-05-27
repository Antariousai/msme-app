# msme-app

Antarious MSME Business Companion — a mobile-first Expo app for Bangladesh MSME businesses.

## Stack

- Expo SDK 54
- React Native + TypeScript
- Tier-based features (0–4) with inherited tool access

## Run locally

```bash
npm install
npm start
```

- **Web:** press `w` or `npm run web`
- **Phone:** scan QR with [Expo Go](https://expo.dev/go) (SDK 54)

## Demo login (PIN: `1234`)

| Phone | Tier |
|-------|------|
| `01700000000` | 0 — Offline |
| `01800000001` | 1 — Starter |
| `01900000002` | 2 — Growth |
| `01700000003` | 3 — Pro |
| `01800000004` | 4 — Enterprise |

## Deploy web (Vercel)

```bash
npx expo export -p web
```

Output directory: `dist`
