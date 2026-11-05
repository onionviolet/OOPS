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

Treat Polyjuice body/appearance changes separately from knowledge, behavior,
carried credentials and recorded rights. A particular gate, person or ward
reads its own evidence and mechanisms (AD38); a disguise flag alone does not
settle every check. Exact HP magical checks still need their own source.

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
| PJI1 | **A disguise is a timed state**: a proposed dose gives `{as: donorId, until}`; re-dosing extension would need a new consumer because the current drink path rejects an active effect; it ends with a visible change back | The bench already makes three doses per brew; the clock is the game clock |
| PJI2 | **Proposed change-back warning** (AD50): warn near the end, then resolve who can actually witness the reveal | Like a terminal affliction stage, it has two exits: drink again, or get out of sight |
| PJI3 | **Supply is the real cost**: each dose needs a sample with provenance; sustained use needs enough stock, which may be stored, cooperative or coercively obtained under the particular story | The Moody plan is a captive-donor example; a world-specific story can account for coercion and its consequences |
| PJI4 | **Clothes, size and props are a separate prep step**: the wrong robes, height or glasses are cues observers can read | Cheap original flavour; feeds PJI8 |
| PJI5 | **Seven Potters**: one donor, many drinkers; a decoy plan | Deathly Hallows ch. 4; a party or companion use |
| PJI6 | **Taste and colour show the donor** (a sign of how "good" the person is, in canon flavour) | Cosmetic tell; can be a clue in a mystery life |

### B. Being believed: the d20 disguise model, kept in mind

The d20 sites already solved "how hard is it to pass as someone". Polyjuice
removes the *appearance* roll and leaves the *acting* roll.

