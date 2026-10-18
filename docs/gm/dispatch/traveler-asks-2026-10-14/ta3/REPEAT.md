# TA3 repeatable needs, time and remembered help

2026-10-14. Proposal for TA-C4 and TA-L2, after TA1 play feedback. [KINDS](KINDS.md) defines typed settlement. Amendment 1 applies: ready, stretch and unknown needs can all wait, with fees held safely. Unknown needs need real world routes, not immediate player access.

## F1. Current behavior is not recurrence

P4 draws three saved people. Each has one supply goal for life. `goal.fulfilled` gates more help and permits residence. Psychological need pressure and the three-days-visiting/two-days-away routine are pure played-calendar projections, not consumption. P34 can repeatedly decline and reoffer the same unresolved need; it cannot generate a new fulfilled need revision. Its 16 rows bound active/recent contracts, not lifetime help. [P34 backlog B5](../../procgen-2026-10-13/p34/BACKLOG.md) explicitly defers recurring consumption/new revisions.

## D1. Need lifecycle and revision ownership

Keep the original goal, supplies and helped fact unchanged for revision-1 validation. New optional recurrence state belongs beside those records, using its own schema, not inside the legacy fields. A proposed person record holds current need ID/revision, cause, cadence profile/revision, earliest next opportunity, custody/use reference, latest settlement ordinal and bounded relationship summary. This is one current recurring need per person initially, an attention/storage choice, not a lifetime limit.

A genuine change of need creates a new revision. Reoffering a declined unresolved need creates a new request ID for the same need revision. Text refreshes, reload, opening a card, band changes and previews do neither. An accepted request keeps its frozen terms. Explicit renegotiation settles/releases the old obligation and raises the replacement atomically or leaves both unchanged on refusal; never silently change the requested grade or reduce the fee.

| Code | Transition | Required cause and saved outcome |
|---|---|---|
| N1 | Fulfilled to waiting | Delivery transfers goods, settles fee, records help and sets next opportunity from the saved cadence profile. Help/residency remains earned even if a later need exists |
| N2 | Waiting to eligible new need | Earliest opportunity reached AND actual supply use/transfer, a completed journey/job, or a separate authored need cause. Being eligible does not debit coins or allocate requests |
| N3 | Eligible to offered | Person available, world route exists, no pending obligation for this need, funded reward and retention capacity. Save next need revision, frozen terms, draw address and escrow together |
| N4 | Offered to accepted to settled | Player takes it, then typed settlement or voluntary decline/cancel. Unreachable, undiscovered and away states wait safely. A new resolved revision never reopens its old payment |
| N5 | Eligible but unfunded/blocked | Keep a quiet eligible marker. No fabricated purse refill, item deletion, background retry loop or draw consumption. Offer again only after a real funding/context change |

Receiving supplies is not consuming them. New exact-key custody must record actual pack use, transfer or supported consumption to free its bounded slots. Prefer a saved departure/pack-use action for ordinary journey supplies, with a safe coalesced game-time cause. It can occur during running idle progress without clicks. Do not deplete legacy supplies that validate old delivered rows; new custody handles later revisions. NPC drinking or damage repair waits for real effect/object consumers. A fresh message or lesson need can arise independently of item use, with its own authored cause.

P4 currently caps person coins at 20 and rewards at 3–6. Bigger difficulty premiums or recurring wages require revised validators and a genuine purse funding route. Do not replenish a purse every cooldown just to keep requests paying. An unfunded traveler can still talk or have a visible need, but cannot promise backed coin escrow. Non-coin reward capability must also exist, not replace missing money with unlimited free XP.

## D2. Cadence as a world adjective

A profile defines named cadence (for example leisurely, steady, busy), played-calendar interval/window, eligible need families, source context and offer salience. Illustrative Village profiles could wait several played days after pack use; exact intervals are play choices, not an accepted universal number. Supply use and cadence are separate checks, preventing a timer from repeatedly requesting already-owned stock. World profiles can differ without adding fixed once flags. Residents still need fitting local reasons rather than fictional departures.

Use saved game time and the world's allowed idle/away policy. Existing P34/P4 does not implement closed-browser catchup. Do not add wall-clock catchup in this slice. A later authorized away system may advance positive jobs or eligibility; it must not generate a missed-request queue, debt, hunger death, relationship decay or punitive expiry. No active-play requirement is introduced. Coalesce a long time jump to one current eligible need per person, not one obligation per missed interval. Summarize skipped opportunities as opportunities, never completed deeds or lost rewards.

Proposed new need draws use a versioned `world.people` scope with world-instance/person/need-revision/table-revision in the address. P1 remains stream owner. G1 `address`, `peek` and `commit` can prepare pure quotes, but caller installs result and ordinal only with the durable offer. G1 outputs differ from P1; adoption gets its own generator revision and golden vectors. Do not port saved P3 deck cursors or P4 identities to G1 as incidental cleanup. No draw from crafting, loot or appearances for cadence, previews or inspections.

## D3. Lateness, interruption and failure

