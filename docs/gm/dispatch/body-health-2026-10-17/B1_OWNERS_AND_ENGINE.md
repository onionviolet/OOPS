# B1: body and health owners and engine fit, 2026-10-17

CHECKPOINT
- Status: complete, read-only lane; this file is the only write. No code, test, build, save or commit.
- Done: owner map (B1-O), accepted vs proposal split, contradictions (B1-X), runtime state and seam audit with file:line (B1-E, B1-S).
- Left: nothing in this lane. Coordinator folds codes into the root audit; any slice still needs its own authorization and a rebuilt browser check.

Labels: **SHOWN** = read in the cited file this pass. **STATED** = a doc says so (cited). **INFERRED** = this lane's reading or proposal. **MEMORY** = recalled, not checked (none used). Line numbers are from the working tree on 2026-10-17 and drift with concurrent writers. No sealed or `private/` file was opened; `docs/research/novels` was skipped.

Rules applied: AD5, AD7, AD13, AD16, AD19, AD22, AR1-AR16, MR1, MR29, sealed secrets.

---

## 1. Accepted direction that binds body and health (B1-A)

These are the only items with Weibao's yes. Everything in section 2 builds under them.

| Code | Accepted direction | Source (STATED) |
|---|---|---|
| B1-A1 | **Bodies are real.** Species, bloodline, constitution, sex, age and size carry stats, needs and lifespans; changing bodies changes them. | `docs/RULES_FROM_SCRATCH.md:189` (Rulebook 4, accepted 2026-10-10); `docs/RULES_INDEX.md:114` AD13 |
| B1-A2 | **Food:** useful meal benefits, comfortable unfed play, no hunger death. Famine is a skill with passive underfed XP and no active-play gate. | `docs/USER_VISION.md:2350-2390`; `PROJECT.md:310-318` |
| B1-A3 | **Forgiving recovery (OD12):** ordinary save/reload works; native defeat is unconsciousness and recovery; world danger and recovery strictness are separate; harsher play is optional or forewarned. | `docs/RULES_INDEX.md:130` AD19; `PROJECT.md:886-892`, `:1058`; `docs/DIRECTION_SYNTHESIS.md:367` |
| B1-A4 | **Locally unwinnable situations may exist** and can require going elsewhere or restarting, including in the same life. Supersedes old RC4. | `docs/RULES_INDEX.md:131` AD20; `docs/USER_VISION.md:3490-3515` |
| B1-A5 | **Return choice stays accessible while unconscious** (D26), depending on means and suppression. Automatic return on death is a consideration, not selected. | `docs/USER_VISION.md:3966-3982`; `PROJECT.md:705-712` |
| B1-A6 | **Fresh life has its own history; the old life pauses; one continuing self by default** (D25, AD10, AD12). Old body's fate follows means. | `docs/RULES_INDEX.md:111-113`; `docs/USER_VISION.md:3921-3965` |
| B1-A7 | **Time and aging:** ordinary play advances time; worlds and lifespans pace differently; offline aging depends on world and settings; inactive worlds pause. Rates and mortality rules open. | `docs/RULES_INDEX.md:121-122` AD15-AD16; `PROJECT.md:827-833`, `:946-967` |
| B1-A8 | **Comfort settings change freely; difficulty/recovery changes are explained and affect future play** (AD21). | `docs/RULES_INDEX.md:132`; `PROJECT.md:845-851` |
| B1-A9 | **Limits are adjectives; firm lines are save integrity and real-world guardrails** (AD22). Stated absolutes, canon ones included, describe the ordinary case; exceptions need an in-world reason, cost and record (AD5, 2026-10-17). | `docs/RULES_INDEX.md:96`, `:133`; `AGENTS.md` design framing |
| B1-A10 | **Body traits, temporary conditions and NPC recognition loop (2026-10-03):** implemented as one bounded Village loop; human content acceptance pending. Recovery medicine and broader transformation remain authored work. | `docs/USER_VISION.md:1633-1645` |
| B1-A11 | **Relationship content floor:** both people 18+ by body age and adult in appearance; claimed, soul or species age does not unlock it. A fixed real-world guardrail, not a world dial. | STATED in `docs/worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md:9` citing standing rule |

---

## 2. Owner map (B1-O)

