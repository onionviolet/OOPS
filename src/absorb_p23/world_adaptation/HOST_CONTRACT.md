# P12 join request for P00

Status: original reversible proposal, source module implemented, native loop
IMPLEMENTED_UNVERIFIED. This directory owns rules only. P00 owns all host writes.

## Exact API

Import from `./absorb_p23/world_adaptation/index.js`:

| Function | Input | Output |
| --- | --- | --- |
| `validateAdaptation(family)` | optional `undefined` or schema-1 family | throws on unsupported/malformed payload; no mutation |
| `prepareEnrollment(previous, context)` | absent family, explicit opt-in, known learned method, eligible actual body/world | transaction plan learning native resource |
| `prepareAdvance(family, context, reserve)` | whole-interval context, native integer reserve | transaction plan with fractional exposure credit and/or trial settlement |
| `previewTrial(family, context, reserve, doseAvailable)` | native snapshot, exact eligible owned dose availability | eligibility, known reasons, cost, duration, risk and native XP reward; no roll |
| `prepareTrial(family, context, {reserve,doseKey,doseAvailable,roll})` | exact owned copy/lot key, native custody preflight, saved native RNG draw 0..9999 | plan consuming one dose and 2000 resource subunits, saved pending trial |
| `adaptationView(family, context, reserve)` | known-method and Effects settings, actual native reserve | public view or null; omits saved draw |

Context: `{clock, worldId, instanceId, bodyId, bodyForm, ownerId,
controllerId, alive, conditionIds, optIn, methodKnown, effectsEnabled}`.
Clock is the native integer played-minute clock. `instanceId` is the actual
world/branch instance, not a guessed canon name. Enrollment supports only
`p23.mistglass`, human form, player-owned and controlled living body, and saves
that actual body/instance binding. P00 verifies the actual body and native body
agree, as in book_world_effects; an author-provided assertion is not evidence.
No active-action, foreground-tab or manual-input requirement. Pause adds no time.
No closed-browser/wall-clock progress is added by this packet.

Plans: `{expectedRevision,state,effects,expectedReserve?}`. State is a fresh
optional family value; no function changes the input or native owners.

## Atomic native preflight and publication

P00 must validate the COMPLETE candidate save envelope, including
`validateAdaptation(candidate.worldAdaptation)`, native energy validation,
body/instance references, current host clock equal to family clock, pending due
job, native saved RNG, condition deadlines and resource ownership, BEFORE any
live or durable mutation. An absent family is omitted, never initialized on old
saves. Null and unsupported schemas reject. Export/import uses the existing
native envelope and literal file flow, not a new family-only file format.

Under the existing native transaction owner, compare `expectedRevision` against
the live family (`null` means absent), and `expectedReserve` against its native
reserve. Preflight every effect, precise dose custody and skill registration.
Stage native effects, family, RNG advance and durable save as one transaction;
failed preflight or failed persistence publishes NONE. A stale/replayed plan
must fail before applying any item/resource/XP/condition effect. Never apply
callbacks and then write family state later. Event IDs are `p23.mistglass.trial.N`
for the real sequential trial, not a lifetime once flag. Persist receipt and
native reward together. Restore must not re-emit or reroll an already settled
trial. A second genuine paid trial has a different ID and remains reachable.

| Plan effect | Required native translation |
| --- | --- |
| `learn-resource` | register exported `mistglassEnergyPolicy`; native energy `learn`, zero reserve |
| `resource-credit` | native energy `recover` amount; reserve is in integer subunits, 1000 = 1 visible unit |
| `resource-debit` | native energy `use`, output `amount`, control 1; efficiency 1, strain 0 |
| `native-consume-item` | native exact-copy/lot custody transaction, item ID and key must both match, remove count 1 |
| `native-skill-xp` | existing native Meditation XP commit, amount 30; never a parallel skill engine or raw level setter |
| `native-condition` | native condition for saved actual body, `p23.mistglass.raw`, explicit start/expiry; blocks this method, no new death/health policy |

Unknown effect kinds reject. Energy learn must not overwrite an already owned
reserve; cross-envelope validation must reject family absent/resource present or
family present/resource absent in this optional profile. Rawness is a native
condition, not a timer in the presenter. P00 must record any unsupported native
condition/resource/XP callback as OPEN instead of simulating it locally.

## Authored content and clock boundaries

Use exported `mistglassContent` and `mistglassEnergyPolicy` for P00 registration.
The original test profile is opt-in, default off, does not change Frontier or
activate any book profile. Entering the proposed test world and learning the
method must follow actual discovery and body placement. The conservatory keeper
sells Cloudseed doses for 3 native coins, stock 4, restocked every 60 played
minutes by the native shop owner. This is a repeatable proposal; if native stock
cannot support this cadence, report that exact integration gap. Do not replace
a native purchase with a fixture grant. Shop payment, inventory receipt, item
knowledge and method discovery must use native owners. The native location
condition `p23.mistglass.mist` is present only in the authored conservatory.

Split played intervals at world/body/controller/life/exposure/rawness transitions,
trial due times and rawness expiry. Advance using OLD context before changing
it; re-evaluate the pending trial with NEW context at the same minute to detect
interruption. The module rejects skipping a pending deadline. Schedule native
settlement at dueAt, then apply native rawness before advancing the next segment.
Failure costs already-paid dose/resource and awards no XP. It adds six played
minutes of rawness. Success awards 30 native Meditation XP. The 75% success draw
is frozen at start in the native saved-RNG transaction, never on preview or
restore. Leaving the enrolled world instance/body interrupts with no refund.
Exposure continues while idle and while pending when eligible; rawness blocks
it. A full pool discards overflow, no hidden banking. 16 eligible minutes earns
a 2-unit trial, and recurring exposure funds future trials.

## Native acceptance P00 must supply

Target 1366x768 desktop: known reserve, +0.125/min rate, pending countdown,
preview payment/risk, actual success/failure receipt. Use existing panel kit and
Effects-off master switch. Mobile deferred. No secret reads in public projection.

Acquire two actual doses through native paid play, earn ambient reserve while
idle, start and settle at least one success and one failure. Demonstrate rawness
and wrong-world/body/condition controls, a later repeated paid trial, no duplicate
XP on reload. Save/reload/export/literal-file import at fractional exposure,
pending trial and each settlement, comparing the full native energy, exact item
custody, pending clock/RNG, XP and condition state. Also exercise old-save absent
state and unsupported-schema rejection before mutation. A JSON unit roundtrip or
an uncoupled browser harness does not satisfy any of these native gates.
