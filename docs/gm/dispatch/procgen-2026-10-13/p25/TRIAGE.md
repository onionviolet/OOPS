# P25: notification triage across live narrative surfaces

2026-10-14. **PROPOSAL ONLY.** Extends root T3. This is a source audit plus proposed presentation behavior, not a UI fix. [P3 report](../../../../../.claude/worktrees/proc-p3-storylets/docs/gm/dispatch/procgen-2026-10-13/p3/REPORT.md) describes isolated branch evidence; P25 ran no browser or test suite. [P5 D9](../p5/D9_STORYTELLER.md) controls future selection/pacing, [P11 N1](../p11/REQUESTS_AND_MARKETS.md) controls funded requests, and [P14](../p14/) controls history. Triage owns none of their consequences.

## F1-F5: inspected source

| Code | SHOWN/SOURCE file:line | Observed behavior; inferred implication |
|---|---|---|
| F1 | [event_feed.js](../../../../../src/event_feed.js):37-47,87-102 | Discovered current-world occurrences and player receipts feed leads/news; global simulation log is excluded. Available leads sort first then oldest `at`; news sorts newest `at` and caps at eight. Inference: this is neither urgency ordering nor durable history. Resolved event news uses occurrence time, not `response.at`, so a recently resolved older event can sit below newer news. |
| F2 | [event_feed_ui.js](../../../../../src/event_feed_ui.js):14-46 | Lead rows keyed by ID remain mounted; countdown updates preserve buttons; availability count and location/dialogue/combat guards exist. No three-tier triage, reading cursor or durable news archive is present in this module. |
| F3 | [causal_story_ui.js](../../../../../src/causal_story_ui.js):99-141,160-185,222-237,263-308 | Keyed reconciliation and focus fallback, fresh offer/terms comparison before dispatch, latest/earlier received accounts, work/cancel controls; polite status with timer announcements off at 84-87/226-227. Inference: useful reusable interaction pattern, not a generic feed adapter. |
| F4 | [P3 storylet_ui.js](../../../../../.claude/worktrees/proc-p3-storylets/src/storylet_ui.js):13-33; [P3 event_feed.js](../../../../../.claude/worktrees/proc-p3-storylets/src/event_feed.js):38-47,92-102 | Village-only discovered-player cards, pure response preview and disabled reasons; open cards rebuilt when signature includes clock, recent terminal list capped at five. Feed routes to `storylet_panel` and still caps news at eight. Inference: clock-driven replacement can disrupt focused response controls; native focus failure was not reproduced here. |
| F5 | [simulation.js](../../../../../src/simulation.js):82,423-438,494-495; [P3 simulation.js](../../../../../.claude/worktrees/proc-p3-storylets/src/simulation.js):83,403,458,497-498 | Main seen decisions wait globally and are excluded from ordinary expiry. P3 adds `nonBlocking` to its decisions and safe offer-like expiry. `decision` alone therefore cannot classify a card as blocking, urgent or lethal. Busy native activities still restrict responses. |

These citations are a 2026-10-14 source snapshot, not served-bundle evidence. Root rechecks lines and integrated definitions before implementation. Do not copy branch UI over newer main owners.

## T3.1: classify attention separately from mechanics

Use one projected envelope per canonical occurrence/commitment: owner and stable ref, known label, live status/revision, occurred/learned/settled time, disclosed deadline/clock domain, actual blocking scope, affordable-response state, destination, thread/episode refs, visibility and optional reading acknowledgment. This is proposed adapter metadata, not a second event store or scheduler. Canonical identity is qualified by instance/life/branch; definition ID, display label and same text cannot deduplicate distinct occurrences.

| Tier | Basis and visible treatment | What reading does |
|---|---|---|
| Urgent | Actual currently blocked activity/place/all scope, or a known expiring choice within a local warning window; state **Time paused** or **Expires in played minutes** explicitly | Opens owning controls. No automatic acceptance/payment, timeout or change in play speed |
| Interesting | Available offer, named relationship change, completion/correction or pinned thread; short one-line lead + optional digest | Marks UI reading only; current controls remain accessible |
| Ambient | Low-stakes known texture and ordinary repeated results; expandable digest/Stories link | Does not erase its receipts or remove future eligible content |

