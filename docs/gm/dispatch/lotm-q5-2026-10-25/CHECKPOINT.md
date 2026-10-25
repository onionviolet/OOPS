# C1 LOTM Q5 broker trade, 2026-10-25

Authority: Weibao's C1 dispatch, after Q4 completed and committed as `b7769821`. Branch `codex/lotm-q3-2026-10-25`; master `9b997ea60` merged as `ba40dcc9d`. Primary checkout/master read only; no push.

Rules: AR1–AR16 ([architecture](../../../ARCHITECTURE_RULES.md)), WA13, AD38, SR1–SR24 for world/place/custody/persistence, ECR4/9/15/16/23, UR1–UR69 ([UI](../../../UI_RULES.md)). Queue [Q5](../lotm-lives-regions-2026-10-23/QUEUE.md). Existing source owner: institutions F10/F13–F15/EF4/EF5. Values, fees and lots are proposals.

## F1: existing owners and gaps

The baseline already has fixed posted lots, pay/verify/settle/reject commands, money escrow on the broker actor, native item transfers, and persistent observations. Reuse simulation `previewSimulationCommand`/`commitSimulationCommand` for executable quotes, the existing transfer/acquisition custody owner, native money publication and save envelope. No second transaction owner or new shared typed seam is needed for fixed one-for-one offers. Numeric valuation is LOTM data; `brokerQuote` reads those rows and the command factory refuses unequal posted barter. This is a fixed offer, not arbitrary basket negotiation or a truth appraisal.

Previously payment could debit the player even without the offered item in the broker's stock; appraisal could also charge for missing stock. Both immediate quotes now require current broker custody, revalidated on commit. Broker presence also checks world identity. Open-trade envelopes require the actual lot with the broker; state validation requires exactly one verdict after verification and no orphan verdict. Valid historical saves are read without backfill; already-invalid missing-stock escrow is refused for save integrity. `state.lotm` remains schema 1; no save field added.

The existing observer-safe read model now includes held money, posted barter values and known trade statuses. The UI shows these in the existing Tingen place-service panel rather than relying on the six-entry general notebook. Unknown verdicts stay hidden until appraisal. Settlement pays an offscreen seller and commission as the existing declared money sink, with the existing persistent settlement record; barter consideration stays with the broker on the seller's behalf. No new NPC purse simulation.

## D1: command compatibility

Only the 18 immediate `lot_pay_*` / `lot_verify_*` definitions gain a physical-stock requirement. Their golden hashes are deliberately updated in the existing command fixture. IDs, claims, costs, effects, results and timed commands stay unchanged. Existing completed trades and open trades with actual stock retain their states; no payment or result replays on load.

Presentation: existing place-service panel, shared workspace. Primary target 1920×1080, with 1536×864 at 14/21 px checked for the added content; mobile and layout redesign deferred. Visible outcome: pending escrow stays with broker, completion and failed-verification refund leave separate readable records, equal-valued barter remains independently appraised.

## Verification

Input: `b7769821` plus the Q5 broker/actions/envelope/host/UI, broker regressions and deliberate golden updates. Checks/results follow below. Full suite runs once on this final behavior tree.

- `node --test tests/lotm_broker.test.js tests/lotm_commands_golden.test.js tests/lotm_lives_compat.test.js`: PASS, 12/12; physical-stock revalidation, equal-value refusal, no orphan/conflicting verdicts, known records and compatibility.
- `npm run build`: PASS; browser bundle SHA-256 `2348a9de009fd5ddbc43ca8f652f4c47886ce56e09cc779eca5f66496716c0ba`.
- `npm run check:arch`: PASS; no new cycles or composition-root growth.
- `npm run check:rules`: PASS, 0 warnings.
- `node docs/gm/dispatch/lotm-q5-2026-10-25/checks/broker.cjs`: PASS; fresh civil entry, native walk, pending money escrow, completed trade, failed-verification refund and equal-valued barter. Three Save/reload/Export/perturb/literal Import checkpoints: pending money, pending barter and closed trades. Exact inventory, purse, knowledge, facts, resources and place comparisons; 1200 → 1128 pence; no page errors. [Receipt](evidence/result.json), [pending custody](evidence/pending-imported.png), [desktop](evidence/closed-1920x1080-14px.png), [large-text floor](evidence/closed-1536x864-21px.png). 1920×1080 and 1536×864 at 14/21 px, plus 1800×1040 at 14 px: no page or trade-record horizontal overflow; reports column and back bar retained. Screenshots inspected. Private fonts absent; fallback used.
- `git diff --check` on owned Q5 source/test/doc paths: PASS.

Q5 playable gate complete. No unverified selected gameplay; human taste/pacing and normal-app adoption remain open. Full combined suite and merge-readiness receipt follow after the Q5 commit, as directed for the final branch tree. Source-driven rebuilding is required for integration; generated bundle/map/index remain outside this lane's commit scope.
