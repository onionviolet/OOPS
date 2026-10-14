# cultivation-idlers: aspect backfill, 2026-10-14

## Corrections

C1: Close the old Cycle styles.css missing-file gap: the fresh published build includes 193,295 bytes of CSS. C2: Extend the old Idle Xanxia floor-climber summary: this fresh bundle also contains sect duty/mission/promotion and multiple-plane progression. Do not treat its level-derived realm label as a description of every system. C3: Infinite Dao has staged narrative and alchemy/world/book systems alongside its deterministic career ladder. Its UI has stale version strings in localization, so the page label alone cannot pin executable version. Path of the Idle Cultivator is excluded here because its assigned aspects folder already exists.

Static reads only. **Shown** means inspected executable code/data; **stated** means page or declaration; **inferred** means the proposed YAIR interpretation. Covered means the bounded aspect question has source support, not that every record was read. Partial/unread limits stay explicit. Sources are pinned in [TOOLING](TOOLING.md); complete acquired files and raw text remain under `/Users/weiwei/.codex/research/bf-idle-src`. No code/assets/text are copied into YAIR.

## A01 Dialogue and conversation

Status: covered.

Shown: Cycle renders speaker/text arrays, routine versus ambient scene continuation, named archives and unseen-scene filtering. Common Ground boards have authored combination states. Xanxia has enemy dialoguePoolId, cinematics and mission-response text. Dao has storyStage-specific presentation/action branches. Complete every scene/relationship condition remains partial; none implies general social AI.

Sources: [main.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/main.js); [lower_realm_life_ambient.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/lower_realm_life_ambient.js); [common_ground_boards.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/common_ground_boards.js); `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`; `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`

PROPOSAL: Archive encountered scene IDs/facts and preserve the distinction from durable progression. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A02 Narrative delivery

Status: covered.

Shown: Cycle rebuilds milestone text and keeps encountered archives separate from live activity percentages. Dao has prologue/cell/rebirth stage progression; Xanxia stores seenCinematics and authored beats/timings. Narrative can gate or pause progress, while ambient life may remain reward-neutral. Complete campaign closure unread.

Sources: [authored_milestones.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/authored_milestones.js); [main.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/main.js); [game.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/game.js); `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`; `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`

PROPOSAL: Let everyday local texture be readable without forcing it to award currency. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A03 Implementation architecture

Status: covered.

Shown: Cycle has 102 transitively imported readable JS modules, a large engine/UI split and Worker-facing messages. Dao and Xanxia are Vite-style React bundles, formatted as static text with jsbeautifier. Symbol names in those bundles are build-local; no code ran. Runtime internals and third-party bundles were not exhaustively traced.

Sources: [game.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/game.js); [main.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/main.js); [persistence_schema.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/persistence_schema.js); `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`; `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`

PROPOSAL: Keep one authoritative simulation and use render projections for scenes/status. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A04 Save and persistence

Status: covered.

Shown: Cycle schema 64, envelope 2, contract revision 8; typed binary/varints/shared strings, CRC32 and bounded/truncation checks; registered sections preserve unknown fields via extensions and previous-slot recovery. Dao JSON default backfill plus 5-second autosave; import checks mainly numeric spiritStones and reloads. Xanxia profile migration v0-to-v10, primary/last-good/rotating-ring recovery, slot migration and checksummed exports. All error branches/roundtrips remain unrun.

Sources: [save_codec.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/save_codec.js); [persistence_schema.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/persistence_schema.js); [game.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/game.js); `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`; `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`

PROPOSAL: Persist compact IDs/facts and preserve last-good data across failed migration. Owner: src/save_files.js; src/save_compatibility.js.

## A05 AI and NPC behavior

Status: partial.

Shown: Cycle beast adaptation/forms have persistent ranks and current-form effects; ambient actors are authored local-state variants. Xanxia enemy behavior/sect missions and Dao timed duties are controllers, not proof of autonomous NPC schedules. Full beast combat, sect simulation and AI policies unread.

Sources: [bonded_beast.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/bonded_beast.js); [lower_realm_life_states.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/lower_realm_life_states.js); `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`; `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`

PROPOSAL: Distinguish persistent learned companion forms from the one currently expressed. Owner: src/npc_lives.js; world CAMPAIGN.md.

## A06 UI and information design

Status: covered.

Shown: Cycle has life/inventory/technique/records panels, labelled modals, repeated regional cards and activity progress; Dao/Xanxia have React screens, themes and modal surfaces. CSS is acquired but responsive/accessibility behavior unrun.

