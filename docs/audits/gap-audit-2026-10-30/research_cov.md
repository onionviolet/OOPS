# Research implementation packets: build coverage vs OOPS code

Scope: 94 packet files (every top-level `docs/research/<game>/IMPLEMENTATION_PACKETS.md|.json`, plus `cross-game-synthesis-2026-10-14/IMPLEMENTATION_PATTERNS.md`, `multiworld-synthesis-2026-10-14/IMPLEMENTATION_PACKETS.md` (a 1-paragraph alias to `PACKETS.md`, no packets of its own) and `additional-cultivation-2026-10-22/IMPLEMENTATION.md`). Two-level `aspects-*`/`pass-*` subfolders included only where the grep matched the top-level pattern; `private/` skipped. About 420 packet rows.

Method caveat: statuses come from keyword greps of `src/` and `tests/` plus rulebook lookups, not from reading the code. Rows marked "(inferred)" are the weakest. Treat BUILT as "files and tests with this mechanism exist", and UNBUILT as "no keyword hit and no rulebook owner found". A few path names in Evidence omit the `src/ui/` prefix.

Counts (rows): BUILT 31 (6 inferred), PARTIAL 280 (94 inferred), DESIGNED-ELSEWHERE 20, UNBUILT 115 (incl. parked/deferred/n-a).

### Shard 1 coverage (read-only grep pass; "(inferred)" = keyword evidence only, mechanism not read)

### docs/research/endless-ascent/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Visible repair gate: missing/supplied/ready optional cave mechanism [UI] | PARTIAL (inferred) | src/feature_expansion_destination_host.js, src/action_legibility.js | Low: cave is not LOTM lead-life |
| P2 | Weighted multi-category contribution puzzle with remaining requirement shown [UI] | PARTIAL (inferred) | "counterweight" in src/feature_expansion_destination*.js | Low: no LOTM hook |
| P3 | Encounter retry stating exactly what resets | PARTIAL | tests/defeat_domain.test.js; no retry-scope code found | Med: lead-life failures need reset clarity |
| P4 | Buy preparation supplies for next outing, atomic | UNBUILT | no match beyond src/data/traders.js pattern | Low |
| P5 | Warning plus remaining safe time and retreat for a hazard [UI] | UNBUILT | no safe-time gauge found; refuge only in book rosters | Med: LOTM corruption/exposure gauges |
| P6 | Blocked action names missing tool and next step | BUILT (inferred) | src/action_legibility.js projectKnownActionRequirements, src/mixture_feedback.js | High: reads in any panel at 1920 |
| P7 | First clear recorded separately from personal best | PARTIAL | src/life_record.js appendLifeMilestone exists; no first-clear/best split | Med: milestone strip in lead life |
| P8 | Collective errand checklist, order independent [UI] | PARTIAL | "checklist" in src/action_legibility.js only | Med: sequence/rite checklists |
| Small touches T01-T24 | Wording/receipt touches | PARTIAL (inferred) | src/action_legibility.js, src/event_feed.js | Low-Med |

### docs/research/zhutian-shuabao-lu/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| ZSL-P01 | One loot item with two useful destinations, costed quote [UI] | PARTIAL | src/mixture_native.js, tests/mixture_native.test.js, src/mixture_destinations.js | Med: potion materials |
| ZSL-P02 | Place offers training/repair service with alternate route | PARTIAL | src/institution_store.js, tests/institution_store.test.js | Med: Beyonder church/guild services |
| ZSL-P03 | Owned vs usable method with precise local reason [UI] | PARTIAL | src/techniques.js (knowledge vs execution saved apart), tests/techniques.test.js | High: sequence skills need means |
| ZSL-P04 | Settled routine returns exact receipt over interval | PARTIAL | src/away_ledger.js, tests/away_ledger.test.js, tests/retort_jobs.test.js | Med |
| ZSL-P05 | Known destinations explain value against current need [UI] | PARTIAL | src/known_routes.js, known_routes_ui.js, tests/known_routes_ui.test.js | Med |
| ZSL-P06 | One loot producer with auditable odds and modifier order | UNBUILT | no drop-odds module; tests/known_detail.test.js only | Low |
| ZSL-P07 | Place progress survives encounter retry | PARTIAL (inferred) | src/world_instances.js | Low |
| ZSL-P08 | Resident competence changes paid work choice | BUILT (inferred) | tests/resident_allocation_funding.test.js, src/audit_remainder_livelihood_host.js | Med |

### docs/research/scroll-of-taiwu/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Institution-shaped study: sponsor, approval, access, progress separate | PARTIAL | src/world_completion_learning_content.js, tests/village_study.test.js | High: church/club teachers in LOTM |
| P2 | Channel-specific succession of skills, items, bonds | PARTIAL | src/heir_inheritance.js, tests/heir_inheritance.test.js, heirloom_compact | Low: lead's single life |
| P3 | Manual with damaged section vs physical copies | PARTIAL | tests/manual_learning.test.js; no reference-copy/damage code | Med: LOTM grimoires/records |
| P4 | Worker and facility loop with maintenance | PARTIAL | src/field_works_ui.js, src/home_staff.js | Low |
| P5 | Distinct force training outcomes with strain | PARTIAL (inferred) | src/feature_expansion_powers.js, tests/lotm_self_ritual.test.js | Med: spirituality/strain |
| P6 | Readable cast updates with causes [UI] | PARTIAL | src/cast_schedule.js, src/cast_journeys.js | Med: cast ticker |
| P7 | Definition-to-instance typed links validated | DESIGNED-ELSEWHERE | docs/ARCHITECTURE_RULES.md (AR); src/proto23_world_state.js (inferred) | Low |

### docs/research/remnant-2/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| R2-P01 | Preview crossing/reroll by carrier rows [UI] | PARTIAL | src/ui/crossing_threshold.js, tests/crossing_threshold.test.js; docs/worlds/MULTIVERSE_STRUCTURES.md | High: world entry for LOTM |
| R2-P02 | Place rule with hazard, mitigation, exit cleanup | DESIGNED-ELSEWHERE | docs/worlds/WORLD_CORE_KIT_SUCCESSOR_2026-10-14.md (K2/K5/K10) | Med |
| R2-P03 | Unlocked/trained/equipped/usable distinct faculties | PARTIAL | src/feature_expansion_powers.js, tests/ability_records.test.js | High |
| R2-P04 | Conversation settles a real transaction | PARTIAL | src/ink_narrative.js commitInkNarrativeAction, tests/ink_lin_parity.test.js | Med |
| R2-P05 | Arbitrate ambient speech, silence fallback | PARTIAL | src/person_silence.js (silence verdict, different intent) | Low |
| R2-P06 | Pinned generated visit recipe with required roles | UNBUILT | no recipe/roles code; docs/worlds/MULTIVERSE_STRUCTURES.md mentions | Low |

### docs/research/crusader-kings-3/IMPLEMENTATION_PACKETS.json
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Broken promise adds stress; relief choice leaves habit | DESIGNED-ELSEWHERE | docs/ENGINE_EXPANSION.md, docs/CHARACTERS_AND_WORLD_EVENTS.md (coping) | Med: lead life stress |
| P2 | Confidant bond from paid conversation, cooldown | PARTIAL | src/ui/relationship_web.js, src/person_memory_effects.js, tests/companion_bond_rite.test.js | High |
| P3 | Heirloom recipient choice leaves family rival | PARTIAL | src/heirloom_compact.js, src/heirloom_items.js, tests/heirloom_compact.test.js | Med |
| P4 | Semantic memory retention, participant tombstones | DESIGNED-ELSEWHERE | docs/LIFE_SIM_NORTH_STAR.md (tombstone); src/person_memory*.js partial | Med |
| P5 | Authored history vs played-life deltas | PARTIAL (inferred) | src/memory_messages.js, tests/person_memory_persistence.test.js | Med |

### docs/research/elin/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| 1 | Two funded resident shifts yielding survey kits | BUILT (inferred) | tests/resident_allocation_funding.test.js, src/audit_remainder_livelihood_*.js | Low |
| 2 | Home-work amenity (timber cover) changes wet job | PARTIAL | src/field_works_extension_content.js, src/home_furnishing_content.js; no rain-cover code | Low |
| 3 | Research unlocks reusable measuring jig | PARTIAL (inferred) | "jig"/"offcut" in src/audit_remainder_home_content.js | Low |
| 4 | Earned specialization with tradeoff | PARTIAL (inferred) | src/audit_remainder_home_content.js, src/feature_expansion_powers.js | Med: pathway branch |
| 5 | Stock-backed local supply opportunity | UNBUILT | no match | Low |

### docs/research/majoras-mask/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Observed appointment on existing clock, late = hearsay | PARTIAL | src/world_rhythm.js, src/cast_schedule.js, src/book_world_lotm_cast_host.js | High: LOTM meetings, clock |
| P2 | Notebook rows: history vs this attempt [UI] | PARTIAL | src/chronicle.js hearsay, docs/BOOKSHELF_INSPIRATION.md | High: Notebook row strip |
| P3 | One intervention reroutes interlocking NPC routine | PARTIAL (inferred) | src/cast_schedule.js, src/cast_journeys.js | Med |
| P4 | Source-qualified reset contract, retained vs reset | DESIGNED-ELSEWHERE | docs/worlds/MULTIVERSE_STRUCTURES.md; no loop code | Med: LOTM Klein loop-like beats |
| P5 | Safe wait until known appointment, stops at choice | PARTIAL | src/wait_until.js (quote over clock); tests/continuation_browser.mjs | High |

### docs/research/super-robot-wars/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Canon beats survivable via fate field and conditions | PARTIAL | src/causal_situations.js, src/world_rhythm.js; no fate field found | High: LOTM canon beats |
| P2 | Mastery counter from optional objectives | UNBUILT | no matching counter | Low |
| P3 | Canon and IF ending per arc, picker on later lives | DESIGNED-ELSEWHERE | docs/worlds/world-depth-2026-10-13/17_CARRYOVER_AND_RETROFIT.md | Med |
| P4 | Theater board: key vs optional missions [UI] | UNBUILT | substrate src/work_ledger_system.js, src/known_routes.js | High: arc board for book worlds |
| P5 | Converged-world AU pack with awareness dial | DESIGNED-ELSEWHERE | docs/worlds/MULTIVERSE_STRUCTURES.md | Low (deferred) |

