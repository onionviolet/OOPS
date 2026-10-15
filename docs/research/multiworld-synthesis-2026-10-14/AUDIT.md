# Multi-world evidence audit

2026-10-15. Dispatch 2026-10-14. Research only. Lane files were not edited.

## Scope and counting

Seven delivered lanes, all marked PARTIAL for explicit source gaps. Each has five SHOWN claim checks and five inferential checks below: 35 + 35 = 70. No lane has five separately labeled INFERRED findings; proposed adaptations are therefore explicitly counted as inferential claims, not relabeled source facts. The MUD lane has four SHOWN finding IDs: F11 is split into two concrete subclaims to reach five. Siralim F13 likewise supplies three distinct native subclaims. Sampling does not certify a whole lane.

Private paths below are relative to each lane work root `~/.codex/research/<lane>/`; abbreviated Remnant `...` resolves through its [source ledger](../remnant-2/SOURCE_LEDGER.md). Input hashes and exact files are in this lane [TOOLING](TOOLING.md). Source labels mean static evidence, not play.

## Corrections and dispositions

| Code | Lane | Correction / downstream action |
|---|---|---|
| C1 | All lanes | Delivery checkpoints are all PARTIAL, not blocked installs. Remnant II and KH delivered installed-byte reads; their own build pins remain dated lane evidence, not a new live install verification. |
| C2 | HR | REPORT and FINDINGS reuse F3/F4/F5 for different summaries. Audit IDs here cite FINDINGS IDs; downstream references must name file plus ID. No audit correction was applied to lane files. |
| C3 | SU | Mixed shown+stated labels must be split by clause. Realm behavior and favor text are descriptions; archive/chunk/native/table evidence proves only the inspected structures. Five shown checks here use structural subclaims, including three from SU-F13. |
| C4 | R2 | Every parsed claim stays conditional on the unvalidated build match of Mappings.usmap. Successful JSON emission or no logged error is not a complete schema validation. ActivateFirstValidWorld is activation, not random selection. |
| C5 | KH | Room/member/model changes are not evidence of retained local stock, consent or personal memory. SaveData is tool-side schema, not Steam-container compatibility. Census counts remain selected artifacts, not campaign count. |
| C6 | TS | SHOWN means inspected rules/examples, not a software implementation. Public preview does not establish full personal-recursion creation rules. Translation and unchanged physical passage are distinct source options. |
| C7 | MD | Only four FINDINGS IDs are labeled SHOWN. Five concrete claims were checked by splitting F11 into room setup and hidden-exit semantics. Tutorial and web-client code do not become current server source; RetroMUD mechanics remain STATED. |
| C8 | MI | Screenshots establish visible information only. Retain no-map/no-parallel-world/no-save-proof limits. 1920x1080 media or arithmetic scaling cannot pass YAIRPG 1366x768 gate. |
| C9 | All earlier lanes | Current 2026-10-15 OD2/OD4/OD5/OD6/OD7 accepted direction supersedes older unresolved/default wording: memories/base cheat between lives, chosen away routines with stops, paused inactive worlds, means-based returns/fresh versions, continuing self and causal world stories. These are accepted goals, not implemented semantics. Across-life and across-world retention remain different contracts. |
| C10 | TS/HR/MD/R2 UI routing | Older lane UI suggestions cannot replace accepted Proto23 composition or occupy another panel. Follow UI_RULES: surface/home, shared components/controller, log intact, bottom Back/Esc. Unaccepted features stay in Projects until promoted. |

## HR: mw-hyperrogue

Input: [findings](../hyperrogue/FINDINGS.json), [report](../hyperrogue/REPORT.md), [proposals](../hyperrogue/IMPLEMENTATION_PACKETS.md). Private work root: `~/.codex/research/mw-hyperrogue/`.

### SHOWN spot-checks

