alter table public.pennymon_profiles
alter column mood set default 'Happy';

update public.pennymon_profiles
set mood = 'Happy'
where mood = 'Calm';
