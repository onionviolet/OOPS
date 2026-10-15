# LP slices integration, 2026-10-14

Branch `hl/integration` from `c83945e5`: merged codex/hl-lp1, lp5, lp6,
lp7, lp8 (--no-ff). Weibao authorized: "merge passing LP slices with
build/test/smoke and push".

Conflicts: dist bundle and index.html version line (resolved by rebuild);
src/simulation_effects.js (LP1 leverFacts + LP6 partnerFacts, both kept);
src/feature_expansion_objects.js and feature_expansion_wave_host.js (LP7
material choices + LP8 drying tracker, both kept).

Checks on the merged tree:
- npm run build: pass. Bundle sha256 prefix e3f195c9231c.
- npm test: 1465 tests, 1462 pass, 0 fail, 3 todo.
- Each lane's own browser script against the merged build at
  127.0.0.1:8203 (fresh contexts, 1366x768; LP1 also 1440x900): LP1 pass
  (0 page errors), LP5 pass, LP6 pass, LP8 pass, LP7 pass 12/12.
- LP7 note: its "advance 4 played minutes" helper (40 x 1 s fake-clock
  steps) failed under heavy machine load on BOTH the merged build and the
  unmerged codex/hl-lp7 branch (3/3). With a 400-step budget both pass
  12/12. Harness timing, not a merge regression.

Not included: LP4 (browser check still running on port 8202 after a port
clash), LP2/LP3 (launch after this lands). Remaining gate: Weibao's play
and taste.

## LP4 follow-up merge

LP4 finished its browser acceptance on port 8202 (`4a030ee3`). Merged onto
the landed tip plus later docs commits (d40b80cb). Conflict: src/main.js
panel init (kept the newer harvest panel line and added LP4's habitat
panel line). npm test: 1473 tests, 1470 pass, 0 fail, 3 todo. LP4's
browser script on the merged build: all checks, errors []. LP1's script
as regression: 12 PASS. LP4 report note: a fresh chance replay spent 120
wool over 24 failed ordinary cloth recipes (existing recipe odds, not LP4
logic); flagged for balance.