| Audit ID / finding | Checked claim | Direct locator | Result |
|---|---|---|---|
| HR-S01 / F1 | 95 land declarations include technical states | `content.cpp:1059 onward; anchored LAND/ITEM/MONSTER/WALL census` | CONFIRM: independently counted 95/155/180/121. These are declarations, not accessible-world counts. |
| HR-S02 / F2 | Availability and unlock are separate | `landlock.cpp:241-276` | CONFIRM: ACCONLY calls isLandIngame; landUnlocked is separate. Do not infer adjacency from availability. |
| HR-S03 / F5 | Generation relation is not a universal carried-power veto | `orbgen.cpp:216-249; pcmove.cpp:1872-1879` | CONFIRM scoped split: getOLR classifies relations; movecost separately drains departing Power-land orbs to two, except Fire. |
| HR-S04 / F11 | Memory saving has explicit conditional guards | `savemem.cpp:90-114, save_memory` | QUALIFY: inspected guards establish mode/land dependence. They alone do not prove every distant map is erased or a full save recovery contract. |
| HR-S05 / F14 | Forbidden-history call uses prior tile item | `inventory.cpp:679-688` | CONFIRM syntax: it is old tile item, activation uses orbmap[uni]. Defect remains INFERRED, no runtime reproduction. |

### INFERRED / proposed adaptation checks

| Audit ID / claim | Inference examined | Basis | Overreach disposition |
|---|---|---|---|
| HR-I01 / HR-P1 | Two places can change a carried tool action | HR-S03; P14 | SUPPORTED proposal. Requires one paid native action and a useful control, not land-name changes. |
| HR-I02 / HR-P2 | Per-carrier travel preview | HR-S03; P05/P17 | SUPPORTED extension; the source-specific drain is not a universal YAIRPG penalty. |
| HR-I03 / HR-P3 / HR-N1 | A border can interact through shared objects | HR F3/F4 sources; P14/P15 | PLAUSIBLE, more expensive than a local law. Both edge consumers and conflict order must be authored; not proof all worlds share physics. |
| HR-I04 / HR-P6 | Practice modes can use distinct clocks | HR F9; P13/P14 | QUALIFY: source modes differ; no new action mode or offline policy is accepted by this analogy. |
| HR-I05 / F14 defect interpretation | Prior-item call is an actual bug | HR-S05 | UNPROVEN runtime defect. Keep apparent mismatch wording; do not mark fixed, exploitable or complete enforcement. |

Lane disposition: useful within the named evidence layer; apply the relevant C rows above when folding. No whole-game, native, UI or save acceptance is granted.

## SU: mw-siralim

Input: [findings](../siralim-ultimate/FINDINGS.json), [report](../siralim-ultimate/REPORT.md), [proposals](../siralim-ultimate/IMPLEMENTATION_PACKETS.md). Private work root: `~/.codex/research/mw-siralim/`.

### SHOWN spot-checks

| Audit ID / finding | Checked claim | Direct locator | Result |
|---|---|---|---|
| SU-S01 / SU-F01 | Archive index lacks CODE | `extract/archive-index.json:chunks; extract/nm-arm64.txt` | CONFIRM extracted directory has no CODE; native script symbols corroborate compiled route. Marker 17 alone is insufficient. |
| SU-S02 / SU-F10 | Localization is structured separately from native code | `extract/localization/*.csv; localization-census.json` | CONFIRM 24 CSV files with language columns. These are text rows, not reachable mechanics or entity counts. |
| SU-S03 / SU-F13/a | SetFusion includes rendering work | `extract/native/gml_Script_scr_SetFusion.c:959-1107,1461` | CONFIRM surface/sprite/palette calls. Name alone cannot establish semantic fusion ownership. |
| SU-S04 / SU-F13/b | AddTrait works on global extra_traits | `extract/native/gml_Script_scr_AddTrait.c:63-95` | CONFIRM global owner and indexed append branch. No per-creature trait cap follows. |
| SU-S05 / SU-F13/c | Hidden and travel properties have separate writes | `extract/native/gml_Script_scr_RealmGetProperties.c:1240-1319` | CONFIRM distinct hiddenrealmprops/values and telerealmprops/values setters. Their complete later consumers remain unread. |

### INFERRED / proposed adaptation checks

