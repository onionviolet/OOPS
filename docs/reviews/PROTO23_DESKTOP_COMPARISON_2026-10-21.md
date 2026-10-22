# Matched Proto23 desktop comparison and fitting OOPS repairs

## Task contract

Weibao: “Do the matched desktop comparison with Proto23 and fix the remaining UI gaps that fit OOPS, using the latest combined app, areas of improvements and little details and more? like the donate thing and the cat and more? We can refer to base game source code”.

Primary target1920×1080, comparison1800×1040 and1536×864, actual14/21px text. Compare launch, idle/place, populated inventory/equipment, crafting, combat and reports. Preserve OOPS's top navigation, explicit actions, known-fact disclosure and many-world design under UR49. Mobile, new simulation mechanics and publication are deferred. Human taste remains separate.

Rules: AD6–8/32/34/36/40/41, UR1–17/21–49/59–64; AR3/4/8/16. [Player UI](../../.claude/rules/player-ui.md), [architecture](../ARCHITECTURE_RULES.md). Surface homes: existing launch threshold, Menu/settings links, belongings, contextual Focus/task and Reports. Presentation reads existing owners and commands; no new save or simulation authority.

Primary source remains the implementation home. Starting HEAD e1a68873d; existing home/field and shared generated changes are preserved. This task reserves its new comparison runner/report and narrow, identified presentation hunks after comparison. Use a frozen copy of current tracked and untracked combined runtime plus private local fonts for clean builds, because primary contains concurrent changes and generated artifacts. No private player save or source-shared save is used. Source-lab grants are DEV SEEDED, not natural progression.

## Status

Technically delivered: fitting repairs are in primary source, and the frozen combined candidate has passing browser, native Electron and required completion checks. Use the review links below while later home/freight writers continue. Human visual acceptance remains open. No commit or push performed.


## Source and matched evidence

