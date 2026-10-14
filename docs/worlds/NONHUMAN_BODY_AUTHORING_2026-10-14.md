# Nonhuman bodies as authored data, 2026-10-14

Status: **INFERRED proposal**, BODIES AS AUTHORED DATA lane, covering OT4, OT11, N26 and N32-N34. Not accepted design, executable content, implemented gameplay or browser proof. Only this report and the [authoring checkpoint](../gm/dispatch/nonhuman-starts-2026-10-14/authoring/CHECKPOINT.md) are owned here.

Evidence: **SHOWN** = inspected source or dossier summary, not runtime observation; **STATED** = attributed user/design direction; **INFERRED** = interpretation/proposal; **UNKNOWN** = unresolved. All formats, examples, constraints, checklists, lint, fixtures and suggested gates below are INFERRED unless explicitly labeled otherwise. No MEMORY lore, raw novel prose, sealed files or user saves are used.

**STATED (Weibao, via COMMON/PROJECT/USER_VISION):** useful meals, no hunger death, desktop/laptop first, mobile deferred, one realm and one prestige layer, finish one playable slice before another. This report adds authoring contracts to the [requirements owner](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md), not a new priority list. Reviewed E1-E15, N1-N42, C1-C11 and OT1-OT16. Out-of-lane requirements are referenced where they constrain authoring, not expanded into new systems.

## 1. Reuse sibling owners and current seams

| Owner | Codes consumed here; boundary |
|---|---|
| [ENGINE_SPEC](NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md) | Schema section 2, E1-E15, B12-B21, T1-T10 and Slice 1/2. Owns anatomy truth, effective queries, native routing and migration. This lane makes its compact examples explicit, without replacing its schema. |
| [PLAY](NONHUMAN_STARTS_PLAY_2026-10-14.md) | BK1 hound, BK3 sapling, BK6 blade; NP1-NP14, especially positive verbs, needs, agency and offspring. Owns the play loops; this lane specifies their authoring inputs. |
| [BY_WORLD](NONHUMAN_STARTS_BY_WORLD_2026-10-14.md) | W01-W16, NC1/NC2/NC4/NC6/NC10/NC14 and NX3/NX4/NX8/NX9. Owns canon eligibility, cognition, carriers and institutions. Do not regenerate its species catalog. |
| [PROTAGONIST_MECHANICS](NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md) | TM1-TM7, NM1-NM12. Acquisition, analysis, expression, mastery, naming and evolution remain separate authored outcomes; a body function is not a complete Predator power. |
| [TRANSFORMATION](NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md) | TF1-TF12, TX1-TX16, especially TX3/TX4. Owns transition manifests; templates supply before/after configurations, not a second transition resolver. |
| [SENSES/UI](NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md) | SU1-SU7 and SS1-SS5. Owns qualified perception/reach and desktop presentation; templates declare channels, not prose truth or global identity detection. |
| [SOCIETY](NONHUMAN_SOCIETY_LAW_AND_ECONOMY_2026-10-14.md), [BONDS](NONHUMAN_BONDS_AND_PARTIES_2026-10-14.md) | SL1-SL16; BD5/BD8/BD10/BD16/BD18. Local law, actual title, holder, bond and controller use separate owners. No species-level friendship or citizenship flag. |
| [PROGRESSION](NONHUMAN_PROGRESSION_AND_BALANCE_2026-10-14.md), [MONSTER_SIDE](NONHUMAN_MONSTER_SIDE_2026-10-14.md) | PG1/PG3-PG8/PG11-PG13; MS18-MS21. Credit actual learners, preserve inequality when sourced, distinguish drops/XP/growth and price actual services. |
| Paradise [CANON_PRIORITY](paradise-hub/CANON_PRIORITY_PLAN_2026-10-14.md), [BEINGS](paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md), [MISSIONS](paradise-hub/DERIVED_WORLDS_AND_MISSIONS_2026-10-14.md), [HUB_LIFE](paradise-hub/HUB_LIFE_ECONOMY_AND_PEOPLE_2026-10-14.md) | CRP7/CRP8, BS1-BS5/PB1-PB5, DM8/DM11, HL5/HL11/HL13. Source profile, temporary vessel, partner, hub work and rewards stay distinct. These references confer no native nonhuman admission. |

### SHOWN: inspected source anchors

| Locator | What exists; authoring implication (INFERRED) |
|---|---|
| `src/structured_pack_definitions.js:7-9,32-39,70-73,101-117,135-145` | Declared registry families, JSON-only schema2 pack compiler, collision preflight, immutable output. No registered body-template family in the lists. Extend explicitly rather than hide grants in unknown metadata. |
| `src/structured_pack_runtime.js:6-24,28-31,66-78` | Typed starts accept scalar bodies, require player owner/controller, test every start's form against the current body, then copy selected body on admission. Nested examples below cannot pass this validator as written. |
| `src/enemies.js:39-95,319-347` | Enemy includes stats, tags, size, loot, foe XP and callbacks; constructor derives max_health from health. Rank is bestiary order (`:61`), not a playable growth tier. Wolf is a reusable combat baseline, not a completed body template. |
| `src/races.js:7-8,25-32,58-239` | Race palette has descriptions/tags/stat and XP modifiers, with a cosmetic-use notice. No anatomical function map. Keep lineage/appearance separately from physical configuration. |
| `src/data/locations.js:378-409` | Village people and tier-one craft stations exist. Shack is locked and gives housing/Sleeping XP. A den, root patch and blade rack are proposed anchors, not aliases that silently unlock Shack. |
| `src/data/locations.js:469-503,1985-2008` | Infested field is locked combat; woodcutting has a tool and output rules. A friendly scent search or living sap production is new content, not permission to bypass either action. |

**STATED (authoring owners):** [ABILITY_AUTHORING](ABILITY_AUTHORING.md), causal execution/comparison sections, requires actual source, method, body, support, target, custody and effects. [ENGINE_AUTHORING](../ENGINE_AUTHORING.md), state owners/register/execute/body sections, requires pure previews, immutable definitions, frozen commitments, one publisher and actual observation. [Procgen status](../PROCEDURAL_GENERATION_STATUS_2026-10-13.md) distinguishes detached work from integrated features; [story palette](../PROCEDURAL_STORY_AND_CONTENT_CONSIDERATIONS_2026-10-14.md) C1-C8/F2/V/S-4/S-5 calls for source profiles, revisioned generation, shared vocabulary, known-context projection and lint/replay. Their historical branch/test statements are STATED by those documents, not refreshed here.

## 2. Proposed authoring format

Default: a JSON content envelope contains immutable `templates`, separately revisioned `statProfiles`, and `starts`. A template uses the ENGINE_SPEC section 2 fields. The envelope is **illustrative schema1**, unrelated to current structured-pack schema2. Proposed content-file location is `content/body_packs/<packId>.json`; that directory and loader are not created here. Dial: pack-local JS exports can hold the same JSON data if project packaging favors them. No callbacks, expressions evaluated as code, timers or stocks inside a template.

### Template, instance and start are different records

| Record | Field ownership |
|---|---|
| Template | `schema`, `templateId`, `templateRevision`, `form`, `lineage`, `functions`, `slots`, `intake`, `rest`, `defeat`, `presence`, `mobility`, `size`, `lifespan`, `stages`, `statTemplate`, `skillCarryRules`, `extensions`. All are present in the examples. IDs/revisions resolve against the same compiled manifest. |
| Instance | `schema`, `id`, `templateId`, `templateRevision`, `ownerId`, `controllerId`, `personId`, `lifeId`, `instanceId`, current stage, endpoint/carrier bindings, actual conditions/reserves. First slice remains in `simulation.people.player.body`, as proposed by ENGINE_SPEC. No extra body-save namespace. |
| Start | Source/era/provenance, mind and selected seat, concrete instance initializer, first useful verbs, witness, routine, support, defeat/continuation preview and save decision. These belong to origin/admission content, not immutable species anatomy. |

To reconcile the engine spec's combined field list, the effective resolved body view joins template and instance; immutable defaults never contain a particular player's ownership or damage. Presence `body.location` and `body.id` below are declared binding tokens for this proposal, not strings that current code resolves. An object instance overrides `carrierBodyId` only after a valid carrying transaction. Snapshot the selected template revision and changes, not the live mutable template object. Unknown revisions preserve/export original saves and suspend unsupported actions before mutation.

