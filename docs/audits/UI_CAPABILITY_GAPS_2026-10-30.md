# UI capability gaps: a fresh player's walk (2026-10-30)

Lane `bk-gaps` of the [book UI wave](../gm/dispatch/book-ui-wave-2026-10-30/PLAN.md#round-2-more-to-consider-2026-10-30-144x), finding F6. Everything here is a finding or a proposal (AD32), not an accepted decision. Sealed secrets are not touched. Gaps already listed in the [gap audit](GAP_AUDIT_2026-10-30.md) keep its codes (G12 and its UI section) and are not repeated.

## Method and review state

- **Route.** Two fresh lives: the Village start, then the Tingen lead's run (Village, "Cross to another world", "Be Klein Moretti"). First by the `yairpg-game` MCP (headless text), then a rebuilt headless browser at 1920x1080 through `scripts/capture_capability_gaps.mjs` (fresh test origin, `slot_run --kind browser`).
- **Depth.** The walk covers about one in-game hour per life, plus the first-screen read of the Village elder prompt. It did not play the rats, the cave or a combat; those are the [first-hour](../representations/FIRST_HOUR.md) owner's slice and the Village steps past the elder are "not walked here".
- **Test per checkpoint.** Within five seconds, can the player say what this is, what they can do, what changed, where to go for X and why they cannot do Y (UR61, UR70, UR75).
- **Review state.** Agent-verified, not human-reviewed. Counts below are from the browser walk; a count of places is given rather than names, since some places can sit on sealed routes.
- **Other games** (patterns only; each claim is *known from play or docs* unless marked *inferred*). Factorio: alt-mode overlays plus tips that appear when the matching thing first matters, never before. Into the Breach: every enemy intent is shown before the player commits, and a turn can be undone. Slay the Spire: any keyword is explained on hover where it is read, and the next-room choices show their risk before you pick. Melvor Idle: an offline-progress summary on return and a global search over items (*inferred* from docs).

## What already works (do not rebuild)

A "Next step" card with "Show me" on the Village start (`src/first_hour.js`); a Ctrl+K palette and a visible Find button (`src/command_palette.js`); a shortcut list ("Shortcuts 17"); inventory find, filter and sort; Favorites; Backup and Undo (opt in). The gap is how easy they are to find and whether they say true things, not whether they exist.

## Gaps

Owner key: **GUI** = General UI coordinator's representation sessions and shared shells; **floor-wire** = single writer of host registration and `book_world_lotm_*`; **sw-bridge**; **ui-defects**; **bk-gaps** = this lane. Effort: S under a session-hour, M a few, L more. Evidence paths are under `docs/audits/evidence/capability-gaps-2026-10-30/`.

| Code | Gap | Evidence | Player cost | Owner | Effort | State |
|---|---|---|---|---|---|---|
| CG1 | **The palette's first screen is a list of places.** An empty Ctrl+K query returned the first 40 rows in source order, so Known things filled every slot and Here and Go to never showed. | `before/v03-after-ctrl-k.png`; `after/v03-after-ctrl-k.png` | "Where do I go for X" fails on the one surface built to answer it; the player must already know to type | bk-gaps | S | **Fixed**, `tests/palette_browse.test.js`; rechecked 2026-11-04, holds |
| CG2 | **Known things lists places the player has not met.** `isUnlocked()` is true for most places in every world pack, so the Places tab and the palette's Known group carry hundreds of places from other worlds and unmet native ones, against the file's own "never lists a thing the player has not met". Duplicate names (one name appears five times) add noise. | `before/v03-after-ctrl-k.png` (count in `receipt.json`) | A false record of progress; spoils that other worlds and places exist; search results the player cannot act on | Duplicates: bk-gaps (fixed). Root cause: floor-wire (needs a visited-place record in a namespaced save slice, so a save-compat decision) | M | Duplicates **fixed**; other-world places **fixed** 2026-11-04 (35 to 17 on the Village start); unmet places in the player's own world still open (needs a visited-place record, save-compat call) |
| CG3 | **The lead's first screen answers nothing.** After "Be Klein Moretti": Around you says "No known subjects here", the Actions tab is empty, inventory is empty, no Next step card, and an hour of waiting changes nothing. The verbs, if any, sit under the Tingen workroom's own tabs (Here, Path, Work and merit, Notebook), a second "Here" away from the real one. | `before/t03-lead-first-screen.png`, MCP steps "Start this new life" then "Actions" | "What can I do" fails for the main-line run; the player may leave the first hour idle | floor-wire for `book_world_lotm_*` content; GUI for a Next step row set for lead starts (rows are data in `FIRST_HOUR_STEPS`) | M | Open |
| CG4 | **Starting a life gives no progress for seconds.** 3 to 6 s on an idle machine, 27 s measured under heavy load. Only a "Starting…" line under the card, then the page reloads to the loading screen and waits for PLAY again. | `receipt.json` ("life start duration ms"); `before/t02-lead-confirm.png` | Double clicks and abandoned starts | GUI (worlds and crossings view) | S | **Fixed in part**: `src/working_state.js` adds an on-page note while the life is prepared and a loading-screen line plus automatic Play after the reload (`tests/working_state.test.js`). Open: the other reload sites and a measured breakdown (see the [ideas](../gm/dispatch/book-ui-wave-2026-10-30/ideas/bk-gaps.md)) |
| CG5 | **The start-confirm card has a stray "Beginning." and an orphaned "Nothing changes".** The six starts are six one-paragraph buttons with no side-by-side of what each keeps, costs or changes, and the confirm shows one sentence under "How it begins". | `before/t02-lead-confirm.png` | No compare-before-commit for the biggest choice in the game | GUI (Beginning and Worlds views); wording in floor-wire's lead-life profile | S for the stray lines, M for a compare table | Stray "Beginning." gone on the current four-start list (2026-11-04 recheck); "Nothing changes" now reads as the Back button's caption, paired with "Your Village life pauses" under Confirm. Compare table **added** 2026-11-04 (`src/ui/start_compare.js`) |
| CG6 | **"Options · N (ready)" is a settings tab named like choices.** In the Village it reads "Options · 6 (4 ready)" and opens pacing and durability toggles; in the lead's flat "Options · 2" opens the same. | MCP step "Options · 2" | The player expects options for what to do; finds switches | GUI (center-view shell) | S | **Dropped** 2026-11-04: the tab holds the action-group drop-downs Weibao asked to move under Options (R21, USER_VISION), plus two optional rows; the name is his |
| CG7 | **"Cross to another world: Tingen" is offered at minute zero.** It sits among the Village verbs, above the elder step, before the player knows what a world is. | `before/v01-first-screen.png` | Pulls a new player out of the Village before the first hour | GUI | S | **Fixed** 2026-11-04 (proposal taken): hidden until the elder's first answer, then in the action list as before |
| CG8 | **Clock and time words disagree in the lead's flat.** The header says "Day 1, night" beside an 08:00 to 09:00 clock. Not checked against the world's own day-part rule. | MCP step "Journal" | A "what changed" signal that looks wrong | floor-wire or `sw-calendar`, after checking | S | Unverified |
| CG9 | **No "did anything happen while I waited" summary.** Stepping an hour changed nothing visible in the lead's flat and the Village's Reports log only grows on events. `away_ledger` and `anchor_snapshots` are the unreachable modules (gap audit G15). | MCP step "game_step 60" | The idle genre's core promise, a return digest, cannot be seen | GUI with `sw-bridge` (G15) | M | Open, already G15 |

## Capability checklist (fresh-player lens)

| Capability | Found | Verdict |
|---|---|---|
| Search or filter in long lists | Inventory find and sort; Known things search; palette | Present; palette order was broken (CG1) |
| Compare before commit | Equipment comparison panel; none on the start choices | Missing for starts (CG5) |
| Undo | Backup and Undo, opt in under Menu | Present, hidden; not walked here |
| "Why" on a refusal | `skill_disabled_reasons`, shell reason text | Not exercised in this walk, so not claimed |
| Pinning | Panel Pin and Dock in the shell | Present |
| Notifications for finished idle work | None seen in an hour of waiting | CG9 |
| Keyboard access | Ctrl+K, Find button, a shortcut list; the `?` key opened nothing | Present; `?` is a missing convention (S, GUI) |
| Next step guidance | Village only | Missing for the lead's run (CG3) |

## Routing (top five to other owners)

1. CG3, the lead's empty first screen: floor-wire and the GUI coordinator.
2. CG2 root cause, a visited-place record: floor-wire, with a save-compat decision.
3. CG5, the start-confirm stray text and a compare table: GUI worlds and Beginning views.
4. CG4, progress feedback on life start: GUI.
5. CG9, the return digest (G15): GUI with `sw-bridge`.

## Proof (FLR1, FLR2, FLR6)

- **Build.** Before: bundle `57cc8bc5af48` (HEAD source, no fix). After: `688c1905a1cd` (palette fix), then `4fc171061f76` (adds the working state; the CSS file ships beside the bundle). 1920x1080, fresh test origin, route kind: MCP walk first, then headless browser via `slot_run --kind browser`. Page errors: none in either run.
- **CG1 before and after.** The palette's group headings go from `Known` alone to `Here, Go to, Panels, Items, Known` (`receipt.json`, step `v03-after-ctrl-k`; images `before/v03-after-ctrl-k.png` and `after/v03-after-ctrl-k.png`).
- **CG4 before and after.** Before: `before/t02-lead-confirm.png` shows only "Starting…" under the card, and the life start measured 26.7 s under load. After: `after/t02b-300ms-after-start.png` (note at 300 ms: "Starting your new life. The page reloads when it is ready; your current life is kept until then."), `after/t02c-loading-screen.png` ("Entering your new life…" on the loading screen), and the game continues on its own with no PLAY press (46.8 s under a machine load average near 190, so the duration itself is not a result). Page errors: none.
- **Persistence.** None changed (no save, reload or Import check needed).
- **Not covered.** Abilities and per-path assumptions were not part of this walk; Weibao's note that abilities must not hardcode one path stays with `rep-abilities` and `sw-adv`, and no place that assumes one path was seen on these two first screens.

## What changed in code (this lane)

- `src/command_palette.js`: an empty query now browses (Here, Go to, Loadouts, Panels, Items, then the rest, ten rows per group). Typing still searches everything.
- `src/known_things.js`: places that share a name and parent list once.
- `src/working_state.js`, `styles/working_state.css`, `src/fresh_life_start.js`: the working note and loading-screen line (CG4), `tests/working_state.test.js` (five tests: double activation, failure restore, note round-trip and expiry, clean-load Play, page note). Session storage only; no save changes.
- `tests/palette_browse.test.js`: three focused tests. The shared `tests/ui_extras.test.js` and `tests/optional_ui.test.js` still pass.

## Known limits and the next refactor

The walk is one hour per life, not thirty to sixty minutes of varied play; a longer pass should follow the first-hour owner's rats and cave steps. The visited-place record in CG2 is the one change that touches persistence and needs Weibao's compatibility call. Everything here is the current best and open to replacement (AD45).

## Recheck and fixes, 2026-11-04 (CG1, CG2, CG5, CG6, CG7)

Task record for the first-screen defects. **Target viewport:** desktop 1920x1080, headless Chromium, rebuilt bundle, fresh test origin; mobile deferred (standing UI priority). **Visible outcome:** the Village start no longer offers a world crossing before the elder, Known places lists only the player's own map piece, and the Tingen lives are compared side by side before one is opened. **Deferred:** CG3 and CG8 (`book_world_lotm_*` lane); the visited-place record for unmet places in the player's own world (save-compat decision, Weibao's call); CG4's other reload sites.

- **CG1 dropped.** Ctrl+K on an empty query shows the groups `Here, Go to, Panels, Items, Known` (`evidence/capability-gaps-2026-11-04/before/log-palette-confirm.json`).
- **CG2 partly fixed.** Before: 35 Known places on the Village start, including Diagon Alley, Hogwarts, Tingen and the Clan Gu house. After: 17, all Village-map places (`before/log3.json`, `after/log3.json`, key `knownPlaces`). `reachableFrom` in `src/known_things.js` keeps the places joined to the current one by travel or parent links; other worlds sit in separate map pieces. No save change. A pack world's places are not linked to each other, so inside one the list shows the current place only until the visited-place record exists. Still open: unmet places in the player's own world (Cat café, Slums, Antique store and others read as known).
- **CG5.** Stray "Beginning." no longer appears; "Nothing changes" is the Back button's caption, paired with "Your Village life pauses" under Confirm (`before/confirm.png`), so both halves are dropped. The compare table is new: `after/entry-compare.png` shows the four starts on Money and items, Name and papers, What you owe. `src/ui/start_compare.js` (generic; callers pass profiles), one call in `createLotmPanel` in `src/book_world_lotm_ui.js` (single hunk for the lotm lane to keep), `tests/start_compare.test.js`. The table sits above the Begin buttons, so the buttons scroll below the fold inside the panel.
- **CG6 dropped.** The tab holds the action-group drop-downs (Village practice, Furniture, Local life) plus Optional pacing and Equipment condition (`before/options.png`); Weibao asked for the drop-downs under "Options" in R21 (2026-10-17). The audit's "pacing and durability toggles" covered two of six rows.
- **CG7 fixed.** `src/first_hour.js` sets `data-first-hour-step="ask-elder"` on the main content while the opening's first step is open; `styles/workspace.css` hides `[data-lotm-door]` then. Before: door visible at minute zero. After: hidden (`after/minute-zero.png`), visible again after the elder's "what happened" line (`after/after-elder.png`, `after/log3.json` key `doorAfterElder`). Players who turn Next step off never see it gated. Playtest scripts that click the door at minute zero (`scripts/playtest/reconcile-master.mjs`, `workroom-density.mjs`, `topstrip-check.mjs`, `lotm-gate-entry-review.mjs`, `scripts/ui_log_capture.mjs`, `scripts/capture_capability_gaps.mjs`) now need the elder step first; not edited here.
- **Checks.** `node --test tests/start_compare.test.js tests/palette_browse.test.js tests/crossing_threshold.test.js tests/first_hour.test.js` passes; `npm run check:arch` passes; `npm run check:rules` reports one failure that predates this change (AD codes not contiguous at AD51). Capture scripts: `evidence/capability-gaps-2026-11-04/repro.mjs`, `r3.mjs`. Agent-verified, not human-reviewed.
