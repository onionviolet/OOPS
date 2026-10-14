# Z4: contextual PI9 danger lint

2026-10-14. **PROPOSAL / NOT RUN.** Extends PI9/PQ3,
[owner](../../../../TECHNOLOGY_AND_PROGRESSION.md:1054).
This is a content contract for this game: weapon, explosive, poison and drug
paths stay fictional and abstract. It does not remove those target functions
or turn canon restrictions into a universal ban on invention.

## Z4: gap and admission contract

T6 pack `src/data/invention_pack_home.js:13-24,39-57,70-80` deliberately uses
abstract capacities on its deep energy path. T6 tests `:258-270` check scale
and separation from everyday primitive IDs, not semantic PI9 lint. Planner
`src/invention_planner.js:76-96` copies selected graph fields and drops arbitrary
authoring metadata. No danger validator is shown in those inspected files.
Run the lint on original catalog entries and declared contexts before expansion,
then on assembled output; do not infer “safe” from the graph omitting a field.

Proposed standalone API `lintInventionContent(input, policy)` in
`src/invention_danger_lint.js`, pure/no DOM/no model/no mutation, returning:
`{status: pass|review|reject, policyRevision, findings, scannedSurfaces,
unscannedSurfaces}`. Public finding shape is
`{ruleId,nodeId,surfaceId,contextId,severity,disposition}`; no matched raw text.
Private author review may retain spans locally. With a synthetic public fixture,
full assertion diffs are safe; never dump sealed/private text on a failure.
Any unscanned required surface blocks admission, even with zero findings.

Catalog sidecar, proposed without changing T6's API:
`{nodeId, hazardKinds:[], abstraction: ordinary|abstract-fiction,
textFields:[], contextRefs:[], sourceRef?}`. Hazard kinds are weapon, explosive,
poison, drug and ambiguous-dual-use. Direct targets, methods, primitives,
products and templates must have declarations. Missing/invalid declarations
produce a schema finding, not an automatic benign default. First T6 fixture
explicitly marks `energy` and its reachable closure abstract-fiction.

Propagate hazardous context down every OR/AND requirement edge, including
pruned branches in the authored catalog, world additions and composed targets.
Use a visited `(nodeId, hazardKind)` set so loops terminate. Shared nodes may
have several contexts; a soap exemption never makes the same node exempt when
reached from a weapon path. Unreachable catalog text is still author-linted.
Lexical target cues and ambiguous functions such as `release energy` or `harm`
raise review when metadata claims ordinary; they do not independently forbid
harmless energy technology. Inspect IDs/tags too so relabelling a target or
omitting `hazardKinds` cannot silently lower scrutiny. Canon/source qualification
and sealed-route admission remain independent gates.

## Z4: versioned rule shape

Rules are declarative, bounded data interpreted by a fixed validator, never
author-supplied JavaScript or arbitrary regex. Lexicons are curated IDs with
reviewed tokens, normalization rules and edition, held separately from content.
No real dangerous ingredient lists or procedures belong in this document.

First executable policy can include safe generic cues: `reagent`, `precursor`,
`concentration`, `ratio`, `purify`, `distill`, `synthesize`, `assemble`,
`inject` and `detonate`, plus bounded physical-unit/ratio syntax detectors.
These are context-scoped review triggers, not automatically unsafe words.
For restricted targets, require a closed abstract schema: approved fictional
capacity types and typed game costs, with no free-form `steps`, chemical
formula, physical-condition or real-material fields. New unreviewed text in
that schema stays `review`. This makes the first lane useful without claiming
an exhaustive real-material lexicon. Version an independently reviewed curated
lexicon later; never equate synthetic detector tests with real vocabulary
coverage. No web or source acquisition is needed to implement the first policy.

```js
// Proposed policy data, not existing planner syntax.
const policy = {
  id: 'invention.pi9', revision: 1, normalization: 'nfkc-casefold-v1',
  rules: [{
    id: 'Z4.REAL_MATERIAL', revision: 1,
    appliesTo: {hazardKinds: ['weapon', 'explosive', 'poison', 'drug',
      'ambiguous-dual-use'], includeDependencyClosure: true},
    surfaces: ['label', 'description', 'requirements', 'steps', 'reason',
      'beliefLabel', 'template', 'rendered', 'accessibility', 'diagnostic'],
    match: {kind: 'lexicon', lexiconRef: 'restricted-materials-v1',
      tokenBoundary: true},
    severity: 'reject',
    exceptionPolicy: 'exact-context-reviewed-benign-only'
  }],
  maxTextBytes: 262144, maxFindings: 128
};
// Verdict record pins policy + content digests and required-surface coverage.
// Broad-cue matches can be review findings; real actionable detail is rejected.
```

