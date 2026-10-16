# R8 panel refinement and parallel sourcing

2026-10-15. Candidate, not human-accepted. [User direction](../../../USER_VISION.md#r8-feedback-on-the-r7-comparison-2026-10-15), PROJECT.md and UI_RULES.md remain authoritative. Sole runtime writer is this chat; the two subsequently user-authorized workers performed disjoint source investigations only.

## What was wrong and changed

| ID | R7 issue | R8 candidate |
| --- | --- | --- |
| D8 | Ten overview values and one native stat group at a time leave information behind extra clicks | Twelve overview values include native Magic and critical multiplier. All stats starts with all twelve native rows in one list; named group filters and Full stats remain. Condensed controls return space to data. Adaptive two-to-four-column short labels fit ordinary native stat rows, with full labels and explanations on focus/hover. No derived or future stats invented. |
| D9 | Repeated generic Open links compete with report subjects | Recorded skill/milestone/item subjects retain hover, focus and explicit retained preview. Named current-panel links show on row hover or keyboard focus; non-hover devices keep them visible. Hover never navigates or executes. Existing layout restores its original labels. |
| D10 | Folded target facts leave wide target panes empty | Automatic disclosure uses actual pane width/height and chosen font. Known native facts can use two columns with paired You context. Manual opening/closing survives resizing. Inspection remains separate from attack targeting. |
| D11 | Dry diamond is unexplained decoration | Dry is plain text. Existing native season, temperature, day/night and meaningful rain/snow markers remain. No extra weather effect inferred. |
| D12 | Most inventory names share a color | Equipment gold, usable green, components blue, books violet, other items neutral. Categories use actual native classes. Quality retains its native percentage/rarity colors, and explicit user palettes still win. The category control explains the mapping; no new rarity for ungraded items. |
| F33 | Focus/browser checks stalled even on frozen R7 | Debugger sampling landed in the shared workspace refresh. Docked panels no longer calculate floating-window bounds, and unchanged header/control text, disabled flags, labels and link metadata avoid repeated writes. Actual floating panels retain their bounds/drag path. This is a bounded UI hot-path correction, not a performance certification. |

## Surface, targets and limits

Routine You/Focus/Inventory and ambient Reports retain the existing panel registry, tokens, navigation and log column. Targets are1366×768 at14/17.5/21px,1920×1080,2560×1440 and3600×1906 at21px, DPR1. The supplied physical screenshot dimensions do not establish the user's CSS viewport or pixel ratio. Geometry and spacing change independently of selected text size. Mobile remains deferred.

Native observations, public tooltip content and event-time descriptions remain the only facts projected. Unknown/partial enemy information keeps R7 behavior. No targeting, appraisal, weather, new item rarity, engine, persistence-schema or continuation change. No personal saves, commits, push, external messages or publication.

## Evidence

Verified final slice: six viewport/font cases with all twelve stat rows inside the visible player region and all automatic target facts inside its pane; manual disclosure across resize; native shield compound Block also fits at1366×768/21px; recorded skill/milestone/item focus previews; quiet named report navigation and Back; native category/quality colors; plain Dry; unchanged gameplay snapshots; Existing layout bytes/pins/collapse and presentation-scoped Stop; Compact at unchanged21px. Ten focused tests pass. Source map matches565 project sources,44 vendor inputs classified,13 served local JS/CSS match, no new UI-contract exceptions. R7 recorded runtime files and excluded main/save/clock/simulation sources remain exact. The previously verified R7 Save/reload/export/import slice was not repeated after these presentation-only edits, so no new persistence claim is made.

Rebuilt fresh-origin tests, source/build matching and exact final results are recorded under evidence/parity-r8 and runs/r8-*-delivery*.log. Six-file inputs and hashes preserve the R7 starting state. Earlier failed/intermediate attempts remain: initial target fit clipped; controls consumed extra stats space; report tests initially assumed the wrong Skills DOM ID and classified a nested item-name wrapper as the category carrier. Those assertions were corrected to the real controller and semantic ancestor. Frozen R7 countercheck separately reproduced focus stalls before the bounded shared refresh correction.

D13 follow-up: fit ordinary active-tab information before scrolling. Stat columns follow actual pane width and type size; laptop stat detail takes additional height, while wide panels retain their useful full height. Long inventory/log/history and extended descriptions retain local scroll or explicit expansion. Enlarging one laptop pane necessarily reduces the simultaneously visible list below; no hidden text-size reduction or global browser zoom is used. Compact/Panels moves beside the attack-cycle control to remove a wasted row.

The comparison shows six size/font combinations in three compositions. R7 target references use its expanded individual-panel capture; R8 target references use its own roster choice. R7 Stats reference is the Attack group, R8 is All. Native fixture/state is the same three-opponent input with the third inspected. Overview captures are directly comparable defaults. Report examples use a separate native event fixture.

[Comparison](http://127.0.0.1:19165/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r8/comparison.html), [Village demo](http://127.0.0.1:19165/r8-demo.html), [separate combat origin](http://127.0.0.1:19166/r8-combat-demo.html). Demo launchers seed only their own empty origin. [R7](http://127.0.0.1:19163/docs/gm/dispatch/ui-foundation-2026-10-15/evidence/parity-r7/comparison.html) remains unchanged.

## Parallel incorporations from UI_SOURCING

Weibao's later direct request authorizes parallel work and supersedes the earlier no-additional-worker limit for these bounded lanes. Source document recommendations remain evidence, not accepted product decisions. Both workers were read-only except their distinct report/patch paths; neither changed runtime or launched browsers.

| ID | Evidence and disposition |
| --- | --- |
| A1 | [MR2 recipe legibility](parallel/RECIPE_LEGIBILITY.md): ACT NOW candidate. Existing native recipe projections already contain have/need, blockers, station, success, output and XP. An [unapplied original patch](parallel/recipe-legibility.patch) labels the ratio and permitted attempt count. It invents no capacity or exact busy/reservation reason. Application check passed; runtime/browser behavior is not claimed. |
| A2 | [Climb/Factorio known-use and return](parallel/KNOWN_USE_RETURN.md): implementation-ready passive reference proposal. Requires actual held input, positive acquired/held output, unlocked existing recipe row and complete ingredient knowledge before exposing a full quote. No hidden counts, new catalog/controller, remote station or execution from inspection. |
| R2 | ACCOUNT FOR NOW: a zero-count native item-log object is weaker than positive acquisition. New references need the stricter positive/held check; no global engine semantics were changed. |
| R3 | ACCOUNT FOR NOW: native Crafting close can retire an active native work view. First implement passive reference; station-follow remains a separate continuity check in the existing owner. No work/controller rewrite is selected by the research. |
| L1 | LATER: arbitrary reverse-use graphs, reminders, pinned-reference rails, capacity projections and multi-job dashboards. The current recipe/inspector journey must justify each addition. |

The remaining authoritative acceptance gate is Weibao's visual/play judgment. Technical proof supports only its recorded slice; the parallel proposals have not been silently promoted to implemented or accepted features.

Delivery check:18 comparison pairs and all images load; native-pixel mode and zero page errors verified. Final comparison visibly opened and retained in IAB tab4; R7 remains in tab3.
