# Academagia deep systems sweep, 2026-10-14

Academagia has more implemented systems than the first web summary suggested. This pass traces fifteen high-payoff flows through authored data, exact rules, connected consumers and saved state. Its strongest lessons for YAIRPG are material-to-tool production, useful companion expertise and starts that grant real means. These are **PROPOSALS**, not accepted decisions or implemented gameplay.

Status: **PARTIAL**. The fifteen selected source flows are documented; the entire engine and content are not exhausted. No game or Windows executable ran. No saves, live cache, bottles, installation or YAIRPG source were touched. All repo writes are in this directory. Build identity 2453605 is inherited from prior capture, not a refreshed Steam installation claim.

## Corrections and extensions first

| Code | Prior statement or gap | This pass's result | Evidence |
|---|---|---|---|
| F1 | Web REPORT: breadth mainly content rather than many systems | Narrow that judgment. Sixty-one named systems/helpers and 112 tables were already inventoried; this pass documents distinct crafting, enchantment, astrology, delivery, emotion and charge rules. Counts are not counts of independent games | [SYSTEMS](SYSTEMS.md), [family map](FAMILY_MAP.json), prior SYSTEM_INVENTORY |
| F2 | Web F15: ten attribute points | Creation has ten common points and five attribute-increase points, attributes 1..3. Backgrounds use the shared budget and may refund points through negative costs | DS04; CharacterCreationSystem |
| F3 | Web F15: familiar bonus capped at half Bond | That is not the reviewed adventure/event contribution rule. It adds actual familiar skill; the inspected familiar skill-increase path caps at min(10,Bond+1). Other growth paths and combat remain qualified | DS03; SkillSystem.ExpandLevel; StorySystem.GetCharacterPlusFamiliarSkillLevelValue |
| F4 | Vendetta entry was unread | Declare Vendetta has an empty prerequisite but a Low Relationship target selector, resolving to relationship ≤−5. The low-level EnterToVendetta method does not repeat it | DS12; action ID and XML path retained |
| F5 | Per-college merit ladders were unread | Shared Merit records are claimed by descending college score groups; ties are processed before global claim publication. Gates have both AND and OR across college selections. Full static matrix saved | DS13; [MERIT_MATRIX](MERIT_MATRIX.md) |
| F6 | Root-array membership implies complete save coverage | Narrow further. AbilitySystem inherits context-bucket saving; ActionSystem overrides it without saving those buckets. Enchantment saves committed/free components but omits selection/energy maps | DS02/DS11/DS15; shown stream boundaries, no live loss experiment |
| F7 | Full spells/duels/crafting were one unread bundle | Craft/enchant and charge flows now traced; duel/combat/Rimbal and complete spell interception remain open. Casting validates multiplicity, while enchanting's candidate-spell test uses membership | DS01/DS02/DS10; prior spell D3 retained |
| F8 | Prior adventure analysis said bulk ledgers were in repo | Coordinator EXCLUDED_FROM_GIT.md is the current routing correction: five bulk ledgers are under academagia-2/repo-excluded. Reuse them privately, not as missing public deliverables | [prior exclusion note](../pass-2026-10-14-adventures/EXCLUDED_FROM_GIT.md) |

Shown = inspected decompiled code or shipped fields. Stated = prior descriptions, including web claims being reconciled here. Inferred = passive profile reconstruction or design interpretation. Source anomalies are source observations, not demonstrated native failures. [SYSTEMS](SYSTEMS.md) uses exact methods and fields; the private source index adds hashes and line locators.

## Ranked PROPOSALS

Local DS-P codes below differ from synthesis P01-P25. Every proposal remains optional under live owners, canon-first direction and the one-realm/one-prestige milestone. No source once-only policy becomes a universal YAIRPG restriction. Idle work remains a supported route where the world's actual conditions allow it.

