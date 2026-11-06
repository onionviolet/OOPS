# Lane C: ready stock, the encounter frame and effect channels (FD3+, FD17, FD18), 2026-11-06

Weibao, 2026-11-06: "...to like ammunition system and more? ... how to digitalize combat and variety of abstract abilities and more?" Asked in depth, "ideating backwards": playable outcome first, then state, owner, gap.

Proposals only (AD32). Nothing here is accepted, built or dispatched; no code, commit or other doc was touched. Root doc: [LARGER_FOUNDATIONS](../LARGER_FOUNDATIONS_2026-11-06.md). Claims are labelled **shown** (file:line read this pass), **stated** (a doc says it; not re-verified) or **inferred** (my reading). No runtime run. Sealed secrets are not involved; world facts cited are public book anchors by locator.

## 1. Reconcile first

The root doc treats FD17 as new design. It is mostly an incomplete integration of owners that already exist. Classes: DUP duplicate, VAR compatible variant, INC incomplete integration, STALE, DIS genuine disagreement (none found, RC16).

| Code | Root-doc claim | What the owners show | Class |
|---|---|---|---|
| RC1 | FD17: "one encounter frame" holds situation, resolver, abilities, outcomes, objectives | The frame exists: `conflict_frame.js:32` `runConflictFrame` takes a definition `{sides, objective, results, random, prepare}` (shown, :23-31 header). Consumers: road duel, party contest, sluice (schemas 1-5), tempo fight (schema 7), `cast_ability_adapter.js:5` (shown). SYSTEMS_REGISTER.md:20 lists it and says "No range, morale, situation card or canon-fight content yet" (stated) | INC. Extend this runner and the tempo record; do not add an eighth thing called a frame |
| RC2 | "Four resolvers exist by design" | Tempo is a scheduler, not a resolver: it spends time units, picks the earliest-ready fighter and calls `rollCombatStrike` and `mitigateCombatDamageFromStats` (tempo_fight.js:4, :186, shown). Per-exchange resolvers are combat_math, notch (`notch_contest.js:1-11`, one importer: `book_world_lotm_bands.js`), dice (`check_contract.js`, importers `check_resolver`, `check_inspector`, `check_rule_pack`, `check_odds`). A fifth route is authored ordered encounters (`cast_ability_adapter.js:13`, moves with `after`, LOTM only) | VAR. Correct the count: one scheduler, three resolvers, one authored-scene route |
| RC3 | FD17: "outcomes going to `harm_state`" | Two publishers already: `defeat_domain.js:7` (typed outcomes, CBR2) and `harm_state.js` (rungs, parts). Tempo reaches harm through `tempo_location.injuryFor` ("public door", tempo_location.js:3-5, shown). Mismatch: `DEATH_CAUSES` (defeat_domain.js:12) lacks `loss_of_control`, which `HARM_DEATH_CAUSES` has (harm_state.js:11) | INC (shown) |
| RC4 | FD17: "non-lethal objectives, which `audit_remainder_combat_objectives_*` already sketches" | Stronger than a sketch: schema 5 objective battles with recovery (carry a custody item out) and supply, Frontier-only (objectives_content.js:9-11, state module `recovery`/`supply`, shown; importers `feature_expansion_battle`, `world_completion_battle_validation`). Tempo has only per-fighter `goals` revenge/mercy (tempo_exit.js:41, shown) | VAR. Cargo escort has a precedent shape (custody effect), not a tempo field |
| RC5 | FD17: three grains "quote and settle, exchange summary, turn by turn" | All three have entry points: quote (CBD10 "could down you" bound, COMBAT_AND_CONFLICT round 3, stated; MCP `game_quote`), `driveTempoFight` with policies aggressive/steady/safe (tempo_fight.js:85, :339), `commitTempoMove` (:332). `handOverTempoFight` plays safe moves only (:345, LSD316). ACR1 names "encounter policy" (stated) | DUP of design intent; INC of selection rule (nothing picks the grain) |
| RC6 | FD17 first consumer is Klein, "FD3 plus FD2" | FD2's atlas row says "Rejected: rerouting L2b combat (AD5, no consumer asked)" (atlas :63, stated). Klein is now the consumer, so that rejection's reopen trigger is met. LOTM deep dive LCD6 already proposes "tempo path consumes it behind one flag" (stated) | STALE premise, reopen trigger met. Not a conflict |
| RC7 | FD3+: "exorcism or silver rounds" | Silver demon-hunting round already exists with `vsBeyonderForce:1` (be_firearm.js:14-16, shown). Missing: armor/scale blocking silver (ch129 P047, ch134 P052), three-month power loss (ch186 P024), five chambers and reload three (ch199 P010, P054) (MECHANISM_BACKLOG G17 :109, B8 :14, stated) | DUP partly; rest INC |
| RC8 | FD3+: "Same seam for talismans, spell charges and doses" | Three counting shapes already coexist: `ready_stock` (carried/ready), ability `charges` paid as an actor resource (structured_ability_runtime.js:24-27 comment, shown), `energy` effects (B10, backlog :16 stated). "Wand condition" is gear wear, owned by CBR19/CBR20 (stated), not stock | VAR. Needs a one-line routing rule (section 5) |
| RC9 | FD3 is the seam for NPCs too (implied by "same seam") | `STOCK.actor` is `'player'` (be_firearm.js:29) and the save assertion reads `a.player` only (:78, shown). ABR21 says player and NPC share rows (ABILITY_RULES.md:182) | INC |
| RC10 | FD18: "`effect_dsl.js` stays inert until a channel needs it (ABR4)" | The inert status comes from ABILITY_RULES "how this applies" table and ABM11 ("decide whether it gets a consumer or is retired", stated). ABR4 is "engine owns verbs, world owns numbers" (:64). Importer: `damage_types.js` only (shown). Mis-cite, same conclusion | VAR (cite fix) |
| RC11 | FD18 table as a new list of channels | A verb vocabulary exists: `functions` = physical, craft, storage, perception, support, each with allowed effect types (structured_ability_runtime.js:6-12, shown). A channel list that ignores it forks the vocabulary | INC. Channels must project onto function plus effect type (section 6) |
| RC12 | FD18: "Perceive the hidden: look/seenBy (ABR19)" | ABR19 is what the player sees and what witnesses learn (ABILITY_RULES.md:170). `look`/`seenBy` is the observer record (`lotmReveal`, book_world_lotm_abilities.js:85, shown). Perceiving is the reading side of that record | VAR (cite fix) |
| RC13 | FD9 fog "unlocks" Tingen night scenes | Tempo reads only `light==='dark'` (+.05 mishap, tempo_fight.js:67, shown). `world_light.js` fog (FD9) never reaches a fight | INC (blocks OC1) |
| RC14 | FD17 range as part of the situation | COMBAT.md:44 and :70 say "no range data" on purpose (stated); SYSTEMS_REGISTER.md:20 repeats it. B8 holds range as firearm dials (be_firearm.js:22, shown) | INC. Range belongs in the frame; firearm dials become defaults it reads |
| RC15 | Two ways to take a verb in a fight | Tempo moves are a closed list `TEMPO_MOVE_IDS` (tempo_fight_contract.js:9), enforced by the validator (:37, shown). Cast encounters are separate definitions. Nothing joins them | INC. Biggest save-affecting gap |
| RC16 | Any genuine disagreement with an accepted rule | None found. One soft tension to carry: AD5/AD38 ("anything reasonably works") against closed lists such as `TEMPO_MOVE_IDS` (RC15); fix with one parametrized verb, not a longer list | No DIS |
| RC17 | OC6 terms and OC7 contract as new frame fields | Implementation map C3 "term contract: offer, answer window, scope, duration, exit, penalty" already covers staffing, hire and patron terms across worlds (IMPLEMENTATION_MAP :156, shown, header only). A duel's `terms` and a mercenary contract are members of that class | VAR. Reuse the C3 shape; do not invent a combat-only terms record |
| RC18 | Ability drawbacks as a free-form column | C10 cause-keyed loss of control and backlash (map :310, shown, header and members) is the owner class; LOTM already routes it through `harm_engine`/harm_state (HARM_DEATH_CAUSES has `loss_of_control`) | INC (ties to RC3). Drawback column reads C10, not ad hoc conditions |
| RC19 | Abilities in a fight need their own execution order | ABILITY_AUTHORING causal contract: Eligibility, Preview (no random draw, no private disclosure), Commitment (freezes participants and parameters), Resolution, Observation, Aftermath (ABILITY_AUTHORING.md:32-47, shown). Maps onto quote, commit and log; ABR11 binds it (stated) | VAR. Adds one hard rule: a quote cannot consume a draw (N9) |
| RC20 | FD18 observer rules as a new table | HTP49 rank-gap and observer table (HIGH_TIER_POWER :169, stated, proposal, unbuilt) and LCD3 grade gate and LCD7 shown/believed/actual (deep dive, stated) overlap | DUP of intent. One per-world observer table; the channel table's observer column reads it |
| RC21 | Stock `quality` as a field | ESD16 (proposal): show workmanship, rarity and effects as separate facts, keep the underlying value (EQUIPMENT_STAT_DIMENSIONS :69-97, shown) | VAR. Quality as a kind id fits; display headline grade, list effects from the kind row |