Urgent means attention, not danger. A world may be calm, volatile, letter-driven, ceremonial, terse or verbose; warning windows/digest density are local settings, not fixed once restrictions. Storyteller tone can annotate context but cannot hide an actual blocked commitment. A distant unavailable offer can be interesting and expiring at the same time; show **Return to known place to respond** alongside its disclosed timer rather than a falsely enabled answer.

Sort urgent by actual block then comparable deadline; separate clock domains before comparing. Interesting ranks player pin, new correction, completion and available offer, with stable sequence/ID ties. Hold visible ordering while a button is focused; update status in place, then reconcile on blur or deliberate refresh. New urgent items can add a text status without stealing focus. An unknown deadline is **deadline not available**, never zero remaining.

## T3.2: a compact feed plus full owner panel

```text
1366x768 live game: keep ordinary activity + inventory + controls visible
+--------------------------------------+------------------------------+
| Current activity / local actions     | World events                 |
|                                      | URGENT: 1 known matter       |
| Village encounters / Crossroads      | Offer expires in 12 played m |
| Selected matter + real choices       | [View responses]             |
| Costs / duration / safe expiry       | INTERESTING: 3 [Review]      |
| [Answer]  [Other valid approaches]    | AMBIENT: digest [Expand]     |
| Earlier accounts (expand)            | [Stories] [Notification prefs]|
+--------------------------------------+------------------------------+
```

At 1600x1000 retain more interesting rows and a pinned thread preview; ambient remains expandable. The feed links to one canonical owner action surface, with stable occurrence destination, rather than duplicating response buttons. Causal cases get an explicit adapter from their safe presentation, not a dump of `causalStories.receipts`. Preserve live control guards and fresh-quote comparison. Opening from the feed should reveal the correct known card/approach and focus its heading; it must not auto-click its first response. Return restores feed row focus.

Proposed digest groups similar ambient occurrences and repeated completions by visible thread/place/interval, with **3 completed deliveries** only when all three retained receipts qualify. Do not aggregate mixed fulfilled/failed jobs into success, or combine paid auto-policy choices with manual decisions. P3 safe expiry is **closed safely**, not **you refused** or **you chose the fallback**. Standing-order actions from E1 remain separately labelled if later implemented.

Reading acknowledgments are per safe row/version or a producer sequence cursor, bound to life/branch. Newly learned corrections can become unread again without resurrecting the old event. Snooze suppresses a presentation reminder until a supported played-clock point; it never extends a deadline. Mute taste affects optional display only; every known open matter stays reachable in **All matters**. Notification preferences do not exclude gameplay options or change deck weights unless the separately labelled taste owner actually supports that operation.

## T3.3: degrade without misclassifying

| Missing input | Proposed fallback |
|---|---|
| No urgency adapter | **Open matters**, original live mode/known timer; do not invent criticality |
| P3 unmerged/disabled | Existing feed/causal controls continue; no empty P3 error or retroactive draws |
| No destination definition | Retained safe summary + **controls unavailable**; no fabricated command |
| No durable history | Keep feed explicitly **Recent news** and link available legacy summary; do not promise full archive |
| No observer-safe projection | Neutral unavailable status; do not display raw errors, candidates, private receipts or hidden counts |
| Busy dialogue/combat/native work | Preserve owner reason and reachable reading; defer responses without selecting for the player |
| No comparable clock/deadline | Separate untimed group; no wall-clock countdown |

## T3.4: future gates

All OPEN: canonical deduplication across feed/P3/causal/Stories while distinct repeats survive; actual blocking versus nonblocking/expiry/busy cases; late settlement uses correct activity date; no hidden-event influence on badges/rank/digest; countdown preserves keyboard focus and scroll; fresh terms checked on click; import/failed write preserves reading cursor and live pending state. Rebuilt 1366x768 and 1600x1000 journeys must leave an ordinary activity running, open a known card from the feed, review real costs, answer through its owner and see one settlement. Separate natural and seeded-native load comparisons; reading alone changes no gameplay state or draws. Human noise/pacing acceptance remains open.
