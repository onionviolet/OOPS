# Perishable lot condition and observation, 2026-10-21

## Scope and authority

This is a bounded native implementation of CRL27, CRL36 and part of CRL37,
under MR1, MR21, MR31, MR33, AR3, AR6–AR8, AR10, AR12, AD36 and AD38.
The selected lot is the existing harvested wolf-rat specimen. This adds no
general spoilage service or global item aging system.

The live direction is [PROJECT.md](../../PROJECT.md#useful-recovered-26-implementation-2026-10-21)
and the exact remaining gates are in
[coverage](../gm/dispatch/title-rules-implementation-2026-10-21/COVERAGE.md#finite-coverage-2026-10-21).
Continuation report identifies CRL27/36/37 as still unimplemented before this
slice. `src/harvest.js` already stored each specimen's immutable `born` minute,
damage and condition identity in the registered `harvest` save slice; actual
quality used elapsed played time at processing. Its material outputs become
aggregate inventory stacks, however, so those outputs have no individual age
or history to inspect. The current processor consumes the exact selected
specimen from the lot and cancellation returns that same specimen.

## Change

Each specimen may now retain an append-only `observations` list. The existing
carcass detail has an explicit **Refresh condition estimate** action. It records
the current played minute, current Butchering skill, estimated age interval,
qualitative freshness and damage bands. Butchering 0 estimates age within 60
minutes, 20 within 30, and 50 or higher within 10. Those are local reversible
inspection defaults, not rules for other worlds. A later inspection appends a
new record; it does not revise the earlier estimate. The latest and earlier
observations are labeled separately in the existing detail.

Observation uses the existing harvest command and transaction/save owner. The
existing `harvest` slice validates timestamps, skill, estimate bounds and bands
against the saved specimen, rejects future or edited observations, and accepts
legacy specimens with no observation property without inventing a past reading.
No save envelope registration or top-level save schema change is required.
True elapsed age, freshness and processing outcomes remain controlled by the
existing harvest resolver whether observed or not. Observation is free and
does not grant Butchering skill.

The processor has no split, transfer or merge operation for a specimen lot, and
finished inventory stacks cannot preserve specimen identity. Therefore this
slice preserves identity through existing lot selection, processing start and
cancellation, but does not claim split/merge/transfer lineage for finished
materials. CRL37 remains partially open at that boundary; adding an operation
solely to fill the matrix would require a new supported gameplay action.

## Checks and remaining gates

Focused verification: `node --test tests/perishable_observation.test.js
tests/harvest.test.js` passed 21/21 after a test-fixture aliasing issue was
corrected. The new tests cover append-only estimates at different expertise,
JSON save/restore validation, untouched legacy specimen data, and rejection of
future or tampered history.

The root integration owner still needs to run the required build and rebuilt
browser journey from a fresh origin. Seed one or more carcasses in a generated
test save, open `#harvest_panel`, choose the desired row's
`select[data-harvest-specimen="Wolf rat"]`, then click
`button[data-harvest="observe"][data-harvest-specimen="Wolf rat"]` to refresh.
Verify the rendered `ol[data-harvest-observations]` retains the earlier line,
then raise the fixture's native Butchering level, refresh again, and compare the
narrower new age interval. Save/reload/Export/literal Import must retain both
records. No player save should be used.

Source and unit evidence do not establish that browser journey or human play
acceptance. No full suite, build, browser run, commit or push was performed in
this lane.