Corrections proposed to the root doc (not applied): RC1 and RC2 reword FD17 as "extend `conflict_frame` and tempo schema 7"; RC10 and RC12 fix two ABR cites; RC7 note silver exists.

## 2. Outcomes, ideated backwards

Each outcome lists what the player does, then state, owner and gap. "Gap" is the smallest missing piece.

### OC1 Klein's night ambush: revolver, three loaded rounds, fog, flees

Player sees: a fog line on the status text; a fight card with "3 loaded, 14 carried"; moves Fire, Reload (three at a time), Brace, Back away, Use a power; odds words ("a long shot in fog"); an exit that can fail and leave a follower.

| Piece | Owner today | Gap |
|---|---|---|
| Stock counts, load, fire, spend | `ready_stock.js`, `book_world_lotm_be_firearm.js` (shown) | Reload time, five-chamber dial and batch size not modelled; no caller of `resolveShot` in `src/` (grep, shown) |
| Klein's and the attacker's strength | `fightWindow` (bands.js:109) built from pathway and sequence; only a test calls it (grep, shown) | No builder turns a window into a tempo fighter (`hp`, `profile.stats`, `speed`) |
| Fog, night | `world_light.js` (FD9) | Tempo reads `dark` only (RC13); fog must become a visibility modifier on aim and on notice |
| Range | B8 dials close/short/far | Not in the frame (RC14) |
| Fight loop, exit, surprise, hit location | tempo schema 7 (shown) | Moves closed (RC15) |
| Aftermath | harm_state, defeat publisher, witness memory | Gunshot noise and Nighthawk notice have no event; casings as evidence (new angle) |

