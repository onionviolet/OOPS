# A2 minimal shared tag store, 2026-10-14

Proposal for coordinator and Weibao review. Covers K1 and the tag-specific
U14 contract. Source and test evidence only. Gameplay integration is OPEN.

## Delivered

| Code | Status | Change, with A2 worktree source references |
|---|---|---|
| A2-F1 | SHOWN | `src/tag_store.js:33`: immutable `TagRegistry`, definitions with ID, kind, parents, positive revision and open/hidden visibility. Transitive and multiple-parent implication; duplicate IDs, unknown parents and cycles rejected. |
| A2-F2 | SHOWN | `src/tag_store.js:136`: `TagStore` sets, add/remove/has, direct or implied reads, detached entity views, nested all/any/not queries and sorted matching entity IDs. Accepts existing boolean item tag maps, arrays and Sets. Live unknown writes fail atomically. |
| A2-F3 | SHOWN | `src/tag_store.js:80` and `:100`: sense filters by tag IDs or kinds; flat `actor.tag.<id>` facts, optional target prefix and requested tag subset. Observable absence is false; hidden absence/presence emits no fact. Observed query negation also preserves unknown. |
| A2-F4 | SHOWN | `src/tag_store.js:197`: canonical schema-1 JSON snapshot, saved registry revisions and explicit entity tags. Deserialization retains unknown tag IDs with structured diagnostics. |

`TagStore.remove` removes only explicit grants. Removing `wood` does not
cancel an `oak` implication. Removing the last implying child removes its
implied parents unless independently granted. Visibility applies to each
resulting tag independently: a hidden child can imply an observable parent.

No observer on `visibleTags` or `tagFacts` means open tags only. An explicit
`{tags: [...], kinds: [...]}` is a union allow list that replaces that default;
empty lists see nothing, matching a restricted sense. `omniscient: true` is
explicit. In `matches`/`query`, omitting the observer reads true state for
physical rules; supplying `{}` reads only open tags. Callers must select the
right route for physics versus prediction. Nonhuman-starts still owns sense
mechanics; this module only supplies filters.

## U14 compatibility decision

A2-D1, INFERRED contract, SHOWN implementation: snapshot the registry with
each definition's revision and parent graph instead of silently replacing it
with current content. `TagStore.deserialize(saved, {currentRegistry})`
returns `{store, diagnostics}`. The current registry only reports retired IDs
and changed revisions; saved implications, kinds and visibility keep their
old meaning. Unknown IDs with no saved definition remain opaque presence
tags, hidden except to an explicit omniscient read, and survive another
serialization. They can be removed explicitly.

This follows the user's keep-and-report instruction instead of E4's proposed
drop-on-load behavior. Schema 1 is standalone, with no engine schema bump or
existing save change. Unsupported future schemas and malformed/cyclic
snapshots fail visibly. Moving old saved tags to new semantics requires a
future explicit migration. Authors must bump revision when semantics change.
No revisions are silently upgraded, and no global migration chain is added.

## Three best first consumers

Ranked proposals, not wiring. File references below were read in the A2
worktree at its base `30a2671e`.

| Code | Rank and consumer | SHOWN source seam | INFERRED first use |
|---|---|---|---|
| A2-C1 | 1. Item category/material read adapter | `src/items.js:203` copies boolean tags, `:204` adds item; `:192` holds material_type. | Seed entity sets from those existing tags and a separately authored material overlay. Parent implication makes oak readable as wood without adding another item category engine. Keep item keys and save reconstruction unchanged. |
| A2-C2 | 2. Simulation rule facts and observer projection | `src/simulation_effects.js:85` builds simulationFacts, `:103` exposes actor facts, `:110` reads actor knowledge. `src/rules.js:15` and `:25` preserve unknown under negation. | Merge only the actor/target tag facts named by a rule. Knowledge or a sense owner supplies the explicit observer filter. Preserve hidden facts as unknown. A physical reaction can choose true-state queries separately. This supplies the K2/M12 seam without implementing senses. |
| A2-C3 | 3. Recipe material matching | `src/crafting_recipes.js:314` finds recipe materials, `:331` matches exact item ID, `:337` matches material_type. | A future optional tag requirement can match a wood ancestor across materials. Keep current exact ingredient paths. Strength, quality, fit scoring, risky substitution and proc/p2-mixing remain separately owned or deferred. |

## Verification and limits

A2-T1, SHOWN: ran in the A2 worktree:

```sh
node --test tests/tag_store.test.js tests/rules.test.js
```

21 passed, 0 failed: 17 new tag-store tests and 4 existing rule tests. Tests
cover implication, diamonds, cycle rejection, removal, item-map adaptation,
atomic invalid writes, immutable reads, nested queries, visibility and hidden
negation, actual rules.js fact consumption, canonical byte round trip,
unknown preservation/reporting and saved revisions against changed content.
First run was 20 passed/1 failed because the canonical-order test indexed the
wrong fixture after reversal. Fixed that test lookup; final run is 21/21.

A2-T2, SHOWN: source review confirms no imports, DOM access, main/world
dependencies or gameplay callers. Only the two named new code/test files
are included in the branch commit. `git diff --cached --check` passed.

A2-O1, OPEN: coordinator integration review, a real consumer, engine save
binding/migration, rebuilt browser gameplay and save/reload/import acceptance.
No UI change, so no viewport claim is made. No strength/decay, reaction engine,
timers, world rules, cheat hooks, snapshots/offline time or procgen work added.
The proposal is a tested foundation, not completed E4 gameplay.

Commit: `d666e20f`, "Add standalone shared tag store and contract tests", on
`core/a2-tags`. Post-commit worktree status is clean; commit contains exactly
`src/tag_store.js` and `tests/tag_store.test.js`, with no Co-Authored-By trailer.
Main-checkout lane documents stay unstaged. No merge, push, dist rebuild or
user save access.
