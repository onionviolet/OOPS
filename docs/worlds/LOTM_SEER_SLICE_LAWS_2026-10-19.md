# LOTM early-Tingen Seer slice: world-law rows (LTS1 to LTS10)

2026-10-19. **Status: proposal at level 3 of the [authority order](../RULES_INDEX.md#authority-order)
(source-qualified world law for one pack slice, WA4). Not a register entry and not
project direction.** Prefix LTS checked unused by `git grep` 2026-10-19. Weibao picked the LOTM
Seer slice as the next deep world implementation on 2026-10-19 (see
[scale plan, next world](../IDEABOARD_SCALE_PLAN_2026-10-19.md)).
Source facts and locators live in the [initiation plan](../gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md)
(H1 to H7); this file only states how the engine reads them. Each row is default, dial, reason.

| Code | Law (default) | Dial and reason | Where it runs |
|---|---|---|---|
| LTS1 | **Holding is not having.** A dose in hand, an allocation or a recipe grants no faculty. | A world may let some sources be granted by other means with their own cost and cause. Reason: the plan separates allocation from ingestion (D2). | `accept_allocation` moves custody only; `ingest` is the grant. |
| LTS2 | **Source is not method.** A consumed dose grants the source; a method needs a teacher segment of actual effort. | Other pathways may teach faster, or grant a method with the source, if their source says so. Reason: initiation enables learning, not mastery (0029, 0032). | `ingest` grants `book.lotm.seer`; `lesson` learns `book.lotm.material_perception`. |
| LTS3 | **Ingestion is irreversible and atomic here.** One command consumes the dose, grants the source, provisions the reserve once and records basic stabilization. No refund, no mid-point cancel. | A later hazard may be exposed as an interruptible branch once its cause, warning and outcome are qualified (H1a). Reason: no checked passage fixes an interrupted acute stabilization, so none is invented. | `ingest` has no duration; no cancellation. |
| LTS4 | **Cost is paid at segment start and forfeited on cancel.** A lesson spends one spirituality when it begins; cancelling returns nothing and keeps the source. A one-minute observation is not cancellable at all, so a held sample is never destroyed mid-look. | A world may refund unperformed segments. Reason: D2/D3, performed effort is real; the engine's `forfeit` cancellation is the supported mode. | `lesson` uses `cancellation:'forfeit'`; `observe_*` use `'none'` because `refund` would also refund the unit and a plain cancel would delete the reserved sample. |
| LTS5 | **Spirituality is one pool with strain.** Reserve and strain live in one integer energy record; no parallel stamina or sanity ledger. | Capacity, output and strain limits are per-world dials; these values (capacity 3, output 1, control 1, 1:1, strain limit 6, 1 per use; capacity 3 makes the lesson and two lots use the pool up, so sleep unlocks the comparator) are authored prototypes, not source numbers. Reason: D3. | `book.lotm.spirituality` via `energy_resources.js`. |
| LTS6 | **Stopping ends new cost, not fatigue.** Ending sight stops new spending; strain cools only through played recovery. | A world may add faster cooling by a stated means. Reason: the source records severe tiredness after repeated toggling (H2). | Strain stays until `sleep` completes. |
| LTS7 | **Recovery is a played, completed job.** Sleep of 120 played minutes at a rest place restores the reserve (to 3) and cools strain once, clamped. Cancel or reload earns nothing. | Duration and amount are tuning; partial sleep may later give partial value. Reason: D4; time alone, rendering or reload never refills. | `sleep`, `once:false`, effect on completion only. |
| LTS8 | **Perception shows presence, not identity.** The method answers "a signal at this material or not". It does not name the material, certify safety or find a hidden observer. A negative reading is not proof of absence. | A stronger method may answer more, in its own source. Reason: R1, the recognition-as-exploit risk. | Findings are attributed observations in knowledge, never a verdict fact. |
| LTS9 | **One method, any supported sample.** The same learned method works on the comparator and on each supported lot without per-target grants; a returned sample cannot be re-read for a second finding. | Re-observation after a change in the material may be allowed once the material record changes. Reason: AR7 useful reuse without duplicate rewards. | `observe_*` requires a held sample and an unreturned flag. |
| LTS10 | **Unknown facts do not pass `not()`.** In this engine an absent fact fails both a rule and its negation, so every flag a rule reads is emitted explicitly as a boolean. | None; this is an engine fact, not a world dial. Reason: found by test in this slice. | `lotmFacts` emits `lotm.flag.*`. |

## What this slice does not claim

Digestion and promotion, other pathways, a general potion editor, a dangerous-contact or
loss-of-control branch (H3 to H7), Klein's body or memories, full Tingen, and any native
binding, save slice, entry screen or UI. Those are separate, later work.
