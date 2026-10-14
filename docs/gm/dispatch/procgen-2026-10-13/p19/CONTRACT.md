# P19: social edge, event and browser-budget contract

2026-10-14. **PROPOSAL ONLY.** Logical records and budgets are unselected design suggestions, not implemented APIs, migrations, reserved schemas or measured performance. Read [P11 context](../p11/CONTEXT.md), [P14 contract](../p14/CONTRACT.md), [relationship audit](../../relationship-prereqs-2026-10-14/AUDIT.md) and [COMMON](../COMMON.md). The explicit P19 dispatch overrides COMMON's older worktree/build/commit steps. This packet writes only this folder.

## C1: identity and ownership before social writes

Propose qualified `PersonRef = {ownerRef, personId, instanceRef, incarnationRef?}`. IDs remain owner-local; display names never join people. An explicit read adapter can expose P4 actors without merging stores. A deliberate promotion adapter may later enroll the same person into simulation, with mapping, stock/knowledge authority, compatibility and transactional proof. Either remains reachable. A mandatory store merge is not a prerequisite for displaying directed evidence or authoring a bounded lesson.

Keep current `simulation.relationships[from][to]` as authority for its directed axes. Chronicle relationships keep their distinct axes/ties semantics and bounds. The proposed SocialEdge is a view plus references to those authorities, with new durable social episode/bond metadata only where no owner already exists. Do not double-write numerical opinions, create another purse, or serialize the entire context into every edge. Root selects exact persistence placement, field names and adapters after integration.

```text
SocialEdge
  id, scopeRef, fromPersonRef, toPersonRef, revision,
  axisOwnerRefs, declaredAxisSemanticsRef,
  typedBondRefs[], obligationRefs[], durableEpisodeRefs[],
  lastContactRef?, dueContactRef?, disclosurePolicyRef,
  provenanceRef, createdCauseRef, retiredCauseRef?

TypedBond
  id, kind, participantRefs[], startedAt, endedAt?,
  institutionOrLawRef?, termsRef?, authorityConsequenceRefs[],
  recognitionClaimRefs[], causeRef, sourceProfileRef

SocialEpisode
  id, scopeRef, origin: authored | generatedBackground | lived,
  causeRef, ordinal, producerRef, definitionRevision,
  localClockRef, occurredAt, actorRoleRefs, contactOrJobRef?,
  intentRef, initiatorBeliefRefs[], responderBeliefRefs[],
  outcomeCode, actualAppliedConsequenceRefs[], retainedOutcomeValues,
  directedDeltaRefs[], bondChangeRefs[], obligationChangeRefs[],
  audienceEvidenceRefs[], drawReceiptRef?, retentionRefs

SocialPlan
  id, actorRef, targetRefs[], goalRef, expectedOwnerRevisions,
  permittedVerbRef, eligibilityRefs, beliefBasisRefs,
  reservationRefs[], dueAt, expiryOrCancelPolicyRef,
  status, admittedCauseRef, committedResultRef?, continuationCursor?

ContactEpisode
  id, senderRef, listenerRefs[], edgeOrPublicChannelRef,
  endpointRefs, startAt, deliveredAt?, languageOrSenseRef,
  disclosurePolicyRef, messageRefs[], causeRef, outcomeCode
```

Opinion is directed; a marriage/partnership is one multi-party agreement with separate opinions and recognition records. Biological/teaching links use LINEAGE's typed provenance and P14 LegacyTrace joins. Gossip reuses P14 Claim/Account/BeliefEpisode and P11 Message; companion arcs use P12 thread IDs. Banter uses P15 exchange/text editions and only emits a SocialEpisode when a real social consequence exists. A joint event can reference several directed deltas without duplicating the complete event for every participant.

Proposed new-axis meanings must state writer, reader, range and missing-value behavior. Unknown is not zero. Existing axes are not silently normalized: simulation permits any finite value; chronicle clamps to ±100. Example reader `willingness(npc,player,verb)` reads the NPC's relevant direction plus local permissions and means, not the player's feeling toward the NPC. Exact private values cannot be put in People merely because the engine can read them.

## C2: admission, settlement and deterministic clocks

