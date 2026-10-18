# B3 report: knowledge versus truth inspector

2026-10-14. Documentation complete, proposals only. No runtime slice selected
or implemented. All writes are under `docs/gm/dispatch/research-tech-2026-10-14/b3/`.
[CHECKPOINT](CHECKPOINT.md) was created first; this report was created last.

## Findings and deliverables

| Code | Finding / result | Evidence or owner |
|---|---|---|
| B3F1-B3F4 | There is a mutating dev console and combat simulation window, but no audited dedicated knowledge inspector or compile-time exclusion gate. URL dev detection controls a separate existing save route. | [DESIGN source audit](DESIGN.md#current-source-audit); `build.js:23-34`, `src/config.js:5`, `src/main.js:5085-5089,8120-8138,8164-8192,8219-8241,8800-8802` |
| B3F5-B3F8 | Status-window cards have a real held/awake reader; RC1/RC2 readers do not exist. Panel-kit registration participates in stored workspace/display state. | `src/cheat_cards.js:89-104`, `src/status_window.js:28-54`, `src/panel_kit.js:6-16`, `src/workspace_layout.js:33-43`; T14 L75/L76 |
| B3F9-B3F11 | Scalar actor/world facts and legacy three-stage knowledge exist. IM2 is absent, and native skill getters initialize missing records. | `src/expansion_engine.js:75-95`, `src/simulation_effects.js:282-285`, `src/components/levelable_component.js:99-107`; technology owner IM2/CN10 |
| B3F12-B3F16 | UI craft receipt is session-only; Work Ledger has retained craft receipts. Other typed/planner receipts do not supply general IM2 evidence. Serializer refresh would be a poor read-only snapshot source. | `src/display.js:361-363,3228-3237`, `src/work_ledger_system.js:130-142`, `src/main.js:5353-5370` |
| B3D1-B3D4 / B3G1 | Designed an existing-state Phase A, explicit unavailable comparisons, compile-time dev opt-in, detached immutable reads, closure-only controls and sealed subject filtering; future pure RC readers share comparison logic without granting cards. | [DESIGN](DESIGN.md) |
| B3A1-B3A2 / B3G2-B3G3 / B3S1 | Prepared code/test file scope, live ownership recovery, normal/dev artifact checks, 1366x768 browser gates, Save/reload/literal Import proof and stop conditions. | [BUILD_PROMPT](BUILD_PROMPT.md) |

Round 9 OM/IM/RC1/RC2, round 11 CN10 and folded T13/T14 were read and reconciled.
T13's older report says T14/T16 were unfinished/unmerged; later technology
owner results and current pure planner files supersede that snapshot.
T13's status-window reuse and T14's new `research-roadmap` panel option remain
proposals. Neither is needed to implement this dev reader. Valid card metadata
still does not implement comparison logic or authorize card installation.

## Ranked proposals

1. **B3P1:** Build Phase A when selected: current facts, recorded skills, cheat
   state and accurately labelled craft receipts. It has no IM2 dependency.
2. **B3P2:** Use a separate compile-time flag and inline dev region with zero
   storage. Require actual normal-artifact exclusion, not hidden runtime UI.
3. **B3P3:** When IM2 and qualified truth/graph readers land, add paired comparison
   through a small pure module shared with future RC1/RC2 presenters. Preserve
   per-card scope, unknown results and no automatic knowledge/mastery grants.

## Open questions and limits

| Gate / question | Status |
|---|---|
| First-slice code selection and exclusive host ownership | Not selected by this docs lane; recover at future dispatch. No blocker to delivering the proposal. |
| Actual public/discovery classification for each added field | Existing safe subjects can be curated at code time. Unknown/sealed subjects fail closed; no blanket dev unsealing. |
| IM2 schema/receipt join and qualified truth context | OPEN, owned by a later selected research slice. No schema reserved or implemented here. |
| RC gameplay form, routing and acquisition | OPEN, outside inspector scope. No validator panel change or card granted. |
| Rebuilt dev/normal behavior, persistence and human UI acceptance | Specified-not-run. Target is desktop/laptop 1366x768; mobile deferred. |

Executed checks: live direction/source reads; branch/dirty/process inventory;
file:line audit; source fingerprints; local-link, source-range, fence, whitespace
and style validation. Final check: four files, nine local links, 38 unique source
ranges, zero errors; scoped git diff --check passes. Ten recorded source hashes
were rechecked with no drift despite another worker advancing HEAD. No tests,
builds, server starts, browser journeys, save reads/changes,
card grants, staging, commits, push, publishing or external messages.
Existing active workers and unrelated dirty files were left untouched.

Summary: the current-state inspector is build-ready as a bounded proposal.
Full CN10 beliefs-versus-truth behavior remains OPEN until IM2 exists.
