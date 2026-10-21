CHECKPOINT: MQ-A tag inventory, 2026-10-19, doc only. One new file; nothing else edited, committed, switched or pushed. Everything below is a proposal, not an accepted decision.

# MQ-A: live tags and axes against the Round 6 proposals

Lane of the [core audit, Round 2](../WORLD_DIALS_AND_INTERPRETER_CORE_AUDIT.md). Compares live
definitions with [CRAFTING_ENGINE Round 6](../../CRAFTING_ENGINE.md) TQ1 to TQ15 and NX1 to NX14.
Builds on [L1](../world_dials_2026-10-19/L1_FACT_VOCABULARY.md) (fact registry). Labels: SHOWN (read in
code, file:line), STATED (a doc says so), INFERRED, MEMORY (none used). "Reader" means the function
that consumes the tag or axis to decide something; a definition or a content row that merely lists the
tag is not a reader.

## 1. Where tags are registered

| Registry | Where | Tags | Live use |
|---|---|---|---|
| `frontierCatalogue.registry` | `src/craft_content_frontier.js:19-26` (built by `defineCatalogue`, `craft_materials.js:59`) | 23 | Imported by `src/crafting_frontier_runtime.js:3` (SHOWN), so the pack is in a runtime path. The file header says "Not wired into live gameplay yet" (`craft_content_frontier.js:3`); that comment looks stale (INFERRED) |
| `villageRuleTags` | `src/mixture_rules.js:10-14` | 4 | Village rule modules, `mixture_native.js` via `mixture_rules.js` (SHOWN import chain `mixture_native.js:10,23`) |
| Test registries | `tests/tag_store.test.js:7-13,40-43` | test only | Not live |
| `src/data/*` | grep of `new TagRegistry` and `TagRegistry` | none | `src/data` has no registry (SHOWN: the only `new TagRegistry` sites are `tag_store.js:138,212`, `craft_materials.js:59`, `mixture_rules.js:10`) |
| Item `tags` boolean maps | `tag_store.js:23-31` accepts them (`tagIds`) | not a registry | Not inventoried here (see section 8) |

Definition shape (SHOWN `tag_store.js:38`): `id, kind, parents, revision, visible`. Every live tag
has `revision:1` (SHOWN `craft_content_frontier.js:8,25`, `mixture_rules.js:11-13`). Visibility
defaults to `open` (`tag_store.js:45`); only `moonlit` is `hidden` (SHOWN `craft_content_frontier.js:25`).

## 2. (1) Every live tag kind and tag, with reader

Kinds live: `origin, phase, use, property, derived, station, tool, season, place` (frontier, 9) and
`material` (Village, 1). Ten kinds in all.