Chain: `fightWindow` -> fighter builder -> `beginTempoFight` -> notch resolver per shot with a keyed draw -> stock effect staged in the detached plan -> settle writes rounds back.

### OC2 Harry and friends face the troll with two spells and no damage numbers

Player sees: Levitation and Mend as the only verbs; the troll's club rising; a tension line, never HP. Hermione's safety is the objective.

State: levitation and glass repair already exist as descriptor rows (ABILITY_RULES.md:206, stated). Owner for the scene: the authored ordered route (`cast_ability_adapter`, moves with `after` and a `result`, shown :13-30), because the canon beat is a sequence. Gap: HP has no `defineCastAbilities` consumer (importers are LOTM files only, shown); `troll` needs a threat clock and an objective (RC4), and a presentation dial "words only" (section 3). Resolver: none needed per exchange; the club-lift row changes a fact (`troll.armed`), which the next authored move reads.

### OC3 A Village patrol skirmish auto-resolves as a quote

Player sees: before the shift, "likely fine, small risk of a bruise"; after, one summary line and the patrol pay. State: ordinary combat zones and `cohort_battle.js` (saved NPC battles, shown) already run on `combat_math`; the `patrolling` job exists (activities.js:91, shown). Gap: no skip grain that runs the same keyed draws as the turn grain (section 4), and no stop rule tied to CBR27.

### OC4 A Seer uses danger intuition to act first

