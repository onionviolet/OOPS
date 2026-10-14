# K5 extensions: bookmarks, annotations and tuning packets

2026-10-14. **PROPOSAL ONLY.** No gameplay annotation or export exists from P22. Extends [root K5/E2/E6](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md). [P14](../P14.md) owns chronicle/accounts, [P18](../P18.md) owns why/QA, [P15](../p15/AUTHORING_PIPELINE.md) owns content revisions. This is a feedback ledger, not another narrative truth store.

## K5.1: reach it where the moment happens

Proposed ordinary-play route: on a known card, event-feed entry, received dialogue turn or chronicle item, choose **Mark** → “More like this”, “Bug”, “Great”, optional “Less like this” and a note → export **Story feedback** from the same journal/settings surface. Independent marks can coexist: a scene can be interesting and buggy. Marking does not pause routine idle work, settle a choice, modify a pack or grant character knowledge.

Capture the visible moment when marked, not when eventually exported. Retain safe label/text, world/instance, occurrence/thread/definition IDs, revisions, known response/result ref and build/pack lock ref. An expired/pruned event still has a useful feedback snapshot. Marking a nondiscovered event is unavailable. Free-text annotations are player opinions/hypotheses; they cannot become facts, NPC memory or accepted direction without his explicit follow-up.

**Shown/SOURCE:** `src/event_feed.js:37-46,87-90` deliberately excludes unobserved acts/frozen outcomes; `src/people_knowledge.js:6-15,28-39` projects witnessed content; `src/event_feed_ui.js` renders feed output. `src/life_record.js:1,14-15,41-47` is a bounded lossy biography; `src/simulation.js:404-407` prunes terminal occurrences. **Inferred:** these are suitable safe entry surfaces, but neither display history is a permanent reproduction fixture. Capture a minimal annotation before pruning instead of scraping logs later.

## K5.2: safe file by default

Illustrative export:

```json
{
  "format": "yairpg-story-feedback",
  "formatRevision": 1,
  "exportId": "feedback.example.1",
  "privacy": "known_projection_only",
  "entries": [{
    "id": "feedback.example.mark.1",
    "definitionRef": "fixture.departure@1",
    "occurrenceRef": "fixture.occurrence.17",
    "threadRef": null,
    "worldInstanceRef": "fixture.local.1",
    "packLockRef": "fixture.lock.1",
    "buildRef": "fixture.build.1",
    "atPlayedMinute": 17,
    "marks": ["more_like_this", "bug"],
    "note": "I liked the farewell, but the displayed fee disagreed with the response.",
    "observed": {"safeText": "A neighbor asks for help before departure.", "responseRef": null},
    "expected": "Shown fee and charged fee should agree.",
    "replayAttachmentRef": null,
    "supersedes": null
  }]
}
```

Ordinary export excludes the gameplay envelope, private inventory, RNG root/current draws, hidden candidates, undiscovered identities, source prose, private notes and screenshot dumps. Safe pack/build references identify definitions without distributing them. Free text may contain personal details or player-known private-pack content: show a local export preview and let Weibao edit/remove entries before the explicit download. A proposed check can flag known restricted strings locally, but cannot certify that arbitrary free text contains no spoiler. Keep exports local, no background upload/agent telemetry or automatic folder watcher.

Download a named file; agents read only that supplied/authorized feedback file on the next tuning pass. Do not scan `~/Downloads/Games/` or open a private save to enrich it. A file produced by ordinary play is a player-provided known projection, not a saved game. If reproduction needs more information, propose a synthetic real-code fixture from the reported IDs/terms or use a director test-session attachment. A default feedback note is insufficient for exact replay, and should say so.

Director export may attach a separate synthetic checkpoint/trace only under K1's test envelope and secrecy rules. A public issue-ready packet uses synthetic identities/text. Private source-world feedback remains local to its owning workflow; acceptance of a note does not authorize external publication.

## K5.3: tune without changing the meaning of a mark

| Mark / state | Proposed next action | Limit |
|---|---|---|
| More like this | Suggest a K2 request for related situation, recurring cast or tone; retain the cited example | It asks for creative variation, not exact duplication of dialogue, rewards or secrets. |
| Great | Retain as a taste example, with related entries available for review | Appreciation is not blanket approval of this pack, balance or implementation. |
| Bug | Record expected/observed behavior, source locator and reproduction status; find actual cause before fixing | Does not assume player taste is the defect or mark it fixed from an agent explanation. |
| Less like this | Suggest lower future weights or a different tone/profile | Keep mechanically reasonable routes reachable. Content filters and hard exclusions follow their own explicit user choice. |
| Mixed notes | Group by definition/revision/context and show disagreements rather than one flattened score | One mark is qualitative evidence; absent marks are not dislikes. Repeated clicks update one mark, not several votes. |

Default first slice treats marks as passive feedback. Optional later E2 taste steering can change future eligible weights under saved local policy; never reroll a pending card, silently suppress an essential route or turn a preference into a global law. Store the preference change separately from the feedback mark and identify affected future admissions. Annotation-only exports do not need full pack switching/editor machinery.

Agents propose a tuning response with `feedbackRef`, reproduced/source-only/unreproduced status, candidate revision, exact behavioral or prose change, checks, and human decision state. A fix may close a reproduced technical defect while taste remains awaiting play. Keep previous mark/revision immutable; append resolution or superseding note. Follow-up requests can collect several marks without forcing Weibao to choose one genre or world.

## K5.4: bookmark is not checkpoint

A bookmark retains a safe moment and refs. It does not preserve full stock, RNG, commitments or branch resume state. **Replay this** is available only when a qualified K1 checkpoint attachment exists. **New story from this** creates a K2 request with a known premise; it does not copy the character or historical state. Timeline BR3/BR15 and P16 own playable branch bookmarks/player notes. A reference-only annotation can survive compaction through its captured projection even if the source occurrence has gone; label that fact rather than inventing a new event.

Future acceptance, all NOT RUN: mark known pending/completed/pruned moments; exact export/import of ledger without gameplay mutation; mixed marks and note edits retain history; invalid/future file rejects before insertion; secrets absent from text/JSON/ARIA/diagnostics; failed write retains unsaved note visibly; agents propose a cited candidate from one exported file; repeated marks do not distort counts; normal-play source acquisition remains untouched. Rebuilt 1366x768 and 1600x1000 must show mark controls without crowding responses.
