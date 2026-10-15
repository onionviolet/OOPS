# Dialogue, voice and remembered contact

Official source only; [S01-S05, S10, S20-S21, S25-S27](SOURCES.md). **SHOWN** means read C/text structure; all YAIRPG uses below are **INFERRED PROPOSALS**.

## D1: What the conversation engine actually stores

`commglue.h:Response` passes a stable phrase reference and C callback to `comm.c:DoResponsePhrase`. The latter stores the response reference, visible text and function pointer. `SelectResponse` supplies that reference to the selected callback. Branches compare `PLAYER_SAID`, read state, queue `NPCPhrase` and register another menu. This is a directed graph implicit in imperative C. A phrase record is not a complete node, and a registration site is not a distinct reachable edge.

`HailAlien` loads the resource table, invokes encounter callbacks and destroys the table on exit. `DISABLE_PHRASE` edits the first character of a loaded phrase; `PHRASE_ENABLED` tests it. That suppression is encounter-local because the loaded table is disposed, unlike `SET_GAME_STATE` manner/visit/knowledge fields. Topic stacks can also be local static variables or retained flags. A collector must classify each actual storage location before calling it relationship memory.

`LOCDATA` carries portrait/font/colors, text width/alignment, music and animation descriptors. Ambient entries can have block masks and separate talk/transition frames. Text and presentation cooperate, but they do not own all branching or grants. Some NPC phrase callbacks occur at playback boundaries; those cannot be assumed to be a transactional gameplay API.

**YAIRPG:** P19 should author over existing scoped Ink and native staged hosts. The inspected `commitInkNarrativeAction` binds response ID, sequence, clock, participant scope, scene and revision, obtains a checked host plan, then advances the narrative cursor in that same plan. Retain this stronger payment boundary. Do not imitate mutation during redraw, subtitle playback or table suppression.

## D2: Different voices have different useful contact

| Voice/context | SHOWN structure and bounded reading | What matters for YAIRPG |
|---|---|---|
| Spathi, `spathic.c:SpathiOnPluto/SpathiAllies` | Fear, evasive wording and humorous self-preservation accompany threats, reassurance, recruitment and questions. Local topic exhaustion differs from retained visit and manner flags. Allied versus neutral meetings choose different greetings/options. | One local voice can supply useful cooperation without becoming a universal affinity meter. K6/K20/K27/K31, P19. |
| Melnorme, `melnorm.c:DoBuy/DoSell` | Formal merchant wording, procedural first explanations, numerical speech and offers are bound to actual credit, capacity, technology and information state. | A conversation can be the service UI, with actual stock and a clear refusal. K8/K11, P18/P19. |
| Syreen, `syreenc.c:NormalSyreen` | Authored staged disclosure distinguishes suspicion, asking for proof, carrying evidence and changed cooperation. Branches retain knowledge and progress flags. | Learning a story does not manufacture the object that proves it. K11/K23/K31, P11/P19. |
| Orz, `orzc.c`, external Orz text | Translation framing and marked terms alter interpretation; manner and visit state alter response and greeting choices. | Keep uncertain translated meaning and speaker intent separate from author truth. Do not expose hidden predicates as explanatory tooltips. K20/K30/K31. |
| Arilou, `arilouc.c:ArilouHome` | Intimate, elliptical address accompanies layered disclosures and an item exchange that changes travel means. | A powerful or well-informed speaker still reveals through supported contact and actual offers. K11/K15/K31. |
| Zoq-Fot-Pik, `zoqfotc.c` | Multiple speakers alternate short phrase segments with speaker callbacks, rather than one neutral paragraph. | Group banter needs speaker identity and rhythm. A single text table need not imply one NPC. K6/K20/K27. |
| Slylandro home, `slyhome.c:Intro` | Return greetings and visitor interest distinguish a home contact from the similarly named remote probe conversation. | Dispatch by actual context and participant, not just a species name. K6/K14/K20. |
| Starbase, `starbas.c:CheckBulletins/SellMinerals` | News, advice, unloading and gifts share the encounter but have different eligibility and repeat paths. | Replayable explanation and consequential payment need separate receipts. K8/K12/K23, P20. |

These are selected authored traits, not claims that every member of a species has a simulated personality. Full prose is retained privately. None of the alien wording is proposed as YAIRPG dialogue.

## D3: A paid fact has a second consumer

`melnorm.c:DoBuy` checks and deducts information cost before calling `AlienRaces`. The information arrays contain 8 current-event, 16 alien-race and 9 history entries. Those arrays are offer sequences, not randomized story generators. Selected alien reports set password or destruction-related knowledge flags; stacks record advancement. Melnorme technology offers use `GetNextTechForSale` and actual `HasTech` state rather than assuming an unrelated old purchase counter proves ownership.

`spahome.c` reads the learned password/home-visit state. `syreenc.c:NormalSyreen` combines knowledge flags to offer an accusation, then separately checks whether one of the three physical evidence flags is on the ship before offering proof. The useful chain is merchant or inquiry -> retained knowledge -> newly available local request -> evidence-dependent continuation. It is not merely a paid lore paragraph.

**YAIRPG:** UQM-P2 extends P11/P19 with one existing second consumer. Retain speaker/source/time/confidence in native knowledge, actual evidence in custody, and the consequence in one staged plan. Check a control that knows the claim without the object. A counterpart in a new instance does not inherit the prior speaker's memories.

## D4: News replay can be mechanically dangerous

`starbas.c:CheckBulletins` has a first-delivery mask and a repeat route. Some eligibility branches also grant escorts only when not repeating. `ByeBye` merges the current delivered mask into retained `STARBASE_BULLETS`. This is concrete evidence that news eligibility, delivery history and any reward must be traced together. It is not proof of atomic settlement: the source mutates globals directly.

**YAIRPG:** P20 can re-read a delivered record without replaying a gift. One recipient's delivered report does not authorize everyone to know the whole campaign state. P24 must restore cursor, host effects and retained receipt coherently.

## Reading boundary

All 27 C modules and 27 phrase tables were indexed and retained; selected bodies/voice samples above were read. The call-site index includes surrounding source, not solved predicates. Every nested AND/OR, cross-speaker fact, rare hostility/refusal path and full dialogue prose remains a larger semantic review. No audio was played or game launched.
