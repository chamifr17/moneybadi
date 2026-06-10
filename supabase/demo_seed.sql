-- Demo seed data for PennyMon final-round walkthrough.
--
-- How to use:
-- 1. Create/register this demo user first:
--    email: pennymondemo@gmail.com
--    password: pennymondemo11
--    username: PennyMon Demo
-- 2. Run this file in the Supabase SQL editor.
--
-- The script clears only this demo user's PennyMon data, then inserts realistic
-- wallets, budgets, expenses, debt, and profile values.

do $$
declare
  demo_email text := 'pennymondemo@gmail.com';
  demo_user_id uuid;
  maybank_id uuid := gen_random_uuid();
  tng_id uuid := gen_random_uuid();
  cash_id uuid := gen_random_uuid();
  paylater_id uuid := gen_random_uuid();
  piggybank_id uuid := gen_random_uuid();
  food_id uuid := gen_random_uuid();
  transport_id uuid := gen_random_uuid();
  entertainment_id uuid := gen_random_uuid();
  current_month_start date := date_trunc('month', current_date)::date;
  previous_month_start date := (date_trunc('month', current_date) - interval '1 month')::date;
begin
  select id into demo_user_id
  from auth.users
  where email = demo_email
  limit 1;

  if demo_user_id is null then
    raise exception 'No auth user found for %. Register this account in the app first, then rerun the seed.', demo_email;
  end if;

  delete from public.expenses where user_id = demo_user_id;
  delete from public.budgets where user_id = demo_user_id;
  delete from public.wallets where user_id = demo_user_id;
  delete from public.pennymon_profiles where user_id = demo_user_id;

  insert into public.wallets (id, user_id, name, type, balance, tone)
  values
    (maybank_id, demo_user_id, 'Maybank Savings', 'Bank', 845.50, 'bg-[#eeeaff]'),
    (tng_id, demo_user_id, 'Touch n Go eWallet', 'E-wallet', 126.80, 'bg-[#eeeaff]'),
    (cash_id, demo_user_id, 'Campus Cash', 'Cash', 42.00, 'bg-[#eeeaff]'),
    (paylater_id, demo_user_id, 'Atome PayLater', 'Pay later', 0.00, 'bg-rose-50'),
    (piggybank_id, demo_user_id, 'Emergency PiggyBank', 'Bank', 300.00, 'bg-[#eeeaff]');

  insert into public.budgets (id, user_id, name, spent, limit_amount, color)
  values
    (food_id, demo_user_id, 'Food', 83.00, 250.00, 'bg-[#6A4DF5]'),
    (transport_id, demo_user_id, 'Transport', 63.00, 120.00, 'bg-[#6A4DF5]'),
    (entertainment_id, demo_user_id, 'Entertainment', 183.00, 150.00, 'bg-[#6A4DF5]');

  insert into public.expenses (
    user_id,
    wallet_id,
    budget_id,
    account_name,
    budget_name,
    amount,
    date,
    note
  )
  values
    (demo_user_id, tng_id, food_id, 'Touch n Go eWallet', 'Food', 11.50, previous_month_start + 1, 'Breakfast before class'),
    (demo_user_id, tng_id, transport_id, 'Touch n Go eWallet', 'Transport', 7.00, previous_month_start + 3, 'Train reload'),
    (demo_user_id, cash_id, food_id, 'Campus Cash', 'Food', 8.50, previous_month_start + 5, 'Campus nasi lemak'),
    (demo_user_id, maybank_id, entertainment_id, 'Maybank Savings', 'Entertainment', 38.00, previous_month_start + 8, 'Weekend cinema'),
    (demo_user_id, tng_id, transport_id, 'Touch n Go eWallet', 'Transport', 14.00, previous_month_start + 10, 'Bus and train'),
    (demo_user_id, tng_id, food_id, 'Touch n Go eWallet', 'Food', 22.00, previous_month_start + 12, 'Dinner with friends'),
    (demo_user_id, paylater_id, entertainment_id, 'Atome PayLater', 'Entertainment', 72.00, previous_month_start + 15, 'PayLater gadget accessory'),
    (demo_user_id, maybank_id, transport_id, 'Maybank Savings', 'Transport', 26.00, previous_month_start + 17, 'Grab ride home'),
    (demo_user_id, cash_id, food_id, 'Campus Cash', 'Food', 10.00, previous_month_start + 19, 'Lunch set'),
    (demo_user_id, maybank_id, entertainment_id, 'Maybank Savings', 'Entertainment', 45.00, previous_month_start + 22, 'Game top up'),
    (demo_user_id, tng_id, food_id, 'Touch n Go eWallet', 'Food', 18.00, previous_month_start + 24, 'Cafe dinner'),
    (demo_user_id, maybank_id, transport_id, 'Maybank Savings', 'Transport', 16.00, previous_month_start + 27, 'LRT and bus'),
    (demo_user_id, maybank_id, entertainment_id, 'Maybank Savings', 'Entertainment', 28.00, previous_month_start + 29, 'Streaming renewal'),
    (demo_user_id, tng_id, food_id, 'Touch n Go eWallet', 'Food', 13.00, current_month_start, 'Breakfast wrap'),
    (demo_user_id, maybank_id, transport_id, 'Maybank Savings', 'Transport', 18.00, current_month_start + 1, 'Grab to event'),
    (demo_user_id, tng_id, food_id, 'Touch n Go eWallet', 'Food', 15.50, current_month_start + 2, 'Campus lunch'),
    (demo_user_id, maybank_id, entertainment_id, 'Maybank Savings', 'Entertainment', 42.00, current_month_start + 3, 'Movie ticket'),
    (demo_user_id, tng_id, transport_id, 'Touch n Go eWallet', 'Transport', 8.00, current_month_start + 4, 'Train fare'),
    (demo_user_id, cash_id, food_id, 'Campus Cash', 'Food', 9.00, current_month_start + 5, 'Breakfast'),
    (demo_user_id, paylater_id, entertainment_id, 'Atome PayLater', 'Entertainment', 48.00, current_month_start + 6, 'PayLater headphones deposit'),
    (demo_user_id, maybank_id, null, 'Maybank Savings', 'Debt: Atome PayLater', 20.00, current_month_start + 7, 'Partial PayLater settlement'),
    (demo_user_id, tng_id, food_id, 'Touch n Go eWallet', 'Food', 12.50, current_month_start + 8, 'Lunch at campus cafe'),
    (demo_user_id, tng_id, transport_id, 'Touch n Go eWallet', 'Transport', 6.00, current_month_start + 9, 'Train fare');

  insert into public.pennymon_profiles (user_id, coins, mood, accessory, room)
  values (demo_user_id, 260, 'Worried', 'Glasses', 'Default room');

  raise notice 'Seeded PennyMon demo data for % (%) with 3 budgets', demo_email, demo_user_id;
end $$;
