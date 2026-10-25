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
- D1-C2 (UR6/7/14/41/59–63/65–68, AR3/8/11): shared section/visible-label/quoted-action components feed the workshop and Mistglass. Workshop has numbered choose/plan/review steps, an honest empty selection, visible control labels and grouped unavailable work. Mistglass separates visit, reserve, method practice, purification stakes, sluice, path work and history; existing `meter_bar` shows only owner-provided reserve and method progress. No new rates, rewards, roll, clock or eligibility authority. Browser/visual verification pending.
- `node --test tests/ui_components.test.js tests/ui_contract.test.js tests/home_household.test.js tests/gear_workshop.test.js tests/continuation_state.test.js`: PASS 35 on D1-C2 source with in-progress household/continuation changes; geometry not covered.
- `node --test tests/ui_components.test.js`: PASS 2 after adding grouped-action eligibility/accessibility regression.

## Source absorption ledger (proposals)

| ID | Source / fit | Built or skipped |
| --- | --- | --- |
| D1-S1 | Discord sweep F1/S1 and P1: method-owned practice milestones fit Mistglass's existing 16/48-minute stages | Built a progress track from the existing read model, current method heading and disclosed stage/rate comparison. No new realm system. |
| D1-S2 | Discord sweep F2/S2/S3: shared framed title/description/effect grammar fits independent workshop and cultivation panels | Built shared sections and action groups, nearby costs/reasons and labeled work steps. Existing subject inspection stays with its owner. |
| D1-S3 | Discord sweep F6/P2: show independently deciding quantities | Built reserve pool plus practice track in Mistglass, using existing meter semantics. A trial with only remaining time remains text; no invented second process variable. |
| D1-S4 | Discord sweep F4/F5: introduced fields and readable text navigation | Preserve discovery and opt-in gates, label the current method and entry sequence. No pre-discovery character fields or hidden-truth dump. |
| D1-S5 | Discord sweep P3–P5/P6–P10: food harm, rounding economics, rest overlap, activity mechanisms, ecology, policy automation and auto-breakthrough are gameplay proposals | Skipped gameplay changes in this UI lane. Existing quotes/time/learning owners remain authoritative. |

## Before/after index

Pending audit captures under `evidence/before/`; final paired captures will live under `evidence/after/`. No visual behavior claims yet.

## Source absorption and remaining gates

Pending ranked audit synthesis. Sources: committed Discord sweep rounds 1–2 (`640bc884b`), itch.io research, live UI design owner and incomplete prior UI audits. Existing UM3/4/5/8/9 delivery is baseline, not new work. Each selected idea will record fit and built/skipped outcome here.

Final gates: merge current master into branch; focused UI checks; rebuilt paired browser evidence; build; architecture; rules; one full npm test. Human play/visual acceptance remains open even after technical gates.