### docs/research/kittens-game/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| K-P1 | Shortage row: held, required, missing, rate, ETA [UI] | PARTIAL | src/mixture_feedback.js, src/action_legibility.js, tests/mixture_feedback.test.js | High: material gauge row |
| K-P2 | Stop cause plus remedy beside job [UI] | PARTIAL | src/feature_expansion_work_plan.js workPlanView, tests/routine_jobs.test.js | High |
| K-P3 | Two destinations for one chain output | PARTIAL | src/mixture_native.js, tests/mixture_native.test.js | Med |
| K-P4 | Learned/permitted/means/usable shown independently [UI] | PARTIAL | src/simulation.js previewSimulationCommand, src/techniques.js | High |

### docs/research/rune-factory-5/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| RF-I1 | One stock, two outcomes quoted together | PARTIAL | src/mixture_native.js, tests/refit_k1_k2.test.js | Med |
| RF-I2 | Useful work grants one technique evidence | BUILT (inferred) | src/techniques.js, tests/techniques.test.js | High |
| RF-I3 | Attempt state survives; success/fail/refusal responses | PARTIAL | src/ink_narrative.js, src/person_memory_effects.js | Med |
| RF-I4 | Assignment, phase, last receipt, next blocker [UI] | PARTIAL | src/feature_expansion_work_plan.js, src/owed_ledger_view.js | High |

### docs/research/disco-elysium/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Skill speaks a private observation in conversation | UNBUILT | src/talk_dialogue_host.js substrate only | High: Beyonder intuition voices |
| P2 | Failed action rewritten as new situation | PARTIAL | src/mixture_feedback.js failure text | Med |
| P3 | Conversation plants a question to study and return | PARTIAL | src/village_career.js, tests/village_study.test.js | Med |
| P4 | Faculty-attributed fallible claim corrected by evidence | PARTIAL | src/observation_ui.js, tests/observation.test.js | High: divination/Spirit Vision |
| P5 | Retry reason for failed gate [UI] | UNBUILT | none | Low |
| P6 | Optional amnesia origin with past obligation | UNBUILT | none | Med: LOTM transmigrant start |
| P7 | Reasons contributing to a check in tooltip [UI] | PARTIAL | src/person_silence.js returns factors; no tooltip | High |
| P8 | Guide-style narrative cutaway, player-only | UNBUILT | none | Low |

### docs/research/path-of-achra/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Pending-effect row with deterministic tie rule [UI] | UNBUILT | none; review says later | Low |
| P2 | Earned charge action, gain and spend triggers | PARTIAL (inferred) | src/reference_gameplay_content.js; review: adopt-now, not started | Low |
| P3 | Exclusive temporary stance with extension | UNBUILT | "stance" hits unrelated | Low |
| P4 | Damage-type recovery path | UNBUILT | dropped, PROPOSAL_REVIEW | Low |
| P5 | Move or wait consequence in destination | UNBUILT | review: later | Low |


### Shard 2 coverage check

Statuses from grep of src/ and tests/ plus docs indexes; "(inferred)" means keyword and file-header evidence only, no code read. Packet lists are proposals ("proposal_not_authorized", "PROPOSALS ONLY") unless noted.

### docs/research/noita/IMPLEMENTATION_PACKETS.json
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Exact-identity vs profile ingredient matching, fit distinct from knowledge | PARTIAL | src/craft_material_fit.js gradeMaterialFit; src/lotm_ingredient_catalogue.js; tests/craft_engine.test.js | High: LOTM potion ingredient substitution |
| P2 | Conserved mixtures, split/pour/drink/break keep constituent amounts | PARTIAL | src/mixture_state.js, mixture_native.js, craft_process_separation.js; tests/mixture_state.test.js | Med: vial custody, LOTM brewing |
| P3 | Pour vs swallow routes, body coating and wet-fire checks | PARTIAL (inferred) | src/mixture_destinations.js, gear_work.js (coating) | Med: LOTM potion/harm routes |
| P4 | Recipe fit and purity/amount axes separate from workmanship | PARTIAL (inferred) | src/craft_material_fit.js, hp_ingredient_substitution.js; tests/hp_ingredient_substitution.test.js | High: formula quality in LOTM brew |
| P5 | Technique groups, modifier before multicast, delayed payload dispatched once | PARTIAL | src/spell_seam.js (origin/prepare/failure/strain), spell_adapter_lotm.js; tests/spell_seam.test.js; no multicast found | Med: LOTM abilities, order/charges |
| P6 | Resolved seeded secrets persist across reload and catalogue upgrade | PARTIAL (inferred) | src/seeded_streams.js, mixture_discovery.js; tests/mixture_discovery.test.js | Med: stable hidden recipes |
| P7 | Owned effects compose by declared operators; mutations record scope | PARTIAL (inferred) | src/tag_store.js, rules.js | Low: engine plumbing |
| P8 | Third-constituent requirement, explicit known absence, bounded area conversion | UNBUILT | none (hits unrelated) | Low: Noita-specific |
| P9 | Shared body rules, directed faction A-to-B hostility | UNBUILT | no directed-hostility code; src/jurisdiction_rules.js is statutes only | Med: LOTM church/organisation relations |
| P10 | Evidence-led discovery of a substitute property with provenance | PARTIAL | src/mixture_discovery.js; tests/mixture_discovery.test.js | High: learning ingredient properties |

### docs/research/additional-cultivation-2026-10-22/IMPLEMENTATION.md
Status log of one lane (C7/C9/C10), not packets; rows are its three selected cases.
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| C7 | Practiced method lowers native reserve cost, settles once | BUILT | doc cites sluice native proof; src/feature_expansion_work_plan.js; doc reports tests pass | Low: cultivation, not LOTM |
| C9 | Hazard reads current body faculty (weathered skin, gust terms) | BUILT | src/body_progression.js; tests/cultivation-body-carrier.test.js, cultivation-exposure-status.test.js (per doc) | Low: cultivation |
| C10 | Named helper reserved for commission, output into custody | BUILT | per doc: Toma gather job; src/feature_expansion_society_host.js (inferred) | Med: household staff idea |

### docs/research/multi-realm-muds/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| MW-P1 | Conditional transit: inspect known conditions, cross, refuse | PARTIAL | src/simulation_contracts.js, src/book_world_paradise_host.js, backlog_expansion_transit.js (inferred); ui/crossing_threshold.js | Med: book-world entry/crossing |
| MW-P2 | Learned method vs current support vs membership, kept apart | PARTIAL | src/techniques.js techniqueFacts; feature_expansion_book_roster.js (inferred) | High: LOTM sequence knowledge vs means |
| MW-P3 | Small-area authoring and maintenance card with validator [UI] | PARTIAL | src/world_pack_manifest.js, structured_pack_definitions.js; no card | Low: authoring, not play |
| MW-P4 | Carrier-specific retention preview at exit boundary [UI] | PARTIAL | src/structured_renewal.js; tests/structured_renewal.test.js; heir_inheritance.js | Med: transmigration/entry rules (WER) |
| MW-P5 | Local deed opens one remembered service at an institution | PARTIAL (inferred) | src/jurisdiction_rules.js, reputation_state.js; no deed-to-service join found | High: LOTM church/guild standing |
| MW-P6 | Explicit actor for delayed NPC scheduled work | PARTIAL | src/causal_story_host.js, feature_expansion_work_plan.js (inferred) | Low |
| MW-P7 | Desktop readiness view: destination condition, method, actions together [UI] | PARTIAL | src/action_legibility_ui.js; UI_RULES.md:261 readiness rule | High: 1920 panel of requirements beside action |

### docs/research/immortality-idle/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Station runs one batch per matching work day | UNBUILT | no per-day station found; seams home_furnishing_host.js | Low: Village crafting |
| P2 | Aptitude earned from life's real gain, seeds next life | PARTIAL | src/body_progression.js, skill_records_domain.js; IDEA_INDEX.md:298,616; no gain-delta carry | Med: heir/next-life start |
| P3 | Saved named plans with one switch trigger [UI] | UNBUILT | only one weak hit (feature_expansion_society_host.js) | Low |
| P4 | Family trade bonus, one apprenticeship per life | PARTIAL | src/heir_inheritance.js, family_tree.js (apprentice link), material_apprentice.js; tests/family_tree.test.js | Med: LOTM lead's family |
| P5 | Named lifespan ledger listing sources and ceilings [UI] | PARTIAL | src/chronicle.js lifespanDeadline (base only); chronicle_ui.js; RULES_INDEX.md:172 | Med: lifespan from Beyonder sequence |

### docs/research/sapiens/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| S-I1 | Typed blocker projection: known missing input/tool, next action [UI] | BUILT | src/action_legibility.js, action_legibility_ui.js (projectKnownActionRequirements) | High: explains why a step is blocked |
| S-I2 | Learned/allowed/held/ready-now fields for one action [UI] | PARTIAL | src/techniques.js techniqueFacts, technique_ui.js; tests none direct | High: LOTM ability usability |
| S-I3 | Dry-to-kit lot with passive stage and retained progress | PARTIAL (inferred) | src/audit_remainder_home_content.js, craft_process_thermal.js; tests/craft_process_thermal.test.js | Low |
| S-I4 | Experiment completes into a useful application with provenance | PARTIAL | src/mixture_discovery.js, systems_workshop_content.js | Med |
| S-I5 | Practice without mastery, teacher vs study routes | PARTIAL (inferred) | src/techniques.js activePractice, material_apprentice.js | Med |
| S-I6 | Reusable container identity separate from contents | PARTIAL | src/structured_container_runtime.js; vessel_geometry.js | Med: vials and flasks |

### docs/research/factorio/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| FAC-P01 | Finite retort, two outputs, residue tray stalls next batch | PARTIAL | src/craft_process_separation.js (distill/decant plans), craft_process_thermal.js | Low: Village |
| FAC-P02 | Measure better tool, finish/serve/salvage, function used later | PARTIAL (inferred) | src/craft_materials.js, audit_remainder_home_content.js | Low |
| FAC-P03 | Volatile lot with deadline and useful spent form | UNBUILT | no lot-expiry family; only crop/info freshness (information_freshness.js) | Med: LOTM ingredients that spoil |
| FAC-P04 | Supplier route with capacity, fuel, interrupted delivery | UNBUILT | no supplier-route code | Low |
| FAC-P05 | Working sample teaches a context-dependent process | UNBUILT | no sample-teaches code | Low |