Function capacities are finite nonnegative quantities, not skill levels. Missing function means unavailable. `constraints` here is a JSON predicate object with the same conceptual `all/any/eq/gte` grammar as authoring requirements; proposed names such as `bodyStage` and `holderContact` require an explicit fact adapter. `channel` declares the means. Source/condition grants augment the effective view with provenance only while actually supported. `read` is sensory access, not learned Literacy; `influence.advice` needs a recipient/channel; `move.root` never means travel. Proposed local extensions cannot execute arbitrary fields.

Slots do not create equipment or inventory. Policies below have literal declarative values; an implementation must whitelist and bind each value to an existing owner or add a selected adapter. No reference to an unwritten magic policy grants behavior. `statProfiles` provides the complete numerical pool/attack profile for each example so `statTemplate` is resolvable within its envelope. These are proposed profile definitions, not existing native stat syntax. Skill classification values are inline, with unknown skills requiring method review rather than guessed transfer.

### BA-E1: Village hound (BK1)

Default: mobile scent-led life, no human fine manipulation. Dial: a supplied speech/telepathy source can add a real channel later. Reasonably: bark and posture are signals interpreted by an actual witness; they do not supply universal language or consent. Numbers are provisional original balance values.

```json
{
  "schema": 1,
  "packId": "village.bodies",
  "revision": 1,
  "templates": [
    {
      "schema": 1,
      "templateId": "village.bodies.hound",
      "templateRevision": 1,
      "form": "hound",
      "lineage": null,
      "functions": {
        "see": {
          "capacity": 1,
          "channel": "visible"
        },
        "hear": {
          "capacity": 1,
          "channel": "sound"
        },
        "smell": {
          "capacity": 1,
          "channel": "scent"
        },
        "sense.contact": {
          "capacity": 1,
          "channel": "touch"
        },
        "signal.scent": {
          "capacity": 1,
          "channel": "scent_mark"
        },
        "sign": {
          "capacity": 1,
          "channel": "posture"
        },
        "move.walk": {
          "capacity": 1,
          "channel": "quadruped"
        },
        "move.carried": {
          "capacity": 1,
          "channel": "physical_carrier"
        },
        "eat.food": {
          "capacity": 1,
          "channel": "mouth"
        },
        "attack.bite": {
          "capacity": 1,
          "channel": "jaw",
          "constraints": {
            "eq": {
              "fact": "jawUsable",
              "value": true
            }
          }
        },
        "wear.collar": {
          "capacity": 1,
          "channel": "neck"
        },
        "wear.harness": {
          "capacity": 1,
          "channel": "torso"
        }
      },
      "slots": [
        {
          "id": "collar",
          "count": 1,
          "requires": [
            "wear.collar"
          ],
          "fitTags": [
            "canine_neck"
          ],
          "maxSize": "medium",
          "custodyPolicy": "existing_item_title_and_holder"
        },
        {
          "id": "harness",
          "count": 1,
          "requires": [
            "wear.harness"
          ],
          "fitTags": [
            "quadruped_torso"
          ],
          "maxSize": "medium",
          "custodyPolicy": "existing_item_title_and_holder"
        }
      ],
      "intake": {
        "modes": [
          "food"
        ],
        "mealBenefitsPolicy": "compatible_meal_adds_recovery_bonus",
        "upkeepPolicy": "no_passive_food_debit",
        "shortagePolicy": "ordinary_unfed_play_remains_viable; no_hunger_death"
      },
      "rest": {
        "mode": "sleep",
        "supportedAt": [
          "agreed_den",
          "safe_local_shelter"
        ],
        "recoveryPolicy": "played_rest_recovers_own_stamina; meal_bonus_optional"
      },
      "defeat": {
        "trigger": "health.zero",
        "outcome": "incapacitated",
        "recoveryAnchor": "agreed_local_refuge_or_actual_helper",
        "lossPolicy": "retain_identity_stock_knowledge; injuries_have_actual_owner",
        "continuationPolicy": "care_and_recovery; no_forced_human_form"
      },
      "presence": {
        "kind": "material",
        "endpointRef": "body.location",
        "anchorRef": null,
        "reach": {
          "sense": "same_place_supported_channel",
          "effect": "contact",
          "message": "local_signal"
        },
        "carrierBodyId": null,
        "memberBodyIds": []
      },
      "mobility": {
        "modes": [
          "walk",
          "carried"
        ],
        "routeConstraints": [
          "actual_access",
          "body_fit",
          "carrier_route_if_carried"
        ],
        "carrierPolicy": "actual_carrier_capacity_custody_and_permission"
      },
      "size": {
        "class": "medium",
        "dimensions": null,
        "mass": null,
        "scalePolicy": "class_fit_until_authored_dimensions"
      },
      "lifespan": {
        "mode": "world_defined",
        "duration": null,
        "clockPolicy": "played_exposure_only; no_implicit_offline_age"
      },
      "stages": [
        {
          "id": "adult",
          "threshold": {
            "kind": "selected_start"
          },
          "functionChanges": {},
          "statChanges": {}
        }
      ],
      "statTemplate": "village.bodies.hound.stats",
      "skillCarryRules": {
        "default": "review_per_method",
        "knowledge": "person",
        "motorPractice": "body",
        "mixed": "separate_knowledge_and_motor",
        "sourceFaculty": "actual_source"
      },
      "extensions": {}
    }
  ],
  "statProfiles": [
    {
      "id": "village.bodies.hound.stats",
      "revision": 1,
      "pools": {
        "health": {
          "max": 100
        },
        "stamina": {
          "max": 40
        }
      },
      "stats": {
        "agility": 12,
        "dexterity": 8,
        "intuition": 12,
        "defense": 3,
        "magic": 0
      },
      "attackModes": [
        {
          "id": "bite",
          "requires": [
            "attack.bite"
          ],
          "reach": "contact",
          "power": 12,
          "cadencePerSecond": 1,
          "executor": "body"
        }
      ]
    }
  ],
  "starts": [
    {
      "id": "village.bodies.hound.start",
      "source": {
        "kind": "original",
        "era": "Village opening",
        "evidence": "INFERRED",
        "locator": "NONHUMAN_STARTS_PLAY_2026-10-14.md/BK1"
      },
      "mindKind": "native_person",
      "controlSeat": "direct_single_body",
      "body": {
        "schema": 1,
        "id": "village.bodies.hound.sample_body",
        "templateId": "village.bodies.hound",
        "templateRevision": 1,
        "ownerId": "player",
        "controllerId": "player",
        "personId": "player",
        "lifeId": "village.bodies.hound.sample_life",
        "instanceId": "village.bodies.hound.sample_instance",
        "stage": "adult",
        "endpointRef": "Village",
        "carrierBodyId": null
      },
      "firstVerbs": [
        "follow_known_scent",
        "show_yes_no_posture",
        "escort_guard"
      ],
      "witness": {
        "actorId": "villageGuard",
        "knowledge": "only_received_signal_or_observed_deed"
      },
      "idleRoutine": {
        "id": "known_boundary_circuit",
        "clock": "played",
        "offline": "none",
        "supportLoss": "pause_before_next_reservation"
      },
      "saveDecision": "new_revisioned_body_requires_explicit_migration; old_absent_stays_absent"
    }
  ]
}
```

**Worked consumer trace:** the proposed `follow_known_scent` checks smell, a real trace and route access, then records a scent lead in player knowledge. The guard learns only the reported/demonstrated lead. The circuit reserves its actual next job, not a full infinite patrol. Collar fit is positive; a sword equip request fails for missing wield/grip without disabling scent work. No bite skill is granted by the jaws.

### BA-E2: rooted Village sapling (BK3)

Default: local living patch with useful signals and tended growth. Dial: mobile reedling or a speaking tree requires another template/source. Reasonably: the chosen original plant-person mind and directed leaf signaling are explicit adaptations, not facts about ordinary plants. No distant sight, automatic territory ownership or sap stock.

