# Taylor’s washroom choice, 2026-11-26

Implemented and agent-verified through the native headless interface. Desktop replay and the normal rebuilt game remain the coordinator’s next gate; this record does not claim the AD43 floor.

| Preflight | Scope |
|---|---|
| Reading / authority | Implement the smallest source-grounded Taylor opening using existing lead seams, as requested in the foundation lane. |
| Player sentence | “You hold the doorway as the insects leave through the window and gaps.” Leaving first instead keeps the insects in the room. |
| Ordinary route | Fresh Village → Beginning → Worm · Taylor Hebert → Confirm arrival. Send the insects out follows the chapter; Step into the corridor before doing so is an authored alternative. |
| Fit / mechanism | [Typed beginning registration](../../src/book_world_beginning_registration.js), structured native jobs, real actor relocation, existing knowledge and save owners. The grouped insect actor represents a swarm, with no invented numeric population. |
| Ring / failure | Producer: the source-qualified starting group. Consumer: dispersal relocates it outside. Leaving does not silently disperse it. Cancellation has no physical effect; return permits a later decision. Native Save/reload and Export/Import retain the choice. |
| Rules | AD5, AD36, AD38, AD43; AR11–AR16; SKR1, SKR3, SKR18, SKR21; existing [lead-life rules](../LEAD_LIFE_RULES.md). No new shared engine or save format. |
| UI gate | Existing desktop Beginning surface; 1920×1080 rebuilt browser check belongs to the coordinator. Mobile work is deferred. |

The held English EPUB was read directly for all 52 nonempty paragraphs of **Gestation 1.1**, not merely the archive’s earlier grade. The exact EPUB and member hashes are in [proof.json](evidence/worm-opening-2026-11-26/proof.json). Paragraphs 43–46 support established private practice and gathered insects; paragraphs 47–51 support the decision to disperse before leaving. Paragraphs 30–42 supply the wet clothing, streaked glasses and uncertain bag damage. No book prose is shipped.

This begins after the assault. It does not claim that the earlier class, lunch or assault is playable. The player already has three months’ practice; this is not a new trigger or power reward. The one-minute action durations are authored pacing. Leaving first is an authored alternative. Witness reactions, attacks, travel home and subsequent chapters remain outside this slice. No public witness, retaliation, money, XP or confirmed destruction of the art project is inferred from the departure.

Changed implementation: [Taylor pack](../../src/world_packs/book_worm_lead_life.js), [focused tests](../../tests/worm_lead_opening.test.js), and the sole shared beginning registration hunk. That hunk also installs the separately owned, passing Alden beginning. Existing beginnings and saved definitions retain their own IDs and bytes.

| Check | Result and limit |
|---|---|
| `node --test tests/worm_lead_opening.test.js tests/super_supportive_opening.test.js` | Primary 7/7 passed. Taylor cancellation, physical branch difference, subsequent return, load and exhausted dispersal; Alden’s independently owned five checks. |
| Isolated [normal-entry replay](evidence/worm-opening-2026-11-26/replay.mjs) | Passed through ordinary visible Beginning controls, leave-first, Save/reload, return, disperse, native Export/Import; application errors `[]`. Exact input hashes are recorded in proof. This used the isolated headless compiler, not the normal desktop bundle. |
| `node --check src/book_world_beginning_registration.js`; scoped `git diff --check` | Passed. |
| `npm run check:arch` | Passed, existing grandfathered cycles/imports unchanged by this slice. |
| `npm run check:rules` | Final rerun passed after Alden’s wording correction. Warning-only unrelated rule findings and the existing private-pack stale glob remain reported by the command. |

The proof records the earlier mechanically identical Alden pack before its check-in description was reworded. The Taylor pack and registration bytes are unchanged. Rebuilt browser/persistence verification is still a distinct gate. No default build, full suite, browser launch or commit was run in this lane.

## Player-copy correction

The coordinator’s desktop replay found that source qualifications had leaked into Taylor’s arrival and action descriptions. Those descriptions now stay in Taylor’s day: wet clothes, streaked glasses, gathered insects, the door and the choice to send them outside. The choice label is now “Worm · Taylor Hebert”. Source scope and authored tuning remain in this receipt. The focused Taylor tests passed 2/2 again after this text change. [Final source identity](evidence/worm-opening-2026-11-26/final-source.json) distinguishes these bytes from the earlier native headless proof; no complete replay or new build was run for this copy correction.

The initial back-button trace correctly found a single writer, but missed its wrong input: `location_name_span` still says Village during a structured life. The coordinator reproduced both visible and accessible labels returning Village after Alden’s refusal and Taylor’s corridor departure. This was a place-owner error, rather than a mismatch between the two label properties.

## Structured place return label

