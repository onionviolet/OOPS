# Done-chats audit (2026-10-30)

Weibao, 2026-10-30 morning: "look thorugh all the done chats and then audit improvements, direaction and more".

**Scope.** 49 Claude chats in this repo and its worktrees that were active from 2026-10-29 00:00 to 2026-10-30 08:30. Covered: the 20 representation (rep-*) lanes, the UI integrator, the Sonnet wave lanes L2-L14 and sw-wire, P3c, P4-P8, the reading and indexing coordinators, local-model pilots and the next book wave. A deterministic extractor pulled each chat's first prompt, wrap-up recaps and last three replies. Four haiku readers summarised those digests. The supervisor then checked the claims that would change a decision against git and tests. Codex sessions were not read.

**Status.** These are findings and proposals, not accepted decisions. Sealed secrets appear by ID only.

## Stale claims corrected by live checks

Several chats ended before later work landed, so their final reports are out of date.

| Chat claim | Live state (08:40) |
| --- | --- |
| The 20 rep-* branches are unmerged | All landed on master as `-x` cherry-picks. One commit is not on master: rep-character-sheet's `46860a01` ("drop duplicated gallery stylesheet link"). |
| Every walk is refused on master (MT-F1) | Fixed by `064fd773`. |
| The cast fixtures fail (W6) | Fixed by sw-wire `417fccc1`; rerun 12/12. |
| `character_sheets` test 10 fails (W4) | Passes 8/8 after `191797ec`, which skips the b1-vs-b8 check for sheets with no dated identity or power. That hides thin data (Luen is empty) rather than adding it; see F3. |
| origin points at the wrong repo | origin is `onionviolet/OOPS.git`, which PROJECT.md names as correct. The stale value is the desktop app's pinned origin (`yet-another-idle-rpg.git`), and it blocks `sync_with_base_branch` (A3). |

Master is 211 commits ahead of origin. Nothing is pushed.

## Findings

**F1. The overnight wave built breadth, not playable depth.** L4, L8, L9, L10, L11, L13 and L14 all ended as "landed, read model only". Every one handed its wiring to sw-wire, and rites and crafts have no engine path, so their data cannot be wired at all yet. The breadth did not repair itself: sw-wire's own wiring commits broke tests (W6), which shows that the one wiring lane is both the bottleneck and the main risk. Below-floor rows keep growing; none moved to the floor except P4 and MR3. This drifts from AGENTS.md: "Finish one playable slice before starting the next."

**F2. Questions and proposals pile up unanswered.** Choices asked of Weibao with no recorded answer: abilities ghost fill, P5 start, P3c start (since done), the local routine-time pilot, the C44 daily scheduled download job, the Chinese collated text, the body-model default and the figure gallery look. Proposal sets keep growing: RS1-RS24, HL7-HL11, TP1-TP7, 21 research items, TC26, FT5-FT6, the UI rules packet P1-P16 and CHOICES.md 1-5. Some are either/or questions, against AD5. For example, the body session asked "per-part only where it matters, or abstract like YAIR". Under AD5 the default is both, set by world.

**F3. There was no clean test baseline all night.** Nearly every lane's full suite failed 5-18 tests, and the failures were put down to load. Three were real breaks (W4 and W6), and they hid among the timeouts for about five hours. Two lanes compared against master; the rest did not. The W4 fix skips the check for empty sheets, which is fair for a sheet with nothing dated, but Luen, Groselle and the five new sheets stay unverified.

**F4. The load limiter exists but is opt-in.** `scripts/slot_run.mjs` landed (L12), but `npm test` still runs 18 workers outside it. Sessions kept running the raw command after the limiter landed (P3c, the primary checkout PID 48334). Load peaked between 194 and 377 on 18 cores. Downstream effects: browser floors were blocked, a 30 s pack load timed out, and a local model ran with swap at 94-98%.

**F5. Shared checkout and process safety.**
- Master was moved from a worktree with `update-ref`, which left the primary index stale: 434 files, 16,924 staged deletions, and one fix lost (repaired; rule D2).
- Two lanes used `pkill -f` (character sheet, P4). The P4 one may have killed another session's suite. AGENTS.md forbids it, but nothing enforces the rule.
- Process slips: one lane amended another lane's commit (L11 amended L10's), one wave launched twice (L9), and some scratch output went to `/tmp`.

**F6. The game MCP plays only the primary checkout.** No worktree branch can reach the FLR floor through it, and rep lanes said so repeatedly. Worktree playtests also hit 404s on private fonts and lack the private cast pack.

**F7. Shared-file hot spots cause merge work in every wave.** Lanes clash on the same files every wave:
- `index.html` stylesheet links: three lanes added the same `figure.css` line, and one duplicate is still not on master (`46860a01`).
- `figure_gallery.js` registrations.
- `layout_spec.js` and `perspective_controls.js`.
- `work_ledger_ui.js`.
- `dist/` and the version bumps.

**F8. Ownership overlaps with no named owner.**
- Debts: the relationship web and the economy Owed ledger.
- Known, guessed and open wording: the character sheet and Knows.
- Institution rank ladder RPX18: economy and organizations.
- LOTM potion formulas: sw-rites and the mixing lane. Ritual essence oil and ritual bath oil may be the same product described twice.
- LOTM volume 1 absorption: the overnight coordinator and the L-A successor, with T2 split between them.
- Divination rows: L4 and the sw-absorb `divinations` key.
- Typed general features from the cross-book pass (L7) against the LOTM-shaped divination and faith systems.

