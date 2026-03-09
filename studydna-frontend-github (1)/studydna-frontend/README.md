# StudyDNA — Frontend

> React / Next.js · Personality-powered Nigerian university course recommendations

This repo contains the full UI for the StudyDNA platform — a 7-screen single-page app with a futuristic space/neon aesthetic.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.example .env.local
# Set NEXT_PUBLIC_API_URL to your backend URL

# 3. Start dev server on port 3000
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

> **Requires the backend running.** See [studydna-backend](https://github.com/your-org/studydna-backend).

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_API_URL` | ✅ | Backend URL. Dev: `http://localhost:4000` · Prod: your deployed backend URL |

---

## User Journey

```
Landing → Sign Up → Personality Test → Skills Test
       → Exam Chamber (WAEC/NECO + JAMB)
       → AI Analysis → Course Results → University Galaxy → AI Advisor
```

---

## Screens

| Screen | Description |
|--------|-------------|
| **Landing** | Hero + feature overview |
| **Sign Up** | Account creation |
| **Personality Test** | 10 questions, 5-point scale, live trait radar |
| **Skills Lab** | 5 skill assessment questions |
| **Exam Chamber** | WAEC/NECO grade entry per subject + JAMB score |
| **Processing** | Animated AI analysis step-through |
| **Course Results** | Ranked course cards with match % |
| **University Galaxy** | Per-university eligibility · Eligible / Possible / Ineligible |
| **AI Advisor** | Streaming Claude chat with course context |

---

## Design System

| Token | Value |
|-------|-------|
| Background | `#060810` |
| Neon cyan | `#00eaff` |
| Purple | `#7c3aed` |
| Gold | `#f59e0b` |
| Green | `#10b981` |
| Red | `#f43f5e` |
| Heading font | Orbitron |
| Body font | DM Sans |

---

## Project Structure

```
studydna-frontend/
├── src/
│   ├── app/
│   │   ├── layout.js     # Root HTML layout + metadata
│   │   ├── page.js       # Entry point — renders <StudyDNA />
│   │   └── StudyDNA.jsx  # Full application (all 9 screens)
│   └── lib/
│       └── api.js        # Backend API client (all fetch calls)
├── .env.example          # Environment variable template
├── next.config.js
└── package.json
```

---

## Deploy to Vercel

```bash
vercel --prod
```

Set `NEXT_PUBLIC_API_URL` in Vercel → Project Settings → Environment Variables to your production backend URL.
