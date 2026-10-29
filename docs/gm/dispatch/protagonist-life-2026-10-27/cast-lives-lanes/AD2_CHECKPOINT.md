# AD2: source-shaped adapter relaxations

Status: **implemented, below floor** pending rebuilt desktop browser proof and
coordinator integration gates. Agent-verified fixture checks, not human-reviewed.
[Brief](AD2_ADAPTER_RELAX_BRIEF.md); direction remains [PROJECT](../../../../../PROJECT.md)
and the [cast-lives card](../CAST_LIVES_CARD.md). No source rows or private packs
were changed, no commit was made, and no player saves were accessed.

Rules applied: AR1-AR16, AD6-AD8, AD36, AD38, AD43, AD45, CLR1-CLR13;
MR4/MR5/MR29/MR31 for existing stock, pure previews and observer knowledge.
MD1-MD3 remain seam guidance, not new accepted direction. Publication class:
public code and synthetic tests; this receipt contains generic review counts.

## D1: behavior and ownership

The seam remains the three pack compilers, registered by the existing cast host
into native simulation commands. Native jobs own time, interruption, payment,
attempt identity and completion; native inventory, facts and knowledge own their
results. `simulation.people[actorId].location` remains the location authority.
Core-owner files touched: zero; host hunks: zero; new save slices: zero.
All three pack field reads are already integrated, so no integration patch is
needed and fixtures apply no patches.

| Adapter | Added form | Retained boundary |
| --- | --- | --- |
| Divination | Nonempty ordered subsets of `prepare`, `rite`, `attempt`, `interpret`, with explicit `unknown` stages permitted. An attempt without recorded costs exposes `cost: null` and `cost not recorded`; its timed job and receipt still have native identity. | Stated costs remain native negative debits. Known stage order, means/contact support, signal feedback and observer-attributed interpretation remain checked. Omitted stages create no invented signal or belief. |
| Divination side effects | Step `effects` accept native `fact`, `knowledge`, `condition`, `relocate`. Knowledge without an explicit basis inherits the query's bound observer/situation. | Native validation checks effect shape; condition IDs and destinations still need real content bindings. An unsupported type becomes a named actor fact beginning `owner needed: <owner>`, preserving its description rather than granting its mechanics. Explicit `{type:'owner-needed', owner, key?, value?}` is also supported. |
| Inference | A single `infer` step can carry `observation: {actor, basis:'recalled'|'witnessed', value}` and uncertainty. A directly attributed `recall`, `intend`, or initial `postpone` is also allowed. A chain may stop after the supported thought. | Observation belongs to the bound actor. Explicit evidence still requires that actor's exact held record; read/testimony keep their prior access requirements. Beliefs write knowledge, not world truth. `postpone` leaves an intention postponed; resume/cancel and downstream active-intention gates retain their checks. |
| Making | `kind:'preparation'` is a timed act with an optional object fact. `kind:'document'` supports `write`, `read`, `inscribe`, `destroy`, `handle`, recording an object fact and actor knowledge. These rows need no catalogue, recipe or product. | Optional `inputs:[{key,qty}]` debit existing native item stock; no stock is seeded or invented. Missing stock and lost location refuse/refund through the existing owner. Document acts do not deliver messages or create recipient knowledge. Equipment/fixture rows remain gaps for H2/CU1. |
| Reviewed merge | Adds `divination`, `making`, `inference` into `divinations.queries`, `making.rows`, `inferences.chains`. All six kinds participate in ID collision and source-step replacement checks. | The real adapters and native command registry validate the merged definitions. Physical recipes still need the pack's catalogue/law bindings. CLI validation is content compilation, not a proof of runtime acquisition or every consumer binding. |

Timed making rows keep the usual `id`, `revision`, `place`, `minutes`, `label`,
`description`, `report`, with optional `knowledgeKey`/`requires`/`inputs` and
`object:{key,value}` (required for document handling). `sourceStepId` is accepted
for all three new merge kinds. Synthetic examples live in the owned tests.

Compatibility: no saved schema or existing command format changed for fully
specified old rows. A differential check against the pre-edit adapter copies
found byte-identical command JSON for all three existing examples: 5 query,
6 thought and 2 making commands. New rows use the existing frozen-job validator;
the live fixtures reject effect or support tampering, including new forms.

## F1: before/after gap expectations

Probe: the actual private `reviewed-rows-2026-10-29/RW1.jsonl`, `RW2.jsonl`,
`RW3.jsonl` each contain 100 gaps and zero row verdicts. Counts below come from
their `gapReason` fields, with RW2's existing validator theme indices and RW3's
`gapCode` used to distinguish eligible subgroups. These are expected blocker
removals, not newly admitted source rows. The after-count in those files remains
**0 admitted rows / 100 gaps each**, since this lane does not rewrite verdicts.

