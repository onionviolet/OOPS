# Polyjuice and perceived identity: considerations (2026-11-03)

Status: palette of proposals (AD32), round 1. Weibao asked to think through
the other uses of Polyjuice, perceived identity used to reach places, with
the d20 sites' ideas kept in mind and wiki collection considered
(USER_VISION, "Afflictions, weapon properties and d20 mechanics", 2026-11-03).
Nothing here is accepted direction. Constraints are default, dial and reason.

Sibling palette: [afflictions and weapon properties](../AFFLICTIONS_AND_WEAPON_PROPERTIES_CONSIDERATIONS_2026-11-03.md)
(the animal-features mishap is its round 2). Older identity owners this builds on:
[rivals, identities and fate](../RIVALS_IDENTITIES_AND_FATE.md) (appearance
versus rights versus body, witness-scoped exposure),
[identity laws by world](IDENTITY_LAWS_BY_WORLD_2026-10-14.md) and the
[HP institutions pass](HARRY_POTTER_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md).
Runtime it would sit on: `src/hp_brewing_state.js` (doses, donor samples) and
`src/institution_access.js` (scoped, expiring grants).

## The core idea: identity is layers, and each check reads some of them

Polyjuice copies a body. It does not copy anything else. Every gate, person and
ward checks a particular set of layers, so whether a disguise works is a
question about which layers that check reads (AD38), not a "disguised" flag.

| Layer | What Polyjuice does | Canon anchor (books; wiki "Polyjuice Potion", rev 2020244) |
|---|---|---|
| Face, body, voice | Copied exactly, for about an hour a dose | Crabbe and Goyle, Chamber of Secrets ch. 12 |
| Clothes and fit | Not copied; you need the donor's clothes or robes that fit | Same chapter: robes and shoes no longer fit |
| Eyesight and own body quirks | Partly the donor's; your glasses still on your nose now blur | Same chapter |
| Duration | About an hour, then a gradual change back; repeat doses extend it | Crouch Jr. drinking hourly, Goblet of Fire ch. 35 |
| Knowledge, habits, manners | Not copied: you must act the person | Ministry infiltration, Deathly Hallows ch. 12-13 |
| Credentials: wand, badge, keys, vault rights | Not copied; carried items still belong to you | Wand weighing at the Ministry, Order of the Phoenix ch. 7; Bellatrix's wand at Gringotts, Deathly Hallows ch. 26 |
| Name and true self | Unchanged; some magic reads it straight through | Marauder's Map shows Crouch, Goblet of Fire ch. 25 |
| Species | Human hair only for a clean result; animal hair leaves animal features | Hermione, Chamber of Secrets ch. 12-13 (built: round 2 of the sibling palette) |
| Enchantment itself | Washed off by counter-magic | Thief's Downfall, Deathly Hallows ch. 26 |

## The palette

### A. What a dose buys

| Code | Mechanism | Note |
|---|---|---|
| PJI1 | **A disguise is a timed state**: a dose gives `{as: donorId, until}`; one more dose extends it; it ends with a visible change back | The bench already makes three doses per brew; the clock is the game clock |
| PJI2 | **The change back is announced** (AD50): a warning near the end, and the reveal is witnessed by whoever is present | Like a terminal affliction stage, it has two exits: drink again, or get out of sight |
| PJI3 | **Supply is the real cost**: each dose needs donor hair; a long impersonation needs a living, held or cooperative donor | The Moody plan: a captive in a trunk. A darker life, never a menu option |
| PJI4 | **Clothes, size and props are a separate prep step**: the wrong robes, height or glasses are cues observers can read | Cheap original flavour; feeds PJI8 |
| PJI5 | **Seven Potters**: one donor, many drinkers; a decoy plan | Deathly Hallows ch. 4; a party or companion use |
| PJI6 | **Taste and colour show the donor** (a sign of how "good" the person is, in canon flavour) | Cosmetic tell; can be a clue in a mystery life |

### B. Being believed: the d20 disguise model, kept in mind

The d20 sites already solved "how hard is it to pass as someone". Polyjuice
removes the *appearance* roll and leaves the *acting* roll.

| Code | Mechanism | d20 source idea |
|---|---|---|
| PJI7 | **Appearance check skipped**: Polyjuice is a perfect physical match, so no disguise roll for looks | PF1 Disguise skill penalties (sex, race, age) and PF2 Impersonate apply to non-magical disguise only |
| PJI8 | **Acting check by familiarity**: when someone interacts, roll your acting against their perception, harder the better they know the donor (stranger, recognises on sight, friend, intimate) | PF1 Disguise: observers who know the person get +4/+6/+8 |
| PJI9 | **Only checked when it matters**: passing in a crowd needs no roll; conversation, a request or odd behaviour triggers one | PF1: checks happen on attention, not every round |
| PJI10 | **Degree of success**: critical success (they trust you more), success (passes), failure (suspicion, a question you must answer), critical failure (exposed) | PF2 degrees; reuse `degreeOf` from the affliction seam |
| PJI11 | **Suspicion is a scoped fact, not a global alarm**: it lives with that observer or group and spreads only by a real report route | Matches the witness-scoped exposure rule in rivals and identities |
| PJI12 | **True sight and identity readers**: some things ignore appearance entirely | PF2 *true seeing*, *see the unseen*; in HP the Marauder's Map, the Thief's Downfall, possibly Dumbledore's own judgment |
| PJI13 | **Disguise magic families beside Polyjuice**: illusion (seen through on inspection), shapechange (real body), possession and mind control (Imperius: the real person acts) | PF2 *illusory disguise*, *humanoid form*, PF1 *alter self*, hat of disguise; HP Metamorphmagus, Imperius |

### C. Getting into places: what each gate reads

