# Combat, people, sites and UI layout: systems map

Written 2026-10-25 for MAW-X8, by reading host source in the dirty primary checkout.
Primary checkout `HEAD` and branch base: `3dfc49cf3422c0262d86810df47459f53f3a4a67`; working-tree source may be newer than that commit. This lane's branch began at the same commit. Exact primary source hashes for the representative modules appear below. **VERIFIED** means the cited code was read; **INFERRED** means a consumer relationship follows from imports/calls but was not run; **PROPOSAL** means an example for future plug-in work. A registered/called source path is not proof of browser play. This map does not certify a rebuilt bundle, runtime journey or human acceptance.

Paths and line locators are relative to `src/`, unless prefixed with `docs/`. File lines can drift as shared work continues. The host's accepted rules remain authoritative: combat CBR1-CBR30 in `docs/DOMAIN_RULES.md`, people PIR1-PIR25 and NPC deferral AD33, sites SR1-SR24, and UI UR1-UR69/AD34. This is a locator and fit guide, not a new decision or backlog.

## 1. Combat: separate math, encounter ownership and presentation

| Degree / owner | Authoritative modules and code locator | Actual degree and consumers | Evidence |
|---|---|---|---|
| Shared strike and mitigation | `combat_math.js`: `get_hit_chance`, `mitigateCombatDamage`, `mitigateCombatDamageFromStats`, `rollBaseCombatDamage`, `rollCombatStrike`; `gear_dimensions.js`: damage-taken and crit modifiers | Damage/strike primitives; base rolls require a supplied saved random stream. `models/combat.js` imports base damage and attack timing. Actor and world callers still own draws, effects, shields, guard and settlement. | VERIFIED: source read/import inspected. |
| Native combat model | `models/combat.js`, `combat_log.js`, `combat_stances.js`, `combat_focus.js`, `combat_readout.js`, `combat_subject.js` | Existing character-versus-opponent combat, log, stance/focus choices, subject identity and readout. Extend the existing owner that already owns the changed fact; do not put world-specific settlement in shared math. | VERIFIED modules; broader consumer scope INFERRED from imports and file roles. |
| Saved actor battles / opponents | `combat_opponents_domain.js`: `projectOpponents`, `registerCombatOpponents`; `combat_review_domain.js`: `configureCombatReview`, domain and `combat-review` panel | Observer-safe combat projection reads the existing readout and registers a domain projection; the review panel consumes configured operations. No new enemy truth or save owner is created here. | VERIFIED: code read. Domain wiring is not browser proof. |
| Encounter and pursuit content | `encounter_content.js`: `encounterDefinitions`, `encounterSources`; generic owners `pursuit.js`, `encounters.js`, `simulation.js` | Authored definition rows connect people, pursuits, commands, encounters and events. `encounter_content.js` contains reversible demonstration profiles; it is not a general world roster or accepted danger policy. | VERIFIED content shape and imports where inspected; live journey not exercised. |

**Practical plug-in (PROPOSAL).** For a new strike nuance, first see whether `rollCombatStrike`'s input/output and `mitigateCombatDamageFromStats` cover it; add a consumer-owned modifier when the law is local. For an encounter, add a source-qualified person/pursuit/command/encounter definition through its owning content pack, preserving the existing command, clock and settlement contracts. A new combat panel should read the public readout/projection and use the existing panel/workspace route, not calculate a second combat truth.

## 2. People and helpers: identity, generated lives, bonds and work

