# Cross-world foundations run (2026-11-06)

```receipt
build: 53a2a0ab9c4ce41e109adb593d06b54517c1819710a598c21fed27ebff62a80f
route: fixture(kj3z ckpt-range with B8 proof acts)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: npm test 5248/5248; tempo*, tempo_host, perspective_controls 48/48; seam_register 6/6; check:arch pass; check:rules pass
review: none
```

Weibao, 2026-11-06: "lets work on these to completion" (the round 3 implementation order in [LARGER_FOUNDATIONS](../../../audits/LARGER_FOUNDATIONS_2026-11-06.md#implementation-order-proposal), after the [reconciliation](../../../audits/LARGER_FOUNDATIONS_2026-11-06.md#reconciliation-2026-11-06)). Reading: this authorizes implementing the eight slices in order; AR17 stays a proposed rule text until he accepts it, but slice 1 implements its mechanism. Playbook: [foundation run](../../FOUNDATION_RUN_PLAYBOOK.md). Coordinator: this chat (Claude, primary checkout), sole committer and builder.

## Wave 1

| Lane | Slice | Owner files | Why foundational |
|---|---|---|---|
| W1-A | 1, world-neutral hosts (AR17): tempo and the other world-neutral domains take the world-neutral write port; a shared-panel slot in the LOTM view first filled by the open tempo fight and its openers | `src/native_tool_domains.js`, `src/tempo_fight_domain.js`, `src/book_world_lotm_ui.js`, `tests/perspective_controls.test.js` (registration only), `tests/tempo_host.test.js` (new) | Every shared seam is invisible outside Frontier until a world panel can show it; closes AT15 T1, T2 |
| W1-B | 2, seam adoption register | `scripts/seam_register.mjs` (new), `docs/SEAM_REGISTER.md` (new), `tests/seam_register.test.js` (new) | Makes AR11 checkable before more seams land |
| W1-C | Read-only scoping for wave 2: positions@1 projection consumers, Harry's lead-life calendar (HG1) owners and window state | none (returns text) | Wave 2 briefs need exact files |

Rejected for wave 1: slice 3 code (needs a consumer surface that W1-A owns this wave); slice 4 (HP lead window state unknown, W1-C scopes it); slices 5-8 (depend on 1-4); installed-app adoption (AT7, its own task).

## More to consider (dispositions)

- ACT NOW: the LOTM slot must use a neutral data attribute for the shared layer (perspective_controls trap); an untouched life writes no new save key.
- ACCOUNT FOR NOW: the five world-neutral domains lane H named must each be checked for their own world literals before their port changes; any with Frontier-only purpose stays as is and is listed. The road duel keeps its own eligibility through its quote, so Frontier behaviour is unchanged.
- LATER: HP view slot (after slice 4 gives Harry something to show); register hook into `check:rules` once its output is stable.

## Wave 2 scoping (W1-C, read-only, haiku)

- Harry lead life: `src/world_packs/book_hp_lead_life.js`, `book_hp_lead_life_data.js`, `src/book_world_hp_lead_domain.js`, `_pack.js`, `_ui.js`; private packs `hp-lead`, `-w2`, `-w3`, `-w4`. W1-W4 done (agent-verified), W5-W10 proposed (HP plan lines 33-44); endpoint W4 Diagon Alley and the wand shop; W5 (platform, train) waits on G5 school calendar. Lead clock: `calendarProfile` fixed_months, twelve 30-day months (`book_hp_lead_life_data.js:46-49`), no school year.
- Original HP school life: one 70-day term, weekday charms and plants as prose (`book_hp_life_data.js:23,29`); lessons keyed by window flags `hp.school.<window>` (`:35`), not dates; calendar label "Hogwarts term" (`:145-149`).
- Duties: `registerDutySet('lotm',{defs, state, active, minute})` at `src/book_world_lotm_domain.js:38`; defs in `book_world_lotm_duties.js:5-12` (`{id, schedule:{period, opens, closes}, debtor, creditor, source, why}`); save key `duties` owned by `src/duties_domain.js`.
- Positions inputs: LOTM profiles `src/book_world_lotm_lives.js:22-30` (civil `contract:{weeklyPence, termYears:5, secrecy, allowancePence}` at `:30`; `sign_contract` `:77-79`; weekly pay `:81-82`, resource `book.lotm.weeks_paid`); Village career top-level save key `village_career` (`src/village_career.js:11-12,59-61`, state rank 0-2, shifts, loan, debt), not domain-registered. No "your position" line exists in the LOTM panel.
- Wave 2 candidates: W2-A positions@1 read-only projection (`src/positions.js`, sources from LOTM lives and Village career) with its first consumer a "Positions" line in the LOTM panel (after W1-A releases `book_world_lotm_ui.js`); W2-B HP school calendar G5 for the lead life plus one HP duty set (a class slot) through `registerDutySet('hp', ...)` as the second world for FD8.

## Wave 1 receipts

| Lane | Files | Checks | Not covered | State |
|---|---|---|---|---|
| W1-A hosts | `src/native_tool_domains.js` (`neutralWritable`; tempo, away bank, return digest, personal journal take it), `src/tempo_fight_domain.js` (`placePanel` into `[data-shared-slot="encounter"]`, old placement kept elsewhere), `src/book_world_lotm_ui.js` (persistent slot after the meters), `tests/tempo_host.test.js` | 48/48 focused; check:arch pass, no new edge | Pledges not switched (its `blocked` port carries the Frontier clause; needs the blocked split first); other lane H items not checked. While slotted the panel drops its id so the notebook cannot reclaim it; `scripts/rival_memory_browser.mjs` and `scripts/combat_surface_browser.mjs` select `#tempo_fight_panel`, so they find it outside the LOTM view and miss it inside | Agent-verified natively (walk below) |
| W1-B register | `scripts/seam_register.mjs`, `docs/SEAM_REGISTER.md`, `tests/seam_register.test.js` | 6/6; `--check` current | Counts direct imports; one-hop, dynamic and registry use are not counted; not wired into `check:rules`; classifies `tempo_fight_domain` under village although it is now world-neutral | Tool and doc, no gameplay |
| Coordinator | `src/book_world_lotm_fight.js` (proof foe is now an ordinary street robber at close range), `scripts/lotm_slice/at15-fight-proof.mjs` (slot and Fight card selectors) | tempo_stock 6/6 | | |

Native walk (headless Chrome, 1920x1080, rebuilt bundle `53a2a0ab...`, fixture route kj3z `ckpt-range`):

| Item | What the player saw | Result |
|---|---|---|
| Arm | "Hire a revolver" then "Load six": carried/loaded 20/0, then 14/6 | Pass |
| Opener | Slot panel "A fight · tempo", button "Face a street robber (proof fight)" with "6 loaded, 14 carried." | Pass (T1, T2 closed) |
| Fight | Fight card in the LOTM view with Fire and Reload beside the melee moves; two shots, "won" | Pass |
| Write-back | loaded 6 to 4, carried 14 unchanged, once at the end | Pass |
| Kept | fresh-session reload 14/4; Export/Import 14/4; 0 page errors | Pass |

Earlier walk on bundle `983e9b31...` with the Sequence 8 corpse-handler at short range: 20 shots at about 10% each (aim 0, short range, foe speed band +1), no hit, then 35 melee strikes with no result; fight still open after the click budget. Kept as findings, not as a pass.

## Findings (AT codes continue)

| ID | Finding | Evidence | Next |
|---|---|---|---|
| AT21 | Tempo melee can stalemate: a clerk-strength player and a weak foe traded 35 strikes with no change (player 60/60) | Walk on `983e9b31...` | Calibrate tempo for weak fighters (minimum harm per hit, fatigue, or the foe's yield/leave) before more book-world fights |
| AT22 | After a fight ends in the LOTM view, the centre panel shows the Notebook view instead of the place | Screenshot `03-after` | Return the LOTM view to Here on fight end |
| AT23 | The away bank now writes in any world through the neutral port and spends time through the native clock | W1-A port decision | Check banked-time spending in a LOTM life before calling it world-neutral in play |

## Resume block (unattended run, 2026-11-06)

Weibao, 2026-11-06: "lets work on these to completion".
- Objective: slices 1-8 of the round 3 order each at the AD43 floor or recorded below it with the blocker named; atlas rows refreshed.
- Input identity: master at `b9d020380`; dirty but not ours: `styles/ui_extras.css`, `src/home_domain.js`, `src/main.js`, `src/domain_registry.js`, `src/world_completion_materials_*.js`, `tests/domain_registry.test.js`, `scripts/tauri/*`, untracked `desktop-tauri/`, `scripts/perf/*`, `src/typed_confirm.js`, `tests/typed_confirm.test.js`.
- Steps: wave 1 done (slices 1 and 2; AT15 at floor on a fixture route); wave 2 next (W2-A positions projection plus its LOTM panel line, W2-B HP school calendar and a class duty set).
- Last evidence: AT15 step 1 `8788923e5`; reconciliation `b9d020380`.
- Failed approaches: `b8-range-proof.mjs` (stale task-link click, T3); tempo panel via Frontier `harvestWritable` (T1).
- Next useful action: wave 2 dispatched 2026-11-06 (W2-A positions projection: `src/positions.js`, `src/book_world_lotm_positions.js`, one import in `book_world_lotm_actions.js`, one line in `book_world_lotm_ui.js`, `tests/positions.test.js`; W2-B HP school calendar and class duty: `src/book_world_hp_school_calendar.js`, `src/book_world_hp_duties.js`, `src/book_world_hp_lead_domain.js`, `tests/hp_school_calendar.test.js`). On return: check at locators, run focused tests, build, npm test, check:arch, check:rules, doc slips, then a native walk (LOTM positions line after sign_contract; HP Now line in a W4 save), commit. Then wave 3: slices 5-6 (inquiry@1 with notes as objects; livelihood stage record with rights and dues in a second world). AT21-AT23 open.
- Usage read 2026-11-06 ~23:00: 5-hour 12%, weekly 61%.
- Pacing: continue while weekly all-models is under 75% and the 5-hour window under 85%; at 85% on the 5-hour window wake after its reset; at 75% weekly stop and wait for Weibao. Read 2026-11-06 ~22:30: 5-hour 2%, weekly 60%.
- Stop condition: all eight slices recorded, or weekly at 75%, or a blocker only Weibao can clear.
- Resume prompt: "Continue the cross-world foundations run in docs/gm/dispatch/cross-world-run-2026-11-06/CHECKPOINT.md: read the resume block, check live files and running workers, then do its next useful action under the pacing rule."
