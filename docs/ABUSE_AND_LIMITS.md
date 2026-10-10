# Abuse and limits: what gets fixed, what gets a reaction (proposal)

> **How to use this doc (Weibao, 2026-10-10):** these are considerations
> for established and future worlds, to help ideaboard and implement
> fitting characters at fitting times. Tiers, lists and tables are
> illustrative, not complete or fixed; more distinctions can exist.
> Everything just has to make sense for the world and character at hand.

Claude, 2026-10-10. Weibao: "we can expand on these ideas and more? For
abuse limits we can consider further?"

**Proposal only.** One place for abuse limits across the recent idea
docs: [timelines](TIMELINES_AND_DIVERGENCE.md), [selves](SELVES_AND_ECHOES.md),
[trials](TRIALS_AND_TRIBULATIONS.md), [adaptation](emergent/E8E_ADAPTATION.md)
and the [JJK brief](worlds/jujutsu/WORLD_BRIEF.md). Earlier vow abuse lives
in [E8B](emergent/E8B_POWER_CATALOG.md#funny-abuse-with-reasonable-consequences).

## The split the rulebook already makes

Rule 9 names only two firm lines: save integrity and real-world
guardrails. Rule 11 says everything can be overpowered. So abuse comes in
two kinds, and they get opposite treatment:

| Kind | Example | Treatment |
|---|---|---|
| **Out-of-fiction exploit** | Reload to reroll a replay, duplicate items through import, edit a branch file | **Fixed.** The game makes it impossible or pointless |
| **In-fiction abuse** | Regress a hundred times, farm a trial, vow-stack, bait an adaptive boss | **Allowed, with consequences.** The world notices, prices and reacts |

The first is a bug. The second is play, and finding it can earn a title
(E8B "exploit discovery as play").

**Weibao, 2026-10-10:** "Nothing has to only work 'once', the power of
adjectives is vast, for abuse and limits beyond gameplay, I am basically
the only player so that is very low priority." So:
- **Part 1 is low priority.** He is the only player. Keep only what
  protects the save from breaking (rule 9); anti-cheat, edit detection and
  tamper checks are optional and can wait indefinitely.
- **No limit is fixed at "once".** Every limit is a set of adjectives a
  world, power or person can change. See [limits are adjectives](#limits-are-adjectives).
- **Every open question here is per world, all options possible.**

## Part 1: closing out-of-fiction exploits (low priority)

| Code | Exploit | Fix |
|---|---|---|
| F1 | **Reload rerolling** (replays, trial outcomes, divergence rolls, ghost behavior) | Seeded streams (E1). The same inputs give the same result, so reloading changes nothing |
| F2 | **Save scumming before a trial** | Trial entry commits its seed and stakes in the save before it runs. Reload lands you back in the same trial |
| F3 | **Duplication through branches** | A branch stores the world's state, never your inventory. Items are instances with ids; an id can exist once per world instance |
| F4 | **Duplication through export and import** | Each live run has a run id and a sequence number. Importing an older copy of the same run asks which is live; the other becomes a branch, not a second live run with the same goods |
| F5 | **Cross-browser double play** | Same as F4: two live copies resolve into one live run plus one branch |
| F6 | **Editing branch or save files** | Checksums flag edits. Personal single-player game, so the response is a label ("edited"), not a ban; the edited branch can't feed achievements or legends unless you accept the label |
| F7 | **Clock tampering for idle gains** | Offline gains cap per absence and check against the last known time; a clock going backward grants nothing |
| F8 | **Repeat-settlement** | Each reward has a receipt id; the same receipt never pays twice (already a project rule for paid actions) |
| F9 | **Branch farming** | Branches are made at run end or by a declared power only. Starting a branch never copies goods into the new run except by a carrier (rule 5) |
| F10 | **Ghost farming** | Ghost items belong to the branch world. Taking them is an in-world act with receipts; how often they restock, if ever, is the world's call, not a free spawn |

A personal **dev mode** stays possible (rule 1, anything is possible): a
debug flag can do any of the above, labeled as dev, kept apart from the
real save, and never feeding legends or achievements.

## Part 2: in-fiction abuse, priced and noticed

Toolkit of reasonable consequences. Each world picks which apply.

| Code | Tool | How it works |
|---|---|---|
| T1 | **Diminishing returns** | The same act yields less each time: replaying a fight, re-entering a trial, stacking vows |
| T2 | **Real costs** | Every repeatable power charges: years, fuel, sanity, items, favors, a vow |
| T3 | **Cooldowns and charges** | Per day, per feat, per life |
| T4 | **Attention (heat)** | Repeated or flashy use raises attention from fate, time keepers, patrons, institutions, rivals. Heat decays slowly |
| T5 | **Adaptation** | Enemies, trials and societies learn your trick ([E8E](emergent/E8E_ADAPTATION.md)) |
| T6 | **Counters spread** | A famous exploit becomes common knowledge; defenses appear (E8C) |
| T7 | **Odd-record reactions** | Extreme counts and strange combinations get noticed ([JJK brief Q4](worlds/jujutsu/WORLD_BRIEF.md#q4-courtroom-on-your-save-history-with-reactions-to-odd-stuff)) |
| T8 | **Dependence** | Overuse weakens your own growth (replays like a calculator; rewinds dull your resolve) |
| T9 | **Identity drift** | Repeated regression, soul edits or merging with selves change who you are |
| T10 | **Stale knowledge** | Foreknowledge and guides lose accuracy the more you change things |
| T11 | **Escalation** | A trial or enemy farmed repeatedly scales up, or calls something bigger |
| T12 | **Legend** | Abuse becomes your story. The Taco Ascetic, the Hundred-Death Man |

### Per system

| System | Likely abuse | Proposed limits |
|---|---|---|
| **Regression (B4)** | Loop until perfect | T2 cost per loop (years, sanity, a charge); T9 identity drift; T4 fate and time keepers notice; T10 knowledge stales as loops diverge; anchors are fixed points, not anywhere |
| **Branches** | Pick the easy world; harvest a branch's leftovers | Easy branches allowed (it's a different world, motives grow new threats); leftovers follow the world's rules (they may restock, rot, multiply or be looted first) |
| **Ghosts (B3)** | Rob your past self repeatedly; feed it to farm rewards | Ghost is a real person with one life and one inventory; robbing it is a crime with receipts and a disturbance |
| **Perfect fights** | Replay every fight for free insight | Occasions set by the source (once, daily, at will); T1 less new yield from the same fight; T8 dependence dial; enemy hiding info makes lines wrong |
| **Generated selves** | Spar a perfect self forever for XP | Spar yields practice, not perfect-fight insight; T1 diminishing; T3 per day |
| **Trials** | Farm an easy trial; dodge a hard one | T11 escalation on repeats; delay is not cancel; leaving a world to dodge one has a cost and the trial may follow (rule 5) |
| **Trial reward menus** | Always pick rewind or guarantee | Each kind has a cost; picking the same kind repeatedly cheapens it (T1) |
| **Adaptation** | Bait a boss into adapting to a decoy | Allowed: it's a listed counter. Adapters with smarter AI can notice decoys over time |
| **Divergence** | Push history into an easy shape | Allowed; canon pressure, substitutes and motives keep it alive |
| **Domains (JJK)** | Spam domain | Burnout after each use; refinement contests; simple domains spread as counters (T6) |
| **Vows** | Stack, wording tricks | See E8B: pricing per world, diminishing stacks, cravings, targets |
| **Idle offline** | Sit at a trial threshold forever | Per-world offline rule: wait, auto-run or fire anyway |

## Part 3: funny abuse worth keeping

These are features, not bugs:

- **The thousand-loop speedrunner.** Regress enough times and you know
  every line of a day by heart. Time keepers form a file on you; a shrine
  appears to "the one who repeats".
- **Mentoring yourself into a monster.** Train your past self (B3) until
  it outgrows you. Now it's your rival.
- **The trial tourist.** Enter every trial once, take the participation
  reward, leave. Examiners start charging you a deposit.
- **Dodging fate by moving worlds.** It works as often as the worlds
  allow; each time, fate gets better at forwarding the mail.
- **Adapting the adapter.** Feed the wheel so many decoys it adapts to
  being fed. It refuses food.
- **Courtroom loophole.** Commit every crime in another world, then argue
  jurisdiction. Some judges accept; some invent a new statute.

## Part 4: more to consider

- **Intent doesn't matter to the rules, it matters to people.** The
  engine treats a clever trick and an accident the same; NPCs judge
  intent from what they saw.
- **Abuse as discovery.** A first-time exploit can earn a title and spread
  as gossip; copycats appear; the world counters it in time.
- **Per-world appetite.** A literal world honors loopholes; a true-cost
  world sees through them; a mischievous world laughs and bills you.
- **Player-facing honesty.** When something stops working, the game says
  why in-world (the wheel turned, the examiners remembered you), never a
  silent nerf.
- **Rivals abuse too.** NPCs can find the same exploits and use them
  against you.
- **Balance through contrast** (rule 11). An abused power makes you the
  monster somewhere; another world or a bigger fish still exists.
- **Achievements and legends** read only unedited, non-dev history.

## Limits are adjectives

Weibao: "the power of adjectives is vast." Any power or limit is a noun
with adjectives, and changing an adjective makes a new variant. Nothing is
stuck at "once": "once" is just one value of one adjective.

| Adjective family | Values (examples) |
|---|---|
| **How often** | never, once, twice, thrice, rarely, daily, per fight, per breath, at will, endlessly |
| **How much** | slightly, partly, mostly, fully, overwhelmingly, absurdly |
| **How sure** | unreliably, usually, always, inevitably, fatefully |
| **How fast** | slowly, eventually, quickly, instantly, before it happens |
| **How long** | briefly, for a season, for life, across lives, forever |
| **How wide** | personal, touched, nearby, citywide, worldwide, across worlds |
| **What it targets** | self, others, things, places, concepts, time, rules |
| **How costly** | free, cheap, dear, ruinous, paid by someone else |
| **How known** | secret, rumored, famous, legendary, forgotten |
| **How it feels** | painful, numbing, euphoric, addictive, boring |
| **How it ends** | fades, breaks, rebounds, transfers, never ends |
| **Who can** | only you, your bloodline, anyone taught, anyone who pays |

How adjectives change:
- **Growth:** mastery moves "rarely" to "daily" or "partly" to "fully".
- **Vows:** trade an adjective for another ("always" in exchange for
  "only at night").
- **Worlds:** a world can shift adjectives on entry (a cheat that's
  "at will" at home is "rarely" here).
- **Cheats and outliers:** can hold adjectives no one else can
  ("endlessly", "before it happens").
- **Stacking:** two sources of the same power combine adjectives by the
  world's rules (best, sum, or clash).
- **Wording:** a literal world honors exact adjectives; a true-cost world
  prices them; a mischievous world plays with them (E8B).

Expanded into a full layer: [E8F adjectives](emergent/E8F_ADJECTIVES.md).

This is the same idea as the [E8B variant generator](emergent/E8B_POWER_CATALOG.md#generating-subtle-variants):
adjectives are the knobs it turns. Abuse limits are just adjectives too:
"diminishing" is a "how much" that falls with "how often".

## Answered questions (Weibao, 2026-10-10)

- Q1 Edited saves: per world, all possible. Low priority; it's his save.
- Q2 Heat from time powers: per world, all possible.
