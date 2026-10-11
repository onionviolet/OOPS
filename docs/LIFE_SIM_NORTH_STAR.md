# Life-sim north star (proposal)

*Status: PROPOSAL, not accepted. Written 2026-10-07 by Claude Code from a
chat with Weibao. Nothing here is a decision until it is recorded under
Accepted decisions in [PROJECT.md](../PROJECT.md).*

## Why this exists

Weibao's banked idea, in his words: "I had the idea of a text based game like
bitlife and stuff" (2026-09-29), later steered toward broad progression
fantasy with *Shadow Slave*, *Reverend Insanity* and *Lord of the Mysteries*
as inspiration (2026-09-30). Source: vault
`06_Projects/Side_Projects/Game_Idea_Bank.md`, "Text-based progression fantasy
life simulation".

On 2026-10-07 he said this life sim is the overarching game that the YAIRPG
expansion continues. The many worlds are his direction.

Proposed test for every wave: **does this make one character's life feel
lived?** A feature that only adds buttons fails it. A feature that leaves a
mark on the character, a person or a place passes.

## Start from vanilla YAIR

The vanilla opening, stats, skills, professions, quests and center menu stay
intact (accepted 2026-10-03). The life sim grows outward from them:

- Vanilla is one origin among several, and the default.
- Vanilla's "everything you do is a skill" style becomes the life record: the
  skills you grew are your biography.
- Vanilla's `Game_Time` (30-day months, seasons, night) is already a calendar.
  Birthdays, festivals and seasons hang off it.

Also from Proto23 (YAIR's closest ancestor in spirit): mundane actions that
train, a home you furnish, books that teach, day and night that matter. The
fork's Proto23 branch already has a bed, hearth, bookstand, wood and knife
work and a tutor ([status](worlds/proto23/IMPLEMENTATION_STATUS.md)).

## Origins and starts

- **Birth roll (BitLife).** Family, birthplace, a glimpsed talent, one secret
  revealed later.
- **Playable childhood prologue.** Choices set first habits, fears and one
  recurring friend (Wildermyth, King of Dragon Pass).
- **Transmigrator or native.** Wake in someone else's body: inherit their
  debts, ties and reputation, plus half-remembered knowledge of the book's plot.
  This fits the existing "mysterious awakening" premise.
- **Late starts.** A retired soldier at 40, or the village elder with hidden
  strength at 70 (Weibao liked that idea, 2026-10-02). Less lifespan, more
  knowledge.
- **Legacy start.** After death, play your child, apprentice or reincarnation.
  The heir inherits what the previous life left behind: belongings, written
  records, taught apprentices, reputation, debts, bloodline and unfinished
  business (Weibao, accepted 2026-10-10; see
  [rules from scratch](RULES_FROM_SCRATCH.md#the-heir)).
- **Per-world creation screens.** Each world authors its own creation
  screen and layers (species, genetics, constitution, bloodline, aptitude,
  family, background, fate). See [Character creation per world](#character-creation-per-world-nothing-is-cosmetic-proposal-2026-10-09).
- **Memory-loss mode.** Start with amnesia. Skills exist but are unlabeled
  until used; people know you while you don't know them. Your past is
  discovered through the log, gossip and old belongings. This is a natural fit
  for the vague, revealed-when-it-comes-up information Weibao asked for
  (2026-10-03). No mechanic exists yet.

## Progression

- Skills stay useful late, and simple skills can grow into great ones (his
  requests, 2026-10-02).
- **Aging changes play, not just stats.** Youth learns fast; middle age earns
  money and contacts; old age teaches and sees further. The body wears in
  specific ways: a bad knee, failing eyes.
- **Habits form from repetition.** Ten mornings of training becomes a routine
  with a small bonus and a small cost. This is the idle loop in life-sim form,
  and it matches the idle-vs-active rule Codex proposed (routine runs itself,
  active play unlocks).
- **Careers you can feel.** Apprentice, journeyman, master, each with a
  workplace, colleagues and a reputation inside the trade.
- **World power systems as their own trees**, by default not converted to a
  universal rank (corrected 2026-10-10: never accepted; conversion is a dial,
  see [verse equalization](CHEAT_COSMOLOGY.md#verse-equalization-converting-between-systems)): Lord of the Mysteries potions where you must act
  the role or go mad; Shadow Slave Aspect plus Flaw; Reverend Insanity Gu you
  feed and refine; Cradle paths and madra.

## World travel and parallel worlds

- **Entry point on the timeline.** Arrive before, during or after the canon
  story; each changes what you can stop, join or miss.
- **Live off the protagonist's road.** Innkeeper, merchant, the side character
  who survives because you warned them (Wandering Inn, Mother of Learning's
  side cast).
- **Parallel versions.** The home world is already a branch dimension of the
  original YAIR. A parallel copy of a world you visited, where your earlier
  self never came, is a strong idea: same people, different memories of you.
- **Canon knowledge has a cost.** Acting on future knowledge leaves a trace;
  the more you change, the less your knowledge holds. Extends the fate rule
  (draft D2a, not yet accepted).
- **Hubs between journeys.** Paradise already exists as a residence between
  journeys (Reincarnation Paradise).

## Bringing power from one world to another

`portableCarrierPolicy` (`src/feature_expansion_book_roster.js`, per-edge)
lists what can cross: body, memory, method, fuel, goods, custody, titles,
debts, allies. Its "no generic conversion" strings are inactive metadata
(`activatedByThisModule: false`), not enforcement. Proposed life-sim framing:

- **Carry and conversion are per-edge dials.** Free carry and generic
  conversion are possible where a world, hub, cheat or verse-equalization
  mode allows.
- **Knowledge crosses only when something carries it.** The soul, a cheat,
  a record, an item, a teacher or the world's rules can carry it; without
  one, it stays behind. Carrying is a dial in both directions: a world can
  strip memory at the door, and a cheat can bring back what you never
  knew. Even remembered, a technique may lack its mana source, Gu worm or
  potion there.
- **Translation is a project.** Rebuilding a power on a new world's rules is
  research, and it may come out as a different, weaker or stranger version.
  Several versions of one ability, some simply better, was his request
  (2026-10-06).
- **Scars and debts cross too.** Enemies, oaths and curses can follow you.

## Random events

Vanilla uses raw `Math.random` for combat, loot and encounters. The fork's
events are scheduled and deterministic: chronicle events, opportunities with
due and expiry times, and simulation events. There is no random event director
yet ("universal event/karma director" is listed as unimplemented).

Proposal: a **storyteller director**, inspired by RimWorld's storytellers.
It picks from eligible events by pacing, mood and the life stage you're in,
rather than rolling flat odds. It uses the saved RNG so reloads don't reroll.
Kinds of events:

- Life events: illness, a proposal, a death in the family, a windfall.
- World events: a war, a plague, a festival, a protagonist passing through.
- Rare encounters: the hidden master, a cursed relic, a door to another world.

Expanded 2026-10-09 into six layers (seeded streams, storylets, living
people, tags and interaction rules, the storyteller, a lore layer), each with
a build-ready checklist: [Emergent systems](EMERGENT_SYSTEMS.md).

## Using tropes

Tropes are good scaffolding when the game knows it's using them:

- **Genre tropes as events:** the arrogant young master, the
  tournament arc, the mysterious old man in a cave, the regression second
  chance, the system announcement.
- **Subverting tropes:** the young master is actually right, the old man is
  just old, the tournament is rigged.
- **Self-aware humor.** It was considered on 2026-10-02 and fits a life sim's
  log voice.

Research already exists: [genre tropes](RESEARCH_GENRE_TROPES.md),
[genre sweep](RESEARCH_GENRE_SWEEP.md).

## Little stuff

- **The log's voice ages with you:** breathless at 12, terse at 40,
  wistful at 80.
- Birthdays, seasonal festivals, a favorite food, a nickname villagers give
  you, recurring dreams, a scar with a story.
- **Missed-event one-liners** for other people, not just you: "Mira married
  the baker while you were away."
- **Gossip as discovery.** You hear a distorted version of your own deeds.
- **A home that accumulates:** scuffs, trophies, a garden that grows over
  years.
- **Death and remains:** a grave, an epitaph written from your log, a legend
  that grows and drifts after you die (Dwarf Fortress legends mode).
- Small achievements for small things: first snow, first friend lost, a
  hundred meals cooked.

## The events panel as the life's front page

Vanilla's side log (`log_message`, `src/display.js:767`) has six groups:
combat, loot, unlocks, events, background and crafting. Each is trimmed to
28-80 lines, and none of it is saved. The fork already added a read-only
"World events" feed inside it (`src/event_feed.js`): missed events with "Hear
local reports", opportunities, and recent news.

Proposal (revised 2026-10-07 to respect "follow ui of the original" and the
center menu as the main surface): use the side log for the life, as filters
inside the existing message box rather than new tabs or windows.

- **Now:** this hour's actions, combat and loot (vanilla, unchanged).
- **Life filter:** milestones such as birthdays, firsts, losses, career steps
  and world crossings. Saved, compacted by year.
- **Heard filter:** gossip, missed events and rumors, possibly wrong.
- **The life history lives in the character bio** ("More details in bio",
  Weibao 2026-10-03), not in a new window. It becomes the epitaph at death.

The center menu stays the main play surface.

## Can the engine handle it?

Partly. Findings from a read-only audit, 2026-10-07:

- **Has:** a player lifespan clock (`src/chronicle.js`: initial age,
  lifespan, mortal mode, old-age ending), a calendar, a multi-world instance
  model (`src/world_instances.js`), a per-edge carry policy, a saved RNG, and
  the event feed.
- **Limit 1, save size.** The save is one uncompressed JSON string in
  localStorage (`src/main.js:4533`), about 5 MB per origin, with no size
  guard. A whole life across worlds needs compaction (summaries by year) and
  probably compression.
- **Limit 2, a static world.** No NPC aging, families, population or rumor
  simulation, and `advanceSimulation` caps each call at 512 boundaries.
  *Stale as of 2026-10-08:* the life foundation lane since added a bounded
  household (`npc_lives.js`, a predetermined yearly timeline), a compacted
  biography (64 recent plus 200 annual entries) and 32 relationship
  memories per actor in the chronicle. A
  living world needs coarse simulation for people you aren't watching:
  summarized yearly rather than ticked.
- **Limit 3, no directors.** No random event director, no amnesia mode, and
  power carry only by hand-authored per-edge rules.
- **Nothing since 2026-10-04 has been played.**

Verdict: the browser engine can carry a text life sim; text is cheap. It
needs a compacting life record, coarse NPC lives and an event director before
whole lives across worlds work. A move to a real engine is not needed for
this; revisit only if the UI outgrows the DOM.

## Games and engines to decompile and absorb

All personal-use reconstruction is authorized (vault idea bank, 2026-10-05).
For the life sim specifically:

| Game | What to absorb | Access |
|---|---|---|
| Amazing Cultivation Simulator | Disciple lives, mood, cultivation | Owned, source extracted |
| RimWorld | Storyteller event director, pawn needs and memories | C#, ILSpy-readable |
| Crusader Kings 3 | Traits, stress, dynasty, legacy | Plain-text scripts |
| Wildermyth | Aging, scars, legacy heroes, comic-panel storytelling | Java and JSON data |
| Dwarf Fortress | Historical figures, legends, memories (lane running) | In progress |
| Tale of Immortal | Cultivation life sim, NPC lives, events | Unity C# |
| BitLife | Whole-life pacing, yearly turns | Mobile; behavior study only |
| Kenshi | Being a nobody in a harsh world | Behavior study |

## Proposed absorption passes (queued, not dispatched)

Each pass reads a game's code through the life-sim lens. It ends in **one
playable behavior** with in-world text and a browser check (a test file
where cheap), not a dossier.

| Pass | Games | Builds toward |
|---|---|---|
| A. Director | RimWorld storytellers, Dwarf Fortress history | Random event director and pacing |
| B. A life | Crusader Kings 3 traits and stress, Wildermyth aging and legacy, BitLife pacing | Aging that changes play, death and legacy |
| C. Re-read what we have | Your Chronicle (lifetimes and rebirth), Amazing Cultivation Simulator, Melvor, Orb of Creation | Lifetime and rebirth loop; already extracted, so cheap |
| D. Memory and legend | Caves of Qud (procedural history, unidentified items), Dwarf Fortress legends | Memory-loss mode, gossip, legends after death |
| E. Long saves | How Dwarf Fortress and Crusader Kings 3 compact decades of history | Fixing the save-size limit before lives get long |
| F. Living world | Tale of Immortal NPC lives, RimWorld pawn memories | Coarse yearly NPC aging, families and rumors |

Suggested order: E and C first (E protects saves; C costs least), then B,
then A, D and F.

Sources already extracted under `~/.codex/research/`: Amazing Cultivation
Simulator, Book of Hours, Caves of Qud, Crush Crush, Cult of the Lamb, Dwarf
Fortress, Elin, Factorio, Idling to Rule the Gods, KeeperRL, Magic Research 2,
Melvor, Oxygen Not Included, Orb of Creation, Path of Achra, RimWorld, Rogue
Legacy, Soulash 2, Streets of Rogue, Tales of Maj'Eyal, Your Chronicle. Elin
is itself a life sim and belongs in passes B and F.

**Dispatched 2026-10-07:** two GMs,
[life-sim foundation](gm/life-sim-foundation-2026-10-07/ASSIGNMENT.md)
(passes E then F) and
[life-sim experience](gm/life-sim-experience-2026-10-07/ASSIGNMENT.md)
(passes C and B, then A and D).

**Not owned, needed for full coverage (Weibao to download):**

| Game | Why | Pass |
|---|---|---|
| Crusader Kings 3 | Traits, stress, dynasty, plain-text event scripts | B, E |
| Wildermyth | Aging, scars, legacy heroes, text-and-panel storytelling | B, D |
| Cultist Simulator | Text-based occult life and progression, the closest match to Lord of the Mysteries (same studio as Book of Hours) | B, D |
| Tale of Immortal | Cultivation life sim with NPC lives | F |
| Six Ages or King of Dragon Pass | Generational text events and advisors | A |
| Kenshi (optional) | Being a nobody in a harsh world | F |

## Expanded scope: things missed so far

Collected from Weibao's earlier unanswered requests
([USER_VISION](USER_VISION.md)) plus new life-sim needs. All are proposals.

**Asked for earlier, never built:**
- **Persistent rivals (Nemesis).** A rival who remembers how you beat them
  and comes back changed.
- **Romance and family.** Partners, children and heirs, which also feed the
  legacy start.
- **Party and companions.** Combat is solo only today.
- **"AI clones play the game" mode.** It could become heirs or past lives
  living on their own while you watch.
- **Earned restart, regression and time travel.** A regressor origin: you die
  and wake at 12 with your memories (from U01, his first request).
- **Attacking or replacing protagonists.** Fate rules exist on paper only.
- **Meta achievements.** Small things count too.
- **Offline progress and death policies.** Still undecided.
- **Source audits never run:** JoJo, Universal Thief.

**New for a life sim:**
- **Difficulty modes.** A gentle life versus a Caves of Qud–harsh life,
  chosen at birth.
- **A shareable biography.** Export a finished life as readable text: a
  memoir, not a save file.
- **Data-driven content.** Events, people and text written as data (like
  Crusader Kings 3 scripts) instead of new JS modules. This addresses code
  sprawl (55 `*_host.js` files) and lets the voice be edited in one place.
- **Bilingual or Chinese text option.** Several sources are Chinese web
  novels, and the Hanzi atlas was liked.
- **Generations and dynasty.** A family tree across lives and worlds.
- **Economy over a lifetime.** Prices drift with wars, harvests and decades.
- **NPC points of view.** Short log entries from what a friend saw.
- **Onboarding for a whole life.** The first ten minutes must still feel like
  vanilla YAIR.
- **Mobile.** Kept for later, as Weibao said.

## Paths of play, and too much versus too restrictive (proposal, 2026-10-07)

Weibao asked whether we are restricting too much or doing too much. Claude's
view: both, in different places.

**Too much:** about 1,250 commands, mostly micro-transactions with one NPC
and one item (pay Eda to count stock, approve one stave class). Each wave adds
buttons; few add a way to live.

**Too restrictive:** good defaults (per-edge carries, separate world ranks,
consent and knowledge rules) are applied so strictly that play turns into
bookkeeping, and progression fantasy loses its power spikes. Examples: the heir
keeps one learned method and nothing else, and every action shows its cost
ledger.

**Proposed fix: a few distinct life paths**, each playable from the vanilla
opening to death on existing systems:

| Path | Core loop | Sources |
|---|---|---|
| Fighter or adventurer | Train, hunt, take contracts, get scarred | Vanilla combat, Kenshi, Wildermyth |
| Scholar or cultivator | Study, break through, risk madness or injury | Cultist Simulator, Book of Hours, ACS, Lord of the Mysteries |
| Crafter or merchant | Make, trade, build a name in a trade | Vanilla professions, Dwarf Fortress, Elin |
| Leader | Run a household or clan; advisors, seasons, feuds | Six Ages 2, King of Dragon Pass, Crusader Kings III |
| Wanderer | Travel worlds, carry and translate powers | Book worlds, Paradise hub |
| Schemer or villain | Rivals, fate-severing, attacking protagonists | Fated Villain, RIVALS_IDENTITIES_AND_FATE.md |
| Ordinary life | Family, farm, friends, growing old | BitLife, Elin, Proto23 |

Paths blend: a merchant can scheme, and a scholar can wander. A path is
earned by what you do, not picked from a menu.

**All paths lead to the Dao (Weibao, 2026-10-07; corrects an earlier
misreading of USER_VISION line 652).** Any technique, however humble, can be
levelled into something overpowered through mastery, insight or a strange
combination. Low-level means it starts weak, not that it stays weak.
Breaking through is long and earned, and the world can still be unfair like
Caves of Qud unless the player picks a gentle life at birth.

**Roguelike synergies.** Skills, bodies, items, bloodlines and cheats stack.
Busted combinations are allowed and should be findable, as in Path of Achra
and Orb of Creation. The game makes them rare and costly, not impossible.

Roguelike patterns to take (Weibao asked for more, 2026-10-08):
- **Triggers and tags** (Path of Achra, Slay the Spire): "on kill",
  "at dawn", "when you eat". Synergy is tags meeting tags.
- **Relic sets** (Risk of Rain, Binding of Isaac): items, cheats or
  concepts that complete a set gain a new effect.
- **Scaling loops** (Balatro): multipliers that multiply other multipliers
  are where builds go busted; keep them findable and rare.
- **Build-arounds:** one odd piece that the whole life bends toward.
- **Offers, not menus:** at breakpoints you choose one of three options
  drawn by the director, so each life builds differently.
- **Run memory:** each life unlocks new offers for later lives (Hades,
  Rogue Legacy), which fits the carryover rules.
- **Synergy discovery log:** the Notebook records combos you found, with
  "something here reacts" hints for ones you haven't.

**Cheats as real mechanics.** Golden fingers (a system, a time-travel ring, a
magic jar, regression, an old grandpa in a ring) are implemented in-game as
origins or rare finds, each with its own rules, limits and price. Other
characters can have them too.

Inheritance choices can be generous. Keep cost ledgers in tooltips, not in
button text.

### Skill evolution and combination: how stories do it

This is general knowledge from memory, not yet source-checked. Books marked
(local) are in `docs/research/novels/`.

| Source | How skills grow or combine |
|---|---|
| Lord of the Mysteries (local) | Sequence potions climb a pathway; "acting" a role digests them. Neighboring pathways can swap. Abilities change in kind at each step |
| Reverend Insanity (local) | Gu are refined, fed and combined into killer moves through recipes |
| Shadow Slave (local) | Aspect and Flaw; abilities awaken as you ascend in rank; Memories and Echoes add tools |
| Mother of Learning (local) | No system: shaping skill and understanding let you invent and refine spells |
| Defiance of the Fall | Dao seeds grow into fragments; several Daos fuse into a unique one |
| He Who Fights With Monsters | Essence combinations decide abilities and can yield a rare confluence; abilities rank up iron, bronze, silver and beyond |
| Primal Hunter | Skills evolve with class and race, by rarity tier, through understanding |
| The Wandering Inn | Skills arrive at level-ups; classes consolidate or merge |
| Cradle | A Path combines aspects; techniques deepen with each advancement |
| Path of Achra, Orb of Creation (games) | Triggers and modifiers stack into busted builds |

**Mechanic families to support:**
1. **Use-based growth** (vanilla YAIR's existing way): levels from doing.
2. **Breakpoints that change kind,** not just numbers: at certain levels a
   skill gains a new behavior.
3. **Evolution choices:** at a breakpoint you choose a branch, and the
   branches exclude each other.
4. **Fusion:** two or more mastered skills merge into a new one, by recipe
   (Reverend Insanity), by insight (Defiance of the Fall) or by discovery.
5. **Acting or digestion:** you grow by living in character (Lord of the
   Mysteries).
6. **Understanding over grinding:** insight or research unlocks the next
   stage (Mother of Learning, Book of Hours).
7. **Stacking synergies:** triggers and modifiers from skills, items, bodies
   and cheats compound (Path of Achra).
8. **Degradation and flaws:** unused skills rust; flaws come with power
   (Shadow Slave).

"Kairos" is Maxime J. Durand's *Kairos* series. It is being audited with
*War of the Pantheon*, *The Second Coming of Gluttony* and *Warlock of the
Magus World* in
[novel-wave-2026-10-08](gm/dispatch/novel-wave-2026-10-08/ASSIGNMENT.md),
which also compares skill evolution across every audited book.

**Weibao's rules for tiers and limits (2026-10-08):**
- **Every option, per world.** Each world can have its own growth mechanics
  from the families above, with some transfer between worlds where it makes
  sense.
- **"Unique" is a tier, not a single slot.** Many uniques can exist. They're
  rare, but uniqueness does not mean only one.
- **Limits exist, and there is always a way past them.** Caps are optional
  per world. When one exists (level, tier, lifespan, world rules), it has
  known or discoverable ways to exceed it, usually at a real price; none is
  the only one. Examples:
  - a breakthrough;
  - a forbidden method;
  - a cheat;
  - fusion;
  - a world whose rules allow it;
  - a sacrifice;
  - help from someone who already broke through.

### Novel wave findings (final, 2026-10-08)

*From the [novel wave](gm/dispatch/novel-wave-2026-10-08/ASSIGNMENT.md),
now complete: Kairos I-III, War of the Pantheon, Warlock (1,200 chapters),
The Second Coming of Gluttony (489 chapters and 60 side stories), and a
14-book comparison. Readers read every book in full; the lane's coordinator
spot-checked key passages. Detail is in the gitignored
`docs/research/novels/novel-wave-2026-10-08/`. First folded from the partial
digest, then corrected from the final report the same day.*

**New growth mechanics** (add to the eight families above):
9. **Simulated time vs practiced time.** Warlock's chip designs a fused
   technique in 158 simulated years, and practice is still separate. A
   golden finger can plan faster than the body can learn.
10. **Understood vs usable.** Fully analyzing a foreign technology gave
    under 10% usable transfer (Warlock). Understanding and power are two bars.
11. **Substitution with loss.** Swapping rare ingredients for common ones
    keeps about a third of the effect after many trials (Warlock). Cheap
    versions of rare recipes are researchable.
12. **Consume to gain.** Eating a power grants stats and a partial grasp of
    it; the full effect stays locked until you understand it (Warlock
    only; Gluttony turned out not to work this way, see below).
13. **Titles that evolve.** A Legend changes name and effect after major
    choices, so rank reads as biography (War of the Pantheon).
14. **Bloodline potential and flaw repair.** Children inherit different
    potentials, and flaws can be edited (Warlock).
15. **Credit for contribution.** The person who planned the decisive move
    earns the rank, not just whoever struck last (Kairos II).
16. **Ordered spending past a cap.** Spending points in a set order, then
    using saved elixirs, pushes stats above the human limit to an "EX"
    grade that also rebuilds the body (Gluttony). Order and stock matter.
17. **Mastery-gated fusion.** Two skills both at High grade can evolve into
    one new skill; owning a skill is not the same as being able to use it
    (Gluttony).
18. **Hidden gaps inside a tier.** Two people at the same displayed grade
    can be far apart, and progress near the top of a grade gets harder
    without the display changing (Gluttony).
19. **Cross-domain use.** Combat technique applied to cooking makes a
    better cook without any new combat rank (Gluttony side stories).
20. **Effect before understanding.** A power can show effects beyond the
    method you have grasped; bought methods skip practice but not
    foundation (Gluttony).
21. **Debt power and spent potential.** Borrowed holy energy needs repeated
    offerings and can worsen; spent potential doesn't come back with a
    refill (Gluttony).
22. **Revocable powers.** Contracts can strip and later restore powers, and
    a delegated authority can lower one class of people's stats
    (Gluttony).

Acting or digestion appears only in Lord of the Mysteries. Rust appears in
none of the five new books, Gluttony included; their costs sit in bodies,
gear, contracts and relationships.

**Gluttony's golden fingers as rules** (it is not a power-eating cheat):
- **Authority of Gluttony,** granted by a goddess, pulls divine energy
  already dissolved in a target's mana and weakens them. It copies no
  skills. It fails against a far stronger source: it was annihilated trying
  to devour the final enemy's world-destroying energy.
- **Shared Authority:** up to five servants share it; the first keeps full
  strength and later ones split the rest. The servants are the ones who
  literally eat (one eats spirits and releases them as an army).
- **Nine Eyes,** the core cheat, is costly perception of risk, not luck
  control. Over six hours of use brings headaches and a weaker signal;
  directions unlock in steps; it later fuses with Future Vision.
- **Curse Spear** twists a target's luck but hits the user with equal
  backlash, and overuse can kill.
- **Every strong power has a stated price.** No cheat without a drawback
  was found.
- **Shops:** a grade-tiered VIP store with finite stock and some unique
  items. It sells goods, never cheats. Point shops sell skills, but using
  them still needs a foundation.
- **Real eating** is food and rare essences: each gives one guaranteed,
  person-specific benefit, one piece per person, and a large dose can harm.
- **Unresolved in the book:** one rule says Earth strips all abilities from
  returnees, yet the hero used his cheat on Earth earlier.

**Tiers in Gluttony:** mark grade, body stage (Low to Pinnacle to EX), class
level, ability grade ("Unknown" is not weak), unique rankers, one-of-a-kind
classes and offices are all separate axes. Many unique rankers coexist.
Promotion mixes contribution points, experience, exams and merit waivers.
Time runs 3:1 between Paradise and Earth and 10:1 inside one trial.

**Tiers and uniques.** No book sets a global count of uniques. Scarcity is
always local: a material stock, an owner, a seat, or a custody rule. Lord of
the Mysteries comes closest (one Uniqueness plus three Sequence 1
characteristics per top seat). Kairos has many Legendary items and Legends.
Item rank, personal rank, stars and level are separate axes in Kairos and War
of the Pantheon. This supports "unique is a tier": make scarcity a property
of a specific object or seat, not of the tier.

**Limits and ways past them** (new examples for the list above): a world's
will lending you its rank for three actions, then wanting to own you
(Warlock); an imprint plus an experiment fitted to one host; a ritual paid in
life force; transforming into a new body; quest completion and fame raising
a cap (Kairos); a blessing or necklace that lifts one stat ceiling (War of
the Pantheon). Warlock also corrects its hero: "understanding alone breaks
every ceiling" was his early model, and it turned out wrong.

**Across worlds.** All five books agree with the carrier model: knowledge,
research and some artifacts persist; body, rank and local fuel do not.
Warlock arrives in a new world in a new body on a local path, and a divine
clone's rank doesn't become the main body's rank. Methods lose strength
outside the world that fuels them.

**Golden finger as rules: Warlock's chip.** It scans, recalls, simulates,
estimates odds and optimizes, on command. It never replaces the test:
predictions and results stay separate. Limits: it needs data and samples,
interference shrinks its range, its analysis can be partial, and it fails
when the host's mind is compromised. Price: its own energy, and the host
still has to act and live with the result. Kairos's advantages are narrow
and local instead (bypass defenses up to one rank, one-charge revival, one
companion). This gives two cheat styles: a broad tool with honest limits,
and a narrow rule-breaker.

**World stance (adds to "How each world treats you").** Warlock's World of
Gods suppresses outsider wizards until Leylin changes body and merges with a
local divine clone; then it stops. Another world's will offers borrowed power
with a leash. Kairos's Fates assign quests and won't give another until you
finish one. Proposal: add **Leashed** as a stance: the world helps, then
claims you.

**Rival hubs.** Nothing in the finished pieces. The Reincarnation Paradise
dossier (`trailblaze-reading/paradise-depth/`) is the place to look.

**Small touches worth taking:**
- the odds shown apart from the tested result;
- a promise ledger: who promised what, and when it's due;
- scheduled care, like visiting a relative at the full moon;
- mourning with a memorial and a share of loot reserved for the dead;
- pensions for widows and disabled veterans after a battle;
- gifts of food that spoil unless eaten or planted;
- observation that hides facts below a threshold and can be falsified;
- an heir who inherits property but not legal standing.

**The lane's final ranked proposals (not decisions):**
1. A practiced skill branches into a chosen use (cooking becomes a healing
   broth; a runner becomes a courier). Two characters should be able to
   pick differently.
2. A mentor explains one principle; the learner tests it with local tools
   and later teaches.
3. Life events interrupt routines and leave marks.
4. Watching a rival gives partial information (a specific hidden fact, not
   random wrong numbers), and the counter comes from doing.
5. **New:** share a rare edible essence; each person gets one real,
   person-specific change, with a dose limit.
6. Fusion through a specific practiced operation.
7. Legend grows from deeds and who witnessed or heard them, with rumor lag.
8. Scarce heirlooms and seats stay separate from common skills; lending one
   changes another life.
9. A diagnostic gift like the chip, with honest limits.
10. A method from one world rebuilt as research in another (moved to the
    later backlog, outside the first-realm milestone).

### Worked examples: humble vanilla skills to busted (Claude, 2026-10-08)

All three start from skills that already exist in vanilla YAIR. Numbers in
brackets are the mechanic families above. Every stage is a proposal; level
numbers are placeholders.

**Woodcutting to a Dao of Severance**
1. *Use* [1]: chop wood in the home world; Woodcutting and Axes level as now.
2. *Breakpoint* [2], around level 25: "Read the grain". Trees fall in fewer
   swings, and the skill now also applies to hitting armored enemies on
   their weak line.
3. *Branch* [3], around level 50, pick one: **Forester** (healthier forests,
   rare woods regrow, ties to Farming and Herbalism) or **Severer** (every
   cut finds a seam, ties to Axes and Swords). The other branch stays
   visible as a road not taken.
4. *Insight* [6]: an old woodcutter (a hidden-strength elder) says a tree
   is cut before the axe lands. Unlocks a research project, not a level.
5. *Plan vs practice* [9]: a golden finger can finish the research in a
   week, but the body still needs a season of real chopping to use it.
6. *Fusion* [4] with Wide swing and Persistence: "Clearing", one swing per
   day that fells a stand of trees or breaks a shield wall.
7. *Limit and past it*: the home world caps the skill at "Grandmaster". The
   ways past are a cultivation world, where it becomes a sword-intent Dao
   seed, or a tribulation the world sends once you approach the cap.
8. *Overpowered*: at the top, Severance cuts things that aren't wood: a
   curse, a contract, a fate thread (this links to D2a fate-severing).

**Sleeping to dream-walking**
1. Vanilla Sleeping restores faster with level.
2. Breakpoint: dreams become log lines, and some carry hints (knowledge
   layer "Hinted").
3. Branch: **Lucid** (train skills in dreams at a sanity cost) or **Deep**
   (heal and age more slowly).
4. Cross-world: in a world with a dream realm (Shadow Slave, Warlock's
   Dreamscape) it becomes travel; elsewhere it stays rest.
5. Overpowered: visit other people's dreams, meet past lives, or let a
   cheat-system character talk to you only while you sleep.

**Gluttony to consume to gain** [12]
1. Vanilla Gluttony makes food more effective.
2. Breakpoint: eating a monster gives a small trace of its traits, which
   stays locked until understood (Warlock).
3. Branch: **Gourmet** (cooking buffs, a restaurant career, ties to
   Cooking) or **Devourer** (eat powers, with corruption as a hidden stat).
4. Limit: digestion capacity, and a world that hunts devourers.
5. Overpowered: eat a concept, such as a season or a world's rule, at a
   life-changing price.

**Rules these examples suggest:**
- A skill's stage shows in its name and description by default, not as a
  new window.
- Branches you skip stay visible, and a later life or an heir can take
  them.
- The same skill means different things in different worlds; travel is
  part of growth.
- The top of every humble skill touches fate, curses or world rules, so all
  paths really do lead to the Dao.

### One skill, many Daos, and tiers of concepts (2026-10-08)

Weibao asked: can one thing lead to several Daos, with tiers of concepts as
in *A Death a Day* (Royal Road)? The table below is Claude's original
proposal; what that serial actually does follows it.

**Yes: a skill is a doorway, not a road.** Any skill can feed several
concepts, and any concept can be reached from many skills.
- Woodcutting can lead to **Severance** (the cut), **Growth** (the forest
  that returns), **Patience** (ten thousand swings) or **Wood** itself.
- Severance can also be reached from Swords, Butchering, Medicine
  (surgery) or Haggling (cutting a deal).
- Which concept you reach depends on how you used the skill, which is
  your life record: what you cut, why, and what you felt. Two woodcutters
  can end up with different Daos.

**Tiers of concepts (proposed shape; each world names them its own way):**

| Tier | What it is | Woodcutting example |
|---|---|---|
| Skill | A thing you do; vanilla levels | Woodcutting 40 |
| Technique | A named way of doing it | "Read the grain" |
| Intent | The will behind it, usable beyond its tool | Cutting intent in any blade, or a glance |
| Concept | A piece of reality you grasp | Severance |
| Law | A family of concepts | Separation (Severance, Distance, Ending) |
| Origin | What laws come from; world-shaping | Distinction: the line between this and that |

- **Higher tiers contain lower ones.** Severance sits under Separation.
  Grasping a law lets you use its concepts at a lower level without
  learning each one.
- **Concepts fuse sideways.** Severance plus Growth gives **Pruning**: cut
  to make things grow (heal by removing, train by limiting). Fusions can be
  unique-tier, and many uniques can exist.
- **Concepts can conflict.** Holding Growth and Decay together costs
  sanity or stability unless a higher concept reconciles them (Cycle).
- **A soul has a limited number of seats** for concepts. Seats grow with
  realm, age, cheats or a world that allows more. That limit has its
  usual ways past: fusion frees seats, and a law replaces several
  concepts.
- **Each world names and gates tiers differently.** One world calls them
  Dao seeds, fragments and Daos; another uses Pathways; another Gu
  recipes; another a system's Concepts. The shape travels and the names
  don't. A concept learned in one world may only reach Intent in another
  whose rules are thin.
- **Concepts are people too.** At the Origin tier a concept can have a
  will, as in worlds where Concepts made the world. You can bargain with
  it, be chosen by it, or replace it.

**What *A Novel Concept* adds (full audit, 2026-10-08).** Weibao calls it
*A Death a Day*, after its tagline: *A Novel Concept: He Who Eludes Death*
(Royal Road fiction 66455, author Priam, 449 public chapters). Codex read
all of it with peer review and coordinator checks on key scenes. Notes are in
the gitignored `docs/research/novels/full-book/a-novel-concept/`, including
a draft world card. The hero is still Tier 0 at the cutoff.
- **Stage and tier are separate axes.** Inside one Concept you climb
  stages: Affinity (sense it), Harmony (a Concept-specific operation, such
  as fire burning ambient energy), Symphony (ensemble effects), Unity (the
  Concept entwines your self, with identity risk), and a theoretical
  Infinity. Tier is a different number.
- **Tier 0 is broad, not weak.** Fire is Tier 0 and gets very strong at
  higher stages. Tier 1 is usually narrower and stronger (Mist, Steel,
  Rust, Combustion), with an exception that strengthens broad Fire as a
  whole. Tier 2 needs soul capacity and can force a High Tribulation.
- **Fusion is gated by compatibility.** Related Concepts merge into an
  intersection; will can keep two Tier 1 Concepts apart; three or more is
  dangerous. Deleting a Concept alters the soul and so the person.
  **Inventing a new Concept** is the way out of a dead end.
- **Many people can share a Concept.** "First" and "unique" belong to
  titles and gifts, not Concepts.
- **Ways to gain a Concept:** epiphany, a compatible bloodline, a rare
  resource, a fragment, a token, merit. Priam's own shortcut is dying to
  something and adapting to it.
- **The daily revival is Priam's personal gift,** not a world law: once per
  day, delayed up to 30 minutes, adapting to what killed him. It costs time,
  exposure and soul wear, and an enemy can damage the body "blueprint" it
  restores to. Other revival sources (tokens, a 24-hour rewind, return
  with memory) each have their own rules.
- **Cheats pay in exact currencies:** one luck cheat permanently halves the
  holder's chance stat on each use, one leaves a single weak point, curse
  bombs don't spare the buyer.
- **A system shop exists,** with price, stock and risk text. Listing isn't
  buying, and buying isn't successful use. Rewards can't be gamed by
  rewinding; diviners can detect a rewind.
- **Not in the book:** higher Concepts containing lower ones (explicitly
  rejected), a fixed seat count, cheats eating cheats, barrier leakage, and
  "seeing is unlocking" (you can see a Concept in the menu without being
  able to take it). Those remain our own proposals.

**Proposed merge with the table above:**
- Keep two axes: **stage** (depth inside a concept) and **tier** (which
  concept). Our Skill to Origin ladder is an original proposal; worlds that
  follow this book use stages and tiers instead.
- **Three routes, not two:** deepen into a narrower concept, broaden, or
  **invent a new concept** when stuck.
- **Fusion pressure as a choice:** related concepts drift together unless
  you spend willpower. Keeping a build wide costs; merging gives a stronger,
  narrower concept, maybe unique.
- Keep the states separate: **listed, acquired, activated, observed.**
- Containment ("a law gives its concepts") stays our idea for some worlds;
  this book's world card lists it as an absence.

**The lane's ranked proposals (not decisions):**
1. One ordinary skill feeds several distinct insights through actual use;
   the basic tool stays useful.
2. An enemy notebook storing rules with confidence, evidence and failed
   predictions.
3. World cards pick local rules; one actor's privilege is not world law.
4. Power spikes come from compatible combinations with visible conditions.
5. Broaden, specialize and invent as separate advancement routes.
6. Transport, allowed time away, destination and carried assets are four
   separate travel rules.
7. Optional extraordinary gifts with exact, sometimes harmful, conditions
   and counterplay.
8. Home supports research, friends and small comforts alongside defense.

**Small touches:** fire takes hours of failed tries before a skill
milestone makes it reliable; a mentor reads hips and feet, and each
milestone teaches one tell per enemy you know; a wounded enemy variant needs
different preparation; identifying wild food is risky until an expert helps;
a merchant pays for a story with a lesson; a local-unknown recipe (cocoa)
shifts market demand; full health doesn't fix loneliness; the name you give
your workshop recurs in later text.

**How this fits the rest of the doc:**
- Long lives give time to climb; many lives let you try other branches.
- Knowledge of a concept carries between lives; the seat and the practice
  don't, so a reborn character relearns faster but not instantly.
- The two progress bars (understood and usable) apply at every tier.
- The world reacts as you climb: higher tiers draw tribulations, sects and
  jealous cheaters.

## Little stuff in every audit

The audits so far trace about five large connected mechanics per game and
skip the small touches that make a game feel alive. Proposal: every audit,
including a cheap re-read of the existing dossiers, also lists **ten small
touches** per game, for example:

- Flavor text on items and cards that changes over time.
- Nicknames and epithets earned from deeds (Crusader Kings III).
- Bodies that change for good: scars, lost or replaced limbs (Wildermyth,
  Kenshi).
- Advisors with opinions and personalities who age and die (King of Dragon
  Pass, Six Ages 2).
- Art and engravings that record your history (Dwarf Fortress).
- Timers that decay or rot, dreams, and small dread (Cultist Simulator).
- Small reactions: an NPC remembers your name, a dog follows you home.

## Life progression defaults (proposal, 2026-10-07)

Reference: *Speedrunning the Multiverse* (Adastra339, Royal Road), books 1-4.
The audit was dispatched in
[speedrunning-multiverse-2026-10-07](gm/dispatch/speedrunning-multiverse-2026-10-07/ASSIGNMENT.md).

Reversible starting guesses, to be tuned in play:

- **Life length (revised).** Lives are long. Weibao wants "days and days of
  gameplay in one world alone" (USER_VISION line 298), and time and old age
  should matter. Idle games that use short rebirth runs are the wrong model
  here. A life spans many sessions, and life extension makes later lives
  longer still. A short "test life" origin can exist for learning the
  ropes.
- **Time away.** By default you don't age while the game is closed.
  Routines keep producing, up to an engineering cap that can rise, and you
  can bank the time away to speed up later (like Idling to Rule the Gods or
  Melvor offline time). Absent worlds freeze by default too. Offline
  catch-up or a harsh mode where time and aging run while closed are opt-in
  dials; see the [idle and offline proposal](RULES_FROM_SCRATCH.md#idle-and-offline).
- **What carries over.** Knowledge carries when something carries it (the
  soul, a cheat, a record, an heirloom, a teacher). The rest depends on how
  the life went, plus some chance: a deed-based legacy (Wildermyth) and random
  traits (Rogue Legacy).
- **Reloading.** Chosen at birth with difficulty: a gentle life lets you
  rewind, an ironman life keeps death final.
- **Life extension and body change.** Each world offers its own route, with
  real costs:
  - Cultivation realms that add years.
  - Elixirs.
  - Mechanical limbs and bodies (Kenshi, Legendary Mechanic).
  - Possession or body swap.
  - Clones.
  - Undeath.
  - Moving the soul into an heir.
  - Time loops (Mother of Learning).

## Build plan (proposal, 2026-10-07)

*2026-10-08:* a fuller architecture draft, one rules lookup with layered
cards (world, place, edge, power, cheat, operation, faction, person,
research, event) and content packs, is in
[ENGINE_SKETCH.md](gm/dispatch/engine-extension-2026-10-08/ENGINE_SKETCH.md);
a Codex design study is checking it against the code.

Weibao: a world can have several routes of each kind, and every variety can
be built. To make that affordable, build the shared machinery once and add
variety as data:

1. **Merge (A12).** Put all lane work into one build, run the combined save
   gate, and commit by owner.
2. **The life framework, built once.** Shared, data-driven definitions for:
   - lifespan modifiers (extension routes);
   - body state (wear, scars, replaced parts, a new body per world);
   - carryover rules (knowledge, legacy by deed and chance, heirlooms);
   - paths (earned from deeds);
   - life events, for the director.

   A world or book adds a route by adding data, not a new `*_host.js` module.
   The framework holds shapes, not rules. Each world keeps its own systems
   and power logic ("everything equally scoped, different worlds with
   different systems", USER_VISION line 658), and there is no universal
   ladder.
3. **One proof world with several routes.** In the home world:
   - two life-extension routes (for example an elixir and a mechanical
     replacement);
   - one heir-soul carryover;
   - two paths.

   Then play life 1 → death → a faster life 2.
4. **Scale by content passes.** Each world, game audit or novel audit adds its
   own routes, power systems and small touches as data, starting with
   Speedrunning the Multiverse, Mother of Learning and Paradise.
5. **Director and memory-loss mode** (passes A and D) on top of the
   framework.

## Every idea somewhere, not everywhere (proposal, 2026-10-08)

Weibao: how do we keep all the ideas (A Novel Concept's world alone is full of
lore) without every world having all of them, so places stay distinct?

**Principle: the library is shared, each world picks.** Every mechanic in
this doc lives once in the framework. A world turns on a few, tunes them,
renames them, and leaves the rest off. Every idea exists somewhere; no world
has everything.

**A world card** (one data file per world, the "bible"):
- **Premise:** one paragraph, and who rules.
- **Signature laws (optional):** what only this world does, or does
  best. Example, a Concept-made world: a hostile environment, Concepts
  shaped by understanding, growth tested by tribulations.
- **Absences (optional):** what is impossible here by default. "No revival", "no
  Concepts above Tier 0", "no systems". Absence makes a place as distinct
  as presence. Each absence has a way around: a cheat, a rift, a rare
  ritual or a late event, at a cost.
- **Dials:** shared mechanics with local settings: fusion pressure, concept
  seats, death frequency, aging rate, stance toward outsiders, how much
  carries in and out.
- **Names:** what tiers, currencies and ranks are called here.
- **Scarcity:** what is rare and fought over here (a throne, a Gu, a seat,
  water).
- **Deck:** the world's own events, small touches and people, which the
  director draws from only here.
- **Doors:** how you get in and out, and what crosses.

**Places inside a world are smaller cards.** A region, city, rift or
dungeon overrides a few dials: a valley where Concepts can't be sensed, a
city with no death penalty, a rift that runs ten times faster. Distinct
places come cheap because they're mostly inherited.

**Keeping worlds apart:**
- **The swap test.** If you rename a world and play doesn't change, it
  isn't distinct yet. A signature law that changes what you do daily is
  the usual fix.
- **Depth over piles.** Depth comes from dials and decks, not from piling
  on systems.
- **Ideas leak mostly through travelers.** By default a mechanic appears
  in another world because someone carried it there: you, a rival, a hub.
  It usually arrives weakened, renamed or illegal, and spreading it is a
  story. Convergent worlds and cheats can skip the traveler.
- **Home is the first world you lived in.** The "home world" is home only
  because the player lived there first. It doesn't have to be the source
  or origin world, and it can be as deep as any world.
- **Rotate the spotlight.** Each world's deck favors its signature, so a
  long life there is about that thing.

**Full drafts:** [World cards](WORLD_CARDS.md) has six cards (the Frontier,
the Crucible, the Gu Wilds, the Fog City, the Dreaming, and the Paradise hub
with a charter), written 2026-10-08.

**Example world cards (sketches):**

| World | Signature laws | Absences | A dial that stands out |
|---|---|---|---|
| Home (vanilla YAIR) | Everything you do is a skill | None fixed | Stance neutral |
| A Concept-made arena (inspired by A Novel Concept) | Hostile environment makes arrival survival; understanding shapes reality through Concepts; tribulations test growth | No default revival (it's an origin gift); no free right to leave; no lower Concepts granted by higher ones | Fusion pressure high |
| A Gu world (Reverend Insanity) | Gu fed and refined; killer-move recipes | No skill grows from use alone | Stance suppressing toward deviants |
| A potion world (Lord of the Mysteries) | Acting digests; madness | No mixing pathways freely | Hidden stat sanity loud |
| A dream world (Shadow Slave) | Aspect and Flaw; a Spell that judges | No safe sleep | Death final |

**Implementation sketch (ideas only; no build without Weibao's yes):**
- World and place cards are data files, read by one shared rules lookup:
  "what is fusion pressure here?" answers from the place, then the world,
  then the default.
- Mechanics check the lookup instead of hard-coding a world, so a new world
  is a new card plus content, not a new `*_host.js`. This is step 2 of the
  Build plan.
- An "absences" check blocks a mechanic with an in-world reason ("Concepts
  feel muffled here") instead of hiding it silently.
- A small "world card" view inside the existing Notebook or bio shows what
  you have learned about a world's laws, with unknown laws as blanks.
- An agent audit of a book or game outputs a world card draft, so research
  lands in the same shape every time.

## Barriers between worlds and the multiverse's own physics (proposal, 2026-10-08)

Weibao: weakened world barriers and more. Each edge between two worlds gets
a **barrier** with its own dials, next to the existing carry policy.

**Barrier dials:** strength (how hard to cross), filter (how much power
gets through; strong barriers suppress high-tier beings, so gods send
avatars), time ratio, leak rate (what seeps across on its own) and
direction (some barriers are one-way).
*(Power-scaling lane, 2026-10-08: prefer edge-specific filters or destination requirements over blanket suppression; powers that work by their own mechanism keep full strength.)*

**Weakened barriers:**
- **Causes:** wars, rituals, a dying world, a convergence season, too many
  crossings (including yours), a cheat that tears holes.
- **Effects:**
  - travel gets easier and cheaper;
  - monsters, mana and refugees leak in;
  - **laws bleed**: a neighbor's signature law half-works near the thin
    spot, so absences fade and border towns appear;
  - strong beings can cross without being suppressed, which is how
    invasions start.
- **Responses:** repair it (a career: wardens, seal-makers), exploit it
  (smuggling, raiding), or ride it (a merchant path that lives on the gap).
- A home-world campaign beat: the barrier to an expansionist world thins,
  and the vanilla opening's quiet slowly ends, for those who stay.

**More multiverse physics to consider:**
- **World tiers:** higher and lower worlds. Ascending to a higher world
  resets your rank against stronger locals; lower worlds suppress you less
  but have less to learn.
  *(Power-scaling lane, 2026-10-08: an automatic reset should be authored per world, not a general law.)*
- **World life cycles:** young worlds with thin rules, mature ones, dying
  ones that leak and fragment.
- **World mergers:** two worlds fuse (Warlock's finale), mixing cards and
  laws.
- **Worlds that eat worlds,** and worlds that grow by absorbing fragments.
- **Pocket and nested worlds:** rifts, mini-worlds, sub-planes
  (USER_VISION L246), an inner world grown inside a cultivator.
- **Owning a world:** a seed you plant and grow; you write its card. A
  long-term goal for any path.
- **Coordinates and anchors:** you can only return to a world you have an
  anchor for (a person, an object, a mark). Lose the anchor and the world is
  lost (Omniscient Reader, Speedrunning the Multiverse).
- **Dimensional weather:** storms between worlds, drifting closeness
  (seasons of the multiverse), safe and dangerous crossing windows.
- **World wills** as characters: they wake, bargain, suppress, leash and
  die.

## Comic, anime, game, myth and other worlds (proposal, 2026-10-08)

USER_VISION already asks for franchise worlds (Naruto, Bleach, Harry Potter,
comic books; L1088-L1140). The world card makes any source the same shape.

| Source type | Why it fits | Watch for |
|---|---|---|
| Comic books | Already multiverses: numbered earths, events, crossovers, retcons. A retcon can be an in-game timeline event | Continuity is contradictory; pick one era per card |
| Anime and manga | Explicit power systems. Hunter x Hunter's Nen vows and restrictions are the "limit with a price" rule exactly; chakra natures, Bleach's shikai and bankai stages, Stands as conceptual powers | Power creep across arcs; pick an arc as the entry point |
| Games | Rules already formal: Dark Souls cycles, Pokemon-style bonds, roguelike loops | Mechanics may need translating to text |
| Myth and folklore | Public domain; Greek myth (Kairos uses it), Journey to the West, Norse cycles, fairy tales | Many versions; choose one |
| Tabletop | Planes and cosmologies built for travel; some rules are openly licensed | Licenses differ per system |
| History | A real era as a low-magic world: plague, trade, war | Tone and care with real peoples |
| Original | Ours, unlimited | Needs its own lore budget |

**Public repo vs franchises.** The fork is public. Direct franchise
content (names, characters, plots) is safest as a **private content pack**
kept out of git, like `docs/research/novels/`. The public build ships
original or public-domain worlds and "inspired by" versions. This is a
practical risk call, not a moral one; personal play is unaffected.

**Is fan fiction public domain? No (practical notes, not legal advice).**
- Fan fiction is a derivative work. The original stays under copyright, and
  the fan writer also owns their own new text. Neither is public domain.
  Many authors tolerate fan fiction, but tolerance is not a license.
- **Public domain** means the copyright expired (in the US as of 2026,
  works published in 1930 or earlier) or the author dedicated it (CC0).
  Myths, folklore, and old classics qualify.
- **Fair use** is a case-by-case defense, not a status a work has.
- **Mechanics and ideas aren't protected; expression is.** Concept tiers,
  daily revival, fortune theft and hub wars can be absorbed freely. Names,
  characters, specific lore and prose can't be copied into the public
  build. Trademarks protect names and logos separately.
- **Royal Road authors keep their copyright.** *A Novel Concept* is
  unpublished but still copyrighted. Asking the author for permission is
  an option if Weibao ever wants a direct adaptation in public.
- **Practical rule:** public build = original names over absorbed
  mechanics; direct adaptations live in a private pack, out of git.

**Canon fidelity as a dial:** strict (follow the arc, the protagonist is
protected by D2a), loose (same setting, divergent history) or remix (the
setting meets other worlds' laws through a weakened barrier).

## Implementation considerations for many worlds (Claude, 2026-10-08)

Ideas, not a build order.

1. **Content packs.** A world is a pack: its card, places, deck, people,
   items and text. Packs can be public or private, and a missing private
   pack shows the world as unreachable rather than breaking saves.
2. **Rules lookup in layers:** default, then multiverse events (a weakened
   barrier), then the world card, then the place, then personal exceptions
   (a smuggled power, a native-only law).
3. **Edges as data.** Barrier dials sit beside `portableCarrierPolicy` on
   each edge.
4. **One life clock, many time ratios.** Age by subjective time; each world
   has a ratio to the multiverse clock, so fast worlds feel fast.
5. **Load on visit.** Only visited worlds take save space; unvisited ones
   are just cards. Visited worlds keep deltas, compacted by year (pass E).
6. **Stub, then deepen.** A new world can start as a card plus a small
   deck and grow as it gets played. Depth follows the player, which keeps
   breadth affordable.
7. **Audit to card pipeline.** Every book, anime or game audit ends with a
   draft card, places and a deck in the pack format, checked against the
   swap test.
8. **Schema checks.** A cheap test validates every card and pack; it
   catches broken references and missing required fields, not counts of
   absences or signature laws.
9. **Determinism.** Barrier weakening and leaks use the saved RNG, so a
   reload doesn't reroll the multiverse.

## Access, research, events and quests (proposal, 2026-10-07)

These are four more data types in the life framework.

- **Access: hear, learn, qualify, attempt.** Every route (an extension, a
  power, a world) is found through a chain:
  1. You hear of it through gossip, a book or a dream.
  2. You learn what it needs through research.
  3. You qualify: skill, item, place, person, age or path.
  4. You attempt it, and it can fail with lasting marks.

  Some routes are rare finds; some are inherited from past lives as
  knowledge. Nothing appears in a menu before you've heard of it, which
  matches "information appears only when it comes up".
- **Research: projects on the shared clock.** It builds on vanilla's
  book-reading. Study takes time, materials and the right teacher or text, and
  it produces understanding you can act on (Book of Hours, Cultist Simulator).
  Partial research gives partial or risky versions: the "incomplete skills"
  Weibao asked for. Knowledge from research carries between lives; the
  practice does not.
- **Random events: a director picks from eligible events.** Eligibility
  comes from life stage, world, path, deeds, relationships and season. Events
  come in tiers: everyday little things, life events, world events and rare
  encounters. Pacing comes from a storyteller with a pity timer, so rare
  doesn't mean never. The saved RNG means reloads don't reroll.
- **Quests: three kinds.**
  1. Vanilla quests stay as they are.
  2. **Ambitions:** life goals the character forms from what happened, for
     example "master the forge" or "avenge my brother" (Crusader Kings III,
     BitLife).
  3. **Story quests:** world and book plots you can join, change or miss.

  Quests surface through gossip and events, and missed ones become log lines.

## Knowledge and discovery (Weibao's direction, 2026-10-07)

Weibao chose "both" for ambitions (the game suggests, the player accepts or
writes one) and a mix for discovery: hidden things, hints, and NPCs who know
more than they should. Proposed layers:

- **Hidden:** found only by doing, wandering or chance.
- **Hinted:** item flavor text, dreams, a log line that reads oddly, a
  tooltip that says less than it should.
- **Told:** gossip, books, teachers, each with a reliability level, some of
  it wrong.
- **NPCs who know too much:**
  - another transmigrator or regressor;
  - a fortune teller;
  - the hidden-strength village elder;
  - a god or system voice;
  - a child who remembers your past life.

  They have their own reasons, so their help has a price or a catch.
- **Remembered:** flashes from past lives that carry hints, not answers.

Every Notebook entry shows its state: unknown, rumored, believed or
confirmed.

## How each world treats you (proposal, 2026-10-08)

Different worlds react differently to the same person. Weibao: some books
have heavens that support you and enemy heavens that suppress you. A world's
stance is part of its data:

- **Favored:** the world's will helps you: luck, timely chances, protection.
  This is how a protagonist's fate works, so you can earn or steal it.
- **Neutral:** the world ignores you; you live by its rules.
- **Suppressed:** the world caps outsiders or deviants: power suppression,
  tribulations, bad luck, hunters (the heavenly will against Fang Yuan in
  Reverend Insanity is the usual example).
- **Rejected:** the world tries to expel you; staying has a growing cost.

Stance can change with your deeds, your origin (native or outsider), your
path, your karma, and treaties with the world's powers. It shifts gradually,
so you can feel it. It also follows the rule above: suppression is a limit,
so there's always a way past it.

- **Leashed** (from the novel wave): the world helps, then claims you.

The hubs-and-heavens lane (see "Hubs and rival hubs") found that stance is
better modeled as several relationships than one opinion: a world's will, its
local laws, how well your body and methods fit it, and who sponsors you can
each favor or suppress you at once. The four words above stay as shorthand.
Suppression in the sources always has a cause, a target and a boundary, for
example a world will blocking a true body, a palace blocking spatial sense, a
scenario excluding newer skills.

- **Expansionist:** the world wants its people to go out and invade,
  plunder or settle other worlds. It rewards you for bringing back resources,
  souls or territory, and it may send you whether you like it or not.

## Hubs and rival hubs (proposal, 2026-10-08)

A hub is a home between worlds, like Reincarnation Paradise. The local notes
show rival hubs in that novel too (chapter titles name Revelation Paradise,
Apocalyptic Paradise and a Sacred Land).

- **Several hubs, each with its own character.** They differ in rules,
  rewards, ranks, shops and what they ask of their people. Joining one is a
  life choice; leaving or switching has a cost.
- **Hub people as a society:** other contractors who are your teammates,
  rivals, merchants, mentors and enemies, each with a life of their own.
  Rankings and reputation between them.
- **Hubs compete for worlds.** Two hubs can send people into the same world
  at once: races, sabotage, alliances, betrayals. That's where cheaters and
  rival protagonists meet.
- **Hub-world relations:** an expansionist world might be a hub's partner or
  target. A suppressing world might be a hub's punishment destination.
- **Independents:** some travelers belong to no hub and pay for it in
  safety.

**Hubs-and-heavens lane findings (2026-10-08).** Codex read Reincarnation
Paradise, Omniscient Reader, Shadow Slave, Reverend Insanity and Fated
Villain. Report and sources: gitignored
`docs/research/novels/hubs-and-heavens-2026-10-08/REPORT.md`. Paradise
material is from a machine translation, so treat it as uncertain against the
original.
- **Rival hubs are real in the source,** not just chapter titles: several
  named Paradises fight one war. They differ by **tactics**, and those
  tactics are scene-specific, not fixed personalities: one follows an
  arena-ranked leader, one grabs resources and avoids the main objective,
  one sends a coordinated order instead of loners.
- **A hub is several roles that can be split:** home, employer, patron,
  referee and portal owner. Omniscient Reader splits them across sponsors,
  factions and the infrastructure; Paradise bundles them.
- **Each contested world needs its own objective,** not one progress bar:
  take a core, hold coordinates, meet a shared resource quota by a deadline,
  sabotage, protect locals. Scoring and abandonment rules differ per contest.
- **Hub society is ordinary services:** guides, fees, markets, guilds, arena
  reputation, temporary contracts, members asking about rest and overtime.
- **Unknown in the sources:** the price of quitting, switching or defecting.
  We author those.

**The lane's ranked proposals (not decisions):**
1. Stance is a relationship with a named authority, not one world opinion:
   local law, environmental fit, patron support and world-will pressure are
   separate. Aid can come with a leash.
2. Keep Weibao's rule that every cap has a discoverable way past it, with a
   price; label counters we invent as original.
3. Each hub gets a short charter: home, eligibility, rank permissions,
   shops and currencies, missions, return conditions, enforcement, and
   rules for quitting, expulsion, switching and defection.
4. Give rival hubs tactics and economies before more names.
5. Each contested world gets an objective card: shared or personal quota,
   control, deadline, sabotage, settlement, the cost of leaving.
6. Scope D2a to a mechanism authored per world (see the D2a note below).
7. Show hub society through recurring services and negotiated duties;
   reputation differs by audience.
8. Expansion and home defense are actors with material goals: raid,
   conquest, settlement, refugees, forced service.

## Protagonists and cheaters as other characters (proposal, 2026-10-07)

Builds on [Enemy protagonists](ENEMY_PROTAGONISTS.md) and
[Run-defining advantages](RUN_DEFINING_ADVANTAGES.md), which are research
only; nothing here is implemented.

- **Other people have cheats too:** a system, a regression, a golden finger,
  an old grandpa in a ring, a stolen bloodline. They run on the same life
  framework as the player: their own ambitions, growth, people and endings.
- **Ally, rival, enemy or bystander.** Hostility is a moment in a
  relationship, not a fixed role. You can sponsor a protagonist, steal their
  chance, warn them, replace them, or just run the inn they stop at.
- **They notice you.** A regressor sees you change their timeline; another
  transmigrator recognizes future knowledge in what you do. Cheaters compete
  for the same rare chances.
- **Fate applies.** Book protagonists are protected by draft D2a; cheaters
  in original worlds may not be.
- **The player's own cheat** is one origin among many, not a default.

## Cheats that hurt (proposal, 2026-10-08)

Weibao: a cheat can be detrimental; in some book the first cheat stole the
protagonist's luck. (Which book is unconfirmed. Fated Villain shows fortune
theft by a villain; the hubs-and-heavens lane covers its fortune cards.)

A cheat card states what it gives **and what it wants**. Proposed kinds:
- **Blessing:** helps, with a price you can see.
- **Parasite:** feeds on its host: luck, lifespan, memories, emotions, or
  the growth of the skills it boosts.
- **Con:** lies about what it is. A "system" that is a demon, a jailer, a
  rival's tool, or a hub's leash.
- **Trap:** planted by an enemy, a world will or a hub to mark, track or
  harvest you later.
- **Debt:** pays now, collects later, with interest, possibly from your
  heirs.
- **Rival cheat:** two cheats in one host fighting over it, or a second
  cheat that steals from the first.
- **Cursed gift:** real power with a hard flaw (Shadow Slave's Aspect and
  Flaw).

**Play around harmful cheats:**
- You find out by symptoms first: bad luck streaks, gaps in memory, a
  hidden stat dropping, people reacting strangely.
- Removing, taming, starving, selling or turning a cheat against its maker
  are quests.
- Other people hunt cheats: thieves, sects, a world will that hates them.
- A harmful cheat can still be worth keeping. The choice is the drama.
- The same cheat can be a blessing in one world and a parasite in another,
  depending on the world card.

### Cheat tiers, clean cheats, cheat fusion and system shops (2026-10-08)

Weibao asked for tiers of cheats, cheats with no or little known drawback,
cheats that absorb each other, and system shops.

**Cheat tiers (proposed; the names are placeholders):**

| Tier | Scope | Example |
|---|---|---|
| Knack | One small edge | Always know the time; never get lost |
| Gift | One skill or stat, strongly | Woodcutting grows triple; perfect memory |
| Golden finger | A whole method of growth | A system panel, a jar that copies items, a grandpa in a ring |
| Fate-class | Bends events or the world | Luck theft, regression, a daily revival |
| Origin-class | Touches world rules | Makes or rewrites concepts; owns a world |

Cheats move between tiers: they grow with use, evolve at breakpoints, or
fall a tier when starved or damaged.

**Cheats with no or little known drawback.** These exist and are wanted.
Their limits come from the outside, not from a price tag:
- **Scope:** strong, but narrow (perfect memory doesn't win fights).
- **Attention:** the cheat is clean, but people who notice it want it.
- **Rarity of fuel:** free to use, but needs something rare to grow.
- **Unknown drawback:** "little known" can mean "not yet known". Some
  truly have none; some reveal a price decades later. The player can't
  tell which at first.
- **World fit:** clean in one world, suppressed or parasitic in another.

None of the audited books has a truly drawback-free cheat (Warlock, Gluttony,
Kairos and A Novel Concept all state a price). Clean cheats are therefore an
original choice, and outside limits like these are what keep them fair.

**Cheats that absorb each other.**
- **Devouring:** a cheat eats another (from a defeated rival, an item, a
  dead host) and gains a feature or tier. A rival cheat may try to eat
  yours.
- **Merging:** two cheats in one host fuse into a stronger one, maybe
  unique, with traits from both; the fusion can carry both drawbacks.
- **Upgrading by collection:** a system that completes "sets" of absorbed
  abilities, like roguelike relic sets.
- **Rejection:** some cheats refuse each other, and holding both costs
  stability or sanity.

**System shops.**
- A shop sells skills, items, bloodlines, lifespan, information, world
  tickets, and cheat upgrades for points earned by deeds, kills, quests or
  worlds visited.
- **Shop rules to vary per cheat or hub:**
  - Stock rotates, and rare items show only at higher tiers.
  - Prices drift with demand and with how much the shop "likes" you.
  - Some goods are bought incomplete and need practice to master (the
    understood and usable bars). In Gluttony, bought skills and methods
    still need a foundation to use.
  - Some goods are bait: the con and trap cheat kinds above.
  - Buying from the shop raises a hidden debt or attention stat.
- **Shops compete:** a hub shop, a system shop and a black market price the
  same thing differently, and each tracks your loyalty.
- **Selling to the shop:** sell skills, memories or years back for points,
  a dark trade that ties into trading lifespan.

### Pure cheats and absolute knacks (Weibao, 2026-10-08)

Weibao: some cheats should just be cheats, no drawback and just as
overpowered; and knacks can be overpowered too, simply because of a word
like *always* or *never*.

**Pure cheats.** Allowed as their own kind next to the costed ones. A pure
cheat has no price at all, not even a hidden one. What keeps the game
interesting is not a price but:
- **Scope:** what the absolute word covers, and exactly what it doesn't.
- **Interpretation:** a world or enemy that reads the rule literally.
- **Rarity:** pure cheats are the rarest finds, so most lives never get one.
- **What it usually doesn't do:** by default a perfect cheat doesn't make
  friends, raise a child or stop you aging. A cheat that does is possible,
  as its own rare find.

**Absolute knacks: power from one word.** A small scope with an absolute
qualifier is a knack on paper and busted in play:

| Knack | Why it's busted |
|---|---|
| *Never gets lost* | Finds hidden places, walks out of mazes, finds the way between worlds |
| *Always wakes at the right moment* | No ambush works while you sleep |
| *Never forgets a face* | Disguises, shapeshifters and memory-wipes fail on you |
| *Always knows the time* | Time-loop and time-ratio worlds can't confuse you |
| *Food never spoils in your hands* | A merchant empire; preserved elixirs |
| *Never misses what you aim at* | Combat, crafts, and later concepts |
| *Animals always trust you* | A beast-tamer life, spies everywhere |
| *Cannot be lied to in writing* | Contracts, forgeries, and cons fail |
| *Always lands on your feet* | Falls, and later fortune itself |

Rules for absolute knacks:
- **The word scales with tier.** At Knack tier "never gets lost" covers
  roads; at Fate tier it covers your destiny. Growing the knack widens what
  the word covers, which ties into concept tiers.
- **Absolutes collide.** "Never misses" against "can never be hit" is a
  story. The higher tier wins, or both break, or the world decides.
  *(Power-scaling lane, 2026-10-08: no general tier-wins table; each collision declares precedence, a narrower meaning, or stays unresolved.)* *(2026-10-10: that is the default. A world that wants tier-wins can use it.)*
- **Worlds may limit the word, not the knack.** A suppressing world narrows
  *never* to *rarely*; leaving restores it.
- **Discovering the edge is play.** The Notebook records tested cases of
  what the word covers.

**Where priceless cheats exist in fiction (web research, 2026-10-08).**
Wikis blocked fetching, so most of this is from memory and unchecked; a
reader's note is in the session scratchpad. Close to truly priceless: The
Gamer (game UI, a calm mind, healing by sleep), Library of Heaven's Path
(sees the flaw in anything), Tensura's Predator and Great Sage, In Another
World With My Smartphone, and the Chinese sign-in, "10,000x return" and
"effort always pays" system genres. What limits those stories instead:
- **rate** (one reward a day, a level at a time);
- **input** (needs effort, a target, money to multiply);
- **scope** (bigger worlds keep appearing);
- **attention** (powerful beings notice);
- **plot** (conflict moves to politics, feelings or teaching).

**How fiction keeps absolute powers interesting** (Worm's Path to Victory,
Toaru's Imagine Breaker, JoJo's Stands, Jujutsu Kaisen's Infinity, One Punch
Man):
1. A named exclusion: "works on everything except X".
2. A narrow word: "never misses", but only with thrown things.
3. **Output is a step, not a result:** the power tells you how, and you
   still have to do it.
4. Conflict moves off the power's axis.
5. Information is the weak point: absolute only within what you know to
   ask.
6. Two absolutes collide.

Proposed default: a pure cheat or absolute knack is **one sentence with an
absolute word plus an exclusion list**, and the game checks the rule, not a
number. Example: "Always knows the way, except through places that want to
hide." Exceptionless cheats with no list stay available; collisions are
settled case by case.

**Jumpchain: the closest existing structure to this game.** A community CYOA
format (fan-made, copyrighted by its writers; we take only the structure):
- a Benefactor sends the Jumper through a chain of worlds;
- each world is a document with origins, perks, items, companions,
  scenarios and **drawbacks taken for extra points**, from a budget of
  about 1,000 points;
- a standard stay is ten years, then go home, stay or jump on;
- you keep everything bought, which is the appeal and why chains get
  silly;
- extras: a warehouse home base, a shared body-customizing pool,
  supplements that add a system across jumps, gauntlets with powers locked.

What to take: **drawbacks you choose for more power** (a voluntary harsh
life that pays out), **a per-world budget at entry**, **gauntlets** as trial
worlds with your powers sealed, and **a home base that travels with you**.
What to avoid: unlimited stacking with no world pushing back, which is
where Jumpchain players say it breaks; our world cards and suppression are
the pushback.

Other idea sources: SpaceBattles and Sufficient Velocity self-insert fics,
Worm CYOAs and power generators (powers born from a character's worst
moment), r/makeyourchoice, and Gamer crossover fics. Fan fiction of a book
is a fine idea source, and also copyrighted by its writers.

### Rewinds, farming and no-exception cheats (Weibao and Claude, 2026-10-08)

Weibao: rewinding to farm rewards is very strong but should be possible in
certain circumstances; some overpowered rewards are fine because you must
choose; some cheats can have no exceptions at all. Two Codex lanes are
studying this (see "Research lanes" below). Claude's starting view:

**When rewind farming is allowed** (first view; revised by the lane
findings below, which make costs optional):
- **The cheat says so.** A regression or loop cheat (Mother of Learning,
  You Have Died Again) is the circumstance. Farming is its point.
- **Each loop has a cost:** time, sanity, a charge, soul wear, or the world
  growing more hostile each loop.
- **The world remembers a little.** Watchers who notice loops, rewards that
  shrink on repeats ("first clear" only once), pools that run dry, or
  enemies who adapt.
- **What carries back is the dial:** memory only, memory plus skill
  understanding, or (rare, overpowered) items or stats. The rarer the
  carry, the stronger the cheat tier.
- **Rewinds are detectable** in worlds with diviners, which makes hiding a
  loop a skill.

**Choice as the price.** An overpowered reward is fine if taking it means
not taking another, and both are good. Pick one of three; picks that scale
with the risk you survived; one-time offers that expire.

**No-exception cheats.** A small set of cheats has no exception and no
price, by design. They stay interesting because:
- their scope is small and exact, even if absolute inside it;
- they collide with other absolutes, and a clear rule settles collisions
  (higher cheat tier wins, or both hold and the situation splits);
  *(Same correction: precedence is declared per collision, not by tier.)*
- the world and other people react to someone who has one.

**Jumpchain lessons (Claude's first read; the lane will check):**
- **A budget per world at entry.** Arriving somewhere new comes with a
  small set of local choices (origin, a perk, an item), so every world
  feels like a fresh start without wiping the old.
- **Drawbacks for power, chosen.** Take a hard rule for a world (no
  powers for the first year, a hunter on your trail) and get more choices.
  Players enjoy drawbacks they picked far more than ones forced on them.
- **Fixed stay lengths** give each world an arc. The life sim can use
  natural ends instead: a mission, a contract, an aging body.
- **Gauntlets:** a world where your powers are sealed and only skill and
  knowledge count, with a reward for clearing.
- **Companions carry over** and grow with you, which feeds the party and
  family ideas.
- **The warehouse:** a home base that travels, like the Paradise hub room.
- **Power creep is the known failure.** Long chains get silly when nothing
  pushes back. Our pushback is world cards, suppression and absences.

**More to consider (Claude, 2026-10-08)**
- **Translation tables between worlds.** A short per-world mapping of what
  your existing powers become on arrival ("a Frontier Master swordsman
  arrives as a high-rarity skill with no Concept").
- **Mixed-system bodies.** A person who has climbed three ladders has
  three sets of rules on one body; the conflicts between them are content.
- **A ladder you can't climb.** Some worlds' ladders refuse outsiders
  entirely (aptitude set at birth), so you need a local body or an heir.
- **Local catch-up.** Natives who are far ahead of you in their own ladder,
  so arriving strong elsewhere doesn't mean arriving strong here.
- **A per-world "first year" arc.** Every world's opening year has its own
  shape: survive (Crucible), get assessed (Gu Wilds), get a cover job (Fog
  City), survive the first nightmare (Dreaming), take your first mission
  (Paradise).
- **Rewinds as world features, not only cheats.** One world might loop by
  nature (a city that resets each month), making it a farming world with
  its own rules.

## How powers meet a new world (proposal, 2026-10-08)

Weibao: worlds read abilities differently, or you must channel them
differently, but some worlds just work too.

Each power gets one of five **compatibility modes** per world, set by the
world card and the power's kind:

| Mode | What happens | Example |
|---|---|---|
| **Works** | Same power, same rules | A sword skill in any world with swords; mana magic in another mana world |
| **Reread** | Same power, the world's system relabels it and adds its own layer | A Frontier skill becomes a Crucible skill with levels and rarity |
| **Rechannel** | Works only through a local medium you must learn | Qi techniques pushed through Gu; spells cast through tech in a tech world |
| **Weakened** | Works at a fraction until you adapt or translate it | Methods outside the world that fuels them (Warlock, Speedrunning) |
| **Blocked** | Doesn't work at all, with an in-world reason | Concepts in a world without them; magic in a null zone |

- **Worlds that "just work"** are friendly neighbors: same energy, similar
  rules. They're the easy travel routes and good places to rest a build.
- **Modes change over time.** Practice turns Weakened into Rechannel and
  Rechannel into Works. A weakened barrier or a world law change can flip
  modes for everyone.
- **Some powers travel easily:** ordinary skills and your body's basics,
  plus knowledge when something carries it. Some don't travel by default:
  things bound to a world's will.
- **The arrival screen shows the modes you know about;** unknown modes are
  found by trying.

## Aptitude can change (proposal, 2026-10-08)

Weibao: aptitude is changeable.

- **Aptitude is a starting point, not a sentence.** Every world that sets
  aptitude at birth also has ways to change it, each with a price:
  - rare treasures or Gu that refine aptitude (Reverend Insanity);
  - bloodline purification and race change (A Novel Concept, Warlock);
  - body rebuilds from pushing a stat past its grade (Gluttony's EX);
  - a new body in a new world (Warlock's reincarnation);
  - insight that opens a path talent couldn't (Mother of Learning's shaping
    skill grown by practice);
  - a cheat, a patron, or an heir with better talent.
- **Low aptitude has its own paths.** Slow, grinding growth that ends
  somewhere the talented never go (all paths lead to the Dao); a teacher's
  path; a crafter's path where aptitude matters less.
- **Aptitude can fall:** injury, a curse, age, a broken foundation, a
  harmful cheat.
- **Aptitude is per world and per path.** Poor at cultivation, great at
  machines.

## Tech worlds (proposal, 2026-10-08)

Weibao: tech worlds, like The Legendary Mechanic.

**What The Legendary Mechanic actually does** (from the local full-book
dossier, all 1,463 chapters read on 2026-10-04; digested 2026-10-08):
- **Knowledge, blueprint, item and use are four separate gates.** Reading
  gets you understanding, not a gun. A blueprint costs experience and still
  needs parts, strength and intelligence to build. Using a device needs its
  own threshold (level, class, energy pool, reactor output).
- **Blueprints come from** talent advancement, missions, reverse
  engineering, combining known blueprints (rising cost, hidden
  requirements, no refund for duplicates) and free invention. Prototypes
  fail first: thirteen failures before a mine design is recognized.
- **Repeating the same task stops giving experience;** varied work and
  improvement keep paying. A built-in anti-grind rule.
- **Class gates need knowledge, not money.** Higher knowledge is bought
  with money, potential points and access; ships and wealth can't buy a
  class change.
- **Several currencies:** experience, money, potential points,
  contribution, one-use cards.
- **Production is a path:** mass production needs combined assembly
  knowledge and materials; automation saves labor, not resources; machine
  control has a range and loses precision above a few units; later come
  legions, bases and fleets with supply shortages.
- **AI as a partner,** not a tool.
- **Selling tech:** a good demonstration creates demand; careless reverse
  engineering hurts the buyer.
- **The cheat is player knowledge.** The hero was a player of the game
  this world is, now living in it. He remembers rules (sometimes wrongly),
  watches respawning players whom locals see as deathless refugees, and
  later gains a panel to issue quests and build dungeons (one day inside
  per ten minutes outside). Game versions arrive as world eras with
  updates and raised caps.
- **Talent can change,** but only through costed items, missions and
  merges; no free respec.
- **Other power sources coexist:** espers, psykers, mages, martial energy.
  Counters are specific, and conversion between them is costly.
- **Small touches:** forced-open encrypted weapons destroy themselves;
  an EMP also hits your own gear; magnetic armor attracts rain and
  lightning; free institutional materials speed growth but drain the
  armory; endless energy doesn't heal accumulated damage.

**Proposals from it:**
- **A game-world card:** players who respawn, version updates as eras,
  patch notes as world events, and a former player whose knowledge goes
  stale with each version.
- **Four gates for every crafted power:** know, blueprint, build, operate.
- **Diminishing returns on repetition** as the default anti-grind rule in
  tech worlds, with variety rewarded.

**What makes a tech world distinct:**
- **Power is outside the body.** Machines, weapons, mechs and factories
  carry your strength, so your power can be stolen, broken, copied or mass
  produced.
- **Knowledge compounds.** Blueprints combine into better blueprints;
  research trees; inventing something new from two known designs (the
  tech version of fusion).
- **Scale is a path.** One engineer can arm a city. Factories, logistics
  and supply chains turn a crafter into a leader.
- **Maintenance and parts.** Machines wear and need parts; a supply line
  is a lifeline.
- **Money matters more.** Materials, workshops and sales fund growth.
- **Cyborg bodies.** Mechanical limbs and full bodies as life extension
  (already in "Life extension and body change").

**Tech world variants:** a frontier planet with salvage; a galactic
civilization with tiers of civilizations; a post-apocalypse where old tech
is magic; a steampunk city; a cyberpunk megacity with corporations as hubs;
a magitech world where spells are engineering.

**Tech meets other worlds:** in a magic world your guns may run out of
ammunition and your machines need local parts (Rechannel or Weakened);
magic in a tech world can be studied and turned into devices.

## Other world types worth cards (proposal, 2026-10-08)

- **Kingdom-building worlds:** you rule land; growth is population,
  buildings and law (Release That Witch, Six Ages).
- **Game worlds:** a VRMMO-style world with players, respawns and patches
  (Overgeared, The Legendary Mechanic's player angle).
- **Apocalypse worlds:** a system arrives and the world ends slowly;
  growth is survival and rebuilding.
- **Academy worlds:** school years, exams, rival students, clubs.
- **Ocean and sky worlds:** islands, ships, trade winds, sea monsters
  (Kairos's ships).
- **Underworlds and afterlives:** the dead have their own economy and
  ranks; death in one world can be arrival in another.
- **Mythic worlds:** gods walk around and quests are assigned by fate
  (Kairos, War of the Pantheon).
- **Small worlds:** one city, one valley, one tower, but deep.
- **Null worlds:** no power at all; only skill, knowledge and people
  matter. A rest stop or a prison.

## Superpower worlds (proposal, 2026-10-08)

Weibao asked for superpower worlds.

**What Worm actually does** (local full-book dossier, 304 entries read by
model readers with spot checks; digested 2026-10-08; paraphrased):
- **Four ways to get a power:** a natural trigger in a moment of extreme
  crisis; forced triggers by institutions (rarely successful and cruel);
  **bought powers** from a secret seller, with a catalog rated by
  uniqueness, strength and predictability, prices scaling with rarity,
  installment plans, discounts for future favors, and a small risk of
  becoming a monster; and borrowed or granted power from another person,
  at the cost of independence.
- **Second triggers** expand a power and echo the original crisis; they are
  rare and dangerous to pursue.
- **Growth by use:** fine control, practice that pushes limits, gear that
  improves daily, a power that grows with perceived threat, an inventor who
  stalled copying others and flourished experimenting.
- **Ratings are case by case** (for example a Brute and Blaster range for
  one villain, a Master and Thinker listing for another), used for threat
  levels, kill orders, prison decisions and escape estimates. Institutions
  admit the ratings are guesses.
- **Society:** a public hero agency with junior teams, damage fees, monitored
  gear and weekly passwords against mind control; rogues; policed secret
  identities; media that simplifies; regional cultures of power use.
- **Factions:** recruitment pitches, pay, territory rules (no killing, shared
  costs, collective retaliation), mercenaries whose loyalty follows salary,
  moles, political capture plans, emotional and mind control as leadership,
  doxxing as a weapon.
- **Enemies:** city-scale villains, a traveling band of killers that
  recruits by testing, and recurring disasters so strong that a truce code
  binds heroes and villains to fight together; breaking the truce brings a
  kill order.
- **Limits:** powers that can't affect certain targets (living things, the
  user), defenses that fail after one heavy hit, thinkers paying with
  migraines and question limits, precognition that doesn't work on the
  biggest threats.
- **Small touches:** passwords to detect mind control, memorials that list
  names without eulogies, candy as a thinker's recovery, a whole team taking
  a first-aid course, backup skills for when gear breaks, refusing
  interviews because of edited sound bites.

**Proposals from it:**
- **A power shop with a catalog,** installment debt and favors owed, with a
  small chance the power goes wrong. Fits the system shops and debt cheats.
- **A truce code** for world-ending threats, so rivals and enemies fight
  side by side and remember who broke it.
- **Ratings as public knowledge** that others plan around, and that you can
  manipulate by hiding what you can do.

**What makes them distinct:**
- **Powers arrive, they aren't trained into existence.** A crisis, an
  accident, a bought serum or birth gives a power. Training shapes how well
  you use it, not whether you have it.
- **One power, many uses.** A narrow power used cleverly beats a strong
  power used plainly; creativity is the main growth.
- **Society around powers:** heroes, villains, rogues who just make money,
  a government agency, teams, gangs, media, secret identities.
- **Ratings.** Institutions classify powers by what they do (movement,
  strength, control, invention, perception) so they can plan counters. Your
  rating is a public fact others plan around.
- **Escalation.** City-scale threats push rivals into truces.

**Ideas for the card:**
- **Origin crisis:** the worst day of your life shapes the power you get,
  so the childhood prologue and life events matter.
- **Second awakening:** another crisis can expand a power.
- **Inventor powers:** a specialty that builds impossible devices that only
  you can maintain (overlaps tech worlds).
- **Identity as a resource:** a mask protects your family; being unmasked
  is a life event.
- **Unwritten rules:** gangs and heroes keep a fragile code; breaking it
  brings everyone down on you.
- **Power blind spots:** many powers can't affect certain targets or their
  user, which makes interesting counters.

## Enemies who are reincarnators, regressors and transmigrators (proposal, 2026-10-08)

Weibao: enemies that are reincarnators.

- **They know things.** A regressor enemy knows your future; a transmigrator
  knows the book; a reincarnator knows a past life's techniques. Each kind of
  foreknowledge has a different blind spot.
- **Their tells:** acting before events happen, odd vocabulary, skills too
  advanced for their age, hunting someone nobody else has noticed yet.
- **What they want:** to fix their last life, to grab a protagonist's
  chances early, to prevent a disaster, revenge on someone who doesn't yet
  know they wronged them.
- **How you beat them:** change the future they know so their knowledge
  goes stale; reveal them to the world's watchers; out-wait them; make them
  allies, since they're often fighting the same disaster.
- **They notice you too.** If you're also a reincarnator, each recognizes
  the other's patterns; a race over the same rare chances begins.
- **Some don't know they are.** Flashes of memory, dreams, a skill they
  can't explain; your own past-life enemy reborn without memory.
- **A past-life enemy, reborn.** Someone you killed in a previous life
  comes back in this one, with or without memories.
- **Native resistance.** Some worlds have institutions that hunt
  reincarnators (the Fog City's churches, a heavenly will that dislikes
  deviants).

## Research as a standard system (proposal, 2026-10-08)

Weibao: standard research. A single research model used by every world,
read through each world's card (this extends "Research: projects on the
shared clock" above).

- **A research project has:** a subject, inputs (time, materials, a
  teacher or text, a place), stages, and outputs (understanding, a
  blueprint, a recipe, a technique, a world-card fact).
- **Every world's growth method is research in its own costume:** studying
  a Concept, digesting a role, refining Gu, designing a blueprint,
  translating a foreign method.
- **The two bars apply:** research fills understanding; practice fills
  usability.
- **Partial results are usable,** riskily ("incomplete skills").
- **Failure teaches:** failed attempts add to a hidden progress counter
  (thirteen failed prototypes in The Legendary Mechanic).
- **Research can be shared, sold, stolen or taught,** and others can
  research in parallel, so rivals can beat you to a result.
- **Research trees per world,** but always with a "free invention" exit for
  something not on the tree.
- **Teams and institutions research faster:** a sect, an academy, a guild,
  your own workshop with apprentices.

## Followers and factions (proposal, 2026-10-08)

Weibao: recruiting followers and creating factions.

**Followers.**
- **Kinds:** companions (close, travel with you), retainers (paid or sworn),
  students, believers, employees, summons and machines.
- **Why they follow:** money, protection, loyalty, ideology, love, debt,
  fear, a power that binds them. Each reason has its own way to break.
- **Followers are people:** they have lives, ambitions, families and limits
  on what they'll do. They age, leave, betray, surpass you, or die.
- **Followers grow:** you teach them and they become strong in their own
  paths; a student can found their own sect.
- **Limits:** how many you can lead well depends on leadership skill,
  reputation and organization; past it, loyalty drops and factions form
  inside yours.

**Factions you create.**
- **Kinds:** a family or clan, a sect or school, a guild or company, a gang,
  a hero team, a religion, a kingdom, a hub between worlds.
- **A faction card** (like a world card, smaller): purpose, rules,
  membership, ranks, resources, territory, enemies, reputation, and what it
  asks of members.
- **Growth loop:** recruit, train, take territory or markets, build
  facilities, set laws, deal with rivals.
- **Faction life:** succession crises, schisms, defections, scandals,
  alliances by marriage or treaty, wars.
- **Your faction outlives you:** it is part of the legacy and can be the
  next life's starting point, or its enemy.
- **Across worlds:** a faction can have branches in several worlds; each
  branch follows its world's card.
- **Factions run on the same framework as hubs** (charter, services,
  duties), so a big enough faction is a hub.

**Idle fit:** followers run routines (gather, craft, guard, research) while
you're away; managing them is the leader path's active play.

## Ancient monsters and plans from the past (proposal, 2026-10-08)

Weibao: ancient monsters, and revival plans set by past powers.

**Ancient monsters.**
- **Sealed, sleeping or buried:** under a mountain, in a lake, inside a
  star, inside a person. The seal is a limit with a way past it, for them.
- **They are history.** Old wars, ruins, place names, festivals and
  superstitions point at them; the knowledge layers (hidden, hinted, told)
  tell you before you meet them.
- **Waking is a world event** with warning signs: animals fleeing, dreams,
  cults growing, seals weakening (ties to weakened barriers).
- **They follow old rules.** Old oaths, old names, old weaknesses that
  modern people forgot; the scholar and investigator paths shine here.
- **Not always enemies:** some are guardians, some are bargainers, some
  are just old and tired. A sealed monster can be a patron, a teacher or a
  cheat (the old grandpa in a ring is a mild version).
- **Recurring disasters** (Worm's truce-binding threats): ancient beings
  that return on a cycle, so a long life sees several.

**Revival plans by past powers.**
- **The old master's contingency:** a dead or fallen great power left a plan
  to come back: a soul in a ring, an inheritance that's really a host
  search, a bloodline engineered to produce a vessel, a sect that exists to
  revive its founder.
- **You may be the plan.** Your talent, your cheat or your lucky find was
  placed by someone who intends to use you. A harmful cheat of the trap kind.
- **Plans have stages** set long ago: a prophecy, a cult, an artifact
  scattered in pieces, a date. The director can schedule them across a
  long life.
- **Ways to respond:** complete the plan and bargain, sabotage it, take it
  over and revive yourself instead, or let a rival be the vessel.
- **Your own revival plan.** Late in a life you can set one for yourself:
  a hidden inheritance, a soul anchor, an heir trained for it. It's one
  form of carryover between lives, and others can find and hijack it.
- **Old plans collide.** Two ancient powers' plans want the same vessel or
  the same date.

## Work (proposal, 2026-10-08)

Weibao: work.

- **Jobs are the backbone of a long life,** not a side menu. Vanilla's
  professions become careers with a workplace, a boss, coworkers,
  promotions, wages, layoffs and retirement.
- **Every world has its own job market:** a clan's duties, a factory shift,
  a hub's missions, a cover job in the Fog City, a hero license in Bay City.
- **Work trains skills,** so a day job is also progression (a guard grows
  perception; a cook grows Gluttony and Cooking).
- **Workplaces have people:** a mentor, a rival, a crush, an abusive boss,
  a union. Office politics is a small faction game.
- **Side work and cover jobs:** the idle loop of a hidden-strength life.
- **Owning the work:** from employee to shop owner to employer, which is
  the merchant and leader path.
- **Strange jobs:** dungeon cleaner, monster butcher, barrier warden, cheat
  appraiser, hub receptionist, ghostwriter of legends.

## More superpower ideas (proposal, 2026-10-08)

Weibao: superpowered. If this means Drew Hayes's *Super Powereds* (a
university that trains heroes, and a secret program to turn people with
uncontrollable powers into controllable ones), it fits Bay City's academy;
the book is not in the local library.

- **Uncontrollable powers as a start:** a power that hurts you or others
  until you master it. A clear early-life arc.
- **Hero school years:** classes, rankings, exams, rivals, a final trial
  that decides your license.
- **Power-suppression tech** and the people who want to stay normal.
- **Powers in daily life:** a strength power in a moving company, a
  weather power in farming, a healer in a hospital with long shifts.
- **Power inheritance:** children of capes inherit related powers or
  none, which feeds family and legacy.

## Next decompilation and absorption passes (proposal, 2026-10-08)

Checked `~/.codex/research/` on 2026-10-08. The "Not owned" table above is
stale: Crusader Kings III, Cultist Simulator, Kenshi, King of Dragon Pass,
Six Ages 2 and Wildermyth are now extracted. Tale of Immortal is installed
(Steam folder 鬼谷八荒) but its extraction holds only metadata.

Ranked by how much they feed the newest ideas (not dispatched):

| Rank | Game | Status | Lens |
|---|---|---|---|
| 1 | Tale of Immortal | Installed, not extracted | NPC lives, cultivation realms, aptitude changes, sects, ancient monsters, revival plans, a world that lives without you |
| 2 | Crusader Kings III | Extracted | Factions, followers' loyalty, succession, schisms, traits, hidden opinions, plans that span generations |
| 3 | Wildermyth | Extracted | Companions who age and change, legacy heroes, ancient foes that return across campaigns |
| 4 | King of Dragon Pass and Six Ages 2 | Extracted | Clan management, advisors, ancient gods and monsters, rituals, generational time |
| 5 | Cultist Simulator | Extracted | Work as a loop, followers recruited into a cult, forbidden knowledge, ancient powers |
| 6 | Kenshi | Extracted | Being a nobody, recruiting followers, founding a town and faction, harsh world, robot bodies |
| 7 | RimWorld | Extracted | Colonists as followers, research projects, storyteller events |
| 8 | Amazing Cultivation Simulator | Extracted | Sect building, disciples, aptitude |

**Not owned, worth considering:** Mount and Blade II: Bannerlord
(recruiting, clans, founding a kingdom), Battle Brothers (a mercenary
company with followers who age and die), Stellaris (tech research,
civilization tiers, ancient fallen empires that reawaken), Freedom Force or
a superhero management game for powers, Dyson Sphere Program for
production.

**Dispatched 2026-10-08:** Tale of Immortal extraction and audit (Weibao:
"send codex to extract tales of immortal, properly"). Weibao owns
Bannerlord, but it is not installed on this Mac (no Steam manifest found).
Battle Brothers is installed (about 1.6 GB, app 365360) and not yet
extracted. A Crusader Kings III and Kenshi pass on followers and factions
remains a proposal.

## More to consider (Claude, 2026-10-08, while Tale of Immortal runs)

- **Languages per world.** You arrive unable to read; language is a skill
  that unlocks books, gossip and better prices. Ties to the Hanzi field and
  the bilingual option. A translation cheat is a knack.
- **Faith as power.** Followers' belief becomes a resource; enough of it
  can make a person a god (an apotheosis path), and losing believers
  weakens you. Gods in mythic worlds run on this.
- **Law and crime.** Courts, jails, bounties, wanted levels per world, and
  a criminal record that follows you (or doesn't) between worlds.
- **Disease and plague.** Illness as a life event and a world event;
  healers and alchemists matter; a plague can carry between worlds through
  a thin barrier.
- **Pets and mounts.** A dog that follows you home, a beast companion that
  grows and ages, a mount that changes travel time.
- **Art and craft as legacy.** Songs, books, paintings and buildings you
  make outlast you and spread your legend; a book you wrote can teach a
  future life.
- **Emotions and mental health.** Grief, burnout, joy, trauma from battles,
  and recovery through rest, friends and therapy-like practices (the
  "full health doesn't fix loneliness" touch).
- **Dungeons as ecosystems.** Monsters breed, migrate and run out if
  over-hunted; a dungeon has a life cycle like a world.
- **Festivals per world:** each world card's deck has its own calendar of
  holidays, which mark years in a long life.
- **Your journal.** A first-person diary the character writes in their own
  aging voice, which becomes the shareable biography.
- **Rivals' lives continue off-screen.** Check in years later: married,
  crippled, a sect leader, dead.
- **Inheritance law.** Who gets your house, your techniques, your cheat;
  wills, disputes, heirs who fight over them.
- **Small worlds within people.** An inner world grown by a cultivator, a
  mind palace, a dream realm inside a friend.

## Evil inheritances, one-way openings and the way around (proposal, 2026-10-08)

Weibao: evil inheritances; things that only open one way; there is always a
way around everything.

**Evil inheritances.**
- **The inheritance is the trap.** A demonic art that slowly rewrites your
  personality; a technique that feeds its creator's sealed soul; a treasure
  that marks you for the creator's enemies; a bloodline awakening that
  carries an ancestor's grudges.
- **It works, and it's tempting.** Real power, fast. The cost shows later
  through hidden stats (corruption, sanity), symptoms, and how people react.
- **The inheritance judges you, in reverse.** Tale of Immortal's elders
  check good conduct; an evil inheritance checks cruelty, betrayal or
  greed, so a kind character can't take it without changing.
- **Infection and spread.** Some evil arts spread through students,
  partners or children; teaching one is a legacy and a curse.
- **Ways around:** purify it with a rare method, split the power from its
  will, bargain with the original owner, pass it on before it finishes,
  turn its creator's plan against them, or let it change you and own that.

**Things that open only one way.**
- **One-way doors:** a world you can enter but not leave the same way; a
  realm you can only enter once; a technique you can only learn by giving
  up another; a choice that locks the alternatives; a pact that can't be
  undone by the same means that made it.
- **One-time chances:** an inheritance that dissolves after one taker; a
  trial that opens once a century; a comet that grants one awakening.
- **One-way transformations:** becoming undead, a machine, a demon, a god.
  The road back, if any, is a different and harder road.

**There is always a way around** (extends "Limits exist, and there is
always a way past them"):
- A one-way door is one-way **for that method**. Another method exists
  somewhere: a different world's rules, a cheat, a rewind card that covers
  it, someone who already went back, a sacrifice, time.
- **The way around costs differently,** not necessarily more: time instead
  of resources, a relationship instead of power, a world's favor instead of
  a treasure.
- **The way around may be someone else's.** An heir, a student or a
  future life can finish what you couldn't undo.
- **Absolutes are the exception by design:** a no-exception cheat card
  can truly close something, and then the way around is to go somewhere
  its scope doesn't reach.
- **Discovery is the content.** The game never lists the way around; it
  is heard, researched, qualified and attempted, like every other route.

## Romance and dating mechanics (proposal, 2026-10-08)

Weibao: dating game mechanics. Claude's first take; the far-field lane will
add sourced detail.

- **Affection with layers:** acquaintance, friend, close friend, romance,
  partner. Each layer unlocks scenes and asks something of you (time,
  honesty, help with their problem).
- **Routes:** each romanceable person has a personal story arc that only
  continues if you show up at the right moments (Persona social links,
  Stardew hearts). Missing a moment can close a route or change it.
- **Calendar pressure:** limited evenings, birthdays, festivals and dates
  compete with training and work. Romance spends the same time as power.
- **Gifts with taste:** each person likes and dislikes specific things, and
  learning their taste is discovery.
- **Flags and memory:** they remember what you said and did, including in
  front of others.
- **Jealousy and rivals in love:** another suitor, sometimes a cheater or a
  protagonist.
- **Romance across worlds:** a partner who can't leave their world; a
  partner who follows you and has to adapt; long-distance between worlds.
- **Lifespan gaps:** loving someone who ages faster or slower than you.
- **Romance as power:** dual cultivation, soul bonds, a partner's patron
  world, a love that counts as an anchor to return to a world.
- **Breakups, divorce and grief** are life events, not failures.
- **Opt-out:** romance is optional; friendships and found family use the
  same layers without romance.

## Far-field inspiration (Claude's first list, 2026-10-08)

Genres far from progression fantasy, each with one idea to steal:

| Genre | Idea to steal |
|---|---|
| Farming and cozy sims | Seasons with crops that only grow at certain times; town upgrades funded by the player |
| Princess Maker style raising sims | A schedule of activities that shapes stats and ending; raising an heir as a playable mode |
| Visual novels | Branching scenes with flags, and endings you unlock across lives |
| Tycoon and management | Staff, prices, customers' moods; running an inn or a shop between worlds |
| Social deduction | A hidden traitor among your followers; votes in a sect council |
| Detective games | A case board in the Notebook where you connect clues to deduce a hidden fact |
| Blades in the Dark | Progress clocks for threats and faction plans; downtime actions between missions |
| Ironsworn | Oracles that roll prompts for events when the director runs dry |
| Time-loop puzzle games | Knowledge as the only progress across loops (Outer Wilds) |
| Creature raising | Feed, train, evolve and breed companions or Gu |
| Colony sims | Needs, moods and breaking points for followers |
| Deckbuilders | Techniques as a deck you draw from in a fight, so the build matters |
| Rhythm or timing | Breakthroughs or crafts with a timing minigame, optional for idle players |
| Board games | Area control between hubs; a doom track for ancient monsters |

## Tropes and ways to do them differently (Claude, 2026-10-08)

Popular Royal Road and web-novel tropes, each with alternative takes. A
trope is fine when the game knows it's using one.

| Trope | Usual way | Other ways |
|---|---|---|
| Running a sect | Founder recruits disciples, rises to the top | Run a failing sect deep in debt; be the sect's cook who secretly runs it; your sect is a front for something else; a sect of only one disciple who is better than you; inherit a sect whose old enemies come calling |
| Kingdom building | Isekai lord builds a modern kingdom | You're the advisor, not the king; build a kingdom of monsters; a kingdom that must move every year; a city on the back of a sleeping ancient beast |
| Dungeon core | You are the dungeon, adventurers come | You're the dungeon's janitor; a dungeon that wants to be a home, not a trap; two dungeons competing for adventurers; a dungeon that grows inside a person |
| Monster evolution | Reborn as a slime, eat and evolve | Evolve by friendship, not eating; a monster raised by humans; evolution chosen by the ecosystem's needs; you devolve if you stop fighting |
| Reincarnated as an object | A sword, a vending machine | You're a book being read; a house that remembers its owners; a ring that houses an old master (the grandpa, from the other side) |
| Tower climbing | Climb floors for rewards | Run a shop on floor 3 for decades; the tower climbs you; floors are other people's memories |
| System apocalypse | The world ends, a system arrives | You're the system's administrator; the system arrives in a world that already had magic; the apocalypse already happened a thousand years ago |
| Academy | Weak student rises | The teacher's view; the academy janitor; an academy for villains; you're a reincarnated old master forced to attend |
| Regression | Die, go back, fix everything | Regress into the villain; regress but your enemy also did; regress repeatedly and get tired; a regression that only covers one day |
| Cozy shop | Run a shop, slice of life | The shop is in a war zone; customers are gods; the shop sells memories |
| Summoned hero | Kingdom summons a hero | You're the summoned hero's servant; the summoning failed and summoned a cook; the hero refuses the job |
| Villainess | Reborn as the villainess, avoid doom | Embrace the villain route; the "heroine" is the real villain; the villainess is the regressor enemy |
| Healer | Support class becomes overpowered | A healer in a world with no death; a healer who can only heal by taking the wound; a hospital management path |
| Crafter | Crafting class becomes legendary | A crafter whose items gain souls; a crafter who only repairs; a crafting guild war |
| NPC awakening | A background character becomes aware | The whole village wakes up; the NPC knows the protagonist's script; you are the NPC |
| Litrpg party | A party levels together | A party that splits over loot; a retired party reuniting at 60; a party of rival cheaters |

**Ways to vary any trope** (a reusable kit):
- change the point of view (servant, rival, villain, bystander, the
  setting itself);
- change the scale (one shop, one city, one world, the multiverse);
- change the time (before it starts, after it ends, decades later);
- invert it (the weak one is weak and stays weak but wins another way);
- mix two tropes (dungeon core plus cozy shop);
- make the trope a world law, so it's normal there and strange elsewhere.

## Ideas we haven't had yet (Claude, 2026-10-08)

- **Reputation across lives.** People in a world remember your past lives'
  deeds as legends and judge the new you by them.
- **A museum of you.** Your old gear and letters end up in a museum or
  shrine, and visiting it can trigger past-life memories.
- **Contract magic.** Written agreements with real force; reading the fine
  print is a skill.
- **Ghost companions.** Dead followers who linger, with unfinished business
  that becomes quests.
- **Weather and seasons as enemies or allies,** with a weather-reading skill.
- **Sleeping as a game.** Dreams carry hints, other dreamers and training.
- **Gossip economy.** Information traded as currency between NPCs, which you
  can seed, intercept or buy.
- **A rival who plays the same game.** Another life-sim character running in
  parallel, with their own log you can read when your paths cross.
- **Collecting other people's stories.** A path where you're a chronicler
  whose records become power (a legend system that feeds back).
- **Making a world card yourself.** Late in a long run you design and seed a
  small world with your own laws.

## Power scaling, going multiversal and levels of infinity (Claude's first take, 2026-10-08)

Weibao: power-scaling ideas from the relevant subreddits, characters that
go multiversal, levels of infinity. A Codex lane is researching the
community sources; this is Claude's starting view.

**Default (corrected 2026-10-10):** each world keeps its own ladder. This
was mislabeled here as an "accepted rule"; Weibao never accepted it.
Conversion is now a dial: see [verse equalization](CHEAT_COSMOLOGY.md#verse-equalization-converting-between-systems)
and [where the idea came from](CHEAT_COSMOLOGY.md#where-the-no-universal-rank-idea-came-from).

**Scale as cosmology, not rank.** Layers of where you can act:
1. a person, a street, a town;
2. a city, a country, a continent;
3. a world;
4. a cluster of linked worlds (a hub's reach);
5. a multiverse (every world reachable by barriers);
6. beyond: outside the multiverse, where world wills, primordial Concepts
   and whoever made the barriers live.

Each layer is a **place you can reach**, not a number on a stat sheet. A
character "goes multiversal" when their deeds, powers or followers act
across layer 5.

**Levels of infinity as cosmology.** A multiverse with infinitely many
worlds, a higher layer that contains infinitely many multiverses, and so on.
In play: each layer up makes the one below look like a single map, and the
display changes (a world becomes an icon, a multiverse becomes a star map).
Concept tiers at the very top (Origin) can be described this way too.

**Power-scaling words as game ideas:**
- **Feats versus statements:** a feat is something seen; a statement is a
  claim. The Notebook already rates reliability; enemy pages separate seen
  feats from rumored statements.
- **Anti-feats:** times a strong being failed; they reveal hidden limits
  and are clues to a way around.
- **Hax versus stats:** mechanics versus numbers, the two kinds of
  difficulty Weibao asked for.
- **Durability negation, resistances, "no-sells":** absolutes colliding;
  the cheat-card collision rules decide.
- **Outliers:** one-time impossible feats that the world can't repeat;
  great legend material, and possibly a sign of a hidden cheat.
- **Plot armor:** the fate mechanism on a world card (D2a).
- **Composite characters:** a person whose powers come from several worlds
  at once (mixed-system bodies).
- **Speed blitz:** being so fast that fights end before they start; a
  ceiling that forces enemies to use hax.

**In-world power scaling:**
- **Hub ranking boards** where contractors argue who would win, with
  rankings that are often wrong.
- **Scholars of scale** as a path: they compare worlds and sell
  assessments of rivals.
- **"Who would win" betting** in a hub arena.
- **Your own legend gets power-scaled** by gossip, usually inflated.

**Going multiversal in a life:** a long climb where each layer reached
changes daily life. A world-level person still eats breakfast; a
multiversal person has followers in five worlds, worlds that notice them,
and enemies from outside. The game should keep ordinary life reachable at
every scale (retirement, family, a home that accumulates).

## Who the player is: the character, or someone living through them (proposal, 2026-10-08)

Weibao: is the player living through the perspective of a character, or the
character themselves, and how does that affect UI and notes?

**Three options:**

| Option | The player is | Log voice | Knowledge | Fits |
|---|---|---|---|---|
| A. The character | This one person | "You chop wood." | What this life knows | A single life; vanilla feel |
| B. The soul | What persists across lives; each body is a life | "You chop wood" now; past lives in the bio as "he" or "she" | Split: this body's knowledge vs the soul's memories | Reincarnation, transmigration, amnesia, legacy |
| C. A guide | An outside will (a system, a patron, a reader) nudging characters with their own minds | "Mira chops wood." | The guide's notes vs the character's beliefs | "AI clones play the game", heirs living on their own, the system-as-character idea |

**Claude's view: B, with C as an unlockable mode.** The soul fits nearly
everything already in this doc (carryover, memory-loss mode, regressors,
past-life flashes) and keeps the vanilla feel inside each life, because in
the moment you *are* the character. C becomes available later, for example
after death, when you watch an heir live or play as a patron or system.

**What B means for UI and notes (inside the original surfaces):**
- **Log:** second person for the current life; its voice ages with you.
- **Bio:** this life's history, and a "past lives" section written in third
  person, like a family chronicle.
- **Notebook in three layers:**
  - *This life knows:* what the current body learned; it can be wrong.
  - *The soul remembers:* carried knowledge, faded or fragmentary depending
    on the carryover rules.
  - *Confirmed:* facts the game verified (world-card laws you've tested).
- **Player knowledge versus character knowledge.** The player may remember
  things the character doesn't. The game doesn't punish that, but acting on
  something the character can't know leaves the "acting on future
  knowledge" trace other people can notice, which is fair and in-world.
- **Amnesia mode** simply empties the first two layers at birth.

**More modes and away behavior (2026-10-09).** Weibao: "it depends on the
character, and how we want things to be? would we be the characters, or
someone guiding them, or something else entirely? this changes the gameplay
flow accordingly." Proposal: identity is a mode of each life, and modes can
change in play. Beyond A to C:

| Option | The player is | Away behavior | Verbs |
|---|---|---|---|
| D. The system | The cheat or system inside a person | They choose among your offers | Quests, rewards, shops, warnings |
| E. The lineage | A house or bloodline | Heirs live on their own | Pick a focus heir, arrange marriages, set house laws |
| F. The fate | A storyteller instance | Everyone acts on their own | Bend odds, cast cards, nudge streams |
| G. A second soul | A passenger sharing a body | The owner acts; you contest control | Will contests, whispers, takeovers |

Away behavior by mode: A runs only standing orders; B acts on traits
shaped by the soul; C to G follow their own will under your influence.
Transitions: guide merges into the body (C to A), soul loses its body (B to
C), a system awakens in a person you lived as (A to D). Detail:
[Emergent systems Q8](EMERGENT_SYSTEMS.md#q8-who-the-player-is-decides-what-happens-while-youre-away).

## Sex, gender and bodies (proposal, 2026-10-08)

Weibao: gameplay differences between male and female.

Claude's view:
- **Stat differences are allowed** (direction, 2026-10-10). The dial
  covers world, species, body and setting: a world can be equal, a species
  can differ by sex, a body can trade strengths. Anyone can still take any
  path (see
  [how cutthroat to be](#bodies-constitutions-and-sex-how-cutthroat-to-be-proposal-2026-10-08)).
- **Differences also come from the world.** Each world card has a
  society dial: some worlds are equal, some have historical or cultural
  rules about gender (inheritance law, sect admission, who can hold
  office). Those are obstacles with ways around, like any other limit.
- **Bodies matter where the body matters:** pregnancy and childbirth as
  optional life events for bodies that can carry children, with time and
  health costs; dual cultivation and yin-yang methods in worlds that have
  them, written as complementary, not ranked.
- **Choice at birth** includes male, female and other options, and
  presentation and pronouns separate from body. Body swaps,
  reincarnation and new bodies can change sex across lives; the world reacts
  if it notices.
- **NPC reactions** follow each world's culture, written plainly, never as
  a hidden penalty.

## Crafting and research, the little stuff (proposal, 2026-10-08)

Weibao: little stuff like research and crafting, and types of crafting.

**Types of crafting** (each world card turns some on):

| Craft | What it makes | World flavor |
|---|---|---|
| Smithing and forging | Weapons, tools, armor | Vanilla Forging; soul-forged artifacts in cultivation worlds |
| Woodworking and carpentry | Furniture, bows, houses | Vanilla Woodworking |
| Tailoring and leatherwork | Clothes, bags, armor | Fashion as reputation |
| Cooking | Meals with buffs | Gluttony's essences, Crucible cocoa |
| Alchemy and brewing | Pills, potions, poisons | Tale of Immortal furnaces, Fog City potions |
| Herbalism and gardening | Rare plants, breeding | Farming seasons |
| Enchanting and inscription | Runes, talismans, scrolls | Crucible runes |
| Formation arrays | Defensive and gathering arrays on places | Cultivation sects |
| Gu refining and beast breeding | Living tools | Gu Wilds |
| Engineering and blueprints | Machines, mechs, factories | Salvage Reach |
| Puppetry and golems | Servants and soldiers | Followers you build |
| Architecture | Homes, towers, sect halls | Base building |
| Writing and bookmaking | Manuals that teach skills | Art as legacy |
| Art and music | Paintings, songs that spread legend | Bards, morale |
| Body crafting | Tempering, implants, grafts, clones | Bodies and life extension |

**Crafting mechanics worth having:**
- **Quality tiers** with a chance of a masterwork; better preparation (tools,
  materials, place, time of day) raises the odds (Tale of Immortal).
- **A maker's mark.** Items remember who made them; famous makers' items are
  worth more, and your mark is part of your legend.
- **Item histories.** A sword remembers its owners and kills; old items get
  names.
- **Discovery by experiment.** Combine things to find recipes; failures add
  hidden progress.
- **Repair, upgrade, disassemble, reforge.** Breaking an item down teaches
  its recipe (reverse engineering).
- **Signature works.** A once-in-a-life masterpiece that defines a crafter.
- **Assistants and apprentices** raise output and learn from you.
- **Mass production** for workshops and factories, with automation saving
  labor, not materials.
- **Crafting with concepts.** At high tiers, a Severance concept makes a
  blade that cuts curses.

**Research, the little stuff:**
- **Hypotheses in the Notebook** that you test; a disproved one is still
  progress.
- **Libraries and teachers** speed research; some books are wrong.
- **Publishing.** Sharing a discovery brings fame and students, and lets
  rivals catch up; hoarding keeps the edge.
- **Plagiarism and stolen research** as rival behavior.
- **Research partners** with their own ideas; joint discoveries.
- **Dangerous research** with sanity or corruption costs (Fog City).

## Is card gating the best way? (Claude, 2026-10-08)

Weibao: is card gating optimal, or are there better ways?

The engine-extension lane's answer (see its report,
`docs/gm/engine-extension-2026-10-08/REPORT.md`): **cards describe
contracts; they don't invent behavior.** A new kind of interaction still
needs a handler in code. Cards make variants cheap once the behavior exists.

**Alternatives, and where each wins:**

| Approach | How it works | Wins at | Weak at |
|---|---|---|---|
| Cards (data declarations) | Worlds and powers declare rules; one lookup resolves them | Many variants of known behavior; readable by agents and Weibao | New kinds of behavior; card bloat |
| Tags and components (Caves of Qud, ECS) | Everything carries small tags (*fire*, *living*, *sealed*); systems react to tags | Emergent combos and synergies; cheap new items | Hard to explain why something happened |
| Simulation-first (Dwarf Fortress) | Materials and bodies have properties; outcomes come from physics | Surprise; deep consistency | Expensive to build and to run in a browser |
| Scripts per world | Each world gets code hooks for its unique laws | Truly unique mechanics | Sprawl (today's 59 `*_host.js` files) |
| Generated content | Rules or events generated from parameters | Endless variety | Sameness; weak voice |

**Claude's view: a hybrid.** Cards declare *what is true where*; tags
let things combine without someone writing every pair; a small number of
handlers (scripts) implement each genuinely new behavior once, for every
world to reuse. Generation fills gaps (Ironsworn-style prompts) but never
replaces authored voice. Keep cards small with inheritance (a place
inherits its world; a variant cheat inherits a base cheat) so they don't
bloat.

## When things happen: pacing by life and scale (proposal, 2026-10-08)

Weibao: what level to do certain things.

| Stage | Roughly | What opens |
|---|---|---|
| First hour | Vanilla opening | Nothing new is visible; skills, village, first fights |
| Early life (first sessions) | Vanilla mid-game | Routines and habits, the household, gossip, first ambition, the life log |
| Young adult | After the first real breakthrough or career step | Breakpoints and branches, research projects, first followers, first rumor of another world |
| First crossing | A deliberate milestone, not forced by default (a summoning or abduction origin can force it) | One world, its entry picks, compatibility modes, a return path |
| Middle life | Several worlds or one deep one | Factions you lead, a hub, cheat finds, rivals with cheats, concept tiers |
| Late life | Mastery and legacy | Teaching, a sect or company, revival plans, inheritances, the soul's carryover |
| Later lives | After the first death | Past-life memories, the soul layer, harder origins, unlocked modes |
| Multiversal | Many lives in | Barriers, world wills, ancient beings, owning a world |

The first crossing and the first death are the two biggest gates. Each gate
opens by deed, not by a level number, and usually has more than one way in.

## Bodies, constitutions and sex: how cutthroat to be (proposal, 2026-10-08)

Weibao: gameplay differences between gender and constitution; we can be
really cutthroat.

**What already exists:** vanilla v0.6 character creation already picks
race, height, age and gender (`src/character_creation.js`). Races and height
define stat multipliers with trade-offs, though they are not applied yet (see
the creation section below) (for example a cat-eared race gets
more agility and dexterity, less strength and health, `src/races.js`).
Gender currently shows only a tooltip and a few forms of address.

**Constitutions** are the natural extension: special bodies with real,
sometimes harsh, trade-offs, in the spirit of cultivation novels' special
physiques. Examples (original names):
- *Hollow Vessel:* absorbs any energy fast, leaks it just as fast.
- *Iron Marrow:* near-immune to poison and disease, can't use most
  elixirs.
- *Cold-Blooded:* great at night and in winter, sluggish in heat.
- *Fated Child:* luck bends toward you; so do disasters.
- *Broken Meridians:* blocked from one whole path, gifted at another.
- *Ancient Blood:* a dormant bloodline with a sealed will in it.

Constitutions are found at birth (often hidden until tested), changed by
treasures and rebuilds (aptitude can change), and meaningful per world:
a constitution can be a gift in one world and a curse in another.

**Sex and gender, with "cutthroat" in mind.** Options for Weibao:
1. **Symmetric trade-offs by body,** like the existing races: each body
   gets different strengths, none strictly better.
2. **World-driven differences only** (Claude's earlier view): no base stat
   differences; each world's society and laws treat people differently,
   sometimes harshly, with ways around.
3. **Both:** small symmetric body trade-offs plus world societies.

Claude's view: option 3 is the most "cutthroat" that stays fair. Harsh
worlds can be genuinely unequal and dangerous, because that's a world law
the player can leave, fight or exploit. *(2026-10-10 direction: sex and
gender stat differences are allowed, set per world, species, body and
setting; a harsh setting can make a body choice costly.)* Difficulty is chosen at birth; ironman and harsh-world settings
remove safety nets.

**Cutthroat in general:** permadeath in harsh modes, followers who betray,
rivals who steal your chances, worlds that suppress you, cheats that eat
their hosts, and the knowledge that a wrong choice can't be undone the same
way. Always paired with ways around and with gentle modes for players who
want them.

## Character creation per world: nothing is cosmetic (proposal, 2026-10-09)

Weibao: rather than "choose your hero", the creation text can change for
each world. Human? High human? Random starting traits? Trait points? Then:
"Nothing has to be truly cosmetic", and genetics, constitution, bloodlines
and more to consider. Plan accordingly; ideaboard for now.

**What the code does today (read, not run).** One upstream panel
(`index.html` `hero_creation_panel`, `src/character_creation.js`) runs once
per save under a single heading key (`ui create`) with the note `ui
cosmetic`. It picks name, gender, height, age and race. Races define stat
multipliers in `src/races.js`, but the file header says bonuses are off and
the multipliers only reach tooltips (`src/display.js`); race XP multipliers
are commented out. Height bonuses sit behind `use_height_bonuses: false` in
`src/config.js`. `src/conditions.js` can already gate content on race.
`chooseSimulationOrigin` (`src/simulation.js`) is a one-time origin claim,
not a creation screen. Entering a world keeps the same body
([Paradise delivery](worlds/ORIGINS_AND_WORLD_TIMELINES.md)). *Correction:*
the Bodies section below said races "carry stat multipliers"; they are
defined but not applied.

### The screen belongs to the world card

Each world card authors its own creation screen: the heading, which layers
it asks about, and whether each layer is chosen, rolled, hidden or
inherited. The vanilla panel stays as the home world's version. Example
headings:

| World kind | Heading | Feel |
|---|---|---|
| Home frontier | "Who wakes in the clearing?" | Vanilla picks, now with real effects |
| Cultivation | "The spirit-root test" | A ceremony rolls aptitude in front of the clan |
| System or contract hub | "Status window" | Arrive as yourself; the system reads you and assigns a grade |
| Soldier book world | "Muster roll" | A clerk records origin, trade and village; your body is your own |
| Tech | "Citizen intake" | Genome scan, implant slots, class and debt |
| Superpower | "Awakening day" | A latent power rolls at sixteen, possibly a dud |
| Reincarnation | "You are born" | No choices at all; everything is rolled and hidden |

### Layers of a person

Every layer must pass the [gimmick depth checklist](#every-little-gimmick-gets-mechanics-proposal-2026-10-08):
how you get it, grow it, exceed its limit, combine it, how people react,
how you lose it and what it passes on. A layer can be cheap in one world
and central in another.

| # | Layer | Usually | What it does | Later change | Sources (audited or referenced) |
|---|---|---|---|---|---|
| L1 | Species or race (human, high human, half-blood, beastkin, construct, spirit, tree) | Chosen or inherited | Base body, lifespan, stat caps, which paths accept you, which worlds fear you | Race change, ascension, bloodline awakening | Vanilla `races.js`; Kenshi bodies; [tree bodies](worlds/ORIGINS_AND_WORLD_TIMELINES.md) |
| L2 | Genetics (heredity) | Inherited, hidden | A small set of genes from both parents; carried traits skip a generation and show in heirs | Gene therapy in tech worlds, elixirs, curses, mutation | Crusader Kings 3 congenital traits and dynasty |
| L3 | Constitution or physique | Rolled, often hidden | Harsh trade-off bodies (Hollow Vessel, Iron Marrow) | Treasures, rebuilds, [aptitude change](#aptitude-can-change-proposal-2026-10-08) | [Bodies section](#bodies-constitutions-and-sex-how-cutthroat-to-be-proposal-2026-10-08); Gluttony EX rebuilds |
| L4 | Bloodline | Inherited or dormant | Purity, awakening stages, sealed ancestral will | Purification, merging, theft, sealing | [Bloodline checklist](#every-little-gimmick-gets-mechanics-proposal-2026-10-08); A Novel Concept; Warlock |
| L5 | Aptitude (spirit roots, talents) | Rolled per axis | Growth speed per element, weapon or path | Treasures, failures lower it for a time | Tale of Immortal multi-axis aptitude; Reverend Insanity grades |
| L6 | Body build: sex, height, age, build, handedness, senses | Chosen | Small symmetric trade-offs: height trades reach for stealth; start age trades lifespan left for skills and knowledge | Injury, prosthetics, age | Vanilla height and age; Kenshi limbs; Wildermyth scars |
| L7 | Temperament | Rolled, then shaped | Moods, needs, which events the director offers, what you do while away | Experience shifts it slowly | CK3 traits and stress; RimWorld pawn traits; [who the player is](#who-the-player-is-the-character-or-someone-living-through-them-proposal-2026-10-08) |
| L8 | Family and birth | Rolled and frozen | Parents, siblings, wealth, birth order, real NPCs who remember you | Marriage, adoption, disowning, feuds | BitLife birth roll; [generated families](worlds/ORIGINS_AND_WORLD_TIMELINES.md); Tale of Immortal NPC families |
| L9 | Birthplace, culture, faith | Chosen or rolled | Languages, local knowledge, baseline reputation, which laws bind you | Emigration, conversion, exile | [How each world treats you](#how-each-world-treats-you-proposal-2026-10-08) |
| L10 | Background or upbringing | Chosen | Starting skills, kit, debts, contacts, a hidden past that can surface | Careers replace it; the past can catch up | Battle Brothers backgrounds (history, traits, kit, wage); Kenshi recruit motives |
| L11 | Fate, omens, star sign | Hidden | Weights which events and encounters find you | Fortune tellers reveal; fate can be severed | [D2a fate](#draft-decisions-awaiting-review); [hidden stats](#hidden-stats-proposal-2026-10-07) |
| L12 | Soul and past lives | Carried | Memories, skills that wake on contact, karma | Fades or deepens by carryover rules | [Mode B soul](#who-the-player-is-the-character-or-someone-living-through-them-proposal-2026-10-08) |
| L13 | Origin cheat or system | Chosen, rolled or none | The run-defining advantage | Per its cheat rules | [Cheats that hurt](#cheats-that-hurt-proposal-2026-10-08); [run-defining advantages](RUN_DEFINING_ADVANTAGES.md) |
| L14 | Flaws and defects | Chosen for points or rolled | Real costs: a limp, a debt, a curse, a hunted name | Cured, paid off, or turned into strength | Battle Brothers traits; Fallout-style tag flaws |

**The "cosmetic" fields get jobs too:**
- **Name:** a clan name grants relatives and enemies; true-name magic
  worlds make it a weakness; fame attaches to it.
- **Looks:** beauty shifts social and romance events (BitLife, CK3); a
  distinctive face makes you easy to recognize for pursuers and witnesses
  ([encounters and pursuit](ENCOUNTERS_AND_PURSUIT.md)), which makes
  disguise a real tool.
- **Gender and sex:** the [society dial](#sex-gender-and-bodies-proposal-2026-10-08)
  plus body events, and stat differences where the world, species, body or
  setting sets them; no hidden penalty.
- **Eye or hair colour:** marks a bloodline when it awakens; strangers in
  the right world react.
- **Voice and handedness:** small touches for singing, oratory and
  dual-wielding.

### How each layer gets set

| Mode | How it works | Good for |
|---|---|---|
| Chosen | Pick from the world's list | Species, background, build |
| Point-buy | A world budget; flaws refund points | System and game worlds; players who like builds |
| Rolled and frozen | Seeded at creation; reload never rerolls ([origins rule](worlds/ORIGINS_AND_WORLD_TIMELINES.md)) | Family, aptitude, constitution |
| Rerolls with a price | A few rerolls cost lifespan, karma or a meta currency | Making random starts fair without savescumming |
| Hidden | Exists from birth; revealed by a test, a doctor, a diviner or an awakening | Constitution, bloodline, fate, recessive genes |
| Inherited | Computed from parents (or the host body) | Genetics, bloodline, family, species |
| Earned later | Added mid-life | Bloodlines, constitutions, cheats |

Claude's view: every world offers all three doors, so nobody is forced into
one style. **Quick start** (rolled, one click), **Curated origins** (3 to 6
hand-written starts per world, each changing your first useful actions,
not only numbers) and **Full creation** (point-buy across the layers the
world allows). Point-buy needs the most balancing, so it ships last.

### Born, arriving or taking a body

This decides which layers a world's screen can touch. Not every entry is
open in every world; see entry routes below.

| Entry | Body layers (L1 to L6) | Life layers (L7 to L10) | Soul layers (L11 to L13) |
|---|---|---|---|
| Born here | Rolled or inherited here | Built here | Carried from the soul |
| Arrive as yourself | Kept from your home world; the world reads and grades them | A local cover identity: papers, background, rank | Kept |
| Take a host body (transmigrate) | The host's | The host's debts, ties and reputation | Yours |
| Possess or share | The host's | Contested with the host | Both souls |

Arriving is where translation matters: a bloodline that is noble at home
can read as monstrous here, and a constitution can be a gift in one world
and a curse in another ([how powers meet a new world](#how-powers-meet-a-new-world-proposal-2026-10-08)).

### Genetics, made a system

- A handful of genes per person, not a biology simulator: two copies each,
  dominant or recessive, plus world-specific genes (a spirit-root gene, a
  mutant X gene in a superpower world).
- Children roll from both parents, so who you marry and adopt matters
  ([romance](#romance-and-dating-mechanics-proposal-2026-10-08), [lineage
  mode E](#who-the-player-is-the-character-or-someone-living-through-them-proposal-2026-10-08)).
  Inbreeding raises defect odds (CK3); a small mutation chance keeps
  surprises coming.
- Reading genes is a per-world service: a physician's guess, a diviner, a
  bloodline test stone, a lab sequencer. Before that, the log only hints.
- **Guardrail:** species, fantasy bloodlines and world genes carry
  mechanics. Bloodline, species, constitution and physical body differences
  carry real stats: superhuman bodies have superhuman stats. Real-world
  ethnicities never carry stats; that is authoring policy, not a game
  rule. Unequal societies stay world laws the player can
  fight or leave, as in the Bodies section.

### Layers interact, so starts stay interesting

- **Synergy and conflict:** a fire spirit root plus a Cold-Blooded
  constitution conflicts; Ancient Blood plus a matching background
  ("raised by the clan that sealed it") opens a story chain.
- **Each world validates its combinations:** no free product of labels
  ([origins rule](worlds/ORIGINS_AND_WORLD_TIMELINES.md)). Impossible
  combinations are unlocks, not errors: "a high human born to farmers" can
  require a meta unlock or a cheat.
- **Hard starts pay out:** a harsher start can grant meta rewards, a
  title, or rarer events, in line with "cutthroat with ways around".

### Worked examples (original names)

- **Home frontier.** Vanilla panel with real effects: race multipliers on,
  height bonuses on, start age changes lifespan and starting skills. Add
  background (farmhand, runaway apprentice, retired soldier at 40) and one
  rolled quirk.
- **Cultivation world, "spirit-root test".** Roll five element roots in
  public: the clan's reaction is a real event (sect offers, a jealous
  cousin). Constitution hidden until the first breakthrough. Clan bloodline
  inherited from family; a branch-family birth caps resources early.
- **Contract hub, "status window".** You arrive as yourself; the system
  grades your existing body and hands out points to assign. Its grade can
  be wrong if your power is unknown to it, which is a hook.
- **Soldier book world, "muster roll".** Keep your body; choose a recorded
  trade and village. Your recorded origin decides who vouches for you, your
  first posting and which lies you have to keep up.
- **Tech world, "citizen intake".** Genome scan reveals genes your home
  world never tested; class sets debt and access; implant slots trade
  against your cultivation or magic.
- **Superpower world, "awakening day".** Latent power rolled and frozen;
  a dud power can later evolve (the [skill evolution](#skill-evolution-and-combination-how-stories-do-it)
  path).

### Questions for Weibao (answered below)

- **Q1.** Which entries does the first book world allow: arrive as
  yourself only, or also born or host body?
- **Q2.** Point-buy everywhere, or only in system and game worlds?
- **Q3.** Should rerolls exist, and what should they cost?
- **Q4.** How visible are hidden layers at creation: fully hidden, a vague
  hint, or a paid early test?
- **Q5.** Turn vanilla race and height bonuses on in the home world, or
  replace the upstream race roster with one written for these worlds?

### Weibao's answers (2026-10-09)

- **Q1 entries:** first "it feels like it should always be possible",
  then corrected: "not necessarily", some worlds need a break-in such as
  stealing a source body or transmigrating, following how the book does it.
  See [entry routes](#entry-routes-how-you-break-into-a-world-2026-10-09).
- **Q2 point-buy:** "maybe it depends on the starting point and more, and
  cheat and other stuff as well."
- **Q3 rerolls:** "depends on the world and stuff and more."
- **Q4 hidden layers:** "everything is possible but should make sense."
- **Q5 race roster:** "we will need to adjust accordingly and consider all
  possibilities and more."

**How "it depends" resolves (Claude's proposal).** No global rule.
Creation is a stack of sources, and each one can add, remove or change a
creation option. Later sources override earlier ones only where they say
so, and every override needs an in-world reason.

| Source | Can change | Example |
|---|---|---|
| Multiverse default | The baseline: every layer exists; entry routes come from the world card | Point-buy off, rolled layers frozen, hidden layers hinted |
| World card | Which layers it asks about, which are hidden, reroll rules, the point budget | A system world turns on point-buy; a reincarnation world hides everything; a fate-heavy world bans rerolls |
| Entry | What the screen can touch (see the entry table above) | A host body skips body layers; arriving as yourself gets a cover identity instead |
| Starting point (era, region, family, age) | Budget size, available backgrounds, what's revealed | A noble birth reveals bloodline at once; a 40-year-old start gets more skill points and less lifespan |
| Origin cheat or system | Anything its card declares | A system cheat adds point-buy in a world that has none; a fate-reading eye reveals hidden layers; a regression cheat lets you "reroll" by dying |
| Meta unlocks and difficulty | Extra rerolls, rarer combinations, harsher starts | Ironman removes rerolls; a past-life unlock offers high human to a farmer's child |

**"Should make sense" as a test.** A creation option is allowed when its
source can say why. Point-buy exists because a system assigns points.
Rerolls exist because something in the world explains them: a soul
choosing among bodies, a time loop, a gambling god. A hidden layer shows up
early only if someone can see it: a test stone, a diviner, a cheat. With
no reason, the option is off by default for that world but still reachable
through a cheat, a meta unlock or a cost.

**Q5 follow-up.** The upstream race roster becomes the home world's
starting list, not the multiverse list. Every world card supplies its own
species and adapts arrivals ("an elf here reads as a spirit-touched
human"). Proposal: keep vanilla races in the home world with their effects
turned on, and author new species per world as each world is built.

### Entry routes: how you break into a world (2026-10-09)

Weibao, correcting Q1: "not necessarily, sometimes you have to break in by
stealing a source body or transmigrating and more? consider how the book
does it and stuff accordingly."

So entries are not all open everywhere. Each world card lists its **entry
routes**, and the source's own method comes first: a book world copies how
its book brings people in. Other routes usually need the world's rules to
allow them; otherwise they come through a cheat, a meta unlock or a cost,
and some must be discovered, unlocked or paid for. A world can
have exactly one way in.

| Route | How it works | Creation it allows | Typical cost or catch |
|---|---|---|---|
| Walk in | A gate, rift, portal or road | Arrive as yourself | Barrier filters and suppression ([barriers](#barriers-between-worlds-and-the-multiverses-own-physics-proposal-2026-10-08)) |
| Summoned | Someone in the world calls you | Arrive as yourself, often with a granted class or blessing | The summoner's terms, a binding, a role you didn't choose |
| Assigned drop | A hub or system sends you with a prepared identity | A cover identity chosen or assigned by the sender | Mission terms, a time limit, the identity's own enemies |
| Reincarnate | Die and be reborn there | Born here: all layers rolled or inherited | Childhood, faded memories, no carried body |
| Transmigrate into a host | Your soul lands in someone dying, newly dead or empty | Host body and life; your soul | The host's debts, ties and fate; no inherited powers by default ([origins rule](worlds/ORIGINS_AND_WORLD_TIMELINES.md)) |
| Steal a source body | Take over a named character on purpose | That character's body, role and relationships | Fate protection ([D2a](#draft-decisions-awaiting-review)), people who knew the original, the world will noticing |
| Possess or share | Ride along with a living owner | Shared body | Will contests, the owner's goals |
| Object or creature | Enter as a sword spirit, a pet, a ring grandpa | No human body; strange senses and verbs | Dependence on a carrier |
| Avatar or projection | Send a clone, dream body or puppet | A weaker made body | A severed link kills the avatar, maybe hurts you |
| Descendant anchor | Be born into your own lineage or a marked family | Born here with chosen family | Needs an anchor left there earlier |

**Rules for routes:**
- The source's method is the default route and is always available in its
  world.
- Extra routes usually need a reason in that world's rules (the "should
  make sense" test); without one, a cheat, meta unlock or cost can open
  them. A sealed world may only accept transmigration; a hub world may
  only accept assigned drops until you find a back door.
- Routes can be found later: a ritual that opens possession, a cheat that
  lets you walk in, an anchor you left on an earlier visit.
- The route sets which creation layers the screen can touch, so each
  world's creation screen is really one screen per route.
- Each route marks you differently, which feeds the next part.

### Being observed: how others read you (2026-10-09)

Weibao on Q5: "how someone else with a system in another world observes
oneself and more."

**A reading is a claim, not the truth.** Every observer reads you through
their own scheme, so the same person reads differently to different eyes.
Your hidden truth stays one record; each observer gets a filtered view of
it.

| Observer | What they read | Typical error |
|---|---|---|
| Ordinary people | Looks, clothes, accent, manners | Judge by appearance; miss everything hidden |
| Local instruments | Test stones, mana gauges, gene scans, papers | Read only what they were built for; foreign power shows as nothing or as noise |
| Skills and eyes | Appraisal, identify, spirit sense | Limited by the observer's grade against your concealment |
| Another system | Its own status window, in its own fields | Maps your foreign power to its nearest stat, or shows "???" or "Unknown" |
| Institutions | Registries, sect rolls, bounty lists | Outdated; forgeable |
| World will or heaven | Your weight, foreignness, karma | Rarely wrong, but slow to act |
| Gods and higher beings | Nearly everything | Looking at them can hurt the looker |

**What follows from that:**
- **Schema mismatch is a tell.** A system that can't classify you may flag
  you as an anomaly, an intruder or a quest target. That's how locals and
  rival transmigrators can spot an outsider
  ([enemy transmigrators](#enemies-who-are-reincarnators-regressors-and-transmigrators-proposal-2026-10-08)).
- **Your own system can misread you, too.** It sees what it was built to
  see. Your notebook's "this life knows" layer can carry its wrong reading
  until something confirms the truth.
- **Concealment is a full toolkit:** masks, false status windows, power
  seals, pretending to be weak, forged papers and a fake species. Each one
  only fools some observer types.
- **Feeling the look:** strong people can sense being appraised, trace it
  back, block it or punish it. Appraising the wrong person starts a fight.
- **Readings change treatment.** Whatever someone reads you as sets the
  prices you get, who recruits you, who hunts you and which laws apply. A
  test stone that shows nothing can get you thrown out of the sect that
  needed you most.
- **Becoming someone else's content.** Another person's system can turn you
  into their quest ("defeat the anomaly", "recruit the stranger"). You
  become an event in their story, possibly against your will.
- **Translation tables per world pair:** an elf at home reads as a
  spirit-touched human here and as a beast elsewhere; a cultivation realm
  maps to a level in a system world, or doesn't map at all.

**More to consider:**
- **Many readings at once:** hover a person to see how each known observer
  type reads them, and how you think they read you
  ([hover details](#hover-details-and-text-as-a-medium-proposal-2026-10-08)).
- **Passing:** living as a species or class you aren't, with slips that
  pile up under stress, drink or injury.
- **Two systems in one body** that disagree about you, or compete for you.
- **A reading as an item:** appraisal reports, sect records and wanted
  posters can be bought, sold, forged or stolen.
- **Observing back:** gaining the observer's own scheme (copying a system's
  view) lets you see the world the way its natives do.

### Observation is a contest on both sides (2026-10-09)

Weibao on Q5: "it all depends on the thing, and how I am relative, how
capable they are or I am, or relevant skills, on both sides. Even more?"

**What decides a reading.** Each look is a contest. The observer side and
the observed side each bring factors, and the world sets the rules of the
contest.

| Side | Factors |
|---|---|
| Observer | Rank or realm; the reading skill and its grade; its scope (what it was built to see); instruments and items; bloodline eyes; knowledge of what you are; distance, time spent looking, sample size; attention and fatigue |
| Observed | Rank or realm; concealment skills, items and seals; disguise quality; how foreign your power is to the observer's scheme; what you're doing (fighting leaks more than sitting); body tells such as blood, eyes or aura; whether you know you're watched |
| World | Its rules for reading (some worlds have no status windows at all); local suppression; fate and heavenly secrets that blur certain people; places that block or amplify sight |
| Both | Prior contact (a mark or lock-on persists); relationship and consent (letting a friend read you); how the observer's system and yours relate |

**Outcomes are graded, not pass or fail:**
- **Nothing:** the look fails, or shows the observer only noise.
- **Surface:** what anyone can see.
- **Partial:** some fields shown, others "???", hidden or blank.
- **Wrong but confident:** concealment worked, or the scheme mapped you
  badly. This is the dangerous result, because the observer doesn't know.
- **Accurate:** within the reading skill's scope.
- **Deep:** history, intent, future risk; rare and costly.
- **Backlash:** the look reaches something far above it; the observer is
  hurt, marked or noticed.

**How the books do it (from our notes, mostly unverified MTL readings):**
- **Rank ceilings (Kairos).** Observe shows identity, rank, race, class and
  level only up to the observer's own ceiling. A higher rank pierces lower
  concealment, and falsification only works within its scope
  (`research/novels/novel-wave-2026-10-08/books/kairos-1/REPORT.md`,
  `kairos-2/REPORT.md`).
- **Observer-specific colours (Gluttony).** Nine Eyes colours depend on the
  observer, and colourless means unreadable, not safe. Unknown grades stay
  unknown after fusion (`books/gluttony/FACTS.md`).
- **Scope and lock-on (Reincarnation Paradise).** The personal panel shows
  rank and attributes but not real competence. An Eye that acquires a
  target keeps tracking through later concealment, and there are many
  listed concealment types (`trailblaze-reading/paradise-depth/`).
- **Sample size (Warlock).** The chip's analysis is limited by sample
  completeness and interference, and precision drops in some places
  (`books/warlock/REPORT.md`).
- **Blind spots and walls (Omniscient Reader).** Some protections block a
  sage's eye; a moral measurement fails to classify the protagonist; a
  concealment story stops working on observers who know it; looking at an
  outer god destroys the viewer's body (`full-book/omniscient-reader/POWER_RULES.md`).
- **Evidence differs by method (Reverend Insanity).** Appraisal misses
  tampering; a disguise survives ordinary scrutiny but blood nearly exposes
  it; Heaven's Will reads minds to flag otherworldly demons
  (`full-book/reverend-insanity/SYNTHESIS.md`).
- **Many weak senses (Lord of the Mysteries).** Spirit Vision, divination
  and passive sensitivity are separate, each limited; hostile beings
  distort divination; masks change face, voice and even a borrowed faculty
  (`full-book/lord-of-mysteries/POWERS.md`).
- **Range and soul sight (Mother of Learning).** Mind sense has short
  passive and longer active range; a golem disguise fails under soul sight;
  wards block friends too (`full-book/mother-of-learning/POWERS.md`).
- **The system is only an opinion (Shadow Slave).** A power assessment
  reflects the character's own understanding (`research/novels/shadow-slave/INTAKE.md`).

**Even more:**
- **Reading takes time and leaves traces.** A quick glance, a long study
  and a ritual give different depths; a ritual can be noticed.
- **Readings go stale.** You grow, hide or change; an old appraisal report
  is now wrong.
- **Readings stack.** Combining a test stone, gossip and a diviner gives a
  better picture than any one of them; this is the
  [hidden stats](#hidden-stats-proposal-2026-10-07) "fair estimate" rule.
- **Group reading:** a sect elder council, a registry or a guild database
  pools many weak looks into one strong one.
- **Training against it:** being watched often teaches concealment; looking
  often grows the reading skill (use-raised, per the vanilla rule).
- **Deliberate reveals:** showing your real level at the right moment is a
  move (the face-slapping trope), with consequences.
- **Fake signals on purpose:** a false aura that attracts the right sect,
  bait for a hunter, a forged bloodline to enter a clan.
- **Reading places and things uses the same contest.** Appraising an item,
  a ruin or a formation follows the same factors (Lord of the Mysteries'
  appraiser identifies item capabilities but doesn't remove their
  drawbacks).

### More entry routes, and paying to get in (2026-10-09)

Weibao on Q1: "I like this, there can be more, and 'paying for', well, in
terms of systems and more? So many possibilities."

**More routes:**
- **Invitation or mark:** a letter or mark opens a gate; the mark's grade
  sets your start (Gluttony's Bronze, Silver and Gold marks set stores and
  discounts, `books/gluttony/FACTS.md`).
- **World integration:** your world gets absorbed and a tutorial takes
  everyone (A Novel Concept, `full-book/a-novel-concept/WORLD_CARD.md`).
- **Scenario or quota:** a system forces entry by scenario, with transit
  errors (Omniscient Reader).
- **Random lower-realm body:** a spell sends your soul into a random weak
  body, with reserve bodies as backups (Speedrunning the Multiverse,
  `full-book/speedrunning-multiverse/REPORT.md`).
- **Loop or regression:** you re-enter the same world at an earlier time
  (Mother of Learning, Reverend Insanity's Cicada, Regressor's Tale).
- **Coercive contract:** death or the contract (Reincarnation Paradise,
  `research/novels/NS01_REINCARNATION_PARADISE.md`).
- **Dream, death or ritual:** dying, dreaming, a failed ritual or a fog door
  (Lord of the Mysteries' fog door needs enough spirituality).
- **Ride with someone:** enter as a companion, aide, familiar or passenger
  of an entrant (Gluttony allows an aide).
- **Invaded or merged:** your world collides with theirs and you're
  already inside.
- **Built or bought world:** a pocket world you own or a world seed.
- **Smuggled:** through a thin barrier spot, inside cargo, or a back door
  someone sells.
- **Hijack a summon:** intercept someone else's summoning, or take a
  summoned hero's slot.

**Paying to get in.** Payment is any cost the route's owner accepts, and
the payment shapes the start.

| Currency | How it's paid | Book examples (from our notes) |
|---|---|---|
| System points or merit | Spend earned points on entry, rank or services | Paradise: neutral-world entry needs rank 20 to 30, identity and services cost merit (`hubs-and-heavens-2026-10-08/books/paradise.md`) |
| Shop purchase | Buy a ticket, hearthstone, portal or entry rights | A Novel Concept's Hearthstone as a listed-only shop item; portal and time away as separate privileges |
| Coins and sponsorship | Pay a sponsor, buy a status tier | Omniscient Reader co-sponsor contract and paid status tiers (`hubs-and-heavens-2026-10-08/books/omniscient-reader.md`) |
| Fuel and coordinates | Pay in energy and need a known address | Omniscient Reader: fuel, coordinates, authority and Probability |
| Lifespan | Burn years | Reverend Insanity deductions cost lifespan; Fated Villain pays 15 years for a curse |
| Luck, fate or meta stats | Permanently lower a hidden stat | A Novel Concept's Fortuna gift halves Meta Chance |
| Memories | Forget something to pass | Paradise: leaving a faction can cost recent memories |
| Items or collateral | Leave something behind or mortgage it | Warlock's heirloom ring as an access mortgage; Paradise export bans |
| Contract terms | Owe service, time limits, secrecy | Paradise: 72-hour limits, secrecy sanctions, failure downgrades |
| Loss on arrival | Powers stripped or locked at the border | Gluttony: Earth strips Paradise abilities; Paradise locks abilities in reality |
| Other people | Someone else pays: a sacrifice, a host's life, captives' lifespans | Reverend Insanity drains captives' lifespans (a villain route) |
| Budget at creation | Spend a jump budget on origin, perks and drawbacks | Jumpchain-style budgets (`research/novels/time-rewards-cheats-2026-10-08/JUMPCHAIN_SOURCES.md`) |

**What paying buys:**
- **A better start:** a better identity, a higher mark grade, a better
  host body, more starting points.
- **A cheaper or safer crossing:** less suppression, keeping more items,
  arriving at a chosen place and time.
- **Return rights:** a return ticket, a storage locker at home, an anchor
  that lets you come back.
- **Skipping:** joining a group that already cleared a stage skips it
  (Omniscient Reader's nebula).
- **Information:** a briefing, a map, the identity's backstory.

**Cheap entry has its own price:** a random body, a hostile summoner, a
contract you can't read, or arriving stripped of everything. Debt to a
system is a story hook, not only a number.

**Rules:**
- The route's owner sets prices (a hub, a god, a system, a smuggler), so
  the same world can be cheap through one door and dear through another.
- Prices change with your rank, reputation, the barrier's state and past
  dealings.
- Paying with something you can't see (luck, fate, memory) shows its cost
  only later, in line with the hidden stats rule.

**Smallest playable slice when he says go (not started):** per-world
heading and labels from world data; vanilla race and height bonuses on
behind a save-compatible flag; a background picker and one rolled, frozen
quirk for the home world. Saves need a new creation record with a
migration that marks old saves as "created before layers".

## Systems, cheats, tech paths, universe walls and lore as gameplay (proposal, 2026-10-09)

Weibao: "more to consider? how other systems and cheats interact,
technology paths? breaking universe walls and stuff? How 'lore' for each
character plays into their gameplay? like scientist with whatever and
more? ... and then also leave other options open."

This extends [cheat fusion](#cheat-tiers-clean-cheats-cheat-fusion-and-system-shops-2026-10-08)
(cheats inside one host), [tech worlds](#tech-worlds-proposal-2026-10-08),
[barriers](#barriers-between-worlds-and-the-multiverses-own-physics-proposal-2026-10-08)
and [power scaling](#power-scaling-going-multiversal-and-levels-of-infinity-claudes-first-take-2026-10-08)
without repeating them.

### When systems and cheats meet

**Meeting outcomes.** When two systems, cheats or world rules touch (in two
people, or a cheat against a world), one of these happens. The meeting
uses the [observation contest](#observation-is-a-contest-on-both-sides-2026-10-09)
factors: tier, scope, origin and how foreign each is to the other.

| Outcome | What happens | Example |
|---|---|---|
| Ignore | Different scopes; they never touch | A crafting system and a luck cheat |
| Override | The higher tier or deeper origin wins | A world-rule cheat beats a skill cheat |
| Cancel | Both stop working near each other | Two time cheats in one room |
| Counter | One is built to beat the other | A seal-breaker against a sealing system |
| Translate | One reads the other into its own terms | Your cultivation shows as "level 40" in a system world |
| Trade | The systems deal: shared quests, exchange rates, item conversion | Two hub systems agree on a currency |
| Merge | They fuse (see cheat fusion) | Two cheats in one host |
| Devour | One eats the other | A rival's system hunts yours |
| Infect | One rewrites the other slowly | A parasitic system corrupts a clean cheat |
| Cascade | The clash damages the world | A reality tear, a barrier thinning |

**Systems as actors:**
- **Systems have makers.** A god, a hub, an old civilization, a dead
  player, nobody. Makers have goals, rivals and wars, and their systems
  carry those wars into people.
- **Systems notice each other.** One may warn you about another host,
  offer a quest to kill or recruit them, or refuse to work near them.
- **Systems have versions, bugs and admins.** Patches change rules; bugs
  can be exploited; an admin can notice an exploit and respond (ties to
  [rewinds and no-exception cheats](#rewinds-farming-and-no-exception-cheats-weibao-and-claude-2026-10-08)).
- **Systems can be studied.** Watch it long enough, test it, take it
  apart: the tech path below can reverse-engineer a system and eventually
  build one.
- **World wills react** to foreign systems: tolerate, tax, suppress or
  hunt them (Reverend Insanity's Heaven's Will flags otherworldly demons).
- **A cheat can belong to someone else:** a loan, a subscription, a
  sponsor's gift that can be revoked (Omniscient Reader's sponsors).

### Technology as a path, not only a world type

- **A path in every world.** Even in a cultivation world, someone can
  start measuring qi, building tools and writing it down. Tech is a way of
  growing: know, blueprint, build, operate (the four gates from the
  Legendary Mechanic notes), and scale through production.
- **Carrying tech between worlds** has layers: knowledge carries (if your
  memory does), blueprints carry as items, parts may not, and the physics
  may differ. Gunpowder may not burn where fire works by a different law,
  so knowledge can be partly wrong in a new world.
- **Magitech and hybrids:** run machines on qi or mana, measure magic,
  make formations reproducible. Hybrids can be stronger, or unstable where
  two laws conflict.
- **Uplifting a world:** bring a low-tech world forward, with real
  consequences: wars, new factions, a world will that objects, natives who
  overtake you.
- **Tech for crossing:** portal engines, dimensional drives, anchor
  beacons, barrier drills, observation satellites over a world map.
- **Tech for cheats:** scanners that read systems, jammers that block
  appraisal, a lab that copies a bloodline, eventually a built system.
- **Tech tiers** from hand tools to world engines and beyond, matching the
  power-scaling layers, so a scientist can also go multiversal.

### Breaking universe walls

The barriers section covers walls between worlds. These are the bigger
walls and the ways through them:

| Wall | Separates | Ways through |
|---|---|---|
| World barrier | Two worlds | Force, a key, erosion, a ritual, a tech drill, a cheat, a thin spot |
| World ceiling | A world's power cap | Ascension, leaving, breaking it (the world pays) |
| Multiverse wall | This multiverse from others | A concept-level power, a maker's door, a crack left by a war |
| Story or fate wall | What the plot allows | Severing fate ([D2a](#draft-decisions-awaiting-review)), outside knowledge |
| Fourth wall | The world from its readers | Omniscient Reader's Fourth Wall as a power; a character who notices they're in a game |
| Save or time wall | Lives, loops and saves | Regression, a cheat that remembers rewinds |
| The outside | Everything from whoever made the walls | The endgame of the power-scaling ladder |

**What breaking costs and causes:**
- Both sides leak into each other: monsters, laws and people.
- Someone notices: wardens, world wills, the walls' makers, cosmic police.
- The hole can stay and grow, or close and trap you.
- You get blamed for whatever comes through.
- **Repairing walls** is a path too: a warden career, a sealing craft, a
  sect that exists to keep the walls whole.
- **Walls can be made:** seal your own pocket world, wall off a village,
  hide a person from fate.

### A character's lore becomes their gameplay

A character's history (L10 background, L12 past lives, the host body's
life) is not flavor text. Every piece of lore gives:

1. **Knowledge:** recipes, facts and research shortcuts it unlocks.
2. **Skills and habits:** starting skills, plus routines they run well
   while you're away.
3. **A lens:** how they read the world. It changes the log text, which
   research trees they see first, and what they notice.
4. **Verbs:** actions only they get, or get earlier.
5. **Ties:** contacts, debts, enemies, people who knew them.
6. **Blind spots:** what their worldview gets wrong, especially in a new
   world.

**Examples:**

| Lore | Lens and verbs | Interacts with | Blind spot |
|---|---|---|---|
| Scientist | Measure, experiment, publish; magic shows up as data; a research speed bonus | Can analyze a system, reverse-engineer a cheat, start the tech path anywhere | Distrusts faith or intuition paths; physics that differs here makes some knowledge wrong |
| Programmer | Sees a system as code; spots bugs and patterns | Exploits system bugs; can attract admin attention | Assumes logic where a world runs on story or will |
| Gamer or reader of the book | Meta knowledge of the plot or the game | Knows quest routes and future events, until they diverge | Knowledge goes stale as the timeline changes (Legendary Mechanic, Omniscient Reader) |
| Doctor | Diagnose, operate, read bodies | Reads constitutions and genes early; heals as a career | Bodies of other species work differently |
| Soldier | Drill, command, logistics | Followers, sieges, the soldier book world | Rigid when rules change |
| Historian | Reads ruins, languages, old plans | Ancient monsters and plans from the past | Trusts records that are lies |
| Priest or monk | Ritual, faith, meditation | Divine paths, world wills, spirit beings | Doctrine clashes with other worlds' gods |
| Chef, farmer, smith | Craft depth; humble skills that can grow busted | Tie to skill evolution ("all paths lead to the Dao") | Seen as unimportant, which is also cover |
| Criminal | Lockpicking, forgery, smuggling, reading people | Concealment, fake identities, smuggled entry routes | Wanted somewhere; trusted nowhere |
| Child | Learns fastest; adults ignore them | Long life ahead, generated family | No strength, no authority |

**More rules:**
- **Lore stacks.** A host body's lore (a noble's manners) plus your soul's
  lore (a chemist's knowledge) gives combinations like a noble chemist who
  can found an academy.
- **Lore can be learned** in play: you can become a scientist in a world
  that has no science yet.
- **Lore can conflict:** a monk's vows against a cheat that wants
  slaughter; a doctor's ethics against a villain route. Breaking with your
  own lore is a real choice with a trace in the log and the bio.
- **NPCs have lore too,** using the same rules, so a scientist NPC can
  appraise your system and become a rival or a partner.
- **Lore unlocks dialogue** and changes how people talk to you, per
  [dialogue and interactions](worlds/DIALOGUE_AND_INTERACTIONS.md).

### Leaving other options open

All of the above should be **data, not code paths**: tagged facts that
world cards, cheats, lore and items add, remove or override. New kinds of
systems, walls, entry routes, lore and outcomes should be addable by
writing a card, not by changing the engine. Things explicitly left open:

- Which systems and cheats exist, and who made them.
- Whether a multiverse has an outside at all, and what lives there.
- Whether systems are alive, tools or something else, per system.
- Tech ceilings in any given world.
- Lore types beyond the examples, including nonhuman lore (a tree's
  memory, a sword's history, an AI's training).
- Interaction outcomes beyond the ten in the table.

## Verse integration, infinite-variant multiverses and levels of system (proposal, 2026-10-09)

Weibao: "verse integrations and more? stuff like Rick and Morty and more?
Levels of system? other stuff?"

Builds on [barriers and world mergers](#barriers-between-worlds-and-the-multiverses-own-physics-proposal-2026-10-08),
[parallel and fan-fiction worlds](#parallel-and-fan-fiction-worlds-proposal-2026-10-08)
and [systems and cheats meeting](#when-systems-and-cheats-meet). References
below are inspiration unless Weibao asks for a direct adaptation.

### Verse integration

One world's rules, system or people arrive in another and stay. This is
bigger than an entry route: it changes a whole world for everyone in it.

| Form | What happens | Inspiration |
|---|---|---|
| Integration | A system takes over a world; everyone gets a tutorial, classes and levels | A Novel Concept's tutorial; the system-apocalypse genre |
| Merger | Two worlds fuse; cards and laws mix | Warlock's finale |
| Overlay | Two worlds share one space and phase in and out | Ghost-world and mirror-world stories |
| Dungeon break | Pockets of another world erupt and spread | Gate and dungeon genre |
| Annexation | A multiversal empire, hub or church claims a world | Hub and conquest stories |
| Incursion | Two universes collide; one must be destroyed or both die | Marvel incursions |
| Crossover event | A temporary meeting of worlds that later separates | Comic crossover events |
| Collapse and reboot | Many worlds end and remake as fewer, changed ones | DC Crisis events, retcons |

**Integration as a campaign event, in stages:** first contact, then a
grace period or tutorial, then the new rules imposed, then resistance and
adaptation, then a new normal. Each stage changes prices, politics, who
is strong, and which old powers still work.

**What happens to existing powers:** grandfathered, converted into the new
system's terms (with losses or gains), suppressed, or made illegal.
A cultivator integrated into a level system might show as "level 1" while
being far stronger, the observation mismatch in action.

**The player's roles:** cause it, resist it, profit from it (sell
knowledge of the incoming system), broker between the old and new rulers,
or be the native who adapts fastest. Any world, including the home
frontier, could later face an integration as a world event.

### Infinite-variant multiverses (Rick and Morty and others)

A world card kind where worlds are nearly infinite and nearly identical,
and moving between them is cheap.

**Ideas worth taking:**
- **Cheap crossing tech:** a portal device that costs fuel, so hopping is a
  routine, not an epic journey. The fuel becomes the scarce resource
  (Rick and Morty's portal gun).
- **Near-copy worlds:** generated from a base card with one or a few facts
  changed. Cheap content, and good for exploring "one rule different"
  worlds procedurally.
- **Variants of you everywhere:** allies, rivals, replacements, a council
  of variants with its own politics (the Citadel), hunters who track
  variants.
- **Replace yourself:** ruin a world and move into one where your variant
  just died; take over their life and bury your own body. An entry route
  with a heavy price in the bio and in sanity.
- **Arbitrage:** buy cheap in one world and sell dear in a near-copy;
  multiverse customs and law enforcement exist to stop it.
- **Borrow a variant's skill:** briefly link to a version of you who learned
  something, triggered by an absurd action (Everything Everywhere All at
  Once). A strange but real way to gain temporary skills.
- **Canon events:** fixed points that resist change across variants;
  breaking one has consequences (Spider-Verse).
- **Time police and pruning:** an authority that deletes branches that
  stray too far (Loki's TVA). Straying is possible, but someone comes.
- **The weight of infinity:** if there are infinite yous, does this one
  matter? A sanity and meaning theme that the life-sim framing can answer:
  this life is the one being lived.

**Limits so infinity stays readable:** coordinates and anchors (you can only
reach worlds you have an address for), fuel, a world index you fill in as
you explore, and a few named variants who matter rather than infinite
faceless ones.

### Levels of system

[Cheat tiers](#cheat-tiers-clean-cheats-cheat-fusion-and-system-shops-2026-10-08)
measure how strong a cheat is. Systems also differ in **scope**: how many
people and worlds they run.

| Level | Scope | Example |
|---|---|---|
| S0 | No system; only world laws | The vanilla frontier |
| S1 | Information: status window, appraisal | A panel that only reads |
| S2 | Helper: quests, rewards, guidance | A personal golden-finger system |
| S3 | Economy: shop, points, exchange | A system shop |
| S4 | Authority: grants classes, titles and ranks to others | A sect or guild system you can hand out |
| S5 | World system: runs rules for everyone in a world | Integration systems; a game world's rules |
| S6 | Multiversal system: runs many worlds, contracts and hubs | Reincarnation Paradise-style hubs |
| S7 | Meta: makes, audits and deletes systems | The system of systems |
| Beyond | You become a system, or write the rules | [Mode D, the system](#who-the-player-is-the-character-or-someone-living-through-them-proposal-2026-10-08) |

**How levels work:**
- **Higher levels govern lower ones.** A world system can audit, patch or
  overwrite a personal one. Your personal system may turn out to be a
  subroutine of something bigger.
- **Permission levels inside a system:** user, trusted user, moderator,
  admin, root. Climbing permissions is a path of its own (privilege
  escalation), and the system's makers notice.
- **Systems grow:** upgrades by points, missions, feeding on other systems,
  or the host's growth. A personal S2 system can grow into an S4 that
  gives your followers classes.
- **Systems have personalities,** from a cold interface to a companion, a
  partner or a manipulator; this can change as it levels.
- **Ownership:** personal, shared, family, sect, world-owned, or rented.

### Other stuff to consider

- **Multiversal institutions:** bureaus, trade guilds, churches, banks and
  courts that span worlds and have local branches.
- **Audiences and sponsors:** beings who watch you as entertainment, pay
  for drama, and sponsor or punish you (Omniscient Reader's watching
  constellations). A streaming mechanic: your deeds earn attention as a
  currency.
- **Rankings and leaderboards** across worlds, which make you famous or a
  target.
- **Multiversal tournaments** and wars between hubs.
- **Multiverse news and rumors:** what other worlds hear about you.
- **Travel wear:** identity drift, culture shock, homesickness, languages
  translated by a system or learned the hard way.
- **Home as a fixed point:** however far you travel, a home world or base
  where your life is anchored, which ties back to the life-sim test.

**Left open:** which integration forms the first worlds use, whether the
home multiverse is finite or infinite, the names and makers of the
higher-level systems, and whether S7 and beyond exist at all in a given
cosmology.

## Building an infinite-variant world, Kang-style conquerors and cheat placement (proposal, 2026-10-10)

Weibao: "how can we implement, say if we wanted to have one of the worlds
be that? Consider Kang the Conqueror and more? We can also begin by
ranking cheats from various novels? Consider deepening each idea and more?
Especially consider each book world and fiction."

Saved alongside this section:
- [Cheat cosmology](CHEAT_COSMOLOGY.md): 25 cheats from our book notes
  placed by backing, scope, feats, and behavior inside and outside their
  world. (Replaced a first-draft ranking on 2026-10-10; see below.)
- [Book world entry matrix](worlds/BOOK_WORLD_ENTRY_MATRIX.md): every
  built, briefed and researched world with its source entry route, our
  routes, system level, observation rule, creation screen and deepening
  hooks.

### What the engine has today (code read on 2026-10-10, not run)

- **Worlds are hand-wired.** Each world has a content module, a host, a
  state validator and a native adapter, wired into `src/main.js`. The
  closest thing to a card is a `*_FOOTPRINTS` object (for example
  `src/proto23_world_content.js`). The content registry freezes at startup
  (`createContentRegistry`, `src/expansion_engine.js`).
- **Per-world saves are named keys** (`featureDestination`,
  `proto23Village`, `motherOfLearning`), and validators pin exact ids.
- **A definition-versus-instance split exists** (`createWorldInstance(definition,
  seed)` in `src/world_instances.js`), and `parentInstanceId` exists but
  is always null.
- **Seeded randomness exists** (`state.rng`, `deriveSimulationSeed`), but
  not per world, and about 60 places still use `Math.random`.
- **Travel** uses realm connections with fixed opening costs, a return
  marker and one active visit at a time (`src/realm_connections.js`).
- **Scenario rewind exists** for idle isolated scenarios
  (`rewindScenario` in `src/expansion_engine.js`). There is no timeline
  pruning or world deletion.
- **Migration** is hand-bumped schemas plus a v0.6 converter
  (`src/save_migration.js`); there is no general framework.

### How to build a variant world: the plan

The key idea: **a generated world is a seed plus a diff.** Store the base
card id, the seed and only what the player changed there. Everything else
regenerates the same way every time. That keeps saves small even with
hundreds of visited worlds.

| Step | What | Engine work | Playable result |
|---|---|---|---|
| V0 | Card layer | `deriveWorld(baseCard, overrides, seed)` returns a validated definition with deterministic ids (`variant.<base>.<seed>`) | Nothing visible; tests prove the same seed makes the same world |
| V1 | Instance map | One `variants` map keyed by instance id, a generic validator, a migration that adds an empty map, and a per-instance seeded stream | Old saves load unchanged |
| V2 | A portal and three near-copies | A portal device with fuel, connections created per target, a world index in the existing Notebook | Hop between three versions of the home Village where one fact differs (who runs the shop, the weather law, a price table) |
| V3 | Variants of you | A light actor copied from a snapshot of the player (name, skills, one divergence), not a full native body | Meet a version of yourself who took another path; trade, fight or recruit |
| V4 | Storage limits and pruning | Keep a few worlds live; the rest shrink to seed plus diff; a pruned world leaves a tombstone so history still cites it | Visit many worlds without save bloat |
| V5 | The authority | Time police as an encounter using the existing encounter-and-pursuit system; a "canon event" flag on facts that resist change | Changing a fixed fact draws a visit |
| V6 | The conqueror | A variant antagonist across worlds (below) | A campaign across variants |

**Gates per AGENTS.md:** each step ends in a browser check from a fresh
origin, with save, reload and import from V1 on. V1 changes persistence,
so it needs its migration before anything else ships.

**Dials for a near-copy world** (start with few, add more later): who is
alive, who rules, prices, one physics or magic law, the weather law, which
faction won a past event, which version of you lives there and what they
did.

**Deepening the variant world itself:**
- **Fuel economy:** portal fuel is the scarce resource; making it is a
  craft path; stealing it is a crime path.
- **Arbitrage and customs:** buy cheap in one copy, sell in another, until
  multiversal customs notice.
- **Your reputation leaks:** a variant of you did something terrible, and
  people in nearby copies blame you.
- **Variant council:** your variants form a political body with factions,
  votes and grudges.
- **Grief and meaning:** finding a world where someone you lost is alive.
  Staying there is a real choice, with the cost recorded in your bio.
- **A home anchor:** however far you hop, one home world stays yours.
  Losing its coordinates is a disaster.
- **Links to other worlds:** You Have Died Again's failed loops that
  persist as separate worlds, and Worm's parallel Earths, can reuse this
  engine.

### Kang the Conqueror and multiversal conquerors

What Kang brings, as inspiration (Marvel; not a direct adaptation unless
Weibao asks):
- **One man, many variants.** Killing one doesn't end him. His variants
  rule different eras and worlds, and they also fight each other.
- **A council of himself.** The variants hold a council, and its internal
  wars are exploitable.
- **The keeper at the end of time** (He Who Remains in Loki) prunes
  branches to stop his own variants from going to war. Removing the keeper
  unleashes the war. That's a choice with multiverse-wide consequences.
- **Conquest through time:** he brings future technology to rule past eras
  (his Rama-Tut identity in ancient Egypt).

**Mechanics for the game:**
- **A variant antagonist family:** one enemy identity with many variants
  across worlds, each with a different era, kit and temperament. Defeating
  one weakens the family, and the rest adapt or take over its territory.
- **The mirror conqueror:** the most dangerous variant can be a version of
  you, built from your own choices and skills. Each life you live can
  seed a new variant who took the darker path.
- **Divide and rule:** set variants against each other, ally with one, or
  take a seat on their council.
- **The keeper's bargain:** an authority who prunes branches offers you a
  job or a throne. Accept, and you become the time police. Refuse or kill
  them, and the variant wars begin.
- **Era conquest:** a tech-path character can do what Kang does: bring
  advanced tools to a low-tech era and rule it, with uplift consequences.
- **Other multiversal conquerors to borrow from:** Doctor Doom's Battleworld
  (a world patched together from fragments of dead worlds, a form of verse
  integration), Dormammu's time-loop bargain from Doctor Strange (a loop
  used as a weapon against a god), and Reverend Insanity's Fang Yuan as a
  regressor whose ambition never stops.

### Deepening the earlier ideas with the books

- **Creation screens per world** now have a heading and hooks for every
  world in the [matrix](worlds/BOOK_WORLD_ENTRY_MATRIX.md).
- **Integration worlds share one engine:** A Novel Concept, Omniscient
  Reader, Labyrinth of the Mad God and Solo Leveling differ only in dials
  (tutorial length, how old powers convert, dungeon breaks).
- **Rewind, loop and variant worlds share one engine:** Reverend Insanity,
  Mother of Learning, Regressor's Tale, You Have Died Again, Circle of
  Inevitability and the variant world all need branches, snapshots and
  pruning. Building V0 to V4 once serves all of them.
- **Cheat placements become card data,** so suppression, fusion and observation
  can act on one axis or backing at a time ([cheat cosmology](CHEAT_COSMOLOGY.md)).
- **The genetics layer's best first homes** are worlds where genes are the
  stat system or a bloodline is central: Genetic Ascension, Naruto, Harry
  Potter.

**Left open:** which base world the first variant world copies, the name
and fiction of an original conqueror family for the public build, and
how many live worlds a save keeps.

## Placing cheats, simple cheats and absorbing tropes (proposal, 2026-10-10)

Weibao: "I meant not to rank but to fit them into our cosmology. We need
to consider the feats and capabilities of each cheat, in its own world and
out of it. Simple cheats like 100x systems. We will need to place new
cheats as we get more book worlds. Consider more cheats, and how to
properly absorb tropes."

**Correction:** Claude swapped the first-draft ranking for placement,
citing a "no universal rank" rule that Weibao never accepted. Both are
now kept. [Cheat cosmology](CHEAT_COSMOLOGY.md) holds:
- **Backing decides portability:** soul, body, item, system, world law,
  patron, knowledge, or concept. Soul and item cheats travel; world-law
  cheats stay home; system cheats follow the system's reach; knowledge
  travels but decays.
- **A placement card** for every cheat: mechanism, the eight axes, backing,
  scope by feats only, feats and anti-feats, home and outside behavior,
  meetings, growth, outside checks, absorption forms.
- **25 cheats placed** from our book notes, plus villain cheats.
- **19 simple cheats** (multiplier return, sign-in, auto-cultivation,
  perfect comprehension, copy, gacha, life simulator, and more), with the
  rule: multiply one input and move the bottleneck. Pure number-go-up
  stays available with world pushback.
- **An intake for new book worlds:** extract, classify, place by feats,
  check meetings, find siblings, decide forms, re-place on better sources.
- **A trope-absorption method:** name the promise, collect
  implementations, find the engine and what breaks it, pick forms and
  pacing, keep subversions as variants, add a small touch, and test at the
  first session and at hour 50. Worked example: 10,000x return.

## Heirs, families and life beyond the first character (proposal, 2026-10-10)

Weibao: "for heir, there can be trade offs, like non loyal people can
choose not to be loyal, or what is left behind is little, say the first
guy gets destroyed and the heir is left with pretty much nothing since the
guy forgot to leave anything, what about heirs and families doing their
own things and more? Life beyond the first guy?"

Builds on the accepted heir direction (the heir inherits what was left
behind, [rules from scratch](RULES_FROM_SCRATCH.md#the-heir)) and on
[lineage mode E](#who-the-player-is-the-character-or-someone-living-through-them-proposal-2026-10-08).

### Inheritance is what survived, not what existed

- **Things can be lost before the heir arrives:** the house burns, enemies
  loot it, a war takes the land, a rival erases the records, the state
  seizes it, a thief got there first.
- **Forgetting to leave anything is real:** no will, nothing written, no
  apprentice, savings hidden where nobody knows. A sudden death leaves the
  heir with almost nothing.
- **Debts can outweigh assets,** and depending on the world's law the heir
  can refuse them, must pay them, or inherits the creditors as enemies.
- **Claimants contest it:** siblings, a spouse, a business partner, a sect,
  a lord, a fake heir with forged papers.

### Leaving a legacy is gameplay during a life

- Write a will; hide caches; leave letters; write books and recipes;
  teach apprentices; entrust items to friends; set up a trust, a shop or a
  sect that outlives you.
- **Preparation pays:** a life that plans its succession hands over far
  more. A careless or sudden death is harsh, and that's the point.
- **Hidden legacies:** a cache the heir finds later, a sealed letter that
  opens at an age, a technique hidden in a book's margins.

### People choose for themselves

- **Loyalty is per person.** Each follower, friend and family member
  decides based on how they felt about the old life, what they want, and
  how the heir treats them.
- **Outcomes:** stay out of love for the dead; stay for pay; leave; take
  their share and go; betray; claim the leadership; steal; become a rival;
  or wait to see whether the heir is worth following.
- **Apprentices** can surpass the heir, compete with them, or become their
  teacher.
- **Old enemies** remember too: some forgive, some come for the heir.

### Heirs are people, not copies

- **Who can be the heir:** a child, an apprentice, an adopted ward, a
  spouse, a stranger who finds your journal, your reincarnation, a variant
  of you, or nobody (the chronicle ends, or play moves to someone else).
- **Heirs have their own nature:** their own body, genes, talents,
  temperament and wants. A smith's child may want to be a poet. Playing
  them means working with who they are.
- **Trade-offs of a rich inheritance:** expectations, envy, the old life's
  enemies and obligations. **A poor one:** freedom, anonymity, no debts.
- **Refusing the inheritance** is a choice: walk away and start clean.

### Families live their own lives

- **Family members act on their own:** marry, have children, move away,
  feud, start businesses, die. The family is a living group, not a menu
  (Tale of Immortal NPC lives, Crusader Kings 3 dynasties).
- **Branch families** split off, rise or fall, and may challenge the main
  line.
- **Family standing:** a family name carries reputation, alliances and
  grudges across generations.
- **House rules** in lineage mode: inheritance law, marriages, who leads,
  what the family values.

### Life beyond the first character

- **The game continues across generations.** After the first life, play
  the heir, switch focus between family members, or play someone unrelated
  in the same world.
- **The world remembers ancestors:** legends (sometimes right, often bent), monuments,
  graves to visit, enemies who hunted your grandfather, old debts.
- **Unfinished business** carries on: a plan, a promise, a war, a project
  that takes three generations (a sect, a city, a cure).
- **Ancestors can return:** a ghost, a sealed will in the bloodline, a
  reincarnation who remembers, depending on the world's rules.
- **The soul as a thread:** in soul mode, the player continues as the soul
  and sees the family from the next body, possibly as a stranger to them.
- **Heirs in other worlds:** a descendant born elsewhere inherits only
  what a carrier brings across (rule 5).

### Fragments, legends, enemies and obscure routes (2026-10-10)

Weibao: "Consider fragments of power and other stuff as possibilities.
Legends, although often wrong, don't have to be wrong all the time. How
things happen might depend on the enemies as well."

**Fragments of power.** A power can break into pieces when its owner dies,
is defeated, or splits it on purpose.
- **What fragments:** a technique, a cheat, a bloodline's purity, a soul,
  memories, a god's authority, an artifact.
- **Where pieces go:** into heirs (each child gets one), into killers,
  into objects, into places (a mountain holds a shard), scattered across
  worlds, or sealed by the owner for safekeeping. Inspirations: Elden
  Ring's Great Runes held by demigods, Horcrux-style soul pieces, shards
  that rebuild a whole.
- **Collecting them:** a quest across a life or several lives; a partial
  set gives partial power; a full set restores the original or makes
  something new.
- **Others want them too:** rival heirs, the killer, sects, the
  fragment's own will.
- **Fragments change their holders:** a piece of an ancestor's will
  nudges your temperament; a shard of a fire god warms your hands.
- **Fusing fragments from different sources** works like cheat fusion:
  stable, unstable or something new.

**Legends can be right.** Accuracy varies by legend:
- **Exactly right:** an eyewitness wrote it down, or the event was simple.
- **Right in an unexpected way:** "he split the mountain" was literal.
- **Partly right:** true core, wrong details, wrong person.
- **Wrong:** propaganda, inflation, confusion with someone else.
- **Made true:** in some worlds belief and stories carry power, so a
  legend can make itself real (Omniscient Reader's stories as power).
- **The source matters:** an eyewitness, a bard, a family, an enemy and
  a state each bend a legend differently. Checking sources is a skill.

**Enemies shape what happens.** How an inheritance, a death or a legend
plays out depends on who the enemies are:
- **A respectful enemy** spares the heir, returns the body, or keeps the
  old feud honorable.
- **A vengeful clan** hunts the whole line for generations.
- **A thief** takes the valuables and leaves the records.
- **A purger** burns the records and the name, so the legacy is
  forgotten.
- **A curser** marks the bloodline.
- **A collector** wants the fragments.
- **Enemies have heirs too:** blood feuds pass down both sides; a rival's
  grandchild may become an ally.
- **The enemy's own nature decides the method:** an army besieges, a
  schemer frames, a monster hunts, a system issues a quest against you.

**Everything is possible in some way.** Weibao: "options exist when a
world, person or event makes them possible makes sense, but everything is
possible in some obscure way maybe, or just from carrying over from a
prior run?" So rule 1 gets two backstops:
- **An obscure route:** if no ordinary route exists, a rare one does (a
  hidden ritual, an outlier being, a forgotten artifact, a strange world).
- **Carrying over from a prior run:** something from an earlier life or
  run (a soul memory, a meta unlock, a fragment, a legend) can open what
  this life alone couldn't.

**More to consider:**
- **Heirlooms with memory:** an item that remembers each owner and
  teaches the next one a little.
- **Ancestral debts and blessings** that trigger at a set generation.
- **Legacy power that grows by being remembered:** the more people tell
  your story, the stronger your descendants' claim.
- **Disinheritance and adoption into another line,** taking that line's
  fragments and enemies.
- **Lost lines:** a family that died out leaves fragments with no heir,
  for anyone bold enough to claim them.

### Further ideas: trials, deaths, runs and lineages (Claude, 2026-10-10)

Weibao: "consider further and save all ideas accordingly." Proposals.

**How the death happened changes what's left.**

| Death | What the heir gets |
|---|---|
| Peaceful, foreseen | Time to prepare: a will, teaching, handover |
| Sudden | Whatever was already arranged; often little |
| Violent | What the enemy left (see enemies above) |
| Erased | No body, no fragments, records fading; only what others hold |
| Sealed, not dead | An ancestor sealed somewhere: a burden, a key, a future ally or threat |
| Missing | Presumed dead; inheritance in limbo; the ancestor may return to find it spent |
| Ascended or left the world | Gone but alive elsewhere; may send help, or never look back |

**Inheritance trials.** Ancestors can leave tests that pick a worthy heir,
as in Reverend Insanity's inheritance tests (`research/novels/full-book/reverend-insanity/`,
inheritance tests c1124-1130), where a test can injure and a rival can
tamper with the will inside it.
- **Make your own:** a player can build a trial for their heirs or for
  strangers: a riddle, a fight against your recorded will, a task that
  reflects your values.
- **Open or closed:** blood only, apprentices only, or anyone who passes.
- **Tampered trials:** enemies corrupt them; time decays them; a trial
  meant for your heir is won by a stranger.

**Runs versus lives: four kinds of carryover.**

| Kind | What it is | What can carry |
|---|---|---|
| Succession | Same world, later; a new person continues | What was left behind; legends; fragments; feuds |
| Regression or rewind | Same world, earlier; the world resets | Memory, by the cheat's rules; little else |
| Transmigration or rebirth | A different world or body | What the soul or a carrier brings (rule 5) |
| Meta | Above all lives | Unlocks, the soul's long memory, a chronicle, an obscure route opened before |

- **Returning to a world you lived in before:** later in its history,
  find your old grave, your legend, your descendants, and the enemies
  who outlived you.
- **A prior run leaves marks:** a regression-world may keep faint echoes
  (déjà vu in NPCs, a scar on the land) if its rules allow.

**Legends as gameplay.**
- **Shape your own legend:** act in public, pay bards, write a memoir,
  suppress rivals' versions.
- **Accuracy is a property of each legend,** found by checking sources.
- **Wrong legends have effects:** they attract the wrong enemies or
  allies, set expectations your heir can't meet, or hide the truth well.
- **Fame as power** in worlds where belief or stories feed strength.

**Enemies across generations.**
- **Long-lived enemies:** a demon who killed your grandfather is still
  there for you.
- **Enemies inherit your pieces:** the killer took a fragment; to restore
  the whole, the heir must face them.
- **Enemy reincarnations and heirs** keep a feud going after both
  originals are gone.
- **Enemy legends of you:** the other side tells your story as villainy.

**Succession politics.**
- **Who inherits is a world or house law:** eldest, chosen, divided among
  all, by trial, by strength, by vote.
- **Child heirs need regents,** and regents may usurp.
- **Splitting the inheritance** among several heirs weakens each but
  spreads the line.

**Lineage progression.**
- **A family manual:** each generation adds notes to the family technique
  or recipe book, so the line improves over time.
- **Family traits bred over generations** through marriages and genes.
- **A family vault or bank** that persists across lives and worlds, if
  a carrier lets it cross.

**More obscure routes.** When nothing ordinary works: a hidden ritual, an
outlier being's favor, a forgotten artifact, a world where it's normal, an
absurd trigger (Everything Everywhere All at Once), an in-fiction quirk in
a system, a dream, a death, a deal with something outside the world, or a
thousand years of patience.

### Small touches

- The heir finds a half-finished letter addressed to them.
- An old friend arrives with a debt, or a favour owed.
- A family recipe survives slightly wrong.
- A follower who left returns years later with a gift.
- The heir's first time at the grave changes their temperament a little.

**Build status:** the current game's heir still begins with "fresh body,
one lesson". This section is design only.

## Same player, related character: lore implications (proposal, 2026-10-10)

Weibao: "consider each book world accordingly, consider the lore
implications, since the player will be the same player, but the character
is different but related."

Per-world details are in [death, continuity and succession by world](worlds/SUCCESSION_BY_WORLD.md).
This section covers what holds across worlds. Each world still decides
how continuity works there (rule 2), and book worlds follow their book
(rule 3).

### What the player is, in the lore

The player persists while characters change. Each world explains that
differently, or doesn't explain it at all:

| The player is | In the lore | Fits |
|---|---|---|
| A soul | The same soul in a new body | Reincarnation worlds, Speedrunning, Mother of Learning |
| A lineage will | The family's accumulated will, waking in each heir | Clan worlds, Reverend Insanity's blood project, Naruto clans |
| A bloodline memory | Memories carried in the blood, surfacing as instinct | Bloodline worlds, Shadow Slave legacies |
| An heirloom | An object carrying the player from owner to owner | Artifact-spirit worlds (Fated Villain's ring spirit) |
| A system or contract | The system follows the line, not the person | System worlds, Paradise-style hubs |
| A fate thread | Fate picks up the next thread | Fate worlds |
| A story | The story continues with a new protagonist | Omniscient Reader's myth succession |
| Unexplained | The world never says; only the player knows | Worlds that don't model it |

### What links one character to the next

Blood, soul, apprenticeship, an heirloom, a name or title, a fragment of
power, a legend, a pact, a place, or a debt. Each link carries different
things (rule 5) and is seen differently:
- **Blood:** genes, bloodline, family standing, family enemies.
- **Soul:** memories by the world's rules, karma, soul scars.
- **Apprenticeship:** techniques, the teacher's reputation, rivals.
- **Heirloom or fragment:** the object's power and its memory of owners.
- **Name or title:** office, debts, legend, claimants.
- **Pact or curse:** obligations and marks that follow the line.

### Lore implications

- **Recognition is narrow.** Most people meet a new person. Only specific
  observers notice continuity: a diviner, Heaven's Will, an artifact
  spirit, a ghost, a system, an old friend who sees a familiar habit. The
  world can treat continuity as sacred (a reincarnated master), suspicious
  (a possessed child), hunted (an otherworldly demon), or invisible.
- **Relationships reset unless something carries them.** People from the
  past life relate to the new person, not the old one. A former spouse is
  now a great-grandmother; an old friend feels drawn to a stranger without
  knowing why; an old enemy recognizes a stance.
- **Claiming the past life's property** depends on the world's law and
  proof: an inheritance test, a soul check, a sealed letter, a witness.
  Without proof, it's a stranger claiming a dead man's house.
- **Knowledge leaks.** The player remembers more than the character
  should. Acting on it leaves a trace others can notice (the "acting on
  future knowledge" tell), or the character experiences it as intuition,
  dreams or déjà vu.
- **Debts, curses and karma follow the link,** often more reliably than
  power does (pattern 5 in the per-world file).
- **The character has their own nature.** A related character isn't a
  puppet. Their temperament, wants and loyalties can agree with the
  player's plans or resist them (second-soul mode for the extreme case).
- **Repetition costs something in loop worlds:** soul scars, branches left
  behind, people who no longer remember you.
- **Others continue too.** Rivals, enemies and companions can also
  reincarnate or pass to heirs, so feuds and friendships recur across
  lives in changed forms.

### How it shows in play

- **A continuity link record** for each new character: the link type, what
  passed, who can detect it, and how the world reacts. Shown in the bio as
  "Before you" or "Past lives", depending on the link.
- **The notebook layers** (this life knows, the soul remembers, confirmed)
  extend across lives: each link type fills a different layer.
- **Finding your own past:** graves, journals, legends, old enemies, an
  heirloom that warms in your hand. The new character can pursue the old
  life's business or ignore it.
- **Proof as a mechanic:** passing an inheritance test, a soul check or a
  bloodline stone to claim what was yours.

### Lone wolves: no family, no heirs (2026-10-10)

Weibao: "consider if someone chooses to go lone wolf, would it just be
their reincarnation trying to find their past life's stuff?"

Reincarnation hunting for its old things is one answer. A lone wolf has
several ways to continue, and the lone life itself plays differently.

**Living alone: trade-offs during the life.**
- **Costs:** no one covers the house while you're away; no one to nurse
  you, avenge you, or carry your name; every task falls on you;
  institutions trust you less.
- **Gains:** no hostages, no family debts, no heirs to protect, no one to
  betray you, freedom to vanish, fewer obligations; a lone life is harder
  to track and easier to hide.
- **Fiction:** the rogue cultivator without a sect, the wandering
  swordsman, the hermit in the mountain, Kenshi's nobody.

**What a lone wolf leaves behind.**
- **Hidden stashes** only they knew about.
- **A hermitage or cave,** perhaps with a trial or a recorded will inside,
  for whoever finds it (inheritance caves, as in Reverend Insanity).
- **Their body and gear where they fell.**
- **A legend,** usually told by strangers and enemies.
- **Changes to the world:** a road built, a monster killed, a village
  saved. The world itself is the heir.
- **A companion:** a pet, a familiar, an artifact spirit, a system.
- **Enemies,** who inherit the grudge with nobody to aim it at.

**Ways a lone wolf continues.**

| Route | How it works | What comes back |
|---|---|---|
| Reincarnation hunting the past | The soul is reborn and goes looking for its old stashes, cave and body | What survived and what the soul remembers |
| Corpse run | The next life retrieves the previous body's gear where it fell (Hollow Knight's shade, Dark Souls bloodstains, Diablo corpse runs) | The gear, if nobody looted it first |
| The stranger who finds it | A new character, unrelated by blood, finds the cave, the journal or the weapon | Whatever the find holds; the player continues through them |
| The deathbed choice | Adopt or name a stranger at the end: a beggar, a rival, a child met once | A small, fragile tie |
| The ghost or remnant will | A trace of the dead stays at the hermitage and judges visitors | A teacher, a trial or a curse |
| The companion carries on | The pet, familiar, artifact spirit or system seeks a new holder | The companion's loyalty, maybe your memories in it |
| The world remembers | Your deeds left marks the next character benefits from | Roads, saved villages, legends, enemies gone |
| A clean start | Nothing carries except what a prior run or meta layer brings (rule 1) | Freedom; nothing owed |

**Things to watch.**
- **Others get there first:** looters, the state, a rival, a sect that
  heard the legend.
- **Time decays what's left:** caves collapse, gear rusts, a remnant will
  fades or goes mad.
- **The past life's enemies** may be waiting at the stash.
- **Proving it was yours** works like any claim: a soul check, a key only
  you could open, a technique only you knew.
- **Some lone wolves aren't alone in the end:** the people they
  occasionally helped can show up as the closest thing to heirs.

**More to consider.**
- **Dead-man's switches:** a letter delivered if you don't return, a cache
  that opens after a year, a debt that triggers on death.
- **Found family:** a lone wolf collecting a few loyal companions over a
  life, who become heirs without blood.
- **Self-inheritance:** a lone wolf who plans to come back as their own
  reincarnation, hiding everything for themselves. In worlds with soul
  checks, a cave sealed to "my soul only".
- **The lone legend:** a lone wolf's legend may grow larger than a
  family's, because nobody corrects it.
- **Lone wolf in the bio:** the chronicle reads differently, with fewer
  names and more places.

### The next life is random unless you planned it (2026-10-10)

Weibao: "we can also take some control out of the player's hands by making
it random for the next game unless the prior character made specific plans
for self revival."

**The idea.** When a life ends, the next one is rolled: who you become,
where, when and how you're linked to the old life. Plans made during the
old life narrow or replace the roll. Without plans, you take what fate
gives.

**What gets rolled.**
- **The link:** heir, reincarnation, stranger, possession, the companion,
  a clean start.
- **The body:** species, bloodline, constitution, sex, talents (the
  creation layers).
- **The place and time:** same world or another; years, decades or
  centuries later; near or far from the old life.
- **The circumstances:** family, wealth, health, dangers, who is looking
  for you.

**What weights the roll, even without a plan.**
- **What the old life did:** karma, deeds, debts and grudges tilt the
  pool (a cruel life weights toward harsh births in worlds with karma).
- **What the old life left:** links that exist (a child, an apprentice, a
  marked place) make those outcomes likelier.
- **How it died:** a sealed death, a curse or a broken soul changes the
  pool.
- **The world's rules:** a reincarnation cycle, a soul court, a system,
  or nothing at all decides what's possible (rule 2).
- **Outliers:** a rare roll can land somewhere strange.

**Plans that narrow or replace the roll.**

| Plan | What it controls | Ways it can fail |
|---|---|---|
| Name an heir | You continue as them | They die first, refuse, or are disinherited |
| Soul anchor | Reborn near a marked place or object | The anchor is moved, broken or claimed |
| Reincarnation ritual | Choose the family, time or world | Wrong family, wrong era, interrupted ritual |
| Phylactery or backup body | Return into a prepared vessel | Found and destroyed; the vessel decays |
| Seal yourself | Wake later, in your own body | Someone opens it early, or never |
| Clone or soul split | A piece of you continues | The piece has its own mind |
| Pact with a patron or system | The patron decides where you go | The patron's terms, or its death |
| Stashes and letters to yourself | Help after an otherwise random roll | Looted, decayed, unreadable without memory |
| Train a successor | A strong heir to follow | They have their own plans |

**How much control the plan gives:** none (pure roll), a nudge (weights
one outcome), a narrow pool (pick among a few), or full control (exactly
what you planned, when the plan works). Better plans cost more:
resources, rare rituals, a patron's price, years of preparation.

**How it plays.**
- **Death becomes a preparation goal:** a long life can spend its later
  years arranging the next one.
- **Unplanned deaths stay dramatic:** a sudden death means a surprise
  life, which keeps runs fresh.
- **The roll is shown as an event:** "You open your eyes..." with the
  details revealed as the new life discovers them, not as a menu.
- **The roll is fixed once made:** reloading doesn't reroll (save
  integrity). Rerolls exist only where a world, cheat or meta unlock
  offers them, at a cost.
- **A setting for players who want control:** a chosen-start mode for
  people who'd rather pick (rule 1), alongside the random default of this
  idea.

**More to consider.**
- **Plans can be stolen or hijacked:** an enemy uses your reincarnation
  ritual to place you where they want you, or takes your backup body.
- **Others' plans include you:** a parent's ritual summons you as their
  child; a sect's ritual calls a dead master back into a disciple.
- **Plans across worlds:** an anchor in another world, if a carrier can
  hold it there.
- **Partial plans:** you planned the body but not the time, so you wake
  centuries late.
- **Planning reveals you:** rituals and anchors can be detected by
  diviners, heaven or enemies, so a well-planned return can be ambushed.
- **The roll's memory:** in some worlds the soul remembers being judged
  or sorted between lives (an underworld, a soul court, a system menu),
  which can become its own short scene.

### More to consider

- **Choosing the link at death:** with preparation, a character decides
  how they continue: write a will, seal a fragment, bind a soul to an
  heirloom, swear a pact, train an apprentice. Each choice has a price
  (a ritual's cost, a pact's terms) and a risk (the heirloom stolen, the
  pact twisted). An unprepared death takes whatever link the world gives.
- **Several heirs at once:** the player follows one; the others live on as
  family NPCs with their own goals. They can help, compete for the
  inheritance, or become the next life's rivals. Switching focus later is
  possible where the link allows it.
- **A broken link:** the soul destroyed, the line ended, the heirloom lost.
  Continuity then needs an obscure route (rule 1), a carry from a prior
  run, or the player simply starts as a stranger in the same world.
- **Meeting yourself:** in loop and variant worlds, a previous version of
  you may still be alive. It might be an ally, a rival, someone who
  refuses to accept you, or someone who wants your body back.
- **The world's opinion of the player:** some worlds name the recurring
  soul with a title, a prophecy or a heresy. That name brings followers,
  hunters and expectations, and it can follow the player into worlds that
  have heard of it.
- **Mixed links:** a character can be a blood descendant and a
  reincarnation at once (born into your own line), which stacks both
  links and both sets of trouble.
- **Unwanted continuity:** a curse that keeps bringing you back, or a
  system that won't let go. Escaping the cycle can be a goal in itself.

## What persists across runs, and the gameplay loop (proposal, 2026-10-10)

Weibao: "Upgrades or things that persist across runs? How should the
gameplay loop be?"

Builds on [life progression](#life-progression-defaults-proposal-2026-10-07)
(lives are long, days of play per world), D2b (idle is the backbone,
active play steers), the accepted first milestone (one realm and one
prestige layer), and the next-life sections above.

### Four layers of persistence

| Layer | What it is | Examples | Feels like |
|---|---|---|---|
| The world | Things that stay in the world after you | Stashes, legends, family, roads built, enemies made, fragments left | Rogue Legacy's castle remembers you; Wildermyth's legacy heroes |
| The soul | What the soul carries by the world's rules | Memories (fading or whole), soul traits and scars, karma, soul growth across lives | A reincarnated master |
| The meta layer | Unlocks above any world | New origins, discovered worlds and coordinates, creation options, routes opened, codex entries | Slay the Spire unlocks; Hades' mirror and keepsakes |
| The player | What the human learns | Rules, recipes, where things are, how enemies fight | Outer Wilds: knowledge is the only upgrade |

**Two kinds of meta upgrade, both available (rule 1):**
- **More options:** new starts, worlds, routes, cheats you can find,
  creation layers. The next life is different, not easier.
- **More power:** stat or talent boosts, memory retention, reroll tokens,
  vault capacity. The next life is easier.

Proposal: options are the main reward; power upgrades exist but are
slower and often tied to the soul layer, so they have an in-world reason.
Harsh modes can turn power carry off; generous modes turn it up.

**Upgrade families (proposal):**
- **Soul:** talent weights for the next roll, memory retention, soul
  durability (survive more rebirths), resistance to soul checks.
- **Lineage:** a family vault that persists, the family manual, bloodline
  purity, a house that remembers.
- **Fate:** reroll tokens, a nudge on the next roll, an extra plan slot,
  luck.
- **World access:** coordinates, anchors, routes, standing with hubs.
- **Knowledge:** codex entries, recipes, maps; in-world, these are the
  journals your past lives wrote.

**Where upgrades are spent: between lives.** A short scene after death,
shaped by the world's rules: a soul court, an underworld ferry, a system
menu, a void, a family shrine, or nothing at all. The roll, the plans and
any upgrades resolve here. Currency: legacy earned from deeds, karma,
fragments, or whatever the world's cycle uses.

### The gameplay loop

**The life loop, in one line:** arrive, discover who you are, find your
footing, grow, shape the world, prepare, end, and find what's left.

1. **Arrive:** rolled or planned, as an event ("You open your eyes...").
2. **Discover who you are:** hidden layers (constitution, bloodline, fate)
   surface through tests and events.
3. **Find your footing:** work, a place to live, first relationships.
4. **Grow:** skills, paths, power, careers; idle routines carry the
   ordinary days, active play opens new routes.
5. **Shape the world:** projects, deeds, feuds, followers, travel to other
   worlds.
6. **Prepare:** legacy, heirs, stashes, rituals, plans for the next life.
7. **End:** death, transcendence, a seal, leaving the cycle.
8. **Between lives:** the roll, the plans, the upgrades.
9. **Find what's left:** the next life discovers the last one's traces.

**Loops at every timescale.** Each feeds the next one up.

| Loop | Real time | You do | You get | Feeds |
|---|---|---|---|---|
| Moment | Seconds to minutes | Pick actions in the center menu, fight, craft, talk | Results, small discoveries | The day |
| Day or session | Minutes to an hour | Set routines, handle events, pursue a short goal | Resources, skill XP, relationships | The season |
| Season or year | Hours | Careers, projects, breakthroughs, journeys | New tiers, places, people, power spikes | The life |
| Life | Many sessions, days of play | Grow, peak, age, plan the legacy | A life's legacy, legend and world changes | The lineage |
| Lineage or run chain | Weeks | Successive lives, fragments, long projects | Meta unlocks, soul growth, a changed world | The multiverse |
| Multiverse | Long term | Worlds, layers, the edges of the cosmology | Endgame goals, world ownership, leaving the cycle | Itself |

**Idle and active at each level (D2b):** routines run the ordinary moments
and days while you're away; active play decides the seasons, the life's
turning points and the between-lives choices.

### More to consider

- **The first life teaches;** later lives start faster through what was
  left and unlocked, so the early game doesn't repeat word for word.
- **Runs must not feel the same:** random rolls, different worlds,
  different roles and a world that remembers keep each life distinct.
- **Death is not required:** a player can extend one life indefinitely
  through life extension, ascension or a cheat. The loop still works,
  with the "life" layer stretched long.
- **The first prestige layer is death and the next life.** That maps the
  accepted milestone (one realm, one prestige layer) onto this loop
  without forcing resets on vanilla play.
- **Pacing of power across lives:** a new life in a known world can feel
  strong quickly (Kenshi veterans, regressors), while a new world resets
  the climb. Both are good.
- **Persistence you can lose:** a vault robbed, a soul damaged, a family
  ended. Meta progress can be at risk in harsh modes.
- **Prestige math as fiction:** idle-game prestige currencies become
  legacy, karma or soul weight, so the numbers have a story.
- **References for loop design:** Rogue Legacy (heirs and a manor),
  Hades (relationships and keepsakes persist), Slay the Spire (unlocks
  only), Dead Cells (permanent unlocks), Outer Wilds (knowledge only),
  Wildermyth (legacy heroes), Crusader Kings 3 (dynasty), and layered
  idle prestige (Antimatter Dimensions, Realm Grinder).

## Who or what you start as: realms of play (proposal, 2026-10-10)

Weibao: "consider who or what we start as, different realms of gameplay
such as starting as a monster or an object, since we haven't considered
that before? What if I achieve immortality in one world, but want to begin
exploring another?"

**What was already there:** nonhuman starts appeared only in passing: the
trope table (monster evolution, reincarnated as an object, dungeon core),
the "object or creature" entry route, tree bodies in
[origins](worlds/ORIGINS_AND_WORLD_TIMELINES.md#tree-and-other-bodies-change-available-actions),
and species in the creation layers. None were worked out as their own way
to play. This section does that.

### Starting realms

Each realm changes the verbs, needs, threats and pace, not just the stats
(rule 4: bodies are real).

| Start as | Core verbs | Needs and limits | How you grow | Fiction to draw on |
|---|---|---|---|---|
| Human or humanoid | The vanilla verbs | Food, rest, money, law | Skills, careers, paths | Vanilla YAIR |
| Monster | Hunt, hide, eat, evolve, claim territory | Hunger, hunters, no rights, instinct | Evolution by eating, fighting or other routes | Slime and spider reincarnation stories, monster evolution web novels |
| Beast or familiar | Bond, serve, scout, guard | A master or none; communication | Evolution, contracts, bond depth | Beast-taming novels (the Black Iron Egg book) |
| Object | Be used, sense, influence, choose a wielder | Can't move alone; depends on holders | Gaining awareness, absorbing power, wielders' deeds | Reincarnated as a sword or vending machine; Fated Villain's ring spirit |
| Plant or tree | Grow, root, spread, shelter, bargain | Rooted; seasons; fire | Age, territory, spirit awakening | The Harry Potter tree origin proposal |
| Spirit or ghost | Haunt, possess, whisper, travel unseen | Can't touch much; fading; exorcists | Gathering belief, anchors, becoming more real | Bleach souls, Mother of Learning souls |
| Construct or machine | Work, compute, repair, upgrade | Power, maintenance, owners | Parts, programs, self-modification | Kenshi skeletons, Legendary Mechanic |
| Dungeon or place | Shape the space, lure, defend, grow | Can't leave; needs visitors or mana | Expanding floors, monsters, traps | Dungeon core stories |
| Undead | Persist, command the dead | Hunted; decay; light | Necromancy, phylacteries | Lich and skeleton stories |
| Divine or demon | Be worshipped, grant, bargain | Belief, rules of the pantheon | Followers, domains | Kairos, Omniscient Reader constellations |
| Collective | Many bodies, one mind | Losing members | Growing the swarm or hive | Hive and swarm stories |
| System or cheat | Offer quests, reward, guide a host (mode D) | Needs a host | Host's growth and your own levels | System-as-character stories |
| Concept or force | A weather, a disease, a rumor, a law | Spread and resistance | Reach and believers | Rare, late-game, outlier |

**What changes per realm.**
- **The UI stays the original UI,** with each realm's verbs in the center
  menu and its needs in the existing bars (a sword's "sharpness" and
  "bond", a tree's "roots" and "season").
- **The world treats you by what you are:** a monster is hunted, an object
  is owned, a ghost is exorcised, a god is bargained with.
- **Social life changes:** a monster's pack, an object's wielders, a
  tree's village, a dungeon's adventurers.
- **The bio reads differently:** a sword's bio is a list of hands that
  held it.

**Crossing realms.** A monster can evolve into a humanoid; an object can
gain a body; a ghost can possess one; a human can become undead, a god or
a dungeon. Crossing is a path in itself, with each world deciding the
route (rule 2).

**How a start is chosen.** The same ways as any next life: random, weighted
by the past life, or planned. Unusual realms can be meta unlocks, outlier
rolls, or plans gone wrong ("you meant to be reborn as your grandson, and
woke as his sword").

### Deeper notes per realm (2026-10-10)

Sources to audit for each realm are listed in
[audit candidates](research/AUDIT_CANDIDATES_2026-10-10.md).

- **Monster.** The first lives are about survival and eating: what you eat
  decides what you evolve into (a branching evolution tree per world).
  Intelligence can be a stat you evolve into, so early verbs are few and
  grow. Towns are dangerous until you can pass, talk or conquer. A monster
  can found a nation, as in the slime story.
- **Beast or familiar.** The bond is the core stat. A good master raises
  you; a cruel one is something to escape. Contracts can be broken, and a
  beast without a master is free and hunted.
- **Object.** Progress comes through wielders: you grow when they use you
  well. You can influence (warmth, whispers, refusing to cut) before you
  can act. Between wielders you wait, which is natural idle time. Theft,
  loss, display in a museum and being buried with a hero are life events.
- **Plant or tree.** One action can take a season; the idle clock
  stretches. Growth is territory: roots, seeds, a forest. The village
  around you is your family; a woodcutter is your monster.
- **Spirit or ghost.** Belief and anchors keep you real; without them you
  fade. You can possess animals, objects, then people, each a step up.
  Exorcists, priests and mediums are the main observers.
- **Construct.** Parts replace levels; maintenance replaces food. An owner
  can repair, upgrade or sell you. Self-modification and freedom are the
  long goal.
- **Dungeon or place.** Visitors are your economy and your threat. You
  design floors, monsters and rewards; adventurers' deaths feed you, their
  victories hurt. A dungeon can be cleared, tamed or befriended.
- **Undead.** A phylactery is the central plan for self-revival. Holy
  places and daylight are hazards; the living fear you. Raising an army is
  a path; staying hidden among the living is another.
- **Divine or demon.** Followers are power; doctrines and miracles are the
  verbs. Other gods compete for the same believers. Being forgotten is
  death.
- **Collective.** Losing members isn't death; losing the queen or the core
  might be. Growth is numbers and specialization.
- **System.** You need a host and can only offer: quests, rewards,
  warnings. The host can refuse you. Your levels grow with theirs.
- **Concept or force.** A disease spreads, a rumor mutates, a storm
  gathers. Plague Inc. is the model. Mostly for outliers and late game.

### Immortal in one world, beginning in another

Weibao: "What if I achieve immortality in one world, but want to begin
exploring another?"

Immortality doesn't end the game; it changes what the life loop means.
Ways to begin somewhere new while staying immortal:

| Route | How it works | What happens to the immortal self |
|---|---|---|
| Travel in person | Cross to the new world in your own body | Suppressed, reread or weakened by the new world (compatibility modes, verse equalization) |
| Avatar or clone | Send a weaker made body; the true self stays home | The true self keeps its world; the avatar starts low in the new one |
| Reincarnate a fragment | Split off a soul piece to be born in the new world | The main self waits or sleeps; the fragment grows up fresh and may merge back later |
| Seal yourself and go | Seal the body at home, send the soul | The body is vulnerable while you're away |
| Possess a local | Take over someone in the new world | Their life, ties and fate come with them |
| Start fresh by choice | Voluntarily lock or give up power at the border | A real new climb, with an option to unseal later |
| Equalized entry | The new world's rules scale you down to its level | Fair play there; full power returns at home |

**What the immortal home life does meanwhile:**
- **Frozen** while you're away (the absent-world starting setting), or
- **Continues** under its own clock: your sect, family and enemies move
  on; disciples rule in your name; rivals plot.
- **Calls you back:** a crisis at home, a prayer, a broken seal.

**Playing both:** switch focus between the immortal at home and the new
life abroad, like following several heirs. The two can help each other:
the immortal sends resources, the newcomer brings back new methods.

**The immortal's own changes:**
- **Boredom and meaning:** a long life needs new goals; exploring new
  worlds is one.
- **Starting low is the point:** a fresh climb somewhere new is the
  pleasure of being weak again, with an immortal's patience.
- **Old powers may not work at all** in the new world, or may surprise it.
- **Immortality has its own threats:** world wills that dislike it,
  hunters of immortals, heavenly tribulations, other immortals.

### More to consider

- **Hybrid starts:** a human with a beast's soul, a sword with a human
  memory, a ghost in a construct.
- **Starting as an NPC you once met:** the next life lands in someone from
  the old one.
- **Starting as something tiny:** an insect, a seed, a spark, growing for
  an entire life before anyone notices.
- **Starting as something huge:** a mountain spirit or an ancient beast
  that sleeps for years per action.
- **Time scale by realm:** a tree's day is a season; a mayfly's life is an
  hour. The idle clock can stretch or shrink with the body.
- **Realm-specific endings:** a sword is reforged or broken; a dungeon is
  cleared; a tree is cut or becomes a forest; a god is forgotten.
- **Realms as worlds' specialties:** some worlds lend themselves to
  monster starts (a dungeon world), object starts (an artifact-rich
  cultivation world), or ghost starts (Bleach).

### Primordial Saint Sect scout findings (2026-10-10)

*Superseded in part by the targeted audit below, which corrected the
ending, the stolen page, the first harvest and the fusion floor.*

*Struggling to Survive with Regression Power in the Primordial Saint Sect*
(machine-translated ranobes edition, 1,441 chapters; unverified). A Sonnet
scout read chapters 1-15 closely and sampled about 30 more; roughly 1,380
chapters are unread. Private notes:
`docs/research/novels/primordial-saint-sect-2026-10-10/SCOUT.md`
(gitignored). Candidates list: [audit candidates](research/AUDIT_CANDIDATES_2026-10-10.md).

**Premise:** a transmigrator wakes as a doomed "blood offering" disciple in
a demon sect that prices every member by salvage value. His cheat is a
100-page Book of a Hundred Lifetimes: he restarts only by dying, and learns
to die on purpose.

**How the regression works:**
- **One legacy slot per death:** each restart keeps memory plus exactly
  one chosen thing: a treasure, the cultivation base, lifespan (later a
  cultivation method), or a talent rolled from how that life went.
- **Anchors as scarce save points,** gained at cultivation milestones; a
  badly placed anchor can trap him (a "dead save").
- **A finite page budget,** with a hidden cost: a page was stolen and his
  own life filled the gap.
- **Harvesting lives:** the Book can consume a dead cultivator's essence
  and turn that person's life into a talent for him.
- **Talent fusion:** nine talents in, one higher-tier talent out, with a
  guaranteed floor.
- **Concealment:** items the Book returns carry no traceable karma, but
  the strongest masters can sense a restart.
- **Ending:** he cuts his ties to everyone and transcends with about half
  the pages unused.

**The world around it:**
- The sect kills gifted recruits for materials, caps loans at a disciple's
  body value, and tolerates hidden murder: a harsh lone-wolf setting.
- Lifespans by realm (about 150, 300 and 1,000 years).
- **Senior cultivators reincarnate** with memory but weaker each time, and
  use their descendants as memory anchors: an NPC version of the heir and
  rebirth ideas above.
- A separate cultivation world, a huge sandbox realm the hero runs late
  on, and nonhuman beings (spirits, dragons, banner spirits).

**Mechanics worth absorbing (proposal):**
- One legacy slot per death, as a harsh-mode carry rule or a cheat.
- Talents generated from how the last life was lived.
- Anchors as scarce, misplaceable save points (ties to rewind and the
  next-life plans).
- A finite budget of lives, with a hidden way to lose some.
- Debts and exploits that a restart erases, and the ethics of that.
- Knowledge as capital, including facts that turn out to be rigged.
- Deliberate death as a skill.
- Harvesting the dead for talents, with its own karma.
- Talent fusion with a floor.
- Returned items free of karma, and the few who can still sense it.
- An NPC reincarnation economy: elders returning weaker, anchored by
  descendants.
- A late realm-management layer.

**Next step:** the targeted audit below was run on 2026-10-10.

### Primordial Saint Sect targeted audit (2026-10-10)

Three Sonnet readers read every chapter in the scout's priority ranges
(about 120 chapters: 100-135, 154-166, 226-232, 348-352, 405-410,
573-580, 660-700, 981-993, 1138-1148, 1183-1190, 1230-1237, 1303-1306,
1334-1343, 1415-1441) with the unbiased lens: claims labelled shown,
stated or inferred, contradictions recorded. Private notes: `AUDIT_1.md`
to `AUDIT_3.md` in `docs/research/novels/primordial-saint-sect-2026-10-10/`
(gitignored). Machine-translated edition; names and rank terms drift.
**The scout above got several things wrong; this section supersedes it.**

**Corrections to the scout:**
- **The ending:** he does not cut his ties and transcend. That's a bluff
  aimed at his rival. He absorbs a shattered Great Dao Seed and becomes a
  sovereign; the rival is frozen as the "Gate of Transcendence". He keeps
  all his ties and ends with about half the pages.
- **No page was stolen:** the count ticks down exactly one per life. The
  "missing page" is the Book's title page, which a rival holds; taking it
  back gives a unique talent, not more lives.
- **The first harvest was a gift,** from a living cultivator. Later
  harvests come from kills.
- **The fusion "floor"** is his own guess, not a rule on the panel.
- **The sandbox realm** of 140 million people is a 30-year loan from the
  sect, and the "separate world" is reached by boat.
- **Detection is rare:** nobody detects a restart through the middle of
  the book; the one real detection comes late, from the rival who also
  restarts.

**How the Book actually works (shown on the page unless noted):**
- **The death menu** has four slots: keep a treasure, the cultivation
  base, lifespan, or forfeit all three for a random talent. Later, a
  perfected Dao Heart buys one reroll of the choice (lifespan became a
  cultivation method).
- **Items brought back lose their karmic trail;** abilities learned
  during the life stay traceable, and an enemy traces one.
- **Anchors:** save points chosen at the restart screen. If the carried
  power clashes with the anchor's foundation, he chooses Overwrite or
  Split; Split creates a separate "Dao Body".
- **Settling lives:** a Golden Nature (a cultivator's essence) is settled
  into one talent shaped by that person's life story. It can be settled
  lives later, and once he settled two at once. A soul without one can't
  be processed. The emptied soul can be worn as a disguise.
- **Talents can be origin switches:** one lets him be born as a Celestial
  Spirit on the next restart.
- **Talent Integration:** up to nine talents in, one out; the highest
  grade invested sets the result's tier (seven Gold talents gave one
  Colored talent that pays a master for his disciples' growth).
- **Late game:** he restarts voluntarily, mid-fight; he also fakes a death
  instead of restarting. In one realm an outside blade survives restarts
  and everyone remembers.

**The world around it:**
- **NPC reincarnation:** about 90% of first reincarnations succeed, then
  it gets harder; late-stage cultivators manage about four lives. Elders
  fuse with a blood descendant to wake their memories; a counter makes
  the children take the elder's tribulation, and two children break it by
  self-destructing.
- **Spirit copies:** a killed person can be replaced by a banner spirit
  that takes over their relationships.
- **A detached body:** he splits off a body he lived in as its own being
  with its own mind, guides it through a staged mentor, and plans to
  absorb it later.
- **Foreknowledge decays** as people act differently each life; only he
  remembers grudges and debts, and he knowingly lets someone fail again.
- **A follower system:** a tiered heavenly palace of followers, audited by
  merit and incense, whose cultivation feeds his own.
- **The rival's restart** works through a diary, not memory, and merges
  past, present and future selves.
- **Lifespan is environmental:** a soul-eroding wind sets about 150 years,
  or 300 with a foundation; a sect life lamp adds years.
- **The Book's origin** gets competing accounts, none confirmed.

**Options for YAIRPG (proposals, framed as options):**
- A death menu with slots and rare rerolls, as one carry rule a world or
  cheat can use.
- Clean returned items versus traceable learned abilities.
- Anchors with Overwrite or Split, and the split body as its own person.
- Talents written from a specific life, including origin-switch talents.
- Fusion of many talents into one higher one.
- An NPC reincarnation economy with odds, descendant anchors and a
  counter that costs the children.
- Spirit copies that take over a dead person's place.
- Foreknowledge that decays as the world diverges.
- A follower palace that feeds the leader.
- A rival restarter with a different method (a diary instead of memory).

**Not covered:** chapters 1344-1414 and most of 1-99 and 233-980 outside
the sampled ranges. Coverage and translation-noise notes are in the
private files.

## Open threads across lives, deaths and starts (Claude, 2026-10-10)

Weibao: "more to consider? save and expand on each idea accordingly."
Proposals that tie together the heirs, next-life, persistence and
starting-realm sections above.

### Dying as play

- **Last moments:** a slow death (age, illness, a long wound) gives time
  for final acts: last words to chosen people, a final technique, burning
  or hiding things, naming an heir, a last confession.
- **Sudden death** skips this, which is why planning matters.
- **Death by realm:** a sword shatters or is reforged, a tree falls or
  seeds, a ghost fades, a dungeon is cleared, a god is forgotten, a
  construct powers down with its memory intact or wiped.
- **Near death:** some worlds have a threshold state (between life and
  death, a soul half out) where a choice, a rescue or a bargain decides
  which way it goes.

### The between-lives scene

- **Per world:** a soul court, an underworld ferry, a system menu, a void,
  a family shrine, a river of forgetting, or nothing.
- **What happens there:** a short review of the life (from the chronicle),
  seeing who mourns, settling karma, spending legacy, resolving plans and
  the roll.
- **Skippable** for players who want the next life fast; long for players
  who want the ceremony.
- **It can be contested:** a patron argues for you, an enemy's curse
  argues against, a judge can be bribed or tricked.

### NPCs live by the same rules

- **NPC reincarnators and regressors** exist in worlds that allow them:
  elders who return weaker each time, anchoring on descendants (as in the
  Primordial Saint Sect scout); rivals who come back.
- **NPC heirs** inherit what their parents left, so families rise and
  fall around you.
- **Recurring souls:** a rival or a friend from an earlier life can show
  up in a later one, in a new body, sometimes without knowing it.
- **The player is not unique by default:** what makes a life special is
  what it does, plus any cheat or fate the world gives it.

### The chronicle across lives

- **One bio per life,** plus a lineage view: a family tree, a chain of
  incarnations, or a list of wielders for an object.
- **A map of lives:** where each life lived and died, across worlds.
- **Legends beside facts:** what really happened next to what people say
  happened, with accuracy found through sources.
- **Failed lives count:** a short, bad life still leaves a lesson,
  a grave, an enemy, or a legend.

### Saves that hold many lives

- **Past lives compress:** a finished life becomes a summary (deeds,
  legacy, links, places), not a full state, so saves stay small.
- **Worlds as seed plus changes,** as in the variant-world plan.
- **What stays detailed:** anything the current life can still touch
  (a living heir, a stash, an open feud).

### Life settings

- **A settings card at each new life:** random or chosen start, power
  carry, ironman, offline mode, difficulty. Each world can override what
  it needs (rule 2).
- **Change mid-run only through the fiction** where a world wants that,
  or freely in gentle modes.

### Onboarding

- **The first life starts small:** a human in the vanilla frontier, with
  the original game's opening intact (rule 8).
- **Realms reveal themselves:** monster, object and other starts unlock as
  the player meets them, dies into them, or plans them.
- **Information when it comes up:** the between-lives scene, lineage and
  meta systems appear when the first death happens, not before.

### Shared legends (asynchronous, optional)

- **Export a finished life** as a legend file (YAIR already has
  export and import).
- **Import a friend's legend** into your world: their character appears as
  a rumor, a grave, a ghost, a ruin, or an NPC with their deeds.
- **Messages to strangers:** like Dark Souls notes, a past life can leave
  a short message that turns up in someone else's world.

### Realms and heirs together

- **A sword's heir** is its next wielder; **a dungeon's heir** is a new
  dungeon grown from its core; **a tree's heir** is its seedling; **a
  god's heir** is a successor worshipped in its place; **a ghost's heir**
  is whoever it haunts.
- **Crossing back:** a monster's descendant may be born human; an object's
  wielder may become its next form.

## The cheat library (proposal, 2026-10-10)

Weibao: "So now we have types of gameplay taken by type of cheat? Would we
have a 'cheat library' to draw from in the future?" Yes, as a proposal:
[CHEAT_LIBRARY.md](CHEAT_LIBRARY.md) maps 21 cheat families to the loops
they add (a death-menu regression makes a life run-based; a system makes it
a quest game; harvesting makes it a hunt), defines a library card with
engine hooks, and describes how worlds, origins, rivals, items, shops and
events draw from it. First cards proposed: a death-menu regression, a quest
system and a companion spirit.
Since expanded the same day: 45 cheat families, an implementation plan
on the existing registry (sources, capabilities, hooks, phases C0-C6), a
progression loop for cheats, and [enemies with cheats](CHEAT_LIBRARY.md#enemies-with-cheats-2026-10-10)
(the same cards with NPC policies, counters, what happens when a holder
falls, and who hunts cheaters).

## Can the current UI show all this? (Claude, 2026-10-08)

**Mostly, inside the original surfaces, with three additions.** What exists
(`index.html`, `src/display.js`): the center action menu, the side message
log with groups, the character bio (age, gender, height, race with
tooltips), skills and stances, inventory and equipment, crafting pages,
books, and the journal with a Notebook. The fork already added the World
events feed inside the log.

| Need | Existing surface | Extension |
|---|---|---|
| Life history, past lives | Bio | Expandable sections by year and by life |
| Knowledge states, enemy pages, world laws | Notebook | Tabs or filters inside the Notebook, reliability badges |
| Events and gossip | Side log | Filters (Now, Life, Heard) |
| Powers, concepts, cheats | Skills panel | Sub-lists per system, display mode per world |
| Followers and factions | None | A people list inside the bio or a center-menu page |
| World map across worlds | Travel actions | A text list of known worlds with state, inside the Notebook |
| Cost ledgers and odds | Tooltips | Already the pattern |

**Future extensions,** when the DOM gets crowded: collapsible panels, a
search box in the Notebook, keyboard navigation, and a mobile layout
(already deferred). A different engine is not needed; the engine-extension
lane found no browser limit that rules out these ideas.

## Browser now, real engine later? (Claude, 2026-10-08)

Weibao: should the plan eventually move out of the browser into a real game
engine?

**Not yet, and plan for it cheaply.** The game is text-first; the
engine-extension lane found no browser limit that rules out these ideas.
What matters now is keeping the door open:
- **Keep the simulation core separate from the DOM.** Rules lookup, cards,
  people, factions and saves should be plain logic that doesn't touch the
  page. Then any shell can host it.
- **Cheapest step first:** a desktop wrapper (Tauri or Electron) keeps the
  same web code but adds real file saves, no storage cap and a Steam build.
  That solves most of the "browser" worries without a rewrite.
- **A real engine (Godot, Unity) only if** the game needs rich visuals,
  animation, or performance the DOM can't give.

**Signals to revisit:** saves outgrowing IndexedDB comfort, yearly
simulation of many people getting slow, the UI outgrowing the DOM, or a
decision to release on Steam or mobile.

## Every little gimmick gets mechanics (proposal, 2026-10-08)

Weibao: bloodlines and more; there can be interesting mechanics around every
little gimmick.

**A gimmick depth checklist.** Any gimmick (a bloodline, a constitution, a
cheat, a craft, a pet) earns its place when it answers:
1. How do you get it? (birth, find, earn, steal, buy, inherit)
2. How does it grow? (use, breakpoints, research, feeding, purity)
3. What's its limit, and the way past it?
4. What does it combine with? (tags, fusion, conflict)
5. How do people and worlds react to it?
6. How can you lose it, and what's left after?
7. What does it pass on? (heirs, students, the soul)
8. One small touch that makes it feel real.

**Bloodlines, worked through the checklist:**
- **Get:** birth, a transfusion, a ritual, eating an ancient beast's heart,
  a patron's gift, waking a dormant line.
- **Grow:** purity as a percentage, raised by purification (Kairos-style
  bloodline purification in A Novel Concept), awakening stages that unlock
  techniques and body changes.
- **Limit and way past:** purity ceilings; ways past include a purer
  ancestor's blood, a sacred site, a forbidden refinement, or merging two
  lines.
- **Combine:** mixed bloodlines give hybrid strengths or a conflict that
  costs stability; some pairs are legendary, some forbidden.
- **React:** higher bloodlines intimidate lower ones; hunters sense rare
  blood; clans recruit or kidnap you; a line can be a key that opens ancient
  ruins.
- **Lose:** blood can thin, be drained, be stolen or sealed; a sealed line
  leaves a scar and a story.
- **Pass on:** children inherit with chance and dilution; a pure line needs
  careful marriages (Crusader Kings); an ancestor's will may wake in a
  descendant (ties to revival plans).
- **Small touch:** your eyes change color during an awakening, and
  strangers in some worlds bow without knowing why.

## Parallel and fan-fiction worlds (proposal, 2026-10-08)

Weibao: parallel or fan-fiction worlds; both are fine.

- **An alternate-universe card** inherits a parent world card and overrides
  a few facts: someone survived who died in canon, roles swapped, a villain
  is the protagonist, a different house or faction won, the timeline
  diverged at one event. This reuses card inheritance; an AU is cheap once
  the parent exists.
- **Fan-fiction tropes as AU kinds:** fix-it (undo a tragedy), time-travel
  fix-it, self-insert, role swap, villain redemption, crossover (two worlds'
  cards merged), "what if" at one decision point, slice-of-life in a
  war-story world.
- **Parallel versions of you** (already proposed) fit here: in an AU, your
  past self may be a different person.
- **Canon fidelity dial** (strict, loose, remix) applies to AUs too.
- **Copyright:** franchise AUs are private-pack content; the public build
  can ship AUs of our own original worlds.
- **"Malfoid":** possibly the Draco Malfoy fan fiction wave (the
  Draco-and-Hermione story *Manacled*, later published as an original novel,
  trended widely). Unconfirmed; Weibao to say which he meant.

## UI consistency (proposal, 2026-10-08)

Weibao: UI consistency.

- **One pattern per kind of thing.** Every system's list looks the same:
  name, short state, tooltip with details and ledger. Powers from five
  worlds use one layout with different words.
- **One vocabulary for states:** unknown, rumored, believed, confirmed,
  disproved everywhere (Notebook, enemies, worlds, cheats), with the same
  colors or badges.
- **Shared builders in code:** one tooltip builder, one list builder, one
  ledger format, so new systems can't drift.
- **Per-world display changes words, not layout** (numbers in a system
  world, descriptors in a Dao world).
- **Match the vanilla look:** fonts, colors, spacing and tooltip style
  stay YAIR's; new panels look like old ones.
- **A short UI style note** in the repo that every lane follows, plus a
  cheap check (a test or review step) for new panels.
- **Text style:** the log's voice rules (aging voice, second person) and
  button text kept short, with costs in tooltips.

## Staged rescues and secrets with fuses (Weibao, 2026-10-08)

Weibao corrects the Kenshi finding: a staged rescue *can* earn gratitude if
the victim doesn't know it was staged. It feels unethical, but that is
simply how it works, and the game should allow it.

- **Gratitude follows what the person believes,** not what happened.
- **A secret with a fuse:** the truth can surface later through a
  witness, a confession, a diviner, a rival who digs, or a document. When it
  does, gratitude flips, often into a grudge stronger than if you had done
  nothing.
- **The fuse length depends on** how many people know, how careful you
  were, and how perceptive the victim is (hidden stats and observers).
- **Schemer path content:** staged rescues, manufactured debts, rescuing
  someone from a danger you arranged, then managing the risk of exposure.
- **Reputation splits:** the public may love you while the one person who
  knows the truth becomes a quiet enemy.

## Hover details and text as a medium (proposal, 2026-10-08)

Weibao: little details on hover; interesting things to do with text, like
colors and effects.

**Hover details (tooltips do the heavy lifting):**
- **Layers on hover:** first the short answer, then holding or clicking for
  the ledger (costs, odds, sources), then a link into the Notebook.
- **Provenance:** hover a rumor to see who told you and how reliable they
  are; hover an item to see its maker's mark and history.
- **Odds are not results:** hover shows predicted odds next to what
  actually happened last time.
- **Hidden-stat hints:** hovering your name in the bio shows how others
  describe you, not numbers.
- **Words with depth:** a world-specific term in the log (a realm, a
  Concept) shows its meaning on hover the first time, then gets shorter.
- **Past-life echoes:** hovering a place you knew in a past life shows a
  faint memory.

**Text effects (each optional, with a reduce-motion setting, and never
color alone for meaning):**
- **Color by reliability:** rumors, beliefs and confirmed facts in
  distinct styles; disproved claims struck through.
- **Color by world:** each world card has a small accent palette for its
  terms, so a Gu word reads differently from a potion word.
- **Sanity and corruption:** at low sanity, log text drifts: letters swap,
  words repeat, a line contradicts the one before; at high corruption,
  some words turn a different color or rewrite themselves.
- **Redaction:** forbidden knowledge shows as blacked-out words until you
  can bear to read it.
- **Handwritten corrections:** a later truth appears beside an old entry in
  a different "hand" (the power-scaling touch).
- **Aging voice:** font weight or spacing changes subtly with age; the
  journal's words get shorter and calmer.
- **Typewriter or fade-in** for important moments only (a breakthrough, a
  death), so they feel heavy.
- **Shake or pulse** for danger and tribulations, small and rare.
- **Text that changes on reread:** a prophecy line in the Notebook changes
  after you act on it (knowledge goes stale).
- **Glitch** in system worlds when a cheat or the system misbehaves.
- **Translated text:** in a world whose language you don't know, words
  appear garbled until your language skill improves (ties to languages per
  world).

**Vanilla already has options** for background animations and on-hit
animations (`index.html` options panel), so new effects join that pattern
with their own toggles.

## One trope, many implementations (proposal, 2026-10-08)

Weibao: there are many tropes, and many ways each might go or be
implemented.

Every idea in this doc can be built in several forms. Choosing the form
decides how often players meet it and how much it costs to build:

| Form | Example with "regression" | Cost and feel |
|---|---|---|
| An origin | Start as a regressor | Shapes a whole life |
| A cheat card | A ring that regresses you once | Rare, powerful |
| A world law | A world where everyone loops yearly | Distinct world |
| A path | Become a time mage over a life | Earned |
| An event | A stranger claims to have lived this day before | Cheap, frequent |
| An enemy | A rival regressor | Pressure |
| A place | A valley that resets every dawn | Local, replayable |
| An item | A diary from your future self | Small, intriguing |
| A rumor | Gossip about a man who knew the flood was coming | Cheapest, seeds the rest |

**Rule of thumb:** introduce a trope as a rumor or event first, then a
place or item, and only later as a cheat, path or world law. That pacing
also matches "hear, learn, qualify, attempt".

## More games worth absorbing (proposal, 2026-10-08)

Ranked by fit with a text life sim. Several are open source or free
browser games, so their code can be read directly under their licenses.

| Game | What to learn | Access |
|---|---|---|
| Progress Knight | Life-sim idle: jobs, skills, aging, rebirth with carried bonuses | Free browser game, open source |
| Idle Loops | Time-loop idle: actions in a loop, knowledge carries | Free browser game, open source |
| Evolve (idle) | Races, resets, huge tech tree, many prestige layers | Free browser game, open source |
| Increlution | Life-sim idle with lifespan, skills and automation | Steam |
| Theory of Magic | Already on the research shortlist (PROJECT.md) | Steam |
| Fallen London, Sunless Sea | Storylets and qualities: the best text-event system design | Free web / Steam |
| Disco Elysium | Skills as inner voices, a thought cabinet for ideas you research | Steam |
| Citizen Sleeper | Dice per day, progress clocks, a body that decays | Steam |
| 80 Days, Sorcery! (inkle) | Text travel with choices; elegant text UI | Steam |
| Roadwarden | Text RPG with a day limit and real consequences | Steam |
| Planescape: Torment | Death as a mechanic; past incarnations' memories | Steam |
| A Dark Room, Candy Box, Universal Paperclips | Text that reveals itself; incremental storytelling | Free browser |
| Spiritfarer | Caring for people, then letting them go | Steam |
| Vagrus | Text caravan life, company management | Steam |

**Quality lessons to look for in each:** how text stays readable when
systems pile up, how tooltips carry depth, how a game reveals itself
gradually, and how it makes small actions feel like part of a life.

## Steam cleanup and download shortlist (2026-10-09)

**Uninstalled 2026-10-09** at Weibao's request (audits complete, sources kept
in `~/.codex/research/`, no saves inside the install folders): Cult of the
Lamb, Six Ages 2, Battle Brothers, Dwarf Fortress. Free disk went from about
10 GB to 17 GB.

**Still installed:** Tale of Immortal (audit done, but the folder holds
Weibao's MelonLoader setup and a mod, so uninstalling waits for his word),
Your Chronicle (code recovery partial), and his own VTube Studio and 100
Space Cats. *Tale of Immortal uninstalled 2026-10-09 at his request; mod,
MelonLoader and Wine prefix backed up to
`~/Documents/Backups/tale-of-immortal-2026-10-09/`. Free disk about 34 GB.*

**Shortlist to download, then extract and audit, one at a time** (disk is
tight; uninstall each after its pass). Engines are expected, not verified.

| Rank | Game | Expected engine | Why |
|---|---|---|---|
| 1 | Increlution | Unity | A life-sim idle with lifespan, skills and automation: closest commercial match |
| 2 | Theory of Magic | Unity | Already first on PROJECT.md's research shortlist |
| 3 | Sunless Sea (or Sunless Skies) | Unity | Storylets and qualities, the reference text-event system (Fallen London's design) |
| 4 | Citizen Sleeper | Unity | Daily dice, progress clocks, a decaying body |
| 5 | Disco Elysium | Unity | Skills as inner voices, a thought cabinet for researched ideas |
| 6 | Roadwarden | Ren'Py (Python scripts) | Text RPG with a day limit and lasting consequences; very readable source |
| 7 | Planescape: Torment Enhanced Edition | Infinity Engine data files | Death as a mechanic, memories of past incarnations |
| 8 | 80 Days | Unity with ink scripts | Text travel and inkle's text UI |
| 9 | Spiritfarer | Unity | Caring for people, then letting them go |
| 10 | Vagrus | Unity | Text caravan and company management |

Weibao to say which he owns or wants to buy; Steam installs need his
confirmation.

*Correction, 2026-10-10:* a fuller parse of the Steam library cache shows
nine of the ten (all but Theory of Magic) in the library; ownership to
confirm. All candidates are now organized in
[audit candidates](research/AUDIT_CANDIDATES_2026-10-10.md).
*Library check, 2026-10-09:* none of the ten appear in the Steam library
cache (which lists recently seen apps, so it may be incomplete). Owned
look-alikes found there are queued in the library-games lane. Also owned
and large, for later: Mount & Blade II: Bannerlord, Stellaris, Terra
Invicta, Endless Legend 2.

## Interesting paths (proposal, 2026-10-08)

New paths to add to the seven in "Paths of play", each earned by deeds:

| Path | Core loop | Worlds it shines in |
|---|---|---|
| Engineer or mechanic | Blueprints, workshops, inventions, machine armies | Tech worlds; anywhere, as a crafter |
| Translator of powers | Turn one world's methods into another's | Border towns, hubs |
| Gu farmer or tamer | Raise living powers, breed and trade them | Gu Wilds, beast worlds |
| Investigator | Uncover secrets, solve cases, read hidden stats | Fog City, mythic worlds |
| Contractor | Hub missions, quotas, a career between worlds | Paradise hubs |
| Ruler or founder | Land, people, laws, a dynasty | Kingdom worlds, home world |
| Teacher or sect founder | Students carry your methods | Any; strongest in long lives |
| Cheat hunter | Find, take, seal or trade cheats | Hubs, worlds that hate cheats |
| Barrier warden or smuggler | Repair or exploit thin barriers | Border towns |
| Chef or alchemist | Food and essences that change people | Gluttony's Paradise, cultivation worlds |
| Merchant between worlds | Buy cheap in one world, sell dear in another | Hubs, thin barriers |
| Scholar of concepts | Study, classify and invent concepts | The Crucible |
| Healer | Medicine, surgery, curses, aging | Everywhere; war aftermaths |

### Time, rewards and cheats lane findings (2026-10-08)

Codex compared the local dossiers, the extracted games and public Jumpchain
sources. Report: gitignored
`docs/research/novels/time-rewards-cheats-2026-10-08/REPORT.md`. It
**corrects Claude's starting view above**: costs, shrinking rewards and
watchers are optional circumstances an author can declare, not a tax every
rewind must pay. The real question is **what goes back and what keeps
piling up.**

- **Separate the operations:** revival (restores a person), loop (restores
  a bounded stretch of history), regression (returns an earlier self),
  succession (a new life), offline time (advances the clock). Each needs its
  own card.
- **A rewind card answers:** what it targets, the anchor date, the trigger,
  the history model (copy, edit, branch, fixed), what is restored, what is
  retained (memory, skill, body, soul, items), who notices, outside clocks,
  whether rewards and offers reset, and what happens to abandoned branches.
  A blank means undecided, not a hidden limit.
- **Restored, retained, copied and recreated are different.** A friend in
  two branches is two people, not one who remembers both.

**Rewind ladder (proposed, from small to absolute):**

| Step | Example | What farms |
|---|---|---|
| L0 Object | A workshop restores one tool to an earlier state | Repairs, retried crafts |
| L1 Encounter | Repeat one fight before it ends | Tactics; loot doesn't pile up unless carried |
| L2 Checkpoint | A ring anchors an earlier you | Scouting, recipes, conversations |
| L3 World loop | A city relives the same month | Years of study in one outside month |
| L4 Regression | Return to an earlier life with memories and declared skills | Long-horizon mastery |
| L5 Full retention | Go back keeping body, stats and soul growth | Compounding physical growth |
| L6 Export loop | A vault outside the reset keeps goods | Real wealth farming |
| L7 Absolute | Any date, exact guaranteed retention | Unlimited, as promised |

Farming is allowed wherever the card permits it, including truly unlimited
versions. A cheat that promises to be a wealth engine should actually be
one.

**Reward-choice toolkit:**
1. Exclusive major gift: pick one capability, give up the others.
2. Take now or wait for a better prize.
3. Choose a restriction before entering for a matching prize (Jumpchain
   drawbacks).
4. Offers drawn from a pool, frozen against ordinary save and reload.
5. A first piece of a future set.
6. Patron aid with a debt, or stay independent.
7. Choose what survives a rewind: knowledge, growth or an object.
8. A companion or path instead of personal numbers.
9. Secrecy versus acclaim: take less public reward to hide your method.
10. A clean gift with no debt or price; choosing it is the cost.

**Sample menu (one permanent pick after rescuing a flooded archive):**
- **Yesterday's Door:** freely relive the last day; memory and skills stay,
  goods and body return.
- **The Enduring House:** your home can't be damaged or taken; free upkeep.
- **The Unforgotten Page:** every memory you choose to keep stays exact,
  private and instant.

All three are strong in different directions, and none hides a curse.

**On absolutes:** the novels mostly show conditional powers, while
Jumpchain documents do contain narrow guaranteed effects. A truly free,
no-exception cheat is a legitimate original choice. By default, two
guarantees that contradict each other on the same event aren't both issued;
if they meet anyway, the collision is settled case by case. "The higher
tier wins" is a conditional rule, not two absolutes.

**Jumpchain, checked:** budgets, origins, companions, chosen challenges and
a persistent home fit lives, world cards and hubs. Community talk shows
both boredom from buying everything and enjoyment from chosen limits, with
no single consensus. A gauntlet can keep perks built into your body; only
suppress what its card says.

**Time on the world card:** a world says whether its past is a copy, an
editable single history, a branch or fixed; who remembers; what happens to
abandoned people; outside and hub clocks; what can be exported; how
paradox works. Starting in an earlier era is not the same as rewinding a
save.

**The lane's ranked proposals (not decisions):**
1. Explicit operation and carryover cards for revival, rewind, regression,
   next life and offline time.
2. Allow advertised rewind farming, including unlimited versions; costs and
   watchers only where authored.
3. Exclusive capability rewards, with clean gifts allowed.
4. Define absolutes by exact guarantees; by default avoid contradictory
   ones, and settle any collision case by case.
5. Temporal physics on world cards.
6. Each world entry offers a local budget, an origin and an optional
   challenge contract.
7. A lived home and consenting companions carry between worlds.
8. Separate modes for strong-power play and chosen gauntlets; leaving,
   settling and retiring count as successes. Fixed threats by default;
   scaled threats as a difficulty or world dial.

### A Novel Concept second pass (2026-10-08)

Codex re-read the book's reward menus, time powers, skill stack, absolute
perks and enemy-side rewards. Report: gitignored
`docs/research/novels/full-book/a-novel-concept/second-pass/REPORT.md`.

- **Rewards really are life-changing picks.** Early on Priam chooses among
  a rewind, a future-self intervention, survivor knowledge or a guaranteed
  trial count; later between a rescue, preparation, a stronger weapon,
  lifespan, bloodline compatibility and teachers. The late
  five-tribulation menu offers 23 options for five picks, plus a separate
  either-or title. Some options are overpowered; the difficulty is
  choosing, timing, and knowing what a reward actually does.
- **The one-time 24-hour rewind is selective.** Priam kept his skill levels
  and threw away dangerous stat gains. It could not reopen a reward choice
  already made. The phoenix patron openly allows exploiting naive enemies
  with it; contracts, delayed delivery and diviners are how others defend.
  The book never bans farming in general.
- **Skill stack:** practice and knowledge can create a skill; rarity,
  quality and personal prerequisites shape upgrades. Skills, adaptations,
  stats, Concepts, Supremacies, talents, title and merit trees, bloodlines,
  tempering, ennoblement and soul tier stay separate. Fusion and
  decomposition reshape a build; deleting a technique can leave the
  trained body behind.
- **Absolutes:** read every power with its target, timer, authority and
  stated exceptions. Enemies get spectacular rewards from the same systems.
- **Thirty more small touches** (preferences, privacy, worker routines,
  food, public services, grief, equipment care, recreation).

**The lane's ranked proposals (not decisions):**
1. Reward choices close real doors; show what you gave up. A unique teacher,
   a rescued person or an extra life can beat a pile of stats.
2. A rewind card names exactly what crosses: memory, understanding, usable
   skill, stats, belongings, debts, observers. You can keep what you learned
   and drop an injury, if the card allows.
3. Several futures for an ordinary skill: a quick final upgrade, a
   continuing specialist route, and a researched ideal route.
4. An absolute cheat keeps its written promise. Rivals attack another
   surface or wait it out; enemies don't get surprise immunity.
5. Rivals choose from meaningful rewards too, and remember their trades.
6. Counters to exploits belong to people and institutions: escrow, delayed
   delivery, diviners, adaptation.
7. A trained body and an active technique are different things; a reset or
   legacy can keep one without the other.
8. Memory mismatches become discoveries: compare what you remember with what
   others saw to expose manipulation.

### Tale of Immortal findings (2026-10-08)

Codex extracted the installed game properly: 914 official modding workbooks
(about 1,600 sheets, 278,000 rows) and the actual logic of 16 key compiled
methods. Report: `docs/research/tale-of-immortal/REPORT.md`; raw data
private in `~/.codex/research/tale-of-immortal/`. Nothing was run in-game,
and no saves were read. Still opaque: childbirth and marriage execution, the
breakthrough roll, off-screen simulation cost, autonomous ancient plans,
reincarnation, careers and dynamic prices.

- **NPC lives:** about 2,000 NPCs generated at world start with weighted
  realm, post, personality, wealth and hobbies; family, master and student,
  and lover relations; marriage regret cuts intimacy. **NPCs remember the
  player:** each memory kind keeps at most 10 entries for up to 100 years.
  **Attention budget:** NPCs can interrupt the player at most six times a
  month.
- **Cultivation:** ten realms; late realms are gated by story beats, not
  just experience. **Breakthrough quality** is separate from realm: better
  preparation (more and better ingredients) gives a higher quality with
  more choices and ability points. Failure leaves a 12-month weakness and
  blocks further attempts for that time.
- **Aptitude** is multi-axis (per element and weapon); traits add to it,
  treasures improve it, failures lower it for a while.
- **Techniques:** learning costs money and days separately; practice costs
  items and time; mastery stages scale with the technique's grade; unused
  techniques can be forgotten.
- **Sects:** seven offices with seats, monthly salary, contribution and
  aptitude gates; a yearly promotion tournament; duties with success and
  death rates; **unpaid salary costs loyalty and backpay restores it**;
  sects keep six months of salary in reserve; ordinary members are counts,
  not individuals; wars cost territory and stability.
- **Events:** eligibility, chance, repeat rules, cooldown groups and
  priority are separate fields; one big encounter a month at most;
  calendar-gated events; world map icons that expire after six months and
  can spawn successor content.
- **Ancient things:** sealed souls you can reinforce or release (release
  opens a dungeon); **inheritances judge your past conduct** (did you loot
  bodies, take money, read others' letters) and can refuse you. Dungeons
  escalate every six months.
- **Lifespan:** realms add years; poor health drains lifespan monthly; a
  remnant-soul state lasts 24 months unless restored.
- **Economy:** alchemy with quality tiers and furnaces that gate aptitude;
  an auction every two years with six months' notice; market stock by town
  level and reputation.
- **Save and history:** ordinary logs older than five years are pruned,
  vital logs kept; saves can be compressed and encrypted. Compaction and
  compression are separate problems.

**The lane's ranked proposals (not decisions):**
1. Memories that change behavior get their own retention, separate from
   the biography.
2. A small funded work circle owes wages; backpay restores trust.
3. Expired opportunities leave aftermath: a rumor, a later lead.
4. Preparation (tools, materials) changes a mastery or breakthrough
   outcome; failure leaves a timed recovery.
5. Named people stay individuals; unnamed workers are counts.
6. Event eligibility, chance and pacing as separate rules, with cooldowns
   and a monthly disruption budget.
7. Elders judge your actual past conduct.
8. A sealed relic you can reseal or release, with lasting consequences.

**Small touches:** preview breakthrough outcomes before choosing; discover
aptitude by trying the activity; book study shows time and money
separately; a warning arrives months before a market; an elder remembers
how you handled an old obligation; long work shows its lifespan cost first.

### Battle Brothers findings (2026-10-08)

Codex unpacked and decompiled the game's scripts (3,114 encrypted script
files; 41 files reviewed closely; 44 findings). Report:
`docs/research/battle-brothers/REPORT.md`; raw code private. Decompiler
output can have bugs, and many parts were not reviewed.

- **People have practical reasons to stay or leave.** Backgrounds shape a
  recruit's history, traits, kit and wage. Mood keeps a short list of
  reasons; missed pay and food hit each person differently; very low mood
  can make someone desert. Leaving and dying are recorded differently.
  Wounds can push a veteran into a different role.
- **The company carries obligations.** Wages, food and repair supplies
  compete for money. Renown (how capable you look) and moral reputation are
  separate. Specialists in the retinue have requirements and concrete
  effects. Cities and their rulers have linked but separate opinions of you.
- **Late-game crises come in phases:** gated by schedule and company
  strength, then a warning phase, then an active phase. Which crisis
  depends on the political map and which crises already happened. Wars
  shift alliances and leave news and aftermath. A necromancer raises the
  dead from actual corpses.
- **Harshness is several settings,** not one: combat difficulty, economy
  difficulty and ironman saves are chosen separately.
- **Aging** shows up as a level-gated event for one background (an old
  swordmaster), not a general lifespan.

**The lane's ranked proposals (not decisions), each extending something
YAIR already has:**
1. One named helper with continuing terms, a preference and a warning
   before they leave (extends the pathfinder commission).
2. Local standing explained by recent causes ("they remember the favor").
3. Earn a practical specialist through ordinary work (crafting opens a
   repair service).
4. Past work shapes a recurring social scene: a veteran teaches, a helper
   comments on the food you actually supplied.
5. Recovery restricts one physical job while study and workshop stay
   useful.
6. One local crisis changes a place: traces, pressure, aftermath on a road.
7. Enemy powers recorded as observed methods with a researched counter.
8. Service and loss get individual endings: a named departure leaves a
   milestone and a survivor's response.

**Small touches (24 in the report):** wages and food felt per person, a
reason list behind each mood, a warning before desertion, scars that change
a role, news that a war began and ended.

### Kenshi second pass findings (2026-10-08)

From the private decoded game data (no reinstall). Report:
`docs/research/kenshi/second-pass/REPORT.md`. Native combat and AI were not
recovered.

- **Rescue is not recruitment.** Paying, persuading, unlocking a cage and
  buying freedom are different outcomes. A freed person can travel with you
  for a while, join, thank you and leave, or reject a former captor.
  Leaving still counts as a successful rescue.
- **Earlier harm is remembered:** a staged rescue doesn't earn the victim's
  gratitude.
- **Recruits have motives:** a hire keeps a personal reason; a no-skill
  hopeful names the trade they want; a wounded fugitive hides their status
  until helped.
- **Founding gives politics an address.** A basic building makes you a
  target for territorial contact; production chains bootstrap from mining;
  crops depend on local land.
- **Obligations are separate deals:** money tax, food tribute scaled to
  town size, and ritual attendance each have their own terms and armed
  consequences.
- **Removing a ruler reshapes the place:** a prison farm can reopen as a
  service town; road populations change; you may be pursued personally.
- **Bodies change the life available:** a missing arm, a cheap prosthetic,
  a specialist replacement and robot upkeep each change work differently.
  **Repair is a different service from healing.**

**The lane's ranked proposals (not decisions):**
1. Help before membership: aid a wounded stranger, escort them, hear their
   trouble; they join or leave grateful.
2. A recruit wants a trade and practices toward it.
3. Read an enemy's advantage and pick a counter.
4. A shared workshop earns an address and draws visitors.
5. Each obligation (tax, levy, ritual) is its own deal, with refusal and
   deferral.
6. Freedom changes a service: two named custodians, and outcomes reopen a
   market.
7. Repair opens a different life: injury changes a function; cheap repair
   restores work; a specialist device adds capability and upkeep (harsh
   modes only).

**Small touches:** shelter first, the offer to join later; someone thanks
you and walks on alone; capture and death make different news; an alliance
quietly ends a collector's visits.

A draft world card, the Red Basin, is in [WORLD_CARDS.md](WORLD_CARDS.md).

### Far-field genres and tropes findings (2026-10-08)

Report: `docs/research/far-field-tropes-2026-10-08/REPORT.md` (17 genres,
36 tropes with four variants each, 24 new ideas). The trope list is a
chosen sample, not a measured popularity ranking; genre notes come from
publisher and wiki pages.

- **Borrow how a genre makes ordinary choices matter,** not its minigames:
  dating sims weight attention and timing, hospital games weight handoffs,
  detective games weight evidence, raising sims weight someone else's
  future.
- **Relationships need a shared future, not a bigger bar.** NPCs initiate,
  accept counteroffers, and have plans that may clash with yours (one wants
  a workshop, one wants to travel each season).
- **Service is limited by handoffs** between people (a clinic, a kitchen),
  so the fix isn't always more skill.
- **Evidence has structure:** two testimonies can be one story repeated;
  timing decides what proof you can still reach.
- **Simultaneous commitment** (Diplomacy): allies' real choices are
  revealed together, so promised support can differ from real support.
- **Teaching order matters:** what you teach first, and the goal the learner
  sets, produce different careers.

**Genre mechanics worth taking:** shared plans over affection grind
(Tokimeki Memorial, Monster Prom, Stardew); patient flow through stages
(Two Point Hospital); a menu then a capacity-limited shift (PlateUp!);
spend now or save for tomorrow's offer (Slay the Spire); secret orders
resolved together (Diplomacy); reconstructing past events from evidence
(Return of the Obra Dinn); knowing *when* beats grinding (Outer Wilds);
obstacle clocks and faction downtime (Blades in the Dark); asymmetric
factions (Root); long raising horizons (Princess Maker, Long Live the
Queen).

**Trope variations not already above:** a traveling board that accredits
many tiny schools; summoned as an expert witness whose job is to train
replacements and leave; several heirs each holding an incomplete edition of
one inheritance; a clean inheritance where you choose who else receives it.

**New ideas:** a gift that gains history (a replacement doesn't carry it);
public ally, private disagreement; certify a routine by handing it over to
someone; observation windows that recur (a tide); repealing a law leaves
cohorts who paid the old cost and cohorts who didn't.

**The lane's ranked proposals (not decisions):**
1. An NPC invites you to share a life: invitation, counteroffer or decline;
   friendship is a complete outcome.
2. A sect is a school you shape: two learners, two teaching orders, one
   field problem.
3. An investigation you can reason through, including one false inference
   from repeated testimony.
4. A healer becomes a clinic organizer: cases through diagnosis, prep and
   follow-up.
5. A dinner changes who meets whom.
6. A council commits before it knows, then a repealed rule splits people
   into cohorts.

### Power scaling findings (2026-10-08)

Report: `docs/research/power-scaling-2026-10-08/REPORT.md`. Sources were
Reddit threads, wikis (several blocked) and local notes; no book was read
fresh. **No proposal challenges the no-universal-rank rule.** *(Claude, 2026-10-10: that "rule" was never accepted; it is now a default with verse equalization as a dial.)* The lane did
challenge three of Claude's own lines in this doc (marked where they
appear): automatic rank reset on ascending, blanket barrier suppression, and
"the higher tier wins" when absolutes collide.

- **Scale is several separate axes:** effect, targets, reach, contact,
  speed, defenses, authority, preparation. Community tier labels are
  vocabulary only.
- **Legends are evidence, and arguing about them is part of life.** Store
  what happened, who saw it and under what conditions, apart from any NPC's
  conclusion. A rumor can open a job or draw an enemy without being true.
- **Infinity gives strange places, not bigger numbers.** More dimensions is
  not more energy.
- **Outgrowing a world changes responsibilities:** protect passages, teach,
  tend several homes. Old obstacles stay visibly easy (no forced scaling),
  and home stays meaningful. Readers complain that ever-larger stakes make
  people replaceable.
- **Our books don't make multiversal destruction normal;** they support
  cross-world mechanisms, not universe-busting.

**Terms worth using:** feat (event with observer, conditions, aftermath);
statement (claim with a speaker and confidence); anti-feat (keep failed
predictions, investigate the cause); outlier (preserve the one-off, not
repeatable by default); hax before stats (resolve contact, eligibility and
counters before endurance); durability negation bypasses one named defense;
resistances name their scope (fire protection is not mind protection);
**range versus reach** (a curse can reach marked souls across a cluster but
not an unmarked stranger next door); the scaling-chain fallacy (A beat B, B
beat C, so A beats C) as a mistake NPC scholars make; **avatar versus true
body**; authority as a license within a domain, not an energy number.

**Cosmology (replaces Claude's six layers):** four scopes treated as
relationships, not a ladder: a world; a cluster joined by routes; a
multiverse defined by its own cosmology, finite or infinite; and what lies
between multiverses. Plus five optional "infinity" places, each a bounded
expedition: an endless numbered archive, a continuum coast, an ordered
stair, a rule foundry, axiom gardens.

**The lane's ranked proposals (not decisions):**
1. A feat notebook: event, observer, source, conditions; claims versus later
   evidence.
2. Hub arguments with consequences: publish, correct, ignore or investigate
   a rating; boards are fallible institutions.
3. A cross-world capability dossier: how a power finds, reaches and
   affects a target, and what fuels it.
4. Outgrow obstacles, keep a home.
5. Barrier field science: measure an edge, track forecasts, choose repair,
   study or passage.
6. Contests of authority: governing a domain versus getting through by
   craft or diplomacy.
7. An infinite archive as a bounded expedition.
8. Stewardship beyond one world.

**Small touches:** a tavern board ranks a carpenter above a visiting hero
and shows why; an old claim gains a correction in different handwriting; a
"limitless" healer declines a soul wound; the first old enemy becomes
effortless; two clocks disagree near a passage; a smuggler sells
coordinates with no return anchor; two parallel selves dislike being called
copies; after a cosmic victory, home has a warm meal and one unfinished
promise.

### Xianxia masters findings (2026-10-08)

Report: `docs/research/novels/xianxia-masters-2026-10-08/REPORT.md`. 17
works compared from wikis and reviews (no fresh full reads), plus local
Reverend Insanity, Lord of the Mysteries and Circle of Inevitability notes.
Aliases fixed: Beseech the Devil is Pursuit of the Truth; A Thought Through
Eternity is A Will Eternal; Battle Through the Heavens is by Heavenly
Silkworm Potato, not Mad Snail.

| Novel | Signature mechanic | Scale |
|---|---|---|
| Renegade Immortal | A domain comprehended personally; laws become essences | Star systems |
| I Shall Seal the Heavens | Three severings; soul lamps burned with life | Ever-wider heavens |
| A Will Eternal | Body cultivation alongside; alchemy; a world will's approval | Starry setting |
| Pursuit of the Truth | Blood and body marks; life-and-death insight; branching realms | Nested cosmic life |
| Reverend Insanity | Gu rank, aptitude, attainment and fuel kept separate; feeding | Aperture worlds |
| Desolate Era | Choose your Dao first; a risky merge that can erase it | Hegemon scale |
| Soul Land | A soul ring from a beast at every bottleneck adds a skill | Godhood beyond a capped ladder |

**What makes progression feel earned:**
- **A breakthrough should do something new,** expose a new dependency, or
  change how people treat you. A law that lets you fly beats another
  multiplier.
- **Gains are causally legible:** prerequisites shown, old knowledge
  returning as a method, preparation changing an outcome, costs visible
  after success.
- **Insight grows out of work, loss and relationships** (Er Gen).
- **Know-how, aptitude, body, living source, fuel, custody and practiced
  execution are separate kinds of progress** (Gu Zhen Ren); feeding makes a
  household economy.
- "Earned" means a causal chain you lived through, not slowness or the
  absence of cheats.

**The lane's ranked proposals (not decisions):**
1. A breakthrough proves a new operation (a gardener learns selective
   pruning).
2. Method, body, fuel, custody and permission are separate things.
3. A failed refinement leaves diagnostic evidence.
4. Advancement changes a local relationship (a mentor offers dangerous
   paid work).
5. Sustainable power portfolios: feed from crops, buy, or trade the source
   away.
6. Tribulations test the kind of growth, with alternatives to fighting (a
   flood trial: evacuate, divert or fight).
7. Borrowed authority has a lender, a scope and revocation.
8. Cosmic progress keeps local consequences.

**Worth a full read if Weibao supplies EPUBs:** Renegade Immortal, I Shall
Seal the Heavens, Desolate Era, A Will Eternal, Mysteries of Immortal
Puppet Master.

**Small touches:** an elder asks what grew back after you cut a tree; a
feeding jar carries the last owner's handwritten corrections; a failed
refinement leaves a cracked but repairable tool; a master goes back to
carving bowls between profound lessons; a patron's seal fades after one
favor is repaid; the breakthrough feast includes the toolmaker who helped.

**Both lanes converge on one first proof:** an ordinary work problem
teaches one new operation, a witnessed event enters the notebook, a board
or mentor reacts, and the power still needs its real source.

### Novel wave findings (2026-10-09)

Four series read in full from the supplied files: Wish Upon the Stars 1-4,
You Are Summoned 1-5, A Soldier's Life 1-5, Genetic Ascension (to ch 223,
mid-story). Local notes: `docs/research/novels/novel-wave-2026-10-09/`
(gitignored). The new value is operating detail: power changes your job,
duties and risks, not just your numbers.

- **Wish Upon the Stars:** a wish passes three separate checks: can it be
  done, is there charge left today, and is the payment valid. A donor's
  skill, memory, body or stat can pay. Repeated tweaks stabilize a custom
  technique. Renown is a resource enemies can also use.
- **You Are Summoned:** each class step (summoner, commander, contracted
  summoner) changes the whole routine: mana reserved, roster, paid work, and
  what happens when you die or go home. Living companions, constructs and
  figurines follow different rules.
- **A Soldier's Life:** a useful power changes your posting, pay and
  political exposure. Storage magic means custody of medical supplies and
  wages. Permanent imprinted storage and temporary cast storage fail
  differently. Promotion brings command and blame.
- **Genetic Ascension:** a temporary Gene State sets intake odds. Gene, stat
  and species caps are separate. One fragment can grow you now, go toward a
  Crystal path, or pay upkeep. City membership adds duties and visibility.

Original world cards drafted: the Concord of Waymarks, the Lantern Compact,
the Ember March, Shatterreach.

**Ranked proposals (P1-P8):** P1 a guard or courier career in the Village
(one shift, loaned kit, pay, a colleague who remembers); P2 a breakthrough
unlocks a new operation and a new responsibility; P3 a small bargain service
with preview, eligibility and payment checked separately; P4 coming home
changes your routine; P5 skills learned by practice differ from skills
handed to you; P6 a body-growth world with competing uses; P7 companions and
workers run on different rules; P8 verified deeds versus rumors.

The library-games lane points the same way: Theory of Magic's practical study
(read, practice, use the tool, see the difference) overlaps P5.

### Lore and expansion ideas (Claude, 2026-10-09)

- **L1 One ledger, many dialects.** Whatever woke you keeps accounts. Wish
  quotas, class contracts and gene states are different worlds' bookkeeping
  for the same thing. Found in pieces, never explained outright, so the
  awakening stays mysterious.
- **L2 The previous tenant.** Someone held your body or post before you. You
  inherit their unreturned kit, an open debt and a colleague who expects
  them back. Ties P1 to the transmigrator start.
- **L3 Worlds that invoice each other.** Carrying power between worlds has an
  exchange rate set by hub treaties. Some worlds treat it as smuggling.
- **L4 Summons both ways.** Another world can pull you out mid-shift, and
  your Village job notices the absence (P1 plus P4).
- **L5 Your tutor sold a memory.** A donor economy runs underground. Your
  teacher paid for something with the memory of teaching you, so you know
  them and they don't know you.
- **E1 Ember March first.** As the first new world after the Village career,
  the soldier card reuses P1's duty, kit and pay systems instead of needing
  new ones.

## Research lanes (2026-10-08)

| Lane | Folder | State |
|---|---|---|
| Novel wave (five books, 14-book comparison) | `docs/gm/dispatch/novel-wave-2026-10-08/` | Done, folded in |
| Hubs and heavens | `docs/gm/dispatch/hubs-and-heavens-2026-10-08/` | Done, folded in |
| A Novel Concept, full audit | `docs/gm/dispatch/a-novel-concept-2026-10-08/` | Done, folded in |
| A Novel Concept, second pass: reward menus, rewinds, the skill stack, absolute perks | `docs/gm/dispatch/anc-depth-2026-10-08/` | Done, folded in |
| Rewinds, reward choices, no-exception cheats, Jumpchain, time-travel worlds | `docs/gm/dispatch/time-rewards-cheats-2026-10-08/` | Done, folded in |
| Tale of Immortal: proper extraction (IL2CPP, config tables) and life-sim audit; read-only, no uninstall | `docs/gm/dispatch/tale-of-immortal-2026-10-08/` | Done, folded in |
| Battle Brothers: extraction and audit for followers, the company as a faction, late-game crises | `docs/gm/dispatch/battle-brothers-2026-10-08/` | Done, folded in |
| Kenshi second pass: recruiting, founding towns, faction world states, bodies, being a nobody (from the private decoded data; no reinstall) | `docs/gm/dispatch/kenshi-depth-2026-10-08/` | Done, folded in |
| Far-field genres (dating sims and more), Royal Road trope catalog with variations, new ideas | `docs/gm/dispatch/far-field-tropes-2026-10-08/` | Done, folded in |
| Engine extension design study: check Claude's [engine sketch](gm/dispatch/engine-extension-2026-10-08/ENGINE_SKETCH.md) against live code, card schemas, save growth, migration plan (read-only on `src/`) | `docs/gm/dispatch/engine-extension-2026-10-08/` | Done; report at `docs/gm/engine-extension-2026-10-08/REPORT.md`, partly folded (card gating, UI) |
| Power scaling: community tiers, going multiversal, levels of infinity, cosmology of scale (web and local notes) | `docs/gm/dispatch/power-scaling-2026-10-08/` | Done, folded in |
| Xianxia masters: Er Gen, Gu Zhen Ren and other major authors' progressions (web sources plus local Reverend Insanity notes) | `docs/gm/dispatch/xianxia-masters-2026-10-08/` | Done, folded in |
| Open-source idle games: Progress Knight, Idle Loops, Evolve (cloned under their licenses) | `docs/gm/dispatch/open-idle-games-2026-10-09/` | Done; report at `docs/research/open-idle-games-2026-10-09/REPORT.md`. Its top proposal is the same Village career as novel P1 |
| Novel wave 2026-10-09: Wish Upon the Stars 1-4, You Are Summoned 1-5, A Soldier's Life 1-5, Genetic Ascension | `docs/gm/dispatch/novel-wave-2026-10-09/` | Done, folded in |
| Library games: Theory of Magic (locate first), then owned look-alikes one at a time (Sucker for Love, Kill the Lich Idle, Ani Idle, Endless Ascent, Upload Labs, The Lands of Eldyn, Bitburner from source) | `docs/gm/dispatch/library-games-2026-10-09/` | Done for public sources (Theory of Magic, Bitburner, Kill the Lich web); Steam installs not completed |
| Village career slice (P1 build: shift, loaned kit, pay, colleague, promotion) | `docs/gm/dispatch/village-career-2026-10-09/` | Built and browser-checked; awaiting Weibao's play. Report in that folder |
| Village wave 2: fix the three migration test failures and unplayed career branches, then the practical-study slice (known, practiced, usable) | `docs/gm/dispatch/village-study-2026-10-09/` | Built and browser-checked; 260/260 tests; awaiting Weibao's play |
| Village wave 3: the Mentor teaches one recruit Watchcraft; the recruit patrols solo and remembers you | `docs/gm/dispatch/village-mentor-2026-10-09/` | Built and browser-checked; 264/264 tests; awaiting Weibao's play |
| Web-novel scout: wildest cheats and premises from Fanqie, 69shu, ttkan, Qidian charts, fan fiction (gal-game cheats, ability evolution) | `docs/gm/dispatch/webnovel-scout-2026-10-09/` | Done; 93 mechanics, 48 titles, report in the gitignored novels folder |
| Web-novel deep read: Gal武圣, 我的功法怎么全变成了美少女？, Skill Eater, 御兽：我能无限进化, 我被她们恋爱模拟了？ | `docs/gm/dispatch/webnovel-deepread-2026-10-09/` | Running (Codex); switched to downloaded copies (FanFicFare, lightnovel-crawler) on Weibao's word |
| Village choices: teaching cost as player choice (pay, time, favor, free) plus up to three more choices | `docs/gm/dispatch/village-choices-2026-10-09/` | Running (Codex) |
| Book world 1: A Soldier's Life, direct recreation in a private pack, plus a public pack loader | `docs/gm/dispatch/soldiers-life-world-2026-10-09/` | Running (Codex): design now, build after village choices releases src |
| Steam installs audit: six Windows-only library games through the notproton tool, audit then uninstall each | `docs/gm/dispatch/steam-installs-2026-10-09/` | Done; six audits, north-star findings added. Sucker, Kill the Lich, Upload Labs removed; Eldyn, Endless Ascent, Ani Idle uninstall dialogs pending |

## Stat points and stats you raise by living (proposal, 2026-10-08)

Weibao: stat point assignment in worlds that have it, alongside ordinary
stats raised by doing.

- **Stat source is a world dial:** use-raised only (the Frontier), assigned
  points only (some system worlds), or both (the Crucible, Gluttony's
  Paradise).
- **Both, kept apart.** Trained stats and assigned points are two numbers
  that add. A visitor from a system world keeps what they trained; their
  assigned points may weaken or vanish in a world without a system.
- **Assignment choices matter:** order can matter (Gluttony's ordered
  spending past the human cap), caps per grade, rare respecs as rewards or
  shop items, and tribulations triggered by high totals (A Novel Concept).
- **Points come from somewhere:** levels, feats, firsts, quests, a shop.
  The source belongs to the world card.
- **Grades over numbers where the world prefers it:** Low, Pinnacle, EX
  instead of 37 or 142.
- **The body notices.** Pushing a stat past a grade can rebuild the body
  (EX in Gluttony), which crosses into the body-change systems.

## Rewards for deeds and cheats won in trials (proposal, 2026-10-08)

Weibao: Priam won his revival in a specific challenge, and the rewards he
gets for certain deeds are worth taking.

- **Cheats can be earned, not only born with.** A trial world or challenge
  grants a cheat to the first, the best or the only one who meets a
  condition. "First to clear" rewards are one-time per world.
- **Reward triggers:** firsts, records, rankings, kills above your tier,
  saving someone, a feat nobody tried, finishing a quest a certain way.
- **Reward shapes:** a pick of three offers, a fixed prize, a random roll
  with pity, or a title that grows.
- **Guards against farming:** one-time rewards, no swapping after a reset,
  rewinds that can be detected (all in A Novel Concept).
- **Trial worlds** as places: high time ratio, suppressed items, a referee,
  and a ranking board that other contractors see.

**What A Novel Concept actually does (audit read, 2026-10-08):**
- **The origin trial.** Earth's Tutorial lets each person pick a
  difficulty, which can be lowered but never raised. Priam picked
  Impossible: cross one of a hundred portals within seven days, with one
  champion surviving per Tutorial. A hidden quest (kill a corrupted monster
  far above him, done with a trap) gave a unique talent: on death, wake at
  the Tutorial's start with only your memories, and nobody who knows the
  talent exists can receive it. The book never shows the daily revival
  being granted; the link between the two is inferred.
- **Rewards are mostly picks.** A tribulation offers as many picks as
  tribulations you survived at once (a quadruple gives four), from a list:
  delay the next tribulation, resurrect one soul, time stasis, big
  potential grants, a slice of human knowledge, bloodline purification,
  or free stat points. A hundred-wave arena gives a pick at milestone
  waves (wave 20: a talent; wave 50: a mythic item such as a second-life
  tattoo). Events reward by ranking. A weekly survival menu offers one
  pick, including a one-time 24-hour rewind. Firsts ("first human to")
  are one-time titles.
- **Stats.** No levels or per-level points. Every skill level adds fixed
  stats; titles, race changes and fruit add more; assigned points come
  only from rewards. No respec. A soft cap: stats grow linearly while
  tribulations scale faster. Crossing stat thresholds raises your tier
  and triggers harder tribulations.
- **Enemies** (twelve major rivals tabled in the audit): a rival champion
  who kills him on arrival and becomes a mutual rival; a princess who
  edits probability and later allies; a mind-controlling cult; a king who
  judges mastery in a public duel; tribulation monsters such as plague
  swarms and a shadow of pride; a fallen being that suppresses Domains;
  a virus that rewrites his body's blueprint (so revival restores the
  damaged version); a guardian with four lives that he burns through; an
  eighth-tier entity that interferes with time and leaves him owing it.
  Each fight ends with a gain: titles, a race change, a new heart,
  dragon essence, or a debt.
- **Absolute perks with no stated drawback:** a spear throw that always
  finds its target; immunity to a mist; free passage through every dome
  toll; a heart that regrows daily; a mirror that can't reflect lies.

**Proposals from this:**
- **Difficulty chosen at a trial, lowerable but never raisable,** with
  hidden quests that reward the hard choice. Fits "choose a harsh life at
  birth".
- **Picks scale with risk survived:** surviving more at once earns more
  choices, not just bigger numbers.
- **"Can't be received by anyone who knows it exists"** is a great
  absolute rule for secret cheats: knowledge itself locks the reward.
- **Rewards that are debts:** an entity that saves you and says you owe it.
- **Stats from living by default,** with assigned points only as rare
  rewards, matches the Frontier and keeps assigned points special.

## Enemy powers and how they work (proposal, 2026-10-08)

- **Enemies run on the same framework as the player:** world cards, tiers,
  concepts, cheats and limits. A boss is a life with history, not a stat
  block.
- **Enemy archetypes:** a system holder, a regressor, a concept holder, a
  world will, a rival hub's contractor, a cheat's original owner, an
  expansionist army, a parallel self.
- **Every enemy power has a tell, a counter and a cost**, discovered by
  observation, research or losing to it once (and surviving).
- **Enemies grow while you aren't watching** (coarse yearly simulation),
  remember how you beat them (Nemesis), and copy your busted builds.
- **Enemy powers are lootable or learnable,** at a price: consume to gain,
  study a corpse, steal a cheat, inherit a defeated rival's seat.
- **Threat is shown in words, not just numbers,** scaled by your
  perception: "unremarkable", "heavy", "the air bends around him". A
  stronger observer sees more (Kairos's observation ceiling).
- **Difficulty both ways (Weibao, 2026-10-08):** numbers and mechanics
  together. Numbers give the felt climb (a tier gap you can see, a wall you
  grind past); mechanics give the puzzle (an enemy that suppresses
  concepts, steals luck, or only dies at night). This revises the earlier
  "mechanics, not bigger numbers" reading of USER_VISION L540.
  - Big number gaps belong at tier boundaries, where a breakthrough is
    the answer.
  - Mechanical threats belong inside a tier, where a build or a counter is
    the answer.
  - Either kind can be bypassed by the other: a clever counter lets you
    fight above your numbers, and enough numbers crush a gimmick.

## How to represent powers and hidden things in text (proposal, 2026-10-08)

- **Display is a world dial.** A system world shows stat screens and
  numbers. A Dao world shows only prose and impressions. A potion world
  shows a sequence name and a madness tint. The same power reads
  differently by world.
- **Keywords and triggers** for synergies (Path of Achra style): short tags
  like *on kill*, *at night*, *when cut*, so busted combos are findable
  without walls of numbers.
- **Descriptors for hidden stats:** words that shift ("steady",
  "fraying") instead of a bar, with a few ways to measure precisely.
- **Uncertainty as a visible state:** unknown, rumored, believed, confirmed
  (already proposed for the Notebook) also applies to enemy powers.
- **Two bars where it matters:** understood and usable.
- **Tooltips carry the ledger;** button text stays short.

## Hidden stats (proposal, 2026-10-07)

Stats the player can't see directly; you read them from the log, dreams and
other people's reactions:

- **Sanity or composure.** It drops from forbidden knowledge, horror and
  grief; low sanity distorts log text and hints (Cultist Simulator, Lord of
  the Mysteries madness).
- **Karma or fate weight.** Deeds bend which events the director offers.
- **Reputation per group.** Each group remembers differently and you only
  hear it through gossip.
- **Luck.** Shapes chance by default, not a flat multiplier. A simple
  luck cheat (100x drops) is a dial.
- **Corruption or path drift.** It rises from repeated choices and changes
  what powers accept you.
- **Health beneath the surface:** hidden illness, aging debt from life
  extension.

Each hidden stat should have at least one way to estimate it (a mirror, a
fortune teller, a doctor, a friend's honest word), so discovery stays fair.

## Absorbed from USER_VISION (cross-check, 2026-10-07)

A line-by-line check of [USER_VISION](USER_VISION.md) found these requests,
in Weibao's own words, that this doc had not covered. Line numbers point into
USER_VISION.md. They are folded in here as scope; none is a decision on how.

**Worlds**
- Rifts, mini-worlds and sub-planes (L246); many types of multiverse (L1158).
- Nonhuman or odd starts: "start as tree", or reincarnating without the old
  power (L1140).
- Franchise worlds (Naruto, Bleach, Harry Potter), prequels and comic-book
  worlds (L1088, L1100, L1112, L1140).
- Wander or idle zones with automated gathering "with chance of big monster",
  plus the Hanzi field as optional atmosphere (L560-622).
- Base-building, and removing caps that exist only for convenience (L79-80).
- Power-gated meddling: "stuff that I shant meddle in until I have the
  power" (L286).

**Progression and items**
- Golden fingers and treasures: a time-travel ring, a "system", a magic jar
  (L378); starting advantages that change a whole run (L386).
- Skill tiers with benefits at critical points, tiering up by chance or by
  action (L680, L684).
- Mastery beyond "Advanced", even surpassing the technique's creator (L706).
- Choosing advancement routes (L716); skill combinations (L654).
- Fine-grained modules and tiers (L1102).
- Status effects and hard achievements (L64-67).
- Bloodlines that level (L540); new energy systems (L298).
- Crafting paths: training, technology, "building a suit", magical crafting
  (L1100).
- More percent-based effects (L370).
- Difficulty from mechanics, not bigger numbers (L540, L1134).
- A restart that has to be unlocked (L886).
- JoJo-style conceptual abilities and Universal Thief audits (L1134).

**Combat and enemies**
- Enemies with their own skills and power systems (L550); final enemies
  that make sense in the lore (L170).
- Enemies who find you; locators that bypass hiding (L300, L1042).
- Identity and luck stealing, young-master chains, the heavens' chosen (L424).
- Shows of deep power, such as a powerful being noticing it lives in a
  simulation (L256).
- Secretly powerful NPCs you might attack, like the village chief (L794).
- Open-world aggression with karma and reputation (L784).

**NPCs and social**
- Other characters with inventories, traits and titles (L468).
- Scripted encounters driven by favorability (L856).
- A party inventory screen, and saving it (L866).
- Dialogue and reaction writing (L1122).
- Trust and relationships left open-ended (L926); relationship overview
  menus (L997-1005).

**UI**
- The Notebook overlaps the quest page; move it out of the move menu, with
  "more details in bio" (L979, L990). Menus "need work" (L968).
- Text-first, with live events beyond your control (A Dark Room, Level 13)
  (L760, L774).

**Story and fate**
- Timeline styles and different endings (L184).
- Moving up and down the story chain, with a journey's end as part of the
  loop (L322, L354).
- Scripted events whose outcome depends on stats and knowledge (L362).
- Overarching timelines across worlds (L1140).

**Process (for agents)**
- A GM hierarchy: a master GM over world GMs and implementers (L1052, L1064).
- Self-refresh of context (L1076); subagent pools per chat (L1176).
- Subagents read whole books (L264, L1182).
- "Save everything accordingly and in detail" (L468, L1034).
- Simple rules first (L410).
- Mine fork networks (L150).
- Trailblaze now and save tests for later (L1164). The newer AGENTS.md
  (2026-10-07) still requires a browser check before calling gameplay done.

**Conflicts fixed in this doc:**
- Life length is now long, not one to three hours.
- The events panel uses filters plus the bio instead of new views.
- Power: anything can grow overpowered through mastery; busted synergies
  and real cheats are allowed.
- Test files are optional where costly.
- The framework holds shapes, not rules.

## Book worlds as direct recreations, and abilities as characters (Weibao, 2026-10-09)

Weibao: recreate book worlds directly, not only original worlds inspired by
them, and change premises freely.

- **Already allowed** (PROJECT.md, Worlds). Recent lanes defaulted to
  original-named cards; that was caution, not a rule. Going forward a
  read book gets both: a direct recreation and, where useful, an original
  remix.
- **Where they live:** direct recreations (names, characters, places, plot
  beats) go in a private content pack outside git, loaded when present;
  the public fork keeps original names over the same mechanics. See "Is fan
  fiction public domain?" above.
- **Premise dials per book world:** canon (follow the arc), divergent (same
  setting, history changed by you or by a twist), remix (the world meets
  another world's laws), and swapped premise (the same cast under a new
  rule, the way fan fiction does: "what if the protagonist's cheat went to
  the villain", "what if the system is a dating sim").

**Abilities as heroines: the gal-game cheat.** Each ability is a character
with affection, routes and moods. Using a skill is spending time with it;
neglect makes it sulk (weaker, unreliable) and devotion unlocks its route
(evolution, a fused form, a confession scene that is a breakthrough). Two
abilities can be jealous of each other, so synergies are relationships.
Endings per ability: true route (ultimate form), friend route (stable but
capped), bad route (it leaves or turns on you). Fits the cheat-tier system:
a pure cheat at the top, a corrupted version that is a yandere ability.

**Abilities as monsters: the Pokémon/digimon frame.** Abilities are caught,
trained, leveled and evolved along branches chosen by conditions (time of
day, held item, what you fought, friendship); they have types and
weaknesses, can be traded with other characters, and you carry a limited
team while the rest wait in storage. Fusion breeds new abilities with
inherited traits; a shiny is the "unique tier" of a common skill. Pairs with
the existing "humble vanilla skills to busted" and skill-evolution sections.

Both frames are cheats, not world defaults: one world, or one character,
treats abilities this way, and carrying the frame to another world is its
own question.

**More to consider (Claude, 2026-10-09, after the scout):**
- **Teaching a technique that has feelings.** If abilities are heroines,
  teaching Watchcraft to Iona means introducing her to your technique. It
  can be jealous, proud of a good student, or split so Iona's copy becomes
  its younger sister with her own personality.
- **The student overtakes you.** Iona learns faster than you did, and your
  old method fears being replaced (Gal武圣's beginner technique, aimed at
  the mentor instead).
- **The wrong system lands on Iona.** A cheat meant for you binds to your
  recruit; you have to work with her or win it back.
- **Favors instead of coins.** Teaching and lending kit could earn favors
  Tessa or Iona owe you, cashed in later for help, cover or a secret.
- **Explain-the-miracle world.** A Village scholar who only believes magic
  you can explain; a world where unexplained power fails in public
  (Scientific Feng Shui).

**Scout lane (dispatched 2026-10-09):** Chinese web-novel platforms and
aggregators (Fanqie, 69shu, ttkan, Qidian charts and more) plus fan fiction
for the most out-of-pocket cheats, systems and premises. Notes in
`docs/research/novels/` (gitignored).

## More to consider (collected from chat, 2026-10-07 and 2026-10-08)

Ideas raised in chat but not yet placed above.

**Power and limits**
- Mastery changes how a skill works, not just its numbers: a basic sword
  at mastery 1000 cuts space.
- The world notices busted synergies: rivals copy them, sects want them, the
  heavens react.
- A balance valve: instead of nerfing a busted build, it attracts danger,
  tribulations or jealous cheaters.
- Breaking a limit changes you and announces you; it's how the world learns
  what you are.
- Some limits belong to a world's rules, so travel is a way past a cap. That
  gives the multiverse a mechanical reason to exist.
- Uniques can overlap or conflict, which creates natural rivals.
- Fusion recipes are discovered (mentor hints, a rival's display, past-life
  memory), not listed.
- A skill evolves differently under each world's rules: a sword Dao might
  become a Gu recipe in one world and a potion pathway in another.

**Knowledge**
- Knowledge can be wrong or go stale; a prophecy shifts once you act on it.
- Knowledge has a price: a favor, a secret, years of life, a debt.
- Some knowledge is dangerous to hold (sanity or corruption cost).
- Acting on future knowledge gets you noticed; that's how regressors are
  found out.

**Worlds and hubs**
- The home world can be invaded by an expansionist world or a hub's
  contractors. That gives the home campaign stakes without touching the
  vanilla opening.
- Hub contracts work like a career: missions, quotas, debts.
- A hub may see your hidden stats or past lives, making it one of the "NPCs
  who know too much".

**Other interesting ideas (Claude, 2026-10-08)**
- **Your old self as a rival.** In a parallel world, a version of you that
  made different choices.
- **Places remember.** Your past lives' homes become ruins, shrines or
  tourist traps that you can visit.
- **Teaching as power.** Students carry your techniques forward and can
  surpass you; a sect is a long-term build.
- **Trading lifespan.** Sell years of life for power, or buy them; a dark
  economy.
- **World ecology.** Over-hunting, over-cultivating or plundering leaves a
  world poorer on later visits (Speedrunning the Multiverse shows this).
- **Seasons of the multiverse.** Worlds drift closer and farther apart, so
  some routes open only at certain times.
- **The system as a character.** A system or golden finger with moods,
  secrets and its own goals, maybe a con.
- **Retirement as an ending.** A life can end by stepping back to make,
  heal and teach, not only by death (Speedrunning the Multiverse epilogue).

**From the novel-wave findings (Claude, 2026-10-08)**
- **Two progress bars per technique:** understood and usable. Research fills
  the first, practice the second, and a cheat may only fill one.
- **Odds are not results.** A divination or golden finger shows a
  percentage; the attempt can still go the other way, and the log keeps both.
- **The leashed boon.** A world or hub lends great power for a few actions,
  and each use tightens its claim on you.
- **Promise ledger.** Every promise you make or receive is tracked, with due
  dates; broken ones feed reputation and karma.
- **War has an aftermath.** After a battle come pensions, widows, veterans
  and memorials, and a leader path pays for them or loses loyalty.
- **Contribution, not last hit.** Deeds credit the planner, healer and
  scout, so support paths earn renown too.
- **Cheap copies of rare recipes.** Substitutes keep part of the effect, so
  poor characters can reach rare power slowly and weakly.

**On distinct worlds (Claude, 2026-10-08)**
- **Laws you learn by breaking.** A world's absences are discovered when
  you try something and it fails, and the log tells you why.
- **Smuggled mechanics.** Bringing a power into a world where it's absent
  makes you a rare (and hunted) exception; teaching it there changes the
  world over decades.
- **Border towns.** Places where two worlds' cards overlap and both sets of
  laws half-work: markets, smugglers, refugees.
- **A world that loses a law.** Events can switch a signature law off (a
  Concept dies, a Spell breaks), and the world's people must adapt.
- **Native vs traveler cards.** Natives may get a dial travelers don't (the
  daily revival only for champions, a bloodline only for locals).
- **World lore as discovery.** The card's premise starts blank and fills in
  through gossip, books and deeds, so the lore itself is a reward.

**On cheats, enemies and engines (Claude, 2026-10-08)**
- **Cheat ecology.** Cheats are a population in the multiverse: born,
  traded, stolen, inherited, extinct. Some worlds produce them; some hubs
  sell them.
- **The cheat remembers its last host.** A secondhand cheat carries habits,
  debts or enemies from its previous owner.
- **Your cheat is someone's enemy power.** When you take a rival's cheat,
  its maker may come looking.
- **Engines to absorb as needed:** Path of Achra for trigger keywords,
  Caves of Qud for procedural history and unidentified things, Crusader
  Kings III for traits and hidden opinions, RimWorld for pawn memories,
  Tales of Maj'Eyal for talent trees with categories. Each only when a
  build pass needs it.
- **Enemy notebook.** The Notebook keeps a page per enemy you've met: seen
  powers, guessed counters, rumors, all with reliability states.

**On cheat tiers and shops (Claude, 2026-10-08)**
- **Cheat awakening late.** A dormant cheat wakes at 40 or 70, which fits
  the late-start origins.
- **Inherited cheats.** A cheat can pass to an heir, changed, as a legacy.
- **Cheat-hunters as a profession** in some worlds, and cheat-sellers in
  some hubs.
- **Shop reviews.** Other contractors gossip about which shop cheated them.
- **Cheat counter-tech.** Worlds that know about cheats build seals,
  detectors and wards against them.
- **The cheat's own tier ceiling.** A cheat that can't grow past a tier
  becomes a limit, so finding a way past it follows the usual rule.

## Draft decisions awaiting review

Weibao: "D2 seems reasonable but we can take more look" (2026-10-07). Not
accepted yet.

- **D2a Protagonist fate.** Book protagonists are very hard to defeat, or are
  saved by the story, unless their fate is severed. How this works differs per
  world. (His words, 2026-10-06.) Not settled: fate works per world, the way
  each source book handles it, including what it protects, whether future
  or potential counts, and what severing does. See Fate by book in
  [RULES_FROM_SCRATCH.md](RULES_FROM_SCRATCH.md#fate-how-the-books-do-it).
- **D2b Idle vs active.** Idle progression is the backbone and active play
  steers it. Routine work runs itself with stop conditions; active play
  unlocks routes and recipes; solved tasks become routines; preparation wins
  ordinary fights; no system is mandatory. (His question, 2026-10-07; wording
  drafted by Codex.)

## Open decisions for Weibao

1. Life sim as north star: accept, adjust or reject the test above.
2. Which origins first (vanilla stays the default).
3. Memory-loss mode: an origin, a world event, or both.
4. Events panel: whether to make it the main life display.
5. First slice candidates: an aging log voice, aging that changes play, and
   death with a legacy. They reuse the existing lifespan clock.

**Claude's view on 1-5 and D2 (2026-10-08, proposal):**
- 1: accept the "does this life feel lived?" test as a review question, not
  a gate, so systems work like the D1 alloy still passes when it feeds a life.
- 2: vanilla first, then the late start (village elder) and the legacy heir,
  because both reuse the lifespan clock and the heir lane that already exists.
  Transmigrator and regressor come with the first book world.
- 3: both. An origin at birth, and a rare world event (a curse, a head wound,
  a reincarnation gone wrong) mid-life.
- 4: no. Keep the center menu main; the life lives in log filters plus the
  bio, as the panel section says.
- 5: aging that changes play plus death and heir, in that order. The log
  voice is cheap polish and rides along with either.
- D2a: accept with one change. "Fate protects survival, not victory" should
  also apply to the player's own cheat origin, so fate is a rule of the
  multiverse, not a book-only shield.
  *Revised the same day after the hubs-and-heavens lane:* no source makes
  fate a multiverse law. Fated Villain transfers fortune with specific
  cards, Reverend Insanity grants a specific immunity, Omniscient Reader
  makes intervention costly. Better: each world card names its own fate
  mechanism (what it protects, how it is detected, how it is countered),
  and a cheat origin has only the rules its card declares. *(2026-10-10:
  "survival, not victory" is no longer a default; each world follows its
  source book. See [Fate by book](RULES_FROM_SCRATCH.md#fate-how-the-books-do-it).)*
- D2b: accept as written. It matches "routine runs itself" and long lives.

## Steam install follow-up findings, 2026-10-09

*Findings and original adaptation proposals only. No accepted decision or
implementation. [Combined audit](gm/dispatch/steam-installs-2026-10-09/REPORT.md)
and [per-app status](gm/dispatch/steam-installs-2026-10-09/STATUS.json).*

**F1 Acquisition:** All six targets reached Fully Installed during the watch.
Audits ran one game at a time, with private source copies and matched hashes
before each uninstall URI request. Actual removal remains a separate gate.

**F2 Source scope:** These are bounded static source passes. No game launch,
pacing measurement, rendered UI or save/reload/import test occurred. Eldyn's
local wrapper cannot establish its remotely delivered game mechanics.

| Source | Finding | Limit |
|---|---|---|
| [the-lands-of-eldyn](research/the-lands-of-eldyn/REPORT.md) | Local wrapper loads remote game; menu navigation is inspectable, territory/army/NPC rules are not. | Remote host public-source recovery failed including DNS; no runtime or remote game logic. |
| [sucker-for-love-crush-landing](research/sucker-for-love-crush-landing/REPORT.md) | Typed heart milestones remember preparation choices and inform final scenes; ending flags retained separately. | Full routes/localization/native extensions and runtime unverified; point_wicked/points_wicked discrepancy. |
| [kill-the-lich-idle](research/kill-the-lich-idle/REPORT.md) | Ordinary skills/social work feed prepared confrontation; 19 of 22 source files match normalized public source. | Installed cloud loading enabled but ordinary cloud write commented; runtime synchronization/pacing unverified. |
| [ani-idle](research/ani-idle/REPORT.md) | Repeat fights, manual skills, interruptible rest events, directed crystal crafting and chained quest memory. | No prestige/offline reconciliation found in inspected scripts; exact scene/resource data and runtime unverified. |
| [endless-ascent](research/endless-ascent/REPORT.md) | Weighted item puzzles, distinct missing-item checks, heat/hydration warnings and completion-funded consumables. | Scene bindings/serialized overrides/full route graph/checkpoint persistence/runtime unverified; no idle or prestige established. |
| [upload-labs](research/upload-labs/REPORT.md) | Research alternatives, flow bottlenecks, sample sell-versus-investigate choices, capped away-time reserve and distinct reset/refund paths. | Nine inspected automation bytecode entries truly blank; 11 recovered scripts blank in total; runtime/pacing/reset consequences unexercised. |

**F3 Adaptation:** Each dossier carries five-to-ten ranked original proposals
and at least twenty small touches mapped to native YAIR. The following are
review candidates, not instructions to implement or new accepted rules:

| Code | Carry-forward original proposal | Evidence and future gates |
|---|---|---|
| P1 | Let one optional relationship milestone remember how a prepared gift was made, then recall that cause later. | [sucker-for-love-crush-landing packets](research/sucker-for-love-crush-landing/IMPLEMENTATION_PACKETS.md) |
| P2 | Let ordinary practice and a familiar contact open useful work and affect preparation for a specific threat. | [kill-the-lich-idle packets](research/kill-the-lich-idle/IMPLEMENTATION_PACKETS.md) |
| P3 | One native rest encounter leaves remembered aftermath rather than becoming compulsory upkeep. | [ani-idle packets](research/ani-idle/IMPLEMENTATION_PACKETS.md) |
| P4 | Show one native workshop chain’s limiting input and useful output through a clear bottleneck receipt. | [upload-labs packets](research/upload-labs/IMPLEMENTATION_PACKETS.md) |
| P5 | An optional local encounter shows item contributions and partial progress, then pays its completion reward once. | [endless-ascent packets](research/endless-ascent/IMPLEMENTATION_PACKETS.md) |
| P6 | Make close, return, leave and unavailable states distinct in the existing center menu. | [the-lands-of-eldyn packets](research/the-lands-of-eldyn/IMPLEMENTATION_PACKETS.md) |

Preserve the vanilla opening and center menu. These findings select no additional
prestige layer, networking/account system, new death policy or save migration.
Existing playable acceptance work stays with its current owners.

### Web-novel scout findings (2026-10-09)

*Proposals only. The [scout report](research/novels/webnovel-scout-2026-10-09/REPORT.md)
ranks twenty ideas from 93 mechanics across 48 titles. Reading covers public
synopses, openings, isolated later chapters and quest-author rules; no full
novel or playable implementation is claimed.*

- **P-S1 Technique relationships:** [Gal武圣](https://mip.ciweimao.com/book/100456881)
  makes courting a technique a mastery route. Proposed YAIR use: one optional
  method remembers practice and reaches a new use through a relationship event.
- **P-S2 Living abilities:** [Skill Emperor](https://www.royalroad.com/fiction/129190/skill-emperor-i-can-bring-my-skills-to-life-isekailitrpg)
  animates skills. Proposed use: a method becomes a household resident with
  its own care, work and growth, rather than merely another stat multiplier.
- **P-S3 Recipe evolution:** [御兽：我能无限进化](https://www.69shuba.com/txt/46292/30981758)
  gives moves branching recipes. Proposed use: practiced native methods feed
  different applications, with missing ingredients shown honestly.
- **P-S4 Exact weird costs:** [科学风水：我用物理学解释厉鬼，](https://fanqienovel.com/page/7603689703006538777)
  requires a mundane explanation after magic. Proposed use: an optional cheat
  has one specific social obligation and a remembered failure consequence.
- **P-S5 Changed recipients:** [我被她们恋爱模拟了？](https://www.novelupdates.com/series/am-i-being-simulated-in-their-dating-game/)
  transfers a rejected simulator to its former targets. Proposed use: an NPC
  inherits a discarded cheat and acts on knowledge it actually supplies.

Literal technique romance, living skills, ordinary dating systems and beast
companions remain distinct source families. These findings authorize no new
origin, world, persistence rule or replacement of the vanilla opening.


### Web-novel deep-read findings (2026-10-09)

*Research findings and original proposals only. [Deep-read report](research/novels/webnovel-deepread-2026-10-09/REPORT.md), [six-title comparison](research/novels/webnovel-deepread-2026-10-09/COMPARISON.md), and [source/coverage receipts](research/novels/webnovel-deepread-2026-10-09/SOURCES.md). Ninety chapters were close-read from downloaded copies; earlier chapter reads remain separate. Gal and Skill Eater coverage gaps, and locked technique-girls chapters, remain explicit. No new accepted design or implementation.*

**P-D1 A method with continuity.** One optional native method remembers actual practice and application, becomes a named companion, then develops one new use. Gal’s method relationships and Skill Eater’s resident avatars support distinct identity; the latter’s summoned constructs are a different thing. A personality and bond owner would be new authored work.

**P-D2 Legible evolution.** Show a practiced base method, partner method and material prerequisites before selecting a branch. The beast-evolution source distinguishes missing recipe inputs from unknown high-end conditions. Technique-girls shows a capacity increase and an incomplete-manual ceiling; neither establishes a universal YAIR roster cap.

**P-D3 Ordinary work grows powers.** Shennong’s opening field work, books, mentoring and exams produce useful abilities. Its chapter20 inner garden is remembered future-version lore, not a current garden. For YAIR, native study and shifts can supply the cause of one living method’s growth.

**P-D4 Memories have owners.** A simulated future can matter emotionally without being a shared past or reliable prophecy. NPCs remember their own dream, observation and teaching separately. A dream does not silently complete a real skill or relationship.

**P-D5 First proposal: living Watchcraft.** Reading, meditation practice and equipped patrol remain distinct. One remembered shift and a disclosed project choose either a hazard-observation use or a learner-report use; Tessa/Iona remember only their actual contributions, and awakening/branch each add one biography. Exact costs and effects remain proposals. The comparison gives the cheat terms, failures and five native touches. Preserve vanilla and the existing center menu; no mandatory daily care, new XP economy, world or prestige is selected.


### Novel wave 2026-10-09b findings (2026-10-09)

*Research findings and original proposals only, not accepted decisions or
implemented gameplay. The nine supplied books were read in full: Skill Eater
1–5 and Wish Upon the Stars 5–8, 760 story chapters/epilogues plus 8 separate
recaps. [Report](research/novels/novel-wave-2026-10-09b/REPORT.md),
[comparison](research/novels/novel-wave-2026-10-09b/COMPARISON.md), and
[source/review receipts](research/novels/novel-wave-2026-10-09b/SOURCE-REVIEW.md)
live in private, gitignored research. Supplied-edition completion does not
establish complete series or publication coverage.*

**P-NW1 A living method that remembers an event.** Skill Eater supports
different avatar personalities, preferences, rivalry, practice and bounded
initiative. It does not establish formal dating routes or mandatory daily
jealousy/neglect penalties. Proposal: one optional native method remembers an
actual failed use, proposes a drill and gains one new application. Companion,
courtship and creature-collection versions remain player-selectable authored
cheat variants, not one required world rule.

**P-NW2 Show what evolution changes and consumes.** A branch can change control,
targets, a counter or ally use. A combo, destructive fusion, permanent mutation
and living companion are different operations. Preview identity, effects,
retained memory and costs; do not silently erase native skills or make all
companions one immortal roster.

**P-NW3 Promises and delivered help are different.** Later Wish shows future
service, donor preferences, reserved capacity, different recipients and public
disclosure changing bargains. Proposal: one modest service accepts coin,
materials, future work, a favor or a gift, and remembers the actual agreed
terms. Reuse existing time and owners rather than adding a parallel economy.

**P-NW4 A breakthrough can keep an older power.** Wish distinguishes stat rank,
soul readiness, mastery, a personal Path and a second retained ability. Proposal:
a later local system can offer replacement, refinement or another capability
with its own prerequisites. A new tier label alone is not a playable proof.
The original Frontier opening, defeat/recovery and milestone scope stay intact.

**P-NW5 Travel states what actually crosses.** Anchored arrival, a closed
expedition, protected trial avatars, equipment images and real bodily transfer
have different safety and return terms. Proposal: one passage or challenge
shows body, gear, fuel, companions and return conditions before commitment.
The revised Keepsake Ledger cheat card and Concord of Waymarks world card
remain original drafts. [Forty-eight small native touches and eight ranked
proposals](research/novels/novel-wave-2026-10-09b/COMPARISON.md) give bounded
next candidates, not parallel implementation orders.

## Minigames, city building and other feature families (Claude, 2026-10-10)

Proposal from a chat brainstorm. Earlier rows in the far-field table (rhythm,
tycoon, detective, deckbuilder, colony sims) and the kingdom-building world
card already point here; this section adds the rules and a scale ladder.

### Minigames

- **Rule M1: a minigame is how a skill already works, never a separate toy.**
  Smithing heat, fishing line tension, lockpicking, haggling, cooking
  experiments, cipher reading for manual study, breakthrough timing.
- **Rule M2: every minigame has an idle auto-resolve.** Skill level sets the
  auto result. Manual play buys variance, discovery and rare outcomes, not a
  flat yield multiplier, so idle players are never punished.
- **Rule M3: worlds change the minigame.** A loop world turns investigation
  into a case board that survives resets; a courtroom domain turns save
  history into evidence; a gambling den lets a luck or perception cheat read
  odds, and readings can be wrong.
- Candidates: smithing timing on the D1 springsteel alloy (smallest proof),
  tavern dice and cards, a case board for Cyoria, a debate or trial scene,
  a breakthrough rhythm check, a herb crossbreeding grid.

### City building as a scale ladder

Room, house, workshop or farm, street or shop, village, town, city, realm,
hub between worlds. Each rung reuses the one below. The life-sim angle: the
settlement lives on its natural course without you, and you choose a role in
it (tenant, shopkeeper, landlord, patron, guild head, mayor, advisor, ruler,
saboteur). Buildings are carriers, so heirs inherit what survived. Each world
sets its own rules (a tide town floods, a hub runs on travelers).

### Other families not yet given a home

- Expeditions: timed dispatch of followers or heirs, idle-native.
- Collections: bestiary, codex, museum, recipe book, with rewards for depth.
- Calendar: seasons, festivals, tournaments, market days.
- Taming and raising: companions, mounts, Gu, a raised heir (Princess Maker).
- Trade: caravans and arbitrage between worlds, limited by what can cross.
- Crime and politics: heists, smuggling, elections, sect council votes.
- Writing and teaching: books you author that NPCs read and act on.
- Challenge runs: modifiers chosen at a life's start, unlocked by odd records.

### Constraints

- Automation is progression: hire a manager, train an apprentice, write a
  standing order. Each active feature needs a path to idle.
- Fit the original UI: center actions and existing panels first.
- Each family adds save state and needs a migration plan before it ships.

### Little and big at the same time

Every family gets a zoom ladder: a small touch, a middle loop and a big arc,
all reading and writing the same state. The small touch is what makes the
big arc feel lived in, and the big arc is what makes the small touch matter.
Build the small rung first; it is cheap and it seeds the data the big rung
needs.

| Family | Little thing | Middle loop | Big arc |
|---|---|---|---|
| Fishing | One cast, a named catch logged | Spots, bait, seasons, a tension check | A fishing fleet, a sea monster, a harbor town |
| Smithing | Your maker's mark on gear | Timing check, alloys, commissions | A famous forge, a named blade with its own history |
| Cooking | A favorite dish NPCs remember | Recipe experiments, a dinner that changes who meets whom | An inn between worlds, a cuisine that spreads |
| Romance | They remember how you take your tea | Dates, gifts, shared plans | Marriage customs per world, heirs, love across lives |
| Home | A window plant that grows | Rooms, furniture with effects, guests | A street, then a town you shape |
| Gambling | A coin flip at the tavern | Dice and cards with odds a cheat can read | A casino, a debt empire, a wager with a god |
| Writing | A margin note in a manual | Letters, a journal, a book you author | A school of thought NPCs follow, or a scripture |
| Collections | One pressed flower | Bestiary, codex, museum wing | A museum of your past lives |
| Combat | A named scar | Tournaments, rivals, techniques | A war, a dynasty of fighters |

### More minigames

All follow M1 to M3: part of a skill, idle auto-resolve, world-shaped.

- **Crafting:** smithing heat and quench timing; tailoring pattern fit;
  alchemy as ingredient ordering where order changes the result; carpentry
  joinery as a small tile fit; jewelry as gem cut angles.
- **Gathering:** fishing tension; mining seam reading (pick where to strike
  from cracks); herb identification where look-alikes are poisonous;
  tracking from a short list of signs; beekeeping as a calm meter.
- **Social:** haggling with offer and counteroffer; conversation topic
  matching (what this person cares about today); gossip routing (who tells
  whom); poetry or riddle duels; tea ceremony steps; a seating chart for a
  dinner.
- **Mind:** cipher and old-script reading; a case board linking clues;
  memory palace recall; Go or a local board game as a proper opponent with
  its own rank ladder; formation and array drawing as a rule puzzle.
- **Body:** breakthrough rhythm; meditation as holding a meter steady while
  events tug at it; dance; racing a horse or a boat by managing stamina.
- **Risk:** lockpicking; pickpocketing; dice, cards and mahjong; a
  shell game where perception helps; bomb or seal defusal in a dungeon.
- **Care:** nursing a sick NPC through a fever; raising a hatchling;
  tending a garden through a storm; repairing a damaged heirloom.
- **Games inside the game:** a card game NPCs play in every tavern and
  that differs by world; a children's game an heir learns; a gambling den's
  house game whose rules are rigged and can be learned.

### Romance, expanded

Builds on the 2026-10-08 romance section and the far-field finding that
relationships need a shared future, not a bigger bar. People choose for
themselves; romance stays optional, and friendship is a complete outcome.

- **Little things:** they remember your tea, a nickname that sticks, a note
  left on the table, a walking route you share, a song they hum, a gift that
  gains history because they kept it, small fights over chores.
- **Minigames:** planning a date as a schedule puzzle against the calendar;
  conversation topics; cooking together; writing letters across worlds where
  delivery time and censorship matter; dancing at a festival.
- **Middle:** their own plans and career that can clash with yours; meeting
  their family; a rival suitor with their own log; jealousy, trust and
  repair; living together and dividing the household.
- **Big:** marriage and courtship customs set by each world (arranged
  matches, sect alliances, bride price, none at all); a wedding as an event
  that draws friends, rivals and old debts; a partner as a co-protagonist
  with their own chronicle; heirs; a partner who follows you between worlds
  or can't; lifespan gaps; a reincarnated lover who half-recognizes you;
  dual cultivation and soul bonds where the world allows them; grief.
- **Other shapes:** unrequited love; a political marriage that becomes real
  or doesn't; romance with spirits, monsters or AIs where the world allows;
  relationship structures that each world defines.

### Genres not yet considered

Checked against the far-field table, world cards and genre sweep on
2026-10-10. Each row names one idea to steal.

| Genre | Idea to steal |
|---|---|
| Horror | Knowledge hurts: learning the truth raises a dread stat; a cozy town slowly turns wrong |
| Noir and hardboiled | Every client lies; cases end in a choice between truth and survival |
| Western | A lawless frontier where your reputation is your gun; bounties and showdowns |
| Spy and espionage | Cover identities with their own stats; a handler; burn notices |
| Heist | Plan, crew roles, a timed execution, and the moment the plan breaks |
| Pirate and naval | A ship as a home with crew morale; trade winds; prize law |
| Sports management | Run a team or a fighting school; training schedules, a season, a league |
| Music and performance | A band or troupe; songs that buff or sway crowds; a fame curve |
| Idol and celebrity | Fame as a resource that attracts both help and stalkers |
| Journalism | Publish what you learned; a story changes NPC behavior and makes enemies |
| Fashion and tailoring | Clothes signal rank and faction; the right outfit opens doors |
| Painting and sketching | Sketch a place or person to record it; art that holds power in some worlds |
| Tower defense | Defend a home or sect gate with placed wards and trained guards |
| Auto-battler | Followers fight on their own from the formation you set |
| Tile and match puzzle | Formation arrays or alchemy as a tile puzzle with an idle solver |
| Parser and text adventure | A room where you type what you do; hidden verbs reward curiosity |
| Epistolary | Letters as the main view of a life lived far away |
| Survival crafting | Hunger, warmth and shelter in a harsh world, then comfort as progression |
| Grand strategy and 4X | Realms on a map, borders and diplomacy at the kingdom rung |
| Family saga | Generations of one house, each with its own era and grudge |
| Cozy mystery | Small-town mysteries solved over tea; low stakes, high charm |
| Monster of the week | A recurring case format a world can run for years |
| Cooking competition | Judges with tastes, a theme, a time limit |
| Gacha (in fiction) | A world where a cruel system sells pulls; you can exploit, refuse or break it |

### More little things

- NPCs greet you by your recent deeds, and get it slightly wrong.
- A notice board that changes daily.
- Weather lines in the log that change what people do.
- Your home shows wear and trophies from your actual history.
- Children in the village imitate your fighting style.
- A shopkeeper who saves your favorite item.
- Pets who follow you between rooms.
- Food that tastes like home in another world.
- A small sound or line on a breakthrough the first time only.
- Hover details that tell a tiny story about an item's maker.

### More big things

- A world whose whole genre is one of the rows above (a noir city, a pirate
  sea, a horror town), with its own rules.
- A genre shift mid-life: the cozy town turns horror, or peace becomes war.
- A multiversal tournament that pulls fighters from many worlds.
- An era change in a world: industry arrives, magic fades, a system lands.
- Your settlement on the ladder becomes a faction other worlds deal with.
- A family saga run across many lives in one house.
- A game inside the game that becomes its own world.

### First slices to try

Proposal, ranked:
1. Smithing timing on springsteel (small; proves M1 to M3).
2. A remembered small touch in romance or friendship: an NPC remembers one
   preference and acts on it (small; seeds the big romance arc).
3. The home rung of the ladder: a room with one item that changes over time
   and passes to an heir (middle; seeds city building).

## Every feature family, in every kind of body (proposal, 2026-10-10)

Weibao: "Each type of gameplay expansion and more? Beyond random character
and into a non human like a tree or something."

[Starting realms](#who-or-what-you-start-as-realms-of-play-proposal-2026-10-10)
lists the bodies, and [feature families](#minigames-city-building-and-other-feature-families-claude-2026-10-10)
lists the systems. Nothing yet says what each system becomes in each body.
This section crosses them.

### Rule B1: every family translates or says why not

A feature family never silently disappears in a strange body. It either
translates (crafting for a tree is growing fruit, sap and seeds), is
reshaped through someone else (a sword trades through its wielder), or is
locked with a visible route to unlock it (a tree gets combat once it can
move a branch). The locked entry shows in the UI as a greyed verb with a
hint, the same way vanilla shows locked skills.

### Rule B2: a body is six slots of data

Any new nonhuman start is filled in, not coded from scratch:

| Slot | Question | Tree example |
|---|---|---|
| Verbs | What can it do directly? | Grow, root, drop fruit, release scent, shade |
| Senses | What can it perceive? | Light, water, vibration, sap of neighbors |
| Clock | How long is one action? | A season at first, shrinking as it awakens |
| Needs | What keeps it alive? | Water, light, soil, not burning |
| Channel | How does it reach people? | Signs, dreams, a dryad avatar, a tending child |
| Ending | How does the life end or change? | Felled, burned, becomes a forest, becomes a spirit |

Each family below reads these slots. A body with no "move" verb gets
exploration through roots, seeds, birds or carriers instead.

### The translation table

Reference table. Human is vanilla; the other columns are what the same
family becomes.

| Family | Tree or plant | Object (sword, ring) | Monster | Spirit or ghost | Dungeon or place |
|---|---|---|---|---|---|
| Combat | Thorns, poison sap, falling limbs; later walking roots | Through a wielder; you add edge or refuse to cut | Core loop: hunt, eat, evolve | Possess, chill, terrify; no damage to the living at first | Traps and monsters you place |
| Crafting | Grow fruit, resin, wood, medicine; breed seeds | Absorb materials to reforge yourself | Shed scales, spin silk, build a den | Bind memories into objects | Grow ore veins, design rooms |
| Work and money | Villagers sell your fruit; you are a business they run | Rented, sold, pawned | Raid caravans, guard for a price | Haunting as a service, oracle fees | Adventurers pay in deaths and loot left behind |
| Social and romance | Lovers meet under you; a dryad bond; a tree that married the woodcutter's daughter | Bond with a wielder, rivalry with other artifacts | Pack rank, a mate, an unlikely human friend | Unfinished business, a medium who hears you | Regular adventurers, a dungeon master rival |
| Family and heirs | Seedlings, grafts, a whole forest | Shards, a sister blade forged from the same ore | Brood, evolution lineage | Ghost lineage of a haunted house | Sub-dungeons, a dungeon core heir |
| Power path | Spirit awakening, world tree route | Artifact spirit tiers | Evolution tree | Belief and anchors | Floor count, mana density |
| Minigames | Season planning grid, pollination timing | Resonance timing during a wielder's fight | Ambush timing, evolution choice | Possession contest | Floor layout puzzle |
| City building | A village grows around you; you are the town tree | A city built to house you (a relic temple) | Monster nation | Haunted district | Dungeon town that lives off you |
| Exploration | Roots, seed dispersal, birds that carry you | Wherever the wielder goes | Roam, migrate | Drift, follow anchors | Grow tunnels toward a ley line |
| Research | Learn by sensing; slow but deep | Learn from every wielder's mind | Learn by eating | Learn by watching unseen | Learn from adventurers' tactics |
| Collections | Species that nest in you | Hands that held you | Things eaten | People haunted | Adventurer classes killed or befriended |
| Expeditions | Send seeds, birds or a sapling avatar | Lend yourself to a hero | Send pups to hunt | Send a fragment | Send monsters out as raiders |
| Crime and politics | Sacred grove law, a tree that is evidence in a trial | Stolen relic, symbol of a throne | Bounty on you, treaty with a kingdom | Witness to a murder | Kingdoms fight over who owns you |
| Writing and teaching | Carvings in your bark, a teaching tree sages sit under | Inherited technique stored in you | Teach young monsters | Possess a scribe | Inscriptions on walls that teach visitors |
| Challenge runs | Born in a desert, born on a battlefield | Cursed blade, broken on start | Weakest species | No anchors | A dungeon in a capital city |

### A tree life, start to end (worked example, original)

1. **Seed.** One action is a season. Verbs: grow roots, grow up, wait.
   Threats: a goat, a drought. The log is short and sensory: "Rain.
   Something heavy stepped near you."
2. **Sapling.** A child waters you every day. That child is your first
   relationship and your first channel: you learn to bend toward them.
   Losing them is your first big event.
3. **Village tree.** People meet, marry and argue under you. You overhear
   everything (a research feed). You can drop fruit for someone you like
   and withhold it from someone you don't. Your fruit is sold, so you have
   an economy you don't control.
4. **Awakening.** A wandering cultivator meditates under you for a year
   and leaves qi in the soil. You gain a spirit path and a faster clock.
   New verb: send a dream.
5. **Crisis.** A lord wants your wood for a warship. Options: rally the
   village through dreams, poison the axe-men with sap, bargain through a
   priest, let yourself be cut and live on as the ship (a crossing into the
   object realm).
6. **Grove.** Seedlings are heirs. You choose which to strengthen. The
   grove becomes a sacred site with its own law.
7. **Ending.** Felled, burned, uprooted and carried away, or grown into a
   world tree whose roots touch another world, which is how a tree travels.

Every step reuses existing systems: actions, the log, relationships,
research, heirs, world crossings. Only the verbs, clock and channel change.

### More bodies not yet listed

Additions to the starting realms table, ranked by how much new play each
gives for the work:

| Start as | What makes it distinct |
|---|---|
| Fungus network | Many bodies underground, trades nutrients between trees, hears the whole forest; dies only if every node dies |
| Symbiont or parasite | Lives in a host; the host's life is your map; cooperate or take over (Venom-style) |
| Sect protective array spirit | Guard a sect; disciples are your family; elders can rewrite you |
| Ship or vehicle | An object that moves with a crew; crews change, the ship remembers |
| House | A place that raises a family across generations; renovations are upgrades |
| River or lake | Floods, fish, a river god route; towns live by you and pollute you |
| A story, song or rumor | Spreads by retelling, mutates each time, dies when forgotten |
| Shadow or reflection | Tied to one person, can act only where they cast you |
| Microbe in a cultivator's body | A whole world inside someone's dantian; their breakthroughs are your earthquakes |
| Golem or homunculus | Made with a purpose; the purpose is your first need and your first chain |
| Nation's fortune or luck | Xianxia "national destiny" as a body; wars and harvests are your health |
| Egg | A whole life spent unhatched, sensing and choosing what hatches |

### Hybrids and crossings in play

- **Crossing is a life event, not a menu.** The tree that became a ship,
  the sword that gained a body, the ghost that possessed a golem.
- **What carries across** follows the four persistence layers: memories
  of being a tree may stay; roots do not.
- **Some skills translate oddly and that's the fun.** A tree's patience
  becomes a human's meditation bonus; a sword's "read the wielder" becomes
  reading people.

### Engine note

Today the game has one human body and one action menu; origins don't
change verbs or the clock
([origins](worlds/ORIGINS_AND_WORLD_TIMELINES.md)). The smallest proof is a
tree prologue: a realm-scoped action list, a stretched clock and a
channel verb ("send a dream"), using the existing log and relationship
records. That needs new save state and a migration plan before it ships.


### Er Gen haul and divergence findings (2026-10-10)

*Research findings and proposals only. No new accepted decision or gameplay. This notes-only pass reanalysed the five haul books and Skill Eater1–5/Wish5–8, then folded all five completed earlier-divergence lanes. [Report and ranked comparisons](research/novels/divergence-pass-2026-10-10/REPORT.md), [every retained proposal occurrence](research/novels/divergence-pass-2026-10-10/ECHO-AUDIT.md), [checkpoint and verification](research/novels/divergence-pass-2026-10-10/CHECKPOINT.md). Chapter references remain bounded to the supplied notes, with unfinished stories, MTL, missing chapters and unreviewed returned material qualified in those reports.*

The earlier haul lens supplied the answer it hoped to find: insight arising from work, loss and relationships. That can remain one attractive route. It does not establish the common rule of these books. The sharper additions are incompatible acquisition methods, irreversible tradeoffs, compromised institutions and people whose lives do not become the protagonist's resources. The four Er Gen books count once; Dao is Foxtail Quill, Skill Eater and Labyrinth are one Magnus Grey family, and Wish1–8 is one Malcolm Tent family. Different authors supply comparable mechanisms, but the shared old prompt and selection still limit independence.

**D1, gaining power can close a future.** Renegade's copied domain offers accessible strength with a lower expected ceiling; accelerated bead time does not accelerate its particular life/death insight (ch279/284). Timescape's immortal embryo becomes divine fuel and ends that person's immortal route (ord1195–1198). The earlier Summoned transition retires abilities and can end automatic respawn; Soldier's damaged channels can permanently lose potential; the secondary technique-girls opening advises waiting to preserve an aptitude window. Proposed play: show the specific capability gained and option lost. A global catalogue of possible routes does not promise that this individual can undo every choice. These are local alternatives, with the opening-only and disputed cases kept qualified. W09 Genetic also shows a personal anomaly releasing a profession phase and starting a global Trial countdown (ch116): one character's advancement can remove other people's planning horizon, with the earlier expected deadline unresolved.

**D2, restoration can compete with another person's existence.** Renegade's intended rescue would replace Zhou Ru with Li Muwan; Muwan refuses the consumption (ch404–409). Its reincarnated acquaintances can prefer their current lives, and the autonomous Slaughter Avatar's reunion ends its separate consciousness. Earlier Mother of Learning's copied-person exit displaces an original soul; ORV's alternate-line rescue leaves the original loss intact; Solo's shadow retention depends on living counterparts. Proposed play: separate bodily survival, memory, consent, identity, counterpart relationships and public recognition. LOTM's body return does not restore a public life; Shadow Slave's cure can remove learned experience. “Restored” alone cannot settle those outcomes. Earlier Wish memory bargains can move experience while removing the donor's memory and curiosity about its absence (Book2 ch29/36); lost curiosity's permanence remains unverified.

**D3, success can destroy the service that made it possible.** Timescape's protection of one ring devastates another and leaves an enduring law (ord1391); useful parasitic medicine creates real dependency before its predation is exposed. The earlier Shadow Slave liberation removes sanctuary and releases injuries; Labyrinth healing admission raises danger for outsiders; Paradise victory exports catastrophe. W08's safe tasks can run out, leaving another recruit without livelihood. Speedrunning's severed reserve-vessel bonds can end an experienced soul's usual return network (Book3 DEMON FOOD I); knowledge remains without the estate, supplies or ordinary escape route. Proposed play: record personal reward, community survival, infrastructure, supply and evacuation separately. Refusing an upgrade, sharing work or repairing consequences can be a successful pursuit without becoming a compulsory moral penalty on all powerful characters.

**D4, knowledge and history can change causally, not just unlock buttons.** Inside a Paragon-governed historical-memory reflection, Timescape's official poison department creates a canon foundation (ord1256–1275); dangerous research erases transferred memories and defeats backups, while one mentor also deliberately wipes a recording (ord743–744). Its pain illusion supplies experienced years without those years becoming elapsed world history (ord1316–1325). Earlier You Have Died Again can hide through reduced recall and apparent weakness; A Novel Concept's secret knowledge can close a talent route; Legendary Mechanic can grant immediate comprehension. Proposed play: keep subjective experience, institutional record, remembered fact, fabricated history and actual calendar distinct. Neither discovery nor copying guarantees permanent, useful knowledge. Broad history-as-gameplay already exists above; these particular causal operations extend it. Wish and Kairos public belief can pressure the actor or patron, while Dao's collective constructs collapse under doubt (ch933); each has its own causal rule. The secondary dating opening's private dream is emotionally meaningful without becoming shared history or verified prophecy.

**D5, a real benefit can coexist with coercion or harm.** Renegade's teacher cultivates attachment to manufacture grief through intended pupil murder (ch263/401); false ascension turns captive worlds into a harvesting industry (ch1331–1345). Timescape free medicine still has finite supply, limited efficacy and a mastery bottleneck (ord729–740). Earlier Worm command can function while controlled people accumulate stress; Fated Villain's patronage can improve prospects while creating extraction infrastructure; W09 useful military power can increase forced service. Proposed play: distinguish who controls work, who benefits, who pays, what a person knows and whether they agreed. Free access is not sufficient supply, an available formula is not mastery, and successful research does not certify patient survival. LOTM's free burial land still has unaffordable surrounding fees (ch119–120); Summoned's literal agreement can conceal a soul cost and enforcement can arrive only after harm. The secondary hub findings keep employer, sponsor, referee and gate owner distinct, including coerced missions and forbidden direct help. Different authors corroborate these broad conflicts through different mechanisms; there is no universal coercive institution rule.

**D6, keep source-specific acquisition and endings.** Skill Eater's Collector blocks ordinary growth while transfer and later avatar practice create different routes (Book1 ch13/18/107; Book2 ch83/88). A skill's willing departure does not establish its human host's consent (Book3 ch47). Wish7 mercy saves Satala at F-rank while permanently removing her old A-rank legend (ch60–61); killing Suvaya ends Dew renewal while existing stock remains safe (ch70–72). Wish8 protected projections become real bodily travel, then corrupted operators displace the party into lethal danger (ch8/29/37–38/52); preserving Perit's corpse and planning a costly revival do not complete it (ch53). AWE's nonlethal trial can still become an abusive owner-edited venue (ch1084–1093). Keep these phase, carrier and consent differences beside the safe prototype alternatives.

The W08 immediate skill grant, restored mastery and borrowed competence qualify any universal understand→practice→execute sequence. Its hero can refuse godhood and prefer an ordinary life. Separate purchased competence, remembered instruction, forced sealed-memory execution, personal training and a consenting collaborator's help. W08 travel examples retain body/rank where allowed or restore a source that removes earlier suppression; foreign arrival does not universally weaken everyone. Secondary synopsis-only cheats rewarding slacking or rejection are possible original alternatives, not established full-book rules. A stronger group ability can add shared death/debuff dependencies rather than improve every member's future. Conscious stored residents from the secondary opening are different from dormant objects or Skill avatars; the opening's deletion and neglect rules do not establish a universal companion-care timer. Shared clocks, saves and ownership remain an engineering option, not proof of identical book causality.

**D7, physical rules and competing methods can change the meaning of success.** Dao's missing Death leaves suffering bodies unable to die (ch791–797/813–815); destroyed time/season infrastructure stops social and agricultural renewal (ch689–712/825–827). Successful Truth turns intended fake fire or fraudulent silver real, sabotaging Lies (ch741–752). The normalized ending forbids revival while preserving grief (ch1023); its several frames do not certify a single neutral reality. Proposed play: author the affected physical operation and its dependency, rather than one death, sanity or time-ratio slider. Truth-made food can be real yet revert when attention ends; mass relief instead uses actual grain, seeds, animals and labor (Dao ch822–835). AWE's finite world approval consumes inhabitants' lives (ch1277–1278), and ISSTH's finest pills damage capital while lower-quality batches repay debt (ch218–221). Beneficiary success, public harm and viable provision are separate results.

**D8, preserve lives and tone outside the advancement loop.** Side characters can refuse dangerous knowledge while remaining useful, remain loyal to present families, or choose ordinary work after a return. Jokes, bluffs, queues, fear, grief, long failed experiments and quiet household scenes need not all become upgrades or relationship points. Real time skips can leave dead neighbors, changed jobs and unfinished care; false chronology should not silently award wages or age a world. The seven undercoverage areas have separate evidence in each book pass. No measured boredom verdict, mandatory grind, browser-closed harm or new save-loss policy follows from those notes.

The earlier waves are integrated as counterexamples, not votes: [W08](research/novels/divergence-earlier-2026-10-10/wave-10-08/NORTH_STAR_FINDINGS.md), [W09](research/novels/divergence-earlier-2026-10-10/wave-10-09/NORTH_STAR_FINDINGS.md), [secondary](research/novels/divergence-earlier-2026-10-10/secondary/NORTH_STAR_FINDINGS.md), [full-book1](research/novels/divergence-earlier-2026-10-10/full-book-1/NORTH_STAR_FINDINGS.md) and [full-book2](research/novels/divergence-earlier-2026-10-10/full-book-2/NORTH_STAR_FINDINGS.md). Their Gluttony servant-division/clock conflicts, Genetic missing36/cut223, LOTM limited reviewed integration, Shadow duplicate2927, weak secondary provenance and unfinished/MTL snapshots remain unresolved. This subsection qualifies the older summaries where they imply universal practice, safe institutions, reversible losses or independent author agreement; it does not edit those historical sections or select another implementation wave.

## Considerations wave, 2026-10-10 (pointer)

A session with Weibao produced a set of **considerations** (palettes for
fitting characters at fitting times, not specs). Start from the guide:
[fitting characters at fitting times](FITTING_CHARACTERS_AND_TIMES.md).
The rest: [JJK world brief](worlds/jujutsu/WORLD_BRIEF.md),
[E8E adaptation](emergent/E8E_ADAPTATION.md),
[E8F adjectives](emergent/E8F_ADJECTIVES.md),
[Proving Ground](worlds/proving-ground/WORLD_BRIEF.md),
[timelines and divergence](TIMELINES_AND_DIVERGENCE.md) (accepted
standard: worlds follow their natural course unless sufficiently
disturbed), [selves and echoes](SELVES_AND_ECHOES.md),
[trials and tribulations](TRIALS_AND_TRIBULATIONS.md),
[abuse and limits](ABUSE_AND_LIMITS.md),
[presentation and the fourth wall](PRESENTATION_AND_FOURTH_WALL.md),
[cosmic events](COSMIC_EVENTS.md). Weibao's words for each are in
[USER_VISION](USER_VISION.md). Implementation slices are parked; this was
ideaboarding.


## TTKS five-book findings (2026-10-10)

*Research findings and proposals only. No accepted decision or gameplay. All
five books Weibao named on ttks were fetched in his browser and read in full
(B1 by Sonnet readers, B2–B5 by Codex). Deep dives with chapter locators:
[B1 mimic wizards](research/novels/ttks-novels-2026-10-10/B1/DEEP_DIVE_2026-10-10.md),
[B2 yearly traits and simulator](research/novels/ttks-novels-2026-10-10/B2/DEEP_DIVE_2026-10-10.md),
[B3 multi-world challenges](research/novels/ttks-novels-2026-10-10/B3/DEEP_DIVE_2026-10-10.md),
[B4 heir to humanity](research/novels/ttks-novels-2026-10-10/B4/DEEP_DIVE_2026-10-10.md),
[B5 border inspector](research/novels/ttks-novels-2026-10-10/B5/DEEP_DIVE_2026-10-10.md),
and the tracked summary in
[FINDINGS Addendum 3](gm/dispatch/ttks-novels-2026-10-10/FINDINGS.md). All
five books are still being written.*

### What each book gives the life sim

- **B1, 巫師你好，我是偽人 (a mimic in magical London).** Living as the
  person you replaced is the life sim: their salary, colleagues and the
  detective who keeps calling. Two power tracks run side by side. Wizards
  link one of seven veins, then climb by rituals with shopping lists,
  specialise a spell three ways (cheaper, longer or stronger) and reach a
  domain at senior rank. Mimics live by an anchor object, carry powers in
  twelve themed chalices and grow by eating each other. The death loop
  keeps memory and soul-level gains, not items, and each death adds voices
  that wear on sanity. It extends "Identity theft and replacement" in
  [RIVALS_IDENTITIES_AND_FATE](RIVALS_IDENTITIES_AND_FATE.md) with a
  fourth part: the anchor.
- **B2, 一年抽取一詞條 (one trait a year, plus a simulator).** The cleanest
  prestige loop in the research. A simulated life costs almost no real time
  and returns memory, realm, every trait drawn and techniques at their
  mastery, never items, feelings, relationships, injuries or age. One trait
  per lived year; odds and slots scale with actual realm; no pity unless a
  trait gives it. Inside a run the loadout changes only at the yearly
  prompt, made by the real self: a ready-made fiction for player versus
  character. Forecasts from a run go stale as the real world changes;
  people and places hold better than dates. Joke traits turn into weapons.
- **B3, 咒回：特級的我去死滅打宿儺了！ (a challenge board across worlds).**
  Attempts are projections. Bank your best result, keep trying, and only
  submitting makes a world real; submitted worlds become places you can
  visit with later powers and no rewind. Each challenge sets its own
  contract: lives, loadout, win and fail conditions. One challenge is "make
  Maki head of her clan and reform it", proof that a world can ask for a
  life outcome instead of a boss kill. Dying doesn't zero a run: the world
  plays on and judges what you caused.
- **B4, 全人類的繼承者 (the last human among his descendants).** A start
  where you are the genuine article everyone else imitates, and hiding it
  is the play. Use, ownership, knowledge and command of an inheritance are
  four separate grants; a family butler AI makes you a guest until you take
  on the family's duties. Purity is a measured social class, blood is
  currency, and each machine keeps its own purpose and ethics.
- **B5, 廢土邊境檢查官 (a wasteland border inspector).** A job as the core
  loop: screen applicants with many tools, each with a named blind spot,
  under liability. Copying needs the other person's consent, so kindness
  and procedure are resources. Searches cost electricity, so building a
  hydro plant is a power upgrade: town-building feeds personal growth.
  Copies lose a grade without what powers the original. Shard sets (any
  three of six blessings for a seed, all six for the full skill) and
  infection sources as gifts with lifespan debts.

### Rules all five suggest (proposals)

- **P29. Copies are never perfect by default.** A copy declares what it
  lacks (the original's source, materials, owner's rights) and degrades or
  differs: B3's "related redesign", B4's copied gun at a tenth of the
  power, B5's grade loss without substrate. A perfect copy is its own rare
  cheat.
- **P30. Prestige runs keep a declared whitelist.** B2's settlement list is
  a ready answer to "what persists" in
  [What persists across runs](#what-persists-across-runs-and-the-gameplay-loop-proposal-2026-10-10).
- **P31. Archive and submit.** A best run can be banked; making it canon
  is a separate, irreversible choice (B3).
- **P32. Every detection channel names its blind spot** and its false
  positives (B1, B5). This sharpens
  [Being observed](#being-observed-how-others-read-you-2026-10-09).

### The mimic book as a base for conceptual and overpowered powers (Claude, 2026-10-10)

Weibao asked whether B1 is a good base for conceptual and overpowered
powers. **Yes for the structure, not for the scale.** Its powers top out at
city level, but the way it holds them is reusable at any tier:

| B1 mechanic | What it solves for big powers | Evidence |
|---|---|---|
| Powers are things with an owner (權能) | A concept can be stolen, lent, recalled; who *really* holds it is a rule | Upstream ownership, recall across London [0071][0076] |
| Themed slots (12 chalices) | A theme decides where a power may sit; clashes come from mechanics, not crowding (see below) | 不亡 rejected by unmatched chalices; 不亡 blocks 死亡回歸's trigger; 不亡 + 真實 fuse [0070][0071] |
| Anchors | An absolute power stays absolute but has a place it lives | 不亡 ignores all damage until the anchor burns [0068] |
| Life level gates | Absolutes only reach equal or lower beings | Full slash, edicts, mirror reflection [0058][0070][0104] |
| Knowledge keys | Certain-kill powers need the target's name and details, plus preparation | Full slash: info, 36 h, sight [0070] |
| Domains rewrite verbs | Law against law: ban dodging, ban slashing, for both sides | 律法 hall [0102]–[0104] |
| Ownership outside time | A rewind doesn't undo who owns a power | [0084] |
| Over-determination | A fate with two independent causes needs both cleared | [0075] |

It fits what this file already says. Themed slots echo the "seats for
concepts" in
[One skill, many Daos](#one-skill-many-daos-and-tiers-of-concepts-2026-10-08);
clash and fusion are its "concepts conflict" and "concepts fuse sideways";
anchors and life levels give
[Pure cheats](#pure-cheats-and-absolute-knacks-weibao-2026-10-08) a
counter without a price.

**Where B1 runs out, borrow from the other four:**
- **B5 for mastery of laws:** awaken a rule, reverse it locally at double
  cost, then create new rules, with resource cost rising steeply with
  breadth. Runes are compressed rules with fragment completeness (14/240),
  and fragments work on their own. B1 has no stage past "domain".
- **B2 for scope wording:** an effect applies only within its words, and
  some effects weaken against strong laws despite what the panel says.
- **B3 for counters by stage:** before contact, at contact, inside the
  body, after the hit. A conceptual defense names which stage it guards.
- **B4 for eligibility:** a concept can refuse a holder who doesn't
  qualify, however strong.

**More to consider (Claude):**
- **C1. Identity is a key.** B1's contract worked when Rogan signed as
  Logan, because taking someone's existence lets the name point to you
  [0048]. Name-keyed powers (curses, contracts, certain kills) then
  interact with disguise and replacement: a stolen identity can redirect
  them, or shield you from them.
- **C2. Who wins when absolutes meet.** The current default stays: each
  collision declares its own precedence. B1 offers life level, B5 offers
  "a complete, correct rule beats an incomplete one". A world can pick one,
  or keep it case by case.
- **C3. Anchors stay optional.** An anchor is a counter, not a price. A
  pure cheat can have no anchor at all; then scope, rarity and literal
  reading do the work.
- **C4. Big powers are visible.** B1's watching birds and B5's rule that a
  higher life level attracts predators: power changes who notices you,
  without draining you.
- **C5. A meta power gets meta limits.** The loop and the diary are the
  only rule-bending powers in B1, and both have limits that live outside
  the body: sanity from the voices, a 3-day window, the right kind of paper.
  Powers over time or the save file can be limited the same way, through
  the medium, not the user.
- **C6. Concepts can take on a will.** Mimics are "puppets of their
  powers", driven to gather and merge them [0076]. At high tiers a concept
  can want something of its holder, which ties to the "concepts are
  people too" line above.

### Why powers clash: mechanics, not crowding (Weibao, 2026-10-10)

Weibao's correction, confirmed in the text: 不亡 and 死亡回歸 didn't clash
because they shared the 死亡 chalice. They clashed because physical
undying ("death is erased while one particle remains") stops death-return
from ever triggering. The narration states the rule itself: powers conflict
when "one takes effect and the other can't" [0071]. The chalice theme is a
separate rule about **placement**: 不亡 bounced off every chalice whose
symbol didn't match [0070]. Other chalices each hold one power peacefully.

The fix in the book is also mechanical. Fusing 不亡 into 真實 (the diary)
put the undying trait on the diary and soul [0071], and Rogan still came
back by death afterwards. INFERRED: the property moved from body to soul,
so the body can die again and the loop works.

So "seats for concepts" should split into two checks (proposal):
- **Placement:** does this power fit this seat's theme? A limit on how much
  you can hold.
- **Interaction:** does one power's effect stop another's trigger, target
  or resource? A limit on what works together, regardless of seats.

**Kinds of interaction to model (proposal, with source examples):**

| Kind | What happens | Example |
|---|---|---|
| Trigger blocking | A prevents the event B needs | 不亡 erases the death 死亡回歸 needs (B1) |
| Information blocking | A hides what B reads | B5's Iron Body blocks pain, and with it the force feedback fighting needs |
| Process conflict | A switches off a process B relies on | B2's 子龍 disables self-healing, so it fights a regeneration trait [0383] |
| Overlap | Similar effects don't add | B5: two physiques give the greater bonus, not the sum |
| Completion | Two halves only work together | B1: the diary alone is "bland" and the loop alone "defective"; together they work |
| Unlocking | A supplies what B lacks | B5's two-star seed gives a copied skill its missing force |

**Ways to resolve a clash (proposal):**
- **C7. Move the property to another carrier.** Body, soul, item,
  companion, record. B1's fix: undying moved from body to diary and soul.
- **C8. Narrow the scope.** "Cannot die from damage" leaves dying by
  choice open, so a chosen death could still trigger a loop. A pure
  cheat's absolute word stays absolute; the player picks which word.
- **C9. Toggle or order them.** An on/off switch, or a stated firing order
  (auto-revive first, then the loop if that fails). This is a choice the
  player makes before the moment, not during it.
- **C10. Fuse into a third power** that keeps both purposes. That's
  B1's actual route, and "concepts fuse sideways" above.
- **C11. Let the clash walk off.** In B1 an unresolved conflict splits the
  mimic into two bodies, and the odd power leaves on its own [0070]. A
  rival made from your own power is a story, not just a failure.

**More to consider:**
- **C12. Interactions depend on the build, not the pair.** The same two
  powers can be fine in one body and clash in another, depending on which
  carrier each sits on. Check each actual combination, not a fixed
  pair table.
- **C13. Show the conflict before it costs anything.** B1 warns through a
  feeling of splitting before it happens. A tooltip saying "this stops X
  from triggering" is the same idea in UI form.
- **C14. Enemies can use the rule.** Giving someone a "gift" that blocks
  their own revival is an attack, like B2's hostile trait-sling.
- **C15. Higher concepts reconcile.** The existing note "Growth and Decay
  conflict unless Cycle reconciles them" is the concept-tier version of
  the same check. A higher concept can be a conflict's resolution route,
  next to moving, narrowing, ordering and fusing.

### Carriers: one model for clashes, deaths and what persists (Claude, 2026-10-10)

The clash fix above (move undying from body to soul) points at a bigger
idea. Give every power and property a **carrier**, and let events act on
carriers (proposal):

| Carrier | What ends or resets it | TTKS example |
|---|---|---|
| Body | Death, a new body, an identity swap | B1 locator curse leaves with the old body [0004] |
| Soul | Soul damage, rare; survives rewinds | B1 rank and vein link follow the soul through loops and swaps [0039][0105] |
| Name or existence | Losing or giving up the identity | B1 contract signed as Logan binds Rogan [0048] |
| Item or anchor | Destruction, theft | B1 anchors; B5 stored items |
| Record or memory | Erasure; often survives death | B1 diary; B2 settlement keeps memory |
| Companion | The companion's death or departure | B5 eagle seed shares powers while bonded |
| Land or world | The world's destruction | B5 a dead belief-holder kept as information in the land [0615] |
| Ownership right | Survives time travel | B1 upstream ownership is untouched by rewinds [0084] |

Then three things that looked separate become one check:
- **Death** destroys the body carrier; whatever sits elsewhere survives.
- **A rewind or prestige** resets world carriers and keeps the declared
  ones. B2's settlement whitelist is just a list of kept carriers, which
  fits
  [Four layers of persistence](#four-layers-of-persistence).
- **A clash** is two powers acting on the same carrier in opposite ways,
  and moving one to another carrier resolves it.

**More to consider (second pass):**
- **C16. World rules join the interaction check.** A world can block a
  power's trigger just as another power can. In B2, yearly draws fail
  where time flows differently, and B1's malice check snuffs ill intent.
  Treat world rules as one more party in the check.
- **C17. Ownership can be inherited.** If upstream ownership survives
  time, it can pass to an heir. A dead owner's descendant could recall a
  power someone stole, which ties to
  [Heirs are people, not copies](#heirs-are-people-not-copies).
- **C18. Fusion risk is a per-world adjective.** B1's fusion was safe and
  calm; B5's can mutate, can't be cancelled, and risks memory or
  personality loss. Same verb, different worlds.
- **C19. Tested combinations go in the Notebook.** "This stops that from
  triggering" is knowledge you find by testing, like the edges of absolute
  words, unless a power or world shows it up front.
- **C20. The player as the outside controller.** B2's real self swapping
  the simulated self's loadout once a year is a ready-made fiction for
  [Who the player is](#who-the-player-is-the-character-or-someone-living-through-them-proposal-2026-10-08):
  the character can ask, and the player decides at fixed moments.
- **C21. Banked worlds keep living.** B3's submitted world had moved on a
  month and a week when he visited [0173]. A banked or left world can keep
  its own clock, so visits find change, not a frozen save.

### Carriers, third pass: more possibilities (Claude, 2026-10-10)

Everything here is a possibility, not a rule. Worlds, cheats and lives can
pick any mix, including none.

- **C22. Moving carriers as a verb.** Shift a curse onto a doll, keep your
  soul in a phylactery (B1 Thorne's chalice and crystal [0099]–[0106]), put
  a memory into a ring (B1 [0084]). Every move can be a ritual, a craft, a
  trade or a cheat.
- **C23. Copies of one carrier as backups.** One power held in two places
  survives losing either: B5's stored lives in inner layers [0491], B1's
  backup chalice. Finding and breaking every copy becomes the hunt.
- **C24. Senses read carriers.** Soul sight sees soul carriers, and mimics
  have none [0062]. A disguise fools one carrier's readers and not another's.
  This links carriers to
  [Being observed](#being-observed-how-others-read-you-2026-10-09).
- **C25. Shared carriers.** A bond, a marriage, a contract or a symbiosis
  can hold a power for two people, like B5's eagle bond or B4's delegated
  permissions. Breaking the bond splits or ends the power.
- **C26. Odd carriers.** A song, a rumor, a city law, a faith, a network
  flag (B4's "this command comes from a human" [0167]), a belief coordinate
  (B5 [0256]). A power on a rumor spreads with the rumor and dies when it's
  forgotten.
- **C27. Clashes on purpose.** B1's unresolved clash splits a mimic into two
  bodies. That could be chosen: split yourself to get a second body, or
  hand an enemy a power that clashes with theirs. The split-off self could
  become a rival, a companion or an heir.
- **C28. Carriers age differently.** A body ages with the world it's in; a
  soul or record might follow the self's own clock. Time-ratio worlds then
  pull a person's carriers apart: young body, old soul.
- **C29. Carriers can be owned by someone else.** A phylactery sold, a name
  taken, a land conquered. Whoever owns your carrier has leverage over you,
  and that's a social plot hook.

## Royal Road audit (pointer, 2026-10-10)

The platform-wide pass over 1,543 Royal Road listings is in
[docs/research/royal-road-2026-10-10/REPORT.md](research/royal-road-2026-10-10/REPORT.md).
It has a 161-trope atlas checked against this file (99 covered, 47 partial,
10 new) and 275 ideas (104 new). Ten gaps (G1 to G10) cover the middle of a
life: aging, parenting, long marriage, decades-long careers, cheat costs,
money or illness as the spine, and domestic nonhuman lives. Thirteen
platform conventions (RR1 to RR13) are presentation ideas. All of it is
proposal, not accepted.