Use existing detached plans and durable publication authority. Resolve world law, selected source version/era and P11 required input availability; enumerate eligible contacts/verbs in stable ID order; score each participant's intent/response from their own beliefs; reserve actual time/stock/rights; freeze terms, cast, revision, draw and causal result at the declared commitment boundary; validate and persist the entire transaction before publishing any consequence. A stale/rejected admission or failed write consumes no new draw and grants no partial social/resource outcome. A failed post-admission task follows its frozen cancel/refund/failed-result policy without rolling replacement history.

Register semantic social-intent, backstory and gossip draw scopes with integrated P1. Do not assert these are existing exports. Rendering, previews, attribution inspection, repeated panel opens and reload never consume draws. Person background remains fixed after commitment; changing grammar, observed detail or player level never regenerates it. Duplicate protection uses producer/cause/ordinal/recipient/consequence identity, so a retry cannot replay one outcome while genuinely new contacts remain possible under local cadence.

The existing relationship effect receipt includes cause/from/to/axis. Combine same-cause same-edge same-axis amounts before handing them to that effect, or deliberately supply distinct effect causes with documented semantics. Otherwise the first effect suppresses subsequent ones. Recent memory windows and receipt tombstones have different purposes; pruning prose is not permission to forget replay protection.

Bind plans to the selected played/local clock, with explicit calendar conversion. Shared jobs settle before the dependent conversation/news. Due work sorts by local boundary, producer priority and stable IDs. A yielded batch retains an exact cursor so arbitrary frame size cannot reorder outcomes or consume new draws. Future absence/skip policies must reconcile under timeline ownership; no wall-clock marriage, aging, death, reward or rumor is enabled here. Narrow reviewed offline packing mentioned by relationship audit F13 is not general social catch-up. P4 hourly projection cannot be blindly used to reconstruct every skipped social encounter.

## C3: read-only source audit, 2026-10-14

Shown/SOURCE means direct source reading, not execution. Negative claims are bounded to the inspected files. Stated means a report/owner assertion. Inferred means proposed disposition. Line locators are this read's snapshot and may drift under concurrent work.

