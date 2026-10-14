# B6 report: generated physiques and bloodlines

Status: COMPLETE docs-only proposal, 2026-10-14. All writes remain under this B6 folder. No source edits, build, npm, staging, commit, push, save access or native/browser operation. Main checkout was dirty and other workers were active. Branch observed: `codex/gameplay-foundations`; HEAD at audit: `2a9efa3793074acd890c27183763191a3063503c`. Source facts below are snapshot evidence, not claims about another worker's later build.

The gap is a missing compositional body generator and runtime joins. Existing authored sources/faculties can support a bounded first consumer, but a generated name or positive capability grant alone cannot supply physiology, costs, inheritance or observer-safe discovery. This packet specifies those contracts without changing their owning runtime.

## Deliverables

| File | Coverage |
|---|---|
| [GRAMMAR](GRAMMAR.md) | Seven-part G47 record; five world-family join tables; per-world rarity adjectives; five naming styles; keyed assembly with saved outcomes; reproducible fixture algorithm. |
| [VALIDITY](VALIDITY.md) | Ten admission gates; EV6 crossing states; three original fixture manifests; concrete action-hook seams versus missing adapters; future negative/runtime tests. |
| [SAMPLES](SAMPLES.md) | 20 reference-generated cards: 7 cultivation, 7 wizardry, 6 home. Each has mechanism, trigger, actual function, cost or none, discovery, transmission, two valid names and a world-fit explanation; hashes preserve emitted selection/name. |
| [SAVE_SHAPE](SAVE_SHAPE.md) | Optional ledger semantic shape; body/source/knowledge/RNG ownership; atomic publication; legacy absence; version/missing-pack rejection; inheritance and compaction joins. |
| [CHECKPOINT](CHECKPOINT.md) | Numbered work state and completion evidence. |

## Audit: existing trait, talent and source generation

**SOURCE** means read current files. **INFERRED** marks architectural conclusions. No runtime behavior was exercised.

