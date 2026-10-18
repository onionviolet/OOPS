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