### docs/research/melvor-idle/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| MEL-P02 | Choose resin or frame recipe for finite kit reserve | UNBUILT (stated gap) | doc: work_plan admits resin only; src/feature_expansion_work_plan.js | Low |
| MEL-P03 | Survey knowledge becomes a finite recovery lead | UNBUILT (stated gap) | src/audit_remainder_home_content.js records knowledge only | Low |
| MEL-P04 | Accepted guard-and-withdraw policy for an encounter | UNBUILT (stated gap) | doc cites feature_expansion_battle.js lacks manifest | Low |
| MEL-P01 | Settlement slip joining jobs to stock/time deltas [UI] | UNBUILT | no slip view; work_ledger_ui.js and owed_ledger_view.js are neighbours | Med: ledger strip for commissions |

### docs/research/trimps-antimatter/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Routine pauses before a step a local rule forbids | UNBUILT | no routine-permission hits; src/feature_expansion_work_plan.js | Low |
| P2 | Run-purpose label and objective on a transition preview [UI] | UNBUILT | src/structured_renewal.js has lost/retained rows, no purpose | Med: lead-life stage framing |
| P3 | Expedition entry freezes threat and reward facts | PARTIAL (inferred) | src/proto23_world_content.js, life_experience_host.js expedition hits | Low |
| P4 | Relic helps information bottleneck, carrier across transition | PARTIAL (inferred) | src/heir_inheritance.js heirloom_compact.js; park per doc | Low |
| P5 | Reward lifetime labels: "until life ends" vs "carried" [UI] | UNBUILT | no label code | Med: LOTM item carry across death |

### docs/research/ngu-idle/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Quantified transition preview: current, next, loss, retention [UI] | PARTIAL | src/structured_renewal.js; tests/structured_renewal.test.js (rows exist; doc says gap is presentation) | Med |
| P2 | Unlock reasons: learned vs usable vs blocked [UI] | PARTIAL | src/technique_ui.js, techniques.js techniqueFacts | High |
| P3 | Desktop activity board: two live activities plus next action [UI] | UNBUILT | no board; action_legibility.js, simulation work-plan projections are sources | High: 1920 width has room |
| P4 | Voluntary restriction on existing solution | UNBUILT | none | Low |
| P5 | Retained-practice projected cost equals actual | PARTIAL (inferred) | src/techniques.js | Low |
| P6 | Ready-result reminder, disappears on settlement [UI] | UNBUILT | none | Med |
| P7 | Capacity-return projection from work plan | UNBUILT | none | Low |
| P8 | Multi-means project with distinct causal inputs | UNBUILT (parked) | none | Low |

### docs/research/wildermyth/IMPLEMENTATION_PACKETS.json
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Mentor retires and trains one apprentice | PARTIAL | src/family_tree.js, material_apprentice.js, heir_inheritance.js (apprentice as recipient); no retirement-lesson | Med |
| P2 | Scars keep history, temporary recovery cost separate | PARTIAL (inferred) | src/body_progression.js, village_career.js wound hits; no scar annotation found | Med |
| P3 | Origin tags unlock one later callback | PARTIAL (inferred) | src/causal_story_ui.js, cast_ability_adapter.js; no tag-to-callback join confirmed | High: lead-life callbacks to origin |
| P4 | Compact chapter records and explicit legacy carry [UI] | PARTIAL | src/life_record.js, chronicle.js, continuation_ui.js; no chapter compaction | Med |

### docs/research/free-text-worlds-2026-10-14/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| FT-I1 | Two culture traits shared by vessel and doorway | UNBUILT | no culture-trait code | Low |
| FT-I2 | Home room, owner, guest, jurisdiction restriction | PARTIAL | src/jurisdiction_rules.js; tests none seen | Med |
| FT-I3 | Queued routine gives return summary and project goal [UI] | UNBUILT | no return-summary hits | High: offline return card |
| FT-I4 | Repeat NPC commission pays per order, satisfies need | PARTIAL | src/work_ledger_system.js, work_ledger_ui.js | Med |
| FT-I5 | Parent doctrine plus permitted variant | PARTIAL (inferred) | src/lore_history_state.js (3 doctrine hits) | Low |
| FT-I6 | Event fact gives dated record and clue to place [UI] | PARTIAL | src/knowledge_view.js, chronicle_ui.js; docs/TIMELINES_AND_DIVERGENCE.md | High: LOTM investigation |
| FT-I7 | Living power: custody, upkeep, activation, recipe | UNBUILT | no living-power hits; W15 schema doc only | Low |

### docs/research/soulash-2/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| O1 | Timber: logs to planks via workbench, visible pause | BUILT | doc review: skills.timber.pack shipped; src/audit_remainder_home_content.js | Low |
| O2 | Skill milestone unlocks alloy recipe | BUILT | doc review: slice D1; src/simulation_effects.js alloy hits | Low |
| O3 | Spell unlock, cost, practice XP on valid cast | BUILT | doc review: practice commands; src/spell_seam.js, tests/spell_seam.test.js | Med |
| O4 | Reversible four-state element shaping | UNBUILT (deferred) | doc: needs item-valuation decision | Low |


### Shard 3 coverage (packets vs OOPS code), read-only check 2026-10-30
Method: keyword grep over src/ and tests/, plus doc lookup. "(inferred)" = judged from a keyword hit, not a code read.

### docs/research/planescape-torment/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Record shows written-by, interpreted-by, confirmed-by provenance on a notebook | PARTIAL (inferred) | src/proto23_world_state.js notebook; src/life_record.js; no interpreter field | Med: LOTM diaries and notes fit |
| P2 | Witness recognizes old token, claims inherited promise; fulfil/contest/refuse | PARTIAL (inferred) | src/claim_runtime.js, witness hits only; no inherited-promise record | Med: fits past-life/Beyonder history |
| P3 | Keepsake yields one-time memory receipt feeding a downstream encounter | PARTIAL (inferred) | src/book_world_beginning_registration.js keepsake; no recovery receipt | Med |
| P4 | Authored local identity axes (candor, reliability) NPCs react to | PARTIAL | src/chronicle.js relationshipChange axes; src/simulation_contracts.js | Med: NPC reactions to the lead |
| P5 | Optional world-local revival with body/knowledge/items return contract | PARTIAL | src/book_world_player_agency_contracts.js return contract | Low: LOTM revival is rare |
| P6 | Prior-self fragment as negotiator with one motive | UNBUILT | no hits | Low |
| P7 | Body-specific hazardous job using regeneration source | UNBUILT | no hits | Low |
| P8 | Enemy responds to known return with restraint/containment | UNBUILT | no hits (containment only in craft_process_thermal.js) | Low |

### docs/research/ur-quan-masters/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| UQM-P1 | Voice with purpose remembers an unpaid or changed meeting | PARTIAL (inferred) | src/person_memory.js, src/talk_view.js (ui); no changed-evidence greeting | High: LOTM contacts remember meetings |
| UQM-P2 | Paid information unlocks a real route, fact vs proof separate | UNBUILT | no "paid information"/route unlock hits | High: Tarot Club / Divination info broker |
| UQM-P3 | [UI] Travel quote shows departure, transit, arrival cost and return means | PARTIAL (inferred) | src/feature_expansion_destination_host.js return plan | Med: city-to-city travel |
| UQM-P4 | Generated site remembers removed items via seed plus saved changes | PARTIAL (inferred) | src/simulation_effects.js depleted; no seed/revision | Med |
| UQM-P5 | Alliance grants service or usable equipment after deed | UNBUILT | alliance only in story_insight_domain.js | High: Church/Tarot Club services |
| UQM-P6 | Travel layer changes cost, schedule or exits | UNBUILT | no hits | Low: spirit world only |
| UQM-P7 | Return news separates hearing from reward receipt | PARTIAL | src/return_digest.js; tests/return_digest.test.js (no reward receipt) | High: lead returns to Tingen |
| UQM-N1 | Expedition fitting trades cargo room for range/protection | UNBUILT | no hits | Low |

### docs/research/multiverse-idle/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| MI-P01 | [UI] Work and explanation (blockers, duration, cost) beside the action | PARTIAL | src/structured_pack_ui.js blockers beside buttons; tests/structured_pack_ui.test.js | High: wide 1920 screen has room |
| MI-P02 | [UI] Inspector showing trigger, quantity or chance for each reward/modifier | PARTIAL (inferred) | src/display.js modifier text; src/check_resolver.js | High: check odds in LOTM rites |
| MI-P03 | [UI] Origin-filtered roster with list plus selected detail | UNBUILT | src/organization_view.js roster has no origin filter | Med: world-origin filter for cast |
| MI-P04 | [UI] Newly useful unlock stays findable in navigation with cause | PARTIAL | src/workspace_layout.js reveal vs eligibility | High: many book-world panels |
| MI-P05 | [UI] Rate, cap, next milestone share one breakdown | PARTIAL (inferred) | src/display.js breakdown; src/life_experience_host.js milestone | High: Sequence digestion progress |
| MI-P06 | Return receipt and allowance separate; summary grants nothing | PARTIAL | src/away_ledger.js, src/return_digest.js; tests/away_ledger.test.js, tests/return_digest.test.js | Med |
| MI-P07 | [UI] Save/stop status labels and repeated-log counts | UNBUILT | only logCount in src/audit_remainder_offers_state.js | Med: noisy event feed |

### docs/research/legends-of-idleon/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Workshop/field chain: stock, funded order, downstream tool changes result | DESIGNED-ELSEWHERE | docs/MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md; craft code exists | Med |
| P2 | [UI] Output per game hour, limiting input, modifier source beside work | PARTIAL (inferred) | src/structured_pack_ui.js blockers; src/craft_sources.js perHour | High |
| P3 | [UI] Receipt for settled work: minutes, output, limiter, next action | PARTIAL | src/invention_receipts.js, src/return_digest.js | High |
| P4 | Document actor/stock/institution/world gain owners before roster | UNBUILT | no matches; owners are docs/CHARACTERS_AND_WORLD_EVENTS.md | Low |
| P5 | Learned tool/service removes one routine step, costs visible | UNBUILT | automat hits unrelated | Low |
| P6 | Explain why a world-local bonus does or does not apply | UNBUILT | no hits | Med: cross-world rules |

### docs/research/the-lands-of-eldyn/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | [UI] Close vs travel destination labels unambiguous | UNBUILT | no matches (src/display.js center menu is vanilla) | Low: vanilla center menu |
| P2 | [UI] One plain reason for unavailable destination | PARTIAL (inferred) | src/structured_pack_ui.js reasons | Med |
| P3 | [UI] Branch invitation previews internal destination first | UNBUILT | no hits | Low |
| P4 | [UI] Last successful save/import result shown | PARTIAL | src/main.js "last saved", src/save_files.js | Med |
| P5 | [UI] Center controls usable on narrow screens/keyboard | UNBUILT | mobile deferred by AGENTS.md | Low: mobile deferred |

