# itch batch: crafting and building, 2026-10-22

Genre pass for [the decode brief](DECODE_BRIEF.md). Static reads only; nothing
run, nothing committed. All findings are proposals (AD32). No game states a
license, so everything here is ideas only. Raw files, hashes and line locators:
`private/BATCH_CRAFTING_NOTES.md` and the per-game folders.

Dedupe: none of the screened titles appear in `docs/` outside the earlier itch
batches (grep of 36 titles; "Immortality Factory" and "Lootun" turn up in older
notes and were skipped). Compared against MR1-MR36, `CRAFTING_ENGINE.md`, the
weaponcraft palette (WC2 shape choices, AB2 material profile) and
`src/craft_resolver.js`.

## Screened (about 30), one line each

Pulled from six HTML5 tag listings (198 unique titles). Decoded titles are in
the next section.

| Title | Read | Verdict |
| --- | --- | --- |
| Hacksmith | page + decoded | Decoded below, richest of the batch |
| Stacksmith | page + recipe resources | Decoded below |
| Age of Iteration | page + bundle | Decoded below |
| Heat & Hammer | page text only | Card roguelite; orders are predicates over numbered blanks (any metal; two copper and a silver, each at least 4; sum 18). Remelt heats the forge, overheat burns an order. Build is an 864 B shell over an external host and later years need an account, so stated-not-found. Play only if the order-as-predicate idea appeals. |
| Alchemy Swordsmith | page + strings | Reroll-and-bless loot sim; cost of blessings rises. Compiled GameMaker, no readable logic. |
| Craftomation 101 | page + archive strings | Programmable robots that combine materials to discover new elements (sound cues "Element Discovered" and "Element Crafted" exist). Defold archive is compressed; recipe data not read. |
| Blades Beyond Repair | decoded | Thin: lookup tables for blade length, metal price multiplier and three quality states. |
| Beltmoor | decoded | Thin: balanced belt line, slow machine jams the belt, offline pay is half income capped at 2 h. |
| Weapons-R-Us, King's Forge, Dark Forge, Blacksmithery, Goblin Smith, Hero Smith, Steve the Smith, Soul Forge, Sharp the Blade, Kajiya | page text | Time-pressure or rhythm smithing, order fulfillment, upgrade gambling. Nothing about materials carrying into products. Skip. |
| Kraft & Slash | page text | Few ingredients, many weapons, "Mystical Atelier" custom items. Unity wasm, not read. Worth one look only if ingredient-to-weapon mapping is composed rather than listed. |
| Little Chef | page text | Physics cooking built on experimentation (1,489 ratings, 4.7). Unity wasm, not read. Candidate for play, not decode. |
| Sandustry, Increlight, Von Neumann, Cognimatica, ChemWorks, Pico-Factory, Timeworks, Artorio, Idlecraft, Lotus | page text | Falling-sand logistics, swarm expansion, probe replication, belt and bond puzzles, drag-and-drop crafting novel. Either puzzle or presentation; no property carry-over seen. Skip. |

## Decoded

### Hacksmith (beanandbits) - Godot 4.7.1, GDScript tokens decoded
Worth playing: **yes** (first in the batch). Play should confirm that the
hammer-shape step feels like shaping and not a timing test, and that a delivered
weapon's later fate (kept, dueled with, or a client's grudge) reads clearly.
- **Systems (source).** Shape is simulated: a billet of 24 slices with length
  and height, each blow flattens the struck slice and moves the displaced
  volume to neighbours or lengthens it (tip hits push more volume backward).
  Metal is conserved by construction. Weapons are target height profiles
  (one per type); the score is the area error between the hammered slices and
  the profile. Every commission also draws a "design note" that bends the
  profile (broad tip, slender, wide guard), so the same weapon type needs a
  different silhouette each time.
- Quality blends three stages by weight (forge 0.6, imbue 0.15, quench 0.25),
  then adds or subtracts: ingot bonus, 5 per crack (3 cracks shatter it),
  burn time (white-hot held 1 s leaves "Burnt", 3 s burns through), a clean
  bonus. Temper is a color target that differs per weapon (straw, bronze,
  blue); quench shows a lean that the player corrects.
- Quality is not only a number. Flaw and merit marks (burnt, soft edge,
  brittle, warped, hard edge, living hamon, well-tempered) each change a
  specific combat stat later (damage, parry window, opener zone, combo time).
  A weapon with a major flaw cannot earn the masterwork double pay even above
  the quality bar.
- Elements come from a material (ember ore, glacier iron, stormglass, serpent
  resin) and give the weapon a fixed effect. An unknown weapon type forges at
  0.7 of the hit zone; the recipe is learned by forging it once (a recipe
  recorded from demonstration, MR10).
- Failure is social, not a retry: a shattered blade becomes debt, a rage duel,
  or lost faith depending on client personality and patron favor. A wrong or
  under-quality delivery pays half or nothing and may leave a grudge that
  returns days later with the offended client stronger.
- **Representations.** Shape target shown as a profile over the billet;
  temper as a color; the delivery line names the specific flaw that cost the
  bonus ("no masterwork bonus"), so a number always has a reason.
- **Improvements.** A "struggle" counter records where the player wobbled
  (shaping, temper, wasted blows) and offers boons that address that exact
  weakness. An auto-temper option appears once the player has mastered it.
