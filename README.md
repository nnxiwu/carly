# Carly

A phone app (iPhone first, web second) for tracking when parts of your car were last serviced and when each is next due. "Carly" is a working name.

## Structure

- `apps/mobile`: the Expo (React Native) app
- `apps/api`: Node + Express API (not built yet)
- `packages/domain`: shared pure logic for due dates and status (not built yet)
- `supabase/migrations`: SQL schema (not built yet)
- `docs/`: `design.md` (the design), `stitch-prompt.md` (UI design prompts)
- `docs/flows`: the flow diagrams

## Run it

From the repo root:

```
npm install
cd apps/mobile
npx expo start
```

Then scan the QR code with your iPhone camera to open it in Expo Go. Your phone and computer need to be on the same Wi-Fi network.

## Where to look

- The design: `docs/design.md`
- Where I stopped and what's next: `NEXT.md`
