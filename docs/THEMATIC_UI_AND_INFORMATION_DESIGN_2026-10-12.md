# Thematic UI, information density and small details

Requested by Weibao, 2026-10-12. Design considerations and proposals only.
No runtime changes, accepted mechanics, implementation dispatch or gameplay
verification. This extends the [UI audit](UI_CONSISTENCY_AND_MODULARITY_AUDIT_2026-10-11.md).

## Current grounding

### Standing UI scope and acceptance gates, 2026-10-13

The [standing UI priority](USER_VISION.md#standing-ui-priority-2026-10-13)
is accepted direction; the theme and layout ideas below remain proposals.
Apply these gates to substantive UI tasks in their existing record, without
creating a separate policy document or a new approval stage:

- Before editing, name the target viewport, concrete visible improvement and
  deferred scope. Use 1366×768 as the default laptop comparison unless the task
  names another target; check other affected desktop sizes as relevant.
  *Update 2026-10-19: superseded for viewport choice. The 2026-10-17 targets in
  [UI_RULES](UI_RULES.md) own it: 1920×1080 primary (plus the other floors
  listed there; the 1366×768 floor was retired 2026-10-19). Wording above kept as history.*
- Bind the task to the relevant accepted direction and design owner. An audit's
  recommendation or inherited mobile criterion cannot expand the authorized scope.
- Before claiming the UI behavior works, rebuild and exercise the changed route
  from a fresh test origin at the target viewport. Record whether the named routine
  controls and information are visible, reachable and readable. Apply persistence
  verification when affected under AGENTS.md.
- Before completion or handoff, reconcile the result and remaining gates against
  the standing direction. Name failed or unrun checks and keep technical proof
  separate from Weibao's layout-feel acceptance. Mobile evidence cannot replace
  the laptop result; affected compatibility checks do not authorize mobile redesign.

PROJECT.md retains the original interface as the baseline. The
[UI checkpoint](gm/dispatch/ui-modularity-2026-10-11/CHECKPOINT.md) reports a
separate redesigned modular-workspace candidate with isolated technical proof;
shared integration and human acceptance remain separate. This document does
not reassess that candidate or overwrite its ownership.

Shared-source inspection found broad native palette variables in `style.css`,
readable action-card components in `styles/action_legibility.css`, and a
structured panel that projects observer-qualified actions, costs and current
work in `src/structured_pack_ui.js`. These are possible integration points,
not proof that thematic switching or the proposals below already work.

## P1: The world, build and situation can each contribute

Use a stable interaction structure with layered presentation. A magical build
in an industrial world should feel different from a mechanic visiting an arcane
academy. Mixed builds should have an identity of their own.

| Layer | Proposed influence | Boundary |
| --- | --- | --- |
| World and local place | Materials, background, header ornament, ambient sound, cultural vocabulary | Reflect the place and what the character can perceive; avoid a hidden-world fingerprint |
| Practiced build and tools | Resource display, technique feedback, equipment diagrams, small motifs | Reflect actual known capabilities and preparation; equipping one wand need not repaint every panel |
| Current activity | Ritual diagram, assembly steps, negotiation details, combat preparation | Emphasize the decision at hand, with stable navigation and return context |
| Personal preference | Theme override, intensity, text size, density, audio and motion | Player control takes precedence over automatic styling |

Theme changes could happen at a meaningful transition or explicit selection,
rather than flickering on every equipment swap. Cosmetic preferences do not
alter mechanics. Whether a theme is freely selectable or discovered through
play needs its own decision; automatic previews must respect sealed knowledge.

### A palette of distinct feelings

| Theme proposal | Visual and sensory language | Useful functional detail |
| --- | --- | --- |
| Scholarly magic | Ink, restrained metallic marks, marginal annotations, fine diagram lines | Known spell structure, preparation and authored notes |
| Wild or embodied magic | Organic shapes, restrained breathing rhythm, irregular textures | Strain, recovery and known bodily changes |
| Ritual practice | Deliberate geometry, ordered marks, quiet staged feedback | Available components, arrangement and interrupt consequences |
| Cultivation | Calligraphic headings, stone/jade accents, restrained flow motifs | Locally understood circulation or bottlenecks; no universal invented meridian system |
| Industrial technology | Riveted edges, warm metal, instrument markings, mechanical clicks | Throughput, heat, wear and supply constraints where the world models them |
| Advanced technology | Clean schematics, diagnostic traces, sparse luminous accents | Sensor provenance, confidence, energy and connection state |
| Hybrid craft | Common base material with distinct magic and machine accents | How the two actually couple, with separate failure causes |
| Ordinary life | Wood, cloth, paper, quiet practical controls | Owned tools, people, commitments and immediate work |

These are original directions, not franchise UI reproductions. Magical feeling
can come from an inscription resolving after a successful practice or a note
gaining a new annotation. It need not mean permanent purple glow. Technology
can feel tactile, improvised, biological or bureaucratic, rather than always
using a blue terminal. Headings can carry decorative type; body text and numbers
should remain easy to scan.

## P2: Density follows the question being answered

The goal is depth that is easy to retrieve. Give repeated decisions a compact
surface, and give unfamiliar or consequential choices enough visible context.

| Information layer | Proposed content | Example |
| --- | --- | --- |
| Always visible | Current place, relevant condition, current work and saving problems | “Assembly paused: no copper wire” |
| Action row | Verb, main result, time, costs, meaningful risk or blocker | “Wind coil · 8 played min · 2 wire” |
| Inspect or compare | Causes, breakdowns, alternatives, cancellation terms and evidence | Why this coil changes output and what it sacrifices |
| Reference | Full rules, histories, source accounts and contextual prose | Workshop notes and prior repairs |

Offer compact, comfortable and inspection presentation, ideally per panel.
Compact mode shortens spacing and repeated explanations before reducing text
size. Tables suit inventories and comparisons; cards suit varied decisions;
prose suits people, atmosphere and discoveries. One layout need not fit all.

Show the values that affect the current decision. A magical practice view may
surface known preparation and strain; a workshop may surface materials and
production constraints. Keep the full character sheet accessible. Do not
collapse distinct concepts such as local rank, mastery, rarity and capacity
into a single power rating.

For uncertainty, show measured, estimated, reported or unknown as appropriate.
Do not supply precise numbers without an in-world basis. Avoid row counts,
blank silhouettes, search results or locked theme names that enumerate sealed
content. Discovery can add a new useful section when knowledge is earned.

## P3: Organize around decisions and continuity

| Player question | Proposed home and behavior |
| --- | --- |
| What can I do here? | Local actions first; routine, exploration and commitments grouped when useful |
| What is already happening? | Compact work strip with running, waiting, paused, failed and finished states |
| What should I prepare? | Character/equipment comparison with relevant modifiers and costs |
| What do I have or owe? | Belongings, storage and commitments with clear custody and location |
| What changed and why? | Filterable journal with links to known causes, people or facilities |

Keep section order stable within a context. New activity should get a calm
marker instead of moving the clicked row underneath the pointer. Allow pinned
resources, favorite actions, known-content search and saved filters. Clarify
whether a filter hides blocked actions; empty results should explain how to
clear it. A selected or pinned row that becomes unavailable should explain why
rather than silently disappearing when that information is known.

Separate run totals from rates, stored stock from held stock, and nominal
output from observed output. Distinguish played time, wall time and offline
progress. A job timer should say which one it uses. Keep broader settlement or
regional views contextual, without implying remote control or omniscience.

## P4: Small details that repay attention

| Detail | Proposed treatment |
| --- | --- |
| Numbers | Stable widths, readable units, consistent rounding; show exact values when a threshold matters |
| Comparisons | Current versus proposed, net change and relevant tradeoffs; qualify effects that depend on location or target |
| Cost quotes | State total versus per repetition; expose affordability and changed quotes before consequential confirmation |
| Completed work | One clear result including gained output or changed condition; distinguish persisted success from an attempted action |
| Microcopy | Specific verbs and blockers; “Need 2 more wire” where known, rather than “Unavailable” |
| Hover details | Also reachable by focus, click or tap; scrollable and pinnable for comparing lengthy information |
| Attention | Group routine loot and repeated messages; keep failures and required choices easy to find |
| New information | Clearable unread markers; inspection does not spend resources or commit a choice |
| Motion and sound | Short event feedback, category volume/mute and reduced motion; no constant pulse on every idle bar |
| Input continuity | Preserve focus, scroll, disclosure state and text selection through refreshes |
| Equipment identity | Owned, worn, loaned, stored and damaged states readable; name identical copies where needed |
| Atmosphere | Brief state-derived local details and personal annotations; avoid repeating flavor every timer tick |
| Recovery | Find hidden panels, reset presentation independently, and keep save/read-only warnings visible |
| Accessibility | Text or icons accompany semantic colors; decorative texture stays away from reading surfaces |

Thematic corruption, cracks or interference can be a presentation effect where
fiction warrants it, but actionable warnings remain legible and the effect
does not overwrite saved layout. Ordinary preferences and game-world powers
remain distinct. An unreliable in-world reading should have a source and
discoverable limitations; saving errors remain factual interface messages.

## P5: Proposed first comparison and acceptance

Start with one existing action panel and preparation comparison shown in an
arcane style, a technology style and a hybrid style. Use the same known facts
and real action semantics so the comparison tests presentation. This is a
proposed future prototype, not an implementation started by this document.

| Gate | Observable result required |
| --- | --- |
| Orientation | Identify location, current work and a next action without searching through background prose |
| Decision quality | Compare two preparations and explain outcome, cost, time and a relevant drawback |
| Stable interaction | Switching themes or refreshing work preserves focus, scroll, pins and action meanings |
| Discovery | Undiscovered fixtures do not leak through tokens, assets, theme menus, search or layout metadata |
| Readability and comfort | Wide and narrow views, zoom, keyboard/touch, high contrast and reduced motion remain usable |
| Runtime boundary | Rebuild and use a fresh test origin; verify preference reload and gameplay save/import compatibility where changed |

Recommended priority: action hierarchy and shared semantics, then thematic
materials and meaningful event feedback, then richer local visualizations.
These priorities are proposals. No prototype, browser check or runtime gate was
run for this document; existing UI candidate proofs retain their own scope.

## Follow-up: fitting the existing interface to the screen

Weibao asked whether the current UI needs scrolling and what to improve.
Source and saved evidence reviewed 2026-10-12, without a new live browser run.
The prior shared-opening audit records horizontal clipping at 1440 px and
scrolling within local actions to reach routine choices. Current shared CSS
still contains fixed widths/positions and multiple explicit scrolling bodies.
This establishes a structural concern, not fresh dimensions for the current
dirty bundle or identification of the browser page Weibao is viewing.

The isolated redesign report records a 1920×1084 document at a 1920×1080
viewport, with core actions in the first screen. Its saved opening screenshot
was inspected for this follow-up. This substantially improves the layout but
does not establish that every progressed state fits, or that it is integrated.
It also shows opportunities to use the first screen more deliberately:

| ID | Observation or proposal | Consequence |
| --- | --- | --- |
| V1 | Routine play should fit the viewport at a declared desktop size and readable text scale | Keep place, relevant vitals, current work, primary actions and critical messages visible together; evaluate usable browser area, not monitor resolution |
| V2 | Candidate headers repeat Collapse/Options; skills and inventory expose several sorting/filter rows | Put layout controls in an explicit edit mode and secondary list controls in a compact menu, retaining accessible equivalents |
| V3 | Candidate opening spends substantial center height on location prose, idle-work status and optional-setting disclosures | Keep location name and brief context visible, expand full prose on request, compress idle work, and group settings outside routine action space |
| V4 | Candidate opening includes sizeable empty list bodies and an inventory/combat switch occupying its own panel | Use content-sensitive default heights and integrate view switches into the area they control; retain deliberate user sizing |
| V5 | Fitting the opening is weaker than fitting real play | Exercise busy combat, crafting, equipment comparison, populated inventory, long labels, ongoing jobs and required choices at laptop sizes as well as 1920 |

The viewport goal does not mean showing every system at once. Keep one active
decision view with switchable secondary sections, and let players pin the
information they regularly compare. Larger screens can show more simultaneous
context; smaller screens should change composition rather than shrink all text.
Do not make navigation or preparation require repeated whole-page scrolling
between the same two controls.

### Proposed scrolling policy

| Surface | Policy |
| --- | --- |
| Desktop gameplay shell | No horizontal page scrolling; aim for no vertical page scrolling during ordinary play |
| Inventory, skills and history | Scroll the long list, keeping its relevant title/filter and selection context available |
| Primary decision view | Keep the action's quote and controls together; use an expanded view when detail exceeds available space |
| Small screens and larger text | Allow readable vertical content and convenient section switching; do not clip content to enforce a one-screen promise |
| Expanded reading | Natural prose scrolling with a clear return to the prior play context |

Avoid a dock scrollbar containing several independently scrolling panels.
Choose one scroll owner per region whenever practical. Prevent refreshes from
jumping a list or moving a button, and show when more content exists. Tooltips,
menus and mandatory responses must remain within usable bounds.

A proposed acceptance matrix includes 1366×768, 1440×900 and 1920×1080 usable
viewports, narrow layouts and larger text/zoom. At ordinary desktop sizes, verify
that the next routine action can be chosen while its costs and current work
remain visible. Also inspect a genuinely populated state and long localized
labels. Reaching this gate requires new rebuilt-browser evidence; this follow-up
adds considerations only and does not alter the existing UI candidate.

## Vivid frame, Proto23 flow, worlds and occasions (proposal, 2026-10-13)

Weibao picked Vivid as his current favorite and asked how it and the Proto23
UI flow should differ per world, fit holiday themes and carry into future
worlds. This section owns that design; the
[V1-V16 considerations](research/proto23/VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md)
are its palette and the
[implementation goal](gm/dispatch/vivid-proto23-flow-2026-10-13/GOAL.md)
carries the first slices. Everything here is a proposal until he plays it.

### Layers, from base to most personal

| Layer | Owns | Changes when | Never |
| --- | --- | --- | --- |
| L1 Scheme (Standard, Vivid, later Light Vivid) | Page, surface lightness, contrast floor | Player picks it | Encodes world or story facts |
| L2 Role tints | One hue per panel role: actions, character, records, log, optional content | Never per world; this is orientation | Swaps between worlds (players find panels by color) |
| L3 World frame | Page hue, accent, header ornament, reveal style, type for headings | Arrival in a world, at a meaningful transition | Previews a world the player has not reached (no fingerprint of sealed places) |
| L4 Place and time | Place header only: dusk, night, season, weather glyphs, local event glyph | In-world clock and weather | Repaints whole panels or flickers on ticks |
| L5 Occasion | In-world festivals from that world's calendar; optional real-date holidays (M3 in the fourth-wall owner) | The occasion starts and ends | Overrides L2 or player palettes; runs without an off switch |
| L6 Character state | Faint vitals-panel edge for low HP, exhaustion, poison, per-world opt-in | Actual state changes | Covers the screen or hides numbers |
| L7 Player Appearance | Explicit per-panel palettes and overrides | Player applies them | Gets overridden by any layer above |

Precedence runs L7 over everything, then L6/L5/L4 as small overlays on the L3
frame, on the L1 scheme. Each layer is a token set (CSS custom properties on a
root attribute) so layers compose without per-panel code, and each tinted
surface is contrast-checked automatically (text 4.5:1, UI edges 3:1).

The seasonal palette in `customization_profiles.js` is a player Appearance
choice today and marks itself as custom, so it suppresses Vivid. Proposed
change: when the season was chosen as "follow the calendar" rather than a
fixed color, treat it as an L4/L5 accent on top of Vivid instead of a full
override.

### Proto23 flow per world

Proto23's best idea is that the interface grows with what you have met. The
mechanism is shared; the gates and the arrival style belong to each world.

- **Shared:** a panel is *discovered* once a real, persisted fact says so
  (first fight, first known person, first recipe). Undiscovered panels have no
  name anywhere: not in the Layout picker, search or counts. Discovered but not
  usable now means a disabled entry with the reason. Discovery is derived from
  save facts, so import and old saves keep what was learned.
- **Per world gates:** the native Village keeps basic character views from the
  start. An amnesiac or stranded start can stage more (Proto23's opening). A
  technology world reveals a sensor or diagnostics panel when you acquire the
  device; a cultivation world reveals circulation when the first breakthrough
  happens; a scholarly world reveals the annotation margin after the first
  book is finished. Unknown-tab silhouettes ("???") are a per-world adjective,
  not a default.
- **Per world arrival:** one reveal hook, several styles. Ink resolving for
  scholarly places, a quiet clank for industrial, a scan line for advanced
  technology, a slow breath for wild magic. Reduced motion always shows the
  final state at once.
- **Crossing worlds:** panels learned elsewhere stay discovered. Where a
  panel cannot work, it stays readable with the reason ("No signal in this
  world") rather than vanishing.

### Holidays and festivals

- **In-world first.** Each world's calendar defines its festivals (LIFE_SIM
  north star). A festival changes the L4/L5 tokens: header ornament, a warmer
  accent, festival glyphs in the place header and the log, special local
  actions. It reads as the world celebrating, so it fits immersion.
- **Real-date holidays are opt-in** under the fourth-wall Real time setting:
  the meta layer (the Cat, title screen, bottom bar) wears them; world panels
  do not, unless the world itself has a matching festival.
- **Small and finite:** ornaments and accents, never role tints or contrast.
  The occasion ends cleanly and leaves a memory record rather than a lingering
  theme.

### Future worlds: a declarative UI card

Each world card can declare its UI with data, so new worlds need no new UI
code. Proposed shape:

```js
ui: {
  frame: {page: '#…', accent: '#…', ornament: 'rivets'},   // L3 tokens
  revealStyle: 'ink' | 'clank' | 'scan' | 'breath',
  gates: [{panel: 'sensors', discoveredBy: 'item:handheld-scanner'}],
  festivals: [{id: 'lantern-night', calendar: 'autumn-14', tokens: {…}}],
  stateEdges: ['strain'],          // L6 opt-ins
  silhouettes: false               // "???" labels for undiscovered tabs
}
```

Acceptance per world: automated contrast over all its tokens, no sealed
name in pickers before discovery, reveal once and never on reload, and a
rebuilt desktop play pass at the standing gates above.

### Take Proto23 panels or mold ours? (2026-10-13)

Weibao: "we can take panels from proto23 accordingly? or mold ours better? since
current character vitals are misaligned." Proposal: **mold ours, using Proto23
panels as the pattern.** Reasons: Proto23 is one file with fixed coordinates and
restore code that replays rewards; its license is unresolved, so copied code or
assets cannot ship; our panels already carry discovery, save, layout and
theming owners. What transfers is the shape: compact label/bar/value rows, one
place header, enemy beside player, list beside detail, tall log. Each panel gets
a pattern note and an alignment check. The vitals panel is the first
(goal item I10); other panels follow by the same rule, and each world's L3
frame decorates the molded panel rather than replacing it.

Shared contract proposal and acceptance template: [Panel kit](PANEL_KIT.md).

## Density, staged disclosure and visual hierarchy follow-up, 2026-10-14

Weibao's feedback: the UI currently feels a little cluttered; consider Proto23's
UI unlocks, flow and color scheme more deeply. This records that feedback and
proposed responses, not approval of a particular redesign. Laptop-first direction
and existing independent panels remain in force. No runtime changes or new
gameplay verification were made in this pass.

### F1: Density includes competing emphasis

Inspected the saved YAIR Vivid 1366×768 capture in
`gm/dispatch/vivid-proto23-flow-2026-10-13/evidence/vivid_1366x768.png`, Proto23's
opening capture in `reviews/ui-density-2026-10-13/screenshots/`, and its
[post-difficulty capture](research/proto23/UI_AFTER_DIFFICULTY_2026-10-13.png).
These are dated evidence, not the user's current browser state. The YAIR capture
has many outlined controls, gold selected tabs, vivid headers, empty sections
and explanatory text competing with the central next action. The inference is
that stronger hierarchy could reduce clutter without reducing useful content.
The captured save-ownership warning is a legitimate critical state, not clutter
to suppress. Proto23's fixed layout and unused space are not a target to copy.

### F2: Reveal work already exists, but adoption is not universal

Current `src/workspace_layout.js` distinguishes discovered, eligible, hidden and
collapsed; it parks undiscovered panels outside named docks. `src/workspace_views.js`
supplies combat discovery gates, and `src/panel_kit.js` exposes those hooks to
panels. Some registrations supply eligibility only, with discovery defaulting to
true. That is not proof of a leak or defect for each panel; inspect its intended
content and host before assigning a gate. Do not create a parallel reveal manager.

The [Proto23 source study](research/proto23/SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md)
corrects the earlier claim: native skill entries reveal on first level-up, not
first XP. Its recipe, action and reference unlock chains provide patterns, not
universal thresholds for YAIR. The earlier
[Vivid/flow proposal](research/proto23/VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md)
contains historical suggestions already partly implemented; current source and
each delivery owner establish status, rather than treating its whole list as new.

### D8–D12: Account for these together

| Code | Proposed treatment | Implementation consequence |
| --- | --- | --- |
| D8 | Separate never-discovered, discovered-but-unusable, currently relevant and user-pinned content | Discovery comes from durable knowledge/progress; current relevance comes from context; saved layout is user preference. A collapsed panel is not an undiscovered panel. Keep known records reachable when their active controls cannot operate |
| D9 | Reserve strongest emphasis for the current decision, critical problems and meaningful change | Retain the Vivid family, calm broad surfaces and inactive tabs, soften redundant borders, and distinguish selected state from gain/money/new/urgent states. Selection can use an underline or edge plus text/icon. Validate the actual palette with screenshots and contrast, not hue names alone |
| D10 | Group by the player's task before adding panel shells | Equipment and inventory can support preparation; journal/history can provide a nearby detail destination. Extend existing regions when appropriate rather than giving every feature a new header. Preserve useful simultaneous views, stable placement, text size and per-region scrolling |
| D11 | Stage both first discovery and the populated experience | A newly learned feature can announce itself quietly and become reachable without permanently expanding every learned section. Do not auto-collapse pinned content, steal focus, move a clicked target or replay unlocks on reload. Essential controls and known actionable costs remain accessible |
| D12 | Separate compact facts from explanation | Keep verb, cost, duration and relevant blocker near the action; put longer context beside the selection or in an explicit detail region. Do not remove meaningful tradeoffs or require hover. Tune group spacing before shrinking fonts or hit targets |

This is a proposal for defaults and emphasis, not a new global rule to hide
previously visible content. Any automatic contextual behavior needs predictable
entry/exit, preservation of the player's selection and a clear way to restore
known content. Do not assume temporary visibility proves permanent discovery.
Restore and import must derive learned state from genuine facts without replaying
rewards, leaking unknown names or overwriting personal layouts. Old-save cases
without adequate facts need an explicit compatibility choice.

### A2: Recommended bounded comparison, later

At 1366×768, compare the existing Vivid presentation with a calmer hierarchy using
the same content/state: quieter inactive navigation and borders, consistent
label/value alignment, clear selected actions, and less repeated panel chrome.
Then separately compare one genuine discovery transition through the existing
panel hooks. Separating those trials distinguishes palette/layout improvement
from the apparent cleanliness of simply showing less early content.

Compare a fresh eligible start, a populated save with multiple learned systems,
combat, and crafting/trade. Frontier is a compatibility case, not a required run
opening. Check where the eye goes, whether the next action and its costs are
clear, and whether inventory/character information remains easy to compare.
Verify keyboard/focus, larger text, manual pin/collapse behavior, reload/import,
no repeated reveals or sealed names, and saving/error visibility where affected.
Rebuild and use fresh-origin laptop evidence before UI behavior claims. Human
judgment of calmness and flow remains distinct from technical proof.

Future direct-interaction work should fit this hierarchy rather than stack extra
boards and controls on top; see the
[play-beyond-selectors proposal](PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md).
No new framework, full UI rewrite, mobile work, implementation dispatch or
additional gate for active waves follows from this consideration pass.

Implementation authorized later in the same conversation, 2026-10-14:
[direction](USER_VISION.md#calmer-vivid-and-progressive-ui-disclosure-2026-10-14),
[delivery report and desktop evidence](gm/dispatch/calm-vivid-2026-10-14/REPORT.md).
That bounded delivery implements calmer emphasis and native reference disclosure;
the broader automatic relevance, layout and interaction proposals above remain
future considerations. The earlier proposal-only status describes the preceding
discussion, not a prohibition on this later authorized implementation.


## Foundation implementation receipt, 2026-10-15

S1–S3 are technically checked in the shared, uncommitted tree. The
[delivery report](gm/dispatch/ui-foundation-2026-10-15/REPORT.md) owns counts,
screenshots, the corrected Q6 discoverability issue, compatibility and limits.
One bottom-pinned destination Back/Esc owner, a dedicated log, shared Proto23
frame tokens/components, observer-safe Village scene/focus and declared Projects
homes are implemented. A bounded nav/history/expand adapter is also present.
The final suite has 1,764 passes, the two baseline cheat-awakening failures and
three TODOs; no overall green-suite or human acceptance is claimed.

The later [composition clarification](UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#proto23-baseline-clarification-2026-10-15)
was read by the foundation writer. Its queued NAV pass still owns consolidation,
remaining navigation/scroll rules and the measured reference comparison. Existing
layout/pin/collapse data is preserved; normal columns still have nested overflow.
Do not treat skin measurements or this technical receipt as acceptance of the
current composition. Visual feel remains Weibao's gate; mobile stays deferred.


## UI engine implications for design, 2026-10-16

Weibao asked to improve engine considerations for UI design and whether that
needed a separate chat. [UIE1–UIE12](ENGINE_EXPANSION.md#ui-engine-support-for-design-and-iteration-2026-10-16)
own the engine gap map; [MP11](gm/dispatch/modular-seams-2026-10-16/BRIEF.md#ui-engine-support-for-the-touched-slice-mp11)
puts applicable checks into the modular continuation. This is a design/engineering
proposal, not acceptance of a visual variant or new standing UI rules.

**UD1, stable inspection.** A subject can have a quick preview, pinned detail
and fuller reference while all read the same observer-safe facts. Important
actions remain explicit and keyboard accessible. Compare a known item, an
unknown object and a historical event when those are the selected subjects;
no requirement to build all inspectors at once.

**UD2, decisions stay put.** Preserve the selected subject, filter, drafts and
focus as stock, work or knowledge changes. When a fact makes an action stale,
update the known explanation rather than silently switching its target. A
removed subject needs a sensible visible fallback, not an invisible selection.

**UD3, disclosure follows task.** Ordinary use stays direct; less frequent modes
and supported experiments have a labelled route. A wide screen can show a useful
comparison beside a task; a tighter desktop region can drill down with a clear
return. Both use the existing navigation owner and preserve current work/log.
Do not enumerate sealed possibilities as unavailable actions.

**UD4, feedback belongs to the journey.** Find, inspect, act, read the result,
return and resume need one coherent story. A fleeting toast is insufficient
for a result the player must use; a persistent error banner for every ordinary
blocked action is excessive. Use the actual command/receipt and relevant local
context without turning every action into a modal or a card in the log.

**UD5, prototype the uncertainty.** Use the existing workbench for a named layout
question on a populated observer-safe fixture at 1366×768, with actual text-size
checks and explicit provenance. Compare against the same state. Prefer current
public components/projections; label pinned older renderers and simplified shell
geometry. No new mockup is made by this considerations pass, and no visual or
native gameplay acceptance is claimed.

## Small contextual bars and everyday interface details, 2026-10-20

**Standing design attention, AD40:** Weibao asked to carry the tiny oxygen
meter, font and related small-detail ideas into future work, then broadened
that to the useful UI families, especially progress bars and message-condensing
options.
[His recorded direction](USER_VISION.md#small-contextual-ui-details-for-future-work-2026-10-20)
owns that preference. **The treatments below are a palette of proposals.**
They do not select a new bar, resource, typeface or implementation queue.
Use them when their owning system is touched, with defaults, dials and reasons.

The [independent source review](research/proto23/UI_AND_PLAYFUL_PRESENTATION_OPPORTUNITIES_2026-10-20.md#round-2-tiny-oxygen-meter-and-identified-font-2026-10-20)
owns the dated oxygen images and MS Gothic identification. New examples here
are OOPS design proposals, not newly discovered Proto23 features. Apply
AD6–AD8/AD17/AD32–AD36/AD38/AD40 and UR34–UR58. Target 1920×1080 at actual
14px/21px, with the other current desktop checks in [UI_RULES](UI_RULES.md).
Mobile optimization stays deferred. Visible aim: make the current constraint,
change and next move understandable with a glance, then offer stable detail.

### Reuse the existing seams; choose the meaning before the shape

Current `src/meter_bar.js` is already a stateless renderer for pool, accumulator
and track specs, with labels, values and notes. `styles/meter_bar.css` supplies
token-driven fills and reduced-motion treatment. Existing callers own the
actual values; a new visual does not need a second resource/save system.
`settled_text_effects` already handles local receipts, while `change_badges`
counts new entries. These are source-supported seams, not fresh native visual
proof or general coverage of every example below.

**Current limitation to account for:** `meterState` treats the high end of
both accumulator and track as near/at the limit. The stylesheet gives those
states warning/limit outlines, and the accessible text says “at the limit.”
That can fit strain or capacity; it does not establish a neutral or successful
completion treatment for a beneficial progress track. Its near-limit default
is one unit from an endpoint, which also need not fit a differently scaled
resource. A selected consumer should get its valence, meaningful thresholds
and words from the owning mechanism. No renderer change or current gameplay
defect is claimed by this documentation pass.

### Bar palette: reserves, work, risk and evidence have different jobs

| Code / kind | Small experience worth trying | Default, dials and reason/cost | Owner meaning and player check |
|---|---|---|---|
| **BD1 · Reserve** | A thin Breath, charge or fuel lane near the task/vital it supports. | Quiet labelled reserve; width, persistence and warning emphasis vary. Saves space while retaining a glanceable constraint; costs a readable inspection route. | Actual spend/refill owner. Distinguish low reserve, blocked replenishment and no applicable resource. A full reserve is ordinarily reassuring, not an alarm. |
| **BD2 · Accumulation** | Heat, strain or buildup fills toward a known consequence; a subtle cooling/release cue shows recovery. | Show the useful known threshold with a marker or labelled state. Intensity and threshold detail follow knowledge. Costs an honest threshold binding; a universal red-at-80% rule may mislead. | The mechanism decides whether more is harmful, useful or both. The player identifies direction and the actual available way to reduce or use it. |
| **BD3 · Completion** | Repair, reading or assembly shows completed work separately from the current stage. | A calm progress fill and a distinct completion word. Smooth/chunked fill follows the work, not decorative preference alone. Costs a genuine work measure. | Define what 100% finishes: stage, attempt, batch or whole job. The player distinguishes completed output from a pending next stage or failed attempt. |
| **BD4 · Useful band** | A temperature, tension or tuning pointer sits against a known useful range. | Mark the supported range and current reading rather than implying that higher is better. Exact bounds, labels and color are dials. Costs a relevant model and knowledge of its useful range. | A world/tool/body owns the range. A changed tool or body may change what is useful. Unknown limits are not drawn as secret exact endpoints. |
| **BD5 · Free, held and proposed** | One stock/capacity reading distinguishes free stock from committed/reserved stock; a separate outline can preview a proposed cost. | Solid current fact, labelled held amount and clearly marked preview, with words/static forms. Costs a little legend space and real reservation data. | No reservation is invented by drawing it. The player can say what is owned, usable now and merely forecast, then see the quote change before committing. |
| **BD6 · Gain and loss** | A zero-centred rate shows net warmth, balance or resource flow to either side. | Clear zero, sign and unit; optional source breakdown. Avoid borrowing a 0–100 reserve shape. Costs a valid shared unit and meaningful current rate. | Native rate owner, qualified by current conditions. Zero rate does not mean zero reserve, and positive flow does not prove a source will last. |
| **BD7 · Stages and charges** | Discrete pips show loaded charges or completed named steps; current work lives within the active step. | Use discrete units when they are real. Labels or unequal segments can explain unequal stages. Costs stage identity; equal pips must not imply equal time when stages differ. | Distinguish a completed step, available charge and learned milestone. Spending a charge does not erase knowledge; filling one stage need not finish the job. |
| **BD8 · Uncertain or stale reading** | A visible estimate range, last-observed marker or “unassessed” label keeps uncertainty useful. | Prefer words and a modest range when supported; an old reading gets its observation context. Costs provenance, not an arbitrary decorative blur. | Observer/forecast owner. Unknown, stale, unavailable and empty stay distinct. A previously seen remote supply is not silently animated as if watched live. |
| **BD9 · Change beside the present** | A brief lost/gained segment shows the previous value while the current fill remains exact. | Quiet short-lived delta, stronger on meaningful change, recorded outcome available elsewhere. Costs occurrence and subject identity. | End/reconcile the transient segment when the represented subject changes. A maximum-capacity change is not automatically damage or healing; include it in the explanation. |
| **BD10 · A chosen batch goal** | A counter/fill shows the actual completed quantity toward the player's chosen target, alongside the current attempt. | Name the unit: attempts, usable outputs or completed tasks. Target and detail are dials. Costs a real batch-intent owner; success chance is not linear completion. | A failed attempt may advance attempts while producing no useful output. Reaching a known target can stop by the selected policy; progress does not promise future random yield. |
| **BD11 · Elapsed time and readiness** | A narrow timeline shows elapsed work and a known next opening, cooldown or due boundary. | Label the owning clock and distinguish time passing from work advancing. Exact time/estimated range follows the model. Costs clock and pause semantics. | A paused job does not fill because wall time passes; a completed timer may mean ready to act, not reward already granted. Queue time and active work remain distinguishable. |
| **BD12 · A continuing routine** | A single-cycle bar resets quietly while an adjacent count states completed rounds and actual output. | Show the current cycle and whether the chosen routine has a stop target. Smooth or stepped progress follows real work. Costs a cycle boundary and a truthful tally. | A reset is not a new failure or a whole-job completion. Stop-after-cycle is distinguished from stop-now; a long routine does not trigger a celebration at every ordinary loop. |

Bar width is not a universal progress measure. Show ordinal stages, qualitative
states or plain numbers when a fraction would invent comparability. Smooth
visual interpolation can ease a glance, but the label and actionable threshold
remain tied to authoritative values. Extreme/overflow values need truthful
wording rather than silently implying that a clipped full bar is the whole fact.

### Other small details: readable, physical and pleasant without another subsystem

| Code / detail | Concrete proposal | Default, dials and cost | Observable check / existing seam |
|---|---|---|---|
| **LD1 · A tool shows its history** | A known nick, repaired seam or wet grip is a tiny mark beside the selected tool. | Derive the cue from an existing condition/material fact. Texture/intensity varies. Costs honest binding; a decorative scratch need not imply a new penalty. | Inspect the same known tool before/after an actual change. Its identity, condition and native effects agree; a spare identical-looking copy does not inherit the mark. |
| **LD2 · A button describes its current commitment** | Start, Stop after this cycle, Resume or Retry quote says the real next action. | Keep the control's position and useful hit area steady as wording changes. Extra consequence text is optional detail. Costs a real command/state mapping. | The label never promises cancellation, retained inputs or an immediate stop that the job owner cannot provide. Free inspection stays separate. |
| **LD3 · Recovery looks different from danger** | A hot tool loses its glow, a tense rope relaxes or a resting posture settles. | Quiet easing toward a static safe state; stronger cues on a meaningful recovery boundary. Costs binding to recovery, not a permanent breathing animation. | Reduced motion conveys the same actual state. Recovery presentation cannot create stamina, remove an injury or advance a paused clock. |
| **LD4 · Output has somewhere to go** | A completed batch briefly names its actual destination: carried, in the chest or left here. | One concise destination in the receipt; optional holder inspection. Costs the real custody result. | Full storage, overflow and a ground pile do not all look like successful pickup. Reopening a receipt cannot move the item again. |
| **LD5 · A stack stays easy to count** | Quantities align while long names wrap or shorten deliberately; a selected row expands its known identity. | Preserve count/unit and the explicit action before ornamental fields. Density and alias are dials. Costs a stable full-name route and larger-text comparison. | Two long same-prefix names remain distinguishable by keyboard; an unavailable quantity is not displayed as zero. Reuse inventory rows and the stable inspector. |
| **LD6 · Change has a baseline** | “Restored 4 condition; now 12/20” or “capacity increased” sits near the changed subject. | Brief delta plus exact present state when supported. Breakdown is optional. Costs the original receipt/baseline. | A full bar after a capacity change is not mistaken for unchanged stock. Historical wording stays about the recorded event, not today's equipment. |
| **LD7 · A paused process says what remains** | A narrow work marker holds position with “awaiting your choice,” “out of input” or the actual supported reason. | Quiet pause state, clear next step and completed/remaining work. Detail depth varies. Costs real interruption semantics. | Reload/resume retains the actual work; animation does not imply continued progress or reveal a hidden cause behind a protective stop. |
| **LD8 · A place responds locally** | Rain beads at a known exposed edge, a lamp steadies in shelter or a small creature follows a real moved object. | One fitting local reaction with a static form. Frequency, world style and sound are dials. Costs a state/event binding and a bounded drawing area. | Controls stay still. An inferred flourish does not become a new weather rule, morale stat or social simulator. Follow actual body/means and world tone. |
| **LD9 · Small words expand when needed** | A compact unit/glyph gains its complete label on focus or stable inspection. | Familiar short forms for repeated secondary facts, full names for active verbs and unfamiliar meanings. Costs a comfortable reading route. | Tiny drawing is not a tiny compulsory click target. Font fallback, glyph distinctions and actual 21px text retain meaning. |
| **LD10 · A sound has a useful cause** | A quiet latch, page turn or completed repair click accompanies its real settled interaction. | Sparse optional local sound; silence/static text remain sufficient. Variation/intensity are dials. Costs coherent meaning and mixing. | No sound queue replays on tab return; repeated ticks do not beep; an unheard/unknown event is not revealed by a semantic sound. Existing effects/settings are the first seam. |
| **LD11 · Return has a small recognizable difference** | A changed familiar tool/place gets one supported line and a route to the record. | A few meaningful known differences, adjustable detail and quiet presentation. Costs an existing return/baseline boundary. | New entries and changed familiar values remain different. Do not call a visible panel “read” or turn badges into another completion owner. |
| **LD12 · A little competence becomes visible** | A practiced action needs fewer fussy poses, a formerly difficult obstacle gets a confident motion, or the traveler protects their lunch during an easy landing. | A fitting brief variation based on actual capability/history. Tone and frequency vary. Costs authored context; preserve powers that already work. | The method stays effective and the controls stay predictable. Humor does not fabricate failure, a debuff or compulsory waiting. |

### UI family absorption: a vocabulary inside OOPS's existing shell

Absorbing the useful families means retaining their mechanism, task and
tradeoff as options. It does not mean every panel uses every form. The
[surface types](UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md) and
[panel kit](PANEL_KIT.md) still own homes and navigation; this map is not a new
surface registry. Source-qualified observations remain in the linked Proto23
reviews. These families include prior exact source reads, dated media and
existing OOPS design, not a new claim of complete media/release coverage.

| Code / family | Useful lesson to absorb | OOPS adaptation and cost |
|---|---|---|
| **UF1 · Bars and compact values** | Put a changing fact beside the decision it affects; express reserve, work and risk differently. | BD1–BD12 and the existing stateless meter are the starting point. Real values, valence, clocks and observer limits need consumer bindings. A new shape does not justify another resource system. |
| **UF2 · Paired actor/context panels** | Aligned headings and relevant comparison reduce repeated searching. | Keep You/Condition and Focus/opponents with OOPS's full stat depth and learned opponent facts. Align questions and gutters, not fabricated symmetrical data. |
| **UF3 · Dense lists and grouped rows** | Regular quantities, meaningful groups, a stable selected row and nearby detail make density readable. | Reuse inventory, skills and native filters. Category, rarity, quality and availability keep distinct meanings. Long names and large text cost room; silently rearranging rows is not a solution. |
| **UF4 · Recipe, job and action workspaces** | Target, means, progress, inputs, result and next decision belong near each other. | Fit the natural task region with explicit commands and existing eligibility/quote owners. Optional larger views help deep planning; the current work and log remain reachable. |
| **UF5 · Preview, stable inspection and full reference** | A quick peek and a long comparison serve different attention spans. | Preserve OOPS's free inspection, live item/slot meanings and separate commands. Hover, focus, pinned/current and recorded-event context are labelled. More layers cost navigation; they need a useful reading task. |
| **UF6 · Two-stock trade/storage** | Show both holders and a clear direction; stable quantities reduce memory work. | Keep native transfers, actual item identities, quotes and selected comparison. Copying a visual capacity, rot factor or resource restriction does not copy its mechanism into every world. |
| **UF7 · Small spatial and physical scenes** | A few meaningful positions, debris or a settling object can communicate height, support or aftermath. | Use a bounded scene inside its home, with a static/text equivalent and stable commands. Actual choice windows and outcomes come from gameplay. Detailed physics, world maps and large art are optional costs. |
| **UF8 · Local actors and ordinary-life texture** | Small caused reactions make familiar tools, creatures and places feel present. | LD1–LD12 fit existing facts/events and tone. An incidental look need not become a relationship/save system; lasting changes need their real owner. |
| **UF9 · Streams, receipts and summaries** | A readable line rhythm, meaningful nouns and reversible compression make frequent events tolerable. | MC1–MC5 below reuse combat occurrence identity and Reports. Compression changes reading density, not hidden knowledge, outcomes or retention truth. |
| **UF10 · Navigation, disclosure and visual style** | Names, staged discovery, tabs, short confirmations, references and type/color roles can make a growing interface coherent. | Retain direct paths, shared scope/history and known-name gating. The existing surface types decide when a threshold screen, task pane or quick confirm fits. Tokens/font/palette variants are options; mystery tabs, click-to-use and a particular frame/font are not universal defaults. |

### Condensing messages: independent options with explicit costs

Current source already has category filters, Hold/Always log follow, Latest,
compact combat wording and adjacent equivalent combat occurrence stacking in
the parity shell. `combatLogKey` distinguishes encounters and outcomes; defeats
do not merge. A selected by-kind presentation can merge same-kind lines while
the occurrence list retains time and opponent ordinal. `addCombatOccurrence`
offers an expandable ×N control. This is source support, not a fresh browser
check or a general-purpose condensation preference.

**Capability clarification from the implementation pass, 2026-10-20:** native
dynamic-loot aggregation already has a settings checkbox and a game-owned
option. Gathering can also emit its accumulated material totals at activity
stop when dynamic aggregation is off. Reuse these counterparts before adding
another loot-summary path. Their exact source behavior and a reproduced
recent-gain attribution bug are recorded as IG1/IG5 in the
[implementation review](research/proto23/UI_AND_PLAYFUL_PRESENTATION_OPPORTUNITIES_2026-10-20.md#round-4-implementation-gaps-behind-the-ui-palette-2026-10-20).

The inspected `display_settings`, shell Reports controls and combat log do not
expose a standalone user choice of Detailed versus Stack repeats. A general
encounter/return digest still needs its actual event consumer; native loot
aggregation and stop totals do not establish that broader route. The stream
currently prunes old lines by category, so
an expandable group is not an unlimited durable archive. Do not promise that
a new view mode can reconstruct previously discarded events.

| Code / option | Example reading experience | Default, dial and cost | Meaning to preserve / player check |
|---|---|---|---|
| **MC1 · Compact wording** | A short actor–verb–result line replaces repeated boilerplate; a fuller recorded description remains inspectable where retained. | Wording density is independent of event stacking. Keep useful names, amount, outcome and units. Costs a clear event-specific grammar and a full-label route. | One event remains one event. The player distinguishes a miss, partial block, critical result and defeat without decoding a color or abbreviation. |
| **MC2 · Stack equivalent repeats** | Several adjacent equivalent hits become one line with ×N and accessible occurrence detail. | Proposed Detailed / Stack repeats choice in existing Reports display settings; retain current behavior until selected. Group by meaningful equivalence; by-kind grouping is an optional deliberate comparison. Costs a correct key and bounded occurrence detail. | Changed result, actor/target identity, encounter or relevant known state is not silently treated as the same event. A multi-subject group must not link an action to one arbitrary current opponent. Expansion preserves scroll/focus and reports what was actually retained. |
| **MC3 · Summarize one activity batch** | A completed gathering interval reads as rounds, actual yields and notable interruptions, with a route to retained details. | Optional view for repetitive chosen work, not a mandatory suppression rule. Group boundary and detail are dials. Costs actual batch/work identity, units and exceptional-event handling. | Do not combine failed attempts into successful output, hide a tool break or omit a required choice. Different qualities/holders and changed methods remain distinguishable where they matter. |
| **MC4 · Encounter or return digest** | A fight/outing summary helps returning attention find the meaningful change rather than replaying every line. | Separate summary pane/row with optional detail; the raw retained stream remains available through its existing home. Costs a real boundary, known facts and provenance. | The digest is a projection, not another reward/quest owner. Unknown causes stay unknown; new discoveries, defeats, actual losses and pending choices remain identifiable. State the retention limit or missing records. |
| **MC5 · Filter and hold the reading position** | Hide routine categories while reading another, hold when scrolled up, show new-arrival count and offer Latest. | Reuse existing controls; filtering/follow are separate from aggregation and event retention. Counts and chosen categories are display preferences. Costs clear active-filter status. | Hidden by filter is different from deleted, summarized or not observed. New events do not move the line being read or steal focus; switching filters does not replay effects or spend time. |

Proposed combination: keep Compact wording available alongside an explicit
repeat-stacking preference; offer activity/return summaries when their consumer
is selected. Detailed can favor sequence, Stack repeats can favor active
combat reading, and a digest can favor return. These are complementary choices
within the same Reports/event ownership, not an either/or product restriction.
No new default is accepted here.

When adding a choice, define whether it affects future emissions, re-renders
retained occurrences or both. Explain old condensed/pruned data honestly.
Preserve event time and known subject as recorded, distinct from the subject
now. Re-expansion/re-filtering produces no new sound, loot, damage or discovery
cue. An unread-event count, visible-row count and ×N occurrence count have
different meanings. Save the preference through the existing browser display
owner and its reset/export/import boundary if implemented. This applies to a
new display-only preference: the existing dynamic-loot option belongs to native
game options, and its setter resets the displayed current-loot tally. Do not
alias the two owners or silently change gameplay save history to support a new
toggle. A filter hides retained reports; Stop combat log skips recording new
matching reports. A future Detailed view must explain those different gaps.

### Future use and more-to-consider disposition

**ACT NOW, done:** saved the general preference in USER_VISION/PROJECT and AD40;
added BD1–BD12, LD1–LD12, UF1–UF10 and MC1–MC5 here; linked the source-specific
review back to this owner; inspected the existing meter/effect/badge and
combat-message seams. This does not promote
each example from proposal to accepted behavior.

**ACCOUNT FOR NOW:** for a touched bar or detail, state its subject, value owner,
observer meaning, direction/valence, useful threshold, current versus recorded
state and nearby action. Consider uncertain readings, interruption, changed
capacity, simultaneous constraints, long labels and missing subjects. Choose a
few that affect the selected journey. A tiny detail does not justify a global
renderer rewrite, a new saved ledger or a set of mandatory features.

**LATER / DELEGATE, none dispatched:** the following are optional bounded
applications, not a new queue. They extend CUI1–CUI5 in the linked source review
rather than adding a second set of implementation candidates.

| Bundle | Capability / effort / trigger | Done check |
|---|---|---|
| BD1–BD4/BD9: one readable meter | Sol low for the meaning/visual comparison, Luna low for a settled leaf; small study, native implementation scoped separately; trigger is an actual selected resource/work consumer. | Same-state workbench comparison, then a rebuilt native journey if implemented: correct label, direction, threshold/finish semantics and current value at 14/21px, with static/reduced forms and stable controls. |
| BD5–BD8/LD4–LD7: one honest commitment/transfer | Sol low/medium for quote/custody/knowledge semantics, Luna low for the bounded view; small to medium; trigger is reproduced planning or interruption friction. | Actual ownership and completed work match the receipt; stale quotes explain themselves; Back/focus return correctly; save/reload/import checks follow any changed persistent state. |
| LD1–LD3/LD8–LD10/LD12: one little physical response | Sol low for cause/tone, Luna low for a settled presentation leaf; small; trigger is an existing native event and a useful stable anchor. | One response per settled occurrence, correct subject through rebind, no simulation change/replay, meaningful plain/static alternative; human review judges whether it feels pleasant or funny. |
| LD11: one quiet return cue | Sol medium for baseline/knowledge semantics; medium; trigger is an existing selected return consumer. | Known changes are explained without inventing causes, new-row hints keep their meaning, pending choices remain paused and missed effects are summarized rather than replayed. |

For MC1–MC5, the smallest proposed application is a Reports comparison of
Detailed and Stack repeats over the same retained encounter, including a changed
target, unequal hit, critical, defeat and an intervening noncombat event. Sol
low/medium for equivalence/retention semantics and Luna low for a settled control
leaf; small to medium, triggered when Reports condensation is selected. Done
when expansion, filters, larger text, keyboard focus, hold/unread/Latest and
preference reset work without invented history or replayed effects. Native
proof remains separate from a synthetic fixture. Broader batch/digest work
waits for its own selected consumer.

Relevant sources/tests were inspected to identify existing capability and limits;
the rules-index check and 36 existing rule-behavior cases pass. Those cases
cover their named existing behavior, not implementation of this palette.
No runtime implementation or browser work was performed here. Rebuilt native evidence and
Weibao's visual/play acceptance remain separate future gates. Use the existing
[mockup workflow](MOCKUP_SYSTEM.md) for an unsettled comparison. The design
palette changes no source font, resource model, saves, bundles or current UI
defaults, and selects no new collector, chat or implementation run.

### Implementation gap pass, 2026-10-20

**Later authorized execution, same date:** the [IG execution receipt](research/proto23/UI_AND_PLAYFUL_PRESENTATION_OPPORTUNITIES_2026-10-20.md#ig-execution-receipt-implemented-candidate-2026-10-20)
supersedes the inspection-only runtime status below. IG1–IG5 have a rebuilt
implementation candidate and passing scoped checks, including the applicable
RUC/PFE/PK fold. Seeded resource rendering and synthetic native loot producer
checks are qualified there; visual/play acceptance stays open. The following
table preserves the original findings, not the latest execution state.

[IG1–IG5](research/proto23/UI_AND_PLAYFUL_PRESENTATION_OPPORTUNITIES_2026-10-20.md#round-4-implementation-gaps-behind-the-ui-palette-2026-10-20)
trace the palette through current producers, consumers and tests. These are
findings and follow-up proposals, not selected implementation or additional
accepted product gates. This dated pass recommends the existing delta-label
fix before the earlier proposed Detailed/Stack comparison for the next selected
message slice.

| Gap | Evidence and consequence | Future use / scope |
|---|---|---|
| **IG1 · Recent loot gain joined by position** | Current producer/formatter probe: A total 5, then B +3, displays the +3 beside A while total stock remains correct. | Small existing formatter/regression leaf; join by actual item ID/key, not row order or name. Native acquisition/browser verification remains open; no fix made here. |
| **IG2 · Meter valence and scale** | Current leaf probe marks unstarted `track 0/1` and full `pool 0.5/0.5` near the limit. One-unit threshold and shared limit words do not generalize automatically. | Define meaningful state/thresholds at a selected consumer/spec seam before expanding progress usage. Preserve existing consumers deliberately; no new generic percentage rule or renderer rewrite selected. |
| **IG3 · Repeat detail can grow behind one line** | A single 12,000-occurrence group retains all labels; opening creates 12,000 rows and the next occurrence recreates 12,001 in the DOM-model probe. | Separate total count from retained/rendered detail, explain any window and update the visible portion stably. No native performance measurement or universal gameplay cap is inferred. |
| **IG4 · Tiny bar needs its full interaction** | Existing renderer has title-only notes, single-line overlay/hidden overflow and three numeric kinds; signed, uncertain, staged and compact-inspection forms need their actual binding. | One current resource/variant first. Check full label, keyboard route, caller node lifecycle and actual larger text before a current behavior claim. |
| **IG5 · Modes have different owners and history** | Filtering, Stop, native dynamic loot, repeat stacking and browser display preferences differ. Occurrences retain HH:MM, not a complete cross-day/world clock record. | Name future-only versus retained re-render behavior; preserve native/display reset boundaries and honestly describe pruned/omitted records. Add only the event identity needed by a selected digest. |

**ACT NOW, done:** corrected the native-loot capability/ownership map, saved
source probes and source identities, and ran seven existing meter/combat leaf
checks, all passing. They do not cover every reproduced case or browser behavior.
**ACCOUNT FOR NOW:** row count is not occurrence count; correct totals do not
guarantee correct delta attribution; a concise time label is not a history
schema. **LATER / DELEGATE, none dispatched:** the linked IG table records
rank, capability, effort, trigger and native done checks. Runtime fixes, a
standalone condensation preference, new resources, bundles and current visual
defaults remain unimplemented by this documentation pass.


## Reference UI and engine fold, 2026-10-20: color, detail and continuity

Weibao asked to fold all the reviewed UI/engine ideas into the existing plans
and consider more subtle interactions before implementing. He likes the source
implementations and coloring. This extends AD40's design attention; **the
following concrete treatments remain proposals**, with the full palette retained.
The [visual/engine companion](research/proto23/ENGINE_AND_UI_DETAIL_CONNECTIONS_2026-10-20.md#plan-fold-and-further-interactions-2026-10-20)
maps PFA001–PFA090, PFE01–PFE30 and the independent UI findings into their owners.
The dated actual-image comparison remains evidence, not a new shell or font spec.

### RUC: retain the vivid character and give each color a job

| Code | Proposed treatment | Meaning, dials and cost | Later observable check |
|---|---|---|---|
| RUC1 | Deep navy/teal task fields, a distinct purple Reports field, luminous readable text, fine separators and sparing warm accents | These observed reference families already have related tokens in `styles/ui_tokens.css`. Retain their vivid identity as an option. Saturation, gradient and contrast are separate dials; a denser panel can stay colorful. The price is testing real content/background combinations. | Compare the same populated state at actual 14/21px; distinguish subject, task, inventory and history without relying on a title alone. Existing player palettes keep their precedence. |
| RUC2 | Separate kind/rarity, selected/focused state and current consequence | A known rare tool can retain its category treatment while condition loss gets a separate small cue. Availability and comparison gain use their actual semantic role, with text/shape. Costs a clear channel hierarchy rather than painting the entire row every color. PFE19. | Select damaged rare gear beside unaffordable common gear, with a favorable comparison. Each reason is identifiable under ordinary and high-contrast preferences. |
| RUC3 | Resource color follows useful meaning and scale | A full repair track can feel complete, a full fuel reserve reassuring, and a full strain accumulator urgent. BD1–BD12 and IG2 own the distinctions. Warmth, danger and progress need not share a red-at-the-end rule. | The same relative quantities in different units retain their meaning; a changed maximum is explained rather than animated as a hit. |
| RUC4 | Local atmosphere changes a bounded scene or accent | Amber hearth light, cool rain edges or material-specific dust can make a task feel situated. They are aesthetic options unless an actual reader supports a mechanical claim. Costs texture and appropriate observer access; no hidden element/rarity fingerprint. PFE20. | Two identically known objects with different hidden properties do not reveal that difference through decoration. A genuinely sensed change may alter the scene. |
| RUC5 | Compose through current theme, Appearance and semantic owners | `display_settings`, `customization_profiles`, `rarity_palette` and shared tokens already cover different roles. Explicit module palettes and high-contrast behavior need their actual precedence preserved; a new scene should consume the result rather than add a competing theme manager. | A manual palette, seasonal setting and high-contrast choice do not make a selected subject unreadable or alter the world outcome. Source presence is not proof of every combination's contrast. |
| RUC6 | Let typography, spacing and small motion complete the style | Distinctive headings/glyphs, aligned quantities, legible aliases, fine frames and a local reaction can work together. Source MS Gothic remains a qualified reference option; no font change is selected. Costs fallback/long-name checks and a complete known-name route. | CJK/Latin names, minus signs, units and focus stay readable at real text size; a font or theme swap does not retarget a command. |

### Fold into the existing UI families

- **UF2/UF5, BD9, LD6:** named comparison baseline, current item versus live slot,
  effective value versus delta and recorded event versus now. The panel kit's
  PK9–PK12 own the interaction detail.
- **UF3/UF6, LD4/LD5:** carried/stored counts, exact copy identity, named transfer
  direction, stable sort/selection and useful full names. Do not reinterpret
  native equipped-versus-carried custody to copy a screenshot.
- **UF4, BD3/BD5/BD10–BD12, LD2/LD7:** requested goal, actual means, free/held stock,
  stage/attempt/output units and exact stop boundary. The making owner owns
  settlement and batch overshoot, not the bar.
- **UF7/UF8, LD1/LD3/LD8/LD10–LD12:** physical scenes, weather/light, tool patina,
  creatures, home, mastery and earned callbacks. Presentation/granular owners
  retain behavior, tone, audience, clocks and recovery qualifications.
- **UF9, MC1–MC5:** preserve all condensation options and the independent IG1–IG5
  findings. Native dynamic loot already exists; its reproduced delta-label
  problem is a future correctness leaf, not permission to replace the log.

**ACT NOW (done):** folded the actual-image and engine findings into the existing
families and recorded RUC1–RUC6. **ACCOUNT FOR NOW:** color/shape/wording cannot
substitute for identity, observer access or a real value reader; cosmetic
variation does not consume gameplay RNG (PFE21), and controls retain the gesture's
subject during reordering or scene motion (PFE30). **LATER / DELEGATE:** existing
CUI1–CUI5, PFB1–PFB5 and IG1–IG5 remain their scoped candidates, with their
capability/effort/trigger/done checks; none dispatched. When selected, compare
same-state alternatives at 1920×1080 and actual 14/21px, then the other current
desktop checks, with quiet/reduced forms and human visual review. Mobile remains
deferred. No concrete palette, default, runtime fix or build order selected.

## Typography, component style and glow implementation, 2026-10-20

Weibao's [later request](USER_VISION.md#typography-component-styling-and-glow-2026-10-20)
now selects a visible presentation implementation: change fonts and UI styling,
including glow, using a fitting treatment for each part. This supersedes the
earlier planning-only boundary for this selected styling work, while the wider
mechanical palette retains its own scope. RUC1–RUC6 remain the design inputs;
exact faces, dimensions and intensity are reversible candidate choices subject
to human visual review. Existing shell/navigation, explicit player appearance
choices and the desktop targets retain authority (AD34/AD40, UR35–UR58).

### TSG: a coherent style with distinct roles

| Code / part | Intended visible candidate | Meaning and boundaries |
|---|---|---|
| TSG1 · Typography roles | A reference-informed Gothic/terminal rhythm for compact headers and interface labels; deliberate monospaced numbers and scene glyphs; readable longer prose | Choose actual available faces and test fallback/real glyphs. Preserve known identity, CJK, minus/percent symbols and actual 14/21px text. The source specifies MS Gothic in qualified saved CSS; today's machine/browser loading needs its own proof. Naming a family does not prove it loaded. No system font installation is needed to create a candidate. |
| TSG2 · Panels and headings | Vivid navy/teal task fields, a distinct purple Reports surface, crisp square frames/separators and visible soft luminous headings/edges | Carry the reference's character through current tokens and component/profile ownership. Use clear solid backing for text. Exact gradients, frame strength and glow are dials; a glow treatment should be visibly present, with a stronger focus/selected accent where fitting. No shell/layout redesign. |
| TSG3 · Resources and values | Crisp resource text and tabular values, readable fill endpoints and a bounded luminous accent/loss/recovery treatment | Consume actual meter meaning and settled native events. Preserve IG endpoint wording, Details identity/focus and RUC semantic channels. A useful full reserve, completed job and dangerous buildup remain distinguishable. Existing effects/reduced-motion settings govern reactions. |
| TSG4 · Inventory, skills and action rows | Deliberate row rhythm, aligned quantities, known category/rarity cues and clear hover/focus/selected styling | Keep long names, quality/condition and exact identity understandable. Focus styling survives ticks, sort/filter changes and keyboard use; decorative movement does not move or silently retarget action controls. Preserve native commands and item knowledge. |
| TSG5 · Inspection, crafting and trade | A distinct title/frame/reading surface, clear comparison baseline and nearby counts/cost/output, with readable control states | Keep stable subject and explicit actions; glow should support the boundary and useful emphasis without obscuring prose. Current item, live slot, recorded event and missing baseline remain distinct. Use actual holders and quotes. |
| TSG6 · Reports and reference prose | Distinctive purple/history character, readable line rhythm and restrained semantic accents; compact metadata uses the numeric role | Preserve new Detailed/Stack, retention, Hold/Latest, filtering/Stop and preference behavior. Long text stays clear through glow/theme changes. Decoration does not replay events, change history or consume gameplay RNG. |
| TSG7 · Controls, settings and empty states | Matching tabs, buttons, inputs, focus rings, disabled reasons and explanatory text throughout the existing shell | Check the less glamorous surfaces too. Current Appearance/module palettes, high contrast and reset/import owners retain precedence. Do not add a competing theme manager or replace explicit choices merely to make the candidate visible. |
| TSG8 · Existing scenes and local expression | Monospaced small-scene text, fitting material/light accents and caused local reactions use the same family of treatments | Style existing scenes/events where available; no climb/pet physics or new world system is needed to demonstrate the presentation. Keep real motion/quiet/static variants and stable commands. Larger fourth-wall effects keep their separate earned role. |

### Selected reference font: MS Gothic, 2026-10-20

Weibao's later specific-font request selects **MS Gothic**, replacing the earlier
fallback-only approximation choice for this reference-font treatment. Read-only
inspection found `/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts/msgothic.ttc`
and its TTC metadata confirms MS Gothic (`MS-Gothic`), MS PGothic and MS UI Gothic
as separate faces. Select the MS Gothic face, not another face merely because it
is in the same collection. The original Office asset remains untouched; use a
local/app-private loading route and keep font bytes outside public source output.
This does not require another downloader or a system-wide font change.

Private [source identity](research/proto23/private/discord-media-2026-10-20/analysis-oops-2026-10-20/plan-fold/font-style-glow/ms-gothic-local-source.json)
records the 9,216,016-byte collection, hash and decoded face names. Existing local
bytes remove the missing-file blocker; their presence does not prove browser
loading, identical versions to Corc's file, or coverage of every glyph. Verify
actual rendered MS Gothic where intended and distinguish per-glyph fallback.
Preserve Appearance, actual 14/21px readability and the TSG role map. The existing
UI implementation chat receives this specific-family selection and source path.

### Selected delivery and scope

Continue through the existing **Implement UI bar and message gaps** chat
(`01a15bc5-de54-7e50-b46c-7419cc27b266`), whose IG1–IG5 candidate already has
its own implementation and browser receipt. This is the next authorized styling
continuation, not a rewrite of that receipt. Reserve shared token/profile/style
areas before editing and coordinate with the connected-system successor being
prepared by the YAIR chat. Use the existing authorized Luna/Sol execution shape
and budget where still valid; no extra parallel chat is selected here.

**ACT NOW:** the direction and TSG1–TSG8 role map are recorded here and sent for
implementation. **ACCOUNT FOR NOW:** check font load/fallback, glow against its
actual surface, all simultaneous semantic roles, large text, selected-subject
identity and player settings together. Source files such as `ui_tokens.css`,
`customization_profiles`, `display_settings` and `rarity_palette` provide existing
seams, not a guarantee of complete surface coverage. **LATER:** unselected
gameplay systems remain in their existing owners; they do not gate this styling.

Done for the implementation owner: a runnable visibly changed candidate, matched
before/after captures at 1920×1080 and real 14/21px, affected current MacBook/
1536×864 checks, actual font/fallback evidence, high-contrast and effects/quiet
settings, keyboard/focus/inspection and relevant preference reset/reload/import.
Reuse valid unchanged IG evidence and add meaningful changed-style checks, then
the required integrated gates once. Record changed paths, inputs and limits in
the existing execution receipt. Do not call a font declaration a font-load proof
or a source-only CSS edit a visible result. Human style acceptance remains open
after technical delivery. This parent chat has recorded/dispatched scope, not
implemented the runtime styling itself.

### TSG styling execution checkpoint, 2026-10-20

The IG1–IG5 receipt remains historical proof. This continuation implements the
later fonts/style/glow request and considers Corc's directly attributed saved
commentary alongside the reference pixels. AD34/36/40, UR6/19/35–38/43/48/49/52/56/58,
AR1–AR16 apply. Surfaces: current native task/list/inspection/Reports/settings
and existing scenes. Same-state before/after at 1920×1080 14/21px, plus MacBook
1800×1040 and 1536×864 affected checks. Shell redesign, mobile and new gameplay deferred.

Ownership: Sol root owns `styles/ui_tokens.css`, `src/component_themes.js`,
shared style integration and owner-document hunks. Fresh Luna-low profile leaf
owns narrow changes in `src/customization_profiles.js`, `src/customization_ui.js`
and dedicated profile regression tests. Another Luna-low leaf reads saved Corc
commentary and owns only its private extraction receipt. No worker descendants.
No edits to main/display, unrelated dirty work, tracked bundles or player saves.
Root retains integration, actual-font/browser verification and review.

Finite continuation budget: two fresh Luna-low invocations, at most two concurrent;
Sol coordinator. Usage refresh 20%; conservatively retain the original cumulative
23% stop boundary for this connected work. No paid/API fallback. Returns <=300
words with source locators, paths, checks and gaps. Selected candidate: an explicit
Luminous Gothic Appearance preset/theme, readable prose and numeric/glyph font
roles, with visible bounded heading/edge glow. Existing saved choices stay exact;
the candidate is applied only on disposable preview state until human review.

### Palette-by-palette implementation checklist, 2026-10-20

Weibao: “Look through each pallette and check off one by one when done.”
All **53 entries** below were read individually. A checked box means the named
presentational slice has implementation and evidence, not that every example in
that palette is built. The original styling checkpoint had 27 checked and 26 open. The later solo
completion pass below supplies native bindings for the remaining 26; all 53 are
now checked at the named bounded treatment, with evidence in the current report. This preserves the full palette while separating styling from mechanisms
that this task must not fabricate. IG1–IG5 retain their own detailed receipt.

| Done | Entry | Current binding / remaining trigger |
|---|---|---|
| [x] | **BD1 · –BD4/BD9: one readable meter** | IG pool states and current-resource readable strip; seeded native resource consumer. |
| [x] | **BD2 · Accumulation** | IG strain states, truthful near/at-limit words and static threshold cue. |
| [x] | **BD3 · Completion** | Native repair/processing work totals, current progress and committed finish receipts; unequal processing work allocations are labelled and outputs settle together. |
| [x] | **BD4 · Useful band** | Condition reads the native one-sided cold threshold/tolerance band; no invented heat-safe boundary. |
| [x] | **BD5 · –BD8/LD4–LD7: one honest commitment/transfer** | Exact native recipe owned/unblocked/blocked groups and non-reserving proposed batch inputs; lamp stock remains separate from paid fuel. |
| [x] | **BD6 · Gain and loss** | Signed native regeneration contributions and actual lamp-minute burn; contributions are not falsely labelled net combat flow. |
| [x] | **BD7 · Stages and charges** | Actual loose oil-flask squares, discrete finite carcass completions and unequal native processing work allocations. |
| [x] | **BD8 · Uncertain or stale reading** | Real previous-visit health/tool observations with their last observed game date, dashed/hatched readout and explicit remembered wording. |
| [x] | **BD9 · Change beside the present** | Same-copy tool gain/loss segment; capacity changes use separate wording, and absence/load clears observation history. |
| [x] | **BD10 · A chosen batch goal** | Finite explicit crafting session goal retains attempts/successes/useful outputs through interruptions; Recheck/Continue and Cancel preserve the native spender. |
| [x] | **BD11 · Elapsed time and readiness** | Native played-time repair/processing totals and remaining work, actual readiness and interruption reasons. |
| [x] | **BD12 · A continuing routine** | Saved finite processing routine, pause-after-current/resume/cancel, exact stop target and actual cross-cycle output tally. |
| [x] | **LD1 · –LD3/LD8–LD10/LD12: one little physical response** | Native per-copy condition/wear/repair/history cues; fitting current facts, without invented material patina. |
| [x] | **LD2 · A button describes its current commitment** | Actual repair/material-return and routine finish-current/resume/cancel labels describe the commitment before acting. |
| [x] | **LD3 · Recovery looks different from danger** | Observed native health/stamina recovery has its own static posture and optional movement; capacity growth is not healing. Full wording is in Body. |
| [x] | **LD4 · Output has somewhere to go** | Native processing receipts and routine tally name carried inventory as the actual destination; chest transfer uses native exact-key custody. |
| [x] | **LD5 · A stack stays easy to count** | Native inventory quantities/full item inspector; wrapping at 21px preserved. |
| [x] | **LD6 · Change has a baseline** | IG1 labels recent gain against the correct native item total; not a condition-history feature. |
| [x] | **LD7 · A paused process says what remains** | Native repair/processing pause reasons and remaining work; finite routine and explicit craft intent survive their stated interruptions. |
| [x] | **LD8 · A place responds locally** | Known rain/lamp reactions and real-state home/fire/cat scene, with optional effects and actual household actions. |
| [x] | **LD9 · Small words expand when needed** | Keyboard Details/full known labels and MS Gothic/CJK/glyph reading routes. |
| [x] | **LD10 · A sound has a useful cause** | User-gesture activation and real WebAudio start reuse the existing effects/sound owner; text remains sufficient. |
| [x] | **LD11 · : one quiet return cue** | Session-only return baseline, complete change Details and dated remembered observations; load clears comparisons. |
| [x] | **LD12 · A little competence becomes visible** | Already-known native skill gains drive authored hand/stance/breath variants in Body, with full cause text in its disclosure. |
| [x] | **UF1 · Bars and compact values** | Current-resource labels, values and meter semantics; no invented resource. |
| [x] | **UF2 · Paired actor/context panels** | Existing You/known-context pairing retained, context typography/style checked. |
| [x] | **UF3 · Dense lists and grouped rows** | Native inventory rows, known categories, quantities and stable inspection styled. |
| [x] | **UF4 · Recipe, job and action workspaces** | Native connected crafting details and explicit batch intent, plus repair and finite processing workspaces; rebuilt real commands exercised. |
| [x] | **UF5 · Preview, stable inspection and full reference** | Native item inspector is distinct from its source row and explicit commands. |
| [x] | **UF6 · Two-stock trade/storage** | Native market purchase and exact-key chest deposit/withdraw verified in rebuilt desktop flows; custody remains native. |
| [x] | **UF7 · Small spatial and physical scenes** | Bounded home illustration reads actual native cat/hearth/furniture state and released finite paid firewood supply. |
| [x] | **UF8 · Local actors and ordinary-life texture** | Known local cat behavior, bond/mood and ordinary household actions; NPC-heavy simulation stays deferred. |
| [x] | **UF9 · Streams, receipts and summaries** | Purple Reports/prose rhythm plus IG1–IG5 retained semantics. |
| [x] | **UF10 · Navigation, disclosure and visual style** | Existing navigation/settings/disclosure retained; native Appearance applies the candidate. |
| [x] | **MC1 · Compact wording** | Existing event grammar retained; source regressions cover outcomes and full wording. |
| [x] | **MC2 · Stack equivalent repeats** | IG exact count, latest-100 detail, fixed snapshot and future-only Detailed/Stack. |
| [x] | **MC3 · Summarize one activity batch** | Actual selected processing routine aggregates settled outputs across cycles and pauses; crafting goal distinguishes attempts, successes and useful outputs. |
| [x] | **MC4 · Encounter or return digest** | Complete session return digest with remembered context and all changed entries in Details; this selects the return branch of the family. |
| [x] | **MC5 · Filter and hold the reading position** | IG Hold/unread/Latest/filter distinctions remain valid; no retention reinterpretation. |
| [x] | **RUC1 · ** | Same-state desktop captures retain navy/teal tasks and purple Reports, with luminous edges. |
| [x] | **RUC2 · ** | Known native rarity hue halo, separate keyboard ring/selection and disabled reason. |
| [x] | **RUC3 · ** | Reserve/completion/danger states remain distinct; crisp values sit above the fill. |
| [x] | **RUC4 · ** | Known local weather/lamp and real furniture/fire/animal atmosphere; no hidden-property tint or invented temperature reader. |
| [x] | **RUC5 · ** | Existing Appearance/module palettes; native reset/import/reload and high-contrast priority checked. |
| [x] | **RUC6 · ** | Actual MS-Gothic face, deliberate prose fallback, numeric/scene roles and 14/21px checks. |
| [x] | **TSG1 · Typography roles** | Actual local MS Gothic face loaded for core UI/numbers/glyphs; mixed prose checked. |
| [x] | **TSG2 · Panels and headings** | Square luminous frames/headings and vivid current-owner task/history fields. |
| [x] | **TSG3 · Resources and values** | Crisp resource/value typography; IG endpoint semantics retained. |
| [x] | **TSG4 · Inventory, skills and action rows** | Native inventory/action rows plus known rarity/selection/focus and unavailable-state roles. |
| [x] | **TSG5 · Inspection, crafting and trade** | Native item inspection, crafting and trade rendered at 21px through their existing owners; quotes/unavailable reasons stay visible, with no horizontal overflow. No trade/craft commit claimed. |
| [x] | **TSG6 · Reports and reference prose** | Purple Reports, readable prose and numeric metadata; no replay or history mutation. |
| [x] | **TSG7 · Controls, settings and empty states** | Native Appearance preset, controls, reset/import/reload; explicit module override and high contrast. |
| [x] | **TSG8 · Existing scenes and local expression** | Existing known-subject scene/weather/glyph styling; no new local actor/physics system. |

Checkboxes refer to source/browser evidence; human visual/play acceptance remains open.

### TSG implementation receipt, 2026-10-20

**Delivered:** the explicit **Luminous Gothic draft** in native Appearance creates
an isolated named profile. Apply uses the existing save owner; original profiles
and explicit module overrides remain intact. The candidate uses actual **MS Gothic**
for core compact UI, numeric bands and scene glyphs, with readable Hiragino prose
and per-glyph fallback. Square frames, restrained luminous headings/edges, navy/
teal task fields, purple Reports, known-rarity halos, focus/selection, disabled
states, inspection/crafting/trade and the current scene share the treatment.
No second theme manager, font installation, new gameplay or shell replacement.
The preset preserves existing effects/season settings. Off and high contrast
remove glow; reduced motion uses the static form with transitions disabled.

**Font identity and pixel question:** source CSS and Corc's own font post identify
MS Gothic. Local original:
`/Applications/Microsoft PowerPoint.app/Contents/Resources/DFonts/msgothic.ttc`,
9,216,016 bytes, SHA-256
`dc68e70dce920b8fc279e56ee86a67950d192d02506515f848dd4d0d12e1bde9`.
Its collection contains MS Gothic, MS UI Gothic and MS PGothic; face 0 is the
requested MS Gothic. Direct table parsing found EBDT/EBLC bitmap strikes at
7–22px, including 14/21. This supports the bitmap-font observation; exact Corc
screenshot pixels still depend on his version, size and rasterizer. No CSS
`image-rendering` trick is claimed to pixelate live text.

The original font is untouched. A private local copy at
`resources/fonts/private/msgothic.ttc` is excluded via `.git/info/exclude`; it is
loaded as the candidate's `OOPS MS Gothic` CSS alias. Browser CDP reports the
actual rendered family **MS Gothic**, PostScript **MS-Gothic**, custom font true
on native inventory names/health and fixture glyphs. Reports/prose deliberately
render Hiragino Sans; mixed CJK text also used PingFang SC where needed. Earlier
Menlo fallback proof is superseded for this candidate. The private binary is
not public source or a licensed redistribution claim. A checkout lacking that
optional private font falls back honestly; no public packaging of it was done.

**Corc's direct rationale considered:** [lighter border iteration](https://discord.com/channels/622495527485046805/811370601129705483/1515294580164264016),
[text-fit tradeoff](https://discord.com/channels/622495527485046805/811370601129705483/1523786295556702389),
[unused alternate/glow context](https://discord.com/channels/622495527485046805/811370601129705483/1556108309105344552),
and [his font post](https://discord.com/channels/622495527485046805/811370601129705483/1176824068851388426).
These are saved attributed comments, not a claim of fresh complete Discord
review. Community HP-readability feedback and Corc's subsequent lighter-border
comment are distinct speakers. His stated glow intent does not make that unused
alternate the chosen/shipped variant. Today this means borders stay outside
values, long prose stays unblurred, fit/readability outrank symmetry, and known
rarity is separate from selection/focus. Three saved context windows and direct
caption records were reviewed; the rest remains unreviewed here.

**Changed paths:** narrow new hunks in `src/customization_profiles.js`,
`src/customization_ui.js`, `src/component_themes.js`, `styles/ui_tokens.css`;
`tests/presentation_style.test.js` and six exact preset-palette data exceptions
in `tests/ui_contract_allowlist.json`. No broad allowlist bypass: all new font/
style declarations live in shared tokens. Tests cover draft immutability,
name collisions/cap, Gothic validation/application, exact module override
preservation and JSON roundtrip. The original IG runtime sources were not edited
for this styling pass. Shared main/display/recipe/engine changes by other chats
are not this task's work.

**Verification:** evidence is ignored/private at
`research/proto23/private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/tsg-style/`.
The frozen `/tmp/oops-tsg-validation/final-review` candidate passed `npm run build`,
**`npm test`: 2326/2326**, and `npm run check:arch` (main −7/display −79/save 0;
6 grandfathered main imports, 226 cyclic edges). Live `check:rules` passed with
one pre-existing untracked gear-document warning. No rulebook/AD change was made
by this implementation, so rule-behavior checks were not applicable. The earlier
live suite passed 2325 checks; a frozen copy was then used because peer source
inputs changed. An initial isolated run lacked desktop/tools dependencies;
those were copied and the final full suite passed. No passing subset was used
to conceal that setup failure.

Matched Default/Luminous captures use the **same final bundle and safe mid
fixture**, at 1920×1080, 1800×1040 and 1536×864, actual 14/21px native profile
sizes, with clocks paused. Page dimensions equal each viewport; affected panels
have no horizontal overflow. Actual native item inspection, crafting and trade
at 21px retain their original facts, prices, unavailable reasons and explicit
commands. Services were opened by native test-driver hooks, not a naturally
played progression/commit. The original source-level event/loot equivalence,
retention/follow/Stop/import fixes remain valid; this pass does not replay them.

Native Appearance reset/apply → JSON import/apply → save/reload restores Gothic.
An explicit serif/light Messages override stays exact. A high-contrast defect
found with that override was corrected through token precedence without mutating
saved choices. Native Effects off and browser high contrast remove blur and
retain white text. Cosmetic application with `Math.random` set to throw makes no
draw, and clock plus **`save.inventories`** remain identical. Correction to prior
probe wording: the old `save.character.inventory` lookup was undefined and did
not prove inventory equality; this receipt uses the actual inventories owner.
Network traces contain only the existing optional missing
`private_packs/manifest.json` request, not a missing font. No page errors.

[Before, 1920/14](research/proto23/private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/tsg-style/before-1920-14.png) ·
[After, 1920/14](research/proto23/private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/tsg-style/after-final-1920-14.png) ·
[After, 1536/21](research/proto23/private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/tsg-style/after-final-1536-21.png) ·
[Rarity/focus role fixture](research/proto23/private/discord-media-2026-10-20/analysis-ui-independent-2026-10-20/tsg-style/roles-14.png).
The role fixture is labelled DEV SEEDED; it uses the actual Appearance and
rarity palette owners without reclassifying a real carried item.

**Checklist status:** 53 entries individually reviewed, **27 checked / 26 open**.
All TSG1–TSG8 styling rows are checked. Open rows retain concrete consumers or
journeys instead of being marked implemented by a color/font edit. The full
mechanical palette stays in its owners. Human visual/play acceptance remains
open, including font/glow intensity and compact labels at larger text.

**Build incident:** one `npm run build` mistakenly ran in the shared checkout,
regenerating its already-dirty `dist/bundle.js`, map and index fingerprints.
Those prior dirty artifact bytes were not safely recoverable from a clean Git
state, so no reset/guessing was used. Subsequent candidate builds stayed isolated.
This task does not claim the shared build artifacts were untouched. No commit,
push, publishing, personal-save access or global font installation occurred.

[Local runnable style demo](http://127.0.0.1:57235/tsg-demo.html): own disposable
origin, explicit safe fixture and real Luminous Gothic profile, no test-binding
bundle. Server PID 83573 / exec session 43000. A pre-existing save on that origin
would be retained. The IG preview server is separate and unchanged. Stop only
this server PID when no longer needed. Source/style reservations are released.

Final candidate identity: bundle SHA-256
`beb55e491eddd020c9455e562d09fb6ea636ef0c3c490418977df51fbeda30a8`;
source/test/style manifest
`1ffb496ea048746d240ccf1ed1cb6521f7b9860655e33253a2697509c50e885f`.
Owned live inputs match the frozen candidate exactly. Other live engine/recipe
work is independent and may keep moving. App preview opening returned `queued`,
so the runnable URL and captured renderer evidence establish availability, not
confirmed delivery in Weibao's foreground window.

Allowance checkpoint: final live shared reading 24%, above the retained 23%
stop boundary (initial IG 18%, styling refresh 20%). Further expansion stopped
on observation; no additional agents or paid fallback. Shared-account movement
includes independent active chats and is not attributed wholly to this task.
Completed artifacts are preserved; the 26 open palette rows remain explicit.

## Full palette implementation follow-up, 2026-10-20

Weibao subsequently requested full implementation with Luna subagents, audit, and root repairs after audit. That later request supersedes the earlier plan-only scope, without making every unresolved reference claim a native fact. The original 27 checked / 26 open count is retained as the styling checkpoint's history; the 53-row checklist above now reflects the later native completion pass.

The [implementation report](gm/dispatch/palette-completion-2026-10-20/REPORT.md) and [row reconciliation](gm/dispatch/palette-completion-2026-10-20/COVERAGE.md) own the current evidence. Weibao then authorized another five included-usage points and requested solo completion, audit and repairs. All 53 named bounded treatments now have implementations; the remaining 26 checklist bindings above were checked individually. The [solo audit](gm/dispatch/palette-completion-2026-10-20/SOLO_AUDIT.md) records native batch/routine intent, discrete/stale/delta readings, caused body/capability expression, ownership refresh and visual repairs. FF3's separately released finite paid firewood implementation is integrated and verified through its native owner. Full examples in every possible world, an encounter archive, NPC-heavy simulation and mobile optimization are not new palette gates.

The earlier AU7 24%→29% stop remains historical. The resumed pass began at 30% with a 35% ceiling, without new subagents or paid fallback. Rebuilt browser/persistence evidence and the required completion checks are in REPORT; human visual/play acceptance remains open.

## Matched desktop detail round, 2026-10-21

Weibao selected a matched Proto23/OOPS comparison, fitting UI repairs, and small
creator/donation/cat details, with base-game source as reference.
[Execution and comparison](reviews/PROTO23_DESKTOP_COMPARISON_2026-10-21.md)
own input identity, screenshots and technical checks. This round applies
AD40, UR49/UR59–64 and the current desktop targets; it adds no rulebook.

| Code | Detail, implication and disposition |
| --- | --- |
| PDC1 | **ACT NOW, implemented:** name the donation recipient and distinguish OOPS's repository from the original games. The inherited “Support me” went to Miktaew. Menu now names him, retains his cat and exposes both original games. Launch retains onionv's own edited guinea pig. All artwork stays local; external links are explicit user actions. No guessed Corc donation recipient. |
| PDC2 | **ACT NOW, implemented:** a popup's rendered width can differ from its requested width because of min-width and typography. Place the actual box, and let a wrapped toolbar take its real height. Keyboard/focus access and viewport containment are the observable gate. |
| PDC3 | **ACT NOW, implemented:** a recipe short of materials is still an inspectable subject. Remove disabled-control dashed framing from these rows; keep native readiness, blocker detail and the actual Craft guard. Category peers use one horizontal strip at larger text instead of spending another row on one tab. |
| PDC4 | **ACT NOW, implemented:** a small static Moss face belongs beside the actual known mood/posture/history. Rendering and opening history do not pet, bond, consume stock or advance time. Existing native interaction remains the action route. Reduced motion has the same static meaning; custom world pets are not inferred from this local household. |
| PDC5 | **ACT NOW, implemented:** keep encounter values and the purse readable at laptop21px. Long known milestone text wraps inside its column instead of widening the encounter grid; inventory header peers wrap instead of clipping money. The numbers still come from their native owners. |

**ACCOUNT FOR NOW:** compare equivalent tasks rather than inventing equal game
state. Proto23's fixed coordinate layout and smaller fact set do not justify
shrinking OOPS text, hiding additional systems or replacing its navigation.
Both source/font identity and actual rendered geometry matter. Private local
Gothic assets remain a delivery dependency; the ordinary fallback remains.

**LATER, optional:** richer cat motion/sound needs a selected visual treatment
and an actual settled native pet/play occurrence through existing cue owners.
Done check: no replay after load/reopen, no cue on mere inspection, plain text and
reduced-motion/silent equivalents. This is a possible presentation follow-up,
not an unfinished gameplay system or a prerequisite for this comparison.
