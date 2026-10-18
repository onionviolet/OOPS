# Farming, delegation and chosen involvement

2026-10-15. Research and proposals only. No gameplay, shared design owner, save, installation or accepted direction changed. This extends [PATH_PROPOSALS](PATH_PROPOSALS.md) and the [main report](REPORT.md). References are saved in this folder's ignored `private/farming-delegation/`; [UI evidence](FARMING_DELEGATION_UI.md) separates screenshot depictions from executable evidence.

The strongest lesson is to separate **what grows**, **who performs each chore**, and **what the player wants to pay attention to**. A personally tended garden, a garden helped by a power, and a staffed farm can share crops and world rules while offering different activities. They need not form a compulsory progression ladder.

## Evidence and limits

**FD1. ACS has a traceable designation-to-worker chain.** The installed `Assembly-CSharp.dll` still matches the prior build17074448 audit hash, `d225481851ee2c0111971eab98dadd00488aea4a2b0982226b38534cc3bb7902`. Thirteen focused types were freshly exported with the existing ILSpy tool, all exit0 with empty stderr. These are decompiled managed method bodies, not native play. Complete exported classes and full selected live XMLs are retained, with source paths, hashes and receipts. No donor game was launched.

**FD2. Immortal Life supports a narrower care claim.** Retained build17861603 tables and IL2CPP declarations are available. Its former installed folder is absent, so this pass recovered no new native method bodies. The declarations name relevant state and methods but their empty bodies prove no execution. Primary table/localization joins provide firmer configuration evidence than the guide alone. Full tables, not only selected rows, are retained. Some skill rows have `LevelUpExp=-1` and empty rewards; they must not be presented as a complete live progression tree.

**FD3. Actual UI images are available, with version limits.** Immortal Life's long Steam guide mixes old alpha material and updates through2025; some dialogue images were translated by the author. ACS UI references come from2018/2019 articles. They show genuine game surfaces but do not establish current-build geometry, keyboard behavior, tooltip timing or this machine's compatibility. See [the caption inventory](FARMING_DELEGATION_UI.md).

## What the donor systems actually support

| Question | Immortal Life | Amazing Cultivation Simulator |
|---|---|---|
| What is delegated? | Configured automatic watering items and a temporary helper care power. Localization describes watering and feeding silkworms; this does not establish automatic sowing, harvesting or a full NPC workforce. | Selected field designations create planting/harvest commands, consumed by eligible workers through behavior, job and toil stages. |
| Where does expertise enter? | Plant profession rewards include shop seed unlock commands. Prayer effects and rare-plant decorations offer separate capabilities. Acquisition and native execution remain unverified here. | Planting duration reads worker efficiency and `PlantWorkSpeed`; harvest reads efficiency and `PlantHarvestSpeed`. Harvest yield reads a worker property, with special plant exceptions downstream. |
| Who learns? | This pass does not establish XP attribution under helper powers. | Successful planting and harvest toils credit the executing NPC's Farming skill. Selecting a priority does not itself award the manager Farming XP. |
| What continues without attention? | The helper effect has a configured duration and named chores. Auto-water configuration distinguishes manual and automatic entries. | Area scans maintain commands; growth uses world conditions separately from the labor jobs. Higher-priority/need/health/path restrictions can delay jobs. |
| What invites focused attention? | Rare-plant stages, directional placements, elemental targets, limited garden space and crop knowledge. | Site selection, crop conditions, worker capability, priorities and throughput. |
| What remains unproven? | Exact native scheduling, expiry boundaries, coverage, offline behavior, resource consumption and save/reload behavior. | Full harvest-to-storage chain, every job interruption/resume case, exact skill-to-property curve, loaded/offline simulation and native UI interaction. |

### ACS: a field plan is an intention, not instantaneous work