[Center navigation](../../src/center_modes.js) now uses the active life’s observer-safe `view.place`, supplied by [the existing structured panel](../../src/structured_pack_ui.js). Movement updates button text and accessible label without repainting the navigation stack, changing focus or invoking stop callbacks. Named panel-to-panel destinations still take precedence. An inactive or destroyed structured panel clears the override, restoring the ordinary native place fallback.

`node --test tests/center_modes.test.js tests/structured_pack_ui.test.js tests/worm_lead_opening.test.js tests/super_supportive_opening.test.js` passed 32/32. The new regression checks a place change while the panel remains open, matching text and accessible name, retained focus, named destination precedence, and Village fallback. [Navigation source identity](evidence/worm-opening-2026-11-26/return-label-source.json) records this additional change separately. Rebuilt desktop confirmation remains the coordinator’s gate; no browser or normal build was run in this lane.

## Exact saved-edition compatibility

The prose correction changed both the pack content hash and the starting snapshot hash. Existing saves pin both. The earlier claim that copy alone preserved loading was wrong: the coordinator’s real old export was refused at startup.

The original Taylor definition was reconstructed byte-for-byte: its file SHA-256 `128c0904004d7f010ecf68bb1586e2495bd7085be29b46f0ba5380a4f8f223fb` matches the retained native proof. The [immutable before-copy fixture](../../tests/fixtures/worm_opening_before_copy.json) reproduces its saved content identity. The existing `compatibility.identityAliases` mechanism now declares the reviewed content and starting-snapshot mappings. Persisted IDs, receipts, inventory and physical swarm location are not rewritten.

The shared registration seam retains coherent, explicitly reviewed editions. `preserveCurrent` on the exact active pack alias retains the intervening post-copy content/start pair. `previousIdentities` can declare another verified historical pair, as needed for Alden’s original pre-lint export. These declarations activate when the present raw definition matches their exact `from` hash. Unmarked aliases retain their earlier behavior. No general stale-hash bypass was added.

| Taylor issued edition | Content hash prefix | Starting snapshot prefix |
|---|---|---|
| Original before-copy | `a6f920b8` | `ed278d9f` |
| Intervening lived-prose copy | `78e66816` | `41f262e0` |

[Exact compatibility source identities](evidence/worm-opening-2026-11-26/compatibility-source.json) retain full hashes. Canonical old/old and reviewed current/current pairs pass together. Crossed pairs, altered job duration, changed starting body, unexpected snapshot and unreviewed aliases remain blocked. Validation leaves the saved state and binding unchanged. A before-copy corridor save can return and disperse without duplicating a prior action.

The focused shared guard, beginning, Taylor, Alden and existing Harry registration/progression run passed **69/69**. Architecture, player-text and scoped whitespace checks passed. The separately owned Su Xiao beginning was also installed through the reserved registration import/choice hunk; no engine or contract content was changed by that integration. Actual rebuilt browser loading of the coordinator’s retained exports remains a distinct gate.

## Proposed next target: check the soaked backpack

**Original proposal, now implemented in the continuation below:** let Taylor inspect her backpack while it is physically within reach, instead of treating leaving the washroom as the end of the incident. Gestation 1.1 P051 explicitly has her retrieve it before going down the hall and taking a bus toward home. Gestation 1.2 P004–006 then shows her sort the contents on the bus and discover damage to her schoolwork and private practice notebook. That inspection supplies a concrete next problem: what can be recovered from her notes. It does not by itself complete a costume, award skill or commit her to going out as a hero. The chapter’s later change of plans at P028–029 remains a later player decision.

The smallest adapted action is **“Check your soaked backpack”**, with **“Keep it closed for now”** as the ordinary alternative. The source places the inspection on the bus; inspecting earlier in the washroom or corridor is a proposed timing variation justified by access to the same belongings. Reuse [the structured item/job/knowledge seam](../../src/structured_pack_definitions.js) and [Taylor’s pack](../../src/world_packs/book_worm_lead_life.js). At proposal time, gameplay held the bag’s possible damage as context and had no physical backpack item. The follow-up therefore needed to bind that source-qualified belonging explicitly, rather than claim the original corridor action had already transferred a native item. If the bag is left in the washroom, the existing return action should let her retrieve or inspect it. Sending the insects outside changes their own location, not the bag’s. Taking a bus should not teleport a swarm left at school.

**Replay gate:** from the ordinary start, prove inspection needs actual access to that one bag; leaving it behind blocks remote inspection and returning restores access. Keeping it closed or cancelling produces no newly confirmed damage record. Completing inspection records the observed damage once without destroying the notebook, granting a replacement or copying its contents into public dialogue. Repeated inspection and save/reload/import conserve the bag and notes. A new implementation must review the existing exact saved editions before introducing the missing physical bag, avoiding duplicate stock. No unseen witness, reputation event, worsening-damage timer, bus fare or salvage success is inferred. Any handling/travel duration remains an explicit authored default.

