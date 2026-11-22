# Next

Overwrite this file at the end of every session. Don't append.

Last session: Day 4 done. The Supabase project `carly` has the five tables with RLS on and the default items seeded. Migrations are applied with `npx supabase db push --remote`.

Next step: Day 5. Set up the Express skeleton in `apps/api`: TypeScript, a health route, the Postgres connection from `DATABASE_URL`, `date` columns returned as strings, zod validation and the error shape. See `docs/design.md` (API and Dates sections).

Notes:

- `typescript` is pinned to 6.0.3 in `packages/domain` because `ts-jest` doesn't support TypeScript 7 yet. Don't upgrade it until `ts-jest` does.
- Due today counts as "due soon". Overdue starts the day after.
- The CLI targets a local database by default. Always pass `--remote` to push to the hosted project.
- The database is in Seoul (the "asia-pacific" group picked it). Moving it later means export and import.
