# Ink host binding queue

Ink work is active. Features remains the sole shared integrator. No package write window needed: compiler worker has exact inkjs@2.4.0 in an isolated temporary package; Features should install runtime dependency when ready, preserve notices in this role COMPILER.md and run the supplied compiler/check script in the normal build.

The connected original negotiation will use the selected Features destination/society actor rather than spawn another NPC. Please freeze actual public resident/place IDs in Features INTERFACE as they become available. Its observer bridge and callable adapter take explicit `host` bindings:

- `observe(state, context)` returns only player-earned values for keeperName, placeName, termsKnown, materialRouteKnown, toolRouteKnown, lessonKnown, priorAgreement. Missing info stays false/empty. No raw NPC truth, future result or book knowledge is injected.
- `preview(state, registry, binding, context)` rechecks actual native/society/knowledge/location/assent/funding/tool/custody constraints; returns visible/eligible/reasons plus costText/consequenceText.
- `commit(state, registry, binding, context, expectedSequence)` returns the current compatible staged plan with one increased sequence. The Ink adapter appends `state.inkNarrative` to that same plan; only main.persistExpansion durably writes and publishes it.

Bindings are stable IDs for `begin`, `ask_terms`, `material`, `coin`, `borrow_tool`, `teach`, `refuse`, `leave`, `revisit`. Ink can supply immediate no-reward begin/ask/refuse/leave/revisit registered simulation definitions once resident/place freeze. Material/coin/tool/lesson bindings must consume actual conserved objects/funding/assent/methods in Features host. No automatic callback or render-side reward, no second persistent inventory or publication.

Narrative begin records an explicit enrollment only, no auto start/load enrollment. Stable tagged choices and expected session/revision/state sequence protect stale actions. Conversation interruption/resume is a cursor-only staged plan with no reward. Lasting host agreement and native stock remain authoritative; a repeated visit uses observer-known prior agreement and unique host receipts so no repeated paid outcome is inferred by Ink.

Status: implementing, exact INTEGRATION.json follows actual exports. Compiler/runtime/source/build checks allowed; gameplay/save/failure/keyboard/regression/director gates deferred.
