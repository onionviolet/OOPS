# Research, doctrine and designs

Source root and counts: [REPORT](REPORT.md).

## H-R1: Technology grammar

SHOWN, `common/technologies/industry.txt:1`: a technologies wrapper contains named technology blocks. Each can declare research cost, start year, category tags, folder/position, outgoing `path` with target and cost coefficient, modifiers and AI weights. Paths, categories and display position serve different roles. Exclusive industry choices use `XOR` elsewhere in the same file. `common/technologies/armor.txt:3` joins equipment/subunit unlocks to a bounded on-research-complete effect, including loading a template only when needed.

SHOWN, `common/defines/00_defines.lua:302`, 706: base research slots 2, saved points per slot 30, base tech cost 110, year-ahead penalty factor 2, minimum research speed 0.1 and limited-bonus regret timer 3 days. STATED comments explain intent. The exact ahead-of-time time integration and all discount-order rules are native, so these do not justify an exact completion-time formula here.

SHOWN, `common/national_focus/generic.txt:76`: a focus adds a named limited-use bonus with bonus amount, uses and matching categories. One bonus can cover more than one category. STATED effect docs call this limited-use (`documentation/effects_documentation.md:2226`). PROPOSAL: a mentor or institution gives a saved, scoped practice/research benefit, with explicit eligibility and consumption at commit. Preview must not consume it; reload must not duplicate it.

## H-R2: This install's doctrine grammar

STATED, `common/doctrines/_documentation.md:1`: folders contain mutually exclusive grand doctrines bought with XP. Grand doctrines expose tracks and completion milestones; tracks take a selected subdoctrine, whose reward sequence advances with mastery. Data census: four folders, 12 grand doctrines, 14 tracks and 95 subdoctrines.

SHOWN, `common/doctrines/tracks/land_doctrine_tracks.txt:1`: mastery selects participating unit categories/subunits and applies different multipliers by track. STATED, `common/doctrines/subdoctrines/_documentation.md`: subdoctrines declare XP cost/type, visibility/availability, rewards with mastery thresholds, optional cross-track exclusivity and multiple-track policy. The docs still include a TODO for how rewards unlock. Do not turn a documentation TODO into a verified mastery formula.

STATED, grand-doctrine docs distinguish removable activation bonuses from persistent equipment effects that do not retract on changing doctrine. PROPOSAL: fitting world methods can have learned practice and a selected active method, with declared replace/removal rules. Keep other reasonable methods reachable through the world's chosen change policy, rather than permanent solo-player exclusions.

## H-R3: Equipment and designers

SHOWN: `common/units/equipment/infantry.txt:3` separates archetype from buildable versions and exposes stats, cost/resource fields and parent relationships. `common/units/equipment/tank_chassis.txt:36` declares allowed module categories by slot; `common/units/equipment/modules/00_tank_modules.txt:58` has No Step Back gating, additive/multiplicative stats, fuel/build cost and reliability tradeoffs. Plane and ship module wrappers gate on By Blood Alone (`00_plane_modules.txt:47`) and Man the Guns (`00_ship_modules.txt:76`). The native designer validates the whole assembled design; not every validation rule is exposed here.

SHOWN, `common/technologies/NSB_armor.txt:22`: chassis technology unlocks equipment and modules. The old tank family remains in `armor.txt`. `common/scripted_triggers/00_scripted_triggers.txt:1280` chooses legacy versus chassis capability tests by DLC. Do not infer active content from a filename alone.

SHOWN, `common/military_industrial_organization/organizations/00_generic_organization.txt:14`: generic manufacturers are excluded where an appropriate country/DLC-specific counterpart exists. This is a capability-selection pattern, not evidence that all gated organizations are playable for this user. Designers/manufacturers and appointments can alter the design/production context; detailed MIO growth and trait trees are only structurally inventoried in this pass.

## H-R4: Templates versus fielded equipment

SHOWN, `history/units/GER_1936.txt:1`: division templates contain named regiment cells and support cells. `common/units/infantry.txt:7` supplies manpower, width, organization, training, supply consumption and equipment need. Thus the formation layout references subunits, and subunits demand equipment; a researched equipment item is not a whole army.

STATED, `common/ai_templates/_documentation.md:11`: AI aims at role-specific target templates, chooses a best matching existing template and creates modified copies; `role_ratio` governs desired division roles. Undefined behavior is explicitly noted if both/neither availability selectors are used. This is valuable validation evidence, not a recommendation to duplicate the engine.

PROPOSAL for chain-build: show source, part, method, designed output, produced batch and observed use through existing M1 roles. Read receipts; never recalculate hidden truth or spend a draw in an inspector. Existing chain-build T2/T3 retains ownership and native/save gates.
