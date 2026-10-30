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
| CG1 | **The palette's first screen is a list of places.** An empty Ctrl+K query returned the first 40 rows in source order, so Known things filled every slot and Here and Go to never showed. | `before/v03-after-ctrl-k.png`; `after/v03-after-ctrl-k.png` | "Where do I go for X" fails on the one surface built to answer it; the player must already know to type | bk-gaps | S | **Fixed**, `tests/palette_browse.test.js` |
| CG2 | **Known things lists places the player has not met.** `isUnlocked()` is true for most places in every world pack, so the Places tab and the palette's Known group carry hundreds of places from other worlds and unmet native ones, against the file's own "never lists a thing the player has not met". Duplicate names (one name appears five times) add noise. | `before/v03-after-ctrl-k.png` (count in `receipt.json`) | A false record of progress; spoils that other worlds and places exist; search results the player cannot act on | Duplicates: bk-gaps (fixed). Root cause: floor-wire (needs a visited-place record in a namespaced save slice, so a save-compat decision) | M | Duplicates **fixed**; root cause open |
| CG3 | **The lead's first screen answers nothing.** After "Be Klein Moretti": Around you says "No known subjects here", the Actions tab is empty, inventory is empty, no Next step card, and an hour of waiting changes nothing. The verbs, if any, sit under the Tingen workroom's own tabs (Here, Path, Work and merit, Notebook), a second "Here" away from the real one. | `before/t03-lead-first-screen.png`, MCP steps "Start this new life" then "Actions" | "What can I do" fails for the main-line run; the player may leave the first hour idle | floor-wire for `book_world_lotm_*` content; GUI for a Next step row set for lead starts (rows are data in `FIRST_HOUR_STEPS`) | M | Open |
| CG4 | **Starting a life gives no progress for 3 to 6 seconds.** Only a "Starting…" line under the card; the page looks frozen. | `receipt.json` ("life start duration ms"); `before/t02-lead-confirm.png` | Double clicks and abandoned starts | GUI (worlds and crossings view) | S | Open |
| CG5 | **The start-confirm card has a stray "Beginning." and an orphaned "Nothing changes".** The six starts are six one-paragraph buttons with no side-by-side of what each keeps, costs or changes, and the confirm shows one sentence under "How it begins". | `before/t02-lead-confirm.png` | No compare-before-commit for the biggest choice in the game | GUI (Beginning and Worlds views); wording in floor-wire's lead-life profile | S for the stray lines, M for a compare table | Open |
| CG6 | **"Options · N (ready)" is a settings tab named like choices.** In the Village it reads "Options · 6 (4 ready)" and opens pacing and durability toggles; in the lead's flat "Options · 2" opens the same. | MCP step "Options · 2" | The player expects options for what to do; finds switches | GUI (center-view shell) | S | Open |
| CG7 | **"Cross to another world: Tingen" is offered at minute zero.** It sits among the Village verbs, above the elder step, before the player knows what a world is. | `before/v01-first-screen.png` | Pulls a new player out of the Village before the first hour | GUI | S | Proposal: show it after the elder, or label it "Optional" |
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

## What changed in code (this lane)

- `src/command_palette.js`: an empty query now browses (Here, Go to, Loadouts, Panels, Items, then the rest, ten rows per group). Typing still searches everything.
- `src/known_things.js`: places that share a name and parent list once.
- `tests/palette_browse.test.js`: three focused tests. The shared `tests/ui_extras.test.js` and `tests/optional_ui.test.js` still pass.

## Known limits and the next refactor

The walk is one hour per life, not thirty to sixty minutes of varied play; a longer pass should follow the first-hour owner's rats and cave steps. The visited-place record in CG2 is the one change that touches persistence and needs Weibao's compatibility call. Everything here is the current best and open to replacement (AD45).