```json
{
  "schema": 1,
  "packId": "village.bodies",
  "revision": 1,
  "templates": [
    {
      "schema": 1,
      "templateId": "village.bodies.sapling",
      "templateRevision": 1,
      "form": "sapling",
      "lineage": null,
      "functions": {
        "sense.contact": {
          "capacity": 1,
          "channel": "root_or_bark_contact"
        },
        "eat.light": {
          "capacity": 1,
          "channel": "leaf_light"
        },
        "move.root": {
          "capacity": 1,
          "channel": "local_root_growth"
        },
        "sign": {
          "capacity": 1,
          "channel": "directed_leaf_motion"
        },
        "produce.reed_sap": {
          "capacity": 1,
          "channel": "living_tissue",
          "constraints": {
            "all": [
              {
                "eq": {
                  "fact": "tendingSupport",
                  "value": true
                }
              },
              {
                "gte": {
                  "fact": "availableVigor",
                  "value": 2
                }
              }
            ]
          }
        }
      },
      "slots": [],
      "intake": {
        "modes": [
          "light"
        ],
        "mealBenefitsPolicy": "supported_light_or_tending_adds_growth_bonus",
        "upkeepPolicy": "no_passive_lethal_drain",
        "shortagePolicy": "bonus_growth_pauses; safe_signal_or_rest_remains; no_hunger_death"
      },
      "rest": {
        "mode": "dormancy",
        "supportedAt": [
          "own_root_patch"
        ],
        "recoveryPolicy": "played_dormancy_recovers_own_vigor"
      },
      "defeat": {
        "trigger": "health.zero",
        "outcome": "dormant_damaged_stem",
        "recoveryAnchor": "same_surviving_root_patch",
        "lossPolicy": "actual_damage_and_products_remain; no_recreated_stock",
        "continuationPolicy": "care_or_supported_graft; destroyed_anchor_requires_explicit_new_continuation"
      },
      "presence": {
        "kind": "material",
        "endpointRef": "body.location",
        "anchorRef": "body.id",
        "reach": {
          "sense": "contact_with_own_patch",
          "effect": "own_patch_contact",
          "message": "nearby_observer_can_see_leaf_signal"
        },
        "carrierBodyId": null,
        "memberBodyIds": []
      },
      "mobility": {
        "modes": [
          "root"
        ],
        "routeConstraints": [
          "local_patch_only",
          "respect_existing_land_custody"
        ],
        "carrierPolicy": "relocation_requires_explicit_transplant_not_walk"
      },
      "size": {
        "class": "small",
        "dimensions": {
          "height": 0.6,
          "unit": "m"
        },
        "mass": null,
        "scalePolicy": "patch_footprint_does_not_imply_whole_location_reach"
      },
      "lifespan": {
        "mode": "world_defined",
        "duration": null,
        "clockPolicy": "played_exposure_only; no_implicit_offline_age"
      },
      "stages": [
        {
          "id": "sapling",
          "threshold": {
            "kind": "selected_start"
          },
          "functionChanges": {},
          "statChanges": {}
        }
      ],
      "statTemplate": "village.bodies.sapling.stats",
      "skillCarryRules": {
        "default": "review_per_method",
        "knowledge": "person",
        "motorPractice": "body",
        "mixed": "separate_knowledge_and_motor",
        "sourceFaculty": "actual_source"
      },
      "extensions": {
        "village.bodies": {
          "photosynthetic": true,
          "sapProduct": "proposed_tree_sap_product",
          "sapCostVigor": 2,
          "sapRecovery": "one_paid_growth_completion",
          "sapConsent": "actual_body_controller",
          "productionNote": "reuse_function_id_only; not_reedling_resource_grant"
        }
      }
    }
  ],
  "statProfiles": [
    {
      "id": "village.bodies.sapling.stats",
      "revision": 1,
      "pools": {
        "health": {
          "max": 60
        },
        "vigor": {
          "max": 20
        }
      },
      "stats": {
        "defense": 2
      },
      "attackModes": []
    }
  ],
  "starts": [
    {
      "id": "village.bodies.sapling.start",
      "source": {
        "kind": "original",
        "era": "Village opening",
        "evidence": "INFERRED",
        "locator": "NONHUMAN_STARTS_PLAY_2026-10-14.md/BK3"
      },
      "mindKind": "native_person",
      "controlSeat": "direct_single_body",
      "body": {
        "schema": 1,
        "id": "village.bodies.sapling.sample_body",
        "templateId": "village.bodies.sapling",
        "templateRevision": 1,
        "ownerId": "player",
        "controllerId": "player",
        "personId": "player",
        "lifeId": "village.bodies.sapling.sample_life",
        "instanceId": "village.bodies.sapling.sample_instance",
        "stage": "sapling",
        "endpointRef": "Village",
        "carrierBodyId": null
      },
      "firstVerbs": [
        "feel_patch_contact",
        "signal_leaf_motion",
        "tend_known_shoot"
      ],
      "witness": {
        "actorId": "oldCraftsman",
        "knowledge": "only_received_signal_or_observed_deed"
      },
      "idleRoutine": {
        "id": "tended_shoot_growth",
        "clock": "played",
        "offline": "none",
        "supportLoss": "pause_before_next_reservation"
      },
      "saveDecision": "new_revisioned_body_requires_explicit_migration; old_absent_stays_absent"
    }
  ]
}
```

**Worked consumer trace:** nearby contact is known as contact, not a named visitor. An actual visitor can see an intentional leaf signal. `tended_shoot_growth` needs light/water/tending support from the local facts, paid eligible time and available vigor; it pauses its bonus when support is missing and leaves ordinary play viable. One sap-production completion consumes two actual vigor and yields one identified product with recovery state, never output on preview. `produce.reed_sap` is reused as the spec's available production vocabulary, but the original sapling's product is declared separately from reedling sap. Dial: a reviewed `produce.tree_sap` function if the reusable production adapter needs exact separation. Root extension is not Village-to-mill travel.

### BA-E3: speaking practice blade (BK6)

Default: one unique object-body with a continuing original mind, audible speech and contact sensing. Dial: a sourced holder-only hilt link, recall or levitation; none is inferred from blade shape. Reasonably: independent blade action is advice/resonance practice; the holder executes physical strikes and owns their motor XP.

