# Combat, shields and meter

2026-10-14. Steam build 20773316, executable SHA256 `b713e88e0034cb23562b7ffeba6febe5d6a679578215cb595e1644cfc56245a1`. Static analysis only. SHOWN is installed rows or decoded code; STATED is shipped text; INFERRED joins them. REA 6.4.0/Ghidra 12.1.4 supplied the first native batch; direct Ghidra supplied comparisons and follow-up after REA startup timeouts. See [NATIVE_CHAINS](NATIVE_CHAINS.md).

Full evidence: [private native notes/pseudocode](../private/native/deep/CHAIN_NOTES.md), [spell definitions](../private/tables/ship/SpellDefinition.json), [enemy defense](../private/tables/ship/EnemyDefenseParams.json), [decoded tags/input assets](../private/decoded/final/receipts.json), [player and selected modifiers](../private/decoded/more/receipts.json). Public discussion omits sealed progression details; S1 remains private.

## D4: the shield query uses gameplay tags

SHOWN: `SpellTool.BreaksShield` wrapper `0x1437fb4c0` calls `0x1432f1930`. The NPC route obtains an EnemyAIComponent and calls `0x142b91da0`, which resolves an effective defense type and invokes `0x142b91200`. That helper tests tag membership against both arrays of the incoming tag container. It does not look up SpellKnowledge.SpellCategory or compare a painted color in the selected predicate. This is a tag/state rule, not evidence for one integer color mask.

Fresh executable reflection records independently bind GameplayTagLibrary's A/B/C breaker fields at offsets 0x278/0x280/0x288 and its Control/HeavyDamage/Forceful fields at 0x2a0/0x2a8/0x2b0. The corresponding property-record addresses start at `0x147c53d70`. Current-build enum name/value pairs at `0x147beb700..0x147beb730` identify TypeA..TypeD as 1..4. These bindings were checked in this executable, not taken on trust from the older SDK.

SHOWN, selected ordinary per-type branches before the shared bypass checks:

| Effective type | Accepted breaker tags | Also accepts |
|---|---|---|
| None | Query returns true immediately | No category match required in this helper |
| TypeA | TypeA_Breaker, TypeB_Breaker, TypeC_Breaker | Combat.Attack.CharacterControl |
| TypeB | TypeB_Breaker, TypeC_Breaker | Combat.Attack.Forceful |
| TypeC | TypeC_Breaker | Combat.Attack.HeavyDamage |
| TypeD | TypeC_Breaker | Combat.Attack.HeavyDamage |

The full strings come from `Phoenix/Content/Data/DA_GameplayTagLibrary.uasset`. The helper has further special types and common bypasses; this table is not their complete policy. The outer predicate also has state-dependent exceptions. Special/hidden route details are not reproduced here.

STATED: tutorial IDs `TUT_Display_AccioBlue_desc`, `TUT_Display_YellowShieldsZZD_desc` and `Hint_BreakShields` present Force/violet, Control/yellow and color matching. INFERRED: the UI categories teach the ordinary tag counter relationships. Proving every spell/multi-impact producer sets the expected container is a separate wiring audit. The SpellDefinition.EnemyShieldBreaker=None rows do not contradict the separate category tags.

Important limit: BreaksShield is a Boolean query. This pass traced the predicate, not every caller that actually clears a shield, triggers a reaction or applies damage.

## D5: Stupefy and Hard

SHOWN: the shared bypass portion of `0x142b91200` tests `StupefySpecialPopupImpactTag` only when the current difficulty value is not 3. The current binary's enum pair for `EDifficulty::Hard` at `0x147dcf810` has value 3. Native difficulty helper `0x142c809e0` calls `0x1431ca230`; the freshly located GetCurrentGameDifficulty wrapper `0x1437b24d0` calls that same body. Reflection record `0x147c540e0` independently binds StupefySpecialPopupImpactTag to offset 0x2f8. The parsed library resolves it to `IA.ImpactType.StupefySpecialPopup`.

STATED: `LoadingScreen_Combat11` describes Stupefy's shield exception on Hard. The native result is narrower and useful: **this specific Stupefy bypass tag is difficulty-gated**. It does not establish that every function or projectile containing “Stupefy” loses every ordinary matching-tag or other bypass route on Hard. Other common bypass checks, including ProtegoIgnore, are separate.

Private: [full interface text](../private/text/MAIN-enUS.json), [native predicate and reflection receipts](../private/native/deep/CHAIN_NOTES.md).

## D6: damage inputs and the remaining formula boundary

SHOWN: CalculateCharacterDamage wrapper `0x1437fb5c0` reaches `0x1432f1a90`. It creates a damage-info record, gets an instigator/base amount through a spell-tool virtual call, attaches the tool's tags/data, attaches the target, marks calculation-only mode, dispatches through the target state object's virtual slot 0x2e8 and returns the computed character-damage field. It also compares the result against target health for its will-kill output. Helpers `0x143032550`, `0x14303e520` and `0x14303d730` confirm the separate base/instigator, tag/breaker and target/direction preparation stages.

This does **not** close the final formula. The decisive target-side virtual implementation and complete modifier ordering were not recovered. A plausible-looking multiplication of the following table values is not promoted to a verified equation.