### docs/research/groundhog-life/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | [UI] 24h day bar: sleep, work, study, chores, free minutes | DESIGNED-ELSEWHERE | docs/LIFE_SIM_NORTH_STAR.md (Groundhog Life 24-hour day line ~7613); no src dayBudget | High: life-sim focus, wide bar fits |
| P2 | Dated age offer checks skill; miss records needed level | DESIGNED-ELSEWHERE | docs/LIFE_SIM_NORTH_STAR.md; src/chronicle.js ageYears seam only | High: lead's career branches |
| P3 | Mood from rest, workload, home vs age expectation | PARTIAL | src/everyday_life.js moodConditions; src/life_experience.js lifeLearningMultiplier | High |
| P4 | Reading queue; rereads cost time/(1+times read) | DESIGNED-ELSEWHERE | docs/LIFE_SIM_NORTH_STAR.md; src/book_care_runtime.js | Med |
| P5 | Soft loop end by time pressure plus restart carry preview | PARTIAL | src/chronicle.js lifespanDeadline, tests/chronicle.test.js | Low: LOTM is not a loop world |

### docs/research/modding-tree/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Transition retainWhen predicates with "kept because" preview | UNBUILT | no retainWhen; src/simulation.js transitions have reset list only | Med: Sequence advance keeps |
| P2 | Opening a sibling path raises cost of the other | UNBUILT | no hits | Med: pathway choice |
| P3 | Mastery re-run: isolated replay, mastery record | UNBUILT | only a comment "isolated snapshot" in src/simulation.js | Low |
| P4 | Trial runs with goal, repeat completions, scaled reward | UNBUILT | no hits | Low |
| P5 | Visible catch-up bank drained by bounded advance, pausable | PARTIAL | src/away_ledger.js bankedMinutes, src/clock_owner.js; no drain UI | Low |

### docs/research/warsim/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| WP1 | One faction trait read by negotiation, economy, law | UNBUILT | no hits | Med: Church/Tarot Club traits |
| WP2 | Role-qualified person pool with stratified picks | PARTIAL | src/gen_kit.js stratified | Med: generated cast |
| WP3 | Productive mobilization of people into work | UNBUILT | no hits | Low |
| WP4 | Contextual petition from a real current need | PARTIAL (inferred) | src/lotm_divination_rows.js, src/feature_expansion_book_roster.js petition hits | High: LOTM commissions |
| WP5 | Competition with useful stakes in existing tournament | PARTIAL | src/home_school_circuit.js tournament | Low |

### docs/research/orb-of-creation/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| ORB-P01 | Undertrained cooling with honest price after paid trial | PARTIAL | src/cooling_refinement_*.js (built for ACS-P01, different price rules) | Low: Eda/Frontier content |
| ORB-P02 | Tool plus method combo changes a production bottleneck | PARTIAL (inferred) | src/artifact_workshop_host.js prism | Low |
| ORB-P03 | Rooted cutting becomes finite different material source | UNBUILT | no "rooted cutting" | Low |
| ORB-P04 | Paid investigation saves usable leads, no rerolling | UNBUILT | no saved-lead hits | Med: divination leads |

### docs/research/amazing-cultivation-simulator/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| ACS-P01 | Prepared cooling refinement attempt with quiet-hour window | BUILT | src/cooling_refinement_{content,facts,host}.js; tests/cooling_refinement.test.js | Low: Village content |
| ACS-P02 | Healing balm treats scraped palms vs free rest | BUILT | src/contextual_balm_{content,facts,host,native}.js; tests/contextual_balm.test.js | Low: Village content |
| ACS-P03 | Negotiate next duty, retain agreement | BUILT (inferred) | src/agreed_duty_{content,facts,host,continuation}.js; tests/agreed_duty_continuation.test.js | Low: Village content |

### docs/research/game-discovery-2026-10-06/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| GD-01 | Inconclusive paid test yields inference that changes a decision | BUILT (inferred) | src/game_absorption_assay_{content,facts,host,item_view}.js | Med: divination/assay analogue |
| GD-02 | Traversal brew converts to retained site change (wet ground, lightning) | UNBUILT | no stormvine/wet-actor hits | Low |


### Shard 4 coverage (11 files, 59 packets; Small native touches and Writer boundary rows counted as notes, not packets)

Method: keyword grep over src/ and tests/ plus docs. Most packets are proposals written against the village prototype (Lio, Tamsin, Eda, Hessa; original_frontier_*, promise_*, feature_expansion_*). No packet could be shown BUILT end to end without reading source, so nothing is marked BUILT. "(inferred)" means keyword evidence only.

### docs/research/upload-labs/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | [UI] Craft action shows gather/prepare/craft/deliver rates and the limiting input | PARTIAL | src/ui/craft_glance.js, tests/crafting_detail.test.js (blocked reason only, no rates) | Med: crafting panel exists; LOTM potion-making fits |
| P2 | Mentor teaches process improvement via practice or studied text | PARTIAL (inferred) | src/village_career.js, src/skill_expansion_content.js | Med: LOTM sequence knowledge fits |
| P3 | Sell sample or give it for research, one sample one result | PARTIAL (inferred) | src/steam_df_content.js, src/exchange_ui.js | Low: needs sampled-stock NPC |
| P4 | [UI] Named allocation of shared tools/labor between two jobs | UNBUILT | no "allocation" job-priority code found (52 src hits are unrelated resource words) | Low: factory-style, packet itself warns off |
| P5 | Careful preparation step lowers later work or raises value | PARTIAL (inferred) | src/crafting_recipes.js, src/gear_work.js | Med |
| P6 | Routine cards store method, not goods | UNBUILT | no "routine card" hits; src/agreed_duty_host.js is related | Med: routines for a lead's daily life |
| P7 | Push a tool beyond comfort for gain with wear risk | PARTIAL (inferred) | src/gear_work.js (field repair, strain) | Low |
| P8 | Rest reserve as an explicit policy candidate | UNBUILT | no hits; src/energy_resources.js exists | Med: idle pacing policy |

### docs/research/vagrus/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Colleague can object, negotiate or leave | PARTIAL | src/person_silence.js, src/person_standing.js, src/npc_lives.js (inferred) | High: LOTM companions and church ties |
| P2 | [UI] Journey budget with honest stop condition | UNBUILT | no "journey budget" hits | Med: travel between LOTM cities |
| P3 | Completed job stops clock, payment stays collectible | PARTIAL | src/owed_ledger.js (owed money) | Med |
| P4 | [UI] Show who supplied a check | PARTIAL | src/promise_ui.js, src/event_feed.js (inferred) | High: Beyonder checks with named helpers |
| P5 | Deputy as funded job with duties | PARTIAL | src/agreed_duty_host.js, src/home_staff.js | Med |
| P6 | Help companion project to unlock a use | PARTIAL (inferred) | src/party_partner_content.js | Med |
| P7 | Faction gift separate from conditional service | UNBUILT | no hits; faction ideas in docs/LIFE_SIM_NORTH_STAR.md | High: Church/Nighthawks service terms |
| P8 | Old leader's follower renegotiates with heir | DESIGNED-ELSEWHERE | heir owners; docs/CHARACTERS_AND_WORLD_EVENTS.md; src/family_figure.js | Low: lead is not an heir |

### docs/research/naev/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| NV-P01 | Offer lifecycle: offered, accepted, declined, expired, completed | PARTIAL | src/simulation_contracts.js lifecycle (inferred); src/promise_content.js | Med |
| NV-P02 | [UI] Show carrier and current support for earned power | PARTIAL | src/ui/figure.js, src/ability_ladder_figure.js, src/feature_expansion_powers.js | High: LOTM ability/pathway sheet |
| NV-P03 | Paid local work unlocks one changed place | PARTIAL (inferred) | src/original_frontier_field_content.js | Med |
| NV-P04 | Landing permission separate from membership/possessions | UNBUILT | no "landing permission" hits | Med: city entry in LOTM |
| NV-P05 | Relationship, completion and public log kept separate | PARTIAL | src/chronicle.js, src/person_standing.js (inferred) | Med |
| NV-P06 | Lint lifecycle data; restore only supported pending state | PARTIAL | tests lint conventions; src/simulation_contracts.js | Low: internal |
| NV-P07 | One local actor with distinct lawful operating pattern | PARTIAL | src/cast_schedule.js, src/npc_lives.js | Med |

### docs/research/magical-diary-wolf-hall/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| MD-P1 | One learned method, several real uses | PARTIAL | docs/SKILLS_AND_TALENTS.md; src/skill_expansion_content.js | High: Beyonder skills with many uses |
| MD-P2 | Assess a solution and its side effects | UNBUILT | no assessment-receipt code found | Med |
| MD-P3 | Paid preparation changes later conversation | PARTIAL | src/promise_content.js (inferred); docs/worlds/DIALOGUE_AND_INTERACTIONS.md | Med |
| MD-P4 | Access rules separate from physical barriers | PARTIAL (inferred) | src/book_world_lotm_clearance.js | High: LOTM clearance |
| MD-P5 | Relationship quality vs route commitment | DESIGNED-ELSEWHERE | docs/CHARACTERS_AND_WORLD_EVENTS.md; docs/RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md | Med |
| MD-P6 | [UI] Weekly plan with honest failure receipts | PARTIAL | src/world_rhythm.js recurringWindow, src/simulation.js setSimulationProgram (no weekly plan UI) | High: lead's daily life plan |

### docs/research/academagia/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | [UI] School timetable as standing week plan | PARTIAL | src/world_rhythm.js, src/cast_schedule.js, src/world_pack_population.js timetable | Med: LOTM has no school, but weekly shifts fit |
| P2 | Study level and dated exams against cohort | UNBUILT | no exam hits; cohort hits are battle cohorts | Low |
| P3 | [UI] House points and teacher ledger | UNBUILT | no hits; reputation.js is regional only; docs/WORLD_PASS_RULES.md mentions house points | Low |
| P4 | Staged skill-check adventures | PARTIAL (inferred) | src/ink_narrative.js, src/simulation_resolution.js | Med |
| P5 | Classmate cohort and friend group | PARTIAL | src/npc_lives.js, src/crush_social_host.js | Low |

