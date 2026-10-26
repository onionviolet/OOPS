# Broader UI follow-through, 2026-10-26

```receipt
build: 1e3c228bbeaf535bbf56d53ba9d37f945464d72822ce7063031b44a47458bee1
route: fixture(generated broader-ui-mid)
state: browser-verified
viewport: 1920x1080
persistence: unchanged
tests: 19 focused tests; six desktop/text journeys and six native edge cases
review: diff-scoped
surface: control-box primitive, center navigation, Proto23 item shell and their existing consumers; zero main registration changes
```

Owner: chat `01a178bb-aa49-7463-9835-65ca1680e7fe`, solo. User selected broader practical UI repairs, including report P3 where ready. Original evidence report is read-only. No commit, push or normal-app adoption selected. Private player saves untouched. Existing dirty edits captured in evidence/inherited.diff, not ours. Primary source-path reservations are under the Minecraft wave's shared per-path lock directory, labelled broader-ui. Relevant active wave L8 owns its domain feedback and combined wave gates; this lane does not modify those domains or generated primary outputs. Separate non-UI chat owns index/PROJECT/vision folds; proposed hunks will go in this receipt.

Read GROUND_RULES, RULES_INDEX router, PROJECT current summary, USER_VISION book-world/menu priority, RULES_CONSIDERATION U1–U13 and revised P1, UI_DESIGN_CORE_AUDIT, UI_RULES and architecture. Applied AD6–8/17/21/32/34/36/40–43, UR1/7/9–14/17/21–27/32/33/41–43/47/48/51–58/65–75, AR3/8/10/13/16. Instructions: [.claude/rules/player-ui.md](../../../../.claude/rules/player-ui.md), [runtime-code.md](../../../../.claude/rules/runtime-code.md). Existing seams: ephemeral centerModes and DOM-only control_box; no new gameplay/save owner.

## Executable delivery (frozen after baseline)

Goal: make view choices discoverable, local disclosures local, and deliberate full tasks easy to return from across ordinary play. Primary populated desktop 1920×1080 at actual 14/21px, relevant 1800×1040 and 1536×864 cases; mobile deferred. Preserve Proto23 composition, native commands, existing filters and layouts. Full tasks stay useful.

D1: Shared Inventory/Skills/Journal/Crafting/Reports controls gain visible purpose plus current choices, usable token-sized targets and correct focus/dismissal. Native state owners and controls stay attached.
D2: Shared center return restores the invoking keyboard control when still usable, else the current task heading. Keep scroll/groups and work intact. Exercise materially different inventory and recipe/journal journeys.
D3: Item regression repairs: More actions stays local and retains disclosure on refresh; focus previews rather than selects; pinned subject survives another preview; empty equipment slots stop claiming Equipped/Take off. Exact carried identity and slot-follow identity remain explicit.
D4: Reports filter/empty feedback is within this delivery where it can use existing controls without changing event history. Event prose rewrite and general repeat merging stay later unless a demonstrated safe join is ready.

## More-to-consider dispositions

ACT NOW: actual More actions expands to workspace:shell-detail (baseline browser result); generic current-choice labels hide control purpose across five consumers; keyboard return lacks source restoration. ACCOUNT FOR NOW: full views legitimately reflow; do not impose geometry immobility, suppress useful previews or replace pending commands. Empty-slot tooltip markup can exist without an occupant. Filters and record-time log subjects retain their owners. LATER: broader service/person lifecycle repairs, long-run report grouping, world prose, and unexamined feature-specific menus; no extra audit waves.

## Breadth map and current evidence

| Family | Baseline state and delivery coverage |
|---|---|
| Navigation | Rebuilt Journal and Condition full routes sampled; clear Back exists, return focus not restored by owner. Shared D2. Skills route to be exercised using actual nav key. |
| Place services/people | Populated Around you visible with two people and six services. Source-sampled nearby scene only; actual approach/leave still pending. |
| Character/skills/conditions | Condition empty and Body disclosure sampled; stat context and ended-effect retention source-sampled. Shared D1/D2, no body model changes. |
| Items/comparison | Rebuilt select → More actions reproduces center expansion. Selection alone leaves place and work intact, contrary to old UIS1 attribution. D3. |
| Lists/search/filters | Inventory existing empty/query handling and shared boxes inspected in source; D1 changes five existing consumers. |
| Work/crafting | Rebuilt cooking entry sampled; native recipe Missing state visible. D1/D2, actual make/refusal and resume pending. |
| Reports/notices | Rebuilt sparse history sampled. Blank space alone is expected. Shared D1/D4; historical-subject source sampled, long-run history unexamined. |
| Settings/layout/save | Existing menu and display owners source-sampled; browser presentation route/reversal pending. No reset/import mutation selected. |

