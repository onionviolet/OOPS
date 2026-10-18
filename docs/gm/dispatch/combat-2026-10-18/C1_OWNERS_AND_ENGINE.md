# C1: combat and conflict, owner map and engine fit (read-only, 2026-10-17)

Scope: docs/ owner map plus src/ combat seams for YAIRPG. No repo file edited.
Labels: SHOWN means read directly in this pass; INFERRED means deduced. Line numbers are
from the working tree at HEAD 5194313ee plus uncommitted edits.

Search basis (SHOWN): `grep -rilE 'combat|battle|enemy|duel|defeat|encounter|pursuit|monster'`
over docs/*.md (excluding novels, private, gm, research) hits 415 files. The table keeps docs
that own a rule, decision or seam, not passing mentions.

## Part A. Owner map

### A1. Rules and accepted direction

| Code | Doc | Prefix | Owns |
|---|---|---|---|
| C1-O1 | docs/RULES_INDEX.md:106 | AD8 | Quote: "**Opponent numbers are learned; own stats are exact.** First sight shows impressions and `???`." (accepted 2026-10-16) |
| C1-O2 | docs/RULES_INDEX.md:132 | AD19 | Quote: "**Recovery is forgiving by default.** Ordinary save/reload works; native defeat is unconsciousness and recovery. World danger and recovery strictness are separate; harsher play is optional or forewarned." |
| C1-O3 | docs/RULES_INDEX.md:143 | AD25 | Quote: "**Threats develop from their actual causes,** not automatic matching to the player." |
| C1-O4 | docs/RULES_INDEX.md:71, :133-135, :151 | AD20-AD22, AD28 | Router "Danger, defeat, difficulty, settings" = AD19-AD22 + SR14; AD20 locally unwinnable situations allowed; AD21 difficulty changes explained; AD22 only firm lines are save integrity; AD28 beaten obstacles stay beaten. No combat rulebook row exists in the register (SHOWN: no CR/combat prefix in the rulebook register lines 36-55). |
| C1-O5 | docs/BODY_AND_HEALTH_RULES.md:45 | BHR13 | "Injury degrades control before it removes a verb", lowering the same control numbers a worse tool lowers (proposal 2026-10-17). |
| C1-O6 | docs/BODY_AND_HEALTH_RULES.md:52 | BHR15 | "Lasting injuries from defeat are a difficulty setting," explained when chosen (AD21); rejects Battle Brothers harshness by default. |
| C1-O7 | docs/BODY_AND_HEALTH_CONSIDERATIONS_2026-10-17.md:144, :160 | BHC31, BHL7 | BHC31: defeat has three code routes (`kill_player` combat, non-combat, staged faint departure); any injury-on-defeat setting hooks one shared defeat publisher all three call. BHL7: one mild injury from that publisher behind BHR15, Medium S-M. |
| C1-O8 | docs/DIRECTION_SYNTHESIS.md:154, :367-375, :598 | OD12, RC | Defeat vs true death vs run progression vocabulary; OD12 forgiving recovery and its ACCOUNT FOR NOW list (costs, capture, warnings are proposals). |
| C1-O9 | PROJECT.md:1058-1059 | "Defeat" decision | "native defeat stays unconsciousness and recovery. True death, run endings and rewind remain proposals." Also :881, :890 (unavoidable-defeat loops allowed), :1357 (E2 durability proposal: default off, 0.04 wear per landed hit, 1-5 coin repair), :1359 (E3 elemental), :275-281 (R9 opponent display). |

### A2. Design palettes and owners

| Code | Doc | Prefix | Owns |
|---|---|---|---|
| C1-O10 | docs/worlds/world-core-kit-2026-10-14/W2_LAWS_POWER_COMBAT.md (1005 lines) | K2.x, K3.x, K10.x per world card (HP, DD, TT1-5, ML, LM, CI, SS, RP, JJ, BL, FT, HX, FM, NR, SL, OF) | Per-world laws, power core and combat grammar; K10 = "Danger and combat grammar" (root palette docs/worlds/WORLD_CORE_KIT_2026-10-14.md:68: threat roster 3-6 kinds, duel/ambush/siege/curse/debate feel, defeat and recovery). Per-world defeat defaults, e.g. HP :123-124 "injury, lost access or capture", DD :173-174 rescue/ransom, TT1 :221, :230 lethal causes. All INFERRED proposals. |
| C1-O11 | docs/ENCOUNTERS_AND_PURSUIT.md (51 lines, updated 2026-10-03) | none (dimension table) | Trigger / locator / access / contact / persistence split; four implemented nonlethal proofs (Neri trail, Sela ink mark, heavenly writ, workshop review); future families (ordinary pursuit, marked nemesis, heavenly rival). States a severe consequence "needs its own warning, interruption, defeat/recovery and settlement rules". |
| C1-O12 | docs/research/battle-brothers/ (REPORT, IMPLEMENTATION_PACKETS P1-P8, SMALL_TOUCHES 24 rows, FINDINGS.json) | P1-P8 | Source audit 2026-10-08. Lesson: wounds, pay, food and past work change people. P5 "Keep useful work available during recovery", P7 "Record an enemy power as an observed method", P8 "Give service and loss an individual ending". Packets require preserving native unconsciousness. |
| C1-O13 | docs/TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md | TQ, WX, WE, IP1-IP5 | Weapons as instruments (WX1-WX14 world weapon rows, WE2-WE19 repair per world); TQ74 says opt-in durability already exists with wear per landed hit only; :198 "repair exists (coins only, combat wear only)"; IP2 wear from work; TQ141 wounded living tools heal over time. |
| C1-O14 | docs/WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md | WC, RN, CR | Canonical weaponcraft authoring palette (per docs/gm/cross-audit-reconciliation-2026-10-15/SEMANTIC_WEAPON_OWNERS.md). |
| C1-O15 | docs/WEAPONCRAFTING_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md | WF, RU, AB | Parallel-session duplicate, not yet reducible (crosswalk says so). |
| C1-O16 | docs/WEAPONCRAFTING_RUNES_AND_REVEAL_CONSIDERATIONS_2026-10-14.md | RV1-RV8, XA, WC | Companion: reveal lenses for weapons and runes. |
| C1-O17 | docs/WEAPONCRAFT_RUNES_AND_MAKER_ARTS_CONSIDERATIONS_2026-10-14.md | WC, RN, P | Maker arts beyond weapons. |
| C1-O18 | docs/worlds/world-depth-2026-10-13/41_WEAPONCRAFT_RUNES_AND_REVEAL_CHEATS.md | AX, RU, WR | Abstraction under weapons and reveal cheats. |
| C1-O19 | docs/RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md | I11/I16/I18/I32/I33 refs | Enemy "systems" have three jobs (:48), mechanical difficulty with counters (:60), bloodlines and enemy builds (:103). |
| C1-O20 | docs/CHARACTERS_AND_WORLD_EVENTS.md:61, :385 | GG, DR | Party and shared adventures; hidden strength, combat profiles and threat estimates. |
| C1-O21 | docs/RIVALS_IDENTITIES_AND_FATE.md:45, :345 | TG | Rival archetypes; records `kill_player` as unconsciousness, not rival promotion; cause-driven threats (AD25 detail owner). |
| C1-O22 | docs/ENEMY_PROTAGONISTS.md | none | Independent enemy arcs, eight arc patterns. |
| C1-O23 | docs/worlds/NONHUMAN_MONSTER_SIDE_2026-10-14.md:65 | MF, MS, N | MF4: surrender, capture, dispersal and live-body harvesting need explicit outcomes; generic defeat must not auto-award a living neighbor's pelt. |
| C1-O24 | docs/worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md | H35C | Native HP and `kill_player` at zero (stale line numbers per BHX5). |
| C1-O25 | docs/ENGINE_EXPANSION.md:43, :65, :649-677, :723, :750 | UIE, PF, P | Guarded party encounter, encounter/pursuit runtime, combat special-mode gaps, named sessions must bypass `kill_player`/`kill_target`/loot, saved mechanical encounter packet. |
| C1-O26 | docs/MEANS_AND_APPRAISAL.md | AP, LS, MN | What each side can know and do (AD6-AD8 detail). |
| C1-O27 | docs/WANDERING_ZONES_AND_INSIGHT.md | G | Idle zones with occasional big encounters; notes automatic combat on hostile entry. |
| C1-O28 | docs/gm/dispatch/modular-seams-2026-10-16/COMBAT_OPPONENT_PROJECTION.md | PP5 | Opponent projection interface, "native-legacy" disclosure. |
| C1-O29 | docs/gm/causal-endings/evidence/COMBAT_LIFE_AUDIT.md | none | Named combat, life and publication audit (causal endings). |
| C1-O30 | docs/research/warsim/PROVINCE_WAR_FIT.md, docs/research/hearts-of-iron-iv/PROVINCE_WAR_FIT.md, docs/research/warsim/pass-2026-10-14-rea/ECONOMY_AND_BATTLE_DIGEST.md | W, L, G | War and province-scale conflict (fits the separate province-war repo). |
| C1-O31 | docs/ABUSE_AND_LIMITS.md | T, F | Limits are adjectives; no anti-cheat beyond save integrity (AD22). |
| C1-O32 | docs/gm/dispatch/body-health-2026-10-17/B1_OWNERS_AND_ENGINE.md:103, :120-160, :179 | B1-X10, B1-E, B1-S2 | Prior engine read for body: defeat branches, condition store, injury-on-defeat slice plan. |

Social and non-lethal conflict has no single owner. Pieces: ENCOUNTERS_AND_PURSUIT contact column (negotiation, trial, debate), W2 K10 "debate" feel, CHARACTERS_AND_WORLD_EVENTS open-world aggression, RIVALS face/institutional power (SHOWN headings only).

### A3. Weibao's own words on combat (USER_VISION.md)

| Code | Heading (line) | His words (brief) |
|---|---|---|
| C1-U1 | RNG, enemy systems, mechanical difficulty (1163-1167) | "enenmy 'systems' Making difficulty not just numbers but also mechanics and special interactions" |
| C1-U2 | Bloodlines and enemy powers follow-up (1173-1177) | "implementing power systems for enemies as well? ... Enemy with skilsl" |
| C1-U3 | Wandering zones (1187) | "automated resource gathering but with chance of big monster" |
| C1-U4 | NPC power levels (1419) | "If I decided to go crazy and attack the villiage chief it turns out they are secretly superful" |
| C1-U5 | Player actions change the story (670-677) | "attack the protaginst ... Making it really damn hard to defeat protaginists or having scripted saves" |
| C1-U6 | Lore-grounded adversaries (797) | "final enemies should make sense lore wise" |
| C1-U7 | OD12 (3457) | "forgiving recovery by default ... harsher modes optional or forwarned. World danger and recovery should be separate" |
| C1-U8 | OD11 recovery refinement (3500-3505) | Accepted: trapped or locally unwinnable situations can exist (supersedes RC4) |
| C1-U9 | Cause-driven threats (3684) | "threats should grow through their own causes, not automatically match us" |
| C1-U10 | Learned opponent numbers (4461) | "after fighting enough in general can have skill that does that? or we use an identify style skill" |
| C1-U11 | Extended enemies (4304) | Requested full individual enemy displays for multiple opponents (paraphrased in the doc) |
| C1-U12 | Death exaggerated (217) | "first character's death? Death being greatly exagerated?" |

### A4. Contradictions and tensions between owners

| Code | Tension | Evidence | Status |
|---|---|---|---|
| C1-X1 | Opponent numbers: AD8 (2026-10-16, accepted) says first sight is impressions and `???`; R9 (2026-10-15) and `src/combat_opponents_domain.js:1-3` show full opponent attack, speed, hit%, defense, HP as "native-legacy" disclosure, explicitly "not AD8 learned knowledge". | RULES_INDEX:106; PROJECT.md:275-281; combat_opponents_domain.js:5 `DISCLOSURE='native-legacy'` | SHOWN conflict. Newer accepted rule outranks; runtime not yet migrated. |
| C1-X2 | Defeat default: W2 world cards default defeat to injury, lost access or capture (HP :123-124 and others); AD19/PROJECT say native defeat is unconsciousness and recovery; BHR15 makes lasting injury a difficulty setting. | W2 :123, :173, :221, :260; RULES_INDEX:132; BODY_AND_HEALTH_RULES:52 | INFERRED reconcilable: AD19 separates world danger from recovery strictness, so world-card defeat consequences need either a world-level danger declaration plus forewarning, or the BHR15 setting. Needs one owner sentence. |
| C1-X3 | "Three defeat routes" (BHC31) undercounts. Code also finishes fights in `native_battle.js` finish (won/lost/withdrawn), `party_battle.js` (yielded helpers), `feature_expansion_battle.js:257-356` (won/lost/objective/escaped/withdrawn, fighters yield at 1 HP), plus causal story strikes and encounter scenes. | Part B | SHOWN. A shared publisher must cover at least six code paths, or BHC31's scope must say native-only. |
| C1-X4 | BHC31 / B1 report list "ordinary" `kill_player` branch first; in practice native combat always routes through `runP23CombatExchange`, which sets `nativeLivingStrike=true`, so the faint-departure branch is the normal combat path and the "ordinary" combat branch runs only when HP hits 0 outside an exchange. | main.js:4695 (nativeExchangeHost always set), :4772 (`nativeLivingStrike=true`), :4910-4913 | INFERRED from code, not browser-checked. |
| C1-X5 | Weapon wear: TOOLS palette TQ74 says wear is "per landed hit only" and opt-in; Battle Brothers and per-world WE rows assume repair kinds by world. Code also has `wearPerUse` for work verbs only. Not a conflict, a coverage gap: no wear for blocked/missed swings, no weapon breakage stop (condition 0 floors weapon to 10% power). | durability.js:17-18, :47, :134-142 | SHOWN. |
| C1-X6 | Three weaponcraft palettes with overlapping codes (WC in three files, RU in two). | SEMANTIC_WEAPON_OWNERS.md | Known; crosswalk names the canonical one. |
| C1-X7 | `total_deaths` counter name vs meaning: incremented on every unconsciousness. Multiple owners (DIRECTION_SYNTHESIS:156, ENGINE_EXPANSION:653) warn it is not death evidence. | main.js:4911, :4916 | Known; any publisher should add a separate defeat counter rather than reuse it. |

## Part B. Engine fit

### B1. Seams

| Code | Seam | file:line | Note |
|---|---|---|---|
| C1-E1 | Fight start on entering a hostile location | src/main.js:3329-3335 (`change_location` calls `start_combat()` unless safe zone), :9294 (on load) | SHOWN. Automatic on entry. |
| C1-E2 | `start_combat` | src/main.js:4808-4816 | SHOWN. Interrupts native work, calls `set_new_combat`. |
| C1-E3 | `set_new_combat` | src/main.js:4671-4702 | SHOWN. Restores saved `pendingNativeEncounter` or `current_location.get_next_enemies()` (src/models/location.js:336, seeded `STREAMS.encounter`); builds `new Combat({attackers:[character], defenders, nativeExchangeHost: runP23CombatExchange, combatOptions, encounterHooks})`. |
| C1-E4 | Combat class, attack loops | src/models/combat.js:99-160 (ctor), :270-322 `setAttackLoop` (stamina cost, `attack_power = fighter.getAttackPower()` at :319), :324-416 `doAttackLoop` (sub-tick timers via `engineTimeout`, calls `nativeExchangeHost(this, resolve)` at :360) | SHOWN. Real-time per-fighter cooldown loops, not a global tick. |
| C1-E5 | Exchange and strike | src/models/combat.js:418-458 `resolveExchange` (tactics hook, XP), :468-685 `doCombatAction` (hit chance, shield block, crit, `durability.landedHit` at :590, `target.takeDamage` at :615, defeat branch at :652) | SHOWN. |
| C1-E6 | Formulas | src/combat_math.js:1-25 `get_hit_chance`, :29-32 `mitigateCombatDamage`, :38-40 `rollBaseCombatDamage`, :47-63 `rollCombatStrike` (pure, used by saved NPC battles) | SHOWN. |
| C1-E7 | HP damage | src/models/person.js:464-494 `takeDamage` (player), src/enemies.js:138-160 (enemy) | SHOWN. Comment: damage types/resistances still TODO. |
| C1-E8 | Weapon/equipment into damage | src/models/person.js:627-633: `attack_power = (strength/10) * weapon.getAttack() * total_multiplier.attack_power`, else `unarmed_power`; src/components/levelable_component.js:329 multiplies by stamina; durability wraps `getAttack/getDefense/getShieldStrength` with `factor` (durability.js:47, :55-62, floor 0.1 weapon, 0.15 armor) | SHOWN. |
| C1-E9 | Transactional exchange host | src/main.js:4764-4806 `runP23CombatExchange` | SHOWN. Begins a native transaction over character, enemies, items, equipment, location, stats; sets `nativeLivingStrike=true`; on escape or faint stages a route home with `advanceChroniclePlan`, `Recovering`, `stageP23Defeat`; else saves. Rolls back durability on failure. |
| C1-E10 | Enemy defeat | src/models/combat.js:652-684 (`planDefeat` hook, `on_death`, XP, `get_loot` / `process_current_loot`, `kill_target`, `afterDefeat`); src/main.js:4848-4907 `kill_target` (living gear, harvest, bestiary, quests, technique observation) | SHOWN. |
| C1-E11 | Player defeat | src/main.js:4909-4929 `kill_player({is_combat})`; callers combat.js:655, main.js:3897 (`update_health` at 0, :3870-3899) | SHOWN. Branches: (a) `nativeLivingStrike&&is_combat`: `total_deaths++`, log, set `p23FaintDeparture` (dojo, bed or parent), return; Recovering added later at :4786. (b) other combat: leisure memory or counter, log, move to bed and sleep or parent. (c) non-combat: no move. (a-c) Recovering 2 (XP x0.2, active_effects.js:481). |
| C1-E12 | Defeat memory hook | src/main.js:1532-1538 `stageP23Defeat` calls `rememberNativeDefeat(raw,{kind:'unconsciousness',cause:'unknown',count})` | SHOWN. Already a typed defeat record with `kind` and `cause`, but only inside the leisure-memory slice and only when `p23Leisure` exists. Closest existing seed for a shared publisher. |
| C1-E13 | Leaving combat | src/display.js:2820-2835 "Go back to [parent]" travel action; `change_location` ends combat at src/main.js:3244-3251 (`end_combat()`) ; `end_combat` :5317-5322 | SHOWN/INFERRED: leaving is free, no pursuit, no cost beyond travel time. |
| C1-E14 | Paid escape | src/absorb_p23/combat_options/runtime.js:4, :53-58 (smoke tactic sets phase `escaped`, calls `host.escape`); host at src/main.js:4708 sets `p23EscapeDestination` to parent; :4776-4790 stages travel | SHOWN. Only smoke pellet, only when parent is safe zone. Also "Break after next exchange" pause. |
| C1-E15 | Nonlethal duels | src/native_battle.js:11-69 (Mara road duel, stops at 1 HP, results won/lost/withdrawn, relationship effects, pursuit closed); src/party_battle.js:1-103 (Lio guard, helpers yield at 1 HP); src/feature_expansion_battle.js:257-356 (sluice: objective, escape progress, withdraw, yield; results won/lost/objective/escaped/withdrawn); host src/native_battle_host.js, src/feature_expansion_battle_host.js | SHOWN. All use `rollCombatStrike` + `mitigateCombatDamage` with saved seeds and the simulation effect publisher, not `kill_player`. |
| C1-E16 | Pursuit | src/pursuit.js:11-199 (evidence-directed travel, `pursuitContact` :115, `advancePursuits` :138, `recordPursuitDeparture` :176); content src/pursuit_content.js, src/encounter_content.js; UI src/pursuit_ui.js | SHOWN. Simulation-side pursuers chasing the player for scripted encounters; not connected to native hostile-zone combat. |
| C1-E17 | Combat save state | src/main.js:6355 `save_data.native_encounter = current_combat?.snapshot(...)`, restore :6710; `combatOptions` nativePatch :4733, :4761; `equipment_durability` nativePatch :871, :1845, load :1920; `total_deaths` :2790 | SHOWN. Duel/sluice state lives in `expansion.simulation.sessions.player.nativeBattle`. |
| C1-E18 | Body conditions and HP homes | HP: `character` levelable `stats.full.health` (person.js:479); NPC duel HP: `state.simulation.people[id].vitals`; conditions: `state.simulation.conditions[actorId][conditionId]` (per B1-E5, src/simulation_contracts.js:218, apply in src/simulation_effects.js:350-361); active effects (Recovering) in `active_effects` | SHOWN for HP; conditions SHOWN via B1 report citations, not re-read here. |
| C1-E19 | Opponent display | src/combat_opponents_domain.js:5-32 (registered domain `combat-opponents`, projection only), src/combat_readout.js, src/ui/combat_display.js | SHOWN. |
| C1-E20 | Domain registry | src/domain_registry.js:3-45 (`registerDomain` with initialState/save/validate/migrate/load/tick/projection/commands) | SHOWN. AR1 landing point for any new combat domain. |
| C1-E21 | audit_remainder_combat_* | fit_content/facts/hooks/host: schema-5 hooks into the sluice battle (grip practice, Lio, shield/hook profiles); objectives_*: preparations (brace pad, traversal lashing, fitting custody) settled at sluice finish via `settleRemainderCombatObjectivesBattle` (feature_expansion_battle.js:260) | SHOWN headers and call site. |

### B2. How a native fight runs now (SHOWN unless marked)

1. Start: entering a non-safe location calls `start_combat`; `set_new_combat` builds a `Combat` with one player attacker and a seeded enemy group.
2. Tick: each fighter has its own cooldown loop (`setAttackLoop` then `doAttackLoop`, 60 sub-ticks); the final sub-tick runs `runP23CombatExchange`, which opens a transaction and calls `resolveExchange` then `doCombatAction` per target.
3. Strike: hit chance from attack points vs agility*evasion; shield block replaces evasion; crit; mitigation by defense with a 5% floor; one weapon wear and one wear per armor slot on a landed hit if durability is enabled.
4. End, win: enemy at 0 HP gives XP, loot, kill count; when all are dead `finish_combat_round` records the clear and immediately calls `set_new_combat` (endless waves in the zone).
5. End, loss: player at 0 HP calls `kill_player`; inside an exchange the faint departure branch stages travel to bed/parent/dojo, Recovering, leisure defeat memory, and saves.
6. End, leave: travel out ends combat with no cost; smoke pellet is the only in-fight escape.
7. Nothing records who beat you, where you were hit, or any non-death outcome other than "unconsciousness". Enemies have no yield, flee or capture behavior in native combat.

### B3. Cheapest code steps (proposals)

| Code | Step | Seam | Effort | INFERRED notes |
|---|---|---|---|---|
| C1-S1 | **Extract `publishDefeat({actorId, outcome, cause, scope, opponentIds, location})`** as one pure stager with outcome enum `unconscious` (default), `knocked_out`, `yielded`, `routed`, `captured`, `withdrew`, `escaped`. First caller: the three `kill_player` branches, reusing `stageP23Defeat`'s `rememberNativeDefeat` shape. Default outcome stays `unconscious` so behavior is unchanged. | main.js:4909-4929, :1532 | S | Lands as a registered domain or a pure module; add a separate defeat counter, keep `total_deaths` untouched. |
| C1-S2 | **Route the saved battles through the same publisher**: `native_battle.js finish`, `party_battle.js` helper yields, `feature_expansion_battle.js finish` map their results (`lost` to `yielded`, `escaped`, `withdrawn`) into the publisher's staged effects. | native_battle.js:26-37, party_battle.js:~57, feature_expansion_battle.js:257 | S-M | Makes BHC31/BHL7 work in every fight type (C1-X3). |
| C1-S3 | **Weapon wear from fighting beyond landed hits**: add `wearPerSwing`/`wearPerBlock` beside `wearPerHit` in `DURABILITY_PROPOSAL`, call `wearItem` for the weapon on misses and for the shield on blocks at combat.js:543-575. Optional `broken` stop: at condition 0 unequip or fall back to unarmed, reusing `durability.broken`. | durability.js:17-18, :110-142; combat.js:533-592 | S | Default-off flag already exists; no save change (same `condition` map). |
| C1-S4 | **Saved duels use wear too**: `rollCombatStrike` callers (native_battle, party_battle, feature battle) call `durability.landedHit` equivalent through the plan so duel wear persists. | native_battle.js:56, party_battle.js:~85 | S | Needs the durability serialize/rollback the native host already does. |
| C1-S5 | **Flee with a cost**: replace the free "Go back" exit while `current_combat` is live with a flee command: one escape check (agility vs fastest living enemy, `get_hit_chance`), failed attempt gives each enemy one free exchange, success publishes `escaped`. Reuse the smoke escape plumbing (`p23EscapeDestination`, :4776-4790). | display.js:2820-2835, main.js:3244, runtime.js:53-58 | M | Keep a free exit when no enemy is alive. A comfort/difficulty dial per AD21. |
| C1-S6 | **Pursuit after flee**: on `escaped` from a zone with a tracking enemy tag, open a short `pursuits` record (existing schema) so the encounter can re-contact at the destination; zones without trackers do nothing. | pursuit.js:65, :138, :176 | M | Uses existing simulation pursuit, keeps AD25 (cause = you fled a tracker). |
| C1-S7 | **Non-lethal player option in native combat**: a stance or tactic "subdue" that caps enemy damage at 1 HP and resolves enemy defeat as `yielded` (no harvest, reduced loot, relationship/fact effect), via the existing `encounterHooks.planDefeat` hook. Enemy-side: per-template `yields_at` fraction so humans (Slums thug) yield instead of dying. | combat.js:658-684 (`planDefeat`), enemies.js:43 template ctor | M | Also answers MF4 (no pelt from a living neighbor). |
| C1-S8 | **AD8 migration of opponent display**: projection reads a learned-facts record (kill count from `enemy_killcount` is already saved) and shows `???` until a threshold or identify means. | combat_opponents_domain.js:5-32, combat_readout.js | S-M | Resolves C1-X1; UI rules apply. |

Ranking for cheapest first: S1, S3, S2, S8, S4, S7, S5, S6.

### B4. Gaps not checked

- No browser run, no build. All runtime behavior is from source reading.
- `simulation.conditions` lines are cited from B1_OWNERS_AND_ENGINE.md, not re-read.
- Causal story strike paths (src/causal_story_core.js) and encounter scene executor were not read in depth.
- Province-scale war lives mostly in the separate ~/code/province-war repo; only the fit docs were listed.