| Code | Source locator | Shown fact / useful seam | Inferred boundary or extension |
|---|---|---|---|
| F1 | `src/simulation_contracts.js:217-250`; `src/simulation_resolution.js:4-29` | People, knowledge, directed axes/memories, party and cause owners exist; person refs require both simulation and actor records; memories cap at 32; seeds and spawned participant templates have existing stable bindings | P4 refs need a qualified reader/promotion bridge; seed derivation alone is not persisted draw consumption; a new social schema must validate cross-owner references |
| F2 | `src/simulation_effects.js:131-158,281-292` | Target context reads actor→target axes; received observations remain separate from target truth; knowledge stages/basis and per-axis cause dedup exist | Reverse willingness needs an explicit reader; stage is not factual certainty; same-axis deltas must be combined |
| F3 | `src/chronicle.js:34-39,62-69,294-303` | Distinct bounded relationship axes/ties and memories; heir/apprentice predecessor recognition and obligations already exist | Merge is optional with migration; general lineage cannot be described as wholly absent |
| F4 | `src/people_knowledge.js:6-15,28-39,50-63,81-105`; `src/simulation_ui.js:55-65` | Introductions/received accounts gate People rows; helper→player and player→porter/clerk memories use different directions; domain views append by ID; workshop UI separately selects created local participants and response state | Label direction/evidence; audit each surface rather than assuming every panel uses knownPeopleView; do not expose private axes, use name equality as a join or claim every memory is player knowledge |
| F5 | `src/npc_lives.js:5-22,24-42,45-51` | Six fixed family records, preauthored birth/marriage events, hash-varied death years; annual advance reveals saved news; optional Iona recruit | Not autonomous marriages/births/feuds; retain legacy authored household rather than replacing it |
| F6 | P4 worktree `src/generated_people.js:12-41,43-79` | Exactly three saved generated travelers with traits/needs/goals/stock, pure hourly routine, known-trait projection, funded help and settlement | No personal-history hooks, generic simulation actor refs, companion arc or NPC-pair exchange; branch evidence stays separate |
| F7 | `src/simulation.js:398-438` | Occurrences freeze responses; settlement applies actual effects; terminal display events prune over 100; discovery has an explicit API | Retain social facts before pruning; an open offer or a draw is not an executed deed; gossip delivery needs its own channel validation |
| F8 | `src/simulation.js:452-472,497-550`; `src/simulation_content.js:84,102-107` | Common boundary integration, independent event checks, priority-ordered actor controllers and paid routines exist; content includes actual directed trust/respect writers and craftsman work choices | Not a general pair planner; baseline scans need measurement, so P19's sparse proposal alone cannot promise engine-wide O(due work) |
| F9 | `src/simulation_contracts.js:257-262`; `src/simulation_effects.js:379-382`; `src/party_battle.js:20-38`; `src/party_content.js:18-20` | Participant overlap guards, party join/leave, bounded willing helper contest and real rest costs | Reuse jobs/permissions; broad autonomous companion behavior and general travel willingness remain separate |
| F10 | `src/simulation.js:573-592` | Explicit reset list controls relationship deletion; rebirth is separate; living party carry and persistent claims/causes exist | No blanket rebirth wipe claim; travel/loop/lineage manifests need exact per-domain rules |
| F11 | `src/causal_story_actors.js:33-39`; `src/causal_story_content.js:195-229`; `src/causal_story_ids.js:9-13` | Authored original actors, consented care, funded follow-up jobs and finite controllers; receipt cap 192, 64 per proof with recovery reserve | Strong pattern for own means and causal behavior, not arbitrary generated social lives or a replaceable general ledger |
| F12 | `src/causal_story_core.js:119-143,282-298`; `src/causal_story_host.js:3-5,67-81,413-452` | Strict typed receipts/closure evidence, reserved finality capacity, staged plans and actual actor-context reconciliation | Reference immutable minimal outcomes via adapter; do not widen exact validated proof records with arbitrary P19 fields |
| F13 | `src/causal_story_host.js:458-479`; `src/causal_story_scenes.js:3-16`; `src/causal_story_ui.js:263-295`; `src/causal_story_native.js:159-195,427-444` | Observer-limited presentation, authored opening text, projected section/action rendering and native-envelope projection guards/publication | Presentation of a case is not a general generated narrative; social views need equivalent projection and envelope consistency |
| F14 | `src/event_feed.js:37-55,87-102`; `src/event_feed_ui.js:22-46` | Known local events/accounts only, eight recent news entries; mounted controls preserve focus while signatures update | Feed is a delivery view, not a durable rumor/history source; social causes must survive outside it |
| F15 | `src/world_visit_history.js:21-58,61-69` | Validate/reconcile before pruning; retain active/referenced/selected ended visits; preview compacts a copy | Reuse dependency-aware retention principle; visit summaries do not supply missing genealogy or playable branch replay |
| F16 | `src/life_record.js:1,14-27,32-46,65-77` | Explicit lossy biography, 64 recent events, 200 yearly summaries and no fabricated old-save past | Keep actionable debts/techniques/gossip provenance in their typed owners, never reconstruct from highlights |

The relationship audit additionally identifies direct NPC-to-NPC memories (`src/backlog_expansion_body.js:401,432-433`) and existing negative reactions (`src/everyday_life.js:28-29`). Their cited presence contradicts a blanket “only player gifts/attacks create social state” claim. P19 accepts that correction as source-grounded, without treating isolated writes as a population simulator or claiming their browser proof.

## C4: prototype work and save budgets

Targets below are **unmeasured**, intended for a future benchmark on a named laptop/browser/build. Storage capacity is a work/retention envelope, not a canon population limit, friendship cap or fixed once rule.

| Budget dimension | Proposed first benchmark envelope | Handling under pressure |
|---|---|---|
| Detailed cast | 64 active individual refs, 256 cold identity capsules | Promote existing IDs; preserve obligations/custody/recognition; aggregates are only for people without promised individual history |
| Directed active graph | 256 edges, contact candidates ≤4 per due actor; at most 16 due contact plans / batch | Save stable candidate cursor; rotate discovery fairly; parked edges remain retained and can reactivate |
| Resolution work | ≤64 candidate evaluations and ≤8 new social episodes / batch; target p95 ≤5 ms, p99 ≤20 ms | Yield in causal order through host scheduler; do not advance dependent effects past unfinished deadlines or discard backlog |
| UI work | Known cast rows only, rerender changed revisions; target social UI p95 ≤8 ms | Keep stable focus; coalesce routine notices; pagination/virtualization chosen only if measured need |
| Pending/retained state | 64 pending contact/plan refs, 128 bonds, 512 recent typed episodes, 256 belief refs, 128 legacy/obligation refs | Reserve closure/correction/transfer space; compact safe routine history and caches first; all unresolved authority stays pinned |

