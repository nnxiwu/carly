create table maintenance_items (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  interval_type text not null check (interval_type in ('months', 'none')),
  interval_value int check (interval_value > 0),
  care_note text,
  sort_order int not null,
  unique (user_id, name),
  check ((interval_type = 'none') = (interval_value is null))
);

alter table maintenance_items enable row level security;