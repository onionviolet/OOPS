# Modding Tree implementation packets (PROPOSALS, not accepted, not implemented)

Each packet needs its own rebuild, a fresh-origin desktop browser check, and Save/reload/Import proof before anyone calls it done. Codes refer to [REPORT.md](REPORT.md).

## P1: Conditional retain on transitions (F1, F2, F3)

- **Smallest result:** a transition declares `retainWhen:[{domain:"techniques", when:<predicate>, label}]`. The preview resolves each rule against current facts and shows "kept because: <label>" lines. Commit freezes the resolved set and removes those domains from `reset`. One world uses it: a renewal that wipes techniques unless an earned record exists.
- **Seams:** `src/simulation_contracts.js` L190-L194 (validator: domain must also appear in `reset`; predicate through `validatePredicate`); `src/simulation.js` L553-L603 (preview adds `kept`; commit filters `d.reset`); the receipt in `s.transitions` gains `kept`.
- **Acceptance:** preview and commit agree; a stale sequence is still rejected; the receipt round-trips through Save/reload/Import.
- **Save compatibility:** definitions-only change plus one optional receipt field.

## P2: Order cost between sibling paths (F5)

- **Smallest result:** two sibling paths or starts in one world. Opening either first adds 1 to a fact on the other, and the other's requirement or cost scales with that fact. Never locked.
- **Seams:** existing predicates and `{fact, scale, add, min, max}` output expressions (check whether costs accept them; if not, add one expression slot in `simulation_contracts.js`). Content in a world content file.
- **Acceptance:** both orders reach both paths; the second costs more; the preview shows why.
- **Tradeoff:** tune per world; a world adjective, not a global rule.

## P3: Mastery re-run (F6)

- **Smallest result:** a `replay` transition into an isolated run. Only declared sources stay active; the rest are suppressed using the existing dormant/suppressed faculty state. A goal predicate completes it, granting a mastery record that switches that path's practice band to an authored "mastered" band.
- **Seams:** `src/simulation.js` transitions; `power_models.js` practice bands; faculty suppression.
- **Open question:** restoring pre-run state needs the "explicit isolated snapshot" the commit comment already names.
- **Acceptance:** the run restricts correctly; success changes the function, not just numbers; failure or exit restores state; persistence round-trips.

## P4: Trial runs with goals and repeat completions (F7)

- **Smallest result:** enter a trial that applies declared restricting conditions. A goal predicate gives completion count +1, up to a per-world limit with no "once" cap. Exit removes the conditions. Reward scales with the count.
- **Seams:** conditions plus a `replay` transition; completions in actor facts.
- **Acceptance:** entering, exiting, completing and bulk completions all persist.
- **Overlap:** shares the snapshot need with P3; build P3 first.

## P5: Visible catch-up bank (F12)

- **Smallest result:** away time becomes a banked pool with a per-world cap. The UI shows the pool and drains it through the existing bounded advancement (512-boundary budget). The player can pause the drain.
- **Seams:** the host that calls `advanceSimulation`; Groundhog Life time-banking notes.
- **Acceptance:** drain totals equal the banked minutes; reload mid-drain keeps the pool.
- **Unchecked:** YAIR's current away-time host behavior; check it first.
