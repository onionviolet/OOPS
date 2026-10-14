# Persistent modifiers and conditions

Paths use [REPORT](REPORT.md)'s HoI4 root. PROPOSALS do not change YAIRPG policy.

## H-M1: Ideas and national spirits

SHOWN: `common/ideas/_economic.txt:1` groups laws under an economy slot. Ideas carry modifiers, cost, allowed/available gates, removal rules and cancellation behavior. The isolation entries affect construction, fuel, diplomacy and consumer goods together; a spirit is a named bundle with multiple consequences, not just flavor text. `cancel_if_invalid = no` appears at line 55.

STATED: `documentation/effects_documentation.md:1410`, 2244, 6065 and 8239 describe adding, timing, removing and swapping ideas. Timed ideas accept duration fields; swapping can set a duration or adjust the replacement's inherited duration. SHOWN the Germany pact chain applies a 730-day idea (`events/Germany.txt:430`); the MEFO macro swaps progressively numbered ideas (`common/scripted_effects/GER_scripted_effects.txt:3`).

INFERRED stacking contract: different named ideas can contribute several modifiers, while an idea identifier is not evidence of arbitrary independent stacked instances. The exact duplicate-add behavior and mixed-stat aggregation order were not runtime-tested. Model “tier replacement,” “refresh duration” and “independent stacks” as different policies, not interchangeable claims.

## H-M2: Dynamic modifiers

STATED, `common/dynamic_modifiers/0_dynamic_modifiers.txt:1`: modifiers may read variables, have enable and remove triggers, apply to countries/states/leaders/special projects and update daily unless explicitly forced. SHOWN the sabotaged-resources definition maps variable magnitudes to temporary state-resource modifiers and removes itself when the relevant resistance state ends.

STATED, `documentation/effects_documentation.md:1153`: adding an existing dynamic modifier updates its cooldown. Its optional target scope restricts the effect. Removing it must match that scope (`:5978`). This directly supports a keyed, refreshable condition rather than unbounded duplicate stacks. It does not establish all engine aggregation rules.

PROPOSAL: an adjective record retains ID, carrier, source, target scope, numeric basis, start/expiry clock, refresh/replace/stack policy and removal cause. Its read projection explains a known effect without disclosing a sealed rule. Actor, state/place and world conditions remain distinct. Use existing `src/simulation_effects.js` condition handling and `src/simulation.js:463` to 491 boundary settlement; no second mutable condition store.

## H-M3: Advisors and traits

SHOWN, `common/characters/GER.txt:62`: advisors belong to character records and specify slot, idea token, country eligibility, visibility and traits. Trait effects live separately in `common/country_leader/` and `common/unit_leader/`; 5,404 characters is not a count of hireable advisors. STATED timed leader traits have a separate effect (`documentation/effects_documentation.md:2270`).

PROPOSAL: a Village mentor or officer changes a named work/teaching/coordination consequence while appointed. Keep character identity, access to the role, active appointment and retained learned trait separate. Removing an appointment need not erase learned mastery, but the selected world's rule must decide this.

## H-M4: Removal and proof

Removal can be explicit, timed, tied to invalid eligibility, keyed by target scope or replaced by a later tier. A doctrine documentation warning makes the same point: a persistent equipment bonus effect may survive a doctrine change; use removable activation modifiers where replacement should retract them (`common/doctrines/grand_doctrines/_documentation.md`, equipment-bonus section).

PROPOSAL acceptance: apply one real condition to a named carrier; show its effect on a normal command; refresh it; stack only under the selected rule; remove it by each supported route. Save, reload and literal import during the active duration and at expiry. Old saves missing an optional revisioned domain keep old behavior. Proposed tests have not run.
