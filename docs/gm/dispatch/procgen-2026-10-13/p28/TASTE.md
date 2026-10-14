# P28 transparent taste learning

2026-10-14. **PROPOSAL ONLY.** Extends root AD1 and [P22 FEEDBACK_LOOP K5.1–K5.4](../p22/FEEDBACK_LOOP.md), available at final sibling refresh. Reuse its immutable mark revisions/superseding notes and safe snapshot; its illustrative export is not an implemented schema. Reuse P5 D9 pacing and P15 QA6/QA8/QA13 instead of another deck or scheduler.

## AD1.1: the player supplies the signal

Learn only from deliberately marked experienced content. Proposed signals: **more like this** is a positive preference; **great** is a favorite with an optional “use for tuning” choice; **bug** routes to QA and contributes no dislike. An annotation can name the feature liked: warmth, negotiation, length, a callback, a character's voice. An optional **less often** mark expresses a bounded negative preference. Silence, skipping, losing, leaving, dwelling, paying or clicking quickly are not automatic negative or positive taste evidence. Difficulty, timing and accessibility can explain them.

Mark actual occurrence ID, content revision, world/instance scope, observed tags, learning choice and bookmark revision. P22 owns the bookmark/comment. Taste owns only derived feedback weights and its reduction cursor; selected safe tags/learning choice can be an optional sidecar bound to K5's entry rather than a competing export format. Coexisting “more like this” and “great” count as one positive vote; a simultaneous bug mark remains independently actionable QA feedback. A great moment is not proof its exact card should dominate. Separate situation/genre preferences from UI/prose preference and from actor relationship or morality; liking a villain story does not make the hero villainous. Use only displayed/qualified tags; no secret class or undiscovered trait can appear in a tuning explanation.

Default recommendation: explicit opt-in learning per save and world, neutral when absent. A broader player profile can be an optional portable preference later. World-local genre vocabularies do not merge merely because both use “dark.” Choosing pacing/intensity and choosing learned variety can coexist. Comfortable unfed play stays the accepted baseline; low food never becomes a negative preference signal.

## AD1.2: small, inspectable weight changes

This is a proposed bounded preference bandit, not a deployed algorithm or a statistical claim about Weibao. First version can simply use explicit feedback with a protected exploration mixture. Suggested prototype constants are editable per-world tuning data, not fictional limitations.

For a tag `t`, initialize positive/negative evidence `a_t = b_t = 2`. One learning-enabled bookmark contributes total evidence mass 1 divided across the player's selected known tags, so a ten-tag card does not count as ten votes. Positive contributes to `a`, negative to `b`; bug/unrated contributes neither. Neutral mean is `mu_t = a_t / (a_t + b_t)`. For a candidate's supported tags, compute an average `q_i = mean(2*mu_t - 1)`; empty set means 0. Set `m_i = clamp(2 ** q_i, 0.5, 2)`. Constants propose modest shifts; no unbounded multiplier chain.

Start from **the integrated deck's already eligible positive weights** `w_i`, after world laws, means, cast, local recurrence and selected pacing. Preserve quiet as a candidate with neutral taste initially. For exploration `epsilon = 0.2`, choose:

```text
P_i = (1-epsilon) * (w_i*m_i / sum(w*m))
      + epsilon * (w_i / sum(w))
```

For every eligible candidate with `w_i > 0`, `P_i >= epsilon*w_i/sum(w) > 0`. Thus taste never zeroes that content. A hard ineligible candidate stays excluded; exploration cannot resurrect a missing person, unavailable means or world-law failure. Empty eligible pool follows the existing quiet/skip policy, with no repeated draw. Numerical implementation needs finite checks and stable normalization to preserve this property for the selected weight range.

Do not install this after a universal hard guarantee that already excludes all other families and pretend the formula governs them. Root must bind P3's actual integrated ordering. Existing pity/guarantees remain explicit selection policies; taste adds no exclusions and must not break their reachable outcomes. If those policies conflict with the chosen exploration contract, record the conflict and select an adapter with demonstrated family coverage. Positive probability is not a promise that a rare card will appear within one short run. An explicit world-supported seeking route can improve agency without replacing the random pool.

