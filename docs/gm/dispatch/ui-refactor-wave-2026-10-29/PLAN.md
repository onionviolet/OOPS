# UI refactor wave, 2026-10-29

Weibao: "save the stuff for future accordingly, refactor now? more to consider? Work in parallel using sonnet agents?" ([direction](../../../USER_VISION.md#ui-refactors-now-in-parallel-sonnet-lanes-2026-10-29)). Coordinator: this session ("UI overhauls"). Source of the items: [UI audit](../../../audits/UI_DESIGN_CORE_AUDIT.md) rounds 8-12 (MDL, LTU, RPX, RIX codes). Everything not listed as a lane stays in those rounds' LATER tables.

## Lanes (Claude sonnet subagents, one worktree each)

| Lane | Code | Owns | Done check |
| --- | --- | --- | --- |
| R1 Seat seam | MDL9, MDL4, LTU11 | `src/seat_profiles.js`, new `src/observer_view.js`, new tests | One read point for "what this seat may see"; a test fails on a direct lead-identity read in UI modules; existing seat tests pass |
| R2 Scene card | MDL3, MDL11, SUI1-SUI13 | new `src/ui/scene_card.js`, `styles/scene_card.css`, one existing scene converted outside the frozen files | Two scene kinds render from data through slots; text form intact; focused tests |
| R3 Figure and gallery | MDL2, MDL7, MDL8, MDL13, RPX1, RPX11 | new `src/ui/figure.js`, `styles/figure.css`, new `figure-gallery.html` and `src/ui/preview/figure_gallery.js` | Ritual circle and relationship web render from specs with no kind-specific drawing; text form; effects off keeps facts; 1920×1080 capture |
| R4 Rules in one place | RIX1, RIX2 | rule-book hunks, stubs, `scripts/check_rules_index.mjs` | Codes and wording unchanged; `check:rules` warns on unrouted or dispatch-owned sets and passes |
| R5 Adoption routine | MDL16, MDL15 | new `scripts/adopt_candidate.mjs`, a runbook section, a load-time measurement | One command builds a candidate from a commit, runs the frozen check on a profile copy and stops before the swap; first-load numbers recorded |

Deferred: MDL10 mount on first open waits for the UI freeze fix that currently owns `src/workspace_layout.js`, `src/panel_reveal.js` and `src/village_workspace.js`.

## Constraints every lane carries

- Frozen files (another session's uncommitted work): `src/book_world_lotm_{cast_host,host,state}.js`, `src/workspace_layout.js`, `src/panel_reveal.js`, `src/village_workspace.js`, `tests/cast_*`, `tests/facts_frame.test.js`, `tests/place_acts.test.js`, `src/person_memory_*`. Do not edit them.
- Structural rounds change no gameplay and no save shape (AD45, FND3); name the change surface (FND2).
- Lanes run their focused tests (AD36 lean-test default); no `dist/` build; no commits. The coordinator reviews diffs, runs the full suite once on a clean tree, and commits each lane's own paths.
- No windows on Weibao's screen by default: hidden Electron or headless runs.
- Proposed rules (UR76-UR82) may guide design, cited as proposed.

## Budget

Shared weekly pool with the proposed [sonnet wave](../sonnet-wave-2026-10-30/PLAN.md) (not launched). At most 3 lanes at once from this wave. Stop launching at weekly 60%.

| Time | Event | Weekly | 5-hour |
| --- | --- | --- | --- |
| 10-29 23:05 | Plan written; R1-R3 launching | 38% | 33% |
| 10-30 00:05 | R1-R5 returned and integrated on `80e5b3c97`: full npm test 4111/4116 (the 3 failures also fail on bare master: lane patch file and private roots), check:arch and check:rules PASS (5 warnings from R4's new check) | 39% | 41% |

Results: R1 seat seam `src/observer_view.js` (4 sites migrated, ratchet tests); R2 `src/ui/scene_card.js` drawing the Village encounter cards; R3 `src/ui/figure.js` with the figure gallery (`npm run build:figures`, evidence PNGs here); R4 SUI, RPT, CLR and CX moved to standing rulebooks with stubs; R5 `scripts/adopt_candidate.mjs` (first load: PLAY screen about 2.3 s, workspace 0.14 s after PLAY, bundle 7.8 MB, about 8,900 DOM nodes). Browser floor for R2 in the live game is still owed.

## Representation sessions (Opus, one worktree each)

Started 2026-10-30 00:2x from `a742581ac`: relationship web, family tree, abilities, combat, rituals and making, maps, time and chronicle, knowledge, body and conditions, economy and institutions, worlds and crossings. Started 01:2x: character sheet and inspection. Round 2 brief: [ROUND2_BRIEF](ROUND2_BRIEF.md), sent at 01:30.

Staggered queue (Weibao: "stagger them"), one started as a running session finishes: crafting and workshops; potion mixing and alchemy; items and inventory; talk and dialogue; homes and base building; gathering, nature and seasons; quests, goals and the first hour; companions and party. Each gets the round 1 brief shape plus round 2.

| Time | Event | Weekly | 5-hour |
| --- | --- | --- | --- |
| 10-30 01:24 | Eleven running; character sheet started | 45% | 84% (resets 01:29) |

## Open defect routed out (2026-10-30 01:3x)

MT-F1 from the maps session: on master `4a83cac9a`, every `book.lotm.walk_*` command in a fresh Tingen probationer life is refused with "Knowledge needs its actual situation context.", thrown at `src/causal_situations.js:57` (`validateKnowledgeBasis`) from `move()` in `src/book_world_lotm_host.js:200`. It persists after "Report to the supervisor" and without the maps change; `tests/lotm_districts.test.js` passes in node, so the browser start state differs. Lead: `know()` in `src/book_world_lotm_kit.js:16` cites `I.situation`, which starts only at report-in. Repro: `node scripts/playtest/walk-map-probe.mjs <out>` on branch `claude/rep-maps-be2acb`. Owner: the LOTM host lane (cast lives); this wave does not edit those files.

## Read models from the sonnet wave (2026-10-30 01:5x)

From the sonnet wave coordinator ([plan](../sonnet-wave-2026-10-30/PLAN.md), "Gap workers past volume 1"): representation sessions read these engine read models rather than defining their own. Merge review checks each branch against this list.

| Representation | Read model owner |
| --- | --- |
| Character sheet, inspection | `sw-chars`: `src/character_sheets.js`, `sheetAsOf(personId, chapterRef)` (WA50) |
| Abilities, combat | `sw-adv`: typed ability record and ladder (L10 note) |
| Rituals, potion mixing | `sw-rites`: `src/lotm_divination_rows.js`, summons, formula and recipe rows |
| Body, time and chronicle | `sw-death`: harm, backlash, death and restart (L9 note) |
| Maps, economy, worlds, organizations | `sw-road`: region kit, travel legs, personas (L11 note) |
| Relationship web | `sw-absorb`: cast records (knows, relations, wants) |

`sw-absorb` owns `src/book_world_lotm_{host,state,cast_host}.js`; the walks fix coordinates with it before editing them.

## Heavy gates (2026-10-30 02:0x)

Full suites, builds and browser captures run through the machine-wide slot limiter `scripts/slot_run.mjs` (L12; suite and build share 2 slots, browser 1; worktrees older than it use the absolute path `/Users/weiwei/code/yet-another-idle-rpg/scripts/slot_run.mjs`). Sent to the seven working sessions; the idle ones get it with their next message, and the merge uses it.

## Read-model bridges (L13, master `6ed148ae4`)

At merge, each representation switches to its bridge in `src/read_models/` with one import (RCT1, RCT4): abilities `ability_ladder_bridge.js` (`ladderViewFromRecord`), combat `combat_situation_bridge.js` (`versusWithEngine`), maps `travel_legs_bridge.js` (`legsFromRoute`, and delete the label-prefix match), character sheet `character_sheet_bridge.js` (`subjectFromDatedSheet`, `standingRows`), body `body_bridge.js` (`bodyViewFromHarm`). Gaps G1-G13 in `docs/gm/dispatch/sonnet-wave-2026-10-30/L13_BRIDGES.md`. Open asks to the representation side: honour `row.guess` on sheet rows (G10, character sheet) and confirm the maps window shape `{hours,text,waitMinutes}` (G6, maps). Messages to those sessions wait for the cap to clear.

## Next wave (2026-10-30 02:3x, weekly 53%)

Started on Sonnet: the integrator (merges the eighteen branches in RCT1 order, builds the contract test, switches adapters to the L13 bridges, lands the walks fix after checking with `sw-absorb`, receipt in `MERGE_RECEIPT.md`, no push), plus items and inventory, quests and the first hour, and talk and dialogue. Still queued: homes and base building, gathering and seasons, companions and party. After the merge, each finished feature's next slice comes from its own LATER list as a Sonnet session on merged master; the Opus feature sessions retire.

L13 additions: `time_digest_bridge.js` (present goes to Around; heard, affected and aftermath to Missed; G15) wired at merge. Post-merge contracts named for unbridged models: G14 gatherings and TC12 curfews go to the upcoming strip (time); G17 `learnView` to a Skills and techniques tab in the abilities ladder; G18 `whoKnows` to the Knows home with an ask action into talk.

Token migration and VSX1 style guide (session `tokens`, 2026-10-30, 1920x1080 target, mobile deferred; rules UR6, UR65-UR68):
- Migrated: character_sheet, body_view, crafting_detail, item_card, research, settled_text_effects, figure, style.css (2 literals) to tokens. New tokens: `--ui-type-heading`, `--ui-type-figure`, `--ui-motion-settle` (zero under reduced motion). Allowlist 869 to 772 entries; the 49-entry reset is gone, only 5 `border-radius: var(--ui-radius)` token-consumer entries (12 uses) remain in these files.
- `node --test tests/ui_contract.test.js`: 2 of 3 pass; the route-table test fails on the `management` route lacking a route representation, same as before this work (another lane).
- Focused views (body_view, crafting_detail, item_card, research_view, character_sheet(s), figure, body_figure, representation_contract): 62 of 62 pass.
- `npm run build` and `npm run build:figures`: pass. New CSS stays in styles/figure_gallery.css (stylesheet manifest not yet committed).
- Headless 1920x1080: `scripts/token_style_guide_browser.cjs` (style guide with 9 groups, character sheet, no page errors) and `scripts/body_figure_browser.cjs` (body view, no errors); shots in docs/representations/evidence/tokens/.
- Full suite `node scripts/slot_run.mjs --kind suite -- npm test`: started, machine load 40 to 90; 10 failures seen before I stopped waiting, all outside my files (native save integration workers timed out at 279 s, `core_ratchets` Math.random count from src/main.js, route-table test). Not a clean full-suite pass: implemented, below floor on that gate.

## Morning block (2026-10-30, master `9b8a166b`, not pushed)

**Playable now (agent-verified, not human-reviewed):** 21 feature views merged; the post-merge 1920×1080 pass reached 7 of 8 checked views (talk, Ledger Owed, items, family, body, walking board, Tingen workroom tabs). Full suite before landing: 4455 of 4476, failures fixed. Walks work again (the fix was overwritten once by a later commit and restored at `064fd773`).

**Below floor:** the Village encounter card was not reached by its proof script (likely the script's fixed date); the other features rely on branch evidence and unit and contract tests.

**Found, not fixed:**
- The talk view's center content covers the native "hello" line, so clicks on it are intercepted.
- A hidden duplicate `report_in` button sits behind the workroom tabs.
- Tingen header shows "Local weather unavailable" and "Local date unavailable" (round 8 UIW4).
- The first-visit tab hint reads as panel text.
- 49 style literals allowlisted instead of tokens (UR6 debt); four proof scripts are stale against the talk view and workroom tabs.

**Needs Weibao (at most five):**
1. Push master (it carries other sessions' commits too).
2. Adopt the new build into the Electron app (`scripts/adopt_candidate.mjs`).
3. Answer the UI rules packet P1-P16.
4. Start the queued Sonnet lanes: token migration and proof-script refresh, then homes, gathering and companions.
5. Look at the figure gallery and the new views and say which drafts are worth keeping.

## UI round 3 (2026-10-30 afternoon, weekly 67%)

Weibao, via the supervisor: "send out and finish the other sonnet works too, from like the UI stuff". Workers run as Sonnet subagents from the coordinator, two at a time. Session cards don't show over Remote Control.

| Item | State |
| --- | --- |
| UI rules packet P1-P16 | Applied as proposals in use (CHOICES 4), `8de98f00` |
| Proof scripts (talk, ledger, items, family, body, combat, walk, workroom) | 8 of 8 reached unpatched, `da8e7acc` |
| Token migration and VSX1 style guide | `18ee8ef7`, `80f548e06`, `67d0ef76b`; full suite cut short by load (failures outside these files) |
| ABILITIES F1 rung-name leak | Fixed here: a fresh life sees its rung and the next; regression in `tests/lotm_advancement.test.js` |
| Homes and bases representation | Home at a glance `58b0f84cd`, implemented, below floor (full suite and fold into Homes open) |
| Wiring follow-ups (You panel, Repay, opponent card, People-card dedup) | `a5387f552`, `2b3d2f5cb`, `c5897cf66`, `501c26434`; full suite pending |
| COV2 centre width | `f9736d8ac`: open centre panel 721 to 1130 px at 1920, 14 px type |
| COV3 text walls | `7528c7511`: Effects & sound 857 to 78 words; three more views roughly halved |
| Full suites | The load gate (12) starves queued suites at load 45-90; lanes commit on focused tests plus browser proof, and one batch suite is queued over all of it |
| Batch suite (HEAD `cd811c30`, slot pool, no load gate) | 4629/4662 pass. Of the 30 failures: 9 test files failed whole on a transient duplicate import that existed only mid-edit; they re-pass 19/19. 9 save-worker integration tests fail under concurrency; one passes alone 6/6, so memory pressure, not a regression. Real and not ours: `core_ratchets` Math.random 29 > 28 (`src/spell_seam.js:5`, GM40 lane) and `ui_contract` colours in other lanes' CSS |
| COV5/COV12 merges | `053dd6276`: Today and Around are tabs of Where I am; duplicate panels fold to their owners |
| COV6-COV11 labels plus IP12/IP13 | `3c9b068a1`/`ea921d032` (repaired a tool misfire in workspace_layout.js), `805de8c5b`, `5310b0800`, `56162a67b`, `2030a7ccc`, `b0f4b20d0` |
| COV4 forms | `a98b2bc0e`: table, threshold card, band, chip and bar rows; Home strip 36 circles to 0; gallery circle share 72% to 66% |
| RC69 next-slice lines | `b95524c93`, combat fixed in `001b80913` |
| G14 upcoming strip | `650a7ab5d`: "Coming up" under the place view calendar; found that the private lotm-events pack is rejected in play (evidence label), routed to the coordinator |
| Gathering and seasons | `122180071`: Gathering at a glance in the Village (site table, stock bar, regrowth words); season band appears only for worlds with seasons; below floor |
| Relationship web round 3 | Bars proven at 1920 (`ac4f8a932`, `c91471442` on its branch); asked to land on master |
| COV15 figure wiring | `048426846`: rite figure live on the Tingen brewing bench (stand-in for a per-condition learned fact) and chase range live in the pursuit panel; Research (no learn-view feed) and place history (no world defines eras) stay empty, gallery fixtures for all four |
| ui_contract | Green again after `54fda9ed2` (strip used an undefined token with a raw fallback) |
| COV13 paper skin and COV14 drafts | `3069bf7c8`: `figure-gallery.html?skin=paper` or the gallery Skin select (gallery only, Luminous stays default; one `COMPONENT_THEMES` entry exposes it later); eight "Draft:" screens with 0 circles (Insight, Walks, Study, Due and Orders, Day threads, Route strip, Collector at the door, Own body and borrowed face) |
| Round 3 closed | All COV2-COV15 items landed or routed (COV1 ui-defects, COV15 bridges sw-bridge). Remaining gate: one full suite on the final HEAD, then Weibao's look at the gallery |
| Tool note | `commit_own_paragraphs.py --para` is for docs; on a JS file holding another lane's hunks it duplicated about 570 lines. Code commits with shared files use the manual hunk method |
| Abilities G17 Skills tab, relationships G18 Knows plus bars | Sent to `rep-abilities` and `rep-relationship-web` (switched to Sonnet), with L13 bridges `learn_tab_bridge`, `knows_ask_bridge` |
| Companions | Moved to book-UI wave `bk-party` |

Queue, in order. Stop line raised to weekly 90% (Weibao 2026-10-30, "Raise to 90, for the ability UI and more", USER_VISION 0f2ef3cb7). COV3 started first because COV2 waits on the homes layout_spec hunk. Source: [coverage audit](../../../audits/gap-audit-2026-10-30/ui_cov.md).
1. COV2 width back to the centre, plus COV3 three worst text walls into tables or rows (one worker; layout_spec after homes lands).
2. COV4 open the best figures by default, and non-node forms (Owed table, threshold card, TC2 band, chip and bar rows).
3. COV5 one "where am I" view; COV6-COV12 labels, verb-first buttons, Effects board, empty-state rule, Reports column, Condition and Inventory merge.
4. RC69 next-slice lines for BODY, COMBAT, ECONOMY, KNOWLEDGE, MAPS, RITUALS, TIME; G14 `upcoming_strip_bridge` into the time strip.
5. Gathering and seasons representation; COV13 paper-and-ink second skin and COV14 unbuilt screens in the gallery.
6. COV15 read models gating the Research, Ritual, Combat and Spacetime figures: route to `sw-bridge`. Bridges landed (rite_state, chase_range, study, place_history; see L13_BRIDGES.md); still to do: view wiring, gallery fixtures, and a fresh-life route that shows Research or Rituals.

## Open defect routed out: workshop panel as a catch-all (2026-10-30 evening)

Not a debug page: "Craftsman & workshop" (`src/simulation_ui.js`, `#simulation_panel`) is a player panel that the first-hour gate points to (`src/progression_gates.js` `FOLLOW_LOCAL_PEOPLE`). It acts as a dev dump, because every player command whose group is missing from a hand-kept denylist lands there. Weibao's screenshot (1920 wide, Village) shows other worlds' techniques ("Let the dead take you", "Keep your feet on a heaving deck") beside the craftsman's work, and the blocker notes run together into one paragraph. He called the text meaningless and said it takes away from the game. Owner: the queued "crafting and workshops" representation session. Engine text fixes (WS-1 to WS-3) may land first from the protagonist-life coordinator; the session does the layout (WS-4, WS-5).

- WS-1: Commands get placement by allowlist, not by denylist. A command with no declared home panel goes in a dev-only "Unplaced commands" list, shown only with `config.enable_dev_mode` and labelled as dev, never in a player panel. The other-world filter added today (`d5f48d5f6`) misses techniques without a `worldId`.
- WS-2: Never print engine reasons to the player. "This command belongs to another world." (`src/simulation.js:131`) and the fallback "The required knowledge, means or circumstances are missing." (`src/simulation.js:46`) are dev text. Hide what is unreachable in this world or life, or name the specific missing thing ("needs 1 log", "learn measured packing first", "the traveler is busy").
- WS-3: A location blocker ("Return to Shack") becomes a travel chip on the button, not a sentence under it.
- WS-4: Split the panel into sections: Talk, Work here, Your abilities (collapsed, this world only), Elsewhere (one line each with travel). Each heading shows "n ready / m actions" (`summarizeGroups`). Put the rest in a closed "Not yet (n)" section.
- WS-5: Keep the scene prose and status apart from the controls. The scene goes in a framed block above, and status becomes one line. Blocker reasons show on hover or focus, not as inline `small.ui-disabled-reason` runs (`src/ui_components.js`).
- WS-4/WS-5 status (rep-crafting, 2026-10-30, proposal): sections Talk / Work here / Leads here / Not yet (closed) / dev-only Unplaced, each with `summarizeGroups` counts; scene in a framed block; status one line; blocked actions move to Not yet. `src/workshop_placement.js` is the allowlist for this panel only (the denylist still routes other panels' groups). Not built: "Your abilities" and "Elsewhere" (no command in this panel carries them yet), and the cross-panel allowlist. Evidence: `docs/representations/evidence/crafting/workshop-panel-1920.png`.
- Done check: rebuilt 1920x1080 fresh origin, Village with the craftsman met. No other-world label is visible. No reason note contains either generic string. Each section heading has its count.
