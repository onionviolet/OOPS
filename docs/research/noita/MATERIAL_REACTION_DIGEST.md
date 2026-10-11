# Material and reaction digest

Source pass, Steam build 17130612, 2026-10-09. Paths below are relative to
`~/.codex/research/noita/data/`. Analysis is static, not a gameplay test.
All YAIR rules and numbers are proposals. [Report](REPORT.md).

Noita uses both material identity and tag families. A single liquid may be
fuel in a puddle, a protective coating on a body, and harmful food when
swallowed. One averaged tag bundle cannot preserve those distinctions.

## Counts and bounds

| Kind | Active records | Meaning |
|---|---:|---|
| Base materials (`CellData`) | 224 | Authored root definitions |
| Child materials (`CellDataChild`) | 244 | Parent plus overrides |
| Contact reactions (`Reaction`) | 325 | Contact/neighbor transformations |
| Required surroundings (`ReqReaction`) | 5 | Source comments describe decay when needed surroundings are missing |
| Two-input reactions | 298 | Includes all 5 required-surrounding records |
| Three-input reactions | 32 | Presence of `input_cell3`, not a three-unit recipe |
| Exact input selectors only | 168 | Material IDs, including required-surrounding records |
| At least one tag input selector | 162 | Bracket families, including suffix expressions |
| Direction constraint | 18 | Pixel direction, not a YAIR contact kind |
| Area radius fields | 43 | Each has radius1 and radius2 |
| Entity-producing reactions | 5 | A transformation can spawn more than materials |
| Explicit lifetime condition | 5 | Source units need engine qualification |
| Third output | 15 | Omitted third outputs must not be guessed |

Counts come from parsed live XML, excluding commented-out reactions.
`materials.xml:14862` begins the reaction section; `:15793` begins the
required-surrounding examples. Full reaction attributes, record kind and
source line are extracted privately in `REACTIONS_FULL.json`, all 330
records. Raw structure stays outside git. `MATERIAL_STATS.json` retains
field frequencies. This audit does not count inherited expansion or runtime
secret recipes as new authored records. `data/temp/materials.xml` is a
separate stale/development file, not added to the shipped table counts.

## Properties to carry into E4

| Noita fields | Proposed YAIR representation | Qualification |
|---|---|---|
| `name`, `ui_name` | Stable material identity plus local display name | Keep identity distinct from shared property tags |
| `_parent`, `_inherit_reactions` | Template parent and explicit reaction inheritance policy | Do not flatten child tags by taking a union without a declared policy |
| `tags` | Boolean material families | Source tags have no universal strength 1 to 9 |
| `cell_type`, `liquid_sand`, `liquid_static`, `solid_static_type` | Phase, mobility and powder/solid flags | Powder is not simply another `cell_type` |
| `density`, `liquid_viscosity`, `stickyness`, `slippery` | Numeric fields with units chosen for this world | Density is not overall potency or quality |
| `burnable`, `autoignition_temperature`, `fire_hp`, `temperature_of_fire`, `requires_oxygen`, `on_fire` | Fuel, ignition threshold, burn budget, heat, oxygen requirement, active state | Burning state and capacity to burn are separate |
| `generates_smoke`, `generates_flames`, `on_fire_*` | Authored byproducts and ignition outputs | Do not assume every fire emits the same smoke |
| `electrical_conductivity` | Numeric conductive response | A tag may index the rule; the numeric response does the work |
| `warmth_melts_to_material`, `cold_freezes_to_material`, `warmth_melts_chance_rev` | Phase-change target and rate policy | Not ordinary recipe quality |
| `hp`, `durability`, `crackability`, collision/break fields | Resistance and impact behaviors | Noita has special body/physics hooks, not only contact table rules |
| `liquid_stains`, `liquid_stains_self`, stain thresholds/drop fields | Coating eligibility, accumulation and removal policy | Do not equate material quantity with status strength |
| `status_effects`, nested `StatusEffects/Stains`, `StatusEffects/Ingestion` | Distinct contact and ingestion dispatch | The routes may give opposing results |
| `danger_*`, `always_ignites_damagemodel` | Hazard hints and direct engine behavior | Some rules are outside the reaction table |
| `Graphics`, audio, `wang_*` | Presentation metadata | Exclude from crafting fit |
| `ExplosionConfig`, `ParticleEffect` | Hazard and visible event adapters | Need explicit YAIR effects, not copied physics |

Water explicitly has density 4 and freeze/melt targets (`materials.xml:5603`).
Oil is burnable and has conductivity 0 (`:5854`). These are facts about the
source table, not YAIR numeric defaults. Nested effects and burn/explosion
configuration disprove N1's claim that nothing is special-cased.

## Full reaction shape

Every live reaction has `probability`, `input_cell1/2`, `output_cell1/2`.
Optional fields and their record counts:

