Root addendum: the leaf table below retains its own inspection boundary. Root subsequently reviewed A/B/C/F terminal UpgradeAction Requires/Effect records, so all eight terminal predicates now appear in [REPORT](../REPORT.md) and `COVERAGE.root_review.ending_records`. This resolves terminal-row reading only; full preceding route/flow chronology remains unread.

Analytical source notes preserved by the coordinating GM. All recovered code, raw tables/prose/assets and logs stay in the private workspace pinned in [INTAKE](../INTAKE.json). These are selected source traces, not a whole-game or runtime review.

# Your Chronicle installed asset/data review

Private bounded lane, app1546320/build25001959, 2026-10-06. Root owns final repository research. No game launch, save/account inspection, game mutation, repository write, image export, entitlement change, commit or publication occurred.

## Evidence and recovery

Read seven installed Unity serialized files without modifying them. `input-manifest.json` records file hashes. `object-inventory.json` records43,137object pathIDs/types/names/raw hashes.122TextAssets were accessible. Most mechanics and translations are base64 plus repeating XOR with the eight-byte literal key `password`; the common CSV header made the repeating key apparent. `decode_textassets.py` implements the reversible transform. All110encoded payloads re-encoded byte-for-byte to their original `m_Script` strings (`decode-roundtrip.json`). Twelve remaining text payloads were plaintext. This validates extraction/transform, not game behavior.

Most MonoBehaviour type trees were unavailable;15,205objects have decode errors. Their class/file counts do not prove semantic understanding. Structured mechanics tables are separately readable and indexed in `parsed/`; physical decoded-text line and CSV record locators are in `semantic-coverage.json`.357selected CSV records across17tables,16English Help entries and five selected A13graph edges were reviewed. The rest remain inventory/decoded-unread. Raw data and translations remain here outside Git.

`YC_HelpSection`, sharedassets1.assets:pathID10, raw SHA256`1d8c9d932dbac10e8b907450153c94cb1efff73b19631ebd09ca8c0a39c66d88`, is plaintext installed help. It is an authored explanation, distinct from executable-body evidence. `help-locators.json` preserves exact multiline CSV spans.

## Shared source semantics

UpgradeAction costs/effects and conditions are separate data fields. The native `UpgradeActionMasterDataParser` installs Cost/Effect/Requires/Restriction/CompleteCondition and dependencies; selected calls are recorded in `native-review.json`. `UpgradeCondition.IsMet` RVA0x9305E0 uses current completion count >= threshold. Threshold0 substitutes the referenced action's MaxClearNum, falling back to1 if no action exists. Therefore `UpgradeAction:X:0` means fully complete, not absent. Cpp2IL ISIL labels `setge` unimplemented, so the corresponding native assembly comparison was read directly.

`UpgradeAction.OnClick` RVA0x891640 checks conditions, original prerequisites and restrictions, calculates next costs/effects through `Narou1Func.Calculate<T>` (RVA0xC90FD0), increments current and past completion counts, locks dependent events, updates release conditions and adds Guardian's Bane for completed actions. This supports the interpretation of actual cost, count and lock data. It does not establish runtime save publication or all failure handling.

`JoinParty` text is parsed into `Accompany_Dealing(true,AllyId)`. Selected native Calculate branches toggle accompaniment availability; leaving removes invalid units. This is not an unconditional physical assignment into a full party. Help explicitly makes choosing the active/passive party a separate decision.

## Earned training and restoration

`[Setting]Dungeon - [Setting]1_Event`, resources:pathID60 records26–29, lines77–80: Father solo-training E/F/G/H requires each preceding training cleared, unlock Rank10/20/30/40 and100/150/200/250Destiny. First-clear action regeneration is+0.05 each; normal rewards7/9/11/13Destiny. H has35,429,400HP and4,428,675combat stats. There is no fixed completion-time field; do not turn these figures into an invented minute estimate. Each is unavailable after the father-dead route flag and resets with reincarnation.

Past UpgradeAction pathID115 records65–76, lines182–205: E/F/G/Htraining unlocks successive three-step conversations with Father. The final H conversations consume2,000/2,100/2,200Destiny and each adds HabitEfficiency0.5 and Destiny capacity5. This connects demonstrated combat training to later relationship access and useful ordinary-work efficiency, not merely a dialogue label.

