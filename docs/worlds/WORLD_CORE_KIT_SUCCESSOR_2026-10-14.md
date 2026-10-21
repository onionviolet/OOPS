# World core kit, successor root (from round 16)

Claude (root), 2026-10-14. Continues the [world core kit](WORLD_CORE_KIT_2026-10-14.md)
(rounds 1-15, about 1,950 lines) as its NX11 asked. Codes, cards and the
readiness baseline (K19-K34 runtime 0 met of 288) carry over unchanged.
Method: [world core kit core audit](../audits/WORLD_CORE_KIT_CORE_AUDIT.md).

## Round 16: core stuff each world needs, with the game wave as evidence

Request (Weibao, 2026-10-14): "core stuff needed for each world to be
implemented in depth? do a 'more to consider? other stuff and more? save and
extend accordingly Send out codex as useful?' for each aspect?"

Rerun triggers fired: 10+ design docs landed since round 15, and a new
evidence set exists (21 game passes plus per-game aspect passes A01-A12 in
the [game research wave](../gm/dispatch/game-research-wave-2026-10-14/ASPECTS.md)).
That matches the audit's "W1 delta for all priority worlds, W10 references"
row.

### New angles (KW)

| Code | Angle | Do |
|---|---|---|
| KW1 | **Aspects map onto kit parts.** A01 dialogue and A02 narrative delivery have no single kit part; each world card should say how its people talk (address, honorifics, small talk, relationship-gated lines) and how story beats reach the player | Lane TW-K drafts the mapping A01-A12 to K1-K34 |
| KW2 | **Per-world dialogue grammar.** Heaven's Vault (evidence-gated lines), Vagrus (event steps), Taiwu (relationship and sect-gated talk), Discworld (canon voice) are four distinct models; a world picks one as its default | TW-K, proposal per priority world |
| KW3 | **Event engine shape per world.** Vagrus, HoI4, KoL and Warsim separate eligibility, priority, cooldown and closure; the kit's canon-event part should use the same four slots. *Corrected round 17 (FK2): the four slots are our audit contract, not an engine all four games share* | TW-K, check against canon-events lanes |
| KW4 | **Save aspect per world.** A04 findings (versioning, what is derived) become a kit row: what a world's state must save versus recompute | TW-K, with the save shape owner |
| KW5 | **Little stuff per world.** About 500 small touches from the wave; each world card gets the ones that fit it | Lane TW-S |
| KW6 | **Fidelity before breadth still holds (NX12).** New rows are proposals for card refresh (NX8), not new gates | ACCOUNT |

### Lanes this round

[Topic wave 2026-10-14](../gm/dispatch/topic-wave-2026-10-14/COMMON.md): TW-K (W1 delta for priority
worlds plus KW1-KW4), TW-S (little stuff routing), TW-L (levels consistency).

## Round 17: TW-K, TW-L and TW-S folded (2026-10-14)

Request (Weibao, 2026-10-14): "Fold the topic-wave and synthesis returns into
the four root palettes, corrections first, then pick the next playable slice."
Sources: [TW-K](../gm/dispatch/topic-wave-2026-10-14/tw-k/OUTPUT.md), [TW-L](../gm/dispatch/topic-wave-2026-10-14/tw-l/OUTPUT.md), [TW-S](../gm/dispatch/topic-wave-2026-10-14/tw-s/OUTPUT.md).

### Corrections

| Code | Correction | Source |
|---|---|---|
| FK1 | W37.H1 (home rain leaking into visitor worlds) is history for the pacing path: `homePacingContext` gates native rain by world, and the calendar and weather modules are on HEAD. Journey, native persistence and taste gates from W36 stay OPEN | TW-K-C1, TW-S-C4 |
| FK2 | KW3 overstated common evidence. The four event slots are our audit contract; Vagrus shows separate histories and recurrence, KoL's journal is a third-party adapter, Warsim shows quiet outcomes versus redraw, HoI4's evaluator is unread. Marked in place | TW-K-C2 |
| FK3 | The K19-K34 grid (288 cells, 0 met) is the pre-W36 baseline from a dated W21 join, not a new measurement; K28 has new partial evidence in MoL and Paradise; no re-score happened | TW-K-C3 |
| FK4 | AXR1 said abstractions pass because several worlds need them. Demand across worlds makes a candidate; landing needs two distinct real callers (the rule the chains, technology and genetics palettes already use) | TW-L03, TW-L45 |

