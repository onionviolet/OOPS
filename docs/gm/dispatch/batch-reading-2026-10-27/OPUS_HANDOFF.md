# Opus handoff: next steps for batched reading (2026-10-28)

For an Opus coordinator picking this up cold. Read in this order: [REFLECTION](REFLECTION.md) (issues and fixes), [PLAN](PLAN.md) sections 5, 6, 6a and the round 2 and 3 results, [READINESS_AND_SCOPE](READINESS_AND_SCOPE.md) (own-style gaps C1-C8, gates G1-G6, angles F1-F10, long term L1-L12, local-AI reconciliation R1-R5), then the runner `scripts/lead_run/batch_*.mjs` and `tests/lead_run_batch.test.js` (17 pass). Latest commits on master: `78cce1fa0`, `cf2ad9e01`, `add7ad675`, `3806d111f`, `5e36230f7`. Outputs and request files are private and gitignored under `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/`.

## Rules that bind

Paid API route. Every live submit needs Weibao's explicit go phrase for that label and a `--max-usd` cap; ask before each new label. Key from the macOS Keychain (`anthropic-api-yairpg`), loaded only into the child process, never printed or committed. No push, stash, reset or force; commit only your own paths; no Co-Authored-By trailer; one full `npm test` before committing code. The Anthropic promo credit expires Nov 10 (local report A4).

## State

Spent about $0.053 on the `w3s33` A/B (n=1). Decided: census at medium effort, strict schema; scenes at high effort, prompt mode ($0.0112 and $0.0105 per shard). Runner has rules, people and texture passes (mocked and dry-run only, never run live). 3-shard pilot plans (`w1s15`, `w2s25`, `w3s36`) are ready, dry-run only. Nothing is waiting on a collect.

## My recommended method (a proposal for you to challenge)

Yes: cheap Haiku recording, then Sonnet for judgment and gap observation, with Opus only at the decisions. In order:

| Stage | Who | What | Cost shape |
| --- | --- | --- | --- |
| 0 | Scripts | Candidates, known-name fill, id merge, claimant from evidence kinds, `touchedByLead` and whereabouts from scenes, affordance matrix | free |
| 1 | **Haiku batch** | Census (medium, strict), scenes (high, prompt), texture (high, prompt); rules and people on every shard as a first draft | about $0.03 to $0.05 a shard for all passes |
| 2 | Code lane | Cross-shard merge (C5): one id registry, anchors resolved, one label per id, late identity relabel (F3) | free |
| 3 | **Sonnet batch, reading rows plus their cited paragraphs, not whole shards** | (a) **Gap observation**: answer the fixed own-style question list from the merged rows only and name each missing field; (b) options and needs lane (two or more alternatives per choice, needs resolved to ids); (c) rules and people upgrade on shards the census flags dense; (d) 10% fact-support check | cents to about $0.20 a shard; under $5 for volume 1 [I] |
| 4 | **Opus** | Read the Sonnet gap list, freeze or change schema 1.4 (G4), counterfactual synthesis per arc (C4), decide the order of other books | few calls |
| 5 | Consumer | Scripted lead bot (M3), poke tests (M5), Weibao plays; the real test of "enough" | his time |

Why this order: Haiku misses by omission and omission is cheap to fix (effort, a second run, script fill); Sonnet is 20x per token, so give it small inputs and judgment work; gap observation before the schema freeze means passes get added because a named question needed them, not by guess (L10). A re-read of volume 1 costs under $1, so being wrong is cheap; wasted merge and audit effort is the real cost (L1).

## Decisions for you

1. Run the 3-shard pilot (census then scenes), pass rule in PLAN: each shard A or B, new-entity recall at least 0.75, cost per shard within 2x of $0.022. Go phrases: "Go on batch pilot-3-census, cap $0.06." then, after its collect, "Go on batch pilot-3-scenes, cap $0.06."
2. A/B the three new passes on `w3s33` ("Go on the w3s33 rules, people and texture batches, cap $0.05 each.") and the Sonnet census and scenes ("... Sonnet census medium and Sonnet scenes high batches, cap $0.40 each."; plan files for the Sonnet ones are not written yet).
3. Build the merge script (C5) as a code lane; nothing in stage 3 works without it.
4. Write the gap-observation Sonnet batch (stage 3a): input merged rows and the question list `docs/gm/dispatch/batch-reading-2026-10-27/` (to be created, about 20 questions: where is a named person at nine in the evening, what does this rite need, what does a night's lodging cost, what happens if the lead skips this beat, can I make a living by trade here).
5. English runtime adapter (G5) in parallel; it gates 9 of the other 10 books.
6. Set pacing: volume 1 all passes about $2 to $4 inside the Nov 10 credit window; other books afterwards on the monthly credit with per-book caps.

## Open questions I could not settle

- Does a second medium census run (union) beat one high run? Untested (F5).
- Does Sonnet beat Haiku on rules and people, and by how much per dollar? Untested.
- Console dashboard shows no runs: probably workspace scoping or report lag; Weibao to check the workspace picker. Cost record is `<label>_usage.csv`.
- Recall threshold 0.75 for the pilot is my choice, not his.
- The people pass overlaps the NPC-absence lane (session `npc-absence`); merge rather than duplicate.
