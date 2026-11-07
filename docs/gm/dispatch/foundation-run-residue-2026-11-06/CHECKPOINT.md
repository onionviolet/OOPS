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
| F | cold/wet resistance facet of Poison resistance | (reverted, see Wave 2 correction) | built in `4862bbb9d`, reverted after the native walk showed the original Cold resistance skill already owns cold exposure; lessons: lane F's repo search missed `skills["Cold resistance"]` (`src/data/skills.js:917`), so a lane brief should name existing owners from a grep of the skill table, not rely on the lane's own search |
| G | rival scouting writer: "Study her stance" records `person.roadRival.strength` | `src/rival_memory.js` (+23), `src/tempo_fight_domain.js` (+17), `tests/rival_study.test.js` (5) | implemented, below floor; margin unchanged, just the telling; no `basis` (validator needs a real situation); 70/70 focused |
| H | walk findings | `src/simulation_ui.js` (F1: enroll button out of the hidden Work section), `scripts/headless/runner.mjs` (F3: settle on a stalled clock; unproven against a real cycle), `tests/simulation_ui_enroll.test.js` (1) | F1 fixed with a test that fails on the old file; F2 not patchable as data (needs an engine enrol and commission step); F3 inferred from source |

Coordinator checks: diffs of `hero.js`, `main.js`, `simulation.js`, `tempo_fight_domain.js` read; each shared file holds only this wave's hunks; other sessions' dirty LOTM, positions and heat files left unstaged.

### Wave 2 native walk (headless, scratch worktree of HEAD `498a7b10b`, bundle 01eab058f9675f176a54fb5026eae69e86129dec4602c213930df888af7dfeb7)

Agent-verified, not human-reviewed. No page errors, no private pack.

| Item | Result | Notes |
|---|---|---|
| W5 enroll button (F1) | Not reached | The "Craftsman & workshop" panel did not appear in the panel list before or after enrolling; the earlier walk reached the section only after the craftsman was met |
| W6 Study her stance | Not reached | No Mara, rival or contest panel appeared within about 1 game day |
| W7 cold/wet resistance | Observed, but it showed the design error | Poison resistance +4.8 then +9.6 XP over two hours of Wet and Cold, and "Cold resistance +4.6 XP" at the same time: the original skill already trains from the same exposure. The facet was reverted |
| W8 loop cycle (F3) | Partial | `game_look` and `game_status` now work on the cycled session and the next step works; `game_reload` still cannot click PLAY (page does reload; loop state persisted). The F3 fix is incomplete; ledger entry 56 |

**Wave 2 correction.** Lane F's facet is reverted (working tree, committed with this note). E, G and H stand. W5 and W6 remain unwalked: a recipe is needed that reaches the Craftsman & workshop panel and Mara.

### Wave 2 continuation: recipes and contest placement (2026-11-06)

Request: Weibao supplied the interrupted recipe handoff and said "Continue work accordingly". Scope: finish `village-workshop-unenrolled` and `village-rival`, walk W5/W6, and fix defects that prevent those walks. Desktop target 1920×1080; visible outcome: the unenrolled hero can follow local work, and Mara's unread brief can be studied for ten minutes and retained. Mobile, new health mechanics, NPC calendar wiring and new Frontier depth remain outside this slice. Rules: AD36, AD41–AD43, AR3/AR7–AR10/AR17, UR14–UR17; [architecture](../../../ARCHITECTURE_RULES.md), [UI](../../../UI_RULES.md), [look](../../../../DESIGN.md).

