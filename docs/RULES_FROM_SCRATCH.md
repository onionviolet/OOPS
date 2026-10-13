# Rules from scratch (accepted 2026-10-10)

Weibao: "remove all the rules accordingly and then we can set some new
rules from scratch?" The old agent-made rules are being rewritten as
defaults (see [design defaults audit](DESIGN_DEFAULTS_AUDIT.md)). This file
answers his questions from the same message and proposes a new, short
rulebook. **Weibao accepted the rulebook on 2026-10-10** ("accept the rules
accordingly"), with the changes recorded below: rule 2 rewritten, outliers
added, and the heir reworked. The answers section stays as background.

## Answers first

### What "no free carries" and "no generic conversion" meant

- **No free carries:** when you cross from one world to another, nothing
  comes with you automatically: not your items, body, skills, money,
  titles, allies or debts. Each world edge had to say what crosses and at
  what cost.
- **No generic conversion:** no single formula turns a power from one
  world's system into another's ("level 40 equals Gu rank 3"). Each pair of
  worlds needed its own hand-written handling.
- **Where it lives in code:** the strings in
  `src/feature_expansion_book_roster.js` (`portableCarrierPolicy`) are
  descriptive metadata on roster records marked `activatedByThisModule:
  false`. They don't enforce anything. *Correction:* Claude said earlier
  that changing them would change gameplay; it wouldn't. They can be
  reworded freely.
- **Now:** carry and conversion are per-edge dials. Free carry and
  generic conversion are possible where a world, hub, cheat or
  [verse equalization](CHEAT_COSMOLOGY.md#verse-equalization-converting-between-systems)
  mode allows them.

### The heir

Weibao (2026-10-10): "For heir, can scrub accordingly since the heir should
inherit according to what was left behind instead."

**Accepted direction:** the old "heir begins with one lesson" rule is
scrubbed. An heir inherits what the previous life actually left behind:
- **Things:** belongings, home, land, money, stored goods, heirlooms.
- **Records:** written notes, books, maps, recipes and journals the
  previous life made. What was written down can be learned again.
- **People:** apprentices taught, family, friends, followers, rivals and
  enemies who remember.
- **Standing:** reputation, titles, debts, grudges and obligations.
- **Body and blood:** bloodline, inherited genes and constitution, if the
  heir is a descendant.
- **Unfinished business:** projects, promises and plans left open.
- **Anything a world or cheat carries further:** a soul that remembers, a
  will that wakes, a system that transfers.

Trade-offs, loyalty, losing everything, families with their own lives and
play beyond the first character are in the north star's
[heirs and families](LIFE_SIM_NORTH_STAR.md#heirs-families-and-life-beyond-the-first-character-proposal-2026-10-10)
section. So a life that wrote, taught and built leaves a rich heir; a life that
kept everything in its head leaves little. **Build status:** the current
working tree still shows "Begin an heir · fresh body, one lesson"
(`src/chronicle_ui.js`, `src/life_experience_host.js`). Replacing it is a
gameplay slice that needs a build and a browser check; not started.

### Knowledge doesn't automatically cross

Weibao: "knowledge doesn't have to always cross unless something is done
about it." Default: knowledge stays with the body and the life that
learned it. It crosses when something carries it: the soul (by that
world's or cheat's carryover rules), a written record, an item, a teacher,
a system, a memory-preserving cheat, or the destination world's own rules.
It can also fade, be partly wrong in a new world, or be stripped at a
border.

### Bodies, sex and stats

Weibao: "Sex and gender stat differences can be there, no need for
ethnicity to carry stat, but don't forget bloodline, physical body
differences. Literally superhuman should have superhuman stats."

- **Bodies are real.** Species, bloodline, constitution, sex, age, size and
  build set stats, caps, needs and lifespan. A superhuman body has
  superhuman stats; a dragon is stronger than a mouse.
- **Sex and gender differences** can carry stats, set per species and per
  world: none in some, small trade-offs in others, large in species where
  the source makes them large. Society can add its own rules on top.
- **Real-world ethnicity never carries stats.** Fantasy species, bloodlines
  and world genes do.
- **More to consider:**
  - Changing bodies changes stats: transformations, possession, a new host
    or a cyborg upgrade.
  - Mixed bodies (half-bloods, chimeras, implants) mix stats, with
    conflicts or synergies.
  - Bodies have needs at their scale: a giant eats a lot; a construct needs
    repair, not food.
  - Body stats meet world rules: suppression, equalization and local
    physics can still act on them.
  - Superhuman bodies change ordinary life too: furniture, clothing,
    social reactions, accidents.

### Fate: how the books do it

Weibao: "for the fate stuff, just look at how books manage stuff like
this." From our notes (`research/novels/hubs-and-heavens-2026-10-08/`),
no book has one general fate law. Each world has its own mechanism:

| Book | How fate works there | How it's countered | Source (from `docs/research/novels/`) |
|---|---|---|---|
| Fated Villain (U) | Fortune is a visible quantity; favored sons are protected and their deaths cause backlash | Defined events and special cards reduce or transfer fortune; zero fortune is not death | `hubs-and-heavens-2026-10-08/books/fated-villain.md:13-23,60-64` |
| Reverend Insanity | A Fate Gu and Heavenly Court infrastructure; Heaven's Will reads minds and hunts otherworldly demons | Complete otherworldly status blocks Fate Vanquish only; luck can be stolen with lifespan | `hubs-and-heavens-2026-10-08/books/reverend-insanity.md:10-21` |
| Omniscient Reader | Probability regulates specific acts and regions | Intervention is possible at a high probability cost | `hubs-and-heavens-2026-10-08/TAXONOMY.md:39` |
| Shadow Slave | Fate is a thread that can be stolen | Reclaiming it restores memories | `hubs-and-heavens-2026-10-08/books/shadow-slave.md` |
| Speedrunning the Multiverse | Fate influences, it doesn't control outcomes | Ordinary action still decides | `hubs-and-heavens-2026-10-08/books/extra-comparators.md:10` |
| Kairos | Fate and legend steer opportunities | Fate is not plot armor | `novel-wave-2026-10-08/books/kairos-2/REPORT.md:25` |
| Regressor's Tale | Authority can look like fortune without proving chosen status | Local bargains | `hubs-and-heavens-2026-10-08/books/extra-comparators.md:11,15` |

**Proposal:** fate is a per-world mechanism on each world card: what it
protects (survival, success, a role), how it shows (a number, signs,
nothing), how it's detected (diviners, systems, backlash), and how it's
countered (theft, severing, cost, immunity). The source book's mechanism
is the default for its world. Weibao's own idea that protagonists are
fated to survive unless that fate is severed (USER_VISION) is one such
mechanism, available to any world that wants it. Original worlds pick or
invent their own.

### The home world

Weibao: "Home world is only 'home world' because it was the first world,
but it doesn't have to be the source or origin world."

- **Home is a relationship, not a type.** It's the first world a life
  lived in, or wherever the player chooses to call home later. The
  vanilla frontier is today's first world, nothing more.
- **It can be as deep as any world:** concepts, revival, systems, high
  caps and strong imports are all possible there, through its own content.
  The old "stays humble" caps are removed.
- **It need not be the origin.** A life can start in a book world and
  never see the frontier; a player can move home; the multiverse's true
  origin world, if there is one, is a separate question for the
  cosmology.

### Idle and offline

Weibao likes "absent worlds freeze; no aging while closed", and asks about
the idle side. Proposal, as defaults with dials:

| Topic | Starting setting (a world can change it) | Dials |
|---|---|---|
| Your current activity while the game is closed | Continues offline and catches up on return, like an idle game should, with a "while you were away" entry in the log and bio | Offline cap length (raise or remove); banked offline time you spend later to fast-forward (Melvor-like) |
| Aging while closed | You don't age while the game is closed | A "lived time" mode where offline time counts toward age and the world |
| Danger while closed | Routines stop at their stop conditions; fights and risks wait for you | A harsh mode where risks resolve offline |
| The current world while closed | Its routine economy ticks with you (crops, crafting queues) | World events and rivals also advance |
| Absent worlds | Frozen | Worlds with their own time ratios keep running (for example a 3:1 Paradise clock); "the world moves on" mode |
| Followers and holdings | Work their assigned routines | Act on their own in away-behavior modes |

This keeps the idle loop (progress while away) and the life-sim promise
(your life doesn't slip away while you're not looking). Players who want
time to bite turn on the lived-time or harsh dials.

## The rulebook (accepted 2026-10-10)

Weibao accepted these on 2026-10-10. Rule 2 was rewritten after he found it
unclear and asked to drop global "defaults" in favor of each world's own
needs; rule 12 adds his "there can be outliers".

1. **Anything is possible, reasonably.** Options exist when a world,
   person or event makes them possible. Beyond that, anything is still
   possible in some obscure way, or by carrying over from a prior run
   (Weibao's refinement, 2026-10-10).
2. **Each world makes its own rules.** There is no global rulebook of
   defaults. Every world (and its source book, for book worlds) sets what
   it needs: its physics, fate, ladders, carry, offline behavior, society.
   Where these docs still say "default", read it as "placeholder until the
   world defines its own". Only rules that span worlds (crossing,
   conversion, the save) live at the multiverse level.
3. **Book worlds follow their book.** How the source handles something is
   the starting point for that world; premises can still change (canon,
   divergent, remix, swapped).
4. **Bodies are real.** What your body is decides what it can do. Species,
   bloodline, constitution, sex, age and size carry real stats, needs and
   lifespans. A superhuman body has superhuman stats; changing bodies
   changes them.
5. **Things cross only if something carries them.** Knowledge, items,
   powers and relationships move between worlds and lives only through a
   carrier: the soul, an item, a record, a teacher, a cheat, a system or a
   world's rules. Conversion between systems ranges from none to universal,
   depending on who converts ([verse equalization](CHEAT_COSMOLOGY.md#verse-equalization-converting-between-systems)).
6. **What anyone sees can be wrong.** A status window, appraisal, rumor or
   test shows what that observer can read, not the full truth. Skill,
   rank, concealment and luck on both sides decide how much is seen.
   Certainty comes from evidence.
7. **Time means something.** Lives age and end; the current life keeps
   progressing while idle; absent worlds hold still unless their own rules
   say otherwise.
8. **The original game stays playable as it is.** Vanilla YAIR's opening,
   quests, stats, professions and center-menu play keep working; new
   content is opt-in; new features extend the existing panels instead of
   adding separate windows. (Already accepted, PROJECT.md.)
9. **Two firm lines only:** save integrity (bugs and reload exploits get
   fixed) and real-world guardrails (real ethnicities carry no stats;
   private saves and attribution protected).
10. **Accepted means Weibao said so.** Only PROJECT.md accepted decisions
    and his quoted words bind. Agent text is proposal until he accepts it.
11. **Everything can be OP; power is relative.** Every path, body and cheat
    can grow busted, and so can rivals and worlds. Contrast keeps it
    meaningful: somewhere you're the monster, somewhere you're nobody;
    beaten obstacles stay beaten.
12. **There can be outliers.** One-off beings, events and powers that break
    their world's usual pattern can exist: a unique talent, an
    unrepeatable feat, a being above its world's ladder. They are recorded
    as outliers, not turned into new general rules.

### More to consider (candidates, not accepted)

- **Life as a lens:** asking "does this make a life feel lived?" is one
  useful review question among others, not a gate (softened 2026-10-10
  after Weibao found it too absolute).
- **Consequences persist:** what you did stays done and remembered by the
  world, people and records.
- **Many routes:** every goal has more than one way in (force, craft,
  trade, charm, stealth, study, a cheat).
- **Information when it comes up:** details appear when they matter, not
  all at once (from Weibao's earlier direction on the UI,
  `gm/PROJECT_LOG.md:322`).
- **Sources first:** for book worlds, check the book before inventing.

## Cross-world audit precedent: special rules and little details (2026-10-12)

**Human-directed workflow:** Weibao asked to consider timelines, branches,
starting and ending points, butterfly effects on canon, character interactions,
potion craft, spellcraft and macro/micro details, then specifically raised
Time-Turners, Polyjuice and other little things. He asked to "write down this
precidence" and make future work easier across worlds. Record that direction
here as an audit practice. It does not add a thirteenth universal world law,
accept the HP proposals, require every world to contain these mechanics or
authorize implementation.

**Precedent:** do not stop at the world's headline power system. Examine its
small, ordinary and exceptional mechanisms and connect them to the life of the
world. A disguise may affect clothing, recognition and access; a time device
may affect study, projects and history; a repair may restore a vessel without
restoring its contents. Determine each source's actual behavior instead of
copying these example outcomes into other worlds.

The world GM integrates these joins. A specialist can research a named craft,
time, body, economy or information uncertainty, with disjoint outputs, but does
not decide another world's laws or shared state. Use existing world detail
owners and S00–S14 in the [completion standard](WORLD_COMPLETION_STANDARD.md);
do not create a separate GM, subsystem, stat or document for every small detail.

### Five review lenses

| Code | Examine | Required distinction or connection |
|---|---|---|
| CP1 Source and exceptions | Ordinary rules, special devices, rare cases, contradictory versions, fan/AU additions | Exact selected source/edition and scene; shown effect versus attributed explanation, inference, invention and unknown. An outlier is not a universal law; unknown is not forbidden |
| CP2 Life and means | Starts/eras, bodies, identity, skills, tools, material preparation, storage, households and ordinary work | What the actor can actually do, knows, owns, holds or may use; acquisition, reading, practice, execution and product possession remain distinct where the source makes them distinct |
| CP3 People and institutions | Recognition, trust, helpers, teachers, customers, permissions, communication and obligations | Who witnesses or learns what, what they want and can do, what they remember and how the result changes a particular interaction or service |
| CP4 History and scale | Local actions, projects, supply, careers, canon events, branches, endings, heirs and continuing life | Trace represented causes from micro to macro. Record intervention, refusal, abstention and aftermath; changed causes may change later events. Do not restore a canonical outcome merely because it appeared in the source |
| CP5 Persistence and proof | Time/expiry, interruption, cancellation, transformation, travel, repetition, loss, reload/import and missing content | Name sole state owners and conservation/compatibility decisions. Source research, authored contract, code, build, observed gameplay and director acceptance remain separate |

These are lenses, not mandatory player mechanics. A world may have a fixed
history, mutable branches, selective memory, copying, free production or unusual
retention if its actual source or selected premise supports that behavior. Do
not invent fatigue, scarcity, decay, paradox punishment, consent mechanics,
power ceilings or a universal prohibition simply to fill a review row.

### Reusable detail record

The following record shape is an authoring aid, not an accepted engine schema.
Keep it in the relevant world's existing ledger or brief; a compact paragraph
is enough for a small feature.

| Field | Record |
|---|---|
| ID and source | Stable detail ID, sections, selected continuity/version, exact locator and actual read scope |
| Rule and uncertainty | What is shown/stated, exceptions, competing interpretation and explicit authored/unknown fields |
| Player choice and means | Available approaches, actual body/method/tool/access/stock, disclosed costs or source-supported absence of cost |
| Micro consumer | Concrete changed item, action, condition, place, record or interaction; atmosphere may remain text without saved state |
| People and knowledge | Actors, motives, witnessed evidence, attributed claims, recognition and particular remembered response |
| Macro/time connection | Applicable start/era, causal dependencies, branch/canon effect, absence/expiry, ending and continuing-life consequences |
| State and acceptance | Sole owner, persistence/compatibility, observable cases, evidence stage and remaining gate |
| Disposition | Investigated, source gap, authored proposal, selected work, deferred or not applicable with a reason; only human acceptance promotes a decision |

For a substantive world audit, give each relevant family a disposition rather
than silently omitting it. Check represented joins rather than every possible
combination. Prioritize details that change a decision or reveal a source
contradiction; familiar ordinary work should stay simple and repeatable.
Preserve the broader horizon while delivering finite connected slices.

Worked reference: [HP craft report](gm/dispatch/harry-potter-craft-research-2026-10-12/REPORT.md)
links the private source/read ledger, branch/spellcraft contracts and
Time-Turner/Polyjuice/everyday-consequence register. The reusable precedent is
the review method. HP-specific laws, numerical proposals and sealed truths stay
in their own qualified owners.

### Expanded future-world reference

The [cross-world detail review](gm/CROSS_WORLD_DETAIL_REVIEW.md) expands this
precedent into 36 source-neutral families and six connected hypothetical cases.
It covers everyday bodies and households; materials, potion/other craft,
spell application and control; people, institutions, identity and information;
and calendars, history, starts, branches, endings, legacies and crossings.
The inventory is a proposed authoring aid. Its rows are not required mechanics,
accepted laws, source facts or implemented functions.

For future world work, select relevant families inside the world's existing
scope and ledger. Retain local detail IDs and sole owners; tag applicable
S00–S14 joins rather than making a subsystem for every row. Mark irrelevant
families with a scope-grounded reason, source gaps as unknown, and later useful
families as deferred. A missing native consumer is missing work, not proof that
the feature is irrelevant. Keep the broad campaign horizon while selecting a
finite connected slice.

### Small detail to causal consequence

Trace only the represented joins that matter:

`held means → actual operation → changed object/service → particular observer
or recipient response → affected plan/event → continuation or legacy`.

For example, a repaired tool may support production, a delivered product may
change one recipient's availability, and their message may change a meeting.
Each link needs its actual cause and consumer. A tool repair does not by itself
create the product, inform absent witnesses or reform an institution. Strong
means can skip links or solve the whole problem where supported; the review
must account for that result instead of adding a resistance tax.

Record the causal cut as well: which later event stays unchanged, which cause
was removed, and which downstream future remains unmodeled. Natural-course
source events are expectations, not an instruction to restore their outcomes
when their causes no longer hold. Refusal, abstention and another actor's
independent intervention can matter as much as the player's success.

### Source admission and integration

Keep shown effects, attributed explanations, interpretations, other source
versions/AUs, authored additions and unknown/outlier cases separate. A warning
is not automatically a metaphysical law; one occurrence is not a universal
range or duration. A source's extraordinary copying, free production, perfect
knowledge or full restoration is allowed when that mechanism actually supports
it. Save bugs remain bugs even in a world with a legitimate copying mechanism.

World GMs qualify bodies/persons/controllers, actual means, physical custody,
observer evidence, local and experienced time, historical causes and continuing
claims at the joins. They reconcile specialist outputs against the chosen
source/era/premise and current owners. Buying, reading, practicing, executing,
teaching and reproducing at scale are separate review questions, not compulsory
progression gates. They can coincide when the world supports it.

Before a selected detail becomes a runtime packet, name the reachable native
consumer, sole state owner or missing seam, compatibility decision and observable
acceptance cases. The six reference examples are specified-not-run. Source
review, authored contract, code, rebuild, fresh-origin gameplay, save/reload/import
and Weibao's acceptance remain distinct. This documentation expansion changes
no runtime and adds no world mechanic to the accepted twelve rules.
