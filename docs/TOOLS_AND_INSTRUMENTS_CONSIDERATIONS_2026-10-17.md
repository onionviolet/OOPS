# Tools, cursed tools and instruments: considerations, 2026-10-17

Claude, 2026-10-17. A palette, not a spec. Nothing here is selected for a build.

Weibao (2026-10-17): "JJk cursed tools and more? simialr stuff in other worlds? more ot
consider?" then "normal tools and crafting and stuff too".

Rules applied: MR1–MR36 ([making rules](MAKING_RULES.md)), AD5 (both, depending on the world),
limits are adjectives, AR1–AR16 for any runtime seam. World rows marked MEMORY are recalled
franchise facts awaiting a source check (TQ60). Public franchise facts are not sealed.

## What already exists (read, not restated)

| Owner | Covers |
|---|---|
| [Genetics and hero start plan, round 4](GENETICS_AND_HERO_START_PLAN_2026-10-17.md#round-4-items-and-possibilities-from-books-2026-10-17) | Power that lives in a thing: power instances with custody (GHS86), one-holder ledgers (GHS87), typed acquisition (GHS88), priced trades and vows (GHS90), slots and attunement (GHS91, GHS101), suppressors (GHS105), S5 "Power in a thing" |
| [Weaponcraft, runes and inscription](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) and its two companions | Weapons as built things, inscription, weapons with wills (WC5), item bonds (XA4), cursed tools as a maker art (OM8) |
| [Maker arts by world](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md) | WQ6/W04: JJK tool versus vow, persistent infusion versus momentary reinforcement, civilian housing work |
| [JJK module catalogue](worlds/jujutsu/MODULE_CATALOGUE.md) `jjk.tool` and [campaign](worlds/jujutsu/CAMPAIGN.md) seed 3 | Inspect, repair and custody loop for one real cursed tool |
| [Means and appraisal](MEANS_AND_APPRAISAL.md) | Means principle; counters, places and organizations as means |
| [Procedural crafting](PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md), [crafting engine](CRAFTING_ENGINE.md) | Consumables, maker identity, workshop risk, resolver modes |
| Code | `SOURCE_KINDS` includes `equipment` (`src/capabilities.js:4`); craft resolver has a maker snapshot but no tool input (`src/craft_resolver.js`); durability proposal `src/absorb_e2/durability.js` keyed by item instance |

**The gap.** Every owner above treats an object as either a *product* (made, sold, worn) or a
*container* (holds power). None treats it as an **instrument**: the thing in your hand that makes a
verb possible and sets how well you control it. A hammer, a sickle, a lockpick, a scalpel and
Playful Cloud all sit in that third role. Most items play several roles at once.

## TQ. What a tool is (three roles, one item)

| Code | Consideration | Default, dial and reason |
|---|---|---|
| TQ1 | **Three roles.** An item can be a product (has a maker, a grade, a price), a container (holds a power instance, GHS86) and an instrument (enables verbs). Each role has its own owner | Default: the item system owns identity and custody; the power ledger owns contained power; the instrument profile is read-only data the action and craft resolvers consume. No role duplicates another's fact (AR "one authority per fact") |
| TQ2 | **Tools enable verbs.** No tongs, no hot forging; no rod, no fishing; no lockpick, no picking (or a slow, loud forced entry instead) | A tool grants a capability through the existing `equipment` source kind. Missing tools offer the improvised route (TQ7) at a stated cost rather than hiding the verb |
| TQ3 | **Tools improve control, not truth** (the MR21 rule applied to the hand). A better saw cuts straighter, faster and wastes less; by default it does not make oak into ironwood (a world whose lore says tools transmute material declares that as a law) | Instrument fields modify time, variance, windows and yield. Product identity stays with materials and method |
| TQ4 | **Tool quality is several numbers.** Edge, balance, fit, precision, durability and capacity (how big a job) | Name the quantity each grade touches, as GHS94 does for aptitude. One "tier" number is a display summary only |
| TQ5 | **Fit to the hand.** A tool used for months fits its owner; a borrowed one feels wrong | `fit` per user grows with use (game time, meaningful work only, MR22) and decays slowly when unused. A stranger uses it at base. Dial: worlds where fit is mystical bond (TQ20) versus plain habit |
| TQ6 | **Kits and stations.** Some verbs need a set (a smithy: forge, anvil, tongs, quench) or a fixed place | A station is a place-bound kit (SR site rules apply). Partial kits allow partial verbs with named missing pieces in the preview (MR4: preview consumes nothing) |
| TQ7 | **Improvisation.** A rock as a hammer, a hairpin as a pick, a kitchen as a lab | Every common verb has an improvised fallback with worse control and a chance to damage the stand-in. This keeps poor starts playable (start-as-trash lessons) |
| TQ8 | **Tools make tools.** The first file is made with a worse file; a village's tool level climbs over years | Tool grade can gate the grade of tools it can make, with a slow bootstrap rather than a hard wall. Gives a long idle arc in the Village |
| TQ9 | **Wear and upkeep.** Edges dull, handles crack, strings fray | Reuse the e2 durability proposal per instance. Upkeep (sharpen, oil, rehandle) is a short routine action with its own small skill, not a coin sink alone |
| TQ10 | **Tool marks are evidence.** A chisel leaves a signature; a forger's tool can be traced | Products may record the instrument id that made them (provenance). Appraisal with the right means can read it (MEANS reading someone's means) |

## CT. Cursed tools in JJK, as a tool family (MEMORY unless a ledger line is cited)

What the JJK pack does not yet split, beyond `jjk.tool` and WQ6:

