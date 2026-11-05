# Multiple worlds and paths: current GM audit

2026-10-07. Human asks whether multiple worlds and paths across worlds are implemented, what related aspects exist and what else to consider. Mode: source-grounded status/development audit, not a new whole-world implementation assignment.

**Yes: nine registered destinations have native/UI consumers, and several authored cross-world growth loops exist.** Scope varies from a workshop pocket to a regional campaign. Nine destination IDs do not establish nine complete source settings or a universal power-transfer system. Current gameplay remains **implemented-unverified**.

## Current represented destinations

| Destination IDs | Actual represented play |
|---|---|
| `base.frontier` | YAIRPG branch home campaign; ordinary skills, freight, workshops, inquiry, facilities, mature work and retained consequences. There is no separately visitable vanilla counterpart. |
| `pocket.folded_glasshouse` | Retained workshop, caretaker, ordinary/powered repair, research, packing and one actual template gift. Village doorway preserves the interior. |
| `feature.tidemark` | Harbor landing/terraces, tide access, optional agreement, timber/counterweight repair, finite trade/salvage and a real loan. Village passage retains the return marker at high tide. |
| `nested.paradise_hub`, `nested.saltworks`, `nested.archive` | Original service branch, waterworks and records institution. Roles, paid work, training, welfare versus issuer requirements, evidence, extraction, settlement and earned personal revisits. Village connects to the hub; the hub connects to each destination. |
| `book.paradise.hub`, `book.paradise.goa` | Supplied-MTL-qualified independent contractor entry/first-Goa branch. Own bench, bracing/rigging/mastery, civil/fire/royal outcomes, opposed rescue, wounds/care, shelter and finite orders. Personal travel differs from accepted funded survey/extraction/settlement. This contractor district is distinct from the original service hub above. |
| `book.mol.cyoria` | Mother of Learning visitor campaign: household/academy/library rights, paid research, non-mage manual lamp, capacity/control/charge, opposed retrieval, treatment, mature research/notebook and changed return. Village connects to seven represented local places. No protagonist body, personal spell source or loop control. |

Exact IDs are in the cold-imported [registry readback](REGISTRY_READBACK.json). Registration: [expedition content](../../../src/expedition_content.js), lines 35–39. Actual consumers: [main dispatch](../../../src/main.js), lines 895–930 and 7292–7306; [refinement presentation](../../../src/feature_expansion_refinements_host.js); [feature panel](../../../src/feature_expansion_ui.js); [pocket panel](../../../src/pocket_realm_ui.js).

Skyrim, Fallout, Elden Ring, Naruto, Bleach and the larger novel roster have dossiers, evaluators or bounded reference uses beyond these destinations. Their full visitable campaigns are not established. The nineteen [book profiles](../../../src/feature_expansion_book_catalogue.js) do not create native people/worlds/stocks. Profiles, scenes and briefs do not add registry destinations. Declared novel provenance is reused here; no novel was reread for this audit.

## Concrete paths across worlds

**Service hub → Saltworks → service hub → Archive.** A supported pressure lesson earns an actual source/method. Saltworks use spends a log/effort, earns mastery 1 and 12 native Equilibrium XP, and changes water infrastructure. The foreman's independently funded reversed-load counter reveals a limit. Paid refinement back at the hub adds mastery 2. The later Archive consumer requires mastery 3 and preserves evidence using one stamina and reusable supports; the ordinary alternative consumes a log and two stamina. Refusal, limited use and attribution remain distinct. [Lesson](../../../src/feature_expansion_nested_content.js), lines 90–91; [growth/refinement/later function](../../../src/feature_expansion_nested_chains.js), lines 180–207 and 233–241. This is a genuine cross-world progression chain.

**Frontier → Glasshouse.** Load-bearing Step mastery 2 and stored Breath drive unlock a foreign-room repair: one log/three drive/one stamina/two minutes rather than two logs/kit/two stamina/four minutes. This is an actual compatible technique/energy consumer. [Repair](../../../src/pocket_realm_content.js), lines 135–142.

**Frontier → Tidemark → Frontier.** Settlement supplies a real survey kit; inspection gives Perception XP; finite salvage yields native logs. Return retains actual belongings/growth, which can feed home crossing repair or Mara's recovery. Repaired harbor access and depleted stock persist. [Outputs](../../../src/feature_expansion_destination.js), lines 53–66; [return](../../../src/feature_expansion_destination_host.js), lines 147–155; [crossing](../../../src/expedition_content.js), lines 95–104; [Mara](../../../src/frontier_campaign.js), lines 41–43.

Paradise and Cyoria also have meaningful local maturity, alternatives and changed returns. That does not establish a career spanning every unrelated world. The mature Cyorian notebook currently has meaningful Cyorian consumers; no applied home-world consumer was found.

## Related systems and boundaries

Same-body passages bind the complete native bag/equipment, health/stamina and custody. Borrowed goods must be returned. Saved knowledge, sources, powers and mastery remain, but local apparatus/body/fuel/authority still govern use. Travel grants no healing, refill, currency conversion, physiology or prestige. The current [native traveler](../../../src/native_realm_traveler.js), lines 22–53, selects one physical body and no companions. Projection, alternate/shared bodies and companion transfer have guarded [planners](../../../src/realm_traveler_profiles.js), not general native execution.

Finite material/stock, paid jobs, institutional rights, NPC knowledge/means/reactions, relationships, opposed choices, wounds/care and physical outcomes have consumers. Unsupported absence freezes represented local clocks; supported observation/work and saved commitments have explicit exceptions. These are bounded people/places, not a full planetary simulation. Travel remains separate from the one Frontier renewal/prestige.