Baseline snapshot `/tmp/oops-broader-ui-before`, copied by prepareTree WORKTREE plus resources copied including local fonts. Frozen HTML/CSS/source/resources, no mutable asset symlinks; node_modules runtime shared. Private manifest served empty in browser. Headless MCP fresh-life walk ran first (Village, seed 87), no page errors; DOM-only inspection limits are not native geometry proof. Browser baseline result and actual-size screenshots: [evidence/before/result.json](evidence/before/result.json).

## Checks

- `node scripts/playtest/broader-ui.mjs /tmp/oops-broader-ui-before .../evidence/before sample`: PASS baseline sampling, zero page errors; not post-change proof.

## Delivery inputs and coverage

D1 additionally fixes the demonstrated shared-list count/empty-state defect:
skills/books/entries use their own nouns, collapsed skill groups are not empty
search results, searching reveals matching skill groups and clearing restores
the prior category state. Additional source reservation: `src/ui_components.js`;
its before bytes are in evidence/list-helper-before.js. No other API/state owner.

D4 includes a reproduced Reports CSS precedence defect: native toggles changed
but `.message_common { display:block }` overrode category visibility. The six
category rules now follow the existing native display variables.
[evidence/reports-repro/result.json](evidence/reports-repro/result.json) proves
two rows remained visible with every filter off. Earlier `after/` evidence
certifies control state only, superseded for visibility by the final tests.

Frozen delivery: `/tmp/oops-broader-ui-delivery`; bundle SHA-256
`7c35b612e3e3d83ace75587e8f45d0492acbe59e2c088d6ca39ed26945d29d92`.
[evidence/delivery-input-manifest.json](evidence/delivery-input-manifest.json)
hashes actual copied build/HTML/CSS/source/resources/assets inputs and output,
including local font bytes. No mutable asset/private-pack symlinks in this
snapshot; node_modules runtime shared. Private-pack manifest is intercepted as
empty in each disposable browser context. Source snapshot was taken from the
dirty shared primary and then frozen; this is not certification of later
concurrent primary changes. No new cycle edges or main registration lines.

Named fixture: `generated broader-ui-mid` plus four rat-meat chunks, cooking
unlock and 100 XP each in Breathing/Combat to expose Skills for UI checks.
Natural progression pacing, all book worlds and private packs are not claimed.

Coverage additions: native nearby person inspection and overview focus;
conversation entry/Escape; outside-click dismissal without click-through;
running native training through item inspection, then explicit stop; Settings
font draft/discard and Escape to the opener. These passed on pre-list-change
bundle `183b6a747131d6738d5b2fa22266ce404118c0538bab09408c1d8428ee64512d`
([evidence/edges/result.json](evidence/edges/result.json)); delivery input delta is solely
the shared list-helper change. Those native state/service/settings paths have
unchanged owners; the final delivery matrix rechecks the affected list consumers.

### One line per check

- `prepareTree('WORKTREE', '/tmp/oops-broader-ui-delivery'); copy resources; build(root)` runs `node build.js`, the exact npm build script: PASS; frozen build hash above, primary generated outputs untouched.
- `node --test tests/ui_contract.test.js tests/center_modes.test.js tests/shell_composition.test.js tests/shell_strip_boxes.test.js`: PASS 19/19; no full-suite claim.
- `npm run check:arch`: PASS; unchanged import graph, six grandfathered main imports/205 cycle edges. Reused after CSS/text/list-only edits introducing no imports.
- `npm run check:rules`: PASS, two existing untracked-owner warnings; final receipt/doc recheck pending.
- `node scripts/playtest/broader-ui.mjs /tmp/oops-broader-ui-final .../evidence/final verify`: PASS six desktop/text cases and no page errors, before list-helper correction; superseded affected list checks by delivery run.
- `node scripts/playtest/broader-ui-edges.mjs /tmp/oops-broader-ui-after .../evidence/reports-repro repro`: PASS reproducer, two visible report rows when all categories off.
- `node scripts/playtest/broader-ui-edges.mjs /tmp/oops-broader-ui-final .../evidence/edges verify`: PASS six native/service/settings edge cases, zero page errors, input delta/reuse boundary above.
- `git diff --check -- <owned source/docs>` and `node --check` both browser scripts: PASS; no commit/staging/push.

### Remaining family-specific coverage

Navigation, inventory, recipes, Skills, Journal and Reports are exercised by the
selected shared pattern, not certified in all possible states. Services/people
have a nearby-selection/conversation sample; departed subjects, inaccessible
service stock and late-game institutions remain unexamined. Condition empty/body
disclosure and descriptions are source-sampled/baseline sampled; expiration and
combat-effect lifecycle remain with their current owner. Running native training
was exercised; long batch work and domain-specific automation remain unexamined
here and retain L8/domain owners. Settings draft/discard was exercised, not live
presentation Apply/reset/Import or every saved layout. Persistence schema and
commands unchanged; no new Save/reload/Export/Import gate is implied. Native Save
was used in disposable scenarios. UIS12 long-session date/prose/noncombat repeat
grammar is later, not completed by filtering. Mobile remains deferred.

