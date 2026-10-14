# P17 shared story-signal contract

2026-10-14. **PROPOSAL ONLY.** Extends root [D1–D5](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#d-stories-as-a-power-source-world-specific). No runtime API, schema or product decision is selected here.

## SS1: one causal history, several readers

[P12](../p12/) owns quests, arcs and sifting completed causes into story threads. [P14](../p14/) owns historical accounts, chronicles and legends over those threads. P17 proposes an adapter from their typed records into a world's existing power/progression owner. It creates neither a second story registry nor a universal story XP pool. At initial read, both siblings had checkpoints only. Final refresh read [P12 CONTRACT C2/C6](../p12/CONTRACT.md) and [STRUCTURES S7](../p12/STRUCTURES.md#s7-story-sifting-of-actual-history), plus [P14 CONTRACT K1–K4](../p14/CONTRACT.md). Field names below remain an interface offer over their owners, not demands on their implementation.

Pipeline: actual committed action → retained outcome/cause → P12 sifted pattern → P14 attributed account and transmission where applicable → source-specific power assessment → actual supported grant/use → observer-safe explanation. Several readers may consume the same deed under separately defined laws. An unwitnessed deed can digest a potion without granting public fame. A false account can affect belief where the world's rules allow; the historical deed still remains false.

| Logical signal | Authority and minimum retained evidence | Permitted reader; does not imply |
|---|---|---|
| `feat` | Completed outcome, actual participants/contributions, before/after or measured deltas, cause IDs, world/branch/era and occurrence time | ORV Story qualification, System achievement. An offered quest or attempted rescue is not completion. |
| `roleFit` | Qualified method/principle, concrete actions, current source/body eligibility, relevant feedback and assessor rule revision | LOTM digestion, class/Name/concept recognition. Profession label or matching words prove nothing. |
| `drama` | Actual stakes, uncertainty known at commitment, opposed goals, outcome and response costs; sifting revision | Audience interest/selection. It is a local interpretation, not a universal morality or damage score. |
| `audience` | Real observer/channel reach, delivery/attendance, what was perceived, dated reactions, sponsor identity and terms | Attention, funded gift or sponsor offer. Registration and hidden engine truth are not an audience. |
| `reputation` | Audience-specific attributed accounts, accepted belief/recognition, source chains and corrections | Access, title recognition, qualified fame magic. Retellings are not independent witnesses or verified truth. |
| `belief` | Believer/eligible aggregate, target concept, actual received claims/practice, intensity model and dated change | World-specific worship/fear/faith effects. Positive esteem, fear and theological faith remain separate. |
| `retainedExperience` | Original branch/loop, qualified remembering carrier, event evidence, remembered procedure and current execution means | Regressor planning/training. Player-layer notes do not give an NPC memory or restore a body. |

All signals record present/unknown/unsupported/notApplicable. Absence of evidence is not a failed act, zero devotion, guilty motive or nonexistence. A world can admit an omniscient grader explicitly without granting its knowledge to every NPC. Source-specific assessors may disagree; save their separate judgments rather than collapse them into one truth label.

## SS2: proposed semantic envelope

```text
StorySignal@proposal:
  signalId, kind, subjectRef, contributorRefs, threadRef
  worldRef, instanceRef, continuityRef, branchRef, eraRef, loopRef?
  causeRefs, outcomeRefs, occurredAt, observedAt?, evaluatedAt
  producerOwnerRef, producerRevision, profileRef, sourceSnapshotRef
  evidenceMode, sourceQuality, claimLocatorRefs, contradictionRefs
  payload: supported typed measurements/principles/relationships
  audienceRefs?, knowledgeBasisRefs?, parentAccountRefs?
  availability, visibilityPolicyRef, retentionPolicyRef
```

This is an integration checklist, not a serialized field mandate. Resolve refs through [P11 CONTEXT C2–C3](../p11/CONTEXT.md); keep its eligibility, weighting, functional quality and knowledge channels separate. Native calendar, expansion time, local clocks and loop ordinal need explicit mappings. Store immutable consumed inputs or sufficient typed summaries with their rule versions. Display text is outside the mechanical payload.

A power reader declares source/body admission, accepted signals, actual assessor reach, qualification rule, grant handler, local fuel/refill, portability, interpretation/correction policy and publication boundary. Output is a typed `assessment` with supporting refs, eligible/unknown/ineligible, and a separate grant/use receipt if a real effect executes. Qualification, recognition, offer, acquisition, mastery and use are different states. Unknown required inputs suspend that reader; ordinary work and other valid readers remain available.

## SS3: honesty, including belief-powered lies

Never parse journal prose, a title string, a generated speech, player notes or an LLM verdict for reward authority. Renaming a story, translating it, changing its tone, exporting it or viewing it again changes no power. [P15](../p15/) owns original text generation and disclosure checks; [P6 creative works](../p6/CREATIVE_WORKS.md) owns work/edition/copy/performance identity.

For deed-backed laws, consume real completed receipts. For belief-backed laws, consume a real change in an eligible audience's belief, even if the underlying account is mistaken or deliberately false. This keeps propaganda, theatre, counterfeit legends and mythical original-world play reachable without making a text edit equivalent to a congregation. Record what was asserted, what each observer believed and what actually happened separately. A factual correction can change future belief power under that world's rule; it cannot retroactively erase paid wages or invent missing historical acts.

Original background history may be generated as typed admitted history with declared origin before its account is rendered. It is never fabricated earned player history. Reconcile [E7's lore-makes-facts proposal](../../../../emergent/E7_OBSERVATION_AND_MYSTERY.md#lore-behind-objects-depth-on-demand) this way; an attractive description cannot manufacture a dead smith, a bloodline or a feat. Background/fiction/earned/canon origins must survive sifting.

## SS4: safe and repeatable publication

Read root-integrated P1/P3/P4 before choosing an adapter. Branch reports are not main APIs. Use the existing detached command plan and durable publisher; a receipt, consumed draw, source debit, recognition and reward must commit together. Failed writes publish none. Never grant rewards during render, hydration, import or migration. Finite sponsors reserve funds; a true magical System can grant ex nihilo only through its declared source handler, rather than an imaginary NPC purse.

A proposed deduplication key binds world instance, branch/loop, assessor, rule revision, exact outcome or obligation, and grant kind. It protects the same transaction, not lifetime gameplay frequency. Revisions must carry prior grant lineage so changing a rule version cannot accidentally re-award an old deed. A changed need, later performance, new acted situation or new loop can be a new qualifying cause according to local law. Per-world adjectives such as recurrent, cumulative, ritual-bound, audience-dependent, generous, costly, inexhaustible or revocable describe progression. No fixed global once rule, novelty tax or compulsory active-click test.

Timing feedback loop: assess a just-completed cause using frozen eligible inputs; publish its grant; let that grant affect future actions/selections. Do not recursively use the new grant as evidence for itself. Genuine source-supported recursion is a separately authored staged process with saved progress and bounded work per tick, not an accidental infinite publication loop. A save-size bound is not a power cap.

## SS5: memory and compaction

The existing biography/feed are lossy [SOURCE](LIVE_AUDIT.md). Pin receipts consumed by active stories, grants, debts, rituals, shared ownership or discovery. P14/P18 may compact terminal detail into typed sufficient statistics: exact quantities and qualifier classes, actor/branch provenance, source chains, previous assessment IDs and deduplication evidence. Preserve ordered segments when order matters. A count alone cannot prove a three-step pattern or which teammate acted.

Reader declares what survives: current body/source, learned memory, material Story share, audience belief, title, grants, debt and settlement identity separately. A fictional loop reset is a command, not file reload. Retained observer knowledge may refer to an erased deed without asserting it happened in the current branch. Forked accounts retain ancestry but are not extra independent witnesses. [P16](../p16/) and [timelines T1–T5](../../../../TIMELINES_AND_DIVERGENCE.md#implementation-planning-starts-histories-and-parallel-worlds-2026-10-11) own actual transformations.

Legacy saves keep absent readers absent. Enrollment begins at the current accepted clock; do not mine old biography text for retroactive power. A primary source-qualified authored start may grant preexisting achievements explicitly as start state, distinguished from earned play. Unknown future schemas/active missing handlers require rejection before mutation or an explicitly reviewed dormant preservation policy. A dormant record must not keep executing unsupported powers. No silent revisions, regenerated feats, new sponsor terms or rerolled titles on load.

## SS6: player projection and idle fit

Proposed visible surface: existing Notebook shows the known deed/principle, assessor's attributed decision, actual grant, useful next action and a short cause link. Details can expand beside ordinary actions on desktop at **1366×768 and 1600×1000**. Mobile deferred. Exact numeric bars, hidden thresholds, audience names and secret-backed reasons display only when the world and discovery route permit. Hidden eligibility must not leak through sorting, price, alternative labels, alt text, empty slots or different error messages.

Queued actual service, training, research and performance can supply role/feat signals. Idle means real admitted actions with current means, not pretending to click, sleep, pray or consent to a bargain. No unattended irreversible sacrifice or new patron contract without selected terms/policy. Closed-browser/absent-world advancement is outside this packet; use the actual selected clock policy. Quiet ordinary life, sponsor refusal, multiple progression paths and no-narrative-power worlds remain viable.

## SS7: joins and evidence gates

[P12](../p12/) decides sifting; [P13](../p13/) canon dependencies and divergence; [P14](../p14/) accounts/legends; [P15](../p15/) text; [P16](../p16/) loops/crossovers/endings; [P18](../p18/) long-run QA. Reuse [P5 D8](../p5/D8_LORE_GRAMMAR.md), [D9](../p5/D9_STORYTELLER.md), [EXTRA X4/X5/X7](../p5/EXTRA_IDEAS.md), [P11 N1](../p11/REQUESTS_AND_MARKETS.md), [N5/N6](../p11/INFORMATION_AND_LIBRARIES.md), [N7/N8](../p11/DREAMS_AND_OCCASIONS.md), [CHEAT_VARIANTS](../p11/CHEAT_VARIANTS.md) and [P7](../p7/GUIDELINES.md). Their proposals remain proposals. There is no universal director or lore generator prerequisite for every first slice.

Future mandatory evidence for a selected reader: source qualification of one rule; real producer-to-consumer action; differently worded identical receipts give identical power; identical prose with different actual actions does not; no consumption before successful publication; same obligation cannot settle twice; legitimate later cause can progress again; hidden accounts stay hidden; enough retained evidence survives compaction; exact pending/completed Save/reload/Export/literal-file Import and next draws; legacy compatibility; rebuilt desktop journey. P18 owns sustained multi-seed metrics. All runtime/build/browser/persistence/human gates are **NOT RUN by P17**.

## SS8: final sibling binding, 2026-10-14

P12's recognized arc stores pattern/revision, participant bindings, receipt refs, coverage and interpretation; recognition itself schedules nothing and grants nothing. P17 consumes that recognized result through a separately admitted source reader. Group overlapping matches by actual feat/obligation: several literary views are not several copies of one grant. Preserve negative-query coverage so a missing pruned witness is not proof of solitude or betrayal.

P14's `HistoricalReceipt` supplies actual applied values, qualified operation keys and time/scope. Its `Claim`, `BeliefEpisode` and `Account` supply proposition, audience stance, lineage and correction. Bind P17 `feat` to HistoricalReceipt plus P12 recognized pattern, and `belief/reputation` to actual BeliefEpisodes and qualified transmitted claims. P14's `LegacyTrace` provides the carrier reference, not automatic authority transfer. Keep exact historical identity capsules for dead/departed contributors; current actor absence must not invalidate a genuine old Story. K4 requires sufficient supported query data, not every causal raw row forever. P17 must declare its own required query/retention before any grant.

P15 [T2 semantic frames](../p15/RUNTIME_TEXT.md#t2-composition-contract) receive restricted permitted claims after the mechanical assessment. P18 [revision/compaction hygiene](../p18/HYGIENE.md) measures growing cause maps and keeps provenance/reward capability distinct from readable summaries. Any missing reviewed source law suspends only that reader. None of these completed sibling documents is runtime acceptance or authority to implement every proposed field.