| Code | Distinction | Engine consequence |
|---|---|---|
| CT1 | **Energy-carrying tools versus technique-imbued tools.** Most cursed tools just hold and deliver cursed energy so a hit can harm a curse; a few carry their own technique (Inverted Spear of Heaven nullifies techniques; Split Soul Katana cuts the soul; Black Rope disrupts techniques) | Instrument profile has `delivery` (lets a user's energy or a stored charge harm a target type) and optional `effect` (a stored technique). Effect-bearing tools are containers too (GHS102) |
| CT2 | **Grades.** Tools are graded like sorcerers and curses (fourth to special grade) | Grade is a product-role fact used by trade, custody and threat, not a damage multiplier by itself |
| CT3 | **Zero-energy users.** Toji and Maki use tools without their own energy; the tool supplies what the body lacks. Playful Cloud scales with the wielder's raw strength | `delivery` can draw from the tool's own charge or the wielder; scaling names its stat (body strength here). Heavenly Restriction bodies are the strongest tool users, a natural non-sorcerer path |
| CT4 | **Carrying is a problem.** Toji keeps his arsenal inside a tamed inventory curse | Tool carry load and concealment are real constraints; a living storage creature is a companion, a container and a custody risk at once (companions audit) |
| CT5 | **Tools as school property.** Jujutsu High stores and lends tools; borrowed tools return or debts accrue | Institutional custody with loans (MR27 supply forms). Lines up with the WQ6 equipment custodian start |
| CT6 | **Made by infusion over time.** Long exposure to cursed energy can turn an object into a tool; a made tool keeps its maker's imprint | Infusion is a slow craft over game time (persistent, versus momentary reinforcement per WQ6). The imprint is provenance (TQ10) |
| CT7 | **Cursed objects are not cursed tools.** Fingers and the Prison Realm are containers or sealed things, not instruments | Keep CT tools in the instrument role and cursed objects in GHS102. A sealing object is a container with a hold rule |
| CT8 | **Puppets and cursed corpses.** Yaga's corpses and Mechamaru's puppets are made instruments with a core | Constructs are a tool that acts (MR constructs). The core is a container; the body is a product with wear |
| CT9 | **Binding vows on tools.** Revealing a tool's or technique's rules can strengthen it | A vow can target an instrument's effect (GHS90 cost record pointing at an item) |
| CT10 | **Black market and theft.** Curse users trade and steal tools; high grades draw attention | Tool trade is a market with legality per buyer; a special-grade tool in hand raises visibility (GHS98 style) |

## WX. Similar things in other worlds (MEMORY; TQ60 verifies)

Each row names the axis that differs from JJK (see AX below), so worlds stay mechanically distinct.

| Code | World | Instruments | What differs from JJK |
|---|---|---|---|
| WX1 | Bleach | Zanpakutō (a soul inside the blade, learn its name to release), Quincy spirit weapons, Kisuke's gadgets | Power is the *wielder's* soul in tool form: bond, not trade. Loss of the blade is injury to the self |
| WX2 | Demon Slayer | Nichirin blades (color by wielder, smith matched to swordsman), Wisteria poison, Kakushi gear | Smith and swordsman form a lasting relationship; the blade is mundane-forged from special ore and must be resharpened by its smith |
| WX3 | Naruto | Kunai, explosive tags, sealing scrolls, flying-thunder-god marked kunai, Seven Swords (Samehada picks its wielder and feeds on chakra), puppets | A cheap mass-produced tool economy beside a few willful legendary blades; seals turn ordinary tools into delivery for a technique |
| WX4 | Hunter x Hunter | Nen-conjured tools (Kurapika's chains, made under vows), imbued objects, Greed Island cards that become items under game rules | A conjured tool is part of the user's ability; restrictions on it raise power. Gyo reveals hidden aura on objects |
| WX5 | Fate | Noble Phantasms (a legend made weapon, true name release), Mystic Codes, Command Spells, projection (copies that degrade) | Power comes from legend and recognition; revealing the name reveals the weakness. Copies are real but lesser |
| WX6 | Harry Potter | Wands (choose the wizard, allegiance passes by defeat), brooms, potion kits, Time-Turners, Deathly Hallows | Ownership transfer by defeat, not purchase; a wand works badly for a non-master. Ministry regulation of artifacts |
| WX7 | Lord of the Mysteries | Sealed Artifacts (graded, each with a negative effect), ritual implements, mystical items made from characteristics | Every power tool carries a side effect; Church custody grades how dangerous; ritual tools follow the ritual's laws |
| WX8 | Fullmetal Alchemist | Transmutation circles (drawn, carried on gloves or tattooed), Philosopher's Stone (amplifier), automail | The circle is the tool; carrying it on the body is a design choice. Automail is a tool body that needs a mechanic |
| WX9 | One Piece | Graded swords (Meito, Wazamono), Seastone, Dials, Den Den Mushi, a Devil Fruit eaten by an object (a gun that becomes an elephant) | Living tools (snails, Dials from sky islands); a sword can resist or drain a wielder (Enma); weapons can eat fruits |
| WX10 | Chainsaw Man | Devil contracts, weapon hybrids, Control Devil's leashes | The tool is a being with a contract; price paid per use |
| WX11 | Black Clover | Grimoires (choose at 15, pages grow with the bearer), anti-magic swords stored in a grimoire | Tool grows with its bearer; a dead bearer's grimoire crumbles (the GHS97 carry rule applies) |
| WX12 | My Hero Academia | Support items, licensed and registered, built by support-course engineers (Hatsume) | Pure engineering tools under legal licensing; the user's Quirk shapes what tool they need |
| WX13 | Frieren | Magic tools and grimoires as collectible spells, mimic chests | Tools and spells are loot from dungeons; a hobby collection loop with a real cost (mimics) |
| WX14 | Elden Ring | Smithing stones (regular versus somber), Ashes of War moved between weapons, talismans, crafting kit | Abilities are detachable and moved between tools at a site of grace; upgrade materials gate by weapon family |
| WX15 | D&D | Magic items with attunement (three slots), cursed items you cannot drop, tool proficiencies (thieves' tools, herbalism kit) | Tool proficiency is an explicit skill axis; curses hide until used; attunement takes a short rest |
| WX16 | Fallout | Workbenches gate mods, perks gate recipes, junk breaks down into parts | Salvage and station economy; tools are mostly stations, and the item is the parts it breaks into |
| WX17 | Mother of Learning | Imbued items, golems, soul-marked objects that survive the loop | Most tools reset each loop; only soul-keyed ones carry (GHS96). Restarting resets the workshop |
| WX18 | Original frontier / Village | Plain hand tools, a shared village smithy, one inherited heirloom tool | The baseline: no power, only fit, wear, quality, borrowing and the bootstrap (TQ8) |

## AX. The axes that make tool families differ

A world's tool rulebook can be written as a setting on each axis, so a new world is data (MR11, MR12).

| Code | Axis | Settings seen above |
|---|---|---|
| AX1 | **Where the power lives** | In the tool (JJK effect tools, LotM), in the wielder routed through it (Bleach, Nen conjuration), in a contract (Chainsaw Man), none (Village, MHA) |
| AX2 | **Who can use it** | Anyone (kunai), anyone with the right stat (Playful Cloud), compatible (Nichirin color), chosen (wand, grimoire, Samehada), bonded only (Zanpakutō) |
| AX3 | **How it changes hands** | Sale, loan, defeat (wand), death of bearer (grimoire crumbles), naming (Fate), inheritance, theft |
| AX4 | **Who pays** | Maker (infusion time), wielder (per-use price, side effect), target, world (aggregation) |
| AX5 | **What can sense it** | Six Eyes, Gyo, appraisal skills, a smith's eye; or nothing until used (D&D curses) |
| AX6 | **Custody and law** | School store (JJK), Church seal (LotM), Ministry (HP), license (MHA), none (frontier) |
| AX7 | **Will** | None, preference, refusal, hunger, active spirit with its own goals (WC5) |
| AX8 | **Detachability** | Fixed to the tool, movable between tools (Ashes of War, seals on kunai), carried on the body (FMA tattoos) |
| AX9 | **Repair** | Which layers each repairer reaches and how well (round 4, TQ210+): a mundane smith does the body well and the soul poorly or not at all; the original maker does best on their own work (Demon Slayer), and others close the gap with skill, material, notes or the user present; fragile relics are very hard, not forbidden, unless a world's lore makes them absolute |

## MC. Mundane tools and crafting

| Code | Consideration | Default, dial and reason |
|---|---|---|
| MC1 | **Tool choice inside a recipe.** A recipe step names a verb ("grind"), not an item; any tool that grants the verb works with its own control numbers | Composition beats catalogs (MR8). A mortar, a millstone and a cheat that grinds by thought all satisfy "grind" |
| MC2 | **Tool and material match.** A bronze chisel on granite dulls fast; a steel one does not | Instrument hardness versus material hardness sets wear rate and a quality ceiling, a small law table per world |
| MC3 | **Gathering tools set what is reachable.** Axe grade gates hardwood; a sickle versus bare hands changes herb condition | Harvest rolls (MR28) read the instrument's precision for condition, not identity |
| MC4 | **Sharing and lending in the Village.** One good saw, three households | Lending is a social action with trust and return dates; a broken borrowed tool creates a debt fact (companions and village loops) |
| MC5 | **Apprentice ladders by tool.** An apprentice earns the right to touch the master's tools step by step | A workshop's tool access is a permission list, a light way to stage mastery in a social frame |
| MC6 | **Heirloom tools.** A grandmother's needle with fit already high and a story attached | A start option and a carryover candidate: fit is soul-scope or line-scope by world (GHS97 whitelist) |
| MC7 | **Specialized versus general.** A multitool does many verbs badly; a specialist set does one well | Instrument profiles list verbs with separate control numbers; no forced specialization rule |
| MC8 | **Tools for nonhuman bodies.** Paws, tentacles, a slime body need different tools or none | Tool use reads body template functions (nonhuman making doc). A body can count as its own tool for some verbs |
| MC9 | **Idle automation through tools.** A water mill is a tool that works while you sleep | Stations with power sources run routines at their control numbers; quick depth never beats known (MR19) |
| MC10 | **Maintenance as a loop worth playing.** A short, satisfying sharpen before the day's work | Upkeep restores durability and lightly raises fit; skipping it shows up as slower work, not a popup |

## RC. Cheats that read or bend tools

| Code | Cheat shape | Rule |
|---|---|---|
| RC1 | **Tool history read**: see who made it, who held it, what it has cut | Knowledge projection only (MR31); truth unchanged |
| RC2 | **Perfect fit on first touch** | Skips TQ5 growth; does not raise the tool's quality |
| RC3 | **Any object as any tool** (improvised fallback with no penalty) | A clear, strong cheat for poor starts; still bound by material hardness (MC2) |
| RC4 | **Talk to the tool** (tools with will, AX7) | Reveals preferences and refusals; the tool may lie |
| RC5 | **Grade sight** (JJK-style grade, LotM danger) | Reads product and container roles; with a means error unless the cheat says otherwise |

## SB. Subtle details

- SB1. Left- and right-handed tools; a borrowed left-hand knife in a right hand works worse.
- SB2. Tool smell and sound as cues (a dull blade sounds different) in craft cues (`src/craft_cues.js`).
- SB3. A stolen tool can be recognized by its old owner from its marks (TQ10).
- SB4. Tools carry a world's law revision (MR30) when moved to another world; a cursed tool in the
  Village is a fine knife and nothing more without a compatibility law (MR14).
- SB5. A tool's name is earned by use, not by grade; naming is a small player action with a log line.
- SB6. Cold, wet and heat change grip and edge; weather reads instrument condition.

## ACT NOW (done in this file)

| Code | Finding | Change |
|---|---|---|
| TQ50 | No owner covered tools as instruments; power-in-a-thing (GHS) and weapons (WC) covered only the container and product roles | This palette, with the three-role split (TQ1) |
| TQ51 | The JJK brief's item row groups "cursed tools, relics, fingers" as one item kind (`worlds/jujutsu/WORLD_BRIEF.md:223`), which invites one item class | CT7 separates them: tools are instruments, cursed objects are containers (GHS102) |

## ACCOUNT FOR NOW (constraints, no feature work)

| Code | Constraint | Why |
|---|---|---|
| TQ52 | When tools first reach the craft resolver, they enter the frozen maker snapshot (MR23) as instrument ids plus their control numbers at commit time | A tool broken or upgraded mid-craft must not reroll a committed draw (MR2) |
| TQ53 | An instrument profile is content data read by resolvers, not a new save slice; per-instance state (wear, fit) lives with the item instance | One authority per fact; old saves load unchanged (MR33) |
| TQ54 | Tool verbs flow through the existing capability registry's `equipment` source kind, not a parallel tool flag | Reuses `src/capabilities.js`; no new import of `main.js` |
| TQ55 | Fit (TQ5) needs a holder key per user, so it waits for the item instance identity already used by the e2 durability proposal | Avoid a second instance id scheme |

## LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| TQ60 | Source-check WX1–WX17 against each world pack and wiki; mark SHOWN, STATED or wrong | Cheap reader per world, balanced reviewer, S each | Each row carries a status and locator, or is corrected |
| TQ61 | JJK pack: add CT1–CT10 to `jjk.tool` with sources (Cursed Tool r74969 already in ledger) | Balanced, S | MODULE_CATALOGUE row cites each split |
| TQ62 | Slice proposal "Village tools": a shared saw and a sickle with wear, fit and lending; one improvised fallback; tool enters the maker snapshot | Strong implementer, M | Borrow, use, return or break; fit grows; save, reload, Export and Import keep wear and fit; preview consumes nothing |
| TQ63 | Slice proposal "A tool without a technique" (JJK campaign seed 3) after TQ62, using CT1, CT3 and CT5 | Strong, M to L | A zero-energy user harms a curse only with a delivery tool; the school loan returns or leaves a debt |
| TQ64 | Per-world tool rulebook rows (AX1–AX9) for the first two book worlds | Cheap author, balanced reviewer, S | Each world has one filled row citing its pack |

## Suggested order, if Weibao picks any

TQ62 (Village tools) first: it needs no new world and gives every later tool family its base. Then
TQ63 in JJK, which reuses it and S5 from the genetics plan.

## Evidence

Read 2026-10-17: GENETICS_AND_HERO_START_PLAN round 4, the four weaponcraft palettes' headings and
JJK rows, MAKER_ARTS_BY_WORLD WQ6/W04, `docs/worlds/jujutsu/` grep for cursed tools and Heavenly
Restriction, MAKING_RULES table, MEANS_AND_APPRAISAL and crafting headings, `src/capabilities.js:4`,
`src/absorb_e2/durability.js` head, grep of `src/craft_*.js` for tools. Docs only; no build, test or
browser run.

## Round 2: how to implement, and tools and equipment by world (2026-10-17)

Weibao (2026-10-17): "how to go about implementing the ability to create, repair, and do other
things with tools and more? Tools and equipment in each world> more to conisder?"

### Correction to round 1

Round 1 said tools had no instrument role in code. That was wrong. The upstream game already has
most of a tool base, and the plan below extends it rather than adding a parallel system:

| Code | What exists (read 2026-10-17) | Where |
|---|---|---|
| TQ70 | `Tool extends Equippable`; the tool type *is* the equip slot; tools grant `base_bonus_skill_levels` (Iron pickaxe: Mining +3) and set `use_quality = false`, so tools have no quality today | `src/items.js:750`, templates from `src/items.js:3791` |
| TQ71 | Five tool slots: axe, pickaxe, sickle, shovel, fishing_pole | `src/data/character.js:5` |
| TQ72 | Gathering activities name `required_tool_type`; the check is only "slot not empty" | `src/activities.js:66`, `src/main.js:3489` |
| TQ73 | Tools are forged from components (handle plus head or blade) with skill and station tier setting success and quality | `src/crafting_recipes.js:1537`, `:30–33`, `:83` |
| TQ74 | Opt-in equipment durability: per-instance ids (`e2.N`), condition 0–100, wear per landed hit only, coin repair with a staged quote and commit, condition scales stats via `durability.factor` | `src/absorb_e2/durability.js`, panel wired in `src/main.js:1233–1274` |
| TQ75 | A portable leatherworking kit acts as a salvage tool with a condition receipt | `src/absorb_p23/salvage/salvage.js:11` |
| TQ76 | Lending already exists once: Tessa loans the patrol lantern and baton with a 50-coin debt if not returned | `src/main.js:3502` |
| TQ77 | The new craft resolver is pure (no draws), takes station tags per op, and has no tool input | `src/craft_resolver.js:1–44` |
| TQ78 | New features land through the domain registry (`registerDomain` with save, migrate, tick, commands, projection), one line in `main.js` | `src/domain_registry.js` |

So: **create** exists (forging), **repair** exists (coins only, combat wear only), **lend** exists
once (hardcoded). Missing are tool wear from work, skill repair, upkeep, fit, tool control in
crafting, modification, and tool rules per world.

### IP. Implementation plan (proposal; each phase is playable on its own)

Seam (AR1–AR16): one new domain, `tools`, registered from one line in `main.js`. It owns per-instance
tool facts that durability does not (fit, upkeep, provenance, loans). It reads durability for
condition and never writes a second condition value. Instrument profiles are content data, not
save state. Old saves load with the slice absent (MR33).

| Code | Phase | What lands | Done check (browser, fresh origin, 1366×768 and 1920×1080; save, reload, Export, Import where state changes) |
|---|---|---|---|
| IP1 | **Instrument profiles, read-only** | A content table mapping each existing tool template to `{verbs: {mine: {speed, yield, precision}}, hardness, capacity}`, derived first from `base_bonus_skill_levels` so numbers match today. Gathering keeps its slot check and adds a projection: the activity tooltip names the tool's effect | Same gather rates as before with every tool (golden comparison over fixed ticks); tooltip shows the tool's verb numbers; no save change |
| IP2 | **Wear from work** | Extend durability with `wearPerUse` by verb, called once per completed gathering cycle when durability is on. A broken tool (condition 0) stops the routine with a log line and offers the improvised fallback (TQ7) at worse rates | Durability off: identical behavior. On: a pickaxe loses condition per cycle, stops at 0, improvised mining runs slower; reload keeps condition |
| IP3 | **Repair by hand** | A `tools.repair` command beside coin repair: quote (skill, station, material such as a whetstone or new handle, time) then execute. Partial repair by skill; a failed repair can lose a little max condition (dial). Coin repair stays | Quote consumes nothing (MR4); repair with Forging at the village smithy restores condition and spends the material; save/reload/Import keep it |
| IP4 | **Upkeep and fit** | `tools.maintain` (sharpen, oil) as a short routine action; `fit` per instance per holder grows with meaningful use and upkeep, decays when idle. Fit reads into speed and variance only | A used tool fits better over game days; a newly bought one starts at base; fit survives reload and is lost on sale |
| IP5 | **Tools in crafting** | Recipe steps name a verb; the maker snapshot (MR23) freezes the instrument ids and numbers at commit. Legacy `station_tier` stays; tools add precision and time | Same recipe with a worn versus fresh hammer differs only in time and variance; breaking a tool after commit does not change the committed result |
| IP6 | **Modify and salvage** | Rehandle or swap a head through the existing component keys (head plus handle); salvage returns parts by condition (reuse p23 salvage rules). Provenance records maker and past holders | Swapping a handle keeps the head's history; salvage of a 30% tool returns fewer parts than a 90% one |
| IP7 | **Lending as data** | Generalize the Tessa loan into `tools.loan {item, from, to, due, debt}` with return, overdue and broken-on-loan outcomes; Tessa's loan migrates onto it unchanged | The patrol shift plays exactly as before; a borrowed saw can be returned, kept (debt) or broken (debt plus trust); Import keeps an open loan |
| IP8 | **World tool rulebook** | Per-world AX1–AX9 settings as data; a cross-world item without a compatibility law stays owned and acts as a plain tool (MR14) | Carrying a JJK delivery tool to the Village: it cuts like a good knife, its effect is inert, and the log says why |
| IP9 | **Power-bearing tools** | After genetics S5: an instrument may point at a power instance (GHS86) for its `effect`; `delivery` reads the wielder or the tool's charge (CT1, CT3) | A zero-energy JJK user harms a curse only with a delivery tool; the effect tool needs custody to move |

Order: IP1 → IP2 → IP3 is the smallest useful set (tools wear and you can fix them yourself).
IP4 and IP7 add Village life. IP5 and IP6 need the crafting owners. IP8 and IP9 wait for a world slice.
This replaces round 1's TQ62 slice, since lending and forging already exist.

Verification per AD36: reuse the durability and salvage tests, add a regression for IP2 (durability
off means byte-identical gathering) and IP3 (quote consumes nothing), and one golden for IP1 rates.
Failure scenario to guard: a tool bound to a durability instance id during gathering changes its
inventory key and breaks stack merging or a loan record; IP2 must bind the same way
`prepareEquip` does today.

### VB. Things a player can do with a tool (verb catalog)

| Code | Verb | Phase | Notes |
|---|---|---|---|
| VB1 | Make | exists, IP5 | Forge or assemble; maker skill, station and tool set quality |
| VB2 | Repair | exists (coins), IP3 | By coin, by hand, by specialist; the original maker repairs their own work best (AX9, round 4) |
| VB3 | Maintain | IP4 | Sharpen, oil, restring, rewrap a grip |
| VB4 | Modify | IP6 | Rehandle, regrind, add a fitting, socket a gem or Ash of War (world rule) |
| VB5 | Salvage | exists (p23), IP6 | Parts by condition |
| VB6 | Inspect | IP1 | Read its verb numbers; deeper reads (maker, history, grade) need means (RC1, RC5) |
| VB7 | Lend, borrow, rent | exists once, IP7 | With due dates, debts and trust |
| VB8 | Store and carry | later | Tool rack at home, carry load, concealment (CT4), theft risk |
| VB9 | Name and bond | later | Naming by use (SB5); bond for worlds with chosen tools (AX2) |
| VB10 | Infuse or enchant | IP9 | World law; cost on maker or user (AX4) |
| VB11 | Sell and buy | exists (trader) | Value reads condition and provenance |
| VB12 | Teach with it | later | An apprentice uses your tool under watch (MC5) |

### WE. Tools and equipment by world (what the packs already say, and the first tool job)

Read-only survey of `docs/worlds/*` and [maker arts by world](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md)
on 2026-10-17. Locators are relative to `docs/worlds/`. Pack labels are kept as written (`W` wiki, `C`
official, `O` original, `P` proposal, `U` unverified). "First tool job" is a proposal that reuses IP1–IP7.

| Code | World | Families in the pack | Make, repair and custody already stated | Gaps | First tool job (proposal) |
|---|---|---|---|---|---|
| WE1 | Original frontier / Village | Native gathering tools and recipes, Shack workbench, old craftsman (`original-frontier/CAMPAIGN.md:18–19,46`) | Reuses native tools (`IMPLEMENTATION_PACKET.md:52`) | Recipes are listed only in `src` | IP1–IP3 as written: wear, hand repair at the smithy |
| WE2 | Demon Slayer | Nichirin blade with material, maker, owner, condition (`demon-slayer/SYNTHESIS.md:26`); swordsmith apprentice start (`CAMPAIGN.md:16`) | Repair under custody (`INTERACTIONS.md:9`); a forged blade grants no power (`SYNTHESIS.md:70`) | Forging method and ore sourcing open (`SYNTHESIS.md:76,96`) | Apprentice regrinds a returned blade; repair limited to the original smith (AX9) |
| WE3 | Jujutsu Kaisen | Cursed tools and objects (`jujutsu/MODULE_CATALOGUE.md:25`), talismans, carry/inspect/repair kit ladder (`CAMPAIGN.md:34`) | A tool does not teach its method (`SYNTHESIS.md:87`); repair and authentication job (`CAMPAIGN.md:61`) | Who forges cursed tools is unstated (E06) | Housing repair on a school-owned tool; function check needs a qualified sorcerer (CT5, IP9 later) |
| WE4 | Bleach | Zanpakutō on a forged Asauchi basis (`bleach/SYNTHESIS.md:23–24`), artifact schema with owner, holder, housing, condition (`:64`) | Ordinary repair versus paid qualified survey (`IMPLEMENTATION_PACKET.md:39–40`) | Device recipes and Bankai-loss procedures `U` (`SYNTHESIS.md:46,120`) | Repair a Zanpakutō's housing (guard, wrap); the blade's soul is not touched |
| WE5 | Fullmetal Alchemist | Automail needing fabrication, fitting, maintenance and climate upkeep (`fullmetal-alchemist/SOURCE_LEDGER.md:25`, `SYNTHESIS.md:46,77`); Rush Valley repair season (`CAMPAIGN.md:9,20`) | Knowledge, tools, matter, body and permission are separate means (`SYNTHESIS.md:27`) | Costs need primary volumes | Automail upkeep as a body-worn tool: fit and climate wear (IP4) on a limb |
| WE6 | My Hero Academia | Support items with owner, compatibility, stock, condition, repair, approval (`mha/MODULE_CATALOGUE.md:12`); support-course start (`CAMPAIGN.md:19`) | Borrow, replace or proceed without (`INTERACTIONS.md:19`) | No item list; developer licensing absent | Fix a classmate's support item before a drill; approval as a gate |
| WE7 | Naruto | Puppets with frame, joints, mechanisms, repair, poison stock (`naruto/SOURCE_LEDGER.md:47`); repair yard and compact (`CAMPAIGN.md:39,46`) | Human puppets exceptional | Blade metal, tags and seals only in E07 | Restock and re-seal a kunai pouch; puppet joint repair later |
| WE8 | One Piece | Seastone, weapon craft, gear custody (`one-piece/MODULE_CATALOGUE.md:9,23,57`); shipyard repair (`CAMPAIGN.md:22–23`) | Equipment does not pass the old owner's power (`MODULE_CATALOGUE.md:9`) | No weapon-maker roster | Shipwright patch job: the ship is the big tool, with damage beyond repair (`SOURCE_LEDGER.md:27`) |
| WE9 | Harry Potter | Wand and catalyst, wandwood affinities, apprentice with a rented bench (`harry-potter/WORLD_BRIEF.md:35,49`) | A good tool does not make magic in an ineligible body (`WORLD_BRIEF.md:41`); wand loyalty as a borrowed-tool matter | Goblin work unknown; novels not read | A borrowed wand underperforms (fit as allegiance, AX3) |
| WE10 | D&D (SRD 5.2.1) | Start kit, tool proficiencies, Calligrapher's Supplies (`dnd/SRD521_START.md:35–44`, `FIRST_SLICE.md:19–25`) | Four routes to mend a torn bag: spell, paid worker, needle and skill, replace | Object damage adapter missing (`FIRST_SLICE.md:42`) | The four-route mend, which maps directly to IP3 plus coin repair |
| WE11 | Mother of Learning | Formula lamp with stored fuel (`mother-of-learning/WORLD_BRIEF.md:21–23`), prepared tools (`GW1_GW3_...md:42–47`) | Charge separate from capacity; finite tool separate from service (`WORLD_BRIEF.md:79`) | Golems only in E11 | Refuel and recharge as upkeep; loop resets the workshop (WX17) |
| WE12 | Paradise hub | Workshop, bench, refit, Equipment Hall, grade cards, forge partnership (`paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md:28,59,72`) | Service record with worker, place, skill, duration, capacity (`:87`) | Acquisition contracts UNKNOWN (BC7) | Commission a refit through the service record; the loan model (IP7) covers rentals |
| WE13 | Black Clover | Grimoires, Anti Magic swords, basic kit (`black-clover/SYNTHESIS.md:23,27`, `CAMPAIGN.md:12`) | Daro repairs and sells ordinary tools (`CAMPAIGN.md:24`); grimoires are personal access, not slots | No grimoire or sword making | Daro's shop as a repair job; grimoires stay out of IP phases |
| WE14 | Frieren | Tools, grimoires, herbalist kit, warrior gear (`frieren/CAMPAIGN.md:35`, `SYNTHESIS.md:37,40`) | `ActorMeans` holds tools (`MODULE_CATALOGUE.md:34`) | No staff making, smith or repair | Herbalist kit upkeep on a long journey |
| WE15 | Hunter x Hunter | License, exam ordinary tools, trader repair, boat repair (`hunter-x-hunter/CAMPAIGN.md:9,11,41`) | License is a credential, not power | No gear law or Nen item making | Whale Island boat repair as a livelihood |
| WE16 | Chainsaw Man | Weapon devils, legal gun carry (`chainsaw-man/SYNTHESIS.md:28`) | Contracts only | No ordinary gear | Supply technician (E15): issue, return and log hunter gear under law |
| WE17 | Elden Ring (inactive) | Ashes, whetblades, regular and Somber stones, urn repair loop (`elden-ring/SOURCE_LEDGER.md:24,29,63`, `WORLD_BRIEF.md:28`) | Armor does not inherit weapon reinforcement (`SOURCE_LEDGER.md:38`) | `EU2` open | Move an Ash between compatible armaments (IP6 modify) |
| WE18 | Fallout (inactive) | Weapon mods, power armor upkeep, work rig (`fallout/SOURCE_LEDGER.md:21`) | Salvage keeps condition; installs do not duplicate parts (`:37`) | Repair recipes unsourced (`FU1`, `FU2`, `FU7`) | Junk to parts to mod, using IP6 salvage |
| WE19 | Skyrim (inactive) | Enchanting with learned effect, filled gem, eligible item; work-station smithing (`skyrim/SOURCE_LEDGER.md:21`) | A drained blade remains a blade (`MODULE_CATALOGUE.md:19`); bench tenancy recorded (`:22`) | Perk milestones unchecked | Recharge versus re-enchant; bench rental through IP7 |
| WE20 | Fate | Mystic Codes, catalysts, artifact schema with operator and charge (`fate/SYNTHESIS.md:42,62`) | Workshop account reconciles material, labor, fuel, evidence (`CAMPAIGN.md:48`) | Projection and maintainer rules missing; E05 says the folder is unchecked | Maintain a Mystic Code's charge; projection stays a sourced exception |

Worlds with little or no tool content: proving-ground, novel-worlds (candidates only), and the thin
rows above (Chainsaw Man, HxH, Frieren, Black Clover). Fate, Shadow Slave, Worm, Legendary Mechanic
and LotM equipment lives only in MAKER_ARTS (B01–B17, E22–E36) and private research.

**What the packs agree on without saying so (TQ80).** Almost every pack separates the item's
custody, its condition, its maker and any power it carries, and almost every first job is repair,
not making. So IP3 (hand repair) plus IP7 (loans) is the shared first need across worlds, and
making special equipment can stay per world.

### Corrections to round 1's WX rows (from MAKER_ARTS)

| Code | Row | Correction |
|---|---|---|
| TQ81 | WX15 D&D | Attunement is optional per item; only some items need it |
| TQ82 | WX14 Elden Ring | Ashes of War apply only to compatible armaments |
| TQ83 | WX1 Bleach | Nimaiya forges the Asauchi blank; the imprint comes from the soul |
| TQ84 | WX5 Fate | Shirou's projection is an exceptional route, not ordinary fabrication |
| TQ85 | WX8 FMA | 2003 and 2009 continuities differ; rows need a continuity label |

### MT. More to consider for implementation

| Code | Consideration | Disposition |
|---|---|---|
| MT1 | **Tools have no quality today** (`use_quality = false`). Turning it on for old templates changes every saved tool's stats | ACCOUNT FOR NOW: keep it off for existing templates; new tools carry instrument numbers instead, so no migration is needed |
| MT2 | **Instance identity.** Tools are stackable by id until durability binds an `e2.N` instance. Fit, provenance and loans need an instance | ACCOUNT FOR NOW: the `tools` domain keys by the durability instance key and binds through `prepareEquip`, never a second id scheme (TQ55) |
| MT3 | **Durability is a global opt-in.** Tool wear should follow the same switch, or players lose tools they never agreed to maintain | ACCOUNT FOR NOW: IP2 wear runs only when durability is on; a separate "tool wear" dial can come later |
| MT4 | **The durability panel is wired in `main.js`** (`:1233–1274`), against AR1 | LATER: when IP3 adds hand repair, the repair UI moves into the `tools` domain's panel and `main.js` keeps one registration line; structural move in its own commit (AR "structure separate from behavior") |
| MT5 | **Two crafting engines.** Legacy recipes (skill plus station tier) and the pure batch resolver | ACCOUNT FOR NOW: IP5 adds tool input to the legacy path first (tools are made there); the batch resolver gets tool numbers as a station-like input later, without draws |
| MT6 | **One slot per tool type.** You cannot carry a spare axe in the slot or use two tools at once | LATER: a tool belt or kit container (VB8) for carry; dual-tool verbs stay out until a world needs them |
| MT7 | **Offline and idle time.** Long idle gathering could grind a tool to zero overnight | ACCOUNT FOR NOW: wear per completed cycle, not per minute, and a broken tool stops the routine with a log line so idle time is not wasted silently |
| MT8 | **NPC makers use the same rules** (MR23). Tessa, the smith and later NPC crafters own tools too | LATER: NPC tools as profiles with no per-instance wear until an NPC tool can be lent or stolen |
| MT9 | **UI home.** Inspect, repair, maintain and lend need one surface | ACCOUNT FOR NOW: follow UI_RULES, with one center "Tools" view opened from the equipment area through the shared controller, bottom back bar and Esc; hover on a tool shows its verb numbers (UR41–UR48) |
| MT10 | **Cheat and debug view.** A director view showing every tool's condition, fit and loan helps verify IP2–IP7 | LATER: read-only inspector first; any mutation goes through the same commands |
| MT11 | **Economy.** Repair by hand makes coin repair pointless unless it costs time or skill | ACCOUNT FOR NOW: hand repair costs time and material and can fail; coin repair is instant. Both stay useful |
| MT12 | **Station access.** The village smithy is a place with an owner; using it may need permission or rent | LATER: reuse IP7 loans for bench rental (Skyrim tenancy, HP rented bench) |

### ACT NOW (done in this file)

| Code | Finding | Change |
|---|---|---|
| TQ86 | Round 1 missed the existing tool base (TQ70–TQ78) and proposed a TQ62 slice that partly already exists | Correction table above; IP1–IP9 replace TQ62 |
| TQ87 | Round 1 WX rows had five errors against MAKER_ARTS | TQ81–TQ85 |

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| TQ90 | Implement IP1–IP3 as one wave in the `tools` domain | Strong implementer, M | IP1–IP3 done checks pass in a rebuilt browser at both viewports; durability-off regression passes |
| TQ91 | Fill AX1–AX9 rows for WE2 and WE10 (Demon Slayer, D&D) as the first two world tool rulebooks | Cheap author, balanced reviewer, S | Each row cites its pack lines above |
| TQ92 | Read `PROGRESSION_AND_ASSEMBLY.md`, `NONHUMAN_MAKING_AND_BUILDING_2026-10-14.md` and the world-depth weaponcraft cheat file for tool facts this round did not cover | Cheap reader, S | Any new fact is folded here with a locator |

### Round 2 evidence

Read 2026-10-17: `src/items.js:505–560, 732–762, 3791–3830`; `src/data/character.js:5`;
`src/activities.js:66,162–217`; `src/main.js:1233–1274, 3480–3510`; `src/crafting_recipes.js:30–85,
1537–1556`; `src/absorb_e2/durability.js:95–179`; `src/absorb_p23/salvage/salvage.js:1–34`;
`src/craft_resolver.js:1–44`; `src/domain_registry.js`. One read-only Sonnet survey of `docs/worlds/`
(no private folders). Docs only; no build, test or browser run.

### Save compatibility update (2026-10-17)

Weibao started IP1-IP3 and said old save compatibility is no worry for now
([decision](../PROJECT.md)). MT1 and MT2 relax: tools may gain quality or per-instance identity
without a migration, and the IP2 durability-off regression protects behavior, not old saves. Save,
reload, Export and Import of new tool state remain required.


## Round 3: types of crafting, types of repair, world requirements (2026-10-17)

Weibao (2026-10-17): "types of crafting, tyeps of repair, each world based requirements and more?"

Not restated: resolution modes GT1–GT9 and rulebook fields WR1–WR10 ([crafting engine](CRAFTING_ENGINE.md#gt-generation-rule-types-resolution-modes)),
MR11, maker arts per world ([MAKER_ARTS](worlds/MAKER_ARTS_BY_WORLD_2026-10-14.md)), WE1–WE20 above.
GT answers "how is the result computed". This round adds three other ways of sorting: what the
making does to matter, how it is organized, and what breaks and how it is fixed. World rows are
MEMORY unless they cite a WE row or pack line.

### Kinds of making, by what happens to the material (TQ100–TQ115)

| Code | Kind | What it does | Examples | Usual GT mode |
|---|---|---|---|---|
| TQ100 | Shaping by removal | Cut, carve, grind, file away | Woodcarving, stone, gem cutting, wand carving | GT9 parts, GT1 for quality |
| TQ101 | Shaping by force | Forge, bend, hammer, press | Smithing, Nichirin forging | GT9 + GT5 grade |
| TQ102 | Forming | Cast, mold, throw, blow | Bronze casting, pottery, glass | GT1 |
| TQ103 | Joining and assembly | Fit, rivet, sew, glue, wire | Tool head on handle (exists), armor, puppets, automail | GT9 |
| TQ104 | Chemical change | Brew, cook, smelt, tan, dye, distill | Potions, pills, food, ingots, leather | GT1, GT2, GT3, GT5 |
| TQ105 | Growing | Cultivate, graft, breed, ferment | Herb beds, Wood Release-like growth, gu insects, bonsai tools | GT1 over time |
| TQ106 | Writing and encoding | Inscribe, draw circles, write tags, program | Runes, explosive tags, transmutation circles, Mother of Learning formulas | GT7 |
| TQ107 | Infusion and binding | Charge, imbue, enchant, bind a soul or curse | JJK infusion (CT6), Skyrim enchanting, sealed artifacts | GT6 for the bound thing, GT7 for the pattern |
| TQ108 | Transmutation | Rearrange matter under a conservation law | FMA alchemy (equivalent exchange), Wood/earth releases | GT1 with MR5 conservation enforced |
| TQ109 | Conjuration | Make from power with no matter, often temporary | Nen-conjured chains, Quincy weapons, Emiya projection, Weapon Devils | Power cost, no materials; duration and vows |
| TQ110 | Copying | Reproduce an existing thing | Projection (exceptional, TQ84), copy scrolls, Elden Ring duplication | Copy is lesser by default (dial per world) |
| TQ111 | Salvage and refit | Take apart and reuse | Fallout junk, p23 salvage (exists), cannibalizing | GT9 in reverse |
| TQ112 | Performing | Make an effect through skilled action, not an object | Songs, rituals, dances that bless a tool | Ritual laws (LotM) |
| TQ113 | Building | Work at structure scale over long time | Houses, ships, smithies, settlements | GT9 with projects (TQ121) |
| TQ114 | Making abilities | Design a technique, vow or Nen ability | HxH ability design, JJK vows, cultivation arts | Owned by skills and GHS90, not crafting; listed so it stays out of the crafting resolver |
| TQ115 | Decorating and finishing | Engrave, polish, paint, sign | Maker's marks, naming a tool | Changes value and provenance only, by default |

### Kinds of making, by how it is organized (TQ116–TQ125)

| Code | Kind | Consequence |
|---|---|---|
| TQ116 | One-off by hand | Full depth (MR18 deep) |
| TQ117 | Batch | Quick depth repeating a recorded method; yield and variance per batch |
| TQ118 | Commission | Someone else makes it to your order: terms, deposit, wait, delivery (paradise hub service record, WE12) |
| TQ119 | Apprenticeship work | Work under a master: access to tools (MC5), teaching, shared credit |
| TQ120 | Collaboration | Two makers each own a step (Demon Slayer smith plus swordsman, JJK civilian housing plus sorcerer infusion, WQ6) |
| TQ121 | Long project | Multi-day or multi-season work with stages that save and can be interrupted (building, infusion, growing) |
| TQ122 | Production line or station | Idle automation at a station (MC9); quick never beats known (MR19) |
| TQ123 | Field craft | Away from a station with a portable kit; worse control, light kit (p23 leather kit) |
| TQ124 | Contest or exam | Made under rules and judged (Hogwarts class, HxH exam, guild test) |
| TQ125 | Illicit making | Unlicensed, hidden, with detection risk (MHA unlicensed support gear, controlled potions) |

### Kinds of damage (TQ130–TQ141)

Repair starts with knowing what is wrong. Today condition is one number (TQ74). These are the kinds a
later phase could split it into; each world uses the ones that fit.

| Code | Damage | Typical cause | Notes |
|---|---|---|---|
| TQ130 | Dull or worn | Normal use | Upkeep fixes it (IP4) |
| TQ131 | Chipped or nicked | Hard material, a parry | Regrind; loses a little mass |
| TQ132 | Bent or warped | Force, heat | Straighten; may hide a crack |
| TQ133 | Cracked | Stress, cold | Hidden until inspected (MR1: acts whether known); can fail suddenly |
| TQ134 | Broken | Overload | Pieces kept; reforge or replace a part |
| TQ135 | Missing part | Lost, stolen, salvaged | Replace part (component system exists) |
| TQ136 | Corroded or rotted | Wet, salt, time | Clean, treat, or the part is lost |
| TQ137 | Burned or melted | Fire, techniques | Often a part replacement |
| TQ138 | Drained | Spent charge, fuel, cursed energy | Recharge, not repair (MoL lamp: charge separate from capacity) |
| TQ139 | Corrupted or cursed | Exposure, a hostile technique | Cleanse; may need a specialist or a church (LotM) |
| TQ140 | Detuned or unbonded | Wrong user, long disuse, theft | Re-attune or re-bond (wands, Zanpakutō) |
| TQ141 | Wounded (living tools) | Combat | Heals over time, by feeding or by a healer (Samehada, living Dials, Teigu beings) |

### Kinds of repair (TQ142–TQ160)

| Code | Repair | Who and what | Result |
|---|---|---|---|
| TQ142 | Upkeep | Owner, small kit | Restores dull/worn; small fit gain (IP4) |
| TQ143 | Coin repair | A paid shop | Exists (TQ74); instant, full |
| TQ144 | Hand repair | Skill, station, material, time | IP3 (in progress); can fail |
| TQ145 | Field patch | Portable kit, improvised parts | Quick, temporary; lowers max until done properly |
| TQ146 | Part replacement | Any maker who can make or buy the part | Keeps the rest; provenance records the swap |
| TQ147 | Reforge | A smith, the pieces | Rebuilt from fragments; identity question (TQ170) |
| TQ148 | Specialist repair | People whose skill, knowledge or license gives them the best results | Automail mechanics (WE5), MHA support course (WE6), Church for sealed artifacts; outsiders can try with worse odds or an illicit route |
| TQ149 | Original maker's advantage | That smith or workshop does best; others can match them through skill, matching material, the maker's notes, the same school, or the user's help, or accept worse results | Demon Slayer (WE2); if the maker dies or refuses, the item still has routes (round 4, TQ214) |
| TQ150 | Spell mend | A spell or technique | D&D Mending (WE10), HP Reparo (MEMORY): instant, often only for plain objects |
| TQ151 | Transmuted repair | Alchemy with matching material | FMA: needs the right matter and understanding of the structure |
| TQ152 | Self-repair | The tool itself, over time or by feeding | Zanpakutō regrowing from spirit (MEMORY, check WE4 `U`), Samehada, living tools |
| TQ153 | Recharge or refuel | Power source, fuel, gem | Fixes drained (TQ138) only |
| TQ154 | Re-enchant or re-infuse | Maker with the pattern or power | Restores a lost effect; may differ from the original |
| TQ155 | Cleanse | Priest, purifier, ritual | Removes corruption; can strip a wanted effect too |
| TQ156 | Re-attune or re-bond | The user, time, a rite | Restores fit or allegiance |
| TQ157 | Visible repair | A maker who chooses to show it (kintsugi style) | Adds history and sometimes value; a world or culture dial |
| TQ158 | Restoration | An expert on old work | For relics and antiques; a bad restoration lowers value |
| TQ159 | Reset by time | A loop, a time ability, a rewind | Mother of Learning loop resets the workshop (WX17); JoJo-style restoration as a cheat |
| TQ160 | Replacement by an institution | School, guild, army issues a new one | Debt, paperwork or a reprimand; the old item's history ends |

**Repair outcomes (TQ161).** Full, partial, lower max condition, a scar or quirk (a tell in use), better
than before (a re-temper by a master), or a hidden flaw the repairer missed (truth versus knowledge,
MR1). Which outcomes a world allows is a dial.

**Diagnosis comes first (TQ162).** Inspecting damage is its own small action with means and error
(MEANS appraisal). A crack missed at diagnosis stays in the tool. A cheap repair of the wrong damage
does nothing to the real one.

### Requirements: one record shape for making and repair (TQ163–TQ166)

| Code | Consideration |
|---|---|
| TQ163 | **One input record** for making and repair (revised round 4: these are inputs that shift results, not gates; a world marks a field as a hard gate only when its lore says so): `{skill: {id, level}, station: tag, tools: verbs, materials, power: {kind, amount}, knowledge: method id, eligibility: keys, permit, people: roles, time, calendar}`. Each field is optional. Worlds fill rows; the resolver reads them. This matches GHS92 eligibility keys and the existing `requires` language |
| TQ164 | **Requirements are shown before commit.** The quote lists each one as met, missing, or unknown (unknown when the player lacks the means to tell), consuming nothing (MR4) |
| TQ165 | **Substitutes per field.** A missing station may have an improvised substitute (TQ7); a missing permit may have an illicit route (TQ125); a missing skill may have a commission (TQ118). Substitutes are rows, not special cases |
| TQ166 | **People are a requirement too.** Collaboration (TQ120) and original-maker repair (TQ149) need a named person available, with their own schedule and willingness |

### World requirements (TQ170–TQ189)

The required fields for making and repair in each world. Rows citing WE are from the packs; the rest
is MEMORY, to be checked under TQ60.

| Code | World | Making needs | Repair needs | What is special |
|---|---|---|---|---|
| TQ170 | Village (WE1) | Skill, station (smithy, workbench), material | Coin or hand repair | None beyond skill: the baseline |
| TQ171 | Demon Slayer (WE2) | Sunlight-ore material, swordsmith skill and village access | The original smith does best; another village smith of similar skill with matching ore comes close; an outside smith restores the body with weaker fit (TQ214) | Power belongs to the swordsman; the blade's color reads the wielder |
| TQ172 | Jujutsu Kaisen (WE3) | Ordinary maker for the housing, plus a sorcerer's energy and time for infusion (TQ120, CT6) | Housing: any smith. Function: a qualified sorcerer (authentication, WE3) | Custody by school; grade; tools do not teach their method |
| TQ173 | Bleach (WE4) | Asauchi from the forger (Nimaiya); the user's soul makes the Zanpakutō | Housing repair, or a paid qualified survey (WE4); deeper damage `U` | The blade is part of the soul; loss is injury |
| TQ174 | FMA (WE5) | Circle, understanding of the structure, matching matter; automail needs a mechanic | Transmuted repair, or the automail mechanic with climate upkeep | Equivalent exchange; knowledge, matter, body and permission are separate means |
| TQ175 | MHA (WE6) | Support-course skill, workshop, approval and license | Support workshop; borrow, replace or go without (WE6) | The user's Quirk sets what the tool must fit |
| TQ176 | Naruto (WE7) | Ninja tool stock, sealing skill for tags and scrolls, puppet frames | Repair yard, puppet service court | Mass-produced cheap tools beside a few willful blades |
| TQ177 | One Piece (WE8) | Shipwrights, smiths, rare materials (Seastone, Adam wood, MEMORY) | Shipyard repair; damage can exceed repair | Ships as tools with a life (crews mourn a ship, MEMORY) |
| TQ178 | Harry Potter (WE9) | Wandmaking knowledge, wood and core, a magical body to use it | Reparo for plain objects; a broken wand is rarely fixable (MEMORY) | Eligibility: a good tool does not make magic in an ineligible body (WE9) |
| TQ179 | D&D (WE10) | Tool proficiency, kit, time, gold budget (GT4) | Four routes: spell, paid worker, needle and skill, replace | Proficiency is an explicit axis |
| TQ180 | Mother of Learning (WE11) | A formula anchoring a real spell, workshop access gates | Recharge separate from repair; the loop resets almost everything | Only soul-keyed things carry |
| TQ181 | LotM | Characteristics (conserved), ritual knowledge, a Sequence to handle them | Church custody; cleanse or re-seal | Every power item has a side effect |
| TQ182 | Paradise hub (WE12) | Service record: worker, place, skill, duration, capacity | Shared-space repair, forge partnership | Transactions run offer, terms, reserved materials, service, delivery |
| TQ183 | Black Clover (WE13) | Ordinary smiths (Daro); grimoires are not made | Daro's shop | Grimoires grow with the bearer and crumble at death |
| TQ184 | Frieren (WE14) | Herbalist kit; staff making unverified | None stated | Long journeys make upkeep matter more than making |
| TQ185 | HxH (WE15) | Nen conjuration (ability design, TQ114); ordinary trade | Trader repair, boat repair | Conjured tools are abilities, not items |
| TQ186 | Chainsaw Man (WE16) | Contracts for devil weapons; legal gear issue | Issue and replacement by the organization (TQ160) | Hunters only may carry guns |
| TQ187 | Elden Ring (WE17) | Smithing stones by family, a smith or grace site | Whetblades and stones; urn repair loop (original) | Ashes move only between compatible armaments |
| TQ188 | Fallout (WE18) | Workbench, perks, junk parts | Salvage parts, bench | Installs do not duplicate parts |
| TQ189 | Skyrim (WE19) | Learned effect, filled gem, eligible item, station | Recharge versus re-enchant | A drained blade is still a blade |

### More to consider

| Code | Consideration | Disposition |
|---|---|---|
| TQ190 | **Identity after repair.** When a reforged blade is still "the same" blade matters for bonds, custody, provenance and named items | ACCOUNT FOR NOW: identity follows a declared core part (the blade, the core, the soul) per item kind; replacing the core makes a new item that records its predecessor |
| TQ191 | **Repair as livelihood.** Many pack first jobs are repair work (boat, automail, Daro, support items) | LATER: a repair-shop routine on the Village career pattern (customers bring damaged items with typed damage) |
| TQ192 | **Repair as story.** A broken heirloom, a blade only a dead smith could fix, a tool that refuses a new hand | LATER: storylet hooks keyed on damage kind plus the item's provenance |
| TQ193 | **Repair skill grows separately from making skill.** A good mender is not always a good maker | ACCOUNT FOR NOW: IP3 uses the making skill (Forging); a separate repair skill is a dial for later, not a new skill now |
| TQ194 | **Repair can improve what was known.** Taking a tool apart reveals its maker, materials and hidden flaws | ACCOUNT FOR NOW: repair writes knowledge claims about the item (MR31) as a side effect, never changes truth |
| TQ195 | **Cost of not repairing.** A cracked tool fails at a bad time; a dull one just slows you | LATER: typed damage lets failure happen at the right moment instead of a flat stat penalty |
| TQ196 | **Cross-world repair.** A Village smith on a JJK tool does the housing well and cannot perceive the cursed layer (MR14) | ACCOUNT FOR NOW: repair rows are per world and per item kind; with no row, the repairer works on the layers they can perceive, and the others are unchanged and unknown to them (round 4) |
| TQ197 | **Nonhuman bodies as tools and repairers.** A golem repairs itself with clay; a slime cannot hold tongs | LATER: body template functions feed TQ163 eligibility (nonhuman making doc) |

### ACT NOW (done this round)

| Code | Change |
|---|---|
| TQ198 | Sent the running IP1–IP3 session a constraint: the repair command takes a `kind` (only `hand` built) and reads requirements from a content table keyed by kind and tool type, so TQ142–TQ160 and TQ170–TQ189 add rows later instead of code. Delivery queued, not confirmed |

### LATER / DELEGATE

| Code | Item | Level, effort | Done check |
|---|---|---|---|
| TQ199 | Typed damage phase: split condition into TQ130–TQ141 kinds used by the Village, with diagnosis (TQ162) | Strong implementer, M | A cracked tool is found only by inspection, fails under load, and the right repair fixes it; save, reload, Export, Import keep damage kinds |
| TQ200 | Source-check TQ170–TQ189 MEMORY cells against packs and wikis | Cheap readers, balanced reviewer, S per world | Each cell carries a status and locator |

Evidence: CRAFTING_ENGINE round 2 (GT, WR, RS), MAKER_ARTS world rows W01–W19, MAKING_RULES MR11,
round 2's WE survey. Docs only; no build, test or browser run.

## Round 4: layered repair, and guiding instead of gating (2026-10-17)

Weibao (2026-10-17): "condider subtle stuff like fixing one aspect but not being able to fix
another? like fixing physical or not the soul or other way around, something likf demon slayer,
depends on the blade, but maybe other smith can fix, if similar skill level or some sort of material
or bypass or else worse results? /more-to-consider dont constrain, guide?"

### What was wrong in rounds 1 to 3

Several rows were written as gates ("original maker only", "the only people who can", "housing
only", a requirement record). That breaks Rulebook 1 and AD5: limits are adjectives with an in-world
reason, not locks. The rows were rewritten in place. Old wording, kept as history:

| Row | Old wording (2026-10-17, rounds 1–3) |
|---|---|
| AX9 | "original maker only (Demon Slayer), impossible (fragile relics)" |
| VB2 | "by original maker (Demon Slayer, AX9)" |
| TQ148 | "The only people who can, by skill or law" |
| TQ149 | "Original maker only" |
| TQ163 | "One requirement record" |
| TQ171 | Repair needs: "The original smith (TQ149)" |
| TQ196 | "fixes the housing only"; "only housing repair applies" |

**Default from here (TQ209).** A repair or making input changes the odds and the quality band.
Anyone may attempt anything they can perceive and reach. A hard gate appears only where a world's
lore states one, and it is labelled as that world's absolute with its source.

### Layers: what an item is made of (TQ210)

Damage and repair happen per layer. A world declares which layers its items have; the Village
has only the first three.

| Layer | What it is | Examples of damage | Who usually reaches it |
|---|---|---|---|
| Body | Matter and form | Crack, chip, break, rot | Any maker of that material |
| Function | Edge geometry, balance, mechanism, calibration | Off-balance after a crude reforge, a sticky trigger | A skilled maker; a skilled user can tell |
| Fit | How it suits this user (TQ5) | Reforged to a stranger's taste, long disuse | The user over time, or a maker working with the user present |
| Pattern | Inscription, circle, enchantment, seal | A scratched rune, a broken seal line | Someone who knows or can read the pattern |
| Charge | Stored energy or fuel | Drained, overcharged | A power source and a way to feed it |
| Bond | Allegiance or chosen-ness | Stolen, defeated owner, refusal | The user and the tool; sometimes a rite |
| Soul or will | A spirit, a curse, a stored self | Wounded, sleeping, corrupted, angry | Spirit-capable people; the tool itself, slowly |
| Record | Name, provenance, history, legal status | Forged papers, lost registration | Archives, institutions, appraisers |

### How a repair resolves (TQ211–TQ216)

| Code | Rule (default, dial, reason) |
|---|---|
| TQ211 | **Per-layer outcome.** One repair attempt names the layers it works on. Each layer's result is drawn from a band set by the repairer's reach, not a pass or fail: restored, restored differently (a new quirk, a color shift), restored weaker, looks fixed but is not, worsened, or knock-on damage to another layer |
| TQ212 | **Reach is a gradient.** Each repairer has a reach per layer from skill, knowledge and perception. Beyond their reach they can still work, at worse bands; outside what they can perceive at all they cannot target it, and that layer is left unchanged without their knowing |
| TQ213 | **Gap to the work.** The bigger the gap between the repairer's level and the item's grade or maker's level, the worse the band. A peer of the maker repairs nearly as well as the maker |
| TQ214 | **What closes the gap** (the "bypasses"). Each is a modifier, and they stack: matching or better material (the same ore); the maker's notes or pattern; the same school, lineage or village; the user present during the work (fit); the right station; more time; a second repairer for the layer the first cannot reach; a cheat; a sacrifice or extra power (the world's own cost) |
| TQ215 | **Layers are coupled.** Working one layer can disturb another: reforging the body loosens fit and may scar a soul; re-enchanting needs a sound body first; cleansing a curse can strip a wanted effect. Each world declares couplings with a risk |
| TQ216 | **Repair can reveal.** Opening a layer can show damage in another (fix the crack, find the soul is wounded). The repair writes what was learned as knowledge claims (TQ194) |

### Examples (MEMORY unless a WE row is cited; source check under TQ200)

| Code | Case | How layers play out |
|---|---|---|
| TQ217 | **Demon Slayer blade** (WE2) | Body: any capable smith with the right ore. Function and fit: the swordsman's own smith knows their grip, and an equally skilled village smith with that smith's notes comes close. An outside smith with plain steel gives a sound blade that cuts demons poorly (the ore is the anti-demon layer). A broken blade reforged by a stranger may change color or feel, which the slayer notices |
| TQ218 | **JJK cursed tool** (WE3) | Body by a mundane smith; the stored technique (pattern and charge) by a sorcerer who can perceive it. A mundane repair can look perfect while the technique has weakened, unseen until used |
| TQ219 | **Zanpakutō** (WE4) | Body regrows with the wielder's spirit; soul damage (MEMORY: a broken Bankai) is a soul injury where a smith adds little, and time, training or a rare specialist does more. Pack marks these procedures `U` |
| TQ220 | **FMA armor with a soul seal** (WE5) | Body repair by alchemy is easy; touching the seal risks the soul (strong coupling, TQ215). A careful repairer works around the seal at more time |
| TQ221 | **Wand** (WE9) | Reparo can fix the wood while a damaged core leaves the wand unreliable (MEMORY). A wandmaker reaches the core; others replace the wand |
| TQ222 | **Automail** (WE5) | Mechanism by any good mechanic; the nerve fitting (fit layer) is best by the original fitter, who knows that limb |
| TQ223 | **LotM sealed artifact** | Re-sealing restores containment (pattern) without removing the side effect (soul or will); a Beyonder of the right pathway does better |
| TQ224 | **Village heirloom** | Body by the smith; fit is the grandmother's, which a new owner rebuilds by use; record (the story) survives only if someone remembers it |

### Who perceives what (TQ225)

What a repairer, user or onlooker can perceive follows means (MEANS). A mundane smith sees body and
function. A skilled user feels fit and function. A sorcerer sees charge and pattern. Spirit sight
sees soul. The UI shows only perceived layers (MR31), so "looks fixed but is not" is real play: a
second opinion, or a use under load, can reveal it.

### Subtle details (TQ226–TQ235)

- TQ226. The repairer's imprint joins the item's record; a strong repairer's style can show in use.
- TQ227. A living or willful tool remembers who repaired it, and may favor or resent them.
- TQ228. A master user notices a function error a novice never feels (perception by user skill).
- TQ229. Two-person repair: a smith on the body while a priest steadies the soul, each on their layer.
- TQ230. Honest and dishonest assessments: an NPC repairer may oversell what they can do; reputation follows actual outcomes.
- TQ231. Soul and fit layers heal over game time, not in one action; the body is often quick.
- TQ232. A repair can improve one layer past its old level while another stays worse (a better edge, a weaker bond).
- TQ233. Some users would rather keep a damaged tool than let a stranger touch its soul.
- TQ234. Price follows layers: body cheap, soul dear, and shops quote only what they can reach.
- TQ235. The same layered model fits bodies and healing (JJK reverse technique heals body, not soul, MEMORY; MoL soul scars, GHS96). Kept as a later link, not a merge.

### Engine shape

| Code | Disposition | Item |
|---|---|---|
| TQ236 | ACCOUNT FOR NOW | Hand repair (IP3, in progress) should give a worse result band instead of refusing when a station, material or skill level is short, unless a row marks that input as a gate. Sent to the running session |
| TQ237 | ACCOUNT FOR NOW | Layers are a later split of today's scalar condition: `layers: {body, function, fit, ...}` per item kind, with the Village using body, function and fit. IP3's scalar condition maps to body |
| TQ238 | ACCOUNT FOR NOW | Repairer profile `{reach: {layer: level}, perceives: [layers], school, notes}`; item layer `{condition, grade, author}`; couplings `{from, to, risk}` per world. Pure resolver with a committed draw (MR2), quote consumes nothing (MR4) |
| TQ239 | LATER | Layered repair phase after TQ199 typed damage: Village body/function/fit, then the Demon Slayer blade as the first world case (TQ217). Strong implementer, M to L. Done check: the same broken blade repaired by its own smith, a peer with notes, and an outsider gives three different bands; the outsider's repair looks fine in the UI until used against a demon; save, reload, Export, Import keep layers |
| TQ240 | LATER | A director inspector showing all layers, including unperceived ones, read-only, to verify "looks fixed but is not" |

Evidence: rounds 1–3 of this file, WE1–WE20 pack rows. Docs only; no build, test or browser run.
