# DLC: shipped, entitled and described

**SHOWN:** install manifest remains build 25598304 with base depot 909662 and DLC depot 1761710. The extra directory is `Patronage Pack Digital Rewards`. Depot 1761710 is the Patronage Pack, which describes wallpapers, continent chart, art booklet and an in-game banner. It is not the Sunfire, Old Acquaintances or Heart of Ruin gameplay expansion. [Official Patronage page](https://store.steampowered.com/app/1761710/).

**SHOWN:** the installed main assembly contains expansion enums, entitlement/mount logic and shared runtime support. `DLCManager.UpdateAcquiredDLCs` distinguishes owned, loading and loaded sets, mounts content as needed, and signals changes; event category trees rebuild on DLC changes. `NeedsContentLoading` also checks remote-build/catalog flags. Steam entitlement uses the platform API; it was not invoked. No game launch or account query was made. `code/Vagrus/DLCManager.cs:15-200+`; `code/Vagrus.Data/GameEvent.cs:143+`.

Recovered shared events explicitly mention VoraxDLC in 1 event's settings, CompanionDLC in 24, TBD in 150 and TMK in 177. These are exact token counts in settings, not total playable expansion events; dependencies also occur on choices and in other data. SeekersOfKnowledge has no literal event-settings token in this scan, which does not prove absence of its content. Shared enums map these names to separate DLC versions. **INFERRED mapping:** TBD denotes the Bronze Desert expansion and TMK the later mountain expansion, based on shipped event families and official descriptions; enum labels alone do not prove the product mapping.

| Product | Systems/content added, **STATED by developer** | Installed-source support and limit |
|---|---|---|
| [Vorax](https://store.steampowered.com/app/1979380/) | Named chef companion; Supercargo role, ingredient-based meal support, loyalty quests and support combat | Recruitment and cap cases shown; every recipe/reward branch not traced |
| [Seekers of Knowledge](https://store.steampowered.com/app/2079340/) | Sunken Tower dungeon, Knowledge Ambition victory route, quests usable without that ambition, enemies and scenarios | Shared exploration and ambition architecture present; full tower rules and entitlement not verified |
| [Sunfire and Moonshadow](https://store.steampowered.com/app/2297000/) | Bronze Desert region, three factions, regional alignment/conflict story, equipment and faction rewards, new access journey | TBD-tagged event families and Outer Realms/transport-related source present; no end-to-end access or regional ending run |
| [Old Acquaintances](https://store.steampowered.com/app/2672530/) | Javek/Sedarias personal quests, deputy/combat roles; sequential rival stories; Freelancers' Guild with four specialist hirelings and one active at a time | Both recruitment graphs and cleanup read; full guild selection/replacement source not traced |
| [At the Heart of Ruin](https://store.steampowered.com/app/2672540/) | Mountain region, dense branching quests, new factions, enemies, trade/exploration challenges and obstacles | TMK-tagged families and mountaineering-related source exist; full mountain traversal/environment rules not traced |

These summaries are product descriptions, not installed behavior proof. No purchase, download or enabling action occurred. Paid expansion entitlement remains unknown; lack of a separate depot does not by itself prove that a shared-data DLC is unowned.

## Shared graph bridge

**SHOWN:** legacy choices can request `exploration` by an ID. `ExplorationManager.StartExploration` rejects a second active event, unknown registry ID and direct start of a SubEvent. It resets its own state, runs an EventController, exposes challenges, choices, treasures, stats and messages, tracks objective state and returns a result to the legacy success/failure continuation. Exit is guarded while execution is running. `code/Vagrus.Exploration/ExplorationManager.cs:160-233`; `code/EventStep.cs:1889-1900`; `code/Vagrus.Data/GameEvent.cs:1818-1869`.

**INFERRED:** shared result interfaces let a new exploration mode reuse old quest/choice outcomes without replacing every legacy story. This is a useful YAIR chain-building seam. It does not establish that every graph was executed, or that all new graph mechanics belong exclusively to one DLC.

Two developer-site fetches timed out (Heart of Ruin FAQ, new hirelings article). The route switched to official Steam product pages; neither failed page was retried. Sources were read 2026-10-14. Full pages and raw game prose were not committed.
