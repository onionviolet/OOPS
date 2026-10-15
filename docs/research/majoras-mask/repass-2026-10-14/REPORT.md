# P3 Majora's Mask re-pass, 2026-10-14

This pass traces one additional NPC, `ACTOR_EN_NB`, from current time, scene and quest inputs through schedule selection, dialogue, changed facts and deliberate cycle reset. The selected static route is closed to named source consumers or five exact asset gaps. Full schedule and message programs, tables and call notes are saved privately. Full localized dialogue remains unavailable from the saved reconstruction. This is N64 source evidence, with no gameplay or MM3D claim.

The question was: **how do time, scene and quest facts select an NPC schedule/dialogue, and what survives reset?** The answer is that current inputs select an actor result, the actor validates its immediate context and chooses a message program, and separate writes control later routing, repeat eligibility and recorded history. Reset filters those writes individually. Retained completion does not imply the current quest predicate remains true.

## Scope and source

Used the existing clean `zeldaret/mm` clone at recorded pin `bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22`. Copied files were checked against that Git object's bytes and against the prior private snapshot where present. The prior snapshot omitted `.schl` files; the matching retained clone supplied the complete selected program without acquisition. The process check found only this dispatched P3 lane, PID 78057, and its tools. Unrelated dirty files were preserved.

**Stated:** the repository is a WIP N64 US reconstruction, excludes MM3D, and requires separately extracted assets. **Shown:** no root LICENSE/COPYING or game-source reuse grant was found in this pinned tree. Tool licenses are separate; no code or prose was incorporated into YAIR. **Stated:** `.schl` is a community reading/modification syntax, not Nintendo's demonstrated authoring workflow. [Pinned README](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/README.md#L26-L36), [syntax provenance](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/docs/schedule_scripting_language.md#L1-L9).

