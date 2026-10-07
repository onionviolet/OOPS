# Repository slice interface v1

Reserved root files: `src/repository_absorption_content.js`, `src/repository_absorption_facts.js`, `src/repository_absorption_host.js`. UI/workplan workers delivered and released their two files; root now owns final reconciliation. No existing-file writes by this role.

Selected original slice: Miri's wet lantern and the Village floodline pump. Means-aware resin use distinguishes attended repair (player observes) from a finite private NPC self-help controller (player learns only attributed testimony on return). Funded work and lessons pair payer debits with recipient credits through existing typed effects. A practiced sealing method converts actual native kits into protected kits and unlocks paired sealing at mastery3. Exposed and protected work have different actual material consequences; a surface bypass remains available. The same Miri and pump aftermath survive later meetings. This supplements Features' tool/object/combat/society/destination slices without implementing another scheduler, effect/body engine or realm.

Exports being implemented:

- content: `REPOSITORY_ABSORPTION_VERSION`, `REPOSITORY_ABSORPTION_IDS`, `repositoryAbsorptionItemSpecifications`, `repositoryAbsorptionSources`, `repositoryAbsorptionDefinitions`.
- host: `repositoryAbsorptionContext(state, registry, context)`, `beginRepositoryAbsorption(state, registry, context, expectedSequence)`, `commitRepositoryAbsorption(state, registry, command, context, expectedSequence)`, `repositoryAbsorptionPresentation(state, registry, context)`.
- UI: `createRepositoryAbsorptionPanel({registry, read, command})`, returning `{element, render}`. Read follows current native snapshot. Command types `begin`, `command`, `cancel`; callback stamps current sequence and sole integrator publishes once.
- facts: `repositoryAbsorptionFacts(state, context)` joins current executor facts; `retainRepositoryAbsorptionWindows(state, from, through)` joins the existing before-clock-increment seam to freeze unsupported offers. Paid work retains its frozen due time and completion/refund policy.
- host additionally exports `cancelRepositoryAbsorption(state, registry, jobId, context, expectedSequence)`.
- workplan: `defineRepositoryWorkItinerary`, `previewRepositoryWorkItinerary`, `defineRepositoryStockBand`, `previewRepositoryStockBand`, `REPOSITORY_WORKPLAN_LIMITS`; pure next-step/stock-band helpers consumed by host and UI, with no autonomous mutation or saved wrapper. Features alone owns durable mixed workPlans.

Required admission: content arrays to existing simulation registry; source definitions to existing capability source registry; original item specifications to native `OtherItem` templates through `src/data/expedition_items.js`; host context for player and Miri scheduler; typed commit route in main; Notebook panel with existing durable writer; regenerated bundle by Features. Optional omission changes nothing on load/render; only an explicit opening spawns Miri and her finite supplies. Current expansion5/simulation4 and original1 definitions retained. All new gameplay remains implemented-unverified; later behavioral gates deferred.