| Audit ID / claim | Inference examined | Basis | Overreach disposition |
|---|---|---|---|
| SU-I01 / SU-F12 | Expedition pattern can inform persistent settings | SU-F02/F07; nested-world owner | SUPPORTED with limit: Siralim is not proof of durable resident/stock histories. Preserve OD5 same-world history. |
| SU-I02 / SU-P02 | Source/lifetime/usability inspector | SU-S02/S05; P04/P11 | SUPPORTED view proposal. Derive from real owners; text fields do not supply runtime truth. |
| SU-I03 / SU-P04 | Trigger encounter needs termination policy | SU-F06; P14/P16 | QUALIFY: codex limits are STATED and internally inconsistent. Author a local policy; no inferred shared queue or lifetime cap. |
| SU-I04 / SU-P05 | Favor grants service separately from currency | codex.csv:151-153; P07/P18 | SUPPORTED stated distinction, not a full social simulation. Retain opportunity without importing numeric grind. |
| SU-I05 / SU-P06 | Trip material can fund useful home refit | codex.csv:168-171; P02/P12 | PLAUSIBLE YAIRPG design. No inspected Siralim hub transaction/durable-return proof. |

Lane disposition: useful within the named evidence layer; apply the relevant C rows above when folding. No whole-game, native, UI or save acceptance is granted.

## R2: mw-remnant2

Input: [findings](../remnant-2/FINDINGS.json), [report](../remnant-2/REPORT.md), [proposals](../remnant-2/IMPLEMENTATION_PACKETS.md). Private work root: `~/.codex/research/mw-remnant2/`.

### SHOWN spot-checks

| Audit ID / finding | Checked claim | Direct locator | Result |
|---|---|---|---|
| R2-S01 / R2-F03 | First valid world activation is ordered | `extract/parsed2/.../Campaign_Main/Quest_Campaign_Main.uasset.json:ActivateFirstValidWorld` | CONFIRM World1/2/3 validity calls each branch to activation and jump to return. No random selection shown in this function. |
| R2-S02 / R2-F04 | Adventure wrapper tags pair Story and biome | `extract/parsed2/.../World_Fae/Quests/Quest_AdventureMode/Quest_AdventureMode_Fae.uasset.json:Quest_GEN_VARIABLE` | CONFIRM Fae sample has Story/Fae. This sample does not independently audit the Jungle/Nerud siblings or native matching. |
| R2-S03 / R2-F05 | Fog has overlap and exit action plumbing | `extract/parsed4/.../World_Nerud/Environments/Blueprint/BP_Nerud_DeathFog.uasset.json` | CONFIRM event/function exports support local exposure handling; numerical hazard and whole cleanup chain remain conditional/unrun. |
| R2-S04 / R2-F07 | Archetype definition links its dependencies | `extract/parsed/.../Archetypes/Alchemist/Archetype_Alchemist.uasset.json:Default__Archetype_Alchemist_C` | CONFIRM EngramItem, RemnantArchetype, Type and StatTable references. Links do not prove unlock-table decode or payment. |
| R2-S05 / R2-F09 | Barks check actor conditions | `extract/parsed3/.../Pan_Wolf/Blueprints/Char_Pan_Wolf_Dialogue_StateMachine.uasset.json` | CONFIRM 45 exports; speaking/cinematic tags, combat, health, range and HasLOS conditions. No measured arbitration quality claimed. |

### INFERRED / proposed adaptation checks

| Audit ID / claim | Inference examined | Basis | Overreach disposition |
|---|---|---|---|
| R2-I01 / R2-F11 | Portable combat build is stronger evidence than metaphysical conversion | R2-S04; P1/P2 in lane ledger | SUPPORTED bounded comparison; no universal power transfer or NPC jurisdiction claim. |
| R2-I02 / R2-P01 | Crossing/reroll can preview carrier terms | R2-S01/S02; P05 | QUALIFY: SaveGuardian is third-party. Cannot use it as proof of engine save atomicity; avoid requiring profile P23. |
| R2-I03 / R2-P02 | Hazard should alter an action with mitigation | R2-S03; P14 | SUPPORTED local proposal; exact values, mitigation and exit cleanup need YAIRPG source/native checks. |
| R2-I04 / R2-P04 | Conversation can settle a transaction | R2-F08; P19/P24 | PLAUSIBLE: graph node types are incomplete evidence of execution order. One existing narrative host, no inferred transaction engine. |
| R2-I05 / R2-P06 | Generated recipe should pin required/optional roles | R2-S01/S02; developer P2; P15/P16 | QUALIFY: ordered activation is not generator selection. Required-role validation and revision pinning are our proposed contract, not recovered Remnant algorithm. |

Lane disposition: useful within the named evidence layer; apply the relevant C rows above when folding. No whole-game, native, UI or save acceptance is granted.

## KH: mw-kingdom-hearts