| Degree / owner | Authoritative modules and code locator | Actual degree and consumers | Evidence |
|---|---|---|---|
| Actor model | `models/person.js`: `Person` owns inventory, equipment, level and bio components; `models/npc.js` specializes NPC behavior; `data/npcs.js` supplies authored NPC data | Reusable person representation and native character/NPC model. Actor identity and inventory remain with these owners. | VERIFIED: `Person` source read. |
| Generated people and interactions | `generated_people.js`: `createGeneratedPeople`, `validateGeneratedPeople`, `advanceGeneratedPeople`, `generatedPeopleView`, `interactGeneratedPerson`; `generated_people_ui.js` | Seeded generated residents and a bounded interaction vocabulary; UI reads the view. Generation context and clock are explicit inputs. | VERIFIED exports read; UI relationship INFERRED from imports. |
| Companions and bonds | `companion_roster.js`: `projectCompanions`, `performBondRite` and bond constants; `companion_wishes.js`; `party_ui.js` | Companion projection, bond rites/wishes and party-facing presentation use the existing expansion/people state. Companion scope and open gaps remain with [companions audit](../audits/COMPANIONS_CORE_AUDIT.md), not this map. | VERIFIED imports/exports read; not browser exercised. |
| Household, helper and work roles | `helper_content.js`, `home_household_panel.js`, `home_school_circuit.js`, `village_career_ui.js`, plus existing work/expansion owners | Helpers can participate through authored content, household, teaching, career and work seams; no single universal helper subsystem owns all people or duties. Use the selected activity's current owner and real inventory, clock, relationship and work mechanisms. | VERIFIED file presence and selected source; exact cross-consumer wiring INFERRED. NPC-heavy simulation stays deferred by SR4/AD33 unless separately selected. |
| Lifespan and bonds | `npc_lives.js`: `createVillageLives`, `advanceVillageLives`, `villageLivesView`, `addVillageRecruit`, `bondStatuses`, `stageVillageFamilySave` | Village-year lifecycle and family-save staging are a distinct bounded mechanism, not the general simulation clock for every NPC. | VERIFIED: exports/source read. |

**Practical plug-in (PROPOSAL).** A new resident uses `models/person.js` for actor shape and either authored data or `generated_people.js` for population policy. A helper teaching or supplying something should call the current school/household/work and inventory owners so that attention, stock and time have one source of truth. A companion relationship belongs in the companion/bond projection and its extant save carrier. Do not infer that every resident has autonomous daily simulation.

## 3. Sites and exploration: geography, commitments and observed knowledge

| Degree / owner | Authoritative modules and code locator | Actual degree and consumers | Evidence |
|---|---|---|---|
| Authored site pack | `authored_site.js`: `validateDraft`, `compileDraft`, `exportAuthoredFile`, `parseAuthoredFile`, `applyAuthoredState`, `resetAuthoredState`, `syncAuthoredRegistration`; `authored_site_ui.js` | A bounded authoring/import path compiles one original site pack and manages its active registration/state. | VERIFIED exports read. File format presence does not itself prove persistence or play. |
| Multi-phase site work | `site_projects.js`: `compileSiteProject`, `projectView`; generic simulation command/job owners consume compiled phases | A project expresses phase label, duration, location, site and claim; it reuses command commitment and completion rather than creating a site clock. | VERIFIED: source read; consumer wiring INFERRED from module contract. |
| Riverside drainage site | `drainage_site_domain.js`, `drainage_site.js`, `drainage_site_ui.js` | A bounded native site domain and panel own the selected drainage gallery, revealed rooms and route checks; save validation is tied to actual Frontier state. | VERIFIED: code/import and validation read. |
| Places, maps and knowledge | `known_routes.js`, `personal_journal.js`, `world_knowledge.js`, `observation_channels.js`, `owned_place_clock.js` | Existing route/map knowledge, observations, journal and place-clock owners provide site context and discovery. Use actual means and observer-safe projections; a site must not create parallel geography, stock or truth. | VERIFIED module presence; specific cross-calls INFERRED unless named above. |

**Practical plug-in (PROPOSAL).** To add one authored ruin or worksite, connect its location and source-qualified observations to the existing place/knowledge owners, then express a short restoration or survey as a `site_projects.js` phase if it needs timed commitment. Use the drainage domain only where its actual gallery model fits. A map or clue should reveal only the coverage and confidence supported by its source. These examples follow SR4-SR9 and SR12-SR24; they do not select a new site.

## 4. UI layout: panel registration, regions and placement

