# Future download and source-read queue

Proposed refresh, 2026-10-14. Type: QUEUE. This is a routing and evidence-depth owner, not a completed-audit count or gameplay selection. See [coverage refresh](coverage-refresh-2026-10-14/REPORT.md). Entries and installed state are a timestamped snapshot and must be refreshed before execution.

## Standing authorization and boundaries

Weibao's 2026-10-13 standing task authorizes read-only source reading or decompilation of every queued game he already owns, and rerunning inventory when purchases, installs, queue entries or tools change. His 2026-10-14 wave direction also authorizes the dispatched free-source and partial-lane research listed below. No additional go-ahead is needed for those assigned read-only passes. Buying, installing, logging in, accepting terms, launching a game or touching saves is separate and is not authorized by this queue.

Each pass answers a named mechanic question and writes its assigned research lane. Raw code, game data and assets remain outside git under the lane's private research area. No code or assets are copied into YAIRPG. Follow [tool fit](REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md) and the [wave rules](../gm/dispatch/game-research-wave-2026-10-14/COMMON.md). Public/client/community evidence must remain distinct from proprietary/server source and runtime proof.

## Local inventory and tools, 2026-10-14

One Steam library root was found. Thirteen manifests were read: eleven games plus VTube Studio and Steamworks redistributables. Each has StateFlags 4 and a common/installdir directory. That proves local metadata and path presence, not account entitlement or readable Windows payloads.

| Game | Current route / status |
| --- | --- |
| Hogwarts Legacy | Installed build 20773316; bounded data/Blueprint/native pass [complete](hogwarts-legacy/CHECKPOINT.md), with explicit unread limits |
| Your Chronicle | Installed build 25001959; [finite source pass complete](your-chronicle/CHECKPOINT.md) |
| Vagrus | Installed build 25598304; [finite source pass complete](vagrus/CHECKPOINT.md) |
| Hearts of Iron IV | Build 25205862; `hoi4` dispatched, static script/DLC audit in flight |
| Idle Reincarnator | Build 21173502; `idle-reincarnator` dispatched, static Godot audit in flight |
| Academagia | Build 2453605; web dossier complete; binary audit gated because no matching Windows executable was found |
| Heaven's Vault | Build 4220136; lane gated because no matching Windows executable was found |
| Immortal Life | Build 17861603; lane gated because no matching Windows executable was found |
| The Scroll of Taiwu | Build 25845203; lane gated because no matching Windows executable was found |
| Warsim | Build 25097075; lane gated because no matching Windows executable was found |
| 100 Space Cats | Build 19025398; no lane, explicitly not dispatched because no named mechanic question exists |

NGU IDLE has no local manifest. `~/Games/yair-windows` is absent. Among Us, Roblox and VitaMahjong are present under `/Applications` with no research lane found. These three are local game candidates, not verified purchased titles. 100 Space Cats has an older explicit owned statement; this refresh did not query current account entitlement. Uninstalled ownership cannot be established from these roots alone.

Tool presence checked: `~/.dotnet/dotnet`, `~/.dotnet/tools/ilspycmd`, and `/opt/homebrew/bin/ghidraRun`. COMMON/session registry record SDK 10.0.402, ILSpy 11.1.0.9782 and Ghidra 12.1.4. Presence was checked without executing them. The old missing-.NET/ILSpy statement is obsolete. Other tools are not claimed installed or absent by this inventory.

## Current wave, in flight

[SESSIONS.md](../gm/dispatch/game-research-wave-2026-10-14/runs/SESSIONS.md) owns session IDs. [lanes.json](../gm/dispatch/game-research-wave-2026-10-14/lanes.json) owns paths and gates. Dispatched does not mean complete. A waiting lane is in flight as coordination work, not a verified running process.

| Lane | Question / route | State |
| --- | --- | --- |
| hoi4 | Decisions, focus trees, institutions, war and DLC-gated script rules | Dispatched |
| idle-reincarnator | Multi-realm reincarnation and Godot implementation | Dispatched |
| academagia-decompile | Exact exams, rolls and event data beyond web dossier | Gated on actual Windows payload |
| heavens-vault | Knowledge progress and translation/story state | Gated on actual Windows payload |
| immortal-life | Cultivation life-sim rules | Gated on actual Windows payload |
| taiwu | Inheritance, sects and cultivation life-sim rules | Gated on actual Windows payload |
| warsim | Text kingdom breadth and scope management | Gated on actual Windows payload |
| ngu-idle | Parallel progression and rebirth legibility | Gated on installed manifest and Windows payload |
| path-idle-cultivator | Implementation beyond the previous page-only/obfuscated-bundle boundary | Dispatched; old advice to avoid deobfuscation is superseded by this assigned investigation |
| discworld-2 | Remaining guild/help/wiki and taskmaster/skill/world behavior gaps | Dispatched |
| kol-2 | Path-rule differences and prior wiki/data gaps | Dispatched |
| idle-depth | Immortality Idle hells/battle/activities plus Groundhog Life later-build gaps | Dispatched; two output directories |
| idleon | Roster-wide progression and new-world systems | Dispatched; public-source route, no install implied |
| free-text-worlds | Ultima Ratio Regum; Iron Realms/Achaea; Godville; Progress Quest; Reverend Insanity playtest existence and public mechanics | Dispatched; separate game findings under one lane |
| prestige-community | Prestige Tree/community layer conventions and prior framework gaps | Dispatched |
| coverage-refresh | Coverage, inventory and exact queue reconciliation | Docs-only refresh delivered; checkpoint owns validation |
| adoption-reaudit | Prior research adoption and remaining evidence gaps | Dispatched |
| pw-intake | Province War can refer to and use relevant audits | Gated on HOI4 COMPLETE checkpoint; output belongs to Province War |

