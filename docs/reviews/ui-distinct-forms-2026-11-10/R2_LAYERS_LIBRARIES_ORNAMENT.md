# R2: layers, libraries, ornament and motion (research lane, 2026-11-10)

Status: research proposal under AD32, not accepted direction. Owner of the levels: UR98 and
[UI design core audit Round 40](../../audits/UI_DESIGN_CORE_AUDIT.md). Evidence marks: **V** = read on the
cited page this session; **T** = third-party tracker or snippet; **U** = from memory or inferred, verify before relying.

What the repo has today (read first): `src/ui/figure.js` validates one spec (rings, nodes, slots, tracks, edges,
notes, legend) and draws inline SVG; `figure_graph.js` is pure layout (chain, tree, wheel, web, list) returning
`at:[x,y]`; `figure_forms.js` reads the same spec as table, matrix and sentences; `rite_figure.js` maps a rite onto ring
slots with a semantic `role` per mark "so a later motif pack restyles it". Motion today is CSS (`data-effects`
off/reduced switches it off in several sheets), one WAAPI user in `settled_text_effects.js`, and canvas ambient layers in
`particles.js`. `package.json` has one runtime dependency (inkjs). Worlds are keyed by `data-world-family` in
`styles/ui_tokens.css`.

## A. How others layer a declarative diagram system

### What the references do

| System | Layering that matters to us | Source |
| --- | --- | --- |
| Vega-Lite compiles to Vega (V) | A small high-level grammar (data, transform, mark, encoding, composition, parameter, config) compiles into a lower-level full spec. The author writes the short form; the low level stays available. Config works like a theme. | https://vega.github.io/vega-lite/docs/ |
| Observable Plot (U) | Marks (dot, bar, text, link) are the unit; scales and facets are shared across marks; new mark types are small functions. Domain charts are compositions of generic marks, plus a mark you write when none fits. | https://observablehq.com/plot/features/marks (fetch rate-limited, so **U**) |
| React Flow (V) | A `nodeTypes` registry maps a type name to a custom component; the library supplies position, selection, drag and handles; the node body is yours. Domain shape lives in the registered component, interaction lives in the shell. | https://reactflow.dev/learn/customization/custom-nodes |
| JointJS (U) | Model cells with `markup` and `attrs`, extended per shape; ports and links are shared. Same split: shared behaviour, per-shape markup. Page fetch redirected, not read. | https://docs.jointjs.com/ |
| Excalidraw + Rough.js (V) | One scene of plain elements; the "hand-drawn" look is a render-time style applied by Rough.js (pinned `roughjs 4.6.4`), not a different data model. Material is a renderer choice. | https://github.com/excalidraw/excalidraw/blob/master/packages/excalidraw/package.json |
| Token design systems (T) | Three tiers: primitive tokens (raw values), semantic tokens (intent, swapped per theme), component tokens (mapped to one widget). Small systems may collapse to two tiers; a component token that skips the semantic tier is a smell. | https://nathanacurtis.substack.com/p/naming-tokens-in-design-systems-9e86c7444676 (not read directly; summarised by search) |

### What maps onto L0 to L5

- **Vega-Lite's compile step is our adapter.** Our rule "an adapter maps domain data to an L3 form, not straight to L2
  geometry" (UR98) is the same move: short domain spec in, full figure spec out. Default: each L3 form owns a
  `compile(domainData) -> figureSpec` function that is pure and unit-testable (as `rite_figure.js` already is). Dial: a
  form may emit extra drawn parts that no L2 layout knows. Reason: Vega-Lite keeps the low-level spec reachable, so
  nothing is trapped behind the high level.
- **React Flow's registry is the L3 router.** Default: a `FORM_TYPES` registry, `{altar, vessel, meridian, caseboard}`,
  mapping a form id to a renderer and a text form. The figure spec's current `kind`-less shape stays valid as the
  generic fallback form. Dial: how many forms exist. Reason: lets the "adapter produced an L3 form id" check in the
  audit be a lookup, not a judgment.
