# Cues lane: PC21, J1, D1–D3

State: interface-ready, released for integration after evidence below; pure mechanism implemented, below AD43 floor. Writer: cues chat; ownership transfers to integration for the exact reserved paths at release.

Reserved paths: `src/craft_process_cues.js`, `tests/craft_process_cues.test.js`, and this `cues/` evidence directory. No shared runtime, UI, inventory or persistence writes.

Seam: Frontier process owner consumes observer-safe projections, rescue intents and demonstrated method records. Integration owns the custody transaction and uses thermal/separation laws for mutations. Applies AD6–8/36/38/41–43, MR1–5/10/13/16–23/29–32, AR3–8/10–14, and [runtime rules](../../../../../../ARCHITECTURE_RULES.md).

Target: integration's 1920×1080 desktop process journey shows known impressions, real action costs/refusals and a weaker useful output where supported. Mobile optimization deferred. No UI claim in this lane.

Preflight: current craft_cues.js describes finished pieces, not live process cues. Extend the connected staged-process seam with a leaf module rather than alter that incumbent API. No current commands or save validators are changed here; integration owns those snapshots and compatibility decisions.

Checks selected: focused node test for cue non-disclosure, conservation delegated rescue, stale/unsupported intervention rejection, demonstrated repeats, helper means and stop policies, bounded receipts and chunk-independent observation. CONTRACT.md not yet published at initial reservation; reconcile before release.

## Proposed interface for integration (published before implementation)

- `projectProcessCues({readings, means, reference})`: readings are physical law-produced impressions: smell/color/bubbling/texture/pressure/powerFlow. Channels require explicit `means.senses` or `means.instruments`; powerFlow requires power sense. No causal truth or debug trace is copied. Reference comparison uses previously witnessed impressions, not hidden composition.
- `diagnoseProcess(cues, knownRules)`: returns known candidate explanations, including multiple causes, never selects the true cause. Rules are observer-known, source-qualified rows supplied by the knowledge owner.
- `quoteProcessRescue(current, action, {handlers, means})` / `applyProcessRescue(...)`: actions cool/dilute/settle/neutralize/split dispatch to injected law handlers. Handler quote returns eligibility and costs, apply returns the new current state and declared destinations. No duplicate thermal/separation math; integration provides their adapters and commits inventory atomically. Expected process revision prevents stale execution.
- Receipt/method functions retain a bounded player-safe sequence, apparatus, costs, conditions, uncertainty and chosen stop policy. Quick/guided/deep generate the same recorded actions; guided exposes marked decisions. Current maker/helper means revalidate before replay; no mode-specific potency multiplier. Recording overflow disables quick replay rather than silently omitting earlier steps.

## Final interface and contract reconciliation

Read CONTRACT.md revision 1 after publication. Envelope `revision:1` is schema identity, so pass an action-generation view `{...process, revision: process.actionSequence}` into rescue policy and map its result back without replacing the schema revision. Advance `actionSequence` at each actual committed change; a schema revision is not a stale-click token. Cue functions do not mutate either.

Native clock is **minutes**, supplied by integration. Record `at`/`startedAt` and stop deadlines in minutes; adapter costs named `seconds` need explicit conversion at the native transaction boundary. Repeat's optional `at` shifts demonstrated times and its default deadline to the new run. An explicit `stopPolicy` argument is already in the new native clock. Call `processShouldStop` at causal stage/threshold boundaries, not just the end of a long tick. This predicate cannot discover an unsampled transient cue.

`projectOriginalProcessCues` reads released thermal residence/temperature and separation phase rows directly. It labels ORIGINAL pilot impressions: heat/residence produces smell/color/bubbling; suspended or settled matter produces cloudy/layered texture. It omits pressure/power until their owning law supplies a physical categorical reading. `projectProcessCues` accepts those producer readings with explicit senses/instruments. Pressure needs a pressure instrument/sense; power-flow needs power means; unsupported values are unmeasured, not absence. The higher observation skill band changes confidence text, not matter or cause. No generic accuracy/diagnosis bonus is claimed.

