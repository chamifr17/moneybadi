# MoneyBadi

MoneyBadi is a gamified personal finance web app that helps users track wallets, budgets, and daily money habits through a virtual companion called Badi.

## Problem

Money management is often scattered, boring, and reactive. People may use multiple bank accounts, cash, e-wallets, pay-later services, and credit accounts, but still struggle to understand their real financial situation or build consistent habits.

## Solution

MoneyBadi turns money tracking into a mobile-first companion experience. Users can view their wallets, track budgets, complete daily missions, earn coins, and interact with their Badi companion.

## Features

- Mobile web app interface
- Dark mode enabled by default
- Wallet cards for banks, cash, e-wallets, savings, pay-later, and credit
- Budget cards with spending progress
- Safe daily spend summary
- Daily missions with coin rewards
- Badi companion screen inspired by virtual pet games
- Coin and mood display for Badi
- Custom MoneyBadi purple theme using `#6A4DF5`

## Tech Stack

- React
- Vite
- Tailwind CSS
- Lucide React icons

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Run lint checks:

```bash
npm run lint
```

## Project Status

This is currently a hackathon prototype. Data is stored as mock data inside the React app. Planned next steps include:

- Add wallet creation, editing, and archiving
- Add budget creation and editing
- Add transaction tracking
- Save data with Supabase
- Add AI-powered Badi notifications and money advice
