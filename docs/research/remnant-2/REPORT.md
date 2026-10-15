# Remnant II: places vary, the build continues

Status: PARTIAL. Read-only installed-build research, 2026-10-15. No game launch, player-save access, gameplay edits, staging or commit.

Remnant II is a strong model for a persistent build moving through varied encounters. It is weaker evidence for fully separate world power systems or portable social authority. Its reusable lesson is to give each visit authored constraints while preserving the traveler's earned options. These are research proposals, not accepted YAIRPG scope.

## What the four questions yielded

**F1, world generation.** STATED: the developer describes a hierarchy of biome order, a chosen storyline, then randomized bosses, side quests and events ([launch interview](https://news.xbox.com/en-us/2023/07/28/gunfire-games-answers-all-our-remnant-ii-questions/)). SHOWN subset: campaign world slots and tag-filtered adventure subquests exist in the installed data. The campaign also directly references Labyrinth and Root Earth quest assets. Exact native selection weights, seed use, duplicate rejection, reroll deletion and full layout constraints remain unread. The launch-era two-story description cannot be treated as a full DLC-era count.

**F2, local rules.** SHOWN: N'Erud authors fog as an overlap volume, action handler, elapsed checks and exit cleanup. Tile sets carry spawn tags, music and transition data. Losomn has Fae story and interaction families; Yaesha has Jungle story and crypt/island/jungle/ziggurat tile families; Labyrinth and Root Earth have their own tile and quest assets. Not every world's rule or faction matrix has been decoded. See [world digest](WORLD_GENERATION_AND_RULES.md).

**F3, carried growth.** STATED: archetypes can be earned and independently trained; dual archetype order selects the Prime perk ([developer breakdown](https://www.remnantgame.com/en/news/article/11537003)). SHOWN: definitions link engrams, trait type, UI and unlock tables. Traits, rings, amulets and mods have separate asset families. Exact carryover on every travel/reroll edge and relationship retention are unverified. Remnant's shared combat framework is not evidence that YAIRPG should make every world's powers interchangeable. Accepted OD2 says memory/base cheat persist; other carriers depend on world and means.

**F4, discovery.** SHOWN: EventTree exports contain item checks, choices, triggers, reward nodes and lore records. Route labels R2-S01..R2-S03 are retained privately without publishing solutions. A source-hidden item being in the payload does not establish it is rolled, discoverable or usable in a particular visit. See [narrative digest](DIALOGUE_AND_DISCOVERY.md).

## Ranked PROPOSALS

Ranks describe this source's lessons, not the current production queue. Current playable slices and desktop-first owners remain authoritative.

| Rank / ID | Proposal | Kit | Existing packet / novelty | Owner |
|---|---|---|---|---|
| 1 / R2-P01 | Preview a crossing or reroll by carrier | K15, K17, K18 | P05, P23 | docs/worlds/MULTIVERSE_STRUCTURES.md; docs/research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md |
| 2 / R2-P02 | Give a place a rule that changes a real action | K2, K5, K10, K13, K22 | P14 | docs/worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md; world law and combat owners |
| 3 / R2-P03 | Grow several earned faculties on one traveler | K3, K9, K15 | P03, P09, P17 | docs/worlds/ABILITY_AUTHORING.md; docs/TECHNOLOGY_AND_PROGRESSION.md |
| 4 / R2-P04 | Make a local conversation settle a real transaction | K6, K7, K11, K12, K29 | P19, P24 | docs/research/cross-game-synthesis-2026-10-14/PACKETS.md#p19 |
| 5 / R2-P05 | Arbitrate ambient speech before emitting it | K6, K19, K23, K32 | P21, P25 | docs/research/cross-game-synthesis-2026-10-14/PACKETS.md#p21 |
| 6 / R2-P06 | Pin a generated visit recipe with required roles | K4, K5, K12, K17, K18, K33, K34 | NEW local packet; extends P15 and P16 | docs/worlds/MULTIVERSE_STRUCTURES.md; docs/research/START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md |

## Confirm, correct, extend

| Code | Prior finding / owner | Result of this lane |
|---|---|---|
| F5 | Synthesis P05: carrier-specific reset contracts | EXTENDS. Adventure/campaign structural separation is concrete; it does not prove an engine-wide retention table. Quest-object provenance must be checked per edge. |
| F6 | Synthesis P14: rules change actual verbs | CONFIRMS in a bounded source slice. N'Erud fog has action and cleanup instructions, beyond world-specific textures. Runtime not tested. |
| F7 | Synthesis P19/P21: staged dialogue versus ambient speech | EXTENDS. EventTree choice/effect nodes and a separate conditional bark state machine support distinct roles. Do not add a second YAIRPG dialogue engine. |
| F8 | Synthesis P15/P16: generated identity and pinned definitions | EXTENDS with R2-P06. Select a visit recipe and keep its identity. Exact source recipe persistence is still unread. |
| F9 | World kit FK2: eligibility/selection/cooldown/closure is our audit contract | CONFIRMS restraint. This lane does not assert Remnant implements that entire four-part contract from names alone. |
| F10 | Start/branch integration IR4 and accepted OD2 | No proposed universal gear retention, hot branch switching or new profile wrapper is accepted here. Stronger source proof would still be a proposal. |

## Coverage and limits

The index census has 513,719 unique export paths, including 512,753 `.uasset` and 966 `.umap` paths. Seven targeted passes emitted {ev['packages']} package JSON files and {ev['exports']:,} exports; {ev['packages_with_read_errors']} packages contain logged object errors. These are serialized output counts, not successful complete parses. All 127 paths named `EventTree_*.uasset` were attempted, plus related speakers/lore items. This is not a whole-game decompile.

[Private reference store](private/REFERENCE_STORE.md) points to full available text, graph properties, partial tables, bytecode, logs and hashes under `~/.codex/research/mw-remnant2/`. Raw copyrighted material stays there. No assets or code were copied into gameplay. [Source ledger](SOURCE_LEDGER.md), [tooling](TOOLING.md), [checkpoint](CHECKPOINT.md) and [aspects](aspects-2026-10-14/ASPECTS.md) retain exact boundaries.

The prompt's main-checkout description differs from the observed branch `codex/gameplay-foundations`; no branch was switched. The requested nested-world file is actually under `docs/gm/dispatch/`; that owner was read there. No proposed owner edit was applied. Coordinator may link this dossier into synthesis after review.