- **F4 prerequisite:** the old recipe unlocked craftsman dialogue but did not complete the greeting that introduces him to the Notebook. Enrollment also requires meeting the elder. Both new recipes click the two native greetings; they seed craftsman story access to bypass the elder's combat chain. The rival recipe then inspects the crossing, joins with route findings, meets Mara and advances the pursuit using native buttons and time. No saved membership, pursuit or appraisal is fabricated.
- **F5 placement defect:** the connected encounter slot in the inactive Tingen panel captured the Village contest. Returning to the fallback then fought the Notebook's placement on every render. Tingen now marks its encounter slot inert outside resident play; this is separate from the seat filter's ownership of `hidden` (real MutationObserver delivery exposed that difference in Chrome). The tempo host skips inactive slots and preserves the Notebook's connected fallback placement. Study feedback now confirms the observation rather than saying fight controls disappeared. No new save fields or combat mechanics.
- **A2 verification:** `tests/headless/village_wave2.test.js` covers visible enrollment without a simulation and study cost, feedback, repeat-button removal, save/reload and literal export/import. `tests/tempo_host.test.js` adds inactive-slot and Notebook-ownership regressions.

```receipt
build: 5270cf2b28815d1848248224b5ac869abad1e463d66c88ac6570b8ed6416faf5
route: fixture(village-workshop-unenrolled and village-rival; seeded craftsman access, native greetings and progression)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: final focused 15/15; final full suite 5514/5514
review: agent-verified, not human-reviewed
surface: W5/W6; tempo placement, Tingen slot availability, named recipes; no save schema change
```

| Check | Result and limits |
|---|---|
| `npm run build` | Pass; existing duplicate `dial` warning in `src/travel_legs.js`. Shared generated outputs left uncommitted. Browser proof uses its own disposable rebuilt bundle, hash above. |
| `node --test tests/headless/village_wave2.test.js tests/tempo_host.test.js tests/rival_study.test.js` | 15/15 on final source, including native enrollment, ten minutes charged once, appraisal, success feedback, save/reload/export/import, hidden/inert slot refusal and Notebook placement retention. |
| `npm test` | Final post-browser-fix run passed 5514/5514 (368 s) on the shared working tree. Earlier source variants are superseded for this slice by this run and the final focused/browser evidence. |
| `npm run check:arch` | Pass, main/display/save growth -2/0/0, six grandfathered main imports and 205 cyclic edges. No new imports, cycles or composition-root registration. |
| `npm run check:rules` | Pass; existing warnings concern another session's staged/untracked prose-owner paths. |
| `node scripts/check_doc_slips.mjs` | Whole-tree diagnostic reports other sessions' added docs; no finding in this checkpoint's changed lines. Scoped `git diff --check` passes for the six owned paths. |
| Game MCP, frozen build `075a98f0…`, manifest `de19f72f…` | W6 unread brief and study button visible; 08:09 → 08:19; appraised line survives save, reload, export/import; zero page errors. This precedes the final browser-only inert fix and success-message correction; final-source proof is the focused runner and Chrome walk. Disposable sessions closed. |
| Private Chrome walk using `scripts/playtest/lib.mjs`, fresh contexts | W5 visible/enabled while `simulation` is null, click creates local simulation. W6 unread → appraised, ten minutes, study button removed, appraisal visible after fresh-context saved-state load. No browser errors, horizontal overflow or clipped text. Whole-screen diagnostic also notes one unnamed and one disabled-without-reason control outside the exercised action assertions; no general UI-cleanup claim. |

Private evidence: `private/foundation-run-residue-2026-11-06/wave2-continuation/` at the repository root contains the browser report, runnable walk, three screenshots and source hashes. No private player save was opened. Source changes, tests and checkpoint are the six owned paths; generated bundles and other sessions' index/worktree edits are excluded from the commit. No push or install is part of this continuation.

**Delivery:** W5 and W6 are agent-verified through named fixtures, not human-reviewed. E's calendar context, W8 loop reload, D's batch-label consumer and health/provider work remain open. This does not upgrade the entire foundation wave to the delivery floor.

### Follow-through: loop reload, NPC calendar and dose label (2026-11-06)

Request: "Continue with the loop reload fix, then wire the NPC calendar and dose-label consumer." Order: close W8 before changing E, then close E before wiring D. Existing authority: AD36/AD41–AD43, AR3/AR6–AR10, U10 schedule definition and M1 batch identity above. No new health mechanics, expanded Frontier content or save schema. Desktop target 1920×1080 for the consumer proof; mobile and installed-host adoption deferred. Player wording sample (PRS7): "One prepared dose now sits in your hands under the supervisor's allocation."

