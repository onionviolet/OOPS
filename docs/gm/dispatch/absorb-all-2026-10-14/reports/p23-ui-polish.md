# p23-ui-polish absorption report, 2026-10-14

Status: implementation committed on `absorb-all/p23-ui-polish` as `fd737f8a`.
No push or merge. Base `0216ccde`; worktree was clean at start.
Authorization and scope: `../COMMON.md`, Weibao's lane assignment, and the live
USER_VISION/PROJECT/UI design owners. Proto23 behavior was independently
reimplemented. No foreign code or assets copied.

## Outcome and scope

F1: 15 UI ledger rows reconciled: four received implementation and eleven were
already adopted in d49cb911/379007d7 and were verified instead of rewritten.
The index column below is zero-based; the JSON also includes one-based rowNumber.

F2: At 1366×768, vendor rows now distinguish available, unaffordable, all-in-basket
and sold-out stock with words and semantic colors. Sold-out rows stay disabled
and gray for the current trade visit. Inventory and worn rows show their same
read-only details on keyboard focus. Native hits show physical type, CRIT,
condensed native burst counts and a clearly labelled total. Worn-copy condition
and exact native repair quotes update after hits. The weather header now uses
the actual effective temperature and shows enabled weather duration and XP factor.

F3: Desktop/laptop remains primary. Existing separate panels, crafting list/detail,
per-browser settings, player palettes and Effects-off master switch are retained.
Mobile optimization, new damage types/body-part mechanics, new title mechanics
and creative acceptance are outside this slice. Native combat has no body-part
roll to present; adding a suffix would invent an outcome. Physical damage is
marked only by the combat owner's explicit metadata, not by parsing unrelated
poison/status messages that share a log category.

## Row decisions
| Ledger index | Source item | Decision and landing |
| --- | --- | --- |
| 40 | R4_crafting_vendors_actions_combat.md: 1. Recipes | Already adopted in d49cb911 (379007d7 supporting history). Existing crafting detail uses itemRecipeStatus for preview, blocking, commit and truthful receipt; native item-recipe list sits beside the detail. |
| 44 | R4_crafting_vendors_actions_combat.md: 2. Vendors and shops | New implementation. Incremental affordability includes current basket and sales. Status words accompany --sem-blocked; sold-out known rows stay gray and disabled for the trade visit. All-in-basket is distinct from sold out. |
| 48 | R4_crafting_vendors_actions_combat.md: 4. Combat | New implementation. Original native formatter: physical type marker, gain/loss colors, explicit CRIT and one total with ×N hits. Native combat has no body-part targeting; no fictitious body-part suffix or new mechanics added. |
| 51 | R4_crafting_vendors_actions_combat.md: 5. UI builders and state plumbing | Already adopted in d49cb911 (379007d7 supporting history). Existing session-only new-item marker clears on hover or focus; not reimplemented. |
| 52 | R4_crafting_vendors_actions_combat.md: 5. UI builders and state plumbing | Already adopted in d49cb911 (379007d7 supporting history). Existing reading position and unread control retain appended receipts; not reimplemented. |
| 75 | UI_SOURCE_ABSORPTION_2026-10-13.md: F2: Colors, VFX, spacing and detailed states | Already adopted in d49cb911 (379007d7 supporting history). Existing Vivid default respects stored Standard, semantic purchase colors and player appearance preferences. |
| 76 | UI_SOURCE_ABSORPTION_2026-10-13.md: F2: Colors, VFX, spacing and detailed states | Already adopted in d49cb911 (379007d7 supporting history). Existing bounded panel arrival ramp, anchored coin float and new-item marker; Effects off/reduced motion retained. Native reveal uses tint/brightness rather than concealing information with opacity. |
| 77 | UI_SOURCE_ABSORPTION_2026-10-13.md: F2: Colors, VFX, spacing and detailed states | Already adopted in d49cb911 (379007d7 supporting history). Existing workspace density, dedicated log scroller and aligned vitals retained. |
| 78 | UI_SOURCE_ABSORPTION_2026-10-13.md: F2: Colors, VFX, spacing and detailed states | Already adopted in d49cb911 (379007d7 supporting history). Existing Unfamiliar material placeholder is the native equivalent of ???; missing quantities and reasons use the blocked token without leaking ingredient identity. |
| 80 | UI_SOURCE_ABSORPTION_2026-10-13.md: First playable slice and remaining gate | Already adopted in d49cb911 (379007d7 supporting history). Existing first-slice gate rechecked at 1366×768, 1440×900 and 1920×1080. Discovery implementation remains owned by reveal-chain. |
| 85 | SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md: F5: Colors and effects form several distinct vocabularies | Already adopted in d49cb911 (379007d7 supporting history). Existing rarityColor palette stays separate from subtype, money and weather colors. New vendor and physical-hit state colors do not recolor item rarity. |
| 86 | SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md: F6: Dense UI works because details have a nearby place to go | Already adopted in d49cb911 (379007d7 supporting history). Existing selectable recipe list/detail, keyboard selection, persistent scroll/focus and side/below preference verified; no replacement UI. |
| 87 | SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md: F6: Dense UI works because details have a nearby place to go | New implementation. All inventory/worn rows and equipment slots focusable. Same read-only tooltip on focus, with viewport-clamped position and aria-describedby; details refresh with inventory updates. |
| 89 | SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md: F7: Preserve strong behavior while correcting source coupling | Already adopted in d49cb911 (379007d7 supporting history). Duplicate log reading/retention mapping for row 52; existing implementation verified. |
| 92 | SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md: F8: Current adoption map, checked against live source | New implementation. Exact worn-instance condition and owner repair quote update after hits; optional weather header shows effective temperature, duration and actual outdoor weather XP factor. Existing Titles goal presentation retained; no title logic changed. |

