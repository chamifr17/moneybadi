# PennyMon Demo Walkthrough

Use this flow for a reliable final-round demo after seeding the demo account with `supabase/demo_seed.sql`.

## Demo Account Setup

1. Register or create this Supabase Auth user: email `pennymondemo@gmail.com`, password `pennymondemo11`, username `PennyMon Demo`.
2. Run `supabase/demo_seed.sql` in the Supabase SQL editor.
3. Log in as the demo user in the app.
4. If needed, buy one PennyMon item during rehearsal so the shop flow is familiar. The seed gives the user 260 Monny.

## Suggested Live Flow

1. Login and show the home dashboard.
2. Explain the core idea: PennyMon turns daily money tracking into caring for a finance companion.
3. Show wallets: bank, e-wallet, cash, pay-later, and protected PiggyBank savings.
4. Show budgets, especially Entertainment near its limit.
5. Add a small Food expense for today.
6. Return home and show safe-to-spend, today's spending, and PennyMon mood feedback.
7. Open PennyMon and ask: `Budget check` or `Can I spend today?`.
8. Show that PennyMon gives short financial advice through the AI feature, with local fallback if the AI service is unavailable.
9. Use Monny to customize PennyMon with a room, color, or accessory.

## Q&A Points

- Supabase Auth and Row Level Security protect each user's financial records.
- Gemini is called through a Supabase Edge Function, so the API key is not exposed in the frontend.
- Prototype-only gamification state currently uses localStorage and is designed to move into Supabase tables later.
- Manual tracking is the first version; bank/e-wallet integrations are future growth once compliance and partnerships are ready.