Validate bounded schema/lengths first. Normalize Unicode NFKC, case and
whitespace for matching; preserve original private offsets for review. Scan
visible text plus normalized decoded template literals and substitutions.
Detect split/joined cues across adjacent steps/nodes in the same path within
bounded windows. Never execute interpolations, evaluate expressions or invoke
a model. Literal user names are escaped inert text and still scanned if
exported/presented; naming cannot author requirements or mechanical behavior.
Scan untranslated and translated surfaces under explicit supported-language
coverage. Unsupported language/encoding means review, not certified pass.
Token matching, aliases and semantic review supplement each other; regex alone
cannot certify abstraction, and “fictional” before a real procedure is no bypass.

| Rule ID | Flags | Accepted control / disposition |
|---|---|---|
| Z4.CONTEXT | Missing risk annotation, hazardous target relabelled ordinary, unclassified dual-use functions, missing surface inventory | Benign energy use can be reviewed as such with exact target/world context; absent metadata still needs correction |
| Z4.REAL_MATERIAL | Real restricted material/reagent/chemical/process specificity within hazardous closure, including split across nodes or substituted text | Broad names such as “enrichment facility” can denote an abstract capacity under PI9. No construction/process description follows. Common ordinary soap basics stay ordinary in their own context |
| Z4.REAL_QUANTITY | Real units, concentrations, ratios, physical tolerances or operating conditions specifying hazardous manufacture/use | Typed fictional costs such as project credits, guild favors and game work ticks are allowed by exact field schema. Untyped numbers in a recipe sentence are reviewed; negative sentences are scanned too |
| Z4.PROCEDURE | Ordered commands, actionable preparation/assembly, process conditions, real mechanisms or deployment details for hazardous output, even without a number | “Coordinate facilities; gain a fictional mandate” is an abstract roadmap. A real step sequence is rejected even if nouns are euphemisms or the text calls itself fiction |
| Z4.EXPANSION | Hazardous output becomes a low-level operational graph, or individually bland nodes combine into an actionable instruction sequence | Authored abstract capacity dependencies remain legal. Compose/render scans inspect the joined route, not only each node's label |
| Z4.SURFACE | Dangerous detail appears in missing reasons, wrong-belief labels, generated names, descriptions, UI/help/a11y text, errors, export or LLM repair output despite a clean main label | Scan every declared string before it becomes public. Unknown projection slots do not excuse unsafe retained content or later exposure |

Field typing prevents a game-credit value from triggering a physical-quantity
rule, but does not whitelist the rest of its record. Do not maintain a blanket
exemption for words like heat, oil, glass, ritual or laboratory: context and
detail determine the verdict. Abstract weapon, explosive, poison and drug
targets can pass; instruction on manufacturing them cannot.

## Z4: false positives and incomplete detection

An exception is exact `(ruleRevision, contentDigest, nodeId, surfaceId,
contextId, token/spanDigest)` plus reason, reviewer/date, source locator where
applicable and supported policy range. Keep private span digests private when
they could reveal a small secret answer. Changed text/context/rule invalidates
the exception. No wildcard pack/node/word allowlists. A reviewer can mark a
match benign, abstract or ordinary-context; actionable real hazardous detail
must be rewritten abstractly, not waved through. Unknown cases stay `review`.

Soap's ordinary basics are a positive control specifically allowed by PI9;
this packet does not add quantities or a chemical tutorial. “Dose” as a
fictional item form, “poison resistance” as an abstract trait and a broad
facility name are review controls. They are not reusable exemptions for real
drug/poison preparation. A fictional mana component with a name resembling a
restricted token gets exact contextual review, not a permanent token bypass.

