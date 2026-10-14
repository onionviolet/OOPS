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
