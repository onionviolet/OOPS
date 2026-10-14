# F1: story metrics and measurement rules

2026-10-14. **PROPOSAL ONLY.** Extends root F1, F3-F5; runner contract in
[HARNESS](HARNESS.md). No measured values or passing thresholds are claimed.
Metrics describe causal content and player burden. A new sentence alone is not
a new story; a quiet peaceful life can be successful play.

## F1.M0: denominators, units and trace vocabulary

Use `H = supported elapsed played minutes / 60` for **played game-hours**,
including idle-running time but excluding frozen/closed time and runner CPU time.
Also report session-equivalent hours `H_session = elapsed game minutes /
(60 * recorded gameMinutesPerRealMinute)` only when the actual speed mapping is
known, constant per segment and supported. Sum segments for varying speed. Label
both clearly: ten game-years fast-forwarded in seconds is not ten years of user
exposure. Do not mix ratios across these clocks. `Y = elapsed native-calendar
minutes / 518400` only for the current supported 360-day calendar; other worlds
declare their own year mapping. Unsupported/zero denominators produce N/A.

One telemetry record is a committed cause, not a render. Fields: occurrence and
thread IDs, definition/family/template/phrasing revisions, world/instance/era,
cast-role refs, trigger/parent/outcome refs, time, known-to-observer status,
manual/auto/expiry, actual delta categories, eligible/selected/quiet reason IDs,
thread lifecycle and pin refs. Revisions partition measurements. No private
truth or source text in exported telemetry. Existing P3 events alone cannot
provide P12's composed-story identity; until joined, call them **event episodes**.

## F1.M1: distinct stories per played hour

For a resolved or explicitly closed episode/thread, define semantic signature
`K = (world profile, arc/card family, role pattern, causal goal, ordered meaningful
choice/outcome classes, payoff/closure class)`. Cosmetic names, sentence IDs,
RNG values and timestamps do not change K. A substantive repeated collaboration
may have the same K but a new episode ID; report both counts. P12 owns story
sifting and what constitutes a meaningful branch.

`DistinctStoryRate = |{K for completed player-known stories}| / H`.
`EpisodeRate = number of completed player-known episode IDs / H`.
`NoveltyShare = distinct K / completed known episodes`.
Also report planted hooks, meaningful callbacks and closures separately, plus
new-cast versus recurring-cast shares. No completion means count 0, not divide
by 0; an unfinished run's open threads are censored, not fake endings. Internal
world stories are a separate column from stories actually learned by the hero.

Gate proposal: agree a per-world/style range from a baseline and human play,
then compare paired seed distributions. Do not maximize rate, promise a fixed
number per hour, or inflate it with renamed copies or ambient spam.

## F1.M2: repetition by family, phrasing and cast (F5)

For player-seen occurrences sorted by `(at, committed ordinal)` and memory
window W, let `repeat_x(i)=1` when key x appeared among the prior W occurrences
in that same world instance, else 0. Then
`R_x(W) = sum repeat_x(i) / N`, with x equal to:

| Axis | Key / extra measurement |
|---|---|
| Family | Authored semantic family, not card ID. Report immediate repeat `R_family(1)` and 20-event window |
| Phrasing | Saved original template/variant ID plus normalized rendered-line digest. Report exact and near-repeat separately; normalize Unicode/whitespace/case and declared name slots, without collapsing negation or outcomes |
| Cast | Ordered role→stable actor-ID binding; also unordered cast-set repeat. Report conditional `R_cast_given_family` and recurring-person continuity |
| Combined | `(family, outcome class, phrasing, role-bound cast)`; identifies a repeated scene rather than intended ongoing relationships |

Report W=5 and W=20 plus a 30-played-day window as separate analyses. Never
collapse all three axes into one score: a beloved recurring cast with varied
choices is desirable. Normalize against available eligible alternatives. Record
`avoidableRepeat = repeats where an eligible nonrepeat alternative existed /
all occurrences with such an alternative`. Hidden alternatives are test-only.

Entropy diagnostic `H_family = -sum p_f log2(p_f)` and effective families
`2 ** H_family`, computed within a revision/cohort, support interpretation but
do not prove fun. Proposed warning: over 20% paired regression in avoidable
combined repeats with unchanged eligible pool, after baseline calibration.
Hard gate: damping never turns a legal option permanently unreachable. Small
decks, local scarcity and intended ritual repetition get profile-specific targets.

## F1.M3: dead, dangling and deliberately resting threads

P12 supplies states and allowed successor/cancel/expiry conditions; P14 supplies
retained history refs. Define:

