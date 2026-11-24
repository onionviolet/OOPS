# OOPS design grammar (proposal, AD32)

Status: proposal. Weibao asked for "a custom/us specific design language to follow through and make sure everything is similar quality" (2026-11-24), then "polished and broad ... some sort of identity somewhere but thats low priority". So this file aims at consistent polish across every surface first. Identity is one short optional section at the end.

What it is: a naming of the primitives the game already draws, with one implementation each, their states and the DESIGN.md and UI rules lines they satisfy. DESIGN.md ([DSG1-DSG19](../DESIGN.md)) stays the owner of taste; [UI_RULES](UI_RULES.md) stays the owner of tokens and component mechanics. This file adds no rule. It says where each rule lives in code and shows it working.

Proof: the live kit at [prototypes/design-kit/index.html](../prototypes/design-kit/index.html) imports the real components below in Graphite and shows each state (screenshot: [kit.png](representations/evidence/design-kit-2026-11-24/kit.png)). The kit replaces the pre-Graphite [round 14 kit](../prototypes/ui-kit-2026-11-15/README.md), which drew its own copies. The code inventory behind the table is [UI_GRAMMAR_INVENTORY_2026-11-24](audits/UI_GRAMMAR_INVENTORY_2026-11-24.md); this file reconciles with its duplicate list (section "Duplicates", below). Per the [atlas audit](audits/ATLAS_PLATFORM_AUDIT_2026-11-24.md) (L1), nothing here blocks the atlas and nothing asks for a full rebuild: the first move is to stop adding new copies.

## The rule of the grammar

A surface is built from these primitives or says why not. A new feature calls the one implementation; it does not draw its own. A second implementation of a primitive is a defect to fold into the winner, not a variant. Every primitive has the same four states: empty (says how to fill it), unknown (a `?` or words, never a blank), disabled (says why, beside the control) and loading or changing (stable frame, no moved focus). The tokens come from [styles/ui_tokens.css](../styles/ui_tokens.css): spacing `--ui-space-1..7` (UR65), controls `--ui-control-sm|md|lg` (UR66), layers `--ui-layer-*` (UR67), type `--ui-type-*`, `--ui-line-*`, `--ui-weight-*` (UR68), motion `--ui-motion-*`, state colour `--ui-state-*`, and the Graphite palette `--graphite-*` through the shared tokens (DSG2). No literal colour, pixel size or timing in a primitive.

## Primitives

Winner = the one implementation to extend. States: E empty, U unknown, D disabled with reason, L loading or changing.

