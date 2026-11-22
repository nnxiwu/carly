create table service_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  maintenance_item_id uuid not null references maintenance_items(id) on delete cascade,
  date date not null,
  notes text,
  created_at timestamptz not null default now()
);

create index service_records_item_idx on service_records (maintenance_item_id);

alter table service_records enable row level security;