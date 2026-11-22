# Next

Overwrite this file at the end of every session. Don't append.

Last session: Day 3. Create `packages/domain` with the types and `getStatus` (months only), plus Jest tests.

Next step: Day 4. Create the Supabase project and write the SQL migration for `users`, `refresh_tokens`, `maintenance_items`, `service_records` and `default_maintenance_items`. Turn on Row Level Security with no policies, and seed the default items. See `docs/design.md` (Data model and Default items).

Notes:

- `typescript` is pinned to 6.0.3 in `packages/domain` because `ts-jest` doesn't support TypeScript 7 yet. Don't upgrade it until `ts-jest` does.
- Due today counts as "due soon". Overdue starts the day after.
