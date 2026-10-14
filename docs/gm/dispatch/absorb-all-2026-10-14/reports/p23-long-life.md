# P01 p23-long-life, 2026-10-14

**Status: implemented-unverified, P00 integration required. Do not final-merge as
verified gameplay.** Original proposal content, implemented independently from
Proto23/mod ideas. No foreign code/assets copied. Human play/taste is unaccepted.

## Authority and reservation

Coordinator's launch assignment explicitly reserves worktree, branch and port
18820 and supersedes the prepared packet's wait-for-wave-1 instruction for module
work. Initial live HEAD: `0216ccdefcfce79877378f8cb0ee41129fe11c5d`; clean tree;
branch `absorb-all/p23-long-life`; port had no listener before own server launch.
The live `runs/SESSIONS.md` lists the wave-1 owners. No ownership was taken from
those workers, no shared host file was edited, no main-checkout game writes.
Wave-1 reports remain absent at the latest read. Their live in-progress C2 source
was read only to reconcile counter names; it is not completion evidence.

AGENTS, PROJECT current priorities, USER_VISION, LIFE_SIM_NORTH_STAR relevant
life/progression direction, SKILLS_AND_TALENTS and ABUSE_AND_LIMITS were reconciled.
Desktop 1366×768 is primary; mobile deferred. Native XP/custody/discovery/clock/save
owners remain authoritative. Existing `d49cb911`/`379007d7` UI features are untouched.
Pinned HTML SHA256 matches `a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
R1/R2 mechanism notes, R3–R5 contextual scope and M1/M2 title notes were read; mod
raw source was not rerun. Reader claims of native missing milestones are historical:
current native skills already have milestones and related-skill bonuses.

## Row dispositions

| Row | Decision | Landing and limit |
| --- | --- | --- |
| R07 | Implemented-unverified | Five original additive title goals in `src/titles.js`: earned home minutes, settled purchased items, known novice-loss count and million kills. Native held-title grant semantics retained. Home/purchase counters await P00 projection; odd-loss owner does not yet exist and stays OPEN. No fabricated past progress, calendar-to-home conversion or universal pet requirement. |
| N03 | Implemented-unverified | `training.js` installs one native Cooking 3 → Alchemy ×1.05 milestone; conflict preflight and repeat registration tested. Native model test observes XP change, repeated training and reconstruction. Actual native craft/Alchemy route awaits P00 and finished reveal-chain owner. |
| N24 | Implemented-unverified | Optional additive worn-title mode in `worn.js` and callback UI in `titles_ui.js`. Collection count derives from known held catalog IDs. At 3 titles, one worn domestic title gives related XP ×1.02. All old held effects remain. No generated 465-title/rank engine or forced mode. Native serialization/preflight/select commit await P00. |

Names and thresholds are reversible proposal tuning, not new accepted product
policy. Presentation recognition happens once per earned title; counter progression
and repeat training continue. New goals have no held stat/talent grants.

## Changes and compatibility

F1: Existing `titleBonuses` and all legacy title definitions are unchanged. Tests
assert every old combined bonus verbatim with absent/off/on worn mode. New titles
are ordinary earned-title IDs using the old record and save semantics.

F2: New optional `character.long_life_worn` schema 1 is absent on old saves. Its
validator rejects unsupported schema, null/array/extra keys and unheld selection
before mutation. Known collection count and XP payoffs are derived, not stored.
The validator is implemented but NOT installed in native save preflight in this
lane. No migration or native-envelope compatibility is claimed for positive state.

F3: Training has no extra persistent talent receipt or presentation limiter. Native
milestone/XP reconstruction supplies the fact exactly once; registration must
precede restore. No XP-caller duplicate factor, recursion, new clock or reward loop.
`trainingView` hides names until both skills are known. Existing titleView's default
complete-catalog contract survives; P00 explicitly chooses known-only counter view.

## Exact P00 requests

H1–H4 are specified in [`HOST_CONTRACT.md`](../../../../../src/absorb_p23/long_life/HOST_CONTRACT.md).
Required signatures, validation, return values and call ordering are there.

H1: Project wave-1 `absorbLocalLifeState.homeMinutes` → `home_minutes` and
`itemsBought` → `items_bought` in existing native `readTitleCounters`. Their owner
must be validated and durably settled. Odd `weak_enemy_losses` is omitted until a
known real novice-loss settlement owner supplies an optional safe integer and
idempotent per-event receipt. Repeated real losses remain countable. Do not guess
from existing total deaths. Native recognition and counter state commit together.

H2: Call `installTrainingLink(skills)` after all catalog/reveal-chain registration,
before any XP reconstruction. Native refresh owns the ×1.05 rate. Supply
`trainingView(readSkill)` from native known state and earned levels.

H3: Validate/serialize the optional worn field at envelope/import preflight before
any live/storage mutation; commit selection under native save ownership before
publishing it. Use `longLifeTitleBonuses` at the existing title bonus projection.
Wire only optional `readWorn/selectWorn/readTraining` callbacks to the title panel.
Keep all held bonuses active. A failed durable commit retains old state and effects.

H4: Run integrated earned Shack/Cooking/Alchemy routes and positive pending/settled
Save/reload/export/literal-file import, known-only/Effects-off/schema-rejection
controls. Native changed-loop gate remains OPEN. No lane fixture closes it.

## Checks

Evidence is under `checks/p23-long-life/` in this worktree. Feature commit: `aa5041aa` (code, tests and host contract). Exact results are
also in the companion ledger.

- C1: `npm run build` passed. Tested served SHA256:
  `e8f1bee494155325c4b6be013044e3564d82b329de82b8caf528e158cdce958b`.
- C2: `node --test tests/p23-long-life.test.js tests/titles.test.js`: 15 tests,
  15 pass, 0 failures. Native model test uses native catalog/person/XP components
  with browser presentation disconnected; it is not a played native loop.
- C3: Full suite `npm test -- --test-concurrency=2 --test-timeout=60000`: 630 tests,
  630 pass, 0 failures, 0 cancelled/skipped, 55,486.972459 ms. No timeout hit.
  Initial unrestricted `npm test` stalled after 55 visible passes and was terminated
  in this lane only; termination flushed 141 buffered passing tests, without a final
  summary. Only the completed bounded run counts as full-suite proof.
- C4: Fresh-origin native Chrome headless desktop: 4 baseline checks pass for
  rebuilt served bytes, optional absence, held-title reload and export/literal-file
  import. One supplemental uncoupled UI callback check passes. Zero page errors.
  Playwright default binary was absent; installed Chrome was used. A harness
  redirect-body error was corrected by accepting only HTTP 200 bundle responses.
  Screenshot and `browser.json` retained. Positive new-state persistence remains OPEN.
- C5: Task source whitespace check passed. Generated bundle/index changes are
  not included in commits. Own temporary server is stopped after evidence capture.

## Ownership and remaining gates

R1: C2 and reveal-chain wave-1 hooks may change before their reports land. P00 must
reconcile final reports and ownership; this lane does not cherry-pick or overwrite
those workers. Other wave-2 lanes own shared host areas; only P00 joins them.

R2: No native worn field, training registration or home/purchase/odd counter hooks
exist in this base-only candidate. Source/native-component checks and baseline
browser compatibility are separate from integrated gameplay acceptance. Coordinator
may assemble an integration candidate, but cannot final-merge this lane as verified
until H4 passes. The authoritative gate after technical acceptance is Weibao's play/taste.