| Code | File:line evidence | Verified fact and implication |
|---|---|---|
| F1 | `src/capabilities.js:4-5,9-35` | SOURCE: `trait` and `bloodline` are allowed kinds; `physique`/`constitution`/`talent` are not separate kinds. Providers and grants require finite positive amounts; conditions cannot depend on capability facts. INFERRED: a body card can map to a registered trait/bloodline, but costs/negative effects need separate handlers. Do not add a new source kind just for a prose label. |
| F2 | `src/capabilities.js:39-66` | SOURCE: pure capability query resolves static definitions and owned sources, expires sources, checks faculty awake/active/suppressed state and grant predicates, then combines `max` or `sum` with provenance. INFERRED: reuse for explicit consumers, not general anatomy simulation or parameterized per-organ instances. |
| F3 | `src/body_progression.js:4,15-23,33-49` | SOURCE: three authored sources are Natural balance (inherited), Conditioned grip (trained), Palm mark (acquired). Enrollment grants dormant balance; study awakens/activates it; completed drills with recovery grant grip. INFERRED: acquisition, expression and training already differ, but there is no rolled mechanism grammar or confirmed genealogy. |
| F4 | `src/body_progression.js:50-62,65-69`; `src/expedition_content.js:89-96` | SOURCE: rough timber creates a scrape/mark; recovery clears conditions, visible changes can be shown to a craftsman. Packing reads hand-control and tender-hand facts to change duration. INFERRED: generated ordinary body cards can extend an actual work seam without touching global native stats or creating magical ancestor powers. |
| F5 | `src/expedition_content.js:64-78` | SOURCE: Field eye is a fixed registered trait selected by the observation table: ordinary weight 4, Field eye weight 1. Inspection has a saved discovery roll. INFERRED: this is random acquisition of an authored source, not seeded composition of physique parts or deed-based talent generation. Reuse its patterns, not its fixed one-time inspection as a new lifetime anti-abuse rule. |
| F6 | `src/expansion_engine.js:195-207,303-325,500-507` | SOURCE: source instances validate acquisition time/receipt/world/revision/origin and registry membership; registry grants come from definitions. Grant ignores an already held unexpired source ID. INFERRED: arbitrary generated grants will not work without a selected registry/instance adapter; duplicate body-card acquisition must not silently lose an outcome. |
| F7 | `src/expansion_engine.js:278-286,479-485,517-521,529-531,557-579` | SOURCE: preview exposes roll distributions; xorshift updates moving `state.rng`; commitments freeze outcomes and roll receipts; completed history keeps only 100 entries. INFERRED: legacy roll receipts are useful groundwork, but history cannot be sole durable card/inheritance authority and a moving cursor is not the original immutable seed. |
| F8 | `src/simulation.js:36-38,49,67,178-184`; `src/simulation_contracts.js:218,306` | SOURCE: simulation seed derives from current expansion RNG; automatic checks have their own saved RNG and outcome selection updates `s.seed`. INFERRED: separate named RNG state already has local precedents, but G47 still requires integrated P1 registration/root and saved output rather than reuse of these mutable seeds. |
| F9 | `src/simulation_effects.js:281-284,302-333` | SOURCE: knowledge is per actor with stage/value/cause/basis; conditions have intensity/expiry; source/faculty operations separately grant, remove, awaken, activate, suppress and develop. INFERRED: these are adapters to reuse, not evidence for full reservoir, biological transmission or all BP handlers. |
| F10 | `src/character_bio.js:10-27` | SOURCE: bio explains earned effects, filters source kinds and unawakened faculties, groups by origin, and displays source definition labels/details. INFERRED: it is not a complete per-observer generated-card diagnostic projection. Awakening cannot substitute for knowing all hidden parts; new truth labels must not simply be injected into this view. |
| F11 | `src/backlog_expansion_body.js:50-60,64-74` | SOURCE: fixed living-reed trait, installed brass-lung equipment, clay support and taught-family knowledge supply distinct conditional capabilities. Device commands distinguish install/control/fuel/remove. INFERRED: multiple mechanisms already exist as authored contracts; they are not random genetic inheritance and must remain separate from a G47-generated catalog. |
| F12 | `src/encounter_content.js:22-25`; `src/field_workshop.js:19`; `src/observation_content.js:12`; `src/pocket_realm_scenes.js:237-255` | SOURCE: fixed profile mapping and authored Pattern imprint/Return Gaze/Frame listener definitions create sources; Frame listener is explicitly a selection-gated proposal with declared original body/scope. INFERRED: data factories or `map`-built definitions are not a random body generator. Empty grants may still have dedicated consumers, so audit the handler rather than classifying all empty grants as inert. |
| F13 | `src/npc_lives.js:4-22` | SOURCE: fixed family IDs/names/relationships, with seed-hashed lifespan variation. INFERRED: not free-form household/physique generation; keep current people, ancestry and identity untouched. D7/P4 own future generated household/person admission. |
| F14 | `src/book_world_mol_state.js:47`; `src/book_world_mol_host.js:69`; `src/book_world_paradise_actions.js:160` | SOURCE: MoL assessment forbids importing an unselected casting talent and entry grants no personal talent; an authored Paradise trait declares no spendable fuel/kill-yield consumer. INFERRED: references to talent/bloodline in source text do not establish executable G47 or transferable protagonist powers. Preserve source-qualified authored ownership. |
| F15 | Search `rg -n -i 'talent|trait|constitution|physique|bloodline' src --glob '*.js'`; filename search for `talent|trait|constitution|physique|bloodline|generat|random|stream` | SOURCE: relevant source matches fall into the authored adapters above, bio/authoring catalog prose and isolated source references; no matching dedicated generator/RNG-stream filenames appeared in the main `src` snapshot. INFERRED: no general G47 mechanism-based generator found. This is a bounded source audit, not proof that no alternative helper exists anywhere in the repository or that P1-P4 worktrees are absent. |

## Readback and reconciliation

Read standing AGENTS/PROJECT priorities, USER_VISION top direction, COMMON/PLAN and G1-G51; genetics G47 remains a proposal. Life-sim sex/body/person-layer/gimmick guidance and the 2026-10-11 integration preserve distinct body/source/learning/office/ancestry, optional no-cost strengths and world-qualified exceptions. No accepted product owner was edited.

Procgen readback: PLAN and COMMON; P5 talent/household/lore/secret/appearance/pacing contracts and report routing; P7 GUIDELINES; P9 PROFILE_RULES and relevant HP/Cradle/MoL/Worm/LOTM profile/report boundaries; P11 CONTEXT/WORLD_SEEDS/IDENTITY_AND_CULTURE and domain/report routing. P10 ORIGINAL_WORLD_FACTORY was an additional original-profile comparator. This was a contract readback, not an independent reread of every novel, a new canon census or certification of sibling branch proof.

D3 owns earned talents/chapter settlement; G47 owns lasting generated body foundations, including birth or acquired mechanisms. D7/P4 own people/household identity; B6 cannot invent relatives from a label. P7 owns names/reservations; B6 adds semantic card-label tokens. P9 source profiles reserve canon-exclusive bodies/powers. P11 separates hard eligibility, weight, functional outcome and observer exposure. E1/P1 own seeded decisions; legacy main RNG still needs integration reconciliation. B2/B3/B7/B8 retain body, transmission/prestige, detail generation and presentation ownership.

