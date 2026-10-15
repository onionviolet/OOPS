# Dialogue system digest

2026-10-14. Steam build 20773316. Full text is preserved privately under Addendum 2. This public file discusses structure and short identifiers. SHOWN means installed data/decoded code, STATED means shipped text and INFERRED means a cross-file interpretation. No conversations were played and no saves were accessed.

Private starting points: [archive index](../private/README.md), [complete subtitles](../private/text/SUB-enUS.json), [line records and known joins](../private/text/dialogue-lines.json), [complete interface dictionary](../private/text/MAIN-enUS.json), [decoded graph index](../private/flows/deep/INDEX.json), [relationship binary inventory](../private/dialogue/Relationship_Scripts.strings.json).

## D16: the storage layers

| Layer | SHOWN locator | What it contains |
|---|---|---|
| Subtitle text | `Phoenix/Content/Localization/WIN64/SUB-enUS.bin` | AVAFDICT key/value dictionary; 34,955 unique entries decoded with validated offsets and UTF-8. Keys include speaker-prefixed line IDs. A prefix alone is not a verified speaker binding. |
| Interface text | `Phoenix/Content/Localization/WIN64/MAIN-enUS.bin` | 18,889 entries, including options, tutorials, mechanical labels and journal keys. This is a different dictionary from subtitles. |
| Conversation graph | selected `Cinematics/Missions/*/*_SG.uasset` exports | `StoryGraph_Conversation.ArticyConversation.EventID`, input/output events, dialogue sequences and graph edges. |
| Scripted line | `SceneRigScriptNode_Dialogue` | `DialogueID`, `CharacterID`, next/previous nodes and optional timing/presentation data. |
| Choice | `SceneRigScriptNode_Choices`, `SceneRigScriptNode_ChoicePreview` | Explicit alternatives and preview line IDs, sometimes complete embedded English script text. |
| Branch gate | `StoryGraphCondition_Branch` | Branch ID, separate `IsVisible` and `IsSelectable` providers, display-text provider and icon. |
| Authored condition provider | `Bool_DialogueArticyCondition`, `Bool_DialogueArticy_Selectable` | An event ID and dialogue-line ID reference. This export is a lookup reference, not the complete evaluator expression. |
| Shared relationship/script data | `Phoenix/Content/WwiseAudio/windows/en-us/Relationship_Scripts.bin` | Extracted CONV-format binary retained in full. Header and offset-bearing string inventory saved. The binary's complete record grammar/evaluator is not decoded here. |
| Dynamic templates | Ship DB `ConversationDynamic`, `ConversationExclusiveDynamic`, `ConversationThreadDynamic` | Played counts; actor/event-pattern/mission exclusivity; named integer/string properties. Empty shipped templates, not user saves. |

The first selection includes 11 story graphs; a second adds two COM_07 graphs. All selected packages parsed successfully. Full exports retain duplicate representations and imported variants. Export counts are not unique spoken lines or playable choice counts.

Example: `Cinematics/Missions/ZSI/CONV_ZSI_01_02_CloseConv_SG.uasset` connects dialogue IDs to explicit CharacterID fields and next-node references. Its line ID `DinahHecat_11390` joins the subtitle dictionary directly. The ZSR opening graph uses separate visibility and selectability providers for `Player_34721`. No prose needs to be copied into the public summary to preserve either join.

Private: [ZSI flow](../private/flows/deep/CONV_ZSI_01_02_CloseConv_SG.md), [ZSR opening flow](../private/flows/deep/CIN_Mission_ZSR_01_OpeningConvo_SG.md).

## D17: what a choice can change

SHOWN: `MissionSteps.TaskTypeID=EvalConversationResult` occurs 97 times. `SetConditionalReward` occurs 22 times. `MissionTaskTypes` supplies their argument signatures. These are separate from dialogue presentation and from the option's display icon.

A narrow reward example is COM_07. Step 32.1 checks event `Mission_COM_07_01_GarrethsThanks` against `GenericBoolResult_A.true`, with a named jump destination. Step 33.1 selects a reward nickname. `MissionRewards` has a corresponding nickname-tagged currency reward of 300 internal `Knuts`. Its separate recipe reward has no such nickname. The selected thanks graph preserves its choice and branch providers. SHOWN: the mission consumes a conversation-result value and has a reward-selection action. INFERRED: the result can select a different reward route. Exact flag polarity, the Articy assignment that writes this Boolean, and a played payout are not claimed from those rows alone.

Another mission sample uses a stat predicate followed by a conditional reward selector. All such source rows are retained privately. Do not infer that every forceful dialogue option uses the same payment rule or that every icon implies a persistent consequence.

SHOWN in native code: `ConversationComponent.SetBranchIDStateUsed` reaches `0x142d0eb30` from wrapper `0x1435cad40`. The selected body constructs a named state key and sets a used-state flag on a matched entry. It does not itself prove a relationship-score increase or grant a reward. REA and direct Ghidra details are in [NATIVE_CHAINS](NATIVE_CHAINS.md).

Relationship facts, general friendship levels and moral/alignment totals must remain separate claims. `ConversationThreadDynamic` permits named properties; `CompanionBondingLevels` exists; neither establishes a universal relationship effect for these choices. Exact per-line fact writes in CONV remain an explicit gap. Full dialogue, the binary, selected choice graphs and the mission rows are preserved for that follow-up.

Private: [all mission steps](../private/tables/ship/MissionSteps.json), [reward variants](../private/tables/ship/MissionRewards.json), [conversation properties](../private/tables/ship/ConversationThreadDynamic.json), [native notes](../private/native/deep/CHAIN_NOTES.md). The COM_07 full graph exports and joins are indexed in the private README.

## D18: who can speak, and when

SHOWN: graph line nodes carry CharacterID separately from text. Input/output events and graph edges order a conversation. Mission tasks register/change/remove conversations, force conversations, evaluate conversation results and synchronize conversation time changes. In the shipped steps, ChangeUpdateConversation has 152 rows, RemoveUpdateConversation 151, ForceConversation 77, RegisterVendorConversation 11 and UnregisterVendorConversation nine. Counts include development and child records.

SHOWN: schedules have actor/activity/key/priority/time/world data, while quest overrides can reserve or relocate an actor. Conversation exclusivity has CharacterID, EventNamePattern and RegisteredByMission. INFERRED: speaker availability, registration, authored branch conditions and current quest state are distinct gates. A scheduled actor standing nearby is not sufficient evidence that every conversation is available.

The public SDK suggests additional house/gender/stat/result condition provider types, but its build does not match. Those declarations are naming leads, not proof that a particular selected graph uses all such conditions. Native conversation-option enumeration is inspected only within the limits in NATIVE_CHAINS. Full scheduler/conversation arbitration, every Articy expression and live interruption/resume behavior remain OPEN.

## Preservation and reuse boundary

Full text and embedded script text remain private, with original IDs and source paths. Known graph speaker/choice/condition references are retained verbatim there; unlocated global conditions and effects are explicitly unknown. The CONV string inventory is not advertised as a decoded dialogue engine. This preserves future research inputs without inventing completed semantic coverage.

PROPOSALS: D16/D18 refine LP2, LP5 and LP6. D17 supports a small choice-to-fact/reward receipt proposal. A chosen YAIRPG slice would need one actual state write, one later consumer and save/reload/import evidence. No franchise dialogue, relationship system or new quest is implemented by this pass.