- **YAIR mapping.** MR5 (mass conserved) applies directly: the slice model is
  a concrete conserved shape. WC2 and the weaponcraft OV model (parts on a
  substrate) can take "design profile per type, bent by a note" as the shape
  check. MR16/MR17 are satisfied here (each verb changes state with a window).
  Marks that each map to one named downstream stat match MR1 and MR31. The
  grudge-on-bad-delivery loop fits AD11-style persistence of consequences
  across lives and the household/relationship owners; `src/heir_inheritance.js`
  and `src/home_staff.js` do not model clients. YAIR has `alloy_equipment.js`
  (one profile) but no shape-error scoring: grep of `src/` found no
  profile-vs-hammered-silhouette check.

### Stacksmith (tidepoolgames) - Godot 4.4.1, recipe resources read
Worth playing: **short look**. Play should confirm that tool and station cards
(anvil, blacksmith, heating, sharpening) are never consumed while materials are.
- **Systems (source).** Recipes are data resources: ingredient specs by kind and
  tags with a consume policy (`always`, `never`, with a risk-consume chance and
  a uses cost), optional property comparison fields (operator, tolerance,
  property path; unused in the shipped recipes), an outcome table and a time
  cost. Chain: ore (mined by miner cards) + heating -> copper bar; bar +
  blacksmith + anvil -> edge; edge + blacksmith + sharpening -> blade; blade +
  handle + crafting -> sword. Tool cards persist; materials do not.
- Materials carry no properties (ore_copper only), so the comparison fields
  are scaffolding. Stated-not-found: any lineage or quality.
- **YAIR mapping.** Already in `craft_resolver.js` (station-gated ops, catalyst).
  New only as presentation: stations as visible persistent things placed on the
  recipe, and a consume-policy vocabulary (always, never, risk) that matches
  MR5's "goes somewhere declared".

### Age of Iteration (loomfieldlabs) - Vite bundle, readable after formatting
Worth playing: **yes, for one mechanism**. Play should confirm that worn
trails visibly slow haulers and that traffic, not a timer, creates the wear.
- **Systems (source).** Pack-trail and cart routes carry a `wears` flag. Each
  delivery bumps a per-tile wear counter along the path; wear decays over time;
  wear bands change the tile look and shorten the leg time through a
  per-tile speed factor, so heavily used roads get faster (desire paths).
  A route's cost is the average of per-tile factors.
- Buildings declare which worlds they work in, plus power and heat; milestone
  stages list their cost plus `alternatives` (different material sets that
  satisfy the same stage), which is substitution as data rather than a
  recipe fork.
- **Representations.** Wear levels have a look per level (code throws if a level
  lacks one), so the player reads use history off the map.
- **YAIR mapping.** Closest owner: `src/known_routes.js` / home and site travel,
  plus the Making Rules for substitution (MR7/MR9: alternatives keep identity).
  A worn path exists only as a place-mark idea
  (WORLD_CORE_KIT KK3, docs); traffic-built speed gain is not in `src/` or docs
  (grep of src and docs). Offline fit: wear that only advances per delivery
  survives the branch clock without real-time cost.

### Thin decodes (one line each)
- **Blades Beyond Repair** (Godot, plain .gd): lookup tables only (bars per
  blade, metal price multiplier, quality multiplier 0.7 / 1.1 / 0.7).
  Skip.
- **Beltmoor** (plain JS): belt speed by level, slow machine jams the belt,
  offline pay half of income capped at two hours. Skip; the offline cap is
  a small data point for the branch clock audit.
- **Alchemy Swordsmith** (GameMaker): no readable logic. Skip.
- **Craftomation 101** (Defold): archive compressed; only sound names and
  strings read. The discover-by-combining premise is stated-not-found.

## Mapping to rules (new mechanisms only)

| Mechanism | Source | Rule or owner |
| --- | --- | --- |
| Conserved shape with a per-type target profile and per-order "design note" | Hacksmith | MR5, MR16, WC2 |
| Marks name a specific stat they change; bonus lost for a named flaw | Hacksmith | MR1, MR31 |
| Failure consequence set by client personality, patron favor and a returning grudge | Hacksmith | AD11 persistence, household/relations owners |
| Recipe learned by one demonstration; unknown type forges at 0.7 | Hacksmith | MR10, MR22 |
| Struggle log offers boons that target the player's actual weak step | Hacksmith | MR18, MR21 |
| Persistent station cards vs consumed materials, risk-consume vocabulary | Stacksmith | MR5, `craft_resolver.js` |
| Wear that builds from traffic and speeds the route | Age of Iteration | `known_routes.js`, branch clock |
| Stage `alternatives` as substitution data | Age of Iteration | MR7, MR9 |

## Top findings
1. Hacksmith's slice-and-profile shaping is a concrete way to make shape a
   conserved, scored quantity (MR5) with a different target each commission.
2. Quality marks that each change one named later stat, and a bonus lost for a
   named flaw, show quality as reasons not one number.
3. Failed or wrong crafts becoming social debt and returning grudges, by client
   personality, is a consequence model YAIR's making docs do not have.
4. Age of Iteration's traffic-built, decaying trail wear is a small, offline-safe
   way to make routes carry history.
5. Stage costs with `alternatives` give substitution as data.

## Verification
Read: six tag listing pages, 30 game pages (page text), Hacksmith pck (28
scripts decoded, 0 errors; core/metal.gd, core/data.gd, autoload/game.gd
sections), Stacksmith recipe resources (strings, not scripts), Age of
Iteration bundle (formatted; sections around building, route, wear and stage
data), Beltmoor game.js (grep), Blades Beyond Repair Global_anvil.gd, Alchemy
Swordsmith and Craftomation by strings. Not read: Kraft & Slash, Little Chef,
Heat & Hammer logic, Stacksmith scripts (4.4 token format not supported by the
shared decoder), Craftomation scripts. Nothing executed. About 60 tool calls;
all itch pages fetched at 4 s spacing or more, no 429.
