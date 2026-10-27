# Going back to the Village from Tingen, 2026-10-27

Weibao: "Yes build it" (RET3/RET4 with SMU5, [round 29](../../../INTRO_FLOW_CONSIDERATIONS_2026-10-13.md#round-29-going-back-to-the-village-start-and-menu-ui-the-desktop-app-2026-10-27)).
Codes: RET3, RET4, SMU5, WER3, WER9, WER16, AD10, AD12, AD43, AR1, AR3.

```receipt
build: 099c05ecfc299439d2669986c09668c26e003c7755edd4874a888f8d8556f080
route: natural
state: browser-verified
viewport: 1920x1080 primary; 1536x864 matrix at font 14 and 21
persistence: checked
tests: node --test lotm_lives + continuation_state; npm test 3497/3497; check:arch exit 0; check:rules PASS; reconcile-master PASS (cross, resume Village, resume Tingen, literal Import)
review: diff-scoped
surface: Tingen start view and workroom (place service); Continuing connection panel
```

## Reading and scope

- **Viewport and screens:** 1920×1080. The Tingen start view and workroom, and the existing Continuing connection panel.
- **Player sentence:**
  - The confirm step says "Your Village life pauses where you left it, money and all. Resume it from Continuing connection".
  - Inside Tingen, the workroom shows "First life is paused where you left it" with an "Open Continuing connection" button.
  - "Resume First life" switches back. Resuming the Tingen life switches again.
- **Deferred:**
  - Naming the Village life something friendlier than "First life".
  - The SMU1 date and SMU2 money units.
  - Moving snapshots into files (round 30).
  - An MCP walk of the resume hop, which the browser journey covers.

## What changed

- `src/continuation_state.js`:
  - New `branch:<label>` command. It pauses the active life exactly as it is and starts a tethered life from the same moment, without restoring, so the running game is unchanged.
  - `TRAVEL_WORLDS` lets a life in `book.lotm.tingen` pause and resume. Rewinds stay Frontier-only.
- `src/continuation_ui.js`: "Continue this life from the paused boundary" needs only a writable save. Before this, a resumed Tingen life was stuck, because the button used the rewind-only reason while the engine stayed paused. The journey found this.
- `src/main.js`:
  - LOTM ports `branchReason`, `branch` and `pausedLife`, added inline on the existing `configureLotm` line.
  - A branch transition does not reload.
  - `continuationEligibility` added to an existing import line.
  - No line growth (AR1).
- `src/book_world_lotm_host.js`:
  - `cross()` branches first when a connection can carry the life, then runs the existing in-place `enroll`.
  - Without one (no port, a non-adult body, a running challenge), it enrolls in place and the answers say there is no way back.
  - The view exposes `returnable` and `pausedLife`.
- `src/book_world_lotm_entry.js`: the money and old-life answers follow `returnable`.
- `src/book_world_lotm_domain.js`: the panel's enroll calls `cross`.
- `src/book_world_lotm_ui.js`: the async confirm with a "Crossing…" notice, and the paused-life row with the button.
- Tests:
  - `tests/continuation_state.test.js`: branch, resume both ways and rewind refusal.
  - `tests/lotm_lives.test.js`: cross with and without a branch port, and a failed branch leaves the Village untouched.
  - `tests/lotm_helpers.js`: `hostOver` takes port overrides.
- `scripts/playtest/reconcile-master.mjs`: the round trip and save-size measurement.

## Save compatibility (WER16)

- No new fields; the existing continuation record carries everything.
- Tingen saves crossed before this have no Village snapshot. They keep playing Tingen, and nothing invents a past life (RET6).
- A new game without a connection record gets one at first crossing through the existing `enroll` command.

## Checks

| Check | Result | Gaps |
| --- | --- | --- |
| Focused `lotm_lives` + `continuation_state` | Pass, including the 3 new tests | |
| `npm test` | 3497 pass, 0 fail | |
| `npm run check:arch`, `npm run check:rules` | Exit 0, PASS | |
| `reconcile-master.mjs` on the bundle above | PASS from a fresh headless origin: cross; the paused Village keeps 102 money; resume Village (102 money, no `lotm` slice, Tingen door visible); resume Tingen (480 pence, exact `lotm` slice and place); literal Import keeps both lives; matrix 1920/1536 × 14/21 | The harness seeds `crypto.randomUUID` per page load, so the script burns one id after each reload; real browsers are unaffected |
| Save size, two lives | Whole 303,409 chars; continuation 211,607; one paused Village snapshot 78,221; expansion 9,763 | Feeds round 30 |

## Floor (AD43)

| Line | Status |
| --- | --- |
| FLR1 | Bundle hash above |
| FLR2 | Natural route from a fresh life in the rebuilt desktop browser. The resume hop has no separate MCP walk. |
| FLR3 | Confirm text, paused-life row and continue button state effects and reasons |
| FLR4 | Resume is the existing connection verb; the paused snapshot is its consumer |
| FLR5 | Save, reload, literal Export and Import across both lives |
| FLR6 | Agent-verified, not human-reviewed; route natural |

Status: done at the floor.
