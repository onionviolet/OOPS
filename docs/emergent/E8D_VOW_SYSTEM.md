# E8D. The vow system: slots, pricing, enforcement (proposal)

Claude, 2026-10-10. Weibao: "more to consider? expand accordingly, for a vow
system, implementation might require slotting in key terms, like
consequence, for benefit? more to consider?"

Builds on [E8B gaming vows and rules](E8B_POWER_CATALOG.md#gaming-vows-and-rules-weibao-2026-10-10)
(world pricing modes, taco vows, ways to game them) and
[E8C](E8C_POWER_PATHS_AND_ANIME.md) (binding vows in the JJK layering). Per
the [rulebook](../RULES_FROM_SCRATCH.md), each world sets its own vow rules;
every value here is a default with a dial. Proposal only.

## A vow is a sentence with slots

The player (or an NPC) builds a vow by filling slots, like a contract
template. The UI reads it back as one sentence:

> I, **[swearer]**, before **[witness]**, will not **[act]** **[object]**
> **[where/when]** for **[duration]**. In return, **[benefit]**. If I break
> it, **[consequence]**.

### Core slots

| Slot | What goes in it | Examples |
|---|---|---|
| Swearer | Who is bound | Yourself; your house; your sect; a follower who agrees |
| Restriction | The act given up or required | Won't eat X; won't use weapons tagged `blade`; must pray daily; must announce attacks |
| Object | What the act concerns, as an item, tag or person | `item:taco`, any `edible` with tag `meat`, a named rival |
| Scope | Where and when it applies | Only in this world; only at night; only in combat |
| Duration | How long | 20 days; until the harvest; until I avenge her; for life; across lives |
| Benefit | What you gain | 5x strength; +1 facet; a technique's cost halved; a rule only you obey |
| Consequence | What happens on breaking | Lose the benefit; lose double; a curse; a debt; damage; death; the witness takes something |

### Extra slots (optional, world-dependent)

| Slot | What it does |
|---|---|
| Witness or guarantor | Who enforces and prices it: the world, a god, a spirit, a system, a crowd, a contract stone |
| Condition | When the benefit is active ("only while I'm outnumbered") |
| Ramp | Benefit grows the longer it's kept (a streak) |
| Stake | Something put up as collateral (an item, years of life, a name, a soul fragment) |
| Counterparty | The other side of a mutual vow, with their own slots |
| Release | How it can end early without breaking: a rite, the witness's consent, a price |
| Visibility | Secret, known to the witness, or public; affects pricing and targeting |
| Inheritance | Whether it passes to heirs (deathbed vows), and in what form |
| Interpretation | How the world reads the words: exact, by tag family, by intent, or mischievously |
| Coercion clause | Whether being forced to break it counts |

## Interpretation is just tag matching

The burrito question ("I said no tacos") becomes **how wide the object's
tag match is**, set by the interpretation slot or the world's default:

| Interpretation | Object `taco` matches | Effect |
|---|---|---|
| Exact | Only `item:taco` | Burritos are fine (loophole) |
| Family | Anything tagged `tortilla_food` | Burritos break it |
| Intent | What the swearer meant, from the vow's motive | Depends on why you vowed |
| Mischievous | The widest match the world can justify, chosen when it hurts most | Your bread starts counting |

Restrictions use the E4 tag system and E3 verbs, so breach detection runs
on existing hooks: "eat" on item use, "use weapon" in combat, "speak" in
dialogue, "enter" on travel.

## Pricing: the quote

Before swearing, the player sees a **quote**: the value of the vow and the
benefit it can buy. This follows the engine's preview-then-commit pattern
(`evaluateAction`/`commitAction`, `previewSimulationCommand`/`commitSimulationCommand`).

```
value = sum over the world's pricing modes of (mode weight × mode score)
benefit budget = value × world multiplier × witness multiplier
```

Mode scores, from data that already exists or is proposed:

| Mode | Score from |
|---|---|
| True cost | How often you do the act (life record), how strong the need (E3), what you'd lose |
| Literal | The words' size: duration, breadth of object, severity of consequence |
| Will | Traits like `proud`, `vengeful`, current mood, past vows kept |
| Arrogance | Your power relative to the world; strong wills set their own price |
| Absurdity | How rare and silly the object is (tag rarity, gag-physics worlds) |
| Novelty | How many people have sworn this before (world count) |
| Audience | Witnesses present |
| Patron | The god or spirit's tastes |
| Market | Recent vows of the same kind |
| System | A table the system can change ("patched") |

**Consequence raises value.** A harsher consequence buys more benefit,
reasonably: staking your life buys much more than staking the benefit
itself. **Stake raises value** the same way.

The quote shows the breakdown ("true cost: low, you rarely eat tacos;
will: high; audience: 40 people"), so gaming the system is visible and
deliberate.

## Lifecycle

| Stage | What happens | Engine |
|---|---|---|
| Draft | Fill slots; see the quote | Preview, no state change |
| Swear | Commit; the vow becomes an entity with a receipt | Commit with a stable ID; mischievous worlds draw from the `interaction` stream |
| Active | Benefit applies under its condition; breach watchers run on hooks | E4 personal rules on the swearer |
| Warned | An action would break it; the UI asks first | Preview of the action shows "breaks your vow" |
| Kept | Duration ends; benefit may stay, fade or leave a title | Fact, title, life record entry |
| Broken | Consequence applies; the witness reacts | Effects on breach; E3 memories; E6 legend |
| Released | Ended early by the release slot | Release rite or price paid |
| Inherited | Passes to an heir by its inheritance slot | Heir rules (rulebook) |

## Mapping to the engine

A vow is an entity with tags, plus two rule sets:
- **Benefit rules:** personal-layer E4 rules or `power`/`condition`
  effects active while the vow is kept and its condition holds.
- **Breach rules:** E4 rules on hooks (`eat`, `attack`, `speak`, `enter`)
  matching the restriction's tags, firing the consequence effects.

Existing effect types cover most slots: `condition` (with expiry) for
durations, `power` for benefits, `vital`/`resource`/`item` for
consequences and stakes, `title` for kept vows, `relationship` and
`knowledge` for witnesses and audiences, `claim` for stakes held by someone
else. New work: the slot schema, the pricing quote, breach hooks wired to
native item use and combat, and the vow ledger UI.

## Vows everywhere: more to consider

### Who swears
- **NPCs swear too.** A rival vows revenge and grows stronger until it's
  done. A guard vows to protect the gate. These drive E3 goals and give
  observation (E7) something to discover.
- **Collective vows.** A sect oath, a village's pact with a river spirit, a
  marriage. Breaking one affects everyone bound.
- **Vows by proxy.** A parent for a child, a lord for subjects; the bound
  may resist or accept.

### When vows happen
- **Accidental vows.** In a literal world, "I swear I'll never eat another
  taco" said in anger at dinner counts. The log notes it; the player can
  release it at a price.
- **Deathbed vows** bind the heir under the inheritance slot.
- **Vows in battle** for a sudden boost, priced by audience and
  desperation.
- **Vows across lives.** A vow "until I find her again" survives
  reincarnation under the soul's carryover rules.

### When vows collide
- **Contradicting vows** ("protect him" and "kill him"): the world
  resolves by priority, the stronger consequence, or a paradox event.
- **Forced breaking.** An enemy force-feeds you a taco. The coercion
  clause decides: some worlds forgive it, some don't, some let you hate
  them for it (E3 grudge with a bonus).
- **Vow sniping.** Enemies who know your vows build traps around them.
- **Rewinds and loops.** Does rewinding undo a breach? Per world and per
  cheat (E1 branch modes).

### The social side
- **Vow brokers** draft airtight vows for a fee; others sell loophole
  vows.
- **Vow courts** in lawful worlds judge disputes over interpretation.
- **Vow sensing.** An observe kind (E8) that sees active vows and their
  slots on a person, partially or fully.
- **Vow scars.** Broken vows leave a visible mark (a tag) that changes how
  people and witnesses treat you; some worlds let scars heal.
- **Reputation for keeping vows** raises will-pricing for future vows;
  oath-breakers find witnesses unwilling.

### Gaming it further
- **Streak farming.** Ramp vows that pay more the longer they last, kept
  with cheap restrictions.
- **Consequence gaming.** Stake something worthless that the world values
  highly (an heirloom with fake history, E7 fakes).
- **Vow chaining.** A vow whose benefit makes the next vow's restriction
  easy to keep.
- **Vow inflation.** If everyone vows, market pricing lowers values and a
  world may "reform" its vow law.

## How JJK does it, and what to take (2026-10-10)

Weibao: "more to consider? expand accordingly, consider how they were
implemented in jjk and more? Save accordingly". Summary from Claude's
memory of the series, in Claude's words; details marked (unsure) need
checking against the source, which the
[ttks lane](../gm/dispatch/ttks-novels-2026-10-10/ASSIGNMENT.md) is
reading for B3, a JJK-world novel.

### The JJK vow kinds

| Kind | How it works in the series | What we take | New slot or field |
|---|---|---|---|
| Self-imposed restriction | Limit yourself, gain output. The core rule: power is traded, not created | Benefit bought by restriction; value scales with how much it limits you | (core slots) |
| Disclosure | Explaining your technique to the opponent strengthens it, because it gives them a real advantage | Information as stake: telling the truth about your power is a price | `stake: information` |
| Time window | A fighter limits full effort to set hours, then gets stronger when working past them (overtime) | Conditions on time, with a burst after the window | `condition: time window`, `ramp` |
| Ratio or weak point | A technique that forces a weak point at a fixed ratio on any target | Restriction shapes the power's mechanics, not just its size | Benefit as a power axis change (E8) |
| Innate restriction | Born with a bargain: a broken body with huge energy, or no energy and a superhuman body. Not chosen | A body-level vow set at birth, part of constitution | `swearer: birth`, involuntary |
| Mutual vow | Two people agree; breaking it brings a penalty that neither controls, and it can be anything | Consequence left to the world, drawn when broken | `consequence: unspecified` |
| Forgotten vow | A vow made so that one side forgets it was made, then exploited later | The swearer may not remember the terms | `memory: forgotten` |
| Worded loophole | A bargain with a hostile party whose wording bound some acts but not others, so betrayal stayed legal (unsure of exact terms) | Interpretation as a weapon; vow brokers matter | `interpretation: exact` exploited |
| Open domain | A domain with no barrier: giving up the escape-proof wall buys huge range | Restriction on a zone's form buys scope | Benefit on scope axis |
| One-shot technique | A technique usable once, destroying the body after (unsure of the precise terms) | Burning your future for one moment | `duration: one use`, harsh consequence |
| Incantations and gestures | Chanting or hand signs raise output | A small ritual as a micro-vow, paid in time | `delivery: ritual` (E8B) |
| Game rules | A large ritual game where players earn points and can spend them to add new rules everyone must follow | World-scale vows with collective consent and rule-adding | Collective vow with a rule ledger |
| Judged vows | A domain that holds a trial; the verdict confiscates a technique or worse | Vow courts with real penalties | `witness: court` |

**The lesson:** vows are a universal economy. Everything strong has a
reason: something was given up, revealed, risked or bound. And the most
interesting vows change *how* a power works (a weak point, a range, a time
window), not only how big it is.

### Elsewhere (structure only)

| Source | Mechanic | What we take |
|---|---|---|
| *Hunter x Hunter* | Restrictions and vows strengthen Nen; a chain bound to one enemy group kills its user if used on anyone else; a power that costs lifespan; a vow that spends all future potential for one moment | Narrow targets buy strength; death as a consequence; spending the future |
| Celtic myth (public domain) | A geis: a sacred taboo, like never eating a certain meat and never refusing hospitality. A hero was offered that meat as hospitality, so both taboos collided, and he was doomed | **The original taco vow.** Collisions between two vows are a classic tragedy engine |
| *Fate* | Three absolute command seals; a broad, vague order is weaker than a specific one | Specificity pricing: narrow vows are stronger |
| *Naruto* | Gates that unlock power at growing damage to the body, the last one fatal | Graded vows: each level buys more and costs more |
| *Harry Potter* | An unbreakable promise with a witness binder; breaking it kills | Witness slot; death as consequence |
| Folklore bargains | Fae bargains, deals with devils, wishes twisted by wording | Mischievous interpretation |
| Monastic and knightly vows | Poverty, silence, chastity, fealty | Social vows that change how people treat you |
| *Chainsaw Man* | Contracts with devils paid in body parts or years | Body parts and lifespan as stakes |

### New slots and fields from this pass

- `consequence: unspecified`: the world or the witness decides at breach,
  drawn from the `interaction` stream, possibly anything.
- `memory`: `remembered` (default), `forgotten` by one side, or sealed
  until a trigger.
- `swearer: birth`: innate, involuntary restrictions set in the body or
  constitution, with no release slot (reasonably: a world or cheat may
  still offer one).
- `stake: information`: revealing a secret, your technique or your name.
- `specificity`: how narrow the restriction and the order are; narrower
  pays more by default.
- **Rule ledger**: collective vows that can add rules over time, like a
  game whose players buy new rules with points.
- **Graded vows**: a ladder of levels, each costing more.

### Gameplay ideas this opens

- **Explain your move.** In a disclosure world, a fight can include
  stopping to describe your technique, trading safety for power. NPCs do
  it too, and observation (E7) learns from what they reveal.
- **Overtime builds.** Characters who are weaker in normal hours and
  monstrous after them; schedule your fights.
- **Born with a bargain.** Starting origins with innate restrictions: a
  frail body with vast energy, or no energy and a monster body.
- **Unknown penalties.** Breaking a mutual vow rolls something the world
  picks; legends record the strange penalties people suffered.
- **Forgotten vows as plot.** You made a vow in a past life or under a
  spell and don't remember it; observation or a vow-reader reveals it, and
  its other party may come to collect.
- **Narrow targets.** A power usable only on one family, one beast type or
  one person, at huge strength, with death if misused.
- **Game worlds.** A world or event that runs as a points game where
  players add rules, so the rules themselves become the battlefield.
- **Vow collisions as tragedy.** Two honest vows, one trap. The geis
  pattern makes rivals plan collisions on purpose.
- **Vow ladders.** Gates you open one at a time in a fight, each more
  costly, the last one final.

## Survey fold-in: vows (2026-10-10)

From [A](../research/power-systems/anime-manga/REPORT.md), [B](../research/power-systems/web-fiction/REPORT.md), [C](../research/power-systems/western/REPORT.md). Proposals; codes point to survey rows.

### Corrections to the JJK section above (lane A, J1 to J10)

| Code | Correction |
|---|---|
| J1 | The forced weak point (ratio) is innate to that technique; disclosure and overtime are the separate vows |
| J2 | Chants and gestures are execution technique, not vows |
| J3 | The one-shot technique's body destruction is part of the technique itself; a one-use life vow stays an original option |
| J4 | The mutual-vow penalty is unknown in the series; drawing an arbitrary penalty is our engine proposal |
| J5 | Losing a self-restriction's benefit differs from a mutual vow's unknown penalty; a sacrifice already paid isn't a refundable deposit |
| J6 | Birth restrictions are involuntary, with no quote, consent or easy release implied |
| J7 | The open domain still uses barrier craft; it gives up the closed trapping shell to gain area |
| J8 | The ritual game can trap people; not everyone bound consented to each added rule |
| J9 | The trial is one technique's procedure with a disclosure vow, not a general vow court |
| J10 | The forgetting-and-control vow is supported; the later loophole wording needs checking, and interpretation isn't only tag matching |

### Additions to the vow model

- **Classify the mechanism first (A P1).** Before using vow slots, ask
  whether a limit is a vow, an innate trait, a technique rule or a failed
  activation. A failed activation costs no vow penalty.
- **Three enforcement modes (C M1).** A vow can **prevent** the act (it
  simply fails), **penalize** it automatically, or wait for **judgment**
  by a person or court. Logs record attempt, breach and verdict
  separately. Field `enforcement`.
- **The witness's knowledge boundary (C M2).** What can the enforcer
  check: actions, words, sincere belief, memories? An honest mistake can
  pass a belief oath and fail a fact rule. Fields `truth_basis`,
  `evidence_channels`.
- **Each bond has its own enforcer (B P1.02).** A mark, a soul, a patron or
  an institution enforces different things; removing one party's mark can
  leave the other still bound.
- **Claims belong to an office (C M3).** A debt owed to "the Lord of the
  Valley" passes to the next holder of the office without passing on
  memories.
- **Promise a result, not a route (C M8).** A patron promises courage and
  may deliver it by teaching, not a stat. Fields `promised_result`,
  `allowed_means`.
- **Payer, supplier and judge differ (C M9).** A sponsor may fund a gift that
  another authority delivers or blocks.
- **Patrons have preferences (A P6).** The same patron offers different
  terms to different people.
- **Legitimate intervention costs support (B P1.03).** Authority to act
  needs backing beyond raw power; unauthorized acts draw backlash.
- **Agreement versus compulsion (A P10).** A willing pact partner keeps
  agency and adds strength; a forced order has limited force.
- **Debt as a weapon (A P11).** Instead of damage, impose a debt; unpaid
  past a threshold, the debtor's power is sealed.
- **Affirmation vows (C M11).** Some oaths grow you by accepting a personal
  truth, not by giving something up. Repeating the words without the lived
  change does nothing.
- **Findable release clauses (C M14).** A release can depend on a secret
  (a true name); finding it is a lawful way out.
- **Impossible sets stay impossible (C M15).** Where local rules say so,
  two colliding vows don't get a priority that saves the hero; escape comes
  from waivers or circumstance, not a silent rule.
- **Safe recurring bargains (A P15).** A hostile spirit can accept a named
  opponent and a schedule, improving daily life.

New fields: `mechanism_kind`, `enforcement` (`prevent`, `penalize`,
`judge`), `truth_basis`, `evidence_channels`, `claim_holder_type`,
`office_id`, `promised_result`, `allowed_means`, `reward_payer`,
`reward_supplier`, `authorizer`, `release_predicate`, `conflict_set`,
`penalty_knowledge`.

## Wiki fold-in (2026-10-10)

From [lane W](../research/power-systems/wiki-digests/NEW_MECHANICS.md). Proposals:
- **Breach hooks read typed events (M2, F6).** A triggered effect and a
  manual act are different events; a vow can forbid one and allow the
  other.
- **Unknown stays unknown (F8).** Where a source doesn't state a vow's
  penalty, pricing or loopholes, an adaptation leaves those slots unknown
  rather than borrowing another series' rules.
- **Vow-granted skills (F8).** In The Wandering Inn, declared restrictions
  grant skills, some of which deepen over time; a source-backed example of
  affirmation and restriction vows growing.
- **Quests check reality and backing (M10).** A posted quest can be
  checked for whether its knowledge is real and its reward is actually
  held.
- **Borrow through a named guardian (M15).** Some lent powers come only
  through a specific relationship.

## Vows across the other layers (2026-10-10)

How vows meet the rest of the design. Defaults with dials, per world.

| Layer | Vows there |
|---|---|
| Time (Q9) | A vow's duration runs on game time, so a time skip or seclusion can carry a 20-day vow past in one action. Default: skipped time counts if you could have broken it and didn't; dial: some worlds count only lived time |
| Identity modes (Q8) | Who is bound depends on the mode: the body (A), the soul across lives (B), the guided person who may refuse (C), the host of a system (D), a whole house (E). A guide can't swear for the character without the character's consent, reasonably |
| Storyteller and fate (E5) | A fated person's vows weigh more; a vow can bind fate itself ("I will not die before the harvest"), priced high, with fate pushing back |
| Materials (E4B) | Oath-stones, contract ink and blood seals are tagged materials; swearing on them sets the witness slot and can store the vow in an item that can be stolen or broken |
| People (E3) | NPC brains score vows by traits: `proud` and `vengeful` swear often, `cunning` writes loopholes, `honest` keeps them. Vows change opinions: keeping one raises trust, breaking one leaves a memory |
| Lore (E6) | Famous vows become legends; a vow's history is a lore layer on the swearer and on any item sworn on |
| Observation (E7) | Vows can be K1 (hidden but real), K4 (a fake vow you claim), or K6 (a vow sworn to something beyond understanding). A vow-reader sees slots partly or fully |
| Streams (E1) | Mischievous interpretation and unspecified consequences draw from `interaction`; a luck cheat can see the draw before you break |
| Paths (E8C) | Some paths run on vows (oath-bound knights, ascetics, contract users); their steps are vow ladders |
| Idle play | Standing orders can include "keep my vows"; the away rule (Q8) respects them, and a warned action waits for you instead of breaking |

## More vow forms to consider

- **Vows on places.** A sanctuary vow forbids violence inside; anyone who
  fights there pays.
- **Vows on items.** A sword sworn never to be drawn in anger; it grows
  stronger with each calm use.
- **Inverted vows.** Promise to *do* something absurd daily (sing to a
  rock at dawn) instead of avoiding something.
- **Escalating vows.** Each day kept adds a small benefit and raises the
  consequence too, so a long streak becomes frightening to break.
- **Shared streaks.** A team vow where everyone's keeping adds up and one
  breach costs everyone.
- **Vows with the world itself.** A world's will offers you a vow (a
  quest-like bargain) and enforces it.
- **Retroactive vows.** "I have never lied" sworn in a truth-bound world
  checks your life record; it pays only if true.
- **Vow trading.** Two people swap vows: you keep my restriction, I keep
  yours, each gets the other's benefit.
- **Vow inheritance as plot.** A family line bound by an ancestor's vow,
  with heirs deciding whether to keep it, break it, or find its release.

## Showing it

- **Vow builder** in the center menu or a shrine action, filling slots from
  menus, with the sentence read back and the quote with its breakdown.
- **Vow ledger** in the bio: active vows with countdowns, streaks,
  conditions and their witness; kept and broken vows as history.
- **Hover on a vowed item or action** shows "your taco vow forbids this."
- **Log lines** for swearing, warnings, keeping, breaking and release.

## Smallest proof

Village shrine: a vow builder with three restrictions (eat a tagged food,
use a tagged weapon, skip a day's prayer), three benefits, three
consequences, true-cost and will pricing, one accidental-vow line, breach
detection on eating and attacking, and a ledger. Test: the same taco vow
quotes differently for a taco lover and a stranger to tacos; breaking it
applies the consequence; save, reload and import keep the vow, its streak
and its receipt.

## Vocabulary additions

Entity kind `vow` extended with slots `swearer`, `restriction`, `object`,
`scope`, `duration`, `benefit`, `consequence`, `witness`, `condition`,
`ramp`, `stake`, `counterparty`, `release`, `visibility`, `inheritance`,
`interpretation` (`exact`, `family`, `intent`, `mischievous`), `coercion`;
states `draft`, `active`, `warned`, `kept`, `broken`, `released`,
`inherited`; tags `vow_scar`, `oathkeeper`; hooks `eat`, `attack`, `speak`,
`enter`; fields `memory` (`remembered`, `forgotten`, `sealed`),
`specificity`; `consequence: unspecified`; `swearer: birth`;
`stake: information`; collective `rule_ledger`; graded vows.
