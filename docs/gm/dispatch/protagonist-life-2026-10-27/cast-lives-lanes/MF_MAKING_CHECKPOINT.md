# MK1 / MF1 L3: making bridge

Status: **implemented, below floor**. Synthetic engine and disposable native
fixtures; no live pack adoption or desktop browser claim. No commit, staging,
stash, reset, force, push or player-save access. Public, name-free code and tests.
Authority: [MK1 brief](MK1_BRIEF.md), [MF1 audit](MF1_AUDIT.md#d2-proposed-ranked-build-order-at-most-eight-lanes),
PROJECT's lead-life direction and USER_VISION. This leaf changes no direction.
Rules: AR1-AR16, MR1-MR36, AD36/AD38/AD43/AD45, CLR1-CLR13 and LSD139;
MD1-MD3 remain proposed guidance. Prepared UI follows
[the player UI rule](../../../../../.claude/rules/player-ui.md), UR42/UR70-UR75.

## Probe and fit

F1: Live private pack probe: `making` absent, 0 making rows; incumbent
`householdActs.acts` 503 and `topicTalks.talks` 64. Expected: absent making rows
produce zero commands. Observed: zero. These are inventory counts, not threshold
gates or a new replay score. Reviewed records inspected: RV6's text/language gap,
RV7's ingredient preparation gaps and RV9's later preparation/other-actor gaps.
The relevant private paraphrases require stock, transformation, correct actor,
and order. No book acquisition, fresh chapter reading or private-row writes.
No candidate step is claimed covered until a supported private row is adopted.
The audit's 8-20 target remains an estimate; measured new coverage is 0.

F2: Default: a known fixed recipe compiles a preparation job, creates an existing
inventory item standing for the whole resolved batch, then a separate use job
consumes that item. Dial: source-supported selections, recipe selectors, ordered
process, required conditions, apparatus and world law. Reason: materials and
actual means determine the batch. Recipe access does not grant a capability.
Native crafting's broader experiment routes remain with their existing owner.
This first slice models atomic preparation; interrupted uncommitted work returns
reserved ingredients, retains elapsed time and grants no product. Cancellation
of a use returns its reserved product. Completed preparation is not undone.

F3: Reused carriers: C7 `defineRecipe`/`recognizeRecipe` and `resolveBatch` resolve
multi-slot quantities, catalysts, actual process and law revision. C8's product
key classifier keeps generated references with their existing frozen-product
owner; this slice binds ordinary native item keys to a fixed resolver identity
and rejects contradictory key/batch bindings. C10 `defineProcess` supplies the
process envelope; the existing simulation C1/C2 owns quotes, time, reservation,
refund, completion and effect transactions. C9's inspected native craft machinery
is location/world-bound, so it is not copied or invoked as a second transaction.
C11 ingestion stays with its existing command: an optional external consumer
must actually reserve this exact item, verified during host registration.
Authored allocation flags can be emitted with the item through actor fact effects.
No C11 capability, progression or new ingestion policy is minted by making.

F4: Known limits and expected replacement: generated products need the existing
crafting owner generalized beyond its current world, with frozen product/law
persistence, native item publication and revision validation. That is coordinator
work in the crafting domain/save ports, not a new store in this leaf. Staged
cooking with committed intermediate matter, held firing/spoilage and multi-stage
resume needs that same craft activity owner; these source rows remain gaps.
Translation needs a text/language owner. Other-actor preparation needs that
actor's admitted command and the lead's separate perception. Unknown amounts,
minutes, prices, inputs, outcomes and body benefits stay absent. When physiology
is not bound, use may record an authored fact with a named downstream owner;
that alone does not establish recovery or fulfil FLR4 for that content row.

## Pack contract and row-lane handoff

Pack field: **`making`**, additive and optional. Shape:

```js
making: {
  schema: 1,
  catalogue: /* defineCatalogue spec, authored material revisions/properties */,
  laws: [/* defineCraftLaw specs without catalogue; bound locally */],
  rows: [{
    id, revision, label, description, report, place, minutes,
    knowledgeKey, // actual actor instruction required at admission/completion
    law, // exact ref, e.g. "fixture.law@1"
    recipe: /* defineRecipe spec, same law ref */,
    inputs: [{key, material, qty, role, label}],
    // key is a complete JSON inventory key; material is a catalogue id.
    // role is consumed (default) or catalyst; label optional display wording.
    process: [{op, level}], stations: [], requires,
    product: {key, label, consumer, effects},
    // One item represents the entire batch, not a fabricated portion count.
    // effects: optional existing actor fact effects for allocation.
    // consumer: optional existing consuming command instead of generated use.
    use: {label, description, report, minutes, requires, effects}
  }]
}
```

Supply `use` or a real `product.consumer`. A generated use spends one whole
batch and supports authored vital, fact, knowledge or condition effects on the
maker. Output-derived vital effects use
`{type:'vital', key:'health', output:{route:'oral',effect:'health'}}`; their numeric
amount comes from the resolved law. This is not permission to infer a healing
amount from cooking prose. Knowledge effects need their evidence basis. The use
has its own support requirements; it does not require the preparation apparatus.
Source locators, instruction wording, identities and evidence remain private.
The synthetic complete example is `data` in `tests/cast_making_adapter.test.js`.
A second recipe uses different conserved input quantities and a fact consumer.

A1: Row lane supplies supported private rows plus source/timing provenance and
existing inventory/template bindings; no seeds, substitutions, stock or effects
are invented by this adapter. Explicit source minutes or labelled source-supported
fills must be settled by the row reviewer before publication. Default/dial/reason
and fold-loss review remain per paragraph.

A2: Coordinator applies `MK1_INTEGRATION.patch` to current source, reconciling
concurrent changes. It adds the leaf to cast-host registration, uses the existing
host admission/persist path, validates pending definitions/support in the real
validator and exposes a making disclosure in the existing place panel.
It also exposes cancellation for these jobs through the existing cancel path.
No already-integrated H2, D2 or T2 patch is applied. If external consumers are
named, register them before `installCast`; it checks their actual item cost.

A3: Coordinator checks private row/item/law/actor bindings, applies combined
completion gates, then exercises a rebuilt fresh-origin **1920x1080 desktop**
journey. Visible outcome: "Making · Your preparation", authored description,
stock cost, minutes, blocked feedback, product and its use. Mobile deferred.
No new panel, navigation, CSS, main.js registration, clock or save slice.

## Checks and floor

Final results are recorded below. Owned paths are released to the coordinator; no MK1 process remains active after the completed test run.

- FLR1: disposable patched game build, hash recorded below; built, not browser-proven.
- FLR2: named synthetic engine/native fixtures; natural source journey pending.
- FLR3: native headless disclosure, perspective tag, duration/cost and blocked use;
  rebuilt desktop layout/interaction pending.
- FLR4: ingredient stock, actual product consumption, resolved native health and
  second recipe's stock consumption and actor fact result tested; live content binding pending.
- FLR5: pending preparation and pending use Save/reload; pending preparation
  Export/literal Import; settled used result Export/literal Import/reload;
  real validator rejects changed output and completion support.
- FLR6: agent-verified synthetic/headless fixture, not human-reviewed;
  **implemented, below floor**, not integrated in the shared host.

Owned files: `src/cast_making_adapter.js`, `tests/cast_making_adapter.test.js`,
this checkpoint, `MK1_INTEGRATION.patch`, `MK1_CHECKPOINT.md`. Every other source
file remained read-only. Prepared joins touch four host/validator/UI files;
zero core-owner edits and zero new main/save-writer/display registration lines.

| Command / input | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_making_adapter.test.js` | PASS 4/4, 42.1 s on final adapter/test/patch inputs | Synthetic engine and patched disposable native fixture; no desktop browser or live private rows. Earlier setup failures were corrected: JSON inventory keys and actual temporary item IDs are required by native inventory. |
| Native fixture: `git apply --check` then `git apply MK1_INTEGRATION.patch` in disposable copy | PASS | Prepared patch applied to the copied host, not shared source; no incumbent patch reapplied. |
| Native fixture: `BUILD_OUT=<disposable>/mk1-build node build.js` | PASS; SHA-256 `90851bdddc9b661247704511691167922335989475651c2174c6ccf999919c1f` | Built patched candidate, not desktop-browser-proven; disposable build removed at test cleanup. Headless runner separately rebuilds instrumented source for its native journey. |
| `npm run check:arch` | PASS: main -51, display -37, save writer 0 vs baseline; 205 grandfathered cycle edges | Shared checkout plus adapter; prepared host joins still coordinator-owned. |
| `node scripts/lane_review.mjs` with five explicit grants and five owned paths | Scope PASS, top-level-await PASS; publication scanner reports 2 files | Manual exact-name scan: generic `World` in API/comment terminology and `Stable` in test prose collide with private pack names. No canon-bearing content. |
| `python3` owned-file whitespace and checkpoint link check | PASS | No trailing whitespace or missing local link targets. Patch syntax/application is covered in disposable integration test. |
| `npm test`, `npm run check:rules`, rebuilt desktop browser | Not run by lane | Coordinator combined gates; no registered rules changed. |

Final input identity (shared checkout, not a clean integration commit):

| Input | SHA-256 |
| --- | --- |
| `src/cast_making_adapter.js` | `33a5745d020b992558d32638933a61922a4e0d0f283dbb18584a9c18cbe65669` |
| `tests/cast_making_adapter.test.js` | `f368a5051c04a95e141283a8728d76505a20798a7a344cda88f371be32a5cd59` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MK1_INTEGRATION.patch` | `1bf5d658a39676794b5b029c2ee589cb9875828b9c1a5e6dd867ccef29ce856c` |

HEAD at final receipt: `2824a1978f47ace6689ac20c91c30dbdf724929e` plus owned and concurrent dirty work.
