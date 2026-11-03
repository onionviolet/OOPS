# Trace C: Theory of Magic packets, Climb/MR2 shortlist and gap audit

Read-only. All source docs are proposals (AD32). "Implemented" is claimed only where I read consumer code. Search depth was a grep-plus-spot-read pass, not a full consumer trace. Cells marked (grep) mean I saw the symbol but did not read the whole consumer path.

Direction check: PROJECT.md and AD lines say the one-realm/one-prestige milestone is no longer a gate, and AD33 defers NPC-heavy work. No packet is blocked by direction, so there are no deferred-by-direction rows except where noted (P4/O4, NPC-leaning).

## Theory of Magic (docs/research/theory-of-magic/IMPLEMENTATION_PACKETS.md)

Stale-anchor finding: P1, P2, P5, P6 and P7 all cite `src/items.js:1092-1152`. That range is now Cape/Amulet/Ring class code. Book code is at `src/items.js:1155-1207`. P1/P5 cite `src/data/skills.js:2539-2565`, which is Meditation level-effect data. Literacy is at `:2574`. Anchors are stale.

| ID | Claim + locator | Class | Src evidence | Note |
|---|---|---|---|---|
| P1 | Study changes ability: field manual, practice, technique that needs a tool, gather with it (packets L7-18) | partial | `src/items.js:1520-1522` (`RAT_STEP_MANUAL` Book); `src/technique_content.js:46` (Rat-step requires `manualHeld`, `manualRead`); `src/main.js:1726`; `tests/techniques.test.js` | The book -> read -> practice -> own -> execute chain exists for Rat-step (combat footwork). Execution gates are proficiency 6 and Agility 8, not a declared tool. No gathering technique with a tool gate found. Reading keeps separate Literacy XP (`items.js:1207`). |
| P2 | Shack furnishing (stand/workbench) gives a benefit only while at that place (L22-33) | partial (nearest sibling implemented) | `src/home_furnishing_content.js` (drying rack, drafting bench, `location:'Shack'`); `src/home_furnishing_host.js:32-37`; `src/main.js:176,2362,2488`; `tests/home_furnishing_bonuses.test.js` ("local, readable"; "only settled installed local fixtures earn bonuses") | Rack and bench are crafted, Shack-local, and persist. Neither is a reading stand. The packet's reading-rate benefit is not present: no study_stand/reading_desk/lectern symbol in src or tests. |
| P3 | Show why a routine stopped; stop-at-goal; no hidden loop (L37-48) | partial, mostly implemented | `src/simulation.js:322` and `:728` (program set `paused` with a `reason` string); `src/craft_batch_goal.js:5-12` (target/attempted counters, display intent only); `tests/craft_batch_goal.test.js`; `tests/routine_jobs.test.js`; `tests/trial_routine.test.js` | Blocked reasons and a craft-target stop exist. The packet itself says `simulation.js` owns this. The gap is only whether activity/read rows (not craft) show a reason, and that is unverified. Do not add a runner. |
| P4 | Optional apprenticeship: mentor tasks, commission, graduation title (L52-63) | partial | `src/material_apprentice.js:1-40` (craftsman lesson -> repair shift -> fitted-repair capability, Village-local); `src/heir_inheritance.js` header (apprentice taught -> heir recipient); grep for `material_apprentice` in tests found only `tests/distinct_world_materials.test.js` | Mentor + lesson + shift + capability exists (original Mender work). I saw no recorded title or graduation record in that file (grep). Existing fieldwork remains. AD33 deprioritizes NPC-heavy expansion. |
| P5 | A Literacy/Meditation milestone improves a later task with a visible causal explanation (L67-78) | partial | `src/data/skills.js:2539-2565` (level thresholds: stats and `xp_multipliers` on Meditation); `src/display.js:4450-4471` (stat "calculation" and "sources" notes) | Milestone effects exist. Stat sources are explained in the stats panel. I did not find a per-task causal line ("this reading is faster because ...") on the reading row. |
| P6 | Bind notes into a manual, then consume a copy to learn a method (L82-93) | partial | `src/home_furnishing_content.js:84-93` (held Cyorian annotated notebook is retained through adapt/draft jobs, never consumed); `src/book_world_mol_ids.js:9` (`MOL_KEYS.notes`); `src/proto23_world_content.js` (compile, grep) | A note -> notebook compile and a retained-document use exist in a book world. The base-frontier "gathered notes -> manual -> consume copy -> learn method" loop was not found. |
| P7 | Reading row states what completion allows (L97-108) | partial | `src/display.js:5303-5308` and `:1366-1371` (reading row: "Reading the book, N left"); `src/display.js:4457` | Time remaining is the existing foundation, as the packet says. No "what completion will allow" text on that row. |
| P8 | Prestige that preserves a lived character; design-only retention matrix (L112-123) | already-implemented (heir path) / design-only for the rest | `src/heir_inheritance.js:1-12` (estate -> heir: money, goods, chest, home, papers, apprentice); `src/heirloom_compact.js:12,21`; `src/home_inheritance.js`; `src/home_personal_legacy.js`; `tests/heir_inheritance.test.js:29`; `tests/heirloom_compact.test.js:13` | An heir/estate transfer with once-only claims is built. A mentor-hall/legacy-archive layer is a different thing and I found none. The packet is design-only, so no gap to close. |

