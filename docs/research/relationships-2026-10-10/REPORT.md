# Relationships: how they work today, and how mature systems do it

Research and proposals, 2026-10-10. Weibao asked to look at implementing
relationships and at "auditing how one works". Nothing here is accepted
design or implemented gameplay until he says so. No code was changed or
run; the code audit is read-only.

**Reader files:**
- [YAIRPG_STATE_AND_GAPS.md](YAIRPG_STATE_AND_GAPS.md): code with
  file:line, designs, existing research, a gap map.
- [MATURE_SYSTEMS_SURVEY.md](MATURE_SYSTEMS_SURVEY.md): RimWorld, CK3, the
  Sims 4, Dwarf Fortress, Stardew, Persona 5, Mass Effect and Dragon Age,
  Shadow of Mordor, Fire Emblem, Wildermyth, Kenshi and Bannerlord. 35
  coded mechanics (RL1-RL35), with sources.

## 1. Findings: the state today

**F1. There is no relationship system, only five separate stores.**
1. A directed ledger in the simulation (`src/simulation_contracts.js:206`).
2. The chronicle's own record, used only for the Village elder
   (`src/chronicle.js:29-35`).
3. The authored Village household (`src/npc_lives.js`).
4. A read-only "People you know" view (`src/people_knowledge.js`).
5. The life record (`src/life_record.js`).

**F2. The numbers are written but almost never read.** About 30 content
files write `trust`, `respect`, `familiarity` or `esteem`. Only one gate
reads an axis: the elder's trust check (`src/chronicle.js:201`). The
simulation already exposes `relationship.<axis>` as a fact commands can
require (`src/simulation_effects.js:107`), but no content uses it.

**F3. Family is scenery.** The household advances by calendar year and
the player can't affect it. An heir starts with fresh relationships
(`src/chronicle.js:273-281`); only the household list and life record are
copied.

**F4. The same names mean different people.** Lio, Neri, Iona and Oren
each appear as different people in different systems.

**F5. The designs and research are well ahead of the code.** E3 sections
9-11 and 13, the north star's romance, followers and heirs sections, and
the rival chronicle are all proposals. The accepted rules are broad:
- rulebook 5: relationships cross lives and worlds only through a
  carrier;
- rulebook 6: readings can be wrong;
- "the heir inherits what was left behind", with the code change pending.

**F6. The strongest existing convention is consent.** Lio and Tamsin can
decline, and declining costs nothing. Keep it.

## 2. What mature systems agree on

From the survey ([MATURE_SYSTEMS_SURVEY](MATURE_SYSTEMS_SURVEY.md) §2),
the patterns that recur across several games:

- **Opinion as a sum of dated reasons** (RL1, RimWorld, CK3). Each reason
  has a value, an expiry and a stack cap. Players can see every reason
  and how long it lasts (RL32). This is cheap to store, and it computes
  lazily, so it costs nothing while idle.
- **Separate layers, not one meter.** Familiarity, opinion, trust,
  role-relations, memories, shared history and obligations. CK3 also
  splits opinion into channels (RL33), and the project's own
  CHARACTERS_AND_WORLD_EVENTS says "no single favorability meter".
- **Role-relations with rules** (RL9, RL27): friend, rival, lover, sworn
  sibling, master and disciple. Each has an opinion floor, an effect
  table and an exclusivity rule (one rival at a time, say).
- **Obligations are a currency** (RL19-RL22): CK3 hooks (weak, strong,
  perpetual), secrets that convert to leverage, and Mass Effect's
  loyalty missions turning approval into a lasting flag.
- **Bonds can be locked to survive death** (RL26): Wildermyth's locked
  romances and rivalries resume when a hero returns.
- **Decay needs floors** (RL12, Stardew), or absence feels like a
  punishment. That matters even more for an idle game.

Complaints players repeat:
- additive opinion bloat that drifts to "everyone loves me" (CK3);
- daily chores that feel mandatory (Stardew);
- irrecoverable losses from a single bad event;
- opaque reasons.

## 3. A model that fits YAIRPG (proposal)

This builds on the existing directed ledger instead of adding a sixth
store. The axes reconcile E3 (affection, debt, fear) with the live code
(trust, respect, familiarity, esteem).

