# Top three deeper systems

Ranked for payoff at the inspected source seams. PROPOSALS only. All paths, revisions and function locators are in ASPECTS.md; the private hash census pins source bytes. Other inventoried modules remain identified or prior-documented, not newly audited.

## DS1 Persistence registration and recovery

Profectus persistent refs carry defaults, current state, stack traces and save-data paths; non-persistent wrappers let consumers share a value without inserting it twice. NaN handling records the failing path and disables autosave. save compresses the player JSON under an ID; load reconstructs layers and invokes version repair. Error fallback creates a new save rather than presenting an exact restored state. TMT uses simpler default merges and Decimal repair. YAIRPG should preserve a bad candidate for diagnosis, retain last-good progress and make any recovery explicit. Source review is not a successful malformed-save test.

## DS2 Offline simulation versus visual time

Profectus captures real diff first, consumes a fraction of the offline bank, caps the effective tick, applies speed and emits both diff and trueDiff. Layer phases then run in order. Comments call these milliseconds while calculation divides by 1000. Load adds the old bank twice in the inspected expression, and bank consumption precedes tick-length cap; these are static accounting concerns, not reproduced bugs. An exact ledger should distinguish granted, consumed, simulated and pending time. Visual feedback should use real time rather than explode under catch-up.

## DS3 Board interaction state

setupDraggableNode keeps transient dragged node, delta and receiving target; coordinates are transformed through pan/zoom. The nearest target within radius receives onDrop, otherwise free placement snaps to a 25-unit grid. makeDraggable owns persistent position while computedPosition adds transient delta. A 10-unit movement threshold distinguishes a drag from click handling. setupActions lays out arbitrary renderables radially; placeInAvailableSpace shifts nodes to avoid overlap. These are UI mechanics only. No domain transfer, legality check or transaction is built into onDrop. A YAIRPG board must call the existing validated action owner and offer equivalent readable direct controls.
