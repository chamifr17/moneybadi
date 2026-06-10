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

## Feature Guide

### Authentication and Onboarding

Users register or log in with email and password through Supabase Auth. New users are guided to create at least one wallet and one budget before the Expense and PennyMon pages become useful. This prevents users from logging incomplete expenses without a money source or budget category.

### Wallets

Wallets represent where money comes from. Supported wallet types include Bank, Cash, E-wallet, Credit, and Pay later. Bank, Cash, and E-wallet balances contribute to available cash. Credit and Pay later wallets are treated as credit-line accounts, where the balance represents the usable remaining limit.

Wallet cards support left-swipe actions for adding amount, editing, and deleting. PiggyBank wallets can be marked as protected savings so they are excluded from safe-to-spend calculations.

### Pay Later and Debt Control

Pay later and credit wallets are restricted during expense entry. If the user enters an expense amount that exceeds the wallet's available limit, that Pay later or credit wallet is hidden from the `Paid from` dropdown. If a Pay later wallet has no usable limit left, the wallet page tells the user to settle the debt before continuing to use it.

Debt settlement is handled through the Expense page's `Debt` mode. A payment updates the paying wallet, reduces the target debt wallet, and records the payment in expense history.

### Budgets

Budgets track category limits such as Food, Transport, and Entertainment. Each budget shows spent amount, limit amount, progress percentage, and over-limit feedback. Budget cards also support left-swipe actions for adding limit, editing, and deleting.

### Expenses

The Expense page lets users record spending by selecting amount, paid-from wallet, budget category, date, and note. Saving an expense updates the wallet balance, the budget spent amount, expense history, today's spending, and PennyMon mood.

### Home Dashboard

The Home page summarizes the user's current financial state. It shows today's spending, available balance, debt, true balance, daily quests, and PennyMon's current mood. The main purple card can be flipped to show a daily spending insight.

### Expense History and Weekly Graph

Expense history is grouped by month and week. By default, it opens to the current month. The graph shows recent spending trends so users can understand spending behavior over time instead of only viewing individual transactions.

### Daily Quests and Monny

Daily quests reward positive money habits with Monny. Monny is the in-app reward currency used to customize PennyMon. Quest state is currently stored locally for the prototype.

### PennyMon Customization

Users can customize PennyMon with rooms, colors, and accessories. These items create a gamified loop: users track money, complete quests, earn Monny, and personalize their companion.

### Ask PennyMon

Users can double tap PennyMon to open quick question prompts such as `Budget check`, `Debt check`, and `Can I spend today?`. The app sends a financial summary to a Supabase Edge Function, which calls Gemini for a short response. If the AI service is unavailable, the app falls back to local rule-based answers.

## PennyMon Mood Rules

PennyMon mood is calculated from budgets, debt, today's spending, and shop activity. The rules are checked in priority order, so higher-risk financial conditions override lower-risk moods.

| Angry | Sad | Worried |
|---|---|---|
| <img src="src/assets/pennymon/angry.png" alt="Angry PennyMon" width="120" /> | <img src="src/assets/pennymon/sad.png" alt="Sad PennyMon" width="120" /> | <img src="src/assets/pennymon/worried.png" alt="Worried PennyMon" width="120" /> |

| Excited | Calm | Happy |
|---|---|---|
| <img src="src/assets/pennymon/excited.png" alt="Excited PennyMon" width="120" /> | <img src="src/assets/pennymon/calm.png" alt="Calm PennyMon" width="120" /> | <img src="src/assets/pennymon/happy.png" alt="Happy PennyMon" width="120" /> |

### Angry

<img src="src/assets/pennymon/angry.png" alt="Angry PennyMon" width="120" />

PennyMon becomes Angry if any budget reaches `120%` or more of its limit.

Example: a budget with RM100 limit becomes Angry at RM120 spent or higher.

PennyMon also becomes Angry if total debt is higher than available cash.

Example: available cash is RM100, but debt is RM150.

### Sad

<img src="src/assets/pennymon/sad.png" alt="Sad PennyMon" width="120" />

PennyMon becomes Sad if any budget is over its limit but below the 120% Angry threshold.

Example: a budget with RM100 limit and RM105 spent.

### Worried

<img src="src/assets/pennymon/worried.png" alt="Worried PennyMon" width="120" />

PennyMon becomes Worried if any budget has used `90%` or more of its limit.

Example: a budget with RM100 limit and RM90 spent.

### Excited

<img src="src/assets/pennymon/excited.png" alt="Excited PennyMon" width="120" />

PennyMon becomes Excited if the user bought a PennyMon shop item today and still has at least RM50 safe-to-spend per day.

### Calm

<img src="src/assets/pennymon/calm.png" alt="Calm PennyMon" width="120" />

PennyMon becomes Calm when the user has logged spending today and budgets are still under control.

### Happy

<img src="src/assets/pennymon/happy.png" alt="Happy PennyMon" width="120" />

Happy is the default stable mood. PennyMon is Happy when there are no urgent budget, debt, or spending concerns.

## Tech Stack

- React 19: frontend UI
- Vite: development server and build tool
- Tailwind CSS 4: styling
- Lucide React: icons
- Supabase Auth: login and signup
- Supabase Database: wallets, budgets, expenses, and PennyMon profile data
- Supabase Edge Functions: backend API for AI requests
- Google Gemini API: PennyMon AI responses

## Frontend Architecture

PennyMon uses a feature-sliced frontend architecture with a service/data boundary around Supabase. The app is organised by product capabilities instead of only by file type, so finance logic, quest logic, local prototype storage, and shared formatting utilities can evolve independently from the UI.