### Folded picks

- **Card refresh (NX8) is now the kit's top action:** one consolidation owner
  refreshes the 18 priority cards plus the paused Soldier route from TW-K's
  D1-D9, keeping dates and unknowns (TW-K-S2).
- **KW1-KW4 bindings** stay proposals attached to cards when their owners
  proceed, starting with the selected local opening (TW-K-S4). No new
  mandatory gate.
- **Little stuff:** TW-S routed 964 touches into 51 families; kit-owned top
  touches are local dates without home-clock leaks (TW-S14), qualified weather
  and civil dates (TW-S45), refusing a changed quote before spending (TW-S51),
  keeping unknown doses and private acts out of hints (TW-S41) and a real
  import recovery route (TW-S20).

### Slice

The next playable slice is P01 work feedback on Village mixing (chains round
5). For the kit, NX12 still holds: fidelity in the two playing worlds before
breadth; a W37 mechanical reader re-checked against current source is the
kit's next build candidate (TW-K-S3).

## Round 18: multi-world research folded (2026-10-15)

Weibao, 2026-10-15: "Fold and commit and push accordingly". Sources: [multi-world audit](../research/multiworld-synthesis-2026-10-14/AUDIT.md),
[synthesis](../research/multiworld-synthesis-2026-10-14/REPORT.md) and [packets](../research/multiworld-synthesis-2026-10-14/PACKETS.md),
over HyperRogue, Siralim Ultimate, Remnant II, Kingdom Hearts HD 1.5+2.5, The Strange,
RetroMUD and 3 Kingdoms, Multiverse Idle (UI), with Naev, Ur-Quan Masters and the
deep systems sweep as supporting evidence.

### Corrections (audit, 70 checks: 34 confirmed, 17 supported, 8 qualified, none refuted)

| Code | Correction | Source |
|---|---|---|
| FK5 | Remnant II claims stay conditional on an unvalidated mappings file; `ActivateFirstValidWorld` is activation, not random world selection | Audit C4 |
| FK6 | Kingdom Hearts room, party and model changes do not show retained local stock, consent or personal memory; its save schema is the tool's, not proof of the Steam container | Audit C5 |
| FK7 | The Strange: SHOWN means inspected rules and examples, not software. Translation and unchanged physical passage are two separate crossing options | Audit C6 |
| FK8 | Multiverse Idle screenshots show visible information only; 1920x1080 media cannot pass the 1366x768 gate | Audit C8 |
| FK9 | Accepted direction OD2 to OD24 (2026-10-15) supersedes older open wording in lane proposals: memories and base cheat carry between lives, chosen away routines with stops, paused inactive worlds, means-based returns, one continuing self | Audit C9; PROJECT.md |
| FK10 | Lane UI ideas cannot replace the accepted Proto23 composition. New features start in the Projects drawer (UR2), places have keepers (UR4), panels register their own node (UR8) | Audit C10; [UI rules](../UI_RULES.md) |

### What many worlds agree on (ranked, proposals; packets MWA-P01 to P10)

| Rank | Pattern | Seen in | Kit parts |
|---|---|---|---|
| 1 | Current work explains its useful result | Multiverse Idle, RimWorld, Naev; delivered for Village mixing as P01 (`838f8052`) | K13, K14, K34 |
| 2 | **A local rule changes one useful verb** | HyperRogue (land laws, orb drain), Siralim (realm properties), Remnant II (world hazards), Kingdom Hearts (world forms), The Strange (recursion laws) | K2, K5, K10, K13, K15 |
| 3 | Earned learning and present usability shown separately | Kingdom Hearts, Naev, RimWorld, MUD multiclassing | K3, K9, K11, K14, K15 |
| 4 | A paid conversation changes the next local opportunity | Ur-Quan Masters, Naev, Magical Diary | K6, K7, K11, K12, K20, K29 |
| 5 | Return finds the place actually changed | Kingdom Hearts revisits, MUD realms | K5, K6, K12, K16, K18, K29 |
| 6 | Crossing quotes what happens to each carried thing | HyperRogue, Siralim, The Strange, Remnant II | K4, K9, K11, K15, K18 |

Ranks 7 to 10 (origin-filtered lists, settled-routine summaries, one authored
override with fallback, neighbouring rules meeting at one boundary) stay in the
packets file.

