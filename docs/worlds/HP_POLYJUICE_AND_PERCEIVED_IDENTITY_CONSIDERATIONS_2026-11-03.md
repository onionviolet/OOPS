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
| PJI7 | **Appearance check skipped**: Polyjuice is a perfect physical match, so no disguise roll for looks | PF2 Impersonate ([Actions ID 46](https://2e.aonprd.com/Actions.aspx?ID=46)) needs a disguise kit and 10 minutes for a specific person; Polyjuice replaces the kit, not the acting |
| PJI8 | **Acting check by familiarity**: when someone interacts, roll your acting against their perception, harder the better they know the donor | PF2 Impersonate: the GM may give observers a circumstance bonus by how well they know the person, with no fixed number, so the size is a per-world dial. PF1's Disguise familiarity table is waiting on the d20pfsrd collection; cite it once it is in |
| PJI9 | **Only checked when it matters**: passing by needs no roll; observers catch you only if they actively look (Seek) or you interact with them | PF2 Impersonate: detection needs a Seek, or a secret Deception check when you interact |
| PJI10 | **Degree of success**: critical success (they trust you more), success (passes), failure (they know you are not who you claim), critical failure (they also recognise who you really are, if they would know you) | PF2 Impersonate's own degrees; reuse `degreeOf` from the affliction seam |
| PJI11 | **Suspicion is a scoped fact, not a global alarm**: it lives with that observer or group and spreads only by a real report route | Matches the witness-scoped exposure rule in rivals and identities; PF2 Lie ([ID 47](https://2e.aonprd.com/Actions.aspx?ID=47)) rolls once against each listener's own Perception DC |
| PJI12 | **True sight is a contest, not a switch**: a revealing effect tries to see through a disguise and, if it succeeds, sees the true form without ending it | PF2 *true seeing* ([Spells 344](https://2e.aonprd.com/Spells.aspx?ID=344)) and *truesight* ([1727](https://2e.aonprd.com/Spells.aspx?ID=1727)) roll a secret counteract check; *see the unseen* ([1663](https://2e.aonprd.com/Spells.aspx?ID=1663)) gives +2 to disbelieve illusions. In HP the Marauder's Map is the absolute case and the Thief's Downfall ends the effect outright |
| PJI13 | **Disguise magic families beside Polyjuice**: illusion (seen through on inspection), shapechange (real body), possession and mind control (Imperius: the real person acts) | PF2 *illusory disguise* ([159](https://2e.aonprd.com/Spells.aspx?ID=159)) and *veil* ([355](https://2e.aonprd.com/Spells.aspx?ID=355)) hide an identity but cannot copy a specific person or the voice, scent or mannerisms; *humanoid form* ([153](https://2e.aonprd.com/Spells.aspx?ID=153)) changes kind but no statistics or abilities. Polyjuice beats both on a specific face and voice; HP Metamorphmagus, Imperius |

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

### F. Round 2: what the collected d20 rules add (2026-11-03)

| Code | Mechanism | Source record |
|---|---|---|
| PJI31 | **Hiding who you are is easier than being someone**: an anonymous disguise needs only to pass, a specific impersonation must survive people who know the donor | PF2 *illusory disguise* and *veil* vs Impersonate; *face in the crowd* ([421](https://2e.aonprd.com/Spells.aspx?ID=421)) gives +2 to go unnoticed in a crowd |
| PJI32 | **Exposure is not identification**: being caught as "not the donor" and being recognised as yourself are separate results | PF2 Impersonate critical failure only; feeds PJI25 |
| PJI33 | **Behaviour change re-opens the check**: a passed check holds until you act out of character | PF2 Impersonate: "a new check if your behavior changes" |
| PJI34 | **Senses beyond sight**: voice, scent and manner are layers too; a dog, a house-elf or a familiar may read scent where people read faces | PF2 illusion disguises leave voice, scent and mannerisms; whether Polyjuice copies scent is not stated, so it is a per-world dial |
| PJI35 | **Hiding the magic itself**: a detection effect can read that a disguise is magical even when it cannot see through it; a counter-trick masks the aura | PF2 *disguise magic* ([1491](https://2e.aonprd.com/Spells.aspx?ID=1491)); HP analogue: a Sneakoscope or a suspicious teacher noticing something is off |
| PJI36 | **Stealing an identity as an attack**: taking someone's face and voice while silencing them is one hostile act, not two | PF2 mythic *seize identity* ([MythicSpells 2161](https://2e.aonprd.com/MythicSpells.aspx?ID=2161)); the canon version is a captive donor in a trunk (PJI3) |

## ACT NOW (done this round)

- Saved this palette and linked it from the sibling afflictions palette and
  the writeup register. No runtime change.
- Round 2 (same day): folded the collected Pathfinder 2e records into PJI7-13
  with citations and added PJI31-36. PF1's Disguise familiarity numbers wait
  for the d20pfsrd collection; PJI8 no longer states them.

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
| PJI-L5 | ~~Collect the d20 rule texts for disguise, illusion and the affliction families~~ Done 2026-11-03, see the [collection receipt](../research/d20/D20_RULES_COLLECTION_2026-11-03.md). PF2 records folded into PJI7-13 and PJI31-36 (round 2); PF1 Disguise table still to cite | Research | Small | PJI8 cites the PF1 familiarity table |

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
