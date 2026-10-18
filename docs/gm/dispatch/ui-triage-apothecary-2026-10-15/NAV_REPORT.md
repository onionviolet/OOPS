# NAV: shared navigation and scroll budget

2026-10-15. Technical checks complete; final evidence recorded below. Sole NAV writer on `codex/gameplay-foundations` after
S3/C1 release and matching coordinator review. No commit or push. C1's frozen
review site/comparison remains untouched. Surface: shared reference/settings/
service navigation and panel headers. Target 1366×768, also 1440×900 and
1920×1080. Mobile, gameplay changes, TRIAGE and APOTHECARY remain separate.
Visual-feel acceptance remains open. Rules: [UR1–UR33](../../../UI_RULES.md).

## CHECKPOINT 1: recovery and measurement

Read COMMON, foundation REPORT/CHECKPOINT/C1_REPORT, coordinator review,
PROJECT standing priorities, UI rules and Proto23 baseline clarification.
S3 is complete; C1 explicitly releases shared source. The live queue's NAV
process is the current writer, with TRIAGE/APOTHECARY waiting sequentially.
Existing dirty edits are retained. Current baseline uses C1's rebuilt bytes.

[NAV_BASELINE.json](NAV_BASELINE.json) records ordinary populated page and
all actual scrolling regions at 1366 and 1920. At 1366 the document is 768 px,
inventory 297/774 px (477 overflow), center 393/433 px (40 overflow).
At 1920 the document is 1080 px; only inventory overflows, 609/774 px.
Named routes take one click and no scroll. Native Crafting does not focus a
heading. Opening Projects reproducibly hangs the browser main thread, so the
measurement rerun records that defect and skips executing that one route.

Before screenshots: [1366](evidence/nav/before-1366.png),
[1920](evidence/nav/before-1920.png). Disposable synthetic fixture only.
Reference: inspected native DEV SEEDED Crafting, Skills, Actions and Journal
at isolated port 19118. List/detail neighbors and compact list tabs inform the
shared list/header adjustment; recipe clicks retain YAIR's existing semantics.
No source code/assets copied. C1 already establishes You above Inventory,
Focus/place above actions and a tall log; retain that valid composition proof.

Next: fix Projects observer interaction, complete shared headers/navigation,
list bearings and linked notices, then rebuild and exercise changed behavior.

## CHECKPOINT 2: shared navigation, history and headers

Projects now opens without the reproduced main-thread hang: disabled-reason
decorators share an existing note and write text only when it changes. Native
Crafting/Mixing/Trade/Storage focus a controller-owned heading. Direct Journal
tabs, Data, known Notebook and Skills join the persistent nav and shortcut sheet.
Existing discovered/eligible owners still gate access. A repeated visit to an
already borrowed panel now releases its node only on its final history return.
Shared headers expose status, collapse, Expand/Return and pin in stable positions;
focused views borrow the exact same header and commands.

## CHECKPOINT 3: list bearings, summaries and linked notices

Shared search/count/empty-state tools cover native Inventory, Skills, Bestiary
and read Books. Native category/sort controls remain. Search and selection are
presentation state and survive the same view's history visits. Collapsed local
and Projects groups show action counts where native buttons exist. Existing
relocation, combat, loot, crafting, skill and activity unlock notices link to
their source through the same guarded routes. Unrelated narrative lines receive
no guessed destination. Quick jump is deferred: panel-only search would not
satisfy UR28's observer-safe people/item/action contract.

Initial rebuilt browser matrix passes all routes/hotkeys at the three desktop
sizes, named three-hop history with 180 px scroll and selection/filter/tab
restoration, repeated-panel history, headers/collapse/expand/return, empty search,
linked relocation notice, help sheet, inspection preserving native reading,
and actual 125%/150% text. Final evidence/persistence checks are next.
The full suite found the two inherited failures plus a DOM-test scaffold lacking
the new standard `insertBefore`/`focus` methods; that scaffold is corrected and
the focused slice passes. No allowlist additions.

## CHECKPOINT 4: expand and header verification

The normal header itself travels with a focused view: status, collapse, Return
and pin use the existing workspace action dispatcher and layout owner. Long
titles truncate within a single row so controls stay in their shared positions.
Native service headings belong to the controller rather than being inserted
into a foreign panel. The contract stays at **211 entries / 273 occurrences**.
Native completion beneath an inspection retires its obsolete history entry
without dismissing the reference view. A focused controller test and native
reading end through the browser cover this case.

## CHECKPOINT 5: final scroll budget and composition

| Viewport | Document before → after | Inventory viewport/content before → after | Center viewport/content before → after |
| --- | --- | --- | --- |
| 1366×768 | 768 → 768 | 297/774 → 265/774 | 393/433 → 393/433 |
| 1440×900 | C1 retained → 900 | final 397/774 | final content fits |
| 1920×1080 | 1080 → 1080 | 609/774 → 577/774 | fits → fits |

The search/count strip costs 32 px of compact Inventory height. Its 21 native
rows remain available through category filters, search and one-click Expand;
the expanded view uses the center's single scroll owner. The normal laptop's
six native routine dropdowns are visible without scrolling. Remaining center
overflow is **40 px**, comprising lower optional groups owned by TRIAGE.
No ordinary column or page scroll. The log remains **680 px** tall at 1366,
with controls fixed outside the line scroll area. At larger sizes the log shell
is 812/992 px. At 150% text the nav wraps to two rows; Back/current work remain
reachable while content scrolls. Exact region measurements, including combat's
small native time/location overflows, are in [results](evidence/nav/results.json).

