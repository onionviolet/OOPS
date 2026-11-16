# UI surface mapping, 2026-11-16 (SFC31, SFC32; proposals, AD32)

These two mapping tables close the [coverage pass](UI_SURFACE_COVERAGE_2026-11-15.md). Each file that appends to the old Here area (SFC31), and each registered panel with no route (SFC32), gets a proposed home in [round 14](../gm/dispatch/play-surface-2026-11-14/CONSIDERATIONS.md#round-14-2026-11-15-back-to-yairs-groupings-in-depth)'s boxes.

Homes are written in one of three forms:
- a box and tab ("3 · Journal · Data");
- a verb and its target ("**Find work** › Patrol");
- Menu › Tools, for development pages (PS123).

A draft from the [drafts page](../../prototypes/ui-drafts-2026-11-15/README.md) is cited where one exists. These are proposals for ui-cohesion and feature-ui to build from. They are not accepted, and they do not move anything by themselves (PS125).

**Source.** Master at `8733f2893`:
- `grep -rl location_actions_div src` gives 47 files. `here_kinds.js` is left out of the table, because it is the placer.
- The `definePanel` ids, minus the 23 routes in `src/layout_spec.js`.
- Ownership of each file was not checked against open lanes, so a build lane confirms its owner first.

## SFC31: files that append to the old Here area

**Frame and infrastructure.** These stay where they are, because they place or read Here rather than add a feature to it:
- `center_modes.js`, `command_palette.js`, `display.js`, `main.js`, `nearby_context_view.js` (the Here line);
- `region_view.js`, `row_context_menu.js`, `workspace_navigation.js`;
- `ui/ready_hub.js`, `ui/verb_marks.js` (marks on verbs);
- `simulation_ui.js`, `foundation_interaction_ui.js`, `content_pack_ui.js`.

**Lead and fight surfaces already drafted:**
- `book_world_lotm_ui.js` is covered by D1, D2, D7, D10 and D11.
- `structured_pack_ui.js` is covered by D4 and D5.
- `combat_situation_ui.js` and `tempo_fight_domain.js` are covered by D6. They belong to the combat lane.
- `ui/capability_runs.js` goes to Menu › Tools (SFC35).

| File | What it shows (from its name and panel) | Proposed home |
| --- | --- | --- |
| `village_ui.js`, `village_workspace.js` | Village life, local practice | **Take an action** › Local life · Village practice (as today's chips, PS107) |
| `village_career_ui.js` | Watch post, watchcraft | **Find work** › Watch post (D12) |
| `town_ui.js` | Town services | The verbs those services allow: **Visit a merchant**, **Find work**, **Sleep** |
| `exchange_ui.js` | Trading and exchange | **Visit a merchant** › Exchange |
| `expedition_ui.js` | Routes and supplies | **Leave the place** › an expedition target with its supplies (round 17's Move around for inside a place) |
| `field_ui.js` | Field and workshop work | **Gather resources** (field) · **Try to craft something** (workshop) |
| `observation_ui.js` | Watching and noting | **Take an action** › Observe; findings go to 3 · Journal · Knows |
| `pursuit_ui.js` | Long pursuits | 3 · Journal · Quests (a pursuit is a goal); its evidence line follows PS150 |
| `promise_ui.js` | Promises made | 3 · Journal · Quests · Promises filter; due ones mark **Talk to someone** |
| `party_ui.js` | Party | 3 · Journal · People · Party filter; the fight shows it as "Beside you" (D6) |
| `pocket_realm_ui.js` | A pocket realm | **Move around** › its area, behind a world-law gate (round 17, PS178) |
| `storylet_ui.js` | Story cards | 4 · Reports "Right now · Story"; choices as **Take an action** › Story |
| `technique_ui.js` | Techniques | 3 · Skills · Stances, or the world's power tab |
| `body_ui.js` | Body | 1 · Character · Active effects (DU34 count) and Bio |
| `aging_contact_ui.js` | Contact as people age | 3 · Journal · People (per-person rows) |
| `chronicle_ui.js` | The life's chronicle | 3 · Journal · Beginning |
| `causal_story_ui.js` | Why things happened | 4 · Reports line detail (hover, UR43) |
| `frontier_campaign_ui.js`, `original_frontier_campaign_ui.js` | Campaigns | 3 · Journal · Quests · Campaigns filter |
| `repository_absorption_ui.js` | Absorbed upstream features | Menu › Tools |
| `skill_expansion_ui.js` | Skills panel extension | 3 · Skills · Skills |
| `feature_expansion_ui.js`, `feature_expansion_nested_ink_ui.js` | Feature trials | Menu › Tools until a feature is chosen; then its own verb |
| `absorb_p23/host_joins/combat_options_ui.js` | Combat options | 1 · Inventory & combat · Combat (the approach strip's defaults) |
| `absorb_p23/host_joins/encounter_profiles_ui.js` | Encounter profiles | 3 · Journal · Bestiary |
| `absorb_p23/host_joins/growth_profile_ui.js` | Growth profile | 3 · Skills · Skills head (PS125) |
| `absorb_p23/host_joins/tranche_two_ui.js`, `tranche_three_ui.js`, `tranche_four_ui.js` | Proposal tranches (study, books, leatherwork, living gear) | Each row to its verb: **Train** (study), **Take an action** › Read, **Try to craft something** (leatherwork), 1 · Character · Equipment (living gear) |

## SFC32: registered panels with no route

The unrouted panels from the coverage pass (SFC3) are listed by id and title. Panels that are already routes, frame parts (`focus`, `pane-navigation`, `shell-*`, `opponents`, `combat`, `stance`, `tools`) and the three lead catch-alls are left out.

| Panel (id · title) | Proposed home | Draft |
| --- | --- | --- |
| `deeds` · Deeds | 3 · Journal · Quests · Deeds filter | |
| `companions` · Companions | 3 · Journal · People · Party filter | |
| `family` · Family; `life-events` · Family & farewells; `inherited_traits` · Family qualities | 3 · Journal · People · Family filter; qualities in 1 · Character · Bio | |
| `household-cohort` · Household cohort; `household-fortunes` · Household | **Your home** box › Upkeep and a Household tab | D7 |
| `homes` · Homes; `home-overview` · Home at a glance; `home-layout` · Room plan | **Your home** box (Rooms, Room plan tabs) | D7 |
| `hp-contact` · Friends at school | 3 · Journal · People · School filter | D8 |
| `hp-polyjuice` · Potioneering | **Mix** bench › Cauldron tab | D9 |
| `research` · Study | **Study** verb (PS120); notes go to Journal · Notebook | |
| `quest-board` · Leads | 3 · Journal · Quests | |
| `economy_standing` · Standing and ledger; `social-trust` · Regard | 1 · Character · Bio · Standing; detail in Journal · People | D11 |
| `statistics` · Statistics | 3 · Journal · Data | |
| `lives_carry` · Lives and inheritance; `memories` · Remembered years | 3 · Journal · Beginning | |
| `story-insight` · Stories and history; `canon-pull` · The story | 3 · Journal · Anthology | |
| `known-things` · Known things | 3 · Journal · Knows | |
| `known-routes` · Known routes | **Move around** / **Leave the place** targets, and the map (PS176) | areas mock |
| `region-view` · Where I am | The location box and its map (PS175, PS176) | areas mock |
| `village-neighbors` · Village neighbors | 3 · Journal · People · Neighbours filter | |
| `herbal-experiments` · Village experiments | **Mix** bench › Notes tab | D9 |
| `gathering` · Gathering at a glance | **Gather resources** head (time, chance, yield; PS142) | |
| `carcass-processing` · Carcass processing | **Try to craft something** › Butchering | |
| `drainage-site` · Riverside exploration | **Move around** › the site's area, with the SR rules | |
| `fields` · Spills and smoke | The location box's area facts (PS182) | |
| `world-events` · World events | 4 · Reports · Events filter; a forewarning on the location box (UR83) | |
| `place_clock` · Hearthside clock | Column 2's time strip | |
| `gear-workshop` · Gear workshop | **Try to craft something** › Equipment sub-tab (DU6) | |
| `loadouts` · Loadouts | 1 · Character · Equipment | |
| `stock_view` · Stock | **Visit a merchant**, or 1 · Inventory | |
| `combat-review` · Combat forecast and review | The fight card's review after a fight; history in Journal · Data | |
| `cultivation-insights` · Cultivation insights; `root-retuning` · Root retuning; `pledges` · Vows and tempering | 3 · Skills · the world's power tab | |
| `rank_gap_observer` · Watch a working | **Take an action** › Observe | |
| `rune-bench` · Rune bench; `vessel-thread` · Vessel-thread relic | **Try to craft something** › its bench, in place | |
| `primordial_credit` · Sect Library · priced credit | **Visit a merchant** › the library, with its credit line | |
| `cheat-faculty` · Continuing insight; `status-window` · Status window | 3 · Skills · the world's power tab (a status window is a world form, DSG18) | |
| `naming` · Naming and achievements | 3 · Journal · Data | |
| `notebook` · Notes, practice & people; `personal-journal` · Your journal & atlas | 3 · Journal · Notebook | |
| `mol_access` · Cyoria access and loops; `dnd-phandalin` · Phandalin | That world's location box and verbs (other lives) | |
| `management` · Organizations · Market courtyard | 3 · Journal · People · Organizations (route today, PS125) | D11 |
| `continuation` · Continuing connection; `projects` · Projects; `capability-runs` | Footer · Menu (PS123) | |

No panel came out without a home, so there is no finding to raise. Panels whose home is "the world's power tab" wait on ui-cohesion's slice 4 box-tab names.
