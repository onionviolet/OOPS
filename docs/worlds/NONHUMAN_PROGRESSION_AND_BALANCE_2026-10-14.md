# Nonhuman progression and balance, 2026-10-14

Status: **INFERRED proposals**, PROGRESSION AND BALANCE lane. Nothing here is an accepted decision, implementation, numerical balance approval or browser result. Source reads establish definitions only. This lane owns this document and its [checkpoint](../gm/dispatch/nonhuman-starts-2026-10-14/progression/CHECKPOINT.md).

**STATED (Weibao through PROJECT and USER_VISION):** useful meals, comfortable ordinary unfed play, no hunger death, eligible passive progression without compulsory clicks; laptop/desktop first, mobile deferred; first playable milestone remains one realm and one prestige layer. This proposal does not resume paused campaigns or make the full body catalogue a release gate.

Authority and joins: [requirements](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md) E9/E12-E14, M1/M9 and all N1-N23; [ENGINE_SPEC](NONHUMAN_STARTS_ENGINE_SPEC_2026-10-14.md) Q2/T8/T9 owns engine contracts; [PLAY](NONHUMAN_STARTS_PLAY_2026-10-14.md) owns BK1-BK15, NP/NT play contracts; [BY_WORLD](NONHUMAN_STARTS_BY_WORLD_2026-10-14.md) owns W/NC/NX source distinctions; [protagonist mechanics](NONHUMAN_PROTAGONIST_MECHANICS_2026-10-14.md) owns TM1-TM7 and NM1-NM12. This document adds progression joins, not another body catalogue, transition engine or canon audit. [Progression/assembly](PROGRESSION_AND_ASSEMBLY.md) keeps mastery, structural tier, quality, condition, source/body, rank and research separate; [skill means](SKILL_MECHANISMS_AND_MEANS_2026-10-13.md) M1-M6 keeps knowledge, execution, support and learning separate.

Sibling reconciliation at closure: [TRANSFORMATION](NONHUMAN_TRANSFORMATION_AND_BODY_CHANGE_2026-10-14.md) TF1-TF12/TX6/TX8-TX10/TX13 owns body/configuration, return and carrier distinctions; this lane adds no second transition record. [SENSES_SCALE_AND_UI](NONHUMAN_SENSES_SCALE_AND_UI_2026-10-14.md) SU1-SU5/SU8/SU10/SU15-SU17 owns qualified sensory evidence, scale, acting seat and presentation. [Paradise beings](paradise-hub/BEINGS_PETS_AND_BODIES_2026-10-14.md) BC1-BC11/BR1-BR6/BI1-BI8/BS1-BS5/PL1-PL5/PB1-PB5 owns its source-qualified bodies and proposed starts. Their research/proposal status is retained, with no canon qualification upgraded here.

Evidence: **SHOWN** = inspected source; **STATED** = named direction or sibling claim, retaining its evidence limits; **INFERRED** = analysis/proposal; **UNKNOWN** = unresolved. All tables and examples after the source ledger are INFERRED unless a cell explicitly says otherwise. No new franchise claim, raw novel quotation or sealed-file read is used. Default + Dial + Reasonably per world applies throughout: defaults propose useful starting behavior; dials retain stronger, quieter, stranger and source-specific alternatives; local means explain actual differences.

## 1. Source-grounded constraints

| Code | SHOWN from this lane's own reads | Progression implication, INFERRED |
|---|---|---|
| PS1 | `src/data/skills.js:28` through `:2930` defines 64 native skill IDs; the complete matrix below cites each definition. `src/models/skill.js:100-105` delegates eligibility and reads default XP from the native character; `src/components/levelable_component.js:100-107` stores skill progress on the levelable owner. | A shared catalogue is not one shared XP balance. Preserve per-person records; add body/source applicability rather than awarding every controlled body the catalogue's bonuses. |
| PS2 | `src/models/person.js:316-328` selects Unarmed whenever there is no equipped weapon; `:340-360` applies Iron skin, Running, Weightlifting, Climbing, Breathing, Equilibrium, Swimming and Shield bonuses through native stat projection. | A blade, spirit or plant cannot inherit fists and oxygen multipliers merely from the empty weapon slot. Gate ordinary and milestone bonuses by the actual trained mechanism. |
| PS3 | `src/models/stat_haver.js:7-40` supplies health 60, stamina 40, strength 12, agility 8, dexterity/intuition 10, magic/mana 0 and unarmed power 1 defaults. Health/strength-like numeric keys need not imply human anatomy; truthy fallbacks cannot represent health 0 or unarmed power 0 faithfully. `src/config.js:37-38` disables race/height bonuses. | Templates need explicit pools, attacks and absent-function handling; this is not authorization to turn on cosmetic race bonuses. |
| PS4 | `src/models/skill.js:22-30,84,175-194` has varying caps/XP curves and rounds gains to hundredths. `src/components/levelable_component.js:126-154` multiplies XP, caps a single ordinary gain and forwards bounded child XP to its parent. `src/config.js:25-30` exposes global and crafting caps. | Compare time to useful function and output, not equal skill levels. Aggregate away-time needs semantic batch rules; one giant capped gain and many tiny gains need not agree. Fractional adaptation needs retained remainder if below native rounding precision. |
| PS5 | `src/main.js:3778-3786` checks eligibility then applies life, furniture and pacing factors before native XP. `src/life_experience.js:8-10` uses calendar-based stages, with youth below 25 and youth learning multiplier 1.2; `src/chronicle.js:80` starts at age 18/lifespan 80. | Human youth is not a universal hatchling/seedling learning bonus. A possessed young shell does not make its adult knower young. Do not stack a new growth modifier over these by accident. |
| PS6 | `src/activities.js:84-149` binds fieldwork to Farming, patrol to Spatial awareness and exercises to named skills. `src/data/locations.js:1930-1983` defines Village work periods, access/hours/seasons and nominal skill XP per tick; `src/main.js:4864-4874` sends activity XP to the native character. | A replacement method needs an actual consumer and recipient. Hound escort is proposed new work, not free access to every human payday. |
| PS7 | `src/data/locations.js:378-393` has Village NPCs and tier-one craft facilities; `:396-409` has initially locked Shack housing with Sleeping XP; `:1985-2008` has tool-required log/sap and sand gathering. | Reuse craftsman/guard and facilities, while keeping tools, unlocks and inputs real. Producing one's own sap is different from woodcutting and pays for its own tissue/support. |
| PS8 | `src/config.js:19-23` defines tickrate and sixfold sleeping time; `src/main.js:7150` chooses normal/sleep minutes, `:7226-7228` schedules update. `src/backlog_expansion_time.js:243-254` reserves three logs/coins for a finite packing window; `:80-86` checks wall timestamps; `:347-350` explicitly reports reviewed rather than automatic output. | Ordinary idle ticking, accelerated rest and reviewed elapsed settlement are different seams. The packing source is not general offline body XP. Its frozen tiny proof values are not recommended balance numbers. |
| PS9 | `src/power_models.js:3-43` calculates practice/design/investment/authority/hybrid scope and cost, explicitly without fictional rank conversion; jurisdiction can constrain authority. | No universal cross-world power scalar is established by this file. Local action output, source compatibility and access should remain separate. |
| PS10 | `src/heir_inheritance.js:32-64,79-93` derives estate goods/money/standing and preserves the pristine recipient's own skills/XP; `src/life_experience_host.js:17-21` replaces the fresh expansion with a new one. | Nonhuman succession must preserve a selected recipient body deliberately. Goods inheritance, taught knowledge, continuing mind and body practice are distinct carriers. |

