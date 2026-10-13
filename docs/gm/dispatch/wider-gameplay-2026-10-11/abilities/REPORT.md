# Ability contracts lane, 2026-10-11

Status: candidate source and narrow native transaction tests pass. Native UI,
private revised-pack consumer, rebuilt browser and save/reload/import are owned
by the wider-gameplay integrator and remain unverified by this lane.

Candidate checkout: `/Users/weiwei/.codex/worktrees/wider-gameplay/yet-another-idle-rpg`.
Exclusive runtime files: `src/structured_ability_runtime.js` and
`tests/structured_ability_runtime.test.js`. No edits to shared runtime, saves,
bundle or private content; no commits or pushes.

## Integration contract

`compileStructuredAbilities(definition)` returns `{commands, powers}` without
mutating its input. The integrator installs these arrays into the cloned pack's
simulation definitions before constructing the native registry. Existing packs
without `abilities` preserve their command/power definitions.

An optional ability row binds an exclusive world-owned command and source to a
functional kind, acquisition route and execution kind. Its actual native command
must disclose costs and apply at least one concrete effect suitable for that
function. Classification does not grant effects, sources or learned powers.

A method requires an actually held, awakened, active, unsuppressed, unexpired
source through the existing `faculty.<sourceId>.active` fact. Optional native
power acquisition remains a separate requirement from reading or remembering.
Control, target and counter predicates become native command requirements.
Alternate acquired carriers require their own held source and an explicitly
authored compatibility predicate; they preserve control, target and counters.
Local world/location and participant requirements remain native gates.

Timed methods require refundable cancellation and recheck the same support at
completion, returning reserved native inputs when support disappears. Refusal
text is generic and does not disclose hidden predicate details. The compiler
introduces no inventory, timer, XP track, save owner or migration.

Execution kind describes source-qualified authoring intent. Permanent versus
temporary duration, body dependence, device custody, charges and affinity rules
must be expressed in the actual source acquisition/removal policy, costs,
control and target predicates; the enum alone never implements those mechanics.

## Checks run

`node --test tests/structured_ability_runtime.test.js`: 4 tests passed.

Synthetic cases exercise the shared command preview/commit/advance pipeline:
paid actor fuel and actual target item transformation; reading versus acquired
pattern versus held source; control, target compatibility, counters, fuel and
local-world refusal without mutation; explicit carrier fit; generic refusal
text; timed source-loss refunds; authoring rejection before mutation.

No browser or persistence verification was attempted under this assignment.
Source qualification remains with the source-rules lane; fiction/balance and
actual gameplay acceptance remain with Weibao.
