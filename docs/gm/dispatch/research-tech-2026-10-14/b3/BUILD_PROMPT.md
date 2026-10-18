# B3 build prompt: existing-state dev inspector

Prepared 2026-10-14. Proposal only. This file does not authorize execution,
dispatch, source edits, builds or commits. COMMON governs the current B3 docs
lane. Use the prompt below only when the coordinator explicitly selects and
dispatches this code slice with its file ownership. That future code dispatch
must explicitly replace COMMON's docs-only write/build restriction for the
listed code/test paths. Do not treat reading this file as that dispatch.

## Executable task brief

Implement B3 Phase A: a compile-time dev-only, read-only inspector of existing
actor/world facts, recorded native skill levels, held cheats and craft receipts.
IM2 does not exist; show **IM2 unavailable**. Do not implement it, invent beliefs,
grant RC cards or wire a native planner. Follow [DESIGN](DESIGN.md), especially
B3D1-B3D4. Full CN10 comparison remains deferred.

Authority and recovery: read AGENTS.md, PROJECT standing priorities,
docs/USER_VISION.md's standing UI/sealed rules, the selected dispatch,
this folder's CHECKPOINT, and technology round 9 OM/IM/RC, round 11 CN10,
folded T13/T14 results. T13 OWNERS/SAVE_SCHEMA are proposals; T14 CARDS/PANELS
are authoring data, not executable RC features. Recheck relevant current source
locators from DESIGN. No web research or additional worker dispatch is needed.

Before editing, recover branch/HEAD, staged and unstaged differences, active
workers/processes and current reservations for every touched file. Do not assume
the B3 audit's HEAD is the new base. Use an isolated worktree from the authorized
base for builds and dist/index changes; preserve relevant integrated/dirty input
only by an explicit coordinator-supplied snapshot. Do not reset, clean, stage,
commit, push or change user saves. Record actual writer ownership and input
revision/hashes in the code lane's own checkpoint before work. One writer per
file. If a hot host area is reserved, stop that integration and return the exact
needed seam to its owner.

## B3A1. File scope and seams

| Path | Allowed bounded change after code dispatch |
|---|---|
| `build.js` | Literal-false default compile definition, explicit `--dev-inspector` opt-in, rejection of unknown mode args, and build metadata for exclusion evidence. Preserve Ink checks, notices and cache fingerprints. |
| `package.json` | Add `build:dev-inspector` only; keep ordinary build/test behavior. No new runtime dependency. |
| `src/main.js` | One guarded lazy mount after native readiness, detached filtered read callback and lifecycle cleanup. Read current expansion/cheat/Work Ledger/player owners at each refresh, not captured stale objects. No save/loader schema, reward, console or save-key changes. |
| `src/display.js` | Export a detached null-or-`{key,text}` reader of the current session craft receipt. No new receipt producer, rewrite or persistence. |
| `src/dev/knowledge_inspector.js` (new) | Dev-only opener/region, session controls, safe DOM rendering, scoped injected styles, refresh/error/close/destroy behavior. No direct gameplay imports or commands. |
| `src/dev/knowledge_inspector_view.js` (new) | Pure snapshot-row construction/filtering and explicit missing-owner statuses; accept plain data, return detached rows. May serve as the temporary unavailable-comparison facade. |
| `tests/dev_inspector_view.test.js` (new) | Immutability, detached output, owner/retention labels, missing fields/actor, scalar values, safe sealed redaction. |
| `tests/dev_inspector_build.test.js` (new) | Normal/dev artifact distinction using actual build path in isolated fixture checkout; no shared output mutation. |
| `tests/dev_inspector_browser.test.js` and `tests/helpers/dev_inspector_game.mjs` (new) | Isolated dev/normal browser journeys, storage/save/import invariance and test-only owner observation. Reuse existing harness conventions, not its mutating card setter in inspector code. |
| Code-lane checkpoint/report/evidence directory assigned at dispatch | Build hashes, metadata, source/test results, viewport screenshots and save diffs from disposable fixtures only. |