`AreaPlant.SpaceStep` inspects the selected plant for each space. Missing, mismatched or dead plants may generate planting commands if the terrain permits; ripe plants may generate harvest commands. `CommandPlant` includes a path check. `BehaviourPlant` handles locks and may seek a compatible sickle before creating the planting job. The job goes to the target, handles removal where required and invokes the toil. Harvest similarly follows behavior → job → toil. Existing plants/targets are locked during parts of these operations.

This explains why a useful delegation UI should distinguish **designated**, **eligible**, **claimed**, **working** and **finished**. They are different observations. This pass does not establish a complete universal ACS reservation/retry protocol, so those proposed YAIR states are design vocabulary, not a claim about every donor edge case.

The job engine sorts behaviors by priority and looks for a valid job while checking enable/ban state, work limits, health and body function. Preferred work changes behavior priority; it cannot promise an immediate job switch or completion. `Wnd_NpcWork` binds enable controls, a preferred-work selector, skill evaluation, affinity indicators, tooltips and column highlighting. Skill, willingness and availability answer different questions.

`ToilPlant` and `ToilHarvest` calculate work duration from crop work requirements divided by worker efficiency and the relevant speed property. The completing worker receives Farming XP. `PlantThing.DoHarvest` produces item drops and resets harvest state; some plants are removed while others can continue. A spiritual-plant branch changes the yield multiplier treatment, so one universal yield formula would be inaccurate. The selected planting leaf does not debit a seed stock, but that is insufficient evidence for claiming the whole game never requires seeds.

Growth has separate establishment and harvest progress. Environmental calculation includes temperature, soil fertility, light, season, qi and elemental conditions, with exceptions and overrides. `GrowDays*600` and `HarvestDays*600` are simulation constants here; they are not measured real-time durations. This supports explaining *why a particular plant is stalled*, rather than presenting all farming as a single timer.

Selected XML examples: `FarmBase` configures sow work35 and harvest work45; `Wheat` declares growth19 and harvest6 with base output9, while `Healroot` declares32/14 and base output3. These are inherited definition inputs, not guaranteed final yields or measured elapsed time. Full definitions are private. Existing [ACS production research](../amazing-cultivation-simulator/traces/production.md) already provides a medicine consumer for Healroot; this pass does not create another crafting resolver.

### Immortal Life: powers can remove chores while preserving decisions

The primary join is `Pray.AutoFarm` → buff IDs30101/30102/30103 → effect values3/6/9 → localized descriptions. English and Chinese describe a jade helper watering and feeding silkworms at7 a.m. for the next3/6/9 days. The buff records separately contain `lifeTime=4/7/10`. Do not collapse those fields into an invented expiry rule; native method bodies would be needed to explain the extra unit. `GodnessManager` declarations expose remaining helper days and refresh methods, corroborating the state model but not its implementation.

`AutoWater` has four entries: round1 or2, manual entries with physical cost10, automatic entries with cost0. Those are configuration values, not proof that installation, placement, activation or all maintenance is free. The guide depicts progression from manual care to powers and watering devices. It does not prove that all chores are eventually automated.

`LifeSkillLevel` includes Plant rewards that unlock additional shop seed listings. This is an interesting alternative to giving every level a larger yield percentage: expertise can expand the things one can attempt. Some later rows in this retained build are placeholders, so the table should not be used to promise fifteen working levels.

Rare cultivation offers a distinct reason to remain involved. Six `MagicPlant` entries contain stage-specific elemental targets and directional item requirements. Sixteen decoration entries include placement limits and effects such as ignoring an adapted-season coefficient. The guide's stage UI shows directional requirements, counts, range diagrams and element progress; garden frames show devices occupying space around the plant. Crop notebook frames show ordinary/variant information, seasons and output qualities. These are strong references for communicating known requirements and recorded discoveries. They do not justify showing all undiscovered truths in YAIR.

## Proposed takeaways for our paths

