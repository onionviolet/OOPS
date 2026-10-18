# UI triage and Village apothecary (queued Codex lanes)

Authorized by Weibao, 2026-10-15: "Q7, Q8, Q9: yes. Record them and queue the triage and apothecary work after the foundation lane's slices." Owner: `docs/UI_SURFACE_TYPES_AND_DRAWING_BOARD_2026-10-15.md` (ST1–ST9 surface types, TR1–TR4 triage, AP1–AP5 apothecary).

Three lanes run **one after the other** in the shared working tree, after the UI foundation lane (`docs/gm/dispatch/ui-foundation-2026-10-15/`): NAV, then TRIAGE, then APOTHECARY. Each lane's own brief is `NAV.md`, `TRIAGE.md` or `APOTHECARY.md` in this folder.

## Precondition (check first, every lane)

Read `docs/gm/dispatch/ui-foundation-2026-10-15/REPORT.md` and `CHECKPOINT.md`. Proceed only if S3 is reported complete. If the foundation lane stopped earlier or is blocked, write `runs/<lane>.BLOCKED.md` explaining what is missing and stop without editing source. TRIAGE also requires `NAV_REPORT.md`; APOTHECARY also requires `TRIAGE_REPORT.md`.

## Ground rules

- `AGENTS.md`, `PROJECT.md` standing priorities, the UI owner gates and the foundation lane's `COMMON.md` ground rules all apply: shared tree on `codex/gameplay-foundations`, **no commits or pushes**, preserve unrelated dirty edits, re-read shared files before each hunk, no `pkill -f`, check `ps` for other writers before rebuilding.
- Use the foundation lane's tokens, components, center-mode controller, focus panel, scene panel and Projects drawer. Do not create parallel versions; the UI contract test must keep passing and its allowlist must not grow.
- **Saves:** no gameplay deleted, no internal ids renamed, existing saves, layouts, pins and collapse states load unchanged. Any schema change needs a written compatibility decision.
- Target 1366×768, also 1440×900 and 1920×1080. Disposable browser contexts, synthetic fixtures, no personal saves. Sealed secrets stay sealed.
- Write a `CHECKPOINT` section in your report after each step. Technical proof only; Weibao's visual-feel acceptance stays open.

## UI rules (2026-10-15)

Follow `docs/UI_RULES.md` (UR1–UR20). In particular UR14: each slice report includes a 1366×768 screenshot on a populated save, checked for whether a first-time player can name the way back, current work and main actions.

## Navigation and scroll rules added (2026-10-15)

`docs/UI_RULES.md` gained UR21–UR33: nav strip with a direct path and hotkey to every large panel, a back history that names the real previous view, restored scroll and selection on return, expandable panels, a scroll budget at 1366×768 (no page scroll in ordinary play, one scroll owner per region), summary lines on collapsed groups, quick jump, notices that link to their panel, one panel header layout. Current assignment: NAV extends the foundation's shared layers after S3, following `NAV.md`; leave quick jump (UR28) for later unless it falls out cheaply. Triage applies UR25/UR26 when rehoming. Report scroll measurements per UR14. Earlier same-day wording assigned these additions to foundation S1/S2; that assignment is superseded because those slices had already closed.

Proto23 is the visual/composition baseline, not only a palette and corner style.
Read [the latest foundation clarification](../../../UI_FOUNDATION_DESIGN_ROUND_2026-10-15.md#proto23-baseline-clarification-2026-10-15)
and UR12. NAV owns the queued shared-layer adjustment; downstream lanes consume
it. The active foundation writer has not been confirmed to have read this later
clarification, so recover its actual output before proceeding.
