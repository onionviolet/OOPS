# Tale of Immortal: A01 to A12

2026-10-14. Static RESEARCH, not gameplay acceptance. Shown means this lane read source/table structure; stated means an identified prior report; inferred means interpretation. All YAIR takeaways are unselected PROPOSALS.

Source identity: October9 official modFQA companion JSON/workbook backup. Current executable/build unknown; historical build21758240 not promoted to current proof.

Locators: Path readable.js is the pinned formatted file; Groundhog v1/v2 paths are defined in TOOLING.md; Immortality paths are relative to the pinned clone; Tale table names refer to the official backup. Source bodies/text and complete inventoried metadata are retained in [private work area](/Users/weiwei/.codex/research/asp-cultivation/extract/). No user saves, game launch, source/build change or account interaction.

## A01 Dialogue and conversation

Status: covered. Sources: `official backup JSON: DramaDialogue, DramaOptions, DramaNpc, ArtifactSpriteDialogue, ArtifactSpriteDialogueSub, LocalText; extract/tale-dialogue-metrics.json`.

Shown: base dialogue has 21926 rows; options 7987; NPC presentation 421. Rows carry condition/weight, left/right NPC, speaker, background/audio, text key, openFunction/function, options and nextDialogue. 1875 dialogue rows have a nonzero condition, 4650 options, 3191 function and 1368 openFunction. Artifact conversations add 104 trigger rows and 457 action/closeness/animation/voice rows. DLCDramaDialogue has 145 separate rows. Counts are schema evidence, not all branches read or installed DLC proof. LocalText resolves 9824 base dialogue keys by exact lookup; unresolved keys are not called missing runtime text.

PROPOSAL: a stable line/choice ledger with speakers, gates and separate effects; owner docs/CHARACTERS_AND_WORLD_EVENTS.md and world authoring.

## A02 Narrative delivery

Status: covered. Sources: `DramaTrigger.json, DramaFunctionGroup.json, RoleLogBase.json; pass-2026-10-14/SECTS_AND_TIME_DIGEST.md`.

Shown: 703 trigger rows bind event names, conditions, repeat/cooldown flags, actor slots, dialogue IDs and functions. 25 function-group rows separate group, condition, function and weight. 31 role-log rows name event/record types and localized text keys. Prior event tables show an expiring opportunity turning into a persistent successor. Full packages and command execution remain unread; story dispatch is table-backed, not a proven complete graph.

PROPOSAL: missed beats leave an aftermath and a recallable receipt; owner characters/events and wandering.

## A03 Implementation architecture

Status: partial. Sources: `prior INTAKE.json and EXTRACTION_RECEIPT.json; official JSON/workbook backup`.

Stated by historical receipt: Unity 2020.3.9f1c1, Windows IL2CPP, build21758240 and selected native methods. Shown now: 761 companion JSON tables exist, plus official workbooks. Conditions and functions are compact command strings; emit-style event names imply a dispatch interface, but current interpreter bodies are unavailable. Historical stubs have drift and cannot establish current execution order. No installed Tale payload was located by the bounded named-directory check.

PROPOSAL: typed commands with referenced IDs and explicit validation; owner docs/ENGINE_EXPANSION.md.

## A04 Save and persistence

Status: unread. Sources: `prior REPORT.md F4 and EXTRACTION_RECEIPT.json; official RoleSave.json`.

Stated by historical native audit: writer optionally GZip-compresses and encrypts. The old private binary/body area is absent, so this was not reverified. Current format/version/autosave/migration/corruption/whole-save bounds are unread. RoleSave is nine rescue/revival tuning rows, not disk-save serialization. No user saves read. No offline catch-up claim follows from monthly world rules.

PROPOSAL: retain YAIR versioned compatibility and candidate validation; owner save compatibility. Do not borrow unproved save behavior.

## A05 AI and NPC behavior

Status: partial. Sources: `pass-2026-10-14/NPC_LIFE_DIGEST.md, SECTS_AND_TIME_DIGEST.md; RoleChat.json and SchoolPostParam.json`.

