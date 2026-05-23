create table if not exists public.wallets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  type text not null,
  balance numeric(12, 2) not null default 0,
  tone text not null default 'bg-[#eeeaff]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.budgets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  spent numeric(12, 2) not null default 0,
  limit_amount numeric(12, 2) not null,
  color text not null default 'bg-[#6A4DF5]',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  wallet_id uuid references public.wallets(id) on delete set null,
  budget_id uuid references public.budgets(id) on delete set null,
  account_name text not null,
  budget_name text not null,
  amount numeric(12, 2) not null check (amount > 0),
  date date not null default current_date,
  note text not null default 'Expense',
  created_at timestamptz not null default now()
);

create table if not exists public.pennymon_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  coins integer not null default 0,
  mood text not null default 'Calm',
  accessory text not null default 'Round glasses',
  room text not null default 'Cozy desk',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.wallets enable row level security;
alter table public.budgets enable row level security;
alter table public.expenses enable row level security;
alter table public.pennymon_profiles enable row level security;

drop policy if exists "Users can manage own wallets" on public.wallets;
create policy "Users can manage own wallets"
on public.wallets
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own budgets" on public.budgets;
create policy "Users can manage own budgets"
on public.budgets
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own expenses" on public.expenses;
create policy "Users can manage own expenses"
on public.expenses
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can manage own pennymon profile" on public.pennymon_profiles;
create policy "Users can manage own pennymon profile"
on public.pennymon_profiles
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

drop policy if exists "Users can create own pennymon profile" on public.pennymon_profiles;
create policy "Users can create own pennymon profile"
on public.pennymon_profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);

create index if not exists wallets_user_id_idx on public.wallets(user_id);
create index if not exists budgets_user_id_idx on public.budgets(user_id);
create index if not exists expenses_user_id_date_idx on public.expenses(user_id, date desc);
create index if not exists expenses_wallet_id_idx on public.expenses(wallet_id);
create index if not exists expenses_budget_id_idx on public.expenses(budget_id);
