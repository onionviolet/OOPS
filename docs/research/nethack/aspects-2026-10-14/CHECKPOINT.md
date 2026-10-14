# bf-roguelike-src checkpoint

Status: PARTIAL

The full A01-A12 aspect grid is delivered for NetHack, DCSS, Cataclysm DDA and KeeperRL, with per-row scope labels. Partial means the named source catalogues and runtime gates below remain unread/unperformed; it does not hide a missing aspect artifact. No additional worker, clone command or install is pending. Only this lane's output directories were written. No git add/commit/push.

## Delivered

| Folder | Games | Evidence |
|---|---|---|
| [docs/research/nethack/aspects-2026-10-14](../../nethack/aspects-2026-10-14/REPORT.md) | nethack | 30 source ranges; 17 pinned source files |
| [docs/research/dcss-dda-depth/aspects-2026-10-14](../../dcss-dda-depth/aspects-2026-10-14/REPORT.md) | crawl, cdda | 57 source ranges; 28 pinned source files |
| [docs/research/keeperrl/aspects-2026-10-14](../../keeperrl/aspects-2026-10-14/REPORT.md) | keeperrl | 36 source ranges; 19 pinned source files |

Each folder includes REPORT, ASPECTS.md/.json, SYSTEM_INVENTORY, DEEPER_SYSTEMS (three per game), FINDINGS, IMPLEMENTATION_PACKETS, SMALL_TOUCHES (twenty per game), TOOLING, SOURCE_INDEX, dialogue/save digests, install decision and VALIDATION. DDA base-data census: 57,810 top-level typed records, 3,329 talk-topic records and 9,473 direct responses; zero census parse errors. Counts do not expand inline topics or certify semantics.

## Pins and private evidence

| Game | Commit |
|---|---|
| NetHack | `49b203ed83334c8a0f05024212f98675e51432cb` |
| Dungeon Crawl Stone Soup | `c4298273a49c6601be4e1c9b79d4aba43f9aa603` |
| Cataclysm: Dark Days Ahead | `ef31b1fc84c640f97a5547a5b76a6ba5e9e97847` |
| KeeperRL | `95d2be4e97db2243210a71918e36a533ad94dcd1` |

Private work area: `/Users/weiwei/.codex/research/bf-roguelike-src`. Disk used: 441244 KiB at final check. Full selected source/text extracts, Git tree manifests, dialogue conditions and hashes remain under `extract/`; complete clones under `repos/`. Artifact/census code is `tools/build_reports.py`; final independent checks are `tools/finish_reports.py`. 74 extract hashes checked. No old private workspace was modified.

## Unread table and why

No full-repository semantic or active-build claim is made. The source-module and directory censuses enumerate inventory-only units. This table names the known system gaps; each partial aspect states its more exact route limit. A later worker should choose one useful gap rather than treat all optional systems as a new YAIR gate.

