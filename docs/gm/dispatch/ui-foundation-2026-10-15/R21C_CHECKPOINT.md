# R21c checkpoint: status window home in the parity shell, 2026-10-17

Saved before editing. Session: Claude (UI main chat after R21b), worktree
`.claude/worktrees/ui-r21c-status-window-home`, branch `claude/ui-r21c-status-window-home` from
`codex/gameplay-foundations` at `2eb36e296` (R21b merged). Queue row R21c in the
[Round 15 plan](next-parts/round-15-whole-plan.md); finding F1 in [R21B_REPORT](R21B_REPORT.md).
Rules: UR13, UR16, UR17, UR18, UI_RULES viewport targets (2026-10-17); AR1, AR3 (one authority per fact),
AR16; AD36 verification.

## Task record (UR18)

- **Surface:** the CH1 awakened status window (`status-window`, `src/status_window.js`) in the
  parity shell, the default presentation.
- **Targets:** 1920×1080 primary and the MacBook size (1800×1040 DPR 2) for screenshots; the CH1
  gate's own sizes (1366×768 and its H6 set) for behavior.
- **Visible outcome:** once the system awakens, the status window shows under You (vitals and
  character) in the top-left region and keeps its one-time reveal (UR13). Before awakening nothing
  shows or names it (H1, H2).
- **Deferred:** the non-parity proto23 shell keeps parking it (not the default; no change asked);
  the cheat host pilot (NX7, Part 10); any restyle of the window.

## Live facts (stated, from source)

- `status-window` registers with `defaultDock: 'left', after: 'vitals'` and is discovered and
  eligible only when awakened.
- `src/layout_spec.js` gives it no region, box or companion. `src/workspace_layout.js:294` keeps a
  hard-coded `core` list; a composed shell parks any panel outside it unless it is a parity
  companion, so the window is parked. A fresh shell layout also hides every panel outside
  `shellOrder`.
- CH1 gate H3–H6 fail with "status window did not appear within 120s" on R20, R21, R21b.

## Plan (proposal)

1. Spec: `status-window` joins the player region and the You box after `shell-character`, and
   `shellOrder` after `shell-character`. Move to carries it with You. Companion homes were the
   other route, but companion grid rules are written for Journal and Skills only, and the window is
   the character's own sheet.
2. `workspace_layout.js`: a parity panel that belongs to a spec box is not parked (the spec, not
   the `core` list, says it has a home). Saved browser layouts that hid it before it had a home
   unhide it once (layout spec 2, the same pattern as spec 1 for companions; UR17). Game save
   untouched.
3. Checks: CH1 gate H1–H6, npm test, check:arch, check-r21b, check-r21, check-r11 to check-r20;
   before/after screenshots on an awakened save at 1920×1080 and the MacBook size.