**F9. Player-facing defects found but not fixed.**

| Defect | Status |
| --- | --- |
| Developer text in player descriptions: "Proposal: …" | Live in `src/earned_drying_tracker.js:30` |
| Notebook shows `Requires skill.Cooking gte 1 …` | Reported by the time lane |
| Tingen header shows "Local weather/date unavailable" | Live |
| Talk view covers the hello line | Reported |
| Hidden duplicate "report in" button | Reported |
| First-visit "Got it" hint reads like panel text | Reported |
| Nav bar covers the fight button after reload | Reported |
| Organizations panel reachable only through All panels | Regression |
| Money shows "102 coins" instead of denominations | Reported |
| Worlds "moved" notice comes back on every load | Reported |
| A mid-practice study job disappears after reload | Reported |
| A 45-day wait crashes the page at about 90,000 ticks | Reported |
| The 1,500-person book pack takes over 30 s to load | Reported; blocks the whole-book run |
| A brew is unreachable from the starting purse (cheapest formula 1200 pence) | Reported |

**F10. Content gaps in the lead's life.**
- Klein's own day is missing 276 of 324 routine slots after chapter 30.
- Only 66 of 157 chapter 1-24 cards are bound to a day. The other 91 never come due.
- Book price ids don't match the game's pence ids, so the price rows read 0%.
- Most L10 ability rows state no cost (about 130 stated costs across about 2,400 ids), and a balance decision is pending.
- Four books (Worm, Super Supportive, Wish Upon the Stars, You Are Summoned) have no sharded reads.

**F11. The reading deadline is close.** PROJECT.md focus item 2 has the promo credit expiring on Nov 1, two days away. The book-reading queue covers about 3,600 shards and stopped once on a cap check. Wave-2 downloads are not registered for batch reading yet, and Z-Library's daily quota of 30 is used up.

**F12. One direction record is missing.** Weibao's 2026-10-30 instruction "Can consider similar ideas for each idea where relevant too" appears in `docs/representations/ABILITIES.md` but not in USER_VISION. Timing ("need not be exact to the hour") and travel ("does not decide the quality of play") are both recorded.

## Direction check

The lanes stayed inside the standing direction:
- the lead's life as the main line;
- book worlds before Frontier and Mistglass;
- desktop first at 1920;
- no mobile work;
- sealed secrets by ID.

Two drifts:
- F1 breaks "one playable slice before the next".
- F2's either/or questions break AD5.

L7's typed-feature finding (F8) is a real design fork the next wave should settle by default: build spells, divination and faith as typed shared features (GM40), with LOTM as the first adapter. That matches CHOICES.md item 4, and that item's default already says so.

## Proposals

Ranked; the top three matter most.

- **O1. Run a floor wave next, not a data wave.** For each of L4, L9, L11 and L14, wire one consumer and prove it in the browser before more data is read. Give sw-wire a second writer split by file: one owns the host files, the other `simulation.js` and the registry. Then add the rite and craft engine path. Default order: divination first (CHOICES 2), then the second city, then death and restart. Done when each row moves from "read model only" to FLR met.
- **O2. Make the safe command the default.** Point `npm test` at the limiter with `--test-concurrency=4`. Add `test:raw` for a quiet machine. Add a PreToolUse hook that blocks `pkill -f` and bare `update-ref refs/heads/master`. Cost: one package.json edit and a settings hook; the hook needs Weibao's yes (config).
- **O3. Keep one decision queue.** Fold every open Weibao-facing question (F2) into CHOICES.md, at most five at a time, each with a default and an AD5-style dial. Lanes stop asking in chat. Defaults go ahead unless he objects.
- **O4. Fix the player-facing defects in F9 in one UI cleanup lane.** Start with the developer-text leaks and the Tingen header (the cheapest), then the reload bugs (study job, fight button) and the organizations panel regression.
- **O5. Let the game MCP play a worktree.** `game_new` would take a checkout path, and worktrees would get the private fonts and cast pack through a symlink. This unblocks the floor for every branch lane (F6). Log it in the game MCP limits ledger first.
- **O6. Register stylesheets in one place.** Load them from one manifest file that lanes append to, and stop committing `dist/` on branches, leaving the build to the integrator.
- **O7. Name owners for the F8 overlaps.**
  - Debts go to the Owed ledger.
  - Known, guessed and open wording goes to Knows.
  - RPX18 goes to organizations.
  - LOTM potions go to sw-rites; mixing stays the mixture model.
  - LOTM volume 1 goes to L-A only.
  These are proposals until the coordinators confirm them.
- **O8. Content.** Fill Klein's routine after chapter 30. Decide whether the 91 unbound cards get day bindings or are logged as gaps. Map book price ids to pence.
- **O9. Reading before Nov 1.** Register the wave-2 downloads, then spend the remaining credit on the four books with no sharded reads.
- **O10. Housekeeping.** Cherry-pick `46860a01`. Record F12's quote in USER_VISION. Add the missing data for Luen's and Groselle's sheets.

## Needs Weibao

- **A1. Push.** After one clean full suite through the limiter. Both W4 and W6 are now fixed.
- **A2. Pick the next wave**: a floor wave (O1, recommended) or a continued data wave.
- **A3. Re-pin the app's git origin** to `onionviolet/OOPS.git`, under Help > Troubleshooting > Review Pinned Git Origins.
- **A4. Approve the safety hook and the default limiter** (O2).
- **A5. Read CHOICES.md 1-5** and the UI rules packet P1-P16. Defaults apply if you say nothing.
