# Earned item rarity and Glow

Status: agent-verified, not human-reviewed. An ordinarily earned uncommon item and its desktop Glow controls passed. Higher earned rarity tiers remain unverified.

| Preflight | Scope |
| --- | --- |
| Reading | Test the actual default game's rarity halo against its new-pickup and worn markers, Glow off and reduced effects, using an ordinarily acquired uncommon item. |
| Authority | Coordinator's bounded follow-up to the user's Glow question; continued same-life natural work authorized up to 30 wall minutes. DSG2/DSG16, UR37, AD36. |
| Player sentence | Item glow describes uncommon and better items in their rarity colour; new pickup and equipped status are separate signals. Verify the actual pixels and state before reporting that distinction. |
| Ordinary route | Elder conversation and real 50%-quality sword gift unlock the Village market and fieldwork. Sell actual starter goods, work real paid rounds, and buy an existing uncommon offer. No seed override, grants, fixture items, clock hooks or runtime mutation. |
| Mechanism and fit | Native trader settlement, market stock Keep, fieldwork earnings and inventory equip controls; existing `feel_finish.js` decoration and `feel_finish.css`. |
| Ring | Actual acquisition, cost/time, native inventory and presentation consumer; no save format change. Any unavailable tier remains unverified. |
| Desktop and deferred scope | Headless 1920×1080 current default game. Show the owned row, real purchase, new marker removal, worn marker, Glow off and reduced-effects states. Mobile and exhaustive higher tiers are outside this pass. |
| Files | Task browser proof and this receipt/evidence. No runtime, user save, prior proof or dist edits. Own actual-life browser storage is private scratch for continuation. |
| Failure and checks | A rarity colour could be mistaken for a new-item pulse, or a fixture-only item could overstate an earned route. Record actual cash/stock/quality, source identity and desktop states; preserve unsuccessful cases. |

F1: Native `getItemRarity` makes quality above 100 and below 130 uncommon; 130 through 159 is rare. The starter crafting quality cap is 100. Initial Village market stock has random quality ranges ending at 120, so this route can supply uncommon gear but does not establish a rare item or a seed-independent guarantee.

F2: Initial route probes corrected UI automation to use the visible conversation topic buttons, the actual weapon-choice branch, the merchant dropdown, and the center view's Back control. Hidden legacy controls were not forced. The first completed market probe observed uncommon Cheap leather shoes at 110% for 390W on bundle `ae7dc5f49b193fcf41dcd70db3ac9e57ea401b891608dfdeca008758a93fa573`; that probe closed before a purchase. A later 111% shoe trace stopped after an over-short trade-action timeout. Neither is an earned rarity proof.

F3: The retained ordinary life began work on bundle `e797966bfa5b358605400dc68227cb544adf7dc58406cb5b6479c43ebf975aa5`. Final work, purchase and desktop controls used current default `9a960b6694049fb0da8063c09e6245254469cebeaa20c96c8793a7f54f8e9fc1`, independently hashed from the actual browser response. Its existing uncommon Rat pelt cape is 113% quality and costs 500W. Starting cash was 102W. Five Stale bread, the real elder sword and starter pants were sold through native confirmation for **193W**, leaving **295W**. An earlier harness assertion incorrectly multiplied initial unit labels into 246W bulk proceeds; that assertion was corrected to record native settlement, including its actual pricing behavior. The source prices were not changed.

The exact cape's native Keep control preserves its remaining stock across refresh without creating an item or charging a fee. The same actual localStorage state was resumed on an isolated origin, with game-save bytes unedited; no new seed or market refresh was used to seek another result. Its first retained input save hash was `bc7b575146ee7ba3bbb8a68385c58248b9d06023f5db3d5efbab2d9ed0640251`. Actual fieldwork accrues pay until stopped, has a two-hour paid round and a 06:00–20:00 summer window. The proof observes accrued pay, stops to collect it, and resumes ordinary work after the next opening window if needed. Game time and wages remain native.

## Verification

The first workday paid **116W** at 20:02, raising cash to 411W. Tuesday's work paid another **114W**, raising cash to **525W**. Nine full two-hour paid rounds produced **230W** in wages. The actual 500W purchase left **25W**, which survived the later native reload; the exact cape remained 113% quality and was equipped through the visible **Full item → Equip · cape** action. No material was granted or consumed to simulate the purchase. Starter goods were sold, time passed and the real price was paid.

