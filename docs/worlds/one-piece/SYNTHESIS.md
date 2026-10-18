# One Piece world-pack synthesis

Status: Develop/Research synthesis proposal r1, 2026-10-15. This is the M5 synthesis outline from the [source deep dive playbook](../../research/SOURCE_DEEP_DIVE_PLAYBOOK.md). Every engine mapping, local story and gameplay direction here is a proposal (O). It is not accepted content, primary-canon authentication or implemented gameplay.

## 1. Sources, labels and prior work

**Source labels.** W is a dated One Piece Fandom assertion. M, SBS, GB, N, A, F and G identify the medium the wiki attributes to a particular claim: manga, SBS, guidebook, novel, anime, film or game. I is analyst inference; O is a YAIRPG proposal; U unresolved. A page may mix media, so labels belong to claims, not only page titles. Secondary evidence does not become primary fact by repetition.

**Prior work.** The [digest](../../research/power-systems/wiki-digests/DIGEST_one-piece.md) records the 2026-10-10 dump review and two earlier bounded source sections. The three worker [summaries](../../research/power-systems/wiki-digests/full-dumps/workers/one-piece-full/shard-a/SUMMARY.md), [shard B](../../research/power-systems/wiki-digests/full-dumps/workers/one-piece-full/shard-b/SUMMARY.md), and [shard C](../../research/power-systems/wiki-digests/full-dumps/workers/one-piece-full/shard-c/SUMMARY.md) describe coverage, exclusions and corrections. The underlying [shard A notes](../../research/power-systems/wiki-digests/full-dumps/workers/one-piece-full/shard-a/NOTES.jsonl), [shard B notes](../../research/power-systems/wiki-digests/full-dumps/workers/one-piece-full/shard-b/NOTES.jsonl), [shard C notes](../../research/power-systems/wiki-digests/full-dumps/workers/one-piece-full/shard-c/NOTES.jsonl) and [frozen manifest](../../research/power-systems/wiki-digests/full-dumps/onepiece_SOURCES.json) remain the record-level sources. This pack follows the M5 synthesis checklist and the [campaign framework](../CAMPAIGN_FRAMEWORK.md), [world completion template](../templates/WORLD_COMPLETION_TEMPLATE.md), [sealed-secret standard](../WORLD_SECRETS_AND_DISCOVERY.md), and [world-depth proposals](../WORLD_DEPTH_CONSIDERATIONS_2026-10-13.md) and [access/start proposals](../world-depth-2026-10-13/11_ACCESS_AND_STARTS.md). The existing One Piece world-depth row is proposal provenance, not source authority.

**Wiki material read in full versus by search.** Shards A, B and C report all 5,096 retained manifest selections complete (1,419 + 1,453 + 2,224), in frozen manifest order. A reports 13.47M selected characters, B 13.48M, and C 13.46M; each used bounded outputs up to 4,500 characters with read receipts. This is full reading of retained selected payloads, not every whole article: character entries may be selected mechanic-bearing spans; linked pages were not implicitly read. C separately reports 422 supplemental audits, including 258 text reads with overlap and 163 metadata-only exclusions; an empty selected character payload does not establish absence of an ability. Ten A corrections, 24 B errata entries, and C's three retained-note and two audit corrections are append-only and must be applied to the corresponding notes.

**This synthesis author's direct checks.** The Fandom S3 archive and frozen manifest have matching archive identity. I streamed and checked complete private page payloads and verified their SHA-256 against the frozen manifest for Devil Fruit r2129490, Haki r2127560, Seastone r2124153, Logia r2130814, Zoan r2129789, Paramecia r2119219, Nikyu Nikyu no Mi r2118422, Ope Ope no Mi r2121122, Hobi Hobi no Mi r2129333, Kage Kage no Mi r2122819, Rumble Ball r2109438 and Poneglyph r2128060. Targeted source-term checks confirmed the rules summarized in section 2. This is a search/spot-check pass over private snapshot payloads, not a second full read of the corpus and not primary canon authentication. [SPOTCHECK_1](../../gm/dispatch/wiki-lanes-2026-10-13/SPOTCHECK_1.md) identifies P2 actor attribution and P3 dropped conditions as risks; the cited core conditions were checked directly. The earlier digest's Devil Fruit r2129490 and Haki r2127560 sections were also compared.

