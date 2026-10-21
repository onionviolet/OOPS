# UI rules

Standing rules for every agent that adds or changes player-facing UI. Weibao, 2026-10-15: "save logical rules to address these and more so similar mistakes wount be made again?" Each rule names the mistake it prevents. Accepted direction lives in [PROJECT](../PROJECT.md#standing-priorities-and-document-authority) and [USER_VISION](USER_VISION.md#format-portraits-and-view-decisions-2026-10-14); detail lives in the owners linked below. These rules are defaults with reasons; a world or feature can propose an exception, but it has to say why.

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

## While you build: one look, one way to move

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR6 | **Tokens only.** Colors, radius, fonts, sizes, borders and shadows come from the shared token file. No local `border-radius`, `font-family`, raw colors or `style.cssText`. The UI contract test enforces this | Five corner radii, three font stacks, eight sizes and five button styles on one screen |
| UR7 | **Use the shared components:** group row, info block, button (with a disabled reason), tab, tooltip. Never leave raw unframed text or an ad hoc button style in a list | Rounded dropdown rows, unframed clerk text and dashed versus solid buttons stacked together |
| UR8 | **Own your node.** Register through `definePanel`; never `prepend` or `append` into another panel's element | Four panels pushed into the message log box and buried the combat and event lines |
| UR9 | **One center-mode controller.** Every view that replaces the center opens through it and gets the same back bar pinned at the bottom, labelled with the destination ("← Village"), plus Esc. No feature hides its siblings itself | A back button placed mid-row among actions that Weibao could not recognize; two systems toggling the same nodes |
| UR10 | **Label by destination or outcome**, not by mechanism: "← Village", "Mix one vial · 3 min", not "Back to local actions" | Labels that only make sense to whoever wrote the code |
| UR11 | **Keep the always-visible set intact:** status, current work and the full-height log. Never shrink or crowd the log column | Losing the attack numbers and random event text Proto23 players expect |
| UR12 | **Proto23 is the visual/composition baseline** (square frames, gradient fills, hairline rows, You and focus panels on top, clear inventory/action/log regions). Refactor shared layers toward that hierarchy and space allocation; colors and corners alone do not establish fidelity. Other looks are token overrides, never per-panel styling. [Baseline clarification](UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#proto23-baseline-clarification-2026-10-15) | A rounded, generic style, or a Proto23-colored stack of boxes, that loses the reference's readable composition |
| UR13 | **Nothing disappears silently.** Moving or parking a feature adds a log line and a dot on its new home | Players losing features after a reorganization |

## Before you call it done: check what a player sees

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR14 | **Discoverability check:** at the primary target 1920×1080 on a populated save (1366×768 retired 2026-10-19), can a first-time player name the way back, the current work and the main actions from a screenshot alone? Put the screenshot in the report | Technical proof that a button exists, while the player could not find it |
| UR15 | **Reproduce a reported problem in the player's terms first.** If it does not reproduce, ask what they saw before designing a fix. A report like "no way back" may mean "could not recognize the way back" | Hunting for a dead-end state when the real issue was an unclear label |
| UR16 | **Proof and taste are separate gates.** Report rebuilt, fresh-origin technical proof; leave Weibao's visual-feel acceptance open | Calling a layout accepted because tests pass |
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

Measure, don't guess: UR14 reports include page `scrollHeight` against the viewport and which regions overflow, on a populated save at 1920×1080.

**Viewport targets, 2026-10-17 (Weibao: "yes, check my screen realestate and what is most common?").** Primary design target 1920×1080, the most common desktop size (about half of Steam players and a fifth of all desktop web traffic). Weibao's own MacBook Pro shows about 1800×1040 CSS pixels in a full-screen browser and is checked every round. Floor that must not break: 1536×864 (the second most common size, and 1920×1080 at 125% scaling). 1366×768 was a floor until Weibao retired it on 2026-10-19 (see [USER_VISION](USER_VISION.md#retire-the-1366768-floor-2026-10-19)); no rule requires checking or designing for it. Text at 14px and 21px at each. Extra space at the primary target goes to more useful panels, not larger type. Superseded wording, kept as history: UR14, UR25 and this note measured at "1366×768" only.

## For coordinators and lane briefs

- **UR18.** Every UI lane brief links this file and states the surface type, target viewport, visible outcome and deferred scope (AGENTS.md consistency gates).
- **UR19.** Parallel lanes do not each restyle or place UI on their own. Shared layers (tokens, components, center modes, drawers) have one owner at a time; others consume them.
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
| UR41 | **Choose the navigation scope before the destination.** A person/opponent inspection can replace Focus; character subviews can change You; a short item inspection can be anchored to the item; a place service belongs in its task region. Larger tasks may deliberately expand. Do not route every view into the lower center merely because that is the current controller host. Local pane navigation keeps a clear local return; center replacements still use the one shared controller, destination-labelled bottom Back, Esc and restored place. One ownership/history model governs these scopes; do not bolt on competing movers | Clicking a character, item or log entry always replaces an unrelated lower panel, while its natural home stays blank or duplicated |
| UR42 | **Apply progressive disclosure by task frequency.** Keep frequent facts/actions visible; put specialized details/options behind a clear labelled path. Prefer a small number of meaningful levels. Related choices used together stay together. Tabs switch peers within a pane; Back returns from a drilldown; a menu offers actions. Do not disguise one as another or duplicate the same fact across several simultaneous panels without a useful comparison | Dense main surfaces, arbitrary “More” chains, duplicate names and unpredictable navigation |
| UR43 | **Distinguish preview, pinned inspection, commands and full reference.** Hover is a quick optional peek. Long reading or actionable content needs a stable/pinned route and keyboard/focus access; touch gets an explicit equivalent if later supported. Critical facts/actions never depend on hover alone. A fuller view is available when useful, not automatically the default item interaction. State the anchor, collision placement, dismissal/pin behavior and return destination. Avoid nested popover cascades; preserve combat facts, work, selection and native command guards. Dismissal never silently discards pending edits or commits a command | A disappearing tooltip used as the only action menu, an overlay blocking its source rows, accidental consumption, or every inspection becoming a page |
| UR44 | **Treat the log as a readable stream, not a stack of dashboard cards.** Use compact rows, consistent reading rhythm and restrained separators. Category filters/metadata need not become repeated large headings on every line. Emphasize the meaningful actor, item, number, outcome or discovery rather than making every event a solid color block. Keep semantic text, links, user palettes, larger-text support, follow/unread behavior and the full-height log. Compare a populated live combat/event stream, not only two startup notices | Sparse startup logs looking acceptable while combat becomes a tall wall of repeated labels and clashing color |
| UR45 | **Reference evidence names how the state was reached.** Distinguish original source bytes, native-rendered DEV SEEDED scenes, an actual native interaction journey, natural progression and human acceptance. A lab-revealed/default opponent is not a verified fight or fight-menu route. Inspect relevant source and exercise the actual menu/action before claiming parity. Use varied relevant states, such as populated inventory, equipment/effects, active combat, shop, journal and settings; caption unequal items/progression and preserve the pinned source. Reference screenshots guide composition, not hidden mechanics or a universal rank | A synthetic or default scene being presented as representative combat, or one sparse opening screen standing in for the whole reference |
| UR46 | **Clean hierarchy comes from grouping and alignment, not fewer facts or smaller text.** Give You/Focus/log clear identity, primary status, secondary facts and explicit controls; use consistent label/value gutters, spacing and typography roles. Borders frame regions and meaningful groups, not every fragment. Color and VFX reinforce native meaning with a plain/static equivalent. Inspect the same tasks at desktop1366×768 and actual125/150% text. Row counts and zero overflow support the review but never substitute for visual-feel acceptance | Matching colors while retaining crowded stat cells, oversized log labels, unexplained ornaments or unreadable larger text |

UR41 clarifies UR9: the shared center controller is a requirement for center replacements, not an instruction that every interaction belongs in that center. UR43 does **not** select O1/O2/O3 from the current item-inspection experiment. Hover→pin is an agent recommendation awaiting visual/default-interaction selection.

Conventions consulted: [Apple Popovers](https://developer.apple.com/design/human-interface-guidelines/popovers/) (anchored temporary content, avoid cascading popovers) and [Nielsen Norman Group, Progressive Disclosure](https://www.nngroup.com/articles/progressive-disclosure/) (frequent primary choices, clear secondary paths, avoid excessive levels). Apply their task/space principles to this desktop game; they do not override the accepted Proto23 baseline or native gameplay.

### Native status, subject and event previews, 2026-10-15

**UR47. Reuse meaningful hover descriptions across related surfaces.** Player effects, bars, known opponents, item composition and log subjects may expose compact explanations on hover and keyboard focus. Keep actionable status visible by name or a clearly labelled summary. Show duration, source, stacks or modifiers only when the authoritative public projection supplies them. Use one bounded preview at a time, with Esc, pointer access and explicit commands separate from inspection. Do not manufacture enemy effects, level, intent or hidden appraisal to fill a symmetrical panel. Empty status collections need no ornament. Follow UR43 for pinning, dismissal and longer references.

**UR48. Distinguish an event from the subject now.** A historical log preview explains the recorded event and its known data. A command that opens the current related panel must say so. Do not silently resolve an old actor/item name to current equipment, current effects or newly discovered facts. Keep the stream compact and preserve its scroll/follow behavior while inspecting. Reuse native descriptions or durable event references before adding a separate hover-data model. Subject-specific rich previews remain proposals until supported by their event data and exercised in a rebuilt browser.

### Parity keeps YAIR's reasons, 2026-10-15

**UR49. A difference from Proto23 is a gap only when it has no YAIR reason.** Weibao: "some stuff have reasons to exist for us specifically, like the top bar to make stuff condensed and seeable and more? Some features are specific ways here for specific reasons to better fit our end goal, so we need to establish that accordingly?" Before changing a YAIR choice toward Proto23, find its recorded reason (this file, USER_VISION, PROJECT, the feature owner). If one exists, absorb the Proto23 lesson inside that choice instead of replacing it. If none exists, say so and either fix the choice or record the reason. Parity reports list kept differences with their reasons next to the gaps. [Current register](gm/dispatch/ui-foundation-2026-10-15/PARITY_INTENT_2026-10-15.md). Mistake it prevents: copying Proto23 back over the top bar, knowledge gating, explicit actions or other choices that exist for YAIR's life-sim, many-world and laptop goals.


### Grouping and whole-journey review, 2026-10-15

Weibao: grouping “could be feasible if done well”; keeping the hit counter and links
because they credit upstream or were retained earlier is not a sufficient reason.
Credits may live elsewhere. These defaults extend UR21–UR27 and UR41–UR49;
[navigation candidates and source examples](gm/dispatch/ui-foundation-2026-10-15/NEXT_PARTS_2026-10-15.md#refinement-grouping-chrome-and-the-complete-journey-2026-10-15)
remain proposals, not an accepted grouped default.

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| UR50 | **Permanent chrome earns space through a current player need.** Attribution needs a clear accessible home; it does not require a hit counter, repository/support link or version in the play bar. Preserve LICENSE/attribution and identify upstream/support recipients. Retention by an older round is history, not a new requirement | Defending clutter with precedent or confusing support for upstream with support for the fork |
| UR51 | **Group by player task, preserve fast paths.** Compare grouping against direct access on repeated journeys, discovery and return. UR21 remains the direct-access default; an extra-click replacement requires an explicit accepted tradeoff. A grouped browse surface can complement direct/contextual paths; one canonical route and native eligibility owner serve all entry points | Fewer visible buttons being mistaken for easier use, or several inconsistent copies of a panel |
| UR52 | **Navigation stays stable during interaction.** No tick, discovery, count update or automatic ranking moves a pending target, steals focus or replaces an inspected subject. Known-empty, filtered-empty, known-unavailable and unknown are distinct states; counts and notices use observer-safe data | Clicking the wrong command after a reflow, vanishing category tabs or discovery leaks through badges |
| UR53 | **Transient surfaces have an explicit dismissal and focus contract.** Menus/popovers work by pointer and keyboard; Esc closes the top one before navigating Back, and focus returns to the opener. Outside clicks dismiss without activating underneath. Opening/closing has no gameplay effect and follows the existing simulation policy | Accidental commands, stacked overlays trapping input, and menu refresh interrupting play |
| UR54 | **Control placement follows the task, not a universal strip position.** Compare header, footer and inline tools at actual larger text; keep frequent categories/search recognizable and list context visible. Reuse primitives; generalize a new component only with demonstrated consumers | Moving every filter to the bottom or building a universal kit around one unproved layout |
| UR55 | **State and safety survive condensation.** Truthful save/error status stays visible without opening a menu. Save, backup Export and replacing-state Import retain distinct labels and existing guards. Navigation, filtering and dismissal never execute gameplay or discard edits | A tidy Save menu concealing failure or making Import look like a harmless display setting |
| UR56 | **Summaries preserve meaningful differences and a route to detail.** Enemy groups retain individual selection/identity/known state; repeated log lines retain their recorded events; pursuit summaries read completion from existing owners. Define grouping identity and lifecycle before aggregating | Same-name enemies losing distinct health, compressed logs losing outcomes, or pins becoming a second quest system |
| UR57 | **Review the full journey in changing state.** Exercise finding, switching, inspecting, acting, returning and resuming, including full discovered routes, large text, unavailable targets and relevant failure recovery. Record click/key cost, lost context and useful visible content; screenshots and counts alone do not prove findability or acceptance | A clean opening frame hiding repeated navigation friction or broken return behavior |
| UR58 | **A display preference has an owner and reset boundary.** Define whether it follows this browser, character or world; reconcile route IDs, pins, filters and selection on reload/import/reset. Missing targets get a safe explanation; undiscovered targets stay unnamed. Reuse existing state and migration policy | A different save inheriting another character's reminders, stale routes or leaked discoveries |

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
| UR59 | **A reference keeps its date, speaker and evidence status.** Bind the relevant image/clip to its caption and useful discussion; distinguish shown behavior, developer statement, player suggestion and our inference. Keep alternate drafts and later corrections discoverable. Adapt the useful lesson through the current OOPS owner, naming deliberate differences under UR49. Missing bytes, an unused draft and a later release are different states. New recovered material may correct an interpretation; review the affected rule or example explicitly rather than silently adopting it | Treating a liked tooltip draft as the latest shipped UI, or turning a source joke, formula guess or source-world limit into an OOPS requirement |
| UR60 | **Compose typography, color and frames by reading role.** Use shared tokens for compact labels, numeric comparisons, longer prose, task regions, selection and quiet decoration. MS Gothic is the selected internal default, including prose and controls (2026-10-21 direction); verify the rendered face and per-glyph fallback. The earlier optional compact-font candidate remains historical. Preserve the original launch direction and player/module overrides. Keep full known names accessible, labels on quiet readable backing, and commands stable at actual 14/21px desktop text. Density, glow and world styling are dials whose cost is legibility and distraction | Copying colors without composition, claiming a font loaded from its CSS name, borders crossing values, or shortening a label until its meaning is lost |
| UR61 | **A meter says which question it answers.** Distinguish current pool/capacity, progress/completion, readiness, conditional success, signed contribution/rate, discrete stock, remembered observation and same-subject recent change. Name units, baseline and applicability; a full progress bar is not automatically a warning or eligibility proof. Derive thresholds and comparisons from the owning mechanism and public knowledge, with time/place on stale observations when useful. Keep readable text/static meaning and keyboard Details; an extra contextual resource may appear without moving commands | A 100% success tooltip on an unavailable recipe being read as readiness, a maximum increase being shown as healing, or an old observation being presented as live truth |
| UR62 | **Local reactions follow the actual subject and settled occurrence.** Bind hit, repair, recovery, work completion, weather, household and sound cues to the owner’s public state or receipt and the subject's lifetime. On replacement, load or revisit, reconcile transient cues without replaying rewards or attaching A's pulse to B. The little actor may move while its controls stay still. Motion, sound, humor and intensity are optional dials with static/text equivalents. Distinguish settled animation from a real paused response; bodily competence, serious outcomes and supported sensing determine fitting expression | Fake rescue opportunities, effects deciding gameplay, a scene exposing hidden state, or a forced gag taking away a working method |
| UR63 | **Keep the task's known dependencies and commitment together.** Show the actual target, selected means, input/stock policy, requested amount, progress, stop reason and next move in the task's natural home. Explain attempts versus useful outputs, substitution, interruption, continuation and what is spent/retained/returned through existing owners. Known producer/use links and comparisons name exact subjects and restore the original task on return. A tracked goal reserves stock only through an explicit existing policy; mastery may reduce handling where its mechanism supports that change | A quantity goal silently spending a prized stack, duplicated preview math, navigation discarding intent, or an inverse recipe search revealing unknown content |
| UR64 | **Condense repeated presentation without flattening meaningful change.** Define grouping identity, occurrence count, retention/detail window and preference/reset owner. Keep changed outcomes, subjects and important transitions distinguishable; preserve the actual gameplay result and explain any bounded retained display history. New discovery, recent gain and remembered-versus-current change are different cues. Keep a stable route to available detail and a useful return summary, preserving focus, scroll/follow and known membership. Quiet recurring feedback rather than replaying a backlog of effects | A repeat counter hiding a new consequence, “new” badges pretending to track XP, unbounded detail rebuilds, or a compact log implying a complete archive it does not retain |

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