Source check for this note: held English EPUB, Gestation 1.1 member hash `f5f23995e7e8efc4c2b063d182583462feb9f4e9c541720d2bf771cfeb81eb9a` (P050–052 reread), and Gestation 1.2 member `worm_split_001.html`, SHA-256 `a0ed2a31378c848ea4dbacee0e2dcd8682da062e2718b20f9e1a2347b0195385`; all 29 nonempty paragraphs of 1.2 were directly read. This extends bounded reading evidence, not the playable frontier. The proposal pass made no runtime change, external research or paid call.

## Backpack and bus continuation implemented

The proposed target above is now implemented through the versioned [bus continuation](../../src/world_packs/book_worm_lead_bus.js). It retains the original beginning and both reviewed saved identities. Choose **the way home** in Beginning, then collect the source-qualified backpack in the washroom if wanted. Admission adds no stock. The real earned corridor save can return to the room to collect it; no fixture editing or inventory injection is required.

The backpack is one opaque native item. Inventory names and descriptions reveal no notebook or observed damage. Its contents travel with it as an indivisible bundle; a separate notebook item or nested-container engine was not introduced. The established item-plus-location custody pattern supports setting it down and retrieving that same bag. Inspection checks actual carried stock at start and completion. Leaving it at school does not stop Taylor walking, boarding, riding home or returning. Neither travelling nor cancelling inspection confirms the condition of the contents. Successful inspection records what Taylor sees in her own knowledge and report; it creates no public witness, reputation, reward, replacement notebook or completed later hero decision.

The first preview incorrectly made the backpack a prerequisite for leaving school. That arbitrary gate was removed. The neutral ride action is now **Ride toward home**. A pending-load test also found that a location-independent inspection did not match the existing exact saved-job guard; inspection now has place-bound command variants, without weakening that guard. A shared identity helper was extracted unchanged and reused by extension admission so a previously issued post-copy receipt can take this pinned continuation without rewriting its content/start identities.

| Check | Evidence and scope |
|---|---|
| Focused shared/title tests | **66/66 passed**; [command output](evidence/worm-bus-2026-11-26/focused.log). Covers cancellation, physical access, set-down/retrieval, bag-free travel and return, private observation, pending restore, non-respawn after disposition, and the reviewed post-copy base. |
| Ordinary fresh native entry | [Fresh proof](evidence/worm-bus-2026-11-26/native-fresh-proof.json): Village → Beginning → Taylor → dispersal → continuation → pickup → bus inspection → Save/reload and native Export/Import. One bag, observed contents and dispersal retained; errors `[]`. [Replay](evidence/worm-bus-2026-11-26/replay-fresh.mjs). |
| Real earned corridor save | [Earned proof](evidence/worm-bus-2026-11-26/native-earned-left-bag-proof.json): unchanged input SHA `ef11bffa5f5f536cf3b77e6aeb5f4be6e65493e1f8d920665f8bf97fbe305dba`; collected/set-down bag → bag-free bus journey → Save/reload/native Export/Import → return → retrieve the same bag → pending inspection reload/cancel/retry. Final bag count one, original insects still in washroom, purse unchanged, errors `[]`. [Replay](evidence/worm-bus-2026-11-26/replay-earned.mjs). |
| Normal desktop packaging | Candidate `npm run build` passed. The coordinator’s primary build reproduced exact bundle `6cd80403907c3c913edcf3c85c02dc0e917b5a0a2e9dc2e922c2f5b7d6ef1b69`. [Guarded adoption identities](evidence/worm-bus-2026-11-26/source-identity.json). |
| Built-in desktop observation | Coordinator replay at **1280×720** confirmed the original export, admission, bag-free walk/board/ride and arrival/return option on the corrected bundle. Earlier held-bag replay confirmed the inspection report. Agent-verified, not human-reviewed. |
| Structural/text checks | Candidate architecture and player-text checks passed; coordinator reports 32 adjacent title/registration tests and primary architecture passed. Final wave full-suite result belongs to its coordinator receipt. |

Source remains the held English Gestation 1.1 P051 and 1.2 P004–007, with the member hashes recorded in the proposal above. Collection/handling one minute, school walk two, boarding one, ride ten and separate inspection two are authored pacing defaults, not canon measurements. The return journey is a proposed playable alternative; fare and a continuous bus timetable remain unmodeled, and no fare is charged. Bus movement uses the existing timed-relocation phases rather than intermediate road positions. The insects retain their previously settled school/outside location; this does not claim a full autonomous swarm ecology. No later chapter or costume readiness is completed automatically.

Six guarded paths were adopted after the prior full suite ended; no primary build was run by this lane. Runtime and tests were frozen before the next full suite. The two isolated test servers and adopted candidate were retired after saving these proofs; the primary bundle is the retained playable build.
