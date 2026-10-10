# 🪴 Plant Reminders

Set a reminder to water any plant on any day and time. No account, no backend —
reminders are saved in your browser's `localStorage`.

## Run it

```bash
npm install
npm run dev
```

Then open the URL it prints (usually http://localhost:5173).

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Typecheck and build to `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run oxlint |

## How it works

- **Add a reminder** with a plant name, a date, a time, and an optional note.
  Use the *Today / Tomorrow / In 3 days / Next week* chips to set the date fast.
- **Repeat** turns it into a recurring reminder (daily through monthly). Marking
  it watered reschedules the next one from *now*, so a late watering still gets
  a full interval.
- **Needs water** collects everything that's due. The count also shows in the
  browser tab title, so you can spot it from another tab.
- **Watered / +1 hour / +1 day** mark a plant done or push it back. One-time
  reminders move to **Done**, where *Undo* brings them back.

## Project layout

```
src/
  App.tsx                 app shell, grouping, and actions
  types.ts                Reminder types
  components/
    ReminderForm.tsx      add-reminder form (date + time + repeat)
    ReminderList.tsx      titled list section
    ReminderCard.tsx      one reminder with its actions
  hooks/
    useLocalStorage.ts    state persisted to localStorage
    useNow.ts             ticking clock so reminders become due on their own
  lib/
    dates.ts              date formatting and input conversion
    reminders.ts          reminder rules: repeat, water, snooze, validation
```

## Good to know

Because everything is stored locally, reminders don't sync across devices and
nothing is pushed to you while the app is closed. Keep the tab open to see
reminders turn due live.
