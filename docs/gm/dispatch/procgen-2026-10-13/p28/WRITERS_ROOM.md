# P28 agent writers' room and prompt kit

2026-10-14. **PROPOSAL ONLY.** Extends root AE1, P22 K2/K3 and P15 AUTHORING_PIPELINE A3–A7. The six editorial roles below feed that pipeline; they are not six required agents, new management tiers or a launched workflow. P28 creates no content pack, implementation worker, recurring task or commit.

## AE1.1: fit the existing dispatch pattern

SHOWN/document: [GAME_MASTER_PROMPT](../../../../GAME_MASTER_PROMPT.md), lines 127–148, defines master GM → world GM → bounded implementers, exclusive writers and review before integration. Lines 153–163 retain writer release, checkpoint status and sequential execution where useful. [PLAN](../PLAN.md) assigns P1–P4 isolated worktrees and P5/later docs lanes; [COMMON](../COMMON.md) preserves root integration. [SESSIONS](../SESSIONS.md) records returned session IDs and a historical `launch.py` route. That record is not current worker liveness or proof a launcher is available.

Proposed mapping: root/master retains authority, source/world selection, writer reservations, shared files and commits; an existing world GM can perform showrunner/continuity review; bounded drafting/checking leaves perform other editorial roles. One agent can wear roles sequentially. Separate agents help when independent canon/QA judgment or disjoint drafting actually adds value. Check available tools/live threads and writer reservations before launching; use a host's exposed dispatch route, never invent an executable from a historical filename. This kit alone grants no new write/delegation authority.

Reuse each real dispatch's COMMON, PLAN, lane prompt and CHECKPOINT/REPORT. Proposed new room records belong inside the root-selected pack task area. Do not copy standing game rules into six competing specifications. Link accepted owners and pin the small relevant dirty input set. A commit hash does not identify dirty source bytes. Record actual assigned agent/session IDs and scopes once returned, never placeholder IDs as running workers.

## AE1.2: role responsibilities and exclusive outputs

`<PACK_ROOT>` is a future path filled and reserved by root. It is not created here. All drafts remain inert/quarantined. The table is an inventory, not a request for Weibao to perform six actions.

| Role | Reads / exclusive proposed outputs | Delivery gate / authority limit |
|---|---|---|
| Showrunner | Current user request, world/era/pack owners, supported adapters; `showrunner/BRIEF.md`, `showrunner/DECISIONS.md` | A small playable situation, alternate/refusal route, attribution/secret class and review scope. Cannot convert a proposal into accepted direction; coordinates the existing GM tier |
| Writer | Frozen brief, safe causal/source dossier; `writer/entries.*`, `writer/CHECKPOINT.md`, `writer/REPORT.md` | Original causal outlines, declared reads/writes, supported consequences, original dialogue/grammar and witness plan. No shared registration, new opcode, copied canon speech or private-note quotation |
| Continuity editor | Draft snapshot, timelines/P12/P14/P19 relevant refs; `continuity/REVIEW.md` | Identity, inventory, promises, clocks, cause/branch/knowledge consistency; issues point to exact entry/field. Does not rewrite the writer's files while writer owns them |
| Canon checker | Selected source profiles, reservations, primary locators and declared overlays; `canon/CLAIMS.md`, `canon/REVIEW.md` | SHOWN/STATED/INFERRED plus source quality/speaker/edition/locator; contradiction ledger, essential UNKNOWNs and AU deltas. No certification by citing another agent's invention; restricted findings ID-only publicly |
| Tone editor | Approved voice briefs, intended genre/comfort, observer-safe drafts; `tone/REVIEW.md` | Readability, distinct coherent voices, humor/register, repetition and original phrasing. Suggestions preserve supported meaning, certainty and terms; tone cannot repair mechanics by changing a promise |
| QA | Frozen entries/adapters and reviews; `qa/CHECKPOINT.md`, `qa/REPORT.md`, bounded fixtures/diagnostics | Relevant P15 QA1–QA13 with actual commands/results or NOT RUN/UNKNOWN, then QA14 review pack. Cannot claim source tests are native proof or Weibao acceptance |

Repairs return to the owning writer. If another role must edit the draft, root records explicit release/transfer and the old writer stops. Review files remain independent records of disagreement. The showrunner does not suppress a canon failure to preserve a favorite scene. Essential contradiction blocks canon-labelled admission; a labelled original/AU variant remains an option if authorized and supported.

## AE1.3: handoffs into P15's gates

Use P15 B1–B5 unchanged as the stage owner, with these editorial additions:

| Stage | Room handoff / retained evidence |
|---|---|
| B1 Select/freeze | Root fills scope and source pins; showrunner returns causal beat brief. Name one visible loop and which adapters exist versus proposed. No automatic requirement to finish every sibling |
| B2 Draft | Writer outputs inert cards and original expression. Each item has stable ID/revision and provenance; reviewers receive its frozen hash, not a moving draft |
| B3 Check/repair | Continuity, canon and tone can review disjoint output files against the same snapshot. QA reports errors/warnings/unknowns. Writer repairs exact findings; re-run affected gates, retain stale review status explicitly |
| B4 Review | Showrunner consolidates the current accepted/revise/candidate options into a spoiler-safe gallery and play route. QA14 requires Weibao's actual entry-level decision, not silence or agent vote |
| B5 Admit/prove | Root-selected builder integrates selected entries with current adapters and compatibility policy, then supplies source/build, rebuilt play and persistence evidence. Root handles authorized commits. Human fiction/balance status stays independent |