Player sees: a warning line before the fight starts, then the first move is theirs. State: tempo already sets a surprised side from a keyed notice draw (perception plus 10 x draw against best stealth, tempo_fight.js:317) and delays them by 3 units (:321, shown). Source anchors: G9 foresight and a danger warning that freezes the body (MECHANISM_BACKLOG :115, stated). Gap: the ability must write a notch bonus to perception for that draw and a ready delay as its drawback; no Seer row does either.

### OC5 A Spectator reads an opponent mid-fight

Player sees: the opponent's intent line changes from "?" to a stated intent with a confidence word. State: CBR14 says intent, weakness and hidden abilities are learned fields with source and confidence (DOMAIN_RULES, stated); the observer-safe `combat-opponents` projection feeds the card (combat_situation_ui.js header, shown). Gap: a `reveal` verb that writes a learned fact through `people_knowledge` (8 importers, shown) and a card that reads it; the Spectator row (L1 lane, stated) has no fight use.

### OC6 A duel with rules and seconds

Player sees: agreed terms (first blood, blunted weapons, witnesses) and a second who can speak and step in. State: the road duel is an agreed bounded contest (`native_battle.js`, `rival.native_duel`, shown); allies with orders exist (`tempo_allies.js`, shown); CBD12-CBD14 hold the terms palette (stated). Gap: a `terms` record on the frame and a breach test (witness plus consequence), as CBD13 says.

### OC7 A mercenary escort where the objective is the cargo

Player sees: "Cargo: intact" beside HP; losing the carrier drops the cargo; victory can be a lost fight with a delivered crate. State: custody effects and loan records already move items (objectives_content.js `fittingReturnEffect`, shown); the stock view shows who holds what (O4 checkpoint, stated); contract pay is `purseEffect` (FD6); the position is FD15 (proposed). Gap: objective kind `carry` on the frame, holder tracking in the battle record, and result rows "delivered / lost / stolen" (CBR2 outcome list does not name objective results; keep them separate, K10.8 says defeat has several owners, stated).

## 3. Encounter frame fields (spec, default and dial)