## 2. Every existing native skill across BK1-BK15

### Knowledge versus execution, resolving Q2 as a proposal

**Default:** a continuing knower retains earned knowledge; motor practice remains associated with the actual body or compatible anatomy family; physiological adaptation remains with its actual body/source. An abstract UI controller is not automatically the knower. A new heir has their own knowledge unless taught, recorded or transferred by an explicit mechanism. **Dial:** intact expertise, partial memory, perfect remapping, inherited instinct, source-carried mastery or no prior memory. **Reasonably:** a capability that genuinely grants perfect control works immediately; absence of an adapter is not grounds for deleting earned XP.

For mixed skills, distinguish understanding from execution only where a consumer needs it. Do not double the full legacy XP into two independently spendable tracks. Preserve the old amount with provenance/legacy status; assign its known effects through a selected migration or keep incompatible effects dormant. New practice events credit named recipients/components once. A theory lesson can improve understanding; it does not silently toughen a new shell or teach a host's muscles.

Matrix body columns use PLAY's exact kinds: BK1 beast; BK2 evolving monster; BK3 plant/rooted spirit; BK4 ghost; BK5 possessor; BK6 sentient object/weapon; BK7 place/core; BK8 construct; BK9 collective; BK10 familiar; BK11 advisor/AI/patron; BK12 infant/child; BK13 undead; BK14 shapeshifter; BK15 small creature.

Carry column: **K** learned knowledge on knower; **B** motor/sensory practice on body; **P** physiological adaptation on body/source; **K+B** mixed; **K+P** understanding plus bodily effect. This classification is proposed, not current save fields. A B/P skill can have remembered training instructions without retaining its old physical bonus.

Execution cells: **D** ordinary method can apply after actual fit/faculty check; **M** mapped body method, with its own practice and declared effects; **R** replace bodily execution with another named method, retain old record dormant; **H** host/holder/worker performs it and owns bodily practice, while the player may learn theory/coordination; **C** conditional on actual senses, source, anatomy, stage or selected variant; **V** use the occupied/member/current form's policy. D is applicability, not free starting mastery. R does not mean every replacement is already implemented. K always requires actual learning or declared memory, never automatic knowledge because a body is sentient.

In every cell, a source-supplied exception can enable the exact original method. Familiar is a relationship over anatomy, not a universal winged species; undead and monster are not one anatomy; BK12 stage varies; BK9 has member and collective recipients. C/V explicitly preserve these differences.

