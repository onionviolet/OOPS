# R15 G7: FA21 live content authoring (C4 original site editor)

2026-10-13. Added to R15 by Weibao the same day. Target: desktop 1600×1100.
Mobile layout is deferred and was not checked.

## What you can do now

Press **Authoring** in the bottom bar. The center column now has an
**Original site** panel under Effects & sound (scroll the column if needed).

1. Edit the fields. **Site:** name, description, material name, starting
   material, product name. **Activity:** name, description, material needed to
   start, material used, work time, product made, coin paid on completion.
   **Gathering:** gather time and amount gathered.
2. **Apply site** (or press Enter in any single-line field). The site is saved
   into this life right away. Bad drafts are refused with a list of reasons
   and nothing in the game changes.
3. **Go to site** returns to play with Optional worlds open. Press
   **Visit <site>** from the Village.
4. At the site: start the activity (uses material), let it run on the normal
   game clock, and it settles once: product +N and real coin in your purse.
   **Gather <material>** refills material. **Cancel work** stops a running job:
   material comes back, no product, no pay. **Return to Village** pauses work
   without pay (existing behavior).
5. Editing is locked while you are at the site. Return to the Village, change
   numbers (for example a higher requirement), Apply, and the activity's
   eligibility, time and pay change on the next visit. Saved progress is kept.
6. **Reset to defaults** removes the site, its local progress and its
   registration. Coin already earned stays. The form returns to the default
   proposal.
7. **Export draft** downloads `authored-site.json`. **Import draft file** loads
   one into the form (wrong format, malformed or newer-version files are
   refused); then Apply.

The default fiction (Reed Hollow, reeds, mats, 8 wood coins) is a reversible
proposal, as are the field names and the center-column placement.

### Exactly what is supported

One authored site, one timed activity and one gather activity, compiled into
the existing schema-1 optional pack adapter (`src/content_packs.js`). The
editor offers no pickers of existing content, so nothing sealed or
undiscovered is listed. Unknown properties in a draft or file are rejected
by name. Not supported in this slice: several sites or activities,
people/NPCs, native item inputs or outputs, starts, custom clocks. Those need
their own adapter gates (AUTHORING_ADAPTERS AU4-AU6, AU8).

Native consequence: completion pays **native coin** through the same durable
clock plan (`persistExpansion`, `plan.external.money`) as other timed work.
Material and product are site-local counters, not inventory items.

## Checks

Labels per BRIEF: **natural** = fresh new game, everything through the UI;
**source** = Node tests only. No seeded saves were needed. The harness reads
`localStorage` only to compare state; every action is a UI click or key.
(RESULT.json's label string was corrected from "seeded-native" to "natural"
after the run; the steps did not change.)

Browser run: `HARNESS.mjs`, headless Chrome, 1600×1100, fresh origin
`http://127.0.0.1:19170/`, fresh profiles under `/private/tmp/r15-g7-profile-*`,
on the rebuilt bundle (served bundle hash equals built hash `8e213cc8…`).
28 of 28 checks passed. Details in `RESULT.json`, screenshots in `shots/`.

| Leaf | What was checked | Label | Result |
|---|---|---|---|
| Draft and validation | Empty name and 0-minute work refused with two listed reasons; save unchanged, no site appears | natural + source | PASS |
| Keyboard use | Typed fields, Enter applied; Go to site focuses the panel, Tab reaches Visit | natural | PASS |
| Apply | Draft saved into `content_packs.authored`; Visit button appears | natural + source | PASS |
| Eligibility | Raised requirement disables the activity ("Local prerequisites are not met"); gathering re-enables it | natural + source | PASS |
| Work and result | Start debits material; 6 played minutes on the game clock; product +1 and purse +8 coin once; no second pay after more time | natural + source | PASS |
| Cancel | Mid-run cancel refunds material, no product, no pay | natural + source | PASS |
| Current work bar | Shows "Weave a reed mat: N min remaining" while working | natural | PASS |
| Reset | Site, local progress, registration and its world record removed; coin kept | natural + source | PASS |
| Export / import draft | `authored-site.json` written; future version refused; file reloaded into form and applied | natural + source | PASS |
| Save and reload | Reload mid-gather restores site, location and running job; it settles once after reload | natural | PASS |
| Export save + literal-file Import | Exported save imported in a fresh profile: money, location and full `content_packs` identical (`STATE_BEFORE_IMPORT.json` = `STATE_AFTER_IMPORT.json`) | natural | PASS |
| Old saves | Save exported before any authoring imports into a fresh profile unchanged, no site; unit test covers saves with and without `content_packs` | natural + source | PASS |
| Page errors | None in all three profiles | natural | PASS |

