# The cheat library: cheats as gameplay (proposal, 2026-10-10)

Weibao: "That's a type of gameplay unlocked by that type of cheat. So now
we have types of gameplay taken by type of cheat? So accordingly, would we
have a 'cheat library' to draw from in the future? A lot of things can
possibly run from a cheat."

**The idea:** a cheat is more than a power. It brings its own loop: new
verbs, resources, screens and pacing. The Primordial Saint Sect's Book of
a Hundred Lifetimes turns a life into a run-based game with a death menu
and save points; a system turns it into a quest game; a harvesting cheat
turns it into a hunt. A **cheat library** holds these as reusable cards
that worlds, origins, enemies, items and events draw from.

Builds on [cheat cosmology](CHEAT_COSMOLOGY.md) (placement cards, backing,
patron terms), [cheats by world](CHEATS_BY_WORLD.md) (95 cheats from our
notes) and the [rulebook](RULES_FROM_SCRATCH.md). Everything here is a
proposal.

## Gameplay by cheat family

| Cheat family | The loop it adds | New verbs | New resources | Screens it needs | Book and game examples |
|---|---|---|---|---|---|
| Death-menu regression | Live, die on purpose or by accident, choose what carries, restart from an anchor | Choose carry slot, set anchor, die deliberately, reroll | Pages or lives, anchors, carry slots | Death menu, anchor list, restart screen | Primordial Saint Sect's Book; Regressor's Tale; Reverend Insanity's Cicada |
| Time loop | Repeat a fixed span, learning more each time | Reset, plan, test | Loop count, what persists | Loop timeline, notes across loops | Mother of Learning; You Have Died Again; Circle of Inevitability |
| System with quests | Accept quests, earn points, spend in a shop | Accept, claim, buy, level | Points, levels, stat points | Status window, quest list, shop | Solo Leveling; Fated Villain; Legendary Mechanic |
| Sign-in and daily rewards | Go places, check in, collect | Check in, travel | Daily rewards, streaks | Calendar, place list | Sign-in system stories |
| Multiplier return | Give to others, receive multiplied | Gift, choose recipients | Return pool | Ledger of gifts | 10,000x return stories |
| Harvest and absorb | Defeat or receive, absorb what they had | Kill, absorb, settle, fuse | Absorbed essences, talents | Absorption log, fusion panel | Primordial's Golden Natures; Paradise's Soul Eater; Skill Eater |
| Copy | Observe or touch, copy the ability | Observe, copy, slot | Copy slots | Copied list | Sharingan; download panel; Bookmark |
| Analysis | Scan, simulate, optimize | Scan, simulate, plan | Data, samples | Analysis readouts | Warlock's A.I. Chip |
| Storage and space | Store, preserve, smuggle | Store, retrieve, hide | Capacity | Inventory space | Soldier's Life imprint; pocket farms |
| Time dilation | Spend more time than the world does | Enter room, train | Dilated hours | Practice room | Renegade Immortal's bead |
| Fortune and fate | Shift luck, steal fortune, avoid backlash | Plunder, protect, read fate | Fortune points | Fortune readout | Fated Villain; Reverend Insanity's luck theft |
| Companion or resident spirit | Bond with an advisor, feed it, follow its advice | Ask, feed, trust | Bond, the spirit's power | Spirit's voice in the log | Ring grandpa; Yan Ji's ring spirit; technique personas |
| Summon and army | Recruit the dead or summoned, command them | Extract, command, upgrade | Soldiers, slots | Roster | Solo Leveling's shadows; You Are Summoned |
| Clones and many selves | Run several bodies at once | Split, assign, merge | Bodies, attention | Body roster | Blood Clone; five soul clones; Dao Body split |
| Follower power | Followers' growth feeds you | Recruit, audit, reward | Followers, merit, incense | Palace or sect ledger | Primordial's god-sealing palace; disciple-return systems |
| Wish or edit | Spend a quota to change facts | Wish, pay | Daily quota, payment | Wish list | Wish Upon the Stars |
| Knowledge of the future | Act on what you know will happen | Predict, prepare, exploit | Foreknowledge (decays) | Notes on the future | Legendary Mechanic; Omniscient Reader; regressors |
| Meta or fourth wall | Act outside the story's rules | Read, block, borrow | Understanding | Character list | Omniscient Reader's Fourth Wall |
| Body growth | Grow by eating, training or evolving | Eat, evolve, adapt | Evolution points | Evolution tree | Monster starts; A Novel Concept's adaptation |
| Revival | Die and come back on a schedule | Die, revive, adapt | Charges | Revival timer | A Novel Concept's daily revival |
| Building or territory | Build, and the building grants power | Build, expand, defend | Materials, territory | Base view | Territory systems; dungeon cores |

**Many things can run from a cheat.** Beyond powers, a cheat can supply:
the run structure (regression), the economy (shop, points), the social
loop (followers, companions), the map (sign-in places, anchors), the
combat style (summons, copies), the information layer (analysis,
foreknowledge), and even the UI (a status window as the main screen).

## What a library card holds

