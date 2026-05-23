alter table if exists public.badi_profiles
rename to pennymon_profiles;

drop policy if exists "Users can manage own badi profile" on public.pennymon_profiles;
drop policy if exists "Users can create own badi profile" on public.pennymon_profiles;
drop policy if exists "Users can manage own pennymon profile" on public.pennymon_profiles;
drop policy if exists "Users can create own pennymon profile" on public.pennymon_profiles;

create policy "Users can manage own pennymon profile"
on public.pennymon_profiles
for all
to authenticated
using ((select auth.uid()) = user_id)
with check ((select auth.uid()) = user_id);

create policy "Users can create own pennymon profile"
on public.pennymon_profiles
for insert
to authenticated
with check ((select auth.uid()) = user_id);
