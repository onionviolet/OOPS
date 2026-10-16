# R2: more inventory, readable native combat and quieter color

2026-10-15. **Technically delivered; shared runtime UI source ownership released
to root/coordinator.** No commit, push, worker/chat or successor. Root owns
USER_VISION, PROJECT, UI_RULES and the packet; this writer did not edit those
owners during R2. Weibao's visual acceptance remains open.

[Rebuilt three-way comparison](http://127.0.0.1:19115/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/shell-r2/comparison.html)
shows original Proto23, frozen prior Shell and R2 at equal 1366×768, including
Inventory, Focus, Stats, Combat, Crafting and 150% text, with a verified 100% mode.
[Saved comparison](evidence/shell-r2/comparison.png).
[Play](http://127.0.0.1:19115/): choose **Proto23 Shell** in the bottom Presentation
selector. Existing layout returns to the prior layout. Default selection is unchanged.

Read acknowledgment: the worker read SHELL_REFINEMENT.md R2A–R2D, latest
PROJECT/USER_VISION, UI_RULES UR34–UR38, prior Shell report, pinned original/lab,
and PRESENTATION_AND_FOURTH_WALL's native-signature/effect owner before edits.
The coordinator's explicit R2 transfer named this actual chat as sole writer;
no other runtime UI writer/build was found. Previous evidence was hashed before
work in [prior-artifacts.json](evidence/shell-r2/prior-artifacts.json).

## Changes

| Code | Result | Paths |
| --- | --- | --- |
| R2A | Native inventory viewport grows **121 → 245 px** at 1366×768. Stat text grows from prior 12.6 px to normal **14 px**, with separate aligned labels/values. Stats and a labeled Gear disclosure share a row; all native slots remain in the disclosure and the larger native route. Three original sort controls share one row and invoke the same commands. Fresh shell columns follow the source lower-region proportions; stored layouts are not rewritten. Upper player/focus heights align | `src/proto23_shell.js`, `src/workspace_layout.js`, `styles/ui_tokens.css` |
| R2B | Restrained blue/teal panels, quiet hairlines, vertical purple log gradient and quiet routine notices. Selected item has a pointer plus outline; selected opponent is underlined/pressed. Warnings retain their words/native categories. Custom structural palettes and semantic vitals remain authoritative | token file and presentation adapter |
| R2C | Read only native rendered opponent name, HP, five combat facts and attack-cycle progress. Five facts are explicitly labeled; native zero Defense is retained. Multiple opponents have an explicit inspection selector. No invented level or intent. Name/HP/stat nodes remain attached through selection and live updates | new `src/combat_focus.js`, `src/village_workspace.js`, a small `src/main.js` reader binding, `tests/combat_focus.test.js` |
| R2D | Existing registry/controller/history remain. Item/person/enemy inspection is free, with unchanged native clock/gameplay/RNG. Explicit item actions delegate once to native guards. Opponent/log remain during item inspection and expanded views. Existing selection, filter, category and scroll return behavior is retained | same native owners and existing navigation; no new framework |
| VFX | Stable semantic player/opponent anchors and plain text remain available. Existing native hit/start animation guards now honor reduced mode and OS reduced motion as well as off; full still animates. No new VFX registry, ability, AI, portrait or asset pipeline | `src/ui/combat_display.js`, existing effect owners retained |

Generated bundle/map/index rebuilt. No allowlist expansion or save/layout schema
change. Root's UR34–UR38 are consumed here rather than duplicated as a new spec.

## Actual source proportions and the tradeoff

The original was measured after its introduction and Normal choice in a fresh
disposable context at 1366×768. Fuller source captures invoke existing private
lab presets through source owners, then remove only the lab's display scale in
that disposable page. **DEV SEEDED, transform:none, no wrapper, actual1366×768**;
no source file was edited. The original pinned source SHA256 remains
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`.
[Measurements](evidence/shell-r2/source-measurements.json),
[unscaled capture provenance](evidence/shell-r2/source-unscaled.json).
No source code/assets or simulation/save owner were imported into YAIR.

| Region | Actual source, px | R2 at1366, px | Whole-viewport width/height relationship |
| --- | --- | --- | --- |
| Upper player | 446×326 | 337×246 | Source32.7% /42.4%; R2 24.7% /32.0% |
| Upper focus | 446×326 | 564×246 | Source32.7% /42.4%; R2 41.3% /32.0% |
| Inventory outer | 336×436 | 337×422 | Source24.6% /56.8%; R2 24.7% /55.0% |
| Native list viewport | 330×386 | 321×245 | Source50.3% viewport height; R2 31.9% |
| Lower work/actions | 556×436 | 564×292 | Source40.7% /56.8%; R2 41.3% /38.0% |
| Log outer | 379×765 | 389×668 | Source27.7% /99.6%; R2 28.4% /87.0% |

The lab wrapper separately measured 1700×820 rendered at **0.8**, or1360×656;
those wrapper pixels are not passed off as native proportions. The unmodified
source's outer lower regions extend about5px below the viewport; YAIR keeps its
persistent navigation, Save/Import footer, search and category controls inside
its680px work board. Candidate inventory controls/padding occupy about177px
of its outer panel versus about50px in the source. This explains part of the
remaining row-space difference; source and YAIR game states also differ.

**Remaining geometry difference:** lower widths are close to the source, but
upper regions retain YAIR's dock widths instead of equal446px regions. Their
heights align within1px. A width-only overlay was tried and removed because
active Gear/item views crowded adjacent regions; no overlay framework was added.
This is a visible limitation, not claimed visual fidelity acceptance.

## Native combat, knowledge and flow

The old `.enemy_stat` selector did yield five populated native cells. Actual
strings also carry separators such as `| Spd:0.82`. R2 strips those separators
before mapping keys, and the focused test uses the actual emitted form.
Final DOM assertions require exactly **Attack, Attack speed, Hit chance,
Dodge chance, Defense**, including the speed `/s` unit. Speed is the native
attack-rate stat, whose cooldown owner starts from its reciprocal; no DPS,
level or stat formula is added. Only renderer facts are read, never hidden model
attributes. Unsupported level/intent is omitted; missing rendered assessment
says it is not yet available. Zero is a real value, not an unknown marker.

[Final native/focus comparison](evidence/shell-r2/final-native-focus.json) records
native cells and displayed facts. In the synthetic two-opponent fixture the
second opponent can be selected explicitly; HP matches its own native row.
All five facts are fully inside the visible Focus body. Held-item detail keeps
the selected live opponent and the log. The compact combat detail body is110px
and scrolls; its Expand route gives a larger native detail. Local combat controls
retain **63px** before Expand, with **108px** observed after expanded return.
The native time region retains its small inherited40/43px overflow.

Item equip/take-off/use/read, changed equipment comparison, real stats/equipment,
elder menu/dialogue, crafting/mixing, reading-preserving history and Back/Esc
passed. Reference inspection preserves clock and work; multi-opponent selection
and item/reference inspection preserve character, inventory, expansion/RNG,
native encounter and clock exactly. Long synthetic player name and fresh
unassessed-person checks preserve knowledge boundaries. No personal save used.

## Verification

| Check | Result | Evidence |
| --- | --- | --- |
| Rebuild | Pass, final served bytes checked | `runs/shell-r2-build.log` |
| Main desktop/native/persistence journey | **24 groups pass**, including real125/150% text, running combat, Save/reload/Export/literal-file Import and exact old-layout return | `check-shell-r2.cjs`, `runs/shell-r2-browser.log`, `evidence/shell-r2/results.json` |
| Supplementary native/knowledge/palette/effects | **10 groups pass**; initial label formatting is superseded by the final label check below | `check-shell-r2-extra.cjs`, `runs/shell-r2-extra.log` |
| Final affected desktop/text captures | **5 groups pass** after geometry changes: three sizes and125/150% text | `runs/shell-r2-final.log`, `evidence/shell-r2/final-results.json` |
| Final mapped multi-combat/item/expanded return | **1 group passes**, all five facts fully visible, exact gameplay-state preservation | `runs/shell-r2-combat-final.log`, `evidence/shell-r2/combat-results.json` |
| Full suite during R2 | **1,776 total:1,771 pass, two inherited failures, three TODOs** | `runs/shell-r2-tests.log` |
| Final focused mapper/controller/scene/composition/mixture/contract/discovery policy | **19 pass** | `runs/shell-r2-focused.log` |
| Source/served parity | **562 project sources and13 served JS/CSS match**;44 embedded vendor entries excluded from project-disk comparison | `runs/shell-r2-parity.log`, `evidence/shell-r2/parity.json` |
| Contract/frozen output | **211 entries /273 occurrences**, no new exceptions. C1 and every recorded previous-shell/report hash unchanged | same parity |
| Comparison | Six three-way views load native1366×768 images;100% mode checked | `runs/shell-r2-comparison.log`, `evidence/shell-r2/comparison-capture.json` |
| Diff hygiene | `git diff --check -- src styles tests` passes | final check |

The full suite precedes the final scoped label/presentation refinements; final
focused checks and affected browser captures cover those changes without another
equivalent broad rerun. The inherited failures remain cheat-awakening clock-jump
first-message/storage retry (`failed.attempts > 0`) and partial-enemy-load
(undefined `card`). No new failure remains in the affected final checks.
Earlier diagnostic failures at150% and crowded multi-combat controls were real
layout findings, fixed and rechecked; the old unmapped-facts JSON is superseded
by `final-native-focus.json`. No prior failure record was rewritten as success.

## Desktop, large text and accessibility limits

| Viewport / text | Native inventory viewport/content | Page height / viewport | Log line viewport |
| --- | --- | --- | --- |
| 1366×768,14px | **245 /567px** |768 /768 |564px |
| 1440×900,14px |394 /567px |900 /900 |696px |
| 1920×1080,14px |574 /574px, all content fits |1080 /1080 |904px |
| 1366×768,125% actual17.5px |187 /567px |768 /768 |554px |
| 1366×768,150% actual21px |**82 /567px** |768 /768 |544px |

The final target captures confirm actual Appearance font settings, not viewport
zoom or injected font tokens. Large text keeps current work and Back reachable;
82px is a limited compact inventory window, so filter/Expand is the reading route.
Opening Gear also spends compact inventory height deliberately; close it or use
Stats for the larger native equipment view. No smaller text was used to reach245px.
[Final region measurements](evidence/shell-r2/final-geometry.json).

Keyboard item inspection, visible outline and selected-row pointer remain.
Native filters, quantities, instances, worn state, hotkeys and sort handlers are
retained. Native guard/refusal behavior is delegated, not replaced. Standard
palette and custom red background checks include both new surfaces, Focus and
log; semantic HP/stamina/status roles remain. No new animation/selection cue
uses color alone. Main ordinary play has no page scroll; reference/long-list and
compact combat-description scrolling remain explicit limitations.

## Existing VFX versus future work

Read owner: `docs/PRESENTATION_AND_FOURTH_WALL.md` native signatures; inspected
`native_discovery_feedback.js`, `native_discovery_policy.js`,
`settled_text_effects.js` and existing controls. Discovery/craft receipts retain
their existing settled-event, seen-event and known-row policy. This revision does
not synthesize a discovery or replay a flourish on reference navigation.

Browser proof: native combat animation **full/no OS reduction produces3 active
animations**, reduced/off/system reduction produce0, through the native timer
path. The same guard preserves full behavior and prevents decorative motion in
reduced modes. New player/opponent semantic anchors and original actor IDs stay
stable; plain text/log and input remain available. Native attack-cycle progress
is factual existing combat progress, not a new effect. The source model,
gameplay RNG, rewards and save owners are untouched.

Future dramatic abilities, portraits, richer intent/status, effect budgets and
any new effect registry remain planned work in the existing owner. This slice
claims neither a new VFX engine nor exhaustive native receipt/ability coverage.

## Review and release

Key captures: [inventory](evidence/shell-r2/inventory-detail-1366.png),
[person Focus](evidence/shell-r2/focus-1366.png),
[stats](evidence/shell-r2/stats-1366.png),
[Gear](evidence/shell-r2/equipment-1366.png),
[combat](evidence/shell-r2/combat.png),
[expanded combat inspection](evidence/shell-r2/combat-expanded.png),
[150% text](evidence/shell-r2/actual-text-1.5.png).
Corresponding1440/1920 captures and unscaled fuller source views are in the same
folder. Screenshots contain only synthetic/observer-permitted native facts.

**Runtime source ownership released.** Root owns authority updates and further
dispatch; do not restart TRIAGE/APOTHECARY or another writer from this report.
Read-only port19115 preview may remain. No commit/push. Existing save/layout
schema, default selection and old raw layouts/pins/collapse are preserved, with
old layout return and literal-file Import verified. Prior Shell/C1 evidence is frozen.

**Weibao's visual acceptance stays OPEN.** Remaining upper-width mismatch,
compact150% list, disclosed-gear density, and compact combat item description are
visible tradeoffs. Mobile, global quick jump, further rehoming, apothecary and new
VFX/content remain outside this revision.
