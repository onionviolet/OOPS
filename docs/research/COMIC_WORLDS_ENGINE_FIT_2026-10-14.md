# Comic worlds: engine fit, ER17

## CHECKPOINT

2026-10-14. ER17 source audit complete. Owns this document and
`docs/gm/dispatch/engine-runtime-2026-10-14/ER17/REPORT.md` only.
All 18 CL, 22 CK and 10 CA rows mapped below. Two synthetic Node probes ran;
no gameplay code, build, personal save, private pack, secret file, commit or
installation touched. Recommendations are proposals. Resume by checking the
comic owner and K-lane status, then qualify a selected bounded scenario, not
by treating these stress fixtures as implemented gameplay.

## Scope and evidence

The [comic palette](../COMIC_WORLDS_AND_MEDIUM_CONSIDERATIONS_2026-10-14.md)
owns CL/CK/CA meaning. These codes are local to that document, not the kit's
CL lens codes. [Engine palette R and S](../ENGINE_RUNTIME_PERFORMANCE_AND_STACK_CONSIDERATIONS_2026-10-14.md#r-comic-worlds-through-the-engine-ce-round-6)
owns CE and AB1-AB15. This audit extends
[E1-E10](../ENGINE_SAVES_AND_SCALE_REVIEW_2026-10-11.md) and the
[offline/branch audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md),
rather than defining another clock or save specification.

READ: live `AGENTS.md`, `PROJECT.md`, user preferences, relevant
`USER_VISION.md` comic direction, [multiverse scope](../worlds/MULTIVERSE_STRUCTURES.md),
[continuity owner](../worlds/LORE_AND_CONTINUITY.md), the
[comic pilot](comics/REPORT.md) and [targets](comics/PLAYTHROUGH_TARGETS.md).
Canon-first order, one connected slice at a time, comfortable idle play,
per-world dials and desktop/laptop priority remain. No UI change is proposed
as delivered; a later panel slice needs rebuilt desktop evidence at its
chosen viewport, with mobile optimization deferred.

K-lane final readback: K5 `CONTINUITY_MECHANICS.md`, K1 `WEBTOON_WORLDS.md`
and K4 `SUPERHERO_GAME_RULES.md` still held in-progress checkpoints. K2's
`MORE_COMIC_WORLDS.md` was absent. K3's completed
[medium/UI output](../gm/dispatch/comics-2026-10-14/MEDIUM_TO_TEXT_UI.md)
and [report](../gm/dispatch/comics-2026-10-14/K3_REPORT.md) arrived during
this audit and were reconciled below. K6 was stopped; W18's completed
[abstraction map](../worlds/world-core-kit-2026-10-14/W18_ABSTRACTIONS.md)
also arrived and was read for shared interfaces and CA overlap. Do not
interpret an unfinished checkpoint as completed source verification. K1 warns
against universal public status windows and conflating distinct rank meanings.
No franchise lore was newly verified here. Pilot counts, including CL3's
return percentage, are dated category observations, not per-death odds or an
engine balance constant.

Evidence: **READ** cites source inspected this run; **MEASURED** refers only
to the commands below; **INFERRED** marks design needs and predicted failures.
All matrix workloads and numbers are **INFERRED**, not benchmark results.
“Fail” means the requested behavior is absent or the stated invariant breaks;
“partial” means an existing narrower mechanism can be reused; “unproven”
means no current timing or capacity verdict is justified. Absence conclusions
are bounded to the inspected owners and handlers, not a claim about every
line of this repository.

## Current support and hard boundaries

| Code | READ support | Consequence, INFERRED unless measured below |
|---|---|---|
| ER17-F1 | `src/world_instances.js:97-131,271-281,308-317`: continuity/era/revision, scalar facts, actor references, played presence clock; exact field allowlist; only `absence:'freeze'`. `:136-155` supplies instance namespaces. | Good detached record seam, not a general multiverse simulator. Tier, observer history and moving absence cannot simply be added to schema 1. |
| ER17-F2 | `src/expansion_engine.js:491,529-531`: fact effects overwrite values; receipts retain the last 100. `src/simulation_effects.js:281-284`: observer knowledge stores one value/stage/time/cause per key. | Neither is append-only fact history. A later equal/higher-stage observation replaces an earlier value; a lower-stage contradictory report may not replace it. Past truth and past belief need separate owners. |
| ER17-F3 | `src/expansion_engine.js:592-640`: cloned plan, joined causal boundaries, blocking choices and 512-boundary budget with remaining time. `src/simulation.js:459-510`: array/object scans, due job order, life endings, conditions and checks. | Useful deterministic local scheduler seam; no per-Earth generic LOD dispatcher or universal offline adapter. The budget is boundaries, not actors/events. One boundary can resolve many jobs. |
| ER17-F4 | `src/expansion_persistence.js:5-16,36-50`: stage into copied envelope, serialize/write before caller publication. `src/save_files.js:204-224`: 4 MiB shared-origin UTF-16 guard. | Reuse one transaction; dormant data still costs whole-envelope copying/writing. Capacity rejection preserves prior save but prevents this larger state from being durably published. |
| ER17-F5 | `src/structured_pack_runtime.js:68-80`: global person keys, duplicate-person guard and pinned origin receipt. `src/world_instances.js:233-235,255-257`: existing actor binding and one active visit per actor. | A template can describe many Earths, but repeating its same hero IDs cannot instantiate independent people through this beginning path. Namespaces must reach bodies, gear, claims, jobs, knowledge and RNG, not just sites. |
| ER17-F6 | `src/simulation_effects.js:316-320,358-360`: explicit resurrection permission, life cause, actor-local title grants/removals. `src/pursuit.js:65-93`: local evidence-funded pursuit and terminal records. | Reviving an authored actor and granting a title have real seams; generic death custody repair, exclusive mantle succession and repeat rogues seasons do not follow from them. |
| ER17-F7 | `src/event_feed.js:37-55,87-102`: discovered/current-world filtering, received reports and eight-item news view. `src/display.js:1019-1029`: per-group DOM log eviction. `src/life_record.js:1,13-15,37-47`: explicitly lossy biography. | Good spoiler boundary for local feeds; neither DOM lines nor lossy biography is an authoritative archive for CK6 links, retcon witness history or off-panel settlements. |
| ER17-F8 | `src/combat_math.js:1-24,29-35,43-58`: numeric hit ratio, rounding, 5% damage floor and shared strike math. `src/gameplay_transactions.js:7-22,62-65`: finite/safe-range gameplay validation. | Descriptor ranks can be presentation; cosmic interaction needs scope/contact/counters before numerical magnitude. Arithmetic near numeric limits is unsafe, but ordinary finite tiers are not thereby broken. |
| ER17-F9 | `src/seeded_streams.js:39-52,57-70`: scoped streams, pure decisions and saved ordinals. `src/cheat_cards.js:1-5,32-44,65`: cards declare future behavior; granting does not execute hooks. | Pure preview tools exist for some random decisions. A simulator/appraisal card UI name proves no runnable whole-game preview or comic cheat. |
| ER17-F10 | `src/feature_expansion_nested_carriers.js:9,31-49,54-65`: actual endpoint/native-owner bindings, clocks, carrier kinds including office/ally, staged transfer. | Valuable narrow carrier adapter; not a generic six-module crossover coordinator or permission to duplicate a living original. |
| ER17-F11 | `src/observation_channels.js:126-138,313-318`: durable recipient-qualified channel receipts and read-only replay. `src/people_knowledge.js:12-29`: introduced-person view excludes private axes/state. | More than a Boolean seen flag already exists. Reuse these evidence/access seams for CK2/3/6 and CA5/7 rather than inventing a second knowledge store. They still do not supply a general historical-truth query or thought-reading power. |

## Comic laws: all CL rows

Foundations and AB dependencies below are INFERRED needs. Each source cell is
READ; the stress/result cell is INFERRED. AB8 compatibility and AB7 publication
apply to every new durable mechanic, even where omitted to keep rows short.

| Code / law | Engine foundations; AB needed | Current code support, READ | Stress case and current verdict, INFERRED |
|---|---|---|---|
| ER17-CL1 Status quo | CE6, RT6/7, MC35; AB1/2/6/7/10/12 | `src/simulation.js:504-510` schedules checks; `src/expansion_engine.js:491` writes facts. | 50 Earths × 100 drift tags, 20 player anchors each. **Fail:** no baseline/anchor owner; blindly resetting facts could undo earned changes or invalidate jobs. Dormant check suppression is not general. |
| ER17-CL2 Sliding time | RT1, CE9, E7; AB1/6/10/12/15 | `src/chronicle.js:92,102` derives linear age/deadline; `src/world_instances.js:108-111` played clock. | 30 years of events, actors age only 5 years, with 40 birth/death records. **Fail:** one linear age transform cannot preserve event order and separate sliding biography. Never rewind the causal clock to slide ages. |
| ER17-CL3 Return from death | CE5/6, E8; AB2/5/6/7/11/12 | `src/simulation_effects.js:316-320` supports explicit revival. | 200 deaths, 10 authored returns, 20 looted unique objects. **Partial:** life flag works; **fail** as a complete revival route without body, inventory, controller and estate reconciliation. No rate is inferred from wiki percentages. |
| ER17-CL4 Retcon | CE1, DA6, MC35; AB3/6/7/8/13 | `src/expansion_engine.js:491`; `src/simulation_effects.js:281-284` overwrite owners. | 1,000 revised facts, 200 witnesses, 150 pending dependents. **Fail:** no as-of truth, remembered old versions or dependency invalidation. See ER17-S3. |
| ER17-CL5 Reboot | CE9, E1/8, DA4; AB6/7/8/9/10/11 | `src/world_instances.js:102-105` exact revision; `src/structured_pack_runtime.js:77-81` pinned origin. | 50 Earths, revision 1 to 2, retain 200 actors and 500 gear copies. **Partial** pinning; **fail** live reboot migration/remapping and recorded retention rules. Revision mismatch is rejected, not converted. |
| ER17-CL6 Crossover | CE3/7, RT7, SB9, MC37; AB1/2/3/7/9/10/11 | `src/simulation.js:401-411` single actor/target event; nested carrier adapter `:54-65`. | One event, 6 worlds, 40 heroes per world, 12 shared relics. **Fail:** no shared event owner, participant barriers or durable per-module completion ledger. Local checks could mint six independent occurrences. |
| ER17-CL7 Legacy | CE5, E8; AB3/5/6/7/11 | `src/simulation_effects.js:358-360` actor title grant/removal. | 30 mantles, 4 historical holders each, 2 rival claimants at one minute. **Fail:** title rows enforce only actor-local nonduplication, not office vacancy, succession, gear and enemy custody. |
| ER17-CL8 Situational power | CE4, RT9, AI6; AB4/5/6/12/13/15 | `src/combat_math.js:34-58` rolls damage; `src/seeded_streams.js:45-52` pure decisions. | Same fighter, 20 contexts, ±30% authored variance, 100 appraisals. **Partial** random/strike seam; **fail** contextual power law and uncertain reading provenance. Repeated viewing must not reroll power. |
| ER17-CL9 Rogues | RT6, CE5/6, AI6; AB2/5/6/7/12 | `src/pursuit.js:65-93` funded pursuit; `:69` rejects an already begun pursuit. | 20 rogues × 10 returns, each learns 5 player habits. **Fail** repeating lifecycle/escalation; existing pursuit is one enrolled record, not ten repeatable seasons. |
| ER17-CL10 Escalation | CE4, PF8, MC6/9; AB4/5/12/15 | `src/gameplay_transactions.js:7-22` ranges; `src/combat_math.js:29-35` arithmetic. | 100 arcs doubling attack, start 100: about 1.27 × 10^32. **Fail** exact safe-range progression on these adapters and no authored ceiling; not necessarily floating overflow at this value. Tier/counter progress can avoid that design. |
| ER17-CL11 Training skip | RT8, E7, offline OT2/5; AB1/2/4/7/8/13 | `src/expansion_engine.js:592-640` consumed/unspent minutes; `src/simulation.js:477-479` jobs. | 7 absent days = 10,080 minutes, 200 trainees, hourly settlements. **Fail** generic closed-tab accrual/montage; one jump may stop at 512 distinct boundaries. Many jobs at one boundary do not each consume that budget. |
| ER17-CL12 Tournament | CE7, RT6, E3; AB2/3/5/7/12 | `src/simulation.js:390-398` encounter withdrawal; `:401-414` events. | 64 entrants, 63 matches, 8 simultaneous venues, 3 withdrawals. **Fail** bracket, roster lock, tie/byes and match result ownership; encounter primitives alone do not select winners/advance brackets. |
| ER17-CL13 What If | CE2/9, RT2/9, MC36; AB4/5/6/8/10 | `src/world_instances.js:271-281` new instance; `src/structured_pack_runtime.js:68-71` duplicate people guard. | 50 Earths × 200 counterpart heroes. **Fail** clone-the-same-IDs initialization; full remapping absent. Storage stress ER17-S1 can fail even with correctly remapped IDs. |
| ER17-CL14 Cancellation | CE7/9, E4/8; AB2/3/6/7/8/9 | `src/simulation.js:490-499` authored life ending can close/refund jobs. | End one world with 40 jobs, 10 summons and 6 shared event memberships. **Fail** world-level ending/withdrawal settlement; life ending is a narrower policy, not cancellation of all world obligations. |
| ER17-CL15 Era tone | CE9, OE4/6; AB6/9/10/12/14 | `src/world_instances.js:100-105` era ID; `src/structured_pack_runtime.js:77` revision pin. | 5 eras, each changes 20 laws and 100 actor descriptions. **Partial** identity; **fail** law resolution by era and revision-aware presenter. Tone must not silently replace body/acquisition rules. |
| ER17-CL16 Comic science | RT5/9, E3/8; AB3/4/5/7/12 | `src/simulation_effects.js:310-322` conditions, explicit death and sources. | 1,000 exposure cases, authored 20% empower/5% lethal/75% injury. **Partial** effects; **fail** a complete exposure-route resolver without declared body compatibility, retained outcomes and custody. Percentages are synthetic, not canon. |
| ER17-CL17 Power society | AI2/6, CE5, RT7; AB5/6/10/12/13 | `src/simulation_effects.js:129,358-360` title facts; `src/gameplay_transactions.js:20-22` reputation. | 1 million residents, 10% powered, 200 named heroes, 3 licensing bodies. **Fail** population/credential owner; simulating 100,000 people individually is unbenchmarked and unnecessary. Licences cannot be inferred from combat rank. |
| ER17-CL18 Sponsors | AI6, RT6, E3; AB2/5/6/7/12/13 | `src/gameplay_transactions.js:62-65` regional reputation; `src/simulation_effects.js:280` routes it. | 10,000 viewers, 20 sponsors, 100 payouts/hour. **Fail** audience deduplication, attention allocation and sponsor contracts. Reputation is not a spendable audience balance. |

## Comic cheats: all CK rows

| Code / cheat | Engine foundations; AB needed | Current code support, READ | Stress case and current verdict, INFERRED |
|---|---|---|---|
| ER17-CK1 Power Grid | CE4/8, RT4; AB5/6/13/14/15 | `src/cheat_cards.js:1-5` appraisal panel identifier; `src/combat_math.js:43-58` numeric stats. | 200 heroes × 6 descriptors = 1,200 fields. **Fail** sourced six-axis ladder/read access; renderer cost unproven. A card name does not implement appraisal. |
| ER17-CK2 Captions | AI6, E9, CE8; AB5/6/13/14 | `src/simulation_effects.js:281-284` knowledge; `src/observation_channels.js:126-138` attributed channel receipts. | 100 narrators, 3 contradictory self-accounts each. **Partial** attributed evidence seam; **fail** generalized self-image, contradictory historical claims and caption access. Latest knowledge value is too narrow. |
| ER17-CK3 Thoughts | AI6, CE5/8, RT4; AB5/6/12/13/14 | `src/event_feed.js:38-39` discovered filtering; `src/observation_channels.js:313-318` recipient replay. | 50 nearby people, only 5 in focus, 10 thought updates/second. **Partial** read admission; **fail** thought generation/focus/range power. Panel means fictional focus, not CSS placement. Timing unproven. |
| ER17-CK4 Next panel | RT2/9, E9; AB3/4/6/7/13/14 | `src/seeded_streams.js:45-52` pure random evaluation; `src/expansion_engine.js:541` cloned plan. | 100 repeated glimpses of one beat with 20 hidden outcomes. **Partial** pure primitives; **fail** whole-beat causal preview/filtering guarantee. No cursor mutation or raw hidden branch state may escape. |
| ER17-CK5 Cover sight | AI6, CE8, RT9; AB4/6/13/14 | `src/simulation_effects.js:281-284` staged knowledge/basis. | 30 forecasts, 10 authored decoys, 5 later disproved. **Fail** forecast truth status, expiry and contradiction history. False covers are readings, not secretly changed world outcomes. |
| ER17-CK6 Editor notes | E4, DA6, CE8; AB6/8/13/14 | `src/expansion_engine.js:529-531` 100 receipts; `src/display.js:1019-1029` evicts lines. | 1,000 note links over 5,000 beats. **Fail** stable archived targets and history-safe compaction; ordinary logs cannot keep every old linked event. |
| ER17-CK7 Recap | RT8, offline OT5, E9; AB1/6/8/13/14 | `src/event_feed.js:87-102` receipts/eight news rows; `src/life_record.js:37-47` lossy folding. | 7 absent days, 2,000 settlements, 30 story threads. **Fail** authoritative return ledger and causal/knowledge-safe grouping; eight news rows are not a complete recap. |
| ER17-CK8 Continuity sense | CE2/9, E1/9; AB6/9/10/13 | `src/world_knowledge.js:3-13` unknown/name/branch view; `src/world_instances.js:100-105` identity. | 50 near-identical Earths, 3 identifying clues each. **Partial** discovery gating; **fail** continuity evidence ranking, conflicts and historical identity. Do not expose authored IDs as known. |
| ER17-CK9 Rogues file | RT4/6, AI6; AB2/5/6/13/14 | `src/pursuit.js:189` pursuit view; `src/event_feed.js:70-73` reports. | 200 recurring foes, 20 next-return dates hidden. **Partial** received pursuit reports; **fail** rogues archive and justified forecasts. A due clock alone grants no knowledge. |
| ER17-CK10 Anchor | CE6, MC35; AB3/6/7/10/12 | `src/expansion_engine.js:491` fact effect; no anchor field in `src/world_instances.js:100-101`. | Protect 20 of 1,000 retconned facts; 10 depend on unanchored causes. **Fail** anchor scope/conflict rules. Preserving one fact may require retaining its costs/dependencies, not only its Boolean. |
| ER17-CK11 Retcon | CE1/9, MC35; AB3/6/7/8/13 | `src/simulation_effects.js:281-284`; `src/expansion_persistence.js:5-16`. | Pay 50 units to revise 1 fact with 1,000 dependent facts, 200 witnesses. **Fail** versioned edit/dependency reconciliation; transaction seam supports payment but does not supply valid retcon semantics. |
| ER17-CK12 Gutter step | RT8, SB5/9, ECX22; AB1/2/3/4/7/12 | `src/expansion_engine.js:592-640` causal advancement/choice stop. | Insert action at minute 4 in a 10-minute skip, jobs due at 3/5/8. **Fail** supported insertion/resume command API; jumping directly to 10 would violate causal order. |
| ER17-CK13 SFX real | RT5, OE4, E3/8; AB3/5/7/12/14 | `src/simulation_effects.js:310-322` bounded authored effects; `src/cheat_cards.js:1` hooks not executed. | 100 KRAK commands target 20 locks, only 10 reachable. **Fail** SFX-to-legal-operation resolver/range. Display text must not bypass costs, permission or object custody. |
| ER17-CK14 Popularity | CL18/CA6, E3, RT9; AB4/5/7/12/13 | `src/gameplay_transactions.js:62-65` reputation addition. | 10,000 viewers repeated across 6 tie-ins, 100 power units per payout. **Fail** shared viewer/diminishing attention attribution; treating each tie-in as new viewers can pay 6 times. |
| ER17-CK15 Mantle claim | CE5, E8; AB3/5/6/7/11/12 | `src/simulation_effects.js:358-360` local titles; carrier kinds `src/feature_expansion_nested_carriers.js:9`. | 2 claimants, 1 vacant mantle, 3 gear objects and 12 enemies. **Fail** exclusive atomic claim/transfer; a carried office kind does not establish possession of its power. |
| ER17-CK16 Variant call | CE2/3/5, MC36; AB2/5/7/10/11/12 | `src/world_instances.js:233-235,255-257` bound actors/visits; nested carrier `:54-57`. | Summon 10 variants, original holds 1 unique relic, 3 refuse. **Fail** counterpart/summon identity, autonomy and custody rules. No copied relic or auto-consent. |
| ER17-CK17 What-If window | RT2/9, E7/9; AB3/4/5/6/7/13 | `src/expansion_engine.js:566-575` candidate effect validation; `src/seeded_streams.js:45-52`. | 20 previews × 60 minutes × 200 actors, then choose one real command. **Partial** cloned planning; **fail** whole-system branch equivalence, budget/abort and knowledge projection. No timing verdict; a preview is not a playable save branch. |
| ER17-CK18 Off-panel growth | RT8, offline OT1-5/9; AB1/2/4/7/8/13/14 | `src/backlog_expansion_time.js:198-216,249-268` bounded elapsed packing; `src/expansion_engine.js:626-640`. | 30 absent days = 43,200 minutes, 200 trainings and one important decision. **Fail** generic training accrual and pause-before-event policy; packing's bounded escrow does not authorize broad offline gains. |
| ER17-CK19 Plot armour | E3, CE7, RT5; AB2/3/5/7/8/12/13 | `src/simulation_effects.js:316-320` life policy; `src/combat_math.js:43-58` strike resolution. | Buffer 3 lethal hits, 2 strikes at one boundary, refill at arc end. **Fail** shared interception order across native/simulation damage and atomic refill/use. Arc refills are per-world terms, not a fixed once limit. |
| ER17-CK20 Fourth wall | CE8, OE6, E9; AB6/12/13/14 | `src/cheat_cards.js:71` messages; `src/event_feed.js:37-55` knowledge guard. | 50 reader-addressed beats, 3 opted reach levels, 10 hidden facts. **Partial** message surface; **fail** authored reach/consent policy for effects and narration. Addressing the reader confers no file/system authority. |
| ER17-CK21 Ink/colour | CE8, RT5, E8/9; AB3/5/6/7/12/13/14 | `src/world_instances.js:116-123` sites/facts; `src/simulation_effects.js:310-322` authored state changes. | Recolour 100 props, remove 10; 3 are load supports, 2 held objects. **Fail** visual-to-causal material/visibility contract and dependency checks. Skin colours do not change perception or structural support. |
| ER17-CK22 Crossover door | CE3/7, E8, MC37; AB2/3/7/9/10/11/12 | `src/feature_expansion_nested_carriers.js:31-49,54-65` actual carriers/clocks/deadlines. | 6 worlds, borrow 12 objects/people for 60 minutes, 2 origins unload early. **Partial** narrow transfer; **fail** general event lease, interrupted return and missing-origin recovery. Preserve custody until a return can settle. |

## Shared comic abstractions: all CA rows

| Code / abstraction | Engine foundations; AB needed | Current code support, READ | Stress case and current verdict, INFERRED |
|---|---|---|---|
| ER17-CA1 Law dials | CE6, OE3/4, RT10; AB9/10/12 | `src/world_instances.js:54-57,100-101` exact definition/instance fields; local policies `src/simulation_effects.js:316-318`. | 50 Earths × 18 dials = 900 values, 5 interacting laws. **Fail** common law block/precedence; ad hoc law systems need compatibility/versioned resolution. |
| ER17-CA2 Skin | CE8, RT4, PF5, OE6; AB13/14/15 | `src/display.js:1019-1029` bounded DOM lines; `src/event_feed.js:102` read view. | Same 1,000 beats in prose/panels at 1600×1000. **Fail** semantic beat/presenter interface; performance unproven. Both skins must expose identical permissible facts/actions. |
| ER17-CA3 Ladder | CE4, PF8; AB5/9/12/13/15 | `src/combat_math.js:43-58` numeric stats; `src/gameplay_transactions.js:16-22` skills/reputation. | 200 heroes, 6 seven-rank axes, 3 incompatible threat/office ladders. **Fail** semantic ladder conversion; an ordinal on one ladder is not a universal combat value. Cheap presentation can precede combat adapters. |
| ER17-CA4 Office | CE5, E8; AB5/6/7/11 | `src/simulation_effects.js:358-360` actor title records. | 30 offices, 120 former holders, 20 impostors, 2 joint offices. **Fail** distinct office entity, exclusive/shared rules and holder history; actor title maps cannot answer vacant office custody. |
| ER17-CA5 Facts | CE1/9, DA6, MC35; AB6/7/8/13 | `src/world_instances.js:120-123` fixed scalar keys; `src/simulation_effects.js:281-284` one observer value. | 1,000 facts × 10 revisions; 200 observers × 1,000 memories. **Fail** schema, as-of/history and selective memory retention. Sparse belief records needed; do not copy every fact to every observer. |
| ER17-CA6 Audience | AI6, RT7, E3; AB2/5/6/7/12/13 | `src/gameplay_transactions.js:62-65` reputation only. | 10,000 overlapping viewers, 20 sponsors, 6-world event. **Fail** distinct audience, attention and spendable sponsorship owners. Aggregate public counts can avoid 10,000 actor controllers. |
| ER17-CA7 Identity pair | CE5, AI6, E9; AB5/6/7/13 | `src/simulation_effects.js:129,281-284,358-360` titles/knowledge. | 200 heroes × 2 personas, 200 observers = up to 80,000 persona-belief edges. **Fail** reveal/suspicion and persona-specific reputation/custody; sparse observations may be much smaller than this upper bound. |
| ER17-CA8 Recurring actor | RT6, CE5, AI6; AB2/5/6/7/12 | `src/pursuit.js:65-93` one pursuit lifecycle; `src/simulation_effects.js:316-320` life cause. | 200 rogues × 20 returns, 5 retained counters each. **Fail** return series/rematch identity/history. Keep old closure causes while starting a new occurrence, not resetting the person. |
| ER17-CA9 Variant link | CE2/5, MC36, E8; AB5/6/8/10/11 | `src/world_instances.js:100-107` parent/continuity IDs, `:136-155` namespaced bindings. | 50 Earths × 200 heroes = 10,000 counterparts with 3 shared baseline facts each. **Partial** instance lineage; **fail** counterpart equivalence links and safe actor/content remapping. A parent instance is not a person link. |
| ER17-CA10 Cross-world event | CE3/7, MC37, RT7; AB1/2/3/7/9/10/11 | `src/simulation.js:403-411` actor-target occurrence; nested carriers `:54-65`. | 6 worlds, 240 participants, 12 shared assets, 3 unloaded modules. **Fail** owner/barrier/local acknowledgments and partial availability; one transaction can stage data but lacks this coordinator's rules. |

## Stress verdicts that matter most

| Code | Workload, INFERRED | Why current code would fail, or what remains unproven |
|---|---|---|
| ER17-S1 Many Earths | 50 instances, 200 named heroes each; at 512 characters of mutable actor state, 10,000 heroes. | Reusing template person IDs fails initialization (F5). Remapping them still leaves about 10.5 MiB UTF-16 in the measured small fixture below, beyond the 4 MiB guard before gear, facts or backups. Dormant clocks can freeze; dormant storage/cloning is not free. Shared immutable templates plus sparse local state and a selected chunked-save route are needed. No measured frame-rate claim. |
| ER17-S2 Crossover | 6 worlds × 40 heroes, 12 transferred relics, 3 worlds dormant, 2 modules absent. | No root event completion vector, origin/destination capability check or deterministic shared-asset arbiter. Resolving local occurrences separately does not make one crossover. An unavailable participant should defer a supported phase or follow a recorded coarse policy, never lose or duplicate the relic. |
| ER17-S3 Retcon | 1,000 facts, 200 witnesses, 150 pending jobs/forecasts; dense witness memory upper bound 200,000 edges. | Scalar facts and overwrite knowledge lose versions; 100 recent receipts cannot reconstruct the past. Rewriting a causal precondition leaves previously quoted work, bindings and forecasts stale. Need revision guards, targeted invalidation and explicit grandfather/refund/recompute rules. Full-history retention size is unmeasured. |
| ER17-S4 Cosmic/street fight | Ordinary attack 100 versus defense 10^12; optional cosmic numeric layer near 10^308. | Numeric damage floor still gives 5 per ordinary landed strike despite vast armor, so it cannot express an authored “no contact” rule. Equal 10^308 attack/evasion gives hit chance 0 through overflow, and damage scaling overflows. Bounded tiers with reach/penetration/counters can work without giant HP. Bigger numbers alone cannot settle intangibility, authority or collateral scale. |
| ER17-S5 Long skip | 43,200 minutes, hourly world milestones, hundreds of jobs per milestone. | 720 hourly boundaries exceed a 512-boundary call budget. Correctly returned remaining time is not a bug; claiming the full skip settled after one call is. This count is illustrative; actual extra boundaries/choices can stop sooner. Closed-tab accrual policy and resumable summary/cursor remain separate missing contracts. |

## Measured synthetic probes

ER17-M1, MEASURED: ran `node --input-type=module` from the repo, importing
`createWorldInstance`, `validateWorldInstance`, `get_hit_chance` and
`mitigateCombatDamage`. A synthetic definition had one city/surface region,
zero sites, scalar `saved:true`, zero claims and a new Earth at played time 0.
Each mutation was made on a separate clone, not a personal save:

| Mutation / fixture | Observed result |
|---|---|
| `facts.saved={value:false,validFrom:1}` | Rejected: `World fact bindings/types differ from the frozen definition.` |
| `tier='dormant'` | Rejected: `Invalid world instance fields.` |
| `clock.absence='moving'` | Rejected: `Unsupported world clock/absence policy.` |
| `Array.from({length:50*200},(_,n)=>({id:'earth.'+Math.floor(n/200)+'.hero.'+(n%200),state:'x'.repeat(512)}))`, JSON in `{actors}` | 10,000 records; 5,492,512 UTF-8 bytes; 10,985,024 UTF-16 storage bytes. Guard comparison is READ `src/save_files.js:204-216`, not an actual browser write. |
| `mitigateCombatDamage([100],1e12)` | 5 damage. |
| `get_hit_chance(100,100)` | 0.53. |

ER17-M2, MEASURED: a second `node --input-type=module` command imported
`get_hit_chance` and `rollBaseCombatDamage` and evaluated:

```js
get_hit_chance(1e308, 1e308) // observed 0
rollBaseCombatDamage(1e308, 1, 1, () => 0.5)[0] // observed non-finite
```

The second command's `Number.isFinite` result was false; JSON renders that
non-finite number as null. Both commands exited 0. These establish source
behavior for selected inputs, not actual imported-save admissibility or a
playable cosmic encounter. No timing benchmark, tests, rebuild or browser
journey ran in this lane.

## Requirements missing as concrete contracts

These extend the palette, not replace it. All are INFERRED proposals. The
palette names history, order and laws, but does not yet state these comic
specific interfaces or invariant gates.

| New code | Additional contract | Foundation/AB informed; minimal synthetic acceptance |
|---|---|---|
| ER17-N1 Two dates for facts | Distinguish when a fact became true in-world from when it was recorded/revised; also keep an observer's learned-at and belief version. A retcon can be learned today while claiming truth last year. | CE1, DA6, AB6/8. Revise 1 past fact today; historical truth and what 2 witnesses believed yesterday remain separately queryable. Do not backdate the engine clock. |
| ER17-N2 Dependency invalidation | Record which facts/laws/revisions a frozen job, forecast, credential and anchor depends on. Retcon stage returns affected commitments and chosen retain/cancel/refund/recompute decisions before publication. | CE1/9, MC35, RT4, AB3/6/7/13. Change 1 cause feeding 1,000 facts and 150 pending jobs; unrelated work survives; costs/rewards/RNG remain conserved under failed write. Retcon is not retroactive free money. |
| ER17-N3 Atomic event phases | A crossover has one durable event ID/owner, phase, participant revisions and completion acknowledgments. Event clock is a coordinator's ordering reference, not automatically a seventh rewarded world clock. | CE3/7, MC37, SB9, AB1/2/3/7/9/10/11. Retry 6 tie-ins in different orders with 2 modules absent; pay each phase once, retain 12 assets and make interrupted return recoverable. |
| ER17-N4 Promotion and demotion | A background hero becoming foreground freezes aggregate history into an actor before participation. Demotion retains custody, obligations and witnessed outcomes; never re-roll a convenient fresh hero. | CE2, RT7, AI6, AB5/6/10. Promote 20 of 10,000 named references, demote/reenter 10; names, injuries, debts and unique items match. This is more than adding a tier label. |
| ER17-N5 Separate contact from rank | Describe targetable layer, reach, penetration, nullification and collateral budget independently of rank magnitude; then call a local combat adapter. Also separate physical power, threat classification and institutional office ladders. | CE4/5, MC6/9, AB5/12/13/15. Street actor cannot damage unreachable cosmic body, but can win a supported rescue/control objective; identical tier fighters still use native arithmetic. This does not select universal combat abstraction. |
| ER17-N6 Semantic beats and capability reads | Persist stable scene/beat/cause references where gameplay uses them, separate from disposable render lines. Separate content kind (speech/thought) from treatment (splash/recap), following K3 U2-U6 and existing P26 templates. Carry speaker, channel, observer authority and uncertainty. Ink/SFX acting cheats resolve supported commands instead of editing render text. | CE8, E4/9, RT5, AB3/6/13/14. Render 1,000 beats in 2 skins; retain 50 linked causes after compaction, reveal only 5 permitted minds and reject structural prop deletion without supported effects. |

K3 reconciliation: game duration, beat order and reader pace are distinct;
neither CSS width nor panel count advances time. CK6/7's ordinary retained
records and usability recap need not require a cheat; inaccessible knowledge
still needs a supported route. W18 reconciliation: AX6/AX15 observation and
explanation should share evidence refs while keeping trusted resolution reads
separate from observer projections. CA7 maps to its AX17 persona proposal;
CA9 and revised starts map to AX14 overlay, whose authoring-copy primitives
do not establish runtime counterpart isolation. These are supporting design
returns, not implemented AB interfaces. W18's native/source acceptance limits
remain intact.

## Ranked proposals by value per effort

| Rank / code | Smallest useful proposal | Cost once; palette informed |
|---|---|---|
| 1 / ER17-P1 | A descriptor selector plus semantic, observer-qualified beat view for one existing world; law and skin remain independent. Prove prose/panel parity without changing its combat. | Low to medium: selector/presenter and durable-link policy; CE4/8, RT4, PF5, AB13-15, N5/6. |
| 2 / ER17-P2 | One office with 2 claimants and one repeat rogue series in a small original city. Reuse titles, life effects and pursuit, retaining their narrower guarantees. | Medium: new office/lifecycle records and failed-write fixtures; CE5/6, RT6, E8, AB2/5/7/11, N2. |
| 3 / ER17-P3 | Two Earths with 2 heroes each, one historical fact and 2 witnesses; combine namespace remapping and bitemporal facts before large retcons. Old scalar saves stay exact via an explicit migration. | High: fact schema, identity remapping and dependency contract; CE1/2/9, DA4/6, MC35/36, AB6/8/10, N1/2/4. |
| 4 / ER17-P4 | One two-world event borrowing one object, then interrupted return. Expand to the six-world stress only after conservation and phase retries work. | High: module capability/phase ownership and return recovery; CE3/7, MC37, RT7, AB3/7/9/11, N3. |
| 5 / ER17-P5 | Run the 50-Earth and retcon workloads through the selected source kernel and rebuilt desktop app, measuring phase costs and save size. Use existing ER1/ER2/ER14 methods rather than another engine rewrite. | Medium once dependencies exist: synthetic harness and browser proof; PF1/2/6, DA1/2, RT7/8. |

Existing related work: [ER1 hotspots](RUNTIME_HOTSPOT_AUDIT_2026-10-14.md),
[ER2 structure](CODEBASE_STRUCTURE_AND_BUNDLE_AUDIT_2026-10-14.md),
[ER12 kernel](OWN_ENGINE_KERNEL_DESIGN_2026-10-14.md) and
[ER14 spike](KERNEL_SPIKE_2026-10-14.md). Their historical measurements are
not rerun results here. A heap, ECS, worker, big-number library or scene engine
does not by itself provide fact memory, identity conservation or crossover
ownership. Select implementation through a bounded playable slice and its
save/reload/import gate; no build or design choice is selected by this audit.
