# Stitch prompts for the Car Health Tracker

How to use: in Google Stitch choose Mobile and Standard Mode, paste the base brief, then generate one screen at a time by adding a screen prompt below it. Use text prompts only (Figma export doesn't work for image-based designs). Ask for light and dark variants of every screen.

## Base brief (paste this first, every time)

Design a mobile app for iPhone (portrait, iOS-style) called "Carly". It helps one person track when parts of their car were last serviced and when each is next due.

Style: friendly and rounded. Large corner radii, soft shadows, generous spacing, warm and approachable colours with one main accent colour, and a readable rounded-feeling sans-serif font. Provide both a light theme and a dark theme that follow the phone setting.

Status system used throughout: OK (green), Due soon (amber), Overdue (red), Unknown (grey). Never rely on colour alone: every status also has a text label and a small icon.

Usability: respect the iPhone safe areas, keep primary actions in the bottom half of the screen where a thumb can reach, and use tap targets of at least 44pt.

Keep it simple. Do not add charts, multiple cars, social features or settings screens.

## Screen 1: Home (maintenance list)

A single scrolling list of maintenance items, grouped by urgency so overdue and due-soon items are at the top. Each row shows the item name, when it was last done, when it is next due, a status badge, and a "Log service" button. Use realistic sample data:

- Brake pads: last done 20 Aug 2024, overdue by 3 months, status Overdue
- Tyre pressure check: last done 2 Oct, due in 18 days, status Due soon
- Engine oil and filter: last done 12 Mar 2026, due 12 Mar 2027, status OK
- Battery: never logged, status Unknown
- Fuel: last done 11 Nov, no due date and no status (a track-only item), with a one-tap "Done today" button instead of "Log service"

At the top, a short summary line such as "2 things need attention".

## Screen 2: Log a service

A bottom sheet over the home screen for logging a service on one item (for example "Engine oil and filter"). It has a date picker that defaults to today and can be backdated, an optional notes field, and a large "Save" button.

## Screen 3: Item details

The expanded view of one item (for example "Brake pads"). It shows a short "How to look after this" care note, then a list of past records with their dates, each with a delete action. Include a clear empty state for an item with no history.

## Screen 4: Sign in

A friendly sign-in screen with an email field, a password field with a show/hide toggle, and a large "Sign in" button. A link underneath switches to a "Create account" version of the same screen. Include a clear error state for a wrong email or password.

## What to take from the result

Don't copy Stitch's code. Pick the version you like, then write down these values to turn into `theme/tokens.ts`: the light and dark colour palettes (background, surface, text, accent, and the four status colours), the font and type scale, the corner radii, the spacing scale and the shadow style.
