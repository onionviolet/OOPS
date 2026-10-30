# UI rules

Standing rules for every agent that adds or changes player-facing UI. The look itself (identity, what every feature UI meets, the per-world contract) is owned by [DESIGN.md](../DESIGN.md), DSG1-DSG19; these rules are its mechanics. Weibao, 2026-10-15: "save logical rules to address these and more so similar mistakes wount be made again?" Each rule names the mistake it prevents. Accepted direction lives in [PROJECT](../PROJECT.md#standing-priorities-and-document-authority) and [USER_VISION](USER_VISION.md#format-portraits-and-view-decisions-2026-10-14); detail lives in the owners linked below. These rules are defaults with reasons; a world or feature can propose an exception, but it has to say why.

**Reading order (tiering, Weibao 2026-10-30; no rule text changed, [audit](audits/RULES_RECONCILIATION_AUDIT_2026-10-30.md) L1).** Read first, for every UI task: the checklist, the bounded-journey section, Descriptions, Before you build, While you build, Before you call it done, Getting anywhere and For coordinators (the sections from here to "Proportions"). Read by trigger: Proportions, Structural parity and Contextual navigation when layout or hierarchy changes; the Discord reference guide (UR59-UR64) when a design follows a reference; Craft 1 evidence for crafting surfaces; Scene and report rules (SUI, RPT) for scenes, travel, choices or Reports lines. Default: a lane reads the first tier plus its triggers. Dial: a coordinator or a full UI audit reads the whole file. Reason: most of the file applies only on a trigger, so reading it all on every task costs about 5,000 words.

## Checklist for a small fix

Proposed, in use as the default (CHOICES item 4, 2026-10-30, [packet](audits/UI_RULES_ACCEPTANCE_PACKET_2026-10-29.md) P14). Every code below keeps its wording; a lane brief for a small fix may cite this list alone. Default: read the line for your task, then the codes it names.

- Where does it go? UR1-UR5, UR76-UR79 (before you build, below).
- Colors, sizes, spacing, controls, layers, type: UR6, UR65-UR68.
- Buttons, rows, panels, back bars, labels: UR7-UR10, UR13, UR80-UR82 (while you build, below).
- Text a player reads: UR70-UR75, UR73 (no developer words), UIV1 (visible reasons).
- Scenes, choices, travel and Reports: SUI1-SUI19 and RPT1-RPT12 ("Scene and report rules").
- Wording of the always-visible set and navigation: UR11, UR21-UR33.
- Before you call it done: UR14-UR17 (1920×1080 populated save; name the app, UR16).
- Lane briefs: UR18-UR20.
- Reference-guided or parity work: UR45, UR59-UR64.
- Where the rest lives: the body groups rules by task under "Before you build", "While you build", "Before you call it done", "For coordinators", then dated topic sections. Search by code.

## Applying the existing rules to a bounded journey, 2026-10-25

This is a routing aid, not another rule set or a selected redesign. In the
existing task packet, link the affected owner, shared component and a working
consumer/example; name the changed player outcome and relevant states. Use:

- UR35/42/47/52 for discovery-aware inspection, known prerequisites and distinct
  unknown, empty, filtered and unavailable states. A failure message explains
  only what the observer can know; disabled controls need not reveal secrets.
- UR10/55/61/63 for target, actual cost/duration/units, commitment, progress and
  settled/cancelled/interrupted outcomes. Read those from existing owners;
  presentation does not decide settlement or duplicate preview math.
- UR21–33/41/43/51–58 for navigation, keyboard/focus, return, larger text and
  recovery without lost work or moving targets. Exercise relevant empty/error
  and changed-state cases, not just a populated opening screenshot.
- UR6/12/34/37–39/49/60/62/64/65–69 for shared vocabulary/components, quiet
  hierarchy, world-specific expression, stable layout and bounded feedback.
  Text and static meaning remain usable without motion, sound or color alone.

Use the current desktop/text targets below with disposable test fixtures, not
private player saves. Follow AD36 for the changed risk and evidence reuse;
unchanged content rows do not each require another full UI matrix. Required
changed native behavior and affected persistence need agent-side evidence. Human
visual/feel review is optional feedback under AD42 and stays separate. A screenshot, row count or absence of overflow alone establishes none
of the later verification states. A settled UI fix does not need a new prototype; use the
existing mockup workflow only when the design question is actually unsettled.

### Navigation scope in ordinary play, 2026-10-26

Application of UR41/43/52/53, not a new universal layout rule: choose the smallest
navigation scope that serves the current task. Opening a local disclosure such
as More actions keeps that task and its context; a larger view is a separate
deliberate action through the existing controller. Preserve source identity,
pending choices and a clear return. This applies to services, people, effects,
list controls, reports and settings as well as items. Full tasks may deliberately
reflow, and UR69 still permits stable-moment space lending. Check meaningful
context and controls rather than universal pixel immobility.

## Descriptions explain the experience and effect, 2026-10-25

Weibao requested rules for more narrative UI descriptions, especially traits,
while retaining calculations. [Direction](USER_VISION.md#effect-first-ui-descriptions-2026-10-25)
and [source comparison, examples and verification](reviews/ui-descriptions-2026-10-25/REPORT.md).
These apply to stats, traits, skills, items, conditions, actions and other
inspectable subjects, alongside UR40/42/43/47 and AD6–AD8.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR70 | **Lead with meaning and practical effect.** Default to one or two short sentences explaining what the subject represents and what it changes for the character. A trait may describe how it manifests in the body, habits or experience; a stat explains what increasing it helps. Use concrete verbs and restrained world-appropriate voice. Longer narrative belongs in a deliberate reading surface. | A tooltip opening with “Native current-player attribute” or atmosphere that never explains what the trait does |
| UR71 | **Give mechanics a supporting layer.** Follow the description with relevant current effects, conditions, costs, drawbacks or duration, then a labelled calculation/source breakdown when useful. Retain exact useful numbers and formulas through UR42/43 disclosure; short descriptions need not reproduce the entire calculation. Spell out unfamiliar ratings and distinguish power, damage and target-specific chances under UR40. | A formula replacing the explanation, or narrative removing the information needed to choose |
| UR72 | **Describe actual behavior with its conditions.** Trace effect wording to the owning consumer and observer-permitted state. Distinguish present effects, dormant or conditional effects, uncertain knowledge and unimplemented uses in player terms. Narrative can express the character's known belief, clearly qualified; it cannot establish an effect or reveal a sealed truth. | Copying a source's magic claim into a stat with no working magic consumer, or describing an inactive trait as already helping |
| UR73 | **Write for the player, with useful detail density.** Default to familiar names and meaningful comparisons. Internal source categories, stored-field caveats, pipeline terminology and tracing notes belong in developer documentation unless they explain a concrete player consequence. Omit repetitive neutral rows and empty-modifier messages by default; retain an explicit value or neutral comparison when it helps the current question. Engine refusals are developer text (Weibao 2026-10-30: "belongs to another world" is meaningless and detracts): an action the engine can only refuse with another world, actor or body, or with the unnamed fallback "required knowledge, means or circumstances", is hidden (UR82), not explained. `src/player_reasons.js` lists those strings, the shared decorator filters them, dev mode shows them under a dev label, and `tests/player_reasons.test.js` fails on an unregistered "belongs to another" refusal. A command that should show while locked gives its rule a `reason` naming the missing thing. | Repeating Unit/points/Base/Before multipliers/×1 on every hover, or exposing implementation warnings as flavor text |
| UR74 | **Keep one meaning across surfaces and check the words against play.** Reuse the owning subject's description and public effect projection across hover, pinned inspection, lists and reference views; shorten by disclosure rather than writing conflicting copies. For changed copy, check the active case and a relevant conditional, inactive or unknown case. Runtime delivery follows AD36 with rebuilt desktop evidence; document-only rules do not establish rewritten or playable tooltips. | A trait card, tooltip and effect list disagreeing, or a prose rule being reported as a shipped UI repair |
| UR75 | **Explain terms and comparisons where they affect a choice.** Default to a short explanation of unfamiliar ratings or specialized terms in the current inspection. Say what higher/lower changes, which target or baseline matters, and distinguish a percent change from percentage points when relevant. Use warnings for the current subject and circumstances; keep deeper definitions available through an existing reference route when one exists. Reuse the owning numbers rather than adding display-side mechanics. | An unexplained AP bonus, “less damage” with no baseline, or a warning about a requirement that does not apply here |

Implementation application, 2026-10-26: live inspection retains expanded details,
selection and reading position when its numbers update (UR43/74). A cosmetic
trait with no numerical contribution is not thereby inactive (UR72). The
[implementation round and other-game comparison](reviews/ui-descriptions-2026-10-25/REPORT.md#implementation-round-user-selected-2026-10-25)
record evidence and the bounded coverage of these applications.

## Before you build: decide where it belongs

For an unsettled layout or interaction, use the
[standing mockup workbench workflow](MOCKUP_SYSTEM.md), requested 2026-10-16.
Reuse its comparison controls and show fixture provenance, task, target viewport
and limits. Keep prototype evidence separate from native behavior and human
acceptance. A settled production change does not require a new mockup.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR1 | **Declare a surface type** (routine, place service, threshold screen, quick confirm, obligations, reference, settings, proposals drawer, ambient log) and a home before writing UI. [Surface types](UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md) | About 28 modules each dropped a block into Local actions, mixing routine actions, proposals, settings and services in one column |
| UR2 | **Unaccepted features go to the Projects drawer.** Only Weibao promotes a feature onto the main surface | Proposal panels ("Meadow pen · care proposal") crowding the place where the player acts |
| UR3 | **Respect the main-surface budget:** about seven routine entries in Local actions, one level deep. Adding one means demoting or grouping another | Nested boxes inside boxes and a column that scrolls forever |
| UR4 | **Give it in-world logic:** who runs it, where it is, when it is open and why it exists in this world. Workstations live at places; most places have a keeper | An abstract "Village mixing counter" with no person or place behind it |
| UR5 | **Weighty, rare decisions get a full screen; modals only for one-question confirms** | World entry and beginnings sitting in a permanent side panel |
| UR76 | **Fill the UI contract before building.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: a system card names its home from existing homes and its shape from the shared primitives, with every state's text. Dial: a throwaway lab view in the Projects drawer may skip it. Reason: the per-feature screen starts when nobody decides placement first | Each new system arriving with its own panel and its own idea of empty |
| UR77 | **Budget the homes in numbers.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: 20 routes, 5 regions, 4 center modes, about 7 Local actions, 7 tabs per route, and a count of panels per home; hidden panels load on first open (UIX6: 83 panels today, 76 hidden but mounted). Dial: raising a count needs a demotion or merge and Weibao's yes, ledgered with a reason. Reason: UR3's budget covered one column; the sprawl risk is now routes, tabs and mounted panels | Route and tab creep, one system at a time, and a page that mounts every panel at load |
| UR78 | **Content inside an accepted surface is not a promotion.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: rows, lines, chips and tabs in an existing home ship as adopted direction; a new Local actions entry or route still goes through the Projects drawer (UR2). Tuned numbers carry no "(a proposal)" tag (UIX3). Reason: reading adoption as promotion parks small additions in the drawer | Parking a stop-reason line in the drawer |
| UR79 | **One shape per kind of information.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: accounts use the ledger, dated things the timeline, after-the-fact summaries the note, policies the policy row. Dial: a new primitive needs two existing consumers (UR54). Reason: shapes multiply when each system invents one | Five ledgers with five column orders |
| UIV2 | **A newly reachable system says where it is.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: when a system first becomes reachable in a life, the Journal records where and the place view shows its entrance. Dial: All panels stays a reference and dev route. Reason: Weibao plays the normal game, not the panel list | Features reachable only through All panels |

## While you build: one look, one way to move

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR6 | **Tokens only.** Colors, radius, fonts, sizes, borders and shadows come from the shared token file. No local `border-radius`, `font-family`, raw colors or `style.cssText`. The UI contract test enforces this. *Dial (Proposed, in use as the default (CHOICES item 4, 2026-10-30)): an exception adds a token first, then uses it.* | Five corner radii, three font stacks, eight sizes and five button styles on one screen |
| UR7 | **Use the shared components:** group row, info block, button (with a disabled reason), tab, tooltip. Never leave raw unframed text or an ad hoc button style in a list. *Dial (Proposed, in use as the default (CHOICES item 4, 2026-10-30)): a missing component is added to the shared set first, then used.* | Rounded dropdown rows, unframed clerk text and dashed versus solid buttons stacked together |
| UR8 | **Own your node.** Register through `definePanel`; never `prepend` or `append` into another panel's element. *Dial (Proposed, in use as the default (CHOICES item 4, 2026-10-30)): a cross-panel need goes through a registered hook or a new panel, not a direct write.* | Four panels pushed into the message log box and buried the combat and event lines |
| UR9 | **One center-mode controller.** Every view that replaces the center opens through it and gets the same back bar pinned at the bottom, labelled with the destination ("← Village"), plus Esc. No feature hides its siblings itself | A back button placed mid-row among actions that Weibao could not recognize; two systems toggling the same nodes |
| UR10 | **Label by destination or outcome**, not by mechanism: "← Village", "Mix one vial · 3 min", not "Back to local actions" | Labels that only make sense to whoever wrote the code |
| UR11 | **Keep the always-visible set intact:** status, current work and the full-height log. Never shrink or crowd the log column | Losing the attack numbers and random event text Proto23 players expect |
| UR12 | **Proto23 is the visual/composition baseline** (square frames, gradient fills, hairline rows, You and focus panels on top, clear inventory/action/log regions). Refactor shared layers toward that hierarchy and space allocation; colors and corners alone do not establish fidelity. Other looks are token overrides, never per-panel styling. [Baseline clarification](UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#proto23-baseline-clarification-2026-10-15) | A rounded, generic style, or a Proto23-colored stack of boxes, that loses the reference's readable composition |
| UR13 | **Nothing disappears silently.** Moving or parking a feature adds a log line and a dot on its new home. *Dial (Proposed, in use as the default (CHOICES item 4, 2026-10-30)): a purely cosmetic reshuffle that leaves the feature in place may skip the log line.* | Players losing features after a reorganization |
| UR80 | **Lenses narrow what the player knows.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: overlays, reader dials and observer views filter the player projection (AR8) and sealed-secret rules; sealed outcomes appear by ID and status. Dial: a dev lens may read more if it is labelled and absent from play. Reason: a debug view must not leak a sealed or future fact | A spoiler overlay or debug view leaking a sealed or future fact |
| UR81 | **Stops and absences explain themselves.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: a stopped routine, a missed clock and a return after absence each get a note line naming what happened and why, linked to its source; when nothing happened, the note says so. This makes the return note (coverage plan B1) required behavior and extends RPT6, which already binds for Reports. Dial: the player may quiet a category. Reason: silent stalls and empty recaps read as bugs | Silent stalls and empty recaps read as bugs |
| UR82 | **A system shows once a life has something attached.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: a system appears in a life when it has rows attached to that life; once met, its empty state explains how to fill it. Dial: a world may show a layer early with an in-world reason. Reason: unmet layers are noise | Every layer (book, travel, cheat) showing in every life |
| UIV1 | **A disabled action shows its reason without hovering.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: the reason appears inline or on focus in the pinned box of UR43; a tooltip may repeat it, never hold it alone. SUI5 already binds this for scenes; this extends it to every system. Reason: a player may never hover | Tooltip-only blocked reasons |
| UIV3 | **Everything under way lives in one list.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: one under-way list on the work line, each row with time left and what travel does to it. Dial: fold to a count when long. SUI7 already binds the upcoming strip for scenes; this covers timed jobs elsewhere. Reason: timed work needs one home (coverage plan B4) | A false "nothing else under way" refusal |
| UIV4 | **A preview matches commit.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: what a preview shows is what commit does; a change in between is stated or refused before charging. SUI6 already binds quote-before-commit for scenes; this extends it to every system. Reason: a cost that shifts after you agree feels like a cheat | Two-step Find work with different numbers |
| UIV6 | **One look for known, guessed and unknown.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: extend UR36 beyond combat with one shared marker for assays, forecasts and inspectors, under UR74. Reason: the same doubt should look the same everywhere | Each system marking uncertainty its own way |

### Small-detail tokens, 2026-10-22

Weibao: "creating base rules for every little thing to make development easier? ... Yes do spacing but consider more as well." Small details belong in tokens and the contract test, so builders get them right by default without reading more prose. The [UI design core audit](audits/UI_DESIGN_CORE_AUDIT.md) holds the measurements, Discord-derived lessons and remaining proposals. A [one-screen card](ui/UI_RULES_CARD.md) summarizes every rule; this file stays the authority.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR65 | **Spacing comes from the scale.** Padding, margin and gap use `--ui-space-1` to `--ui-space-7` (2, 4, 6, 8, 12, 16, 24 px at 14 px text), `--ui-space-hairline` for 1 px seams and `--ui-space-panel` for the player's panel-spacing setting. Steps scale with the panel's own text size (UR33) and round to whole pixels for the bitmap Gothic strikes. Zero, `auto` and percentages need no token. An off-scale value is kept as an exact entry in `tests/ui_contract_allowlist.json` with a `reason` field. The UI contract test catches new literal px/em/rem spacing in CSS declarations and in JS style strings (`el.style.paddingTop='4px'`, `{margin:'4px'}`); existing literals are ledgered exactly and the ledger shrinks as files migrate | 313 distinct spacing values, half-pixel row offsets on a bitmap face, and px-only gaps that stop scaling at larger text |
| UR66 | **Controls take one of three heights.** `--ui-control-sm` (20 px at 14 px text) for panel headers, tabs and inline tools; `--ui-control-md` (28 px) for ordinary buttons, selects and nav; `--ui-control-lg` (42 px) for routine action rows. Heights scale with text like UR65. The contract test catches literal heights on control selectors | Twelve control heights in one screen, and 18 px header targets on a trackpad |
| UR67 | **Stacking comes from named layers.** `--ui-layer-*` runs backdrop, raised, sticky, region, screen, floating, nav, popover, modal, layout-edit, lowest to highest. A new overlay picks the layer for its role; Esc and outside-click order (UR53) follows the same order. Literal `z-index` is caught | 25 ad hoc z-index values and popovers opening under the panel that owns them |
| UR68 | **Text uses type roles.** Size from `--ui-type-*` or the panel's `--custom-size` and `--custom-small-size` strikes; leading from `--ui-line-compact`, `-body`, `-small` or `-prose` (whole pixels); weight from `--ui-weight-*`. On the single-weight Gothic face, emphasis comes from color, case or outline, not synthetic bold (Discord lesson DL5). Literal size, line-height and weight are caught | Non-strike sizes such as 11.9 px, fractional leading and smeared fake bold on the bitmap font |

## Before you call it done: check what a player sees

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR14 | **Discoverability check:** at the primary target 1920×1080 on a populated save (1366×768 retired 2026-10-19), can a first-time player name the way back, the current work and the main actions from a screenshot alone? Put the screenshot in the report | Technical proof that a button exists, while the player could not find it |
| UR15 | **Reproduce a reported problem in the player's terms first.** If it does not reproduce, ask what they saw before designing a fix. A report like "no way back" may mean "could not recognize the way back" | Hunting for a dead-end state when the real issue was an unclear label |
| UR16 | **Proof and taste are separate states.** Report rebuilt, fresh-origin technical proof; human visual/feel review is optional feedback under AD42. *Evidence also names which app it ran on (Proposed, in use as the default (CHOICES item 4, 2026-10-30)): the dev build hash, the frozen app he plays, or the screenshot mirror, and says whether the change has reached the app he plays (UIX7).* | Calling a layout accepted because tests pass |
| UR17 | **Saves first:** reorganizing UI never deletes gameplay, renames internal ids or breaks saved layouts, pins and collapse states without a written compatibility decision | Presentation work silently breaking long-running saves |

## Getting anywhere, and seeing it without much scrolling

Weibao, 2026-10-15: "there should be paths back to specific large panels if someone wanted, everything should be viewable without scrolling too much, other stuff and more?" Observed the same day: at 1366×768 the Village's Local actions needed scrolling to reach "Mix at the Village counter". The [scrolling policy](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#proposed-scrolling-policy) and panel kit F6 cycling already exist as proposals; these rules make them binding.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR21 | **Every large panel has a direct path:** inventory, crafting, journal tabs, People, Projects, ledger, world screen and settings are each one click away on a persistent nav strip and have a hotkey. Opening one focuses its header | Finding a panel by hunting through columns and collapsed groups |
| UR22 | **Back goes to where you came from.** The center-mode controller keeps a history stack; the back bar names the real previous place ("← Inventory", "← Village"), not always home | A back control that throws you somewhere other than where you were |
| UR23 | **Return restores your place:** scroll position, selection, open groups and active tab come back when you return to a view | Reopening a long list at the top and losing your spot |
| UR24 | **Any large panel can expand** to fill the center as a focused view, and the back bar returns it to its normal home | Squinting at a big panel squeezed into a side column |
| UR25 | **Scroll budget at every target (1920×1080, the MacBook size and 1536×864):** no page scroll in ordinary play; one scroll owner per region; routine actions, current work and the way back visible without scrolling. A panel needing more than about one and a half screens of scrolling must be split, summarized, filtered or offered as an expanded view (UR24) | Long columns where the important action sits below the fold |
| UR26 | **Summary first:** collapsed groups show a one-line status (ready, due, counts) so the player knows whether to open them | Opening every dropdown to find out if anything inside matters |
| UR27 | **Long lists keep their bearings:** sticky header, filter or search, a count, selection kept in view, no jump on refresh | Inventory and logs that lose your place every tick |
| UR28 | **Quick jump:** one shortcut (for example Ctrl+K or /) searches known panels, actions, people and items and goes there. Lists only what the player knows (observer-safe) | Deep features reachable only by remembering where they live |
| UR29 | **Notices link to their source:** clicking a log line, unlock dot or toast opens the panel it is about | Reading "new recipe" and then hunting for where it went |
| UR30 | **Same panel header everywhere:** title, one-line status, collapse, expand, pin, in the same positions | Each panel inventing its own controls |
| UR31 | **Shortcuts are discoverable:** nav tooltips show hotkeys and a "?" sheet lists them all | Keyboard paths nobody knows about |
| UR32 | **Empty states say how to fill them**, rather than showing a blank box or hiding the panel without explanation | Empty frames that look broken |
| UR33 | **Larger text still works:** at 125% and 150% text, routine controls and the back bar stay reachable; scrolling is allowed but the back bar stays pinned | Layouts that pass at default size and break for readers who zoom |
| UR69 | **Regions lend free space at stable moments.** Outside a fight, the top row may grow so idle place prose and yielding stat rows show whole, but only into space the bottom row's measured content leaves free; bottom content wins. Sizes change at stable moments (place, context, text size, viewport, explicit layout actions), never while the player reads or on ticks (UR52; Discord lesson DL4). Parts pinned to a region edge count by their own height so the fit cannot ratchet. Fights and saved manual sizes keep their own rules | Around you cutting services off mid-line beside a half-empty action list, and layouts that creep taller on every measure |

Measure, don't guess: UR14 reports include page `scrollHeight` against the viewport and which regions overflow, on a populated save at 1920×1080.

**Viewport targets, 2026-10-17 (Weibao: "yes, check my screen realestate and what is most common?").** Primary design target 1920×1080, the most common desktop size (about half of Steam players and a fifth of all desktop web traffic). Weibao's own MacBook Pro shows about 1800×1040 CSS pixels in a full-screen browser and is checked every round. Floor that must not break: 1536×864 (the second most common size, and 1920×1080 at 125% scaling). 1366×768 was a floor until Weibao retired it on 2026-10-19 (see [USER_VISION](USER_VISION.md#retire-the-1366768-floor-2026-10-19)); no rule requires checking or designing for it. Text at 14px and 21px at each. Extra space at the primary target goes to more useful panels, not larger type. Superseded wording, kept as history: UR14, UR25 and this note measured at "1366×768" only.

## For coordinators and lane briefs

- **UR18.** Every UI lane brief links this file and states the surface type, target viewport, visible outcome and deferred scope (AGENTS.md consistency gates).
- **UR19.** Parallel lanes do not each restyle or place UI on their own. Shared layers (tokens, components, center modes, drawers) have one owner at a time; others consume them.
- **UIV7.** *Proposed, in use as the default (CHOICES item 4, 2026-10-30).* Default: schedule UI review after source lanes in the same area have landed, and name the inputs that would invalidate it. Reason: a stale screenshot sends styling work after a screen that no longer exists.
- **UR20.** When Weibao corrects a running lane, write the correction into its brief and confirm the worker actually read it (search its log) before assuming it took effect.

## Proportions, knowledge and effects, 2026-10-15

Weibao's shell refinement asks for more usable inventory, less cramped focus/stats, source-like coloring, legible enemies and future VFX compatibility. These extend the existing rules rather than replacing their controller or surface types.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR34 | **Budget useful space by role.** Measure source and candidate column/vertical proportions, visible list rows and text sizes on the same laptop viewport. Paired player/focus headers should align; equipment can disclose or tab, but inventory and readable combat context must retain useful space. Report tradeoffs; no smaller text to pass a row count | A source-colored shell with 121 px of inventory and crowded statistics |
| UR35 | **Inspection is free; actions are explicit.** Selecting an item, enemy, person or reference preserves clock/work. Native action controls execute once through existing eligibility guards. Combat context remains visible during item inspection; close/Back restores the selected context and list position | Clicking to read details accidentally consuming, crafting, stopping work or losing the opponent |
| UR36 | **Known combat facts have stable homes.** Show the selected opponent's identity, health and observer-permitted native stats/status with labels; distinguish unknown, unassessed and unavailable without inventing values. Multiple opponents have an explicit selection. Use existing truth/discovery owners | Empty enemy stats, fabricated levels, or hidden attributes exposed by a decorative UI |
| UR37 | **Color communicates consistent roles.** Palette tokens own backgrounds, quiet frames, selection, focus, disabled state, semantic vitals and warnings. Keep text/symbol labels so color alone is never the fact. Honor player palettes and reduced motion | Bright competing notices, invisible selection, or world reskins changing the meaning of health/danger |
| UR38 | **Effects preserve the interface contract.** Future VFX use stable actor/log anchors and plain-text outcomes; they never hide essential facts/input, move controls or scroll, change simulation/RNG, replay on reference navigation or disclose unknown information. Existing effect preferences and static/reduced-motion forms remain effective. Planned VFX stays with its owner until separately implemented and proved | Dramatic effects breaking combat legibility, navigation, accessibility or deterministic gameplay |

## Structural parity and contextual chances, 2026-10-15

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR39 | **Match structure through the actual layout owner.** If reference upper/lower regions have different column boundaries, the composition supports that split. Do not simulate it with overlapping width/offset patches. Compare unscaled geometry, palette roles, readable text and usable list rows, including actual150% text | Claiming parity while retaining the dock constraint that caused the mismatch |
| UR40 | **A chance names both sides and its meaning.** Distinguish your chance to hit a selected target, their chance to hit you, evasion, shield/block and AP/EP ratings. Show only native known facts; unsupported rank/intent stays absent or explicitly unassessed. Layout controls belong in discoverable edit UI rather than unexplained corner glyphs in normal play | Reversed hit percentages, ratings mistaken for chances, or pin symbols mistaken for rank |

## Contextual navigation, quiet hierarchy and faithful references, 2026-10-15

Weibao: “things shouldt always open onto the bottom, the can change their specific panels too?” Follow-up: “save and update rules accordingly? Save UI conventions and more? Save ideas like these into a long standing rule when working on thigns like these”. These extend existing rules rather than mandate one unaccepted prototype.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR41 | **Choose the navigation scope before the destination.** A person or opponent inspection can replace Focus, character subviews can change You, a short item inspection can anchor to the item, a place service belongs in its task region, and larger tasks may deliberately expand. Local pane navigation keeps a clear local return; center replacements still use the one shared controller, destination-labelled bottom Back, Esc and restored place. One ownership and history model governs all scopes, with no competing movers | Clicking a character, item or log entry always replaces an unrelated lower panel, while its natural home stays blank or duplicated |
| UR42 | **Apply progressive disclosure by task frequency.** Keep frequent facts and actions visible and put specialized ones behind a clear labelled path, with few meaningful levels. Related choices used together stay together. Tabs switch peers, Back returns from a drilldown, a menu offers actions; do not disguise one as another. Do not duplicate a fact across simultaneous panels without a useful comparison | Dense main surfaces, arbitrary “More” chains, duplicate names and unpredictable navigation |
| UR43 | **Separate preview, pinned inspection, commands and full reference.** Hover is a quick optional peek. Long or actionable content needs a stable pinned route with keyboard and focus access (touch gets an explicit equivalent if later supported), and critical facts or actions never depend on hover alone. A fuller view is available when useful, not the automatic default for item interaction. State the anchor, collision placement, dismissal or pin behavior and return destination; avoid nested popover cascades. Preserve combat facts, work, selection and native command guards; dismissal never silently discards pending edits or commits a command | A disappearing tooltip as the only action menu, an overlay blocking its source rows, accidental consumption, or every inspection becoming a page |
| UR44 | **Treat the log as a readable stream, not dashboard cards.** Use compact rows, consistent reading rhythm and restrained separators; category filters and metadata need not become large repeated headings. Emphasize the meaningful actor, item, number, outcome or discovery, not a solid color block per event. Keep semantic text, links, user palettes, larger-text support, follow and unread behavior and the full-height log. Judge a populated live combat or event stream, not two startup notices | Sparse startup logs looking fine while combat becomes a tall wall of repeated labels and clashing color |
| UR45 | **Reference evidence names how the state was reached.** Keep apart original source bytes, native-rendered DEV SEEDED scenes, an actual native interaction journey, natural progression and human acceptance. A lab-revealed or default opponent is not a verified fight or fight-menu route: inspect the source and exercise the actual menu or action before claiming parity. Use varied relevant states (populated inventory, equipment and effects, active combat, shop, journal, settings), caption unequal items or progression, and preserve the pinned source. Screenshots guide composition, not hidden mechanics or a universal rank | A synthetic or default scene presented as representative combat, or one sparse opening screen standing in for the whole reference |
| UR46 | **Clean hierarchy comes from grouping and alignment, not fewer facts or smaller text.** Give You, Focus and log a clear identity, primary status, secondary facts and explicit controls, with consistent label and value gutters, spacing and type roles. Borders frame regions and meaningful groups, not every fragment. Color and VFX reinforce native meaning and have a plain static equivalent. Inspect the same tasks at the desktop target and at actual 125% and 150% text (1366×768 retired 2026-10-19). Row counts and zero overflow support agent-side review; human visual/feel review remains optional feedback under AD42 | Matching colors while keeping crowded stat cells, oversized log labels, unexplained ornaments or unreadable larger text |

UR41 clarifies UR9: the shared center controller is a requirement for center replacements, not an instruction that every interaction belongs in that center. UR43 does **not** select O1/O2/O3 from the current item-inspection experiment. Hover→pin is an agent recommendation awaiting visual/default-interaction selection.

Conventions consulted: [Apple Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers/) (anchored temporary content, avoid cascading popovers) and [Nielsen Norman Group, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) (frequent primary choices, clear secondary paths, avoid excessive levels). Apply their task/space principles to this desktop game; they do not override the accepted Proto23 baseline or native gameplay.

### Native status, subject and event previews, 2026-10-15

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR47 | **Reuse meaningful hover descriptions across related surfaces.** Effects, bars, known opponents, item composition and log subjects may explain themselves on hover and keyboard focus. Keep actionable status visible by name or labelled summary, and show duration, source, stacks or modifiers only when the authoritative public projection supplies them. One bounded preview at a time, with Esc, pointer access and explicit commands separate from inspection. Do not invent enemy effects, level, intent or hidden appraisal to balance a panel; empty status collections need no ornament. UR43 governs pinning, dismissal and longer references | Symmetrical panels filled with made-up enemy data, or hover as the only way to see a status |
| UR48 | **Distinguish an event from the subject now.** A historical log preview explains the recorded event and its known data. A command that opens the current related panel must say so. Do not silently resolve an old actor or item name to current equipment, effects or newly discovered facts. Keep the stream compact and preserve scroll and follow while inspecting. Reuse native descriptions or durable event references before adding a hover-data model. Subject-specific rich previews stay proposals until event data supports them and a rebuilt browser exercises them | An old log line showing today's gear, or a rich preview shipped without data behind it |

### Parity keeps YAIR's reasons, 2026-10-15

Weibao: "some stuff have reasons to exist for us specifically, like the top bar to make stuff condensed and seeable and more? Some features are specific ways here for specific reasons to better fit our end goal, so we need to establish that accordingly?"

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR49 | **A difference from Proto23 is a gap only when it has no YAIR reason.** Before moving a YAIR choice toward Proto23, find its recorded reason (UI_RULES, USER_VISION, PROJECT, feature owner). If one exists, absorb the Proto23 lesson inside that choice; if none, say so and either fix the choice or record the reason. Parity reports list kept differences with reasons beside the gaps ([register](gm/dispatch/ui-foundation-2026-10-15/PARITY_INTENT_2026-10-15.md)) | Copying Proto23 over the top bar, knowledge gating, explicit actions or other choices made for YAIR's life-sim, many-world and laptop goals |


### Grouping and whole-journey review, 2026-10-15

Weibao: grouping “could be feasible if done well”; keeping the hit counter and links
because they credit upstream or were retained earlier is not a sufficient reason.
Credits may live elsewhere. These defaults extend UR21–UR27 and UR41–UR49;
[navigation candidates and source examples](gm/dispatch/ui-foundation-2026-10-15/NEXT_PARTS_2026-10-15.md#refinement-grouping-chrome-and-the-complete-journey-2026-10-15)
remain proposals, not an accepted grouped default.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR50 | **Permanent chrome earns space through a current player need.** Attribution needs a clear accessible home, not a hit counter, repository or support link, or version in the play bar. Preserve LICENSE and attribution and identify upstream and support recipients. Retention by an older round is history, not a new requirement | Defending clutter with precedent, or confusing support for upstream with support for the fork |
| UR51 | **Group by player task, preserve fast paths.** Compare grouping against direct access on repeated journeys, discovery and return. UR21 stays the direct-access default, and an extra-click replacement needs an explicit accepted tradeoff. A grouped browse surface can complement direct and contextual paths, with one canonical route and native eligibility owner for every entry point | Fewer visible buttons mistaken for easier use, or several inconsistent copies of a panel |
| UR52 | **Navigation stays stable during interaction.** No tick, discovery, count update or automatic ranking moves a pending target, steals focus or replaces an inspected subject. Known-empty, filtered-empty, known-unavailable and unknown are distinct states, and counts and notices use observer-safe data | Clicking the wrong command after a reflow, vanishing category tabs, or discovery leaks through badges |
| UR53 | **Transient surfaces have an explicit dismissal and focus contract.** Menus and popovers work by pointer and keyboard. Esc closes the top one before navigating Back, focus returns to the opener, and an outside click dismisses without activating what is underneath. Opening and closing has no gameplay effect and follows the existing simulation policy | Accidental commands, stacked overlays trapping input, and menu refresh interrupting play |
| UR54 | **Control placement follows the task, not a universal strip position.** Compare header, footer and inline tools at actual larger text, keeping frequent categories and search recognizable and list context visible. Reuse primitives; generalize a new component only with demonstrated consumers | Moving every filter to the bottom, or building a universal kit around one unproved layout |
| UR55 | **State and safety survive condensation.** Truthful save and error status stays visible without opening a menu. Save, backup Export and replacing-state Import keep distinct labels and existing guards. Navigation, filtering and dismissal never execute gameplay or discard edits | A tidy Save menu hiding failure, or Import looking like a harmless display setting |
| UR56 | **Summaries preserve meaningful differences and a route to detail.** Enemy groups keep individual selection, identity and known state; repeated log lines keep their recorded events; pursuit summaries read completion from existing owners. Define grouping identity and lifecycle before aggregating | Same-name enemies losing distinct health, compressed logs losing outcomes, or pins becoming a second quest system |
| UR57 | **Review the full journey in changing state.** Exercise finding, switching, inspecting, acting, returning and resuming, including full discovered routes, large text, unavailable targets and relevant failure recovery. Record click or key cost, lost context and useful visible content. Screenshots and counts alone do not prove findability or acceptance | A clean opening frame hiding repeated navigation friction or broken return behavior |
| UR58 | **A display preference has an owner and reset boundary.** Define whether it follows this browser, character or world, and reconcile route IDs, pins, filters and selection on reload, import and reset. Missing targets get a safe explanation and undiscovered targets stay unnamed. Reuse existing state and migration policy | A different save inheriting another character's reminders, stale routes or leaked discoveries |

## Discord-derived reference guide, 2026-10-21

Weibao requested absorbing the design guide into the UI reference rules after
the [Discord absorption check](audits/DISCORD_ABSORPTION_CHECK_2026-10-21.md).
[Direction](USER_VISION.md#discord-design-guide-and-missing-media-recovery-2026-10-21).
UR59–UR64 make the reusable guidance standing; source-specific mechanics and
unresolved interpretations retain their recorded status. Apply these alongside
UR12/UR49 and AD40 when designing or reviewing a reference-informed surface.
Defaults, intensity and exceptions follow the selected world, player settings
and actual mechanism, with their reason and cost stated in the task record.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR59 | **A reference keeps its date, speaker and evidence status.** Bind the image or clip to its caption and useful discussion, and tell apart shown behavior, developer statement, player suggestion and our inference. Keep alternate drafts and later corrections discoverable. Adapt the lesson through the current OOPS owner and name deliberate differences under UR49. Missing bytes, an unused draft and a later release are different states. Newly recovered material may correct an interpretation, so review the affected rule or example explicitly rather than silently adopting it | Treating a liked tooltip draft as the shipped UI, or turning a source joke, formula guess or source-world limit into an OOPS requirement |
| UR60 | **Compose typography, color and frames by reading role.** Shared tokens cover compact labels, numeric comparisons, longer prose, task regions, selection and quiet decoration. MS Gothic is the selected internal default, including prose and controls (2026-10-21 direction); verify the rendered face and per-glyph fallback. The earlier optional compact-font candidate is historical. Preserve the original launch direction and player or module overrides. Keep full known names accessible, labels on quiet readable backing, and commands stable at actual 14 and 21 px desktop text. Density, glow and world styling are dials whose cost is legibility and distraction | Copying colors without composition, claiming a font loaded from its CSS name, borders crossing values, or shortening a label until its meaning is lost |
| UR61 | **A meter says which question it answers.** Tell apart current pool or capacity, progress or completion, readiness, conditional success, signed contribution or rate, discrete stock, remembered observation and same-subject recent change. Name units, baseline and applicability; a full progress bar is not automatically a warning or eligibility proof. Derive thresholds and comparisons from the owning mechanism and public knowledge, with time and place on stale observations when useful. Keep readable text, static meaning and keyboard Details; an extra contextual resource may appear without moving commands | A 100% success tooltip on an unavailable recipe read as readiness, a maximum increase shown as healing, or an old observation shown as live truth |
| UR62 | **Local reactions follow the actual subject and settled occurrence.** Bind hit, repair, recovery, work completion, weather, household and sound cues to the owner's public state or receipt and the subject's lifetime. On replacement, load or revisit, reconcile transient cues without replaying rewards or attaching A's pulse to B. The little actor may move while its controls stay still. Motion, sound, humor and intensity are optional dials with static and text equivalents. Tell a settled animation from a real paused response; bodily competence, serious outcomes and supported sensing decide what expression fits | Fake rescue opportunities, effects deciding gameplay, a scene exposing hidden state, or a forced gag taking away a working method |
| UR63 | **Keep the task's known dependencies and commitment together.** In the task's natural home show the actual target, selected means, input or stock policy, requested amount, progress, stop reason and next move. Explain attempts versus useful outputs, substitution, interruption, continuation and what is spent, retained or returned, through existing owners. Known producer and use links and comparisons name exact subjects and restore the original task on return. A tracked goal reserves stock only through an explicit existing policy; mastery may reduce handling where its mechanism supports it | A quantity goal silently spending a prized stack, duplicated preview math, navigation discarding intent, or an inverse recipe search revealing unknown content |
| UR64 | **Condense repeated presentation without flattening meaningful change.** Define grouping identity, occurrence count, retention or detail window and preference and reset owner. Keep changed outcomes, subjects and important transitions distinguishable, preserve the actual gameplay result, and explain any bounded retained display history. New discovery, recent gain and remembered-versus-current change are different cues. Keep a stable route to available detail and a useful return summary, preserving focus, scroll and follow, and known membership. Quiet recurring feedback rather than replaying a backlog of effects | A repeat counter hiding a new consequence, “new” badges pretending to track XP, unbounded detail rebuilds, or a compact log implying an archive it does not keep |

### Reference routing and retained examples

This table routes the whole design guide into standing rules and existing detail
owners; it does not select every illustrated mechanic for implementation.
The [fine-grained comparison](research/proto23/FEATURE_AUDIT_SIDE_BY_SIDE_2026-10-20.md)
retains PFA001–PFA090, PFY comparisons and unresolved source cases.
The [UI/playful report](research/proto23/UI_AND_PLAYFUL_PRESENTATION_OPPORTUNITIES_2026-10-20.md)
and [YAIR review](research/yair-upstream/DISCORD_RESEARCH_2026-10-20.md) preserve
independent findings and chronology. Use their later execution receipts for
implementation status, not an older Candidate/Partial label alone.

| Design-guide family | Standing application | Detail owner and retained scope |
| --- | --- | --- |
| CRL1, CRL7: uncertainty and useful comparisons | UR36/40/45/47/59/61; AD6–8 | [Means/appraisal](MEANS_AND_APPRAISAL.md): actual versus observed versus forecast, named baseline and stale evidence |
| CRL2, CRL3, CRL8: methods, custody and meaningful variety | UR35/49/63; MR and AD38 | [Granular systems](GRANULAR_SYSTEMS_AND_INTERACTIONS.md), [making](MAKING_RULES.md), [gear dimensions](EQUIPMENT_STAT_DIMENSIONS_CONSIDERATIONS_2026-10-20.md): display actual costs/results; physical piles, spoilage or universal wear are not implied |
| CRL4, CRL5, CRL6: intent, mastery and discovery | UR22/23/35/42/52/63; MR/SLR | [Crafting](CRAFTING_ENGINE.md), [UI palette](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#small-contextual-bars-and-everyday-interface-details-2026-10-20): known uses, real work and changed handling through actual owners |
| CRL9, CRL22: composition, typography and labels | UR6/12/34/37/39/43/46/49/60 | [Panel kit](PANEL_KIT.md), [typography/style receipt](THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#tsg-implementation-receipt-2026-10-20): current shell, legible compact rhythm, full known identity |
| CRL10, CRL19, CRL21: cadence, local reactions and recent changes | UR38/44/48/52/56/58/61/62/64 | [Presentation](PRESENTATION_AND_FOURTH_WALL.md), UI palette: receipt-bound effects, new versus changed, honest aggregation and return |
| CRL11, CRL12, CRL13: home, flavor and connected outings | UR4/35/49/57/59/62/63 | Granular systems and presentation: real-state home/return loops; flavor/claims are distinct from an implemented property |
| CRL14: choose a complete playable question | UR16/18/45/57/59; AD33/36 | [Original guide](research/proto23/DESIGN_LESSONS_FOR_OOPS_2026-10-20.md): bounded journey through aftermath, source/build/native/taste proof kept separate |
| CRL15–CRL18: spatial progress, slips, impact and aftermath | UR35/38/49/57/61/62; AD19/38 | Presentation and original guide: scene responds to actual state; spatial climbing remains a specific content proposal, not a completed palette feature |
| CRL20, CRL23–CRL26: personality, little actors, competence, sound and familiarity | UR37/38/45/52/58/62/64; AD6/16/38 | Presentation and original guide: caused, optional, observer-safe expression; existing history/clock owners, tone and human judgment |

For a touched reference family, the task record names the applicable UR codes,
source locator, existing consumer, visible desktop outcome and a meaningful
failure scenario. Reuse relevant passing evidence only for unchanged inputs
(AD36). A rule fold, 90 routed comparisons or 53 bounded treatments does not
certify all source media, future world mechanics or current combined gameplay.

## Craft 1 activation evidence, 2026-10-16

[UA2 native receipt](gm/cross-audit-reconciliation-2026-10-15/UA2_NATIVE_2026-10-16.md)
checks UR35 on a disposable rebuild of current source: one committed attempt per
button activation delivered by the browser. The tested double-click delivered
one activation after synchronous detail replacement; two distinct Enter presses
and a second keydown marked `repeat=true` each delivered two activations and two
paid attempts. Native inventory and saved/runtime Work Ledger receipts agree.
This qualifies the current route, not a universal double-click suppression rule
or physical key-repeat cadence. MR4's free inspection/preview remains distinct.
No gesture policy or runtime code changed; visual/play acceptance remains open.

## Scene and report rules (SUI, RPT)

Source: moved 2026-10-29 from the cast-lives plan (sections 15-18 and 21), codes and wording unchanged. Binding defaults since Weibao's "Sure" to the batched list on 2026-10-28 (CL281); open to change with a better idea and a reason. Target viewport 1920×1080 desktop first; mobile deferred.

### SUI1-SUI19: scenes, choices and travel

| Code | Rule (default, dial and reason) | Restates |
| --- | --- | --- |
| SUI1 | **A scene is state, not prose.** The UI draws place, time band, who is here, available actions and results from game state; every line is our own wording generated from fields. Source text never reaches the screen. Reason: copyright and one truth (AR8) | AR8, research rules |
| SUI2 | **Pick the surface by what the scene asks of the player** (UR41): a routine moment lives in the location panel; a scene with a choice opens a scene card in the center view through the shared controller with the back bar and Esc; a fight uses the existing combat surface; a scene the player is not in becomes a log line | UR41, PLAN 17.4 |
| SUI3 | **Witness level decides the text** (PX49): present gets the card; affected gets the outcome and its effect on you; aftermath gets what you find afterwards; heard gets a rumor line marked as told to you. Never more than the player perceived | PX49, AR8 |
| SUI4 | **No canon labels by default.** Options are not marked "what the book did"; the opt-in overlay shows past and current canon scenes only | PLAN 17.4, sealed-secrets rule |
| SUI5 | **Untaken options stay visible** as actions with their cost, or as a quiet "not possible yet: [what is missing]" line; never silently absent (WA28) | WA28, UR72 |
| SUI6 | **Quote before commit.** Every scene action shows time, cost, who is affected and, where weighted, the observable resistance (CL40) before the click, and rechecks on commit | AR7, UR71, CL40 |
| SUI7 | **Scenes keep their window, not the player's attention.** A scene you are part of waits within its window and shows in the calendar and an "upcoming" strip; past the window it settles without you (CL6a) and reaches you at your witness level. No forced pause; an optional notice for appointments | NPC absence report, CL6 |
| SUI8 | **One card at a time.** Several live scenes queue in the upcoming strip in time order; cards never stack | UR42 |
| SUI9 | **Lead with meaning** (UR70): the card's first line says what is at stake for you in one sentence; mechanics follow (UR71) | UR70, UR71 |
| SUI10 | **People on the card are links** to their person view (CL36, CL37): where they usually are, why they act toward you as they do | UR43, UR47 |
| SUI11 | **The log line is the receipt.** Every settled scene writes one compact subject-first log line (UR44) through the name resolver, so a missed scene is still traceable | UR44, CAE-E1 |
| SUI12 | **Each new scene kind earns browser evidence** at 1920×1080 on a populated save before it is called done (AD43) | AD43, UR rules |

| Code | Rule (proposed, extends SUI1-SUI12) |
| --- | --- |
| SUI13 | **Every closed scene points onward.** The card's close shows what is next that the player knows of: an appointment, a lead, a person's usual place, each with the travel action and its time quoted (SUI6) |
| SUI14 | **Travel is the real move verb**, with real minutes (district links), never a jump to the next scene. Arriving early means waiting or doing something else; arriving late means the scene settled without you (SUI7) |
| SUI15 | **The route is a place too.** People whose schedules cross the route can be met on the way; a short "on the way" line shows who you passed, at your witness level |
| SUI16 | **Follow mode:** "follow [person]" moves the player with them by the same verbs, at a distance the world sets (shadowing is a skill check where it matters), so watching the lead's day is one action, not many |

| Code | Rule (proposed, extends SUI1-SUI16) |
| --- | --- |
| SUI17 | **Every lead step has a reachable control or a named fold.** A world is UI-complete for a slice when its step table has no unmapped, unfolded step |
| SUI18 | **The next step is findable from the current screen.** Where the lead's next action happens elsewhere, the current screen offers the route (SUI13, SUI14); where it needs an item or knowledge, the screen shows what is missing (SUI5) |
| SUI19 | **Folded actions show their parts.** A folded action's description lists the book steps it stands for, in our words, so the player sees the lead's morning as it happened |

### RPT1-RPT12: what the cast writes into Reports

| Code | Rule (default, dial and reason) | Restates |
| --- | --- | --- |
| RPT1 | **Reuse the existing kinds.** Witnessed canon beats and talks go under events; heard news and off-screen life go under background. A new "People" kind waits for a second consumer (relationships, rumors) and then pays its one `main.js` line under AR1 | AR1, FND5 |
| RPT2 | **Only what the player perceived, at its witness level.** Present: what you saw ("Dunn hands the clerk a sealed file."). Affected: the effect on you. Aftermath: what you find. Heard: marked as told ("Word at the market: ..."). No line about what nobody told you | SUI3, PX49, AR8 |
| RPT3 | **Subject first, compact** (MC1): who, did what, result, place if it matters, in one line | UR44, MC1 |
| RPT4 | **Names as the player knew them then.** Someone not yet introduced is "a tall officer" until you learn the name, and the old line keeps what you knew when it was written. Names resolve through the reference resolver at read time (PL-E2's known limit: the chronicle renders at write time with an empty context, so a read-time render is needed) | CAE-E1/E4, MC note on recorded subject |
| RPT5 | **Movement is not news.** Cast moving by schedule writes nothing. Leaving or arriving writes a line only when the player sees it and knows the person; repeats in one band fold into one line ("Morning: Melissa left for school; the bakery opened.") | MC2, MC3 |
| RPT6 | **Coming back gets a digest.** After idle or away time, one "While you were away" row lists what you could know, grouped by person, with the raw lines kept in the stream | MC4, NPC absence report |
| RPT7 | **No canon labels, no future.** Reports never say what the book did or will do; the "what the book did" overlay is the only place for that | SUI4, sealed-secrets rule |
| RPT8 | **Reports are written once, by the settling event.** Previews, syncs, reloads, re-filters and replays write nothing and never duplicate a line | MC note on re-expansion, AR3 |
| RPT9 | **The log forgets; the person view remembers.** The stream prunes by kind, so a person's history lives in the person view and chronicle (CL38); a report row links there | UR43, CL38 |
| RPT10 | **Book text stays out of the log by default.** The line is the receipt and is ours (SUI11); quoted book text belongs on the scene card and in descriptions (CL144-CL145). Dial: a private-pack world may show a short quoted line for a canon scene the player was present at, marked as from the book | CL144, AD1 |
| RPT11 | **No developer text.** Evidence labels, fill notes, locators and ids never appear in Reports; they live in the inspector (CL19, CL42) | UR73 |
| RPT12 | **Varied but deterministic wording.** Routine lines draw their wording from the world's texture rows keyed by place, band and day, so the same moment reads the same after a reload and different days read differently | CL49, WA37 |
