# C12: cheats that reveal companion states

## CHECKPOINT

2026-10-14. C12 design tranche complete: seven reveal rungs, 26 library-shaped
cards, desktop surface fit and a source-read state map. Only this file and
[C12_REPORT](C12_REPORT.md) are owned writes. All new mechanics are INFERRED
considerations, not selected specs or implemented gameplay. No source, build,
test, save, sealed file, commit or push changed. Resume from the state map and
report, then recheck live owners before any separately authorized implementation.

## Authority, scope and evidence

Weibao: “Cheats that would show stuff like these and more?” The
[root palette](../../../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md)
owns C1-C7, C8/O4, AF/DD, R103, EH, FA1, FD, J36 and J40. Its rounds 6-8
supply the ordinary cue route. [BOND_CRAFT BX08](BOND_CRAFT.md) rejects automatic
omniscience from closeness. C12 proposes explicitly acquired, labelled and
costed powers which may pierce that limit. Neither a high affection value nor
a panel unlock silently grants them. [PROJECT](../../../../PROJECT.md#standing-priorities-and-document-authority)
and [USER_VISION](../../../USER_VISION.md#standing-ui-priority-2026-10-13) remain
live authority; first milestone stays one realm and one prestige layer.

SHOWN means inspected text/source at a stated locator, not browser proof.
STATED means an owner's direction. INFERRED means this design or an unbuilt
state/reader. No external lore claim or unchecked MEMORY supports these cards.
Library families are vocabulary, not claims that their cited franchise examples
already implement these particular animal powers.

**Default + Dial + Reasonably:** ordinary play shows cues and voluntary accounts;
a held cheat adds only its named fields, fidelity, range and recipients. Worlds
can make appraisal commonplace, rare, invasive, freely shared or truly omniscient.
An omniscient variant declares its domain and price; it does not silently replace
all other cards. Reading changes knowledge, not consent, ownership, command rights,
health, items or a companion's wants. Animal affection is not a romance verdict.

The existing [PRESENTATION](PRESENTATION.md) supplies cue homes and restraint.
[MICRO_BEHAVIOUR](MICRO_BEHAVIOUR.md) arrived during final checking and was read
then: MB03-MB13 support context, baseline and distinct bond meanings; the cue
bank and fantasy FX01-FX06 constrain RF0 copy. It remains grounding, not runtime
state. C9 species grounding should inform authored cues before they ship. No real-world diagnosis is inferred
from a fictional cue. Playing AS a companion belongs to the
[nonhuman body owner](../../../worlds/NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md).

## RF: reveal fidelity ladder

All rows INFERRED. RF is a companion output ladder, not a second appraisal rank.
[MEANS_AND_APPRAISAL](../../../MEANS_AND_APPRAISAL.md:88) AP0-AP9 separates depth,
precision and domain: AP3 can measure satiety yet fail at AP8 intent; a specialist
may skip levels. RF3 does not turn contract terms C5 or a channel C6 into numbers.

| Code / rung | Cheats granting it | Output and cost | How it can be wrong | What repeated use can flatten |
|---|---|---|---|---|
| RF0 Cue only | RC01 Cue Lantern; ordinary unpowered observation also works | A noticed act, sound or posture; attention/time, active lens fuel if used | Bad angle, unfamiliar body, ambiguous cue; no mood verdict | Noticing for yourself; constant highlighting turns company into alerts |
| RF1 Named mood | RC02 Empathy Link, RC15 Pack Weather, RC20 Reverse Empathy | “Uneasy”, attributed to a channel; mana, sensory overload, proximity | Mixed moods, projection, foreign minds, deliberate masking | Learning its manner and tolerating ambiguity |
| RF2 Labelled need | RC03 Need Line, RC04 Pet Appraisal, RC06 Bestiary, RC10 Beast-Speech | “Needs rest” or “wants its herd”; sample, focus, food offered for a conversation | Need misclassification, species priors, a partial/false answer | Trying small care choices and hearing its own answer |
| RF3 Exact track / field | RC05 Bond Caliper, RC07 Pet Window, RC09 Pulse Eye, RC14 Uneven Mirror | Direction, scale, as-of time, precision; calibration, charges or upkeep | Stale measurement, counterfeit lens, wrong target/direction, ward; exact observed value is not future compliance | Relationship as lived history; reducing care to meter farming |
| RF4 Cause history | RC11 Habit Root, RC12 Memory Replay, RC13 Day's Eye, RC23 Life Album | Recorded events or remembered account; replay fuel, anchor, study time | Missing record, false memory, remembered interpretation mistaken for cause | Learning a past through scenes; turning every habit into a solved dossier |
| RF5 Private thoughts | RC16 Thought Door, RC17 Dream Bridge, RC18 Soul Sight, RC19 Want Atlas | Current thoughts/imagery or hidden motive; strain, negotiated access or a detectable breach | Language, self-deception, confabulation, dream symbolism, soul/body blind spots | Surprise, voluntary confession, private life and uneven love |
| RF6 Future forecast | RC24 Tomorrow Paw, RC25 Branch Kennel, RC26 Fate Thread | Conditional odds, branch or fate claim; questions, time, fuel, exposed mark | Unsupported model, concealed means, changed plans, timeline divergence | Rescue tension, trust under uncertainty, unplanned shared discoveries |

**Fidelity is a set of grants, not a compulsory climb.** A medical eye can be
RF3 for health and RF0 for affection. Speech reaches RF4 only when the creature
chooses to tell its past. A dream is RF5 access with poor factual precision.
Costs below are illustrative qualitative currencies, not selected numerical
balance. Zero-fuel passive worlds are possible; attention, range or detectable
use can supply their tradeoff. Reopening a retained reading is not a fresh scan.

## CS: card shape and shared constraints

These 26 design cards cover all ten fields in [CHEAT_LIBRARY](../../../CHEAT_LIBRARY.md:50):
identity/placement, loop, hooks, dials, growth, interactions, observers, variants,
holders and sources. Each has a stable RC code, family, verbs and UI home.

**CS1 Schema [SHOWN].** `src/cheat_cards.js:2-5,28-44` admits exactly
`{id,family,name,ui,terms,hooks,state,stages,observers,sources}`. It validates JSON,
not these proposed verbs. `backing`, `scope`, `grants` and `verbs` from the wider
library design are not admitted top-level keys today. These Markdown cards are
not importable runtime definitions. A future author can map placement and verbs
into a separately validated per-family contract; accepting JSON does not execute it.
The current allowed UI names do not include our new records surfaces.

**CS2 Acquisition [STATED/INFERRED].** Keep AQ1-AQ14 open, with per-world rarity.
AQ1 optional start need not be full strength: a dormant RF0/RF1 version can grow
through use. AQ2 random starts, AQ3 awakenings, AQ4 research, AQ5 teaching,
AQ6 finds, AQ7 bargains, AQ8 theft/harvest, AQ9 inheritance, AQ10 fusion,
AQ11 deeds, AQ12 contagion and AQ13 mistaken delivery supply different histories.
AQ14 debug is labelled and separate from natural acquisition. Suggested routes
on each card are examples, not gates. Theft may yield a stolen reader without
its owner's calibration, target mark or knowledge.

**CS3 Placement [INFERRED].** Every card defaults to one supported present target
through its named means. Range, supported species, bodies, rank ceiling, privacy,
refresh price, duration, resistance and sealed-secret reach are world dials.
Foreign worlds return unknown outside supported fields; no automatic cosmological
translation. NPC, rival, wild beast and companion holders use the same rules.
Sources below are local design sources with explicit evidence tags, not a claim
that a book grants this exact card. Terms use currently admitted labels.

**CS4 Growth and UI [INFERRED].** Stages unlock new verbs or domain access before
merely improving a number. A quiet cheat gets no empty panel. Card UI fit is a
proposal; the CH1 stage-0 panel stays informational. No acquisitions, powers or
new panels are created by these docs.

## RC: 26 companion reveal cards

RC codes here are local to C12. Cite them as C12/RC01 etc. outside this file;
C9 uses its own RC reconciliation codes.

All card mechanics below are INFERRED. Each **Sources** cell points to SHOWN
local proposal text, not implemented evidence. E codes resolve to the state map.
Hooks are proposed subscriptions and grant no runtime today.

### RC01: Cue Lantern

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-01`; **Appraisal eye**; a fitted lens; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Notice, compare successive cues; lens charge and study time; on-observe |
| State / observation scope | RF0; E1/E2/E5 visible acts via sight/sound |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Notice one cue -> compare contexts -> distinguish your old observations |
| UI panel | Inline cue and focusable appraisal-lens detail |
| Interactions / errors / overuse | Poor visibility misses cues; a highlighted limp is not a diagnosis. Overuse makes ordinary company an alert stream. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Visible lens glow; player/NPC/item holders; AQ4/AQ6 |
| Variants / sources | Quiet Lens needs no workspace panel; source: root DA/EH/ET, PRESENTATION P2/P3; all exact card mechanics INFERRED. |

### RC02: Empathy Link

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-02`; **Companion or resident spirit + analysis**; a resonant bond source; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Attune, sample, separate your feeling from its feeling; mana and overload; on-observe |
| State / observation scope | RF1; E3 moods and E8 directed felt affection through emotion resonance |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Feel broad valence -> name mixed moods -> deliberately share a feeling back |
| UI panel | Inline attributed mood; appraisal-lens on request |
| Interactions / errors / overuse | Projection or wards distort affect; affection grants no memory access. Overuse erases reading its behavior. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Subject feels attunement; either partner may hold; AQ3/AQ5/AQ10 |
| Variants / sources | Open Circle includes wild animals at greater overload; source: root J29/C4/C6/FA1; all exact card mechanics INFERRED. |

### RC03: Need Line

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-03`; **Absolute knack**; an innate narrow insight; matured. Home/outside scope follows CS3. |
| Loop / verbs / resources | Ask, pin one need, clear the reading; attention and narrow one-target scope; on-observe |
| State / observation scope | RF2; E1/E4/E7 highest current need or want via semantic need sense |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | One need -> ask competing needs -> distinguish bodily need from personal want |
| UI panel | One inline line; status-window section if a held system grants it |
| Interactions / errors / overuse | A correct “wants freedom” has no implied way to satisfy it; translating needs into chores flattens care. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Aura detectable to peers; player/NPC/companion holders; AQ1/AQ3/AQ11 |
| Variants / sources | Literal Want may be truthful with no helpful advice; source: root J33/C8/O4; all exact card mechanics INFERRED. |

### RC04: Pet Appraisal

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-04`; **Appraisal eye**; a creature specialist eye; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Inspect, compare, calibrate; samples and focus; on-observe |
| State / observation scope | RF2->RF3; E1/E2 bounded care/vitals via body appraisal |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Label satiety -> show a band -> show exact supported satiety and stamina |
| UI panel | appraisal-lens; optional Pet Window row |
| Interactions / errors / overuse | Foreign physiology and stale samples mislead; never substitutes satiety for affection. Overuse makes each greeting an audit. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Active scan sensed by sensitive targets; player/healer/rival; AQ4/AQ5/AQ7 |
| Variants / sources | Wild Appraisal trades individual detail for broader species coverage; source: root needs/EH, Means AP3/AP6; all exact card mechanics INFERRED. |

### RC05: Bond Caliper

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-05`; **Analysis + appraisal eye**; an enchanted measuring instrument; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Measure direction, compare time, annotate; calibration charges; on-observe |
| State / observation scope | RF3; E8 C1/C2/C3/C4/C7 directed tracks; C5/C6 use RC08 via relational appraisal |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | One named axis band -> exact axis on declared scale -> compare two separately read edges |
| UI panel | status-window bond subsection or appraisal-lens |
| Interactions / errors / overuse | Wrong edge/scale or a forged reading misleads; high trust is not obedience. Meter optimization erases shared history. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Caliper trace visible to counter-appraisal; player/NPC/rival; AQ4/AQ6 |
| Variants / sources | Rough Compass stays qualitative; source: root C1-C7, BX08; all exact card mechanics INFERRED. |

### RC06: Bestiary System

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-06`; **System with quests + analysis**; a creature catalog system; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Identify, record specimen, compare exceptions; data and fieldwork; on-observe/on-travel |
| State / observation scope | RF2 and selected RF3; E1/E2/E12 species traits and sampled individual state via system data |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Species label -> care profile -> individual exceptions and explicit unknown fields |
| UI panel | Existing Bestiary reading view; status-window summary; no parallel encyclopedia by default |
| Interactions / errors / overuse | A species prior can be wrong for an injured individual, construct or shapeshifter. Overuse turns creatures into templates. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | System readers notice catalog marks; player/NPC/place archive; AQ1/AQ4/AQ13 |
| Variants / sources | Mistaken Catalog arrives with the wrong world schema; source: root H/CL, Means By schema; all exact card mechanics INFERRED. |

### RC07: Pet Window

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-07`; **System with quests**; a held system module; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Select known pet, inspect granted fields, request refresh; system fuel; on-observe/on-action |
| State / observation scope | RF2->RF3; E1/E2/E6/E8/E9; known pets only via system observation |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | One pet’s care -> declared bond axes -> separate remote mark support |
| UI panel | status-window Pets section; expanded known companion page for long detail |
| Interactions / errors / overuse | No remote mark means last-known values, not a live roster. UI access alone cannot read truth; overuse makes pets spreadsheets. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Window visible only through held sharing means; player/NPC/system spirit; AQ1/AQ5/AQ10 |
| Variants / sources | Public Kennel Board shares only deliberate selected readings; source: root L/C, CH1, Panel kit; all exact card mechanics INFERRED. |

### RC08: Bond-Clause Reader

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-08`; **Contract and bargain**; a contract-aware seal; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Read clause, test scope, trace endpoints; seal ink and effort; on-observe |
| State / observation scope | RF3 document detail; E9 C5 terms and C6 permitted channels via contract/energy sense |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Readable signed clauses -> qualified concealed clauses -> detect unsupported shared channel |
| UI panel | status-window Terms section; existing records detail |
| Interactions / errors / overuse | A forgery or lost language can fool it; knowing a clause does not release the bond. Overuse flattens negotiated revelation. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Seal issuer and counter-wards notice probing; player/NPC/companion; AQ4/AQ6/AQ7 |
| Variants / sources | Companion receives its own clause copy; source: root C5/C6/C9, Means Contracts; all exact card mechanics INFERRED. |

### RC09: Pulse Eye

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-09`; **Appraisal eye**; a bodily-condition specialist source; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Scan, locate impairment, compare follow-up; fatigue and calibration; on-observe |
| State / observation scope | RF2->RF3; E2/E5 health, stamina and authored conditions via physiological sense |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Notice impairment -> labelled supported condition -> exact scoped intensity |
| UI panel | appraisal-lens; short care row in status-window |
| Interactions / errors / overuse | HP is not diagnosis; an unmodelled disease stays unknown, not healthy. Overuse removes the EH noticing/healer scene. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Active pulse felt by subject; healer/player/wild beast with supported faculty; AQ4/AQ5 |
| Variants / sources | Construct Joint Reader uses body channels instead of soul; source: root EH, Means specialist appraisal; all exact card mechanics INFERRED. |

### RC10: Beast-Speech

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-10`; **Language and speech**; a translated language faculty; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Ask, listen, clarify, retell; time and translation effort; on-observe/on-action |
| State / observation scope | RF2; E7 wants, E10 accounts, optionally E11 self-report through communication |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Basic requests -> specific disagreement -> ask for a remembered event |
| UI panel | Dialogue inline and attributed People notes; companion-voice if independently granted |
| Interactions / errors / overuse | The beast can refuse, lie or misunderstand; fluent speech does not certify truth. Repeated interrogation replaces companionship. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Listeners may overhear; player/NPC/companion/wild beast; AQ5/AQ9/AQ12 |
| Variants / sources | Silent Sign dialect for mute bodies; source: root O1/C8/DM/EE, Means Asking instead of reading; all exact card mechanics INFERRED. |

### RC11: Habit Root Lens

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-11`; **Analysis + appraisal eye**; a causal trace instrument; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Trace habit, compare contexts, propose retraining experiment; study time and sample charges; on-observe |
| State / observation scope | RF4; E10 habit formation and reinforcing events via causal records |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Habit pattern -> retained cause references -> distinguish reinforcement from first formation |
| UI panel | New Cause Detail records view linked from companion page |
| Interactions / errors / overuse | Correlation is not cause; absent old events stay gaps. Overuse turns an odd habit into a solved optimization problem. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Probing leaves a trace; player/NPC/companion; AQ4/AQ6 |
| Variants / sources | Witness Edition reads only your retained shared events; source: root R103/DR/FC, library SH2; all exact card mechanics INFERRED. |

### RC12: Memory Replay

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-12`; **Analysis + memory reading**; a memory crystal; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Choose episode, replay viewpoint, compare testimony; focus and crystal fuel; on-observe |
| State / observation scope | RF4; E6 retained directed memories, E10 private episodic memory via memory channel |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | One shared memory -> private permitted episode -> compare perspectives without merging them |
| UI panel | New Replay records view; companion page excerpt |
| Interactions / errors / overuse | Experience is not objective camera truth; false/edited memory and missing records remain possible. Overuse removes voluntary storytelling. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Subject may feel entry; player/NPC/companion; AQ6/AQ7/AQ10 |
| Variants / sources | Uninvited Replay bypasses agreement with detectable intrusion and resistance; source: root AF/DD, Means AP7; all exact card mechanics INFERRED. |

### RC13: Day’s Eye

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-13`; **Copy + analysis**; a companion sensory recorder; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Record, scrub interval, label what was sensed; storage and record-time mana; on-observe |
| State / observation scope | RF4; E11 J36 sampled sight/sound history via supported sensory link |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | One retained image -> finite clips -> supported additional sense track |
| UI panel | Replay records view; brief inline attributed clip |
| Interactions / errors / overuse | Camera angle, darkness and absent recording limit it; no retrospective footage from an unrecorded day. Overuse trivializes scouting mysteries. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Recording mark detectable; player/NPC/companion/rival; AQ4/AQ6 |
| Variants / sources | Scent Reel records supported smells without visual identities; source: root J36/DE/C6; all exact card mechanics INFERRED. |

### RC14: Uneven Mirror

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-14`; **Appraisal eye + analysis**; a two-direction bond mirror; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Read each edge, compare confidence, hide comparison; mirror charge; on-observe |
| State / observation scope | RF3; E8 separately read affection edges, FA1 through relational appraisal |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | One feeling band -> both directed bands -> exact supported axes if declared |
| UI panel | status-window paired bond rows; optional appraisal-lens |
| Interactions / errors / overuse | The two scales may differ; player-avatar regard is not Weibao’s actual feeling. Overuse turns love into a verdict or leaderboard. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Both subjects can detect a strong mirror; player/NPC/companion; AQ6/AQ7 |
| Variants / sources | Tender Mirror shows mismatch bands only; source: root FA1/C1-C7, BX08; all exact card mechanics INFERRED. |

### RC15: Pack Weather

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-15`; **Analysis**; an area empathy field; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Sample group, distinguish pairs, isolate your bias; overload scales with sampled group; on-observe |
| State / observation scope | RF1; E3/E8/E10 moods and pair tension for sampled nearby individuals via group affect |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Group unease -> individual exceptions -> directed pair cues |
| UI panel | Inline scene summary, group appraisal-lens; no new global pack dock |
| Interactions / errors / overuse | Average can hide one frightened animal; stranger minds/wards distort. Overuse solves social friction before it unfolds. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Active field felt by sensitive pack members; player/NPC/wild leader; AQ3/AQ5 |
| Variants / sources | Kennel Survey is consented institution use; source: root C13/ER/EG; all exact card mechanics INFERRED. |

### RC16: Thought Door

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-16`; **Meta or fourth wall + analysis**; a keyed mind aperture; lease. Home/outside scope follows CS3. |
| Loop / verbs / resources | Request entry, focus one thread, withdraw; leased time and mental strain; on-observe |
| State / observation scope | RF5; E10 current thought tokens and E7 motives via mind reading |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Offered thought -> unspoken current thought -> wider mind domain if world grants it |
| UI panel | New Mind reading view, with speaker and private-read label |
| Interactions / errors / overuse | Self-deception, active defenses and alien thought form limit interpretation. Overuse removes private discovery and confession. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Entry felt unless separately concealed; player/NPC/rival/companion; AQ5/AQ7 |
| Variants / sources | Open Book is explicit broad omniscience, high upkeep and domain-labelled; source: BX08/root O1/FA, Means memory reading; all exact card mechanics INFERRED. |

### RC17: Dream Bridge

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-17`; **Dream walking**; a paired dream anchor; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Enter, observe, ask inside dream, leave; sleep opportunity and anchor fuel; on-observe |
| State / observation scope | RF5; E10 FD dream imagery and shared dream permissions via dream channel |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Shared fragment -> chosen dream visit -> reciprocal dream entry |
| UI panel | Replay/Mind reading view in dream mode; short wake-up note |
| Interactions / errors / overuse | Dream symbols are not memories or prophecy; waking edits may change meaning. Overuse drains the dream’s strangeness. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Dreamer may notice and read back; player/companion/NPC; AQ3/AQ6/AQ10 |
| Variants / sources | One-Way Dream leak is weak involuntary imagery; source: root FD/C6; all exact card mechanics INFERRED. |

### RC18: Soul Sight

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-18`; **Appraisal eye**; a soul-reading faculty; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Inspect soul mark, distinguish bond, question identity; strain and rank contest; on-observe |
| State / observation scope | RF3/RF5; E9/E10 soul identity, bond anchors and soul-scoped intent through soul sense |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Presence -> supported bond layer -> soul-scoped intent |
| UI panel | appraisal-lens; Mind reading only for granted intent |
| Interactions / errors / overuse | Soulless construct is unreadable, not emotionless; a mask or divided soul changes scope. Overuse resolves identity mysteries. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Soul-sensitive target detects gaze; player/NPC/companion/rival; AQ3/AQ5/AQ8 |
| Variants / sources | Body Sight complements soulless targets without invented souls; source: root AF2/AF3/ES, Means soul channel; all exact card mechanics INFERRED. |

### RC19: Want Atlas

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-19`; **Analysis + knowledge of the future**; an agenda-map system; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Map wants, ask priority, compare stated goal; insight charges; on-observe |
| State / observation scope | RF2/RF5; E7/E10 C8/O4 goals, competing wants and self-knowledge via intent channel |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | One current want -> conflicting goals -> hidden supported motive |
| UI panel | status-window Wants summary; Mind reading for private map |
| Interactions / errors / overuse | Conflicting desires have no single true priority; a hidden motive is not future action. Overuse solves every request before negotiation. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Active mapping detectable; player/NPC/companion/wild beast; AQ4/AQ5 |
| Variants / sources | Declared Atlas uses only communicated aims; source: root C8/O4/FA, library SH16; all exact card mechanics INFERRED. |

### RC20: Reverse Empathy

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-20`; **Companion or resident spirit**; a source held by the companion; matured. Home/outside scope follows CS3. |
| Loop / verbs / resources | Companion attunes, asks, comforts, disengages; its own mana/attention; on-observe |
| State / observation scope | RF1/RF2; E13 player-avatar affect and care need via companion-to-player resonance |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Feel avatar strain -> name supported mood -> ask for clarification |
| UI panel | Inline companion account; optional view of what it disclosed to you |
| Interactions / errors / overuse | It projects its fear or misreads your avatar; no webcam or real-user mental-state inference. Overuse turns comfort into surveillance. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Player avatar can feel scan; companion/wild sensitive ally/NPC holders; AQ3/AQ9 |
| Variants / sources | Reciprocal Link supports separately consented reads each way; source: root DF/FD/C4, Means LS15; all exact card mechanics INFERRED. |

### RC21: Reader’s Collar

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-21`; **Appraisal eye**; a collar containing its own lens; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Companion scans you, withholds or shares result; collar charges paid by its holder; on-observe |
| State / observation scope | RF3; E13/E2 avatar injuries, fatigue and supported conditions via body appraisal |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Notice wound -> compare your stated condition -> report exact supported vital |
| UI panel | Inline attributed warning; appraisal-lens only on shared receipt |
| Interactions / errors / overuse | Foreign player body or ward defeats it; it cannot appraise the human at the keyboard. Overuse becomes a care monitor. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Collar flash visible; companion/NPC-owned guard beast/wild finder; AQ6/AQ13 |
| Variants / sources | Enemy Collar reports to its actual handler through a real route; source: root DE/DF/FL, Means LS15; all exact card mechanics INFERRED. |

### RC22: Your Face in Its Eyes

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-22`; **Meta or fourth wall + analysis**; a perspective mirror; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Ask what it sees, replay impression, compare your self-account; mirror fuel; on-observe |
| State / observation scope | RF4/RF5; E10/E13 creature impression/knowledge of the avatar via observer-record channel |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Shared impression -> private impression -> compare supported observation grade |
| UI panel | Replay view; companion page with attributed account |
| Interactions / errors / overuse | Its mistaken belief stays mistaken; a lower-grade observer has no hidden true build to return. Overuse replaces reciprocal conversation. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Creature may notice perspective access; player/NPC/companion; AQ6/AQ7/AQ10 |
| Variants / sources | Companion uses the mirror on you under the same rules; source: root J40/FA1, library SH18/Means self-appraisal; all exact card mechanics INFERRED. |

### RC23: Life Album

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-23`; **Memory reading + meta or fourth wall**; a life-record anchor; bound-item. Home/outside scope follows CS3. |
| Loop / verbs / resources | Open chapter, mark gaps, compare versions; anchor, ritual time and replay fuel; on-observe |
| State / observation scope | RF4/RF5; E10 whole-life retained viewpoint, J40 via biography/memory channel |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Shared years -> private retained chapters -> authored full-life domain |
| UI panel | New Life Reading records view linked from known companion page |
| Interactions / errors / overuse | Lossy logs cannot manufacture its entire life; omniscient variant needs new supported truth. Overuse removes slow shared discovery and can flatten grief. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Anchor probing detectable; player/heir/NPC/companion; AQ6/AQ9 |
| Variants / sources | Afterwards Album opens after known loss; Living Album grows jointly; source: root J40/AF/DD/CD; all exact card mechanics INFERRED. |

### RC24: Tomorrow Paw

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-24`; **Divination**; a narrow companion omen; gift. Home/outside scope follows CS3. |
| Loop / verbs / resources | Ask one risk, compare interventions, refresh; question charges; on-observe |
| State / observation scope | RF6; E14 care-risk forecast from E1/E2/E5 and authored transitions via divination |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Near-term risk band -> conditional care outcomes -> longer supported horizon |
| UI panel | Inline omen; simulator-foresight expanded reading |
| Interactions / errors / overuse | Unknown illness or changed action invalidates it; no unconditional death countdown. Overuse removes uncertainty from protective choices. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Omen trace sensed by diviners; player/NPC/companion/wild beast; AQ3/AQ5 |
| Variants / sources | Quiet Omen gives a category, not an event; source: root EI/FI, Means AP8; all exact card mechanics INFERRED. |

### RC25: Branch Kennel

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-25`; **Analysis + outcome selection**; a forked-run simulator; lease. Home/outside scope follows CS3. |
| Loop / verbs / resources | Fork scenario, choose orders, compare futures; simulation time and fuel; on-observe |
| State / observation scope | RF6; E14 hypothetical companion outcomes from E1-E10 plus selected policies via model channel |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | One care alternative -> bounded errand -> compare supported life policies |
| UI panel | simulator-foresight; link actual grants and assumptions |
| Interactions / errors / overuse | Missing mind/ecology model cannot predict motives; branch actions publish no real outcomes. Overuse turns shared life into solved routing. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Simulator may be appraised; player/NPC/place engine; AQ4/AQ7 |
| Variants / sources | Estimate Kennel displays ranges; forked version needs actual simulation support; source: root J/CJ, library Analysis/Outcome selection; all exact card mechanics INFERRED. |

### RC26: Fate Thread of Beasts

| Card field | Consideration |
|---|---|
| Identity / placement | `companion-reveal-26`; **Fortune and fate + divination**; a beast-specific fate faculty; burdened-loan. Home/outside scope follows CS3. |
| Loop / verbs / resources | Trace one beast, ask conditional meeting, release lock; debt and detectable target mark; on-observe |
| State / observation scope | RF6; E14 authored fate threads, bond outcomes and divergence via fate sight |
| Engine hooks | The hooks listed in Loop request a qualified read; new reads commit through the shared publisher, not render callbacks. |
| Numbers / dials / costs | CS3 range, precision, resistance, refresh and privacy dials; costs as listed in Loop. No selected rates. |
| Growth / stages | Near consequence -> branch contingencies -> explicit deterministic fate domain where authored |
| UI panel | simulator-foresight; short attributed omen inline |
| Interactions / errors / overuse | Fate interference or an unbound actor breaks certainty; an exact fate cheat must say which changes can break it. Overuse removes suspense and agency if every ending is fixed. Stacking uses the best supported reading with its provenance, never free omniscience. |
| Observers / holders / acquisition | Sensitive beasts/rival diviners detect mark; player/NPC/companion; AQ7/AQ8/AQ10 |
| Variants / sources | Certain Thread narrows domain instead of pretending global certainty; source: root J/FD/J40, Means AP8; all exact card mechanics INFERRED. |

## PF: CH1 and panel-kit fit

**PF1 Current foundation [SHOWN].** `src/status_window.js:7-22` creates player
level, five core-stat rows, titles, points and quests. `:23-34` reads a snapshot
and renders only an awakened status card; `:36-43` binds kit discovery, density
and refresh. `src/main.js:8316-8323` passes cheats, player level/full stats and
held titles. It passes no pet list, observer identity, companion states or read
receipts. The 250 ms render timer is not a paid observation hook. A new scan
must not fire whenever rendering, F6, sorting or opening a tab occurs.

**PF2 Evidence tension [SHOWN].** CH1_REPORT starts BLOCKED but ends with a
coordinator close reporting passed gates and integration. C0_REPORT has the
same worker-stop then coordinator-close history. AUDIT_REPORT subsequently
records durability, travel awakening, semantic validation and below-fold
arrival defects; GOAL R1 names hardening checks. These are different dated
layers, not permission to treat every old pass as current. C12 inspected source
and reports; it ran none of those gates and claims no present R1 runtime pass.
PANEL_KIT still contains the older blanket “cheat runtime deferred” description;
current C0/CH1 source demonstrates its narrow informational implementation.
Broader companion cheat runtime remains proposed. No sibling owner was edited.

**PF3 Proposed surfaces [INFERRED].** Target laptop **1366x768**, cross-check
1440x900 and 1920x1080 if implemented; mobile optimization deferred. Visible
outcome: known companion readings beside routine controls, with one expanded
reading view for long evidence. Ordinary People/Z1 keeps witnessed cues; choose
an explicit cheat read to see hidden detail. Preserve player layout and text size.

| Code | Reveals / cards | Surface fit | Discovery and display boundary |
|---|---|---|---|
| UI1 | Cues, moods, one need, short speech; RC01-03/10/15/20/21 | Inline event or People cue, optional focusable appraisal-lens | No new dock; source, age and uncertainty available on inspect; use PRESENTATION's ambient/outcome distinction |
| UI2 | Care/vitals, granted axes, terms, current wants; RC04/05/07-09/14/19 | CH1 Pets section when that held system actually grants the reader; else appraisal-lens | Adding a section is not granting a cheat. First row shows known name, sample time, current/last-known state and read limits; no unknown pet count |
| UI3 | Species profiles and individual exceptions; RC06 | Existing Journal Bestiary expanded reading | No duplicate catalog; individual evidence is distinct from species priors |
| UI4 | Causes, memories, daily senses, impressions; RC11-13/22 | New Cause Detail / Replay records views, linked from known companion Z1 | New code/API needed; one existing reading slot may host them rather than separate always-open panels |
| UI5 | Thought, dream, soul-scoped intent, private wants; RC16-19 | New Mind reading view; narrow soul appraisal stays overlay | Clearly private or volunteered, viewpoint attributed; opening hidden text needs the exact earned route |
| UI6 | Whole-life viewpoint; RC23 | New Life Reading records view; shared timeline remains Z1 | Unknown years displayed as gaps, not invented prose; J40 permission/domain not implied by death |
| UI7 | Forecasts; RC24-26 | Shared simulator-foresight proposal, with compact inline omen | State assumptions, horizon and unsupported fields; forecast and actual history visually/textually distinct |

Panel-kit CH1 means Status window, not root CH1 “villain's beloved cat”. New
views use `definePanel` only if they need workspace regions: records role for
Cause/Replay/Mind/Life; character role for the existing status window. CH7-style
appraisal remains hover/focus/click overlay, not a new dock. Companion speech is
inline unless a distinct resident-spirit voice panel is itself held/discovered.

**PF3a Cadence tension [SHOWN/INFERRED].** C9 FR02 proposes a global ambient
ceiling every 3-5 visible real minutes; PRESENTATION B1 proposes six/hour with
eight-minute foreground spacing. C9 FR06 suggests 1-3 return changes, while
PRESENTATION B2 separates 0-2 ambient sentences from grouped outcomes. Retain
both rationales: C9 offers cue-frequency options; C10 budgets scarce screen/log
attention. C12 chooses no new rate. Explicit cheat inspection produces one
requested result in place; automatic cheat cues share the eventual global
budget rather than creating an independent stream per power.

**PF4 Kit details [INFERRED].** Discovery comes from durable acquisition and
qualified reading facts. No hidden names, counts, silhouettes, picker entries,
settings or accessible labels before discovery. Known but blocked means a
specific reason: “The sight link has no supported remote anchor”, not a generic
unavailable message. Settings are browser-owned display choices, such as words
versus granted numbers, density and ambience. Reducing precision is allowed;
settings cannot upgrade grade, reveal secrets, acquire powers or erase costs.
Respect Appearance, saved docking, F6, Shift+F6, visible focus, reduced motion
and no replayed arrival on restore. Never cram a whole-life transcript into the
CH1 character column or stack each card's panel above routine actions.

## E: one hidden truth, qualified observation, derived display

All E proposals are INFERRED unless the Have column names SHOWN source support.
“Exists” means a source-read state seam in this checkout, not browser acceptance,
public pet UI or a complete companion mind. Every RC card names these E inputs;
its observation reader is proposed even where an input already exists.

| Code | Hidden state read and cards | Have today, source evidence | Proposed gap / distinction |
|---|---|---|---|
| E1 | Care resources: satiety/rest demand; RC01/03/04/06/07/24/25 | SHOWN Rill satiety/lessons in `actors[dog].resources`; `src/nethack_fieldcraft_content.js:46-47,79-89`; `src/nethack_fieldcraft_facts.js:58-59,73-77,108` | INFERRED generic hunger/rest/play/territory need model. Rill has finite care counters, no timer hunger; feeding explicitly gives no mood or loyalty |
| E2 | Body, HP/stamina, impairment; RC01/04/06/07/09/21/24/25 | SHOWN `simulation.people[dog].body/vitals`; content `:46-47`; facts `:104-111`; target vital/body projections `src/simulation_effects.js:133-134,150` | INFERRED broad physiological inference/diagnosis and species meaning; low HP does not name a disease |
| E3 | Mood/affect and mixed feelings; RC02/15/20 | INFERRED no generic companion mood owner located in inspected seams; content `:79-83` explicitly disclaims mood reward | Needs authored affect plus qualified emotion channel; tail/posture alone remains an observation |
| E4 | Labelled needs and priority conflicts; RC03 | INFERRED needs beyond E1 counters not authored for Rill | Cannot invent exact need priorities from a few resources |
| E5 | Conditions and health causes; RC01/09/24 | SHOWN generic actor intensity/expiry/tick support `src/simulation_contracts.js:252`, `src/simulation_effects.js:145-149,302-314`; fieldcraft scent `src/nethack_fieldcraft_content.js:48` | INFERRED companion diseases, EH clues, diagnoses and causal histories. Generic condition storage is not an illness library |
| E6 | Directed learning axes and recent memories; RC07/12 | SHOWN `simulation.relationships[actor][target].axes/memories`; contracts `:250`; writer `src/simulation_effects.js:285-292`; Rill `scent_lessons`/`pin_retrievals` at content `:89,102` | SHOWN retention is only 32 recent memories. INFERRED private episodic replay; counters are learning deeds, not affection |
| E7 | Own wants/goals C8/O4; RC03/10/19 | INFERRED no general companion desire/agenda owner established in inspected source | Jobs and willingness are not personal wants; a species prior or spoken request has its own provenance |
| E8 | Directed C1 trust/C2 affection/C3 obedience/C4 understanding/C7 respect, reverse edges and FA1; RC02/05/07/14/15 | SHOWN generic finite numeric axes can store authored fields, contracts `:250`; Rill has only learning axes in E6 | INFERRED all five companion bond axes and avatar-to-companion regard here. Never label existing lesson counts “love”; no inferred human-player affection score |
| E9 | C5 contract clauses/C6 links; RC07/08/18 | SHOWN Rill authored willingness flag/support at facts `:70-71,111`; observation lease/link records in `src/observation_channels.js:19-43,45-90` | INFERRED generic magical pet contract and shared soul/mana/health link. Rill's permission is a bounded authored fact, not the seven-track bond model |
| E10 | R103 habit causes, AF/DD recognition and episodic past, FA1 private meaning, FD dreams, J40 whole life, current thoughts; RC10-12/15-19/22/23/25 | SHOWN E6 recent memory and scoped `simulation.knowledge[actor]`; contracts `:249-250`; effects `:152-158` | INFERRED habit graph, full private life, thought/dream and soul models. Existing knowledge can seed a communicated account, not reconstruct all past experience |
| E11 | J36 what it saw today; RC13 | SHOWN scoped observation receipts and recipient-only replay `src/observation_channels.js:215-225,311-319`; dog retrieval account content `:101-102` | INFERRED companion sensory recording and clip timeline; a text receipt is not stored footage or a complete day |
| E12 | Species and individual profile; RC06 | SHOWN Rill body template content `:46-47`; species/race scaffold discussed in ENGINE_FIT S18/G9 | INFERRED cross-species bestiary appraisal and reliable individual mind profile; registration alone reveals no private facts |
| E13 | What a companion knows/sees about the avatar, avatar vitals/affect; RC20-22 | SHOWN actor-target directional knowledge/relations and target vital projections in effects `:130-158`; Rill lesson/retrieval knowledge content `:88-89,101-102` | INFERRED general companion observer policy, avatar mood and perspective replay. NPC-held readings remain NPC knowledge until genuinely shared |
| E14 | Conditional future, simulated branches, fate; RC24-26 | SHOWN existing job start/due terms `src/nethack_fieldcraft_facts.js:27-33`; common timed commands in `src/simulation.js:208-235` | INFERRED future behavior model and fate owner. An already accepted job's due time is a schedule, not foreknowledge of illness, affection or an unsimulated life |

### OC: proposed shared read path

**OC1 Truth and read [INFERRED].** Use the state's existing owner by actor ID,
world/body revision and directed edge; do not copy hidden values into card state
as a second truth store. Proposed adapter:
`readCompanion(observerId,targetId,meansId,fieldIds,context)` produces one
observation result, not a new companion simulation. Check held/acquired source,
awake/active state, body faculty, domain, range, boundary, target concealment,
precision and supported model. Unsupported fields return unknown with a known
reason; absence is zero only where the field owner explicitly declares it.

**OC2 Knowledge record [INFERRED].** A sample records recipient, target, field,
source/means revision, truth revision/as-of clock, achieved grade, value/band or
account, confidence, error basis, cause and live/replay status. Keep hidden raw
truth separate from the recipient-safe payload. Pre-check cost; publish cost and
qualified record durably together; only then cue discovery/render. Blocked scans
spend/publish nothing unless an authored paid failed attempt is explicitly quoted.
A reading that becomes stale does not silently refresh. Replaying its record
neither pays again nor creates a live sample. Captured error stays stable across
reload/import; rerendering must not reroll a favourable answer.

**OC3 Existing channel limit [SHOWN].** The light/sound lease engine at
`src/observation_channels.js:28` allows only those flow names and separate realm
endpoints; `:97-105` binds a present view edge and actual bodies; `:215-225`
accepts scoped sample text, it does not compute a companion need/bond read.
`:228-283` separates detection, notice, identity claim and qualified identity;
`:311-319` replays recipient-safe text only. Do not feed hidden truth into
`request.text` and call that a qualified reader. Local appraisal, mind, dream,
soul and forecast need explicit adapters/validated domains. They cannot be
silently added as new flow strings to this existing validator. The engine
[README](../../engine/observation-channels/README.md) and
[NATIVE_INTEGRATION](../../engine/observation-channels/NATIVE_INTEGRATION.md)
record detached versus selected Glasshouse integration and remaining proof.

**OC4 Same fact, many lenses [INFERRED].** Ordinary cues, Pet Appraisal and Pet
Window consult E1 once: a band, a labelled need and an exact value can coexist,
with age/source attached. Stack lenses by domain and provenance, not by adding
scores or selecting the most reassuring output. Preserve contradictory readings
until fresh qualified evidence resolves them. The library's new SH/OV/II section
was present during this pass: OV1-OV4's truth/knowledge/display model and II12's
second-user limit fit this adapter; both remain proposals. RF is presentation,
AP is qualified means depth, and OV precision is an output dial, not three
independent rank systems to grind.

**OC5 Others and reciprocity [INFERRED].** Another person's pet and a wild beast
use real target identity and actual means; being the owner is not a global key,
and observing one does not acquire its body, contract or commands. RC04/06/09/15/
18/19/24/26 can target them where their scope permits. Rival readers use the same
contest and can be concealed/detected/countered. RC20/21 are companion-held means;
RC22 may also be held by a companion. Their records belong to that observer,
not automatically to the player. Sharing requires speech, a link or another actual
communication route. Counter-reading detects the supported trace, not guaranteed
reader identity. Access may be negotiated or invasive by world dial, with distinct
fictional reactions and resource costs; no universal consent gate is invented.

**OC6 Secrets and forecasts [INFERRED].** Unqualified UI, help, empty text,
settings, logs and exports must not leak a sealed truth through its name, reason,
preview, count or a guessed forecast. A secret-capable cheat may have an authored
qualified discovery route; it is not globally disabled, and no secret truth is
written here. Forecasts default to bounded conditional odds, labelled assumptions,
horizon and missing fields. Deterministic outcomes require an explicitly authored
fate domain or supported engine branch. A fork contains no real reward or memory
until an independently authorized actual action occurs. J40 full-life access must
say whether it reads retained memories, an authored complete truth, or partial
biography; no old save grows an invented past to fill gaps.

## BP: bounded implementation candidate, not an added gate

**BP1 Recommendation [INFERRED].** If selected later, Pet Appraisal RC04 reading
Rill's existing satiety/stamina through one qualified channel is the smallest
second lens. Ordinary fieldcraft controls and an appraisal result should agree
on the same counters without awarding affection. Its visible read could be an
appraisal overlay; a CH1 Pets section is a separate grant/presentation choice.
Do not mutate Rill into the root palette's new stray or enroll a generic pet mind.

**BP2 Phases [STATED/INFERRED].** Library C0-C6 is a historical design plan, not
a claim all phases shipped. Current C0 stores cards and CH1 supplies narrow
status UI. A reveal card still needs qualified on-observe execution (library C5
intent), costs, saved knowledge, per-card semantic validation and its chosen
surface. Library C4 companion spirit and C6 library browsing are separate loops;
RC20 does not establish them. AQ14 can fixture any future reader but must not
prove a natural acquisition route. Prefer one state and two honest views over
building all 26 readers or full-life simulation first.

**BP3 Future proof [INFERRED].** A selected runtime slice would rebuild and use
a fresh origin at the laptop target: qualified versus unqualified field; truthful
value/band plus stale/blocked result; known/unknown target and no secret leak;
cost/failed-publication behavior; companion or NPC recipient scope; keyboard and
visible content beside ongoing work. Save/reload/literal-file import must retain
readings, costs, acquisition and unknowns without rerolls/replayed cues. A later
forecast slice separately proves conditional-model limits; a private-memory slice
separately proves no hidden history leaks. These are candidate-specific checks,
not new gates on unrelated companion work. No gameplay completion is claimed.