| Tag | Kind | Parents | Visible | Rev | Reader (file:function) |
|---|---|---|---|---|---|
| plant | origin | none | open | 1 | Parent only. `herb`, `root` imply it; no direct query found (INFERRED none) |
| herb | origin | plant | open | 1 | `craft_recipes.js:133` via `pickMaterial`/`materialPool` (`craft_materials.js:199-229`) with pool `'herb'` (`craft_content_frontier.js:91`) |
| root | origin | plant | open | 1 | Same path, pool `'root'` (`craft_content_frontier.js:92`) |
| mineral | origin | none | open | 1 | Parent of `salt`, `ore`; also on Lime chalk (`:43`). No direct query found |
| salt | origin | mineral | open | 1 | None found beyond family tags (`:34`) |
| ore | origin | mineral | open | 1 | None found beyond family tags (`:37`) |
| liquid | phase | none | open | 1 | Parent of `solvent` only. Phase proper is the separate `phase` string field (`craft_materials.js:97,134`) |
| solvent | use | liquid | open | 1 | Pool `'solvent'` for the water slot (`craft_content_frontier.js:93`, read at `craft_recipes.js:133`) |
| alkaline | property | none | open | 1 | Reaction catalyst query: `bind-toxin` (`craft_content_frontier.js:57`), evaluated at `craft_resolver.js:129` (`matchesQuery`) |
| wet | property | none | open | 1 | None found. Only on family `reedherb` (`:28`) |
| restorative | derived | none | open | 1 | Written by `tagLaws` (`craft_content_frontier.js:67`) at `craft_resolver.js:168`; read by `projectProduct`, `craft_state.js:74` (display filter) |
| toxic | derived | none | open | 1 | Same as `restorative` (`:67`) |
| bracing | derived | none | open | 1 | Same (`:68`) |
| moonlit | derived | none | **hidden** | 1 | Written by `tagLaws` (`:68`); `craft_state.js:74` drops hidden tags from projections |
| hearth | station | none | open | 1 | Op and reaction station gates: `craft_resolver.js:43,128,144` (op `boil` `:51`, tonic `station:'hearth'` `:96`) |
| mortar | station | none | open | 1 | Op `grind` station (`:53`), same gates |
| sickle | tool | none | open | 1 | Yield gate `tool:'sickle'` (`:76`); validated `craft_sources.js:32`; actor tools expanded `craft_sources.js:145` |
| pick | tool | none | open | 1 | Yield gate (`:84`), same functions |
| spring | season | none | open | 1 | Rare yield gate `season:'spring'` (`:78`); `craft_sources.js:32,146` |
| meadow | place | none | open | 1 | Source `at` query, `craft_sources.js:83-84` (`sourcesAt`-style match on location tags); `reed-patch`, `root-bed` (`:74,79`) |
| riverbank | place | none | open | 1 | Same (`:74,81`) |
| hills | place | none | open | 1 | Same (`:83`) |
| village | place | none | open | 1 | None found. No source uses it in `at`. The runtime gate uses the location string `'Village'` instead (SHOWN `crafting_frontier_runtime.js:67`) |
| village.plant | material | none | open | 1 | Parent of `village.restorative` only (`mixture_rules.js:12`); mapped to Emberseed (`:15`) |
| village.restorative | material | village.plant | open | 1 | Rule selector `{tag:'village.restorative'}` (`mixture_rules.js:18`), matched in `matchRuleModule` (`rule_modules.js:65`) and anchors (`:72-81`) |
| village.fluid | material | none | open | 1 | Mapped to Spring water (`mixture_rules.js:15`); no rule queries it (INFERRED none) |
| village.salt | material | none | open | 1 | Mapped to Mellow salt (`mixture_rules.js:15`); no rule queries it (INFERRED none) |

Tags with no reader found (GR12 candidates): `wet`, `village`, `village.fluid`, `village.salt`.
Parent-only tags with no direct reader: `plant`, `mineral`, `salt`, `ore`, `liquid`, `village.plant`. A
parent-only tag can still be a valid grouping, so these are watch items, not defects (Default: keep;
Dial: a coverage lint marks them `grouping`; Reason: TQ7 notes parents also over-match).

### Live axes (NX1 baseline)

| Axis | Kind | Bounds | Hidden | Reader |
|---|---|---|---|---|
| restore | fraction | 0 to basis (1000) | no | Output `heal` (`craft_content_frontier.js:61`), `boil` converts (`:52`), tagLaw `restorative` |
| vigor | fraction | same | no | Outputs `stamina` (`:62`), reaction `scorch` (`:58`), tagLaw `bracing` |
| toxin | fraction | same | no | Outputs `sicken`, `coat` (`:63-64`), reaction `bind-toxin`, tagLaw `toxic` |
| ash | fraction | same | no | Reaction products (`:57-58`), `boil` converts target. No output or tagLaw reads it |
| hardness | scalar | 0 to 100 | no | **None found.** Family ranges (`:32,35,38`) and a correlation to `glow` (`:38`) only |
| glow | scalar | 0 to 100 | **hidden** | Output `shine` (`:65`), tagLaw `moonlit` |
| matrix | fraction (reserved) | remainder | no | Derived, conserves mass (`craft_materials.js:70,127`) |

## 3. (2) Proposed kinds and axes against live content

Disposition values: **exists** (under another name), **new with reader** (a named reader can be
pointed at today), **wait** (no reader yet, GR12).

### TQ2 kinds

