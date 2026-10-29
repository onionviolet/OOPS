# AB1: held ability and ordered conflict consumer

Status: **implemented, below floor**. Synthetic engine/native-headless fixture,
agent-verified, not human-reviewed. No canon rows adopted, private-pack changes,
commit, staging or push. Shared host/validator/UI files remain untouched; joins
are prepared in [AB1_INTEGRATION.patch](AB1_INTEGRATION.patch).
Authority: [AB1 brief](AB1_BRIEF.md), [MF1 L8](MF1_AUDIT.md#d2-proposed-ranked-build-order-at-most-eight-lanes),
PROJECT's lead-first direction and USER_VISION. The brief's explicit owned
ability filenames supersede MF1's proposed conflict filenames; the reference to
“L4” in the scope paragraph is a stale grant label, not the mandate.

Applies: AR1–AR16, AD36/AD38/AD43/AD45, CLR1–CLR13, LSD139; MD1–MD3
remain proposed modularity guidance. MR4/MR5's pure preview and conservation
apply to actual native costs. This slice adds no making mechanism.
UI follows [player UI rules](../../../../../.claude/rules/player-ui.md), UR42 and
UR70–UR75. Target: existing place panel, **1920×1080 desktop**. Visible outcome:
“Encounters · Your encounter” contains descriptions, durations, known costs or
unknown-cost disclosure, blocked reasons and completed observer receipts. Pending
moves use existing work rows and cancellation. Mobile optimization is deferred.
Headless DOM checks below do not establish desktop layout proof.

## F1: probe and reconciliation

Read MF1 F1–F4, L8 and C1/C2/C13/C14/C15; H2, D2 and T2's native-job/validator
patterns; the relevant reviewed gap paraphrases in private
`docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/reviewed-rows-2026-10-29/`.
The source review distinguishes practice/consumed ammunition, an armed encounter
with ordered acts and body aftermath, and perception-related information from a
receipt that merely says an action happened. Some reviewed rows concern another
actor or mismatched source and are not lead commands. No chapter acquisition,
new paragraph quotation or canon identity is included in public outputs.

Probe: C13 has a real held-source/control/target/counter compiler; C14 has an
ordered move runner over a caller-supplied plan; C1 owns native reservations and
completion; C2 applies actual costs, knowledge, body effects and facts. The cast
host has one simulation registration site and the save owner has an exact
admitted-job lookup. These carriers are present. No numerical input threshold
was declared. Candidate estimates remain unverified; **0 canon rows adopted and
0 new replay coverage measured**. The synthetic case proves the seam before the
separate private row lane binds source identities and outcomes.

## D1: mechanism, defaults and limits

`src/cast_ability_adapter.js` exposes `defineCastAbilities`, `quoteCastAbilities`
and `commitCastAbility`. Pack rows lower into existing native commands. At actual
admission, C14 selects the authored encounter move and invokes the injected
native commit callback. C14's invocation-local cursor is discarded; the output
is the native plan, with no extra saved battle. Completion/aftermath stays in the
native job and C2 effects. No battle-frame/legacy-battle file is edited, and no
legacy draw stream is used. There are no draws or ordinal addresses in this
adapter; a future stochastic conflict must supply LSD139-owned keyed addresses.

The proven chain is a held perception method -> actual observer knowledge -> a
move requiring that knowledge -> a release result -> an existing native topic
interaction requiring that result. Withdrawal has separate aftermath and blocks
the alternative move through the authored phase. A lost source or counter can
refuse admission; a counter introduced during work causes native refund and no
opening. Costs reserve once; settled moves do not settle again after reload.
Receipts belong to the acting observer and do not disclose future effect rows.

Default: source-supported ordered episode moves and their stated result.
Dial: explicit predecessor lists, native range/target/control/counter predicates,
participant support, known quantities and authored outcomes. Reason: actual
means and participant capacities determine which move is supported. Episode
moves default to native `once:true` for settlement integrity; a recurring episode
or practice set can author its supported occurrences. This is not a global cap
on practice or ability use. `after` is optional and does not invent a prior stage.

A complete known ability descriptor uses C13 unchanged. Partial descriptors bind
known held-source/control/target/counter/carrier facts without inventing an
acquisition class or blocking on an unknown class. Sources must already belong
to their native owner; the adapter grants none. The native fixture registers its
own synthetic source before native startup, not in the real checkout.

Unknown costs are omitted or `null`; an unknown amount in a cost is not charged
and is disclosed as unrecorded. Known costs remain charged even alongside an
unknown cost. An unknown native amount in a supported quantitative effect
becomes an `owner needed` fact rather than an invented delta. Explicit
`owner-needed` effects name the owner and observed fact. Such facts do not claim
a real wound, training gain, result or ammunition expenditure. Known body/item/
condition effects use their native effect contracts and require their real
native owners and means. A physical relocation additionally needs the native
source-world travel adapter; it is not supplied here. The initial escape case
uses a release result consumed by a native interaction, not a relocation claim.

Known limits / expected extension: this is an authored deterministic episode
adapter, not F1's full range/morale/trajectory battle work. Loading/chambers,
quantified practice progression, general contested outcomes and source-specific
body/equipment bindings remain their owners' work where not already native.
An explicit `owner-needed` fact preserves missing effects for that integration.
Public code contains no source encounter or invented canon result. The row lane
must check the paragraph before selecting effects and keep uncertain identities
separate. No branch may be called source-supported just because it compiles.

## D2: private pack contract and row-lane handoff

Pack field: `abilityConflicts`, optional; absent produces no definitions, controls,
progress, sources or receipts. Schema (generic words):

```js
{encounters:[{
  id, label, description,
  place: null, targetId: null, requires: null, locator: 'private locator',
  sourceStepId: 'private step',
  moves:[{
    id, label, description, minutes: 1, report,
    after: null, requires: null, costs: null, effects: [], result: null,
    ability: {
      sourceId: null, function: null, acquisition: null, executionKind: null,
      control: null, target: null, counters: [], carriers: []
    }
  }]
}]}
```

Optional properties may be omitted or `null`; data must be JSON-safe, with no
`undefined` or array-valued `requires`. Positive numeric `minutes` requires
source evidence or a scheduling fill whose basis the private source record
retains. Neither duration nor stock is generated from prose in this adapter.
`after`, when present, is a nonempty list of earlier move IDs. Native predicates
use `{fact,op,value}` or `{all:[...]}`/`{any:[...]}`/`{not:...}`. A carrier is
`{sourceId,requires?}`. Costs are negative native resource/item/vital effects;
unknown `amount:null` is retained as unknown disclosure and not spent. Native
effects reuse existing contracts; missing-owner shape is
`{type:'owner-needed',owner:'fixture.training',value:'Practice was described.',key?:'fixture.pending'}`.
`result` is an optional source-pinned result ID, not inferred success.

Command ID: `<encounter.id>.<move.id>`. Existing actor facts carry
`conflict.<encounter.id>.phase` and optional `.result`; acting observer knowledge
carries `conflict.<commandId>`. Downstream controls can read those native facts
or actual knowledge. `tests/cast_ability_adapter.test.js` exports a fully
synthetic example and calls the real native registry validation. The reviewed-row
merger can later route its kind to `defineCastAbilities(pack.abilityConflicts,
binding)`; its source is read-only in this lane and is not yet extended here.

Coordinator registration steps:

1. Reconcile/apply the prepared patch to the **live** host files. It adds one
   registration at `installCast`'s existing command list and reads
   `pack.abilityConflicts` during cast preparation.
2. Keep the native host quote, actual C14 admission callback, pending-work and
   cancel membership, validator lookup/support comparison, UI disclosure and
   perspective tag together. `tests/perspective_controls.test.js` expectation is
   included inside the patch, not edited in the shared checkout.
3. The private row lane binds reviewed outcomes and real source/target/stock
   owners, checks definitions through the registry, and supplies the sampled
   rebuilt desktop journey. Combined full-suite and rule gates stay coordinator
   work. No live pack row is needed merely to inspect the generic adapter.

Prepared patch sites: cast host imports/offer helper, prepare (near original line
151), install (190); native host imports, `act` (163–180), `cancel` (184),
projection/work list (227–234); native validator imports, absent-owner guard,
job lookup/support (32,54–59); UI disclosure (before existing divinations around
186); perspective family register (80); perspective test expected families (26).
Core-owner edits: **0**; main/display/save-writer registration lines: **0**;
new cycle edges: **0** as checked in the integrated disposable copy.

## Checks and floor

Final check receipts are recorded below after the final run. Full `npm test`,
`npm run check:rules` and rebuilt desktop browser are coordinator combined gates;
no rulebook or registered code was changed here.

- FLR1: disposable integrated build, hash recorded below. This is built source,
  not a desktop-browser-proven candidate.
- FLR2: named synthetic fresh native life fixture, with source grant and initial
  facts explicitly supplied. No natural or canon journey claimed.
- FLR3: native DOM controls, descriptions/costs/blocked state/perspective checked;
  1920×1080 rebuilt desktop layout remains open.
- FLR4: held method produces native knowledge, which enables a release move;
  release aftermath enables an existing native topic interaction.
- FLR5: real native validator plus pending and settled Save/reload/Export/literal
  Import; effect/support tampering rejected. No new save shape or migration.
- FLR6: synthetic engine/native-headless verified, not human-reviewed;
  **implemented, below floor** pending rebuilt desktop sampled journey.

Compatibility: old saves gain no fabricated episode state. Additional facts,
knowledge and standard jobs use existing additive owners. The disposable fixture
checks the integration patch in reverse against live source first and applies
forward in its copy if needed. It also verifies the resulting copy reverse-clean,
so the same test can keep using live joins after coordinator integration.

### Final verification receipt, 2026-10-29

Input: shared HEAD `d7eea04e02e2027c6be5f5302456ccbd97c31053` plus live
concurrent changes, including the body-care joins, and this lane's owned files.
The prepared patch was rebased after body-care integration changed host contexts;
no shared host was written by AB1. The final fixture copies that live source and
applies AB1's patch in its disposable directory.

| Command / input | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_ability_adapter.test.js` | PASS 5/5, 65.2 s; absent source, counter refusal/refund, withdrawal, repeated settlement, unknown fields, real registry and native release consumer | Synthetic engine/native-headless fixtures; no canon adoption or desktop proof |
| Disposable fixture: `npm run build` with `BUILD_OUT=<temporary copy>/candidate` | PASS; bundle SHA-256 `4236b790dd557d24c487b95703af0840ffea7ec0d977de9c42c9d63c674b1852` | Test instrumentation and synthetic pack; not an installed or published bundle |
| Disposable fixture: `npm run check:arch` | PASS; main -46 including five fixture export lines, display -37, save writer 0; 205 grandfathered cycles | Fixture includes native test exports; no new cycles |
| Disposable fixture: `node --test tests/perspective_controls.test.js` | PASS; added data family has its in-world register and expected-family assertion | DOM/perspective contract, not desktop layout |
| Disposable fixture: actual native Save/reload/Export/Import | PASS pending held method, pending release and settled consumer; saved effect/support tampering refused; no duplicate payment/result; no artificial battle session saved | Fixture source/facts supplied explicitly; no player-save access |
| `npm run check:arch` in shared checkout | PASS; main -51, display -37, save writer 0; 205 grandfathered cycles | Shared input with prepared joins unapplied |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/AB1_INTEGRATION.patch` | PASS after rebase to body-care joins; forward applied once and reverse-check passed inside final disposable fixture | Live already-integrated branch is implemented but not exercised in this run; coordinator may need to rebase if concurrent hosts change again |
| `node scripts/lane_review.mjs` with explicit grants and all five owned paths | Scope PASS (0 outside grant), top-level-await PASS (0); publication scanner flags both code/test files | Manually checked all matched strings: generic `world`, `gate`, `stable`; no canon-bearing rows; scanner's aggregate result is nonzero |
| Scoped `git diff --check` and checkpoint relative-link existence check | PASS | Whitespace and local file targets, not prose semantics |
| DV1 pointer: compare every nonblank `git show HEAD:<path>` line with current file | PASS, 0 missing | Preserves other lanes' existing pointer text |
| Full `npm test`, `npm run check:rules`, rebuilt 1920×1080 desktop journey | Not run by AB1 | Coordinator combined gates and remaining FLR2/FLR3 desktop evidence |

During development, native fixtures exposed a test-only unregistered source
at reload and an incorrect DOM selector; both were corrected. The native source
is now registered before startup in the disposable source owner, and pending work
is asserted through the actual panel text. Final focused run is clean. An earlier
relocation fixture was replaced with the release consumer after native travel
correctly required its source-world adapter; no travel bypass was added.

Final artifact SHA-256 identities:

- `src/cast_ability_adapter.js`: `bc6c1f6a8bc0f151603b2b7ceb1b2143bb71829f0bbc29c56ba6b25b41b4e005`
- `tests/cast_ability_adapter.test.js`: `93b0766a88cd869430a993b7032c93a169e094d98101186e5a419ee0bb6cf3fc`
- `AB1_INTEGRATION.patch`: `e387c9ba087211f97b72669bc19aa53439bf2b309c93d2caff6c6d5a41232aa8`

Owned files released to coordinator: `src/cast_ability_adapter.js`,
`tests/cast_ability_adapter.test.js`, this checkpoint,
`AB1_INTEGRATION.patch`, and the additive pointer in `DV1_CHECKPOINT.md`.
No writer remains active in AB1. Remaining playable acceptance gate: coordinator's
reconciled, rebuilt desktop sampled journey with source-reviewed private rows.
This lane remains **implemented, below floor**.

## Resume 1: BD1 rebase and patch-free fixtures, 2026-10-29

AB1's patch was regenerated against current HEAD `90c51a5f58b981a81f16f3a9d99a8cfde638ee58`, including the committed BD1 joins. Its bytes remain identical to the prior body-care rebase (SHA-256 `e387c9ba087211f97b72669bc19aa53439bf2b309c93d2caff6c6d5a41232aa8`); it includes the perspective register and test hunks and no `src/main.js` hunk. No shared host files were edited. The coordinator owns applying the patch and committing the released files.

The AB1 native test no longer reads, checks or applies integration patches. It copies the source it is run against, like TH1. When none of the AB1 host joins are present, it explicitly skips the native fixture; if the joins are only partly present, it fails. When all joins are live, the original native UI, exact validator, Save/reload/Export/Import, tamper and release-consumer assertions run unchanged. This supersedes the earlier receipt's patch-applying fixture description; its earlier check remains historical.

| Command / input | Result | Gap |
| --- | --- | --- |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/AB1_INTEGRATION.patch` at current HEAD | PASS | Prepared joins remain unapplied in shared source |
| Disposable copy: `git apply --check`, `git apply`, then `git apply -R --check` on AB1 patch | PASS | Patch applied outside the tests and outside shared hosts |
| `node --test tests/cast_ability_adapter.test.js tests/cast_body_adapter.test.js tests/cast_exchange_adapter.test.js tests/perspective_controls.test.js` in shared checkout | PASS 15, skipped 1, failed 0, 61.1 s | AB1 native fixture skipped explicitly because its live joins have not landed; BD1 and exchange native fixtures passed |
| Same four-file command in the patched disposable copy | PASS 16/16, skipped 0, 89.7 s | Synthetic native/headless evidence, not rebuilt desktop play; all three native fixtures ran against that copy's live source |
| Disposable AB1 fixture: integrated build and architecture check | PASS; bundle `4236b790dd557d24c487b95703af0840ffea7ec0d977de9c42c9d63c674b1852`; main -46 with fixture exports, display -37, save writer 0, 205 grandfathered cycle edges | Bundle contains test instrumentation and synthetic pack |
| `rg -n 'AB1_INTEGRATION|git.*apply' tests/cast_ability_adapter.test.js` | PASS, no matches | Text check; the integrated run above exercised the retained assertions |

Input identity: `tests/cast_ability_adapter.test.js` SHA-256 `5918a67b4eda3b0bdca6a1a400a4c4afca0b8d71cc8aa0c5afc2a24d9b551535`; patch hash above; shared HEAD plus AB1's uncommitted owned files. Rules: AD36, AD43, AR1–AR16, CLR9/CLR13; TH1 is the test-fixture pattern. Status remains **implemented, below floor**, synthetic headless verified, not human-reviewed. Source-reviewed private rows, combined coordinator gates and rebuilt 1920×1080 desktop journey remain open. No commit or push. Resume 1 ownership is released.
