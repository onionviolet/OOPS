# Coverage reconciliation refresh, 2026-10-14

Snapshot: 2026-10-14T17:08:54.964523-04:00 (America/New_York). Docs-only reconciliation of saved evidence and local inventory. No game was launched and no account ownership was queried.

*Update 2026-10-19 (census reconciliation, D6-F3): there is no single "owned games" figure. Counts by kind: (a) dated routing snapshots, this file 78 report dirs / 63 game dossiers (2026-10-14), [reconciliation](../GAME_AUDIT_COVERAGE_RECONCILIATION_2026-10-13.md) 60 / 48 (2026-10-13), [adoption re-audit](../game-research-adoption-reaudit-2026-10-14/REPORT.md) 77 routes / 597 rows, adoption audit INVENTORY.json 69 games, deep-detail LEDGER.json 109 game rows; each counts a different thing and none is a purchase count. (b) Tracked today (`git ls-files`): 123 top-level `*/REPORT.md`, 107 `*/CHECKPOINT.md`, 124 directories with either; 63 of the 2026-10-14 game census plus later dossiers, not mechanically separable into games. (c) Local Steam appmanifests on this machine on 2026-10-19: 14, of which 12 are games (the rest are Steamworks Common Redistributables and VTube Studio): Project Zomboid, Remnant II, Potionomics, Kingdom Hearts HD 1.5+2.5, 100 Space Cats, Rain World, Caves of Qud, Hearts of Iron IV, Stardew Valley, The Scroll of Taiwu, Amazing Cultivation Simulator, Dwarf Fortress. Dossiers that record Magical Diary: Wolf Hall and Immortal Life as installed have no manifest now (uninstalled or moved; not verified). Ownership proper is not queryable from files; recorded entitlement, installed payload and research pass stay separate facts.*

**F1. The prior coverage report is no longer a complete routing index.** This pass inventories 78 direct report directories and 63 game-focused dossier directories under the explicit classification below. These are routing counts, not completed full-game audits. The earlier 60/48 totals had no saved path manifest, so their exact arithmetic cannot be reconstructed or used to date each addition. All current game-focused report paths are listed below, including every requested newer lane.

**F2. Old research status and current dispatch status are separate.** A complete finite source pass can have an in-flight deeper pass. Discworld stays PARTIAL; Path stays page-only until its new lane delivers. No wave result is inferred from a log, session ID, install flag or directory.

**F3. The local-install and tooling summaries in the acquisition queue are stale.** Eleven game manifests and two non-game manifests are present. Five new gated titles have StateFlags 4 and directories but no usable Windows executable. The no-lane local candidates are 100 Space Cats, Among Us, Roblox and VitaMahjong; only 100 Space Cats has a pre-existing explicit owned-game statement, which is historical rather than live entitlement proof.

## Ranked PROPOSALS

| Code | Proposed change | Owner touched |
| --- | --- | --- |
| P1 | Replace the stale acquisition queue with the exact draft and patch delivered here. Preserve original text in coordinator-owned dated history before applying. | FUTURE_ACQUISITION_QUEUE_2026-10-13.md |
| P2 | Route each newer dossier by its actual checkpoint depth, and keep deeper-pass status on a separate row. | Prior coverage reconciliation and research index |
| P3 | Preserve executable presence as the gate for the five paid placeholder installs; do not treat StateFlags 4 alone as readable source. | Wave coordinator and queue |
| P4 | Give 100 Space Cats a named mechanic question before assigning it; retain the three app-bundle candidates as unassigned until scope/ownership is established. | Acquisition queue |
| P5 | Fold completed wave outputs into coverage only after their checkpoint and unread table exist; Province War intake stays gated on the HOI4 checkpoint. | Wave coordinator and Province War intake |

These are documentation/routing proposals only. They select no gameplay implementation. Canon-first world order, desktop-first UI, reasonable options and the one-realm/one-prestige milestone remain unchanged.

## Newer or previously omitted game-lane reconciliation

Shown below means the current local checkpoint states the status. It does not mean this lane reran that audit. The table intentionally includes older dates where the previous aggregate omitted a useful lane, rather than asserting an unproved creation date.