| Proposed kind | Disposition | Evidence and note |
|---|---|---|
| `habitat` | wait | The `place` kind serves source location (`craft_sources.js:83-84`); that is where a source node is, not where a material grows. A habitat reader would be the generator or a discovery route (PG3, PG4), neither found. Default: leave `place`; Dial: split when a discovery route reads habitat; Reason: one kind per reader |
| `condition` | wait | No age axis, no clock input to the resolver (INFERRED from `craft_resolver.js:108-180`; no time parameter). Needs TQ3's age axis first |
| `handling` | wait | No reader. The nearest gate is `station`/`tool` tags (`craft_resolver.js:144`), which are capabilities |
| `hazard` | exists in part | The `toxin` axis plus derived `toxic` (`craft_content_frontier.js:14,22,67`) already carry hazard by mechanism (NX8). A separate `hazard` kind would add a reader only if a handling rule consumes it: wait for that rule |
| `provenance` | exists in part, name collision | Materials already carry `origin:{generator,catalogue,family,scope,index,fallback}` (`craft_materials.js:136-139`), which is generation provenance, not home world. The tag kind named `origin` is live but means botanical or mineral category (`craft_content_frontier.js:20-21`). Rename or document the `origin` kind before adding `provenance`, or two meanings of "origin" sit side by side. Reader for home-world rules: none (crossing law WR10 not built) |
| `appearance` | wait | Projection names by carrier and effects (`craft_state.js:74-76`); there are no look-alike materials to need it (TQ12) |
| `form` | new with reader (small) | Process history exists as `identity.process` on the product (`craft_resolver.js:~170`, SHOWN steps in identity) and `grind` is a live op (`craft_content_frontier.js:53`). No input selector reads a "ground" form yet (`craft_recipes.js:23` selectors are `material, tags, property, all`). First reader would be a recipe slot selecting a processed intermediate (NX4); until one is authored, wait |

### NX1 axes

| Proposed axis | Disposition | Note |
|---|---|---|
| stability (decay rate) | wait | Needs a clock reader (TQ3, NX7); no clock enters the resolver |
| solubility | wait | No op or reaction reads it |
| volatility | wait | Would be read by a heat op; `boil` converts restore to ash by fixed permille (`:52`) |
| density | wait | `mass` is a count times basis (`craft_resolver.js:116`), not an axis |
| flexibility, fibre strength | wait | No smithing or fibre law |
| conductivity | wait | No reader |
| nutrition | wait | Food family (NX14) has no law |
| world-energy affinity | wait | A world dial (WDI); no energy law is in the frontier pack |

Existing `hardness` already has no reader, so adding more axes widens the same gap. Default: add an
axis with its first output, reaction or tagLaw in the same change. Dial: draft axes marked `draft`.
Reason: GR12.

### NX2 role tags (`use` kind)

| Proposed role | Disposition | Note |
|---|---|---|
| solvent | exists | Live `use` tag (`:21`), pool read (`:93`) |
| catalyst | exists under another name | A lot `role` of `catalyst` (`craft_resolver.js:109-113`) and the `alkaline` property query on reactions (`craft_content_frontier.js:57`); role lives on the lot, not the tag |
| binder, reagent, fibre, pigment, fuel, flux, preservative, abrasive | wait | No reader. `fuel` has no station-fuel rule (`hearth` is a presence gate only, `craft_resolver.js:144`) |
| container | exists under another name | `carrier` string on the law (`craft_content_frontier.js:48`, `craft_resolver.js:82`). Not a tag; TQ11 residue would need a container record, not a tag |

## 4. (3) TQ1 thresholds against how derived tags are computed

TQ1 says a derived tag is computed from axis thresholds and the threshold is data with a reason.

| Question | Finding | Evidence |
|---|---|---|
| Is the threshold already data? | Yes. `tagLaws` rows `{tag, axis, min}` | `craft_content_frontier.js:67-68`, validated `craft_resolver.js:75-80` |
| Per world? | Per craft law. A law is `id@revision` over one catalogue, so a world supplies its own law and the same tag id can fire at a different `min` | `craft_resolver.js:29,83` (INFERRED for the world mapping; pack wiring not read) |
| Units | Fractions compare permille of batch mass; scalars compare the mass-weighted mean on the axis range | `craft_resolver.js:168-169` (`Math.floor(amounts*1000/mass) >= min`; `scalars[axis] >= min`) |
| Computed or stored? | **Both.** Computed when a batch resolves, then stored on the product as `product.tags` | `craft_resolver.js:168-177` (tags built, then placed in the frozen product record) |
| Recomputed on read? | No. `projectProduct` filters the stored list by knowledge and visibility; it does not recompute | `craft_state.js:74` |
| In product identity? | No. `tags` is outside the `identity` object, so tags do not change the product id | `craft_resolver.js:171-173` (identity lacks `tags`) |
| Reason field? | None. The row accepts only `tag, axis, min` | `craft_resolver.js:76` |
| Receipt of which threshold fired? | None found. The result carries `trace` for ops and reactions; no tagLaw entry | `craft_resolver.js:177-181` (INFERRED from the visible return value; I did not read the trace-building code) |

