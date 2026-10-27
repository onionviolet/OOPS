# LOTM start under the world entry rules, 2026-10-27

Weibao: "Start the LOTM launch start slice under WER here." The slice is item 2 of the
[2026-10-26 next order](../../../reviews/UNFINISHED_GAME_PRIORITIES_2026-10-26.md#next-order-after-the-2026-10-26-design-rounds).
Codes: WER2, WER3, WER6, WER8, WER9, WER12, WER16; AD11, AD12, AD43; UR43; UIV1; BGP9, BGP14, BGP24; ERA1; YS4.

```receipt
build: e2836f710d9ef713e0c159f575397ef2c1c2c57684da60b75eb3a2dfc935bfca
route: natural
state: browser-verified
viewport: 1920x1080 primary; 1536x864 matrix at font 14 and 21
persistence: checked
tests: node --test tests/lotm_*.test.js 141/141; npm test 3494/3494; check:arch exit 0; reconcile-master PASS; MCP walk civil life
review: diff-scoped
surface: Tingen start view (place service, center)
```

## Reading and scope

- **Viewport and screen:** 1920×1080 desktop, the existing Tingen start view in the center (place service). The launch screen stays PLAY only ([2026-10-20 direction](../../../USER_VISION.md#restore-the-original-loading-screen-and-defer-the-start-menu-2026-10-20)). The start is chosen from the fresh Village opening, through its "Cross to another world: Tingen" place action.
- **Player sentence:** before committing, the player sees the year, how they arrive and the host. Unwritten alternatives are listed with the reason they cannot be chosen yet. Picking a life shows nine plain answers, then "Confirm and cross to Tingen" or "Back to the lives".
- **Deferred:**
  - Joining Tingen to the one "Your beginning" list (WER13, BGP8).
  - The cocoon or "by design" premise with its pulls (BGP23, XM2).
  - 1352 and later (ERA2).
  - Young hosts (YS1).
  - A way back to the Village (AD12 return).
  - Pence shown in Village coin units in the inventory (pre-existing).

## What changed

- `src/book_world_lotm_entry.js` (new, pure data):
  - Three entry axes: year, arrival, host. Each has one written option plus listed unwritten ones with reasons.
  - `entryAnswers(key)` gives the nine WER3 answers per life.
  - The `entryRecord` and `validEntryRecord` functions.
- `src/book_world_lotm_lives.js`:
  - Probationer lives (XM1, a crossing into a local clerk who just died) hold the host clerk's purse of 2 pounds. This is a proposed amount; the old rule kept the money carried in.
  - Blurbs say the money held before crossing stays behind.
  - The civil life is unchanged: it arrives in person (XM3) with 5 pounds.
- `src/book_world_lotm_host.js`:
  - Enrolling always sets the life's own purse.
  - It records `state.lotm.entry = {era:1349, method, host:'adult', leftBehind:{money}}`, keeping the Village money for a later return.
  - The start view exposes the axes and answers.
- `src/book_world_lotm_state.js`: `entry` is an optional field. Malformed records are refused.
- `src/book_world_lotm_ui.js`: the start view shows the axes. Each life button opens a confirm step with the nine answers and Back.
- Scripts:
  - `scripts/playtest/reconcile-master.mjs` adds the pick, Back, confirm, purse and left-behind assertions.
  - `scripts/mcp/game_mcp_check.mjs` adds the pick click.
- Tests: `tests/lotm_lives.test.js` covers purse and entry record per method, the nine answers matching the purse, old saves without `entry`, and malformed records.

## Save compatibility (WER16)

- Saves enrolled before this change have no `entry` field. They validate and play unchanged, and their money is untouched; the purse rule applies only at enrollment.
- A save written by this build carries `entry`, which an older reader refuses as an unsupported field. That is accepted as forward-only, like earlier optional LOTM fields.
- Profile ids are unchanged.

## Checks

| Check | Result | Gaps |
| --- | --- | --- |
| `node --test tests/lotm_*.test.js` | 141 pass, 0 fail | Focused |
| `npm run build` | Bundle sha256 `e2836f710d9ef713e0c159f575397ef2c1c2c57684da60b75eb3a2dfc935bfca`, `v0.6-e8554f575481` | |
| `npm run check:arch` | Exit 0, no new cycle | |
| `node scripts/playtest/reconcile-master.mjs . evidence` | PASS on that bundle, fresh origin, headless. Choice and confirm screenshots at 1920. Back returns without enrolling. Purse 480 pence; Village money 102 recorded as left behind. Save, reload, Export and literal Import keep the LOTM slice and location. Matrix 1920/1536 × 14/21. | Probationer life only |
| MCP walk (`yairpg-game`, seed 271027) | Fresh life, Village door, civil life picked, nine answers read, confirmed; arrived at the workroom with 1200 pence (5 pounds) | |
| `npm test` | 3494 pass, 0 fail | |
| `npm run check:rules` | Index PASS; receipt lint rerun after adding this block | |

## Floor (AD43)

| Line | Status |
| --- | --- |
| FLR1 | Bundle hash above |
| FLR2 | Earned route from a fresh life: MCP walk, then rebuilt desktop browser |
| FLR3 | Each axis, life and confirm button states its effect; unwritten options give reasons; disabled controls keep their reasons |
| FLR4 | The purse is the money resource every Tingen price and wage reads. The entry record is shown nowhere yet, and its `leftBehind` has no consumer until a return exists. |
| FLR5 | Save, reload, Export and Import exercised |
| FLR6 | Agent-verified, not human-reviewed. The route is ordinary play, not a fixture. |

Status: done at the floor for the purse and confirm step. The entry record is kept for later consumers.
