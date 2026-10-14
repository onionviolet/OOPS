# Majora's Mask (N64 US): aspect backfill

## Corrections

C1: Attribution refinement to the prior REPORT F1/F2: readable scheduleScripts.schl is a community reconstruction language. The shipped system is bytecode interpreted by z_schedule.c; the fresh documentation explicitly says Nintendo did not use this higher-level language. Timetable behavior remains supported.

C2: No fresh contradiction found for the prior core reset/notebook distinction. The fresh flash-save read extends F4/F7 with checksum and backup behavior. The prior report did not cover corrupt-save recovery.

C3: No MM3D claim was refreshed. Prior remake claims remain historical wiki-level observations, not findings from this N64 source pass.

Date: 2026-10-14. Lane: bf-public-other. Status: PARTIAL at the whole-game level; all twelve aspects assessed below. Static public evidence only. Source pin: `bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22`.

Shown means a static source/schema read; stated means a guide/FAQ claim; inferred means a transfer proposal. Covered marks the bounded contract described, not every implementation or runtime behavior in that aspect. No install, game launch, build, save access or YAIR implementation. Every YAIR takeaway is a PROPOSAL. Canon-first order, one realm/one prestige milestone and desktop-first direction stay authoritative.

Private reacquisition: [work area](/Users/weiwei/.codex/research/bf-public-other/), [hash ledger](/Users/weiwei/.codex/research/bf-public-other/extract/HASHES.txt), [source index](/Users/weiwei/.codex/research/bf-public-other/extract/source_inventory.json), [page captures](/Users/weiwei/.codex/research/bf-public-other/extract/pages.json). No raw source, dialogue or page dumps in this folder. Old Mac private extracts were not used.

## A01 Dialogue and conversation

Status: **covered**.

Shown: z_msgevent.c runs bytecode with a saved instruction position, handler/size tables, conditional branches, callback waits and text IDs. CheckTextChoice selects offsets for three choices; commands can change rupees, items, week flags and notebook events. Anju's 0x28BA onward exchange alternates actor focus, waits on text/callbacks, records both people, then marks the encounter heard. This is authored dialogue, not generated prose. Full localized prose and a portrait census are unread without extracted message assets.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_msgevent.c), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/z_en_an.c), [source 3](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/assets/text/message_data_static.c).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): Separate line ID, speaker, eligibility, wait and paid effect. Interrupting before settlement must not silently count a promise as fulfilled.

## A02 Narrative delivery

Status: **covered**.

Shown: notebook_table.h has 20 person rows and 35 event rows. Person rows bind photo identifiers, text IDs and met flags; event rows bind icon, current-color flag, message IDs and recorded-history flag. Message_BombersNotebookProcessEventQueue deduplicates stored events, sets history even when presentation is gated, and displays a notebook message only when the notebook is owned. Narrative recollection and present quest fulfillment have separate flags.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/include/tables/notebook_table.h), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c), [source 3](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c).

PROPOSAL, owner [WORLD_SECRETS_AND_DISCOVERY.md](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): Keep a recalled appointment visible while its current attempt is unfulfilled. Knowledge is not the present truth of the world.

## A03 Implementation architecture

Status: **covered**.

Shown: native C actor overlays and shared PlayState. Play_UpdateMain calls actor, message, interface, camera and environment updates with pause/transition gates. Play_Update has a separate notebook-open path rather than running ordinary world updates behind it. Schedule and message event interpreters are separate from actor action functions. This is bounded architecture coverage; OS/audio/render scheduling is indexed but not semantically audited.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_play.c), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_msgevent.c), [source 3](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_schedule.c).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Keep timetable selection, conversation execution and public projection distinct. A UI read must not become a simulation tick.

## A04 Save and persistence

Status: **covered**.

Shown: Save/SaveContext memory is copied into flash buffers; save signatures and a checksum select valid main/backup data. The checked validation branch tries the backup after a bad primary, then clears its buffer if both fail. Song-of-Time reset masks scene/week flags through explicit persistence tables and resets selected clock, inventory and quest fields. Owl and cycle save paths differ. Not shown: a versioned migration scheme or offline catch-up. The whole save-field census remains partial.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c).

PROPOSAL, owner [ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md](../../../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md): Define reset retention by owned field and reset reason. Validate backups before recovery; preserve rejected bytes rather than copy the source's destructive fallback.

## A05 AI and NPC behavior

Status: **covered**.

Shown: conditional schedule bytecode checks time, day, flags and scene, returning a result/time window. Anju maps that result to actor behavior and routes; the promise and pendant facts choose later presence. This is an authored routine selector. It does not demonstrate autonomous goals or a global off-screen relationship simulation.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_schedule.c), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/scheduleScripts.schl), [source 3](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/z_en_an.c).