Original numerical fixture: three eligible equally weighted cards, one warmed tag with `a=3,b=2`, others neutral. Its multiplier is about 1.149, giving it about 0.359 probability; each other gets about 0.321. All remain possible. The player sees a small reason such as “Warm everyday scenes: gently favored by one bookmark,” not a fabricated personality diagnosis.

## AD1.3: explain, pause, reset and undo

Proposed desktop Taste details show: learning on/off; world scope; explicit signals included; known tag shifts; baseline/current comparison on already known content; reset/undo; and “why this adjustment?” linked to its bookmark. Full hidden candidate tables remain author-only. A rare-category count, tuning graph or source name can spoil as easily as prose; do not expose categories whose existence is unknown. P18 owns deeper diagnostic traces, P25 owns presentation.

Editing a bookmark appends a superseding K5 revision and replaces its prior learning contribution rather than accumulating another vote; the annotation history remains immutable. Repeated render, reload, import and reprocessing the same revision are idempotent. Prefer deterministic reduction from active bookmark revisions to mutable incremental math: same scoped input set and reducer revision yields the same derived state. Retain sufficient per-tag contributions when feedback is compacted so undo remains truthful, or disclose exactly which older individual contribution can no longer be undone. Never mine pruned news/biography to rebuild votes.

Reset increments a learning epoch and returns all adjustments to neutral; old bookmarks remain annotations and are excluded from the new epoch unless deliberately re-enabled. Explain this before reset so a next load cannot relearn everything silently. Pause freezes training and optionally selects neutral sampling by a separately labelled control. “Forget learned preferences” and “delete bookmarks” are distinct operations. Reset does not redraw pending cards, erase settlements or change character history.

## AD1.4: durability and integration

Proposed logical owner: learning setting/scope, reducer revision, epoch, included bookmark revisions or retained contributions, neutral prior, known tag mapping revision and last applied selection revision. No raw private commentary needs to enter sampling state. Commit feedback update durably before it affects future ticks. Failed save leaves weights/epoch unchanged. Freeze used taste revision in each actual selection receipt; changing preference after selection never replaces the occurrence or its frozen text/terms. Sampling uses the deck's one saved draw, no extra adaptive reroll.

Absent old owner means neutral/no enrollment. Import restores saved state and source refs under validation; do not append imported feedback onto itself or call an external service. Content-tag updates preserve old feedback meaning through pinned mappings or an explicit reclassification choice. Fork/loop/new life retention follows P13/P16 and selected preference scope: a player-layer preference is not NPC memory. Turn off a pack without rewriting its surviving historical bookmarks; unsupported future tags are dormant, not reassigned.

## AD1.5: evidence and future gate

P15 F2/F5 and P5 D9 F1–F4 are the starting evidence. SHOWN/SOURCE here: `src/simulation.js:497–510` still performs independent per-definition event checks; `src/event_feed.js:37–48,102` projects known events and bounds recent news; `src/world_visit_history.js:21–58` retains referenced visit records while compacting ended visits. INFERRED: these paths do not supply an adaptive competing-deck seam or durable bookmark reducer. Bind the actual P3 deck after root integration and retain feedback refs separately from the display rings.

Future checks, all NOT RUN: positive probabilities and unchanged hard filters across an exhaustive small candidate fixture; multi-tag normalization, neutral/no-feedback parity, duplicate/edit/undo/reset reduction; known-only explanations; failed write rollback; old absence; exact feedback/epoch/selected-card/next draw after Save/reload/Export/literal-file Import; long-run coverage using P18 with exclusions stated. Native mark → visible gentle shift → reset demonstrates the consumer. Weibao's taste acceptance is separate from mathematical checks. No service, passive surveillance or inference of personal traits is proposed as a requirement.