| Game | Unread / partial family | Why / next bounded read |
|---|---|---|
| NetHack | Command dispatch and turn loop | new A03, command catalogue unread; select a caller-to-result route if needed. |
| NetHack | Monster movement and item AI | partial A05; select a caller-to-result route if needed. |
| NetHack | Pets and food suitability | prior REPORT; not fully reread; select a caller-to-result route if needed. |
| NetHack | Items and contextual use | prior REPORT; catalogue unread; select a caller-to-result route if needed. |
| NetHack | Equipment, wear and wield | UNREAD in this pass; select a caller-to-result route if needed. |
| NetHack | Spell learning and effects | prior selected report; broader catalogue unread; select a caller-to-result route if needed. |
| NetHack | Shops and billing | UNREAD beyond chat price entry; select a caller-to-result route if needed. |
| NetHack | Religion, sacrifice and alignment | UNREAD; select a caller-to-result route if needed. |
| NetHack | Dungeon topology and special levels | partial A07; select a caller-to-result route if needed. |
| NetHack | Randomness and luck | new partial A08; select a caller-to-result route if needed. |
| NetHack | Rumors, consultation and encyclopedia | located; payment/lore catalogue UNREAD; select a caller-to-result route if needed. |
| NetHack | Polymorph and body rules | UNREAD; select a caller-to-result route if needed. |
| NetHack | Bones and cross-run remnants | UNREAD; select a caller-to-result route if needed. |
| NetHack | Map visibility and pathfinding | UNREAD; select a caller-to-result route if needed. |
| NetHack | Traps, digging and environment | prior environment overview; detailed rules UNREAD; select a caller-to-result route if needed. |
| NetHack | Window ports and UI settings | reference-only A06; port rendering UNREAD; select a caller-to-result route if needed. |
| NetHack | Objects and creature definitions | catalogue UNREAD; select a caller-to-result route if needed. |
| NetHack | Platform, build, tools and tests | UNREAD; not executed; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Hints and tutorial | new hints; full tutorial UNREAD; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Monster energy and tactical AI | energy read; tactical catalogue UNREAD; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Runes, access and endings | prior REPORT; fresh full route UNREAD; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Actor holds and attacks | prior selected report; broader combat UNREAD; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Spells and abilities | UNREAD beyond prior casting work; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Religion and piety | UNREAD; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Mutations, species and forms | UNREAD; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Items, artefacts, brands and shops | prior brand route; most UNREAD; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Level generation and vaults | inventory only; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Level branches and portals | inventory only; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Ghosts and bones | located in files.cc; lifecycle UNREAD; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Tiles, web and terminal UI | UNREAD runtime layout; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Sound, sight and environment | UNREAD; select a caller-to-result route if needed. |
| Dungeon Crawl Stone Soup | Tests, platform and build tools | UNREAD; not executed; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Achievements and conducts | prior REPORT; full fresh engine UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | JSON loading and mod data | loader selected; dependency ordering UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | NPC needs, activity and combat AI | selected results/needs; broader UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Mission lifecycle and diary | identity entry selected; full closure UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Sidebar widgets and UI | partial A06; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Tutorial and contextual help | lesson enum selected; full triggers UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Activities, jobs and reservations | prior selected practice; broader UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Skills and proficiencies | prior selected depth; catalogue UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Martial arts and combat | prior REPORT; fresh full route UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Vehicles and power | UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Mutation and bionics | UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Body, needs, medicine and food | UNREAD; no YAIR hunger death proposal; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Item uses and pockets | UNREAD beyond practice data; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Overmap, hordes and settlements | turn-loop entries selected; full lifecycle UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Map generation, terrain and fields | inventory only; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Weather and ecology | UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Monsters, weakpoints and attacks | prior death event; broader UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Worlds, dimensions and optional mods | inventory only; not all loaded together; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Input, accessibility and translations | UNREAD; select a caller-to-result route if needed. |
| Cataclysm: Dark Days Ahead | Tests and build support | UNREAD; not executed; select a caller-to-result route if needed. |
| KeeperRL | Campaign generation and travel | prior world access; full generation UNREAD; select a caller-to-result route if needed. |
| KeeperRL | Level generation and layouts | inventory only; select a caller-to-result route if needed. |
| KeeperRL | Spell schools and effects | prior availability; full effects UNREAD; select a caller-to-result route if needed. |
| KeeperRL | Resources, stock and trade | prior funded paths; broader UNREAD; select a caller-to-result route if needed. |
| KeeperRL | Visibility, memory and navigation | UNREAD beyond serialized fields; select a caller-to-result route if needed. |
| KeeperRL | Desktop GUI and map | selected A06; runtime layout UNREAD; select a caller-to-result route if needed. |
| KeeperRL | Achievements and account unlocks | new local profile A12; Steam runtime UNREAD; select a caller-to-result route if needed. |
| KeeperRL | Retirement and shared sites | inventory/entry only; network UNREAD; select a caller-to-result route if needed. |
| KeeperRL | Player and team control | prior agents; full control variants UNREAD; select a caller-to-result route if needed. |
| KeeperRL | Free configuration families | family census below; most records UNREAD; select a caller-to-result route if needed. |
| KeeperRL | Media, libraries and platform builds | inventory only; no builds or commercial media; select a caller-to-result route if needed. |
| All four | Runtime UI, pacing, balance, crash recovery and save/reload/import | Source-only task prohibits game launch/save access. Optional later play observations are in each INSTALL_DECISION.md. |
| All four | Uncited module semantics and optional content | Complete module/directory counts are discovery coverage only; no whole-source semantic claim. |

## Checks and resume

[VALIDATION](VALIDATION.json) passes: all fixed aspect keys, required artifacts, per-game provenance, JSON parse, local links, source bounds/SHA-256 and exact Git blob match. Extract hashes match. These are artifact/source checks, not tests of any game or YAIRPG implementation. Known KeeperRL case collision is recorded and excludes build correctness.

Next pending item: none inside the delivered representative aspect grid. Optional continuation starts from a named unread row, using the pinned clone and an explicit bounded route. No installation is necessary for that source work. Runtime implementation, new saved fields and rebuilt desktop/browser acceptance need a later assignment; proposals are not decisions.