| Rank / code | Useful original YAIRPG result | Owners and routing | Source |
|---|---|---|---|
| 1 / DS-P1 | Make one material choice and one finishing choice produce an object with a useful different downstream job | K9/K13; synthesis P02/P18; [production palette](../../../MODULAR_PRODUCTION_CHAINS_CONSIDERATIONS_2026-10-14.md), crafting palette | DS01 |
| 2 / DS-P2 | A present companion's trained skill enables a named solution, with a clear contributor and a viable solo alternative where fitting | K6/K3; P06/P09; [characters](../../../CHARACTERS_AND_WORLD_EVENTS.md), life-sim | DS03 |
| 3 / DS-P3 | A world-specific start grants actual tools, contacts and learning routes, with a causal dependency explanation | K4/K6; P15/P05; [life-sim](../../../LIFE_SIM_NORTH_STAR.md), starts and genetics palettes | DS04 |
| 4 / DS-P4 | A maker's knowledge and material fit become a durable item faculty with separate reserve and recovery | K3/K9/K11; P02/P04/P17; [weaponcraft/runes](../../../WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md), ability and technology owners | DS02/DS10 |
| 5 / DS-P5 | A paid order has a real object, saved arrival time and useful status between payment and use | K8/K9; P18/P04/P13; production and means/appraisal | DS09 |
| 6 / DS-P6 | One relationship scene reacts to actual preference, accepted custody and remembered incident independently | K6/K7; P19/P12/P25; characters and [dialogue](../../../worlds/DIALOGUE_AND_INTERACTIONS.md) | DS05/DS12/DS14 |
| 7 / DS-P7 | An emotion has a cause, a usable effect and a fitting exit that survives reload without replaying entry rewards | K6/K8; P25/P17; characters and life-sim | DS06/DS11 |
| 8 / DS-P8 | A recurring environmental condition changes a real local activity, with a visible forecast or calendar clue | K2/K5/K12; P13/P14; [world core kit](../../../worlds/WORLD_CORE_KIT_2026-10-14.md), life-sim and ability owners | DS07/DS08 |

Future UI target: desktop 1440×900 with recipe/input/finished use, companion contribution or pending delivery visible beside the relevant action. Mobile optimization is deferred. No UI implementation or screenshot claim is made. Specific future execution checks and excluded scope are in [IMPLEMENTATION_PACKETS](IMPLEMENTATION_PACKETS.md).

## Inventory and owner gaps

[FAMILY_MAP.json](FAMILY_MAP.json) preserves all 61 named system/helper rows, 57 namespaces, 112 tables, 50 UI namespaces, 16 installed DLL rows and 24 inherited checkpoint table gaps: 320 entries. K codes, synthesis packets and topic owners are inferred routing, not a claim that those owners implement the source mechanic. Cross-kind duplicates deliberately retain accountability. [UNREAD.md](UNREAD.md) groups named-only surfaces by family and gives inherited-row dispositions.

All gameplay families have broad topic owners. Two **specific owner gaps** were identified within the checked set: a dedicated celestial-cycle contract and a dedicated authored team-sport rules contract. Astrology maps broadly to K2/K3/K12 and Rimbal to K10/K13, but those broad codes do not supply the detailed contract. This is not an exhaustive absence claim across the repo. Dependency internals are marked not-applicable rather than invented gameplay gaps.

Body, lineage, technology and many worlds need a boundary: backgrounds and breed labels do not establish genetics, reproduction or ancestry; knowledge/research is not a whole technology economy; craft/enchant is not a full industrial network; regions are not world-crossing carriers. Existing YAIRPG palettes remain authoritative. No source finding turns those deferred systems into a gate for the current slice.

## Saved detail and checks

New [private reference area](/Users/weiwei/.codex/research/ds-academagia/extract) holds complete selected-system tables in three separate static profiles, full merit gate/reward closures, source hashes/method locators and the prior-artifact read ledger. Earlier full writing, conditions and source remain in the read-only [decompile area](/Users/weiwei/.codex/research/academagia-decompile/extract) and [text corpora](/Users/weiwei/.codex/research/academagia-aspects/extract). No raw prose, code, assets or bulk game data enter this output directory.

Passive validation checks JSON, exact inventory identities/counts, fifteen system sections, owner/packet references, static table counts, private corpus decoding and cited method presence. [TOOLING](TOOLING.md) records commands and limits; [CHECKPOINT](CHECKPOINT.md) owns final status and gaps. No gameplay, rebuilt YAIRPG behavior, real persistence, director acceptance, commit or deployment is claimed.
