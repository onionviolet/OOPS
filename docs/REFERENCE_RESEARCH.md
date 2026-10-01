# Reference research and discovery-led progression

Research date: 2026-09-30, America/New_York.

Scope: live GitHub fork inventories for both YAIRPG repositories, selected fork comparisons and source reads, Proto23's published HTML/source, Your Chronicle's developer listing, and a first primary-source lore sample. This is not a full playthrough, exhaustive fork audit or deep audit of whole novels. Remote source capability does not prove deployed gameplay, balance or compatibility with this fork.

## Current steering and recommendation

Weibao raised cultivation as a possible separate or future path, with access earned by finding relevant techniques and other prerequisites. Treat placement and gates as under design. Immediate Jade Hollow access is a prototype convenience, not accepted campaign structure. Keep the existing implementation available for review until a replacement is built and checked.

Recommendation: deepen the ordinary adventure around discoveries, techniques, expeditions and factions before expanding cultivation. Build shared knowledge and unlock rules usable by martial, craft, magical and later cultivation paths. Cultivation should be one possible development of the character, not a compulsory global multiplier that supersedes every ordinary skill.

## Selected fork findings

GitHub API comparisons used each repository's current default branch. Ahead/behind counts describe the checked snapshot and can change. Published previews were not exercised.

| Reference | Evidence inspected | Design lesson |
|---|---|---|
| [SchokoKaramel mod](https://github.com/SchokoKaramel/yet-another-idle-rpg) | 28 commits ahead of stable master, none behind. README and quest source describe a weathered book leading through existing climbing/camping to an old fort, new enemies, loot and recipes. Also adds gathering/training/loot skills, death recovery and milestone summaries. | Strong precedent for clue → preparation → expedition → discovery. Evaluate each skill by its new decisions; global XP inflation is a separate pacing choice. |
| [BippyCost tweak](https://github.com/BippyCost/yet-another-idle-rpg-tweak) | 27 commits ahead of stable, none behind. README describes an XP slider, shorter time requirements, increased gathering and drop rates. | Use faster pacing for experiments and compare time-to-decision. Faster numbers alone do not create deeper progression. |
| [GauTech / Haylen experimental RPG](https://github.com/GauTech/experimental-idle-rpg) | [Changelog](https://github.com/GauTech/experimental-idle-rpg/blob/main/changelog.html), magic.js and allies.js. Documents mana/cooldown spells, auto-casting, books unlocking spells/stances, environmental damage, enemy effects, bosses and a new world. Ally source explicitly describes untargetable damage platforms. | Books can unlock actions; hazards and enemy mechanics can make builds differ. A real companion system needs roles and costs beyond free damage. Study the design; do not assume drop-in code compatibility. |
| [Upstream dev v0.6](https://github.com/miktaew/yet-another-idle-rpg-dev) | game_version.js, current commits and [changelog](https://github.com/miktaew/yet-another-idle-rpg-dev/blob/master/changelog.html): availability components, quest/clear conditions, mutually exclusive locks, symmetric combat supporting fighters on either side, equipment comparisons, tool crafting and fishing additions. | Audit before implementing branching availability or party combat. Development source is not an accepted stable upgrade and has not been migration-tested here. |
| [BD-Jim](https://github.com/BD-Jim/YAIRPG_Dev_Jim_Mod) and [OnonokiNonon](https://github.com/OnonokiNonon/yet-another-idle-rpg-fork) | At inspection, BD-Jim master was 3 commits behind dev with no unique ahead commits; OnonokiNonon master was identical to dev. | Do not count merged upstream work twice or infer unique additions from repository names. Other branches were not exhaustively inspected. |

Inventory endpoints: [stable forks](https://api.github.com/repos/miktaew/yet-another-idle-rpg/forks?per_page=100), [dev forks](https://api.github.com/repos/miktaew/yet-another-idle-rpg-dev/forks?per_page=100). Several other forks exist; their unique features remain unassessed.

## Proto23 and Your Chronicle

The expanded shortlist, user-endorsed research direction and further niche browser RPG candidates are in [Niche game references](NICHE_GAME_REFERENCES.md). Accepted direction is owned by `../PROJECT.md`; that dossier distinguishes direct character-RPG candidates from adjacent interaction and automation references.

YAIRPG is inspired by Proto23, not a checkout of Proto23's codebase. Preserve that distinction when describing the base game.

| Reference | Verified basis | Proposed use here |
|---|---|---|
| [Proto23](https://23html.github.io/) | [Published source](https://github.com/23html/23html.github.io/blob/main/index.html) contains weapon masteries, skill milestones, titles, training-potential bonuses, quests, books/manuals and furniture. Bladesman Manual grants Sword Mastery XP and a mastery XP modifier; read books can contribute to a home book bonus. | Dense progression should connect to world objects and activities. Give mastery recognizable utility and make knowledge/home improvements tangible. Source strings mentioning cultivation do not establish a complete cultivation system; no such claim is made. |
| [Your Chronicle](https://store.steampowered.com/app/1546320/Your_Chronicle/) | Developer describes story action buttons, automated dungeons, monster summoning with skills/equipment, Routine upgrades, action/dungeon automation, offline bonus and choice-dependent endings. | Useful reference for story unlocking systems, automation and party roles. Our design comparison: YAIRPG/Proto23 lean toward character skills, equipment and locations; Your Chronicle leans toward story-action/resource progression and party/routine management. This is a design interpretation, not a measured playtest result. |
| [Melvor Idle](https://store.steampowered.com/app/1267910/Melvor_Idle/) | Developer presents interconnected skills and combat/noncombat progression. | Study how gathering and crafting keep feeding equipment and combat, with readable requirements. Do not assume its entire skill roster belongs here. |

Similarity to Your Chronicle is meaningful at the genre and progression-structure level. It does not establish shared code or make it the same experience. Select features by the decisions they support rather than copying its currencies, reset layers or volume of action buttons.

## A technique framework that fits ordinary adventure

Proposal, not implemented:

Discovery → acquisition → comprehension → practice → application → mastery.

Separate these states. Owning a manual should not automatically mean understanding it. Understanding a stance should not imply perfect execution. Mastery should open interactions or change tradeoffs, not just compound XP rates.

Example ordinary chain: hear of an abandoned watchpost → obtain a map or journal → prepare rope and supplies → explore with combat or expedition preparation → recover a damaged manual → ask a mentor to interpret it or restore it through research/craft → practice the technique → use it to defeat a particular defense or traverse a route.

Example later cultivation chain: notice unusual herbs or a sealed inscription → earn access to a teacher or recover a circulation method → comprehend it through relevant knowledge → complete preparation and an observable initiation → unlock qi training → find specialized techniques and choose a path. These names and rules are original gameplay proposals, not canonical book lore.

Offer at least two authored acquisition routes for the first foundational technique. A rare drop can accelerate acquisition but should not be the only entry. Hints should state a next lead without spoiling every reward. Avoid requiring everyone to grind every profession: alternatives should change preparation, cost or later strengths.

Technique identity could include source/provenance, required knowledge, practice activity, energy/tool needs, environment compatibility, effect, drawback and mastery evidence. Limit equipped techniques or practice commitments if needed to preserve choices. Prefer reversible early specialization, with explicit consequences for later commitments.

## Existing integration points

Local src/items.js has BookData with reading time, skills metadata, bonuses and rewards. src/main.js/do_reading processes rewards on completion. src/quests.js supplies sequential tasks and reward unlocks. src/conditions.js checks skills, items, stats and flags. These are foundations for a manual/mentor chain, not proof that every declared field is enforced in every UI and save path. Verify actual enforcement when implementing.

Use stable technique IDs and additive versioned knowledge state. Save acquisition, comprehension and practice separately. On reload, recalculate effects without granting completion rewards again. If cultivation access changes, preserve existing prototype progress through a documented compatibility rule rather than trapping already-developed characters behind a new gate.

Offline progression is a distinct missing capability in the inspected local load path. Define allowed activities, elapsed-time limits, consumable exhaustion, defeat and travel behavior before adding catch-up. Automation needs stop rules and summaries. Neither is solved by adding another browser timer.

## First lore research sample

| Source | What is supported | Gameplay interpretation and boundary |
|---|---|---|
| [Wuxiaworld genre glossary](https://www.wuxiaworld.com/page/general-glossary-of-terms) | Describes cultivation methods, guarded manuals, sect instruction and different wuxia/xianxia/xuanhuan conventions. | Knowledge access can be a meaningful gate. The glossary does not supply one universal realm ladder or justify imposing identical world rules everywhere. |
| [Tribulation of Myriad Races, chapter 9](https://www.wuxiaworld.com/novel/tribulation-of-myriad-races/tmr-chapter-9) | Explains physical and willpower-led routes, research/language study, different resource/time demands and the cost of forced advancement to foundations. | Distinguish training routes by how preparation converts into strength. A research route can spend longer learning before an advancement window; a martial route can progress more directly. Recovery and foundation tradeoffs are proposals. Do not turn the chapter into proof that research is weak in combat. |
| [Cradle, author's series page](https://www.willwight.com/cradle.html) and [publisher's Unsouled synopsis](https://www.panmacmillan.com/authors/will-wight/unsouled/9781037420221) | Original cultivation-inspired magic system; protagonist is barred from practicing his clan's sacred arts. | Social access and disputed labels can shape acquisition. Specific cycling, path, body and advancement mechanics need chapter-level verification before adaptation. |
| [Mother of Learning, author's publication](https://www.royalroad.com/fiction/21220/mother-of-learning) | Synopsis establishes a time loop and repeated learning. | Knowledge persistence is a useful candidate for a later loop world. This alone does not validate exact spell rules, what survives a loop or a universal reincarnation mechanic. |

These are reference candidates, not newly confirmed favorites or authorized direct fan settings. The more detailed Myriad Races sample is a first chapter audit, not a whole-series conclusion.

## Research that should precede the next large expansion

Use a bounded source dossier for each candidate system: exact chapter/source, acquisition route, prerequisites, practice, expenditure, limitations, failure/recovery, progression transition and social/environmental dependencies. Keep canonical statements separate from interpretation and invented gameplay.

Compare a small set of genuinely different rules: a martial/cultivation tradition, research-led magic, and a non-cultivation alternative. Specific pathways from Lord of the Mysteries, Gu systems from Reverend Insanity and trial/ability structures from Shadow Slave remain candidates requiring primary-source verification; earlier title discovery is not lore evidence.

Extract a playable loop rather than writing an encyclopedia. Each adopted feature needs an example decision, at least two viable approaches, an understandable cost, integration with an existing skill, a save contract and a review gate. Do not force breakthrough to imply rebirth; decide what each reset means in its world.

## Five priorities

1. Audit upstream v0.6 and selected fork differences for reuse; choose an integration base with save and browser verification before merging anything.
2. Build one ordinary expedition with a clue/manual/mentor chain and two useful acquisition approaches. Gate an actual technique or route, not a cosmetic badge.
3. Deepen combat and craft choices around that expedition: enemy counters, consumable preparation, equipment traits and specialized technique utility.
4. Improve long-term usability: unlock journal, equipment comparisons, activity summaries, safe automation and explicitly designed offline progress. Deliver in small verified increments.
5. Research one later power path deeply, then place cultivation behind an earned entry with save compatibility. Test a distinct second world's rule and a useful interaction only after the ordinary discovery loop works.

Immediate playable acceptance proposal: fresh martial and craft/research characters can discover the same expedition, acquire a useful technique through different means, apply it to a meaningful obstacle, understand their next lead and resume after reload. No implementation, upstream merge, commit or release occurred during this research pass.