| Lane | Checkpoint status, stated | Exact boundary |
| --- | --- | --- |
| [academagia](../academagia/CHECKPOINT.md) | COMPLETE, web only | About 20 wiki pages; exact internal exams/events uninspected. New binary pass is gated. |
| [bitlife](../bitlife/CHECKPOINT.md) | DELIVERED, qualified public-page research | Wiki extracts only; no internal code, exact formulas or play proof. |
| [cividle](../cividle/CHECKPOINT.md) | COMPLETE, finite static source | Core loop/prestige/saves read; most content, server, conquest and runtime unread. |
| [cultivation-idlers](../cultivation-idlers/CHECKPOINT.md) | COMPLETE for three browser-source passes; Path page-only | Cycle, Infinite Dao, Idle Xanxia read; Path bundle opaque. New Path lane in flight. |
| [discworld-mud](../discworld-mud/CHECKPOINT.md) | PARTIAL | About 45 official help pages; player wiki, formulas and canon-NPC behavior remain gaps. |
| [groundhog-life](../groundhog-life/CHECKPOINT.md) | COMPLETE for public itch build; later build PARTIAL | Later war/achievement/automation details unread; follow-up dispatched in idle-depth. |
| [hogwarts-games](../hogwarts-games/CHECKPOINT.md) | COMPLETE, bounded public pages | Mystery and Legacy overview only; historical not-installed wording superseded for Legacy by its own later pass. |
| [hogwarts-legacy](../hogwarts-legacy/CHECKPOINT.md) | COMPLETE, bounded shipped-data/Blueprint/native pass | SQLite schemas, selected Blueprint packages and one native talent-cost chain; many execution/runtime paths unread. |
| [immortality-idle](../immortality-idle/CHECKPOINT.md) | COMPLETE, bounded source-only | Activities, battle and 16 of 19 hells remained unread; follow-up in flight. |
| [kingdom-of-loathing](../kingdom-of-loathing/CHECKPOINT.md) | COMPLETE via KoLmafia data/Java | Client/community representation, not server source; wiki not read; follow-up in flight. |
| [majoras-mask](../majoras-mask/CHECKPOINT.md) | COMPLETE, bounded static research | Pinned N64 reconstruction and selected schedules/reset; no full NPC census or MM3D source. |
| [modding-tree](../modding-tree/CHECKPOINT.md) | COMPLETE TMT/PT core; community survey PARTIAL | Profectus partly read; community layers and runtime unread; follow-up in flight. |
| [noita](../noita/CHECKPOINT.md) | COMPLETE, requested bounded source pass (revision 3) | Installed scripts/data and N1-N11; native engine remains opaque. Earlier checkpoint progress is history. |
| [outer-wilds](../outer-wilds/CHECKPOINT.md) | DELIVERED, bounded community-code/design evidence | New Horizons/OWML contracts; wiki excerpts and talk abstracts only; no proprietary code or playthrough. |
| [super-robot-wars](../super-robot-wars/CHECKPOINT.md) | COMPLETE, series/system-level web research | No code/play; exact per-character conditions and route charts not verified. |
| [trimps-antimatter](../trimps-antimatter/CHECKPOINT.md) | COMPLETE, bounded static source | Selected reset/retention/automation paths; no exhaustive late-game rules or runtime pacing. |

## Complete current game-focused report census

Every direct game-focused REPORT directory in the captured scan appears once. Default entries are finite selected research, never whole-game/playable acceptance. Checkpoint links own their exact unread tables; Qud and NetHack have report-level evidence instead.

