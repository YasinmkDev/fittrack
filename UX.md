# FitTrack UX — Playbook Application

How the **UX Strategy Playbook** (research-first workflow + strategy audit) was applied to
FitTrack v1, what it found, and what v2 changes. Companion to DESIGN.md (visual system).

## 1. User and top jobs (Playbook Step 2)

Gym owner-coach in Pakistan, 80–400 members, mid-range Android phone, low patience at a
busy front desk. His jobs, in his words:

1. "Who is in my gym, who hasn't paid, who is about to leave?"
2. "Add this new member before he changes his mind."
3. "Did today make money?"

## 2. Friction audit of v1 (Micro-Friction Eraser)

| Flow | Friction found | Fix in v2 |
|---|---|---|
| Check a member in | **No check-in existed in the app at all** — the single most repeated daily action was missing; owners would fall back to a paper register (the exact habit the app must kill) | Quick check-in on Home: expected members listed, one tap, live count updates |
| Join a member | Form is one long scroll; no sense of progress; success screen is static text | Endowed-progress steps (starts at step 1 of 3 with plan pre-picked — progress begins above zero), spring peak-end success moment |
| Renewal | Owner must spot expiring members himself | Already anticipated in v1 attention list (kept); renewal stays 1 tap from the member page |
| Payments | Summary numbers are dead text | Kept — every number remains tappable into its member (audit rule: no vanity metrics) |

## 3. Strategies chosen (Playbook Step 5) and where they live

- **Hook Model** — Trigger: the morning attention list + expected-now check-in row.
  Action: one-tap check-in. Variable reward: the live floor count and streak flames move.
  Investment: every check-in makes the member's streak, attendance bars, and progress
  charts richer — the data the owner later relies on.
- **Algorithmic Intimacy** — Home gains a "Your gym, in one line" insight computed for
  *this* gym ("Evenings are your power hours — most check-ins land 5–8 PM; Imran is your
  only at-risk regular"). Member pages gain a per-member truth ("Down 6.1 kg since June —
  her best month yet"). Rule from the Playbook: computed-feeling lines only, never
  "Hi {name}" theatre.
- **Viral UX** — Member progress becomes a designed share card: big result, streak,
  gym name, and a tasteful "Progress tracked with FitTrack" footer. The member posts his
  own result; the gym and FitTrack ride along. This is the product's "Powered By" surface.
- **Peak-End** — Two engineered endings: Join success (spring ring sweep + what happened
  + what was sent) and check-in (count ticks up, member's streak flame pops). Flows end
  with confirmation that teaches, not a toast that vanishes.
- **Endowed Progress** — Join form header shows 3 steps with the first already earned by
  the pre-selected plan and trainer; nobody starts at zero.
- **Zeigarnik** — Home's attention list is literally the owner's unfinished business,
  sorted by money risk. Kept from v1; the check-in row joins it.
- **Resurrection** — The overdue-and-absent attention item (Imran: 11 days) is the
  designed comeback trigger; in a live backend this becomes the WhatsApp nudge.
- **Fluid motion (Doherty + craft)** — Entrances become spring-based (fast, physical,
  <300ms perceived), lists animate layout changes when filters change instead of
  jump-cutting, and the live count animates on every check-in. Motion explains change;
  nothing loops or decorates.

## 4. Deliberately NOT added (audit discipline)

- No fake notifications, fake live counters beyond the demo's own check-in state, or
  fabricated social proof (dark-pattern line).
- No gamification confetti unrelated to real progress.
- No settings page for things the app can decide (Tesler): trainer and plan stay
  pre-selected from context.

## 5. Playbook audit — v2 result

- Friction: core jobs ≤ 3 taps ✓ · no repeated questions ✓ · input preserved in Join ✓ ·
  longest "wait" (check-in) resolves instantly with animated feedback ✓
- First value: owner value on first screen without any account ✓ · Aha action = first
  check-in, reachable in 1 tap from Home ✓ · progress starts above zero in Join ✓ ·
  empty states designed (Members filter) ✓
- Retention: Hook loop drawn above and implemented ✓ · losable progress = streaks,
  recoverable via freeze ✓ · unfinished business on Home ✓ · resurrection item ✓
- Feeling: peak moments = check-in tick + Join success ✓ · per-gym and per-member
  intimacy lines ✓ · anticipatory = attention list + pre-selections ✓ · Kano basics
  (members, fees, schedule) all sound before delight ✓
- Growth: viral surface = member progress share card ✓ · "powered by" footer designed
  as a first-class card ✓ · all proof numbers are the gym's own data ✓
- Craft: references in DESIGN.md ✓ · tokens only ✓ · states designed ✓ · ≥44pt targets
  on all new controls ✓ · no dark patterns, no gradient/neon ✓
