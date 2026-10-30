# C1 fold procedure

Owner: coordinating session after Luna outputs return. Parent scope: [C1](../C1_L10_COST_AND_SLUGS.md). Seven [Luna briefs](luna_1.md) through `luna_7.md` each own one private output. Do not launch replacement readers over an output still owned by a running reader. Codes: AD5, AD36, AD38, AR3, AR8, WA48. Source semantics remain proposals until reviewed; this packet grants no runtime rewrite authority.

## Snapshot and coverage

From the repository root:

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/prep.mjs --check
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.mjs --validate-only
```

The first command verifies input SHA-256 values indirectly by recomputing the manifest and all generated inputs/briefs. The manifest is private at `docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/cost-infer/manifest.json`. If inputs drift, stop folding and identify affected slices before regenerating. Do not regenerate over active readers' snapshots. The second command requires every output; per-lane validation is `--validate-only --lane N`. It rejects foreign/duplicate/missing slugs, absent unread trailers and missing or mismatched locator claims. It cannot establish that a paragraph was read or a merge is semantically correct.

Each of the 1,575 fact slugs belongs to exactly one slice of 225. Counts are occurrence counts, not distinct abilities. Both condition and blocker uses are preserved in inventory; a role is not permission to invert a predicate. Ability id suffixes are a different population and are outside this slug pass.

## Cross-slice review and merge

Review all proposed canonical names together using private `slug-cluster/inventory.json` and the seven `out_N.jsonl` files. Candidate pairs can be found by common words and extracted labels, but those are hints. Compare the cited causal mechanisms, actor/target, scope, rank, polarity and knowledge state before merging. A singleton is a valid result. Conflicting uses of one slug remain an explicit unresolved item for a later split, rather than forcing them into a broader name.

`fold.mjs` combines groups sharing a canonical name. For additional reviewed cross-slice synonyms, write private `slug-cluster/aliases.json`, an array of `{from, to, reason, evidence:[{id, locator}]}`. Both names must exist in inventory; use actual read occurrence evidence on both sides. This review maps proposed canonical names, not arbitrary individual members. Do not alias a member away from its own group's meaning. Alias chains are supported and cycles rejected. Canonical/member collisions stop the fold for review.

```sh
node docs/gm/dispatch/sonnet-wave-2026-10-30/codex-r3/c1/fold.mjs --aliases docs/research/novels/lord-of-mysteries/private/lead-run-2026-10-27/l10/slug-cluster/aliases.json
```

With no reviewed extra aliases, omit `--aliases`. The result is private `slug-cluster/folded.json`, with group memberships, original per-lane reasons, alias-review receipts, input hashes and unread slugs. It stays a proposal. A canonical that remains unread is a review gap before promotion. No original typed facts or ability records are rewritten.

## Fifteen-row spot-check per family

Record the receipt privately, with row id, exact locator actually read, result and corrections. Reuse the parent's paragraph citation command. Do not paste source passages into a tracked report.

| Family | Deterministic selection | Pass condition |
| --- | --- | --- |
| Cost inference | Five stated rows, five qualitative proposals, five reason-only rows. Spread across volumes; take the first unused id per volume, then the next sorted ids until each bucket has five. | Stated rows omitted from inferred output and source bytes unchanged; inferred rows labelled with basis; unknown rungs and mechanisms retained; no numeric source claim invented. This is a proposal-integrity check, not source confirmation of inferred costs. |
| Slug clustering | Five multi-member groups (prefer cross-slice), five singleton members, five unread/conflicting slugs. Sort by canonical/slug and round-robin volumes among eligible rows. | Read claimed paragraphs; resolved members denote the same mechanism and state; distinct states/polarity remain separate; unread items make no invented claim. |

If a bucket has fewer than five candidates, inspect all, state its size, and fill the balance from the other buckets. For a bad semantic merge, split the affected group, re-read its members and review other groups sharing its canonical. Source details stay private; the coordinator's tracked receipt contains ids, counts and check status only.

Pending at C1 handoff: coordinator launches `luna_1.md` through `luna_7.md`, receives outputs, validates them, reviews cross-slice aliases, folds and performs the fifteen-row checks. C1 has not run those readers or claimed semantic clustering results.