| Candidate input | SHOWN source | Limit |
|---|---|---|
| Spell base | SpellDefinition.DamageCharacter, DamageObject; native damage-record preparation | Override, actor/tool level and spell-specific behavior can intervene. |
| Gear power | GearPowerLevels; GearPowerStats.DamageMultiplier, DamageReductionPercentage, CooldownReductionPercentage | The 500-row lookup is preserved; final player/target stacking and rounding remain OPEN. |
| Level/scaling | NPCLevelScaling and EnemyDefinition presets; GearPowerLevels.PlayerLevel | No universal “one level equals this much final damage” equation is claimed. |
| Difficulty | EnemyDifficultyScaling.DamageScale and EnemyVulnerableDamageMods | Their full order relative to target defense and talents remains OPEN. |
| Talents/traits | PerkDefinition.AbilityID; selected RPGAbility and GameplayPropertyModNumeric assets | Availability and final live stacking are not proved by asset presence. |

A concrete modifier example: `Gameplay/RPGSystems/Perks/Shadow/RPG_Mod_Perk_Shadow_StupefyDamage_1.uasset` declares FixedAmount 2, PreAdd, target `CharacterStateInfo.OutgoingDamageModifier`, with spell-name, unaware-target and character-target filters. This is an authored modifier operation, not a universal three-times-damage statement. Selected focus gear modifiers use FactorIncrease values 0.05/0.1/0.2 on Biped_Player.FocusModifier. Data can explain a conditional input without establishing its final equation or current player reachability.

Private: [power lookup](../private/tables/ship/GearPowerStats.json), [NPC scaling](../private/tables/ship/NPCLevelScaling.json), [vulnerability scales](../private/tables/ship/EnemyVulnerableDamageMods.json), [modifier exports](../private/decoded/more/receipts.json).

## D7: shield, stagger and recovery are different states

SHOWN: `DA_GameplayTagLibrary` distinguishes ShieldedStatusTag, ShieldBrokenTag, StupefyImpactTag, target crowd-control/reaction tags and other impacts. `BB_EnemyAI` separates ReactActive, ReactType, ProtegoActive, ProtegoStartActive and attack state. `EnemyDefenseParams` stores recovery hit/time limits, escape hit/time limits, consecutive deflect limits, counter limits, dodge chance and shield availability level. Therefore shield acceptance, actual shield removal, reaction selection and recovery permission should not be collapsed into a single damage number.

OPEN: complete stagger accumulation, exact break/recover transitions, every enemy's reaction immunity and the order in which a damage caller changes these states. The predicate result alone is not evidence that a stagger or shield-break animation ran.

Private: [blackboard flow](../private/flows/deep/BB_EnemyAI.md), [defense parameters](../private/tables/ship/EnemyDefenseParams.json), [tag library export index](../private/decoded/final/receipts.json).

## D8: combo, Ancient Magic meter gain and spend

SHOWN: `Pawn/Player/BP_Biped_Player.uasset` overrides MaxFocus=200, FinisherFocusCost=100, ManagedFinisherFocusCost=33.3, ComboResetTime=6 and AdditionalComboResetTimeOnParry=2. These are base actor defaults; S1 expansions and their gates are not disclosed here.

Selected FocusMap entries are ReceiveDamage 3, ProtegoBlock 2, ProtegoAOEBlock 2, ProtegoPerfectBlock 3, DeflectedDamage 1, DodgedUnblockable 2, HitEnemyWithBasicSpell 0.25, HitEnemyWithHeavySpell 1.5 and Kill 5. Full entries are retained privately. A defined event value is not proof that every attack dispatches that event exactly once.

SHOWN: AdjustFocusByName body `0x142ad38e0` looks up the named map entry and forwards its amount plus an external modifier to AdjustFocus body `0x142ad3650`. In its ordinary branch the latter computes an additive change, applies the positive-gain modifier and external multiplier, and clamps the total to 0..MaxFocus. Negative spending uses a gain multiplier of one. GetFocus `0x143585140` returns that same field; GetFocusPercent `0x143585160` divides it by maximum focus. Positive gain and spend are therefore distinct from the combo count.

SHOWN: UseFinisherFocus wrapper `0x1435896f0` negates the cost at offset 0x1d30 and calls AdjustFocus with external multiplier one in its ordinary branch. The sign-mask and 1.0 constants were read from the executable, and current reflection identifies FinisherFocusCost at that offset. A separate managed branch uses its own cost and cap. This establishes the selected spend arithmetic, not the complete availability/targeting/animation/refusal route.

SHOWN: AdjustComboPoints wrapper `0x143583260` calls `0x142ad2a10`. Its normal route increments a combo counter; threshold/interval/count inputs select additional scheduled work on a victim. It also schedules reset handling. The base player reset timing is stored separately from XP and focus. The complete orb-spawn callback, inherited threshold defaults and all combo-event variants remain OPEN, so no exact “every N hits spawns M orbs” formula is claimed. Meter gains from event maps, talent effects and pickups must not be counted as the same operation.

Private: [full actor/modifier exports](../private/decoded/more/receipts.json), [native focus/combo/spend code](../private/native/deep/CHAIN_NOTES.md). Selected legacy-looking perk assets are preserved as data, not presented as a verified live talent roster.

## YAIRPG implications

PROPOSALS: D4/D5 support a small typed-counter rule with explicit exceptions; D6/D7 sharpen LP7 by separating power, modifier conditions and control states; D8 supports a visible meter with one named gain cause and one real spend. These are design references, not a selected action-combat port, copied balance or completed YAIRPG behavior.
