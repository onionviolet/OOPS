# G3 author-time pools, composition and text

2026-10-14. **INFERRED proposal**, extending MC1, MC3 and GR15. This lane
produces no content-generation agent batch, runtime model, compiler or lint
script. [P15 authoring pipeline](../../procgen-2026-10-13/p15/AUTHORING_PIPELINE.md)
owns batch envelopes, review workflow and QA1-QA14. Their suggested tools
are proposals too. G3 supplies table-specific inputs and impact edges to
those tools, not a competing lint system.

## P1: agent pools and admission

Use P15 B1-B5: select/freeze one supported loop → draft into quarantine →
check/repair → review in context → admit/prove. A concrete G3 batch can be
six original person templates, eight supported storylets, six supported
materials and two grammar variants for one world/era. Counts bound review
effort, not life population or final creative possibilities. An authorized
agent drafts inert pools offline; runtime picks reviewed entries, with no
text-model call and no requirement to reproduce an agent's nondeterministic
draft process. Its **admitted exact bytes** are deterministic inputs.

Batch sidecar, not an A2 entity/save extension, records:
`batchId@rev`, world/continuity/era, source pins and qualified claim refs,
creator attribution, allowed owner adapters, reserved IDs, table/query refs,
tag registry, generator/grammar versions, proposed purpose, positive/negative
witness refs, reviewer/status and manifest digest. Keep rejected drafts and
their reasons outside admitted pools; runtime never picks DRAFT entries.
Direct recreation stays under the project's private-pack policy; public
fixtures here use original content. No raw source prose enters a pool.

Review one card in its actual context: what caused it, who can act, what
stock/permission/means is required, which consequence occurs on respond/
decline/wait, and what each participant knows. A tag can route an item into
an input selector but cannot certify its recipe or effect. Source reviewers
qualify the exact selected claim, gameplay reviewers inspect real supported
consequences, and Weibao's fiction/feel acceptance stays separately recorded.
Reviewers can be the same authorized worker on a small batch; this document
does not dispatch agents or invent new approval for reversible prototyping.

## P2: P15 lint hooks

| G3 data contributed | P15 owner hook / gate |
|---|---|
| Table/view/overlay JSON and locks | QA1: strict inert parsing, duplicate keys, exact fields/schema, integer overflow, unique strata/ops and bounded size/depth. No JS draft execution. |
| Pool/type/query refs and A2 registry | QA2: resolve tag/parent closure, entity kinds/revisions, fallback, contexts, slots and owner/default refs. A2 owns cycle/implication validity. |
| Reweight/consequence and qualification | QA3/QA4: incompatible selector/gate, funded terms, unknown-aware not, item properties vs proved functions, effects matching text. Missing adapter returns UNKNOWN. |
| Query membership and compatible routes | QA5/QA6: orphan/zero-weight/banned entries, positive available stratum, fitting cast and actual way to acquire inputs. Zero-edit witness from W5; search failure remains UNKNOWN unless impossibility is proven in model. |
| Grammar and projections | QA7/QA8: bounded graph expansion, typed slots, unresolved refs, surface length, fallback, duplicate templates and voice. No gameplay meaning inferred from polished wording. |
| World tags and disclosure | QA9/QA10/QA11: source-qualified mechanics/era, claims kept separate from truth, no restricted tags/reasons/counts/order/ARIA leaks, attribution/private-pack boundaries. Use opaque ID/status diagnostics. |
| Revision/pin/luck/workload fixtures | QA12/QA13: real supported execution, preview purity, failed write, active commitment, old save/missing pack, reload/import and unchanged frozen value. A5 supplies deterministic ratchets; P18 supplies headless farms. |
| Review gallery | QA14: show knowledge-filtered choices, reasons and terms at the context of use. P22 supplies dev-panel surfaces; no new G3 UI. |

The selected builder adds thin adapters to these hooks. Do not claim
`content_batch_check.mjs` exists or require every future cosmetic edit to
run fourteen suites. Scope checks to changed dependencies and consequences.

## P3: composition graph

Manifest graph records immutable node revision, implementation/content hash,
typed inputs, outputs, actual consumer, cost bound, fallback and dependencies.
Edges say **why** a dependency can change output: `membership`, `weight`,
`cast`, `slot`, `qualification`, `projection` or `effect`. It is an
author-time dependency graph, not a new runtime scheduler or quest store.