PROPOSAL, owner [TIMELINES_AND_DIVERGENCE.md](../../../TIMELINES_AND_DIVERGENCE.md): A changed promise can change tonight's destination. Bind the visible schedule to observer evidence and recheck co-location on arrival.

## A06 UI and information design

Status: **partial**.

Shown: the notebook maps people and events to photos, icons and current/history flags. Play_Update allows L/B/Start to close it and clears message state. The world-update path changes while it is open. Actual screen layout, readable type size, controller feel and accessibility were not exercised; no desktop remake UI is inferred from N64 data.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/include/tables/notebook_table.h), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_play.c).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): PROPOSAL at 1366x768 and 1920x1080: show people, observed windows and selected event detail beside one another. Mobile work is deferred.

## A07 Content authoring and modding

Status: **covered**.

Stated by repository docs: .schl was invented by the community for reading/modifying bytecode. Shown: actor schedule files, macro message scripts and notebook tables localize authoring by subsystem. The checkout's generated message_data.enc.h is referenced, not acquired as a full text catalogue. No official mod API or Nintendo content editor was established.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/docs/schedule_scripting_language.md), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/scheduleScripts.schl), [source 3](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/assets/text/message_data_static.c).

PROPOSAL, owner [DIALOGUE_AND_INTERACTIONS.md](../../../worlds/DIALOGUE_AND_INTERACTIONS.md): Validate message targets and schedule windows as authoring data. Do not confuse a reconstruction tool with the source studio's editor.

## A08 Balance and numbers

Status: **partial**.

Shown: schedule ranges subtract one from the end before an inclusive comparison, giving an exclusive authored end. qrand.c uses a seeded 32-bit recurrence and constructs [0,1) floats from integer bits. Three-day reset count saturates at 999. No checked consumer establishes pity, saved RNG continuity or a full economy curve; those remain unread.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_schedule.c), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/boot/libc64/qrand.c), [source 3](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c).

PROPOSAL, owner [ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md](../../../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md): State interval semantics and RNG ownership explicitly. A displayed counter cap should not create a fixed solo-player attempt limit.

## A09 Time and scheduling

Status: **covered**.

Shown: environment clock advance is conditional on pause, game-over, dialogue exceptions, transition, frame advance and cutscene state. Anju's route reads the shared phase, not a real-world timer. No offline simulation is established. Prior Double Time and slowdown details are retained as prior evidence, not newly expanded here.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_kankyo.c), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/scheduleScripts.schl).

PROPOSAL, owner [TIMELINES_AND_DIVERGENCE.md](../../../TIMELINES_AND_DIVERGENCE.md): A wait queue must stop at decisions and crossed causal boundaries. Never equate a paused interface with elapsed world time without a declared world rule.

## A10 Onboarding and reveal

Status: **partial**.

Shown: notebook ownership gates the queued event text, while event-history recording is independent. Met flags govern person recognition; readable schedule knowledge is earned through encounters. The full introductory cycle, tutorial ordering and every mask reveal are unread.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/include/tables/notebook_table.h), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c).

PROPOSAL, owner [WORLD_SECRETS_AND_DISCOVERY.md](../../../worlds/WORLD_SECRETS_AND_DISCOVERY.md): Earned recognition may unlock a planning view without exposing all undiscovered people or their future routes.

## A11 Little touches

Status: **covered**.

Shown: focus-to-child/self commands keep a multi-person exchange legible; decide/cancel/error sounds have distinct handlers; notebook writes play a separate sound. Event dedup prevents repeated notices for already-recorded history. This is static feedback code, not a measured feel/accessibility claim.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_msgevent.c), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c).

PROPOSAL, owner [THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md](../../../THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md): Make speaker changes and saved-note receipts visible. A refusal sound should differ from a successful promise receipt.

## A12 Other systems

Status: **partial**.

Shown: reset code also handles equipment downgrade, consumables, bottle contents, scene clear state and minigame-related registers. The checkout exposes inventory, shops, combat, transformations, cutscenes, audio and effects as additional subsystems in the inventory. Only reset-boundary interactions were inspected; their full catalogs and mechanics remain unread.

Sources: [source 1](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c), [source 2](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/README.md).

PROPOSAL, owner [CAMPAIGN_FRAMEWORK.md](../../../worlds/CAMPAIGN_FRAMEWORK.md): Treat a container, its contents and learned capability as separate retention owners; source-qualified worlds decide which survives.

## Remaining precision

Full NPC/message catalog, all save fields, MM3D, gameplay/UI feel, original Nintendo editor and complete off-screen simulation remain unread. No ROM/assets were extracted.

[System inventory](SYSTEM_INVENTORY.md), [three deeper systems](DEEPER_SYSTEMS.md), [ranked report](REPORT.md), [tooling and rerun](TOOLING.md). Grouped status is [the lane checkpoint](../../majoras-mask/aspects-2026-10-14/CHECKPOINT.md).