Status column: **ACC** = carries accepted direction (section 1). **PROP** = proposal palette or plan. **RES** = research notes (source behavior, not YAIRPG direction). **REC** = lane report or reconciliation record. "Codes" lists the prefixes the owner uses.

### 2a. Primary owners (read these first)

| Code | Path | Covers | Codes | Status |
|---|---|---|---|---|
| B1-O1 | `docs/worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md` | **The health home.** Code-today audit, vitality vs injury vs illness model, located damage, scars, disability workarounds, chronic illness, contagion, poison/dose, aging, pain, care by others, medicine and healers, death/warning/aftermath, 16 priority worlds, idle recovery, desktop UI, prerequisites, five cheapest slices. | H35C1-13, H35M1-15, H35T1-10, H35D1-10, H35W1-16, H35I1-6, H35U1-6, H35P1-6, H35S1-5 | PROP (cites ACC food, mortal-mode and UI direction) |
| B1-O2 | `docs/gm/dispatch/relationship-prereqs-2026-10-14/HEALTH_REPORT.md` | Handback for O1: findings, six recorded contradictions, verification limits, index-row proposal. | H35F1-5, H35X1-6, H35V1-3 | REC |
| B1-O3 | `docs/HUNGER_AND_BODILY_NEEDS_CONSIDERATIONS_2026-10-13.md` | Hunger optionality, Proto23 source read, passive Famine structure, auto-eat and stock policy, adjacent needs (thirst, fatigue, temperature, illness, spoilage). | D1-D3, C1-C10 | ACC header + PROP mechanics |
| B1-O4 | `docs/GENETICS_CONSTITUTIONS_AND_BROOD_PLAY.md` | Body layers, physique, constitution, age curves (AG), different bodies/means (G22), health/immunity (HI), substances/tolerance (SB), wear/injury/repair (WR), micro states (MI), body cheats, overarching model and build order, ownership table with sibling palettes. | G1-G80+, AG1-6, HI1-6, SB1-6, WR1-6, MI1-10, CN, OV1-7, IM1-10, FD1-8, OW1-6 | PROP |
| B1-O5 | `docs/GENETICS_AND_HERO_START_PLAN_2026-10-17.md` | Build plan: `start` and `heredity` domains, body-instance keyed subjects, knowledge stages, slice ladder S1-S5, Q1-Q4 open. | GHS1-GHS111 | PROP (Q1-Q4 open) |
| B1-O6 | `docs/LIFE_SIM_NORTH_STAR.md` | Needs spectrum by body kind (`:4027`), hunger/idle options table (`:4097`), disease as life and world event (`:1935`), hidden health (`:6199`), last moments (`:4433`), healer careers (`:5479`). | Section headings; scattered L/P codes | PROP |
| B1-O7 | `docs/worlds/NONHUMAN_BODY_AUTHORING_2026-10-14.md` | Body template vs instance vs start records, function capacities, `health.zero` triggers with loss policy, lint, fixtures. | BA-E1-E4, BA1-BA12, N26, N32-N34, OT4, OT11 | PROP |
| B1-O8 | `docs/worlds/NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md` | Transformation kinds and carry table (vitals and conditions per kind), consent and control, transition record. | TF1-TF11+, carry table | PROP |
| B1-O9 | `docs/worlds/NONHUMAN_CLOCKS_LIFESPANS_AND_SEASONS_2026-10-14.md` | Body clock grain, chapter play for infants, seasons, mixed party clocks, settlement route. | CK1-CK18, OT3, OT6, E12 | PROP |
| B1-O10 | `docs/RULES_INDEX.md` + `docs/DIRECTION_SYNTHESIS.md` OD12 | Accepted restatements (AD13, AD19-AD22) and recovery considerations. | AD13, AD19-AD22, RC1-RC5 | ACC (AD) + PROP (RC) |

### 2b. Secondary owners (consult when a slice touches them)

