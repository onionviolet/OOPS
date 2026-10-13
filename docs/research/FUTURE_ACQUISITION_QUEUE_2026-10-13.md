# Future download and decompile queue

2026-10-13. Type: QUEUE, proposal only. Lists reference games that have no research lane yet, or whose lane names a follow-up pass. Being listed does not authorize a purchase, download, install or decompile; each one needs Weibao's go-ahead. Follow [reverse-engineering tool fit](REVERSE_ENGINEERING_TOOL_FIT_2026-10-13.md): run a pass only to answer a named mechanic question, not to have a full export.

Engine and build notes marked *unverified* are my own background knowledge, not checked this session. Confirm them before choosing a route.

## Standing task (Weibao, 2026-10-13)

Decompile or source-read every queued game Weibao already owns. Re-run the local inventory and do this again whenever things change: a new purchase, a new install, a new queue entry or a new local tool. Owned games need no further go-ahead for a read-only local pass. Buying a game still needs his explicit yes. Each pass still answers a named mechanic question and saves a lane under `docs/research/<game>/`; raw decompiled code and assets stay out of git.

## Short list

**Decompile (closed builds, each needs a purchase go-ahead):**

1. **Academagia**: exact exam, roll and event tables for a Harry Potter school year. .NET 4.0, ILSpy. Run only if its P2 or P4 is accepted.
2. **The Scroll of Taiwu**: inheritance, sects and a deep cultivation life sim. Unity *unverified*.
3. **Magical Diaries**: a second magic-school life sim to cross-check Academagia. Unity *unverified*.
4. **Idle Reincarnator**: the only found idler with several realms inside one reincarnation loop. Engine *unverified*.
5. **Heaven's Vault**: knowledge-as-progress. Its ink story scripts may be readable without decompiling *unverified*.

**More, no decompile needed (public play, wikis or source):**

1. **Kingdom of Loathing**: 20 years of text-RPG variety.
2. **Discworld MUD**: a licensed book world run as a living game.
3. **Super Robot Wars**: how dozens of franchise canons share one campaign.
4. **The Modding Tree**: open-source framework for layered prestige.
5. **Cultivation idlers** (Cycle of the First Dawn, Path of the Idle Cultivator, Infinite Dao): browser builds, read the JS.

## Follow-ups from the 2026-10-13 lanes

| Game | Lane | Pass value | Route | Gate |
|---|---|---|---|---|
| Academagia | [academagia](academagia/CHECKPOINT.md) | Moderate, only if its P2 (exams) or P4 (adventures) is accepted | Buy ($15.99, Steam 533480); ILSpy on .NET 4.0 assemblies plus the 2010 mod-tool data | Purchase decision |
| Groundhog Life | [groundhog-life](groundhog-life/CHECKPOINT.md) | Low; already read from public JS | Optional static read of the remaining ~3k lines of the later build | None beyond time |
| Immortality Idle | [immortality-idle](immortality-idle/CHECKPOINT.md) | Low to moderate; full source is public | Read unread areas (hells, battle, activities) if F11/F12 is wanted | None; no license, so ideas only |

## Unlogged candidates, ranked by expected design payoff

| Rank | Game | Why | Likely route |
|---:|---|---|---|
| 1 | Kingdom of Loathing | Text RPG that stayed varied for 20 years; item, skill and class breadth | Public wiki and play; no decompile |
| 2 | Discworld MUD | Licensed book world run as a living text game for decades; canon as world events | Public play, help files and wiki; no decompile |
| 3 | Super Robot Wars series | Dozens of franchises per game with canon beats kept while the player diverges | Public wikis and scenario guides; console games, no decompile |
| 4 | Idle Reincarnator | Multi-realm reincarnation idler (Steam, June 2025) | Buy; engine *unverified* |
| 5 | The Scroll of Taiwu | Deep cultivation life sim with inheritance and sects | Buy; Unity *unverified*, ILSpy if Mono |
| 6 | Magical Diaries | Magic-school life sim; second Harry Potter-adjacent reference after Academagia | Buy; Unity *unverified* |
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
