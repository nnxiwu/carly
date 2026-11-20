# Carly: Design

"Carly" is a working name and may change.

This is a living doc. The MVP sections are detailed; the later phases only hold decisions that constrain the MVP. When a decision changes, update this file in the same commit as the code.

## What it is

A phone app (iPhone first) for keeping track of your car's maintenance, with a web version as a secondary option from the same codebase. For each part (tyres, battery, oil, coolant and so on) it records when it was last serviced, works out when it's next due, and flags what's due soon or overdue. Each item also carries a short note on how to look after it. A home-screen widget and push reminders come after the MVP, which is why the data lives on a server and the app is native.

The backend is a Node.js (Express, TypeScript) API on top of Supabase Postgres. Authentication is built by hand in the API first, as a way to learn how session tokens work, and is replaced by Supabase Auth in a later step.

It's also a practice project for React architecture, backend development and authentication, so the aim is clean structure over shipping a polished product.

## Features I want (the full wishlist)

Not all of this has to be in the MVP. See the phases below.

- Record a service and see when the next one is due
- Be reminded when a service is almost due
- See at a glance when I last fuelled, last checked tyre pressure, last changed the oil, and last had the car serviced
- During a service, record everything that was changed (brake pads, lights and so on)
- See a rough time frame for when each part should be replaced
- A home-screen widget on my phone

## MVP

- Runs on iPhone. The web build comes from the same codebase and shouldn't be broken, but isn't tested or polished.
- Create an account and sign in with email and password. Sign out. Your data is private to your account.
- One car (no multi-car support)
- A fixed default list of maintenance items (no add/edit form yet), including track-only items like fuel. Each user gets their own copy of the list.
- Each item has a full service history, not just the latest date
- Logging a service on an item adds a record with a date (defaults to today, can be backdated)
- Track-only items (fuel) have a one-tap "Done today" button and show no due date or status
- Deleting a record, to fix a mistaken log (no editing; delete and re-log)
- A derived status per item: ok / due soon / overdue / unknown
- Reminders are the in-app status only: due soon and overdue items show when you open the app
- A short "how to look after this" note per item
- Data stored in Supabase Postgres, accessed only through the Express API
- Unit tests for the status and date logic

## Phase 2 (right after the MVP works, in this order)

1. Service visit form: pick a date, tick every item that was done or replaced, add an optional note. The API inserts one record per ticked item in a single transaction, all sharing a `visitId` and the same note. Visits are not their own entity, and deleting a record removes only that item's record.
2. UI design with Google Stitch, then style tokens (a separate step once the unstyled list works; see the UI design section)
3. Km-based intervals
4. Add/edit your own items, and edit a record
5. API tests for the endpoints

## Later step: swap the hand-built auth for Supabase Auth

Done once the MVP works, as its own piece of work. What changes:

- The token-checking middleware verifies Supabase-issued tokens instead of the hand-built ones. Everything downstream still just reads the user ID.
- The sign-in screen switches to an emailed 6-digit code, using the Supabase client for sign-in and session handling only.
- User IDs change (Supabase has its own users), so existing data is either migrated or you start fresh.
- The `users` and `refresh_tokens` tables and the `api/src/auth` folder are deleted.
- This is also the point to add Google and other sign-in methods.

## Phase 3

- Push reminders for due-soon and overdue items. A scheduled job on the Node server works out what's due using the shared `domain` package and sends the push.
- iOS home-screen widget showing the next items due. The widget code runs in an isolated runtime with no React hooks, app state or async work, so the app computes a small snapshot (item names and statuses) and hands it to the widget. The status logic stays in the shared `domain` package.
- Both of these need a development build instead of Expo Go.

## Not yet

- Password reset and email verification
- Login rate limiting and refresh token reuse detection (stretch goals for the auth practice)
- Google and other sign-in methods (arrive with Supabase Auth)
- Android
- Offline support
- Fuel details beyond the date (litres, cost)
- Multiple cars

## The screen

Phone first: a single column that respects the safe areas, with the main actions reachable by thumb. On web, the same column is centred. One screen: a list of items. Each row shows:

- Item name
- Last done (or "never logged")
- Next due, shown as approximate for wear items like brake pads (track-only items show no due date)
- Status: ok / due soon / overdue / unknown (track-only items have no status)
- A log button: "Log service" for normal items, a one-tap "Done today" for track-only items
- Expandable section with the care note and a list of past records, each with a delete button

A sign-in screen (email and password) with a switch to "Create account" shows when signed out, and there's a sign-out button once signed in.

The look and feel is Phase 2, after the unstyled list works.

## UI design

Made with Google Stitch (a Google Labs tool). The prompts live in `stitch-prompt.md`.

