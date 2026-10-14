# Procgen wave 1 integration backlog

Integration gates (merge, tests, rebuild, combined browser proof, old-save import) pass. These remain open; slice backlogs (p1-p4 BACKLOG.md) still own their own items.

| Code | Status | Item |
|---|---|---|
| B1 | OPEN, deliberate | P3 deck RNG stays a per-deck xorshift cursor in `simulation.decks` seeded by `deriveSimulationSeed`. Moving it onto P1 stream cells needs a saved-deck migration and touches the pure simulation planner copy path, so it is not a straightforward unify. Behavior already saves cursor + receipts and passed reload/branch replay. |
| B2 | OPEN | P2 mixture family generation and P4 traveler draws still use their local FNV/xorshift helpers internally; only their one-time seed now comes from the P1 stream root (`streamSeed`, pure, no receipt). P1 cheat/receipt seams do not see those draws. |
| B3 | IMPLEMENTED_UNVERIFIED in browser | Combined old saves that already hold a P2 owner or P4 store keep their saved seed and truth (source reasoning: owners exist, seed provider unused). No such pre-integration fixture was imported. |
| B4 | IMPLEMENTED_UNVERIFIED | P3 casting of P4 generated travelers (P3 still uses fixed contact Sela). Not part of wave 1. |
| B5 | Human acceptance | Combined Village density (mixing counter, travelers, storylets, merchant) at 1366x768 is technically usable; feel and layout are not director-accepted. Mobile deferred. |
| B6 | Carried | Slice backlogs: P1 B1-B4, P2 B2-B5, P3 B1-B4, P4 open items are unchanged by integration. |
