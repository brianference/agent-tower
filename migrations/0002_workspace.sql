-- Per-user Agent Tower workspace (Cloudflare D1 / SQLite).
--
-- Auth tables live in 0001_auth_core.sql and must stay untouched so that file
-- can be re-copied across apps. These tables are this product's reason to
-- have an account: a monthly spend cap and a personal list of tracked
-- agent sessions.
--
-- Agent session metrics (name, model, tokens, costUsd) are NOT stored here.
-- They live in the client seed at src/data/sessions.ts. tracked_sessions.session_id
-- is that catalog id (e.g. s1), not a row in the auth `sessions` cookie table.

create table if not exists workspace (
  user_id              text primary key references users(id) on delete cascade,
  monthly_budget_cents integer not null,
  currency             text not null default 'USD',
  created_at           integer not null,  -- epoch ms
  updated_at           integer not null
);

create table if not exists tracked_sessions (
  user_id    text not null references users(id) on delete cascade,
  session_id text not null,               -- catalog id from src/data/sessions.ts
  tracked_at integer not null,            -- epoch ms
  primary key (user_id, session_id)
);