Read but do not edit `src/config.js`, `cheat_cards.js`, `status_window.js`,
`panel_kit.js`, `workspace_layout.js`, `display_settings.js`, expansion/simulation
owners, native skill/receipt producers or persistence validators. Generated
dist/index output is permitted only in the isolated verification checkout and
is not a gameplay source change. No changes outside the dispatched allowlist.
If `src/research_reveal.js` is already owned or now exists, read its contract and
reuse a compatible pure reader; Phase A otherwise uses the local unavailable
facade. Building an unneeded shared comparison abstraction is not required.

## B3A2. Implementation contract

The flag is a compile constant, not a settings checkbox. Keep dev console
disabled. Ordinary build must remove the dev module, styles, UI strings and
handlers; attempted URL/storage/window overrides cannot enable it. Do not add
static debug markup, a global inspector API or normal-build imports of dev
snapshot modules. A dev build label remains visible while the inspector is open.

Mount an inline read-only region using panel-kit visual conventions without
calling definePanel/registerWorkspaceModule/registerPanelSettings. Keep F6's
existing workspace cycle unchanged. Open by a reachable labelled button, close
by Close/Escape and return focus to the opener. Filter and Refresh affect only
the closure. Use textContent and semantic tables/regions; do not inject source
text as HTML. No polling or motion. Read existing colors/effects without writing
preferences. Respect game startup overlays and do not intercept their controls.

Snapshot fields must retain owner path, actor/world identity and as-of clock or
sequence where recorded. Do not call create_save, getters that initialize skills,
derived fact builders with unverified effects, enrollment, captureRoadmap or
command/settlement APIs. Extract existing `skill_progress` entries directly;
missing records stay missing. Curated actor/world facts must pass a public or
existing discovery authorization allowlist before entering the renderer.
Unclassified and sealed values never reach DOM, console or snapshot exports.

Show Work Ledger craft/application receipts separately from the page-session
craft string. Keep exact existing receipt wording and bounded-history labels.
Missing fields say **Not recorded**. Session receipt is not a saved record and
may predate an in-page import; state that in its label. No new craft skill
snapshot, receipt history, fake timestamp or IM2 conversion is permitted.
Do not render Work Ledger action descriptors as controls.

The code lane may adjust reversible layout details to fit 1366x768, preserving
these contracts. Mobile work, RC acquisition/UI routing, knowledge teaching,
saved roadmaps, scheduler/critical-path calculations, provenance and cross-world
generation are excluded. Do not create future schema fields or seed records.

## B3G2. Source and artifact checks

Run the new focused tests, then the existing affected tests once:

```sh
node --test tests/dev_inspector_view.test.js tests/dev_inspector_build.test.js tests/dev_inspector_browser.test.js
node --test tests/cheat_cards.test.js tests/cheat_status_window.test.js tests/cheat_awakening.test.js tests/save_files.test.js tests/save_compatibility.test.js
npm run build:dev-inspector
npm run build
```

All commands are future gates, not B3 results. Use separate isolated artifact
snapshots/origins for the two build modes so the second cannot overwrite the
bytes under the first browser. Preserve exact build fingerprints and metadata.
If live test filenames move, locate their successor and record the mapping.
Do not weaken checks or fabricate missing tooling to get a pass.

| Criterion | Required observation and evidence |
|---|---|
| Read-only | Freeze fixture inputs including absent skill records and false/zero/empty fact values. Repeated projection/filter/refresh leaves complete relevant owners, RNG/sequence, XP key set, held cards, messages and receipt arrays identical. Returned rows share no mutable references. Missing actor/owner is unavailable, never repaired. |
| Save exclusion | Native serializer observations before/after inspection with a closed-inspector control yield no inspector fields and no inspection-caused owner changes. Compare browser display/layout/color keys as well. Account for serializer's own observations and volatile save timestamps explicitly, not by excluding arbitrary changed fields. |
| Build exclusion | Normal `npm run build` emits no dev module bytes/styles/handlers/UI content; esbuild metadata and map show no dev-module code/source content. Dev build contains the inspector. Runtime overrides of query/localStorage/window values cannot add the normal opener. Inspector flag never enables grant helpers or changes save routing. |
| Secret protection | Synthetic fixture uses invented sentinel secret values and nested receipt strings. Sentinel content is absent from rendered text, attributes, filter options and logs in both modes; authorized safe ID/route/status remains usable. Unknown classification fails closed. No actual secret truth is captured in evidence. |
| Compatibility/lifecycle | None/dormant/awake legacy cheats keep their exact records and status behavior. No first-message replay. Missing legacy fields stay absent. Opening/closing/reopening and load-induced owner replacement use fresh detached state without duplicate handlers. Reload starts inspector closed. |

