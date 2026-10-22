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

### S10. Fate (stated)
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

## Top findings

1. **The migration list is a free design review.** It shows servants, stability, missions, teaching and tournaments were all built then deleted; the army histogram replaced per-person sect management. Strongest evidence against per-person tracking at scale.
2. **Tribulation as cash-out ramp** (S1): fixed turns, geometric damage, Accept at any point, consumable risk charms that scale reward with risk. Fits AD28 and AD8.
3. **Proficiency to talent at rebirth** (S3) and **Law depth that persists while the pick resets** (S2) are two small, concrete rules for AD11 carryover.
4. **Passive stations with status strings, pooled fair share and no manual mode** (S8) came from the developer's own bug list; YAIR's home systems should adopt the status vocabulary.
5. **Ship-your-own-manual extraction**: i18n plus guide plus changelog gives a full spec without reading code. Reusable for other obfuscated HTML5 games in this wave.

## Verification

Read: bundle hash re-checked (matches); i18n `en` table parsed (20,326 keys); guide topics read in
full for laws, breakthroughs, origins, dantian, elemental refinement, sect, sect membership,
Wang Dao, clan, physique, bloodline, body refining, legacy, soul power, soul weapons, divine beasts,
fate, ascension, intent, renown, galaxy map, world map, tower; changelog 0.5.1.26, .25, .24 and the head of 0.5.0.7; migration name list (about 470 names);
code read for tribulation constants and turn function, law definitions and formulas, rebirth reset
and proficiency conversion, real-time conversion, army migration and army math (partly; identifier
roles inferred), Debug command list. Not read: Fate server code, bloodline/divine-beast/dantian
code (stated only), city interior and cave generator code, Galaxy front allocation code, body
type/Titan code, older changelog entries. About 35 tool calls. Nothing executed, nothing downloaded.