Each cheat in the library is one card. It extends the
[placement card](CHEAT_COSMOLOGY.md#the-placement-card) with gameplay:

1. **Identity and placement:** family, backing, scope by feats, patron
   terms, home and outside behavior (from the placement card).
2. **The loop it adds:** verbs, resources, screens, pacing.
3. **Hooks it uses in the engine:** for example on-death, on-kill,
   on-day-start, on-travel, on-gift, on-observe, on-level.
4. **Numbers and dials:** charges, slots, rates, caps, and the ways past
   them.
5. **Growth:** how it develops, including stages that unlock new verbs
   (the Book gained anchors and a fusion page).
6. **Interactions:** meeting rules with other cheats and world laws.
7. **Observers:** who can sense it and how.
8. **Variants:** sibling cheats from other books and original versions
   for the public build.
9. **Who can hold it:** the player, an NPC, a rival, an item, a place.
10. **Sources:** book or game references, labelled shown, stated or
    inferred.

## How the library is used

- **Origins:** a new life can roll or choose a cheat from the library.
- **Worlds:** a world card lists the cheats native to it (Paradise's
  contracts, a cultivation world's Gu).
- **Enemies and rivals:** NPCs draw cheats too, so a rival regressor uses
  the same death-menu card from the other side.
- **Items and places:** a cheat can live in an object (the Cicada, the
  Book, a ring) or a place (a practice room, a sign-in shrine), so it can
  be found, stolen, inherited or lost.
- **Events and rumors:** a cheat can be introduced as a rumor first, then
  an item, then a full cheat (the trope pacing rule).
- **Shops and trades:** system shops and hubs sell cheats or fragments.
- **Fusion and fragments:** cards can merge, split into fragments, or
  devour each other.

## Building it (proposal, not started)

- **Shared engine hooks, few and general:** on-death, on-kill, on-day,
  on-travel, on-observe, on-gift, on-level, on-restart. Each cheat is
  data that subscribes to hooks, not a new module per cheat.
- **Shared screens:** the death menu, anchor list, status window, shop,
  roster and ledger are reusable panels inside the original UI.
- **Start with three cards** that cover different loops: a death-menu
  regression (from the Primordial audit), a quest system, and a
  companion spirit. Each one should be playable in the home world.
- **Grow the library with every audit:** the intake in
  [cheat cosmology](CHEAT_COSMOLOGY.md#placing-new-cheats-as-book-worlds-arrive)
  now also asks "what loop does it add, and which hooks does it need?".

## More to consider

- **Cheats that change genre:** a regression cheat makes a life a
  roguelite; a territory cheat makes it a city builder; a system makes it
  a LitRPG; a companion spirit makes it a mentor story.
- **Stacking cheats stacks loops,** which can be wonderful or exhausting.
  Each card should say how it shares the screen with others.
- **Losing a cheat removes its loop:** a life that loses its system goes
  back to ordinary play, which can be a dramatic turn.
- **Cheats with no loop:** some cheats are pure passives (perfect memory)
  and need no screens; the library marks those as "quiet".
- **NPC use teaches the player:** seeing a rival use a cheat is how the
  player learns what that card can do before holding it.
- **Original cheats for the public build:** every book-derived card gets
  an original sibling with a new name and fiction.
- **A cheat's own lore:** where it came from, who held it before, what it
  wants. The Book's origin had competing accounts; a library card can
  hold several.

## More cheat types (2026-10-10)

Weibao: "we can expand the cheat types and more." Twenty-four more
families, each with the loop it adds.

| Cheat family | The loop it adds | New verbs | New resources | Examples or tropes |
|---|---|---|---|---|
| Appraisal eye | Read everything first, then choose | Inspect, compare, expose | Insight, eye grade | Library of Heaven's Path's flaw sight; Nine Eyes |
| Absolute knack | One word that always holds | (Passive) | None; edges found by testing | "Never gets lost", "always lands on your feet" |
| Language and speech | Talk to anyone or anything | Speak, translate, persuade | Languages known | Speaking to beasts, objects or the dead |
| Instant teaching | Teach others perfectly | Teach, grade students | Students, their growth | Disciple-return systems |
| Perfect crafting | Every craft succeeds or exceeds | Craft, refine, invent | Recipes, quality grades | Perfect-pill alchemist stories |
| Duplication | Copy items at a cost | Feed, copy | Copy fuel | I Shall Seal the Heavens' copper mirror |
| Body swap and possession | Live in other bodies | Swap, possess, return | Hosts | Fated Villain body swaps; ghost starts |
| Shapeshift | Become what you've seen or eaten | Transform, mimic | Forms | Monster mimic stories |
| Contract and bargain | Make binding deals | Offer, bind, enforce | Contracts, leverage | Paradise contracts; devil pacts |
| Debt to the future | Borrow from your future self | Borrow, repay | Debt, interest | Original idea; ties to Gluttony's future self |
| Karma bank | Good and bad deeds as currency | Bank, spend, cleanse | Karma | Karma systems |
| Dream walking | Act in dreams | Enter, plant, steal | Dream time | Shadow Slave's Dream Realm; Inception-style |
| Divination | See likely futures | Ask, interpret | Questions per day, clarity | Dinah in Worm; Lord of the Mysteries' divination |
| Outcome selection | Try branches, keep the best | Split, choose | Branches | Coil in Worm |
| Checkpoint save | Save and load in-world | Save, reload | Save slots | You Have Died Again; Re:Zero-style return |
| Talent lottery | Roll for talents regularly | Draw, keep, discard | Draws | Yearly trait draws (running TTKS lane) |
| Inheritance system | Receive ancestors' or strangers' legacies | Claim, test, absorb | Legacies | Reverend Insanity inheritance tests |
| Title collector | Earn titles with effects | Earn, equip | Titles | A Novel Concept titles; litRPG titles |
| Achievement system | Deeds pay rewards | Do, claim | Achievement points | Gamer-system stories |
| Notice-me-not | Nobody pays attention to you | Slip by, observe | Attention (kept low) | Absolute stealth tropes |
| Charisma or aura | People are drawn to you | Inspire, recruit | Followers, devotion | Ruler and saint tropes |
| Reading growth | Grow by reading books | Read, absorb | Books read | Book-eater tropes; Mother of Learning study |
| Heroic spirit summoning | Call the dead heroes of a world | Summon, bond | Spirit slots | Kairos' ship of the dead; Fate-style |
| Pocket world | Own and grow a small world | Plant, populate, expand | World size, inhabitants | Fated Villain's inner universe; Primordial's loaned realm |

Added after the Virtuous Demon deep dive (proposal, 2026-10-10; see
[held systems](LIFE_SIM_NORTH_STAR.md#expanded-after-the-virtuous-demon-read-proposal-2026-10-10)):

| Cheat family | The loop it adds | New verbs | New resources | Examples or tropes |
|---|---|---|---|---|
| Parasite system | Generous rewards that steer you; win back your freedom | Accept, refuse, notice, bargain | Steer, autonomy | Virtuous Demon's Oracle of Yonder (quests, erased doubts, forced acts) |
| Sealed blessing | Carry a locked gift, grow into it or have it stolen | Train around it, unseal, guard | True grade (hidden), seal strength | Virtuous Demon's sealed SSS+ swordsmanship |
| Narrow curse | One exact combination is blocked; pay to force it | Avoid, override at a cost | Blood price, workaround mastery | Sword plus Qi grows blades from the body; a million-rep single cut |
| Threat sight | Rate everyone by danger to you, capped by your rank | Gauge, flag | Threat tags | A system's S-to-SSS threat gauge |

Total so far: 49 families. Families overlap and combine; the table is a
starting vocabulary, not a closed list.

## Implementation (proposal, from reading the code on 2026-10-10)

What exists that a cheat can build on (read, not run):
- **Sources and capabilities.** The content registry already has
  `sources`, `capabilities`, `techniques`, `rollTables` and `actions`
  (`createContentRegistry`, `src/expansion_engine.js`), and each actor has
  `sources` in state. A cheat card can be a **source** whose capabilities
  and techniques it grants, with its own saved state (charges, slots,
  anchors) under `actor.sources[cheatId]`.
- **Actions and commands.** Cheat verbs become actions or simulation
  commands (`commitAction`, `commitSimulationCommand`), so they use the
  existing cost, requirement and validation paths.
- **Time boundaries.** Daily and periodic effects can ride
  `advanceSimulationBoundary` (`src/simulation.js`).
- **Rolls.** Lotteries, rerolls and random next lives use roll tables on
  the seeded RNG, so reloads don't reroll.
- **Death and the next life.** The chronicle and `buildLifeHeirSave`
  (`src/life_experience_host.js`) already build a new life from a dead
  one. A death menu is a choice applied there: which slot carries into the
  new save.
- **Observation.** Capability queries (`src/capabilities.js`) are the
  natural place for "who can sense this cheat".

Code audit of what exists, what is missing, risks and build order: [cheat implementation audit](audits/cheat-implementation-2026-10-10/REPORT.md). Simulators in depth (engines, modes, honesty, keeps) and every pilot cheat family mapped to engine pieces: [simulators and cheat implementation](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md).

**Proposed shape of a card in data:**
- `id`, `family`, `backing`, `terms` (patron terms), `scope`.
- `grants`: capabilities, techniques, actions.
- `hooks`: a small fixed set the engine calls: `onDayBoundary`,
  `onAction`, `onKill`, `onDeath`, `onRestart`, `onTravel`, `onObserve`,
  `onGift`, `onLevel`. Each hook entry is data (conditions and effects),
  not code, wherever possible.
- `state`: what the card stores (charges, slots, anchors, fuel).
- `stages`: growth steps and what each unlocks.
- `observers`: who can sense it.
- `ui`: which shared panel it uses (death menu, status window, roster,
  ledger, shop), or "quiet".

**Phased plan (each phase ends in a browser check from a fresh origin,
plus save, reload and import when state changes):**

| Phase | What | Playable result |
|---|---|---|
| C0 | Card schema, validator, save field with migration | Nothing visible; old saves load |
| C1 | A quiet cheat (an absolute knack) through capabilities only | A start that "never gets lost" finds hidden places |
| C2 | Death-menu regression on the heir pipeline | Die, choose a carry slot, wake with it |
| C3 | Quest system with a status window panel | Accept and claim quests for points; spend them |
| C4 | Companion spirit in the log | A voice that advises, asks to be fed, and grows |
| C5 | Hooks for kill, gift and observe | Harvest, multiplier return and appraisal cards become possible |
| C6 | Library browser for the player's known cheats | The notebook lists cheats met, held or rumored |

Code gates: C2 changes the heir flow that is built today, so it replaces
the "one lesson" heir with the accepted "inherit what was left" plus the
death menu; that's a gameplay change needing Weibao's go.

## A good progression loop for cheats

**A cheat's own arc, inside a life:**
1. **Dormant or hidden:** the cheat exists but hasn't woken, or the holder
   doesn't know what it is.
2. **Awakening:** a trigger (first death, a near-death, a ritual, an
   age) reveals it.
3. **Learning its rules:** tests, mistakes and anti-feats fill the
   notebook. The player discovers limits by hitting them.
4. **Early use:** small, clear wins; the limits are felt.
5. **Growth:** fuel and milestones unlock new verbs (the Book gained
   anchors at Foundation and a fusion page at Golden Core).
6. **Evolution:** fusion, devouring, a tier-up, or a breakthrough that
   changes what it is.
7. **Mastery:** exceptions and permissions (a reroll, an override).
8. **Exposure:** observers notice; rivals and patrons react.
9. **Resolution:** the cheat becomes part of you, is stolen, sealed or
   outgrown, or carries into the next life by its backing.

**How it fits the bigger loops:**

| Scale | What the cheat gives | What the player feels |
|---|---|---|
| Moment | A verb that bends a rule | "I can do that?" |
| Session | Fuel spent and earned; a small limit found | Steady gain |
| Season | A new stage and a new verb | A power spike |
| Life | Evolution, mastery, exposure | A story arc |
| Lineage | Carry by backing; a new cheat in the next life | Variety across lives |
| Multiverse | Fusion with other worlds' cheats; meeting other holders | Breadth |

**What makes it good (proposal):**
- **Every scale has a visible gain:** something per session, a new verb
  per season, a turning point per life, something new per lineage.
- **Growth adds verbs, not only numbers.** New ways to play beat bigger
  multipliers.
- **Limits are found, not stated,** and each limit has ways past it.
- **The world pushes back** through observers, rivals and patrons, so
  power has consequences (rule 11).
- **Cheats don't solve everything:** each covers some paths and leaves
  others to ordinary play, so other systems stay meaningful.

**Watch out for:**
- **Stacked loops overwhelming the screen:** quiet cheats and a shared
  panel help.
- **A cheat that makes ordinary play pointless:** contrast keeps it
  meaningful (somewhere you're the monster, somewhere you're nobody).
- **Front-loading:** a cheat that's fully powerful at birth has nowhere
  to grow; start it dormant or narrow.

## Enemies with cheats (2026-10-10)

Weibao: "consider how enemies would have cheats." Builds on the north
star's [enemy powers](LIFE_SIM_NORTH_STAR.md#enemy-powers-and-how-they-work-proposal-2026-10-08)
(enemies run on the same framework; every power has a tell, a counter and
a cost), [enemy reincarnators](LIFE_SIM_NORTH_STAR.md#enemies-who-are-reincarnators-regressors-and-transmigrators-proposal-2026-10-08)
and [enemy protagonists](ENEMY_PROTAGONISTS.md).

### Same cards, other side

Enemies draw from the same library. Each family gets an **NPC policy**:
how a holder behaves, what makes it dangerous, and how to beat it.

| Family | How an enemy holder behaves | What makes it dangerous | Ways to beat it |
|---|---|---|---|
| Death-menu regression | Retries until it wins; dies on purpose to reset | It learns from every loss | Make its knowledge stale; capture instead of kill; find and break its anchor; take the Book |
| Time loop | Repeats a span, learning your patterns | It knows your moves | Act unpredictably; leave the loop's area; recruit it |
| Quest system | Follows quests, sometimes with you as the target | Rewards push it toward you | Corrupt or satisfy the quest; remove the host from the system |
| Harvest | Hunts people whose essence is valuable | You and your allies are prey | Seal or hide essence; bait it; deny it kills |
| Copy | Copies your best skill | Your own strength used against you | Show it fakes; use what it can't copy |
| Fortune theft | Drains your luck before fighting | Everything goes wrong for you | Protection, backlash, cutting the link |
| Summon and army | Brings the dead or summoned in numbers | Numbers and loyalty | Cut the link; free the summoned |
| Clones | Is in many places at once | No single kill ends it | Find the core body; overload coordination |
| Divination | Pre-empts your plans | It's always ready | Randomness, chaos, decisions made at the last moment |
| Appraisal eye | Exposes your hidden layers to others | Your secrets become public | Concealment; false readings |
| Contract | Binds you through deals | You agreed to it | Read the terms; find the loophole; a higher authority |
| Dream walking | Attacks while you sleep | No safe rest | Wards, sleepless methods, fighting inside the dream |
| Pocket world | Pulls you into its home ground | Its rules, not yours | Break the world's anchor; outlast it; take it over |
| Charisma | Turns your allies | Your side shrinks | Loyalty built earlier; exposing it |
| Body swap and possession | Takes your body or a friend's | Identity theft | Soul checks; anchors; knowing your friends' habits |
| Debt to the future | Borrows power now | A huge spike | Survive until the bill comes due |

### What happens when a holder falls

Depends on the card's backing (from [cheat cosmology](CHEAT_COSMOLOGY.md#the-key-to-portability-what-backs-a-cheat)):
- **Item:** it drops and can be looted, stolen or fought over.
- **Soul:** it leaves with the soul and comes back with its next life.
- **System:** the system picks a new host, maybe you, maybe your rival.
- **Body or bloodline:** it passes to the holder's descendants.
- **Patron:** the patron takes it back or gives it to someone else.
- **Fragments:** it breaks, and the pieces scatter (see fragments of power).
- **It dies with them,** when nothing carries it.

### Enemy cheats over time

- **Enemies go through the same stages** as the player's cheats: dormant,
  awakening, learning, growth, mastery. An enemy met early is beatable;
  the same enemy years later may not be.
- **Off-screen growth** follows the coarse yearly simulation: rivals'
  cheats advance while you're away.
- **Exposure gives tells:** the more an enemy uses a cheat, the easier it
  is to read and counter.
- **Enemies learn from you:** a copier copies your build; a regressor
  remembers your counter.

### Who hunts cheaters

- **Institutions:** churches, heavenly wills, cosmic police, rival hubs,
  a sect that seals cheats.
- **Anti-cheat cheats:** detection, sealing, stealing, mirroring.
- **Other holders:** two holders of the same card compete for the same
  fuel (two Books, two systems), like the Primordial rival who restarts by
  diary.
- **Your own past:** an enemy holding a cheat stolen from your previous
  life.

### Variety and fairness

- **Not every enemy has a cheat.** Ordinary enemies, monsters and armies
  stay common; cheat-holders are rarer and memorable.
- **The storyteller budgets them:** how many cheat-holders a world
  introduces, and when, by world and difficulty.
- **Information is fair:** each enemy cheat has at least one tell, found
  through the observation contest, a survivor's story, or losing once and
  living.
- **Outliers exist:** an enemy whose cheat has no known counter yet is
  allowed (rule 12); finding the way around is the quest.
- **Cheats that hurt their holders:** some enemies are victims of their
  own cheats, which opens rescue, recruitment or mercy as routes.
- **Enemies who don't know:** a cheat that acts on its own through
  someone unaware of it.

### Implementation (proposal)

- **Same card schema** for NPCs, plus a `policy` per family: targeting,
  when to use it, retreat rules, how it learns.
- **Coarse off-screen use:** once per simulation boundary, an NPC holder's
  card advances its stage and logs deeds as rumors.
- **On-screen use:** through the existing encounter-and-pursuit system and
  native combat, with the cheat's verbs as enemy actions.
- **Deterministic:** enemy cheat decisions use the seeded RNG, so reloads
  don't change them.
- **First enemy cards (proposal):** a rival regressor (pairs with the
  player's death-menu card), a harvester hunting a specific essence, and
  a system holder whose quest targets the player.

## Player-side mechanics as in-world cheats: idea cards (2026-10-10)

Weibao: "yes turn them into idea cards." Source: the 23 player-layer
rows in [game cheats](CHEATS_BY_WORLD.md#game-cheats-2026-10-10-codex)
and Codex's five options (A1 to A5) in its
[games report](gm/dispatch/cheat-cosmology-gaps-2026-10-10/GAMES_REPORT.md#making-player-layer-facilities-diegetic).
Claude wrote the cards. Everything is a proposal.

These are mechanics that belong to the player in their source games:
save and reload, offline progress, prestige, legacy, seeds, blueprints.
Each card makes one into something a character can hold, find, lose or
fight over. Following both Codex reports, every card names its
**carrier** (what physically holds it) separately from what it does,
and the conditions it needs to work.

Names are working names for original versions. Every card has
stronger and weaker variants; the dials pick them per world.

### 1. Echo Anchor (save and reload)

- **Promise:** try again, knowing what went wrong.
- **From:** save-scumming; ONI's full snapshot; Planescape's return;
  Increlution and Idle Loops' restarts.
- **Form and carrier:** a stone you set at a place. It records a
  declared area (a room, a valley, your own body) at that moment.
  Carrier: the stone plus your memory.
- **Verbs:** set, return, choose what to carry back, break.
- **Limits:** only the declared area resets; anything outside keeps
  moving. One anchor at a time, or a charge per return.
- **Who notices:** people who meet you twice say you seem rehearsed.
  Time-sensitive beings feel the scar each return leaves.
- **Enemy version:** a rival who remembers the fight you've only had once.
- **Variants:** wounds or debts stay; a pursuer remembers too; a broken
  anchor leaves you stuck in the loop.
- **Small touch:** a friend finishes your sentence the third time.
- **Test:** the first return is clearly smaller than "undo everything",
  and at hour 50 choices still matter.

### 2. Patient Furnace (offline progress)

- **Promise:** grow while you're away.
- **From:** Melvor's catch-up ticks (24-hour cap); Bitburner's estimate
  from past activity; Upload Labs' stored away-time; Increlution's
  catch-up that can kill you.
- **Form and carrier:** a cultivation method, or a routine you hand to
  a hired helper or spirit. Carrier: the method in your body, or the
  helper.
- **Verbs:** assign, stock, pause, settle up on return.
- **Limits:** runs out of fuel or supplies; can't do anything new or
  social; a cap per absence.
- **Who notices:** whoever guards your sleeping body. An unguarded
  furnace is a target.
- **Variants:** you age while it runs; gains bank as stored hours you
  spend later (Upload Labs) instead of arriving at once.
- **Small touch:** a return note names what stopped it ("the charcoal
  ran out on day two").
- **Test:** the first return shows gains, costs and why it stopped.
  Long play still rewards learning and people over waiting.

### 3. Heirloom Compact (legacy and succession)

- **Promise:** your past life helps the next one without making a copy.
- **From:** Rogue Legacy's heirs and manor; Sunless Sea's successor
  getting a share of stats, goods or the chart; Skies keeping the
  locomotive; Cultist Simulator's next origin after an ending.
- **Form and carrier:** a will, a workshop, a family name. Each thing
  passed needs its own carrier: goods in a vault, methods in a teacher,
  rights in an institution.
- **Verbs:** bequeath, name an heir, claim, dispute.
- **Limits:** heirs are different people with different builds.
  Creditors and enemies inherit too.
- **Who notices:** rival claimants, tax collectors, old enemies.
- **Enemy version:** a dynasty that hands down a grudge against you.
- **Small touch:** the heir uses one inherited tool their own way.
- **Test:** the first succession shows what survived and why.

### 4. Traveler's Pattern Book (blueprints and records)

- **Promise:** keep designs and lessons between lives and worlds.
- **From:** Factorio's blueprint library (G); NetHack's identification
  notes; Book of Hours' manuscripts.
- **Form and carrier:** a book or a trained memory palace. It holds
  designs, not materials or skill.
- **Verbs:** sketch, inspect, test, teach, rebuild.
- **Limits:** a design from another world may need ingredients or laws
  that don't exist here. Copies can be wrong.
- **Who notices:** guilds that want the book; thieves who can copy it.
- **Variants:** a prodigy version copies anything seen once; a cursed
  page builds something else.
- **Small touch:** a margin note records a substitute that failed.
- **Test:** the first imported pattern enables one action and shows
  clearly what's missing.

### 5. Seed Cartographer (seed foreknowledge)

- **Promise:** know the shape of things before you get there.
- **From:** Noita's seed tools for secret recipes; Rogue Legacy's
  Architect reusing a castle; Sunless Sea passing on a chart.
- **Form and carrier:** a chart, an oracle or a sense for a world's
  pattern. It knows the layout, not the people.
- **Verbs:** read, test, annotate, reroute.
- **Limits:** goes stale when the world changes; people and events
  aren't on the chart.
- **Who notices:** the world itself, in worlds that resent being read.
- **Variants:** one region only; one event only; a chart that shows the
  last holder's route and where they died.
- **Small touch:** an old chart with an ingredient crossed out.
- **Test:** the first verified clue feels earned, and at hour 50 you
  still have to look.

### 6. Rebirth Ledger (prestige multipliers)

- **Promise:** start over stronger, and see exactly how much.
- **From:** Idling to Rule the Gods comparing four multipliers before
  Rebirth; Progress Knight's per-job carry bonuses; Magic Research 2's
  run maxima feeding the next start.
- **Form and carrier:** a heavenly account book, a reincarnation office,
  a scar on the soul that counts. Carrier: the soul or the office.
- **Verbs:** review, choose when, choose what to keep, sign.
- **Limits:** the bonus is for what you did, not what you hold; the
  office keeps a cut; some debts follow you.
- **Who notices:** the office's clerks, who can be bribed or audited.
- **Variants:** a ledger you can forge; one that charges interest; a
  rival who rebirths on the same schedule.
- **Small touch:** the clerk remembers your last three lives.
- **Test:** the choice to rebirth is a real decision, not a button.

### 7. Instinct Inheritance (what survives the reset)

- **Promise:** your body remembers what your mind forgets.
- **From:** Increlution keeping instinct and base health while normal
  progress resets; Idle Loops keeping talents and town knowledge.
- **Form and carrier:** a deep layer of the soul or bloodline that keeps
  a little of each life. Carrier: the soul.
- **Verbs:** none directly; it grows by living and dying.
- **Limits:** slow, small, and you can't choose what sticks.
- **Who notices:** masters who see a novice move like a veteran.
- **Small touch:** a child flinches from a fire they've never seen.
- **Test:** the gain is felt in the second life without making the
  first one pointless.

### 8. Earned Habit (automation)

- **Promise:** what you've done enough times does itself.
- **From:** Increlution unlocking automation for a task after repeated
  completions.
- **Form and carrier:** a habit spirit, a trained body, a disciple who
  watched you. Carrier: whichever one learned it.
- **Verbs:** repeat until learned, delegate, adjust, revoke.
- **Limits:** only for things done many times; habits can't adapt to
  something new; bad habits learn too.
- **Who notices:** people who exploit your predictable routine.
- **Small touch:** you wake to find the chores already done.
- **Test:** automation frees attention for new things instead of
  ending the game.

### 9. Fate Steward (incident director)

- **Promise:** tilt which troubles come your way.
- **From:** RimWorld's storyteller choosing and filtering incidents.
- **Form and carrier:** a patron, a luck bargain or a minor god of
  happenings. Carrier: the patron, so the patron rules apply.
- **Verbs:** petition, offer, refuse a fate, owe.
- **Limits:** it shapes what's possible, not what happens; it has its
  own tastes; a refused fate comes back changed.
- **Who notices:** seers, and other stewards with their own favorites.
- **Enemy version:** a rival's steward sends you the troubles theirs
  avoided.
- **Small touch:** the raid that came was smaller than the omen.
- **Test:** the player feels their petitions matter without choosing
  events from a menu.

### 10. Loaded Dice (roll override)

- **Promise:** once in a while, the roll goes your way because you said so.
- **From:** Disco Elysium's debug roll override (code only, not in
  play).
- **Form and carrier:** a fate thread, a gambler's coin, a blessing.
  Carrier: the item or patron.
- **Verbs:** call a result, pay for it.
- **Limits:** charges, rising cost, and the world's luck balances later.
- **Who notices:** luck readers; anyone who sees too many perfect rolls.
- **Small touch:** the coin is warm after you use it.
- **Test:** one called roll feels huge; spamming it feels costly.

### 11. Hall of Selves (character switching)

- **Promise:** live more than one life and switch between them.
- **From:** Theory of Magic's Hall keeping each character's progress
  apart from prestige; Tales of Maj'Eyal profile unlocks shared across
  characters.
- **Form and carrier:** a hall, a soul split, a set of bodies.
  Carrier: the hall or your soul.
- **Verbs:** enter, switch, share one thing, leave a self behind.
- **Limits:** idle selves stop or drift; sharing between them is narrow;
  selves can disagree.
- **Who notices:** people who know two of your selves.
- **Links:** [selves and echoes](SELVES_AND_ECHOES.md).
- **Small touch:** one self leaves a note for another.
- **Test:** switching gives a different life, not a stronger one.

### 12. World Deeds (account unlocks)

- **Promise:** what one life achieved opens doors for the next.
- **From:** Tales of Maj'Eyal unlocking classes and races by deeds;
  Bitburner's Source-Files after a BitNode.
- **Form and carrier:** the world remembers, through a record, a
  legend or a changed law. Carrier: the world, not you.
- **Verbs:** achieve, be remembered, claim a legend.
- **Limits:** only works in that world; legends can be stolen or
  retold wrong.
- **Who notices:** everyone, eventually; that's the point.
- **Small touch:** a statue of your old self, slightly wrong.
- **Test:** the unlock feels earned by a past life and fits the
  world's memory.

### What the cards share

- **Carrier first.** Each says what holds the power, so the
  [backing table](CHEAT_COSMOLOGY.md#the-key-to-portability-what-backs-a-cheat)
  and the [time cheat kinds](CHEAT_COSMOLOGY.md#time-cheats-by-how-they-work)
  can place it. Echo Anchor is a checkpoint; Rebirth Ledger is a world
  rebuilt with you carried.
- **The player still has their own save.** These cards are in-world
  powers. The real save file stays outside the fiction unless a world
  says otherwise.
- **Enemies get the same cards** with their own carriers and tells, per
  [enemies with cheats](#enemies-with-cheats-2026-10-10).

## Acquiring cheats: routes, rarity and types (considerations, 2026-10-13)

Weibao: "optional start, more to consider for acquiring cheats?" then "make it
an optional start, keep everything possible, random possibility, other stuff
and more? Types of cheat too? Very rare? Not so rare? starts by being
researched? more optiobs and more?"

Related same-day owners: [feature unlock and acquisition process](worlds/FEATURE_UNLOCK_AND_CHEAT_ACQUISITION_PROCESS_2026-10-13.md) and [first cheats and death rewards](worlds/FIRST_CHEATS_AND_DEATH_REWARDS_2026-10-13.md) (D1 recommends random circumstances with an authored, reachable early opportunity rather than an unavoidable powerful grant, consistent with the dormant seed below).

Decision: the **first playable route is an optional start** (the player picks
a system cheat when beginning a life). Every other route below stays possible
and is a palette, not a spec. Rarity is a per-world adjective, never a fixed
global rule (see solo-player, no "once" limits).

### Routes (AQ)

| Code | Route | Feel | Notes |
| --- | --- | --- | --- |
| AQ1 | **Optional start** | Chosen at a new life: "begin with a system" | First build. Player picks a card or a family, or "surprise me" |
| AQ2 | Random at start | A rolled start may include a cheat | Odds per world adjective; can be off |
| AQ3 | Random awakening mid-life | A trigger rolls: near-death, first death, an age, a full moon | The library's "Awakening" step; the roll and odds shown only after it happens |
| AQ4 | **Researched** | Study, experiment, reverse-engineer until it works | A knowledge chain (TECHNOLOGY TK/TN): partial versions, failed builds, a lab notebook; slow and earned |
| AQ5 | Taught or granted | A patron, sect, teacher or AI gives it | Patron terms apply (gift, lease, loan, lien, leash) |
| AQ6 | Found item | A ring, book, device, egg that holds it | Can be lost, stolen, traded unless bound |
| AQ7 | Bought or bargained | A hub shop, a devil's deal, a black market | Price can be more than money: years, memories, a debt |
| AQ8 | Stolen or harvested | From a holder, an enemy, a corpse | Observers and consequences; the ethics are visible |
| AQ9 | Inherited | From a parent, a previous life, an heir chain | Ties to the heir pipeline and what carries over |
| AQ10 | Contracted or fused | Merging two partial cheats, or a bond with a being | Library "Evolution" step |
| AQ11 | Earned by deed | A title-style unlock after a feat ("survive 100 days alone") | Visible goals or hidden ones per world |
| AQ12 | Spread or contagious | Caught from an event, a meteor, a plague of systems | World-level cosmic events |
| AQ13 | Mistaken identity | You hold someone else's cheat, delivered to the wrong person | Comedy or dread; the real owner may come looking |
| AQ14 | Debug or authoring | A test start for fixtures and creative play | Labeled; never presented as natural |

### Rarity dials (per world, adjustable)

| Dial | Values |
| --- | --- |
| How common | none, mythic (one in a world), very rare, rare, uncommon, common (everyone awakens one) |
| Who knows | secret, rumored, known to experts, public |
| How you learn it's real | instant system message, slow evidence, someone tells you, you never quite know |
| Odds shown | never, after it happens, always |

Common-cheat worlds (everyone has a system) change society: schools, rankings,
cheat-based jobs, crime. Very rare worlds make a holder a target. Both fit,
per world.

### Types to offer at the optional start (first set)

From the library families: system with quests (status window, CH1), death
regression, simulator/foresight, companion spirit, appraisal lens, multiplier
or harvest, a quiet knack (absolute direction, perfect memory), a hub
contract. The first start offers **the system with quests**, since CH1 is
its panel; others join as their panels land.

### Start screen details

- Options: pick a specific card, pick a family, "surprise me" (rolled by the
  chosen world's rarity), or "no cheat".
- Show what the card adds, its costs and limits as known; sealed details
  stay sealed.
- Strength dial for a chosen start: humble, standard, strong. A rolled start
  can land anywhere.
- An "I don't know what I have" variant: the cheat is held but unidentified
  until its first message (AQ3 feel inside AQ1).
- The choice is recorded in the life record and can be inherited or lost
  like any other fact.

### Unlocking the optional start, and keeping progression intact (2026-10-13)

Weibao: "more to consider for the optional start and cheat types? It might
hurt progression a little to give me cheats straight from the get go, maybe
I have to unlock it first, more to consider?"

The concern: a strong cheat at minute one skips the early game's learning
and makes ordinary progress feel pointless. Ways to keep the start optional
without that cost (all can coexist, per world):

**Unlock the option first (US)**

| Code | Unlock | Feel |
| --- | --- | --- |
| US1 | After a first life ends (death, retirement or heir) | Classic "new game+" door; the first life is always ordinary |
| US2 | After meeting a cheat in the world (an NPC holder, a rumor, a library entry) | You learn cheats exist before you can start with one |
| US3 | After researching it (AQ4) in an earlier life | The research notes become a start option |
| US4 | After an earned deed or title ("survive a winter", "reach level 10") | Achievement-style door |
| US5 | Per family: each family unlocks separately by its own meeting | Status window after a system holder; regression after first death |
| US6 | Always available, but only in "creative" or test starts | Labeled, for play and fixtures |

**Start with it, but not at full strength (ST)**

| Code | Shape | Feel |
| --- | --- | --- |
| ST11 | **Dormant seed:** chosen at start, awakens at a milestone (first fight won, day 3, level 1, a near-death) | You know it's coming; the early game stays ordinary |
| ST12 | Hidden seed: chosen, but you don't know which one until it wakes | Surprise without randomness at the door |
| ST13 | Grows from nothing: stage 0 does almost nothing; its loop grows with ordinary play | The cheat rewards the progression it rides on |
| ST14 | Costed start: taking a cheat trades away something (fewer starting coins, a debt, a patron's lien, a weaker body) | A real choice, not a free bonus |
| ST15 | Budget start: a few points to spend on cheat, talent, wealth or connections | Cheats compete with other boosts |
| ST16 | Noisy cheat: it draws observers or rivals early | Power with pressure |
| ST17 | Scaled to the world: a strong world needs a strong cheat to feel normal, a quiet world makes even a small one big | Rarity and strength are per-world dials |

**Cheat types that suit an early start (low skip risk)**

Quiet knacks (direction, memory), a status window that mostly informs
(knowledge, not power), a companion that advises, appraisal at a low grade,
a quest system whose points arrive slowly. **Late or unlocked types** (high
skip risk): death regression, foresight with exact odds, multipliers,
harvest, time stops.

**Progression guards worth keeping in any route**

- The cheat's own growth is gated by ordinary play (levels, skills, days).
- Early wins are small and clear; big verbs come at milestones.
- No retroactive skip: a cheat does not complete existing progress chains.
- Player dial: "cheat strength" humble / standard / strong per life.

**First build proposal (reversible):** the optional start offers the system
cheat as a **dormant seed (ST11)** that awakens on the first won fight or on
day 3, whichever comes first, with its first system message; the status
window is mostly informational at stage 0. The start option itself is visible
from the first life so it can be played and tested; US1-US5 unlock gates are
the next layer, toggled by a per-world dial.

### More to consider: the status window, unlock progress and random starts (2026-10-13)

Weibao: "more to consider for the status window? HOw to consider unlock
progress and other stuff ? random starts and more? more to consider?"
Palette, not specs. The running CH1 goal keeps its scope (stage 0,
informational).

**Status window: what it is and how it behaves (SW)**

| Code | Consideration |
| --- | --- |
| SW1 | **Stages:** stage 0 informs (level, stats, titles); stage 1 adds quests; stage 2 points and a shop; stage 3 skill slots or class; growth gated by ordinary play |
| SW2 | **Voice:** cold system text, the Clerk (bored, bribeable), a cheerful guide, a broken translation; per world and per card, with a setting to tone it down |
| SW3 | **What it can read:** only what the holder knows or the card's grade allows; unknown stats show as "??" or are absent (spoiler level per world, AJ9) |
| SW4 | **Accuracy:** honest, rounded, delayed, or wrong in a known way (a cracked window under-reads); "last updated" stamp |
| SW5 | **Quest sources:** generated from real state (reach level 2, learn a recipe, meet the elder's ask), never fake tasks; rewards are points, not raw power at early stages |
| SW6 | **Notifications:** level-ups, new titles, quest done, as system lines in the log; budgeted by ST6 |
| SW7 | **Interference:** jammed in a dead-magic zone, forged by a rival, goes dark when the system dies; the panel shows it rather than hiding |
| SW8 | **Who sees it:** private by default; some worlds let others read your window, or require you to show it (guild checks) |
| SW9 | **Comparisons:** show deltas since yesterday or last level ("+0.4 Strength"); a sparkline per stat |
| SW10 | **Exports:** a screenshot-style card of your status, for fun |
| SW11 | **Per world look:** crisp panels in a status-window world, ink in a Hanzi world, a terminal in sci-fi, through the L3 frame |
| SW12 | **When lost:** the panel stays as a memory ("last seen" values), greyed, with what you remember |

**Unlock progress (UP): how to show progress toward unlocking cheats or the optional start**

| Code | Consideration |
| --- | --- |
| UP1 | **Spoiler rule first:** progress toward an unlock shows only after the player knows the unlock exists (met a holder, read a rumor, researched) |
| UP2 | **Where it lives:** the cheat library tab (CH9) lists known unlocks with progress bars; unknown ones are absent, or a silhouette count if the world allows |
| UP3 | **Kinds of progress:** counters (days survived), checklists (meet three holders), research percentage (AQ4), chance-based (each near-death has an X% roll) |
| UP4 | **Chance shown or hidden:** per world dial: "the odds are unknown", "about 1 in 20", exact |
| UP5 | **Pity and guarantees:** optional soft pity (odds rise each roll) so a rare unlock isn't purely luck; per world |
| UP6 | **Carry across lives:** unlock progress is meta-progress (across heirs and new lives) or per life, per unlock |
| UP7 | **Partial unlocks:** research yields a weaker version first (a "beta" cheat) before the full one |
| UP8 | **Ways to speed it:** mentors, books, items, rituals; costs visible |
| UP9 | **Notifications:** "You sense you're close" style hints instead of numbers in mystery worlds |
| UP10 | **Never lose earned progress** to a reload or a UI mistake; failures cost time or resources, not records |

**Random starts (RS)**

| Code | Consideration |
| --- | --- |
| RS1 | **"Surprise me"** rolls from cards eligible for the chosen world and the player's unlocks, weighted by rarity dials |
| RS2 | **Roll result timing:** shown at start, at awakening, or never named (you figure it out) |
| RS3 | **Seeded runs:** a visible seed so a start can be shared or replayed; daily seed challenges |
| RS4 | **Rerolls:** free, limited, or costed (a debt, a weaker body); or "accept what you get" mode |
| RS5 | **Whole-start rolls:** cheat plus origin, family, place, era, talents rolled together (CAMPAIGN_FRAMEWORK random starting point) |
| RS6 | **Bad rolls are content:** a useless or harmful cheat (a curse-like system) can be its own story with a way to grow out of it |
| RS7 | **Duds and fakes:** a "system" that turns out to be a person, an AI, or nothing; detectable over time |
| RS8 | **Protect progression:** random strong cheats still start dormant (ST11) and grow with play |
| RS9 | **Record:** the roll, odds and seed go into the life record for later lives and the library |
| RS10 | **Player dial:** "random start" off / cheat only / everything |

**Other angles**

- **Cheats on NPCs:** the same cards held by NPCs and rivals, with their own status windows the player might glimpse.
- **Cheat-free mode:** a whole life with cheats disabled by choice, recorded as a feat.
- **Cheat stacking:** rules for holding two (conflict, fusion, one suppresses the other) from "When cheats meet".
- **Accessibility:** status window text readable by screen readers; numbers announced on change only when asked.

**Suggested next after CH1:** SW1 stage 1 (real quests from game state)
with SW5, then UP1-UP3 in the cheat library tab, then RS1-RS4 for the
"Surprise me" option once a second start card exists.

### More to consider: what counts as a cheat, the library tab and more types (2026-10-13)

Weibao: "more to consider for the cheat library tab?other types of cheats and
more? stuff should make sense accordingly based on the world and stuff?
normal status window isnt a cheat? more to. consider?"

**A cheat is relative to its world (WR)**

Right: a status window is not a cheat where everyone has one. "Cheat" means
an advantage beyond what the world gives ordinary people. The same power can
be a world law in one place, a rare gift in another, and an outright cheat in
a third. This pairs with the backing table above (world law, system, patron).

| Code | Consideration |
| --- | --- |
| WR1 | **Standing field per world:** each power has a standing: `world-law` (everyone, part of the world's interface), `common` (many have one), `rare-gift`, `cheat` (beyond the world's rules), `forbidden` |
| WR2 | **Status window by world:** in a system world it is the world's UI for everyone (a world panel, not a cheat card; NPCs have one too); in the native Village it is a cheat; in a cultivation world a "spirit sense" panel plays the same role as world law |
| WR3 | **The cheat inside a system world** is what goes beyond the shared system: hidden stats, admin access, a second class, seeing others' windows, an unpatched exploit |
| WR4 | **Standing changes when you travel:** modern knowledge is ordinary at home and a cheat in a medieval world; a world-law loop is blocked elsewhere; the library shows "here it is: …" |
| WR5 | **Social meaning follows standing:** world-law powers carry no suspicion; cheats draw observers, envy, regulation, theft |
| WR6 | **Panel follows standing:** the same status-window panel can be revealed by a world fact (world law) or by a held card (cheat); the panel kit card should allow both `discoveredBy` kinds |
| WR7 | **The optional start offers only true cheats** for the chosen world: a status window is a start option in the Village, but in a system world the option becomes "an extra" (WR3) |
| WR8 | **No universal rank:** standing and strength are judged against the world's baseline, as the cosmology's verse equalization already says |

**The cheat library tab (LB)**

| Code | Consideration |
| --- | --- |
| LB1 | **Entries by relation:** held, met (seen in someone), rumored, researched, lost; each labeled shown / stated / inferred |
| LB2 | **Standing column:** "In this world: world law / rare gift / cheat"; recalculated when you travel |
| LB3 | **What you know about it:** loop, costs, limits found by testing, anti-feats; blank where unknown (spoiler rule) |
| LB4 | **Holders you've seen** and what happened around them; rivals flagged |
| LB5 | **Unlock progress** (UP1-UP10) for entries you know can be unlocked |
| LB6 | **Hypotheses:** player notes and guesses ("I think the loop resets at dawn"), checked against evidence later |
| LB7 | **Filters:** family, backing, world, standing, relation; search |
| LB8 | **Comparisons:** two cheats side by side, including how they'd interact (from "When cheats meet") |
| LB9 | **Rumors can be false:** a rumored entry may be a misunderstanding or bait; it says so once disproven |
| LB10 | **Carries across lives** as knowledge (backing: knowledge), unless the world makes you forget |
| LB11 | **In-world forms:** a bestiary-style tome, a guild registry, a forum thread, a sect's forbidden catalog, per world |
| LB12 | **Sealed secrets:** entries tied to a sealed truth show only by ID and status until discovered |

**More cheat types (CT, additions to the 49 families)**

| Code | Type | Loop |
| --- | --- | --- |
| CT1 | Interface cheat | Game-like UI the world lacks: pause, map overlay, quest log, inventory grid |
| CT2 | Admin or debug access | Edit a value with a cost; the world pushes back (patches) |
| CT3 | Loophole finder | Sees exploitable rule gaps in laws, contracts, magic systems |
| CT4 | Anti-cheat | Detects, negates or steals other cheats; a hunter's power |
| CT5 | Nullification zone | Cancels powers nearby, including your own |
| CT6 | Boring perfect body | No sickness, perfect sleep, no hunger; small, life-sim friendly |
| CT7 | Skip the boring parts | Fast-forward routine time with averaged outcomes |
| CT8 | Small undo | Undo the last few seconds once a day |
| CT9 | Market sight | Sees true prices, demand and who is lying in trade |
| CT10 | Relationship sight | Sees affection, grudges and debts between people |
| CT11 | Probability readout | Shows odds on actions; can be wrong in a known way |
| CT12 | Borrowed competence | Rent a master's skill for an hour at a price |
| CT13 | Ghost observer | Leave the body to watch, vulnerable meanwhile |
| CT14 | Cross-world knowledge | Ordinary knowledge from another world, a cheat here (WR4) |
| CT15 | Mana or energy battery | Store surplus power for later; leaks over time |
| CT16 | Reputation editor | Rumors you start always spread; misuse backfires |
| CT17 | Weather or season sense | Knows the next days' weather and harvests |
| CT18 | Echo of a past life | Skills and memories surface in pieces, with personality bleed |

**Making sense per world (checklist)**

- Who in this world has powers, and what is ordinary here?
- What backs this power, and does it work here?
- What standing does it have here, and who would notice?
- What does it cost, and what stops it from skipping progression?
- What would a local call it, and what does their library entry look like?

**Suggested next:** WR6 (let the status-window panel be revealed by a world
fact as well as a cheat card) before a system world arrives; LB1-LB3 as the
first library tab slice.

### Per-world types, rarity, multiversal cheats, hiding UI and integrations (2026-10-13)

Weibao: "more to consider for cheat types per world? multiversal cheats? cheat
rarity and more? mroe to consider? hiding ui? integrations and more? send out
codex accordingly". Three Codex research drafts own the detail; all are
proposals:

- [W1 per-world types and rarity](gm/dispatch/cheat-considerations-2026-10-13/W1_PER_WORLD_TYPES_AND_RARITY.md)
  (PW1-PW7, RY1-RY9, EX1-EX12): a world declares what ordinary people can do;
  standing, frequency and legality are separate questions; family fit by
  archetype; local wording for the same family; rarity as a profile (base
  rate, new incidence, active prevalence, holder kind, access, distribution,
  clustering, era waves, transmission, visibility, demand); pity tied to a
  declared process; twelve worked world × cheat examples.
- [W2 multiversal cheats](gm/dispatch/cheat-considerations-2026-10-13/W2_MULTIVERSAL_CHEATS.md)
  (MV1-MV40, XW1-XW10, EX1-EX8): travelers, contractors, traveling shops,
  adaptive systems; compatibility per function at each border; rarity that
  flips between home and hub; what is actually exchanged; administrators and
  anti-cheat factions; conflicts between imported cheats; whose panel shows
  where; heirs who inherit a route, not a whole life; coherence without
  compulsory power creep.
- [W3 hiding UI and integrations](gm/dispatch/cheat-considerations-2026-10-13/W3_HIDING_UI_AND_INTEGRATIONS.md)
  (HU1-HU20, IG1-IG12, AC1-AC12): four meanings of hidden; private windows and
  observers who can read them; a notebook disguise; public stealth; the window
  going dark; a boss key as a temporary mask with exact restore; minimal and
  screenshot-safe modes; redaction by grade; what must stay reachable; the
  full system × hook matrix; reuse ordinary transactions; death vs restart;
  the card-to-panel contract and two adapter gaps.

Open questions they raise are collected in USER_VISION's 2026-10-13 cheat
entries once answered; until then they stay in each draft.

### More to consider: status window stage 1 (2026-10-13)

Weibao: "more to consider for the status window stage 1? Make a prompt to
audit". Stage 0 shipped (CH1: dormant start, awakening, informational panel).
Stage 1 adds **system quests and points**. Palette, not specs.

**What stage 1 is (S1)**

| Code | Consideration |
| --- | --- |
| S1.1 | **Trigger:** stage 1 opens after a stretch of ordinary play since awakening (days lived, a level, a first title), never at awakening itself |
| S1.2 | **Quests come from real state:** counters, skills, known recipes, known people and routes, titles; never a parallel fake world. Reuse `src/quests.js` task/condition shapes where they fit, but keep system quests in the held card's state, apart from the journal's story quests |
| S1.3 | **Spoiler-safe generation:** only targets the player can already see (a known recipe, a known person, a known route); unknown content is never named |
| S1.4 | **Near-next, not far:** each quest is one or two steps beyond what the player has done ("make 3 Processed rough wood", "reach Woodworking 2", "talk to the elder again") |
| S1.5 | **Idle-friendly kinds:** milestone (one-off), habit (daily, passive-capable: "rest 8 hours", "work 2 shifts"), discovery-safe (visit a known place), social (talk to someone known), craft (make N of a known recipe) |
| S1.6 | **Cadence and caps:** a small board (three to five), daily refresh, a soft daily point cap; abandon and reroll with a cost or a cooldown |
| S1.7 | **Deterministic and saved:** generated from a stored seed and real counters, so reload and import give the same board |

**Points and rewards (S1P)**

| Code | Consideration |
| --- | --- |
| S1P.1 | Points accumulate at stage 1 but **buy nothing that skips progression**; their first use is stage 2's shop |
| S1P.2 | Optional small information rewards at stage 1: a hint where a known material is sold, the success odds of a known recipe, a forecast line |
| S1P.3 | Titles can come from system quests through the existing titles owner, never a second title system |
| S1P.4 | No item or XP rewards that complete existing chains (the progression guard) |
| S1P.5 | Point earning pace is a per-world and per-life dial (humble / standard / strong) |

**Status window UI at stage 1 (S1U)**

| Code | Consideration |
| --- | --- |
| S1U.1 | Quest rows: title, progress (have/need), time left for habits, a Claim button; claimed rows fade, not vanish, until the next refresh |
| S1U.2 | Completion as one quiet system line in the log; claim as a settled receipt (same truthful-receipt rule as crafting) |
| S1U.3 | A "why" line on each quest ("you know this recipe"), building trust that the system reads real state |
| S1U.4 | Settings: auto-claim, quest notifications quiet/normal/off, board size |
| S1U.5 | The stage-1 opening is its own reveal (once, never on reload/import), under the Effects master switch |
| S1U.6 | Keyboard: rows and Claim reachable; F6 reaches the panel |

**System voice and world fit (S1V)**

- Voice per card and world (SW2): terse system, the Clerk, a guide; a setting tones it down.
- In a world where the window is world law (WR2), stage 1 quests are what everyone gets; the cheat is the extra (WR3).
- The board can be jammed, cracked or dark under interference (SW7), and says so.

**Persistence and compatibility (S1S)**

- Quest board, seed, points and stage live inside the held card's `state`
  (C0 shape), so no new top-level save field. Older held cards default to
  stage 0 with an empty board.
- Validators extend with a closed quest-entry shape; invalid boards are
  refused at import like invalid cards.
- Counters already in the save (titles' counters, game_stats) drive progress;
  no counter is duplicated.

**Edge cases worth deciding**

Quests that become impossible (a person dies, a route closes) close with a
reason and refund nothing or a small amount; quests completed before they
were offered don't count retroactively unless the board says "already done";
an heir inherits the card only if its backing allows, with or without its
board; a jammed window keeps counting but can't show.

**Suggested build order:** S1.1-S1.4 with two quest kinds (milestone, craft)
and points with no spend; S1U.1-S1U.3; persistence S1S; then habits (S1.5)
and settings (S1U.4).
