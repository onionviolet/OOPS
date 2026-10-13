# Immortality Idle ranked implementation packets

All packets are **PROPOSAL**: unaccepted, unimplemented, not authorization to build. Use original names, numbers and text; credit Immortality Idle as inspiration only (no license). Desktop/laptop first. Each world decides its own carry and life rules. Finding codes refer to [REPORT.md](REPORT.md).

| Rank | Packet | Smallest playable result | Source |
|---:|---|---|---|
| 1 | P1 Station that runs on work days | Loaded Village bench makes one item each day you do matching work | F1 |
| 2 | P2 Aptitude earned from a life's real gain | Death summary shows gain-based aptitude; next life starts higher in that skill | F2, F4 |
| 3 | P3 Saved plans and one switch trigger | Two named plans; switch when a stated value is reached; a "start of life" plan | F3 |
| 4 | P4 Family trade and one apprenticeship per life | Heir starts with the most-practised trade's bonus; one gated trade per life | F5 |
| 5 | P5 Named lifespan ledger | Tooltip lists lifespan sources; food quality raises a ceiling; opt-in pause before old age | F4 |

## P1: Station that runs on work days

- **Seams:** `src/home_furnishing_host.js` / `home_furnishing_content.js` (rack and bench are already built as `src/site_projects.js` phases); FA20 rack/bench jobs; `src/crafting_recipes.js`; native activity end in `src/main.js` (`end_activity` L2329) or `registry.simulation.commands` for extension work. Fits the open crafting-screen dispatch (`docs/gm/dispatch/crafting-screen-2026-10-13/`, CP1-CP10).
- **Player path:** Load the drafting bench with inputs. Each day of matching work (e.g. woodcutting) it consumes one batch and makes one output. Its output quality reads from the existing station tier and skill. The bench detail shows inputs left, the next output and the stop reason when empty.
- **State:** per-station input stacks and trigger activity ids. Persistence change: needs a migration, or a declared default of empty stacks for existing saves.
- **Acceptance:** In a rebuilt desktop build, do three work days. The bench output count and inputs change by exactly three batches. Save, reload and import keep the station's stock. An empty bench says why it stopped.
- **Tradeoff:** Passive output can crowd out manual crafting; keep one station and a bounded input stack.

## P2: Aptitude earned from a life's real gain

- **Seams:** `src/chronicle.js` createHeirChronicle L273 and `src/life_experience.js` lifeGrave; `src/life_experience_host.js` buildLifeHeirSave; rebirth reset domains in `src/simulation.js` commitCampaignTransition L565; `src/models/skill.js` xp_scaling. Builds on Increlution P3 and north star "Aptitude can change"; the gain-delta rule is the new part.
- **Player path:** At the end of a life, the summary lists each skill's gain this life and the aptitude it adds (gain / world divider, never negative). The heir or next self starts that skill at a small head start and learns it slightly faster. Only worlds that declare this carrier use it.
- **State:** per-path aptitude and a life-start snapshot. Needs a migration (existing saves start at neutral aptitude and get no invented legacy).
- **Acceptance:** End two synthetic lives, one with practice and one idle. The summary and the next life's start values agree; the idle life adds nothing; reload and import do not repeat the gain.
- **Tradeoff:** Compounding carry rewards farming lives. Use a diminishing curve and a per-world divider.

## P3: Saved plans and one switch trigger

- **Seams:** `src/simulation.js` setSimulationProgram/pause/resume L319-337 (single command per actor); `src/feature_expansion_work_plan.js` itinerary cursor; `src/simulation_ui.js`. open-idle P2 advises proving one repeated task first. That proof exists, so this is the next step.
- **Player path:** Save the current routine under a name. Add one rule, e.g. "when Woodcutting reaches 10, load plan B". Mark one plan "start of life" so a new life begins with it. The routine panel shows the rule and the reason it fired.
- **State:** saved programs keyed by name and an ordered trigger list with an index. Needs a schema bump on `simulation.programs`.
- **Acceptance:** On a fresh origin, a plan switches exactly once at the threshold, the log names the rule, and Save/reload keeps the trigger index.
- **Tradeoff:** Rules invite fiddling. Start with one trigger and plain text.

## P4: Family trade and one apprenticeship per life

- **Seams:** `src/chronicle.js` heir creation; `src/life_record.js` (legacy/family kinds); `src/titles.js` counters for practice tallies; apprentice content in `src/agreed_duty_host.js` and `src/feature_expansion_book_roster.js`.
- **Player path:** The life record counts days spent per trade. The heir inherits a family trade, a small, visible income or learning bonus in the most-practised trade. Separately, one master accepts you as apprentice per life. Other gated masters decline until you finish. A finished apprenticeship stays a known trade for later lives that carry it.
- **State:** per-life trade tallies, the open apprenticeship id and completed ids. Needs a migration.
- **Acceptance:** In a synthetic heir test, the most-practised trade becomes the family trade; a second master refuses with a reason while an apprenticeship is open.
- **Tradeoff:** The commitment lock can feel arbitrary. Show it before acceptance and let worlds turn it off.

## P5: Named lifespan ledger

- **Seams:** `src/chronicle.js` lifespanDeadline L97 and advanceChronicle L104-116 (last-year note); `src/chronicle_ui.js` L73-75; native food items in `src/items.js`; `src/npc_lives.js` for NPC parity later.
- **Player path:** The life panel's lifespan tooltip lists base years plus each source (diet, medicine, practice). Good meals add lifespan up to a ceiling set by meal quality, so plain bread cannot match a balanced diet. An opt-in setting pauses time one day before old age, alongside the existing last-year note.
- **State:** lifespan source map on the chronicle. Existing saves get base only.
- **Acceptance:** Eat two meal grades. The ledger shows different ceilings, the deadline moves by the shown amount, and the pause triggers once at the stated day.
- **Tradeoff:** Lifespan stacking can trivialize mortality. Keep ceilings per source and per world.

## Considered, not ranked

F7 nested challenge saves (a world AU challenge whose return merges gains), F11 generated family techniques, F12 rule zones keyed to past conduct (`src/pocket_realm_rules.js` seam), F13 declared megaproject persistence, F16 home ladder with upkeep and placement scoring. Each needs more than one seam; keep as options for later worlds.