**Blocked or missing.** The prior live wiki route returned HTTP 403; it was not retried. This synthesis did not read the original manga in full, did not separately collect primary SBS/guidebook/novel texts, did not run an M3 fan-premise survey, and did not independently authenticate every claim in every selected page. The Fandom snapshot is frozen 2026-10-10, with cited page timestamps through 2026-08-29. Any event/assertion after that snapshot is a gap. In particular, later chapter status in the world-depth note is not used to fill the story from memory.

## 2. Rules an engine would have to model

| Rule | Evidence | Proposed engine shape |
|---|---|---|
| A Devil Fruit is a lasting individual grant with swimming cost. | W1: Devil Fruit r2129490; manga attributions include early consumption and chapter 703 cycle. | Store actual fruit source, bearer, function and swimming weakness separately. Keep usual single-bearer cycle and recorded outlier as separate evidence cases; do not enforce an exception-free global cap. |
| Haki is trained will-based capability with distinct uses and reserve. | W2: Haki r2127560 and its observation/armament/Supreme King subpages. | Track learned function, training/control, current reserve, actual target and relevant grade independently. Rare Supreme King potential is an eligibility/source question, not XP unlock. |
| Counters are interaction-specific. | W3/W4: Seastone r2124153; Logia r2130814; fruit-specific examples throughout notes. | Resolve source, user, trigger, contact, medium, body state, range and counter per interaction. Seastone is not generic power erasure; ordinary impact, Haki and elemental counter differ. |
| Fruit families describe broad functions, not common activation scripts. | W5/W6: Zoan r2129789; Paramecia r2119219; Logia r2130814. | A named ability owns its trigger, target, scope, price, state change, counter and persistence. Keep edge cases and media/source labels attached. |
| A power effect may outlast its user's action or be reversed by a particular condition. | W7/W8/W9/W10: Nikyu r2118422; Ope r2121122; Hobi r2129333; Kage r2122819. | Store effect, target, custody, timer and reversal separately. User defeat is not a universal cleanup function. Explicitly test effect-on-user, environment, unconsciousness, death and restraint only where sourced. |
| Technique can require professional knowledge and finite resources. | W8/W11: Ope Ope no Mi r2121122; Rumble Ball r2109438; Law character pages in ledger. | Medicine, mastery, stamina, dose/time, and aftereffect are real prerequisites. ROOM distinguishes swapping two targets from moving an object without an exchange. Rumble Ball distinguishes early three-dose Monster Point, trained three-minute use, and later enhanced 30-minute use. Unknown intervals and procedures remain unknown. |
| Information is not the same as custody, translation or truth. | W12: Poneglyph r2128060; Water 7 Arc r2118675. | Record observer, source, copy, language skill, report confidence and physical holder separately. A copied record need not carry its meaning. |
| A route has physical and institutional conditions. | W13: Water 7 r2130946; Sea Train r2126998; ship failure in Water 7 Arc r2118675. | Model water, weather, hull condition, route, crew, cargo and capacity. A travel label does not make a ship viable. |
| Reputation/office is not a power scale. | Organization, bounty and character entries across all shards; specific scope in notes, not one universal ranking. | Social standing changes access, response or risk when an actor/institution uses it. It does not set a universal damage or victory result. |

## 3. Full catalog at a glance

| Catalog family | Coverage in this pack | Neighbors / interactions | Conflicts and limits |
|---|---|---|---|
| Devil Fruits and broad fruit families | Core rules and three broad categories in module catalogue | Haki, Seastone, water, individual body, awakening, medicine | No exhaustive fruit list; fruit origin remains a theory; exceptions to one-power norm exist |
| Haki | Observation, Armament and Supreme King at rule level | Fruit defenses, will, training, reserves, body strength | Page claims mix manga and supplement/adaptation; thresholds need primary audit |
| Fruit-specific effects | Ope, Nikyu, Hobi, Kage and Rumble Ball cases | Body, memory, cargo, medicine, command, duration, reversal | These samples are not a roster; some wiki inferences and unknowns remain |
| Ships, sea and island logistics | Water 7, Sea Train, East Blue/Water 7 saga leads | Navigation, weather, hull, provisions and route | Not a full geography/economy catalog; post-snapshot routes are gaps |
| Records and history | Poneglyph and chart/rubbing boundary | Language, access, custody, political pressure | Not a full history/chronology audit |
| Crews and institutions | Broad organizational evidence in notes | Recruitment, office, food, duty, law and coercion | No exhaustive faction/staff schedule; game-specific ranking is excluded |
| Artificial bodies and technology | Selected constructs, cyborgs, Pacifistas/Seraphim and artificial fruit notes | Material, control, energy, autonomy, custody | Production rules and control exceptions require individual source inspection |
| Adaptation variants | Shard notes label anime, film, novel and game claims at page/claim level | Can support a separately selected continuity | Never silently merge into manga assertions |
| Original player careers and starts | East Blue harbor/shipyard/convoy proposals | Ordinary work plus one or more special paths | Entirely O; requires director selection and playable proof |

