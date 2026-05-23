alter table public.pennymon_profiles
drop column if exists outfit;

alter table public.pennymon_profiles
alter column coins set default 0;

update public.pennymon_profiles
set coins = 0
where coins = 85;
