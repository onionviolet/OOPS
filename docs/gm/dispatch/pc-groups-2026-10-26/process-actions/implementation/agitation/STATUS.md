# Agitation PC15–PC16 implementation

State: RELEASED-FOR-INTEGRATION, pure mechanism implemented below AD43 floor. Source/test write ownership transfers to the integration chat; this lane has stopped source writes.

Reserved before editing: `src/craft_agitation.js`, `tests/craft_agitation.test.js`, and this directory's status/evidence. No existing file at either source/test path; no other implementation reservation was present at inspection. Shared adapters and documentation remain integration-owned.

Seam: pure leaf imported by integration's staged Frontier process; no clock, inventory, draws or save owner. Rules: MR1–5/10–13/16–23/29–32, AR3/4/7/8/10–14, AD5/36/38/41–43. Runtime architecture owner: docs/ARCHITECTURE_RULES.md. Original causal fill, no new canon claim. Existing ingredient `directions` remains independent.

Plan: strict law/state/action admission, cost quote and pure transition, accumulated work with saturating mixing/contact and irreversible shear damage, passive settling, scale and late-input dilution, qualified oriented-flow reader. Integration must debit the returned costs transactionally and consume material state in product grading. No independent UI or gameplay claim. CONTRACT.md absent at reservation, will reconcile before release.

More-to-consider: ACT NOW admission and finite-number checks, quote purity, no draws, compact state, no free repeat gain, stopped input dilution and partition-equivalent linear exposures. ACCOUNT FOR NOW integration owns lifecycle/custody, actual debit, truth-to-known projection, heat consumption and law revision persistence. Named process duration is in game seconds and must be advanced once by the existing clock. Later novel rites require qualified source evidence, no new acquisition here.

## Interface ready, contract reconciliation pending

`src/craft_agitation.js` is now implemented, below floor. `node --test tests/craft_agitation.test.js`: 10 passed, 0 failed (initial run). Source/test are still owned here pending contract reconciliation. Integration can inspect immediately. No required adapter/schema changes are silently implied.

### Exact interface

- `frontierAgitationLaw`: ORIGINAL authored pilot, id/revision/source locator. Five verb profiles have viscosity intervals, required tool, motion rate, shear, air and dissipated work. Optional `orientation` requires direction, mechanism, locator, target work and positive energy/work. Optional `rhythm` requires a mechanism/locator and pulsed efficiency. No novel rite is asserted.
- `createAgitationState(law)` / `validateAgitationState(law,state)`: retained law identity and compact total work, homogeneity/suspension/contact, air/foam, irreversible damage, heat work, signed oriented work. No click log, timer or copied constituent quantities.
- `quoteAgitation(law,state,batch,action,means)` -> `{costs,rawWork,effectiveWork}`; pure and no draws. `applyAgitation(...)` -> `{state,costs}`. Batch is `{mass,viscosity,fragility}` in selected law-local units. Action is `{verb,seconds,intensity:'gentle'|'vigorous',direction:'clockwise'|'counterclockwise'|'alternating',rhythm:'steady'|'pulsed',strokes?}`. Default strokes = seconds × profile cadence; optional explicit count must fit elapsed cadence. Means is `{tools:[...],drive:'manual'|'powered',stamina,energy,toolCondition,maxLoad,reach}`. Reach (0,1] is a derived view of actual vessel geometry/tool access, not a second apparatus record. Costs are `{laborSeconds,stamina,energy,toolWear}`. Power and orientation energy are charged separately from manual stamina. Integration must re-quote and atomically debit costs at commit; outputs alone do not spend.
- `settleAgitation(law,state,batch,seconds)`: passive loss of suspension on the owning game clock. Stop means no active-work call, not a refund. Integration must split elapsed exposure at actual admission/intervention boundaries and not settle the same time twice. Simultaneous active mixing/settling is not claimed; this law models active work and passive rest as distinct stages.
- `admitAgitation(law,state,priorMass,addedMass)`: dilute fractions and oriented exposure for unmixed fresh input; retain actual total past work/heat. Call for an admitted unmixed cohort only, not for transferring an already processed batch. G5/inventory stays quantity authority. No mass is minted here.
- `agitationEffect(law,state)` -> `{contact,uniformity,intact,orientedFlow}` truth readers. `contact` is available interface × intact fraction; `uniformity` is homogeneity × current suspension. Integration's thermal/extraction/product adapter must consume them and cues must use observer-safe projections. Total `heatWork` is an accumulated contribution; thermal consumes its delta at the boundary, never the lifetime total repeatedly.

### Selected detail coverage and owner map

