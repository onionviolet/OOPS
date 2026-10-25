# D1 shell and navigation audit, 2026-10-25

Scope: shell/navigation, You, inventory, Reports log, controls and settings. Applied UR7, UR11, UR14, UR21, UR25, UR27, UR31, UR44, UR46, UR57, UR65–UR68 and AD34/AD36. Target viewports: 1920×1080 primary and 1440×900 comparison. Visible outcome: keep the desktop shell's independent regions, readable action and report streams, and direct panel paths. Mobile optimization and unrelated gameplay are deferred.

Evidence is from the rebuilt worktree app at `http://127.0.0.1:5101/?test_hooks=1`, with a new browser context and `tests/fixtures/perf/mid.json`. Screenshots and geometry receipt are in [before/shell](evidence/before/shell/). The 1920×1080 populated screenshot is a mid-game fixture with native inventory and discovered nearby services. The 1440×900 capture shows the same fixture at a narrower desktop target. The first run had the fixture's `recipe/undefined` key and unavailable optional manifest, causing console 404 noise; those are fixture setup issues, not shell findings. The reusable audit script now removes the undefined recipe key and accepts `OUT` and `YAIRPG_URL`, but that corrected matrix was not run because browser ownership moved to the next lane.

## Ranked findings

| Rank | Finding | Source and player impact | Evidence / status |
|---|---|---|---|
| 1 | The Village mixing routine uses a boxed button among otherwise compact action rows. | `src/mixture_ui.js:10` appends “Mix at the Village counter” as a standalone button. It looks like a different action grammar, so the player can read the same routine list as mixed control types. This repeats UIA14, whose full-resolution confirmation and L8 follow-up are recorded in [UI design core audit](../../../../docs/audits/UI_DESIGN_CORE_AUDIT.md). | Visible in [1920×1080](evidence/before/shell/populated-1920x1080.png) and [1440×900](evidence/before/shell/populated-1440x900.png). Still open; source behavior was not changed in this audit. |
| 2 | At 1440×900, the bar presents two separate “More panels” paths: the known-panel select and the route-overflow control. | `src/workspace_navigation.js:42-43,83-84` builds “More panels…” from every known panel; `src/game_bar.js:32-33,48-62` separately folds hidden route buttons into “More N”. In the screenshot they sit beside each other. Each solves a different coverage problem, but similar labels obscure which list contains a desired destination and spend scarce top-row width twice. | Visible in [1440×900](evidence/before/shell/populated-1440x900.png); not present as a duplicate at 1920×1080. Proposal: distinguish the all-panels picker from folded route labels, or combine their entry point while retaining the direct known-panel search behavior. No accepted choice selected here. |

## Checked with no new defect established

At both captured viewport sizes the document matched the viewport, You, Inventory, actions, focus and Reports remained visible, and the Reports region stayed full height. The populated fixture's log only contained startup/location entries, so it does not exercise the UR44 live combat/event stream or long-history scrolling. The Settings capture showed draft status, profile/module choice, seasonal and component themes, font/size, palette and spacing controls; it is not a complete settings acceptance pass. The initial browser output included missing optional manifest and recipe warnings, which are excluded as audit findings.

No runtime files changed. No tests or build were run by this read-only lane. No gameplay, settings persistence, large-text, hover, or long log journey is claimed. Weibao's visual acceptance remains open.


## Coordinator verification, 2026-10-25

The coordinator confirmed UIA14 and fixed the Mixing grammar. All panels and shortcut labels are now distinct; a subsequent geometry regression also caught and fixed picker clipping at 1440. Canonical paired evidence is in `evidence/{before,after}/panels/` and the final interaction receipt. Initial captures here used fallback fonts; use CHECKPOINT and the canonical index for current claims.