Shown in backup tables: directed chat opinion tuning, rescue/death effects, appointment interruption and office replacement delays. RoleChat has 35 parameter rows. Prior follow-up traced leader wage/reserve and replacement rules. NPC cultivation, marriage, childbirth, disciple acquisition and autonomous selectors remain unavailable as bodies.

PROPOSAL: funded institutional duties and directed knowledge/opinion changes; owner docs/CHARACTERS_AND_WORLD_EVENTS.md.

## A06 UI and information design

Status: partial. Sources: `DramaDialogue uiType/background/speaker fields, DramaOptions hue/optionsHide/costHide/clickTip; ImmortalUISetting.json inventory`.

Shown: authored presentation fields distinguish dialogue modes, actors, backdrop, sound and hidden costs/options. These fields do not show actual desktop screen composition or keyboard behavior. ImmortalUISetting is inventoried, not rendered.

PROPOSAL: show a choice gate and cost without conflating visible/affordable/eligible; owner docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md. Target desktop1440 x 900, mobile deferred.

## A07 Content authoring and modding

Status: covered. Sources: `official JSON/workbook backup, DramaCondition/FunctionGroup/Trigger; pass-2026-10-14/TOOLING.md`.

Shown: official modFQA documentation ships read-only workbooks and companion JSONs, string command grammar, localized text keys and ID references. Prior parser independently matched 22 tables/8385 numeric rows/115837 values. That is export fidelity, not complete semantic validation. Current mod precedence/override rules, script interpreter safety and load order are unread.

PROPOSAL: authoring validates references and public text separately from execution; owner world authoring and engine.

## A08 Balance and numbers

Status: partial. Sources: `DramaFunctionGroup.json, DramaDialogue weight, ArtifactSpriteDialogue prob; prior BREAKTHROUGH_DIGEST.md`.

Shown: content separates weights/probability from eligibility. Realm rows split grade, phase, quality, experience, materials, fate choices and failure features. No universal probability denominator, seeded RNG, pity or runtime numerical ordering established from field names.

PROPOSAL: separate eligibility, chance and pacing in encounter receipts; owner docs/RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md.

## A09 Time and scheduling

Status: partial. Sources: `DramaTrigger triggerCD/isRepeat; ArtifactSpriteDialogue interval; prior SECTS_AND_TIME_DIGEST.md`.

Shown: trigger cooldown/repeat fields and artifact chatter intervals; prior tables specify January/July events and distinct office-vacancy month ranges. Different fields cannot be assumed to share units. Whole world-run scheduler, aging finality and closed-time policy remain unread.

PROPOSAL: each job/trigger declares its clock and unit; owner engine time and commitments.

## A10 Onboarding and reveal

Status: partial. Sources: `DramaDialogue IDs10001-10008; DramaOptions IDs100081/100082; DramaTrigger emit_GameOneLoadSceneMap`.

Shown: early dialogue can branch into joinSchool through option100081 while100082 has no effect and goes to another node. Trigger rows can depend on previous dialogue or dungeon facts when loading the map. Full tutorial ordering and current first-life presentation not established.

PROPOSAL: let invitations offer refusal plus another reachable learning route; owner characters and discovery.

## A11 Little touches

Status: covered. Sources: `ArtifactSpriteDialogue/Sub, DramaNpc, DramaOptions, RoleChat`.

Shown: portrait/avatar references, action and closeness gates, per-line voice assets/animation IDs, hidden choices versus hidden cost flags, click tips, repeatable artifact reactions and timed chatter. This is authored source structure, not audio playback or accessibility evidence.

PROPOSAL: context-aware barks have a budget and relationship gates; owner characters and UI.

## A12 Other systems

Status: partial. Sources: `tale-table-inventory.json; prior REPORT and pass digests`.

Shown: the full available companion-table inventory includes role/skills/items, sect economy/war, world events/dungeons, artifacts/pots, monsters, creator configuration and DLC-prefixed groups. Every available table name/row count is listed in the inventory appendix. Most were only mechanically inventoried; this is not every subsystem in the absent executable.

PROPOSAL: institutions connect reserves, offices and local consequences; owner characters/institutions. Province War may cite the war families, with execution gaps intact.