| Code | Path | Covers | Codes | Status |
|---|---|---|---|---|
| B1-O11 | `docs/gm/dispatch/procgen-2026-10-13/p30/BODY_AND_AGE.md` | Injury/recovery stories, rehab as idle work, illness and age episodes, live seam audit (older line numbers). | AH1-AH3 ext, B-F1-F9 | PROP |
| B1-O12 | `docs/gm/dispatch/procgen-2026-10-13/cr1/BODY_AND_SPECIES.md` | Dose meets receiving body; species response to consumables. | CR, XD2-XD4, CO4-CO7 ext | PROP |
| B1-O13 | `docs/PROCEDURAL_CRAFTING_AND_CONSUMABLES_CONSIDERATIONS_2026-10-14.md` | Poisons/antidotes (CO1), permanent pills (CO3), tolerance/toxicity budget (CO4), mutagens (CO5). | CO1-CO10, WL | PROP |
| B1-O14 | `docs/MAKING_RULES.md` | Making envelope that potions and medicines use: truth vs knowledge (MR1), slots (MR9), shared envelope (MR29), no truth leaks (MR31). | MR1-MR36 | ACC rulebook (2026-10-15) |
| B1-O15 | `docs/gm/dispatch/procgen-2026-10-13/p27/DEATH_AND_AFTER.md` | Death, remembrance and world continuations; keeps existing life policies. | AC1-AC3 ext | PROP |
| B1-O16 | `docs/worlds/FIRST_CHEATS_AND_DEATH_REWARDS_2026-10-13.md` | Death rewards, legacy, afterlife offers, death powers. | DR1-DR5 | PROP |
| B1-O17 | `docs/worlds/world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md` section 17.4 | Wills, executors, funerals, presumed death, rebirth claims. | PW1-PW8 | PROP |
| B1-O18 | `docs/worlds/world-depth-2026-10-13/30_LIFE_STAGES_AND_CUSTOM.md`, `31_INNER_LIFE_HOUSEHOLD_COMMUNITY.md` | Life stages and custom; trauma and support (IL7), supernatural corruption (IL8), care roles (IL17). | LSW/LSE/LSL/LSX, IL1-IL39 | PROP |
| B1-O19 | `docs/worlds/world-core-kit-2026-10-14/W8_LIVED_LAYER.md` + `docs/worlds/WORLD_CORE_KIT_2026-10-14.md:355` | K22 "Bodies and health" kit floor per world: how people get sick, heal and age, one local medicine. | K22, W8.<world> | PROP |
| B1-O20 | `docs/worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md` | Activation/recovery profile, fresh-life return walkthrough, unconscious access (CCH-AR4), automatic recovery (CCH-AU1-CCH-AU4). | CCH-AR4 (local), CCH-AU1-CCH-AU4 | ACC answers + PROP profile |
| B1-O21 | `docs/TRIALS_AND_TRIBULATIONS.md` | Trial injury, flesh vs soul consequences, loss of control leads. | Section rows | PROP |
| B1-O22 | `docs/research/DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md` | Death/regression/tower book patterns. | R, B, T, L rows | RES |
| B1-O23 | `docs/gm/cross-audit-reconciliation-2026-10-15/SEMANTIC_BODY_*.md` | Reconciled body interface proposals (AB1-AB12), body-lineage lanes B1-B18. | AB1-AB12, B1-B18 | REC |
| B1-O24 | `docs/gm/dispatch/body-lineage-2026-10-14/b*/` | Body-lineage wave lanes (games, cards, pairs, UI wireframes at 1366x768). | Per-lane | PROP / RES |
| B1-O25 | `docs/COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md` | Companion injury, care, beast health. | K, AH refs | PROP |

### 2c. Research owners (source behavior only)

| Code | Path | What it records |
|---|---|---|
| B1-O26 | `docs/research/project-zomboid/BODY_AND_ACTIONS.md` | Body fields and timed-action feedback (BD codes). |
| B1-O27 | `docs/research/rimworld/feature-pass-2026-10-14/RESEARCH_LEARNING_AND_BODY.md`, `docs/research/rimworld/BODY_SOCIAL_FINDINGS.json` | Hediffs, body parts, research gates. |
| B1-O28 | `docs/research/immortal-life/pass-2026-10-14-deep/LIFESPAN_AND_RECOVERY_DIGEST.md` | HP-zero handling, lifespan and defeat continuity (L1-L5). |
| B1-O29 | `docs/research/idle-social-engine-scout-2026-10-06/traces/QUD_BODY.md`, `docs/research/noita/BODY_WORLD_DIGEST.md`, `docs/research/keeperrl/TRAINING_BODY_NOTES.json` | Body-part and body-world models. |
| B1-O30 | `docs/research/taiwu-ingredient-use-2026-10-15/` | Ingredient-to-medicine use tables. |
| B1-O31 | `docs/research/scroll-of-taiwu/pass-2026-10-14-systems/SYSTEMS.md`, `docs/research/dwarf-fortress/emergence-2026-10-15/` | Injury, poison and wound systems in those games. |

