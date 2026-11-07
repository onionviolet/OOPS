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

## Native walk (headless, game MCP, scratch worktree of HEAD `cb382d4a2`, bundle b213f540cbbabed76274ac49ad2154320eabaadba25d85afcff528cbd5e311b9)

Agent-verified, not human-reviewed. Proves HEAD `cb382d4a2` (the three wave commits), not the later one-line rival wiring `1568691d5`. Fresh Village life, seed 11, no private pack, no page errors. Weibao asked for the walk on 2026-11-06 after the Tauri host landed (`4b4465412`).

| Item | What the player saw | Result |
|---|---|---|
| W1 fever healer (M2) | Card "Sela's child has a fever. The healer can visit, or you can bring the message yourself." with the three choices unchanged; chose the healer; inventory "11C 2W" to "10C 6W" (6 coins); log "Send for the healer · 6 coins" then "resolved" | Pass |
| W1 relationship line | "Sent for the healer" not seen on the screens opened; no Sela relationship view found | Not confirmed |
| W2 interrupted craftsman (M3) | `village.interrupt_work` never offered: the craftsman unlocks late in the elder's questline behind field combat | Not reached |
| W3 persistence | Day 6, 15:35, Village, "10C 6W", fever card "resolved" identical in the original session, after reload, and in a new session after export and import | Pass |
| W4 loop restart replay (M6) | Scenarios listed (fresh, fresh-day3, fresh-week, perf) have no loop row; Worlds panel offered only "A Soldier's Life" | Not reached |

Limit report filed once (craftsman and loop starts unreachable headlessly without the elder chain and field combat). About 6 game days stepped. Scratch worktree removed.

**What this leaves.** M2 has natural-route evidence for the fever choice and its persistence. M3 and M6 have only unit and golden-hash evidence; both need a scenario recipe (a craftsman-ready Village save, a Frontier or Zorian loop save) added to `scripts/headless/scenarios.mjs` before a walk can reach them. A and D have no walkable consumer yet. Delivery stays "implemented, below floor" for M1, M3, M6 and U06; M2 has a natural-route pass for one choice but the floor's other lines are unchecked.

### Native walk 2 (headless, scratch worktree of HEAD `8821c275c`, bundle f7f7555fc30224b62e79263b9afddbaf7c0727bb6d4460a0d7c6df4532fe549e)

Agent-verified, not human-reviewed. New recipe `village-craftsman` (`scripts/headless/scenarios.mjs`, commit `8821c275c`). No page errors, no private pack.

| Item | What the player saw | Result |
|---|---|---|
| W2 interrupted craftsman (M3) | After commissioning a kit the action "Ask for his attention at the busy bench" appeared; used once: "He is still irritated by the interruption", an "Unsettled" effect, the button gone; 30 minutes later "He has returned to his tools. You remember his earlier request for quiet."; People memory "You interrupted him while he was counting fittings. He asked for quiet." Same lines after save, reload, and export/import (state hash e6d0a386842252bd) | Pass |
| W4 Frontier deliberate loop (M6) | Continuing connection, Return tab: checkpoint set (Anchors: Initial Y999 4/1 08:00, Later 4/5 08:20), loop enabled; the cycle fired once (save clock at the checkpoint time); "Completed cycles: 1" after export/import and again after a second reload | Pass for one cycle counted once; a forced duplicate delivery was not attempted |

Findings. **F1** `src/simulation_ui.js` hides the "Follow local people and work" section until the player is already enrolled, so that button is unreachable; enrolment worked through "Begin Village encounters" (inferred from the hidden-element error plus source; owner: simulation UI). **F2** the `village-craftsman` recipe still needs the Notebook unlocked and the kit commissioned before the action shows (talk to both NPCs, woodcut, commission); a later recipe patch could skip it. **F3** a loop cycle freezes the harness: `game_reload` and `game_new` cannot click PLAY afterwards and `game_look` fails on the session that cycled (one limit report filed). The first-session reload after the cycle is inferred; the pass rests on the imported session.

**State after both walks.** M2, M3 and M6 have natural-route evidence on a fresh origin including persistence. M1 and U06 have none because no play route reads them. Delivery stays "implemented, below floor" (no 1920x1080 browser check, no installed-app check).

## Wave 2 (Weibao, 2026-11-06: "skip gates? full blast on finishing all the features and ideas, fix problems accordingly")

Reading: skip the per-slice full gates, keep one final gate before commit (another session pushes master, so an untested commit would reach the remote). Lanes ran focused tests only. Usage read before dispatch: 5-hour 43%, weekly 65% (stop line 75%).

