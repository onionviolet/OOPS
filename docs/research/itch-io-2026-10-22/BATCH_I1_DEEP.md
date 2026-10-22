# Batch I1 deep decode: Path of the Idle Cultivator (wuxiadev), 2026-10-22

Proposals only (AD32). Static reads of the served bundle; nothing executed. Raw notes
and locators (line numbers into the local pretty-printed copy) are in the gitignored
`private/i1-web/DEEP_NOTES.md`. Feeds section I1 of the
[itch screen](../ITCH_IO_IDLE_SCREEN_2026-10-22.md); the screen report was not edited.

## Build identity

- HTML5 bundle served from the developer's host (itch shell iframes it), 18,891,219 bytes,
  SHA-256 42029c92...ea404, matches the trace. Version in the bundle: 0.5.1.26, dated 2026-09-22.
- Engine: plain browser JavaScript (Decimal big-number library for stats that reach 1e230+),
  canvas arenas, Electron/Android wrappers elsewhere. Readability: obfuscated identifiers,
  strings, object keys and the whole i18n table intact. The English table has about 20,300
  strings and the bundled in-game guide (127 topics) explains almost every system in prose.
- License: none stated in the bundle. Ideas only. The itch page discloses AI-assisted code.

## Method note (worth reusing)

Identifier renaming does not hide a game that ships its own manual. Parsing the chained
`register("en", {...})` blocks (one 6 MB line) gave a searchable table, and the guide, the
changelog, the migration name list and the `window.Debug` command list together mapped the
entire feature set in about 40 tool calls. A migration list names every system in the order
the developer added or killed it.

## Systems

Labels: **source** = read in code; **stated** = developer prose (guide/changelog) not traced to code.

### S1. Tribulation as a scripted survival ramp (source)
Breakthrough between realm categories is not a duel. Fifty turns drain a pool equal to the
player's HP; per-turn damage multiplies by 6 every 5 to 10 turns (1, 6, 36 ... about 1e7)
and by realm category, and by 20 for the Heaven Chosen origin. The player may Accept at any
turn: the turn reached sets a reward tier (nine tiers; reward weights 50/30/20/13/9/5/3/1/0),
full survival is the top tier. The reward is a permanent-until-rebirth multiplier on HP/DMG/DEF
and also multiplies Soul Power paid at rebirth. Consumable charms trade risk for reward: a
"safety" charm cuts damage toward a target relative to HP; a "challenge" charm raises damage
and reward together. Weapon origins swap this for an arena trial. A Law of Tribulation makes
it worse with slower reward growth.

### S2. Laws (source for formulas)
Unlock at the Dao realm and a power threshold (1e160 earthly, 1e230 heavenly). One earthly and one
heavenly law per life; the choice locks, depth persists forever. Comprehension is Qi gained while
cultivating (1 per Qi). Cost per level is geometric (x2 to x10 by law), so levels are logarithmic
in comprehension and every law has soft-scaled multipliers. Eight earthly laws strengthen one
facet (Qi gathering, elemental roots, lifespan per breakthrough, soul gains, bloodline XP, body,
weapon, training). Five heavenly laws bend rules: Time (adds 0.25 x log-soft level to game
speed), Comprehension (more mantra/manual tiers), Reincarnation (a fading floor of last life's
realm stats), Divine Weapon (part of damage ignores defense and resistance), Tribulation
(harder, more modest reward). Stated: kin on Cultivate can deepen laws you did not pick.

