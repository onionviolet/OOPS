# Adaptation shortlist, 2026-10-15

Requested follow-up: “Anything to pull from games like the climb and more?”
Research recommendations only. No accepted direction, runtime change or new
implementation dispatch follows from this list.

## Ranked ideas

| ID | Reference and evidenced mechanism | YAIR adaptation proposal | Cost and useful check |
| --- | --- | --- | --- |
| O1 | The Climb opening: smith referral → woodworker → diagram/tool/workspace → forest wood. Previously played through gathering and starting diagram reading; completed crafting was not exercised. | Connect an existing Village improvement through people, preparation and useful output. For example, a keeper supplies a known lead, a specialist teaches the method, and the resulting tool changes a specific task. | Low/medium authoring and adapter work. First trace the existing route naturally; add only the missing connection. Player can explain what improved and where it matters. |
| O2 | The Climb published bundle: enchant slots, awakening and selected heirloom retention. Source evidence, later acquisition and rebirth unplayed. | Give one item a consequential history: a bounded improvement changes its use, and actual world/cheat means determine whether it can travel or survive a life transition. | Medium/high if retention is involved. Begin with one item and a real slot tradeoff. Compare two obstacles favoring different preparations; preserve item identity on reload. No extra prestige layer or universal retention rule. |
| O3 | MR2 opening exposes a practical next goal and distinguishes income, capacity and conversion. Its developer also documents side stories unlocking features. | Optional guidance responds to the player's chosen pursuit and known bottleneck. A local story can unlock a service, research opportunity or new action. | Low/medium for one existing pursuit; higher for new content. Guidance uses known facts and a real consumer, with no compulsory global quest. A completion should change available play. |
| O4 | Theory of Magic source: apprenticeships connect roles to skills; homes change space, income and research/elemental capacities. | Careers and homes grant concrete permissions: supervised workshop access, a research space, or another locally justified service. | Medium authoring. Pick one role or home and one useful permission. Compare what the player can do before and after; show relevant costs before committing. Exact examples are proposals, not reference mechanics. |
| O5 | Idle Loops Omsi source: ordered routes spend a finite budget; knowledge/skills and discovered town state persist while run resources reset. | Remember a short expedition plan using existing routines: prepare supplies → follow a known route → stop at a new discovery. Failed preparation gives an actionable stop reason. | Medium adapter/UI work. Reuse existing routine machinery. Verify insufficient supplies, interruption and reload. Intentional loops remain means-dependent player options; this proposal does not require a reset. |

## Evidence and fit

[Prior hands-on report](REPORT.md), [gap audit](GAP_AUDIT.md) and
[pinned comparison](../../RESEARCH_IDLE_GAMES.md#six-detailed-reference-cases)
own the supporting traces and limits. Current direction was checked against
PROJECT.md, docs/DIRECTION_SUMMARY.md and relevant USER_VISION.md passages.
Current `src/alloy_equipment.js` and `src/skill_discovery.js` were inspected:
equipment effects and separate discovery/eligibility projections already exist.
This pass does not establish all UI consumers or current playable completeness.

External refresh: [The Climb published repository](https://github.com/tomlipo/the-climb),
[MR2 developer site](https://mcolotto.github.io/magic-research-demo/website-mr2/),
[Theory of Magic maintainer listing](https://galaxy.click/play/072) and
[Idle Loops original](https://stopsign.github.io/idleLoops/index.html).
Opening a page is not a fresh gameplay test. Pinned source links for O2/O4/O5
remain in the comparison above; the original Idle Loops page does not verify
every Omsi-specific detail.

Recommended first candidate: O1. Use the gap audit's existing G1 journey before
choosing any implementation. O2/O4 offer further depth, but each needs a selected
item, role or place. Keep guidance optional, carryover means-dependent, and the
current one-realm/one-prestige milestone intact.

Checks: document/source inspection and public-page refresh only. No build,
gameplay test, save access, commit or push was performed.
