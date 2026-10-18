# Small touches

Twenty-four original PROPOSALS inspired by named source hooks, not copied writing or assets. Source affordances are SHOWN; usefulness in YAIR is INFERRED. Native visual/audio/accessibility effects were not tested. Owners are routing suggestions, not new accepted gates.

| Code | Original touch | Source hook | Existing owner |
|---|---|---|---|
| T01 | Visited-choice tint without losing legibility | `Choice.Visited / GetTextColor` | Dialogue/UI |
| T02 | Explicit exit label on a conversation choice | `Choice.GetTag` | Navigation |
| T03 | Mark a choice that accepts a quest | `QuestHandler.GetChoiceTagEvent` | Quest/UI |
| T04 | Show a reputation requirement beside an offer | `RequireReputation` | Social/UI |
| T05 | Disambiguate same-named powers by parent skill | `WaterRitualLearnSkill.ShouldDisambiguatePower` | Progression/UI |
| T06 | Attribute a taught method to its teacher | `WaterRitualLearnSkill.Unlock` | People knowledge |
| T07 | Scroll the selected choice into view | `ConversationUI.RenderClassic` | Navigation |
| T08 | Keep direct numbered choice shortcuts | `ConversationUI.Input` | Input/UI |
| T09 | Offer letter shortcuts after number slots | `ConversationUI.RenderableSelection` | Input/UI |
| T10 | Respect a view’s explicit Escape policy | `ConversationUI.Escape` | Navigation |
| T11 | Show a concise effect on successful node transition | `ConversationUI.Select sound hook` | Feedback |
| T12 | Separate an icon from the prose layout | `ConversationUI.Icon / Render` | UI |
| T13 | Keep trade totals beside both sides | `TradeScreen.UpdateTotals` | Trade/UI |
| T14 | Show the weight consequence of trade | `TradeScreen water-weight calculation` | Trade/material |
| T15 | Retain category collapse during inspection | `TradeScreen.categoryCollapsed` | UI preferences |
| T16 | Save a lesson’s substep | `TutorialManagerGameSystem.BeforeSave` | Onboarding |
| T17 | Re-find the highlighted target after reload | `TutorialManager highlight fields plus AfterLoad; original adaptation inferred` | Onboarding/UI |
| T18 | Allow optional contextual tooltip help | `TutorialManager.AllowTooltipUpdate` | Onboarding/UI |
| T19 | Mark a chosen response as an attempt until the result exists | `Re-pass Kill / missile wrapper distinction` | Command/NPC |
| T20 | Distinguish loaded uses from reserve stock | `Re-pass missile loader chain` | Equipment/UI |
| T21 | Keep source template separate from a per-eater effect | `CookingRecipeResultProceduralEffect.apply` | Crafting/effects |
| T22 | Name the clock in a long-lived status detail | `Calendar / ActionManager separation` | Time/UI |
| T23 | Report incompatible save version before entering play | `XRLGame.LoadGame / SavesAPI.ReadSaveJson` | Persistence/UI |
| T24 | Offer a recoverable prior snapshot with clear status | `XRLGame backup/recovery paths; stronger validation is original proposal` | Persistence/UI |