P15 lint is a **proposed gate**, not an installed all-purpose command. P15 F19/F23 identify reusable validators/compiler checks, while QA1–QA14 name missing checks. Before a production batch, the builder must implement/bind the selected checks and document their limits. For a docs-only room trial, structured manual findings may make a batch reviewable but must remain “lint not run”; they cannot pass admission by renaming manual review “lint.”

Required checks for a consequential playable pack normally include shape/ref/real-consequence/reachability, canon if claimed, disclosure/attribution, simulated routes and persistence. Grammar/duplicates/tone apply to new expression. Return WITNESS, IMPOSSIBLE-IN-MODEL and UNKNOWN distinctly. Do not demand every proposed checker for a small cosmetic edit. No card with an essential unknown effect, unqualified critical canon claim or disclosure failure is promoted by average score. Partial batches are valid; one rejected entry does not erase independently supported alternatives.

## AE1.4: concrete reusable prompt kit

The following text is a **future template**. Root must fill every bracket, verify the live inputs and supply current authorization before dispatch. Blank paths, hashes, ports or owners are not permission. A docs-only run sets runtime/build/browser/commit to excluded. A playable run supplies a separate authorized builder scope; editorial workers retain their own limits.

```text
ROOM COMMON, revision [brief revision]
Outcome: [one visible situation in selected world/era, plus alternate/decline].
Authority: [exact current Weibao instruction]; proposals remain proposals.
Read: AGENTS.md, PROJECT standing direction, docs/USER_VISION.md,
  [world owner], [source profile and selected locator/claim dossier],
  docs/gm/dispatch/procgen-2026-10-13/p15/AUTHORING_PIPELINE.md,
  [actual task COMMON/PLAN and latest checkpoint].
Snapshot: [base branch/revision], [relevant dirty input hashes],
  [pack/adapter/source revisions]; do not assume current API from this kit.
Role: [role below]. Write ONLY [exclusive role paths]; CHECKPOINT first.
Exclusions: [runtime/shared files/build/commit/network/private saves, as applicable].
Known adapters: [inspected supported operations]; proposed adapters: [explicit list].
Canon: original summaries and locators; SHOWN/STATED/INFERRED/UNKNOWN,
  speaker/source quality; report contradictions. No raw prose/note quotes.
Secrets: public findings use IDs/routes/status only, no truth or candidate list.
Options: reasonable paths remain reachable; local adjectives, no global once rules.
Return: changed paths, snapshot, per-entry evidence/status, unresolved issues,
  exact next owner/action. Never claim checks you did not run.
Gate: [role-specific criterion]; acceptance is [named reviewer/Weibao gate].
Stop at this bounded delivery. A prompt does not start another room or successor.
```

Append exactly one role prompt:

```text
SHOWRUNNER: Extend the supplied premise into two or three causal beats with
  real actor aims/means, a useful result and an alternate/refusal route.
  Bind sibling owners instead of inventing systems. Return a frozen brief,
  entry roster, known/proposed adapters and review questions. Proposed default
  corpus: two ordinary cards, one callback, one short conversation. Counts are
  review scope, not fictional limits. Reserve no other role's paths yourself.

WRITER: Draft the selected entries as inert data. Start with cause, requirements,
  actual costs/effects and route witness, then original text using P15 frames.
  Reuse existing Ink for an authored dialogue beat where its host supports it.
  Unsupported operation becomes a blocked design entry, never a prose-only reward.
  Return stable entry IDs/revisions and exact source claims, not fabricated quotes.

CONTINUITY: Review the frozen draft without editing it. Trace each person,
  possession, shared account and promise through world/branch/time/receipt refs.
  Test completion, refusal and interruption on paper; distinguish unsupported
  trace from contradiction. Return entry/field issues, evidence and narrow repairs.

CANON: Check only claims necessary for this selected batch. Compare locators,
  edition/era/cutoff, reserved roles and explicit AU changes. Distinguish a source
  event from narrator/actor testimony and inference. Return qualified claim ledger,
  essential UNKNOWNs and contradictions; no raw prose or public secret answers.

TONE: Review current observer-safe text for the chosen world/voice/genre.
  Suggest original variants retaining exactly the same claims, negation,
  uncertainty, prices, available choices and promises. Flag structural repetition
  separately from useful running motifs. Return suggestions, not silent rewrites.

QA: Bind and run available relevant P15 checks against the frozen revision;
  missing tools/adapters are NOT RUN/UNKNOWN. Use disposable real-code fixtures
  only if authorized. Report exact commands, counts, failures and corpus limits.
  Prepare spoiler-safe QA14 review materials. Do not self-accept fiction or
  promote source fixtures to rebuilt natural/save/import evidence.
```

Concrete test assignment if root selects it: one **existing supported local supply request**, with an original clarification line, help/decline and a callback from its actual receipt. Use whichever priority canon world already has a qualified request adapter, or an optional synthetic fixture for tooling only. Do not require Frontier progression before canon content. Canon fit needs source qualification; a synthetic trial proves workflow only. The same kit can later handle P26 beat templates, P27 journey episodes, P17 power-related stories or P16 authored notes, using their existing owners.

## AE1.5: review record and done check

Per entry retain brief/draft/review revisions, actual owner IDs, proposed versus accepted decision, lint/check results, contradiction IDs and disposition, authoring provenance, selected routes, source/build/native/persistence evidence and separate Weibao fiction/feel status. Pack version changes invalidate only affected reviews, but hash equality alone cannot establish semantic compatibility.

A useful room trial ends when the selected mini-pack is decision-ready with exact gate gaps. A playable room delivery ends only when the selected builder's real loop and persistence gate pass, with human acceptance recorded separately. More content remains reachable as candidate work; this bounded trial is not a nudge to stop expanding the palette. P28 executes neither trial.
