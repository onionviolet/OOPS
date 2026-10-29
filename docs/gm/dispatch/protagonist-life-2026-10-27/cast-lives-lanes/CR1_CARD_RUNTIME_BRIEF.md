# Lane brief: CR1, card runtime (canon-event cards shown in the lead's Reports and applied as effects)

Model: `gpt-6-luna`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Rules: `.claude/rules/runtime-code.md` AR1-AR16, AD36, AD38, AD43, AD45, MD1-MD3,
CLR1-CLR13 (CLR9: do every fix inside your grant; a hunk outside it goes in a prepared patch), SUI1-SUI19, RPT1-RPT12; keyed draws only (LSD139); default/dial/reason, no blanket never/always/only.
Lead-life rules: [LEAD_LIFE_RULES](../../../LEAD_LIFE_RULES.md) (canon run section A, reachability floor section C); design lines LSD167, LSD182, LSD193, LSD103, LSD225-LSD227, LSD257-LSD259.
Publication: public code and tests use synthetic ids and generic words; canon cards stay in private packs (CLR3, LSD153). Sealed secrets by id only. Template: [LANE_BRIEF_TEMPLATE](LANE_BRIEF_TEMPLATE.md).

## Why

A script builds canon-event cards from the readings (`scripts/lead_run/build_event_cards.mjs`; run log in [LEAD_LIFE_GUIDE](../../../LEAD_LIFE_GUIDE.md) section 6). For chapters 1-24 of the Chinese volume 1 that makes 157 more
steps reachable (24.6% to 79.6%), but a card is data: nothing in the game reads it yet. This lane is that reader. Reachable here means a record of what happened, shown and applied; it is not a playable control, and the
playable share must not move.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Cards in the private file `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/cards-2026-10-29/cards-ch1-24.jsonl` | 157 | | no (the test uses synthetic cards) |
| Cards whose `scene` matches a bound beat or day in the live pack (`private_packs/lotm-cast/cast.json`, `bindings`) | most | | no; record the share and what the unmatched ones need |
| Cards with at least one `effects` entry | nearly all | | no |

## Scope and seam

- Outcome and player sentence: in the lead's Reports, when a card's scene window is reached, the player reads one line per card in order, in the lead's own words, grouped under its thread id, with the card's locked options listed as
  "Not how it happened". The card's effects change state through the existing effect operations. When a card cannot run (a canon fact it would write is already contradicted, or a reservation refuses it) the player reads why and nothing is written.
- Seam (AD45, LSD225): a **world-neutral leaf** `src/cast_card_runtime.js` with zero imports, like `src/cast_inference_adapter.js` and `src/cast_divination_adapter.js`: `defineCards(data, binding)` (validate and normalise `event-card/1` rows; `binding` = `{worldId, actorId, group, situationId}`),
  `dueCards(state, cards, window)`, `quoteCards`, `pendingCardReports`, `settleCardReports`, plus a pure `renderCardLine`. A **thin LOTM adapter** is a prepared hunk, not new engine code: register the reader at the existing cast registry site the way KN1 and DV1 do, read the pack field
  `eventCards` (generic words; add its schema and a synthetic example to your checkpoint), and reuse the cast report ledger (`lotm.cast.report.` facts, `castBeatReports`, the RPT line style) rather than a second store.
- Card shape (read `scripts/lead_run/build_event_cards.mjs` for the exact fields): `id, stepId, scene, threadId, verb, object, kind, actor, place, packPlaceId, present, time {date, timeOfDay, precision}, order {sceneOrder, step, steps}, inputs, outputs, gains, requires,
  effects [{type:'fact', key, value, class} | {type:'knowledge', fact, change, from, locator}], choices, lockedOptions, evidence, source`.
- **Thread id is grouping only.** Show it as a heading or tag and sort within it by `order`; no logic may depend on how threads were clustered (clustering is unproven, guide section 6). Cards with a missing or unique thread id still show.
- Effects: facts as actor facts with provenance `canon` (see `PROVENANCE_CODES` in `src/constraint_store.js`); knowledge effects need `basis.situationId` and the authored attribution (the D2 lesson); never write a canon fact the constraint store marks contradicted (use `reservationDecision` / `contradictedFills` read-only).
  Absent means silent (CLR4): a card with no effects only reports. No invented stock, prices or outcomes.
- Time: a card is due when its scene's window (`pack.bindings.days`, constraint windows) is reached; windows not exact hours (guide section 1, LSD156). Order inside a scene is `order.step`. Keyed or deterministic, no ordinal draws.
- Shared files are not yours: `src/main.js`, `src/perspective_controls.js` (the new data family needs a perspective tag per CL243; prepare that hunk and its test expectation), `src/book_world_lotm_cast_host.js`, `src/book_world_lotm_host.js`, the state validator lookup and UI hunks go in `cast-lives-lanes/CR1_INTEGRATION.patch`
  for the coordinator to apply. Follow the lessons in the KN1 brief: your fixtures run against the live integration when the patch is reverse-clean (`git apply -R --check`) and apply it only when it is not yet integrated.
- Files owned: `src/cast_card_runtime.js`, `tests/cast_card_runtime.test.js`, `cast-lives-lanes/CR1_CHECKPOINT.md`, `cast-lives-lanes/CR1_INTEGRATION.patch`. Everything else read-only.
- Modularity and known limits (AD45): list in the checkpoint what stays simple on purpose (card runtime reads data only; no processes between beats, no journal of open threads, LSD260-LSD264) and the refactor expected.
- Disclosure and UI: target **1920x1080 desktop**; the card lines use the existing Reports disclosure, not a new panel, unless the audit finds none fits (say so).

## Work and done check

- Failure and refused paths (LSD227): a card refused because a canon fact it writes is contradicted; a card whose time window has not arrived (not shown, not written); a card with a locked option that the player tries (shows "Not how it happened", writes nothing).
- Non-lead fixture (LSD226): the same cards run for a non-lead `actorId`; no branch reads "is the lead".
- Persistence (FLR5): Save, reload, Export and literal Import through the real validator in a disposable copy, with pending and settled states, as in the DV1 and MK1 fixtures.
- Verification: `node --test tests/cast_card_runtime.test.js tests/perspective_controls.test.js`, `npm run check:arch` with no growth; report build identity and input SHA-256 as the other lane checkpoints do.
- Out of scope, say so in the checkpoint: the rebuilt 1920x1080 browser check from a fresh origin (the coordinating session runs it; Codex cannot start Chrome), reading card data into the live private pack, the journal of open threads, processes between beats.
- Done when: the focused tests pass and the checkpoint states "implemented, below floor" with FLR1-FLR6 lines, the pack field name and row schema, and the registration steps for the coordinator. Stop conditions: a needed change in a shared file that no prepared patch can carry.
- Ambiguity default (CLR12): where an owner system is missing, record the effect as a fact and name the owner needed.

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
