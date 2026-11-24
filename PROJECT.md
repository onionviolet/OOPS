# OOPS project

*Current state only. Replace a section when it changes; never append a dated section. Dated history goes to [the project log](docs/gm/PROJECT_LOG_2026-10-29.md) (2026-10-07 to 2026-10-29) and [the earlier log](docs/gm/PROJECT_LOG.md). `npm test` caps this file at 200 lines and 16,000 UTF-8 bytes and disallows dated `##` headings.*

**OOPS · Optimistic Progression Simulator** is Weibao's fork of Miktaew's Yet Another Idle RPG ([identity](docs/USER_VISION.md#oops-project-identity-2026-10-16)). Upstream attribution, LICENSE and save identifiers stay intact. Repository: [onionviolet/OOPS](https://github.com/onionviolet/OOPS).

## Vision

- Multiple worlds with distinct rules, economies and progression, plus meaningful interactions between them.
- Dense stats and interconnected skills where ordinary skills stay useful late.
- Deepen existing YAIRPG systems as well as adding new ones.
- The starting world is a full campaign of its own, alongside the others.
- Prestige/rebirth, kept separate from travel and ascension.

The one-realm/one-prestige first milestone is no longer a required gate ([direction](docs/USER_VISION.md#first-milestone-and-scope-check-2026-10-24)).

## Current focus

**Immediate build order:** procedural foundations first, playable slices later (Weibao, 2026-11-11, [direction](docs/USER_VISION.md#foundations-first-playable-slices-later-2026-11-11)): Gu, creatures, potions, chemistry, crafting, spellcraft and adjacent systems follow the [procedural foundation plan](docs/PROCEDURAL_FOUNDATION_PLAN.md): one chat per part, canon as data over shared rules. For Gu, [capability breadth leads further UI design](docs/GU_ABILITIES_AND_KILLER_MOVES_CONSIDERATIONS_2026-11-10.md#gu-capability-coverage-before-ui-2026-11-12). Feature-by-feature UI, the live fight across worlds and the leads' daily loops run beside the foundations (2026-11-14, [direction](docs/gm/USER_VISION_LOG_2026-11.md#play-surface-ui-per-feature-combat-across-worlds-daily-loops-2026-11-14), [lanes](docs/gm/dispatch/play-surface-2026-11-14/CHECKPOINT.md)). Other general game tie-in waits (2026-11-12, [direction](docs/gm/USER_VISION_LOG_2026-11.md#engine-first-game-tie-in-later-2026-11-12)): foundations are proven in a headless engine world, and the [procedural core](docs/PROCEDURAL_CORE.md) with its [carry-out](docs/PROCEDURAL_CARRY_OUT.md#engine-first-tie-in-later-pc95-2026-11-12) holds the engine-first boundary. The [foundation resume block](docs/gm/dispatch/foundation-run-2026-11-12/RUN.md#current-resume-block) owns wave order: land current work first, then score held-out canon. The three selected [capability starts](docs/PROCEDURAL_CARRY_OUT.md#capability-runs-in-the-game-ui-2026-11-12) have a bounded UI route. Klein (through Tingen) and Fang Yuan (through the Qing Mao departure) pause at their verified endpoints, ch129 and ch140, and are the first consumers when slices resume. Harry’s final King’s Cross exchange closes Book 1 in rebuilt browser play. Zorian’s printed ch26 Arc 1 ending is agent-verified in rebuilt browser play. [Active arc checkpoints](docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md#first-arcs-resumed-on-authorized-credits).

1. **LOTM first through Klein’s full journey.** Build contiguous playable arcs with the [lead-life guide](docs/LEAD_LIFE_GUIDE.md). The [campaign plan](docs/gm/dispatch/refinement-audits-2026-10-31/LOTM_KLEIN_FULL_JOURNEY_PLAN.md) owns sequence and coverage. [KJ3AU](docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md#four-arcs-resumed-november-9-2026) records the kjw36 Chanis Gate watch and Howes Street decision. The [active checkpoint](docs/gm/dispatch/cross-world-systems-2026-11-07/CHECKPOINT.md#first-arcs-resumed-on-authorized-credits) owns the current playable endpoint. Mechanisms lead later windows as dependencies. [Prior delivery receipts and limits](docs/gm/PROJECT_LOG_2026-10-29.md#prior-lotm-delivery-index-archived-2026-11-17).
2. **Harry Potter developer route alongside Klein.** Weibao selected Harry's own life as the second lead-life world on Nov 3, with LOTM-first and the mechanism lane retained ([direction](docs/USER_VISION.md#harry-potter-protagonist-playthrough-starts-2026-11-03), [HP plan and window receipts](docs/gm/dispatch/refinement-audits-2026-10-31/HP_WHOLE_WORLD_PLAN_2026-11-03.md)). Plan labels retain their receipt-specific verification, not a fresh whole-world completion claim.
3. **Book worlds and menus get the depth.** Frontier and Mistglass stay playable test beds with no new depth; bulk local-AI prose drafting remains later; current copy follows the accepted UI/prose defaults ([direction](docs/USER_VISION.md#book-worlds-and-menus-first-frontier-and-mistglass-as-test-beds-2026-10-26)).
4. **Three worlds: Proto23, YAIR and our variant.** The current Village stays as the variant. A proposal so far; no Proto23-derived push without Weibao's yes ([round 8](docs/MASTER_PLAYABILITY_PLAN_2026-10-25.md#round-8-three-worlds-proto23-yair-and-our-variant-2026-10-27)).
5. **Playability plan.** The [master playability plan](docs/MASTER_PLAYABILITY_PLAN_2026-10-25.md) sequences current delivery into playable sessions, deeper world lives and further worlds.

The Nov 1 reading-credit schedule is historical, not a current deadline or renewed spending authorization; [reading status](docs/gm/dispatch/protagonist-life-2026-10-27/READING_STATUS.md) owns recorded reading and qualification gaps. Readers record what the text states; a passed deadline does not prove completion. Superseded focus text is in the [project log](docs/gm/PROJECT_LOG_2026-10-29.md#2026-11-04-loose-document-reconciliation).

The 2026-10-27 planning-report proposals are adjustable working direction; conflicts resolve to the later dated wording ([register](docs/gm/WRITEUP_REGISTER.md#5b-adoption-2026-10-27)).

## Standing priorities and document authority

Authority order: Weibao's latest instruction, then [USER_VISION](docs/USER_VISION.md) (his requests, verbatim), then the owning rulebook, then this summary. Checkpoints and reports record evidence, not new direction. The [rules index](docs/RULES_INDEX.md) registers every rulebook and restates accepted decisions as AD codes.

- **Delivery floor.** [Ground rules](docs/GROUND_RULES.md) hold the accepted floor FLR1–FLR6 (AD43): a runtime slice counts as done at the floor; below it, record "implemented, below floor".
- **Human gates are optional** (AD42). Report "agent-verified, not human-reviewed".
- **Everything built is open to refactor** with a reason (AD45). Rules are defaults with a dial and a reason, not absolutes.
- **Verification** follows [AD36](docs/RULES_INDEX.md#efficient-rule-verification-ad36) for focused checks, push and wave close.
- **Runtime architecture** follows [AR1–AR16](docs/ARCHITECTURE_RULES.md): no rewrite, `main.js` as composition root, one registry with namespaced save slices.
- **Older computers with 8 GB RAM are the performance target**, pending real hardware qualification ([direction](docs/USER_VISION.md#comfortable-play-on-older-8-gb-computers-2026-11-06)). **Desktop/laptop UI first.** Lead workspace reviews at 1920×1080 and use 1280×800 for small-window stress checks. Mobile is deferred unless Weibao asks ([UI priority](docs/USER_VISION.md#standing-ui-priority-2026-10-13), [UI rules](docs/UI_RULES.md)). UI/prose/subtle-detail defaults apply now; UI/flavor whimsy leaves characterization independent; prose-first presentation favors usable actions/progress and interaction feedback over automatic vignettes ([clarification](docs/USER_VISION.md#prose-first-visuals-and-hall-interaction-2026-11-04)) ([direction](docs/USER_VISION.md#ui-and-prose-defaults-subtle-details-and-whimsy-2026-11-04)).
- **Canon-first world order**: Harry Potter, D&D and the book worlds lead canon play, then anime/manga worlds ([log entry](docs/gm/PROJECT_LOG_2026-10-29.md#standing-priorities-and-document-authority)).
- **Different lives per setting**, not profession names alone ([direction](docs/USER_VISION.md#different-lives-and-implementable-book-world-features-2026-10-21)); repeated activities follow [ACR1–ACR14 / AD52](docs/ACTIVITY_ABSTRACTION_RULES.md), preserving choices and local consequences. [Long play is welcome](docs/USER_VISION.md#long-play-cross-world-pursuits-and-quests-2026-11-04); convenience and bounded delivery slices set no short campaign target.
- **Some complexity is welcome**, managed for implementation cost ([direction](docs/USER_VISION.md#complexity-and-implementation-difficulty-2026-10-16)).
- **Merge before dispatch**: merge finished, gate-passing branches before a new wave ([direction](docs/USER_VISION.md#merge-before-dispatch-2026-10-14)).
- **Save deep details** from research in gitignored `docs/research/<source>/private/`; committed docs stay paraphrased ([direction](docs/USER_VISION.md#save-deep-details-for-reference-2026-10-14)).
- **Thirteen proposed rulebooks (2026-11-10, AD32):** world kinds [WKR](docs/WORLD_KIND_RULES.md), source kinds [SKR](docs/SOURCE_KIND_RULES.md), relationships [TIE](docs/RELATIONSHIP_RULES.md), livelihoods [LVR](docs/LIVELIHOOD_RULES.md), time [TMR](docs/TIME_RULES.md), knowledge [KNW](docs/KNOWLEDGE_RULES.md), standing and law [STN](docs/STANDING_RULES.md), story [STY](docs/STORY_RULES.md), cheats [CHT](docs/CHEAT_RULES.md), mind [MND](docs/MIND_RULES.md), items [ITM](docs/ITEM_RULES.md), powers that act [AGT](docs/POWERS_THAT_ACT_RULES.md), between worlds [XWR](docs/CROSS_WORLD_RULES.md); cheats are back in consideration ([direction](docs/USER_VISION.md#four-more-rulebooks-and-cheats-brought-forward-2026-11-10)).
- **Agent usage budget** follows [AU1–AU15](docs/AGENT_USAGE_RULES.md) (AD37).

Older standing items (UI rounds R7–R14, surface types, crafting engine, tabletop multiverse, food) keep their text in [the log](docs/gm/PROJECT_LOG_2026-10-29.md#standing-priorities-and-document-authority) and their detail in their rulebooks.

## Accepted decisions

The current statement of each accepted decision is its AD line in the [rules index](docs/RULES_INDEX.md) or its rulebook. The full dated list that used to live here, with Weibao's quoted words, is preserved under [Accepted decisions in the log](docs/gm/PROJECT_LOG_2026-10-29.md#accepted-decisions). Record a new decision in USER_VISION (his words) and the owning rulebook or AD line; change this file only if it alters the current focus or a standing priority.

## Release state

The first OOPS release, `v0.1.0`, waits for genuinely playable work at the scale of a [major YAIR update](docs/reviews/YAIR_RELEASE_SCALE_2026-11-08.md). The [changelog](changelog.html) records dated development milestones and the [README](README.md#versions-and-changelog) gives the release check.

Release verification and the selected push boundary are recorded in the [November 4 release reconciliation](docs/audits/RELEASE_RECONCILIATION_2026-11-04.md). Repository publication and installed-app adoption are separate states. The [JavaScript/UI task record](docs/gm/dispatch/js-ui-performance-2026-11-06/CHECKPOINT.md) records the November 6 installed package and verified frozen build `v0.6-231c350d8838` (clean `04c5fd798` plus this task's source changes); saves are unchanged, agent-verified and not human-reviewed. Later unrelated primary-checkout work is not included.

Desktop host: Tauri from 2026-11-06 (AD39 amended): `npm run desktop`, the installed app and `npm run check:tauri`; Electron was removed the same day. The [Tauri task record](docs/gm/dispatch/tauri-host-2026-11-06/CHECKPOINT.md) owns state and checks.

## Where to look

| Need | Owner |
|---|---|
| Which rules apply to a task | [agent entry point](AGENTS.md) and its path routes. Use the [rules index](docs/RULES_INDEX.md) for design-rule questions. |
| What Weibao asked for and why | [vision digest](docs/VISION_DIGEST.md) first, then [USER_VISION](docs/USER_VISION.md) searched by heading rather than read whole |
| Open queues and packet states | [IDEA_INDEX current queue routing](docs/IDEA_INDEX.md#current-queue-routing-2026-10-18) |
| Active lanes and reconciliation | `docs/gm/dispatch/*/CHECKPOINT.md`, [shared worktree practice](docs/gm/SHARED_WORKTREE_PRACTICE.md) |
| Which existing module to build a feature on | [area guide](docs/AREA_GUIDE.md), then the [seam register](docs/SEAM_REGISTER.md) |
| Tools, book library, game MCP | [tool registry](docs/TOOL_REGISTRY.md), [library index](docs/research/LIBRARY_INDEX.md), [game MCP limits](docs/tools/GAME_MCP_LIMITS.md) |
| Why something was decided, and when | [project log](docs/gm/PROJECT_LOG_2026-10-29.md), [earlier log](docs/gm/PROJECT_LOG.md) |

## Updating this file

- Edit the section that changed and replace stale lines; move what you remove to the project log under a dated heading.
- Current focus holds at most five items. A sixth means one has finished or moved down.
- Link to the owner instead of restating it. One line per standing priority.
