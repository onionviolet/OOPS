# Reach fixes A1–A9, 2026-10-14

Implemented as reversible proposals on `absorb-all/reach-fixes`, base
`78e3c70a`. A10 was excluded and remains owned by sim-stepper. No options,
acquisition gates, XP rates, costs, rewards or save formats were removed or
rebalanced. Standing desktop/laptop direction and staged discovery remain in
force; no accepted product direction changed.

Target: **1366×768**. Visible outcome: ordinary panel titles open their
contents, combat restores vitals, and current work exposes its known next
step, inputs or return route. Mobile optimization and acquisition/balance
retuning are deferred. Input authority is
[natural-play audit](natural-play.md); this report records proposal execution,
not director acceptance.

## Row decisions

| Audit item | Decision and owner | Primary commit |
|---|---|---|
| A1 | Adopted: visible panel titles toggle by click, Enter and Space in play. Edit layout remains separate; critical panels remain open. `src/workspace_layout.js`, `styles/workspace.css`. | `9a07b3a4` |
| A2 | Adopted: on combat entry, scroll the current vital panel into view once. Other panels and subsequent deliberate scrolling remain intact. `src/workspace_layout.js`. | `54dc0ca3` |
| A3 | Adopted: visible candidate actions show control progress, treatment prerequisite and carried fixed-input shortage. Fixed player input quotes remain visible on refusal; NPC reserves, predicate IDs and outcomes stay excluded. Existing location admission remains authoritative. `src/structured_reachability.js`, `src/structured_pack_runtime.js`. | `2c7259e3`, `cffb81b4`, `4bfc484d`, `105b3b02` |
| A4 | Adopted: first disabled parcel row and Quest objective name the Cave-room/report-back requirement; objective drops it when mill access is actually open. `src/absorb_c2/local_life.js`, `src/expansion_quest_ui.js`, one host binding in `src/main.js`. | `934919f5` |
| A5 | Adopted: commission acceptance/refusal, log purchase, work and reward lead; later learning, assistance, irrigation and optional actions remain in an expandable group. Existing observed records follow the controls. Current command reasons appear beside controls. `src/systems_workshop_ui.js`. | `dcc38009` |
| A6 | Adopted: an enabled Run preference can be turned off below two stamina. Enabling still needs stamina, and actual travel retains walking fallback. Save/activity safety gates remain. `src/main.js`, `src/reveal_chain.js`. | `74d54a2d`, host admission test in `105b3b02` |
| A7 | Adopted: a due patrol loan puts an explicit blocker and Open Patrol & custody button beside native local work. Returning the kit removes it immediately. `src/village_career_ui.js`. | `62585e2d`, `711f38a3` |
| A8 | Adopted: earned pre-level Perception XP shows the actual first threshold and known local practice routes. Only currently held Golmoon leaves expose the 20-leaf learning clue. Unknown action/recipe names and gathering locations are not revealed. `src/reveal_chain.js`, small read binding in `src/main.js`. | `bcbee288` |
| A9 | Adopted: opt-in, dismissible session bread reminder stays outside collapsed Local life and updates from the ordinary calendar. It grants nothing, skips no time and queues no reward. `src/absorb_c2/panel.js`. | `dba16535` |
| A10 | Skipped by assignment. | sim-stepper |

## Checks

- `npm run build`: PASS, Ink artifact check zero diagnostics. Tested bundle
  SHA-256: `2bef530f372c4ee66949451db9db7d7fc2a085b13179f3bcb572a21f630be34a`.
- Focused A3: structured hint/runtime/ability/expedition slice **35/35 PASS**.
  A4 and A9: Local life **10/10 PASS** each (overlapping slice).
  A5: workshop **14/14 PASS**.
  A6: reveal plus actual host Run admission **7/7 PASS**.
  A7: career **5/5 PASS**.
  A8: reveal **6/6 PASS**. A1/A2 focused checks are their native browser groups.
- Final `npm test`: **1,440 tests; 1,437 pass, 0 fail, 3 existing TODOs**.
  Initial run found one outdated expectation that refused actions quote no
  inputs; it was updated for A3 while preserving NPC/privacy assertions.
  No pre-existing failure is claimed.
- [browser.cjs](../checks/reach-fixes/browser.cjs): **A1–A9 PASS**, fresh isolated
  context at 1366×768, **zero page errors**. A1 exercises title click/keyboard
  on rebuilt native play. A2 earns the elder route, enters a real field fight
  and checks the vitals rectangle after deliberately scrolling its dock.
  A3–A9 exercise real UI modules with controlled read projections; A7 uses
  the existing career return transaction, and A5 enrolls/joins the existing
  simulation in an isolated projection. These are explicit UI/regression
  fixtures, not natural acquisition or save-import evidence.
- Screenshots A1–A9 and [results.json](../checks/reach-fixes/results.json) are
  adjacent to the script. Screenshots were visually reviewed, including
  native combat vitals and the controlled next-step/return/reminder surfaces.
  The first A7 browser check caught delayed shortcut removal; the immediate
  refresh fix is included and its final check passes.
- Generated `dist/` and index build stamps are not committed.

Compatibility decision: no new game-save field or schema. Existing Run,
local-life, career and simulation owners retain their state/transactions.
Layout activation writes the existing browser layout format; the food reminder
is session-only. No migration or new export/import gate is needed for this
presentation-only change, and no save/reload/import success is claimed here.

## Limits, merge risks and acceptance

A1/A2 have fresh native gameplay evidence. A3–A9 have passing source and
controlled browser evidence; their complete natural acquisition journeys are
**implemented-unverified in this lane**. This does not close the audit's
Investigate/herb/relay/Town/Fort pacing gates or the unplayed candidate branches.
No private candidate content or hidden result is included in fixtures or report.

P00 overlap is limited to small mechanical edits in `src/main.js`,
`src/workspace_layout.js` and `styles/workspace.css`. Preserve P00's newer
host/world/panel bindings while retaining these local changes. The candidate
projection changes live outside the host join files. Other lanes may need to
reconcile workshop, Local life or career UI additions; no state ownership moves
or foreign whole-file replacement occurred.

The coordinator owns integration, FINAL_GATE rerun, merge and push. This lane
does not merge or push. The remaining proposal acceptance gate is **Weibao's
play/taste** at the desktop target; broader natural-play evidence remains
separate as listed above.