All FP entries are unselected proposals, not new acceptance gates. They preserve accepted D2–D4: whole lives can center on little pursuits; involvement varies by activity/life; world rules can be repeatable while discoveries remain surprising.

**FP1. Make involvement a choice per chore and crop.** A player might water personally, ask someone to harvest, use a rain technique on ordinary beds, and personally tend one unfamiliar specimen. Changing the means should preserve the crop's identity and history. Manual, powered and delegated care should expose real differences in time, resources, expertise and attention without requiring everyone to become a farm manager. Fishing can follow the same principle: personal angling, preparing a passive device, or asking a capable companion to fish need not erase each other's appeal. This is a transfer proposal, not an ACS fishing finding.

**FP2. Keep learning attached to what happened.** Doing a task, directing it, observing a result and discovering a principle are different contributions. Personal practice can train personal skill; a worker can improve their own skill; supervising may teach management only if that activity actually exists. A spell might remove strain or affect coverage without granting unearned mastery. Discoveries should record the witnessed conditions and observer rather than awarding all knowledge to whichever character owns the field. Exact XP rules remain a later design choice.

**FP3. Make delegation inspectable before making it elaborate.** Start conceptually with one bed, one helper, a selected chore and a clear stop/expiry condition. Show current assignment, actual actor, why work is waiting, remaining power duration and the result. Crop failure reasons and labor blockage reasons should be separate. Any future implementation should define crop switching, stale targets, full storage, missing inputs, cancellation, absence, expiry and interrupted jobs before claiming reliability. Those are consequences to account for, not authorization for a general workforce engine.

**FP4. Pair a calm routine view with focused investigation.** Propose a compact current-work summary and a detailed cultivation view using existing shared surfaces. In the detailed view, ordinary crops need readable condition/care information; unusual specimens can reveal stage requirements, spatial relationships and the player's evidence. A spatial view earns its cost when placement changes the outcome. Known thresholds can be legible without exposing sealed discoveries. A notebook should distinguish observed, inferred and confirmed relationships. Target: populated1366×768 desktop; retain log/status/current work, shared controller, bottom Back/Esc. Mobile remains deferred, and no UI was built here.

**FP5. Let farming change a life before it changes an empire.** Ordinary outputs can support food, medicine, trade, gifting or a personal experiment through existing consumers. A new seed, preparation, environmental technique, useful hybrid result or local relationship can deepen the path without larger acreage. Rare cultivation can demand different knowledge rather than simply more labor. A tiny garden should remain a viable chosen life; staff, powers and acreage are optional ways to pursue particular goals.

## Disposition and the next useful evidence

| Code | Disposition | Meaning |
|---|---|---|
| FT1 | ACT NOW, research only, completed | Retain focused ACS exports/full definitions, IL tables/declarations, actual UI images and provenance. |
| FT2 | ACCOUNT FOR NOW | Separate crop state, work intent, actual actor, expertise, power duration, discovery evidence and attention choices in any later proposal. |
| FT3 | LATER, if selected | An isolated donor interaction can verify one helper expiry boundary or one worker-priority interruption. Immortal Life needs a matching binary available again for further native recovery. Neither game was launched in this pass. |
| FT4 | LATER, separately authorized implementation | Pick one existing-path question, then define a small playable comparison. Rebuilt YAIR desktop behavior, persistence and human acceptance would be separate gates. |

No additional decompilation is proposed merely for coverage. More extraction is worthwhile when it closes a selected question, for example helper XP attribution, exact resource use, or crop-stage UI state. New tools, compatibility layers, a complete work scheduler, genetics engine and broad ecology simulation are not prerequisites for reviewing these proposals.

Raw provenance and exact reference spans: `private/farming-delegation/ACS_EXPORT_RECEIPT.json`, `DATA_RECEIPT.json`, `SOURCE_NOTES.md`, UI receipts and [reference index](REFERENCE_INDEX.md). No implementation, tests, builds, commits, publication or native acceptance is claimed.