```json
{
  "schema": 1,
  "packId": "village.bodies",
  "revision": 1,
  "templates": [
    {
      "schema": 1,
      "templateId": "village.bodies.practice_blade",
      "templateRevision": 1,
      "form": "practice_blade",
      "lineage": null,
      "functions": {
        "sense.contact": {
          "capacity": 1,
          "channel": "hilt_and_blade_contact"
        },
        "hear": {
          "capacity": 1,
          "channel": "metal_vibration"
        },
        "speak": {
          "capacity": 1,
          "channel": "audible_original_enchantment"
        },
        "influence.advice": {
          "capacity": 1,
          "channel": "audible_speech",
          "constraints": {
            "eq": {
              "fact": "recipientCanHear",
              "value": true
            }
          }
        },
        "move.carried": {
          "capacity": 1,
          "channel": "physical_holder"
        }
      },
      "slots": [],
      "intake": {
        "modes": [],
        "mealBenefitsPolicy": "no_food_benefit; optional_craft_improvement",
        "upkeepPolicy": "no_passive_decay",
        "shortagePolicy": "no_food_requirement; no_hunger_death"
      },
      "rest": {
        "mode": "none",
        "supportedAt": [
          "actual_rack_or_sheath"
        ],
        "recoveryPolicy": "repair_requires_actual_materials_executor_and_time"
      },
      "defeat": {
        "trigger": "integrity.zero",
        "outcome": "cracked_blade; hilt_mind_retained_if_intact",
        "recoveryAnchor": "same_identified_hilt",
        "lossPolicy": "retain_actual_parts_mind_and_custody; no_duplicate_body_item",
        "continuationPolicy": "supported_same_object_reforge; replica_is_not_automatic_restoration"
      },
      "presence": {
        "kind": "object",
        "endpointRef": "body.location",
        "anchorRef": "body.id",
        "reach": {
          "sense": "own_contact_and_local_vibration",
          "effect": "message_only",
          "message": "local_audible_range"
        },
        "carrierBodyId": null,
        "memberBodyIds": []
      },
      "mobility": {
        "modes": [
          "carried"
        ],
        "routeConstraints": [
          "actual_holder",
          "carrier_route_fit",
          "exact_object_custody"
        ],
        "carrierPolicy": "holder_title_bond_and_controller_separate"
      },
      "size": {
        "class": "small",
        "dimensions": {
          "length": 0.7,
          "unit": "m"
        },
        "mass": {
          "value": 0.8,
          "unit": "kg"
        },
        "scalePolicy": "item_fit_checks_length_and_mass"
      },
      "lifespan": {
        "mode": "no_automatic_age_end",
        "duration": null,
        "clockPolicy": "no_passive_offline_decay"
      },
      "stages": [
        {
          "id": "tempered",
          "threshold": {
            "kind": "selected_start"
          },
          "functionChanges": {},
          "statChanges": {}
        }
      ],
      "statTemplate": "village.bodies.practice_blade.stats",
      "skillCarryRules": {
        "default": "review_per_method",
        "knowledge": "person",
        "motorPractice": "body",
        "mixed": "separate_knowledge_and_motor",
        "sourceFaculty": "actual_source"
      },
      "extensions": {
        "village.bodies": {
          "uniqueBodyItemRef": "village.bodies.practice_blade.sample_object",
          "selfEquipmentForbidden": true,
          "physicalStrikeExecutor": "actual_holder_body",
          "jointDrillSupport": "holder_agreement_and_means_required"
        }
      }
    }
  ],
  "statProfiles": [
    {
      "id": "village.bodies.practice_blade.stats",
      "revision": 1,
      "pools": {
        "integrity": {
          "max": 80
        }
      },
      "stats": {},
      "attackModes": []
    }
  ],
  "starts": [
    {
      "id": "village.bodies.practice_blade.start",
      "source": {
        "kind": "original",
        "era": "Village opening",
        "evidence": "INFERRED",
        "locator": "NONHUMAN_STARTS_PLAY_2026-10-14.md/BK6"
      },
      "mindKind": "native_person",
      "controlSeat": "direct_single_body",
      "body": {
        "schema": 1,
        "id": "village.bodies.practice_blade.sample_body",
        "templateId": "village.bodies.practice_blade",
        "templateRevision": 1,
        "ownerId": "player",
        "controllerId": "player",
        "personId": "player",
        "lifeId": "village.bodies.practice_blade.sample_life",
        "instanceId": "village.bodies.practice_blade.sample_instance",
        "stage": "tempered",
        "endpointRef": "Village",
        "carrierBodyId": null
      },
      "firstVerbs": [
        "speak_to_guard",
        "feel_grip_pressure",
        "offer_timing_advice"
      ],
      "witness": {
        "actorId": "oldCraftsman",
        "knowledge": "only_received_signal_or_observed_deed"
      },
      "idleRoutine": {
        "id": "solo_resonance_practice",
        "clock": "played",
        "offline": "none",
        "supportLoss": "pause_before_next_reservation"
      },
      "saveDecision": "new_revisioned_body_requires_explicit_migration; old_absent_stays_absent"
    }
  ]
}
```

**Worked consumer trace:** while on a rack the blade can speak and practice its own signal; waiting does not need a human holder to make the start playable (N35). A consenting, capable holder can join a drill later. Carrying updates the same body/item holder and endpoint; it creates no second sword, new mind controller or guaranteed bond. Cracking stops blade use under its declared policy; the retained hilt can still communicate if that channel remains supported. `rest.mode=none` does not restore integrity for free.

### BA-E4: existing Wolf converted to a playable template (N26/N27)

**SHOWN:** `src/enemies.js:333-347` supplies Wolf health250, attack40, agility50, dexterity50, intuition40, magic0, attack_speed1.3, defense20, medium size, living/beast tags, foe XP8, rank3 and three loot probabilities. **INFERRED:** senses, agency, age/stage, meals, stamina, slots, defeat and communication below are newly authored, not extracted canon. The copied stats deliberately remain strong; no compensating exotic-body penalty. Whether this curve is enjoyable in a selected start is UNKNOWN.

```json
{
  "schema": 1,
  "packId": "village.bodies",
  "revision": 1,
  "templates": [
    {
      "schema": 1,
      "templateId": "village.bodies.wolf",
      "templateRevision": 1,
      "form": "wolf",
      "lineage": null,
      "functions": {
        "see": {
          "capacity": 1,
          "channel": "visible"
        },
        "hear": {
          "capacity": 1,
          "channel": "sound"
        },
        "smell": {
          "capacity": 1,
          "channel": "scent"
        },
        "sense.contact": {
          "capacity": 1,
          "channel": "touch"
        },
        "signal.scent": {
          "capacity": 1,
          "channel": "scent_mark"
        },
        "sign": {
          "capacity": 1,
          "channel": "posture"
        },
        "move.walk": {
          "capacity": 1,
          "channel": "quadruped"
        },
        "move.carried": {
          "capacity": 1,
          "channel": "physical_carrier"
        },
        "eat.food": {
          "capacity": 1,
          "channel": "mouth"
        },
        "attack.bite": {
          "capacity": 1,
          "channel": "jaw",
          "constraints": {
            "eq": {
              "fact": "jawUsable",
              "value": true
            }
          }
        },
        "wear.collar": {
          "capacity": 1,
          "channel": "neck"
        },
        "wear.harness": {
          "capacity": 1,
          "channel": "torso"
        }
      },
      "slots": [
        {
          "id": "collar",
          "count": 1,
          "requires": [
            "wear.collar"
          ],
          "fitTags": [
            "canine_neck"
          ],
          "maxSize": "medium",
          "custodyPolicy": "existing_item_title_and_holder"
        },
        {
          "id": "harness",
          "count": 1,
          "requires": [
            "wear.harness"
          ],
          "fitTags": [
            "quadruped_torso"
          ],
          "maxSize": "medium",
          "custodyPolicy": "existing_item_title_and_holder"
        }
      ],
      "intake": {
        "modes": [
          "food"
        ],
        "mealBenefitsPolicy": "compatible_meal_adds_recovery_bonus",
        "upkeepPolicy": "no_passive_food_debit",
        "shortagePolicy": "ordinary_unfed_play_remains_viable; no_hunger_death"
      },
      "rest": {
        "mode": "sleep",
        "supportedAt": [
          "agreed_den",
          "safe_local_shelter"
        ],
        "recoveryPolicy": "played_rest_recovers_own_stamina; meal_bonus_optional"
      },
      "defeat": {
        "trigger": "health.zero",
        "outcome": "incapacitated",
        "recoveryAnchor": "agreed_local_refuge_or_actual_helper",
        "lossPolicy": "retain_identity_stock_knowledge; injuries_have_actual_owner",
        "continuationPolicy": "care_and_recovery; no_forced_human_form"
      },
      "presence": {
        "kind": "material",
        "endpointRef": "body.location",
        "anchorRef": null,
        "reach": {
          "sense": "same_place_supported_channel",
          "effect": "contact",
          "message": "local_signal"
        },
        "carrierBodyId": null,
        "memberBodyIds": []
      },
      "mobility": {
        "modes": [
          "walk",
          "carried"
        ],
        "routeConstraints": [
          "actual_access",
          "body_fit",
          "carrier_route_if_carried"
        ],
        "carrierPolicy": "actual_carrier_capacity_custody_and_permission"
      },
      "size": {
        "class": "medium",
        "dimensions": null,
        "mass": null,
        "scalePolicy": "class_fit_until_authored_dimensions"
      },
      "lifespan": {
        "mode": "world_defined",
        "duration": null,
        "clockPolicy": "played_exposure_only; no_implicit_offline_age"
      },
      "stages": [
        {
          "id": "adult",
          "threshold": {
            "kind": "selected_start"
          },
          "functionChanges": {},
          "statChanges": {}
        }
      ],
      "statTemplate": "village.bodies.wolf.stats",
      "skillCarryRules": {
        "default": "review_per_method",
        "knowledge": "person",
        "motorPractice": "body",
        "mixed": "separate_knowledge_and_motor",
        "sourceFaculty": "actual_source"
      },
      "extensions": {
        "village.bodies": {
          "enemyBaselineRef": "Wolf",
          "enemyTags": [
            "living",
            "beast"
          ],
          "combatConversion": "attack_to_profile_power; attack_speed_to_cadence; health_to_max_pool",
          "numericUnits": "cadence_mapping_needs_native_adapter_verification"
        }
      }
    }
  ],
  "statProfiles": [
    {
      "id": "village.bodies.wolf.stats",
      "revision": 1,
      "pools": {
        "health": {
          "max": 250
        },
        "stamina": {
          "max": 40
        }
      },
      "stats": {
        "agility": 50,
        "dexterity": 50,
        "intuition": 40,
        "magic": 0,
        "defense": 20
      },
      "attackModes": [
        {
          "id": "bite",
          "requires": [
            "attack.bite"
          ],
          "reach": "contact",
          "power": 40,
          "cadencePerSecond": 1.3,
          "executor": "body"
        }
      ]
    }
  ],
  "starts": [
    {
      "id": "village.bodies.wolf.start",
      "source": {
        "kind": "existing_enemy_plus_original_playable_adaptation",
        "era": "Village opening",
        "evidence": "SHOWN_enemy_stats; INFERRED_other_fields",
        "locator": "src/enemies.js:333-347"
      },
      "mindKind": "native_person",
      "controlSeat": "direct_single_body",
      "body": {
        "schema": 1,
        "id": "village.bodies.wolf.sample_body",
        "templateId": "village.bodies.wolf",
        "templateRevision": 1,
        "ownerId": "player",
        "controllerId": "player",
        "personId": "player",
        "lifeId": "village.bodies.wolf.sample_life",
        "instanceId": "village.bodies.wolf.sample_instance",
        "stage": "adult",
        "endpointRef": "Village",
        "carrierBodyId": null
      },
      "firstVerbs": [
        "follow_known_scent",
        "show_yes_no_posture",
        "escort_guard"
      ],
      "witness": {
        "actorId": "villageGuard",
        "knowledge": "only_received_signal_or_observed_deed"
      },
      "idleRoutine": {
        "id": "known_boundary_circuit",
        "clock": "played",
        "offline": "none",
        "supportLoss": "pause_before_next_reservation"
      },
      "saveDecision": "new_revisioned_body_requires_explicit_migration; old_absent_stays_absent"
    }
  ],
  "foeSeat": {
    "enemyTemplateRef": "Wolf",
    "xpValue": 8,
    "bestiaryOrder": 3,
    "drops": [
      {
        "item": "Wolf fang",
        "chance": 0.04
      },
      {
        "item": "Wolf pelt",
        "chance": 0.02
      },
      {
        "item": "High quality wolf fang",
        "chance": 0.0005
      }
    ],
    "settlement": "actual_foe_defeat_only; no_self_reward"
  }
}
```

