# S1 checkpoint: seat filter

Scope: CL224, CL227, CL237, CL244; CLR2–CLR4, CLR9–CLR13; AR3, AR14, AD43.
The implementation is **implemented, below floor**. Shared LOTM panel integration
is prepared for the coordinator in [S1_INTEGRATION.patch](S1_INTEGRATION.patch).

## Data probe

| Input | Expected | Observed | Gate |
|---|---:|---:|---|
| Perspective control rows | 64 | 64 | yes |
| Navigation route IDs | 20 | 20 | yes |
| LOTM entry profiles | 5 | 5 (`PROFILE_IDS`) | no |

## Implementation

- `src/seat_profiles.js` derives `be`, `beside`, and `ordinary` from existing
  profile state. It defines `follow` and `bystander` defaults, the capability
  registry, and the single `seatAllows` read point. No seat field is persisted.
- `src/workspace_navigation.js` filters route buttons, center pane buttons, and
  known-panel options through that read point. The state comes from the existing
  read-only expansion port.
- Unknown control/capability IDs remain visible and emit one development-console
  warning per ID.
- The integration patch exposes the existing entry profile to the LOTM panel
  view and filters its C1 panel-block anchors. It is deliberately not applied
  over G1's live files.

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/seat_profiles.test.js` | PASS, 5/5 | Synthetic state and route assertions; no browser. |
| `npm run check:arch` | PASS; main growth -30, display -37, save files 0; no new reported growth | Shared checkout baseline includes concurrent work. |
| `git apply --cached --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/S1_INTEGRATION.patch` | PASS against current index/HEAD | Standard worktree check collides with G1's uncommitted edits to both patch targets. |
| `node scripts/lane_review.mjs --grant src/seat_profiles.js --grant tests/seat_profiles.test.js --grant src/workspace_navigation.js --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/S1_CHECKPOINT.md --grant docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/S1_INTEGRATION.patch src/seat_profiles.js tests/seat_profiles.test.js src/workspace_navigation.js docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/S1_CHECKPOINT.md docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/S1_INTEGRATION.patch` | PASS; `outside-grant=0`, `name-hit-files=0`, `top-level-await-files=0` | Candidate paths remain uncommitted for coordinator review. |

## Delivery floor

- **FLR1 Build:** not run; no bundle hash.
- **FLR2 Route:** unit fixtures cover seat and route decisions; rebuilt desktop
  browser journey remains with the coordinator.
- **FLR3 Shown:** hidden controls are omitted; browser rendering not exercised.
- **FLR4 Used:** the existing navigation route and known-panel selectors consume
  the filter; LOTM panel consumer awaits the integration patch.
- **FLR5 Kept:** no persistence change; synthetic beside round trip adds no seat
  field.
- **FLR6 Labelled:** source-spot-checked only; not human-reviewed. Route kind:
  fixture. Status: implemented, below floor.

No commit, staging, reset, stash, or push was performed. Owned paths are released
to the coordinator; concurrent work was preserved.

## Coordinator review (2026-10-28)

Two defects fixed by the coordinator: the panel filter skipped every anchor without a `#lotm_panel` prefix
(25 of 34, including all crossing and other-seat rows), and the known-panel option filter asked for
unregistered capabilities (one warning per panel); it now uses the route's control row. The prepared patch
no longer applied after G1's hunks, so its two hunks were applied by hand. Focused tests 6/6 with C1; floor
bundle `0539519f` (with G1) zero page errors in a beside life. Not yet browser-checked: a be state, which
needs B1.
