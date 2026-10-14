# your-chronicle: aspect pass, 2026-10-14

Status: PARTIAL. Lane `asp-idle`. This is a static source/data extension of the prior dossier, not gameplay, a full semantic read or implementation. SHOWN means inspected source/data, STATED means authored Help/text, INFERRED means analysis; prior native evidence is explicitly labelled. Raw source/text stays in the private work areas linked in TOOLING.

## A01 Dialogue and conversation

Status: partial. SHOWN: dialogue is authored among UpgradeAction rows rather than only a standalone conversation table. A13 has 689 CSV records but 233 distinct nonempty IDs; repeated IDs include staged dialogue. A13HatBoy1 spans three named steps with distinct Fate/item costs and repeated capacity-effect declarations. The payment/effect repetition semantics require the unread parser; do not sum the repeated declarations as three payouts. Prior A10 teacher choices and inherited books remain valid. Full speaker/portrait graph and every dialogue path are unread.

Sources: `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__78___Setting_UpgradeAction_-__Setting_A13.txt:A13HatBoy1`; `../pass-2026-10-14/REPORT.md`.

PROPOSAL: Treat each conversation step as an explicit action with cost, condition, result and a durable receipt. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A02 Narrative delivery

Status: partial. SHOWN: Chronicle table has eight ending rows with RequiredFlags, condition-to-show-name and terminal upgrade IDs. The recovered A13 draw.io XML has 620 mxCell elements: 302 vertices and 315 edges; this is an authoring graph, not proof each edge is executable. Upgrade rows expose Area, FolderId, NextId and HistoryId plus locks/requirements. Selected A13 staged conversation and graph structure extend prior ending predicates, without claiming full A13/A14/A15 route continuity.

Sources: `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__71___Setting_Chronicle_-__Setting_0_All.txt`; `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__104__UpgradeActionFlow-A13.drawio.txt`; `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__78___Setting_UpgradeAction_-__Setting_A13.txt`.

PROPOSAL: Validate authoring graphs against reachable state transitions and keep an earned journal record of the chosen route. Owner: `docs/ENGINE_AUTHORING.md`.

## A03 Implementation architecture

Status: partial. SHOWN: installed Unity IL2CPP build uses encoded settings/translations, plaintext Help and a config that separates replacement, masterData, translation and flow. The restored prior extractor recovered 122 TextAssets; 110 encoded assets round-trip. Prior native dossier records DI/usecase/domain consumers and 111260 method headers, but its raw native corpus is missing and not re-read here. Source data, authoring graph, Help and prior native findings are separate evidence layers. Full tick/DI binding is unread.

Sources: `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__119__Config.txt`; `../INTAKE.json`; `../COVERAGE.json`; `../pass-2026-10-14/TOOLING.md`.

PROPOSAL: Separate content IDs, translations and mutable state; treat dependency registration as part of an implementation trace. Owner: `docs/ENGINE_AUTHORING.md`.

## A04 Save and persistence

Status: partial. PRIOR NATIVE FINDING, not freshly reproduced: shallow Dark Ritual retains Save/SaveR; Reincarnation preserves Save and replaces SaveR, with callbacks/initialization. SaveR owns run-local proficiency; permanent routine completion and inherited access differ. FRESH TABLE: resource ShouldCarryOver and upgrade ToInheritPreviousLoop are declarative exceptions, not a full persisted schema. The on-disk format, autosave cadence, corruption handling, migration and all constructor defaults remain unread because prior native recovery is absent. No personal save was inspected.

Sources: `../traces/RETENTION.md`; `../FINDINGS.json`; `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__78___Setting_UpgradeAction_-__Setting_A13.txt`; `../pass-2026-10-14/CARRYOVER_AND_UNLOCKS.md`.

PROPOSAL: Preview retained access, proficiency, durable objects and current obligations separately; prove import from actual carrier fields. Owner: `docs/ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md`.

## A05 AI and NPC behavior

Status: partial. SHOWN/STATED: ally/enemy settings, battle logs, skills, formations and squad Help describe combat and away assignments. This establishes authored actors and work roles, not independently simulated resident lives or faction planning. Prior formation/effect consumers remain partial. Native target selection, schedules and full damage/Luck order were not recovered in this pass.

Sources: `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__114___Setting_Enemy_-__Setting_0_Normal.txt`; `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/sharedassets1.assets__10__YC_HelpSection.txt`; `../traces/PARTY_AND_EQUIPMENT.md`.

PROPOSAL: Give away allies a real availability and stamina cost, with a returned work receipt. Owner: `docs/CHARACTERS_AND_WORLD_EVENTS.md`.

## A06 UI and information design

Status: partial. SHOWN/STATED: actions are grouped by Area/FolderId; CanHide, HasConfirmationWindow, IsOnNext and translation assets define presentation behavior. Help exposes current versus next strategy, automatic versus manual work and queue behavior. No new pixel layout or runtime proof; full screen scaling/accessibility remains unread.

