# Item-borne power, effect time and carrier state

Research only. Source IDs and exact SHA256/line windows resolve through [READ_COVERAGE.json](READ_COVERAGE.json). Cumulative rows extend this auditor's first pass; no unrelated lane's semantic coverage is silently credited.

## DF-EMR2-01: a second power producer avoids the lieutenant map limitation

`data/init/generators.lua:772–788` first checks `ropar.use_mythical_materials`. It then walks each key in `ropar.mythical_sphere` and each named entry in `interactions.mythical_item_power`, both through `pairsByKeys`. An entry is appended when `v.spheres[sph]` is true. Next it iterates the numeric candidate array with `ipairs`, creates `MYTHICAL_ITEM_POWER_<index>`, adds generated metadata, marks I_SOURCE ITEM_POWER, adds IS_CDI INTERACTION referencing the same ID and merges `v.interaction()` output. The interaction collection is later registered through `raws.register_interactions` at793–795.

This is a different producer from `basic_lieutenant_powers`. The prior named-map/ipairs finding does not block this sorted keyed path. Conversely it does not establish that the native engine turns these records into available item powers in the installed world: the native parameter, item binding, generation timing and downstream consumer are still missing.

There is no deduplication between sphere matches. A power allowed by several sphere keys can be appended repeatedly, receiving different sequential IDs. That is a conditional static behavior if those keys are present, not proof that an item gets multiple copies or stacks its effect. The meaning/shape of native `mythical_sphere` input is not supplied by these sources. The local `pind=1` is unused in this window.

`interactions.lua:287` requires `generators.interactions.item_power`, and the base registry is declared in `generators.lua:239`. This closes the readable file-to-registry-to-selection-to-registration path, while native generation availability and item/actor ownership remain open.

## DF-EMR2-02: thirteen item power definitions have different contracts

Full definitions: `data/vanilla/vanilla_procedural/scripts/generators/interactions/item_power.lua:1–436`. [ITEM_POWER_ROWS.json](ITEM_POWER_ROWS.json) retains every named entry, source bounds, sphere keys and selected lexical effect/wait fields. Comments and inactive example code are distinguished from emitted strings. No source was executed.

All active rows specify an attack usage hint, focus verb, LOS targeting, range25 and max target1. These are intended NPC targeting/choice annotations, not observed AI use. Every candidate has a commented-out GRASP requirement, so this source does not enforce the grasp gate used by some actor powers. Native item activation/body/wear restrictions remain unknown. No player-versus-NPC exclusion is emitted in these shown rows.

| Power | Active effect | END and scope | Distinct limit |
|---|---|---|---|
| ice_bolt | Material emission, WATER SHARP_ROCK context material | Immediate material effect; no CE timer | Wait50; targets material A and locations B/C, not a flat damage number |
| propel | PROPEL_UNIT force100000 | Immediate; no CE timer | Wait50; target B creature, A context location; collision aftermath native |
| pain | CE_PAIN severity500 | END3, RESISTABLE | No active WAIT_PERIOD in this row; native default unknown |
| blisters | CE_BLISTERS severity500 | END3, ALL/SKIN, VASCULAR_ONLY, RESISTABLE | Body matching matters; absence of suitable skin/vasculature native |
| paralysis | CE_PARALYSIS severity500 | END1, RESISTABLE | Different duration than most status rows |
| bleeding | CE_BLEEDING severity50 | END3, ALL/SKIN, VASCULAR_ONLY, RESISTABLE | Severity differs from other offensive effects |
| cough_blood | CE_COUGH_BLOOD severity500 | END3, RESISTABLE | Native physiological prerequisites not recovered |
| vomit_blood | CE_VOMIT_BLOOD severity500 | END3, RESISTABLE | Not the same effect identity as coughing blood |
| nausea | CE_NAUSEA severity500 | END3, RESISTABLE | Shared display name does not merge effect type |
| necrosis | CE_NECROSIS severity500 | END3, selected tissue, VASCULAR_ONLY, RESISTABLE | Tissue chosen at generation via pick_random, not shown retargeted per cast |
| blind | CE_IMPAIR_FUNCTION severity500 | END1, BY_CATEGORY ALL:EYE, RESISTABLE | Exact anatomical selector interpretation remains native |
| suffocate | CE_IMPAIR_FUNCTION severity500 | END1, BY_CATEGORY LUNG:ALL, RESISTABLE | Source selector order differs from blind and from earlier curse helper |
| dizziness | CE_DIZZINESS severity500 | END3, RESISTABLE | Does not establish any native aim/AI penalty formula |