| Degree / owner | Authoritative modules and code locator | Actual degree and consumers | Evidence |
|---|---|---|---|
| Panel registration | `panel_kit.js`: `definePanel`; `workspace_layout.js`: `registerWorkspaceModule`, `workspaceOwns`; `ui_ports.js`: `configureUiPorts`, `ports`, `readPort` | Panels register stable ids, node, home, eligibility/discovery, role and settings through one workspace owner. UI ports expose selected native state readers/operations. | VERIFIED: source read. Registration is not a visual acceptance claim. |
| Layout vocabulary and routing | `layout_spec.js`: `LAYOUT_SPEC`, `workspaceRegions`, `routeTable`, `contextOf`, `regionFor`, `regionFit`, `companionPanels`, `boardLayout`, `topRowHeight` | Declares surfaces, boxes, regions and context-sensitive placement; combat/travel/task contexts affect the resolved route. Some entries explicitly carry `proposal` or `UNSET`, so vocabulary coverage does not mean every surface is settled. | VERIFIED: source read. |
| User placement and layout state | `workspace_state.js`: `normalizeLayout`, `parseLayout`, `presetLayout`, `changeModule`, `reorderModule`, `layoutStorageKey`; `shell_layout_edit.js`: `normalizePlacement`, `moveBox`, `swapCompanions`, `resizeContext`, `readPlacement`, `writePlacement` | Saved workspace modules and shell placement are browser-local settings. `workspace_layout.js` owns composition, responsive mode, presentation profile and applying placement. Game save persistence is a different owner. | VERIFIED: exports and callers inspected. |
| Composition and visual rules | `shell_composition.js`, `shell_resize.js`, `center_modes.js`, `docs/PANEL_KIT.md`, `docs/UI_RULES.md` | Shared shell/controller routes and resizing; UI_RULES sets accepted desktop-first behavior, readability and evidence requirements. | VERIFIED module references; rendered behavior not exercised in this docs lane. |

**Practical plug-in (PROPOSAL).** A new panel should use `definePanel` with a stable id, real eligibility/discovery predicate and the source module's projection. Add its surface/box to `LAYOUT_SPEC` only when a real panel consumes it. A new placement choice belongs in the existing layout state/normalizer and must be checked at the accepted desktop target (1920×1080) after a rebuild; a row in this map is not that evidence. Browser-local layout preferences do not justify changing game-save schemas.

## 5. MAW-X9: existing gap owner crosswalk

The codes below are linked crosswalk rows, not new tasks. D5's crosswalk and ranked slices are the routing snapshot. **Owner/code** means the extant register, palette, rule or implementation owner to refresh before any future work; it does not reserve that owner or authorize implementation. Source spot-check means source text was checked in primary; it does not prove the described behavior in a browser. Existing labels and partial/done scope win.

