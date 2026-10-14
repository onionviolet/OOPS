# Path of the Idle Cultivator: three deeper systems

Chosen for payoff and gaps in prior coverage. Static findings and original proposals remain separate.

## D1 Dialogue presenters and city routing

Sources: A01; readable.js L187025-187070,L211389-211450,L284360-284575.

Shown: The linear presenter closes before invoking onFinish; onClose may also run as part of closing. A tree choice can cancel via false, override goto via a returned string, or close via null/unknown target. Disabled state is checked in the handler as well as rendered on the button. Generic city topics return to start; a quest-ready scribe switches to a separate interaction. This gives repeatable texture and exceptional useful conversations in the same presentation seam. Not every callback is transactional or persisted.

PROPOSAL: Add a candidate lint for unknown nodes, stable line IDs and a commit receipt. Do not infer rewards from flavor.

Boundary: All city-role prose and callback snippets are in the private readable snapshot. No relationship graph claimed.

## D2 Migration identity and backend recovery

Sources: A04; readable.js L79272-79317,L80578-80610,L80810-80960.

Shown: The migration runner maps legacy localized identifiers into stable fallback names, skips recorded oneTime entries, records successful calls and continues after caught errors. Serializer converts selected big numbers and deliberately clears breeding action state. Native load tries candidate slots, then legacy backends; successful migration writes/verifies active state before legacy cleanup. Web load migrates localStorage into IndexedDB. These are different backend flows.

PROPOSAL: Use nonlocalized version/ID keys and detached validation. A continued migration after an error needs explicit policy.

Boundary: Codec internals, every migration body and import rollback remain unread; no backend exercised.

## D3 Narrative texture versus mechanical knowledge

Sources: A01/A02; readable.js L211389-211450,L187025-187070; prior quest digest.

Shown: Generic city topics substitute a place name but do not themselves mutate a knowledge ledger in the traced factory. Saint completion explicitly changes ascension state and quest completion checks. A repeated topic is therefore not equivalent to a granted power or true world fact. The same presenter can support both, but the consumers decide the meaning.

PROPOSAL: Attach heard-source receipts to useful claims, retain optional rereading, and separate text completion from paid commitments.

Boundary: Full city/story event graph is partial; no secret YAIR truth designed.