No row claims complete coverage of all 5,096 original articles. Read scope is qualified as selected payload coverage.

## 4. Data model proposal

A local authored instance may compose the shared framework's WorldDefinition + ContinuityDefinition + EraDefinition + RegionDefinition + EntryProfile + ScenarioDefinition + PowerPolicy + FailurePolicy + TransferPolicy. These are authoring concepts, not implemented YAIR APIs. Proposed One Piece additions:

- BearerSource: actual person/body, source identity, custody/origin evidence, compatibility, permanence and current availability.
- AbilityDefinition: trigger, target kind, range/zone, medium, resource, condition, counter, persistence, interruption and evidence revision.
- TrainingRecord: teacher/source, method, practice conditions, learned control and current reserve. Inherited traits and learned control remain separate.
- MaterialInteraction: actual material, contact area/time, density/composition evidence, target and resulting state.
- TravelManifest: body, companions/consent, cargo owner, vessel, hull state, provisions, route evidence, obligations, return and absence policy.
- KnowledgeRecord: observer, event/page/report, confidence, interpretation, privacy and whether knowledge can be carried.
- BranchRecord: frozen start/copy identity, divergence trigger, seed, current actors and irreversible consequences.

Every record should carry a local revision and source provenance. None implies new save fields. Shared instance identity, migration/compatibility, actor custody and clock binding need an integrator decision before code.

## 5. How rules turn into play

| Rule | Proposed play | Existing seam / gap |
|---|---|---|
| Fruit source and weakness | A bearer chooses whether a sea crossing justifies the capability and secures an actual vessel/escort | Ability and body support need local pack definitions; no One Piece native binding was inspected |
| Haki methods | Practice sensing a specific ambush cue or armoring a compatible defense; reserve falls and later recovers under defined conditions | Existing skills and status/energy models may help, but exact compatibility and records need owner inspection |
| Material counter | Use a particular Seastone restraint or fruit-specific counter with actual custody/contact | No generic world material resolver should be assumed |
| Fruit-specific persistence | Save a target/effect/custody state, then observe its sourced reversal route | Needs durable event state and negative fixtures |
| Medical/craft paths | Deliver qualified service, diagnose a named issue or make a supported repair | Existing livelihood, jobs and projects can bind this; medical/ship facts need a selected local scope |
| Travel | Choose route, boat, food and crew; damage/weather can make one route fail | Shared world-instance, clock, travel and cargo state are dependencies |
| Information | Copy a record, acquire language help, then distinguish reliable transcription from interpretation | Knowledge and observer memory are modeled elsewhere; an explicit source/provenance binding is still needed |
| Organization | Join/leave a crew or institution through specific terms and available people | Avoid reputation-as-level; use actual local job/authority and obligations |

The proposed first slice deliberately avoids power implementation and canon-event dependencies so an ordinary local life can become playable first.

## 6. Living beside the protagonist: M3 status and starts

No separate M3 fan-fiction survey ran. The following are start/premise proposals drawn from local start/AU/access materials and the campaign design, not claims about fan consensus:

- **Working neighbor:** an East Blue resident whose repairs, route or food support can matter without joining the protagonist's crew.
- **Temporary crew member:** accepted by a specific crew for a defined berth and duty, with the risk and obligations visible before accepting.
- **Independent rival:** competing for a berth or resource, with no forced villain role.
- **Earlier branch arrival:** player enters a separate authored snapshot before a public canon occurrence; branch causes re-evaluate rather than guaranteeing the expected story.
- **AU relationship shift:** use relationship-flip and start-point dials only after local actors and obligations are authored; no source fact changes invisibly.

Access may be direct new-game start, an actual ship/chart invitation, or later discovered route. Frontier play is not required. Reveal only public start labels already unlocked; changed truths stay sealed. No M3 fan-consensus claim is made.

## 7. More to consider

