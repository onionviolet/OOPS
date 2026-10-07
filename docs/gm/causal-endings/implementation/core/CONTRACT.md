# Causal core contract

Core worker `/root/causal_core`, 2026-10-06. Exclusive writer: `src/causal_story_core.js` and this directory. Runtime status: **implemented-unverified**, pending shared integration and the deferred gameplay/save gates. The authoritative frozen state/IDs remain [INTERFACE](../../INTERFACE.md) and `src/causal_story_ids.js`.

## Exports

| Export | Input and result |
| --- | --- |
| `createCausalStoryState(state)` | Requires explicit expansion11, current played clock/sequence and simulation, with absent causal owner. Returns only the new schema1/definition1 domain, nativeRevision0, three null proofs and no seeded means. Host owns actual enrollment. |
| `beginCausalStoryProof(plan, proofId, cause)` | Requires current actual living lead and, for a protected proof, the actual source/faculty already acquired. Mutates/returns the existing plan. Stores exact 36-minute played-clock window and one beginning receipt. |
| `validateCausalStories(state, registry?)` | Absent inert unless orphan causal people/means/knowledge/work exist. Present requires expansion11, exact ledger/proof fields, actual independent native people/vitals/bodies, known source/faculty/site/knowledge references, bounded ordered unique receipts, actual delivered flags, capture custody, protection/anchor support and retained closures. Optional registry is the full expansion registry with its simulation subregistry. |
| `appendCausalStoryReceipt(plan, receipt)` | Mutates/returns existing plan. Current sequence/clock required. Rejects duplicates or capacity excess; never prunes facts. Ordinary receipts stop at 168 overall/56 per proof, reserving eight of each 64 slots for final accounts. |
| `resolveCausalStrike({attacker,target,random})` | Each fighter is actual `readNativeFighter` shape `{stats,attackPower,shield,shieldSkill,...}`. Returns native roll fields plus `damage`. Mandatory caller-owned random function, finite draws in `[0,1)`. Caller applies stamina, health/life, equipment and result effects. |
| `resolveCausalProtection(state, proofId, candidate, context={})` | Candidate `{actorId,targetId,kind,terminal?,damage?}` with kind `lethal/body_erasure/capture/wound/source_severance`. Context actual `actorId`, optional current method `sourceId`, `knowledgeKey`, `siteId`, and legally selected `observedBy` IDs. Returns `{allowed,prevented,reason,policy,life,body,identity,evidence}`. No mutations, costs or actor life effects. |
| `evaluateCausalClosure(state, proofId)` | Returns null until actual delivery, explicit failed/withdrawn disposition or played deadline. Returns retained account once closed. Otherwise derives independent life/body/capture/goal/player/local/protection/anchor/finality facets plus qualifying retained causes. Actual lead `.delivered` or Roe `.copyDelivered` flags determine delivery. |
| `stageCausalClosure(plan, proofId, cause)` | Mutates/returns existing plan; seals one closure receipt, derives delivery, closes phase and increments proof revision. Repeated staging leaves the retained account unchanged. No reward/payout. |
| `causalStoryOccupiesActor(state, actorId)` | True only when this current actor is a held proof lead. An open arc does not reserve all participating actors. Missing domain/person returns false. |

## Exact records and policy

Receipt fields are exactly `{cause,sequence,at,proofId,kind,actorId,targetId,result,evidence?}`. `targetId` is an actual actor or null; `kind` is a stable bounded host-owned ID. `result` is bounded JSON. Evidence is an optional array of at most16 records with exact fields `{actorId,sourceId?,siteId?,knowledgeKey?,observedBy?,attributedTo?,text?}`. Source observations can survive earned severance as historical references; resolver always reads current active/awakened/unsuppressed actual source support. Knowledge references must name actual received records, and an optional existing knowledge basis must resolve to its actual actor/situation. Observer arrays use actual actors and never grant knowledge themselves.

Closure `result` fields are exactly `{life,body,capture,goal,player,local,protection,anchor,finality,evidence}`. The `evidence` array contains retained nonclosure cause IDs from this proof. Facets:

- `life`: actual `alive/incapacitated/dead/departed`; `body`: `living/wounded/lost/absent`; `capture`: `free/held/unavailable`.
- `goal`: `delivered/failed/withdrawn`; `player`: `supported/copy_delivered/opposed/withdrawn/uncommitted`; `local`: `warned/unwarned/unresolved`.
- `protection`: `none/intact/severed`; `anchor`: `none/established/isolated`; `finality`: `embodied/identity_retained/terminal/departed`.

Player contribution uses actual paid `.accepted` cooperation, or the player's understood `.copy` record together with Roe's actual copy delivery. A player `.delivered` flag from merely hearing Nell's report is received knowledge and does not count as aid. Retained player strike/capture receipts qualify opposition. Roe copy delivery requires the retained actual `.copyHeld` flag and understood `.warning` knowledge. Continuing actor/stock/body changes do not overwrite the once closure snapshot.

Future anchor is exactly `{id:'causal.story.anchor.identity',identity:'causal.story.orin.identity',scope:'base.frontier',topology:'established_identity_local_anchor',status:'established'|'isolated'}`. It requires Orin's actual anchor source/faculty, not an expected level or copied future stats. Isolation requires retained severance/source-release cause. Intact covenant or anchor intercepts only a terminal lethal/body-erasure candidate before actual life effects; output preserves wounded body and leaves goal/capture/local outcomes to actual owners. No arbitrary revival or restoration is selected.

Earned severance requires actual method source/faculty; exact understood `causal.story.{p}.method`; current Nell teaching flag or actual keeper-attributed knowledge; Nell's `.severAuthorized`; current living/co-located Nell, actor and lead, and `causal.story.research`. The host freezes/payment/stages actual method job, rechecks all support and removes/isolate the relation itself. A consensual source release is a distinct host primitive, with current lead consent, and is not disguised as learned severance.

Actual capture requires proof restraint `{captorId,loanId,key,at,cause}` matching an existing one-count Survey-rope custody record, actual incapacitated lead and retained capture receipt. Root must return/remove that custody and clear restraint on release or terminal death. Core has no inventory owner.

## Integration and later acceptance

Host must set expansion11 deliberately, instantiate this domain once, seed/register actual cast/sources via existing native/effect owners, and set nativeRevision through the selected native stage. Reconcile actual delivery flags into `proof.delivery` before strict final validation. Caller owns all sequence increments, current receipt causes, actual stock/vitals/source effects, native metadata, support invalidation, known-account projection and durable publication. Validator expects all six registered causal sites after enrollment and typed frozen actor flags only. Native people start at Village; actual authored position changes may use existing Village or Shack. Historical closure life/body facets remain retained even when continuing life later changes the actual actor.

Deferred: native strike/protection/capture/release/severance behavior, actual copied warning after death, deadline/mid-job support invalidation, observation attribution, closure once/payout consumers, continuing life after severance/closure, absent/old/frozen/generated save/reload/import, storage-failure atomicity, browser/keyboard/director acceptance. No such suite or game execution belongs to this worker.