| # | Primitive | Purpose | Winner (file, export) | Tokens | States | Satisfies |
|---|---|---|---|---|---|---|
| 1 | Box | A framed, headed section; the place a feature lives. | `src/ui/panel_sections.js` `panelSection` for sections inside a panel; the panel frame is `makeShell` in `workspace_layout.js` (not exported) and `definePanel` in `src/panel_kit.js` registers it. `ui/control_box.js` is a different thing (a popover of controls). | `--ui-space-*`, `--ui-panel-fill`, `--graphite-rule` | E: a line saying how to fill it. U: section hidden until known (UR82) or says "not yet". D: the section's controls carry reasons. L: frame keeps its size (UR144). | DSG1, DSG6, DSG9, UR1, UR8, UR32, UR144 |
| 2 | Row | One fact: label, value, where it comes from, optional action. | `src/ui/kit.js` `kitRow`. Second shape `infoRow` in `panel_sections.js` (label, chips, actions, "Why" disclosure): keep until kitRow gains chips and a disclosure, then fold. | `--kit-gap-*`, `--ui-muted`, `--ui-state-near` | All six kit states (empty, near, ready, running, unknown, crowded); D via `reasonLine` beside it. | DSG1, DSG10, DSG11, UR26, UR52 |
| 3 | Verb row | A thing you can do, in a fixed place, with a Ready mark. | `src/ui/kit.js` `kitVerb`, ordered by `src/ui/action_verbs.js` `ACTION_VERBS`; marks written by `ui/verb_marks.js`. | `--ui-state-ready|near|far|blocked`, `--ui-control-md|lg` | Mark: ready, near, far, reason (word plus shape, not colour alone). D: native `disabled` plus `reasonLine` or `locked_control.js` `setLocked`. | DSG7, DSG10, UR37, UR66, UIV1 |
| 4 | Fold | A thing's inner life, unfolded in place: nested `+` and `-` folds of live state. See "The Fold". | `src/ui/fold.js` `createFold` (new, this round). Duplicate: `ui/creature_record.js` (one creature only). | `--ui-space-*`, `--ui-hairline`, `--ui-muted`, `--ui-control-sm`, `--feel-focus-ring` | Known, estimated, unknown (observer-limited words), empty (how to fill), sealed (disabled with a reason). L: open state and focus survive `update()`. | DSG3, DSG8, DSG9, DSG10, UR26, UR41, UR43, UR52, UR72 |
| 5 | Glyph token and chip | A compact mark for a kind, a state or a filter. | Chip: `kitChip` in `kit.js` (duplicate `chip` in `panel_sections.js`). State marks: `FIGURE_STATES` in `ui/figure.js`. Ink by meaning: `ui/semantic_ink.js`. The DSG4 CJK kind glyph has no shared component yet (gap G2). | `--ui-accent`, `--ui-muted`, `--sem-*` through semantic ink | Pressed or off (a filter), guess (dashed), count. A glyph always has its word beside it on first sight (DSG4). | DSG4, UR37 |
| 6 | Meter | A pool, accumulator or track against a maximum. | `src/meter_bar.js` `createMeterBar` (kinds pool, accumulator, track). Duplicates: `ui/bar_semantics.js` (native vitals), `ui/combat_display.js`, `ui/relationship_web.js` bars. | `--ui-meter-*`, `--ui-type-*` | ok, low, empty, near the limit, complete, discrete steps, unknown (no fill, no value announced), stale (last observed). | DSG7, UR41, UR61, UIV6 |
| 7 | Number known, estimated, unknown | A figure the life may not know. | `kit.js` `kitNumber` over `ui/known_number.js` `knownNumber` and `knownNumberNode`. | `--ui-muted` for unknown | Known `12`, estimate `~12`, range `10-14`, unknown `?` with the field in the title. | DSG3, DSG10, UR72, UR157, PS130 |
| 8 | Report line | One line of what happened, in the world's voice with the useful part. | No shared component (gap G1): `display.js` builds lines inline. Pure helpers exist: `report_repeats.js` (x2 folding), `ui/report_filters.js` (kind filters), `world_report_voice.js` (flavour plus useful part). Winner to create: one `reportLine({kind, text, voice, repeat})`. | `--log-kind-*`, `--ui-space-*` | E: the empty-log note (`reports_dock.js`). Repeats fold, changed outcomes stay distinct (UR64). | DSG13, UR43, UR56, UR64, RPT1-RPT14 |
| 9 | Map node | A place, person or step in a drawn structure, with a text twin. | `src/ui/figure.js` `renderFigure` with layouts from `ui/figure_graph.js`; specs from `ui/walk_map.js`. | `--ui-state-*`, figure state marks | current, filled, empty, guessed, unknown, each with a mark and a word; text form always present. D: edge `unknown way`. | DSG5, UR37, UR52, MDL2 |
| 10 | Motion beat | One short response to one meaning: ready, new, grew, hit. | `styles/feel_finish.css` keyframes and `--feel-*`, driven by `ui/feel_finish.js` data attributes. | `--ui-motion-fast|normal|settle|ease` | Off under reduced or effects off (tokens go to 0ms). Never moves layout or focus. | DSG3, UR72, DL10 |
| 11 | Tooltip | The peek: title, label and value lines, a note. | `kit.js` `kitTooltip`. Duplicates: `item_card.js` and the `display.js` tooltips (DY15: unify to one mover). | `--ui-tooltip-fill`, `--ui-layer-popover` | U: a `?` value line. D: a reason line. Hover previews, click pins, nothing critical on hover alone. | DSG8, UR43, UR74 |
| 12 | Inspector | The selected thing, read in one place. | Content: `ui/field_record.js` `fieldRecord` plus Fold. Placement: `ui/inspector.js` (moves a view's detail node into the left box). Duplicates: `chain_inspector_ui.js`, `known_things.js` detail. | `--sem-record-*` | Observer-limited records (`?`, "not known yet"); empty says what to choose (UR143). | DSG8, DSG11, UR41, UR43, UR74 |

Also shared and not repeated here: tabs (`ui/box_tabs.js` for boxes that take a world's tab; `reference_kit.js` `createTabs` for an ARIA tablist; keep both, they differ in who owns the slot), the control reason line (`ui_components.js` `decorateActionComponents`, `locked_control.js`), the status line and day strip (`ui/status_line.js`, `ui/day_strip.js`) and search (`ui/search_field.js`).

## The Fold (the cat inspector)

The source image is one creature line, "calm brown kitten", with `+ body` and `- thoughts` folds; the open fold reads as the creature's live inner state, and it is funny. Four ideas: a thing has an inner life, it unfolds in place and nests, the inner life is live state not description, and the voice may be whimsical (DSG3).

`createFold(doc, spec)` in `src/ui/fold.js` is the shared form. The spec is `{key, label, summary, state, open, lines, folds, unknownText, emptyText, reason}`:

- A folded row says what is inside (`summary`, UR26); an unknown fold shows `?` and says in words what the observer cannot tell yet. It never carries the true value (UR72, DSG10).
- A sealed fold is a disabled head with its reason beside it; it does not open.
- Lines take plain text or `{label, value, how}`; numbers draw as known, estimated or unknown through the number primitive.
- `update(spec)` redraws live values. Open state is kept by path and focus returns to the same fold, so a tick never closes what the player opened (UR52).
- The `+`/`-` mark is a real element, not `summary::before`: `#main_content summary::before` in `ui_tokens.css` is the 24 px touch-target pad and any custom marker on it collides (see finding F2).
- The dev atlas feeds it true state; Known things feeds it observer state (one read model, two observers). Thoughts text comes from state and the world's voice, never from a free-floating flavour line.

Tests: `tests/fold.test.js`. Styles: `styles/fold.css` (tokens only; on the not-loaded-on-purpose list until a panel adopts it).

## Voice

- DSG3 whimsy lives in the text, not in new chrome: warm, dry, curious; characters keep their own register; commitment terms stay clear (cost, time, risk). A joke never replaces the useful part (DSG13).
- Numbers are known, estimated or unknown, in that exact vocabulary: `12`, `~12` or `10-14`, `?`. Never a blank, never a fake zero. Unknown names its field on hover.
- A reason is plain words, once, beside the thing that is greyed. A sealed cause reads "not yet" without the truth.
- Meaning before numbers (UR70-UR75); one description reused across hover, pinned and list (UR74).

## Quality bar

A feature UI is polished when each check below passes at 1920x1080 in Graphite with a screenshot. Today these are accepted text with no tooling (R18 in the atlas round 4). "Check" is what a reviewer or a future script looks at.

| Line | Check (concrete) |
|---|---|
| DSG6 home | The panel is registered through `definePanel` with a surface type in `LAYOUT_SPEC.surfaces` (already tested by `ui_contract`); it is not a block dropped into Local actions. |
| DSG7 glance | Collapsed, the box or its header shows one line of status (a count, a meter, a mark). Folded groups show a summary (UR26). |
| DSG8 details one click away | One click pins what hover previews; Back and Esc return; nothing critical needs hover alone. Tab reaches it with a visible focus ring. |
| DSG9 empty state | With no data the panel renders a sentence that says how to fill it, and unknown renders `?` or words, never an empty box. Distinguish known-empty, filtered-empty, unknown (UR52). |
| DSG10 reason on grey | Every disabled control has visible reason text beside it, observer-limited. Grep for `disabled` without a reason line. |
| DSG11 one home per fact | Each fact appears from one read model; any second place is a labelled summary with a route to the owner. Compare two screenshots for conflicting numbers. |
| Polish (added) | No literal colour, spacing, size or timing in new code (the contract test, grandfathered list only goes down); each new surface uses a primitive above or names the missing one; states for all four (E, U, D, L) are shown in the feature's kit row. |

Suggested tooling (warning first, nothing here is a gate): a receipt per feature home (UR76 card, screenshot, one line per DSG6-DSG11), the contract-exception count reported each wave and only going down, and the kit page as a pixel baseline in `check:visual` (atlas DC1, DC2, DC4).

## Duplicates and gaps

From the inventory: row (`kitRow` and `infoRow`), chip (`kitChip` and `chip`), tab (`box_tabs.js` and `reference_kit.js`). Found while building the kit: meter (four bar drawings), tooltip (three), inspector content (three), fold (`creature_record.js` and the layout meaning of `panel_folds.js`, which is unrelated; a different name would avoid confusion), box (section, frame, control box).

Gaps with no shared component: G1 report line (inline in `display.js`), G2 the CJK kind glyph (DSG4), G3 the panel frame is not exported. Findings:

- F1: in Graphite, `skin_graphite.css` sets `.meter-bar-track {height: auto}`, which collapses `createMeterBar`'s 4 px track to nothing, so world meters draw no bar (the kit shows it). The rule was written for native vitals bars. Needs the owner of the Graphite skin.
- F2: `ui_tokens.css` `#main_content summary::before` (touch-target pad) overrides `.creature-record summary::before`, so the cat record's `+` marker renders as a large pale block in the kit. Fold avoids it with a real element.
- F3: the spacing tokens read `--custom-size`, which only `applyCustomizationProfile` sets on a `.customization-module`. Anything rendered outside a module (a new pop-out, a test page) gets zero spacing silently.

## Identity (later, optional)

Low priority by Weibao's word. When the polish above is in, identity can be one small layer: the Graphite look and the bitmap Gothic face are already the recognizable part (a Discord note: the game's charm is its font and colour scheme; DY30). A per-world dial (an almanac or ledger metaphor, ID2) stays per world, not the language (DSG18). The kit adds no flourishes for it now.