The current official [Proto23 source](https://github.com/23html/23html.github.io/blob/main/index.html)
was retrieved read-only and has SHA256
`a43e55e2eeb455f1c1ae589e3fc074a588813fe6cd57cfba827dcf923f3755d5`,
matching the existing pinned source/lab. The current [base YAIR index](https://github.com/miktaew/yet-another-idle-rpg/blob/master/index.html)
has SHA256`e21ad9de202d3e2e8cfbc9a88856faecbf6973d9deb28000e907f7ea46804c02`.
Its author cat and original donation destination were inspected. Original source
bytes and download receipts remain in ignored research storage; no source game
functions or assets were copied into runtime.

The [matched comparison](proto23_desktop_2026-10-21/final/comparison.html)
contains six task pairs at each of six size/text combinations: idle/place,
inventory/equipment, crafting, combat, reports and Menu/settings. A pair names
its actual reference scene and different progression/items. Proto23 uses its
native renderer and original actions after explicit lab grants, including native
Easiest combat selection. OOPS uses a disposable mid fixture with crafting/food
prerequisites, then actual equip, craft and travel/fight commands. The original
source lab's0.8 transform is removed, source fixed coordinates retained, and its
requested MS Gothic supplied locally at matching14/21px. The earlier source-only
host fallback captures in before/ are not the typography comparison authority.
Neither source fixtures nor the OOPS seeded journeys are natural acquisition.

## Findings and repairs

| Code | Before | Current treatment / reason |
| --- | --- | --- |
| F1 | In-game Ko-fi icon says “Support me” but pays Miktaew; original game links only appear before PLAY | Name the original author explicitly, label OOPS's repository, and expose the two original games/Proto23 source through existing Menu. Keep original recipient and creator identities. Launch keeps Miktaew's cat and onionv's edited guinea pig. No verified Proto23 donation destination was supplied by the inspected source, so none is guessed. |
| F2 | A wrapped Menu toolbar remains30px high, overlapping help/source icons. A wider menu can also extend outside the viewport because placement uses requested width | Use its real wrapping height, readable text-role links, and actual rendered width for shared popup placement. Native Esc/focus/commands remain. |
| F3 | Luminous disabled skin draws repeated dashed frames around unavailable recipes even though they remain inspectable; category strip wraps at21px | Remove inspectable recipes from the disabled selector, use quiet hairline rows and retain keyboard focus/known blocker detail. Category peers stay on one scrollable strip; availability, costs and crafting remain native. |
| F4 | Household has real known Moss state/history but a lone generic paw marker | Show a small static cat expression from known mood beside existing posture, bond and history. Keep the actual native meet/pet/play controls and no presentation-generated reward. |
| F5 | Laptop21px encounter milestone values can push counts beyond their panel; inventory purse is clipped beside tools | Bound both encounter columns and wrap long values. Let inventory header peers wrap and retain native money text. Actual values and knowledge remain with their owners. |

## Kept OOPS differences

- **D1:** responsive usable desktop space and persistent navigation, rather than
  Proto23's fixed-coordinate unused desktop area and universal four-stat layout.
- **D2:** selected stable item inspection plus explicit native commands, preserving
  work/combat context, rather than making reading an item perform an action.
- **D3:** richer real body/gear/station/world facts and observer-safe appraisal,
  with additional known detail behind existing controls. No invented global rank,
  undiscovered placeholder unlocks or copied source-world laws.
- **D4:** the full-height Reports stream, native public combat comparisons and
  OOPS's actual costs/crafting model, rather than copying source numbers/pacing.

These implement UR49, not a claim of literal pixel or whole-game parity.
[Palette fold PDC1–PDC5](../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#matched-desktop-detail-round-2026-10-21)
retains the small-detail considerations and optional later cue work.

## Input and process boundaries

The combined snapshot includes the initial current home/field/weather source,
not just committed master. During this pass other chats advanced home-building,
freight and staffed-home work. Those active scopes remain with their owners;
this UI pass does not certify their later edits or overwrite their generated
artifacts. The final input identity and own-source parity distinguish those
changes from this task.

One build was mistakenly invoked in primary. The exact prior bundle/map and
notice bytes were recovered from the preceding field delivery candidate and
verified against PRIMARY_DELIVERY's full hashes. Only generated index tokens
were restored; authored concurrent markup was preserved. The accidental build
and restoration receipt remain private. Subsequent builds use the isolated copy.

Earlier comparator failures were harness issues: wrong Menu ID, a missing craft
discovery prerequisite, checking the old hidden combat host, and a closed home
disclosure after reload. Final scenarios use actual rendered owners, explicit
prerequisites and the real home disclosure. The menu width and encounter value
problems above were actual presentation defects found by the comparison.


## Completion evidence

| Check | Result and exact boundary |
| --- | --- |
| Build and source identity | `npm run build` passes in `/tmp/oops-proto23-desktop-20261021-final`. All693 project modules embedded in the rebuilt sourcemap match disk. [Final input identity](proto23_desktop_2026-10-21/final-inputs.json) records bundle/source/style/test hashes, own-source parity and later concurrent differences. Authored primary index and all nine owned runtime/style files match the tested candidate; cache fingerprints differ because primary generated files were preserved. |
| Full suite | `npm test -- --test-concurrency=2`:2486/2486 pass, zero failures. [Log](proto23_desktop_2026-10-21/tests.txt). The later count-label wrapping refinement is CSS-only; unchanged runtime evidence is reused under AD36, with the affected final browser and focused checks rerun. |
| Focused checks | UI contract, crafting detail and household scene:6/6 pass. [Log](proto23_desktop_2026-10-21/focused.txt). No gameplay or save schema was changed. |
| Architecture and rules | Architecture passes with main10275/baseline10310, display6713/baseline6767 and save310/baseline310. Primary rules pass with one existing untracked-home-checkpoint warning. Candidate rules pass with110 untracked warnings because the isolated copy has no Git index. Rule-behavior36/36 passes after AD40 direction routing. Logs are adjacent to this report's evidence. |
| Matched browser | [Final receipt](proto23_desktop_2026-10-21/final/receipt.json): six reference cases and six OOPS cases across1920×1080,1800×1040,1536×864 at14/21px. Native equip/craft/travel/combat, real reports, Menu link focus/safe targets, current encounter values and purse containment pass. Launch keeps the original PLAY route and creator signatures. Native meet/history and Save/reload retain Moss without an inspection mutation. Zero page errors. |
| Native Electron | [Six-case receipt](proto23_desktop_2026-10-21/electron/receipt.json): actual local bitmap font rendering, equip/unequip/reload, equipment classification/focus, Body/action/price containment, native chest deposit/withdraw and native work/cancel pass. Zero page errors. Runs are hidden and use disposable profiles. |
| Comparison viewer | [Viewer receipt](proto23_desktop_2026-10-21/final/viewer-receipt.json): all36 task/viewport/text selections show exactly one paired comparison with zero page errors. Full-size screenshots open independently. |

The first full-suite attempt exposed omitted `tools/` and package-lock test
inputs in my isolated copy, plus an old weather VM oracle copied while its owner
extracted the calendar. Restoring those dependencies and the owner's current
oracle resolved those harness/input failures. No unrelated gameplay fix or
timeout change was made. Earlier diagnostics remain dated evidence, not current
failures or passing completion results.

## Review and remaining gate

[Interactive comparison](http://127.0.0.1:57451/review/comparison.html),
[playable frozen app](http://127.0.0.1:57451/),
[comparison screenshot](proto23_desktop_2026-10-21/final/comparison-viewer.png).
The review server's PID is29587; tool session38004. It serves the frozen candidate,
not primary's changing files.

A separate native Electron review is open at1800×1040/21px with Menu's creator
links visible. It was shown inactive, without taking foreground focus. The
[review window record](proto23_desktop_2026-10-21/review-window.json) records
Electron PID29692, runner PID29687 and its disposable profile; stop those owned
processes by PID when review is no longer useful. [Native review screenshot](proto23_desktop_2026-10-21/native-review.png).
Personal saves and existing player windows were untouched.

The remaining authoritative gate for this UI treatment is Weibao's visual/play
judgment. Natural acquisition/pacing is not established by seeded comparisons.
Later home/freight extensions remain their own active work. Mobile, exact raster
equality, a guessed Proto23 donation recipient and new cat mechanics are not
completion requirements for this slice. No commit, push or deployment.


## Main Electron integration follow-up, 2026-10-21

Weibao requests full integration into the main Electron app, coordination with
other chats to include the latest combined work without loss, visible delivery
verification, and an inventory-overhaul assessment. This supersedes the prior
frozen-preview-only delivery boundary. Local main-app build/snapshot integration
is authorized; commit, push and public deployment remain outside this request.

I own combined generated outputs and normal Electron snapshot delivery. The
home chat released its completed building/weather/staff slice and exact extension
manifest while moving its newly requested household/family slice into isolation.
The Minecraft chat owns its final MF26–29 smoke and release. The book-world chat
was asked to flag runtime ownership; its separate analysis is not an assumed
runtime feature release. Preserve all uncommitted source, documentation, private
fonts and old generated bytes. A captured released candidate is the installation
input; later active work must not be read midway into a release.

Desktop targets and prior UI acceptance boundaries remain. Verify the normal
frozen-build path, its actual served bundle/font/UI, upgrade and restart in a
spare profile, then publish the verified snapshot to the real normal profile.
Never inject a fixture or import a save into the normal profile. Inventory review
uses declared crowded test stock and existing known/native transactions; it does
not turn this integration into an unrequested universal inventory framework.

### Combined release delivered to normal Electron

The Minecraft chat released its final candidate and generated ownership through
[ROUTES_RELEASE.json](../gm/dispatch/minecraft-fit-2026-10-21/ROUTES_RELEASE.json).
It includes the completed home/building/weather/staff slice, MF26–32 and all nine
UI-owned files plus authored index. Their exact source/style parity was checked;
709 embedded source modules match and1273 captured inputs matched at installation.
The book-world chat's concurrent contribution is analysis rather than an assumed
new runtime release. The home chat's later family/staff-agency request proceeds
separately and was explicitly excluded from this already released snapshot.

**D1, installed:** the normal Electron profile now serves frozen build
`v0.6-4814a7dba61d`, bundle SHA256
`0d46cb10fefdafe05dbbfda3e61bf7e09f98c491002f6b81168c7a1b1d7234fd`.
[Main receipt](proto23_desktop_2026-10-21/integration/main-receipt.json) verifies
actual Electron userData, app:// origin, snapshot root, served bundle and visible
window. The normal profile did not previously exist. No personal save was read,
imported or injected; PLAY was left for Weibao. Main Electron PID41724, runner
PID41722, tool session43307. [Visible main app](proto23_desktop_2026-10-21/integration/main-electron.png).

**F4, packaging defect fixed:** `desktop/snapshot.cjs` silently omitted linked
asset directories, including the isolated candidate's local private Gothic font
folder. It now freezes linked file/directory bytes, detects directory cycles and
keeps a frozen asset independent of later source changes. The focused regression
`node --test tests/desktop_snapshot.test.js` passes. No private font was staged
or published. The required font resources now exist in the82-file frozen build.

**D2, adoption/restart verified:** the actual native Save and reload control
adopted the exact release from the prior UI snapshot in a spare profile. Progress
survived adoption and a real Electron restart; both returned the expected serving
root/hash. CDP confirms actual custom `OOPS Gothic Bitmap 14` glyph rendering.
[Adoption receipt](proto23_desktop_2026-10-21/integration/adoption-receipt.json),
[runner](../../scripts/playtest/combined-electron-delivery.mjs).
One optional private-content manifest404 is expected when no private pack is
installed; no required asset is missing. The initial diagnostic font failures
were corrected by the packaging change before normal installation.

**D3, inventory coverage qualified:** the new
[inventory assessment](INVENTORY_OVERHAUL_ASSESSMENT_2026-10-21.md) distinguishes
existing tabs/search/counts, exact native commands, stable inspection/comparison,
loadouts and paired storage from remaining overhaul work. Six crowded native
cases use31 stacks, including29 distinct quality variants, on this exact frozen
release. Search29→1→29, last-variant inspection and no horizontal page overflow
pass with no page errors. At1920/1800/1536 widths, fully visible rows are24/23/17
at14px and7/6/5 at21px. [Receipt](proto23_desktop_2026-10-21/inventory/receipt.json).
The test is deliberately seeded; it establishes a dense-stock pressure case,
not natural acquisition, a finished expanded-workbench overhaul or full parity.

The unchanged released game reuses its2505/2505 suite, build,14 native journey
groups/seven exact persistence round trips and actual14/21px primary smoke under
AD36. The changed desktop packager receives its focused asset regression and
exact frozen adoption/restart checks. Current architecture, rules and36/36 rule
behavior checks pass; rules retain the existing untracked-home-checkpoint warning.
No gameplay/persistence schema changed in this follow-up. There is no remaining
technical normal-app delivery gate for this captured release. Human visual/play
acceptance, broader inventory overhaul and newer unreleased work remain distinct.
No commit, push or public deployment.

### Later household release adoption, 2026-10-21

The home chat subsequently released its newer household-life slice through
[FINAL_INPUTS](../gm/dispatch/home-system-2026-10-21/household-life/FINAL_INPUTS.json)
and [REPORT](../gm/dispatch/home-system-2026-10-21/household-life/REPORT.md).
Its source candidate `/tmp/oops-home-life-20261021` includes all nine UI-owned
files unchanged and the font snapshot fix, rebased on the prior combined game.
Its owner reports2511 tests,14 rebuilt browser groups and six exact persistence
journeys, with architecture/rules/36 behavior checks passing. Those unchanged
release-input checks are reused under AD36; this lane verifies app delivery.

The first72-file frozen candidate omitted10 previously installed optional local
content files. The game bundle itself matched the release; file-set comparison
caught the local-content omission. A delivery staging copy now combines that
exact released game with the unchanged optional files from the prior installed
snapshot. No private content, source, save or generated primary output was
modified to do this. [Delivery input](proto23_desktop_2026-10-21/household-integration/DELIVERY_INPUT.json)
records the two provenances. The original72-file install is superseded by this
preserved-assets snapshot, rather than counted as final no-loss delivery.

[Final spare-profile adoption/restart receipt](proto23_desktop_2026-10-21/household-integration/preserved-local-assets/adoption-receipt.json)
passes exact bundle/root checks, native Save and reload, retained progress,
Electron restart, creator links and actual custom Gothic glyph rendering, with
zero page or console errors. The harness's first preserved-assets attempt
incorrectly required an absent optional manifest; that assumption was removed
and the final scenario rerun. No gameplay fix was needed.

[Latest normal-app receipt](proto23_desktop_2026-10-21/household-integration/main-receipt.json)
records real native adoption in the existing normal Electron window and exact
served bundle `44b1a7f3202f1d32613f1b2015dd00e628f32d46e109241ca0b0f441cb1b80b7`.
[Adopted main screenshot](proto23_desktop_2026-10-21/household-integration/main-adopted.png).
Personal save bytes were not inspected or injected; the native control owns saving.
The normal PLAY route remains for Weibao. Inventory-overhaul status and human
acceptance remain as assessed above. No commit, push or public deployment.
