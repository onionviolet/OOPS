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
| AX9 | **Repair** | Mundane smith on the housing, specialist on the function, original maker only (Demon Slayer), impossible (fragile relics) |

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