Reading: derived tags are stored results of a computed rule. A changed `min` (a law revision) does not
retag products already stored (INFERRED; I did not read product validation). That matches GR3 (freeze
on reveal) and gives TQ1 its per-world thresholds without a new mechanism. What is missing is the reason
and the receipt line.

Default: keep stored derived tags; add `reason` and a fired-threshold line to the resolver trace.
Dial: a law revision may re-derive unseen products only (GR10). Reason: TQ1 asks the receipt to show
which threshold fired.

## 5. (4) Where the tag/axis split is already violated

TQ1 split: degree is an axis, presence is a tag. Findings:

| Finding | Kind of violation | Evidence | Severity |
|---|---|---|---|
| V1 `alkaline` and `wet` are property tags for conditions that have a degree in the world | Degree as presence (borderline) | `craft_content_frontier.js:22,28,34,43`. `alkaline` drives a catalyst query (`:57`) with a fixed `limit` (700), so strength is not read from the material | Low. Defensible while a single catalyst strength suffices; becomes a violation when two alkaline materials should differ |
| V2 Unmeasured equals zero | TQ10 | Every axis is filled with its minimum when a material omits it (`craft_materials.js:126-129`); `toxin` 0 and "not measured" are the same record | Medium for TQ10; no instruments exist yet |
| V3 Two parallel property systems | AR3 | Village mixture keeps its own fractions `restore, vigor, trace, matrix` (`mixture_state.js:60`) while the frontier catalogue has `restore, vigor, toxin, ash, hardness, glow`; Village rules tag inputs separately (`mixture_rules.js:15`) | Medium. Two owners for "what an ingredient is"; both run (INFERRED: `mixture_native.js` and `crafting_frontier_runtime.js` both exist) |
| V4 Presence by location string | Place as string, not tag | The crafting runtime gate checks `context.location==='Village'` (`crafting_frontier_runtime.js:67`) while a `village` place tag exists with no reader | Low |
| V5 Derived tag stored without its degree | Degree dropped | `restorative` etc. store only the tag; the underlying axis amount stays in `composition` (`craft_resolver.js:172-173`), so the degree is still recoverable | None found; noted as compliant |
| V6 `hardness` is an axis with no reader | GR12 | Section 2 axes table | Low until crafted gear exists |
| V7 Kind `origin` names botany | Naming | `craft_content_frontier.js:20-21` versus `craft_materials.js:136` (`origin` object) | Low, but blocks `provenance` naming |

No case of a presence stored as an axis was found. The nearest candidate is `matrix`, which is derived
remainder, not a flag (SHOWN `craft_materials.js:70`).

## 6. (5) Answers to my earlier open questions from L1

| Question | Answer | Evidence |
|---|---|---|
| **Q1** Unit of `input.mass` | The unit string is `fictional-mass`. Each ingredient pack adds 1000 units (`mass = sum(n * 1000)`), fractions must sum to mass, and dose normalizes to a 2000-unit reference vial ("One whole vial is one dose"). The rule layer receives the same number as `input.mass` and reuses it as `2000/base.mass` in the responsive dose. Registry entry for L1: `type:number`, `unit:fictional-mass` (1 pack = 1000), `kind:mechanism`, `source:truth` | SHOWN `mixture_state.js:62-64,70`, `mixture_rules.js:47,51`. The frontier engine's `mass` is `qty * basis` with basis 1000 (SHOWN `craft_resolver.js:116`), the same scale but no unit label |
| **Q2** Owner of the `procedure.process` value list | Today the Village mixture owns it: `resolveMixture` rejects any value outside `['steep','boil']` (`mixture_state.js:56`), `validateProduct` repeats it (`:81`), the hidden method draws between them (`:30`), the availability table keys on `boil` versus otherwise (`:66`), and the witness lists `['steep','boil']` (`mixture_rules.js:29`). L1 section 7 proposed "making domain"; that does not match live code. The frontier brew law has its own op list `steep, boil, grind` (`craft_content_frontier.js:50-53`), validated in `craft_resolver.js:43,144` | SHOWN as cited. Still unknown: which of the two paths Weibao treats as the canonical long-term list, and whether `grind` is meant to join the Village set |