- **Token tiers map onto L0 and L4.** Primitive tokens are L0 (palette, spacing, type strikes). Semantic tokens are
  the `role` field the adapters already emit (`sequence`, `step`) resolved through `data-world-family`; that is the L4
  hook. Component tokens are per-form (the altar's candle colour). Default: three tiers, L4 only overrides the semantic
  tier and the per-form tier, never L0 primitives. Dial: a world may add a primitive (its own paper colour). Reason: the
  common failure named in the sources is component tokens pointing at primitives, which makes a world re-skin touch
  every form.
- **Excalidraw's split is the L4 contract.** Data stays the same; material is applied at draw time. Default: L4 is a
  `dress` object (`ink`, `stroke style`, `ornament set`, `motion signature`) passed to the renderer, so the same altar
  spec draws as chalk, jade or terminal. Reason: keeps "every world dresses one form" cheap (the audit's
  combinatorics point).
- **Shared vs distinct, one sentence each.** Share: marks, tokens, interaction, knowledge filter, text form
  (cross-cutting). Distinct: composition (L3) and dress (L4). Atomic-design language ("atoms, molecules, patterns")
  also fits: L1 atoms, L2 molecules, L3 patterns. **U**, widely taught; no single source fetched.
- **Grammar-of-graphics idea to copy (default):** separate "what field drives what visual channel" from "what shape".
  For us, a form declares channels (state to glyph and colour, risk to weight or smoke, knowledge depth to
  opacity/dashing) so a world can remap channels without touching geometry. Dial: only for channels already in
  the spec (state, effect, role). Reason: UR37 requires every state to carry a glyph and a word, so a channel remap
  must never drop the word.

### What not to copy

Vega's full expression language, React Flow's runtime graph editing, and JointJS's heavy model layer. We draw
read-mostly figures from data; editing is rare. Default: stay declarative; dial: the case board may need drag
(`figure_interact.js` already covers selection).

## B. Libraries

Framing: the repo allows a new dependency when it saves real work (LLR31 lifted per the brief). Everything below runs in
WKWebView (Safari engine); Tauri on macOS uses it. Default bar: under about 10 kB gzip, MIT, tree-shakeable or one
function, and a concrete code deletion or a look we cannot get otherwise. Sizes are min+gzip.

| Library | Size | License | Maintenance | Safari/WKWebView | Replaces | Call |
| --- | --- | --- | --- | --- | --- | --- |
| **Web Animations API** (native) | 0 | n/a | browser | `Element.animate`, `finished`, `commitStyles` in Safari since 13.1 (**U**; check MDN compat table) | hand-rolled CSS class toggles for settle motion | **Adopt (already used once)** |
| **Motion** (`motion`, ex Framer Motion core) | `animate` mini 3.2 kB, hybrid 22 kB (**V**) | MIT (**V**) | active: sponsored by Framer and others (**V**) | mini rides WAAPI; hybrid adds JS engine; CSS `d` property is not animatable in Safari so SVG path morph needs JS (**T**) | WAAPI boilerplate (sequencing, stagger, springs, `finished`) | **Try in a spike** |
| **anime.js v4** | v4.0.0 current in docs (**V**); size about 10 kB (**U**) | MIT (**V**) | active; docs list `morphTo`, `createDrawable`, `createMotionPath` for SVG (**V**) | normal DOM/SVG engine (**U**) | stroke-draw and path-morph helpers | **Skip for now; fallback if Motion spike disappoints** (overlap, not need) |
| **GSAP** | about 25 kB core (**U**) | Webflow "standard license": free including MorphSVG and SplitText for commercial use; Webflow owns it, may update terms, bans use in competing animation builders (**V**) | very active | good | everything above | **Skip.** Reason: strongest toolset, but terms the owner can change and a size we do not need for settle motion. Dial: revisit if a scrub timeline or morph-heavy form needs it. |
| **Rough.js** | about 8.6 kB (**T**, depscope; README says under 9 kB **V**) | MIT (**V**) | 4.6.x; trackers disagree on last release date, 5 months to 2 years (**T**); used by Excalidraw (**V**) | pure SVG/canvas output, fine (**U**) | nothing today; adds a hand-inked stroke style | **Try in a spike, L4 only** (frames, borders, underlines for one world) |
| **flubber** | not stated (**V**); depends on several small geometry packages (**U**) | MIT (**V**) | 74 commits, Travis CI badge, no releases shown, looks dormant (**V**/**U**) | path-string in, path-string out, so Safari-safe (**U**) | author-time path point matching | **Skip.** Default: author morph targets with equal point counts (or draw two states as cross-fading layers). Dial: spike only if we want a sigil to morph into another unprepared. |
| **simplex-noise** | about 2 kB (**V**) | MIT (**V**) | 4.0.3 (**V**) | pure JS | nothing; ambient flow fields | **Skip.** A 20-line seeded value noise covers ambient needs; seed via our own PRNG (`createNoise2D(prng)` takes one, **V**). |
| **svg.js** | about 17 kB (**U**) | MIT (**U**) | active (**U**) | fine | `document.createElementNS` helper code in `figure.js` | **Skip.** Our own tiny `el(name, attrs)` is shorter than the dependency. |
| Procedural sigil libs | none found as a library | n/a | n/a | n/a | n/a | **Skip;** write the 100-line generator (section C). Watabou's sigil generator and Sigil Core are references, not dependencies (**V** listing only). |

### Detail behind the calls

- **WAAPI first (default).** `el.animate(keyframes, {duration, easing, fill})` returns an `Animation` with `finished`;
  `commitStyles()` bakes the end state; `getAnimations()` lets a "settle once" guard ask what is already running.
  Dial: reach for Motion only when we need springs, sequences or stagger that become unreadable in raw WAAPI. Reason:
  zero bytes, and it is what the repo already half-uses. Source: https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API
  (the page lists the API; the Safari version is **U**).
- **Motion spike (the one worth running).** Done check: re-implement the rite "slot fills, ring settles" as one `animate()`
  sequence with `{reducedMotion}` honoured; compare lines of code and the effect on the 1920×1080 gallery. Bundle with
  esbuild tree-shaking and confirm the mini import really is about 3 kB. Motion's own docs say reduced-motion keeps
  opacity and colour and drops transform and layout (**V**, https://motion.dev/docs/react-accessibility; that page is the
  React API, the plain-JS equivalent is **U**), which matches our rule below.
- **Rough.js caution.** Jittered strokes look drawn, but they blur against a crisp bitmap face and against
  pixel-aligned marks. Default: use it on frames, dividers and underlines only, never behind text or on L1 marks.
  Dial: roughness 0 to 1.2; seed per subject so a figure does not shimmer between renders (the library takes a `seed`
  option, **U**; the README fetch did not list it). Reason: a stable seed also keeps the look testable.
- **GSAP licence nuance.** The fetched licence page says plugins once for members, including MorphSVG and SplitText, are
  now free for commercial projects; DrawSVG is not named, though plugins fall under "GSAP Products" (**V**,
  https://gsap.com/community/standard-license/). The update clause is the reason to hold off.
- **Dependency policy fit.** Our single-dependency history makes each add a decision. Default: at most one animation
  library, behind one wrapper module (`src/ui/motion.js`) so it can be swapped out. Dial: none for tiny helpers.

### Textures: SVG filters without hurting WKWebView

- Default: render `feTurbulence` paper or grain **once** into a static filtered layer (or bake to a data-URI PNG at
  build time) and animate only `opacity` or `transform` above it. Dial: `numOctaves` 1 to 2, filter region small.
  Reason: reports (**T**) say animating filter attributes recalculates the filter every frame, that a full-page
  grain layer made other animations stutter in Safari, and that cost rises with octaves (https://bugzilla.mozilla.org/show_bug.cgi?id=1787793,
  https://www.svgator.com/help/technical-issues/how-to-fix-svg-animation-lag-in-safari; anecdotal, no benchmark).
  WebKit bug 199706 (scaled filtered SVG staying pixelated until a repaint) is open in my results with unknown status
  (**T**; https://www2.webkit.org/show_bug.cgi?id=199706).
- Check in the Tauri app, not headless Chromium (UR16, UIC64). Fallback for every texture: a flat colour.
- Canvas ambient layers (`particles.js`) stay the right tool for many moving things; SVG stays for few, meaningful ones.

## C. Procedural sigils and ornament

### Techniques

| Technique | Idea | Fit |
| --- | --- | --- |
| Seeded geometry | Hash the subject id to a 32-bit seed, run a tiny PRNG (e.g. mulberry32), choose symmetry order, ring count and spoke count from it, draw. Same id, same sigil. | The base. |
| Grid-walk sigil | Walk a path across an n by n dot grid from a seeded start, with a turn rule; draw the path, mark start with a dot and end with a bar. Mirror across one axis for balance. | Good for rites and cheats: a few strokes, readable small. |
| Magic-square or word-square sigil | Map the letters of an intention onto a square and trace the path (the traditional chaos-magic method). A 2021 thread notes results look "sameish" (**T**, https://pol1.lr.ggtyler.dev/r/Technomancy/comments/q3dto5/creating_sigils_with_ai). Default: use only as one ingredient, add a second seeded variable. | Flavour for LOTM-style worlds. |
| Rune composition | A small stroke alphabet (vertical stave plus branches at fixed angles) combined by seed into glyphs; stays on a grid. | Pairs well with a bitmap face. |
| Radial mandala / ring generator | N-fold symmetry, nested rings with tick marks, arcs, polygons inscribed in circles; ids pick the layer set. Watabou's generator and RPG Maker's Sigil Core are the shipped examples (**V**, listing only: https://watabou.itch.io/sigil-generator, https://csaf.itch.io/sigil-core). | The "rite seal"; maps well onto our ring layout. |
| Hash plus scoring | Generate several candidates, score for symmetry, density and overlap, keep the best (**V**, https://ascendant-continuum.web.app/blog/posts/the-sigil-system-procedural-identity-in-unity.html: also grows rings with story events). | Cheap guard against ugly seeds. |
| L-systems | Short rewrite rules, turtle drawing; good for branching vines and frost. | Border and meridian ornament. |
| Knotwork and borders | Over-under weaves on a grid, or a repeating motif tile along a path with `<pattern>` or `<use>`. | L4 frames and dividers. |

### Making it crisp beside a pixel face

- Default: design sigils on a coarse integer grid (for example 16 or 24 units) and draw at an integer multiple of it,
  strokes of 1 grid unit or whole device pixels, `shape-rendering: crispEdges` for orthogonal and 45 degree strokes,
  default anti-aliasing for curves. Dial: curves for large seals, pure grid for chips and badges. Reason: a 1.5 px
  diagonal against a bitmap glyph reads as dirty; the same stroke snapped reads as deliberate.
- Provide **two cuts**: a small cut (at most 16 to 24 px, few strokes, 8-fold symmetry reduced to 2 or 4, no hairlines)
  and a large cut (full detail). Default: choose by rendered size, not by the subject. Reason: detail that survives at
  200 px mushes at 20 px.
- Use `vector-effect: non-scaling-stroke` where a stroke must stay 1 device pixel when scaled (WebKit has a
  zero-length-path bug, **T**, https://bugs.webkit.org/show_bug.cgi?id=208475; ours are never zero-length).
- Every sigil carries a text alt (name plus role) and no fact lives in the sigil alone (UR37).
- Keep the generator pure, DOM-free and key it by subject id plus a version string, so a later refinement does not
  silently change existing sigils.

### Where it plugs in

L1 gets `sigil(id, {size, dress})` as a mark; L4 supplies the symbol set (circle-and-star for LOTM, trigram strokes for a
cultivation world); L3 forms place the sigil at their focal point (altar centre, vessel stamp). Gallery check: UIC57's
"twenty rites give twenty distinct, stable sigils".

## D. Motion that marks consequence

### Patterns

| Pattern | Technique | Cost |
| --- | --- | --- |
| Ink write-in | `stroke-dasharray` plus `stroke-dashoffset` with `pathLength="1"` so every path uses the same 0 to 1 range; animate offset 1 to 0. For text, reveal with a clip or mask, or per-glyph opacity stagger. | Cheap; stroke offset repaints the path, so keep it to a few paths. |
| State morph | Cross-fade two state layers (opacity), or change a few attributes (fill, stroke, a transform) rather than the path `d`; reserve true path morphing for authored equal-point-count paths. | Cheap for cross-fade; `d` is not CSS-animatable in Safari, so a morph needs JS (**T**). |
| Settle | One short ease-out (150 to 400 ms) on the element that changed, fired when the authoritative state settles, with an overshoot of a few pixels for weight. Existing rule: UR52, UR69, UR91. | Cheapest: transform and opacity only. |
| Hold and decay | A glow that fades over seconds, instead of looping. Loops belong to "alive", not to "just happened". | Cheap with opacity. |

Sources for the dash technique: https://motion.dev/docs/svg-animation and the stroke-dashoffset reference at
https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Attribute/stroke-dashoffset.

### Safari caveats (all **T** unless noted)

- `pathLength` on dash properties landed in WebKit in 2020 (commit 53d3917f); some edge cases still reported in 2023
  (https://bugs.webkit.org/show_bug.cgi?id=258897). Default: test the ink write-in in the Tauri app; avoid negative
  dashoffset keyframes; fallback is the finished mark shown at once.
- Filters under animation are the expensive case (section B).

### Keeping it cheap

- Default: animate `transform` and `opacity` only, animate once per settled event, pause when the document is hidden
  (the receipt gate in `settled_text_effects.js` already drops hidden-tab effects), cap animated nodes per figure
  (default about 20), no animation on elements that are off screen. Dial: more for a one-off ceremony (a breakthrough).
  Reason: ticks run every second and many panels mount (Round 40 limits table).
- A `once per event id` guard (the same `eventId` idea the receipt gate uses) stops replay on navigation (UIC58 done
  check). Draw the end state first, then play the in-between as an overlay, so a missed animation never hides a fact.

### Reduced motion

- Default: honour three inputs in one helper: the OS `prefers-reduced-motion` media feature, the save-level
  `data-effects` (off, reduced, full), and `data-display-reveal`. With reduce, replace movement with a short fade or
  the final static mark; keep non-spatial changes such as colour and opacity. Dial: `reduced` may keep a single 150 ms
  fade; `off` shows the end state with no transition. Reason: MDN frames the setting as "remove, reduce or replace" and
  names scaling and panning of large objects as vestibular triggers (**V**,
  https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion), and Motion's own default drops
  transform and layout while keeping opacity and colour (**V**, link in section B).
- Gap found: `settled_text_effects.js` reads `matchMedia` and the display settings, but several style sheets only gate
  on `data-effects` (for example `redesign_drafts.css`, `places_variants.css`) and `meter_bar.css` only on the media
  query. A shared helper would close the gap (check before claiming; I read only grep hits).

## ACT NOW / ACCOUNT FOR NOW / LATER

Ranked within each group. Efforts: S under half a day, M about a day, L multiple days.

### ACT NOW

1. **Pure seeded sigil generator (L1 mark, `sigil(id, opts)`), WAAPI/CSS only.** Effort S to M. Done check: unit test that
   the same id and version gives byte-identical SVG; twenty rite ids give twenty distinct sigils in `ui-preview.html`
   at 16, 24 and 160 px on the crisp grid; text alt present; no new dependency.
2. **One motion helper (`src/ui/motion.js`): reduced-motion resolver plus `settle(el)`, `inkIn(path)`, `once(eventId)`.**
   Effort S. Done check: the three inputs (media query, `data-effects`, `data-display-reveal`) change behaviour in one
   unit test; one settled rite writes in once and not again on navigation (UIC58).
3. **Write the L3 registry contract:** `FORM_TYPES`, `compile(domain) -> spec`, `dress` object, three token tiers with
   L4 overriding only semantic and per-form tiers. Effort S (doc plus a stub test). Done check: `rite_figure.js` names a
   form id; a check fails an adapter that emits raw L2 geometry.

### ACCOUNT FOR NOW

4. **Motion spike (`motion` mini `animate`, about 3 kB gzip claim).** Effort S. Done check: the same rite settle sequence
   built twice (raw WAAPI and Motion); report lines, built bundle size delta from esbuild, and behaviour in the Tauri
   app; decision recorded as adopt or skip.
5. **Texture budget in the app web view (UIC64).** Effort S. Done check: a table of frame cost for static
   `feTurbulence` layer, animated filter, and a baked PNG fallback, measured in the app, cited by UR99.
6. **Rough.js spike for one world's frames (L4).** Effort S. Done check: one LOTM frame drawn seeded, stable across
   renders, text on top stays crisp, flat-line fallback when disabled; bundle delta recorded.

### LATER

7. **Grid-walk and rune sigil families per world (L4 symbol sets).** Effort M. Done check: cover test passes, a reader
   can tell two worlds' sigils apart with names hidden.
8. **Border and knotwork generator for diegetic frames (DSG18).** Effort M. Done check: three gallery prototypes
   (UIC63).
9. **State morph between authored equal-point-count paths, flubber only if unprepared morphs are wanted.** Effort M.
   Done check: a vessel colour change and a route redraw read from the same settled event as the log line (UIC59).
10. **Channel remap in the spec** (state, risk, knowledge to glyph, weight, opacity per world). Effort M. Done check:
    two worlds draw one spec with different channel maps and the sentence form is unchanged.

Not recommended now: GSAP (terms can change), svg.js, simplex-noise, a sigil library (none found to adopt).
