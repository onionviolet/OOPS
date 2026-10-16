# R16 checkpoint, 2026-10-16

Owner: Claude session "shell default and core restructure" (desktop app), started from the
"UI extension and modulization" session. Shared checkout, branch `codex/gameplay-foundations`.
The engine-lane session owns `src/main.js`, `src/display.js` and `src/save_files.js` in its own
worktree; this session stays out of them.

## Why this round jumps the queue (IT4)

Weibao after R15 (PROJECT.md accepted decisions, 2026-10-16): the shell becomes the default
screen, and core components restructure next, because things "look big for no reason" and the
core changes and extra panels he asked for are missing. The Round 15 plan's "Feedback: core first"
section orders the work: shell default, density pass, whole-screen composition, then R16+ as
queued (now renumbered, see the plan).

## Scope: three slices, one at a time

| Slice | One gap | Rules |
| --- | --- | --- |
| R16a | **Shell default.** The R14/R15 parity shell opens when no presentation choice is stored. A stored choice (classic, shell or parity) is kept. Layout menu can still switch | UR17, UR58, AD34 |
| R16b | **Density pass.** Chrome sized to content at the actual text size: inventory chrome rows, place header lines, local tab strip, bottom pane tabs, log tools, You buttons, panel headers. No text made smaller (UR34, UR46); log column width unchanged (UR11); nothing moves on ticks (UR52, WX4) | WX2, WX3, WX12, CTL9, CTL14, CTL18 |
| R16c | **Idle and combat compositions.** Companions in sparse space from existing views (WX7), per-panel yield (WX5), manual choices win (WX11). New code in its own module (AR1); layout data heads toward the UIE20 spec | WX5–WX7, WX10, WX11, PX1–PX3, PX10 |

- **Target:** 1366×768 at 14px and 21px, 1920×1080 at 21px. Desktop first; mobile (≤1000px) deferred.
- **Deferred:** inventory category tabs (now R18), opponent board sizing (now R20), log row work
  (now R21; R17 is the approved structural spec + Step 0 round), preview conversion (Step 0), any save change.
- **Save:** none planned. The presentation choice is browser-local (`localStorage`), not the save.

## Before evidence

Frozen copy of the R15 tree: `~/.codex/candidates/yair-ui-r15-before-2026-10-16` (HEAD
`a595d4768` plus the shared tree's uncommitted edits at the time), served on port 19272.
Slack map (WX13) on that copy: [`evidence/r16/before/slack-map.md`](evidence/r16/before/slack-map.md),
screenshots beside it. Script: [`slack-map-r16.cjs`](slack-map-r16.cjs).

## Checks chosen before editing (AD36)

- Failure scenarios: a fresh origin opens classic (R16a); at 1366×768 21px in combat the inventory
  shows four rows under three chrome rows and the log tools take two 42px rows (R16b).
- `npm run build`; `npm test` (known unrelated failures: two cheat-awakening tests and the UI
  contract flag on another session's `styles/oops_branding.css`).
- Browser on fresh loopback origins at the three targets: default presentation check (new),
  slack map before and after, `check-r15`, `check-r14`, `check-r13`, `check-r12-ticks`,
  `check-r11-interactions`.
- Human visual/play acceptance stays open (UR16).

## Reservation

Edits: `src/workspace_layout.js` (presentation default), `styles/ui_tokens.css` (density block),
new composition module(s) under `src/`, dispatch-folder checks and reports, the Round 15 plan's
queue, `.claude/launch.json` (two server entries). Other sessions' dirty files are left as they are,
except the build's version-string rewrite of `index.html`, which earlier rounds also accepted.

## Technical close

[R16 report](R16_REPORT.md). Files changed: `src/workspace_layout.js`, `src/workspace_state.js`,
`src/proto23_shell.js`, `src/shell_composition.js` (new), `styles/ui_tokens.css` (R16b, R16c blocks),
`tests/shell_composition.test.js`, `tests/workspace_spec.test.js` (new), `check-r11-interactions.cjs`
(one assertion, see report), new checks `check-r16-default.cjs`, `check-r16.cjs`, `slack-map-r16.cjs`,
build outputs, `.claude/launch.json`. Reservation released. Human acceptance open; no commit.
