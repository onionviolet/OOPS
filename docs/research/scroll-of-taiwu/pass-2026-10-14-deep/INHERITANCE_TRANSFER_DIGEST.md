# Succession handler coverage

Shown static bodies. New extracts are under `~/.codex/research/taiwu-2/extract`; prior source types remain under `~/.codex/research/taiwu/extract`. No personal saves accessed. This trace covers direct transfer calls and key downstream semantics, not every special-effect/event listener.

## I1: Confirmed call order

`Game.Views.LegacyPassing.ViewLegacy.ConfirmInherit` submits SelectLegacies, world-setting changes, CompletePassingLegacy, then ConfirmChosenSuccessor for the same-archive route. The cross-archive branch triggers SelectLegacyComplete instead and is not covered by the same claim.

`prior:TaiwuDomain.CompletePassingLegacy` awards resource7 equal to remaining legacy points divided by four to the current Taiwu. `ConfirmChosenSuccessor` archives the life summary, calls TransferTaiwuData, switches the Taiwu actor, updates guidance/consummate state, applies and resets chosen legacies, restores successor health proportion against changed capacity, reveals location and emits PassingLegacyComplete. Thus the normal UI pays before point reset and before the actor switch; the resource then participates in transfer. These are queued calls, not an observed UI execution or proof of atomic crash recovery. The backend payout method has no standalone once-only guard in the inspected body.

## I2: Transfer inventory

| Channel | Shown result and exact source |
|---|---|
| Successor preparation | `prior:CharacterDomain.PrepareTaiwuInheritor` clears learned skill lists, combat instances, equip effects/configuration, looping, force allocation and selected features; releases successor from captivity; sets predecessor/successor favor to30000 both ways. It does not wipe every family or social relation. |
| Learned knowledge | `prior:TaiwuDomain.TransferTaiwuData` serializes combat-skill copies with the new owner ID, copies life skills, equips copied loadout, reinstates effects and looping choice. |
| Mastery | Extra mastered list is removed from old and set on new. `ExtraDomain.TransferTaiwuProficiency` deletes successor-only proficiency keys, moves predecessor values and replaces overlapping values. Not an additive union. |
| Equipped/owned objects | Inventory owner links move, old inventory becomes empty. Successor clothing is retained in the transferred equipment array; predecessor clothing handling consults KeepOnPassing. Legendary books have an explicit remove/add path with a temporary Taiwu ID switch. |
| Artifact affinity | `ItemDomain.TransferTaiwuMysteryCompatibility` accumulates predecessor compatibility into successor compatibility, clamps to999999999 and removes the old key. This channel is additive, unlike proficiency. |
| Resources/XP | Added to successor and cleared on old actor. Settlement warehouse remains settlement-owned. |
| Ordinary information | `InformationDomain.TransferInformation` first removes destination ordinary/secret information, then rekeys ordinary source information and removes the old ordinary key. |
| Secret knowledge anomaly | Same handler copies source CharacterKnownSecret into destination via EditCharacterKnownSecret, then removes **destination** CharacterKnownSecrets. Edit helper demonstrably writes/adds that destination key. Record the exact sequence; do not claim secret knowledge successfully transfers. Runtime intent, repair listeners and impact are unverified. |
| Party | Normal route changes leaders and calls captive transfer. Random route disbands members through explicit leave operations and joins the new actor. |
| Captives | `prior:CharacterDomain.TransferKidnappedCharactersToTaiwuSuccessor` changes resistance, creates relation, changes kidnapper ID and moves the records, then clears old captive state. This handler is called only in the normal branch here. |
| Special group | `TransferSpecialGroup` clears/removes destination nonintelligent members when requested, reassigns predecessor members' leader, moves membership and clears old key. Its use of the destination collection deserves runtime verification when absent; no repair is proposed by this research. |
| Story favor | `prior:WorldDomain.TransferXiangshuAvatarRelations` preserves separate directional favor for existing task-linked actors. `ExtraDomain.TransferRanshanThreeCorpsesRelations` uses the story actor's old-directed favor for both new directions. TransferGearMateFavorability likewise writes the old directed favor symmetrically if valid. `prior:CharacterDomain.TransferFixedCharacterFavorability` targets templates831/833. |
| Work commitments | `ExtraDomain.TransferTaiwuArtisanOrder` walks old subscriber orders backward and retargets each order through SetArtisanOrderSubscriber. This is ongoing work transfer, not merely completed goods. |
| Force/body traits | Current and extra force, base/extra allocations, allocation progress and consummate level copy. Poison immunity bits transfer, relevant existing poison is cleared, old immunity removed. Only features flagged InheritableTransferTaiwu move. |
| World/session cleanup | Clears monthly events, resets sect exploration, removes configured legacy-passing adventures, shrine buys, interaction/love state, wanted interaction flags, cooldowns and prenatal bonus; calls profession death hook. These are selective resets, not a world reset. |
| Predecessor | Dying route removes from party and calls MakeCharacterDead; other route leaves party and raises infection change. Successor gets institution grade/principal status, villager-role records and alertness cleanup. |

## I3: What is not universal inheritance

The direct body does not enumerate all ordinary relation keys and transplant them. A successor keeps their own social identity subject to the named exceptions above. Secret knowledge has the anomaly above. Normal/random/cross-archive policies differ. NPC estates use GenerateBequest, not this player succession transaction. A source-specific cap or PermanentlyUnique flag is not a YAIRPG design requirement.

Unclosed downstream work: every listener raised by transfer, profession death-specific effects, full cross-archive packing/unpacking, all generic relation cleanup during death and crash/resume behavior. These remain explicit in CHECKPOINT.