This follows [COMMON](../../../gm/dispatch/deep-repass-2026-10-14/COMMON.md), [P3's reaudit boundary](../../deep-detail-reaudit-2026-10-14/REPORT.md#p3-lane-prompt) and [deep-save direction](../../../USER_VISION.md#save-deep-details-for-reference-2026-10-14). Existing dossier files and gameplay owners were not edited. These findings add research, not accepted design or a new implementation gate.

## Joined findings

| Code | Evidence and answer | Source consumer |
|---|---|---|
| F1 | **Shown:** the complete selected schedule has 16 return paths. Day, scene, encoded clock and week flag `50:0x20` determine results 0-4. The interpreter reads present state and returns a selection; this script does not itself simulate an off-screen action. | [Complete schedule](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_Nb/scheduleScripts.schl), [interpreter](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_schedule.c#L3-L331) |
| F2 | **Shown:** a related actor's selected message program writes `50:0x20`; the additional NPC reads it on day 2. Result 2 requires a live companion when the result is entered. A missing companion causes result 0. Ordinary results share an offer initializer. Selecting a schedule is separate from accepting talk. | [Predicate writer](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_An/z_en_an.c#L566-L602), [actor result consumer](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_Nb/z_en_nb.c#L679-L784) |
| F3 | **Shown:** all three actor message programs are preserved: 154 commands, 228 structural edges and 28 direct message IDs. Current day/night, worn mask, choice index, callback state and existing completion guards select different paths, including refusal and no-repeat paths. `EVENTINF_43` forces a return interaction before normal schedule checks. Active talk uses its own action function. **Inferred:** speaker focus can be indexed, but absent message payloads prevent confirming localized speaker text or choice semantics. | [Actor programs and callbacks](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_En_Nb/z_en_nb.c), [message interpreter](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_msgevent.c#L1168-L1216) |
| F4 | **Shown:** the quest predicate `50:0x20` clears on deliberate reset; completion guards `50:0x02/0x04` remain. Their later message checks bypass another award. The shared collectible bit clears, so it is not the durable repeat guard. Two transient return flags also clear. The award path joins offer acceptance to the player inventory consumer, not merely an item-offer opcode. | [Allowlist](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L147), [reset consumer](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_sram_NES.c#L425-L653), [player award](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/overlays/actors/ovl_player_actor/z_player.c#L13635-L13683) |
| F5 | **Shown:** recorded notebook events have their own retained flags and later display/cursor consumers. Without the notebook, meeting events are not queued, while non-meeting completion events can be recorded; a displayed notice separately requires ownership. The selected UI timeline has four rows, but its bars do not replace the actual actor schedule. | [Event queue and settlement](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_message.c#L3469-L3514), [table](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/include/tables/notebook_table.h), [timeline and consumers](https://github.com/zeldaret/mm/blob/bf6bd9d0d3a90fe2f8960e034fbfd328e8bdef22/src/code/z_play_hireso.c#L191-L205) |

The private chain also joins both authored time changes to their actual environment/day consumers, the callback's transition/return to its transient flags, the item handshake to the inventory write, and notebook writes to later display. A requested transition can replace a context without its paused message program reaching DONE. These are static source contracts, not observed native outcomes. [Private call notes](../private/repass-2026-10-14/CALL_NOTES.md).

## One missed window and one reset boundary

**Shown in source; arithmetic cases inferred from an independent source model.** Time labels below are authored script labels. The script subtracts 1 from its encoded end; its calculation and `CLOCK_TIME` differ slightly in quantization. No measured UI-minute precision is claimed.

| Boundary ID | Current inputs | Before | After | Consequence and limit |
|---|---|---|---|---|
| W1: missed selection window | Day 2, scene `0x61`, quest `50:0x20` true, no return override, companion live when result entered | Nominal 12:00-12:15 selects result 2. Last accepted raw clock tick is 33441. | At raw clock 33442, the nominal exclusive 12:15 endpoint, the fresh schedule selects result 1. | Shared program is no longer selected. With the quest flag false, result 1 applies on both sides. An already active conversation runs the message action instead of recomputing this schedule. Actual scene realization is G3. |
| R1: deliberate cycle reset | Current quest fact, completion guards and recorded events already set | Present-cycle route and prior award/history can coexist. | `50:0x20` clears; `50:0x02/0x04`, `66:0x01`, `67:0x20` and `71:0x02/0x04` remain. `EVENTINF_42/43` and scene collectible `0x0C` clear. | Re-entering a qualifying reward branch checks the retained guard and skips another award. Re-establishing a current route needs a new quest fact. Reset initially writes day 0 and one tick before 06:00; that intermediate write is not the completed startup state. |

Complete flags, allowlist bits, inputs and endpoint rows are in the [private reset/boundary index](../private/repass-2026-10-14/README.md). W1 and R1 contain mechanics and IDs only.

## Ranked YAIR proposals

Every row is **PROPOSAL**, inferred from the selected source contracts. No proposal changes current world priority, one-realm/one-prestige scope, loop eligibility or any existing save policy. Implementation would need a separately authorized playable slice and compatible persistence decisions.

| Rank / code | PROPOSAL | Why this selected route adds evidence |
|---|---|---|
| 1 / P1 | Store present quest facts, durable reward guards and remembered observations separately. | R1 demonstrates all three can differ at the same reset. |
| 2 / P2 | Require present participants when entering a shared NPC interaction. | A time and quest match still has an explicit companion failure path. |
| 3 / P3 | Give an accepted interaction an explicit policy for closing windows. | Schedule selection and active dialogue use separate actor actions. |
| 4 / P4 | Make an NPC notebook a record with current evidence, rather than the eligibility owner. | Timeline bars, meeting history and real schedule predicates have separate consumers. |
| 5 / P5 | Record time-consuming actions as a transition with a return state and receipt. | The route joins time/day writes to a later interaction without treating a pause as completion. YAIR should define crossed-event handling itself. |
| 6 / P6 | Make award and completion publication an explicit transaction in a future original route. | Source order separates offer, parent acceptance, animated grant and later guard write. Crash-safe publication is not established here. |
| 7 / P7 | Reuse this bounded research format for an original NPC: complete predicates, all alternatives, later reads and field retention. | It exposes exact missing consumers/assets without needing a whole-game census. |

## Small touches

All are **PROPOSAL**. Any future UI uses the standing laptop/desktop priority; mobile work remains deferred.

| Code | Touch | Boundary |
|---|---|---|
| T1 | Show a known interaction's closing window beside its place. | Only after the player has learned it. |
| T2 | Label prior completion and current availability separately. | Do not imply a retained relationship or promise. |
| T3 | Explain which observed prerequisite changed an expected route. | No undiscovered route or narrative truth. |
| T4 | Put skipped/missed known appointments in a time-change receipt. | No retroactive attendance or reward. |
| T5 | Show an award receipt only after inventory and completion state publish. | An offer or animation alone is insufficient. |

## Deep saves, checks and remaining gaps

The ignored [private README](../private/repass-2026-10-14/README.md) indexes 34 full source files, 2,622,336 source bytes, complete selected schedule/message bodies, 55 notebook rows, 100 persistence rows, 20 branch walkthroughs, 17 route joins, source hashes and original analysis helpers. Files copied for context are not all semantically interpreted. Text indexes retain IDs, focus-based speaker inference and condition locators; missing prose is explicitly null. No narrative source truth is copied into this report.

| Gap | Exact unavailable input | What remains unproved |
|---|---|---|
| G1 | `extracted/n64-us/text/message_data.h`, encoded message data and ROM message segment | Full localized lines, actual choice labels/count/end types and embedded next-message links. The tracked header is an include wrapper, not the dialogue corpus. |
| G2 | Declared story texture/palette payload | Full picture/text content and presentation. |
| G3 | Extracted scene/room spawn, entrance and cutscene camera data for scenes `0x61/0x10` | Native co-presence and authored transition/camera realization. |
| G4 | Declared actor, player/item animation, notebook and item-object payloads | Animation duration, visual fidelity and native UI. |
| G5 | Generated selected schedule `.inc` and original ROM bytecode | Compiled identity and executed schedule behavior. |

**Checked:** private ignore rule; clean pinned source; every preserved source byte against the pin; available prior snapshot hashes; all selected branch targets and instruction sizes; all 25 command handlers; all selected allowlist masks; exactly one schedule leaf per 1,179,648 analytical input tuples; JSON, hashes and links. This verifies the saved research and its finite static trace. It does not execute the game.

The selected route has no unexplained direct edge: each ends at a source consumer or G1-G5. Full dialogue recovery is blocked by G1 under the no-ROM boundary. Other NPCs, whole-save policies, failure rollback, MM3D, gameplay implementation and human acceptance remain outside this pass. No ROM acquisition, game build/launch, installation, save access, commit or push occurred. [Checkpoint](CHECKPOINT.md), [machine-readable coverage](COVERAGE.json).
