# HyperRogue: places change the rules of play

2026-10-14, lane `mw-hyperrogue`. **Research and PROPOSALS only.** Source pinned to `c7c9a2993b43ee2f4bbac422e565d18fdd98f886`. Static C++ reading, no build, game launch, network-code execution, save access or YAIRPG runtime edits.

HyperRogue makes one traveler cross adjacent regions whose terrain, enemy behavior and reward conditions change the meaning of moving, waiting and attacking. Growth is largely collected treasure, retained kill counts, unlocked opportunities and temporary orb powers. It is a strong reference for K2 world laws, K5 places, K9 items, K10 combat, K13 signature loops and K15 crossings. It is a weaker model for YAIRPG's careers, lived hubs and durable social relationships.

**F1, SHOWN:** One content ledger generates enums and metadata; executable land rules live in generators and shared movement/environment consumers. The ledger contains **95 LAND, 155 ITEM, 180 MONSTER and 121 WALL macro records**. These are declarations, including technical states and special-mode content, not 95 independent accessible worlds. [content.cpp:1059](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/content.cpp#L1059), [classes.cpp:663](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/classes.cpp#L663). The complete paraphrased [land census](LANDS.md) lists all 95 IDs, treasures, native-monster identifiers, unlock expressions and generation locators. Full source tables stay in the private work area.

**F2, SHOWN:** Access is several decisions: unlock predicate, availability in the chosen geometry/mode, valid adjacency, weighted destination selection, then border generation. A rule can be satisfied without the land being eligible next door. `ACCONLY` tests game availability in a separate evaluator; it is not itself proof of exact adjacency. [landlock.cpp:241](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/landlock.cpp#L241), [landlock.cpp:276](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/landlock.cpp#L276), [landlock.cpp:590](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/landlock.cpp#L590).

**F3, SHOWN:** Orb spawn classification and carried-power legality are separate. `getOLR` classifies native, guest, useful, dangerous, forbidden and other generation relationships. Actual effects run through pickup, decay, movement and environment code. Land of Power departure explicitly sets each held IC_ORB with at least two charges to two, except Orb of Fire. [orbgen.cpp:216](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/orbgen.cpp#L216), [pcmove.cpp:1872](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/pcmove.cpp#L1872), [orbs.cpp:87](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/orbs.cpp#L87). Do not interpret a forbidden spawn as a universal inability to use a carried power. The OSM forbidden-history assignment also has an apparent prior-item/selected-orb mismatch, detailed in [DS3](aspects-2026-10-14/DEEPER_SYSTEMS.md).

**F4, SHOWN:** Cross-land interaction is causal. Cave growth reads foreign creatures and objects; electricity classifies conductive/grounded/isolating cells and can turn a connection into treasure or danger. Borders have special sea, elemental, reflection and haunted variants. [complex.cpp:2377](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex.cpp#L2377), [complex.cpp:195](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/complex.cpp#L195), [barriers.cpp:293](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/barriers.cpp#L293). [Detailed flow digest](BORDERS_CARRY_AND_MODES.md).

**F5, SHOWN:** Run continuity is different from permanent world retention. Runtime items and kill ledgers span lands, but Safety starts another generated map while retaining selected run state; distant-cell memory removal can erase terrain history. A YAIRPG changed revisit needs its existing persistent instances, not this shortcut. [game.cpp:244](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/game.cpp#L244), [system.cpp:203](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/system.cpp#L203), [savemem.cpp:96](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/savemem.cpp#L96). [Persistence and UI digest](ARCHITECTURE_SAVE_AND_UI.md).

## Ranked PROPOSALS

All are unselected. Adapt the mechanisms into original rules, keep priority canon worlds first and use existing owners. One realm and one prestige remain the first milestone. No new once-per-player restriction is proposed.

| Rank / code | Proposal and visible benefit | Kit and owning system | Synthesis mapping / disposition |
|---|---|---|---|
| 1 / HR-P1 | Give two existing places different lawful answers to one useful action. A carried tool solves one local obstacle and has an explained different outcome in the other. | K2/K5/K10/K13/K15; world laws, `realm_boundary_rules.js`, `simulation.js` | Extend P14; adapt. Avoid a new universal combat engine. |
| 2 / HR-P2 | Preview per-carrier departure effects, including actual remaining fuel and local obligations, before a crossing commits. | K3/K9/K15/K18; `world_instances.js`, boundary rules, durable publisher | Extend P05/P17; adapt, no universal drain. |
| 3 / HR-P3 | Make one border an interaction scene: neighboring laws affect a real shared object, with a safe useful alternative. | K2/K5/K13/K29; local world definitions and existing staged effects | **NEW leaf HR-N1** under P14/P15. Needs actual edge consumers, not another registry. |
| 4 / HR-P4 | Show discovered route conditions and current usability as distinct explanations. Keep undiscovered destinations hidden. | K4/K11/K14/K15/K30; existing knowledge-filtered views and Workspace | Extend P04/P11; adapt the explanation mechanism, not omniscient help. |
| 5 / HR-P5 | Let local conduct change the next opportunity: one demonstrated technique reveals a route or earns a local service. | K3/K10/K11/K13; existing work/learning and capability owners | Extend P03/P09/P12; adapt. Treasure totals are source balance, not YAIRPG law. |
| 6 / HR-P6 | Offer a chosen practice variant over an existing place with a distinct input clock, reward and exit contract. | K4/K10/K16/K17/K18; trials, starts/branches, existing scheduler | Extend P14/P13/P05; park until a selected slice needs it. No action-mode conversion required. |
| 7 / HR-P7 | Keep a generated trait identical across appearance, help and a practical matching task. | K1/K9/K11/K15/K30/K34; generation owners and actual item instances | Extend P15/P16; adapt Galápagos matching, not its count of combinations. |

## Prior research reconciliation

No HyperRogue-specific entry was found in the inspected synthesis or feature scout. This table extends named patterns; it does not correct another game's source claims or rerank the coordinator's menu.

| Ref | Prior owner / packet | Confirm, correct or extend |
|---|---|---|
| C1 | World kit K2/K13/K15 and synthesis P14 | Confirm: shared verbs need world-specific executable rules. Extend with source traced terrain consumers and region boundaries. |
| C2 | P05 carrier-specific exit; nested-world brief family 4 | Confirm carrier specificity. Extend with a precise departure-drain case; do not import that policy globally. |
| C3 | P04 discovery, permission, ownership, usability | Extend with unlock vs in-mode availability vs placement vs actual carried use. HyperRogue's public help is not actor knowledge. |
| C4 | P15 generated identity, P16 definitions/instances | Extend with 21-bit matching and actual environment/quest/display readers. Millions of bit patterns do not prove millions of rich worlds. |
| C5 | Start/branch integration map IR1-IR4 | Confirm separate definitions, authoritative mutable owners and transactional deltas. HyperRogue mode restarts do not establish YAIRPG native branch/save parity. |
| C6 | Nested-world brief families 1 and 4 | Correct a tempting analogy: neighboring lands are regions of one generated space, not necessarily separate universes; remote-memory removal conflicts with retained destination histories. |
| C7 | Successor root FK2/FK3 | Preserve distinctions between proposed audit contracts and actual foreign engines. This research does not rescore dated kit readiness or add new mandatory gates. |

## Scope and gaps

The four deep questions are answered at static-source level, including all-land metadata, representative runtime laws, border creation, carried state, Yendor/Hyperstone and requested modes. Whole-engine and all land-by-orb exception closure remain **PARTIAL**. Every land has a locator, but not every monster, scheduler path or geometry variant was followed end to end. See the explicit unread table in [CHECKPOINT.md](CHECKPOINT.md). No browser, balance, human-feel or save roundtrip claim is made. No production or owner-document edits, staging or commits.

For a later selected UI packet: primary viewport 1366×768, plus affected laptop sizes as needed. Visible result is known local rules, actual carried power and the next useful action in independent readable panels. Mobile optimization stays deferred. Fresh rebuilt desktop and applicable Save/reload/Export/literal Import remain implementation gates, not research gates.
