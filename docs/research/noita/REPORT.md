# Noita: materials and techniques source pass

Noita's useful lesson is to keep **material identity, physical properties,
contents and use route separate**. The same oil can burn on the floor,
protect a stained body and cause a different effect when swallowed. Spells
work as a small interpreter with shared cast groups and nested payloads,
so a modifier is more than a bonus attached to the next card.

The owned install finished successfully. I extracted and hash-checked its
readable data without launching it. This pass covers 468 material records,
330 active reaction records, 422 spell actions and 106 perks. Counts cover
the catalogues; detailed reading covers the specific systems listed in
[COVERAGE.json](COVERAGE.json). Native engine behavior remains qualified.
No gameplay changes, build, save access, uninstall or commit were made.

All adaptations here are **proposals**. E4, E4B and SHARED_VOCABULARY remain
unchanged. Raw data and full extracted reaction structures stay private at
`~/.codex/research/noita/`. Start with the corrections below, then the ranked
proposals. Detailed source paths resolve against that private extraction.

## Confirm or correct the memory-based N1 to N11

| Code | Verdict | Source evidence and correction |
|---|---|---|
| N1 | Confirm data model, correct universality | `data/materials.xml`: 224 roots and 244 children; physics fields, nested status routes and explosion configuration. Properties describe many materials, but explicit scripts and native hooks also special-case behavior. No universal strength/quality scale. |
| N2 | Correct “exactly E4” | `data/materials.xml:14862`, `:15219`, `:15793`, `:16854`: 325 Reaction and 5 ReqReaction. Exact IDs and tag families coexist; 32 records need a third input, some require age/direction/area, some spawn entities. Acid targets corrodible matter, not everything. |
| N3 | Correct oil and general status claims | `data/scripts/status_effects/status_list.lua:16`: OILED protects from fire; loose oil remains burnable (`data/materials.xml:5854`). Coating amount, status threshold and removal are distinct. Do not model oil on a body as simply a fire-strength bonus. See body digest for wet/fire details. |
| N4 | Confirm route, correct blanket effect | `data/materials.xml:7090`: invisibility coating and ingestion differ. Ingestion can have a material-specific effect, dose or delay; not every liquid grants its contact effect. Engine ingestion behavior is partly documented, not fully recovered. |
| N5 | Confirm tools, correct single-material flask | `data/entities/items/pickup/potion.xml`, `powder_stash.xml`; official `tools_modding/component_documentation.txt`: material inventory counts each type. Flasks can hold mixtures; powder pouch is not drinkable. Capacity, contents, pour and break are separate state. |
| N6 | Community-supported, engine inference | No active secret-recipe generator found in shipped Lua/XML. `data/materials.xml:16187` is a commented-out healing recipe; `:16116` is active precursor conversion. Community NARG reconstructs seed-based LC/AP recipes, explicitly separate from verified installed logic. [Alchemy note](ALCHEMY_AND_SUBSTITUTION.md). |
| N7 | Confirm composition, correct scope | `data/scripts/gun/gun.lua:146`, `:202`, `:335`, `:575`; `gun_actions.lua:4018`, `:5573`: deck/hand/discard, shared group modifier state, fresh nested payload state and special always-cast route. Payload is assembled and paid before impact. |
| N8 | Correct fungal shift classification and duration | `data/scripts/status_effects/effect_trip_03.lua:1`; `data/scripts/magic/fungal_shift.lua:119`, `:176`: TRIP calls world conversion. Cooldown is not expiry. Blood changes and immunity perks are real (`data/scripts/perks/perk_list.lua:931`, `:1280`). |
| N9 | Confirm body-transform route, qualify retained state | `data/entities/misc/effect_polymorph.xml:5`; official `tools_modding/component_documentation.txt:994`: named polymorph effects and serialized original entity state. Exact restore, held gear and control behavior remain native. Keeping a YAIR soul/person across body swaps is our proposal. |
| N10 | Confirm reuse, correct “universal” | `data/genome_relations.csv`, animal damage/genome components and `perk_list.lua:931`: shared material/damage components, explicit herd affinities and enemy-usable perks. Immunities, shooter exemptions and friendly-fire flags make outcomes asymmetric. Not every creature has every player verb. |
| N11 | Confirm layered gates, limit coverage | Orb/tablet scripts and ending entry logic use IDs, persistent unlock flags, run flags and counts (`data/entities/animals/boss_centipede/ending/sampo_start_ending_sequence.lua:47`). These are separate forms of progression. Brief structural review does not solve or enumerate every secret. [Body/world digest](BODY_WORLD_DIGEST.md). |

## Ranked proposals for the emergent-system owners

The ranking is a recommendation, not a selected implementation order.

