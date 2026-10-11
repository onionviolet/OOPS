# Village study delivery, 2026-10-09

Part 1 is complete. The three failures came from stale tests rejecting the
now-supported expansion schema 6; invalid-version fixtures now use 999.
Migration code did not need repair. Mentor promotion, debt payment, insufficient
funds, quota rejection and legacy patrol loading passed in a fresh browser.

Part 2 is an original playable proposal: Tessa’s native notes give knowledge;
native Village meditation gives practice; a new full patrol with the loaned
lantern and baton pays 60 instead of 50 coins. The center menu distinguishes
known, practiced and executable. First successful use adds one life entry.
Existing clearance study and Proto23/home workshop methods were audited and
this slice uses the Village patrol instead of duplicating their crafting.

## What to click

[Play the rebuilt preview](http://127.0.0.1:18320/). From the vanilla opening:

1. **A1:** In Village, use **Find work → patrol**. Finish two full two-hour
   game rounds, returning the kit after each, then ask Tessa for **Dependable
   worker**. Center actions may require scrolling below the career panel.
2. **A2:** Ask Tessa for her watchcraft notes. **Read** for six game minutes,
   then **Rehearse watchcraft while meditating** for five. End meditation.
3. **A3:** Start a new patrol. The center shows **50 + 10 = 60 coins** while
   the loaned kit makes the practiced method executable. Finish and return
   the kit. Check the remembered-years panel for first use.

## Checks

`npm test`: **260/260 passed**. `npm run build`: passed. Part 1’s preceding
suite/build also passed (257/257). [Part 1 browser](PART1_BROWSER.json) covers
Mentor, debt branches, quota and old saves. [Part 2 browser](PART2_BROWSER.json)
covers the fresh opening, one-time manual issuance and its quota failure,
partial reading reload, known-only 50-coin patrol, partial meditation import,
active method-bearing patrol import, 60-coin payout, repeat use without another
biography, cancellation/debt, final save/reload/file export/import and schema-1
career migration. No browser exceptions. [Study-ready view](study-ready.png).

The long browser journeys accelerated native timers through Playwright’s clock,
with HackTimer suppressed only in the harness. A separate [unmodified production worker-timer journey](NORMAL_TIMER_BROWSER.json)
also passed native reading, meditation and a full patrol paying 60 with one
first-use entry, from a generated schema-1 Mentor fixture on a fresh origin. Source/build fingerprints are in INPUTS.json.
Only generated test saves in /tmp were used; personal saves stayed untouched.

## Compatibility and remaining review

Optional career schema 1 upgrades to schema 2 without changing rank, counts,
kit debt or custody; new study fields start empty. Missing career data still
starts empty. Knowledge remains native book progress; practice/use stay with
the career. Imports reject practice without completed reading. Existing native
patrols lacking a career loan retain their original wage behavior.

Tessa’s fiction, meditation rehearsal, six/five-minute pacing and +10 bonus
remain proposals for Weibao to play and accept. No commits or pushes.
See [acceptance backlog](ACCEPTANCE_BACKLOG.md) and [checkpoint](CHECKPOINT.md).
