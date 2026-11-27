# First persistent reader-to-game trial: charm materials

## Preflight

| Field | Scope |
| --- | --- |
| Request | Consume persistent handoff `221e0889c81cd9655cfd425fb1688bd1d853032c8d1e1e4e2ea5a5ba6af05715`: a normal office-material route beside personal purchase, with a real material consumer and persisted payer/stock. |
| Authority | The current instruction to implement this bounded trial; AD6, AD36, AD38, AD43, AD49; AR3, AR7, AR10, AR14; MR10, MR13, MR25–MR27, MR32; WPR5/19–21. [Architecture owner](../../../ARCHITECTURE_RULES.md). The handoff is a proposal, not a new product authority. |
| Source identity | The selected canonical `lotm1c127` rules file matches packet SHA-256 `58be2cd31181f852298abd86922e7ee151ede9fa87e704cbb4fbc830741e60fc`. File line 8 is `lotm.institution.material-quota`, locator `zh 第127章 p32`. This identity check passed before implementation. |
| Source scope | Fresh held-source validation by the reading lane: ch127 p32 says this month's practice-material allocation is exhausted; p33–35 support personal purchasing and concern about wasting material. Ch128 p69 is an intention to seek internal materials or exchanges; p70 shows a mixed basket bought for one pound fifteen soli. These supply neither a per-packet price nor an approval/refill procedure. |
| Default and dial | A separate local extra requisition after the existing workshop commission. Configurable capacity defaults to one packet for this local request. Request approval takes five minutes; collection takes five minutes and exchanges the actual signed order for one existing blank and ritual packet, without a purse debit. These are authored defaults, not a monthly quota reset or universal entitlement. |
| Player sentence | “Reception signs a local material order for your Slumber practice.” Depletion says “This local practice request has no material credit left. You can still order supplies with your own money.” Existing workshop voice sample: “The runner brings the rectangular silver and the ritual supplies.” PRS4/6–7. |
| Fit and ring | Existing typed act registry, native inventory and completed-command counters. New leaf `src/lotm_charm_materials.js`; existing material keys feed the current Slumber inscription and held-item use. Source, offer, failure, material consumer, UI and persistence are in this slice; Fang's office messages are untouched. |
| Screen and failure | Native Tingen Here/Notebook at 1920×1080, with a named fixture providing an eligible workshop history and two known places. A normal action obtains the signature; tickets are not seeded. Collection without a signed order and exhausted office credit must explain the blocker while personal ordering remains possible. Mobile is deferred. |

## Scope boundaries

The current exhausted monthly allocation is not replenished by this action. This is an authored extra local approval, a possibility consistent with Klein's later intention to seek internal materials, rather than a claim that the source demonstrates an office issue. The exact source quantity, period refill mechanism, approval policy, location, fee and packet contents remain unqualified. The implementation's capacity is a local configuration dial, not a source-derived number.

The ordinary supplier order retains its existing one-blank/one-packet, eight-soli and thirty-five-minute defaults. Ch128's one-pound-fifteen-soli total is a mixed basket and does not validate that packet price. This trial identifies the latest acquisition's payer; it does not simulate an office cash account or per-item funding provenance after stacks combine. The existing native purse does not acquire a new earmarked-commission balance from this trial.

## Receipt

Native gameplay acceptance passed on the named fixture. Runtime consumer for handback: `src/lotm_charm_materials.js`. Implementation receipt: `docs/gm/dispatch/procedural-crafting-2026-11-11/LOTM_CHARM_MATERIAL_HANDOFF_2026-11-25.md`.

| Check | Result and limits |
| --- | --- |
| FLR1 · Build | Fresh main-bundle esbuild input, SHA-256 `6f67513266a4b52f3ed99036aa745e1c59ccab82adabb3674291884deecb568d`. The shared coordinator owns the release build/architecture/rules/full-suite gate. |
| FLR2 · Route | `tests/lotm_charm_materials_browser.mjs`, fresh origin, 1920×1080, named eligible-maker fixture. Setup supplies the pre-existing workshop history and two known places, with no ticket or material stock. A normal approval action creates the signed order; a normal office collection spends it. The player walks to the workshop for inscription. |
| FLR3 · Shown | Collection without a signature explains its blocker. Approval and collection each show five minutes and no personal money charge. The depleted local-credit offer explains that personal supply ordering remains available. Notebook distinguishes office-funded and personally purchased materials. Both captures were visually inspected. |
| FLR4 · Used | Office collection gives one native silver blank and ritual packet at zero purse debit. Existing inscription consumes them and creates a usable Slumber charm. The unchanged personal order later debits 96 pence and gives the same usable material keys; inscription consumes those too, and the existing throw burns one of the two completed charms. |
| FLR5 · Kept | Save/reload/Export/literal Import ran after both office and personal acquisitions. The two payer states, remaining materials, signed-order count and completed-approval count survived. Imported depletion does not create another ticket or allow another issue. |
| FLR6 · Labelled | Agent-verified, not human-reviewed, on a named synthetic native fixture. This is an authored extra local request, not proof of a canonical approval ceremony or an earned Klein replay. |
| Focused checks | `node --test tests/lotm_charm_materials.test.js tests/lotm_charm_upkeep.test.js`: 8/8 passed. The material tests prove real order consumption, shared consumer material keys, payer distinction, preserved purchase price/delay and an adjustable local capacity. |
| Browser | `node tests/lotm_charm_materials_browser.mjs` passed with zero page errors and zero horizontal overflow. On this Windows host, `YAIRPG_PLAYWRIGHT` points to the installed Codex runtime package. [Machine proof](../../../representations/evidence/lotm-charm-materials-2026-11-25/proof.json), [depleted local request](../../../representations/evidence/lotm-charm-materials-2026-11-25/exhausted-office.png), [payer Notebook](../../../representations/evidence/lotm-charm-materials-2026-11-25/payer-notebook.png). |
| Runtime seams | New leaf module, an existing typed-act registry addition and fact projection, the existing native item registry through the silver item list, and an acquisition-payer/report addition to the personal order. No new persistence slice, office-message command or recurring-duty owner. |
| Remaining scope | The source's exhausted monthly quota stays exhausted conceptually; this prototype grants an explicitly extra local approval under its authored capacity. Neither automatic refill nor an office cash account is modeled. Earmarked commission cash, per-item payer tracing across combined stacks, other charm types and earned-life replay remain unverified here. |

Player route for handback: in Klein's Tingen life, finish the workshop's amulet commission, visit Blackthorn reception, request the local Slumber practice packet, then collect against its signed order. Walk to the silver workshop and use the existing inscription. When local credit is depleted, order supplies with personal money through the existing supplier action.

Final state: the native browser command exited 0 after writing the proof; `node --check tests/lotm_charm_materials_browser.mjs` and scoped `git diff --check` passed. Its browser/server, generated bundle and synthetic export directory were removed. The separate prior upkeep cleanup limitation remains in that task's receipt. These receipt bytes and the consumer file are ready for the Workbench's implementation-report fingerprinting; this document does not itself submit or promote the immutable proposal.
