# E8E. Adaptation: the wheel, the ledger and everything that learns you (proposal)

> **How to use this doc (Weibao, 2026-10-10):** these are considerations
> for established and future worlds, to help ideaboard and implement
> fitting characters at fitting times. Tiers, lists and tables are
> illustrative, not complete or fixed; more distinctions can exist.
> Everything just has to make sense for the world and character at hand.

Claude, 2026-10-10. Weibao: "How to possibly implement stuff like JJK's
world, from techniques, to Mahoraga, and more? Concepts like adaptation and
other busted stuff?" then "record idea and save accordingly? Expand on idea
accordingly... look at other subtle features and possibilities."

Generic engine primitive drawn from Mahoraga in *Jujutsu Kaisen*. The JJK
world itself lives in [the JJK world brief](../worlds/jujutsu/WORLD_BRIEF.md).
Builds on [E8C power paths](E8C_POWER_PATHS_AND_ANIME.md), [E7 observation](E7_OBSERVATION_AND_MYSTERY.md)
and [E4 tags](E4_TAGS_AND_RULES.md). Per the [rulebook](../RULES_FROM_SCRATCH.md),
each world sets its own adaptation rules; every value here is a dial.
**Proposal only. Nothing is selected for a build.**

## The idea in one line

Anything that is hit by the same thing enough times can get better at
surviving it, and sometimes at answering it. One ledger covers a summoned
god-beast, a poison-tolerant body, a rival who learns your footwork and a
whole society that learns to counter a famous technique.

## The ledger

One record per adapter per phenomenon.

| Field | Meaning |
|---|---|
| `adapter` | Who or what adapts: a person, a monster, an item (a wheel), a place, a faction, a world |
| `phenomenon` | A key for what is being adapted to (see signatures below) |
| `exposure` | How much of it the adapter has taken since the last step |
| `progress` | Steps taken so far, 0 to `full` |
| `stage` | `none`, `partial`, `resistant`, `immune`, `answered` |
| `source` | Receipts: which hits, when, from whom. Lets the Notebook explain it and lets observers learn from it |
| `decay` | How fast progress fades when the phenomenon stops (0 means permanent) |

### Signatures: the balance dial

Every incoming effect carries a phenomenon key. Keys are hierarchical:

```
slash
slash.technique.dismantle
slash.technique.dismantle.rev2      (a specific revision)
heat
heat.fire.technique.ember_insects
concept.infinity
```

The **granularity** a given adapter reads at decides everything:

| Reads at | Result |
|---|---|
| Coarse (`slash`) | Nearly unbeatable. Every sword in the world stops working |
| Middle (`slash.technique.dismantle`) | Canon-like. Varying techniques resets the clock |
| Fine (exact revision) | Weak. A small tweak to your technique dodges it |

Dial per adapter: **spillover**, how much adapting to a child key also
counts toward its parent (default 25 percent) and its siblings (default 0).

Native combat has no damage types today (`rollCombatStrike` in
[combat_math.js](../../src/combat_math.js) takes plain `damageModifier`,
`hitModifier` and `evasionModifier`). The smallest bridge is to give each
attack source a phenomenon key (weapon tags, technique id, enemy id) and let
the ledger turn the key into a `damageModifier` before the strike rolls.

### The wheel: when a step happens

A step is when exposure becomes progress. Triggers, any of which a world or
adapter can pick:

| Trigger | Feel |
|---|---|
| Per hit taken | Fast, punishes multi-hit spam |
| On a clock (every N seconds of exposure) | Mahoraga-like; burst before the turn |
| After damage crosses a threshold | Heavy hits teach faster than pokes |
| On rest or sleep | Bodies: you adapt overnight, not mid-fight |
| On generations | Species and societies; very slow |

Step size can grow with exposure (more of it, faster learning) or shrink
with novelty load (adapting to five things at once, each goes slower).
Dial: **parallel slots**, how many phenomena can step at once (Mahoraga:
canon unclear; default 2).

**Visible wheel.** The adapter shows its turns: a wheel spins, a body
toughens, a rival's eyes narrow. Rule 6 still holds: the player sees
*that* it adapted, and the Notebook guesses *to what*, which can be wrong
when several phenomena hit at once.

### Outputs by stage

| Stage | Defense | Other outputs |
|---|---|---|
| `partial` | Damage from that key reduced (default 25 percent) | |
| `resistant` | Reduced 60 percent | Status effects from it shortened |
| `immune` | No effect | Healing from it if the adapter can heal (adapting to damage as regeneration) |
| `answered` | Immune | **Offensive adaptation:** the adapter's own attacks ignore defenses built on that key (Mahoraga cutting a defense it adapted to) |

`answered` is rare and per adapter. Most adapters stop at `resistant`.

## Counters that work for a real reason

Per the ability contract, every counter needs a cause, not an invented
immunity.

1. **Burst.** Finish it before the wheel turns. Pure damage stays useful.
2. **Novelty.** Rotate phenomena faster than it can step. Rewards a wide
   kit and punishes a one-button rotation.
