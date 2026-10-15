# Small touches, all PROPOSALS

Sources refer to the pinned tool source or installed IDs in [SOURCE_LEDGER](SOURCE_LEDGER.md). SHOWN identifies data fields/records; STATED applies to their documented or textual meaning. No UI or native experience was observed.

| Code | Touch | Source detail | Kit | Existing packet | Possible use |
|---|---|---|---|---|---|
| T01 | World-local font colors | ftst has nine palettes with 19 color slots | K14 | P14 | Apply world mood without hiding common controls. |
| T02 | Field and battle music pairs | Arif has eight BgmSet pairs per area | K19/K32 | P12 | Let an actual local change alter ambience. |
| T03 | Subarea costume override | NM memt area selector 2 | K14/K22 | P14 | A district can differ inside the same world. |
| T04 | Story-dependent guest role | MU objects 100 and 99 under flag 0x2018 | K6/K12 | P12 | Keep one person through a role change. |
| T05 | Matching scene and play appearance | memt includes high-poly/form variants | K14 | P16 | A scene should respect the current supported manifestation. |
| T06 | Weapon look follows the setting | Went and world-suffixed weapon objects | K9/K14 | P16 | Preserve weapon identity while varying presentation. |
| T07 | Item can teach a function | Item.Stat includes Ability | K3/K9 | P03 | Equipment can add a distinct usable verb. |
| T08 | Form has its own learning record | fmlv and DriveForm fields | K3 | P09 | Use a meaningful practiced function, not a costume XP bar. |
| T09 | Shared power, local task | wm 19500/19501 ability return requirements | K3/K13 | P14 | Let imported skill do useful local work. |
| T10 | Capacity gate differs from local spend | wm 19499 asks for drive gauge 5 | K3 | P04 | Explain whether a requirement is maximum capacity or present fuel. |
| T11 | Local movement tutorial | lm 17820/17821 | K10/K22 | P04 | Teach only the actions the local body actually supports. |
| T12 | Fast local approach | Dolphin Kick text identifiers 18725/17821 | K5/K13 | P14 | Offer a body-specific travel convenience. |
| T13 | Optional free activity variant | LM01_MS201 and LM01_MS201_FREE | K13/K16 | P14 | Let a source-supported activity have a replay form. |
| T14 | Episode recap at travel | epsd title/summary references | K12/K23 | P20 | Recall known local state before a return. |
| T15 | Destination and landing point differ | worldpoint world/area/entrance tuples | K4/K5 | P04 | Do not confuse route discovery with arrival placement. |
| T16 | Entrance-qualified room behavior | AreaDataScript If Entrance | K4/K12 | P10 | Arrival direction can select a coherent opening. |
| T17 | Known blocked-route reason | progress block-area text reference | K5/K11 | P04 | Show a discoverable practical reason for refusal. |
| T18 | Separate route opening and removal | progress add/remove world-point operations | K5/K29 | P12 | A causal route change can alter a later return. |
| T19 | Local party restriction | ARD Party selector | K6/K10 | P06 | State who can actually join this action. |
| T20 | Encounter-specific power rule | mission DriveDisabled/MagicDisabled flags | K2/K10 | P14 | Make a local restriction legible without erasing earned skill. |
| T21 | Different challenge resource rule | he messages 4006 and 4009 | K3/K10 | P14 | A challenge can alter resource behavior rather than just enemy HP. |
| T22 | Reward slots are not XP | bons slot/gauge/HP/MP fields | K3/K9 | P02 | Offer a useful qualitative capacity improvement. |
| T23 | Source-tagged chest/event reward | trsr joins item, room and event | K9/K11 | P11 | Keep a find linked to its actual origin. |
| T24 | Talk binding separated from prose | libretto TalkMessageId to TextId | K20/K23 | P19 | Keep text replaceable while consequences stay explicit. |
| T25 | Timed subtitles and voices | Event.SeqSubtitle and SeqVoices | K19/K32 | P21 | Presentation timing need not advance the simulation clock. |
| T26 | Mission start, finish and failure cues | MSN header sound fields | K14/K32 | P01 | Feedback should distinguish a result from a mere attempt. |
| T27 | Map display preference saved | SaveFinalMix NavigationalMap declaration | K14/K18 | P16 | Do not mix layout preference with fictional knowledge. |
| T28 | No-op flag can still matter | MU flag 24 terminates while memt reads it | K12/K34 | P16 | Audit all readers before deleting an apparently unused fact. |
| T29 | Padding is not content | 512 worldpoint slots, 54 populated | K1/K34 | P22 | Count valid records separately from storage capacity. |
| T30 | A signal completes local activity | LM01_MS201 trigger 10 checks signal 18/99 | K13/K32 | P10 | Outcome signal and scene playback are separate jobs. |
