# Upstream direction and future adaptation

Checked 2026-10-01. Requested research: consider the original developer's current plan, what the fork can use, and how to adapt it later. This is a source review and integration proposal. It selects no merge, mechanic, plot or save migration. [PROJECT.md](../PROJECT.md) owns accepted direction; [ENGINE_EXPANSION.md](ENGINE_EXPANSION.md) owns our architecture proposal.

## Finding

Miktaew is developing a substantially different v0.6 foundation in the **development repository**, while both hosted releases remain on v0.5.5.30. The new foundation overlaps with our interests in branching stories, individual NPCs and fights involving several actors. Our current fork starts from the older foundation. Future engine work should compare the newer implementation before recreating it.

Current foundation choice: the user's follow-up selects beginning from v0.6. [PROJECT.md](../PROJECT.md) owns that direction and [v0.6 migration](V06_MIGRATION.md) records the runnable isolated candidate and remaining expedition/save port. We can follow useful upstream engineering while keeping our own worlds, progression and stories.

## Verified snapshot

GitHub branch and commit APIs were checked directly, together with pinned source files. Branch names differ between repositories; do not assume the README's generic hosted-branch spelling is exact.

| Surface | Observed revision | Meaning |
|---|---|---|
| Official repository `master`, also the local fork's committed base | [`e3356432ad`](https://github.com/miktaew/yet-another-idle-rpg/commit/e3356432ad5112f30842cfe6a6b5c3a4ced77de9), 2026-06-23 | v0.5.5.30, plus our uncommitted fork work |
| Official hosted branch `ghpages` | [`fc047803a`](https://github.com/miktaew/yet-another-idle-rpg/commit/fc047803a3f6e1c9a032cce1fc407bfd1c906fc7), 2026-06-26 | Release merge of v0.5.5.30 |
| Development hosted branch `gh-pages` | [`87ccb1812`](https://github.com/miktaew/yet-another-idle-rpg-dev/commit/87ccb1812a0a37fd5b5f64514a075f90a32ab678), 2026-06-23 | Also the v0.5.5.30 release merge; the hosted dev game does not demonstrate the latest rewrite |
| Development source `master` | [`25afe1a879`](https://github.com/miktaew/yet-another-idle-rpg-dev/commit/25afe1a879459d85af609088a046ac4f1d3893e1), 2026-10-01 | `src/game_version.js` declares v0.6; 49 commits ahead of our committed base, affecting 61 file paths |

The divergence count comes from the [pinned GitHub comparison](https://api.github.com/repos/miktaew/yet-another-idle-rpg-dev/compare/e3356432ad5112f30842cfe6a6b5c3a4ced77de9...25afe1a879459d85af609088a046ac4f1d3893e1). It compares committed upstream revisions, not our dirty working tree. The development `refactoring` branch ends at the September 17 combat rewrite, which has already been merged into development `master`.

## What the developer is actually doing

The [v0.6 source changelog](https://github.com/miktaew/yet-another-idle-rpg-dev/blob/25afe1a879459d85af609088a046ac4f1d3893e1/changelog.html#L69-L111) describes composition-based models, shared availability rules, quest/clear conditions, distinct branch locks and generalized combat. It also adds character biography choices, gathering progression, tool crafting, mill/fishing activities, equipment comparisons and developer utilities. Biography is mostly cosmetic; race/height stat bonuses are optional, disabled by default and described as unbalanced.

The development commits show the sequence: [component rewrite, August 27](https://github.com/miktaew/yet-another-idle-rpg-dev/commit/19011a0151c2e2bd5a7b4e5566ef6dc95c895b33); [combat rewrite, September 17](https://github.com/miktaew/yet-another-idle-rpg-dev/commit/c5de678cfbd5b0879c5460b5b861fc967af660ac); [reward processing update, September 24](https://github.com/miktaew/yet-another-idle-rpg-dev/commit/dec24cf83b5e29f553e53addfe6db44a262413a0); [text placeholders and gender selection, September 27](https://github.com/miktaew/yet-another-idle-rpg-dev/commit/a6667b9df682b07ceff78c66b54b75d682589d11). These are implemented source changes, not evidence of a tested release or future delivery dates.

The explicit future content sequence in the [current source FAQ](https://github.com/miktaew/yet-another-idle-rpg-dev/blob/25afe1a879459d85af609088a046ac4f1d3893e1/help.html#L69-L92) is **town access, then magic**. It says the town and second gate are inaccessible. Typed physical/elemental/magic damage and resistance skills appear as TODOs in [`Person.takeDamage`](https://github.com/miktaew/yet-another-idle-rpg-dev/blob/25afe1a879459d85af609088a046ac4f1d3893e1/src/models/person.js#L463-L499), so mana fields and magic-related descriptions do not establish a playable spell system.

Inference: the current public work prioritizes a reusable character/combat foundation and deeper ordinary play. No complete dated roadmap was found in the inspected README, FAQ, changelog, branch history or issue discussions. Discord planning was not inspected. No upstream commitment to our multi-world campaigns, prestige, time travel or autonomous rival lives was established by these sources.

Contributor proposals require separate attribution. For example, [PR #245](https://github.com/miktaew/yet-another-idle-rpg-dev/pull/245) offers localization, extra content, titles and checks from another fork and remains open. Its contents are neither an accepted Miktaew roadmap nor evidence that every offered feature is in development `master`.

## Useful overlap with our game

The adaptations below are our proposals. The cited source establishes the upstream capability, not our suggested gameplay or its balance.

| Upstream capability | Proposed use in our fork | Boundary and adoption cost |
|---|---|---|
| [Availability component](https://github.com/miktaew/yet-another-idle-rpg-dev/blob/25afe1a879459d85af609088a046ac4f1d3893e1/src/components/availability_component.js), with visible/start/success conditions and separate locked/finished status | Explain blocked choices; close a competing route without calling it completed; vary dialogue using facts, knowledge and identity | Adopt the semantics through our rules adapter first. Wholesale conversion changes many content definitions and saved statuses; unknown knowledge still needs our explicit handling |
| [Person](https://github.com/miktaew/yet-another-idle-rpg-dev/blob/25afe1a879459d85af609088a046ac4f1d3893e1/src/models/person.js) and [NPC registry](https://github.com/miktaew/yet-another-idle-rpg-dev/blob/25afe1a879459d85af609088a046ac4f1d3893e1/src/data/npcs.js) share inventory, equipment, levels, biography and dialogue components | A peer or rival can have its own possessions and preparation; a companion can use real equipment | Promising foundation for actor ownership. NPC XP gains are disabled by default. Goals, travel, relationships, schedules and durable narrative fate require additional systems |
| [Combat](https://github.com/miktaew/yet-another-idle-rpg-dev/blob/25afe1a879459d85af609088a046ac4f1d3893e1/src/models/combat.js) accepts attacker/defender arrays and special fights without normal progression rewards | Test a duel, a companion encounter, or an authored rival-versus-monster scene before population simulation | September's class depends on the component models, main-module functions and combat UI. It is not an independent drop-in file or an autonomous world scheduler |
| [Rewards/MixedRewards](https://github.com/miktaew/yet-another-idle-rpg-dev/blob/25afe1a879459d85af609088a046ac4f1d3893e1/src/rewards.js) organize payouts, locks and random reward mixtures | Reuse a payout vocabulary and clean reward summaries for events and expeditions | This is sequential legacy processing with fresh randomness; our events require durable transactions. Keep recorded draws, revalidation, committed costs and resolve-once receipts outside it |
| [Equipment comparison](https://github.com/miktaew/yet-another-idle-rpg-dev/commit/bda1674eed06483daac60e8a4c2f084fa3166c74), configurable developer tools and [tool/mill additions](https://github.com/miktaew/yet-another-idle-rpg-dev/commit/d59d62671ce4ca5ec91c4cf98df8981c5933212d) | Improve equipment decisions and fixture testing; make ordinary crafting/gathering support expedition preparation | Good candidates for individual semantic ports. Check dependencies and total preparation time; upstream content can otherwise add another mandatory grind |

Generalized fights do not solve our enemy-protagonist/concurrent-character proposal. The source still imports one global main character and uses DOM callbacks, real-time timers and `Math.random()`. `load` explicitly does not restore current enemies; `Combat.reset()` restores fighters' `is_alive` flags. A durable rival death or injury must therefore belong to saved story/actor state, independent of encounter cleanup. A background fight also needs an authored consequence instead of awarding loot merely because a simulation ran. These are source-level limits, not results from executing v0.6.

## Keeping future adoption possible

Three development approaches remain available:

| Approach | Appropriate point | Main tradeoff |
|---|---|---|
| Selective ports on our current base, an alternative | Small quality-of-life fixes or an ordinary event | Fast playable delivery; later changes to the same areas require reconciliation |
| Coordinated v0.6 foundation migration, now selected | Start the candidate now and port current fork behavior before further actor/combat expansion | Reuses shared actor/combat work; requires a broader content, API and save migration |
| Independent engine evolution with occasional upstream ideas | If campaigns, rewinds or world rules cause substantial divergence | More design freedom; our fork owns ongoing maintenance and compatibility |

Keep new story/world state independently versioned, definitions separate from progress, and legacy access behind small adapters. Do not write new content directly against every v0.5 global or every v0.6 component. Preserve stable IDs and isolate our content registrations so a later port has a bounded surface. This also allows upstream's town/magic arc to become one campaign path while original or book-inspired worlds use different rules. There is no need to wait for upstream magic before prototyping a separate, explicitly identified power path.

For a future coordinated port, checkpoint the then-current fork and assess a **pinned** dev revision in an isolated checkout. Compare the event and save behavior first; bring the component/content/combat dependencies together when necessary. Keep `origin` pointing to the personal fork and `upstream` to the original official repository; use a separately identified development source if fetched. No remotes or Git refs were changed in this research pass.

The migration must preserve our validated file importer, UTF-8 marker, legacy decoding, regional reputation, earned first-clear handling, dormant `retired_content` and any extension namespace. The upstream snapshot changes the save layout to use registries such as `levels`, `inventories`, `availabilities` and `npcs`; its importer writes the decoded file to localStorage before the real loader runs. Its serializer does not preserve our custom namespaces automatically. Matching game-version strings do not prove save compatibility, and loading a fork export in an upstream build is not a supported roundtrip.

The playable migration gate is one existing progression route plus one event and one fight involving an additional actor, built from the changed source on a fresh origin. Generated old-base, current-fork and retired-prototype fixtures must survive save/reload/export/import with their supported progress, stable payouts and rejected-file protection intact. This would establish a bounded migration, not complete upstream content coverage or a fully simulated cast. Human review would still judge whether the new fight and choice improve play.

## Verification of the initial research pass

Read-only GitHub API checks and pinned-source inspection established the revisions and code differences. Local `AGENTS.md`, `PROJECT.md`, the source version, event integration under development and architecture proposal were read for comparison. The working tree already contained substantial uncommitted work and continued changing during research; this pass does not claim another chat's unfinished source is browser-verified. Only this research document and its project/architecture links were edited. No upstream merge, source implementation, build, browser playtest or personal-save access occurred here.

## Superseded initial recommendation

Preserved from the initial research pass before the user's v0.6 foundation choice:

> Recommendation: continue the small playable event on our current fork, adapt independent improvements as needed, and assess a coordinated v0.6 migration before committing to persistent companions or broader combat changes. We can follow useful upstream engineering while keeping our own worlds, progression and stories.
