# C1 LOTM Q4 clearance, 2026-10-25

Authority: Weibao's C1 dispatch. Previous slice Q3 passed its rebuilt two-profile persistence gate before these edits. Branch `codex/lotm-q3-2026-10-25`; master merge `ba40dcc9d` includes `9b997ea60`. No primary checkout/master writes or push.

Rules: AR1–AR16 ([architecture](../../../ARCHITECTURE_RULES.md)), WA13, AD38, SR1–SR24 for place, world, custody and aftermath, UR1–UR69 ([UI](../../../UI_RULES.md)). Queue [Q4](../lotm-lives-regions-2026-10-23/QUEUE.md). Source: institutions owner F1/F4/F7/EF6, already qualified in `book_world_lotm_clearance.js`. Roles and item counts remain proposals.

## F1: reconciliation and change

The baseline already implements Q4's shared `src/clearance.js` leaf, LOTM grade rows, role projection, request/return commands, native transfers and sealed-item save checks. Reuse those owners. Grade 2 requires captain or bishop; grade 3 requires formal-member clearance and three qualified people including the requester. There is a local grade-3 custody journey; grade 2 is a rule-table test, with no invented grade-2 stock or promotion command.

The gap: a participant at the same location string counted without checking their actor's world. `book_world_lotm_actions.js` now counts living, able, co-located role holders in the same world. A focused regression previews a valid group, then changes world/life/place before execution and checks refusal with no stock/state mutation. Existing second-world clearance fixture proves the shared leaf. No shared seam or save field added; existing command definitions stay byte-identical. Old saves gain no people, items or roles on load.

Presentation: existing place-service panel in the shared workspace, desktop 1920×1080. Visible outcome: probationer blocked, formal member with a real group permitted, custody signed out and returned, with grade reasons and records. Mobile, layout redesign, new team scheduling and higher-grade inventory deferred.

## Verification

Input: `99d3a202` plus actions world check and clearance regression. Checks/results follow below. Full `npm test` reserved for the final Q5 tree.

- `node --test tests/lotm_clearance.test.js`: PASS, 6/6; includes second-world shared-leaf fixture and stale group refusal without mutation.
- `npm run build`: PASS; bundle SHA-256 `98caed52ac40fb2c031214cf26ae40506b4434dddd9a0cebd77307fcda0749e1`.
- `npm run check:arch`: PASS; no new cycles or composition-root growth.
- `npm run check:rules`: PASS, 0 warnings.
- `node docs/gm/dispatch/lotm-q4-2026-10-25/checks/clearance.cjs`: PASS, fresh origin and 1920×1080. Probationer denied; formal member plus captain/member allowed; grade 2 still denied; sign out, Save/reload/Export, return, literal Import restores the signed-out item, then return. Exact inventory, purse, knowledge, facts, resources and place comparisons; no page errors. [Receipt](evidence/result.json), [blocked](evidence/probationer-blocked.png), [imported](evidence/signed-out-imported.png). Screenshot inspected; clearance and held-item status legible, log column retained, panel scroll/back bar available. Optional private fonts absent, fallback used.
- `git diff --check` on owned Q4 paths: PASS.

Q4 playable integration gate complete before Q5 source edits. Grade-2 issuance and human taste/pacing are not exercised; normal-app adoption and master integration remain open. No new rulebook or accepted direction; all values remain proposals. No push.


## Content reconciliation B471: complete current record and later evidence routing

The complete26-line checkpoint was reviewed. It records a reused shared clearance leaf and a concrete stale-participant bug: matching location text did not establish the same actor world. The added world/life/place refusal regression and recorded grade3 sign-out/return/import journey support their exact inputs. Grade2 is rule-table coverage with no invented stock/promotion, not a played issuance route. Public reasons, group eligibility, custody, actual transfers and earned/fixture scope retain separate evidence. The second-world shared-leaf fixture does not prove a whole second source world or its institutions.

Six focused checks, the fresh1920 build/browser/persistence journey and unrun final Q5 full suite are separate. Byte-identical command definitions and unchanged save fields mean no new people/items/roles were awarded on load in that slice; this review does not certify every current old save or later role/clearance edit. Current [PROJECT](../../../../PROJECT.md), [architecture rules](../../../ARCHITECTURE_RULES.md), AD36/AD43 and AD42 optional review govern selection. Historical branch/merge/owner, pre-Q5 completion, normal-app adoption and no-push claims remain dated. No code, rule table, image, JSON, seal truth, private/personal save, native journey or test/build was newly exercised.