Planning arithmetic using assumed row sizes: 64 person refs ×384 B +256 cold capsules ×192 B +256 edges ×768 B +128 bonds ×256 B +512 episodes ×384 B +64 pending plans ×512 B +256 belief refs ×384 B +128 legacy refs ×256 B = **663,552 B**, about **648 KiB**. Add 128 KiB for bounded text, dictionaries/indexes and source/provenance capsules: **776 KiB**. Proposed incremental envelope target: **≤1 MiB per enrolled active world instance**, with 248 KiB headroom. Those row sizes are estimates, not measured bounds; serialized punctuation, long qualified IDs, UTF-8 text and cross-owner growth may invalidate them.

Count all incremental bytes across existing owners plus new metadata, not just the P19 subtree. Measure decoded UTF-8 JSON, actual encoded save envelope, native local-storage footprint and export bytes separately. P14 history has its own budget; shared records count once, retained extra social references/text still count. Multiple worlds/branches multiply retained state; archive size and storage quota require separate temporal-owner measurement. No claim that a 500-year exact personal history fits a fixed envelope.

If every record is pinned, refuse new optional texture/background admission with a neutral notice. For a history-dependent paid operation, reserve enough record/closure space before taking costs; if unavailable, preserve existing agreements and surface a safe capacity condition. Never prune an unresolved debt, fabricate a new anonymous heir, truncate source lineage into independent testimony or let a retirement leave property ownerless. Root may later select higher budgets or durable archive support. These options remain open rather than converting storage limits into irreversible world rules.

Long-run fixture proposal: same-seed 1/10/100/500-year traces at 16/64 active actors and an adversarial 256-actor cohort, including all-pinned capacity, lineage transfers, cyclic gossip, corrections, concurrent deadlines, missing pack and old-save restoration. Compare single-step advancement with every supported batch partition, next draws and active obligations. Report due-work counts, worst backlog age, starvation, save growth and render/commit time separately. P18 owns the harness and metrics; P19 supplies cases. No benchmark or test run occurred here.

## C5: compatibility and unresolved contradictions

| Code | Both sides | Proposed disposition |
|---|---|---|
| R1 | Dated status/root say P3/P4 are unmerged; branch REPORTs state built proof | At this read main lacks their new module paths. Root verifies integration/API before selecting any social dependent; branch counts are stated evidence only |
| R2 | E2 sketches cast household people; household IDs and P4 IDs are separate owners | Bind by qualified explicit mapping; preserve authored rosters and P4 completed supplies/knowledge, no name join |
| R3 | Relationship first pass assumed missing moods/negative writers/general party combat | Later AUDIT source corrections and current seams establish partial groundwork; new pair autonomy remains a gap |
| R4 | Root G2 assumes P4 backstory; actual P4 has traits/goal/keepsake only | Add compatible past hooks or author one original hook prospectively; never claim the data exists |
| R5 | Older E6/D9 sketches specify three-hop gossip/away caps/once metadata; user wants local adjectives and no fixed once anti-abuse | New social causes can recur; budgets yield/compact while real channels can continue; authored unique events remain historical code facts for root review |
| R6 | Relationship CQ11 proposes reload-reroll dial; COMMON requires reload never rerolls | Reload always restores committed state. Intentional in-world reroll/reset can be a separately authored mechanism, never a UI refresh |
| R7 | Intro PN6 and OT offer offscreen aging/offline social time; P4/P3 and timeline policies do not establish general wall-time simulation | Preserve those as proposals under selected clock/absence contracts; this packet grants no offline changes |
| R8 | E6 fixed canon facts versus authored divergent relationships and source-event changes | Keep reserved source identity and author controlled overlays/causal changes through P13; do not let a generic generator mint canon relatives |
| R9 | Finite display memory versus generational callbacks and replay receipts | Dependency pins and typed aggregates retain supported queries; highlight prose alone cannot discharge obligations or prove exact replay |

Old saves lacking enrolled social state stay absent with unchanged behavior. Opt-in anchors at the current valid local clock and records coverage; no fabricated missed marriages or player deeds. Unsupported active schemas/import refs reject before storage mutation; missing packs preserve dormant records without inventing actors or new outcomes. New revisions keep saved identities, episodes and texts pinned; migration needs declared axis/identity/clock semantics and source compatibility. The first integration should use adapters, avoiding an unnecessary migration of all existing social stores.