| Existing gap | Current owner or palette code | Source spot-check / boundary |
|---|---|---|
| MIE-G1 | `CRAFTING_ENGINE.md` TSW3/TSW8 and TSW12-14; `MAKING_ITEMS_ECONOMY.md` | `craft_material_fit.js`, `native_rendering_recipes.js`; partial native input-cost fit, broader formula grading open. |
| MIE-G2 | `CRAFTING_ENGINE.md` PZ4/MR3/MR10; MAW-X4 | `crafting_frontier_runtime.js` imports/calls `matchRecipe` in dirty primary, contrary to older no-caller text; graded general fit remains open. |
| MIE-G3 | `CRAFTING_ENGINE.md` TSW11; MR11/AR11 | `crafting_frontier_runtime.js` owner validation remains Village/frontier scoped. |
| MIE-G4 | `CRAFTING_ENGINE.md` MR21 | `crafting_frontier_runtime.js` passes lot data to resolver; source map reports quality dropped before resolution. |
| MIE-G5 | `CRAFTING_ENGINE.md` TSW4/TSW10 | `processed_materials.js`, `harvest.js`, `items.js`: carrier lists are explicit/closed in inspected code. |
| MIE-G6 | `CRAFTING_ENGINE.md` PZ4/PZ9; LOTM broker owner | `book_world_lotm_broker.js`: world-owned broker/escrow path; no shared primitive inferred from this check. |
| MIE-G7 | `ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md`; WR rows | `money.js`, `simulation_effects.js`: player purse/native money key remains the cited path. |
| MIE-G8 | `CRAFTING_ENGINE.md` TSW10; PD5/PD6; harvest and owned-place clock owners | `harvest.js`, `owned_place_clock.js`: separate freshness/clock mechanisms; no general container trait located by the map. |
| MIE-G9 | `CRAFTING_ENGINE.md` round 12 TSW5; MR14/WR10 | Source-map claim: compatibility is explicit by named item or shared material type; directionality remains proposal. |
| MIE-G10 | `CRAFTING_ENGINE.md` TSW-L1/TSW6/TSW12-14; reference-mechanics checkpoint | Primary `native_material_catalogue.js` and `native_rendering_recipes.js` are dirty additions; bounded native-rendering consumer exists in source, broader runtime/world joining open. |
| MIE-G11 | `CRAFTING_ENGINE.md` TSW9 | `craft_resolver.js`, `craft_materials.js`: integer units, no general dimensional conversion. |
| MIE-G12 | `CRAFTING_ENGINE.md` round 8 PZ9/PZ-L3; LOTM broker owner | `book_world_lotm_broker.js`: cited stocked formula materials; no additional consumer claim. |
| MIE-G13 | `PROGRESSION_WORLD_STATE.md` S2; PZ2/PZ8 | `progression_gates.js` and importer list in MIE: brew requirements remain bespoke in the cited owner. |
| MIE-G14 | `MAKING_ITEMS_ECONOMY.md` L2; TSW1 | `items.js` legacy boolean tags and `tag_store.js` catalogue remain separate in cited source. |
| PROGRESSION_WORLD_STATE:G1 | `PROGRESSION_GATE_OVERFLOW_2026-10-23.md` GTO; progression register S2/S4 | `progression_gates.js` and `skill_overflow_domain.js`: use existing skill overflow rows; no generic new bank. |
| PROGRESSION_WORLD_STATE:G2 | `PROGRESSION_GATE_OVERFLOW_2026-10-23.md` GTO9 | `skill_overflow_domain.js`: current policy implementation owner; spill/pressure need an actual selected consumer. |
| PROGRESSION_WORLD_STATE:G3 | `PROGRESSION_WORLD_STATE.md` S1/S2; existing per-world requirement owners | D5 records four gate importers; keep a selected gate pilot local to its current command/world owner. |
| PROGRESSION_WORLD_STATE:G4 | `PROGRESSION_WORLD_STATE.md` S3; Tingen pathway owner | `ascension_paths.js`: current forward path view; branching presentation remains a per-world path/palette choice. |
| PROGRESSION_WORLD_STATE:G5 | `PROGRESSION_WORLD_STATE.md` S8; world-pack owner | `world_pack_save.js`: pack save helpers exist; D5's source search found no importer outside pack modules. |
| PROGRESSION_WORLD_STATE:G6 | `PROGRESSION_WORLD_STATE.md` S7/S12; `domain_registry.js` | `save_files.js` chain and domain slices are distinct validation owners; use S7 for new domain state as the register says. |
| PROGRESSION_WORLD_STATE:G7 | `PROGRESSION_WORLD_STATE.md` S8/S9/S12; LOTM/MOL, world-pack and expansion owners | `book_world_lotm_state.js`, `world_pack_save.js`, `expansion_engine.js`: retain each definition pinning contract; no global rewrite implied. |
| PROGRESSION_WORLD_STATE:G8 | `PROGRESSION_WORLD_STATE.md` S10/S12; LOTM/MOL command owners | `book_world_lotm_state.js`, `book_world_mol_state.js`: pending job definitions are owner-bound; preserve IDs or compatibility policy. |
| PROGRESSION_WORLD_STATE:G9 | `PROGRESSION_WORLD_STATE.md` S10; `simulation.js` | `simulation.js` hook lists remain the shared integration seam; D5 flags one-writer coordination. |
| PROGRESSION_WORLD_STATE:G10 | `PROGRESSION_WORLD_STATE.md` S2/S5/S6; current gate/clearance/rank owners | Existing requirement vocabularies remain separate; select by mechanism, do not add a fourth by default. |
| PROGRESSION_WORLD_STATE:G11 | `PROGRESSION_WORLD_STATE.md` S10; LOTM attention owner | `book_world_lotm_content.js`: attention resource/spend is identified; refill is explicitly unresolved in source map. |
| PROGRESSION_WORLD_STATE:G12 | `PROGRESSION_WORLD_STATE.md` S13; `world_knowledge.js` and per-world projections | Existing knowledge effects and owner projections; follow AR8/sealed-secret route, no shared reveal API presumed. |
| PROGRESSION_WORLD_STATE:G13 | `PROGRESSION_WORLD_STATE.md` S3/S4; GTO1-GTO10; pledges and breakthrough owners | `ascension_paths.js`, `skill_overflow_domain.js`, `breakthrough_trial.js`, `pledges.js`: keep ledgers distinct pending director choice. |
| PROGRESSION_WORLD_STATE:G14 | `PROGRESSION_WORLD_STATE.md` S6/S9; `clearance.js` and Tingen owner | `clearance.js`: one-world pattern only; D5/source map does not establish generic reuse. |