| Code | Gate | Layers it reads | Note |
|---|---|---|---|
| PJI14 | A guard, receptionist or teacher | Face, manner, knowledge | PJI8 familiarity applies |
| PJI15 | Ministry entrance | Face plus registered wand (wand weighing), badge or visitor token | DH used employees' faces and their routes in; a foreign wand is a cue |
| PJI16 | Gringotts vault | Face, the owner's wand as proof, the goblin's own suspicion, then the Thief's Downfall | Credentials and enchantment layers, both canon |
| PJI17 | Hogwarts grounds, dormitories, Slytherin common room | Password and face; nothing reads the true self | CoS: the password is a separate lock |
| PJI18 | Age Line | True age, not appearance | GoF: the Ageing Potion fails; a reason, not a ban |
| PJI19 | Fidelius-hidden place | Being told the secret by the Keeper; looks are irrelevant | Shows that some places are about knowledge, not identity |
| PJI20 | Wards keyed to blood or a named person | The true self | A Polyjuiced intruder is still themself to such a ward |
| PJI21 | Rights, not just doors: a vault, a signature, a vote, a contract | Who the record says owns it | Passing as someone opens what they could do in person, and leaves a trail in their name |

`institution_access.js` already models grants. PJI14-21 suggest one more
input: a gate check reads a **presented identity** (who you appear to be, what
you carry, what you know) beside the grant. The grant belongs to the donor; the
check decides whether the gate believes you are the donor.

### D. Consequences

| Code | Mechanism | Note |
|---|---|---|
| PJI22 | **Deeds land on the donor's name** until someone finds out; the real donor may be blamed or warned | The best story engine in the set |
| PJI23 | **The donor exists**: they may turn up, notice missing hair, or be somewhere else at the same time | Cattermole's wife in the Ministry, DH ch. 13 |
| PJI24 | **Law**: Polyjuice brewing and use is restricted; impersonating an official is a crime with a real response, not an automatic loss | Ties to the bench's existing notice and lost-standing rules |
| PJI25 | **Exposure ladder**: suspicion, a test question, a revealing spell, arrest or a fight; each step has an exit | AD50 announced stages, applied to social risk |
| PJI26 | **Mishaps**: wrong hair (animal, built), stale or degraded doses (shorter or partial change), a hair that is not what you thought it was | The bench already has degraded and failed outcomes |

### E. Lives and worlds

| Code | Use | Note |
|---|---|---|
| PJI27 | Student mystery: CoS-style common room visit to ask a question | A first, small, safe slice |
| PJI28 | Auror or Death Eater infiltration life | Long impersonation with supply chain (PJI3) |
| PJI29 | Heist: the Gringotts route with layered checks | Shows every layer in one place |
| PJI30 | Other worlds: LOTM Faceless pathway and persona digestion, Mother of Learning's shapeshifting and soul magic, D&D *alter self* and *disguise self* | Same layer table, different defaults per world |

## ACT NOW (done this round)

- Saved this palette and linked it from the sibling afflictions palette and
  the writeup register. No runtime change.

## ACCOUNT FOR NOW

- **PJI-N1.** Keep looks, credentials, knowledge and true self as separate
  facts in any disguise state; never one "disguised" boolean.
- **PJI-N2.** A disguise check reads the observer's familiarity with the donor,
  so relationship data must be able to answer "how well does X know Y".
- **PJI-N3.** Deeds done in disguise record both who acted and whose name it
  was done under, so PJI22 can later resolve blame.
- **PJI-N4.** Persistence: a disguise is a small timed record in the HP slice;
  it needs a migration decision only when it lands in a save.

## LATER / DELEGATE

| Code | Work | Level | Effort | Done check |
|---|---|---|---|---|
| PJI-L1 | First slice: drink a dose from the bench to become a donor for an hour, then talk past one gate (PJI1, PJI2, PJI7-10, PJI14, PJI17) | Runtime slice | Medium | Browser run: drink, pass the gate, watch the change-back warning, save, reload, import |
| PJI-L2 | `presented identity` input on institution gates (PJI14-21) | Seam | Small to medium | Focused test: the same grant opens for the donor and the disguised player, and not for a check that reads the true self |
| PJI-L3 | Suspicion as scoped witness facts with report routes (PJI11, PJI25) | Runtime | Medium | One observer's suspicion does not reach another without a report |
| PJI-L4 | Blame on the donor's name (PJI22, PJI23) | Runtime | Medium | A deed done in disguise appears in the donor's record |
| PJI-L5 | ~~Collect the d20 rule texts for disguise, illusion and the affliction families~~ Done 2026-11-03, see the [collection receipt](../research/d20/D20_RULES_COLLECTION_2026-11-03.md). Next: fold PF2 Impersonate, Seek and the disguise spells into PJI7-13 with citations | Research | Small | Each PJI7-13 row cites a collected record |

## Collecting the wikis

- **Harry Potter Wiki.** Already collected as a full dump (archive fingerprint
  `34b0eeec…`, 2026-10-10) with a frozen manifest in
  `docs/research/power-systems/wiki-digests/full-dumps/harrypotter_SOURCES.json`.
  The manifest lists the Polyjuice page and its related pages ("Botched
  Polyjuice Potion victims", "Percival Graves's Polyjuice flask", "Polyjuice
  Potion No. I"). The archive itself is not on this machine any more (the
  path in `DUMPS.json` is missing). Fetching it again from the
  public Fandom dump is one 54 MB download, not a crawl.
- **The two d20 sites (done 2026-11-03, Weibao's request).** d20pfsrd through
  the polite transport, Archives of Nethys in the browser after the transport
  was refused; scope, counts and checks are in the
  [collection receipt](../research/d20/D20_RULES_COLLECTION_2026-11-03.md).
  PJI-L5 is covered by it.