Sources: [styles.css](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/styles.css); [main.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/main.js); [index-C_AmCosX.css](https://html-classic.itch.zone/html/16442969/assets/index-C_AmCosX.css); [index-BoREYItn.css](https://html-classic.itch.zone/html/17169794/assets/index-BoREYItn.css)

PROPOSAL: At 1440x900, keep current regional activity, progress and history readable in independent panels. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A07 Content authoring and modding

Status: partial.

Shown: Cycle content lives in JS tables, per-region modules and explicit persistence registration. Board combinations are deliberately authored rather than count templates. Dao/Xanxia bundle arrays and functions contain content. No public mod API/load order established.

Sources: [data.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/data.js); [common_ground_boards.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/common_ground_boards.js); [persistence_schema.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/persistence_schema.js); `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`; `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`

PROPOSAL: Validate discovery IDs and persistent sections whenever a campaign adds content. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A08 Balance and numbers

Status: partial.

Shown: Cycle has elemental/lifespan and beast rank constants; previous diminishing/pity findings remain source-bound references. Dao has fixed breakthroughs and random alchemy quality; Xanxia has level-derived realms and separate profile caps/economies. Full formula/edge-case audit unread.

Sources: [data.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/data.js); [bonded_beast.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/bonded_beast.js); [wilderness.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/wilderness.js); `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`; `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`

PROPOSAL: Make local advancement constraints visible without imposing a universal cultivation ladder. Owner: docs/worlds/ABILITY_AUTHORING.md.

## A09 Time and scheduling

Status: partial.

Shown: Cycle separates offline/normal Worker-facing modes and banks time under its existing policy. Dao increments age through timed activities and pauses specific story stages; no reload catchup established. Xanxia displays offline receipt surfaces. Full sampled offline estimator/cap consumers and Cycle worker scheduling remain unread in this pass.

Sources: [main.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/main.js); [game.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/game.js); `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`; `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`

PROPOSAL: Keep life age, work time, paused narrative and outside elapsed time distinct. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A10 Onboarding and reveal

Status: covered.

Shown: Cycle revelation law hides locked systems and retains revealed ones; Body/Mind trial records and manual/auto-continuation distinguish active tests from idle work. Dao story stages and Xanxia seen-cinematic gates introduce panels/mechanics. All later gates unread.

Sources: [data.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/data.js); [main.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/main.js); [core_trials.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/core_trials.js); `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`; `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`

PROPOSAL: Reveal a reachable choice without making every existing option disappear after a missed scene. Owner: src/native_discovery_policy.js; src/observation_channels.js.

## A11 Little touches

Status: covered.

Shown: Cycle ambient hover pauses auto-continuation; distinct routine/ambient timing, load-failure notices and archival grouping. Xanxia warns on backup recovery/default fallback and exposes quota/import errors. Dao offers theme/language settings and transient achievement notices. All rendered behavior unrun.

Sources: [main.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/main.js); [save_codec.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/save_codec.js); `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`; `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`

PROPOSAL: Use explicit recovery-loss notices and a manual reading override during idle play. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A12 Other systems

Status: partial.

Shown inventory: Cycle regional histories/boards, companion forms, trials, academies, houses and later realms; Dao books/alchemy/missions/Dao meditation; Xanxia aspects/Daos/sect merits/promotion/missions/multi-plane map/slots. Not just realm tiers. Full late campaign and all monolithic bundle tables remain unread.

Sources: [common_ground_boards.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/common_ground_boards.js); [bonded_beast.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/bonded_beast.js); [act_three_academy.js](https://html-classic.itch.zone/html/19729143/Cycle%20of%20the%20First%20Dawn%20Public/src/act_three_academy.js); `xanxia: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/xanxia-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/17169794/assets/index-BEq8ZZ4p.js)`; `dao: formatted bundle /Users/weiwei/.codex/research/bf-idle-src/extract/dao-pretty.js (SHA-256 in extract/HASHES.txt; original URL https://html-classic.itch.zone/html/16442969/assets/index-Bywa6CFj.js)`

PROPOSAL: Use institutions, preparation and local history as parallel meaningful paths. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## Remaining scope

Cycle full Acts II/III, all board combinations and Worker/offline consumer joins; Dao all late-world formulas; Xanxia every sect/plane/AI/offline record; exact relationship-gated dialogue counts remain unread. All three public builds acquired statically. No game install needed.

All proposals use the existing actor/stock/job/clock/knowledge/save owners. Preserve reasonable alternative paths, repeatable solo play, one realm/one prestige first milestone and canon-specific rules. UI target for future packets is 1440x900 laptop; mobile optimization deferred. No source/build/runtime/save/human acceptance gate is claimed passed.