Input: [findings](../kingdom-hearts/FINDINGS.json), [report](../kingdom-hearts/REPORT.md), [proposals](../kingdom-hearts/IMPLEMENTATION_PACKETS.md). Private work root: `~/.codex/research/mw-kingdom-hearts/`.

### SHOWN spot-checks

| Audit ID / finding | Checked claim | Direct locator | Result |
|---|---|---|---|
| KH-S01 / F1 | Conditional members are a separate table | `extract/decoded/memt.json; repos/OpenKh/OpenKh.Kh2/SystemData/Memt.cs:72-92` | CONFIRM 37 rows, each 18 members; world/story/area fields. Native selection/fallback priority is not independently executed. |
| KH-S02 / F2 | Command restrictions are distinct from members | `repos/OpenKh/OpenKh.Kh2/SystemData/Cmd.cs:43-85; extract/decoded/03system-cmd.bin` | CONFIRM flags and DisableForm field separate from member schema. Full actor/body semantics remain interpretation. |
| KH-S03 / F3 | Growth rows are distinct from manifestations | `extract/decoded/lvup.json; extract/openkh-decoded/bonuses.json,summons.json` | CONFIRM 13 characters each 99 levels, 179 bonus rows, four summon definitions. The 45-form-row subclaim was not independently recounted here. |
| KH-S04 / F6 | Selected room/event corpus is large | `extract/openkh-decoded/*.script.txt,*.event.xml` | CONFIRM counted 749 script files and 951 event XML files. Counts prove emitted artifacts, not all semantic decodes or reachable story coverage. |
| KH-S05 / F8 | KH1 selected room resource census | `extract/decoded/kh1-room-resources.json` | CONFIRM 239 entries with room/archive/resource fields. Resource presence alone cannot prove local combat/body rules. |

### INFERRED / proposed adaptation checks

| Audit ID / claim | Inference examined | Basis | Overreach disposition |
|---|---|---|---|
| KH-I01 / F10 / KH-P01 | Earned state and local usability should be separate | KH-S01/S02/S03; P04/P05 | SUPPORTED design split; data separation does not prove an authoritative runtime transaction. |
| KH-I02 / KH-P02 | Changed revisit retains real history | KH F5; P10/P12 | QUALIFY: selected room programs demonstrate episode projection, not persistent economic/NPC state. OD5 supplies YAIRPG requirement. |
| KH-I03 / KH-P03 | Appearance, body and permission can have separate fields | KH-S01/S02; P14/P16 | SUPPORTED fixture proposal. A model swap alone does not establish actual body or controller change. |
| KH-I04 / KH-P04 | Learned function elsewhere makes return useful | KH F4; S14/S15 authored messages; P03 | PLAUSIBLE but STATED requirement, evaluator unread. Do not infer equivalent methods accepted by KH. |
| KH-I05 / KH-P05 | Companion identity survives local availability changes | KH-S01; P06/P12 | PLAUSIBLE YAIRPG extension. Member overlay is not personal memory, custody or consent proof. |

Lane disposition: useful within the named evidence layer; apply the relevant C rows above when folding. No whole-game, native, UI or save acceptance is granted.

## TS: mw-the-strange

Input: [findings](../the-strange-tabletop/FINDINGS.json), [report](../the-strange-tabletop/REPORT.md), [proposals](../the-strange-tabletop/IMPLEMENTATION_PACKETS.md). Private work root: `~/.codex/research/mw-the-strange/`.

### SHOWN spot-checks

| Audit ID / finding | Checked claim | Direct locator | Result |
|---|---|---|---|
| TS-S01 / F10 | Cypher entries split effect and world form | `extract/S13.txt:426-479` | CONFIRM Earth/Ardeyn/Ruk form rows adjacent to effects. No digital identity/consumption algorithm follows. |
| TS-S02 / F11 | Artifacts declare operating law and depletion | `extract/S13.txt:133-143,160-185` | CONFIRM sampled artifact entry fields. Cross-law failure timing and all-item exceptions remain unread. |
| TS-S03 / F12 | Samurai Sky supports conditional magic | `extract/S13.txt:146-151, printed p48` | CONFIRM lunar condition over ordinary physics. No exact lunar evaluator/formula supplied. |
| TS-S04 / F13 | Origin taxonomy includes emergence | `extract/S13.txt:42-99` | CONFIRM fictional/mythological distinction and emergent discussion. No automatic YAIRPG world generator is demonstrated. |
| TS-S05 / F15 | Gate influence sustains foreign abilities | `extract/S10.txt:590-604,719-722` | CONFIRM adventure-specific support from Hum/gate and local range. Do not generalize the exception to all gates. |

