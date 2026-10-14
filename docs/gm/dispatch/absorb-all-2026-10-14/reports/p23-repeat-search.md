# P14: Reachable replenishment, 2026-10-14

Status: **IMPLEMENTED-UNVERIFIED native gameplay. Do not final-merge as a passing gameplay lane.**
Original module, tests and concrete P00 contract are implemented on
`absorb-all/p23-repeat-search`, base `0216ccdefcfce79877378f8cb0ee41129fe11c5d`.
No shared host/C2 file, raw source, original ledger, user save or main-checkout
runtime file was edited. The later coordinator assignment explicitly permits
building wave 2 against that base without waiting for wave 1. It also confirms
the worktree/branch and reserved proposed port 18832. Live HEAD/clean task tree,
SESSIONS lane records and no listener on 18832 were checked before implementation.

## Outcome and authority

The existing finite Village/Shack stash is retained. One separate publicly
offered linen offcut can appear at the Village well after each genuine supply
runner departure. Either help or free decline can produce this departure; no
mandatory payment is introduced. Each occurrence holds at most one scrap, takes
five idle played minutes to collect, stops when empty and states the next runner
departure as its replenishment event. It does not restock on rendering, load,
calendar rollover or arbitrary timers. New offers replace unclaimed stock; missed
offers never accumulate. The held state is a proposal, not accepted fiction or
balance.

This follows USER_VISION desktop/laptop direction, PROJECT's current C2 behavior,
LIFE_SIM_NORTH_STAR's lived-place proposal and ABUSE_AND_LIMITS' explicit no-fixed-
once direction. The current finite physical finds stay truthful; a finite object
is distinct from future reachable occurrences. Existing d49cb911/379007d7 UI work
is untouched. Proto23 pinned HTML scouting stop behavior and R5 sections 6.1–6.3
informed this adaptation; R1–R5 and supplemental mod reader notes were searched
for related mechanisms. No source/mod code or asset was copied.

Target: 1366×768 desktop; visible outcome: an offered-stock action, disabled when
empty, with an honest remaining/next-event sentence. Mobile is deferred. No VFX
is emitted, so this module does not bypass Effects off. Native Effects-off/layout
acceptance remains OPEN until P00 joins it.

## Per-row dispositions

| Source item | Disposition | Evidence / remaining gate |
| --- | --- | --- |
| P14 (reaudit packet has no original row IDs) | original module implemented; native implemented-unverified | src/absorb_p23/repeat_search/repeat_search.js |
| Proto23 finite search and exhausted stop feedback (R5 §6) | preserve C2 adoption; adapt future occurrences | Separate stock/receipt; old found flags are not reset |
| ABUSE_AND_LIMITS repeat settlement / reachable future occurrence | implemented module rule | Monotonic real departure receipt, one stocked item, atomic host plan contract |
| d49cb911 / 379007d7 adopted presentation | already adopted, unchanged | No duplicate implementation |
| life-loops finished remaining-find report | OPEN dependency | Not present at initial check; lane does not assume completion or take C2 ownership |
| Native clock, C2 event, inventory/save/workspace connections | OPEN, P00-owned | Exact requests in HOST_CONTRACT.md; no shared registration edits |

## Host join and compatibility

`src/absorb_p23/repeat_search/HOST_CONTRACT.md` specifies signatures, context,
event provenance, outputs, preflight and gate. P00 must stage the new optional
`absorb_repeat_search` field with C2's real help/decline plan and native resource
diffs, then publish only after whole-envelope persistence succeeds. The event
ordinal is safe-integer NEW `helped + declined`; never replay old counters on
load. Same/earlier event ordinals do nothing. Replenishment itself pays no item;
collection consumes the occurrence receipt with one native Linen cloth.

Absent optional state defaults empty, with no invented stock. Old C2 saves and
Village/Shack found flags stay intact. Supplied unsupported/malformed records
throw before host mutation. Pending progress and stock must restore verbatim.
The normalizer creates a fresh object; planning mutates neither the prior
optional state nor native inventory. Failed native persistence discards the
whole candidate, including any C2 departure and P14 receipt.

P00 must read the finished life-loops report before joining; no C2 edit/ownership
transfer is assumed. P07 familiarity reads C2 only and has no overlap here.
The panel uses a separate adapter in the exclusive module directory, so wave 1
C2/panel and wave 2 shared-host work do not share changed files. Same-clock
movement/busy transitions cancel search via advanceRepeatSearch, preventing
leave-and-return progress from bridging an interruption.

## Checks

- `npm run build`: PASS. Rebuilt local/served bundle SHA256:
  `598e02f54fe7db4c9a35bc79c75a754a7f8dc42eccf9fab828de8fd82e97b615`.
  The isolated module is deliberately not in the native bundle until P00 joins.
- `node --test tests/p23-repeat-search.test.js tests/absorb_c2.test.js`: final
  16/16 PASS, 0 failures (7 P14 and 9 existing C2 checks).
- Initial `npm test`: 627/627 PASS, 0 failures. Final full run after the added
  same-clock interruption check: **628 tests, 627 PASS, 1 FAIL**. Failure:
  `equipped native brace with an open road offer keeps ticking, travelling and
  reloading` in `tests/alloy_equipment.test.js:118`. Its existing child fixture
  command failed after 60.277 seconds, matching the configured 60-second timeout.
  Contention is a plausible cause, not established. Full-suite gate is FAILED;
  no original fixture/test was changed. Narrow reproduction: the exact named alloy test PASS, 1/1, zero failures,
  17.022 seconds total (15.931 seconds fixture test). This supports a transient
  failure; it does not turn the failed full-suite run into a pass.
- Fresh-origin headless Chrome Playwright at 1366×768: baseline Village starts,
  no page errors; served bundle matches rebuilt local hash. Playwright's bundled
  browser was absent; switched to isolated installed Chrome, no native UI control.
- Separate browser module/panel probe: two simulated departures, two single-item
  collections, duplicate-event no restock and disabled exhausted action PASS.
  JSON serialization roundtrips exercise module state only. This is explicitly
  an uncoupled fixture, **not native gameplay or native persistence proof**.
- Native changed loop, Save/reload/export/literal-file import, old-profile/native
  readiness/custody/discovery, Effects off and integrated desktop layout: **OPEN**,
  not run because P00 is not connected. Do not substitute baseline/fixture checks.

Evidence lives in the worktree's
`docs/gm/dispatch/absorb-all-2026-10-14/checks/p23-repeat-search/` (test/build logs,
browser harness/results and baseline/module screenshots). Generated dist is not
committed. Report and companion ledger are the only main-checkout writes.

## Commit and acceptance

Source commits: `0cd603a1d5f5aafaebd5e5f6e5d9a4bc81196101`
(module, contract and tests), `a948fd1dab8127363ec8113c302e89f5bfdc495d`
(clear stale panel feedback). Final browser probe was rerun after the panel fix.
No push/merge by this lane. Evidence commit: `e4679325` on the assigned branch.
P00 native integrated candidate is the next technical gate, then the full COMMON
journey and exact persistence gates must pass before coordinator final merge.
After technical gates, Weibao's play/taste is the remaining authoritative human
acceptance. No human acceptance is claimed.

Final dependency check: life-loops report/ledger still absent when finishing this lane. C2 ownership was not taken.
