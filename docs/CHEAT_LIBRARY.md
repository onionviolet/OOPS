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