| Layer | Holds | Comes from | Idle behavior |
|---|---|---|---|
| L1 Familiarity | 0-100 per pair | Shared time and place | Grows with co-location; decays to a floor |
| L2 Opinion | Clamped sum of dated reasons | Events, gifts, values matched, kin offsets | Computed on read; expired reasons drop out |
| L3 Trust | Slow axis, separate from liking | Kept promises, shared danger; betrayal drops it hard | Unchanged while away |
| L4 Role-relations | Typed and sometimes exclusive: friend, rival, lover, kin, master and disciple, sworn sibling, liege, oath partner | Thresholds plus a scene | Locked roles survive death if the world allows it |
| L5 Memories | Up to 5 typed memories per pair, each cited somewhere (a line, card or choice) or it expires early | Events | No change |
| L6 Shared history | A log both people attended, compressed over time | Battles, journeys, crimes | No change |
| L7 Obligations | Hooks (weak, strong, perpetual), debts, vows, secrets | Favors, saved lives, oaths, blackmail | Weak hooks expire on a clock; vows don't |

**Offline rule from the survey.** Numbers resolve in closed form when the
player returns. Authored scenes (confessions, betrayals, loyalty tests)
wait in a queue until the player is present. That way the player can't
lose a partner or break a vow while away. In-character autonomy (E3 §14)
can handle small choices.

## 4. Across lives and worlds (rulebook 5)

From the survey §5. Each of these needs an explicit carrier:

- **Pair bonds that can be locked:** soulmate, sworn sibling, nemesis,
  master and disciple. They resume at reduced strength after death or
  rebirth.
- **Heirs inherit a starting opinion, not the bond.** About 30% of the
  parent's opinion, capped and fading over years. Kinship comes from
  family records. Obligations carry when the world says they do (debts
  pass to heirs, for example).
- **Bonds can ride on items and titles:** an oath-sworn blade, a family
  seat, a marriage token.
- **Soul bonds cross lives,** and whether the other person *remembers*
  is a separate flag.
- **Fame can cross worlds** as a small, capped "reputation echo".
- **Persistence is a per-world setting:** bonds persist, fade, or are
  re-rolled. This fits "limits are per-world adjectives".

## 5. Relationship mechanics already found in the book deep dives

These are bonds that do mechanical work, ready to slot into L7 or L4:

- LOTM anchors: people stabilize a demigod's self.
- LOTM heredity: children inherit part of a parent's power and drain the
  parent.
- Shadow Slave: True Names and the Shadow Bond (a name gives control);
  Domains made of loyal people, whose loyalty drains to rivals.
- Reverend Insanity: poison-vow Gu as an enforced contract; Fang Yuan's
  secret-keeping states (unaware, bound, removed).
- Hunter x Hunter: Nen vows that strengthen power and cost it when broken.
- Chainsaw Man: contracts priced in body parts.

The [E8D vow system](../../emergent/E8D_VOW_SYSTEM.md) is the closest
existing spec.

## 6. Smallest useful slice (proposal)

Ordered by cost; each is playable on its own:

1. **Read what's already written (no schema change).** Make a few
   existing interactions read `relationship.trust` or `respect`. For
   example, Tamsin offers a second outing only above a trust threshold,
   and the old craftsman lowers a price at respect 2. Show the reason in
   the People card ("trusts you: kept two promises").
2. **Typed memories with expiry** on the existing ledger: kind, weight
   and expiry instead of free text. This needs a small additive migration.
3. **One role-relation:** Mara as a real rival, with exclusivity, a
   grudge and debt from the settle, spare and conceal choices.
4. **Heir carry:** start from parent opinion plus the family record,
   per the accepted "inherits what was left behind" direction.

## 7. Open choices for Weibao

- **Q1.** E3's open question 1 is still unanswered: should the Village
  household become live people? It blocks player marriage, births, grief
  and family heirs. Under "anything possible" the answer is probably yes
  with an off switch, but it changes the save, so it needs his word.
- **Q2.** The duplicate names (Lio, Neri, Iona, Oren) can be renamed or
  merged into single people. Merging is more interesting, but it touches
  several waves' content.
