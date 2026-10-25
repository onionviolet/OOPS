# D1 UI audit: combat, continuation and entry

2026-10-25. Read-only audit. Applies AD6–8, AD19–23, AD34, AD40, UR1–UR17,
UR21–UR25, UR35–UR49, UR51–UR64, CBR1–CBR30, and the starts/continuation
router rows in `docs/RULES_INDEX.md`. Target: 1920×1080 and 1440×900 desktop;
mobile remains deferred. No runtime or save changes.

## Authority and method

Current accepted direction remains the controlling source. The last desktop
comparison says its selected native combat journey passed, while combat with
many opponents remained unexercised. The start screen's PLAY-only behavior is a
recorded deferral in `src/new_game_beginning.js:10–14`, so it is not counted as
a defect. The layered-start probe is local-only by design.

Consulted `docs/research/PROTOLIKE_DISCORD_SWEEP_2026-10-24.md`,
`docs/research/itch-io-2026-10-22/BATCH_PROGRESSION.md`,
`docs/reviews/PROTO23_DESKTOP_COMPARISON_2026-10-21.md`,
`docs/audits/UI_DESIGN_CORE_AUDIT.md`,
`docs/gm/dispatch/procgen-2026-10-13/p28/ONBOARDING.md`,
`docs/gm/dispatch/starts-talents-continuity-2026-10-11/continuity/REPORT.md`,
`docs/UI_RULES.md`, and `.claude/rules/player-ui.md`.

The rebuilt static bundle served on `127.0.0.1:5101` was opened in isolated
headless contexts. Fresh start and after-PLAY captures, plus the continuation
Return, Anchors & study, Learning and confirmation states, were captured at
both target sizes in [`evidence/before/combat/`](evidence/before/combat/).
The initial Playwright launch under the managed shell failed; the normal system
Chrome worked after the authorized escalation. Browser errors include the
static server's 404s and the existing “No such element with availability as
recipe -> undefined” console message. No page error was observed in the captured
surfaces.

## Ranked findings

| Rank | Finding and evidence | Selector / source | Reference idea and player impact |
|---|---|---|---|
| 1 | **Shield block stat includes stray digits. Source-confirmed; rendered check blocked.** When the native readout has `r.shield`, the text template appends literal `2345` after the numeric block value. | `.enemy_stats .enemy_stat:nth-child(4)`; [`src/ui/combat_display.js:261`](../../../../src/ui/combat_display.js#L261) | The Discord sweep's F6 describes separate, readable combat columns and values. UR60–UR61 require a value to answer one clear question. The extra digits make shield mitigation look much larger and undermine combat decisions. Proposed fix: remove the suffix, then confirm an actual shield-bearing opponent at both viewports. |
| 2 | **Continuation is easy to miss on a fresh life.** It is auto-enrolled and its home contains the current-life/return state, but the only visible navigation route is the generic “Other known panels” selector; no first-play cue names the panel. Captured fresh-play screens show no continuation notice. | `#workspace_navigation select[aria-label="Other known panels"]`; [`src/continuation_ui.js:7`](../../../../src/continuation_ui.js#L7) | First Dawn's discovered-only atlas in `BATCH_PROGRESSION.md` (First Dawn section) ties the visible route to what a life has actually established. P28 AF1.4 likewise proposes a reveal tied to its real cause. A small one-time-in-session cue or direct opening link could name “Continuing connection” without changing the start-menu deferral or adding new save state. The current feature exists, but players who do not inspect “Other known panels” may miss their return route. |

## Evidence and remaining gap

- `start-1920x1080.png`, `start-1440x900.png`: fresh entry screen before PLAY.
- `fresh-play-1920x1080.png`, `fresh-play-1440x900.png`: first play after default beginning.
- `continuation-return-*`, `continuation-study-*`, `continuation-learning-*`,
  `continuation-confirm-*`: native enrolled view, tabs and uncommitted confirmation
  at both viewports. Confirmation copy states rewind scope and offers a safe
  “Keep this life unchanged” exit.
- Combat capture remains blocked. The retained precombat fixture's old elder
  dialogue route no longer matches the current app, while the old populated-multi
  fixture does not restore `#combat_div` visibly. I released the exclusive browser
  slot after the requested fresh/continuation captures rather than retrying another
  route. The shield finding is therefore source-only; no shield value is presented
  as browser-verified here.

The source comparisons in the cited reports are proposals under AD32.
The only proposed UI adjustment from this audit is the small continuation
discoverability cue; it does not authorize implementation. Existing desktop
captures remain technical evidence, not human visual acceptance.


## Coordinator verification, 2026-10-25

The parent resolved the route gap: the legacy #combat_div visibility test was inappropriate for the current shell. Native field travel and clock advancement reach the visible current-opponent context. A declared training shield is equipped through the native command; the original backing readout suffix is reproduced before and absent after. Both viewports and current Reports are captured. Connection receives a discovered direct route and focus/confirmation improvements. Canonical receipts are in `evidence/{before,after}/journeys/`; source-only combat wording above describes the preliminary audit boundary.
