# UIL8 report: stat tiers, weather and Condition, 2026-10-18

UIP2, UIP3 and the first UIP5 slice from [Round 2](surface-manifest-and-ui-flow-2026-10-18.md#round-2-adjustable-panels-stat-sheet-and-splits-2026-10-18). Required technical checks pass on the frozen UIL8 candidate; Weibao's visual acceptance stays open (UR16). No commit or push authorized or made.

Rules: UR13, UR26, UR35, UR36, UR37, UR43, UR46, UR47, UR52, UR58; AD36, AD38; AR1–AR16. Targets: parity shell at 1920×1080 primary and 1366×768 floor, each at 14px and 21px. Mobile and classic changes deferred (GU5). Inventory and global row/column sizing are outside this lane.

## Reproduced before editing

The rebuilt initial-source screenshot at 1920/14 shows zero HP/s, stamina/s, HP %/s and stamina %/s beside neutral Hits/atk and Unarmed values. Cold Δ occupies the second secondary slot despite the weather being comfortable. At 1366/21, height fitting hides some lower rows but retains Cold Δ. Effects use a button inside You, with its native tooltip; temperature is a small place-header badge, whose title contains the native tolerance breakdown. There is no independent Condition panel.

Before images and public DOM readings: [`../evidence/uil8/`](../evidence/uil8/) (`before-{1920,1366}-{14,21}.png`, `before.json`). The before build is a scratch copy of the actual initial source, not the prebuilt bundle. It predates concurrent UIL7 source changes; before/after global geometry therefore includes that parallel lane and is not attributed solely to UIL8.

## Matched screenshot entry points

| Target | Before | After |
| --- | --- | --- |
| 1920×1080, 14px | [You/weather](../evidence/uil8/before-1920-14.png) | [You/Condition/weather](../evidence/uil8/after-1920-14.png) |
| 1920×1080, 21px | [You/weather](../evidence/uil8/before-1920-21.png) | [You/Condition/weather](../evidence/uil8/after-1920-21.png) |
| 1366×768, 14px | [You/weather](../evidence/uil8/before-1366-14.png) | [You/Condition/weather](../evidence/uil8/after-1366-14.png) |
| 1366×768, 21px | [You/weather](../evidence/uil8/before-1366-21.png) | [You/Condition/weather](../evidence/uil8/after-1366-21.png) |

Each target also has `-nav`, `-pinned`, `-meal`, `-moved`, `-warm` and `-wet-cold` images in that folder. [`after.json`](../evidence/uil8/after.json) contains the public DOM assertions, errors and change-reader state.

## Implemented

| Code | Result and owner |
| --- | --- |
| I1 | `proto23_shell.js` retains vitals/core attributes and filters secondary rows by native neutral values. Zero rates, ×1 factors, one hit/attack and unarmed base 1 hide. A non-neutral Active effects contributor keeps a row visible even when its total cancels back to neutral. Rates move to Condition. Keyed nodes preserve a focused/inspected row until the interaction ends. No height-based removal of relevant rows |
| I2 | Attributes retains every supported native row and modifier explanation. Each secondary row offers Pin/Unpin. `panel.shell-character.pin.<id>` uses existing `yairpg.display.v1` registration, display export/import and browser reset. Pins follow this browser across game imports, not a character/world save. Missing imported preference keys default off; unavailable stats remain explained in Attributes instead of fabricated. No new game save slice or migration |
| I3 | `display.js` publishes public weather metadata beside its existing temperature output, including the actual optional-weather offset and native tolerance. `condition_facts.js` reads it using the native cold-counter owner's inclusive comparison (`temperature + tolerance <= cold_status_temperatures[0]`). This differs at exact equality from the old display's strict comparison, which is unchanged for classic. No extra comfort scale. The header says comfortable or cold, adds a labelled Cold exposure chip, and shares the native tolerance breakdown in a bounded hover/focus/click card |
| I4 | `condition_panel.js` registers Condition through `definePanel` and existing workspace registry. ST6 reference surface, `reads: [body,time,place]`, route Condition / Alt+O; a movable companion with default home below You. Body reads native profile fields, excluding tooltip prose. Effects reuse native descriptions and the existing inspection card. Visible native recovery components use the native /s convention, without inventing combined net recovery. The panel subscribes to the change signal and bridges legacy body/weather nodes; no new clock, timer, gameplay state or save writer. The existing shell render remains a refresh fallback |
| I5 | One browser-owned first-appearance reminder explains where effects/body/temperature/rates went and marks the nav home. Reset display settings re-arms it. `LAYOUT_SPEC` adds only Condition's region/order, box, surface and route plus support for a companion's declared default home. No spec bump: existing placement IDs and version 2/3/4 reading remain compatible |

## Source release for A1/A2, 2026-10-18

**RELEASED:** `src/proto23_shell.js`, `src/village_workspace.js` and `styles/shell_chrome.css`. UIL8 source edits are stable; no further edits to those files are planned. The frozen `/tmp/uil8-candidate` owns final UIL8 browser proof while A1/A2 may add their import/mount/render/destroy hooks to the live files. Preserve the UIL8 stat-tier, pin, Condition and temperature hunks. Their later integration needs its own build and affected checks; UIL8 proof does not certify later edits.

Exact released source hashes are in [`../evidence/uil8/input-identity.json`](../evidence/uil8/input-identity.json), with the final candidate bundle and shared-checkout comparison. `condition_panel.js` and `condition_facts.js` are the new owners; reuse them instead of copying weather or visibility logic. The new weather anchor is `[data-context-preview=temperature]`, and visible secondary/rate rows expose `[data-attribute-preview]`. Condition's route ID and panel ID are both `condition`. A1 may hook You from the existing shell mount; A2 may add nearby-list/detail behavior around the stable weather-header hunk.

## Shared ownership

Weibao explicitly approved a two-line `workspace_layout.js` compatibility exception during this chat: the automatic Move to selection honors a companion's `home`, and generic companion headings retain their declared title instead of being called Skills. These are UIL8 hunks in the same file as UIL7's independent resize hunks. Preserve all of UIL7's edits. `shell_composition.js`, `shell_layout_edit.js` and resize code were not edited by UIL8. One panel-local You flex rule avoids the old flex filler separating Condition from its sheet; global sizing remains UIL7's owner.

`src/display.js` has one public read-model assignment in the existing temperature owner and clears it when native weather yields to a display-only local climate. The classic rendered temperature and simulation comparison are untouched. `main.js` is untouched by UIL8. No new import of main or cycle (`check:arch`).

## Checks and acceptance

Focused checks: `node --test tests/condition.test.js tests/layout_spec.test.js tests/ui_contract.test.js`: 19/19 pass. Covers neutral filtering, cancelled effect contributions, pins/import/reset, native inclusive cold threshold including a +3 tolerance example, Condition reads/route/home and Move to/reset. Updated old route/order expectations for the new panel, preserving concurrent UIL7 tests.

| Check | Result |
| --- | --- |
| Focused Condition/layout/UI contract slice | 19/19 pass |
| `npm test` | 2148 tests: 2145 pass, 0 fail, 3 existing TODOs |
| `npm run check:arch` | Pass; no new main import or cycle. Existing baseline: 7 main imports, 297 cyclic edges |
| `npm run check:rule-behavior` | 36/36 pass |
| Final CSS-only follow-up: `node --test tests/ui_contract.test.js` | 3/3 pass; relevant runtime inputs of the full suite were unchanged, so the full suite was not repeated for the text-size/weather-spacing CSS fixes |
| `npm run build` and isolated candidate `node build.js` | Pass; shared and candidate runtime bundles matched byte-for-byte at the recorded freeze. Source-map hash differs because the scratch build has different source paths |
| `R4_URL=http://127.0.0.1:19190 node docs/gm/dispatch/ui-foundation-2026-10-15/check-uil8.cjs` | Pass, all four desktop/text targets and all eight warm/Wet-cold cases; zero page errors |
| `git diff --check` on task paths | Pass |

Browser harness: [`../check-uil8.cjs`](../check-uil8.cjs). Each target gets a fresh browser context and the existing populated fixture, paused through the existing test hook. Final evidence comes from the isolated rebuilt candidate so parallel writers cannot change a page between reloads. The final target matrix asserts Condition's computed text size is exactly 14px or 21px.

| Code | Browser result |
| --- | --- |
| V1 | No neutral recovery rows or Cold Δ in the everyday You sheet. The fixture's non-neutral stamina-efficiency and learning multipliers remain. Core rows and native vitals remain. Before/after screenshots at all four targets |
| V2 | Pin HP %/s at 0 through Attributes, save/export, reload and literal game import: retained. Export layout/display configuration, unpin, import that configuration: pin restored. Unpin again, reload and literal game import: remains unpinned. No character/world save slice |
| V3 | Inspect Fresh bread and press its actual parity Use command, which delegates to the native command. Native Basic meal becomes active; stamina recovery appears at 0.5/s in Condition. Native effect names and descriptions are readable by keyboard focus. No hidden native DOM control was invoked to bypass the player route |
| V4 | Temperature focus and click open the shared bounded card, with native tolerance and breakdown; Esc dismisses without changing the clock. Alt+O opens the registered Condition view with shared navigation and returns on Esc. Real Layout → Edit layout → Condition Move to shows Top left, moves to Beside the actions, then back to Top left, at all four targets |
| V5 | At each target, the same native clock is comfortable at 14.7°C with +1 tolerance, then cold with restored native Wet (tolerance −4). Header and Condition agree with `temperature + tolerance <= 14`, with a text-labelled Cold exposure chip only in the cold case. The chip warns about exposure; it does not claim an immediate named Cold debuff or immediate recovery of an existing one |

The first harness attempts caught harness-only mistakes: reading center mode from the wrong node, opening a Layout disclosure without the enclosing Menu, and attempting to click the intentionally hidden legacy Use control. Those were corrected to the actual visible parity routes. A complete first matrix passed; final visual inspection then corrected Condition's inherited 14px text and bounded the longer weather group so the calendar retains space. The final matrix repeated on that corrected candidate and passed.

Input identity: HEAD `5976bf3d3d77034cfe01b94a5e89506ac6af2509` plus the dirty-file hashes in [`input-identity.json`](../evidence/uil8/input-identity.json). Candidate bundle SHA-256: `fa218831416df6ebb1c8874a004cb65a795f059b9f73937a5194565ddbbd031c`. These results include the concurrent UIL7 implementation present at the candidate snapshot; later A1/A2 integrations need their own affected checks.

## Remaining review boundaries

At 21px, lower You controls can require the sheet's existing inner scroll. The Stats navigation remains reachable and opens every attribute, and all tested pin/inspection routes succeed. Screenshot geometry and passing assertions do not settle visual feel (UR16). Condition is a compact native reference surface: broader body conditions and care actions retain their existing owners; they were not duplicated into a new simulation. No mobile, classic visual-parity, other-world climate or future tolerance-model claim is made. Native warmed +3 tolerance is covered as a comparison unit case; the actual browser effect transition used Basic meal instead. The exact equality case is unit-tested, not induced through a native weather journey.

Visual acceptance stays OPEN. This is a first Condition surface, not a new body-health model, heat/altitude/mana-density model or future inventory split.

At final report time, the released live `proto23_shell.js`, `village_workspace.js`, `workspace_layout.js` and generated build files had changed under parallel integration. The original released hashes and `liveAfterReleaseDifferences` are preserved in the identity record. No UIL8 passing result is claimed for those later integrations; their coordinator owns rebuilding and verifying them. UIL8 hunks remain present in the released files.


## Round 2: alignment, single homes and status effects, 2026-10-18

**Source edits complete and released again after this correction:** `proto23_shell.js` (You tools and shared inspection), `village_workspace.js` (weather/header only), `condition_panel.js`, one effect-ID metadata line in `display.js`, and related `shell_chrome.css`. Preserve integrated A1/A2 work. No branch, commit, push, gameplay or save-schema change. Targets remain 1920×1080 and 1366×768, 14px and 21px; mobile deferred. Rules UR6, UR13, UR14–UR17, UR26, UR35, UR37, UR43, UR46–UR47, UR52, UR58, AD7/AD36 and AR1–AR16.

Weibao's request is recorded in [USER_VISION](../../../../USER_VISION.md#you-controls-weather-and-status-effects-2026-10-18). The previous comparison showed misaligned/clipped Attributes/Gear, temperature/comfort repeated in Condition and the place header, weather text on unequal control boxes, and effect names repeated in a summary plus an Effects button. Before images from the current A1/A2-integrated source are in `../evidence/uil8/r2/before-*.png`.

More-to-consider pass, limited to this correction:

- **ACT NOW / C1:** one aligned Attributes/Gear row in You; use the existing `data-fit-clip` seam and the measured core/control minimum. At constrained sizes, whole secondary rows yield with an explicit Attributes count; pins receive first available positions. Do not change global column/row sizing. This supersedes the first-round no-height-fitting behavior.
- **ACT NOW / C2:** ambient weather and native exposure warnings have one everyday home, the place header. Its place/weather row and calendar/navigation row use their own content flow, so long comfort text does not squeeze the date into a narrow column.
- **ACT NOW / C3:** Condition has one native status list, with each admitted effect's name, duration and supplied Buff/Debuff/Condition kind. Each is keyboard-inspectable and click-pinnable; the existing native description supplies modifiers. The default reserves room for up to three simultaneous effect rows before optional numeric rows; larger lists remain scrollable/expandable. The header reports the count without repeating names. Body and relevant recovery rates retain their home; no repeated ambient weather or second effect-name summary.
- **ACCOUNT FOR NOW / C4:** a lingering Cold effect is not the same fact as current cold exposure. Comfortable weather must not erase it. Native durations remain on the native clock; an inspected expired row remains marked Ended until the player leaves it, preserving focus/inspection through expiry. Do not invent source, stacks or severity the native public projection does not supply.

Chosen checks before completion: existing Condition/UI contract/Village tests, full suite, architecture and rule-behavior gates, rebuilt fresh-origin four-target browser assertions for alignment, clipping, weather deduplication, mixed buff/debuff names/durations, pinned inspection and native ticking/save/reload. `check-uil8-r2.cjs` owns the new browser journey. Final verification:

| Check | Result |
| --- | --- |
| Focused Condition/UI contract/Village tests | 10/10 pass, repeated after the final whole-row fitting correction |
| `npm test` | 2152 pass, 0 fail, 3 existing TODOs (2155 total). The final fit-only correction reused unchanged domain-test evidence, followed by the final focused checks and native browser matrix |
| `npm run check:arch` | Pass; 7 existing main imports and 297 existing cyclic edges, no new edge/import |
| `npm run check:rule-behavior` | 36/36 pass |
| Rebuild | `npm run build` passes |
| `check-uil8-r2.cjs` at fresh browser contexts | Pass: four neutral targets, four simultaneous Basic meal/Wet/Cold targets, two warm-but-still-Cold expiry targets. All at the requested 1920/1366 widths and 14/21px text; zero page errors |
| Whitespace and shared-doc preservation | Task-path `git diff --check` passes; this correction only adds shared-doc paragraphs, preserving the pre-existing dirty state |

The browser assertions compare Attributes/Gear top edges and heights, require both controls to fit inside You, require the calendar to remain one line and weather labels to align, and reject any temperature/comfort repetition in Condition. All three native effect rows fit without scrolling at all four targets, including 1366/21. Each row retains native duration, kind, keyboard/click inspection and its DOM identity through a real native clock tick. Save/reload retains the native effect projection. An inspected Cold effect that expires remains labelled Ended until the player leaves it; comfortable weather does not erase a still-active Cold effect. Shared pinned inspection dismisses on Esc without changing views or making a gameplay command.

Evidence: [`r2/after.json`](../evidence/uil8/r2/after.json), [`r2/input-identity.json`](../evidence/uil8/r2/input-identity.json), and images `before-<width>-<font>.png`, `after-<width>-<font>.png`, `effects-<width>-<font>.png`, `inspect-<width>-<font>.png`, `ended-<width>-<font>.png`. These before/after inputs include the already-integrated A1/A2 leaf work; no A1/A2 files were edited here. One initial UI-contract failure came from the parallel nearby leaf's `font-family:inherit`; that owner corrected it to `font:inherit`, and final checks pass. The first baseline page raced readiness once; a direct boot diagnostic showed hooks/navigation available without page errors, then the four-target baseline was recovered. One tooltip assertion was corrected to the native wording Cold resistance rather than inventing a renamed modifier.

Classic display, native effect mechanics and save schema remain unchanged. Body and rate details can require Condition's inner scroll when many effects are present; navigation/Expand opens the complete registered view. The new priority is an ordinary display default, not a cap on active effects. Visual acceptance stays OPEN (UR16). No commit or push. Source files are released again; any later integration needs its own affected checks.