B6 fixture worlds are original authored **test manifests**, not existing world owners or new destinations. Their laws make functions reviewable without presenting hypothetical constitutions as Harry Potter or Cradle canon. Cultivation, wizardry, tech, superpower and home remain available family palettes. Implementation remains one selected playable slice at a time, one realm and one prestige layer. No general generator, new world or mobile work is required by this packet. Future UI target is 1366x768 plus a wider desktop; B6 makes no UI behavior claim.

## Ranked recommendations

1. **A1:** Bind one ordinary home card to a real repeatable packing/inspection consumer. Keep the generated result and diagnostic evidence saved. This tests G47 with existing bodily/source seams before selecting supernatural adapters.
2. **A2:** Reconcile P1, B2 and B7 before reserving a runtime schema or allocating body slots. Root must confirm integrated RNG exports and exactly one owner per body/cause.
3. **A3:** Use a finite registered archetype catalog with generated compatible parameters/names first. Add per-instance organ/source support only for a selected function that needs it.
4. **A4:** Qualify one chosen world law and function before admitting magical families. Preserve source-quality labels and private canon reservations; no genre-wide heredity default.
5. **A5:** Treat B3 transmission as a separate actual transaction with parent/template/pact/custody references. Potential, learned skill, stored energy, inherited office and social recognition must remain distinct.

All recommendations are proposals, not new authorization or accepted priority changes.

## Verification and open gates

Documentation checks: reference-generation script emitted exactly 20 unique tuple fixtures, split 7/7/6; checked populated seven-part fields and persisted deterministic hashes/names. Independent readback reconstructed all 20 tuple selections and label choices from the saved hash receipts and frozen label catalog. Static checks passed: six owned Markdown files, 17 local file links, 28 file:line range occurrences within existing source bounds, 20 populated card/world-fit rows, valid example JSON, no em dashes or trailing whitespace. All 13 audited source fingerprints still matched at final check. Locator checks validate bounds; the source findings were also manually read against the quoted code. These checks do not verify a runtime generator.

**Open authoritative playable gate:** a separately selected implementation must obtain a generated card through an actual acquisition route, show its function changing a real action in rebuilt fresh-origin desktop play, and preserve truth/knowledge/source/input/RNG state through Save/reload/Export/literal-file Import. Source tests/build, failed-publication/import checks, world/source qualification, B2/B3/B7 ownership joins and director fiction/balance acceptance remain separate open gates. None was run by B6. No personal saves, browser state, hardware or private library were accessed or changed.

Not verified: runtime generation/draw isolation, real probabilities, costs/balance, NPC body materialization, organ physics, all-world canon genetics, actual heredity, current sibling worktree APIs, installation/deployment or human taste. Structural fixture consistency is not playable proof. No sealed truth or assignment was added to these public documents.

## Audit input fingerprints

SHA-256 of the read main-checkout source snapshot. Reaudit drifted files before implementation; HEAD alone does not identify dirty bytes.

| Source | SHA-256 |
|---|---|
| src/capabilities.js | c72b4c32d26ffb4988e970e6aa849498e3fb79e5bd987b7ab86d449a15322b35 |
| src/body_progression.js | 47e8de67bdb099fb41365afafbf3081e342e734d97615850f921e0b280dfe84e |
| src/expansion_engine.js | da1e9761400bec1cf72f4da171408f22af6cb6a2ce3dd72565b8b29039ab3f82 |
| src/expedition_content.js | 0b9030b096bbe4e2868e0686d9d51057e9c34e7ccd07781badbd46b83e38ff37 |
| src/simulation.js | 2a790db46f004639d356ebec3678bfe63e1957fe5fda6cc9892368a050b54b66 |
| src/simulation_effects.js | 507a5a60b82eaade331601c90f5e98410a2d99486903b9109937f933f3ffe151 |
| src/character_bio.js | f6dc97c32f651734fb1984df7a93b9c44b42b1078380b7df51a1b670c8dd959a |
| src/backlog_expansion_body.js | a1524bf27c8ecf0aae1c0241e7b685ce7d8d993a79ec53830042f854167237a4 |
| src/encounter_content.js | 718dbcc85d4e4a727f8c2ae9b944d87c24fe482078e55e5a8003a7f2fda2a364 |
| src/field_workshop.js | b9ab567ff075e1a4cb224d1e464dff07befeaedd935afb31f46e4ebdf4d86b05 |
| src/observation_content.js | 30a1108998f88c6c85c1eea7cf26d990eeec6c685aad6b8330ee0b0fcc6c20e6 |
| src/pocket_realm_scenes.js | 3cd0be10996073938c2642c95a04def0aebeceecad6ac27916cc78cb6181cfc1 |
| src/npc_lives.js | abef56e7d73a0e17a3ba551608eafc4fb7f9f1660c17a445cfe96ae9869eb804 |
