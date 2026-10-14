# Inheritance and legacy

Evidence keys refer to ILSpy text under `~/.codex/research/taiwu/extract/`, from build 25845203. Labels: shown means inspected code; stated means shipped help; inferred means a bounded interpretation. None means exercised gameplay.

## F1: Choosing another life

Shown: `FindSuccessorCandidates`, `CalculateSuccessorCandidates` and `ConfirmChosenSuccessor` in TaiwuDomain separate selection, temporary-candidate conversion, data transfer, actor replacement, legacy effects and post-transfer health adjustment. Normal candidates come from companions; the visible filter requires age 16 and an eligible template. The random route finds or creates male/female candidates in the current area. It does not require a child. A previous Taiwu can be selected, as the code explicitly checks that case for a stat.

## F2: Transfer matrix

| Channel | Observed behavior | Evidence |
|---|---|---|
| Successor's existing learned skills | Cleared before predecessor data arrives | `CharacterDomain.PrepareTaiwuInheritor` |
| Martial knowledge | Copies combat skill instances, rekeys actor ID, activates read pages, copies loadout and attainment panels | `TaiwuDomain.TransferTaiwuData` |
| Life skills | Clears successor list and adds predecessor's list | same |
| Mastery and proficiency | Uses separate Extra handlers | same; downstream handlers unread |
| Inventory, resources, XP | Adds to successor and clears predecessor | same |
| Equipment | 17 slots; slot 4 clothing treated specially; successor clothing retained, predecessor's non-KeepOnPassing clothing may remain with predecessor | same; clothing table semantics not exhaustively read |
| Warehouse/village | Warehouse item ownership keys use settlement ID; transfer does not rebuild village | `WarehouseAdd`, transfer; persistence continuity inferred from stable domain identity |
| Internal force | Current and extra force, base/extra allocations, allocation progress and consummate level transfer | same |
| Traits | Only traits flagged `InheritableTransferTaiwu` move by the inspected generic loop | same |
| Companions | Normal route reassigns leader IDs; random route changes party membership and joins successor | same |
| Information | Dedicated transfer call | `Information.TransferInformation`; internals unread |
| Bonds/favour | Dedicated handlers for special groups and named story systems; only fixed templates 831/833 copied in fixed-character favour handler | same; `CharacterDomain.TransferFixedCharacterFavorability` |
| Existing successor body | Health is rescaled after legacy to retain its prior health fraction | `ConfirmChosenSuccessor` |
| Prior Taiwu | Dies if dying flag is set; otherwise leaves group through a separate branch | transfer |

Inferred: do not model inheritance as cloning the old actor or merging two whole characters. Copying martial mastery does not prove copying biological aptitude, romance or every debt. The transfer has reset calls for several interaction and exploration systems, so even role-level continuity is selective.

## F5: Legacy comes from the life lived

Shown: `AddLegacyPoint` takes a source row's BasePoint, the requested award percent, a world-creation multiplier and a building bonus. `DirectlyAddLegacyPoint` clamps to the remaining source cap, tracks award count, increases the spendable total and offers randomized legacy choices when half/full cap thresholds are crossed. There are 53 source rows, IDs 0–52, counted without loading the assembly.

Stated: shipped `Yihuidianshu.tsv` groups actions such as relationships, victories, new skills, reading intact/damaged pages, breakthroughs and teaching villagers. `Shengpingyihui.tsv` describes spending on attributes, lifespan, talents, internal force and other legacies. `Yihuijiacheng.tsv` describes world-setting bonuses. These are descriptions of this game, not mandatory YAIRPG reward tuning.

Shown: selected legacy records have fields for cost, uniqueness, weights and group/level. `ApplyLegacyAffect` supports features, property deltas, behavior, buildings/core items, regional spiritual-debt change, newborn growth queues, sect supporters, elemental proportion and poison immunity. Legacy can affect the world and community, not just the new protagonist.

Caution about ordering: `CompletePassingLegacy` converts remaining points to resource 7 at integer division by four, while `ApplyAndResetLegacy` clears the budget. The frontend invocation order was not traced. Therefore the existence of both operations is shown; the exact player-visible leftover payout timing remains open.

Proposal implication P2: author explicit transfer channels and show a review of what passes before selection. Keep world policies local. Taiwu's permanently unique choices and caps do not become fixed once-only YAIRPG restrictions.
