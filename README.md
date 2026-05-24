# PennyMon

PennyMon is a mobile-first, gamified personal finance web app that helps users track wallets, budgets, expenses, debt, and daily money habits through a virtual money companion.

## Problem Statement

Many people use more than one money source: bank accounts, cash, e-wallets, credit cards, and pay-later services. Because the information is scattered, it becomes difficult to know how much money is safe to spend, which budget is at risk, and whether daily spending habits are healthy. Most financial literacy tools also feel boring, so users do not return consistently.

## Solution

PennyMon makes money tracking feel like caring for a virtual companion. Users log expenses, monitor wallets and budgets, complete daily quests, earn Monny, customize PennyMon, and ask PennyMon for friendly AI-powered financial insights.

## Main Features

- User registration and login with Supabase Auth
- Wallet tracking for bank, cash, e-wallet, credit, and pay-later sources
- PiggyBank marker for protected savings wallets
- Budget tracking with spending progress and over-limit feedback
- Add expense and settle debt flows
- Expense history by month and week
- Daily spending graph and insight card
- Swipe-to-delete expense history
- Daily quests with Monny rewards
- PennyMon mood system based on spending, budget, debt, and purchases
- PennyMon room, colour, and accessory shop
- AI question presets using Supabase Edge Function + Gemini API
- Mobile-first dark interface with fixed bottom navigation

## Tech Stack

- React 19: frontend UI
- Vite: development server and build tool
- Tailwind CSS 4: styling
- Lucide React: icons
- Supabase Auth: login and signup
- Supabase Database: wallets, budgets, expenses, and PennyMon profile data
- Supabase Edge Functions: backend API for AI requests
- Google Gemini API: PennyMon AI responses

## System Architecture

```txt
React mobile web app
  -> Supabase Auth for user sessions
  -> Supabase tables for wallets, budgets, expenses, profiles
  -> localStorage for daily quest state, owned items, purchases, PiggyBank flags
  -> Supabase Edge Function ask-pennymon
       -> Gemini API
       -> PennyMon answer returned to frontend
```

The frontend never stores the Gemini API key. The key is stored as a Supabase secret and used only inside the Edge Function.

## Setup and Installation

Prerequisites:

- Node.js
- npm
- Supabase project
- Gemini API key

Install dependencies:

```bash
npm install
```

Create a local environment file:

```bash
cp .env.example .env.local
```

Fill in your Supabase values inside `.env.local`.

## Run Locally

Run on laptop only:

```bash
npm run dev
```

Run so a phone on the same network can test it:

```bash
npm run dev -- --host 0.0.0.0
```

Then open the network URL shown by Vite, for example:

```txt
http://192.168.x.x:5173
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

## Environment Variables

Frontend `.env.local`:

```env
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Supabase Edge Function secret:

```bash
npx supabase secrets set "GEMINI_API_KEY=your_gemini_api_key" --project-ref your_project_ref
```

Do not commit `.env.local` or API keys.

## Database Setup

SQL setup files are in the `supabase/` folder:

- `supabase/schema.sql`
- `supabase/rename_badi_to_pennymon.sql`
- `supabase/drop_badi_outfit.sql`
- `supabase/update_badi_profile_defaults.sql`
- `supabase/update_pennymon_mood_default.sql`

Core data used by the app:

- `wallets`: user money sources and balances
- `budgets`: user budget categories, limits, and spent amounts
- `expenses`: transaction history
- `pennymon_profiles`: coins, mood, equipped room, and equipped accessory

Some hackathon prototype state is stored in `localStorage`, including daily quest claims, owned shop items, PiggyBank markers, and daily purchases.

## Backend / API

The backend AI function is:

```txt
supabase/functions/ask-pennymon/index.ts
```

Deploy it with:

```bash
npx supabase functions deploy ask-pennymon --project-ref your_project_ref
```

The frontend calls it using:

```js
supabase.functions.invoke('ask-pennymon', ...)
```

## AI Features

Users can double tap PennyMon to show preset questions such as:

- Why do you feel this way?
- Can I spend today?
- Top spending today?
- Budget check
- Debt check
- Wallet check

PennyMon sends the selected question and a finance summary to the Edge Function. Gemini returns a short, friendly response. If the AI call fails, the app uses local fallback answers so the demo still works.

## Screenshots



## Demo Account

No public demo account is included by default. For judging, create a temporary Supabase Auth user and add demo wallets, budgets, and expenses before the presentation.

## Known Limitations

- Gemini free-tier quota or billing limits may cause AI responses to fall back to local answers.
- Some shop ownership and daily quest states are stored in `localStorage`.
- Bank/e-wallet data is manually entered; there is no real bank integration yet.
- The app is optimized for mobile web and may need additional desktop layout polish.

## Future Improvements

- DuitNow and e-wallet integration
- Better AI monthly summaries and spending predictions
- Cloud-synced shop ownership and quest history
- Push notifications for spending warnings
- More PennyMon rooms, colours, accessories, and animations
- Exportable spending reports
- Admin/demo mode for judges

## Team Members and Roles

- Chami: frontend development, Supabase integration, product flow
- PennyMon artwork/design teammate: PennyMon moods, rooms, colours, accessories
- Additional teammates: update this section with names and responsibilities

## AI Tools Used

- Codex / ChatGPT: coding assistance, UI iteration, debugging, README drafting
- Gemini API: PennyMon AI finance assistant responses

## Open-Source Libraries and Credits

- React
- Vite
- Tailwind CSS
- Lucide React
- Supabase JavaScript Client
- Supabase Edge Functions
- Google Gemini API

## License

This project is licensed under the MIT License. See `LICENSE`.
