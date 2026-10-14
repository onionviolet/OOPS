# T8: regional technology from planner graphs

2026-10-14. **Proposal only; no generator or runtime verification.** B1-B5
extend PW1, TL, TW and PI2 rather than replacing them. Scope and ranked future
work are in [REPORT](REPORT.md); persistence is in [SAVE_CONTRACT](SAVE_CONTRACT.md).
All numerical examples are original fictional fixtures, not calibrated history.

## B1. Two graphs and several kinds of possession

The planner supplies a capability graph: function goals have OR methods, methods
have AND requirements. Diffusion uses a second graph: authored regions connected
by actual information, people and goods routes. A method crossing a route does
not create its prerequisites at the destination. Link both graphs by stable,
revisioned IDs, never by matching names or one global era number.

| Proposed record | Meaning and owning join |
|---|---|
| `RegionMethodState` | Instance/branch, region, method revision, coverage, known custodians, operating consumers, reproducible suppliers, dependency refs and applied transition refs |
| `TransmissionEdge` | Authored endpoints, channel, direction, carrier, eligible payload, travel clock/delay, throughput and actual access/availability refs |
| `Exposure` | Sender, recipient/cohort, method revision, medium, fidelity envelope, sent/received times, evidence lineage and custody refs where relevant |
| `AdoptionEpisode` | Recipient, selected method, trial/operation/production/retirement outcome, causes, resources, evidence and next supported boundary |
| `RegionalProjection` | As-of date, denominator/coverage and common/rare/unknown-to-observer labels derived from known use, separate from private state |

Person knowledge, practiced execution, workshop capability and institutional
custody remain separate TL1-TL4 owners. For TL5, count supported **current users**
of a declared function/method among eligible recipients. A sample imported lamp
can be operated without a local lamp maker. Historical cumulative adopters,
current operating users and reproducible suppliers are different quantities.
Unavailable evidence renders unknown, not a zero census. Common/rare thresholds
are selected local presentation policies, not universal population percentages.

Basis: `docs/TECHNOLOGY_AND_PROGRESSION.md:41-59,958-980,1180-1186`;
[T4 H1/H2](../t4/DIFFUSION.md) at `:7-25` proposes local uptake and a declared
denominator. T8 uses that game interpretation without independently verifying
the historical sources or adopting their curves as balance.

## B2. Generate a coherent starting state once

Use one background coordinator shared with [HISTORIES](HISTORIES.md), not five
independent random generators that later try to agree. Dependency order:

1. Bind source continuity/era, world laws, authored regions/routes, planner pack
   revisions, canon pins, admitted starting assets and the immutable tech seed.
2. Admit origin methods and custodians within those constraints. Each original
   operating origin needs a lawful witness path or declared background means;
   each source-authored origin retains its source locator and evidence mode.
3. Advance a finite background interval through transmission, adoption, invention
   and any selected loss events. Produce typed causes and resource/capability
   transitions, with pooled historical budgets only where explicitly declared.
4. Derive the present: surviving suppliers, users, custodians, ruins, fragments
   and inventor identities. Validate them against the same causal skeleton.
5. Publish resolved state, receipts, retained dependencies and stream cursors in
   one transaction. Display reads the saved result and consumes no draws.

A background budget is labelled generated background. It is not player spending
or proof a runtime economy was simulated. Canon may supply a sparse history and
fixed present with unknown intervals; do not fabricate exact discovery dates to
fill every blank. Only admitted gap kinds receive generated details. A region
disconnected by ordinary roads can still receive a method through a separately
supported portal or visitor, but cannot receive it by narrator convenience.

P14 already proposes skeleton-to-survivor generation and frozen lazy detail:
`docs/gm/dispatch/procgen-2026-10-13/p14/HISTORY.md:21-53`. P20 keeps authored
geography fixed: `.../p20/SETTLEMENTS.md:5-9`. This lane generates tech state at
those locations, not terrain, streets or dungeon geometry.

## B3. Event-driven transmission and adoption

At an actual eligible clock boundary, resolve the smallest affected transition.
Suggested states are exposed, investigating, trial-ready, operating and able to
reproduce, plus actual interrupted/retired conditions. They are predicates,
not five compulsory progress bars. An archive or genuine power can satisfy
several predicates immediately. A new recipient is not automatically TK5.

