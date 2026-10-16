# UI foundation delivery

2026-10-15. **S1–S3 technically delivered in the shared working tree.** No commit,
push, installation or personal-save access. Branch `codex/gameplay-foundations`.
Calm-vivid and the parked creation-screen work are retained. The two baseline
test failures remain; Weibao's visual-feel acceptance is open.

Target: 1366×768, also 1440×900 and 1920×1080. Surface types: ambient log,
routine/place-service center modes, reference focus/scene, proposals drawer.
Mobile, world-start redesign and apothecary conversion are deferred.

## S1: recognizable return route and the log

**F1, Q6 corrected by Weibao:** “Wait I just found the button but it wasnt obvious
what it was so that is the issue.” The old Back button was among mixing actions.
The later placement correction supersedes the original top-left plan: one
left-aligned `← Village` destination control now lives in a **bottom bar outside
the scrolling mode content**. Esc follows the same route. Mixing keeps its name.
The old feature-specific mixing button was removed; covered native exit buttons
are hidden while the shared bar is active. Reading/sleep retain their native
stop behavior and explicit stop labels.

Before that correction, a separate overlap defect was reproduced using the
existing native Crafting entry point: open mixing, open native Crafting over it,
close native Crafting, reopen mixing and return, then reopen native Crafting.
Its category/exit children remained hidden and Esc did nothing. This is an
incidental regression case, **not a claim about what Weibao experienced**.
[Driver](repro.cjs), [measurements](evidence/s1-repro.json),
[before overlap](evidence/s1-before-overlap.png).

`src/center_modes.js` owns visibility/history; `src/display.js` cooperates for
dialogue, trade, crafting, storage, work, reading and sleep. Native commands still
own stopping work and leaving trade. `src/mixture_ui.js` no longer saves/restores
sibling display values. A stable `openMixtureCounter()` route also avoids a stale
launcher during native action-list reconstruction.

The four log intruders now register through `definePanel`: travelers, neighbors,
memories and world events, in their own center homes. The registry mounts detached
nodes at their declared home. New default layouts put Journal/Skills in center
and give Reports the tall right region. Existing saved layouts/dimensions win.
Filters remain in the log region. Final combat log heights: 491 px at 1366,
524 px at 1440 and 552 px at 1920, with combat messages and filters visible.

Paths: `src/{center_modes,display,mixture_ui,panel_kit,generated_people_ui,
life_record_ui,npc_lives_ui,event_feed_ui,workspace_state}.js`, the two native
registration-home hunks in `src/main.js`, and `styles/workspace.css`.

## S2: tokens and consistent components

**D1, shared skin:** `styles/ui_tokens.css` owns the square radius, 3 px dark
frame, horizontal fills, colored hairlines, lowercase letter-spaced panel titles,
three type sizes (12/14/16 px), normal/disabled controls, visible focus and hard
tooltip shadow. Vivid keeps its semantic color roles; Standard and actual custom
Appearance Apply/reload were checked. Rounded geometry is possible through the
radius token, rather than local per-file values. Existing stylesheets reference
210 centralized legacy swatches to preserve semantic/palette values while the
new frame applies across them. This is original CSS from measured values and
shape language; no Proto23 code or assets were copied.

**D2, font:** the default is `Hiragino Kaku Gothic ProN`, `Hiragino Sans`,
`PingFang SC`, `Noto Sans CJK SC`, `Noto Sans CJK JP`, `Yu Gothic`, `system-ui`,
`sans-serif`, in that order. It deliberately supports CJK beside Latin instead
of relying on the absent MS Gothic fallback. Explicit player serif/mono choices
remain available. New scene screenshots render 人 beside Latin names.

Local group summaries, info blocks and buttons now share the flat row grammar.
The clerk's disabled actions have concrete reasons; the shared component shows
owner-provided reasons inline. Mixing's cssText styles moved to shared classes.
Undiscovered reference tabs show `???????` without their real name and cannot
activate. This is a tab placeholder, not a new gameplay/discovery fact.

**V1, contract:** `tests/ui_contract.test.js`, its helper and exact-snippet ledger
check colors, font/radius declarations, cssText, and direct/aliased foreign-host
insertion. There are no file-wide exemptions. The ledger shrank from **469
entries / 638 occurrences** to **211 / 273** after S3. Token consumers and
remaining legacy inline/color cases are explicitly listed. It is a bounded
source contract, not a complete JavaScript ownership analysis.
[Before](evidence/contract-before.json), [S2 after](evidence/contract-after.json),
[final count](evidence/final-parity.json).

