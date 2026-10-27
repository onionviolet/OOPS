# Session briefs (ready to paste), 2026-10-27

Each brief starts with: "Read `docs/gm/dispatch/village-loop-2026-10-27/COMMON.md` first and follow it." Start them from the desktop app (sessions cannot be started over Remote Control). Ownership table and standing direction live in COMMON.md.

## 1. village-gm (docs only; Sonnet, then advisor)

Write `docs/gm/dispatch/village-loop-2026-10-27/GM_PLAN.md`.
1. Self-audit: search `docs/USER_VISION.md`, PROJECT.md summary, LIFE_SIM_NORTH_STAR headings, `docs/reviews/ENGINE_AND_IDENTITY_THREAD_2026-10-16.md`, master plan rounds 3-6, `docs/PROTO23_VILLAGE_LIFE_LOOPS_2026-10-14.md`. Report the game's stated identity (quote Weibao, cite sections), where the Village loop stands, and contradictions or stale claims.
2. Call the advisor once before planning: what to decide lore-wise and gameplay-wise so the Village loop gives the game its own identity while heading to a whole playable world with endless possibilities. Reconcile conflicts with evidence in one more call.
3. Write: (a) Village loop as live/earn/carry/apply/react/return with existing systems and gaps; (b) YAIR Village vs an original Proto23-style village (PW2/PW4/PW5); (c) 5-8 slice cards in dependency order (outcome, consumer, cost, mechanism, done check, model/effort); (d) at most three procedural ideas with a Village consumer now (from the PROCEDURAL_* docs), rest banked; (e) other banked ideas pulled by loop step (Q18 triage, ideas inventory, IB1-IB5); (f) lessons from saved Discord research, no new collection; (g) slow lore/identity decisions (default, dial, reason) vs ones to settle now. Proposed hunks for shared docs go inside GM_PLAN.md.
Done: GM_PLAN.md committed (own paths), links resolve, `git diff --check` passes, final report lists slice cards and waiting decisions in five lines.

## 2. village-loop (runtime; Sonnet or Sol medium)

Take the first dependency-ready slice cards from GM_PLAN.md, or if it is not yet written, start from `src/absorb_c2/local_life.js` and the Proto23 loops doc: pick the weakest loop step in the YAIR Village and fix it as one playable slice to the AD43 floor (watch, weekly market, courier, relay, search exhaustion already exist as proposals/slices; find what is actually playable and what is not). Then the same for an original Proto23-style village only if a slice card says so. Record the AD38 reading and the owner/seam, files, failure scenario and finish check in `VILLAGE_LOOP_CHECKPOINT.md` before editing. One slice at a time; commit own paths after the committer gate.

## 3. backlog-ui (small UI rows; Sonnet or Sol medium)

UIV1 first: blocked reasons visible inline or on focus in the pinned box (UR43), `title` may duplicate but never hold the only copy; start with the M2 Mistglass and Tingen buttons. Done: rebuilt 1920x1080 and 1536x864 browser shows each reason without hover and keyboard focus reaches it. Then take Q18 P02-P10 (`docs/audits/IDEAS_TRIAGE_2026-10-26.md`) in order as each is dependency-ready; skip any whose owner lane is live. Record in `BACKLOG_UI_CHECKPOINT.md`. Do not touch Village loop logic.
