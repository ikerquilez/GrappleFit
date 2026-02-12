create table public.profiles (
  id uuid references auth.users not null primary key,
  belt_rank text check (belt_rank in ('White', 'Blue', 'Purple', 'Brown', 'Black')),
  current_weight float,
  competition_weight_class float,
  fatigue_score int check (fatigue_score between 1 and 10),
  created_at timestamptz default now()
);

create table public.daily_logs (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  date date default current_date,
  bjj_intensity text check (bjj_intensity in ('Flow', 'Standard', 'Hard')),
  volume_modifier float default 1.0,
  weight_log float,
  injuries text[] default '{}',
  created_at timestamptz default now(),
  unique (user_id, date)
);

create table public.exercises (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  category text check (category in ('Push', 'Pull', 'Legs', 'Neck', 'Grip', 'Cardio')),
  is_supplemental boolean default false,
  created_at timestamptz default now()
);

create table public.workouts (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  phase text check (phase in ('Hypertrophy', 'Strength', 'Power', 'Taper')),
  week_number int,
  exercises jsonb,
  base_volume_sets int,
  created_at timestamptz default now()
);

create table public.weight_entries (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  date date default current_date,
  weight float not null,
  created_at timestamptz default now(),
  unique (user_id, date)
);

create table public.competitions (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id),
  name text,
  date date not null,
  target_weight_class float,
  weigh_in_type text check (weigh_in_type in ('DayBefore', 'SameDay')) default 'SameDay',
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.daily_logs enable row level security;
alter table public.exercises enable row level security;
alter table public.workouts enable row level security;
alter table public.weight_entries enable row level security;
alter table public.competitions enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can manage own daily logs" on public.daily_logs
  for all using (auth.uid() = user_id);

create policy "Exercises are viewable by all" on public.exercises
  for select using (true);

create policy "Users can manage own workouts" on public.workouts
  for all using (auth.uid() = user_id);

create policy "Users can manage own weight entries" on public.weight_entries
  for all using (auth.uid() = user_id);

create policy "Users can manage own competitions" on public.competitions
  for all using (auth.uid() = user_id);