### INFERRED / proposed adaptation checks

| Audit ID / claim | Inference examined | Basis | Overreach disposition |
|---|---|---|---|
| TS-I01 / MWTS-P01 | Different passage modes deserve distinct carry terms | TS F02/F07/F08; S01 official article; P05 | SUPPORTED proposal, not universal translation. YAIRPG may retain unchanged powers through suitable means. |
| TS-I02 / MWTS-P02 | One traveler plus local-form history | TS F03/F05/F06; S02 article; P05/P16 | SUPPORTED for this source model. One shared injury pool is source-specific, not mandatory across all YAIRPG bodies/lives. |
| TS-I03 / MWTS-P03 | One consumable survives appearance changes without duplication | TS-S01; P16/P17 | SUPPORTED architecture inference; tabletop description contains no save transaction algorithm. |
| TS-I04 / MWTS-P04 | Conditional law should drive actual action eligibility | TS-S03/S05; P14 | SUPPORTED bounded leaf. Numeric support window and exception order still need original authorship. |
| TS-I05 / MWTS-P06 | Small personal world can be authored as a kit card | TS F16; P15/P22 | RESTRICT: creation/maintenance rules unread. Reuse kit authoring only; do not claim source costs, complete construction system or a new world priority. |

Lane disposition: useful within the named evidence layer; apply the relevant C rows above when folding. No whole-game, native, UI or save acceptance is granted.

## MD: mw-muds

Input: [findings](../multi-realm-muds/FINDINGS.json), [report](../multi-realm-muds/REPORT.md), [proposals](../multi-realm-muds/IMPLEMENTATION_PACKETS.md). Private work root: `~/.codex/research/mw-muds/`.

### SHOWN spot-checks

| Audit ID / finding | Checked claim | Direct locator | Result |
|---|---|---|---|
| MD-S01 / MW-F11/a | Room tutorial uses common setup | `extract/3k-room.txt:27-134` | CONFIRM inherited room, create, realm and light setup. Public teaching example, not inspected server implementation. |
| MD-S02 / MW-F11/b | Hidden exit differs from blocked exit | `extract/3k-room.txt:430-442` | CONFIRM explicit explanation and separate dirfunc guard concept. This is a second concrete subclaim within F11. |
| MD-S03 / MW-F12 | Monster tutorial adds authored behavior | `extract/3k-monster.txt:100-172,255-469` | CONFIRM level, idle/combat chat and specials in tutorial. No full live NPC AI inferred. |
| MD-S04 / MW-F13 | Reset population must be authored | `extract/3k-put.txt:17-32,313-359` | CONFIRM create/reset distinction and guarded population. Reset loop is not retained death or changed-history proof. |
| MD-S05 / MW-F19 | Web help has its own client implementation | `extract/3k-main-js.html:508-636` | CONFIRM focus/keyboard modal and topic fetch with success envelope. It is website help, not an NPC dialogue API. |

### INFERRED / proposed adaptation checks

| Audit ID / claim | Inference examined | Basis | Overreach disposition |
|---|---|---|---|
| MD-I01 / MW-F20 | Retained capability plus local admission is best adaptation | MW-F02/F05/F09; P03/P04 | SUPPORTED inference from stated rules, no universal server transfer contract established. |
| MD-I02 / MW-P1 | Conditional transit can have safe inspection | MW-F03; P04/P13/P14 | PLAUSIBLE: transport guides disagree. Safe inspection is YAIRPG design, not proved MUD behavior. |
| MD-I03 / MW-P2 | Cumulative training can coexist with local requirements | MW-F05/F08/F09; P03/P07 | QUALIFY: RetroMUD constrained multiguild differs from 3K professions/Ascended. No unlimited multiclass or lossless switching claim. |
| MD-I04 / MW-P4 | Ownership/use/retention deserve separate preview | MW-F07/F17; P05/P24 | SUPPORTED distinction. Do not import reboot losses or autoload restrictions into old YAIRPG saves. |
| MD-I05 / MW-P5 | A local deed changes return service | MW-F06/F18; P07/P12 | PLAUSIBLE extension: faction reputation/help does not prove NPC personal memory or companion passage. |

