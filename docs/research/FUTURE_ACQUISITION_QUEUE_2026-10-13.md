# Future download and decompile queue

Created 2026-10-13; routing refreshed 2026-10-18. Type: QUEUE, proposal only.
Being listed does not authorize purchase, download or install. The standing task
below already authorizes read-only local source/decompile passes for owned queued
games. Follow [reverse-engineering tool fit](REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md):
answer a named mechanic question rather than collecting a full export.

## Current routing, 2026-10-18

This table supersedes dated buy/install recommendations below. It uses saved
research receipts, not a fresh Steam entitlement/tool inventory. Recorded ownership,
installed payload, source coverage and gameplay acceptance are separate facts.

| Code | Source or group | Latest saved evidence | Next queue action |
|---|---|---|---|
| AQ1 | Academagia, Heaven's Vault, Immortal Life, The Scroll of Taiwu, Warsim, Idle Reincarnator | [October 14 wave results](../gm/dispatch/game-research-wave-2026-10-14/runs/SESSIONS.md) record finite PARTIAL research passes with named unread tables. Immortal Life and Taiwu installed after the initial waiting snapshot. | Recover each lane's checkpoint/unread scope; purchase/install is not a prerequisite for repeating those recorded local passes. No full-source-complete claim. |
| AQ2 | NGU IDLE, Legends of Idleon, public/reference follow-ups | [Wave record](../gm/dispatch/game-research-wave-2026-10-14/runs/SESSIONS.md) contains later passes beyond the original free-title wishlist. | Reuse existing lanes, then name an unanswered mechanic before another pass. |
| AQ3 | Magical Diaries, Songs of Syx, Stoneshard, Starsector | Not owned in the October 14 wave record; present entitlement unverified. Update 2026-10-19: Magical Diary: Wolf Hall is installed and was source-read (decoded payload, marker WolfHall-1.1.10; [REPORT](magical-diary-wolf-hall/REPORT.md), [CHECKPOINT](magical-diary-wolf-hall/CHECKPOINT.md)); drop it from this row. The other three remain unverified. | Check ownership before proposing acquisition; purchase/download still needs authorization. |
| AQ4 | Canon-world media | [Media priorities](SOURCE_DEEP_DIVE_PLAYBOOK.md#weibaos-media-priorities-2026-10-18): games/sourcebooks/databooks high, side stories next, anime deferred. The shortlist retains unverified edition/availability labels. | Check saved/local sources first; use the shortlist when its world/mechanic is selected. |

Update 2026-10-19, completed since the historical lists below (dossier folders verified to exist): [Kingdom of Loathing](kingdom-of-loathing/), [Discworld MUD](discworld-mud/), [Super Robot Wars](super-robot-wars/), [Modding Tree](modding-tree/), [cultivation idlers](cultivation-idlers/). Their rows in the historical short list, follow-ups and ranking are done as finite passes, not full-source-complete. Unapplied queue proposals (Vintage Story, TerraFirmaCraft, Kittens, Sims 4 free source reads from [feature scout E1/E2](feature-game-scout-2026-10-14/REPORT.md); `coverage-refresh-2026-10-14/QUEUE_EDITS.patch`) are not rows here; adding them is Weibao's or the queue owner's call. Game counts: see the [census note](coverage-refresh-2026-10-14/REPORT.md).

No new inventory, acquisition or source-reading run was performed by this refresh.
The October 13 tool list and October 14 installation observations below are dated
history, not present machine state. [Refresh record](../reviews/QUEUE_REFRESH_2026-10-18.md).


Engine and build notes marked *unverified* are my own background knowledge, not checked this session. Confirm them before choosing a route.

## Standing task (Weibao, 2026-10-13)

Decompile or source-read every queued game Weibao already owns. Re-run the local inventory and do this again whenever things change: a new purchase, a new install, a new queue entry or a new local tool. Owned games need no further go-ahead for a read-only local pass. Buying a game still needs his explicit yes. Each pass still answers a named mechanic question and saves a lane under `docs/research/<game>/`; raw decompiled code and assets stay out of git.

**Historical inventory run, 2026-10-13:** none of the 12 queued paid games is owned or installed, so no decompile pass ran. Installed games already have lanes. Local RE tools: Ghidra 12.1.4 (Homebrew, with keg-only openjdk@21), `strings`, `otool`. Not installed: dotnet, ILSpy/ilspycmd, a runnable Cpp2IL, AssetRipper, Java decompilers, UndertaleModTool. A .NET or Unity pass would first need dotnet plus ilspycmd.

**Inventory run, 2026-10-14 17:00:** newly owned on Steam: Academagia, Heaven's Vault, Immortal Life, The Scroll of Taiwu, Warsim and Idle Reincarnator; Hearts of Iron IV and 100 Space Cats are installed. Only Idle Reincarnator and HoI4 have payloads; the rest are Windows-only and install through the macSteam `notproton` compatibility tool (Taiwu so far has only its soundtrack DLC). `ilspycmd` 11.1 is now installed with dotnet SDK 10 in `~/.dotnet`. Lanes and gates: [game research wave](../gm/dispatch/game-research-wave-2026-10-14/runs/SESSIONS.md). By 17:26 Academagia, Heaven's Vault, Warsim and NGU IDLE had Windows payloads and their lanes started; Taiwu and Immortal Life were still downloading. A full rewrite of this queue is proposed in [coverage refresh](coverage-refresh-2026-10-14/QUEUE_EDITS.patch); its install rows predate those payloads, so it is not applied.

**Free titles to consider** (on the account, not installed; Windows-only, so they need CrossOver or a Windows host plus a download go-ahead):

| Rank | Game | Question it would answer |
|---:|---|---|
| 1 | Legends of Idleon | How each new world introduces a distinct system across one character roster |
| 2 | NGU IDLE | How 10+ parallel progression systems unlock in order and stay legible across rebirths |
| 3 | CivIdle | Age/tech prestige and production-chain offline catch-up. Official source is public ([fishpondstudio/CivIdle](https://github.com/fishpondstudio/CivIdle), GPL-3.0), so no install is needed; lane `cividle` started 2026-10-13 |
| 4 | Reverend Insanity playtest | How a licensed cultivation-novel adaptation turns Gu rules into game state; access may have closed |

## Historical short list, 2026-10-13

**Decompile (closed builds, each needs a purchase go-ahead):**

1. **Academagia**: exact exam, roll and event tables for a Harry Potter school year. .NET 4.0, ILSpy. Run only if its P2 or P4 is accepted.
2. **The Scroll of Taiwu**: inheritance, sects and a deep cultivation life sim. Unity *unverified*.
3. **Magical Diaries**: a second magic-school life sim to cross-check Academagia. Unity *unverified*. (Update 2026-10-19: owned and source-read as Wolf Hall, Ren'Py; see [REPORT](magical-diary-wolf-hall/REPORT.md). No purchase needed.)
4. **Idle Reincarnator**: the only found idler with several realms inside one reincarnation loop. Engine *unverified*.
5. **Heaven's Vault**: knowledge-as-progress. Its ink story scripts may be readable without decompiling *unverified*.

**More, no decompile needed (public play, wikis or source):**

1. **Kingdom of Loathing**: 20 years of text-RPG variety.
2. **Discworld MUD**: a licensed book world run as a living game.
3. **Super Robot Wars**: how dozens of franchise canons share one campaign.
4. **The Modding Tree**: open-source framework for layered prestige.
5. **Cultivation idlers** (Cycle of the First Dawn, Path of the Idle Cultivator, Infinite Dao): browser builds, read the JS.

## Historical follow-ups from the 2026-10-13 lanes

| Game | Lane | Pass value | Route | Gate |
|---|---|---|---|---|
| Academagia | [academagia](academagia/CHECKPOINT.md) | Moderate, only if its P2 (exams) or P4 (adventures) is accepted | Buy ($15.99, Steam 533480); ILSpy on .NET 4.0 assemblies plus the 2010 mod-tool data | Purchase decision |
| Groundhog Life | [groundhog-life](groundhog-life/CHECKPOINT.md) | Low; already read from public JS | Optional static read of the remaining ~3k lines of the later build | None beyond time |
| Immortality Idle | [immortality-idle](immortality-idle/CHECKPOINT.md) | Low to moderate; full source is public | Read unread areas (hells, battle, activities) if F11/F12 is wanted | None; no license, so ideas only |

## Historical candidate ranking, 2026-10-13

| Rank | Game | Why | Likely route |
|---:|---|---|---|
| 1 | Kingdom of Loathing | Text RPG that stayed varied for 20 years; item, skill and class breadth | Public wiki and play; no decompile |
| 2 | Discworld MUD | Licensed book world run as a living text game for decades; canon as world events | Public play, help files and wiki; no decompile |
| 3 | Super Robot Wars series | Dozens of franchises per game with canon beats kept while the player diverges | Public wikis and scenario guides; console games, no decompile |
| 4 | Idle Reincarnator | Multi-realm reincarnation idler (Steam, June 2025) | Buy; engine *unverified* |
| 5 | The Scroll of Taiwu | Deep cultivation life sim with inheritance and sects | Buy; Unity *unverified*, ILSpy if Mono |
| 6 | Magical Diaries | Magic-school life sim; second Harry Potter-adjacent reference after Academagia | Buy; Unity *unverified* (Update 2026-10-19: owned, source-read; no purchase) |
| 7 | Immortal Life | Cultivation life sim | Buy; engine *unverified* |
| 8 | Heaven's Vault | Knowledge-as-progress through translation | Buy; inkle game, Unity plus ink *unverified* |
| 9 | The Modding Tree / Prestige Tree | Framework for layered prestige | Open source; read directly |
| 10 | Cultivation idlers: Cycle of the First Dawn, Idle Xianxia, Path of the Idle Cultivator, Infinite Dao, Xianxia Simulator | Cultivation-world loop variants | Browser builds where public; read JS. Idle Xianxia is on Steam early access |
| 11 | Iron Realms MUDs (Achaea and others) | Text-world professions, politics, housing and economies at scale | Public play and help files |
| 12 | Warsim: Realm of Aslona | Huge single-developer text kingdom sim; scope management | Buy; engine *unverified* |
| 13 | Ultima Ratio Regum | Procedural history and culture generation | Free download; engine *unverified* |
| 14 | Songs of Syx, Stoneshard, Starsector | Systems-breadth references | Buy; Starsector data and Java are moddable *unverified* |
| 15 | Godville, Progress Quest | Zero-player idle extremes | Public play; Progress Quest source is public *unverified* |

The 2026-10-13 candidate list and scope-comparison discussion happened in chat. This file is now the owner of that queue.

## Source media shortlist for canon-first worlds, 2026-10-18

Weibao: "What games, data books and more and stuff should we put on shortlist to obtain?"
Follows his media priorities (SM5 games, SM6 sourcebooks, SM7 databooks high; SM9 side
stories next; anime deferred) in the [source playbook](SOURCE_DEEP_DIVE_PLAYBOOK.md#weibaos-media-priorities-2026-10-18).
Proposal only; every purchase or download needs his yes. Titles and contents are
**MEMORY, unverified**: confirm edition, language and availability before choosing a route.
Ordered by the canon-first world order in PROJECT.md, then by value for mechanics.

**Tier 1, free or already public (no purchase):**

| Rank | Source | World | Why |
|---:|---|---|---|
| 1 | D&D System Reference Document 5.2 (CC-BY-4.0) | D&D | Official rules, spells, monsters and items under an open license; rules to engine is nearly direct |
| 2 | Weaver Dice (Wildbow's tabletop rules) | Worm | The author's own power-classification and trigger rules as a game system |
| 3 | Atlas Academy FGO game data (public database and API) | Fate | Servant parameters, skills and Noble Phantasm data already as numbers |
| 4 | Author Q&A collections: Mother of Learning (Reddit), Worm word-of-God, Cuttlefish Q&A for LOTM | MoL, Worm, LOTM | SM7 author statements; record date and conflicts |
| 5 | Fate/stay night [Remastered] text, if owned | Fate | Visual novel script holds the route rules and servant stat screens |

**Tier 2, databooks and material books (purchase, often Japanese, so LM3 route):**

| Rank | Source | World | Why |
|---:|---|---|---|
| 1 | Fate/complete material I-IV (Type-Moon) | Fate | Servant stat sheets (parameter ranks, skills); near-mechanical |
| 2 | Naruto Hiden databooks (Rin, Tō, Hyō, Sha no Sho) | Naruto | Per-character stat parameters, jutsu entries, ranks |
| 3 | Bleach SOULs., MASKED, UNMASKED (and later VIBEs) | Bleach | Character stats, zanpakutō, Gotei structure |
| 4 | Jujutsu Kaisen official fanbook | JJK | Technique and grade details, author answers |
| 5 | Hunter x Hunter Hunter's Guide | HxH | Nen categories and character data |
| 6 | Fullmetal Alchemist Profiles and Perfect Guidebooks | FMA | Alchemy rules, state military structure |
| 7 | Fantastic Beasts and Where to Find Them, Quidditch Through the Ages, Tales of Beedle the Bard | Harry Potter | In-universe canon reference books: creatures, sport rules, folklore (also SM9-style texture) |
| 8 | D&D 2024 Player's Handbook, Dungeon Master's Guide, Monster Manual | D&D | Beyond the SRD: full classes, settlement and treasure tables |

**Tier 3, official games (SM5; decompile or data-read only if owned):**

| Rank | Game | World | Why |
|---:|---|---|---|
| 1 | Baldur's Gate 3 | D&D | 5e rules implemented as data; readable game data files |
| 2 | Hogwarts Legacy | Harry Potter | Spell, potion, plant and beast tables, school routine; game-original content labeled adaptation |
| 3 | Bleach Brave Souls / Solo Leveling: Arise / JJK Phantom Parade | Bleach, Solo Leveling, JJK | Gacha stat data, often mirrored on public wikis; read the wiki first |
| 4 | Reverend Insanity playtest (already queued above) | Reverend Insanity | Licensed Gu rules as game state; access may have closed |

**Gaps.** No official games or databooks are known for TTKS, A Soldier's Life,
Shadow Slave, Reincarnation Paradise, Mother of Learning or Cradle; their best
SM7 route is author Q&A, and SM9 is any side stories or extras.

**Inventory check 2026-10-18.** Installed Steam games include The Scroll of Taiwu,
Amazing Cultivation Simulator, Caves of Qud, Dwarf Fortress, Potionomics and
Stardew Valley; none of the Tier 3 titles is installed. Owned-but-uninstalled titles
were not checked.

**Next sources, recommendation 2026-10-18 (proposal).** Weibao asked "what's the best
source material that we need next?" Nothing new blocks the current build target (early
LOTM Seer slice, Cyoria pack): the LOTM novel is already in the local Calibre library.
Ranked by value per cost: (1) D&D SRD 5.2.1, free under CC-BY-4.0, version-locked per the
[tabletop sweep](TABLETOP_BOOK_SWEEP_2026-10-14.md); (2) LOTM side stories and extra
chapters for the SM9 daily-life pass, checking the local copy first; (3) the three Harry
Potter in-universe books. Fate material books follow when Fate becomes active; anime-world
databooks wait for their place in the canon-first order. Download needs Weibao's yes.
