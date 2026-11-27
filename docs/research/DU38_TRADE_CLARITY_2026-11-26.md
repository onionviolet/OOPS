# Ordinary Village trade clarity

Status: agent-verified, not human-reviewed. Focused native checks and root's rebuilt desktop acceptance are recorded separately below. This is the remaining clarity slice of DU38, not a new transaction system.

## Preflight and comparison

Reading: make ordinary staged trade easier to read at desktop 1920×1080, using the existing two stocks and native modal controls. Mobile and a replacement trade layout are outside this slice. Authority: the requested Discord DU38 follow-through; AD34, AD36, DSG6–DSG11 and UR9/UR70–UR75/UR158/UR167. [DESIGN](../../DESIGN.md) and [UI rules](../UI_RULES.md) own presentation. No new design rule is introduced.

The [November 16 feature ledger](../audits/DISCORD_FEATURES_LEDGER_2026-11-15.md) left DU38 open. Current source already implements more than that historical dependency note suggests: the item card uses the kit; workspace A5 puts native Belongings first beside the merchant and resets its scroll; quantities 5/10/all, pending row tints, price percentage, signed net, Accept and Cancel already work. The [later absorption check](../audits/DISCORD_ABSORPTION_CHECK_2026-10-21.md) also records the two-stock native custody treatment. Rebuilding those would duplicate working mechanisms.

The reproduced remaining confusion: the signed readout says “Total price” although a buy is negative and a sale positive; both stock panes lack trade-specific ownership headings; the native Exit button is hidden by shared center-mode styling. Cancel already clears the picks while keeping the shop open. Back already clears and leaves.

Player sentence: “Your goods”, “Merchant's goods”, “Purse change”, and “− You pay. + You receive. Cancel clears your picks; Exit leaves without trading.” Voice sample from the same existing surface: “Your basket already holds all Dunstan has of coal.” The wording explains the native sign and pending state rather than changing it.

Ordinary route: fresh PLAY → village elder → hello → what happened → ask to leave 1 → need to → starting gear → sword → equipment → money → end dialogue → Visit a merchant → Dunstan. This earns the native unlock, weapon and money. No granted inventory, availability or test fixture is used. After Exit the native merchant submenu can remain expanded; click Dunstan directly when visible instead of toggling the menu closed.

Mechanism and ring: presentation of the existing staged producer/consumer, with unchanged prices, native exact stock custody, settlement, refusal and save schema. Cancel/Exit discard pending picks; Accept settles native stock and purse. Existing game code owns these effects. No time, price, stock, queue or persistence code changes.

Files: narrow inventory/trade markup in `index.html`, trade-scoped rules in `styles/workspace.css`, focused `tests/headless/trade_controls.test.js`, and rerunnable `scripts/perf/du38_trade_probe.mjs`. Core transaction owners remain unchanged. New cycle edges: zero. Registration lines: zero. The pre-existing separate Belongings and Here panels retain their identities and keyboard controls.

Failure scenario: Exit could accidentally behave like Cancel, or pending picks could debit the purse before Accept. The focused ordinary journey checks both, a native buy and sale, the original Back path, one real stock of each kind, heading lifetime and visible native buttons. Existing `center_modes.test.js` covers shared Back lifecycle; `ui_style_ratchet.test.js` covers kit/style regressions.

## Evidence and remaining acceptance

`docs/representations/evidence/du38-trade-2026-11-26/before.json` records the pre-change earned native DOM. Its private earned checkpoint is `work/du38-trade-20261126/merchant-ready.json`, SHA-256 `204312d5657714920b0fac1a57ea99856a9778d834c0b99cf5edfcf1132014d4`. This is a resume input, not seeded gameplay. The merchant screen itself is ephemeral, so after import open the native merchant entry again.

Before: purse 102; Coal buy staging −1C 2W; bread sale staging +1C 1W; both remain uncommitted. Cancel clears picks with the shop visible; Back clears and exits. No native errors. The original probe tried the hidden native Exit and failed; it then used the actual visible Back route. This is the defect being corrected, not a failed transaction.

| Check | Result and scope |
| --- | --- |
| `node --test tests/headless/trade_controls.test.js tests/center_modes.test.js tests/ui_style_ratchet.test.js` | PASS 9/9. First attempt exposed the native submenu's retained open state in the driver; reopening now clicks the visible merchant directly. No game workaround added. |
| `node scripts/perf/du38_trade_probe.mjs docs/representations/evidence/du38-trade-2026-11-26/after.json` | PASS. Same earned input SHA, purse, signed amounts, counts and 400% native margin as before; Exit visible during trade, carried heading hidden after exit, no errors. |
| `git diff --check -- index.html styles/workspace.css`; `node scripts/check_player_text.mjs`; `node scripts/check_architecture.mjs`; `node scripts/check_doc_slips.mjs` | PASS, zero new player vocabulary/raw durations and no new doc-slip hits. Architecture ratchet passes for the current shared checkout; this lane adds no JS runtime imports. |
| Rebuilt desktop 1920×1080 | PASS, root's built-in browser observation on normal bundle `5b3851783584e7e701ad867d680b9337868bb8dbba01de6499ce39b79f2fa6b0`, earned input `204312d5657714920b0fac1a57ea99856a9778d834c0b99cf5edfcf1132014d4`. Normal Visit a merchant → Trade on the village market (Dunstan); both stock headings visible; staged Coal showed −1C 2W; Cancel restored “nothing” and kept trade open; staged Stale bread showed +1C 1W; Exit returned to Visit a merchant. Accept was not pressed in this browser check. |
| Persistence | Save schema unchanged. Native transaction/save behavior remains in the existing owner; no new persistence claim. |

The native test exercises actual buy and sale settlement through Accept. Root's rebuilt desktop check accepts the changed labels, signed staging, Cancel and Exit on the ordinary earned route; it does not add a browser settlement or focus-appearance claim. No standalone browser, default build or full suite was launched by this lane. The retained private checkpoint is cited for repeatable verification; there are no owned background processes.