## Input identity and limits

Representative primary source hashes at read time (primary checkout working tree; not guaranteed clean or committed):

| Source | SHA-256 |
|---|---|
| `src/combat_math.js` | `81514c272fa5bd8b924013d61a6150b4eced080b7da83616e88ff0bc02313529` |
| `src/combat_opponents_domain.js` | `1787eac9aba4195fa731637384b86d0d6cae2e6d5e806c37ebbf9de657940cfc` |
| `src/models/combat.js` | `a61832f7ebbd006972b83a7f7dd6e00f2d7c7554794fdd810941308044ce2270` |
| `src/encounter_content.js` | `97ead2be42e64d6933b56e77626abf1674a0bc4bc02578ff6a5656bbe7aeac4a` |
| `src/companion_roster.js` | `3bda3e492c5e00a605eeb70c0d9bb8e0eba7006ea63332119892f4ebc580d78f` |
| `src/generated_people.js` | `49acbbe3b33d6abdd6f692dde475e145ff190bdc068a46660dcf845352bc3bc9` |
| `src/authored_site.js` | `f3d6d1ca0a76ff3ffb3560e08b0ddcf123d0fc07957da8f8e8e35b62451acbf4` |
| `src/site_projects.js` | `0a9eeb705992b988e5d678f2bd9f4d62f1fc4e911cdb1b456df69787c042583c` |
| `src/drainage_site_domain.js` | `5f5df06a5d4f689e50a9b3b19ebf1a05f1b96af346064fcaf8c4d6968e821cb0` |
| `src/layout_spec.js` | `bbbe52ba392eab71f196530893ab90a58395903a4e7b14d8ca5d97a73d9e66b7` |
| `src/workspace_state.js` | `54843df7043b7c1741f459ef548b8f0ea99f2a292a3568ee6d6800d679aa52d1` |
| `src/workspace_layout.js` | `b47e4fafbb583653cd4fd8cddd94b49828457e47a27c211997985f295547c419` |
| `src/panel_kit.js` | `cc06cec525598db8c30271a776da914a7e097baeae449a795b361782c7d9eb43` |

The dirty primary source is an observation input, not this branch's implementation base. It may include concurrent work absent from `3dfc49c`; each future owner must refresh source and checkpoint identity. No source-wide export inventory, build, focused test, browser run or gameplay acceptance was performed by this documentation lane. Those checks would not be evidenced by this register.
