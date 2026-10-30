# Lane brief: MR1, memory records (P2: compact episodes, fading, recall, caps, save slice)

Model: `gpt-6.1-sol`, medium (this lane adds a save slice and migration, which ON12 routes to Sol for `src/`; Weibao
2026-10-29: "Start P2"). Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or
push. Publication class: public code (name-free). Rules: `.claude/rules/runtime-code.md` AR1-AR16 (namespaced save
slices with migrations), AD36, AD38, AD43, AD45, MD1-MD3, CLR2, CLR3, CLR9, CLR12, FLR1-FLR6; GR1-GR17
([generation rules](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md)); keyed draws only (LSD139).
Design: [LEAD_LIFE_SYSTEMS_DESIGN](../LEAD_LIFE_SYSTEMS_DESIGN.md) section 34 (LSD351-LSD362) and section 35
(LSD372-LSD375), plan row LSD377 (P2 part only). Chance comes from CH1's leaf `src/check_keys.js` (`checkKey`) and the
resolver; see [CH1_CHECKPOINT](CH1_CHECKPOINT.md) "P2 needs". Write constraints as default, dial and reason.

## Why

People need to remember what happened to them, cheaply and checkably. Memory already exists in three stores, each as
free text with a cap: simulation relationships (`src/simulation_effects.js`, 32 per pair), the chronicle
(`src/chronicle.js`, 32 per pair, read through `src/relationship_view.js`) and village household memories
(`src/life_events.js`, `MEMORY_CAP = 12`). LSD372 says a memory is a small structured record and text is rendered on
read, as `src/memory_messages.js` already does with "old literal memories stay literal". This lane adds that record
and its rules without rewriting the three stores.

## Data probe (CLR2)

| Field or input | Expected | Observed | Gate? |
| --- | ---: | ---: | --- |
| Existing memory stores that save free text | 3 | | no; list any others found |
| Existing tests that pin those stores' shapes | some | | yes: they must still pass unchanged |
| Worst-case save at the caps (300 people x 40 episodes) in bytes, JSON | under 500 KB | | yes: if over, tighten caps or encoding, then record |

## Scope and seam

- Outcome: a person can hold episodes about another (helped me, harmed me, betrayed me, saw them do X, was told Y,
  LSD361) as compact records: kind, about, fact pointer, source (saw / told-by id / inferred), certainty, feeling, day
  (LSD351, LSD372). Vividness is derived from day, feeling and kind on a fixed curve, never saved (LSD354, LSD374 rule 5).
  A cue (same person, place or topic) triggers a recall check through `checkKey` + the resolver, keyed by holder,
  memory, cue and period (LSD354, LSD363). Telling copies a record with `source = teller`, lower certainty, same fact
  pointer (LSD356, LSD374 rule 2). Per-holder caps keep the strongest and most recent; the rest fold into a dated
  impression record per holder and subject (LSD360, LSD374 rule 3). Canon memories are not saved (LSD359, LSD374 rule 1):
  leave a `canonBaseline` port that returns none in this lane.
- Legacy: the three free-text stores stay as they are. Provide a read-only adapter that presents their rows as
  `legacy-literal` episodes (text kept, no derived kind) so readers see one list. No migration rewrites old text.
- Seam (AD45): a world-neutral leaf `src/person_memory.js` (record validation, compact encode/decode, vividness,
  recall, telling, caps and folding, size estimate) importing only `gen_kit.js`, `check_keys.js` and the resolver
  contract if needed. A namespaced save slice (for example `memory: {schema: 1, holders: {...}}`) with a validator and a
  migration from absent to empty, defined in the leaf. Registering the slice in the save validator and any host is a
  prepared hunk in `cast-lives-lanes/MR1_INTEGRATION.patch` (CLR9): shared host files have other sessions' uncommitted
  edits right now, so do not edit them directly.
- Files owned: `src/person_memory.js`, `tests/person_memory.test.js`, `tests/person_memory_persistence.test.js`,
  `cast-lives-lanes/MR1_CHECKPOINT.md`, `cast-lives-lanes/MR1_INTEGRATION.patch`. Everything else read-only.
- Actor parametrization (CL225): holders and subjects are plain ids; no branch reads "is the lead"; tests use non-lead ids.

## Work and done check

- Failure cases: a record with an unknown kind or a day after the clock is refused; a holder at the cap folds rather than
  grows; a told copy never raises certainty above its source; an unchanged recall attempt gives the same result
  (let it ride, LSD381) and a new cue or period may differ; an absent slice loads as empty.
- Persistence (FLR5): Save, reload, Export and literal Import of a state with episodes, a told copy and a folded
  impression, through the real validator in a disposable copy (follow `tests/cast_card_integration.test.js` and
  `tests/skill_records_persistence.test.js` for the method). If the real validator needs the prepared hunk, apply it
  only in the test's disposable copy, as CR2 did.
- Size (LSD375): a test builds the worst case at the caps and asserts the stated byte budget.
- Verification: `node --test tests/person_memory.test.js tests/person_memory_persistence.test.js` plus the existing tests
  of `chronicle`, `relationship_view`, `life_events` and `simulation_effects` (name the files you run), and
  `npm run check:arch` with no growth. Report input SHA-256 of files read.
- Done when: focused tests pass; the size test passes its budget; the checkpoint says "implemented, below floor" with
  FLR lines, the slice schema and a synthetic example, the integration steps for the coordinator, known limits and what
  P3 (bond axes derived from episodes, reactions naming an episode, gossip along bonds) needs from this leaf.
- Stop conditions: the worst-case size cannot meet 500 KB with reasonable caps (report the numbers), or a change in a
  shared file that no prepared patch can carry.
- Ambiguity default (CLR12): pick the smaller encoding and the simpler fade curve, and record why.
- Out of scope: P3 effects, UI and browser checks (no visible change in this lane), wiring into the LOTM cast at runtime.

Do not commit. Keep canon names and source text out of tracked `src/` and `tests/` (CLR3).
