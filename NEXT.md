# Next

Overwrite this file at the end of every session. Don't append.

Last session: Day 6 done. Passwords are hashed with argon2id (`apps/api/src/auth/password.ts`). `POST /auth/register` validates the body with zod (email trimmed and lowercased, password 8 to 128 characters), inserts the user, and returns 409 `email_taken` for a duplicate. For now it returns only `id` and `email`.

Next step: Day 7. Add the access token (JWT, 15 minutes, `sub` = user ID) and the refresh token (30 days, random, stored as a hash in `refresh_tokens`). Write `POST /auth/login`, make register return the tokens too, and add the token check middleware. May take two sessions. See `docs/design.md` (Authentication and API sections).

Notes:

- `typescript` is kept on 6.x (`^6.0.3`) because `ts-jest` doesn't support TypeScript 7 yet. Don't upgrade it until `ts-jest` does.
- Due today counts as "due soon". Overdue starts the day after.
- The Supabase CLI targets a local database by default. Always pass `--remote`, for example `npx supabase db push --remote`.
- The database is in Seoul (the "asia-pacific" group picked it). Moving it later means export and import.
- `tsx` runs the API but doesn't check types. Run `npm run typecheck` in `apps/api` before committing.
- A test user `test@example.com` exists in the `users` table from Day 6.
