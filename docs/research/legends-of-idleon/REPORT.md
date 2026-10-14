# Legends of Idleon research, 2026-10-14

Static source and wiki pass. No login, play, game installation, code copying or runtime change. **Status: PARTIAL**, with precise limits in [CHECKPOINT](CHECKPOINT.md). Evidence labels: SHOWN means inspected shipped code or table structure; STATED means source text describes behavior; INFERRED means analysis rather than execution.

Idleon makes one roster do more kinds of work as worlds open. Earlier supplies and bonuses continue feeding later systems. Shared gains make a new character start stronger, while separate skills, gear and assignments give that character useful work. The useful lesson is a web of concrete producers and consumers. The cost is a growing maintenance schedule and some assignments that park characters for shared bonuses.

## Answers

**F1. World identity changes the work.** W1 introduces gathering and manufacture; W2 adds brewing; W3 adds infrastructure, sampling and delayed collection; W4 links pets, spice, meals and a character-powered Laboratory; W5 adds fleets, gardens and divine links; W6 adds crops, stealth teams and slime battles; W7 adds research and team cave dives. W7 has two named new skills in the retrieved article, so do not force every world into a three-skill template. The current Worlds table lists seven released worlds. See [world digest](WORLD_SYSTEMS_DIGEST.md), [Worlds](https://idleon.wiki/wiki/Worlds), [Skills](https://idleon.wiki/wiki/Skills), and [Shimmerfin Deep](https://idleon.wiki/wiki/Shimmerfin_Deep). STATED; local snapshots and revisions in [source ledger](SOURCE_LEDGER.md).

**F2. Account benefits and personal growth coexist.** Shared storage, infrastructure, small Alchemy bubbles and meal upgrades help the account. Class levels, skill levels, equipment, equipped large bubbles and chips belong to characters. Alchemy has both scopes; saying it is entirely account-wide loses the equipment choice and enrollment requirement. Town production can continue alongside a character's ordinary assignment. Lab and early Divinity instead require occupying a character's AFK activity. STATED, with roster/task and reward paths SHOWN in `N.js`. [Roster digest](ROSTER_AND_SCOPE_DIGEST.md).

**F3. Eleven available slots, not a ten-character ceiling.** Character Creation says eleven slots are available. Its generated `Mechanics.slots` table and shipped `NewCharLvReq` agree on slot 11 requiring 5,000 combined class levels. More rows exist, including placeholder thresholds; those rows do not prove more playable slots. All eleven can contribute through separate work, shared skill totals and later class-level rewards. This is usefulness, not a verified optimal class composition. [Character Creation](https://idleon.wiki/wiki/Character_Creation). SHOWN/STATED.

**F4. Offline rewards use activity-specific calculations.** The inspected code combines elapsed seconds with hourly performance and AFK bonuses, then separates kills, XP and drops. Combat considers accuracy, damage, speed and survivability. Gathering has separate formulas. Background production and capped stores are different from a character's current AFK task. The older AFK wiki explicitly marks itself outdated and gives a 20% combat base; this bundle's combat rate starts at 40% before additions. Do not reuse the old page's maximum-rate claim. SHOWN. [AFK digest](AFK_AND_LEGIBILITY_DIGEST.md).

**F5. Legibility comes from task views, previews and local system boards, with limits.** The shipped roster draws task icons and elapsed time; Quick Reference routes unlocked entries to menus; stat views expose rates. Wiki interfaces describe detection chance, storage capacity and per-character contributions. These help navigation but do not prove dozens of systems feel clear. Alchemy's article itself warns that leaving it unattended sacrifices growth. Remote storage use also has a companion gate in the shipped descriptions; menu access is not universal remote operation. SHOWN/STATED; usability INFERRED.

**F6. Later progress can release earlier assignments, but effects must be resolved.** The wiki's Divinity link table assigns Arctis to virtual Lab presence, Goharut to Lab plus Divinity, and Omniphau to one extra production-time claim. Raw `GodsInfo` text associates some names differently; behavior selects effect IDs through field 13. The mapping issue is documented, not silently reconciled by literal string search. W7 Research's Divine Design table grants an all-character Arctis link, illustrating later relief of an old allocation cost. Exact end-to-end ID/name resolution remains open. [Divinity](https://idleon.wiki/wiki/Divinity), [Research](https://idleon.wiki/wiki/Research).

## Ranked PROPOSALS for YAIRPG

No proposal is accepted or implemented. Existing one-realm/one-prestige delivery scope, finite owned means, private knowledge and current offline/roster policy remain authoritative. These are proposed owner additions for the coordinator, not edits to those owners.

| Rank / ID | Proposal and disposition | Existing owner | Cost / boundary |
|---|---|---|---|
| 1 / P1 | Adapt a producer-to-consumer chain within the current realm: gathered inputs support workshop output with a real use. | `docs/ENGINE_EXPANSION.md`, `docs/ENGINE_AUTHORING.md` | Reuse existing stock/jobs; no new world gate. |
| 2 / P2 | Trial a visible rate and blocker breakdown for one known queued activity. | `docs/UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md`, `docs/PANEL_KIT.md` | Desktop 1366×768; show beside current work, mobile deferred. |
| 3 / P3 | Adapt a receipt for settled work showing elapsed game time, outputs, limits and the next useful action. | `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`, `docs/UI_AT_SCALE_CONSIDERATIONS_2026-10-14.md` | Existing committed records only initially; wall-time catch-up remains a separate decision. |
| 4 / P4 | Park a future roster scope contract separating actor mastery, shared stock, institutional services and knowledge. | `docs/CHARACTERS_AND_WORLD_EVENTS.md`, `docs/SKILLS_AND_TALENTS.md` | General roster runtime remains unselected. Shared ownership never implies shared knowledge. |
| 5 / P5 | Trial one earned maintenance aid that releases a routine burden while keeping prerequisites and costs visible. | `docs/ENGINE_EXPANSION.md`, `docs/TECHNOLOGY_AND_PROGRESSION.md` | A funded service or tool, not free unattended throughput or virtual bodies. |
| 6 / P6 | Adapt world-local bonus eligibility with a readable explanation of what carries and why. | `docs/ENGINE_AUTHORING.md`, `docs/worlds/WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md` | Preserve reasonable routes and optional dials; no universal hard cap or fixed once-only solo limit. |

[Implementation packets](IMPLEMENTATION_PACKETS.md) define reviewable trials. [Small touches](SMALL_TOUCHES.md) holds 24 smaller candidates.

## Prior findings reconciliation

| Prior record / premise | Disposition | Evidence / correction |
|---|---|---|
| `docs/research/AUDIT_CANDIDATES_2026-10-10.md`, row 14: many characters share account progress | CONFIRMED and EXTENDED | Shared systems coexist with personal skills, loadouts and explicit enrollment. |
| `docs/research/FUTURE_ACQUISITION_QUEUE_2026-10-13.md`, free row 1: Windows/CrossOver route needed | CORRECTED for this research task | Official web build provides shipped JavaScript without install or launch. Queue owners untouched. |
| Same queue: new worlds across one roster | ANSWERED within bounded evidence | Seven-world progression table; W7 adds research and cave teams, not a new roster reset. |
| Older ten-character framing encountered in search results | CORRECTED, external claim | Eleven available per current wiki article and slot table; no optimal composition claim. |
| AFK wiki v1.14: 20% base and fixed maximum | CORRECTED for retrieved bundle | 40% combat base in `_customBlock_AFKgainrates`; old source is marked outdated. |
| Assumption that many systems are therefore legible | NOT ESTABLISHED | Static UI routes and previews exist; no play or user acceptance evidence. |

## Remaining evidence

Server settlement/anti-duplication, complete modifier order, every live feature and experiential UI quality remain unverified. No YAIRPG gameplay, saves, build, commits or other lanes were changed. Raw downloads and notes remain outside git.