### docs/research/crush-crush/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| CC-P01 | Shared cart-check outing with Tamsin | PARTIAL | src/promise_content.js (promise.investigate, mill slip); tests/promise_situation.test.js | Low: village prototype |
| CC-P02 | Compare known time use with Lio's schedule | PARTIAL (inferred) | src/audit_remainder_livelihood_host.js, src/cast_schedule.js | Low |
| CC-P03 | End finite routine at next real conversation | PARTIAL | src/agreed_duty_host.js, tests/agreed_duty_continuation.test.js | Med |
| CC-P04 | One low-pressure authored exchange | PARTIAL | src/ink_narrative.js, src/promise_content.js | Low |
| CC-P05 | [UI] Village return recap with retained effects and costs | PARTIAL | src/generated_people_ui.js, src/story_recognizer.js (recap) | Med: return-from-trip recap |

### docs/research/hogwarts-games/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Lesson changes a known field task | PARTIAL (inferred) | src/original_frontier_field_content.js | Med |
| P2 | Practical assessment extending Academagia P2 | UNBUILT | depends on academagia P2, unbuilt | Low |
| P3 | Study partner gives particular help | UNBUILT | docs/LIFE_SIM_NORTH_STAR.md only | Med |
| P4 | Study workroom supplies a real task | PARTIAL | workroom code in src/book_world_lotm_*.js; scripts/playtest/workroom-density.mjs | Med |
| P5 | [UI] Term transition preview with chapter/lesson join | UNBUILT | no "term transition" hits | Low |

### docs/research/outer-wilds/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | [UI] Connected field notes linking clue to destination | PARTIAL | src/invention_planner.js (rumored in tests/invention_planner.test.js), src/village_ui.js | High: LOTM investigation boards |
| P2 | [UI] Unfinished leads without hidden counts | PARTIAL | src/data/locations.js "heard about" (inferred) | High |
| P3 | Remembered visit window | PARTIAL | src/world_rhythm.js recurringWindow; tests/ one | Med |
| P4 | Incomplete record becomes useful | UNBUILT | no gap-record code found | High: divination, diary pages |
| P5 | One world allows knowledge-only reset | PARTIAL | src/simulation_contracts.js reset policy; src/harm_loops.js (inferred) | Med: LOTM loop/rebirth hooks |

### docs/research/your-chronicle/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| YC-P1 | Late archive index after missed succession | UNBUILT | no "late index" or route-diagram hits | Low |
| YC-P2 | Archive lifting job, hire Lio | PARTIAL (inferred) | src/audit_remainder_livelihood_host.js | Low |
| YC-P3 | Renewed field review re-earns mastery | PARTIAL | src/original_frontier_field_content.js (Load-bearing Step renewal) | Low |
| YC-P4 | Bounded study/work plan (5 minutes) | PARTIAL (inferred) | src/agreed_duty_host.js | Low |

### docs/research/cult-of-the-lamb/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| LAMB-P01 | Voluntary repair-circle charter | UNBUILT | no "repair circle"/charter code; docs/LIFE_SIM_NORTH_STAR.md charter mention | Low |
| LAMB-P02 | Earn an office giving a service | PARTIAL (inferred) | src/home_staff.js, src/feature_expansion_book_roster.js (deputy) | Med: Nighthawks ranks |
| LAMB-P03 | [UI] Resident dispatch changes home work and returning person | PARTIAL | src/agreed_duty_host.js, src/feature_expansion_society_host.js | Med |

### docs/research/tales-of-maj-eyal/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| 1 | Harness fit (rigid vs flexible) changes a guarded blow | PARTIAL | src/gear_work.js (rigid setting), src/party_partner_content.js harness; no flexible variant found | Low |
| 2 | Maintain one finite brace on one ally | PARTIAL | src/feature_expansion_powers.js (Brace control), src/tempo_fight*.js | Med: combat tempo is live |
| 3 | One lesson or one stocked reward after sealing | PARTIAL (inferred) | src/reference_gameplay_content.js (stocked) | Low |

### Counts
Packets 59: BUILT 0, PARTIAL 38, DESIGNED-ELSEWHERE 2, UNBUILT 19 (approximate, mostly keyword-based).


### Shard 5 coverage (docs/research IMPLEMENTATION_PACKETS)

Method: keyword grep over src/ and tests/ plus docs rulebooks. Most packets are proposals phrased as extensions of existing Frontier/Village owners, so many are PARTIAL (inferred) from owner-file existence. "(inferred)" = not confirmed by reading source.

### docs/research/battle-brothers/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Continue named helper agreement with wage terms, warning, departure choice | PARTIAL | src/agreed_duty_continuation.js, tests/agreed_duty_continuation.test.js, src/helper_content.js | Med: LOTM helpers are not wage-based |
| P2 | Short cause ledger explaining local standing, favor or grievance [UI] | PARTIAL (inferred) | src/owed_ledger_view.js, src/ui/owed_ledger.js, tests/owed_ledger.test.js | High: ledger strip fits NPC standing |
| P3 | Specialist service unlocked by actual work, proof shown in menu | PARTIAL (inferred) | src/audit_remainder_home_content.js | Low: crafting-frontier flavor |
| P4 | Prior work shapes a recurring social scene | DESIGNED-ELSEWHERE | docs/RULES_INDEX.md time/standing rows, IDEA_INDEX.md | Med: LOTM Tingen social scenes |
| P5 | Companion injury restricts one job, recovery estimate shown [UI] | UNBUILT | no hits for recovery estimate | Low: no companions in LOTM lead |
| P6 | One local crisis changes a place and ends coherently | PARTIAL (inferred) | src/causal_situations.js, src/event_feed.js | High: LOTM city incidents |
| P7 | Enemy power recorded as observed method, observation vs guess [UI] | PARTIAL | src/adventure_notebook.js, UIV6 in docs/UI_RULES.md, src/lotm_divination_rows.js | High: Beyonder ability reading |
| P8 | Service and loss write named milestone, elders teach | PARTIAL | src/life_experience.js, src/heir_inheritance.js, src/chronicle.js | Med: end-of-life only |

### docs/research/kingdom-hearts/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| KH-P01 | Earned capability vs current usability, precise blocker shown [UI] | PARTIAL | projectActionLegibility in src (cited by packets), src/ability_records, UIV4 | High: sequence/ability legality in LOTM |
| KH-P02 | Retained destination, changed revisit | PARTIAL (inferred) | src/feature_expansion_destination_host.js | Med: world-hop revisits |
| KH-P03 | Costume/appearance vs body affordance vs permission [UI] | PARTIAL (inferred) | src/feature_expansion_book_roster.js, src/ui/figure.js | Med: disguise in LOTM |
| KH-P04 | Return with learned function used in another world | PARTIAL (inferred) | src/lives_carry_domain.js, src/feature_expansion_book_situated.js | Med: cross-world carry |
| KH-P05 | Stable companion, local availability | UNBUILT | no roster-availability hits beyond book_roster | Low |
| KH-P06 | Known return reason and route status panel [UI] | UNBUILT | no returnReason/routeStatus hits; src/known_routes.js partial | Med |
| KH-P07 | Scene track with pending decision and effect receipt | PARTIAL | src/ink_narrative, pending-decision in src/book_world_lotm_host.js, src/ui/scene_card.js | Med |
| KH-P08 | Overlay validation: precedence, references, pinned revision | PARTIAL | src/content_packs.js, src/world_pack_loader.js | Low: authoring tooling |

### docs/research/bitburner/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Repeat one native command N times, pause, show blocker [UI] | PARTIAL | src/simulation_ui.js, src/simulation.js:311-329, src/field_works_ui.js | Med: routine host exists |
| P2 | Workshop discovery: gather, study, craft tool changing an action | PARTIAL | src/systems_workshop_content.js, src/field_works_projection.js | Low |
| P3 | Receipts for productive time after absence [UI] | BUILT | src/away_ledger.js, tests/away_ledger.test.js; AD15-AD17 in docs/RULES_INDEX.md | High: desktop return screen |
| P4 | Review life being loaded: compare save slots on import | PARTIAL | src/save_files.js, src/main.js | Low |
| P5 | Teach unlocked method to one named craftsperson | PARTIAL (inferred) | src/audited_workshop_lesson.js | Low |
| P6 | Prestige preview: capability gained vs possessions ended [UI] | PARTIAL | src/carry_ledger.js, src/heirloom_compact.js, tests/lives_carry_codex.test.js | High: reset/transmigration preview |

### docs/research/siralim-ultimate/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| SU-P01 | Place changes ordinary decision via encounter object, two actions | PARTIAL | src/authored_site.js, src/world_instance facts | Med |
| SU-P02 | Source-aware build inspection: owned vs suppressed vs expired [UI] | PARTIAL | src/ability_ladder_figure.js, src/ui/character_sheet_view.js, UIV6 | High: ability sheet |
| SU-P03 | Travel departure preview classifies body, method, fuel, stock [UI] | PARTIAL | planWorldDeparture (src), src/ui/crossing_threshold.js | High: world crossing |
| SU-P04 | Finite causal combat chains with termination | UNBUILT | no eventChain/cycleGuard hits; tempo_fight is separate | Med |
| SU-P05 | Standing buys access, currency pays price | PARTIAL (inferred) | src/gatherings.js, src/owed_ledger_view.js | Med |
| SU-P06 | Expedition materials unlock home service | PARTIAL (inferred) | src/home_warehouse.js, src/home_building_panel.js | Low |
| SU-P07 | Role/loadout swap quoting dependencies | UNBUILT | no roleSwap/loadoutSwap hits | Med: LOTM acting/role |

### docs/research/bitlife/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Life remembered: appraisal epitaph from authoritative tie [UI] | PARTIAL | src/life_experience.js lifeEpitaph, tests/life_experience.test.js | Med |
| P2 | Succession receipt before heir command [UI] | BUILT | src/heir_inheritance.js heirLeftoverLines, tests/heir_inheritance.test.js | Med |
| P3 | Known-person relationship card with pending invitation [UI] | PARTIAL | src/people_knowledge.js, src/relationship_web_view.js, src/ui/relationship_web.js | High: LOTM cast |
| P4 | Optional life aim from two existing actions | UNBUILT | no lifeAim hits | Med |
| P5 | Period recap beside routine controls [UI] | PARTIAL | src/life_record.js, src/event_feed.js, src/away_ledger.js | High |

