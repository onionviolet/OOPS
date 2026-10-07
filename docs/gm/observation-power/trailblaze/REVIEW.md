# Detached boundary source review

2026-10-04. Reviewer `/root/boundary_review`; parent `/root` owns both source modules. Read-only source reasoning against the current parent revision. No test/case, import, syntax, build, browser, save or failure execution. New implementation remains unverified.

Reviewed fingerprints: `realm_boundary_rules.js` SHA256 `00838aa7144f13ec6b019256824f2aa03cd512911ee5018d5b650a472bb996aa`; `realm_connections.js` SHA256 `a8999f87300bf200e50bbc709123f03b12eb2797684b836c043a0df572742f42`. Line references below belong to these snapshots, after the parent's sensory/body-channel and manual-closure additions.

## Material findings

1. **P1: Opening loses required source/exception debits.** `planRealmOpening`, `src/realm_connections.js:170-173`, evaluates actual boundary support but quotes only `connection.openingCosts`. `support.costs` is discarded, so an exception requiring fuel can open/reopen the route with no matching reserve and no debit in the plan. Combine the actual support costs with opening costs before quoting, or declare and validate a separate opening support contract rather than evaluating a paid operation while dropping its price.

2. **P2: Malformed optional policy fields become permissive defaults.** `validateRealmBoundaryRule`, `src/realm_boundary_rules.js:46-56`, skips `bodyForms: false` and accepts `costs: false` through `rule.costs || []`; evaluation at lines107-113 then treats them as no body restriction/no cost. The same truthy checks admit false exception policy fields. Validate every present non-null optional field against its declared type and use nullish defaults, so malformed JSON cannot remove a restriction or payment.

3. **P2: A known source expiry can precede an admitted action's resolution.** `supportedSource`, `src/realm_boundary_rules.js:92`, checks expiry only at `context.clock`. `previewRealmPassage`, `src/realm_connections.js:130-146`, checks route/contact lifetime through `clock + duration` but omits the selected source's expiry across that same interval. A source expiring before arrival still yields `allowed: true` and effects after expiry, even though the emitted resolution guard requires support again. Reject known insufficient support duration during planning, while retaining the guard for unexpected interruption.

4. **P2: Present-time access admits a route whose opening is still in the future.** `validateRealmConnection`, `src/realm_connections.js:16-18`, accepts a future natural `openedAt`; `previewRealmPassage:104-106` checks open/expiry without comparing opening time to the supplied current clock. Consequently an otherwise valid present route is usable before its declared opening. Reject context-relative future connection receipts in plans, and apply the same chronological policy when deriving views/closure/reopening state.

5. **P2: Remembering a route leaks current hidden state.** `realmConnectionView`, `src/realm_connections.js:207-210`, returns the authoritative revision and live open/expired state merely because its ID is remembered; it requires neither current local access nor a current attributed status observation. `realmBoundaryView`, `src/realm_boundary_rules.js:136-139`, similarly exposes live rule revision. Someone elsewhere can learn a hidden closure/reopening or rule change through old knowledge alone. Return evidence-backed known status/revision, or require an explicit current visibility receipt before publishing live state.

## Unsupported integration boundaries

These records do not register gameplay or publish durable effects. The host still must bind actual body ownership/location, complete native cargo and unique stock, resource authorization, anchor/destination/position revisions and shared presence identity; reserve costs once; enforce sequence/revision/replay and commit/resolution guards; settle closure/expiry/reopening against active channels; and publish qualified knowledge only after successful causal effects. The public view and private plan/reason surfaces need separate adapters so hidden source/anchor/authority information is not rendered from planning diagnostics. Historical causation, autonomous emergence, unrelated manifestation body forms and independent native-world isolation remain unsupported. No cross-import or change to world/traveler lanes is proposed.

Source inspection found no direct cloning of native cargo/body/resource state: passage refers to existing cargo owners, view keeps the body at its origin, and shared presences retain one actor/resource owner. Those declarations still require the host bindings above. Preserve test deferral, private saves and configured default settings.

## Focused repair review

2026-10-04. Re-read both live modules after the parent repairs. Snapshot SHA256: `realm_boundary_rules.js` `a373370f6d50806fa8eaeb977dfba63f421f219d5ecdfaef06f66dc9b2ec0a2a`; `realm_connections.js` `14e7fa5adb5a5d16ef97b71f16603a8e612cd6b289d84710f34c2b21c52ef47b`. This is source reasoning only; no cases, imports, syntax, build, browser/save/failure or test suites executed by this reviewer. Parent reports quick syntax/import success separately.

All five original findings are addressed in this snapshot: opening aggregates `support.costs` and explicit route-cost bypass at `realm_connections.js:178`; non-null body/cost policy values are validated at `realm_boundary_rules.js:51-61`; passage rejects source expiry through its completion time at `realm_connections.js:134-135`; all three plans share future opening/closure rejection at `realm_connections.js:59`; public views use recipient-filtered evidence snapshots and observation times at `realm_boundary_rules.js:147-149` and `realm_connections.js:216-218`. Dense-array, symbol and getter checks are present in `validateRealmJson:14-17`. These repairs have not been exercised.

**Remaining P2: the connection creator clones before validating original JSON.** `createRealmConnection`, `src/realm_connections.js:34-36`, calls `structuredClone(definition)` before `validateRealmConnection` reaches the JSON validator. Cloning can evaluate and flatten enumerable getters and omit symbol properties, so the new no-getter/no-symbol checks see only the sanitized clone rather than rejecting the original non-JSON definition. This also breaks the creator's pure-data/no-callback contract before rejection is possible. Call `validateRealmJson(definition)` before cloning, then retain full connection validation of the merged record. No case execution was used to establish this source-order defect.

The previously named host/integration boundaries and deferred verification remain unchanged. Parent remains the only source writer; reviewer owns only this review file and stops here.

## Final source-order repair check

2026-10-04. Inspected only `createRealmConnection`, `realm_connections.js:34-38`, plus final source fingerprints. The creator now calls `validateRealmJson(definition)` and rejects non-record/array definitions before `copy(definition)` invokes cloning. The remaining P2 above is addressed by source inspection. No remaining concrete defect from this bounded review is open; this does not establish execution or integration correctness.

Final SHA256: `realm_boundary_rules.js` `a373370f6d50806fa8eaeb977dfba63f421f219d5ecdfaef06f66dc9b2ec0a2a`; `realm_connections.js` `b837cd4c0437f717c41c30d9638d08808d836f691cb57ba07ddb4b4fd5871fed`. No broad rescan, tests/cases, imports, syntax, build, browser/save/failure execution or source edits by this reviewer. Deferred proof and host integration boundaries remain open. Review complete; stopping.