Do not add tests that simply mirror an implementation's text. Assertions must
observe mutations, rendered values, storage changes or actual emitted artifacts.
Use existing test-only instrumentation for serializer/loader observation; it
must be absent from delivered normal/dev artifacts. Source access helpers are
verification tools, not inspector functionality.

## B3G3. Rebuilt browser gates, 1366x768

Record served bundle/style hashes, build mode, fixture identity and viewport for
each journey. Use fresh test origins and disposable browser contexts, never the
user's existing save origin. Run these five groups:

1. **Normal build:** finish native opening, confirm no dev button/region/API.
   Attempt query/storage/window opt-ins. Settings, Layout and normal status
   discovery still work; no inspector entry appears. Capture one screen and
   DOM/module-exclusion observations.
2. **Dev build:** open via button, read facts/recorded skills/cheat rows and empty
   receipt state. Capture Standard and Vivid at 1366x768. Header/Refresh/Close and
   both fact columns are legible, no page-level horizontal overflow, long rows
   wrap, region scrolls internally. Close restores the useful game workspace;
   F6 remains usable. Keyboard-only filter/refresh/Escape and focus return pass.
3. **Native craft:** use one supported disposable craft fixture through real
   load code and perform a native craft. Inspector reports the current session
   receipt, and retained Work Ledger receipt only if the real producer made one.
   Compare recorded output/XP text with the crafting screen. Refresh cannot craft
   again, award XP, connect a ledger or add messages. Label fixture acquisition
   honestly; do not claim natural progression from a seeded fixture.
4. **Cheat controls:** compare none, dormant and awake fixtures through the
   existing loader. Inspector works without granting a status card. Inspecting
   dormant state does not reveal normal native status or awaken it; inspecting
   awake state neither adds points nor replays messages. Refresh uses current
   owners after each successful fixture load.
5. **Persistence:** change inspector actor/filter/open state, use native Save,
   reload, Export and literal-file Import the disposable fixture on a second
   fresh origin. Decode the export to verify no inspector state and compare
   existing facts/skills/cards/retained receipts. Dev origin restarts closed;
   normal origin restores the same gameplay state without inspector UI. Session
   UI receipt loss on page reload is expected, not a missing saved receipt.

Test snapshots and serializer controls may hold the clock through existing
test-only mechanisms. They cannot substitute for the real native craft and
Save/reload/literal Import routes above. Note any ordinary autosave writes as
game behavior; inspector interactions themselves must emit no storage writes.
Screenshots of sealed fields are prohibited; use synthetic secret fixtures for
negative checks.

## B3S1. Stop and return conditions

Stop the affected work and record the exact unmet gate if:

- Source authorization or exclusive ownership is absent for a required host
  seam, or live direction contradicts this proposal.
- Completion would require IM2, new save fields, card grants, planner/native
  execution, mutating skill getters or a broad secrecy-system rewrite.
- Normal output retains dev code, a public field cannot be classified safely,
  or any inspector action changes gameplay/storage.
- The isolated build/native loader or browser tooling cannot establish the
  required 1366x768 and save/import observations.
- A failure requires touching unrelated source, saves, another worker's files,
  or weakening acceptance criteria.

Make a narrow fix within the authorized scope for an ordinary test/layout
failure, then rerun only affected gates. Return a code-lane report with changed
paths, exact commands/results, artifact evidence and each B3G2/B3G3 gate state.
Separate source implemented, tests passing, rebuilt browser verified and human
acceptance. Full CN10 belief comparison stays OPEN; no commit/push or additional
slice follows automatically.
