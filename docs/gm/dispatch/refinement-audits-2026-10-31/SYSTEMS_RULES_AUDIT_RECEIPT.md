# Cross-system and reconciled-owner refinement audit

2026-10-31. Audit only, one worker invocation, no descendants or paid fallback. Starting and inspected HEAD: `43466ba23505c9f751317b4bd9e3ee161158105f`. Scope: F5–F15 and RFX1–RFX8, selected current callers and pure tests. No source-book reading, runtime edits, build, private save access, visible browser, commit or push. Highest state: source-audited and focused pure checks, agent-verified, not human-reviewed. Browser observations attributed below belong to the independent UI worker, not this lane.

Authority: AD5–AD8, AD15–AD19, AD22, AD32, AD36, AD38, AD42–AD46; AR3/6/7/8/10; MR1–MR36 and their documented compatibility override. WPR21–WPR23/WPR27 guide evidence and handoff; the broader WPR remains proposed. Neither this receipt nor a reconciled owner turns deferred breadth, old-save migration or human taste review into a new gate.

## Prioritized findings

### SRR1, high: confidentiality outcomes create knowledge without a means (extends F6)

**Observed pure defect, plus a current player-facing caller.** `src/person_memory_effects.js:144–152` writes kept/broke-confidence directly into the asker's memory with `source:'saw'`, certainty 100. `gossipStep`, lines 184/194/195, invokes it when an NPC decides whether to tell another NPC. Its listener filtering checks those NPCs' co-presence, not whether the asker learns the outcome. A synthetic fixture placed holder/listener at `bench`, asker at `away`, all in world `w`; after one gossip step the absent asker acquired a helped memory, `kept_quiet`, source `saw`, certainty 100. No user/world secrets were used.

Producer → owner → consumer → persistence: private holder memory → gossip decision → `noteConfidence` changes asker memory → derived trust and `silenceLine` → `memoryForPlan` candidate → `expansion_persistence.js:63–77` writes the memory and daily causes before publishing. This is more than revealing text: unsupported knowledge also changes a relationship. `promise_ui.js:68–73` calls `silenceLine` when both people are alive and the visitor introduced; it has no observation check. The synthetic line was “About 97% likely to keep it quiet … So far he has kept it to himself.” F6's private pressure/rival factors remain another disclosure risk at this same boundary. The live UI route was not played here.

**Owner / next action:** person-memory/gossip owner and the promise projection. Keep the actual decision, separate the outcome from what the asker learns, and project reasons through known evidence. **Done check:** absent asker gains no witnessed account or certainty; witnessed betrayal and later attributed report do update the appropriate knowledge/trust; save/reload/import retains provenance and daily idempotence; inspecting the line neither reveals private factors nor changes the verdict. Do not solve this by turning off NPC gossip or freezing actual consequences.

### F7, high: passing fight-vitals leaves do not establish native publication

**Current integration bug reported by the UI auditor; pure unit coverage also passes.** `tempo_fight.js:249–251` now mirrors the player's fight HP/stamina into `plan.vitals.player` each move. Its current tests assert that equality, and passed here. At fight settlement `tempo_fight.js:119` also creates `plan.native` HP/stamina offsets. The independent UI worker reports a current isolated rebuilt fixture with fight-card HP 58.4/60 versus hero HP 60/60, native `hp_to_full=0`, retained through reload and literal import. Use its [receipt](UI_AUDIT_RECEIPT.md) for bundle, fixture and capture identity. This is not disproved by the pure test, and the older capture need not carry the new claim.

**Related SRR2, current transaction risk:** `tempo_fight_domain.js:80/86` calls `ports.commit(plan)` and only then `applyHarm(plan)`. That function changes the global harm slice through `setHarmState`; `harm_state.js:246–256` serializes that global state. The committed fight can therefore finish before its separate harm-owner update is saved. `persistExpansion`'s durable publication in `main.js` has no matching harm-effects staging found. This is a source-level durability window, not a separately exercised crash loss. The within-fight parts/worst records are saved, so the claim concerns final native aftermath.

**Owner / next action:** tempo domain and existing native transaction publisher, with harm owner. Trace per-move vitals and final harm through one detached envelope/native publication. **Done check:** meaningful player damage agrees across fight, native actor and envelope at each move; finish/withdraw writes actual injuries in the same committed transaction; immediate reload/import retains them; a rejected write leaves both owners unchanged. Coordinate with the UI worker on semantics, not presentation.

