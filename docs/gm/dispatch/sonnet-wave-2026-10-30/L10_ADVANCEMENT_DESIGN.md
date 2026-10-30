# L10 advancement and abilities: design note (2026-10-30)

Lane L10 of the [Sonnet wave](PLAN.md). Gaps GM25 (ladder above the first rung, extends GM9 and GM17) and GM26 (typed abilities) from the [gap map](../../../research/READING_GAP_MAP_2026-10-28.md). Codes: WA27, WA33, WA47, WA48, MR1-MR36. Proposal; nothing here is an accepted decision.

## What the rows show (sampled, ids and counts only)

- **Ability rows (ABL, LOTM `rules` kind `ability`) by volume:** 363 / 496 / 578 / 563 / 554 / 485 / 204 / 174. Volumes 2-6 carry about 1.5 times volume 1; the family stays dense through volume 8.
- **Shape of one ability across volumes** (`flame-jump` 19 rows over 6 volumes, `paper-doll-substitute` 13, `air-bullet` 10): `conditions` are small typed tests (a fire at hand, a prepared figure carried, aimed at a target); `limits` are mostly counters (blocked by rain, a blocked mind, a stated range, limited supply); `costs` are almost always empty (0 of 19 rows state one). So a record must allow an unstated cost and say so, not invent it.
- **Failure is by mechanism, not by roll:** the same ability is cancelled by a named condition (weather, an enemy's aura, a spirit-world property), refused, or draws a consequence. That maps to the engine's refusal (condition), a limit, and an opaque `failure.hook` for the owner of backlash (GM32, `sw-death`).
- **Ladder rows:** the potion rows for a rung give a formula, a digestion plan (play the role, keep its rules) and a rule such as "no unprepared performance". They fit the existing crossing vocabulary (`ingest`, `digest`, `recognition`, `trial`).
- **Other books:** Circle of Inevitability rows showed the same ability shape and per-era pathway ladders (shape only; nothing from it is in LOTM data, per the fence). Shadow Slave (2,596 ability rows) and Harry Potter (183 ability, 653 spell rows) state costs and cooldowns more often, so the `cost`, `limit` fields are the ones that must stay optional per world (WA48).

## Decisions (proposals)

| Code | Decision | Reason |
| --- | --- | --- |
| D1 | **No new engine.** An ability record lowers to a native command (cost and effects in the ordinary ledger), a held-source ability binding, and for a limit a power cooldown (the engine's "Power recovers in N minutes") or a charge pool with a recharge rule. | The engine already refuses, charges and recovers; GM26's gap was a typed row and a read model, not a runtime. |
| D2 | **Default, dial, reason.** Default: conditions all hold, cost paid on use, limit `none`. Dial: `limit.kind` and numbers per world. Reason: rows rarely state costs, so unstated fields are listed in `unstated`, never filled silently. | Things work by how they work (AD38); limits are adjectives. |
| D3 | **Ladder = `ascension_paths` stages; abilities unlock by the held source a promotion grants.** `advanceLadder` fills a stub stage from a pack and returns `promotionEffects` (source grant plus learned power). | Reuses ASC crossing semantics; keeps the Sequence 8 slice byte-identical with no pack (WA27). |
| D4 | **Source-derived rung data is private** (`private_packs/lotm-advancement/advancement.json`). Tracked code holds only mechanism and a synthetic-pack test. | WB5 spoilers. |
| D5 | **Backlash is a hook, not a model.** `failure.hook` on a record and `failure` text on a stage pass through. | `sw-death` owns GM32. |
| D6 | **Scaling by rung** (the same ability stronger later) is left as a gap: author a second record at the higher rung with its own limit, or use WA33 bands once `sw-chars` lands them. | Rows show scale as prose, not numbers. |

## Id scheme (for `sw-chars` and consumers)

For a record set with prefix `P` and key `k`: ability `P.ability.k`, command `P.use.k`, power `P.power.k`, charge pool `P.limit.k`, price condition `P.price.k`. LOTM uses `P = book.lotm.adv`; held source `book.lotm.adv.<source>`. A person's sheet lists ability **record ids** (`P.ability.k`); whether they can use it is the engine's held-source and condition test, so a sheet never copies conditions.

## Read model (for Abilities and advancement, Combat and conflict, Character sheet)

- `abilityView(card, {facts, quote, charges, readyIn})` in `src/ability_records.js` returns `{id, label, conditions:[{label, met}], cost:[{what, amount}], limit:{kind, minutes|readyIn|max|left}, price, ready, refusedBy:[labels], failureHook, unstated}`. It never exposes the predicate (AR8). With a `quote` from `previewSimulationCommand`, `ready` is the engine's own answer.
- `abilityViews(adv, {facts, held, readyIn, charges})` in `src/lotm_advancement.js` lists only abilities whose source is held.
- `pathView` (existing) carries the ladder; stage `failure` is the promotion risk text.

## Verification states

- Slice 1: `src/ability_records.js`, `tests/ability_records.test.js` (5 pass): condition refusal, cost paid, cooldown and charge limits through the native engine, read model, authoring rejects.
- Slice 2: `src/lotm_advancement.js`, `tests/lotm_advancement.test.js` (4 pass; one reads the private pack and skips if absent). Seq 7 for the lead's pathway: a digest crossing, an ingest crossing citing the sw-rites formula row id, three ability records with cited conditions and a cooldown and a charge limit.
- **Not done:** wiring `advanceLadder` into `lotmPathView` and the host (ceiling stays at Sequence 8 so play is unchanged), no browser run, costs are authored proposals (WPR5). Patch for the integrator is in the hand-off.

## Slices 3 and 4: learnable abilities (GM8, GM40)

**Samples (spell rows, counts only):** Harry Potter 653 spell rows, Mother of Learning 466, Shadow Slave 105 (LOTM 108 per the family table). Rows that mention teaching, lessons or practice: HP 23, MoL 28, Shadow Slave 5. So teacher, prerequisite, practice time and signs of progress are stated for about 3-6% of spells; the rest state conditions and limits only.

| Code | Decision (proposal) | Reason |
| --- | --- | --- |
| D7 | A `learn` block on an ability record: `teacher` and `prerequisites` (each `{label, reason, requires}`), `lessonCost`, `practice {minutes, mastery}`, `masteryNeeded`, `signs [{at, text}]`. Every part is optional; a missing teacher, practice time or signs is added to `unstated` automatically. | Rows seldom state them (above); never invent. |
| D8 | It lowers to the engine's power: a once-only `learn` command (teacher and prerequisite predicates, lesson cost, `learn` power effect), a timed `practice` command (`refine` effect adds mastery), and a cast whose control needs `power.<id>.mastery >= masteryNeeded`. A prerequisite spell is `power.<P>.power.<key>.owned`. | Reuses the existing power and practice model; nothing forked. |
| D9 | `teacher_window.js` stays a village projection. Its `available` result (or any world's teacher presence) feeds the record's `teacher.requires` as a fact; the record never owns teacher hours. | One authority per fact (AR); GM1 schedules supply presence. |
| D10 | Refusal reasons: the engine quote shows `Needs: <gate labels>`. `learnView` returns each gate's authored `reason`, so a panel can say why. | The engine hides per-gate predicates by design. |

**Read model:** `learnView(card, {facts})` in `src/ability_records.js` returns `{stage: unlearned|practicing|castable, canLearn, refusedBy:[reasons], gates:[{label, met}], mastery, masteryNeeded, practiceMinutes, sign, nextSignAt, unstated}`. Cards carry `card.learn` and `card.ids` include `learn` and `practice` command ids.

**Slice 3 evidence:** `tests/ability_records.test.js` (8 pass): refused before prerequisite and teacher, learned after, once-only, lesson cost paid, two timed practice sessions raise mastery to 2 through `advanceSimulation`, then the cast quotes eligible.

**Slice 4 data (private, `private_packs/learnable-spells/{mol,hp}.json`):** Mother of Learning torch, book-finding divination, magic missile; Harry Potter match-to-needle, summoning charm, patronus charm. Each row cites rule id and locators for teacher, conditions and signs. Authored proposals: practice minutes, mastery counts (for example 90 sessions for "months", 14 for "two weeks"), mana amounts. Evidence: `tests/learnable_spells_packs.test.js` (2 pass, skip if packs absent). **Checks not run:** no Luna paragraph check beyond my own read of the cited rows; one reader.

**Not done:** wiring packs into a world, any world's teacher-presence facts, failure chance (a dial, no stated number), browser run.

## Typed abilities per volume (GM26, volumes 2-8), 2026-10-30 overnight

Pipeline: `scripts/lead_run/ability_typing.mjs` (prep, answer parser, typed rows; 3 tests) feeds Luna lanes (`gpt-6-luna` medium, brief template `l10-briefs/TYPING_BRIEF_TEMPLATE.md`), launched three at a time by `ability_typing_fanout.mjs`. Luna classifies existing extracted items (no book text): required state, blocker, stated range, duration or count, cost, note. It never invents a number; unanswered or malformed items are reported, not guessed.

**Result (private, `private_packs/lotm-abilities/typed_v2..v8.json`; counts only):**

| Volume | Typed ability ids | Conditions | Blockers | Stated numbers | Stated costs | Items unanswered |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| 2 | 367 | 245 | 22 | 8 | 22 | 1 |
| 3 | 470 | 436 | 35 | 32 | 21 | 5 |
| 4 | 431 | 275 | 47 | 24 | 29 | 1 |
| 5 | 435 | 273 | 26 | 23 | 11 | 2 |
| 6 | 334 | 242 | 45 | 24 | 15 | 1 |
| 7 | 177 | 144 | 6 | 21 | 12 | 14 |
| 8 | 154 | 99 | 10 | 5 | 3 | 0 |

30 chunks, all complete; 24 items had malformed lines (slug format) and stay untyped. **Brief iteration (D11):** the first brief over-labelled (100 of 161 items as conditions on volume 8), the second under-labelled (7 of 161), the third (needed/required/trigger is a condition, narration is a note, no generic slugs) gave 102 conditions, 15 blockers and 48 notes on a volume 3 chunk. Sonnet reviewed about 20 sampled items: labels and slugs fit; slugs stay specific (about 1,575 distinct), so cross-ability reuse is low and a slug clustering pass is a later idea.

**Promotion:** `src/ability_typed_rows.js` (`recordFromTyped`, 2 tests) turns a typed row into an ability record input: conditions and blockers from the cited states, stated numbers carried as `stated` (shown in `abilityView`), a generic marker effect, and `unstated` saying the effect and the cost amount are not stated. Records are not generated in bulk yet: a held source and a real effect per ability are decisions for the rung or pathway they belong to.

**Verification state:** agent-verified, not human-reviewed; 12 focused tests across the pipeline, typed rows and records pass; `check:arch` passes; not wired; no browser run. Codex peak 30% at last preflight; Claude weekly 57%, 5-hour 83% at 2026-10-30 about 07:10.
