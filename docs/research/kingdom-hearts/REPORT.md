# Kingdom Hearts: one traveler, many local rules

**Research result:** Kingdom Hearts keeps a shared traveler while destinations select local bodies, party members, commands, threats and story state. KH2 makes that split unusually visible in data: a conditional member table, form-aware commands, world-keyed progression scripts and room programs work together. A changed visit can reuse the same destination while loading different people, encounters and access.

**Status: PARTIAL.** The installed KH1/KH2 data was read without launching either game. KH2 received the deeper format/table/script pass. KH1 room resources and presentation variants are shown, but its executable progression, swimming and save rules are not fully traced. See [checkpoint](CHECKPOINT.md), [evidence ledger](SOURCE_LEDGER.md), [world census](WORLD_CENSUS.md), [world digest](WORLD_AND_PORTABILITY.md), [growth digest](PROGRESSION.md) and [story digest](STORY_AND_REVISITS.md).

## Main findings

| Code | What the source establishes | YAIRPG implication | Kit / synthesis |
|---|---|---|---|
| F1 | SHOWN: KH2 `memt` has 37 conditional rows. Land of Dragons changes its local partner from object 100 to 99 under flag 0x2018. Halloween Town has both world and subarea overrides. STATED: zero member IDs fall back rather than erase prior defaults. | A local role/appearance overlay can change without making a new traveler or resetting learned growth. | K2, K6, K14, K15, K22; extends P14, P16 |
| F2 | SHOWN: local Sora object IDs differ for Pride Lands, Atlantica, Halloween Town, Space Paranoids and Timeless River. STATED command masks distinguish Lion and Mermaid forms; mission headers can independently disable drive, magic or summons. | Separate local appearance, body affordances and encounter permission. A costume alone proves no mechanical rule. | K2, K3, K10, K13, K15; P04, P14 |
| F3 | SHOWN: 13 growth tables each contain 99 rows; there are 45 form-level rows, 179 bonus rows and four summon definitions. The tool save schema keeps character growth, form growth and per-world progress in separate fields. | Keep earned state authoritative in its existing owner; project present usability from local context. Entry must not recreate inventory or award XP. | K3, K9, K15, K18; P05, P16 |
| F4 | STATED: the world map and journal ask for drive capacity 5, Magnera and Thundaga on later Atlantica activities. The local text includes swimming controls and musical tutorials. | A world can ask the traveler to return with a function learned elsewhere, then use it in a different local verb loop. Local singing is not generic combat under another palette. | K3, K5, K12, K13; P03, P04, P14 |
| F5 | SHOWN/STATED: progression scripts change saved room-program selection and access. `lm` flag 34 selects a different event program for room 2. 749 room scripts expose event, party, reward, jump and mission bindings. | Revisit the retained destination. Select changed scenes from its causal state rather than create a fresh mission copy. | K5, K12, K16, K17, K29; P10, P12 |
| F6 | SHOWN: English room archives contain separate spawn, script, event and AI entries; 951 event records decode into timed actor/camera/subtitle/audio commands. Global libretto maps talk IDs to text IDs. | Scene presentation and NPC talk are separate channels. Neither proves a branching conversation engine or autonomous social memory. | K6, K12, K19, K20, K23; P19, P20, P21 |
| F7 | STATED: clear Gummi routes to connect worlds before landing. SHOWN: world-point slots, episode summaries, link/flag chunks and world-map keys are distinct data. | Distinguish knowing a destination, opening a route, selecting an entry point and entering it. | K4, K5, K11, K15; P04, P05 |
| F8 | SHOWN: KH1 has 239 selected room archives. Atlantica room resource lists include the local Sora/Donald/Goofy models and a local companion model. Public format docs identify those variants. | KH1 also supports local presentation around a continuing cast. Do not assume KH2 tables, Drive mechanics or all restrictions apply to KH1. | K1, K6, K14, K22; P16 |

## Ranked PROPOSALS

All are unaccepted. Existing synthesis IDs remain unchanged; KH-P codes are local extensions, not new global packet numbers. [Implementation packets](IMPLEMENTATION_PACKETS.md) define bounded gates.

