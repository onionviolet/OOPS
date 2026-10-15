# Multi-world research dispatch, 2026-10-14

Weibao asked for HyperRogue, RetroMUD, 3 Kingdoms, Multiverse Idle UI, and deep decompilers plus auditors, with Remnant II and Kingdom Hearts still installing. Rules: the game research wave's COMMON.md and ASPECTS.md. Prompts in `lanes/`.

| Lane | Source | Route | Session id |
| --- | --- | --- | --- |
| mw-hyperrogue | HyperRogue | Open-source C++ (GitHub) | 01a13d56-4246-78a2-b38b-ea4f89e52ef7 |
| mw-siralim | Siralim Ultimate (installed) | GameMaker: UndertaleModCli, or REA if YYC | 01a13d56-40a3-7ed2-86fe-30d2c7cf5175 |
| mw-the-strange | The Strange (tabletop) | Cypher System Reference Document and public sources | 01a13d56-48f4-7951-9c9f-d74942e462c3 |
| mw-muds | RetroMUD, 3 Kingdoms | Public help and realm pages | 01a13d56-5042-75a0-89e2-d734d850b6fa |
| mw-multiverse-idle-ui | Multiverse Idle UI (not owned) | Store page, screenshots, dev posts | 01a13d56-50cc-7ea2-9d75-d5a9922d58d9 |

Gated by `runs/watch.py` (log `runs/watch.log`): mw-remnant2 (UE5, Hogwarts tool route) and mw-kingdom-hearts (OpenKH) start when Steam reports each installed; mw-audit (spot-check auditor plus synthesis) starts when every other lane is done, or after 24 h with uninstalled ones marked blocked.

Disk at dispatch: 121 GB free. Remnant II needs about 90 GB and Kingdom Hearts about 62 GB more, so both will not fit at once without freeing space.

## Library additions (2026-10-14 22:22)

Weibao: "send out one for rimworld too, other items in my library that are worth considering?" The backfill lane `bf-rimworld` had already run the RimWorld 1.7 aspect pass (watch3, 22:04). Library read offline from Steam's `userdata/*/config/librarycache` (327 games) and names from `appcache/appinfo.vdf`.

| Lane | Game | Gate | Session id |
| --- | --- | --- | --- |
| lib-rimworld-deep | RimWorld 1.7 with DLCs (Odyssey maps, Biotech genes and children, Ideology, Anomaly study, bills and blockers, storyteller) | started now | 01a13d5e-53e1-7d02-bbf2-5d799eff9873 |
| lib-bannerlord | Mount & Blade II: Bannerlord | on install (Windows, about 60 GB) | |
| lib-stellaris | Stellaris | on install (macOS) | |
| lib-roadwarden | Roadwarden | on install (macOS, small) | |
| lib-80-days | 80 Days | on install (macOS, small) | |
| lib-spiritfarer | Spiritfarer | on install (macOS) | |
| lib-terra-invicta | Terra Invicta | on install (Windows) | |
| lib-endless-legend-2 | ENDLESS Legend 2 | on install (Windows) | |
| lib-cell-to-singularity | Cell to Singularity | on install (macOS) | |
| lib-uqm | The Ur-Quan Masters | started 2026-10-14 (open source) | 01a13d6c-3235-7221-9286-1903d97aadf3 |
| lib-naev | Naev | started 2026-10-14 (open source) | 01a13d6c-325a-7893-aa1f-f7209888d2b0 |

Considered and skipped: ARK: Survival Evolved (creature breeding and mutations are relevant, but the install is very large for the disk left), multiplayer shooters and live-service games, VR titles, casino and adult titles. The watcher was restarted with these lanes; its 24 h auditor timeout restarted at 22:22.

## Remnant II deeper pass (2026-10-15)

Weibao: "What about remmenant 2 decompilation and more?" The first pass ended PARTIAL on three blockers: no validated AES key for the encrypted pak, no build-matched mappings (161 of 266 parsed outputs logged read errors), and native world selection unread. `mw-remnant2-deep` resumes the same session (01a13dfa-0d3b-7240-b0d3-da66afa8117b) with a static-only plan ([prompt](mw-remnant2.deep1.md)): key from public build lists or a static scan of the shipping executable, build-matched or statically derived mappings, REA on world and story selection, then the wider tables, dialogue and save format. Output `docs/research/remnant-2/pass-2026-10-15-deep/`; the key stays private.
