# G1 shared generator kit

2026-10-14. Proposal for root and Weibao review under [COMMON](../COMMON.md)
and [generation rules](../../../../GENERATION_FOUNDATION_RULES_2026-10-14.md).
Code worktree: `/Users/weiwei/code/yet-another-idle-rpg/.claude/worktrees/gen-g1-kit`,
branch `gen/g1-kit`, starting HEAD `12179d0f`. Code locators below refer to
that worktree unless marked P1 or P3. Lane docs live in the main checkout,
remain unstaged and are not part of the code commit.

## Result and boundaries

- **F1 SHOWN:** added a standalone 194-line `src/gen_kit.js`, with no imports.
  Addressed two-lane hashing, exact integer weighted/stratified picks, pure bag
  transitions, pity, sample/score, bounded retries and quote/commit helpers are
  present at `src/gen_kit.js:44`, `:59`, `:75`, `:96`, `:109`, `:125`, `:136`,
  `:152`, `:157`, `:169`, `:185`, `:191`.
- **F2 SHOWN:** `tests/gen_kit.test.js` adds 27 passing tests, including three
  fixed-root golden snapshots. The whole worktree suite passes 661/661.
- **F3 INFERRED:** the kit supplies GR1/GR2/GR6/GR9 and GR16-friendly hooks;
  its test coverage exercises SB1/SB2, SB3-SB8, SB10 and SB14. Adoption into a
  live generator is a separate proposal. No consumer, gameplay, save-loader,
  browser, integration or director acceptance is claimed.

No existing source file was edited. No unmerged runtime dependency, build,
merge, push, private pack or save access. PROJECT and USER_VISION direction
is unchanged; this is infrastructure only and introduces no UI gate.

## P1 compatibility and deliberate differences

Read P1 at `.claude/worktrees/proc-p1-streams/`, read-only:
`src/seeded_streams.js:14-25,47-51,58-71,77-86` and
`tests/seeded_streams.test.js:15-79,82-124`.

**SHOWN:** G1's `mix32` is identical to P1's, and the lane hash keeps P1's
`Math.imul(...,16777619)`, unsigned truncation and zero-to-one convention
(`src/gen_kit.js:47-57`). The numeric `root` is the existing uint32 stream
root, passed unchanged, not a second `streams.root` derivation. P1 owns
creating/loading roots and stream cells. G1 additionally permits a nonempty
string root for standalone generated worlds (`src/gen_kit.js:12,59-63`).

**D1 INFERRED:** keep full UTF-16 input. P1's `for...of` plus
`charCodeAt(0)` discards the low surrogate of supplementary characters.
The focused test demonstrates a P1 emoji collision and distinct G1 hashes
(`tests/gen_kit.test.js:76`). P1's hash needs this correction before replacing
the two local arithmetic helpers with the one-line import
`import {hashStreamSeed as hashLane, mix32} from './seeded_streams.js';`.
After that shared helper correction, removing G1's two local definitions
does not change its golden outputs. Importing P1 now would add an unmerged
dependency and reintroduce the surrogate collision, so it is intentionally
deferred. No P1 file was changed.

**D2 INFERRED:** retain a second hash lane, keyed canonical JSON framing,
and the final mixed uint32 projection (`src/gen_kit.js:59-67`). This meets
SB6 rather than reproducing P1's one-lane draw. Numeric roots are compatible
inputs, but G1 outputs deliberately do not reproduce P1 `unitDecision`
draws or receipts. These hashes are deterministic game hashes, not a secrecy
mechanism. Two uint32 lanes are not a proof of cryptographic independence.

**D3 INFERRED:** use addressed ordinals/attempts and integer multiply-high,
not P1's live cursor mutation, fractional sums or legacy rounding
(`src/gen_kit.js:75-105,169-194`). Future adoption must preserve old frozen
values and explicitly version new draw/table semantics. This lane creates
no new E1 stream storage owner.

## Dedupe targets

**SHOWN:** current G1 `src/` search for `xorshift` and the three xorshift
shifts found these seven existing sites. They remain untouched.

| Current file:line | Existing cursor owner |
|---|---|
| `src/party_battle.js:87` | battle seed |
| `src/feature_expansion_battle.js:279` | expansion battle seed |
| `src/simulation.js:39` | check RNG |
| `src/native_battle.js:47` | native battle seed |
| `src/expansion_engine.js:519` | expansion RNG |
| `src/chronicle.js:224` | chronicle RNG |
| `src/causal_story_host.js:222` | simulation seed |

