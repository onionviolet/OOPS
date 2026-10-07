# Status effects and small combat interactions

Follow-up requested by Weibao: “Status effects, little things, and more?” Planning supplement, 2026-10-04. [CB11–CB14](FINDINGS.json) extend the existing audit; [summary](REPORT.md) and [handoff](DEPENDENCIES.md) retain one shared native/effect/publication path. All new examples below are original proposals. No new source-world rule, balance, schema or dangerous outcome is selected.

## Existing support worth keeping

Native [ActiveEffect](../../../../../src/active_effects.js), lines 14–33 and 37–142, already represents durations, stat changes, group priority and weather/food/medicine benefits. [Native application](../../../../../src/main.js), 3528–3569, keeps stronger group effects and refreshes effective stats. [Simulation conditions](../../../../../src/simulation_effects.js), 189–200, already support immunity, max/sum intensity, removal, duration and timed effects. [Tender hands](../../../../../src/body_progression.js), 65–69, provide a real body prerequisite; [energy](../../../../../src/energy_resources.js), 31–43, already separates reserve from strain and cooling.

Those are real source functions. They do not establish a general native stun/poison/posture/projectile engine. Adding a condition ID alone does not connect it to combat action legality, actual movement, contact or native stat publication.

## Five families that change decisions

| Family | Useful original examples | Actual consumer and choice |
|---|---|---|
| Exposure, attrition and beneficial upkeep | Bleeding, poison, burning, cold; regeneration, stabilization, maintained protection | Qualified body/component ticks and actual support. Stop the exposure, pay a remedy, rest, maintain support or withdraw; ordinary healing need not remove a poison, and removal need not undo existing injury |
| Control, posture and sensory functions | Stagger, knockdown, entanglement, disarm, dazzle/blindness, voice loss; bracing and steady aim | Interrupt one dependent phase, restrict locomotion or an implement/channel, pay getting-up/regrip/reload time, or use another supported action. A trapped porter can still warn; a disarmed animal may still bite |
| Object and field interactions | Dropped bow, spent arrows, occupied hand, carried bundle, unstable footing, smoke/light/noise and moved/damaged cover | Exact custody, position, route/sight edge and observation recipients. Put down actual cargo to free a hand; recover reachable gear at an exposure cost; noisy action informs an eligible listener |
| Tactical response and cooperation | Guard reaction, short recovery opening, suppression, covering movement, intercepting a shot, friendly fire and a rescue | Real actor goal, consent/authority, reaction reach and action budget. Suppression means the authored function changes movement/aim/planning; a label is not an independent mind-control source |
| Preparation, resilience and lasting aftermath | Owned medicine, warmer equipment, practiced footing, source-specific resistance, strain cooling, a treated sprain and witnessed retreat | Available stock/body/source, learned method, recovery clock and later work. Benefits are as consequential as penalties; treatment restores only supported functions, and surviving people keep their actual changed state |

Source-specific distinctions matter. Wet/cold are already native functions; “Wet” does not universally imply electrical vulnerability or extinguish every magical flame. Voice loss does not stop a purely mental method. Stronger fixed people and genuine superior powers stay stronger. A selected authority/mind-control source can have its real function; an ordinary mood icon cannot grant that authority.

## Minimum status contract

A selected status declares actual affected actor/body/component, object or field; causal source and recipient knowledge; start and authorized clock; intensity, expiry/duration and next tick/phase; stacking/reapplication; immunity/resistance; active consumers; treatment/removal and recovery; and source-loss/continuation semantics. These are contract requirements, not a proposed second global record owner. Bodies owns anatomy, Items owns objects/custody, Regions owns fields/geometry, Powers owns mechanisms and Foundations owns order/projection.

Current simulation records are keyed by actor/condition ID. Reapplication takes max/sum intensity but replaces cause/expiry and restarts the next tick. At an expiry/tick tie, expiry wins. Preserve this for current simple conditions where appropriate; define another policy before claiming independently sourced poisoning, dose accumulation or an uninterrupted periodic hazard. Otherwise repeated low exposure could postpone ticks or shorten a stronger retained status. These are static policy implications, not executed defects in current scenes.

Specify whether a remedy removes one source, all compatible exposure, a manifestation or its sustaining source. Make normal beneficial/bad effects, stronger-shorter refresh, simultaneous tick/expiry, removal and source loss explicit. Native buff/stat projection and simulation condition/action checks must not charge the same effect twice. A condition affecting movement cannot become a universal damage reduction without an actual consumer.

## One connected qualification proposal

Extend the selected Frontier crossing with only the functions it needs: a porter frees a guarding hand by putting down one real bundle; a paid moving action meets unstable footing; a guarded projectile can cause one qualified continuing exposure; an owned remedy or legal withdrawal changes the later outcome. Include one useful preparation benefit and a meaningful choice without combat. The exact exposed body, ammunition, remedy and time policy must be frozen with the selected cast/cargo variant.

Own-status feedback explains cause, current effect, affected actions, next event and available response. Enemy feedback follows observed knowledge, without revealing private immunity or exact hidden clocks. A prepared policy may reserve medicine, switch supported actions, take cover or retreat; it cannot cure for free or commit a newly introduced irreversible consequence. Repeated ordinary ticks can be grouped in display while decisive interruptions stay visible.

Future acceptance: real altered/available actions, source-qualified exceptions, correct reapplication/tick/removal, finite stock and exposure costs, observer knowledge, bounded reactions, stale/duplicate rejection, failed publication, reload and later-return consequences. Those gameplay gates remain unrun. One condition and one free-hand/cover/noise interaction qualify those selected functions only, not a comprehensive status roster or campaign.

No source/library/private-save mutation, game import/build/suite/browser/save operation or runtime/token measurement belongs to this supplement.

