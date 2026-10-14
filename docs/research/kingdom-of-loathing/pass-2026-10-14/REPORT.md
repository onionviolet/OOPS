# Kingdom of Loathing: path rules and shared grammar

2026-10-14, lane `kol-2`. Research only. No YAIRPG implementation or playable acceptance is claimed.

KoL gets new uses from old content in three ways: it changes which tools are legal, changes what existing tools do, or changes the objective those tools serve. It also builds genuinely new mechanisms, such as familiar-team combat and configurable robot bodies. The useful lesson is a common content vocabulary with room for explicit custom handlers. A universal stat table alone does not explain these paths.

**F1, SHOWN:** KoLmafia has 57 path-enum entries: no-path, three dietary paths, Standard, 51 special challenge paths, and Bad Moon (represented as a sign). There are 24 points preferences, not 23. A points preference is not itself proof of a reward or its earning conditions. The data-only extractor read Java as text; it never ran KoLmafia. [Path metadata](PATH_METADATA.md).

**F2, STATED:** archive.org captures of both wiki hosts were read. The 2018, October 2023 and August 2026 indexes give rules, rewards and later aftercore differences. Individual archived pages supply exceptions where available. Each source retains its snapshot date. [Path digest and remaining gaps](PATH_RULES.md), [source ledger](SOURCE_LEDGER.md).

