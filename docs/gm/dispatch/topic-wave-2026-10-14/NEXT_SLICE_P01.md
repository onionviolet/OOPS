# Next slice: work feedback on the Village mixing panel (P01, dispatched)

Status: dispatched on Weibao's "send next part", 2026-10-14. Written 2026-10-14 by root from
[chains round 5](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md#next-playable-slice-p01-work-feedback-on-the-village-mixing-panel),
the synthesis packet [P01](../../../research/cross-game-synthesis-2026-10-14/PACKETS.md#p01)
and TW-S touches S01-S04 and S06. This file is the authority for the slice's
scope, ownership and completion evidence. Ideas outside it stay in their owners.

Suggested executor: one Codex worker, high reasoning, medium effort. Root
reviews ownership, wording and browser evidence. Weibao judges feel.

## Goal

At the Village mixing counter, a player can always see, side by side: what
the next mix will hold and cost, what actually stops it (in player words),
how long the current work takes and the current reason a next batch cannot start, and what the
last finished mix really produced. Projection only: **no new save field**, no
reward, no new work engine.

## Before writing

1. Read AGENTS.md (standing direction, verification), PROJECT.md priorities,
   chains rounds 3 and 5, P01 in PACKETS.md, TW-S rows S01-S07, and the T3
   [REPORT](../chain-build-2026-10-14/t3/REPORT.md) and BACKLOG.
2. Recover live ownership: `git log -5` on `src/mixture_ui.js`,
   `src/mixture_native.js`, `src/mixture_state.js`, `src/mixture_rules.js`,
   `src/chain_inspector.js`, `src/action_legibility.js`; check
   `docs/gm/dispatch/*/STATUS.md`, `runs/SESSIONS.md` and `git worktree list`
   for a live writer of those files. If one holds them, stop and report.
3. Worktree from current `codex/gameplay-foundations`; CHECKPOINT at
   `docs/gm/dispatch/topic-wave-2026-10-14/p01/CHECKPOINT.md` inside it.

## Build

- **Pure projection module** (for example `src/mixture_feedback.js`): input is
  the current frame, mixture owner and the existing quote result; output is
  plain data for four rows. Never mutates state, never consumes a draw, never
  advances time.
  1. **Holds and cost:** inputs the next vial (and a queued repeat of N) would
     hold, owned now, left after, and coins if buying is the route. Totals
     reconcile to actual stock.
  2. **Blocker:** the real reason Mix or Queue is unavailable, in player words
     (missing input with amount, vessel busy, method not learned, stale quote).
     Map known quote failures to sentences; project requirement leaves through
     `projectKnownActionRequirements` so hidden prerequisites stay hidden. Never
     show a raw evaluator or exception string as player knowledge; unknown
     failures read "Can't mix right now" plus the retained notice.
  3. **Work:** minutes left, batches queued, minutes per batch, total time
     left, when no queue is running, "Queue finished or stopped" and the current blocker
     from current stock and quote, explicitly labelled current. Never claim the historical stop cause.
  4. **Last result:** the latest finished product, inputs consumed and when,
     from retained records. If the record lacks a field, show it as
     unavailable; never rebuild it from prose.
- **Panel join** in `src/mixture_ui.js`: render the four rows inside the
  existing panel near the Mix control and job line; keep current controls,
  ids and behavior. Rendering pays zero.
- **Tests:** unit tests for the projection (each blocker kind, repeat stop,
  missing receipt field, hidden prerequisite stays hidden, purity: same inputs
  give same output and leave state byte-identical).

## Done means

- `npm run build` passes; focused tests pass; full `npm test` count reported
  with any pre-existing failures named.
- Fresh-origin Playwright on the rebuilt bundle at **1366x768** and
  **1600x1000**: buy inputs with coins, mix one vial, queue a learned method
  until an input runs out (current blocker names it), replenish and resume,
  cancel mid-job (held inputs return, rows update), trigger a stale quote
  (refused, nothing paid), reopen the panel repeatedly (no stock or time
  change). All four rows readable with the Mix control visible without
  scrolling at 1366x768.
- Save, reload, Export and literal-file Import mid-job and after completion:
  stock, job and last-result rows identical before and after.
- Screenshots and a short REPORT in the CHECKPOINT folder; anything not
  exercised is labelled implemented-unverified.

## Stop and report instead of improvising

- Any row needs a new saved field. Report the exact missing fact instead.
- A blocker can only be explained by exposing a sealed or unknown value.
- Another live writer holds a listed file.
- The panel cannot fit the four rows at 1366x768 without a layout change
  beyond this panel.

## Coordinator clarification, 2026-10-14

Root Claude explicitly narrowed the work row after the retained-state stop
reproduction at `4fda8929`: use current truthful state and blocker rather than a
historical stop cause. No new save field. Retained stop cause remains a LATER
optional-revision proposal; record the exact missing fact, intended writer and
absent-means-unknown compatibility in the P01 report. Other gates stand.