| Field | Count | Proposed mapping |
|---|---:|---|
| `input_cell3` | 32 | Explicit third participant or a mix component predicate |
| `output_cell3` | 15 | Explicit third transformation, only when declared |
| `blob_radius1`, `blob_radius2` | 43 each | Bounded coarse area/quantity effect |
| `blob_restrict_to_input_material1/2` | 37 / 27 | Restrict conversion to matched constituents |
| `req_lifetime` | 5 | Minimum age fact, not unqualified minutes |
| `direction` | 18 | Place relation such as exposed surface, authored per world |
| `fast_reaction` | 20 | Scheduling rate, separate from probability |
| `destroy_horizontally_lonely_pixels` | 7 | Geometry cleanup, omit from text RPG |
| `entity` | 5 | Spawn an entity with custody and cause |
| `cosmetic_particle` | 11 | Presentation hint |
| `audio_fx_volume_1` | 26 | Presentation hint |

`probability` includes 0 and fractional 0.3. It is a source reaction-rate
parameter. A YAIR `chance` per contact or per minute is not an equivalent
unit. Choose cadence first, then calibrate probability. Do not divide by
100 and call the result a verified Noita outcome chance.

Selectors include exact names, `[family]`, and four input expressions with
`[family]_suffix`. Output selectors can preserve the matched material or
refer to a related variant such as molten material (`:15248`). Preserve
that binding through a rule; do not transform everything to a literal tag.
The exact expansion and ordering is engine-side and was not recovered.
`[any_liquid]` is used by a reaction but is absent from the explicit material
tag vocabulary. It may be an engine family; it must not be assumed to be a
missing tag on every liquid (`:16821`).

For E4, keep `a`, `b`, `via` and `place`, but add named participants for
higher-arity reactions and a contents map. Give exact identity predicates
an explicit route. The present draft forbids named materials in rules;
Noita is evidence for revising that restriction. Generic families and exact
local recipes can coexist. `ReqReaction` belongs to a `tick` rule whose
known surroundings predicate is false, not ordinary contact with air.
The comments at `:15792` and `:15804` do not establish every engine detail
of that record kind, so do not copy its negation semantics blindly.

## Thirty representative reactions as proposed rule data

[REACTION_EXAMPLES.json](REACTION_EXAMPLES.json) contains 30 paraphrased
records. Each has a source line and short source summary, then an E4-style
proposal with layer, trigger, patterns, effects, stream and explanation.
The source rate is metadata, separate from proposed chance. Exact identity
is carried as an explicit proposed `material_id.*` indexing tag. Third
inputs use a proposed contents fact, with a positive tag in `a`.
No such adapter exists yet. Amounts, outputs and cadence need authored
conservation policies before execution.

| Range | Examples | What they teach |
|---|---|---|
| R01 to R06 | Cement cure, condensation, melting, cooling, purification, salt dissolution | Age, phase and retained catalysts |
| R07 to R12 | Brine boil, acid corrosion, quench, lava with water/mud/brine | More than one output and differing local products |
| R13 to R18 | Evaporation, growth, mushrooms, grass recovery, seed growth, air starvation | Absence, nourishment and place conditions |
| R19 to R24 | Cold blood freeze, rust, mud, precursor activation, gold conversion, purification | Family substitution versus identity |
| R25 to R30 | Combined buffs, mana conversion, invisibility dilution, polymorph mix, cooking, creature powder | Compounds, harmful mixing and spawned bodies |

## Complete tag vocabulary

These are identifiers for source comparison, not a proposal to add all of
them to SHARED_VOCABULARY. Counts below reflect explicitly written tags,
not engine-expanded families. Numeric physics fields are separate.

Material tags (76): `NO_FUNGAL_SHIFT`, `acid`, `alchemy`, `blood`, `box2d`, `burnable`, `burnable_fast`, `chaotic_transmutation`, `cold`, `corrodible`, `earth`, `evaporable`, `evaporable_by_fire`, `evaporable_custom`, `evaporable_fast`, `fire`, `fire_lava`, `fire_strong`, `food`, `freezable`, `frozen`, `fungus`, `gas`, `gold`, `grows_fungus`, `grows_grass`, `hax`, `hot`, `ice`, `impure`, `indestructible`, `lava`, `liquid`, `liquid_common`, `magic`, `magic_faster`, `magic_liquid`, `magic_polymorph`, `matter_eater_ignore_list`, `meat`, `meltable`, `meltable_by_fire`, `meltable_metal`, `meltable_metal_generic`, `meltable_plastic`, `meltable_to_acid`, `meltable_to_blood`, `meltable_to_cold`, `meltable_to_lava`, `meltable_to_lava_fast`, `meltable_to_poison`, `meltable_to_radioactive`, `meltable_to_slime`, `meltable_to_water`, `mimic_liquid`, `molten`, `molten_metal`, `plant`, `radioactive`, `regenerative`, `regenerative_gas`, `requires_air`, `rust`, `rust_box2d`, `rust_oxide`, `sand_ground`, `sand_metal`, `sand_other`, `slime`, `snow`, `solid`, `soluble`, `static`, `sunbaby_ignore_list`, `vapour`, `water`.