| Rank/code | Proposal | Owner to change if selected | Why and smallest proof |
|---|---|---|---|
| 1 / P1 | Distinguish exact ingredient rules from property-profile rules | E4 §2/4, E4B Q11, shared selector vocabulary | Noita uses both. A torch accepts two fuels by profile; a lore-bound tincture still needs its named reagent. |
| 2 / P2 | Save composition amounts and constituent identity before deriving tags | E4 §9/11, E4B containers | Flasks hold mixtures. Dilute a poison, reload and still retain its dose; distinguish catalyst from spent input. |
| 3 / P3 | Dispatch stain, swallow, heat and impact separately | E4 contact kinds, E4B N3/N4, shared route names | Oil coating and loose fuel differ. Pour, drink and throw one liquid and show three explicit outcomes. |
| 4 / P4 | Make magnitude, purity, amount, condition and local grade independent axes | E4 fit, E4B quality table | A stronger substitute can fail a safe range. Compare resin and outside-world fuel without one global power score. |
| 5 / P5 | Compile technique parts into groups and prepaid payloads | E4B N7, shared technique terms | A modifier before multicast changes the group; child scope resets by policy. Two casts show the difference and explain cost at assembly. |
| 6 / P6 | Save secret recipes as versioned resolved results | E1 discovery contract, E4B N6 | Catalogue edits must not change an existing world's secret. Export/import retains exact ingredient roles and discovery history. |
| 7 / P7 | Separate scope, lifespan, acquisition stacking and effect operator | E4 layers, E4B N8, shared owned-effect fields | Personal blood, timed immunity and one-off world mutation are different. Two sources compose and removal restores derived state correctly. |
| 8 / P8 | Add explicit higher-arity, absence and bounded-area rule adapters | E4 schema/scheduler, shared participant/contents facts | Current binary contact shape loses third ingredients and missing air. One mushroom growth rule and one starvation rule give clear receipts. |
| 9 / P9 | Give bodies shared reaction routes with authored immunity and faction exceptions | E3 body/people, E4B N9/N10 | Same contact can affect a human and construct differently for stated reasons. Herd reaction and owner-only immunity remain separate. |
| 10 / P10 | Treat discovery as observed evidence, not instant complete knowledge | E4 known rules, E6 lore, E4B Q14 | One failed substitute teaches one tested trait. Safe known mode and risky trial stay available if selected; Q14 remains open. |

[IMPLEMENTATION_PACKETS.json](IMPLEMENTATION_PACKETS.json) makes these
reviewable future slices, with exclusions and acceptance gates. The packets
do not authorize building them.

## Twenty-six small touches for existing YAIR play

All T rows are original proposals grounded in the cited pattern. These are
an inventory, not 26 tasks for Weibao.

| Code | Small touch | Existing YAIR surface | Source pattern |
|---|---|---|---|
| T01 | A washing choice names which coating it removes | Village river/center action | Stain routes and protection thresholds |
| T02 | Rain cools a worker without claiming all coatings vanished | Weather/active effects | Wet and stain accumulators |
| T03 | Oil coating and spilled fuel get different log text | Combat/use-item | OILED versus burnable material |
| T04 | A sip shows known dose and unknown inner traits | Inventory consumables | Ingestion versus stains |
| T05 | A flask tooltip lists each constituent and amount | Native item tooltip | Count per material type |
| T06 | Shake a mixture to speed a known reaction | Alchemy action | Official container reaction/shake fields |
| T07 | “Keep catalyst” appears in the craft cost preview | Crafting panel | Retained reactants in reaction outputs |
| T08 | A hot crucible needs a quench vessel before work starts | Smelting | Molten variant plus water |
| T09 | Quenching leaves a named steam byproduct | Craft outcome/event feed | Lava/water outputs |
| T10 | Brine and plain water yield different cooled products | Material choice | Lava/brine versus lava/water |
| T11 | Rust risk names the relevant wet exposure | Equipment inspect | Rust family plus water |
| T12 | Dry seeds show the missing moisture requirement | Gathering/farming proposal | Plant seed plus water |
| T13 | A mushroom patch changes after its feed changes | Location work | Blood/water/alcohol seed variants |
| T14 | Cooking stops at done unless overcook is chosen | Native cooking | Warm, hot, done, burned stages |
| T15 | A harmless-looking brew loses a useful effect when diluted | Alchemy/discovery | Water removes invisibility liquid |
| T16 | A focus compares refill rate beside reservoir | Equipment comparison | Procedural wand mana tradeoffs |
| T17 | Technique preview draws root and child scope | Native skill detail | Fresh trigger payload modifier state |
| T18 | Empty charges show the skipped part and changed result | Combat/event feed | Draw-time skip route |
| T19 | An attached part says how its cost differs | Equipment/technique | Always-cast special route |
| T20 | A repeat perk shows operator, cap and availability separately | Power inspect | Perk pool versus callback math |
| T21 | A blood change affects what leaks after injury | Body/active effects | Blood-material assignment |
| T22 | A world shift lists affected material group and cause | Chronicle/life record | Fungal conversion receipt |
| T23 | A transform preserves person identity but declares lost verbs | Body/center actions | Polymorph component contract |
| T24 | A faction response identifies the herd pair involved | Encounter log | Explicit genome affinity matrix |
| T25 | A notebook separates seen recipe, understood rule and unlock | Adventure notebook | Secret knowledge versus persistent gates |
| T26 | A dangerous technique preview names self-hit exemptions | Combat tooltips | Projectile owner/friendly-fire fields |

## Digests and evidence

- [Material/reaction digest](MATERIAL_REACTION_DIGEST.md), with complete field
  inventory, both tag vocabularies, structural counts and
  [30 proposed rule examples](REACTION_EXAMPLES.json).
- [Composition digest](COMPOSITION_DIGEST.md), with cast groups, payloads,
  evaluation order, draw/cost rules and focus tradeoffs.
- [Perks and shifts](PERKS_FINDINGS.md), [body/world digest](BODY_WORLD_DIGEST.md), [brief gates](PROGRESSION_NOTES.md)
  and [alchemy/substitution note](ALCHEMY_AND_SUBSTITUTION.md).
- [INTAKE.json](INTAKE.json), [TOOLING.md](TOOLING.md),
  [FINDINGS.json](FINDINGS.json), [COVERAGE.json](COVERAGE.json) and
  [CHECKPOINT.md](CHECKPOINT.md).

The source audit can finish without a gameplay gate because this assignment
forbids launch and builds. Open limits are engine internals and exhaustive
secret coverage, recorded rather than inferred. Any selected YAIR slice
still needs its own rebuilt fresh-browser proof and persistence checks.
