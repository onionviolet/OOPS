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