| Code | Mechanism | d20 source idea |
|---|---|---|
| PJI7 | **Appearance check skipped**: Polyjuice is a perfect physical match, so no disguise roll for looks | PF2 Impersonate ([Actions ID 46](https://2e.aonprd.com/Actions.aspx?ID=46)) needs a disguise kit and 10 minutes for a specific person; Polyjuice replaces the kit, not the acting |
| PJI8 | **Acting check by familiarity**: when someone interacts, roll your acting against their perception, harder the better they know the donor | PF2 Impersonate leaves familiarity adjustment to the GM. The now-collected Paizo [PF1 Disguise table](https://www.d20pfsrd.com/skills/disguise/) uses +4/+6/+8/+10 for recognition, associates, close friends and intimate familiarity, and treats those viewers as suspicious. These are edition-specific examples, not fixed HP numbers |
| PJI9 | **Check when the evidence warrants it**: Seek and direct interaction are common triggers; a familiar observer can justify a check even without direct interaction | PF2 Impersonate's usual detection triggers and familiarity exception |
| PJI10 | **Degree of success**: success passes, failure exposes the impersonation, and critical failure also identifies you if the observer would know you. The collected action has no separate critical-success trust bonus | PF2 Impersonate's listed outcomes; a shared degree helper would still need this action's own outcome mapping |
| PJI11 | **Suspicion is a scoped fact, not a global alarm**: it lives with that observer or group and spreads through an actual report or other supported information route | Matches the witness-scoped exposure rule in rivals and identities; PF2 Lie ([ID 47](https://2e.aonprd.com/Actions.aspx?ID=47)) makes one shared Deception roll compared against each listener's own Perception DC |
| PJI12 | **True sight is a contest, not a switch**: a revealing effect tries to see through a disguise and, if it succeeds, sees the true form without ending it | PF2 *true seeing* ([Spells 344](https://2e.aonprd.com/Spells.aspx?ID=344)) and *truesight* ([1727](https://2e.aonprd.com/Spells.aspx?ID=1727)) roll a secret counteract check; *see the unseen* ([1663](https://2e.aonprd.com/Spells.aspx?ID=1663)) gives +2 to disbelieve illusions. In HP the Marauder's Map is the absolute case and the Thief's Downfall ends the effect outright |
| PJI13 | **Disguise magic families beside Polyjuice**: illusion (seen through on inspection), shapechange (real body), possession and mind control (Imperius: the real person acts) | PF2 *illusory disguise* ([159](https://2e.aonprd.com/Spells.aspx?ID=159)) and *veil* ([355](https://2e.aonprd.com/Spells.aspx?ID=355)) at their base ranks hide identity without voice/scent or specific-person copying; heightened ranks add voice/scent and later specific-person appearance. Mannerisms still need acting; *humanoid form* ([153](https://2e.aonprd.com/Spells.aspx?ID=153)) at base rank changes kind without granting its special abilities; higher ranks add specified senses or size/reach effects. Compare exact rank and source before judging a specific face/voice capability; HP Metamorphmagus, Imperius |

### C. Getting into places: what each gate reads

| Code | Gate | Layers it reads | Note |
|---|---|---|---|
| PJI14 | A guard, receptionist or teacher | Face, manner, knowledge | PJI8 familiarity applies |
| PJI15 | Ministry entrance | Face plus registered wand (wand weighing), badge or visitor token | DH used employees' faces and their routes in; a foreign wand is a cue |
| PJI16 | Gringotts vault | Face, the owner's wand as proof, the goblin's own suspicion, then the Thief's Downfall | Credentials and enchantment layers, both canon |
| PJI17 | Hogwarts grounds, dormitories, Slytherin common room | Password and face in the cited common-room example; other ward checks need their own source | CoS: the password is a separate lock |
| PJI18 | Age Line | Proposed age-evidence check; exact Polyjuice interaction unresolved | GoF shows an Ageing Potion failure, which does not independently settle every physical-transformation case |
| PJI19 | Fidelius-hidden place | Being told the secret by the Keeper; looks are irrelevant | Shows that some places are about knowledge, not identity |
| PJI20 | Wards keyed to blood or a named person | The particular blood/person mechanism, still to qualify | Do not infer all such wards read an unchanged identifier; source and mechanism decide |
| PJI21 | Rights, not just doors: a vault, a signature, a vote, a contract | Who the record says owns it | Passing as someone opens what they could do in person, and leaves a trail in their name |

`institution_access.js` already models grants. PJI14-21 suggest one more
input: a gate check reads a **presented identity** (who you appear to be, what
you carry, what you know) beside the grant. A proposed check would distinguish the recorded grant subject from the
apparent claimant and actual credentials. Belief does not transfer ownership
or prove a valid command authorization; the particular gate decides what its
mechanism accepts. The existing helper supplies grant status, not this check.

### D. Consequences

| Code | Mechanism | Note |
|---|---|---|
| PJI22 | **Deeds land on the donor's name** until someone finds out; the real donor may be blamed or warned | The best story engine in the set |
| PJI23 | **The donor exists**: they may turn up, notice missing hair, or be somewhere else at the same time | Cattermole's wife in the Ministry, DH ch. 13 |
| PJI24 | **Local law and policy**: qualify the particular institution and misuse rather than assuming a general brewing/use ban; impersonation can provoke a supported response with a reason and an exit | Ties to the bench's existing notice and lost-standing rules |
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
| PJI31 | **Hiding who you are is easier than being someone**: an anonymous disguise can hide a name; a specific impersonation must survive people who know the donor | Base-rank PF2 *illusory disguise* and *veil* vs Impersonate; heightened specific-person options need separate comparison; *face in the crowd* ([421](https://2e.aonprd.com/Spells.aspx?ID=421)) gives +2 to go unnoticed in a crowd |
| PJI32 | **Exposure is not identification**: being caught as "not the donor" and being recognised as yourself are separate results | The collected PF2 Impersonate critical-failure clause; feeds PJI25 |
| PJI33 | **Behaviour change re-opens the check**: a passed check holds until you act out of character | PF2 Impersonate: "a new check if your behavior changes" |
| PJI34 | **Senses beyond sight**: voice, scent and manner are layers too; a dog, a house-elf or a familiar may read scent where people read faces | The cited base-rank PF2 illusion disguises leave voice, scent and mannerisms; heightened versions add voice/scent; whether Polyjuice copies scent is not stated, so it is a per-world dial |
| PJI35 | **Hiding the magic itself**: a detection effect can read that a disguise is magical even when it cannot see through it; a counter-trick masks the aura | PF2 *disguise magic* ([1491](https://2e.aonprd.com/Spells.aspx?ID=1491)); HP analogue: a Sneakoscope or a suspicious teacher noticing something is off |
| PJI36 | **Stealing an identity as an attack**: taking someone's face and voice while silencing them is one hostile act, not two | PF2 mythic *seize identity* ([MythicSpells 2161](https://2e.aonprd.com/MythicSpells.aspx?ID=2161)); the canon version is a captive donor in a trunk (PJI3) |

## ACT NOW (done this round)

- Saved this palette and linked it from the sibling afflictions palette and
  the writeup register. No runtime change.
- Round 2 (same day): folded the collected Pathfinder 2e records into PJI7-13
  with citations and added PJI31-36. B602 later reads the collected Paizo PF1
  Disguise page, adds its edition-qualified table and corrects PF2 outcome,
  roll and heightened-rank claims. No runtime implementation follows.

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
| PJI-L5 | ~~Collect the d20 rule texts for disguise, illusion and the affliction families~~ Done 2026-11-03, see the [collection receipt](../research/d20/D20_RULES_COLLECTION_2026-11-03.md). PF2 records folded into PJI7-13 and PJI31-36 (round 2); PF1 Disguise table cited in PJI8 by B602 from the locally collected Paizo page | Research | Small | Collection/citation complete; gameplay proposals remain unimplemented by this pass |

## Collecting the wikis

- **Harry Potter Wiki.** Already collected as a full dump (archive fingerprint
  `34b0eeec…`, 2026-10-10) with a frozen manifest in
  `docs/research/power-systems/wiki-digests/full-dumps/harrypotter_SOURCES.json`.
  The manifest lists the Polyjuice page and its related pages ("Botched
  Polyjuice Potion victims", "Percival Graves's Polyjuice flask", "Polyjuice
  Potion No. I"). The archive itself is not on this machine any more (the
  the path in `DUMPS.json` was missing at the recorded check). Current payload
  availability and any reacquisition need their own verified route and scope;
  this palette does not authorize another download.
- **The two d20 sites (done 2026-11-03, Weibao's request).** d20pfsrd through
  the polite transport, Archives of Nethys in the browser after the transport
  was refused; scope, counts and checks are in the
  [collection receipt](../research/d20/D20_RULES_COLLECTION_2026-11-03.md).
  PJI-L5 is covered by it.


## Content reconciliation B602: source corrections and runtime boundaries

F1: Full content review covers PJI1–PJI36, PJI-N1–N4, PJI-L1–L5, both rounds, all identity/gate/rights/consequence rows and collection-status claims. Appearance, actual body/function, behavior/knowledge, carried credentials, record rights, actual actor and observer belief remain useful distinct layers. Exposure that someone is not the donor is separate from recognizing the actor; detection is separate from ending an effect. A gate accepting a presentation does not transfer legal ownership or make every other observer believe it.

F2: Selected local collected source records directly qualify PJI8–PJI13/PJI31–PJI35. PF2 action46 lists success/failure/critical failure without a distinct critical-success trust effect; familiarity can justify a check even without direct interaction. Action47 uses one shared lie roll against listener-specific DCs. Illusory Disguise and Veil base restrictions differ from their heightened voice/scent/specific-person capabilities; Humanoid Form's higher ranks add sensory or size/reach effects, so no-statistics language cannot cover every rank. True Seeing/Truesight use a seeing-through counteract rather than dispelling the disguise; aura masking has its own target/rank/disbelief rules. These are bounded edition records, not rules automatically adopted for HP or every world.

F3: The PF1 Paizo Disguise page was collected via the browser route on November4 and is available locally; its familiarity bonuses are4/6/8/10 and it treats known-person observers as suspicious. This resolves PJI8's waiting-for-table note and the research part of PJI-L5. It does not clear the transport's separate stop state or authorize refetching. Collection is not implementation. Original premature scope/publisher/retrieval statements retain their own dated receipt history.

F4: Current source read: hp_brewing_state.js selected expiry and drink paths consume a dose and sample, create an effect with donor/end time, and reject drinking while an effect or condition exists. Re-dosing extension and advance change-back warning are still proposals at these inspected seams; expiry aftermath is not a proved per-observer witnessed reveal. institution_access.js defines/scopes grant status; its caller in book_world_mol_access.js reads a player's permit and retained skills. It is not a generalized grant-holder/presented-identity authorization check. PJI-L2 must test the actual command consumer, credentials, observer result and permitted scope rather than handing another actor's grant to the status helper. No source behavior was changed or exercised.

F5: Narrow blanket claims rather than invent canon. Common-room password examples do not establish that all Hogwarts wards ignore true identity. The Ageing Potion example does not independently settle Polyjuice versus every Age Line. Blood/named-person credentials require the particular check's actual mechanism and source, not a universal true-self bypass list. The general claim that brewing/use is illegal lacks a specific local institutional authority in this palette, so local policy, misuse and response remain separately proposed. Sample stock/provenance and acting costs need not require a continuously captive or present donor; stored and cooperative supply are possible dials. HP chapter/wiki anchors remain attributed, not freshly reread novels or authenticated whole-canon rules.

F6: Preserve the broader uses: many-drinker decoys, practical clothing/prop preparation, anonymous versus specific impersonation, contextual sensory clues, aura masking, donor simultaneous presence and attributed blame, meaningful inquiry/exposure/escape and source-specific alternate transformations. No global suspicion, automatic rights transfer, inevitable arrest/fight or universal ban follows. PJI-N1–N4 remain proposed state/evidence/persistence requirements, and PJI-L1–L4 remain bounded future consumers with ordinary use, interruption/expiry, supported decline and save/reload/import proof. No new runtime schema, gameplay/build/browser/test result, private save, source acquisition, deletion, relocation, commit or push occurs.