Record78 line208 then requires final Father conversation plus Repairsmith agreement and costs2,300Destiny to invite Father. Record82 lines214–215 makes npcD available. Smith stages records1931–1934, lines4459–4467: show discovered Mithril, pay7,000Destiny, pay7,500Destiny for the sizing discussion, consume10Mithril/30MP to make an arm while removing npcD, then consume the actual arm plus8,000Destiny to make npcD2 available. All remain blocked by the father-dead flag. This changes a named actor's usable form through actual craft material and fitting work.

Human Ally pathID83 npcD/npcD2 records8–9, lines47–58: enhanced form raises stamina cap4->6, regeneration0.4->0.6, wind cap1->2, Destiny regeneration0.1->0.4; default attack changes HeavySlash24/3.2interval to DimensionSlash36/2.4interval. These are structured data, not runtime damage claims. `MainFlag:hasFather` (pathID99 record13 line37) binds the training-H and invitation actions. ChronicleE's guide requirements include this flag among other required actors/gems. Its actual ending-click condition is one of five completed finale dialogue branches, so this review does not treat the guide list as the entire executable ending gate.

## Career mastery opens a different solution

Astral UpgradeAction pathID130 records9–12, lines9–24: Mother's Library plus Rank10 and7Inspiration per element unlocks fire/water/wind/earth capacity, regeneration and conversion routines plus a skill. Past pathID115 elemental lesson records1057–1076, lines2537–2576, require sequential spirit conversations. Each element costs22/24/26/28/30, totalling130units, with four100%capacity-routine speed additions and one1,000%regeneration-routine speed addition. Wind and earth first conversations additionally require the fourth water conversation. This is growth plus resource capacity needed to pay later story costs.

`elementalMaster`, record23 lines95–106, requires all four fifth lessons, Rank50 and5,000Destiny; it grants a title and action cap/regeneration, and mutually excludes Soldier/Mercenary/Wizard/Warlock/BeastTamer/Elementalist. Those earlier careers also lock Elemental Master. Their benefits arrive at Rank35 with2,300/2,700Destiny cost; picking one trades earlier power for the later specialist route.

At the Demon King, `callOfSpirits` record2033 lines4591–4592 requires Elemental Master, the preceding dialogue and no completed spearman interruption, and locks the sword dialogue and gem substitute. `rootsMagicB` record2034 lines4593–4596 consumes30of each elemental resource. The next two conversations unlock the Weakened Demon King fight (pathID60 record18 line56); actual combat remains necessary. Further conversations lead to the aftermath, laboratory/prison exploration and Mutant fight (pathID60 record19 line57); then `demonsCastleB` and endingD (Past records2081,2087–2093 and27). Thus specialist learning opens a different causal way through the campaign, while the ending still demands later actions and fights. The source's resurrection claim is narrative text; no separate simulation of revival was observed.

## Route commitments and retained consequences

Chronicle table pathID71 has eight base ending-guide records2–9. Source comparison:

| Guide | Distinct dependency pattern | Actual ending action gate inspected |
| --- | --- | --- |
| A | Justice answer and A-clear flag | Ending action not reviewed here |
| B | Justice, personally obtained sword, sword dialogue, revival-someday outcome | Ending action not reviewed here |
| C | Justice, Iari sword form, sword dialogue, cannot-revive outcome; tournament6 restriction | Ending action not reviewed here |
| D | Leave without Norn, Justice, Elemental Master root magic; four30element capacities | Complete demonsCastleB |
| E | Justice, Iari sword, Norn/Fenia/Father, four gems, gem root magic; tournament10 restriction | One of five finale branches |
| F | Destiny answer and spearman route; late factor/house restriction | Ending action not reviewed here |
| G | Norn, help decision, trained Norn, confrontation, Justice;10,000Blessing capacity restriction | youC7Ccount2 |
| H | Justice, Iari sword, solitary shrine, H-clear; sealedMark restriction | envyC8Dcount2 |

First/each/five-clear completion bonuses vary rather than sharing one reward: permanent-marked capacity/regeneration, titles, ritual multipliers, premium currency, and A's final Sloth queue slot. Every MaxClearNum is5. The asterisk distinction is real source notation; retention implementation belongs to root's native/reset lane.

Past departure records5–6 lines17–26: taking Norn costs50Destiny,2sandwiches,40firewood and makes npcA available; leaving alone costs2,000Destiny,1sandwich,20firewood and requires the explicit1,700Destiny refusal action (record193). Each departure locks the other. Norn grants elemental capacities/regeneration and Luck; later dormitory enrollment consumes200Gold and removes her. Reuniting has separate conditions (record400) and makes npcA2 available. The initial choice remains mechanically relevant to later flags and routes.

