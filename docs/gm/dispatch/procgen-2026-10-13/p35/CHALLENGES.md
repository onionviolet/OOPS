# AY1 extended: optional challenges from recorded play

2026-10-14. **PROPOSAL ONLY.** Extend [root AY1](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#ay-generated-challenges), [P26 Z3 story firsts](../p26/HUMOR_AND_NOVELTY.md#z31-story-firsts-read-receipts-not-narrative-adjectives), [P14 CHRONICLE](../p14/CHRONICLE.md) and [CR3 bounded collections](../cr3/COLLECTION.md). P26 here is the story lane, not CR1 consumables. P35 proposes challenge selection and a receipt-based evaluator, not another quest issuer, achievement economy, character psychology model or difficulty system.

## AY1.1: patterns suggest invitations, never obligations

Read only the player's retained, eligible play receipts within a declared window and coverage interval. A repeated habit may suggest a related aspiration or an optional change of pace. Record the factual reason, such as several completed nonviolent repairs. Do not infer the player's morals, private feelings, ability or dislike from an idle queue, absence or combat choice. Missing records mean insufficient coverage. Suggestions can be pinned, edited, deferred, dismissed or disabled with no penalty and no explanation required.

Use a small authored grammar over actual supported verbs and publicly known means. A suggestion needs a feasibility witness: eligible start/scope, accessible action/resource/body/world law, checkable outcome, supported duration and stopping route. Pattern selection never quietly reserves goods or accepts an NPC request. A preview consumes no draw. If variation needs randomness, use a dedicated P1 admission scope when a suggestion/acceptance is committed; preserve the result instead of rerolling on reopen.

Proposed logical records:

```text
Suggestion
  origin pattern receipt refs, coverage, observer-safe reason,
  supported template/revision, feasible known routes,
  player-selected parameters, disposition

AcceptedChallenge
  scope/world/branch/life/body, start sequence/time,
  frozen terms and evaluator revision, eligible producers,
  completion/violation predicates, pending-outcome policy,
  coverage requirements, stop/pause/end rules,
  tracked receipt refs or exact aggregates, current verdict

ChallengeEdition
  original terms, changed-terms/new-attempt links,
  completion/interruption evidence, known chronicle attribution
```

These map to the accepted history owner, not fields pasted into the existing strict chronicle schema. Main `src/chronicle.js:33–59,69–72` uses limited booleans, relationships, events and a 40-line log; it is not a comprehensive play-pattern store. `src/life_record.js:1,32–46` is explicitly lossy and cannot certify an absence predicate. Do not parse text to count kills, cheats, firsts or promises.

## AY1.2: several forms remain reachable

| Code / challenge form | Concrete original candidate | Evidence and useful choice |
|---|---|---|
| AY1.2a Practice or curiosity | After observed steep/boil tests, compare a known method under one supported changed variable | Root **FE4/CL2**, CR3 protocol and exact P2 product-use receipts. No new chemistry or free identification; negative/inconclusive observations can satisfy “complete the comparison” if terms say so. |
| AY1.2b Positive service | Complete three real repairs or deliveries in a chosen known interval | Each fresh funded settlement or actual repair counts by distinct cause; replay/import of one receipt cannot count again. Count is player-chosen challenge scope, not a world use cap. |
| AY1.2c Chosen restraint | “No player-caused violence during this chapter” | Freeze what violence means, actor/control scope, ally/delegated actions, accidents and chapter end. Supported nonviolent routes remain open; ordinary combat is unchanged outside a voluntarily selected rule. |
| AY1.2d Alternative means | “Complete this known request without using my cheat” | Distinguish invocation, passive grants, inherited items, automatic policies and another actor's help. Only offer when a real alternate route exists and cheat activation is trackable. No secretly disabled cheat. |
| AY1.2e Craft or exploration collection | Compare both publicly known preparations for chosen methods; visit selected known authored sites | Root **CL1/PG2**, CR3 guide and P25 map. Freeze a disclosed set/revision; no hidden denominator or forced exploration of secret locations. |
| AY1.2f Free custom aspiration | A title and optional typed criteria selected by the player | Free prose is a self-reported journal goal unless the typed evaluator can verify it. “Be a good friend” cannot be automatically certified from relationship points. |

Three modes can coexist: a tracked aspiration that permits deviations, a voluntary stricter challenge that records deviations, and a self-reported journal goal. An optional enforced modifier needs an explicit opt-in and an actual owning action adapter, with visible current restrictions and a clear stop route. It cannot become a requirement for story progression, normal rewards, meals or ordinary comfortable play. Show tracking first; enforced modes are later candidates, not implied by AY1.

No penalty for refusal, disabling suggestions, failed challenge, pause or stop. A failed attempt remains a record if the player keeps it; it does not brand them immoral, remove powers or add an NPC grievance. Challenges can be repeated or combined where terms remain compatible. An incompatible pair can disclose the current incompatibility and offer edited scopes/separate attempts, rather than locking a route forever. Per-world adjectives control material laws and modifier strength. There is no global “once per save” rule.

## AY1.3: positive progress differs from proof of absence

A completed-delivery receipt can prove a positive occurrence. A whole-life no-violence or no-cheat claim needs continuous coverage of every relevant producer and actor in the chosen scope. A recent sample with no violence cannot prove the whole life was peaceful. Include native combat, simulation actions, items, autonomous policies, companions/delegation and world-specific powers when the terms cover them. Pending destructive outcomes need declared treatment through final settlement, not success at the instant a chapter closes.

Proposed verdicts: tracking, satisfied-at-end, deviated, stopped, suspended, evidence-incomplete and self-reported. Suspended applies when an evaluator/pack is unsupported; it does not mean failed. An old save can record “no tracked violence since enrollment,” never “never violent.” A fork carries parent history with scope labels and opens a new attempt only deliberately; it cannot launder parent violations by deleting summaries. Body, controlled actor, life and world instance stay separate.

Freeze criteria and source/evaluator revision at acceptance. Previewing a changed rule is pure. Accepting changed terms creates a new edition or attempt, retaining the prior record; it never retroactively certifies the old terms. A new pack or newly supported producer does not retroactively fail an earlier completed bounded scope. The older verdict retains its coverage statement. Any whole-life promise remains evidence-incomplete until the required period and pending outcomes close.

Idempotent evaluation key is challenge ref plus producer/cause/outcome, not message text. Evaluate applied results after durable settlement; rejected purchases, previews and failed writes count neither progress nor deviations. Pending action may be shown as pending. A new real repair counts again; the same receipt reloaded does not. Aggregate only when the declared predicate survives exact aggregation, preserving scope and eligible count. Pin ongoing challenge evidence under P14 retention.

## AY1.4: chronicle, firsts and optional rewards

P26 Z3 already owns “first known,” “first recorded” and “first actual” distinctions. A first challenge completion links to its real receipt and declared scope there; it never prevents another completion or makes a second life less meaningful. Chronicle records accepted terms, known reason, efforts and eventual result as an optional personal episode. The player can hide labels while keeping actual play history. Self-reported completion stays attributed to the player.

Initial proposal: recognition and a chronicle note, with no reward mutation. Later badges, cosmetic marks, funded contests or world-authorized power routes remain possible through their actual owners. An NPC contest is a P11/P12 funded request with terms and issuer knowledge, not a self-set challenge pretending to fund itself. Root **SO3** can supply the contest; **MK6** the functional commission; **PR1** the per-world retention decision. Challenge completion cannot mint coins, invent mastery or settle an unrelated promise.

Food challenges must preserve optional meals and no hunger death. “Cook a varied picnic” is available; enforced hunger damage or a feeding gate is outside accepted direction. A player may choose an unfed goal, but the challenge does not add a mortality system. Idle-compatible goals read real queued work through its selected eligible clock; no mandatory active minigame, closed-app catch-up, real-time login streak or pressure to remain awake.

## AY1.5: first slice and future proof

Candidate S35-3: after a naturally completed traveler request, suggest another modest service goal based on that exact receipt. Player chooses a disclosed quantity and known time/chapter scope, accepts or dismisses, completes genuine new supported deliveries, and reads an accurate completion/stop/incomplete note. Root/P34 must provide repeatable funded fresh causes; one nonrepeatable prototype request cannot prove a three-delivery goal. A one-delivery later attempt is valid if a new funded cause exists. Whole-life restraint and enforced modifiers remain separate gated extensions.

At 1366x768/1600x1000 show suggestion reason, frozen terms, coverage/progress, current supported route and Stop together. Mobile and external telemetry are deferred. All gates OPEN: feasible known routes; refusal/disable leaves ordinary play unchanged; preview pure; criteria/coverage/branch isolation; rejected actions and failed writes count nothing; same-receipt dedup and fresh-cause repeat; negative predicate misses become evidence-incomplete; interrupted/pending jobs handled; exact terms/progress/evidence/next draw through Save/reload/Export/literal-file Import; unsupported evaluator suspends compatibly; rebuilt desktop journey and director enjoyment separately accepted.