Rescue handlers have `quote(current, action, means) → {ok,costs,reason?}` and `apply(...) → {ok,state,destinations}`. The quote must use live stock/control and give observer-safe refusals; apply must advance action revision once. Costs must be finite/nonnegative with actual nonzero time, work or input. Policy requotes, isolates callbacks with copies and returns only declared fields. Law handler owns conservation, completed facts and physical efficacy. Integration commits all results/costs atomically; policy itself spends nothing. Use `stopThermal`/`advanceThermal` for cooling and `separateProcessBatch` for splitting; no second kinetics/partition law here.

Methods record committed **known action payloads**, not internal stage debug: verb, stage, game time, action revision, declared quantities, parameters, cost, known conditions, uncertainty, outcome and meaningful-decision flag. Integration supplies actual action parameters (motion/rhythm/addition/portion); call `recordProcessStep` after commit, never on preview. Do not put latent truth inside the explicit known `conditions`/`parameters` payloads. An event's unrelated `debugTrace` is discarded. Records retain 16 recent receipts and up to 64 demonstration steps as a technical budget. Overflow keeps a causal tail/count but refuses quick-method creation rather than erasing earlier necessary work. It does not bar continued crafting.

`demonstrateProcessMethod` requires a delivered result consumer and actual tool/skill/stock requirements supplied by the owning executor. G1 I2/C2 owns permanent-learning admission, reference custody, and wider method authoring; these records do not grant knowledge. Optional demonstrated apparatus capabilities allow a fitting replacement, rather than an arbitrary ID gate. `planProcessRepeat` returns the same actions for quick/guided/deep, plus decision indices. It checks current maker/helper apparatus, tools, skill, stock and ability to see the stop cue; the stage executor still revalidates continuing work/energy/stock at each boundary. It grants no helper, labor, XP, input, outcome or mode multiplier.

## Complete detail coverage map

