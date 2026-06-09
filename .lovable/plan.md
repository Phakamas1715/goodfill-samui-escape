## Goal

Right now language only works on Nav, Home, and Partners. Other pages (Quest, Persona, Programs, Journey, Care, Report, Consent, Channel, Expert, Partner, Admin) are hardcoded Thai. Also, all state (quest answers, persona, credits, habits, check-ins, bookings) lives only in browser localStorage — clearing the browser or switching devices wipes everything.

This plan does two things in stages:

1. Full TH/EN translation coverage on every page
2. Real persistence in Lovable Cloud (Supabase), keyed to the signed-in user

---

## Stage 1 — Language coverage (frontend only)

Extend `src/lib/i18n.tsx` dictionary with all UI strings used across:
- `quest.tsx` (8 questions, options, progress, results)
- `persona.tsx` (6 personas: titles, descriptions, traits)
- `programs.index.tsx` + `programs.$id.tsx` (filters, package details)
- `journey.tsx` (5 phases, QR pass labels)
- `care.tsx` (habits, check-in, Calm Credits)
- `report.tsx` (Before/After, 90-day plan labels)
- `consent.tsx`, `channel.tsx`, `expert.tsx`, `partner.tsx`, `admin.tsx`
- `Footer` in `Nav.tsx`

Refactor each page to import `useI18n` and replace hardcoded strings with `t("...")`.

Add `<html lang={lang}>` sync so the document language attribute updates.

Data files (`src/lib/data.ts`, `partners.ts`) — change persona/program names from `string` to `{ th, en }` and pick by current lang at render.

## Stage 2 — Auth (required for real persistence)

Enable Lovable Cloud auth (email/password by default, optional Google).
Add `/auth` route and `_authenticated/` layout already provided by template.
Wire sign-in / sign-out UI into Nav (replace nothing — just add user menu).

## Stage 3 — Database schema (one migration)

Tables in `public`, all RLS-scoped to `auth.uid()`:

```text
profiles(user_id PK → auth.users, display_name, lang, persona, secondary_persona, credits int default 0)
quest_responses(id, user_id, question_id int, answer int, created_at)
persona_results(id, user_id, primary_persona, secondary_persona, scores jsonb, created_at)
bookings(id, user_id, program_id, booking_date, status, qr_token, created_at)
habits(id, user_id, name, days text[] default '{}', created_at)
checkins(id, user_id, date, mood int, note, created_at)
credit_ledger(id, user_id, delta int, reason, created_at)  -- audit trail
```

Every table gets:
- `GRANT SELECT, INSERT, UPDATE, DELETE ... TO authenticated`
- `GRANT ALL ... TO service_role`
- `ENABLE ROW LEVEL SECURITY`
- Policy: `auth.uid() = user_id`
- `updated_at` trigger where applicable

## Stage 4 — Server functions

Replace `src/lib/state.ts` localStorage layer with server functions in `src/lib/care.functions.ts` (and friends), each using `requireSupabaseAuth`:

- `saveQuestAnswer({ question_id, answer })`
- `computePersona()` — reads quest_responses, writes persona_results + updates profiles
- `bookProgram({ program_id, date })`
- `submitCheckin({ mood, note })`
- `toggleHabitDay({ habit_id, date })`
- `addCredits({ delta, reason })` (server enforces non-negative balance)
- `getDashboard()` — one call returning everything Care/Report pages need

## Stage 5 — Wire pages to server fns via TanStack Query

Each page uses `useServerFn` + `useQuery`/`useMutation`. Keep an optimistic UI so the experience feels instant. Remove `useAppState` once all pages migrated; keep a thin localStorage fallback only for anonymous visitors (read-only preview of Quest before sign-in, then flush to DB on first sign-in).

## Stage 6 — QA pass

- Switch TH ↔ EN on every route, confirm no Thai/English leakage.
- Sign in on phone, take Quest, sign in on desktop, see same persona + credits.
- RLS check: try to read another user's row from the SQL console → blocked.

---

## Sequence

I'd ship this in 3 commits so you can verify each step:

1. **Stage 1** (language coverage) — biggest visible win, no backend risk.
2. **Stages 2 + 3** (auth + schema migration) — you'll be asked to approve the migration.
3. **Stages 4 + 5 + 6** (server fns, wiring, QA).

Confirm and I'll start with Stage 1.