| Review and existing blocker | Before | Expected conversion opportunity | True gap or remaining requirement |
| --- | ---: | --- | --- |
| RW1: source-supported native payment missing | 52 | Up to 52 can omit an unstated debit and record unknown cost. | Author the supported target, means/contact, stages and observations; do not infer costs or answers. |
| RW1: physical/capability effect outside query seam | 26 | Up to 26 can retain native effects or named missing-owner facts alongside the rite. | A missing-owner fact records the limitation; it does not implement protection, powers, communication or other absent consumers. |
| RW1: complete ordered query not established | 12 | Up to 12 can retain the supported fragment and explicit unknown stages. | An unsupported intention/outcome is not permission to invent the omitted rite or feedback. |
| RW1: not an action / actor not the lead | 9 / 1 | 0 from relaxing adapters. | Re-review the cited action or use the correct actor's route. |
| RW2: no mechanism | 71 | 22 document-theme members can potentially become document-handling acts. | The other 49 are 37 ritual/context and 12 equipment/fixture/tactical/travel members. Document delivery, custody and destruction consequences beyond an object fact remain with their owners. |
| RW2: unresolved person/place/object | 11 | The physical-preparation theme accounts for 10; full material/law/product bindings no longer block a timed preparation fragment. | All 10 still need resolvable actor/place/object identity and any actually consumed stock. The remaining 1 is ritual/context. No automatic conversion is claimed. |
| RW2: not an action / actor not the lead | 13 / 5 | 0 from relaxing adapters. | The broad 26-document theme includes 4 unsupported-action verdicts; those are excluded from the 22 above. Its 10 physical-preparation members all carry unresolved-identity verdicts. Equipment's broad 19-member theme includes 7 unsupported-action verdicts. |
| RW3: no mechanism | 86 | Up to 48: 24 held-evidence-unmapped plus 24 incomplete-chain members can use an explicitly source-supported own perception/recollection or stop at the supported thought. | Remaining 38: 25 paragraph mismatches, 8 physical practice, 3 ability operations, 2 teaching/delivery. Some of the 48 may still lack a genuinely observer-owned source basis. |
| RW3: actor not the lead / not an action | 12 / 2 | 0 from relaxing adapters. | Keep other-actor and physical-misclassification gaps. |

## A1: owned files and checks

Owned files changed: `src/cast_divination_adapter.js`,
`src/cast_making_adapter.js`, `src/cast_inference_adapter.js`, their three
`tests/cast_*_adapter.test.js` files, `scripts/lead_run/merge_reviewed_rows.mjs`,
`tests/merge_reviewed_rows.test.js`, and this checkpoint. Other dirty checkout
files were preserved. Ownership is released to the coordinator after this report.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_divination_adapter.test.js tests/cast_making_adapter.test.js tests/cast_inference_adapter.test.js tests/merge_reviewed_rows.test.js tests/perspective_controls.test.js tests/place_acts.test.js` | PASS: 29/29, 0 failures (99.8 seconds) | Includes synthetic CLI merge, native DOM controls, real save validator, pending/settled Save, reload, Export, Import and meaningful refusal/tamper cases. |
| `node /tmp/ad2-baseline-check.mjs` | PASS: 13 original commands byte-identical | Temporary differential helper and pre-edit copies are local scratch, not permanent fixtures. |
| `npm run check:arch` | PASS: main -51, display -37, saves 0 growth; 6 grandfathered main imports, 205 cyclic edges | No core-owner or import-cycle growth. |
| `node scripts/lane_review.mjs --grant <each of the nine owned paths> <same nine candidate paths>` | FAIL: 6 name-hit files; outside-grant 0, top-level-await 0 | All hits are inherited generic words (`world`, `future`, `stable`, `gate`) which also occur as private pack names. No source-name publication finding was introduced by AD2. The checker was left unchanged outside this lane's grant. |
| `node /tmp/ad2-name-baseline.mjs` | PASS: 7 source/test files, 2,896 private names, 0 newly matched names | Repeats the scanner's name extraction/matching, checks each match against that same file at HEAD, and restricts hits to the four generic words above. Temporary diagnostic, not a change to the checker. |
| `git diff --check -- <eight tracked owned paths>` and Python checkpoint local-link check | PASS: clean whitespace, 3 local links resolve | Static whitespace and documentation links only. |
| Full `npm test`, final combined build/rule gates, rebuilt 1920×1080 browser journey | Not run by this lane | The committer owns the full-suite gate. Native headless DOM/save fixtures are not rebuilt desktop-browser proof; AD43 floor remains open. |

The initial combined run passed 28/29. Its new divination fixture failed because
an extra knowledge effect carried the unit fixture's situation into the live
player situation, causing the real validator to reject the pending save. An
extra runner frame did not fix it. The corrected fixture uses inherited query
attribution, and the isolated divination file then passed 6/6. No production
validation was weakened.

Final input identity for coordinator reuse: shared HEAD
`95a6468ba6689bdb10cc6023db52c1c06f77fb84`; eight owned code/test files sorted by
path and hashed as `path + NUL + bytes + NUL`:
`1ba744965a3f7ed797bd8a715dda61de3632a3b0a102790ab3f7f084b3115f36`.
Final run log: `/tmp/ad2-final-tests.log` (local scratch).
The rebuilt fixture bundle SHA-256 identities were:

| Fixture route | Bundle SHA-256 | Highest review state |
| --- | --- | --- |
| Query, partial unpaid rite and downstream topic consumer | `6f89d338169d287341d2b4b04eec4ce3b5f7f50bf6bfafa9d9bf79078fa476d9` | Agent-verified native headless DOM and real save validator |
| Evidence chain, single thoughts, deferred/resumed plan and downstream intention gate | `ec7035cbfebad0201e91959a1473a2ab243a9537bbcf6609a406ba966ad70607` | Agent-verified native headless DOM and real save validator |
| Physical batch/use, timed preparation, document fact/receipt and stock consumption | `ddef7b1af9439b3b1b568cebf068f9ca0e269017745f9f02280b6e0fa576b241` | Agent-verified native headless DOM and real save validator |

These are disposable integrated builds with test access ports and synthetic
packs, not a shipped or installed bundle. The tests separately bundle live
source for their headless runner. No desktop screenshot or full AD43 gameplay
completion is claimed. The unbound condition variant is native-schema checked;
the new live query side-effect journey exercises fact and knowledge effects.

Known limits and next owner work: actual source-row authoring/review, identity
and acquisition bindings, missing effect owners and document delivery remain
explicit. A later owner can replace these timed fragments with richer mechanism
bindings while preserving their job/knowledge seams (AD45). No accepted design
owner or rulebook was changed by this lane.