## The Climb / MR2 adaptation shortlist (ADAPTATION_SHORTLIST.md)

| ID | Claim + locator | Class | Src evidence | Note |
|---|---|---|---|---|
| SL-O1 | Village chain: keeper lead -> specialist teaches method -> tool changes a task (table row 1) | partial | `src/material_apprentice.js:1-40` (craftsman lesson -> shift -> `frontier.fitted_repair` capability, tool-fit action); `src/home_furnishing_content.js` (rack/bench) | A near-match already exists (lesson, shift, kit fit, Village-local). Whether "keeper supplies a lead" exists was not traced. GAP_AUDIT G1 says to trace the natural route first. |
| SL-O2 | One item with history: bounded improvement, a real slot tradeoff, optional carry across life transition (row 2) | partial | `src/gear_work.js:24,156,165-166` ("Make rigid setting", one setting per item, filled/empty); `src/gear_item_facts.js:11`; `tests/gear_workshop.test.js`; `src/alloy_equipment.js` + `tests/alloy_equipment.test.js`; `src/heirloom_compact.js`, `src/heirloom_items.js:4` | A single rigid-setting socket per item, material-derived alloy gear and heirloom pass-down exist. No Climb-style awakening or enchant-slot tradeoff found. Retention is a Compact-card nomination (`src/life_experience_host.js:30`), a different model from Climb heirlooms. |
| SL-O3 | Optional guidance from the player's pursuit and bottleneck (row 3) | partial | `src/cultivation_guidance.js:1-6` (frame-derived advice, not progression owner); `src/adventure_notebook.js:29` | Guidance exists for cultivation and the notebook. The packet itself notes OD24 (goals/guidance) is still a discussion topic, so this is not deferred but not settled. No generic bottleneck-aware guide found. |
| SL-O4 | Careers/homes grant concrete permissions (row 4) | already-implemented (in part) | `src/home_furnishing_host.js`, `src/home_school.js`, `src/home_office.js`, `src/home_work.js` (home domain files; I read the furnishing ones only) | Home permission/service files are plentiful. Only the furnishing ones were read. The rest are listed by name, not verified. |
| SL-O5 | Short expedition plan: prepare supplies -> route -> stop at discovery; actionable stop reason (row 5) | partial | `src/expedition_content.js`, `src/expedition_ui.js:100` (`preview.reasons` shown), `src/structured_expedition_runtime.js`; `src/simulation.js:322,728` | Expedition preview with refusal reasons exists. Not traced: the "stop at new discovery" rule and supplies-checked-before-start. |

## GAP_AUDIT.md

| ID | Claim + locator | Class | Src evidence | Note |
|---|---|---|---|---|
| E1 | Discovery policy dedupes and coalesces; hidden-tab effects cancelled (table E1) | already-implemented | `src/native_discovery_policy.js`, `src/native_discovery_feedback.js`, `tests/native_discovery_policy.test.js` | Files exist. I did not rerun the tests. The audit says "four pass". |
| E2 | D1 alloy equipment has recorded browser evidence (E2) | already-implemented (source), evidence historical | `src/alloy_equipment.js`, `tests/alloy_equipment.test.js` | Source and test exist. Browser evidence is not re-verified here. |
| E3 | `tests/fa09_routines.test.js` exercises routine paths (E3) | stale-doc | `ls tests` has no `fa09_routines.test.js`. Nearest: `tests/routine_jobs.test.js`, `tests/trial_routine.test.js` | The cited test file is gone or was renamed. The routine behavior is real (`simulation.js:322,728`). Fix the doc pointer. |
| E4 | `skill_discovery.js` and `techniques.js` separate known/practiced/eligible; `energy_resources.js` exists (E4) | already-implemented (files exist) | `src/skill_discovery.js`, `src/techniques.js`, `src/energy_resources.js` | Existence confirmed only. Consumers were not read, and the audit itself says so. |
| G1 | Complete player journey audit: clue -> prep -> acquire -> use -> feedback (G1) | missing (audit not run), no code gap | none | An audit task, not a mechanic. The `original_frontier_*` and Mender/rack/bench chain are candidates to trace. Prior "recommended next scope" is still unrun per docs. |
| G2 | Return/interruption semantics vs OD4/OD15/TBANK (G2) | partial | `src/away_bank_domain.js:1-5` (OD4/TBANK/AD18 time bank, real elapsed time banked as game minutes); `tests/away_bank_domain.test.js` | The bank domain exists with its test. The "same interval cannot pay twice (catch-up and bank)" invariant was not checked. OD15 recap not traced. |
| G3 | Save fidelity: export/import into a separate origin (G3) | missing as evidence (needs a browser run) | n/a | Process evidence gap, not code. Cannot be traced by grep. |
| G4 | Item identity beyond a stat total: acquire -> improve -> equip -> use -> retain (G4) | partial | see SL-O2 | Same evidence as SL-O2. The "real choice survives or everything stacks" question is not answered by source I read. |
| G5 | Achievement/reward meaning, exactly-once, incentives (G5) | partial | `src/naming_achievements_ui.js` (grep), `src/main.js` (achievement refs, grep) | An achievement UI exists. Eligibility/exactly-once not traced. No Climb-style dummy-granted award found (`grep dummy` empty in src). |
| G6 | Combat/automation/recovery interaction (autocast starvation) (G6) | missing (not traced) | n/a | Marked LATER in the audit. Not looked at. |
| G7 | Source coverage and reachable-content qualification (G7) | stale-doc / process | n/a | It is an instruction to qualify claims in the audit itself, not a mechanic. |
| F8 | MR2 Time Piece paid 2x/5x acceleration and balance across retirement; offline cap 48h (F8) | partial | `src/away_bank_domain.js:1-5` | A banked-time domain exists. Paid acceleration multipliers and retirement restore were not found (no `time_piece`/`accelerat*` in src). Bank use is the accepted direction (TBANK). Exact mechanics stay open. |
| GA-O1 | Explain batch size, resource demand and refill time together | missing (not found) | grep not done beyond `display.js` | Not traced. |
| GA-O2 | NPC dialogue reveals an actionable chain; independent routes remain | partial | `src/adventure_notebook.js:29`, `src/story_requests.js` (grep) | Not traced beyond file names. |
| GA-O3 | Measure time to first meaningful decision | missing (process) | n/a | A measurement task, no code. |
| GA-O4 | Evidence ledger separating captured/read/played | missing / process | n/a | A doc practice. |

