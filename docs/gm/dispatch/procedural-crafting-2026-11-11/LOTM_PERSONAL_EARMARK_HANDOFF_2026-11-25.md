# Personal commission intention beside a material purchase

Status: agent-verified in a named prerequisite fixture, not human-reviewed. This record concerns Workbench proposal `977a42730945b0ba79250e106e71c8f2c0518411248ee9067218820fc86d7715`; the prior material-allowance receipt is unchanged.

| Preflight | This slice |
|---|---|
| Reading and authority | Implement the current reader handoff under the coordinator's delegated scope: show total purse, intended commission remainder and shopping money, preserving the option to revise or spend into the intention. AD5, AD38; the source and authored defaults remain separate. |
| Player sentence | “The money stays in your purse. You can change your intention or spend into it; the unpaid commission does not settle itself.” Failure: the existing purchase reports its actual missing purse, workshop or other prerequisites. |
| Ordinary route | Begin the existing Klein workshop route; enter an intended remainder; inspect the existing supplies quote; revise or purchase. An intention larger than cash is visible as a shortfall, with no separate financial prohibition. |
| Mechanism and fit | The native economy keeps its single purse. One saved actor fact records the player's intention. The quote reads the existing registered purchase cost and offer readiness. Existing native costs, inventory, job persistence and inscription settle the actual purchase and use. No new currency or stock owner. |
| Ring | Intention producer and revision; existing material purchase and inscription consumer; invalid input and ordinary missing-purse failure; save/reload/export/import; Tingen Here UI. |
| Rules and seam | AR3, AR6, AR14; AD36, AD43; MR25, MR32; ECC25/ECX6 as the handoff's references; PRS7 sample: “You paid for these materials yourself.” Host fact effect, domain callback, isolated Tingen child renderer. |
| Files | New `lotm_personal_earmark.js`, `ui/lotm_personal_shopping.js`, focused test/browser proof; narrow host/domain/Tingen UI hooks. Player UI agent retains ordinary Work & merit hunks. Fang's office message commands and prior quota receipt are outside this slice. |
| UI | 1920×1080 desktop first; a compact section in Tingen Here beside actual exchanges. Labelled numeric field, ordinary buttons and visible consequence prose. Mobile deferred. |
| Save compatibility | Existing actor facts scalar map, absent key means no intention. No second purse, no migration. Intention changes no native money or materials. |
| Failure and checks | Overspending into the intention must remain possible when the native purchase is otherwise eligible. Regression covers that, invalid amounts, legacy absence and read-only previews. Native proof covers the actual UI and saved material custody. |

## Source and defaults

The handoff cites `lotm1c128`, rules/rules row6, `lotm.rule.earmarked-commission-funds`, `zh 第128章 p41`, hash `25174469c0858b062e2f588914c29f05e82e033e4cbc20f030f8f8adbe841166`. The reading agent confirms p41/p71 distinguish an intended four-pound unpaid commission remainder from spending money. That supports a personal intention, not transferred custody or a mandatory spending lock. No current source-backed counterparty or contract registration was found; this implementation says “commission remainder” rather than inventing either.

The chapter's p70 larger mixed basket costs one pound fifteen soli. This slice uses the existing authored workshop packet, a silver blank plus ritual supplies together at eight soli and35 minutes, with no new universal basket or per-charm price. These authored quantities and local price remain adjustable in their existing craft owner. The four-pound shortcut is a source example, while the numeric field accepts a different nonnegative amount and clearing the intention. The scope default is Klein's current Tingen life; extending it to other seats belongs in their own context and reason.

## Verification receipt

- FLR1 Build: fresh native bundle `d8fd161dbe7773c6cf4722e43bb343366a2780fcfe3335fb2171abc664706689`, built by the browser runner from current source; temporary bundle removed after proof.
- FLR2 Route: `tests/lotm_personal_earmark_browser.mjs` boots a named eligible Klein workshop fixture with1000pence and no materials. Fixture supplies the workshop/Seer prerequisites; ordinary UI controls perform each intention change, supply purchase and later inscription. An earned incomplete commission and its counterparty are not claimed.
- FLR3 Shown: at1920×1080, cash1000, intention960 and available40 are visible; the96pence quote shows904remaining and56short. The player revises to900, inspects4available after the proposed purchase, returns to960 and deliberately buys using intended commission money. Final screenshots visually inspected; no page errors or horizontal page overflow.
- FLR4 Used: one actual silver blank and one ritual supply packet are purchased for96nativepence. The existing inscription consumes both and creates one Slumber charm after persistence checks. The original purchase route and all its prerequisites remain available.
- FLR5 Kept: actual Save, reload, Export and literal Import after purchase preserve cash904, intention960 and both material counts. Revision to800 preserves cash904 and shows104available, then survives another complete roundtrip. Clearing changes intention to0 without a payment. No extra material or charm appears after either roundtrip.
- FLR6 Labelled: agent-verified, not human-reviewed; synthetic prerequisite fixture, real native actions and persistence. The existing material-allowance receipt bytes are preserved. Real-source source row hash and ID matched the canonical selector before this receipt.
- Focused checks: `node --test tests/lotm_personal_earmark.test.js tests/lotm_charm_materials.test.js`, passed6/6; syntax checks for host, domain, Tingen UI and new renderer passed; scoped `git diff --check` passed.
- Native proof: `node tests/lotm_personal_earmark_browser.mjs`, exit0. [Measured evidence](../../../representations/evidence/lotm-personal-earmark-2026-11-25/proof.json), [before spending](../../../representations/evidence/lotm-personal-earmark-2026-11-25/before-purchase.png), [revised after spending](../../../representations/evidence/lotm-personal-earmark-2026-11-25/revised-after-purchase.png). Owned browser, server, temporary synthetic exports and bundle cleaned; no task processes remain.
- Shared release gates: coordinator owns the combined build, architecture, rules and full suite.
- Limits of this proof: no earned multi-day commission route or new contract terms, no automatic debt settlement, no new universal basket price, no generalized earmark interface for every world. Other seats can use this mechanism with a context and reason; the current default exposes it in Klein's Tingen view. Mobile and enlarged-font acceptance were not exercised here.