Conservative internal carrier `unavailable` classifications are not proof that trained pressure disappears or that its UI falsely announces it unusable. Actual local consumers support it, and [carrier presentation](../../../src/backlog_expansion_transit.js), lines 490–496, returns received records/eligibility rather than those internal rows. No visible defect is asserted from that metadata.

## Five priorities to consider

1. **Another career across different clusters.** Follow learn→apply elsewhere→discover a limit→refine→return to changed earlier play. A proposed mundane Frontier use for the Cyorian notebook could connect research without exporting its magical anchor. This is a proposal, not implemented gameplay or accepted universal conversion.
2. **A readable discovered-world route overview.** Show present world, known onward/return routes, custody blockers, source/fuel requirements and actual commitments. Clearly distinguish the two Paradise hubs. Existing rows disclose local costs; a unified discovered-world overview was not found. Preserve unseen destinations/private plans/future-source boundaries.
3. **Compatible visit-history compaction.** Nested/Paradise have 96-row visit caps; Cyoria has 128. Preview/commit rejects new passage when required slots exceed capacity. These count visit records, not full round trips. Tidemark/Glasshouse already prune ended visits. A repair must retain active visit, instances, claims, paid history and validators, followed by deferred save/reload/import proof. [Nested](../../../src/feature_expansion_nested_host.js), lines 20–22 and 189–191; [Paradise](../../../src/book_world_paradise_state.js), line 8 and [preview](../../../src/book_world_paradise_host.js), lines 51–55; [Cyoria](../../../src/book_world_mol_state.js), line 8 and [preview](../../../src/book_world_mol_host.js), lines 35–43.
4. **Useful mature play with actual supply.** Add recurring demand/projects/relationships with real funding/input causes, without reentry refills or duplicate rewards. Keep ordinary/research/social approaches useful; avoid compulsory daily upkeep in every old world. Review retreat/recovery after finite supplies or opportunities are exhausted.
5. **Close the deferred playable gate when that phase resumes.** Run learn→travel→use→refine→return→reload→revisit on generated state, plus ordinary/refusal routes, incompatible powers, custody, injury, absence and failed-save recovery. The [acceptance backlog](../book-world-completion-2026-10-06/ACCEPTANCE_BACKLOG.md) remains unrun. Source/build checks cannot replace it.

Companions, nonhuman starts, loops/rewind, higher planes, deep soul/energy paths and broader source-world campaigns need separately scoped local rules and actual native consumers before becoming available gameplay.

## Evidence and closeout

Two bounded read-only reviewers returned coverage/progression; root checked decisive consumers and history caps. Live app state showed the prior book-world coordinator idle/released; the independent Steam review keeps its scope. No gameplay/library/private-save writes occurred.

Cold registry import passes: nine destinations, 1,153 simulation commands, one formal technique and 27 simulation powers. These last counts omit native skill breadth and measure registries, not quality. [Build readback](BUILD_READBACK.json) confirms existing bundle `ebf951d62861`, matching receipt/map, 335 matching current local sources with zero drift and matching served bytes at[the existing local game](http://127.0.0.1:18195/). No rebuild or gameplay/unit/browser/save/failure/regression/director check ran.

Only this audit folder and PROJECT/index/multiverse links changed. [Exact prior owner text](BEFORE_OWNERS.json) preserves superseded documentation. Gameplay/build, saves/libraries, attribution/LICENSE and unrelated dirty work remain untouched. No new roster/power/prestige/implementation decision, external message, install, commit, publication, automation or visible chat. The source-status audit is complete; additional gameplay requires a concrete implementation scope.


## Content reconciliation: represented worlds and later delivery, 2026-11-04 (B370)

The complete audit preserves meaningful represented play rather than equating nine IDs with nine complete source settings. Its workshop pocket, regional harbor, original nested-service cluster, supplied-MTL Paradise-derived branch and Cyorian visit have different depth, era and authority. Two Paradise hubs remain distinct. Nineteen profile definitions are not nineteen activated campaigns, and local places are not additional whole worlds. Destination/command/power counts and native consumer observations belong to the cited source/build snapshot; current capability needs actual present evidence.

Keep the concrete progression relationships: learned method versus mastered application, local source/fuel/body/tool support, refinement after a limit and useful return consequences. A foreign notebook need not export its magical anchor to support a mundane task. Carried actual cargo/borrowed custody, personal travel, agreed mission, extraction readiness, actual arrival and once-only settlement remain separate. Internal carrier metadata alone does not prove a visible block or loss. Travel does not intrinsically heal, refill, convert currencies, copy physiology or grant office, while an actual supported mechanism can do more.

The later home/social owner records the ten-destination/notebook/visit-compaction wave, and the absorption owner records known-route delivery. Those dated results qualify this audit’s earlier missing consumers; they are not newly browser-verified here and do not close every stronger-world, companion/body or general transfer gap. Preserve history and active obligations when compacting; old96/128row limits count records rather than round trips and are not blanket permission to delete played lives. Mature repeat demand still needs actual actors, funds, supplies and time without reentry refills or unpaid off-screen production.

The five priorities remain considerations at their date, not the present build order or universal gate. Current direction/AD51 and specific current owners govern selected work; AD42 makes human review optional. Learn/travel/use/refine/return/reload/revisit is a useful selected acceptance route, not proof already obtained by a registry or source-map match. No source, current world state, clock, server, build, gameplay journey, save or browser check was performed by this review.
