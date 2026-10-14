# K2 extensions: story requests and director acceptance

2026-10-14. **PROPOSAL ONLY.** These are illustrative authoring files, not implemented import formats or agents dispatched by P22. Extends [root K2](../../../../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md#k-tools-for-the-creative-director). Reuse [P15 authoring pipeline A1-A7](../p15/AUTHORING_PIPELINE.md); it owns compilation/lint and review. [P11 N1](../p11/REQUESTS_AND_MARKETS.md#n1-generated-requests-and-quests-from-actual-needs) owns an NPC's in-world request. A creative-director request produces candidate content, not an automatically created quest or world fact.

## K2.1: one premise, optional constraints

Proposed entry: Weibao writes a plain premise in a desktop **Request a story** box or a UTF-8 request file. The UI proposes a normalized request for review/export. Only premise and a stable request identity are mandatory; a world can be supplied by current authoring context. Agents can infer reversible tone, original background roles and prototype scope, marking those assumptions. Ask for clarification only when continuity, premise or source choice materially changes the result. Do not force a five-field form before he can ask for something interesting.

Illustrative JSON, not a runtime pack:

```json
{
  "format": "yairpg-story-request",
  "formatRevision": 1,
  "requestId": "director.neighbor_departure",
  "revision": 1,
  "premise": "A neighbor's son leaves to seek a distant apprenticeship. Let me help, follow, question the recruiter, or keep living locally.",
  "world": {
    "worldId": "fixture.original_local",
    "profileRef": "fixture.original_local@1",
    "continuityRef": "original@1",
    "eraRef": "local_present",
    "anchorRef": null,
    "overlays": []
  },
  "taste": {"tone": ["hopeful", "uncertain"], "pace": "idle_friendly"},
  "mustOffer": ["help", "investigate", "follow_when_supported", "decline"],
  "desiredConsequence": "Their later contact remembers what I actually did.",
  "sourceRefs": [],
  "secretRefs": [],
  "acceptance": {
    "playRoute": "Meet the household, hear the plan, choose a supported response, see a later consequence.",
    "humanCriteria": ["Feels like a person making a choice", "Ordinary local play remains useful"]
  },
  "parentRequestRef": null,
  "feedbackRefs": []
}
```

This is original proposal fiction, no canon claim. For a book-world request, replace the world block with the selected P9/P10 profile, source version/cutoff, qualified anchor and explicit AU overlay refs. Source evidence sidecar uses creator/work, locator, SHOWN/STATED/INFERRED/UNKNOWN, speaker, source quality and contradiction IDs. Secret refs are opaque IDs/routes/status. Never paste source prose or private reading notes into the request export. No remote text service is implied.

Separate desired experience from required machinery. If distant travel is unsupported, the request stays a candidate for a supported local departure/letter slice with a clearly open follow route; agents cannot declare that route implemented through a button that only prints prose. They should retain the original full premise and propose a bounded playable version, not rewrite his ambition as a rejection.

## K2.2: dispatch contract using P15

| Stage | Proposed artifact / responsibility | Concrete completion |
|---|---|---|
| Capture and reconcile | Immutable request revision + assumption/source-gap ledger; root reconciles live direction and selects an execution area | Preserve original premise, chosen world/cutoff and all reasonable routes. Changes become another request revision. |
| Route and bound | P15 batch manifest references request ID/hash, owner files, supported adapters, reserved IDs, first play route, exclusions and fixtures | P12 arcs, P13 canon, P14 history, P16 meta/loops, P17 power, P19 social, P20 place and P21 conflict/economy remain respective owners. Root assigns only the selected joins. |
| Author and validate | Inert quarantine pack, claim ledger, relevant P15 QA results and P18 traces | No unknown effect/opcode disguised as prose. Fix errors; warnings/unknowns retain their exact status. Canon-essential contradictions block canon-labelled admission, not an explicitly different AU proposal. |
| Make reviewable | Candidate pack lock, safe card gallery, supported fixture recipe, natural play instructions and known consequences | Builder runs the authorized technical prototype on disposable origins. Weibao can play a concrete slice before approving fiction. Forced routes do not stand in for natural acquisition. |
| Record decision and admit | Append acceptance record for exact revision/hash, then root integrates selected definitions under K3 and existing authorization | Keep technical evidence and human judgment separate. Acceptance alone does not authorize a commit, publication or private-save modification. |

One worker can execute the stages sequentially; separately authorized agents can receive bounded nonoverlapping owner areas. This document starts no workers. Future dispatch needs current writer/branch checks and root-controlled shared joins, not generic parallel edits to `simulation_content.js` or saves. The pack is content data plus already-supported adapters, not arbitrary executable agent output.

## K2.3: acceptance record

Illustrative record, initially awaiting play:

```json
{
  "format": "yairpg-story-acceptance",
  "formatRevision": 1,
  "recordId": "director.neighbor_departure.review.1",
  "requestRef": "director.neighbor_departure@1",
  "candidateRef": "fixture.neighbor_departure@1",
  "candidateHash": null,
  "scope": {"entryIds": ["fixture.departure"], "worldInstanceRef": null},
  "technical": {"source": "not_run", "rebuiltNative": "not_run", "persistence": "not_run"},
  "human": {"decision": "awaiting_play", "by": null, "at": null, "decisionEvidenceRef": null},
  "notes": [],
  "supersedes": null
}
```

Hash and exact instance/build/fixture/evidence refs become mandatory when the record claims any proof or decision. Human decision values: awaiting_play, accept, revise, reject, or mixed. Mixed includes entry-specific dispositions and reason codes. Record his actual instruction with date and locator; never infer acceptance from silence, a bookmark, a test count or an agent's praise. A new candidate revision needs its own decision; earlier acceptance remains dated evidence for the earlier bytes.

Rejection preserves candidate and premise history. “Wrong tone” can become a tone revision, “cannot follow” an adapter gap, “this is not canon” a contradiction row, and “great, more of this” a linked next request. Entries can be accepted separately where their causal dependency closure is complete. A failed technical gate does not automatically invalidate a useful creative premise, and an accepted premise does not close an unrun gameplay gate.

## K2.4: future done check

For the first selected request, require premise → normalized file → P15 inert pack → validated real consequence → rebuilt disposable play → explicit human decision for that lock. Roundtrip a pending and completed occurrence through Save/reload/Export/literal-file Import if persistence changed. Rejection/revision must leave the prior candidate and active test state intact. Imported requests can contain text and refs only; unknown format revision, huge input, scripts and prototype keys reject before registration. All gates NOT RUN.
