# Small touches

Twenty-six original PROPOSALS, not accepted changes. Source identifiers name structural evidence; STATED labels are UI intent, not played accessibility proof. Every once-per-context behavior may recur with a new valid cause.

| Code | Touch | Source | Existing owner area / proposal |
|---|---|---|---|
| T01 | Witness-specific acknowledgement | `AcknowledgementRules.NPCType` | Dialogue; P1 |
| T02 | Cooldown on repeated comments | `AcknowledgementRules.Cooldown` | Dialogue; P1 |
| T03 | Quiet during an exclusive scene | `AcknowledgementRules.PlayInExclusiveMission` | Dialogue; P1 |
| T04 | Retire irrelevant chatter topics | `AmbientChatterTopicsDynamic.Active/MissionLocked` | Dialogue; P1 |
| T05 | Small local conversations use actual participants | `EavesdropConversations.Participant1..4` | Dialogue; P1 |
| T06 | Location-specific eavesdropping | `EavesdropLocations` | Dialogue/world; P1 |
| T07 | Known but unavailable choice explains why | `StoryGraphCondition_Branch.IsSelectable` | Dialogue/UI; P5 |
| T08 | Hidden choice stays undisclosed | `StoryGraphCondition_Branch.IsVisible` | Dialogue/UI; P5 |
| T09 | Speaker identity stays separate from line text | `SceneRigScriptNode_Dialogue.CharacterID` | Dialogue; P5 |
| T10 | A conversation uses a valid physical placement | `DA_ConversationPresets` | Actor/world; P6 |
| T11 | Notebook reveals one fact at a time | `KnowledgeFacts.ColumnID` | Knowledge/UI; P2 |
| T12 | Knowledge retains where a fact came from | `KnowledgeActions / GrantKnowledge` | Knowledge; P2 |
| T13 | Known shop hours do not grant entry | `KnowledgeVendorFacts.OpenTime` | Knowledge/access; P2 |
| T14 | Delivered letter need not be read | `MailDynamic.SentMinute/ReadMinute` | Quest/mail; P4 |
| T15 | A letter can be noticed separately | `MailDynamic.Noticed` | Quest/mail; P4 |
| T16 | Attachment claim has its own receipt | `MailDynamic.AttachedContainerID, structural lead only` | Inventory/mail; P4 |
| T17 | A paper can have a header and image | `RichPaperDefinition` | Narrative/UI; P4 |
| T18 | Manual save availability has an explicit state | `Menu_SaveUnavailable_Desc (STATED)` | Persistence/UI; P3 |
| T19 | Saving and saved are distinct notices | `Menu_SaveInProgress/Menu_SaveSuccessful (STATED)` | Persistence/UI; P3 |
| T20 | Restore callback does not repay a reward | `BPI_SaveRestore, proposed idempotency` | Persistence; P3 |
| T21 | Comfort setting preserves the learning route | `InputAction_Minigame_Autosolve (STATED)` | UI/lesson; P5 |
| T22 | Camera shake is a comfort choice | `Menu_CameraShake_desc (STATED)` | UI; P5 |
| T23 | Audio cues have a visual option | `AudioVisualizer_desc (STATED)` | UI; P5 |
| T24 | Reserve a real activity connection | `SocialStationActionChoices.NumConnectionsReqd` | Simulation; P6 |
| T25 | Separate appearance from mechanical strength | `GearAppearanceItems/GearPowerStats` | Equipment; P2 |
| T26 | Preview incompatible content before applying it | `MOD_Browser_BuildVersionIncompatModalTitle (STATED)` | Persistence/authoring; P7 |
