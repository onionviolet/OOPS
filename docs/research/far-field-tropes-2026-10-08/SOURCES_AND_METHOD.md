# Source notes and method

Date: 2026-10-08, America/New_York. Role: far-field inspiration and trope GM. Human-authorized owner: [assignment](../../gm/dispatch/far-field-tropes-2026-10-08/ASSIGNMENT.md). All output ownership is inside this directory.

## What was actually inspected

Project documents: PROJECT.md, GAME_MASTER_PROMPT.md and its refresh protocol, the north star's full heading inventory and relevant sections, WORLD_CARDS.md's card structure and examples, RESEARCH_GENRE_TROPES.md and RESEARCH_GENRE_SWEEP.md. Large batched reads exceeded the output limit; smaller follow-up excerpts recovered the sections relevant to this task. This is not a claim that every line of the 2,700-line north star was read sequentially. Heading inventory, targeted searches and focused reads were sufficient for the assignment's requested skim and the interaction novelty check.

The assignment's relative links for the north star and world cards point at the wrong location from its nested dispatch folder. The actual inputs were `docs/LIFE_SIM_NORTH_STAR.md` and `docs/WORLD_CARDS.md`. The assignment itself was not changed.

Read-only gameplay source: `src/game_time.js`, `src/npc_lives.js`, `src/life_record.js`. These support the modest capability boundary in PROPOSALS.md. Source availability is not proof of browser behavior or the whole current engine.

Public sources were fetched/search-inspected with the web tool during this task. Each genre row links the page that supports its specific named source feature. Product descriptions and official manuals are preferred for game rules; community discussions are used only for reader interests. No user account, private save, novel-library prose, external message or installed-game interaction was used.

## Evidence levels

| Level | Sources used | Supports | Does not support |
|---|---|---|---|
| Official rules/manual | Blades progress clocks; Apocalypse World creator's reconsolidated moves; Diplomacy publisher rulebook; Tamagotchi Connection manual; Sims official guide | Named rule structures and result patterns | An exact YAIR implementation, balance or universal genre law |
| Developer/publisher description | Konami Tokimeki 4; Monster Prom; Nintendo Animal Crossing/Majora; publisher Steam pages for Two Point, PlateUp, Planet Coaster, Obra Dinn, Shadows, Outer Wilds, Hades, Inscryption, Slay the Princess, Slay the Spire, Crypt, Cookie Clicker, AD, NGU, PM2; Hanako LLQ; Shining Rock Banished; Koei Tecmo Monster Rancher; Candywriter BitLife; Shawn Tomkin Ironsworn creator pages | Stated loops and broad mechanics | Full routes, undocumented thresholds, late-game edge cases or a completed audit |
| Official wiki / live game | Stardew friendship/crops, Kittens mechanics, Clocktower strategy, Trimps live UI and official update descriptions | Stated friendship/crop/season/job/vote/map/Portal behavior | Playtest results or all version differences |
| Full discovery page | RR Best Rated; NU Sect Development, Kingdom Building, Special Abilities, Hidden Abilities, Game Elements, Academy, Revenge | Tags, premises and visible entries | Popularity percentages, a ranked trope table, chapter-level canon |
| Indexed excerpt / discussion | RR popular/trending/dungeon lists; NU Villainess and Time Loop; r/ProgressionFantasy crafting, academy, romance, kingdom and evolution requests | Bounded discovery signals and expressed individual preferences | Representative audience preference, completeness or guaranteed current ordering |
| Local prior research | Two existing genre dossiers and north star | Continuity and overlap avoidance | Fresh verification of each old citation |

[Ironsworn's creator page](https://shawn-tomkin.itch.io/ironsworn) explicitly describes creative prompts and identifies the reference guide's oracle tables. The [publisher's licensing page](https://tomkinpress.com/pages/licensing) also identifies oracle tables. The rulebook's product page is a download lead, not a claim that the complete rulebook was read. No oracle table text was copied.

[Trimps' official updates](https://trimps.github.io/updates.html) supplement the live game for map and Portal progression. This is a feature-level documentary check, not a source-code audit. Kittens' wiki and game claims remain version-sensitive.

## Failed routes and gaps

After a failed fetch, switch to a materially different source route; do not loop through URL variants to force access. Successful pages were revisited only to locate actual evidence, not to retry a failure.

| Attempt | Outcome | Changed route / remaining boundary |
|---|---|---|
| EA Sims 4 product page | Web timeout/400 | Used official EA help and official player-guide PDF, plus indexed EA creation description. No signed-in state needed. |
| Apocalypse World homepage | Fetch error | Used indexed official reference-PDF lead. The old-domain second-edition PDF also failed; switched to the creator's separate lumpley.games reconsolidated move sheet, successfully read. This is labeled **reconsolidated**, not silently claimed to be 2e. |
| Frostpunk Steam page | Age-check page, no product details | Used indexed publisher-written product description. frostpunkgame.com also failed. Exact law numbers/branches were omitted; this remains shallower coverage. No age gate interaction or purchase. |
| NU Monster Evolution URL | Inaccessible | Used r/ProgressionFantasy evolution discussions and RR indexed nonhuman/core tags. No claim that the inaccessible NU tag exists or was read. |
| NU Reincarnated in Another World | 403 | Used accessible NU Special Abilities listings and villainess discovery definition, which contain reincarnation/transmigration premises. No full reincarnation-tag inventory. |
| NU Crafting URL | Fetch error | Used two reader crafting request threads and indexed RR crafting tags. No claim that a failed slug is a valid tag. |
| Orteil live Cookie Clicker page | HTML shell provides limited mechanical detail | Used developer/publisher Steam description for producers, upgrades, mini-games and permanent upgrades. The game was not played. |
| Persona, Harvest Moon, Pokemon, Werewolf | Not separately fetched or audited | Retained as comparison leads; other named inspected examples satisfy their genre families. No precise rules attributed to these leads. |

## Popularity and interpretation

The assignment asks for 25-40 popular tropes. This packet supplies 36 recurring discovery candidates. There is no source here that measures a top 36 across RR and translated web fiction. A best-rated list ranks particular works; tags overlap; current popularity, ratings and reader requests select different samples. The report says that plainly. “Direct” and “adjacent” labels distinguish family evidence from narrower extrapolation. The 144 variations, all life-sim mappings and the appeal explanations are GM design synthesis. They are not presented as paraphrased findings from a popularity poll.

No raw source prose was saved. All source descriptions are short paraphrases. No single source's mechanics are exhaustively reproduced. Source attribution stays close to claims in Part 1; Part 2's evidence key links every row to its evidence family.

## Novelty and shared-work drift

The north star changed during this task. Focused rereads caught new romance/far-field/trope sections, and a term search covered gifts, curriculum, handoffs, testimony, custody, calendars, policy, museums, evidence, invitations and related concepts. It already covers the *families* used here. The final drift check also reread new power-scaling, player-perspective, sex/gender/body and crafting/research sections. Item histories and apprentices are now explicitly present, while the specific social-meaning and competence-signoff interactions remain extensions. Each Part 3 idea therefore names a narrower decision added to that family. The novelty claim is bounded to these specific interactions and the inspected live north star, not the entire repository or all published fiction.

[INPUTS.json](INPUTS.json) contains input hashes captured mid-research. [VALIDATION.json](VALIDATION.json) records the final local document checks and input drift. The checkpoint states the delivery and proposal status. Shared dirty work was preserved. No test, browser, build, commit or save check was run because this task forbids gameplay work.