### S3. Rebirth carryover (source)
Inventory is filtered to two soul currencies plus items flagged persistOnRebirth. Qi, stats, age,
realm and action reset; the origin is cleared and a setup screen reopens for the dantian.
Per-weapon proficiency converts at rebirth into permanent aptitude by a triangular-number rule
(last life's points T become T(T+1)/2 times a constant added to talent), then points reset and
bought skills deactivate. Soul Power (paid at rebirth from every active cultivation's realm,
times the tribulation multiplier) buys permanent upgrades; a Soul Shop split into mortal (SP) and
deity (deity souls) halves. Legacy keeps equipped weapon and armor as heirlooms that gain value
from years in storage with a log soft cap (stated). The "Law of Reincarnation" is the only
direct stat carry (source).

### S4. Sect: servants replaced by an army (source, migrations)
The first sect model had servants, outer/inner/core disciples and a stability meter. Migrations
turn every servant/outer/inner/core into "elder", delete servants and stability, and add a
soldier histogram keyed by realm and stage. Spirit stones are invested daily, split by a slider
between recruiting (cost rises with army size) and training (cost rises with stage). A force
multiplier from buildings, techniques, treasury and the aura of Grand Elders (elders who stop
all work to grow and project an aura) scales soldiers; soldiers never die in war (stated). Elders
can be lent to the army and then cannot staff a pavilion. This is the "headcount stops mattering,
multiplier does" correction. Dead code: servants, stability, missions, teaching, tournaments.

### S5. Dantian, elemental nodes and paths (stated; migration trail source)
Dantian holds purity (good), corruption (demonic, combat bonus, worse Qi) and impurities (pill
waste, auto-capped). Slots take elemental nodes of tier and element; same element and tier fuse
to the next tier, with a one-click cascade. The strongest element share is the Attunement; the
arrangement is locked per life and chosen in a post-rebirth setup screen. Detected "paths"
(destructive, generative, harmonious, mono-element) rename the realms and weight refinement.
Wuxing cycles drive burn, chill, armor break and expose statuses. Slots grew 5 to 8 to 18 across
migrations. Elemental refinement (separate Qi allocation slider) trades realm speed for element damage.

### S6. Origins as whole alternate games (stated)
Each life starts by picking an origin: Average, Heaven Chosen, Demonic, Sword, Spear, Palm, Beast,
Fist, Berserker, Guard (staff), Elementalist (fan), Sound Dao (hidden zither). Each has its own
resource, quest line and weapon. Finishing a weapon origin's full quest chain awakens its Intent
permanently across lives. Ascension requires mastering all origins plus eight Intents plus
Infinity in HP/DMG/DEF. Average Cultivator becomes a nameless deity and may name themself.
Heaven Chosen can reach Heaven Embodiment; the three deity paths fuse into the Universal Deity.

### S7. Body, physique, bloodline (stated)
Physique ("second body" worn beside race): tempered by devouring essence; ten named tiers each
for Heavenly, Hell and the fused Universal body; tempering progress persists, what you wear resets.
Per-life flat HP/DMG/DEF from tempering applies to anyone. Elemental tempering is endurance
against a realm's element, stops itself before it kills you, and each realm can teach only so
much. Bloodline: parts dropped by weapons and beast blood; drag to a canvas, chain to Blood Power
nodes; absorbing parts levels the bloodline; presets; auto-absorb filters. Clan kin amplify
bloodline nodes (rarer nodes drink more).

### S8. Clan and divine crafts (stated + changelog)
Promote a disciple to kin with a rare essence; kin persist across rebirths, run the same action
types in parallel with you, hunt for you, comprehend laws for you, and (0.5.0.7) run the
Divine Forge, Alchemy and Cooking stations passively; the player no longer works them. Stations
show explicit status (running, paused for lack of fuel or ingredients, no member). Fair-share
on a pooled resource so one station cannot starve the rest.

### S9. Divine beasts and the world (stated + changelog + migrations)
Beasts have species, DNA grades, mutations, lineage and form evolutions; Body and Spirit
cultivation tracks; breeding with presets (S/SS/SSS targets) that can run automatically; a 20
beast roster; a friendship ladder with passive gifts to the sect; eggs hatch with a realm no
higher than the mother's. Beast Cultivator origin fights only through beasts. World Map: six
procedural worlds, sects own linked mines/forests/cities; destroying your own sect repopulates
rivals; Tower: bet spirit stones, climb, lose the bet on defeat, checkpoints, automation that
never takes a losing fight. Galaxy Map: tree of worlds, travel in real time by flying treasure,
nine simultaneous invasion fronts with elders, player, companions allocated.
Caves and Hidden Sites are 1 to 3 floor explorable dungeons with puzzles (crates, pressure plates);
a 0.5.0.7 fix list shows the softlock cases they had to remove.

### S10. Fate (source for backend, see S17)
A server-backed collectible layer (cards with permanent percent bonuses, star fusion, skins, titles,
player auction house, fate coins that drift in while playing). Not relevant to YAIR's single-player
direction beyond the observation that duplicate-fusion with a cascade button became necessary at scale.

### S11. Time and offline (source, negative)
Calendar speed is set by lifespan (max age divided by a constant, floored at 1), times speed
setting, times a law factor. I found no wall-clock offline catch-up in the time function; the
game offers a compact Idling mode and a Pass Time action instead. Rebirth clears the timestamp.

## Representations (UI ideas)

- Guide as a first-class screen with sections per system, and a "What to do" page that names the
  current bottleneck by phase (before Grand Dao, before Origins, before Ascension) and links to
  the lever (stated, `whattodo`).
- Explicit station status strings (Running / Paused: no fuel / No member assigned / Idle).
- Reward tiers shown during a run with an Accept button (tribulation), and a "Previewed
  tribulation" debug command shows the team already wanted a preview.
- Presets as swap slots for bloodline canvases (two filled slots trade places).
- Core colour of the dantian tints by element and goes white at wuxing balance, crimson when corrupted, gold for Heaven Chosen.
- Fuse All with a confirmation that states how many fusions it will perform.
- Lock an item in a shop so it survives refresh; locked items show first.

## Improvements the developer explains (changelog 0.5.1.24 to .26, migrations)

- Divine crafts made fully passive and clan-driven after "work it yourself" proved a chore; long time skips could silently stall a station, fixed by advancing the full span.
- Pooled materials with fair share instead of first-come draining.
- Army replaced per-person servant management because headcount grew without bound.
- Hand-rolled "soul/spirit stone" tracking with monthly income and expense tabs (spirit stone ledger) added.
- Beast roster, per-world beast budgets, spacing redistribution and wild beast realm caps added after beasts crowded or outscaled maps.
- Free-for-all skill points split into per-weapon trees (three paths of five levels each, 1,400 points to finish).
- Luck moved from a soul power share to a bought upgrade.
- Heirloom duplicates and out-of-bounds world positions needed repair migrations.
- Corrupted counters (total kills, damage) grew garbled numbers and bloated saves; repaired on load.
- Itch release added a transition page offering a backup of old browser saves.

## YAIR mapping

Grep of `src/` found no tribulation, breeding, persistOnRebirth, wuxing node, or soul-power system; bloodline, army and heirloom appear only inside unrelated roster/management files. Proposals, not accepted.

| Idea | Owner | YAIR state |
| --- | --- | --- |
| S1 scripted survival ramp with Accept-at-any-turn tiers and risk charms | CBR rulebook, AD8 (own stats exact) | Not in `src`. Candidate for a cultivation-world breakthrough event; the player-chosen cash-out is the valuable part. |
| S2 laws as logarithmic geometric-cost depth, one per life, persistent depth | AD11 (what carries), BHR | Not in `src`. Fits a late-game "carry" lever; per-law soft scales are the control. |
| S3 proficiency turned into permanent aptitude at rebirth (triangular rule) | AD11, SLR | Not in `src`. Concrete, cheap rule for "practice becomes talent". |
| S4 army as histogram of (realm, stage) counts with force multiplier | AD25, home_staff.js | `home_staff.js` has household staff; the aggregate-unit idea is new. Rejected servant model is a warning for per-person management at scale. |
| S8 passive stations with explicit status and pooled fair share | AD31, home_model.js | Home systems exist; status strings and pooled fair share are an improvement to check against `home_work_content.js`. |
| S11 pace set by lifespan, no offline | AD15, AD16 | YAIR already chose away-time routines (AD16); this game confirms lifespan-driven pace but not a model for away time. |
| Migration list as design history | AD35 | Method, not feature. |

## Second pass: parts that were unread in the first draft

Labels as above. Locators are in `private/i1-web/DEEP_NOTES.md` (section "Second pass").

### S12. Divine beast DNA and breeding (source)
Genes (damage, hp, defense, qi, elemental) each hold a rank D, C, B, A, S, SS or SSS with a numeric
band per rank. An offspring rolls each gene between the two parents' ranks, then a value inside the
band; the species comes from a coin flip between sire and dam. Mutations carry a grade and an effect
(realm-budget multiplier per stat from x0.85 at D to x2 at SSS, Qi-generation multiplier, food Body
Score multiplier, and "multi-skill" mutations that add 1 to 3 distinct skill slots). Each skill slot is
filled from the parents' skills (10 percent chance of a fresh skill from the whole pool) with a rank
rolled from the parents' ranks. Offspring record sire, dam and generation. Time costs come from the
pair's score on a log scale: reproduction, rest and incubation are 10 to the (0.75, 0.9, 1.0) times an
exponent, times 365 days, so a top pair costs vastly more time. Skills are active or passive and have
scope, team, cooldown and a power coefficient on Qi or damage. A migration (dna version 2) shows the
first design was a "physique" gene and named mutations that were later split and made gradable.

### S13. Dantian node fusion (source)
Fifty nodes of one element and tier fuse into one of the next tier; "fuse all" cascades through
every tier. Boss and beast drops roll a tier from fixed weights with a small luck bump upward.
Constants: base purity 100, corruption decays 1 percent, impurities are capped at 60 percent of size.

### S14. Galaxy map data model (source)
Worlds form a tree: id, parent, tier, a power exponent, coordinates, conquered flag, a building level per
resource type and a deterministic bonus seed (so siblings differ but never reroll). State also holds
overseers (elders), automation flag, the parked world and an in-flight travel record. Invasion opens a
preparation screen with a roster snapshot and allocation, and a campaign object projects the result.

### S15. Cave generator (source)
Caves and hidden sites assemble hand-drawn character-grid rooms from named pools (start, combat,
trial, treasure, transit, vault, boss) with weights and minimum depth. Objective types: none,
defeat group, threshold (about 100 rooms use it), grab in turns, pay a Qi toll, resistance, speed kill.
Trials include dodging blades, spike floors, grab-the-item-in-N-turns and the Qi toll. Vault rooms use
levers or pressure plates. A fixed boss lair ends the run. Authored rooms plus pool rules, not
free-form generation, is why the 0.5.0.7 softlock fixes (sealed rooms, crate shortages) were possible.

### S16. Body ladder for the Fist origin (source)
A named 35-step body ladder grouped into bands (Foundation 0 to 4, Tempering 5 to 9, and so on up to
True Martial Dao). Names alone are a ready-made scale for a body-cultivation track.

### S17. Fate backend (source, host confirmed)
The game calls `backend.cultivator-path.com` through an auth set (sign up, in, out, update) and a
PostgREST-style `/rpc/<name>` call (a migration named for Supabase auth suggests a Supabase-like stack; inference). RPC names include register_player, get_initial_state, get/fuse/
fuse_all for cards, skins and titles, buy_fate_shop_item, buy_fate_typed_chest, listings and
my_listings, sale_stats, transactions, redeem_code, battle decks and leaderboards, challenge seasons
and challenge begin/resume/reconcile, and Patreon link tokens. A second host (`rooms.cultivator-path.com`)
carries real-time duels. So the Fate layer is server authoritative; the single-player game does not
depend on it for core progress (challenge runs even exclude it).

### S18. Challenges, talismans, spirits, meridians (stated)
- Challenges: timed runs in a sealed sandbox with a second full save shelved; four goals (Zero to
  Infinity, Infinity to Pagoda step ten, Deicide to the hundredth deity, Automaton); two clocks (real
  time and in-game days); only time and Fate earnings return. A neat pattern for benchmark play.
- Talismans: inscribed from ordered sigils; sigil order is part of craft; a talisman has one kind
  (attack, defense or heal) and a shared charge pool, is consumed by use, and its grade measures
  the variety of distinct sigils, not the ink. Recipes are proportional and exportable as a code. A
  guard against invulnerability: several full blocks in a row force the next blow through.
- Spirits: one per origin, awakened by that origin's quest, passive, with tiers driven by lifetime
  trackers (armor penetrated, damage taken, kills, divine beasts defeated) that persist across rebirths.
- Meridians (Heaven Chosen only): twelve named pathways with score generated per day by realm, converted
  into points with rising cost per point; per-life, no cap. Inner Realm: a permanent structure set paid
  in Qi, then collapsed and replaced by a reforged one paid in Empyrean Essence, with nine weapon pillars.
- Endgame chain (0.5.0.7): Universal Deity from all fourteen Heaven and Hell souls, Beast Overload from
  twelve beast souls, nine Weapon Gods, Perfected Deity, then the Multiverse Door fight that is built to be lost and ends in a rescue and exile.
- Mods (Steam only): sandboxed add-ons, translations as the first mods; Brazilian Portuguese pack shipped as an example.

### Added YAIR mapping

| Idea | Owner | YAIR state |
| --- | --- | --- |
| S12 graded genes with rank-band inheritance, mutation slots, time cost on a log scale | AD13 (bodies, bloodline), AD31 | No breeding in `src` (grep). Could seed companion or household lineage; the log time cost is the clean control. |
| S15 authored room pools with objective types and weights | AD33 (procedural layouts stay deferred), SR rulebook | Procedural layouts are deferred by AD33; the authored-template-plus-pool approach is the low-risk form if that changes. |
| S18 sandboxed challenge runs with a shelved save | AD36, save safety | Not in `src`. Matches a "branch/offline clock" style fork; not a priority. |
| S18 talisman ordering craft, grade by variety | MR rulebook | Not in `src` (grep for talisman not run beyond tribulation); idea only. |

### Third pass: bloodline, galaxy fronts, Weapon Realm, trials, older changelog

**S19. Bloodline numbers (source).** Ten rarities (Common to Transcendental) with base drop chances
from about 20 percent down to 0.1 percent, shifted by Luck. A part's power is its type weight times the
sum of 2 to the power of each node's rarity, so one rare node outweighs many common ones. Five parts of
power feed one level; at most six Blood Power nodes; Blood Powers sit on a cross-shaped lattice that grows
outward ring by ring; levels beyond the cap give a flat 25 percent overflow bonus each. Part types are
weapon masteries (+20 percent weapon damage), elemental parts (+40 percent elemental damage) and
utility parts; Hell, Heaven and Galaxy beasts add their own part families. Auto-absorb is a filter by
part type and a power threshold, applied on drop.

**S20. Galaxy invasion rules (source).** Nine fronts, six ally slots, five defenders per front, three
lives for the player, zero revive delay in the current constants, and the invasion is won by capturing
five fronts. Every unit (elder, player, companion) moves through available, active, reviving and
eliminated; each revive increments a generation counter and re-spawns at full HP. A front is only
capturable while all defenders are down and an allied unit can still act; a campaign object projects
the result for the overview. Allocation is either manual per slot or automatic.

**S21. Weapon Realm (stated).** Nine one-on-one duels, one per weapon. Defeating a god permanently
reforges a pillar, adds an equip slot for that weapon type and a signature power. Survivors grow stronger
after every defeat so order matters little. All equipped weapons strike every turn and share total
weapon power between them (a flurry, not a bigger hit). Power of god and player are shown on one scale
before the fight. No penalty for failing.

**S22. Weapon-origin trials (source and strings).** The sword trial is a timed damage race against a
dummy: result is damage dealt (the "kills" counter); zero damage puts the cultivator back at the realm
threshold instead of advancing. The spear trial is a line of one-hit-point sentinels with heavy armor,
one turn to pierce each, armor doubling per sentinel; the tier reached sets the bonus.

**S23. Developer-explained rebalances from older changelog entries (stated).**
- Tribulation: reward made steeply convex in trial quality and more tied to realm, but damage rises
  even faster with realm so a bigger reward can never make its own trial easier; enemy sects kept on
  their older scaling so the map stays balanced.
- Full-block talismans made unable to chain forever: after several blocks the next blow lands.
- Origin Power from fruit: a per-life cap was replaced by diminishing returns clamped to the tier of the
  fruit being eaten; banked power never decreases. A talent amplifier was deleted outright.
- Soul Shop: many raw baselines were lowered, then repeatable uncapped amplifiers were added, so system
  strength comes from investing the persistent currency; shop items stay hidden until the mechanic exists;
  Soul Stats read lifetime Soul Power, so spending no longer weakens stats.
- Unlock flow: systems open on first use (first bloodline part, first beast egg) rather than at a fixed realm.
- Sect army: an earlier proficiency drill was removed in favor of elder aura and a treasury building.
- Older release dates seen: 0.3.5.33 (2026-07-05), 0.4.0.23/.30 (July), 0.4.1.40 (2026-08-13), 0.4.3 (2026-08-30), 0.5.0.7 (2026-09-07), 0.5.1.24 to .26 (2026-09-20 to 22). About twelve weeks from 0.3.5 to 0.5.1.

Not traced: city interior generator (only the changelog description: a hand-built courtyard town per realm with residents, shops and conversations).

### Fourth pass (limit lifted): alchemy math, city NPCs, origin data, crafts

**S24. Free-formulation alchemy, exact math (source).** The most reusable system in the bundle for a
potion design. A recipe is an ordered list of (herb, tier, count). Each herb has an element (fire, wood,
earth, metal, water; plus filler herbs that exist in every element) and a base potency and thermal value.
- Potency of a stack = base x 8^(tier-1) x count^0.7 (so stacking one herb has strongly diminishing return).
- Adjacent pairs react in one direction only. If the earlier herb generates the later (wood to fire to earth
  to metal to water to wood), the later herb gets x1.5, and a quarter of the pair's combined potency is
  transmuted into a subproduct channel set by the source element (metal gives stomach size, water food
  efficiency, wood bone training, fire defense, earth weapon concentration). If the earlier overcomes the
  later, the later herb is halved. Reversing the order gives a different pill.
- Thermal: fire +2, wood +1, earth 0, metal -1, water -2, scaled x6 per herb tier. The cauldron has a fire dial
  clamped to a range (base +-2, widened by upgrades). Net thermal plus fire gives a residual; impurity per
  pill = |residual|. Filler herbs supply a warmth of magnitude 3 per tier that cancels residual up to its size.
- Two marks: Tier from herb quality; Grade from complexity (count of distinct effect herbs and distinct
  directional element pairs, thresholds 2,3,4,5,6,7,8,9,11 for uncommon to transcendental), capped by
  the lowest tier among effect herbs (a step of 3 tiers per grade). Grade multiplier = 1.3^grade on every effect.
- Effects per channel have weights (hp 1, defense 0.8, damage 0.3, stomach 0.5, food efficiency 0.35), some
  with extra diminishing returns. Buff channels use a duration constant of 1800 (unit not confirmed) and can auto-renew from a slot.
- Cauldron: capacity starts at 3 herbs (upgrade cost 25,000 x3 per level); fire range upgrade 100,000 x4.5 per
  level. Herb fusion: 20 of a tier become 1 of the next, ratio growing x2 per tier. Recipes are stored as
  proportions and can be exported as a share code. A 0.5.1 changelog notes the workshop was rebuilt into separate tasks.
- Divine Alchemy then fuses many pills of one recipe into one pill with summed effects and summed impurity.

**S25. City interior (source).** Cities are hand-authored maps of 29 by 25 tiles with a spawn, an exit,
and establishments placed from a few building templates (market 3x2, hall 5x3, house 4x3, shop 4x3).
Fifteen named cities per realm band (Jade Harbor, Ashford Bend ... then Azure Terrace, Ironbell ... and so on up
to heavenly names). Twelve resident roles (merchant is the only shop; scribe, harbormaster, alchemist, blacksmith,
village elder, herbalist, guard captain, innkeeper, wandering sword, street child, drunken poet talk). Each role has
greeting lines and question-and-answer topics. The dialogue quietly hints that the world is a copy:
herbs regrow overnight, mined seams refill, a ledger lists the harbor "built, drowned and built again", "doors open
twice". A fiction layer that foreshadows the endgame multiverse door; fits AD3 (a world's special rules start hidden).

**S26. Origins are data (source).** Origins are plain records: id, name, description, lore, unlocked flag, a list of
colored mechanics lines for the picker, allowed weapon types, a reward set (starting manual type and tier, unique
weapons and armor with rarity, tier, ascension level and realm requirement), and optional blocks
(deathPenalty: 30 percent Qi loss on defeat and possible regression for Heaven Chosen; divineSystem: 10x Qi per stage;
demonicSystem: absorb 30 percent of legend stats on kill, corruption gives 1.5x Qi and purity 0.8x). The picker can show lore,
rules and gear together, and adding an origin is a data change, which explains how the roster reached a dozen.
Weapon-origin realms are custom ladders: sword 12 realms of 4 stages, spear 16 realms of 4 stages, both capped at the
Grand Dao equivalent.

**S27. Crafts and training (stated).**
- Dao manuals: one Dao type per origin sets base HP/DEF/ATK and grows automatically with realm; a category boundary
  gives an extra multiplier; Origin Power multiplies Dao gains with accelerating efficiency. No manual upgrading.
- Battle manuals: equip slots, random bonus pool by category (combat, elemental, effectiveness, resistances, base stats), tier upgrades
  paid in spirit stones, per-stat diminishing returns when stacking one bonus.
- Weapons: only source of damage; one slot; tier by spirit stones; ascension driven entirely by kills with that weapon
  (thresholds climbing steeply, random bonus effect each step, golden status at high level, rename at the last); reforge stones
  reroll single effects; each kill adds damage forever with soft decline.
- Body training: five tracks (flesh, skin, tendon, bone, marrow) all hardened by damage taken against a striking dummy; fast shallow
  layers, slow deep layers worth more per level; per-life; fist/palm damage portion only counts with unarmed weapons.
- Eating: daily auto-eat, stomach capacity limit, priority list, body score levels permanent for the life; sect and kin eat from shared stores.
- Divine Pagoda: ten ordered steps paid in Empyrean Essence that open realm tiers and systems (Clan, Divine Crafts, Galaxy Map,
  Soul Kingdom and Hell Map together), persistent across rebirth.
- Divine Cooking: every food is a ladder; a stove fuses a batch of one rung into one of the next without a target, cascading as high as stock allows.
  Origin Fruit's ladder raises the per-life Origin Power ceiling.

**S28. Numbers worth keeping (source unless marked).**
- Realm ladder: 79 realms in 12 bands (Mortal 0-4, Earth 5-11, Heaven 12-18, Immortal 19-26, Divine 27-37, Celestial 38-45,
  Dao 46-49, then Ascended, Boundless, Eternal, Primordial, Supreme). The "Infinity" stat cap is 1e308; Ascension lifts it.
- Qi per stage = 100 x a band multiplier (6, 11, 21, 36, 56, 96, 146 for Mortal to Dao). Heaven Chosen pay 10x.
- Soul Power per realm = floor(10 x (1 + realms above 5) x 2^band index) summed over every realm of every active cultivation,
  times the Soul law and the tribulation multiplier; claimed on rebirth, never reset. Allocation after rebirth: Luck (+0.2 per SP),
  Talent (+1 percent per SP), Body; an "auto use" setting remaps the split per activity. The Soul Shop is a pre-life screen that seals when
  the life begins ("Confirm and Begin"), same for the dantian setup.
- Soul Shop keys (about 36): luck, two speed unlocks, lifespan multiplier, mantra resonance, heirloom attunement, pill potency, legend soul
  conversion, crafting and body-refining throughput, breakthrough and guardian attunement, Inner Realm sun/moon/core efficiency, essence
  generation, Qi gain, meridian, food, body training, elemental node, Soul Power itself, deity/legend/tower/renown rewards, treasure,
  divine forge, galaxy yield, menagerie, clan resonance, skill ascendancy, body reforging. Pattern: one persistent currency buys exponent-style amplifiers on every system.
- Sect constants (partly dead): disciple roots split 40 main, 30 fed, 20 feeder, 10 pure; base disciple stats hp 30, def 2, atk 3; stat multiplier 0.8 to 1.6;
  10 recruit candidates per refresh at 1,000 up to 1e50 spirit stones; 3 base elder slots, 2 base grand elder slots; each grand elder adds 1 percent HP/DMG/DEF
  and 0.8 percent cultivation aura; conflict chance 1 percent and stability drain 50 remain as dead constants from the servant era; buildings now cultivation room,
  concentration room, training hall, elder hall, treasury.
- Auto Rebirth (Fate Shop unlock): loops rebirth, cultivate to peak, clear legends, fight deities until defeat, refine treasures, then rebirth again, with a target Soul Power growth percent per rebirth.
- Daily Missions: server-chosen set per day, tiered ladders paying Fate Coins; reset 00:00 GMT.
- Legends and Deities: Legend Souls convert to Soul Power; Deity Souls fund the Pagoda and a second Soul Shop half; each kill raises Origin Power by the deepest tier ever reached, so
  farming never un-does; a once-per-life "Finger Flick" sweeps everything you can one-shot, and an upgrade makes it unlimited.
- Hell and Heaven maps (stated): nine Demon King castles, five Heaven thrones, twenty-five caves each in five groups; thrones give permanent essence income; Celestial Qi trades gathering for much larger realm stats; fiends, eggs and 10 demon bloodlines; a Hell Essence Pit where disciples farm.
- Menagerie (stated): awakening drains Empyrean Essence passively; Communion consumes a beast to take its celestial race (ten named forms: Qinglong, Zhuque, Qilin, Xuanwu, Baihu, Tengshe, Xianhe, Jiuweihu, Tianlang, Kun) as a wearable skin.
- Primordial Crucible (stated): unique one-per-type gear, pity meter on refine, True Primordial set bonus multiplies HP and defense late.
- Combat (stated): 790 monster tiers (501 to 790 are Celestial tiers dropping Empyrean Essence), Auto Up with a Stop at Tier limit, Wuxing reactions (generative and destructive) unlocked through weapon skill trees, status effects, double strike, reflect and counter.
- Cultivation pipeline (stated): base room Qi x Quantity gives Room Qi, Gathering (from dantian purity and size) takes a share, Refining (mantra) converts it; a fully corrupted dantian stops cultivation until cleansed.

### Added YAIR mapping (fourth pass)

| Idea | Owner | YAIR state |
| --- | --- | --- |
| S24 order-dependent, one-direction herb reactions, heat balance becoming impurity, tier vs grade split | MR rulebook, AD38 (things work by how they work) | No such potion model in `src`; a strong candidate for the potion/alchemy lane (see the itch-potion session). The formulas above are directly usable as a palette. |
| S25 hand-authored towns with role NPCs whose dialogue foreshadows a hidden truth | AD3, AD33 (NPC-heavy deprioritized) | Fits AD3; cost is authoring, not code. |
| S26 origins as data records (mechanics lines, rewards, penalties) | AD23 (entry), AD1 | `src` has world definitions; compare data shape before claiming a gap. |
| S28 persistent currency that buys exponent amplifiers on owned systems, pre-life sealed spend screen | AD11, AD28 | Not in `src`; the pre-life sealed spend is an AD11-style carrier choice. |
| Dead constants from servant era | AD36 | Lesson: remove removed-system constants; they linger in the shipped bundle. |

## Top findings

1. **Alchemy math is a ready palette** (S24): directional element reactions, a heat dial that turns imbalance into impurity, Tier from herb quality versus Grade from recipe intricacy capped by the worst effect herb, proportional share-able recipes. Matches AD38 and the potion lane.
2. **The migration list is a free design review**: servants, stability, missions, teaching and tournaments were built then deleted; the army histogram replaced per-person sect management. Dead constants from the servant era still ship.
3. **Tribulation as a cash-out ramp** (S1) and **laws as logarithmic depth with persistent depth but per-life pick** (S2), plus **proficiency to talent at rebirth** (S3): three small, concrete AD11 carry rules.
4. **Passive clan stations with explicit status strings and pooled fair share** (S8) came from the developer's own bug list; the status vocabulary is cheap to adopt.
5. **A shipped manual is a spec**: the English table, in-game guide, changelog and migration names give the full feature set without reading obfuscated code; the Debug command list doubles as the endgame chain map.

## Verification

Read: bundle hash re-checked (matches). English i18n table parsed (20,326 keys). Guide topics read for
laws, breakthroughs, origins, dantian, elemental refinement, sect, sect membership, Wang Dao, clan, physique,
bloodline, body refining, legacy, soul power, soul weapons, divine beasts, fate, ascension, intent, renown,
galaxy map, world map, tower, challenges, soul kingdom, inner realm, talismans, meridians, spirits.
Changelog read: 0.5.1.26, .25, .24, 0.5.0.8, 0.5.0.7 in full and the head of 0.4.3. Migration name list (about 470).
Code read: tribulation constants and turn function, law definitions and formulas, rebirth reset and proficiency
conversion, real-time conversion, army migration and army math (identifier roles inferred), Debug list,
beast DNA/breeding/mutations, node fusion, galaxy world data model, cave room pools, Fate backend hosts and rpc names,
body ladder names, bloodline part builder (partly). Fourth pass (limit lifted) added alchemy math, city NPC roles and layouts, origin records, Soul Power formula, sect constants, Soul Shop keys, realm ladder and the remaining guides. Third pass added bloodline numbers, galaxy invasion constants, sword trial code, spear trial strings, Weapon Realm guide and the 0.3.5 to 0.4.3 changelog. Not read: city walking and collision code, Weapon God stat tables, spear trial code, Wang Dao and Tower formulas, mantra code, older changelog entries before 0.3.5, and the full list of bloodline node types.
About 105 tool calls. Nothing executed, nothing downloaded.
