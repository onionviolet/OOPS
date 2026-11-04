# Afflictions, weapon properties and d20 mechanics: considerations, 2026-11-03

*Palette, not spec (AGENTS.md). Everything here is an agent proposal (AD32) unless it
quotes Weibao. Mechanics from Pathfinder 1e (OGL), Pathfinder 2e (ORC) and D&D 5e (SRD
5.1, CC-BY-4.0) are paraphrased with attribution; they are calibration points (AD49),
not law for any world.*

Weibao's request (2026-11-03): the "1 MRSA dagger" r/dndmemes post, implementing the
Pathfinder 1e **Rusting** weapon ability and the Pathfinder 2e **Tetanus** disease,
"and general DND stuff and more? other things with this much comprehensive".
[USER_VISION entry](USER_VISION.md#afflictions-weapon-properties-and-d20-mechanics-2026-11-03).

## What was built (round 1)

Two world-neutral seams under AD51, plus calibration content. Pure modules; no world
enrols them yet, no save slice, no UI. State: **implemented, below floor** (no player
journey crosses them; FLR1-FLR6 not met).

| Piece | File | What it does |
|---|---|---|
| Staged afflictions | [src/affliction_track.js](../src/affliction_track.js) | d20 degree of success; exposure save; onset; timed stages; a save at each stage end moves the stage (crit fail +2, fail +1, success -1, crit success -2); virulent needs two successes per step; treatments add a bonus unless the affliction resists that kind; terminal stages stop the clock and report |
| Contamination | same file, `exposuresFor` | Which afflictions a hit can expose, from wound kind/depth and what the source carries (soil, filth, a resistant strain), never from a weapon's name (AD38) |
| Corrosion | [src/material_corrosion.js](../src/material_corrosion.js) | Rust, tarnish and rot as material facts; armor loses protection (condition follows), small metal items crumble, magic items immune, corrodible creatures take damage |
| Corroding weapon property | same file, `critOptions` | On a confirmed critical, the wielder picks extra damage or a corrosion touch on the target or one corrodible piece of its gear; not against unattended objects |
| Content | [src/affliction_catalogue.js](../src/affliction_catalogue.js) | Tetanus (PF2: DC 14, onset 10 days, a week of clumsiness, a day locked-jaw, a day of spasms, then death); festering wound (original); resistant festering wound (the MRSA joke: DC 15, virulent, shrugs off common antiseptic); Rusting (PF1: +1, crit trade, self-immune) |
| Tests | [tests/affliction_track.test.js](../tests/affliction_track.test.js) | Calibration replay for tetanus, crit-fail start and recovery, resistance and virulence, contamination routing, rusting options and corrosion |

**Mechanism notes.**
- *Rust and tetanus are different mechanisms.* Rust is iron oxidising; tetanus comes
  from spores in soil reaching a deep, airless wound. A rusty nail is dangerous because
  it is dirty and makes punctures. So a gleaming farm fork in manure carries tetanus,
  and a Rusting blade, which sheds rust but is not filthy, carries none.
- *The MRSA dagger is a carrier, not a property.* The joke works without a magic item: a
  blade smeared with a resistant strain. The interesting mechanic is **treatment
  resistance**, which is a property of the strain, not of the weapon. AFW-H3 turns it
  into a world fact that changes with overuse.
- *Death stages follow AD50.* A terminal stage is reported, not executed. The consumer
  announces it and keeps at least two exits; hard death is a high dial.

## Round 2: Harry Potter consumer, 2026-11-03

Weibao picked the Harry Potter world as the first home (his reply: "Harry Potter world").
The consumer is the existing Polyjuice bench (`book.hp` pack): drinking it with animal hair,
which canon shows giving animal features that took several weeks in the hospital wing
(`book.hp.ev.animal_sample`, `book.hp.ev.long_recovery`). It used to be a flat 14-day timer.

| Piece | File | Change |
|---|---|---|
| No-save landing | [src/affliction_track.js](../src/affliction_track.js) `afflict` | An affliction can land at a stage without an exposure save (a botched transformation) |
| Staged features | [src/hp_animal_features.js](../src/hp_animal_features.js) | Three stages (full features, thinning fur and a shrinking tail, stray whiskers), a weekly check against DC 15. A failed check means no change yet, because a mishap that is wearing off does not spread. Hospital care adds +5 |
| Bench state | [src/hp_brewing_state.js](../src/hp_brewing_state.js) | Cat-hair drink lands at stage 3; `seekCare` checks into the hospital wing once; weekly checks settle lazily with d20s keyed by the track's start and check time (reload-stable); the ledger records each stage cleared |
| Panel | [src/hp_brewing_panel.js](../src/hp_brewing_panel.js) | Shows the stage, its description and the next check, plus a "Check into the hospital wing" button |
| Save compatibility | same state file | Additive: older saves with `{until}` keep the fixed timer and clear on schedule; new records carry a validated `track`. No schema bump |
| Port fix | [src/hp_brewing_domain.js](../src/hp_brewing_domain.js) | The bench re-renders when the clock port arrives. Before, a fresh load left Begin disabled with "The game clock is not ready" (pre-existing, found by the browser run) |

Calibration (AD49), measured over 20,000 simulated recoveries: **about 5.1 weeks with care**
(minimum 2), **about 9 weeks untreated**. That matches "several weeks in the hospital wing". The
untreated tail can run long (a rare case passes 30 weeks); the dial is the DC or the care bonus.

**Checks (round 2).** State: agent-verified, not human-reviewed; at the floor for this bench path.
- `node --test tests/hp_brewing.test.js tests/hp_brewing_domain.test.js tests/affliction_track.test.js`: 42 pass. Covers staged recovery, the care calibration over 40 seeds, reload-stable checks (one jump equals week by week), single admission, old-save compatibility and malformed-track rejection.
- `npm run build`, `npm run check:arch`, `npm run check:rules`: pass.
- `node scripts/playtest/hp-polyjuice.mjs <out>`: the full headless journey at 1920x1080 from a fresh origin passes, now extended with a cat-hair drink, check-in, one played week, Save/reload and literal Import byte for byte, and no page errors. [Receipt](gm/dispatch/afflictions-2026-11-03/receipt.json), [screenshot](gm/dispatch/afflictions-2026-11-03/hp-animal-features-1920.png).
- Not run: full `npm test` (pre-commit gate). Known gaps: the shared Condition panel still says "No active effects" (the bench owns this condition and does not feed it); a failed weekly check writes no ledger line; the species switch in the journey is set in the stored save because no UI picks a cat hair yet.

Corrosion (Rusting) has no HP consumer: nothing in the HP slices fights with iron. It waits
for AFW-L2 (native combat) or a D&D world.

Polyjuice's other uses (perceived identity, getting into places) have their own palette: [Polyjuice and perceived identity](worlds/HP_POLYJUICE_AND_PERCEIVED_IDENTITY_CONSIDERATIONS_2026-11-03.md).

## The palette (round 1)

Codes AFW1+. Each line is a mechanism with its default, dial and reason, so a world can
pick it.

### A. Affliction families on the same seam

| Code | Mechanism | Calibration source | Seam fit |
|---|---|---|---|
| AFW1 | **Poisons**: route (injury, contact, ingested, inhaled), short onset, stage intervals in rounds or minutes, a **maximum duration** after which they end | PF2 poison trait, PF1 poisons | Add `maxDuration` and a stacking rule (a second dose raises the stage) |
| AFW2 | **Curses**: no natural recovery; only specific remedies lower the stage | PF2 curse trait, mummy rot | `shift` with success = 0 unless a treatment kind matches |
| AFW3 | **Two-layer afflictions**: a curse that must be lifted before the disease can be treated | Mummy rot (PF1/PF2) | A `blockedBy` link between two tracks |
| AFW4 | **Shapechange afflictions**: lycanthropy, vampirism, ghoul fever turning the dead | PF2 lycanthropy, 5e SRD lycanthropy | Terminal stage is a *transformation*, not death; it hands the body to another system |
| AFW5 | **Addiction and drugs**: benefit now, withdrawal stages later, tolerance raising the dose | PF2 drugs and addiction | Exposure on each use with a rising DC; abstinence is the save |
| AFW6 | **Madness and sanity**: short, long and indefinite madness | 5e DMG madness tables | Stages carry behavior effects; it fits worlds with insanity (LOTM, Lovecraftian) |
| AFW7 | **Parasites, eggs and implants**: onset is gestation; removal is surgery, not saves | Original; rot grubs | A `removedBy` treatment that ends the track outright |
| AFW8 | **Radiation and environmental exposure**: dose builds a stage without a pathogen | PF2 radiation (Starfinder lineage) | Exposure without a wound route |
| AFW9 | **Carriers and immunity**: survivors immune for a time; some carry it without symptoms | PF2 "you're immune after recovery" defaults | Recovery writes a body fact; carriers spread exposure |

### B. Condition ladders the stages point at

| Code | Mechanism | Source | Note |
|---|---|---|---|
| AFW10 | **Valued conditions**: clumsy, enfeebled, drained, stupefied, frightened, sickened, each 1-4, lowering a stat family | PF2 conditions | Maps to existing stat multipliers; the seam already names them |
| AFW11 | **Dying, wounded and doomed**: dying counts up to death; each recovery adds wounded; doom lowers the threshold | PF2 | Pairs with AD50: an announced, countable path to death with exits |
| AFW12 | **Exhaustion levels**: six cumulative levels, one removed per long rest | 5e SRD (2014) and the 2024 flat -2 per level | Default for hunger, cold and sleeplessness |
| AFW13 | **Lingering injuries**: a crit or a drop to zero can cost an eye, a hand or a limp, until healed or regenerated | 5e DMG | Hooks to the body figure; prosthetics are making (MR codes) |
| AFW14 | **Bleed**: persistent damage per round, ended by a flat check or first aid | PF2 persistent damage, PF1 bleed | The existing `Bleeding` effect is a one-number version |
| AFW15 | **Massive damage and system shock** | 5e DMG variant, PF1 | Optional high dial |

### C. Weapon and armor properties (the Rusting family)

Default: a property is a mechanism on a trigger (hit, crit, kill, wielder action),
with a cost in price or bonus. Dial: price, frequency, and whether the wielder chooses.

| Code | Property | Source | Mechanism |
|---|---|---|---|
| AFW16 | Flaming, frost, shock, corrosive, thundering | PF1, PF2 runes | Extra typed damage on hit; burst variants on crit |
| AFW17 | **Keen, vorpal** | PF1 | Widen the crit range; a natural 20 beheads (AD50 applies to the player's own neck) |
| AFW18 | **Wounding** | PF1 | Bleed on hit, feeding AFW14 |
| AFW19 | **Bane, holy, unholy, anarchic, axiomatic** | PF1 | Bonus against a creature type or alignment; needs a world that tags creatures that way |
| AFW20 | **Ghost touch, disruption, brilliant energy** | PF1 | Hit incorporeal; destroy undead on a failed save; pass through nonliving armor |
| AFW21 | **Merciful, vicious** | PF1 | Nonlethal; extra damage to the wielder too |
| AFW22 | **Returning, throwing, dancing, speed, defending, spell storing** | PF1 | Action economy; already partly in combat stances |
| AFW23 | **Rusting** (built) and its cousins: **dissolving** (oozes), **rotting** (wood/leather), **tarnishing** (silver) | PF1 rusting; PF1/PF2 black pudding and gray ooze | Same corrosion seam, different agent |
| AFW24 | **Cursed items**: the -2 sword that won't leave your hand, the berserking blade | PF1/5e | A property with an affliction attached (AFW2) |
| AFW25 | **Armor properties**: fortification (ignore crits), resistance, shadow, spell resistance | PF1 | The defensive mirror of AFW16-AFW20 |

### D. Materials as facts

| Code | Mechanism | Source | Note |
|---|---|---|---|
| AFW26 | **Hardness, hit points, broken threshold** for objects; sunder and shield block | PF2 items | Maps onto existing durability 0-100 with a broken state |
| AFW27 | **Special materials**: adamantine (ignores hardness), cold iron (hurts fey), silver (hurts lycanthropes, devils), mithral (light), darkwood | PF1/PF2 | Damage-reduction bypass by material; feeds AFW4 (silver cures nothing, it hurts) |
| AFW28 | **Material eaters**: rust monster, disenchanter, ooze dissolves weapons that hit it | PF1/5e SRD | A creature with the corrosion seam as its attack; hitting it with iron is the cost |

### E. Environment and survival

| Code | Mechanism | Source |
|---|---|---|
| AFW29 | Starvation and thirst, cold and heat, altitude, drowning and suffocation, each as a staged track on exhaustion | 5e SRD, PF2 environment |
| AFW30 | Trench foot, frostbite, sunstroke: environmental exposure that leaves AFW13 injuries | Original, history |

### F. Treatment as making and knowledge

| Code | Mechanism | Note |
|---|---|---|
| AFW31 | **Treat disease / treat poison**: a Medicine check whose degree becomes the patient's next save bonus | PF2; the seam's `treatment.bonus` |
| AFW32 | **Remedy kinds**: antiseptic, antitoxin, surgery, magic (lesser restoration, remove disease), herbal (the existing Golmoon and Silver thistle) | Kinds are what `resists` names |
| AFW33 | **Diagnosis before cure**: an unknown affliction shows symptoms, not a name, until someone identifies it | Fits sealed-secret practice and LOTM investigation |

### G. Worlds and stories

| Code | Mechanism | Note |
|---|---|---|
| AFW34 | **Plague in a settlement**: exposure through contact, quarantine as a social choice, cures as economy | BHC18 already holds cross-world disease as default-off |
| AFW35 | **Treatment resistance evolves**: overusing one remedy in a world raises the share of strains that resist it | The MRSA joke as a real world mechanic; a world fact with a slow clock |
| AFW36 | **Weaponised afflictions**: poisoners, plague doctors, assassins with filthy blades, and the counter-trade | A life, not a menu: a poisoner needs supply, a trade route and risk |

## ACT NOW (done this round)

- Built the two seams, the content and a focused test (6 passing).
- Separated rust (material) from tetanus (contamination) in code and tests.

## ACCOUNT FOR NOW

- **AFW-N1.** Any consumer must announce terminal stages and keep two exits (AD50).
- **AFW-N2.** Persistence: tracks are small JSON records ready for a namespaced save
  slice, but no slice or migration exists. A consumer adds one (AR rules) before saving.
- **AFW-N3.** Game time: durations are in played minutes. A world with a faster clock
  scales them with a dial, not by editing content.
- **AFW-N4.** The existing Frontier `Open cut` and `Bleeding` stay as they are; Frontier
  gets no new depth (2026-10-26) unless a book world needs it tested there first.

## LATER / DELEGATE

| Code | What | Level | Effort | Done check |
|---|---|---|---|---|
| AFW-L1 | ~~Wire the affliction seam into a real home~~ Done for HP Polyjuice animal features (round 2). Next consumers: a disease with exposure and a terminal stage (tetanus or dragon pox in an HP or D&D life) | Runtime slice | Medium | A player journey: exposure, onset, treatment, recovery or an announced terminal stage; save, reload, import |
| AFW-L2 | Wire `critOptions` into native combat crits and `corrode` into durability | Runtime slice | Medium | A rusting crit on armored foe lowers its armor in a browser run |
| AFW-L3 | AFW1 poisons and AFW2 curses on the same seam (maxDuration, blockedBy) | Seam extension | Small | Focused test per family |
| AFW-L4 | AFW10/AFW12 condition ladders as stat effects | Runtime | Medium | Condition rows visible in the status window |
| AFW-L5 | AFW35 evolving resistance as a world clock | Design + runtime | Medium | A world's resist share moves after repeated antiseptic use |