Paths: `style.css`, existing `styles/*.css`, new `styles/ui_tokens.css`,
`src/{ui_components,workspace_views,workspace_disclosure,customization_profiles,
component_themes,mixture_ui}.js`, `src/absorb_d/ui.js`, `index.html`, `build.js`.
The token stylesheet is fingerprinted by the build.

## S3: scene, focus, projects and traveler presence

**D3, observer-safe inspection:** `src/village_workspace.js` reuses
`projectVillageScene`'s title/clock/groups shape. Village shows place, season,
time, weather, people/thing chips and target-grouped existing actions. Selecting
a chip spends no time and consumes no random draws. Focus stays beside You
while the center scrolls. It follows an active conversation, native trade,
selected traveler/thing, or focused clerk control. People show known traits,
relationship and one received request-memory line. Unknown facts show `???`.
Enemy name, HP and stat text come from the native combat display; level/title
remains `???` where that display supplies none. There is no new simulation data.
Idle Focus is empty as specified; its space allocation remains a NAV/taste issue.

Village scene temporarily supplies the native location/time information while
their existing modules remain registered and their saved layout entries remain
intact. Outside Village those native modules return. Existing internal IDs stay.

**D4, declared Projects home:** `src/projects_drawer.js` holds Waypost supply
clerk, Mistglass conservatory, Meadow pen and Elemental preparation. Their owners
write to that home rather than fighting a mover that re-parents them every tick.
The drawer opens on request. Broader proposal/routine triage belongs to the
queued TRIAGE lane; world-start and beginning menus were not redesigned here.

**F2, callback fix:** `src/story_aftermath.js` now requires the receipt's traveler
to be present. A context-only `generatedPeopleFrame` bridges the existing
absolute-calendar visit schedule to each simulation boundary. Unknown presence
is not admitted. Departure/return boundary tests cover this, and an already-open
callback cannot grant its response while that person is away. A real native
delivery in the disposable fixture produced its receipt-backed callback after
120 actual engine ticks, with that traveler visiting. The localhost test hook
dispatches the existing engine timers; it is not a second simulation.

Paths: `src/{village_workspace,projects_drawer,causal_story_scenes,main,
story_aftermath,storylet_deck,simulation_effects,simulation,workspace_layout,
workspace_state}.js`, the existing proposal UI adapters, and focused tests.

## Later nav clarification and the queued NAV boundary

The foundation COMMON briefly assigned the new shared nav/history requirements
to this active lane. A bounded implementation was made before recovering the
newer owner/queue clarification: `src/workspace_navigation.js` provides named
routes, Alt hotkeys, a ? sheet, and a known-panel selector. Workspace panels can
borrow their original node into the center through `expandWorkspaceModule()`;
no clone, layout write or parallel command owner is created. Header Expand is
shared. The back bar names the previous view; scroll, groups and native tabs are
preserved in the exercised Inventory → Journal → Crafting → Journal → Inventory
round trip. Merely inspecting a panel or choosing Here does not stop reading;
the explicit stop Back does.

