# Proto23 Village life loops proposal, 2026-10-14

Authorized by the absorb-all dispatch COMMON.md. Original behavior inspired by
Proto23's source reports; no source code, assets or prose copied. Names, balance
and fiction are proposals awaiting Weibao's play/taste acceptance.

Target: laptop/desktop at 1366×768. Visible outcome: Local life explains search
exhaustion, available watch/market windows, courier and parcel actions; the existing
Quests view shows the next relay stop; Titles shows two public lifetime goals and
one anchored cue for a live grant. Mobile optimization remains deferred.

| Loop | Route and consequence |
| --- | --- |
| Home and purchases | The existing `absorb_local_life` owner records observed Shack minutes and settled native trade quantities. Homebody requires 1,440 game minutes; Local Customer requires 25 items. These titles add no balance bonus. |
| Watch | Accept in Village from 07:00 to 10:00. Stay idle there until 20:00 for 12 coins and 3 Perception XP; observed watch minutes train existing Persistence at 0.1 XP/minute (at most 60 minutes of XP per observed step). Leaving, other work, death or a missed calendar day interrupts without pay. Another shift opens next morning. |
| Weekly market | First day of each calendar-derived seven-day period, 09:00 to 17:00: claim one restocked Stale bread. The claim is persisted; missed weeks do not accumulate. Native traders retain their existing restock schedules. |
| Courier | One 40% roll per observed Village arrival, deferred until idle if arrival happened during work. Once met, the courier stays listed. Reading the route pamphlet reveals the relay without bypassing native travel permissions. |
| Relay and mentor | Elder in Village → millers at Eastern mill → old craftsman in Village. Each handoff is explicit; Quests names the next stop. The last receipt pays 8 coins and 2 Perception XP. Start another relay explicitly after completion. Elder guidance points to the native Cave room/report-back route when the mill is locked. |
| Bleeding | The existing clawed guardian has a 20% on-hit wound chance. Each wound adds five game minutes, capped at fifteen. The native effect loses 0.5 health per native health tick and actual played exposure trains existing Iron skin at 0.25 XP/minute. This adapts bodily resistance through the existing defensive skill, rather than adding a new Bleed Resistance skill. |
| Search | Existing finite finds remain unchanged. The row says one find remains before discovery and zero remain after it, with the exhausted action disabled. |

## Owners and compatibility

`src/absorb_c2/local_life.js` remains the reward/state owner. The existing calendar
and joined simulation settlement drive it; there is no second clock, catch-up
registry or independent reward timer. Existing expansion quest cards present the
watch/relay alongside native quests, using the native completed filter. They do
not create another reward owner.

Local-life schema 3 reads absent, schema-1 and schema-2 records, preserving their
search, runner and meal accounts. New counters default to zero because old saves
contain no reliable historical home duration or purchased quantity. Future schemas
reject. New state settles with native money, items and XP in the existing durable
transaction. Bleeding uses the existing active-effect duration save format.

Unearned title goals predate this lane (`73519a0a`). The shared native discovery
feedback now accepts a configured title event and title-row anchor while its
existing skill callers retain their defaults. Restore never emits a title event.
Closed, hidden or disabled-effect panels retain the ordinary log receipt.

## Evidence and limits

The dispatch report `docs/gm/dispatch/absorb-all-2026-10-14/reports/p23-life-loops.md`
in the main checkout owns exact commands, bundle hash, results and merge risks.
The browser checks in this worktree use disposable fresh origins and controlled
native-save fixtures. They distinguish observed native actions/persistence from
naturally earning an entire day or the guardian route. Director play/taste remains
the remaining acceptance gate; the proposal does not redefine standing priorities.
