# Taiwu deep pass, 2026-10-14

Taiwu uses ranked goals and weighted action planning alongside separate monthly relationship, demographic and institution routines. People can seek missing knowledge, ask for help, marry, form factions and leave useful manuals behind. Adventures combine authored maps/node graphs with compiled event scripts. These are shown in installed managed bodies, not inferred from a life-sim label.

**Status: PARTIAL.** The main planner, adventure grammar, active-reading defaults, normal legacy payout order and key transfer handlers are now traced. The prior unread table is reconciled below, with several broad families still open. No game launch, assembly execution, save access, YAIRPG implementation, staging or commit occurred. Raw code/data stays in `~/.codex/research/taiwu-2/`; the old work area was reused read-only.

## Ranked PROPOSALS

All unselected. Implement original code/content only. First milestone remains one realm/one prestige layer; alternate and repeat improvement routes stay possible. No imported permanent uniqueness/click/lesson cap is recommended. Any future UI proof targets1440×900 laptop/desktop, with mobile deferred. This report supplies no browser/gameplay acceptance.

| Rank/code | Useful result | Owner system | First proof |
|---|---|---|---|
| 1/P1 | Give a named NPC a real need and several lawful or world-fitting means, with a visible reason for the chosen plan. | docs/CHARACTERS_AND_WORLD_EVENTS.md; docs/ENGINE_EXPANSION.md | One NPC lacks a page, seeks a known teacher, pays time, can be refused and retains progress. |
| 2/P2 | Keep the physical manual, known page variants, comprehension and useful practice separate. | docs/SKILLS_AND_TALENTS.md; docs/ENGINE_EXPANSION.md | A damaged copy plus a matching reference changes study and later use without silently repairing the object. |
| 3/P3 | Specify succession per channel, including pending work and private knowledge, with explicit move/copy/merge/reset policies. | docs/SELVES_AND_ECHOES.md; docs/RULES_FROM_SCRATCH.md | A successor receives the selected channels, keeps their own bonds and cannot duplicate settlement on reload/import. |
| 4/P4 | Compose teaching access from actual social, institutional, knowledge and availability predicates. | docs/LIFE_SIM_NORTH_STAR.md; docs/ENGINE_EXPANSION.md | Two teachers can give different concrete refusal reasons and each has a reachable alternate route. |
| 5/P5 | Author an adventure with separate eligibility, entry cost, branch state, exit and world aftermath. | docs/CHARACTERS_AND_WORLD_EVENTS.md; docs/WANDERING_ZONES_AND_INSIGHT.md | A paid branch changes a later visit; leaving and completing settle different authored consequences. |
| 6/P6 | Let a local coalition form, lose members and respond to a public act through jurisdiction. | docs/CHARACTERS_AND_WORLD_EVENTS.md; docs/ENGINE_EXPANSION.md | One witnessed act changes support and duties only for the actors/institution that know it. |
| 7/P7 | Keep force reserve, method-earned capacity and allocated benefits distinct. | docs/SKILLS_AND_TALENTS.md; docs/ENGINE_EXPANSION.md | Two methods change useful outcomes differently, with a visible recovery/improvement route. |

## Answers

**F1: NPC autonomy is a hybrid.** CharacterGoalData selects priority from base, instance, behavior and settings. The live agent uses WeightBasedPathfinder, not the shipped A* implementation. It searches condition/effect chains with weighted random ordering, rechecks plans and uses action points/cooldowns. Protection/revenge creators and study implementations close actual decision-to-result links. Social and distant-marriage passes run separately. [NPC digest](NPC_AUTONOMY_DIGEST.md).

**F2: Succession is channel-specific.** Proficiency replaces; artifact affinity merges; ordinary information moves; named story favor has special directional policies; artisan orders retarget. Normal UI pays leftover points before successor confirmation resets legacy points. TransferInformation copies then removes the destination secret-knowledge key, an unresolved source anomaly. Universal knowledge or bond carryover would be an unsupported claim. [Transfer digest](INHERITANCE_TRANSFER_DIGEST.md).

