# OOPS vision digest

## What OOPS is

OOPS (Optimistic Progression Simulator) is Weibao's fork of Miktaew's Yet Another Idle RPG ([identity](USER_VISION.md#oops-project-identity-2026-10-16)). It aims to be many worlds with their own rules, economies and progression, deep systems, and book worlds you live in rather than follow on rails. The tone is whimsical and unpretentious. Weibao is, in practice, the sole player.

## Pillars

- **Anything is possible, reasonably.** Each option should fit its world's lore and carry a cost or condition. When several answers are reasonable, the answer is "it depends on the world", so propose a default and say when it changes ([why](USER_VISION.md#anything-is-possible-2026-10-09)).
- **Things work by how they work.** If a method, potion or plan reasonably works by the mechanisms in play, it works without a permission list. Model mechanisms, not lists of allowed outcomes ([why](USER_VISION.md#things-work-by-how-they-work-2026-10-17)).
- **Limits are adjectives.** Write a constraint as a default, a dial and an in-world reason. A fixed "once" is a poor limit because the dial can usually set it per world ([why](ABUSE_AND_LIMITS.md#limits-are-adjectives)).
- **Many worlds are the plan.** More worlds, a lived home and real base building are Weibao's own direction, so raise sequencing as a practical risk, not as scope drift ([why](USER_VISION.md#5-more-worlds-and-a-lived-home)). Everything on the table stays on the table; unplayed work gets shown to him, not cut ([scope](USER_VISION.md#first-milestone-and-scope-check-2026-10-24)).
- **Book worlds with different lives.** Random local lives may seek work through actual hiring routes; named protagonists and already-employed starts retain their own circumstances. A student and a smuggler in one setting should play differently, so name the life, not just the profession ([why](USER_VISION.md#different-lives-and-implementable-book-world-features-2026-10-21)).
- **Design the lead's engine from the full known book trajectory.** Later mechanisms inform early state/UI contracts; each arc checks them before implementation and at acceptance through the lead-life workflow. Deliver bounded early loops, qualify unread gaps and refactor when later evidence changes the model ([direction](USER_VISION.md#lead-world-engines-designed-top-down-across-the-known-book-trajectory-2026-10-31)).
- **Complete LOTM through Klein's full journey first.** Use Klein as the developer playthrough for contiguous arcs from the opening to the first novel's ending, using later-mechanic audits to inform early contracts. Ordinary player entry uses lore-grounded, low-spoiler starts ([direction](USER_VISION.md#lotm-first-through-kleins-full-journey-2026-11-01), [campaign plan](gm/dispatch/refinement-audits-2026-10-31/LOTM_KLEIN_FULL_JOURNEY_PLAN.md)). Other worlds remain part of the broader vision.
- **The lead's life is the main line.** Build every capability the protagonist's life needs; choose what other seats get later ([why](USER_VISION.md#cast-lives-be-the-lead-is-the-main-line-2026-10-28), [build scope](USER_VISION.md#cast-lives-build-everything-the-leads-life-needs-choose-later-for-other-seats-2026-10-28)). Canon-holding is a default for that seat, widened later into emergent play and fate ([why](USER_VISION.md#cast-lives-canon-holding-is-a-default-for-the-lead-widened-later-into-emergent-play-and-fate-2026-10-29)).
- **World UI names its engine contract and sharing boundary.** WA54–WA57 require actual suppliers/consumers, explicit world differences, later-source refactor pressures and coordinated shared ownership ([direction](USER_VISION.md#standing-world-ui-and-shared-engine-implementation-contracts-2026-10-31)).
- **Each world picks its own systems and their look.** Progression, economy, combat, magic and the rest are chosen per world with nuance; no world (LOTM included) is the template. Progression is any lasting improvement, not only ranks ([why](USER_VISION.md#each-world-chooses-its-own-systems-and-their-ui-standing-rule-2026-10-30)).
- **Complexity is welcome, and so is refactoring.** Keep the depth and manage the implementation cost ([why](USER_VISION.md#complexity-and-implementation-difficulty-2026-10-16)). What is built is the current best, open to change with a reason ([why](USER_VISION.md#rules-what-is-built-is-open-to-refactor-and-improvement-2026-10-28)).

- **Standing checks (2026-11-03):** direction changes need the digest and a log entry in the same change; `npm run check:rules` now warns when they are missing ([workflow](gm/dispatch/refinement-audits-2026-10-31/BOOK_ABSORPTION_WORKFLOW.md#standing-checks-proposal-2026-11-03-weibao-create-long-standing-checking-rules-so-these-wont-be-missed-again-ad32-except-the-check-that-already-runs)).
- **Book campaigns (2026-11-02/03):** runtime mechanisms lead and book windows follow as their consumers; the protagonist's life should play as their own life, with daily-life granularity a later adjustable dial. The lore's stated numbers are fixed points and our systems are calibrated to reproduce them (AD49; [USER_VISION](USER_VISION.md#match-the-lores-numbers-by-calibrating-our-systems-2026-11-03)).

## What OOPS is not

- Not a fixed first milestone. The one-realm, one-prestige gate is retired ([why](USER_VISION.md#first-milestone-and-scope-check-2026-10-24)).
- Not gated on human review. Human acceptance is optional feedback; report "agent-verified, not human-reviewed" and keep going ([why](USER_VISION.md#human-gates-can-be-skipped-2026-10-25)).
- Not a mobile-first game. Mobile waits unless Weibao asks ([why](USER_VISION.md#standing-ui-priority-2026-10-13)).
- Not an anti-abuse project. Beyond save integrity, exploit hardening is very low priority because he is, in practice, the sole player ([why](ABUSE_AND_LIMITS.md#limits-are-adjectives)).
- Not a rewrite of upstream. Credit, license and save identifiers stay intact unless Weibao decides otherwise ([why](USER_VISION.md#oops-project-identity-2026-10-16)).

## Current taste calls

- Improve the Proto23-style functional UI first. Weibao found the pictured home unhelpful; prioritise housing information/actions in the existing shell and evaluate spatial views per actual task, not as a general upgrade ([feedback](USER_VISION.md#functional-proto23-style-ui-over-the-pictured-home-2026-11-01), [look owner](../DESIGN.md#selective-2d-exploration-2026-11-01)).
- Desktop and laptop first, using the full screen with independent panels visible, not condensed. Target 1920x1080 ([why](USER_VISION.md#standing-ui-priority-2026-10-13)).
- Depth goes to book worlds and menus. Frontier and Mistglass stay playable test beds with no new depth of their own, and nothing is deleted ([why](USER_VISION.md#book-worlds-and-menus-first-frontier-and-mistglass-as-test-beds-2026-10-26)).
- Canon play leads with Harry Potter, D&D and the book worlds; parallel versions start from easy reuse ([why](USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13)).
- Non-lead characters do not need full lives, since the books give too little to go on ([why](USER_VISION.md#cast-lives-how-deep-everyone-elses-life-goes-2026-10-28)).
- Variance only fills what the source leaves unstated, mainly to make parallel worlds of the same world differ; a key still picks a variation and the amount is a dial by circumstance. Repeated stretches are abstracted (investigation as a progress bar, low priority) and skills keep chance while results converge through the available actions ([why](USER_VISION.md#variance-abstraction-and-procedural-work-2026-11-03)).
- Prose quality is known to be weak. A later local-AI drafting pass is the route, not a current gate.
- World secrets stay sealed from Weibao outside their discovery route, because he plays too. Refer to them by ID and status ([AGENTS.md](../AGENTS.md#sealed-secrets)).

## Using this digest

This is the read. Search USER_VISION by heading for his exact words, and where two dated entries differ, the later one wins.
Weibao's latest instruction outranks both.
