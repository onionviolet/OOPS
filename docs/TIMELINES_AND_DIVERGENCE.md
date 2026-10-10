# Timelines and divergence: the natural course standard

> **How to use this doc (Weibao, 2026-10-10):** these are considerations
> for established and future worlds, to help ideaboard and implement
> fitting characters at fitting times. Tiers, lists and tables are
> illustrative, not complete or fixed; more distinctions can exist.
> Everything just has to make sense for the world and character at hand.

Claude, 2026-10-10. Weibao: "considering timeline shenanigans, we can say
that the world continues its natural lore/canon unless sufficiently
disturbed? ... Would we need to calculate every little detail that leads to
future details? ... Books with these ideas? broader scoping? ... These ideas
are good enough to set like standard timeline level stuff."

**Status.** The core sentence is Weibao's direction and is recorded in
[PROJECT.md](../PROJECT.md): *every world follows its natural course unless
sufficiently disturbed.* This is a multiverse-level standard (it spans
worlds, like crossing and the save). Each world still sets its own dials
(rule 2). Everything below that sentence is a proposal.

Grew out of the [JJK brief Q5](worlds/jujutsu/WORLD_BRIEF.md#q5-any-era-works-but-the-timeline-reacts).
Builds on [origins and world timelines](worlds/ORIGINS_AND_WORLD_TIMELINES.md#overarching-history-with-local-calendars)
(timeline record, local calendars, absence policy), [E5 storyteller and
fate](emergent/E5_STORYTELLER_AND_FATE.md), [E2 storylets](emergent/E2_STORYLETS.md)
(casting), [E3 living people](emergent/E3_LIVING_PEOPLE.md) (detail tiers)
and [E8E adaptation](emergent/E8E_ADAPTATION.md).

## The standard in one paragraph

Every world has a **natural course**: what would happen if you were never
there. For a book world it is the book's canon in the chosen era and
premise. For an original world it is its authored or generated history
and plans (a war brewing, a festival, a famine, a rival's ambitions). The
world follows that course by default. Your actions push against it. Small
pushes get absorbed; pushes that are big enough, in the right place, bend
or break it. After a break, the world keeps running on what its people
want, not on a script.

## Do we calculate every detail? No.

Simulating every cause would be impossible and also worse to play. The
standard uses six tricks, all common in games and well suited to an idle
game:

| Code | Trick | How it works |
|---|---|---|
| C1 | **Coarse event graph** | Only named events are tracked: a few dozen to a few hundred per era, each with preconditions, roles, a date window and outcomes. Not every person's every action |
| C2 | **Inertia and disturbance** | Each event has an inertia score. Your actions add disturbance to the preconditions they touch. An event shifts only when disturbance beats inertia. This is "sufficiently disturbed" as a number |
| C3 | **Lazy resolution** | An event is decided only when its date arrives or someone observes it. Until then it is canon by default. No cost for the future you never reach |
| C4 | **Level of detail** | Near you: named people, full detail (E3 tiers). Far away: aggregates (a faction's strength, a region's curse density, a market price). Far events roll from aggregates |
| C5 | **Roles, not people** | Events need roles ("someone kills the elder"), cast from whoever fits (E2 casting). If the canon actor is gone, a substitute may fill the role, or nobody does |
| C6 | **Motives outlive scripts** | Canon events are what people do because of what they want. When an event breaks, their goals persist and generate new events through the storyteller (E5). Off the rails is not empty |

Everything rolls on seeded streams (E1), so a divergence is fair,
reproducible and not reload-farmable (rule 9).

## Inertia: what "sufficiently disturbed" means

Proposed inputs to an event's inertia:

- **Plot weight:** how central the event is to the world's story.
- **Redundancy:** how many routes lead to it (several people want the
  elder dead, so saving him once is not enough).
- **Canon pressure dial** for this world (see below).
- **Fixed point flag:** some anchors cannot move at all, if the world
  says so.

Proposed inputs to disturbance:

- **Who you touched** times their plot weight (saving a nobody versus the
  heir).
- **What you moved:** a key item, a secret, a technique the era lacks.
- **What you said:** telling someone the future is one of the biggest
  disturbances, and they may not believe you.
- **Your presence:** an outlier being alive in the era can count on its
  own (rule 12), and being noticed counts more than being hidden.
- **Reach over time:** disturbance spreads along relationships and fades
  with distance.

Small disturbances decay (canon pressure heals them). Big ones stay.

## Per-world dials

| Dial | Options | Default for book worlds (proposal) |
|---|---|---|
| Mutability | Fully mutable; soft canon; fixed points plus soft rest; branching (big changes split a new instance); closed loop (you were always part of history) | Soft canon with a few fixed points |
| Canon pressure | None to strong. Strong means substitutes arrive and history routes around you | Medium |
| Ripple reach | Local; connected people; whole era | Connected people |
| Healing rate | How fast small disturbances fade | Weeks |
| Off-rails mode | Motive-driven generation; freeze into a quiet world; a new author's arc | Motive-driven |
| Who notices | Nobody; perceptive people; a fate entity; time police | Perceptive people |

## What the player sees

- **Nothing explicit by default.** You learn history moved when an event
  arrives different, or fails to arrive (rule 6).
- **Foreknowledge with confidence.** Your memory of what comes next is a
  Notebook entry with a confidence that drops as ripples reach it. It can
  be confidently wrong.
- **Optional faculties:** a divergence sense (a cheat, a technique, a
  relic) that shows a rough number for how far this world has drifted.
- **Echoes:** NPCs who mention the "usual" way things went in a world
  with seers, or nobody does.

## More to consider

### Who changes history besides you
- **Other travelers and regressors** with their own foreknowledge, pushing
  in other directions. Rivals over the same timeline.
- **Schemers who adapt** to you as a variable (E8E at plot scale).
- **Fate as an entity** (E5) that actively repairs its course.
- **Time-keeper factions** that police divergence, or exploit it.

### Interactions with other standards
- **Absent worlds (rule 7).** A world's natural course runs on its own
  clock. If it holds still while you're away, its course holds too. If its
  rules say it moves on, it advances by aggregates (C4), not by full
  simulation.
- **Prestige and rebirth.** A new run restarts the natural course. A
  prior run can leave a scar (a carried-over divergence, a legend), the
  "obscure way" of rule 1.
- **Odd records (Q4 in the JJK brief).** A large divergence is itself an
  odd record that perceptive observers react to.
- **Heirs.** Your heir inherits the world your changes made, not canon.

### Edge cases
- **Saving someone canon kills** gives them a future canon never wrote;
  their goals and the storyteller write it.
- **Killing someone canon needs** later: substitutes, or a hole the world
  feels (a war nobody wins, a technique nobody invents).
- **Doing canon's deed yourself:** in fixed-point worlds history may credit
  the canon hero anyway.
- **Accidental bootstrap:** the legend you heard was about you.
- **Information hazard:** telling the future to a canon character is a
  disturbance that may make the prophecy fail, or come true because of
  the telling.
- **Being a nobody:** low disturbance by default, low attention, and
  still affected by every big event (see the JJK brief).

## Broader scope: where this standard applies

| World type | Natural course |
|---|---|
| Book worlds | The book's canon for the chosen era and premise (private pack for direct recreations) |
| Divergent or swapped premise | The premise's own course, written or generated from the changed start |
| Original worlds (Frontier and others) | Authored seasons, rivals' plans, brewing conflicts, generated history (E6 lore) |
| Odd worlds | Their own; borrowed ideas do not bring their source's canon |
| Nested hubs (Paradise) | The hub's course plus each mission world's course |
| The Proving Ground | None, or a scripted test course |

So the Frontier also has a natural course: the harvest, the rat season,
the rival's plans. You can disturb those the same way.

## Fiction and games with these ideas (from memory; verify before citing in-game)

| Work | Idea worth borrowing |
|---|---|
| *11/22/63* (Stephen King) | The past is obdurate: it pushes back harder the bigger the change, and a big change can wreck the future |
| *The End of Eternity* (Isaac Asimov) | Minimum Necessary Change: a tiny, precise act shifts reality |
| *Foundation* (Isaac Asimov) | History predicted for masses, not individuals; one outlier (the Mule) breaks the plan. Fits inertia plus rule 12 |
| *Steins;Gate* | Attractor fields: outcomes converge whatever you do until divergence crosses a threshold. A divergence meter. Memory that survives world-line shifts |
| *Omniscient Reader's Viewpoint* | A reader inside a story he knows; foreknowledge goes stale as he changes it; improbable acts carry a cost |
| *The Novel's Extra*, *Trash of the Count's Family* | Living as a minor character in a known plot; trying to stay a nobody |
| *Re:Zero*, *Mother of Learning* | Loops; small changes snowball between attempts (MoL is already in the repo) |
| *The First Fifteen Lives of Harry August* (Claire North) | Reborn into the same life; messages passed across time; one reckless regressor accelerates history into disaster |
| *Life After Life* (Kate Atkinson), *Replay* (Ken Grimwood) | Reliving a life; small choices, large consequences |
| *Erased* | Going back to prevent one tragedy; history resists |
| *Harry Potter and the Prisoner of Azkaban*, *Dark* | Closed loops; you were always part of it |
| *Doctor Who* | Fixed points versus things in flux |
| *Majora's Mask*, *Outer Wilds* | A world on a schedule that runs without you; knowing the schedule is the power |
| *Hearts of Iron IV* | Historical versus non-historical AI focus: a literal dial for "follow history" |
| *Crusader Kings*, *Dwarf Fortress* | History generated from people and motives rather than scripted |

## Weibao's answers and the time-travel question (2026-10-10)

Weibao: "both could be true, especially the world gone off the rails?
Considering 'having a choice' wouldn't that inherently kind of give me time
traveling powers? what should be done in that case?"

### Q1 Divergence sense: both

Rare by default; common in worlds or premises that have seers, fate
readers or time keepers. A world's dials decide which.

### Q2 Off-the-rails branches become premises: yes

A world that went far off the rails can be saved as a **branch premise**
a later run can choose ("the world where the strongest died early").

### Does choosing a branch give you time travel? (proposal)

Only if something in the fiction carries you there. The rule that keeps
it clean: **separate the player's choice from the character's power.**

- **The player** picks a starting world at the start of a run, like
  picking a map or a premise. That is a menu choice, not an act in the
  fiction. It needs no explanation and grants nothing.
- **The character** only knows or keeps what a carrier brings (rule 5):
  soul memory, a cheat, a regression power, a relic. No carrier, no
  memory of the old run and no claim on its stuff.

So picking a branch is time travel only when a carrier says so, and then
it is a real power with real rules.

### Four ways to start in a branch (all reachable)

| Code | Start | What it is | Time travel? |
|---|---|---|---|
| B1 | **Branch as premise** | Start at the era's beginning; the branch's key change is a given of the world, cause unexplained or reassigned | No. A different world, picked from a menu |
| B2 | **Successor** | Start after your last life ended, in the world it made. Your old life is history, your stash may still be where you left it, maybe looted | No. Continuity, like the heir rules |
| B3 | **Replay with a ghost** | Start earlier; your old life now plays out as an NPC following its receipts, and the natural course includes it. You can meet, help or stop your past self | No for the character; the world contains your past self |
| B4 | **Regression** | The character goes back with memory, through a carrier | Yes. A power, with costs, attention and paradox rules |

### Guardrails for B4 and anything time-like

- **It is a power, priced like one.** Per the [rulebook](RULES_FROM_SCRATCH.md),
  everything can be overpowered, but it costs something: years of life,
  a vow, sanity, attention from time keepers or fate, a limited number of
  uses, or losing the body you had.
- **What crosses is declared.** Memory only by default; skills only if
  soul-held; items and money stay behind unless something carries them.
- **Your knowledge goes stale** the moment you act on it (the
  foreknowledge rules above).
- **Anchors.** A regression returns to a set point (a save point, a vow's
  date, birth), not anywhere you like, unless the power says so.
- **Others may notice.** Seers, fate and time keepers react to a
  regressor; doing it often is an odd record (JJK brief Q4).

### Exploit check

Full cross-system treatment: [abuse and limits](ABUSE_AND_LIMITS.md).

- **Duplication.** A branch carries the world's state, never a second copy
  of your things. B2 lets you find your stash because the world kept it.
  Whether it restocks, rots or gets looted is the world's call.
- **Reload farming.** Branches are saved at a run's end or by a declared
  power, not on demand. Reloading follows save integrity (rule 9).
- **Picking the easiest branch.** Allowed. It's the player's game; a branch
  where the big threat died early is just a different, maybe quieter
  world, and its motives (C6) grow new threats.

## Saving branches, file size and returning to the original (2026-10-10)

Weibao: "I think it should be saved but idk how that would work out
gameplay or filesize wise and more? more to consider? what about going
back to original timeline and more?"

Direction: branches are saved automatically. The rest is proposal.

### File size: save the difference, not the world

Verified: the game saves plain JSON to `localStorage` (`save_to_localStorage`
in [main.js](../src/main.js)), with no compression. Browsers usually cap
`localStorage` near 5 MB per site, so full-world copies per branch would
not fit.

They don't need to. The natural course can be rebuilt from game content
plus a seed, so a branch only stores **what differs from canon**:

| Part | Stored | Rough size |
|---|---|---|
| Header | World, era, premise, seed, parent branch, end date, name | Under 1 KB |
| Divergence ledger | Status of each changed event (unchanged events are canon, not stored) | A few KB |
| Changed facts | Who lived or died differently, where key items went, faction and region aggregates | Several KB to tens of KB |
| Legends | What the world remembers about you (E6) | A few KB |
| Your traces | Stash locations, graves, heirs, students | A few KB |

Estimate: 10 to 50 KB per branch before compression, likely a few KB
after. Hundreds fit. If they ever don't, move the branch archive to
IndexedDB (much larger) and keep the main save in `localStorage`.

Branches live in their **own save section**, separate from the live run,
so a broken archive never touches the current life (rule 9). Export and
import carry them. Adding the section needs a migration.

### Keeping the archive manageable

- **Threshold.** A run that barely moved history makes no branch; it is
  just canon.
- **Fading memory.** Recent branches keep full detail. Older ones
  compress to a **chronicle**: key changes and legends only. Re-entering
  one regrows the minor details from its seed and motives (C6). Fits the
  fiction: old histories become myths.
- **Pins.** You can pin a branch to keep it at full detail.
- **Merging.** Two branches that ended almost the same can collapse into
  one.
- **Deleting** a branch is irreversible and asks first.

### Gameplay: the branch atlas

- **A chronicle or atlas page**, extending an existing panel (rule 8): a
  tree with canon as the trunk and your runs as branches, branches of
  branches beneath.
- Each entry shows a name (auto, renamable: "the year the dam broke"), the
  biggest differences from canon, your legend there, and what you left.
- A new run picks a starting branch and a start mode (B1 to B4).
- Branches as **lore you earned**: reading your own atlas is a record of
  every life, a game in itself.

### Returning to the original timeline

The original is never used up. **Canon is a template, not a lived
world**: every run that starts on it makes its own branch, so the
original stays clean and always selectable. Ways back, all reachable:

| Code | Route | What happens |
|---|---|---|
| R1 | **New run on canon** | Always available from the menu. No time travel |
| R2 | **Travel between branches** | In-fiction crossing to the canon instance or another branch, via a carrier (rule 5). Treated like world travel |
| R3 | **Restoration** | Push a branch back toward canon: undo damage, save who died, return what moved. Fate (E5) may help. Fully repaired, the branch can merge back into the trunk |
| R4 | **Regression to before the break** | B4 with an anchor before your changes |

A world can also choose the opposite mode: **one persistent timeline**,
where there is no clean canon and every run inherits the last (B2
always). Both modes are reachable; the world's dials decide.

### More to consider

- **Meeting alternate versions.** In canon or another branch, people you
  knew don't know you. A friend you saved is dead here; an enemy you
  killed is alive and innocent. Strong emotional material.
- **Your own variants.** In B3 or branch travel you can meet another you.
  Rules for coexistence, and whether one absorbs the other, are per world.
- **Things that cross branches.** Rare outliers (a relic, a curse, a time
  keeper) move between branches and carry news. A branch can be
  invaded from another.
- **Branches affecting other worlds.** A branch of one world links to the
  matching state of others you touched in that run; a crossing to it
  lands in that combination.
- **Branch premises for new players.** In a private pack, a branch could
  be exported as a premise file for another save (names stay private).
- **Proving Ground runs** never make branches.
- **Heirs and branches.** An heir's run and a successor (B2) start can be
  the same thing seen from two angles; keep one record.

## Naming, moving between browsers, and meeting your past self (2026-10-10)

Weibao: "biggest change by default, renamable, more to consider?
Transferring across browsers? more to consider? How to implement meeting
past self and more? More to consider? Save accordingly?"

### Q4 Branch names

Direction: named after the **biggest change** by default, renamable.

Proposal for "biggest": the changed event with the highest disturbance
times plot weight, through a short template ("The year the dam held",
"Where the strongest fell early"). Ties or nothing dramatic: fall back to
your title there ("The Rat Butcher's world"), then the end date. More:
- A subtitle with the next two changes, so similar names stay distinct.
- Renames are kept on the branch, never on the canon trunk.
- Names follow pack privacy: a branch of a private book world shows canon
  names only where that pack is loaded.

### Moving saves and branches across browsers

Verified: export already exists. `save_to_file` in [main.js](../src/main.js)
encodes the save JSON as base64 and offers it as a file; `load_from_file`
imports it. The branch archive would ride on the same path.

| Code | Route | Notes |
|---|---|---|
| X1 | **Bundled export** | One file holds the live run plus the branch archive. Simplest; the default |
| X2 | **Separate atlas file** | Export and import only branches; merge into another browser's atlas without touching its live run |
| X3 | **Synced folder** | Write the export to a folder the browser is allowed to use (a cloud-synced folder on desktop browsers that support it) |
| X4 | **Personal sync service** | A tiny private server or storage account. Most work, most seamless; later, if ever |

Things that matter for every route:
- **Merging is safe for branches.** Each branch has a unique id and a
  parent, so two atlases combine by union. Same id, different content
  means one was edited; keep both and ask.
- **Two live runs collide.** If both browsers kept playing, one becomes the
  live run and the other is **saved as a branch**. No life is thrown away,
  and it fits the fiction.
- **Content changed between versions.** Branches store the content
  revision they grew from. If an event they reference no longer exists,
  its change folds into the chronicle text instead of failing the import.
  Persistence changes still need migrations.
- **Private packs.** An export carries ids, not canon prose. A browser
  without the pack shows placeholders until the pack is loaded.
- **Integrity.** Checksum per branch; a corrupt branch is skipped and
  reported, never allowed to break the live save (rule 9). Imports go
  through the existing guarded save write.
- **Size.** The atlas can grow past what one paste box handles; files, not
  copy-paste strings, are the default for X1 and X2.

### Meeting your past self (B3), implementation proposal

**What to record.** Not every action; a **life trace** built from what the
save already keeps (receipts, facts, skill milestones):
- Itinerary: location changes and long activities, with dates.
- Milestones: stats, skills, techniques and gear at key points.
- Key acts: receipts already stored (fights, deals, crimes, vows).
- Relationships over time.
- A **habit profile** inferred from play: aggression, caution, favorite
  tactics, what you buy, who you help.

Recent and pinned branches keep the full trace. Faded branches keep
milestones only; the ghost improvises more.

**How the ghost runs.** Your past self is an E3 living person whose
natural course is the trace. It uses the same machinery as the world:
- Follows the trace while undisturbed (C2 inertia).
- Disturbed (you warned it, robbed it, saved someone it was meant to
  meet), it goes off-script and acts from its habit profile and goals
  (C6).
- Stats come from the nearest milestone, interpolated between them.
- Far from you it is an aggregate (C4); near you it gets full detail.

**What you can do with it.**

| Interaction | Notes |
|---|---|
| Watch it | See your old choices from outside. Notebook entries can still be wrong |
| Talk to it | It knows only what that self knew then. It doesn't recognize you unless the world lets souls recognize themselves |
| Warn or teach it | A big disturbance. It may not believe you |
| Trade, hire, befriend | It is a real person with your old habits |
| Fight it | Your old build as an AI opponent, using your habits. Ties to [enemy protagonists](ENEMY_PROTAGONISTS.md) |
| Kill it | In a branch: just divergence. In a closed-loop world: forbidden or doomed to fail. In a fixed-point world: something stops you |
| Replace it | Take its place in its life. Who notices depends on bodies and perception |

**Paradox and duplicates.**
- In a branch there is no paradox: it is a different history (B1 to B3).
- **Unique items:** your current self has none of the ghost's items (no
  carrier), so no duplication. If a regression (B4) carries an item the
  ghost also holds, the world decides: one fades, both exist and the world
  reacts to an anomaly, or they merge.
- **Closed-loop worlds:** the mentor your old self remembered was you. The
  trace becomes a script you are under pressure to fulfil.

### More to consider

- **Meeting your future self.** A regressor from a later branch arrives
  in yours: another run's character, as a carried-in outlier. They know
  things you don't, and their knowledge is stale.
- **Meeting your heirs** across branches, or the heir you never had.
- **Ghosts of other lives** in other worlds you lived, if a carrier links
  them.
- **Other branches' versions of NPCs** traveling into yours.
- **Ghost sharing.** A branch file could hold a ghost for another save to
  meet (like racing-game ghost data or Dark Souls phantoms, from memory).
- **Emotion.** Watching your old self make a mistake you can now prevent
  is the core feeling; give it room: no timer, an option to just watch.
- **Cost.** Traces cost storage; cap per branch and fade with age.
- **Privacy.** Traces are your play history; they stay in your saves and
  exports, never sent anywhere you didn't send the file.

### Q5 Recognition, items and generated selves

Weibao: recognition by soul, face or habits are "all three possible,
depending on situation"; your current self can have "different stuff or
the same stuff depending on my actions"; and consider generating future
selves like the perfect version from *A Novel Concept*. All moved to
[selves and echoes](SELVES_AND_ECHOES.md).