```txt
src/
  App.jsx                    # App shell and screen composition
  features/
    auth/services/           # Supabase Auth boundary
    ai/services/             # Edge Function AI boundary
    money/services/          # Wallet, budget, and expense data access
    money/utils/             # Wallet, budget, expense, debt, mood calculations
    pennymon/services/       # PennyMon profile persistence
    quests/utils/            # Daily quest rules
  shared/
    storage/                 # Prototype localStorage persistence helpers
    utils/                   # Date and money formatting helpers
  lib/
    supabase.js              # Supabase client factory only
```

This keeps judge-visible demo screens stable while separating the core business rules from React markup. Prototype-only localStorage state can later move into Supabase tables such as `quest_progress`, `owned_items`, and `shop_purchases` without rewriting the UI.

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

### Part 1: First-Time User Setup

| New User Home Page | Setup Required: Wallet and Budget Needed | Locked Daily Quests |
|---|---|---|
| <img src="docs/screenshots/part-1-01-new-user-home-page.png" alt="New User Home Page" width="220" /><br />New users start from a guided home page. | <img src="docs/screenshots/part-1-02-setup-required-wallet-budget.png" alt="Setup Required: Wallet and Budget Needed" width="220" /><br />Users must set up a wallet and budget before daily insight, Add Expense, and PennyMon unlock. | <img src="docs/screenshots/part-1-03-locked-daily-quests.png" alt="Locked Daily Quests" width="220" /><br />Daily quests guide users to complete money habits and earn Monny. |

| Wallet Setup Required | Budget Setup Required |
|---|---|
| <img src="docs/screenshots/part-1-04-wallet-setup-required.png" alt="Wallet Setup Required" width="220" /><br />The Wallet page guides users to add their first wallet. | <img src="docs/screenshots/part-1-05-budget-setup-required.png" alt="Budget Setup Required" width="220" /><br />The Budget page guides users to create their first budget. |
### Part 2: Demo Account With Rich Data

| Step 1 | Step 2 | Step 3 |
|---|---|---|
| <img src="docs/screenshots/part-2-01-demo-dashboard.png" alt="Part 2 Step 1" width="220" /> | <img src="docs/screenshots/part-2-02-mood-explanation.png" alt="Part 2 Step 2" width="220" /> | <img src="docs/screenshots/part-2-03-daily-insight-card.png" alt="Part 2 Step 3" width="220" /> |

| Step 4 | Step 5 | Step 6 |
|---|---|---|
| <img src="docs/screenshots/part-2-04-daily-quests.png" alt="Part 2 Step 4" width="220" /> | <img src="docs/screenshots/part-2-05-wallet-overview.png" alt="Part 2 Step 5" width="220" /> | <img src="docs/screenshots/part-2-06-wallet-swipe-actions.png" alt="Part 2 Step 6" width="220" /> |

| Step 7 | Step 8 | Step 9 |
|---|---|---|
| <img src="docs/screenshots/part-2-07-paylater-limit-protection.png" alt="Part 2 Step 7" width="220" /> | <img src="docs/screenshots/part-2-08-budget-overview.png" alt="Part 2 Step 8" width="220" /> | <img src="docs/screenshots/part-2-09-budget-swipe-actions.png" alt="Part 2 Step 9" width="220" /> |

| Step 10 | Step 11 | Step 12 |
|---|---|---|
| <img src="docs/screenshots/part-2-10-add-expense-form.png" alt="Part 2 Step 10" width="220" /> | <img src="docs/screenshots/part-2-11-smart-wallet-dropdown.png" alt="Part 2 Step 11" width="220" /> | <img src="docs/screenshots/part-2-12-paylater-hidden.png" alt="Part 2 Step 12" width="220" /> |

| Step 13 | Step 14 | Step 15 |
|---|---|---|
| <img src="docs/screenshots/part-2-13-expense-saved.png" alt="Part 2 Step 13" width="220" /> | <img src="docs/screenshots/part-2-14-current-month-history.png" alt="Part 2 Step 14" width="220" /> | <img src="docs/screenshots/part-2-15-weekly-spending-trend.png" alt="Part 2 Step 15" width="220" /> |

| Step 16 | Step 17 | Step 18 |
|---|---|---|
| <img src="docs/screenshots/part-2-16-previous-month-history.png" alt="Part 2 Step 16" width="220" /> | <img src="docs/screenshots/part-2-17-pennymon-customization.png" alt="Part 2 Step 17" width="220" /> | <img src="docs/screenshots/part-2-18-ask-pennymon.png" alt="Part 2 Step 18" width="220" /> |

| Step 19 |
|---|
| <img src="docs/screenshots/part-2-19-ai-answer.png" alt="Part 2 Step 19" width="220" /> |

## Demo Data

For final-round rehearsal or judging, use the repeatable seed file:

```txt
supabase/demo_seed.sql
```

Create/register the final demo auth user first, then run the SQL file in the Supabase SQL editor.

```txt
Email: pennymondemo@gmail.com
Password: pennymondemo11
Username: PennyMon Demo
```

The seed resets only that user's PennyMon data and inserts realistic wallets, budgets, expenses, PayLater debt, PiggyBank savings, and PennyMon profile coins. A suggested live walkthrough is documented in `docs/DEMO_WALKTHROUGH.md`.

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
- Aishah Soffi: PennyMon artwork, moods, rooms, colours, and accessories
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
- Original PennyMon artwork by Aishah Soffi

## License

This project is licensed under the MIT License. See `LICENSE`.





