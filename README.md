# FitTrack — Gym Management SaaS

> Run the gym from your phone: members, plans, attendance, classes and fee collection — built for owners who currently run on registers, spreadsheets and WhatsApp groups.

**FitTrack** is a mobile SaaS for small-to-mid gyms. The owner workflow, modelled on real gym software (Gymdesk, Mindbody, MyGymDesk):

**Members & plans → Attendance & classes → Fee collection → Follow-ups**

One member record carries it all: plan and fee position, attendance streak, body progress, and the trainer's notes.

## Screens

- **Home** — live "in the gym now" count, fees collected vs monthly target (ring), needs-attention list (expiring plans, overdue + absent members, frozen memberships), 7-day check-in bars, live and upcoming classes
- **Members** — status filters (Active / Expiring / Expired / Frozen) with plan-day progress bars, streaks and visit counts
- **Join** — front-desk add-member form designed for under a minute: validated name/phone, goal and trainer chips, plan picker, live due-today total (plan + admission fee), receipt-style success state
- **Schedule** — today's classes with trainer, time and capacity bars, plus personal-training sessions
- **Payments** — collected vs target, outstanding and overdue, who-still-owes list, recent payments
- **Member detail** — streak/visits stats, plan & fee card with WhatsApp reminder and renew actions, animated weight-trend chart against the member's goal, coach note
- **FitTrack Pro paywall** — monthly/yearly billing with a 14-day trial flow (unlimited members, WhatsApp automation, reports, trainer accounts, second branch)

## Design

Research-first, documented in [DESIGN.md](DESIGN.md). The visual language follows Nike Training Club / Apple Fitness discipline: warm paper-white canvas (`#FAFAF9`), white surfaces with hairline borders, near-black primary buttons, and **one flat athletic orange** (`#EA580C`) used sparingly for live data, streaks and charts. Restraint is the brand: no gradients, no glow, no neon, no glassmorphism.

Motion is subtle and physical: 220ms fade-rise list entrances, count-up stats, animated attendance bars, progress rings and weight trends — each plays once, nothing loops.

## Tech

- Expo SDK 57 · React Native 0.86 · React 19.2 · TypeScript (strict) — SDK 57 matches the owner's Expo Go
- Expo Router (file-based, routes in `src/app/`)
- React Native Reanimated + react-native-svg for animation and charts
- Lucide icons throughout (no emoji in UI)

```bash
npm install
npx expo start        # dev server
npm run typecheck     # tsc --noEmit
npm run lint          # eslint
npx expo-doctor       # 21/21 checks pass
```

## Notes and next steps

Demo build: data is local seed data (a realistic Mingora gym). For a live product the next steps are a Supabase backend (auth + per-gym database), real WhatsApp Business API reminders, and JazzCash/EasyPaisa fee collection links — the screens already model those flows honestly.