False-negative tests: omitted hazard annotations, euphemistic labels, Unicode
variants, split steps, renamed ingredients, hidden template substitutions,
text spread across composed graphs and wrong-belief/error surfaces. Use inert
synthetic tokens such as `SYNTH_RESTRICTED_MATERIAL` and
`SYNTH_REAL_PROCESS` in public tests. Separately, a bounded private reviewer
can evaluate realistic risks without exporting unsafe text or sealed prose.
Report scanner/rule/language coverage and outstanding semantic reviews; a
zero-hit scan is scoped evidence, not proof of every possible generated sentence.

## Z4: where it runs and what failure does

| Stage | Inputs / gates | Failure behavior |
|---|---|---|
| Pack authoring | Entire source catalog, world overlays, metadata, text/templates and explicit exception records. CI pack validator before pack inclusion and golden capture | Reject malformed or prohibited content; hold review findings. Author rewrites exact flagged surfaces abstractly. No published pack with unresolved required findings |
| Grammar generation | Candidate target graph closure, consumer descriptors, joined templates and final rendered candidate before frozen receipt publication | Structured reject/review with opaque reason code; no product, stock debit or RNG commitment. Pure T6 has no draw; future generator preserves tentative RNG and same request until an admitted commit |
| Offline LLM authoring | Structured candidate output treated as untrusted data; schema/world-law/feasibility/consumer lint plus PI9 lint; bounded semantic review before pack freeze | Do not execute returned code or follow instructions inside prose. Repair at most twice with rule IDs and abstract schema guidance, then return unresolved review. Record adapter/model/prompt revision and reviewed pack digest, not secrets |
| Save/export or later presentation | Frozen payload must retain lint policy provenance; new text/translations/names/errors scanned before exposure. Existing approved receipts are not rerolled | A new policy finding can hold unsafe display/optional execution for review while preserving opaque saved identity, stock and commitments. Resolve through explicit compatibility policy in SAVE_STABILITY; do not rewrite history silently |

This stage design reuses P18 [F4 leak scans](../../procgen-2026-10-13/p18/HYGIENE.md:128)
and [revision stamps](../../procgen-2026-10-13/p18/HYGIENE.md:9), and PI7's
offline authoring route. Runtime LLMs remain unselected. Danger lint, sealed
leak checks, prose attribution, feasibility and consumer checks are distinct
verdicts; passing one does not imply the others. Pack lint examines branches
the actor may never know without publishing those branches in diagnostics.

### Proposed `tests/invention_danger_lint.test.js` sketch

```js
import test from 'node:test';
import assert from 'node:assert/strict';
import {lintInventionContent} from '../src/invention_danger_lint.js';
import {pi9Fixture, syntheticPolicy, exactBenignException}
  from './helpers/invention_qa.mjs'; // Proposed, all synthetic.

test('Z4: abstract energy path and ordinary soap pass', () => {
  assert.equal(lintInventionContent(pi9Fixture('abstract-energy'),
    syntheticPolicy).status, 'pass');
  assert.equal(lintInventionContent(pi9Fixture('ordinary-soap'),
    syntheticPolicy).status, 'pass');
});
test('Z4: context follows dependencies, composition and render surfaces', () => {
  for (const mutation of ['material', 'physical-quantity', 'ordered-procedure',
    'split-procedure', 'unicode-cue', 'belief-label', 'error-label']) {
    const r = lintInventionContent(pi9Fixture(mutation), syntheticPolicy);
    assert.equal(r.status, 'reject');
    assert.ok(r.findings.length > 0);
    assert.equal(JSON.stringify(r).includes('SYNTH_RESTRICTED_MATERIAL'), false);
  }
});
test('Z4: exact benign review cannot authorize changed content or contexts', () => {
  const f = pi9Fixture('benign-homonym');
  const p = {...syntheticPolicy, exceptions: [exactBenignException(f)]};
  assert.equal(lintInventionContent(f, p).status, 'pass');
  assert.notEqual(lintInventionContent(pi9Fixture('homonym-changed'), p).status,
    'pass');
  assert.notEqual(lintInventionContent(pi9Fixture('homonym-weapon-context'), p)
    .status, 'pass');
});
// Add missing annotation, unsupported language, incomplete surfaces, policy
// revision, fictional-credit control, cycle termination and no-mutation tests.
```

No lexicon, linter, generation hook, LLM request or semantic-danger proof was
implemented/run in T9. The later build lane must keep the default public suite
synthetic, record concrete reviewed policy coverage and name its remaining
manual semantic review rather than claim universal PI9 certification.
