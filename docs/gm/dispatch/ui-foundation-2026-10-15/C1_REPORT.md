# C1: Proto23 information grouping

2026-10-15. **C1 is technically delivered; shared UI source ownership is
released for the coordinator's review.** Existing NAV → TRIAGE → APOTHECARY
remain queued. No successor or parallel source writer was launched. No commit,
push, engine replacement, gameplay/economy change or game-save schema change.
Weibao's visual-feel acceptance remains open.

[Comparison viewer](http://127.0.0.1:19115/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/comparison-c1/index.html)
· [1440×900 comparison capture](evidence/comparison-c1/side-by-side.png)
· [C1 Village at 1366×768](evidence/c1-village-1366.png)

## What changed

**D1, role grouping.** A fresh Workspace or explicitly selected Workspace preset
now presents compact You over Inventory on the left, contextual Focus above
Village/location and actions in the center, and the tall dedicated log on the
right. The native Inventory/Combat selector is a compact utility row without
another heading. Character/preparation, journal, skills, project and other detail
shells are parked from this default composition, with their nodes, discovery
predicates and native commands retained. Stats has a named direct route; known
details remain in existing navigation/More panels. A log notice and Stats dot
explain the relocation. Pinned content is not silently parked.

**D2, scene and idle focus.** Scene targets appear once as inspectable chips.
Only the selected target's existing commands appear beneath them; selecting a
chip still performs no gameplay command. Idle Focus is a 35 px header at the
target viewport, rather than a blank 155 px panel. Populated Focus grows for its
actual content. Current work remains a separate visible line.

**D3, useful focused views.** Center modes keep their shared bottom destination
bar and one content scroll area. While a service/detail is open, redundant scene
chips and the duplicate combat panel yield their space; live opponent Focus,
place/time, current work and the log remain. Closing restores the compact view.
There is no second DOM mover or command dispatcher.

**F1, independent-review correction.** The initial C1 flex rule compressed native
Stance & combatants into a sliver. It now receives a deliberately readable native
body, measured at **114 px** at 1366. Expand and Esc return were exercised while
native combat generated a further log message and remained in Infested field.
The native Inventory/Combat selector was also checked in both directions.

Paths: `src/workspace_state.js` (fresh preset defaults),
`src/workspace_layout.js` (composition eligibility/presentation preference),
`src/village_workspace.js` (one selected-target command group and idle state),
`src/workspace_navigation.js` (Stats route/relocation indication), one notice
callback hunk in `src/main.js`, `styles/ui_tokens.css` (scoped composition), and
`tests/workspace_composition.test.js`. Generated bundle/map/index were rebuilt.

## Compatibility decision

`normalizeLayout` and `WORKSPACE_VERSION = 1` are unchanged. Existing stored
layouts without the new browser presentation opt-in use their old composition;
their raw stored JSON, dimensions, visibility choices, pins and collapse states
are not rewritten. The browser check uses an existing layout with visible pinned
preparation and collapsed pinned skills and confirms those states and exact raw
JSON. Existing Appearance choices remain authoritative.

For a newly chosen Workspace preset, the per-browser key
`yairpg.workspace.v1.desktop.composition` records the exact corresponding layout
string. It activates composition only when that string matches the stored
layout, so another existing layout cannot inherit the profile accidentally.
This is presentation metadata outside the game save and layout schema. Entering
manual layout editing or importing another layout opts out; choosing Workspace
again opts in. Fresh defaults need no existing layout rewritten. Explicit preset
save/reload retains both the exact layout string and composition.

Scene de-duplication also applies to an existing scene panel, but its internal
IDs, commands and stored docking/dimensions are retained. No service access,
reward, progression, time scale or work/stop rule was changed. Merely inspecting
or expanding still borrows the original view; it does not cancel native work.

## Checks

The C1 change touches the shared preset/registry/presenter, so one full suite was
run after the JavaScript changes. Later fixes were scoped composition CSS and
were covered by the final rebuilt browser matrix and focused contract checks.
Counts overlap, rather than adding together.

| Check | Result | Evidence |
| --- | --- | --- |
| Build | Pass | `runs/c1-build.log` |
| Full suite | **1,771 total: 1,766 pass, two baseline failures, three TODOs** | `runs/c1-tests.log` |
| Focused source | 11 pass: preset/old-layout preservation, observer-safe scene projection, workspace focus, center controller/mixing and UI contract | `runs/c1-focused.log` |
| Desktop native matrix | 15 passing groups at 1366×768, 1440×900 and 1920×1080; populated Village, combat, crafting/mixing, Back/Esc, expanded inventory return, exact preset reload, Export/literal-file Import, old-layout opt-out and text scaling | [results](evidence/c1-results.json), [driver](check-c1.cjs), `runs/c1-browser.log` |
| Combatant review blocker | Readable 114 px body; Expand and Esc return while native combat continues, plus native view selector in both directions | [expanded](evidence/c1-stance-expanded-1366.png), [returned](evidence/c1-stance-returned-1366.png), results above |
| Actual text size | Appearance Apply at **17.5 px / 21 px**, confirmed computed native and mixing-label sizes; Back/current work reachable; no page scroll or overlapping primary panels | [125%](evidence/c1-text-1.25.png), [150%](evidence/c1-text-1.5.png), results above |
| Palette/keyboard follow-up | Six groups pass: inventory control fit; 36 visible contrast samples minimum 7.54:1; crafting; visible focus; actual custom palette Apply/reload; Standard palette | `runs/c1-style.log`, `evidence/c1-visual-results.json` |
| Source/served parity | 560 bundled source files match disk; bundle and 12 stylesheet responses match disk | [parity](evidence/c1-parity.json) |
| Contract | 211 entries / 273 occurrences, unchanged from S3; no allowlist growth | parity and focused tests above |
| Diff hygiene | `git diff --check -- src styles tests` passes | Checked after final source changes |

The same two pre-existing `tests/cheat_awakening.test.js` failures remain:
clock-jump first-message/storage retry (`failed.attempts > 0`) and partial-kill
load (undefined `card`). No newly failing test was introduced. An early import
driver waited for all external page resources; it timed out despite later normal
UI readiness. The final driver waits for the actual imported document's
DOMContentLoaded and then native Play readiness. Earlier diagnostic failures are
not the final test result.

## Measurements and discoverability

At populated **1366×768**, the document is exactly **1366×768**, with no page
scroll. The log shell spans **680 px** with **569 px** available for log lines.
You is **175 px** high; Inventory occupies **432 px** directly below its native
selector. Idle Focus is **35 px**, Village scene about **145 px**, current work
about **38 px**, and Local actions about **444 px**.

Only two regions overflow in this normal Village fixture: the inventory list
(297 px viewport / 774 px content) and center content (393 px / 560 px at this
snapshot). Columns themselves do not scroll. The inventory retains category and
sort controls and its direct expanded route. At the two larger viewports, log
line area grows to 701 and 909 px. Actual 125%/150% text keeps the page at 768 px;
inventory and center content scroll within their own regions, with Back outside
the scrolling content. The final driver also checks primary panels do not
overlap or extend under the bottom bar.

Agent screenshot review: You/Inventory and opponent/place/actions have adjoining
roles; routine native choices are visible; current work says what is running;
the return control names its destination and is distinct from commands. This is
technical/agent review, not first-time human usability or visual acceptance.
Combat retains small native time/location information regions with their own
existing overflow; this slice does not claim all UR21–33 or all-world/list cases.

## Reference and comparison provenance

[Pinned original Proto23 reference](evidence/c1-proto23-reference-1366.png) was
captured from `http://127.0.0.1:19117/proto23.html` in a fresh disposable context,
using four ordinary introduction choices and the visible **Normal** difficulty
control. Its normal reveal was allowed to settle: both `d1` panels, inventory
and log had computed opacity **1** before capture. No original source/style edit,
debug state mutation or personal source save was used. The initial washed-out
capture was replaced by this settled capture. [Metadata](evidence/c1-reference.json)
records the source SHA-256 and route; [capture script](capture-c1-reference.cjs)
keeps that check reproducible without storing or redistributing its HTML.

Both source/candidate screenshots are **1366×768**. The coordinator owns the
comparison viewer HTML. This lane only captured its static page at **1440×900**
after final image files were ready, with both images loaded at their native
1366×768 dimensions before scaling in the viewer.
[Viewer capture metadata](evidence/comparison-c1/capture.json).
The reference is fresh Normal combat and YAIR's Village is a synthetic populated
fixture. This compares information relationships, not equivalent progression or
balance. YAIR keeps the existing fluid 27/43/30 column proportions and named
navigation at comfortable 14 px text rather than importing fixed source geometry.
No Proto23 code or assets entered YAIR's bundle.

## Handoff boundary

C1 ends here. The shared source writer releases ownership; the coordinator
reviews the rebuilt candidate and controls the existing queue. Broader NAV
requirements, TRIAGE, APOTHECARY and further Proto23 source/variant research stay
separate. Source-reuse research is not acceptance of an engine swap or new
gameplay. Human visual-feel approval remains open.

Play preview: <http://127.0.0.1:19115/>. For an existing browser layout, explicitly
choose **Layout → Workspace** to review the new composition. Existing custom
layouts are deliberately not overwritten. Neither comparison capture nor tests
grant human acceptance.