Lane disposition: useful within the named evidence layer; apply the relevant C rows above when folding. No whole-game, native, UI or save acceptance is granted.

## MI: mw-multiverse-idle-ui

Input: [findings](../multiverse-idle/FINDINGS.json), [report](../multiverse-idle/REPORT.md), [proposals](../multiverse-idle/IMPLEMENTATION_PACKETS.md). Private work root: `~/.codex/research/mw-multiverse-idle-ui/`.

### SHOWN spot-checks

| Audit ID / finding | Checked claim | Direct locator | Result |
|---|---|---|---|
| MI-S01 / MI-F01 | Stable shell visible across screens | `extract/S01.jpg,S02.jpg,S03.jpg` | CONFIRM visual inspection: left traveler/nav, center workspace, right help/quest/system. Screenshots do not establish controller architecture. |
| MI-S02 / MI-F02 | Roster exposes world origin and set | `extract/S01.jpg` | CONFIRM nine named origin filters plus All; selected ally class, bonus and set progress. No relationship continuity or provenance mechanics proved. |
| MI-S03 / MI-F03 | Named destination modifiers differ | `extract/S03.jpg,S05.jpg` | CONFIRM Celestia/Naturia names and rewards; Naturia distinguishes zone from enemy effects. Real modifier consumers unread. |
| MI-S04 / MI-F04 | Training places rates/caps near values | `extract/S02.jpg` | CONFIRM milestone, resets, speed, active slots and offline stamina labels. No catch-up computation or return receipt demonstrated. |
| MI-S05 / MI-F05 | Skill acquisition and use costs differ | `extract/S06.jpg` | CONFIRM purchase cost/requirements separate from mana/cooldown. It is a tile list, not a proven dependency graph. |

### INFERRED / proposed adaptation checks

| Audit ID / claim | Inference examined | Basis | Overreach disposition |
|---|---|---|---|
| MI-I01 / MI-F10 | Shared trained traveler/team across destinations | MI-S01/S03; store description | PLAUSIBLE only. Images show several states, not a tested transfer or simultaneous simulation. |
| MI-I02 / MI-P01 | Adjacent work/receipt/explanation helps current slice | MI-S01/S04; P01/P04 | SUPPORTED UI proposal; no tested usability gain. Use existing Proto23 composition/log rules. |
| MI-I03 / MI-P03 | Origin-filtered list should include custody/usability | MI-S02; P05/P16 | QUALIFY: origin filters shown; custody and cross-world support are YAIRPG additions. New presentation leaf, not new state store. |
| MI-I04 / MI-P06 | Return summary splits allowance and earned work | MI-S04; P13 | SUPPORTED desired distinction; source screenshot proves neither offline result nor current save correctness. OD4 now accepts chosen routine progress. |
| MI-I05 / MI desktop fit trial | Proposed 220/800/310 column widths fit 1366 | REPORT desktop arithmetic; 1920x1080 captures | UNVERIFIED layout. Width sums are not readability or 768px height proof; no scaling claim accepted. UI owner decides within current log/center composition. |

Lane disposition: useful within the named evidence layer; apply the relevant C rows above when folding. No whole-game, native, UI or save acceptance is granted.

## Remaining source audit limits

Remnant export schema/build match is unverified; native generator/save bodies remain unread. KH consumer/trap bodies and Steam save container are unread. Siralim full semantic purchase/fusion/return chains and many rule consumers are unread. HyperRogue full land-by-orb exception matrix and native recovery were not run. Strange whole corebook/personal-recursion construction is unread. MUD server state and full area/level-band census are unavailable in this public read. Multiverse Idle executable, map, offline math and native persistence are unread. These limits are retained rather than converted into new implementation gates.

Live web spot-checks: [Strange translation](https://www.montecookgames.com/translation-between-worlds/), [pinned HyperRogue movement](https://github.com/zenorogue/hyperrogue/blob/c7c9a2993b43ee2f4bbac422e565d18fdd98f886/pcmove.cpp), [Multiverse Idle store](https://store.steampowered.com/app/4122910/Multiverse_Idle/) opened. The 3K room fetch failed once; switched to the lane's retained original HTML and text, without retrying URL variants.
