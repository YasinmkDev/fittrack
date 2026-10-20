# FitTrack — UX Design (written before any UI code)

## 1. References studied

- **Gymdesk dashboard docs** — the proven owner home screen: payments this month (received / scheduled / overdue), 7-day attendance check-in trend, today's schedule with live check-ins, follow-up tasks, overdue member list. FitTrack's Home follows this structure because it is what real gym owners open the app for.
- **Mindbody / Gymdesk / MyGymDesk** — core modules: memberships (plans, freeze, renewal), billing and overdue recovery, attendance, class booking, member progress, WhatsApp reminders (the South-Asian market runs on WhatsApp, not email).
- **Nike Training Club / Apple Fitness** — the visual energy reference: black, white, and ONE flat athletic accent, big confident numbers, generous spacing. No gradients, no glow.

## 2. Banned (standing user rule)

No neon, no gradients, no glow, no glassmorphism. No emoji icons (Lucide only). No fake global data — all seed data is a realistic Swat/Mingora gym.

## 3. User and jobs

**Primary user:** owner (often also head coach) of a small-to-mid gym, 80–400 members.
His day in the app:
1. Morning: "Who is expiring, who hasn't paid, how full is today?"
2. At the desk: "Add this new member in under a minute and take the fee."
3. Evening: "How many trained today, and how much did we collect this month?"

## 4. Information architecture

Bottom tabs (4 + centre action):
- **Home** — in gym now (live count), fees collected vs target, needs-attention (expiring in 3 days, overdue fees, absent 10+ days), 7-day attendance bars, today's classes.
- **Members** — filter by status (Active, Expiring, Expired, Frozen), member cards with plan, days-left progress, streak.
- **＋ Join** (centre) — add-member form: name, phone, goal, plan picker with live fee summary, trainer assignment. Designed to complete in under a minute.
- **Schedule** — today's classes with trainer, time, capacity bar (booked / spots), plus personal-training sessions.
- **Payments** — fees collected this month, outstanding, per-member due list, recent payments.

Stack: Member detail (plan status, attendance streak, body progress — weight line, payment history, renew / freeze / remind actions), Pro paywall.

## 5. Design tokens

- Canvas `#FAFAF9` (warm paper white), surface `#FFFFFF`, surface alt `#F4F4F2`.
- Text `#131211` near-black, secondary `#6E6A63`, tertiary `#A8A29A`. Border `#E9E6E1` hairline.
- Primary actions: near-black buttons (white text) — the athletic, premium choice (Nike pattern).
- Accent (one, flat, sparing): athletic orange `#EA580C` — live counts, streaks, chart bars, active states, progress.
- Semantic tints (flat, muted): success `#15803D` / `#F0FDF4`, warning `#B45309` / `#FFFBEB`, danger `#B91C1C` / `#FEF2F2`, info `#1D4ED8` / `#EFF6FF`.
- Radius: cards 16, controls 12, pills 999. Spacing 4pt scale, content padding 20.
- Type: system font. Display numbers 30/700 (money, live count 40/800), Title 20/700, Section 16/600, Body 15, Caption 13. Money via one formatter, `Rs 3,000` style with South-Asian grouping.
- Attendance chart: vertical bars, flat orange for today, warm grey for other days — bars animate height once.

## 6. Motion

Same discipline as the house standard: 220ms fade-rise stagger on lists, count-up stats once, bars/rings animate once on mount, press = scale 0.98 + light haptic on primary actions. Nothing loops.

## 7. Success test

Set beside Apple Fitness and Gymdesk screenshots it should read as a serious, energetic, *real* product — black/white/orange, calm density, every number earning its place.