3. **Decoy feeding.** Waste its turns on a harmless phenomenon while the
   real one hits outside the slots it is using.
4. **Off-axis.** Hit something adaptation does not cover: the space it
   stands in, its summoner, its contract, its supply.
5. **Overwhelm.** Resistance has a ceiling; enough raw force still kills.
   Immunity is per key, not per number, so a world decides whether immune
   means zero or a cap.
6. **Attack the wheel.** If adaptation lives in an organ or item, break or
   steal it.
7. **Adapt back.** Two adapters in an arms race, each step answering the
   other's last. Ends when one runs out of fuel, slots or time.
8. **Steal the lesson.** Someone watching the adaptation (Sukuna watching
   Mahoraga) can learn the answer without being the adapter. Observation
   (E7) of the `source` receipts.

## Where the same primitive shows up

| Adapter | Phenomenon | Step trigger | Notes |
|---|---|---|---|
| Summoned adaptive general | Anything at middle granularity | Clock | The Mahoraga case |
| Your body | Poison, cold, heat, altitude, a disease | Rest | Mithridatism; tolerance can also mean a drug stops working |
| Your mind | A fear, a horror, a voice | Repeated encounters | Desensitization; also numbness, a real cost |
| A rival or enemy | Your technique or your opening pattern | Per fight | Rat-step in reverse: [technique_content.js](../../src/technique_content.js) already models enemy cue patterns, so an enemy can learn the player's |
| Regenerating monster | Weapon tags | Per hit | Hydra-style: fire stops working, so bring acid |
| Pest or crop | A pesticide, a ward | Generations | Farming pressure; rotate methods |
| A faction | Your raids, your scams | Per incident | Guards change routes; marks get wary |
| A whole world | A famous technique | Years | E8C "counters spread" and "devaluation" are this ledger at world scale |
| An item | Its wielder's style | Use | A blade that fits your hand better over time; turns against a thief |

That last row matters for scope: adaptation is not a JJK feature, it is the
same machine behind "the world learns about you".

## Idle and life-sim fit

- **Anti-AFK pressure with a reason.** Grinding one rotation against an
  adaptive enemy stalls, and the game can say why. Players switch styles
  or switch targets. It never blocks: other enemies and other rotations
  stay open.
- **Decay matters for idle.** If progress never fades, a boss you fought
  once is immune forever. Default: enemy ledgers decay over days, body
  tolerance over weeks, world-scale counters over years.
- **Player-side adaptation is a progression path.** Living in the cold
  makes you cold-hardy; that is growth by exposure, one of E8C's growth
  flavors, and fits "bodies are real" (rule 4).
- **Carrying it across worlds** follows rule 5. Body tolerance travels
  with the body; a wheel grafted to an item travels with the item; a
  world's counters stay in that world.

## Subtle cases

- **Adapting to healing.** If adaptation is too coarse, an adapter could
  adapt to its own healers. Dial: whether beneficial effects count as
  phenomena (default no, but a curse-world might say yes).
- **Adapting to the summoner.** A wheel that adapts to its master's
  commands stops obeying. A possible ending for an untamed summon.
- **Over-adaptation.** Adapting to cold costs heat tolerance (trade-offs as
  a dial: zero-sum, partial or free).
- **Adapting to a lie.** If the phenomenon key is read wrong (rule 6), the
  adapter spends turns on a disguise. Illusions and false signatures
  become real counters.
- **Inheritance.** A destroyed adapter's ledger can pass to kin, to its
  wheel, or to whoever ate it (E8B consumption). Ties to heir rules.
- **Adaptation as evidence.** A body immune to a rare poison is proof that
  someone has been dosing it. Mystery hook (E7).

## Save and engine needs

- A ledger store on actor records, keyed by phenomenon. New save field, so
  it needs a migration or an explicit compatibility decision (AGENTS.md
  safety rule).
- Phenomenon keys on attack sources: weapon tags, technique ids, enemy ids,
  status ids. Start with enemy id plus weapon type; no full damage-type
  system needed for the first slice.
- One hook before `rollCombatStrike`: ledger to `damageModifier`. One hook
  after: record exposure, maybe step.
- Notebook entries from `source` receipts.
- Seeded randomness (E1) for any chance-based step.

## Smallest playable proof

One original adaptive enemy in the [Proving Ground](../worlds/proving-ground/WORLD_BRIEF.md)
or the Frontier (see [placement](../worlds/jujutsu/WORLD_BRIEF.md#where-it-lives)):

1. Visible wheel, clock trigger, middle granularity, two slots.
2. Player sees it shrug off a repeated weapon type after a few turns.
3. Switching weapon type, bursting it early or fleeing and returning
   after decay all work.
4. Notebook records "it learned your spear" with the receipt.
5. Save, reload and import keep the ledger.

## Open questions

- Q1: Default granularity per world, or per adapter only?
- Q2: Should the player ever get a wheel of their own (carried item, graft,
  vow), and at what price?
- Q3: Does `answered` exist outside JJK, or is offensive adaptation that
  world's special rule?
