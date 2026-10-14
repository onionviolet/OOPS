# Status (2026-10-13 ~23:58)

| Lane | State | Commit | Notes |
|---|---|---|---|
| P1 | running, browser proof in progress | | |
| P2 | running, browser journey harness written | | |
| P3 | running, browser persistence proof in progress | | |
| P4 | done | 09403f5c | 633 tests + build pass; natural desktop proof incl. Save/reload, literal Export/Import. Open: native hourly transitions, arrival/departure cycles |
| P5 | done (resumed once) | n/a | REPORT ranks wave 2: O3 appearances, D8 lore, D3 talents, D6 secrets, D7 households |
| P6 | running (added) | n/a | creation systems, docs only |
| P7 | running (added) | n/a | book-world people/names guidelines, docs only |
| P8 | running (added 10-14) | n/a | resources/harvesting |
| P9 | running (added 10-14) | n/a | book-world generation profiles |
| P10 | running (added 10-14) | n/a | anime/original-world profiles |
| P11 | running (added 10-14) | n/a | context layer and more |
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
| CR1 | done (docs) | n/a | consumables and body response |
| CR2 | done (docs) | n/a | world crafting laws |
| CR3 | done (docs) | n/a | crafting play, automation, director tools |
| CR4 | done (docs) | n/a | makers, economy, social, npc crafters |
| CR5 | done (docs) | n/a | comic-world making, sourced check |
| CR6 | done (docs; resumed once for W4/R1 alignment) | n/a | crafting wave 2 build packet on merged code |
| P26 | done (docs) | n/a | beat templates/genres/humor |
| P27 | done (docs) | n/a | journeys/groups/death |
| P28 | done (docs) | n/a | intent/taste/writers room/onboarding |
| P30 | running | n/a | power/body/family |
| P31 | running | n/a | promises/secrets/faith |
| P32 | done (docs) | n/a | LOD/continuity/content math |
| P33 | running | n/a | rankings/media/calendar/outsiders/pacing/defeat |
| P34 | running (code); S-1 83af4bba..30430de9, S-2 6b0f1f32; wave1 landed 4e13f97f; rebase P34 onto it after its current run ends | | story spine prototype |
| P35 | done (docs) | n/a | environment/codex/sound/challenges |
| P36 | running | n/a | micro details |
| P37 | running | n/a | per-world micro texture |
| P38 | running | n/a | contract consolidation |
| P39 | running | n/a | roadmap/graph/registry |
| P40 | running | n/a | determinism hazard audit |
| WR1 | stopped 01:3x as duplicate of weaponcraft-runes-2026-10-14 R1-R3 (UI-at-scale session); resumable | n/a | weaponcrafting |
| WR2 | cancelled before launch, duplicate of R1-R3 | n/a | runes/inscriptions |
| WR3 | cancelled before launch, duplicate of R1-R3 | n/a | reveal cheats/lenses |
| WR4 | cancelled before launch, duplicate of R1-R3 | n/a | shared making abstractions |

Root integration: DONE 2026-10-14. P1-P4 combined on `proc/wave1-integration` (`ff24c75f`; report `integration/REPORT.md` on that branch) and merged into `codex/gameplay-foundations` as `4e13f97f` (base tip `1bb4884c`). Merged tree: 679/679 tests, build pass; branch browser proof 19/19 at 1366x768 + 1600x1000 incl. Save/reload and literal Import. Applied via commit-tree + incoming-path checkout; three other-session staged entries left byte-identical. Not pushed. dist/ in main checkout not rebuilt. Open: B1 P3 decks not on P1 streams, B2 P2/P4 internal draws outside P1 receipts, B3 import of saves holding P2/P4 state code-checked only, B4 P3 not casting P4 people.