C7 pathID80 records181–186 lines427–438 gates Norn's conversations on successive beginner/intermediate/final career tiers before graduation; final conversation makes npcA4 available. The help/enemy decisions records172/174 each cost15Fate and exclude each other. `nornC7` requires helping, trained Norn and current Demon King dialogue, and conflicts with the sword/gem/spearman route. Reconciliation dialogue temporarily makes the Demon King npcE available (record203), then betrayal removes Norn and the orb's destruction removes npcE. Human Ally npcE (pathID83 record12) has dark cap10/regen2, DarkRitual+1,000%, but InspirationGain/SacredRitual-100%; his joining is a bounded narrative state with real tradeoffs, not a permanent universal bonus.

C7 aftermath creates markOfGoddess with+0.001regeneration and Destiny capacity-10,000; a1Sin suppression action removes that mark/regeneration and creates sealedMark. C8's Iari healing attempt explicitly accepts sealedMark or a previously earned expensive shortcut; later spirit healing consumes the sealed mark, and the resulting confrontation ultimately reaches H. `easyMark` (pathID138 record71 line108) costs200,000Inspiration and requires H already cleared. It opens alternative Iari actions without carrying the original mark. This is a late replay convenience earned from the earlier path, not an initial bypass.

## Ordinary medicine remains useful late

LoopAction pathID88 record8 lines12–18 makes Elixir: duration40, initial25MP/50SpiritWater/10DragonClaw/6Mandragora/5Potion/5HolyWater/1GoddessBlessing, progress cost1Action, result1Elixir. Prior Potion production consumes6Water/3Medicine and duration10; Medicine consumes4Herb and duration4. Loop Help says speed increases also accelerate resource consumption while preserving the full completion cost. Units correspond to the data's Duration and progress cost, not a measured live wall clock.

C7 records222–231 lines482–499 reuse these supplies for a real treatment choice. Potion1 and HolyWater1 are consumed and fail; the subsequent story records say Norn dies. The no-treatment option only appears without the three relevant supplies. Elixir1 heals her body and opens evacuation plus further paid Old Woman/Father scenes, while explicitly leaving her unconscious. The four branches mutually exclude one another. This review establishes that material preparation unlocks the less terminal aftermath; it does not invent a full cure or later rejoining.

A13 adds a different late reuse of ordinary research. Drawio pathID104 selected directed edges tie ChoreG1->G2->G3->G4. Native `FlowSetter.Release` and `UpgradeActionVertex` append full-completion prerequisites from those edges, explaining blank CSV Requires cells. G2 (pathID78 records167–172 lines237–250) consumes20base magic stones, then20each elemental, then another20each elemental; its bonuses improve continued collection. G3 costs30Fate and makes Fili available. Her passive data doubles AllResearchDropAmount and adds50% AllResearchDropChance. G4 consumes50–90billionresearch across progressively one to five species, then a final30Fate action removes Fili; each step adds1% AllResearchDropChance. The familiar research resource still funds late social/chore progress, with an explicitly temporary collaborator. Other A13 graph branches and availability before PickG2 remain unread.

## Party/equipment and access boundaries

Riverbank dungeon data includes early Slime/Bird/Goblin candidates. Slime Enemy data declares research drop syntax; Ally Slime consumes1research and contributes HabitEfficiency/regular-routine effects, while Goblin adds material capacities and Pray output. Help explains the summoning->levelcap->luck->greater research-drop->max-luck Dark Ritual multiplier cycle. Exact drop chance syntax has not been parser-verified by this leaf, so do not turn `Research:slime:1:30` into a asserted30%chance here.

Wooden Sword recipe costs200Inspiration after prior equipment unlock; actual forge data costs20Leather/800Wood, passive thresholds0/10/30, additional effect at5, random additional effects20/50 and reroll20mana crystals. Help explains exp1per enemy, automation1per10seconds, crystals gained via ritual converter, and party-wide passives versus wielder additional effects. Most37equipment rows remain unread; no claim of complete equipment balance.

Installed root contains only YourChronicle.app. No separate artbook, expansion directory or PDF was present in this read-only root inventory. A gameplay/table row name is not DLC entitlement evidence. Root must use primary published sources for official DLC inventory and classify absent art payloads without claiming they were read.

The useful adaptations are causal motifs, not transplanted numbers or plot: demonstrated training opens specific relationship help; actual craft changes a companion form; learned specialization unlocks a costly alternative; ordinary medicine changes late rescue aftermath; familiar research still funds late cooperation. Root refreshes YAIRPG owners before selecting and ranking at most five implementation packets.