## Verification and compatibility

A1: `npm run build` passed, including Ink artifact parity checks. Final tested
bundle SHA-256: `1e60f72119ba949dcb2a7cf78086d685223e660514e15f407298aa4a0080ec55`.
Final `style.css` SHA-256:
`7142c521c8f388092623286f124f3bb77a012f09c0bea263a4412c06faf4ce2a`.
Rebuilt dist and HTML cache stamps are not committed. Rebuild after integration.

A2: Focused `node --test tests/ui_polish.test.js tests/absorb_e1.test.js
 tests/absorb_e2.test.js tests/native_craft_transaction.test.js
 tests/workspace_focus.test.js`: 28/28 pass. Final `npm test`: 624/624 pass,
0 failures, 0 skips (156950.674417 ms under concurrent wave load). No pre-existing
failure observed. `git diff --check` for the task's source/tests/docs passed.

A3: Fresh isolated Playwright/Chrome contexts, served by Python on assigned
`http://127.0.0.1:18707/`. Eight final browser groups pass at 1366×768:
keyboard detail without hover; enabled condition; enabled weather;
native hit/condition refresh; native bulk purchase/sold-out retention;
zero-budget affordability presentation; restored fog's ×0.95 XP consequence;
and a controlled native 30-hit critical burst rendered as one total per attack.
The late-combat fixture grants test access and fixes RNG after startup. It proves
presentation, not naturally earned access, odds, progression or balance. The
zero-money fixture was read-only and proves its visual state only. No new
production test hooks were added. Final browser contexts report zero page errors.

A4: Existing adoption browser gates also pass: Vivid I1–I10 (10 groups), crafting
C1–C9 (9 groups), display settings S1–S7 (7 groups). These explicitly cover
three desktop sizes, unknown ingredients, quote/receipt truth, selection/focus/
scroll retention, log unread/jump, rarity readability, Effects-off master cap,
reduced motion and retained per-browser settings/export/import. These inherited
gates ran on the first candidate build; final eight-group browser proof ran on
the final candidate above. Later edits affected weather/condition/focus/physical
receipt presentation and vendor states, not those inherited implementations.

A5: Screenshots and machine-readable results live in
`docs/gm/dispatch/p23-ui-polish-2026-10-14/` on the lane branch. Visual review
confirmed the weather header fits, the condition quote is readable on the worn
row, and vendor state words fit beside price/bulk controls. Inventory may require
scrolling its existing dock to the row; this slice does not rearrange saved layouts.
Exploratory harness issues were corrected: an initial condition assertion had
not equipped gear; one elder-route click timed out under load and passed on
repeat with no source repair; the first critical-burst fixture used a single-hit
enemy area and was corrected to the existing swarm area. No such failed attempt
is counted as passing evidence.

No persisted schema or gameplay rules changed. Vendor memory is visit-local;
focus IDs are DOM-only; weather fields added to pacingEffects are derived return
values, never saved. Optional weather/durability remain default off. Existing
saved condition, per-browser display preferences and old-save defaults are read
unchanged. No migration is required. This slice therefore does not introduce a
new save/reload/export/import compatibility gate; inherited display-settings
export/import and full existing compatibility tests passed as recorded above.
No private user save was read, written or exported.

## Boundaries and integration

R1: `src/display.js`, `src/main.js`, `style.css`, `src/models/combat.js` and the
pacing owner are likely merge surfaces for p23-reveal-chain, p23-life-loops,
upstream/fork absorption and other UI lanes. Keep this lane's functions/hunks;
do not replace their newer files wholesale. Refresh derived weather presentation
from the gameplay owner's result after integrating any weather mechanics.

R2: `SESSIONS.md` referred to by COMMON.md was not present in this dispatch folder.
The user-named sibling areas and live dispatch/run inventory were used for scope
reconciliation. Reveal-chain owns capability/panel discovery, books and wallet
rows; life-loops owns title grants/counters and mechanics. This lane verifies the
already-landed overlap in rows 76/80/85/92 and does not implement sibling mechanics.
Only the two explicitly assigned report outputs were written in the main checkout.
The original ledger is untouched. No agents were spawned, and no other worktree
or port was used for execution.

Implemented-unverified items: none within the native presentation adaptation.
A body-part suffix is intentionally not applicable to this combat owner; new body
mechanics and nonphysical native damage types are not claimed. Motion, balance,
natural late-game access and all-world coverage are not established by this test.

Remaining authoritative acceptance gate: Weibao's playable/taste review at the
desktop viewport. Implementation and tests do not establish human acceptance.