## The Climb: claims drawn only from a playtest or the published browser bundle (benefit from a source read)

The shortlist O2 and gap audit G4 name `https://github.com/tomlipo/the-climb` as the "published repository". The gap audit says the Climb mechanics came from the "published bundle" and were not played. None of the four mechanics has a source-line trace in these docs.

1. **Awakening.** G4 says the bundle "exposes" it. Never played or read from source. Unknown: trigger, cost, what it changes, whether it is per item or per character.
2. **Enchant slots/capacity.** Same basis (bundle exposure, unplayed). Unknown: slot count source, whether slot count competes with other upgrades, what an enchant does, whether it is removable.
3. **Rune blessings.** Not named in these three docs. If another doc claims it, it is unsupported here. I saw no evidence in the docs I read.
4. **Heirloom/rebirth retention.** G4 and O2 say "selected heirloom retention" from the bundle, with "later acquisition and rebirth unplayed". Unknown: which items survive, what resets, conditions.
5. **Opening chain (smith -> woodworker -> diagram/tool/workspace -> forest wood).** Played only to gathering and the start of diagram reading. Crafting completion was never exercised (O1).
6. **Combat award from a training dummy (G5).** Observed in play, not source-confirmed.

Source read targets: `tomlipo/the-climb`, the item-state, enchant, awakening and rebirth modules.

## Top 5 MISSING / highest-value gaps

1. **P7 + P5 reading row explains what completion unlocks** (`src/display.js:5303-5308`, `:1371`). Row 1 of the Theory work. Smallest, no new state, and the packet scopes it to a text line. It is only partial because the time-left text exists.
2. **P2 reading stand** (a Shack furnishing that changes reading rate only at the Shack). Rack and bench prove the furnishing pipeline (`home_furnishing_content.js`), so it is the cheapest "missing" content slice. No `study_stand` symbol found.
3. **P1 gathering technique gated by a declared tool.** The Rat-step chain (`technique_content.js:46`) is the template. Missing is the tool gate and gather consumer. Needs a real tool in `items.js`.
4. **G1 end-to-end journey audit** (clue -> prep -> acquisition -> use). No code. It is the audit that decides O1 and was never run, and the docs call it highest-value.
5. **P6 base-frontier note -> manual -> learned method** (consume a copy). The notebook retain-and-use exists only for Cyorian book world content (`home_furnishing_content.js:84-93`).

## Items I could not trace

- **SL-O4** home permission files other than furnishing (`home_school.js`, `home_office.js`, `home_work.js`): named, not read.
- **GA-O1** (batch size/demand/refill explanation) and **GA-O3**: no search done.
- **P4** graduation title: checked `material_apprentice.js` by grep only for "title"/"graduat" (no hit). Full read not done.
- **G2** double-payout invariant between the catch-up and bank: not read.
- **G6** combat/autocast: out of scope for this pass.
- **Climb rune blessings**: no source in these three docs, so no claim to trace.
- **E1/E2/E4** tests not rerun. Existence only.