The foe-seat row is intentionally outside the template. Tags classify interactions; they never imply scent, intelligence or grip. Enemy callbacks are not serialized or imported into playable content. This Wolf has no authored callback effect in its definition; a dragonfly conversion would instead require a separately typed venom action and actual target/effect owner. Reusing `Enemy` itself would retain imports of native character/display/main (`src/enemies.js:4-8`) and mutable constructor behavior (`:64-70`), so extract reviewed JSON constants, not a live Enemy instance. Keep upstream attribution and the exact source baseline locator.

**Worked consumer trace:** player, companion and foe can resolve the same physical Wolf revision with distinct instances, controllers, relationships and stats/condition overlays. Foe encounter content keeps its own settlement baseline; adopting a shared template later must not retroactively alter frozen fights. Player biting never pays the player's foe XP or rolls their pelt table. Harvesting an actual fang/part is separate authored production with consent/custody, injury or renewable-part rules and recovery. Becoming a playable Wolf does not by itself unlock locked combat areas or erase its actual pursuers (MS19).

## 3. N34 authoring checklist

Default: complete this short review table for the selected body/start and link its result from the owning wave. Dial: irrelevant fields explicitly say not applicable, rather than silently inheriting human values. Reasonably per world: unusual sources can supply stronger functions or different continuation; only consumed requirements need new engine adapters. This is an author reference inventory, not twelve questions for Weibao.

| Code | Before admitting content | What review catches |
|---|---|---|
| BA-C1 | Source profile, era, original/canon-fill/AU label, attribution and exact locator; qualify source coverage and unresolved claims | Merged continuities, uncited anatomy, procedural inventions presented as canon. Private summary is not full-text reread. |
| BA-C2 | Stable template ID/revision, complete schema fields, instance identity and stage; no collision with other packs | Mutable shared defaults, stale resolution, missing bodies becoming human and changes to existing saves by reference. |
| BA-C3 | Mind kind, selected seat, person/body/controller and actual initialization authority | Animated NPC becoming conscious for free, offspring granting extra control, owner/holder treated as controller. |
| BA-C4 | Positive functions, channels, constraints and fit slots; separate learned execution/source prerequisites | Human hand defaults, sight becoming literacy, speech becoming spells, natural bite becoming mastered combat. |
| BA-C5 | Intake and meal benefits, nonlethal shortage, rest mode/support and explicit defeat/continuation | Mana hunger smuggling starvation death, a blade sleeping in a human bed, a replica restoring an old mind by assumption. |
| BA-C6 | Endpoint, reach, habitat, size/units, route and actual carrier/anchor | Roots walking, a rack sensing the whole Village, a destination without a usable habitat, title granting reach. |
| BA-C7 | Two or three immediately useful verbs, one outcome, one real witness and communication adapter | Starts composed mainly of disabled human buttons; knowledge awarded to witnesses who could not receive it. |
| BA-C8 | One supported idle routine with input/attention owners, beneficiary, support-loss rule and selected clock; offline default none | Clicking as the only progress, unfunded partner work, double-paying elapsed time, lethal closed-browser upkeep. |
| BA-C9 | Stats/pools/attack modes, skills retained versus executable, actual learner/executor | Blind enemy-stat import, zero values repaired by truthy defaults, full XP credited to both blade and holder without a source rule. |
| BA-C10 | Production, unique body-item linkage, gear disposition and transition manifest references | Free sap from rendering, duplicated sword or skin, loss of paid inputs on body change. TF/TX own transitions. |
| BA-C11 | Admission, initialization receipt, selected save version, old-save decision, missing-pack recovery and frozen-job handling | New bodies on old load, silent revision replacement, unresolved return anchor, job settlement with incompatible means. |
| BA-C12 | Fixture evidence, rebuilt desktop behavior, save/reload/export/literal-file import and separate human taste review | Definition checks being reported as playable proof. Target1366×768, plus1920×1080 where UI claims need it; mobile deferred. |

Examples above complete the proposed **template data**, not checklist acceptance: verb/routine names are authoring briefs, not registered native commands; source-only anchors and numerical proposals remain pending. Blade integrity/sapling vigor require B14's pool binding. These examples cannot ship by copying JSON into a current pack.

## 4. N33 lint rules and precise diagnostics

Default: batch validation before registry mutation, then AST lint for new/revised source. Dial: grandfather known legacy assumptions using exact file/node fingerprints and owner/reason, never a whole-file exemption. Reasonably: species comparisons are legitimate in explicit canon/form admission, migration or presentation; don't mechanically rewrite those as anatomy queries. A linter checks structure and declared contracts, not whether a story is fun.