### Proposed shared-owner hunks for the non-UI writer

RULES_INDEX UI register keeps UR1–UR75 and can append to its Covers cell:
“2026-10-26 navigation-scope and optional-review clarification; existing codes.”
No new AD/code or register row. PROJECT's Book worlds and menus summary can
replace its stale item-only waiting sentence with: “The broader UI shared-control
slice is recorded in docs/gm/dispatch/broader-ui-follow-through-2026-10-26/CHECKPOINT.md;
local source and frozen desktop proof are distinct from normal-app adoption.
Remaining family-specific repairs and report grammar stay in the UI audit.”
USER_VISION needs no new product policy; later broad-UI quote remains original
authority. These are proposed hunks, not writes to those concurrently owned files.

### Keyboard preview close, final frozen revision

Escape from the item preview's Full item control now returns to its carried
source row without reopening the popover. This closes the preview-specific focus
gap introduced by making focus preview rather than select. Final immutable root:
`/tmp/oops-broader-ui-delivered`, bundle
`1e3c228bbeaf535bbf56d53ba9d37f945464d72822ce7063031b44a47458bee1`.
[Delivered manifest](evidence/delivered-input-manifest.json) supersedes earlier
input manifests for the delivery. No further runtime changes selected.

The browser harness had two selector/driver corrections (native Tinkering id is
crafting; aria-disabled refusal uses Enter) and two route assumptions corrected
(training is labelled Go for a run; Settings returns through Back/Escape).
The preview footer test names its own Full item button because a native food
description also contains a known-recipe button. These are harness fixes, not
additional gameplay defects. The actual Reports visibility defect and collapsed
Skills counting defect were corrected in runtime and retained as regressions.

[Actual-size review gallery](review.html) selects task, viewport and text size.

## Final result and source release

Agent-verified, not human-reviewed. The selected shared UI delivery meets the
AD43 floor on the delivered snapshot; this does not certify the whole interface
or install it into the normal app.

- `node scripts/playtest/broader-ui.mjs /tmp/oops-broader-ui-delivered .../evidence/delivered verify`: PASS; six cases (1920×1080, 1800×1040, 1536×864, each actual 14/21px), zero page errors, exact viewport page bounds. Includes source-row focus return from preview, skill search/missing/clear/group restoration, local item disclosure/equip/empty slot, recipe success/refusal, Journal/Skills choices/Back and report hide/recover/history identity.
- `node scripts/playtest/broader-ui-edges.mjs /tmp/oops-broader-ui-delivered .../evidence/delivered-edges verify`: PASS; six native edge journeys, zero page errors, same delivered bundle.
- Final `node --test tests/ui_contract.test.js tests/center_modes.test.js tests/shell_composition.test.js tests/shell_strip_boxes.test.js`: PASS 19/19 after final source changes. Full `npm test` belongs to the committer/integrator under AD36; no commit selected here.
- Final `npm run check:rules`: PASS, two existing warnings for untracked owning docs; six new-format receipts validated.

Visual review used actual-size 1920×1080 at both text sizes, 1536×864/21px
local commands, Reports filter recovery and Skills, plus active-work screenshot.
No page overflow in any tested ordinary-play case. Some floor/large-text panel
header status/title truncation remains for the next density pass; native full
labels/accessible names remain available. Long-session report grammar/merging,
late-game domain menus, missing-person lifecycle and live presentation Apply/reset
remain explicitly outside this selected delivery, as mapped above.

Runtime paths: `src/ui/control_box.js`, `src/ui_components.js`,
`src/center_modes.js`, `src/proto23_shell.js`, `src/shell_control_boxes.js`,
`src/shell_strip_boxes.js`, `styles/shell_chrome.css`. Source input hashes in
evidence/owned-final-hashes.json; task-only runtime delta against inherited
bytes in evidence/task-runtime.diff. Rules/audit folds: docs/UI_RULES.md and
docs/audits/UI_DESIGN_CORE_AUDIT.md. Browser regressions are the two
`scripts/playtest/broader-ui*.mjs` files. Shared index/PROJECT/vision owners
were not edited by this lane; proposed integration hunks are above.

All named UI source/doc path reservations are released after final doc/link
checks. Primary generated outputs, unrelated dirty work and personal saves
were preserved. No staging, commit, push, normal-profile installation or app
replacement performed. Future integration must compare actual inputs before
reusing evidence; later concurrent changes are outside these frozen receipts.

- `npm run build` in `/tmp/oops-broader-ui-delivered`: PASS; post-proof rebuild
  produced the identical bundle SHA-256, so browser evidence remains valid.
- Final checkpoint relative-link check and owned-runtime input comparison: PASS;
  nine path reservations explicitly released in evidence/release.json.