**F3, SHOWN / STATED:** the common Council quests are a reusable spine, not a universal one. Community Service replaces them with 11 stat-priced services. The Sea path sends the player through underwater content to a different sorceress. Bugbear Invasion swaps the final route; Exploathing changes access and quest availability. [August 2026 index](https://web.archive.org/web/20260822021427/https://wiki.kingdomofloathing.com/Special_challenge_path), [quest and grammar digest](SHARED_GRAMMAR.md).

**F4, SHOWN:** items, skills and effects use stable identifiers and typed fields, with a shared modifier layer. The pinned data has 12,098 item rows, 3,014 effect rows, 1,651 skill rows, 2,389 monster rows, 601 adventure rows and 324 familiar rows. These are client data records, not an exhaustive census of live game content. The modifier file has 13,369 data rows, 39 source types and 258 distinct fields under a parser that respects quoted values and bracketed expressions. [Grammar digest](SHARED_GRAMMAR.md).

**F5, INFERRED:** an item's identity, acquisition, legal use, transformed properties and aftercore survival are separate questions. A path can loan a tool, ban its use, reinterpret its stats or convert it at exit. This separation is the strongest reusable design result. No server code or live run was inspected.

## Ranked PROPOSALS for YAIRPG

All proposals remain unaccepted. Suggested owner edits belong to the coordinator, not this lane. Keep each reasonable rule model reachable. KoL's commercial rotation, competitive limits and one-time rewards do not become YAIRPG policy.

| Rank / code | Proposal and player result | Existing owner / seam | Cost and disposition |
|---|---|---|---|
| 1 / P1 | Give an optional start a named rule profile that checks actual actions: a body cannot wear a tool, a vow excludes a method, or a world permits a transformed use. Show the reason and a supported alternative. | `docs/LIFE_SIM_NORTH_STAR.md`, `docs/ENGINE_EXPANSION.md`; `src/chronicle.js`, capability/action admission | ADAPT. Reuse current state and action owners; one selected profile needs real consumers, exit behavior and persistence. |
| 2 / P2 | Put existing skills in new acquisition contexts. A remote teacher, repeated expedition or local research can teach an already-defined skill without inventing a second skill system. | `docs/RESEARCH_LITRPG_SYSTEMS.md`, `docs/ENGINE_EXPANSION.md`; native skills, jobs and expedition evidence | ADAPT. Journeyman is a strong example: 1,080 class/location/slot mappings reuse 180 skills. World-specific active or queued discovery remains possible. |
| 3 / P3 | Keep one item/skill/effect vocabulary and use explicit custom handlers for operations such as grafting, absorption or transforming equipment. Distinguish a changed function from a larger stat. | `docs/ENGINE_EXPANSION.md`, `docs/worlds/ABILITY_AUTHORING.md`; items, effects, content packs and supported effects | ADAPT. Audit one actual chain from acquisition to useful result. Metadata alone is insufficient. |
| 4 / P4 | Allow optional alternative completion graphs over the same world: service, research, diplomacy or an underwater route can reuse places and people while changing the goal. | `docs/TRIALS_AND_TRIBULATIONS.md`, `docs/LIFE_SIM_NORTH_STAR.md`; quest and ending owners | TRIAL. Author a small branch with a distinct goal and earned settlement; retain the ordinary route. |
| 5 / P5 | Treat mode exit as an explicit conversion: retain knowledge, return loans, translate body resources and say what survives. | `docs/ENGINE_EXPANSION.md`, `docs/TIMELINES_AND_DIVERGENCE.md`; transition/save publication | ADAPT. Adds migration work. Never infer permission to erase possessions, stats or effects from a research comparison. |
| 6 / P6 | Make historical or unfamiliar tools available through an optional loan, replica or training scenario. Access need not mean permanent ownership. | `docs/PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md`, `docs/ENGINE_EXPANSION.md`; content packs, item provenance | PARK until a playable module is selected. Avoid importing Mr. Store monetization or release-date bans. |
| 7 / P7 | Let a world condition change concrete zone actions and rewards: flood depth, fire, siege or faction control can make the same place play differently. | `docs/gm/dispatch/procgen-2026-10-13/p21/WARS.md`, settlement/world-event owners | TRIAL. The province-war lane can cite this report and the path digest for overlays. Require actual supply/access/encounter changes, not a generic misery multiplier. |
| 8 / P8 | Separate renewable allowances by scope and clock: item charge, shared pool, body reserve, world day or project stock. Preview the next supported recovery. | `docs/ENGINE_EXPANSION.md`; `src/energy_resources.js`, `src/game_time.js`, jobs | ADAPT. No fixed solo-player once limit and no hunger death. Named capacities are optional world models, not a mandatory three-organ player system. |

## Prior lane confirmation and correction

The same parser was run on both the prior `b11fc583b6872f1d56f5936803de2359cc962328` checkout and fresh `d6747f7af98605b14eaeb2c63e11daa9532e1152`. The measured summaries match. These corrections are counting/claim issues, not content drift.

| Prior code | Disposition | Result and evidence |
|---|---|---|
| F1 | CORRECT | 57 enum entries confirmed; only 51 are special challenge paths. 24 points preferences. Effective organs may come from the class, then path base, then modifiers. `AscensionPath.java`, `AscensionClass.java`, `KoLCharacter.java`. |
| F2 | EXTEND | Separate organs confirmed. Don't equate enum defaults with effective class limits. Dietary bans also have explicit consumers. Prior average adventure yields were not recalculated and remain outside this pass's evidence. |
| F3 | CORRECT | Council L02-L13 is common, not every run. Community Service and Sea explicitly replace progression; other paths alter its graph/final encounter. Archived index, `questslog.txt`, `BugbearManager.java`. |
| F4 | PARTLY CONFIRM | Adventure modifier exists. The archived Slow and Steady rule page states ordinary 40 versus its 100 daily grant. This is dated wiki evidence, not a live-server check. Bank cap 200 remains OPEN. A 40-turn mode-exit clamp is a separate rule. |
| F5 | CORRECT / EXTEND | 439 non-comment daily-limit rows, not 442; six Tome rows share three uses while interaction is restricted, then allow three per tome in aftercore. 1,096 underscore preferences, which are client tracking fields rather than 1,096 separate content modules. `DailyLimitDatabase.java#getUses`, `defaults.txt`. |
| F6 | CORRECT / CONFIRM | 6,211 Last Available rows and 61 Replica Mr. Store entries confirmed. Last Available is dated eligibility metadata, not proof that each listed item has permanently ceased all acquisition. Archived Legacy entry confirms replica access and retained downstream outputs. |
| F7 | CONFIRM / NARROW | AfterLifeRequest models permanence at 100/200 Karma and returns, deli 1 and armory 10. Ronin is usually 1,000 but the client gives Grey Goo 10,000; the Pocket Familiars wiki describes infinite Normal Ronin. Pull counts were not revalidated. No ascension/pull/refund was played. |
| F8 | CORRECT | Use parsed data rows: 12,098 items; 3,014 effects; 2,389 monsters; 601 adventures; 178 outfits; 324 familiars; 1,651 skills. Prior larger values are not valid-record counts under the documented formats. Zone count and per-class average were not revalidated. |
| F9 | CORRECT / CONFIRM | Shared grammar confirmed; 13,369 modifier records and 258 distinct field names, not 16,114 / 675. This is a lexical field count, not a count of all implemented mechanics. `modifiers.txt`, `ModifierDatabase.java`. |
| F10 | CONFIRM WITH LIMIT | Familiar types and weight modifiers are shared primitives. Pocket Familiars adds a separate team combat model; not every companion behavior is explained by a weight scalar. `familiars.txt`, `PokefamData.java`, archived index. |
| F11 | NARROW | Requirement-tag recipes and fold/zap/pulverize formats exist. Prior numerical group totals were not reliable record counts; formats differ, so a generic line-count total is inappropriate. Do not reuse those totals without a format-specific audit. |
| F12 | CORRECT / EXTEND | 144 actual Standard reward rows, not 146. Year/class/normal-or-hard reward mapping is shown; calendar legality is stated in archived challenge indexes and handled by StandardRequest. |
| F13 | OPEN | Clan multiplayer mechanics were not audited. Household analog remains a proposal. |
| F14 | NARROW | Reuse is well supported; low learning cost and commercial longevity are interpretations, not measured causal results. Paths can add substantial systems and exceptions. |
| F15 | RETAIN AS PROPOSAL | Existing YAIRPG document overlap remains useful routing. It does not establish gameplay or accept this pass's suggested design. |

[Implementation packets](IMPLEMENTATION_PACKETS.md), [small touches](SMALL_TOUCHES.md), [tooling](TOOLING.md) and [checkpoint](CHECKPOINT.md) give the bounded follow-through and evidence limits. Raw code, full wiki text and scripts stay in the work area. No installs, accounts, game launches, save access, builds, commits or owner edits.