All status rows above declare PROB100, START0, PEAK0 and syndrome concentration added1000:0. These are emitted raw fields. They do not prove every cast penetrates resistance, that severity is damage, or that each affected actor reaches peak. Timings remain native raw values. Only the ice/propel rows emit explicit wait50; assigning the same cooldown to every item power would invent a default.

Necrosis's generation-time tissue pool includes skin, fat, muscle, eye, nerve, brain, lung, heart, liver, gut, stomach, pancreas, spleen, kidney and ALL. [Source lines287–317] Ending the syndrome is not shown restoring tissue already destroyed. Nor does expiration of pain imply reversal of its source wound.

The file's final block, lines421–436, is commented C++-style planning/example text inside a Lua block comment. It mentions further magic power categories and vampire-like example tokens; it is not active Lua or proof those capabilities are emitted by this file.

### Cleanup and combinations

An item supplies an activation source; the emitted status is attached through an interaction to the target. No shown callback ties target status END to dropping, selling, destroying or unequipping the item. Likewise no callback here grants permanent learned knowledge to the user. Source possession, availability to activate and existing target effects must remain separate unknown native consumers.

A short blind/paralysis window might combine with force or another attack, but turn scheduling, action costs, resistance and NPC selection are missing. A grasp requirement commented out in one source must not be generalized to all spells or used to claim that a severed hand has no effect on equipment. No self-immunity or protection against one's own emitted ice/collision is declared in the rows.

## DF-EMR2-03: mythical identity templates do not implement the promised power tiers

`interactions/mythical.lua:264–298` selects a name using `mythical_names[power_level]`, adds sphere-related adjective placement, and emits a syndrome with name/tile, class NECROMANCER explicitly annotated for color, no-aging/needs/physical-gain/rust exemptions, and personality facets cruelty+200, love−200, hate+200, cheer−200, violent+200, altruism−200. These are raw change fields; no assumption is made about clamping or whether values are absolute/additive.

`generators.lua:751–770` calls the mythical generators for levels0 through3, adds I_SOURCE MYTHICAL, IS_POWER_LEVEL, creature context and learning/speech requirements. Level0 has no entry in the shown one-based names table; `pick_random(nil)` safely returns nil in `globals.lua:15–21`, so name omission alone is not a proven crash. The generator still emits its other fields. For named levels it expects a valid sphere adjective table; fallback sphere selection is CHAOS upstream.

The apparent role tiers are a comment: highest all powers, middle medium plus two minor, lowest one minor. The active function does not emit CE_CAN_DO_INTERACTION or another granting mechanism. Consequently the role label, NECROMANCER class and comment do not establish death secrets, corpse animation, those tier powers or autonomous malicious conduct. A native MYTHICAL consumer could add behavior, but it remains unread.

No END is emitted for identity/tag/personality fields. A future reversal would need ownership-aware removal of each contribution, original visible identity, original body needs and any separately granted knowledge or native capability. That machinery is absent from this template. Neither healing nor item loss is shown undoing it.

## DF-EMR2-04: carrier preservation is independent of work cancellation

Additional windows in `reaction_other.txt:165–265,439–550` distinguish modification in place, liquid extraction and new-item production.

Glazing a large pot/craft requires a glaze-compatible item, EMPTY and NOT_IMPROVED, and preserves the target reagent. It consumes a glaze source with GLAZE_MAT, emits a GLAZED improvement using the glaze's mapped material, requires kiln/FUEL and GLAZING. Preserved target therefore can acquire a persistent modification; preservation is not no-change.

Pressing paste requires150 unpressed glob with PRESS_LIQUID_MAT. Fruit version requires an unrotten unpressed plant growth. Honeycomb requires HONEYCOMB_PRESS_MAT and unpressed state. Each requires an empty nonabsorbing liquid-container tool, preserves it and excludes it from determining output quantity. Each directs liquid into that exact reagent and separately emits a pressed glob of the original source material. Pressed residue has its own identity and later-use implications. The PRESSED/NOT_PRESSED distinction is a declared repeat-processing guard, not a proven native idempotence or transaction lock.

Bone carving recipes require an unrotten body component with ANY_BONE_MATERIAL plus a preserved edged tool. They emit separate figurine/ring/earring/scepter/amulet/bracelet/crown/gem products deriving material from the bone. Adventure mode is enabled; skill is BONECARVE. The output is not the old input object renamed in place. Retaining an edged tool does not preserve the consumed bone or specify refunds if the worker is interrupted.

No selected recipe defines reserve, begin, partial consumption, cancel, refund, invalid-container cleanup or output-insertion failure. Those are named native job-system gaps. A `cancels` announcement formatter would show feedback, not necessarily release a reservation or restore a reagent. Native work cancellation must be proven by following the actual state mutation and caller, not by a notification string.
