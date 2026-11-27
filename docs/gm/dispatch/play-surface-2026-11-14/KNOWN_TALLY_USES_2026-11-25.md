# Known tally uses receipt, 2026-11-25

| Preflight | Scope |
| --- | --- |
| Reading and authority | Authorized in-game discoverability slice: reveal the already known competing consumers of an earned resource before spending it. Desktop 1920×1080, actual held patrol tally, unknown healer terms withheld. AD6/AD8/AD34/AD43; AR2–AR7, UR43/UR74, PRS4/PRS7. |
| Player sentence | “Watch tally · 1 held”, followed by the actual board and healer offers, each with its quoted input and time. Existing voice sample: “The healer accepts the captain’s watch tally for a leaf.” |
| Existing problem | The tally's item description mentions the board. Fang's Hero follow-up chooses one enabled action; resting an injury can displace board hand-in while healer trade sits elsewhere. The two consumers are existing commands, not new rewards. |
| Mechanism and fit | Existing structured action preview owns admitted visibility, costs, duration and refusals. Forward its player item inputs and held count, then project known consumers by exact item key. RI owner shows the tally's current choices near Hero. No world-wide effect list, inferred reward, new save key or knowledge grant. |
| Files and exclusions | Scoped structured_pack_runtime action projection and structured_pack_ui serialization; generic item-consumer helper; ri_daily_powers tally context; focused tests/browser evidence. Shared inventory renderer, Slumber/Village feature files and unrelated UI remain outside this slice. |
| Failure and checks | Unadmitted healer terms must stay hidden; missing/consumed tally must not retain a spendable resource card; both quotes must use actual costs and one tally cannot fund both. Board hand-in's running Stop remains reachable. Existing RI tests plus earned/unknown/consumed/reload browser proof. |
| Setup and deferred scope | Existing composed Fang wall encounter may set up the injury-producing watch; the tally itself must be earned through the actual drive-off action. Earlier source life, natural acquisition of rank/day access and mobile are deferred. |

## Verification receipt

F1: The [rebuilt baseline](../../../representations/evidence/known-tally-uses-2026-11-25/before.json) reproduced the problem. The actual held item's tooltip named the board, with no healer route. After both healer conversations, Hero showed tally barter but its one follow-up slot showed wound rest instead of board hand-in. The Beginning action list contained the board elsewhere. [Before](../../../representations/evidence/known-tally-uses-2026-11-25/before.png).

F2: Fang's current-life Hero context now groups the held tally's known consumers. Both actions retain their existing command labels, input quotes, durations, eligibility and refusals: ten merit for one tally and five minutes at the board, or one leaf for the tally immediately at the healer. The ordinary wound rest remains alongside them. The original inventory tooltip is unchanged; the improvement lives in the nearby current-life context. [Known choices](../../../representations/evidence/known-tally-uses-2026-11-25/known-choices.png).

F3: Only admitted visible action quotes contribute consumers. Before hearing healer terms, the earned tally shows the board and does not expose the healer's trade. With no tally held, the grouped spendable card disappears. A running board hand-in keeps its existing cancellation route, now with an explicit Stop label rather than an empty one. No new reward, knowledge or saved state is introduced.

| Line | Result and gaps |
| --- | --- |
| FLR1 Build | `BUILD_OUT=.lane-builds/tally-uses-20261125 npm run build`: passed. SHA-256 `58a6029b2fa7ad2ed84897b8a939de4e667238d434b06f7e5311d9c6670b0bbd`. Existing duplicate `deeds`/`dial` warnings are unrelated. |
| FLR2 Route | `node tests/ri_tally_uses_browser.mjs .lane-builds/tally-uses-20261125`: passed, exit 0. Composed rank/day wall encounter setup, then actual drive-off earns the tally and injury, actual healer conversations admit the trade. No tally is gifted. Earlier life/access earning is not exercised. |
| FLR3 Shown | Headless Chrome 1920×1080; before/after and spent-item captures inspected. Item count, both costs and known outcomes are visible together. Unknown healer absent from the resource card; consumed card hidden. |
| FLR4 Used | Both branch commands run from the new controls on the same earned post-terms checkpoint. Healer consumes the tally for one leaf and no merit; board reserves the tally, retains accessible Stop, then pays ten merit after five minutes with no leaf. [Spent for leaf](../../../representations/evidence/known-tally-uses-2026-11-25/spent-for-leaf.png). |
| FLR5 Kept | Both branches Save/reload preserve actual items and their outcomes; no stale spendable card. No new persisted fields, migration or import behavior. Earlier item-consumer persistence tests remain in the existing owner. |
| FLR6 Labelled | Agent-verified, not human-reviewed; [result](../../../representations/evidence/known-tally-uses-2026-11-25/result.json) includes bundle hash, route kind and no page errors. No release or whole-life acceptance claim. |
| Focused | `node --test tests/known_item_consumers.test.js tests/ri_daily_powers.test.js tests/ri_healer_work.test.js tests/structured_pack_runtime.test.js`: 26/26 passed. Actual cost quantities share the existing repeat-budget source; NPC stock, unknown alternatives and spent items are excluded. |
| Architecture | `npm run check:arch`: passed. Main growth 0, existing 205 cyclic edges. Generic helper has no world imports; no new action definitions, registration or style registry. |
| Rules | `npm run check:rules`: passed, existing warning-only lint deltas and optional absent `private_packs/**` glob. |
| Cleanup | Baseline and final browser/server closed normally. Checkpoints stayed in memory; no raw saved game or export retained. Cited before/after build and evidence retained. |

```receipt
build: 58a6029b2fa7ad2ed84897b8a939de4e667238d434b06f7e5311d9c6670b0bbd
route: fixture(earned-fang-wall-tally)
state: browser-verified
viewport: 1920x1080
persistence: checked
tests: 26 focused tests, build, architecture, rules and rebuilt browser branches
review: none
surface: Fang current-life held tally context near inventory
```
