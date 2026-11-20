# Sol lane brief: world atlas as a canvas, plus HP order guard (2026-11-20)

Coordinator: Claude session (this checkout). Why this lane exists:
[Codex chat drift review](../../../audits/CODEX_CHAT_DRIFT_REVIEW_2026-11-20.md), findings CD3, CD8, CD9.

## Weibao's words (the target)

- "the world atlas still feels like a bad drop down menu, why not a interactive canvas ... Why cant we be visually inspired by what they posted and address accordingly?"
- "right now it doesnt need to carry into play for now, but for the world atlas, just make it a large interactive canvas to represent what exists in the games and more?"
- "Use the cat style for creatures, and the box canvas things for the world and locations" then "We can give creatures the same canvas style".

Words like "tree" or "dropdown" in his earlier messages described coverage, not the UI form.

## Visual references (open these first)

In `~/.codex/lanes/protagonist-life-2026-10-27/atlas-canvas-sol/refs/`:

- `box-map-reference.png`: the target for places. Dark field, white-bordered boxes laid out as a spatial graph (not a left-to-right tree), arrows for directed routes, small icon dots on boxes for activities, a framed legend explaining the dots and danger ranks, a green "you are here" box, a close button.
- `kitten-inspector-reference.webp` / `turn9-image2.png`: the target for a selected creature's detail: a compact nested +/- list (body, thoughts) under the individual's one-line name.
- `hp-stats-complaint.png`: the stats grid he disliked (labels jammed against values, HP last).

## Do

1. **Places canvas** (`prototypes/world-atlas/`): rebuild the Village region view to look like `box-map-reference.png`. Graph layout that spreads in two dimensions with arrowed edges, activity icon dots on each box from real data (crafts, activities, residents), a legend, a highlighted current/selected place, pan and zoom, and a first view that fits the whole graph (today the root box opens clipped). Keep the side inspector and existing data sources; the change is the presentation.
2. **Creature canvas**: same box-canvas visual language for individuals and kinds (edges for kind-of, prey/predator, starts-at). The selected creature's detail uses the kitten-style nested +/- list.
3. **HP order guard**: HP was moved first in `index.html` markup. Add a focused test that fails if HP renders after XP, stamina or mana in the vitals block. Do not change the markup further unless the test shows it regressed.

## Do not

- Do not connect the atlas into play (waived for now). Do not edit `src/` runtime files: "Improve combat and game UI" owns runtime fixes.
- No new sample pages with invented states.

## Owned files

`prototypes/world-atlas/*`, one new test file under `tests/`. Nothing else.

## Done means

- A screenshot of the places canvas and one of the creature canvas, each saved next to the matching reference in `docs/representations/evidence/world-atlas-2026-11-20/` as `places.png`, `creatures.png`.
- The HP test passes now and was shown to fail when HP is moved last (say how you checked).
- Report: files, the screenshots, checks run with exit status, and which reference features you did not reproduce and why.