```json
{
  "schema": 1, "id": "graph:fixture.village", "rev": 1,
  "nodes": [
    {"id": "tags@1", "kind": "registry", "dependsOn": []},
    {"id": "materials_pool@1", "kind": "pool", "dependsOn": ["tags@1"]},
    {"id": "material_view@1", "kind": "table", "dependsOn": ["materials_pool@1"]},
    {"id": "names_pool@1", "kind": "pool", "dependsOn": []},
    {"id": "person_generator@1", "kind": "generator", "dependsOn": ["names_pool@1"]},
    {"id": "request_generator@1", "kind": "generator", "dependsOn": ["person_generator@1", "material_view@1"]},
    {"id": "request_grammar@1", "kind": "grammar", "dependsOn": ["request_generator@1"]},
    {"id": "known_projection@1", "kind": "projection", "dependsOn": ["request_grammar@1"]}
  ]
}
```

This compact example shows dependency order only. Production nodes must
carry all metadata above, and edges include reason fields in an adjacent
edge list. Topological order uses dependency order then code-point node ID,
never runtime loading order. Reject generator dependency cycles. A permitted
recursive grammar must declare bounded depth/expansions and terminal fallback
under QA7; it cannot recursively generate people or quests. Runtime callback
or relationship cycles are domain history, not compilation dependencies.

Maintain a derived query-dependency index by pool kind, positive **and
negative** tag refs, A2 implication closure, requires fact readers and slot
refs. Adding an item invalidates affected material views and all actual
downstream input readers even though their files did not change. A new tag
parent can affect both positive membership and exclusion. Conservatively
invalidate an entire typed pool when dependency analysis is UNKNOWN. The
index is disposable cache, not a second tag registry.

Reverse traversal yields impact set and minimal test refs. Examples:
names-pool change → person generator → request cast/name slots → request
goldens/projections; a material addition → supply view → requests/jobs using
that selector → their goldens and acquisition witnesses; a renderer escaping
change → projection/surface tests only if slot semantics stay unchanged.
Frozen values are protected by locks, not recreated by this invalidation.

## P4: GR15 fact-ID grammar

Text selects reviewed grammar structure at occurrence admission, saves its
grammar revision/variant and typed slot references, then renders through the
observer's current knowledge. The selection does not spend a new text draw
when a panel opens. Domain readers consume slot IDs/facts, never prose.

```json
{
  "schema": 1, "id": "grammar:fixture.material_request", "rev": 1,
  "variants": [
    {"id": "ask", "weight": 1,
     "parts": [{"slot": "speaker"}, {"literal": " asks for "},
       {"slot": "quantity"}, {"literal": " of "}, {"slot": "good"}, {"literal": "."}]}
  ],
  "slots": {
    "speaker": {"type": "entityLabel", "unknown": "Someone"},
    "quantity": {"type": "frozenInteger", "unknown": "an unspecified amount"},
    "good": {"type": "entityLabel", "unknown": "an unfamiliar material"}
  },
  "maxExpansions": 16, "maxCharacters": 240,
  "fallback": "grammar:fixture.unresolved_account@1"
}
```

```json
{
  "schema": 1, "id": "text:fixture.request12",
  "grammar": "grammar:fixture.material_request@1", "variant": "ask",
  "basisRef": "claim:fixture.request12@1",
  "slots": {
    "speaker": {"entityRef": "person:village.mender", "incarnation": "fixture:life1"},
    "quantity": {"factRef": "terms:fixture.request12.quantity", "value": 2},
    "good": {"entityRef": "item:village.rush", "definitionRev": 1}
  }
}
```

This is a synthetic material request, separate from W2's cloth repair. The
typed fact ref binds frozen committed quantity; it is not a dotted live fact
whose later edits alter the owed amount. Actual claim owner controls speaker,
assertion/basis/confidence and who received it. The text token stores no
hidden identity label or raw truth-property value. No slot may expand a
hidden field merely because the generator could read it.

Example projection: first render uses an actually introduced speaker label
and the known good label; an unknown item uses `an unfamiliar material`.
After learning its name, every ordinary request/log projection resolves the
same good ID to that known label. A supported person rename also propagates;
aliases are observer-specific and refer to the same incarnation. Neither
change modifies original request terms or grants knowledge to its speaker.
Claim text remains an account, possibly wrong; renderer never fills a rumor
slot with a truth fact to make the rumor accurate.

