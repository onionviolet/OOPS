# ITR-P2 ordinary Village frame

Status: **implemented-unverified**, source ready for parent integration. Worker `/root/clamping_frame`; parent `/root`, chat `01a10fe7-c3cd-79a2-86d0-2eba1fcfcefd`. Only `src/audited_workshop_fixture.js` and this worker directory were written. Shared registry, context, projection, routing, validator and build remain root-owned.

The optional frame uses Eda's existing `feature_objects.fitting_bench` in **Village**. Moving the audit's example Shack fixture to that supported existing site is an original reversible prototype choice, not a claim of new native Shack access. Names, costs, permission wording and balance remain proposals. ITR-02 supplies the general paid-stock-to-functional-infrastructure inspiration; no reference code, source prose, currency scale, artwork or monument tree was copied.

## Commands and costs

| Revision1 command | Actual commitment and result |
|---|---|
| `audit_fixture.enroll` | Free, optional, exact once after firsthand joint inspection. Present willing Eda grants this particular bench right and understood ordinary joining terms. Creates no item or material. |
| `audit_fixture.build` | Reserve two Rough wood logs, one owned **Survey rope**, three native coins, two player stamina, Eda's participation and five played minutes at her existing bench. Completion consumes wood/rope into one stationary world fixture and pays three coins into Eda's actual purse. |
| `audit_fixture.bind_kits` | Independent repeatable bench job, with retained site right and usable player hands. Reserve one Tree sap, two Sound repair staves, two stamina and six played minutes; produce exactly two existing Prepared survey kits. Eda's continuing presence, a cooling source, a sleeve and a power are unnecessary. |

Both timed jobs use the existing refundable job/site/vital/inventory owners and recheck completion support. An unavailable body, construction participant, consent or site right produces a refund rather than a fixture/payment/output. Materials must be owned and unequipped under existing custody guards. No new item ID, inventory, timer, persisted context, reward owner, schema or publisher exists here.

The existing ordinary knife kit route is four minutes. Current sleeve resin-setting and resin-kit commands are three minutes each, six minutes combined. The specified frame batch is therefore equal in total duration to that two-job sleeve sequence; a claim that the full sleeve sequence is faster would be inaccurate. Existing routes retain their exact behavior.

## Native material evidence

- `Surveyor rope` is absent. The real `Survey rope` is registered in `src/data/expedition_items.js:16`, sold in ordinary Basic trader stock in `src/data/inventory_templates.js:37`, and obtainable from the existing `frontier.rope` journal service in `src/expedition_content.js:77` while its original prerequisites hold. The frame consumes this rope, so the player's ordinary reusable anchor line is a competing use.
- Rough wood logs and Tree sap retain the native items in `src/items.js:1748` and `src/items.js:1805`; current woodcutting resources in `src/data/locations.js:1898` provide both under the original gathering prerequisites and chance.
- Sound repair staves retain Eda's finite paid stock and the existing log-cut / wet-stave-dry transformations in `featureObjectDefinitions`; enrollment creates none. Prepared survey kits retain the existing native registration and field, trade, crossing and finite Eda-order consumers.

## Exact integration exports

`AUDITED_FIXTURE_IDS`: `world`, `eda`, `site`, `situation`, `group`, `commandType`, `enroll`, `build`, `kits`.

`AUDITED_FIXTURE_KEYS`: exact existing native keys `log`, `rope`, `sap`, `sound`, `kit`.

`auditedFixtureDefinitions`: `{commands: [...]}` with the three commands above, all revision1 and group `audit_fixture`.

`auditedFixtureFacts(state, context = {})`: pure, no simulation executor import and no mutation. Returns `audit.fixture.sitePresent`, `.enrolled`, `.siteAccess`, `.built`, `.kitsMade`. The last value is two times actual completed batch count, never a resource credit.

`validateAuditedFixture(state, registry)`: structural optional-state/receipt validation. Exact-once flags, current revision1 definitions, matching player/Eda enrollment and construction receipts, retained real bench/stock/purse, chronological paid-job bounds and exact frozen costs/effects/participants/site/refund/completion support are checked. Legitimately spent or traded output is not reconstructed into bag stock. Validation creates nothing.

Required root bindings:

1. Merge these command definitions into the existing simulation registry and show them through the Notebook's existing action projection using command type `audit_workshop`; generic simulation preview/commit/cancel remain owners.
2. Supply freshly computed `reference.workshop.supported`, `.handsUsable`, `.edaPresent` at admission and queued settlement. Recompute pure fixture facts there; no frozen external eligibility snapshot.
3. Add `audit_fixture` to existing schema4 `reservationReturns1` groups and invoke `validateAuditedFixture` from the expansion owner. Completion support already uses the existing refund policy.
4. Rebuild root's shared source and record the integrated build; later gameplay acceptance remains deferred.

Integration qualification at release: root confirmed its shared commit gate now requires `referenceGameplay1` for the fixture and reserves the cooling-workshop meeting receipt prerequisite for `audit_lesson`. Frame preview and commitment therefore use the same own-terms/current-bench/body prerequisites. Root also reports a successful cold canonical import of 735 commands / 26 controllers / eight worlds / four plans; that is parent-reported integration evidence, not a gameplay check by this worker.

## Save compatibility and retention

Optional actor facts: `audit_fixture.enrolled = true`, `audit_fixture.termsRevision = 1`, `audit_fixture.access = feature_objects.fitting_bench`. Optional base-world facts, only after construction: `audit_fixture.frame = feature_objects.fitting_bench`, `audit_fixture.builder = player`. Existing completed-command counts and attributed knowledge carry receipts; no extra save namespace is added. Absent keys are inert. Actual first use requires the existing optional expansion9/10, referenceGameplay1 and simulation4 readers with these exact revision1 command definitions; older readers may reject optional new pending commands safely while preserving the original save.

The current one field renewal retains general facts/completions/knowledge/site/stock and resets only its named field mastery/energy owners. This fixture/right therefore follows that existing retention rule; no reset code or new prestige was added. Save/reload and renewal behavior have not been exercised.

## Permitted checks

`node --check src/audited_workshop_fixture.js`: pass, final source.

Direct ESM import: pass after the sibling lesson file existed; five expected exports and three exact revision1 command IDs appeared. One earlier import attempt was temporarily blocked by the concurrently unfinished `src/audited_workshop_lesson.js` dependency, without an owned-source error.

Static `createSimulationRegistry` link check using `featureObjectDefinitions` plus fixture commands: pass, 39 total commands / three fixture commands / the existing Eda dry fitting bench. This instantiated descriptors only; no gameplay state, jobs, browser or saves were exercised. Hashes and final commands are recorded in `CHECKPOINT.json`.

Unit, gameplay, browser, generated-save/reload/import/failure, keyboard, regression and director acceptance are deferred, not passed. The later backlog is in `ACCEPTANCE_BACKLOG.md`. No user save, source library, shared generated bundle, commit, push, publication, dependency or automation was touched.
