-- Demo seed data for PennyMon final-round walkthrough.
--
-- How to use:
-- 1. Create/register the demo user in the app first.
-- 2. Change demo_email below if your demo account uses another email.
-- 3. Run this file in the Supabase SQL editor.
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
  study_id uuid := gen_random_uuid();
  entertainment_id uuid := gen_random_uuid();
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
    (food_id, demo_user_id, 'Food', 182.50, 250.00, 'bg-[#6A4DF5]'),
    (transport_id, demo_user_id, 'Transport', 64.00, 120.00, 'bg-[#6A4DF5]'),
    (study_id, demo_user_id, 'Study', 88.00, 160.00, 'bg-[#6A4DF5]'),
    (entertainment_id, demo_user_id, 'Entertainment', 146.00, 150.00, 'bg-[#6A4DF5]');

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
    (demo_user_id, tng_id, food_id, 'Touch n Go eWallet', 'Food', 12.50, current_date, 'Lunch at campus cafe'),
    (demo_user_id, tng_id, transport_id, 'Touch n Go eWallet', 'Transport', 6.00, current_date, 'Train fare'),
    (demo_user_id, maybank_id, entertainment_id, 'Maybank Savings', 'Entertainment', 18.00, current_date - interval '1 day', 'Movie snack'),
    (demo_user_id, cash_id, food_id, 'Campus Cash', 'Food', 9.00, current_date - interval '2 days', 'Breakfast'),
    (demo_user_id, maybank_id, study_id, 'Maybank Savings', 'Study', 45.00, current_date - interval '3 days', 'Reference book'),
    (demo_user_id, tng_id, food_id, 'Touch n Go eWallet', 'Food', 24.00, current_date - interval '4 days', 'Dinner with friends'),
    (demo_user_id, maybank_id, entertainment_id, 'Maybank Savings', 'Entertainment', 80.00, current_date - interval '5 days', 'Concert ticket'),
    (demo_user_id, maybank_id, transport_id, 'Maybank Savings', 'Transport', 28.00, current_date - interval '6 days', 'Grab ride'),
    (demo_user_id, paylater_id, entertainment_id, 'Atome PayLater', 'Entertainment', 48.00, current_date - interval '7 days', 'PayLater headphones deposit'),
    (demo_user_id, maybank_id, study_id, 'Maybank Savings', 'Study', 43.00, current_date - interval '8 days', 'Printing and supplies'),
    (demo_user_id, maybank_id, null, 'Maybank Savings', 'Debt: Atome PayLater', 20.00, current_date - interval '1 day', 'Partial PayLater settlement');

  insert into public.pennymon_profiles (user_id, coins, mood, accessory, room)
  values (demo_user_id, 260, 'Worried', 'Glasses', 'Default room');

  raise notice 'Seeded PennyMon demo data for % (%)', demo_email, demo_user_id;
end $$;

