# Warsim deep systems sweep

2026-10-14. Lane `ds-warsim`. **Status: PARTIAL.** Static native research, with fifteen deeper system sections and the full remaining inventory saved.

## Corrections and extensions first

| ID | Earlier gap or tempting interpretation | Result and evidence |
|---|---|---|
| C1 | QuestGenerator's value consumer was unread | **Extend, SHOWN:** ProtofolkTribe calls it after a community defeat and credits questItemValue directly to gold. That route is loot valuation, not a proved quest journal or physical inventory item. [S08](SYSTEMS.md#s08-protofolk-community-states-and-immediate-loot) |
| C2 | Monster feeding and SmallHaven recruit reset cadence were unread | **Extend, SHOWN:** RefreshPhase clears all three Fed flags and SmallHavenRecruit. These are renewable on paths running refresh; no permanent once-only rule follows. TravM has a shown wagon-growth reader, but its reset is still unread. [S06](SYSTEMS.md#s06-monster-care-joins-stock-training-and-public-reaction), [S15](SYSTEMS.md#s15-battle-aftermath-and-renewable-availability) |
| C3 | Nobility/adventurer companion layouts were only paths | **Extend, SHOWN:** noble writer has eight values per record and race/name/portrait joins. Adventurer generation writes a separate group roster, but six unresolved switches prevent full schema/distribution claims. [S02](SYSTEMS.md#s02-noble-rosters-as-generated-persistent-records), [S03](SYSTEMS.md#s03-adventuring-groups) |
| C4 | A clan or tutoring helper might imply lineage or learned knowledge | **Qualify, SHOWN:** GoblinClan is a lexical name builder; Tutoricroll selects explanation depth with local controls. Neither proves genetics, parentage, skill acquisition or technology research. [S13](SYSTEMS.md#s13-tutoring-is-selectable-explanation-depth), [S14](SYSTEMS.md#s14-initial-faction-budgets-and-procedural-clan-names) |
| C5 | Monster strength alone might explain combat | **Extend, SHOWN:** generated ability IDs have combat readers, mood changes starting HP and trainer skill applies a separate multiplier. A stock-gate inconsistency is retained: one feed branch tests YourTribal but decrements AslonaTotem. [S06](SYSTEMS.md#s06-monster-care-joins-stock-training-and-public-reaction), [S07](SYSTEMS.md#s07-monster-combat-reads-generated-abilities) |
| C6 | Inventory-only implies no YAIRPG owner | **Correct the mapping inference:** all checked families have a broad existing owner. LIFE_SIM_NORTH_STAR explicitly covers minigames; thematic UI explicitly covers ambient sound and mute. Detailed rule leaves can still be missing. No wholly ownerless family was established. [Inventory](INVENTORY.md) |
| C7 | Extras text files had only count/hash coverage | **Extend, SHOWN/STATED:** all 38 were retained and classified as static art, design and cheat references. Their author notes are not proof of active native consumers or a mod API. [Reference closure](SYSTEMS.md#extras-cheap-closure-of-the-static-reference-files) |

Warsim's useful depth comes from local state that several activities read. A community can change its leader state, population and later menu; an encounter can fill a saved ally slot; body parts can alter a fight. The source also uses fixed global slots, compiled dialogue and external mutable rosters. Those are implementation facts to learn from, not a storage architecture to import.

**F1 SHOWN:** the sweep retains all 32 prior system families, 143 helper entries, 255 table entries and 28 inherited unread rows in [FAMILY_MAP.json](FAMILY_MAP.json). They are overlapping catalogs, not 430 independent gameplay systems. Each has family, coverage and K/packet/topic-owner routing. [INVENTORY.md](INVENTORY.md) lists the family-level gaps in plain language.

**F2 SHOWN:** twelve new REA queries returned pseudocode and nine focused direct Ghidra queries returned output. Assembly for all 21 targets and selected byte-decoded constants support the fifteen bounded system reads. An `ok` response is not an all-path certificate. Full adventurer switches and multiple lifecycle consumers remain unread.

**F3 INFERRED:** the highest payoff is one causal join per slice: actor or body fact → lawful action → changed local result → durable later reader. This pass does not establish deep hereditary biology, a tech tree, material production chains or general NPC life planning in Warsim. Those YAIRPG themes already have owners and need stronger sources for their missing details.

## Ranked PROPOSALS

These are options, not accepted direction, assignments or implementation gates. Keep reasonable repeats reachable. Existing one-realm/one-prestige scope, knowledge boundaries and current owners govern. No owner file was edited.

| Rank / code | Original YAIRPG proposal and visible payoff | Existing owner / synthesis / kit |
|---|---|---|
| 1 / WS-P01 | Give one existing companion a paid activity that changes a functional body/skill fact and a later useful action | Nonhuman progression, life sim and characters; P06/P09/P15; K3/K6/K8/K10; genetics round 13 carrier separation |
| 2 / WS-P02 | Let one local institution remember an interaction through an explicit state transition and a changed service | Characters and dialogue; P07/P12/P19; K6/K7/K12; world-kit KW3 with FK2 qualification |
| 3 / WS-P03 | Carry one naturally recruited ally's identity, actual recruitment cause and usable contribution through save/reload/import | Characters and generation; P06/P15/P16; K6/K18; life-sim cast |
| 4 / WS-P04 | Make directed opinion, enforceable agreement and war/truce distinct facts with an actual action reader | Characters, society and Province War intake; P07/P12/P25; K7/K10/K12; world kit |
| 5 / WS-P05 | Declare the refresh owner for one recurring opportunity and show when it can return | Engine and offline-clock audit; P10/P13; K8/K12; no source coefficients or fixed once limits |
| 6 / WS-P06 | Keep a generated roster's facts and any saved companions inside the actual persistence boundary | Save/scale and profile-save owners; P16/P23/P24; K18; preserve old bytes and existing carriers |
| 7 / WS-P07 | Offer concise and detailed explanations beside a known action without granting unearned competence | Means/appraisal, technology and thematic UI; P01/P03/P11/P21; K11/K14; extend FT5's existing knowledge store |
| 8 / WS-P08 | Quote a complete local social or contest transaction, then let the result change a useful downstream route | Dialogue, life sim and economy/means; P18/P19/P12; K6/K8/K10/K12; chains round 5, no instant physical-good-to-gold shortcut |

Concrete bounded examples and acceptance checks: [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Twenty-four proposed details: [SMALL_TOUCHES.md](SMALL_TOUCHES.md). These do not replace the already selected P01 work-feedback priority in the topic owners.

## Retention and proof

Full newly recovered native bodies, resolved dialogue/interface literals, selected instructions, query envelopes, warnings, constants and field joins are saved in the private [work area](/Users/weiwei/.codex/research/ds-warsim/). Earlier 190 captured data files, 38 dialogue pools and 3,750 build-qualified line IDs remain read-only in [the aspect work area](/Users/weiwei/.codex/research/warsim-aspects-2026-10-14/extract/). Raw tables and source prose stay out of this public folder. Tooling, hashes and mechanical rerun are in [TOOLING.md](TOOLING.md).

Verified: current executable hash, selected static rules/thresholds, byte constants, prior-save-field joins, exhaustive inventory retention, JSON/link/artifact checks. No Windows executable or game ran; no saves, scores, settings or live rosters were inspected. No runtime source edit, YAIRPG build, browser proof, save/reload/import, commit or push occurred. Runtime and full-lifecycle gaps remain in [CHECKPOINT.md](CHECKPOINT.md).
