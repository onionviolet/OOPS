# CH1 chance-core fit map

Rules: LSD335-LSD387; GR references point to `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md`. Phase ownership follows LSD376-LSD378.

| Probe | Expected | Observed | Gate |
|---|---:|---:|---|
| Rows mapped | 53 | 53 | no |
| Rows with an existing relevant function/module | about half | 38 (71.7%) | no |
| Existing resolver golden cases unchanged | all | 21 cases retained | yes |

| LSD | GR row | Existing module/function | Gap | Phase |
|---|---|---|---|---|
| LSD335 | GR1, GR2 | src/check_resolver.js: resolveCheck | Resolver exists; callers still need a shared keyed input shape. | P1 |
| LSD336 | GR3, GR4 | src/gen_kit.js: address, drawU32 | Addressed truth is available; freezing revealed facts belongs to each consumer. | P1 |
| LSD337 | none | none | Outcome level agreement is outside this chance helper. | P4 |
| LSD338 | SB8, SB10 | src/gen_kit.js: pickStratified, drawU32 | Category strata exist; no bounded Bernoulli batch helper is exposed. | P1 |
| LSD339 | none | src/check_resolver.js: resolveCheck | No universal luck stat; world-specific mechanisms supply modifiers. | P1 |
| LSD340 | GR5 | src/check_inspector.js: readCheckInspector | Author odds view exists; character appraisal belongs with perception/dialogue. | P5 |
| LSD341 | GR2 | none | Surprise timing needs fight tempo consumer. | P4 |
| LSD342 | GR2 | src/check_resolver.js: resolveCheck | Generic check exists; feints need talk/fight consumers. | P4 |
| LSD343 | GR2 | src/check_resolver.js: resolveCheck | Generic check exists; condition factors and mishap consequence belong to fight rules. | P4 |
| LSD344 | GR5, GR13 | none | Place and witness consequences need the fight/crowd consumer. | P6 |
| LSD345 | GR1 | none | Fight goals are resolved by fight policy, later revised by LSD368. | P4 |
| LSD346 | GR3 | none | Stock and equipment wear need item/fight consumers. | P4 |
| LSD347 | GR2, GR3 | src/check_resolver.js: resolveCheck | Resolver supports keyed aftermath checks; consequence consumers are absent here. | P4 |
| LSD348 | GR1 | none | Pressure changes fight policy selection. | P4 |
| LSD349 | GR9 | src/check_inspector.js: readCheckInspector | Author-only odds and receipts exist; no concise check description projection. | P1 |
| LSD350 | GR16 | tests/check_resolver.test.js: golden cases | Golden replay exists; canon calibration needs P8 harness and source baselines. | P8 |
| LSD351 | GR5 | src/people_knowledge.js, src/relationship_view.js | Existing knowledge and relationship stores need P2 record semantics. | P2 |
| LSD352 | GR5 | src/relationship_view.js | Bond projection exists; episode-derived behavior belongs to P3. | P3 |
| LSD353 | GR4 | src/people_knowledge.js | Known-person storage exists; promotion/caps need P2. | P2 |
| LSD354 | GR2, GR3 | src/check_resolver.js: resolveCheck | Generic keyed check exists; recall and fade are P2 memory behavior. | P2 |
| LSD355 | GR5 | src/people_knowledge.js | Knowledge projection exists; source certainty and memory versions need P2. | P2 |
| LSD356 | GR5, GR13 | src/people_knowledge.js | Knowledge storage exists; schedule-mediated gossip belongs to P3. | P3 |
| LSD357 | GR5 | src/relationship_view.js, src/people_knowledge.js | Consumers must read episodes; P3. | P3 |
| LSD358 | GR5 | src/memory_messages.js | Character chronicle exists; separating player/character knowledge in checks needs P2. | P2 |
| LSD359 | GR3, GR10 | none | Canon-date memories need cast packs and memory projection. | P2 |
| LSD360 | GR3, GR11 | src/life_events.js: MEMORY_CAP, EVENT_CAP | Existing bounded event memory; episode folding belongs to P2. | P2 |
| LSD361 | GR12 | src/relationship_view.js, src/people_knowledge.js | First memory slice is P2/P3 integration, not chance core. | P3 |
| LSD362 | GR5 | src/check_inspector.js: readCheckInspector | Inspector exists; memory inspection awaits P2 record shape. | P2 |
| LSD363 | GR2, GR17 | src/check_resolver.js: resolveCheck | Resolver keys supplied address; shared subject/clock/factor composition is missing. | P1 |
| LSD364 | GR6 | src/check_contract.js: prepareCheck, applyCheckPolicy | Paid spends exist; retry fatigue and cumulative search effort require consumers. | P2 |
| LSD365 | GR17 | src/check_resolver.js: validateAddress | Game-time address exists; named periods such as day/week are not standardized. | P1 |
| LSD366 | GR4, GR11 | none | Aggregate crowd record and its budget belong to P6. | P6 |
| LSD367 | GR4 | src/gen_kit.js: address | Stable addresses exist; crowd slot promotion belongs to P6. | P6 |
| LSD368 | GR2 | src/check_resolver.js: resolveCheck | Generic check exists; disengage choices and consequences need P7 fight consumer. | P7 |
| LSD369 | GR5, GR13 | none | Crowd memory, witnesses and authorities need P6 consumer. | P6 |
| LSD370 | GR2 | src/check_resolver.js: resolveCheck | Shared resolver exists; listed domain checks belong with their consumers. | P4-P8 |
| LSD371 | GR1 | none | Named-factor/action eligibility policy is not encoded as a universal roll gate. | P1 |
| LSD372 | GR5 | src/memory_messages.js | Rendered text is separate from compact memory payload; structured episodes need P2. | P2 |
| LSD373 | GR5 | src/relationship_view.js | Relationship projection exists; episode-derived bond axes need P3. | P3 |
| LSD374 | GR3, GR11 | src/life_events.js: MEMORY_CAP, EVENT_CAP | Some memory caps exist; five-rule episode retention/folding needs P2. | P2 |
| LSD375 | GR11, GR16 | none | Worst-case memory save budget test belongs to P2. | P2 |
| LSD376 | GR2, GR16, GR17 | src/check_resolver.js; src/gen_kit.js | Resolver, stratified picks and receipts exist; key composition and chance-value projection gaps remain. | P1 |
| LSD377 | GR3, GR11, GR16 | src/people_knowledge.js, src/relationship_view.js | Memory records and effects are separate P2/P3 phases. | P2-P3 |
| LSD378 | GR2, GR3, GR16 | src/native_battle.js | Fight runtime is the owner; phases and consumers are P4-P8. | P4-P8 |
| LSD379 | GR1, GR2 | none | No stable passive check value helper; active checks already resolve through resolver. | P1 |
| LSD380 | GR5 | src/check_inspector.js: readCheckInspector | Inspector is author-only; equivalent failed/absent player projection is missing. | P1 |
| LSD381 | GR2, GR3 | src/check_resolver.js: resolveCheck | Stable keyed address can support let-it-ride; settled-result cache belongs to consumer. | P1 |
| LSD382 | GR2, GR3 | src/check_resolver.js: resolveCheck | Generic check exists; first-reaction fact and P3 bond inputs belong to memory consumer. | P3 |
| LSD383 | GR2, GR5 | src/check_resolver.js: resolveCheck | Generic check exists; social tell production and reading belong to talk consumer. | P5 |
| LSD384 | GR5 | none | Telegraph and perception projection belong to danger/site systems. | P4 |
| LSD385 | GR17 | none | Threat escalation clocks and staged consequences belong to EP6. | P4 |
| LSD386 | GR2, GR17 | src/gen_kit.js: drawU32 | Addressed draws exist; interval pressure table belongs to site/exploration systems. | P8 |
| LSD387 | GR5 | none | Threat selection and warning presentation belong to world/site consumers. | P4 |