For an optional stochastic local decision, evaluate integer weights over lawful
outcomes such as `trial`, `seekTraining`, `defer` and `chooseOtherMethod`. Inputs
can include known usefulness, trusted demonstration, funded means, current needs,
compatible standards and an institution's actual policy. Hard world/means
constraints apply before soft preferences. Zero eligible weights are a named
blocked condition, not a draw or a concealed impossible result.

Proposed draw mapping: from saved uint32 `u`, choose the first cumulative
positive weight greater than `floor(u * totalWeight / 2^32)`. Use exact integer
arithmetic and a pinned ASCII ID order, with `totalWeight <= 2^32`. Freeze the
weight vector, context revision, result and consumed cursor in the receipt.
Commit the chosen transition with actual costs/effects, not merely its label.
No random draw is needed for a mandated delivery or a source-authored outcome.

Fictional example: weights `defer=2`, `seekTraining=3`, `trial=5` give bins
0-1, 2-4 and 5-9. `u=2147483648` maps to bin 5, so the recipient trials the
method if its reserved means still validate. A later trial outcome is its own
committed operation. Reloading the first decision cannot replace it. These are
mapping fixtures, not seed-to-output vectors or selected tuning.

Save due time, transition ordinal, input revision and named waiting reason.
A blocked recipient waits for a relevant changed cause or declared reconsideration
date; opening its panel creates neither a retry nor a tick. Canonical tie order
is `(dueTime, phase, regionID, actorID, operationID)`. Apply declared arrival
latencies and deterministic same-time phases so traversal order cannot allow
instant propagation across an arbitrary chain. Shared stock is reserved by one
owner before simultaneous recipients can consume it.

## B4. Natural course, canon and disturbance

Book profiles pin known methods, operating limits, holders and invention windows
where canon establishes them. Keep SHOWN/STATED/INFERRED/UNKNOWN and source
conflicts with the pin. Unsupported gaps are not automatically free origin slots.
World adjectives cannot randomize a source-established invention away.

Retain baseline **planned** events separately from occurred receipts. In an
undisturbed branch, canonical causes follow the selected timeline. An exposure,
new supplier, stolen manuscript or removed workshop can disturb those causes.
Re-evaluate affected dependents under the timeline owner; do not cancel the whole
era, force a missing canon inventor to finish, or reroll unrelated regions.
An early equivalent invention does not prove that canon's distinct method already
exists. Private player research leaves native projects running without requiring
them to copy hidden notes. Native improvement needs its own evidence and means.

Original worlds retain their seeded projects and schedules as the natural course.
They need not invent everything or always advance. Local decline and recovery
require causes, not a compulsory periodic collapse roll. See
`docs/TECHNOLOGY_AND_PROGRESSION.md:463-480,800-824` and
`docs/TIMELINES_AND_DIVERGENCE.md:174-198`.

Natural course uses the world's authorized elapsed-time policy. Existing living
services explicitly describe played-time advancement at `src/simulation.js:72`.
This proposal adds no wall-clock/offline aging for every world. An eventual
offline adapter must process the same boundaries and stop at real exhaustion
or unsupported decisions; inactive branches do not advance merely on reload.

## B5. Observable consumer and future checks

Original candidate: two authored settlements, a working portable-light method,
one courier carrying a recipe and one interested receiving workshop. Knowledge
can arrive before its missing fixture. Buying or commissioning the fixture
allows a real useful lamp output; continued supply distinguishes operation from
one ceremonial success. A blocked route delays only its supported transmissions.
Another method or hired specialist remains reachable where lawful.

At 1366x768 and 1600x1000, show known regional use, the selected roadmap and dated
arrival/production evidence together in the existing workspace. No private origin
IDs or hidden feasible-method counts leak into badges. Mobile optimization is
deferred. Rendering the board never initializes world truth.

Future oracles, **NOT RUN**: reordered region/catalogue iteration yields the same
admitted state; no route gives no transmission; information alone gives no stock;
one imported product gives no manufacturing grant; different legal seeds can
produce different original distributions; undisturbed canon pins remain exact;
an intervention changes only dependency-supported consequences; split/whole
clock advancement and Save/reload/import preserve pending arrivals and next draws.