**F3: Teaching has exact local gates.** Sect exploration state, available days, alertness, jurisdiction/punishment, prior lessons, school-specific fame/gender/favor routes, support grade and earlier arts can all matter. Agreement and comprehension differ. Two support-grade formulas ship in different consumers. Five script packages were decoded to EOF; full dialogue/service closure remains open. [Gate digest](EVENT_GATES_DIGEST.md).

**F4: Adventures are data plus host-bound scripts.** Protobuf maps/elements/major-event nodes embed compiled instructions; editor JSON compiles into these bytes. A custom expression interpreter runs function IDs, values, conditions and control flow. Generation checks time/cooldowns/count/location; major-event entry pays cost then initializes a persistent branch graph. [Adventure digest](ADVENTURE_AND_GRAMMAR_DIGEST.md).

**F5: Study has several ledgers.** Physical condition, page variant, reading progress, breakthrough readiness, proficiency, chosen mastery and force allocation differ. References improve effective page condition. Active reading costs1 day/3 intelligence and settles at ten-progress batches with150/100/50 efficiency tiers. Per-art force gain clamps to capacity, then current force clamps to character maximum. [Study digest](STUDY_AND_FORCE_DIGEST.md).

**F6: Comparisons need evidence qualifiers.** Taiwu supplies executable autonomy/marriage traces. Tale's follow-up supplies official table rules without full selectors; Immortal Life supplies schedules/shared-residence and work-preparation data without NPC planning bodies. These are evidence differences, not claims that the other games lack those mechanics. [Comparison](COMPARISON.md).

## Prior unread table: confirm, correct, extend

| Prior gap/finding | Disposition in this pass | Remaining limit |
|---|---|---|
| Legacy/LegacyPointType/world settings/full awards | Extended:749/8 rows; concrete WorldCreation15/WorldState57 tables; additional adventure award consumers | All-row meaning, world consumers and every award call site still open |
| Frontend CompletePassingLegacy order | Closed for normal same-archive UI path | Cross-archive and crash/retry semantics open |
| Information/Extra/general relation transfer | Direct key handlers traced, private-knowledge anomaly identified; normal/random differ | Every listener and death/general-relation cleanup not exhausted |
| Event/teaching/service predicates | Main teaching route and exact script additions decoded; exchange threshold mapped | Every service, school branch and trade settlement not exhausted |
| Config.GlobalConfig failure | Corrected: actual type is root GlobalConfig; reading defaults and consumer traced | Runtime/mod overrides and UI guard at cap unverified |
|955 techniques/319 buildings/effects | Retain prior counts; ten page-effect dispatch rows reviewed; nine new tables enumerated | No claim to semantic review of955/319 rows or all effects |
| Marriage/pregnancy/bequests | Executable local/distant marriage, birth-risk, social-parent and estate paths extended | Full genetics, replenishment and cleanup coverage open |
| Force matrix/capacity/combat consumers | Base element matrix, classifier and per-method/current-force clamps traced | Special-effect overrides and all combat consumers open |
| Unity UI/assets | Normal legacy UI call order read; adventure compiler read | Visual layout/interaction and all blueprints not inspected |
| Runtime/saves/notproton | Explicitly excluded by wave rules | All playable/persistence/compatibility acceptance open |

Proposed owner edits for the coordinator: link this pass beside the prior PARTIAL dossier; preserve exact consumer distinctions and the secret-knowledge anomaly; replace the old GlobalConfig and normal-payout gaps with these source-level answers. Province War may cite this shared dossier through its own register. No live design owner was changed and no proposal became an accepted direction.

Shown means directly read code/data; stated means another local dossier's report; inferred means interpretation explicitly marked as such. Source symbols and scope live in the digests, hashes/rerun recipe in TOOLING and remaining work in CHECKPOINT.
