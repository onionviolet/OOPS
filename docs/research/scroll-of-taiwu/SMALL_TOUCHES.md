# Small touches

All adaptation entries below are PROPOSALS. Source observations are shown in inspected build 25845203 code; no running-game behavior is asserted. None is a new mandatory global rule.

| ID | Source observation | Evidence | Proposed original touch |
|---|---|---|---|
| T01 | Successor can be an apprentice, not just offspring | `TaiwuDomain.FindSuccessorCandidates` | P2: give each candidate a visible relation and local eligibility reason. |
| T02 | Existing successor learning can differ from inherited learning | `CharacterDomain.PrepareTaiwuInheritor` | P2: preview replacement, preservation or combination according to the world policy. |
| T03 | Prior protagonist need not be dead | `TaiwuDomain.TransferTaiwuData` | P2: let an authored retirement remain a different event from death. |
| T04 | Equipment has actor-specific exceptions | `TaiwuDomain.TransferTaiwuData` | P2: a uniform or personal garment can have its own disposition. |
| T05 | Settlement possessions have a different owner | `TaiwuDomain.WarehouseAdd` | P2: show household stock separately from carried items. |
| T06 | Knowledge and proficiency have separate transfer calls | `TaiwuDomain.TransferTaiwuData` | P2: preserve both explanation and effective use, where the world allows. |
| T07 | Inherited life-earned choices can affect the community | `TaiwuDomain.ApplyLegacyAffect` | P2: allow a fitting legacy to help a school or home, not just a stat. |
| T08 | Legacy awards have causal source categories | `TaiwuDomain.AddLegacyPoint` | P2: show which lived deed created an available legacy option. |
| T09 | School support is an aggregate | `Settlement.CalcApprovingRate` | P1: show known supporters and institutional standing separately. |
| T10 | School-to-school relations have their own matrix | `OrganizationDomain.GetSectFavorability` | P1: author a local cross-school consequence instead of assuming personal dislike. |
| T11 | Support can improve study rather than only unlock it | `TaiwuDomain.CalcReadingSpeedSectApprovalFactor` | P1: an accepted sponsor can offer useful study support. |
| T12 | Cultural skill can help understand a method | `TaiwuDomain.GetAttainmentWithSectApprovalBonus` | P1/P3: a fitting craft or scholarly skill creates an alternate learning advantage. |
| T13 | A manual can hold direction variants | `TaiwuDomain.UpdateCombatSkillBookReadingProgress` | P3: keep interpretation separate from the physical copy. |
| T14 | Earlier knowledge gaps slow later study | `TaiwuDomain.GetReadingSpeedBonus` | P3: name the missing known foundation rather than show only a low rate. |
| T15 | Reference copies repair the effective page state | `TaiwuDomain.GetBaseReadingSpeed` | P3: another copy can help without erasing original damage. |
| T16 | Strategies have page-local slots | `TaiwuDomain.SetReadingStrategy` | P3: preserve per-section study choices and their expiry. |
| T17 | Study may wear both primary and reference copies | `TaiwuDomain.MakeReadingProgressActuallyWork` | P3: preview item costs and explain why a queue pauses. |
| T18 | Rereading remains useful | `TaiwuDomain.GetExpByRereading` | P3: allow fitting repeat mastery or teaching preparation. |
| T19 | Active study and monthly study differ | `TaiwuDomain.ActiveReadOnce; UpdateReadingProgressOnMonthChange` | P3: intervention can accelerate a queue without making it compulsory. |
| T20 | Force training has reserve and allocation outputs | `CombatSkillDomain.CalcNeigongLoopingEffect` | P5: show the useful consequence of each output independently. |
| T21 | Birthday aging can differ from physiological aging | `Character.OfflineIncreaseAge` | P6: use the world/body clock policy, not one universal lifespan timer. |
| T22 | Worker formulas can use sum, maximum or average | `BuildingDomain.GetBuildingAttainment` | P4: explain whether a task needs one expert or joint labor. |
| T23 | Maintenance uses a complete resource basket | `BuildingDomain.UpdateBlockMaintenance` | P4: avoid half-paid upkeep when a required input is missing. |
| T24 | Full output storage can stop more work | `BuildingDomain.OfflineUpdateShopManagement` | P4: show capacity and useful collection/rerouting choices. |