INFERRED: B1-O1 is the right root for a body-health audit. It already routes to O3, O4, O11, O15-O18 and states no competing constitution system (`35_HEALTH...md:33`). A new root should extend it, not restart it.

---

## 3. Contradictions and drift between owners (B1-X)

Prior contradictions H35X1-H35X6 (`HEALTH_REPORT.md`) still hold; only new or still-open ones are listed.

| Code | Side A | Side B | Suggested treatment (INFERRED) |
|---|---|---|---|
| B1-X1 | **Famine "not implemented":** `docs/USER_VISION.md:2374`; O1 line 9 calls Famine rates "proposals, not source functionality". | **SHOWN implemented:** `src/data/skills.js:911-913` defines Famine (removes up to 5% of optional hunger efficiency loss at level 40); `src/absorb_p23/exposure/exposure.js:7` sets threshold 20 fullness and 0.01 XP/minute, integrating only the underfed suffix (`:73-76`); joined by `src/absorb_p23/host_joins/tranche_one.js:18`; commit 355c7a3a4 (2026-10-14). | Status text in USER_VISION and O1 is stale. Record "implemented, unaccepted numbers" in the owners; do not edit USER_VISION's dated quote. Check whether browser acceptance exists before claiming it works. |
| B1-X2 | **Fixed no-lethal lines:** O1 H35D1 "no hunger death; illness cannot kill while offline"; H35I2 calls it "not a selectable lethal-offline dial". | **AD5 (2026-10-17) and AGENTS framing:** stated absolutes describe the ordinary case; exceptions exist with in-world reason, cost and record. AD19 allows harsher play when optional or forewarned. | Rewrite as default + dial + reason: default no hunger death and no offline lethal illness (reason: idle play must not punish absence, B1-A2/B1-A3); dial: an opted-in harsh mode or a forewarned survival segment; cost: known terms before commitment. Hunger death stays outside the ordinary game per B1-A2; flag to Weibao only if a world wants it. |
| B1-X3 | **North star options table** (`LIFE_SIM_NORTH_STAR.md:4097+`) lists "Full survival: draining meter with starvation" for harsh worlds, and `:4060` "Needs set the dangers: starvation for the organic". | B1-A2 no hunger death. | Already covered by H35X1 for Proto23; north-star table predates and should carry a "superseded for hunger death by 2026-10-13 food direction" note. |
| B1-X4 | **Aging is real and world-paced:** AD13 lifespans, AD15-AD16 offline aging by world/settings. | **Only aging end is the optional chronicle mortal mode** with fixed 18/80: `src/chronicle.js:78-80`, `:102`; O1 H35M8 "old-age ending remains only the existing optional mortal mode"; `src/body_progression.js` `body.begin` says "introduces no aging or closed-browser losses". | Not a direct conflict: AD16 allows world/setting aging; O1 just selects none yet. Note that species lifespans (AD13) have no runtime carrier besides chronicle's human numbers. Treat 18/80 as a Frontier human default, not universal. |
| B1-X5 | **NPC deaths exist and O1 does not list them.** SHOWN: `src/simulation.js:545-553` ends any person with `lifePolicy` at `bornAt + lifespan` ("Authored old-age ending"); `src/npc_lives.js:9-10` gives household NPCs seed-varied death years (65-84). | O1 section 1 audits only player HP, chronicle and heirs. | Add to the code-today table. Two NPC aging owners (simulation lifePolicy vs npc_lives) is an AR3 risk for any NPC health slice. |
| B1-X6 | **Conditions follow the body instance:** O8 TF5 "host damage stays local; soul/mental conditions travel with their bearer"; O5 GHS22 keys heredity by body instance; O1 H35M12 "place each effect on its actual carrier". | **SHOWN:** `src/simulation_contracts.js:218` and `src/simulation_effects.js:350-361` key `conditions[actorId]`, not body id. `src/simulation.js:650` deletes `body` and `vitals` on a body reset but conditions are reset separately by key list (`:644`). | First body-change slice needs a carrier field on conditions (body, mind, soul) or a body-keyed sub-map, with migration. Until then, any possession/transfer slice must declare what happens to actor-keyed conditions. |
| B1-X7 | **One tolerance owner:** O4 OW1 says one per-body tolerance state that CO4 items read and write; O1 H35M7 separates exposure, remaining effect, tolerance, removal. | **SHOWN three carriers already:** native Poison resistance skill (`src/data/skills.js:2619`), Frontier food exposure XP (`src/absorb_c2/local_life.js:69`), mixture exposure effect (`src/mixture_native.js:59`). | Name the skill as the tolerance-level authority and active effects as remaining exposure; CO4 and SB reuse them rather than add a meter. |
| B1-X8 | **One body projection:** O4 FD6 "one projection contract, several presentations"; AR8. | **SHOWN four hosts each recompute a supported body:** `statusCareSupportedBody` (`src/status_care_facts.js:23-28`), field care and contextual balm facts, book care; plus `currentNativeBody` (`src/main.js:1162-1165`) as default. Three panels (Body & recovery, status care, field care) present body state. | Cheapest seam B1-S1 below. |
| B1-X9 | **Stale code citations.** O1 H35C1-C3 cite `src/main.js:2767`, `:2792`, `:3721`; O11 B-F1 cites `:2767-2795`. | **SHOWN current:** `update_health` at `src/main.js:3870`, `kill_player` at `:4909`, rest/sleep at `:3902`/`:3922`. | Cite function names plus lines in the next owner revision. |
| B1-X10 | **"Defeat is unconsciousness" everywhere** (AD19). | **SHOWN two routings:** `kill_player` non-combat path skips relocation and the counter but still adds Recovering (`src/main.js:4915-4929`); `nativeLivingStrike` and Proto23 dojo routes stage a faint departure instead (`:4910-4913`, `:4786`). O1 H35C2 notes the noncombat difference. | Not a direction conflict. Any injury-on-defeat slice must hook all three branches or one shared defeat publisher. |
| B1-X11 | **Lasting wounds, scars and disability as palette** (O1 H35M3-M4, O4 G22, WR3). | **Healing resets everything on level-up:** `src/main.js:5157` "free healing on level up". | Fine while HP is the only vital. When a located injury exists, level-up restores HP only; injuries keep their own recovery (O1 H35C3 already says so). |
| B1-X12 | **Life record is lossy and never authoritative** (`src/life_record.js:1`). | O1 H35S5 and O15 want a known end-of-life health recap. | Recap needs its own cause record (H35P5); the life record may echo it, not own it. |

