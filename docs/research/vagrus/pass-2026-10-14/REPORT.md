# Vagrus deeper pass, 2026-10-14

**Status: PARTIAL.** The event scheduler, cooldown grammar, market calculation and travel-cost consumers are now source-read. Recruitment and DLC coverage are deeper but not exhaustive. Build **25598304 is unchanged** from the 2026-10-10 intake. No game was launched, save accessed, install changed or gameplay implemented.

**F1, SHOWN:** Vagrus schedules eligible records in layers. Priority can bypass the normal roll, and tasks can beat normal stories across categories. Separate event, step and choice histories govern repeats. The 1,178 rows are not a random pool. [Event grammar](EVENT_ENGINE.md).

**F2, SHOWN:** market stock, local demand, rarity, conditions and delivered import costs affect quotes. A quantity trade follows a changing price curve. Food, wages, cargo and delay determine whether the price spread pays. [Economy and travel](ECONOMY_TRAVEL.md).

**F3, SHOWN/STATED:** companions have authored recruitment and departure paths, quest-based growth caps and explicit rival exceptions. Alternate recruitment sites are not proof of re-recruitment. Paid expansion ownership remains unqueried; the manifest's extra depot is the Patronage Pack. [Companions](COMPANIONS_CREW.md), [DLC](DLC_CONTENT.md).

## Ranked PROPOSALS for YAIRPG

All rows are inferred adaptations, not accepted changes. They preserve reasonable reachable options, original content, existing save owners and explicit clocks. Ordinary play remains comfortable unfed with no hunger death. A 1440×900 desktop/laptop review should show route, cargo and costs together; mobile optimization is deferred.

| Rank | Proposal | Owner system | Smallest useful slice |
|---|---|---|---|
| P1 | **Trip quote with a safe reserve:** Show cargo revenue beside supplies, wages, rest and delay cost before a queued itinerary commits. | Village economy and travel; `src/village_content.js; src/absorb_d/fort.js; docs/MEANS_AND_APPRAISAL.md` | One funded Village-to-waypost delivery with one changed-route interruption. |
| P2 | **One event eligibility contract:** Separate authored prerequisites, scheduler priority, cooldown, costs and completion; show useful refusal reasons. | Chain-build and event engine; `docs/ENGINE_EXPANSION.md; src/simulation.js; src/simulation_contracts.js` | One three-step chain with an ambient competitor and exact saved deadline. |
| P3 | **Departure and return retain the person:** Save departure reason, unfinished promises, learned abilities and custody; reopen a world-qualified reconciliation route. | Companions; `docs/COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md; docs/worlds/NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md` | One optional helper leaves and can return through changed conditions without erased growth. |
| P4 | **Village demand with bounded funded stock:** Let a real order and finite stock change quantity quotes; keep money and inventory conserved. | Village economy; `src/absorb_d/fort.js; docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md` | One merchant and two original goods, with repeatable restock on the chosen clock. |
| P5 | **Cause-linked price information:** Stamp known prices and expose only information earned through a visit or messenger; estimates show age and uncertainty. | Information and travel; `docs/MEANS_AND_APPRAISAL.md; docs/PRESENTATION_AND_FOURTH_WALL.md` | A delayed report differs from an actual destination quote without leaking hidden stock. |
| P6 | **Companion story opens useful methods:** A completed promise unlocks a specific new service or method; record known, practiced and executable separately. | Companions and progression; `src/village_career.js; docs/COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md` | One lesson produces a useful paid or favor-based delivery contribution. |
| P7 | **Typed result bridge for deeper activities:** A contained activity returns success, loss, retreat and resource receipts to the existing chain rather than duplicating quest state. | Chain-build and exploration; `docs/ENGINE_EXPANSION.md; docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md` | One original salvage excursion settles a funded workshop input exactly once per receipt. |
| P8 | **Transport choices change logistics:** Different carriers alter real cargo, support and route access, including mundane or magical means when supported by the world. | Travel and world methods; `docs/MEANS_AND_APPRAISAL.md; src/realm_traveler_profiles.js` | Compare hand-carry and hired carrier for the same existing route; traveler prototype remains unverified. |