- F1.M3a **Dangling reference**: a required live parent, cast, reservation,
  evidence or revision ref cannot resolve. `DanglingRate = broken required refs /
  required refs checked`; count affected threads as well. Hard gate: zero.
- F1.M3b **Dead thread**: nonterminal thread has no reachable continuation,
  cancellation, safe expiry or declared dormant restoration route under its
  qualified local rules. `DeadRate = proven-dead threads / admitted threads`.
  Proof needs exhaustive finite model or a witnessed contradiction. Search
  budget exhaustion is unknown, never proof of death.
- F1.M3c **Overdue payoff**: promised hook is past its declared latest payoff/
  disposition boundary with causes still valid and no explicit closure/defer.
  `OverdueRate = overdue valid hooks / hooks whose windows ended`.

Report stale age p50/p95/max and lifecycle inventory, with `waiting for player`,
`actor away`, `scheduled`, `dormant`, `closed`, `averted` and `unknown search`
distinct. Hooks invalidated by real changed causes need a disposition receipt,
not forced payoff. Sleeping for decades is legal where the world's adjective
profile declares it; an arbitrary QA age cutoff must not delete it.

## F1.M4: decision load and softlocks

`OfferedDecisionRate = known actionable decision occurrences / H`.
`ManualDecisionRate = manual settlements / H`.
`AutoDecisionRate = policy settlements / H`.
`UnresolvedRate = unresolved actionable arrivals / H`.
`ChoiceComplexity = sum log2(max(1, legal visible responses_i)) / H`, a rough
diagnostic, not a human cognitive model. Count zero-response occurrences
separately; exclude hidden or unaffordable options from this complexity count.

`BlockingShare = game minutes prevented by required choices / requested
supported game minutes`; count choice encounters and requested unspent minutes.
Wall waiting is measured only in a separately instrumented browser session.
`BacklogArea = integral(open known decisions(t) dt) / elapsed game minutes`;
report maximum backlog and time-to-settle distribution. Ineligible controls and
optional news are not decisions. Idempotent rerenders add no load.

Hard gate for new idle-compatible slice: no compulsory blocker without a declared
reachable safe handling route. Legacy intentional blockers are classified, not
quietly fixed by a harness. QA run livelock is distinct from player softlock.

## F1.M5: idle comfort and absence fairness

Run paired fixtures with equal elapsed **played** time and equal lawful policy
actions; vary only manual input/render frequency. Require equal mechanics where
no declared activity signal should affect them. Then test closed-app baseline:
advance deterministic wall input by 8h/72h/30d with zero played advance, restore
and compare. Existing P3/P4 baseline should add no retroactive time or cost.

`AbsencePenalty = adverse committed deltas attributable solely to wall absence`
reported as a vector: damage, death, money/item debit, debt, duty failure,
relationship penalty and lost required opportunity. Causal attribution uses
declared rules and paired controls, not net money difference. Optional unaccepted
offers passing during actual played time are classified separately from
punishment; explicit accepted commitments retain their local terms.

`ComfortFailureRate = absence/no-input runs violating the selected comfort
contract / eligible paired runs`. `HungerDeaths = count(life endings whose
authoritative cause is hunger)`. Hard gates: zero hunger death and zero
absence-only punishment in ordinary comfortable play. Also compare sustainable
ordinary progression, unfinished-job recovery and no forced purchase/feeding to
restore it. In unsupported food models, the hunger metric is N/A rather than a
claimed pass. Source-world expeditions/irreversible acts can be separately
selected, labelled hazards; they cannot silently make ordinary absence punitive.

Future offline/branch adapters need explicit banked/dropped/paused accounting,
active-branch ownership and return handling before QA enables them. See intro
OT1-OT10 and [MORE](MORE.md); none is current P18 behavior.

## F1.M6: drama curve versus storyteller style

Use actual committed impact receipts, not dramatic adjectives. Adopt selected
[D9](../p5/D9_STORYTELLER.md) impact mapping and revision. With half-life h,
`T(t)=clamp(sum_j signedImpact_j * 2 ** (-(t-t_j)/h) + supportedVitalTerm +
supportedOpenThreatTerm, 0,100)`. Keep D9's precise selected recovery mapping
when implemented; this generic equation is an instrumentation shape, not a
replacement balance formula. Missing terms are omitted and labelled absent.
Hunger never adds pressure merely because the player has not eaten.

