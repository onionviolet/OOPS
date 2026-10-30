# USER_VISION coverage, lines 5600 to end (2026-10-19 to 2026-10-30)

Method: read the whole range, then grepped `src/`, `tests/`, `desktop/`, `scripts/`, rulebooks, `RULES_INDEX.md`, `IDEA_INDEX.md`, dispatch checkpoints. Where I only confirmed a file exists (not that it does the whole job) the row says "(inferred)". Sealed secrets: none restated. No repo file edited.

Status key: BUILT, PARTIAL, DESIGNED, NOT STARTED, SUPERSEDED, STANDING.

| # | Date | His ask (paraphrase) | Status | Evidence (path) | Gap |
|---|---|---|---|---|---|
| 1 | 10-19 | Alchemy plus procedural interactions from tier, difference and tags | PARTIAL | `docs/CRAFTING_ENGINE.md` Round 7 (IX1-IX24, proposal); `src/craft_material_fit.js`, `src/craft_resolver.js` (inferred) | Dominance search and per-world tier vocabulary were held; no evidence of an unlimited tag-derived interaction layer |
| 2 | 10-19 | Per-world rule grammars (HP spellbook rules etc.) to see each little thing | PARTIAL | `docs/WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md` (DG1-DG30); `src/spell_adapter_hp.js`, `tests/spell_seam.test.js` | LOTM, cultivation, comic grammars were "held"; only HP spell seam has code |
| 3 | 10-19 | Deep-level lenses for every world, saved long term | DESIGNED | `docs/worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md` Round 21 (KL1-KL12) | Map leads are "unverified memory"; no code by intent |
| 4 | 10-19 | Deep world implementation: LOTM Seer slice (one pathway, acquisition, bounded action) | BUILT | `src/book_world_lotm_pathways.js`, `book_world_lotm_abilities.js`, `tests/lotm_self_ritual.test.js` | Hostile Beyonder encounter is tests-only (`docs/gm/dispatch/lotm-lives-regions-2026-10-23/CHECKPOINT.md`) |
| 5 | 10-19 | Remove all rules forcing 1366x768 | STANDING | `docs/UI_RULES.md` UR14 and viewport note rewritten; `AGENTS.md` UI paragraph | Recorded and applied |
| 6 | 10-19 | Implement every Round 11 UI item, no placeholders (palette, row menu, shortcuts, divider reset, text size, high contrast, badges, empty states, six sections) | BUILT | `src/command_palette.js`, `change_badges.js`, `empty_states.js`, `known_things.js`, `loadouts.js`; `tests/ui_extras.test.js`, `tests/optional_ui.test.js` | Section-to-route promotion left to his play |
| 7 | 10-19 | LOTM and HP deep implementation from source text, data first, spell books | PARTIAL | `docs/DEEP_WORLD_WORKFLOW_2026-10-19.md` rounds 2-5; `src/book_world_hp_content.js`, `tests/hp_school_progression.test.js`; `docs/gm/dispatch/hp-world-2026-10-25/CHECKPOINT.md` (slices 1-2) | HP is two slices; spellbook breadth and private census rows not all consumed (inferred) |
| 8 | 10-20 | Gear carries many stat dimensions at once; affixes and sockets (Apotheosis-like), implement them all | BUILT | `src/gear_work.js`, `gear_acquisition.js`, `gear_native_content.js`; `tests/gear_workshop.test.js`, `gear_acquisition.test.js` | Gem/affix content depth is a proposal set |
| 9 | 10-20 | Silent Gear, blacksmithing, chemistry, energy, superpowers through one stat pipeline | PARTIAL | `docs/GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md`; `docs/gm/dispatch/gear-depth-2026-10-21/CHECKPOINT.md` | GX8 chemistry, energy, converters, power lifetimes; CRL44 salvage; CRL24/25 spatial landing "explicitly unfinished" |
| 10 | 10-20 | Is a browser shell needed; how do other games do it | SUPERSEDED | Replaced by row 11 (DS1, ER5-D2 kept as history) | None |
| 11 | 10-20 | Transition to Electron plus web, consider the leeway | BUILT | `desktop/main.cjs`, `window_host.cjs`, `build_host.cjs`; `npm run check:desktop`; AD39 | None found |
| 12 | 10-20 | Loading screen cites Miktaew and Proto23 as inspirations | BUILT | `index.html` ("Inspired by ... Proto23 by 23html") | None |
| 13 | 10-20 | Agent work stays in the background, never takes over his screen | STANDING, unrecorded | Only in user memory (`background-only-windows.md`); not in `AGENTS.md`, GROUND_RULES or AGENT_USAGE_RULES (grep) | Add to AGENTS.md or a rulebook |
| 14 | 10-20 | EL18 frozen player build, EL46 hang guard | BUILT | `desktop/snapshot.cjs`, `guard_host.cjs`, `build_host.cjs` | None found |
| 15 | 10-20 | AI playthroughs identify gaps; local AI play; harness with UI checks and a to-do list | PARTIAL | `scripts/playtest/*`, `scripts/mcp/game_mcp.mjs`; local model only in `scripts/lead_run/local_census_lane.py` | Local AI that plays the game: not found; harness checklist doc not verified |
| 16 | 10-23 | Take most advantage of Electron (save mirror, window/menu, presence, soak, pop-out, offline icons) | BUILT | `desktop/save_mirror.cjs`, `window_host.cjs`, `presence_host.cjs`, `popout_host.cjs`, `app_menu.cjs` | Other EL proposals (EL39-52) remain proposals |
| 17 | 10-23 | A game MCP and dev-extension tooling | BUILT | `scripts/mcp/game_mcp.mjs`, `game_worker.mjs`; `yairpg-game` tools live in this session | None |
| 18 | 10-20 | Fully implement the retained 53-entry UI/engine palette, audit, then repair | BUILT | `docs/gm/dispatch/palette-completion-2026-10-20/CHECKPOINT.md` (all 53 verified) | Human play acceptance optional (AD42) |
| 19 | 10-20 | Per-world full-implementation sweep and subtle missing aspect per world; Sonnet subagents default | PARTIAL | `docs/audits/WORLD_SUBTLE_GAPS_2026-10-20.md` (WG1-WG26 proposal); `docs/WORLD_COMPLETION_STANDARD.md` | Audit is proposals. Sonnet default is STANDING but later superseded by haiku-first (global agreement) |
| 20 | 10-20 | Five connected deep-engine implementation chats | PARTIAL | `docs/gm/dispatch/deep-engine-2026-10-20/CHECKPOINT.md`, P1_STATUS.md | Per-pilot final state not checked (inferred) |
| 21 | 10-20 | Implement what Proto23/YAIR had that OOPS lacks | PARTIAL | `docs/gm/dispatch/reference-gap-followup-2026-10-20/REPORT.md` (F1-F7) | Residual gaps listed in report |
| 22 | 10-20 | Launch menu: show author handle onionv, improve beginning choices | BUILT | `index.html` credit text; `docs/reviews/launch_menu_2026-10-20/REPORT.md` | Beginning-choice redesign superseded by row 23 |
| 23 | 10-20 | Restore the original play screen; start menu a separate page later | PARTIAL | Restoration in `docs/reviews/launch_menu_2026-10-20/REPORT.md` | Separate start menu: NOT STARTED (deferred by him) |
| 24 | 10-21 | Credit creators in their own fun styles; give onionv a guinea-pig identity | BUILT | `index.html` (guinea pig), `docs/reviews/launch_menu_2026-10-21/REPORT.md` | None |
| 25 | 10-21 | Edited guinea pig, diagonal credits, corner links, transparent cutout | PARTIAL | Same report | Proto23/Corc donation URL still "needs its correct URL" |
| 26 | 10-21 | Titles versus skills: distinctions in rules | STANDING | `docs/DOMAIN_RULES.md` SLR40-SLR43; `docs/emergent/TITLES_ACHIEVEMENTS_AND_META_RULES_2026-10-15.md` C14 | Recorded |
| 27 | 10-21 | Implement all useful recovered-26 additions and CRL49-52 | BUILT | `docs/gm/dispatch/title-rules-implementation-2026-10-21/CHECKPOINT.md` ("implemented and rebuilt-verified") | Source constants and toys deliberately not copied |
| 28 | 10-21 | MS Gothic default internal font; Proto23 inventory UI improvements actually show | BUILT | `styles/ui_tokens.css` (`--ui-font-gothic`); `docs/reviews/PROTO23_UI_DELIVERY_CHECK_2026-10-21.md` | None |
| 29 | 10-21 | Primary checkout default; clean finished worktrees | STANDING | AD41; `AGENTS.md` Multi-agent; `docs/gm/SHARED_WORKTREE_PRACTICE.md` | Recorded |
| 30 | 10-21 | Everything to master; publish only to fork, never upstream | STANDING | `AGENTS.md` Safety; AD41; `docs/gm/BASELINE_CONSOLIDATION_2026-10-21.md` | Recorded |
| 31 | 10-21 | Finish remaining Apotheosis and related gear features, verify in game, merge | PARTIAL | `gear-depth-2026-10-21/CHECKPOINT.md`, `INTEGRATION_REPORT.md` | Same gaps as row 9 |
| 32 | 10-21 | Home system: owned, rented, shared, nonhuman homes; different residence starts; homeowner improvements | BUILT | `src/home_*.js`, `tests/home_cultivation.test.js`; `docs/gm/dispatch/home-system-2026-10-21/CHECKPOINT.md` | Free-form building geometry stays out of scope |
| 33 | 10-21 | Birds build nests in the wild; building considerations in general | BUILT | `src/home_building_panel.js` (nest/burrow/lean-to); H5.6 | Broader habitat/land extensions are proposals |
| 34 | 10-21 | Weather, repairs, interrupted construction, shared labor, portable homes, staff, noble-family starts | BUILT | Home checkpoint "incomplete construction grants no housing; rain uses played-calendar intervals"; `src/home_staff.js` | Portable homes not individually confirmed (inferred); court politics deferred |
| 35 | 10-21 | Staff rest/agency, tutors, obligations, pantry, inheritance, canon-sourced institutions | BUILT | `src/home_staff.js`, `home_cultivation.js`, `tests/home_cultivation.test.js`; `home-system-2026-10-21/household-life/CHECKPOINT.md` | Dynasty simulation excluded |
| 36 | 10-21 | Implement the seven Minecraft mods' fitting mechanics and small details | BUILT | `docs/gm/dispatch/minecraft-fit-2026-10-21/CHECKPOINT.md` ("MF1-MF7 technically delivered") | Settlement simulator excluded |
| 37 | 10-21 | Fully integrate them into the main game; remaining mechanics | BUILT | Same checkpoint; `src/field_works_*.js` | MF26+ details beyond checkpoint not audited |
| 38 | 10-21 | Cross-site freight, exposed drying, residence-aware workers | BUILT | `src/field_works_ui.js`, `tests/drying_exposure.test.js`, `tests/field_works_extension.test.js` | None |
| 39 | 10-21 | Deepen each book world; different lives (student vs smuggler); more worlds | PARTIAL | `docs/worlds/BOOK_WORLD_FEATURE_GAPS_2026-10-15.md` BF28-BF70; `src/book_world_lotm_lives.js`, `src/world_packs/*_life.js` | 41 profiles are specs; built lives exist for LOTM, MoL, HP, Shadow Slave (inferred) |
| 40 | 10-21 | Shared engine gaps and niche specialties across lives | DESIGNED | BF71-BF94 (round 4) | No all-world wave selected |
| 41 | 10-22 | Check shared docs are current with feature work | BUILT | `docs/reviews/SHARED_DOCS_RECONCILIATION_2026-10-22.md` | One-off |
| 42 | 10-22 | Implement all W1-W4 signature loops | PARTIAL | `docs/gm/dispatch/distinct-world-w1-w4-2026-10-22/CHECKPOINT.md`; `tests/institutions_records.test.js`; dirs `w3-*` | W1, W2, W4 final state not confirmed (inferred) |
| 43 | 10-22 | Implement fitting C7/C9/C10 ideas; more on mechanically different worlds | PARTIAL | `docs/research/additional-cultivation-2026-10-22/IMPLEMENTATION.md` | CWD1-CWD12 world laws and carriers are proposals |
| 44 | 10-22 | Base rules for every little UI thing (spacing scale and check) | BUILT | `styles/ui_tokens.css`; `tests/ui_contract_allowlist.json`; UR65 | Existing literals still migrating (allowlist still non-empty) |
| 45 | 10-22 | Control-height, layer, type tokens, literal migration, region lending UR69, UR41-64 compaction | PARTIAL | UR66-UR69 in `docs/UI_RULES.md`; commit 18ee8ef7 retired 8 allowlist entries | Migration unfinished; "visual-feel acceptance open" |
| 46 | 10-22 | Learn design choices from the Discord stuff | BUILT | UR59-UR64; `docs/audits/UI_DESIGN_CORE_AUDIT.md` | None |
| 47 | 10-23 | Rulebook for progression gates plus more to consider | STANDING | `docs/PROGRESSION_GATE_RULES.md` GTR1-GTR35 | Rules proposed; "adds no accepted decision" |
| 48 | 10-23 | Implement each gate item and other necessary rules (descriptor, herb lesson migration, inspector) | PARTIAL | PROGRESSION_GATE_RULES round 2; `src/skill_overflow_domain.js` | Inventory, overflow policy rows, Paradise tier slice stay proposals |
| 49 | 10-23 | Single-gain overflow depends on the world | BUILT | `docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md` GTL6; `src/skill_overflow_domain.js` | Row values proposed pending play |
| 50 | 10-23 | LOTM: each life, more pathways, regions, one slice at a time | BUILT | `src/book_world_lotm_lives.js`, `_pathways.js`, `_cities.js`, `_districts.js`; `tests/lotm_lives.test.js`; `lotm-lives-regions-2026-10-23/QUEUE.md` | Hostile Beyonder encounter, Sleepless, temptation cause not exercised; RI and OR documentation-only by his rule |
| 51 | 10-23 | Cheat implementations: expand base cheat, more modules, wire UI and engine | PARTIAL | `src/cheat_*.js`; `docs/CHEAT_LIBRARY.md` IM17-IM20 built slices | IM1-IM20 not all built (inferred) |
| 52 | 10-23 | Consider other cheats too, repeatable core audit | DESIGNED | `docs/audits/CHEAT_CORE_AUDIT.md` | Proposals |
| 53 | 10-23 | High-tier power (Gu rank 6, LOTM Seq 5, other worlds) | DESIGNED | `docs/HIGH_TIER_POWER_CONSIDERATIONS_2026-10-23.md` HTP1-HTP52 | No code, by his "early consideration only" |
| 54 | 10-23 | Build the itch.io leftovers: orphan, grief, came-of-age, genetics, companion wishes, diplomacy, schism, skill floor, spatial homes | PARTIAL | `src/life_events.js`, `companion_wishes.js`, `family_tree.js`, `lore_history_state.js`, `home_layout.js` | No skill-floor code found (grep `skill_floor` empty); diplomacy has no test (grep) |
| 55 | 10-23 | Run O1-O5 complementary journeys; check Claude chats | PARTIAL | `docs/gm/dispatch/complementary-journeys-2026-10-23/CHECKPOINT.md` | Numerical choices are proposals |
| 56 | 10-23 | Audit specific book worlds for gate cases | DESIGNED | `worlds/progression-gates-2026-10-23/`, GTR28-GTR35 | Research only |
| 57 | 10-23 | Reconcile claims and send scoped chats | BUILT | `docs/reviews/OVERARCHING_RECONCILIATION_2026-10-23.md` | One-off |
| 58 | 10-24 | First milestone not a gate; all ideas stay on the table; unplayed work must be shown | STANDING | `AGENTS.md` Scope; USER_VISION entry | Recorded |
| 59 | 10-24 | Source deep dives one world at a time: Re:Zero, Slime, Worm, others | PARTIAL | Cards in `docs/worlds/world-core-kit-2026-10-14/cards/` (re-zero, tensura, worm, perfect-run, super-supportive, you-are-summoned all exist) | NGNL deliberately held; cards are proposals |
| 60 | 10-24 | Potion requirements, higher sequences, all pathways, how to implement | PARTIAL | `docs/CRAFTING_ENGINE.md` rounds 8-12 (PZ1-PZ39); `src/book_world_lotm_brew.js`; potion-pathways checkpoint | "Implemented-unverified by Weibao"; Seq 1/0 gaps came from Chinese text proposals |
| 61 | 10-25 | Swap ingredients by trait in implementation (7 drops = 10 ml), every world | PARTIAL | CRAFTING_ENGINE round 12 (TSW1-TSW11); `src/craft_ingredient_selection.js`, `craft_material_fit.js`; G2 chat | Interchangeability breadth per world unproven |
| 62 | 10-25 | Download symbol vocab/pictures; save deep workflow for other worlds | PARTIAL | `docs/research/SOURCE_DEEP_DIVE_PLAYBOOK.md` DGF1-DGF10 (workflow built) | Symbol/picture download not verified |
| 63 | 10-25 | Systems register and mechanic-absorption workflow so fitting new things has fewer hoops | BUILT | `docs/SYSTEMS_REGISTER.md`, `docs/gm/MECHANIC_ABSORPTION_WORKFLOW.md`, skill `mechanic-absorption` | None |
| 64 | 10-25 | Implement all fitting missing mechanics from every saved reference audit | PARTIAL | `docs/gm/dispatch/reference-mechanics-2026-10-25/CHECKPOINT.md` | Each candidate needs a disposition; coverage not complete |
| 65 | 10-25 | Harry Potter first playable slices (entry, life, calendar, wand/spell practice, second life) | PARTIAL | `src/book_world_hp_content.js`, `world_packs/book_hp_life_data.js`; `hp-world-2026-10-25/CHECKPOINT.md` | "Maybe full world implementation" not reached |
| 66 | 10-25 | Far more potions; worlds too thin; shared mechanisms; trim pinning tests | PARTIAL | AD36 item 7; `docs/DEEP_WORLD_WORKFLOW_2026-10-19.md` rounds 4-5 | "No runtime wave authorized"; build order unchosen |
| 67 | 10-25 | Human gates optional, archive leftovers | STANDING | AD42; `AGENTS.md` Reporting | Recorded |
| 68 | 10-25 | Ability implementation rules for every world | DESIGNED | `docs/ABILITY_RULES.md` ABR1-ABR22 (proposed) | Not accepted |
| 69 | 10-25 | UI descriptions: narrative, effect-first, calculations secondary | STANDING | `docs/UI_RULES.md` UR70-UR75 | Recorded |
| 70 | 10-26 | Apply the description rules to current stat/trait tooltips, check in game | BUILT | `scripts/check_descriptions.mjs`, `tests/check_descriptions.test.js` | Coverage beyond stats/traits (items, actions) not verified |
| 71 | 10-26 | Install description build in normal app; push logo | BUILT | `docs/reviews/ui-descriptions-2026-10-25/APP_ADOPTION.md` | One-off |
| 72 | 10-26 | Depth goes to book worlds and menus; Frontier and Mistglass only test beds; nothing deleted | STANDING | `PROJECT.md` line 37; USER_VISION entry | Recorded |
| 73 | 10-26 | Prose quality: local AI drafting pass later | NOT STARTED | Only `docs/reviews/LOCAL_AI_WORK_AUDIT_2026-10-25.md` (O4) | No drafting pipeline (inferred) |
| 74 | 10-26 | UI that does not shift on menu open; better reports; missing item hover | PARTIAL | `docs/audits/UI_DESIGN_CORE_AUDIT.md` UIS1-UIS14; `src/ui/item_card.js` | Per-item completion not verified |
| 75 | 10-26 | Quality floor rules (absorption, execution), six lines binding | STANDING | AD43; `docs/GROUND_RULES.md`; `scripts/check_receipts.mjs` | Recorded and linted |
| 76 | 10-26 | Design-side rules so agents stop making mistakes | DESIGNED | IPC round 3; PRF1-PRF8 "proposed" in GROUND_RULES | Not accepted |
| 77 | 10-26 | Foundation rules: procedural, modular, language/stack | PARTIAL | IPC52-IPC65; FND1-FND5 proposed; `scripts/check_generators.mjs`; AD39 | Conformance count and cycle burn-down owner not found |
| 78 | 10-26 | Ground rules digest, PROJECT.md, coordinators, fulfil loose plans | BUILT | `docs/GROUND_RULES.md`; carry-out Q1-Q18 | Q14 duplicate instruction loading still open (this very file set loads the agreement twice) |
| 79 | 10-26 | Implement each Minecraft/cultivation/webnovel research lane, one chat each | PARTIAL | `gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/THREADS.json` | Lane completion unaudited (inferred) |
| 80 | 10-26 | Non-UI rule/workflow follow-through chat | BUILT | `gm/dispatch/non-ui-rules-follow-through-2026-10-26/RECEIPT.md` | PRF/FND not promoted |
| 81 | 10-26 | Mockup bench current and fleshed out; keep from falling behind | BUILT | `docs/MOCKUP_SYSTEM.md` MW8; `src/ui/preview/*` galleries | Signal/Folio unaccepted |
| 82 | 10-26 | Implement each detail: material foundations (PC27-43), cross-craft (PC23-26), connected making (PC1-6), ingredient substitution (PC7-14), lore sources (PC54-60) | PARTIAL | `docs/gm/dispatch/pc-groups-2026-10-26/*/implementation/` | Joined-gameplay gates "not alone proven"; per-group state differs |
| 83 | 10-26 | Reconcile everything into master, push, update normal app | BUILT | `gm/dispatch/master-reconciliation-2026-10-26/CHECKPOINT.md`, `APP_ADOPTION.md` | One-off |
| 84 | 10-26 | World entry rules for every world: crossing methods, child starts, later canon, lobby worlds | PARTIAL | `docs/WORLD_ENTRY_RULES.md` WER1-WER17; `src/book_world_lotm_entry.js` | Launch starts, era, method, host fields "proposed"; neutral "local who just died" crossing not implemented |
| 85 | 10-27 | Automated overnight development; Ctrl+ zoom scaling; prose rules for spoilers | DESIGNED | `MASTER_PLAYABILITY_PLAN` round 4 (ON1-10, ZM1-6, PR1-6) | Proposals; overnight loop later used manually (row 134) |
| 86 | 10-27 | Flesh out world-travel loop and idea bank; UI subtleties | DESIGNED | Round 5 (TL1-8, IB1-5, UT1-6) | Proposals |
| 87 | 10-27 | Expand base cheat; bigger LOTM world than Tingen; room for higher levels; skill depth | DESIGNED | Round 6 (BC, SC, HR, SK) | Proposals; no LOTM world beyond Tingen cities/districts built (inferred) |
| 88 | 10-27 | Village gameplay loop first (YAIR and Proto23 villages); coordinators clear backlog | BUILT | `gm/dispatch/village-loop-2026-10-27/VILLAGE_LOOP_CHECKPOINT.md`; `src/absorb_c2/local_life.js` | Relay needs the Eastern mill |
| 89 | 10-27 | GM chat plans loops, self-audits vision, uses advisor, uses Discord discourse | BUILT | `village-loop-2026-10-27/GM_PLAN.md` | Plan is proposals |
| 90 | 10-27 | Three worlds: Proto23, YAIR, our variant | PARTIAL | `src/proto23_world_content.js`, `proto23_world_state.js`, `proto23_world_host.js` | Faithful pack's standing scale mapping (WV1-12 open) |
| 91 | 10-27 | Proto23 as faithful port with credit; paste corc's reply into credits | PARTIAL | `src/proto23_world_host.js` credits (23html); USER_VISION entry | corc's reply text not shown in credits (not found); push waits for his yes |
| 92 | 10-27 | Red-team GM plan; per-world loops and identities; UI flow, dedicated world/cheat UI | DESIGNED | Round 9 (RT1-3, PW1-2, UF1-7) | Proposals |
| 93 | 10-27 | Overarching loop, how big-scope games do it, per-world rules | DESIGNED | Round 10 (OL, CP (unverified), WR1-WR10) | Not registered rules |
| 94 | 10-27 | AFK costs missed events; do NPCs reach out; VN and game precedents per world | PARTIAL | `docs/research/NPC_ABSENCE_AND_REACH_OUT_2026-10-27.md` (E1-8, N1-7); `src/away_ledger.js`, `src/return_digest_domain.js` | NPC reach-out: no code found |
| 95 | 10-27 | Many clocks, scoped to the life; Proto23 weekly dojo meal; LOTM hard clocks | PARTIAL | Same doc "many clocks"; `src/clock_owner.js`, `cast_schedule.js`, `tests/world_calendar.test.js` | Life-scoped clock filtering as a general model unconfirmed |
| 96 | 10-27 | Schedule not deadline unless canon-protagonist beat; plan playing as/beside the original protagonist | PARTIAL | `docs/research/CANON_PROTAGONIST_INTERACTIONS_2026-10-27.md`; `src/beat_ledger.js`, `beat_records.js` | Beside/bystander modes after the lead seat are later |
| 97 | 10-27 | Time-travel gimmicks; seeded markets so same items/events recur | DESIGNED | `docs/research/TIME_TRAVEL_AND_SEEDED_WORLDS_2026-10-27.md` (DT1, TT1-6, FS1) | First slice not found |
| 98 | 10-27 | Seeded NPC generation and engine-level decisions | PARTIAL | Part D (E1-12, C1-12); `src/world_pack_population.js`, `book_world_lotm_generated.js` | C1-C12 order not confirmed built |
| 99 | 10-27 | Inherent seeding; conceptual abilities (name erased erases a thing) | DESIGNED | `docs/research/CONCEPTUAL_ABILITIES_ENGINE_AUDIT_2026-10-27.md` (CAE-E1-8, `generated(kind,key)`) | No channel model or generated() API in `src/` (grep) |
| 100 | 10-27 | Workflow to follow up and consolidate all writeups | BUILT | `docs/gm/WRITEUP_REGISTER.md` | None |
| 101 | 10-27 | Canon protagonist: prior art, fanfic comparison, our influence on the MC, exposure to beats | DESIGNED | Canon protagonist doc Parts E-H | Proposals |
| 102 | 10-27 | Convert a book to a world by first playing its protagonist, then others | BUILT | AD44; `docs/gm/PROTAGONIST_LIFE_IMPLEMENTATION_PROMPT_2026-10-27.md`; `src/book_world_lotm_cast*.js` | None |
| 103 | 10-27 | Pilot on a real series (LOTM vol 1) | BUILT | `gm/dispatch/protagonist-life-2026-10-27/PLAN.md`; `tests/lotm_be_seat.test.js` | Seen only for volume 1 gameplay merge until M3 |
| 104 | 10-27 | Implement everything the book mentions; absorption rules | PARTIAL | WA22-WA24 accepted (`docs/WORLD_ABSORPTION_RULES.md`) | Presence ladder: no code (grep `presence.?ladder` empty) |
| 105 | 10-27 | Lead living his own life; sampled reading; details to absorb | BUILT | `LEAD_RUN_SCHEMA.md`; `scripts/lead_run/*` | WA25-WA31 later accepted |
| 106 | 10-27 | Lead bot; how info variants change play long term; prose surfaces; fill unstated blanks | PARTIAL | `scripts/lead_run/replay_metrics.mjs`, `tests/lead_replay_score.test.js` | Long-term info-variant bot comparison: not found; fills (merchant stock, places) only partly done (`QR6a` queue) |
| 107 | 10-27 | Events to the hour? reading cost; read-ahead; lead play flow UI; actions and loops | PARTIAL | PLAN rounds 5-6; `src/cast_journeys.js` | Hour precision SUPERSEDED by row 125; training/research loops for the lead not confirmed |
| 108 | 10-27 | Battles, stats from prose, ally system, gaps, codifying the book | PARTIAL | PLAN round 7; WA32-WA35; `src/conflict_frame.js`, `tests/conflict_frame.test.js` | Ally ledgers and prose-to-stat calibration are proposals (WA32-WA35 were proposals awaiting his yes; acceptance not confirmed) |
| 109 | 10-27 | Environment and events; NPC interactions; extrapolated merchant fills | PARTIAL | PLAN round 8; WA36-WA39; `src/cast_topic_talk.js` | Environment as keyed facts, four event kinds not verified in code |
| 110 | 10-27 | Seeded plus canon inventory layers; merchant inventory; more to pull from the book | PARTIAL | PLAN rounds 9-10; WA40-WA42; `src/shop_locks_domain.js` | Three-layer shop stock not found by name |
| 111 | 10-27 | Top-down relationship system from the book's choices | PARTIAL | WA43-WA44 (proposed); `src/ui/relationship_web.js` | Calibrated relationship derivation not found |
| 112 | 10-27 | Adopt session proposals as adjustable working direction | STANDING | `docs/gm/WRITEUP_REGISTER.md` 5b; `docs/LEAD_LIFE_RULES.md` | Recorded as register entry, not an AD line |
| 113 | 10-27 | Other systems top-down: money, household schedules, knowledge flow, law, danger | DESIGNED | PLAN round 11; WA45; `QR6` | Household schedule and danger-risk: no code by those names |
| 114 | 10-27 | UI for every system (how to give UI to everything) | PARTIAL | `docs/gm/dispatch/ui-coverage-2026-10-27/PLAN.md`; UR76-UR82 (proposed, in use as default per RULES_INDEX) | Per-system contracts not all built |
| 115 | 10-27 | Standards for things built many times (merchants, alchemists) | DESIGNED | PLAN round 12; WA46-WA47 proposed | Archetype registry not found (grep `archetype` hits only `harm_loops.js`) |
| 116 | 10-27 | Patch readers, optimize them, launch reading of LOTM vol 1 | BUILT | `scripts/lead_run/*`; READING_STATUS.md | Superseded by batch route |
| 117 | 10-27 | Raise reading ceiling; continue at new rate; cheaper lanes; local-AI test | BUILT | READING_STATUS, READING_HANDOFF; `scripts/lead_run/local_census_lane.py` | Local model results not verified |
| 118 | 10-27 | Batch API reading campaign for prime books, key kept in Keychain | BUILT | `scripts/lead_run/batch_submit.mjs`, `batch_collect.mjs`; `tests/lead_run_batch.test.js`; `gm/dispatch/batch-reading-2026-10-27/PLAN.md` | Keychain loading not grep-visible |
| 119 | 10-28 | Readers record everything, gaps after; haiku indexes, implementer reads cited paragraphs | STANDING | `batch-reading-2026-10-27/READINESS_AND_SCOPE.md` sections 11-12 | In dispatch doc, not a rulebook line |
| 120 | 10-28 | Build everything the lead's life needs; non-lead seats chosen later | PARTIAL | `CAST_LIVES_PLAN_2026-10-28.md` round 15; `PROJECT.md` priority 1 | Replay reachable share 10.0% of 11,159 steps (`LEAD_LIFE_GUIDE.md` 6) |
| 121 | 10-28 | Build mechanisms for reuse, not one world | STANDING, partly recorded | Plan round 16; CLR rules | No AD line (inferred) |
| 122 | 10-28 | Be-the-lead seat: whole interface takes the lead's perspective; hide "Open Continuing connection" | PARTIAL | `src/continuation_ui.js`, `src/ui/lives_figure.js`; `tests/lotm_be_seat.test.js` | I did not confirm the control is hidden in the seat |
| 123 | 10-28 | "Be the lead" is the main line, and the goal of every future world from readings | STANDING | AD44; `PROJECT.md` line 19 | Recorded |
| 124 | 10-28 | Scene-to-UI, cast-lives and Reports rules as binding defaults | STANDING | `docs/UI_RULES.md` SUI1-19, RPT1-12; CLR1-13 | Recorded |
| 125 | 10-28 | Fights and results follow the book in the lead's run; variance changes details only | PARTIAL | `src/book_world_lotm_host.js` (`canonActionDecision`); LSD61-LSD80 | Strain-on-anchor logging and divergence-pending: not confirmed |
| 126 | 10-28 | Step-based conflict frame beside the idle auto-battler, book text per step | PARTIAL | `src/conflict_frame.js` (structural runner), `tempo_fight.js`, `src/ui/combat_situation.js`; LSD81-LSD102 | Turn-based fight screen with book pack text not confirmed |
| 127 | 10-28 | Canon run forced; untaken options shown locked; open run later | PARTIAL | `canonActionDecision` refuses; LSD103-LSD125 | Open run NOT STARTED (deferred by him); windowed constraints partly in `src/constraint_store.js` |
| 128 | 10-28 | Other people need not have full lives; canon path for all, more opens on play | DESIGNED | LSD126-LSD155 | Proposals |
| 129 | 10-28 | Rules know built things are open to refactor | STANDING | AD45; GROUND_RULES | Recorded |
| 130 | 10-29 | Timings need not be exact to the hour | STANDING | `docs/LEAD_LIFE_RULES.md` line 35 | Recorded |
| 131 | 10-29 | Automate finishing LOTM overnight from one session in the primary checkout; replay the whole book through own controls | PARTIAL | `COORDINATOR_HANDOFF_2026-10-28.md` ON loop; `scripts/lead_run/replay_metrics.mjs` | Beats-in-order and emergent canon rate "not measured"; 3 of 1,196 great beats fully reached |
| 132 | 10-29 | LOTM reading covered entirely | BUILT | Volumes 2-8 read 2026-10-28; USER_VISION entry | Gameplay merge covers volume 1 until M3 |
| 133 | 10-29 | Codex agents implement; coordinator briefs, reviews, runs browser checks | STANDING | Handoff ON14 | Dispatch doc only |
| 134 | 10-29 | Mechanisms first; derive tags cheaply with local model, paid only for spot checks | PARTIAL | `scripts/lead_run/derive_step_tags.mjs`, `tests/lead_run_step_tags.test.js` | Script tags found 0 of 54 actor faults; residue tagging step 6 not run |
| 135 | 10-29 | Canon-holding default for lead; widen to emergent play, fate, butterfly effects | DESIGNED | LSD233-LSD245; guide 6 step 8 "Pull proper" | No pull input in resolver |
| 136 | 10-29 | Guide contradictions: grains vs steps, per-world curves, pressure dial, 1.5 reread, optional main goal | DESIGNED | `LEAD_LIFE_GUIDE.md` 7-8 | Curves and 1.5 reread are proposals |
| 137 | 10-29 | Write the lead-life rulebook, state rules are not absolute | BUILT | `docs/LEAD_LIFE_RULES.md` | None |
| 138 | 10-29 | Luminous Gothic as default look | BUILT | `src/main.js` (`customization_default==='luminous'`); `styles/ui_tokens.css` | Push was asked; not checked |
| 139 | 10-29 | UI refactors now in parallel sonnet lanes (seat seam, scene slots, figure primitive and gallery, rules in one place, snapshot routine) | PARTIAL | `gm/dispatch/ui-refactor-wave-2026-10-29/PLAN.md`; `src/ui/figure.js`, `src/ui/preview/figure_gallery.js` (uncommitted per git status) | Mount-on-first-open waits on freeze fix |
| 140 | 10-30 | Coarse gap pass over the entire book (all 8 LOTM vols), then other books | PARTIAL | `docs/research/READING_GAP_MAP_2026-10-28.md`; WA49; `IDEA_INDEX.md` QR6 | MoL, HP, Shadow Slave passes not confirmed |
| 141 | 10-30 | Shape seams on the whole read source, write it down for future books | STANDING | WA48 (accepted) | Recorded |
| 142 | 10-30 | Save all of this into something long term | BUILT | Gap map; `IDEA_INDEX.md` QR6-QR6e | None |
| 143 | 10-30 | Digitalize each character (stats, abilities, everything) | PARTIAL | WA50; `src/book_world_lotm_sheets.js`, `character_sheets.js`; QR6b | Queue open; volume 2 principals not entered |
| 144 | 10-30 | Use sibling book (COI) shape only to avoid rewiring | STANDING | WA48 fence | Recorded |
| 145 | 10-30 | Travel time real but not a big quality swing; per-world dial | DESIGNED | `docs/representations/TIME_AND_CHRONICLE.md` TC26; `MAPS_AND_TRAVEL.md` | Proposals; no dial in code (inferred) |
| 146 | 10-30 | HP overall plus part damage only where read; combat first (hit location, per-slot armour, aimed attacks) | PARTIAL | `src/harm_state.js` (hands, legs, eyes, voice); `BODY_AND_CONDITIONS.md` IM1-IM7 | Hit location, per-slot armour, aimed attacks: nothing in `src/` (grep) |
| 147 | 10-30 | Part damage shifts odds and strength by degree; shows in the action quote | PARTIAL | `harm_state.js` multipliers 0.9/0.75/0.5/0.2/0.1, block only at maimed | Quote line with cause not confirmed; only LOTM tingen world has a table |
| 148 | 10-30 | Consider sibling ideas for each idea | STANDING, partly recorded | `docs/representations/ABILITIES.md` Round 3; AGENTS.md "more to consider" | Not stated as a general rule in a rulebook |