### F10, high: an expired permission is still a valid capability to the host

**Current source-level contract mismatch, historical read-model claim confirmed by tests.** `book_world_mol_access.js:27–34` expires a proposed 30-day grant using `mol_access.issuedAt`, with retained competence listed separately. `book_world_mol_host.js:38` gates library/workshop/court moves on the Boolean `book.mol.guestPermit`; the pack's command predicates use that same fact. Neither consumes access status. `book_world_mol_access_domain.js:9–18` records issue time when the permit is first observed and saves it separately. Its load copies term but drops `suspendedAt`, although `accessView` accepts it, so suspension is not a delivered persisted capability either. No runtime suspension producer was found in this bounded scope.

Producer → owner → consumer: Ilsa's permit fact → optional observation-time stamp → expired display; the parallel command owner still reads possession. Reload keeps both authorities rather than reconciling them. Existing `mol_access` tests show expiration and retained skills, not enforcement. This is not an instruction to impose the proposal's 30-day term as canon.

**Owner / next action:** MoL access/command owners choose one scoped permission contract. If expiration is kept, derive grant and command eligibility from it, stamping issuance at grant rather than at later inspection. If the current branch grants indefinite access, stop displaying a lapsed capability as closed. **Done check:** just before/at/after expiry, suspension if implemented, and renewal yield the same access result in preview, commit and reload/import; retained learning remains usable where it does not require that institution's means.

### F5, medium-high: occurrence identity is lost before return grouping

**Reproduced current pure defect.** `return_digest.js:35–47` strips source IDs into `{text,at,when}` and suppresses later groups by text. Probe: one person memory `{id:'one',at:100,text:'The bell rang.'}` and a different around event `{id:'two',at:300,text:'The bell rang.'}`, clock 500, seenAt 0. Output count 1, retaining minute 100 and losing minute 300. Existing digest tests intentionally accept dropping repeated text, so their pass does not cover occurrence distinction.

Producer → projection → grouping: `knownPeopleView` already supplies IDs (for example `people_knowledge.js:15/32/39`), `eventFeed` supplies IDs, then `groupDigest` discards them. This is not proof that a particular world currently produces the collision, but any distinct same-word event is exposed. Missing times on some legacy memories are another coverage limit, not grounds to invent dates.

**Owner / next action:** return-digest adapter, preserving existing event/receipt identity. Group duplicate projections of the same occurrence by identity; optionally fold repeated occurrences with count/times. **Done check:** same text/different occurrence survives, one occurrence from two sources groups once, equal time/different identity stays distinct, mark-read/reload/import does not replay or erase an occurrence. Keep observer-safe upstream projections.

### F13 / RFX4–RFX5, medium: save gaps need narrower claims and distinct lifecycles

**Runtime gap confirmed, policy already settled.** `world_pack_registry.js:24` remains projection-only and `world_pack_save.js` has no caller outside its own family found by a source search. Its seven leaf scenarios passed here, including missing-pack retention and revision chains. Those JSON-section tests are not actual Save/Export/Import integration. `SAVES G2` remains valid for the generic per-pack delta path, but current book worlds already save state under existing owners; it is not a claim that all book gameplay disappears.

**Correction to SAVES G1:** the blanket inference that any unknown item reaches the factory and refuses the whole import is too broad. `main.js:7366–7370` warns and skips an unknown ordinary simple inventory item; component branches similarly warn/skip missing parts. Equipped entries (`main.js:7051/7053`), special owned keys and cross-owner references take other paths. The test cited by G1 deliberately throws an “unknown book or stance” from a preflight stub; it does not prove the real unknown-item route. No real-loader import was exercised here. RFX4 correctly says the drop-and-log default is already authorized; no new choice is owed from Weibao. RFX5 correctly rejects a universal old-save migration promise.

**Lifecycle gap to preserve:** the MoL loop readout (`book_world_mol_access.js:39–43`) is explicitly proposed, includes other worlds “keep running”, and is rendered under “If this life restarts”. AD16 instead pauses inactive worlds by default. No selected per-world exception or corresponding loop executor was established here. This is a proposal/readout discrepancy, not proof of an implemented reset corrupting saves. Structured independent-life archive code has a distinct guarded publication path (`structured_life_runtime.js:37–59`); do not merge death, independent new character, travel and a source-specific loop into one reset.