| Rule | Severity and what it catches | Diagnostic / corrective route |
|---|---|---|
| BA-L1 header/identity | Error: missing fields, nonfinite capacity, negative capacity, duplicate ID, unsafe revision, shared instance ID or mutable identity in template | Give JSON path, actual value and expected contract. Require separate template and instance. |
| BA-L2 reference closure | Error: unresolved template/stat/function/source/slot/command/location/recovery reference or missing named policy handler in a **shipping** pack | Name dependency/version. Preserve quarantined drafts; never invent a fallback human. Binding tokens must be declared. |
| BA-L3 literal schema | Error: callbacks, executable strings, unknown active fields, incompatible nested data; namespaced inert metadata allowed by declared contract | Identify unsupported key/operation. JSON parsing alone is not semantic validation. |
| BA-L4 functions/fit | Error: slot requires absent function, incompatible fit or impossible simultaneous demand; warning for new function spelling | Suggest vocabulary ID or explicit reviewed extension. Two grip structures do not imply fine control. |
| BA-L5 needs/defeat | Error: hunger/fuel shortage connected to death/destructive continuation; rest or defeat lacks a viable declared route for selected premise | Identify causal edge. Actual combat destruction/source loss has its own explicit rule, not a renamed hunger meter. |
| BA-L6 reach/movement | Error: walk route with only move.root, carried movement without carrier contract, sensing/effect range missing, unitless numeric dimensions | Report route/channel. Validate actual runtime carrier and geometry later; static shape cannot prove co-location. |
| BA-L7 start feasibility | Error: no positive first outcome or no eligible safe routine at selected stage/habitat; unresolved selected witness/communication | Compute declared start requirements. Dynamic stock/consent/access remain runtime checks; no silent universal bypass. |
| BA-L8 authority/rewards | Error: body automatically confers title/control/relationship, starts bind two full XP grants without explicit sharing, foe loot placed in template load | Locate grant and beneficiary. Require causal source/settlement and unique receipt. |
| BA-L9 lifecycle | Error: stage/form change has no compatibility/gear/job/carry policy; copied mind marked same person without continuation rule | Link TF/TX manifest or explicit not-in-slice declaration. No universal new-body reinitialization. |
| BA-L10 generation | Error: missing seed/table revision/resolved result, global/random draw in preview, unbounded rejection loop | Report generator operation. Snapshot accepted result; fallback to verified authored body without rerolling an accepted start. |
| BA-L11 disclosure | Error: sealed truth or private authored reference projected as player prose; warning for source-style copied prose | Separate internal authored locators from player known view. Secret scan needs an authorized sealed-review route; this lane opens no sealed files. |
| BA-L12 conservation | Error: unique body-item referenced by two distinct stock units, load-time production grants, output without cost/regen rule | Report IDs/settlement route. Runtime transaction fixtures are still needed for duplication/refund. |
| BA-L13 anatomical literals | New AST warning/error in executable eligibility: `form === 'human'`, `hands >= 2`, reverse comparisons, human/two-hand default values, equivalent destructuring | Report node/line and proposed effective-function query. Permit exact source form admission only with a scoped annotation and regression. Match AST, not comments/strings. |
| BA-L14 implicit humanoid consumers | New AST warning for unconditional weapon/shield/bed/breathing/manual craft dispatch or absent-body fallback on runtime paths | Use declared body method/rest/defeat profile. Heuristic warnings need review; finding a `.weapon` access alone proves no bug. |
| BA-L15 partial gating | Review error when UI admits function checks but commit/completion bypass them, or queued work resolves against stale cached body | Identify corresponding host/transaction/completion. Requires registered route map plus tests; static analysis alone cannot prove all bypasses absent. |
| BA-L16 known-view routing | New warning when body-aware UI reads omniscient template/source description directly, including tooltips/assistive output | Route through SU1's same qualified perception view. World metadata remains author-only until actually learned. |
| BA-L17 compatibility | Error if content revision mutates existing start/template ID meaning or missing pack deletes saved bodies/frozen jobs | Require revision pin, explicit migration decision and recoverable suspend/export path. Old legacy nodes stay visible as debt, not false passing proof. |

Example diagnostic: `village.bodies.sapling / starts[0].firstVerbs[2]: needs move.walk, template supplies move.root; choose a local-growth method or author a supported transplant`. Example source exception: `body-lint: form-admission owner=realm_boundary_rules reason=authored species restriction` attached to one comparison; the exception test includes function-compatible rejected species. No lint tool is implemented in this lane.

## 5. N32 shared fixture set

Default: fresh factory per test, deep-freeze template definitions, deep-clone instances/owners, deterministic IDs/clock/seed and no browser globals or importing the live singleton Enemy. Dial: keyed scenario variants for source/control/support loss. Reasonably: a test suite only requests fields it consumes; no huge fake world required. Run every relevant new consumer against the same fixture table so each cannot define a private humanoid interpretation.

| Fixture | Main assertions, including a useful positive |
|---|---|
| BA-F1 legacy human, simulation absent | Preserve original creation/equipment/rest/defeat baseline; optional body migration must not enroll services, grant stock or change cosmetic lineage. Missing body is a deliberate compatibility case, not general humanoid permission. |
| BA-F2 explicit human with injured grip | Fine control/grip deficit blocks the particular manual task and admits another supported verb. Injury changes effective functions without erasing retained skill XP. |
| BA-F3 reedling, fresh and restored | Existing original fresh-start eligibility, photosynthesis/no-air flags and two-sap grant remain exact; repeat/load/import grants nothing. New resolver matches declared old hands/mobility. Do not assume the spec's richer illustrative reedling is already runtime anatomy. |
| BA-F4 Tern offered/possessed/returned | Actual host consent, original body/vitals parked, stationary host can press clay, ordinary walking rejected, spent clay stamina remains spent on return. Host stock stays theirs. Include revoke/failed-return target and stale commit. |
| BA-F5 hound | Scent task and collar fit succeed; human sword/manual fine craft fails for actual missing means. One guard receives actual signal while an uninformed trader does not. Meal benefit helps; unfed routine is viable. |
| BA-F6 sapling | Local contact/sign/growth succeeds, roots do not travel, dark/unsupported bonus pauses without lethal drain. Sap paid once, recovery state persists, preview/load yields zero sap. Separate local habitat from land title. |
| BA-F7 practice blade on rack/carried/cracked | Rack signal/practice works; movement needs actual holder. One item/body identity, holder change keeps controller/memory separate; cracking retains only declared hilt functions. Holder receives physical-drill credit, blade its own contribution. |
| BA-F8 Wolf player/companion/foe | Same template revision and different mutable instances; baseline numerical mapping preserved. Only foe encounter settlement yields XP/drop opportunity. Injuring one body never mutates sibling/template. |
| BA-F9 bodyless guide or anchored ghost | Omit physical grip/height/health where inapplicable; a supported message works without fabricated fists/bed. Anchor/channel loss suppresses that action without global amnesia. Exposes truthy zero/default stat bugs. |
| BA-F10 juvenile/adult two-stage body | Known maturity changes only declared functions/stats on the selected clock. Same continuing mind does not reacquire skills or prestige; cached job requirements recheck stage. No silent offline aging. |
| BA-F11 reversible two-form body | Change before/after eligibility and gear fit, conserve items/reserves/XP, pause/refund according to frozen job contract. Return never replays acquisition or heals spent reserves without a paid rule. TF2/C11 rather than a general shapeshifter suite. |
| BA-F12 same blade, destination carrier/habitat variants | Cross-world body/credentials/support checked separately; actual carrying/habitat positive and absent carrier negative. Existing source form restriction can still reject despite compatible functions. N37/N38/OT16. |
| BA-F13 malformed/missing revision and old frozen job | Nonfinite function, dangling source, unresolved template, duplicate instance and missing pack reject before registry/save mutation; original save remains exportable. Old commitments keep revision/meaning or suspend safely, never get regenerated anatomy. |
| BA-F14 constrained generated body and independent offspring | Same seed/profile/table revision yields same accepted result; preview/reload/import consume no new draws. Generation is bounded; coherent fallback tested. Bud creation has distinct person/controller unless explicit shared-mind rule, never copies purse/XP. |

The first six named N32 bodies are F1/F3/F4/F5/F6/F7; injured human, Wolf, bodyless, stages, transition, crossing, invalid records and generator variants add counterexamples. Every applicable fixture is exercised at definition validation, effective query, action preview, commit, queued completion/support change, equipment/custody, stat/skill beneficiary and complete-envelope save/reload/export/literal-file import. Preview is immutable; failed persistence publishes nothing; accepted sequence settles at most once. Missing support or wrong custody spends nothing on a new commit and follows the old frozen refund rule for reserved work.