Updated L1 proposal: register `procedure.process` with owner = Village mixture, `enum {steep, boil}`,
revision 1, and add a note that the frontier op list is a second enumeration (flag as V3 family). This
note changes no L1 file; it is a proposal for the next L1 revision.

## 7. (6) Smallest next steps, ranked

All proposals; none is selected build scope (WDI40).

| Rank | Step | Level | Effort | Done check |
|---|---|---|---|---|
| 1 | Reader coverage report over both live registries and the axis table (data in, markdown out, no runtime change) | Balanced | Small, one script plus snapshot | Report lists exactly `wet`, `village`, `village.fluid`, `village.salt`, `hardness` as unread and the parent-only set, matching sections 2 and 5; `npm run check:rules` unchanged |
| 2 | Add `reason` to `tagLaws` rows and a fired-threshold line to the resolver trace | Balanced | Small, `craft_resolver.js` plus tests | Golden batch trace names each fired tagLaw with measured permille versus `min`; product ids unchanged (tags are outside identity, `craft_resolver.js:171`); seed sweep and save/reload/import pass |
| 3 | Decide and record the single owner of the `procedure.process` list and whether the two op lists (`mixture_state.js:56`, `craft_content_frontier.js:50`) stay separate | Strong | Doc decision, then a small enum change | One enum referenced by the registry; the other list marked adapter or merged; Village goldens unchanged |
| 4 | Resolve the `origin` kind collision before any `provenance` tag: rename the botanical kind (revision bump per tag) or document both meanings | Balanced | Small data change, revision bump on 6 tags | No tag with the old kind remains; `TagStore.deserialize` shows `revision-mismatch` diagnostics only for old saves (SHOWN behavior, `tag_store.js:228-232`) |
| 5 | Add one axis only with its first reader, starting with an age/stability axis paired with the TQ3 clock decision, after the first four land | Strong | Medium | The axis has an output, reaction or tagLaw; GR16 tests cover it; the coverage report from step 1 shows no new unread cell |

## 8. (7) What I did not check

- Whether any command or test passes; no code was run, only read.
- Item tag maps (`items.js` boolean `tags`, accepted by `tag_store.js:23`) and `tag:effect` style keys
  (`crafting_frontier_runtime.js:39,47`); these are a third tag-like system and are not inventoried.
- `src/world_completion_materials_*`, `src/craft_product_registry.js`, `src/crafting_domain.js`,
  `src/harvest.js` and `src/craft_sources.js` beyond the lines cited. Place-tag suppliers
  (`locationTags` into `craft_sources.js:83`) were not traced, so the `village` and place readers are
  inferred from the source table.
- How the trace is built in `craft_resolver.js` and how stored products validate against a changed law.
- `src/data/*` content tables for any tag-shaped data outside `TagRegistry`.
- E4 and E4B were read at heading level plus the sections cited; E4's tag definition shape
  (`family`, `stacking`, `decay`, `cancels`) is a design draft that differs from live `tag_store.js:38`,
  and I did not reconcile the two.
- Whether `crafting_frontier_runtime.js` and `mixture_native.js` are both reachable in the shipped
  bundle.
- RULES_INDEX router rows for this topic and the Round 6 UV and PG sections.

## 9. Open questions

1. What is the canonical op list long term, given the Village `steep, boil` and the frontier `steep, boil, grind` (Q2 above)?
2. Which kind name should change to free `origin` or `provenance` (step 4)?
3. How often should the unread-tag report run (step 1)?