P1-P3 are the first choices. P4-P8 are separately scoped later options; none is a required implementation gate for this research pass. [Executable packet proposals](IMPLEMENTATION_PACKETS.md), [24 small touches](SMALL_TOUCHES.md), [Province War fit](PROVINCE_WAR_FIT.md).

## Prior-pass reconciliation

| Prior finding or unread area | Result in this pass | Evidence/limit |
|---|---|---|
| Build 25598304 and 1,178/17,223/34,323 legacy counts | Confirmed; decrypted event and AirTable hashes match exactly | RECOVERY.json and INPUTS.json privately; STRUCTURAL_INDEX.json publicly |
| F36-F37 structured choices and scoped heroes | Extended with actual scheduler, OR blocks, trigger scopes and transition ordering | EVENT_ENGINE.md; no all-story semantic claim |
| Runtime cadence/priority opaque | Corrected to **static source rules recovered**; runtime distribution still untested | PickEvent, ChooseEvent, EventTweak; no launch |
| F31-F35/F44-F46 food/pay/cargo | Confirmed consumers; extended with route and marginal market quotes | ECONOMY_TRAVEL.md |
| 58 Goods rows | Qualified: 37 are non-collection goods | AirTable Goods.Collection structural scan |
| F47 quest caps | Confirmed method includes 12 named companion cases and alternate final journal cases | GetMaxCharProwess; full quest narrative still unread |
| Re-recruitment exceptions opaque | Narrowed: alternate initial sites and durable blocking flags traced; no universal return rule | COMPANIONS_CREW.md unread table |
| Whole DLC/access opaque | Product systems identified; shared source and loaded/owned separation traced; entitlement still unknown | DLC_CONTENT.md with official product links |
| Prior private extracts and reproduce_tables.py available | **Corrected current state:** directory is missing. Recovered only required inputs into new lane area | TOOLING.md; no prior files deleted by this lane |
| F52 prose/action mismatch | Retained prior bounded finding, not enlarged or called a verified bug | No full external-hook closure in this pass |
| No idle/offline or heir loop established | Unchanged | YAIR idle adaptation must choose its own clock/continuity |

## Verification and gaps

Two encrypted tables reproduce the exact prior SHA-256 values; managed assembly and graph copies match installed inputs. Full metadata/command indexing and arithmetic probes pass. That establishes retained source and static mechanics, not runtime behavior. [Coverage](COVERAGE.json), [checks](VALIDATION.json), [tooling](TOOLING.md), [checkpoint and named gaps](CHECKPOINT.md).

Remaining research: full after-departure return closure for all companions; complete personal quest outcomes; full Sunken Tower, mountain/environment and specialist-guild systems; newer graph engine internals. Market route profitability, actual DLC access, gameplay balance and persistence remain unrun under the no-launch rule. Raw prose and decompiled code stay outside the repo. No owner files, source, tests, builds, git index or Province War files changed.


## Content reconciliation B406: full map/report review and exact connected-source limits

Every map gap and report row was read; source research stays PARTIAL. Event/step/choice histories, priority/eligibility/cooldown/OR blocks and transition ordering do not make1178legacy rows one random pool.17223steps/34323command headers are indexing, not full graph/story semantics. Quantity quotes use changing market curves; profit also needs food/wages/cargo/delay rather than a static buy/sell spread.58Goods rows include37non-collection goods. Twelve companion cap cases and alternate first recruitment sites do not establish return after departure or complete quests. Loaded DLC/shared hooks differ from owned/active expansion; a patronage depot is not all DLC. G1–G6 retain all named unread incoming paths, personal outcomes, DLC systems,46base/569subevent graph internals, tuning/route economics and runtime/save/entitlement boundaries. Prior missing extracts were not silently treated as retained; required inputs were recovered into the lane. Province War references were inspected as source material, not authority or permission for this task. Current desktop/book priorities qualify old1440/Village proposals without losing useful route-reserve, identity, typed result, customer and causal price information ideas.

Both local documents were fully read. The original findings/proposals, source-local IDs, recovery limitations and chronological history are preserved. This is not a fresh read of their underlying proprietary/open-source bodies, private evidence, runtime state or licence terms. Source research completion stays bounded; factual, native/persistence and human review states remain distinct. No gameplay, new world, installation/uninstall, private-save access, source acquisition or implementation wave was selected.
