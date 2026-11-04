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

## Round 3: the collected d20 rules, 2026-11-03

Source: the [d20 collection receipt](research/d20/D20_RULES_COLLECTION_2026-11-03.md)
(Archives of Nethys records, d20pfsrd pages). Counts are unique names; many
Pathfinder 2e entries appear twice, as the original and the remastered printing.

**Checks against what is built.** Tetanus matches `src/affliction_catalogue.js`
(DC 14, onset 10 days, the same four stages;
[Diseases ID 3](https://2e.aonprd.com/Diseases.aspx?ID=3), the old ID 28
redirects). Pathfinder 1e Rusting matches `RUSTING`: a +1 bonus, trade a
confirmed critical's extra damage for *rusting grasp* on the target or its
armor, never against unattended objects, the weapon itself rust-immune
([d20pfsrd](https://www.d20pfsrd.com/magic-items/magic-weapons/magic-weapon-special-abilities/rusting/)).
PF2 has no exact Rusting rune. The nearest is the Corrosive property rune,
whose critical hit puts 3d6 acid damage into the target's armor or raised
shield (the same crit-to-armor shape), then Decaying and Rusting Ammunition (rust monster saliva, damages metal,
[Equipment 4434](https://2e.aonprd.com/Equipment.aspx?ID=4434)).

**Calibration ladder for real diseases (PF2, level, Fortitude DC, onset).**
Scarlet fever 1, 13, 2 days; tetanus 1, 14, 10 days; tuberculosis 1, 15, a week;
malaria 2, 16, 10 days; bubonic plague 3, 17, a day. A world needing a
mundane disease starts from these numbers (AD49) and changes them only with a
reason. Seven of 29 diseases are virulent (two successes per step down, which
the seam already supports): blueblisters, scarlet leprosy, swamp guts, velstrac
tetanus, sewer haze, brain worms, crimson ooze.

| Code | Mechanism | Source record |
|---|---|---|
| AFW37 | **A disease that ruins gear**: at a late stage the afflicted person's armor and carried items break as the rot spreads; one affliction calls the corrosion seam | PF2 Rust Creep ([Diseases 25](https://2e.aonprd.com/Diseases.aspx?ID=25)), DC 15, seven stages ending in death; stage 4 breaks items of its level or lower |
| AFW38 | **Afflictions with a non-Fortitude save**: a disease of the mind is resisted by will, not body | PF2 Nightmare Fever (Will DC 25); the seam's `dc` is save-agnostic, so the consumer picks the body or mind modifier |
| AFW39 | **Exposure routes as poison traits**: injury, ingested, inhaled and contact routes, each with its own delivery and counter | 248 PF2 poisons: injury 79, ingested 68, inhaled 31, contact 31 records; 20 virulent. Maps to `routes` beside the wound routes |
| AFW40 | **Curses as items and as afflictions**: most PF2 curses are magical, many are mental, some ride on a cursed item | 58 PF2 curses (85 of 92 records magical, 22 mental, 25 with the Cursed trait); feeds AFW-L3 |
| AFW41 | **Persistent damage as a condition**: bleeding, burning or acid that ticks each turn and ends on a flat check or help | PF2 Persistent Damage condition (a DC 15 flat check after each tick); the Wounding rune adds persistent bleed. A combat-scale cousin of the stage track |
| AFW42 | **Property runes as the weapon-property catalogue**: 141 weapon and 115 armor property runes give mechanisms to borrow (Corrosive, Decaying, Wounding, Bane, Ghost Touch, Keen) | Runes group; PF1 has 184 weapon special abilities collected for the same purpose |

**Condition names to reuse** (PF2, 57 unique): clumsy, enfeebled, drained,
stupefied, sickened, fatigued, doomed, wounded and dying are the ladders
AFW10-AFW12 point at. PF2 has no "mute" condition; tetanus's "can't speak" is
plain text, so `mute` in the catalogue stays a consumer-named effect.

## Round 4: books or wikis, and more to consider, 2026-11-03

Weibao asked: “are there books and stuff that cover these or is the wiki the
most affective? More to ocnsider?”

**Short answer.** For Pathfinder the wikis are effectively the books: Archives
of Nethys and d20pfsrd reproduce the rules text Paizo publishes under the OGL
and ORC, with source and page citations, and they are already searchable data.
The rulebooks add layout, art and a few GM sidebars, not mechanics. We hold no
Pathfinder books, and none are needed for the mechanics. Other systems are a
different matter: several held books cover these topics from angles Pathfinder
does not, and those are worth reading before buying anything.

**What we already hold** (Calibre and the tabletop library's searchable text):

| Source | What it adds to afflictions, properties and disguise | Licence for reuse |
|---|---|---|
| D&D 5e SRD 5.1 and 5.2.1 (text in the tabletop library) | Diseases, poisons with delivery types and prices, the six-level exhaustion ladder, conditions | CC BY 4.0; mechanics and text reusable with attribution |
| D&D 5e Dungeon Master's Guide, Player's Handbook, Monster Manual (2014), Xanathar's, Tasha's (Calibre 128, 164, 133, 190, 191) | Madness tables, sample diseases, poison crafting, downtime and crafting rules, the Disguise Kit and Deception skill | Proprietary; paraphrase mechanics only |
| GURPS Basic Set: Campaigns and Characters (tabletop library, text extracted) | The most simulation-minded: disease and poison resistance rolls repeated over days, contagion, starvation, cold and heat, injury and bleeding; Disguise and Acting as separate skills | Proprietary; paraphrase only |
| Blades in the Dark player kit | Deception as position and effect, not a pass/fail mask | Its own licence |

**Not held, worth knowing** (no purchase implied; buying needs Weibao's yes):
Warhammer Fantasy Roleplay 4e (detailed diseases, festering wounds and
infection; the held copy is damaged, already DL42-DL44); HârnMaster (injury,
infection and bleeding as its own subsystem); Call of Cthulhu and Mothership
(sanity and panic as afflictions of the mind).

**Real medicine beats any game for real diseases.** For tetanus, plague or
malaria in a world that copies our biology, public health sources (incubation
periods, untreated fatality, what treatment changes) are the canon numbers
under AD49. Pathfinder's are game numbers, already rounded for play.

| Code | Finding | Disposition |
|---|---|---|
| AFW-R4-1 | **Archives of Nethys mixes printings**: 44 disease records are 29 diseases, because original and remastered printings both appear (likewise curses, poisons, runes). A consumer that takes "the" Tetanus must pick one | ACCOUNT FOR NOW: prefer the remastered printing (Player Core, GM Core) and record which; keep the legacy one only as a variant |
| AFW-R4-2 | **d20pfsrd includes third-party content** beside Paizo's, labelled per page | ACCOUNT FOR NOW: every PF1 citation names its publisher; the d20pfsrd session has been told |
| AFW-R4-3 | **Calibrate by level, not by monster**: Pathfinder 2e's GM Core has a table of standard DCs by level, which turns "how hard should this curse be in a level-5 life" into one lookup | LATER: collect that table through the authorized Archives of Nethys route; small; done when AFW numbers for a new world cite it |
| AFW-R4-4 | **GURPS repeats the resistance roll on its own clock** (often daily) instead of stage ends; a world with slow, grinding illness may prefer that shape, which the seam can take as a stage with a short duration and `shift [0,0,-1,-1]` | ACCOUNT FOR NOW: no seam change; a world chooses the cadence |
| AFW-R4-5 | **5e's exhaustion is one shared ladder** many sources feed (starvation, forced march, some diseases); Pathfinder spreads the same idea over fatigued, drained and doomed | LATER: AFW-L4 should read both before choosing a ladder, haiku reading of the held SRD text, done when the ladder row cites both |
| AFW-R4-6 | **Real-disease numbers** for any world that uses our biology come from public health sources, not game books | LATER: when a world first needs a real disease, sonnet, cite one public source per number |
| AFW-R4-7 | **Structured data beats parsing markdown**: the Archives records carry stages as prose, so a consumer must parse "Stage 2 ... (1 day)". The Foundry `pf2e` system's packs may hold the same stages more structurally (unverified assumption) | LATER: check one disease in that repository before writing a parser; small; done when the parser choice is recorded |

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
