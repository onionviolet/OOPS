# R12 native recipe clarity (Claude continuation)

2026-10-15, receiving [CLAUDE_HANDOFF](CLAUDE_HANDOFF.md) A1–A4. Writer: one Claude
session. No child workers.

## Recovered state

- Branch `codex/gameplay-foundations`, HEAD `c768ad606`, dirty shared tree preserved.
- All 15 paths in [CLAUDE_TRANSFER_INPUTS.json](CLAUDE_TRANSFER_INPUTS.json) matched
  their SHA-256 at 21:40 EDT; no later writer touched them.
- Only other active writer observed: cross-audit reconciliation, documentation-only
  under `docs/gm/cross-audit-reconciliation-2026-10-15/`. Left alone.
- R11 frozen server 19171 and recipe prototype 19218 still listening; not modified.

## Write scope (this slice)

`src/crafting_detail.js`, `styles/crafting_detail.css`, the item-recipe model/select
functions in `src/display.js`, a focused test, rebuilt `index.html`/`dist`, and this
dispatch directory. No main/save/clock/simulation/eligibility/combat edits.

## Slice

Surface: place service Crafting → Cooking (any items page) → selected recipe detail, in
its existing task region. Target 1366×768 at 14/17.5/21px, plus 1920×1080 at 21px.
Mobile, new navigation managers, cross-station links and a universal recipe index are
deferred.

1. **Have/need**: requirement heading reads "Uses · have / need"; each row has an
   accessible label with both values (rebased from the unapplied
   `parallel/recipe-legibility.patch`).
2. **Attempts now**: existing `itemRecipeStatus().amount`, shown as attempts, not
   guaranteed outputs. Zero when the native guard rejects.
3. **Known result effects before Craft**: structured effect name, duration and
   buff/debuff kind from the same `item.effects`/`effect_templates` data the existing
   Result details tooltip already shows. No new knowledge exposure.
4. **Related known uses (A3, bounded)**: recipes on the same station page that are
   unlocked (row exists) and share a named, known ingredient or use the result.
   Selecting one stays in the same service; a local "Back to <recipe>" restores the
   prior selection and list scroll. Unknown ingredients never produce links.
5. **Compact order**: frequent facts (uses, makes, effects, success, attempts) and Craft
   first; station and XP kept as secondary facts; full tooltip stays behind Result
   details.

## Acceptance gate

Fresh loopback origin and synthetic save at 1366×768 14/17.5/21px and 1920×1080 21px:
selection/inspection/related links advance no time and spend nothing; blocked Craft
spends nothing; explicit Craft 1 receipt matches inventory/XP deltas; unknown material
stays unnamed in text and ARIA; Back restores selection and list scroll; Craft button
reachable without page scroll. Persistence untouched, so no new save claim.

## Progress

- [x] Implement (also fixed A1 defects F1–F5 found first: Crafting squeezed into the short pane, detail ignoring text size)
- [x] Rebuild + focused tests (16/16)
- [x] Browser evidence: 20/20 journey, success sequence, ticks/exit, R11 regression (one unresolved intermittent)
- [x] Report: [R12_REPORT](R12_REPORT.md). Candidate on 19251; human acceptance OPEN. No commit.