### docs/research/cultivation-idlers/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Revelation rule: unearned systems absent, labels deepen [UI] | PARTIAL | src/mistglass_revelation.js, src/native_discovery_policy.js | High: LOTM unknowing to Beyonder |
| P2 | Breakthrough as staged trial with lived-years seal | UNBUILT | no seal hits; techniques staged practice only | Med: potion digestion could use |
| P3 | Vessel quality: capacity plus purity share, cap blocks | PARTIAL (inferred) | src/vessel_geometry.js, src/cultivation_guidance.js | Med: maps to LOTM digestion |
| P4 | Time-fed discovery with pity rise | UNBUILT | no pity hits in discovery code | Low |
| P5 | Ambient regional lines tracking a threat | PARTIAL (inferred) | src/everyday_life.js, src/causal_situations.js | Med |

### docs/research/keeperrl/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| 1 | Complete a room, then funded resident invitation | PARTIAL | src/site_projects.js, src/field_workshop.js | Low |
| 2 | Allocate one scarce toolkit between two jobs | PARTIAL | src/audit_remainder_livelihood_*.js | Low |
| 3 | Conditioned grip consumed as one-use guard reduction | PARTIAL | src/body_progression.js (grip), feature_expansion_battle costOf | Low |
| 4 | Retained grievance funds finite collection response | PARTIAL (inferred) | src/audit_remainder_consequences_content.js | Low |

### docs/research/oxygen-not-included/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| ONI-P01 | Temperature-qualified batch work using fuel | PARTIAL | src/craft_process_thermal.js, src/heat_grades.js | Low |
| ONI-P02 | Body-specific hazard support: air kit, retreat | PARTIAL (inferred) | src/body_progression.js, docs UI_RULES air rows | Low |
| ONI-P03 | Borrowed tool competence vs earned practice | PARTIAL (inferred) | src/audit_remainder_livelihood_content.js | Low |
| ONI-P04 | Paid habitat with useful biological output | BUILT | src/habitat_care.js, src/ui habitat_care_ui.js, tests/habitat_care.test.js | Low |
| ONI-P05 | One operator, two work locations | UNBUILT | no clean hits | Low |

### docs/research/heavens-vault/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| IP1 | Interpretation loop: maker's mark, two readings, contradiction | PARTIAL | src/lotm_divination_rows.js, src/cast_divination_adapter.js, tests/lotm_divination_rows.test.js | High: divination is core to LOTM |
| IP2 | Notebook comparison and history, event vs reveal time [UI] | PARTIAL | src/adventure_notebook.js, src/anchor_snapshots.js | High: clue board |
| IP3 | Knowledge-aware journey: rumour, search area, exact site | UNBUILT | no search-area hits; src/known_routes.js partial | High: investigation in Tingen |

### docs/research/potionomics/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| PO1 | Forecast vs actual batch result [UI] | PARTIAL | src/mixture_native.js, src/craft_failure_ledger.js, UIV4/UIV6 | High: LOTM potion brewing |
| PO2 | One stock, two real destinations | UNBUILT | no stock-destination hits | Low |
| PO3 | Social lesson becomes usable method | BUILT | src/audited_workshop_lesson.js, src/audited_workshop_facts.js | Med |
| PO4 | Paid response and later terms | PARTIAL | src/feature_expansion_nested_chains.js, src/ink_narrative | Med |

### docs/research/idle-reincarnator/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Reset preview with before/after carry ledger [UI] | BUILT | src/carry_ledger.js, src/lives_carry_domain.js, tests/lives_carry_codex.test.js | High |
| P2 | Funded town service persists after worker's reset | PARTIAL (inferred) | src/pledges_domain.js | Low |
| P3 | Show work/training/route channels, one suspension reason [UI] | PARTIAL | src/work_ledger_ui.js, src/work_ledger_system.js | Med |
| P4 | Known route earns a bypass | UNBUILT | no bypass hits | Low |
| P5 | Wall-time bank with spend switch | PARTIAL | src/away_ledger.js (policy differs; AD15-AD17 govern) | Low |
| P6 | Encounter records scoped attempts and preparation | UNBUILT | no hits | Med |
| P7 | Ledger for existing age/life effect [UI] | UNBUILT | no ageLedger hits | Med: lifespan under Beyonder pathway |
| P8 | Validate content family against registered consumers | PARTIAL | src/world_pack_loader.js, src/content_packs.js | Low |


### Shard 6 coverage (keyword grep only; "(inferred)" = not read in source)

### docs/research/increlution/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | [UI] Show what survived a life with a real carrier | PARTIAL | src/chronicle.js createHeirChronicle, src/life_record_ui.js, tests/chronicle_heir_snapshot.test.js | Med: lead's life end view |
| P2 | Earn automation for familiar work | PARTIAL (inferred) | src/simulation.js setSimulationProgram, tests/routine_jobs.test.js; no "earned" gate found | Low: LOTM lead is not routine-automating |
| P3 | Separate body practice from carried aptitude | PARTIAL (inferred) | src/life_experience.js, src/data/skills.js; no split grep hit | Med: transmigration/Beyonder carry |
| P4 | Catch up to next meaningful stop | PARTIAL | src/main.js advanceChroniclePlan, tests/wait_and_beat_knowledge.test.js | Low: desktop play, offline not central |
| P5 | [UI] Life gains screen before next beginning | PARTIAL | src/life_record_ui.js, src/chronicle_ui.js | Med: fits lives_figure |
| P6 | Part-build a useful shelter | UNBUILT (inferred) | crafting_recipes.js has no part-build; none found | Low |
| P7 | Fix next-life outcome once, show carry | PARTIAL | src/heir_inheritance.js, tests/heir_inheritance.test.js; AD IM8 law dial | Low: heirs not LOTM lead |
| P8 | One artifact, temporary and permanent uses | PARTIAL (inferred) | src/heirloom_items.js, src/items.js | Med: LOTM sealed artifacts |

### docs/research/sunless-skies/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | World flags survive succession; personal ties reset | PARTIAL | src/world_visit_history.js, src/chronicle.js | Med: per-world persistence |
| P2 | Inherited estate with named losses [UI receipt] | PARTIAL | src/home_inheritance.js, src/heirloom_compact.js, tests/heirloom_compact.test.js; no receipt UI | Med |
| P3 | Survived danger leaves later disturbance | PARTIAL (inferred) | src/causal_story_core.js, src/chronicle.js | High: LOTM aftermath of Beyonder events |
| P4 | Thematic event pools with separate timers | PARTIAL | src/storylet_content.js, tests/storylet_deck.test.js; no per-pool timers found | Med |
| P5 | Desperation broadens emergency menu | UNBUILT | no hit "desperation"/"edible cargo" | Low |
| P6 | Inherited notebook unlocks apprenticeship | PARTIAL | src/adventure_notebook.js, src/material_apprentice.js | Med |
| P7 | Fee on attempt vs success separate facts | PARTIAL (inferred) | src/simulation_effects.js | Med: negotiation costs |
| P8 | One-time discovery relief, recoverable history | PARTIAL (inferred) | src/world_visit_history.js | Low |

### docs/research/citizen-sleeper-2/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | [UI] Crew contract preflight with commitment ledger | PARTIAL | src/feature_expansion_book_roster.js, src/gear_work.js, src/ui/owed_ledger.js (ledger form) | Med: party/helper jobs |
| P2 | Objective progress vs growing crisis | UNBUILT (inferred) | no dual-track hit | Med |
| P3 | Helper changes work and remembered story | PARTIAL (inferred) | src/helper_content.js | Med |
| P4 | Overclock trades output for strain liability | UNBUILT | no "overclock" in src/tests/docs | Low |
| P5 | Two repair materials, different aftermath | UNBUILT (inferred) | none found | Low |
| P6 | Distinct recovery policies per world | PARTIAL | src/feature_expansion_book_roster.js recoveryMode | Low |
| P7 | Docked helper bounded support routine | PARTIAL | src/helper_content.js, src/trial_routine.js | Low |

### docs/research/sunless-sea/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | [UI] Surviving-estate receipt at life end | PARTIAL | src/home_inheritance.js, src/life_record_ui.js; no receipt table | Med |
| P2 | [UI] Visible story locks and consequence receipts | PARTIAL | src/storylet_content.js, src/causal_story_ui.js, tests/storylet_ui.test.js | High: LOTM storylets |
| P3 | Prepared continuation without blood heirs | PARTIAL | src/material_apprentice.js, src/heir_inheritance.js (apprenticeFirst) | Low |
| P4 | Threat thresholds with several responses | PARTIAL (inferred) | src/simulation_content.js | Med |
| P5 | Teach a person, preserve a person | PARTIAL | src/material_apprentice.js, src/family_tree.js | Low |
| P6 | World marks separate from fresh-life stories | PARTIAL | src/world_visit_history.js | Med |
| P7 | [UI] Preview retirement before ending a life | UNBUILT | no preview hit; src/chronicle_ui.js only | Low |

### docs/research/cividle/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | [UI] Chain value "materials worth X, result Y" in craft detail | UNBUILT | no chainValue; src/crafting_detail.js exists, src/ui/craft_glance.js | Low: LOTM lead not crafting-led |
| P2 | Opt-in absence split with stored hours | UNBUILT | no storedHours; docs/UI_RULES.md mention only (inferred) | Low |
| P3 | Era-up 1-of-3 insight cards | UNBUILT | no eraUp/insight card | Med: Beyonder sequence advance |
| P4 | Earned capped carry on transition [UI preview] | PARTIAL (inferred) | src/crossing_threshold.js, ui/crossing_threshold.js | Med: world crossings |
| P5 | Idle hands trickle to knowledge | UNBUILT | no hit; src/people_knowledge.js exists | Low |

### docs/research/discworld-mud/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Spare lives plus world death-figure scene | DESIGNED-ELSEWHERE | docs/LIFE_SIM_NORTH_STAR.md (psychopomp), docs/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md; no src | Med |
| P2 | Tree-gated skills, level vs bonus split | PARTIAL | src/models/skill.js parent_multiplier, src/data/skills.js; no gate | Med |
| P3 | Teaching margin, "outgrown", teaching XP | PARTIAL (inferred) | src/audited_workshop_lesson.js; no outgrown | Low |
| P4 | Per-world calendar and fixed holidays | BUILT | src/world_calendar.js, src/world_calendar_content.js, tests/world_calendar.test.js | High: LOTM calendar |
| P5 | Origin bundle, language comprehension (garble+gist) | PARTIAL | src/character_creation.js (origins); no garbling | High: LOTM languages (Loen/Intis) |