**SHOWN/STATED limit:** ENGINE_SPEC B20 reports dedicated existing reedling/Tern/traveler tests missing in its searched trees; that is a sibling source-audit report, not a refreshed whole-repository proof here. Proposed fixtures are not written tests or passing counts. First protect actual reedling/Tern behavior before replacing the reader. Later rebuilt fresh-origin desktop acceptance must demonstrate the chosen positive nonhuman loop, rejected wrong-means attempt, one observer consequence and exact changed save. No native or human acceptance is claimed.

## 6. OT4 procedural species from the function vocabulary

Default: select a coherent authored body grammar, then vary compatible modules. Do not draw a random bag of verbs and call it a species. Dial: strange chimeras, superior bodies, realm-native spirits or explicit AU physics with declared source/anchor. Reasonably per world: the function vocabulary states means, while the world/source profile decides which combinations exist. A generator budget bounds content/tick cost, not the player's imagination or power ceiling.

### Constraint pipeline

| Phase | Constraint and resulting data |
|---|---|
| BA-G1 profile and premise | Pin world/source era, canon versus original/AU, mind kind, selected seat and available habitat. Choose material/object/incorporeal/rooted grammar, not hostility or rights from species. Canon names/anchors remain authored. |
| BA-G2 anatomy modules | Choose a physical scaffold and bounded modules with `provides`, `requires`, `conflicts`, channel/reach, fit, support and provenance. A jaw can provide bite/intake; tactile roots provide local contact/root growth. Fine control is not inferred from grip; speech not inferred from personhood. |
| BA-G3 support closure | Every selected function has its actual organ/source, required mode, pool/energy and support policy. Flight needs a sourced lift/support model and fitting route; spectral movement does not automatically phase cargo. Carrier-only bodies need actual transport later, plus useful uncarried play now. |
| BA-G4 accessible play | Resolve selected start facts. Require a meaningful first outcome, a supported signal/interaction and a safe routine, preferably with an alternative when a partner is absent. These can be mental/local skills, not compulsory walking/combat. Score meaningful choices/output/time, not raw number of functions. |
| BA-G5 rules and performance | Validate slots, units, nonlethal needs, rest/defeat, habitat and stat/skill ownership. Bound module count, links, generated attempts, save bytes and active work to profile limits. No extra scheduler, all-pairs social tick or automatically simulated offspring. |
| BA-G6 commit and retain | Pure preview uses pre-authored previews or the already frozen result, never future RNG. At explicit selection commit use a named body stream, pin seed/table/profile revisions and accepted resolved definition with content hash. Save it once. Imports validate that record, not reroll or rerun current tables. |

Illustrative generator metadata, not current runtime fields: `{generatorId:'village.bodies.rooted.v1', revision:1, seed:724, profileId:'village.original.v1', maxAttempts:16, maxModules:8, resultTemplateId:'village.bodies.generated.724', resultRevision:1, fallbackTemplateId:'village.bodies.sapling'}`. Snapshot the result and next stream cursor in the actual eventual saved body owner. Limits16/8 are proposed engineering defaults, not universal species restrictions; larger bodies remain reachable through a reviewed profile. A failed candidate consumes its deterministic generation draw in the transaction only, not a reward or stock unit. Failure to persist rolls back the entire selection. Bounded rejection uses a verified fallback and reports the generation limit in author diagnostics; player can select an authored alternative without altering an already accepted life.

**Worked generated species:** choose original rooted scaffold + bark-contact sensor + light intake + leaf signal + sap production. Close support with an actual tended patch, vigor profile, local reach, paid sap recovery and dormancy policy. Result resembles the sapling example without granting Village-wide vision or landlord rights. Another valid dial adds an actual original mana-driven root-locomotion source and a compatible moving-body template; it changes movement/support/route requirements rather than relabeling `move.root`. An invalid rooted body with an inter-town Running job fails BA-L6/L7 and is replaced before selection, not after the player has spent inputs.

Cross-module conflicts are **mechanistic**, not arbitrary equal-power balancing: a speech organ may need air/water support, a sheath blocks a declared visual aperture, two functions may need the same actual gripping structure simultaneously. An authored magic source can genuinely remove a restriction. No universal inability to use metal, weakness to fire, low XP or forced human endpoint for generated nonhumans. Acquisition/analysis/expression/mastery remain TM/ability outcomes, not side effects of choosing modules.

### Private dossier checks, summaries only

These are bounded source-summary reads, not new raw-text verification. No external search is required for the original examples; exact new canon rules need their source owner before shipping.

| Evidence label and private locator | Authoring consequence (INFERRED) |
|---|---|
| **STATED (local reader attributing source narrator)** [Shadow Slave ITEMS_SOCIETY](../research/novels/shadow-slave/readers-2026-10-10/ITEMS_SOCIETY.md) §2.1, ch00107; §2.2 ch00106-ch00108 | Fixed Echo replica and growing/personality-bearing Shadow are distinct source categories. Do not randomly attach autonomous mind/evolution/repair to every summoned body. NC2/NC10 and W07 remain the canon owner; the reader's adaptation suggestions are proposals. |
| **SHOWN in inspected dossier summary, original-text fidelity UNKNOWN here:** [Paradise FULL_SYNTHESIS](../research/novels/trailblaze-reading/paradise-depth/FULL_SYNTHESIS.md), PR01 opening M1/M2; PR05 sid213 p13-18,p57-63; PR08 sid125 p60-67 | Transport/treatment, per-function origin restrictions and exceptional linked entitlements are different rules. Multiple marks do not establish multiple bodies, minds or universal duplicate rewards. Carry source/permission separately from template; CRP7/8, DM8 own the lifecycle. |
| **STATED (reader coverage)** [MoL SYSTEMS_DEEP_DIVE](../research/novels/mother-of-learning/SYSTEMS_DEEP_DIVE_2026-10-10.md), Source and §1 | Dossier used targeted search and keyword-only windows for parts of the supplied edition; numerical reserve/control claims are not universal anatomy rules. Keep body capacity, learned efficiency and source prerequisites separate. W05/NC6 owns selected aranea/other-body evidence, not this lane. |

## 7. Per-world body packs and structured admission

Default: reusable anatomy definitions plus world-specific start/method/source/era/admission data, kept under stable pack IDs. Dial: a world-specific body template where mechanics differ; explicit dependencies for genuinely identical anatomy. Reasonably: don't merge similar franchise species or represent legal roles as functions. The table is a **pack routing palette**, not a second W01-W16 roster or a promise to implement each world.

| Proposed pack route | Existing owner and constrained content seam |
|---|---|
| `village.bodies` | BA-E1-E4/BK1/BK3/BK6: original hound/rooted/object/Wolf data; one selected slice after engine foundation. |
| `hp.bodies` | W01/NC1/NC8: use era-qualified house-elf/ghost source and local recognition; citizenship/ownership outside anatomy. |
| `dnd.bodies` | W02/NC4: sentient item/construct source version, independent mind and holder separation. |
| `soldier.bodies` | W03: only qualified local creature/personhood; unresolved canon cognition stays UNKNOWN, original/AU labeled. |
| `ttks.t1` through `ttks.t5` | W04a-e: five separate continuities; no single TTKS species/source registry. |
| `mol.bodies` | W05/NC6/NC14: source anatomy, practical control and native institution methods remain distinct. |
| `lotm.bodies` / `coi.bodies` | W06/NX5: continuity/era and actual observation hazards from the source profile; no automatic safe observer. |
| `shadow_slave.bodies` | W07/NC2/NC10: Echo, Shadow, creature and avatar contracts separate. |
| `jjk.bodies` | W08/NC2/NC5: independent mind/core/anchor and energy/defeat contract, not animation as personhood. |
| `bleach.bodies` | W09/NC5/NC13: source release/return and body-person continuity policy, not generic hunger death. |
| `fate.bodies` | W10/NC3/NC10: selected source version, summoned record versus instance and actual energy/anchor. |
| `hxh.bodies` | W11/NC11: collective institution versus shared mind and actual source restrictions. |
| `fma.bodies` | W12/NC1/NC5: physical shell/seal/source and continuing person references; repair is not free resurrection. |
| `naruto.bodies` | W13: source lineage, transformation and summon ownership resolved by the era-specific owner. |
| `csm.bodies` | W14/NC13: current body, source and returning person/memory policy; shortage adaptations explicit. |
| `frieren.bodies` | W15: source cognition/lifespan and local recognition; human social heuristics not baked into species. |
| `ri.bodies` | W16: bounded source-qualified extension, not universal Gu-body generator permissions. |
| `paradise.bodies.<profile>` | BS1-BS5/CRP8/DM8/HL11: pet/summon body, Contractor role, mission vessel/return and hub resident start separate; original Exchange and canon profiles stay isolated. |