One record, extending `conflict_frame` definitions and the tempo `b` record. Every field is optional with the current behaviour as default, so existing fights stay byte-identical (the F1 port's own rule, conflict_frame.js header, shown).

| Field | Default | Dial and reason |
|---|---|---|
| `resolver` | `strike` (combat_math) | `notch`, `dice`, `authored`; a world picks (AD46). Per-fighter override allowed, since a Beyonder and a clerk can share a street |
| `grain` | chosen by rule below | player preference and ACR3 novelty can override |
| `situation.range` | none (unmodelled, as today) | bands close/short/far; moving costs time units; reason: guns and spells differ by distance |
| `situation.visibility` | from `light` and fog | fog and night add notches against aim and notice; reason: OC1 |
| `situation.cover` | none | cover adds protection per slot; owner `tempo_location.defenceAt` |
| `situation.noise` | quiet | loud acts emit an alert fact (gunshot, shout); reason: witnesses decide aftermath (CBR29) |
| `objective` | defeat (today's behaviour) | `carry`, `protect`, `reach`, `outlast`, `learn`; each names a holder or place and its result rows |
| `terms` | none | agreed rules, witnesses, seconds, harm cap (CBD12-CBD14) |
| `stakes` | from lethality and recovery dials (CBR6) | caps harm and sets what is learned |
| `stock` | none | per-holder snapshots (section 5) |
| `presentation` | numbers as today | `words` (odds words, no hit points); a world dial, not a resolver (new angle N10) |

Grain rule (proposal): skip (quote then settle) only when worst-case harm stays below a lasting-harm rung, no unseen ability or new enemy kind is present (CBR27 stop rules, stated) and the objective is plain defeat or drive-off; summary (`driveTempoFight` with a policy) for known opponents with real stakes; turn (`commitTempoMove`) for first meetings, canon set pieces, lethal danger or any player-chosen detail. All three consume the same keyed draws (tempo_fight.js:56, shown), so for identical move choices the grain changes how much is shown, not what happens (ACR9, stated). Policies and hand-over pick their own moves, so a summary fight can differ from the one the player would have played; that is a choice of policy, disclosed in the policy name.

## 4. How each resolver plugs in

The scheduler is tempo: time units, ready order, notice and surprise, exits, allies, hit location. A resolver answers one question, "what does this action do to the target".

| Resolver | Plug point | Hits and damage | For |
|---|---|---|---|
| `strike` | `rollCombatStrike`; modifiers `hitModifier`, `evasionModifier`, `damageModifier` already exist (combat_math.js:69-70, shown) | points, armor, typed scalar (damage_types) | Frontier, Village, saved NPC battles |
| `notch` | `contest(delta, rng)` and `hitsToDown` (notch_contest.js:8-11) | each hit removes `maxHp / hitsToDown` of the fighter's real max HP (inferred bridge; native HP offsets and the card still read real HP, as L2b proved, and `harmRung(fraction)` still works, harm_state.js:73) | LOTM, and any world with open scales; presentation can hide the numbers (N10) |
| `dice` | `prepareCheck`, `outcome` (check_contract.js:66, :105) with a profile per move | degree of success maps to miss, hit, crit | D&D, HP duel if its world wants d20 |
| `authored` | `defineCastAbilities` move rows with `after` and `result` | none per exchange; the row's effects change facts | canon set pieces, HP troll, Tingen climax beats |

Rule: a fight picks one scheduler and one resolver per fighter. Shots and spells ask the resolver of the actor, not the target. Randomness: three contracts coexist today, ordinal legacy stream (`legacyConflictRandom`, conflict_frame.js:15, which says new fights should use keyed draws, :14), keyed draws (tempo, :56), and a bare `rng` function (`resolveShot`, `contest`). A mixed fight uses keyed only: `rng = () => drawFraction(seed, checkKey({subject: shot, method, period:{at: b.actions}, ...}))`, the same construction as tempo_fight.js:186 (shown).

## 5. Ammunition and ready stock, extended

Routing rule, one line each (RC8):

| Kind of thing | Owner |
|---|---|
| Counted, consumed or loaded: rounds, arrows, bolts, thrown cards, talismans, potion doses | `ready_stock` (carried plus ready) |
| Gear that wears or breaks: wand, blade, bowstring | gear condition (CBR19, CBR20, AFW26) |
| A reserve that regenerates: spirituality, mana, stamina | vital or `energy` effect (B10) |
| A per-use price of one ability | ability `costs` and `charges` |
| Heavy things | carried weight (FD13, unbuilt; D&D `dnd_phandalin.js` is the reference shape, stated) |

Stock kind row (extends `BE_ROUND_KINDS`, be_firearm.js:14):

| Field | Default | Dial, reason, owner |
|---|---|---|
| `force`, `vsBeyonderForce` | as built | notches on the world's scale |
| `attackMix` | all `physical` | typed mix through `damage_types.js` (silver, blessed, poison, acid); coatings are the same field applied temporarily (CBD11) |
| `tags` | none | `bane:<creature>` and material (AFW19, AFW27); a world that tags creatures that way reads them (AFW19 note) |
| `reload` | one unit, 4 time units (dial) | batch size and time per batch; G17 says three at a time; set per weapon, not per kind |
| `quality` | one grade | grade as a distinct kind id (cheap, good); no floats in saves |
| `scarcity` | by channel | each channel is an existing owner: armory form (`institution_store`, FD15), range hire (the hire includes six rounds, ch141 P061), purchase (`purseEffect`, FD6), craft (crafting rows) |
| `decay` | none | per-age kinds (fresh, stale) converted by a dated rule, never a per-round timestamp; ch186 P024 is the anchor (stated) |

Save impact: kinds are a fixed list asserted by `assertKnownKeys` (ready_stock.js:42, shown), so adding a kind is additive and removing one breaks saves. Never remove a kind id; aging moves counts between ids.

Holders. A fight record carries `stock: {holderId: {kind: {carried, loaded}}}` copied from real holders at `beginTempoFight` and written back as resource effects at settle. This follows the detached-plan rule L2b proved (offsets staged per move, committed once; L2B receipt closure, stated). Players keep the actor-resource keys they have; NPC holders use the same key shape on their actor. Spec gains `holder` instead of the fixed `'player'` (RC9). A shot stages `spendEffects` in the same plan that records the roll, so a round is spent exactly once (resolveShot header, be_firearm.js:64-66, shown).

Reload and range are moves, not stock fields. Misfire joins the mishap chance (tempo_fight.js:59-69; rain already adds .03, shown): damp, gear condition and a hurried reload raise it.

Supply chains (proposal). Rounds come from three real pressures: an institution's issue and its paperwork (ch165 P040, fifty rounds on a Captain-signed form, stated), hire or purchase, and loot from the fallen (a custody move like O4's stock transfer). A shortage is a world fact, not a global tuning table (AD5, AD38).

## 6. Abilities: modifier or verb, and the effect channels

Entry test, in order: (1) changes a number an exchange already reads (aim, evasion, damage, notice) -> modifier with minutes and a drawback condition (LCD5, stated; `hitModifier` and its siblings are the plugs, section 4); (2) takes the actor's time to do something else -> verb, one tempo move with minutes as time units; (3) changes what is known -> reveal verb that writes a learned fact; (4) changes the place -> situation change (light, cover, range, noise).

Verb route for saves (RC15): add one parametrized move id (`ability`) carrying `abilityId`, plus `shoot` and `reload` for stock. Do not add one move id per ability. The validator checks the id exists in the registry and refuses politely if a row is missing. Split two sets that are one list today: `KEEP` derives from `TEMPO_MOVE_IDS` and serves both as the validator and filter and as the default for fighters with no moves listed (tempo_fight.js:40, :309, shown). Appending would hand every default fighter the new moves, and leaving `KEEP` alone would filter declared ones out. So add an allowed set (validator and filter) and keep the default set unchanged; grant `shoot`, `reload` and `ability` per fighter only when its stock snapshot holds a weapon or its known rows exist, the way `order` is pushed only when an ally exists (:312). Keep schema 7 and add optional fields, following the `goals` and `parts` pattern in `beginTempoFight` (tempo_fight.js:310, shown). Whether `validateTempoBattle` rejects unknown keys is inferred as no, because it lists the keys it checks (:26-40); a focused test must confirm.

Channels, projected onto the existing function vocabulary (RC11):

| Channel | Function and effect type | Owner seam | Cost shape | Drawback shape | Observer rule | Status |
|---|---|---|---|---|---|---|
| Reveal a fact | perception `knowledge` | `people_knowledge`; learned fields (CBR14) | focus or spirituality, time units | wrong or partial answer, a mark left on the diviner | the asked party notices only by a `look` they can see | rows exist for LOTM Seer by hand |
| Perceive the hidden | perception `observation` | reading side of `look`/`seenBy` | steady drain while active | blinds other senses, draws attention (G9) | not seen by others unless the look says so | stub |
| Read people | perception `knowledge` about a person | subtext (K31), FD10 | time units, closeness | being read back, strain | target knows only if trained to notice | proposal |
| Shift odds | support `condition` or modifier | `hitModifier` family; notch `delta`; check profile modifiers (CHECK_BUDGET.modifiers 32, check_contract.js:6) | one-use charge or minutes | luck debt or an equal bad turn | invisible to a normal observer | `REACH_NOTCH_SOURCES.fate implemented:false` (bands.js:23, shown) |
| Act first or interrupt | support `condition` writing `ready` | tempo `ready` offsets (tempo_fight.js:321) | spirituality | freeze after the warning (G9, ~20 s) | an observer sees the reaction, not the cause | mechanism exists, no row |
| Change the situation | physical `condition` on place | frame `situation` | per act | the same fog hides you too | visible as an effect | proposal |
| Impose a condition | physical or support `condition`, `body` | simulation `condition` effect, harm_state | per act | backlash (harm_engine) | follows the condition's own visibility | rows exist (stamina, residue) |
| Alter stock | `resource` effect beside an allowed effect | `ready_stock` effects | per act | none by default | seen if the stock is visible | data if paired (see note) |
| Change an event | none yet | event director (FD16, unbuilt) | high | consequence chain | omens only | **no owner** |
| Bend time or save | physical `relocate` or the cheat domain | ABR16 cheats | charges | the term of the cheat | quiet by AD26 | proposal |

Note on stock: `compileStructuredAbilities` requires at least one effect in the function's allowed set and tolerates extras (structured_ability_runtime.js:140; charges already ride as `resource` effects, :85-90, shown). A stock-altering power is therefore data when it also carries an allowed effect such as `item` or `condition`, and a function-set change when it is stock only. New channel rows need no new code only when they land on a seam that exists. "Change an event" and rewinds do not; say so rather than imply they are data (ABR22 proof scales with the change).

Observer rules and NPC parity (ABR19, ABR21). Hostile Beyonders already run the same compiled rows as the player (book_world_lotm_abilities.js:1-4, :73, shown). The fight record writes `say()` text into a saved log (tempo_fight.js:74); a concealed ability must log neutral text unless the observer could see its `look` (inferred leak, see N3). Stock, bands and moves need one builder `fighterFrom(holder)` so a player and an NPC are built the same way; today only the LOTM hostiles are.

## 7. Aftermath

| Consequence | Owner | State |
|---|---|---|
| Wounds | `harm_state` via `tempo_location.injuryFor` | wired (shown) |
| Typed outcome and cause | `defeat_domain` publisher, one call (CBR2) | wired; cause list mismatch (RC3) |
| Reputation in public fights | `witnessEffect` writes respect (tempo_fight.js:72; `witnessPerStrike` off, :27) | wired |
| Law | `jurisdiction_rules.js` is the one owner of act-in-place rulings; `law_case.js` has 0 importers (shown) | do not depend on `law_case` for the first fight |
| Stock | settle writes rounds back; looted rounds move by custody | proposal |
| Objective result | `purseEffect` pay, FD15 position terms | proposal |
| Alert and inquiry | `noise` fact read by institutions and the event director | proposal |
| Learned facts | CBR15 both sides learn; survivors tell | partly (witness memory) |

## 8. Save impact

Additive only. Stock: actor resource keys exist; new kinds append; NPC stock uses the same key shape. Battle record: optional fields in schema 7 (`resolver`, `situation`, `objective`, `terms`, `stock`, `stakes`); old saves load because absent equals default. Move ids: widen the allowed set with `shoot`, `reload`, `ability`; leave the default set as is so existing fights stay byte-identical. No new schema, no new slice. Persistence checks are the existing ones: fixture save from before the change loads, a fight with each new field saves, reloads and imports (AGENTS verification rule), and the stock assertion extends to NPC holders. A world that reads fields the old tempo ignores must carry a migration note (AGENTS safety).

## 9. More to consider, round 1

### ACT NOW (done by this doc)

- A1. Classified 20 overlaps and one non-disagreement (RC1-RC21); found that FD17 is an extension of `conflict_frame` and tempo, not a new frame (RC1-RC2).
- A2. Wrote seven backwards outcomes with state, owner and smallest gap (OC1-OC7).
- A3. Specified frame fields, resolver plug points, grain rule, stock kind row, channel table, aftermath and save impact.
- A4. Listed proposed root-doc corrections (RC1, RC2, RC7, RC10, RC12). Not applied.

### ACCOUNT FOR NOW (design must hold these before any build)

| Code | Item | Effort | Done check |
|---|---|---|---|
| N1 | Split tempo's allowed move set from its default set, add `shoot`, `reload`, `ability` per fighter, no new schema; confirm unknown optional keys pass the validator | S | A pre-change saved fight loads with its old moves unchanged; a fight using each new move round-trips save, reload, Export, Import |
| N2 | `resolveShot` and `contest` take a keyed rng, never a bare `Math.random`-style source | S | Same fight and seed give the same shots on replay; focused test |
| N3 | Concealed abilities log neutral text for observers who cannot see the `look` | S | Hostile hidden ability produces no revealing line in the saved log or card |
| N4 | Stage stock spend in the detached plan with the roll, as L2b staged health | M | Rejected write leaves rounds unchanged; mid-fight reload keeps loaded count |
| N5 | Align `DEATH_CAUSES` with `HARM_DEATH_CAUSES` (`loss_of_control`) | S | One test per cause through the publisher |
| N6 | Fog reaches the fight as a visibility modifier, not only `dark` | S | A foggy and a clear Tingen night give different odds words for the same shot |
| N7 | NPC stock holders: `holder` on the stock spec and the assertion | M | A hostile with three rounds spends them; assertion covers both holders |
| N8 | Keep law out of the first fight's critical path | S | Fight ships with witness memory only; law is a later reader |
| N9 | Quote equals settle: a quote shows odds, never the outcome of the keyed draws | S | Two quotes of one fight differ in no draw |

### LATER / DELEGATE (reopen triggers stated)

| Code | Idea | Level, effort | Done check and trigger |
|---|---|---|---|
| L1 | Notch bridge: `fightWindow` to tempo fighter behind one flag (LCD6) | Sonnet, M | Klein's ambush runs on bands; reopen when AT15 is selected |
| L2 | Range bands and fog as frame situation, with a ring marker in COMBAT.md | Sonnet, M | Close and far differ in moves and odds in a browser run |
| L3 | Objective kinds `carry` and `protect` on tempo | Sonnet, M | An escort fight ends delivered, lost or stolen with its own report line |
| L4 | `terms` and breach (CBD12-CBD14) | Sonnet, M | A spar turned real changes the next meeting |
| L5 | Age-band ammunition decay | Sonnet, S | Fresh silver rounds become stale on a dated rule; saves keep counts |
| L6 | Armory issue and return ledger (institution_store plus owed ledger) | Sonnet, M | Unspent rounds are accounted for; reopen with AT10 |
| L7 | HP troll as an authored ordered encounter, words-only presentation | Sonnet, M | Troll scene runs with two spells, no hit points shown |
| L8 | Event channel after FD16 exists | Opus or Sonnet, L | An omen row changes a director draw |
| L9 | Grain selector: one function choosing skip, summary or turn from stakes | Sonnet, S | Three fixtures choose three grains; CBR27 stop rules respected |

### New angles (not in the palettes read)

- N10. **Presentation is a dial, not a resolver.** "No damage numbers" (troll) and "three rounds left" (Klein) are the same frame with different `presentation`. Stops numbers-hiding from becoming a fifth engine (AD46).
- N11. **Keyed draws make foresight honest.** A power that foresees an attack can read the next keyed draw's result; a rewind with unchanged choices replays the same fight, and changed choices change only later draws. Fits ABR16 loops and G9 foresight (inferred, shown draw construction tempo_fight.js:56).
- N12. **Rounds are evidence.** The kind fired and where becomes a fact an investigator reads (type of round, count, range). Fits Klein's detective work (inferred; ties to `people_knowledge`).
- N13. **Preparation is the pre-fight stage.** Loading three, coating, arming a charm and setting an ambush happen before `beginTempoFight` and arrive as stock, ability state and `surprised`; LCT10 says preparation is worth about a tier (stated).
- N14. **Handing off stock mid-fight.** Passing a loaded revolver to an ally or looting a fallen man's rounds is a custody move with the stock view's loan record (O4, stated), so allies spend their own rounds (K10.10, stated).
- N15. **Misfire is the stock-condition meeting point.** Damp, gear wear and hurry feed the existing mishap chance, so ranged and melee share one failure mechanism.
- N16. **Encounter facts feed the event director.** The frame emits `encounter.resolved` facts (who, where, how loud) that FD16 weights read, so a street fight makes next week's gossip without a separate system.

## 10. Evidence limits

Read: the root doc, SYSTEMS_REGISTER row, DOMAIN_RULES combat rows (CBR1-CBR30), combat palette rounds 1-4 and reconciliations, ENCOUNTERS_AND_PURSUIT, AFFLICTIONS palette (AFW1-AFW36), ABILITY_RULES (ABR1-ABR22, AB rows by grep), LOTM combat deep dive sections 1-8, MECHANISM_BACKLOG rows B8, B10, B11, G9, G14, G17, B8 and L2b receipts, and the listed `src/` files (headers, exports, selected lines, importer greps). Read by targeted section only: EQUIPMENT_STAT_DIMENSIONS (quality scout), ABILITY_AUTHORING (causal contract), the implementation map (C3, C10 headers and members), HIGH_TIER_POWER (kit table). Not read in full: `feature_expansion_battle.js` body, `tempo_fight.js` body beyond the cited lines. Not run: any test, build or browser. Importer counts come from grep of `src/` at the current working tree, which has uncommitted changes in other files.
