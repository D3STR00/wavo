create table intents (
  id uuid primary key default gen_random_uuid(),
  type text not null,
  created_at timestamp default now()
);
