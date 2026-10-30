# Owner docs audit: one home per topic, 2026-10-30

Weibao asked two things. Which topics besides UI design need one file that covers them, and does every in-depth system need its own file? This audit records the answer and a "more to consider" round. Everything here is a proposal (AD32). Evidence comes from the working tree on 2026-10-30: file listings, greps of owner docs and source clusters. No code was read beyond file headers.

## Reading

The fight screen showed the same opponent facts in three panels, and two of them disagreed (2016/2025 hp against 2025/2025). Docs have the same failure mode. When a topic has no single owner, each lane writes its own copy and the copies drift. The fix is the same in both places: each fact has one home, and every other place links to it.

## Findings

**F1. In-depth systems already have up to four layers of docs. A fifth file per system would add drift, not clarity.**

| Layer | Owns | Where |
|---|---|---|
| Rulebook | how the system behaves (codes) | [RULES_INDEX](../RULES_INDEX.md) register: CBR, ECR, SLR, BHR, PIR, MR, SR, GTR and others |
| Representation | how it is shown | `docs/representations/` (22 files: COMBAT, CRAFTING, ITEMS, TALK, FIRST_HOUR and more) |
| Code map | which code to plug into | `docs/systems/`: PROGRESSION_WORLD_STATE S1–S19, MAKING_ITEMS_ECONOMY sections 1–14, COMBAT_PEOPLE_SITES_UI sections 1–5 |
| Palettes | ideas and considerations | dated `*_CONSIDERATIONS_*` docs and core audits |

Worlds follow the same pattern: each world folder has a `WORLD_BRIEF.md` front door plus the completion template.

**F2. The missing piece is a front door, not more owners.** No single place lists, for one system, its rulebook, representation, code-map section and palettes together. So a lane has to search four places, and two lanes can end up deciding the same thing in different ones. Today's example: the combat display gaps and the fight-surface redesign landed in different sessions.

**F3. Cross-cutting topics had no owner. Each one is now filled or being filled.**

| Topic | Owner | State |
|---|---|---|
| Look and UI identity | `DESIGN.md` | being written by the UI-identity session; "one home per fact" requirement sent to it |
| Writing voice | a section of `DESIGN.md` | draft being prepared at `docs/gm/dispatch/ui-identity-combat-2026-10-30/WRITING_VOICE_DRAFT.md` for that session to fold in |
| Saves and compatibility | `docs/SAVES.md` (contract and decision ledger); S12 stays the code map | sonnet agent writing it |
| Balance and numbers | `docs/BALANCE.md` (an index of dials, targets and proposal status, no new numbers) | sonnet agent writing it |
| Weapon runes | four 2026-10-14 near-duplicates merged into one representation or palette | sonnet agent merging |
| Procedural generation | GR1–GR17 rulebook links its five dated palettes | sonnet agent adding the pointers |

**F4. Some code clusters have almost no owner-doc coverage.** Counted by how many rulebook, representation and systems-guide files mention the cluster prefix. A low count suggests a gap but does not prove one.

| Cluster | Source files | Owner docs mentioning it | Likely home |
|---|---|---|---|
| `steam_*` (game-source absorptions) | 19 | 1 | world or absorption ledger plus a code-map row |
| `cohort_battle*` | 9 | 2 | COMBAT representation and combat code map |
| `causal_story*`, `causal_situations` | 9 | 2 | needs a code-map row; a story-engine owner may not exist |
| `vessel_*` (practice forks) | 7 | 1 | skills and ability owners |
| `pocket_*`, `mistglass_*` | 12 | 1–3 | their world folders |
| `lore_history*`, `lore_practice*` | 6 | 3 | KNOWLEDGE representation, S13 |

**F5. Two more cross-cutting topics have no owner but don't need one yet.** Performance has one dated review (`ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14`) plus perf scenarios in tests. The machine ran at load 75 today, so it may matter soon. Sound has settings ("Effects & sound") but no design owner. It is low value until audio work starts.

## Answer

The answer is no, not one file per system. Every in-depth system needs one front-door row that links its existing layers. A cross-cutting topic that every system touches needs one owner file. Those topics are look and voice, saves, balance, and later performance. Smaller subsystems become sections of their parent's owner, and world content stays in the world folder.

## More to consider

**ACT NOW (done in this pass)**
- The UI-identity session was told about the "one home per fact" requirement. The combat-surface session got the duplication evidence and the stale-hp bug.
- This audit is saved, and it records the earlier advice change. Saving an owner said "one new top-level file". Weibao then asked for all five, so `SAVES.md` and `BALANCE.md` both exist as top-level owners. Voice stays inside `DESIGN.md`.

**ACCOUNT FOR NOW (constraints on the running doc work)**
- A1. Owners link rather than copy by default. The reason: an owner that restates another owner's fact recreates the drift F2 describes. The dial: a short summary is fine if it links to its source. So `SAVES.md` links to S12's file map instead of repeating it, and `BALANCE.md` links to the numbers in code instead of restating them.
- A2. Each new owner gets an update rule naming what triggers an edit in the same change, as the systems guide already does. Without one, an owner rots into another dated doc. Examples: a save change updates the `SAVES.md` ledger, and a new dial updates `BALANCE.md`.
- A3. Overlapping writers. The absorb-similar-games session and the runes merge may both touch `representations/CRAFTING.md`. By default both edit hunk-only. Whoever lands second rereads the file first, because a stale copy would overwrite the other's hunks.
- A4. `BALANCE.md` lists today's damage-type values as proposals. The combat-surface lane owns `src/damage_types.js`, so `BALANCE.md` links to it rather than tuning it.

**LATER / DELEGATE (proposals; none starts without a go-ahead)**

| Item | Level | Effort | Done check |
|---|---|---|---|
| L1. Build the front-door index `docs/systems/README.md`: one row per in-depth system with rulebook codes, representation, code-map section, palettes, inspector or "none", and maturity. Include every F4 cluster. | sonnet | medium | Every S1–S19 system, every guide section and every representation has a row; `check:docs` clean; each F4 cluster has a row or a stated home |
| L2. Enforce the saves ledger: a test that fails when the save version or a migration list changes without a new `SAVES.md` row | sonnet | low | The test fails on a fixture bump without a row and passes with one |
| L3. Inspector column follow-through: systems marked "none" in L1 get a dev readout backlog entry, as the combat plan's M7 does | haiku to list, sonnet to scope | low | A list of systems without an inspector, each with a one-line readout proposal in its owner |
| L4. Performance owner, when perf work next comes up: fold the 2026-10-14 review and the perf scenarios into one owner | sonnet | medium | One doc names budgets, scenarios and the gate command; the dated review is linked as history |
| L5. A sound owner, deferred by default until audio work starts, since there is nothing to own yet | sonnet | low | One doc names the sound settings, cues and their owners |