| Detail / finding | Producer → state → consumer | Owner / dependency | Observable check and disposition |
|---|---|---|---|
| PC21 smell/color/bubbling | thermal trajectory → ORIGINAL impressions → observer projection | cues; integration wires actual stage view | thermal/phase cue test; pure implemented, below floor |
| PC21 texture and multiple causes | constituent phases → impression → known theory candidates | separation/cues; knowledge owner provides known rules | cloudy fixture yields two hypotheses, excludes hidden identity; implemented |
| PC21 pressure/power-flow | physical categorical signal → gated observation → player cue | pressure law: separation/integration; power producer: world owner | means gate covered; physical producers unresolved, selected horizon retained |
| PC21 sensory/skill means | actual senses/instruments/observation skill → projection | cues + native maker snapshot adapter | six channels refuse absent means; practiced confidence changes no truth; implemented |
| PC21 diagnosis versus intervention/debug | known cues and known rules → possible causes; separate rescue action | cues + knowledge owner | multiple causes, no debug/private fields, no mutation; implemented |
| PC21 cooling | current thermal anchor → paid stop/cool → remaining temperature/loss | thermal + integration handler | actual thermal function delegate test preserves damage/spent fuel; policy implemented, runtime adapter pending |
| PC21 dilution | admitted solvent → volume/concentration → weaker useful portion | integration admission + separation custody; no duplicate inventory | synthetic dilution preserves active/lost/completed facts, quotes measured water; actual stage admission/use pending |
| PC21 settling | elapsed rest → agitation settling → later decant/yield | agitation/integration + separation | dispatch supported and cost required; actual settle law adapter/journey pending |
| PC21 neutralizing | admitted reagent + declared local contact law → actual conversion → useful/waste destinations | separation contact law + integration admission | dispatch supported/cost required, unsupported refuses; source-qualified reaction adapter and consumption pending |
| PC21 splitting | remaining phase-addressed batch → doses/residue/film → real use | separation/integration | actual separation delegate conserves all mass, repeat stale action refuses; adapter/use pending |
| D1 bounded cause, no raw input history | committed known steps → bounded receipt/demonstration | cues + G1 I2/C2 method owner | overflow refuses incomplete quick knowledge, no rewind, JSON roundtrip; implemented |
| D2 rescue cannot rewind opportunity | live revision and law state → revalidated intervention | cues + law/custody owners | dilution preserves completed/lost; cooling irreversible; split no duplication; runtime joins pending |
| D3 demonstrated sequence/apparatus/limits | actual committed quantities/parameters/conditions/uncertainty → method → replay plan | cues + G1 I2/C2/integration | actual-order/quantities/time-shift/capability checks; implemented policy, executor pending |
| D3 meaningful guided/deep choices, no penalty | same recorded program → decision display → same executor | cues/integration UI | identical action/cost program for all modes, guided marks actual decisions; display/runtime pending |
| D3 actual helper means/stop policy | native helper snapshot → tool/control/stock/cue admission → same program | cues + actual people/work owner + integration | identical means parity and missing skill/tool/stock/sense refusal; helper acquisition/labor execution pending |
| D3 clock chunking | native absolute deadline/known cue → stop predicate | integration + G6 clock/exposure | deadline partition equivalence tested; transient cue crossings must be sampled by executor |
| J1 useful weaker rescue journey | materials/stage → ambiguous cue → paid correction → existing oral consumer → method | integration, released agitation/thermal/separation/cues; G1 learning join | policy fixtures cover constituent steps; full rebuilt browser/use/persistence journey remains integration-owned |
| SF1 world distinctions | source-qualified rule → selected process | HP/LOTM source owners | ORIGINAL pilot label, no novel mechanics claimed; HP p481 and LOTM local0031/R005-C15 remain source gaps |
| SF2 inspection | read-only impressions/quotes/plan → knowledge-safe view | cues | copied callbacks, no draws/time/stock/knowledge mutation; focused checks pass |
| SF3 identity/amounts/G2/G5 | native quantities and phase rows → law handler → destinations | G5 lot vocabulary, G2 fit, separation/integration | no lot/stock owner added; production allocation/lot contracts remain integration dependency |
| SF4 lifecycle | live custody and current means → stage commit/interruption | integration + G6 owning clock | stale token policy tested; travel/cancel/continuing-work settlement still executor-owned |
| SF5 revisions and persistence | law/action identity + compact record → native save envelope | integration/G1 learning | pure JSON identity checked; native Save/reload/Export/literal Import still required |
| SF6/7 useful readers/UI | projection/action/plan → existing stage/consumer → feedback | integration/G1 I2/C2 | view/action specification above supplied; rebuilt desktop evidence pending |
| SF8 ownership | reserved leaf and focused checks → exact release | cues/integration | no shared owner edits, build/full suite/commit/push/adoption/private saves |

## More-to-consider disposition

ACT NOW completed: zero-cost/negative-cost refusal; copy-isolated quote; stale action token; original phase/trajectory impressions; known theory separate from cause; no silent truncated quick program; shifted replay clock; fitting apparatus by demonstrated capability. ACCOUNT FOR NOW: continuing support is rechecked by executor, clock/transient thresholds by G6/integration, native quantity/lot vocabulary by G5 and fit by G2, permanent method learning by G1 I2/C2. Selected dependencies above remain selected work; no pilot closes them. No new optional feature is dispatched.

Change surface: two new leaf/test files, zero core-owner files changed, zero registration lines, zero new import cycles (production module has no imports). Test imports released sibling law APIs only. No change to existing craftCue finished-piece behavior, live command definitions or save validators.

## Evidence and release

Final hashes/input identity and before/after test drift appear in `evidence.json`; focused output in `focused-tests.tap`. Focused command: `node --test tests/craft_process_cues.test.js`. Fourteen passing tests at initial final run, zero failed/skipped. The first run caught a missing parenthesis, corrected before these results. `git diff --check` on owned paths passed (new paths also inspected in full).

Highest state: focused pure-mechanism verified, implemented below floor. No bundle/build, native UI, save/import or consumer completion claim. Integration owns required combined checks and AD43 journey. Release is limited to source/test plus this lane evidence; other writers' thermal/separation files are dependencies, not ours to release.
