# bitburner: three deeper systems

Ranked by payoff for this aspect backfill, especially earlier text/save/authoring gaps. These are targeted traces. Full semantic completeness and future YAIR selection are separate.

## D1 Message delivery and retained knowledge

Prior status: Previously undocumented text path.

Trace: threshold and recvd predicate -> sendMessage -> optional display -> retained filename -> faction rumor; first threshold also adds a program.

Evidence: https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Message/MessageHelpers.tsx

Limit: Popup suppression does not suppress the storage/rumor steps in the inspected sender. A UI preference must not silently remove earned knowledge. Other callers not fully read.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D2 Go next-turn lifecycle

Prior status: Previously undocumented minigame/AI.

Trace: handleNextTurn -> getMove promise -> compare board identity/move count -> pass or waitCycle -> recheck -> makeMove.

Evidence: https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Go/boardAnalysis/goAI.ts; https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/Go/SaveLoad.ts

Limit: Shown stale-result guards and idempotent turn handling. All heuristics, save-field validation and rewards remain partial; no claim of optimal AI.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

## D3 Save transport and import boundary

Prior status: Prior save finding extended.

Trace: JSON constructor check -> gzip or base64 -> await storage -> notification; import optionally adjusts settings then stores and reloads.

Evidence: https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/utils/SaveDataUtils.ts; https://github.com/bitburner-official/bitburner-src/blob/1da7316ffd9d281b45a86c4c54ec532276557892/src/SaveObject.ts

Limit: Encoding compatibility and application-level migration are separate. No global transaction/rollback established.

PROPOSAL: route this pattern through the existing owners named in ASPECTS; no new parallel scheduler/save store and no automatic source adaptation.

