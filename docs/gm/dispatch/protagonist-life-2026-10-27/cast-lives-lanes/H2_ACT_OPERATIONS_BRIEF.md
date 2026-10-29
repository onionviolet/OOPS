# Lane brief: H2, widen the pack-driven place acts to the operations the paragraph-reviewed gaps need

Model: `gpt-6.1-sol`, medium. Local, `/Users/weiwei/code/yet-another-idle-rpg`. Do not commit; never stash, reset, force or push. Read first: [H1_CHECKPOINT](H1_CHECKPOINT.md), [A3_CHECKPOINT](A3_CHECKPOINT.md),
[RV2_CHECKPOINT](RV2_CHECKPOINT.md) ("Highest-value mechanism gaps": the existing adapter has no reader, cooking, waking, sitting or weapon-securing operation; short waits; time checking;
concealment), [RV4_CHECKPOINT](RV4_CHECKPOINT.md), `src/place_acts.js` (operations set: inspect, pay, use, wash, clean, consume, store, take). Rules: `.claude/rules/runtime-code.md` AR1-AR16,
AD36, AD38 (things work by how they work: model mechanisms, not allowed-outcome lists), AD43, AD45, MD1-MD3, CLR1-CLR12. Publication: public code (name-free) with synthetic ids in tests.

## Scope and seam

- Add the operations the reviewed gaps show, each as a real mechanism with its owner: **read** (a text/object read at a place: time cost, knowledge effect with basis, optional ink/lamp requirement via requires),
  **prepare** (cook or make a meal/drink from stock the pack seeds: consumes seeded resources, produces a seeded resource or a fact; no invented stock), **wake** and **check time** (waking is a state transition
  not a wall-clock event; checking a clock records the displayed time as knowledge), **sit** or **settle** (a short rest at a place with minutes and a need/fatigue effect through the existing need owner if one exists, else a fact),
  **secure** (put an owned object out of sight or lock it: sets a custody fact and a `concealed` marker that later quotes can require), **wait here** (a short source-described wait with a numeric minute cost, as an act with an
  interruptible quote, reusing G1's wait if it fits, else a place act). Keep the incumbent eight operations byte-identical in behavior (live pack and the existing tests unchanged).
- Rows stay data: the pack's `householdActs.acts[].operation` selects the operation; operations are a registry (a small table in the adapter or a new `src/place_act_operations.js`) so a later world adds one without editing the adapter (MD1).
- Files owned: `src/place_acts.js`, optionally new `src/place_act_operations.js`, `src/book_world_lotm_cast_host.js` (only the act registration if needed), `tests/place_acts.test.js` and a new
  `tests/place_act_operations.test.js` (synthetic ids), `scripts/lead_run/build_place_acts.mjs` and `scripts/lead_run/merge_reviewed_rows.mjs` (accept the new operations; map families
  to them: reading to read, making a meal to prepare, waking/clock to wake/check time, etc.) with their tests, `cast-lives-lanes/H2_CHECKPOINT.md`. Save: no new slice; pending act jobs already validate through the owning validator (H1/D2 pattern);
  say in the checkpoint that new operations add no save shape.
- UI: acts appear in the existing "Things at hand" disclosure with their perspective tag; 1920×1080 desktop only.

## Done check

Focused tests (quote, commit, blocked reasons, resource consumption, concealment fact, save/reload through the real validator, Export/Import); `node --test tests/place_acts.test.js tests/place_act_operations.test.js
tests/build_place_acts.test.js tests/merge_reviewed_rows.test.js`; `npm run check:arch` no growth; lane review; checkpoint with FLR lines and what is below floor. Ambiguity default (CLR12): when an operation needs an owner that does not exist,
record the effect as a fact and name the owner needed.