| Lane | Slice | Files | Result |
|---|---|---|---|
| E | U10 NPC schedule fact (pseudo agency through the command path) | `src/npc_schedule.js` (new leaf), `src/simulation.js` (+7/-2), `src/simulation_content.js` (+5/-1), `tests/npc_schedule.test.js` (5) | implemented, below floor; dormant in play: the craftsman row reads `untimed` until `calendarMinute` is in non-player contexts (`main.js:1684`, not wired); 1118/1118 on importing tests |
| F | cold/wet resistance facet of the Poison resistance owner (no sick state; XP into the existing key) | `src/hazard_resistance.js` (new), `src/active_effects.js` (tags), `src/models/hero.js` (+5), `src/absorb_c2/local_life.js` (+5), `src/main.js` (+3/-1), `tests/hazard_resistance.test.js` (7), `tests/structured_equipment_runtime.test.js` (param list) | implemented, below floor; division `1 + (coef-1)*0.5` floored at 1; growth just on the Frontier hook, Village gets division without growth; wider run 887/888, the one failure (a live cast-adapter integration test) passed alone 17/17 |
| G | rival scouting writer: "Study her stance" records `person.roadRival.strength` | `src/rival_memory.js` (+23), `src/tempo_fight_domain.js` (+17), `tests/rival_study.test.js` (5) | implemented, below floor; margin unchanged, just the telling; no `basis` (validator needs a real situation); 70/70 focused |
| H | walk findings | `src/simulation_ui.js` (F1: enroll button out of the hidden Work section), `scripts/headless/runner.mjs` (F3: settle on a stalled clock; unproven against a real cycle), `tests/simulation_ui_enroll.test.js` (1) | F1 fixed with a test that fails on the old file; F2 not patchable as data (needs an engine enrol and commission step); F3 inferred from source |

Coordinator checks: diffs of `hero.js`, `main.js`, `simulation.js`, `tempo_fight_domain.js` read; each shared file holds only this wave's hunks; other sessions' dirty LOTM, positions and heat files left unstaged.

## Resume block (unattended run, 2026-11-06)

"lets work on these to completion" (Weibao, 2026-11-06, after the reconciliation).
- Objective: lanes A-D each implemented with focused tests, folded on one tree, `npm run build`, `npm test`, `npm run check:arch`, `npm run check:rules` pass, own paths committed (no push), receipts recorded here, audit rows M1-M3, M6, U06 updated.
- Input identity: master `b9d020380`; dirty but not ours: the files in Reservation, `dist/`, `index.html`, `scripts/perf/`, `desktop-tauri/`.
- State of the steps: residue lanes returned and folded into the audit; wave selected; lanes A-D returned and recorded (A, D have no play caller); fold gates run: build 5a0e0b58, npm test 5248/5248 (includes another session's uncommitted edits), check:arch no growth, check:rules pass, check_doc_slips no new hits. Committed as 353396d41 (own paths, no push). No native walk yet.
- Last evidence: build 5a0e0b588b9c, npm test 5248/5248 on the folded tree (430 s), check:arch growth -2/-1/0, check:rules pass. Not run: native game walk, browser at 1920x1080, persistence save/reload/import (lane B changes the continuation slice; only JSON round trips tested).
- Failed approaches: none.
- Hold lifted: Weibao 2026-11-06 "Yes, run walk" after `4b4465412`. Walk done (see Native walk). Earlier hold text: "wait till move to tauri".
- Next useful action: (1) native walk of wave 2 on a scratch worktree of HEAD (study her stance; enroll button in an unenrolled hero; cold exposure XP; craftsman schedule stays dormant until `calendarMinute` reaches non-player contexts at `main.js:1684`); (2) a readout for D's dose batch label once the LOTM files are quiet; (3) the Village exposure tick for the cold facet; (4) the healer cure path and provider side; (5) O-rows just with a first consumer. Health round is written (BODY_AND_HEALTH_CONSIDERATIONS, 2026-11-06). Known not-mine failures at the last full run: Math.random baseline 29 vs 28 (`src/storylet_deck2.js`) and an unregistered `data-lotm-position` attribute.
- Usage pacing: read 2026-11-06 evening: 5-hour 2%, weekly 60%; after wave 2: 5-hour 60%, weekly 67%. Continue while weekly under 75% and 5-hour under 85%; at 5-hour 85% wait for reset; at weekly 75% stop and leave this block current.
- Stop condition: commit hashes recorded for lanes A-D, or a blocker that Weibao must clear. Reached? code lanes A-H yes (353396d41, 1568691d5, 8821c275c, 4862bbb9d); open: D's consumer, native walks of wave 2, the O-rows.

Resume prompt for a fresh session: "Continue the unattended run from the Resume block in docs/gm/dispatch/foundation-run-residue-2026-11-06/CHECKPOINT.md. Check `git status` and `git log -3` against its input identity first; finish the next useful action; keep the block current; commit own paths, no push."
