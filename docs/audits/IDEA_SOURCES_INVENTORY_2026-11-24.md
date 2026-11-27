# Idea sources inventory, 2026-11-24

**Status:** source inventory and port proposal just (AD32). No ideas were ported, adopted, or copied from private material.

## Summary

- Atlas registry snapshot at write time: 3,994 idea boards, 99,383 coded idea rows; 228 registered boards are the reference tier (registry sweep).
- Unregistered repository boards with 10+ parsed rows: **1,905 files / 70,133 rows**. Many are mixed documents; filenames and titles that look like run outputs or audits are flagged for triage.
- The registry already scans eligible `docs/**/*.md` recursively except `private/`, `docs/research/novels/`, and its own sweep report. This is a list of unregistered boards, not evidence that every row is a distinct original idea.
- All “about OOPS” judgments below mean the source is in this OOPS repository or explicitly framed for OOPS; they do not imply an accepted design decision.

## In-repo unregistered idea boards (10+ parsed rows)

Parser: `readIdeas()` from `prototypes/world-atlas/ideas.mjs`; unregistered means `tier !== registered`. Ranked by parsed idea-row count. Description is the parser board title, shortened just by its source title. “Audit/output likely” is a filename/title heuristic requiring manual review. File size and modified date are local metadata, not source chronology; date span is the earliest/latest ISO date found in filename or contents and can include cited history.

| Rank | Rows | File | Size | Date span | One-line description | OOPS? | Triage |
|---:|---:|---|---:|---|---|---|---|
| 1 | 889 | `docs/worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md` | 187.5 KiB | 2026-10-07–2026-10-14 | V. Game features as unlocks, tools and cheats (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 2 | 593 | `docs/prose/PROSE_REWRITE_BACKLOG.md` | 111.0 KiB | mtime 2026-11-11 (no embedded date) | Prose rewrite backlog | Yes (OOPS repo) | Idea board or mixed source |
| 3 | 554 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r9/DEDUPE_TABLE.md` | 161.2 KiB | 2026-10-13–2026-10-14 | Part 22 sections 8-20: per-row dedupe table | Yes (OOPS repo) | Audit/run output likely |
| 4 | 530 | `docs/worlds/world-core-kit-2026-10-14/W7_MICRO_BY_WORLD.md` | 97.0 KiB | 2026-10-10–2026-10-14 | W7: micro tables by world (2026-10-14, considerations) | Yes (OOPS repo) | Idea board or mixed source |
| 5 | 482 | `docs/gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md` | 223.4 KiB | 2026-10-15–2026-11-03 | Lead-life systems: top-down design (2026-10-28) | Yes (OOPS repo) | Idea board or mixed source |
| 6 | 468 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-s/OUTPUT.md` | 68.8 KiB | 2026-10-14–2026-10-14 | TW-S: little stuff, routed | Yes (OOPS repo) | Audit/run output likely |
| 7 | 461 | `docs/GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md` | 581.9 KiB | 2026-10-23–2026-11-16 | Gu abilities and killer moves: considerations (2026-11-10) | Yes (OOPS repo) | Idea board or mixed source |
| 8 | 400 | `docs/audits/gap-audit-2026-10-30/research_cov.md` | 89.1 KiB | 2026-10-06–2026-11-04 | Research implementation packets: build coverage vs OOPS code | Yes (OOPS repo) | Audit/run output likely |
| 9 | 397 | `docs/worlds/world-core-kit-2026-10-14/W21_READINESS_K19_K34.md` | 89.6 KiB | 2026-10-10–2026-10-14 | W21: K19-K34 readiness per priority world (2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 10 | 346 | `docs/gm/dispatch/protagonist-life-2026-10-27/CAST_LIVES_PLAN_2026-10-28.md` | 153.8 KiB | 2026-10-26–2026-10-29 | Cast lives: turning the reading index into living actors (plan, 2026-10-28) | Yes (OOPS repo) | Idea board or mixed source |
| 11 | 335 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r2/REPORT.md` | 80.7 KiB | 2026-10-13–2026-10-14 | R2: source and owner reconciliation | Yes (OOPS repo) | Audit/run output likely |
| 12 | 311 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/census.md` | 96.3 KiB | 2026-10-15–2026-10-15 | CN: Part 0 control and symbol census, 2026-10-15 | Yes (OOPS repo) | Audit/run output likely |
| 13 | 304 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r9/INTEGRATION.md` | 59.7 KiB | 2026-10-14–2026-10-14 | R9 integration routes | Yes (OOPS repo) | Audit/run output likely |
| 14 | 283 | `docs/worlds/world-core-kit-2026-10-14/W1_READINESS.md` | 63.7 KiB | 2026-10-10–2026-10-14 | W1: priority-world readiness, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 15 | 276 | `docs/PROCEDURAL_FOUNDATION_PLAN.md` | 85.5 KiB | 2026-11-11–2026-11-16 | Procedural foundation plan | Yes (OOPS repo) | Idea board or mixed source |
| 16 | 258 | `docs/research/royal-road-2026-10-10/IDEAS.md` | 103.1 KiB | 2026-10-07–2026-10-10 | Royal Road ideas, 2026-10-10 | Yes (OOPS repo) | Idea board or mixed source |
| 17 | 255 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/round-15-whole-plan.md` | 135.5 KiB | 2026-10-02–2026-11-04 | Round 15: whole-plan pass and iteration rounds R15+, 2026-10-16 | Yes (OOPS repo) | Idea board or mixed source |
| 18 | 238 | `docs/worlds/START_MICRO_DETAILS_2026-10-14.md` | 44.8 KiB | 2026-10-13–2026-10-14 | Start micro details, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 19 | 231 | `docs/research/SOURCE_DEEP_DIVE_QUEUE_2026-10-24.md` | 73.6 KiB | 2026-10-04–2026-10-29 | Source deep dive queue (2026-10-24, proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 20 | 226 | `docs/worlds/TTKS_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 79.3 KiB | 2026-10-10–2026-10-24 | TTKS: institutions, roles and subtle details, plus floor card (pass, 2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 21 | 225 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/cheat-refs.md` | 91.6 KiB | 2018-03-02–2026-10-16 | CR: cheat references and identity look catalog | Yes (OOPS repo) | Idea board or mixed source |
| 22 | 223 | `docs/worlds/NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md` | 64.1 KiB | 2026-10-13–2026-11-04 | Nonhuman starts: engine requirements and more (2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 23 | 219 | `docs/gm/dispatch/refinement-audits-2026-10-31/UI_FEEDBACK_AUDIT_RECEIPT.md` | 289.1 KiB | 2026-10-10–2026-11-01 | UI feedback and feature-surface audit, 2026-10-31 | Yes (OOPS repo) | Audit/run output likely |
| 24 | 219 | `docs/gm/dispatch/ui-at-scale-2026-10-14/SURFACE_INVENTORY.md` | 91.6 KiB | 2026-10-02–2026-10-14 | U5 surface inventory and plan stress test | Yes (OOPS repo) | Audit/run output likely |
| 25 | 215 | `docs/gm/dispatch/protagonist-life-2026-10-27/PLAN.md` | 155.0 KiB | 2026-10-11–2026-10-27 | Protagonist-life pipeline: plan pass (step 1), 2026-10-27 | Yes (OOPS repo) | Idea board or mixed source |
| 26 | 211 | `docs/gm/dispatch/companions-2026-10-14/MICRO_BEHAVIOUR.md` | 50.5 KiB | 2026-10-14–2026-10-14 | C9: real animal micro-behaviour as text cues | Yes (OOPS repo) | Idea board or mixed source |
| 27 | 209 | `docs/RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md` | 50.1 KiB | 2026-10-09–2026-10-15 | Rulebooks for world building, and do we need a game master | Yes (OOPS repo) | Idea board or mixed source |
| 28 | 203 | `docs/research/itch-io-2026-10-22/CULTIVATION_ABSORPTION_CHECK.md` | 66.9 KiB | 2026-10-22–2026-10-24 | Cultivation reference absorption check | Yes (OOPS repo) | Idea board or mixed source |
| 29 | 197 | `docs/worlds/world-depth-2026-10-13/37_MICRO_TEXTURE_BY_WORLD.md` | 62.4 KiB | 2023-12-12–2026-10-14 | Micro texture by world (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 30 | 192 | `docs/research/DOWNLOAD_WISHLIST_2026-10-30.md` | 135.9 KiB | 2021-10-01–2026-11-24 | Download wishlist, 2026-10-30 | Yes (OOPS repo) | Idea board or mixed source |
| 31 | 192 | `docs/worlds/NONHUMAN_SUBTLE_MICRO_DETAILS_2026-10-14.md` | 56.4 KiB | 2026-10-13–2026-11-04 | Nonhuman starts: subtle micro details, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 32 | 190 | `docs/research/SOURCE_LIBRARY_CATALOGUE.md` | 342.2 KiB | 2022-07-15–2022-07-15 | Source Library catalogue (the second book store) | Yes (OOPS repo) | Audit/run output likely |
| 33 | 186 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/activities.md` | 70.8 KiB | 2026-10-15–2026-10-16 | AV: activity and work surfaces, 2026-10-16 | Yes (OOPS repo) | Idea board or mixed source |
| 34 | 181 | `docs/worlds/world-core-kit-2026-10-14/cards/mother-of-learning.md` | 128.5 KiB | 2026-10-13–2026-10-24 | World core kit: Mother of Learning (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 35 | 175 | `docs/worlds/world-core-kit-2026-10-14/cards/harry-potter.md` | 117.5 KiB | 2026-10-13–2026-10-23 | World core kit: Harry Potter (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 36 | 175 | `docs/worlds/world-core-kit-2026-10-14/cards/reincarnation-paradise.md` | 112.1 KiB | 2026-10-13–2026-10-23 | World core kit: Reincarnation Paradise (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 37 | 175 | `docs/worlds/world-core-kit-2026-10-14/cards/shadow-slave.md` | 119.0 KiB | 2026-10-11–2026-10-23 | World core kit: Shadow Slave (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 38 | 174 | `docs/worlds/world-core-kit-2026-10-14/cards/circle-of-inevitability.md` | 108.2 KiB | 2026-10-13–2026-11-09 | World core kit: Circle of Inevitability (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 39 | 174 | `docs/worlds/world-core-kit-2026-10-14/cards/dnd.md` | 111.9 KiB | 2026-10-13–2026-10-14 | World core kit: D&D (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 40 | 174 | `docs/worlds/world-depth-2026-10-13/29_RELATIONSHIP_PREREQUISITES.md` | 76.5 KiB | 2026-10-02–2026-11-04 | What relationship play needs first, and what else it unlocks (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 41 | 173 | `docs/worlds/world-core-kit-2026-10-14/cards/lord-of-mysteries.md` | 118.7 KiB | 2026-10-11–2026-11-09 | World core kit: Lord of the Mysteries (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 42 | 172 | `docs/worlds/world-depth-2026-10-13/05_RESEARCHED_WORLDS.md` | 65.7 KiB | 2026-10-08–2026-10-13 | Deeper considerations: researched worlds (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 43 | 171 | `docs/research/royal-road-2026-10-10/TROPE_ATLAS.md` | 102.2 KiB | 2026-10-02–2026-10-10 | Royal Road trope atlas (2026-10-10) | Yes (OOPS repo) | Idea board or mixed source |
| 44 | 170 | `docs/CHEAT_COSMOLOGY.md` | 148.9 KiB | 2026-10-02–2026-11-05 | Fitting cheats into our cosmology (proposal, 2026-10-10) | Yes (OOPS repo) | Idea board or mixed source |
| 45 | 167 | `docs/worlds/world-core-kit-2026-10-14/cards/bleach.md` | 101.8 KiB | 2026-10-13–2026-10-14 | World core kit: Bleach (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 46 | 167 | `docs/worlds/world-core-kit-2026-10-14/cards/fate.md` | 104.9 KiB | 2026-10-14–2026-10-14 | World core kit: Fate (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 47 | 167 | `docs/worlds/world-core-kit-2026-10-14/cards/fullmetal-alchemist.md` | 105.1 KiB | 2026-10-14–2026-10-14 | World core kit: Fullmetal Alchemist (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 48 | 167 | `docs/worlds/world-core-kit-2026-10-14/cards/hunter-x-hunter.md` | 104.7 KiB | 2026-10-14–2026-10-14 | World core kit: Hunter x Hunter (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 49 | 167 | `docs/worlds/world-core-kit-2026-10-14/cards/jujutsu-kaisen.md` | 113.1 KiB | 2018-10-31–2026-10-14 | World core kit: Jujutsu Kaisen (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 50 | 167 | `docs/worlds/world-core-kit-2026-10-14/cards/naruto.md` | 102.2 KiB | 2026-10-13–2026-10-14 | World core kit: Naruto (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 51 | 163 | `docs/worlds/world-core-kit-2026-10-14/W2_LAWS_POWER_COMBAT.md` | 87.3 KiB | 2026-10-10–2026-10-14 | W2: world laws, power core and combat grammar | Yes (OOPS repo) | Idea board or mixed source |
| 52 | 160 | `docs/worlds/world-core-kit-2026-10-14/cards/ttks-b4.md` | 100.6 KiB | 2026-10-10–2026-10-23 | World core kit: TTKS B4 (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 53 | 160 | `docs/worlds/world-core-kit-2026-10-14/W17_LENS_CHEATS.md` | 51.6 KiB | 2026-10-13–2026-10-14 | W17: lens cheats, receipts and being read | Yes (OOPS repo) | Audit/run output likely |
| 54 | 159 | `docs/gm/dispatch/batch-reading-2026-10-27/READINESS_AND_SCOPE.md` | 79.5 KiB | 2026-10-10–2026-11-01 | Is the extraction enough to play the lead's life in the player's own style, and when do we batch every book? (2026-10-28) | Yes (OOPS repo) | Audit/run output likely |
| 55 | 159 | `docs/worlds/world-depth-2026-10-13/09_MORE_BOOK_WORLDS_CANON_AND_AU.md` | 46.8 KiB | 2026-10-11–2026-10-13 | More book worlds: canon spine and easy AUs (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 56 | 157 | `docs/worlds/world-core-kit-2026-10-14/cards/ttks-b5.md` | 101.5 KiB | 2026-10-10–2026-10-23 | World core kit: TTKS B5 (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 57 | 157 | `docs/worlds/world-core-kit-2026-10-14/W31_NOVEL_WORLDS_SPECIAL.md` | 66.6 KiB | 2026-10-10–2026-10-14 | W31: novel worlds and their special systems | Yes (OOPS repo) | Idea board or mixed source |
| 58 | 156 | `docs/worlds/world-depth-2026-10-13/16_EXPANDED_POSSIBILITIES.md` | 38.1 KiB | 2026-10-12–2026-10-13 | P. Expanded possibilities: one idea, many forms (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 59 | 155 | `docs/audits/idea-audit-2026-11-06/LANE_3_FOUNDATIONS_NOV4-6.md` | 41.6 KiB | 2025-10-25–2026-11-06 | Idea audit 2026-11-06, lane 3: foundation work of Nov 4-6 | Yes (OOPS repo) | Audit/run output likely |
| 60 | 154 | `docs/gm/dispatch/cultivation-absorption-2026-10-24/COVERAGE.md` | 50.1 KiB | 2026-10-22–2026-10-25 | Cultivation absorption implementation coverage | Yes (OOPS repo) | Audit/run output likely |
| 61 | 153 | `docs/research/skill-growth-2026-10-10/WORLD_GROWTH_AUDIT.md` | 84.2 KiB | 2026-10-10–2026-10-10 | C3 world growth audit | Yes (OOPS repo) | Audit/run output likely |
| 62 | 153 | `docs/worlds/world-core-kit-2026-10-14/cards/ttks-b1.md` | 100.1 KiB | 2026-10-10–2026-10-23 | World core kit: TTKS B1 (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 63 | 152 | `docs/worlds/world-core-kit-2026-10-14/cards/ttks-b2.md` | 99.9 KiB | 2026-10-10–2026-10-23 | World core kit: TTKS B2 (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 64 | 151 | `docs/worlds/world-core-kit-2026-10-14/W32_ANIME_WORLDS_SPECIAL.md` | 65.3 KiB | 2026-10-14–2026-10-14 | W32: Anime and manga worlds, special systems | Yes (OOPS repo) | Idea board or mixed source |
| 65 | 149 | `docs/gm/dispatch/potion-pathways-2026-10-24/BREWING_AND_HIGHER_SEQUENCES.md` | 47.6 KiB | 2026-10-10–2026-10-24 | Brewing, ingredients and higher Sequences (lane L2, 2026-10-24) | Yes (OOPS repo) | Idea board or mixed source |
| 66 | 148 | `docs/worlds/world-core-kit-2026-10-14/cards/ttks-b3.md` | 97.5 KiB | 2026-10-10–2026-10-23 | World core kit: TTKS B3 (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 67 | 141 | `docs/gm/dispatch/foundation-completion-2026-10-12/FINAL_RECONCILIATION_DRAFT.md` | 46.8 KiB | 2026-10-12–2026-10-12 | Final finite Foundation reconciliation | Yes (OOPS repo) | Audit/run output likely |
| 68 | 140 | `docs/gm/CHEAT_ACCESS_DESIGN_DISCUSSION_2026-10-15.md` | 145.0 KiB | 2026-10-10–2026-10-15 | Cheat access and design discussion | Yes (OOPS repo) | Idea board or mixed source |
| 69 | 139 | `docs/gm/dispatch/foundation-completion-2026-10-12/HORIZON_RECONCILIATION.md` | 49.1 KiB | 2026-10-12–2026-10-12 | Finite foundation horizon reconciliation | Yes (OOPS repo) | Audit/run output likely |
| 70 | 139 | `docs/gm/dispatch/ui-foundation-2026-10-15/NEXT_PARTS_2026-10-15.md` | 82.2 KiB | 2026-10-14–2026-10-16 | Next UI parts after R14, 2026-10-15 | Yes (OOPS repo) | Idea board or mixed source |
| 71 | 134 | `docs/audits/IDEAS_TRIAGE_2026-10-26.md` | 78.0 KiB | 2026-10-14–2026-11-04 | Q18 ideas triage, 2026-10-26 | Yes (OOPS repo) | Audit/run output likely |
| 72 | 133 | `docs/audits/idea-audit-2026-11-06/LANE_4_MASTER_PLAN_RANKED_LISTS.md` | 34.4 KiB | 2026-10-14–2026-11-06 | Idea audit 2026-11-06, lane 4: master playability plan and the older ranked lists | Yes (OOPS repo) | Audit/run output likely |
| 73 | 133 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/surfaces.md` | 75.9 KiB | 2026-10-15–2026-10-16 | SF: system surfaces, inventory anatomy and fight descriptor | Yes (OOPS repo) | Audit/run output likely |
| 74 | 129 | `docs/gm/dispatch/companions-2026-10-14/JOURNEYS.md` | 44.2 KiB | 2026-10-02–2026-10-14 | C4: companion journeys across a whole life | Yes (OOPS repo) | Idea board or mixed source |
| 75 | 128 | `docs/audits/idea-audit-2026-11-06/LANE_1_KLEIN_MECHANISMS.md` | 31.2 KiB | 2026-11-02–2026-11-06 | Idea audit 2026-11-06, lane 1: Klein campaign and mechanism backlog | Yes (OOPS repo) | Audit/run output likely |
| 76 | 127 | `docs/worlds/world-depth-2026-10-13/33_INSTITUTIONS_AND_COMMUNITIES.md` | 63.9 KiB | 2023-12-12–2026-10-14 | Institutions and communities by world (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 77 | 125 | `docs/worlds/NONHUMAN_KIN_AND_RELATIONSHIPS_2026-10-14.md` | 63.2 KiB | 2026-10-09–2026-11-04 | Nonhuman kin and relationships, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 78 | 125 | `docs/worlds/world-depth-2026-10-13/04_FALLOUT_SKYRIM_SL_TTKS.md` | 43.6 KiB | 2026-10-09–2026-10-13 | Deeper per-world considerations: Fallout, Skyrim, book world 1, TTKS (2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 79 | 125 | `docs/worlds/world-depth-2026-10-13/23_DEEPER_SYNTHESIS.md` | 49.3 KiB | 2026-10-13–2026-10-19 | Deeper synthesis: primitives, tensions, ways it can go (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 80 | 122 | `docs/worlds/world-depth-2026-10-13/02_MOL_HP_JJK_DND.md` | 47.6 KiB | 2026-10-12–2026-10-13 | Deeper considerations: magic-academy worlds (B lane, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 81 | 121 | `docs/audits/IMPLEMENTATION_PRACTICE_CORE_AUDIT.md` | 70.8 KiB | 2026-10-07–2026-11-12 | Implementation practice core audit | Yes (OOPS repo) | Audit/run output likely |
| 82 | 121 | `docs/gm/dispatch/maker-arts-2026-10-14/MICRO_CRAFT.md` | 25.8 KiB | 2026-10-13–2026-10-14 | W5: micro craft cue library | Yes (OOPS repo) | Idea board or mixed source |
| 83 | 118 | `docs/AI_PLAYTEST_HARNESS_CONSIDERATIONS_2026-10-20.md` | 46.1 KiB | 2026-10-20–2026-11-08 | AI playtest harness considerations (2026-10-20) | Yes (OOPS repo) | Idea board or mixed source |
| 84 | 118 | `docs/gm/dispatch/protagonist-life-2026-10-27/COORDINATOR_HANDOFF_2026-10-28.md` | 89.7 KiB | 2026-10-22–2026-11-04 | Cast lives: coordinator handoff (2026-10-28, late evening) | Yes (OOPS repo) | Audit/run output likely |
| 85 | 117 | `docs/worlds/REINCARNATION_PARADISE_FACILITIES_AND_SUBTLE_DETAILS_2026-10-23.md` | 62.5 KiB | 2026-10-23–2026-10-23 | Reincarnation Paradise: hub facilities, social roles and subtle details (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 86 | 117 | `docs/worlds/VILLAIN_STARTS_AND_OTHER_SELVES_2026-10-14.md` | 65.6 KiB | 2023-11-27–2026-10-14 | Villain starts and other selves, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 87 | 117 | `docs/worlds/world-core-kit-2026-10-14/cards/soldiers-life.md` | 90.4 KiB | 2026-10-13–2026-10-23 | World core kit: A Soldier's Life (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 88 | 117 | `docs/worlds/world-depth-2026-10-13/20_FRIENDS_AND_RELATIONSHIPS.md` | 37.3 KiB | 2026-10-13–2026-10-13 | T: Friends, relationships and more (proposals, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 89 | 116 | `docs/worlds/NONHUMAN_SYNTHESIS_AND_ROADMAP_2026-10-14.md` | 72.0 KiB | 2026-10-14–2026-11-04 | Nonhuman starts: synthesis and roadmap, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 90 | 115 | `docs/worlds/COMPANIONS_BY_WORLD_2026-10-14.md` | 66.5 KiB | 2026-10-13–2026-10-14 | Companions by world, with sources | Yes (OOPS repo) | Idea board or mixed source |
| 91 | 113 | `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md` | 42.9 KiB | 2026-10-13–2026-11-14 | Generation foundation rules: one contract for every generator | Yes (OOPS repo) | Idea board or mixed source |
| 92 | 113 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r10/INTEGRATION.md` | 19.0 KiB | 2026-10-13–2026-10-14 | R10 integration return | Yes (OOPS repo) | Audit/run output likely |
| 93 | 113 | `docs/research/LIBRARY_INDEX.md` | 186.1 KiB | 2020-02-22–2026-11-24 | Library index: where each prime book is (start here) | Yes (OOPS repo) | Idea board or mixed source |
| 94 | 113 | `docs/worlds/world-depth-2026-10-13/01_HOME_AND_HUBS.md` | 36.4 KiB | 2026-10-13–2026-10-19 | Deeper considerations: home world and hubs (2026-10-13, proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 95 | 113 | `docs/worlds/world-depth-2026-10-13/15_JOKES_AS_HINTS.md` | 30.4 KiB | 2026-10-10–2026-10-13 | Jokes as hints: throwaways that turn out to be real pointers (2026-10-13, proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 96 | 112 | `docs/research/proto23/FEATURE_AUDIT_SIDE_BY_SIDE_2026-10-20.md` | 68.6 KiB | 2021-02-18–2026-10-20 | Feature audit and side-by-side: Corc / Proto23 and OOPS | Yes (OOPS repo) | Audit/run output likely |
| 97 | 112 | `docs/worlds/NONHUMAN_PROGRESSION_AND_BALANCE_2026-10-14.md` | 61.7 KiB | 2026-10-14–2026-11-04 | Nonhuman progression and balance, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 98 | 111 | `docs/audits/BANK_DEEPER_TAKES_2026-11-10.md` | 32.2 KiB | 2026-10-14–2026-11-11 | Bank deeper takes: what each first slice left in its source (BDT1-BDT111, 2026-11-10) | Yes (OOPS repo) | Audit/run output likely |
| 99 | 111 | `docs/gm/dispatch/ui-foundation-2026-10-15/R14_FOLLOWUP_CONSIDERATIONS.md` | 37.6 KiB | 2026-10-15–2026-11-04 | R14 follow-up considerations: crowded combat and Reports color, 2026-10-15 | Yes (OOPS repo) | Audit/run output likely |
| 100 | 111 | `docs/worlds/world-depth-2026-10-13/19_DIALOGUE_ACTIONS.md` | 41.6 KiB | 2026-10-13–2026-10-13 | Dialogue actions with impact (2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 101 | 110 | `docs/audits/LARGER_FOUNDATIONS_2026-11-06.md` | 66.8 KiB | 2026-10-07–2026-11-06 | Larger foundations and modularity, 2026-11-06 | Yes (OOPS repo) | Audit/run output likely |
| 102 | 110 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r10/REPORT.md` | 42.8 KiB | 2026-10-13–2026-10-14 | R10: world-native micro texture | Yes (OOPS repo) | Audit/run output likely |
| 103 | 110 | `docs/worlds/progression-gates-2026-10-23/LORD_OF_THE_MYSTERIES.md` | 71.2 KiB | 2026-10-10–2026-11-09 | Lord of the Mysteries: progression gate catalog (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 104 | 109 | `docs/SIMULATORS_AND_CHEAT_IMPLEMENTATION.md` | 57.4 KiB | 2026-10-10–2026-11-04 | Simulators and cheat implementation | Yes (OOPS repo) | Idea board or mixed source |
| 105 | 108 | `docs/audits/idea-audit-2026-11-06/LANE_5_UI_VILLAGE_WRITEUPS.md` | 45.6 KiB | 2026-10-27–2026-11-06 | Lane 5: UI, Village and writeup follow-through | Yes (OOPS repo) | Audit/run output likely |
| 106 | 106 | `docs/audits/idea-audit-2026-11-06/LANE_8_OTHER_WORLDS_SYSTEM_DEPTH.md` | 37.7 KiB | 2026-10-24–2026-11-06 | Lane 8: other worlds and system depth | Yes (OOPS repo) | Audit/run output likely |
| 107 | 106 | `docs/research/skill-growth-2026-10-10/LEVEL_SCALES_AUDIT.md` | 49.1 KiB | 2026-10-10–2026-10-10 | C2: Level scales across sources and genres | Yes (OOPS repo) | Audit/run output likely |
| 108 | 106 | `docs/worlds/world-depth-2026-10-13/10_FULL_WORLD_METHOD.md` | 43.0 KiB | 2026-10-11–2026-10-13 | Full-world production method: how to make a whole detailed world at scale (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 109 | 106 | `docs/worlds/world-depth-2026-10-13/14_RESEARCH_SKILLS_SCALES.md` | 36.8 KiB | 2026-10-13–2026-10-13 | In-game research, subtle skills and scales (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 110 | 105 | `docs/CHEAT_CATALOGUE.md` | 31.9 KiB | 2026-10-10–2026-11-10 | Cheat catalogue | Yes (OOPS repo) | Audit/run output likely |
| 111 | 103 | `docs/reports/PROGRESS_ATLAS_2026-11-04.md` | 42.6 KiB | 2026-10-06–2026-11-04 | OOPS progress visualization snapshot, 2026-11-04 | Yes (OOPS repo) | Audit/run output likely |
| 112 | 103 | `docs/worlds/paradise-hub/DERIVED_WORLDS_AND_MISSIONS_2026-10-14.md` | 68.1 KiB | 2026-10-13–2026-10-14 | Paradise: derived worlds and mission structure | Yes (OOPS repo) | Idea board or mixed source |
| 113 | 103 | `docs/worlds/world-core-kit-2026-10-14/W8_LIVED_LAYER.md` | 52.1 KiB | 2026-10-13–2026-10-14 | W8: the lived layer, K19-K24 (2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 114 | 102 | `docs/gm/dispatch/companions-2026-10-14/TENSION_DEFAULTS.md` | 42.6 KiB | 2026-10-14–2026-11-04 | C11: per-world companion tension defaults | Yes (OOPS repo) | Idea board or mixed source |
| 115 | 102 | `docs/research/SOURCE_REQUESTS.md` | 41.3 KiB | 2026-02-20–2026-11-03 | Source requests for Weibao | Yes (OOPS repo) | Idea board or mixed source |
| 116 | 101 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/request-coverage.md` | 11.9 KiB | 2026-10-15–2026-11-04 | Weibao's UI requests against the plan (WR01–WR99), 2026-10-16 | Yes (OOPS repo) | Audit/run output likely |
| 117 | 101 | `docs/worlds/world-depth-2026-10-13/30_LIFE_STAGES_AND_CUSTOM.md` | 53.1 KiB | 2026-10-10–2026-10-14 | Life stages and custom by world and era (part 30, proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 118 | 100 | `docs/research/proto23/CRAFTING_SCREEN_AND_ADJUSTABILITY_CONSIDERATIONS_2026-10-13.md` | 17.7 KiB | 2026-10-11–2026-10-13 | Crafting screen, Proto23 parity, reveals and adjustability (2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 119 | 100 | `docs/worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md` | 55.3 KiB | 2026-10-12–2026-10-30 | Maker arts by world, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 120 | 100 | `docs/worlds/NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md` | 48.3 KiB | 2026-10-09–2026-11-08 | Nonhuman transformation and body change, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 121 | 99 | `docs/audits/idea-audit-2026-11-06/LANE_6_RESEARCH_AUTHORITY.md` | 35.9 KiB | 2026-10-31–2026-11-06 | Lane 6: research, world queue and proposal authority | Yes (OOPS repo) | Audit/run output likely |
| 122 | 99 | `docs/gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md` | 68.2 KiB | 2026-10-13–2026-10-21 | Need-based requests and local markets | Yes (OOPS repo) | Idea board or mixed source |
| 123 | 99 | `docs/worlds/IMPLEMENTATION_MAP_ABILITIES_PROCEDURES_SUBTLE_INTEGRATIONS_2026-10-23.md` | 82.2 KiB | 2026-10-14–2026-10-23 | Implementation map: abilities, procedures and subtle integrations from the world passes (2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 124 | 98 | `docs/gm/dispatch/comics-2026-10-14/SUPERHERO_GAME_RULES.md` | 50.0 KiB | 2026-10-14–2026-10-14 | K4: Superhero game rules | Yes (OOPS repo) | Idea board or mixed source |
| 125 | 98 | `docs/worlds/world-core-kit-2026-10-14/W13_PERCEPTION_RELEVANCE_SUBTEXT.md` | 69.1 KiB | 2026-10-10–2026-10-14 | W13: perception, relevance and subtext (considerations, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 126 | 97 | `docs/gm/dispatch/maker-arts-2026-10-14/RUNE_LANGUAGE.md` | 37.4 KiB | 2026-10-10–2026-10-14 | W2: runes and patterns as language and programming | Yes (OOPS repo) | Idea board or mixed source |
| 127 | 97 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/around-you.md` | 63.6 KiB | 2021-11-19–2026-10-18 | AW: Around you, maps and spatial representation, 2026-10-16 | Yes (OOPS repo) | Idea board or mixed source |
| 128 | 97 | `docs/SHARED_FOUNDATIONS_AUDIT_2026-10-12.md` | 41.5 KiB | 2026-10-12–2026-10-18 | Shared foundations across worlds | Yes (OOPS repo) | Audit/run output likely |
| 129 | 97 | `docs/worlds/world-core-kit-2026-10-14/W10_MICRO_REFERENCES.md` | 53.5 KiB | 2026-10-13–2026-10-14 | W10: micro references from games and books | Yes (OOPS repo) | Idea board or mixed source |
| 130 | 96 | `docs/worlds/paradise-hub/CANON_PRIORITY_PLAN_2026-10-14.md` | 57.6 KiB | 2026-10-08–2026-10-18 | Reincarnation Paradise: canon-priority plan (2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 131 | 96 | `docs/worlds/world-depth-2026-10-13/11_ACCESS_AND_STARTS.md` | 31.5 KiB | 2026-10-13–2026-10-19 | K. Accessing worlds, starts, AUs and copies (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 132 | 95 | `docs/gm/dispatch/ui-at-scale-2026-10-14/TABLETOP_AND_PAPER.md` | 35.1 KiB | 2020-05-18–2026-10-14 | U13: tabletop, paper and physical inspirations | Yes (OOPS repo) | Idea board or mixed source |
| 133 | 95 | `docs/worlds/NONHUMAN_STARTS_BY_WORLD_2026-10-14.md` | 71.0 KiB | 2023-11-27–2026-11-04 | Nonhuman starts by canon world, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 134 | 95 | `docs/worlds/world-core-kit-2026-10-14/W5_KNOWLEDGE_CANON_CROSSING_END.md` | 77.7 KiB | 2018-10-31–2026-10-14 | W5: knowledge, canon course, crossings and endings | Yes (OOPS repo) | Idea board or mixed source |
| 135 | 94 | `docs/worlds/world-depth-2026-10-13/03_BLEACH_NARUTO_ELDEN_RING.md` | 34.6 KiB | 2026-10-13–2026-10-13 | Deeper per-world considerations: Bleach, Naruto, Elden Ring (2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 136 | 93 | `docs/gm/dispatch/cheat-considerations-2026-10-13/W2_MULTIVERSAL_CHEATS.md` | 37.5 KiB | 2026-10-13–2026-10-13 | Multiversal cheats: considerations, not specs | Yes (OOPS repo) | Idea board or mixed source |
| 137 | 93 | `docs/gm/dispatch/foundation-b-2026-11-12/CHECKPOINT.md` | 40.5 KiB | 2026-11-11–2026-11-12 | Foundation B · Brewing and chemistry · checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 138 | 93 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r8/REPORT.md` | 92.2 KiB | 2023-05-08–2026-10-14 | R8: endgame paths in canon worlds and light large-scale play | Yes (OOPS repo) | Audit/run output likely |
| 139 | 93 | `docs/worlds/world-depth-2026-10-13/12_PRIORITY_WORLD_STARTS.md` | 50.5 KiB | 2026-10-09–2026-10-13 | L. Priority-world start catalogue (proposal, 2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 140 | 93 | `docs/worlds/world-depth-2026-10-13/24_TITLES.md` | 32.7 KiB | 2026-10-11–2026-10-19 | Titles: power, achievement and more, and why it matters dependingly (2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 141 | 92 | `docs/emergent/TITLES_ACHIEVEMENTS_AND_META_RULES_2026-10-15.md` | 33.2 KiB | 2026-10-15–2026-10-21 | Titles, achievements and tags acting on rules | Yes (OOPS repo) | Idea board or mixed source |
| 142 | 92 | `docs/gm/dispatch/ui-at-scale-2026-10-14/CHEAT_UI_REFERENCES.md` | 38.4 KiB | 2026-10-10–2026-10-14 | U2: cheat, power and system-window references | Yes (OOPS repo) | Idea board or mixed source |
| 143 | 92 | `docs/worlds/NONHUMAN_CHEATS_2026-10-14.md` | 53.7 KiB | 2026-10-13–2026-11-04 | Nonhuman cheats: seeing, becoming and staying strange | Yes (OOPS repo) | Idea board or mixed source |
| 144 | 91 | `docs/worlds/world-core-kit-2026-10-14/W23_GLOBALS_AND_LIFECYCLE.md` | 81.2 KiB | 2026-10-10–2026-10-14 | W23: Base-world globals, lifecycle matrix and lived floors | Yes (OOPS repo) | Idea board or mixed source |
| 145 | 90 | `docs/gm/dispatch/gen-rules-2026-10-14/g4/NAMES.md` | 13.2 KiB | 2026-10-13–2026-10-14 | G4 name grammars and collision filters | Yes (OOPS repo) | Idea board or mixed source |
| 146 | 90 | `docs/research/itch-io-2026-10-22/YAIR_GAP_CHECK.md` | 19.8 KiB | 2026-10-22–2026-10-23 | YAIR gap check for the itch.io batches (2026-10-22) | Yes (OOPS repo) | Idea board or mixed source |
| 147 | 89 | `docs/gm/dispatch/companions-2026-10-14/IMPLEMENTATION_IMPLICATIONS.md` | 41.7 KiB | 2026-10-14–2026-10-14 | C13: consolidated companion implementation implications | Yes (OOPS repo) | Idea board or mixed source |
| 148 | 89 | `docs/gm/dispatch/ui-at-scale-2026-10-14/LISTS_AND_RECORDS.md` | 37.9 KiB | 2026-10-13–2026-10-14 | U6: big lists and long records | Yes (OOPS repo) | Idea board or mixed source |
| 149 | 89 | `docs/research/ITCH_IO_IDLE_SCREEN_2026-10-22.md` | 47.7 KiB | 2026-09-05–2026-10-24 | itch.io idle and cultivation screen, 2026-10-22 | Yes (OOPS repo) | Idea board or mixed source |
| 150 | 89 | `docs/worlds/progression-gates-2026-10-23/REVEREND_INSANITY.md` | 44.6 KiB | 2026-10-10–2026-10-31 | Reverend Insanity: progression gate catalog (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 151 | 88 | `docs/audits/world_depth_lenses_2026-10-19/KL_MAP_A_BOOK_WORLDS.md` | 41.1 KiB | 2026-10-09–2026-11-04 | KL-MAP-A: lenses KL1 to KL12 for the book worlds | Yes (OOPS repo) | Audit/run output likely |
| 152 | 88 | `docs/gm/dispatch/body-lineage-2026-10-14/b12/FLAVOUR_LINES.md` | 21.8 KiB | 2026-10-14–2026-10-14 | B12 MP3 flavour-line catalogue | Yes (OOPS repo) | Audit/run output likely |
| 153 | 88 | `docs/gm/dispatch/weaponcraft-runes-2026-10-14/GAME_REFERENCES.md` | 56.5 KiB | 2026-07-13–2026-10-14 | R2: game references for weaponcraft and inscriptions | Yes (OOPS repo) | Idea board or mixed source |
| 154 | 88 | `docs/representations/ABILITIES.md` | 49.7 KiB | 2026-10-29–2026-10-30 | Abilities, powers and advancement ladders: representation | Yes (OOPS repo) | Idea board or mixed source |
| 155 | 88 | `docs/research/magical-production-2026-10-15/YAIR_INTERACTIONS.md` | 36.8 KiB | 2026-10-14–2026-10-15 | Production mechanics across YAIR systems, worlds and cheats | Yes (OOPS repo) | Idea board or mixed source |
| 156 | 88 | `docs/worlds/world-core-kit-2026-10-14/W18_ABSTRACTIONS.md` | 44.0 KiB | 2026-10-13–2026-10-14 | W18: abstraction map (design proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 157 | 88 | `docs/worlds/world-depth-2026-10-13/13_EARNED_OPTIONS_AND_CHEATS.md` | 32.5 KiB | 2026-10-10–2026-10-13 | M. Earned options and paths to cheats (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 158 | 87 | `docs/gm/dispatch/high-tier-power-2026-10-23/LANE_B_RI.md` | 30.0 KiB | 2026-10-10–2026-10-23 | Lane B: Reverend Insanity Gu Immortal tier (Rank 6, with 7-9) | Yes (OOPS repo) | Idea board or mixed source |
| 159 | 87 | `docs/reports/PROGRESS_ATLAS_REFINED_2026-11-04.md` | 53.9 KiB | 2026-10-06–2026-11-04 | Refined YAIR atlas: foundations, worlds, gaps and next work | Yes (OOPS repo) | Audit/run output likely |
| 160 | 87 | `docs/worlds/SELF_AS_PLAYER_LORE_CONSIDERATIONS_2026-10-13.md` | 72.8 KiB | 2026-10-03–2026-10-13 | Being ourselves in the fiction | Yes (OOPS repo) | Idea board or mixed source |
| 161 | 86 | `docs/emergent/E1_SEEDED_STREAMS.md` | 35.4 KiB | 2026-10-09–2026-10-09 | E1. Seeded streams: build-ready draft (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 162 | 86 | `docs/gm/dispatch/body-health-2026-10-17/B2_REFERENCES_AND_WORLDS.md` | 34.6 KiB | 2026-10-08–2026-10-17 | B2: Body, health, injury and medicine: references and worlds | Yes (OOPS repo) | Idea board or mixed source |
| 163 | 86 | `docs/representations/ECONOMY_AND_INSTITUTIONS.md` | 51.5 KiB | 2026-10-27–2026-10-30 | Economy and institutions: representations (proposals, 2026-10-30) | Yes (OOPS repo) | Idea board or mixed source |
| 164 | 86 | `docs/research/minecraft/audits/WV2_WORLD_FACTION.md` | 42.2 KiB | 2026-10-23–2026-10-23 | World and faction deep dive: Millenaire and Vampirism (2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 165 | 86 | `docs/worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md` | 68.2 KiB | 2026-10-11–2026-10-25 | Fresh lives and optional succession | Yes (OOPS repo) | Idea board or mixed source |
| 166 | 85 | `docs/research/yair-upstream/DISCORD_UI_ELEMENTS_REVIEW_2026-11-15.md` | 36.1 KiB | 2026-10-20–2026-11-15 | YAIR Discord media: UI elements and motion | Yes (OOPS repo) | Audit/run output likely |
| 167 | 85 | `docs/worlds/NONHUMAN_MONSTER_SIDE_2026-10-14.md` | 41.1 KiB | 2026-10-14–2026-11-04 | Nonhuman starts: the monster side, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 168 | 84 | `docs/PROCEDURAL_AND_GENERAL_OPPORTUNITIES_2026-10-16.md` | 25.1 KiB | 2026-10-13–2026-11-04 | Other procedural systems and general opportunities | Yes (OOPS repo) | Idea board or mixed source |
| 169 | 84 | `docs/worlds/world-core-kit-2026-10-14/W6_ENGINE_TEMPLATE.md` | 32.6 KiB | 2026-10-13–2026-10-14 | W6: shared engine, world-kit data and template (2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 170 | 83 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r6/REPORT.md` | 53.1 KiB | 2026-10-10–2026-10-14 | R6: four whole-save paper playthroughs | Yes (OOPS repo) | Audit/run output likely |
| 171 | 83 | `docs/worlds/world-core-kit-2026-10-14/W27_INSPECTOR_MAP.md` | 56.8 KiB | 2026-10-13–2026-10-14 | W27: inspector map, read versus write, newest owner | Yes (OOPS repo) | Idea board or mixed source |
| 172 | 82 | `docs/PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md` | 47.3 KiB | 2026-10-10–2026-10-18 | Play beyond menu selectors | Yes (OOPS repo) | Idea board or mixed source |
| 173 | 82 | `docs/research/HOGWARTS_POTION_CHEMISTRY_PROPOSAL_2026-11-11.md` | 277.2 KiB | 2026-10-10–2026-11-13 | Hogwarts potion chemistry proposal, 2026-11-11 | Yes (OOPS repo) | Idea board or mixed source |
| 174 | 82 | `docs/worlds/world-core-kit-2026-10-14/W20_COMIC_MEDIA_AND_CHEATS.md` | 57.7 KiB | 2026-10-11–2026-10-14 | W20: more comic media and comic cheats | Yes (OOPS repo) | Idea board or mixed source |
| 175 | 81 | `docs/gm/dispatch/companions-2026-10-14/REFERENCES.md` | 49.3 KiB | 2026-10-02–2026-10-14 | C3: companion systems, and what to take | Yes (OOPS repo) | Idea board or mixed source |
| 176 | 81 | `docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_SITUATION_UI_COVERAGE.md` | 69.0 KiB | 2026-10-27–2026-11-02 | LOTM situation → engine → UI coverage: reconciled record | Yes (OOPS repo) | Audit/run output likely |
| 177 | 80 | `docs/audits/LIMITING_LINES_REVIEW_2026-11-10.md` | 15.3 KiB | 2026-10-02–2026-11-14 | Limiting lines review, 2026-11-10 | Yes (OOPS repo) | Audit/run output likely |
| 178 | 80 | `docs/gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md` | 85.2 KiB | 2026-10-14–2026-10-20 | LOTM initiation/control: concrete implementation plan | Yes (OOPS repo) | Idea board or mixed source |
| 179 | 80 | `docs/research/minecraft/audits/GL_GEAR_LOOT.md` | 45.8 KiB | 2026-10-14–2026-10-14 | GL: gear, loot and rewards audit (Minecraft corpus) | Yes (OOPS repo) | Audit/run output likely |
| 180 | 80 | `docs/worlds/NONHUMAN_MAKING_AND_BUILDING_2026-10-14.md` | 46.9 KiB | 2026-10-14–2026-11-04 | Nonhuman making and building without hands, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 181 | 80 | `docs/worlds/world-core-kit-2026-10-14/W22_DEPENDENCY_CHAINS.md` | 58.5 KiB | 2026-10-14–2026-10-14 | W22: dependency chains per kit part | Yes (OOPS repo) | Idea board or mixed source |
| 182 | 79 | `docs/audits/cross-world-foundations-2026-11-06/LANE_G_RESEARCH_SKILLS.md` | 32.9 KiB | 2026-10-30–2026-11-06 | Lane G: researching, knowledge-making and shared functional skills, 2026-11-06 | Yes (OOPS repo) | Audit/run output likely |
| 183 | 79 | `docs/audits/FOUNDATIONAL_RULES_COVERAGE_2026-11-10.md` | 33.5 KiB | 2023-11-27–2026-11-13 | Foundational rules coverage, 2026-11-10 | Yes (OOPS repo) | Audit/run output likely |
| 184 | 79 | `docs/audits/GALLERY_FORM_AUDIT_2026-10-30.md` | 44.8 KiB | 2026-10-29–2026-11-04 | Gallery form audit (2026-10-30) | Yes (OOPS repo) | Audit/run output likely |
| 185 | 79 | `docs/gm/dispatch/held-systems-2026-10-10/PROPOSALS.md` | 45.0 KiB | 2026-10-10–2026-10-10 | Held systems and enemy cheats: options | Yes (OOPS repo) | Idea board or mixed source |
| 186 | 79 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/interpret.md` | 44.8 KiB | 2026-10-15–2026-10-15 | IL: reference interpretation ledger, 2026-10-15 | Yes (OOPS repo) | Audit/run output likely |
| 187 | 79 | `docs/research/minecraft/audits/WV2_SURVIVAL_COUPLING.md` | 41.8 KiB | 2026-10-14–2026-10-23 | WV2 survival coupling: Tough As Nails, Serene Seasons, Farmer's Delight (audit, 2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 188 | 78 | `docs/gm/dispatch/ttks-novels-2026-10-10/FINDINGS.md` | 38.9 KiB | 2026-10-10–2026-10-10 | Five novel leads and power-family proposals | Yes (OOPS repo) | Audit/run output likely |
| 189 | 78 | `docs/research/minecraft/audits/WC_WORLDS_COLONIES.md` | 46.8 KiB | 2026-10-14–2026-10-14 | WC audit: worlds, survival, colonies and roguelite runs (2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 190 | 78 | `docs/UI_DENSITY_AND_ORIGINAL_COMPARISON_AUDIT_2026-10-13.md` | 43.9 KiB | 2022-10-22–2026-11-04 | UI density, scrolling and original-UI comparison audit (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 191 | 77 | `docs/gm/dispatch/ui-at-scale-2026-10-14/READING_AND_TYPE.md` | 29.0 KiB | 2026-10-13–2026-10-14 | U11: reading comfort and typography | Yes (OOPS repo) | Idea board or mixed source |
| 192 | 77 | `docs/research/HEAVENS_WILL_DISCORD_IDEAS_2026-11-24.md` | 25.1 KiB | 2026-10-23–2026-11-24 | Heaven’s Will Discord ideas for OOPS (2026-11-24) | Yes (OOPS repo) | Idea board or mixed source |
| 193 | 76 | `docs/audits/cheat-implementation-2026-10-10/readers/A_code_primitives.md` | 36.5 KiB | 2026-10-10–2026-11-04 | Reader A: code primitives cheats can build on | Yes (OOPS repo) | Audit/run output likely |
| 194 | 76 | `docs/gm/dispatch/lotm-initiation-2026-10-15/PLAN_BEFORE_CONSOLIDATION_2026-10-15.md` | 65.0 KiB | 2026-10-14–2026-10-15 | LOTM initiation/control: concrete implementation plan | Yes (OOPS repo) | Idea board or mixed source |
| 195 | 76 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r1/REPORT.md` | 50.0 KiB | 2021-08-09–2026-10-14 | R1: source status, canon length and pacing | Yes (OOPS repo) | Audit/run output likely |
| 196 | 76 | `docs/research/minecraft/audits/TB_MEKANISM_AE2_IE_THERMAL.md` | 46.4 KiB | 2026-10-23–2026-10-23 | Lane TB: Mekanism, Applied Energistics 2, Immersive Engineering, Thermal (audit, 2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 197 | 75 | `docs/audits/world_depth_lenses_2026-10-19/KL_MAP_B_ANIME_AND_OTHERS.md` | 31.8 KiB | 2026-10-03–2026-11-04 | KL-MAP-B: lenses KL1 to KL12 for the anime and other worlds | Yes (OOPS repo) | Audit/run output likely |
| 198 | 75 | `docs/gm/dispatch/cheat-considerations-2026-10-13/W4_SYSTEM_QUESTS_IN_OTHER_GAMES.md` | 45.3 KiB | 2026-10-13–2026-10-14 | W4: System quests in other games and fiction | Yes (OOPS repo) | Idea board or mixed source |
| 199 | 75 | `docs/gm/dispatch/comics-2026-10-14/MEDIUM_TO_TEXT_UI.md` | 39.0 KiB | 2026-10-10–2026-10-14 | K3: comic technique for a text-first desktop UI | Yes (OOPS repo) | Idea board or mixed source |
| 200 | 75 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r5/REPORT.md` | 55.3 KiB | 2026-10-10–2026-10-14 | R5: time placement, paradox models and engine implications | Yes (OOPS repo) | Audit/run output likely |
| 201 | 75 | `docs/research/SAGA_OF_GU_SCOUT_2026-10-24.md` | 69.2 KiB | 2026-10-11–2026-10-24 | Saga of Gu: what OOPS can use (2026-10-24) | Yes (OOPS repo) | Idea board or mixed source |
| 202 | 75 | `docs/worlds/NONHUMAN_BODY_AUTHORING_2026-10-14.md` | 74.7 KiB | 2026-10-10–2026-11-04 | Nonhuman bodies as authored data, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 203 | 74 | `docs/gm/dispatch/ui-at-scale-2026-10-14/REVEAL_AND_TEACHING.md` | 35.0 KiB | 2018-04-11–2026-10-14 | U10: reveal and teaching across a long run | Yes (OOPS repo) | Idea board or mixed source |
| 204 | 74 | `docs/reviews/CORE_LOOP_SCOPING_CONSIDERATIONS_2026-10-16.md` | 27.8 KiB | 2026-10-09–2026-10-16 | Core loop scoping considerations, 2026-10-16 | Yes (OOPS repo) | Audit/run output likely |
| 205 | 74 | `docs/worlds/paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md` | 34.7 KiB | 2026-10-13–2026-10-14 | Paradise: beings, pets and bodies (2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 206 | 74 | `docs/worlds/world-depth-2026-10-13/21_RENOWN_AND_SUBTLE.md` | 35.0 KiB | 2026-10-13–2026-10-19 | U: Renown and other subtle social stuff (2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 207 | 73 | `docs/gm/dispatch/companions-2026-10-14/REVEAL_CHEATS.md` | 60.1 KiB | 2026-10-13–2026-10-14 | C12: cheats that reveal companion states | Yes (OOPS repo) | Idea board or mixed source |
| 208 | 73 | `docs/gm/dispatch/maker-arts-2026-10-14/IMPLEMENTATION.md` | 37.7 KiB | 2026-10-13–2026-10-14 | W4: maker implementation against live code | Yes (OOPS repo) | Idea board or mixed source |
| 209 | 73 | `docs/research/hearts-of-iron-iv/pass-2026-10-14-systems/REPORT.md` | 17.8 KiB | 2026-10-14–2026-11-04 | HOI4 deep systems sweep | Yes (OOPS repo) | Audit/run output likely |
| 210 | 73 | `docs/worlds/NONHUMAN_IMPLEMENTATION_IMPLICATIONS_2026-10-14.md` | 49.6 KiB | 2026-10-13–2026-11-04 | Nonhuman implementation implications, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 211 | 73 | `docs/worlds/progression-gates-2026-10-23/SHADOW_SLAVE.md` | 43.9 KiB | 2026-10-10–2026-10-23 | Shadow Slave: progression gate catalog (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 212 | 73 | `docs/worlds/world-depth-2026-10-13/06_CROSS_WORLD.md` | 24.6 KiB | 2026-10-13–2026-10-19 | Cross-world considerations: iteration, parallels, starts, subtle joins (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 213 | 72 | `docs/gm/dispatch/ui-at-scale-2026-10-14/OUTSIDE_INSPIRATIONS.md` | 39.6 KiB | 2026-10-13–2026-10-14 | U12: inspirations beyond games | Yes (OOPS repo) | Idea board or mixed source |
| 214 | 72 | `docs/reviews/FOUNDATION_WORLD_ENABLEMENT_PLAN_2026-11-04.md` | 46.7 KiB | 2026-10-14–2026-11-04 | Foundations, world enablement and the long-term work | Yes (OOPS repo) | Audit/run output likely |
| 215 | 72 | `docs/worlds/world-core-kit-2026-10-14/W16_COMIC_WORLDS.md` | 71.3 KiB | 2026-10-11–2026-10-19 | W16: comic worlds through the kit | Yes (OOPS repo) | Idea board or mixed source |
| 216 | 72 | `docs/worlds/world-depth-2026-10-13/08_PRIORITY_CANON_AND_AU.md` | 31.0 KiB | 2026-10-09–2026-10-13 | Priority worlds: canon spines and easy AU variants (H lane, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 217 | 71 | `docs/gm/dispatch/high-tier-power-2026-10-23/LANE_A_LOTM.md` | 27.3 KiB | 2026-10-10–2026-10-23 | Lane A: Lord of the Mysteries Sequences 7, 6, 5 and a look at 4 | Yes (OOPS repo) | Idea board or mixed source |
| 218 | 71 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r7/REPORT.md` | 34.9 KiB | 2026-10-14–2026-10-14 | R7: proposed reward, market and prestige numbers | Yes (OOPS repo) | Audit/run output likely |
| 219 | 71 | `docs/PROCEDURAL_GENERATION_STATUS_2026-10-13.md` | 29.0 KiB | 2026-10-02–2026-11-04 | Procedural and generative systems: status map | Yes (OOPS repo) | Audit/run output likely |
| 220 | 71 | `docs/worlds/NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md` | 54.1 KiB | 2026-10-14–2026-11-04 | Nonhuman starts engine specification, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 221 | 70 | `docs/audits/cross-world-foundations-2026-11-06/LANE_E_LIVELIHOODS.md` | 29.7 KiB | 2026-10-02–2026-11-06 | Lane E: livelihoods and production across worlds, 2026-11-06 | Yes (OOPS repo) | Audit/run output likely |
| 222 | 70 | `docs/audits/RULES_RECONCILIATION_AUDIT_2026-10-30.md` | 59.0 KiB | 2026-10-13–2026-11-04 | Rules reconciliation audit, 2026-10-30 | Yes (OOPS repo) | Audit/run output likely |
| 223 | 70 | `docs/gm/dispatch/cheat-cosmology-gaps-2026-10-10/MEETINGS_REPORT.md` | 37.6 KiB | 2026-10-08–2026-10-10 | Section M: when cheats meet | Yes (OOPS repo) | Audit/run output likely |
| 224 | 70 | `docs/gm/dispatch/ui-at-scale-2026-10-14/MAPS_AND_CHARTS.md` | 32.2 KiB | 2026-10-02–2026-11-04 | U7: maps, charts and economy views at scale | Yes (OOPS repo) | Idea board or mixed source |
| 225 | 70 | `docs/research/minecraft/cultivation-mods-2026-10-25/M2_CHANGSHENGJUE.md` | 41.6 KiB | 2026-10-22–2026-10-25 | M2: ChangShengJue (长生诀) absorption audit | Yes (OOPS repo) | Audit/run output likely |
| 226 | 70 | `docs/worlds/world-core-kit-2026-10-14/W26_CARRIERS_AND_SMALL_CONSEQUENCES.md` | 49.9 KiB | 2026-10-10–2026-10-14 | W26: Information carriers and small consequences | Yes (OOPS repo) | Idea board or mixed source |
| 227 | 70 | `docs/worlds/world-depth-2026-10-13/17_CARRYOVER_AND_RETROFIT.md` | 34.5 KiB | 2026-10-13–2026-10-13 | Q. Cross-life carryover and retrofitting prior systems (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 228 | 69 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-host-joins.md` | 57.2 KiB | 2026-10-14–2026-10-14 | P00 host joins checkpoint, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 229 | 69 | `docs/gm/dispatch/cheat-considerations-2026-10-13/W5_SHOWING_HIDDEN_INFORMATION_IN_GAMES.md` | 46.8 KiB | 2026-10-13–2026-10-14 | W5: Showing hidden information in games and fiction | Yes (OOPS repo) | Idea board or mixed source |
| 230 | 69 | `docs/gm/dispatch/maker-arts-2026-10-14/OTHER_ARTS.md` | 50.7 KiB | 2015-11-11–2026-10-19 | W6: other maker arts and game references | Yes (OOPS repo) | Idea board or mixed source |
| 231 | 69 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/sim-ui.md` | 52.2 KiB | 2026-10-10–2026-10-15 | SI: simulator representation, modes, foresight and identity | Yes (OOPS repo) | Idea board or mixed source |
| 232 | 69 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/surface-manifest-and-ui-flow-2026-10-18.md` | 20.7 KiB | 2026-10-15–2026-10-18 | Surface manifest, UI flow and feature representations, 2026-10-18 | Yes (OOPS repo) | Audit/run output likely |
| 233 | 69 | `docs/research/minecraft/audits/WV3_REACTORS_SPACE_TREES_DRAGONS.md` | 55.6 KiB | 2026-10-23–2026-10-23 | Wave 3: reactors, space, trees, dragons, crafting tiers (audit, 2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 234 | 69 | `docs/research/minecraft/cultivation-mods-2026-10-25/M1_XIAOXIANG.md` | 46.6 KiB | 2026-10-10–2026-10-25 | M1: Xiaoxiang Cultivation World absorption | Yes (OOPS repo) | Idea board or mixed source |
| 235 | 69 | `docs/worlds/LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 33.6 KiB | 2021-01-17–2026-10-23 | Lord of the Mysteries: institutions, roles and subtle details (pass, 2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 236 | 69 | `docs/worlds/NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md` | 40.3 KiB | 2026-10-13–2026-11-04 | Nonhuman bonds and parties, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 237 | 69 | `docs/worlds/world-core-kit-2026-10-14/cards/original-frontier.md` | 36.8 KiB | 2026-10-14–2026-10-14 | World core kit: Original Frontier (2026-10-14, consolidated proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 238 | 68 | `docs/gm/dispatch/companions-2026-10-14/CRAFTING_AND_RESEARCH.md` | 42.1 KiB | 2026-10-13–2026-10-14 | C15: crafting and research around companions | Yes (OOPS repo) | Idea board or mixed source |
| 239 | 68 | `docs/worlds/NONHUMAN_MINDS_AND_COGNITION_2026-10-14.md` | 44.3 KiB | 2026-10-10–2026-11-04 | Nonhuman minds and cognition, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 240 | 67 | `docs/audits/cross-world-foundations-2026-11-06/LANE_F_GROUPS.md` | 36.7 KiB | 2026-10-13–2026-11-06 | Lane F: founding and running groups, shared across worlds (round 3, 2026-11-06) | Yes (OOPS repo) | Audit/run output likely |
| 241 | 67 | `docs/reviews/WORLD_MECHANISM_DONORS_2026-11-04.md` | 35.4 KiB | 2026-10-14–2026-11-04 | Mechanism donors: broad foundations and specific world signatures | Yes (OOPS repo) | Audit/run output likely |
| 242 | 67 | `docs/worlds/HARRY_POTTER_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 52.1 KiB | 2026-10-11–2026-10-23 | Harry Potter: institutions, roles, subtle details and floor card (pass, 2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 243 | 67 | `docs/worlds/world-depth-2026-10-13/40_IMPLEMENTATION_CONSIDERATIONS.md` | 47.6 KiB | 2026-10-13–2026-10-14 | Implementation considerations for parts 28–39 | Yes (OOPS repo) | Idea board or mixed source |
| 244 | 66 | `docs/gm/dispatch/book-ui-wave-2026-10-30/RECON_LEDGER.md` | 28.6 KiB | 2026-10-14–2026-10-30 | Reconciliation ledger (bk-recon, 2026-10-30) | Yes (OOPS repo) | Audit/run output likely |
| 245 | 66 | `docs/gm/dispatch/companions-2026-10-14/COMICS.md` | 58.0 KiB | 2026-10-14–2026-10-14 | C14: companions in comic worlds | Yes (OOPS repo) | Idea board or mixed source |
| 246 | 66 | `docs/gm/dispatch/companions-2026-10-14/ENGINE_FIT.md` | 30.2 KiB | 2026-10-14–2026-10-14 | C2: companion engine fit, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 247 | 66 | `docs/worlds/NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md` | 54.5 KiB | 2026-10-10–2026-11-04 | Nonhuman protagonist mechanics, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 248 | 66 | `docs/worlds/paradise-hub/PROGRESSION_GATES_2026-10-23.md` | 38.0 KiB | 2026-10-23–2026-10-23 | Reincarnation Paradise: progression gate catalog (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 249 | 66 | `docs/worlds/world-depth-2026-10-13/32_SOCIAL_SPINE.md` | 33.6 KiB | 2026-10-02–2026-10-14 | Social systems spine (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 250 | 65 | `docs/audits/cheat-implementation-2026-10-10/readers/C_feasibility.md` | 42.7 KiB | 2026-10-10–2026-11-04 | Reader C: cheat implementation feasibility on the current engine | Yes (OOPS repo) | Audit/run output likely |
| 251 | 65 | `docs/worlds/CIRCLE_OF_INEVITABILITY_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 38.2 KiB | 2025-04-16–2026-10-23 | Lord of Mysteries 2: Circle of Inevitability, institutions, roles and subtle details, with a floor card (pass, 2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 252 | 65 | `docs/worlds/NONHUMAN_STARTS_PLAY_2026-10-14.md` | 71.7 KiB | 2026-10-13–2026-11-04 | Nonhuman starts: PLAY lane, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 253 | 64 | `docs/gm/dispatch/procgen-2026-10-13/p20/HOME.md` | 34.7 KiB | 2026-10-13–2026-10-21 | H5 extended: a home is a place with relationships and usable things | Yes (OOPS repo) | Idea board or mixed source |
| 254 | 64 | `docs/gm/dispatch/refinement-audits-2026-10-31/MECHANISM_BACKLOG.md` | 51.0 KiB | 2026-10-31–2026-11-06 | Mechanism and panel backlog for the book campaign (proposal board, 2026-11-02; AD32) | Yes (OOPS repo) | Audit/run output likely |
| 255 | 64 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/knowledge.md` | 84.6 KiB | 2026-10-14–2026-10-16 | KL: Part 4 knowledge ladder design spike, 2026-10-15 | Yes (OOPS repo) | Idea board or mixed source |
| 256 | 64 | `docs/research/continuing-traveler-games-2026-10-14/REPORT.md` | 32.6 KiB | 2026-10-13–2026-10-14 | Continuing travelers: games with portable growth across different worlds | Yes (OOPS repo) | Audit/run output likely |
| 257 | 64 | `docs/research/power-systems/western/SOURCES.md` | 20.7 KiB | 2003-08-18–2026-10-10 | Lane C source ledger | Yes (OOPS repo) | Audit/run output likely |
| 258 | 64 | `docs/worlds/paradise-hub/DERIVED_WORLD_INSTITUTIONS_AND_HUNTER_BENEFITS_2026-10-23.md` | 59.2 KiB | 2026-10-14–2026-10-23 | Reincarnation Paradise: derived-world institutions, local roles and hunter benefits (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 259 | 63 | `docs/audits/COMBAT_CROSS_WORLD_PAIRS_2026-11-13.md` | 18.0 KiB | 2026-11-13–2026-11-13 | Cross-world pair table · 2026-11-13 | Yes (OOPS repo) | Audit/run output likely |
| 260 | 63 | `docs/gm/dispatch/codex-parallel-2026-10-25/README.md` | 29.3 KiB | 2026-10-25–2026-10-25 | Codex parallel lanes, 2026-10-25 | Yes (OOPS repo) | Idea board or mixed source |
| 261 | 63 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/AUDIT.md` | 30.0 KiB | 2026-10-03–2026-10-14 | Relationship prerequisites audit, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 262 | 63 | `docs/research/power-systems/anime-manga/SOURCES.md` | 14.4 KiB | 2026-10-10–2026-10-10 | Lane A sources | Yes (OOPS repo) | Idea board or mixed source |
| 263 | 63 | `docs/research/power-systems/broad-scout/REPORT.md` | 63.4 KiB | mtime 2026-10-10 (no embedded date) | Lane D: broad power-system scout | Yes (OOPS repo) | Audit/run output likely |
| 264 | 63 | `docs/research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md` | 94.3 KiB | 2026-10-13–2026-10-21 | Corc / Proto23: deeper design lessons for OOPS | Yes (OOPS repo) | Idea board or mixed source |
| 265 | 63 | `docs/worlds/NONHUMAN_MAJORITY_WORLDS_2026-10-14.md` | 43.3 KiB | 2026-10-10–2026-11-04 | Nonhuman-majority worlds, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 266 | 62 | `docs/GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md` | 43.6 KiB | 2026-10-17–2026-11-04 | Gear depth: blacksmithing, chemistry, energy and powers | Yes (OOPS repo) | Idea board or mixed source |
| 267 | 62 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-reaudit.md` | 112.3 KiB | 2026-10-13–2026-11-04 | P23 re-audit, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 268 | 62 | `docs/gm/dispatch/procgen-2026-10-13/p38/DUPLICATES.md` | 14.1 KiB | 2026-10-13–2026-10-14 | Overlapping contracts and proposed merges | Yes (OOPS repo) | Idea board or mixed source |
| 269 | 62 | `docs/research/nonhuman-fiction-2026-10-10/B_OBJECT_CONSTRUCT_VEHICLE.md` | 29.9 KiB | 2026-10-10–2026-10-10 | Cluster B: object, construct and vehicle or house starts (2026-10-10) | Yes (OOPS repo) | Idea board or mixed source |
| 270 | 62 | `docs/research/proto23/TAGS_IDENTITY_AND_COMIC_LOGIC_2026-10-15.md` | 26.5 KiB | 2026-10-09–2026-10-15 | Proto23 labels, identity and comic logic | Yes (OOPS repo) | Idea board or mixed source |
| 271 | 62 | `docs/worlds/world-depth-2026-10-13/41_WEAPONCRAFT_RUNES_AND_REVEAL_CHEATS.md` | 14.7 KiB | 2026-10-13–2026-10-30 | Weaponcraft, runes, reveal cheats and the abstraction under them (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 272 | 61 | `docs/research/format-and-character-art-2026-10-14/REPORT.md` | 43.8 KiB | 2026-10-02–2026-10-26 | YAIR format references and scalable character art | Yes (OOPS repo) | Audit/run output likely |
| 273 | 61 | `docs/research/GAMES_OTHER_SELVES_AND_VILLAIN_PLAY_2026-10-14.md` | 59.0 KiB | 2026-10-02–2026-10-19 | Games: earlier characters, other selves and villain play | Yes (OOPS repo) | Idea board or mixed source |
| 274 | 61 | `docs/research/kingdom-hearts/aspects-2026-10-14/SYSTEM_INVENTORY.md` | 7.4 KiB | 2026-10-14–2026-10-14 | System inventory | Yes (OOPS repo) | Audit/run output likely |
| 275 | 61 | `docs/research/power-catalogues-2026-11-16/EXTREME_ABILITIES_2026-11-18.md` | 51.8 KiB | 2026-10-09–2026-11-18 | Extreme abilities against the effect engine (2026-11-18, proposals) | Yes (OOPS repo) | Audit/run output likely |
| 276 | 61 | `docs/research/SOURCE_ACQUISITION_TOOLS.md` | 47.1 KiB | 2026-10-11–2026-11-10 | Existing source acquisition tools | Yes (OOPS repo) | Idea board or mixed source |
| 277 | 60 | `docs/audits/idea-audit-2026-11-06/LANE_5_SECONDARY_PALETTES.md` | 25.1 KiB | 2026-11-06–2026-11-06 | Lane 5 secondary palettes: row-level supplement | Yes (OOPS repo) | Audit/run output likely |
| 278 | 60 | `docs/audits/RULES_CONSIDERATION_2026-10-26.md` | 50.3 KiB | 2026-10-26–2026-11-04 | Each-rule consideration, 2026-10-26 | Yes (OOPS repo) | Audit/run output likely |
| 279 | 60 | `docs/gm/dispatch/connection-detail-2026-10-12/DETAIL_CARDS.md` | 86.3 KiB | 2026-10-11–2026-10-12 | Thirty-six nested connection detail cards | Yes (OOPS repo) | Idea board or mixed source |
| 280 | 60 | `docs/UI_DENSITY_NEXT_PARTS_PROMPT_RECONCILED_2026-10-13.md` | 35.6 KiB | 2026-10-02–2026-10-13 | YAIRPG next UI pass: five bounded implementation slices | Yes (OOPS repo) | Idea board or mixed source |
| 281 | 60 | `docs/worlds/PLAYER_CHARACTER_IDENTITY_AND_CONTROL_2026-10-13.md` | 37.4 KiB | 2026-10-13–2026-10-15 | Who the player is, and who acts | Yes (OOPS repo) | Idea board or mixed source |
| 282 | 59 | `docs/gm/dispatch/foundation-f-2026-11-12/CHECKPOINT.md` | 40.6 KiB | 2026-11-12–2026-11-12 | Foundation F · Fabrication · checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 283 | 59 | `docs/gm/dispatch/gen-rules-2026-10-14/g4/PROFILES.md` | 34.3 KiB | 2026-10-10–2026-10-14 | G4 comic generation profiles | Yes (OOPS repo) | Idea board or mixed source |
| 284 | 59 | `docs/research/cross-game-synthesis-2026-10-14/REPORT.md` | 73.3 KiB | 2026-10-14–2026-10-14 | Cross-game synthesis, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 285 | 59 | `docs/research/START_AS_X_SOURCE_CATALOG_2026-10-14.md` | 77.5 KiB | 2026-10-13–2026-10-14 | Start as X: source catalog, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 286 | 59 | `docs/worlds/progression-gates-2026-10-23/MOTHER_OF_LEARNING.md` | 39.2 KiB | 2026-10-10–2026-10-23 | Mother of Learning (Cyoria): progression-gate audit (2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 287 | 59 | `docs/worlds/world-depth-2026-10-13/18_PROTO23_ABSORB.md` | 26.9 KiB | 2026-10-11–2026-10-13 | R: Proto23 mechanics not yet absorbed or proposed (2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 288 | 59 | `docs/worlds/world-depth-2026-10-13/28_FOUNDATIONAL_FUNCTIONS.md` | 16.2 KiB | 2026-10-13–2026-10-13 | Foundational functions: default, earned, lost or cheat (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 289 | 58 | `docs/audits/cheat-implementation-2026-10-10/readers/B_doc_catalog.md` | 33.7 KiB | 2026-10-01–2026-11-04 | Reader B: cheat ideas across the docs, and their status (2026-10-10) | Yes (OOPS repo) | Audit/run output likely |
| 290 | 58 | `docs/audits/OOPS_DIRECTION_AND_WEAK_RULES_2026-11-24.md` | 34.4 KiB | 2026-11-12–2026-11-24 | OOPS direction, weak rules and atlas development platform | Yes (OOPS repo) | Audit/run output likely |
| 291 | 58 | `docs/gm/dispatch/cheat-status-window-2026-10-13/ABSTRACTION_MAP.md` | 56.6 KiB | 2026-10-13–2026-11-04 | Abstraction map, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 292 | 58 | `docs/gm/dispatch/companions-2026-10-14/PROCGEN.md` | 26.1 KiB | 2026-10-13–2026-10-14 | C5: procedural companions and species | Yes (OOPS repo) | Idea board or mixed source |
| 293 | 58 | `docs/gm/dispatch/foundation-s-2026-11-12/CHECKPOINT.md` | 48.6 KiB | 2026-11-08–2026-11-12 | Foundation S · Spellcraft · checkpoint (phases 1 and 2, MS1 to MS3, SPD, 2026-11-12) | Yes (OOPS repo) | Audit/run output likely |
| 294 | 57 | `docs/audits/larger-foundations-2026-11-06/LANE_C_COMBAT_STOCK_ABILITIES.md` | 32.7 KiB | 2026-11-06–2026-11-06 | Lane C: ready stock, the encounter frame and effect channels (FD3+, FD17, FD18), 2026-11-06 | Yes (OOPS repo) | Audit/run output likely |
| 295 | 57 | `docs/gm/CONTINUATION_STATE_COVERAGE_AND_COMPATIBILITY_2026-10-15.md` | 40.0 KiB | 2026-10-15–2026-10-24 | Continuation state coverage and compatibility plan, 2026-10-15 | Yes (OOPS repo) | Audit/run output likely |
| 296 | 57 | `docs/gm/dispatch/foundation-c-2026-11-12/CHECKPOINT.md` | 39.6 KiB | 2026-10-17–2026-11-12 | Foundation C · Conflict, checkpoint (phase 1: inventory and contract proposal) | Yes (OOPS repo) | Audit/run output likely |
| 297 | 57 | `docs/gm/dispatch/maker-arts-2026-10-14/REVEAL_CHEATS.md` | 40.8 KiB | 2026-10-13–2026-10-14 | W3: reveal cheats for maker arts | Yes (OOPS repo) | Idea board or mixed source |
| 298 | 57 | `docs/gm/dispatch/progression-gates-2026-10-23/d1-package/files/docs/PROGRESSION_GATE_RULES.md` | 25.6 KiB | 2026-10-03–2026-10-23 | Progression gate rules | Yes (OOPS repo) | Idea board or mixed source |
| 299 | 57 | `docs/gm/dispatch/refinement-audits-2026-10-31/DIFFICULT_CONCEPT_ABSORPTION_PALETTE.md` | 38.4 KiB | 2026-10-31–2026-11-04 | Difficult concepts: reusable absorption defaults | Yes (OOPS repo) | Audit/run output likely |
| 300 | 57 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r3/INTEGRATION.md` | 12.1 KiB | 2026-10-13–2026-10-14 | R3 integration map | Yes (OOPS repo) | Audit/run output likely |
| 301 | 57 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r8/INTEGRATION.md` | 10.2 KiB | 2026-10-13–2026-10-14 | R8 integration packet | Yes (OOPS repo) | Audit/run output likely |
| 302 | 57 | `docs/HIGH_TIER_POWER_CONSIDERATIONS_2026-10-23.md` | 25.7 KiB | 2026-10-02–2026-10-23 | High-tier power: what Rank 6, Sequence 5 and their peers would take | Yes (OOPS repo) | Idea board or mixed source |
| 303 | 57 | `docs/research/continuing-traveler-games-2026-10-14/RETROMUD_AND_4D_DEPTH.md` | 42.7 KiB | 2026-09-23–2026-10-14 | RetroMUD and 4Dimensions: worlds, livelihoods and portable capabilities | Yes (OOPS repo) | Idea board or mixed source |
| 304 | 57 | `docs/research/minecraft/audits/SR_SPELLS_RITUALS.md` | 38.7 KiB | 2026-10-14–2026-10-14 | SR lane: spell composition, rituals and summoning (Minecraft corpus audit, 2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 305 | 57 | `docs/research/qud-systems-audit-2026-10-15/closure-inputs/d1-package/files/docs/PROGRESSION_GATE_RULES.md` | 25.6 KiB | 2026-10-03–2026-10-23 | Progression gate rules | Yes (OOPS repo) | Audit/run output likely |
| 306 | 57 | `docs/systems/PROGRESSION_WORLD_STATE.md` | 64.6 KiB | 2026-10-17–2026-11-04 | Systems guide: progression, world loading, jobs, knowledge, saves | Yes (OOPS repo) | Idea board or mixed source |
| 307 | 57 | `docs/worlds/CHOICES_THAT_GATE_CHOICES_2026-10-13.md` | 27.8 KiB | 2026-10-05–2026-10-13 | Choices that change later choices | Yes (OOPS repo) | Idea board or mixed source |
| 308 | 57 | `docs/worlds/NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md` | 41.9 KiB | 2026-10-14–2026-11-04 | Nonhuman society, law and economy, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 309 | 56 | `docs/audits/larger-foundations-2026-11-06/LANE_D_WORLD_GAPS.md` | 31.6 KiB | 2026-10-24–2026-11-06 | Lane D: per-world gaps, reconciled and deepened (2026-11-06) | Yes (OOPS repo) | Audit/run output likely |
| 310 | 56 | `docs/gm/dispatch/body-lineage-2026-10-14/b12/HOOKS.md` | 32.4 KiB | 2026-10-11–2026-10-14 | B12 micro body hook map, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 311 | 56 | `docs/gm/dispatch/cheats-2026-10-25/FAMILY_RECONCILIATION.md` | 62.9 KiB | 2026-10-25–2026-10-25 | D4 cheat family reconciliation (2026-10-25) | Yes (OOPS repo) | Audit/run output likely |
| 312 | 56 | `docs/research/CRAFTING_TECH_MICRO_MACRO_2026-10-11.md` | 18.4 KiB | 2022-09-21–2026-10-11 | Crafting and technology: micro, workshop and macro research | Yes (OOPS repo) | Idea board or mixed source |
| 313 | 56 | `docs/research/nonhuman-fiction-2026-10-10/A_MONSTER_BEAST_HIVE.md` | 29.5 KiB | 2026-10-10–2026-10-10 | Cluster A: monster, beast/familiar and collective/hive starts (2026-10-10) | Yes (OOPS repo) | Idea board or mixed source |
| 314 | 56 | `docs/research/vagrus/FINDINGS.md` | 26.8 KiB | mtime 2026-10-10 (no embedded date) | Vagrus findings | Yes (OOPS repo) | Audit/run output likely |
| 315 | 56 | `docs/reviews/ui-element-audit-2026-11-10/C_READOUTS.md` | 28.5 KiB | 2026-11-10–2026-11-10 | UI element audit, lane C: readouts (UIC98) | Yes (OOPS repo) | Audit/run output likely |
| 316 | 56 | `docs/worlds/world-depth-2026-10-13/07_REQUIRED_FEATURES_AND_ENGINE.md` | 38.3 KiB | 2026-10-10–2026-10-19 | Required features: implementation map for the deeper world considerations (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 317 | 55 | `docs/CORE_FOUNDATIONS_SCORECARD_2026-10-14.md` | 15.3 KiB | 2026-10-13–2026-11-04 | Core foundations scorecard, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 318 | 55 | `docs/gm/dispatch/procgen-2026-10-13/STATUS.md` | 6.8 KiB | 2026-10-13–2026-10-14 | Status (reconciled 2026-10-14, R3-5) | Yes (OOPS repo) | Audit/run output likely |
| 319 | 55 | `docs/research/around-you-talk-patterns-2026-10-18/REPORT.md` | 25.2 KiB | 2019-03-01–2026-10-18 | How other games handle finding and talking to people (2026-10-18) | Yes (OOPS repo) | Audit/run output likely |
| 320 | 55 | `docs/research/minecraft/audits/EP_PACK_PROGRESSION.md` | 26.3 KiB | 2026-10-14–2026-10-14 | Lane EP: expert modpack progression and quest graphs (audit, 2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 321 | 55 | `docs/research/open-idle-games-2026-10-09/IDLE_LOOPS.md` | 21.7 KiB | 2023-02-11–2026-10-09 | Idle Loops source dossier, 2026-10-09 | Yes (OOPS repo) | Idea board or mixed source |
| 322 | 55 | `docs/reviews/CORE_ENGINE_AND_RUNTIME_CONSIDERATIONS_2026-10-16.md` | 23.3 KiB | 2026-10-14–2026-11-04 | Core engine and runtime considerations, 2026-10-16 | Yes (OOPS repo) | Audit/run output likely |
| 323 | 54 | `docs/gm/dispatch/claude-coordinator-continuation-2026-10-23/GAP_AUDIT.md` | 108.3 KiB | 2026-10-09–2026-11-04 | Coordinator gap audit, 2026-10-23 | Yes (OOPS repo) | Audit/run output likely |
| 324 | 54 | `docs/gm/dispatch/comics-2026-10-14/WEBTOON_WORLDS.md` | 42.3 KiB | 2026-10-14–2026-10-14 | K1: webtoon, manhwa and manhua world considerations | Yes (OOPS repo) | Idea board or mixed source |
| 325 | 54 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/CH1_FIT_MAP.md` | 8.3 KiB | 2026-10-27–2026-11-04 | CH1 chance-core fit map | Yes (OOPS repo) | Idea board or mixed source |
| 326 | 54 | `docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_KLEIN_FULL_JOURNEY_PLAN.md` | 109.7 KiB | 2026-10-13–2026-11-09 | LOTM: build Klein's full journey first | Yes (OOPS repo) | Audit/run output likely |
| 327 | 54 | `docs/research/far-field-tropes-2026-10-08/PART_2_TROPES.md` | 25.9 KiB | 2026-10-08–2026-10-08 | Part 2: 36 recurring web-novel premises and four variations each | Yes (OOPS repo) | Idea board or mixed source |
| 328 | 54 | `docs/research/minecraft/audits/GT_GREGTECH_DEEP_DIVE.md` | 54.0 KiB | 2026-10-23–2026-10-23 | GregTech deep dive: mechanisms worth porting (2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 329 | 54 | `docs/research/minecraft/audits/WV2_RITUAL_MAGIC.md` | 47.2 KiB | 2026-10-23–2026-10-23 | WV2: ritual magic cost models (Blood Magic, Astral Sorcery, Forbidden Arcanus), 2026-10-23 | Yes (OOPS repo) | Audit/run output likely |
| 330 | 53 | `docs/gm/CROSS_WORLD_DETAIL_REVIEW.md` | 37.8 KiB | 2026-10-10–2026-11-04 | Cross-world detail review reference | Yes (OOPS repo) | Audit/run output likely |
| 331 | 53 | `docs/gm/DIRECTION_DETAILS_REVIEW_2026-10-15.md` | 37.7 KiB | 2026-10-02–2026-10-15 | Remaining direction and details review, 2026-10-15 | Yes (OOPS repo) | Audit/run output likely |
| 332 | 53 | `docs/research/TABLETOP_BOOK_SWEEP_2026-10-14.md` | 20.4 KiB | 2026-10-14–2026-10-14 | Tabletop book sweep for YAIRPG expansion | Yes (OOPS repo) | Audit/run output likely |
| 333 | 52 | `docs/audits/cheat-implementation-2026-10-10/REPORT.md` | 20.5 KiB | 2026-10-10–2026-11-04 | Cheat implementation audit | Yes (OOPS repo) | Audit/run output likely |
| 334 | 52 | `docs/audits/world_grammar_2026-10-19/DG_A1_HP_GRAMMAR.md` | 27.4 KiB | 2026-10-11–2026-11-04 | DG-A1: Harry Potter rule grammar from existing private notes (2026-10-19) | Yes (OOPS repo) | Audit/run output likely |
| 335 | 52 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r11/INTEGRATION.md` | 9.0 KiB | 2026-10-13–2026-11-04 | R11 integration map | Yes (OOPS repo) | Audit/run output likely |
| 336 | 52 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r3/REPORT.md` | 49.7 KiB | 2022-03-17–2026-10-14 | R3: genre mechanics for long runs and endings | Yes (OOPS repo) | Audit/run output likely |
| 337 | 52 | `docs/gm/dispatch/ui-at-scale-2026-10-14/ENGINE_FIT.md` | 22.2 KiB | 2026-10-13–2026-10-14 | U3 engine fit, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 338 | 52 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/around-you-sims.md` | 44.5 KiB | 2026-10-15–2026-10-16 | Around you: spatial references, lane around-you-sims (AS) | Yes (OOPS repo) | Idea board or mixed source |
| 339 | 52 | `docs/IDEA_INDEX.md` | 104.0 KiB | 2026-10-01–2026-11-24 | Game idea index | Yes (OOPS repo) | Idea board or mixed source |
| 340 | 52 | `docs/research/packet-reconciliation-2026-11-03/trace_immortality_life_tale.md` | 12.5 KiB | 2026-11-03–2026-11-03 | Trace A: research packets vs src/ (read-just, 2026-11-03) | Yes (OOPS repo) | Audit/run output likely |
| 341 | 52 | `docs/research/proto23/xeus24-mod-2026-10-10/readers/N1_notes_1-2048.md` | 34.9 KiB | 2026-09-04–2026-10-10 | N1: Xeus24 mod notes, lines 1-2048 | Yes (OOPS repo) | Idea board or mixed source |
| 342 | 52 | `docs/worlds/PRIMORDIAL_SAINT_SECT_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 68.8 KiB | 2026-10-10–2026-10-24 | Primordial Saint Sect: institutions, roles, talents, subtle details and floor card (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 343 | 51 | `docs/gm/dispatch/foundation-run-2026-11-12/RUN.md` | 186.2 KiB | 2026-11-01–2026-11-16 | Foundation run, 2026-11-12 | Yes (OOPS repo) | Idea board or mixed source |
| 344 | 51 | `docs/gm/dispatch/high-tier-power-2026-10-23/LANE_C_OTHER_WORLDS.md` | 30.6 KiB | 2026-10-23–2026-10-23 | Lane C: other worlds with comparable high tiers | Yes (OOPS repo) | Idea board or mixed source |
| 345 | 51 | `docs/research/procedural-materials-2026-10-13/deep/ORDINARY_ATLAS.md` | 18.3 KiB | 2026-10-13–2026-10-13 | Ordinary material atlas and intake contract | Yes (OOPS repo) | Idea board or mixed source |
| 346 | 50 | `docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_COMBAT_DEEP_DIVE_2026-11-03.md` | 29.2 KiB | 2026-10-30–2026-11-03 | Lord of the Mysteries combat deep dive: open scale, band axes, fight window (2026-11-03) | Yes (OOPS repo) | Audit/run output likely |
| 347 | 50 | `docs/research/dwarf-fortress/REPORT.md` | 30.7 KiB | mtime 2026-10-07 (no embedded date) | Dwarf Fortress source/data research | Yes (OOPS repo) | Audit/run output likely |
| 348 | 50 | `docs/UI_IDENTITY_AND_REPRESENTATION_CONSIDERATIONS_2026-10-14.md` | 13.2 KiB | 2026-10-13–2026-11-04 | UI identity, navigation and representation | Yes (OOPS repo) | Idea board or mixed source |
| 349 | 50 | `docs/worlds/NONHUMAN_START_SPECS_2026-10-14.md` | 86.3 KiB | 2026-10-11–2026-11-04 | Nonhuman start specs, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 350 | 49 | `docs/audits/idea-audit-2026-11-06/LANE_2_HARRY_POTTER.md` | 25.8 KiB | 2026-10-25–2026-11-06 | Idea audit 2026-11-06, lane 2: Harry Potter developer route and holdings | Yes (OOPS repo) | Audit/run output likely |
| 351 | 49 | `docs/audits/PROGRESS_ATLAS_2026-11-04.md` | 31.8 KiB | 2026-11-01–2026-11-07 | Progress atlas, 2026-11-04 | Yes (OOPS repo) | Audit/run output likely |
| 352 | 49 | `docs/gm/dispatch/batch-reading-2026-10-27/OPUS_REVIEW.md` | 14.5 KiB | 2026-10-27–2026-10-28 | Opus review: batched reading, state and next steps (2026-10-27) | Yes (OOPS repo) | Audit/run output likely |
| 353 | 49 | `docs/gm/dispatch/companions-2026-10-14/ABSTRACTION.md` | 27.6 KiB | 2026-10-13–2026-10-14 | C16: a shared vocabulary for persistent bonds | Yes (OOPS repo) | Idea board or mixed source |
| 354 | 49 | `docs/gm/dispatch/procgen-2026-10-13/p11/LIBRARIES_TEMPLES_MINES_CAVES_AND_MAPS_2026-10-16.md` | 22.2 KiB | 2026-10-13–2026-10-16 | Libraries, temples, mines, caves and maps | Yes (OOPS repo) | Idea board or mixed source |
| 355 | 49 | `docs/gm/dispatch/procgen-2026-10-13/PLAN.md` | 15.7 KiB | 2026-10-09–2026-10-18 | Procedural generation wave 1: plan | Yes (OOPS repo) | Idea board or mixed source |
| 356 | 49 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF1_AUDIT.md` | 42.5 KiB | 2026-10-27–2026-10-29 | MF1: mechanism fit, 2026-10-29 | Yes (OOPS repo) | Audit/run output likely |
| 357 | 49 | `docs/gm/dispatch/refinement-audits-2026-10-31/RP_STAT_SHAPE_READ_2026-11-03.md` | 24.6 KiB | 2026-10-31–2026-11-03 | Reincarnation Paradise stat shape: a comparator read for the LOTM notch scale (2026-11-03) | Yes (OOPS repo) | Audit/run output likely |
| 358 | 49 | `docs/gm/dispatch/ui-at-scale-2026-10-14/MICRO_DETAILS.md` | 27.9 KiB | 2026-10-14–2026-10-14 | U9: micro details with references | Yes (OOPS repo) | Idea board or mixed source |
| 359 | 49 | `docs/gm/world-implementation/second-pass/fork-network-absorption/RESURVEY_2026-10-14.md` | 16.4 KiB | 2026-10-14–2026-10-14 | Fork network resurvey and disposition, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 360 | 49 | `docs/reviews/PLAYTEST_SWEEP_2026-10-25.md` | 36.9 KiB | 2026-10-25–2026-10-25 | Headless playtest sweep, 2026-10-25 | Yes (OOPS repo) | Audit/run output likely |
| 361 | 49 | `docs/worlds/FANREN_SIMULATOR_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 50.8 KiB | 2026-10-10–2026-10-24 | Fanren simulator novel: institutions, roles, subtle details and floor card (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 362 | 48 | `docs/audits/EFFECT_WAVE_PROGRESS_2026-11-18.md` | 47.7 KiB | 2026-11-09–2026-11-18 | OOPS effect wave progress · November 18, 2026 | Yes (OOPS repo) | Audit/run output likely |
| 363 | 48 | `docs/audits/GEAR_STAT_READERS_CENSUS_2026-10-20.md` | 21.8 KiB | 2026-10-20–2026-11-04 | Gear stat readers and writers census (L1, 2026-10-20) | Yes (OOPS repo) | Audit/run output likely |
| 364 | 48 | `docs/audits/SCENE_LAYER_SPIKE_2026-11-13.md` | 15.4 KiB | 2026-11-13–2026-11-13 | Scene layer spike (CBD254), 2026-11-13 | Yes (OOPS repo) | Audit/run output likely |
| 365 | 48 | `docs/gm/dispatch/body-lineage-2026-10-14/b11/TEST_PLAN.md` | 17.7 KiB | 2026-10-14–2026-11-04 | G53-B11 test and acceptance plan | Yes (OOPS repo) | Idea board or mixed source |
| 366 | 48 | `docs/gm/dispatch/lotm-whole-life-2026-11-01/DAILY_LIFE_AND_SHARED_CONTRACTS.md` | 62.7 KiB | 2026-11-01–2026-11-01 | Supplement: ordinary life, connected situations and shared contracts | Yes (OOPS repo) | Idea board or mixed source |
| 367 | 48 | `docs/gm/dispatch/systems-cheats-expansion-2026-10-11/specialists/source-map.md` | 20.1 KiB | 2026-10-11–2026-10-11 | Supporting systems: inspected source map | Yes (OOPS repo) | Idea board or mixed source |
| 368 | 48 | `docs/gm/dispatch/systems-cheats-expansion-2026-10-11/SYSTEMS_MAP.md` | 20.6 KiB | 2026-10-11–2026-10-11 | Systems map: shared foundations and local consumers | Yes (OOPS repo) | Idea board or mixed source |
| 369 | 48 | `docs/research/qud-systems-audit-2026-10-15/MERGE_PLAN_2026-10-23.md` | 25.1 KiB | 2026-10-15–2026-10-23 | Qud parity lanes G1-G7: merge plan (2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 370 | 48 | `docs/worlds/NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md` | 41.6 KiB | 2026-10-13–2026-11-04 | Nonhuman senses, scale and UI, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 371 | 48 | `docs/worlds/world-depth-2026-10-13/36_MICRO_MOMENTS_AND_SMALL_SIGNALS.md` | 8.7 KiB | 2026-10-13–2026-10-14 | Micro moments and small signals (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 372 | 47 | `docs/gm/dispatch/cheat-considerations-2026-10-13/W3_HIDING_UI_AND_INTEGRATIONS.md` | 33.2 KiB | 2026-10-13–2026-10-13 | Hiding UI and integrations | Yes (OOPS repo) | Audit/run output likely |
| 373 | 47 | `docs/gm/dispatch/procgen-2026-10-13/p11/WORLD_SITE_PALETTE_2026-10-16.md` | 18.0 KiB | 2026-10-13–2026-10-16 | Ruins and natural sites by world | Yes (OOPS repo) | Idea board or mixed source |
| 374 | 47 | `docs/research/BOOK_DISCOVERY_2026-10-26.md` | 26.3 KiB | 2026-10-26–2026-10-28 | Book discovery, 2026-10-26 | Yes (OOPS repo) | Idea board or mixed source |
| 375 | 47 | `docs/research/nonhuman-fiction-2026-10-10/C_PLANT_FUNGUS_NATURE.md` | 38.3 KiB | 2026-10-10–2026-10-10 | Cluster C: plant, fungus and nature-place starts (2026-10-10) | Yes (OOPS repo) | Idea board or mixed source |
| 376 | 47 | `docs/research/planescape-torment/FINDINGS.md` | 14.3 KiB | mtime 2026-10-10 (no embedded date) | Findings and connected traces | Yes (OOPS repo) | Audit/run output likely |
| 377 | 46 | `docs/gm/dispatch/ui-at-scale-2026-10-14/ACCESSIBILITY_AND_INPUT.md` | 24.3 KiB | 2026-10-13–2026-10-14 | U4: accessibility and input at desktop scale | Yes (OOPS repo) | Idea board or mixed source |
| 378 | 46 | `docs/gm/dispatch/ui-at-scale-2026-10-14/COMBAT_AT_SCALE.md` | 24.1 KiB | 2026-10-14–2026-10-14 | U8: Combat and conflict UI at scale | Yes (OOPS repo) | Idea board or mixed source |
| 379 | 46 | `docs/research/minecraft/cultivation-mods-2026-10-25/M8_REDDIT_VOICE.md` | 31.0 KiB | 2023-05-14–2026-10-25 | M8: Reddit player voice on cultivation and web-novel games | Yes (OOPS repo) | Idea board or mixed source |
| 380 | 46 | `docs/research/SIM_PROFILE_RUST_WASM_2026-10-24.md` | 22.6 KiB | 2026-10-14–2026-10-24 | Sim profile: does any loop justify Rust/WASM? (2026-10-24) | Yes (OOPS repo) | Idea board or mixed source |
| 381 | 46 | `docs/research/tabletop-library-2026-10-14/conversion-landscape/REPORT.md` | 29.1 KiB | 2005-10-27–2026-10-14 | Existing rulebook-to-game conversions | Yes (OOPS repo) | Audit/run output likely |
| 382 | 46 | `docs/research/ZLIBRARY_YAIR_ACQUISITION_WAVE_2026-10-21.md` | 19.4 KiB | 2026-10-21–2026-10-21 | YAIR book acquisition and chapter-gap pass | Yes (OOPS repo) | Idea board or mixed source |
| 383 | 46 | `docs/ui/UR41_UR64_COMPACTION_REVIEW_2026-10-22.md` | 18.9 KiB | 2026-10-15–2026-10-22 | UR41 to UR64 compaction review, 2026-10-22 | Yes (OOPS repo) | Audit/run output likely |
| 384 | 46 | `docs/worlds/SUCCESSION_BY_WORLD.md` | 38.8 KiB | 2026-10-08–2026-10-14 | Death, continuity and succession by world (2026-10-10) | Yes (OOPS repo) | Idea board or mixed source |
| 385 | 45 | `docs/gm/dispatch/companions-2026-10-14/OWNER_MAP.md` | 25.2 KiB | 2026-10-13–2026-11-04 | C6: companion owner map and overlap check | Yes (OOPS repo) | Idea board or mixed source |
| 386 | 45 | `docs/gm/dispatch/ui-foundation-2026-10-15/R7_AUDIT.md` | 19.9 KiB | 2026-10-15–2026-10-15 | R7: native YAIR and Proto23 composition audit | Yes (OOPS repo) | Audit/run output likely |
| 387 | 45 | `docs/research/BROWSER_TESTING_AND_ENGINE_PERF_AUDIT_2026-10-14.md` | 48.7 KiB | 2026-10-14–2026-10-14 | Browser testing and engine performance audit, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 388 | 45 | `docs/research/kill-the-lich-idle/REPORT.md` | 17.6 KiB | 2026-10-09–2026-10-09 | Kill the Lich Idle installed source audit, 2026-10-09 | Yes (OOPS repo) | Audit/run output likely |
| 389 | 45 | `docs/research/relationships-2026-10-10/MATURE_SYSTEMS_SURVEY.md` | 32.9 KiB | 2026-10-10–2026-10-10 | R2: Mature relationship systems, outside sources (research reader) | Yes (OOPS repo) | Idea board or mixed source |
| 390 | 45 | `docs/worlds/world-core-kit-2026-10-14/W9_MICRO_ENGINE_AND_FIRST_DAY.md` | 61.3 KiB | 2026-10-11–2026-10-14 | W9: micro engine and first-day stress test | Yes (OOPS repo) | Idea board or mixed source |
| 391 | 44 | `docs/audits/FIGHT_VIEW_PROJECTION_2026-11-13.md` | 16.0 KiB | 2026-11-13–2026-11-13 | Fight view projection · 2026-11-13 | Yes (OOPS repo) | Audit/run output likely |
| 392 | 44 | `docs/audits/UI_SURFACE_COVERAGE_2026-11-15.md` | 13.3 KiB | 2026-11-14–2026-11-16 | UI surface coverage, 2026-11-15 (PS169) | Yes (OOPS repo) | Audit/run output likely |
| 393 | 44 | `docs/gm/dispatch/idea-expansion-2026-10-11/powers/REPORT.md` | 13.7 KiB | 2026-10-11–2026-10-11 | G2 powers, cheats and progression: actionability pass | Yes (OOPS repo) | Audit/run output likely |
| 394 | 44 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/fixtures.md` | 35.5 KiB | 2026-10-15–2026-10-15 | FX: subtle-detail fixture matrix for Parts 1–6 | Yes (OOPS repo) | Idea board or mixed source |
| 395 | 44 | `docs/research/local-ai-2026-10-14/round2/REPORT.md` | 37.8 KiB | 2026-10-13–2026-10-14 | Local AI re-audit, round 2 | Yes (OOPS repo) | Audit/run output likely |
| 396 | 44 | `docs/research/MINECRAFT_MODPACK_SCOUT_2026-10-14-expanded.md` | 20.1 KiB | mtime 2026-11-05 (no embedded date) | Minecraft donor catalog: 27 additional targets | Yes (OOPS repo) | Idea board or mixed source |
| 397 | 43 | `docs/gm/dispatch/body-lineage-2026-10-14/b2/TEST_PLAN.md` | 13.1 KiB | 2026-10-14–2026-11-04 | G24-B2 test and playable acceptance plan | Yes (OOPS repo) | Idea board or mixed source |
| 398 | 43 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r4/REPORT.md` | 16.8 KiB | 2026-10-14–2026-10-14 | R4: per-world death and next-life extension | Yes (OOPS repo) | Audit/run output likely |
| 399 | 43 | `docs/research/dwarf-fortress/aspects-2026-10-14/SYSTEM_INVENTORY.md` | 11.9 KiB | 2026-10-14–2026-10-14 | System inventory | Yes (OOPS repo) | Audit/run output likely |
| 400 | 43 | `docs/research/idle-social-engine-scout-2026-10-06/traces/FACTORIO.md` | 26.9 KiB | 2026-10-06–2026-10-06 | Factorio and Space Age: living lots and useful quality | Yes (OOPS repo) | Idea board or mixed source |
| 401 | 43 | `docs/research/itch-io-2026-10-22/BATCH_I1_DEEP.md` | 37.7 KiB | 2026-07-05–2026-10-22 | Batch I1 deep decode: Path of the Idle Cultivator (wuxiadev), 2026-10-22 | Yes (OOPS repo) | Idea board or mixed source |
| 402 | 43 | `docs/research/minecraft/MOD_SEARCH_2026-10-23.md` | 12.6 KiB | 2026-10-14–2026-10-23 | Minecraft mod search, 2026-10-23 | Yes (OOPS repo) | Idea board or mixed source |
| 403 | 43 | `docs/research/yair-upstream/DISCORD_RESEARCH_2026-10-20.md` | 62.2 KiB | 2026-10-18–2026-10-20 | YAIR upstream developer media and design research | Yes (OOPS repo) | Idea board or mixed source |
| 404 | 43 | `docs/worlds/deeper-interactions-audit-2026-10-13/03_AGENCY_RELATIONSHIPS_AND_AFTERMATH.md` | 14.2 KiB | 2026-10-13–2026-10-13 | Agency, relationships and aftermath, 2026-10-13 | Yes (OOPS repo) | Audit/run output likely |
| 405 | 43 | `docs/worlds/NONHUMAN_OVERARCHING_FRAME_2026-10-14.md` | 41.7 KiB | 2026-10-10–2026-11-04 | Nonhuman overarching frame, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 406 | 43 | `docs/worlds/OMNISCIENT_READERS_VIEWPOINT_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 38.9 KiB | 2026-10-10–2026-11-09 | Omniscient Reader's Viewpoint: institutions, roles and subtle details (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 407 | 42 | `docs/audits/larger-foundations-2026-11-06/LANE_A_SOCIETY_POSITIONS.md` | 35.1 KiB | 2026-11-06–2026-11-06 | Lane A: society sheet (FD14) and positions (FD15), reconcile and deepen (2026-11-06) | Yes (OOPS repo) | Audit/run output likely |
| 408 | 42 | `docs/FORMAT_AND_VIEW_DECISION_AUDIT_2026-10-14.md` | 14.7 KiB | 2026-10-02–2026-11-04 | Format and view decision audit | Yes (OOPS repo) | Audit/run output likely |
| 409 | 42 | `docs/gm/dispatch/cheat-status-window-2026-10-13/INFO_LAYER_IMPLICATIONS.md` | 30.3 KiB | 2026-10-13–2026-10-14 | Shared information layer: architecture implications | Yes (OOPS repo) | Audit/run output likely |
| 410 | 42 | `docs/gm/dispatch/pc-groups-2026-10-26/material-foundations/REPORT.md` | 33.2 KiB | 2026-10-21–2026-10-26 | G5: PC27–PC43 | Yes (OOPS repo) | Audit/run output likely |
| 411 | 42 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r5/INTEGRATION.md` | 8.2 KiB | 2026-10-14–2026-10-14 | R5 integration packet | Yes (OOPS repo) | Audit/run output likely |
| 412 | 42 | `docs/gm/dispatch/world-core-kit-2026-10-14/W19_REPORT.md` | 20.9 KiB | 2026-10-14–2026-10-14 | W19 report: per-world kit consolidation (2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 413 | 42 | `docs/representations/MAPS_AND_TRAVEL.md` | 32.9 KiB | 2026-10-14–2026-11-04 | Maps, routes and travel (RPX14) | Yes (OOPS repo) | Idea board or mixed source |
| 414 | 42 | `docs/research/HOGWARTS_SPELL_VOCABULARY_PROPOSAL_2026-11-11.md` | 64.0 KiB | 2026-10-31–2026-11-11 | Hogwarts spell vocabulary and technique | Yes (OOPS repo) | Idea board or mixed source |
| 415 | 42 | `docs/research/minecraft/audits/TA_TECH_AUTOMATION.md` | 22.6 KiB | 2026-10-14–2026-10-14 | Lane TA: technology and automation mods (audit, 2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 416 | 42 | `docs/research/minecraft/audits/WV2_QUESTS_LOGISTICS.md` | 39.3 KiB | 2024-03-07–2026-10-23 | Wave two lane: quest authoring and second-tier logistics (audit, 2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 417 | 42 | `docs/research/noita/REPORT.md` | 14.9 KiB | mtime 2026-11-05 (no embedded date) | Noita: materials and techniques source pass | Yes (OOPS repo) | Audit/run output likely |
| 418 | 42 | `docs/research/nonhuman-fiction-2026-10-10/D_SPIRIT_UNDEAD_SHADOW.md` | 43.1 KiB | 2026-10-10–2026-10-10 | Cluster D: spirit or ghost, undead, shadow or reflection starts | Yes (OOPS repo) | Idea board or mixed source |
| 419 | 42 | `docs/research/packet-reconciliation-2026-11-03/trace_ngu_yourchronicle.md` | 7.1 KiB | 2026-11-03–2026-11-03 | Trace B: NGU Idle + Your Chronicle packets vs src/ (read-just, 2026-11-03) | Yes (OOPS repo) | Audit/run output likely |
| 420 | 42 | `docs/research/SIMILAR_GAMES_BEYOND_PROTOLIKE_2026-10-30.md` | 25.0 KiB | 2026-10-22–2026-10-31 | Similar games beyond the Proto23-likes, 2026-10-30 | Yes (OOPS repo) | Idea board or mixed source |
| 421 | 42 | `docs/worlds/SHADOW_SLAVE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 40.4 KiB | 2026-10-10–2026-10-23 | Shadow Slave: institutions, roles and subtle details, plus floor card (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 422 | 42 | `docs/worlds/world-core-kit-2026-10-14/W35_CALENDARS_OTHER_WORLDS.md` | 41.2 KiB | 2026-10-14–2026-10-14 | W35: Canon calendars, other worlds | Yes (OOPS repo) | Idea board or mixed source |
| 423 | 41 | `docs/audits/ATLAS_PLATFORM_AUDIT_2026-11-24.md` | 25.2 KiB | 2026-11-24–2026-11-24 | Atlas platform audit, 2026-11-24 | Yes (OOPS repo) | Audit/run output likely |
| 424 | 41 | `docs/audits/WORLD_SUBTLE_GAPS_2026-10-20.md` | 95.7 KiB | 2026-10-03–2026-11-04 | World subtle gaps, 2026-10-20 | Yes (OOPS repo) | Audit/run output likely |
| 425 | 41 | `docs/gm/dispatch/body-lineage-2026-10-14/b13/EVENT_SHAPES.md` | 18.0 KiB | 2026-10-13–2026-10-14 | B13 investigation card shapes and seeded draws | Yes (OOPS repo) | Idea board or mixed source |
| 426 | 41 | `docs/gm/dispatch/foundation-l-2026-11-12/CHECKPOINT.md` | 48.2 KiB | 2026-11-12–2026-11-12 | Foundation L · Living things: phase 1 inventory | Yes (OOPS repo) | Audit/run output likely |
| 427 | 41 | `docs/gm/dispatch/foundation-m-2026-11-12/CHECKPOINT.md` | 34.0 KiB | 2026-11-12–2026-11-12 | Foundation M · Societies and markets: checkpoint, phase 1 (inventory) | Yes (OOPS repo) | Audit/run output likely |
| 428 | 41 | `docs/gm/dispatch/procgen-2026-10-13/p11/WORKSHOP_AND_NATURAL_SITE_JOURNEYS_2026-10-16.md` | 21.6 KiB | 2026-10-13–2026-10-16 | Workshop and spring/grove journeys | Yes (OOPS repo) | Idea board or mixed source |
| 429 | 41 | `docs/research/itch-io-2026-10-22/BATCH_ECONOMY.md` | 19.2 KiB | 2026-10-22–2026-10-22 | BATCH_ECONOMY: trade, faith and institutions (itch.io, 2026-10-22) | Yes (OOPS repo) | Idea board or mixed source |
| 430 | 41 | `docs/research/power-systems/wiki-digests/history/pre-addendum-2/SOURCES.md` | 19.6 KiB | 2026-10-10–2026-10-10 | Current lane W source ledger | Yes (OOPS repo) | Audit/run output likely |
| 431 | 41 | `docs/research/power-systems/wiki-digests/SOURCES.md` | 21.7 KiB | 2023-11-27–2026-10-13 | Current lane W source ledger | Yes (OOPS repo) | Audit/run output likely |
| 432 | 41 | `docs/worlds/world-core-kit-2026-10-14/cards/wish-upon-the-stars.md` | 22.1 KiB | 2026-10-09–2026-10-25 | World core kit: Wish Upon the Stars (2026-10-25, research and proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 433 | 40 | `docs/audits/larger-foundations-2026-11-06/LANE_B_EVENTS.md` | 29.1 KiB | 2026-10-02–2026-11-06 | Lane B: FD16 event director, reconcile and deepen (2026-11-06) | Yes (OOPS repo) | Audit/run output likely |
| 434 | 40 | `docs/gm/dispatch/body-lineage-2026-10-14/b16/REPORT.md` | 12.0 KiB | 2026-10-14–2026-11-04 | B16 report: body and lineage synthesis | Yes (OOPS repo) | Audit/run output likely |
| 435 | 40 | `docs/gm/dispatch/cheat-status-window-2026-10-13/AUDIT_REPORT.md` | 41.1 KiB | 2026-10-13–2026-11-04 | Independent cheat status window audit | Yes (OOPS repo) | Audit/run output likely |
| 436 | 40 | `docs/gm/dispatch/cheat-status-window-2026-10-13/runs/audit/report-draft.md` | 39.1 KiB | 2026-10-13–2026-10-14 | Independent cheat status window audit | Yes (OOPS repo) | Audit/run output likely |
| 437 | 40 | `docs/gm/dispatch/cheats-2026-10-25/INVENTORY.md` | 75.6 KiB | 2026-10-25–2026-10-25 | Cheat and simulator source inventory (2026-10-25) | Yes (OOPS repo) | Audit/run output likely |
| 438 | 40 | `docs/gm/dispatch/gen-rules-2026-10-14/g2/CONFORMANCE.md` | 18.7 KiB | 2026-10-14–2026-10-14 | G2 generator conformance | Yes (OOPS repo) | Idea board or mixed source |
| 439 | 40 | `docs/gm/dispatch/procgen-2026-10-13/cr2/BOOK_WORLDS.md` | 21.8 KiB | 2026-10-11–2026-10-14 | CR2 book crafting laws | Yes (OOPS repo) | Idea board or mixed source |
| 440 | 40 | `docs/gm/dispatch/procgen-2026-10-13/p11/CONTEXT.md` | 22.6 KiB | 2026-10-13–2026-10-14 | Shared generation context | Yes (OOPS repo) | Idea board or mixed source |
| 441 | 40 | `docs/gm/dispatch/systems-cheats-expansion-2026-10-11/specialists/worlds-rng.md` | 27.1 KiB | 2026-10-11–2026-10-11 | Chance, authored worlds, created worlds and consequential joins | Yes (OOPS repo) | Idea board or mixed source |
| 442 | 40 | `docs/gm/dispatch/ui-foundation-2026-10-15/PARITY_INTENT_2026-10-15.md` | 13.6 KiB | 2026-10-13–2026-10-16 | Proto23 parity: what YAIR keeps on purpose, and what is still worth absorbing | Yes (OOPS repo) | Idea board or mixed source |
| 443 | 40 | `docs/PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md` | 21.9 KiB | 2026-10-13–2026-11-09 | Procedural materials and alchemy: implementation audit and deeper proposal | Yes (OOPS repo) | Audit/run output likely |
| 444 | 40 | `docs/representations/WORLDS_AND_CROSSINGS.md` | 26.5 KiB | 2026-10-27–2026-10-30 | Worlds, crossings and transmigration: representations | Yes (OOPS repo) | Idea board or mixed source |
| 445 | 40 | `docs/research/DISCORD_ATLAS_DESIGN_IDEAS_2026-11-24.md` | 10.9 KiB | 2026-02-05–2026-11-24 | Discord evidence for the OOPS atlas: codex, canvas, fold, design language, retention | Yes (OOPS repo) | Idea board or mixed source |
| 446 | 40 | `docs/reviews/UI_CHARACTER_DIRECTION_2026-10-26.md` | 57.7 KiB | 2026-10-26–2026-10-26 | UI character: reference comparison and proposed review brief | Yes (OOPS repo) | Audit/run output likely |
| 447 | 40 | `docs/worlds/world-core-kit-2026-10-14/W29_PARADISE_SPECIAL.md` | 61.3 KiB | 2026-10-03–2026-10-14 | W29: Paradise hub, derived worlds and special systems | Yes (OOPS repo) | Idea board or mixed source |
| 448 | 39 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g3/REPORT.md` | 15.6 KiB | 2026-10-13–2026-10-13 | R15 G3: manual study, fieldcraft and assay | Yes (OOPS repo) | Audit/run output likely |
| 449 | 39 | `docs/gm/dispatch/potion-pathways-2026-10-24/IMPLEMENTATION_DESIGN.md` | 37.2 KiB | 2026-10-24–2026-10-24 | Potion pathways, higher Sequences: implementation design (lane L3) | Yes (OOPS repo) | Idea board or mixed source |
| 450 | 39 | `docs/gm/dispatch/procgen-2026-10-13/p27/REPORT.md` | 19.6 KiB | 2026-10-13–2026-10-14 | P27 report: journeys, leadership, death and afterlives | Yes (OOPS repo) | Audit/run output likely |
| 451 | 39 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3Z_IMPLEMENTATION_RECEIPT.md` | 18.4 KiB | 2026-10-31–2026-11-03 | KJ3Z implementation receipt: the wallet returned, the Sunday afternoon and the Divination Club (kjw16, final window) | Yes (OOPS repo) | Audit/run output likely |
| 452 | 39 | `docs/gm/MICRO_MESO_MACRO_IMPLEMENTATION_SUPPORT.md` | 22.9 KiB | 2026-10-11–2026-10-12 | Micro, meso and macro implementation-support GM | Yes (OOPS repo) | Idea board or mixed source |
| 453 | 39 | `docs/research/packet-reconciliation-2026-11-03/trace_arcanum_climb.md` | 14.3 KiB | 2026-11-03–2026-11-03 | Trace C: Theory of Magic packets, Climb/MR2 shortlist and gap audit | Yes (OOPS repo) | Audit/run output likely |
| 454 | 39 | `docs/research/proto23/UI_AND_PLAYFUL_PRESENTATION_OPPORTUNITIES_2026-10-20.md` | 70.1 KiB | 2026-10-13–2026-10-21 | UI and playful presentation opportunities for OOPS | Yes (OOPS repo) | Idea board or mixed source |
| 455 | 39 | `docs/research/proto23/xeus24-mod-2026-10-10/readers/M1_modjs_1-4700.md` | 31.4 KiB | 2026-10-10–2026-10-10 | M1: Xeus24 mod.js lines 1-4700 | Yes (OOPS repo) | Idea board or mixed source |
| 456 | 39 | `docs/research/scroll-of-taiwu/pass-2026-10-14-systems/CHECKPOINT.md` | 9.5 KiB | 2026-10-14–2026-10-14 | Taiwu deep systems checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 457 | 39 | `docs/worlds/frieren/REVIEW.md` | 12.5 KiB | 2023-12-12–2026-10-14 | Frieren world-pack independent review (2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 458 | 39 | `docs/worlds/world-core-kit-2026-10-14/W3_PEOPLE_INSTITUTIONS_LIFE.md` | 86.7 KiB | 2026-10-10–2026-10-14 | W3: people, institutions and daily life (considerations, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 459 | 38 | `docs/audits/DESKTOP_LAYOUT_TRIAL_2026-11-23.md` | 48.2 KiB | 2026-11-14–2026-11-24 | OOPS desktop layout trial · November 23, 2026 | Yes (OOPS repo) | Audit/run output likely |
| 460 | 38 | `docs/gm/dispatch/companions-2026-10-14/BOND_CRAFT.md` | 40.0 KiB | 2026-10-14–2026-10-14 | C7: how companion bonds feel earned | Yes (OOPS repo) | Idea board or mixed source |
| 461 | 38 | `docs/gm/dispatch/core-foundations-2026-10-14/a1/PLAN.md` | 73.7 KiB | 2026-10-14–2026-10-24 | A1: core consolidation without stopping feature work | Yes (OOPS repo) | Idea board or mixed source |
| 462 | 38 | `docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/README.md` | 25.5 KiB | 2026-10-22–2026-10-26 | Minecraft cultivation-mod absorption wave, 2026-10-25 | Yes (OOPS repo) | Idea board or mixed source |
| 463 | 38 | `docs/gm/dispatch/procgen-2026-10-13/p24/MORE.md` | 11.2 KiB | 2026-10-13–2026-10-14 | Further O, P and Q angles | Yes (OOPS repo) | Idea board or mixed source |
| 464 | 38 | `docs/gm/dispatch/research-tech-2026-10-14/t12/MECHANICS.md` | 18.1 KiB | 2026-10-14–2026-10-14 | T12: optional expertise, memory and teaching texture | Yes (OOPS repo) | Idea board or mixed source |
| 465 | 38 | `docs/research/DISCORD_VISUAL_REFERENCE_SHEET_2026-11-20.md` | 50.3 KiB | 2026-10-20–2026-11-20 | Discord visual reference sheet · November 20, 2026 | Yes (OOPS repo) | Idea board or mixed source |
| 466 | 38 | `docs/research/hearts-of-iron-iv/pass-2026-10-14-systems/CHECKPOINT.md` | 8.5 KiB | 2026-10-14–2026-10-14 | Deep systems sweep checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 467 | 38 | `docs/research/qud-systems-audit-2026-10-15/SYSTEM_CATALOG.md` | 12.0 KiB | 2026-10-15–2026-10-15 | Relevant-system coverage map | Yes (OOPS repo) | Audit/run output likely |
| 468 | 38 | `docs/systems/MAKING_ITEMS_ECONOMY.md` | 57.8 KiB | 2026-10-23–2026-11-04 | Making, items and economy: the systems map | Yes (OOPS repo) | Idea board or mixed source |
| 469 | 38 | `docs/worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md` | 135.6 KiB | 2026-10-08–2026-10-19 | Identity laws by world, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 470 | 37 | `docs/CROSS_WORLD_SYSTEMS_TRANSFER.md` | 58.4 KiB | 2026-10-13–2026-11-11 | Cross-world systems transfer pattern | Yes (OOPS repo) | Idea board or mixed source |
| 471 | 37 | `docs/emergent/E2_STORYLETS.md` | 50.7 KiB | 2026-10-09–2026-10-13 | E2 Storylets: build-ready draft (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 472 | 37 | `docs/gm/dispatch/procgen-2026-10-13/cr5/MORE.md` | 18.3 KiB | 2026-10-13–2026-10-14 | CR5 more: subtle making, overarching rules and implementation seams | Yes (OOPS repo) | Idea board or mixed source |
| 473 | 37 | `docs/gm/dispatch/procgen-2026-10-13/p15/AUTHORING_PIPELINE.md` | 20.7 KiB | 2026-10-13–2026-10-14 | P15 content-authoring pipeline | Yes (OOPS repo) | Idea board or mixed source |
| 474 | 37 | `docs/gm/dispatch/procgen-2026-10-13/p38/RECEIPT_LOG.md` | 16.8 KiB | 2026-10-13–2026-10-14 | BI2: one settled-outcome log | Yes (OOPS repo) | Audit/run output likely |
| 475 | 37 | `docs/gm/dispatch/procgen-2026-10-13/p39/WAVES.md` | 16.3 KiB | 2026-10-13–2026-10-18 | BJ1: proposed implementation waves | Yes (OOPS repo) | Idea board or mixed source |
| 476 | 37 | `docs/representations/TIME_AND_CHRONICLE.md` | 29.1 KiB | 2026-10-27–2026-10-30 | Time and chronicle representations (proposals, 2026-10-30) | Yes (OOPS repo) | Idea board or mixed source |
| 477 | 37 | `docs/research/hogwarts-games/REPORT.md` | 19.7 KiB | 2018-04-25–2026-10-13 | Hogwarts games: turning a school year into play | Yes (OOPS repo) | Audit/run output likely |
| 478 | 37 | `docs/research/minecraft/audits/WV2_ECONOMY_TIERS.md` | 36.0 KiB | 2026-10-23–2026-10-23 | Economy deep dive: one value scale (ProjectE) versus a growth tier ladder (Mystical Agriculture, Additions) (2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 479 | 37 | `docs/research/minecraft/cultivation-mods-2026-10-25/M4_LOTM_MODS.md` | 50.2 KiB | 2024-08-31–2026-10-25 | M4: Lord of the Mysteries Minecraft mods absorption | Yes (OOPS repo) | Idea board or mixed source |
| 480 | 37 | `docs/worlds/templates/WORLD_CORE_KIT_TEMPLATE.md` | 16.9 KiB | 2026-10-14–2026-10-14 | World core kit: <world> (<date>, proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 481 | 37 | `docs/worlds/world-core-kit-2026-10-14/W33_CALENDAR_ENGINE.md` | 42.7 KiB | 2026-10-14–2026-10-14 | W33: Calendar engine shape | Yes (OOPS repo) | Idea board or mixed source |
| 482 | 36 | `docs/emergent/E5_STORYTELLER_AND_FATE.md` | 38.7 KiB | 2026-10-07–2026-10-15 | E5 Storyteller and fate: build-ready draft (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 483 | 36 | `docs/gm/dispatch/body-lineage-2026-10-14/b9/PATTERNS.md` | 11.4 KiB | 2026-10-14–2026-10-14 | B9 modification patterns | Yes (OOPS repo) | Idea board or mixed source |
| 484 | 36 | `docs/gm/dispatch/cheat-considerations-2026-10-13/W1_PER_WORLD_TYPES_AND_RARITY.md` | 39.7 KiB | 2026-10-13–2026-10-13 | Cheat types per world and cheat rarity | Yes (OOPS repo) | Idea board or mixed source |
| 485 | 36 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g10/REPORT.md` | 19.2 KiB | 2026-10-13–2026-10-13 | R15 G10 remaining leaves | Yes (OOPS repo) | Audit/run output likely |
| 486 | 36 | `docs/gm/dispatch/pc-groups-2026-10-26/material-foundations/implementation-2026-10-26/COVERAGE.md` | 12.2 KiB | 2026-10-26–2026-10-26 | G5 implementation coverage | Yes (OOPS repo) | Audit/run output likely |
| 487 | 36 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r11/REPORT.md` | 26.8 KiB | 2026-10-14–2026-10-14 | R11: implementation implications, measured | Yes (OOPS repo) | Audit/run output likely |
| 488 | 36 | `docs/gm/dispatch/ui-at-scale-2026-10-14/GAME_REFERENCES.md` | 33.7 KiB | 2026-10-13–2026-10-19 | U1: game references for UI at scale | Yes (OOPS repo) | Idea board or mixed source |
| 489 | 36 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/IMPLEMENTATION_COMPLEXITY_REVIEW_2026-10-16.md` | 17.8 KiB | 2026-10-15–2026-10-16 | Farming, building and hidden implementation cost | Yes (OOPS repo) | Audit/run output likely |
| 490 | 36 | `docs/gm/dispatch/world-core-kit-2026-10-14/runs/SESSIONS.md` | 5.2 KiB | 2026-10-14–2026-10-14 | Codex sessions (launched 2026-10-14 00:57) | Yes (OOPS repo) | Idea board or mixed source |
| 491 | 36 | `docs/research/hearts-of-iron-iv/pass-2026-10-14-systems/SMALL_TOUCHES.md` | 5.9 KiB | 2026-10-14–2026-10-14 | Small touches: source-grounded PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 492 | 36 | `docs/research/PROTOLIKE_FORKS_AND_SIMILAR_GAMES_2026-10-30.md` | 27.3 KiB | 2022-10-22–2026-10-30 | Proto23 forks, protolike fork networks and similar games, 2026-10-30 | Yes (OOPS repo) | Idea board or mixed source |
| 493 | 36 | `docs/research/rimworld/pass-2026-10-14-deep/SMALL_TOUCHES.md` | 4.4 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 494 | 36 | `docs/research/theory-of-magic/REPORT.md` | 9.9 KiB | 2026-10-09–2026-10-09 | Theory of Magic source audit, 2026-10-09 | Yes (OOPS repo) | Audit/run output likely |
| 495 | 36 | `docs/worlds/A_SOLDIERS_LIFE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 52.4 KiB | 2026-10-09–2026-10-24 | A Soldier's Life: institutions, roles, subtle details and floor card (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 496 | 36 | `docs/worlds/demon-slayer/REVIEW.md` | 13.4 KiB | 2026-10-20–2026-10-20 | Demon Slayer world-pack review | Yes (OOPS repo) | Audit/run output likely |
| 497 | 36 | `docs/worlds/world-core-kit-2026-10-14/W11_MICRO_MOTION_BY_WORLD.md` | 43.6 KiB | 2026-10-10–2026-10-14 | W11: micro in motion by world (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 498 | 36 | `docs/worlds/world-core-kit-2026-10-14/W15_POWER_CORE_SCHEMA.md` | 56.5 KiB | 2026-10-10–2026-10-15 | W15: one power-core schema across worlds | Yes (OOPS repo) | Idea board or mixed source |
| 499 | 35 | `docs/gm/dispatch/comics-2026-10-14/MORE_COMIC_WORLDS.md` | 54.8 KiB | 2026-10-13–2026-10-14 | K2: more comic worlds | Yes (OOPS repo) | Idea board or mixed source |
| 500 | 35 | `docs/gm/dispatch/connection-detail-2026-10-12/COVERAGE.md` | 8.9 KiB | 2026-10-11–2026-10-12 | Connection coverage and remaining scope | Yes (OOPS repo) | Audit/run output likely |
| 501 | 35 | `docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/L1.md` | 22.9 KiB | 2026-10-24–2026-10-26 | L1: Implement Xiaoxiang-inspired progression and person views | Yes (OOPS repo) | Idea board or mixed source |
| 502 | 35 | `docs/gm/dispatch/pc-groups-2026-10-26/ingredient-substitution/REPORT.md` | 30.0 KiB | 2026-10-25–2026-10-26 | G2: PC7–PC14 | Yes (OOPS repo) | Audit/run output likely |
| 503 | 35 | `docs/gm/dispatch/procgen-2026-10-13/cr1/CONSUMABLE_KINDS.md` | 23.1 KiB | 2026-10-13–2026-10-14 | CR1 consumable kinds | Yes (OOPS repo) | Idea board or mixed source |
| 504 | 35 | `docs/gm/dispatch/procgen-2026-10-13/p19/MORE.md` | 18.6 KiB | 2026-10-13–2026-10-14 | P19: additional social angles, reference lens and world fit | Yes (OOPS repo) | Idea board or mixed source |
| 505 | 35 | `docs/gm/dispatch/procgen-2026-10-13/p23/MORE.md` | 13.0 KiB | 2019-11-13–2026-10-14 | P23 more: references and further inner-life angles | Yes (OOPS repo) | Idea board or mixed source |
| 506 | 35 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r1/INTEGRATION.md` | 7.6 KiB | 2026-10-13–2026-10-14 | R1 integration return | Yes (OOPS repo) | Audit/run output likely |
| 507 | 35 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/cheat-style.md` | 24.2 KiB | 2026-10-15–2026-10-15 | CY: cheat style, CS6 comparison | Yes (OOPS repo) | Idea board or mixed source |
| 508 | 34 | `docs/emergent/E4_TAGS_AND_RULES.md` | 42.5 KiB | 2026-10-09–2026-10-15 | E4. Tags and interaction rules: build-ready draft (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 509 | 34 | `docs/gm/dispatch/cheat-status-window-2026-10-13/R1_REPORT.md` | 14.6 KiB | 2026-10-13–2026-10-14 | R1 stage 0 hardening, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 510 | 34 | `docs/gm/dispatch/procgen-2026-10-13/p31/REPORT.md` | 21.4 KiB | 2026-10-13–2026-10-14 | P31: promises, secrets and faith proposal report | Yes (OOPS repo) | Audit/run output likely |
| 511 | 34 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r9/REPORT.md` | 19.4 KiB | 2026-10-13–2026-10-14 | R9 dedupe and coherence audit | Yes (OOPS repo) | Audit/run output likely |
| 512 | 34 | `docs/research/BROWSER_PLATFORM_BEHAVIOR_2026-10-14.md` | 30.7 KiB | 2026-10-14–2026-10-14 | Browser platform behavior, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 513 | 34 | `docs/research/continuing-traveler-games-2026-10-14/YAIRPG_ABSORPTION_PROPOSALS.md` | 31.1 KiB | 2026-10-13–2026-10-14 | RetroMUD and 4Dimensions: useful absorption into YAIRPG | Yes (OOPS repo) | Idea board or mixed source |
| 514 | 34 | `docs/research/jojo-audit-2026-10-11/DESIGN_AND_ACCEPTANCE.md` | 19.7 KiB | 2026-10-11–2026-10-11 | JoJo audit: world design and implementation acceptance | Yes (OOPS repo) | Audit/run output likely |
| 515 | 34 | `docs/research/KNOWLEDGE_BANK.md` | 19.2 KiB | 2026-11-16–2026-11-16 | OOPS knowledge bank | Yes (OOPS repo) | Idea board or mixed source |
| 516 | 34 | `docs/research/MULTIVERSAL_GAMES_AND_RULEBOOK_GAPS_2026-10-14.md` | 14.9 KiB | 2026-10-14–2026-10-14 | Multiversal games and rulebook gaps | Yes (OOPS repo) | Idea board or mixed source |
| 517 | 34 | `docs/research/proto23/xeus24-mod-2026-10-10/readers/M3_modjs_9400-14038.md` | 39.1 KiB | 2026-10-10–2026-10-10 | M3: Xeus24 mod, mod.js lines 9400-14038 | Yes (OOPS repo) | Idea board or mixed source |
| 518 | 34 | `docs/research/SOURCE_MEDIA_ACQUISITION_SCOUT_2026-10-21.md` | 20.4 KiB | 2026-10-14–2026-10-22 | Unified source library: books, rulebooks, manga and comics | Yes (OOPS repo) | Idea board or mixed source |
| 519 | 34 | `docs/research/tabletop-library-2026-10-14/implementation-considerations/REPORT.md` | 26.6 KiB | 2026-10-13–2026-10-14 | Rulebook implementation considerations | Yes (OOPS repo) | Audit/run output likely |
| 520 | 34 | `docs/worlds/REGRESSORS_TALE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 54.4 KiB | 2026-10-03–2026-10-24 | A Regressor's Tale of Cultivation: institutions, roles and subtle details (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 521 | 34 | `docs/worlds/world-core-kit-2026-10-14/W34_CALENDARS_BOOK_WORLDS.md` | 38.4 KiB | 2026-10-10–2026-10-14 | W34: Canon calendars, book worlds | Yes (OOPS repo) | Idea board or mixed source |
| 522 | 33 | `docs/audits/idea-audit-2026-11-06/LANE_7_TOOLING_RELEASE_SAVES.md` | 15.6 KiB | 2026-11-06–2026-11-06 | Lane 7: tooling, release and saves | Yes (OOPS repo) | Audit/run output likely |
| 523 | 33 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/natural-play-2.md` | 22.4 KiB | 2026-10-14–2026-10-15 | Natural-play second pass, 2026-10-15 | Yes (OOPS repo) | Audit/run output likely |
| 524 | 33 | `docs/gm/dispatch/body-lineage-2026-10-14/b12/NO_CONSUMER.md` | 10.5 KiB | 2026-10-14–2026-10-14 | B12 needs a new consumer | Yes (OOPS repo) | Idea board or mixed source |
| 525 | 33 | `docs/gm/dispatch/connection-detail-2026-10-12/LIFE_DETAIL_DRAFT.md` | 40.2 KiB | 2026-10-11–2026-10-12 | X01–X09 life-detail specialist return | Yes (OOPS repo) | Idea board or mixed source |
| 526 | 33 | `docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/L2.md` | 37.4 KiB | 2026-10-13–2026-10-26 | L2: Implement ChangShengJue-inspired mastery and obligations | Yes (OOPS repo) | Idea board or mixed source |
| 527 | 33 | `docs/gm/dispatch/refinement-audits-2026-10-31/UTOPIA_ENGINE_UI_AUDIT.md` | 45.1 KiB | 2026-10-27–2026-11-01 | Utopia: scene-grounded engine and UI audit | Yes (OOPS repo) | Audit/run output likely |
| 528 | 33 | `docs/gm/dispatch/research-tech-2026-10-14/t2/REPORT.md` | 10.1 KiB | 2026-10-14–2026-10-14 | T2 report: research and technology by world | Yes (OOPS repo) | Audit/run output likely |
| 529 | 33 | `docs/research/additional-cultivation-2026-10-22/REPORT.md` | 25.3 KiB | 2026-10-21–2026-10-22 | Additional cultivation references: C7–C11 | Yes (OOPS repo) | Audit/run output likely |
| 530 | 33 | `docs/research/ATLAS_TRANSLATION_LAYER_PROPOSAL_2026-11-20.md` | 31.5 KiB | 2026-06-23–2026-11-22 | World atlas as a translation layer: proposal (2026-11-20) | Yes (OOPS repo) | Idea board or mixed source |
| 531 | 33 | `docs/research/hogwarts-legacy/REPORT.md` | 21.5 KiB | 2026-10-14–2026-10-14 | Hogwarts Legacy: installed data pass | Yes (OOPS repo) | Audit/run output likely |
| 532 | 33 | `docs/research/itch-io-2026-10-22/OPEN_GAPS.md` | 14.0 KiB | 2026-10-22–2026-10-24 | itch research: open gaps for future work, 2026-10-22 | Yes (OOPS repo) | Idea board or mixed source |
| 533 | 33 | `docs/research/open-idle-games-2026-10-09/PROGRESS_KNIGHT.md` | 23.2 KiB | 2021-07-11–2026-10-09 | Progress Knight source dossier, 2026-10-09 | Yes (OOPS repo) | Idea board or mixed source |
| 534 | 33 | `docs/reviews/WHOLE_PROJECT_GAME_ARCHITECTURE_REVIEW_2026-10-12.md` | 63.3 KiB | 2026-10-05–2026-10-16 | Whole-project game architecture and long-term design review | Yes (OOPS repo) | Audit/run output likely |
| 535 | 33 | `docs/worlds/MOTHER_OF_LEARNING_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 58.6 KiB | 2022-04-29–2026-10-24 | Mother of Learning: institutions, roles, subtle details and floor card (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 536 | 33 | `docs/worlds/NONHUMAN_CLOCKS_LIFESPANS_AND_SEASONS_2026-10-14.md` | 39.9 KiB | 2026-10-10–2026-11-04 | Nonhuman clocks, lifespans and seasons, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 537 | 33 | `docs/worlds/progression-gates-2026-10-23/STUBBORN_SKILL_GRINDER.md` | 34.5 KiB | 2026-10-10–2026-10-23 | Progression gate audit: The Stubborn Skill-Grinder in a Time Loop (83294) | Yes (OOPS repo) | Audit/run output likely |
| 538 | 33 | `docs/worlds/world-core-kit-2026-10-14/W37_SOURCE_FIDELITY.md` | 120.9 KiB | 2026-10-14–2026-10-14 | W37: Source fidelity of native world code | Yes (OOPS repo) | Idea board or mixed source |
| 539 | 32 | `docs/audits/ATLAS_LADDER_SOURCES_2026-11-24.md` | 31.1 KiB | 2026-11-18–2026-11-24 | Atlas evidence ladder, rungs 2-4: sources and receipt design, 2026-11-24 | Yes (OOPS repo) | Audit/run output likely |
| 540 | 32 | `docs/gm/dispatch/refinement-audits-2026-10-31/LEAD_WORLD_ENGINE_SLICE_BRIEF.md` | 79.9 KiB | 2026-10-23–2026-11-04 | LOTM lead engine: full Klein journey and source-ordered playable arcs | Yes (OOPS repo) | Audit/run output likely |
| 541 | 32 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/CLAUDE_ADDENDUM.md` | 16.5 KiB | 2026-10-02–2026-10-14 | Claude addendum to part 29 (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 542 | 32 | `docs/gm/dispatch/research-tech-2026-10-14/t3/GAMES.md` | 26.9 KiB | 2016-05-26–2026-10-14 | T3: additional reference mechanics | Yes (OOPS repo) | Idea board or mixed source |
| 543 | 32 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r2/INTEGRATION.md` | 9.6 KiB | 2026-10-14–2026-10-14 | R2 integration packet | Yes (OOPS repo) | Audit/run output likely |
| 544 | 32 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-c/OUTPUT.md` | 24.2 KiB | 2026-10-14–2026-10-14 | TW-C: chains, extraction and procedural rule readers | Yes (OOPS repo) | Audit/run output likely |
| 545 | 32 | `docs/PROCEDURAL_GRAMMAR_CONTRACT.md` | 34.0 KiB | 2026-11-12–2026-11-14 | Procedural grammar contract v0 | Yes (OOPS repo) | Idea board or mixed source |
| 546 | 32 | `docs/research/bitburner/IMPLEMENTATION_PACKETS.md` | 6.6 KiB | mtime 2026-10-09 (no embedded date) | Original implementation proposals | Yes (OOPS repo) | Idea board or mixed source |
| 547 | 32 | `docs/research/endless-ascent/IMPLEMENTATION_PACKETS.md` | 8.2 KiB | 2026-10-09–2026-10-09 | Original implementation proposals | Yes (OOPS repo) | Idea board or mixed source |
| 548 | 32 | `docs/research/minecraft/cultivation-mods-2026-10-25/M5_XIANXIA_OTHERS.md` | 99.5 KiB | 2026-10-22–2026-10-25 | M5: other xianxia/cultivation Modrinth mods | Yes (OOPS repo) | Idea board or mixed source |
| 549 | 32 | `docs/research/multi-realm-muds/SMALL_TOUCHES.md` | 5.8 KiB | mtime 2026-10-15 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 550 | 32 | `docs/research/naev/pass-2026-10-14-systems/CHECKPOINT.md` | 5.4 KiB | 2026-10-14–2026-10-14 | Naev deep systems checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 551 | 32 | `docs/research/procedural-materials-2026-10-13/deep/LIVING_AND_ECOLOGICAL.md` | 19.4 KiB | 2026-10-13–2026-10-13 | Living, harvested and ecological materials | Yes (OOPS repo) | Idea board or mixed source |
| 552 | 32 | `docs/research/proto23/DISCORD_RESEARCH_2026-10-15.md` | 24.1 KiB | 2026-10-15–2026-10-15 | Arcanum Discord: Proto23 development and YAIR community research | Yes (OOPS repo) | Idea board or mixed source |
| 553 | 32 | `docs/research/proto23/VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md` | 12.2 KiB | 2026-10-13–2026-10-20 | Vivid and Proto23 UI flow: further considerations (2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 554 | 32 | `docs/research/PROTOLIKE_DISCORD_SWEEP_2026-10-24.md` | 25.1 KiB | 2021-10-26–2026-10-25 | Protolike Discord sweep: other developers' UI and design posts, 2026-10-24 | Yes (OOPS repo) | Audit/run output likely |
| 555 | 32 | `docs/research/upload-labs/IMPLEMENTATION_PACKETS.md` | 6.0 KiB | mtime 2026-10-09 (no embedded date) | Upload Labs original adaptation packets | Yes (OOPS repo) | Idea board or mixed source |
| 556 | 32 | `docs/research/warsim/aspects-2026-10-14/SYSTEM_INVENTORY.md` | 41.5 KiB | 2026-10-14–2026-10-14 | Observed system inventory | Yes (OOPS repo) | Audit/run output likely |
| 557 | 32 | `docs/research/warsim/pass-2026-10-14-systems/INVENTORY.md` | 6.1 KiB | 2026-10-14–2026-10-14 | Family inventory and remaining implementation scope | Yes (OOPS repo) | Audit/run output likely |
| 558 | 32 | `docs/worlds/jujutsu/REVIEW.md` | 12.9 KiB | 2026-10-10–2026-10-10 | Independent Jujutsu Kaisen world-pack review | Yes (OOPS repo) | Audit/run output likely |
| 559 | 32 | `docs/worlds/world-depth-2026-10-13/38_PATTERNS_HABITS_AND_QUIET_SYSTEMS.md` | 7.9 KiB | 2026-10-13–2026-10-14 | Patterns, habits and quiet systems (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 560 | 31 | `docs/audits/PROCEDURAL_MAKING_AUDIT_2026-10-26.md` | 20.2 KiB | 2026-10-26–2026-11-04 | Procedural crafting, brewing and adjacent making: inventory and audit | Yes (OOPS repo) | Audit/run output likely |
| 561 | 31 | `docs/emergent/E3_LIVING_PEOPLE.md` | 55.9 KiB | 2026-10-09–2026-10-09 | E3. Living people: build-ready draft (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 562 | 31 | `docs/gm/cross-audit-reconciliation-2026-10-15/RECONCILIATION.md` | 22.5 KiB | 2026-10-11–2026-10-15 | Reconciliation and recovery register | Yes (OOPS repo) | Audit/run output likely |
| 563 | 31 | `docs/gm/dispatch/body-lineage-2026-10-14/b15/TEST_PLAN.md` | 16.1 KiB | 2026-10-14–2026-11-04 | B15/CV1 test plan | Yes (OOPS repo) | Idea board or mixed source |
| 564 | 31 | `docs/gm/dispatch/body-lineage-2026-10-14/b16/MODEL.md` | 10.6 KiB | 2026-10-11–2026-10-14 | B16 model synthesis | Yes (OOPS repo) | Idea board or mixed source |
| 565 | 31 | `docs/gm/dispatch/cheat-implementation-2026-10-23/K4_NEXT_CHEATS.md` | 19.2 KiB | 2026-10-23–2026-10-23 | K4: next cheats after system-quests, ranked by cheapest honest implementation | Yes (OOPS repo) | Idea board or mixed source |
| 566 | 31 | `docs/gm/dispatch/maker-arts-2026-10-14/ITEM_LIFETIMES.md` | 29.4 KiB | 2026-10-13–2026-10-14 | W7: items over a lifetime | Yes (OOPS repo) | Idea board or mixed source |
| 567 | 31 | `docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/L7.md` | 64.7 KiB | 2026-10-10–2026-10-26 | L7: Implement webnovel Gu Memory companion and trial loops | Yes (OOPS repo) | Idea board or mixed source |
| 568 | 31 | `docs/gm/dispatch/palette-completion-2026-10-20/COVERAGE.md` | 7.5 KiB | 2026-10-20–2026-10-20 | Palette coverage and deliberate boundaries | Yes (OOPS repo) | Audit/run output likely |
| 569 | 31 | `docs/gm/dispatch/procgen-2026-10-13/p19/CONTRACT.md` | 18.8 KiB | 2026-10-13–2026-10-14 | P19: social edge, event and browser-budget contract | Yes (OOPS repo) | Idea board or mixed source |
| 570 | 31 | `docs/gm/dispatch/procgen-2026-10-13/p24/REPORT.md` | 17.8 KiB | 2026-10-13–2026-10-14 | P24: knowledge, perspectives and time structures | Yes (OOPS repo) | Audit/run output likely |
| 571 | 31 | `docs/gm/dispatch/research-tech-2026-10-14/t7/REPORT.md` | 10.4 KiB | 2026-10-14–2026-10-14 | T7 report: the invention planner applied to powers | Yes (OOPS repo) | Audit/run output likely |
| 572 | 31 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r3/SOURCES.md` | 12.0 KiB | 2019-01-31–2026-10-14 | R3 source ledger | Yes (OOPS repo) | Audit/run output likely |
| 573 | 31 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r6/INTEGRATION.md` | 17.6 KiB | 2026-10-05–2026-10-14 | R6 integration map | Yes (OOPS repo) | Audit/run output likely |
| 574 | 31 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/part-9-complexity-and-openness.md` | 58.5 KiB | 2026-10-13–2026-10-29 | Part 9: complexity, open world and what to defer | Yes (OOPS repo) | Idea board or mixed source |
| 575 | 31 | `docs/gm/engine-extension-2026-10-08/COMPONENTS.md` | 13.3 KiB | 2026-10-08–2026-10-08 | Live components and corrections | Yes (OOPS repo) | Idea board or mixed source |
| 576 | 31 | `docs/research/hogwarts-legacy/deep/REPORT.md` | 17.8 KiB | 2026-10-14–2026-10-14 | Hogwarts Legacy deep pass | Yes (OOPS repo) | Audit/run output likely |
| 577 | 31 | `docs/research/minecraft/cultivation-mods-2026-10-25/M7_WEBNOVEL_MODS.md` | 54.7 KiB | 2026-10-25–2026-10-25 | M7: webnovel adaptation mods | Yes (OOPS repo) | Idea board or mixed source |
| 578 | 31 | `docs/research/multi-realm-muds/aspects-2026-10-14/SYSTEM_INVENTORY.md` | 6.2 KiB | 2026-10-14–2026-10-14 | Public-system inventory | Yes (OOPS repo) | Audit/run output likely |
| 579 | 31 | `docs/research/power-scaling-2026-10-08/GLOSSARY.md` | 7.5 KiB | 2026-10-08–2026-10-08 | Scaling glossary and game translation | Yes (OOPS repo) | Idea board or mixed source |
| 580 | 31 | `docs/research/siralim-ultimate/pass-2026-10-14-systems/CHECKPOINT.md` | 9.4 KiB | 2026-10-14–2026-10-15 | Deep systems checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 581 | 31 | `docs/ui/EFFECT_UI_STANDARDS_2026-11-18.md` | 25.4 KiB | 2026-11-14–2026-11-18 | Effect, power and time-ability UI standards (EU1-EU22) | Yes (OOPS repo) | Idea board or mixed source |
| 582 | 31 | `docs/worlds/bleach/REVIEW.md` | 12.9 KiB | 2026-10-14–2026-10-14 | Independent Bleach world-pack review | Yes (OOPS repo) | Audit/run output likely |
| 583 | 30 | `docs/audits/cross-world-foundations-2026-11-06/LANE_H_HOSTS_REGISTER.md` | 25.0 KiB | 2026-11-06–2026-11-06 | Lane H: world-neutral hosts and the seam adoption register (2026-11-06) | Yes (OOPS repo) | Audit/run output likely |
| 584 | 30 | `docs/audits/materials_tags_2026-10-19/IX_A_INTERACTION_MODEL.md` | 23.9 KiB | 2026-10-19–2026-11-04 | IX-A: can unbounded interactions be data on the existing craft law? | Yes (OOPS repo) | Audit/run output likely |
| 585 | 30 | `docs/audits/TOOLSETS_AUDIT_2026-10-21.md` | 20.1 KiB | 2026-10-14–2026-11-04 | Toolsets audit, 2026-10-21 | Yes (OOPS repo) | Audit/run output likely |
| 586 | 30 | `docs/gm/dispatch/body-lineage-2026-10-14/b17/CORRECTIONS.md` | 9.3 KiB | 2026-10-14–2026-10-14 | B17 corrections: G75-G77 | Yes (OOPS repo) | Idea board or mixed source |
| 587 | 30 | `docs/gm/dispatch/body-lineage-2026-10-14/b7/CONSISTENCY.md` | 17.5 KiB | 2026-10-14–2026-10-14 | G48-B7.C: fixed bodies, inheritance and observer knowledge | Yes (OOPS repo) | Idea board or mixed source |
| 588 | 30 | `docs/gm/dispatch/cheat-implementation-2026-10-23/K6_MODULES.md` | 18.2 KiB | 2026-10-23–2026-10-23 | K6: Cheat modules and the existing module system | Yes (OOPS repo) | Idea board or mixed source |
| 589 | 30 | `docs/gm/dispatch/companions-2026-10-14/IDLE_AND_PRESTIGE.md` | 24.7 KiB | 2026-10-14–2026-10-14 | C8: Companions in idle time and the first prestige layer | Yes (OOPS repo) | Idea board or mixed source |
| 590 | 30 | `docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md` | 144.4 KiB | 2026-10-30–2026-11-09 | Cross-world systems: task record | Yes (OOPS repo) | Audit/run output likely |
| 591 | 30 | `docs/gm/dispatch/procgen-2026-10-13/gx4/REPORT.md` | 24.1 KiB | 2026-10-13–2026-10-14 | GX4 generation framework after wave 1 | Yes (OOPS repo) | Audit/run output likely |
| 592 | 30 | `docs/gm/dispatch/procgen-2026-10-13/p15/MORE.md` | 11.0 KiB | 2026-10-13–2026-10-14 | P15 more: additional text and authoring angles | Yes (OOPS repo) | Idea board or mixed source |
| 593 | 30 | `docs/gm/dispatch/procgen-2026-10-13/p22/MORE.md` | 8.5 KiB | 2026-10-13–2026-10-14 | Further director-tool angles | Yes (OOPS repo) | Idea board or mixed source |
| 594 | 30 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/RV5_CHECKPOINT.md` | 19.1 KiB | 2026-10-27–2026-10-29 | RV5 checkpoint: reviewed-row ingest and replay mapping | Yes (OOPS repo) | Audit/run output likely |
| 595 | 30 | `docs/gm/life-sim-foundation-2026-10-07/SOURCE_NOTES.md` | 11.2 KiB | 2026-10-07–2026-10-07 | Long-save source notes | Yes (OOPS repo) | Idea board or mixed source |
| 596 | 30 | `docs/gm/RECONCILIATION_2026-10-25.md` | 49.6 KiB | 2026-10-23–2026-10-25 | Worktree reconciliation, round 3, 2026-10-25 | Yes (OOPS repo) | Audit/run output likely |
| 597 | 30 | `docs/research/academagia/pass-2026-10-14-systems/SMALL_TOUCHES.md` | 2.8 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 598 | 30 | `docs/research/DOWNLOAD_SCOUT_NEXT_2026-10-31.md` | 42.3 KiB | 2026-10-10–2026-11-01 | Next source-download scout, 2026-10-31 | Yes (OOPS repo) | Idea board or mixed source |
| 599 | 30 | `docs/research/fanfic/readers-2026-10-10/popular_western_works.md` | 18.8 KiB | 2026-10-10–2026-10-10 | Popular Western fan fiction and web fiction: mechanics survey | Yes (OOPS repo) | Idea board or mixed source |
| 600 | 30 | `docs/research/format-and-character-art-2026-10-14/RECONCILIATION_PARTS_1-3.md` | 13.3 KiB | 2026-10-02–2026-11-04 | Format reconciliation, parts 1–3 | Yes (OOPS repo) | Audit/run output likely |
| 601 | 30 | `docs/research/game-research-adoption-reaudit-2026-10-14/UNPARK_PACKETS.md` | 28.9 KiB | 2026-10-14–2026-11-04 | Unpark packets, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 602 | 30 | `docs/research/hearts-of-iron-iv/SMALL_TOUCHES.md` | 4.6 KiB | mtime 2026-10-14 (no embedded date) | Small touches palette | Yes (OOPS repo) | Idea board or mixed source |
| 603 | 30 | `docs/research/hyperrogue/pass-2026-10-14-systems/SMALL_TOUCHES.md` | 5.0 KiB | 2026-10-14–2026-10-14 | Small touches from the deeper sweep | Yes (OOPS repo) | Audit/run output likely |
| 604 | 30 | `docs/research/kenshi/second-pass/SMALL_TOUCHES.md` | 5.9 KiB | 2026-10-08–2026-10-08 | Thirty small touches mapped to vanilla YAIR | Yes (OOPS repo) | Idea board or mixed source |
| 605 | 30 | `docs/research/kingdom-hearts/SMALL_TOUCHES.md` | 4.6 KiB | mtime 2026-10-15 (no embedded date) | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 606 | 30 | `docs/research/LORE_EDGE_CASES_2026-11-09.md` | 32.4 KiB | 2026-10-14–2026-11-09 | Power and progression edge cases from lore discussions | Yes (OOPS repo) | Idea board or mixed source |
| 607 | 30 | `docs/research/majoras-mask/REPORT.md` | 18.4 KiB | 2026-10-08–2026-10-13 | Majora’s Mask: clock, notebook and reset model | Yes (OOPS repo) | Audit/run output likely |
| 608 | 30 | `docs/research/MINECRAFT_MODPACK_SCOUT_2026-10-14-report.md` | 19.7 KiB | 2026-10-14–2026-10-14 | Minecraft mods, materials, research and quest packs | Yes (OOPS repo) | Audit/run output likely |
| 609 | 30 | `docs/research/minecraft/cultivation-mods-2026-10-25/M3_ASCENSION.md` | 50.0 KiB | 2022-04-11–2026-10-25 | M3: Ascension (MrEizy), source absorption audit | Yes (OOPS repo) | Audit/run output likely |
| 610 | 30 | `docs/research/modding-tree/pass-2026-10-14/SMALL_TOUCHES.md` | 3.4 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 611 | 30 | `docs/research/naev/SMALL_TOUCHES.md` | 8.0 KiB | mtime 2026-10-15 (no embedded date) | Naev small touches | Yes (OOPS repo) | Idea board or mixed source |
| 612 | 30 | `docs/research/open-idle-games-2026-10-09/EVOLVE.md` | 23.7 KiB | 2026-10-09–2026-10-09 | Evolve source audit, 2026-10-09 | Yes (OOPS repo) | Audit/run output likely |
| 613 | 30 | `docs/research/open-idle-games-2026-10-09/SMALL_TOUCHES.md` | 5.1 KiB | 2026-10-09–2026-10-09 | Thirty small touches for vanilla YAIR | Yes (OOPS repo) | Idea board or mixed source |
| 614 | 30 | `docs/research/PANEL_DESIGN_ABSORPTION_2026-10-15.md` | 21.1 KiB | 2026-10-15–2026-10-15 | Panel design absorption from text, idle and menu-heavy games | Yes (OOPS repo) | Idea board or mixed source |
| 615 | 30 | `docs/research/power-catalogues-2026-11-16/MECHANISM_FOUNDATION_2026-11-18.md` | 27.4 KiB | 2026-11-10–2026-11-18 | Mechanism foundation: express nearly any ability as data (2026-11-18, proposals) | Yes (OOPS repo) | Audit/run output likely |
| 616 | 30 | `docs/research/procedural-materials-2026-10-13/deep/ARCANE_AND_BOOK_ATLAS.md` | 17.7 KiB | 2026-10-09–2026-10-13 | Arcane materials and book-world procedural contracts | Yes (OOPS repo) | Idea board or mixed source |
| 617 | 30 | `docs/research/rimworld/aspects-2026-10-14/SMALL_TOUCHES.md` | 4.6 KiB | 2026-10-14–2026-10-14 | Source-grounded small touches | Yes (OOPS repo) | Idea board or mixed source |
| 618 | 30 | `docs/research/rimworld/feature-pass-2026-10-14/SMALL_TOUCHES.md` | 2.8 KiB | 2026-10-14–2026-10-14 | Small touches, proposed | Yes (OOPS repo) | Idea board or mixed source |
| 619 | 30 | `docs/research/rimworld/pass-2026-10-14-systems/SMALL_TOUCHES.md` | 4.6 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 620 | 30 | `docs/research/scroll-of-taiwu/pass-2026-10-14-systems/SMALL_TOUCHES.md` | 3.6 KiB | 2026-10-14–2026-10-14 | Thirty small touches | Yes (OOPS repo) | Idea board or mixed source |
| 621 | 30 | `docs/research/vagrus/SMALL_TOUCHES.md` | 4.3 KiB | mtime 2026-10-10 (no embedded date) | Vagrus small touches | Yes (OOPS repo) | Idea board or mixed source |
| 622 | 30 | `docs/research/vintage-story/SMALL_TOUCHES.md` | 2.3 KiB | mtime 2026-10-15 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 623 | 30 | `docs/research/your-chronicle/pass-2026-10-14/SMALL_TOUCHES.md` | 3.0 KiB | 2026-10-14–2026-10-14 | Small touches worth considering | Yes (OOPS repo) | Idea board or mixed source |
| 624 | 30 | `docs/worlds/bleach/SOURCE_LEDGER.md` | 23.2 KiB | 2023-12-27–2026-10-14 | Bleach source ledger | Yes (OOPS repo) | Audit/run output likely |
| 625 | 30 | `docs/worlds/RESEARCH_TALENTS_PROGRESSION_AND_STARTS_2026-10-13.md` | 22.1 KiB | 2026-10-13–2026-10-13 | Research, talents, progression and starting play | Yes (OOPS repo) | Idea board or mixed source |
| 626 | 30 | `docs/worlds/world-core-kit-2026-10-14/cards/godclads.md` | 14.9 KiB | 2026-10-14–2026-10-25 | World core kit: Godclads 1–2 (2026-10-25, proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 627 | 30 | `docs/worlds/world-core-kit-2026-10-14/W12_SIGNALS_RIPPLES.md` | 78.0 KiB | 2026-10-10–2026-10-14 | W12: signals and ripples by world | Yes (OOPS repo) | Idea board or mixed source |
| 628 | 30 | `docs/worlds/world-core-kit-2026-10-14/W14_IMPLEMENTATION_SPECS.md` | 32.9 KiB | 2026-10-13–2026-10-14 | W14: IO3, IO5 and IO6 implementation proposals | Yes (OOPS repo) | Idea board or mixed source |
| 629 | 30 | `docs/worlds/world-depth-2026-10-13/31_INNER_LIFE_HOUSEHOLD_COMMUNITY.md` | 9.1 KiB | 2026-10-02–2026-10-19 | Inner life, household and community (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 630 | 30 | `docs/worlds/world-depth-2026-10-13/39_OVERARCHING_PRINCIPLES.md` | 7.3 KiB | 2026-10-13–2026-10-14 | Overarching principles across parts 28-38 (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 631 | 29 | `docs/audits/idea-audit-2026-11-06/COMPLETION_02_RELEASE_AND_HISTORICAL_QUEUES.md` | 10.1 KiB | 2026-11-06–2026-11-06 | Completion batch 2: release identity and historical queues | Yes (OOPS repo) | Audit/run output likely |
| 632 | 29 | `docs/audits/world_dials_2026-10-19/L2_RESOLVER_FEASIBILITY.md` | 21.3 KiB | 2026-10-17–2026-11-04 | L2: can the existing resolver carry world dials? (WR3, WR8, one heredity dial) | Yes (OOPS repo) | Audit/run output likely |
| 633 | 29 | `docs/EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md` | 31.1 KiB | 2026-10-15–2026-11-04 | Equipment stat dimensions: many stats at once, affixes and sockets | Yes (OOPS repo) | Idea board or mixed source |
| 634 | 29 | `docs/gm/dispatch/companions-2026-10-14/PRESENTATION.md` | 27.8 KiB | 2026-10-13–2026-10-14 | C10: companion micro-lines in the desktop UI | Yes (OOPS repo) | Idea board or mixed source |
| 635 | 29 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/HORIZON.md` | 13.3 KiB | 2026-10-13–2026-10-13 | Bounded implementation horizon | Yes (OOPS repo) | Idea board or mixed source |
| 636 | 29 | `docs/gm/dispatch/foundation-completion-2026-10-12/FOUNDATION_LEDGER.md` | 66.4 KiB | 2026-10-12–2026-10-12 | Foundation completion ledger | Yes (OOPS repo) | Audit/run output likely |
| 637 | 29 | `docs/gm/dispatch/foundation-p-2026-11-12/CHECKPOINT.md` | 22.4 KiB | 2026-11-11–2026-11-12 | Foundation P checkpoint, 2026-11-12: grammar contract, effect grammar, layers, coverage tooling, backward search and W lowering (phase 5) | Yes (OOPS repo) | Audit/run output likely |
| 638 | 29 | `docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/L8.md` | 53.1 KiB | 2026-10-24–2026-10-26 | L8: Implement player feedback fixes and integrate Minecraft lanes | Yes (OOPS repo) | Idea board or mixed source |
| 639 | 29 | `docs/gm/dispatch/procgen-2026-10-13/p12/CONTRACT.md` | 20.4 KiB | 2026-10-13–2026-10-14 | P12 contract: one causal arc instance over P3, P4 and N1 | Yes (OOPS repo) | Idea board or mixed source |
| 640 | 29 | `docs/gm/dispatch/procgen-2026-10-13/p26/MORE.md` | 8.7 KiB | 2026-10-13–2026-10-14 | More P26 considerations with concrete extensions | Yes (OOPS repo) | Idea board or mixed source |
| 641 | 29 | `docs/gm/dispatch/procgen-2026-10-13/p28/MORE.md` | 10.6 KiB | 2026-10-13–2026-10-14 | P28 further angles and concrete suggestions | Yes (OOPS repo) | Idea board or mixed source |
| 642 | 29 | `docs/gm/dispatch/systems-cheats-expansion-2026-10-11/specialists/progression.md` | 32.2 KiB | 2026-10-10–2026-10-11 | Progression, cheats, causal bridges and fictional Systems | Yes (OOPS repo) | Idea board or mixed source |
| 643 | 29 | `docs/research/local-ai-2026-10-14/REPORT.md` | 31.3 KiB | 2026-10-13–2026-10-14 | Local AI for YAIR and the desktop companion | Yes (OOPS repo) | Audit/run output likely |
| 644 | 29 | `docs/research/OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md` | 25.5 KiB | 2026-10-14–2026-10-14 | Offline time and branch clocks audit, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 645 | 29 | `docs/research/outer-wilds/REPORT.md` | 21.8 KiB | 2026-10-08–2026-10-13 | Outer Wilds: knowledge as progress (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 646 | 29 | `docs/research/siralim-ultimate/pass-2026-10-14-systems/SYSTEMS.md` | 35.4 KiB | 2026-10-14–2026-10-14 | Siralim Ultimate: deeper systems | Yes (OOPS repo) | Idea board or mixed source |
| 647 | 29 | `docs/research/ur-quan-masters/SOURCES.md` | 7.2 KiB | 2026-10-14–2026-10-14 | Pinned evidence, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 648 | 29 | `docs/UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md` | 11.2 KiB | 2026-10-14–2026-11-04 | Surface types, world-start menus and the drawing board | Yes (OOPS repo) | Idea board or mixed source |
| 649 | 28 | `docs/audits/COMBAT_ACTION_COVERAGE_2026-11-13.md` | 13.1 KiB | 2026-11-09–2026-11-13 | Combat action coverage count · 2026-11-13 | Yes (OOPS repo) | Audit/run output likely |
| 650 | 28 | `docs/audits/gap-audit-2026-10-30/ui_cov.md` | 28.9 KiB | 2026-10-30–2026-10-30 | UI coverage audit, 2026-10-30 (1920x1080, desktop just) | Yes (OOPS repo) | Audit/run output likely |
| 651 | 28 | `docs/gm/dispatch/batch-reading-2026-10-27/NOV1_SCHEDULE.md` | 28.7 KiB | 2026-10-06–2026-11-04 | Batched reading: schedule to Nov 1 (2026-10-28) | Yes (OOPS repo) | Idea board or mixed source |
| 652 | 28 | `docs/gm/dispatch/body-lineage-2026-10-14/b15/CARDS.md` | 45.6 KiB | 2026-10-10–2026-10-14 | B15 body cheat cards, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 653 | 28 | `docs/gm/dispatch/canon-events-2026-10-14/pilot-mol/LESSONS.md` | 10.4 KiB | 2026-10-14–2026-10-14 | Mother of Learning canon event graph pilot lessons | Yes (OOPS repo) | Idea board or mixed source |
| 654 | 28 | `docs/gm/dispatch/companions-2026-10-14/C14_REPORT.md` | 10.5 KiB | 2026-10-13–2026-10-14 | C14 report: comic companions | Yes (OOPS repo) | Audit/run output likely |
| 655 | 28 | `docs/gm/dispatch/maker-arts-2026-10-14/W3_REPORT.md` | 7.1 KiB | 2026-10-13–2026-10-14 | W3 report: maker reveal cheats | Yes (OOPS repo) | Audit/run output likely |
| 656 | 28 | `docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/L5.md` | 44.7 KiB | 2026-10-24–2026-10-26 | L5: Implement cultivation alchemy roots and trial mechanisms | Yes (OOPS repo) | Idea board or mixed source |
| 657 | 28 | `docs/gm/dispatch/palette-completion-2026-10-20/AUDIT.md` | 8.3 KiB | 2026-10-20–2026-10-20 | Palette implementation audit | Yes (OOPS repo) | Audit/run output likely |
| 658 | 28 | `docs/gm/dispatch/procgen-2026-10-13/gx2/SOURCE_MAP.md` | 10.2 KiB | 2026-10-13–2026-11-04 | GX2 live seam map | Yes (OOPS repo) | Idea board or mixed source |
| 659 | 28 | `docs/gm/dispatch/procgen-2026-10-13/p23/REPORT.md` | 18.0 KiB | 2026-10-13–2026-10-14 | P23 report: inner life, ambitions, moral texture and story progression | Yes (OOPS repo) | Audit/run output likely |
| 660 | 28 | `docs/gm/dispatch/procgen-2026-10-13/p27/MORE.md` | 12.5 KiB | 2026-10-13–2026-10-14 | P27 further angles and reference comparisons | Yes (OOPS repo) | Idea board or mixed source |
| 661 | 28 | `docs/gm/dispatch/procgen-2026-10-13/p9/REPORT.md` | 22.7 KiB | 2026-10-13–2026-11-04 | P9: book-world generation profiles | Yes (OOPS repo) | Audit/run output likely |
| 662 | 28 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r4/INTEGRATION.md` | 10.2 KiB | 2026-10-14–2026-10-14 | R4 integration packet | Yes (OOPS repo) | Audit/run output likely |
| 663 | 28 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r4/SPOILERS.md` | 56.1 KiB | 2023-11-27–2026-10-14 | R4 spoiler evidence and NE eligibility | Yes (OOPS repo) | Idea board or mixed source |
| 664 | 28 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U7_REPORT.md` | 6.7 KiB | 2026-10-14–2026-10-14 | U7 report: maps, charts and economy views | Yes (OOPS repo) | Audit/run output likely |
| 665 | 28 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/r21-feedback-2026-10-17.md` | 12.7 KiB | 2026-10-13–2026-10-17 | R21 feedback: using the freed space, 2026-10-17 | Yes (OOPS repo) | Idea board or mixed source |
| 666 | 28 | `docs/representations/BODY_AND_CONDITIONS.md` | 23.6 KiB | 2026-10-29–2026-10-30 | Body, conditions and altered states (proposals, 2026-10-30) | Yes (OOPS repo) | Idea board or mixed source |
| 667 | 28 | `docs/research/academagia/pass-2026-10-14-adventures/SMALL_TOUCHES.md` | 2.5 KiB | 2026-10-14–2026-10-14 | Small touches, PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 668 | 28 | `docs/research/bitlife/REPORT.md` | 16.7 KiB | 2019-03-26–2026-10-13 | BitLife: mass-market text life simulation | Yes (OOPS repo) | Audit/run output likely |
| 669 | 28 | `docs/research/cultivation-idlers/path-of-the-idle-cultivator/SMALL_TOUCHES.md` | 3.3 KiB | mtime 2026-10-14 (no embedded date) | Small touches: PROPOSALS just | Yes (OOPS repo) | Idea board or mixed source |
| 670 | 28 | `docs/research/discworld-mud/pass-2026-10-14/SMALL_TOUCHES.md` | 2.7 KiB | 2026-10-14–2026-10-14 | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 671 | 28 | `docs/research/hearts-of-iron-iv/aspects-2026-10-14/SMALL_TOUCHES.md` | 3.8 KiB | 2026-10-14–2026-10-14 | Small touches: 28 source-grounded proposals | Yes (OOPS repo) | Idea board or mixed source |
| 672 | 28 | `docs/research/hyperrogue/SMALL_TOUCHES.md` | 4.6 KiB | mtime 2026-10-15 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 673 | 28 | `docs/research/idle-reincarnator/SMALL_TOUCHES.md` | 3.3 KiB | mtime 2026-10-14 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 674 | 28 | `docs/research/kenshi/second-pass/SETTLEMENTS.md` | 19.7 KiB | 2026-10-08–2026-10-08 | Settlements, work and faction consequences, second pass | Yes (OOPS repo) | Idea board or mixed source |
| 675 | 28 | `docs/research/kingdom-of-loathing/pass-2026-10-14/SMALL_TOUCHES.md` | 2.4 KiB | 2026-10-14–2026-10-14 | Small touches to consider | Yes (OOPS repo) | Idea board or mixed source |
| 676 | 28 | `docs/research/minecraft/ENGINE_MAPPING_2026-11-08.md` | 90.2 KiB | 2026-11-08–2026-11-08 | Minecraft research mapped onto the engines, 2026-11-08 | Yes (OOPS repo) | Idea board or mixed source |
| 677 | 28 | `docs/research/power-scaling-2026-10-08/SOURCES.md` | 11.7 KiB | 2026-10-08–2026-10-08 | Sources, coverage and uncertainty | Yes (OOPS repo) | Audit/run output likely |
| 678 | 28 | `docs/research/RI_COMMUNITY_ANSWERS_2026-11-24.md` | 20.5 KiB | 2026-11-24–2026-11-24 | Reverend Insanity community answers and atlas ideaboard gaps (2026-11-24) | Yes (OOPS repo) | Idea board or mixed source |
| 679 | 28 | `docs/research/scroll-of-taiwu/pass-2026-10-14-deep/SMALL_TOUCHES.md` | 3.3 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 680 | 28 | `docs/research/ur-quan-masters/SMALL_TOUCHES.md` | 4.8 KiB | mtime 2026-10-15 (no embedded date) | Twenty-eight small touches | Yes (OOPS repo) | Idea board or mixed source |
| 681 | 28 | `docs/research/zhutian-shuabao-lu/SMALL_TOUCHES.md` | 3.3 KiB | mtime 2026-10-15 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 682 | 28 | `docs/reviews/FOUNDATION_FRESH_PERSPECTIVE_PACKET_2026-10-12.md` | 25.2 KiB | 2026-10-11–2026-11-04 | Shared foundations: self-contained fresh-perspective review packet | Yes (OOPS repo) | Audit/run output likely |
| 683 | 27 | `docs/gm/dispatch/cheat-implementation-2026-10-23/K5_BASE_CHEAT_GROWTH.md` | 15.9 KiB | 2026-10-23–2026-10-23 | K5: How the base cheat grows | Yes (OOPS repo) | Idea board or mixed source |
| 684 | 27 | `docs/gm/dispatch/combat-2026-10-18/C2_REFERENCES_AND_WORLDS.md` | 20.7 KiB | 2026-10-14–2026-10-18 | C2: combat and conflict, references and world canon | Yes (OOPS repo) | Idea board or mixed source |
| 685 | 27 | `docs/gm/dispatch/comics-2026-10-14/K3_REPORT.md` | 12.9 KiB | 2026-10-13–2026-10-14 | K3 report: medium to text UI | Yes (OOPS repo) | Audit/run output likely |
| 686 | 27 | `docs/gm/dispatch/companions-2026-10-14/C13_REPORT.md` | 9.2 KiB | 2026-10-14–2026-10-14 | C13 report: implementation implications, consolidated | Yes (OOPS repo) | Audit/run output likely |
| 687 | 27 | `docs/gm/dispatch/connection-detail-2026-10-12/POSSIBILITY_DETAIL_DRAFT.md` | 44.4 KiB | 2026-10-11–2026-10-12 | Possibility detail draft: X10–X18 | Yes (OOPS repo) | Idea board or mixed source |
| 688 | 27 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g2/REPORT.md` | 12.5 KiB | 2026-10-13–2026-10-13 | R15 G2 production verification | Yes (OOPS repo) | Audit/run output likely |
| 689 | 27 | `docs/gm/dispatch/procgen-2026-10-13/cr2/REPORT.md` | 17.3 KiB | 2026-10-13–2026-10-14 | CR2 world crafting laws report | Yes (OOPS repo) | Audit/run output likely |
| 690 | 27 | `docs/gm/dispatch/procgen-2026-10-13/cr6/REPORT.md` | 18.4 KiB | 2026-10-13–2026-10-14 | CR6 crafting wave 2 build packet | Yes (OOPS repo) | Audit/run output likely |
| 691 | 27 | `docs/gm/dispatch/procgen-2026-10-13/p30/MORE.md` | 11.3 KiB | 2026-10-13–2026-10-14 | More stories across bodies and generations | Yes (OOPS repo) | Idea board or mixed source |
| 692 | 27 | `docs/gm/dispatch/research-tech-2026-10-14/t15/REPORT.md` | 10.0 KiB | 2026-10-11–2026-10-14 | T15 report: comic research, technology and revealers | Yes (OOPS repo) | Audit/run output likely |
| 693 | 27 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r9/COMPACT_REPLACEMENT_OUTLINE.md` | 16.5 KiB | 2026-10-14–2026-10-14 | Proposed compact replacement outline for part 22 sections 8-20 | Yes (OOPS repo) | Idea board or mixed source |
| 694 | 27 | `docs/gm/dispatch/ui-foundation-2026-10-15/CLAUDE_HANDOFF.md` | 21.7 KiB | 2026-10-15–2026-10-15 | Claude continuation: desktop UI, native information and connected references | Yes (OOPS repo) | Audit/run output likely |
| 695 | 27 | `docs/gm/PROJECT_LOG_2026-10-29.md` | 252.0 KiB | 2026-10-01–2026-11-17 | OOPS project log (PROJECT.md, 2026-10-07 to 2026-10-29) | Yes (OOPS repo) | Idea board or mixed source |
| 696 | 27 | `docs/representations/COMBAT.md` | 47.8 KiB | 2026-10-29–2026-10-30 | Combat and conflict representation (proposals, 2026-10-30) | Yes (OOPS repo) | Idea board or mixed source |
| 697 | 27 | `docs/research/feature-game-scout-2026-10-14/FOLD_PROPOSAL.md` | 20.8 KiB | 2026-10-14–2026-10-14 | Feature scout fold proposal, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 698 | 27 | `docs/research/GU_AND_HOGWARTS_RULE_DERIVATION_2026-11-11.md` | 55.0 KiB | 2026-11-11–2026-11-11 | Gu and Hogwarts rule derivation, 2026-11-11 | Yes (OOPS repo) | Idea board or mixed source |
| 699 | 27 | `docs/research/minecraft/audits/MR_MAGIC_RESEARCH.md` | 21.0 KiB | 2026-10-14–2026-10-14 | MR: magic research and knowledge unlocks (Minecraft corpus audit, 2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 700 | 27 | `docs/research/procedural-materials-2026-10-13/deep/RULE_CONTRACTS.md` | 20.0 KiB | 2026-10-13–2026-10-13 | Executable procedural rule contract, proposed | Yes (OOPS repo) | Idea board or mixed source |
| 701 | 27 | `docs/research/PROFILE_AND_BRANCH_SAVE_SHAPE_2026-10-14.md` | 32.4 KiB | 2026-10-14–2026-10-14 | One profile, many branches: save-shape audit | Yes (OOPS repo) | Audit/run output likely |
| 702 | 27 | `docs/research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md` | 28.3 KiB | 2026-10-12–2026-11-04 | Start and branch integration map | Yes (OOPS repo) | Audit/run output likely |
| 703 | 27 | `docs/research/the-lands-of-eldyn/IMPLEMENTATION_PACKETS.md` | 5.5 KiB | mtime 2026-10-09 (no embedded date) | Eldyn-derived interface packets | Yes (OOPS repo) | Idea board or mixed source |
| 704 | 27 | `docs/research/the-strange-tabletop/aspects-2026-10-14/SYSTEM_INVENTORY.md` | 3.7 KiB | 2026-10-14–2026-10-14 | System inventory: inspected public corpus | Yes (OOPS repo) | Audit/run output likely |
| 705 | 27 | `docs/reviews/FOUNDATION_CONSIDERATIONS_2026-10-16.md` | 9.3 KiB | 2026-10-14–2026-11-04 | Foundation considerations, 2026-10-16 | Yes (OOPS repo) | Audit/run output likely |
| 706 | 27 | `docs/reviews/ui-distinct-forms-2026-11-10/R3_ACCESSIBILITY_AND_COST.md` | 22.7 KiB | 2026-11-10–2026-11-10 | R3: accessible diagrams and rendering cost (2026-11-10) | Yes (OOPS repo) | Audit/run output likely |
| 707 | 27 | `docs/worlds/hunter-x-hunter/IMPLEMENTATION_PACKET.md` | 8.7 KiB | 2026-10-14–2026-10-14 | Hunter × Hunter implementation packet proposal | Yes (OOPS repo) | Idea board or mixed source |
| 708 | 27 | `docs/worlds/one-piece/REVIEW.md` | 13.8 KiB | mtime 2026-10-15 (no embedded date) | One Piece world-pack independent review | Yes (OOPS repo) | Audit/run output likely |
| 709 | 27 | `docs/worlds/paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md` | 48.3 KiB | 2026-10-13–2026-10-14 | Paradise hub life, economy and people | Yes (OOPS repo) | Idea board or mixed source |
| 710 | 27 | `docs/worlds/world-core-kit-2026-10-14/W4_PLACES_CRAFT_LOOP_LOOK.md` | 69.2 KiB | 2026-10-10–2026-10-14 | W4: places, craft, signature loops and presentation | Yes (OOPS repo) | Idea board or mixed source |
| 711 | 26 | `docs/audits/DESCRIPTOR_RULES_AUDIT_2026-11-22.md` | 9.3 KiB | 2026-11-21–2026-11-22 | Rules that force filler words (2026-11-22) | Yes (OOPS repo) | Audit/run output likely |
| 712 | 26 | `docs/audits/materials_tags_2026-10-19/MQ_B_DISPLAY_PLACEMENT.md` | 21.2 KiB | 2026-10-17–2026-11-04 | MQ-B: display and placement for materials, sources and tags (UV1 to UV14) | Yes (OOPS repo) | Audit/run output likely |
| 713 | 26 | `docs/audits/world_dials_2026-10-19/L1_FACT_VOCABULARY.md` | 30.9 KiB | 2026-10-17–2026-11-04 | L1: Governance for the open rule-fact vocabulary | Yes (OOPS repo) | Audit/run output likely |
| 714 | 26 | `docs/gm/causal-endings/FATE_FIXTURE_MATRIX_2026-11-10.md` | 32.7 KiB | 2026-10-29–2026-11-10 | Fate fixture matrix and STY24-STY32 wording check | Yes (OOPS repo) | Idea board or mixed source |
| 715 | 26 | `docs/gm/dispatch/body-lineage-2026-10-14/b16/ROADMAP.md` | 18.3 KiB | 2026-10-14–2026-11-04 | B16 candidate build order and budgets | Yes (OOPS repo) | Idea board or mixed source |
| 716 | 26 | `docs/gm/dispatch/book-ui-wave-2026-10-30/PLAN.md` | 36.5 KiB | 2026-10-25–2026-11-02 | Book UI and feature wave (2026-10-30) | Yes (OOPS repo) | Idea board or mixed source |
| 717 | 26 | `docs/gm/dispatch/canon-events-2026-10-14/cxcards/NOTES.md` | 12.0 KiB | 2026-10-13–2026-10-19 | CX cheat cards: proposal notes, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 718 | 26 | `docs/gm/dispatch/companions-2026-10-14/C15_REPORT.md` | 8.2 KiB | 2026-10-14–2026-10-14 | C15 report: companion crafting and research | Yes (OOPS repo) | Audit/run output likely |
| 719 | 26 | `docs/gm/dispatch/foundation-a-2026-11-12/CHECKPOINT.md` | 23.0 KiB | 2026-11-12–2026-11-12 | Foundation A · Agency, checkpoint 2026-11-12 | Yes (OOPS repo) | Audit/run output likely |
| 720 | 26 | `docs/gm/dispatch/high-tier-power-2026-10-23/LOCATOR_CHECK_LOTM.md` | 13.2 KiB | 2026-10-23–2026-10-23 | LOTM locator check (lane D), 2026-10-23 | Yes (OOPS repo) | Idea board or mixed source |
| 721 | 26 | `docs/gm/dispatch/maker-arts-2026-10-14/W7_REPORT.md` | 6.7 KiB | 2026-10-13–2026-10-14 | W7 report: item lifetimes | Yes (OOPS repo) | Audit/run output likely |
| 722 | 26 | `docs/gm/dispatch/pc-groups-2026-10-26/weather-environment/implementation/W5.md` | 29.6 KiB | 2026-10-26–2026-10-26 | W5: Implement seasonal ecology and supply | Yes (OOPS repo) | Idea board or mixed source |
| 723 | 26 | `docs/gm/dispatch/procgen-2026-10-13/p15/REPORT.md` | 17.5 KiB | 2026-10-13–2026-10-14 | P15 report: text, dialogue, voice and authoring | Yes (OOPS repo) | Audit/run output likely |
| 724 | 26 | `docs/gm/dispatch/procgen-2026-10-13/p18/HARNESS.md` | 15.8 KiB | 2026-10-13–2026-10-14 | F1: headless story QA harness | Yes (OOPS repo) | Idea board or mixed source |
| 725 | 26 | `docs/gm/dispatch/procgen-2026-10-13/p22/REPORT.md` | 17.1 KiB | 2026-10-13–2026-10-14 | P22: creative-director tools | Yes (OOPS repo) | Audit/run output likely |
| 726 | 26 | `docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md` | 12.5 KiB | 2026-10-09–2026-10-14 | P3 Village storylet deck | Yes (OOPS repo) | Audit/run output likely |
| 727 | 26 | `docs/gm/dispatch/procgen-2026-10-13/p36/REPORT.md` | 25.7 KiB | 2026-10-13–2026-10-14 | P36: micro details on receipts and known context | Yes (OOPS repo) | Audit/run output likely |
| 728 | 26 | `docs/gm/dispatch/sonnet-wave-2026-10-30/L13_BRIDGES.md` | 11.0 KiB | 2026-10-30–2026-10-30 | L13 read-model bridges (2026-10-30) | Yes (OOPS repo) | Idea board or mixed source |
| 729 | 26 | `docs/gm/dispatch/title-rules-implementation-2026-10-21/COVERAGE_HISTORY_2026-10-21.md` | 8.1 KiB | 2026-10-21–2026-10-21 | Finite coverage, 2026-10-21 | Yes (OOPS repo) | Audit/run output likely |
| 730 | 26 | `docs/gm/engine-extension-2026-10-08/MIGRATION.md` | 18.5 KiB | 2026-10-08–2026-10-08 | Proposed migration and finite proof order | Yes (OOPS repo) | Idea board or mixed source |
| 731 | 26 | `docs/research/academagia/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.1 KiB | 2026-10-14–2026-10-14 | Small touches, PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 732 | 26 | `docs/research/citizen-sleeper-2/SMALL_TOUCHES.md` | 3.9 KiB | mtime 2026-10-10 (no embedded date) | Citizen Sleeper 2 small touches | Yes (OOPS repo) | Idea board or mixed source |
| 733 | 26 | `docs/research/disco-elysium/FINDINGS.md` | 15.9 KiB | mtime 2026-10-10 (no embedded date) | Disco Elysium findings | Yes (OOPS repo) | Audit/run output likely |
| 734 | 26 | `docs/research/disco-elysium/SMALL_TOUCHES.md` | 3.4 KiB | mtime 2026-10-10 (no embedded date) | Disco Elysium small touches | Yes (OOPS repo) | Idea board or mixed source |
| 735 | 26 | `docs/research/everyday-paths-ui-2026-10-15/MOCKUP_PARITY_AND_IMPLICATIONS.md` | 27.6 KiB | 2026-10-15–2026-10-15 | Everyday paths: mockups, parity and better design studies | Yes (OOPS repo) | Idea board or mixed source |
| 736 | 26 | `docs/research/FAN_INTERACTIVE_TWINE_INK_VN_2026-10-22.md` | 11.7 KiB | 2026-10-22–2026-10-22 | Fan and original interactive fiction survey (2026-10-22) | Yes (OOPS repo) | Idea board or mixed source |
| 737 | 26 | `docs/research/game-research-adoption-audit-2026-10-13/GAPS_AND_TOOLS.md` | 13.8 KiB | 2026-10-06–2026-10-21 | Remaining gaps and evidence routes | Yes (OOPS repo) | Audit/run output likely |
| 738 | 26 | `docs/research/hogwarts-legacy/aspects-2026-10-14/SMALL_TOUCHES.md` | 3.0 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 739 | 26 | `docs/research/hogwarts-legacy/SMALL_TOUCHES.md` | 3.4 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 740 | 26 | `docs/research/idle-social-engine-scout-2026-10-06/traces/UNCIV.md` | 24.2 KiB | 2026-10-06–2026-10-06 | Unciv: adapt ordered research and qualified consumers | Yes (OOPS repo) | Idea board or mixed source |
| 741 | 26 | `docs/research/increlution/SMALL_TOUCHES.md` | 4.6 KiB | mtime 2026-10-10 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 742 | 26 | `docs/research/jojo-audit-2026-10-11/ENGINE_AUDIT.md` | 25.7 KiB | 2026-10-03–2026-10-11 | JoJo requirements against the live engine | Yes (OOPS repo) | Audit/run output likely |
| 743 | 26 | `docs/research/jojo-audit-2026-10-11/REPORT.md` | 11.9 KiB | 2026-10-10–2026-10-11 | JoJo audit: source, implementation and live engine | Yes (OOPS repo) | Audit/run output likely |
| 744 | 26 | `docs/research/kittens-game/SMALL_TOUCHES.md` | 2.6 KiB | mtime 2026-10-15 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 745 | 26 | `docs/research/MINECRAFT_BULK_DOWNLOAD_AND_MORE_2026-10-14.md` | 15.7 KiB | 2026-10-14–2026-10-14 | Minecraft research: more donors and fast bulk acquisition | Yes (OOPS repo) | Idea board or mixed source |
| 746 | 26 | `docs/research/minecraft/tfc-chains-2026-10-14/SMALL_TOUCHES.md` | 1.6 KiB | 2026-10-14–2026-10-14 | Small touches, PROPOSALS just | Yes (OOPS repo) | Idea board or mixed source |
| 747 | 26 | `docs/research/multiverse-idle/SMALL_TOUCHES.md` | 3.9 KiB | mtime 2026-10-15 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 748 | 26 | `docs/research/ngu-idle/SMALL_TOUCHES.md` | 2.7 KiB | mtime 2026-10-14 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 749 | 26 | `docs/research/noita/BODY_WORLD_DIGEST.md` | 16.6 KiB | 2026-10-09–2026-10-09 | Noita body, container and world digest | Yes (OOPS repo) | Idea board or mixed source |
| 750 | 26 | `docs/research/PRIOR_ART_EFFECT_ENGINES_2026-11-18.md` | 34.9 KiB | 2026-10-08–2026-11-18 | Prior art for an effect-engine life-sim (scout, 2026-11-18) | Yes (OOPS repo) | Idea board or mixed source |
| 751 | 26 | `docs/research/procedural-materials-2026-10-13/deep/CANON_CRAFT_WORLDS.md` | 18.9 KiB | 2026-10-10–2026-10-13 | Canon material and process cards: HP, D&D and Mother of Learning | Yes (OOPS repo) | Idea board or mixed source |
| 752 | 26 | `docs/research/procedural-materials-2026-10-13/REPORT.md` | 15.2 KiB | 2026-10-13–2026-10-13 | Procedural materials, rules and crafting: joined findings | Yes (OOPS repo) | Audit/run output likely |
| 753 | 26 | `docs/research/rune-factory-5/SMALL_TOUCHES.md` | 2.7 KiB | mtime 2026-10-15 (no embedded date) | Small touches: PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 754 | 26 | `docs/research/sapiens/SMALL_TOUCHES.md` | 2.6 KiB | mtime 2026-10-15 (no embedded date) | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 755 | 26 | `docs/research/siralim-ultimate/pass-2026-10-14-systems/SMALL_TOUCHES.md` | 5.8 KiB | 2026-10-14–2026-10-15 | Small touches from the deeper systems pass | Yes (OOPS repo) | Idea board or mixed source |
| 756 | 26 | `docs/research/SOURCE_ACQUISITION_RECEIPT_2026-10-26.md` | 12.2 KiB | 2026-10-25–2026-10-28 | Existing-series acquisition check, 2026-10-26 | Yes (OOPS repo) | Audit/run output likely |
| 757 | 26 | `docs/research/stardew-valley/SMALL_TOUCHES.md` | 2.1 KiB | mtime 2026-10-15 (no embedded date) | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 758 | 26 | `docs/research/sunless-skies/SMALL_TOUCHES.md` | 2.4 KiB | mtime 2026-10-10 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 759 | 26 | `docs/research/vagrus/pass-2026-10-14/SMALL_TOUCHES.md` | 2.5 KiB | 2026-10-14–2026-10-14 | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 760 | 26 | `docs/reviews/DEDUP_AUDIT_2026-10-18/SYNTHESIS.md` | 22.1 KiB | 2026-10-06–2026-11-04 | Duplicate and consistency audit: synthesis (2026-10-18) | Yes (OOPS repo) | Audit/run output likely |
| 761 | 26 | `docs/UI_DENSITY_NEXT_PARTS_PROMPT_OUTBOUND_2026-10-13.md` | 13.7 KiB | 2026-10-02–2026-10-13 | UI density next parts: prompt roundtrip packet (outbound, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 762 | 26 | `docs/UI_DENSITY_NEXT_PARTS_PROMPT_SENT_2026-10-13.md` | 13.4 KiB | 2026-10-02–2026-10-13 | Part 1. Request to the reviewing chat | Yes (OOPS repo) | Audit/run output likely |
| 763 | 26 | `docs/UI_EXPERIENCE_AUDIT_2026-10-12.md` | 19.2 KiB | 2026-10-12–2026-11-04 | UI, thematic identity and whimsy audit | Yes (OOPS repo) | Audit/run output likely |
| 764 | 26 | `docs/worlds/REVEREND_INSANITY_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` | 46.0 KiB | 2026-10-10–2026-10-31 | Reverend Insanity: institutions, roles and subtle details (2026-10-23) | Yes (OOPS repo) | Idea board or mixed source |
| 765 | 26 | `docs/worlds/world-depth-2026-10-13/34_VALUES_CONSCIENCE_AND_LEISURE.md` | 7.6 KiB | 2026-10-13–2026-10-14 | Values, conscience and leisure (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 766 | 25 | `docs/audits/toolsets_2026-10-21/IMPLEMENTATION.md` | 11.3 KiB | 2026-10-21–2026-10-21 | Tool registry implementation and improvement pass, 2026-10-21 | Yes (OOPS repo) | Audit/run output likely |
| 767 | 25 | `docs/gm/dispatch/comics-2026-10-14/CONTINUITY_MECHANICS.md` | 36.9 KiB | 2025-09-05–2026-10-14 | K5: continuity mechanics | Yes (OOPS repo) | Idea board or mixed source |
| 768 | 25 | `docs/gm/dispatch/comics-2026-10-14/K4_REPORT.md` | 6.6 KiB | 2026-10-14–2026-10-14 | K4 report: superhero tabletop and video game rules | Yes (OOPS repo) | Audit/run output likely |
| 769 | 25 | `docs/gm/dispatch/companions-2026-10-14/C3_REPORT.md` | 7.3 KiB | 2026-10-14–2026-10-14 | C3 final report: companion references | Yes (OOPS repo) | Audit/run output likely |
| 770 | 25 | `docs/gm/dispatch/economy-2026-10-18/E1_OWNERS_AND_ENGINE.md` | 35.3 KiB | 2026-10-11–2026-10-18 | E1: economy, trade, money and property, owner map and engine fit (read-just, 2026-10-18) | Yes (OOPS repo) | Idea board or mixed source |
| 771 | 25 | `docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/L3.md` | 25.7 KiB | 2026-10-25–2026-10-26 | L3: Implement Ascension-inspired foundations and method systems | Yes (OOPS repo) | Idea board or mixed source |
| 772 | 25 | `docs/gm/dispatch/play-surface-2026-11-14/ACTIVITY_UI_REVIEW_2026-11-20.md` | 71.1 KiB | 2026-10-15–2026-11-20 | Giving the activity the center of the screen | Yes (OOPS repo) | Audit/run output likely |
| 773 | 25 | `docs/gm/dispatch/procgen-2026-10-13/cr3/REPORT.md` | 18.4 KiB | 2026-10-13–2026-10-14 | CR3 crafting play, automation and director tools | Yes (OOPS repo) | Audit/run output likely |
| 774 | 25 | `docs/gm/dispatch/procgen-2026-10-13/cr4/MORE.md` | 10.2 KiB | 2026-10-13–2026-10-14 | More maker, trade and legacy possibilities | Yes (OOPS repo) | Idea board or mixed source |
| 775 | 25 | `docs/gm/dispatch/procgen-2026-10-13/p12/REFERENCES.md` | 17.9 KiB | 2020-02-06–2026-10-14 | P12 references: techniques for stories larger than a card | Yes (OOPS repo) | Idea board or mixed source |
| 776 | 25 | `docs/gm/dispatch/procgen-2026-10-13/p6/REPORT.md` | 24.4 KiB | 2026-10-13–2026-10-14 | P6: procedural creation across making systems | Yes (OOPS repo) | Audit/run output likely |
| 777 | 25 | `docs/gm/dispatch/proposal-build-2026-11-24/lane-a/REPORT.md` | 9.9 KiB | 2026-11-24–2026-11-24 | Lane A Gu kinds / 2026-11-24 | Yes (OOPS repo) | Audit/run output likely |
| 778 | 25 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/CLAUDE_ADDENDUM_2.md` | 9.0 KiB | 2026-10-13–2026-10-14 | Claude addendum 2: appearances can be deceiving (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 779 | 25 | `docs/gm/dispatch/ui-refactor-wave-2026-10-29/GALLERY_FORM_AUDIT_BRIEF.md` | 11.4 KiB | 2026-10-29–2026-11-02 | Gallery form audit brief (2026-10-30, ready to run) | Yes (OOPS repo) | Audit/run output likely |
| 780 | 25 | `docs/gm/REPRESENTATION_DIRECTION_DISCUSSION_2026-10-15.md` | 38.4 KiB | 2026-10-10–2026-10-15 | Representation direction discussion | Yes (OOPS repo) | Idea board or mixed source |
| 781 | 25 | `docs/representations/KNOWLEDGE.md` | 21.6 KiB | 2026-10-29–2026-10-30 | Knowledge, investigation and perception: representation (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 782 | 25 | `docs/research/CREATURE_ROOT_RULES_2026-11-11.md` | 55.3 KiB | 2026-11-11–2026-11-11 | Creature root rules across making and worlds | Yes (OOPS repo) | Idea board or mixed source |
| 783 | 25 | `docs/research/kenshi/second-pass/PEOPLE.md` | 20.4 KiB | 2026-10-08–2026-10-08 | People: recruitment, provisional company and personal reactions | Yes (OOPS repo) | Idea board or mixed source |
| 784 | 25 | `docs/research/manga-text/AUDIT_USES_2026-10-23.md` | 18.6 KiB | 2026-10-23–2026-10-23 | What the manga text index can audit (pilots), 2026-10-23 | Yes (OOPS repo) | Audit/run output likely |
| 785 | 25 | `docs/research/naev/pass-2026-10-14-systems/SMALL_TOUCHES.md` | 3.1 KiB | 2026-10-14–2026-10-14 | Naev small touches, deeper systems | Yes (OOPS repo) | Idea board or mixed source |
| 786 | 25 | `docs/research/OTHER_YAIR_PROCEDURAL_SYSTEMS_PROPOSAL_2026-11-11.md` | 58.8 KiB | 2026-10-10–2026-11-11 | Three other YAIR systems to derive from reusable rules | Yes (OOPS repo) | Idea board or mixed source |
| 787 | 25 | `docs/research/planescape-torment/SMALL_TOUCHES.md` | 4.9 KiB | mtime 2026-10-10 (no embedded date) | Twenty-five small touches | Yes (OOPS repo) | Idea board or mixed source |
| 788 | 25 | `docs/research/sunless-sea/SMALL_TOUCHES.md` | 2.1 KiB | mtime 2026-10-10 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 789 | 25 | `docs/research/vintage-story/SOURCE_MAP.md` | 7.4 KiB | 2026-11-04–2026-11-04 | Pinned primary-source map | Yes (OOPS repo) | Idea board or mixed source |
| 790 | 25 | `docs/worlds/FEATURE_UNLOCK_AND_CHEAT_ACQUISITION_PROCESS_2026-10-13.md` | 8.2 KiB | 2026-10-13–2026-10-13 | Feature unlocks and cheat acquisition process | Yes (OOPS repo) | Idea board or mixed source |
| 791 | 25 | `docs/worlds/FIRST_CHEATS_AND_DEATH_REWARDS_2026-10-13.md` | 9.7 KiB | 2026-10-13–2026-10-13 | First cheats, death rewards and book-world integration | Yes (OOPS repo) | Audit/run output likely |
| 792 | 25 | `docs/worlds/mother-of-learning/ZORIAN_S0_S1_STAGE_RECORD_2026-11-03.md` | 30.8 KiB | 2026-10-30–2026-11-08 | Zorian S0 and S1: stage record (proposal, 2026-11-03) | Yes (OOPS repo) | Idea board or mixed source |
| 793 | 24 | `docs/emergent/E6_LORE_LAYER.md` | 35.3 KiB | 2026-10-09–2026-10-09 | E6. Lore layer, build-ready draft (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 794 | 24 | `docs/gm/dispatch/body-lineage-2026-10-14/b16/CONFLICTS.md` | 12.4 KiB | 2026-10-14–2026-10-14 | B16 conflicts and overlap resolutions | Yes (OOPS repo) | Idea board or mixed source |
| 795 | 24 | `docs/gm/dispatch/companions-2026-10-14/C12_REPORT.md` | 6.8 KiB | 2026-10-14–2026-10-14 | C12 report: companion reveal cheats | Yes (OOPS repo) | Audit/run output likely |
| 796 | 24 | `docs/gm/dispatch/foundation-w-2026-11-12/CHECKPOINT.md` | 18.0 KiB | 2026-11-12–2026-11-12 | Foundation W checkpoint: world substrate v0 | Yes (OOPS repo) | Audit/run output likely |
| 797 | 24 | `docs/gm/dispatch/gen-rules-2026-10-14/g5/HONESTY.md` | 12.2 KiB | 2026-10-14–2026-10-14 | GCR2-GCR4: what a generation lens may promise | Yes (OOPS repo) | Idea board or mixed source |
| 798 | 24 | `docs/gm/dispatch/idea-expansion-2026-10-11/review/REPORT.md` | 11.0 KiB | 2026-10-11–2026-10-11 | G7 coverage, usability and completion review | Yes (OOPS repo) | Audit/run output likely |
| 799 | 24 | `docs/gm/dispatch/pc-groups-2026-10-26/cross-craft-connections/implementation/C4.md` | 15.9 KiB | 2026-10-26–2026-10-26 | C4: Implement PC26 recovery and integrate cross-craft details | Yes (OOPS repo) | Idea board or mixed source |
| 800 | 24 | `docs/gm/dispatch/pc-groups-2026-10-26/process-actions/implementation/separation/STATUS.md` | 14.1 KiB | 2026-10-26–2026-10-26 | PC19–PC20 separation lane | Yes (OOPS repo) | Audit/run output likely |
| 801 | 24 | `docs/gm/dispatch/procgen-2026-10-13/cr1/BODY_AND_SPECIES.md` | 16.8 KiB | 2026-10-13–2026-10-14 | CR1 body and species response | Yes (OOPS repo) | Idea board or mixed source |
| 802 | 24 | `docs/gm/dispatch/procgen-2026-10-13/cr2/MORE.md` | 10.0 KiB | 2026-10-13–2026-10-14 | CR2 more world-law angles | Yes (OOPS repo) | Idea board or mixed source |
| 803 | 24 | `docs/gm/dispatch/procgen-2026-10-13/cr4/ECONOMY.md` | 9.4 KiB | 2026-10-13–2026-10-14 | Crafted goods, demand and competing makers | Yes (OOPS repo) | Idea board or mixed source |
| 804 | 24 | `docs/gm/dispatch/procgen-2026-10-13/cr4/ITEMS_OVER_TIME.md` | 9.9 KiB | 2026-10-13–2026-10-14 | Products, objects and legacies over time | Yes (OOPS repo) | Idea board or mixed source |
| 805 | 24 | `docs/gm/dispatch/procgen-2026-10-13/cr4/MAKERS.md` | 10.6 KiB | 2026-10-13–2026-10-14 | Maker identity and recipe lineages | Yes (OOPS repo) | Idea board or mixed source |
| 806 | 24 | `docs/gm/dispatch/procgen-2026-10-13/p10/REPORT.md` | 17.2 KiB | 2026-10-13–2026-10-14 | P10: world-specific generation proposals | Yes (OOPS repo) | Audit/run output likely |
| 807 | 24 | `docs/gm/dispatch/procgen-2026-10-13/p26/OTHER_DEEP_WORLDS.md` | 14.8 KiB | 2026-10-08–2026-10-14 | Other deep worlds: W1 extensions | Yes (OOPS repo) | Idea board or mixed source |
| 808 | 24 | `docs/gm/dispatch/procgen-2026-10-13/p32/LEVEL_OF_DETAIL.md` | 16.8 KiB | 2026-10-13–2026-10-14 | AM1-AM2: detail follows relevance, history stays fixed | Yes (OOPS repo) | Idea board or mixed source |
| 809 | 24 | `docs/gm/dispatch/procgen-2026-10-13/p33/MORE.md` | 8.8 KiB | 2026-10-13–2026-10-14 | Further P33 angles, kept reachable | Yes (OOPS repo) | Idea board or mixed source |
| 810 | 24 | `docs/gm/dispatch/procgen-2026-10-13/p8/REPORT.md` | 18.4 KiB | 2026-10-13–2026-10-14 | P8 resources and harvesting generation | Yes (OOPS repo) | Audit/run output likely |
| 811 | 24 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/LIFESTAGES_REPORT.md` | 11.4 KiB | 2026-10-13–2026-10-14 | Life-stage and custom report, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 812 | 24 | `docs/gm/dispatch/research-tech-2026-10-14/t10/NONHUMAN.md` | 8.5 KiB | 2026-10-14–2026-10-14 | T10 nonhuman craft cues | Yes (OOPS repo) | Idea board or mixed source |
| 813 | 24 | `docs/gm/dispatch/ui-at-scale-2026-10-14/WIREFRAMES.md` | 24.8 KiB | 2026-10-14–2026-10-14 | U3 laptop wireframes, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 814 | 24 | `docs/research/academagia/decompile-2026-10-14/SMALL_TOUCHES.md` | 2.3 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 815 | 24 | `docs/research/amazing-cultivation-simulator/aspects-2026-10-14/SMALL_TOUCHES.md` | 3.1 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 816 | 24 | `docs/research/ani-idle/IMPLEMENTATION_PACKETS.md` | 6.6 KiB | 2026-10-09–2026-10-09 | Original YAIR implementation proposals | Yes (OOPS repo) | Idea board or mixed source |
| 817 | 24 | `docs/research/battle-brothers/SMALL_TOUCHES.md` | 3.0 KiB | mtime 2026-10-08 (no embedded date) | Twenty-four small touches | Yes (OOPS repo) | Idea board or mixed source |
| 818 | 24 | `docs/research/caves-of-qud/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.8 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 819 | 24 | `docs/research/citizen-sleeper/SMALL_TOUCHES.md` | 4.6 KiB | mtime 2026-10-10 (no embedded date) | Citizen Sleeper small touches | Yes (OOPS repo) | Idea board or mixed source |
| 820 | 24 | `docs/research/cultivation-idlers/path-of-the-idle-cultivator/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.1 KiB | 2026-10-14–2026-10-14 | Path of the Idle Cultivator: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 821 | 24 | `docs/research/DECOMP_REFIT_2026-10-22.md` | 37.2 KiB | 2026-10-21–2026-11-12 | Decomp re-fit onto the current engine, 2026-10-22 | Yes (OOPS repo) | Idea board or mixed source |
| 822 | 24 | `docs/research/discworld-mud/aspects-2026-10-14/SMALL_TOUCHES.md` | 1.3 KiB | 2026-10-14–2026-10-14 | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 823 | 24 | `docs/research/dwarf-fortress/aspects-2026-10-14/SMALL_TOUCHES.md` | 3.9 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 824 | 24 | `docs/research/far-field-tropes-2026-10-08/PART_3_NEW_IDEAS.md` | 15.8 KiB | 2026-10-08–2026-10-08 | Part 3: 24 new interaction ideas | Yes (OOPS repo) | Idea board or mixed source |
| 825 | 24 | `docs/research/feature-game-scout-2026-10-14/REPORT.md` | 24.2 KiB | 2026-10-09–2026-10-19 | Feature game scout, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 826 | 24 | `docs/research/free-text-worlds-2026-10-14/aspects-2026-10-14/SMALL_TOUCHES.md` | 1.2 KiB | 2026-10-14–2026-10-14 | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 827 | 24 | `docs/research/free-text-worlds-2026-10-14/SMALL_TOUCHES.md` | 2.5 KiB | 2026-10-14–2026-10-14 | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 828 | 24 | `docs/research/groundhog-life/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.1 KiB | 2026-10-14–2026-10-14 | Groundhog Life: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 829 | 24 | `docs/research/groundhog-life/pass-2026-10-14/SMALL_TOUCHES.md` | 2.1 KiB | 2026-10-14–2026-10-14 | Small touches: PROPOSALS just | Yes (OOPS repo) | Idea board or mixed source |
| 830 | 24 | `docs/research/heavens-vault/aspects-2026-10-14/SMALL_TOUCHES.md` | 3.4 KiB | 2026-10-14–2026-10-14 | Small touches, original PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 831 | 24 | `docs/research/heavens-vault/SMALL_TOUCHES.md` | 1.7 KiB | mtime 2026-10-14 (no embedded date) | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 832 | 24 | `docs/research/idle-reincarnator/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.0 KiB | 2026-10-14–2026-10-14 | idle-reincarnator: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 833 | 24 | `docs/research/idle-reincarnator/REPORT.md` | 11.6 KiB | 2026-10-13–2026-10-14 | Idle Reincarnator: installed-build research, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 834 | 24 | `docs/research/immortal-life/pass-2026-10-14-deep/SMALL_TOUCHES.md` | 2.0 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 835 | 24 | `docs/research/immortal-life/pass-2026-10-14-systems/SMALL_TOUCHES.md` | 2.7 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 836 | 24 | `docs/research/immortal-life/SMALL_TOUCHES.md` | 3.2 KiB | mtime 2026-10-14 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 837 | 24 | `docs/research/immortality-idle/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.1 KiB | 2026-10-14–2026-10-14 | Immortality Idle: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 838 | 24 | `docs/research/immortality-idle/pass-2026-10-14/SMALL_TOUCHES.md` | 2.2 KiB | 2026-10-14–2026-10-14 | Small touches: PROPOSALS just | Yes (OOPS repo) | Idea board or mixed source |
| 839 | 24 | `docs/research/kingdom-of-loathing/aspects-2026-10-14/SMALL_TOUCHES.md` | 1.2 KiB | 2026-10-14–2026-10-14 | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 840 | 24 | `docs/research/legends-of-idleon/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.0 KiB | 2026-10-14–2026-10-14 | legends-of-idleon: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 841 | 24 | `docs/research/legends-of-idleon/SMALL_TOUCHES.md` | 2.7 KiB | mtime 2026-10-14 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 842 | 24 | `docs/research/magical-diary-wolf-hall/SMALL_TOUCHES.md` | 1.7 KiB | mtime 2026-10-15 (no embedded date) | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 843 | 24 | `docs/research/modding-tree/aspects-2026-10-14/SMALL_TOUCHES.md` | 1.1 KiB | 2026-10-14–2026-10-14 | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 844 | 24 | `docs/research/multiworld-synthesis-2026-10-14/SMALL_TOUCHES.md` | 2.0 KiB | 2026-10-14–2026-10-14 | Small touches, PROPOSALS just | Yes (OOPS repo) | Idea board or mixed source |
| 845 | 24 | `docs/research/ngu-idle/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.0 KiB | 2026-10-14–2026-10-14 | ngu-idle: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 846 | 24 | `docs/research/potionomics/SMALL_TOUCHES.md` | 3.5 KiB | mtime 2026-10-15 (no embedded date) | Small touches: PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 847 | 24 | `docs/research/power-scaling-2026-10-08/TOUCHES.md` | 3.3 KiB | 2026-10-08–2026-10-08 | Twenty-four small touches | Yes (OOPS repo) | Idea board or mixed source |
| 848 | 24 | `docs/research/procedural-materials-2026-10-13/BOOK_AND_CANON.md` | 15.5 KiB | 2026-10-09–2026-10-13 | Book materials, canon rules and procedural crafting | Yes (OOPS repo) | Idea board or mixed source |
| 849 | 24 | `docs/research/project-zomboid/SMALL_TOUCHES.md` | 2.7 KiB | mtime 2026-10-15 (no embedded date) | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 850 | 24 | `docs/research/scroll-of-taiwu/SMALL_TOUCHES.md` | 4.1 KiB | mtime 2026-10-14 (no embedded date) | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 851 | 24 | `docs/research/siralim-ultimate/SMALL_TOUCHES.md` | 4.6 KiB | 2026-10-14–2026-10-14 | Small touches, with real readers | Yes (OOPS repo) | Idea board or mixed source |
| 852 | 24 | `docs/research/tabletop-library-2026-10-14/TABLETOP_PROGRESSION_AND_GM_PROPOSAL_2026-11-24.md` | 6.5 KiB | 2026-10-14–2026-11-24 | Tabletop progression, player choice and the game master | Yes (OOPS repo) | Idea board or mixed source |
| 853 | 24 | `docs/research/tale-of-immortal/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.1 KiB | 2026-10-14–2026-10-14 | Tale of Immortal: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 854 | 24 | `docs/research/tale-of-immortal/pass-2026-10-14/SMALL_TOUCHES.md` | 2.9 KiB | 2026-10-14–2026-10-14 | Small touches, all PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 855 | 24 | `docs/research/the-strange-tabletop/SMALL_TOUCHES.md` | 3.5 KiB | mtime 2026-10-15 (no embedded date) | Small touches: optional proposals | Yes (OOPS repo) | Idea board or mixed source |
| 856 | 24 | `docs/research/the-strange-tabletop/SOURCES.md` | 4.2 KiB | 2025-08-22–2026-10-14 | Sources and evidence boundaries | Yes (OOPS repo) | Idea board or mixed source |
| 857 | 24 | `docs/research/vagrus/aspects-2026-10-14/SMALL_TOUCHES.md` | 3.4 KiB | 2026-10-14–2026-10-14 | Small touches, original PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 858 | 24 | `docs/research/warsim/pass-2026-10-14-rea/SMALL_TOUCHES.md` | 2.7 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 859 | 24 | `docs/research/warsim/pass-2026-10-14-systems/SMALL_TOUCHES.md` | 2.4 KiB | 2026-10-14–2026-10-14 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 860 | 24 | `docs/research/warsim/SMALL_TOUCHES.md` | 2.9 KiB | mtime 2026-10-14 (no embedded date) | Small touches, proposed menu | Yes (OOPS repo) | Idea board or mixed source |
| 861 | 24 | `docs/research/your-chronicle/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.1 KiB | 2026-10-14–2026-10-14 | your-chronicle: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 862 | 24 | `docs/worlds/fate/REVIEW.md` | 13.2 KiB | 2026-10-13–2026-10-15 | Independent Fate / TYPE-MOON world-pack review | Yes (OOPS repo) | Audit/run output likely |
| 863 | 24 | `docs/worlds/mother-of-learning/ZORIAN_S2_S6_STAGE_RECORD_2026-11-03.md` | 23.0 KiB | 2026-10-30–2026-11-08 | Zorian S2-S6: stage record (proposal, 2026-11-03) | Yes (OOPS repo) | Idea board or mixed source |
| 864 | 24 | `docs/worlds/world-core-kit-2026-10-14/W30_HP_DND_MOL_SPECIAL.md` | 52.5 KiB | 2026-10-13–2026-10-14 | W30: HP, D&D and Mother of Learning special systems | Yes (OOPS repo) | Idea board or mixed source |
| 865 | 23 | `docs/DIRECTION_SUMMARY.md` | 30.5 KiB | 2026-10-10–2026-11-04 | Current game direction | Yes (OOPS repo) | Idea board or mixed source |
| 866 | 23 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/air-reaudit.md` | 26.1 KiB | 2026-10-14–2026-11-04 | Air re-audit, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 867 | 23 | `docs/gm/dispatch/foundation-run-2026-11-12/CODEX_COORDINATOR_HANDOFF_3.md` | 8.4 KiB | 2026-11-12–2026-11-12 | Third Codex coordinator handoff, 2026-11-12 | Yes (OOPS repo) | Audit/run output likely |
| 868 | 23 | `docs/gm/dispatch/pc-groups-2026-10-26/process-actions/implementation/cues/STATUS.md` | 13.8 KiB | 2026-10-26–2026-10-26 | Cues lane: PC21, J1, D1–D3 | Yes (OOPS repo) | Audit/run output likely |
| 869 | 23 | `docs/gm/dispatch/procgen-2026-10-13/gx1/SOURCE_NOTES.md` | 9.7 KiB | 2026-10-13–2026-10-14 | GX1 source notes and contradictions | Yes (OOPS repo) | Idea board or mixed source |
| 870 | 23 | `docs/gm/dispatch/procgen-2026-10-13/p12/STRUCTURES.md` | 14.9 KiB | 2026-10-13–2026-10-14 | P12 structures: caused stories, open futures | Yes (OOPS repo) | Idea board or mixed source |
| 871 | 23 | `docs/gm/dispatch/procgen-2026-10-13/p30/BODY_AND_AGE.md` | 15.2 KiB | 2026-10-13–2026-10-14 | Bodies, recovery, illness and age | Yes (OOPS repo) | Idea board or mixed source |
| 872 | 23 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/B1_CHECKPOINT.md` | 24.9 KiB | 2026-10-27–2026-10-28 | B1 checkpoint, 2026-10-28 | Yes (OOPS repo) | Audit/run output likely |
| 873 | 23 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/CLAUDE_ADDENDUM_3.md` | 7.1 KiB | 2026-10-13–2026-10-14 | Claude addendum 3: bonds as power, social conflict, rituals (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 874 | 23 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-c/REPORT.md` | 8.6 KiB | 2026-10-14–2026-10-14 | CHECKPOINT: COMPLETE | Yes (OOPS repo) | Audit/run output likely |
| 875 | 23 | `docs/gm/dispatch/traveler-asks-2026-10-14/PLAN.md` | 7.9 KiB | 2026-10-14–2026-10-18 | Traveler asks: reasonable, world-fitting requests (2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 876 | 23 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U12_REPORT.md` | 6.1 KiB | 2026-10-14–2026-10-14 | U12 report: outside-game inspirations | Yes (OOPS repo) | Audit/run output likely |
| 877 | 23 | `docs/research/cividle/REPORT.md` | 13.0 KiB | 2026-10-08–2026-10-13 | CivIdle source audit (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 878 | 23 | `docs/research/CYBERPUNK_1988_L2_GEAR_INJURY_RESPONSE_2026-11-10.md` | 7.4 KiB | 2026-11-08–2026-11-10 | Cyberpunk 1988: gear access, injury and response (L2 synthesis, 2026-11-10) | Yes (OOPS repo) | Idea board or mixed source |
| 879 | 23 | `docs/research/hogwarts-legacy/LP4_REPORT.md` | 13.3 KiB | 2026-10-13–2026-10-14 | LP4 care proposal | Yes (OOPS repo) | Audit/run output likely |
| 880 | 23 | `docs/research/hyperrogue/pass-2026-10-14-systems/CHECKPOINT.md` | 8.4 KiB | 2026-10-14–2026-10-14 | Deeper systems checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 881 | 23 | `docs/research/immortality-idle/REPORT.md` | 9.1 KiB | 2026-10-13–2026-10-13 | Immortality Idle: source audit, 2026-10-13 | Yes (OOPS repo) | Audit/run output likely |
| 882 | 23 | `docs/research/procedural-materials-2026-10-13/IMPLEMENTATION.md` | 11.5 KiB | 2026-10-13–2026-10-13 | Procedural materials: implementation seams and bounded architecture | Yes (OOPS repo) | Idea board or mixed source |
| 883 | 23 | `docs/reviews/crafting-reference-2026-11-04/REPORT.md` | 23.3 KiB | 2026-06-23–2026-11-04 | Crafting reference comparison, 2026-11-04 | Yes (OOPS repo) | Audit/run output likely |
| 884 | 23 | `docs/reviews/DEDUP_AUDIT_2026-10-18/T.md` | 29.6 KiB | 2026-09-03–2026-10-18 | T: tests/, scripts/ and test commands (dedup audit, 2026-10-18) | Yes (OOPS repo) | Audit/run output likely |
| 885 | 23 | `docs/UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md` | 18.8 KiB | 2026-10-15–2026-11-04 | UI foundation: overarching design round | Yes (OOPS repo) | Idea board or mixed source |
| 886 | 23 | `docs/worlds/dnd/SOURCE_CONTRACT.md` | 9.2 KiB | 2026-10-10–2026-10-11 | Source, edition and era contract | Yes (OOPS repo) | Idea board or mixed source |
| 887 | 23 | `docs/worlds/naruto/SOURCE_LEDGER.md` | 15.0 KiB | 2026-10-03–2026-10-03 | Naruto source ledger | Yes (OOPS repo) | Audit/run output likely |
| 888 | 23 | `docs/worlds/self-as-player-expansion-2026-10-13/NARRATIVE_AUTHOR_WORKFLOW.md` | 19.8 KiB | 2026-10-13–2026-10-15 | Narrative and Original World Author: a bounded future contract | Yes (OOPS repo) | Idea board or mixed source |
| 889 | 23 | `docs/worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md` | 24.3 KiB | 2026-10-11–2026-10-19 | World depth considerations (proposal, 2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 890 | 22 | `docs/audits/cheat-implementation-2026-10-10/readers/D_risk_and_purity.md` | 22.0 KiB | 2026-10-10–2026-11-04 | Reader D: risk and purity audit for cheat implementation | Yes (OOPS repo) | Audit/run output likely |
| 891 | 22 | `docs/audits/DOMAIN_RULES_CONFORMANCE_2026-10-19.md` | 14.7 KiB | 2026-10-19–2026-11-04 | Domain rules conformance scan, 2026-10-19 | Yes (OOPS repo) | Audit/run output likely |
| 892 | 22 | `docs/audits/REFINEMENT_PRIORITIES_2026-10-31.md` | 29.9 KiB | 2026-10-27–2026-11-04 | Refinement priorities after the October 30 work | Yes (OOPS repo) | Audit/run output likely |
| 893 | 22 | `docs/gm/dispatch/body-lineage-2026-10-14/b14/INFORMATION_AND_TIMING.md` | 18.8 KiB | 2026-10-13–2026-10-14 | B14 information and timing: G66-G67 | Yes (OOPS repo) | Idea board or mixed source |
| 894 | 22 | `docs/gm/dispatch/body-lineage-2026-10-14/b14/SOCIAL.md` | 13.0 KiB | 2026-10-13–2026-10-14 | B14 social body play: G64 | Yes (OOPS repo) | Idea board or mixed source |
| 895 | 22 | `docs/gm/dispatch/body-lineage-2026-10-14/b15/CV1_SPEC.md` | 22.7 KiB | 2026-10-13–2026-10-14 | CV1 on the existing status window | Yes (OOPS repo) | Audit/run output likely |
| 896 | 22 | `docs/gm/dispatch/body-lineage-2026-10-14/b18/OVERLAPS.md` | 11.2 KiB | 2026-10-14–2026-10-14 | B18 overlap reconciliation | Yes (OOPS repo) | Audit/run output likely |
| 897 | 22 | `docs/gm/dispatch/cheats-2026-10-25/CHECKPOINT.md` | 33.8 KiB | 2026-10-25–2026-10-25 | D4 cheats, 2026-10-25 | Yes (OOPS repo) | Audit/run output likely |
| 898 | 22 | `docs/gm/dispatch/companions-2026-10-14/C7_REPORT.md` | 8.8 KiB | 2026-10-14–2026-10-14 | C7 report: earned companion bonds | Yes (OOPS repo) | Audit/run output likely |
| 899 | 22 | `docs/gm/dispatch/foundation-e-2026-11-12/CHECKPOINT.md` | 12.8 KiB | 2026-11-12–2026-11-12 | Chat E · Emergence harness, checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 900 | 22 | `docs/gm/dispatch/hp-polyjuice-2026-10-22/MORE_TO_CONSIDER_ROUND1.md` | 10.4 KiB | 2026-10-22–2026-10-22 | Polyjuice slice: more to consider, round 1 | Yes (OOPS repo) | Idea board or mixed source |
| 901 | 22 | `docs/gm/dispatch/idea-expansion-2026-10-11/continuity/REPORT.md` | 12.5 KiB | 2026-10-11–2026-10-11 | G4 temporal, identity and discovery expansion | Yes (OOPS repo) | Audit/run output likely |
| 902 | 22 | `docs/gm/dispatch/maker-arts-2026-10-14/W4_REPORT.md` | 7.9 KiB | 2026-10-13–2026-10-14 | W4 report: implementation implications and abstractions | Yes (OOPS repo) | Audit/run output likely |
| 903 | 22 | `docs/gm/dispatch/modular-chains-2026-10-14/pc2/REPORT.md` | 56.1 KiB | 2026-10-10–2026-10-19 | PC2: procedural rule modules | Yes (OOPS repo) | Audit/run output likely |
| 904 | 22 | `docs/gm/dispatch/procgen-2026-10-13/cr1/REPORT.md` | 20.9 KiB | 2026-10-13–2026-10-14 | CR1 consumables, dose and body response | Yes (OOPS repo) | Audit/run output likely |
| 905 | 22 | `docs/gm/dispatch/procgen-2026-10-13/gx1/PROFILE_RULES.md` | 14.1 KiB | 2026-10-13–2026-10-14 | GX1 profile contract | Yes (OOPS repo) | Idea board or mixed source |
| 906 | 22 | `docs/gm/dispatch/procgen-2026-10-13/gx3/BUDGETS_AND_ABSENCE.md` | 13.6 KiB | 2026-10-13–2026-10-14 | GO6-GO7: content budgets and long-absence summaries | Yes (OOPS repo) | Idea board or mixed source |
| 907 | 22 | `docs/gm/dispatch/procgen-2026-10-13/p28/INTENT.md` | 10.0 KiB | 2026-10-13–2026-10-14 | P28 player intent and knowledge-backed topics | Yes (OOPS repo) | Idea board or mixed source |
| 908 | 22 | `docs/gm/dispatch/procgen-2026-10-13/p35/REPORT.md` | 14.9 KiB | 2026-10-13–2026-10-14 | P35: environment, encyclopedia, sound and optional challenges | Yes (OOPS repo) | Audit/run output likely |
| 909 | 22 | `docs/gm/dispatch/procgen-2026-10-13/p37/ACADEMY_AND_MILITARY.md` | 8.0 KiB | 2026-10-09–2026-10-14 | BH.ML / BH.SL: academy and military daily life | Yes (OOPS repo) | Idea board or mixed source |
| 910 | 22 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P8_CHECKPOINT.md` | 37.9 KiB | 2026-10-27–2026-10-29 | P8 checkpoint: whole-book load and boundary cost | Yes (OOPS repo) | Audit/run output likely |
| 911 | 22 | `docs/gm/dispatch/traveler-asks-2026-10-14/ta3/REPEAT.md` | 12.6 KiB | 2026-10-13–2026-10-14 | TA3 repeatable needs, time and remembered help | Yes (OOPS repo) | Idea board or mixed source |
| 912 | 22 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U3_REPORT.md` | 7.5 KiB | 2026-10-13–2026-10-14 | U3 report, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 913 | 22 | `docs/gm/dispatch/ui-foundation-2026-10-15/R13_REPORT.md` | 7.4 KiB | 2026-10-15–2026-10-15 | R13 report: every region has a job | Yes (OOPS repo) | Audit/run output likely |
| 914 | 22 | `docs/gm/dispatch/world-core-kit-2026-10-14/W12_REPORT.md` | 7.5 KiB | 2026-10-13–2026-10-14 | W12 report: signals and ripples by world | Yes (OOPS repo) | Audit/run output likely |
| 915 | 22 | `docs/gm/USER_VISION_LOG_2026-10.md` | 607.1 KiB | 2026-10-01–2026-11-06 | Weibao's direction log, 2026-10 | Yes (OOPS repo) | Idea board or mixed source |
| 916 | 22 | `docs/PROGRESSION_GATE_RULES.md` | 31.0 KiB | 2026-10-03–2026-11-14 | Progression gate rules | Yes (OOPS repo) | Idea board or mixed source |
| 917 | 22 | `docs/research/everyday-paths-ui-2026-10-15/LAND_AREA_AND_INVOLVEMENT_UI.md` | 16.6 KiB | 2026-10-15–2026-10-15 | Land, scale, involvement and the right representation | Yes (OOPS repo) | Idea board or mixed source |
| 918 | 22 | `docs/research/game-discovery-2026-10-06/source-traces/SHATTERED.md` | 20.6 KiB | 2026-10-06–2026-10-06 | Shattered Pixel Dungeon: one material-to-environment causal trace | Yes (OOPS repo) | Idea board or mixed source |
| 919 | 22 | `docs/research/immortal-life/aspects-2026-10-14/SYSTEM_INVENTORY.md` | 39.2 KiB | 2026-10-14–2026-10-14 | System inventory | Yes (OOPS repo) | Audit/run output likely |
| 920 | 22 | `docs/research/modding-tree/pass-2026-10-14/REPORT.md` | 10.1 KiB | 2026-10-14–2026-10-14 | Prestige-community source pass, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 921 | 22 | `docs/research/remnant-2/pass-2026-10-15-deep/SYSTEMS.md` | 17.8 KiB | 2026-10-15–2026-10-15 | Systems recovered in the deep pass | Yes (OOPS repo) | Idea board or mixed source |
| 922 | 22 | `docs/research/SOURCE_HARVEST_2026-10-25.md` | 17.2 KiB | 2026-10-25–2026-10-25 | Ranked-source harvest, 2026-10-25 | Yes (OOPS repo) | Idea board or mixed source |
| 923 | 22 | `docs/research/sunless-skies/FINDINGS.md` | 12.3 KiB | mtime 2026-10-10 (no embedded date) | Findings with locators | Yes (OOPS repo) | Audit/run output likely |
| 924 | 22 | `docs/research/tale-of-immortal/SMALL_TOUCHES.md` | 2.8 KiB | mtime 2026-10-08 (no embedded date) | Twenty-two small touches for vanilla YAIR | Yes (OOPS repo) | Idea board or mixed source |
| 925 | 22 | `docs/worlds/black-clover/REVIEW.md` | 13.4 KiB | 2026-10-20–2026-10-20 | Black Clover world-pack independent review | Yes (OOPS repo) | Audit/run output likely |
| 926 | 22 | `docs/worlds/cheat-directions-2026-10-13/03_ORIGINS_WITHOUT_PATRONS.md` | 16.3 KiB | 2026-10-13–2026-10-13 | O. Cheat origins without a required patron | Yes (OOPS repo) | Idea board or mixed source |
| 927 | 22 | `docs/worlds/cheat-directions-2026-10-13/04_PREPARING_CHEATS_FOR_NEXT_LIVES.md` | 18.8 KiB | 2026-10-13–2026-10-13 | Preparing cheats for next lives | Yes (OOPS repo) | Idea board or mixed source |
| 928 | 22 | `docs/worlds/cheat-directions-2026-10-13/10_RULE_DRIVEN_PROCEDURAL_GENERATION.md` | 13.3 KiB | 2026-10-13–2026-10-13 | Rule-driven procedural generation | Yes (OOPS repo) | Idea board or mixed source |
| 929 | 22 | `docs/worlds/world-depth-2026-10-13/43_REVEAL_CHEATS_FOR_LIFE_SYSTEMS.md` | 6.6 KiB | 2026-10-13–2026-10-14 | Reveal cheats for life systems (proposal, 2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 930 | 21 | `docs/audits/IDEAS_NESTED_TRIAGE_2026-10-26.md` | 22.3 KiB | 2026-10-14–2026-11-04 | Nested ideas triage, R1 outcome 2, 2026-10-26 | Yes (OOPS repo) | Audit/run output likely |
| 931 | 21 | `docs/audits/IMPOSSIBILITIES_2026-10-30.md` | 8.7 KiB | 2026-10-30–2026-11-04 | Impossibilities sweep (2026-10-30) | Yes (OOPS repo) | Audit/run output likely |
| 932 | 21 | `docs/audits/UI_CAPABILITY_GAPS_2026-10-30.md` | 16.7 KiB | 2026-10-17–2026-11-04 | UI capability gaps: a fresh player's walk (2026-10-30) | Yes (OOPS repo) | Audit/run output likely |
| 933 | 21 | `docs/gm/dispatch/body-lineage-2026-10-14/b6/REPORT.md` | 17.1 KiB | 2026-10-11–2026-11-04 | B6 report: generated physiques and bloodlines | Yes (OOPS repo) | Audit/run output likely |
| 934 | 21 | `docs/gm/dispatch/codex-parallel-2026-10-25/C5_TONIGHT_REVIEW.md` | 18.1 KiB | 2026-10-14–2026-10-25 | C5 tonight review, 2026-10-25 | Yes (OOPS repo) | Audit/run output likely |
| 935 | 21 | `docs/gm/dispatch/cross-world-systems-2026-11-07/READ_AHEAD_USE_2026-11-08.md` | 20.4 KiB | 2026-11-07–2026-11-08 | Read-ahead findings for the next lead slices, November 8, 2026 | Yes (OOPS repo) | Audit/run output likely |
| 936 | 21 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g4/REPORT.md` | 17.9 KiB | 2026-10-13–2026-10-14 | R15 G4 report | Yes (OOPS repo) | Audit/run output likely |
| 937 | 21 | `docs/gm/dispatch/home-system-2026-10-21/extension/REPORT.md` | 11.9 KiB | 2026-10-13–2026-10-21 | Building and staffed-home extension, 2026-10-21 | Yes (OOPS repo) | Audit/run output likely |
| 938 | 21 | `docs/gm/dispatch/home-system-2026-10-21/REPORT.md` | 10.3 KiB | 2026-10-13–2026-10-21 | Home and domicile delivery, 2026-10-21 | Yes (OOPS repo) | Audit/run output likely |
| 939 | 21 | `docs/gm/dispatch/idea-expansion-2026-10-11/starts/REPORT.md` | 15.5 KiB | 2026-10-11–2026-10-11 | G1 Starts and life forms: first planning tranche | Yes (OOPS repo) | Audit/run output likely |
| 940 | 21 | `docs/gm/dispatch/pc-groups-2026-10-26/connected-making/implementation/COVERAGE.md` | 9.8 KiB | 2026-10-26–2026-10-26 | G1 implementation coverage | Yes (OOPS repo) | Audit/run output likely |
| 941 | 21 | `docs/gm/dispatch/procgen-2026-10-13/p14/REPORT.md` | 20.0 KiB | 2026-10-13–2026-10-14 | P14: generated history, chronicle, legends and in-world texts | Yes (OOPS repo) | Audit/run output likely |
| 942 | 21 | `docs/gm/dispatch/procgen-2026-10-13/p18/MORE.md` | 11.8 KiB | 2026-10-13–2026-10-14 | Further QA angles and owner joins | Yes (OOPS repo) | Idea board or mixed source |
| 943 | 21 | `docs/gm/dispatch/procgen-2026-10-13/p2/REPORT.md` | 9.6 KiB | 2026-10-13–2026-10-14 | P2 Village mixing | Yes (OOPS repo) | Audit/run output likely |
| 944 | 21 | `docs/gm/dispatch/procgen-2026-10-13/p20/REPORT.md` | 17.5 KiB | 2026-10-13–2026-10-14 | P20 report: places and settlements | Yes (OOPS repo) | Audit/run output likely |
| 945 | 21 | `docs/gm/dispatch/procgen-2026-10-13/p25/REPORT.md` | 14.7 KiB | 2026-10-13–2026-10-14 | P25: presentation and export of generated stories | Yes (OOPS repo) | Audit/run output likely |
| 946 | 21 | `docs/gm/dispatch/procgen-2026-10-13/p37/HUB_AND_ORIGINAL_WORLDS.md` | 13.3 KiB | 2026-10-13–2026-10-14 | BH: Reincarnation Paradise and original world groups | Yes (OOPS repo) | Idea board or mixed source |
| 947 | 21 | `docs/gm/dispatch/research-tech-2026-10-14/SESSIONS.md` | 1.8 KiB | 2026-10-14–2026-10-14 | Sessions | Yes (OOPS repo) | Idea board or mixed source |
| 948 | 21 | `docs/gm/dispatch/research-tech-2026-10-14/t13/OWNERSHIP.md` | 10.4 KiB | 2026-10-13–2026-10-14 | T13 ownership and conflict snapshot | Yes (OOPS repo) | Idea board or mixed source |
| 949 | 21 | `docs/gm/dispatch/research-tech-2026-10-14/t14/CARDS.md` | 44.4 KiB | 2026-10-14–2026-10-14 | T14 revealer cards | Yes (OOPS repo) | Idea board or mixed source |
| 950 | 21 | `docs/gm/dispatch/research-tech-2026-10-14/t4/REPORT.md` | 10.9 KiB | 2026-10-14–2026-10-14 | T4 report: real history and models of technology | Yes (OOPS repo) | Audit/run output likely |
| 951 | 21 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-k/OUTPUT.md` | 48.5 KiB | 2026-10-14–2026-10-14 | TW-K: world core kit delta and delivery contracts | Yes (OOPS repo) | Audit/run output likely |
| 952 | 21 | `docs/gm/dispatch/ui-foundation-2026-10-15/parallel/APOTHIC_ATTRIBUTE_UI.md` | 14.3 KiB | 2026-10-15–2026-10-15 | Apothic Attributes UI pattern and compact YAIR stat inspection | Yes (OOPS repo) | Idea board or mixed source |
| 953 | 21 | `docs/gm/dispatch/ui-foundation-2026-10-15/R12_REPORT.md` | 7.4 KiB | 2026-10-13–2026-10-15 | R12 report: native Cooking recipe clarity | Yes (OOPS repo) | Audit/run output likely |
| 954 | 21 | `docs/gm/dispatch/world-core-kit-2026-10-14/W9_REPORT.md` | 6.5 KiB | 2026-10-14–2026-10-14 | W9 report: micro engine and first-day stress test | Yes (OOPS repo) | Audit/run output likely |
| 955 | 21 | `docs/research/deep-detail-reaudit-2026-10-14/REPORT.md` | 25.1 KiB | 2026-10-06–2026-11-04 | Deep-detail re-audit, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 956 | 21 | `docs/research/far-field-tropes-2026-10-08/PART_1_GENRES.md` | 18.2 KiB | 2026-10-08–2026-10-08 | Part 1: far-field mechanics | Yes (OOPS repo) | Idea board or mixed source |
| 957 | 21 | `docs/research/GAME_UX_GUIDES_2026-11.md` | 39.1 KiB | 2023-06-08–2026-11-11 | Game UX and interface writing guides, 2026-11 | Yes (OOPS repo) | Idea board or mixed source |
| 958 | 21 | `docs/research/itch-io-2026-10-22/BATCH_W3_READS.md` | 26.7 KiB | 2026-10-22–2026-10-23 | itch research: wave 3 reads of open gaps, 2026-10-23 | Yes (OOPS repo) | Idea board or mixed source |
| 959 | 21 | `docs/research/jojo-audit-2026-10-11/SOURCE_AUDIT.md` | 16.9 KiB | 2026-10-11–2026-10-11 | JoJo source audit: representative primary evidence | Yes (OOPS repo) | Audit/run output likely |
| 960 | 21 | `docs/research/local-ai-2026-10-14/m5-optimal/REPORT.md` | 18.0 KiB | 2026-10-13–2026-10-14 | Optimal local AI setup for this M5 Pro | Yes (OOPS repo) | Audit/run output likely |
| 961 | 21 | `docs/research/naev/aspects-2026-10-14/SYSTEM_INVENTORY.md` | 7.3 KiB | 2026-10-14–2026-10-14 | Naev system inventory | Yes (OOPS repo) | Audit/run output likely |
| 962 | 21 | `docs/research/procedural-crafting-ui-2026-10-15/BOOK_SYSTEMS_DEEPER.md` | 10.3 KiB | 2026-10-15–2026-10-15 | Direct book evidence: ingredients, methods and combined means | Yes (OOPS repo) | Idea board or mixed source |
| 963 | 21 | `docs/research/scroll-of-taiwu/pass-2026-10-14-systems/REPORT.md` | 10.8 KiB | 2026-10-14–2026-10-14 | Taiwu deep systems sweep, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 964 | 21 | `docs/research/skill-growth-2026-10-10/READ_HISTORY_AUDIT.md` | 24.0 KiB | 2026-10-10–2026-10-10 | Read-history audit: how power grows, and what a level means | Yes (OOPS repo) | Audit/run output likely |
| 965 | 21 | `docs/worlds/chainsaw-man/ABILITY_VARIANTS.md` | 5.0 KiB | mtime 2026-10-14 (no embedded date) | Ability variants: Chainsaw Man | Yes (OOPS repo) | Idea board or mixed source |
| 966 | 21 | `docs/worlds/HP_LOTM_NEXT_PLAYABLE_FEATURE_2026-10-15.md` | 24.9 KiB | 2026-10-15–2026-10-19 | HP versus early LOTM: next playable feature recommendation | Yes (OOPS repo) | Idea board or mixed source |
| 967 | 21 | `docs/worlds/SCENARIO_WORLDS_AND_CHEATS_2026-11-18.md` | 58.3 KiB | 2026-10-14–2026-11-12 | Scenario worlds and cheats | Yes (OOPS repo) | Idea board or mixed source |
| 968 | 20 | `docs/audits/idea-audit-2026-11-06/COMPLETION_06_FOUNDATION_FOLLOWTHROUGH.md` | 8.5 KiB | 2026-11-06–2026-11-06 | Completion batch 6: foundation follow-through and evidence limits | Yes (OOPS repo) | Audit/run output likely |
| 969 | 20 | `docs/audits/UI_FORM_FIT_2026-10-30.md` | 20.9 KiB | 2026-10-30–2026-11-04 | UI form fit: is the web the right shape? (2026-10-30) | Yes (OOPS repo) | Audit/run output likely |
| 970 | 20 | `docs/gm/d1-alloy-equipment-2026-10-07/CHECKPOINT.md` | 25.1 KiB | 2026-10-07–2026-10-08 | D1 alloy equipment checkpoint · 2026-10-07 | Yes (OOPS repo) | Audit/run output likely |
| 971 | 20 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/fork-resurvey.md` | 12.8 KiB | 2026-10-14–2026-10-14 | fork-resurvey lane, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 972 | 20 | `docs/gm/dispatch/body-lineage-2026-10-14/b3/DESIGN.md` | 25.1 KiB | 2026-10-14–2026-10-14 | G30 extension: bloodline as one prestige carrier | Yes (OOPS repo) | Idea board or mixed source |
| 973 | 20 | `docs/gm/dispatch/body-lineage-2026-10-14/b7/REPORT.md` | 11.9 KiB | 2026-10-13–2026-11-04 | B7 report: NPC body detail levels | Yes (OOPS repo) | Audit/run output likely |
| 974 | 20 | `docs/gm/dispatch/body-lineage-2026-10-14/b8/CURRENT_UI.md` | 10.3 KiB | 2026-10-13–2026-10-14 | B8 current UI audit | Yes (OOPS repo) | Audit/run output likely |
| 975 | 20 | `docs/gm/dispatch/comics-2026-10-14/K1_REPORT.md` | 8.5 KiB | 2026-10-14–2026-10-14 | K1 lane report, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 976 | 20 | `docs/gm/dispatch/companions-2026-10-14/C16_REPORT.md` | 6.0 KiB | 2026-10-14–2026-10-14 | C16 report: overarching bond abstractions | Yes (OOPS repo) | Audit/run output likely |
| 977 | 20 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r14/BACKLOG.md` | 6.4 KiB | 2026-10-13–2026-10-13 | R14 finite retained gates | Yes (OOPS repo) | Idea board or mixed source |
| 978 | 20 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/g6/REPORT.md` | 9.8 KiB | 2026-10-11–2026-10-13 | R15 G6: FA22 minigame and management families (MG01–MG10) | Yes (OOPS repo) | Audit/run output likely |
| 979 | 20 | `docs/gm/dispatch/foundation-run-2026-11-12/G_APERTURE.md` | 10.2 KiB | 2026-10-10–2026-11-12 | Gu law: the aperture | Yes (OOPS repo) | Idea board or mixed source |
| 980 | 20 | `docs/gm/dispatch/foundation-run-2026-11-12/W17_COST_OWNERS.md` | 7.7 KiB | 2026-11-12–2026-11-12 | Wave 17 lane E1: cost owners | Yes (OOPS repo) | Idea board or mixed source |
| 981 | 20 | `docs/gm/dispatch/minigames-2026-10-11/DESIGN.md` | 19.6 KiB | 2026-10-11–2026-10-11 | Connected management design, 2026-10-11 | Yes (OOPS repo) | Idea board or mixed source |
| 982 | 20 | `docs/gm/dispatch/minigames-2026-10-11/REPORT.md` | 7.2 KiB | 2026-10-11–2026-10-11 | Minigame and management candidate delivery, 2026-10-11 | Yes (OOPS repo) | Audit/run output likely |
| 983 | 20 | `docs/gm/dispatch/overarching-reconciliation-2026-10-23/R2_REPORT.md` | 12.5 KiB | 2026-10-22–2026-10-23 | R2: research-to-runtime reconciliation, 2026-10-23 | Yes (OOPS repo) | Audit/run output likely |
| 984 | 20 | `docs/gm/dispatch/pc-groups-2026-10-26/material-foundations/implementation-2026-10-26/M4.md` | 20.9 KiB | 2026-10-26–2026-10-26 | M4: Implement HP material preparation journey | Yes (OOPS repo) | Idea board or mixed source |
| 985 | 20 | `docs/gm/dispatch/pc-groups-2026-10-26/weather-environment/implementation/W6.md` | 51.0 KiB | 2026-10-26–2026-10-26 | W6: Implement forecasts and supernatural weather | Yes (OOPS repo) | Idea board or mixed source |
| 986 | 20 | `docs/gm/dispatch/procgen-2026-10-13/gx2/RECONCILIATION.md` | 10.0 KiB | 2026-10-13–2026-11-04 | GX2 crosswalk to existing owners | Yes (OOPS repo) | Audit/run output likely |
| 987 | 20 | `docs/gm/dispatch/procgen-2026-10-13/gx3/SUBTLE.md` | 13.2 KiB | 2026-10-13–2026-10-14 | GS: subtle generation mechanics | Yes (OOPS repo) | Idea board or mixed source |
| 988 | 20 | `docs/gm/dispatch/procgen-2026-10-13/p10/ORIGINAL_WORLD_FACTORY.md` | 9.6 KiB | 2026-10-13–2026-10-14 | Original-world families and generation envelope | Yes (OOPS repo) | Idea board or mixed source |
| 989 | 20 | `docs/gm/dispatch/procgen-2026-10-13/p13/MORE.md` | 8.8 KiB | 2026-10-13–2026-10-14 | More canon-aware story angles and concrete suggestions | Yes (OOPS repo) | Idea board or mixed source |
| 990 | 20 | `docs/gm/dispatch/procgen-2026-10-13/p15/RUNTIME_TEXT.md` | 15.2 KiB | 2026-10-13–2026-10-14 | P15 runtime text | Yes (OOPS repo) | Idea board or mixed source |
| 991 | 20 | `docs/gm/dispatch/procgen-2026-10-13/p16/LIVE_AUDIT.md` | 9.9 KiB | 2026-10-13–2026-10-14 | Narrative source audit and reading boundary | Yes (OOPS repo) | Audit/run output likely |
| 992 | 20 | `docs/gm/dispatch/procgen-2026-10-13/p20/MORE.md` | 8.3 KiB | 2026-10-13–2026-10-14 | H6–H15: more place stories to consider | Yes (OOPS repo) | Idea board or mixed source |
| 993 | 20 | `docs/gm/dispatch/procgen-2026-10-13/p25/MORE.md` | 10.3 KiB | 2026-10-13–2026-10-14 | P25: further presentation and memory angles | Yes (OOPS repo) | Idea board or mixed source |
| 994 | 20 | `docs/gm/dispatch/research-tech-2026-10-14/t13/SAVE_SCHEMA.md` | 13.8 KiB | 2026-10-14–2026-10-14 | T13 proposed research save contract | Yes (OOPS repo) | Idea board or mixed source |
| 995 | 20 | `docs/gm/dispatch/research-tech-2026-10-14/t9-build/REPORT.md` | 13.3 KiB | 2026-10-14–2026-10-14 | T16: Z1-Z6 headless planner QA delivery | Yes (OOPS repo) | Audit/run output likely |
| 996 | 20 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-b/OUTPUT.md` | 28.0 KiB | 2026-10-14–2026-10-14 | TW-B: bodies, lineage and gender | Yes (OOPS repo) | Audit/run output likely |
| 997 | 20 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U4_REPORT.md` | 5.5 KiB | 2026-10-14–2026-10-14 | U4 report: accessibility and input | Yes (OOPS repo) | Audit/run output likely |
| 998 | 20 | `docs/gm/dispatch/ui-foundation-2026-10-15/REPORT.md` | 14.8 KiB | 2026-10-15–2026-10-15 | UI foundation delivery | Yes (OOPS repo) | Audit/run output likely |
| 999 | 20 | `docs/gm/dispatch/weaponcraft-runes-2026-10-14/R2_REPORT.md` | 8.0 KiB | 2026-10-14–2026-10-14 | R2 report: weaponcraft and inscription game references | Yes (OOPS repo) | Audit/run output likely |
| 1000 | 20 | `docs/gm/dispatch/world-core-kit-2026-10-14/W17_REPORT.md` | 5.9 KiB | 2026-10-14–2026-10-14 | W17 report: lens cheats | Yes (OOPS repo) | Audit/run output likely |
| 1001 | 20 | `docs/gm/dispatch/world-core-kit-2026-10-14/W20_REPORT.md` | 7.2 KiB | 2026-10-11–2026-10-14 | W20 report: more comic media and comic cheats | Yes (OOPS repo) | Audit/run output likely |
| 1002 | 20 | `docs/gm/dispatch/world-core-kit-2026-10-14/W7_REPORT.md` | 6.8 KiB | 2026-10-14–2026-10-14 | W7 report: micro tables by world (2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 1003 | 20 | `docs/gm/UI_DENSITY_AUDIT_PROMPT.md` | 10.4 KiB | 2026-10-02–2026-10-13 | UI density, scrolling and original-UI comparison audit | Yes (OOPS repo) | Audit/run output likely |
| 1004 | 20 | `docs/gm/world-implementation/second-pass/upstream-native-feasibility/REPORT.md` | 23.9 KiB | 2026-10-05–2026-10-05 | Native expansion and implementation feasibility | Yes (OOPS repo) | Audit/run output likely |
| 1005 | 20 | `docs/research/academagia/decompile-2026-10-14/REPORT.md` | 9.7 KiB | 2026-10-14–2026-10-14 | Academagia decompile research, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1006 | 20 | `docs/research/academagia/REPORT.md` | 9.0 KiB | 2026-10-13–2026-10-13 | Academagia: The Making of Mages research lane | Yes (OOPS repo) | Audit/run output likely |
| 1007 | 20 | `docs/research/bitburner/aspects-2026-10-14/SMALL_TOUCHES.md` | 4.3 KiB | 2026-10-14–2026-10-14 | bitburner: twenty small original touches | Yes (OOPS repo) | Idea board or mixed source |
| 1008 | 20 | `docs/research/bitlife/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.3 KiB | 2026-10-14–2026-10-14 | BitLife public FAQ and historical guides: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1009 | 20 | `docs/research/cividle/aspects-2026-10-14/SMALL_TOUCHES.md` | 4.2 KiB | 2026-10-14–2026-10-14 | cividle: twenty small original touches | Yes (OOPS repo) | Idea board or mixed source |
| 1010 | 20 | `docs/research/climb-mr2-playtest-2026-10-15/REPORT.md` | 12.3 KiB | 2026-10-07–2026-10-15 | The Climb and Magic Research 2: browser play and source comparison | Yes (OOPS repo) | Audit/run output likely |
| 1011 | 20 | `docs/research/cultivation-idlers/aspects-2026-10-14/SMALL_TOUCHES.md` | 4.3 KiB | 2026-10-14–2026-10-14 | cultivation-idlers: twenty small original touches | Yes (OOPS repo) | Idea board or mixed source |
| 1012 | 20 | `docs/research/game-research-adoption-audit-2026-10-13/REPORT.md` | 12.7 KiB | 2026-10-13–2026-10-21 | Reference-game research and YAIR adoption audit | Yes (OOPS repo) | Audit/run output likely |
| 1013 | 20 | `docs/research/groundhog-life/SMALL_TOUCHES.md` | 1.5 KiB | mtime 2026-10-13 (no embedded date) | Groundhog Life small touches (inferred proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 1014 | 20 | `docs/research/immortality-idle/SMALL_TOUCHES.md` | 2.3 KiB | mtime 2026-10-13 (no embedded date) | Immortality Idle small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1015 | 20 | `docs/research/kingdom-of-loathing/pass-2026-10-14/REPORT.md` | 10.3 KiB | 2026-10-13–2026-10-14 | Kingdom of Loathing: path rules and shared grammar | Yes (OOPS repo) | Audit/run output likely |
| 1016 | 20 | `docs/research/majoras-mask/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.3 KiB | 2026-10-14–2026-10-14 | Majora's Mask (N64 US): small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1017 | 20 | `docs/research/melvor-idle/aspects-2026-10-14/SMALL_TOUCHES.md` | 4.1 KiB | 2026-10-14–2026-10-14 | melvor-idle: twenty small original touches | Yes (OOPS repo) | Idea board or mixed source |
| 1018 | 20 | `docs/research/minecraft/tfc-chains-2026-10-14/REPORT.md` | 9.3 KiB | 2026-10-14–2026-10-14 | Feature answers | Yes (OOPS repo) | Audit/run output likely |
| 1019 | 20 | `docs/research/open-idle-games-2026-10-09/aspects-2026-10-14/SMALL_TOUCHES.md` | 4.3 KiB | 2026-10-09–2026-10-14 | open-idle-games-2026-10-09: twenty small original touches | Yes (OOPS repo) | Idea board or mixed source |
| 1020 | 20 | `docs/research/outer-wilds/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.3 KiB | 2026-10-14–2026-10-14 | Outer Wilds, community New Horizons contracts: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1021 | 20 | `docs/research/qud-systems-audit-2026-10-15/depth-1/COMBINATIONS_AND_NPC.md` | 8.0 KiB | 2026-10-15–2026-10-15 | Combination matrix, NPC evidence and further questions | Yes (OOPS repo) | Audit/run output likely |
| 1022 | 20 | `docs/research/qud-systems-audit-2026-10-15/depth-2/REPORT.md` | 5.4 KiB | 2026-10-15–2026-10-15 | Continued unread systems research | Yes (OOPS repo) | Audit/run output likely |
| 1023 | 20 | `docs/research/rimworld/pass-2026-10-14-systems/CHECKPOINT.md` | 7.9 KiB | 2026-10-14–2026-10-14 | ds-rimworld checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1024 | 20 | `docs/research/rogue-legacy/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.3 KiB | 2026-10-14–2026-10-14 | Rogue Legacy 1 released FNA source: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1025 | 20 | `docs/research/ROOT_RULES_CREATURES_GU_POTIONS_AND_MAKING_2026-11-11.md` | 242.9 KiB | 2026-10-10–2026-11-11 | Root rules for creatures, Gu, potions, chemistry, and engineering | Yes (OOPS repo) | Idea board or mixed source |
| 1026 | 20 | `docs/research/super-robot-wars/aspects-2026-10-14/SMALL_TOUCHES.md` | 2.3 KiB | 2026-10-14–2026-10-14 | Super Robot Wars, title-qualified V and W guide pass: small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1027 | 20 | `docs/research/theory-of-magic/aspects-2026-10-14/SMALL_TOUCHES.md` | 4.2 KiB | 2026-10-14–2026-10-14 | theory-of-magic: twenty small original touches | Yes (OOPS repo) | Idea board or mixed source |
| 1028 | 20 | `docs/research/trimps-antimatter/aspects-2026-10-14/SMALL_TOUCHES.md` | 4.2 KiB | 2026-10-14–2026-10-14 | trimps-antimatter: twenty small original touches | Yes (OOPS repo) | Idea board or mixed source |
| 1029 | 20 | `docs/research/vagrus/SOURCES.md` | 5.6 KiB | 2024-12-27–2026-10-10 | Vagrus source register | Yes (OOPS repo) | Idea board or mixed source |
| 1030 | 20 | `docs/research/warsim/pass-2026-10-14-systems/CHECKPOINT.md` | 9.2 KiB | 2026-10-14–2026-10-14 | Warsim deeper systems checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1031 | 20 | `docs/reviews/CLAUDE_CHAT_GRIPES_AND_NEXT_STEPS_2026-10-18.md` | 11.8 KiB | 2026-10-17–2026-11-04 | Claude chat gripes and next steps, 2026-10-18 | Yes (OOPS repo) | Audit/run output likely |
| 1032 | 20 | `docs/reviews/LONG_TERM_GAME_VISION_FRESH_PERSPECTIVE_PACKET_2026-10-12.md` | 29.3 KiB | 2026-10-10–2026-11-04 | Long-term game vision: self-contained fresh-perspective packet | Yes (OOPS repo) | Audit/run output likely |
| 1033 | 20 | `docs/reviews/MODULARITY_AND_REWRITE_ASSESSMENT_2026-10-16.md` | 19.6 KiB | 2026-10-16–2026-11-04 | Modularity and rewrite assessment, 2026-10-16 | Yes (OOPS repo) | Audit/run output likely |
| 1034 | 20 | `docs/reviews/UI_DESCRIPTION_RULES_EXPANSION_2026-10-26.md` | 21.7 KiB | 2019-10-25–2026-11-04 | UI description rules: further considerations, 2026-10-26 | Yes (OOPS repo) | Audit/run output likely |
| 1035 | 20 | `docs/STORY_RULES.md` | 28.3 KiB | 2026-10-15–2026-11-14 | Story and event rules | Yes (OOPS repo) | Idea board or mixed source |
| 1036 | 20 | `docs/worlds/dnd/FIRST_SLICE.md` | 13.8 KiB | 2026-10-11–2026-11-03 | Proposed first playable slice: a working life in Phandalin | Yes (OOPS repo) | Idea board or mixed source |
| 1037 | 20 | `docs/worlds/mother-of-learning/GW1_GW3_LOCAL_RULE_AND_APPROACHES_2026-10-15.md` | 33.5 KiB | 2026-10-06–2026-10-15 | Cyoria GW1/GW3 specimen: prepared tools or supported collaboration | Yes (OOPS repo) | Idea board or mixed source |
| 1038 | 20 | `docs/YAIR_FORMAT_AND_STORY_DELIVERY_2026-10-14.md` | 15.0 KiB | 2026-10-05–2026-11-04 | YAIR format and story delivery | Yes (OOPS repo) | Idea board or mixed source |
| 1039 | 19 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/upstream-dev.md` | 8.1 KiB | 2026-06-23–2026-10-14 | Upstream dev absorption, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1040 | 19 | `docs/gm/dispatch/body-lineage-2026-10-14/b7/TRIGGERS.md` | 7.7 KiB | 2026-10-14–2026-10-14 | G48-B7.T: generation and publication triggers | Yes (OOPS repo) | Idea board or mixed source |
| 1041 | 19 | `docs/gm/dispatch/carry-out-queue-2026-10-26/WAVE_REPORT.md` | 9.4 KiB | 2026-10-26–2026-10-27 | Carry-out queue wave report, 2026-10-26 | Yes (OOPS repo) | Audit/run output likely |
| 1042 | 19 | `docs/gm/dispatch/companions-2026-10-14/C8_REPORT.md` | 4.5 KiB | 2026-10-14–2026-10-14 | C8 report: idle companions and prestige, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1043 | 19 | `docs/gm/dispatch/cross-world-run-2026-11-06/CHECKPOINT.md` | 26.2 KiB | 2026-11-06–2026-11-06 | Cross-world foundations run (2026-11-06) | Yes (OOPS repo) | Audit/run output likely |
| 1044 | 19 | `docs/gm/dispatch/gen-rules-2026-10-14/g2/SUBTLE_BUGS.md` | 21.7 KiB | 2026-10-14–2026-10-14 | G2 subtle-bug audit | Yes (OOPS repo) | Audit/run output likely |
| 1045 | 19 | `docs/gm/dispatch/gen-rules-2026-10-14/g4/MORE.md` | 8.5 KiB | 2026-10-14–2026-10-14 | G4 extensions: CG13+ and SB27+ | Yes (OOPS repo) | Idea board or mixed source |
| 1046 | 19 | `docs/gm/dispatch/gen-rules-2026-10-14/g4/VARIANTS_AND_LEGACY.md` | 15.2 KiB | 2026-10-14–2026-10-14 | G4 variants, mantles and retcons | Yes (OOPS repo) | Idea board or mixed source |
| 1047 | 19 | `docs/gm/dispatch/idea-expansion-2026-10-11/engine/REPORT.md` | 10.5 KiB | 2026-10-11–2026-10-11 | G5 engine actionability, 2026-10-11 | Yes (OOPS repo) | Audit/run output likely |
| 1048 | 19 | `docs/gm/dispatch/maker-arts-2026-10-14/W6_REPORT.md` | 6.6 KiB | 2026-10-14–2026-10-14 | W6 report: other arts and game crafting | Yes (OOPS repo) | Audit/run output likely |
| 1049 | 19 | `docs/gm/dispatch/pc-groups-2026-10-26/connected-making/REPORT.md` | 29.0 KiB | 2026-10-22–2026-10-26 | G1 connected making: PC1–PC6 audit and expansion | Yes (OOPS repo) | Audit/run output likely |
| 1050 | 19 | `docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L2.md` | 28.9 KiB | 2026-10-15–2026-10-26 | L2: Regional methods, schools and exceptions | Yes (OOPS repo) | Idea board or mixed source |
| 1051 | 19 | `docs/gm/dispatch/procgen-2026-10-13/cr4/SOCIAL.md` | 9.0 KiB | 2026-10-13–2026-10-14 | Gifts, healing, contests and potion plots | Yes (OOPS repo) | Idea board or mixed source |
| 1052 | 19 | `docs/gm/dispatch/procgen-2026-10-13/cr6/REGISTRY.md` | 20.0 KiB | 2026-10-13–2026-10-14 | CR6 registry and item identity | Yes (OOPS repo) | Idea board or mixed source |
| 1053 | 19 | `docs/gm/dispatch/procgen-2026-10-13/p13/SOURCE_NOTES.md` | 7.8 KiB | 2026-10-13–2026-10-14 | Source evidence, scope and contradictions | Yes (OOPS repo) | Idea board or mixed source |
| 1054 | 19 | `docs/gm/dispatch/procgen-2026-10-13/p17/MORE.md` | 8.4 KiB | 2026-10-13–2026-10-14 | More story-power angles, extending D1–D5 | Yes (OOPS repo) | Idea board or mixed source |
| 1055 | 19 | `docs/gm/dispatch/research-tech-2026-10-14/t11/SIGNALS.md` | 10.9 KiB | 2026-10-14–2026-10-14 | T11 signal contracts | Yes (OOPS repo) | Idea board or mixed source |
| 1056 | 19 | `docs/gm/dispatch/research-tech-2026-10-14/t12/FINDINGS.md` | 21.8 KiB | 2026-10-14–2026-10-14 | T12: expertise, memory and teaching evidence | Yes (OOPS repo) | Audit/run output likely |
| 1057 | 19 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r7/INTEGRATION.md` | 6.9 KiB | 2026-10-13–2026-11-04 | R7 integration packet | Yes (OOPS repo) | Audit/run output likely |
| 1058 | 19 | `docs/gm/dispatch/traveler-asks-2026-10-14/ta1/REPORT.md` | 11.5 KiB | 2026-10-14–2026-10-14 | TA1 Village traveler asks v2 | Yes (OOPS repo) | Audit/run output likely |
| 1059 | 19 | `docs/gm/dispatch/traveler-asks-2026-10-14/ta3/LENSES.md` | 11.1 KiB | 2026-10-14–2026-10-14 | TA3 people sight, clues and developer reachability | Yes (OOPS repo) | Idea board or mixed source |
| 1060 | 19 | `docs/PANEL_KIT.md` | 14.4 KiB | 2026-10-13–2026-10-20 | Panel kit | Yes (OOPS repo) | Idea board or mixed source |
| 1061 | 19 | `docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md` | 16.8 KiB | 2026-10-13–2026-11-04 | Progression gate overflow policy (GTL4) | Yes (OOPS repo) | Idea board or mixed source |
| 1062 | 19 | `docs/representations/RELATIONSHIP_WEB.md` | 25.2 KiB | 2026-10-27–2026-10-30 | Relationship web and who knows what | Yes (OOPS repo) | Idea board or mixed source |
| 1063 | 19 | `docs/research/amazing-cultivation-simulator/aspects-2026-10-14/ASPECTS.md` | 19.4 KiB | 2026-10-14–2026-10-14 | Amazing Cultivation Simulator: aspect backfill | Yes (OOPS repo) | Idea board or mixed source |
| 1064 | 19 | `docs/research/cross-game-synthesis-2026-10-14/ASPECT_MATRIX.md` | 78.2 KiB | 2026-10-09–2026-10-14 | Aspect matrix, 2026-10-14 follow-up | Yes (OOPS repo) | Idea board or mixed source |
| 1065 | 19 | `docs/research/LIVING_BESIDE_PROTAGONISTS_2026-10-10.md` | 13.2 KiB | 2026-10-10–2026-10-10 | Living beside protagonists, and seven new world audits | Yes (OOPS repo) | Audit/run output likely |
| 1066 | 19 | `docs/research/power-systems/anime-manga/JOJO_AND_EXTREME_POWERS_COLLECTION_2026-11-18.md` | 9.1 KiB | 2020-02-22–2026-11-18 | JoJo and extreme-ability sources: collector report, 2026-11-18 | Yes (OOPS repo) | Audit/run output likely |
| 1067 | 19 | `docs/research/procedural-materials-2026-10-13/MATERIAL_REFERENCES.md` | 14.8 KiB | 2026-10-13–2026-10-13 | Material references and reusable mechanisms | Yes (OOPS repo) | Idea board or mixed source |
| 1068 | 19 | `docs/reviews/ui-distinct-forms-2026-11-10/R4_BLOCKED_SOURCES.md` | 40.1 KiB | 2023-11-20–2026-11-10 | R4 research on distinct mechanism forms | Yes (OOPS repo) | Audit/run output likely |
| 1069 | 19 | `docs/systems/README.md` | 30.0 KiB | 2026-10-13–2026-11-06 | Systems front door: one row per in-depth system | Yes (OOPS repo) | Idea board or mixed source |
| 1070 | 19 | `docs/worlds/cheat-directions-2026-10-13/06_AUTHORING_RNG_AND_IDLE_PROJECTS.md` | 14.8 KiB | 2026-10-13–2026-10-13 | How cheat acquisition and creation become gameplay | Yes (OOPS repo) | Idea board or mixed source |
| 1071 | 19 | `docs/worlds/hunter-x-hunter/SOURCE_LEDGER.md` | 10.8 KiB | 2026-10-10–2026-10-14 | Hunter × Hunter source ledger | Yes (OOPS repo) | Audit/run output likely |
| 1072 | 18 | `docs/audits/gap-audit-2026-10-30/uv_cov_1.md` | 43.3 KiB | 2026-10-01–2026-10-30 | USER_VISION coverage, lines 1-1400 | Yes (OOPS repo) | Audit/run output likely |
| 1073 | 18 | `docs/audits/idea-audit-2026-11-06/COMPLETION_17_ABILITY_CONSUMERS.md` | 8.2 KiB | 2026-11-06–2026-11-06 | Completion batch 17: ability owner and adaptation consumers | Yes (OOPS repo) | Audit/run output likely |
| 1074 | 18 | `docs/audits/UI_DIRECTIONS_2026-10-30.md` | 42.4 KiB | 2026-10-13–2026-11-04 | UI directions: four whole-UI structures from one game state (2026-10-30) | Yes (OOPS repo) | Audit/run output likely |
| 1075 | 18 | `docs/gm/cross-audit-reconciliation-2026-10-15/SEMANTIC_GM_SMALL_MANIFESTS.md` | 5.0 KiB | 2026-10-06–2026-10-15 | GM manifest semantic crosswalk | Yes (OOPS repo) | Audit/run output likely |
| 1076 | 18 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/natural-play.md` | 20.2 KiB | 2026-10-14–2026-10-14 | Natural-play reachability audit, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1077 | 18 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-exposure.md` | 9.5 KiB | 2026-10-13–2026-10-14 | P02: Passive Famine and optional storm/gust exposure, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1078 | 18 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-known-detail.md` | 13.0 KiB | 2026-10-14–2026-10-14 | P11 known-item hotkeys and known-route detail, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1079 | 18 | `docs/gm/dispatch/body-lineage-2026-10-14/SESSIONS.md` | 1.3 KiB | 2026-10-14–2026-10-14 | Sessions | Yes (OOPS repo) | Idea board or mixed source |
| 1080 | 18 | `docs/gm/dispatch/cheat-cosmology-gaps-2026-10-10/GAMES_REPORT.md` | 32.7 KiB | 2026-10-06–2026-10-10 | REPORT: game cheats and cosmology gaps | Yes (OOPS repo) | Audit/run output likely |
| 1081 | 18 | `docs/gm/dispatch/companions-2026-10-14/C6_REPORT.md` | 6.0 KiB | 2026-10-14–2026-10-14 | C6 report: companion owner map | Yes (OOPS repo) | Audit/run output likely |
| 1082 | 18 | `docs/gm/dispatch/cross-world-systems-2026-11-07/ORDINARY_PLAY_AUDIT_2026-11-09.md` | 15.4 KiB | 2026-11-07–2026-11-09 | Ordinary play and the first four story arcs | Yes (OOPS repo) | Audit/run output likely |
| 1083 | 18 | `docs/gm/dispatch/economy-2026-10-18/E2_REFERENCES_AND_WORLDS.md` | 41.0 KiB | 2026-10-13–2026-10-18 | E2: economy, trade, money and property, references and world canon | Yes (OOPS repo) | Idea board or mixed source |
| 1084 | 18 | `docs/gm/dispatch/gen-rules-2026-10-14/g3/MORE.md` | 6.8 KiB | 2026-10-14–2026-10-14 | G3 further considerations | Yes (OOPS repo) | Idea board or mixed source |
| 1085 | 18 | `docs/gm/dispatch/procgen-2026-10-13/cr1/DOSE_AND_TOLERANCE.md` | 16.3 KiB | 2026-10-13–2026-10-14 | CR1 dose, tolerance and exposure | Yes (OOPS repo) | Idea board or mixed source |
| 1086 | 18 | `docs/gm/dispatch/procgen-2026-10-13/gx3/SOURCE_MAP.md` | 9.5 KiB | 2026-10-13–2026-11-04 | GX3 source map and overlap boundaries | Yes (OOPS repo) | Idea board or mixed source |
| 1087 | 18 | `docs/gm/dispatch/procgen-2026-10-13/p12/REPORT.md` | 14.1 KiB | 2026-10-13–2026-10-14 | P12 report: generated quests, arcs and plot structure | Yes (OOPS repo) | Audit/run output likely |
| 1088 | 18 | `docs/gm/dispatch/procgen-2026-10-13/p28/ONBOARDING.md` | 11.3 KiB | 2026-10-13–2026-10-14 | P28 gradual generator onboarding | Yes (OOPS repo) | Idea board or mixed source |
| 1089 | 18 | `docs/gm/dispatch/procgen-2026-10-13/p30/POWER_LEVELS.md` | 16.2 KiB | 2023-12-12–2026-10-14 | Stories across power levels | Yes (OOPS repo) | Idea board or mixed source |
| 1090 | 18 | `docs/gm/dispatch/procgen-2026-10-13/p32/MORE.md` | 9.0 KiB | 2026-10-13–2026-10-14 | P32: further angles and joins | Yes (OOPS repo) | Idea board or mixed source |
| 1091 | 18 | `docs/gm/dispatch/procgen-2026-10-13/p33/REPORT.md` | 14.9 KiB | 2026-10-13–2026-10-14 | P33 rankings, media, calendar, outsiders, session pacing and defeat | Yes (OOPS repo) | Audit/run output likely |
| 1092 | 18 | `docs/gm/dispatch/progression-gates-2026-10-23/d1-package/files/docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md` | 13.5 KiB | 2026-10-13–2026-10-23 | Progression gate overflow policy (GTL4) | Yes (OOPS repo) | Idea board or mixed source |
| 1093 | 18 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR2_CHECKPOINT.md` | 20.0 KiB | 2026-10-27–2026-10-29 | MR2 checkpoint: memory effects (P3) | Yes (OOPS repo) | Audit/run output likely |
| 1094 | 18 | `docs/gm/dispatch/research-tech-2026-10-14/t5/FUNCTIONS.md` | 13.7 KiB | 2026-10-14–2026-10-14 | T5 function vocabulary and native fit | Yes (OOPS repo) | Idea board or mixed source |
| 1095 | 18 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-l/REPORT.md` | 7.4 KiB | 2026-10-14–2026-10-14 | TW-L report | Yes (OOPS repo) | Audit/run output likely |
| 1096 | 18 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U2_REPORT.md` | 6.4 KiB | 2026-10-14–2026-10-14 | U2 report: cheats, powers and system windows | Yes (OOPS repo) | Audit/run output likely |
| 1097 | 18 | `docs/gm/dispatch/world-core-kit-2026-10-14/W6_REPORT.md` | 6.2 KiB | 2026-10-14–2026-10-14 | W6 report: engine, data shape and kit template (2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 1098 | 18 | `docs/gm/WORLD_IMPLEMENTATION_CONTINUITY.md` | 42.5 KiB | 2026-10-03–2026-10-04 | World implementation continuity review | Yes (OOPS repo) | Audit/run output likely |
| 1099 | 18 | `docs/research/caves-of-qud/aspects-2026-10-14/ASPECTS.md` | 20.5 KiB | 2026-10-14–2026-10-15 | Caves of Qud aspect backfill | Yes (OOPS repo) | Idea board or mixed source |
| 1100 | 18 | `docs/research/cross-game-synthesis-2026-10-14/IMPLEMENTATION_PATTERNS.md` | 25.6 KiB | 2026-10-09–2026-10-14 | Implementation patterns and current YAIRPG seams | Yes (OOPS repo) | Idea board or mixed source |
| 1101 | 18 | `docs/research/dwarf-fortress/aspects-2026-10-14/ASPECTS.md` | 19.7 KiB | 2026-10-14–2026-10-15 | Dwarf Fortress aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1102 | 18 | `docs/research/hogwarts-legacy/SIMILAR_GAMES.md` | 43.1 KiB | 2024-10-29–2026-10-14 | Similar games to study after Hogwarts Legacy | Yes (OOPS repo) | Idea board or mixed source |
| 1103 | 18 | `docs/research/majoras-mask/repass-2026-10-14/REPORT.md` | 13.8 KiB | 2026-10-14–2026-10-14 | P3 Majora's Mask re-pass, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1104 | 18 | `docs/research/minecraft/audits/SYNTHESIS_2026-10-23.md` | 14.6 KiB | 2026-10-14–2026-10-23 | Minecraft corpus audit: cross-audit synthesis, second wave (2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 1105 | 18 | `docs/research/naev/pass-2026-10-14-systems/REPORT.md` | 17.0 KiB | 2026-10-14–2026-11-04 | Naev deep systems sweep | Yes (OOPS repo) | Audit/run output likely |
| 1106 | 18 | `docs/research/power-systems/wiki-digests/DIGEST_the-wandering-inn.md` | 12.2 KiB | 2026-10-10–2026-10-10 | The Wandering Inn wiki digest | Yes (OOPS repo) | Idea board or mixed source |
| 1107 | 18 | `docs/research/power-systems/wiki-digests/history/pre-dump-addendum/DIGEST_the-wandering-inn.md` | 12.2 KiB | 2026-10-10–2026-10-10 | The Wandering Inn wiki digest | Yes (OOPS repo) | Idea board or mixed source |
| 1108 | 18 | `docs/research/proto23/PROTO23_VS_YAIRPG_2026-10-10.md` | 13.8 KiB | 2026-10-10–2026-10-13 | Proto23 vs YAIRPG: full source audit | Yes (OOPS repo) | Audit/run output likely |
| 1109 | 18 | `docs/research/qud-systems-audit-2026-10-15/closure-inputs/d1-package/files/docs/PROGRESSION_GATE_OVERFLOW_2026-10-23.md` | 13.5 KiB | 2026-10-13–2026-10-23 | Progression gate overflow policy (GTL4) | Yes (OOPS repo) | Audit/run output likely |
| 1110 | 18 | `docs/research/rimworld/aspects-2026-10-14/ASPECTS.md` | 20.7 KiB | 2026-10-06–2026-10-14 | RimWorld aspect backfill, installed 1.7 branch | Yes (OOPS repo) | Idea board or mixed source |
| 1111 | 18 | `docs/research/sunless-sea/FINDINGS.md` | 8.2 KiB | mtime 2026-10-10 (no embedded date) | Findings with locators | Yes (OOPS repo) | Audit/run output likely |
| 1112 | 18 | `docs/research/tools/BOOK_TEXT_TOOLS_2026-11-07.md` | 8.7 KiB | 2026-11-06–2026-11-07 | Book text tools: silent-loss fixes (2026-11-07) | Yes (OOPS repo) | Idea board or mixed source |
| 1113 | 18 | `docs/research/warsim/pass-2026-10-14-systems/SYSTEMS.md` | 29.0 KiB | 2026-10-14–2026-10-14 | Fifteen deeper systems | Yes (OOPS repo) | Idea board or mixed source |
| 1114 | 18 | `docs/tools/DSH_CREDIT_PLAN_2026-10-25.md` | 16.7 KiB | 2026-10-25–2026-10-25 | DSH provider and expiring-credit plan, 2026-10-25 | Yes (OOPS repo) | Idea board or mixed source |
| 1115 | 18 | `docs/worlds/COMIC_WORLDS_STARTS_AND_BRANCHES_2026-10-14.md` | 28.0 KiB | 2026-10-14–2026-10-19 | Comic worlds: starts and branches, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1116 | 17 | `docs/audits/CODEX_FOUNDATIONS_REVIEW_2026-11-11.md` | 9.2 KiB | 2026-11-11–2026-11-11 | Codex foundations wave review, 2026-11-11 | Yes (OOPS repo) | Audit/run output likely |
| 1117 | 17 | `docs/audits/idea-audit-2026-11-06/COMPLETION_18_IDEA_BANK.md` | 7.7 KiB | 2026-11-06–2026-11-06 | Completion batch 18: idea bank and skill-store claims | Yes (OOPS repo) | Audit/run output likely |
| 1118 | 17 | `docs/audits/lead-core-flow-2026-11-13/fang-yuan.md` | 22.2 KiB | 2025-12-31–2026-11-13 | Fang Yuan core-flow audit, 2026-11-13 | Yes (OOPS repo) | Audit/run output likely |
| 1119 | 17 | `docs/audits/OTHER_SYSTEMS_DEPTH_CORE_AUDIT.md` | 34.2 KiB | 2026-10-13–2026-11-04 | Other systems: depth core audit | Yes (OOPS repo) | Audit/run output likely |
| 1120 | 17 | `docs/audits/RULE_CONFORMANCE_LEDGER_2026-11-10.md` | 7.4 KiB | 2026-11-10–2026-11-10 | Rule conformance ledger, 2026-11-10 | Yes (OOPS repo) | Audit/run output likely |
| 1121 | 17 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-long-life.md` | 8.2 KiB | 2026-10-14–2026-10-14 | P01 p23-long-life, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1122 | 17 | `docs/gm/dispatch/canon-events-2026-10-14/pilot-fv/LESSONS.md` | 8.4 KiB | 2026-10-14–2026-10-14 | FV canon-event pilot lessons, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1123 | 17 | `docs/gm/dispatch/cheat-status-window-2026-10-13/GOAL.md` | 6.8 KiB | 2026-10-13–2026-10-14 | Cheat save field (C0) and status window (CH1): until-done goal (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 1124 | 17 | `docs/gm/dispatch/companions-2026-10-14/C5_REPORT.md` | 5.6 KiB | 2026-10-14–2026-10-14 | C5 report: procedural companions | Yes (OOPS repo) | Audit/run output likely |
| 1125 | 17 | `docs/gm/dispatch/foundation-run-residue-2026-11-06/CHECKPOINT.md` | 33.6 KiB | 2026-11-06–2026-11-06 | Foundation run: reconciliation residue and first shared seams, 2026-11-06 | Yes (OOPS repo) | Audit/run output likely |
| 1126 | 17 | `docs/gm/dispatch/gen-rules-2026-10-14/g6/MORE.md` | 4.6 KiB | 2026-10-14–2026-10-14 | G6 more to consider | Yes (OOPS repo) | Idea board or mixed source |
| 1127 | 17 | `docs/gm/dispatch/minigames-2026-10-11/ACCEPTANCE_BACKLOG.md` | 8.5 KiB | 2026-10-11–2026-11-04 | Acceptance backlog, 2026-10-11 | Yes (OOPS repo) | Idea board or mixed source |
| 1128 | 17 | `docs/gm/dispatch/pc-groups-2026-10-26/ingredient-substitution/implementation/INTEGRATION.md` | 37.1 KiB | 2026-10-26–2026-10-26 | I5: Integration, world consumer and proof | Yes (OOPS repo) | Audit/run output likely |
| 1129 | 17 | `docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/REPORT.md` | 26.0 KiB | 2026-10-03–2026-10-26 | G7: PC54–PC60 lore and idea sources | Yes (OOPS repo) | Audit/run output likely |
| 1130 | 17 | `docs/gm/dispatch/pc-groups-2026-10-26/process-actions/implementation/thermal/STATUS.md` | 12.2 KiB | 2026-10-26–2026-10-26 | Thermal lane: PC17, PC22 | Yes (OOPS repo) | Audit/run output likely |
| 1131 | 17 | `docs/gm/dispatch/pc-groups-2026-10-26/process-actions/REPORT.md` | 20.5 KiB | 2026-10-26–2026-10-26 | G3: PC15–PC22 | Yes (OOPS repo) | Audit/run output likely |
| 1132 | 17 | `docs/gm/dispatch/pc-groups-2026-10-26/weather-environment/implementation/COVERAGE.md` | 6.1 KiB | 2026-10-26–2026-10-26 | G6 selected-detail ownership and acceptance map | Yes (OOPS repo) | Audit/run output likely |
| 1133 | 17 | `docs/gm/dispatch/procgen-2026-10-13/cr3/MORE.md` | 7.3 KiB | 2026-10-13–2026-10-14 | CR3 more crafting angles | Yes (OOPS repo) | Idea board or mixed source |
| 1134 | 17 | `docs/gm/dispatch/procgen-2026-10-13/cr4/REPORT.md` | 18.5 KiB | 2026-10-13–2026-10-14 | CR4: makers, economy, social and NPC crafters | Yes (OOPS repo) | Audit/run output likely |
| 1135 | 17 | `docs/gm/dispatch/procgen-2026-10-13/cr6/EXPOSURE.md` | 13.6 KiB | 2026-10-13–2026-10-14 | CR6 dose, exposure and effect families | Yes (OOPS repo) | Idea board or mixed source |
| 1136 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p10/BLEACH.md` | 7.1 KiB | 2026-10-13–2026-10-14 | Bleach generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1137 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p10/CHAINSAW_MAN.md` | 7.2 KiB | 2023-11-27–2026-10-14 | Chainsaw Man generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1138 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p10/FATE.md` | 7.3 KiB | 2026-10-13–2026-10-14 | Fate / TYPE-MOON generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1139 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p10/FMA.md` | 7.1 KiB | 2026-10-13–2026-10-14 | Fullmetal Alchemist generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1140 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p10/HXH.md` | 7.0 KiB | 2026-10-13–2026-10-14 | Hunter × Hunter generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1141 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p10/JJK.md` | 7.9 KiB | 2026-10-13–2026-10-14 | JJK generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1142 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p10/NARUTO.md` | 6.9 KiB | 2026-10-13–2026-10-14 | Naruto generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1143 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p10/ORIGINAL_FRONTIER.md` | 7.0 KiB | 2026-10-13–2026-10-14 | Original Frontier generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1144 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p21/MORE.md` | 14.3 KiB | 2026-10-13–2026-10-14 | More conflict and economic story angles | Yes (OOPS repo) | Idea board or mixed source |
| 1145 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p26/BEAT_TEMPLATES.md` | 9.1 KiB | 2026-10-13–2026-10-14 | P26 beat templates: W1 extension | Yes (OOPS repo) | Idea board or mixed source |
| 1146 | 17 | `docs/gm/dispatch/procgen-2026-10-13/p38/RETENTION.md` | 10.0 KiB | 2026-10-13–2026-10-14 | BI4: retention with declared query guarantees | Yes (OOPS repo) | Idea board or mixed source |
| 1147 | 17 | `docs/gm/dispatch/refinement-audits-2026-10-31/HISTORICAL_BORROWING_AND_PROJECTION_AUDIT.md` | 18.0 KiB | 2026-10-31–2026-11-01 | Historical borrowing, projections and temporary means | Yes (OOPS repo) | Audit/run output likely |
| 1148 | 17 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3Y_IMPLEMENTATION_RECEIPT.md` | 12.1 KiB | 2026-10-31–2026-11-03 | KJ3Y implementation receipt: the Saturday table, Old Neil's ritual lesson and the found wallet (kjw15) | Yes (OOPS repo) | Audit/run output likely |
| 1149 | 17 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/IMPL_REPORT.md` | 9.6 KiB | 2026-10-13–2026-10-14 | Part 40 implementation lane report | Yes (OOPS repo) | Audit/run output likely |
| 1150 | 17 | `docs/gm/dispatch/research-tech-2026-10-14/t14/WORLD_FIT.md` | 19.2 KiB | 2026-10-10–2026-10-14 | T14 world fit and source limits | Yes (OOPS repo) | Idea board or mixed source |
| 1151 | 17 | `docs/gm/dispatch/tauri-host-2026-11-06/CHECKPOINT.md` | 18.5 KiB | 2026-10-27–2026-11-06 | Tauri host, slice 1 (2026-11-06) | Yes (OOPS repo) | Audit/run output likely |
| 1152 | 17 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-t/OUTPUT.md` | 21.3 KiB | 2026-10-14–2026-10-14 | TW-T: research and technology evidence extensions | Yes (OOPS repo) | Audit/run output likely |
| 1153 | 17 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-t/REPORT.md` | 7.6 KiB | 2026-10-14–2026-10-14 | CHECKPOINT: COMPLETE | Yes (OOPS repo) | Audit/run output likely |
| 1154 | 17 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U11_REPORT.md` | 6.5 KiB | 2026-10-14–2026-10-14 | U11 report: reading comfort and typography | Yes (OOPS repo) | Audit/run output likely |
| 1155 | 17 | `docs/gm/dispatch/ui-experience-completion-2026-10-12/UI_LEDGER.md` | 3.2 KiB | 2026-10-12–2026-10-12 | UI completion ledger | Yes (OOPS repo) | Audit/run output likely |
| 1156 | 17 | `docs/gm/dispatch/ui-foundation-2026-10-15/parallel/KNOWN_USE_RETURN.md` | 15.9 KiB | 2026-10-15–2026-10-15 | Known item → known use → current station → return | Yes (OOPS repo) | Idea board or mixed source |
| 1157 | 17 | `docs/representations/FAMILY_TREE.md` | 19.1 KiB | 2026-10-29–2026-10-30 | Family tree, lineage, households, inheritance and heirlooms (RPX21) | Yes (OOPS repo) | Idea board or mixed source |
| 1158 | 17 | `docs/research/book-of-hours/REPORT.md` | 18.7 KiB | mtime 2026-11-05 (no embedded date) | Book of Hours source research | Yes (OOPS repo) | Audit/run output likely |
| 1159 | 17 | `docs/research/continuing-traveler-games-2026-10-14/MUD_SOURCE_GUIDE.md` | 8.9 KiB | 2026-09-23–2026-10-14 | MUD reference library: routes and evidence boundaries | Yes (OOPS repo) | Idea board or mixed source |
| 1160 | 17 | `docs/research/everyday-paths-ui-2026-10-15/FARMING_DELEGATION_UI.md` | 6.3 KiB | 2026-10-15–2026-10-15 | Farming and delegation UI evidence | Yes (OOPS repo) | Idea board or mixed source |
| 1161 | 17 | `docs/research/hogwarts-legacy/aspects-2026-10-14/ASPECTS.md` | 19.0 KiB | 2026-10-14–2026-10-14 | Hogwarts Legacy: A01–A12 | Yes (OOPS repo) | Idea board or mixed source |
| 1162 | 17 | `docs/research/itch-io-2026-10-22/BATCH_PROCGEN.md` | 35.1 KiB | 2026-10-15–2026-10-22 | itch.io decode batch: procedural generation, 2026-10-22 | Yes (OOPS repo) | Idea board or mixed source |
| 1163 | 17 | `docs/research/LIBRARY_ATLAS_2026-11-06.md` | 9.5 KiB | 2026-10-31–2026-11-06 | Library atlas, 2026-11-06 | Yes (OOPS repo) | Idea board or mixed source |
| 1164 | 17 | `docs/research/minecraft/audits/SYNTHESIS.md` | 8.1 KiB | 2026-10-14–2026-10-14 | Minecraft corpus audit: cross-lane synthesis (2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 1165 | 17 | `docs/research/multiverse-idle/EVIDENCE.md` | 6.5 KiB | 2026-10-14–2026-10-14 | Evidence register | Yes (OOPS repo) | Idea board or mixed source |
| 1166 | 17 | `docs/research/NARUTO_WITCH_HAT_FOUNDATION_STUDY_2026-11-04.md` | 21.0 KiB | 2026-11-04–2026-11-04 | Naruto and Witch Hat: targeted foundation study | Yes (OOPS repo) | Idea board or mixed source |
| 1167 | 17 | `docs/research/PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md` | 143.9 KiB | 2026-11-12–2026-11-12 | Procedural spellcraft engine evidence | Yes (OOPS repo) | Idea board or mixed source |
| 1168 | 17 | `docs/research/procedural-materials-2026-10-13/deep/REPORT.md` | 16.6 KiB | 2026-10-13–2026-10-13 | Deeper materials and procedural rules: integrated proposal | Yes (OOPS repo) | Audit/run output likely |
| 1169 | 17 | `docs/research/proto23/xeus24-mod-2026-10-10/readers/M2_modjs_4700-9400.md` | 23.3 KiB | 2026-10-10–2026-10-10 | M2: Xeus24 mod.js lines 4700-9400 | Yes (OOPS repo) | Idea board or mixed source |
| 1170 | 17 | `docs/research/proto23/xeus24-mod-2026-10-10/XEUS24_MOD_AUDIT_2026-10-10.md` | 9.3 KiB | 2026-09-05–2026-10-10 | Xeus24 Proto23 mod: audit and what YAIRPG takes | Yes (OOPS repo) | Audit/run output likely |
| 1171 | 17 | `docs/research/qud-systems-audit-2026-10-15/depth-4/CONSUMERS_AND_COMBINATIONS.md` | 17.7 KiB | 2026-10-15–2026-10-15 | Fields, destruction, falling and teleport consumers | Yes (OOPS repo) | Audit/run output likely |
| 1172 | 17 | `docs/research/SCENARIO_SOURCE_SHELVES_AND_BATCHES_2026-11-19.md` | 26.7 KiB | 2026-10-09–2026-11-23 | Scenario source shelves and batches | Yes (OOPS repo) | Idea board or mixed source |
| 1173 | 17 | `docs/research/tabletop-library-2026-10-14/CORE_TITLES_AND_ADAPTATION_PLAN.md` | 12.8 KiB | 2026-10-14–2026-10-18 | Remaining core titles and the adaptation approach | Yes (OOPS repo) | Idea board or mixed source |
| 1174 | 17 | `docs/research/warsim/GENERATION_DIGEST.md` | 5.6 KiB | mtime 2026-10-14 (no embedded date) | Generation digest | Yes (OOPS repo) | Idea board or mixed source |
| 1175 | 17 | `docs/tools/HEADLESS_RUNNER_DEEP_DIVE_2026-11-19.md` | 22.5 KiB | 2026-11-15–2026-11-19 | Headless runner and power fixtures, November 19 | Yes (OOPS repo) | Idea board or mixed source |
| 1176 | 17 | `docs/worlds/cheat-directions-2026-10-13/audit/02_PROCEDURAL_RULES_AND_RANDOMNESS.md` | 17.4 KiB | 2026-10-13–2026-10-13 | Procedural rules and randomness: independent audit | Yes (OOPS repo) | Audit/run output likely |
| 1177 | 17 | `docs/worlds/cheat-directions-2026-10-13/README.md` | 12.8 KiB | 2026-10-13–2026-10-13 | Cheat library, multiverse and future-life preparation | Yes (OOPS repo) | Idea board or mixed source |
| 1178 | 17 | `docs/worlds/deeper-interactions-audit-2026-10-13/05_WORLD_ADAPTATION_CHOICES_AND_IDLE.md` | 15.4 KiB | 2026-10-13–2026-10-13 | World adaptation, choices and idle life, 2026-10-13 | Yes (OOPS repo) | Audit/run output likely |
| 1179 | 17 | `docs/worlds/elden-ring/SOURCE_LEDGER.md` | 10.0 KiB | 2026-10-03–2026-10-03 | Elden Ring source ledger | Yes (OOPS repo) | Audit/run output likely |
| 1180 | 16 | `docs/audits/idea-audit-2026-11-06/COMPLETION_13_MASTER_PLAN_DIRECTION.md` | 5.6 KiB | 2026-11-06–2026-11-06 | Completion batch13: full master plan and direction boundaries | Yes (OOPS repo) | Audit/run output likely |
| 1181 | 16 | `docs/gm/dispatch/absorb-all-2026-10-14/checks/natural-play-2/OBSERVATIONS.md` | 10.0 KiB | 2026-10-14–2026-10-14 | Working observations for final report | Yes (OOPS repo) | Audit/run output likely |
| 1182 | 16 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-household.md` | 12.2 KiB | 2026-10-14–2026-10-14 | P03 household lane, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1183 | 16 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-leisure-memory.md` | 9.1 KiB | 2026-10-14–2026-10-14 | P10 leisure memory lane, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1184 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_circle-of-inevitability.md` | 6.7 KiB | 2026-10-13–2026-10-14 | B10: Circle of Inevitability (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1185 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_fullmetal-alchemist.md` | 7.0 KiB | 2026-10-13–2026-10-14 | B10: Fullmetal Alchemist | Yes (OOPS repo) | Idea board or mixed source |
| 1186 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_harry-potter.md` | 6.9 KiB | 2026-10-13–2026-10-14 | B10: Harry Potter | Yes (OOPS repo) | Idea board or mixed source |
| 1187 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_jujutsu.md` | 7.0 KiB | 2026-10-13–2026-10-14 | B10: Jujutsu Kaisen | Yes (OOPS repo) | Idea board or mixed source |
| 1188 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_lord-of-mysteries.md` | 6.9 KiB | 2026-10-13–2026-10-14 | B10: Lord of the Mysteries (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1189 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_mother-of-learning.md` | 6.6 KiB | 2026-10-13–2026-10-14 | B10: Mother of Learning / Cyoria | Yes (OOPS repo) | Idea board or mixed source |
| 1190 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_shadow-slave.md` | 6.7 KiB | 2026-10-13–2026-10-14 | B10: Shadow Slave (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1191 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_soldiers-life.md` | 6.9 KiB | 2026-10-13–2026-10-14 | B10: A Soldier’s Life / book world 1 | Yes (OOPS repo) | Idea board or mixed source |
| 1192 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b12/REPORT.md` | 14.7 KiB | 2026-10-14–2026-11-04 | B12 micro body hooks report | Yes (OOPS repo) | Audit/run output likely |
| 1193 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b13/REPORT.md` | 13.6 KiB | 2026-10-11–2026-11-04 | B13 report: diagnosis, look-alikes and breadcrumbs | Yes (OOPS repo) | Audit/run output likely |
| 1194 | 16 | `docs/gm/dispatch/body-lineage-2026-10-14/b15/REPORT.md` | 13.8 KiB | 2026-10-14–2026-11-04 | B15 report: body cheats as cards | Yes (OOPS repo) | Audit/run output likely |
| 1195 | 16 | `docs/gm/dispatch/companions-2026-10-14/C1_REPORT.md` | 7.5 KiB | 2026-10-14–2026-10-14 | Lane C1 report: companions by world | Yes (OOPS repo) | Audit/run output likely |
| 1196 | 16 | `docs/gm/dispatch/companions-2026-10-14/runs/SESSIONS.md` | 2.3 KiB | 2026-10-14–2026-10-14 | Codex sessions (launched 2026-10-14 00:43) | Yes (OOPS repo) | Idea board or mixed source |
| 1197 | 16 | `docs/gm/dispatch/connection-detail-2026-10-12/IMPLEMENTATION_PACKETS.md` | 18.3 KiB | 2026-10-12–2026-10-12 | Five implementation packets | Yes (OOPS repo) | Idea board or mixed source |
| 1198 | 16 | `docs/gm/dispatch/connection-detail-2026-10-12/SOURCE_SEAMS_DRAFT.md` | 29.2 KiB | 2026-10-12–2026-10-12 | Inspected source seams for the connection-detail return | Yes (OOPS repo) | Idea board or mixed source |
| 1199 | 16 | `docs/gm/dispatch/features-o1-o5-2026-10-23/QUEUE.md` | 12.8 KiB | 2026-10-14–2026-10-23 | Feature queue O1, O2, O4, O5 and the weakling/description round, 2026-10-23 | Yes (OOPS repo) | Idea board or mixed source |
| 1200 | 16 | `docs/gm/dispatch/gen-rules-2026-10-14/g5/CATALOG.md` | 71.2 KiB | 2026-10-13–2026-10-14 | GC1-GC14 as cheat-card data | Yes (OOPS repo) | Idea board or mixed source |
| 1201 | 16 | `docs/gm/dispatch/harvest-modules-2026-10-14/hv2/MODEL.md` | 18.7 KiB | 2026-10-13–2026-10-14 | HV2 modular harvest model | Yes (OOPS repo) | Idea board or mixed source |
| 1202 | 16 | `docs/gm/dispatch/held-systems-2026-10-10/FINDINGS.md` | 30.7 KiB | 2026-10-08–2026-10-10 | Held systems, enemy cheats and the library: findings | Yes (OOPS repo) | Audit/run output likely |
| 1203 | 16 | `docs/gm/dispatch/idea-expansion-2026-10-11/micro/REPORT.md` | 14.0 KiB | 2026-10-11–2026-10-11 | G8 Micro-progression and native-feature implementation audit | Yes (OOPS repo) | Audit/run output likely |
| 1204 | 16 | `docs/gm/dispatch/lotm-entrance-2026-10-26/CHECKPOINT.md` | 13.2 KiB | 2026-10-26–2026-10-26 | LOTM ordinary entrance, 2026-10-26 | Yes (OOPS repo) | Audit/run output likely |
| 1205 | 16 | `docs/gm/dispatch/macro-micro-detail-2026-10-11/DETAIL_CARDS.md` | 32.8 KiB | 2026-10-11–2026-10-11 | Connected detail tranche MM01–MM08 | Yes (OOPS repo) | Idea board or mixed source |
| 1206 | 16 | `docs/gm/dispatch/macro-micro-detail-2026-10-11/IMPLEMENTATION_PACKETS.md` | 28.2 KiB | 2026-10-11–2026-10-11 | Macro/micro implementation routes | Yes (OOPS repo) | Idea board or mixed source |
| 1207 | 16 | `docs/gm/dispatch/maker-arts-2026-10-14/W1_REPORT.md` | 5.2 KiB | 2026-10-14–2026-10-14 | W1 report: maker arts by world | Yes (OOPS repo) | Audit/run output likely |
| 1208 | 16 | `docs/gm/dispatch/pc-groups-2026-10-26/weather-environment/REPORT.md` | 25.2 KiB | 2026-10-26–2026-10-26 | G6: PC44–PC53 weather and environment | Yes (OOPS repo) | Audit/run output likely |
| 1209 | 16 | `docs/gm/dispatch/playtest-fixes-2026-10-25/CHECKPOINT.md` | 10.9 KiB | 2026-10-25–2026-10-25 | C3 playtest fixes, 2026-10-25 | Yes (OOPS repo) | Audit/run output likely |
| 1210 | 16 | `docs/gm/dispatch/procgen-2026-10-13/cr5/REPORT.md` | 11.1 KiB | 2026-10-13–2026-10-14 | CR5 comic making: research delivery | Yes (OOPS repo) | Audit/run output likely |
| 1211 | 16 | `docs/gm/dispatch/procgen-2026-10-13/cr6/SLICES.md` | 17.8 KiB | 2026-10-13–2026-10-14 | CR6 two playable checkpoints and builder ownership | Yes (OOPS repo) | Audit/run output likely |
| 1212 | 16 | `docs/gm/dispatch/procgen-2026-10-13/gx4/APIS_AND_MIGRATION.md` | 19.7 KiB | 2026-10-13–2026-10-14 | GX4 GA1-GA8 APIs and migration proposal | Yes (OOPS repo) | Idea board or mixed source |
| 1213 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p10/ODD_WORLDS.md` | 7.1 KiB | 2026-10-13–2026-10-14 | Odd-world generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1214 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p11/DUNGEON_CONTENT.md` | 19.9 KiB | 2026-10-13–2026-11-13 | Generated dungeon content inside authored maps | Yes (OOPS repo) | Idea board or mixed source |
| 1215 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p21/ECONOMY_STORIES.md` | 8.3 KiB | 2026-10-11–2026-10-14 | Supply cycles, merchant competition and partnership | Yes (OOPS repo) | Idea board or mixed source |
| 1216 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p26/TROPES.md` | 6.6 KiB | 2026-10-13–2026-10-14 | W2: per-world trope weights | Yes (OOPS repo) | Idea board or mixed source |
| 1217 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p26/TTKS.md` | 8.2 KiB | 2026-10-10–2026-10-14 | TTKS B1–B5: W1 beat candidates | Yes (OOPS repo) | Idea board or mixed source |
| 1218 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p28/REPORT.md` | 14.9 KiB | 2026-10-13–2026-10-14 | P28 report: intent, taste, writers' room and onboarding | Yes (OOPS repo) | Audit/run output likely |
| 1219 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p31/MORE.md` | 9.8 KiB | 2026-10-13–2026-10-14 | Further promise, secrecy and faith combinations | Yes (OOPS repo) | Idea board or mixed source |
| 1220 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p34/REPORT.md` | 10.7 KiB | 2026-10-13–2026-10-14 | P34: Village story spine prototype | Yes (OOPS repo) | Audit/run output likely |
| 1221 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p36/MORE.md` | 13.0 KiB | 2017-06-29–2026-10-14 | More micro details and source comparisons | Yes (OOPS repo) | Idea board or mixed source |
| 1222 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p6/CANON_LOCATORS.md` | 6.9 KiB | 2026-10-10–2026-10-13 | Canon law locators for P6 proposals | Yes (OOPS repo) | Idea board or mixed source |
| 1223 | 16 | `docs/gm/dispatch/procgen-2026-10-13/p8/LIVE_AUDIT.md` | 7.7 KiB | 2026-10-13–2026-10-14 | P8 live resource audit | Yes (OOPS repo) | Audit/run output likely |
| 1224 | 16 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/L4D_CHECKPOINT.md` | 10.7 KiB | 2026-10-27–2026-10-28 | L4d checkpoint, 2026-10-28 | Yes (OOPS repo) | Audit/run output likely |
| 1225 | 16 | `docs/gm/dispatch/refinement-audits-2026-10-31/L2_DIGESTION_ACTING_NOTE.md` | 12.9 KiB | 2026-10-31–2026-11-03 | L2: digestion, the acting method and advancing (text pass, 2026-11-03) | Yes (OOPS repo) | Audit/run output likely |
| 1226 | 16 | `docs/gm/dispatch/refinement-audits-2026-10-31/SPRING_AUTUMN_CICADA_AND_RI_EDGE_CASES.md` | 10.9 KiB | 2026-10-31–2026-11-01 | Spring Autumn Cicada and other Reverend Insanity edge cases | Yes (OOPS repo) | Audit/run output likely |
| 1227 | 16 | `docs/gm/dispatch/refinement-audits-2026-10-31/UI_AUDIT_RECEIPT.md` | 22.8 KiB | 2026-10-27–2026-10-31 | UI refinement audit receipt, 2026-10-31 | Yes (OOPS repo) | Audit/run output likely |
| 1228 | 16 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/INSTITUTIONS_REPORT.md` | 9.3 KiB | 2026-10-13–2026-10-14 | Institutions lane return (2026-10-14) | Yes (OOPS repo) | Audit/run output likely |
| 1229 | 16 | `docs/gm/dispatch/research-tech-2026-10-14/PLAN.md` | 5.2 KiB | 2026-10-14–2026-10-18 | Research and technology wave (2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 1230 | 16 | `docs/gm/dispatch/research-tech-2026-10-14/t5/REFERENCES.md` | 14.4 KiB | 2026-10-13–2026-10-14 | T5 references: what each crafting model actually supplies | Yes (OOPS repo) | Idea board or mixed source |
| 1231 | 16 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-b/REPORT.md` | 9.9 KiB | 2026-10-14–2026-10-14 | TW-B report, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1232 | 16 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U10_REPORT.md` | 7.0 KiB | 2026-10-14–2026-10-14 | U10 report: reveal and teaching | Yes (OOPS repo) | Audit/run output likely |
| 1233 | 16 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U13_REPORT.md` | 4.7 KiB | 2026-10-14–2026-10-14 | U13 report: tabletop, paper and physical inspirations | Yes (OOPS repo) | Audit/run output likely |
| 1234 | 16 | `docs/gm/dispatch/ui-density-slices-2026-10-13/REPORT.md` | 20.9 KiB | 2026-10-13–2026-10-13 | UI density slices report (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 1235 | 16 | `docs/gm/dispatch/world-pack-loader-2026-10-16/DESIGN.md` | 23.9 KiB | 2026-10-15–2026-10-16 | World pack loader: design (WPL) | Yes (OOPS repo) | Idea board or mixed source |
| 1236 | 16 | `docs/representations/CHARACTER_SHEET.md` | 31.9 KiB | 2026-10-29–2026-10-30 | Character sheet and inspection by means | Yes (OOPS repo) | Idea board or mixed source |
| 1237 | 16 | `docs/representations/ORGANIZATIONS.md` | 21.0 KiB | 2026-10-30–2026-10-30 | Running an organization: representations (proposals, 2026-10-30) | Yes (OOPS repo) | Idea board or mixed source |
| 1238 | 16 | `docs/research/CHEAT_ENGINE_CAPABILITY_MATRIX_2026-10-14.md` | 67.1 KiB | 2026-10-10–2026-11-04 | Cheat-to-engine capability matrix, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1239 | 16 | `docs/research/climb-mr2-playtest-2026-10-15/GAP_AUDIT.md` | 13.9 KiB | 2026-10-07–2026-11-03 | Missing coverage and connected opportunities | Yes (OOPS repo) | Audit/run output likely |
| 1240 | 16 | `docs/research/cultivation-idlers/path-of-the-idle-cultivator/REPORT.md` | 9.0 KiB | 2026-10-14–2026-10-14 | Path of the Idle Cultivator: implementation research | Yes (OOPS repo) | Audit/run output likely |
| 1241 | 16 | `docs/research/dcss-dda-depth/aspects-2026-10-14/ASPECTS.md` | 32.5 KiB | 2026-10-14–2026-10-14 | Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1242 | 16 | `docs/research/everyday-paths-ui-2026-10-15/EXISTING_SYSTEM_FIT_AND_PROPOSALS.md` | 23.5 KiB | 2026-10-14–2026-10-15 | Fitting fishing, farming and Taiwu into the existing game | Yes (OOPS repo) | Idea board or mixed source |
| 1243 | 16 | `docs/research/hogwarts-legacy/NEXT_CONSIDERATIONS_2026-10-14.md` | 5.5 KiB | 2026-10-14–2026-10-14 | Hogwarts wave: what to delete and more to consider | Yes (OOPS repo) | Idea board or mixed source |
| 1244 | 16 | `docs/research/idle-reincarnator/IMPLEMENTATION_PACKETS.md` | 4.8 KiB | mtime 2026-10-14 (no embedded date) | Bounded implementation proposals | Yes (OOPS repo) | Idea board or mixed source |
| 1245 | 16 | `docs/research/kingdom-hearts/CHECKPOINT.md` | 6.2 KiB | 2026-10-14–2026-10-14 | Kingdom Hearts lane checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1246 | 16 | `docs/research/kingdom-hearts/TOOLING.md` | 6.5 KiB | mtime 2026-10-15 (no embedded date) | Tooling and reproduction | Yes (OOPS repo) | Idea board or mixed source |
| 1247 | 16 | `docs/research/power-systems/wiki-digests/CORRECTIONS.md` | 6.3 KiB | mtime 2026-10-10 (no embedded date) | Current corrections and source refinements | Yes (OOPS repo) | Idea board or mixed source |
| 1248 | 16 | `docs/research/proto23/CORC_MEDIA_AND_DESIGN_2026-10-20.md` | 17.7 KiB | 2026-10-20–2026-10-21 | Corc / Proto23 media and design collection | Yes (OOPS repo) | Idea board or mixed source |
| 1249 | 16 | `docs/research/rogue-legacy/aspects-2026-10-14/ASPECTS.md` | 15.7 KiB | 2026-10-14–2026-10-14 | Rogue Legacy 1 released FNA source: aspect backfill | Yes (OOPS repo) | Idea board or mixed source |
| 1250 | 16 | `docs/research/siralim-ultimate/NATIVE_TRACE.md` | 9.4 KiB | 2026-10-14–2026-10-14 | Named native traces, with limits | Yes (OOPS repo) | Idea board or mixed source |
| 1251 | 16 | `docs/research/siralim-ultimate/pass-2026-10-14-systems/REPORT.md` | 13.9 KiB | 2026-10-14–2026-11-04 | Siralim Ultimate: undocumented systems sweep | Yes (OOPS repo) | Audit/run output likely |
| 1252 | 16 | `docs/research/skill-growth-2026-10-10/RR_DEEP_READS.md` | 64.1 KiB | 2025-07-23–2026-10-10 | C1: Royal Road growth deep reads | Yes (OOPS repo) | Idea board or mixed source |
| 1253 | 16 | `docs/research/zhutian-shuabao-lu/SOURCES.md` | 3.7 KiB | 2026-10-14–2026-10-15 | Evidence map | Yes (OOPS repo) | Idea board or mixed source |
| 1254 | 16 | `docs/reviews/RAPID_ITERATION_CONSIDERATIONS_2026-10-16.md` | 6.9 KiB | 2026-10-14–2026-11-04 | Rapid iteration considerations, 2026-10-16 | Yes (OOPS repo) | Audit/run output likely |
| 1255 | 16 | `docs/UI_CONSISTENCY_AND_MODULARITY_AUDIT_2026-10-11.md` | 13.2 KiB | 2026-10-11–2026-11-04 | UI consistency, improvements and modular panels | Yes (OOPS repo) | Audit/run output likely |
| 1256 | 16 | `docs/WORLD_ENTRY_RULES.md` | 30.5 KiB | 2026-10-10–2026-11-16 | World entry rules | Yes (OOPS repo) | Idea board or mixed source |
| 1257 | 16 | `docs/worlds/world-core-kit-2026-10-14/W24_LAWS_AND_ORDERING.md` | 51.6 KiB | 2026-10-14–2026-10-14 | W24: Laws in twin actions and same-tick story order | Yes (OOPS repo) | Idea board or mixed source |
| 1258 | 15 | `docs/audits/toolsets_2026-10-21/CPP2IL_REA_AND_CHAT_ACCESS.md` | 10.7 KiB | 2026-10-21–2026-11-04 | Cpp2IL repair, REA update and chat access, 2026-10-21 | Yes (OOPS repo) | Audit/run output likely |
| 1259 | 15 | `docs/audits/WAVE_INTEGRATION_2026-11-10.md` | 13.8 KiB | 2026-11-10–2026-11-10 | Wave integration, 2026-11-10 (FRC67, FRC68) | Yes (OOPS repo) | Audit/run output likely |
| 1260 | 15 | `docs/audits/world_pack_details_2026-10-20/L4.md` | 7.5 KiB | 2026-10-10–2026-10-20 | L4 world-pack detail pass: Bleach and Jujutsu | Yes (OOPS repo) | Audit/run output likely |
| 1261 | 15 | `docs/emergent/E4B_MATERIALS_AND_NOITA.md` | 20.4 KiB | 2026-10-07–2026-10-09 | Materials, states and lessons from Noita (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 1262 | 15 | `docs/gm/cross-audit-reconciliation-2026-10-15/T11_SEMANTIC_CONTINUATION.md` | 8.9 KiB | 2026-10-15–2026-10-15 | T11: remaining named inventories, embedded sections and audit findings | Yes (OOPS repo) | Audit/run output likely |
| 1263 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_bleach.md` | 6.6 KiB | 2026-10-13–2026-10-14 | B10: Bleach | Yes (OOPS repo) | Idea board or mixed source |
| 1264 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_chainsaw-man.md` | 6.8 KiB | 2026-10-13–2026-10-14 | B10: Chainsaw Man | Yes (OOPS repo) | Idea board or mixed source |
| 1265 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_cradle.md` | 6.1 KiB | 2026-10-13–2026-10-14 | B10: Cradle (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1266 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_crucible.md` | 6.2 KiB | 2026-10-13–2026-10-14 | B10: The Crucible (original) | Yes (OOPS repo) | Idea board or mixed source |
| 1267 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_dnd.md` | 6.4 KiB | 2026-10-13–2026-10-14 | B10: D&D / Forgotten Realms | Yes (OOPS repo) | Idea board or mixed source |
| 1268 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_dreaming.md` | 5.9 KiB | 2026-10-13–2026-10-14 | B10: The Dreaming (original) | Yes (OOPS repo) | Idea board or mixed source |
| 1269 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_fate.md` | 6.7 KiB | 2026-10-13–2026-10-14 | B10: Fate / TYPE-MOON | Yes (OOPS repo) | Idea board or mixed source |
| 1270 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_fog-city.md` | 6.0 KiB | 2026-10-13–2026-10-14 | B10: The Fog City (original) | Yes (OOPS repo) | Idea board or mixed source |
| 1271 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_frieren.md` | 6.4 KiB | 2026-10-13–2026-10-14 | B10: Frieren | Yes (OOPS repo) | Idea board or mixed source |
| 1272 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_genetic-ascension.md` | 6.3 KiB | 2026-10-13–2026-10-14 | B10: Genetic Ascension (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1273 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_hunter-x-hunter.md` | 6.8 KiB | 2026-10-13–2026-10-14 | B10: Hunter x Hunter | Yes (OOPS repo) | Idea board or mixed source |
| 1274 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_kenshi.md` | 6.0 KiB | 2026-10-13–2026-10-14 | B10: Kenshi (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1275 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_legendary-mechanic.md` | 6.0 KiB | 2026-10-13–2026-10-14 | B10: The Legendary Mechanic (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1276 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_naruto.md` | 6.7 KiB | 2026-10-13–2026-10-14 | B10: Naruto | Yes (OOPS repo) | Idea board or mixed source |
| 1277 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_original-frontier.md` | 6.5 KiB | 2026-10-13–2026-10-14 | B10: Original Frontier / home | Yes (OOPS repo) | Idea board or mixed source |
| 1278 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_paradise-hub.md` | 6.9 KiB | 2026-10-13–2026-10-14 | B10: Reincarnation Paradise / contractor hub | Yes (OOPS repo) | Idea board or mixed source |
| 1279 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_perfect-run.md` | 6.1 KiB | 2026-10-13–2026-10-14 | B10: The Perfect Run (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1280 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_red-basin.md` | 6.1 KiB | 2026-10-13–2026-10-14 | B10: The Red Basin (original) | Yes (OOPS repo) | Idea board or mixed source |
| 1281 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_reverend-insanity.md` | 6.5 KiB | 2026-10-13–2026-10-14 | B10: Reverend Insanity (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1282 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_salvage-reach.md` | 6.5 KiB | 2026-10-13–2026-10-14 | B10: Salvage Reach (original) | Yes (OOPS repo) | Idea board or mixed source |
| 1283 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_speedrunning-multiverse.md` | 6.2 KiB | 2026-10-13–2026-10-14 | B10: Speedrunning the Multiverse (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1284 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_ttks-border-inspector.md` | 6.6 KiB | 2026-10-10–2026-10-14 | B10: 废土边境检查官 | Yes (OOPS repo) | Idea board or mixed source |
| 1285 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_ttks-humanitys-heir.md` | 6.1 KiB | 2026-10-10–2026-10-14 | B10: 全人类的继承者 | Yes (OOPS repo) | Idea board or mixed source |
| 1286 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_ttks-mimic.md` | 6.1 KiB | 2026-10-10–2026-10-14 | B10: 巫师你好，我是伪人 | Yes (OOPS repo) | Idea board or mixed source |
| 1287 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_warlock-magus-world.md` | 6.5 KiB | 2026-10-13–2026-10-14 | B10: Warlock of the Magus World (source world) | Yes (OOPS repo) | Idea board or mixed source |
| 1288 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b14/EVENT_SHAPES.md` | 33.6 KiB | 2026-10-13–2026-10-14 | B14 seeded event shapes | Yes (OOPS repo) | Idea board or mixed source |
| 1289 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b14/PSYCHOLOGY.md` | 11.8 KiB | 2026-10-13–2026-10-14 | B14 psychology: G65 | Yes (OOPS repo) | Idea board or mixed source |
| 1290 | 15 | `docs/gm/dispatch/body-lineage-2026-10-14/b8/REPORT.md` | 9.8 KiB | 2026-10-14–2026-11-04 | B8 report: desktop body and lineage tools | Yes (OOPS repo) | Audit/run output likely |
| 1291 | 15 | `docs/gm/dispatch/body-lineage-expansion-2026-10-11/BROOD_AND_ECOLOGY.md` | 23.0 KiB | 2026-10-11–2026-10-11 | Brood, ecology and biological civilization expansion | Yes (OOPS repo) | Idea board or mixed source |
| 1292 | 15 | `docs/gm/dispatch/body-lineage-expansion-2026-10-11/CULTIVATION.md` | 16.4 KiB | 2026-10-11–2026-10-11 | Cultivation lane: constitutions and lineage as working mechanisms | Yes (OOPS repo) | Idea board or mixed source |
| 1293 | 15 | `docs/gm/dispatch/body-lineage-expansion-2026-10-11/LORE_AND_WORLD_FIT.md` | 17.6 KiB | 2026-10-10–2026-10-11 | Lore and world fit: bodies, constitutions and lineages | Yes (OOPS repo) | Idea board or mixed source |
| 1294 | 15 | `docs/gm/dispatch/body-lineage-expansion-2026-10-11/WIZARDRY.md` | 18.3 KiB | 2026-10-11–2026-10-11 | Wizardry: bodies, inherited faculties and durable institutions | Yes (OOPS repo) | Idea board or mixed source |
| 1295 | 15 | `docs/gm/dispatch/dual-gm-2026-10-11/expansion/continuation/COMPLETION_ACCEPTANCE_AUDIT.md` | 4.6 KiB | 2026-10-11–2026-10-11 | Frozen edition completion acceptance audit | Yes (OOPS repo) | Audit/run output likely |
| 1296 | 15 | `docs/gm/dispatch/engine-bindings-2026-10-22/CHECKPOINT.md` | 8.8 KiB | 2026-10-22–2026-10-22 | Engine bindings from cultivation research, 2026-10-22 | Yes (OOPS repo) | Audit/run output likely |
| 1297 | 15 | `docs/gm/dispatch/gen-rules-2026-10-14/g4/REPORT.md` | 9.4 KiB | 2026-10-14–2026-10-14 | G4 delivery report | Yes (OOPS repo) | Audit/run output likely |
| 1298 | 15 | `docs/gm/dispatch/idea-expansion-2026-10-11/life/REPORT.md` | 14.7 KiB | 2026-10-11–2026-10-11 | G3 lived worlds, social life and economy | Yes (OOPS repo) | Audit/run output likely |
| 1299 | 15 | `docs/gm/dispatch/life-walk-2026-11-18/LIFE_WALK.md` | 15.8 KiB | 2026-11-18–2026-11-18 | Life walk: ordinary play from start to legacy (2026-11-18, dev pass; findings, not decisions) | Yes (OOPS repo) | Audit/run output likely |
| 1300 | 15 | `docs/gm/dispatch/macro-micro-detail-2026-10-11/COVERAGE.md` | 6.2 KiB | 2026-10-11–2026-10-11 | Coverage and exact remainder | Yes (OOPS repo) | Audit/run output likely |
| 1301 | 15 | `docs/gm/dispatch/new-game-audits-2026-10-07/PROPOSAL_REVIEW.md` | 11.2 KiB | 2026-10-07–2026-10-07 | Proposal review: new-game audit packets | Yes (OOPS repo) | Audit/run output likely |
| 1302 | 15 | `docs/gm/dispatch/pc-groups-2026-10-26/cross-craft-connections/implementation/COVERAGE.md` | 7.4 KiB | 2026-10-26–2026-10-26 | G4 implementation coverage and necessary dependencies | Yes (OOPS repo) | Audit/run output likely |
| 1303 | 15 | `docs/gm/dispatch/procgen-2026-10-13/cr2/CHEATS_AND_CRAFTING.md` | 21.6 KiB | 2026-10-13–2026-10-14 | CR2 cheats, conservation and observation | Yes (OOPS repo) | Idea board or mixed source |
| 1304 | 15 | `docs/gm/dispatch/procgen-2026-10-13/cr3/DIRECTOR_TOOLS.md` | 11.6 KiB | 2026-10-13–2026-10-14 | CR3 director and developer tools | Yes (OOPS repo) | Idea board or mixed source |
| 1305 | 15 | `docs/gm/dispatch/procgen-2026-10-13/cr4/NPC_CRAFTERS.md` | 10.4 KiB | 2026-10-13–2026-10-14 | NPC makers use the same material law | Yes (OOPS repo) | Idea board or mixed source |
| 1306 | 15 | `docs/gm/dispatch/procgen-2026-10-13/cr5/MORE_COMIC_MAKING.md` | 15.7 KiB | 2026-10-13–2026-10-14 | More comic making: CM17-CM31 | Yes (OOPS repo) | Idea board or mixed source |
| 1307 | 15 | `docs/gm/dispatch/procgen-2026-10-13/cr6/KNOWLEDGE.md` | 14.5 KiB | 2026-10-13–2026-10-14 | CR6 observer evidence, notebook and safe projection | Yes (OOPS repo) | Idea board or mixed source |
| 1308 | 15 | `docs/gm/dispatch/procgen-2026-10-13/gx3/MORE.md` | 6.6 KiB | 2026-10-13–2026-10-14 | More generation angles and concrete suggestions | Yes (OOPS repo) | Idea board or mixed source |
| 1309 | 15 | `docs/gm/dispatch/procgen-2026-10-13/gx5/REPORT.md` | 8.5 KiB | 2026-10-13–2026-10-14 | GX5 per-save mixture appearances | Yes (OOPS repo) | Audit/run output likely |
| 1310 | 15 | `docs/gm/dispatch/procgen-2026-10-13/p15/DIALOGUE.md` | 13.1 KiB | 2026-10-13–2026-10-14 | P15 dialogue and voice | Yes (OOPS repo) | Idea board or mixed source |
| 1311 | 15 | `docs/gm/dispatch/procgen-2026-10-13/p17/LIVE_AUDIT.md` | 6.2 KiB | 2026-10-09–2026-10-14 | P17 live narrative audit | Yes (OOPS repo) | Audit/run output likely |
| 1312 | 15 | `docs/gm/dispatch/procgen-2026-10-13/p18/METRICS.md` | 14.5 KiB | 2026-10-13–2026-10-14 | F1: story metrics and measurement rules | Yes (OOPS repo) | Idea board or mixed source |
| 1313 | 15 | `docs/gm/dispatch/procgen-2026-10-13/p37/REPORT.md` | 15.5 KiB | 2026-10-13–2026-10-14 | P37: per-world micro texture catalog | Yes (OOPS repo) | Audit/run output likely |
| 1314 | 15 | `docs/gm/dispatch/procgen-2026-10-13/p38/REPORT.md` | 10.8 KiB | 2026-10-13–2026-10-14 | P38: contract consolidation across story lanes | Yes (OOPS repo) | Audit/run output likely |
| 1315 | 15 | `docs/gm/dispatch/procgen-2026-10-13/p39/SOURCE_AUDIT.md` | 6.5 KiB | 2026-10-13–2026-10-14 | P39 source and status audit | Yes (OOPS repo) | Audit/run output likely |
| 1316 | 15 | `docs/gm/dispatch/procgen-2026-10-13/p6/LIVE_AUDIT.md` | 5.5 KiB | 2026-10-13–2026-10-13 | P6 live creation audit | Yes (OOPS repo) | Audit/run output likely |
| 1317 | 15 | `docs/gm/dispatch/progression-gates-2026-10-23/CHECKPOINT.md` | 15.5 KiB | 2026-10-23–2026-10-25 | Progression gates checkpoint (2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 1318 | 15 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/L4C_CHECKPOINT.md` | 17.1 KiB | 2026-10-27–2026-10-28 | L4c checkpoint: private cast, travel and resident entry, 2026-10-28 | Yes (OOPS repo) | Audit/run output likely |
| 1319 | 15 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR3_CHECKPOINT.md` | 26.3 KiB | 2026-10-27–2026-10-30 | MR3 checkpoint: trait temperament on memory | Yes (OOPS repo) | Audit/run output likely |
| 1320 | 15 | `docs/gm/dispatch/refinement-audits-2026-10-31/HP_WHOLE_WORLD_PLAN_2026-11-03.md` | 19.7 KiB | 2026-10-28–2026-11-07 | Harry Potter lead run: whole-world window plan (proposal, 2026-11-03) | Yes (OOPS repo) | Audit/run output likely |
| 1321 | 15 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3W_IMPLEMENTATION_RECEIPT.md` | 10.5 KiB | 2026-10-31–2026-11-03 | KJ3W implementation receipt: the apartment, the portrait, the company morning and noon (kjw13) | Yes (OOPS repo) | Audit/run output likely |
| 1322 | 15 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3X_IMPLEMENTATION_RECEIPT.md` | 11.4 KiB | 2026-10-31–2026-11-03 | KJ3X implementation receipt: the Divination Club, the afternoon lessons and the family dinner (kjw14) | Yes (OOPS repo) | Audit/run output likely |
| 1323 | 15 | `docs/gm/dispatch/research-tech-2026-10-14/t14/CHECKPOINT.md` | 3.2 KiB | 2026-10-14–2026-10-14 | T14 checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1324 | 15 | `docs/gm/dispatch/research-tech-2026-10-14/t5/ROADMAPS.md` | 35.3 KiB | 2026-10-14–2026-10-14 | T5 worked AND/OR roadmaps | Yes (OOPS repo) | Idea board or mixed source |
| 1325 | 15 | `docs/gm/dispatch/sonnet-wave-2026-10-30/OVERNIGHT_2026-10-30.md` | 12.5 KiB | 2026-10-27–2026-11-02 | Overnight supervision (2026-10-30 night) | Yes (OOPS repo) | Idea board or mixed source |
| 1326 | 15 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-k/REPORT.md` | 9.2 KiB | 2026-10-14–2026-10-14 | CHECKPOINT: COMPLETE | Yes (OOPS repo) | Audit/run output likely |
| 1327 | 15 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-l/OUTPUT.md` | 24.7 KiB | 2026-10-14–2026-10-14 | TW-L: levels and shared pieces | Yes (OOPS repo) | Audit/run output likely |
| 1328 | 15 | `docs/gm/dispatch/ui-experience-completion-2026-10-12/feedback/REPORT.md` | 9.0 KiB | 2026-10-12–2026-10-12 | Feedback/Whimsy lane delivery,2026-10-12 | Yes (OOPS repo) | Audit/run output likely |
| 1329 | 15 | `docs/gm/dispatch/ui-foundation-2026-10-15/parallel/RECIPE_LEGIBILITY.md` | 9.7 KiB | 2026-10-15–2026-10-15 | One native recipe legibility trial | Yes (OOPS repo) | Idea board or mixed source |
| 1330 | 15 | `docs/gm/dispatch/ui-identity-combat-2026-10-30/PLAN.md` | 11.8 KiB | 2026-10-30–2026-10-30 | UI identity and combat wave (2026-10-30) | Yes (OOPS repo) | Idea board or mixed source |
| 1331 | 15 | `docs/gm/dispatch/ui-refactor-wave-2026-10-29/PLAN.md` | 23.0 KiB | 2026-10-29–2026-10-30 | UI refactor wave, 2026-10-29 | Yes (OOPS repo) | Idea board or mixed source |
| 1332 | 15 | `docs/gm/feature-wave/features/book-world-subtleties/recognition/INTEGRATION.md` | 21.8 KiB | 2026-10-05–2026-10-05 | Recognition return | Yes (OOPS repo) | Audit/run output likely |
| 1333 | 15 | `docs/gm/world-implementation/frontier-runtime/COVERAGE.md` | 70.0 KiB | mtime 2026-11-05 (no embedded date) | INC-P1 finite source/native/UI coverage | Yes (OOPS repo) | Audit/run output likely |
| 1334 | 15 | `docs/HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md` | 11.4 KiB | 2026-10-05–2026-11-04 | Hunger and bodily needs considerations, 2026-10-13 | Yes (OOPS repo) | Idea board or mixed source |
| 1335 | 15 | `docs/reports/PROGRESS_ATLAS_2026-11-14.md` | 11.6 KiB | 2026-11-11–2026-11-14 | OOPS progress atlas, November 14, 2026 | Yes (OOPS repo) | Audit/run output likely |
| 1336 | 15 | `docs/research/academagia/pass-2026-10-14-systems/SYSTEMS.md` | 40.0 KiB | 2026-10-14–2026-10-14 | Fifteen deep systems | Yes (OOPS repo) | Idea board or mixed source |
| 1337 | 15 | `docs/research/academagia/SMALL_TOUCHES.md` | 1.0 KiB | mtime 2026-10-13 (no embedded date) | Academagia small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1338 | 15 | `docs/research/bitlife/aspects-2026-10-14/ASPECTS.md` | 11.4 KiB | 2026-10-14–2026-10-14 | BitLife public FAQ and historical guides: aspect backfill | Yes (OOPS repo) | Idea board or mixed source |
| 1339 | 15 | `docs/research/bitlife/SMALL_TOUCHES.md` | 1.7 KiB | 2026-10-13–2026-10-13 | BitLife small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1340 | 15 | `docs/research/cividle/SMALL_TOUCHES.md` | 1.2 KiB | mtime 2026-10-13 (no embedded date) | CivIdle small touches (proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 1341 | 15 | `docs/research/climb-mr2-playtest-2026-10-15/UI_SOURCING.md` | 8.3 KiB | 2026-10-15–2026-10-15 | UI sourcing and connected considerations, 2026-10-15 | Yes (OOPS repo) | Idea board or mixed source |
| 1342 | 15 | `docs/research/cultivation-idlers/REPORT.md` | 9.9 KiB | 2026-10-13–2026-10-13 | Cultivation browser idlers: source audit (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 1343 | 15 | `docs/research/cultivation-idlers/SMALL_TOUCHES.md` | 1.0 KiB | mtime 2026-10-13 (no embedded date) | Cultivation idlers small touches (proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 1344 | 15 | `docs/research/discworld-mud/REPORT.md` | 10.3 KiB | 2026-06-04–2026-10-13 | Discworld MUD: source audit (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 1345 | 15 | `docs/research/discworld-mud/SMALL_TOUCHES.md` | 1.2 KiB | mtime 2026-10-13 (no embedded date) | Discworld MUD small touches (proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 1346 | 15 | `docs/research/GAME_ABSORPTION_SCOUT_2026-10-14-report.md` | 11.9 KiB | mtime 2026-11-05 (no embedded date) | Next games to absorb: reconciled research, October 14, 2026 | Yes (OOPS repo) | Audit/run output likely |
| 1347 | 15 | `docs/research/hearts-of-iron-iv/pass-2026-10-14-systems/SYSTEMS.md` | 43.5 KiB | 2026-10-14–2026-10-14 | Fifteen deeper systems | Yes (OOPS repo) | Idea board or mixed source |
| 1348 | 15 | `docs/research/hearts-of-iron-iv/PROVINCE_WAR_FIT.md` | 7.1 KiB | 2026-10-14–2026-10-14 | Province War fit: installed HoI4 rule families | Yes (OOPS repo) | Idea board or mixed source |
| 1349 | 15 | `docs/research/hogwarts-games/SMALL_TOUCHES.md` | 1.8 KiB | mtime 2026-10-14 (no embedded date) | Hogwarts games small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1350 | 15 | `docs/research/hyperrogue/pass-2026-10-14-systems/SYSTEMS.md` | 46.4 KiB | 2026-10-14–2026-10-14 | Fifteen deeper systems | Yes (OOPS repo) | Idea board or mixed source |
| 1351 | 15 | `docs/research/immortal-life/pass-2026-10-14-systems/SYSTEMS.md` | 27.5 KiB | 2026-10-14–2026-10-14 | Fifteen deeper systems | Yes (OOPS repo) | Idea board or mixed source |
| 1352 | 15 | `docs/research/itch-io-2026-10-22/BATCH_SCOUT.md` | 30.7 KiB | 2025-02-11–2026-10-22 | itch.io batch scout: new games beyond the first screen, 2026-10-22 | Yes (OOPS repo) | Idea board or mixed source |
| 1353 | 15 | `docs/research/kingdom-hearts/REPORT.md` | 8.6 KiB | mtime 2026-10-15 (no embedded date) | Kingdom Hearts: one traveler, many local rules | Yes (OOPS repo) | Audit/run output likely |
| 1354 | 15 | `docs/research/kingdom-hearts/SOURCE_LEDGER.md` | 6.0 KiB | 2026-10-14–2026-10-14 | Source ledger, Kingdom Hearts | Yes (OOPS repo) | Audit/run output likely |
| 1355 | 15 | `docs/research/kingdom-of-loathing/REPORT.md` | 8.0 KiB | 2026-10-13–2026-10-13 | Kingdom of Loathing: source audit (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 1356 | 15 | `docs/research/kingdom-of-loathing/SMALL_TOUCHES.md` | 1.1 KiB | mtime 2026-10-13 (no embedded date) | Kingdom of Loathing small touches (inferred proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 1357 | 15 | `docs/research/majoras-mask/aspects-2026-10-14/ASPECTS.md` | 13.5 KiB | 2026-10-14–2026-10-14 | Majora's Mask (N64 US): aspect backfill | Yes (OOPS repo) | Idea board or mixed source |
| 1358 | 15 | `docs/research/majoras-mask/SMALL_TOUCHES.md` | 1.8 KiB | 2026-10-13–2026-10-13 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1359 | 15 | `docs/research/manga-text/STAGE1_VALIDATION_2026-10-22.md` | 7.2 KiB | 2026-10-22–2026-10-23 | Stage 1 validation, 2026-10-22 | Yes (OOPS repo) | Audit/run output likely |
| 1360 | 15 | `docs/research/modding-tree/REPORT.md` | 13.8 KiB | 2026-10-13–2026-10-13 | The Modding Tree and Prestige Tree: source audit (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 1361 | 15 | `docs/research/modding-tree/SMALL_TOUCHES.md` | 1.4 KiB | mtime 2026-10-13 (no embedded date) | Modding Tree small touches (proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 1362 | 15 | `docs/research/multiworld-synthesis-2026-10-14/AUDIT.md` | 27.3 KiB | 2026-10-14–2026-10-15 | Multi-world evidence audit | Yes (OOPS repo) | Audit/run output likely |
| 1363 | 15 | `docs/research/naev/pass-2026-10-14-systems/SYSTEMS.md` | 40.7 KiB | 2026-10-14–2026-10-14 | Naev: fifteen deep system traces | Yes (OOPS repo) | Idea board or mixed source |
| 1364 | 15 | `docs/research/outer-wilds/aspects-2026-10-14/ASPECTS.md` | 14.7 KiB | 2026-10-14–2026-10-14 | Outer Wilds, community New Horizons contracts: aspect backfill | Yes (OOPS repo) | Idea board or mixed source |
| 1365 | 15 | `docs/research/outer-wilds/SMALL_TOUCHES.md` | 1.6 KiB | mtime 2026-10-14 (no embedded date) | Small touches: PROPOSALS | Yes (OOPS repo) | Idea board or mixed source |
| 1366 | 15 | `docs/research/power-catalogues-2026-11-16/INTERACTION_ORACLE_2026-11-18.md` | 22.2 KiB | 2026-11-16–2026-11-18 | Interaction oracle (2026-11-18, proposals) | Yes (OOPS repo) | Audit/run output likely |
| 1367 | 15 | `docs/research/power-systems/anime-manga/REPORT.md` | 19.9 KiB | 2026-10-10–2026-10-10 | Lane A: anime and manga power systems | Yes (OOPS repo) | Audit/run output likely |
| 1368 | 15 | `docs/research/proto23/xeus24-mod-2026-10-10/readers/P_process_tests.md` | 26.2 KiB | 2026-10-10–2026-10-10 | Xeus24 mod: process, test harness, userscript route, titles tests | Yes (OOPS repo) | Idea board or mixed source |
| 1369 | 15 | `docs/research/qud-systems-audit-2026-10-15/depth-3/ADDITIONAL_SYSTEMS.md` | 10.0 KiB | 2026-10-15–2026-10-15 | Additional unread abilities and combinations | Yes (OOPS repo) | Audit/run output likely |
| 1370 | 15 | `docs/research/qud-systems-audit-2026-10-15/GENERATED_WORLD_AND_QUESTS.md` | 9.8 KiB | 2026-10-15–2026-10-15 | S5 Generated histories, villages, quests, factions and items | Yes (OOPS repo) | Audit/run output likely |
| 1371 | 15 | `docs/research/relationships-2026-10-10/YAIRPG_STATE_AND_GAPS.md` | 35.2 KiB | 2026-10-02–2026-10-10 | R1: Relationships audit (code, designs, research, gap map) | Yes (OOPS repo) | Audit/run output likely |
| 1372 | 15 | `docs/research/rimworld/pass-2026-10-14-systems/SYSTEMS.md` | 50.1 KiB | 2026-10-14–2026-10-14 | Fifteen newly deepened system routes | Yes (OOPS repo) | Idea board or mixed source |
| 1373 | 15 | `docs/research/rune-factory-5/REPORT.md` | 10.9 KiB | 2026-10-14–2026-10-14 | Rune Factory 5 feature scout, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1374 | 15 | `docs/research/scroll-of-taiwu/pass-2026-10-14-systems/SYSTEMS.md` | 33.6 KiB | 2026-10-14–2026-10-14 | Fifteen deeper Taiwu systems | Yes (OOPS repo) | Idea board or mixed source |
| 1375 | 15 | `docs/research/super-robot-wars/aspects-2026-10-14/ASPECTS.md` | 11.3 KiB | 2026-10-14–2026-10-14 | Super Robot Wars, title-qualified V and W guide pass: aspect backfill | Yes (OOPS repo) | Idea board or mixed source |
| 1376 | 15 | `docs/research/super-robot-wars/REPORT.md` | 9.9 KiB | 2026-10-13–2026-10-13 | Super Robot Wars: how crossovers keep dozens of canons consistent (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 1377 | 15 | `docs/research/super-robot-wars/SMALL_TOUCHES.md` | 1.3 KiB | mtime 2026-10-13 (no embedded date) | Super Robot Wars small touches (proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 1378 | 15 | `docs/research/theory-of-magic/repass-2026-10-14/REPORT.md` | 13.8 KiB | 2026-10-14–2026-10-14 | Theory of Magic P4 re-pass, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1379 | 15 | `docs/research/trimps-antimatter/SMALL_TOUCHES.md` | 1.9 KiB | 2026-10-13–2026-10-13 | Small touches | Yes (OOPS repo) | Idea board or mixed source |
| 1380 | 15 | `docs/reviews/BOOK_RESEARCH_USAGE_AUDIT_2026-10-16.md` | 16.6 KiB | 2026-10-16–2026-11-04 | Book research usage audit, 2026-10-16 | Yes (OOPS repo) | Audit/run output likely |
| 1381 | 15 | `docs/reviews/PLAY_QUEUE_2026-10-24.md` | 7.1 KiB | 2026-10-24–2026-11-04 | Play queue, 2026-10-24 | Yes (OOPS repo) | Audit/run output likely |
| 1382 | 15 | `docs/worlds/chainsaw-man/INTERACTIONS.md` | 3.8 KiB | mtime 2026-10-14 (no embedded date) | Chainsaw Man interactions and cross-system cases | Yes (OOPS repo) | Idea board or mixed source |
| 1383 | 15 | `docs/worlds/cheat-directions-2026-10-13/05_INTERACTIONS_AND_CHEAT_ECOLOGIES.md` | 16.2 KiB | 2026-10-10–2026-10-13 | Cheat interactions and cheat ecologies | Yes (OOPS repo) | Idea board or mixed source |
| 1384 | 15 | `docs/worlds/cheat-directions-2026-10-13/09_COVERAGE_VALIDATION_AND_IMPLEMENTATION_ORDER.md` | 13.1 KiB | 2026-10-13–2026-10-13 | Coverage, validation and useful implementation order | Yes (OOPS repo) | Audit/run output likely |
| 1385 | 15 | `docs/worlds/hunter-x-hunter/CAMPAIGN.md` | 9.1 KiB | 2026-10-14–2026-10-14 | Hunter × Hunter campaign proposal | Yes (OOPS repo) | Idea board or mixed source |
| 1386 | 15 | `docs/worlds/mother-of-learning/ZORIAN_S0_S1_SCENE_TABLE_2026-11-03.md` | 79.6 KiB | 2026-10-30–2026-11-03 | Zorian S0 and S1: scene table for G11, G12 and the actor-per-verb check (proposal, 2026-11-03) | Yes (OOPS repo) | Idea board or mixed source |
| 1387 | 15 | `docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md` | 17.4 KiB | 2026-10-02–2026-11-09 | World secrets and discovery | Yes (OOPS repo) | Idea board or mixed source |
| 1388 | 14 | `docs/audits/OWNER_DOCS_AUDIT_2026-10-30.md` | 8.9 KiB | 2026-10-14–2026-11-04 | Owner docs audit: one home per topic, 2026-10-30 | Yes (OOPS repo) | Audit/run output likely |
| 1389 | 14 | `docs/audits/RULES_STATUS_RECONCILIATION_2026-11-14.md` | 10.4 KiB | 2026-10-30–2026-11-14 | Rules status reconciliation, 2026-11-14 | Yes (OOPS repo) | Audit/run output likely |
| 1390 | 14 | `docs/gm/causal-endings/FATE_REDDIT_CLAUDE_HANDOFF_2026-11-10.md` | 13.6 KiB | 2026-11-10–2026-11-10 | Fate, causality and non-lore runs: research handoff for Claude | Yes (OOPS repo) | Audit/run output likely |
| 1391 | 14 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-field-familiarity.md` | 8.5 KiB | 2026-10-14–2026-10-14 | P07 field familiarity, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1392 | 14 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/stepper-perf.md` | 9.2 KiB | 2026-10-14–2026-10-14 | Stepper performance lane, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1393 | 14 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_borrowed-floodwarden.md` | 6.2 KiB | 2026-10-13–2026-10-14 | B10: The Borrowed Floodwarden | Yes (OOPS repo) | Idea board or mixed source |
| 1394 | 14 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_gu-wilds.md` | 5.9 KiB | 2026-10-13–2026-10-14 | B10: The Gu Wilds (original) | Yes (OOPS repo) | Idea board or mixed source |
| 1395 | 14 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_many-door-observatory.md` | 6.2 KiB | 2026-10-13–2026-10-14 | B10: The Many-Door Observatory | Yes (OOPS repo) | Idea board or mixed source |
| 1396 | 14 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/WORLD_orchard-city.md` | 6.4 KiB | 2026-10-13–2026-10-14 | B10: Two Voices in the Orchard City | Yes (OOPS repo) | Idea board or mixed source |
| 1397 | 14 | `docs/gm/dispatch/body-lineage-2026-10-14/b14/REPORT.md` | 18.6 KiB | 2026-10-13–2026-11-04 | B14 report: subtle body play | Yes (OOPS repo) | Audit/run output likely |
| 1398 | 14 | `docs/gm/dispatch/body-lineage-2026-10-14/b17/SRC_marvel-comics.md` | 7.4 KiB | 2026-10-14–2026-10-14 | B17 source: Marvel Comics | Yes (OOPS repo) | Idea board or mixed source |
| 1399 | 14 | `docs/gm/dispatch/body-lineage-2026-10-14/b18/MINIMAL_SET.md` | 9.7 KiB | 2026-10-14–2026-10-14 | B18 minimal set and deferred scope | Yes (OOPS repo) | Idea board or mixed source |
| 1400 | 14 | `docs/gm/dispatch/body-lineage-2026-10-14/b4/PATTERNS.md` | 10.1 KiB | 2026-10-14–2026-11-04 | Canon patterns for body and lineage authoring | Yes (OOPS repo) | Idea board or mixed source |
| 1401 | 14 | `docs/gm/dispatch/cheat-implementation-2026-10-23/K2_CARD_CONTRACT.md` | 21.1 KiB | 2026-10-13–2026-10-23 | K2: cheat card contract, awakening, tolerant read | Yes (OOPS repo) | Idea board or mixed source |
| 1402 | 14 | `docs/gm/dispatch/dependable-local-livelihood-2026-10-12/REPORT.md` | 9.8 KiB | 2026-10-12–2026-10-12 | Dependable Local Livelihood: technical delivery | Yes (OOPS repo) | Audit/run output likely |
| 1403 | 14 | `docs/gm/dispatch/dual-gm-2026-10-11/expansion/audits/native-proof/REPORT.md` | 11.3 KiB | 2026-10-11–2026-10-11 | A5 / P1 installed-slice native audit | Yes (OOPS repo) | Audit/run output likely |
| 1404 | 14 | `docs/gm/dispatch/gen-rules-2026-10-14/g5/MORE.md` | 4.5 KiB | 2026-10-14–2026-10-14 | More generation cheats: GC15+ | Yes (OOPS repo) | Idea board or mixed source |
| 1405 | 14 | `docs/gm/dispatch/harvest-modules-2026-10-14/PLAN.md` | 9.2 KiB | 2026-10-13–2026-10-18 | Harvest modules: carcass processing, part grades and skill feed (2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 1406 | 14 | `docs/gm/dispatch/high-tier-power-2026-10-23/CHECKPOINT.md` | 36.0 KiB | 2026-10-23–2026-10-24 | High-tier power dives, 2026-10-23 | Yes (OOPS repo) | Audit/run output likely |
| 1407 | 14 | `docs/gm/dispatch/hogwarts-legacy-decompile-2026-10-14/INTEGRATION.md` | 7.9 KiB | 2026-10-14–2026-10-14 | LP slices integration, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1408 | 14 | `docs/gm/dispatch/lotm-lives-regions-2026-10-23/CHECKPOINT.md` | 18.0 KiB | 2026-10-14–2026-10-24 | LOTM lives, regions and pathways: checkpoint (worktree lotm-pathways-2e8786), 2026-10-23 | Yes (OOPS repo) | Audit/run output likely |
| 1409 | 14 | `docs/gm/dispatch/modular-seams-2026-10-16/BRIEF.md` | 20.7 KiB | 2026-10-15–2026-10-18 | Modular seams run, 2026-10-16 | Yes (OOPS repo) | Idea board or mixed source |
| 1410 | 14 | `docs/gm/dispatch/overarching-reconciliation-2026-10-23/CHECKPOINT.md` | 19.1 KiB | 2026-10-22–2026-10-25 | Overarching reconciliation dispatch, 2026-10-23 | Yes (OOPS repo) | Audit/run output likely |
| 1411 | 14 | `docs/gm/dispatch/play-surface-2026-11-14/SOL_COMBAT_FEEL_PASS_2026-11-20.md` | 12.7 KiB | 2026-11-14–2026-11-21 | Sol second pass: combat page feel (2026-11-20) | Yes (OOPS repo) | Idea board or mixed source |
| 1412 | 14 | `docs/gm/dispatch/procgen-2026-10-13/cr5/SOURCED_CHECK.md` | 21.9 KiB | 2026-10-13–2026-10-14 | CR5 sourced check: CM, CX and SU10 | Yes (OOPS repo) | Idea board or mixed source |
| 1413 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p10/PROVING_GROUND.md` | 5.1 KiB | 2026-10-13–2026-10-14 | Proving Ground generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1414 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p14/WORLD_FIT.md` | 19.1 KiB | 2026-10-13–2026-10-14 | P14: history and texts that fit each world | Yes (OOPS repo) | Idea board or mixed source |
| 1415 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p21/REPORT.md` | 14.6 KiB | 2026-10-13–2026-10-14 | P21: conflict and economic stories | Yes (OOPS repo) | Audit/run output likely |
| 1416 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p23/STORY_PROGRESSION.md` | 16.7 KiB | 2026-10-10–2026-10-14 | P23 progression through story: S1–S3 extensions | Yes (OOPS repo) | Idea board or mixed source |
| 1417 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p26/GENRES.md` | 10.8 KiB | 2026-10-13–2026-10-14 | X1–X3: genre packs over one thread engine | Yes (OOPS repo) | Idea board or mixed source |
| 1418 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p30/FAMILY.md` | 14.0 KiB | 2026-10-13–2026-10-14 | Family, upbringing and adopted-by premises | Yes (OOPS repo) | Idea board or mixed source |
| 1419 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p30/REPORT.md` | 12.5 KiB | 2026-10-13–2026-10-14 | P30: stories at every power level, body and age | Yes (OOPS repo) | Audit/run output likely |
| 1420 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p32/CONTINUITY_GUARD.md` | 9.7 KiB | 2026-10-13–2026-10-14 | AN1: check a generated event against its actual world | Yes (OOPS repo) | Idea board or mixed source |
| 1421 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p39/REPORT.md` | 8.2 KiB | 2026-10-13–2026-10-14 | P39: roadmap, dependency graph and generator registry | Yes (OOPS repo) | Audit/run output likely |
| 1422 | 14 | `docs/gm/dispatch/procgen-2026-10-13/p7/REPORT.md` | 12.7 KiB | 2026-10-13–2026-10-14 | P7 report: canon-world people and names | Yes (OOPS repo) | Audit/run output likely |
| 1423 | 14 | `docs/gm/dispatch/protagonist-life-2026-10-27/ENGINE_LANES_CHECKPOINT.md` | 6.6 KiB | 2026-10-27–2026-10-27 | Engine lanes checkpoint (PL-E0, PL-B1, PL-E2, PL-E3, PL-E1, PL-H1), 2026-10-27 | Yes (OOPS repo) | Audit/run output likely |
| 1424 | 14 | `docs/gm/dispatch/refinement-audits-2026-10-31/HP_LEAD_RUN_START_2026-11-03.md` | 11.0 KiB | 2026-10-23–2026-11-04 | Harry Potter lead run: start, gaps and abstractions (proposal, 2026-11-03) | Yes (OOPS repo) | Audit/run output likely |
| 1425 | 14 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3T_IMPLEMENTATION_RECEIPT.md` | 11.3 KiB | 2026-10-31–2026-11-03 | KJ3T implementation receipt: the night, Old Neil's lesson, Dunn's signature and the routine week (kjw10) | Yes (OOPS repo) | Audit/run output likely |
| 1426 | 14 | `docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_HP_LORE_AND_ENGINE_REVIEW.md` | 17.4 KiB | 2026-10-31–2026-10-31 | LOTM and HP joint engine/UI review with lore-debate qualification | Yes (OOPS repo) | Audit/run output likely |
| 1427 | 14 | `docs/gm/dispatch/research-tech-2026-10-14/t13/REPORT.md` | 11.1 KiB | 2026-10-14–2026-10-14 | T13 research and technology architecture report | Yes (OOPS repo) | Audit/run output likely |
| 1428 | 14 | `docs/gm/dispatch/research-tech-2026-10-14/t15/worlds/later-candidates.md` | 1.4 KiB | 2026-10-14–2026-10-14 | M68: later named targets and source routing | Yes (OOPS repo) | Idea board or mixed source |
| 1429 | 14 | `docs/gm/dispatch/traveler-asks-2026-10-14/ta3/KINDS.md` | 15.3 KiB | 2026-10-14–2026-10-14 | TA3 ask kinds and settlement | Yes (OOPS repo) | Idea board or mixed source |
| 1430 | 14 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U6_REPORT.md` | 5.1 KiB | 2026-10-14–2026-10-14 | U6 report: lists and records | Yes (OOPS repo) | Audit/run output likely |
| 1431 | 14 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U9_REPORT.md` | 3.8 KiB | 2026-10-14–2026-10-14 | U9 report: micro-interactions and UI feel | Yes (OOPS repo) | Audit/run output likely |
| 1432 | 14 | `docs/gm/dispatch/ui-foundation-2026-10-15/R16_REPORT.md` | 10.8 KiB | 2026-10-15–2026-10-16 | R16: shell default, density pass, idle and combat compositions, 2026-10-16 | Yes (OOPS repo) | Audit/run output likely |
| 1433 | 14 | `docs/gm/dispatch/ui-foundation-2026-10-15/R22C_REPORT.md` | 5.7 KiB | 2026-10-15–2026-10-18 | R22c: fill the center and color the inventory, 2026-10-18 | Yes (OOPS repo) | Audit/run output likely |
| 1434 | 14 | `docs/research/academagia/pass-2026-10-14-systems/REPORT.md` | 13.6 KiB | 2026-10-14–2026-11-04 | Academagia deep systems sweep, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1435 | 14 | `docs/research/ars-nouveau/REPORT.md` | 28.2 KiB | 2026-10-13–2026-10-14 | Ars Nouveau source pass, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1436 | 14 | `docs/research/arx-libertatis/REPORT.md` | 16.7 KiB | 2026-10-14–2026-10-14 | Arx Libertatis source pass, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1437 | 14 | `docs/research/dcss-dda-depth/aspects-2026-10-14/REPORT.md` | 6.7 KiB | 2026-10-14–2026-10-14 | Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: research report, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1438 | 14 | `docs/research/everyday-paths-ui-2026-10-15/UI_EVIDENCE.md` | 9.5 KiB | 2026-10-15–2026-10-15 | UI evidence and coverage | Yes (OOPS repo) | Audit/run output likely |
| 1439 | 14 | `docs/research/free-text-worlds-2026-10-14/TOOLING.md` | 6.3 KiB | 2026-10-14–2026-10-14 | Research tooling and rerun record | Yes (OOPS repo) | Idea board or mixed source |
| 1440 | 14 | `docs/research/groundhog-life/REPORT.md` | 5.9 KiB | 2026-10-09–2026-10-13 | Groundhog Life: source audit (2026-10-13) | Yes (OOPS repo) | Audit/run output likely |
| 1441 | 14 | `docs/research/immortal-life/pass-2026-10-14-systems/REPORT.md` | 15.1 KiB | 2026-10-14–2026-11-04 | Immortal Life: the systems beneath daily life | Yes (OOPS repo) | Audit/run output likely |
| 1442 | 14 | `docs/research/keeperrl/aspects-2026-10-14/ASPECTS.md` | 16.5 KiB | 2026-10-14–2026-10-14 | KeeperRL: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1443 | 14 | `docs/research/kingdom-hearts/WORLD_AND_PORTABILITY.md` | 4.6 KiB | mtime 2026-10-15 (no embedded date) | World definitions and portability | Yes (OOPS repo) | Idea board or mixed source |
| 1444 | 14 | `docs/research/LOCAL_AI_MODEL_CONSIDERATIONS_2026-10-14.md` | 13.3 KiB | 2026-10-13–2026-11-08 | Local AI: newer models, larger models and better 27B variants | Yes (OOPS repo) | Idea board or mixed source |
| 1445 | 14 | `docs/research/nethack/aspects-2026-10-14/ASPECTS.md` | 15.8 KiB | 2026-10-14–2026-10-14 | NetHack: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1446 | 14 | `docs/research/power-systems/wiki-digests/history/pre-addendum-2/CORRECTIONS.md` | 4.7 KiB | mtime 2026-10-10 (no embedded date) | Current corrections and source refinements | Yes (OOPS repo) | Idea board or mixed source |
| 1447 | 14 | `docs/research/procedural-materials-2026-10-13/CROSS_SYSTEMS.md` | 13.8 KiB | 2026-10-13–2026-10-13 | Procedural materials across crafting and everyday systems | Yes (OOPS repo) | Idea board or mixed source |
| 1448 | 14 | `docs/research/PROTOLIKE_AND_CULTIVATION_DISCOVERY_2026-10-22.md` | 11.7 KiB | 2026-10-12–2026-10-30 | Protolike and cultivation project discovery, 2026-10-22 | Yes (OOPS repo) | Idea board or mixed source |
| 1449 | 14 | `docs/research/skill-growth-2026-10-10/UNREAD_AUDIT.md` | 19.5 KiB | 2026-10-10–2026-10-10 | Unread audit: how growth works in Royal Road works Weibao hasn't marked | Yes (OOPS repo) | Audit/run output likely |
| 1450 | 14 | `docs/research/taiwu-ingredient-use-2026-10-15/REPORT.md` | 8.9 KiB | 2026-10-15–2026-10-15 | DQ1: one Taiwu herb, manufacturing and actual code consumers | Yes (OOPS repo) | Audit/run output likely |
| 1451 | 14 | `docs/research/trimps-antimatter/REPORT.md` | 25.3 KiB | 2025-03-12–2026-10-13 | Trimps and Antimatter Dimensions source audit | Yes (OOPS repo) | Audit/run output likely |
| 1452 | 14 | `docs/reviews/PROTO23_DESKTOP_COMPARISON_2026-10-21.md` | 19.6 KiB | 2026-10-21–2026-10-22 | Matched Proto23 desktop comparison and fitting OOPS repairs | Yes (OOPS repo) | Audit/run output likely |
| 1453 | 14 | `docs/systems/COMBAT_PEOPLE_SITES_UI.md` | 18.7 KiB | 2026-10-25–2026-10-25 | Combat, people, sites and UI layout: systems map | Yes (OOPS repo) | Idea board or mixed source |
| 1454 | 14 | `docs/worlds/cheat-directions-2026-10-13/audit/03_BOOK_WORLDS_AU_AND_MULTIVERSE.md` | 20.1 KiB | 2026-10-03–2026-10-13 | Book worlds, AUs and multiverse: independent audit and extensions | Yes (OOPS repo) | Audit/run output likely |
| 1455 | 14 | `docs/worlds/hunter-x-hunter/INTERACTIONS.md` | 6.2 KiB | 2026-10-14–2026-10-14 | Hunter × Hunter interaction proposals | Yes (OOPS repo) | Idea board or mixed source |
| 1456 | 14 | `docs/worlds/LOTM_SEER_SLICE_LAWS_2026-10-19.md` | 8.8 KiB | 2026-10-19–2026-10-22 | LOTM early-Tingen Seer slice: world-law rows (LTS1 to LTS10) | Yes (OOPS repo) | Idea board or mixed source |
| 1457 | 14 | `docs/worlds/one-piece/SOURCE_LEDGER.md` | 8.6 KiB | 2026-08-29–2026-10-15 | One Piece source ledger | Yes (OOPS repo) | Audit/run output likely |
| 1458 | 14 | `docs/worlds/original-frontier/IMPLEMENTATION_PACKET.md` | 11.8 KiB | 2026-10-05–2026-10-20 | Frontier implementation requirements: planning return | Yes (OOPS repo) | Idea board or mixed source |
| 1459 | 14 | `docs/worlds/skyrim/SOURCE_LEDGER.md` | 9.3 KiB | 2026-10-03–2026-10-19 | Skyrim source ledger | Yes (OOPS repo) | Audit/run output likely |
| 1460 | 13 | `docs/audits/EQUIVALENCE_LEDGER_SPIKE_2026-10-23.md` | 19.6 KiB | 2026-10-23–2026-11-04 | Equivalence Ledger spike (2026-10-23) | Yes (OOPS repo) | Audit/run output likely |
| 1461 | 13 | `docs/audits/GU_UNKNOWN_BLOCKERS_SAMPLE_2026-11-24.md` | 6.1 KiB | 2026-11-24–2026-11-24 | Gu -unknown blockers: are they reading gaps? (2026-11-24) | Yes (OOPS repo) | Audit/run output likely |
| 1462 | 13 | `docs/gm/cross-audit-reconciliation-2026-10-15/SEMANTIC_NONHUMAN_ABSTRACTION.md` | 3.4 KiB | 2026-10-15–2026-10-15 | Semantic nonhuman abstraction reconciliation | Yes (OOPS repo) | Audit/run output likely |
| 1463 | 13 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-growth-profile.md` | 8.3 KiB | 2026-10-14–2026-10-14 | P18 world/body growth profile, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1464 | 13 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-salvage.md` | 10.6 KiB | 2026-10-14–2026-10-14 | P08 salvage lane, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1465 | 13 | `docs/gm/dispatch/body-lineage-2026-10-14/b13/DIAGNOSTICIANS.md` | 10.3 KiB | 2026-10-13–2026-10-14 | B13 diagnosticians and the means they hold | Yes (OOPS repo) | Idea board or mixed source |
| 1466 | 13 | `docs/gm/dispatch/body-lineage-2026-10-14/b13/PAIRS.md` | 14.4 KiB | 2026-10-14–2026-10-14 | B13 pairs as investigations | Yes (OOPS repo) | Idea board or mixed source |
| 1467 | 13 | `docs/gm/dispatch/body-lineage-2026-10-14/b18/CODE_MAP.md` | 15.7 KiB | 2026-10-14–2026-11-04 | B18 live code map | Yes (OOPS repo) | Idea board or mixed source |
| 1468 | 13 | `docs/gm/dispatch/body-lineage-2026-10-14/b18/INTERFACES.md` | 26.8 KiB | 2026-10-14–2026-10-14 | B18 interface specifications | Yes (OOPS repo) | Idea board or mixed source |
| 1469 | 13 | `docs/gm/dispatch/companions-2026-10-14/C2_REPORT.md` | 4.5 KiB | 2026-10-14–2026-10-14 | C2 report, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1470 | 13 | `docs/gm/dispatch/features-o1-o5-2026-10-23/A1_PROBE.md` | 9.6 KiB | 2026-10-17–2026-10-23 | A1 gap probe: four contrasting abilities through the ability descriptor | Yes (OOPS repo) | Idea board or mixed source |
| 1471 | 13 | `docs/gm/dispatch/foundation-consumers-2026-11-06/CHECKPOINT.md` | 29.3 KiB | 2026-10-30–2026-11-06 | Foundation consumers wave, 2026-11-06 | Yes (OOPS repo) | Audit/run output likely |
| 1472 | 13 | `docs/gm/dispatch/foundation-g-2026-11-12/GU_GRAMMAR_PROPOSAL.md` | 7.0 KiB | 2026-11-11–2026-11-12 | Gu grammar of parts, proposal for chat P, 2026-11-12 | Yes (OOPS repo) | Idea board or mixed source |
| 1473 | 13 | `docs/gm/dispatch/foundation-g-2026-11-12/GU_QUANTITIES_FOR_W.md` | 5.2 KiB | 2026-11-12–2026-11-12 | What Gu reads and writes in the world substrate, draft for chat W, 2026-11-12 | Yes (OOPS repo) | Idea board or mixed source |
| 1474 | 13 | `docs/gm/dispatch/harvest-modules-2026-10-14/hv1/REPORT.md` | 12.9 KiB | 2026-10-14–2026-10-14 | HV1 wolf-rat processing | Yes (OOPS repo) | Audit/run output likely |
| 1475 | 13 | `docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/L6.md` | 20.8 KiB | 2026-10-24–2026-10-26 | L6: Implement wider mod discoveries and private-realm mechanisms | Yes (OOPS repo) | Idea board or mixed source |
| 1476 | 13 | `docs/gm/dispatch/modular-seams-2026-10-16/history/PRE_JOINT_SCHEDULE_BRIEF.md` | 18.4 KiB | 2026-10-16–2026-10-16 | Modular seams run, 2026-10-16 | Yes (OOPS repo) | Idea board or mixed source |
| 1477 | 13 | `docs/gm/dispatch/modular-seams-2026-10-16/history/PRE_UI_ENGINE_UPDATE_BRIEF.md` | 16.4 KiB | 2026-10-16–2026-10-16 | Modular seams run, 2026-10-16 | Yes (OOPS repo) | Idea board or mixed source |
| 1478 | 13 | `docs/gm/dispatch/overnight-run-2026-11-07/CHECKPOINT.md` | 53.9 KiB | 2026-11-07–2026-11-07 | Overnight foundation run, 2026-11-07 | Yes (OOPS repo) | Audit/run output likely |
| 1479 | 13 | `docs/gm/dispatch/pc-groups-2026-10-26/connected-making/implementation/I4.md` | 44.4 KiB | 2026-10-26–2026-10-26 | I4: Implement useful HP inventions and connected making journey | Yes (OOPS repo) | Idea board or mixed source |
| 1480 | 13 | `docs/gm/dispatch/pc-groups-2026-10-26/process-actions/implementation/agitation/STATUS.md` | 11.3 KiB | 2026-10-26–2026-10-26 | Agitation PC15–PC16 implementation | Yes (OOPS repo) | Audit/run output likely |
| 1481 | 13 | `docs/gm/dispatch/pc-groups-2026-10-26/weather-environment/implementation/W4.md` | 29.1 KiB | 2026-10-26–2026-10-26 | W4: Implement environmental inputs and opportunities | Yes (OOPS repo) | Idea board or mixed source |
| 1482 | 13 | `docs/gm/dispatch/procgen-2026-10-13/cr2/ANIME_WORLDS.md` | 11.4 KiB | 2023-12-12–2026-10-14 | CR2 anime and manga crafting laws | Yes (OOPS repo) | Idea board or mixed source |
| 1483 | 13 | `docs/gm/dispatch/procgen-2026-10-13/gx3/BACKLOG.md` | 2.9 KiB | 2026-10-13–2026-10-14 | GX3 acceptance backlog | Yes (OOPS repo) | Idea board or mixed source |
| 1484 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p10/BLACK_CLOVER.md` | 4.4 KiB | 2026-10-13–2026-10-14 | Black Clover generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1485 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p10/DEMON_SLAYER.md` | 4.7 KiB | 2026-10-13–2026-10-14 | Demon Slayer generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1486 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p10/FRIEREN.md` | 4.7 KiB | 2023-12-12–2026-10-14 | Frieren generation profile | Yes (OOPS repo) | Idea board or mixed source |
| 1487 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p10/SOURCE_NOTES.md` | 9.7 KiB | 2023-11-27–2026-10-14 | P10 source boundaries and reading record | Yes (OOPS repo) | Idea board or mixed source |
| 1488 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p12/BACKLOG.md` | 2.3 KiB | 2026-10-13–2026-10-14 | P12 open gates and retained options | Yes (OOPS repo) | Idea board or mixed source |
| 1489 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p14/CONTRACT.md` | 18.0 KiB | 2026-10-13–2026-10-14 | P14: receipts, retention and storage | Yes (OOPS repo) | Audit/run output likely |
| 1490 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p22/EDITOR.md` | 7.8 KiB | 2026-10-13–2026-10-14 | K4 extensions: desktop card editor with live lint | Yes (OOPS repo) | Idea board or mixed source |
| 1491 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p24/FOREKNOWLEDGE.md` | 9.9 KiB | 2026-10-13–2026-10-14 | O1: foreknowledge that follows actual divergence | Yes (OOPS repo) | Idea board or mixed source |
| 1492 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p25/EXPORTS.md` | 16.6 KiB | 2026-10-13–2026-10-14 | P25: hero wiki, light novel and chosen past-save legends | Yes (OOPS repo) | Idea board or mixed source |
| 1493 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p30/ANIMALS.md` | 11.2 KiB | 2026-10-13–2026-10-14 | Animals with personalities and small lives | Yes (OOPS repo) | Idea board or mixed source |
| 1494 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p31/SECRETS_AS_CURRENCY.md` | 12.8 KiB | 2026-10-13–2026-10-14 | AK1 and AK2: information has holders, evidence and audiences | Yes (OOPS repo) | Idea board or mixed source |
| 1495 | 13 | `docs/gm/dispatch/procgen-2026-10-13/p33/DEFEAT_ARCS.md` | 10.2 KiB | 2026-10-13–2026-10-19 | PS-AU1: loss opens fitting recovery stories | Yes (OOPS repo) | Idea board or mixed source |
| 1496 | 13 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/AD2_CHECKPOINT.md` | 11.9 KiB | 2026-10-27–2026-10-29 | AD2: source-shaped adapter relaxations | Yes (OOPS repo) | Audit/run output likely |
| 1497 | 13 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF_BODY_CHECKPOINT.md` | 16.9 KiB | 2026-10-27–2026-10-29 | BD1: body, sleep and meal bridge | Yes (OOPS repo) | Audit/run output likely |
| 1498 | 13 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF_MAKING_CHECKPOINT.md` | 10.5 KiB | 2026-10-27–2026-10-27 | MK1 / MF1 L3: making bridge | Yes (OOPS repo) | Audit/run output likely |
| 1499 | 13 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P7_CHECKPOINT.md` | 16.9 KiB | 2026-10-27–2026-10-27 | P7 checkpoint: all-actor read cost | Yes (OOPS repo) | Audit/run output likely |
| 1500 | 13 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3S_IMPLEMENTATION_RECEIPT.md` | 10.6 KiB | 2026-10-31–2026-11-03 | KJ3S implementation receipt: Mr. Glacis, Leonard, the armory and the evening (kjw9) | Yes (OOPS repo) | Audit/run output likely |
| 1501 | 13 | `docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_POPULATED_UI_JOURNEY_RECEIPT.md` | 67.0 KiB | 2026-10-31–2026-11-04 | LOTM populated journey UI refinement | Yes (OOPS repo) | Audit/run output likely |
| 1502 | 13 | `docs/gm/dispatch/sonnet-wave-2026-10-30/ideas/sw-road.md` | 7.2 KiB | 2026-10-30–2026-11-04 | Idea intake: sw-road | Yes (OOPS repo) | Idea board or mixed source |
| 1503 | 13 | `docs/gm/dispatch/ui-at-scale-2026-10-14/runs/SESSIONS.md` | 2.0 KiB | 2026-10-14–2026-10-14 | Codex sessions (launched 2026-10-14 00:53 local) | Yes (OOPS repo) | Idea board or mixed source |
| 1504 | 13 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/r21-idle-ui-research.md` | 15.5 KiB | 2026-10-15–2026-10-17 | Idle-game UI layout research for the R21 parity shell (2026-10-17) | Yes (OOPS repo) | Idea board or mixed source |
| 1505 | 13 | `docs/gm/dispatch/wave11-closure-2026-11-06/CHECKPOINT.md` | 9.0 KiB | 2026-11-06–2026-11-06 | Wave 11 closure | Yes (OOPS repo) | Audit/run output likely |
| 1506 | 13 | `docs/gm/dispatch/world-core-kit-2026-10-14/W10_REPORT.md` | 6.1 KiB | 2026-10-14–2026-10-14 | W10 report: micro references | Yes (OOPS repo) | Audit/run output likely |
| 1507 | 13 | `docs/research/cultivation-idlers/aspects-2026-10-14/ASPECTS.md` | 16.6 KiB | 2026-10-14–2026-10-14 | cultivation-idlers: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1508 | 13 | `docs/research/heavens-vault/repass-2026-10-14/REPORT.md` | 9.9 KiB | 2026-10-14–2026-10-14 | P1 Heaven's Vault translation-sensitive exchange | Yes (OOPS repo) | Audit/run output likely |
| 1509 | 13 | `docs/research/hogwarts-legacy/LP1_REPORT.md` | 8.0 KiB | 2026-10-14–2026-10-14 | LP1 lever-setting lesson | Yes (OOPS repo) | Audit/run output likely |
| 1510 | 13 | `docs/research/hogwarts-legacy/LP2_REPORT.md` | 9.5 KiB | 2026-10-14–2026-10-14 | LP2 assignment record proposal | Yes (OOPS repo) | Audit/run output likely |
| 1511 | 13 | `docs/research/legends-of-idleon/WORLD_SYSTEMS_DIGEST.md` | 5.2 KiB | mtime 2026-10-14 (no embedded date) | World systems digest | Yes (OOPS repo) | Idea board or mixed source |
| 1512 | 13 | `docs/research/local-ai-2026-10-14/gemma-world-comparison/REPORT.md` | 13.4 KiB | 2026-10-13–2026-10-14 | Three-model comparison: toward a playable Harry Potter world | Yes (OOPS repo) | Audit/run output likely |
| 1513 | 13 | `docs/research/multi-realm-muds/CHECKPOINT.md` | 4.6 KiB | 2026-10-14–2026-10-14 | mw-muds checkpoint, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1514 | 13 | `docs/research/power-systems/wiki-digests/DIGEST_jujutsu-kaisen.md` | 18.2 KiB | 2026-10-10–2026-10-10 | Jujutsu Kaisen wiki digest | Yes (OOPS repo) | Idea board or mixed source |
| 1515 | 13 | `docs/research/power-systems/wiki-digests/full-dumps/workers/fate-full/r2-2026-10-13/shard-b/SUMMARY.md` | 4.9 KiB | 2026-10-13–2026-10-14 | Fate reader shard B: completed range | Yes (OOPS repo) | Idea board or mixed source |
| 1516 | 13 | `docs/research/project-zomboid/CHECKPOINT.md` | 4.1 KiB | mtime 2026-10-15 (no embedded date) | fs-zomboid checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1517 | 13 | `docs/research/qud-systems-audit-2026-10-15/TITLES_NAMES_AND_REPUTATION.md` | 8.8 KiB | 2026-10-15–2026-10-15 | S2 Titles, names, achievements and faction status | Yes (OOPS repo) | Audit/run output likely |
| 1518 | 13 | `docs/research/remnant-2/SOURCE_LEDGER.md` | 3.2 KiB | 2026-10-15–2026-10-15 | Source ledger | Yes (OOPS repo) | Audit/run output likely |
| 1519 | 13 | `docs/research/siralim-ultimate/CHECKPOINT.md` | 6.8 KiB | 2026-10-14–2026-11-04 | mw-siralim checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1520 | 13 | `docs/research/tabletop-library-2026-10-14/DESIGN_CONSIDERATIONS.md` | 9.1 KiB | 2026-10-14–2026-10-14 | Tabletop systems as multiverse research | Yes (OOPS repo) | Idea board or mixed source |
| 1521 | 13 | `docs/research/vagrus/pass-2026-10-14/REPORT.md` | 9.2 KiB | 2026-10-10–2026-10-14 | Vagrus deeper pass, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1522 | 13 | `docs/research/warsim/aspects-2026-10-14/ASPECTS.md` | 23.4 KiB | 2026-10-14–2026-10-14 | Warsim aspect pass | Yes (OOPS repo) | Idea board or mixed source |
| 1523 | 13 | `docs/reviews/DEDUP_AUDIT_2026-10-18/FOLLOWUP_CHECKPOINT.md` | 7.0 KiB | 2026-10-16–2026-11-04 | Dedup audit follow-up checkpoint (2026-10-19) | Yes (OOPS repo) | Audit/run output likely |
| 1524 | 13 | `docs/reviews/LOCAL_AI_WORK_AUDIT_2026-10-25.md` | 22.5 KiB | 2026-10-18–2026-11-04 | Local AI task-routing audit, 2026-10-25 | Yes (OOPS repo) | Audit/run output likely |
| 1525 | 13 | `docs/tools/STEP_SPEED_UI_AND_READERS_2026-11-18.md` | 16.3 KiB | 2026-11-06–2026-11-18 | Faster steps, clearer play, and the next reader pass | Yes (OOPS repo) | Idea board or mixed source |
| 1526 | 13 | `docs/worlds/deeper-interactions-audit-2026-10-13/01_EFFECT_KINDS_AND_ACTIONS.md` | 17.2 KiB | 2026-10-13–2026-10-13 | EK: Effect kinds, levels and actions | Yes (OOPS repo) | Audit/run output likely |
| 1527 | 13 | `docs/worlds/deeper-interactions-audit-2026-10-13/02_AWARENESS_EVIDENCE_AND_DISCOVERY.md` | 14.3 KiB | 2026-10-13–2026-10-13 | Awareness, evidence and discovery of influence | Yes (OOPS repo) | Audit/run output likely |
| 1528 | 13 | `docs/worlds/fallout/SOURCE_LEDGER.md` | 9.2 KiB | 2026-10-03–2026-10-03 | Fallout 4 source ledger | Yes (OOPS repo) | Audit/run output likely |
| 1529 | 12 | `docs/audits/materials_tags_2026-10-19/MQ_A_TAG_INVENTORY.md` | 20.9 KiB | 2026-10-19–2026-11-04 | MQ-A: live tags and axes against the Round 6 proposals | Yes (OOPS repo) | Audit/run output likely |
| 1530 | 12 | `docs/audits/RECURRING_PEOPLE_AT17_PROPOSAL_2026-11-07.md` | 16.7 KiB | 2026-11-07–2026-11-07 | Recurring people (AT17): wake a role at first durable reference | Yes (OOPS repo) | Audit/run output likely |
| 1531 | 12 | `docs/audits/RULES_CODE_ALIGNMENT_2026-11-14.md` | 7.5 KiB | 2026-11-14–2026-11-14 | Rules code alignment, 2026-11-14 | Yes (OOPS repo) | Audit/run output likely |
| 1532 | 12 | `docs/CHEATS_BY_WORLD.md` | 47.0 KiB | 2026-10-08–2026-10-10 | More cheats, world by world (2026-10-10) | Yes (OOPS repo) | Idea board or mixed source |
| 1533 | 12 | `docs/gm/dispatch/body-lineage-2026-10-14/b14/CONSEQUENCES.md` | 12.1 KiB | 2026-10-11–2026-10-14 | B14 systemic consequences: G68 | Yes (OOPS repo) | Idea board or mixed source |
| 1534 | 12 | `docs/gm/dispatch/body-lineage-2026-10-14/b16/DEPENDENCIES.md` | 9.2 KiB | 2026-10-14–2026-10-14 | B16 proposed dependencies | Yes (OOPS repo) | Idea board or mixed source |
| 1535 | 12 | `docs/gm/dispatch/body-lineage-2026-10-14/b7/BUDGET.md` | 9.6 KiB | 2026-10-14–2026-10-14 | G48-B7.B: save budget at 100, 1,000 and 10,000 NPCs | Yes (OOPS repo) | Idea board or mixed source |
| 1536 | 12 | `docs/gm/dispatch/calm-vivid-2026-10-14/REPORT.md` | 6.7 KiB | 2026-10-14–2026-10-14 | Calmer Vivid and progressive UI disclosure | Yes (OOPS repo) | Audit/run output likely |
| 1537 | 12 | `docs/gm/dispatch/carry-out-queue-2026-10-26/README.md` | 14.4 KiB | 2026-10-26–2026-11-04 | Carry-out queue wave, 2026-10-26 | Yes (OOPS repo) | Idea board or mixed source |
| 1538 | 12 | `docs/gm/dispatch/cheat-status-window-2026-10-13/CH1_REPORT.md` | 6.9 KiB | 2026-10-13–2026-10-13 | CH1 optional start and status window, 2026-10-13 | Yes (OOPS repo) | Audit/run output likely |
| 1539 | 12 | `docs/gm/dispatch/codex-parallel-2026-10-25/runs/g1-gm.last.md` | 1.2 KiB | 2026-10-25–2026-10-25 | g1-gm.last.md | Yes (OOPS repo) | Idea board or mixed source |
| 1540 | 12 | `docs/gm/dispatch/complementary-journeys-2026-10-23/CHECKPOINT.md` | 21.6 KiB | 2026-10-23–2026-11-04 | Complementary playable journeys, 2026-10-23 | Yes (OOPS repo) | Audit/run output likely |
| 1541 | 12 | `docs/gm/dispatch/features-o1-o5-2026-10-23/RESULT.md` | 42.9 KiB | 2026-10-23–2026-10-24 | O/F/A integration result, 2026-10-23 | Yes (OOPS repo) | Audit/run output likely |
| 1542 | 12 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r6/PROMPT_RECONCILED.md` | 19.5 KiB | 2026-10-13–2026-10-13 | R6 FA11 existing two-receiver retort | Yes (OOPS repo) | Idea board or mixed source |
| 1543 | 12 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r9/BACKLOG.md` | 3.6 KiB | 2026-10-13–2026-10-13 | FA14 criterion ledger and open native gates | Yes (OOPS repo) | Audit/run output likely |
| 1544 | 12 | `docs/gm/dispatch/foundation-run-2026-11-12/W17_DESIGN_RECORD.md` | 6.8 KiB | 2026-11-12–2026-11-12 | Wave 17, lane E3: the design record (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 1545 | 12 | `docs/gm/dispatch/foundation-run-2026-11-12/W18_ENGINE_HOST.md` | 8.7 KiB | 2026-11-12–2026-11-12 | Wave 18, lane E9: one engine host | Yes (OOPS repo) | Idea board or mixed source |
| 1546 | 12 | `docs/gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md` | 3.4 KiB | 2026-10-14–2026-10-14 | Aspect pass standard, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1547 | 12 | `docs/gm/dispatch/minecraft-fit-2026-10-21/CHECKPOINT.md` | 17.2 KiB | 2026-10-21–2026-10-22 | Minecraft mechanisms in the native field workshop, 2026-10-21 | Yes (OOPS repo) | Audit/run output likely |
| 1548 | 12 | `docs/gm/dispatch/minigames-2026-10-11/IDEAS_AT_DISPATCH.md` | 9.3 KiB | 2026-10-11–2026-10-11 | Investing, property management and more side activities | Yes (OOPS repo) | Idea board or mixed source |
| 1549 | 12 | `docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L3.md` | 35.1 KiB | 2026-10-26–2026-10-26 | L3: Historical traces, institutions and joined lore journey | Yes (OOPS repo) | Idea board or mixed source |
| 1550 | 12 | `docs/gm/dispatch/procgen-2026-10-13/cr5/CHEATS_FOR_MAKING.md` | 13.2 KiB | 2026-10-13–2026-10-19 | CR5 cheats for making: CX extensions | Yes (OOPS repo) | Idea board or mixed source |
| 1551 | 12 | `docs/gm/dispatch/procgen-2026-10-13/gx2/REPORT.md` | 17.9 KiB | 2026-10-13–2026-11-04 | GX2 generation-lens report | Yes (OOPS repo) | Audit/run output likely |
| 1552 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p1/REPORT.md` | 10.2 KiB | 2026-10-13–2026-10-14 | P1: seeded core loop | Yes (OOPS repo) | Audit/run output likely |
| 1553 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p13/OCCULT_AND_TRIAL_WORLDS.md` | 10.6 KiB | 2026-10-11–2026-10-14 | Occult and trial worlds: LOTM, CoI and Shadow Slave | Yes (OOPS repo) | Idea board or mixed source |
| 1554 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p15/LLM_OPTIONS.md` | 12.4 KiB | 2026-10-13–2026-10-14 | P15 optional language-model text | Yes (OOPS repo) | Idea board or mixed source |
| 1555 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p18/HYGIENE.md` | 15.2 KiB | 2026-10-13–2026-10-14 | F2-F5: generator hygiene | Yes (OOPS repo) | Idea board or mixed source |
| 1556 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p20/PLACE_MEMORY.md` | 8.3 KiB | 2026-10-13–2026-10-14 | H1 extended: places retain causes, people retain accounts | Yes (OOPS repo) | Idea board or mixed source |
| 1557 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p20/SETTLEMENTS.md` | 8.6 KiB | 2026-10-13–2026-10-14 | H2 extended: settlements change through lived events | Yes (OOPS repo) | Idea board or mixed source |
| 1558 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p27/DEATH_AND_AFTER.md` | 18.4 KiB | 2023-11-27–2026-10-14 | AC1-AC3 extensions: death, remembrance and world-specific continuations | Yes (OOPS repo) | Idea board or mixed source |
| 1559 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p31/FAITH.md` | 12.1 KiB | 2026-10-11–2026-10-14 | AL1 and AL2: faith as practice, attention and institutions | Yes (OOPS repo) | Idea board or mixed source |
| 1560 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p31/PROMISES.md` | 11.8 KiB | 2026-10-13–2026-10-14 | AJ1 and AJ3: reciprocal promises and social credit | Yes (OOPS repo) | Idea board or mixed source |
| 1561 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p35/CHALLENGES.md` | 10.3 KiB | 2026-10-13–2026-10-14 | AY1 extended: optional challenges from recorded play | Yes (OOPS repo) | Idea board or mixed source |
| 1562 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p35/SOUND.md` | 9.7 KiB | 2026-10-13–2026-10-14 | AX1 extended: sound follows known, settled stories | Yes (OOPS repo) | Idea board or mixed source |
| 1563 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p38/MIGRATION.md` | 11.8 KiB | 2026-10-13–2026-10-14 | Migration from P34 S-2 and live stores | Yes (OOPS repo) | Idea board or mixed source |
| 1564 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p38/SOURCE_AUDIT.md` | 11.4 KiB | 2026-10-13–2026-10-14 | P38 read-just source audit | Yes (OOPS repo) | Audit/run output likely |
| 1565 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p5/D3_TALENT_ROLL.md` | 11.0 KiB | 2026-10-10–2026-10-13 | D3: earned talent roll | Yes (OOPS repo) | Idea board or mixed source |
| 1566 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p5/D6_SECRET_ROLL.md` | 9.3 KiB | 2026-10-13–2026-10-13 | D6: one original-world secret roll | Yes (OOPS repo) | Idea board or mixed source |
| 1567 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p5/D7_HOUSEHOLDS.md` | 11.0 KiB | 2026-10-13–2026-10-13 | D7: generated households and chosen starts | Yes (OOPS repo) | Idea board or mixed source |
| 1568 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p5/D8_LORE_GRAMMAR.md` | 9.9 KiB | 2026-10-13–2026-10-13 | D8: remembered local history and generated lore | Yes (OOPS repo) | Idea board or mixed source |
| 1569 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p5/D9_STORYTELLER.md` | 9.5 KiB | 2026-10-13–2026-10-13 | D9: bounded storyteller pacing over P3 | Yes (OOPS repo) | Idea board or mixed source |
| 1570 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p5/O3_APPEARANCE_SHUFFLE.md` | 10.0 KiB | 2026-10-13–2026-10-13 | O3: per-save unidentified product appearances | Yes (OOPS repo) | Idea board or mixed source |
| 1571 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p5/REPORT.md` | 12.3 KiB | 2026-10-13–2026-10-13 | P5 audit and proposed wave 2 | Yes (OOPS repo) | Audit/run output likely |
| 1572 | 12 | `docs/gm/dispatch/procgen-2026-10-13/p7/TTKS.md` | 15.5 KiB | 2026-10-10–2026-10-13 | TTKS: five independent book-world people packs | Yes (OOPS repo) | Idea board or mixed source |
| 1573 | 12 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/L1_CHECKPOINT.md` | 12.5 KiB | 2026-10-27–2026-10-28 | L1 checkpoint, continued 2026-10-28 | Yes (OOPS repo) | Audit/run output likely |
| 1574 | 12 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/L4B_CHECKPOINT.md` | 15.3 KiB | 2026-10-27–2026-10-28 | L4b checkpoint, 2026-10-28 | Yes (OOPS repo) | Audit/run output likely |
| 1575 | 12 | `docs/gm/dispatch/reference-engine-boundaries-2026-10-20/FF3_STATUS.md` | 15.6 KiB | 2026-10-20–2026-10-20 | FF3 finite hearth firewood supply | Yes (OOPS repo) | Audit/run output likely |
| 1576 | 12 | `docs/gm/dispatch/refinement-audits-2026-10-31/CLAUDE_UI_FEEDBACK_INDEX.md` | 8.5 KiB | 2026-10-15–2026-10-31 | Weibao's Claude UI feedback: evidence index | Yes (OOPS repo) | Audit/run output likely |
| 1577 | 12 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3V_IMPLEMENTATION_RECEIPT.md` | 10.3 KiB | 2026-10-31–2026-11-03 | KJ3V implementation receipt: the rescue, the night and the dawn visit to the apartment (kjw12) | Yes (OOPS repo) | Audit/run output likely |
| 1578 | 12 | `docs/gm/dispatch/research-tech-2026-10-14/t1/RISKS.md` | 8.4 KiB | 2026-10-11–2026-10-14 | T1 ownership and save risks | Yes (OOPS repo) | Idea board or mixed source |
| 1579 | 12 | `docs/gm/dispatch/research-tech-2026-10-14/t13/OWNERS.md` | 13.6 KiB | 2026-10-14–2026-10-14 | T13 implementation owners | Yes (OOPS repo) | Idea board or mixed source |
| 1580 | 12 | `docs/gm/dispatch/research-tech-2026-10-14/t9/GOLDEN.md` | 9.3 KiB | 2026-10-13–2026-10-14 | Z3: hand-checked frozen roadmaps | Yes (OOPS repo) | Idea board or mixed source |
| 1581 | 12 | `docs/gm/dispatch/ui-at-scale-2026-10-14/U1_REPORT.md` | 5.8 KiB | 2026-10-14–2026-10-14 | U1 report: game references for UI at scale | Yes (OOPS repo) | Audit/run output likely |
| 1582 | 12 | `docs/gm/dispatch/ui-foundation-2026-10-15/R21_REPORT.md` | 9.0 KiB | 2026-10-15–2026-10-17 | R21: shell layout editing, one bar, control box, 2026-10-17 | Yes (OOPS repo) | Audit/run output likely |
| 1583 | 12 | `docs/gm/dispatch/ui-foundation-2026-10-15/R8_REPORT.md` | 8.2 KiB | 2026-10-15–2026-10-15 | R8 panel refinement and parallel sourcing | Yes (OOPS repo) | Audit/run output likely |
| 1584 | 12 | `docs/gm/dispatch/ui-modularity-2026-10-11/browser/REVIEW.md` | 5.2 KiB | 2026-10-11–2026-10-11 | Independent UI qualification | Yes (OOPS repo) | Audit/run output likely |
| 1585 | 12 | `docs/research/academagia/aspects-2026-10-14/ASPECTS.md` | 19.0 KiB | 2026-10-14–2026-10-14 | Academagia aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1586 | 12 | `docs/research/amazing-cultivation-simulator/aspects-2026-10-14/REPORT.md` | 3.9 KiB | 2026-10-14–2026-10-14 | Amazing Cultivation Simulator aspect backfill | Yes (OOPS repo) | Audit/run output likely |
| 1587 | 12 | `docs/research/bitburner/aspects-2026-10-14/ASPECTS.md` | 12.3 KiB | 2026-10-14–2026-10-14 | bitburner: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1588 | 12 | `docs/research/cividle/aspects-2026-10-14/ASPECTS.md` | 11.9 KiB | 2026-10-14–2026-10-14 | cividle: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1589 | 12 | `docs/research/cultivation-idlers/path-of-the-idle-cultivator/aspects-2026-10-14/ASPECTS.md` | 9.3 KiB | 2026-10-14–2026-10-14 | Path of the Idle Cultivator: A01 to A12 | Yes (OOPS repo) | Idea board or mixed source |
| 1590 | 12 | `docs/research/discworld-mud/aspects-2026-10-14/ASPECTS.md` | 14.4 KiB | 2026-10-14–2026-10-14 | Discworld MUD aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1591 | 12 | `docs/research/everyday-paths-ui-2026-10-15/FARMING_DELEGATION_DEEP_DIVE.md` | 13.7 KiB | 2026-10-15–2026-10-15 | Farming, delegation and chosen involvement | Yes (OOPS repo) | Idea board or mixed source |
| 1592 | 12 | `docs/research/everyday-paths-ui-2026-10-15/PATH_PROPOSALS.md` | 17.0 KiB | 2026-10-15–2026-10-15 | Fishing and farming: methods, discoveries and chosen involvement | Yes (OOPS repo) | Idea board or mixed source |
| 1593 | 12 | `docs/research/free-text-worlds-2026-10-14/aspects-2026-10-14/ASPECTS.md` | 24.4 KiB | 2026-10-14–2026-10-14 | Free text worlds: five source families aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1594 | 12 | `docs/research/groundhog-life/aspects-2026-10-14/ASPECTS.md` | 8.2 KiB | 2026-10-14–2026-10-14 | Groundhog Life: A01 to A12 | Yes (OOPS repo) | Idea board or mixed source |
| 1595 | 12 | `docs/research/hearts-of-iron-iv/aspects-2026-10-14/ASPECTS.md` | 17.2 KiB | 2026-10-14–2026-10-14 | Hearts of Iron IV: twelve aspects | Yes (OOPS repo) | Idea board or mixed source |
| 1596 | 12 | `docs/research/heavens-vault/aspects-2026-10-14/ASPECTS.md` | 11.0 KiB | 2026-10-14–2026-10-14 | heavens-vault: aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1597 | 12 | `docs/research/hogwarts-legacy/LP8_REPORT.md` | 8.2 KiB | 2026-10-14–2026-10-14 | LP8 earned drying tracker | Yes (OOPS repo) | Audit/run output likely |
| 1598 | 12 | `docs/research/hyperrogue/aspects-2026-10-14/ASPECTS.md` | 8.4 KiB | 2026-10-14–2026-10-14 | Aspect pass A01-A12 | Yes (OOPS repo) | Idea board or mixed source |
| 1599 | 12 | `docs/research/hyperrogue/REPORT.md` | 9.4 KiB | 2026-10-14–2026-10-14 | HyperRogue: places change the rules of play | Yes (OOPS repo) | Audit/run output likely |
| 1600 | 12 | `docs/research/idle-reincarnator/aspects-2026-10-14/ASPECTS.md` | 12.5 KiB | 2026-10-14–2026-10-14 | idle-reincarnator: aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1601 | 12 | `docs/research/idle-reincarnator/CHECKPOINT.md` | 4.5 KiB | 2026-10-14–2026-10-14 | Idle Reincarnator checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1602 | 12 | `docs/research/immortal-life/aspects-2026-10-14/ASPECTS.md` | 17.6 KiB | 2026-10-14–2026-10-14 | Immortal Life aspect pass | Yes (OOPS repo) | Idea board or mixed source |
| 1603 | 12 | `docs/research/immortality-idle/aspects-2026-10-14/ASPECTS.md` | 8.5 KiB | 2026-10-14–2026-10-14 | Immortality Idle: A01 to A12 | Yes (OOPS repo) | Idea board or mixed source |
| 1604 | 12 | `docs/research/immortality-idle/pass-2026-10-14/ACTIVITIES.md` | 5.4 KiB | 2026-10-14–2026-10-14 | Activity definition read | Yes (OOPS repo) | Idea board or mixed source |
| 1605 | 12 | `docs/research/immortality-idle/pass-2026-10-14/COMBAT_AND_TECHNIQUES.md` | 4.5 KiB | 2026-10-14–2026-10-14 | Combat and technique digest | Yes (OOPS repo) | Idea board or mixed source |
| 1606 | 12 | `docs/research/kingdom-hearts/aspects-2026-10-14/ASPECTS.md` | 7.5 KiB | 2026-10-14–2026-10-14 | Aspect pass, Kingdom Hearts | Yes (OOPS repo) | Idea board or mixed source |
| 1607 | 12 | `docs/research/kingdom-of-loathing/aspects-2026-10-14/ASPECTS.md` | 16.9 KiB | 2026-10-14–2026-10-14 | Kingdom of Loathing through KoLmafia aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1608 | 12 | `docs/research/kittens-game/aspects-2026-10-14/ASPECTS.md` | 7.8 KiB | 2026-10-14–2026-10-14 | Kittens Game aspects, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1609 | 12 | `docs/research/legends-of-idleon/aspects-2026-10-14/ASPECTS.md` | 10.1 KiB | 2026-10-14–2026-10-14 | legends-of-idleon: aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1610 | 12 | `docs/research/local-ai-2026-10-14/round2/SPEED_AND_DOWNLOADS.md` | 8.4 KiB | 2026-10-14–2026-10-14 | Download status and Apple Silicon speed follow-up | Yes (OOPS repo) | Audit/run output likely |
| 1611 | 12 | `docs/research/magical-diary-wolf-hall/aspects-2026-10-14/ASPECTS.md` | 7.3 KiB | 2026-10-14–2026-10-14 | Wolf Hall aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1612 | 12 | `docs/research/melvor-idle/aspects-2026-10-14/ASPECTS.md` | 12.1 KiB | 2026-10-14–2026-10-14 | melvor-idle: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1613 | 12 | `docs/research/minecraft/tfc-chains-2026-10-14/aspects-2026-10-14/ASPECTS.md` | 3.6 KiB | 2026-10-14–2026-10-14 | Aspect pass: PARTIAL | Yes (OOPS repo) | Idea board or mixed source |
| 1614 | 12 | `docs/research/modding-tree/aspects-2026-10-14/ASPECTS.md` | 15.7 KiB | 2026-10-14–2026-10-14 | The Modding Tree family aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1615 | 12 | `docs/research/multi-realm-muds/aspects-2026-10-14/ASPECTS.md` | 11.1 KiB | 2026-10-14–2026-10-14 | Aspect pass: grouped RetroMUD and 3 Kingdoms | Yes (OOPS repo) | Idea board or mixed source |
| 1616 | 12 | `docs/research/multi-realm-muds/TOOLING.md` | 4.9 KiB | 2014-06-24–2026-10-14 | Tooling and reproducible route | Yes (OOPS repo) | Idea board or mixed source |
| 1617 | 12 | `docs/research/multiverse-idle/aspects-2026-10-14/ASPECTS.md` | 11.7 KiB | 2026-10-14–2026-10-14 | Aspect pass | Yes (OOPS repo) | Idea board or mixed source |
| 1618 | 12 | `docs/research/multiworld-synthesis-2026-10-14/aspects-2026-10-14/ASPECTS.md` | 11.6 KiB | 2026-10-14–2026-10-14 | Multi-world aspect rollup | Yes (OOPS repo) | Idea board or mixed source |
| 1619 | 12 | `docs/research/naev/aspects-2026-10-14/ASPECTS.md` | 22.2 KiB | 2026-10-14–2026-10-14 | Naev aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1620 | 12 | `docs/research/naev/aspects-2026-10-14/CHECKPOINT.md` | 5.0 KiB | 2026-10-14–2026-10-14 | Naev lane checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1621 | 12 | `docs/research/naev/CHECKPOINT.md` | 5.0 KiB | 2026-10-14–2026-10-14 | Naev lane checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1622 | 12 | `docs/research/ngu-idle/aspects-2026-10-14/ASPECTS.md` | 11.3 KiB | 2026-10-14–2026-10-14 | ngu-idle: aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1623 | 12 | `docs/research/open-idle-games-2026-10-09/aspects-2026-10-14/ASPECTS.md` | 12.9 KiB | 2026-10-09–2026-10-14 | open-idle-games-2026-10-09: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1624 | 12 | `docs/research/potionomics/aspects-2026-10-14/ASPECTS.md` | 7.8 KiB | 2026-10-14–2026-10-14 | Aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1625 | 12 | `docs/research/procedural-materials-2026-10-13/deep/GENERATION_CONTRACTS.md` | 18.1 KiB | 2026-10-13–2026-10-13 | Generation contracts and material ontology | Yes (OOPS repo) | Idea board or mixed source |
| 1626 | 12 | `docs/research/project-zomboid/aspects-2026-10-14/ASPECTS.md` | 8.0 KiB | 2026-10-14–2026-10-14 | Aspect pass, Project Zomboid 42.21 | Yes (OOPS repo) | Idea board or mixed source |
| 1627 | 12 | `docs/research/project-zomboid/BODY_AND_ACTIONS.md` | 4.3 KiB | mtime 2026-10-15 (no embedded date) | Body fields and timed-action feedback | Yes (OOPS repo) | Idea board or mixed source |
| 1628 | 12 | `docs/research/proto23/readers-2026-10-10/R5_map_dialogue_time_save.md` | 43.5 KiB | 2026-10-10–2026-10-10 | R5: Proto23 map, dialogue, weather, time, save and tick vs YAIRPG | Yes (OOPS repo) | Idea board or mixed source |
| 1629 | 12 | `docs/research/remnant-2/aspects-2026-10-14/ASPECTS.md` | 7.7 KiB | 2026-10-14–2026-10-15 | Aspect pass, 2026-10-14 dispatch | Yes (OOPS repo) | Idea board or mixed source |
| 1630 | 12 | `docs/research/rimworld/feature-pass-2026-10-14/aspects-2026-10-14/ASPECTS.md` | 7.9 KiB | 2026-10-14–2026-10-14 | Scoped aspect pass | Yes (OOPS repo) | Idea board or mixed source |
| 1631 | 12 | `docs/research/rimworld/pass-2026-10-14-deep/aspects-2026-10-14/ASPECTS.md` | 6.6 KiB | 2026-10-14–2026-10-14 | RimWorld deep aspects, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1632 | 12 | `docs/research/rimworld/pass-2026-10-14-deep/CHECKPOINT.md` | 5.5 KiB | 2026-10-14–2026-10-14 | lib-rimworld-deep checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1633 | 12 | `docs/research/rimworld/pass-2026-10-14-systems/REPORT.md` | 12.3 KiB | 2026-10-14–2026-11-04 | RimWorld systems sweep, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1634 | 12 | `docs/research/rune-factory-5/aspects-2026-10-14/ASPECTS.md` | 7.3 KiB | 2026-10-14–2026-10-14 | Rune Factory 5 aspects, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1635 | 12 | `docs/research/scroll-of-taiwu/aspects-2026-10-14/ASPECTS.md` | 20.8 KiB | 2026-10-14–2026-10-14 | Taiwu aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1636 | 12 | `docs/research/scroll-of-taiwu/REPORT.md` | 10.6 KiB | 2026-10-14–2026-10-14 | The Scroll of Taiwu research, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1637 | 12 | `docs/research/siralim-ultimate/aspects-2026-10-14/ASPECTS.md` | 8.6 KiB | 2026-10-14–2026-10-14 | Aspect pass: Siralim Ultimate | Yes (OOPS repo) | Idea board or mixed source |
| 1638 | 12 | `docs/research/siralim-ultimate/REPORT.md` | 6.5 KiB | 2026-10-14–2026-10-14 | Siralim Ultimate: a lasting build across changing expeditions | Yes (OOPS repo) | Audit/run output likely |
| 1639 | 12 | `docs/research/stardew-valley/aspects-2026-10-14/ASPECTS.md` | 8.9 KiB | 2026-10-14–2026-10-14 | Stardew Valley aspect pass | Yes (OOPS repo) | Idea board or mixed source |
| 1640 | 12 | `docs/research/tale-of-immortal/aspects-2026-10-14/ASPECTS.md` | 8.4 KiB | 2026-10-14–2026-10-14 | Tale of Immortal: A01 to A12 | Yes (OOPS repo) | Idea board or mixed source |
| 1641 | 12 | `docs/research/the-strange-tabletop/aspects-2026-10-14/ASPECTS.md` | 10.3 KiB | 2025-08-22–2026-10-14 | A01-A12: public tabletop aspect pass | Yes (OOPS repo) | Idea board or mixed source |
| 1642 | 12 | `docs/research/the-strange-tabletop/REPORT.md` | 8.4 KiB | mtime 2026-10-15 (no embedded date) | The Strange: one traveler, local forms and local laws | Yes (OOPS repo) | Audit/run output likely |
| 1643 | 12 | `docs/research/theory-of-magic/aspects-2026-10-14/ASPECTS.md` | 12.5 KiB | 2026-10-14–2026-10-14 | theory-of-magic: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1644 | 12 | `docs/research/trimps-antimatter/aspects-2026-10-14/ASPECTS.md` | 12.7 KiB | 2026-10-14–2026-10-14 | trimps-antimatter: aspect backfill, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1645 | 12 | `docs/research/ur-quan-masters/aspects-2026-10-14/ASPECTS.md` | 9.7 KiB | 2026-10-14–2026-10-14 | UQM aspects, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1646 | 12 | `docs/research/vagrus/aspects-2026-10-14/ASPECTS.md` | 12.3 KiB | 2026-10-14–2026-10-14 | vagrus: aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1647 | 12 | `docs/research/vintage-story/aspects-2026-10-14/ASPECTS.md` | 9.5 KiB | 2026-10-14–2026-10-14 | Aspect pass | Yes (OOPS repo) | Idea board or mixed source |
| 1648 | 12 | `docs/research/warsim/KINGDOM_LOOPS_DIGEST.md` | 4.0 KiB | mtime 2026-10-14 (no embedded date) | Kingdom loops: intended rules versus flavor | Yes (OOPS repo) | Idea board or mixed source |
| 1649 | 12 | `docs/research/warsim/pass-2026-10-14-systems/REPORT.md` | 12.4 KiB | 2026-10-14–2026-11-04 | Warsim deep systems sweep | Yes (OOPS repo) | Audit/run output likely |
| 1650 | 12 | `docs/research/your-chronicle/aspects-2026-10-14/ASPECTS.md` | 10.7 KiB | 2026-10-14–2026-10-14 | your-chronicle: aspect pass, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1651 | 12 | `docs/research/your-chronicle/pass-2026-10-14/REPORT.md` | 9.2 KiB | 2026-10-14–2026-10-14 | Your Chronicle: second pass, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1652 | 12 | `docs/research/zhutian-shuabao-lu/aspects-2026-10-14/ASPECTS.md` | 10.0 KiB | 2026-10-14–2026-10-15 | Aspect pass A01-A12 | Yes (OOPS repo) | Idea board or mixed source |
| 1653 | 12 | `docs/research/zhutian-shuabao-lu/REPORT.md` | 6.8 KiB | 2026-10-14–2026-10-15 | Zhutian Shuabao Lu: research report | Yes (OOPS repo) | Audit/run output likely |
| 1654 | 12 | `docs/reviews/DEDUP_AUDIT_2026-10-18/D3.md` | 30.7 KiB | 2026-10-07–2026-10-18 | D3 audit: docs/worlds and docs/emergent (2026-10-18) | Yes (OOPS repo) | Audit/run output likely |
| 1655 | 12 | `docs/reviews/RULE_IMPLEMENTATION_CHECKS_2026-10-16.md` | 13.1 KiB | 2026-10-16–2026-11-04 | Implementation rule checks, 2026-10-16 | Yes (OOPS repo) | Audit/run output likely |
| 1656 | 12 | `docs/reviews/ui-distinct-forms-2026-11-10/R1_GAME_REFERENCES.md` | 28.8 KiB | 2026-11-10–2026-11-10 | R1: how existing games give each mechanism its own form | Yes (OOPS repo) | Audit/run output likely |
| 1657 | 12 | `docs/UI_RULES.md` | 153.1 KiB | 2026-10-10–2026-11-24 | UI rules | Yes (OOPS repo) | Idea board or mixed source |
| 1658 | 12 | `docs/worlds/cheat-directions-2026-10-13/audit/04_CONTINUITY_AND_PREPARATION.md` | 18.9 KiB | 2026-10-13–2026-10-13 | Audit: continuity, death rewards and preparation | Yes (OOPS repo) | Audit/run output likely |
| 1659 | 12 | `docs/worlds/demon-slayer/SOURCE_LEDGER.md` | 6.5 KiB | 2023-12-19–2026-10-13 | Source ledger | Yes (OOPS repo) | Audit/run output likely |
| 1660 | 12 | `docs/worlds/IDENTITY_LAWS_GAPS_2026-10-14.md` | 40.1 KiB | 2023-11-27–2026-10-14 | IL34 identity-law gaps, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1661 | 12 | `docs/worlds/original-frontier/WORLD_COMPLETION.md` | 13.8 KiB | 2026-10-05–2026-10-05 | Finite Frontier world-completion contract | Yes (OOPS repo) | Idea board or mixed source |
| 1662 | 12 | `docs/worlds/world-core-kit-2026-10-14/cards/worm.md` | 7.3 KiB | 2026-10-04–2026-10-24 | World core kit: Worm (2026-10-24, proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 1663 | 11 | `docs/audits/CLAUDE_FOLLOWUP_2026-11-23.md` | 10.7 KiB | 2026-10-27–2026-11-23 | Claude work follow-up, November 23, 2026 | Yes (OOPS repo) | Audit/run output likely |
| 1664 | 11 | `docs/audits/DISCORD_FEATURES_LEDGER_2026-11-15.md` | 10.0 KiB | 2026-11-14–2026-11-16 | Discord features ledger (round 16, PS160-PS168), 2026-11-15 | Yes (OOPS repo) | Audit/run output likely |
| 1665 | 11 | `docs/audits/world_grammar_2026-10-19/DG_A2_SRD_DERIVATION.md` | 19.4 KiB | 2026-10-19–2026-11-04 | DG-A2: D&D SRD derivation proof, 2026-10-19 | Yes (OOPS repo) | Audit/run output likely |
| 1666 | 11 | `docs/emergent/E7_OBSERVATION_AND_MYSTERY.md` | 10.6 KiB | 2026-10-08–2026-10-09 | E7. Observation, mystery and the lore behind things (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 1667 | 11 | `docs/gm/cross-audit-reconciliation-2026-10-15/CONTINUATION.md` | 21.1 KiB | 2026-10-12–2026-10-16 | Individual audit and finding continuation | Yes (OOPS repo) | Audit/run output likely |
| 1668 | 11 | `docs/gm/cross-audit-reconciliation-2026-10-15/T10_SEMANTIC_CONTINUATION.md` | 5.7 KiB | 2026-10-15–2026-10-15 | T10: next31 sources and remaining inventory families | Yes (OOPS repo) | Audit/run output likely |
| 1669 | 11 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-market-life.md` | 7.1 KiB | 2026-10-14–2026-10-14 | P09 visible market life, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1670 | 11 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/sim-stepper.md` | 8.7 KiB | 2026-10-14–2026-10-14 | Performance follow-up, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1671 | 11 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/REPORT.md` | 9.7 KiB | 2026-10-14–2026-11-04 | B10 report: sourcing bodies and bloodlines per world | Yes (OOPS repo) | Audit/run output likely |
| 1672 | 11 | `docs/gm/dispatch/body-lineage-2026-10-14/b17/STAND_INS.md` | 8.3 KiB | 2026-10-14–2026-10-14 | B17 original public-fork body proposals | Yes (OOPS repo) | Idea board or mixed source |
| 1673 | 11 | `docs/gm/dispatch/body-lineage-2026-10-14/b18/REPORT.md` | 7.5 KiB | 2026-10-14–2026-11-04 | B18 report | Yes (OOPS repo) | Audit/run output likely |
| 1674 | 11 | `docs/gm/dispatch/body-lineage-2026-10-14/b5/REPORT.md` | 7.8 KiB | 2026-10-11–2026-10-14 | B5 report: game references for bodies and lineage | Yes (OOPS repo) | Audit/run output likely |
| 1675 | 11 | `docs/gm/dispatch/body-lineage-2026-10-14/b6/VALIDITY.md` | 11.2 KiB | 2026-10-14–2026-10-14 | B6 validity: law, cause and usable function | Yes (OOPS repo) | Idea board or mixed source |
| 1676 | 11 | `docs/gm/dispatch/body-lineage-2026-10-14/b8/SPEC.md` | 24.5 KiB | 2026-10-13–2026-10-14 | G49-B8 desktop body and lineage UI specification | Yes (OOPS repo) | Idea board or mixed source |
| 1677 | 11 | `docs/gm/dispatch/body-lineage-2026-10-14/b9/CORRECTIONS.md` | 6.5 KiB | 2026-10-14–2026-10-14 | B9 corrections and precision notes for G53 | Yes (OOPS repo) | Idea board or mixed source |
| 1678 | 11 | `docs/gm/dispatch/codex-parallel-2026-10-25/WAVE4_RULES.md` | 3.2 KiB | 2026-10-25–2026-10-25 | Wave 4 rules and more-to-consider round (2026-10-25) | Yes (OOPS repo) | Idea board or mixed source |
| 1679 | 11 | `docs/gm/dispatch/deep-engine-2026-10-20/P1_STATUS.md` | 9.0 KiB | 2026-10-20–2026-10-20 | P1: shared combat stat semantics receipt | Yes (OOPS repo) | Audit/run output likely |
| 1680 | 11 | `docs/gm/dispatch/distinct-world-w1-w4-2026-10-22/CHECKPOINT.md` | 15.7 KiB | 2026-10-22–2026-10-22 | W1–W4 distinct-world journeys, 2026-10-22 | Yes (OOPS repo) | Audit/run output likely |
| 1681 | 11 | `docs/gm/dispatch/dual-gm-2026-10-11/expansion/REMAINING_MANIFEST.md` | 4.7 KiB | 2026-10-11–2026-10-11 | Remaining scope and source manifest | Yes (OOPS repo) | Audit/run output likely |
| 1682 | 11 | `docs/gm/dispatch/engine-perf-2026-10-14/REPLAY_LANE_E.md` | 5.9 KiB | 2026-10-14–2026-10-14 | Lane E: reproducible runs and replay harness (2026-10-14) | Yes (OOPS repo) | Idea board or mixed source |
| 1683 | 11 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r6/CHATGPT_RESPONSE.md` | 20.8 KiB | 2026-10-13–2026-10-13 | 1. Recover authority and establish ownership | Yes (OOPS repo) | Idea board or mixed source |
| 1684 | 11 | `docs/gm/dispatch/foundation-run-2026-11-12/FAMILY_PROCESS_CRAFTS.md` | 15.6 KiB | 2026-11-12–2026-11-12 | Family: process crafts (Wave 12) | Yes (OOPS repo) | Idea board or mixed source |
| 1685 | 11 | `docs/gm/dispatch/foundation-run-2026-11-12/W15_RECIPE_TRUTH.md` | 6.9 KiB | 2026-11-12–2026-11-12 | W15 recipe truth: knowledge that can be wrong | Yes (OOPS repo) | Idea board or mixed source |
| 1686 | 11 | `docs/gm/dispatch/foundation-run-2026-11-12/W17_KNOWLEDGE_RECORD.md` | 8.2 KiB | 2026-11-12–2026-11-12 | W17 knowledge record: a believed side beside a true side | Yes (OOPS repo) | Idea board or mixed source |
| 1687 | 11 | `docs/gm/dispatch/idea-expansion-2026-10-11/material/REPORT.md` | 14.3 KiB | 2026-10-11–2026-10-11 | G6 Materials, crafting, technology and environment | Yes (OOPS repo) | Audit/run output likely |
| 1688 | 11 | `docs/gm/dispatch/lotm-lives-regions-2026-10-23/QUEUE.md` | 16.5 KiB | 2026-10-22–2026-10-24 | LOTM lives, pathways and regions: build queue, 2026-10-23 | Yes (OOPS repo) | Idea board or mixed source |
| 1689 | 11 | `docs/gm/dispatch/maker-arts-2026-10-14/W5_REPORT.md` | 4.0 KiB | 2026-10-14–2026-10-14 | W5 report: real craft as early text cues | Yes (OOPS repo) | Audit/run output likely |
| 1690 | 11 | `docs/gm/dispatch/modular-chains-2026-10-14/pc3/REPORT.md` | 35.1 KiB | 2026-10-13–2026-10-14 | PC3: assembly at every level | Yes (OOPS repo) | Audit/run output likely |
| 1691 | 11 | `docs/gm/dispatch/pc-groups-2026-10-26/cross-craft-connections/implementation/C1.md` | 16.0 KiB | 2026-10-26–2026-10-26 | C1: Implement PC23 cross-craft outputs and consumers | Yes (OOPS repo) | Audit/run output likely |
| 1692 | 11 | `docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/COMMON.md` | 18.1 KiB | 2026-10-26–2026-10-26 | G7 lore implementation dispatch, 2026-10-26 | Yes (OOPS repo) | Idea board or mixed source |
| 1693 | 11 | `docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L1.md` | 20.3 KiB | 2026-10-26–2026-10-26 | L1: Names, documents and disputed evidence | Yes (OOPS repo) | Idea board or mixed source |
| 1694 | 11 | `docs/gm/dispatch/pc-groups-2026-10-26/material-foundations/implementation-2026-10-26/COMMON.md` | 24.7 KiB | 2026-10-26–2026-10-26 | Material foundations implementation dispatch, 2026-10-26 | Yes (OOPS repo) | Idea board or mixed source |
| 1695 | 11 | `docs/gm/dispatch/procgen-2026-10-13/cr2/ORIGINAL_WORLDS.md` | 13.0 KiB | 2026-10-13–2026-10-14 | CR2 original-world crafting laws | Yes (OOPS repo) | Idea board or mixed source |
| 1696 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/BANDE_DESSINEE_AND_STRIPS.md` | 7.0 KiB | 2026-10-13–2026-10-14 | Bande dessinée, British anthology and strips: family notes | Yes (OOPS repo) | Idea board or mixed source |
| 1697 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/CULTIVATION_MANHUA.md` | 6.9 KiB | 2026-10-13–2026-10-14 | Cultivation manhua: work-specific generation family | Yes (OOPS repo) | Idea board or mixed source |
| 1698 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/DC.md` | 5.1 KiB | 2026-10-13–2026-10-14 | DC: franchise with selected eras | Yes (OOPS repo) | Idea board or mixed source |
| 1699 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/K_READBACK.md` | 5.5 KiB | 2026-10-13–2026-10-14 | GX1 final K-lane readback | Yes (OOPS repo) | Idea board or mixed source |
| 1700 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/MARVEL.md` | 5.7 KiB | 2026-10-13–2026-10-14 | Marvel: franchise with selected eras | Yes (OOPS repo) | Idea board or mixed source |
| 1701 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/OMNISCIENT_READER.md` | 5.7 KiB | 2026-10-13–2026-10-14 | Omniscient Reader: comic scenario profile | Yes (OOPS repo) | Idea board or mixed source |
| 1702 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/OTHER_WESTERN_WORLDS.md` | 8.1 KiB | 2026-10-13–2026-10-14 | Other western comic families: generation coverage for K2 | Yes (OOPS repo) | Audit/run output likely |
| 1703 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/SANDMAN.md` | 5.3 KiB | 2026-10-13–2026-10-14 | Sandman: creator-led run and Dreaming-adjacent profiles | Yes (OOPS repo) | Idea board or mixed source |
| 1704 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/SOLO_LEVELING.md` | 5.8 KiB | 2026-10-13–2026-10-14 | Solo Leveling: manhwa gate profile | Yes (OOPS repo) | Idea board or mixed source |
| 1705 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/TOWER_OF_GOD.md` | 5.3 KiB | 2026-10-13–2026-10-14 | Tower of God: floor-test content profiles | Yes (OOPS repo) | Idea board or mixed source |
| 1706 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx1/WEBCOMICS.md` | 6.3 KiB | 2026-10-13–2026-10-14 | Webcomics: rules-aware and creator-specific generation | Yes (OOPS repo) | Idea board or mixed source |
| 1707 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx2/CATALOG.md` | 16.9 KiB | 2026-10-13–2026-10-14 | GX2 GL1–GL10 generation cards | Yes (OOPS repo) | Idea board or mixed source |
| 1708 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx2/MORE.md` | 15.2 KiB | 2026-10-13–2026-10-14 | GX2 expanded generation angles | Yes (OOPS repo) | Idea board or mixed source |
| 1709 | 11 | `docs/gm/dispatch/procgen-2026-10-13/gx3/REPORT.md` | 16.1 KiB | 2026-10-13–2026-11-04 | GX3 report: subtle and overarching generation | Yes (OOPS repo) | Audit/run output likely |
| 1710 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p13/RULES.md` | 14.4 KiB | 2026-10-13–2026-10-14 | P13 canon coexistence contract | Yes (OOPS repo) | Idea board or mixed source |
| 1711 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p17/REPORT.md` | 10.0 KiB | 2026-10-13–2026-10-14 | P17 report: story as a power source, per world | Yes (OOPS repo) | Audit/run output likely |
| 1712 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p21/BATTLE_STORIES.md` | 9.7 KiB | 2026-10-13–2026-10-14 | Battle stories and returning opponents | Yes (OOPS repo) | Idea board or mixed source |
| 1713 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p21/VENTURES.md` | 7.5 KiB | 2026-10-11–2026-10-14 | Investments and ventures with remembered returns | Yes (OOPS repo) | Idea board or mixed source |
| 1714 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p25/TRIAGE.md` | 9.1 KiB | 2026-10-13–2026-10-14 | P25: notification triage across live narrative surfaces | Yes (OOPS repo) | Idea board or mixed source |
| 1715 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p26/OTHER_FULL_BOOK.md` | 7.4 KiB | 2026-10-11–2026-10-14 | Other full-book sources: W1 candidates | Yes (OOPS repo) | Idea board or mixed source |
| 1716 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p27/EXPEDITIONS.md` | 8.1 KiB | 2026-10-13–2026-10-14 | AA2 extensions: caravans and voyages that return with a story | Yes (OOPS repo) | Idea board or mixed source |
| 1717 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p27/JOURNEYS.md` | 8.7 KiB | 2026-10-13–2026-10-14 | AA1 extensions: journeys between authored nodes | Yes (OOPS repo) | Idea board or mixed source |
| 1718 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p28/WRITERS_ROOM.md` | 12.2 KiB | 2026-10-13–2026-10-14 | P28 agent writers' room and prompt kit | Yes (OOPS repo) | Idea board or mixed source |
| 1719 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p31/OATHS_AND_CONTRACTS.md` | 11.1 KiB | 2026-10-11–2026-10-14 | AJ2: oaths and contracts under local laws | Yes (OOPS repo) | Idea board or mixed source |
| 1720 | 11 | `docs/gm/dispatch/procgen-2026-10-13/p37/OCCULT_AND_TRIAL_WORLDS.md` | 9.5 KiB | 2026-10-13–2026-10-14 | BH.LM / BH.CI / BH.SS: occult and trial texture | Yes (OOPS repo) | Idea board or mixed source |
| 1721 | 11 | `docs/gm/dispatch/protagonist-life-2026-10-27/CAST_LIVES_CARD.md` | 13.2 KiB | 2026-10-27–2026-10-30 | Cast lives: one-page card | Yes (OOPS repo) | Idea board or mixed source |
| 1722 | 11 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF_ABILITY_CHECKPOINT.md` | 17.9 KiB | 2026-10-27–2026-10-29 | AB1: held ability and ordered conflict consumer | Yes (OOPS repo) | Audit/run output likely |
| 1723 | 11 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/RV10_CHECKPOINT.md` | 6.5 KiB | 2026-10-27–2026-10-29 | RV10 checkpoint: paragraph-reviewed shard | Yes (OOPS repo) | Audit/run output likely |
| 1724 | 11 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/RV9_CHECKPOINT.md` | 5.9 KiB | 2026-10-27–2026-10-29 | RV9 checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1725 | 11 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/RW8_CHECKPOINT.md` | 8.9 KiB | 2026-10-27–2026-10-29 | RW8 checkpoint: ability and conflict paragraph review | Yes (OOPS repo) | Audit/run output likely |
| 1726 | 11 | `docs/gm/dispatch/quality-deep-dives-2026-11-06/FIX_OPENINGS_REPORT.md` | 6.7 KiB | 2026-11-06–2026-11-07 | FIX_OPENINGS report (2026-11-07) | Yes (OOPS repo) | Audit/run output likely |
| 1727 | 11 | `docs/gm/dispatch/refinement-audits-2026-10-31/B2_B3_MORE_TO_CONSIDER_2026-11-03.md` | 6.6 KiB | 2026-10-31–2026-11-04 | B2/B3 more to consider: potions, pathways and people (2026-11-03) | Yes (OOPS repo) | Audit/run output likely |
| 1728 | 11 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3R_IMPLEMENTATION_RECEIPT.md` | 11.0 KiB | 2026-10-31–2026-11-03 | KJ3R implementation receipt: the end of the second gathering, the errand and the Divination Club (kjw8) | Yes (OOPS repo) | Audit/run output likely |
| 1729 | 11 | `docs/gm/dispatch/refinement-audits-2026-10-31/TAROT_GATHERING_AND_RITUAL_SCENE_AUDIT.md` | 25.7 KiB | 2026-10-31–2026-11-01 | First gathering, Old Neil's lesson and five ritual mechanisms | Yes (OOPS repo) | Audit/run output likely |
| 1730 | 11 | `docs/gm/dispatch/research-tech-2026-10-14/t11/HOOKS.md` | 11.4 KiB | 2026-10-11–2026-10-14 | T11 hooks: quiet signs on existing surfaces | Yes (OOPS repo) | Idea board or mixed source |
| 1731 | 11 | `docs/gm/dispatch/research-tech-2026-10-14/t3/PATTERNS.md` | 7.7 KiB | 2026-10-14–2026-10-14 | T3: cross-game considerations | Yes (OOPS repo) | Idea board or mixed source |
| 1732 | 11 | `docs/gm/dispatch/research-tech-2026-10-14/t3/REPORT.md` | 8.6 KiB | 2026-10-14–2026-10-14 | T3 report: research mechanics from reference games | Yes (OOPS repo) | Audit/run output likely |
| 1733 | 11 | `docs/gm/dispatch/research-tech-2026-10-14/t8/RUINS.md` | 7.7 KiB | 2026-10-13–2026-10-14 | T8: ruins as surviving capability and evidence | Yes (OOPS repo) | Idea board or mixed source |
| 1734 | 11 | `docs/gm/dispatch/research-tech-2026-10-14/t9/CHECKPOINT.md` | 3.5 KiB | 2026-10-14–2026-10-14 | T9 planner QA design checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1735 | 11 | `docs/gm/dispatch/research-tech-2026-10-14/t9/DANGER_LINT.md` | 13.5 KiB | 2026-10-13–2026-10-14 | Z4: contextual PI9 danger lint | Yes (OOPS repo) | Idea board or mixed source |
| 1736 | 11 | `docs/gm/dispatch/runs-and-endings-2026-10-14/SESSIONS.md` | 2.0 KiB | 2026-10-13–2026-10-14 | Sessions | Yes (OOPS repo) | Idea board or mixed source |
| 1737 | 11 | `docs/gm/dispatch/sonnet-wave-2026-10-30/L10_ADVANCEMENT_DESIGN.md` | 10.5 KiB | 2026-10-30–2026-10-30 | L10 advancement and abilities: design note (2026-10-30) | Yes (OOPS repo) | Idea board or mixed source |
| 1738 | 11 | `docs/gm/dispatch/sonnet-wave-2026-10-30/LEDGER.md` | 30.5 KiB | 2026-10-27–2026-10-31 | LOTM volume 1 absorption ledger (2026-10-30) | Yes (OOPS repo) | Audit/run output likely |
| 1739 | 11 | `docs/gm/dispatch/starts-talents-continuity-2026-10-11/engine/REPORT.md` | 8.5 KiB | 2026-10-11–2026-10-11 | Representative engine seam review | Yes (OOPS repo) | Audit/run output likely |
| 1740 | 11 | `docs/gm/dispatch/starts-talents-continuity-2026-10-11/palette/REPORT.md` | 6.6 KiB | 2026-10-11–2026-10-11 | Starts and talents: additive lifecycle joins | Yes (OOPS repo) | Audit/run output likely |
| 1741 | 11 | `docs/gm/dispatch/systems-cheats-expansion-2026-10-11/DESIGN.md` | 51.9 KiB | 2026-10-10–2026-10-11 | Systems, cheats and consequential breadth | Yes (OOPS repo) | Idea board or mixed source |
| 1742 | 11 | `docs/gm/dispatch/topic-wave-2026-10-14/tw-s/REPORT.md` | 8.7 KiB | 2026-10-14–2026-10-14 | CHECKPOINT: COMPLETE | Yes (OOPS repo) | Audit/run output likely |
| 1743 | 11 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/scratch/surfaces/evidence.md` | 3.0 KiB | 2026-10-15–2026-10-16 | SF preserved-pixel receipt | Yes (OOPS repo) | Audit/run output likely |
| 1744 | 11 | `docs/gm/dispatch/ui-foundation-2026-10-15/R11_REPORT.md` | 7.3 KiB | 2026-10-15–2026-10-15 | R11 adaptive secondary stats and research incorporation | Yes (OOPS repo) | Audit/run output likely |
| 1745 | 11 | `docs/gm/dispatch/ui-foundation-2026-10-15/R13_CHECKPOINT.md` | 2.8 KiB | 2026-10-15–2026-10-15 | R13 regions with a job (Claude) | Yes (OOPS repo) | Audit/run output likely |
| 1746 | 11 | `docs/gm/dispatch/ui-foundation-2026-10-15/R22B_REPORT.md` | 6.8 KiB | 2026-10-15–2026-10-17 | R22b: screen use at 1920, 2026-10-17 | Yes (OOPS repo) | Audit/run output likely |
| 1747 | 11 | `docs/gm/dispatch/ui-foundation-2026-10-15/R5_SOURCE_CONSIDERATIONS.md` | 4.9 KiB | 2026-10-15–2026-10-15 | R5 source comparison and deeper UI considerations | Yes (OOPS repo) | Idea board or mixed source |
| 1748 | 11 | `docs/gm/dispatch/ui-foundation-2026-10-15/R6_CONSIDERATIONS.md` | 6.1 KiB | 2026-10-15–2026-10-15 | R6: deeper source, knowledge and UI-flow considerations | Yes (OOPS repo) | Idea board or mixed source |
| 1749 | 11 | `docs/gm/dispatch/ui-modularity-2026-10-11/REPORT.md` | 6.8 KiB | 2026-10-11–2026-10-12 | UI consistency and modular workspace delivery | Yes (OOPS repo) | Audit/run output likely |
| 1750 | 11 | `docs/gm/dispatch/vivid-proto23-flow-2026-10-13/GOAL.md` | 7.3 KiB | 2026-10-13–2026-10-13 | Vivid + Proto23 UI flow: until-done goal (2026-10-13) | Yes (OOPS repo) | Idea board or mixed source |
| 1751 | 11 | `docs/reports/PROGRESS_ATLAS_SKILL_TRIAL_2026-11-04.md` | 10.8 KiB | 2026-11-04–2026-11-04 | World-pack persistence and crossing progress atlas | Yes (OOPS repo) | Audit/run output likely |
| 1752 | 11 | `docs/representations/RITUALS_AND_MAKING.md` | 23.5 KiB | 2026-10-29–2026-10-30 | Rituals and making: representation (proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 1753 | 11 | `docs/research/cross-game-synthesis-2026-10-14/DIALOGUE_AND_NARRATIVE.md` | 15.1 KiB | 2026-10-09–2026-10-14 | Dialogue and narrative delivery | Yes (OOPS repo) | Idea board or mixed source |
| 1754 | 11 | `docs/research/everyday-paths-ui-2026-10-15/FISHING_MINING_INTERACTIVE_CHOICES.md` | 11.1 KiB | 2026-10-15–2026-10-15 | Fishing spots and mining faces: interactive choice study | Yes (OOPS repo) | Idea board or mixed source |
| 1755 | 11 | `docs/research/everyday-paths-ui-2026-10-15/REPORT.md` | 20.4 KiB | 2026-10-14–2026-10-15 | Everyday pursuits as whole paths | Yes (OOPS repo) | Audit/run output likely |
| 1756 | 11 | `docs/research/heavens-vault/aspects-2026-10-14/REPORT.md` | 3.1 KiB | 2026-10-14–2026-10-14 | heavens-vault: narrative, implementation and persistence | Yes (OOPS repo) | Audit/run output likely |
| 1757 | 11 | `docs/research/hogwarts-legacy/deep/EXTRAS_DIGEST.md` | 13.1 KiB | 2026-10-14–2026-10-14 | Extra systems digest | Yes (OOPS repo) | Idea board or mixed source |
| 1758 | 11 | `docs/research/JOJO_AUDIT_SCOPE_REFINEMENT_2026-10-11.md` | 8.4 KiB | 2026-10-03–2026-10-11 | JoJo audit: scope refinement | Yes (OOPS repo) | Audit/run output likely |
| 1759 | 11 | `docs/research/local-ai-2026-10-15/thinking-comparison/REPORT.md` | 12.5 KiB | 2026-10-13–2026-10-15 | Thinking on versus off: Harry Potter authoring and planning | Yes (OOPS repo) | Audit/run output likely |
| 1760 | 11 | `docs/research/multi-realm-muds/REPORT.md` | 7.7 KiB | 2026-10-14–2026-10-14 | Multi-realm MUDs: RetroMUD and 3 Kingdoms | Yes (OOPS repo) | Audit/run output likely |
| 1761 | 11 | `docs/research/noita/COMPOSITION_DIGEST.md` | 11.2 KiB | 2026-10-09–2026-10-09 | Noita composition digest | Yes (OOPS repo) | Idea board or mixed source |
| 1762 | 11 | `docs/research/noita/PERKS_FINDINGS.md` | 10.8 KiB | 2026-10-09–2026-10-09 | Noita perks and world rewrites | Yes (OOPS repo) | Audit/run output likely |
| 1763 | 11 | `docs/research/power-systems/web-fiction/REPORT.md` | 23.7 KiB | 2026-10-08–2026-10-10 | Lane B: web-fiction power systems | Yes (OOPS repo) | Audit/run output likely |
| 1764 | 11 | `docs/research/power-systems/wiki-digests/full-dumps/workers/csm-full/SUMMARY.md` | 4.5 KiB | 2023-11-27–2026-10-13 | Chainsaw Man offline reader completion | Yes (OOPS repo) | Idea board or mixed source |
| 1765 | 11 | `docs/research/power-systems/wiki-digests/full-dumps/workers/mha-full/shard-a/SUMMARY.md` | 4.3 KiB | 2023-11-28–2026-10-14 | MHA reader shard A summary | Yes (OOPS repo) | Idea board or mixed source |
| 1766 | 11 | `docs/research/procedural-materials-2026-10-13/PROCEDURAL_RULES.md` | 13.1 KiB | 2026-10-13–2026-10-13 | Procedural materials: rules, generation and composition | Yes (OOPS repo) | Idea board or mixed source |
| 1767 | 11 | `docs/research/project-zomboid/CHAINS.md` | 6.0 KiB | 2026-10-14–2026-10-14 | Processing chains in installed 42.21 | Yes (OOPS repo) | Idea board or mixed source |
| 1768 | 11 | `docs/research/sapiens/REPORT.md` | 9.3 KiB | 2026-10-14–2026-10-14 | Sapiens feature scout, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1769 | 11 | `docs/research/SILLYTAVERN_PRESET_FIT_2026-10-14.md` | 10.6 KiB | 2026-10-14–2026-10-14 | SillyTavern preset fit for local AI | Yes (OOPS repo) | Idea board or mixed source |
| 1770 | 11 | `docs/research/vagrus/aspects-2026-10-14/REPORT.md` | 3.1 KiB | 2026-10-14–2026-10-14 | vagrus: narrative, implementation and persistence | Yes (OOPS repo) | Audit/run output likely |
| 1771 | 11 | `docs/reviews/CORC_UI_2026-10-21.md` | 27.1 KiB | 2026-10-21–2026-11-04 | Corc UI follow-through, 2026-10-21 | Yes (OOPS repo) | Audit/run output likely |
| 1772 | 11 | `docs/reviews/plan-rule-reconciliation-2026-10-18/SUPERSESSION_GROUPS.md` | 6.7 KiB | 2026-10-14–2026-11-01 | Supersession and folded-plan groups, 2026-10-18 | Yes (OOPS repo) | Audit/run output likely |
| 1773 | 11 | `docs/reviews/UNFINISHED_GAME_PRIORITIES_2026-10-26.md` | 10.2 KiB | 2026-10-24–2026-11-04 | Unfinished game work and next priorities, 2026-10-26 | Yes (OOPS repo) | Audit/run output likely |
| 1774 | 11 | `docs/tools/HEADLESS_STEP_SPEED_2026-11-18.md` | 6.4 KiB | 2026-11-18–2026-11-18 | Headless step speed (2026-11-18) | Yes (OOPS repo) | Idea board or mixed source |
| 1775 | 11 | `docs/worlds/cheat-directions-2026-10-13/01_LIBRARY_TIERS_AND_RANDOM.md` | 15.9 KiB | 2026-10-13–2026-10-13 | Cheat library, tiers, types and random generation | Yes (OOPS repo) | Idea board or mixed source |
| 1776 | 11 | `docs/worlds/cheat-directions-2026-10-13/audit/01_GAMEPLAY_AND_PROGRESSION.md` | 17.0 KiB | 2026-10-09–2026-10-13 | Gameplay and progression audit | Yes (OOPS repo) | Audit/run output likely |
| 1777 | 11 | `docs/worlds/hunter-x-hunter/ABILITY_VARIANTS.md` | 6.4 KiB | 2026-10-14–2026-11-09 | Hunter × Hunter ability variants proposal | Yes (OOPS repo) | Idea board or mixed source |
| 1778 | 11 | `docs/worlds/hunter-x-hunter/WORLD_BRIEF.md` | 5.8 KiB | 2026-10-10–2026-10-14 | Hunter × Hunter: The Unfinished Field Ledger | Yes (OOPS repo) | Audit/run output likely |
| 1779 | 11 | `docs/worlds/mha/readers-2026-10-14/shard-a/SUMMARY.md` | 4.3 KiB | 2023-11-28–2026-10-14 | MHA reader shard A summary | Yes (OOPS repo) | Idea board or mixed source |
| 1780 | 11 | `docs/worlds/world-core-kit-2026-10-14/cards/tensura.md` | 6.8 KiB | 2026-10-10–2026-10-24 | World core kit: Tensura / That Time I Got Reincarnated as a Slime (2026-10-24, proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 1781 | 10 | `docs/audits/CHEAT_ABSORPTION_SWEEP_2026-11-24.md` | 5.9 KiB | 2026-10-25–2026-11-24 | Cheat absorption sweep, 2026-11-24 | Yes (OOPS repo) | Audit/run output likely |
| 1782 | 10 | `docs/audits/NEWER_REVIEW_SEER_CAPTURE_RELEASE_2026-11-04.md` | 8.2 KiB | 2026-11-04–2026-11-05 | Newer review, Seer and capture release | Yes (OOPS repo) | Audit/run output likely |
| 1783 | 10 | `docs/audits/world_pack_details_2026-10-20/REPORT.md` | 11.8 KiB | 2026-10-19–2026-11-04 | World-pack detail audit and corrections | Yes (OOPS repo) | Audit/run output likely |
| 1784 | 10 | `docs/DESIGN_GRAMMAR.md` | 13.6 KiB | 2026-11-15–2026-11-24 | OOPS design grammar (proposal, AD32) | Yes (OOPS repo) | Idea board or mixed source |
| 1785 | 10 | `docs/emergent/E8D_VOW_SYSTEM.md` | 24.6 KiB | 2026-10-10–2026-10-10 | E8D. The vow system: slots, pricing, enforcement (proposal) | Yes (OOPS repo) | Idea board or mixed source |
| 1786 | 10 | `docs/gm/causal-endings/IMPLEMENTATION_PACKETS.md` | 19.6 KiB | 2026-10-06–2026-10-06 | Ranked executable integration packets | Yes (OOPS repo) | Audit/run output likely |
| 1787 | 10 | `docs/gm/cross-audit-reconciliation-2026-10-15/T09_SEMANTIC_CONTINUATION.md` | 7.1 KiB | 2026-10-15–2026-10-15 | T09: nonhuman complements and broader inventories | Yes (OOPS repo) | Audit/run output likely |
| 1788 | 10 | `docs/gm/dispatch/absorb-all-2026-10-14/checks/sim-stepper/PERFORMANCE_FOLLOWUP.md` | 7.7 KiB | 2026-10-14–2026-10-14 | Simulation performance follow-up, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1789 | 10 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-encounter-profiles.md` | 7.6 KiB | 2026-10-07–2026-10-14 | P16 encounter profiles, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1790 | 10 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-reveal-chain.md` | 10.0 KiB | 2026-10-14–2026-10-14 | p23-reveal-chain, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1791 | 10 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-ui-polish.md` | 10.9 KiB | 2026-10-14–2026-10-14 | p23-ui-polish absorption report, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1792 | 10 | `docs/gm/dispatch/absorb-all-2026-10-14/reports/reach-fixes.md` | 6.4 KiB | 2026-10-14–2026-10-14 | Reach fixes A1–A9, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1793 | 10 | `docs/gm/dispatch/body-lineage-2026-10-14/b10/CHAINS.md` | 18.3 KiB | 2026-10-14–2026-11-04 | B10 source-to-use causal chains | Yes (OOPS repo) | Idea board or mixed source |
| 1794 | 10 | `docs/gm/dispatch/body-lineage-2026-10-14/b13/BREADCRUMBS.md` | 8.5 KiB | 2026-10-14–2026-10-14 | B13 breadcrumbs before diagnosis | Yes (OOPS repo) | Idea board or mixed source |
| 1795 | 10 | `docs/gm/dispatch/body-lineage-2026-10-14/b2/SPEC.md` | 22.8 KiB | 2026-10-14–2026-10-14 | B2 implementation specification | Yes (OOPS repo) | Idea board or mixed source |
| 1796 | 10 | `docs/gm/dispatch/body-lineage-2026-10-14/b3/REPORT.md` | 6.9 KiB | 2026-10-14–2026-11-04 | B3 report: bloodline as heir and prestige carrier | Yes (OOPS repo) | Audit/run output likely |
| 1797 | 10 | `docs/gm/dispatch/body-lineage-2026-10-14/b4/CORRECTIONS.md` | 7.7 KiB | 2026-10-14–2026-11-04 | Genetics franchise-reference audit | Yes (OOPS repo) | Audit/run output likely |
| 1798 | 10 | `docs/gm/dispatch/chain-build-2026-10-14/t2/REPORT.md` | 14.0 KiB | 2026-10-14–2026-10-14 | T2 chain inspector | Yes (OOPS repo) | Audit/run output likely |
| 1799 | 10 | `docs/gm/dispatch/cheats-sfx-implementation-2026-10-12/AUTHORING_ADAPTERS.md` | 3.3 KiB | 2026-10-12–2026-10-12 | Comprehensive customization adapter ledger | Yes (OOPS repo) | Audit/run output likely |
| 1800 | 10 | `docs/gm/dispatch/comics-2026-10-14/K2_REPORT.md` | 7.6 KiB | 2026-10-14–2026-10-14 | K2 report, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1801 | 10 | `docs/gm/dispatch/companions-2026-10-14/C10_REPORT.md` | 4.6 KiB | 2026-10-14–2026-10-14 | C10 report: companion presentation, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1802 | 10 | `docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/BRIEF.md` | 5.4 KiB | 2026-10-07–2026-10-18 | R15: resume the open foundation gates | Yes (OOPS repo) | Idea board or mixed source |
| 1803 | 10 | `docs/gm/dispatch/foundation-g-2026-11-12/CHECKPOINT.md` | 18.1 KiB | 2026-11-11–2026-11-12 | Foundation chat G (Gu), phase 1 checkpoint, 2026-11-12 | Yes (OOPS repo) | Audit/run output likely |
| 1804 | 10 | `docs/gm/dispatch/foundation-run-2026-11-12/W17_BUDGET_AND_COUPLINGS.md` | 6.3 KiB | 2026-11-12–2026-11-12 | Wave 17: day budget and coupling report (E4, E8) | Yes (OOPS repo) | Audit/run output likely |
| 1805 | 10 | `docs/gm/dispatch/gen-rules-2026-10-14/g2/MORE.md` | 8.4 KiB | 2026-10-14–2026-10-14 | G2 additions: SB18-SB26 | Yes (OOPS repo) | Idea board or mixed source |
| 1806 | 10 | `docs/gm/dispatch/minecraft-cultivation-mods-2026-10-25/implementation-2026-10-26/L4.md` | 39.3 KiB | 2026-10-25–2026-10-26 | L4: Implement LOTM mod-derived brewing acting artifacts and rituals | Yes (OOPS repo) | Idea board or mixed source |
| 1807 | 10 | `docs/gm/dispatch/p23-ui-polish-2026-10-14/REPORT.md` | 10.9 KiB | 2026-10-14–2026-10-14 | p23-ui-polish absorption report, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1808 | 10 | `docs/gm/dispatch/palette-completion-2026-10-20/FEEDBACK.md` | 4.1 KiB | 2026-10-20–2026-10-20 | Native feedback and summaries lane | Yes (OOPS repo) | Idea board or mixed source |
| 1809 | 10 | `docs/gm/dispatch/panel-kit-2026-10-13/runs/docs.last.md` | 1.1 KiB | 2026-10-13–2026-10-13 | docs.last.md | Yes (OOPS repo) | Idea board or mixed source |
| 1810 | 10 | `docs/gm/dispatch/pc-groups-2026-10-26/lore-and-idea-sources/implementation/L3/REPORT.md` | 9.0 KiB | 2026-10-26–2026-10-26 | G7 joined lore implementation | Yes (OOPS repo) | Audit/run output likely |
| 1811 | 10 | `docs/gm/dispatch/pc-groups-2026-10-26/material-foundations/implementation-2026-10-26/M2.md` | 15.2 KiB | 2026-10-26–2026-10-26 | M2: Implement material lots and causal receipts | Yes (OOPS repo) | Audit/run output likely |
| 1812 | 10 | `docs/gm/dispatch/pc-groups-2026-10-26/material-foundations/implementation-2026-10-26/M6.md` | 41.0 KiB | 2026-10-26–2026-10-26 | M6: Integrate and verify material foundation details | Yes (OOPS repo) | Idea board or mixed source |
| 1813 | 10 | `docs/gm/dispatch/pc-groups-2026-10-26/process-actions/implementation/integration/STATUS.md` | 11.7 KiB | 2026-10-26–2026-10-26 | G3 / PC18 integration status | Yes (OOPS repo) | Audit/run output likely |
| 1814 | 10 | `docs/gm/dispatch/procgen-2026-10-13/cr3/COLLECTION.md` | 7.6 KiB | 2026-10-13–2026-10-14 | CR3 collection and learned principles | Yes (OOPS repo) | Idea board or mixed source |
| 1815 | 10 | `docs/gm/dispatch/procgen-2026-10-13/gx1/HELLBOY.md` | 4.2 KiB | 2026-10-13–2026-10-14 | Hellboy and B.P.R.D.: dated case profiles | Yes (OOPS repo) | Idea board or mixed source |
| 1816 | 10 | `docs/gm/dispatch/procgen-2026-10-13/gx1/INVINCIBLE.md` | 4.2 KiB | 2026-10-13–2026-10-14 | Invincible: finite comic range, separate adaptations | Yes (OOPS repo) | Idea board or mixed source |
| 1817 | 10 | `docs/gm/dispatch/procgen-2026-10-13/gx1/OTHER_WEBTOON_WORLDS.md` | 6.0 KiB | 2026-10-13–2026-10-14 | Other webtoon/manhwa families: conditional coverage | Yes (OOPS repo) | Audit/run output likely |
| 1818 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p12/WORLD_FIT.md` | 11.6 KiB | 2026-10-11–2026-10-14 | P12 world fit: the same arc contract, different laws | Yes (OOPS repo) | Idea board or mixed source |
| 1819 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p13/LIVE_AUDIT.md` | 6.3 KiB | 2026-10-13–2026-10-14 | Live narrative source audit | Yes (OOPS repo) | Audit/run output likely |
| 1820 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p18/REPORT.md` | 6.6 KiB | 2026-10-13–2026-10-14 | P18: headless story QA, metrics and generator hygiene | Yes (OOPS repo) | Audit/run output likely |
| 1821 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p21/ECOLOGY_STORIES.md` | 5.5 KiB | 2026-10-13–2026-10-14 | Ecology as a cause of stories | Yes (OOPS repo) | Idea board or mixed source |
| 1822 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p23/INNER_LIFE.md` | 10.7 KiB | 2026-10-11–2026-10-14 | P23 inner life: M1–M4 extensions | Yes (OOPS repo) | Idea board or mixed source |
| 1823 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p26/LIMITED_COVERAGE.md` | 7.3 KiB | 2026-10-13–2026-10-14 | Limited-coverage worlds: concrete leads without invented extraction | Yes (OOPS repo) | Audit/run output likely |
| 1824 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p26/LIVE_AUDIT.md` | 6.1 KiB | 2026-10-13–2026-10-14 | P26 live narrative seam audit | Yes (OOPS repo) | Audit/run output likely |
| 1825 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p26/REPORT.md` | 12.2 KiB | 2026-10-13–2026-10-14 | P26 report: book beat templates, genres and humor | Yes (OOPS repo) | Audit/run output likely |
| 1826 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p27/DISCIPLES.md` | 6.7 KiB | 2026-10-13–2026-10-14 | AB2 extensions: disciples and apprentices with independent arcs | Yes (OOPS repo) | Idea board or mixed source |
| 1827 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p27/LEADING_GROUPS.md` | 8.1 KiB | 2026-10-13–2026-10-14 | AB1 extensions: leading a sect, guild, company or household | Yes (OOPS repo) | Idea board or mixed source |
| 1828 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p32/REPORT.md` | 7.6 KiB | 2026-10-13–2026-10-14 | P32: level of detail, continuity and content planning | Yes (OOPS repo) | Audit/run output likely |
| 1829 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p37/DND.md` | 4.3 KiB | 2026-10-13–2026-10-14 | BH.DD: D&D and a selected local setting | Yes (OOPS repo) | Idea board or mixed source |
| 1830 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p37/HARRY_POTTER.md` | 5.4 KiB | 2026-10-11–2026-10-14 | BH.HP: Harry Potter | Yes (OOPS repo) | Idea board or mixed source |
| 1831 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p37/MORE.md` | 6.1 KiB | 2026-10-13–2026-10-14 | BH11–BH20: further micro texture angles | Yes (OOPS repo) | Idea board or mixed source |
| 1832 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p37/SHARED_SHAPE.md` | 7.7 KiB | 2026-10-13–2026-10-14 | BH: micro texture catalog shape | Yes (OOPS repo) | Idea board or mixed source |
| 1833 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p39/BUDGETS.md` | 12.0 KiB | 2026-10-13–2026-10-14 | BK1–BK4: runtime, catch-up, bundle and save budgets | Yes (OOPS repo) | Idea board or mixed source |
| 1834 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p39/REGISTRY.md` | 11.3 KiB | 2026-10-13–2026-10-18 | BJ3/BJ4: generator, content, consumer and panel registry | Yes (OOPS repo) | Idea board or mixed source |
| 1835 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p7/GUIDELINES.md` | 17.6 KiB | 2026-10-13–2026-10-13 | People and names in canon worlds | Yes (OOPS repo) | Idea board or mixed source |
| 1836 | 10 | `docs/gm/dispatch/procgen-2026-10-13/p9/PROFILE_RULES.md` | 6.5 KiB | 2026-10-13–2026-10-14 | Shared reading contract for P9 profiles | Yes (OOPS repo) | Idea board or mixed source |
| 1837 | 10 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/L6B_CHECKPOINT.md` | 20.7 KiB | 2026-10-27–2026-10-28 | L6B checkpoint: MoL cast records, 2026-10-28 | Yes (OOPS repo) | Audit/run output likely |
| 1838 | 10 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MF_DIVINATION_CHECKPOINT.md` | 12.8 KiB | 2026-10-27–2026-10-27 | DV1 / MF1 L4: ordered rite and source-pinned query | Yes (OOPS repo) | Audit/run output likely |
| 1839 | 10 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_CHECKPOINT.md` | 16.1 KiB | 2026-10-27–2026-10-29 | MR1 checkpoint: memory records (P2) | Yes (OOPS repo) | Audit/run output likely |
| 1840 | 10 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/P4_TEMPO_CHECKPOINT.md` | 4.4 KiB | 2026-10-27–2026-10-30 | P4 tempo runner (tempo fights), 2026-10-30 | Yes (OOPS repo) | Audit/run output likely |
| 1841 | 10 | `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/RV8_CHECKPOINT.md` | 6.0 KiB | 2026-10-27–2026-10-29 | RV8 checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1842 | 10 | `docs/gm/dispatch/protagonist-life-2026-10-27/LEAD_RUN_SCHEMA.md` | 10.6 KiB | 2026-10-27–2026-10-27 | Lead-run schema 1.1 (protagonist-life plan, 2026-10-27) | Yes (OOPS repo) | Idea board or mixed source |
| 1843 | 10 | `docs/gm/dispatch/quality-deep-dives-2026-11-06/PAC_REPORT.md` | 4.4 KiB | 2026-11-06–2026-11-06 | PAC lane report: pacing and feel (2026-11-06) | Yes (OOPS repo) | Audit/run output likely |
| 1844 | 10 | `docs/gm/dispatch/reference-gap-followup-2026-10-20/REPORT.md` | 7.7 KiB | 2026-10-20–2026-10-20 | Proto23 / upstream YAIR gaps: what exists now | Yes (OOPS repo) | Audit/run output likely |
| 1845 | 10 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3AE_IMPLEMENTATION_RECEIPT.md` | 6.4 KiB | 2026-10-31–2026-11-04 | KJ3AE implementation receipt: the fog at night, the underground market and the amulet stall (kjw21) | Yes (OOPS repo) | Audit/run output likely |
| 1846 | 10 | `docs/gm/dispatch/refinement-audits-2026-10-31/KJ3Q_IMPLEMENTATION_RECEIPT.md` | 11.8 KiB | 2026-10-31–2026-11-03 | KJ3Q implementation receipt: the second gathering (kjw7) | Yes (OOPS repo) | Audit/run output likely |
| 1847 | 10 | `docs/gm/dispatch/research-tech-2026-10-14/t14/PANELS.md` | 5.2 KiB | 2026-10-13–2026-10-14 | T14 panel decisions | Yes (OOPS repo) | Idea board or mixed source |
| 1848 | 10 | `docs/gm/dispatch/research-tech-2026-10-14/t14/REPORT.md` | 8.7 KiB | 2026-10-14–2026-10-14 | T14 report: revealer cheat cards | Yes (OOPS repo) | Audit/run output likely |
| 1849 | 10 | `docs/gm/dispatch/runs-and-endings-2026-10-14/r9/CHECKPOINT.md` | 2.9 KiB | 2026-10-14–2026-10-14 | R9 checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1850 | 10 | `docs/gm/dispatch/systems-cheats-expansion-2026-10-11/ASSIGNMENT.md` | 6.2 KiB | 2026-10-11–2026-10-11 | Systems and cheats expansion GM | Yes (OOPS repo) | Idea board or mixed source |
| 1851 | 10 | `docs/gm/dispatch/systems-cheats-expansion-2026-10-11/PACKETS.md` | 12.4 KiB | 2026-10-11–2026-10-11 | Finite candidate implementation packets | Yes (OOPS repo) | Idea board or mixed source |
| 1852 | 10 | `docs/gm/dispatch/traveler-asks-2026-10-14/ta3/REPORT.md` | 13.7 KiB | 2026-10-14–2026-10-14 | TA3 report: kinds, recurrence and connections | Yes (OOPS repo) | Audit/run output likely |
| 1853 | 10 | `docs/gm/dispatch/ui-foundation-2026-10-15/CHECKPOINT.md` | 19.5 KiB | 2026-10-15–2026-11-04 | UI foundation checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1854 | 10 | `docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/ui-modularity-2026-10-17.md` | 5.6 KiB | 2026-10-15–2026-10-22 | Will the UI design become modular? More to consider, 2026-10-17 | Yes (OOPS repo) | Idea board or mixed source |
| 1855 | 10 | `docs/gm/dispatch/ui-foundation-2026-10-15/R4_REPORT.md` | 15.7 KiB | 2026-10-15–2026-10-15 | R4: readable inventory, hover inspection and richer native feedback | Yes (OOPS repo) | Audit/run output likely |
| 1856 | 10 | `docs/gm/dispatch/ui-foundation-2026-10-15/SHELL_VARIANT_ACK.md` | 6.1 KiB | 2026-10-15–2026-10-15 | Proto23 Shell: read acknowledgment and preparation | Yes (OOPS repo) | Idea board or mixed source |
| 1857 | 10 | `docs/gm/dispatch/upstream-interaction-system-2026-10-20/RUNTIME_RECEIPT.md` | 12.7 KiB | 2026-10-20–2026-10-20 | IS1–IS5 runtime integration receipt | Yes (OOPS repo) | Audit/run output likely |
| 1858 | 10 | `docs/gm/dispatch/world-core-kit-2026-10-14/W1_REPORT.md` | 5.3 KiB | 2026-10-14–2026-10-14 | W1 report: readiness matrix, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1859 | 10 | `docs/gm/dispatch/world-core-kit-2026-10-14/W14_REPORT.md` | 4.9 KiB | 2026-10-14–2026-10-14 | W14 report: IO3, IO5 and IO6 | Yes (OOPS repo) | Audit/run output likely |
| 1860 | 10 | `docs/gm/dispatch/world-core-kit-2026-10-14/W16_REPORT.md` | 5.8 KiB | 2026-10-14–2026-10-14 | W16 report: comic worlds through the kit | Yes (OOPS repo) | Audit/run output likely |
| 1861 | 10 | `docs/gm/FIRST_LEVEL_BREADTH_EXTENSION_2026-10-11.md` | 13.0 KiB | 2026-10-11–2026-10-11 | First-level breadth: progression, chance and world creation | Yes (OOPS repo) | Idea board or mixed source |
| 1862 | 10 | `docs/gm/world-implementation/depth/micro/ENGINE_REQUIREMENTS.md` | 12.0 KiB | 2026-10-04–2026-10-04 | Precise micro engine requirements | Yes (OOPS repo) | Idea board or mixed source |
| 1863 | 10 | `docs/gm/world-implementation/second-pass/integration/TASK_PACKETS.md` | 19.9 KiB | mtime 2026-10-05 (no embedded date) | Ready packets, held until review | Yes (OOPS repo) | Audit/run output likely |
| 1864 | 10 | `docs/representations/RESEARCH.md` | 21.6 KiB | 2026-10-30–2026-10-30 | Research and study representation (proposals) | Yes (OOPS repo) | Idea board or mixed source |
| 1865 | 10 | `docs/research/caves-of-qud/aspects-2026-10-14/CHECKPOINT.md` | 5.7 KiB | 2026-10-14–2026-10-15 | bf-caves-of-qud checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1866 | 10 | `docs/research/dcss-dda-depth/aspects-2026-10-14/IMPLEMENTATION_PACKETS.md` | 11.9 KiB | 2026-10-14–2026-10-14 | Dungeon Crawl Stone Soup and Cataclysm: Dark Days Ahead: implementation proposals, 2026-10-14 | Yes (OOPS repo) | Idea board or mixed source |
| 1867 | 10 | `docs/research/discworld-mud/pass-2026-10-14/REPORT.md` | 9.1 KiB | 2026-10-13–2026-10-14 | Discworld MUD, second pass, 2026-10-14 | Yes (OOPS repo) | Audit/run output likely |
| 1868 | 10 | `docs/research/dwarf-fortress/emergence-2026-10-15/audit/REPORT.md` | 7.7 KiB | 2026-10-15–2026-10-15 | Dwarf Fortress: independent emergence and cleanup audit | Yes (OOPS repo) | Audit/run output likely |
| 1869 | 10 | `docs/research/dwarf-fortress/emergence-2026-10-15/round-2/extraction/UNREAD.md` | 2.9 KiB | 2026-10-15–2026-10-15 | Remaining unread after native round 2 | Yes (OOPS repo) | Idea board or mixed source |
| 1870 | 10 | `docs/research/dwarf-fortress/emergence-2026-10-15/round-3/extraction/UNREAD.md` | 2.6 KiB | 2026-10-15–2026-10-15 | Unread after the active-effect lifecycle trace | Yes (OOPS repo) | Idea board or mixed source |
| 1871 | 10 | `docs/research/free-text-worlds-2026-10-14/aspects-2026-10-14/REPORT.md` | 3.6 KiB | 2026-10-14–2026-10-14 | Free text worlds: five source families research extension | Yes (OOPS repo) | Audit/run output likely |
| 1872 | 10 | `docs/research/free-text-worlds-2026-10-14/iron-realms/REPORT.md` | 4.1 KiB | 2026-10-14–2026-10-14 | Iron Realms, Achaea first | Yes (OOPS repo) | Audit/run output likely |
| 1873 | 10 | `docs/research/hearts-of-iron-iv/aspects-2026-10-14/CHECKPOINT.md` | 4.1 KiB | 2026-10-14–2026-10-14 | HoI4 aspects checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1874 | 10 | `docs/research/hogwarts-legacy/BLUEPRINT_PASS.md` | 5.0 KiB | 2026-10-14–2026-10-14 | Blueprint evidence | Yes (OOPS repo) | Idea board or mixed source |
| 1875 | 10 | `docs/research/hogwarts-legacy/LP5_REPORT.md` | 6.7 KiB | 2026-10-14–2026-10-14 | LP5 teacher window proposal | Yes (OOPS repo) | Audit/run output likely |
| 1876 | 10 | `docs/research/LIBRARY_BUILD_ATLAS_2026-11-20.md` | 12.7 KiB | 2026-10-14–2026-11-16 | OOPS library build atlas | Yes (OOPS repo) | Idea board or mixed source |
| 1877 | 10 | `docs/research/local-ai-2026-10-14/round2/NEXT_TRIAL.md` | 10.1 KiB | 2026-10-14–2026-10-14 | Small next-trial plan | Yes (OOPS repo) | Idea board or mixed source |
| 1878 | 10 | `docs/research/magical-production-2026-10-15/REPORT.md` | 21.9 KiB | 2026-10-15–2026-10-15 | Magical production: code inspection and YAIR possibilities | Yes (OOPS repo) | Audit/run output likely |
| 1879 | 10 | `docs/research/multiworld-synthesis-2026-10-14/PACKETS.md` | 11.5 KiB | 2026-10-14–2026-10-14 | Ranked multi-world implementation packets | Yes (OOPS repo) | Idea board or mixed source |
| 1880 | 10 | `docs/research/power-systems/broad-scout/CHEAT_AND_ABILITY_DISCOURSE_2026-11-18.md` | 12.5 KiB | 2026-11-17–2026-11-18 | Cheat and ability discourse: what communities say (2026-11-18) | Yes (OOPS repo) | Idea board or mixed source |
| 1881 | 10 | `docs/research/power-systems/wiki-digests/DIGEST_path-of-exile-1-support-gems.md` | 8.8 KiB | 2026-10-10–2026-10-10 | Path of Exile 1 support gems wiki digest | Yes (OOPS repo) | Idea board or mixed source |
| 1882 | 10 | `docs/research/power-systems/wiki-digests/full-dumps/workers/bleach-full/shard-c/SUMMARY.md` | 5.8 KiB | 2023-12-27–2026-10-14 | Bleach shard-c reading summary | Yes (OOPS repo) | Idea board or mixed source |
| 1883 | 10 | `docs/research/power-systems/wiki-digests/history/pre-dump-addendum/CORRECTIONS.md` | 3.8 KiB | mtime 2026-10-10 (no embedded date) | Corrections and refinements | Yes (OOPS repo) | Idea board or mixed source |
| 1884 | 10 | `docs/research/power-systems/wiki-digests/history/pre-dump-addendum/DIGEST_path-of-exile-1-support-gems.md` | 8.8 KiB | 2026-10-10–2026-10-10 | Path of Exile 1 support gems wiki digest | Yes (OOPS repo) | Idea board or mixed source |
| 1885 | 10 | `docs/research/procedural-crafting-ui-2026-10-15/REPORT.md` | 18.3 KiB | 2026-10-13–2026-10-15 | Procedural crafting: decisions, discovery and repeatable methods | Yes (OOPS repo) | Audit/run output likely |
| 1886 | 10 | `docs/research/READING_LEVEL_REVIEW_2026-11-08.md` | 14.4 KiB | 2026-10-27–2026-11-08 | Reading levels, existing evidence and schema repair | Yes (OOPS repo) | Audit/run output likely |
| 1887 | 10 | `docs/research/remnant-2/REPORT.md` | 6.4 KiB | 2026-10-14–2026-10-15 | Remnant II: places vary, the build continues | Yes (OOPS repo) | Audit/run output likely |
| 1888 | 10 | `docs/research/RI_MOONBLADE_DAMAGE_CALIBRATION_2026-11-12.md` | 18.5 KiB | 2026-10-28–2026-11-12 | Reverend Insanity Moonblade damage and recovery | Yes (OOPS repo) | Idea board or mixed source |
| 1889 | 10 | `docs/research/rule-emergence-flow-2026-10-15/REPORT.md` | 7.9 KiB | 2026-10-15–2026-10-15 | Rules, emergence and cleanup: research continuation | Yes (OOPS repo) | Audit/run output likely |
| 1890 | 10 | `docs/research/SCIFI_AND_JOJO_PLAN_2026-10-10.md` | 5.0 KiB | 2026-10-10–2026-10-11 | Sci-fi deep dive and JoJo audit: plan | Yes (OOPS repo) | Audit/run output likely |
| 1891 | 10 | `docs/research/scroll-of-taiwu/aspects-2026-10-14/CHECKPOINT.md` | 4.8 KiB | 2026-10-14–2026-10-14 | Taiwu aspect checkpoint | Yes (OOPS repo) | Audit/run output likely |
| 1892 | 10 | `docs/research/ZLIBRARY_RESEARCH_TOOLKIT.md` | 7.7 KiB | 2026-10-11–2026-11-07 | Z-Library research toolkit | Yes (OOPS repo) | Idea board or mixed source |
| 1893 | 10 | `docs/reviews/ACCEPTANCE_PREP_2026-10-19.md` | 9.5 KiB | 2026-10-16–2026-11-04 | Acceptance prep, 2026-10-19 | Yes (OOPS repo) | Audit/run output likely |
| 1894 | 10 | `docs/reviews/CODEX_GRIPES_REVIEW_2026-10-18.md` | 12.8 KiB | 2026-10-18–2026-11-04 | Codex gripes review, 2026-10-18 | Yes (OOPS repo) | Audit/run output likely |
| 1895 | 10 | `docs/reviews/NEXT_MILESTONE_PROMPT_IMPROVEMENT_PACKET_2026-10-12.md` | 21.4 KiB | 2026-10-11–2026-11-04 | Improve the next playable-milestone prompt | Yes (OOPS repo) | Audit/run output likely |
| 1896 | 10 | `docs/reviews/ODD_POWERS_POLYJUICE_NOITA_TRACE_2026-10-13.md` | 7.7 KiB | 2026-10-12–2026-11-04 | Odd powers, Polyjuice and Noita: status trace | Yes (OOPS repo) | Audit/run output likely |
| 1897 | 10 | `docs/reviews/ui-element-audit-2026-11-10/A_CONTROLS.md` | 22.6 KiB | 2026-11-10–2026-11-10 | Element audit lane A: controls (UIC98) | Yes (OOPS repo) | Audit/run output likely |
| 1898 | 10 | `docs/worlds/chainsaw-man/MODULE_CATALOGUE.md` | 4.2 KiB | 2023-11-27–2023-11-27 | Chainsaw Man module catalogue | Yes (OOPS repo) | Audit/run output likely |
| 1899 | 10 | `docs/worlds/cheat-directions-2026-10-13/audit/README.md` | 6.1 KiB | 2026-10-13–2026-10-13 | Independent audit of cheat possibilities and procedural systems | Yes (OOPS repo) | Audit/run output likely |
| 1900 | 10 | `docs/worlds/deeper-interactions-audit-2026-10-13/README.md` | 9.5 KiB | 2026-10-13–2026-10-13 | Deeper interactions audit and extension, 2026-10-13 | Yes (OOPS repo) | Audit/run output likely |
| 1901 | 10 | `docs/worlds/demon-slayer/CAMPAIGN.md` | 6.9 KiB | mtime 2026-10-14 (no embedded date) | Campaign: a place in the night watch | Yes (OOPS repo) | Idea board or mixed source |
| 1902 | 10 | `docs/worlds/hunter-x-hunter/REVIEW.md` | 16.0 KiB | 2026-10-13–2026-10-14 | Independent review: Hunter × Hunter world pack | Yes (OOPS repo) | Audit/run output likely |
| 1903 | 10 | `docs/worlds/mother-of-learning/ZORIAN_S2_S6_SCENE_TABLE_2026-11-03.md` | 229.4 KiB | 2026-10-30–2026-11-03 | Zorian S2-S6: scene table for the actor-per-verb check, locked options and landing anchors (proposal, 2026-11-03) | Yes (OOPS repo) | Idea board or mixed source |
| 1904 | 10 | `docs/worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md` | 15.8 KiB | 2026-10-13–2026-10-13 | Skill mechanisms, means and surrounding systems | Yes (OOPS repo) | Idea board or mixed source |
| 1905 | 10 | `docs/worlds/world-core-kit-2026-10-14/cards/re-zero.md` | 8.7 KiB | 2026-10-10–2026-10-31 | World core kit: Re:Zero (2026-10-24, proposal) | Yes (OOPS repo) | Idea board or mixed source |

### Top ten source candidates to port first

These rank high by idea density and look most like deliberate design boards. The coordinator should check the live registry and existing owners before creating any new board; the registry may already expose their rows, and a port should add navigable provenance rather than duplicate them.
1. **docs/worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md** (889 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.
2. **docs/prose/PROSE_REWRITE_BACKLOG.md** (593 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.
3. **docs/worlds/world-core-kit-2026-10-14/W7_MICRO_BY_WORLD.md** (530 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.
4. **docs/gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md** (482 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.
5. **docs/GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md** (461 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.
6. **docs/gm/dispatch/protagonist-life-2026-10-27/CAST_LIVES_PLAN_2026-10-28.md** (346 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.
7. **docs/PROCEDURAL_FOUNDATION_PLAN.md** (276 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.
8. **docs/research/royal-road-2026-10-10/IDEAS.md** (258 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.
9. **docs/gm/dispatch/ui-foundation-2026-10-15/next-parts/round-15-whole-plan.md** (255 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.
10. **docs/worlds/START_MICRO_DETAILS_2026-10-14.md** (238 rows): summarize the coded proposals into a dated board just if an owner-level check finds that atlas navigation needs a consolidated, source-linked home.

## Codex outputs

A read-just filename/metadata scan of `~/Documents/Codex/*/*/` found one clearly OOPS-named retained output:

| Folder | Main file | Size / modified | Description |
|---|---|---:|---|
| `~/Documents/Codex/2026-11-02/oops-absorb/` | `report.md` | 12,007 B / 2026-11-02 | Ranked absorption notes on nine niche game repositories; ideas and implementation observations, not a board. |

The scanned matching folders `2026-10-20/discord-reference-workbench` and `2026-09-30/cultivation-idle-rpg` contained no retained Markdown main file at the inspected depth; cultivation folder held image outputs. No dedicated Codex folder named atlas, cheats, worlds, UI, or YAIR/OOPS appeared in the dated folder names. This is a filename/folder scan, not a search of every Codex session transcript.

## Discord and chat idea docs

`docs/research/DISCORD_ATLAS_DESIGN_IDEAS_2026-11-24.md` documents DY1–DY40 from `#yet-another-idle-rpg`, surfaced threads including `#Development/contributions`, `#YAFEIRPG`, `#Nekorpg`, and a second pass over `#other-general`; it explicitly says `#proto-23` was not searched. No Discord query was made for this inventory.

Other repository docs that directly contain Discord or chat idea evidence:

- `docs/research/HEAVENS_WILL_DISCORD_IDEAS_2026-11-24.md` — Heaven’s Will forum export and keyword hits, 2026-11-13 to 2026-11-24; a separate community, not YAIRPG Discord.
- `docs/research/PROTOLIKE_DISCORD_SWEEP_2026-10-24.md` — Proto-like Discord source sweep; inspect its coverage statement before porting.
- `docs/research/proto23/DISCORD_RESEARCH_2026-10-15.md` — Proto23 community research.
- `docs/research/yair-upstream/DISCORD_RESEARCH_2026-10-20.md` — upstream YAIR Discord research.
- `docs/research/yair-upstream/DISCORD_UI_ELEMENTS_REVIEW_2026-11-15.md` — later UI-focused review of upstream community material.
- `docs/audits/DISCORD_FEATURES_LEDGER_2026-11-15.md`, `docs/audits/DISCORD_ABSORPTION_CHECK_2026-10-21.md`, `docs/audits/DISCORD_RESEARCH_AND_UI_STATUS_2026-10-21.md` — routed feature ledger, absorption audit, and coverage/status.
- `docs/research/DISCORD_VISUAL_REFERENCE_SHEET_2026-11-20.md` and `.html` — image/reference documentation, not a comprehensive idea transcript.
- `docs/reviews/CLAUDE_CHAT_GRIPES_AND_NEXT_STEPS_2026-10-18.md` and `docs/audits/CODEX_CHAT_DRIFT_REVIEW*.md` — chat-originated findings and review notes, not raw source conversations.

**Known Discord coverage gaps:** the atlas-design report itself identifies `#proto-23` as unsearched. Its search window and captured channels/threads are not exhaustive; no document can be assumed to cover every channel, thread, date, or attachment. The existing research files have their own bounded corpus statements. Channels and date ranges not named in those statements remain unverified, not “empty.”

## Planning vault, scope-gated

just paths, headings and coded-item estimates are listed. The source is personal and stays external until Weibao explicitly scopes any port. No idea descriptions or body text are reproduced. Candidate matching was by filenames/headings, followed by structural code counting.

- `~/Documents/Claude/Projects/Weibao's Workspace/plans/06_Projects/Side_Projects/Game_Idea_Bank.md` — 14,977 B; headings: `Game Idea Bank`; `Personal-use game reconstruction and expansion`; `Text-based progression fantasy life simulation`; `AI and DNA idea, original concept uncertain`; `Scale-growing war and progression game`; `Weibao's words, verbatim`; `Working interpretation, not a locked specification`; `Addendum, November 17, 2026: Ebbtide reference, individual control, more to consider`; `CHANGELOG`. Estimate: 16 distinct coded tokens, likely about 16 coded idea items; confirm with an item parser before any port.

No other matching vault file was clearly an OOPS ideaboard or idea list from filename/headings. Search also surfaced general portfolio reconciliation and unrelated course/career files; excluded because their headings did not identify them as OOPS idea boards.

## Other named repositories

OOPS docs name these external project/source repositories. Paths just, per brief; no external repository contents were inspected:

- `~/code/proto23`
- `~/code/yair`
- `~/code/arkivia`
- `~/Documents/Dev/proto23`
- `~/Documents/Dev/yair`
- `~/Documents/Dev/arkivia`

The local directory scan found no matching repositories at these exact broad roots during this pass, so the entries above are source names/path candidates cited in OOPS docs, not confirmed present checkouts.

## Port plan

| Source | Proposed handling |
|---|---|
| Unregistered in-repo idea boards | Do not duplicate the parser’s existing rows by default. For the genuine ideaboards among the ranked inventory, make a concise dated summary board in `docs/ideas/` just when it adds a coherent source-level entry point; assign stable codes, summarize in original wording, and include a source path/date line. Add it to `docs/IDEA_INDEX.md`. Keep run outputs, audits, ledgers and evidence reports external and link them from an appropriate index just if they add unique navigation value. |
| Codex OOPS absorption report | Keep external as a research artifact; add a link from an appropriate research register. If its ideas are selected, summarize just the selected original design conclusions into a dated board with a source line, not a wholesale report copy. |
| Discord research | Keep bounded source docs as evidence. Port just original OOPS-facing synthesis already authored for this project, preserving source attribution and coverage limits. Avoid copy other people’s verbatim messages; use paraphrase and source doc/ID links. |
| Planning vault | Leave external until Weibao explicitly says which personal idea(s) may be ported. Then summarize just the authorized scope, keep the vault path as provenance if appropriate, and avoid importing private notes or personal wording wholesale. |
| Proto23 / YAIR / Arkivia source repos | Leave external references linked to their local/source docs. Port OOPS conclusions just through authored, attributed summaries; do not copy source text, assets, or code as part of idea inventory. |

### Privacy and authority limits

- No book text and no verbatim messages from other people in tracked files.
- The planning vault is personal: no port without Weibao’s explicit scope answer.
- This inventory proposes routes just (AD32). A proposal, source link, or registry row is not acceptance or implementation authorization.

## Checks and limits

- `node --input-type=module` importing `readIdeas()` and counting `tier !== registered && ideas >= 10`: completed; 1,905 files / 70,133 rows at this snapshot.
- Local Codex folder/file metadata listing and vault filename/heading/code-token scan: completed read-just. Vault token count is an estimate, not a parser-validated item count.
- No Discord was queried; external repo contents were not opened; no source ideas were ported.
