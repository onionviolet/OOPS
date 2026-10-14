# Vivid + Proto23 UI flow: until-done goal (2026-10-13)

Authority: Weibao, 2026-10-13: "send out accordingly, use the until done skill? We
can fully expand/extend from proto23 completely?" after picking Vivid as his
current favorite. Direction lives in [USER_VISION](../../../USER_VISION.md#proto23-full-source-ui-absorption-2026-10-13)
and the design owner section
[Vivid frame, Proto23 flow, worlds and occasions](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md#vivid-frame-proto23-flow-worlds-and-occasions-proposal-2026-10-13).
Considerations V1-V16: [palette](../../../research/proto23/VIVID_AND_UI_FLOW_CONSIDERATIONS_2026-10-13.md).

## Objective

On a fresh desktop browser the game opens in a finished Vivid scheme, panels such
as Combat appear the first time you actually meet them (once, never on reload),
new items and coin spends give quiet anchored feedback, the log never yanks you
while reading, and every Proto23 source family has a recorded disposition.

## Done check

`docs/gm/dispatch/vivid-proto23-flow-2026-10-13/check.sh` exits 0. It rebuilds,
serves on its own port 18251, checks served/built parity, runs `checks/unit.mjs`,
`checks/ledger.mjs`, `checks/browser.cjs` (fresh origins, 1366×768 plus 1440×900
and 1920×1080) and `npm test` against `checks/BASELINE_FAILURES.txt`.
Run one item: `URL=http://127.0.0.1:18251/ node checks/browser.cjs I4` while a
server runs (check.sh starts and stops its own).

## Items (one per round, in order; see progress.json)

| ID | What | Considerations |
| --- | --- | --- |
| I1 | Vivid is the default for browsers with no stored choice; a stored `standard` stays Standard | V1 |
| I2 | Vivid retunes the four bars: same hue family (≤35°), different fill, ≥3:1 against their panel; Standard bars byte-identical | V2 |
| I3 | New `src/rarity_palette.js` `rarityColor(rarity, scheme)`; display.js uses it; Vivid names ≥4.5:1 on all Vivid surfaces; Standard unchanged | V3 |
| I4 | Discovery separate from current usability in `workspace_layout.js`: undiscovered panels have no picker entry or label anywhere; Combat discovered by the first real fight, marked once with `data-workspace-reveal` (V10 arrival animation, none under reduced motion), never on reload/import; discovery derived from existing save facts | A6, V10 |
| I5 | Session-only "new" dot: `data-item-new` on a newly acquired inventory row, cleared on hover or focus | V11 |
| I6 | One `.coin-float` per spend, anchored to the purse line, shows the negative amount, removed ≤4 s, no animation under reduced motion | V12 |
| I7 | `--sem-gain/--sem-loss/--sem-money/--sem-blocked` on `:root` for both schemes, ≥4.5:1 on the log surface; purchase log line uses one | V9 |
| I8 | Log reading: scrolled-up log does not jump on new messages; `[data-log-unread]` shows "1 new"; clicking it jumps to newest and hides | V13 |
| I10 | Character vitals molded on Proto23's compact rows: four bars share edges and height, value text same size and centred (±1 px) inside the bar, empty tracks visible (≥1.5:1 Standard, ≥3:1 Vivid), name aligned with the bars, level shown in the panel. Weibao, 2026-10-13: "current character vitals are misaligned" | take-or-mold |
| I9 | No horizontal scroll and local actions visible at 1366×768, 1440×900, 1920×1080 | gate |
| L1 | `PROTO23_ABSORPTION_LEDGER.json`: every `## ` heading in the five reader reports and both 2026-10-13 Proto23 reports maps to `{source, heading, mechanism, disposition, owner, evidence?, reason?}`; dispositions adopted/adapt-next/parked/rejected/not-applicable; adopted needs a real evidence path | full absorption |

L1 is research: read sources and current owners, judge honestly, mark things
`adapt-next` rather than `adopted` unless rebuilt evidence exists. It does not
authorize implementing the next slices.

## Constraints

- Files you may edit: `src/workspace_layout.js`, `src/workspace_state.js`,
  `src/workspace_views.js`, `styles/workspace.css`, `src/display.js` (rarity,
  inventory row marker, log scroll only), new `src/rarity_palette.js`,
  `src/settled_text_effects.js` (coin float), `style.css` (tokens and the vitals block), `index.html` (vitals markup only, keep every existing ID), `dist/` via `node build.js`, this folder except `checks/` and
  `check.sh`.
- `src/main.js`: only a minimal hook if no owned file can observe the event;
  record why in notes. The Foundation lane (Codex R11, see
  `../foundation-adoption-next-2026-10-13/CHECKPOINT.md`) owns runtime, save,
  story and tests; do not touch save serialization, simulation, hosts or tests/.
- No save schema change. Discovery derives from facts the save already holds.
- Player Appearance palettes and stored color choices win over Vivid.
- Standard scheme must look exactly as before, except the I10 vitals alignment fixes, which apply to both schemes.
- Mobile is deferred; desktop/laptop first.
- No commit, push or publish. No user saves. Sealed secrets stay sealed.
- `checks/`, `check.sh`, `GATE.sha256` are read-only. Never loosen a check.

## Stop and ask (exit 2 territory)

- A check seems wrong about the game (route broke because the game changed):
  write the diagnosis in Next round and stop; Weibao or the coordinator decides.
- A new `npm test` failure in an area this goal never touched (another writer):
  record it and stop.
- Anything that needs a save field, a commit or a shared-runtime edit.

## Budget

About 30 rounds, 8 hours wall clock. No-progress rule: two rounds without a
newly passing item means stop and write the diagnosis.

## Each round

1. Read progress.json, Next round, Dead ends, `git status --short | head`.
2. Take the first failing item. Search existing code first (`settled_text_effects`,
   `native_discovery_feedback`, `component_themes`, `customization_profiles`).
3. `node build.js`, then run that item's check yourself; flip `passes` only on
   PASS output in this session.
4. Update `notes`, rewrite Next round (≤5 lines), append Dead ends.
5. Before declaring done, run the full `check.sh` after the last edit.

## Next round

I1, I2, I10 pass. I7 needs one main.js line (coordinator call): at src/main.js:653 in actFort,
`log_message(plan.message, action==='buy_notes'?'purchase':'notification')`; display.js 'purchase' type and tokens are ready.
Then continue with I3 (rarity palette), I4..I8.

## Dead ends

(append only)
- 2026-10-13 I7: styling `.message_notification` with a token would mislabel errors/blocked lines (same log type), so the purchase line needs its own type from the caller.
- 2026-10-13 I4: hiding undiscovered shells inside the docks still leaks their names: each dock carries an aria-label, so the check reads the dock's whole textContent (hidden children included). Undiscovered shells now wait in a hidden unlabelled `.workspace-undiscovered` holder on the board.
- 2026-10-13 I4: starting the reveal settle clock only when a module flips meant the first in-play flip never revealed; updateWorkspace now ticks the clock every pass.
- Gate gap found after done (2026-10-13): I2/I10 measured bar fill vs panel but not value text vs fill; white text read 1.6-2.5:1 on Vivid fills. Coordinator fixed with dark text. Future gates: measure text against every surface it sits on.
- 2026-10-13 coordinator harness fix: index.html probe uses plain http (no keep-alive) instead of Node 22 fetch, which crashed with undici assert(!this.paused); check.sh logs go to a per-run mktemp dir so parallel runs don't collide. No check loosened.