Unit tests: `tests/authored_site.test.js` (8 tests: validation, file round
trip and rejection, apply/edit/reset registration, collision rollback,
runtime pay/cancel/eligibility, save-file encode/import persistence, old
saves). `npm test`: 585 pass, 0 fail.

## Defects found and fixed

- **Optional-world message spam.** While visiting any optional site, the
  Work Ledger's polled context called `expeditionOccupiesPlayer()`, which logs
  "Return from your optional world…" on every call. Six copies appeared within
  seconds. Fixed by using the side-effect-free `nativeOccupationReason()` in
  `workLedgerContext`. Browser check: zero copies while working. This
  predates C4 and affected private packs too.
- **No cancel and no native consequence in schema-1 packs** (the gap the
  cheats-sfx checkpoint recorded). Added `cancelPack` and an optional `pay`
  on timed activities, settled through `advancePackSettlement`.
- **Optional worlds panel absent with no private packs.** It is now always
  created and hidden while empty, so an applied site appears without reload.

## Files changed

New: `src/authored_site.js`, `src/authored_site_ui.js`,
`tests/authored_site.test.js`.

Edited: `src/content_packs.js` (pay validation, `advancePackSettlement`,
`cancelPack`, `authored` shape check), `src/content_pack_ui.js` (Cancel work
button, pay line, live label refresh, hidden when empty, no empty people
line), `src/workspace_layout.js` (one line: authoring default position for
`customization-sites`), `styles/customization.css` (appended editor block).

Shared `src/main.js` hunks, for root merge:
1. Imports: `cancelPack`, `advancePackSettlement`, authored modules (replaces
   the `advancePack` import).
2. New `authoredSiteOwners`, `syncAuthoredSite`, `commandAuthoredSite` just
   above `commandOptionalPack`.
3. `commandOptionalPack`: `action==='cancel'` branch.
4. `load()`: `syncAuthoredSite(...)` right before `preparePackSave`.
5. `update_timer` optional-pack branch: `advancePackSettlement`, pay added to
   `plan.external.money`, settlement log line.
6. `workLedgerContext`: `nativeOccupationReason()` instead of
   `expeditionOccupiesPlayer()` (spam fix).
7. `createWorkspaceViews` work list: optional-pack job line.
8. `createContentPackPanel(... always:true ...)`.
9. Editor creation and `registerWorkspaceModule({id:'customization-sites'})`
   after `customization-preview`.

No edits to `src/simulation.js` or `src/save_files.js`.

## Persistence compatibility

New optional field `content_packs.authored = {schema:1, draft}`. Saves
without it load as before (tested). A save with it opened in an older build:
that build ignores the field, and its loader parks the unregistered site
(returns an active visitor to the Village); the draft stays in the save.
That older-build path was reasoned from source, not run.

## Still open

- **Human taste and layout.** The editor sits under Effects & sound and the
  center column scrolls at 1600×1100. Fiction, field names and placement are
  proposals for Weibao to judge in play.
- **Optional worlds starts collapsed** in the default Workspace preset (existing
  UI choice). Go to site expands it; a player who skips that button must
  expand the panel through Edit layout. Left as is because the preset belongs
  to the UI lane (FA23).
- **Further adapters** (items, people, starts, several activities, native item
  inputs) are outside this slice and each needs its own gate.
- **Older-build load** of an authored save was not run.
