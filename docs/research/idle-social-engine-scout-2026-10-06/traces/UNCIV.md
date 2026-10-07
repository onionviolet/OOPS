# Unciv: adapt ordered research and qualified consumers

**Disposition: adapt patterns; keep YAIRPG JavaScript + Ink.** Two bounded source traces are complete by inspection: research destination to actual unit production, and a paid exclusive policy to conditional later science. One original field-bench trial is proposed and unimplemented. Unciv is no new dependency and this is no whole-game or expansion audit.

Official source pinned from `master` at `5bb7611a736f540486d6153d3f07b173d4ef91dd`, commit timestamp `2026-10-06T17:18:21+03:00`, checked 2026-10-06. [Pinned repository](https://github.com/yairm210/Unciv/tree/5bb7611a736f540486d6153d3f07b173d4ef91dd). Raw sparse public source, document HTML captures, hashes and read receipts stay outside Git at `/Users/weiwei/.codex/research/idle-social-engine-scout-2026-10-06/unciv/`; [functional JSON](UNCIV.json) records each inspected window and live YAIRPG fingerprint. No code, assets or source prose was copied into YAIRPG.

## Complete source traces

“Source-demonstrated” here means a code/data path was semantically inspected. It does not mean the game was run. Primary documents, inference, untested behavior and original design are separate in the JSON.

### Research destination -> useful means -> real production

| Stage | Exact observed source behavior | Evidence |
| --- | --- | --- |
| Prerequisite | With Agriculture known, Iron Working needs Mining then Bronze Working. Base science costs are 35 + 55 + 175 = 265; column costs load into concrete technologies. Availability conditions and all prerequisites are checked. | U03–U05 |
| Decision | A destination click expands missing predecessors; ordinary selection replaces the temporary queue, right-click appends unique predecessors. Confirmation installs that one queue. Unavailable paths disable the decision. | U05–U06 |
| Real cost/time | Queue selection pays no gold. The head absorbs actual end-turn science; costs vary with speed, map, cities, difficulty, known civilizations and uniques. Other destinations wait. A negative treasury plus negative gold output reduces science. | U05, U07–U09 |
| Mutation | Research adds the retained technology, removes its nonrepeatable queue entry/progress, retains overflow under a cap, updates resources and notifies explored Iron deposits. Understanding does not create Iron supply. | U07, U10 |
| Consumer | Swordsman needs Iron Working AND one available Iron resource capacity. It separately needs 75 base production before cost/speed modifiers. Completed construction calls real unit creation; research itself grants no unit. | U11–U14 |
| Failure/aftermath | Missing technology/iron gives concrete rejection. Unsupported construction is removed by revalidation. Completed production without placement space returns false and notifies instead of granting a unit. Retained research is not undone. The construction-cost counter advances even on placement failure, so zero mutation/refund is not inferred. | U12, U14 |

The researched unit is used only as a precise physical consumer trace. Combat, live upgrading, the complete iron extraction/trade/usage ledger and resource shortage penalties were not audited. No universal consumable-iron rule is inferred from `requiredResource`: this path needs one ongoing availability capacity.

### Culture -> exclusive branch -> conditional research output

| Stage | Exact observed source behavior | Evidence |
| --- | --- | --- |
| Prerequisite | Rationalism opens in Renaissance subject to policy prerequisites, no adopted Piety, and enough culture or a free-policy entitlement. The normal picker checks these conditions. | U15–U18 |
| Decision/cost | Confirmed adoption spends the current increasing/multiplied culture requirement and advances paid-policy count, or spends one free policy. Piety and Rationalism explicitly exclude each other through before-adoption conditions. | U15–U17 |
| Mutation | The adopted ID and its policy uniques remain retained; city stats refresh. Culture spent here delays another policy. | U16, U20 |
| Consumer | Rationalism adds +15% Science only at happiness >= 0. The policy unique reaches city percent bonuses, multiplies final science, aggregates into next-turn output and feeds the real research head. | U07–U08, U18–U22 |
| Failure/aftermath | Adopted Piety or insufficient culture blocks the normal Rationalism decision. Negative happiness fails the science conditional without deleting the policy, refunding culture or reopening the foregone branch. | U15–U19 |

This is an institution/economy pattern, not a YAIRPG religion, global happiness bar or empire simulation proposal. No romance, individual consent or rich dialogue consumer was established by the inspected Unciv slice.

## Depth retained beyond the small trial

The dispatch’s 2026-10-06 [depth clarification](../../../gm/dispatch/idle-social-gms-2026-10-06/ASSIGNMENT.md#depth-retention-clarification-2026-10-06) caps ranked candidates/packets, not findings. This bounded addendum preserves five useful joins without restarting source recovery:

- **economics -> science -> research time:** City science and treasury pressure are distinct. Negative gold rate and negative treasury reduce effective science; queue costs are science and waiting, not an invented gold payment. At deep upkeep shortfall (-200 gold and negative flow), endTurn disbands real military units and recomputes stats. Original YAIRPG implication: A paid field study should reserve actual actor/site inputs before work; do not treat wealth as automatic knowledge or create a duplicate abstract science owner. (U05, U08, U09)
- **research eligibility -> reveal -> physical means -> production -> placement:** All technology prerequisites, conditional availability, actual known Iron, available Iron capacity, production investment and tile placement remain separate gates. A technology reward grants neither materials nor unit. Unsupported queued construction is revalidated; placement failure gives notification instead of a fabricated unit. Original YAIRPG implication: Existing Eda research understanding enables constructing the real jig; held jig/offcuts/bench/body produce sound staves, and two staves/resin/effort produce actual kits. Destination view should expose whichever real gate is currently missing. (U03, U05, U07, U10, U11, U12, U13, U14)
- **new research -> obsolete planned production -> qualified work carryover:** Swordsman data names Steel as obsoleteTech and Longswordsman as upgradesTo. Those fields feed automatic in-production queue replacement. Already invested production transfers only when obsolescence is the sole rejection and a buildable upgrade exists; otherwise removed invalid unit work is not universally refunded. This source path affects production queues, not already fielded units. Original YAIRPG implication: Original larger proposal: new methods can change useful future work without erasing completed learning or pretending accepted reservations automatically convert. In this finite trial, preserve accepted ordinary job and let player cancel/reconsider only unreserved tail; no automatic recipe migration selected. (U11, U12, U24, U25, U26)
- **culture economy -> exclusive institution -> conditional future yield:** Turn culture funds adoption; normal picker checks era/prerequisites/exclusions/cost. Rationalism foregoes Piety and contributes conditional science, not an always-on reward. Happiness <0 suppresses the multiplier without restoring spent culture or reopening Piety through normal adoption. Original YAIRPG implication: Retain earned branch and actual physical consumer separately from temporary body/source/site support. YAIRPG already has this division; an institute must not replace it with a generic global reputation/happiness meter. (U15, U16, U17, U18, U19, U20, U21, U22, U08, U07)
- **base ruleset -> named expansion reach -> evidence boundary:** Core manager code is shared, but concrete prerequisite/cost/policy/unit data inspected here comes from G&K. Vanilla enum presence is inventory only; BNW mods and licensed DLC are outside this semantic audit. README roadmap does not establish exhaustive feature absence or DLC parity. Original YAIRPG implication: Treat future ruleset/world variants as source-qualified definitions with compatible owner contracts, not guaranteed adaptations from a label. (U01, U02, U03, U10, U11, U15, D02, D03, D04)

Obsolescence deserves its own limit: researching Steel can replace queued Swordsman production with the nation-equivalent Longswordsman. Saved production transfers only if obsolescence is the sole rejection and a buildable upgrade exists; other invalid removed unit work is not universally refunded. This read covers construction queues, not already fielded unit upgrades. U24–U26 retain the exact source.

Unselected deeper questions are paid diplomacy/research-agreement commitments, the full Iron ownership/extraction/trade/usage ledger, a pinned BNW ruleset’s consumers, and mid-queue conditional research invalidation. The inspected science-add methods directly advance the head; initial selection checks do not establish a later invalidation policy. These questions stay explicitly unread or partly gated in JSON; they do not delay the finite current finding or authorize another audit.

## Incumbent fit and original trial UNCIV-P1

Live YAIRPG already has paid firsthand-observation research -> understood measurement -> separately built physical jig -> useful stave salvage, plus exclusive loaded/fine specialization with real stamina/time consumers. The current source marks the delivery implemented-unverified. Research, exclusivity, actor inventory, job scheduling and persistence are existing services, not missing infrastructure.

**Original proposal: optional “make two survey kits from measured salvage” destination at Eda’s existing field bench.** Treat “field institute” as a small original work-group presentation in the same realm/body/location. A terminal-output view shows actual missing predecessors, support and next costs. Accepting it creates at most one finite existing workPlans cursor; it grants no knowledge or inventory.

| Finite step | Existing command | Nominal job time | Actual payment/use |
| --- | --- | --- | --- |
| study | `remainder_home.research` | 4 min | 2 native coins to Eda, 1 player stamina and 1 Eda stamina; once only |
| jig | `remainder_home.build_jig` | 3 min | 1 actual log, 1 sap, 1 player stamina; gives physical jig; once only |
| stave_a | `remainder_home.salvage_ordinary` | 4 min | 2 compatible offcuts, held/returned jig, 2 stamina; gives one sound stave |
| stave_b | `remainder_home.salvage_ordinary` | 4 min | 2 more compatible offcuts, held/returned jig, 2 stamina; gives one sound stave |
| kits | `reference_gameplay.resin_kits` | 3 min | 1 set resin, 2 produced sound staves and 1 stamina; gives two existing survey kits |

With neither once-only step completed and all support uninterrupted, source definitions imply 18 job minutes, 2 player coins paid to Eda, 7 player stamina, 1 Eda stamina, one log, one sap, four owned compatible dry offcuts and one set resin. Two intermediate staves become two existing kits; the owned jig is held/returned by both salvage jobs. This arithmetic is a proposed acceptance target, not measured runtime timing. Earlier paid study/jig receipts skip only their actual once-only steps.

The real choice is whether to spend those means/time now or keep them for other work. Existing manually earned delicate fitting reduces each salvage from 4 min/2 stamina to 2 min/1 stamina, but its own instruction pays two coins, one sap and effort and foregoes loaded-survey training. The trial ordinary queue stays useful without either branch. Never auto-adopt, switch or duplicate specialization through a generic command: current workPlans step kinds are command/travel/wait, and specialization requires the actual advancement host. A player may finish/cancel the accepted ordinary job under its stated policy, then reconsider only the unreserved tail.

The proposed destination adds only a selected finite definition and output/prerequisite UI/control adapter. `src/expedition_content.js:157` currently registers society/reference/reserve plans; `src/audit_remainder_home_host.js:25` presents home work without this destination projection; `src/main.js:852` admits only the cooling reference plan in that adapter. A future authorized integrator must add exact ID/revision dispatch for this destination. No arbitrary research graph, new currency, copied Unciv save, clock or publisher is selected.

Reuse `simulation.knowledge[actor]` plus receipts, the actor’s actual native/simulation inventory/resources, existing participant/site jobs, `feature_expansion_work_plan.js`, exclusive progression, `expansion_engine.js` common boundaries and `expansion_persistence.js`/`main.js` durable publication. Additive explicit enrollment/cursor only; absent/legacy cursors stay inert, and no schema change is selected here. Refresh the recorded dirty-source hashes before implementation.

### Later observable acceptance, all unrun

1. Fresh generated test state with required own observations shows missing prerequisites and exact per-step costs; reading a destination grants no jig, stock, knowledge or enrollment.
2. Accept one finite itinerary; only next job reserves actual costs; after 18 uninterrupted played minutes with no earlier once receipts, observe exact coin/material/effort transfers, one retained jig and two actual existing kits, with no free staves or repeated research.
3. Lose real Eda/source/contact during a supported research commitment, or spend the still-unreserved resin before the next resin-job boundary; observe declared refund/no-result or paused cursor as appropriate. Restore actual means and resume remaining unpaid work without duplicate completed effects. Do not mutate or appropriate already-reserved items.
4. Ordinary path remains usable for no/fine/loaded specialization; show the manual fine-route savings and foregone loaded choice, reject dual branch and auto-adoption, allow reconsideration only at safe job boundary.
5. After implementation and rebuild, generated-save reload/export/import preserve cursor/index/current reservation, resources/jig/kits/branch receipts; failed durable publication exposes no partial result and absent/legacy cursor grants no output.

Unciv no-space failure increments its construction-cost counter after attempting completion; the trial keeps YAIRPG’s existing staged paid-job/refund semantics instead of copying that exception.

Source/UI implementation, rebuild, generated-save player journey and durable publication evidence are separate gates. All proposed gameplay, unit, browser, reload/import/failure/director checks remain deferred and unrun. Nothing in this research report asserts this queue exists or works.

## Base, DLC, access and licensing

| Edition/reach | Actual coverage | Access/limits |
| --- | --- | --- |
| Unciv G&K | Selected technology/policy/resource/unit data plus shared consumers | Public source inspected at pin. Religion, espionage, complete ruleset and other content unread. |
| Unciv Vanilla | Built-in enum/inventory metadata only | Vanilla concrete content unread; shared managers do not establish identical data/whole-edition coverage. |
| Unciv BNW/other mods | Not acquired or source-audited | BNW appears on README roadmap and is absent from built-in enum. This does not prove all BNW mechanics are absent or any mod has full parity. |
| Licensed Civilization V/G&K/BNW | Current primary store documents only | Paid base game; both expansions require the base game. Executables/assets, ownership/install state and all gameplay/DLC contents unread. Other listed scenario/civilization/map DLC is inventory only. |

Unciv public source/rulesets are distinct from Firaxis/2K licensed Civilization V assets. No purchase, entitlement change or game installation is needed for this completed public-source inspection. Its README identifies MPL-2.0 code with named exceptions and mixed separate media licenses (U01/U23). Copying covered code would require preserving its license/notices and applicable source distribution terms; this proposal copies no code/assets/text and uses original design plus existing YAIRPG items.

Paid access evidence: [Civilization V base](https://store.steampowered.com/app/8930/Sid_Meiers_Civilization_V/), [Gods & Kings](https://store.steampowered.com/app/16870/Sid_Meiers_Civilization_V_Gods_and_Kings/), [Brave New World](https://store.steampowered.com/app/235580/Sid_Meiers_Civilization_V_Brave_New_World/), checked 2026-10-06. Prices were not needed for the decision and are not retained as stable facts. [Official Unciv docs](https://yairm210.github.io/Unciv/) support project identity; actual mechanisms use the pinned source below.

## Decision cost and limits

Adapt a focused destination pattern in the incumbent. Existing game/save reuse is high because every paid action remains YAIRPG-owned; a Kotlin/LibGDX replacement would need new host/UI/save/controller integration and has no demonstrated whole-task benefit. The inspected slice is useful for dependency, economy and conditional-effect authoring, while Ink remains the existing route for character scenes. Hex/city presentation adds no demonstrated value to this Village trial. Maintain one authored finite route against exact command revisions; broader planning, institutional membership and treaty systems are separate original proposals.

Coverage is the exact windows below, not complete files, games or expansions. Most downloaded `core/src`, docs and JSON content remains unread. Research agreements/diplomacy commitments, religion/espionage, AI strategy, live unit upgrading/combat, complete resource ownership/extraction/trade and shortage behavior, the full policy tree, Vanilla concrete rules and every BNW mod/licensed DLC remain unread. Searches only located windows; recovered/file counts are not semantic coverage.

## Source locators

All code/data references share the pinned SHA above. Full-file SHA-256 fingerprints, ranges and assertions are in `UNCIV.json` and external `SOURCE_MANIFEST.json`; every live YAIRPG owner is fingerprinted too because its dirty working tree is authoritative over HEAD.

| ID | Pinned source and inspected line ranges |
| --- | --- |
| U01 | [README.md](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/README.md#L19-L49) · 19–49, 105–109, 125–136 |
| U02 | [core/src/com/unciv/models/metadata/BaseRuleset.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/models/metadata/BaseRuleset.kt#L1-L7) · 1–7 |
| U03 | [android/assets/jsons/Civ V - Gods & Kings/Techs.json](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/android/assets/jsons/Civ%20V%20-%20Gods%20&%20Kings/Techs.json#L17-L20) · 17–20, 44–49, 54–57, 102–107, 148–151, 181–186 |
| U04 | [core/src/com/unciv/models/ruleset/Ruleset.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/models/ruleset/Ruleset.kt#L388-L398) · 388–398 |
| U05 | [core/src/com/unciv/logic/civilization/managers/TechManager.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/civilization/managers/TechManager.kt#L65-L88) · 65–88, 108–153, 156–211 |
| U06 | [core/src/com/unciv/ui/screens/pickerscreens/TechPickerScreen.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/ui/screens/pickerscreens/TechPickerScreen.kt#L129-L138) · 129–138, 214–219, 427–463 |
| U07 | [core/src/com/unciv/logic/civilization/managers/TechManager.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/civilization/managers/TechManager.kt#L243-L275) · 225–231, 243–275, 297–345 |
| U08 | [core/src/com/unciv/logic/civilization/managers/TurnManager.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/civilization/managers/TurnManager.kt#L279-L288) · 279–288, 301–323 |
| U09 | [core/src/com/unciv/logic/civilization/transients/CivInfoStatsForNextTurn.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/civilization/transients/CivInfoStatsForNextTurn.kt#L177-L181) · 177–181, 214–222 |
| U10 | [android/assets/jsons/Civ V - Gods & Kings/TileResources.json](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/android/assets/jsons/Civ%20V%20-%20Gods%20&%20Kings/TileResources.json#L108-L114) · 108–114 |
| U11 | [android/assets/jsons/Civ V - Gods & Kings/Units.json](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/android/assets/jsons/Civ%20V%20-%20Gods%20&%20Kings/Units.json#L479-L490) · 479–490 |
| U12 | [core/src/com/unciv/models/ruleset/unit/BaseUnit.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/models/ruleset/unit/BaseUnit.kt#L256-L289) · 256–289, 365–381, 490–496 |
| U13 | [core/src/com/unciv/models/ruleset/unit/BaseUnitCost.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/models/ruleset/unit/BaseUnitCost.kt#L13-L34) · 13–34 |
| U14 | [core/src/com/unciv/logic/city/CityConstructions.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/city/CityConstructions.kt#L322-L374) · 322–374, 377–404, 500–505 |
| U15 | [android/assets/jsons/Civ V - Gods & Kings/Policies.json](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/android/assets/jsons/Civ%20V%20-%20Gods%20&%20Kings/Policies.json#L218-L231) · 218–231, 423–435 |
| U16 | [core/src/com/unciv/logic/civilization/managers/PolicyManager.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/civilization/managers/PolicyManager.kt#L119-L128) · 119–128, 131–146, 170–180, 221–287 |
| U17 | [core/src/com/unciv/ui/screens/pickerscreens/PolicyPickerScreen.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/ui/screens/pickerscreens/PolicyPickerScreen.kt#L78-L86) · 78–86, 642–651, 665–675 |
| U18 | [core/src/com/unciv/models/ruleset/unique/Conditionals.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/models/ruleset/unique/Conditionals.kt#L141-L141) · 141, 191–194 |
| U19 | [core/src/com/unciv/models/ruleset/unique/UniqueMap.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/models/ruleset/unique/UniqueMap.kt#L121-L127) · 121–127 |
| U20 | [core/src/com/unciv/logic/civilization/Civilization.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/civilization/Civilization.kt#L482-L493) · 482–493, 637–648 |
| U21 | [core/src/com/unciv/logic/city/City.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/city/City.kt#L665-L677) · 665–677 |
| U22 | [core/src/com/unciv/logic/city/CityStats.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/city/CityStats.kt#L258-L265) · 258–265, 549–558 |
| U23 | [LICENSE](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/LICENSE#L160-L175) · 160–175, 185–204 |
| U24 | [core/src/com/unciv/logic/civilization/managers/TechManager.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/civilization/managers/TechManager.kt#L347-L351) · 347–351, 373–422 |
| U25 | [core/src/com/unciv/logic/city/CityConstructions.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/logic/city/CityConstructions.kt#L430-L466) · 430–466 |
| U26 | [core/src/com/unciv/models/ruleset/unit/BaseUnit.kt](https://github.com/yairm210/Unciv/blob/5bb7611a736f540486d6153d3f07b173d4ef91dd/core/src/com/unciv/models/ruleset/unit/BaseUnit.kt#L62-L64) · 62–64, 384–391 |

Research self-review: input pin/source worktree clean; exact ranges and hashes checked; JSON/link/source-reference checks recorded in `UNCIV.json`. No Unciv build/run, YAIRPG code edit/build/test, dependency install, private save/library access, account/purchase, commit/push/publication or cross-chat message occurred.