Within fixed one-played-day bins, report T mean, peak, threat count, actual
damage/loss, relief deliveries and quiet duration. Proposed style diagnostics:
`CurveError_s = mean(abs(T_bin - profile_s.targetBandProjection(T_bin)))`;
`ThreatClusterRate = short-gap threat pairs / threat pairs`;
`RecoveryLatency = first supported delivered relief time - large impact time`.
Right-censor unrecovered impacts at run end. A style can target a broad band
or no band; off/Pure Chance need not produce a prescribed arc. Separate weight
changes, draws and actual outcomes. Same seed under a different style can diverge
in later eligibility; report that rather than pretending identical event paths.

Hard gates: impossible/vetoed candidates remain zero; storyteller cannot apply
resource effects, rewrite pending results or expose a hidden cast. Statistical
style checks use paired seeds and confidence intervals; human pacing acceptance
remains open even when the intended weight response is correct.

## F1.M7: authored coverage and reachability

Let A be cards admitted by the selected pack/revision; E the cards eligible at
least once; D drawn; O player-observed; R with a tested response; B authored
response branches. Report `|E|/|A|`, `|D|/|A|`, `|O|/|A|`, `|R|/|A|`, and
`tested legal B / declared supported B` separately. Author-identified excluded
cards remain visible in the inventory with exclusion reason, not removed to
inflate percentages. Add eligible-tick counts and draws conditional on exposure.

`ReachabilityCoverage = cards with legal start-to-card witness paths / cards
declared reachable`. Witness records all required means acquisition and action
IDs, seed, timing and terminal observation. SOURCE state injection establishes
a gate predicate check only. A natural or seeded-native journey has its own
label. Different reasonable routes to one card are separate coverage cases;
refusal, return, assisted, bought, risky and exceptional routes can coexist.

If independent eligible draws have probability p, miss probability is
`(1-p)^n`; for varying conditional probabilities along a declared frozen path,
use `product(1-p_i)`. Deck pity, open-card suppression and changing causes make
naive constant-p claims invalid. An undrawn rare card is not unreachable.
Bounded graph search reports witness / contradiction / unknown. No generic
fixed-once rule may masquerade as reachability protection.

## F1.M8: disclosure and canon-prose leaks (F4)

`SecretLeakCount = distinct pre-discovery forbidden disclosures by surface and
secret ID`; hard gate zero. `SecretScanCoverage = exercised (ID, route state,
surface) cells / declared applicable cells`. `CanonOverlapHits = suspect output
matches / scanned outputs`, also report matched spans in private diagnostics
only. Thresholds, exceptions, indirect behavior checks and source ownership are
in [HYGIENE](HYGIENE.md#f4-leak-scans). A zero-hit scan is scoped evidence, not
proof against every possible phrasing or inference. Public artifacts contain
IDs/route/status only, never truth, excerpts, revealing hashes or filenames.

## F1.M9: save growth per game-year (F3)

Snapshot the complete synthetic envelope at mapped year boundaries before/after
compaction. Let S(y) be UTF-8 JSON bytes and U(y) UTF-16 storage bytes, measured
with `measureSaveSize` (`src/save_files.js:197-207`). Report separately:
`GrowthUTF8 = (S(y2)-S(y1)) / (y2-y1)` and `GrowthStorage` analogously;
owner-specific slope, total size, max burst, pinned fraction and receipts/counts.
Include shared-origin keys in U quota checks. Export encoding bytes are a third
quantity. Negative slope is valid after compaction. Initial content enrollment
is a burst, not perpetual annual growth. Report post-warmup trend and all years.

`CompactionRatio = bytesAfter / bytesBefore`; `ReferenceLoss = unresolved
required refs after - before`; `QueryParityFailures = future gameplay queries
whose answers changed solely due to compaction`. Hard gates: zero new reference
loss, zero query parity failures and no silent deletion on quota failure. Growth
target is calibrated per content/cast/branch scenario against the existing 4 MiB
shared-origin budget, not an invented guaranteed capacity. Pin saturation must
be measured and explained. Perpetual worlds may need an explicit storage tier
or player archive choice; summaries cannot erase obligations to meet a slope.

## F1.M10: comparison and calibration

Aggregate by run before averaging across seeds; pooled event counts otherwise
overweight eventful survivors. Report median/p95/range, run count, eligible-time
exposure and censored stops. Bootstrap paired seed deltas with a deterministic
analysis-only RNG, independent of gameplay; publish its seed and method.
Small samples yield diagnostics, not robust acceptance claims. No statistical
result excuses a hard invariant failure. Store failing reproduction manifests
and minimal action traces, with seals applied, rather than all save payloads.

Start with threshold-free baselines, then record chosen bands in versioned
world/style QA profiles after director play. Keep all reasonable options
reachable. Strong luck, plentiful opportunities, peaceful repetition and harsh
active adventures can each have fitting profiles without being averaged into a
universal quality score.