Sources: `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__78___Setting_UpgradeAction_-__Setting_A13.txt`; `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/sharedassets1.assets__10__YC_HelpSection.txt`; `../pass-2026-10-14/AUTOMATION_AND_PARTY.md`.

PROPOSAL: Place separate live plans, current blockers and earned outputs together on desktop; verify 1366x768 and 1920x1080, mobile deferred. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A07 Content authoring and modding

Status: partial. SHOWN: CSV-like settings and translations plus a readable draw.io graph support data authoring. UpgradeAction fields cover costs, effects, lock relations, prerequisites and inheritance. Repeated IDs and staged names mean unique-ID count and row count answer different questions. A supported public mod API/load order was not established; runtime row folding and graph validation remain unread.

Sources: `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__104__UpgradeActionFlow-A13.drawio.txt`; `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__78___Setting_UpgradeAction_-__Setting_A13.txt`; `../pass-2026-10-14/TOOLING.md`.

PROPOSAL: Validate staged rows without overwriting duplicate IDs in a naïve dictionary import. Owner: `docs/ENGINE_AUTHORING.md`.

## A08 Balance and numbers

Status: partial. SHOWN/STATED: Greed has 22 table rows despite Help saying 20 categories. Typed effect/cost expressions use method families such as Log, Linear and Power; repeated talk rows can repeat a declared effect. Pride reward-count strings require their parser, not literal integer guesses. Native big-number representation, exact RNG, Alchemy rank distribution and full formula order remain unread.

Sources: `../pass-2026-10-14/LATE_SYSTEMS.md`; `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__78___Setting_UpgradeAction_-__Setting_A13.txt`.

PROPOSAL: Compare content declarations with their parsers and consumers before translating balance values. Owner: `docs/ENGINE_AUTHORING.md`.

## A09 Time and scheduling

Status: partial. PRIOR NATIVE: offline usecase validates elapsed seconds, separates nerfed simulation from full-time timers and generates before/after diff. Selected story-upgrade wrapper rejects offline work. FRESH/REUSED TABLE: per-recipe offline eligibility differs from being available to a queue; Help states decay and Sloth controls. No new native time acquisition, autosave loop or crash/idempotence verification. Do not confuse the validation ceiling with effective reward duration.

Sources: `../REPORT.md`; `../FINDINGS.json`; `../pass-2026-10-14/AUTOMATION_AND_PARTY.md`.

PROPOSAL: Use action-specific offline permissions and one settlement receipt; freeze unsupported work explicitly. Owner: `docs/ENGINE_EXPANSION.md`.

## A10 Onboarding and reveal

Status: partial. SHOWN/STATED: progression reveals linked routines, sins, allies, story choices and endings. RequiredFlags and condition-to-show-name keep endpoint knowledge separate from eligibility. Prior mentor commitments can lead across lives to all four retained teachings. Full first-run schedule, Wrath/Alchemy release consumers and all late gates remain unread.

Sources: `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__71___Setting_Chronicle_-__Setting_0_All.txt`; `../pass-2026-10-14/CARRYOVER_AND_UNLOCKS.md`.

PROPOSAL: Let reasonable alternatives accumulate through earned repeat journeys, with knowledge-aware recognition. Owner: `docs/TECHNOLOGY_AND_PROGRESSION.md`.

## A11 Little touches

Status: partial. SHOWN/STATED: readable action groupings, confirmation fields, queue stall options, inheritance markers, current/next commitments and retained-knowledge recognition aid repeated play. Distinguish installed Help intent from native consumption. Accessibility, live performance and full notification behavior remain unread.

Sources: `/Users/weiwei/.codex/research/your-chronicle-2/extract/decoded/resources.assets__78___Setting_UpgradeAction_-__Setting_A13.txt`; `../pass-2026-10-14/SMALL_TOUCHES.md`.

PROPOSAL: Explain the next actionable missing condition beside the choice, without exposing hidden truths. Owner: `docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md`.

## A12 Other systems

Status: partial. SHOWN/PRIOR: routines/classes, summoning, formation, squads, equipment and secondary gear, dungeons, resources, eight Chronicles and seven inspected late-loop families coexist. Gluttony, Greed, Sloth, Envy, Pride, Wrath and Alchemy are an analytical grouping, not every system or a count of prestige layers. SYSTEM_INVENTORY indexes all decoded setting/translation assets and distinct upgraded-content sub-sources; native system census remains incomplete.

Sources: `../REPORT.md`; `../pass-2026-10-14/REPORT.md`; `SYSTEM_INVENTORY.md`.

PROPOSAL: Use surplus resources in competing research, party and workshop destinations with explicit opportunity costs. Owner: `docs/ENGINE_AUTHORING.md`.

The existing one-realm/one-prestige milestone, familiar opening, comfortable unfed play, desktop-first direction and reasonable future reachability remain authoritative. These observations impose no fixed once-ever solo limit, source reset cadence or new mandatory release gate.
