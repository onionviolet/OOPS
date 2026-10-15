# trimps-antimatter: aspect backfill, 2026-10-14

## Corrections

Both hashes match the earlier pass. No selected reset/perk/automation finding was contradicted. Extend A01: AD has a real authored celestial speech system with requirements, saved quoteBits, speaker styling and replay history. It is linear gated speech, not player-choice dialogue. Trimps has story/combat logs and instructional voices. Prior license-header/text mismatch remains; no code reuse is proposed.

Static reads only. **Shown** means inspected executable code/data; **stated** means page or declaration; **inferred** means the proposed YAIR interpretation. Covered means the bounded aspect question has source support, not that every record was read. Partial/unread limits stay explicit. Sources are pinned in [TOOLING](TOOLING.md); complete acquired files and raw text remain under `/Users/weiwei/.codex/research/bf-idle-src`. No code/assets/text are copied into YAIR.

## A01 Dialogue and conversation

Status: covered.

Shown: AD CelQuotes wraps authored line arrays, requirements and per-celestial saved bits; Quote queues presentation and history. QuoteLine carries speaker display and optional animated word replacement/background blends. Trimps instructional voices and story logs are threshold/caller-driven text. No reply-choice/relationship tree established.

Sources: [quotes.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/quotes.js); [quotes](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula/celestials/quotes); [updates.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/updates.js)

PROPOSAL: Separate earned dialogue eligibility, witnessed speech and replay history. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A02 Narrative delivery

Status: covered.

Shown: AD revisits unlocked speeches; Trimps categorizes Story/Combat/Notices and retains log filter settings. Threshold-triggered narration describes changing layers. Complete story corpus and closure not read.

Sources: [CelestialQuoteHistory.vue](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/components/CelestialQuoteHistory.vue); [quotes.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/quotes.js); [updates.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/updates.js); [config.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/config.js)

PROPOSAL: Give a known scene a reread route while leaving unseen text out. Owner: docs/worlds/PROGRESSION_AND_ASSEMBLY.md; src/data/dialogues.js; src/life_record.js.

## A03 Implementation architecture

Status: covered.

Shown: AD Vue components, ES-module state/mechanics, EventHub and a Chevrotain-based Automator lexer/parser/compiler/backend. Trimps browser globals divide definitions, main logic, updates and UI. These are different architectures despite shared idle loops.

Sources: [package.json](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/package.json); [event-hub.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/event-hub.js); [parser.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/automator/parser.js); [main.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/main.js); [objects.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/objects.js)

PROPOSAL: Prefer a small existing plan vocabulary before selecting a full script language. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A04 Save and persistence

Status: covered.

Shown: AD encodes JSON with compression/base64/text markers and typed conversion, stores slots and timed backup records, checks/patches player shape and controls offline processing. Trimps strips authored/derived fields from cloned JSON, LZ-base64 stores/exports and refuses newer/beta-incompatible saves before main reset. Some invalid old saves reach reset before deeper checks. No universal rollback/error safety proven; all migrations unread.

Sources: [serializer.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/storage/serializer.js); [storage.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/storage/storage.js); [migrations.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/storage/migrations.js); [main.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/main.js)

PROPOSAL: Separate parse, compatibility review and state replacement; retain a last-good route. Owner: src/save_files.js; src/save_compatibility.js.

## A05 AI and NPC behavior

Status: partial.

Shown: Trimps workers/breeding/fights and AD autobuyers are policy/timer machines. Celestial speeches do not establish simulated daily NPC lives. Full enemy/autobuyer strategies remain unread.

Sources: [main.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/main.js); [objects.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/objects.js); [autobuyers](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/autobuyers)

PROPOSAL: Name policies as automation and avoid presenting counters as individual lives. Owner: src/npc_lives.js; world CAMPAIGN.md.

## A06 UI and information design

Status: covered.

Shown: Trimps has a separate screen-reader surface and story/combat summaries; AD tab/page/modal components include save, script and quote history. Existence is not accessibility conformance. Actual desktop layout unrun.

Sources: [ScreenReader.html](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/ScreenReader.html); [updates.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/updates.js); [tabs](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca/src/components/tabs); [modals](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca/src/components/modals)

