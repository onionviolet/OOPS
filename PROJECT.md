# OOPS project

*Current state only. Replace a section when it changes; never append a dated section. Dated history goes to [the project log](docs/gm/PROJECT_LOG_2026-10-29.md) (2026-10-07 to 2026-10-29) and [the earlier log](docs/gm/PROJECT_LOG.md). `npm test` fails if this file passes 200 lines or gains a dated `##` heading.*

**OOPS · Optimistic Progression Simulator** is Weibao's fork of Miktaew's Yet Another Idle RPG ([identity](docs/USER_VISION.md#oops-project-identity-2026-10-16)). Upstream attribution, LICENSE and save identifiers stay intact. Repository: [onionviolet/OOPS](https://github.com/onionviolet/OOPS).

## Vision

- Multiple worlds with distinct rules, economies and progression, plus meaningful interactions between them.
- Dense stats and interconnected skills where ordinary skills stay useful late.
- Deepen existing YAIRPG systems as well as adding new ones.
- The starting world is a full campaign of its own, alongside the others.
- Prestige/rebirth, kept separate from travel and ascension.

The one-realm/one-prestige first milestone is no longer a required gate ([direction](docs/USER_VISION.md#first-milestone-and-scope-check-2026-10-24)).

## Current focus

1. **LOTM first through Klein’s full journey.** Use Klein’s developer playthrough to implement the first novel opening-to-ending as contiguous playable arcs ([workflow](docs/LEAD_LIFE_GUIDE.md)). The [campaign plan](docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_KLEIN_FULL_JOURNEY_PLAN.md) owns sequence; [KJ3Y receipt](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3Y_IMPLEMENTATION_RECEIPT.md) owns the current endpoint (Sunday noon on Zouteland Street with the found wallet after Old Neil's ritual lesson, English v1 ch23 through ch52 P035; [KJ3X](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3X_IMPLEMENTATION_RECEIPT.md) holds the Divination Club and the family dinner, [KJ3W](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3W_IMPLEMENTATION_RECEIPT.md) holds the apartment and the company morning, [KJ3V](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3V_IMPLEMENTATION_RECEIPT.md) holds the rescue, the night and the dawn visit, [KJ3U](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3U_IMPLEMENTATION_RECEIPT.md) holds the commission and the search, [KJ3T](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3T_IMPLEMENTATION_RECEIPT.md) holds Old Neil's lesson, Dunn's signature and the routine week, [KJ3S](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3S_IMPLEMENTATION_RECEIPT.md) holds the Glacis reading and the fare talk, [KJ3R](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3R_IMPLEMENTATION_RECEIPT.md) holds the Divination Club reception, [KJ3Q](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3Q_IMPLEMENTATION_RECEIPT.md) holds the second gathering, [KJ3P](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3P_IMPLEMENTATION_RECEIPT.md) holds the drink and B1's first native proof, [KJ3O](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3O_IMPLEMENTATION_RECEIPT.md) the potion made; [KJ3N](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3N_IMPLEMENTATION_RECEIPT.md) holds the chain replay on the B9 bundle; [KJ3M](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3M_IMPLEMENTATION_RECEIPT.md) and [KJ3L](docs/gm/dispatch/refinement-audits-2026-10-31/KJ3L_IMPLEMENTATION_RECEIPT.md) holds ch24 P034-ch26 P068) and its verification. Twenty-seven slices now contain 408 selected stages/intents, not an exhaustive campaign denominator. Mechanism slices lead and book windows follow as their consumers (Weibao 2026-11-02, [USER_VISION](docs/USER_VISION.md#mechanism-plus-display-slices-lead-the-book-campaign-2026-11-02)); ch24 P034 to ch41 P066 are built (kjw2-kjw10, kjw6-kjw10 natively proven on the B10 bundle); kjw11 (ch41 P067 on, the Friday client) needs its own brief; the mechanism lane (B2-B6, B11, B12) gates the later windows that use it. Spine-and-fill ([PF13 adoption path](docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_KLEIN_FULL_JOURNEY_PLAN.md#pf13-adoption-path-d1-2026-11-02-proposal)) is a proposal under trial, not the standing method. Existing combat L2b remains below floor in its own queue. Ordinary player starts remain lore-grounded and low-spoiler, after Klein’s route ([entry owner](docs/WORLD_ENTRY_RULES.md#developer-route-and-low-spoiler-player-starts-2026-11-01)); deeper systems, several paths and mechanically distinct worlds remain in the broader vision.
2. **Batched reading before Nov 1.** Readers record everything the text states and invent nothing; gaps are worked out afterward. The promo credit expires Nov 1 and each batch runs on Weibao's go ([schedule](docs/gm/dispatch/batch-reading-2026-10-27/NOV1_SCHEDULE.md)).
3. **Book worlds and menus get the depth.** Frontier and Mistglass stay playable test beds with no new depth; prose quality is a later local-AI job ([direction](docs/USER_VISION.md#book-worlds-and-menus-first-frontier-and-mistglass-as-test-beds-2026-10-26)).
4. **Three worlds: Proto23, YAIR and our variant.** The current Village stays as the variant. A proposal so far; no Proto23-derived push without Weibao's yes ([round 8](docs/MASTER_PLAYABILITY_PLAN_2026-10-25.md#round-8-three-worlds-proto23-yair-and-our-variant-2026-10-27)).
5. **Playability plan.** The [master playability plan](docs/MASTER_PLAYABILITY_PLAN_2026-10-25.md) sequences current delivery into playable sessions, deeper world lives and further worlds.

The 2026-10-27 planning-report proposals are adjustable working direction; conflicts resolve to the later dated wording ([register](docs/gm/WRITEUP_REGISTER.md#5b-adoption-2026-10-27)).

## Standing priorities and document authority

Authority order: Weibao's latest instruction, then [USER_VISION](docs/USER_VISION.md) (his requests, verbatim), then the owning rulebook, then this summary. Checkpoints and reports record evidence, not new direction. The [rules index](docs/RULES_INDEX.md) registers every rulebook and restates accepted decisions as AD codes.

- **Delivery floor.** [Ground rules](docs/GROUND_RULES.md) hold the accepted floor FLR1–FLR6 (AD43): a runtime slice counts as done at the floor; below it, record "implemented, below floor".
- **Human gates are optional** (AD42). Report "agent-verified, not human-reviewed".
- **Everything built is open to refactor** with a reason (AD45). Rules are defaults with a dial and a reason, not absolutes.
- **Verification is lean** (AD36): focused tests while working, one full `npm test` at commit.
- **Runtime architecture** follows [AR1–AR16](docs/ARCHITECTURE_RULES.md): no rewrite, `main.js` as composition root, one registry with namespaced save slices.
- **Desktop/laptop UI first**; mobile is deferred unless Weibao asks ([UI priority](docs/USER_VISION.md#standing-ui-priority-2026-10-13), [UI rules](docs/UI_RULES.md)).
- **Canon-first world order**: Harry Potter, D&D and the book worlds lead canon play, then anime/manga worlds ([log entry](docs/gm/PROJECT_LOG_2026-10-29.md#standing-priorities-and-document-authority)).
- **Different lives per setting**, not profession names alone ([direction](docs/USER_VISION.md#different-lives-and-implementable-book-world-features-2026-10-21)).
- **Some complexity is welcome**, managed for implementation cost ([direction](docs/USER_VISION.md#complexity-and-implementation-difficulty-2026-10-16)).
- **Merge before dispatch**: merge finished, gate-passing branches before a new wave ([direction](docs/USER_VISION.md#merge-before-dispatch-2026-10-14)).
- **Save deep details** from research in gitignored `docs/research/<source>/private/`; committed docs stay paraphrased ([direction](docs/USER_VISION.md#save-deep-details-for-reference-2026-10-14)).
- **Agent usage budget** follows [AU1–AU15](docs/AGENT_USAGE_RULES.md) (AD37).

Older standing items (UI rounds R7–R14, surface types, crafting engine, tabletop multiverse, food) keep their text in [the log](docs/gm/PROJECT_LOG_2026-10-29.md#standing-priorities-and-document-authority) and their detail in their rulebooks.

## Accepted decisions

The current statement of each accepted decision is its AD line in the [rules index](docs/RULES_INDEX.md) or its rulebook. The full dated list that used to live here, with Weibao's quoted words, is preserved under [Accepted decisions in the log](docs/gm/PROJECT_LOG_2026-10-29.md#accepted-decisions). Record a new decision in USER_VISION (his words) and the owning rulebook or AD line; change this file only if it alters the current focus or a standing priority.

## Release state

Published master is `5dcd2240c` (Luminous Gothic default); the normal app serves frozen `v0.6-e7f0aa4029ca` ([adoption receipt](docs/gm/dispatch/luminous-adopt-2026-10-29/APP_ADOPTION.md)). Work since then is local until Weibao says to push.

## Where to look

| Need | Owner |
|---|---|
| Which rules apply to a task | `.claude/rules/*.md` (auto-loaded by path), then the [rules index](docs/RULES_INDEX.md) router for design-rule questions |
| What Weibao asked for and why | [vision digest](docs/VISION_DIGEST.md) first, then [USER_VISION](docs/USER_VISION.md) searched by heading rather than read whole |
| Open queues and packet states | [IDEA_INDEX current queue routing](docs/IDEA_INDEX.md#current-queue-routing-2026-10-18) |
| Active lanes and reconciliation | `docs/gm/dispatch/*/CHECKPOINT.md`, [shared worktree practice](docs/gm/SHARED_WORKTREE_PRACTICE.md) |
| Tools, book library, game MCP | [tool registry](docs/TOOL_REGISTRY.md), [library index](docs/research/LIBRARY_INDEX.md), [game MCP limits](docs/tools/GAME_MCP_LIMITS.md) |
| Why something was decided, and when | [project log](docs/gm/PROJECT_LOG_2026-10-29.md), [earlier log](docs/gm/PROJECT_LOG.md) |

## Updating this file

- Edit the section that changed and replace stale lines; move what you remove to the project log under a dated heading.
- Current focus holds at most five items. A sixth means one has finished or moved down.
- Link to the owner instead of restating it. One line per standing priority.