Tags used by reaction input selectors (52): `acid`, `alchemy`, `any_liquid`, `burnable`, `burnable_fast`, `cold`, `corrodible`, `evaporable`, `evaporable_by_fire`, `evaporable_custom`, `evaporable_fast`, `fire`, `fire_strong`, `freezable`, `frozen`, `fungus`, `gold`, `grows_fungus`, `grows_grass`, `ice`, `impure`, `lava`, `liquid`, `magic_faster`, `meat`, `meltable`, `meltable_by_fire`, `meltable_metal`, `meltable_metal_generic`, `meltable_plastic`, `meltable_to_acid`, `meltable_to_blood`, `meltable_to_cold`, `meltable_to_lava`, `meltable_to_lava_fast`, `meltable_to_poison`, `meltable_to_radioactive`, `meltable_to_slime`, `meltable_to_water`, `molten_metal`, `radioactive`, `regenerative`, `requires_air`, `rust`, `rust_box2d`, `rust_oxide`, `sand_ground`, `sand_metal`, `slime`, `static`, `vapour`, `water`.

## Complete material attribute inventory

Counts are explicit declarations among 468 definitions, before inheritance.

| Field | Count |
|---|---:|
| `_inherit_reactions` | 189 |
| `_parent` | 250 |
| `always_ignites_damagemodel` | 21 |
| `audio_event_name` | 3 |
| `audio_is_soft` | 20 |
| `audio_materialaudio_type` | 35 |
| `audio_materialbreakaudio_type` | 6 |
| `audio_physics_material_event` | 49 |
| `audio_physics_material_solid` | 212 |
| `audio_physics_material_wall` | 213 |
| `audio_size_multiplier` | 6 |
| `autoignition_temperature` | 106 |
| `burnable` | 226 |
| `cell_holes_in_texture` | 5 |
| `cell_type` | 223 |
| `cold_freezes_to_dont_do_reverse_reaction` | 1 |
| `cold_freezes_to_material` | 14 |
| `collapsible` | 1 |
| `color` | 3 |
| `convert_to_box2d_material` | 11 |
| `crackability` | 13 |
| `danger_fire` | 22 |
| `danger_poison` | 3 |
| `danger_radioactive` | 8 |
| `danger_water` | 4 |
| `density` | 232 |
| `durability` | 64 |
| `electrical_conductivity` | 47 |
| `explosion_power` | 1 |
| `fire_hp` | 76 |
| `generates_flames` | 4 |
| `generates_smoke` | 204 |
| `gfx_glow` | 151 |
| `gfx_glow_color` | 18 |
| `hp` | 209 |
| `ignore_self_reaction_warning` | 1 |
| `is_just_particle_fx` | 1 |
| `lifetime` | 35 |
| `liquid_damping` | 6 |
| `liquid_flow_speed` | 10 |
| `liquid_gravity` | 185 |
| `liquid_sand` | 187 |
| `liquid_sand_never_box2d` | 2 |
| `liquid_slime` | 5 |
| `liquid_solid` | 1 |
| `liquid_sprite_stain_ignited_drop_chance` | 3 |
| `liquid_sprite_stain_shaken_drop_chance` | 27 |
| `liquid_sprite_stains_check_offset` | 15 |
| `liquid_sprite_stains_status_threshold` | 14 |
| `liquid_stains` | 65 |
| `liquid_stains_custom_color` | 1 |
| `liquid_stains_self` | 29 |
| `liquid_static` | 39 |
| `liquid_sticks_to_ceiling` | 30 |
| `liquid_viscosity` | 45 |
| `name` | 468 |
| `on_fire` | 230 |
| `on_fire_convert_to_material` | 1 |
| `on_fire_flame_material` | 4 |
| `on_fire_smoke_material` | 2 |
| `platform_type` | 106 |
| `requires_oxygen` | 220 |
| `show_in_creative_mode` | 248 |
| `slippery` | 14 |
| `solid_break_on_explosion_rate` | 6 |
| `solid_break_to_type` | 38 |
| `solid_collide_with_self` | 25 |
| `solid_friction` | 95 |
| `solid_go_through_sand` | 5 |
| `solid_gravity_scale` | 11 |
| `solid_on_break_explode` | 1 |
| `solid_on_collision_convert` | 1 |
| `solid_on_collision_explode` | 6 |
| `solid_on_collision_material` | 32 |
| `solid_on_collision_splash_power` | 9 |
| `solid_on_sleep_convert` | 10 |
| `solid_restitution` | 20 |
| `solid_static_type` | 50 |
| `stainable` | 7 |
| `status_effects` | 70 |
| `stickyness` | 11 |
| `supports_collapsible_structures` | 4 |
| `tags` | 325 |
| `temperature_of_fire` | 208 |
| `ui_name` | 465 |
| `vegetation_full_lifetime_growth` | 9 |
| `vegetation_random_flip_x_scale` | 1 |
| `vegetation_sprite` | 9 |
| `wang_color` | 468 |
| `wang_curvature` | 19 |
| `wang_noise_percent` | 26 |
| `wang_noise_type` | 13 |
| `warmth_melts_chance_rev` | 5 |
| `warmth_melts_to_material` | 15 |