- Direction: friendly and rounded, with light and dark themes that follow the phone setting. No reference app yet.
- Stitch outputs Figma-compatible designs and HTML/CSS, not React Native. Use it as a visual reference only and don't paste its code into the app.
- Use text prompts in Standard Mode. Figma export doesn't work for designs generated from images.
- After picking a design, extract into `theme/tokens.ts`: the light and dark colour palettes (background, surface, text, accent and the four status colours), the font and type scale, corner radii, spacing scale and shadow style. Then rebuild the components in React Native using those tokens.
- Status is never shown by colour alone. Each status also has a text label and an icon.

## Architecture decisions

- Three pieces: the Expo (React Native, TypeScript) app, a Node.js + Express API (TypeScript), and Supabase Postgres for data. The app never talks to Supabase directly. All data goes through the Express API.
- The MVP app runs in Expo Go on your iPhone. Switch to a development build when starting Phase 3 (widgets need one).
- Server state in the app (maintenance items and records) is managed with TanStack Query. UI state (which row is expanded, form inputs) is plain React state. There is no global store.
- Last done, due date and status are never stored. They are derived by pure functions from the records, the interval and today's date.
- Due-date logic lives in a shared pure `domain` package, so the app and the server use the same code and it can be tested with no React, Express or database. "Today" is passed in as an argument, never read inside the function, so tests can fix the date.
- In the app, only `data-access/` calls the API, through hooks like `useMaintenanceItems` and `useLogService`. Components never call `fetch` directly.
- The API validates every request body with a schema library (zod) and returns errors in one consistent shape, `{ error: { code, message } }`.
- Default items are seeded by the API on a user's first request: it copies `default_maintenance_items` into `maintenance_items` for that user, inserting only the ones missing, so it's safe to repeat.
- Schema changes are SQL migrations committed in `supabase/migrations/`.
- "Due soon" means within 30 days of the due date. It's one global constant.
- An item with no history has status `unknown`, not `overdue`. An item with interval `none` has no status at all.
- Testing: Jest (Expo's default) for the pure functions only. No API or component tests in the MVP.
- Styling: React Native `StyleSheet` with a TypeScript tokens file (colours, spacing, type scale) in `theme/`.

## Authentication (hand-built, then swapped)

All of this lives in `apps/api/src/auth` and `apps/mobile/src/auth`, so it can be replaced as one unit later.

- Sign-up: email and password. The email is lowercased and unique. The password is hashed with a slow password hash (argon2id or bcrypt, decided on the day) and the plain password is never stored or logged.
- Sign-in returns two tokens:
  - Access token: a signed JWT that holds the user ID (`sub`) and expires quickly (start with 15 minutes). It is sent on every API call in the `Authorization: Bearer` header.
  - Refresh token: a long random string (start with 30 days), stored in the database only as a hash. It is used to get a new access token without signing in again.
- Refresh: `POST /auth/refresh` checks the token's hash, expiry and revoked state, then issues a new access token and a new refresh token and revokes the old refresh token (rotation).
- Sign-out revokes the refresh token.
- Failed sign-in always returns the same generic message, so it never reveals whether an email has an account.
- The API verifies each access token's signature and expiry in middleware, using a secret from an environment variable, and takes the user ID from `sub`. The user ID never comes from the request body or URL, and every query filters by it.
- In the app, the refresh token is kept in the device's secure storage and the access token is kept in memory. The API client attaches the access token to each request. On a 401 it refreshes once and retries, and if the refresh fails it sends the user to the sign-in screen.
- Secrets are never committed. Production traffic must use HTTPS.
- Row Level Security stays enabled on every table, with no policies. Supabase's auto-generated data API therefore can't be used to read or write anything, and only the API, connecting to Postgres directly, can.

## API (MVP)

Dates are `"YYYY-MM-DD"` strings. The auth endpoints are public. Every other endpoint needs a valid access token and only touches the signed-in user's rows.

- `POST /auth/register`: body `{ email, password }`. Creates the account and returns the two tokens.
- `POST /auth/login`: body `{ email, password }`. Returns the two tokens.
- `POST /auth/refresh`: body `{ refreshToken }`. Returns a new pair of tokens.
- `POST /auth/logout`: body `{ refreshToken }`. Revokes it.
- `GET /maintenance-items`: the user's maintenance items, each with its history. Seeds the default items on the first call.
- `POST /maintenance-items/:maintenanceItemId/records`: body `{ date, notes? }`. Adds a record to that item.
- `DELETE /records/:recordId`: deletes one record.

## Dates

- Dates are date-only strings (`"2026-10-24"`), not `Date` objects. Postgres `date` columns map to this format, and date-only strings avoid time zone bugs (a service "on the 24th" stays on the 24th).
- Gotcha: the Node Postgres driver turns `date` columns into JavaScript `Date` objects by default, which brings the time zone bugs back. Configure the driver to return `date` columns as plain strings.
- Due date is last done plus N months. If the target month is shorter, clamp to its last day (31 Jan + 1 month = 28 Feb). `date-fns`'s `addMonths` does this already, so use it instead of hand-rolling the maths.

## Data model

Naming: a maintenance item is one thing you maintain on the car (tyres, battery, oil). In prose, "item" is short for maintenance item. The car itself is not a table in the MVP, since there is only one. If multiple cars arrive later, a `vehicles` table would be added and each maintenance item would belong to a vehicle.

Domain types (in the shared `domain` package, independent of the database):

```ts
type IntervalRule =
  | { type: "months"; value: number }
  | { type: "none" } // track-only, e.g. fuel
  | { type: "km"; value: number }; // Phase 2, not implemented in the MVP

type ServiceRecord = {
  id: string;
  date: string; // "YYYY-MM-DD"
  visitId?: string; // Phase 2: groups records logged in the same service visit
  km?: number; // Phase 2: used when km intervals arrive
  notes?: string;
};

type MaintenanceItem = {
  id: string;
  name: string;
  interval: IntervalRule;
  careNote: string;
  history: ServiceRecord[];
};

type Status = "ok" | "due-soon" | "overdue" | "unknown";
// getStatus returns Status | null (null for interval type "none")
```

Database tables (the API maps these rows into the types above):

```sql
users (                           -- removed when swapping to Supabase Auth
  id uuid primary key default gen_random_uuid(),
  email text not null unique,     -- stored lowercase
  password_hash text not null,
  created_at timestamptz not null default now()
)

refresh_tokens (                  -- removed when swapping to Supabase Auth
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references users(id) on delete cascade,
  token_hash text not null unique,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
)

maintenance_items (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  name text not null,
  interval_type text not null,    -- 'months' | 'none' | 'km'
  interval_value int,             -- required unless interval_type = 'none'
  care_note text not null,
  sort_order int not null,
  unique (user_id, name)          -- makes seeding safe to repeat
)

service_records (
  id uuid primary key,
  user_id uuid not null,
  maintenance_item_id uuid not null references maintenance_items(id) on delete cascade,
  date date not null,
  visit_id uuid,                  -- Phase 2
  km int,                         -- Phase 2
  notes text,
  created_at timestamptz not null default now()
)

default_maintenance_items (       -- global template list, read-only
  name text, interval_type text, interval_value int,
  care_note text, sort_order int
)
```

The optional `visitId` and `km` fields are unused in the MVP. They're in the schema now so Phase 2 doesn't need a migration for them.

## Project structure

One repo, using npm workspaces:

```
apps/
  mobile/        Expo app
    app/           Expo Router screens (thin: they compose components)
    src/
      auth/          sign-in state, secure token storage, refresh handling
      data-access/   API client and TanStack Query hooks
      components/    React Native components
      theme/         tokens.ts and shared styles
  api/           Node + Express (TypeScript)
    src/
      auth/          password hashing, token creation and verification
      routes/        endpoints
      middleware/    token check, validation, error handling
      db/            Postgres connection and queries
packages/
  domain/        pure logic and types (getStatus, dueDate, types) + tests
supabase/
  migrations/    SQL schema, RLS, default items seed
```

Rules of thumb: `packages/domain` never imports React, React Native, Express or TanStack Query. Only `apps/api/src/db` talks to Postgres. Only `apps/mobile/src/data-access` talks to the API. Everything about authentication stays inside the two `auth` folders.

## Default items (starting values)

Intervals for wear items are rough estimates, since real wear depends on how you drive. They become more accurate once km intervals exist.

- Full service: 12 months
- Engine oil and filter: 12 months
- Tyre pressure check: 1 month
- Tyre rotation: 6 months
- Tyres replaced: 48 months
- Battery: 48 months
- Coolant: 24 months
- Brake fluid: 24 months
- Brake pads: 24 months (rough)
- Light bulbs: 36 months (rough)
- Wiper blades: 12 months
- Fuel: track-only (no interval)

These live in the `default_maintenance_items` table, so they're data and can be changed without touching the code structure.

## Open questions

- Which password hash: argon2id or bcrypt. Decide when building sign-up.
- How the API talks to Postgres: plain SQL with the `pg` driver, a query builder, or an ORM. Decide when building the first endpoint.
- Where the Express API is hosted. Decide before the app needs to reach it from outside your laptop.
- How to install the app on your iPhone once Expo Go isn't enough (development build). Decide at the start of Phase 3.

## Later

- Fuel details (litres, cost, economy)
- Offline support
- Android