---

## 4. Engine fit: what exists today (B1-E)

All rows SHOWN unless marked.

### 4a. State and save slices

| Code | State | Where it lives | Save key and fields | Migration posture |
|---|---|---|---|---|
| B1-E1 | **Native HP and stamina** (`full_stats.health`, `max_health`, `stamina`) | `src/main.js` globals | `save_data.character.hp_to_full`, `stamina_to_full` (`src/main.js:6312-6313`). Load clamps to 1 HP when missing or too large (`:8148-8152`); a structured life that ended loads at 0 HP and dead. | Native vanilla format; stats recomputed on load. |
| B1-E2 | **Active effects** (meals, balms, poisons, venoms, Recovering, Wet, cold) | `src/active_effects.js`; runtime map `active_effects` | `save_data.active_effects` (`src/main.js:6498`), restored at `:8139-8140` (mixture products resolved by key). | Native; effect templates by name. |
| B1-E3 | **Defeat counter** | `game_stats.total_deaths` (`src/main.js:2790`) | `save_data.total_deaths` (`:6293`). Counts unconsciousness, not terminal deaths (O1 H35C2). | Native. |
| B1-E4 | **Simulation people** (life status, location, vitals for simulation-inventory NPCs, body record, lifePolicy) | `state.simulation.people[id]` (`src/simulation.js:64-73`) | Inside `save_data.expansion.simulation` (`src/main.js:6561`). `life` values include `alive`, `dead`, `departed`, `incapacitated` (read at `src/status_care_facts.js:27`). Schema 1-6 (`src/simulation_contracts.js:223`). | Versioned simulation schema; validators per group. |
| B1-E5 | **Simulation conditions** (intensity, expiresAt, optional interval/onTick) | `state.simulation.conditions[actorId][conditionId]` (`src/simulation_contracts.js:218`; apply/remove `src/simulation_effects.js:350-361`; expiry and ticks `src/simulation.js:536-543`; next boundary `:494`) | Inside expansion.simulation. Definitions registered per module (body, mood, status care, field care, book care). | Additive definitions; missing condition means absent. |
| B1-E6 | **Body record and faculties** (`people.player.body` with `id, form, ownerId, controllerId, hands, mobile`, plus `palms.callused`, `palms.marked`; `faculties.player[id].awakened`) | `src/body_progression.js:63-71`; default reader `currentNativeBody` `src/main.js:1162-1165` | Inside expansion.simulation; body sources in `actors.player.sources`. Optional proof record `record.body` validated by `src/backlog_expansion_body.js:519+`. | Body record only exists after enrolment; reader falls back to race and two hands. |
| B1-E7 | **Hunger pacing** (`hungerEnabled`, `fullness` 0-100, weather) | `src/absorb_e1/pacing.js:20-35` (drain `minutes/4.8`, so 100 to 0 in 480 played minutes) | `save_data.pacing_e1` (`src/main.js:6531`), restored `:6691`. | Schema via `normalizePacing`; default off. |
| B1-E8 | **Famine and exposure** (underfed minutes, fractional XP remainders, cursor) | `src/absorb_p23/exposure/exposure.js:7`, `:61-104` | `save_data.p23_exposure` (`src/main.js:6532`), `validateExposure` on load (`:6690`). | Schema 1; undefined means not joined; never retroactive (HOST_CONTRACT). |
| B1-E9 | **Local life food-poison exposure** | `src/absorb_c2/local_life.js:69` (Poison resistance XP from actual exposure) | `save_data.absorb_local_life` (`src/main.js:6546`). | Schema 1, defaults empty. |
| B1-E10 | **Mixtures** (potion truth fractions, dose, observation) | `src/mixture_state.js:56-70` (dose: health, stamina, sedation, duration) | `save_data.mixtures` (`src/main.js:6499`). | Own validator. |
| B1-E11 | **Chronicle life** (age 18, lifespan 80, open/mortal, endedAt, last-year note) | `src/chronicle.js:78-124` | `expansion.chronicle`. | Validated (`:12-19`). |
| B1-E12 | **Heirs** (bounded leftovers, heir chronicle) | `src/heir_inheritance.js:32-98`, `src/chronicle.js:288` | `expansion.chronicle`. | Validated leftovers. |
| B1-E13 | **NPC household lives** (birth, death year, events) | `src/npc_lives.js:5-51` | Saved and advanced on native year (O11 B-F6). | Own validator. |
| B1-E14 | **Domain registry slices** (tools, crafting, harvest, habitat, combat opponents) | `src/domain_registry.js:17-41` | Each domain writes `save_data[domain.id]` (`src/main.js:6354`), loads with `migrate` (`:6672`), ticks with consumed minutes (`:8606`). | Missing key loads `initialState()`. **No body or health domain exists.** |