P3's unmerged `src/storylet_deck.js:43-45` is an additional read-only future
port target, not one of the seven current-worktree sites. P3's sort and
floating weight shaping are at `:31,37-39`; selection/receipts at `:62-69`.

## Docs: API

All callbacks must be pure over a stable input snapshot. IDs are unique,
nonempty strings, sorted by Unicode code point. Addresses accept integer
JSON data, sort object fields recursively and retain positional/array order.
They reject cyclic or lossy inputs. `draw` in weighted picks is a uint32,
not a fraction; only `drawFraction` returns a fraction.

| API | Return / caller contract | Source |
|---|---|---|
| `address(...parts)` | Canonical typed-container string; put world, life, subject, game time, slot and table revision here | `src/gen_kit.js:44` |
| `hash64(root, key)` | `{lo,hi}` uint32 lanes; uint32 stream root or string world root | `src/gen_kit.js:59` |
| `drawU32(root, key)` / `drawFraction(root, key)` | Stable uint32 / `[0,1)` from the same draw | `src/gen_kit.js:65,70` |
| `compareCodePoints(a,b)` | Locale-free ordering for IDs and named fields | `src/gen_kit.js:17` |
| `indexFromU32(draw,size)` | Exact multiply-high integer bucket, `1 <= size <= 2^32` | `src/gen_kit.js:75` |
| `pickWeighted(items,weightFn,draw)` | `{value,receipt}`; `weightFn` returns integer or `{weight,reason}`; receipt includes selected reason and top five positive table-weight contributors | `src/gen_kit.js:96` |
| `pickStratified(categories,categoryWeightFn,itemWeightFn,draw)` | Categories `{id,items}`; `draw(slot)` returns uint32; fixed category weights first, then item; receipt has both picks | `src/gen_kit.js:109` |
| `shuffleBag(root,key,ids)` | Schema-1 JSON `{schema,root,key,ids,cycle,remaining}` | `src/gen_kit.js:125` |
| `next(bag)` | `{value,state,receipt}`; replacement JSON state, one visit per ID per cycle, null for empty bag | `src/gen_kit.js:136` |
| `pity(misses,hit,{every})` | `{hit,forced,misses}`; caller invokes only for eligible windows and chooses per-world guarantee | `src/gen_kit.js:152` |
| `sampleAndScore(k,gen,score,tieBreak)` | `{value,receipt}`; `gen(sampleIndex)`, signed safe-integer score, string tie key; equal keys prefer earlier sample | `src/gen_kit.js:157` |
| `withRetries(gen,validate,{max,fallback,address})` | `gen(attemptAddress,attempt)`; boolean validation; `fallback:{id,value}`; receipt includes attempts, rejected count, fallback ID and `fallbackCount` 0/1 | `src/gen_kit.js:169` |
| `peek(cursor,gen?)` / `commit(cursor,gen?)` | Cursor view `{root,key,n}`; `gen(address)` or default uint32 draw; peek gives `{value,receipt}`, commit also returns replacement `state` with `n+1` | `src/gen_kit.js:185,191` |

Weights and totals are limited to `2^32`, so every positive integer-weight
entry remains reachable at uint32 resolution. Empty/all-zero tables return
explicit null receipts. Stratified empty/all-zero item categories are excluded
and eligible category shares renormalize; adding positive items to an already
eligible category leaves category choice unchanged. Weight reasons are
caller-authored; numeric-only weights use the explicit placeholder `weightFn`.
The top list explains table shares, not a breakdown of modifier arithmetic.

`sampleAndScore` callers put the provided sample index in a draw address.
Retries append `{attempt}` internally, never consume another subject's luck,
propagate exceptions, and use a named authored fallback after at most `max`
candidates. Fallbacks bypass candidate validation; their validity belongs to
the caller's authored fallback contract. Aggregate `receipt.fallbackCount`
in P18/P22/P15 owners rather than adding telemetry storage here.

Quote helpers recompute the same pure generator from the same cursor and
inputs. Cancel means discard the quote. The host owns stale-quote validation,
atomic result/state installation and persistence; calling `commit` itself
does not mutate a cursor or write a save. Distinct subject keys need distinct
caller-owned ordinals. E1/P1 remains the live stream owner.

