# Foundation run: reconciliation residue and first shared seams, 2026-11-06

```receipt
build: 5a0e0b588b9cfe6f5775322dcb187aa6b9a57e2418a1af653cbed9f46ca443a4
route: fixture(focused tests)
state: built
viewport: n/a
persistence: n/a
tests: full suite 5248/5248 on the folded tree (bundle 5a0e0b58); focused per lane as recorded
review: diff-scoped
surface: see lane table
```

Request (Weibao, 2026-11-06): "lets work on these to completion", after the [reconciliation of the remaining sources](../../../audits/LARGER_FOUNDATIONS_2026-11-06.md#reconciliation-of-the-remaining-sources-2026-11-06) (M1-M6, O1-O13, U06, U10). Method: the [foundation run playbook](../../FOUNDATION_RUN_PLAYBOOK.md). This record owns the wave's evidence. Everything in the audit is a proposal (AD32); this wave builds only slices with a play consumer, below floor until shown otherwise.

## Why these slices

A slice qualifies when a shared seam gets its first play consumer and its files are disjoint from every other lane (AD51, FND5). M5 turned out to be built (`continuation_state.js`), M4 has no consumer, and O1-O13 have no accepted design or first consumer. The residue lanes found these four slices with a consumer and a free file set.

| Lane | Slice | Owner files | First consumer | Why foundational |
|---|---|---|---|---|
| A | U06 `knownTargetFacts` adapter: predicates about another actor read just recorded observations | `src/known_target_facts.js` (new leaf), `src/simulation_effects.js`, `tests/known_target_facts.test.js` | `rival_memory.js` appraisal gate (Mara) | Belief fence FD16 and FD18 both need; today `simulationFacts` exposes raw target state (`simulation_effects.js:131-232`) |
| B | M6 loop `cause` (chosen, imposed, entrapped) and per-attempt re-processing check | `src/harm_loops.js`, `src/continuation_state.js`, their tests | Mother of Learning restart rows (`mol_zorian_loop.js`) | Loop kinds are shared by MoL, Frontier and any rewind world; `continuation_state.js` holds the saved life |
| C | M2 care access record and M3 interrupted-operation record | `src/care_access.js` (new leaf), `src/interrupted_operation.js` (new leaf), `src/storylet_content.js`, `src/everyday_life.js`, tests | Village fever storylet (`storylet_content.js:52-54`); Village `village.interrupted` (`everyday_life.js:52-66`) | Care and stop-points recur in 5+ worlds (detail pass J8, J9); today three one-off forms |
| D | M1 shared batch/label identity | `src/batch_identity.js` (new leaf), `src/book_world_lotm_actions.js`, tests | Klein's Seer dose allocation (`book_world_lotm_actions.js:45-47`) | HP brewing has batches (`hp_brewing_state.js:38,68`); LOTM doses have none; one shape serves both |

Lane C joins M2 and M3 because both are small, both are Village, and one writer owns both files.

Rejected, with reasons: M4 copies/portraits/remote agents (no reachable consumer); M5 (already built; rewind outside Frontier and loop-row starts waits for a consumer); O1-O13 (no recorded decision by Weibao yet (AD32), no first consumer; kept as proposals in the audit); canon-pull and rival generalizations (need a record-shape decision first; O6 folds the rival case); NPC schedule fact (small controller `when` input, folded into LATER below); loyalty drift, tiered asks and strain from the prior-art lane (fold into OB rows, designs just).

## Reservation

Another session is active in this checkout and has uncommitted edits to `src/book_world_lotm_ui.js`, `src/native_tool_domains.js`, `src/tempo_fight_domain.js`, `docs/gm/dispatch/cross-world-run-2026-11-06/CHECKPOINT.md`, and shell/Tauri files. No lane here touches those. `dist/` and `index.html` are shared build output and stay uncommitted. The coordinator is the sole builder and committer.

## More to consider (coordinator pass, before dispatch)

- **ACCOUNT FOR NOW, MC1 untouched lives write nothing.** B changes the saved continuation slice and A touches the core fact builder. An untouched life must produce byte-identical fixtures and no new save key (SAVES sections 3, 5, 6). Each lane's tests include a byte-identical case.
- **ACCOUNT FOR NOW, MC2 no new cycle or composition-root import.** New leaves import nothing from `main.js`; run `npm run check:arch` at the fold (AR1-AR16).
- **ACCOUNT FOR NOW, MC3 observer safety is the test.** A's failing test: a predicate on another actor's hidden condition cannot be met without a recorded observation (AD6-AD8).
- **ACCOUNT FOR NOW, MC4 a lane report of "wired" needs a caller.** The coordinator greps each seam's callers before recording it (AT13).
- **LATER, MC5 NPC schedule fact.** A time-of-day or place fact readable in a controller `when` (`simulation.js:704`), plus a test that controller actions reach state through the command path (default; dial: a world-specific host may differ; reason: a later goal layer reuses that path).
- **LATER, MC6 O-rows.** O6 (concealed capability), O9 (transfer of non-item holdings) and O10 (reset-and-carry predicate) join after A and B give them a base.
- **LATER, MC7 prior-art folds.** Loyalty drift, tiered asks, strain exit, term renewal and trigger re-check at delivery go into the OB rows and FD15/FD16 text, not this wave.

## Common lane rules (every brief links here)

Read before editing: AGENTS.md sections "Design framing", "Verification", "Safety", "Sealed secrets"; `docs/GROUND_RULES.md`; `.claude/rules/runtime-code.md`; `docs/ARCHITECTURE_RULES.md` AR1-AR16; `docs/SAVES.md` sections 3, 5, 6 when a slice adds or changes a saved key. Prohibitions: touch only the files in your lane row and no others; no `git add`, `commit`, `stash`, `checkout`, `reset` or `npm run build`; no `npm test` (run only your focused `node --test` files from the repository root); no visible window. Defaults are a default, a dial and a reason, never never/always. No `Co-Authored-By`. Do not write docs; the coordinator records receipts. Return under 400 words: files touched; commands with pass/fail counts; change surface (core-owner files, new import edges, registration lines); what is not covered; delivery state in one line ("implemented, below floor" unless floor is shown).

## Lane receipts

### Lane B, M6 loop cause and attempt identity (done, below floor)

`src/harm_loops.js` (`LOOP_CAUSES`, `rowCause`, default `imposed`; validation rejects other values; `loopPlan` results carry `cause`) and `src/continuation_state.js` (`claimAttempt`, `ATTEMPT_MEMORY` 32, called at the restart, loop-end and cycle plans; optional `life.attempt {count, tokens}`; validated only when present). Tests: `tests/harm_loops.test.js` (new, 3), `tests/continuation_state.test.js` (+3). Coordinator check: diff read (52 insertions, 3 deletions across 3 files), `node --test tests/harm_loops.test.js tests/continuation_state.test.js` 35/35 (lane ran 96 across 11 importing files), `claimAttempt` has two plan callers plus the restart one. Not covered: replays older than 32 attempts; `mol_zorian_loop.js` still counts cycles from the deaths ledger; `loop_table.js` readout does not show `cause` yet (follow-up: add `cause: rowCause(r)` to its `derived()`); byte-identical load is a JSON round trip, not a stored pre-change fixture. Owed at the fold: SAVES.md line "`continuation.lives[id].attempt` optional `{count, tokens[≤32]}`, written on first restart or cycle, absent saves load unchanged, no migration."


### Lane C, M2 care access and M3 interrupted operation (done, below floor)

New leaves `src/care_access.js` (`careRecord`, `validateCareRecord`, `applyCare`, `careLabel`; gate kinds price, rank, favor; unmet gate returns `ok:false` with empty effects; `doesNotRestore` surfaced, never applied) and `src/interrupted_operation.js` (`interruptedOperation`, validator rejects a missing stop point). Edits: `src/storylet_content.js` (fever healer choice built from `feverCare`, label and effects unchanged, +8/-1), `src/everyday_life.js` (`villageInterruption` derives the record from `village.interrupt_work`; `village.interrupted` now reads it, +7/-1). No new saved key (record derived on read). Tests: `care_access` (4), `interrupted_operation` (2), `everyday_life` (+2). Coordinator check: diff read; `node --test` on care_access, interrupted_operation, everyday_life, storylet_deck 26/26 (lane ran 36 across 7 files); consumers are the fever storylet and the Village fact. Honest limits: the interruption record is a derived view with hand-written text, so it proves the shape and not a second consumer; only the fever route uses `care_access`, so rank and favor gates have no play consumer yet; `wait_until.js` and `agreed_duty_continuation.js` still use their own forms; `check:arch` not yet run.


### Lane D, M1 shared batch identity (done in part, below floor; consumer not reached by play)

New leaf `src/batch_identity.js` (`makeBatchRef`, `splitPortion` conserving doses, `describeBatch` hiding grade for an unidentified batch, `validateBatch` accepting an HP brewing batch, `fromHpBatch` adapter). Edit: `src/book_world_lotm_actions.js` (+10): `allocatedDoseRef(state)` derives the issued Seer dose's batch ref from the existing `book.lotm.terms` knowledge record's minute; derived, never saved. The `accept_allocation` definition was NOT changed because its hash is pinned by `tests/lotm_commands_golden.test.js` against `tests/fixtures/lotm_commands_golden.json` (outside the lane's list); recording the ref in the record's `basis` would need that fixture regenerated, a decision left open. Tests: `tests/batch_identity.test.js` (5, incl. a loop proving split conserves doses). Coordinator check: diff read; `batch_identity` + golden test 6/6 (lane ran 391/391 across files importing the actions file; `check_architecture` no growth). **Finding (AT13 shape): `allocatedDoseRef` has no caller outside its test, so no play route reads the ref.** The seam exists and is tested; the first consumer is not wired. Wiring options: (a) a LOTM panel or consequence reads the ref (recall, tampering, forged label), (b) record in `basis` and regenerate the golden fixture. Neither done.


### Lane A, U06 `knownTargetFacts` adapter with Mara's appraisal as first consumer (done in part, below floor; no play caller)

New leaf `src/known_target_facts.js` (`knownTargetFacts`, `knownTargetFactValues`, `requiresObservation`; returns only the actor's recorded `person.<id>.*` observations with stage, time and cause from the existing knowledge store). Edits: `src/simulation_effects.js` (the `person.<id>.*` copy in `simulationFacts` now calls `knownTargetFactValues`; same keys and values; one new import edge to a leaf) and `src/rival_memory.js` (`RIVAL_OBSERVATION_KEY`, optional `observed` argument on `appraisalMeans` and `rivalBrief`; `rivalCombatant` never reads it, so the hidden margin applies either way). Tests: `tests/known_target_facts.test.js` (4). Coordinator check: diff read; `node --test` known_target_facts + rival_memory 7/7 (lane ran 114/114 across the 18 files importing `simulation_effects`). **Findings.** (1) No play caller: the only runtime caller of `rivalBrief` is `src/tempo_fight_domain.js:134`, which another session has uncommitted edits to, so it was left alone; the wiring is one line, `rivalBrief(facts, knownTargetFacts(state,'player','roadRival'))`, and nothing writes `person.roadRival.strength` yet. (2) The adapter wraps the observation path that already existed; raw `target.*` facts (life, body, vitals, items, conditions) are still exposed to rules that already use them, so the U06 gap narrows to a rule-authoring policy plus this seam, not a closed fence. Appraisal and price rules must be written against `requiresObservation` keys.

## Resume block (unattended run, 2026-11-06)

"lets work on these to completion" (Weibao, 2026-11-06, after the reconciliation).
- Objective: lanes A-D each implemented with focused tests, folded on one tree, `npm run build`, `npm test`, `npm run check:arch`, `npm run check:rules` pass, own paths committed (no push), receipts recorded here, audit rows M1-M3, M6, U06 updated.
- Input identity: master `b9d020380`; dirty but not ours: the files in Reservation, `dist/`, `index.html`, `scripts/perf/`, `desktop-tauri/`.
- State of the steps: residue lanes returned and folded into the audit; wave selected; lanes A-D returned and recorded (A, D have no play caller); fold gates run: build 5a0e0b58, npm test 5248/5248 (includes another session's uncommitted edits), check:arch no growth, check:rules pass, check_doc_slips no new hits. Committed as 353396d41 (own paths, no push). No native walk yet.
- Last evidence: build 5a0e0b588b9c, npm test 5248/5248 on the folded tree (430 s), check:arch growth -2/-1/0, check:rules pass. Not run: native game walk, browser at 1920x1080, persistence save/reload/import (lane B changes the continuation slice; only JSON round trips tested).
- Failed approaches: none.
- Hold (Weibao, 2026-11-06): "wait till move to tauri". Run no native walk and wire no further consumer until the Tauri host move; the walk then runs on the Tauri harness (`scripts/tauri/harness.mjs`). Earlier text of the next action follows.
- Next useful action: wire A's one line in `tempo_fight_domain.js` when its other session commits; decide D's consumer (readout vs golden fixture); then one headless walk of the Village fever, an MoL restart replay and the Mara brief on a fresh origin with save/reload/import.
- Usage pacing: read 2026-11-06 evening: 5-hour 2%, weekly 60%. Continue while weekly under 75% and 5-hour under 85%; at 5-hour 85% wait for reset; at weekly 75% stop and leave this block current.
- Stop condition: commit hashes recorded for lanes A-D, or a blocker that Weibao must clear. Reached? code lanes yes (353396d41); native walk and the two open consumer wirings (A: tempo_fight_domain line, D: LOTM readout or golden fixture) not done.

Resume prompt for a fresh session: "Continue the unattended run from the Resume block in docs/gm/dispatch/foundation-run-residue-2026-11-06/CHECKPOINT.md. Check `git status` and `git log -3` against its input identity first; finish the next useful action; keep the block current; commit own paths, no push."
