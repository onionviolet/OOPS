# Status (reconciled 2026-10-14, R3-5)

Reconciled from lane folders, `~/.codex/research/procgen-2026-10-13/<lane>.last.md` and live `codex exec` sessions. None of the 10 live Codex sessions at reconcile time belongs to a procgen lane: every lane below has finished, stopped or been cancelled. All lane folders are committed (lane returns `bc201e60`) except three P40 scan JSON files left untracked.

| Lane | State | Commit | Notes |
|---|---|---|---|
| P1 | done, merged | 7b787fdd | wave 1 integration `4e13f97f` |
| P2 | done, merged | f8fe6994 | wave 1 integration `4e13f97f` |
| P3 | done, merged | 4e444a5e | wave 1 integration `4e13f97f` |
| P4 | done, merged | 09403f5c | wave 1 integration `4e13f97f`. Open: native hourly transitions, arrival/departure cycles |
| P5 | done (resumed once) | n/a | REPORT ranks wave 2: O3 appearances, D8 lore, D3 talents, D6 secrets, D7 households |
| P6 | done (docs) | n/a | creation systems |
| P7 | done (docs) | n/a | book-world people/names guidelines |
| P8 | done (docs) | n/a | resources/harvesting |
| P9 | done (docs) | n/a | book-world generation profiles |
| P10 | done (docs) | n/a | anime/original-world profiles |
| P11 | done (docs) | n/a | context layer and more |
| P12 | done (docs) | n/a | quests/arcs/plot |
| P13 | done (docs) | n/a | canon and divergence |
| P14 | done (docs) | n/a | REPORT: top pick deed recap read by later offer (extends D8-A) |
| P15 | done (docs) | n/a | REPORT: reuse Ink seam; top pick batch lint |
| P16 | done (docs) | n/a | more story angles |
| P17 | done (docs) | n/a | story as power source |
| P18 | done (docs) | n/a | headless story QA |
| P19 | done (docs) | n/a | social web |
| P20 | done (docs) | n/a | places and settlements |
| P21 | done (docs) | n/a | conflict and economy stories |
| P22 | done (docs) | n/a | creative-director tools |
| P23 | done (docs) | n/a | inner life/ambitions/morals |
| P24 | done (docs) | n/a | knowledge/perspectives/time |
| P25 | done (docs) | n/a | presentation/export |
| CR1 | done (docs), folded into crafting palette | n/a | consumables and body response |
| CR2 | done (docs), folded into crafting palette | n/a | world crafting laws |
| CR3 | done (docs), folded into crafting palette | n/a | crafting play, automation, director tools |
| CR4 | done (docs), folded into crafting palette | n/a | makers, economy, social, npc crafters |
| CR5 | done (docs), folded into crafting palette | n/a | comic-world making, sourced check |
| CR6 | done (docs; resumed once for W4/R1 alignment), folded into crafting palette | n/a | crafting wave 2 build packet on merged code |
| P26 | done (docs) | n/a | beat templates/genres/humor |
| P27 | done (docs) | n/a | journeys/groups/death |
| P28 | done (docs) | n/a | intent/taste/writers room/onboarding |
| P30 | done (docs) | n/a | power/body/family |
| P31 | done (docs) | n/a | promises/secrets/faith |
| P32 | done (docs) | n/a | LOD/continuity/content math |
| P33 | done (docs) | n/a | rankings/media/calendar/outsiders/pacing/defeat |
| P34 | done, merged (code) | f9a95e6a | story spine S-1..S-5; merged by R3-10 `759dd393` |
| P35 | done (docs) | n/a | environment/codex/sound/challenges |
| P36 | done (docs) | n/a | micro details |
| P37 | done (docs) | n/a | per-world micro texture |
| P38 | done (docs) | n/a | contract consolidation |
| P39 | done (docs) | n/a | roadmap/graph/registry |
| P40 | done (docs); LINT_REFRESH, LINT_SCAN, SOURCE_SNAPSHOT JSON untracked | n/a | determinism hazard audit |
| WR1 | stopped 01:3x as duplicate of weaponcraft-runes-2026-10-14 R1-R3 (UI-at-scale session); not resumed | n/a | weaponcrafting |
| WR2 | cancelled before launch, duplicate of R1-R3 | n/a | runes/inscriptions |
| WR3 | cancelled before launch, duplicate of R1-R3 | n/a | reveal cheats/lenses |
| GX1 | done (docs) | n/a | comic/webtoon generation profiles |
| GX2 | done (docs) | n/a | generation-lens cheats |
| GX3 | done (docs) | n/a | subtle and overarching generation |
| GX4 | done (docs) | n/a | framework implications and abstractions |
| GX5 | done, merged (code) | cb98f67f | per-save unidentified appearances; merged by R3-10 `759dd393` |
| G1 | done, merged (code; gen-rules wave) | adaa4e18 | pure addressed generator kit, no live caller yet; merged by R3-10 `759dd393` |
| WR4 | cancelled before launch, duplicate of R1-R3 | n/a | shared making abstractions |

Root integration: DONE 2026-10-14. P1-P4 combined on `proc/wave1-integration` (`ff24c75f`; report `integration/REPORT.md` on that branch) and merged into `codex/gameplay-foundations` as `4e13f97f` (base tip `1bb4884c`). Merged tree: 679/679 tests, build pass; branch browser proof 19/19 at 1366x768 + 1600x1000 incl. Save/reload and literal Import. Applied via commit-tree + incoming-path checkout; three other-session staged entries left byte-identical. Not pushed. dist/ in main checkout not rebuilt. Open: B1 P3 decks not on P1 streams, B2 P2/P4 internal draws outside P1 receipts, B3 import of saves holding P2/P4 state code-checked only, B4 P3 not casting P4 people.

R3-10 merge: DONE 2026-10-14. `gen/g1-kit`, `proc/gx5-appearances` and `proc/p34-story-spine` combined on `proc/r3-merge` and landed on `codex/gameplay-foundations` as `759dd393` (base `6947900b`) via merge-tree, commit-tree and guarded update-ref, then incoming-path checkout in the main checkout. Merged tree: 853/853 tests, build pass, P34 lint clean and seeded replay exact; GX5 N1-N14 and P34 natural journeys pass at 1366x768 and 1600x1000 with Save/reload and literal Import. [Report](r3-merge/REPORT.md). Not pushed; main-checkout `dist/` not rebuilt. P34 S-1 partly closes B4 (storylets cast generated travelers); B1-B3 stay open.