| Rank / code | Proposal and payoff | Owner home | Existing packet / new scope |
|---|---|---|---|
| 1 / KH-P01 | Keep earned powers and possessions; show separately which current body, fuel, place or encounter permits their use. | `docs/worlds/MULTIVERSE_STRUCTURES.md`, `docs/worlds/ABILITY_AUTHORING.md` | Extend P04/P05/P14; new evidence, existing theme |
| 2 / KH-P02 | Return to one retained place after a local event, with a changed service, cast presence or practical route. | Nested-world dispatch owner; canon-events owners | Extend P12/P10; no new quest ledger |
| 3 / KH-P03 | Bind one local body or costume to identity through separate appearance and command rules. | World-kit K2/K14/K22; ability authoring; thematic UI owner | Extend P14/P16; NEW explicit three-layer fixture |
| 4 / KH-P04 | Let a world-specific activity consume a useful earned capability from another setting. | Ability authoring; selected world's K3/K13 card | Extend P03/P04/P14; no universal stat conversion |
| 5 / KH-P05 | Keep companion identity, local availability and story role separate. | `docs/CHARACTERS_AND_WORLD_EVENTS.md`, multiverse owner | Extend P06/P12; NEW party-overlay fixture, no global relationship reset |
| 6 / KH-P06 | Derive a short known return reason from current place state and actual requirements. | Thematic UI owner; means/appraisal owner | Extend P01/P04/P20; actor-known facts only |
| 7 / KH-P07 | Give a local event a presentation track and a separate causal outcome, preserving both through interruption. | Current Ink/native-host owners; start/branch integration owner | Extend P19/P24; no second dialogue engine |
| 8 / KH-P08 | Validate conditional overrides, references and episode transitions before loading a world revision. | K33/K34 content owners; structured-pack validator owner | Extend P16/P22; NEW fallback/conflict fixtures |

## Prior-lane confirmation, correction and extension

| Code | Prior owner / claim | Disposition from this pass |
|---|---|---|
| C1 | Synthesis P14: world/challenge rules change real verbs | CONFIRMS with independent fields for command form masks, mission restrictions and authored local activities. Model variants alone do not establish mechanics. |
| C2 | Synthesis P05: carrier-specific crossing contracts | EXTENDS with retained character/form state versus world-specific party and room state. KH2 save-tool declarations are structural evidence, not proof of every transfer rule. |
| C3 | Synthesis P12/P10: aftermath and separate event stages | EXTENDS with saved room-program changes and world flags. KH2 does not establish the synthesis's full eligibility/priority/cooldown/closure contract. |
| C4 | Start/branch map: derived canon data cannot replace native mutable state | CONFIRMS as an architectural lesson: room definitions/scene selection and persistent character/inventory owners have different jobs. This is an inference, not a YAIRPG implementation audit. |
| C5 | Nested-world owner: destination differs from issued mission | CONFIRMS: a room can bind several mission programs and later story programs. KH world travel is not evidence for a universal employer, settlement system or extraction contract. |
| C6 | Kit K6/K7/K8 ask for lived people, institutions and economy | LIMIT: KH's authored guest party and scenes are not evidence of autonomous careers, local household simulation or general relationship transfer. Do not use this lane as proof those are solved. |
| C7 | Possible naive census: every world slot/row is content | CORRECTS: 19 world slots include technical entries; worldpoint has 512 physical slots but only 54 populated records. No earlier YAIRPG lane found asserting the naive count. |

## Scope and next gate

This is source research only. No production implementation, runtime test, build of YAIRPG, save migration, commit or acceptance claim. Proposed UI fixture: 1366×768 desktop, with supporting 1440×900 and 1920×1080 checks; visible outcome is retained growth alongside truthful local usability and one changed revisit. Mobile, all-world conversion, full companion AI and platform save reverse engineering are deferred.

The next useful research gate is the named unanswered native evaluator for return prerequisites or KH1 swimming/progression. It is not a reason to reopen failed Foundation attempts or delay P01 work feedback. Full raw tables/text/commands are indexed in [private reference](private/REFERENCE_INDEX.md); [source ledger](SOURCE_LEDGER.md) pins tools and evidence.