| Native skill and SHOWN definition in `src/data/skills.js` | Carry | BK1 | BK2 | BK3 | BK4 | BK5 | BK6 | BK7 | BK8 | BK9 | BK10 | BK11 | BK12 | BK13 | BK14 | BK15 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Combat (`src/data/skills.js:28`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Pest killer (`src/data/skills.js:38`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Giant slayer (`src/data/skills.js:106`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Evasion (`src/data/skills.js:122`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Shield blocking (`src/data/skills.js:191`) | K+B | C | C | R | R | V | H | H | C | V | V | H | C | C | V | C |
| Unarmed (`src/data/skills.js:270`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Stance mastery (`src/data/skills.js:349`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Quick steps (`src/data/skills.js:359`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Heavy strike (`src/data/skills.js:370`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Wide swing (`src/data/skills.js:381`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Defensive measures (`src/data/skills.js:393`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Berserker's stride (`src/data/skills.js:404`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Flowing water (`src/data/skills.js:415`) | K+B | M | M | C | C | V | H | H | D | V | V | H | C | C | V | M |
| Spatial awareness (`src/data/skills.js:431`) | K+B | M | M | C | C | V | C | C | C | V | V | C | C | C | V | M |
| Tight maneuvers (`src/data/skills.js:489`) | K+B | M | M | C | C | V | C | C | C | V | V | C | C | C | V | M |
| Night vision (`src/data/skills.js:538`) | K+B | M | M | C | C | V | C | C | C | V | V | C | C | C | V | M |
| Presence sensing (`src/data/skills.js:597`) | K+B | M | M | C | C | V | C | C | C | V | V | C | C | C | V | M |
| Strength of mind (`src/data/skills.js:693`) | K | D | D | C | D | D | C | C | C | V | C | D | C | C | V | C |
| Scrambling (`src/data/skills.js:781`) | B | M | M | R | R | V | R | R | C | V | V | H | C | C | V | M |
| Heat resistance (`src/data/skills.js:889`) | P | C | C | C | C | V | C | C | C | V | V | R | C | C | V | C |
| Cold resistance (`src/data/skills.js:896`) | P | C | C | C | C | V | C | C | C | V | V | R | C | C | V | C |
| Dazzle resistance (`src/data/skills.js:908`) | P | C | C | C | C | V | C | C | C | V | V | R | C | C | V | C |
| Weapon mastery (`src/data/skills.js:923`) | K+B | C | C | R | R | V | H | H | C | V | V | H | C | C | V | C |
| Swords (`src/data/skills.js:931`) | K+B | C | C | R | R | V | H | H | C | V | V | H | C | C | V | C |
| Axes (`src/data/skills.js:977`) | K+B | C | C | R | R | V | H | H | C | V | V | H | C | C | V | C |
| Spears (`src/data/skills.js:1022`) | K+B | C | C | R | R | V | H | H | C | V | V | H | C | C | V | C |
| Hammers (`src/data/skills.js:1068`) | K+B | C | C | R | R | V | H | H | C | V | V | H | C | C | V | C |
| Daggers (`src/data/skills.js:1114`) | K+B | C | C | R | R | V | H | H | C | V | V | H | C | C | V | C |
| Wands (`src/data/skills.js:1160`) | K+B | C | C | R | R | V | H | H | C | V | V | H | C | C | V | C |
| Staffs (`src/data/skills.js:1170`) | K+B | C | C | R | R | V | H | H | C | V | V | H | C | C | V | C |
| Farming (`src/data/skills.js:1183`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Sleeping (`src/data/skills.js:1269`) | P | D | C | M | R | V | R | R | M | V | V | R | D | C | V | D |
| Meditation (`src/data/skills.js:1354`) | K | D | D | C | D | D | C | C | C | V | C | D | C | C | V | C |
| Running (`src/data/skills.js:1464`) | B | M | M | R | R | V | R | R | C | V | V | H | C | C | V | M |
| Weightlifting (`src/data/skills.js:1575`) | B | M | M | R | R | V | R | R | C | V | V | H | C | C | V | M |
| Swimming (`src/data/skills.js:1675`) | B | M | M | R | R | V | R | R | C | V | V | H | C | C | V | M |
| Equilibrium (`src/data/skills.js:1774`) | B | M | M | R | R | V | R | R | C | V | V | H | C | C | V | M |
| Climbing (`src/data/skills.js:1849`) | B | M | M | R | R | V | R | R | C | V | V | H | C | C | V | M |
| Gathering mastery (`src/data/skills.js:1942`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Woodcutting (`src/data/skills.js:1955`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Mining (`src/data/skills.js:1965`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Digging (`src/data/skills.js:1975`) | K+B | M | M | M | R | V | H | H | C | V | V | H | C | C | V | M |
| Herbalism (`src/data/skills.js:1985`) | K+B | M | C | M | C | V | H | H | C | V | V | H | C | C | V | M |
| Animal handling (`src/data/skills.js:1995`) | K+B | M | C | C | C | V | H | H | C | V | V | H | C | C | V | M |
| Fishing (`src/data/skills.js:2005`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Crafting mastery (`src/data/skills.js:2101`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Crafting (`src/data/skills.js:2155`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Smelting (`src/data/skills.js:2167`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Forging (`src/data/skills.js:2180`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Cooking (`src/data/skills.js:2200`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Alchemy (`src/data/skills.js:2208`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Butchering (`src/data/skills.js:2216`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Woodworking (`src/data/skills.js:2243`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Iron skin (`src/data/skills.js:2257`) | P | C | C | C | C | V | C | C | C | V | V | R | C | C | V | C |
| Fortitude (`src/data/skills.js:2319`) | P | C | C | C | C | V | C | C | C | V | V | R | C | C | V | C |
| Persistence (`src/data/skills.js:2382`) | K+P | C | C | C | C | V | C | C | C | V | V | C | C | C | V | C |
| Perception (`src/data/skills.js:2470`) | K+B | M | M | C | C | V | C | C | C | V | V | C | C | C | V | M |
| Literacy (`src/data/skills.js:2539`) | K | C | C | C | C | C | C | C | C | V | C | C | C | C | V | C |
| Medicine (`src/data/skills.js:2571`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |
| Poison resistance (`src/data/skills.js:2583`) | P | C | C | C | C | V | C | C | C | V | V | R | C | C | V | C |
| Gluttony (`src/data/skills.js:2661`) | P | C | C | C | C | V | C | C | C | V | V | R | C | C | V | C |
| Breathing (`src/data/skills.js:2739`) | P | D | C | C | R | V | R | R | C | V | V | R | D | C | V | D |
| Regeneration (`src/data/skills.js:2845`) | P | C | C | C | C | V | C | C | C | V | V | R | C | C | V | C |
| Haggling (`src/data/skills.js:2930`) | K+B | C | C | C | C | V | H | H | C | V | V | H | C | C | V | C |

### What the mappings mean in play

| Code | INFERRED consumer rule, including individual skill distinctions |
|---|---|
| PM1 | **Combat / Pest killer / Giant slayer:** retain tactics and target-reading; train the current attack/avoidance executor. Small/large target context should be relative to the attacker and reachable target geometry, joining N2 and the senses lane, rather than treating a rat fighting a human as human-versus-small. Do not grant bonus XP for belonging to the enemy's species. |
| PM2 | **Evasion / Shield blocking / Unarmed:** avoidance needs a movement, phasing or independently sourced defensive method. Shield blocking needs an actual shield and support/control, not merely a hard shell. Bite, claw, engulfing and spectral contact need natural-attack consumers with appropriate base output; do not apply the native Unarmed curve wholesale. SHOWN: Unarmed's coefficient is 64 at `src/data/skills.js:279`, while sword coefficient is 8 at `:974`; their bases differ, so the ratio alone is not a damage comparison. |
| PM3 | **Stance mastery and all six stance children:** retained tactical understanding can aid learning, but Quick steps needs movement; Heavy strike needs a force channel; Wide swing needs supported area/reach; Defensive measures needs an actual defense; Berserker's stride and Flowing water need their authored consumers. No sixfold stance reward merely from one body change. A rooted strike/ward may replace a stance without copying its entire human stat package. |
| PM4 | **Weapon mastery and seven weapon children:** knowledge can advise; bodily technique belongs to the wielder. Being a sword does not grant Swords mastery. An animated blade with its own motion can train that motion. Wands/Staffs need the real casting source and interface, not just a grip or remembered spell. Parent familiarity may aid only eligible child learning; no dormant parent's bonus creates missing anatomy. |
| PM5 | **Spatial awareness / Tight maneuvers / Scrambling:** spatial reasoning can carry; calibration depends on current scale, reach, terrain and movement. Tree/core spatial practice covers its footprint, not free travel evasion. Rat scrambling uses paw/tail control; bird flight gets its own method. Widening a house does not award the inhabitants' physical agility. |
| PM6 | **Night vision / Presence sensing / Dazzle resistance / Perception:** train real signal discrimination. Night vision needs usable low-light vision, Presence sensing its own channel, Dazzle resistance the affected sensor; echolocation is a different method. Perception's retained inference can aid new sensory training but is not omniscience or automatic universal critical chance. A private archive without sensory input cannot farm observation XP. N1 and the senses lane own rendering. |
| PM7 | **Heat / Cold / Poison resistance / Iron skin / Fortitude:** read actual tissue/material/source response. Bark conditioning, corrosion handling, frame stress and spirit coherence are possible replacements, not the same bonus with a new name. An innate immunity should work without injury grinding; no exposure XP to an unaffected mechanism by default. Fortitude modifies the relevant integrity/health pool only when that learned adaptation actually develops it. |
| PM8 | **Farming / Woodcutting / Mining / Digging / Herbalism / Animal handling / Fishing:** separate identifying/selecting/timing from execution. Roots can tend soil or steer growth; paws can dig; slime dissolution can process a tested mineral. None silently satisfies a pickaxe, shovel, axe or fishing-tool requirement. Being a plant supplies no botany textbook; being a beast supplies no command over other animals. Gathering mastery can retain general understanding without duplicating every branch's XP. |
| PM9 | **Crafting mastery / Crafting / Smelting / Forging / Cooking / Alchemy / Butchering / Woodworking / Medicine:** recipes, process understanding and material diagnosis can carry; manipulation, heat, precision and facility access remain actual means. Sap production is not Cooking; self-metal resonance is not Forging; repair service delivered by the craftsman trains the craftsman. A body with sourced self-building can train its own method. Medicine knowledge is anatomy-scoped; donor physiology does not make a potion valid for metal/ghosts. Butchering's native beast-drop effect (`src/data/skills.js:2228-2230`) needs its actual output recipient and suitable processing, not free loot because the player is a beast. |
| PM10 | **Running / Weightlifting / Swimming / Equilibrium / Climbing:** hound gait, bracing load, paddling, tail balance and climbing can use mapped practice. Gel propulsion, root steering, room control, flight and haunting are replacements. A better actuator raises load capacity, while calibration improves control. Human Running's stamina efficiency is not a discount on every spirit spell. |
| PM11 | **Sleeping / Meditation / Persistence / Gluttony / Breathing / Regeneration:** sleep requires actual sleep; dormancy/recharge/stillness have local consumers. Meditation can develop a supported mind without lungs. Persistence's remembered resolve is separate from its low-stamina physiological effect. Gluttony improves compatible meal benefits, not arbitrary loot absorption or free supply; Breathing requires oxygen physiology unless a different sourced method is selected. Repair/regrowth/reassembly can replace Regeneration where they train, while automatic immunity/repair effects need not level at all. No damage-rest loop is assumed necessary for growth. |
| PM12 | **Literacy / Strength of mind / Haggling:** retain actual languages, scripts, reasoning, learned resistance and negotiation. Reading requires access to the signal/material, not necessarily eyes; a scribe's explanation can teach content without pretending the listener decoded the page. Haggling needs communication and the actual bargaining party; a partner's bargain is not the pet's motor/social execution by default. A mind's resistance does not shield every linked member unless its source says so. |

A new body can start with fully functioning innate movement or sensory control. Adaptation practice is a route for genuine uncertainty, not a compulsory clumsiness penalty. BK12 retains ordinary stages alongside the explicitly magical variant; chapter advancement can supply stage functions without granting adult expertise. BK14 preserves practiced form families and uses one active projection, not all forms' strongest bonuses at once unless an actual composite power supplies them. BK9 chooses shared mind versus independent people first, then allocates motor practice to members and coordination to its real practitioner.

## 3. Stat templates and world power scaling

**Default:** template describes available pools, force/movement/precision/sensing and attack/defense channels. Values below are qualitative relative to an ordinary local human doing the same task, not finalized numeric multipliers. Mental competence comes from the selected knower/history, not body size. **Dial:** juvenile/adult, mundane/awakened, weak/strong, damaged/pristine, source-specific innate mastery. **Reasonably:** change only fields with a causal consumer. A zero or absent bodily field cannot be passed through PS3's human fallback.

| Body | Proposed pool and stat template | Strong task envelope / actual limit | Growth that changes the envelope |
|---|---|---|---|
| BK1 beast | Health and exertion; grip absent for hound, gait agility and sensory discrimination emphasized; bite/paw attack, coat/body defense | Strong scent pursuit and mobile escort; fine workshop manipulation needs a different means | Gait/bite control, sensory resolution, harness support or an actual awakened faculty |
| BK2 evolving monster | Integrity/biomass and source reserve if relevant; pressure/shape control replaces human strength/dexterity consumers; no default fists | Gel gap entry and tested material processing; force and sample compatibility are local | New organ/shape changes capacity, control and material reach independently |
| BK3 plant/rooted spirit | Tissue integrity, growth capacity and optional sourced reserve; root force/precision and local reach; walking stats absent | Sustained local tending, shade/sap and root reach; cannot walk without a faculty/carrier | Bark, roots, shoots and communication channel; mobile reedling is a distinct supported variant |
| BK4 ghost | Presence/coherence and optional manifestation reserve; phase/reach/signal control, no material force by default | Supported immaterial passage/communication; no universal tangible crafting | Anchor reach and manifested control; stronger contact only when acquired |
| BK5 possessor | Spirit pools plus occupied body's own health/exertion; host/frame stats resolved separately | Uses actual vessel functions; control terms and parked-body location are real | Lease coordination and admitted vessels; motor practice and cracks stay with their executor/body |
| BK6 object/weapon | Item integrity and optional property reserve; edge/property output, resonance precision, holder-mediated reach | Strong own-property contribution; no walking, stamina or fists by assumption | Tempering/inscriptions expand source; edge control and wielder technique develop separately |
| BK7 place/core | Core/room integrity, project capacity, sourced reserve; fixture force, territorial reach/control and throughput | Several funded room functions can operate; physical footprint and workers/stock constrain real work | New room/channel/fixture, service competence or protected core; no free global attack radius |
| BK8 construct | Frame integrity, charge if needed, actuator load, joint speed/precision, sensors; attack channels from installed parts | Strong bracing/repeatable compatible work; source/material/interface limit particular modes | Structural refit, calibration and supply upgrade each change different dimensions |
| BK9 collective | Per-member pools/stats plus declared shared source; coordination/reach/throughput at actual shared controller | Parallel work at supported sites; member availability, supply and communication are actual means | Specialized member, nursery capacity, teaching and link range; no automatic founder stat multiplied by population |
| BK10 familiar/pet | Underlying species' template plus separately sourced bond channel | Species task and negotiated partner access; bond does not grant partner strength | Species growth, bond clarity, own technique and partner coordination are independent |
| BK11 advisor/AI/patron | No synthetic humanoid health/strength; source/anchor integrity or computation budget only when meaningful; information/channel/authority scope | Supported analysis/advice; no own Running/host muscles or omniscience | Archive, computation, teaching/control rights or manifested body with its own template |
| BK12 infant/child | Stage-fit biological pools/load/reach and supported senses/control; retained knower competence separate | Observation, signaling, learning and supervised tasks; real care/means govern execution | Maturation opens faculties; teaching trains their use; no universal learning-speed penalty |
| BK13 undead | Selected skeleton/corpse/spiritual template: structural or tissue integrity, animation source where present, actual joints/sensors | Skeleton may work without lungs/food; repair follows selected material/source | Joint control, replacement part and animating capacity; no assumed universal poison/cold immunity |
| BK14 shapeshifter | Active form template; declared shared/body-local pools and practice, one item set | Can select supported form for task; simultaneous composite faculties only if granted | Form repertoire, partial transformation/control, practiced anatomy families |
| BK15 small creature | Species pools and task-scale force/reach; fine route access and real rat/bird senses; no mandatory fragility scalar | Small gaps/perches; human-sized load/page/route needs actual support | Species control, tiny gear/nest, flight if bird, optional awakening |

Do not replace every health label with “integrity” while retaining human defeat logic. A sword's durability, ghost's presence and a person's life have different defeat meanings owned by E6 and the transformation lane. Equipment/condition/source/training projections should remain separate enough to explain a real capacity change; no universal minimum-of-all-stats formula is proposed.

**World scaling proposal:** assess effective output per task through the local body, operative source, applicable mastery, condition and relevant support. Rank/access is a separate admission/authority fact. Local structural stage opens an actual function, and mastery improves its control/precision/efficiency. Cross-world travel uses explicit source compatibility and destination facts; equalization is an optional authored rule, not “BK2 evolution 3 = cultivation realm 3 = class level 3.” PS9 does not implement such a converter.

| Context | STATED sibling distinction | INFERRED balance use |
|---|---|---|
| Village | PLAY BK1/BK3/BK15 and V1-V9 propose body-specific services using finite native facilities | Compare escort reliability, fitting retrieval, tending output and useful purchases. A hound can surpass a human nose without losing Literacy XP to compensate. Native rat enemies are not evidence for player-rat stats. |
| D&D, W02/DN-P1-P3 | BY_WORLD keeps edition/species, item persona and setting law separate | Species trait, class progression and blade properties remain separate local sources. No automatic class levels for each upgraded material. |
| Cultivation / book worlds, W03/W04/W16 | BY_WORLD preserves local species/era and source gaps; progression owner separates structural tier and rank | Organ/lineage changes may enable a cultivation method; cultivation strengthens its actual channels. Neither every spirit nor every plant gets a universal meridian model. |
| Tensura, TM1-TM7/NM1-NM4 | Mechanics lane distinguishes anatomy, absorption pipeline, paid naming, awakening and office | A new organ can be powerful without transferred technique; naming can affect body/link without creating obedience or universal equal-tier balance. No new source formula inferred here. |
| MOL, W05/ML-P1-P3 | BY_WORLD separates spider knowledge, remote proxy and soul-linked copies | Silk craft and telepathy can create economic strengths; casting restrictions use actual faculty, not “monster XP tax.” Shared reserves and trained technique have named owners. |
| LOTM/COI, W06; Shadow Slave, W07 | BY_WORLD separates source/sequence, cognition, rank/class and specific Echo/Shadow/avatar cases | Body stage, characteristic/source advancement and official clearance are separate. An animated replica does not gain endless progression merely by being controlled. |
| JJK/Bleach/Fate/FMA, W08-W12 | BY_WORLD keeps energy body, core, spirit bond, class container and armor/soul binding source-specific | Strong actual resistances remain effective; source exhaustion/anchor damage and local countermeasures are genuine mechanisms, not compulsory vulnerabilities assigned to all nonhumans. |
| Paradise, N16-N20 | STATED (Paradise sibling): BC4 separates instruction from a particular growth meal; BC6 separates material adaptation from a later body transition; BR1/BR2 distinguish body evidence from Contractor/worker status; PL1/PL5 are proposed vessel/carry rules. | Keep Contractor access, companion growth, source investment and temporary body power independent. BC3's fixed maximum loyalty is actor-specific, not a universal grindable bond stat. Alias uncertainty in BC5/BR3 does not grant dog flight. Exact rates/compatibility remain UNKNOWN; no borrowed-body level automatically becomes permanent Contractor stats. |

## 4. Evolution and growth beside cultivation, magic and classes

These are progression paths, not new mandatory prestige layers. Default: retain the current life/person through ordinary development and open one worthwhile new action. Dial: branching evolution, fixed species, high-capability starting body, body replacement or remain in the original form. Reasonably per world: use supported triggers with selected costs; gaining a function need not cost a universal currency or require killing.

| Body | INFERRED growth path, beside other disciplines | New usable consequence and compatible parallel route |
|---|---|---|
| BK1 | Young hound → practiced tracker → recognized guardian, or sourced awakened beast | Discriminate one more signal/coordinate escort; martial, magical or civic growth can coexist |
| BK2 | Gel → gripping or sensory organ → specialized processor/protector | New manipulation or tested material channel; cultivation/magic/class may train it if admitted; human mimicry stays optional |
| BK3 | Sapling → tended root network → grove or mobile avatar | Wider local service/communication; magic/cultivation can act through the plant's actual source |
| BK4 | Quiet presence → reliable signal → wider manifestation | Communication/reach rather than required flesh; study, ritual and sourced spirit cultivation can run beside it |
| BK5 | One vessel → coordinated control → admitted vessel repertoire | More supported embodiments or stable sharing; host's class/source stays theirs |
| BK6 | Speaking blade → tempered/inscribed blade → refined property or construct mounting | New own property/reach; wielder class and object refinement remain distinct |
| BK7 | One footprint → funded room/service → specialized sanctuary/workshop/dungeon | New room/service throughput; local magic or institution development contributes without converting rank into floor count |
| BK8 | Helper frame → calibrated/refitted frame → specialized chassis | Load, precision or sensing changes; learned crafts/magic and installed components coexist |
| BK9 | Small colony → specialized workers → supported network | Useful parallel assignments and coordination; member disciplines need real teaching/source access |
| BK10 | Pet/familiar → practiced specialist → independent or stronger bonded life | Own useful function and clearer channel; partner cultivation/class does not replace pet progression |
| BK11 | Narrow guide → accessible archive → stronger analysis/teaching or manifested seat | Better supported advice or operative grant; host practice and patron authority retain separate owners |
| BK12 | Infant → child → adolescent/adult, or selected awakened stage | Reach/speech/grip then supervised independence; retained memory is not a free mature stat template |
| BK13 | Scattered/repaired skeleton → practiced joint/body → improved source or restored flesh option | Repair/parts and technique progress beside study/class/source growth; remaining undead is viable |
| BK14 | Two known forms → reliable partial shift → expanded sourced repertoire | Choice of means improves; each actual form keeps relevant practice and source compatibility |
| BK15 | Nestling/juvenile → route-skilled adult → species specialty/awakening | New route, nest, flight or communication; no required size increase or human end form |

An evolution edge declares prerequisites, beneficiary, one actual gained/changed function, retained carriers, item/job settlement and known commitments. TM3/TM5 own naming/awakening evidence; NM1/NM2 own evolution/absorption patterns; PLAY NT1-NT10 and the transformation lane own transition mechanics. Research/digestion/growth can queue; selecting a consequential branch can wait at a decision boundary. Strong cheats can legitimately grant immediate organs or mastery when their mechanism says so. Do not force a study phase just to slow a superior power.

## 5. Idle and offline earnings: relative proposals

**STATED (PLAY and mechanics owners):** default ordinary browser-closed advancement is frozen; explicit bounded offline settlement is a proposed option. **SHOWN:** PS8 has a narrow reviewed elapsed packing implementation seam, not a general body engine. **UNKNOWN:** native execution, closed-browser growth, economy effects and final rates for these forms.

**Default rate policy, INFERRED:** once selected, supported idle work can develop without repeated input. A future opted-in offline routine should award the same eligible game-time result as its supported online routine, subject to real inputs, schedules, location and decision boundaries. No universal offline efficiency penalty. Dial: world/source-specific faster/slower processing or a disclosed alternative clock policy. Reasonably: use the same elapsed window once, preserve fractions, stop when support ends, and do not invent a fresh assignment, bond or body change while away.

Relative rate bands are comparisons, not numbers: **routine** = comparable progress to a supported local human practice/service of similar complexity; **slow positive** = sustained adaptation/growth below focused training, still worthwhile unattended; **specialized faster** = a real bodily advantage in one task; **parallel** = actual separate workers/processes, with actual reservations and source throughput. One body can have different bands for different mechanisms; there is no body-wide XP multiplier.

| Body | What an eligible unattended order can earn | Proposed relative rate and output owner | Away-time stopping boundary |
|---|---|---|---|
| BK1 | Gait/scent discrimination, route familiarity; paid escort only through actual work terms | Routine practice, specialized faster scent tracking; hound owns practice, agreed purse owns payment | Unknown trail, unavailable partner, unsafe/unadmitted route |
| BK2 | Tested material processing, organ control, reserved evolution preparation | Specialized faster compatible processing; routine control; creature owns processed stock and its own practice | Sample/reserve ends, unknown material, consequential evolution choice |
| BK3 | Root/shoot growth, tended sap/fruit output, signals | Slow positive structural growth; specialized steady local production with actual habitat/support | Reach/stock/output capacity or known light/water condition ends; contested land waits |
| BK4 | Manifestation/signal control, anchor-supported watch observations | Routine control; actual observations only, no passive invented secrets | Reach/source expires, unselected encounter or anchor event |
| BK5 | Negotiated vessel coordination, occupied-body practice under selected access terms | Routine body practice to executor; guest coordination to actual knower, not two full identical grants | Control lease ends, host refusal, return/host switch, body support fails |
| BK6 | Resonance/property practice; actual cooperating wielder drill | Routine own practice; holder owns bodily drill XP; shared power gains only through NM6's explicit mechanism | Wielder unavailable, custody transfer, novel use or fracture |
| BK7 | Funded repair/build/service order; known room-control practice | Routine construction; parallel only distinct available room/worker channels | Stock/room capacity ends, unapproved visitor/lease, project completion choice |
| BK8 | Calibrated bench work, joint control, charging; repair performed by actual worker | Routine control, specialized faster actuator-supported repetitive load work; charging is resource recovery, not XP by itself | Charge/parts/bench ends, unsafe mode, structural refit choice |
| BK9 | Member gathering/production/practice plus coordination when actually exercised | Parallel throughput from real members; personal mastery not population-scaled by default | Nursery/site/input/channel cap, isolation under declared continuation, member decision |
| BK10 | Own signal/silk/flight practice; agreed accompaniment | Routine own practice, specialized faster species service; partner keeps their XP/money | Partner plan ends/changes, bond permission/reach expires |
| BK11 | Supported record study/analysis; agreed teaching or cue routine | Routine known analysis; parallel computation only if granted; host bodily learning remains host's | Information/source/authority absent, uncertain result requiring choice, host refusal |
| BK12 | Supported language/signals/attention, supervised motor practice, rest | Routine suitable learning, slow positive supported maturation; no adult life multiplier by shell age | Caregiver capacity ends or chapter/major stage boundary; no unselected years skipped |
| BK13 | Joint calibration, agreed work or supported reassembly preparation | Routine control/work; specialized continuity without biological sleep only if source supports it | Actual part/source supply ends, new repair/reforge choice |
| BK14 | Practice/work in pinned form; supported shift rehearsal | Current-form rate with one eligible owner; no bonus merely from form switching | Gear/method incompatibility, materially different identity/form choice |
| BK15 | Safe tiny retrieval, nest work, rat/bird control practice | Specialized faster narrow access; routine own practice, task-scale outputs | New room/predator, route/stock ends, unsupported flight/carrying |

Rates should be compared by time to the next useful capability, earned service value, output quality, preparation/support cost and scope of safe unattended work. Equal XP is neither necessary nor sufficient: PS4's curves differ. A tiny retrieval can be economically worthwhile even if it cannot match logs per hour. A strong construct or brood may produce more than a lone novice; finite workshops/demand/supplies are meaningful existing constraints, not an invented debuff to erase the advantage. Do not cap legitimate power by naming every output a human-equivalent reward.

For passive Famine, STATED direction requires positive eligible underfed growth without active input, comfortable ordinary unfed play and no hunger death. INFERRED rate candidate is slow positive under its real physiological condition; it applies only where that condition exists. A no-intake blade need not earn Famine XP or suffer a substitute “fuel hunger.” N3 self-material production pays for actual replenishment/stock once; no endless shed-horn cloning. N9 habitat affects relevant jobs, not universal mastery decay.

PS4/PS5 require a future parity comparison across elapsed segmentation, rounding, caps, milestone crossing, parent forwarding and rest-speed policy. Apply life/furniture/pacing factors once to their proper owners; do not convert rest speed into sixfold learning for a non-sleeping sword or multiply a single window by member count and shared XP again. These are unrun implementation questions, not new tests written here.

## 6. Fairness without a universal nonhuman penalty (M9)

**Default:** each admitted start has a useful routine, a meaningful choice, access to support/economy and an explained recovery/continuation route. This is a content support target, not equal force, lifespan, wealth or learning speed. **Dial:** strong starts, dependent starts, harsh local stakes, quiet life and deliberate AU coexistence. **Reasonably:** strength and weakness come from the chosen world/body/source/circumstance. No compulsory counterweight for every advantage.

| Code | Strength and limitation with an actual cause | Comparison that could matter later |
|---|---|---|
| PF1 | Village hound scent is superior for a trail; no fine grip on the selected hound. Rat gains a gap route; grain-bag lifting needs another means. Neither loses general XP as a balancing tax. | One scent/gap success and one known support option lead to useful payment/purchase; missing hands does not remove all agency. |
| PF2 | Rooted plant/core develops a local productive place; reaching another town needs a carrier/core transfer or locally supported mobile form. This fixed presence need not be weaker at local production. | Same earned output and root/room state persist after a paid project; no walking or free land export. |
| PF3 | Ghost/energy body's supported intangibility works against unsuitable physical attacks. Only a real local countermeasure/source rule can affect it. | One ineffectual ordinary contact and one relevant source interaction; no universal anti-ghost damage invented to preserve combat. |
| PF4 | BY_WORLD W05/NC14 supplies source-qualified aranea craft/information strengths; W05's reported local rights limits affect institutions, not intelligence or every merchant. | Craft livelihood and negotiated access can coexist with one specific refusal; AU rights reform remains explicit. |
| PF5 | BY_WORLD W02/W08-W12 separates item persona, curse/construct energy, class container and soul binding. These may support strong or bounded lives with specific supply/anchor/control rules. | Demonstrate the real immunity/limit rather than adding arbitrary sunlight, poison, obedience or fatigue rules across forms. |
| PF6 | Paradise N20 separates access tier from body strength. A powerful mission body can outperform the contractor's home body while borrowed terms limit what remains afterward. | Show current mission action capacity and retained contractor/pet/source gains separately; no assumed permanent stat copy. |
| PF7 | Large body can lift more and have greater reach; small body can enter more routes. Costs follow actual transport, diet, fitting and negotiated risk where relevant (N23), not a universal “nonhuman surcharge.” | A real quoted service explains size/cargo support; an affordable alternative remains where the world supplies one. |

Habitat or seasonal changes can change a relevant production rate and available route without erasing earned knowledge or silently killing an unfed body. Instinct N8 can suggest or reward a locally meaningful routine; forced behavior requires a selected premise. Recognition, ownership and institutional permission are not combat stats. A frightened guard does not make the player's body physically weaker. A superior faculty can remain superior, with wider challenges/options rather than a universal enemy auto-scaling treadmill.

## 7. Prestige, inheritance and succession

**Default:** evolution, refit, ordinary maturation and repair within the same continuing life are progression, not prestige. Ending/retiring a life can lead to one authored succession layer under the milestone; long-lived bodies can choose retirement/seat change without compulsory death. **Dial:** same continuing mind in a new shell, independent offspring/heir, apprentice, colony leadership, next holder or next caretaker. **Reasonably:** say who continues, what transfers, who owns it and which obligations remain. This extends PS10, ENGINE_SPEC T9 and PLAY NP14/NT8; it does not define a second reset currency.

| Bodies / successor option | Carried estate or source | Knowledge and motor boundary |
|---|---|---|
| BK1/BK15 offspring, adopted kin or trainee | Real cache, gear, shelter agreement and inherited traits if supported | Offspring have their own person/body; taught routes can carry through instruction, not automatic parent Running/scent XP |
| BK2 bud/new organism or same evolving nucleus | Reserved biomass/source and actual owned goods under an explicit split/transfer | Same mind continuation may retain knowledge; independent bud does not automatically get memories; remapped organ control is selected |
| BK3 seed, graft, grove successor or gardener | Actual seed/source, site rights and output stock; planted parent remains if alive | Seed can be new life or continuing mind only as declared; gardener inherits access/records, not root control |
| BK4 new anchor or successor spirit/keeper | Real anchor/source and recorded legacy | Moving same spirit preserves its declared learning; a new haunting is not the deceased person by assumption |
| BK5 new vessel or successor guest/host | Spirit and vessel assets remain separate, with leases/claims intact | New vessel for same guest is embodiment change; independent host retains their own practice and guest does not seize it |
| BK6 reforge same blade, new blade or next wielder | Unique object/source and actual parts; reforging consumes/returns declared material once | Same blade retains declared mind/property control; new wielder has their own muscles; destruction/new spirit continuity is explicitly unresolved until authored |
| BK7 core transfer, next steward/tenant or new living place | Real core, rooms/land rights, supplies and leases under actual jurisdiction | Same core versus new caretaker are different seats; visitors' XP is not the house's inheritance |
| BK8 repaired/reforged chassis or newly created construct | Existing modules/source transferred by instance; maker/custody claims remain visible | Same continuing mind may retain theory; new frame control remaps as declared. Maker's skill is not uploaded by default |
| BK9 surviving colony, new founder or independent offspring | One actual store, site rights and surviving member bodies/commitments | Shared mind continuation is source-specific; independent members retain their own XP; no founder death/replacement XP windfall |
| BK10 pet's offspring, new partner or continued familiar | Species assets and real bond/source terms; partner estate separate | Partner succession does not reset pet mastery or transfer contractor/human stats; new bond has its own observed history |
| BK11 new host, archive heir or continuing AI/patron | Actual archive, hardware/anchor/grants and valid terms | Host change is not automatic new guide life; copied archive supplies records, not host motor skills or guaranteed same consciousness |
| BK12 eventual kin/apprentice succession | Ordinary real estate/records after an actual life ending or retirement | Growing up stays one life; chapter preview does not invoke prestige or finish future quests |
| BK13 reassembly, new animating body or independent successor | Recovered parts/source and legitimate possessions | Reassembly may continue the same person; revived body, retained memories and new independent soul are separately declared |
| BK14 continued person in another form or independent heir | One goods set, inherited faculty if supported | Form switch is not prestige; independent heir gets selected lineage/teaching, not every parent's practiced form |

A proposal succession preview should show continuing/new person, body/source, accessible goods/home, known papers/taught lessons, local standing and outstanding commitments. PS10's current half-standing/kin-apprentice envelope is an existing narrow policy, not a universal rule for broods, heirloom minds or new shells. Next-body selection must survive `buildLifeHeirSave`'s expansion replacement and E14 migration; no grant replay on reload/import. Reforging should neither mint a duplicate body-item nor erase a retained mind merely because material changed. Source rules can legitimately end identity; do not promise restoration from an unrelated replica.

## 8. Additional considerations, PG1-PG15

| Code | Default + Dial + Reasonably per world | Join / why it changes balance |
|---|---|---|
| PG1 | Retain knowledge; classify bodily applicability per consumed method. Dial perfect transfer/instinct or partial memories. | E9/Q2, N7/N11, NT2: transformation is neither amnesia nor automatic mastery. |
| PG2 | Body/source owns adaptation; separate innate immunity from learned resistance. Dial soul-carried adaptation when supplied. | N9/M9, PM7/PM11: no compulsory harmful exposure grind. |
| PG3 | Structural growth opens a function; mastery/quality/condition/rank stay separate. Dial superior upgrades without forced sidegrades. | N19/N20, progression owner: body tier never substitutes for access tier. |
| PG4 | Declare XP beneficiaries at authoring/settlement. Dial explicit linked sharing. | N5/N6/N17/N21, NM6/NM11/NM12: holder, pet, host, member and controller do not receive duplicate full grants by focus switching. |
| PG5 | Compare useful output and time to an actionable milestone. Dial unequal strong/weak starts. | M1/M9/N2/N23: equal level labels cannot prove fair lives. |
| PG6 | Preserve eligible fractional passive progress and define batch semantics. Dial faster sourced processors. | PS4/PS8, skills M4: rates below rounding precision must not silently become zero. |
| PG7 | Separate idle, reviewed elapsed, rest acceleration and absent-world clocks. Dial opted-in bounded continuation. | N9/N18/N22: avoid two clocks paying the same interval or silently advancing a lease/life twice. |
| PG8 | Self-harvest produces one actual output with recovery/support. Dial genuinely renewable organs. | N3, NM10: harvesting does not generate a fresh organ and full sale stock while keeping all harvested capacity. |
| PG9 | Naming/bonding records payer and actual source result. Dial ordinary social naming, gifts or source-specific evolution. | N5/N12, TM3/NM4: social acceptance is not a free evolution/obedience event. |
| PG10 | Maturation uses body stage and actual knower life. Dial chapter advancement and innate control. | E12/N11, BK12: young shell does not reset adult learning age or award every adult skill. |
| PG11 | Borrowed body keeps source/body investment and lease terms visible. Dial purchased, temporary, rented or freely given body. | N4/N16/N18/N22: mission rewards, modifications and return costs have named owners, not a surprise forfeiture. |
| PG12 | Buds/offspring/new minds need actual care/teaching/source. Dial shared consciousness or memory grant. | N6/N14/N17, NP14: population growth can increase throughput without duplicating founder mastery or coin stores. |
| PG13 | Defeat, repair, evolution and prestige are different events. Dial restorative evolution or genuine severe loss. | N10/N15, TM5/NT6: no hidden heal farming or compulsory human endpoint. |
| PG14 | Bounties, law, prices and recognition use actual world/witness causes. Dial coexistence/AU or hostile institutions. | N13/N23/M9, NC7/NC8: exclusion is content, not a global XP/stat debuff. |
| PG15 | Show known next function, routine beneficiary/support and one cause of a pause at 1366×768 laptop. Dial expanded body/member breakdown. Mobile deferred. | N1/N2/N8/N21 and senses/UI owner: no secret truth exposed through a power rating or stage preview; N11/N23 knowledge and service-cost uncertainties stay visible to authors. |

## 9. At most five suggestions

These are ranked proposals for coordinator selection, not authorization to edit runtime code or an additional universal gate.

1. **PSG1: Use ENGINE_SPEC Q2/T8's first beast slice to prove one mapping.** Hound gait practice and retained Literacy knowledge show body practice versus reading access. Reuse Village's inspected facilities and PLAY BK1 promise; do not add all 64 new tracks first.
2. **PSG2: Compare one human and one beast service by useful outcome.** Record eligible time, actual support, output/payment and next purchase. A strong scent advantage should be visible, with no compensating general XP penalty. Exact numbers remain selectable after this comparison.
3. **PSG3: Select one evolution/refit with a changed job.** Show one new function, retained knowledge, body practice ownership and paused/continued paid work under the transition owner's carrier rules. NM1/NM2 already own the broader palette.
4. **PSG4: Reuse the bounded elapsed seam for one future supported routine.** Define segmentation/rounding/parent/milestone behavior and exact one-time settlement; compare eligible online versus reviewed elapsed results. Do not extrapolate prepaid packing's tiny proof constants to all bodies.
5. **PSG5: Prove one nonhuman successor body survives the heir builder.** Choose seed, offspring or retained blade mind according to the selected slice; preserve real estate/parts and distinguish new person from continuing source. One prestige layer suffices.

### Requirements joins, all rounds

This is a coverage map, not a second requirements owner: N1-N2 → PM5-PM6/PG5/PG15 and SU1-SU5; N3 → PG8/TX3; N4-N6 → PG4/PG11-PG12 and TF9-TF10; N7 → PM12/PG1; N8 → PG15 and the selected premise; N9 → rates/PG2/PG7; N10 → succession/PG13 and TF11-TF12; N11 → knowledge carry/PG1/PG10; N12 → PG9/TM3; N13 → PG14; N14 → BK10/BK15 and quiet-life fairness; N15 → growth/succession/PG13; N16-N20 → Paradise world scaling, borrowed-body rates, PL1-PL5 and PG3/PG11; N21 → PG4/PG15; N22 → PG7/PG11; N23 → PF7/PG5/PG14. Every mapping retains the named sibling's source limits and proposal status.

## Coverage and verification boundary

**SHOWN (document inventory):** 64 native skill rows × 15 body columns; 12 mapping clarifications; 15 stat templates; 15 growth paths; 15 idle/away palettes; 14 succession rows covering all 15 BK kinds; 15 PG considerations; five suggestions. All requirements N1-N23 were read and their relevant joins included; no new canon formulas or universal nonhuman penalty.

**UNKNOWN / open:** exact numerical templates/rates, local source compatibility, legacy XP split/migration, body/knower age policy, offline settlement parity, pet/contract growth formulas, identity through reforging, and all playable balance/acceptance. These need the selected world's/source's owners and a later bounded implementation. Future gameplay proof requires rebuild, a fresh desktop/laptop origin at the selected viewport, and applicable save/reload/export/literal import; no such evidence is claimed here.

Verification here is source-read and document coverage/link checking only. No tests, build, browser play, user save access, install, commit, push, publication, purchase or download. Only this output and its checkpoint were edited; unrelated dirty state remains.
