# DV1 / MF1 L4: ordered rite and source-pinned query

Status: **implemented, below floor**. Public name-free adapter, synthetic tests
and prepared integration patch; agent-verified, not human-reviewed. No commit.
The patch is applied in a disposable test copy, not in the shared source.
Authority: [DV1 brief](DV1_BRIEF.md), [MF1 L4](MF1_AUDIT.md#d2-proposed-ranked-build-order-at-most-eight-lanes),
[PROJECT](../../../../../PROJECT.md) and [USER_VISION](../../../../USER_VISION.md).
The lead-first direction remains in force. No new accepted decision or canon row.

Applies: AR1-AR16, AD6-AD8, AD36, AD38, AD43, AD45, CLR1-CLR13,
MR1-MR5/MR16-MR17/MR29-MR36 and LSD139; MD1-MD3 are proposed seam guidance.
UI patch follows [player UI rules](../../../../../.claude/rules/player-ui.md),
UR42 and UR70-UR75. Target is the existing place-panel Actions disclosure at
**1920x1080 desktop**: question, method, stage description, duration, actual
stock cost, blocked reason, earned signal and explicitly labelled interpretation.
Mobile is deferred. Headless DOM evidence does not establish desktop layout.

## F1: probe and bounded mechanism

Live input probe: `pack.divinations` has **0 query rows**. This is an inventory,
not a threshold gate. Reviewed JSONL paraphrases and gap reasons were read from
RV2/RV4/RV6/RV7/RV8/RV9, with relevant RV10 arrivals checked at closing. At the
closing probe there were 7 files and 346 file records; this is neither a unique
step count nor a conversion estimate. Source bodies were not acquired or reread.
The relevant gaps distinguish ordered actions, perceptions, other actors' work,
remote communication and supernatural body/place transitions. These distinctions
remain; a query receipt does not supply a missing physical or message owner.

The seam reuses C12's `defineRitual`, `fitScore`, `ritualDial` and `gradeRitual`,
C13's held-means/contact predicate pattern through native supported jobs, and
C15's existing observer knowledge. One chain is preparation, zero or more ordered
rite steps, paid attempt, interpretation, then an existing predicate consumer.
The synthetic example uses two rite steps and unlocks an existing native topic.

Default: held means, contact and declared exact/substitute rite support remain
present through completion. Dial: world-authored predicates, substitute fit,
costs, source-pinned signal precision and obscured/unanswered feedback. Reason:
the instrument and contact determine the supported reading. A later world law
can replace the support policy for risky partial rites. The grader's odds are
not executed or presented as measured probability by this adapter.

This slice freezes a **source-pinned** observation in the admitted job. It does
not implement probabilistic forecasting or dynamic contested resolution. No
ordinal or keyed draws are consumed; preview leaves the existing RNG unchanged.
The native job cause is the paid attempt identity and survives reload/import.
A completed obscured attempt spends its actual cost and records no-answer
feedback. Cancellation or lost continuing support refunds the uncompleted job's
reserved cost through native simulation behavior and grants no result.

Ordered phase lives in an actor fact, not another clock or job store. Restarting
preparation changes the phase, so old interpreted knowledge cannot bypass a new
chain when the consumer checks both knowledge and phase. Steps can be repeated;
the next attempt has a new native cause and a new payment. Stage receipts,
signal and interpretation are separate knowledge keys. A false interpretation
is `interpreted` knowledge with an `inference` basis and evidence-key reference;
it leaves world/target truth unchanged. The observer is the bound acting actor.
No observer's signal is automatically delivered to other people.

## D1: row contract for the content lane

Optional **`pack.divinations = {queries: [...]}`**. Missing field produces no
commands, quotes, facts, stock or reports. The synthetic full example is
`exampleQuery` in `tests/cast_divination_adapter.test.js`.

| Field | Contract |
| --- | --- |
| Row `id`, `targetId` | Stable IDs; target is the question's subject, not an implicit body relocation or participant |
| `question`, `method`, `label`, `description` | Nonempty observer-safe text; no hidden answer in labels or previews |
| `means`, `contact` | Required native predicates over existing held method/instrument and actual contact/range facts; no automatic acquisition or stock |
| `requires`, `place`, `locator` | Optional native predicate, location ID, private source locator |
| `ritual`, `dial` | Optional existing `defineRitual` and `ritualDial` shapes; each condition supports an exact rule or a substitute meeting authored fit floor |
| `steps` | First `prepare`, optional `rite` steps, then one `attempt`, then `interpret`; array order is executed via phase predicates |
| Every step | `id`, `kind`, `label`, `description`, positive integer `minutes`, `report`; optional native `requires`, `costs` |
| `costs` | Explicit negative numeric native `resource`, `item` or `vital` costs, validated by the native registry; attempt has at least one cost. No fabricated price, stock or energy conversion |
| Attempt | `status: 'signal' / 'obscured' / 'unanswered'`, nonempty `signal`; an opaque result still needs source-supported feedback |
| Interpretation | Nonempty `belief`; recorded as inference, not objective truth |

Command ID: `<row.id>.<step.id>`, revision 1. Stage receipt:
`divination.<commandId>`. Shared signal key: `divination.<row.id>.signal`.
Interpretation key: `divination.<row.id>.interpretation`. Actor phase fact:
`divination.<row.id>.phase`, storing the completed step ID.

Consumer predicates should check `actor.divination.<row.id>.phase` equals the
interpretation step ID, plus the appropriate `knowledge.<key>.value` or stage.
The test's existing topic consumer demonstrates this route. Knowledge basis has
`kind`, `attributedTo`, `situationId`, `queryId`, `targetId`, `method`, optional
source `at`; signal adds `status`; interpretation adds `evidence:[signalKey]`.
This is compatible with the existing knowledge validator and can feed L5's
native knowledge predicates without another evidence store.

Content lane: preserve paragraph support, actor, inputs, order, minutes/fill
basis, perceptions and result. The host binds actor `player`; third-party work
must remain a gap until its actor-owned route exists. An unsupported physical
transition, remote response, capability change or contested answer remains a
typed gap. Unknown step effect fields are rejected rather than silently folded.
No coverage is claimed from the audit's estimated 5-15 candidate steps; verified
new canon coverage remains **0**.

## A1: registration and ownership

Coordinator applies [DV1_INTEGRATION.patch](DV1_INTEGRATION.patch) after checking
its context against concurrent lanes. It contains the following bounded joins:

| Target | Registration |
| --- | --- |
| `book_world_lotm_cast_host.js` | Read `pack.divinations`, bind situation/be profile, install commands, quote and settle observer receipts into existing Reports |
| `book_world_lotm_host.js` | Quote with current facts, canon admission, writable/asleep checks; include jobs in current work; reuse existing `act` and preview/commit |
| `book_world_lotm_state.js` | Recognize generic-ID query jobs and compare admitted effects/costs plus exact continuing-support policy; reject work without its world owner |
| `book_world_lotm_ui.js` | Existing Actions disclosure with `data-perspective='player'`, description/cost/blocked feedback and earned observations |
| `perspective_controls.js` | Register the disclosure as in-world |

No shared source owner was edited. No main/display/save-writer registration,
second inventory, transaction owner, timer, migration or save envelope. New
values use existing facts, knowledge and jobs. Existing unused saves gain no
seeded progress. Expected refactor: replace source-pinned signal selection with
a world-local keyed resolver when a second supported contested case requires it;
retain native transaction, attempt and observer boundaries.

Exactly five owned deliverables: `src/cast_divination_adapter.js`,
`tests/cast_divination_adapter.test.js`, this file, `DV1_INTEGRATION.patch`, and
[DV1_CHECKPOINT.md](DV1_CHECKPOINT.md). Ownership is released to the coordinator
when the closing checks below pass. No other writer is delegated by this lane.

## Checks

Closing check results and input identity follow below. The first engine run
caught an undefined optional predicate field, corrected before the passing run.
The first native run caught a fixture money-path assertion; the next run reached
all assertions but its success marker was captured by the headless console.
The marker now uses stdout. These were lane failures, not excluded baseline
failures. Final tests check actual native state and `g.errors`.

| Command / input | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_divination_adapter.test.js` | PASS 5/5, 38.5 seconds | Synthetic engine plus patched disposable native/headless fixture, not rebuilt desktop browser |
| `npm run build` with `BUILD_OUT=<disposable-copy>/candidate`, run inside the focused fixture after applying DV1 patch | PASS; SHA-256 `d31ea328b4fce9cbad827e17594645193ae17e6ddf029a292407ff9e1fc6d15e` | Built fixture includes native-test exports; bundle not browser-exercised; shared dist/index untouched |
| `npm run check:arch` | PASS; shared main -51, display -37, save writer 0; 205 grandfathered cycle edges | Live source excludes prepared integration |
| `npm run check:arch` in patched disposable fixture | PASS; main -46 including five test-export lines, display -37, save writer 0; same 205 cycle edges | No production composition-root change; fixture source only |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/DV1_INTEGRATION.patch` | PASS | Context must be checked again at adoption if shared owners change |
| `node scripts/lane_review.mjs` with exactly the five owned paths as both grants and candidates | outside-grant=0, top-level-await=0; automated publication scan FAIL: name-hit-files=2 | Manual match inspection found generic `world` and `future`, including required `defineRitual` schema property `world`; no canon identity/text was introduced. Scanner lexical collisions remain reported, not hidden |
| Python whole-file whitespace and local Markdown-link check over five deliverables | PASS | Patch context's single-space empty lines are valid unified diff, not source trailing whitespace |
| `git diff --check -- src/cast_divination_adapter.js tests/cast_divination_adapter.test.js` | PASS | Untracked files also covered by whole-file Python whitespace check |
| Full suite, check:rules, rebuilt desktop journey | Not run by lane | Coordinator owns combined pre-commit gates and desktop integration; no rulebook/index change |

Input identity for reuse: shared HEAD `2824a1978f47ace6689ac20c91c30dbdf724929e` plus concurrent dirty work.
SHA-256 of sorted paths, each path/NUL/bytes/NUL, for the two source/test outputs,
DV1 patch, five patch-target source files, ritual grader and native simulation,
contracts/effects: `dabb0dade2b662e32a5938d8721baaba1a7c6c98825f66c7adbf531a227b43fc`. Shared files can move after this receipt.

## F2: floor and remaining gate

- **FLR1 Build:** disposable patched build passes, hash above; not browser-proven.
- **FLR2 Route:** named synthetic engine and native headless fixtures, earned ordered steps after fixture-owned instrument/contact setup. No natural source journey or rebuilt desktop route claimed.
- **FLR3 Shown:** native DOM checks reachable disclosure, player perspective, locked order/consumer, post-attempt signal and post-interpretation consumer. Quote test verifies costs while blocked and no early signal/belief. Desktop layout remains unverified.
- **FLR4 Used:** interpreted belief and current phase unlock an existing native topic; that topic completes and persists. Synthetic world truth stays false despite the misreading. No canon content adopted.
- **FLR5 Kept:** real native pending Save/reload/Export/literal Import and settled Save/reload/Export/literal Import pass; attempt cause, one payment, observer isolation and consumed topic survive. Altered pending effects and support are rejected by the real validator. No player save touched.
- **FLR6 Labelled:** source/rules reconciled, built and native-fixture-verified, agent-verified, not human-reviewed; **implemented, below floor**.

The remaining authoritative playable gate is coordinator adoption followed by a
fresh rebuilt **1920x1080 desktop** sampled journey with supported private rows.
Coordinator also owns combined full-suite/rule gates before commit. Wider dynamic
contested resolution, body/place transitions, remote delivery, energy conversion
and other-actor control need their actual owners when a paragraph requires them;
they are not prerequisites invented for this bounded adapter. Optional human
review is not a blocker. All five owned files are released for coordinator review.