| Detail / finding | Producer → state → reader | Observable focused check / dependency |
|---|---|---|
| PC15 stir/whisk/knead/circulate/agitate | selected law + actual tool → paid accumulated work → contact/homogeneity/suspension | Every supported verb test; thick paste permits kneading while thin liquid refuses. Integration exposes fitting verbs from actual means. |
| PC15 viscosity/geometry/settled matter | batch viscosity + apparatus-derived reach/mass → work per admitted mass; passive settling → suspension | Scale/reach test, settling/remix test. G5 owns material facts; separation owns apparatus; integration supplies views, no duplicated owners. |
| PC15 homogeneity/suspension/interface | work → capped independent fractions → `agitationEffect` | Reader asserts usable contact and uniformity loss on settling. Product/extraction consumer is integration-dependent, not closed by these fields. |
| PC15 gentle/vigorous; fragile parts | force/shear/fragility → irreversible damage → intact/contact | Vigorous comparison and fully damaged plateau. No paid remix can restore destroyed material. Constituent-specific loss, if required by the selected product, must be mapped by integration using G5 rows. |
| PC15 air/foam/heat | verb air/shear profile → air/foam and heat work → cue/thermal adapters | Whisk comparison proves distinct fractions and heat. Thermal consumes heat-work delta; cues owns safe observation. Foam decay/escape is unmodeled here, not a proven physical fate. |
| PC15 real labor/tool/stamina/power | actual means and duration/count → quote/costs → integration transaction | Stale tool/load/stamina/power refusal; no mutation. Actual debit/browser evidence belongs to integration. |
| PC16 order vs direction | ingredient order remains resolver-owned; action motion has its own field | `ingredient-order` motion refuses; symmetric motion equivalence test. No changes to resolver directions. |
| PC16 count/rhythm | elapsed cadence × force (or actual bounded count) → work; qualified pulsing → efficiency | Half-count halves work/stamina; excess cadence refuses; unqualified rhythm is equivalent, no decorative control required. |
| PC16 symmetric vs oriented flow | symmetric pilot ignores sign; original chiral-baffle law consumes signed work and energy | Both directions equivalent in pilot; oriented fixture changes useful oriented flow, alternating produces no net flow. World/rite source law needs its own qualified locator, not inferred HP/LOTM canon. |
| PC15–16 plateau/repetition/intermediate choice | capped mixing, cumulative irreversible damage, paid work and admission boundaries → useful reader | Repetition cannot exceed fraction caps; overwork destroys usefulness; rest/remix/admit preserve causal choices. No XP producer added. |
| D1 compact retained work | bounded scalar state + law revision → deterministic next transition | Serialization and next transition equality; integration owns native save/import validator and revision support. |
| D2 failure/rescue | insufficient means refuses; settling can be remixed at cost; damage cannot be undone | Refusal leaves source state equal; remix restores only suspension. Cues/integration own selected rescue UI and actual constituent outcomes. |
| D3 quick/guided/deep/helper | same pure functions for every maker; caller supplies actual means | No mode or actor branch exists. Integration/cues method recorder must replay actual stage program and revalidate current means. |
| SF1–SF8 / G3 joins | ORIGINAL law, pure truth, no copied stock/clock/vessel/lot owner | Exact adapter requirements above are necessary integration dependencies. G6 clock/exposure, G5 lots/units and G2 fit/allocation are upstream views; this lane does not recreate them. |

### Integration horizon, still selected

PC15–PC16 product use, visible costs/refusals/cues, real transactional labor and power, timed admission/rest/interruption and law-retaining persistence remain integration-owned selected work. This pilot does not close every world's agitation law. HP and LOTM remain bounded source gaps: report locators (HP B2 p481/p486; LOTM 0031/R005-C15) do not establish a canon motion law. Any source-qualified rite remains with the group coordinator for qualification and implementation, not demoted to optional work.

No shared-core owner touched, no new cycle edge (leaf has no imports), no registration line, no build output. Focused evidence is synthetic, agent-verified, not human-reviewed. No full suite, build, browser, installation, private save, commit or push.


## Contract reconciliation and final release

Read integration-owned `../CONTRACT.md`, revision 1, after publication. No competing envelope or custody owner was added. Its native-minute clock adapter passes elapsed minutes × 60 to this module. The existing native transaction owner re-quotes/debits explicit cost outputs; batch mass/viscosity/fragility and apparatus reach/load are supplied as derived views, not persisted alternative owners. Retained agitation state belongs inside its `mechanismState`, under the frozen law/revision. Its extraction and collected-portion adapter must consume `agitationEffect`; passive rest calls `settleAgitation`; repeated unmixed admissions call `admitAgitation`. Thermal takes new heat-work delta once. Shared G5/G2/G6 contract release is still integration's upstream dependency. This reconciles the leaf API with the published contract without editing that owner.

Ownership transfer: `src/craft_agitation.js` and `tests/craft_agitation.test.js` are released to integration now. Integration may adapt them after recording transfer. Source SHA-256: `142f59068d52eb26a2edf7af94504a6e521d346b97ba19e361130440dff8a30f`; test SHA-256: `834185b0fc4068e4acaff2cfcee109dea60029ffd148bd88e73575c95c6192cd`.

Evidence: `focused-tests.tap`, final recorded invocation `node --test tests/craft_agitation.test.js`, 10 passed / 0 failed / 0 skipped. `input-identity.json` hashes the exact released inputs, contract and test output; dirty primary evidence, not HEAD-only proof. Targeted whitespace inspection passed. Current source validation reads the retained law revision, finite values, fraction bounds, material/tool window, live quoted resources and load. No existing command definitions/save validators were changed; their golden snapshot and integration update remain with the adapter owner.

Remaining authoritative gate: integration must connect, build and play the staged process under AD36/AD43, including actual collected-product effects and pending/collected native persistence. No disconnected-code completion claim. All selected detail dependencies stay in the coverage map above.