[After 1366](evidence/nav/after-1366.png), [1440](evidence/nav/after-1440.png),
[1920](evidence/nav/after-1920.png),
[current work and named return](evidence/nav/populated-current-work.png),
[150% text](evidence/nav/text-1.5.png), [combat](evidence/nav/combat-1366.png).
Agent screenshot review: You remains directly above Inventory; the selected
target/current work/action region adjoins the center; Reports owns the tall
right region. A first-time reader can name Reading, its stop/return route and
the available item/work controls from the current-work screenshot. The home
screenshot supplies the routine Village choices. This is agent discoverability
review, not Weibao's acceptance. C1's measured fluid 27/43/30 layout is retained
instead of the reference's fixed geometry. Its frozen site/comparison is intact.

## CHECKPOINT 6: notices and empty states

Live panel discovery emits one shared arrival event. Navigation marks its
known destination and the log supplies a source link, independently of motion
settings; unknown IDs are ignored. Routes still use discovered/eligible owners.
`log_message(..., ..., {panelId, safeText:true})` is the explicit link contract
for subsequent moves and panel-owned notices. Existing notifications with known
combat/loot/craft/skill/activity destinations also use it. Native feature-local
status text remains at its source; narrative text has no invented destination.
The browser checks the real relocation source link and combat source link;
the arrival-handler check dispatches a synthetic known/unknown pair, not a
claim of earned discovery. Actual combat also emits native panel arrival lines.

Searches show a count and a concrete way to fill an empty list or clear a filter.
No book/skill/bestiary name is exposed beyond the native rendered known rows.
Other feature-specific long lists and notices will use the same shared tools
when TRIAGE inventories/re-homes their owners; this is not a claim that every
possible large save in every world was exercised.

## CHECKPOINT 7: quick jump boundary

UR28 remains a follow-up, as the brief permits. Known panels have direct nav
and hotkeys; a global search for known actions, people and items needs a proper
observer-safe registry rather than scraping all DOM text.

## CHECKPOINT 8: final checks and compatibility

| Check | Result | Evidence |
| --- | --- | --- |
| `node build.js` | Pass | `runs/nav-build.log` |
| `npm test` | 1,773 total: **1,768 pass, two inherited failures, three TODOs** | `runs/nav-tests.log` |
| Focused controller, mixture scaffold, composition, UI contract | 9 pass, overlapping full suite | `runs/nav-focused.log` |
| Fresh-origin desktop browser driver | 26 passing groups | [driver](check-nav.cjs), [results](evidence/nav/results.json), `runs/nav-browser.log` |
| Source / served-byte parity | All 560 project sources and 13 served JS/CSS assets match; 44 embedded vendor map sources excluded from local project comparison | [parity](evidence/nav/parity.json), [driver](check-nav-parity.mjs) |
| UI contract | 211 / 273, no allowlist change | focused log / parity |
| Save compatibility | Raw existing layout exact; pins/collapse retained through reload; Export and literal-file Import preserve synthetic identity/inventory/books | browser results |
| Diff hygiene | `git diff --check -- src styles tests` passes | final source check |

The two inherited failures are `tests/cheat_awakening.test.js`: clock-jump
first-message/storage retry (`failed.attempts > 0`) and partial-enemy-load
(undefined `card`). No new test failure remains. The early Projects baseline
timeout is the reproduced defect; an initial browser assertion used an
ambiguous `[data-module]` selector and was corrected to the shell. A first
parity assertion mistakenly compared embedded vendor TypeScript map entries
to absent package sources; the final check explicitly compares project sources.
These diagnostic runs are not the final results.

No game save or layout schema change. Existing layout v1 and C1 opt-in metadata
remain authoritative. Search, selected-row highlighting, history and live
arrival markers are session presentation state; no personal save was opened.
No gameplay, IDs, rewards, service access or native work/stop command changed.
Combat checks confirm Mixing is disabled away from Village, Alt+M grants no
access, native stance remains readable and the log still shows combat numbers.

Paths: `src/center_modes.js`, `src/workspace_navigation.js`,
`src/workspace_layout.js`, `src/ui_components.js`, linked-notice hunks in
`src/display.js`/`src/main.js`, shared `styles/ui_tokens.css`, controller tests
and the existing mixture DOM scaffold. Generated bundle/map/index rebuilt.
No change to the exception allowlist.

## Handoff

NAV releases shared UI source ownership to root/coordinator. The newer
user-authorized [Proto23 Shell packet](../ui-foundation-2026-10-15/PROTO23_SHELL_VARIANT.md)
and live PROJECT summary were recovered before handoff. Root stopped the queue
coordinator while retaining NAV as sole writer, and will explicitly transfer to
the existing foundation UI worker after actual NAV process release. This
supersedes the earlier checkpoints' assumption of immediate TRIAGE succession.
TRIAGE/APOTHECARY remain held in that order after the Shell variant; do not
restart the old queue from this report. No successor or parallel worker launched here.
Preview: <http://127.0.0.1:19119/>. The read-only server may remain; it owns no
source writes. Human visual-feel acceptance, quick jump, runtime census/world
threshold rehoming and apothecary conversion remain open at their proper scope.

New Trade/Storage heading presentation and every individual skill/loot notice
variant were not separately exercised in this lane: implemented-unverified for
those specific routes. Crafting/Mixing headings and relocation/combat links were
exercised. Subsequent affected service slices should cover those remaining
routes rather than treating the shared implementation as native proof for each.

Final CHECKPOINT: all 26 browser groups and nine focused checks pass after the
last shared CSS adjustment; final parity and source/doc diff checks pass.
No NAV build or browser-test worker remains. The read-only port 19119 server
may remain for review. Root's explicit Shell transfer is the next write gate.