### 4b. Actions and effects that touch the body

| Code | Path | Effect |
|---|---|---|
| B1-E15 | `update_health` `src/main.js:3870-3899` | Single HP writer: caps restoration at missing HP, grants Regeneration XP for actual healing, calls `kill_player` at 0. |
| B1-E16 | Per-tick regen/loss `src/main.js:9037-9050` | Reads `health_regeneration_flat/percent` and `health_loss_flat/percent` from summed stats, then `update_health`. |
| B1-E17 | `do_resting` `:3902`, `do_sleeping` `:3922` | Recovery scaled by max HP, Regeneration, Sleeping and furniture. |
| B1-E18 | Level-up `:5157` | Full HP restore. |
| B1-E19 | `use_item` `:5950-5975` | Domain items first (`domainRegistry.useItem`), mixtures next, then `prepareFood` (fullness) and each `item.effects[i]` through `add_active_effect` (`:6084`, group-tag stronger-wins replacement). |
| B1-E20 | Location and activity effects `:8724`, `:8816`, `:8864`, `:8918` | Wet, cold statuses, location-stage and activity-applied effects. |
| B1-E21 | Simulation `vital` effect `src/simulation_effects.js:281-288` | Changes `stamina`/`health` within max for native (through a plan) or simulation-inventory actors. |
| B1-E22 | Simulation `life` effect `src/simulation_effects.js:364-366` | Story death needs `lethal: true`; changing a dead person needs `resurrection: true`. |
| B1-E23 | Body commands `src/body_progression.js:28-60` | Grip drill (stamina cost, 12 min Sore hands), rough kit (20 min Scraped palms, permanent Palm mark), hand rest (removes both; grip and mark stay). |
| B1-E24 | Status care `src/status_care_content.js`, `src/status_care_facts.js:9-15` | Warmed, lined, steady, tired, focused conditions mapped to native stat multipliers; drying clears native Wet (`src/status_care_host.js:44-55`). |
| B1-E25 | Field care `src/field_care_content.js:13-19` | Open cut condition; wipe Sticky, halve listed venom time, dress cut. No HP restore. |
| B1-E26 | Contextual balm `src/contextual_balm_content.js` | One balm removes scrape only, records treatment, keeps native balm effect. |
| B1-E27 | Book care `src/book_care_content.js:6-10` | Braced, load strain, worker restored conditions inside the Paradise branch. |
| B1-E28 | Causal story strikes `src/causal_story_core.js:134`, `:317`, `:342`, `:381-403` | Body states `living/wounded/lost/absent`; protection candidates `lethal/body_erasure/capture/wound/source_severance`; prevention keeps wounds. |
| B1-E29 | Party helper `src/party_ui.js:9`, `:29` | NPC Lio has his own HP/stamina in simulation vitals and keeps his wounds. |