PROPOSAL: At 1440x900, make current policy, local rule and actual result visible together. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A07 Content authoring and modding

Status: covered.

Shown: code registries for formulas/quotes/challenges; AD DSL tokens create autocomplete metadata and parser rules bind command structure. This is a native script interface, not a public content-mod loader. All grammar/editor roundtrip detail partial.

Sources: [secret-formula](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula); [lexer.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/automator/lexer.js); [parser.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/automator/parser.js); [config.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/config.js)

PROPOSAL: Give a finite native routine a validated command set and explicit unsupported operations. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A08 Balance and numbers

Status: partial.

Shown: Decimal-related large-number handling and authored exponential/reset formulas; saves need numeric reconstruction/patching. Full probability, pity and every balance curve remain unread; earlier Void seed/drop findings retained at same pin.

Sources: [constants.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/constants.js); [serializer.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/storage/serializer.js); [decimal.min.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/decimal.min.js); [config.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/config.js)

PROPOSAL: Use domain-specific display formats without silently changing units or clipping persistence. Owner: docs/TECHNOLOGY_AND_PROGRESSION.md.

## A09 Time and scheduling

Status: partial.

Shown: AD offline ticks have bounds and backup triggers; Automator runtime step state is distinct from text. Trimps has a real-time offline processor alongside normal loop. Exact replay fidelity and all timer interactions remain unread.

Sources: [storage.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/storage/storage.js); [automator-backend.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/automator/automator-backend.js); [main.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/main.js)

PROPOSAL: Persist plan position only with an explicit restart/revalidation policy. Owner: src/feature_expansion_work_plan.js; src/simulation.js.

## A10 Onboarding and reveal

Status: covered.

Shown: tutorial/reveal gates and earned automation stages. Later rule systems can disallow already-earned commands, as earlier Nameless/Pelle findings show.

Sources: [tutorial.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/tutorial.js); [automator-points.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/automator/automator-points.js); [config.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/config.js)

PROPOSAL: Keep an owned tool visible when a local rule blocks its use and name the rule. Owner: src/native_discovery_policy.js; src/observation_channels.js.

## A11 Little touches

Status: covered.

Shown: smoothed celestial background blends, speech history, save-conflict UI, log filters and accessible summary fields. No clinical photosensitivity or accessibility assurance follows.

Sources: [quotes.js](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials/quotes.js); [CloudSaveConflictModal.vue](https://github.com/IvarK/AntimatterDimensionsSourceCode/blob/5409e320cecef96a917cca1dfb68f1f183e499ca/src/components/modals/cloud/CloudSaveConflictModal.vue); [updates.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/updates.js)

PROPOSAL: Offer reduced-motion and readable logs without losing content access. Owner: docs/THEMATIC_UI_AND_INFORMATION_DESIGN_2026-10-12.md.

## A12 Other systems

Status: partial.

Shown inventory: Trimps maps/Portal/perks/heirlooms/bones/Spire/mutations; AD challenges/studies/Glyphs/Reality/Celestial economies/Automator. Full endgame combinations remain unread. No extra YAIR prestige layer selected.

Sources: [playerSpire.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/playerSpire.js); [objects.js](https://github.com/Trimps/Trimps.github.io/blob/b9edb1dfee270ebf81bef8d934dc71276bf8d963/objects.js); [celestials](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/celestials); [secret-formula](https://github.com/IvarK/AntimatterDimensionsSourceCode/tree/5409e320cecef96a917cca1dfb68f1f183e499ca/src/core/secret-formula)

PROPOSAL: Make a later local challenge change action rules, not just add a bigger number. Owner: docs/worlds/ABILITY_AUTHORING.md.

## Remaining scope

All speech callsites and full catalogue counts, full Automator grammar/editor parity, AD migration history, Trimps offline internals/late systems and accessibility conformance remain unread. Steam installs/decompile add no useful static evidence for this pass.

All proposals use the existing actor/stock/job/clock/knowledge/save owners. Preserve reasonable alternative paths, repeatable solo play, one realm/one prestige first milestone and canon-specific rules. UI target for future packets is 1440x900 laptop; mobile optimization deferred. No source/build/runtime/save/human acceptance gate is claimed passed.
