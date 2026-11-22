create table default_maintenance_items (
  name text primary key,
  interval_type text not null check (interval_type in ('months', 'none')),
  interval_value int check (interval_value > 0),
  care_note text,
  sort_order int not null,
  check ((interval_type = 'none') = (interval_value is null))
);

alter table default_maintenance_items enable row level security;