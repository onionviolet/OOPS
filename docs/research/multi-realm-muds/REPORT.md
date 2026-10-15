# Multi-realm MUDs: RetroMUD and 3 Kingdoms

2026-10-14. **PROPOSALS ONLY. Public-document research, no game session or server audit.**

RetroMUD gives the stronger documented answer to what makes places play differently: travel methods, visibility, movement, homeworld affinity and geographically located training. Its guild tiers let one character combine several traditions. 3 Kingdoms gives the stronger public example of many authors building maintainable areas and distinct guild mechanisms over common infrastructure. Its three realms supply setting variety; public pages do not establish three separate physical law engines.

The transferable lesson is to retain a traveler's learned capability while independently resolving body, equipment, local resources, permission and relationships. Neither source proves seamless transfer of every item, power and companion. Reincarnation, reboot retention and ordinary realm travel are separate boundaries.

## Direct answers

| Code | Question | Evidence and limit |
|---|---|---|
| F1 | How do realms differ? | RetroMUD states six environmental identities and conditional transport; homeworld changes prices, travel cost and skill/spell performance. 3K states a Pinnacle hub with Fantasy, Science and Chaos; realm-specific content and quests are documented, universal border suppression is not. [World/transport digest](WORLDS_AND_TRAVEL.md), MW-F01..04/F10. |
| F2 | Can a traveler learn many power systems? | RetroMUD's cumulative 20/14/9 guild path is constrained by previous training and prerequisites, with exceptions. 3K has distinct guild mechanisms, separate professions and an explicit Ascended secondary. Arbitrary simultaneous guilds or lossless switching are unverified. [Power digest](GUILDS_AND_CARRIERS.md), MW-F05..09. |
| F3 | How do many builders stay coherent? | 3K exposes common bases, typed LPC examples, review stages and a maintenance catalogue. RetroMUD states sponsor/writing/coding requirements but its detailed standards were not recovered. Exact area level ranges and complete current area lists remain unread. [Authoring digest](AREA_AUTHORING.md), MW-F11..16. |
| F4 | What carries relationships and items? | RetroMUD has guild conduct credit and owner-bound item retention; 3K exposes faction reputation and conditional autoload. Cross-realm personal relationships, companions and complete transfer semantics remain unread. [Power digest](GUILDS_AND_CARRIERS.md), MW-F06/07/17/18. |

Sources are linked at each digest claim and in [SOURCE_LEDGER.md](SOURCE_LEDGER.md). SHOWN means inspected public tutorial/website code, STATED means a publisher rule description, INFERRED means analysis. A published example is not inspected live server implementation. Raw pages, JSON help envelopes, archive captures and JS stay in the private workspace with hashes.

## Ranked PROPOSALS

These extend existing owners and do not change priority worlds, the one-realm/one-prestige milestone or the successor kit's selected work. The selected local Village slice stays ahead of this menu.

| Rank / code | Proposed useful change | Owner and kit | Existing synthesis / disposition |
|---|---|---|---|
| 1 / MW-P1 | Give one crossing a discoverable local condition and a safe way to inspect the destination before commitment | World laws/travel, nested-world crossing contract; K2/K5/K11/K15 | Extend P04/P14/P13; bounded trial |
| 2 / MW-P2 | Retain learned methods while local training, membership, body and fuel remain separate checks | Ability authoring, skill means, social spine; K3/K7/K15/K22 | Extend P03/P04/P07; adapt |
| 3 / MW-P3 | Give one small area an authoring card with inspectable nouns, real exits, challenge band and maintenance status | World kit K1/K10/K33/K34 | Extend P16/P22; offline authoring first |
| 4 / MW-P4 | Preview item ownership, current use and survival through the chosen boundary separately | Nested-world contract and existing native save owner; K9/K15/K18 | Extend P05/P16/P24; no destructive reboot import |
| 5 / MW-P5 | Make a local credential or deed change one institution service on return | Social spine and existing relationship/knowledge state; K7/K24/K29 | Extend P07/P12; adapt |
| 6 / MW-P6 | Route one delayed NPC action through an explicit actor and a finite scheduler job | Existing expansion scheduler, character/world events; K6/K26/K34 | Extend P06/P08/P13/P25; only with a useful consumer |
| 7 / MW-P7 | Show one place's practical environment and one familiar method's local usability together on desktop | Thematic UI, world law, ability projection; K14/K19/K30 | Extend P04/P14; 1366x768 primary, mobile deferred |

No new global synthesis P number is allocated. **New lane-specific refinements:** MW-N1 conditional transit with an inspection action; MW-N2 maintenance status distinguishes repair from approval. Their families already exist in P04/P13/P14 and P16/P22. [Implementation packets](IMPLEMENTATION_PACKETS.md) specify state, refusal, save and natural acceptance.

## Compare and reconcile prior passes

| Code | Prior record | Confirm / correct / extend |
|---|---|---|
| C1 | [Discworld original](../discworld-mud/REPORT.md): static canon snapshot and unknown NPC behavior | Use [latest pass](../discworld-mud/pass-2026-10-14/REPORT.md), which corrects that oversimplification with local life and reenacted scenes. This lane neither restores the old wording nor claims a global novel clock. |
| C2 | Discworld skills, lessons and professions | Extend: RetroMUD supplies a cumulative guild prerequisite path; 3K supplies different machinery per guild plus profession layers. They are distinct models, not interchangeable multiclass systems. |
| C3 | [Discworld aspects](../discworld-mud/aspects-2026-10-14/DEEPER_SYSTEMS.md): autoload reconstruction and heartbeat speech | Confirm useful categories, qualify evidence: that pass read historical code; here we have help/tutorial contracts only. No shared current implementation is inferred. |
| C4 | [Iron Realms](../free-text-worlds-2026-10-14/iron-realms/REPORT.md): professions separate from class and access separate from ownership | Extend with 3K's profession categories and RetroMUD owner-bound equipment. These do not prove Achaea rules, pricing or slots apply here. |
| C5 | Iron Realms player politics and multi-profession solo adaptation | Qualify: both sampled MUDs still rely on other humans for some services. YAIRPG alternatives need supported NPC/manual/solo routes. Do not import staff trust restrictions, paid exceptions or party dependency as solo-player gates. |
| C6 | Cross-game P04/P05/P07/P14/P16/P22/P24 | Confirm recurring design questions; no gameplay adoption or packet completion follows from this documentation. |
| C7 | Start/branch integration map IR1/IR2/IR3/IR4 | Retained items, capabilities, standing and time must enter existing typed owners and the one durable publisher. Realm labels, biography prose and derived start snapshots are not substitute state. |

## Boundaries and proposed owner follow-through

Consult [kit successor](../../worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md), [K map](../../worlds/WORLD_CORE_KIT_2026-10-14.md), [nested-world owner](../../gm/dispatch/NESTED_WORLDS_AND_DEEP_TROPE_CHAINS_2026_10_05.md), [start/branch map](../START_AND_BRANCH_INTEGRATION_MAP_2026-10-14.md) and [synthesis](../cross-game-synthesis-2026-10-14/REPORT.md) if a packet is selected. These are referrals, no owner edits made.

[CHECKPOINT.md](CHECKPOINT.md) is PARTIAL: the authorized public-document pass is delivered, while full area lists/level bands, server implementations, exact guild switching and traveler/companion carryover remain explicitly unread. No build, gameplay test, browser UI or persistence proof was attempted. See [aspects](aspects-2026-10-14/ASPECTS.md), [inventory](aspects-2026-10-14/SYSTEM_INVENTORY.md), [small touches](SMALL_TOUCHES.md) and [tooling](TOOLING.md).