Counts (148 rows): BUILT 46, PARTIAL 57, DESIGNED 21, NOT STARTED 1 (row 73), SUPERSEDED 1 (row 10), STANDING 22 (rows 13, 121, 148 are unrecorded or partly recorded). Row 23 is PARTIAL; its deferred separate start menu is the not-started part.

## Subtle aspects

- **Start screen** (10-20/10-21 launch entries): he asked for a quiet play screen, later a separate start menu "or come back to it". The deferred menu has no owner row, and the donation URL for Proto23 is still open.
- **Luminous Gothic** (10-29): the pastel/glow appeal was the point. The default flips only for untouched Neutral saves via `customization_default`; confirm no player with a deliberate Neutral choice lost it.
- **Home system** (10-21): "different starts, nonhuman homes, birds without unnecessary purchases." Built, but he kept the original PLAY screen unchanged. Check no start picker leaked onto it.
- **Gear** (10-20): "just implement them all" for stat dimensions. The sourced pipeline exists, but chemistry, energy and power lifetimes are still unbuilt, which flattens "energy and superpowers" to parts and affixes.
- **Overflow** (10-23): "depend on the world". Only worlds with a table row differ; unlisted worlds lose the excess silently by design, which can read as a single global rule.
- **Tooltips** (10-25/26): "describe what it does, calculations in details". Checked for stats and traits only; items, actions, conditions share the rule but their coverage is unproven.
- **Canon run** (10-28/29): forced canon run was narrowed twice (locked untaken options, then "not absolute", default for lead only). A build that treats forced canon as global would flatten his "widen later into emergent play and fate" intent. Pull is not in the resolver yet.
- **Timing** (10-27 vs 10-29): "events to the hour?" was answered by "need not be exact". Reader tags with hour fields may still be chased.
- **Injuries** (10-30): "middle path, not gapped": odds shift by degree; block only at the extreme rung. `harm_state.js` follows this, but only for the LOTM Tingen world and no combat hit location yet, so the "combat first" part is missing.
- **Be the lead** (10-28): whole interface as the lead's perspective; meta controls hidden. Cannot confirm the "Open Continuing connection" hide from tests alone.

## Biggest gaps (ranked by strength and repetition of ask)

1. **Canon pull, fate, emergent play and butterfly effects** (rows 127, 135, 136): asked in four entries, still DESIGNED. No pull input in the keyed resolver.
2. **Whole-book replay so the lead can follow every option** (rows 120, 131): asked repeatedly. Reachable share 10.0%; beats-in-order and emergent canon rate unmeasured.
3. **Combat hit location and per-slot armour** (rows 146, 147): his "combat first" consumer for part damage. Nothing in `src/`.
4. **High-tier power, bigger LOTM world, cheat growth** (rows 53, 87, 51): asked as "no room for higher levels". DESIGNED only.
5. **Seeded content and conceptual abilities** (rows 97, 99): time travel, seeded markets, name-erasing abilities. DESIGNED, no first slice.
6. **Local-AI prose pass and local AI playing** (rows 15, 73): both asked more than once. NOT STARTED or only local census lane.
7. **Top-down relationships, merchant stock layers, shared archetypes** (rows 111, 110, 115): proposals without code by name.
8. **World entry per world: neutral crossing, era, host body, start list** (row 84): he called the neutral crossing "nice"; still unimplemented.
