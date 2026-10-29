# KN1: observer knowledge and current intentions

Status: **implemented, below floor**. Synthetic engine and native headless
fixtures are agent-verified, not human-reviewed. [Brief](KN1_BRIEF.md);
mandate: [MF1 L5](MF1_AUDIT.md#d2-proposed-ranked-build-order-at-most-eight-lanes).
No commit, staging, stash, reset, force, push, private-pack change or player-save access.
The brief's scope line calls its grant L4; its mandate and exact inference paths
identify L5. Those exact paths control this delivery. DV1's existing receipt is
preserved with an added pointer rather than replaced.

## Direction, ownership and seam

PROJECT's lead-first life, source choices and broader-world direction remain
unchanged. Relevant reviewed gaps distinguish fragmented recollection from
reading a physically present text, uncertain hypotheses from discovered facts,
and postponement from a decorative receipt. No canon row was authored or adopted;
no replay conversion estimate is claimed. Applies: AR1-AR16, AD6-AD8,
AD36/38/43/45, CLR1-CLR13, LSD139; MD1-MD3 remain proposed guidance.
MR truth/preview/conservation principles are respected; this slice makes no
product, consumes no stock and grants no skill or body effect.

Owned files are `src/cast_inference_adapter.js`,
`tests/cast_inference_adapter.test.js`, this receipt,
[KN1_INTEGRATION.patch](KN1_INTEGRATION.patch), and the additive pointer in
[DV1_CHECKPOINT.md](DV1_CHECKPOINT.md). Other shared source files are read-only.
One leaf, zero imports, zero added cycle edges, zero composition-root/save-writer
changes. The prepared patch extends the existing cast registry's command list at
one registration site. Simulation owns time, reservation, completion and refund;
existing actor facts own current intention/phase; observer knowledge owns beliefs
and provenance. There is no new goal engine, clock, location store or save slice.
No random draw occurs. A future stochastic interpretation needs an owned keyed
address under LSD139, rather than an evaluation-order draw.

Default: a source-supported thought uses held observer evidence and creates a
qualified belief, then an intention. Dial: uncertainty, evidence requirements,
revision and postponement are authored per chain. Reason: incomplete evidence
supports a person's decision without establishing world truth. Another world can
replace this leaf's policy without replacing knowledge, simulation or persistence.

Target UI: the existing place-panel disclosure at **1920x1080 desktop**.
Expected visible outcome: Thoughts and intentions, tagged Your thoughts, shows
meaning, minutes, no stock cost, current intention, received records and blocked
feedback. Mobile optimization is deferred. The patch includes the new perspective
family and its pinned expectation. Headless DOM proof does not establish desktop
layout or rebuilt-browser behavior.

## CLR2 probe and pack contract for the row lane

Existing C1/C15 carriers were source-inspected: native timed jobs, supported
completion/refund and observer-attributed recollection/instruction/inference
records are present. H2/D2/T2 and the integrated DV1/MK1 pattern supply host,
projection, Reports and exact-validator joins. Relevant private reviewed gap
paraphrases were read, including recall, fragmented memory, uncertain planning
and postponed attempts; no source acquisition or paragraph reread was performed.
Probe expectation was carrier inventory, not a numeric coverage gate. Observed:
all required carriers, zero existing inference adapter/rows adopted by this lane.

Optional pack field: `inferences: {chains: [...]}`. Absent/null data produces no
commands, facts, records or disclosure. Empty chains also stay silent. Public
schema words are generic; source identities, contents and locators belong in
private rows. The executable synthetic example is `exampleChain` in the focused
test. The test also compiles reading and testimony variants through the real
`createSimulationRegistry` and checks JSON round trips.

| Shape | Fields and meaning |
| --- | --- |
| Chain | Required unique `id`, `label`, `description`, `steps`. Optional `place`, native `requires`, `locator`. Binding supplies `worldId`, actor (default player), group, existing situation and optional common requirement. |
| Step | Required unique `id`, `kind`, `label`, `description`, positive integer `minutes`, source-supported `report`. Optional native `requires`, `sourceId`, `uncertainty`. No arbitrary effects/costs or ownerless state changes. |
| Evidence | Nonempty `evidence: [{key, value}]`, where key is an existing knowledge key in this observer's records and value is its exact held text. Admission and completion require those records. Another person's records or hidden facts do not supply this evidence. |
| Content steps | `recall`, `testimony`, `read`, followed by `infer`, then `intend`. Each has held evidence; infer also requires stated `uncertainty`. Read requires `sourceId` and explicit access/comprehension support in `requires`. Recall retains a recollection basis; read/testimony retain instruction basis and evidence references. |
| Plan controls | `postpone`, `resume`, `cancel`, after the intention in row order. Postpone requires active, resume requires postponed, cancel accepts active or postponed. Controls leave the thought phase intact. |
| Saved output | `inference.<chain id>.<step id>` observer knowledge; actor `inference.<chain id>.phase`; actor `inference.<chain id>.intention` = considering/active/postponed/cancelled. Existing Reports publish received records once per native cause. |

Rows must contain JSON data: omit unknown optional fields, use no `undefined`,
no empty requirement lists and no invented amount/price. There are no fare or
stock-amount fields in this bounded schema. Main steps run in authored sequence;
restarting evidence consideration changes the current intention to considering,
so an older active intention cannot bypass the new decision. Ordinary interruption
or lost support awards no knowledge. Each admitted job has its native stable cause;
preview grants no early knowledge and performs no draw.

A downstream native topic/action binds the actual gate, for example:

```js
{all: [
  {fact: 'actor.inference.fixture.thought.intention', op: 'eq', value: 'active'},
  {fact: 'knowledge.inference.fixture.thought.infer.value', op: 'eq',
   value: 'I think the left sample may be safe.'}
]}
```

The native fixture's topic reads that gate and publishes a real conversation
receipt. Postponing/cancelling closes it; resuming reopens it. Belief leaves the
opposite world fact unchanged and is not delivered to the other participant.
This is a consumed decision, not an unbound plan meter.

Known limits: recall starts from an already held memory fragment; this adapter
does not reconstruct missing memories. Testimony starts from received evidence;
a message/delivery owner must supply new testimony. Reading records supported
contents with access/comprehension requirements, without claiming native book XP
or fluency. Those remain the native reading/learning owner. New recall/reading
facts cannot be invented to fill absent paragraph support. A pending job needs
its exact matching pack definition; pack-loss recovery is not extended. Revision
uses explicit reconsideration, not a generalized planning scheduler. L4 can hand
an observer's received signal key to the same evidence contract; L6 can consume
the active intention gate. No L4/L6 files are changed.

## Prepared integration and compatibility

Coordinator applies/rebases [KN1_INTEGRATION.patch](KN1_INTEGRATION.patch):

1. Cast host imports the leaf, reads `pack.inferences` at derivation, extends
   `installCast`'s existing command list, exposes quotes, and includes pending and
   settled Reports. Shared lines touched: imports/offer export, derive, install,
   sync-due/sync and persisted-report aggregation.
2. Domain host imports offers/commands, projects offers through existing native
   preview/canon/sleep/write checks, includes jobs and the returned `inferences`
   family. Its existing `act` already commits through the registry.
3. State validator includes exact inference jobs in optional-owner and definition
   lookup, plus exact completion-support comparison. Costs/effects validation is
   retained. No validator bypass or permissive migration is added.
4. Existing UI disclosure and perspective inventory/test receive the new family.
   No main, display, save writer, CSS or new navigation path is required.

These are prepared hunks, **not applied in the shared checkout**. A concurrent
source lane may alter the same host contexts; coordinator rebases the second
patch. Existing saves with no inference data remain valid and acquire no seeded
progress. New state uses the same existing facts/knowledge/jobs and save envelope,
so no schema migration is needed. Disposable fixtures copy live source, use it
when `git apply -R --check` succeeds, and apply the patch when it is not integrated.
They also check reverse application after preparation. Real player saves stay untouched.

## Checks and floor

Final check results and input identity follow below. All native evidence uses a
named synthetic two-person pack, seeded fragmented memory and supported topic.
Full suite and rule gate belong to the coordinator; this lane changes no rules.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_inference_adapter.test.js` | PASS 5/5, final run 35.4s: preview purity, held evidence, no early result, qualified belief, observer isolation, unchanged truth, real action gate, postpone/resume/cancel/reconsideration, lost support/cancelled work, reading/testimony variants, JSON-safe native registry definitions, malformed-row rejection; native pending/settled Save/reload/Export/literal Import and exact effect/support tamper rejection | Synthetic/headless, no canon rows, natural journey or desktop browser |
| Disposable fixture: `npm run build` with `BUILD_OUT=<copy>/candidate` | PASS; final bundle SHA-256 `bf3147ef75affcb53f40223c6e5e962abbac3a3cec1fa7bb230f9738361d2a69` | Prepared patch applied in disposable copy; fixture copy removed after test; shared dist untouched |
| `npm run check:arch`, shared checkout | PASS; main -51, display -37, save writer 0 relative to baseline; 6 grandfathered imports, 205 cycle edges | Shared concurrent inputs, no combined release claim |
| Disposable fixture: `npm run check:arch` | PASS; main -46, display -37, save writer 0; 6 grandfathered imports, 205 cycle edges | Five extra main lines are fixture exports in disposable copy, absent from prepared patch |
| Disposable fixture: `node --test <copy>/tests/perspective_controls.test.js` | PASS, patched inventory and pinned inference family | Headless/static inventory, no visual proof |
| `git apply --check --whitespace=error .../KN1_INTEGRATION.patch` | PASS against shared source; disposable fixture also verifies reverse-clean application after preparing the patch | Final runtime run used forward-application route; already-integrated detection is present but was not the initial shared state |
| `node scripts/lane_review.mjs` with all five exact grants and owned paths | Scope/TLA PASS: 0 outside grant, 0 top-level await; scanner exits 1 for one test file among 2 source/test files, 2,896 private names | Manual exact-match review found generic words world, future and gate; no canon identities/content. No scanner bypass or scanner edit |
| Python owned-file whitespace/local Markdown-link check; scoped `git diff --check` | PASS | Patch check inspects added lines; unified-diff context prefixes retained |
| Full `npm test`, `npm run check:rules`, rebuilt 1920x1080 desktop route | Not run by lane | Coordinator combined checks and desktop evidence |

Initial fixture errors were corrected: the synthetic downstream command omitted
its required refund cancellation setting; the disposable copy omitted the
perspective test file required by the prepared patch. Neither failure weakened
production validation. Final review also retained false requirements for native
rejection instead of filtering them away, with a regression.

Input: shared HEAD observed `ffd9150326441acdf8b7099608066a5f676b10d2` plus
concurrent dirty work and these owned changes. Final owned runtime inputs:

| Path | SHA-256 |
| --- | --- |
| `src/cast_inference_adapter.js` | `f23901665ee4990502aab9f28a0664f4a86a2d108c10af401e3a2632c3af996e` |
| `tests/cast_inference_adapter.test.js` | `25228d89000476e69aa5386de908ffd36fe7139ffdc850baed6bd79c0d828206` |
| `KN1_INTEGRATION.patch` | `4a92227977845edc2ed737600922bc1f972892af4db69a4b7a04647cd57ddf27` |

- **FLR1:** disposable integrated build passes, hash above; not browser-proven.
- **FLR2:** named synthetic memory-to-thought-to-topic route passes in native
  headless host; natural earned route and rebuilt desktop browser remain open.
- **FLR3:** native UI controls, perspective, disabled feedback and no early belief
  pass headless checks; populated 1920x1080 desktop visibility remains open.
- **FLR4:** existing topic consumes the belief/current-intention predicates;
  postponing/cancelling blocks it, resuming enables it, execution writes a real
  conversation record. Pure knowledge does not mutate truth or another observer.
- **FLR5:** real validator passes pending and settled Save/reload/Export/literal
  Import; pending identity and cancelled/postponed intention survive; tampered
  effects/support rejected. No new slice or save writer.
- **FLR6:** agent-verified synthetic engine/native fixture, not human-reviewed;
  **implemented, below floor**. No integrated live-pack or whole-book replay claim.

Ownership released to coordinator. Remaining authoritative acceptance is the
coordinator's combined candidate with the prepared patch and supported private
rows, required combined gates and rebuilt desktop sampled route. Human review
is optional under AD42. This receipt selects no further work or publication.
