# UI refactor wave, 2026-10-29

Weibao: "save the stuff for future accordingly, refactor now? more to consider? Work in parallel using sonnet agents?" ([direction](../../../USER_VISION.md#ui-refactors-now-in-parallel-sonnet-lanes-2026-10-29)). Coordinator: this session ("UI overhauls"). Source of the items: [UI audit](../../../audits/UI_DESIGN_CORE_AUDIT.md) rounds 8-12 (MDL, LTU, RPX, RIX codes). Everything not listed as a lane stays in those rounds' LATER tables.

## Lanes (Claude sonnet subagents, one worktree each)

| Lane | Code | Owns | Done check |
| --- | --- | --- | --- |
| R1 Seat seam | MDL9, MDL4, LTU11 | `src/seat_profiles.js`, new `src/observer_view.js`, new tests | One read point for "what this seat may see"; a test fails on a direct lead-identity read in UI modules; existing seat tests pass |
| R2 Scene card | MDL3, MDL11, SUI1-SUI13 | new `src/ui/scene_card.js`, `styles/scene_card.css`, one existing scene converted outside the frozen files | Two scene kinds render from data through slots; text form intact; focused tests |
| R3 Figure and gallery | MDL2, MDL7, MDL8, MDL13, RPX1, RPX11 | new `src/ui/figure.js`, `styles/figure.css`, new `figure-gallery.html` and `src/ui/preview/figure_gallery.js` | Ritual circle and relationship web render from specs with no kind-specific drawing; text form; effects off keeps facts; 1920×1080 capture |
| R4 Rules in one place | RIX1, RIX2 | rule-book hunks, stubs, `scripts/check_rules_index.mjs` | Codes and wording unchanged; `check:rules` warns on unrouted or dispatch-owned sets and passes |
| R5 Adoption routine | MDL16, MDL15 | new `scripts/adopt_candidate.mjs`, a runbook section, a load-time measurement | One command builds a candidate from a commit, runs the frozen check on a profile copy and stops before the swap; first-load numbers recorded |

Deferred: MDL10 mount on first open waits for the UI freeze fix that currently owns `src/workspace_layout.js`, `src/panel_reveal.js` and `src/village_workspace.js`.

## Constraints every lane carries

- Frozen files (another session's uncommitted work): `src/book_world_lotm_{cast_host,host,state}.js`, `src/workspace_layout.js`, `src/panel_reveal.js`, `src/village_workspace.js`, `tests/cast_*`, `tests/facts_frame.test.js`, `tests/place_acts.test.js`, `src/person_memory_*`. Do not edit them.
- Structural rounds change no gameplay and no save shape (AD45, FND3); name the change surface (FND2).
- Lanes run their focused tests (AD36 lean-test default); no `dist/` build; no commits. The coordinator reviews diffs, runs the full suite once on a clean tree, and commits each lane's own paths.
- No windows on Weibao's screen by default: hidden Electron or headless runs.
- Proposed rules (UR76-UR82) may guide design, cited as proposed.

## Budget

Shared weekly pool with the proposed [sonnet wave](../sonnet-wave-2026-10-30/PLAN.md) (not launched). At most 3 lanes at once from this wave. Stop launching at weekly 60%.

| Time | Event | Weekly | 5-hour |
| --- | --- | --- | --- |
| 10-29 23:05 | Plan written; R1-R3 launching | 38% | 33% |
| 10-30 00:05 | R1-R5 returned and integrated on `80e5b3c97`: full npm test 4111/4116 (the 3 failures also fail on bare master: lane patch file and private roots), check:arch and check:rules PASS (5 warnings from R4's new check) | 39% | 41% |

Results: R1 seat seam `src/observer_view.js` (4 sites migrated, ratchet tests); R2 `src/ui/scene_card.js` drawing the Village encounter cards; R3 `src/ui/figure.js` with the figure gallery (`npm run build:figures`, evidence PNGs here); R4 SUI, RPT, CLR and CX moved to standing rulebooks with stubs; R5 `scripts/adopt_candidate.mjs` (first load: PLAY screen about 2.3 s, workspace 0.14 s after PLAY, bundle 7.8 MB, about 8,900 DOM nodes). Browser floor for R2 in the live game is still owed.
