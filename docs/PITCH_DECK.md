# PennyMon Pitch Deck Outline

Use up to 10 slides for preliminary judging and up to 12 slides for final judging.

## 1. Title

- App name: PennyMon
- Tagline: A playful money companion for better spending habits
- Team name
- Team members

## 2. Problem

- Money tracking is scattered across banks, cash, e-wallets, credit, and pay-later services.
- People often only notice problems after overspending.
- Financial literacy content is usually boring and hard to maintain as a habit.

## 3. Target Users

- Students
- Young adults
- First-time budgeters
- People using multiple money sources
- Users who want simple and visual money guidance

## 4. Solution

PennyMon turns money tracking into a virtual companion experience. Users track wallets, budgets, expenses, and debt while PennyMon reacts to their financial behavior.

## 5. Key Features

- Wallet tracking
- Budget tracking
- Add expense and settle debt
- Expense history and spending graph
- Daily quests and Monny rewards
- PennyMon mood system
- Room, colour, and accessory customization
- AI preset questions and financial tips

## 6. User Flow / Demo

- Register or login
- Add wallet and budget
- Add an expense
- View home spending summary
- Complete daily quest and earn Monny
- Customize PennyMon
- Double tap PennyMon and ask an AI question

## 7. AI Approach

- User taps a preset question.
- App sends the question and finance summary to a Supabase Edge Function.
- Edge Function calls Gemini API.
- PennyMon returns short, friendly advice.
- Fallback answers protect the demo if AI quota fails.

## 8. Technology Used

- React
- Vite
- Tailwind CSS
- Supabase Auth
- Supabase Database
- Supabase Edge Functions
- Gemini API
- Lucide React

## 9. Business Model / Viability

- Freemium app
- Premium AI insights
- Student partnership plans
- School or university financial literacy programs
- Future fintech/e-wallet collaborations

## 10. Impact and Future Plan

- Builds consistent money habits
- Makes financial health easier to understand
- Helps users notice spending issues earlier
- Future DuitNow/e-wallet integration
- More AI insights and PennyMon customization

## Optional Final Slides

## 11. System Architecture

Show frontend, Supabase, Edge Function, Gemini API, and database flow.

## 12. Closing / Ask

Summarize why PennyMon is useful, fun, and scalable.