| Lane | Saved status | Qualification |
| --- | --- | --- |
| [academagia](../academagia/CHECKPOINT.md) | COMPLETE, web only | About 20 wiki pages; exact internal exams/events uninspected. New binary pass is gated. |
| [amazing-cultivation-simulator](../amazing-cultivation-simulator/CHECKPOINT.md) | COMPLETE, finite source plus DLC supplement | Five deeper priorities remain saved. |
| [ani-idle](../ani-idle/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [battle-brothers](../battle-brothers/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [bitburner](../bitburner/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [bitlife](../bitlife/CHECKPOINT.md) | DELIVERED, qualified public-page research | Wiki extracts only; no internal code, exact formulas or play proof. |
| [book-of-hours](../book-of-hours/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [caves-of-qud](../caves-of-qud/REPORT.md) | Completed five selected mechanic paths (REPORT) | No top-level CHECKPOINT; export is not whole-game reading. |
| [citizen-sleeper](../citizen-sleeper/CHECKPOINT.md) | COMPLETE, targeted source | Numerical PlayMaker instance graphs opaque. |
| [citizen-sleeper-2](../citizen-sleeper-2/CHECKPOINT.md) | COMPLETE, targeted source | Numerical PlayMaker instance graphs opaque. |
| [cividle](../cividle/CHECKPOINT.md) | COMPLETE, finite static source | Core loop/prestige/saves read; most content, server, conquest and runtime unread. |
| [crusader-kings-3](../crusader-kings-3/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [crush-crush](../crush-crush/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [cult-of-the-lamb](../cult-of-the-lamb/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [cultist-simulator](../cultist-simulator/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [cultivation-idlers](../cultivation-idlers/CHECKPOINT.md) | COMPLETE for three browser-source passes; Path page-only | Cycle, Infinite Dao, Idle Xanxia read; Path bundle opaque. New Path lane in flight. |
| [dcss-dda-depth](../dcss-dda-depth/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [disco-elysium](../disco-elysium/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [discworld-mud](../discworld-mud/CHECKPOINT.md) | PARTIAL | About 45 official help pages; player wiki, formulas and canon-NPC behavior remain gaps. |
| [dwarf-fortress](../dwarf-fortress/CHECKPOINT.md) | COMPLETE, finite selected data/source | Native simulation partly or wholly unrecovered. |
| [elin](../elin/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [endless-ascent](../endless-ascent/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [factorio](../factorio/CHECKPOINT.md) | Finite API pass complete; broader native goal UNFINISHED | Native repair/reconciliation/use still open. |
| [groundhog-life](../groundhog-life/CHECKPOINT.md) | COMPLETE for public itch build; later build PARTIAL | Later war/achievement/automation details unread; follow-up dispatched in idle-depth. |
| [hogwarts-games](../hogwarts-games/CHECKPOINT.md) | COMPLETE, bounded public pages | Mystery and Legacy overview only; historical not-installed wording superseded for Legacy by its own later pass. |
| [hogwarts-legacy](../hogwarts-legacy/CHECKPOINT.md) | COMPLETE, bounded shipped-data/Blueprint/native pass | SQLite schemas, selected Blueprint packages and one native talent-cost chain; many execution/runtime paths unread. |
| [idling-to-rule-the-gods](../idling-to-rule-the-gods/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [immortality-idle](../immortality-idle/CHECKPOINT.md) | COMPLETE, bounded source-only | Activities, battle and 16 of 19 hells remained unread; follow-up in flight. |
| [increlution](../increlution/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [keeperrl](../keeperrl/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [kenshi](../kenshi/CHECKPOINT.md) | COMPLETE, finite installed/editor-data pass | Native gameplay gaps remain; second-pass checkpoint is separate. |
| [kill-the-lich-idle](../kill-the-lich-idle/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [king-of-dragon-pass](../king-of-dragon-pass/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [kingdom-of-loathing](../kingdom-of-loathing/CHECKPOINT.md) | COMPLETE via KoLmafia data/Java | Client/community representation, not server source; wiki not read; follow-up in flight. |
| [magic-research-2](../magic-research-2/CHECKPOINT.md) | COMPLETE, browser demo snapshot | 2024 hosting snapshot, not full current retail. |
| [majoras-mask](../majoras-mask/CHECKPOINT.md) | COMPLETE, bounded static research | Pinned N64 reconstruction and selected schedules/reset; no full NPC census or MM3D source. |
| [melvor-idle](../melvor-idle/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [modding-tree](../modding-tree/CHECKPOINT.md) | COMPLETE TMT/PT core; community survey PARTIAL | Profectus partly read; community layers and runtime unread; follow-up in flight. |
| [nethack](../nethack/REPORT.md) | Representative source audit delivered (REPORT) | No top-level CHECKPOINT; selected systems only. |
| [noita](../noita/CHECKPOINT.md) | COMPLETE, requested bounded source pass (revision 3) | Installed scripts/data and N1-N11; native engine remains opaque. Earlier checkpoint progress is history. |
| [orb-of-creation](../orb-of-creation/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [outer-wilds](../outer-wilds/CHECKPOINT.md) | DELIVERED, bounded community-code/design evidence | New Horizons/OWML contracts; wiki excerpts and talk abstracts only; no proprietary code or playthrough. |
| [oxygen-not-included](../oxygen-not-included/CHECKPOINT.md) | COMPLETE, representative source | Selected scope only; no whole-native-system claim. |
| [path-of-achra](../path-of-achra/CHECKPOINT.md) | COMPLETE, bounded older build | v0.4.7, not current retail coverage. |
| [planescape-torment](../planescape-torment/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [rimworld](../rimworld/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [rogue-legacy](../rogue-legacy/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [six-ages-2](../six-ages-2/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [soulash-2](../soulash-2/CHECKPOINT.md) | COMPLETE, bounded demo data | Not full current retail or all native mechanics. |
| [streets-of-rogue](../streets-of-rogue/CHECKPOINT.md) | Fallback COMPLETE; original-source criterion UNMET | Framework/mod paths do not close original gameplay traces. |
| [sucker-for-love-crush-landing](../sucker-for-love-crush-landing/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [sunless-sea](../sunless-sea/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [sunless-skies](../sunless-skies/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [super-robot-wars](../super-robot-wars/CHECKPOINT.md) | COMPLETE, series/system-level web research | No code/play; exact per-character conditions and route charts not verified. |
| [tale-of-immortal](../tale-of-immortal/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [tales-of-maj-eyal](../tales-of-maj-eyal/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [the-lands-of-eldyn](../the-lands-of-eldyn/CHECKPOINT.md) | Wrapper pass COMPLETE; mechanics BLOCKED | Remote gameplay/server logic absent. |
| [theory-of-magic](../theory-of-magic/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [trimps-antimatter](../trimps-antimatter/CHECKPOINT.md) | COMPLETE, bounded static source | Selected reset/retention/automation paths; no exhaustive late-game rules or runtime pacing. |
| [upload-labs](../upload-labs/CHECKPOINT.md) | COMPLETE, selected installed source | Automation script-family payloads unavailable. |
| [vagrus](../vagrus/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [wildermyth](../wildermyth/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |
| [your-chronicle](../your-chronicle/CHECKPOINT.md) | Finite selected research complete/delivered | Selected static scope; no new runtime or whole-game proof. |

Excluded direct-report directories: `comics`, `fanfic`, `far-field-tropes-2026-10-08`, `game-research-adoption-audit-2026-10-13`, `idle-social-engine-scout-2026-10-06`, `jojo-audit-2026-10-11`, `library-games-2026-10-09`, `local-ai-2026-10-14`, `open-idle-games-2026-10-09`, `power-scaling-2026-10-08`, `procedural-materials-2026-10-13`, `relationships-2026-10-10`, `royal-road-2026-10-10`, `six-ages`, `steam-library-wave-2026-10-10`. This explicitly separates thematic research, audits, aggregate waves and retired Six Ages 1 intake. The open-idle aggregate still covers Progress Knight lineages, Idle Loops and Evolve; excluding it from the direct-game count does not erase that research. DCSS/DDA is one dossier for two games; cultivation-idlers and Hogwarts-games also cover more than one title. No unique-game total is inferred.

Checkpoint-only supplementary routes: [game discovery](../game-discovery-2026-10-06/CHECKPOINT.md) preserves Brogue/Shattered coverage and deeper follow-up; [Factorio native](../factorio/native/CHECKPOINT.md) and [Kenshi second pass](../kenshi/second-pass/CHECKPOINT.md) are nested scopes, not extra direct-report games.

## This wave: in flight, not completed audits

The requested SESSIONS.md was absent at the first read, then appeared and was reread successfully. This table follows that session registry plus lanes.json. “In flight” covers dispatched and waiting work, not a claim that every process is currently running. No watch.state.json existed when checked.

| Lane | State at reconciliation | Output / extra scope |
| --- | --- | --- |
| hoi4 | IN FLIGHT, dispatched session registered | `docs/research/hearts-of-iron-iv/` |
| idle-reincarnator | IN FLIGHT, dispatched session registered | `docs/research/idle-reincarnator/` |
| academagia-decompile | IN FLIGHT, gated/waiting; no launch receipt observed | `docs/research/academagia/decompile-2026-10-14/` |
| heavens-vault | IN FLIGHT, gated/waiting; no launch receipt observed | `docs/research/heavens-vault/` |
| immortal-life | IN FLIGHT, gated/waiting; no launch receipt observed | `docs/research/immortal-life/` |
| taiwu | IN FLIGHT, gated/waiting; no launch receipt observed | `docs/research/scroll-of-taiwu/` |
| warsim | IN FLIGHT, gated/waiting; no launch receipt observed | `docs/research/warsim/` |
| ngu-idle | IN FLIGHT, gated/waiting; no launch receipt observed | `docs/research/ngu-idle/` |
| path-idle-cultivator | IN FLIGHT, dispatched session registered | `docs/research/cultivation-idlers/path-of-the-idle-cultivator/` |
| discworld-2 | IN FLIGHT, dispatched session registered | `docs/research/discworld-mud/pass-2026-10-14/` |
| kol-2 | IN FLIGHT, dispatched session registered | `docs/research/kingdom-of-loathing/pass-2026-10-14/` |
| idle-depth | IN FLIGHT, dispatched session registered | `docs/research/immortality-idle/pass-2026-10-14/; also groundhog-life/pass-2026-10-14/` |
| idleon | IN FLIGHT, dispatched session registered | `docs/research/legends-of-idleon/` |
| free-text-worlds | IN FLIGHT, dispatched session registered | `docs/research/free-text-worlds-2026-10-14/; URR, Iron Realms/Achaea, Godville, Progress Quest, Reverend Insanity playtest` |
| prestige-community | IN FLIGHT, dispatched session registered | `docs/research/modding-tree/pass-2026-10-14/` |
| coverage-refresh | This report; COMPLETE on final validation only | `docs/research/coverage-refresh-2026-10-14/` |
| adoption-reaudit | IN FLIGHT, dispatched session registered | `docs/research/game-research-adoption-reaudit-2026-10-14/` |
| pw-intake | IN FLIGHT, gated/waiting; no launch receipt observed | `docs/audits/yairpg-game-research-v1/ (in Province War)` |

All seven gated lanes remain distinguished: five paid-game Windows payloads absent, NGU has no manifest, and Province War awaits the HOI4 COMPLETE checkpoint. A missing launch receipt does not prove a process cannot start immediately after this snapshot. See [session registry](../../gm/dispatch/game-research-wave-2026-10-14/runs/SESSIONS.md) and [lane manifest](../../gm/dispatch/game-research-wave-2026-10-14/lanes.json).

## Read-only local inventory

Shown: Steam libraryfolders.vdf points to one local Steam root, `/Users/weiwei/Library/Application Support/Steam/steamapps`. Read each appmanifest there, checked common/installdir, and checked `.exe` presence for gated titles. Manifests prove local recorded installation state, not purchase entitlement. No Steam account/cache login, CrossOver bottle or user-save tree was read.

| Game / app ID | Build / flags | Local payload evidence | Lane |
| --- | --- | --- | --- |
| Immortal Life / 1201230 | 17861603 / 4 | Directory exists; NO .exe matching watcher rule | immortal-life (gated) |
| Your Chronicle / 1546320 | 25001959 / 4 | Directory exists; executable/content not audited by this pass | your-chronicle (prior finite complete) |
| 100 Space Cats / 2854290 | 19025398 / 4 | Directory exists; executable/content not audited by this pass | NO LANE; explicitly not dispatched |
| Idle Reincarnator / 3779340 | 21173502 / 4 | Directory exists; executable/content not audited by this pass | idle-reincarnator (in flight) |
| Hearts of Iron IV / 394360 | 25205862 / 4 | Directory exists; executable/content not audited by this pass | hearts-of-iron-iv (in flight) |
| Academagia: The Making of Mages / 533480 | 2453605 / 4 | Directory exists; NO .exe matching watcher rule | academagia (web complete), decompile gated |
| Warsim: The Realm of Aslona / 659540 | 25097075 / 4 | Directory exists; NO .exe matching watcher rule | warsim (gated) |
| Heaven's Vault / 774201 | 4220136 / 4 | Directory exists; NO .exe matching watcher rule | heavens-vault (gated) |
| The Scroll of Taiwu : Beyond The Dome / 838350 | 25845203 / 4 | Directory exists; NO .exe matching watcher rule | scroll-of-taiwu (gated) |
| Vagrus - The Riven Realms / 909660 | 25598304 / 4 | Directory exists; executable/content not audited by this pass | vagrus (prior finite complete) |
| Hogwarts Legacy / 990080 | 20773316 / 4 | Directory exists; executable/content not audited by this pass | hogwarts-legacy (bounded complete) |

Non-game manifests: VTube Studio (1325860, build 23574781) and Steamworks Common Redistributables (228980, build 24098430), both flags 4. Neither is an unaudited game. NGU IDLE (1147690) has no manifest in the scanned root. Noita has a completed research lane but no manifest in this snapshot; prior installed wording is historical.

`/Applications` top-level entries were enumerated. Game identities were checked from bundle plists:

| App | Bundle identity / version, shown | Lane / ownership boundary |
| --- | --- | --- |
| Among Us | `com.innersloth.amongus` / 2026.8.18 | No game lane found; locally present, entitlement not verified |
| Roblox | `com.roblox.RobloxPlayer` / 0.742.0.7421053 | No game lane found; locally present, entitlement not verified |
| VitaMahjong | `com.vitastudio.mahjong` / 3.38.0 | No game lane found; locally present, entitlement not verified |

Among Us and VitaMahjong use `Wrapper/<name>.app/Info.plist`; Roblox uses `Contents/Info.plist`. PlayCover is a host app, Steam is a client, and OpenRocket is a simulation/tool app, not additional game-title evidence. Other utility/app names are retained privately rather than copied into this report. `~/Games/yair-windows` does not exist. No game source/save/asset inside those app bundles was read.

Owned/no-lane conclusion: **100 Space Cats (2854290)** is installed and was explicitly described as owned in [AUDIT_CANDIDATES](../AUDIT_CANDIDATES_2026-10-10.md); the dispatch explicitly leaves it unassigned because no mechanic question was named. **Among Us, Roblox and VitaMahjong** are local no-lane candidates, not verified purchased titles. A complete uninstalled-owned-library inventory is outside what appmanifests and app bundles can prove.

Historical leads without direct dossiers remain Roadwarden, 80 Days, Spiritfarer, Cell to Singularity, Children of Orc, Hereafter, Bannerlord, Stellaris, Terra Invicta and Endless Legend 2. The Oct. 10 cache can include free/shared entries, so these are not newly verified owned games. Erenshor and Matchless retain their old payload gates. None was silently counted as an assigned unfinished audit.

## Exact queue edits proposed, not applied

**[QUEUE_PROPOSED.md](QUEUE_PROPOSED.md) is the exact proposed full replacement** for `docs/research/FUTURE_ACQUISITION_QUEUE_2026-10-13.md`. [QUEUE_EDITS.patch](QUEUE_EDITS.patch) is its unified diff against the currently read owner. Coordinator should preserve superseded prose in dated history and reread live state before applying. Neither owner was edited here.

The replacement removes the conflicting blanket “each needs go-ahead” wording for already-authorized read-only passes; replaces the obsolete no-owned/no-tools snapshot; moves existing lanes out of “unlogged”; records all dispatched free sources and gated owned candidates; keeps unverified/not-owned candidates and exact unread follow-ups visible. Historical purchase prices and unsupported “only idler” claims are retired rather than asserted as current.

## Prior findings confirmed, corrected or extended

| Prior claim | Disposition | Current evidence |
| --- | --- | --- |
| Original 21-title set has dossier coverage | CONFIRMED as routing, not full audits | Full census and existing original-source dispatch; Streets exception retained |
| Streets original traces, Eldyn server, opaque native/depth gaps remain | CONFIRMED | Current checkpoint qualifications above; no new extraction by this lane |
| Later installed lanes supersede Oct. 9 acquisition-only synthesis | CONFIRMED | Ani/Endless/Upload/Kill/Sucker checkpoints remain their owners |
| 60 reports / 48 game directories | EXTENDED, not mechanically comparable | Captured 78 reports / 63 under explicit new classification; old list unavailable |
| Queue titles have no lanes or owned installs | CORRECTED | Newer checkpoints, manifests and wave sessions |
| Missing .NET/ILSpy requires a new install | CORRECTED | .dotnet/dotnet and .dotnet/tools/ilspycmd exist; COMMON/session registry state SDK 10.0.402 and ILSpy 11.1.0.9782 |
| StateFlags 4 means audit-ready Windows data | REJECTED for gated placeholder directories | Five executable scans returned zero matches |

## Verification and remaining boundary

Read live COMMON, PROJECT top 80, relevant USER_VISION direction, baseline reconciliation, queue, direct checkpoints and session registry. Saved private timestamped inventory plus document SHA-256s under `~/.codex/research/coverage-refresh/notes/`; `extract/HASHES.txt` hashes retained receipts. Ghidra command path and .NET/ILSpy file presence checked; no tool version executable or target game ran. Required outputs, table membership, local Markdown links and exact patch reconstruction are checked on finalization.

Remaining gates belong to other lanes: actual new source audits, missing payloads, deeper semantic reading, any YAIRPG implementation, fresh rebuilt desktop play and applicable save/reload/import. No source/build/runtime claim, purchase, install, uninstall, account action, git staging, commit or push is made.
