# Cross-world foundations run (2026-11-06)

```receipt
build: b213f540cbbabed76274ac49ad2154320eabaadba25d85afcff528cbd5e311b9
route: fixture(kj3z ckpt-range with B8 proof acts)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: npm test 5256/5256 (wave 2); wave 1 5248/5248; focused positions 4/4, hp_school_calendar 7/7; check:arch pass; check:rules pass
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
| AT21 (closed in wave 4, dial `stallActions`) | Tempo melee can stalemate: a clerk-strength player and a weak foe traded 35 strikes with no change (player 60/60) | Walk on `983e9b31...` | Calibrate tempo for weak fighters (minimum harm per hit, fatigue, or the foe's yield/leave) before more book-world fights |
| AT22 | After a fight ends in the LOTM view, the centre panel shows the Notebook view instead of the place | Screenshot `03-after` | Closed in wave 4: the notebook's auto-open had opened its centre view; the tempo host now closes that view (and restores the journal and workroom tabs) when the fight ends |
| AT26 (closed in wave 5) | Klein's Reports digest lists a Frontier village weather line ("A short shower reaches the Village workbench") | Screenshot `03-after`, bundle `0539216b...` | Filter world-day events by the player's world in the digest |
| AT23 | The away bank now writes in any world through the neutral port and spends time through the native clock | W1-A port decision | Check banked-time spending in a LOTM life before calling it world-neutral in play |

## Wave 2 receipts

| Lane | Files | Checks | Not covered | State |
|---|---|---|---|---|
| W2-A positions | `src/positions.js` (world-neutral registry, `positionsOf`), `src/book_world_lotm_positions.js` (civil-staff contract row after `sign_contract`; probationer row as `enrolled`, an authored mapping), one import in `src/book_world_lotm_actions.js`, one line in `src/book_world_lotm_ui.js` (Path tab), `tests/positions.test.js` | 4/4 plus 23/23 neighbours; check:arch pass; state JSON identical before and after (no save key) | Village career source (LATER: top-level save key outside the registry); term end date; exit kinds; the UI reads rows through a view adapter until the host view carries `positions` | Agent-verified natively |
| W2-B HP calendar and class duty | `src/book_world_hp_school_calendar.js` (1 September stated; holidays and term end authored proposals), `src/book_world_hp_duties.js` (`hp.lead.class_slot`, active once `hp.lead.atSchool` is set and the date is in term), `src/book_world_hp_lead_domain.js` (local clock `note`; `registerDutySet('hp', ...)`), `tests/hp_school_calendar.test.js` | 7/7 with the digest test; duties tests pass | Class duty is fixture-only until W5 sets `hp.lead.atSchool`; gap weeks of an inactive set count as misses (fix before W5) | Countdown agent-verified natively; duty fixture-only |
| Coordinator fix | `src/today_strip.js` (local clock `note` passed through `todayDigestView`), `src/reports_dock.js` (appends the note to the Now line) | 7/7; reports_dock tests pass | | |

Native walks (headless, game MCP, frozen instrumented bundles):

| Item | What the player saw | Result |
|---|---|---|
| Civil staff before signing | Path tab: "Civil staff" with no positions line | Pass |
| After signing | "Civil staff, Nighthawks: contract, 3 pounds a week, five years" | Pass |
| Kept | Same line after save, reload, Export and Import (day 1 08:00, workroom, 1200 pence) | Pass |
| Probationer | "Probationer, Nighthawks" | Pass (no persistence run) |
| Harry countdown (first walk) | Not shown: Reports' Now line dropped the clock `date` field | Fail, fixed by the `note` field |
| Harry countdown (re-walk, bundle `b213f540...`) | "Sat, day 1 09:01 at Your room under the stairs · Term starts in 32 days (1 September)."; a day later 31; same after save, reload, Export and Import; 0 page errors | Pass |

Findings: AT24 the civil-staff life shows Nighthawk probationer rows in Work & merit; AT25 the Reports Now line stayed stale after a 1440-minute step until the log was cleared or the page reloaded (the dock refreshes on a 1-second timer; not isolated as headless or real); the Reports card also hides once the log passes 8 lines (`LOG_TAKES_OVER`), by design.

## Wave 3 and 4 receipts

| Lane | Files | Checks | Not covered | State |
|---|---|---|---|---|
| W3-B rent as a duty | `src/recurring_duties.js`, `src/duties_domain.js` (policy, late, `setOrder`, purse port), `src/book_world_lotm_duties.js` (`lotm_rent`, 5 soli a week, authored dial 2-10), `src/book_world_lotm_domain.js`, `src/book_world_lotm_host.js` (`purseBalance`, `payDues`), `src/book_world_lotm_ui.js` (`data-duty-policy` select), `src/owed_ledger_sources.js` (duty rows, AT10), `tests/rent_duty.test.js` | 11/11; LOTM 360/360 | Paying from the purse is fixture-only (Klein's start has 1 penny); no pay-now button; OB6 weekly line | browser-verified for the line, policy, notice, landlady and persistence |
| W3-A inquiry | `src/inquiry.js` (`inquiry@1`), `src/inquiry_study.js`, `src/research_home.js` (lever write-up), `src/native_tool_domains.js`, `tests/inquiry.test.js`, `docs/SAVES.md` 6f | 14/14 | The lever write-up was not reached natively (the old craftsman needs the rat and cave chain; the MCP has no availability patch); LOTM consumer LATER | implemented, below floor (fixture-only) |
| W4-A tempo findings | `src/tempo_fight.js` (`TEMPO_DIALS.stallActions` 30, counter `lull` kept in the saved fight), `src/tempo_fight_domain.js` (tab and centre-view restore), `tests/tempo_stalemate.test.js` | tempo* 52/52, the 47 older tests unchanged | `lull` is not in the contract validator (old fights read 0); a fight restored from a save does not restore the prior view | AT22 browser-verified; AT21 fixture-only (no natural stalemate route) |
| W4-B channels | `src/channels.js`, `src/channel_map.js` (16 channels; 12 LOTM rows, 19 native skills), `src/display.js` (skill tooltip line, shown to the holder), `src/structured_ability_runtime.js` (export), `tests/channels.test.js` | 7/7; 167 across related files | No channel line on LOTM ability rows or fight logs; no channel contests; other worlds untagged | see walk |
| W4-C consequences and society sheets | `src/consequences.js` (`owed.due` rule, derived each read, no save key), `src/event_feed.js` (adapter, 3 lines), `src/world_society_sheet.js`, `scripts/world_society_sheet_report.mjs` (renamed from `society_*` per Lane A M15), `tests/consequences.test.js`, `tests/world_society_sheet.test.js` | 24/24 with feed and digest tests | One rule; forms of address missing in both worlds; population, daily life and belief fields left out | owed lines seen natively in Reports (bundle `0539216b...`) |

Gates on the folded tree: `npm test` 5281/5281 (bundle `4d70732a...`, before the AT22 follow-up; tempo* 52/52 after it); `check:arch` pass; `check:rules` pass. Native: the AT15 runner on bundle `0539216b...` won in 2 shots, rounds 6 to 4 kept across reload and Export/Import, and the place view returned after the fight; Reports listed "Captain Dunn's office is still waiting on your expense application for the week." and "Your landlady stops you on the stair: this week's rent is due." W3 walk (live bundle `f4a0ec5b...`, freeze then failing on the removed `desktop/`, fixed at HEAD `4b4465412`): rent line and policy select shown; first miss "A note is pushed under your door: the rent is behind."; second "Your landlady knocks and says she cannot carry another week without the money."; day 15, 1 penny and both miss counts kept after save, reload, Export and Import.

## Wave 5 receipts

| Lane | Files | Checks | Not covered | State |
|---|---|---|---|---|
| W5-A groups, read side (lane F step 1) | `src/organizations.js` (`registerGroupSource`, `groupsOf`, `groupLines`, 12 kind palette rows labelled authored, palette or missing), `src/management/group_source.js` (Frontier courtyard), `src/book_world_lotm_organizations.js` (church team, hidden gathering by seat id), `src/management/ui.js` ("Groups here" line), one import in `src/book_world_lotm_actions.js`, `tests/organizations.test.js` | 6/6; with gatherings, positions and organization_view 12/12 and 15/15 | No LOTM view draws groups yet; no founding route, treasury, offices or law status; courtyard line not walked | implemented, below floor |
| W5-B findings | AT24: merit block and commands gated on `lotm.beyonderTrack` (`src/book_world_lotm_host.js`, `src/book_world_lotm_merit.js`); AT26: `src/event_feed.js` skips occurrences whose definition pins another world; duty gaps: `skipInactive` in `src/recurring_duties.js`, `skipIdle` in `src/duties_domain.js`; tests `at24_positions_rows`, `digest_world_filter`, `duty_gaps` | 63/63 and 89/89 neighbouring | A duty set whose clock cannot be read while inactive still charges the gap; unpinned Frontier definitions would still show elsewhere; AT24 not walked in a civil-staff life | AT26 browser-verified; AT24 and gaps fixture |

Gates: build `7d3952bd70849c40ccccc6b88b6a8c6f22bb371ff60d439b8b72ca79db443ac0`; `npm test` 5297/5297; `check:arch` pass; `check:rules` pass. Native (AT15 runner on that bundle): fight won in 2 shots and kept across reload and Export/Import; Klein's digest lists the Dunn and landlady lines and no Frontier weather line.

## Resume block (unattended run, 2026-11-06)

Weibao, 2026-11-06: "lets work on these to completion".
- Objective: slices 1-8 of the round 3 order each at the AD43 floor or recorded below it with the blocker named; atlas rows refreshed.
- Input identity: master at `b9d020380`; dirty but not ours: `styles/ui_extras.css`, `src/home_domain.js`, `src/main.js`, `src/domain_registry.js`, `src/world_completion_materials_*.js`, `tests/domain_registry.test.js`, `scripts/tauri/*`, untracked `desktop-tauri/`, `scripts/perf/*`, `src/typed_confirm.js`, `tests/typed_confirm.test.js`.
- Steps: wave 1 done (slices 1 and 2; AT15 at floor on a fixture route); wave 2 done (positions projection with its LOTM line; Harry's school calendar countdown; HP class duty fixture-only); wave 3 next. Previously wave 2 next (W2-A positions projection plus its LOTM panel line, W2-B HP school calendar and a class duty set).
- Last evidence: AT15 step 1 `8788923e5`; reconciliation `b9d020380`.
- Failed approaches: `b8-range-proof.mjs` (stale task-link click, T3); tempo panel via Frontier `harvestWritable` (T1).
- Next useful action: wave 3 dispatched 2026-11-06 ~23:20 (W3-A inquiry seam: `src/inquiry.js`, `tests/inquiry.test.js`, up to three consumer files it names (Frontier Study first if no book-life consumer is reachable); W3-B Tingen rent as a duty with a standing-order policy, escalation notice and visit, owed-ledger duty rows (AT10): `src/recurring_duties.js`, `src/duties_domain.js`, `src/book_world_lotm_duties.js`, `src/owed_ledger_sources.js`, `src/book_world_lotm_ui.js`, `tests/rent_duty.test.js`). On return: check at locators, focused tests, build, npm test, check:arch, check:rules, doc slips, native walk (rent line and policy in a LOTM life over several weeks with save/reload/export-import; the inquiry consumer), commit only this run's hunks (another session commits in the same files; stage by hunk or HEAD+mine blob). Then slices 7-8 (skill and ability channels; FD16 event layers and FD14 society sheet) and the open findings AT21-AT25 plus the duty gap-week fix before W5.
- W3-B returned (uncommitted): rent 5 soli a week (authored, dial 2-10 soli, no source rent) as duty set `lotm_rent` for Klein's own life; policy pay_on_time/pay_late/skip saved in `duties@1` (`policy`, `late`, migrated, omitted when empty); notice after one miss, landlady line after two; settles on the clock as one debit through `book_world_lotm_host.js` (`purseBalance`, `payDues`; outside its list, accepted); owed ledger lists duty rows (AT10); select `data-duty-policy` in the LOTM panel; 41/41 focused, 360/360 LOTM, check:arch pass. Not covered: real purse debit and select in a browser, OB6 weekly line, pay-now button. Files: src/recurring_duties.js, src/duties_domain.js, src/book_world_lotm_duties.js, src/book_world_lotm_domain.js, src/book_world_lotm_host.js, src/book_world_lotm_ui.js, src/owed_ledger_sources.js, tests/rent_duty.test.js. W3-A returned (uncommitted): `src/inquiry.js` (world-neutral, domain `inquiry`, new optional top-level save key `inquiry@1`, loads fresh when absent or foreign, writes output facts once into `simulation.knowledge`), `src/inquiry_study.js` (Study adapter), edits `src/research_home.js` ("Write up what I have found" on the Frontier lever project) and `src/native_tool_domains.js` (registration), `tests/inquiry.test.js`; 14/14 focused; LOTM consumer LATER (needs private chain content). Coordinator owes a SAVES.md section 3 row and section 6 note for `inquiry@1`. Next: build, npm test, walk (rent over weeks in a LOTM life; lever write-up in Frontier), commit.
- Wave 4 dispatched 2026-11-06 while the W3 walk runs (disjoint from W3 files): W4-A AT21 stalemate and AT22 post-fight view (`src/tempo_fight.js`, `src/tempo_fight_domain.js`, `tests/tempo_stalemate.test.js`); W4-B slice 7 channels (`src/channels.js`, `src/channel_map.js`, one consumer file, `tests/channels.test.js`); W4-C slice 8 consequence layer and society sheets (`src/consequences.js`, society sheet data, `scripts/society_sheet_report.mjs`, `tests/consequences.test.js`, `tests/society_sheet.test.js`). Fold W3 first (walk, receipt, gates, commit by pathspec), then W4.
- Waves 3-4 committed as `1eeb94f22` (29 paths). Usage at fold: 5-hour 40%, weekly 65%. Wave 5 dispatched: W5-A lane F step 1 group read-side projection (`src/organizations.js`, per-world sources, one consumer such as `organization_view.js`, `tests/organizations.test.js`; no save key); W5-B findings AT24, AT26 and duty gap weeks (`src/recurring_duties.js`, `src/book_world_lotm_positions.js`, digest/world-day producer, three new tests). W4 walk (skill tooltip, owed line in Events, ledger) still out. Next: fold W5, build, gates, walk, commit; stop at 75% weekly.
- Usage read ~23:15: 5-hour 22%, weekly 62%; coordinator context 89% (compaction near; this block is the handoff).
- Usage read 2026-11-06 ~23:00: 5-hour 12%, weekly 61%.
- Pacing: continue while weekly all-models is under 75% and the 5-hour window under 85%; at 85% on the 5-hour window wake after its reset; at 75% weekly stop and wait for Weibao. Read 2026-11-06 ~22:30: 5-hour 2%, weekly 60%.
- Stop condition: all eight slices recorded, or weekly at 75%, or a blocker only Weibao can clear.
- Resume prompt: "Continue the cross-world foundations run in docs/gm/dispatch/cross-world-run-2026-11-06/CHECKPOINT.md: read the resume block, check live files and running workers, then do its next useful action under the pacing rule."