**R1, scope is still bounded:** the later
[composition clarification](../../../UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#proto23-baseline-clarification-2026-10-15)
and [queued NAV brief](../ui-triage-apothecary-2026-10-15/NAV.md) have now been read.
NAV owns the remaining reference-composition and UR21–UR33 completion pass.
This delivery does **not** claim all panels/routes, notices, long-list summaries,
unified header status/pin placement, quick jump or the complete scroll budget
are accepted or fully exercised. Preserve and review the actual shared APIs
above instead of creating competing versions.

## Checks and evidence

Counts overlap; do not add rows together.

| Check | Result | Evidence |
| --- | --- | --- |
| Baseline build/suite | Build passes. 1,761 total: 1,756 pass, two failures, three TODOs | `runs/baseline-build.log`, `runs/baseline-tests.log` |
| S1 build/suite | Build passes. 1,763 total: 1,758 pass, same two failures, three TODOs | `runs/s1-build.log`, `runs/s1-tests.log` |
| S1 native browser | Five groups pass: modes, queue/reload, saved layout/pin/collapse, Export/literal-file Import, combat/log filters | [results](evidence/s1-browser.json), [driver](check-browser.cjs) |
| S2 build/suite | Build passes. 1,765 total: 1,760 pass, same two failures, three TODOs | `runs/s2-build.log`, `runs/s2-tests.log` |
| S2 before/after desktop matrix | Nine groups each; opening, populated Village, combat, crafting and mixing at all three viewports | `runs/s2-before-browser.log`, `runs/s2-browser.log`, `evidence/s2-before-*.png`, `evidence/s2-*.png` |
| S2 style | Seven groups; 54 visible text contrast samples minimum 6.99:1, keyboard focus, Standard, custom Appearance Apply/reload, 150% viewport emulation | `runs/s2-style.log`, [driver](check-style.cjs) |
| Final build and suite | Build passes. **1,769 total: 1,764 pass, two baseline failures, three TODOs** | `runs/s3-build.log`, `runs/final-tests.log` |
| Focused source | 17 request/deck/controller checks; eight final UI/contract/controller checks, all pass | `runs/s3-focused.log`, `runs/final-focused.log` |
| S3 native browser | Nine desktop groups pass, including queue/reload, saved personal layout, actual Export/literal-file Import and combat log | [results](evidence/s3-browser.json), `runs/s3-browser.log` |
| S3 scene/story | Seven groups pass: zero-cost inspection; elder/traveler/clerk focus; native delivery/memory; present callback; four Projects homes; trade Esc; request/history reload and literal-file Import | [results](evidence/s3-scene-results.json), [driver](check-scene.cjs), `runs/s3-scene.log` |
| Bounded navigation | Six groups pass: page measurement, named history/tab/180 px scroll return, hotkeys/help, reading preservation, 125% and 150% text | [measurements](evidence/navigation-results.json), [driver](check-navigation.cjs), `runs/navigation.log` |
| Final style follow-up | Seven groups, 57 text samples minimum 6.99:1; same scoped palette/focus checks | `runs/final-style.log` |
| Byte provenance | 560 bundled source files match current disk; bundle and 12 stylesheet responses match disk | [parity](evidence/final-parity.json) |
| Diff hygiene | `git diff --check -- src style.css styles tests` passes | No unrelated reset, reformat, staging, commit or push |

The two baseline failures are both in `tests/cheat_awakening.test.js`:
`cheat awakening clock jump commits first message before live discovery and
retries failed storage` (`failed.attempts > 0`), and `cheat awakening does not
mistake a partial enemy kill for a won fight on load` (undefined `card`). They
were reproduced before this lane's source edits and are not newly introduced.

Early driver failures are retained as historical diagnostics: an interrupted
server, a fixed-delay import race, initial focus visibility, and a transient
detached mixing launcher. The final logs/results above supersede those failure
files. Import now waits for the actual reload; mixing navigation uses its stable
owner API. Two tiny DOM fixtures were adapted to the new registered/sibling homes.

## UR14 screenshot and scroll assessment

[Populated 1366×768](evidence/ur14-populated-1366.png),
[mixing and destination bar](evidence/s3-mixing-1366.png),
[combat](evidence/s3-combat-1366.png),
[elder focus](evidence/s3-elder-focus.png),
[traveler focus](evidence/s3-traveler-focus.png),
[Projects](evidence/s3-projects.png).
All five main states also have 1440 and 1920 images under `evidence/s3-*`.

Agent screenshot review: the return is an arrow plus its destination in the
bottom bar; current work is a separate explicit line; the routine entry buttons
and persistent named nav identify the main actions. This is an evidence-based
layout review, not first-time human usability or taste acceptance.

Page `scrollHeight` is **768 / viewport 768**, including the larger-text checks.
Ordinary populated column heights were 680 px with content heights left 1,845,
center 1,103 and right 1,348. Belongings was 240 / 874 px, scene 220 / 285, and
Local actions 145 / 449. Some normal columns and panel bodies therefore still
both overflow. Expanded center content has an independent scroll area and its
return bar stays outside it. **Full one-scroll-owner/routine budget compliance is
not claimed.** NAV must consolidate duplicate shells/scene entries and finish
the larger composition/scroll pass using the measured baseline, rather than
treating this square skin as the final Proto23 composition.

## Compatibility decision and remaining gates

**D5, no save-schema change.** Navigation, focus, scroll snapshots and expanded
views are ephemeral. `generatedPeopleFrame` exists only in simulation contexts;
it is not serialized. Existing layout schema/version, IDs, dimensions, pins,
collapse states, Appearance choices and gameplay envelopes are retained. New
panel IDs get registered defaults. Unknown/missing visitor presence suppresses
new callbacks; old open callbacks retain their saved receipts but their actual
response waits for that traveler to return. No traveler, reward or history is
invented to make an old callback actionable.

**R2, open human gate:** Weibao's visual-feel and first-time discoverability
acceptance. **R3, queued work:** NAV composition/remaining navigation/scroll
rules, then TRIAGE and APOTHECARY in their existing order. Quick jump, migration
notices/destination dots and broader header/list polish remain there. Mobile and
real browser zoom were not tested. Contrast checks are spot checks, not a
whole-game accessibility audit.

Play preview: <http://127.0.0.1:19115/>. It serves the rebuilt working tree;
synthetic fixtures live only in disposable test contexts/evidence. The server
may remain for review. This lane stops after S3 and releases shared source
ownership to the existing queue; no successor is launched here.