| Code | Situation | Player-facing behavior / settlement |
|---|---|---|
| T1 | Player absent, offline, busy, exploring or does not know the route | Pending terms and escrow stay. No lateness charge, standing loss, stock consumption or failure receipt. “Still waiting; no deadline penalty.” |
| T2 | Issuer on road | Settlement pauses until a return or an explicitly supported remote route. Fee remains held; time away is not breach. P34 already rejects settlement while away |
| T3 | Soft opportunity/card window closes | Card can retire under P3 scheduling; underlying need stays pending or can be reoffered. Do not let a presentation lifetime terminate a funded obligation |
| T4 | Explicit cancellation, refusal, invalid evidence or interrupted service | Cancellation returns escrow and any recoverable held inputs. Invalid evidence rejects before mutation; interruption checkpoints real progress. Distinguish abandoned work from a failed attempted action |
| T5 | Real attempted action fails, target already repaired, or route removed by a world event | Record only observed attempt/outcome and actual costs. Prefer pause, alternate route or agreed replacement. If impossible, close neutrally and refund unearned escrow. No backdated penalty for time away |

An optional player-started timed service can describe expected duration, but the first recurrence slice has no punitive deadline. Explicit harmful choices can have separately authored consequences supported by a real world action; do not infer dishonesty or harm from declining an errand. Reopening after a failure needs a new attempt ID and actual remaining work. No reward from a rejected/stale command or partial failed persistence.

## D4. Storage without lifetime limits

Retain P34's **16 request rows** and shared history's **96 receipts**. Receipt retention is not total story memory and those 96 are shared with P3 and other producers. Current `consumerPins` allows at most 32 owners, eight refs each. `historyPins` also protects historyCauses, open-card refs and the latest request outcome per person. Therefore deleting an old closed row alone does not guarantee history capacity. Recursively linked callbacks can pin a whole chain.

Proposed bounded policy:

1. **B1 Active truth:** never evict pending contracts, escrow, incomplete service progress or unclaimed reward entitlement. At 16 all-active rows, defer admission with an explanation. Player may complete or cancel; neither absence nor a new offer deletes work.
2. **B2 Retire closed claims:** when admitting, retire the oldest closed row not needed by a live consumer. Release its request pin in the same detached plan. Keep immutable original goals for legacy validation even when their request rows retire.
3. **B3 Bounded memory:** persist per-person aggregate delivered/declined/failed counts, standing, latest kind/result/time and a latest processed settlement ordinal. Update once at settlement, not by replaying the rolling receipt window. Treat these as summaries, with explicit coverage, not new historical receipts. Counters use safe integers with explicit overflow rejection, no gameplay “once” cap.
4. **B4 Callback completion:** save a per-person handled-through ordinal only when eligible callbacks are processed in order; otherwise keep a bounded pending set. Completion or retirement releases card/callback pins. A callback may cite a direct settlement, but must not build an endless historyCauses chain. Resolve already-complete callback status before its old response receipt can evict, so eviction cannot resurrect rewarded advice.
5. **B5 Capacity preflight:** compute retained dependency closure and needed slots before taking stock, fees or completing jobs. Evict only unreferenced receipts. If all 96 are genuinely pinned, reject/defer the new plan before any write, preserve the old envelope and show the blocking consumer IDs safely. Consumer completion/retirement is the recovery route; no dangling-ref repair or silent unpinning.

When P3 callbacks pin old settlement evidence, either keep that request row until callback retirement or give the frozen callback its own valid pin independent of the row. New holder/product refs and reward claims need their own bounded admission rules. Compact IDs do not by themselves bound product-catalogue growth: retain any product referenced by inventory, custody, jobs, exposures, knowledge, appearances or receipts. Product garbage collection is a separate P2-owned compatibility task; no deletion in this slice.

A stress gate must mix more than 100 fulfilled revisions and declines, not just repeated declines of one need. Include open callbacks and all-pinned history, prove row/receipt/pin bounds, money and stock conservation, summary accuracy and no callback replay after eviction/reload/import. Add serialized-byte measurements because K1 line count and long mixture keys can bloat a bounded row count.

## D5. Relationship, later cards and lore

Delivery raises a modest saved standing measure and records a typed help fact tied to its settlement ordinal. Preserve P4's existing `relationship='helped with supplies'` and residency entitlement for old saves. Keep any new standing under the generated-person owner; P3's authored `storylet.neighbor` trust is a different person and store. Do not copy a generated traveler into that actor or assume P4 people already support generic simulation relationships.

Later cards can offer a fitting introduction, practical lesson or recognition using a known settlement kind and need revision. A mender recalls a delivered material; a recipient acknowledges a carried message. Card eligibility checks real receipt/summary basis and saved callback completion, not merely a positive standing score. Recurring rewards are allowed for new work; the same old receipt cannot award XP again after its response is evicted. Decline leaves standing neutral by default. Let authored future relationship depth use what happened without making missed opportunities a moral score.

History schema must explicitly support typed request outcomes and standing/knowledge changes, or validated typed effect refs, while reading schema-1 rows unchanged. `knownStoryOutcomes` and `storyRecap` project actual quantities, service result, report confidence and reward kind. Historical lines use labels known at settlement; new knowledge can annotate an old line as newly identified without claiming earlier certainty. A compacted recap says “Since recurrence enrollment, you helped [count] times; recent retained records show ...”. Never reconstruct dates/items discarded from the ledger or invent pre-enrollment life.

Idle summaries count real completed deliveries, actual queued service progress and currently eligible needs separately. “Two travelers have new requests” is not “you helped twice.” No automatic acceptance, hand-in or tuition payment without a player-authorized queue policy. A story card granting native XP remains evidence of that lesson only, not an escort, repair or general teaching simulation.