The retained work ran from Monday 08:52 to Tuesday 14:33. Wall time from the first work start to final collection was **31 minutes 21.7 seconds**, including the night, automation restart and final continuation. At the original 30 minute ceiling, the real saved round held 84W and 73/120 minutes of progress. The coordinator authorized finishing the nearby round; **47.68 seconds** of resumed natural work collected it. The saved game bytes and pending earnings were preserved, rather than replaced by a fixture.

| Actual state at 1920×1080 | Observed result |
| --- | --- |
| Newly bought uncommon cape | `data-item-new` present, `feel-new-pulse` at 0.9s; green inset rarity halo. [New pickup](../../../representations/evidence/glow-earned-rarity-2026-11-25/uncommon-new.png) |
| Seen after hover | New marker cleared, animation became `none`; the same green halo remained. [Seen](../../../representations/evidence/glow-earned-rarity-2026-11-25/uncommon-seen.png) |
| Equipped | Actual worn state and ◆ appeared beside the name; green rarity halo remained. [Equipped](../../../representations/evidence/glow-earned-rarity-2026-11-25/uncommon-equipped.png) |
| Item glow off | Halo and ◆ disappeared. Native worn state, `[take off]`, 113% quality and its green text remained. [Glow off](../../../representations/evidence/glow-earned-rarity-2026-11-25/glow-off.png) |
| Effects reduced, Item glow on | Static halo and ◆ remained; the motion-settle token was `0ms`. [Reduced effects](../../../representations/evidence/glow-earned-rarity-2026-11-25/effects-reduced.png) |

The observed quality colour was `rgb(127, 232, 143)`, the Vivid uncommon colour. It remained identical with Item glow off. The steady halo was a 4px inset shadow at 45% of that colour. The new-pickup animation and worn symbol are separate signals from rarity. Item glow currently gates the worn/favourite decorative symbols as well as the rarity halo; the underlying native equipped state stays intact.

Source mapping, rather than an earned higher-tier claim: trash below 50 and common from 50 through 100 stay plain; uncommon above 100 and below 130 and rare from 130 to below 160 get the soft halo. Epic from 160 to below 200, legendary from 200 to below 246, and mythical from 246 get a stronger halo plus a solid edge. `rarity_palette.js` supplies the scheme's colour. This pass earned uncommon; it did not earn rare or higher tiers or exercise the favourite ☆ marker.

| Check | Result and limit |
| --- | --- |
| `node tests/feel_rarity_earned_browser.mjs --resume` | Actual native work and saved progress recorded. The old runner had a remembered-menu restart mismatch, then the original 30 minute timer preserved a partial round. These attempts remain disclosed in the history. |
| `node tests/feel_rarity_earned_browser.mjs --resume --finish-nearby` | Native pending work completed and the real purchase passed. This command then exited 1 targeting the deliberately hidden legacy inline Equip control. The source was corrected to the visible full-item route; the earned item was retained. |
| `node tests/feel_rarity_controls_browser.mjs` | **Passed with normal exit 0**, zero page errors, on the same actual earned life. Native reload, visible Equip, Glow off and reduced-effects assertions passed. Screenshots were visually inspected. |
| `node --test tests/feel_finish.test.js` | **5/5 passed**, zero failed/skipped. |
| Scoped Node syntax, document-slip and whitespace checks | Passed. No gameplay build or runtime mutation by this lane. |

The [public native proof](../../../representations/evidence/glow-earned-rarity-2026-11-25/proof.json) names the final bundle, viewport, ordinary route, earlier work bundle and execution boundaries. [Controls](../../../representations/evidence/glow-earned-rarity-2026-11-25/controls.json), [earned purchase](../../../representations/evidence/glow-earned-rarity-2026-11-25/earned-purchase.json), both workdays and `history.json` retain the underlying observations. The composite proof does not relabel the earlier automation failures as successful whole commands.

One cited, test-owned ordinary-life browser state remains private at `work/glow-earned-rarity-20261125/browser-state.json`; it contains the actual equipped cape and 25W, not Weibao's save. No own browser or HTTP server remains. Superseded resume scratch and the failed inline-control screenshot were removed. Windows-held profile residues with suffixes `g9NoOr`, `oSbuRe` and `943XQG` remain under `%TEMP%/yairpg-owned-chrome-`: automatic approval review rejected their exact scoped deletion as “blocked by policy”. No runtime, user save, earlier proof, dist, commit or push was changed.
