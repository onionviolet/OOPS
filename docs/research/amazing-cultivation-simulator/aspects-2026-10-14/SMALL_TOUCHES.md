# Small touches

Shown means inspected code capability, not perceived play quality. Adaptations are PROPOSALS. See ASPECTS.md and SOURCE_READING.json for paths.

| Code | Source observation | Source symbol | Original adaptation |
| --- | --- | --- | --- |
| T01 | Separate visible and enabled options | `DlgDef; Wnd_Dlg.ShowOptions` | Explain an unavailable but known choice. |
| T02 | Sort useful actions first | `Wnd_JianghuTalk.UpdateActions` | Keep unavailable actions discoverable below usable ones. |
| T03 | Describe actions on hover | `Wnd_JianghuTalk.UpdateActions` | Show the relevant known prerequisite. |
| T04 | Give conversation a return route | `Wnd_JianghuTalk.UpdateActions` | Use the shared Back/Esc route. |
| T05 | Portrait follows the speaker | `Wnd_Dlg.UpdateHead` | Identify speaker without repeating names in every sentence. |
| T06 | A line can have several variants | `Wnd_Dlg.ShowSpeech` | Use original variants without changing outcomes. |
| T07 | Node effects include audio hooks | `DlgMgr.ExecuteNode` | Sound can acknowledge a real result. |
| T08 | Node effects can target either actor | `DlgMgr.ExecuteNode` | Attribute who acted and who was affected. |
| T09 | A functional node can wait | `Wnd_Dlg.ShowFunction` | A scene can await an actual world result. |
| T10 | Repeated information is recognized | `Wnd_JianghuTalk.TalkAbout` | Avoid paying twice for the same fact. |
| T11 | Vigilance changes willingness | `Wnd_JianghuTalk.TalkAbout` | Represent social context separately from generic affection. |
| T12 | Rumour can schedule an event | `JianghuMgr.TalkFinish` | A conversation can have a delayed consequence. |
| T13 | Chat may mention another known person | `Wnd_JianghuTalk.JustTalk` | Use actor knowledge to make ambient talk relevant. |
| T14 | Rank changes text candidate types | `JianghuMgr.GetRandomTalk` | Reflect hierarchy without silently granting permission. |
| T15 | Relic activation has feedback | `AreaRoom.DoUpdateData` | Show which condition activated. |
| T16 | Deactivation has different feedback | `AreaRoom.DoUpdateData` | Explain the lost benefit after moving an object. |
| T17 | Modifiers bind to object and room | `AreaRoom.EnableFSItemModifier` | Retain a clear cause for inspecting/removing an effect. |
| T18 | A useful room result completes a lesson | `AreaRoom.DoUpdateData` | Teach through a functional result. |
| T19 | Shortage stops a regional policy | `OutspreadMgr.RegionPolicyCostStep` | Show recoverable support failure. |
| T20 | Aid records its sender | `OutspreadMgr.AddDisasterAid` | Remember contribution and reciprocity. |
| T21 | Solved and expired disasters close differently | `OutspreadMgr.StopDisaster` | Let timely help matter. |
| T22 | Partial scheduler time is retained | `IManagerModule_LoopInterval.Save/AfterLoad` | Reload should not erase almost-finished work. |
| T23 | Job objects are pooled by definition | `JobMgr.GetJobClass/RemoveJob` | Profile reuse and reset correctness before optimizing. |
| T24 | Save header summarizes state | `SaveMgr.GetSaveHead` | A slot can show date/content context without loading the world. |
