# D1 desktop UI overhaul, 2026-10-25

Status: in progress, branch proposals pending Weibao's play/visual acceptance.
Branch: `codex/ui-detail-2026-10-25`; starting master `3dfc49cf3`.
Owner: this worktree; runtime integration remains with the coordinator. No push or master edits.

## Outcome and authority

1920×1080 and 1440×900 desktop: polish and absorb fitting source ideas across every panel, including Mistglass, workshop, household/manor, combat, continuation and log. Mobile layout is deferred. Existing shared tokens, component ownership, saved appearance choices, full-height log and center controller remain authoritative. Scope follows Weibao's later overhaul addition, not the earlier polish-only reading.

Rules: UR1–UR69 (especially UR6–UR17, UR33, UR40–UR49, UR59–UR68), AD32/34/36/40/41, AR1–AR16. Presentation seam: shared `ui_components.js`, panel-owned renderers and `styles/ui_tokens.css`; no new gameplay state/timer/save authority.

## Audit ownership

Four Luna-medium read-only agents audit disjoint areas: shell/You/inventory/log/settings; Mistglass/workshop; household/manor/ancillary panels; combat/continuation/entry. Browser sessions serialized (M3), rebuilt worktree served on 127.0.0.1:5101 (M2). Each returns ranked defects, selectors, source anchors and before screenshots at both targets. Parent owns implementation and synthesis.

## Overlap M4

Primary checkout is dirty and remains untouched. Cultivation audit reports primary edits in `src/absorb_p23/host_joins/world_adaptation.js`, `src/absorb_p23/host_joins/world_adaptation_ui.js`, `src/absorb_p23/world_adaptation/techniques.js`, `src/gear_workshop_domain.js`, `src/gear_workshop_panel.js`, `src/main.js`. Any UI changes here happen on this branch and require coordinator reconciliation. Check each additional path before editing.

## Checks

- `npm run build`: PASS on starting branch, rebuilt bundle for audit. Generated dist and HTML version stamps are excluded from commits (M1).
- `python3 -m http.server 5101 --bind 127.0.0.1`: running, local-only, exec session 32990; sandbox bind restriction resolved through reviewed escalation.
- `node --test tests/ui_components.test.js`: reproduced disabled-reason decorator overwriting the existing cost/subject description (FAIL before fix).
- `node --test tests/ui_components.test.js tests/ui_contract.test.js`: PASS 4 checks after decorator fix, before final presentation work. Browser verification pending.

## Changes

- D1-C1 (UR7, UR17, AR3): disabled reasons preserve existing `aria-describedby` IDs, follow controls moved by modular panels and retire orphan notes. One shared note identity across nested decorators; no gameplay mutation. Regression covers disabled/enabled transitions, moved and removed buttons, existing subject descriptions and borrowed panels.

## Before/after index

Pending audit captures under `evidence/before/`; final paired captures will live under `evidence/after/`. No visual behavior claims yet.

## Source absorption and remaining gates

Pending ranked audit synthesis. Sources: committed Discord sweep rounds 1–2 (`640bc884b`), itch.io research, live UI design owner and incomplete prior UI audits. Existing UM3/4/5/8/9 delivery is baseline, not new work. Each selected idea will record fit and built/skipped outcome here.

Final gates: merge current master into branch; focused UI checks; rebuilt paired browser evidence; build; architecture; rules; one full npm test. Human play/visual acceptance remains open even after technical gates.