### Proposed compiler/runtime change, explicitly future work

**SHOWN:** current pack schema2 compiler's content/simulation family allowlists contain no body-template registry (`src/structured_pack_definitions.js:7-8,70-73`). `starts[].body` accepts only scalar values (`src/structured_pack_runtime.js:18`). A new `bodyRef` is rejected by start-field whitelist (`:14`); old admission checks every start's form (`:30`). JSON permissiveness in another part of a pack is not evidence that nested bodies work.

**INFERRED proposal:** introduce a versioned pack contract, preferably schema3 with declared `bodyTemplates`, `bodyStatProfiles`, dependencies and start `bodyRef:{templateId,revision}` plus instance initializer. Validate new families in a temporary combined registry, including existing dependencies and collisions, then deep-freeze definitions. Reject unsupported schema before mutating old registries. Do not make current `supportedCapabilities` (`src/structured_pack_definitions.js:9,39`) accept body support merely by adding a name with no actual consumers.

Preserve schema2 exact old meanings and frozen starts. New admission distinguishes **preselection native scaffold contract** from **selected destination-body contract**. Query only the selected start for actual anatomy/functions/stage/habitat/control support; retain intentional form/era restrictions as separate admission terms. Test mixed hound/sapling/blade pools, including a function-compatible but canon-disallowed form. If native creation cannot yet install the selected body, reject recoverably before initialization rather than show a playable start that remains human underneath.

Selection freezes pack/source/start/template revisions, IDs, resolved instance, control terms and body/stat binding into the existing origin receipt and owning simulation body, with an explicit save-schema/compatibility decision. Initialization installs the selected body once only through the authorized creation/transition host and existing durable publisher. It does not provision native stock, partner consent, source faculties, template pool refills or second-body namespaces on compile/render/load. Existing typed bootstrap currently creates/enrolls simulation (`src/structured_pack_runtime.js:61-68`); ENGINE_SPEC B21's separation of body initialization and service enrollment must be handled deliberately, not by setting an invented null enrollment field.

Commands reference effective function facts/method support through the chosen engine resolver, not stored `form`-derived permission. Named policies must map to real action/transaction owners. At completion re-evaluate current means while preserving frozen costs/refund/selected result; no retrospective re-roll after conditions or templates change. Source-specific functions remain actual grants, not privileged words in a body pack.

For object bodies, the same actual unique stock unit and body identity are linked; ownership/custody stays in the existing inventory/claim owners. Mission adapters reference the template but TF/DM8 control the parked original, temporary reserves, return eligibility and carried rewards. Leaving a mission cannot regenerate its local body, erase obligations or double settlement (DM11/HL13). Missing packs suspend dependent interactions and preserve export/return diagnostics, never drop the original save. Every new schema needs a complete-envelope migration/compatibility decision before adoption.

## 8. Considerations BA1-BA12

All are proposals, not additional required worlds or subsystems.

| Code | Default + Dial + Reasonably per world |
|---|---|
| BA1 Content does not implement a function | Default reuse the resolver's approved vocabulary/handlers. Dial add a sourced new channel via a selected adapter. A data-only species works only when all its consumers exist. |
| BA2 Enemy data is a partial library | Default reviewed stat/tag constants and separate foe settlement. Dial preserve strong enemy stats or stage variants. No automatic loot/body grants, hostility, cognition or bestiary-rank progression. |
| BA3 Profile composition preserves provenance | Default anatomy + actual supported grants + stage + conditions. Dial genuinely superior sources. Same `see` output family never flattens channel/range/evidence/source. |
| BA4 A complete template can still be a bad start | Default first useful outcome and viable routine. Dial quiet/object/territory life. Static required-fields pass does not prove playability or fun. |
| BA5 Permitted combinations need context | Default validate support and habitat. Dial explicit magical/AU compatibility. Constraints explain real mechanics, not invented penalties for strange bodies. |
| BA6 Frozen definitions retain meaning | Default pin revisions and settled selection. Dial explicit reviewed conversion. Old job costs/returns and actor history do not mutate when a pack author changes anatomy. |
| BA7 Sharing species is not sharing state | Default three seats, distinct body/person/condition instances. Dial actual shared mind under E8. Offspring and NPCs retain real attention, stock, wishes and learning. |
| BA8 Parts and products keep identity | Default one paid output with regen and custody. Dial renewable or removable modules. A sentient blade isn't simultaneously a fresh gear grant and existing living item. |
| BA9 Function dimensions need units | Default discrete structures/capabilities, explicit meter/mass units where used. Dial coarse fit classes for early slices. Capacity1 is neither rank1 nor one meter of reach. |
| BA10 Author metadata has a disclosure boundary | Default internal locators/provenance, known views for player text. Dial opt-in learned body codex OT9. No template catalog leaking changed/sealed truths or future rewards. |
| BA11 Cost caps are per profile | Default bounded generation/link detail and common scheduler. Dial reviewed larger/chimera/collective packs. Cost ceilings prevent browser stalls without limiting permanent progression. |
| BA12 Fixture evidence has layers | Default data/source, then rebuild/native persistence, then human acceptance. Dial small relevant consumer matrix. The same fixture IDs improve consistency but do not make every new system verified. |

## 9. Suggestions, at most five

These are ranked coordinator options, not authorization to implement or accepted priority changes.

1. **BA-S1:** Adopt the engine spec's immutable-template/mutable-instance split with one body registry/validator and literal policy handlers. Resolve B12-B14/B21 and selected-start admission before admitting nested content; preserve old bodies and enrollment semantics.
2. **BA-S2:** Build N32's human/reedling/Tern/hound fixture core against current consumers first, then extend to sapling/blade when selected. Protect the existing routes and prove one positive nonhuman result plus a wrong-means rejection; do not use human-only success as coverage.
3. **BA-S3:** Use the hound or existing Wolf record for the selected first playable slice. A scent service, actual witness, collar fit and safe routine exercise body authoring without requiring the entire species catalog. Choose the Wolf baseline only with an explicit balance decision; both remain reachable.
4. **BA-S4:** Add batch body lint alongside current content preflight, with narrow reviewed AST exceptions for intentional form restrictions. Data errors block registration; legacy assumptions remain visible debt until their consumers are routed.
5. **BA-S5:** After that slice is proved, prototype one original rooted species grammar using BA-G1-G6, seeded result snapshots and authored fallback. Keep per-world canon packs as source-qualified definitions rather than procedural canon invention.

## 10. Delivery and remaining gates

Delivered design coverage: four explicit JSON examples, twelve checklist items, seventeen lint rules, fourteen fixture groups, six generation phases, eighteen pack-routing rows, twelve considerations and five suggestions. Counts describe proposed documentation, not implemented records/tests. The four examples contain all template fields and local stat profiles; verb/routine/policy names deliberately describe missing adapters, not executable content.

Document verification: parsed all four JSON blocks, checked template field coverage/local stat references/finite capacities/ID matching, checked local Markdown link targets, code locator ranges and suggestion counts. These checks only establish the report's internal structure and cited files. No linter, generator, fixture module, template loader, gameplay code, test suite, build, browser, save or import was executed. No external download, commit, push, publish or purchase. Existing unrelated dirty files remain outside this lane's write scope.

Open: engine schema/registry/query/native routing and body-only enrollment; chosen source-era rechecks; numerical/profile compatibility; real positive verbs/routines/witness/custody; generated result persistence; full-envelope migration. A later selected implementation needs its own tests, rebuild and fresh-origin desktop/laptop1366×768 gameplay plus Save/reload/Export/literal-file Import of changed body/jobs/stock.1920×1080 is a second desktop presentation check when claimed; mobile optimization remains deferred. Human acceptance of play/voice/balance is separate. No implementation or playable completion is claimed by this report.
