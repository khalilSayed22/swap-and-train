-- TrainMatch — Supabase Schema
-- Run this entire file in your Supabase SQL Editor (supabase.com → your project → SQL Editor)

-- ─── Extensions ──────────────────────────────────────────────────────────────
create extension if not exists "pgcrypto";

-- ─── Profiles ────────────────────────────────────────────────────────────────
-- Mirrors auth.users; created on first sign-up via trigger (or upserted by app).
create table if not exists public.profiles (
  id               uuid references auth.users on delete cascade primary key,
  name             text            default '',
  age              integer         default 0,
  gender           text            default 'Other',
  sports           text[]          default '{}',
  level            text            default 'Beginner',
  bio              text            default '',
  goals            text[]          default '{}',
  availability     text[]          default '{}',
  time_preference  text[]          default '{}',
  verified         boolean         default false,
  reliability_score integer        default 80,
  avatar           text            default '',
  photos           text[]          default '{}',
  location         text            default '',
  training_style   text            default '',
  sessions_completed integer       default 0,
  onboarding_complete boolean      default false,
  created_at       timestamptz     default now(),
  updated_at       timestamptz     default now()
);

-- Auto-create a blank profile row when a user signs up
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
create policy "profiles_select_all"  on public.profiles for select using (true);
create policy "profiles_insert_own"  on public.profiles for insert with check (auth.uid() = id);
create policy "profiles_update_own"  on public.profiles for update using (auth.uid() = id);

-- ─── Swipes ──────────────────────────────────────────────────────────────────
create table if not exists public.swipes (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users on delete cascade not null,
  target_user_id text            not null,       -- seed user id e.g. 'u3'
  direction      text            not null check (direction in ('left','right')),
  created_at     timestamptz     default now(),
  unique (user_id, target_user_id)
);

alter table public.swipes enable row level security;
create policy "swipes_own" on public.swipes using (auth.uid() = user_id);

-- ─── Matches ─────────────────────────────────────────────────────────────────
create table if not exists public.matches (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users on delete cascade not null,
  matched_user_id  text            not null,   -- seed user id
  matched_at       timestamptz     default now(),
  conversation_id  uuid            unique
);

alter table public.matches enable row level security;
create policy "matches_own" on public.matches using (auth.uid() = user_id);

-- ─── Conversations ───────────────────────────────────────────────────────────
create table if not exists public.conversations (
  id               uuid primary key default gen_random_uuid(),
  user_id          uuid references auth.users on delete cascade not null,
  matched_user_id  text            not null,   -- seed user id
  unread_count     integer         default 0,
  created_at       timestamptz     default now()
);

alter table public.conversations enable row level security;
create policy "conversations_own" on public.conversations using (auth.uid() = user_id);

-- ─── Messages ────────────────────────────────────────────────────────────────
create table if not exists public.messages (
  id               uuid primary key default gen_random_uuid(),
  conversation_id  uuid references public.conversations on delete cascade not null,
  sender_id        text            not null,   -- 'me' or user id
  text             text            not null,
  created_at       timestamptz     default now()
);

alter table public.messages enable row level security;

-- Users can only read/write messages in their own conversations
create policy "messages_select_own" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and c.user_id = auth.uid()
    )
  );

create policy "messages_insert_own" on public.messages
  for insert with check (
    exists (
      select 1 from public.conversations c
      where c.id = messages.conversation_id
        and c.user_id = auth.uid()
    )
  );

-- ─── Realtime ─────────────────────────────────────────────────────────────────
-- Enable realtime for messages so in-app chat updates live.
-- Go to Supabase Dashboard → Database → Replication → enable "messages" table.
-- Or run:
alter publication supabase_realtime add table public.messages;
