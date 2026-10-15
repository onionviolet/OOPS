# Aspect pass, Kingdom Hearts

Research status: PARTIAL. Covered means the bounded format/mechanism described here was read, not whole-game completion. All source IDs resolve in [SOURCE_LEDGER](../SOURCE_LEDGER.md); full raw tables/text stay private. KH2 is the primary decoded payload, KH1 the narrower room/presentation comparison.

## A01: Dialogue and conversation

Status: partial. Sources: S10, S11, S12.

SHOWN: room entities have talk bindings, global libretto has 1,285 definitions/1,486 boxes, and 16,258 English messages were decoded. Talk IDs, text IDs and scene subtitle/audio tracks are different layers. STATED: docs describe the linkage. Most per-NPC conditions, portrait/speaker joins and branching choices remain unread. Libretto format and reader disagree on termination/version details, so capture counts do not validate every dialogue sequence.

**PROPOSAL:** K6/K20/K23/K31; extend P19/P20/P21 through current Ink/knowledge/feed owners. Preserve stable text/response IDs; do not infer relationship simulation from a spoken line.

## A02: Narrative delivery

Status: covered. Sources: S09, S10, S14.

SHOWN: progression changes room programs and map/access flags; 951 event tracks decoded. EPSD supplies 45 title/summary rows, journal/world-map text states return reasons. LM flag 34 changes EVT program for room 2. STATED: the format docs explain event selection and recap. This is authored conditional progression, not proof of free-running canon simulation.

**PROPOSAL:** K12/K16/K23/K29/K32; extend P10/P12/P20. Select changed scenes from real retained world facts and keep causal aftermath distinct from replay.

## A03: Implementation architecture

Status: covered. Sources: S03, S07, S09, S10, S12.

SHOWN: PC HED name-hash index addresses PKG payloads; original assets can have encrypted/compressed data plus remaster assets. KH2 typed BAR containers separate definition tables, room scripts, spawn records, event timelines and AI bytecode. 339 BDX records decoded; musical mission signals call shared mission traps. Tool parsers are not the original engine, and the native main loop/trap bodies are unread.

**PROPOSAL:** K1/K2/K33/K34; extend P16/P22. Preserve definition/instance/presentation lifetimes, explicit command/effect adapters and validated references.

## A04: Save and persistence

Status: partial. Sources: S13.

SHOWN tool source: save factory identifies magic/version; FM schema exposes story flags, room program selections, visited flags, character arrays, inventory, Drive forms and per-world party. Checksum writing exists; IsValid is a magic check, not full semantic corruption validation. No personal save, platform container, autosave/atomicity, migration or recovery path was tested. Some schema fields carry uncertain/wrong comments.

**PROPOSAL:** K15/K18/K33; extend P16/P24. Preserve the complete native envelope and explicit compatibility decisions; a foreign checksum does not prove safe publication.

## A05: AI and NPC behavior

Status: partial. Sources: S10, S12, S13.

SHOWN: 46 AI-type entries in selected room ARDs; 339 total selected room/mission BDX records decoded. AI format has triggers/work/stack/temp memory; character save definitions expose battle/ability styles. Read LM musical callback and swimming-tutorial mission code, which dispatch shared completion/failure/tutorial traps. Most enemy/partner planners and native trap implementations are unread. No autonomous schedules or social parity established.

**PROPOSAL:** K6/K10/K26; extends P06/P25 only as an audit route. Do not call a scripted guest an autonomous resident; start with a lawful bounded contribution.

## A06: UI and information design

Status: partial. Sources: S07, S10, S14, S15.

SHOWN/STATED: Arif contains command selector/navigation-map item/music, Ftst has nine 19-world color palettes, mission header has pause/help and feedback bindings, messages explain return requirements. Native UI was never displayed, so legibility, keyboard behavior, layout/accessibility and actual animation are unread.

**PROPOSAL:** K11/K14/K19; extend P01/P04/P20. Desktop 1366x768 proposal keeps useful separate panels for current action, retained growth and known local restriction. Mobile deferred.

## A07: Content authoring and modding

Status: covered. Sources: S02, S06, S10, S12.

SHOWN: OpenKH parsers/editor/CLI source supports typed BAR records, room-script compile/decompile, message conversion, BDX decode/encode and package tools. Built IdxImg, SpawnScript and MsgTool; decoded content read-only. OpenKH is community tooling, not evidence of an official mod API or original designer pipeline. Load-order/patch execution not exercised.

**PROPOSAL:** K1/K17/K33/K34; extend P16/P22. Validate conditional precedence and fallback semantics; do not copy a foreign archive schema into production.

## A08: Balance and numbers

Status: partial. Sources: S07, S08, S12.

SHOWN: 13x99 growth rows, three ability-order fields, 45 form rows, 20 progress-conditioned world-level rows, 179 bonus rows, 535 item definitions/151 stat entries, 430 treasures and 303 mission flag headers. STATED: docs explain enabled battle-level contributions and restriction bits. Damage/RNG/form XP award/pity/native scaling formulas unread.

**PROPOSAL:** K3/K9/K10; extend P03/P14/P17. Keep global learning, function, local danger and encounter restrictions distinct rather than one universal level number.

## A09: Time and scheduling

Status: partial. Sources: S10, S12, S13.

SHOWN: cutscene commands use frames; selected tutorial BDX halts while waiting for mission state; mission format supports timers, and save schema has world timers. None establishes idle catch-up, aging, world clock ratios or browser-closed progression. Native pause/frame-rate/timer readers remain unread.

**PROPOSAL:** K12/K18/K26/K32; extend P10/P13/P24. Keep presentation time separate from joined/local simulation clocks. No automatic offline loss/gain proposal.

## A10: Onboarding and reveal

Status: covered. Sources: S10, S12, S14, S15.

SHOWN: LM02_MS101 main trigger opens tutorial text ID 17820; callback signal 34 differentiates message IDs and can open 17822, then lock/exit the mission. STATED local text teaches body-specific movement; map/journal states later ability requirements. Native trap internals and complete tutorial order unread.

**PROPOSAL:** K3/K4/K11/K13; extend P03/P04. Teach the current body and give a known useful return reason, while keeping discovery/access/ownership separate.

## A11: Little touches

Status: covered. Sources: S06, S07, S10, S14, S15.

SHOWN/STATED: local costumes, high-poly scene variants, area music pairs, text palettes, distinct arrival entrances, mission start/finish/fail sounds, optional replay mission names and local movement prompts. These are data-backed touches, not observed game feel. Thirty original applications are in SMALL_TOUCHES.

**PROPOSAL:** K14/K19/K20/K27/K32; extend P01/P12/P14/P21. Match flavor and feedback to the retained local state without inventing new consequences.

## A12: Other systems

Status: partial. Sources: S07, S08, S09, S14.

SHOWN: shop inventories, synthesis-related tables/resources, Gummi assets/text, puzzle-piece save flags, summons/forms and route/key chunks. STATED: route clearing connects worlds; summon text describes party exchange. Exact Gummi graph/warp/ship formulas, synthesis evaluators, collections and remaining collection titles unread. No evidence for a simulated career or universal relationship currency.

**PROPOSAL:** K5/K8/K9/K13/K15; extend P02/P04/P05/P14. Distinct travel activity may link worlds, while local careers need their own grounded systems.