### docs/research/king-of-dragon-pass/IMPLEMENTATION_PACKETS.json
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Season forecast rumor, preparation window | UNBUILT | no forecast hit | Low |
| P2 | [UI] Companion dispatch, double-booking guard | PARTIAL (inferred) | src/feature_expansion_book_roster.js, src/helper_content.js | Med |
| P3 | [UI] Favor ledger, true vs gossiped | PARTIAL | src/ui/owed_ledger.js, tests/owed_ledger.test.js (owed debts; no gossip split) | High: LOTM obligations |
| P4 | Delayed apprenticeship and succession | PARTIAL | src/material_apprentice.js, src/heir_inheritance.js | Low |
| P5 | Event choice + scheduled follow-up, compact annual record | PARTIAL | src/chronicle.js, src/life_record.js, src/event_feed.js | Med |

### docs/research/rogue-legacy/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| 1 | Physical preparation before one encounter (rope/kit) | PARTIAL | src/feature_expansion_destination_host.js sluice, src/audited_workshop_host.js | Low: original-world content |
| 2 | Body aptitudes change a maneuver | PARTIAL (inferred) | src/feature_expansion_powers.js | Low |
| 3 | Compare three retained pathfinder offers | PARTIAL | src/audit_remainder_offers_state.js, src/helper_content.js | Low |
| 4 | Recipe behind optional objective | PARTIAL (inferred) | src/audit_remainder_combat_objectives_content.js | Low |

### docs/research/idling-to-rule-the-gods/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| 1 | Funded work shift vs contest for helper | PARTIAL | src/helper_content.js, src/reference_gameplay_content.js | Low |
| 2 | Clamping frame opens resin route | PARTIAL | src/reference_gameplay_content.js, src/audited_workshop_host.js (cooling sleeve) | Low |
| 3 | Ordinary-craft supply attempt | PARTIAL (inferred) | src/audit_remainder_combat_objectives_content.js | Low |

### docs/research/procedural-materials-2026-10-13/IMPLEMENTATION.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| Findings | Verified seams (Recipe getResult etc.) | n/a | context only | n/a |
| P1 | Validated product records, canonical ref in item key | PARTIAL | src/material_lineage_domain.js, src/material_lineage.js, tests/material_lineage.test.js | Med: LOTM potions |
| Reconcile C1/C2 | Exact-ID vs profile ritual selectors | DESIGNED-ELSEWHERE | docs/USER_VISION.md:303-317 (per doc) | Med |
| Probes A1 | Acceptance probes, stacking/import | PARTIAL (inferred) | tests/material_lineage.test.js | Low |

### docs/research/idle-social-engine-scout-2026-10-06/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| ES-01 | NPC social bid: accept, decline or defer, remembered return | PARTIAL (inferred) | src/talk_view / ui/talk_view.js, src/story_requests.js; no reverse-volition hit | High: LOTM social play |
| ES-02 | [UI] Destination shows missing prerequisites and costs | PARTIAL | src/repository_absorption_ui.js, src/feature_expansion_wave_host.js (itinerary) | High |


### Shard 7 coverage (keyword grep over src/ and tests/; most BUILT/PARTIAL calls are keyword evidence, "(inferred)" where no test or mechanism was read)

### docs/research/kill-the-lich-idle/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Ordinary skill level improves a later method's result | PARTIAL (inferred) | src/skill_expansion_content.js, src/original_frontier_field_content.js | Med: LOTM sequence skills feed rites |
| P2 | Familiar contact opens a practical job | PARTIAL (inferred) | src/people_knowledge.js, src/feature_expansion_book_roster.js | High: lead's contacts drive LOTM life |
| P3 | Preparation gives a visible effect in a hard encounter [UI] | PARTIAL | src/feature_expansion_powers.js, src/combat_situation_ui.js | High: LOTM rites and ambushes |
| P4 | Earned money leaves a visible mark at home [UI] | PARTIAL | src/home_furnishing_content.js, src/home_workers.js | Med: lead's household in book worlds |
| P5 | Preview what a counted routine will accomplish [UI] | PARTIAL | src/simulation_ui.js, tests/reedbank_ability_claims.test.js | Med: routines are secondary to lead's life |
| P6 | Separate power amount from power quality | UNBUILT | no hits (powerQuality) | Med: LOTM sequence vs potion purity |
| P7 | Explain milestone estimate with stated uncertainty [UI] | UNBUILT | no hits for milestone forecast | Low: lead's life is not a grind |
| P8 | Preview one prestige retention policy | BUILT | src/structured_renewal.js, tests/structured_renewal.test.js | Low: renewal not current focus |

### docs/research/theory-of-magic/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Study changes what a character can do | BUILT | src/technique_content.js, tests (method/lesson grant per MR10) | High: LOTM acting method study |
| P2 | Home becomes a working home | PARTIAL | src/home_workers.js, src/home_furnishing_content.js, src/audit_remainder_home_content.js | Med: lead's lodging |
| P3 | Show why a routine stopped [UI] | PARTIAL | src/mixture_feedback.js, src/household_fortunes_panel.js, src/simulation_ui.js | Med: honest stop reasons help |
| P4 | Apprenticeship as a chapter in a life | PARTIAL | src/material_apprentice.js, src/feature_expansion_society_host.js, tests/family_tree.test.js | High: lead apprenticeships in books |
| P5 | Basic learning stays useful beyond first unlock | PARTIAL (inferred) | src/technique_content.js | Med |
| P6 | Expendable notes become lasting understanding | PARTIAL (inferred) | src/technique_content.js, src/lore_practice_runtime.js | High: LOTM note-taking, divination records |
| P7 | Progress explanations in existing center menu [UI] | UNBUILT (inferred) | src/simulation_ui.js has related text only | Low |
| P8 | Prestige that preserves a lived character | PARTIAL | src/structured_renewal.js, src/lives_figure.js | Low: prestige deferred |

### docs/research/hyperrogue/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| HR-P1 | Two local laws, one carried tool, different outcomes | PARTIAL | docs/WORLD_ENTRY_RULES.md WER3; src/mixture_ui.js "local law" | Med: crossings between book worlds |
| HR-P2 | Truthful departure carry preview [UI] | BUILT | src/ui/crossing_threshold.js, tests/crossing_threshold.test.js (RPX20, WER3/WER9) | High: world entry in book worlds |
| HR-P3 | Border site where carried object changes local process | UNBUILT | no hits | Low |
| HR-P4 | Known conditions vs actual usability route view [UI] | PARTIAL (inferred) | src/knowledge_view.js, src/combat_situation_ui.js | Med |
| HR-P5 | Local practice earns a useful route | PARTIAL (inferred) | src/lore_practice_runtime.js | Med |
| HR-P6 | Chosen practice rule variant | UNBUILT | no hits | Low |
| HR-P7 | One generated identity, several readers | PARTIAL | src/world_pack_loader.js, instance-identity per AR rules (inferred) | Low |

### docs/research/the-strange-tabletop/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| MWTS-P01 | Crossing mode with per-carrier preview [UI] | BUILT | src/ui/crossing_threshold.js; docs/WORLD_ENTRY_RULES.md WER2, WER3 | High: entering LOTM-like worlds |
| MWTS-P02 | Traveler continuity and local form history | DESIGNED-ELSEWHERE | WER1-WER17 (docs/WORLD_ENTRY_RULES.md); src/lives_figure.js | Med: transmigration lives |
| MWTS-P03 | Portable consumable, locally manifested | PARTIAL | src/book_world_mol_state.js, src/lotm_divination_rows.js (inferred) | Med |
| MWTS-P04 | Conditional law with a real consumer | PARTIAL | src/mixture_ui.js, WER3 | Med |
| MWTS-P05 | Local recognition survives return | PARTIAL | src/feature_expansion_book_situated.js, src/simulation_contracts.js (inferred) | High: who notices (WA14) |
| MWTS-P06 | Author a small original destination | PARTIAL | src/world_pack_loader.js, src/feature_expansion_destination_host.js | Med |
| MWTS-P07 | Arrival reveals useful known facts [UI] | UNBUILT | no src hits for arrival reveal | High: entering a book world |

### docs/research/cross-game-synthesis-2026-10-14/IMPLEMENTATION_PATTERNS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| Architecture and authoring patterns (I1-I10) | Rules/host/UI split, instance identity, derived caches | DESIGNED-ELSEWHERE | docs/ARCHITECTURE_RULES.md AR1-AR16 | Low: engineering, not player-facing |
| Save methods by source dossier | Comparison table of other games' save formats | DESIGNED-ELSEWHERE | docs/ARCHITECTURE_RULES.md; persistence tests | Low |
| Reliability claims not established | Research caveats, no mechanism | UNBUILT (n/a) | none | Low |
| Current boundary and profile audit | Audit of current YAIRPG seams | DESIGNED-ELSEWHERE | docs/RULES_INDEX.md AD36/AD43 | Low |
| Implementation-ready receiving packets | Leaf proposals per seam | PARTIAL (inferred) | src/world_pack_manifest.js | Low |

### docs/research/dwarf-fortress/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| DF-P01 | Material treatment keeps exact repaired object | PARTIAL | src/material_apprentice.js, src/field_care_content.js | Med: LOTM crafted items |
| DF-P02 | Small functional injury, specific care, work effect | PARTIAL | src/field_care_content.js (cut/venom care exists) | Med |
| DF-P03 | Physical workshop record copied, entrusted, taught [UI] | PARTIAL | src/lore_practice_runtime.js, src/steam_boh_host.js, src/stock_view_ui.js | High: LOTM formulas, notes |
| DF-P04 | Paid inventory report that goes stale [UI] | PARTIAL | src/knowledge_view.js, src/people_knowledge.js, tests/structured_container.test.js | Med |
| DF-P05 | Settlement change attracts specific informed danger | PARTIAL (inferred) | src/lotm_rite_rows.js, src/craft_agitation.js | High: rites attract attention |

### docs/research/kingdom-of-loathing/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Life rule profiles over a fixed spine | PARTIAL | src/world_pack_manifest.js, tests/world_pack_manifest.test.js | High: each book world its own rules |
| P2 | Three named capacity organs per world | UNBUILT | no hits | Med: LOTM spirituality/sanity gauges |
| P3 | Charges as the module unit | PARTIAL (inferred) | src/book_world_mol_state.js, many "charge" uses | Med |
| P4 | Two-tier permanence with a run currency | PARTIAL | src/structured_renewal.js | Low |
| P5 | Requirement-flag crafting | UNBUILT | no hits; src/craft_engine exists but no flag form | Med |