**Owner / next action:** SAVES for contract wording; actual loader for a selected retired-ID case; pack-save owner when a real pack-delta consumer needs it; world-entry/reset owner for the chosen carry table. **Done check:** synthetic simple/equipped/special IDs are tested separately, malformed/future data still refuses without replacing stored bytes; one real pack delta survives literal import if wired; a selected crossing/reset preserves the declared memory, cargo, debts, work and world-clock categories without reward replay. Do not create a universal pack rewrite or migrate every historical save.

### F11 / F14, medium: material depth and target dials are uneven, not absent

**Making has working finite adapters; general staged making is not implied.** `cast_making_adapter.js:78–99` resolves a recipe/product at definition time, spends fitted inputs on a timed command, checks support again, and refunds cancellation/completion failure. Lines 125–130 reject conflicting physical bindings and intermediate output reuse without an explicit adapter. This supports authored known batches, not arbitrary player-selected substitutes or irreversible mid-process work. Four current adapter checks emitted pass here, covering custody-like reservation, catalysts, no free product, refund and actual output use; the test process did not exit, so no completed suite claim is made.

**Historical counterexample to “substitution is unimplemented”:** `CRAFTING_ENGINE.md:1506` and the G2 [integration receipt](../pc-groups-2026-10-26/ingredient-substitution/implementation/INTEGRATION.md#final-connected-delivery-2026-10-26) record a selected ORIGINAL HP reference/alternative/blend route, useful treatment reader, joint rollback and persistence on its recorded bundle. This audit did not replay it. Ingredient quality-to-hazard remains a proposed selected-reader connection (PC61–PC63), not a missing universal quality axis. Partial failure, arbitrary chemistry and spatial formations stay bounded by their existing owners.

**Balance correction:** F14/WDI44 accurately notes that `rule_modules.js:103–109` computes one parameter value without a target filter, but admission at line 51 accepts only `RULE_TARGET='oral.restore_availability'` (line 12). A second target is currently rejected. There is no demonstrated current cross-target bleed; it is a prerequisite when deliberately generalizing admission. `damage_types.js:64–69` does derive fallback protection from item ID/external-component name, so material/price mismatch is a real current risk; no price-per-protection play case was measured. Explicit declarations take precedence.

**Owner / next action:** selected making consumer and material/process owners, with BALANCE as index. Extend one actual recipe or protection reader, preserving exact stock/properties/custody; add target separation when a second target is admitted. **Done check:** material-grade or substitution change reaches the named hazard/output/use and actual fight/price where relevant; preview spends nothing, interruption accounts for committed matter; two targets coexist without cross-effects; per-world felt comparisons are recorded as reversible proposed tuning. No equal-difficulty or anti-exploit requirement follows.

## Reconciled routing versus runtime follow-through

| Area | Current disposition |
|---|---|
| SAVES and rules router | Owner/index exist; RFX4/G1 and RFX5/G8 wording remains stale as above. Existing policy is clear. Runtime pack-delta wiring is a separate conditional gap. `fork_schema` 2 validation versus writer 1 remains the documented direct-validator question, not re-probed here. |
| BALANCE | Useful dial index, not a tuning or acceptance gate. “Untracked” damage-types wording is historical, since the file is tracked at this HEAD. RFX6's final approval wording should allow reversible agent prototype defaults; no new permission needed. |
| Consolidated runes | Merge is present: the three donor files are stubs pointing to `WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md` round 4 and alias table. This is documentation consolidation, not implementation of every rune idea. The front door's old donor link/in-progress claim was confirmed; coordinator owns and reports the single-row correction, so it is not an unassigned runtime gap. |
| Making path rules | `.claude/rules/making-systems.md:2–7` matches craft/workshop/alloy/invention and MAKING_RULES, but not `src/rune_grammar.js`, `src/dose_process.js`, `src/mixture*.js` or potion/brewing files by those names. AGENTS globally routes all making to MR, so this is automatic-discovery coverage, not absence of an applicable rule. Next scoped instruction upkeep can add meaningful patterns; do not blanket-load the whole palette. |
| RFX1–RFX3 / RFX8 | UIV5 is an existing proposed check, RPT13/RPT14 standing versus player-ui's abbreviated range is a routing issue, and no mandatory taste sign-off follows. UI semantics/test coverage belong to the UI auditor. DESIGN's front-door landing status was already corrected before this lane. |
| Systems front door | Index rows are snapshots and owner pointers, not a replacement runtime register. S12 code map and SAVES contract are complementary. Rune correction is documentation routing; missing inspectors/code maps are not evidence of missing gameplay. |

## Important limits and resolved historical findings

- **F8/F9:** current tempo tests pass mid-fight JSON reload, held-time retention/settlement, one worst witness per pair, withdrawal aftermath and per-move vitals. The older per-strike-memory report is superseded by the default aggregation plus per-world dial. This does not prove witness identity/line-of-sight, the real calendar travel/appointment chain, or literal browser import.
- **F8:** the floor ledger lines 186–190 says the wait stall was fixed but death/restart and a plan-free rail-halt route remained unproven. No current rebuilt reproduction in this lane, so neither revive the fixed stall nor call the death bug resolved. Select that journey when implementing that slice.
- **F10:** Owed already routes repayment to Standing; `owed_ledger_view.js:137–141` uses the current owed projection and caps to available coins, `economy_standing_domain.js:36–43` calls its actual loan owner, and `economy_standing.js:129–135/160–173` accrues/rebases interest. No proved double-charge, missing interest engine or universal two-job conflict is asserted. Accrued-interest browser settlement remains an appropriate selected scenario, not a replacement ledger project.
- **F12:** rankless and multi-axis progression is accepted AD46; card proof/read-model state does not close live-world integration. No single ladder model is authorized for all worlds. This lane did not evaluate the UI forms.

## Checks and input identity

- Completed: `node --test --test-force-exit --test-concurrency=4 tests/return_digest.test.js tests/person_memory_effects.test.js tests/tempo_fight.test.js tests/mol_access.test.js tests/rule_modules.test.js tests/save_compatibility.test.js tests/world_pack_save.test.js`: **58 pass, 0 fail**, 1.13 s. These check pure current source behavior.
- `cast_making_adapter.test.js`: four assertions groups emitted pass, then process stayed open. Initial serial eight-file runner was stopped by its recorded PIDs after waiting; a single-file force-exit retry likewise stayed open and was stopped by PID. No failure of an assertion was observed, no full completed pass claimed, and no further retries. No persistent test outputs created.
- Two `node --input-type=module` synthetic probes: absent-asker memory and distinct same-text digest, results recorded above. No source state mutated outside those processes.
- Nonmutating git/source searches; initial and final tracked status preserved unrelated changes. Existing dirty inputs used: refinement report (untracked), reconciliation audit, systems front door, lead-life systems design and other sessions' records. No dist evidence was treated as a current bundle proof.
- No full suite, build, architecture/rules modification checks, user-save access, browser or packaged-app verification in this lane. Final receipt link/whitespace checks are recorded by the coordinator if integrated.

Relevant runtime/owner input SHA-256 prefixes (16 hex; identify this source snapshot, not an installed bundle):

```text
ca89eefec508b1dd src/return_digest.js
866ba8839d3fb962 src/person_memory_effects.js
2f6a442b390f06f6 src/person_silence.js
894a7ad757222b10 src/promise_ui.js
73b0aed9b7c98cb0 src/expansion_persistence.js
8f29d11fedb15320 src/book_world_mol_access.js
f94da1d87b8674d2 src/book_world_mol_access_domain.js
b9672085bbf3ff8c src/book_world_mol_host.js
02d091cfe9d239ea src/tempo_fight.js
8d721aaca73610e7 src/tempo_fight_domain.js
2cd36da5b1046f4b src/tempo_fight_contract.js
0c2beac7660c015a src/clock_owner.js
bab9a3bb0d3f08eb src/harm_state.js
e29a2bcf2d171f20 src/main.js
b2eb6581581151e4 src/cast_making_adapter.js
281be37b5800537f src/rule_modules.js
16966027fe30a595 src/damage_types.js
70d1ef3f7e8fbc25 src/save_files.js
e2d64e2f49dc6e1f src/world_pack_registry.js
2477ed2e7a95569b docs/SAVES.md
62a7807e62aa2467 docs/BALANCE.md
37bd5cdc4cd05f40 docs/CRAFTING_ENGINE.md
167c2b7ceaa9e762 docs/RULES_INDEX.md
38103cbd243bbb91 .claude/rules/making-systems.md
```

Practical order proposed: repair observer/provenance and native fight publication in the selected connected life, reconcile that world's permission lifetime, then occurrence identity. Pack deltas, staged making, quality/hazard and a second dial target reopen with their actual consumer. These are priorities for review, not implementation authorization or new universal gates.