### 4c. Defeat and recovery now

SHOWN, `src/main.js:4909-4929`:

1. Combat zero HP (ordinary): `total_deaths++`, log "lost consciousness", move to last bed and sleep if auto-return is on, else to the parent location.
2. Combat zero HP with `nativeLivingStrike`: counter and log, then stage a faint departure (dojo or bed) and return early.
3. Non-combat zero HP: no move, no counter.
4. All branches except (2) add `Recovering` for 2 minutes: all XP x0.2 (`src/active_effects.js:481-490`). Branch (2) adds it at publication (`:4786`).
5. Recovery after that is ordinary regen, rest and sleep (B1-E16, B1-E17). Nothing records cause, wound or location of damage.

INFERRED: defeat already matches AD19. A first injury-on-defeat slice can attach a cause record without changing where the player wakes.

### 4d. How consumables apply effects

SHOWN path for a native item: `use_item` checks occupation and disposition, offers the item to domain owners, then mixtures, then applies fullness and each named `ActiveEffect` for its duration. Effects are stat bundles (`health_regeneration_flat`, `health_loss_flat`, `xp_multipliers`, `dexterity` multipliers) summed into `full_stats` by `character.addActiveEffectBonus` (called from `use_item`). Stronger group-tag effects block weaker ones (`:6094-6106`). Poison is a negative-flat effect (Slight food poisoning `-0.5`/tick, `src/active_effects.js:276-280`), not a condition. Medicine skill and Medicine for dummies exist (`src/data/skills.js:2606`; O1 H35C6).

INFERRED: two condition systems now coexist. Native **active effects** carry stats and timed buffs/poisons; simulation **conditions** carry named body states with facts for commands. Neither knows the other except through hosts that read both (status care reads native Wet, `src/status_care_facts.js:35-36`).

---

## 5. Cheapest seams for a first body and health slice (B1-S)

Ranked by change surface (AR13). Each is a proposal; none is authorized.

