# World core kit: what each world needs to play in depth (proposal, 2026-10-14)

Request (Weibao, 2026-10-14): "core stuff needed for each world to be
implemented in depth? do a 'more to consider? other stuff and more? save and
extend accordingly Send out codex as usesful?' for each aspect?"

This is a palette, not a spec. It names the parts every world needs before it
plays in depth, the floor for each part, and a "more to consider" round per
part. Pick what fits a world; a part can be thin where the source is thin.
Nothing here was built or run. Sealed secrets appear only by ID.

How it fits with what exists:

- [Completion standard](../WORLD_COMPLETION_STANDARD.md) S00-S14 says *what
  to account for*. This kit says *what a world must have in hand* to play.
  Each kit part maps to one or more S sections.
- [Full-world method](world-depth-2026-10-13/10_FULL_WORLD_METHOD.md) (census,
  tiers T0-T5, cards, lints) says *how to produce it*. The kit uses its tiers
  for floors.
- [Required features](world-depth-2026-10-13/07_REQUIRED_FEATURES_AND_ENGINE.md)
  RF/EI rows and [deeper synthesis](world-depth-2026-10-13/23_DEEPER_SYNTHESIS.md)
  UP primitives are the shared engine the kit leans on. The kit cites them
  instead of restating them.
- Canon event graphs are in flight in
  [canon-events-2026-10-14](../gm/dispatch/canon-events-2026-10-14/COMMON.md);
  K12 links there.

## Topic map (added round 15)

Rounds are appended, never rewritten. Jump by code:

| Round | Theme | Codes |
|---|---|---|
| 1 | Kit parts and per-part angles | K1-K18, KX1-KX10 |
| 2 | Lived layer and micro | K19-K24, KM, KX11-KX20 |
| 3 | Micro in motion | K25-K28, KV, KT, KK, KC, KG |
| 4 | Subtle relevant detail | K29-K32, KS, KQ, KP, KD, KR |
| 5 | Implementation implications | F1-F7, II, IS, IO, K33-K34 |
| 6 | Comics, lens cheats, overarching, abstractions | CW, CL, OV, AX1-AX19 |
| 7 | Comic media and cheats, merging | F8-F14, CW18-CW25, CL16-CL25, MG |
| 8 | Every little detail, repeating audit | F15-F31, ED, RA |
| 9 | More-to-consider school per part | MC1-MC34, OM, AN, KX63-KX70 |
| 10 | A lane per direction | CR1-CR3, DR1-DR8, MD1-MD12 |
| 11 | Specific worlds | CR4-CR6, SW1-SW8, WS1-WS9, MW1-MW7 |
| 12 | Canon calendars | CR7, CC1-CC16, KX76-KX81 |
| 13 | All returns folded | FX1-FX5, F32-F49 |
| 14 | Book versus code | CR8, SF1-SF10, KX82-KX86 |
| 15 | What's next | NX1-NX12, A1-A5 |

## The kit at a glance (K)

"Floor" is the least a world needs for a first playable slice that still feels
like that world. "Deep" is what a fully represented world has. Tiers are from
part 10 (T1 named texture, T2 one verb, T3 remembered, T4 connected loop, T5
full arc).

| Code | Part | Floor (first slice) | Deep | S | Shared seams |
|---|---|---|---|---|---|
| K1 | Source census and canon weight | Census of the slice's places, people, groups, abilities, items, events with locators; W0-W3 weights | Whole source census, volume by volume, with disagreements kept | S00 | FW1-FW3 |
| K2 | World laws | The 5-10 rules that make this world itself (what magic costs, what death means, what is illegal, what is impossible) written as engine facts | Full rulebook with exceptions, eras, edge cases and what the rules do to imports | S01 | RULES_FROM_SCRATCH, RF16 |
| K3 | Power core | One local energy or skill system as state: resource, how it grows, one learn path, 3-6 techniques, one visible rank or none | Every school, rank ladder, learning route, talent, side path and mastery form; synergy with other systems | S07 | ABILITY_AUTHORING, local ABILITY_VARIANTS |
| K4 | Starts and arrival | A starter trio: three bodies/roles/eras with real means, debts and knowledge | Start atlas by era, region, role and copy; mid-history starts with coherent prior state | S02 | RF5, EI4, part 11-12 |
| K5 | Places and travel | One hub with 4-8 places, one route out, one hazard; local time of day | Map by region with routes, travel cost, weather, changed places and secret places by ID | S03 | LC cards, RF2 |
| K6 | Cast | 6-12 people at T2+, 2-3 at T3 (schedule, need, memory of you), one T5 | Full cast with motives, means, beliefs, relationships among themselves, aging and death | S04 | PE cards, part 20, 29 |
| K7 | Institutions | One institution the player can join, owe or anger (school, clan, squad, guild, church) with standing that remembers | Every faction with ranks, duties, internal politics, rivals, law and how they read you | S04 | IN cards, RF12, part 21 |
| K8 | Daily life and economy | Local money, 2-3 jobs, food, a bed, a price list, a local calendar | Careers, housing, taxes, supply, seasons, festivals, households, prices that move | S05 | RF6, LIFE_SIM_NORTH_STAR |
| K9 | Items, materials and craft | Local materials and 3-5 signature items; one craft or brew that only this world has | Full material table, crafts, tools, custody, repair, local tech level and its limits | S06 | PROCEDURAL_CRAFTING, TECHNOLOGY |
| K10 | Danger and combat grammar | One threat roster (3-6 kinds) and the world's combat feel (duel, ambush, siege, curse, debate) with defeat and recovery | Full threat ecology, group fights, objectives, injury that lasts, nonviolent outs | S08 | native combat contracts |
| K11 | Knowledge and secrets | What the player knows at start (actor knowledge), one appraisal channel, one sealed secret by ID with a route | Full discovery tree, wrong readings, foreknowledge with confidence, notebook per copy | S09 | MEANS_AND_APPRAISAL, RF11 |
| K12 | Canon course and situations | 3-5 canon events on a clock that run without you, with abstention outcomes; one quest shape | Full event graph with motives, substitutes, branches and divergence | S10, S11 | canon-events lanes, EI10, TIMELINES |
| K13 | Signature verb loop | The one loop only this world has (MoL wards, JJK curtain, D&D rest, TTKS power bill) at T4 | Several signature loops that feed each other | S05, S07 | RF17 |
| K14 | Presentation | Per-world palette, log voice, one panel this world reveals | Full frame, ambient header, festival skins, reveal style per world | S13 | RF1-RF4, RF13, RF14 |
| K15 | Crossings and cheats | What carries in and out, what gets suppressed, how locals react to an outlier; which cheats fit | Per-edge carry tables, provenance, far-from-home wear, native cheat paths | S12 | RF9, RF16, part 13 |
| K16 | Endings and continuing life | One closure point and "life goes on after" | Ending types, canon frontier, aftermath, succession, long life in the world | S11 | part 22 parts 11-13 |
| K17 | AU and copy hooks | Divergence metadata so the world can be copied later (EI2) | Overlay AUs, parallel copies, counterpart map | S11, S12 | EI1-EI11, part 08 |
| K18 | Save and proof | Save domain or pack ID with a compatibility decision; one rebuilt desktop journey; save/reload/import | Computed coverage per family, journeys per loop type, director acceptance | S14 | FW9-FW10, PLAYTEST |

Rule of thumb: K2, K3, K6, K8 and K13 are what make a world feel like itself.
A world with those five at floor and the rest at T1 already plays as that world.

## More to consider, per part

Each part gets a round of angles beyond the floor. Codes extend the part's
letter (K3.1 and so on). Default + Dial where a dial fits.

### K1 Source census

- K1.1 **Edition and medium splits.** Manga versus anime versus light novel
  versus game often disagree (Fate routes, JJK anime-original fights, Bleach
  TYBW anime changes). Census rows carry a medium tag; the world picks a
  default edition per row and keeps the other reading as a dial.
- K1.2 **Fan canon versus text canon.** Fanon (popular but unstated facts)
  gets its own weight, below W1, so it can colour texture without becoming law.
- K1.3 **What the source never shows.** Census W0 rows for the boring
  necessities (sewage, tax collectors, the bakery) so the world is not a stage
  set. These are generated at T1.
- K1.4 **Census of verbs, not just nouns.** What do people in this world *do*
  every day? A verb census seeds K8 and K13.
- K1.5 **Census of costs.** Every power and institution's price, written
  down early, because costs are what make choices matter and are the first
  thing adaptations drop.

### K2 World laws

- K2.1 **Laws as facts the engine reads, not lore paragraphs.** "Cursed energy
  comes from negative emotion" becomes a rule that raises a resource under
  stress conditions.
