# Source-grounded small touches

All rows are shown in source, not observed runtime. YAIRPG transfers are inferred PROPOSALS under the named existing character, engine, clock, economy or UI owner. No donor wording/assets are proposed.

| Code | Donor detail | Source under private extract/source | Original YAIRPG transfer |
| --- | --- | --- | --- |
| T01 | Perspective log links to the other participant | `Verse.PlayLogEntry_Interaction.cs` | Character journal: jump to the relevant known actor |
| T02 | Initiator and recipient may have different log grammar | `Verse.PlayLogEntry_Interaction.cs` | Character journal: acknowledge viewpoint without changing facts |
| T03 | Log ID seeds cosmetic text inside push/pop RNG | `Verse.PlayLogEntry_Interaction.cs` | Engine: UI redraw must not consume consequential randomness |
| T04 | Missing log participants produce an explicit error representation | `Verse.PlayLogEntry_Interaction.cs` | Persistence: do not invent a participant to hide broken references |
| T05 | Interaction icon can use faction or ideology identity | `RimWorld.InteractionDef.cs` | Character UI: retain source attribution beside a consequence |
| T06 | Faction icon can carry faction color | `RimWorld.InteractionDef.cs` | UI theme: pair readable labels with identity color |
| T07 | Speech bubble follows successful interaction path | `RimWorld.Pawn_InteractionsTracker.cs` | Character UI: feedback follows a real occurrence |
| T08 | Negotiator skill appears beside the speaker | `RimWorld.Dialog_Negotiation.cs` | Dialogue: show the actor means relevant to this action |
| T09 | Call target info and relation share the dialogue header | `RimWorld.Dialog_Negotiation.cs` | Dialogue: visible standing explains available requests |
| T10 | Unavailable choices append their reason | `Verse.DiaOption.cs` | UI: retain known routes with useful refusal text |
| T11 | Return node can be rebuilt late | `Verse.DiaOption.cs` | Dialogue: refresh options after changed state |
| T12 | Options use text height rather than fixed one-line height | `Verse.DiaOption.cs` | UI: wrap meaningful reasons at laptop size |
| T13 | Choice links may expose an info-card hyperlink | `Verse.DiaOption.cs` | UI: explain a known concept in context |
| T14 | Trader request rejects unsuitable seasonal temperature | `RimWorld.FactionDialogMaker.cs` | Events: make route conditions causal and readable |
| T15 | Trader request shows remaining cooldown | `RimWorld.FactionDialogMaker.cs` | Events: show when the route becomes available again |
| T16 | Trader title failure has a return route | `RimWorld.FactionDialogMaker.cs` | Institutions: retain a useful way back after refusal |
| T17 | Delay countdown and absolute date share the saved deadline | `RimWorld.QuestPart_Delay.cs` | Clock UI: show relative wait plus expected arrival date |
| T18 | Delay alerts identify culprit targets | `RimWorld.QuestPart_Delay.cs` | Events UI: link warning to the actual commitment |
| T19 | Critical countdown changes alert status | `RimWorld.QuestPart_Delay.cs` | UI: urgency should track a real threshold |
| T20 | Historical quest suppresses live expiry info | `RimWorld.QuestPart_Delay.cs` | Journal: separate old outcomes from current urgency |
| T21 | Time speed buttons include shortcut tooltip and selected highlight | `RimWorld.TimeControls.cs` | Desktop UI: keep keyboard and current speed visible |
| T22 | Forced pause has a distinct display | `RimWorld.TimeControls.cs` | Clock UI: explain why progress is paused |
| T23 | Time-control use records demonstrated knowledge | `RimWorld.TimeControls.cs` | Onboarding: acknowledge actual use |
| T24 | Adaptive training has a start grace period | `RimWorld.LessonAutoActivator.cs` | Onboarding: avoid piling hints onto arrival |
| T25 | Important opportunities can request a lesson sooner | `RimWorld.LessonAutoActivator.cs` | Onboarding: prioritize help by immediate usefulness |
| T26 | Generated translation can fall back to English rules | `Verse.Grammar.GrammarResolver.cs` | Content tools: diagnostic fallback should preserve a usable label |
| T27 | Bill current/target and filters are adjacent | `RimWorld.Dialog_BillConfig.cs` | Craft UI: explain what is counted toward stock |
| T28 | Bill ingredient radius can be drawn on the map | `RimWorld.Dialog_BillConfig.cs` | Craft UI: show the scope of available means |
| T29 | Insufficient funds flashes currency and gives a rejection | `RimWorld.TradeDeal.cs` | Economy UI: point to the specific missing resource |
| T30 | Autosave chooses an unused slot before rotating oldest | `RimWorld.Autosaver.cs` | Persistence: retain several recoverable recent checkpoints |