| Rank / code | Seam | What it is | AR fit | Save impact | Failure scenario to test (AD36) |
|---|---|---|---|---|---|
| 1 / B1-S1 | **`health` domain projection only** | Register `{id:'health', deps:[], projection}` through `domainRegistry` with one line in `main.js` (AR1-AR2). The projection reads HP (B1-E1), active effects (B1-E2), simulation conditions and body record (B1-E5, B1-E6) and returns one observer-safe "how my body is" view: vitality, named conditions with affected verb, lasting marks, available care and its terms. Body panel and care hosts read it instead of each recomputing (closes B1-X8). Matches O1 H35S1. | AR2, AR3 (no new fact), AR8, AR11 (second consumer: care hosts) | **None.** No `save`/`load`, so no slice. | HP deficit shown separately from Sore hands and Palm mark; a sealed or unknown condition stays hidden; a save with no body record shows the default human reader without inventing history. |
| 2 / B1-S2 | **Injury condition on defeat** | Add one simulation condition definition (for example a mild bruise with an affected-verb list and a recovery duration) applied from one shared defeat publisher that all three `kill_player` branches call (B1-X10). Recovery uses existing expiry and hand-rest style commands. | AR3 (simulation stays the condition authority), AR7 (quote then revalidate), AR10 | **Additive condition entries** inside the existing simulation slice; requires the player to be enrolled in simulation, or a guarded enrolment. Missing means uninjured; no retroactive injury from old `total_deaths`. | Defeat twice in a row does not stack beyond the definition's stacking rule; reload during recovery does not reset or re-apply; Recovering and the injury expire on their own clocks. |
| 3 / B1-S3 | **`health` domain with its own slice** | Same domain as S1 plus `save/validate/migrate/load/tick` for facts that have no current owner: injury cause records, diagnosis knowledge, care plans, chronic condition schedules, per-body tolerance if CO4 needs more than the Poison resistance skill (B1-X7). Tick from `domainRegistry.tick(consumed)` (`src/main.js:8606`), never a timer. | AR2, AR3, AR6 (one key, missing key loads defaults) | **New namespaced key** `save_data.health` with `schema:1`; old saves load `initialState()`. | Old save loads with no injuries; Export/Import round-trips; a care plan stops safely on shortage (O1 H35I3) and offline time follows the declared clock policy only. |

Cheaper non-domain reuse already in place (INFERRED): existing simulation `condition` effects and expiry are enough for S2; existing `ActiveEffect` templates are enough for a new remedy or poison as content (no new code path), following the field-care and contextual-balm pattern.

Seams to avoid for a first slice (default, dial, reason):
- **Default:** do not add a second HP writer. **Dial:** a world with separate wound pools can project them through S1 while `update_health` stays the only HP writer. **Reason:** AR3 and B1-E15.
- **Default:** do not key new body facts by actor id. **Dial:** actor-keyed is fine for mind or soul conditions. **Reason:** B1-X6; GHS22 already keys heredity by body instance.
- **Default:** do not import a body or health helper into `main.js` beyond the one registration line. **Dial:** a structural extraction round may move HP code out under AR9 and AR15. **Reason:** AR1, AR5.

---

## 6. Gaps the engine does not cover yet (B1-G)

| Code | Gap | Owner that already proposes it |
|---|---|---|
| B1-G1 | Located damage and function-specific penalties (only hands exist). | O1 H35M2; O4 WR1 |
| B1-G2 | Illness as an ongoing process with symptoms vs diagnosis. | O1 H35M5, H35U1, H35S4 |
| B1-G3 | Contagion routes. | O1 H35M6; O4 HI3 |
| B1-G4 | Pain as information separate from damage. | O1 H35M13 |
| B1-G5 | Disability workarounds and prosthetics as actions (backlog brass lung proof is the only installed-organ example, `src/backlog_expansion_body.js:25-60`). | O1 H35M4; O4 G22, WR5 |
| B1-G6 | Species lifespans and per-body needs (only human chronicle numbers and a human `needsFood` flag at `src/main.js:1289`). | O6 `:4027`; O9 CK; O7 BA |
| B1-G7 | Care by NPCs with provider stock and received-care memory. | O1 H35M11, H35S3 |
| B1-G8 | Death cause records and recap. | O1 H35P5, H35S5; O15 |

---

## 7. Evidence and limits

- Searched `docs/**/*.md` for injury, wound, illness, disease, poison, healer, hospital, lifespan, prosthetic, disability, fatigue, hunger and medicine, excluding `research/novels`, `private/` and `secrets`; about 90 files with hits, top owners read in part or whole. Searched `src/` for the same terms plus HP, defeat, Recovering, Famine and conditions.
- Read in full: O1, O2, O3 and the B1-A sources. Read by section: O4, O5, O6, O7, O8, O9, O11, O13, O19, `docs/ARCHITECTURE_RULES.md`, `PROJECT.md`, `docs/USER_VISION.md`.
- Code reads were source inspection only. No build, test or browser run; nothing here proves runtime behavior.
- Sealed secrets: none opened or referenced.
