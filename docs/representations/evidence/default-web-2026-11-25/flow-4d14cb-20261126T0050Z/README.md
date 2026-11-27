# Default web desktop flow, reviewed 4d14cb build

Agent-verified, not human-reviewed. Coordinator requested the existing normal desktop flow gate after the native default rebuild, including the late Fang source. AD36; UR139–UR143, UR33 and PS195. This evidence directory is new; earlier `final`, `reviewed` and `integrated` artifacts were not overwritten. No runtime or existing harness edits, default rebuild, full npm suite, private save access or release action ran in this lane.

## Command and result

The [observation wrapper](run.mjs) executed unchanged `node scripts/check_flow.mjs --json docs/representations/evidence/default-web-2026-11-25/flow-4d14cb-20261126T0050Z/flow.json`, with progress logging enabled. Started 2026-11-26 00:50:54 UTC and finished 00:58:48 UTC, still November 25 in Chicago. Child PID 87636. Exit 0.

[Flow JSON](flow.json), SHA256 `554c48393b3874e3fc982df17d8d718f44185173f53f453a13af9b9cf523447a`, records 16 routes at 1920×1080, 125% and 150% zoom, four of four additional states and zero findings. Routes reviewed: Stats, Condition, Inventory, Journal, Data, Knows, Notebook, People, Travelers, Projects, Ledger, Organizations, Beginning, Capability runs, Connection and Settings. Extra states: early life; day 4 returned after ten wall-clock days; a rainy day with two hours of exposure; and a fight in the Infested field. The earlier combat setup timeout did not recur here; this result does not identify the cause of that earlier failure.

The two unchanged PS195 baseline strays are `panel #shell_inspector` and `action summary "Calculation and sources"`. Both are printed in [the log](run.log) and retained in the JSON. No new exception or lower baseline was written. The runner's `KNOWN` findings list and `KNOWN_WAYS` list are empty; there is no other-lane finding waiver in this run.

## Input identity and scope

The default bundle before and after the run, and the runner's separately built WORKTREE bundle, all have SHA256 `4d14cb3c865682abdd1428d9ddd37b627cb0f2ace8db85f055009f1c78ced84c`. The wrapper observed the copied tree after preparation and its completed build before the runner removed it. [Input identity](input-identity.json) captures file hashes, HEAD, Node version, harness hashes and start/end checks.

All 2455 copied input files match the checkout at launch; copied and post-build input hashes both equal `2a2e6bc882fb4e61e02a85b9ec7fcfac75a3d7b5e4ba275afb53139f06a954d0`. No captured checkout input or harness file changed during the run. The six late Fang files are present and individually SHA-equal: `src/ri_granary_work.js`, `src/world_packs/book_gu_lead_granary_work.js`, `src/ri_lead_day_facts.js`, `src/ri_daily_powers.js`, `src/world_packs/book_gu_lead_day.js` and `src/structured_pack_definitions.js`. No Fang source mismatch or runtime fix was required by this flow result.

The existing runner intentionally supplies an empty private-pack manifest, starts the mid-life Village fixture for its route walk and constructs the additional states through its existing test clock. It does not exercise the separate native Harry/Klein/Fang journeys or prove natural protagonist entry. The root-side inventory also hashes 18 ignored private font files that `prepareTree` does not copy; these are the complete root-only input difference. Exact JavaScript bundle parity therefore does not assert coverage of an additional installed private-font configuration. The wrapper is a one-run observer in this fresh directory; preserve these receipts rather than rerunning it over this output.

## Cleanup

The normal runner removed its temporary staged build. Its four owned Chrome instances reported termination with Windows-locked private profiles. A containment-checked removal request for these exact profiles was rejected by automatic approval review as “blocked by policy”; no alternate deletion route was attempted. [Cleanup record](cleanup.json) records the four retained names: `yairpg-owned-chrome-u2XAYt`, `yairpg-owned-chrome-TD0fFu`, `yairpg-owned-chrome-ygdkQ6` and `yairpg-owned-chrome-je1DW1`. This cleanup restriction is separate from the completed zero-finding UI walk.