No gated-launch receipt was present in watch.state.json when checked. Gates can open after this snapshot; refresh the registry rather than assuming they stayed closed.

## Existing dossiers and remaining depth

These are logged, not “unlogged candidates.” Complete means the bounded pass, not every formula or game system. More source is read for named questions, not to maximize export size.

| Reference | Saved evidence / unread follow-up |
| --- | --- |
| [CivIdle](cividle/CHECKPOINT.md) | Core loop, prestige and saves complete; most upgrades/Great People, transport planner, server and conquest unread. Public source, no install needed |
| [Kingdom of Loathing](kingdom-of-loathing/CHECKPOINT.md) | KoLmafia source/data complete at selected scope; wiki/server boundaries remain; deeper pass in flight |
| [Discworld MUD](discworld-mud/CHECKPOINT.md) | PARTIAL official-help audit; deeper pass in flight |
| [Super Robot Wars](super-robot-wars/CHECKPOINT.md) | Series/system web pass complete; exact character conditions and route charts unread |
| [Modding Tree](modding-tree/CHECKPOINT.md) | TMT/PT core complete; Profectus/community partial; deeper pass in flight |
| [Cultivation idlers](cultivation-idlers/CHECKPOINT.md) | Cycle of the First Dawn, Infinite Dao, Idle Xanxia static passes complete; Cycle later systems remain; Path was page-only, now dispatched |
| [Immortality Idle](immortality-idle/CHECKPOINT.md) | Bounded source-only pass complete; hells/battle/activities follow-up in flight. No license established; ideas only |
| [Groundhog Life](groundhog-life/CHECKPOINT.md) | Public build complete, later build partial; later-build follow-up in idle-depth |
| [Academagia](academagia/CHECKPOINT.md) | Web-only research complete; binary lane gated, not a new purchase request based on old price text |
| [Outer Wilds](outer-wilds/CHECKPOINT.md) | Community-code/schema and developer-design pass delivered; exact vanilla completeness and DLC rules remain qualified |
| [Majora's Mask](majoras-mask/CHECKPOINT.md) | Bounded N64 static schedule/reset pass complete; full NPC census and MM3D internals unread |
| [Hogwarts games](hogwarts-games/CHECKPOINT.md) | Mystery/Legacy bounded public-page pass complete; separate Legacy shipped-data pass supersedes its old intake limitation |
| [BitLife](bitlife/CHECKPOINT.md) | Public-page pass delivered; formulas, source and platform parity unread |
| [Trimps / Antimatter Dimensions](trimps-antimatter/CHECKPOINT.md) | Bounded static reset/retention/automation pass complete; exact later rules and runtime pacing unread |
| [Noita](noita/CHECKPOINT.md) | Requested script/data audit complete in revision 3; native engine remains opaque |

Prior source/depth gates remain: Streets of Rogue original gameplay traces, Eldyn remote/server logic, Erenshor/Matchless payloads, Factorio broader native repair/use goal, ACS deeper priorities, demo/older Achra/Soulash/Magic Research 2 scope, opaque DF/ONI/Kenshi systems, Upload Labs automation payloads and Citizen Sleeper numerical graphs. This queue does not convert them into new active assignments.

## Remaining acquisition and identification candidates

No current entitlement, engine, price or availability claim is inferred from an older candidate row. Verify those facts before choosing a route. No purchase is authorized here.

| Candidate | Named question / status |
| --- | --- |
| Magical Diaries | Second magic-school life sim for school/exam comparison. SESSIONS records not owned; no lane dispatched; engine unverified |
| Songs of Syx, Stoneshard, Starsector | Systems breadth; SESSIONS records not owned, no lanes dispatched; routes unverified |
| Iron Realms, Ultima Ratio Regum, Godville, Progress Quest, Reverend Insanity playtest | Already assigned to free-text-worlds; await that checkpoint rather than duplicating acquisition |
| Cycle of the First Dawn later systems; Xianxia Simulator; other cultivation-idler variants | Preserve named unread systems/title identity checks; do not confuse Idle Xanxia with Idle Xianxia |
| Roadwarden, 80 Days, Spiritfarer | No direct lane found; historical library-cache leads only |
| Cell to Singularity, Children of Orc, Hereafter | Historical library-cache leads; identity/premise and ownership not refreshed |
| Bannerlord, Stellaris, Terra Invicta, Endless Legend 2 | Historical large-game later list; not active lanes or newly verified entitlement |
| Among Us, Roblox, VitaMahjong | Local bundles, no lanes; establish a useful mechanic question before assigning |
| 100 Space Cats | Installed, no lane. Coordinator explicitly deferred for lack of named mechanic question |

PROPOSALS remain unselected gameplay. Applying this queue refresh does not alter canon-first world priority, desktop-first UI or the one-realm/one-prestige first milestone.