- **F6 loop:** persisted deliberate repetition auto-clicks PLAY in native startup. The runner's extra PLAY click hit its hidden parent. Stepping also returned during asynchronous continuation validation. The runner now recognizes a created hero with the startup screen closed and settles transitions for steps as well as clicks. Baseline reproduced the hidden-PLAY error; direct native route now reaches cycle 1 and explicit reload succeeds. `scripts/mcp/game_mcp_check.mjs --loop-only` passes through step/look/status/save/reload/export/import on the same session, including one cycle counted once. The startup error remains an error unless the native screen is already closed for a created hero.
- **A3 calendar:** native calendar minutes now reach non-player contexts through the existing context builder, preserving the clock owner and authored schedule. Six focused tests pass, including a native near-dawn fixture: a queued commission waits before 06:00, starts afterward, and finishes through the existing command path. The fixture seeds story access, two logs and the near-dawn time; greetings, enrollment and commissioning are native actions. No schedule state is saved.
- **A4 dose label:** `allocatedDoseView` projects the existing allocation ref into the Work & merit held-stock readout. Seven batch/golden tests and the native dose-label journey pass: absent before allocation, shown while held, stable after save/reload/export/import, absent after drinking. An unidentified grade stays hidden; a retained allocation record does not label later stock. The golden-pinned allocation action is unchanged. This first consumer is the supervised probationer route; no claim that Klein's separate cast-item route now carries a batch ref.

```receipt
build: c6107daff819781bd5cef9916ed3a97e21b169eebbe11d50ac0a159c60d588c3
route: native fresh-life repeat loop; fixture(near-dawn craftsman); native supervised Tingen allocation
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: loop protocol PASS; calendar 6/6; batch/golden 7/7; native label 1/1; final suite 5525/5525
review: agent-verified, not human-reviewed
surface: W8 runner transition boundary; E native NPC context; D allocation read model and held-dose UI; no save schema change
```

Change surface: one context-field addition on an existing `main.js` line (net zero composition-root lines); existing action/batch imports extended, no new runtime dependency edges. `book_world_lotm_host.js` and `main.js` also contain another session's unrelated edits: the commit must reconstruct these two files from fresh HEAD plus this task's specific import/projection/context hunks, rather than staging the complete working copies. The remaining own paths are runner, MCP regression, actions/UI, batch tests, two nested native journeys, this checkpoint and the Game MCP limits doc. Generated outputs, private evidence and the shared staged index are excluded. User saves remain untouched; all walks use disposable lives.

| Final check | Result and scope |
|---|---|
| `node scripts/mcp/game_mcp_check.mjs --loop-only` | PASS: a real deliberate cycle reloads once; look/status, next step, save, reload and file export/import work in the same session. Cycle count stays one. |
| `node --test tests/headless/npc_calendar.test.js tests/npc_schedule.test.js` | 6/6. Near-dawn fixture waits before 06:00 and starts/finishes the authored commission afterward. |
| `node --test tests/batch_identity.test.js tests/lotm_commands_golden.test.js` | 7/7. Pure observer-safe label, no new save keys; original allocation action remains byte-identical. |
| `node --test tests/headless/lotm_dose_label.test.js` | 1/1. Native allocation, visible label, save/reload, literal export/import, removal after drinking. |
| Game MCP calendar / label walks | Zero page errors. Fixture clock 05:58: queued, no work; 06:01: craftsman job running; 06:06: completed kit collectible. Tingen allocation renders the issued label. Disposable saves hashed `7786c466e31241af` and `a4e37867673cd9ea`; sessions closed. |
| Rebuilt Chrome, fresh contexts, 1920×1080 | PASS on the receipt bundle. NPC order survives a saved-state load across dawn, starts and completes. Dose label survives fresh-context reload and native file download/upload import, then disappears after ingestion; the ingested fact is asserted. Zero errors, page overflow, clipped text or diagnostic unnamed controls on the final screen. First browser attempt raced import's page reload; the test wait was corrected without further game code changes. |
| `npm test` | 5525/5525, 644.5 s, shared working tree with other sessions' edits. Nested native journeys are checked separately above. |
| `npm run build`; `npm run check:arch` | PASS in the primary and clean candidate. Existing duplicate `dial` build warning; main/display/save growth -2/0/0, six grandfathered main imports and 205 cyclic edges. |
| `npm run check:rules` | Clean scoped candidate PASS with zero warnings. Shared-tree run stopped at three malformed receipt fields in another session's untracked performance checkpoint. Player-text passed separately; direction sync reported an unrelated PROJECT/log warning. The draft is preserved. |
| `node scripts/check_receipts.mjs --files .../CHECKPOINT.md`; scoped `git diff --check` | PASS. Whole-tree document-slip diagnostic has no finding in this task's checkpoint/limits changes; other sessions' additions retain their own findings. |

