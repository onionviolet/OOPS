# Gu abilities and killer moves: considerations (2026-11-10)

Palette, not spec. Working defaults under AD56, adjustable. Requested by Weibao: "also consider abilities tied to gu, gu killer moves, which is moves made by using a combinatiobn of gus, other stuff and more?" ([log](gm/USER_VISION_LOG_2026-11.md#gu-abilities-and-killer-moves-2026-11-10)).

What exists: the [world card](WORLD_CARDS.md) says Gu are living power you keep and feed, and that killer moves come from recipes combining several Gu ("recipes, not grinding"; "no skill grows from use alone"). In code, each lead-life Gu is an actor fact (`actor.<vital>.moonlight_form`) read by story beats in `src/world_packs/book_gu_lead_*.js`; feeding runs through the keeper (`book_world_gu_keeper_domain.js`) and the needs seam; the pet being record (CPR10) now holds a kept Gu. No ability model or killer move exists in code. The [area guide](AREA_GUIDE.md) records two live routes into one structured ability descriptor (power grammar to spell seam to ability records, and the HP/LOTM spell route), so a Gu ability lands on that descriptor, not a third route.

Canon facts below are stated from the community wiki digest and the read books; each needs a text locator when a slice uses it (SKR1, SKR21).

## Gu abilities

| Code | Default | Dial and reason | Builds on |
| --- | --- | --- | --- |
| GKM1 | **A Gu's ability is its function, read from the being.** Each Gu kind has one function (a blade of moonlight, a jade skin), a path, a rank and a use cost in essence of that rank. Using it is a command that quotes cost and readiness, then revalidates (AR7). | Dial: a world sets how many functions a kind has. Reason: canon Gu are specialised living tools. | CPR10 being record, ability records |
| GKM2 | **Readiness is the Gu's real state.** A hungry, injured, rebellious or absent Gu cannot act or acts weakly; rank above the user's aperture cannot be driven. | Dial: rebellion odds per world. Reason: "your strength is your stable" (world card). | Needs seam, being record |
| GKM3 | **Some Gu are spent by use.** Single-use and consumable Gu leave the being record when used; refinement consumes inputs. | Reason: canon single-use Gu and refinement; conserved custody (SR, ITM). | Spoilage-style instance ids |
| GKM4 | **Immortal Gu are one of a kind.** A kind marked unique has one instance in the world; owning it is a fact others can hunt. | Dial: uniqueness per kind. Reason: canon; gives theft and fate pressure. | Acting powers, news travels |

## Killer moves

| Code | Default | Dial and reason | Builds on |
| --- | --- | --- | --- |
| GKM5 | **A killer move is a recipe over Gu roles.** One core Gu plus supporting Gu in named roles; the recipe names roles, not specific instances, so any owned Gu that fills a role can serve. | Reason: canon moves pivot on a core Gu; roles let the lead improvise substitutes. | MR making rules (recipes as data) |
| GKM6 | **The move's effect follows from its parts.** Effect is composed from the core function plus what each supporting role adds (reach, force, duration, concealment), the way Ars Nouveau composes form, effect and augments and Noita stacks modifiers; a canon move is a fitted recipe calibrated first (SKR21), not a lookup row. | Reason: AD38, things work by how they work; it also lets invented moves exist. | `docs/research/ars-nouveau`, `docs/research/noita` |
| GKM7 | **Knowing a recipe is knowledge.** Recipes are learned, bought, stolen, deduced or inherited, and sit on the KNW ladder (known, guessed, open) per character, as items now do (ITM23). | Reason: canon inheritances and recipe trade. | Item knowledge, KNW3 |
| GKM8 | **Casting costs the sum and risks backlash.** Essence for every Gu used, at their ranks; a failed role (missing, hungry, wrong rank) fails the move with a backlash scaled by how far it fell short. | Dial: backlash severity per world. Reason: canon risk of untested moves; no forced weakness beyond the mechanism (AD55). | Harm carrier (RCL5) |
| GKM9 | **Practice makes a move reliable, Gu do not level from use.** A move's reliability rises with practice of that recipe; the Gu themselves grow only by feeding and refining. | Dial: this is where the mastery lane's per-action mastery fits the Gu world, scoped to moves. Reason: world card absence ("no skill grows from use alone") applies to Gu, while canon cultivators still drill moves. | Mastery lane |
| GKM10 | **One Gu, one move at a time.** A Gu busy in a running move cannot serve another; sustained moves hold their Gu until released. | Reason: conserved custody. | AR3 one authority |
| GKM11 | **Dao marks bend moves.** Marks of a path on the body strengthen moves of that path and interfere with others. | Dial: interference strength. Reason: canon dao marks; makes path choice matter. | Later slice |
| GKM12 | **Invention is a route.** A lead can deduce a new recipe from Gu they own and moves they know (wisdom path, trial); invented recipes are `original` rows with a reason (SKR17). | Reason: Fang Yuan improvises; route variety (STY33). Achievements' "Another way" can read it. | Achievements lane |

## Other Gu stuff

- **Refinement combines Gu into a higher rank** (exists as a story beat; a recipe seam would share GKM5's shape).
- **Gu houses and formations**: many Gu acting as a fixed structure, the killer move shape applied to a place (SR sites).
- **Taking another's Gu**: theft, killing a master to free a Gu, Gu loyalty; reads custody and news.
- **Cross-world (AR11)**: the seam is "a composed ability from owned living or crafted parts". Second cases: Ars Nouveau glyph spells, LOTM rituals combining ingredients, D&D metamagic.

## First slice (proposal)

One canon mortal killer move Fang Yuan uses early, built from Gu he holds at that point, calibrated to the text, plus one substitute that works by mechanism. Shown in a move panel listing roles, which owned Gu fill them and their readiness. Save, reload and import keep known recipes and practice.