### Build note

Next multi-world build candidate: MWA-P02 on the merged T3 rule reader, in a
world that already plays, behind the Projects drawer until Weibao promotes it,
and off files the UI queue (NAV, TRIAGE, APOTHECARY) owns. Not dispatched.

## GW1 world identity follow-up, 2026-10-15

The [wider gameplay/world pass](../gm/DIRECTION_DETAILS_REVIEW_2026-10-15.md#wider-gameplay-and-world-design-pass-2026-10-15)
reuses round 18's local-rule/useful-verb proposal. **Recommended authoring detail:**
for a selected world rule, record the actual changed action/condition, means,
consumer, consequence and next useful choice in the existing world owner. A new
rank/resource name alone is not proof of a mechanically different world. Ordinary
social/ecological life can supply the distinction; no mandatory minigame/new meter.
Compare one actual local-rule effect in existing authorized scope before broadening.
No new build candidate, source claim, worker or prerequisite for the cheat slice.
Existing K/MWA proposals and runtime baselines keep their own evidence dates.

## GW1 local-rule specimen worked, 2026-10-15

[Cyoria GW1/GW3 specimen](mother-of-learning/GW1_GW3_LOCAL_RULE_AND_APPROACHES_2026-10-15.md)
uses the existing original visitor branch to show a rule changing actions:
knowledge, compatible source, stored fuel, tool and trained control are distinct.
Prepared device operation and actual evidence-led specialist help resolve the
same local objective with different investments/dependencies. The original keyed
interface is labeled as a branch divergence. Definition checks support structural
comparison, not native/whole-world completion or strict-source canon. No new
world/implementation dispatch, additional realm or current-cheat gate selected.


## Selective full-cost and reuse comparison method, 2026-10-15

[Cyoria follow-through](mother-of-learning/GW1_GW3_LOCAL_RULE_AND_APPROACHES_2026-10-15.md#full-preparation-later-reuse-and-helper-availability-2026-10-15)
traces local law -> actual start/funding -> full preparation -> marginal cost ->
later consumers -> helper/recovery -> outcome/evidence. Recommend reusing these
fields in selected existing world owners, not adding an all-world quota or gate.
Frontier is the first proposed candidate; source/held integration must precede
claims. FMA/HP remain later source/start-dependent proposals. In particular,
reusable items need actual ongoing supply/services, and early alternatives need
separate mature consumers if independent careers are promised. Current Cyoria's
finite calibration and lamp-gated mature research are findings, not universal laws.
No worker dispatch, new priority or cheat implementation requirement follows.


## Feature-first book-world gap follow-through, 2026-10-15

[Current feature register](BOOK_WORLD_FEATURE_GAPS_2026-10-15.md) answers the newer
request to find concrete missing capabilities instead of requiring an objective
first. It supersedes the earlier Frontier-next suggestion for this pass, preserves
book priority and keeps each TTKS core separate. W15 remains the schema owner;
the register distinguishes explicit unbound profiles, content, local handlers,
source and proof gaps. An objective can verify a feature without defining its
whole scope. No new kit quota, implementation gate or runtime dispatch follows.

## Round 19: little stuff every world creation needs (2026-10-18)

Request (Weibao, 2026-10-18), after story palette rounds 12-14 on tropes, chains
and canon events: "What else can be considered here? Little stuff that applies to
every world creation and more?" One palette round, no lanes. Proposals only.

Coverage check first: K1-K34, the micro sections (KM, KV, KT, KK, KC, KG), the
subtle sections (KS, KQ, KP, KD, KR) and TW-S's small touches already cover
greetings, address, weather, festivals, queues, pets, prices, jobs, signals and
ripples. A keyword pass over both roots and the topic wave found almost nothing on
waste and sanitation, darkness and light, leisure (games, gambling, music,
hobbies), folk wisdom (proverbs, lullabies, wrong common beliefs), lost things and
petty crime, or units and measures. This round fills those and adds a few
cross-world authoring tools. Each row is a default and a dial, set per world.

### Small world aspects the kit lacked (KN)

| Code | Aspect | Default and dial |
|---|---|---|
| KN1 | **Waste and where it goes.** Night soil, middens, sewers, recycling spells, a cleaning familiar, a disposal chute. Who does the work, what it costs, what it smells like. | One line per world. Magic worlds say what magic does to waste (Hogwarts vanishing, cultivator inedia). Dirty jobs are a ready K8 job and a class marker. |
| KN2 | **Darkness and light.** What lights the night (tallow, oil, glowstones, ward-lamps, electric), what it costs, when people go to bed, what walks in the dark. | Sets the world's evening rhythm and makes night travel a real choice. Links weather and the clock; light is an item and a law (a world where light keeps monsters off). |
| KN3 | **Leisure.** Local games (board, card, dice), gambling and its debts, music and instruments, sports, storytelling nights, hobbies. | Two or three per world. Games are cheap minigame or idle-skill hooks; gambling links debt chains (story palette BV4); music links instruments (tools IP rows). |
| KN4 | **Folk wisdom.** Proverbs, lullabies, children's rhymes, nursery fears, wrong common beliefs ("iron stops ghosts"). Each can be true, half true or false under the world's laws. | Folk belief is a K11 knowledge record, never automatic truth (K2.6). A proverb that turns out literally true is a cheap discovery; a lullaby can hide a sealed secret's route. |
| KN5 | **Lost things and petty crime.** Pickpockets, lost purses, a lost-and-found shelf at the inn, stolen laundry, lost children, petty fines. | Small, recurring, idle-friendly events that test custody (SR conserved custody) and give the watch, gossip and appraisal something to do. |
| KN6 | **Units and measures.** How locals count distance, weight, time and value: li and shichen, leagues and bells, credits and ratings. | Display in local units with an optional hover conversion (UR hover inspection). Local units stay local (WAC23); conversion happens at crossings. |
| KN7 | **Body care.** Bathing (bathhouses, purification arts, none), hair and grooming, teeth, shaving, cosmetics. | Feeds appearance, reputation and body owners (BHC rows). A bathhouse is a social place in many worlds. |
| KN8 | **Small animals and pests.** Vermin, strays, birds in the eaves, insects in the stores, local nuisance creatures. | The rat-tail economy already exists in Village; every world needs its equivalent ambient creature with a use and a nuisance. |
| KN9 | **Sounds by hour.** Bells, calls to prayer, market cries, night watch, training yards, silence. | Cheap presentation (log voice, optional audio later) that tells time and place without UI. Grows with the AX audio owners. |
| KN10 | **Death customs.** Funerals, graves, mourning periods, inheritance practice, what happens to bodies in a world with necromancy or resurrection. | Every world needs one; it shapes heir play, ghost worlds and grief stories (story palette AC). |
| KN11 | **Reading and writing.** Who can read, what is written down, scribes and letters, notice boards, what paper costs. | Decides how information spreads (K11) and whether the player can post a notice, forge a letter or read a ruin. |
| KN12 | **Complaints.** What locals grumble about: taxes, the weather, the sect next door, prices, young people. | One of the fastest ways to make a world feel lived in; complaints also point at real problems the player could fix. |

### Cross-world authoring tools (KU)

| Code | Tool | What it does |
|---|---|---|
| KU1 | **Law-to-daily-life pass.** For each K2 law, ask what ordinary life does because of it: if healing magic is cheap, what happened to doctors, scars and insurance? If cultivators live centuries, who inherits? | Turns laws into dozens of small, consistent details. Cheapest way to make a world coherent. Rows land in K8 and KN. |
| KU2 | **Three questions per noun.** For each signature item, place or job: who makes it, who wants it, what happens when it breaks or runs out. | Every answer is a job, a request or a chain start (story palette BW3). |
| KU3 | **Texture layers.** Like tropes (story palette BW1): a core texture library (bread, rain, gossip), genre families (cultivation sect life, academy, frontier town, modern city) and world overrides. | A new world inherits plausible small stuff from its family and authors only what differs. Saves most of the per-world effort. |
| KU4 | **Price-as-worldview.** What is cheap and what is expensive tells the player the world's logic (salt costly, spells cheap; water rationed, information free). Pick four surprising prices per world. | Extends K8.1 price anchors into a world identity signal. |
| KU5 | **What goes wrong routinely.** Late deliveries, broken tools, sick days, spoiled food, strikes, minor fires. A world where nothing breaks feels fake. | Ambient friction at a per-world rate; cozy worlds low, frontier worlds high. Repair and making systems get steady work. |
| KU6 | **Ordinary day sample.** Write one hour-by-hour day of an ordinary local. If it can be written from the pack and KN rows without invention, the world has its floor of daily life. | A quick readiness check that complements the K8 floor, not a new gate. |

### ACCOUNT FOR NOW

- **KN-A1, palette not quota.** KN and KU rows are optional texture. They never
  become gates for a first slice (NX12, KW6); K2, K3, K6, K8 and K13 still define
  the floor.
- **KN-A2, beliefs are knowledge.** Folk wisdom (KN4) and complaints (KN12) are
  actor knowledge records separate from truth (WA12), so a proverb or rumor never
  leaks a sealed truth.
- **KN-A3, packs hold them as data.** KN rows land as pack records with canon
  status (WA3); texture from a family layer (KU3) carries the `generated` or
  `authored` label, not `source`.

### Suggestions (round 19, ranked)

1. **KU1 law-to-daily-life pass** on the next world card refresh (NX8). Small
   designer task; done when each K2 law has at least two daily-life rows.
2. **KU3 texture layers** for two families (cultivation, academy), so new worlds
   inherit small stuff. Designer plus coder, medium; done when two world packs
   override fewer than half their texture rows.
3. **KN1, KN2 and KN3** for Village first, since it is the live slice. Small;
   done when a rebuilt desktop journey shows a night lighting cost, one game and
   one waste job.

## Round 20: rule-fit across world details, 2026-10-18

**KF1, texture is an authoring palette (AD5/AD33/AD36).** Round 19's "every world
needs" phrasing means inspect the relevant ordinary-life consequence, not require
pests, funeral mechanics or one hour-by-hour simulated day in every world. A
world whose law removes that need states the reason; a selected playable slice
can leave unrelated parts thin. NPC-heavy work and layouts remain deferred.

**KF2, origin is provenance, destination has mechanisms (AD38/WA14).** A carried
item keeps its origin and actual internal mechanism; operation also depends on
local supplies, physics and crossing means. "Uses home rules" is not an automatic
exception to destination law. KN6 local display measures do not imply one fixed
exchange rate or universal power-level conversion (AD27/AD28).

**KF3, one useful joined case (AR10/AR11, SR14/SR20/SR21).** For the next selected
world slice, use a known route → real access → useful resource/tool use → persistent
site aftermath. Name clock and custody owners; a stopped routine retains spent
supplies and unused time once (G26–G30). Coverage lint and a deep dossier cannot
substitute for that played consumer.

ACT NOW: update kit/audit routing and rule clarifications. ACCOUNT FOR NOW:
apply KF1–KF3 only to the selected kit parts. LATER: strong world/runtime agent,
medium for one selected joined case; done with source-qualified laws, actual
consumer and rebuilt current-target persistence evidence. No lanes launched.

## Round 21: deep-level lenses for every world, 2026-10-19

Request (Weibao, 2026-10-19): "Consider similar level stuff for each world? Save these deep level stuff for long term
considerations for every world." **Status: proposal.** Nothing here selects build scope. Codes **KL1 to KL12**
(lenses) and **KR21-1 to KR21-10** (method lessons); prefixes checked unused by `git grep` 2026-10-19.

Where the underlying work lives (not restated): [dials and interpreter palette](../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md)
(WDI1 to WDI45), [CRAFTING_ENGINE Rounds 6 and 7](../CRAFTING_ENGINE.md) (TQ, NX, PG, UV, IX), [rule grammars palette](../WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md)
(DG1 to DG35), lane outputs under `docs/audits/{world_dials,materials_tags,world_grammar}_2026-10-19/`, and the
[core audit](../audits/WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md) run log. This round maps those findings onto the kit so each world can
be audited at the same depth later. Kit parts touched: K2 world laws, K9 items and craft, K11 knowledge, K13 signature loop, K14
presentation, K20 language and naming.

### KL. The lenses (ask each world once, when it is selected)

| Code | Lens | The question for a world | Kit part | Evidence from 2026-10-19 |
|---|---|---|---|---|
| KL1 | Dials and profile | Which settings turn per world (heredity model, substitution policy, quality model, tier count, interaction families), and where in the world pack profile do they live? | K2 | Pack profiles already carry modules, layers and a resolver id (WDI41); no dial has a typed registry yet |
| KL2 | Material families and axes | What mechanisms (not ingredient lists) do its materials differ by, and which existing axes already cover them? | K9 | Frontier pack has six axes; `hardness` has no reader (MQ-A) |
| KL3 | Supply forms and places | Which of wild site, bed, shop, store, donor, route, reward, salvage exist, and who owns access? | K5, K9 | Most canon ingredients are shops and beds, not foraging (RS3) |
| KL4 | Interaction law families | Which of neutralize, synergize, saturate, inhibit, separate, age does this world actually use, and does it have an ordinal tier? | K9, K13 | Families compile to reaction rows with no engine edit; tier needs strata (IX25) |
| KL5 | Relation graph | Does the source state opposites, cycles or counters that can be rows with locators? | K2, K13 | D&D data is thin (13 rows); HP has a few verbs |
| KL6 | Rule-grammar derivation | What structure (parts, components, order, claims) can be derived, and what cannot? | K3, K11 | Names and schools do not give meaning (DG31); structure does |
| KL7 | Tags and subtle properties | Which properties are presence (tag) and which have a degree (axis); what look-alikes, conditions and residues exist? | K9, K11 | Derived tags are stored at resolve time (TQ16) |
| KL8 | Knowledge claims | Which rules are textbook or teacher claims with a reliability, not truth? | K11 | HP: annotated methods can be wrong (DG8) |
| KL9 | Naming and language | Does naming carry structure the grammar can use, and how do locales render it? | K20 | Treat name hints as low-confidence hints (DG31, DG24) |
| KL10 | Display | What does the player see of each lens, and what is known versus true? | K14 | UV rows; hover-then-pin awaits Weibao's pick |
| KL11 | Source tier and reading cost | What can be derived from existing ledgers and cards, and what needs a bounded read under AU1 to AU15? | K1 | HP gap plan fits the default budget |
| KL12 | Golden cases | Which shown source cases must any derivation reproduce? | K18 | 12 HP and 7 SRD cases exist |

### Per-world map (status as of 2026-10-19; all leads are MEMORY until a lane checks them)

Cells say what is evidenced, not what is true of the source. "Lead" means a structure I recall that could feed a lens; verify from the
world card and ledger first, then a bounded read only for named gaps. Worlds follow the 20 cards in `world-core-kit-2026-10-14/cards/`.

| World | Evidenced today | Cheapest lead to check first (MEMORY) | Reading cost note |
|---|---|---|---|
| Frontier / Village | Live code: frontier catalogue, craft law, source table, Village mixture (two parallel property systems, TQ18) | Decide which property system carries forward (KL2, KL7) | None; code only |
| Harry Potter | KL6, KL8, KL12 done from existing notes (potions and herbology derivable; spells thin) | Counter pairs and spell name scenes (gaps G-A to G-H) | Fits AU3 |
| D&D | KL6, KL12 proof on 20 SRD spells; sidecar needed; pack is small | Count the full SRD list; relation rows are design, not source | Needs the supplied SRD text |
| Mother of Learning | Native code exists (`book_world_mol_*`); no lens work | Ward and mind-magic rule structure (KL5, KL6) | Check card and ledger first |
| Lord of the Mysteries | HP/LOTM feature doc exists | Sequence ladder as an ordinal tier (KL4); formula structure (KL6) | Check card first |
| Circle of Inevitability | Card exists; no lens work | Unknown; check the card | Unknown |
| Shadow Slave | Card exists; no lens work | Rank ladder as tier (KL4) | Check card first |
| Reincarnation Paradise | Native code and calendar policies exist | Instance rule families (KL1) | Existing code first |
| TTKS (B1 to B5) | Five cards; books read earlier | Power-bill cost structure as a dial (KL1) | Existing deep dives |
| A Soldier's Life | One paused card | Low-magic supply and ration structure (KL3) | Paused |
| Jujutsu Kaisen | Card exists | Grade ladder as tier; binding-vow cost as a dial (KL1, KL4) | Check card first |
| Bleach | Card exists | Named-spell numbering and release levels (KL4, KL6) | Check card first |
| Naruto | Card exists | Rank ladder and element relations (KL4, KL5) | Check card first |
| Fate | Card exists | Class and rank structure (KL4, KL6) | Check card first |
| Hunter x Hunter | Card exists | Ability-type affinity graph as a ready relation graph (KL5) | Check card first |
| Fullmetal Alchemist | Card exists | Transmutation structure and its stated limits (KL6, KL3) | Check card first |
| Other card-less worlds (Fallout, Skyrim, Elden Ring and others) | Deprioritized; existing work kept | None; revisit when selected | n/a |

### KR21. Method lessons to keep (from this session's lanes)

| Code | Lesson | Default |
|---|---|---|
| KR21-1 | Map owners and live code before writing | Two rounds were corrected because a root missed `world_pack*.js` and the tag store; list code seams first |
| KR21-2 | Fold lane returns with corrections first | Say what the root got wrong, then what the lane settled |
| KR21-3 | Structure derives; meaning from names does not | Treat name and school hints as display-only, never as effect sources |
| KR21-4 | Separate mechanical from interpretive derivations | Mechanical = one field maps to one tag; interpretive carries INFERRED and a reader |
| KR21-5 | Golden cases from shown scenes before any derivation | A mismatch means the grammar row is wrong, never the record |
| KR21-6 | Sidecar, not schema change, for derived data | Keep licensed or canon records untouched; provenance travels with the source id |
| KR21-7 | Existing ledgers before raw reading | Name exact ranges for any gap; stay inside AU3 unless Weibao opens a plan |
| KR21-8 | One lane per named outcome | No lane without a done check; held lanes stay held |
| KR21-9 | Hand arithmetic is labelled and scratch runs are reported as scratch | Never present either as repo evidence |
| KR21-10 | Proposals stay proposals | No lens row selects build scope or reorders the standing UI priority |

ACT NOW: this map and the lenses, saved here for rerun. ACCOUNT FOR NOW: apply a lens only to a selected world slice; KL rows are palettes, not a
bundle every world must complete (KF1). LATER: fill the per-world map from existing cards and ledgers (lanes sent, doc only); higher cost items
(full-book gap reads, SRD count, sidecar proof) wait for Weibao's go.

### Round 21 fold: KL-MAP-A and KL-MAP-B returns, 2026-10-19

Lane outputs (doc only, existing cards and ledgers, no raw reading, nothing run):
[KL-MAP-A book worlds](../audits/world_depth_lenses_2026-10-19/KL_MAP_A_BOOK_WORLDS.md),
[KL-MAP-B anime worlds and others](../audits/world_depth_lenses_2026-10-19/KL_MAP_B_ANIME_AND_OTHERS.md).

**Corrections first: the per-world map's memory leads, checked against each world's own ledger**

| World | The lead I wrote (memory) | What the ledger says |
|---|---|---|
| KL21-C1 Jujutsu Kaisen | Grade ladder as a tier; vow cost as a dial | **Corrected.** Grade is an institutional label that lags real strength, not a power tier; a vow's terms are written per vow, so a vow dial is per-vow data, not one cost curve |
| KL21-C2 Bleach | Named-spell numbering and release levels | **Release stages confirmed** for the ordinary path (Shikai before Bankai, with Resurreccion a separate route). **Numbering unverified**: the ledger is silent |
| KL21-C3 Naruto | Rank ladder and element relations | **Rank corrected**: it is institutional access and duty, not a combat tier. **Elements unverified**: the ledger lists five-element relations as unresolved |
| KL21-C4 Fate | Class and rank structure | **Class-vessel structure confirmed.** Rank ladder unverified and version-bound (parameters, class labels and lore cards disagree across sources) |
| KL21-C5 Hunter x Hunter | Ability-type affinity as a ready relation graph | **Confirmed with a correction**: a six-category ring with approximate efficiencies, but Specialist is a categorical gate, not a percent, and some labels disagree |
| KL21-C6 Fullmetal Alchemist | Transmutation structure and limits | **Confirmed.** The only world here with a stated process grammar (comprehend, deconstruct, reconstruct); equivalent exchange tracks matter, composition and energy, not a coin meter |
| KL21-C7 Mother of Learning | Ward and mind-magic structure | **Partly confirmed.** Ward structure exists; counters are single facts, not a graph; five circles are named and spell membership is mostly unknown |
| KL21-C8 Lord of the Mysteries | Sequence ladder; formula structure | **Confirmed, plus a find I missed**: neighbor-swap groups form a ready relation graph (about eight groups plus one pathway with no standard neighbor, counted from prose) |
| KL21-C9 Circle of Inevitability | "Unknown" | **Evidenced.** Same ladder family, boons graded 9 to 0, and the strongest claim-status ledger: every claim tagged witnessed, narrator, character claim or actor inference. The edition is unauthenticated and suspected machine translation |
| KL21-C10 Shadow Slave | Rank ladder as tier | **Corrected.** Two ordinal axes (seven human ranks and a seven-step class by core count); rank-up is a gate event, not a threshold. Counters: silent, not none |
| KL21-C11 Reincarnation Paradise | Instance rule families | **Partly confirmed.** The mission pipeline has explicit default-and-dial wording; the deeper structure is a tier, attribute, enhancement and currency ladder, with Tier 1 to 9 bands marked inferred |
| KL21-C12 TTKS B1 to B5 | Power-bill cost structure as a dial | **Corrected for meaning.** The "power bill" belongs to B5 and is an observable trace, not itself a cost dial; B5's cost is electricity per charge. B1, B2, B3 and B4 have different costs (overdraw and voice, cooldown, per-challenge lives, credential expiry). The five books are different worlds |
| KL21-C13 A Soldier's Life | Low-magic supply and ration structure | **Low-magic half corrected** (dimensional-storage magic with fuel and attention costs); **ration half unverified**. The task is paused, so the research folder, not the thin card, is the evidence |

**Also corrected**
- **KL21-C14. The cards are thin and the ledgers hold the lens content.** Both lanes found that the 20 cards are consolidations with boilerplate floors; tier ladders, relation graphs and formula structure live in each world's deep dive, ledger and ability variants.
- **KL21-C15. A stale TTKS file.** `COVERAGE.json` is older than `CHECKPOINT.md` and still lists B1 as unread. Treat the checkpoint as authoritative.
- **KL21-C16. Delta for Frontier, HP and D&D.** Frontier now has code-level evidence for KL1 to KL4 and KL7; HP's "counter pairs" lead is gap G-A, a re-read of two spell scenes already read; D&D stays as DG-A2 found.

**Cross-world shapes the lanes found (all inferred mappings)**
- **Institutional rank versus real strength** appears in JJK, Bleach, Naruto and FMA with the same wording. One law family, with a dial for how far rank lags reality, could serve all four.
- **Ordinal ladder sidecar:** LotM, COI, Shadow Slave (two axes), Reincarnation Paradise, TTKS B1 and B5, and MoL circles share named steps with a gate event; the gate type must be a dial (potion digestion, Nightmare completion, promotion boundary), not an assumed threshold.
- **Relation graph:** LotM and COI swap groups, TTKS B3 counter-stages and B1 domain counters, and HxH's ring share an edge-with-locator row; JJK conditioned barrier and domain rows are relations with conditions.
- **Staged process:** Naruto, FMA, Bleach and JJK state ordered stages, which fits the strata approach with no engine edit; it does not fit Fate or HxH.
- **Per-instance costs** (JJK vows, HxH vows, Fate noble phantasms) are a record shape (terms written per instance), not a formula.
- **Claim-status letters:** COI's four statuses, RP's labels and the HP and D&D evidence labels are one pattern, usable for KL8 everywhere.

**Reading cost.** Nearly every cheapest lane costs zero source words and uses ledgers that already exist. The few that need text are Naruto's five-element graph, Bleach numbering, Fate ranks, the RP F17 recheck chapters, LotM formulas above Sequence 5, and the full SRD count; each fits inside one default reading envelope (four invocations, 48,000 source words) and waits for Weibao's go. Word counts were not measured.

**Open and unverified.** Both lanes read headings and targeted sections of the cards, not whole files, and did not open reader files or private wiki digests; "none" means none found. Counts like eight swap groups and 220 slots come from deep-dive prose. No code beyond headers was read for the book worlds.

**Next steps (proposal, ranked, none selected; all zero reading unless marked)**
1. LotM and COI ladder and relation sidecar (group counts sum to 22; each edge has a locator; COI deltas cite claim ids and status letters).
2. FMA formula-structure sheet and HxH adjacency sheet (continuity column; efficiencies left as ranges; Specialist has no percent).
3. One institutional-rank law family across JJK, Bleach, Naruto and FMA (four ledger locators; a lag dial).
4. Shadow Slave two-axis table, TTKS cost-dial rows per book (no shared "bill"), RP F17 to F22 table (inferred bands tagged), MoL circles and exercise graph.
5. Locator-only checks of existing notes for Bleach numbering, Fate rank and the Naruto element graph; record "not derivable from existing notes" where absent.
Everything stays a proposal; none selects build scope (KR21-10).
