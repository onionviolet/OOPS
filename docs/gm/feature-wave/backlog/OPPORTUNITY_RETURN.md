# Opportunity and ecology worker return

2026-10-05. Writer `/root/opportunity_proofs`; exclusive writes are `src/backlog_expansion_opportunities.js` and this return. Source released to the backlog root. Both finite original proposals are implemented-unverified. No private saves, native owners, source banks, shared runtime, dependencies or generated bundles were edited.

## Callable exports and activation

`opportunityCommands`, `stageOpportunityCommand(plan, command, context)`, `opportunityView(state, context)` and `validateOpportunityRecord(state.backlog, state)` implement the frozen worker interface. Additional exports are `opportunityDefinitions`, `OPPORTUNITY_IDS` and `OPPORTUNITY_ITEMS`. The command rows use families `fate` and `ecology`; no target packet or extra input is required. The view returns `{title, description, records}` and never provisions or changes stock.

Root must compose the new person and sites into its simulation definitions and dispatch exact command IDs through its existing staged host. `backlog.reed_keeper` is revision1, `provision:false`, original Rill in native Village/base.frontier with simulation inventory. The two revision1 sites are `backlog.packing_bench` and `backlog.reed_bed`. Generic simulation enrollment may precreate empty site capacity; explicit first meeting supplies the actual owner. Existing characters remain untouched. A first deliberate fate offer or ecology agreement introduces Rill once, with one owned rope, one owned kit, three root divisions, zero standing shoots and a six-coin supply purse. The other family then reuses that same actual person and stock.

## Actual opportunity and custody

`backlog.fate_offer` creates one unique `simulation.claims['backlog.fate.packing_slot']`, held by Rill, and one offered record. Rill's actual actor fact `backlog.fate.willing` is explicit authored consent; the recipient's accepting command records reciprocal consent.

`backlog.fate_transfer` changes that same claim's owner to player, debits Rill's rope, credits the actual native player inventory and creates the canonical custody row `backlog.fate.rope` with `{owner, holder, key, count, at, cause}`. The entitlement is never copied. Exclusive bench redemption requires the actual player-held claim, present living donor, free owned site and exact loan. It consumes one native log, returns the loan without a new acquisition, transfers Rill's actual one-kit stock to player, and settles the claim once. Returning unused instead returns the rope and closes the entitlement without reward. Offered, transferred and settled receipts preserve their distinct meanings and sequence order.

## Actual finite ecology

`backlog.ecology_join` preserves `simulation.sites['backlog.reed_bed'].owner = 'backlog.reed_keeper'` and grants the separate held `backlog.ecology.harvest_rights` claim to player with mutual consent. Plant, harvest, supply and close all require those actual rights and owner, local presence, consent and free site.

The managed herb edge is part of the reed-bed habitat. One renewal consumes one native log and one actual keeper root division; two physical growing shoots occupy keeper resources. A saved crop cursor records the planting receipt and `readyAt = state.clock + 10`. Harvest checks the common played clock, removes those same shoots and credits two native Cooking herbs once. A further planting cannot overlap or erase the old crop. Three root divisions bound the agreement to three harvests. Each harvest opens one order; supply transfers two actual native herbs to Rill and pays two native coins from Rill's finite purse. Closing after all three orders settles the rights and preserves Rill's six supplied herbs, player wages and remembered consequences.

Actual resource keys are `backlog.ecology.root_divisions`, `backlog.ecology.standing_shoots` and `backlog.ecology.supply_coins` on `state.actors['backlog.reed_keeper'].resources`. The record is a finite clock/history cursor, not another inventory or scheduler. No new timer, controller, offline callback or absence loss exists. Rendering a mature crop changes nothing; harvesting is the sole stock/output commitment. Explicit supported catch-up that advances the shared played clock may mature the crop, while unclaimed wall-clock time cannot.

## Native, persistence and host joins

| Owner / join | Exact demand |
|---|---|
| Native stock | `context.gameplay.player.inventory`; native keys are `{"id":"Rough wood log"}`, `{"id":"Survey rope"}`, `{"id":"Prepared survey kit"}`, `{"id":"Cooking herbs"}`. Logs are consumed; rope is loaned/returned; kit and herbs are actual bag output; supplied herbs debit the bag. Existing `items.js` and `data/expedition_items.js` own all templates. |
| Native coins / acquisitions | `context.external.money`, published from the returned plan. All positive stock goes through the common core's acquisition staging. Existing native item-log publication receives player acquisitions; returning the rope uses `{acquisition:false}`. |
| Actual simulation | Existing actors/people/owners, canonical custody, unique claims, owned sites, per-player knowledge and bounded log. No second person/property/rights authority. |
| Persistence | Optional `state.backlog.fate` and `.ecology`, each revision1, inside root backlog schema1 and the existing envelope. Missing records stay missing. Updated validator is required for opt-in saves; expansion5 and simulation1–4 retain their meanings. Native inventory presence is checked at command time; the unified envelope/native publisher must preserve it together with custody. |
| Sequence / publication | Worker stamps `state.sequence + 1`; root increments exactly once after successful stage, then calls this validator and existing expansion/native validators before one durable publication. Failed plans remain unpublished. |
| Other backlog proofs | Root must apply the actual body/possession and time/escrow seals before every opportunity command. Parent explicitly owns this central join. A live loop, armed/paused catch-up escrow or possessed body must not start this stock work. |

The validator checks exact identities, first/transfer/settlement claim causes, loan identity, donor rope/kit conservation, finite resource bounds, distinct ordered supply receipts, actual rights and site ownership, mature harvest timestamps, bounded history and closed-agreement completeness. No field/default/load grant substitutes for native publication.

## Checks and remaining acceptance

Performed source review, `node --check`, clean module import and static `createSimulationRegistry(opportunityDefinitions)` registration. The registry admitted one person and two sites. Native item aliases were checked against template declarations, the `setup_ids` key assignment and `getItemFromKey`. A direct combined native-template import hit the existing standalone ESM initialization cycle `Cannot access 'bonus_levels' before initialization`; no shared workaround was attempted. Root's actual composed build must verify that native join in its normal entry order.

Deferred: native visible transfer/redemption/return, all three paid renewal/harvest/supply rounds, no repeated grant, immature/stale/missing-stock/withdrawn-consent blockers, custody with existing same-key player stock, possession/loop/escrow seal behavior, save/reload/import/failure, keyboard, regression and director fiction/balance/pacing review. No new behavior or save test was run, and earlier evidence is not proof of this source.

Source SHA-256 at release: `e3dcdf6c02938241aa4bbaa8dfa7770f72560557ab9cc4770f49318ceb5933ac`. Read input snapshots: core `1bce1c5cc6b4a45dff00d47bd1920491b0102e584994be828b9b7033d14e0450`; Features interface `764b12915648619a84cc86f6907806b340190f42a9549ca1bde20021f2fd472d`. Shared files may continue changing under their owning writers; these are inspected snapshots, not final integration claims.
