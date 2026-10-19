# L5 report: rule-code collisions (X6), 2026-10-19

Scope: docs only. Nothing under `src/`, no USER_VISION, PROJECT or IDEA_INDEX edits; nothing staged or committed. Edits were scripted, hunk-level and applied to the live files; other sessions have uncommitted changes in several of the same files, so review `git diff` per file before committing.

## 1. Reserved-prefix rule

Added `## Reserved prefixes (2026-10-19)` to `docs/RULES_INDEX.md` (one hunk before "Changing this index"; the line-32 change from the other session is untouched). It reserves AD, UR, AR, MR, SR, AU, GR, CX, WA, BHR, CBR, ECR, SLR, PIR, T and "Rulebook", requires a distinct prefix or doc-qualified form for local tables, and sets the cross-file citation form `<file-stem>#<code>`. It does not rename any registered code.

## 2. Renames (old -> new; a "refs" count is occurrences after the rename)

| Old local table | New | Defining doc | Files / refs now |
|---|---|---|---|
| CX1-CX20 cheats that reveal | ICX | INTRO_FLOW; cards in canon-events cxcards (JSON ids), COMIC_WORLDS_AND_MEDIUM and COMIC_WORLDS_STARTS citations, start-sources comics prompt and checkpoint | 9 / 104 |
| CX1-CX35 engine cheats | ECX | ENGINE_RUNTIME_PERFORMANCE; matrix, ENGINE_AWARE_CHEATS_SOURCES, ER15/ER16/ER18, inventories, T02_ENGINE_RETURN | 16 / 280 |
| CX1-CX22 making cheats | PCX | PROCEDURAL_CRAFTING; procgen CR5.md, cr5/*, cr6/KNOWLEDGE | 9 / 72 |
| CX1-CX12 comic cheats | CCX | COMIC_WORLDS_STARTS_AND_BRANCHES | 1 / 21 |
| CX1-CX6 cross-world probes (7th meaning, not in D1) | XWC | gm/CROSS_WORLD_DETAIL_REVIEW; GAP_REVIEW, FOUNDATION_LEDGER, FOUNDATIONS_DIALOGUE plan, world-depth 03, PAUSED_HANDOFF | 6 / 23 |
| GR1-GR8 grammar effects | PGR | PRESENTATION_AND_FOURTH_WALL; idea-expansion review REPORT and REQUIREMENTS.json | 3 / 12 |
| GR1-GR22 UI game patterns | UGR | UI_AT_SCALE | 1 / 30 |
| GR1-GR12 lane U1 proposals (doc already used the name U1-GR) | U1-GR | ui-at-scale dispatch (4 files) | 5 / 72 |
| GR1-GR11 reference mechanics | TGR | TECHNOLOGY_AND_PROGRESSION; research-tech dispatch, rimworld deep pass | 11 / 41 |
| GR1-GR16 other-selves games | OGR | research/GAMES_OTHER_SELVES; INTRO_FLOW, INTRO_AND_STARTS_INDEX, START_MICRO_DETAILS, start-sources games | 6 / 162 |
| GR1-GR16 maker-art games (extra) | MGR | maker-arts OTHER_ARTS, W6_REPORT | 2 / 18 |
| SR1-SR10 start records | ISR | INTRO_FLOW; INTRO_AND_STARTS_INDEX, start-records GOAL, NONHUMAN_START_SPECS, START_AS_TRASH_NOBLE, VILLAIN_STARTS, paradise-hub (2) | 8 / 58 |
| SR1-SR4 scale regimes | MSR | MODULAR_PRODUCTION_CHAINS; modular-chains PC4, pc4, pc5 | 5 / 22 |
| SR1-SR5 social reading | BSR | GENETICS_CONSTITUTIONS_AND_BROOD_PLAY; body-lineage dispatch (b1 world fits, b5 BORROW) | 74 / 87 |
| SR1-SR4 sacred tech | TSR | TECHNOLOGY_AND_PROGRESSION; research-tech t2/t3 | 3 / 7 |
| SR1-SR15 simple rules (extra) | ASR | worlds/ABILITY_AUTHORING; NONHUMAN_ABSTRACTIONS_NEEDED | 2 / 22 |
| AU1-AU6 authoring | IAU | INTRO_FLOW; INTRO_AND_STARTS_INDEX | 2 / 11 |
| AU1-AU5 automation | PAU | PROCEDURAL_CRAFTING; procgen CR3, cr3/*, crafting-lanes P28, modular-chains pc4 | 9 / 44 |
| AD1, AR1, AU1 story rows | PS-AD1, PS-AR1, PS-AU1 | PROCEDURAL_STORY; procgen P33, p33/*, P28, p28/*, p32 PLAY_LOGS | 13 / 75 |
| MR1-MR13 procedural rules | MMR | MODULAR_PRODUCTION_CHAINS; modular-chains PC2, pc2/* | 4 / 55 |
| MR1-MR7 paper trail | TMR | TECHNOLOGY_AND_PROGRESSION | 1 / 8 |
| AR1-AR8 access rows, AU1-AU4 | CCH-AR, CCH-AU | CONTINUATION_CHOICE_CONSIDERATION; body-health B1 line 66 | 2 / 20 |
| AR1-AR7 slices | WD23-AR | world-depth 23_DEEPER_SYNTHESIS | 2 / 20 |
| Weaponcraft MAKER_ARTS: WC, RN, OV, IM, AB, SB, OM, AR | MKR-<old> | WEAPONCRAFT_RUNES_AND_MAKER_ARTS | 1 / 114 |
| Weaponcrafting INSCRIPTION dup: WW, SB, OV, AB, IM, OM | WFI-<old> | WEAPONCRAFTING_RUNES_AND_INSCRIPTION | 1 / 67 |
| Weaponcrafting REVEAL: WC, RN, OV, IM | REV-<old> | WEAPONCRAFTING_RUNES_AND_REVEAL | 1 / 35 |

The canonical weaponcraft palette keeps its bare codes. Each renamed defining doc has a dated "Codes renamed 2026-10-19" line under its title. Heading-slug anchors that changed (53 headings) were updated in every referencing doc; no link is newly broken. Family-name words in headings and prose (for example "### SR: how a start record...") were renamed with the codes. The cxcards file name `CX_CHEAT_CARDS.json` is unchanged (ids inside it are now ICX1-ICX12); the old CX remains in that file name and in prose that quotes the old-to-new note lines.

D3 duplicates (SU3, NX1-NX10, OM3, WT2, IL12, CW3): per D3-F1 "no mass renaming", these use the doc-qualified citation form. A "Code namespace 2026-10-19 (no codes renamed)" line was added to 12 docs: NONHUMAN_SENSES_SCALE_AND_UI, skyrim/SOURCE_LEDGER, world-depth 06, 21, 24, NONHUMAN_STARTS_BY_WORLD, WORLD_CORE_KIT, WORLD_CORE_KIT_AUDIT_PLAYBOOK, IDENTITY_LAWS_BY_WORLD, world-depth 31, NONHUMAN_STARTS_ENGINE_REQUIREMENTS, W16_COMIC_WORLDS. CONTINUATION_CHOICE's OM3/WT2 got the same cite-form line in its rename note.

## 3. Left alone, with reasons

- Registered sets (CX1-CX8, GR1-GR17, SR1-SR24, AU1-AU15, MR1-MR36, AR1-AR16, AD1-AD38, UR, BHR, CBR, ECR, SLR, PIR, WA): untouched, including every bare citation of them (for example world-pack-loader, SUBSYSTEM_SCOPE_LADDERS, GENETICS_AND_HERO_START_PLAN, MODULAR_PRODUCTION line 567 "MR5/MR29").
- Protected files that still cite local sets by old code (not edited per brief): USER_VISION lines 2202/2205 (ASR), 2448 (ISR), 2577 (IAU), 2661 (UGR), 2838/2908/2932 (ICX), 2914 (MKR-AR), 3987 (CCH-AU/CCH-AR); IDEA_INDEX lines 74 (UGR) and 229 (BSR); PROJECT has none. USER_VISION 4169/4206 AR1-AR11 (LOTM audit rules) stay, per T7.
- Not renamed because they are a different local scheme with no registered-prefix problem or are lane-coded by design: minecraft audit `SR_SPELLS.md` and `ASSIGNMENT.md` (lane prefixes by instruction), world-core-kit `W7_REPORT` SR1-SR3 source rows, `PANEL_DESIGN_ABSORPTION` SR1-SR3, part-9 SR1-SR3 scenarios inside the CX owner doc, cheats-sfx AUTHORING_ADAPTERS AU1-AU8 (and the many "AU3/AU7" lane briefs), research qud/taiwu/format AU rows, `ui-foundation` NX1-NX14 (owner of NX), ENGINE_EXPANSION NX10, other-purpose OM/WT/IL/CW/SU/NX families listed in the D3 namespace lines.
- Other procgen crafting-lane files that say "crafting AU" or "root AU1-AU5" in p30, p36, p37, p39, p40 and maker-arts ITEM_LIFETIMES: bare citations still read as PAU; not renamed to avoid mis-hitting unrelated AU uses (alternate-universe "AU" in INTRO_FLOW 289/856 and COMIC_MEDIUM 180 kept).
- Maker-arts dispatch lane files, MAKER_ARTS_BY_WORLD and the procgen WR1-WR4 REVEAL lane briefs cite WC/RN/OV/IM/AB/SB/OM bare; the MKR- note in MAKER_ARTS says bare codes in maker-arts lane files mean MKR-. They were not rewritten (high mis-hit risk against CHEAT_LIBRARY AB and others).
- Other `CX`/`GR`/`SR` readings in 700+ dispatch history files were not individually audited; only citations attributable to a renamed defining doc by file link, lane root or explicit "root/intro/technology" wording were changed.
- `src/` references (read-only): `src/world_pack_loader.js`, `world_pack_manifest.js`, `world_pack_population.js` cite CX1-CX8 and GR codes (registered meanings, no change needed); `src/craft_*.js`, `world_pack*.js` cite GR1-GR17 (registered). No src comment cites a renamed local code.
- Renamed-code anchors in protected files: none found.

## 4. Sealed-secret IDs (report only; nothing opened, moved or renamed)

- `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md` (standard rule, about lines 103-135) tells agents to name secrets "S1 to S4" per world, and to keep original-world sealed notes in `docs/worlds/<world>/sealed/` plus a sealed data file in `src/`.
- Verified: no `docs/worlds/*/sealed/` directory exists; no file in `src/` is named sealed; the only tracked `sealed/` path is `docs/gm/dispatch/procgen-2026-10-13/p5/sealed/` (one file); `.gitignore` has no sealed rule. So there is no registry of real IDs to check, and a bare "S2" also names ordinary rows in at least 4 worlds docs plus an INTERFACE revision in original-frontier/ABILITIES.
- Proposed fix (needs Weibao): (1) define the ID form `<worldId>:S<n>` in WORLD_SECRETS_AND_DISCOVERY as the single owner, so "S2" alone is never a secret ID; (2) state in the same place that no registry exists yet and where the first one lands (for example a gitignored `docs/worlds/<world>/sealed/` plus a `sealed` key in the world pack); (3) leave ordinary S-rows alone; (4) existing reports that use bare S-IDs get rewritten only when Weibao approves, since renaming secret IDs is his call.

## 5. Checks run

- `npm run check:rules`: baseline PASS before edits; one expected FAIL while this file was missing; rerun after writing this file (see end of task message).
- Old-code residual scan over every file in the rename specs: only registered-meaning citations remain (AD38/AD16 etc., GR in generation-citing lanes, MR5/MR29, AR in body-health B1).
- New-broken-link scan over all touched `.md` files and all inbound links to changed headings: 0 new broken file links, 0 new broken anchors (53 changed headings, 6 inbound files updated).
- No `check:links` script exists in package.json; the link scan above is a local script (not committed).
- Not run: `npm test` (docs only, no runtime change).

## 6. Files edited (188)

- `docs/COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md`
- `docs/ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md`
- `docs/GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md`
- `docs/INTRO_AND_STARTS_INDEX_2026-10-14.md`
- `docs/INTRO_FLOW_CONSIDERATIONS_2026-10-13.md`
- `docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md`
- `docs/PRESENTATION_AND_FOURTH_WALL.md`
- `docs/PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md`
- `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md`
- `docs/TECHNOLOGY_AND_PROGRESSION.md`
- `docs/UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md`
- `docs/WEAPONCRAFTING_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md`
- `docs/WEAPONCRAFTING_RUNES_AND_REVEAL_CONSIDERATIONS_2026-10-14.md`
- `docs/WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md`
- `docs/gm/CROSS_WORLD_DETAIL_REVIEW.md`
- `docs/gm/cross-audit-reconciliation-2026-10-15/T02_ENGINE_RETURN.md`
- `docs/gm/dispatch/body-health-2026-10-17/B1_OWNERS_AND_ENGINE.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_a-novel-concept.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_a-will-eternal.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_archive.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_bay-city.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_beyond-timescape.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_bleach.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_borrowed-floodwarden.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_chainsaw-man.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_circle-of-inevitability.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_concord-waymarks.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_cradle.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_crucible.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_dnd.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_dreaming.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_elden-ring.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_fallout.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_fate.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_fated-villain.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_fog-city.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_folded-glasshouse.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_frieren.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_fullmetal-alchemist.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_genetic-ascension.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_goa.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_gu-wilds.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_harry-potter.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_hunter-x-hunter.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_i-shall-seal-heavens.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_jujutsu.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_kairos.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_kenshi.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_labyrinth-mad-god.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_lantern-compact.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_legendary-mechanic.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_lord-of-mysteries.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_many-door-observatory.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_mother-of-learning.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_naruto.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_omniscient-reader.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_orchard-city.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_original-frontier.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_paradise-hub.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_perfect-run.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_proto23.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_proving-ground.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_red-basin.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_regressors-tale.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_renegade-immortal.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_reverend-insanity.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_saltworks.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_salvage-reach.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_second-coming-gluttony.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_service-hub.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_shadow-slave.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_shatterreach.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_skyrim.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_soldiers-life.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_solo-leveling.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_speedrunning-multiverse.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_tidemark.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_travelers-gate.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_ttks-annual-traits.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_ttks-border-inspector.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_ttks-humanitys-heir.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_ttks-jjk-challenge.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_ttks-mimic.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_wandering-inn.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_warlock-magus-world.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_wish-upon-stars.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_worm.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_you-are-summoned.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b1/WORLD_you-have-died-again.md`
- `docs/gm/dispatch/body-lineage-2026-10-14/b5/BORROW.md`
- `docs/gm/dispatch/canon-events-2026-10-14/cxcards/CHECKPOINT.md`
- `docs/gm/dispatch/canon-events-2026-10-14/cxcards/CX_CHEAT_CARDS.json`
- `docs/gm/dispatch/canon-events-2026-10-14/cxcards/NOTES.md`
- `docs/gm/dispatch/canon-events-2026-10-14/runs/cxcards.prompt.md`
- `docs/gm/dispatch/cross-world-rulebook-expansion-2026-10-12/GAP_REVIEW.md`
- `docs/gm/dispatch/engine-runtime-2026-10-14/COMMON.md`
- `docs/gm/dispatch/engine-runtime-2026-10-14/ER15/REPORT.md`
- `docs/gm/dispatch/engine-runtime-2026-10-14/ER16/REPORT.md`
- `docs/gm/dispatch/engine-runtime-2026-10-14/ER18/inventory-body.md`
- `docs/gm/dispatch/foundation-completion-2026-10-12/FOUNDATION_LEDGER.md`
- `docs/gm/dispatch/idea-expansion-2026-10-11/review/REPORT.md`
- `docs/gm/dispatch/idea-expansion-2026-10-11/review/REQUIREMENTS.json`
- `docs/gm/dispatch/maker-arts-2026-10-14/OTHER_ARTS.md`
- `docs/gm/dispatch/maker-arts-2026-10-14/W6_REPORT.md`
- `docs/gm/dispatch/modular-chains-2026-10-14/PC2.md`
- `docs/gm/dispatch/modular-chains-2026-10-14/PC4.md`
- `docs/gm/dispatch/modular-chains-2026-10-14/pc2/CHECKPOINT.md`
- `docs/gm/dispatch/modular-chains-2026-10-14/pc2/REPORT.md`
- `docs/gm/dispatch/modular-chains-2026-10-14/pc4/CHECKPOINT.md`
- `docs/gm/dispatch/modular-chains-2026-10-14/pc4/REPORT.md`
- `docs/gm/dispatch/modular-chains-2026-10-14/pc5/REPORT.md`
- `docs/gm/dispatch/procgen-2026-10-13/CR3.md`
- `docs/gm/dispatch/procgen-2026-10-13/CR5.md`
- `docs/gm/dispatch/procgen-2026-10-13/P28.md`
- `docs/gm/dispatch/procgen-2026-10-13/P33.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr3/AUTOMATION.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr3/CHECKPOINT.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr3/MORE.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr3/REPORT.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr5/CHEATS_FOR_MAKING.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr5/CHECKPOINT.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr5/MORE.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr5/MORE_COMIC_MAKING.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr5/REPORT.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr5/SOURCED_CHECK.md`
- `docs/gm/dispatch/procgen-2026-10-13/cr6/KNOWLEDGE.md`
- `docs/gm/dispatch/procgen-2026-10-13/crafting-lanes/P28-crafting-draft.md`
- `docs/gm/dispatch/procgen-2026-10-13/p28/MORE.md`
- `docs/gm/dispatch/procgen-2026-10-13/p28/REPORT.md`
- `docs/gm/dispatch/procgen-2026-10-13/p28/TASTE.md`
- `docs/gm/dispatch/procgen-2026-10-13/p32/PLAY_LOGS.md`
- `docs/gm/dispatch/procgen-2026-10-13/p33/CALENDAR.md`
- `docs/gm/dispatch/procgen-2026-10-13/p33/CHECKPOINT.md`
- `docs/gm/dispatch/procgen-2026-10-13/p33/DEFEAT_ARCS.md`
- `docs/gm/dispatch/procgen-2026-10-13/p33/MORE.md`
- `docs/gm/dispatch/procgen-2026-10-13/p33/REPORT.md`
- `docs/gm/dispatch/research-tech-2026-10-14/PLAN.md`
- `docs/gm/dispatch/research-tech-2026-10-14/T3.md`
- `docs/gm/dispatch/research-tech-2026-10-14/t2/worlds/ttks-heir-humanity.md`
- `docs/gm/dispatch/research-tech-2026-10-14/t3/CHECKPOINT.md`
- `docs/gm/dispatch/research-tech-2026-10-14/t3/GAMES.md`
- `docs/gm/dispatch/research-tech-2026-10-14/t3/REPORT.md`
- `docs/gm/dispatch/research-tech-2026-10-14/t5/REFERENCES.md`
- `docs/gm/dispatch/start-records-2026-10-13/GOAL.md`
- `docs/gm/dispatch/start-sources-2026-10-14/comics/CHECKPOINT.md`
- `docs/gm/dispatch/start-sources-2026-10-14/games/CHECKPOINT.md`
- `docs/gm/dispatch/start-sources-2026-10-14/runs/comics.prompt.md`
- `docs/gm/dispatch/start-sources-2026-10-14/runs/games.prompt.md`
- `docs/gm/dispatch/ui-at-scale-2026-10-14/GAME_REFERENCES.md`
- `docs/gm/dispatch/ui-at-scale-2026-10-14/SURFACE_INVENTORY.md`
- `docs/gm/dispatch/ui-at-scale-2026-10-14/U1_REPORT.md`
- `docs/gm/dispatch/ui-at-scale-2026-10-14/runs/U1.last.md`
- `docs/gm/dispatch/world1-full-completion-2026-10-11/PAUSED_HANDOFF.md`
- `docs/research/ABSTRACTION_INVENTORY_2026-10-14.md`
- `docs/research/CHEAT_ENGINE_CAPABILITY_MATRIX_2026-10-14.md`
- `docs/research/COMIC_WORLDS_ENGINE_FIT_2026-10-14.md`
- `docs/research/ENGINE_AWARE_CHEATS_SOURCES_2026-10-14.md`
- `docs/research/GAMES_OTHER_SELVES_AND_VILLAIN_PLAY_2026-10-14.md`
- `docs/research/rimworld/pass-2026-10-14-deep/ANOMALY.md`
- `docs/research/rimworld/pass-2026-10-14-deep/IMPLEMENTATION_PACKETS.md`
- `docs/research/rimworld/pass-2026-10-14-deep/REPORT.md`
- `docs/research/rimworld/pass-2026-10-14-deep/aspects-2026-10-14/DEEPER_SYSTEMS.md`
- `docs/reviews/DEDUP_AUDIT_2026-10-18/L5_REPORT.md`
- `docs/reviews/FOUNDATIONS_DIALOGUE_AND_ABSORPTION_PLAN_2026-10-12.md`
- `docs/worlds/ABILITY_AUTHORING.md`
- `docs/worlds/COMIC_WORLDS_STARTS_AND_BRANCHES_2026-10-14.md`
- `docs/worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md`
- `docs/worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md`
- `docs/worlds/NONHUMAN_ABSTRACTIONS_NEEDED_2026-10-14.md`
- `docs/worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md`
- `docs/worlds/NONHUMAN_STARTS_BY_WORLD_2026-10-14.md`
- `docs/worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md`
- `docs/worlds/NONHUMAN_START_SPECS_2026-10-14.md`
- `docs/worlds/START_AS_TRASH_NOBLE_LESSONS_2026-10-14.md`
- `docs/worlds/START_MICRO_DETAILS_2026-10-14.md`
- `docs/worlds/VILLAIN_STARTS_AND_OTHER_SELVES_2026-10-14.md`
- `docs/worlds/WORLD_CORE_KIT_2026-10-14.md`
- `docs/worlds/WORLD_CORE_KIT_AUDIT_PLAYBOOK.md`
- `docs/worlds/paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md`
- `docs/worlds/paradise-hub/CANON_PRIORITY_PLAN_2026-10-14.md`
- `docs/worlds/skyrim/SOURCE_LEDGER.md`
- `docs/worlds/world-core-kit-2026-10-14/W16_COMIC_WORLDS.md`
- `docs/worlds/world-depth-2026-10-13/03_BLEACH_NARUTO_ELDEN_RING.md`
- `docs/worlds/world-depth-2026-10-13/06_CROSS_WORLD.md`
- `docs/worlds/world-depth-2026-10-13/21_RENOWN_AND_SUBTLE.md`
- `docs/worlds/world-depth-2026-10-13/23_DEEPER_SYNTHESIS.md`
- `docs/worlds/world-depth-2026-10-13/24_TITLES.md`
- `docs/worlds/world-depth-2026-10-13/31_INNER_LIFE_HOUSEHOLD_COMMUNITY.md`