- K2.2 **Hard laws versus soft laws.** Physics-like rules (Gamp's law) cannot
  be broken; social rules (Statute of Secrecy) can, at a cost. Mark each.
- K2.3 **Law exceptions as discoveries.** The known exceptions in the source
  become late-game unlocks or sealed secrets.
- K2.4 **What happens to imports.** Each law says how it treats a foreign
  power: suppress, convert, allow, or allow with attention (RF16).
- K2.5 **Laws that change with era.** A law can have a start and end date on
  the world clock (wand bans, clan wars ending, Ministry decrees).
- K2.6 **Laws the locals believe but are wrong.** A believed law that is
  false is a K11 discovery, not a K2 law.

### K3 Power core

- K3.1 **Resource, growth, expression, limit.** Every power core answers four
  questions: what you spend, how it grows, what it looks like when used, and
  what stops you. Missing any one makes it feel generic.
- K3.2 **Idle fit.** Which parts grow while you do something else (meditation,
  study, sleep, practice queues) and which need attention. Not every skill
  gets idle XP; each world says which.
- K3.3 **Learning routes.** Teacher, book, observation, trial and error,
  inheritance, contract, accident. Each world has two or three native ones.
- K3.4 **Rank as social fact.** Ranks matter because people react to them
  (sorcerer grades, Hogwarts years, D&D levels are invisible to locals but
  reputation is not). Decide if the rank is visible in the fiction.
- K3.5 **Personal technique.** Most deep systems end in a personal form
  (innate technique, bankai, Beyonder pathway, signature spell). The kit
  needs a generator or authored list for these.
- K3.6 **Wrong way to train.** Unsafe shortcuts with real costs (deviation,
  curse backlash, overuse injury). Strong but risky; a dial per world.
- K3.7 **Body and power together.** Power changes the body (Beyonder traits,
  Shadow Slave transformations, cursed body changes). Links to the genetics
  and nonhuman docs.
- K3.8 **Power in daily life.** Non-combat uses of the power (cooking with
  fire spells, chakra for farming). These are what make a world a life sim.

### K4 Starts and arrival

- K4.1 **Starter trio shape.** One safe ordinary life, one near the story,
  one strange. Proven in part 12 for eight worlds; every world gets one.
- K4.2 **Knowledge envelope per start.** What this body knows, what the
  player-as-reader knows, and what the player is told. Three separate fields.
- K4.3 **Arrival texture.** First hour script: the first meal, first person,
  first problem. Cheap and memorable.
- K4.4 **Start debt and duty.** Every start owes something (school fees,
  clan duty, rent, a contract). Gives the first goal without a quest marker.
- K4.5 **Starts that unlock by play.** Some starts open only after another
  life in the world touched them (part 13 earned options).

### K5 Places and travel

- K5.1 **Place grammar.** Each world has a typical place shape (castle
  classroom, D&D tavern, Tingen boarding house, Shadow Slave ruin). Template
  it once, instance many times.
- K5.2 **Places that change.** A place has states over the world clock
  (Hogwarts at term versus summer, a district after a canon event).
- K5.3 **Travel as cost and story.** Floo, portkey, horse, train, Dream
  Realm gates. Travel time, cost and risk differ per world.
- K5.4 **Off-screen places.** Where the cast goes when not on screen, so
  schedules have somewhere to point.
- K5.5 **Access rules.** Who may enter (wards, clan land, restricted
  section). Access is a real lock, not a label.

### K6 Cast

- K6.1 **The cast lives without you.** Schedules, yearly aging (npc_lives),
  canon arcs that progress even if you abstain.
- K6.2 **Relationships among the cast.** A web, not spokes to the player.
  Who likes, owes, fears whom.
- K6.3 **What they know about you.** Witnessed memory with "who told me"
  (B1). Cast members act only on what they could know.
- K6.4 **Voice cards.** Two or three lines of speech pattern per T3+
  character, paraphrased, no raw prose.
- K6.5 **Minor-character pool.** Generated locals with local names, jobs and
  one quirk, so the hub is never empty.
- K6.6 **Cast at different eras.** A person's card has age-dependent states
  (young Snape, old Snape).

### K7 Institutions

- K7.1 **Standing per institution, with memory.** RF12. House points, clan
  favour, squad record, church regard.
- K7.2 **Ranks and duties.** Joining gives duties on the clock and benefits.
- K7.3 **Internal factions.** Institutions are not monoliths.
- K7.4 **Law and enforcement.** Who arrests you, for what, and what happens
  after.
- K7.5 **Institution as teacher and gate.** Most power routes pass through
  an institution (school, temple, clan).

### K8 Daily life and economy

- K8.1 **Local money and price anchors.** Bread, a room, a lesson, a weapon.
  Four prices make an economy legible.
- K8.2 **Local calendar.** Day length, weekday names, terms, festivals (RF6).
- K8.3 **Jobs that fit the world.** Not generic "work": pharmacy assistant in
  Tingen, potion brewing, mission board, hauling.
- K8.4 **Food and rest in local form.** What people eat and where they sleep.
  Follows the food direction (benefits, no hunger death).
- K8.5 **Household.** Who you live with. Links part 31.
- K8.6 **Idle routines.** A queued day plan that runs while the player is
  away, in local terms.

### K9 Items, materials and craft

- K9.1 **Signature material.** Each world has one material that defines its
  craft (cursed objects, Beyonder characteristics, Memory Shards, potion
  ingredients).
- K9.2 **Provenance.** Items remember where they came from; matters for
  crossings and custody.
- K9.3 **Local tech ceiling.** What can and cannot be built here.
- K9.4 **Wear and repair.** Things break; repair is work.
- K9.5 **Gifts and heirlooms.** Items that carry relationships.

### K10 Danger and combat grammar

- K10.1 **Combat feel per world.** Duel (Fate), ambush and investigation
  (LOTM), party tactics (D&D), domain clash (JJK), survival (Shadow Slave).
  The same engine with a different grammar per world.
- K10.2 **Threat ecology.** Where threats come from and why (curses from
  emotion, Nightmare Spell, mystic corruption).
- K10.3 **Defeat that is not game over.** Capture, injury, debt, rescue,
  retreat. Defaults per world.
- K10.4 **Nonviolent outs.** Talk, flee, bribe, hide, trade.
- K10.5 **Danger level by place and era.** So a safe start stays safe-ish
  until the canon clock darkens it.

### K11 Knowledge and secrets

- K11.1 **Three knowers.** The character, the player, the world. Keep apart.
- K11.2 **Appraisal in local form.** Six Eyes, Spirit Vision, Detect Magic,
  a guild appraiser.
- K11.3 **Foreknowledge with confidence.** Reader knowledge loses confidence
  as the timeline diverges (RF11).
- K11.4 **Sealed secrets by ID.** Each world gets at least one S-ID with a
  discovery route in its own sealed file.
- K11.5 **Wrong readings.** Plausible misreadings the player can act on.

### K12 Canon course and situations

- K12.1 **Canon clock.** Public events per world on a schedule, with what
  happens if you are not there.
- K12.2 **Motives and substitutes.** If a canon actor is gone, who does it
  instead (intro doc rounds 13-15).
- K12.3 **Player-sized situations.** Small local events that fit an ordinary
  start, not just the plot.
- K12.4 **Quest generator in local terms.** Mission board, house points
  task, Beyonder case, contract.
- K12.5 **Divergence visible.** The player can see that the world changed
  because of them.

### K13 Signature verb loop

- K13.1 **One loop only this world has.** RF17 names 14 hosts, not the current 14 priority worlds (F9). Every
  new world names its own before anything else.
- K13.2 **Loop ladder.** The loop has early, mid and late forms.
- K13.3 **Loop joins.** The signature loop feeds K3 power, K8 economy and K6
  relationships.

### K14 Presentation

- K14.1 **Palette and log voice per world.** RF1, RF14.
- K14.2 **A panel only this world reveals.** RF13.
- K14.3 **Local terms in UI.** "Galleons", "cursed energy", "Sequence 9".
- K14.4 **No spoilers in UI.** Sealed names never in pickers (RF19).

### K15 Crossings and cheats

- K15.1 **Carry table per edge.** What enters, what converts, what stays
  dormant.
- K15.2 **Outlier reaction.** How locals respond to a strong foreigner.
- K15.3 **Native cheat path.** A cheat that fits the world's lore (part 13).
- K15.4 **Leaving and returning.** What the world does while you are gone
  (RF7).

### K16 Endings and continuing life

- K16.1 **Closure types.** Canon ending reached, personal goal, retirement,
  death, departure.
- K16.2 **After the canon frontier.** What happens past the last book.
- K16.3 **Succession.** Heirs and leftovers (RF8).

### K17 AU and copy hooks

- K17.1 **Divergence point metadata from day one** (EI2), so later AUs are
  cheap overlays.
- K17.2 **Relationship and start-point AUs** reuse cast and starts (part 08).

### K18 Save and proof

- K18.1 **Pack ID or save domain decided first,** with a compatibility note.
- K18.2 **Coverage printed, not kept** (FW10).
- K18.3 **One desktop journey per loop type,** at 1366x768 and wider.

## Other stuff and more (KX)

Parts that cut across the kit and are easy to forget.

| Code | Consideration |
|---|---|
| KX1 | **World identity sentence.** One line that says what living here feels like. Every kit part is checked against it. |
| KX2 | **Tone dial.** Cozy, grim, comic, horror. Same rules, different weight on danger and loss. |
| KX3 | **Scale ladder.** Personal, local, national, cosmic. Which scales the world supports at floor. |
| KX4 | **Pacing per world.** How fast the canon clock runs against idle time. |
| KX5 | **Content warnings and dials.** Per world, for gore, body horror, death of children. |
| KX6 | **Original-world kit.** Original worlds use the same kit with K1 replaced by a design census. |
| KX7 | **Kit reuse across similar worlds.** Academy worlds share K7/K8 shapes; cultivation worlds share K3 shapes (cluster defaults in part 05). |
| KX8 | **Readiness score per world.** Floor met / deep met per K, computed from docs and code, not hand-kept. |
| KX9 | **Kit for derived worlds.** Paradise missions and generated worlds use a reduced kit (K2, K3, K5, K10, K12 floors only). |
| KX10 | **Player's own mark.** Something in each world the player can build or change that stays (a shop, a ward, a student). |

## Suggestions (ranked)

1. Write a one-page kit card per priority world (K1-K18, floor met or not,
   with file pointers). Lane W1 does this.
2. Name the signature verb loop (K13) and power core (K3) floor for every
   priority world first; they decide whether a world feels like itself.
3. Make the kit card the input to part 10's census and cards, so the kit is
   a checklist over existing production, not a new process.

## Codex lanes (2026-10-14)

Dispatch folder: [world-core-kit-2026-10-14](../gm/dispatch/world-core-kit-2026-10-14/COMMON.md).
Docs only. Each lane extends one group of kit parts with sources and code
seams, and writes its own file.

| Lane | Parts | Writes |
|---|---|---|
| W1 | Readiness matrix for priority worlds (all K) | `docs/worlds/world-core-kit-2026-10-14/W1_READINESS.md` |
| W2 | K2 laws, K3 power core, K10 combat grammar per priority world | `.../W2_LAWS_POWER_COMBAT.md` |
| W3 | K6 cast, K7 institutions, K8 daily life per priority world | `.../W3_PEOPLE_INSTITUTIONS_LIFE.md` |
| W4 | K5 places, K9 materials and craft, K13 signature loop, K14 presentation | `.../W4_PLACES_CRAFT_LOOP_LOOK.md` |
| W5 | K11 knowledge, K12 canon course, K15 crossings, K16 endings | `.../W5_KNOWLEDGE_CANON_CROSSING_END.md` |
| W6 | Shared engine and data for the kit, kit template, K17-K18 | `.../W6_ENGINE_TEMPLATE.md`, `docs/worlds/templates/WORLD_CORE_KIT_TEMPLATE.md` |

## Round 2: more to consider, other stuff, subtle micro (2026-10-14)

Request: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle micro stuff too?"

### New kit parts (K19-K24)

Round 1 missed parts that a world still needs to feel lived in.

| Code | Part | Floor | Deep |
|---|---|---|---|
| K19 | Senses and atmosphere | One smell, one sound, one texture per hub place, used in look text and log flavour | Sensory layer by place, time, weather and body (nonhuman senses doc) |
| K20 | Language and naming | Local name pool, forms of address, two or three local idioms or swears (paraphrased) | Dialects by region and class, misheard names, titles in speech, foreign-accent reactions |
| K21 | Belief and ritual | What locals believe about death, luck and power; one daily ritual | Religions, superstitions, festivals of belief, taboo breaking and its social cost |
| K22 | Bodies and health | How people get sick, heal and age here; one local medicine | Injury that lingers, power-linked illness, healers by tier, disability and support |
| K23 | Information flow | How news travels (owl, gossip, newspaper, crow, phone) and how fast | Media, propaganda, rumour decay, secrets leaking along carriers |
| K24 | Law of the small | What petty crime, debts, and rudeness cost here | Courts, fines, social exile, local customs for apology and repair |

### More angles on round 1 parts

- K2.7 **Laws felt in small moments.** A law should show in a chore, not only
  a crisis: Gamp's law means you still cook by hand; cursed energy means a bad
  mood near school leaves residue in the hallway.
- K3.9 **Power fatigue and moods.** Use on a bad day feels different. Small
  modifier from K22 health and inner-life spirits.
- K3.10 **Power etiquette.** When is it rude to use power (reading minds at
  dinner, flaring reiatsu indoors, casting in a Muggle street)?
- K3.11 **Small failures with flavour.** A misfired spell has a funny or
  telling result, not just "failed". Feeds jokes-as-hints (part 15).
- K4.6 **Pocket contents at start.** Three small items in the pocket tell the
  start's story (a pawn ticket, a letter, a broken charm).
- K5.6 **Places with habits.** The tavern is loud on payday, the library is
  empty at exam end. A place has a weekly rhythm, not just states.
- K5.7 **Wear marks.** Paths worn by the player's routine, a favourite seat,
  a door that now opens for you. The world records your habits.
- K6.7 **Small tells.** Each T3 character has one habit the player can learn
  to read (taps when lying, hums when happy). Ties to K11 appraisal.
- K6.8 **Grudges and favours that age.** Small debts fade or harden over
  time. A forgotten birthday stings for a season.
- K7.6 **Paperwork.** Forms, permits, licences, school reports. Paperwork is
  a cheap, very world-specific texture and a real gate.
- K8.7 **Price quirks.** Haggling custom, tipping, discounts for regulars,
  "the usual". Regulars get remembered.
- K8.8 **Chores and maintenance.** Laundry, wand polishing, weapon oiling,
  feeding the familiar. Idle-friendly, small, local.
- K9.6 **Brand and maker marks.** Ollivander wand, Dwarven steel, a known
  Beyonder potion maker. Items carry reputation.
- K9.7 **Second-hand goods.** Used items with traces of former owners.
- K10.6 **Aftermath micro.** Torn clothes, bruises that show, a witness who
  now avoids you, a rumour of the fight next morning.
- K11.6 **Knowing by repetition.** Seeing the same thing many times teaches
  you (watch log, part 14). Small, steady, idle-friendly.
- K12.6 **Background events.** A neighbour's wedding, a shop closing, a new
  student. Small events that do not involve the player but make time pass.
- K13.4 **Loop texture over time.** The signature loop gets small new
  wrinkles as you master it (new tool, new shortcut, a regular customer).
- K14.5 **Micro feedback.** A tiny glyph or colour flick for local events
  (owl post arriving, a Beyonder hunch, a cursed chill).
- K15.5 **Small culture shock.** An outsider gets small things wrong (coins,
  greetings, food) and locals notice.
- K16.4 **Small endings.** A friend moves away, a shop you loved closes, a
  teacher retires. Not every ending is the canon ending.

### Subtle micro stuff (KM)

Micro details are the cheapest depth: T1-T2 rows that cost one line each but
make a world feel real. The kit treats them as a family of their own so they
are not lost between bigger parts.

| Code | Micro family | What it is | Example shape (MEMORY, check before use) |
|---|---|---|---|
| KM1 | Greetings and farewells | How people say hi and bye, by class and closeness | Sorcerers versus civilians; D&D tavern toasts |
| KM2 | Meals and snacks | What is eaten when, comfort food, regional dish | Sweets on a train; Tingen bread and stew |
| KM3 | Weather talk | Small talk locals use, weather sayings | |
| KM4 | Money handling | Coins, notes, purses, change, counting habits | Galleon, Sickle, Knut odd ratios |
| KM5 | Clothing cues | What clothes say about rank, school, faction | House scarves, uniforms, Beyonder gloves |
| KM6 | Transit habits | Queues, tickets, who sits where | |
| KM7 | Household objects | The things every home has | Moving portraits, ward stones |
| KM8 | Children's games and songs | Local games, rhymes (paraphrased, no lyrics) | |
| KM9 | Idioms and swears | Two or three per world, paraphrased | |
| KM10 | Superstitions | Small beliefs and charms | |
| KM11 | Smells and sounds | Per place and time | |
| KM12 | Gestures | Bows, salutes, hand signs, rude gestures | Hand seals as habit, not only technique |
| KM13 | Pets and small animals | What strays and pets roam the hub | Owls, cats, crows, ravens |
| KM14 | Shop signs and posters | Wanted notices, ads, recruitment posters | |
| KM15 | Time words | Local names for days, hours, seasons | |
| KM16 | Small rules of school or work | Curfew, bells, roll call, uniforms | |
| KM17 | Graffiti and marks | What people scratch on walls; secret signs | |
| KM18 | Little kindnesses | How locals help strangers; what is expected back | |

How micro rows work in the kit:

- KM-a **Generated plus authored.** A per-world micro table seeds generated
  look text, log flavour, NPC idle lines and rumours. Authored rows win.
- KM-b **Never a quest.** Micro rows are texture first. A few are promoted
  to hints (part 15) or tells (K6.7).
- KM-c **Repetition guard.** Rotate micro lines so the same one does not
  show twice in a short window; a "seen" count per line.
- KM-d **Noticing grows.** More micro detail shows as the character learns
  the place (local knowledge level): newcomer sees less, regular sees more.
- KM-e **Micro across worlds.** Crossing worlds carries habits: a character
  bows in a world where no one bows. Ties to K15.5.
- KM-f **Micro in idle reports.** The away report includes one small detail
  ("the baker asked after you"). Cheap warmth.
- KM-g **Micro by era.** The same place has different small details in
  different years (prices, songs, fashions).
- KM-h **Micro as save-free.** Most micro is derived from seeds and world
  clock, so it needs no save field. Only promoted rows persist.

### Other stuff and more (KX11-KX20)

| Code | Consideration |
|---|---|
| KX11 | **Kit depth by player attention.** Parts the player keeps touching grow (DT6 promotion) and parts never touched stay floor. |
| KX12 | **Kit for one district versus a whole world.** A district kit is enough to play; the world kit is the sum. |
| KX13 | **Mixed-world mashups.** Two kits merged (D&D party in Hogwarts) need a law-conflict table. |
| KX14 | **Kit decay check.** When canon or code changes, which kit parts go stale. |
| KX15 | **Player-chosen depth.** A setting that says which worlds the player wants deep first. |
| KX16 | **Kit cost estimate.** Rough effort per part per world so build order is honest. |
| KX17 | **Kit for an AU.** An AU inherits the base kit and lists only changed parts. |
| KX18 | **Kit-driven tutorials.** First hour of a world teaches K2, K3, K8, K13 in play, not in text. |
| KX19 | **Accessibility per world.** Colour, text size and motion for each world's look. |
| KX20 | **Kit as agent brief.** A world GM gets the kit card plus floor gaps as the whole brief. |

### Suggestions (round 2, ranked)

1. Add a micro table (KM1-KM18) to each priority world's kit card; it is the
   cheapest depth and needs no save change.
2. Use KM-d "noticing grows" as the first micro mechanic: it ties micro rows
   to play without new systems.
3. Fold K19-K24 into the template W6 writes, after W6 returns.

### Codex lanes, round 2

| Lane | Parts | Writes |
|---|---|---|
| W7 | KM micro tables per priority world, source-checked | `docs/worlds/world-core-kit-2026-10-14/W7_MICRO_BY_WORLD.md` |
| W8 | K19-K24 per priority world (senses, language, belief, health, news, small law) | `.../W8_LIVED_LAYER.md` |
| W9 | Micro engine: how micro rows are generated, rotated, gated by noticing and shown, with `src/` seams; kit stress test by walking one first day per world through K1-K24 | `.../W9_MICRO_ENGINE_AND_FIRST_DAY.md` |

## Round 3: micro in motion, and the parts between parts (2026-10-14)

Request: the same prompt again ("more to consider? other stuff and more? save
and extend accordingly Send out codex as usesful? Subtle micro stuff too?").
Round 2 listed micro *things*. Round 3 is micro *happening*: small verbs,
moments, marks and callbacks, plus guards so micro stays pleasant.

### New kit parts (K25-K28)

| Code | Part | Floor | Deep |
|---|---|---|---|
| K25 | Personal space | One room or corner that is yours, shows what you own and do | Home that fills with keepsakes, clutter, trophies and visitors' traces; others read it |
| K26 | Routine and habit | The day plan leaves habits (links [habits](ABILITY_AUTHORING.md#ab1-expanded-habits-proposal-2026-10-13)) | Habits locals notice, habits that clash across worlds, breaking a habit as a story beat |
| K27 | Lightness and comedy | One running gag per hub | World-specific humour register, comic failures, banter between cast, jokes that land later (part 15) |
| K28 | Seasons and weather per world | Local weather with one seasonal change | Climate by region, weather that shifts work, food, mood and danger; power-linked weather |

### Micro verbs (KV)

Tiny actions with tiny, real effects. Each takes seconds of game time, needs
no quest, and mostly feeds spirits, noticing (KM-d) or relationships.

| Code | Verb | Small effect | Example fit (MEMORY) |
|---|---|---|---|
| KV1 | People-watch | Raises local noticing; surfaces a tell (K6.7) | Café in Backlund; Great Hall breakfast |
| KV2 | Eavesdrop | Rumour fragment with "who told me"; risk of being noticed | Tavern in Phandalin |
| KV3 | Tidy or fidget | Small spirits gain; habit seed | Folding robes; sharpening a blade |
| KV4 | Pet an animal | Spirits; the animal starts to recognise you | School cats, Tingen strays |
| KV5 | Sit somewhere | Becomes "your seat" after repetition (K5.7) | Library window seat |
| KV6 | Hum or whistle | NPC reaction by local etiquette (K3.10) | |
| KV7 | Doodle or journal | Notebook entry; can later be found by others | Margin notes in MoL |
| KV8 | Look out a window | Weather and street micro; idle-friendly | |
| KV9 | Share food | Small regard gain; local custom on refusal | Sweets on the train |
| KV10 | Nod or greet | Recognition ladder: stranger, familiar face, nodding terms, by name | |
| KV11 | Give way or hold a door | Tiny reputation; some cultures read it as weakness | |
| KV12 | Practise idly | Very slow skill XP during idle (food direction pattern) | Hand seals while waiting |

Rule: micro verbs never gate main progress and never punish skipping. They
are a way to *be* in a world, and most can be queued or happen on their own
as habits (K26).

### Micro moments (KT)

Small timed beats on the world clock that make time felt.

- KT1 **Thresholds of the day.** Dawn birds, shift change, lamp lighting,
  last orders, curfew bell. One per hub per phase of day.
- KT2 **Weekly beats.** Market day, payday, rest day, newspaper day.
- KT3 **Seasonal swaps.** Decorations, menus, clothing, sports seasons.
- KT4 **After-event residue.** Posters replaced, a boarded window, a new
  memorial, people talking about it for a week, then less.
- KT5 **Personal anniversaries.** The day you arrived, a friend's birthday,
  a death day. The cast remembers some.
- KT6 **Quiet beats.** Rare "nothing happens" lines that set mood. Cheap,
  and they make the loud moments land.

### Micro marks (KK)

The world and your body keep small traces.

- KK1 **Body marks.** Calluses from practice, a tan, scars, hoarse voice
  after shouting, ink-stained fingers. Shown on the bio card in words.
- KK2 **Object marks.** Stains, scratches, initials, a bent page, smell of
  smoke. Items age with use (K9.4, K9.7).
- KK3 **Place marks.** Worn path, a repaired fence you fixed, your name in
  the guest book, a chalk mark only friends understand.
- KK4 **Social marks.** Nicknames given to you, inside jokes, "the usual"
  order, a saved seat. Each one is a small relationship record.
- KK5 **Power marks.** Residue, a signature colour or scent, a candle that
  flickers when you pass. Can tip off observers (K11).

### Micro callbacks (KC)

Small things that come back later, which is where micro turns into story.

- KC1 **Remembered small acts.** The stranger you gave bread is the guard
  who waves you through a year later.
- KC2 **Running gags.** A gag that escalates over months (K27).
- KC3 **Unfinished stories.** Overheard fragments that complete if you keep
  listening in the same place.
- KC4 **Echoes across lives.** An heir finds the parent's initials on a desk
  or hears the parent's nickname (part 17, part 23 AR7).
- KC5 **Echoes across worlds.** A habit from one world shows in another
  (KM-e); someone asks where you learned it.

### Micro guards (KG)

Micro is pleasant only when it stays light.

- KG1 **Density dial.** Player setting for how much micro shows; default
  modest. Ties to B15 assist settings.
- KG2 **Budget per window.** At most a few micro lines per minute of play;
  important log lines always win.
- KG3 **No loss for missing micro.** Missing a micro beat costs nothing; the
  rare promoted one repeats or has another route.
- KG4 **Seal lint for micro.** Micro lines pass the sealed-name lint so
  texture never leaks a secret's truth.
- KG5 **Consistency check.** Micro must match K2 laws, era and place (no
  phones in 1991 Hogwarts, no Galleons in Tingen).
- KG6 **Fresh, not random.** Prefer rotation and context over pure random:
  the same café, rain, Tuesday gives the same kind of line.
- KG7 **Player-made micro.** Naming the cat, writing on the wall, picking a
  seat. The player adds micro and the world keeps it (K25).

### Other stuff and more (KX21-KX28)

| Code | Consideration |
|---|---|
| KX21 | **Kit parts that talk to each other.** A short join table per world (K22 health × K8 work, K23 news × K7 standing, K21 belief × K10 danger). |
| KX22 | **Emotional range per world.** Which feelings a world should reliably produce (wonder, dread, cosiness, pride) and which parts deliver them. |
| KX23 | **Downtime quality.** A world with nothing to do between big beats is shallow; downtime verbs per world. |
| KX24 | **Social scale of micro.** Personal, household, street, town: each has its own micro family. |
| KX25 | **Micro in other bodies.** Nonhuman starts get species micro (grooming, scent marks, nest habits); links nonhuman docs. |
| KX26 | **Micro for companions.** Familiars and pets have their own small habits (companions doc). |
| KX27 | **Reference games for micro.** Games known for small-detail depth show working mechanisms; lane W10 checks them. |
| KX28 | **Micro first-pass budget.** Floor per world: 30-60 micro rows across KM, KV, KT, KK is enough to feel lived in. |

### Suggestions (round 3, ranked)

1. KV10 recognition ladder plus KK4 social marks as the first micro slice:
   it reuses existing regard and witnessed memory and is visible every day.
2. KT1 thresholds of the day for the home Village, derived from the existing
   calendar, no save change.
3. KG1 density dial and KG4 seal lint before any big micro content wave.

### Codex lanes, round 3

| Lane | Parts | Writes |
|---|---|---|
| W10 | Reference games and books known for micro depth: mechanisms worth adopting, web-checked | `docs/worlds/world-core-kit-2026-10-14/W10_MICRO_REFERENCES.md` |
| W11 | Micro verbs, moments, marks and callbacks (KV, KT, KK, KC) per priority world, with save impact and `src/` seams | `.../W11_MICRO_MOTION_BY_WORLD.md` |

## Round 4: subtle relevant stuff (2026-10-14)

Request: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle relevant stuff too?"

Rounds 2-3 made worlds feel lived in. Round 4 makes the small things
*matter*: details that tell you something, change what you choose, or show
that what you did rippled. Texture for its own sake stays in KM/KV/KT; this
round is for subtlety with a payoff.

Lane W6 returned its engine draft
([W6](world-core-kit-2026-10-14/W6_ENGINE_TEMPLATE.md)): no new engine
families needed, existing RF/EI/UP/FW codes cover the kit; gaps are author
compilers and a few consumers (era on starts, law predicates, LC routes).

### New kit parts (K29-K32)

| Code | Part | Floor | Deep |
|---|---|---|---|
| K29 | Ripples | Two player acts per hub that visibly change something small later | Second- and third-order effects through prices, gossip, rivals and institutions |
| K30 | Perception profile | What you notice depends on one thing about you (job, power, species) | Every skill, power, mood and body colours what details show |
| K31 | Subtext and status | One cast member says less than they mean, and the player can learn to read it | Politeness levels, status cues, power dynamics, what is not said |
| K32 | Tension rhythm | Calm and storm alternate on the canon clock | Pacing per world, quiet before a canon event, relief after |

### Signals: small signs before big things (KS)

Subtle signs that reward attention. Each signal points to something real; a
signal that points nowhere is a red herring and is labelled as one for
authors (part 15 honest red herrings).

- KS1 **Market signals.** Prices of one good creep up days before a
  shortage, raid or festival. A merchant hoards.
- KS2 **People signals.** A cast member gets jumpy, skips a routine, starts
  carrying something new, or stops greeting you.
- KS3 **Place signals.** Guards doubled, a shop shuttered early, birds quiet,
  a smell that does not belong.
- KS4 **Power signals.** Residue in the wrong place, a ward humming, curse
  weather, a spiritual pressure spike.
- KS5 **Institution signals.** New rules posted, a meeting behind closed
  doors, a sudden inspection.
- KS6 **Signal strength by noticing.** Weak signals show only to someone
  with the right perception (K30) or local knowledge (KM-d).
- KS7 **Signal lead time per world.** Default a few days on the world clock;
  a dial per world (horror worlds give less warning).
- KS8 **Acting on a signal.** Stocking up, warning a friend, leaving town
  or preparing early is always possible and rewarded proportionately, never
  required.
- KS9 **Sealed safety.** Signals hint at sealed truths only through their
  discovery route; the signal text passes KG4 seal lint.

### Ripples: small causes, later effects (KQ)

- KQ1 **Price ripples.** Buying out a stall raises its price and annoys the
  next buyer; selling a glut lowers it.
- KQ2 **Social ripples.** Helping one person changes how their friends and
  rivals see you (K6.2 web).
- KQ3 **Reputation ripples.** A kind act in private reaches the town by
  gossip carrier days later, softened or twisted (K23).
- KQ4 **Institution ripples.** Breaking a small rule leads to a new rule
  everyone grumbles about.
- KQ5 **Ripple receipt.** Each ripple can answer "why did this happen?" in
  plain words, linking back to the cause (UP primitive for attributed
  causes).
- KQ6 **Ripple fade.** Most small ripples fade on a schedule; some harden
  into memory (K6.8).
- KQ7 **Absence ripples.** What not acting caused: the friend you did not
  warn, the shop that closed because no one bought (abstention outcomes).

### Perception: who notices what (KP)

- KP1 **Trade eyes.** A smith sees blade quality, a cook smells spoiled
  stock, a healer notices a limp.
- KP2 **Power eyes.** Each world's sense (Spirit Vision, cursed energy
  sight, Detect Magic, Six Eyes) adds a detail layer.
- KP3 **Mood colours.** Tired or sad characters notice threats more and
  beauty less; content ones the reverse. Small and gentle.
- KP4 **Body senses.** Nonhuman bodies notice scent, sound and heat cues
  (nonhuman senses doc).
- KP5 **Culture eyes.** Locals see what outsiders miss and the reverse; an
  outsider spots oddities locals take for granted (K15.5).
- KP6 **Relevance filter.** Shown details favour what touches the player:
  known people, owned things, active goals, current skills, recent events.
  Unrelated micro fills gaps.
- KP7 **Perception receipts.** "You noticed because you are a cook." Shows
  the player why their build matters.

### Subtext: what is not said (KD)

- KD1 **Politeness ladders.** Forms of address shift with closeness and
  rank; a sudden formal word means something (K20).
- KD2 **Evasions.** A character changes the subject on one topic; the
  topic list is a K11 clue.
- KD3 **Status cues.** Who sits first, who pays, who waits. Players can
  read and later use them.
- KD4 **Gifts as messages.** Gift choice says something by local custom.
- KD5 **Silence.** Not answering a letter, not attending a funeral. Absence
  as a message both ways.
- KD6 **Subtext reading as skill.** Reading subtext grows with practice and
  relationship depth; early on, the player gets literal lines.

### Relevant detail rules (KR)

- KR1 **Every micro line can be promoted.** Any texture row may later become
  a signal, clue or callback when content needs it; tag it so.
- KR2 **Relevance score.** Shown details are picked by a small score: touches
  player + matches perception + fits time and place + not recently shown.
- KR3 **Two readings.** Good subtle details read as texture the first time
  and as a clue in hindsight.
- KR4 **No hidden must-haves.** Subtle details never hide the only route to
  essential progress (KG3).
- KR5 **Hindsight journal.** The notebook can later link a past detail to
  what it meant ("the price rise before the raid").

### Other stuff and more (KX29-KX36)

| Code | Consideration |
|---|---|
| KX29 | **Return summary per world.** Coming back after time away shows what changed, ranked by relevance (KR2), in local voice. |
| KX30 | **Cross-world relevance.** A skill from world A makes a detail in world B visible (a potion-maker notices LOTM ingredients). |
| KX31 | **Subtle difficulty.** Attention, not reflexes, is the skill: noticing and preparing give advantage in an idle game. |
| KX32 | **Micro test harness.** Snapshot tests of generated micro per world, seed and day; seal lint and consistency checks run in the same pass. |
| KX33 | **Author preview.** A dev view that shows a day of micro for a world, seed and perception, so authors tune density. |
| KX34 | **Micro save budget.** Derived by default; promoted rows only, with a size cap per world. |
| KX35 | **Tension-aware micro.** Before a canon event, micro tilts toward signals; after, toward relief and residue (K32). |
| KX36 | **Player taste memory.** Micro the player clicks or lingers on gets slightly more weight (part 22 taste learning), with a reset. |

### Suggestions (round 4, ranked)

1. KS1 market signals plus KQ1 price ripples in the home Village: the stock
   and price systems exist, so this is a small, very visible proof that
   attention pays.
2. KP1 trade eyes plus KP7 perception receipts: one line that ties the
   player's job to what they see.
3. KQ5 ripple receipts as a shared rule before any big ripple content.

### Codex lanes, round 4

| Lane | Parts | Writes |
|---|---|---|
| W12 | Signals and ripples per priority world (KS, KQ, K29, K32), including how each source foreshadows | `docs/worlds/world-core-kit-2026-10-14/W12_SIGNALS_RIPPLES.md` |
| W13 | Perception, relevance and subtext engine (KP, KR, KD, K30, K31) with `src/` seams and save impact | `.../W13_PERCEPTION_RELEVANCE_SUBTEXT.md` |

## Round 5: implementation implications (2026-10-14)

Request: "more to consider? other stuff and more? save and extend accordingly
Send out codex as usesful? Subtle stuff too? Implementation implciations and
more?"

### What the lanes found so far (F)

Drafts in progress; readiness covers 7 of 14 worlds so far.

| Code | Finding | Source |
|---|---|---|
| F1 | **K3 power core is the top gap in 6 of 7 carded worlds** (HP, D&D, TTKS, LOTM, CoI, Shadow Slave). Docs describe the powers; nothing executable holds 3-6 techniques with a growth route. | [W1](world-core-kit-2026-10-14/W1_READINESS.md) gaps G1 |
| F2 | **K6 cast depth is second almost everywhere.** Most worlds have 0-3 people at T2+, below the 6-12 floor, and none with scheduled T3. | W1 G2 |
| F3 | **Mother of Learning is the most ready world.** K9 and K16 floor met in docs and runtime; its gaps are a canon clock (K12), the ward loop (K13) and a native save journey (K18). | W1 MoL card |
| F4 | **No new engine families are needed.** Existing RF/EI/UP/FW cover the kit; gaps are author compilers and a few consumers. Default to generic commands; a world host only for a named rule packs cannot express. | [W6](world-core-kit-2026-10-14/W6_ENGINE_TEMPLATE.md) F1, D2, F3 |
| F5 | **The power core gap is fragmentation, not absence.** The [core foundations scorecard](../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md) finds about six overlapping capability systems (skills, capabilities, techniques, power models, faculties, energies). A seventh per-world system would make it worse. | scorecard U07 |
| F6 | **Micro has real read-only seams** (log, look text, weather, calendar, known people) but **flavour must not advance gameplay RNG**: the expansion RNG is mutable and saved, so micro needs its own stable seed. 63 `Math.random` calls remain in core loops. | [W9](world-core-kit-2026-10-14/W9_MICRO_ENGINE_AND_FIRST_DAY.md) ME9; scorecard U04 |
| F7 | **First-day walks found eight operational gaps** (PG1-PG8): micro seed pinned to content revision, seen counts versus save-free, proof for off-screen claims, exposure rules for noticing, several clocks at once, when a tiny act becomes a debt, crowd privacy for overheard text, one shared budget across micro surfaces. | W9 PG1-PG8 |

### Implementation implications (II)

Grouped by layer. Each row: what it implies, then the default.

**Data and authoring**

- II1 **Kit card is a manifest, not a save field.** It lives author-side
  next to the census; coverage is computed from it plus compiled packs (FW10).
  Nothing in the game reads the kit card.
- II2 **One compiler, many families.** Cards for K5 places, K6 people, K9
  items, KM micro and KS signals compile to existing structured pack rows.
  The compiler is the multiplier for every world (part 23 A3).
- II3 **Micro tables are pack data.** KM/KV/KT rows ship in the world's pack
  with stable IDs, tags, era and noticing level; the runtime only picks.
- II4 **Laws as predicates.** K2 laws compile to boundary rules and effect
  predicates where a consumer exists; a law with no consumer is a lint
  error, not silent prose (W6 K2).

**Runtime**

- II5 **One power core schema, on one capability system.** K3 for every
  world is data on a single shared model: resource, growth, expression,
  limit (K3.1), plus techniques and learn routes. It must land on whichever
  capability system the core consolidation picks (scorecard A1), not beside
  them. This is the highest-leverage runtime change in the kit.
- II6 **Cast schedules by level of detail.** T3 people run schedules; T2
  people resolve only when observed; off-screen people sample at day
  boundaries. Keeps cost flat as casts grow.
- II7 **Clock adapter.** Each world, school or branch declares a local clock
  (rate, epoch, owner, reset rule) mapped from instance time (W9 PG5, RF6).
- II8 **Micro resolver is pure.** `pick(world, place, time, perception,
  seed, slot)` returns a line; no writes. Promotion to knowledge goes through
  the existing knowledge and relation owners with a cause (W9 ME8).
- II9 **Relevance scorer is pure and bounded.** Scores a small candidate set
  per surface per tick; ties break by stable ID so repaints never reshuffle.
- II10 **Signals and ripples reuse causal situations.** A signal is a phase
  of a scheduled situation; a ripple is an attributed effect with a fade.
  No new event system.

**Save and compatibility**

- II11 **Stable micro seed per instance,** pinned with the content revision
  (W9 PG1). One small saved field; old saves get one at load with a recorded
  compatibility decision.
- II12 **Derived by default, promoted rows only.** Seen counts are optional
  bounded history; save-free deterministic slots are the default (PG2).
- II13 **Per-world additive domains.** New world state goes in additive
  optional domains following the existing pattern; the scorecard notes engine
  schema numbers bump per world, so a general migration chain is a shared
  prerequisite before many worlds ship.
- II14 **Save size budget per world** and a cap on promoted micro and
  ripple records (KX34).

**Determinism and integrity**

- II15 **Flavour never touches gameplay RNG.** Hash of micro seed plus IDs;
  depends on the core randomness fix (scorecard U04, `proc/p1-streams`).
- II16 **Preview and repaint never mutate.** Rendering a line, hovering a
  tooltip or opening a panel earns nothing and rolls nothing (W9 ME3).
- II17 **Content revision pin.** A save records which pack revision its
  micro and signals came from; a pack update does not silently rewrite past
  lines.

**UI and presentation**

- II18 **One attention budget across surfaces.** Log, look text, people
  card and away report share one budget; urgent news wins; silence when
  saturated (W9 PG8, KG2).
- II19 **Receipts in hover, not in the log.** Perception receipts (KP7),
  ripple causes (KQ5) and "who told me" show on hover or in the notebook, so
  the log stays light. Desktop first.
- II20 **Text built with textContent,** stable IDs and escaping for every
  generated line (W9 ME3).

**Testing and proof**

- II21 **Lints before browser.** ID, reference, consumer, seal, era
  consistency and style lints run per card file in seconds.
- II22 **Snapshot tests for generated text** per world, seed and day
  (KX32), plus a ratchet that the micro budget is respected.
- II23 **One browser journey per loop type,** not per instance (FW9), on a
  rebuilt fresh origin at 1366x768 and a wider desktop size, with save,
  reload and import when state persists.

**Production and agents**

- II24 **One writer per world pack.** Lanes split by world, not by K part,
  once implementation starts; K-part lanes stay for design.
- II25 **Kit card is the brief.** A world implementer gets the kit card,
  floor gaps and the template; nothing else needs re-deriving (KX20).
- II26 **Respect live ownership.** Foundation R15 holds `main.js`, saves,
  tests and `dist/`; core-foundations lanes A1-A5 hold their worktrees.
  Kit work joins through their integration windows.

### Subtle implementation stuff (IS)

- IS1 **Renaming a micro line breaks its history.** IDs are permanent; text
  can change, ID cannot.
- IS2 **Ties and float drift.** Relevance ties sort by ID; idle accumulation
  uses integer minutes, not floats.
- IS3 **Two clocks disagree at midnight.** Day-boundary events use the local
  clock's boundary, not real time or the home calendar.
- IS4 **Seeded text across versions.** Changing the picker reshuffles all
  past-looking lines; version the picker and keep old saves on the old one
  or accept a one-time reshuffle by decision.
- IS5 **Reduced motion and colour.** Micro glyphs and signal tints need a
  reduced-motion path and a non-colour cue.
- IS6 **Localisation-ready strings.** Micro rows as keys plus templates, not
  concatenated sentences, so later translation or voice skins work.
- IS7 **Sealed lint on compiled output,** not only on cards, since templates
  can assemble a revealing sentence from safe parts.
- IS8 **Pack missing at load.** A save that refers to a missing world pack
  loads with that world dormant and a plain message, never a crash.
- IS9 **Hidden-state reads.** Predicates must read what the actor knows,
  not true target state (scorecard U06), or micro and signals leak truth.
- IS10 **Budget tests at scale.** A save with 14 worlds, big casts and long
  history still renders a tick under budget.

### New kit parts (K33-K34)

| Code | Part | Floor | Deep |
|---|---|---|---|
| K33 | Content revision and migration | Pack revision pinned in the save; compatibility note per change | Migration chain per world, dormant-world loading, diff tool |
| K34 | Author and debug tools | Lints and a coverage printout | Micro day preview, signal timeline view, cast schedule viewer, sandbox toggle (B3) |

### Proposed order (IO)

Proposals; each step needs its own authorization and live-ownership check.

| Code | Step | Why now | Depends on |
|---|---|---|---|
| IO1 | Kit cards for all 14 worlds (W1 finishing) | Shared map of gaps | None |
| IO2 | Power core schema design across priority worlds (W15) | F1 plus F5: top gap, must fit one capability system | Core consolidation plan (A1) |
| IO3 | MoL floor close: canon clock K12 and ward loop K13 (W14 spec) | Most ready world becomes the first full-floor world | Canon-events pilot-mol lessons |
| IO4 | Card compiler plus lints for K5/K6/KM | Multiplies every later world | None (dev-only) |
| IO5 | Micro seed plus read-only look-text micro in the Village | Cheapest visible depth; proves II8, II11, II15 | Randomness fix (U04) |
| IO6 | Market signals and price ripples in the Village (round 4 suggestion 1) | Proves attention pays | IO5 seed, II10 |

### Other stuff and more (KX37-KX42)

| Code | Consideration |
|---|---|
| KX37 | **Kit progress visible to Weibao** as a per-world grid of floor met / partial / missing, without spoilers. |
| KX38 | **Floor before deep, world by world.** One world at full floor is worth more than five at half. |
| KX39 | **Shared kit parts first.** Power core schema, clock adapter, micro resolver and compiler serve all worlds; world content after. |
| KX40 | **Retire duplicates as you go.** Each kit step that lands on a shared system removes one old path (scorecard ratchets). |
| KX41 | **Kit regressions.** A world that met a floor and lost it shows up in computed coverage. |
| KX42 | **Fun check per floor.** A floor is met only when the slice is pleasant to play, not just present; Weibao's taste is the final gate. |

### Suggestions (round 5, ranked)

1. Make the power core schema (IO2) the next design priority; it is the top
   gap in most worlds and should fold into the core consolidation, not sit
   beside it.
2. Close Mother of Learning's floor (IO3) as the first full-floor world.
3. Land the micro seed only after the randomness fix, so flavour never
   shares gameplay RNG.

### Codex lanes, round 5

| Lane | Parts | Writes |
|---|---|---|
| W14 | Implementation specs for IO3 (MoL K12/K13), IO5 (micro seed and look text) and IO6 (signals and ripples): files, owners, save decisions, tests, live-ownership conflicts | `docs/worlds/world-core-kit-2026-10-14/W14_IMPLEMENTATION_SPECS.md` |
| W15 | Power core schema across priority worlds, mapped onto the capability systems the scorecard lists | `.../W15_POWER_CORE_SCHEMA.md` |

## Round 6: comic worlds, cheats that show the kit, overarching shape, abstractions (2026-10-14)

Request: "Considering comic worlds and stuff and more? more to consider?
other stuff and more? Cheats that would show stuff like these and more? ...
Subtle stuff too? Overarching stuff? Implementation implciations and more?
Abstaction thats needed?"

Existing comic research this builds on: [comics wiki pilot](../research/comics/REPORT.md)
(Marvel power grid, origins, identity and death flags, 24 legacy mantles, 382
Marvel and 159 DC event pages, Green Lantern ring rules) and
[comic worlds as playthrough targets](../research/comics/PLAYTHROUGH_TARGETS.md).
Digests exist for DC, Marvel (blocked, leads only), My Hero Academia and Worm.
Comic worlds are not in the canon-first tier; this round says what the kit
needs for them, not that they move up the order.

### Comic worlds through the kit (CW)

Comic worlds stress the kit in ways book and anime worlds do not.

| Code | Comic trait | Kit parts it bends | Default + dial |
|---|---|---|---|
| CW1 | **Many continuities.** Earths, reboots, retcons, Ultimate lines, What If | K1, K17, AX14 | Canon is a lattice, not a line. Census per continuity; copies are native. Dial: one chosen continuity or a multiverse hub |
| CW2 | **Sliding time.** Heroes stay 30 for decades | K8, K16, K22, K30 | Dial: comic time (slow aging, era drift around you) versus real aging |
| CW3 | **Many power origins in one world.** Mutant, mutate, tech, magic, alien, god, training | K3 | Several power cores in one world, each a separate schema entry (W15) |
| CW4 | **Native rank scale.** Marvel power grid (six stats, 1-7), DC threat levels, MHA quirk ranks, Worm PRT classes (Brute, Thinker...) | K3.4, K11 | Rank as social fact; observers rate you |
| CW5 | **Secret identities.** One person, two public faces | K6, K20, K31, part 21 | Identity personas with separate standing (AX17); tells link faces |
| CW6 | **Status quo gravity.** Deaths reverse, damage gets fixed by next issue | K10.3, K16 | Dial: death permanence and repair speed per world |
| CW7 | **Crossover events.** Big events sweep the whole world on a schedule | K12, K32 | Event seasons on the canon clock, with tie-in situations in every district |
| CW8 | **Team rosters.** Avengers, X-Men, Justice League, Teen Titans, Wards | K7 | Institutions with roster churn, membership votes, reserve lists |
| CW9 | **Street to cosmic in one world.** Daredevil's block and Galactus share a map | KX3 | Scale ladder with access gates; a street start stays street unless pulled up |
| CW10 | **Civilian life among capes.** Damage control, insurance, rebuilding, cape-tourism, henchman jobs | K8, K24 | Ordinary starts are the life-sim core of comic worlds |
| CW11 | **Villain economy and prisons.** Rogues galleries, supervillain prisons, henchman unions | K7, K8, K10 | Villain-side jobs and debts (part 22 part 19 villain play) |
| CW12 | **Legacy mantles.** Robin, Flash, Captain America, Sorcerer Supreme | K16, part 24 | Titles pass between people; mantle carries regard and enemies |
| CW13 | **Comic presentation.** Panels, captions, thought bubbles, lettering, sound effects | K14 | Comic frame skin: caption log voice, onomatopoeia as text VFX, speaker lettering |
| CW14 | **Fourth wall.** Deadpool, She-Hulk, Ambush Bug | K14, PRESENTATION_AND_FOURTH_WALL | Per-character dial; a fourth-wall character can comment on the UI |
| CW15 | **Comic ages as eras.** Golden, Silver, Bronze, Modern each shift tone, tech and morality | K2.5, KX2, KG5 | Era sets tone dial and micro consistency (no smartphones in Silver Age) |
| CW16 | **Rule-tight comic-like sources first.** Worm/Ward, MHA, One Punch Man, Invincible, The Boys have firmer rules than Big Two continuity | K1, K2 | Easier first comic world; Worm full text is in the novel library |
| CW17 | **Source access.** Big Two wikis block bots or return 403 (digest) | K1 | Use the API pilot pulls, handbook-style data and fan summaries; label MEMORY heavily |

Comic-world starts (illustrative): damage-control trainee, henchman on a
first job, mutant kid at a special school, newspaper photographer, a hero's
landlord, power-insurance adjuster, PRT desk clerk in Brockton Bay, quirk
counsellor, sidekick applicant, villain's accountant.

Subtle comic stuff (CWS):

- CWS1 **Gutter time.** What happens between panels is idle time; a time
  skip is a "meanwhile" caption.
- CWS2 **Retcon residue.** After a retcon, some locals half-remember the old
  version; a micro line, sometimes a clue.
- CWS3 **Costume wear.** Torn capes, patched suits, upgrades between arcs
  (KK2).
- CWS4 **Identity tells.** Same voice, same limp, same coffee order in both
  identities; reporters notice (K6.7, KS2).
- CWS5 **Collateral bills.** Every fight leaves a repair bill someone pays
  (K29 ripples).
- CWS6 **Lettering as voice.** Each speaker has a lettering style in the log;
  a villain's caption box colour is a tell.
- CWS7 **Fan and press culture.** Hero merch, trading cards, tabloid
  rankings; renown in comic form (part 21).

### Cheats that show the kit (lens cheats, CL)

Cheats whose function is to make a hidden kit layer visible. Each is a
**lens**: a read-only view over existing state, not a new system. Framing,
strength and cost differ per world. Links: [cheat library](../CHEAT_LIBRARY.md),
[status window dispatch](../gm/dispatch/cheat-status-window-2026-10-13/GOAL.md),
[features as cheats](world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md).

| Code | Lens cheat | Shows | World framings (illustrative) |
|---|---|---|---|
| CL1 | Status window | K3 power core numbers, ranks, growth | System window, Hogwarts report card, Sequence sense |
| CL2 | Threads of cause | KQ ripples and their causes (KQ5) | Red string, fate lines, Spider-Verse threads |
| CL3 | Omen sense | KS signals early, longer lead time | Divination, spider-sense, Danger Sense, Spirit Vision |
| CL4 | Thought captions | KD subtext as caption boxes | Comic thought bubbles, Legilimency lite, telepath |
| CL5 | Power grid | Rates anyone on the world's native scale (CW4) | Handbook entry, sorcerer grade, PRT file |
| CL6 | Story weight sense | Who is plot-bearing (canon weight W3) | "Main character aura", narrative gravity |
| CL7 | Continuity sight | Which copy or continuity you are in, divergence from canon | Multiverse watcher, timeline map |
| CL8 | Local's eyes | KM micro at regular-noticing level on arrival | Native memory, borrowed familiarity |
| CL9 | Perfect recall | Every micro line kept; hindsight links auto-filled (KR5) | Eidetic memory, Pensieve |
| CL10 | Canon clock | K12 schedule with confidence that drops as you diverge | Reader's knowledge, prophecy book |
| CL11 | Appraisal | K9 items: maker, quality, provenance, history | Identify, Six Eyes, psychometry |
| CL12 | Tells reader | K6.7 tells without practice | Cold reading, Sherlock scan |
| CL13 | Retcon | Undo one small event (CW6 as a tool) | Comic retcon, Echo Anchor variant |
| CL14 | Fourth-wall voice | UI labels as in-world jokes; jokes-as-hints flagged | Deadpool-style narrator |
| CL15 | Kit sight (sandbox) | Depth tiers and gaps; author tool shown as a cheat | Debug god mode (B3 sandbox only) |

Lens rules:

- CLR1 **Lens over receipts.** A lens reads observations, causes, situations
  and standing that already exist; it never invents truth (II19, AX15).
- CLR2 **Strength ladder.** Weak lens shows hints; strong shows exact. Grows
  with use (UP13 practice counter).
- CLR3 **Sealed safety.** Even a strong lens shows sealed truths only by
  their discovery route; lints run on lens output (IS7).
- CLR4 **Costs per world.** Fatigue, attention budget share, noticed by
  observers (KK5), or social cost when caught reading minds.
- CLR5 **Dial per world.** Some worlds forbid a lens by law (K2), some make
  it common.
- CLR6 **Lens stacking.** Two lenses combine (omen sense plus threads shows
  which act will cause the coming event); stacking is where lens cheats get
  interesting.

### Overarching shape (OV)

The whole kit, seen from above.

- OV1 **Five layers.** Rules (K2, K3, K10) under Life (K5-K9, K19-K28) under
  Story (K11, K12, K16, KS, KQ) under Surface (K14, KM, KD, CL lenses) with
  Meta beside them (K15, K17, K18, K33, K34). Each layer reads only the one
  below it.
- OV2 **Same engine, different data.** Every world is data on shared
  abstractions plus a few named hosts for rules packs cannot express (W6 F3).
- OV3 **Three knowers everywhere.** Character, player and world knowledge
  stay separate in every layer, including lenses.
- OV4 **Attention is the skill.** In an idle game, noticing, preparing and
  choosing are the play; signals, perception and lenses all serve this.
- OV5 **Floor everywhere, deep where played.** Priority worlds reach floor;
  depth follows Weibao's attention (KX11, DT6).
- OV6 **One crossing grammar.** Carry, convert, suppress and outlier rules
  work the same between any two worlds, comics included.
- OV7 **Explain everything.** Any number, line or event can answer "why?"
  through receipts. This is what makes depth legible.
- OV8 **Director loop.** Weibao plays, attention promotes rows, agents
  deepen them, lints and journeys prove them, Weibao accepts.

### Abstractions needed (AX)

Most already exist as part 23 UP primitives or scorecard foundations; the
job is to name one interface each and retire duplicates. New ones are marked.

| Code | Abstraction | Serves | Existing | Status |
|---|---|---|---|---|
| AX1 | WorldDefinition | Identity, laws, clock, palette, pack refs | `world_instances.js` definitions, RF4 | Extend |
| AX2 | Law | K2 predicates with hard/soft and import treatment | `realm_boundary_rules.js`, RF16 | Extend |
| AX3 | PowerCore | K3 for every world | Six capability systems (scorecard U07) | Merge (W15) |
| AX4 | Actor | Person, body, controller | U01 | Extend |
| AX5 | PerceptionProfile | KP channels and filters for micro, signals, lenses | U06 partial | **New** |
| AX6 | Observation | What was seen, by whom, when, on what basis | UP1 belief, UP3 witness set | Unify |
| AX7 | Clock | Local clocks with absence policy | UP6 | Extend (II7) |
| AX8 | Situation | Canon events, signals, background events | UP7 | Extend |
| AX9 | CausedEffect | Effects with cause and fade (ripples) | 33-op effect vocabulary, UP2 | Extend |
| AX10 | Standing | Actor by institution memory | UP4, U08 thin, lane A4 | Extend |
| AX11 | Place | Access, rhythm, states, micro tables | Native places | Extend |
| AX12 | Carrier | News, gossip, letters, travel | UP8 | Extend to information (K23) |
| AX13 | MicroTable + Picker | KM rows and pure selection | None | **New** (II8) |
| AX14 | Overlay | AU, continuity, retcon patches | UP9, EI1 | Extend; comics need it early |
| AX15 | Receipt / Explain | "Why", "who told me", "you noticed because" | UP2 | Extend to every surface |
| AX16 | AttentionBudget | Shared surface budget | None | **New** (II18) |
| AX17 | Persona | One actor, several public identities with own standing | None | **New** (CW5, disguise, nonhuman) |
| AX18 | Lens | Read-only view that raises perception over receipts | Status window panel | **New**, thin (CL rules) |
| AX19 | Tag store | Implication tags under everything | Lane A2 building it | In flight |

Abstraction rules:

- AXR1 **Earn it twice.** A new abstraction lands only when two worlds'
  floors need it (WI10). AX5, AX13, AX16, AX17 and AX18 pass: micro and
  signals need AX5/AX13/AX16 in every world; AX17 is needed by comics,
  disguise and possession; AX18 is how every reveal cheat works.
- AXR2 **Interface before storage.** Name the read interface first; storage
  can stay where it is until a merge is cheap.
- AXR3 **Retire one per landing.** Each abstraction that lands removes or
  wraps one duplicate path (scorecard ratchets, KX40).
- AXR4 **No world imports in the core.** The scorecard finds the shared core
  imports world code; abstractions are how worlds plug in without that.

### Implementation implications of round 6 (II27-II36)

- II27 **Comics need Overlay (AX14) runtime earlier** than book worlds,
  because continuity is native, not an AU extra. Build-time overlays (EI1)
  still come first.
- II28 **Persona (AX17) touches standing and knowledge.** Standing keys
  become actor+persona; knowledge records which persona was seen. Needs a
  save decision; additive persona list on the actor, default one persona.
- II29 **Lenses are cheap once receipts exist.** Every CL cheat is a view
  over AX6/AX8/AX9/AX10; build receipts first, lenses after.
- II30 **One lens host,** not one per cheat: lens = (filter, strength,
  cost, framing). Status window becomes the first lens.
- II31 **Multi-core worlds.** PowerCore schema must allow several cores per
  world and per actor (CW3, also cross-world carry).
- II32 **Comic frame skin** is a K14 presentation pack (captions, lettering,
  SFX) on the existing text VFX and log voice seams, desktop first.
- II33 **Death permanence dial** must be a world setting the defeat flow
  reads (CW6), not a per-event hack.
- II34 **Event seasons** reuse situations with a world-wide scope and tie-in
  phases per district (CW7).
- II35 **Abstraction order:** AX19 tags and AX3 power core (in flight or
  designed) first, then AX6 observation and AX15 receipts (feed everything),
  then AX5/AX13/AX16 (micro), then AX18 lenses, then AX17 personas and AX14
  runtime overlays.
- II36 **Coordinate with core-foundations.** AX3, AX10 and AX19 overlap lanes
  A1, A4 and A2; kit lanes read their outputs and do not write those files.

### Other stuff and more (KX43-KX50)

| Code | Consideration |
|---|---|
| KX43 | **Genre kits.** Comic, academy, cultivation, horror, war and isekai kits are presets over the same parts. |
| KX44 | **Lens cheats as onboarding.** A weak lens early teaches the player what to notice, then fades as their own skill grows. |
| KX45 | **Multiverse hub.** A comic multiverse can act as a hub world like Reincarnation Paradise, with its own kit. |
| KX46 | **Era-hopping in one world.** Comic ages, school years, cultivation epochs: same place, different era kits. |
| KX47 | **Identity at scale.** Personas, disguises, possession and nonhuman forms share AX17. |
| KX48 | **Mantle carryover.** Titles and mantles as a carry layer across lives (part 17). |
| KX49 | **Kit-native achievements.** Noticing a signal in time, reading a subtext, unmasking a persona as quiet records, not popups. |
| KX50 | **Abstraction docs as contracts.** Each AX gets a one-page interface note before code, owned by one writer. |

### Suggestions (round 6, ranked)

1. Name AX6 observation and AX15 receipts as one interface next: signals,
   ripples, micro, lenses and comics all read them.
2. Make the status window the first lens (AX18) so every later reveal cheat
   is a configuration, not new code.
3. If a comic world is wanted, start with a rule-tight one (Worm/Ward or
   MHA) over Big Two continuity; it needs less overlay machinery and has
   better source access.

### Codex lanes, round 6

| Lane | Parts | Writes |
|---|---|---|
| W16 | Comic worlds through the kit: Worm/Ward, MHA, Marvel, DC, Invincible, The Boys, One Punch Man and others; per-world kit floors, starts, CW rows checked | `docs/worlds/world-core-kit-2026-10-14/W16_COMIC_WORLDS.md` |
| W17 | Lens cheats: CL rows in depth, per-world framings, strength ladders, costs, stacking, links to the cheat library and status window | `.../W17_LENS_CHEATS.md` |
| W18 | Abstraction map: AX rows against UP, scorecard U, RF/EI and live code; minimal interfaces, merges, retire list, order | `.../W18_ABSTRACTIONS.md` |

## Round 7: lane returns, more comic media, comic cheats, merging and version control (2026-10-14)

Request: round 6's prompt again, plus "Merging, commiting or pushing?"

### Lane returns so far (F8-F14)

Four lanes are complete: [W4](world-core-kit-2026-10-14/W4_PLACES_CRAFT_LOOP_LOOK.md),
[W6](world-core-kit-2026-10-14/W6_ENGINE_TEMPLATE.md),
[W8](world-core-kit-2026-10-14/W8_LIVED_LAYER.md) and
[W11](world-core-kit-2026-10-14/W11_MICRO_MOTION_BY_WORLD.md), plus the
[template](templates/WORLD_CORE_KIT_TEMPLATE.md). Fourteen lanes are still running.

| Code | Finding | Source |
|---|---|---|
| F8 | **TTKS needs five cards, not one.** Each book is its own kit (B1-B5); priority cards become 18 plus paused A Soldier's Life. | W4-R1 |
| F9 | **RF17's 14 loop hosts are not today's 14 priority worlds.** W4 supplies loops for TTKS B1-B5, LOTM, CoI, Shadow Slave, Fate, HxH and FMA. Root K13.1 overstated the match. | W4-C1 |
| F10 | **One older LOTM proposal (LM4, active-session-only acting) conflicts with the later idle direction.** Its owner should reconcile it; W4 and W8 both flagged it. | W4-C2, W8-Q2 |
| F11 | **Hubs, crafts and recipes need source-bound qualification** before implementation (HP school, CoI urban versus reset hamlet, Shadow Slave crossing, Fate ritual, TTKS B2 inscription). Cards name candidates, not canon recipes. | W4-Q1, Q2 |
| F12 | **Smallest shared micro slice: greet a known person, earn familiar address, get a truthful callback** (M1-M4) for HP, MoL and LOTM. One small saved fact; repeated hellos give no regard. | W11-D2 |
| F13 | **Clocks first, then moments.** World-local clock and "who was actually there" bindings must come before micro moments (KT), or native months and unseen NPC acts quietly become canon. | W11-A2 |
| F14 | **Code collisions.** W6 and the root both use KX-style codes for different rows. A consolidation pass must rename lane-local codes (W6-KX) rather than share root KX numbers. | W11-D3 |

Root corrections from these: K13.1 now reads "RF17 names 14 hosts; priority
worlds need their own" (see F9). LM4 stays as an open conflict for its owner.

### More comic-like media (CW18-CW25)

| Code | Medium | Kit note |
|---|---|---|
| CW18 | **Webtoons and manhwa** (Solo Leveling, Tower of God, Omniscient Reader webtoon, The Beginning After the End) | Often adapt web novels; K1 picks novel versus webtoon as editions (K1.1). Vertical-scroll pacing suggests short beats |
| CW19 | **Franco-Belgian comics** (Asterix, Tintin, Valérian) | Album-length arcs, strong place texture, gentle status quo; good cozy-tone kits |
| CW20 | **Creator-owned series** (Saga, Hellboy, Sandman, Invincible, The Umbrella Academy) | Single author, firm continuity; easier K1 than Big Two |
| CW21 | **Western animation worlds** (Avatar: The Last Airbender and Legend of Korra) | Very rule-tight power core (bending styles from martial arts), eras built in; a strong candidate by rules |
| CW22 | **Comic strips** (Calvin and Hobbes style, Peanuts style) | Micro-only worlds: tiny daily beats, no plot; a test of the micro layer alone |
| CW23 | **Graphic-novel literature** (Watchmen, Maus style) | Heavy tone; KX5 content dials matter; good for divergence AUs, poor for idle loops |
| CW24 | **Superhero prose** (Worm, Ward, Super Powereds, Wearing the Cape) | Text sources give the deepest K1; Worm full text is in the library |
| CW25 | **Manga already covered** (MHA, One Punch Man, Chainsaw Man, JJK) | Treat as comic worlds for CW13 presentation, anime tier for priority |

### Comic-flavoured cheats (CL16-CL25)

Comic devices as lens or meta cheats. Each still follows CLR1-CLR6.

| Code | Cheat | Shows or does |
|---|---|---|
| CL16 | Editor's note | Footnote boxes linking a current moment to an earlier one ("see the bakery, spring"); auto hindsight links (KR5) |
| CL17 | Previously on | Recap of what changed since you last played, ranked by relevance (KX29) |
| CL18 | Next issue | A teaser of one coming event with fuzzy details (KS signal, CL3 cousin) |
| CL19 | Splash page | Highlights the one big moment of the day so it is not lost in the log |
| CL20 | Variant cover | See how a person looks or acts in an AU or other continuity (CL7 cousin) |
| CL21 | Sound effects | Hear power use, fights and lies as onomatopoeia in the log (KP2 cousin; CW13) |
| CL22 | Caption box | Your own inner voice notes things your character half-noticed (KS6 at low noticing) |
| CL23 | Panel freeze | Pause one moment to inspect everything in the scene, at a cost (a lens stack in one shot) |
| CL24 | Crossover pass | Briefly bring one ability or person from another world into this one (K15) |
| CL25 | Letters page | Read what "fans" (the world's public) think of you; renown as text (part 21) |

Subtle on lenses (CLS):

- CLS1 **Lens misreads.** Weak lenses sometimes show a plausible wrong
  reading (K11.5); strength reduces misreads, never to zero by default.
- CLS2 **Lenses on you.** Locals and enemies with lenses read you; your
  persona (AX17) and tells (K6.7) matter to what they see.
- CLS3 **Lens fatigue.** Constant use dims the lens or the mind; idle rest
  restores.
- CLS4 **Lens etiquette.** Using a lens openly is rude or illegal in some
  worlds (K3.10, K24).
- CLS5 **Lens framing drift.** The same lens reads as divination in HP, a
  Beyonder trait in LOTM and a system window in a litRPG world.

### More abstractions (AX20-AX23)

| Code | Abstraction | Why |
|---|---|---|
| AX20 | **Dial registry** | Every Default + Dial in the kit lives in one per-world table the game and authors read: death permanence, comic time, signal lead time, density, lens strength. Without it dials scatter into code |
| AX21 | **Projection** | Micro, lenses, receipts, the log and panels are all projections of state for one viewer. One projection contract (viewer, perception, budget, seal lint) instead of each surface rolling its own |
| AX22 | **Edition** | Which medium and version a fact comes from (CW1, K1.1, CW18). Distinct from Overlay: an edition is the source choice, an overlay is a divergence |
| AX23 | **Kit card** | The author-side manifest per world (II1) with computed coverage; not a runtime object |

AX20 and AX21 pass AXR1: every priority world needs dials and every surface
is a projection.

### Overarching (OV9-OV12)

- OV9 **Design flow has its own lifecycle:** palette round, lanes, returns,
  consolidation, owner update, commit. Consolidation is the step most often
  skipped; it is where codes and contradictions get merged.
- OV10 **One canonical card per world.** Lane files are inputs; the world's
  kit card is where results land, so a world implementer reads one file.
- OV11 **Contradictions are kept, not hidden.** A contradiction register per
  world (both sides, owner, status) is part of the card.
- OV12 **Depth stays honest.** Every card separates documented, source
  implemented, built, browser verified and director accepted.

### Merging (MG)

Two meanings, both covered.

**Merging documents (consolidation)**

- MG1 **Consolidate after the lanes return,** not while they run. One
  consolidation lane per round of returns.
- MG2 **Per-world card first.** Merge W1-W18 rows for one world into its kit
  card (template from W6), with links back to lane rows.
- MG3 **Code hygiene.** Lane-local codes keep a lane prefix (W6-KX1); root
  codes are never reused (F14).
- MG4 **Contradiction register.** Every both-sides finding (W4-C1 to C5,
  W8-Q2, W11-D3 and more) lands in the world card with its owner.
- MG5 **Root stays a palette.** Results go to world cards and owners; the
  root keeps only short F rows and links.
- MG6 **Owner updates.** Accepted-looking findings still go to their real
  owner (RF17, LM4's owner, WORLD_BRIEFs) only through that owner's writer.

**Merging, committing and pushing in git**

| Code | Action | State today (checked) | Recommendation |
|---|---|---|---|
| MG7 | Commit kit docs | Root, template, dispatch prompts and four finished lane files are untracked; run logs are gitignored | Commit now, only these paths; commit running-lane files when each finishes |
| MG8 | Shared owner files | USER_VISION, IDEA_INDEX and WORLD_DEPTH_CONSIDERATIONS carry many other sessions' uncommitted edits interleaved with the kit lines | Do not stage whole files from this task; the session that commits those files takes the kit lines with them, or a later careful hunk commit |
| MG9 | Push | `codex/gameplay-foundations` is 21 commits ahead of `origin` (public fork) with other sessions' commits | Needs Weibao's explicit yes, since it publishes all 21; docs-only kit commits are safe content (no raw prose, no sealed truth) |
| MG10 | Merge to master | Branch carries unverified gameplay and many open gates | Not recommended now; a master merge is a release decision with its own verification gate |
| MG11 | Lane worktrees | Kit lanes are docs-only in the main checkout; no worktrees to merge | None |

### Implementation implications (II37-II42)

- II37 **Dial registry before more dials.** Each new dial in a lane becomes
  a registry row, so code never hardcodes a world's choice.
- II38 **Projection contract** gives one place for seal lint, budget and
  textContent safety (IS7, II18, II20).
- II39 **Edition tag on census rows** so comics, webtoons and adaptations do
  not collide (AX22).
- II40 **TTKS splits into five packs** or one pack with five book scopes;
  the card decides (F8).
- II41 **Clock bindings gate KT micro moments** (F13).
- II42 **Commit cadence for design waves:** commit the root and finished
  lane files per round; never commit run logs; shared owners commit with
  their own session.

### Other stuff and more (KX51-KX56)

| Code | Consideration |
|---|---|
| KX51 | **Micro-only test world.** A comic-strip style world (CW22) tests the micro layer with no plot at all. |
| KX52 | **Avatar as rules benchmark.** Bending is a tight, teachable power core; a good test of the PowerCore schema (W15). |
| KX53 | **Design debt ledger.** Open contradictions, unqualified recipes and stale findings counted per world. |
| KX54 | **Round budget.** Each palette round lists what it added and what it merged, so growth stays visible. |
| KX55 | **Reader for Weibao.** A short per-world "what this world will feel like" page from the card, spoiler-safe. |
| KX56 | **Lane fatigue.** Many parallel lanes repeat context reading; consolidation lanes should hand later lanes a digest. |

### Suggestions (round 7, ranked)

1. Run consolidation (MG1-MG5) once the remaining lanes return: per-world
   cards, renamed lane codes, contradiction registers.
2. Take W11's greeting slice (F12) as the first shared micro implementation
   candidate, after clock bindings (F13).
3. Push only on your yes; merge to master later as a release step.

### Codex lanes, round 7

| Lane | Parts | Writes | Status |
|---|---|---|---|
| W19 | Consolidation: per-world kit cards from W1-W18, code renames, contradiction registers | `docs/worlds/world-core-kit-2026-10-14/cards/` | Queued until lanes return |
| W20 | More comic media and comic cheats: CW18-CW25 checked, CL16-CL25 in depth, Avatar and Worm kit floors | `.../W20_COMIC_MEDIA_AND_CHEATS.md` | Running |

## Round 8: returns in detail, repeating audit, every little detail (2026-10-14)

Requests: "save this core auditing for long term repeating", then "consider
the stuff accordingly, every little detail, maybe put into uservision? more
to consider?" Saved as the [audit playbook](WORLD_CORE_KIT_AUDIT_PLAYBOOK.md),
[core audit entry](../audits/WORLD_CORE_KIT_CORE_AUDIT.md), tools in
[tools/core_kit_audit/](tools/core_kit_audit/) and a
[USER_VISION section](../USER_VISION.md#world-core-kit-every-little-detail-and-a-repeating-audit-2026-10-14).

### Lane returns (F15-F26)

Fifteen of twenty lanes have now finished (W12, W16, W17, W18, W20 running;
W19 queued).

| Code | Finding | Lane |
|---|---|---|
| F15 | **First people slice: one remembered loan plus a household appointment and paid work that changes a later offer,** in HP or the MoL visitor branch. Pin identity, dates and money before any canon T5 card. Refusal and absence must show who lives and works next. | W3 A1-A3 |
| F16 | **First story slice: appraisal, then warning, then local aftermath** in one HP school-year window, with three frozen starter knowledge envelopes. Reuse the MoL and Fated Villain pilot lessons: one warning with a credible response and one nonresponse. | W5 S1-S2 |
| F17 | **Grounded micro pools exist** for HP school supplies, MoL household and workshop, Tingen utilities, a Trier café, a Shadow Slave refuge and the early Paradise service street. Fate domestic life, JJK school days and Naruto civilian routines need scene locators first. | W7 S1-S2 |
| F18 | **Micro reaches a hint only through an observed baseline.** A micro sighting neither reveals a sealed truth nor proves a lie; a tell needs the actor's normal behaviour first. | W7 S3, W13 A2 |
| F19 | **Reference games point at "learned preference plus later acknowledgement"** (the regular's order remembered, a later nod to it) and one personal display plus one queued care routine per district. Gate: a changed later response, no extra reward on redraw, exact save/reload/import. | W10 A1-A2 |
| F20 | **First perception proof: HP nursery** (trade eyes and receipt), then the same selector in D&D repair and MoL physical study. Nine cue candidates and three cast cards as the comparison set. | W13 A1 |
| F21 | **Subtext floor = literal line, two readings, a witnessed baseline and a direct way to ask.** No subtext skill or confidence meter before that. | W13 A2 |
| F22 | **The randomness fix (U04) is now source-merged,** so IO5 (micro seed and look-text micro) can land in an authorized integration window. It is the smallest visible proof of pure rendering, stable revision and old-save compatibility. | W14 S14.1 |
| F23 | **IO3 (MoL) needs an opt-in forward canon profile and a real ward affordance frozen before code;** keep the legacy visitor intact and do not call a local calendar a canonical month. | W14 S14.2 |
| F24 | **IO6 price signals must change real prices end to end** (list, basket, commit, post-reload), and the existing saturation path should do its own work once. | W14 S14.3 |
| F25 | **Power core order: read-only parity view after the capability boundary is set, then one MoL device/ward core, then one distinct consumer** (D&D slot preparation or an LOTM role-act receipt). No seventh capability store. | W15 P1-P3 |
| F26 | **Rules floor: bind one HP or D&D floor to exact passages** with 5-10 law facts, 3-6 techniques and one recoverable objective; use the MoL device and its noncombat outs as the comparison for power, fuel and body kept separate. | W2 A1-A2 |

Convergence across lanes: HP and MoL keep coming up as the first two worlds
for almost every slice (people, story, perception, micro, power), D&D third.
That matches the canon-first order and the readiness grid.

### Every little detail: principles (ED)

How "every little detail" stays wanted without becoming noise or debt.

- ED1 **Every detail gets a home.** Each detail has a code, an owner and a
  tier (T0 census at least). Nothing is lost because no one wrote it down.
- ED2 **Detail is cheap at T1, earned above it.** Naming a detail costs a
  line; making it remembered (T3) needs a reader that uses it.
- ED3 **A detail with a future reader gets saved.** Others are derived or
  stay texture (W11 A3).
- ED4 **Truthful detail.** A detail never claims something the world did not
  do: no invented off-screen acts, no fake canon (F11, F13).
- ED5 **Details compound.** The best details link: a micro line becomes a
  tell, a tell becomes a clue, a clue becomes a callback (KR1, KC).
- ED6 **Detail density follows attention.** Where Weibao plays, detail
  deepens (DT6); elsewhere it stays at floor.
- ED7 **Details are checked like code.** Seal lint, era lint, budget and
  repetition checks apply to every generated or authored line (II21, KG).
- ED8 **Little details are in the direction, not just the palette.** Recorded
  in USER_VISION so later agents treat them as wanted, not as gold-plating.

### More to consider: the repeating audit itself (RA)

- RA1 **Drift check.** Each rerun compares the root's claims with lane
  findings and code; stale claims are corrected in place (LL3).
- RA2 **Staleness tags.** Kit rows and cards carry the date and commit they
  were checked at, so a reader knows how old a "partial" is.
- RA3 **Delta first.** Reruns start from what changed since the last run
  (git log since the run's commit, new world folders, new lane outputs).
- RA4 **Cost guard.** A rerun lists lanes and expected size up front; 2-6
  lanes per round, fewer when 40+ other runs are live (LL8).
- RA5 **Round summaries.** Each round states added codes, folded returns and
  corrections (KX54), so growth stays readable.
- RA6 **Retire rows.** Rows superseded by a better one get a dated "see X"
  instead of silent deletion.
- RA7 **Readiness trend.** The cards' grid keeps a small history (floors met
  per world per run) so progress over months is visible.
- RA8 **Director view.** A one-page, spoiler-safe "where each world stands"
  for Weibao from the grid, refreshed each run (KX37, KX55).
- RA9 **Automation option.** A scheduled check could run `status.py` and a
  readiness delta on a cadence; set up only if Weibao asks, since it is
  standing configuration.
- RA10 **Shared method.** Improvements found here fold into the general topic
  expansion playbook as well, so the companions audit and others benefit.

### Other stuff and more (KX57-KX62)

| Code | Consideration |
|---|---|
| KX57 | **HP and MoL as joint pilots.** Most slices name both; run each slice in one and verify reuse in the other before a third world. |
| KX58 | **Slice bundling.** People (F15), story (F16), perception (F20) and micro (F19) slices can share one HP district so one proof covers four kit parts. |
| KX59 | **Source request queue.** Gaps like Fate domestic life or JJK school days become narrow scene requests for the source lanes, not broad rereads (F17). |
| KX60 | **Integration window booking.** IO5 is unblocked (F22); kit slices queue for the Foundation and core-foundations integration windows rather than writing shared files directly. |
| KX61 | **Card freshness badge.** Each world card shows "checked at commit X, date Y" (RA2). |
| KX62 | **Detail debt.** Count per world: named-only details, unqualified recipes, open contradictions; the number should fall over runs. |

### Suggestions (round 8, ranked)

1. Bundle the first HP slices in one district (KX58): remembered loan,
   appraisal-to-warning, nursery perception, learned preference. One proof,
   four kit parts.
2. Book IO5 into the next integration window now that U04 is merged (F22).
3. Run W19 consolidation as soon as the remaining five lanes finish, then
   record the first readiness trend (RA7).

### Final lane returns (F27-F31, added 2026-10-14)

All design lanes W1-W18 and W20 have finished; W19 consolidation is launched.

| Code | Finding | Lane |
|---|---|---|
| F27 | **Signals start from one qualified canon slice:** bind five KS cues and two hub acts to its event IDs (HP supply and intake, or a selected MoL month). Review cause, recipient, clock, expiry and leak risk together for every promoted cue. Preview one calm, storm, relief interval with a worker and a specialist observer; preparing helps modestly, skipping stays viable. | W12 A1-A3 |
| F28 | **First comic exercise: Worm's existing finite commission (ER02)** with one ordinary craft or support start, six local contacts and three crisis consequences bound to chapters. Operative power, institutional assessment and persona exposure need three different records. Retcon (a mutation) must stay separate from a read-only lens. | W16 A1-A3 |
| F29 | **Lens proof = one observation interface, two readers:** status self-facts and item-quality appraisal, after the status window hardening gate. Lens pairs should answer different questions (missing signal versus bad measurement). Being read should leave readable traces with one helpful appraiser and one bounded investigator. | W17 S1-S3 |
| F30 | **Define AX6 observation and AX15 receipts with separate trusted execution and observer reads,** then wrap the MoL and Paradise attributed reports as the first consumers. Defer durable Persona and runtime Overlay until two chosen floors need them. | W18 S1-S3 |
| F31 | **Paper-test the PowerCore on bending** (tired earthbender, missing material, nonbender theory, Avatar access) to separate source, aptitude, resource and proficiency before any runtime slice. Candidate director review: Avatar quarry lesson plus Editor's note, or Worm commission plus a gutter ledger. | W20 G1-G3 |

Convergence: W13, W17 and W18 all point at one observation-and-receipt
interface as the shared next abstraction (round 6 suggestion 1 confirmed).

## Round 9: the more-to-consider school, part by part (2026-10-14)

Request (Weibao, 2026-10-14, second time): the same "more to consider? other
stuff and more? save and extend accordingly Send out codex as usesful?" for
each aspect, plus "Use the more to consider school".

The school (skill `more-to-consider`) asks different questions from rounds
1-8. Rounds 1-8 asked *what a world needs*. Round 9 asks, per part, *what
breaks between having it and the player feeling it*: who produces the state,
who owns it, who reads it, what the player sees; what goes wrong on reload,
old saves, odd ordering and repeats; how to inspect it; what to reuse; and a
disposition. Codes MC1-MC34 match K1-K34.

Dispositions: **NOW** = fix in the kit's own files this round. **ACCOUNT**
= a constraint every slice of that part must carry, no separate work.
**LATER** = recorded follow-up or lane.

### Same-day owners to reuse, not restate (OM)

Twenty other dispatches ran on 2026-10-14. Each kit part has a sibling owner
that went deeper on one slice of it. Read these before writing a kit row.

| Code | Kit parts | Same-day owner |
|---|---|---|
| OM1 | K3, K13 | [core foundations](../CORE_FOUNDATIONS_SCORECARD_2026-10-14.md) A1 capability merge; [W15](world-core-kit-2026-10-14/W15_POWER_CORE_SCHEMA.md) |
| OM2 | K4, K15 | start-sources, nonhuman-starts dispatches; [nonhuman engine requirements](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md) |
| OM3 | K6 | companions, relationship-prereqs dispatches |
| OM4 | K9 | maker-arts, making-runes, weaponcraft-runes, research-tech dispatches; [maker arts by world](MAKER_ARTS_BY_WORLD_2026-10-14.md) |
| OM5 | K12, K17 | canon-events dispatch; [TIMELINES_AND_DIVERGENCE](../TIMELINES_AND_DIVERGENCE.md) |
| OM6 | K16 | runs-and-endings dispatch |
| OM7 | K22 | body-lineage dispatch; [genetics doc](../GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md) |
| OM8 | K8, K26, K32 idle side | away-ledger, derived-snapshots dispatches (absence and offline time) |
| OM9 | K14, K34 | ui-at-scale, p23-ui-polish dispatches |
| OM10 | K18, K33 | engine-runtime dispatch; gen-rules for seeded generation |

### Part by part (MC)

Each row: **Chain** = producer, owner, reader, what the player sees, and
where it breaks today. **Subtle** = the interaction that makes the obvious
build wrong. **Lifecycle** = reload, old save, ordering, repeats, partial.
**Inspect** = the read-only view that proves it. **Do** = disposition.

| Code | Chain (where it breaks) | Subtle | Lifecycle | Inspect | Do |
|---|---|---|---|---|---|
| MC1 Census | Source lane → ledger → pack author → nobody at runtime. Census rows have no consumer, so a census can be "done" and change nothing (W1 F3). | Census weight W0-W3 silently decides what gets built; a missed row is invisible later. | Source revisions: a census row pinned to an edition goes stale when a new book lands. | Coverage printout: census row → kit row → pack ID → journey. | ACCOUNT: every census row names its consumer or says "texture only". |
| MC2 Laws | Doc law → `realm_boundary_rules.js` for imports only. Native laws live as scattered checks in action code. | A law checked in one action but not its twin (buy vs steal, cast vs scroll) is a hole players find first. | Law change after a save: an action legal yesterday is illegal now; old pending work must finish or refund. | Law lens: "why can't I?" names the law and its source. | LATER (W24, corrected in round 10): list each law's enforcing call sites per world. |
| MC3 Power | Six capability systems, each its own producer and reader (U07, W15). Status window reads some, not all. | Two systems grant the same skill; mastery double counts or splits. Idle growth from one, active use in another. | Merge migration: old XP must keep meaning (W15 says no forced conversion). | Power ledger: every point of power with its receipt (AX15). | ACCOUNT: no new world adds a seventh store; wait for A1 read shape. |
| MC4 Starts | Start record → body/role/means → world state. Prior history at a mid-era start has no producer (debts, friends, scars invented by nobody). | A start's means outrun the world's economy on day one. | A start chosen in an old save before a start record changes. | Start preview: what you own, owe, know, and who knows you. | ACCOUNT: every start lists its prior-history producer, even "generated at start". |
| MC5 Places | Place defs → location state → look text. Changed places (burned, warded) need a state owner per place copy. | Place state shared across copies leaks one AU's fire into canon. | Removed place in a revised pack; player standing in it on load. | Place history: states this place passed through and why. | ACCOUNT: place state keyed by world instance (AX11). |
| MC6 Cast | Person defs → people_knowledge → dialogue/log. Schedules (T3) have no shared clock reader per world. | A T3 person seen in two places at once when two clocks disagree. | Dead person in canon, alive in your copy: which file owns the body. | Cast schedule viewer (K34). | LATER: tie to companions and relationship-prereqs readers (OM3). |
| MC7 Institutions | Standing (UP4) thin; each world invents its own rep. | Rank and standing drift: promoted by one path, still a stranger to the clerk. | Institution dissolved by a canon event; your rank in it after load. | Standing card: who in the institution knows what about you. | ACCOUNT: one Standing reader (AX10) per new institution. |
| MC8 Daily life | Jobs and prices exist (`native_trade_transaction.js`, `market_saturation.js`); calendars are one global `game_time.js`. (Corrected round 13, W23-F1: MoL and Paradise have world-keyed calendar projections; weather, trader epochs and the main date and temperature display still read home globals.) | Local calendar festivals versus the global season name. | Away time: does the job pay while away (OM8 away ledger)? | Day ledger: earned, spent, eaten, slept, with sources. | ACCOUNT: daily loops declare their away behaviour to the away ledger. |
| MC9 Craft | Material and recipe owners split across maker-arts lanes (OM4). | A world's tech ceiling versus an imported recipe. | Recipe revised mid-craft; half-made item on load. | Recipe provenance: where learned, what limits apply here. | ACCOUNT: craft rows link OM4; kit holds only the world floor. |
| MC10 Danger | `native_battle_contracts.js` per world; defeat and recovery uneven. | Nonviolent outs feel worse than fighting if rewards differ. | Death mid-fight versus run endings (OM6). | Threat ecology: what lives here, why it attacks, what it wants. | ACCOUNT: every threat roster names one nonviolent out. |
| MC11 Knowledge | `world_knowledge.js`, `observation_channels.js`, notebook. Foreknowledge has no confidence reader yet. | Knowing a canon fact you never learned in-world leaks into dialogue choices. | Copied world: does the notebook copy, split or stay with the person? | Knowledge lens: known, believed, wrong, sealed-by-ID. | ACCOUNT: AX6 observation before any new knowledge store (F30). |
| MC12 Canon | `causal_situations.js`; canon graphs in OM5 lanes. Abstention outcomes lack a clock owner per world. | Two canon events fire on one tick in fixed file order, not story order. | Canon event already passed when a mid-era start begins. | Canon timeline with "would have happened" ghosts. | LATER: tie to canon-events lessons (OM5). |
| MC13 Signature loop | Lives inside one world's native module; no shared loop-health reader. | A loop that is fun active but dead idle (or the reverse). | Loop state pending at save: wards half-cast, curtain up. | Loop meter: inputs, outputs, waste per hour. | ACCOUNT: each signature loop states active, idle and away behaviour. |
| MC14 Presentation | `panel_kit.js`, `display.js`; per-world palette scattered. | A world skin that hides a warning colour another world relies on. | Old UI layout prefs after a new panel joins. | Panel census per world: which panels appear where. | ACCOUNT: desktop first; check UI rows with OM9. |
| MC15 Crossings | `realm_boundary_rules.js`, `realm_cargo.js`. Locals' reaction to outliers has no reader. | Suppressed power that still leaks through a passive. | Carried item whose home world was removed or revised. | Carry table preview at every door. | LATER: per-edge carry rows belong to nonhuman/start lanes (OM2). |
| MC16 Endings | Ending types in OM6; "life goes on" has no state owner. (Corrected round 13, W22.M2: MoL has a bounded closure and aftermath writer, `src/book_world_mol_actions.js:70`, read on return at `:81`; no universal continuation policy.) | An ending that freezes clocks other worlds still read. | Ended world reopened after a pack revision. | Ending ledger: what closed, what keeps running. | ACCOUNT: link OM6, keep kit row as floor only. |
| MC17 AU hooks | `world_instances.js` copies; divergence metadata thin (EI2). | AU flags that change law (K2) but not cast memory (K6). | Copy made before a migration; both copies must migrate. | Copy diff: canon versus this copy, by part. | LATER: W22 traces copy keys per part (corrected in round 10). |
| MC18 Save | `save_files.js`, `save_migration.js`, `expansion_persistence.js`. | Kit parts that add state without saying where it saves. | Every part above. | Save map: kit part → save key → migration. | NOW: K18 row in the template now asks each part's save key (see below). |
| MC19 Senses | Look text only; no sense channel owner (AX5 new). | Nonhuman senses read the same text as humans. | None durable; texture redraw must be stable (IO5 seed anchor). | Sense lens: what each channel would add. | ACCOUNT: texture draws through the pinned seed, never render-time random. |
| MC20 Language | Name pools per world; no address-form reader. | A title used before you know it is a leak. | Name pool revised: existing NPC names must stay. | Name origin: pool, region, era. | ACCOUNT: generated names saved, never re-rolled on load. |
| MC21 Belief | Doc only. | Belief that contradicts a sealed truth must not hint the truth by its wording. | Festival that falls during absence. | Belief map by group. | ACCOUNT: sealed-safe wording review on belief rows. |
| MC22 Bodies | Body-lineage owner (OM7); local medicine per world missing. | Healing magic in one world making medicine pointless across a crossing. | Injury that lasts versus away time. | Body chart with causes and healers who can help. | LATER: per-world medicine floor (W23). |
| MC23 Information | Event feed is player-facing only; no in-world news carrier. (Corrected round 13, W22.M3 and W26-F1: NPC-addressed claims and corrections exist, `src/feature_expansion_subtlety_scene.js:71,75`, `src/people_knowledge.js:97`; narrow delayed reports exist; no general courier network.) | News that reaches NPCs faster than the carrier allows. | News queued during absence. | Rumour trace: origin, carriers, decay. | LATER: AX9 caused-effect carriers. |
| MC24 Law of small | No fines or petty debts owner. (Corrected round 13, W22.M1: career debt writer `src/village_career.js:82`, shown at `src/village_career_ui.js:15`; bounded compensation `src/feature_expansion_subtlety_scene.js:78`. General courts and witness spread still missing.) | Petty crime with no witness reader (UP3) is free. | Debt due during absence. | Small-debt ledger. | ACCOUNT: small consequences use Standing and witness sets. |
| MC25 Personal space | `home_furnishing_content.js` and home facts exist for the base world. | A home per world versus one home that follows you. | Home in a removed or ended world. | Room view: what is here and why. | LATER (W23): per-world home floors. |
| MC26 Routine | Habits proposed (ABILITY_AUTHORING AB1); `everyday_life.js` exists. | Habits formed in idle time count as much as chosen ones. | Habit streaks across absence. | Habit list with formation dates. | LATER (W23). |
| MC27 Comedy | Doc only (part 15). | A gag that repeats every reload. | Gag state not saved so callbacks fail. | Gag ledger: setup, payoff, used. | ACCOUNT: callbacks need saved setup flags (KC). |
| MC28 Weather | **SHOWN:** `src/weather.js:9-14` is one global season table and base temperature; `:64`, `:91` read the shared season. No per-world climate. (Round 13, W29-R2: Paradise native places use a static 20 C and normal light, `src/book_world_paradise_native.js:104-106`, bypassing seasons; a fallback, not sourced climate.) | MoL Cyoria, HP Scotland and a desert world share one season name and temperature. | Per-world weather needs a world-keyed state or a pure derive from world clock plus seed. | Weather by world and day. | LATER (W23): per-world climate floor; engine row for AX7 clock. |
| MC29 Ripples | AX9 caused effects; KQ rows. | Ripples that only fire while the player watches. | Ripple queued, then its cause undone by a load. | Ripple timeline (CL lens). | ACCOUNT: ripples carry cause IDs. |
| MC30 Perception | AX5 new; KP rows. | Perception filter that hides a warning the player needs. | Profile changes when body changes. | Perception diff: what you would see as X. | ACCOUNT: safety text bypasses perception filters. |
| MC31 Subtext | Doc only. | Subtext that only works if the player reads every line. | None durable. | Subtext reveal toggle (sandbox only). | ACCOUNT: subtext always has a plain-text fallback later. |
| MC32 Tension rhythm | Canon clock plus signals; no pacing reader. | Away time skips the calm and lands the storm. | Absence crossing a canon storm. | Rhythm strip per world. | ACCOUNT: away ledger reports storms crossed. |
| MC33 Revision | Pack revision pin proposed; no diff tool. (Corrected round 13, W22.M4: typed pack receipts already save revision and hash, `src/structured_pack_runtime.js:78`, with an exact-content reader at `src/structured_pack_state.js:29`; only the diff tool is missing.) | A text fix that renumbers IDs. | Every save. | Pack diff tool. | ACCOUNT: IDs are stable strings, never positions. |
| MC34 Tools | Lints and status printouts per lane. | Debug views that mutate state by accident. | Debug flags saved into real saves. | Tool list with read or write marked. | ACCOUNT: lenses read, cheats write, never one tool both. |

### Act now (corrections to the kit's own files)

| Code | What was wrong | Done this round |
|---|---|---|
| AN1 | The [kit template](templates/WORLD_CORE_KIT_TEMPLATE.md) covered K1-K18 only; K19-K34 had no fill-in rows, so a world GM following it would skip half the kit. | Added one compact table for K19-K34 with floor, save key and inspect columns. |
| AN2 | W1 readiness cards rated K1-K18 only (252 rows). K19-K34 have no readiness. | Lane W21 rates K19-K34 for the priority worlds. |
| AN3 | No part said where its state saves. | Template rows now carry a save key column (MC18). |

### Other stuff and more (KX63-KX70)

| Code | Consideration |
|---|---|
| KX63 | **Orphan state.** A kit part with a producer and no reader is depth nobody feels. Count orphans per world alongside detail debt (KX62). |
| KX64 | **Reader without producer.** A panel that reads state nothing writes shows empty or fake data. Same count, other side. |
| KX65 | **Away behaviour column.** Every loop, clock and debt says what happens while Weibao is gone (OM8). |
| KX66 | **One world, many clocks.** Weather, canon, schedules, prices and festivals each read a clock; they must read the same world clock (AX7). |
| KX67 | **Per-world globals audit.** `weather.js` is one example of a base-world global that every new world silently inherits. Find the others. |
| KX68 | **Sibling owner drift.** Twenty same-day owners each extend kit parts; the kit should link, and its cards should name which owner is newest per part. |
| KX69 | **Disposition is part of the row.** Every future kit angle carries NOW, ACCOUNT or LATER so the palette stays actionable. |
| KX70 | **Inspect before build.** For each part, the read-only lens is cheaper than the feature and finds the gaps; build lenses first where the part is fragmented. |

### Suggestions (round 9, ranked)

1. Run W22 (dependency chains) next to W19's cards: orphans and missing
   readers are the cheapest real depth gaps to fix.
2. Treat KX67 globals as a pre-gate for any second native world: weather is
   the first found, likely not the last.
3. Keep W19 cards and W21 K19-K34 readiness in one grid so the trend counts
   all 34 parts.

### Codex lanes, round 9

| Lane | Covers | Owns |
|---|---|---|
| W21 | K19-K34 readiness per priority world (D and R), extends W1 | `W21_READINESS_K19_K34.md` |
| W22 | Dependency chains: producer, owner, reader, player view per K1-K34 in live code; orphans (KX63), readers without producers (KX64), copy keys (MC17) | `W22_DEPENDENCY_CHAINS.md` |
| W23 | Base-world globals (KX67) and lifecycle matrix: reload, old save, ordering, repeats, absence per part; per-world floors for K22 medicine, K25 home, K26 routine, K28 weather | `W23_GLOBALS_AND_LIFECYCLE.md` |

## Round 10: more to consider on round 9's directions, and a lane per direction (2026-10-14)

Request (Weibao, 2026-10-14): "sned out codex to address each direction, run
another more to consider pass". This round runs the more-to-consider school
on round 9 itself: what could make its directions wrong, what they depend
on, and one lane per open direction.

### Corrections first (CR)

| Code | What was wrong | Fixed |
|---|---|---|
| CR1 | MC2 sent law call sites to W21, but W21 is K19-K34 readiness. | MC2 now points at W24. |
| CR2 | MC17 sent copy keys to W21; W22 owns copy keys in its prompt. | MC17 now points at W22. |
| CR3 | Round 9 traced chains on HEAD only. 35 branches are unmerged, including core-foundations `core/a2-tags`, `core/a3-travel-tests`, `core/a4-relationships` and `core/a5-determinism`. Chain claims can be stale the moment those land. | Round 10 lanes label code found only on a branch as "branch X", and treat HEAD gaps as "open on HEAD". Merging those branches belongs to their owners (merge-before-dispatch rule); this audit does not merge them. |

### The directions round 9 left open (DR)

| Code | Direction | Source rows | Lane |
|---|---|---|---|
| DR1 | Per-world weather and climate instead of one global table | MC28, KX67, F1 | W23 designs; W28 prototypes after W23 returns |
| DR2 | Base-world globals beyond weather | KX67 | W23 |
| DR3 | Laws enforced in every twin action; same-tick canon ordering | MC2, MC12 | W24 |
| DR4 | One world clock with every reader, and an away column per loop | KX65, KX66, MC6, MC8, MC32 | W25 |
| DR5 | Information carriers, small consequences, standing and ripples | MC7, MC23, MC24, MC29 | W26 |
| DR6 | Inspect before build: one inspector shell, read versus write tools, newest owner per part | KX68, KX70, MC34 | W27 |
| DR7 | Orphans and readers without producers | KX63, KX64 | W22 (running) |
| DR8 | K19-K34 readiness | AN2 | W21 (running) |

### More to consider on those directions (MD)

| Code | Angle | Do |
|---|---|---|
| MD1 | **Not every world has seasons.** (Corrected in round 11, CR4: Paradise was named here without a source check; its hub has a sourced calendar and each derived world brings its own.) Dungeons, dream realms and space may have no Earth year. The climate shape needs "no season", custom cycles and indoor worlds, not four named seasons per world. | ACCOUNT in W23, W28 |
| MD2 | **Weather reads `current_location` from `main.js`.** A per-world derive should take world, place and clock as arguments so tests and the away ledger can call it without the game loaded. | ACCOUNT in W28 |
| MD3 | **Away time must reuse the same derive.** If the away ledger guesses weather separately, crops and travel disagree with what you see on return. Determinism belongs with `core/a5-determinism` and seeded streams. | ACCOUNT in W25, W28 |
| MD4 | **Derived, but effects saved.** Weather itself can be recomputed; what it caused (spoiled food, a missed ferry) must save as a caused effect with a cause ID (MC29). | ACCOUNT |
| MD5 | **Twin actions come in families.** Buy, steal, beg, craft; cast, scroll, item, ritual; enter, sneak, teleport. A law checks the family, not one verb. | W24 |
| MD6 | **Same-tick order is a story order.** When two canon events share a tick, order should follow the graph's cause edges, then a stable ID, never file load order. | W24 |
| MD7 | **One clock, many speeds.** Worlds can run faster or slower than home (realm clock leases), but every reader inside one world must read that world's clock. Mixed readers are the bug, not different speeds. | W25 |
| MD8 | **Thirty-four lenses is too many panels.** Lenses should share one inspector shell (status window and CL family), with one page per part, under the UI-at-scale owner. Desktop first. | W27 |
| MD9 | **Read and write never in one tool.** A lens that can also "fix" state makes saves untrustworthy; debug writes go through cheats that leave a receipt. | W27 |
| MD10 | **News is a carrier, not a broadcast.** Owl, gossip, phone, newspaper each have speed, reach and distortion; a ripple uses one. Small debts and petty crime then travel by the same carriers to Standing. | W26 |
| MD11 | **Prototype after design, not alongside.** W28 waits for W23's globals list so one climate shape covers the other globals of its kind (calendar, day length). | W28 queued |
| MD12 | **Integration windows.** Any prototype lands on its own branch and joins only through the shared integration owner (R15). No lane writes `main.js` or shared hosts. | ACCOUNT |

### Other stuff and more (KX71-KX75)

| Code | Consideration |
|---|---|
| KX71 | **Branch-aware audits.** A kit audit should list unmerged branches that touch each part, so readiness reads "HEAD partial, branch X closes it". |
| KX72 | **Direction ledger.** Every DR row stays open until a lane returns and the root folds it; the run log counts open versus closed directions per run. |
| KX73 | **Climate as texture first.** The cheapest visible win is weather words in look text per world (K19), before weather changes work or danger. |
| KX74 | **Absence storms.** When away time crosses a canon storm (MC32), the return summary should say so plainly, with what you missed. |
| KX75 | **Lens pages as acceptance aids.** Each lens page doubles as the evidence screen for a browser journey, so proof and play use the same view. |

### Suggestions (round 10, ranked)

1. Land W23 then W28 first: weather is the one concrete code gap found, and
   a pure per-world climate derive is small, testable and safe to reverse.
2. Ask the core-foundations owner to merge `core/a2`-`a5` before W24-W26
   specs turn into code; their chains depend on tags, travel and determinism.
3. Fold W22's orphan list into W27's inspector map so the first lens pages
   show state that exists but nobody sees.

### Codex lanes, round 10

| Lane | Direction | Owns | State |
|---|---|---|---|
| W24 | DR3 laws and ordering | `W24_LAWS_AND_ORDERING.md` | launched |
| W25 | DR4 clocks and away | `W25_CLOCKS_AND_AWAY.md` | launched |
| W26 | DR5 carriers and small consequences | `W26_CARRIERS_AND_SMALL_CONSEQUENCES.md` | launched |
| W27 | DR6 inspector map | `W27_INSPECTOR_MAP.md` | launched |
| W28 | DR1 per-world climate prototype (own worktree and branch, pure module plus tests, not integrated) | branch `kit/w28-world-climate` | queued until W23 returns |

## Round 11: specific worlds and their special stuff (2026-10-14)

Request (Weibao, 2026-10-14): "Consider specific world stuff too, cause
paradise hub might based on the book and more? Or has special stuff and
more? more t oconsider? Send out codex accordingly".

Rounds 9 and 10 wrote generic directions. Each world bends them: some
worlds already solved a direction in their own code, some have a shape the
kit never assumed. This round checks the directions against specific
worlds, starting with Paradise, and sends lanes by world group.

### Corrections first (CR4-CR6)

| Code | What was wrong | Evidence | Fixed |
|---|---|---|---|
| CR4 | MD1 said Paradise's hub has no seasons. That was a guess, not a source check. | SHOWN: [hub life](paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md) "Between-world calendar" row (hub rest days, mission spacing, origin return, with an open stage contradiction); [canon plan](paradise-hub/CANON_PRIORITY_PLAN_2026-10-14.md) F16 (Paradise, Reality and Void share reference flow; other worlds and transit vary). | MD1 reworded in place. |
| CR5 | KX66 and MC8 implied the game has one global clock. Paradise already has per-instance clocks with policies. | SHOWN: `src/book_world_paradise_native.js` `paradiseCalendarAt` (own 30-day months); `src/book_world_paradise_carriers.js:30-35` clock list with `common` and `presence` modes, `hub` versus `local` kinds, `absence: 'freeze'`, and return and extraction deadlines on local clocks. | DR4 should start from Paradise's clock policy shape, not invent one. W25 told via this round. |
| CR6 | W26 uses "carriers" for news; Paradise code already uses "carrier" for the body and context that crosses worlds. | SHOWN: `src/book_world_paradise_carriers.js:11` `paradiseCarrierContext`. | Kit calls news carriers **couriers** from here on (MD10 meaning unchanged). |

### World shapes the kit assumed away (SW)

The kit pictured one world with one map and one clock. Several priority
worlds have other shapes, and each shape changes how every K part nests.

| Code | Shape | Worlds (MEMORY unless cited) | What it changes |
|---|---|---|---|
| SW1 | **Hub of worlds.** A home base that sends you into derived worlds with their own laws, clocks and deadlines. | Paradise (SHOWN above) | Two kit layers: one hub kit, plus a thin kit per derived world. Hub laws (contract, rating, fees) sit above local laws. |
| SW2 | **Looping world.** The world resets on a schedule; you keep some things. | Mother of Learning (time loop) | (Corrected round 13, W19-F10, W30-F3: an in-story reset is a clock boundary, never a file reload; today's native MoL is a continuous visitor, not the canon loop.) "Reload" becomes an in-world event. Lifecycle rows (MC) need an in-loop column: what resets, what persists, who remembers. |
| SW3 | **Paired worlds.** Two linked realms with different rules and clocks. | Shadow Slave (waking world and Dream Realm), Bleach (living world and Soul Society) | Each realm needs its own K2, K5, K28; crossings (K15) happen inside one world. |
| SW4 | **Bounded institution world.** Life runs on a school or org calendar. | HP (school years and terms), JJK (school plus missions), Naruto (village and ranks) | The institution's calendar is the world's main clock; holidays and terms drive K8, K21, K32. |
| SW5 | **Modular campaign world.** Rules first, settings swappable. | D&D | The kit applies per setting module; the rules layer (rests, slots, planes) is the shared core. |
| SW6 | **Hidden-layer world.** An ordinary surface hides a power society. | LOTM, CoI, HP, Fate, JJK | Two of everything: public and hidden cast, prices, news, law. Perception (K30) and subtext (K31) carry most of the play. |
| SW7 | **Event-bounded world.** The world is defined by one recurring contest. | Fate (Grail War), HxH (Hunter Exam and arcs) | The canon clock is the contest; K12 and K32 dominate, and life between contests is thin in the source. |
| SW8 | **Several independent books.** (Corrected round 13, W19-F9, W31-F1: the five TTKS books are separate worlds and settings, not eras of one world; B3 also has hub, challenge, archive and visit modes.) | TTKS (B1-B5 split) | Kit rows per book, no borrowing floors across books (already W1 rule). |

### Specific worlds against the directions (WS)

All rows are proposals. Anything not cited is MEMORY and goes to the lanes
to source-check.

| Code | World | Special stuff the kit must respect | Directions it bends |
|---|---|---|---|
| WS1 | Paradise | Contract and rating system above every derived world; paid hub services with real prices; finite hub rest between missions; auctions and guilds; derived worlds with deadlines and extraction (SHOWN in paradise-hub docs). Native code already owns calendar, clocks and carriers. | DR1 weather lives per derived world; the hub's own environment needs a source check. DR3 hub law (contract terms) outranks local law. DR4 reuse its clock policies. DR6 its envelope validators are a ready inspector source. |
| WS2 | Mother of Learning | Month loop; loop-aware knowledge; Cyoria's calendar inside one month. | DR4 loop reset is a clock event; DR1 weather must repeat inside the loop unless the player changes causes; DR5 rumours reset with the loop. |
| WS3 | Harry Potter | School terms, houses, points; owl post; Ministry law and the Statute of Secrecy; Scottish weather. | DR3 secrecy is a law with twin actions (spell, potion, item, talk); DR5 owls and the Prophet as couriers; DR1 a highland climate. |
| WS4 | D&D | Rests, spell slots, planes with their own laws; settings vary. | DR4 rests are a clock; DR3 planar laws; DR1 per setting and per plane. |
| WS5 | LOTM and CoI | Pathways and Sequences with acting; potion ingredients; churches and secret orgs; foggy industrial city. | DR3 church and secret-org laws; DR5 newspapers plus secret channels; DR6 sealed-truth care in every lens page. |
| WS6 | Shadow Slave | Spell, Nightmares, Dream Realm, ranks; waking world under the Spell. | SW3 pairing; DR4 two clocks; DR3 the Spell's rules as hard laws. |
| WS7 | JJK, Bleach, Naruto | Curtains and domains; reiatsu and Soul Society; chakra, villages and ranks. | SW3, SW4; DR3 institution law (schools, Gotei, villages); DR5 mission briefings as couriers. |
| WS8 | Fate, HxH, FMA | Grail War rules and command spells; Nen vows and restrictions; equivalent exchange and state alchemists. | DR3 vows and exchanges are personal laws; SW7 contest clocks. |
| WS9 | TTKS | Per-book worlds (B1-B5). | SW8; every direction rated per book. |

### More to consider on world-specific stuff (MW)

| Code | Angle | Do |
|---|---|---|
| MW1 | **Worlds that already solved a direction are templates.** Paradise's clock policies, MoL's native state and any world validator should be read before a generic design. | ACCOUNT: lanes list "already solved here" first. |
| MW2 | **Book first, then special.** A world's special system comes from its source; an original addition is labelled as one (the Paradise docs already split novel-qualified and original content). | ACCOUNT |
| MW3 | **Nesting.** Hub worlds and paired worlds need kit cards that nest: parent card plus child cards, with inheritance stated per part. | LATER: template gains a "parent world" field (after W29). |
| MW4 | **Source contradictions stay visible.** Paradise's calendar has a stage contradiction; the kit picks a per-era Default + Dial, never a silent pick. | ACCOUNT |
| MW5 | **Special currencies and ratings are laws too.** Paradise coins and ratings, house points, mission ranks: who issues them, who can revoke them, what they buy. | W29-W32 |
| MW6 | **World-specific inspectors.** Each world may need one lens no other world has (contract terms, loop memory, Sequence digestion, vow ledger). | W27 input |
| MW7 | **Per-world risk to sealed secrets.** World-specific lens pages and climate text can leak sealed truth; lanes name the risk by secret ID only. | ACCOUNT |

### Suggestions (round 11, ranked)

1. Make Paradise's clock policies the starting shape for DR4 and the climate
   prototype (W28), since they already carry modes, kinds, absence and
   deadlines.
2. Add the world shape (SW) to every world card so nesting is explicit
   before more per-part rows are written.
3. After W29-W32 return, add a "special stuff" section to the template.

### Codex lanes, round 11

| Lane | Worlds | Owns |
|---|---|---|
| W29 | Paradise hub and derived worlds (deepest) | `W29_PARADISE_SPECIAL.md` |
| W30 | HP, D&D, Mother of Learning | `W30_HP_DND_MOL_SPECIAL.md` |
| W31 | LOTM, CoI, Shadow Slave, TTKS B1-B5 | `W31_NOVEL_WORLDS_SPECIAL.md` |
| W32 | JJK, Bleach, Naruto, Fate, HxH, FMA | `W32_ANIME_WORLDS_SPECIAL.md` |

## Round 12: canon calendars (2026-10-14)

Request (Weibao, 2026-10-14): "cannon calendar and more? More to consider?"

A canon calendar is how a world names and counts its own days: units,
names, holidays, the canon date you arrive on, and how sure the source is
about each date. It sits under K12 (canon course), K21 (ritual), K28
(seasons), K32 (rhythm) and DR4 (clocks).

Owners to reuse (checked first, per LL13):
[origins and world timelines](ORIGINS_AND_WORLD_TIMELINES.md#overarching-history-with-local-calendars)
(three concepts: campaign order, local calendar and era, traveler exposure);
[intro flow](../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md) AH1-AH11 anchors,
SS4 calendar starts, MZ5 in-fiction date stamp, IR3 clock binding;
[canon-events MoL pilot lessons](../gm/dispatch/canon-events-2026-10-14/pilot-mol/LESSONS.md)
K3 (record date precision, never call a replay ordinal an exact source date)
and K6 (loop-local versus calendar recurrence);
[TIMELINES_AND_DIVERGENCE](../TIMELINES_AND_DIVERGENCE.md) TIME-P4.

### What the code does today (CR7)

| Code | Finding | Evidence |
|---|---|---|
| CR7 | **Native "calendars" are counters, not canon calendars.** MoL and Paradise each derive a date from elapsed minutes in the base-world format: year 1, twelve 30-day months, start at 06:00. No month names, no canon year, no week, no holidays, no canon anchor date. | SHOWN: `src/book_world_mol_native.js:7` (`calendarSeed` year 1, month 1, day 1, 06:00), `:19` `molCalendarAt`; `src/book_world_paradise_native.js` `paradiseCalendarAt` (same shape); `src/game_time.js:35-40` (30-day months, 12 months), `:63-71` and `:193` (four seasons by month number). | (Narrowed round 13, W33-F1: shared `Game_Time` already has weekdays, `src/game_time.js:90`, and moon helpers, `:109`; they are not sourced native calendars. W33-F3: night starts at 20:00 for light and 21:00 for the Day/Night label, `:3`, `:84`, `:188`.)
| CR7a | So per-instance *clocks* exist (CR5), but every world *formats* time like the base world. This is the KX67 globals pattern again, one layer up. | INFERRED from the above |

### Canon calendar parts (CC)

| Code | Part | Default + Dial |
|---|---|---|
| CC1 | **Calendar system.** Day length, week, month names and lengths, year count and era, epoch. Real-world calendars (JJK, Bleach, Shadow Slave, HP) reuse the Gregorian calendar with the world's year. | Default: source calendar where the text gives one; base format only for worlds with none. Dial: show both. |
| CC2 | **Date precision.** Exact day, week, month, season, "around", unknown, per canon event (pilot K3). | Default: display at the precision the source supports ("early autumn", not "Sept 14"). Dial: exact fan-timeline dates, labelled. |
| CC3 | **Arrival anchor.** The canon date a start lands on, mapped from elapsed time: `canon date = anchor + local elapsed`. Anchors come from starts (AH1). | Default: one anchor per world instance, saved. Dial: anchor chosen at start. |
| CC4 | **Recurring dates.** Terms, holidays, festivals, market days, holy days, full moons, exam seasons, auctions. | Default: recurring list per world with source labels. Dial: original festivals marked as original. |
| CC5 | **Several calendars in one world.** Civil versus church, school term versus civil, hub versus derived world, waking versus dream, loop day versus real day. | Default: one primary, others as overlays in the date line. |
| CC6 | **Canon timeline on the calendar.** Canon events placed by date window with precision, causes and abstention outcomes (K12, canon-events graphs). | Default: window, not point. |
| CC7 | **Calendar as foreknowledge.** A countdown to a canon event is a spoiler and a cheat. Showing it depends on what the actor knows (K11). Sealed events never show dates outside their route. | Default: dates of public events only; foreknowledge shows with confidence. Dial: a foreknowledge cheat adds the rest. |
| CC8 | **Divergence.** After you change things, dates keep running; canon events become "would have happened" ghosts (MC12). | Default: ghosts visible only to actors who knew. |
| CC9 | **Loop calendars.** MoL repeats one month: date resets, loop count is separate, recurrence is loop-local (pilot K6). | Default: date shows loop day plus loop number for loop-aware actors. |
| CC10 | **Ages and birthdays.** Cast ages come from canon birth years where sourced; birthdays are micro moments (KT) and callbacks (KC). | Default: sourced birthdays only; generated ones for generated people. |
| CC11 | **Sky and daylight.** Sunrise, night length, moons and their phases by latitude and world. Links weather (DR1) and night_time in `game_time.js:3-6`, which is one global night window. | Default: per world profile, derived not saved. |
| CC12 | **Calendar literacy.** Locals say "Friday after the feast"; outsiders and imports need a translation; a wrong date is a social tell (K30, K31). | Default: local names in log, tooltip with plain date. |
| CC13 | **Save shape.** Save elapsed time plus calendar profile revision and anchor; derive the date. Changing a canon anchor in a later pack revision needs a migration note (MC33). | ACCOUNT |
| CC14 | **Calendar lens.** One inspector page: today in each calendar, recurring dates ahead, canon windows the actor knows, precision labels (W27 shell). | LATER |
| CC15 | **Contradictory sources.** Text dates, author statements and fan timelines disagree in several series. Keep all with labels; choose per world by Default + Dial (MW4). | ACCOUNT |
| CC16 | **Crossover anchors.** Linked worlds can share a date (AH11); otherwise the date line shows each world's own date, never a converted one by default. | Default: no conversion. |

### Per world, first pass (all MEMORY until lanes check)

| Code | World | Calendar notes to check |
|---|---|---|
| CW-C1 | Paradise | Hub interval rules are SHOWN in [hub life](paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md) (rest, mission spacing, origin return, open contradiction). Derived worlds carry their own dates; the hub may have no civil calendar at all. |
| CW-C2 | Harry Potter | School year from September 1, Halloween feast, Christmas and Easter holidays, exam weeks, Quidditch fixtures, full moons. Book years are commonly dated by fans from in-text clues; label them. |
| CW-C3 | D&D | Per setting (for example a named Realms calendar with festivals); rests are the play clock. |
| CW-C4 | Mother of Learning | One loop month with a festival and an ending event; loop count; school term context. |
| CW-C5 | LOTM and CoI | In-world era and year numbering, church holy days, newspapers dated in-world. |
| CW-C6 | Shadow Slave | Near-future Earth calendar plus Spell-driven events and Dream Realm time. |
| CW-C7 | JJK, Bleach | Real Japanese calendar and school year; famous arcs tied to specific dates. |
| CW-C8 | Naruto, HxH | Thin explicit calendars; exams and auctions as recurring anchors. |
| CW-C9 | Fate, FMA | Year-anchored settings; Grail War duration; national calendar and state exams. |
| CW-C10 | TTKS | Per book (SW8). |

### Other stuff and more (KX76-KX81)

| Code | Consideration |
|---|---|
| KX76 | **Date line in the log.** Every world's first log line and day changes print the local date in its own format (MZ5); this is the cheapest visible slice. |
| KX77 | **Week rhythm.** Weekdays change jobs, shops, classes and crowds; most worlds have none in code today. |
| KX78 | **Holiday price and mood shifts** feed K8 and K32 through the same caused-effect path (AX9). |
| KX79 | **Calendar-gated starts** (SS4): a festival start exists only while the festival runs in that instance. |
| KX80 | **Elapsed versus experienced time.** A traveler's body age (exposure) differs from any calendar; the date line never stands in for age. |
| KX81 | **Calendar profile is content.** It lives in the world pack with a revision, not in code, so new worlds add calendars without new modules. |

### Suggestions (round 12, ranked)

1. A calendar profile in world content plus a pure formatter, shared by
   the MoL and Paradise native calendars, then a date line in the log
   (KX76, KX81). Small, visible and testable.
2. Put date precision (CC2) on every canon event row now, before more
   graphs are written.
3. Fold calendar into the W28 climate prototype's inputs so seasons and
   daylight come from the same profile.

### Codex lanes, round 12

| Lane | Covers | Owns |
|---|---|---|
| W33 | Calendar engine shape: today's time code (`game_time.js`, native calendars, `chronicle.js`, `life_record.js`, canon-events windows), CC1-CC16 against it, profile and formatter design, save and migration | `W33_CALENDAR_ENGINE.md` |
| W34 | Canon calendar census, book worlds: Paradise, HP, MoL, LOTM, CoI, Shadow Slave, TTKS B1-B5 | `W34_CALENDARS_BOOK_WORLDS.md` |
| W35 | Canon calendar census, other worlds: D&D, JJK, Bleach, Naruto, Fate, HxH, FMA | `W35_CALENDARS_OTHER_WORLDS.md` |

## Round 13: all lane returns folded, W19 and W21-W35 (2026-10-14)

Request (Weibao, 2026-10-14): "wait until all lanes finish, then fold
everything". All 35 lanes have finished. Corrections were made in place
first (marked "Corrected round 13" in MC8, MC16, MC23, MC24, MC28, MC33,
SW2, SW8 and CR7). Every row below is a proposal or a source reading; no
lane built, browser-tested or got director acceptance for gameplay.

### Corrections folded in place (summary)

| Code | Was | Now | Lane |
|---|---|---|---|
| FX1 | SW8 called TTKS one world in eras | Five independent books and settings | W19-F9, W31-F1 |
| FX2 | SW2 let "reload" stand for a loop reset | An in-story reset is a clock boundary; native MoL today is a continuous visitor, not the canon loop | W19-F10, W30-F3 |
| FX3 | MC16, MC23, MC24, MC33 said no owner exists | Narrow owners exist (MoL aftermath, NPC-addressed claims, career debt, pack revision receipts); the general systems are still missing | W22.M1-M4, W26-F1 |
| FX4 | CR7 said no weeks | Shared weekdays and moon helpers exist; they are not sourced native calendars | W33-F1 |
| FX5 | MC8 and MC28 implied all time reading is global | Calendars are local for MoL and Paradise; weather, trader epochs and the main date display still read home globals; Paradise places use a static 20 C fallback | W23-F1, W29-R2 |

### Lane returns (F32-F49)

| Code | Finding | Lane |
|---|---|---|
| F32 | **Twenty consolidated world cards now exist** ([cards index](world-core-kit-2026-10-14/cards/README.md)): 18 priority cards with TTKS split by book, paused Soldier's Life and a short Frontier card. W1's dated readiness is kept; new prose earns no runtime credit. | W19 |
| F33 | **Readiness counts don't add across lanes.** W1 and later lanes use different denominators; combined scores are not summed. Lane-local codes now carry lane prefixes (W6-KX11 and so on). | W19-F4, F5 |
| F34 | **K19-K34 readiness:** docs met/partial/missing 34/225/29; runtime 0/51/237. The lived and subtle layer is mostly documented and almost entirely unbuilt. | W21 |
| F35 | **Chains:** every K1-K34 traced from producer to player view. Generated keepsakes, need values and naming detail have no reader that makes them felt. Identity discovery flags have no public producer. Same-world copies would share world facts, cast, knowledge, stock and RNG scopes; no leak reproduced. | W22 |
| F36 | **Five cheapest chain repairs:** acquisition time in the biography, portable self-energy rows, a kit-obligation lead, a disclosed traveller keepsake, a received coarse need report. | W22.R |
| F37 | **Nineteen base-world globals** (G01-G19): calendar, daylight, temperature, rain, location defaults, schedules, restock, money and rounding, market regions, name defaults, generated people, lifespans, furnishings and more. Money needs context as much as weather; names are already world-keyed but default to Frontier. | W23 |
| F38 | **Lifecycle matrix** L01-L34 covers reload, old save, ordering, repeats, partial completion and absence per part, with a proof journey each (all OPEN). | W23 |
| F39 | **Laws:** MoL and Paradise law call sites are mapped by action family; missing theft, scroll and teleport twins are missing actions, not proven bypasses. Canon same-tick ties are decided by authored array order (`src/anchor_snapshots.js:75-82,103-110`); smallest fix is cause edges then stable ID, keeping a legacy path for the existing test. | W24 |
| F40 | **Clocks and away:** 208 modules read time; 22 away rows with Default + Dial, including storms crossed. HEAD already has seeded streams and pure anchor and away modules; the gap is one shared read and settlement seam. | W25 |
| F41 | **Couriers and small consequences:** reputation, delayed rumour, witnessed consequences, Standing, debt and repair partly exist. First slice proposed on the HP household profile: a borrowed item, an adult told, an optional loan response. | W26 |
| F42 | **Inspector map:** one shell, one page per K part, desktop first. Eighteen tool groups classified read, write or both; an unsaved speed control can still produce saved progress. Newest owner per part listed. | W27 |
| F43 | **Paradise hub:** crisis sky changes and a paid private habitat with light and humidity are sourced; ordinary hub weather stays UNKNOWN. Hub and Goa instances have no parent link today (`src/book_world_paradise_state.js:36`), so nesting (MW3) is a document link, not saved containment. Current wages, prices and survey are original prototypes. | W29 |
| F44 | **HP, D&D, MoL:** HP issuers (house points, money, exams, trust) are separate; D&D needs overlapping rules, setting, plane and local cards with actor-specific rests; MoL reset needs typed retention and atomic settlement. | W30 |
| F45 | **LOTM, CoI, Shadow Slave, TTKS:** CoI has actor-specific resets and pocket clocks; Shadow Slave needs waking and Dream cards with no fixed time ratio; Backlund fog is sourced. | W31 |
| F46 | **Anime worlds:** ranks, licences, certifications and command charges are separate issuer systems. Bleach is a first paired-realm card, not exactly two realms. JJK apparent night is not climate. | W32 |
| F47 | **Calendar engine:** CC1-CC16 against code, 12 partial and 4 missing. Revisioned calendar profile in world content plus a pure formatter; MoL and Paradise adopt it without changing saved elapsed time. First slice: the date line in the log at 1366x768. | W33 |
| F48 | **Canon calendars census:** HP July 31 birthday sourced; MoL "first of Chariot" dossier-qualified; Shadow Slave solstice link; TTKS B3 dated within its continuity; Harptos proposed for the D&D Sword Coast setting only. Contradictions kept both ways; proposed spoiler-risk IDs for calendar dates. | W34, W35 |
| F49 | **Per-world climate prototype exists** on branch `kit/w28-world-climate` (commit `024d4da9`, worktree `../yairpg-w28-world-climate`): `src/world_climate.js` with seven tests; matches today's weather formula on 5,280 sampled inputs; `npm test` 807/807 in the worktree. Not integrated, not built, not browser-verified. Integration belongs to R15. | W28 |

### Convergence

- **One context reader.** W23, W25, W29 and W33 all point at the same
  missing piece: a reader that answers "which world, place and clock am I
  in" so weather, dates, prices and names stop defaulting to the home
  world. W28's climate module and W33's calendar profile are its first two
  consumers.
- **Narrow owners already exist.** W22, W26 and W29 found working
  single-world pieces (debts, claims, reports, clocks). Extend them; do not
  design parallel systems.
- **Separate issuers.** W30 and W32 independently found that ranks, points,
  licences and currencies each need their own issuer and revoker.

### Suggestions (round 13, ranked)

1. Review and integrate W28 (climate) with W33's calendar profile as one
   small slice ending in a visible local date line and local weather words,
   proven by a rebuilt desktop journey. Needs R15's integration window.
2. Fix canon same-tick ordering (F39) before more canon graphs are written.
3. Build the first inspector page from W27's ranked list, starting with the
   W22 orphans it would reveal.

## Round 14: book versus code, where numbers come from (2026-10-14)

Request (Weibao, 2026-10-14): "was FX5 based on that be book said? more to
consider? Other stuff and more?"

**Answer: no.** FX5 describes the code, not the book. The book evidence
(W29.C, read from the supplied English EPUB) is different:

| What | Book (W29.C) | Code today |
|---|---|---|
| Ordinary hub weather, day and night, seasons | UNKNOWN in the checked chapters; "no weather" is not proved either | All seven Paradise places: static 20 C, normal light, `is_under_roof: false` (`src/book_world_paradise_native.js:104-106`) |
| Crisis sky | SHOWN: a black sky with blood-red lines before a war (sid852 p7-10); a blood-red overhead membrane with market rush (sid2347 p41-44) | Not represented |
| Private habitat | SHOWN/STATED: paid simulated sunlight 7-8 hours a day, imported soil, varied temperature and humidity (sid2597 p53-59), a later-era room | Not represented |
| Rain | Not established | **Home rain reaches Paradise.** Paradise places count as outdoors, so the home world's rain cycle (`src/weather.js:194-196`, day count mod 13) feeds `nativeRain` (`src/main.js:701`) into pacing (`src/absorb_e1/pacing.js:76`), which drives the rain icon (`src/display.js:4250-4258`), the Wet effect (`src/main.js:7449-7455`) and `weather.raining` facts (`src/main.js:575`, `:840`). SHOWN code path, not exercised in a browser. |

So the 20 C is an authored placeholder, and the rain is a home-world leak.
Neither is canon. This is the KX67 globals pattern again, now with a
gameplay effect (getting Wet in a place the book never describes as rainy).

### Corrections first (CR8)

| Code | Fix |
|---|---|
| CR8 | FX5 and W29-R2 now read: the 20 C is a code placeholder, not book climate; home rain also leaks into Paradise places through `is_under_roof: false`. The W36 integration slice must stop home rain and Wet in Paradise places whose weather is UNKNOWN (root adds this at integration if W36 does not). |

### More to consider: source fidelity (SF)

| Code | Angle | Do |
|---|---|---|
| SF1 | **Every number gets a provenance tag.** Book (with locator), derived from book, original (labelled), or placeholder. A placeholder never shows to the player as fact. | ACCOUNT |
| SF2 | **Unknown is not a default.** Showing "20 C" asserts something the book never said. UNKNOWN shows as no reading, "sheltered" or a neutral line, not a number. | ACCOUNT, W36 |
| SF3 | **Engine flags carry claims.** `is_under_roof: false` silently says "outdoors, exposed to home weather". Flags like roof, light, temperature, danger and market need the same provenance as text. | W37 |
| SF4 | **Book atmosphere is often an event, not weather.** Paradise's red skies are war signals (K12, KS), so they belong on the canon clock, not the climate table. | LATER |
| SF5 | **Later-era places override, never set, the world.** The paid habitat is one room in a later era; it does not make the hub climate-controlled. | ACCOUNT |
| SF6 | **The same check for every native world.** MoL, Proto23 and any book profile with numbers (prices, wages, temperatures, durations, counts) need the same book/derived/original/placeholder split. | W37 |
| SF7 | **Lens shows provenance.** The inspector (W27) shows each value's tag, so a player or agent can tell canon from prototype at a glance. | LATER |
| SF8 | **Prototype prices and wages are original.** W29 found Paradise's current survey, wages and prices are original prototypes; the book's own prices (for example three coins for a meal, sid28) are different data. Keep both, labelled. | ACCOUNT |
| SF9 | **Leaks are worse than gaps.** A missing feature is honest; a home default showing up in another world misleads. Rank leak fixes above new features in each world. | ACCOUNT |
| SF10 | **Unexercised paths.** The rain leak is SHOWN in code but not seen in play. The integration journey should confirm it before and after the fix. | W36 journey |

### Other stuff and more (KX82-KX86)

| Code | Consideration |
|---|---|
| KX82 | **Placeholder registry.** One list per world of placeholder values, so they can be found and replaced when the source is checked. |
| KX83 | **Fidelity score per world card.** Count book, derived, original and placeholder values; the placeholder count should fall over runs (like detail debt, KX62). |
| KX84 | **Leak tests.** For each native world, a test that home-only systems (rain cycle, seasons, trader epochs, home prices) do not change state there unless the world opts in. |
| KX85 | **Source windows on every claim.** W29's style (sid plus paragraph range plus EPUB hash) is the model for every world's code comments or data rows. |
| KX86 | **Translation-qualified sources.** Paradise evidence comes from a supplied English translation; labels say so, and exact wording claims wait for a better edition. |

### Codex lanes, round 14

| Lane | Covers | Owns |
|---|---|---|
| W37 | Source-fidelity audit of native world code: every constant and engine flag in MoL, Paradise, Proto23 and active book profiles, tagged book, derived, original or placeholder with locators; home-world leaks (KX84) with SHOWN code paths; placeholder registry (KX82) | `W37_SOURCE_FIDELITY.md` |

## Round 15: what's next, and more to consider on getting there (2026-10-14)

Request (Weibao, 2026-10-14): "whats next> MOre to consoider?"

State: W36 has committed the calendar and climate slice and a rebuilt
candidate on branch `kit/w36-calendar-climate` (`b0bb853b`, `f903ec1a`;
new `src/world_calendar.js`, `src/world_calendar_content.js`,
`src/world_weather_display.js`, `tests/world_calendar.test.js`, small
`display.js` and `main.js` joins). Its report is pending. W37 (source
fidelity) is running.

### Next, in order (A)

| Code | Step | Done when |
|---|---|---|
| A1 | Root runs the W36 desktop journey on rebuilt bytes at 1366x768, fresh origin: home date header, MoL and Paradise entry headers, weather words, Paradise rain and Wet before and after the CR8 fix, save, reload, export, literal import unchanged. | Screenshots and receipts saved; anything not reached stays OPEN |
| A2 | Merge W36 into `codex/gameplay-foundations`, rebuild there, full tests, smoke again. | Merge commit plus clean rebuilt bundle; push waits for a yes |
| A3 | Fold W37; pick the top home-world leak fixes as the next small slice (SF9). | Ranked leak list in the root |
| A4 | Canon same-tick ordering fix (F39) as its own slice. | Ordering test plus legacy path |
| A5 | First inspector page from W27's list. | One page, read-only, desktop |

### More to consider on getting there (NX)

| Code | Angle | Do |
|---|---|---|
| NX1 | **Bundles don't merge.** W36 committed `dist/bundle.js` and the version hash in `index.html`; the shared branch moved since (`70291906` changed seeded streams). Merge source only, then rebuild on the merged tree. | ACCOUNT in A2 |
| NX2 | **Parity after the base moves.** W28's climate parity was proven on an older base; `seeded_streams` changed on the shared branch. Rerun W28 and W36 tests after the merge. | ACCOUNT in A2 |
| NX3 | **Shared index safety.** Other sessions stage files in the main checkout. Prove the merge in an isolated index first (R15 G10 method), never stash or reset. | ACCOUNT in A2 |
| NX4 | **First time the kit is visible in play.** The journey screenshots are what Weibao judges; director acceptance is separate from passing checks. | ACCOUNT |
| NX5 | **Legacy dates look bland** ("year 1, month 1"). Honest for now; the next visible upgrade is a sourced local name (MoL "Chariot" is dossier-qualified per W34) once adopted by a profile revision. | LATER |
| NX6 | **Removing Wet in Paradise is a gameplay change.** An already-active Wet effect on an old save simply expires; no migration needed, but the journey should load an old save in Paradise to confirm. | ACCOUNT in A1 |
| NX7 | **No offline catch-up claims.** Skipped-day summaries in the log describe played time only; the away ledger is not integrated. | ACCOUNT |
| NX8 | **Cards are now stale.** W19 cards predate W21-W37. Refresh them in one consolidation lane after W37, not piecemeal. | LATER (card refresh lane) |
| NX9 | **Merge sweep before the next wave.** 31 unmerged branches remain; per the standing rule, their owners merge gate-passing ones before the next Codex wave. | LATER, owners |
| NX10 | **Readiness trend.** Record today's baseline (K19-K34 runtime 0 met of 288) so the next audit shows movement (RA7). | NOW: recorded in this row |
| NX11 | **This root is long** (about 1,900 lines). The topic map helps; the next run should start a dated successor file and link back rather than keep appending. | LATER, next run |
| NX12 | **Fidelity before breadth.** After A1-A3, the cheapest real depth gain is fixing leaks and placeholders in the two native worlds that already play (MoL, Paradise), before adding parts to unbuilt worlds. | ACCOUNT |

