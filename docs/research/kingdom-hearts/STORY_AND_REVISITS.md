# Events, conversation and changed returns

## The concrete data chain

| Code | Step | Evidence |
|---|---|---|
| N1 | Local room selects a program | `00progress` world chunks hold pointer-selected flag operations. Documented op 1 changes MAP/BTL/EVT spawn-program selections stored in save state; -1 leaves a channel alone. |
| N2 | Program selects content | ARD `AreaDataScript` has Spawn, Party, Mission, Progress, AreaSettings and SetEvent/SetJump/SetInventory commands. Selected English payload: 749 scripts over 289 ARDs, fully retained. |
| N3 | Scene runs its presentation track | 951 event records decode into 171,811 actor, camera, subtitle, sound, animation and other commands. Example `lm02` event 104 binds local actor models, map, camera data, audio and a finite end frame. Parsing is not a full audit of every command's effect. |
| N4 | Dialogue obtains text through IDs | Global libretto has 1,285 talk definitions with 1,486 referenced boxes under pointer/terminator decoding; room spawn entities carry talk-message bindings. MSG lists hold the actual localized lines and control tokens. |
| N5 | Progress and reward affect later play | `lm02-evt`, program 0x3F/AreaSettings 7, names flag 0x2c22 and item 367. LM flag 34 points to op 1 with room 2, unchanged MAP/BTL and EVT 2. This shows a changed event-program mapping tied to progress. |
| N6 | World map recalls the episode | `00progress/epsd` is 45 eight-byte records after its header, containing world, title and summary text IDs. `wm` and `jm` text supplies next-return reasons. Conditions and reader ordering need native verification. |

## Distinctions worth preserving

**SHOWN/STATED:** talk IDs resolve to message sequences; staged scene commands select actors and timing. Neither is sufficient evidence for a general choice graph, relationship-gated dialogue evaluator, autonomous NPC memory or procedural dialogue generation. Use the current Ink/native-host seams for YAIRPG choices, and current knowledge/message/feed seams for recap and ambient speech.

**SHOWN:** MU's member-table flag 0x2018 changes guest object 100 to 99 even though the exact flag's own progress script is just termination. This is a useful example of multiple readers of the same story fact. A no-op flag script does not mean the flag is meaningless. Conversely, display text referring to an ability is not proof the evaluator checks it correctly.

**STATED:** progression can lower flags and cause them to be raised again. Never infer global exactly-once behavior from a boolean flag or the existence of a reward table. Native repeat semantics remain unread. For YAIRPG preserve its supported recurrence and causal receipts; do not import arbitrary lifetime limits.

**INFERRED:** the useful changed-revisit model is retained state plus selected room/scene variants. A new scene ID should not make fresh people, new copies of unique possessions or erase a prior local debt. In a departure/return slice, current native owners must remain authoritative, as the start/branch integration map already proposes.

## Dialogue capture boundary

The private work store contains complete decoded English message lists, IDs, formatting tokens and room/event commands, plus the global talk-to-text map. Coverage is a selected language payload, not every collection title or locale. One `fontinfo.bar` is not a MSG table and was rejected as an invalid MSG header. Global libretto header value is 2 here, while the documentation example says 3; the C# Libretto reader and the prose terminator description also differ. Counts are from the explicit pointer/zero-word decoder, so future edits must verify that grammar on the target build.

A complete dialogue condition graph is not claimed: message IDs, ARD bindings and global progress operations are captured, but most actor-specific AI trap predicates have not been followed to native engine code.