Clean verification used a temporary detached checkout of `abdaedf0a` plus the eleven owned paths, with the main/LOTM host changes reconstructed by exact owned hunk. Its build, architecture, rules and seven batch/golden tests pass; no equivalent full suite was repeated there. Screenshots, final browser report/script, source identities and logs are kept under `private/foundation-run-residue-2026-11-06/follow-through/`, outside the commit. The temporary checkout is removed after the guarded commit. No push or install.

**Delivery:** W8 loop reload, E's NPC calendar wiring and D's existing supervised-allocation label consumer are agent-verified, not human-reviewed. No new save schema or migration is needed. This closes these bounded gaps, not every proposed foundation mechanism or the separate Klein cast-item batch route.

## Resume block (unattended run, 2026-11-06)

"lets work on these to completion" (Weibao, 2026-11-06, after the reconciliation).
- Objective: finish the requested loop reload fix, then NPC calendar wiring and the existing dose-label consumer, with native/persistence/browser evidence and scoped commits, no push. The Follow-through section above owns current checks and limits.
- Input identity: this follow-through started from master `abdaedf0a`. Other sessions' staged prose/direction/content edits, dirty main/LOTM authority files and unstaged research/performance/build outputs were present; preserve them and stage the two shared source files by owned hunk.
- State of the steps: W5/W6 closed in `abdaedf0a`. W8, E and the existing D consumer now pass their Follow-through native, persistence and desktop checks above; full suite 5525/5525 and clean candidate rule/build/architecture checks pass. Retain the recorded scope for the separate cast-item route.
- Last evidence: see the Follow-through receipt above for current input hashes and checks. Earlier wave evidence stays in its dated tables rather than being treated as a fresh check.
- Failed approaches: cold/wet Poison-resistance facet reverted after finding the existing Cold resistance owner; unlocking craftsman dialogue without greetings did not expose the workshop; connected-slot placement hid the Village contest; using `hidden` for slot availability was overwritten by the browser seat filter. Final slot availability uses `inert`.
- Hold lifted: Weibao 2026-11-06 "Yes, run walk" after `4b4465412`. Walk done (see Native walk). Earlier hold text: "wait till move to tauri".
- Next useful action: the three requested changes and their checks are complete; retain the scoped commit and evidence. No new wave is started by this receipt. Remaining broader work after this request: healer cure/provider paths, Wet/filth ownership, and O-rows with a first consumer. The separate Klein cast-item route has no new allocation label from this consumer. Cold/wet Poison resistance was reverted; do not resume its growth tick.
- Usage pacing: read 2026-11-06 evening: 5-hour 2%, weekly 60%; after wave 2: 5-hour 60%, weekly 67%. Continue while weekly under 75% and 5-hour under 85%; at 5-hour 85% wait for reset; at weekly 75% stop and leave this block current.
- Stop condition: the three requested follow-through changes verified at their stated scope and own changes committed, with unrelated shared-tree gate failures named rather than silently adopted.

Resume prompt for a fresh session: "Continue the unattended run from the Resume block in docs/gm/dispatch/foundation-run-residue-2026-11-06/CHECKPOINT.md. Check `git status` and `git log -3` against its input identity first; finish the next useful action; keep the block current; commit own paths, no push."