Escape all literal/slot text for the output surface. No raw HTML, arbitrary
property path or function slot. A knowledge adapter decides accessible
grammar branch/labels **before** surface rendering; inaccessible branches
cannot leak through differing tooltips, counts, sort keys or failure text.
An unsupported/missing slot yields its reviewed neutral fallback and opaque
diagnostic, never auto-generated lore. Too-long text fails lint or uses a
complete neutral template; it cannot truncate costs/conditions into false
terms. Selected actionable text must have all terms known before commitment.

Only an actual in-world letter, engraving or other authored document freezes
the rendered surface at inscription, with author, language, time, original
slots, knowledge basis and owner/custody ref. Later identification/translation
is a separate annotation, not rewriting the original. A log line or UI receipt
is not automatically an in-world document. Grammar correction affects new
occurrences; frozen active text keeps its old grammar artifact unless an
explicit compatibility map safely preserves bindings/terms.

## P5: G1 bindings seen during this run

**SHOWN, provisional working-tree source**, read at
`.claude/worktrees/gen-g1-kit/src/gen_kit.js`; G1 was still running, so these
are integration leads, not a merged/accepted API or G3 test evidence. The
[G1 report](../g1/REPORT.md) subsequently appeared, citing commit `adaa4e18`.
G3 does not inherit its test counts or assert integration from that report.

| Source locator | G3 binding / remaining adapter |
|---|---|
| `:44-45`, `:65-67` | address(parts) and drawU32(root,key). Include world/life, logical subject, effective lock, game-time window, slot and attempt. Human-readable receipt address can remain separate from encoded draw key. |
| `:96-105`, `:109-122` | pickWeighted accepts `{weight,reason}`; pickStratified takes category arrays and addressed slot callback. It removes empty categories, matching renormalize. For fallback-share mode, call its weighted category pick first, then its item pick or named no-result; do not fork its picker. |
| `:125-149` | shuffleBag/next use uniform ID membership and plain JSON state. Bag policy ignores relative positive item weights; zero weights/bans exclude members. Mid-cycle content rebase/skip/pin-token handling is still an integration adapter requirement, not shown kit behavior. |
| `:152-155` | pity returns forced/hit/misses from eligible windows. Adapter must first confirm available target and then actually pick it; helper hit is not a gameplay outcome. |
| `:169-180` | withRetries caps total attempts and returns named fallback without validating it. Validate fallback separately at author admission, and before any actual spend. |
| `:185-193` | peek/commit return detached cursor transitions. Cursor must be local to subject/window, not a global draw ordinal; consumer durably publishes receipt and all next state together. |

G1 sorts IDs by code point (`:17-23`); author-order stratum classification
happens before passing category arrays to G1. It does not override first-match
membership. Exact bag/pin migration, A2 truth-query semantics and save-owner
bindings remain OPEN for root integration. Do not edit G1 to finish G3.

## P6: golden impact and future gates

Reuse G1's three-fixed-root approach and A5's ratchet; suggested consumer
roots 0, 1 and 4294967295, with exact content/effective/input locks. For each
selected generator record chosen ID/rev, stratum, policy/overlay refs,
budget/fallback, typed slot refs and safe rendering. Never print restricted
golden truths into public snapshots; agent-only checks report IDs/status.
Also test deliberate empty/rare/pinned/missing-aware cases, not just seeds.

An impact report says changed node, reverse dependency closure, affected
golden refs, expected semantic delta and compatibility witnesses. Adding an
ordinary item may alter unseen item goldens but must leave category-share
invariants and frozen-output goldens intact. Changing a grammar literal can
alter projected text golden while leaving selected items/terms untouched.
Never mass-update snapshots solely because they failed. Reviewer checks the
delta against the intended data change and the retained old-save fixtures.

P18 runs larger seed farms after a consumer exists; report corpus size,
eligible/forced/fallback counts and distribution bands separately. A5 checks
split/jump/order equivalence; P32 checks budgets/catch-up fairness. Following
source gates, the chosen consumer still needs rebuild and fresh-origin
1366x768 gameplay, plus save/reload/literal-file import for persistence.
Mobile stays deferred. No tests/build/browser/import were run in this lane.