### P3 storylets: 15-line caller example, proposal only

P3's host would supply snapshot eligibility and a reviewed integer weight
recipe replacing its fractional multipliers, including an explicit quiet
choice. This sketch is not a port and was not applied to P3.

```js
import {address, drawU32, pickWeighted, peek, commit} from './src/gen_kit.js';
export function proposeStoryletQuote(root, ctx, cards, n, integerWeight) {
    const key = address('deck', {world: ctx.worldId, life: ctx.lifeId,
        day: ctx.playedDay, deck: ctx.deckId, table: 'storylets@1'});
    const cursor = {root, key, n};
    const eligible = cards.filter(card => ctx.eligibleIds.includes(card.id));
    const weighted = [...eligible, {id: 'deck.quiet', quiet: true}];
    const weight = card => card.quiet ? {weight: ctx.quietWeight, reason: 'quiet'} : integerWeight(card);
    const gen = at => pickWeighted(weighted, weight, drawU32(root, at));
    const quote = peek(cursor, gen);
    const accept = () => commit(cursor, gen);
    return {quote, accept};
}
// The host installs the returned cursor with the accepted result transaction.
// Keep the same inputs through quote/accept; the host rejects stale quotes.
```

Compatibility proposal: G1's bag is a new optional schema-1 value, not a
migration of existing cursors. Saves without it stay unchanged. A bag holds
its explicit frozen ID set; content additions do not rewrite a revealed or
partly consumed bag. A future consumer must pin table revision in its key,
keep referenced IDs resolvable, validate the state on load/import and explicitly
decide when a new table/bag starts. Schema mismatches and malformed bags throw.
No save-envelope or import migration was implemented in G1.

## Verification

| Check | Result |
|---|---|
| `node --test tests/gen_kit.test.js` | **27/27 pass**, 0 failures/skips/cancellations/todos |
| `npm test`, run once at end | **661/661 pass**, 0 failures/skips/cancellations/todos; ~31.44 s |
| `git diff --check` / staged diff check | Pass; exact staged paths checked before commit |
| Report's proposed P3 example | Exactly 15 lines; Node quote/accept smoke passed |

Focused coverage: repeated calls, independent subject addresses, world/life/
revision scope, recursive object order, supplementary-character code point
sort with locale calls forbidden, P1 arithmetic and surrogate difference,
empty/zero/integer-weight handling, duplicate/overflow rejection, exact
multiply-high boundary/population proof for all `n=1..31`, a 20,000-root
weighted and seven-bucket sweep (bands ±0.015 and ±0.012), and a 6,000-root
stratified sweep (rare share 0.25 ±0.025, exactly unchanged category receipts
with 50 extra items). Bag coverage spans 30 complete cycles and 32 JSON
save/reload/import replay steps. Retry aggregate check: six fallback uses and
26 candidate attempts across ten calls. Quote cancellation, commit replacement
and JSON replay are exercised. Three literal goldens use roots `0`, `1234`
and `village/world:7/life:2` (`tests/gen_kit.test.js:294-309`).

The mathematical bias check covers the uint32 input domain through exact
bucket boundaries, not a four-billion-draw brute-force run. Seed bands are
finite source checks, not a proof of ideal randomness. JSON replay tests are
kit-level serialized-state checks, not native game Save/Export/Import proof.
Full suite log: `/tmp/yairpg-gen-g1-2026-10-14-npm-test.log` (ephemeral).

## Remaining gate and ownership

**UNKNOWN:** live consumer behavior, native persistence and playable acceptance.
Root review and a separately authorized consumer port are the next gates.
Do not describe this helper-only slice as implemented gameplay. No merge or
push is authorized by this lane. See [G2](../g2/) for conformance auditing,
[G3](../g3/) for tables/overlays, and existing [E1](../../../../emergent/E1_SEEDED_STREAMS.md)
for stream authority. A2 owns tags, A5 determinism harness/ratchets, P18
headless story QA, P32 detail budgets, P22 director tools and P15 batch lint;
this kit gives those owners hooks without duplicating their work.

Commit: `adaa4e18` (`Add pure addressed generator kit and tests`) on
`gen/g1-kit`. Exactly `src/gen_kit.js` and `tests/gen_kit.test.js` committed;
no co-author trailer. Final worktree state checked after commit.