### docs/research/six-ages-2/IMPLEMENTATION_PACKETS.json
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| SA2-P1 | Friend ages into a new role | PARTIAL | src/family_tree.js, src/family_figure.js; no ageStage field | High: lead's relationships over years |
| SA2-P2 | Prepare for one forecasted season | UNBUILT | no seasonForecast hits | Med |
| SA2-P3 | Repair damaged home with skilled friend | PARTIAL | src/home_workers.js, src/absorb_p23/salvage/salvage.js; no homeDamage | Med |
| SA2-P4 | Neglected relationships age in coarse steps | PARTIAL | src/people_knowledge.js, src/event_feed.js (neglect hits, inferred) | High |
| SA2-P5 | Event aftermath committed to yearly life index [UI] | PARTIAL | src/life_events_ui.js, src/life_experience_host.js (life_record) | High: lead's life by year |

### docs/research/immortal-life/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Skilled work supplies a trial application | UNBUILT | no hits | Low |
| P2 | Repair changes a shared place | PARTIAL | src/proto23_world_content.js, src/feature_expansion_book_situated.js | Med |
| P3 | A friend stays, then can leave | PARTIAL (inferred) | src/home_staff.js, src/pledges_domain.js | High |
| P4-P7 | Bounded follow-on options | UNBUILT (not itemised) | none | Low |

### docs/research/rimworld/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| 1 | Bounded kit reserve for a journey [UI] | BUILT | src/audited_kit_reserve_content.js, src/reference_kit.js | Med |
| 2 | Recent friction expires; an actual promise remains | BUILT | src/pledges_domain.js, src/pledges_ui.js, src/owed_ledger_sources.js, tests/owed_ledger.test.js | High: pledges and debts |
| 3 | Frost warning with one actual herb outcome | PARTIAL | src/field_care_content.js, src/world_completion_materials_runtime.js (no forecast) | Low |

### docs/research/ani-idle/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| AN-P1 | Rest leaves a place memory | PARTIAL (inferred) | src/life_experience_host.js | Med |
| AN-P2 | One tool repair with stated target [UI] | PARTIAL | src/material_apprentice.js, src/crafting_recipes | Low |
| AN-P3 | Recurring encounter remembers unfinished care | PARTIAL | src/quests.js, src/causal_story_native.js | Med |
| AN-P4 | Explain practiced technique blockers [UI] | PARTIAL | src/village_career_ui, src/knowledge_view.js | Med |
| AN-P5 | Finite task route shown before commitment [UI] | PARTIAL | src/expedition_content.js, src/chronicle_ui.js | Med |
| AN-P6 | Ordinary skill gives alternate event solution | PARTIAL (inferred) | src/data/skills.js, src/quests.js | Med |
| AN-P7 | Loot keep/salvage protection | UNBUILT | no hits | Low |
| AN-P8 | Describe the action that survives absence [UI] | PARTIAL | src/simulation_ui.js | Low |
| AN-T01..T24 | Small touches (ready/blocked reasons, costs, previews) | PARTIAL (inferred) | src/simulation_ui.js, src/ui/craft_glance.js | Low: polish |

### docs/research/magic-research-2/IMPLEMENTATION_PACKETS.md
| Packet | Mechanism (<=15 words) | Status | Evidence | Fit for OOPS now |
|---|---|---|---|---|
| P1 | Earned knowledge separate from casting gate | BUILT | file's own 2026-10-07 review: already shipped (lessons grant method) | Med |
| P2 | Equipment alters a technique's output | BUILT | file review: built as slice D1 (docs/gm/d1-alloy-equipment-2026-10-07/) | Low |
| P3 | Bounded automation with pause reason | BUILT | file review: programs ship with pause reason | Low |
| P4 | Gated prestige preview | BUILT | file review: field renewal; src/structured_renewal.js | Low |



# Top 12 unbuilt (ranked by fit with: lead's life in LOTM, book worlds, desktop UI at 1920)

Ranked after a second spot-check grep (zero hits in `src/` for: theater board, arrival brief, day bar, clue thread, season forecast, lifespan ledger, stale stamp). Where an adjacent system exists, the entry names it so the build extends rather than duplicates.

1. **Arrival brief card** (strange-tabletop MWTS-P07): on entering a world, a strip of facts the lead already knows. No `arrivalBrief` hit. Fits `src/ui/crossing_threshold.js` and `scene_card.js`; pairs with LOTM entry in `src/book_world_lotm_entry.js`.
2. **Skill voicing a private observation + check-reason tooltip** (disco-elysium P1, P7): LOTM acting method and Spirit-world perception become inner voices and factor lists. Fits `person_silence` inspector and `combat_situation.js`.
3. **Who-supplied-a-check chip row** (vagrus P4): helper avatars with named contributions on a result. Fits `promise_ui.js`, check result cards.
4. **Settlement slip per plan** (melvor MEL-P01, idleon): per-plan accepted/refunded strip with stock and time deltas. `away_ledger.js` and `return_digest.js` exist, so PARTIAL-adjacent; extend `owed_ledger.js`.
5. **Return summary card** (free-text-worlds FT-I3, crush-crush CC-P05): current task and goal after absence. `return_digest_ui.js` exists (inferred partial); finish the card layout, not the logic.
6. **Favor ledger with true vs gossiped columns** (king-of-dragon-pass P3, battle-brothers P2): cause rows per person. Only `person_memory_effects.js` hits "gossip". Fits `owed_ledger.js` and `relationship_web.js`.
7. **Four-state chip row: known / permitted / owned / usable now** (kittens K-P4, sapiens S-I2, NGU P2): beside every ability. `action_legibility.js` covers blockers; the chip row is the missing view. Fits `technique_ui.js`, `character_sheet_view.js`. Strong LOTM fit (sequence abilities).
8. **Paid information unlocks a real route** (ur-quan-masters UQM-P2, orb-of-creation ORB-P04, heavens-vault IP3): rumour to search area to exact site. Fits LOTM divination and `walk_map.js`.
9. **Connected clue board with rumored vs observed lines** (outer-wilds P1/P2/P4, heavens-vault IP1/IP2): no clue-thread code. Fits `knowledge_view.js`, `scene_card.js`. High for mystery-driven book worlds.
10. **Language garble plus gist line** (discworld-mud P5): only an `economy_standing.js` hit. Fits `talk_view.js`; useful for foreign-tongue and Paradise worlds (`book_world_paradise_host.js` has a gist hit).
11. **Lifespan / age modifier source ledger and age-stage ribbon** (idle-reincarnator P7, immortality-idle P5, six-ages-2 SA2-P1/P4): no ledger hit. Fits `body_view.js`, `lives_figure.js`; supports lifespan in cultivation and Beyonder worlds.
12. **Theater board: key vs optional missions per arc** (super-robot-wars P4, P1 canon clock row with expected/abstained/IF chip): zero hits. Fits `relationship_web.js` and chronicle; the best match to book-world canon timelines.

Near misses worth a look: Forecast-then-reserve season strip (six-ages-2 SA2-P2), Stale-report "as of" stamp (dwarf-fortress DF-P04), Weekly plan strip with failure receipts (magical-diary MD-P6, academagia P1), 24-hour day bar (groundhog-life P1; DESIGNED-ELSEWHERE in `docs/LIFE_SIM_NORTH_STAR.md`).

# UI patterns to borrow (15 concrete forms, not circles)

| # | Visual form | Source game | OOPS panel (inferred) |
|---|---|---|---|
| 1 | Four-pip chip row beside an action: known, permitted, owned means, usable now | Kittens Game, Sapiens, NGU Idle | `technique_ui.js`, `ui/character_sheet_view.js` |
| 2 | Arrival brief strip: "what you already know" facts on world entry | The Strange Tabletop | `ui/crossing_threshold.js`, `ui/scene_card.js` |
| 3 | Theater board: key vs optional mission cards, order changes who joins | Super Robot Wars | `ui/relationship_web.js`, chronicle |
| 4 | Canon clock row with expected / abstained / IF outcome chip per person | Super Robot Wars | `ui/relationship_web.js` |
| 5 | Appointment notebook row: history vs this attempt, reminder bell | Majora's Mask | notebook/chronicle, `src/wait_until.js` clock strip |
| 6 | Wait-until-appointment strip with crossed-boundary receipt | Majora's Mask | clock controls |
| 7 | Who-supplied chip row (helper avatars with named contribution) | Vagrus | `promise_ui.js`, check result card |
| 8 | Check-reason tooltip listing factors of a roll or verdict | Disco Elysium | `combat_situation.js`, silence inspector |
| 9 | Connected clue thread: note nodes joined by lines, rumored vs observed | Outer Wilds, Heaven's Vault | `knowledge_view.js`, `ui/scene_card.js` |
| 10 | Gap-in-document page: visible blank passage filled by separate evidence | Outer Wilds | book/diary reader, `talk_view.js` |
| 11 | Favor ledger with true vs gossiped column and dated cause rows | King of Dragon Pass, Battle Brothers | `ui/owed_ledger.js` |
| 12 | Settlement slip: per-plan accepted/refunded strip with stock and time deltas | Melvor Idle, Legends of Idleon | `ui/owed_ledger.js`, work ledger |
| 13 | Limiting-input bar with one bottleneck marked; forecast-vs-actual batch bar | upload-labs, Potionomics | `ui/craft_glance.js` |
| 14 | Weekly plan strip: seven day columns with failure receipt per slot; 24-hour day bar | Magical Diary, Academagia, Groundhog Life | `village_ui.js`, `ui/character_sheet_view.js` |
| 15 | Age modifier stack list plus age-stage ribbon on a person; scar/chapter strip | Idle Reincarnator, Six Ages 2, Wildermyth | `ui/body_view.js`, `ui/lives_figure.js` |

Additional forms the shards surfaced (not in the 15): carrier/support stack for an ability (Naev), departure quote table (Siralim), travel quote strip (Ur-Quan), locked-branch cards naming missing evidence (Sunless Sea), era-up 1-of-3 insight cards (Cividle), provenance chip trio (Planescape: Torment), catch-up bank gauge (Modding Tree), reward-lifetime tags on item cards (Trimps), purity gauge with named impurity sources (cultivation idlers), estate receipt table (Sunless Skies), journey budget gauge with stop line (Vagrus), stale-report "as of" stamp (Dwarf Fortress).

Already built (do not rebuild): carry ledger / reset preview (`carry_ledger.js`, `lives_carry_domain.js`), crossing carrier preview (`ui/crossing_threshold.js`, WER2/WER3), away receipts (`away_ledger.js`), succession receipt (`heir_inheritance.js`), typed blocker projection (`action_legibility.js`).

---
Per-shard raw outputs with each shard's own UI list: shard_1.md to shard_7.md in this folder.
