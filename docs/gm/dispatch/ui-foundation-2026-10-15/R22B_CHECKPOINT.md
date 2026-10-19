# R22b checkpoint: screen use at 1920, 2026-10-17

Weibao's go: "Yes, start R22b as planned. Status window compact by default too." Plan row R22b and
SU1–SU12 in the [Round 15 plan](next-parts/round-15-whole-plan.md#screen-use-at-1920-weibaos-r22-check-2026-10-17).
Branch `claude/ui-r22b-screen-use` from `codex/gameplay-foundations` at `b855f9ac2`, worktree
`.claude/worktrees/ui-r22b-screen-use`. Rules: UR11, UR13, UR17, UR37, UR46, UR52; AR1, AR3, AR16; AD36.

Target: 1920×1080 primary and 1800×1040 DPR 2; floors 1536×864 and 1366×768; 14px and 21px.
Mobile deferred.

## Scope

| Code | Change | Seam |
| --- | --- | --- |
| SU1, SU2 | Opponent list moves out of Around you into a new `opponents` panel, a fight companion in the second column beside the actions; one column while the slot's height fits every row | `src/village_workspace.js` (definePanel), `src/layout_spec.js` (spec 3, contexts, boardLayout height), `styles/shell_layout.css`, `styles/opponents.css` |
| SU3 | Around you in a fight: the inspected opponent's name, health and facts, level with You's bars | `src/village_workspace.js` |
| SU4, SU5 | One hue per opponent kind (first-appearance order in the wave), same on board and log; letter chip in the log | `src/opponent_board.js` (one authority), `src/combat_log.js`, `styles/ui_tokens.css`, `styles/combat_log.css`, `styles/opponents.css` |
| SU6 | You narrows: two stat column pairs at 1920 | shell CSS |
| SU7 | Light custom palette: native report colors follow the palette tokens | `styles/combat_log.css` |
| SU8 | Saved spec-2 layouts gain the new companion without losing placements | `src/workspace_layout.js` |
| SU11 | Status window starts compact (Weibao's decision) | `src/status_window.js` |

Not in scope: idle second-slot content (SU12), crowd units (HZ3+), save format.

## Failure scenario to guard

8-mixed fight at 1920: before, the board is 3 columns in a 147px top-row band and the place region
is ~480px empty. After, 8 rows plus 3 group labels in one column beside the actions, no page
scroll at any target, actions unmoved under a pending click (UR52), check-r20/r22 still pass.

## Gates

npm test, check:arch, new check-r22b, check-r22, check-r21b, check-r21, check-r20, check-r11 to
check-r18 as inherited (R12_URL for r12/r14), CH1 gate (REPO, URL). Before/after screenshots at
1920 and MacBook via target-set.cjs.