- **Logistics can carry an adventure.** Storm windows, safe hull, berth, navigator trust and medicine custody give a noncombat character consequential play before any legendary power.
- **Information can outlive its interpreter.** Chart copies, rubbing custody, translation and political authority make records powerful without making every finder omniscient.
- **Power should keep its specific counter.** Fruit/Haki/Seastone interactions are tempting to flatten into one matchup system; sourced cases argue for exact interaction rows instead.
- **The world can support several play styles.** Crew duty, ship craft, medical aid, navigation, history and combat can connect in one port without each becoming a full prestige ladder.
- **Branches need believable travel.** A direct start and later voyage should arrive with compatible body, cargo, time, knowledge and obligations, rather than teleporting a protagonist plot into place.
- **The current source boundary is consequential.** A later status note falls after the snapshot and remains a gap, not an update to this pack. Any post-snapshot reveal, faction status or endpoint may materially change a proposed era and must be researched before use.
- **Seal only changed truths.** Public franchise twists are allowed by standing rule; an AU truth that differs from public canon needs an opaque ID, clues, skill route and payoff in its appropriate sealed owner.

## 8. First playable slice proposal

**Medicine delivery before the storm.** One direct East Blue start, one local harbor instance, five original recurring people, one medicine crate, one damaged skiff and one delivery deadline. The player can spend owned materials/time to repair and carry the crate, pay an available navigator for a shorter witnessed route, or refuse and allow the window to close. A tide ledger is optional route evidence, not a second cargo objective. Each crossing is a bounded authored resolution; there is no general sea, weather or navigation simulation in this slice, and the storm is only the deadline. The approaches produce distinct costs, custody, observer knowledge and relationship aftermath. Food cargo and a pirate shortcut are deferred. The slice can be played with no fruit, no Haki and no canon protagonist appearance.

Target UI: desktop/laptop at 1366×768, with offer, cargo, deadline, route evidence, cost and refusal visible in the existing surface system. Mobile optimization is deferred. The local interface and visible outcome are proposals. A later implementation gate must rebuild, exercise from a fresh browser origin, then save/reload/import the committed outcome. This synthesis reports none of those checks as run.

## 9. Gaps that would change the design

1. **Primary ability law audit:** before selecting any powered content, make a claim-level record of its asserted rule, underlying medium/version, and cited primary scene; directly inspect that scene. In particular verify fruit consumption/reincarnation and exception claims, Haki acquisition/reserve/advanced grades, Seastone density/contact, and representative Logia/Zoan/Paramecia conditions. Aggregate wiki rows can mix manga, SBS, guidebook, novel, anime or live-action claims. This could change the proposed ability/source data model and interaction resolution.
2. **Individual high-impact fruit cases:** inspect primary scenes for Ope lifespan/stamina/Haki boundaries and distinct exchange versus object movement, Hobi contact/contract/memory/reversal, Nikyu return conditions and unresolved disease contradiction, Kage donor coma/salt/timing, and Rumble Ball post-training and enhanced intervals. Missing conditions could change which cases are safe to implement.
3. **Era and chronology:** establish a bounded primary-manga timeline and character availability for any chosen start. Later-than-snapshot claims are not settled here; the story's future and ending are intentionally unknown.
4. **Sea travel/economy:** source-check a small opening region's weather, navigation, vessel capacity, prices and travel times. The campaign makes no canon claim about its invented harbor, prices or local cast.
5. **M3 premise survey:** no fan survey was run. If the player wants fan-style neighboring starts, gather current linked works and label inference separately before ranking.
6. **Shared runtime owners:** world instance identity, clock, direct-start selection, local inventory/cargo, knowledge, actor availability and migration must be mapped before implementation. Current docs define proposals, not bindings.
7. **World completion coverage:** map S00–S14 to these owners using the completion template when this world is selected for a full content wave. This pack is research-ready, not complete-world acceptance.

## Pack status

Created the eight owners requested: [WORLD_BRIEF](WORLD_BRIEF.md), [CAMPAIGN](CAMPAIGN.md), [MODULE_CATALOGUE](MODULE_CATALOGUE.md), [SOURCE_LEDGER](SOURCE_LEDGER.md), [ABILITY_VARIANTS](ABILITY_VARIANTS.md), [INTERACTIONS](INTERACTIONS.md), [GM_PROMPT](GM_PROMPT.md), and [IMPLEMENTATION_PACKET](IMPLEMENTATION_PACKET.md), plus this synthesis. All local content is proposed. No runtime edits, tests, build, browser run, save/migration, gameplay acceptance, project-authority edit or commit is part of this task.
