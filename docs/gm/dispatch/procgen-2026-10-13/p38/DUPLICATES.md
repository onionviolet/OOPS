# Overlapping contracts and proposed merges

2026-10-14. **PROPOSAL ONLY.** This is a merge map for record authority and semantics, not permission to merge branches or delete predecessor documents. Each row names an overlapping pair or family, the concrete conflict, and its recommended integration. Distinct mechanics survive as adapters/options.

## DP1: identity, history and knowledge

| Code | Overlap pair | Conflict | Recommended merge |
|---|---|---|---|
| DP01 | P7 PersonRef ↔ P19 qualified social person ↔ P12 role bindings | Owner-local IDs and instance/incarnation qualifiers differ | BI1 directory with owner bindings; keep source identity and body/incarnation separate |
| DP02 | P4 generated people ↔ simulation.people | Reference-only travelers are not registered actors and have their own funds | Read adapter first; optional bijective promotion with one selected means writer |
| DP03 | D7 household members ↔ npc_lives ↔ P19/P30 family | Authored annual lives, generated starts and later kinship could clone relatives or double-end them | One identity per admitted individual, separate typed family relations and explicit mortality owner |
| DP04 | Native keys/P2 product ↔ P24 item biography/P36 marks/CR4 IT | Equal keys stack; per-copy deeds cannot attach to a whole fungible type | Type/lot/copy classes; promote selected copy conservatively, preserve P2 immutable product |
| DP05 | D8 facts ↔ P14 HistoricalReceipt ↔ P34 S-2 | Three candidate authoritative histories; S-2 evicts and lacks broad coverage | One successor loreHistory receipt log; D8/P14 accounts become refs/editions |
| DP06 | P19 SocialEpisode ↔ P14 history | Full event per edge duplicates one multi-party outcome | One receipt with role/directed-consequence refs; edge stores no private episode copy |
| DP07 | P20 PlaceEpisodeLink ↔ P14 history | Same outcome affecting multiple places may be counted repeatedly | One receipt indexed by place roles; distinct outcome count |
| DP08 | P21 battle ledger ↔ P14 chronicle ↔ P34 applied deltas | P34 captures only native item/coin/skill subset; battles need actual health/targets/results | Registered battle producer retains its own consequence semantics and emits one sufficient receipt |
| DP09 | D3 chapter settlement ↔ P17 assessment/grant ↔ P23 breakthrough | Recognition can accidentally grant twice for one deed under new rule versions | Shared deed refs; separate assessor/grant lineage and source-owned progress |
| DP10 | P11 N5 rumor ↔ P14 Account/Claim ↔ P19 GOSSIP | Account creation and delivery confused; copied reports could count as witnesses | History owns assertion/edition, transport owns message, knowledge owns received belief |
| DP11 | P24 INFORMATION ↔ P14 BeliefEpisode ↔ P23 interpretation | Truth, confidence, motive and judgment can collapse into one knowledge key | Knowledge façade preserves belief episodes; intention/value endorsements remain P23; no truth overwrite |
| DP12 | P11 N6 libraries ↔ P6 creative works ↔ P14 accounts | Separate work/copy/loan shapes could duplicate books and learning | P6 work/edition/copy, P11 circulation/custody, P14 claims, knowledge actual learning |
| DP13 | KN1/KN4 recipe errors/teaching ↔ P19 teaching lineage/P27 disciples | Copy ancestry can be mistaken for independent proof or full mastery | Shared edition/teaching refs; actual study/practice/execution distinct |
| DP14 | P13 foreknowledge ↔ P24 forecasts ↔ P11 dreams | Expected future, dream and committed past can look interchangeable | P24 facet assessment over P13 baseline; dreams carry memory/forecast claims, no occurred receipt until actual transition |
| DP15 | D6 secret stages ↔ general knowledge ↔ CT1/CL appraisal | Generic understood stage cannot certify sealed discovery | Retain sealed owner and route evidence; knowledge gateway exposes only permitted stage/status |

## DP2: commitments, goals and institutions

| Code | Overlap pair | Conflict | Recommended merge |
|---|---|---|---|
| DP16 | P11 N1 ↔ P34 story_requests ↔ P5 X4 | Multiple offer/settlement stores for the same deficit | One request owner, preserve old P34 terms/receipts through adapter |
| DP17 | Requests ↔ P31 promises ↔ P12 requestRefs | Accepted obligation may be paid by both request and promise | Request offers; promise owns accepted terms/status; one funds/custody settlement |
| DP18 | P31 favor ↔ P19 obligation ↔ chronicle ties/village career | Gratitude, owed work and financial debt differ | Typed obligation binding, retain legacy semantics; directed gratitude never pays a debt |
| DP19 | P6 M7 ritual/vow ↔ P31 oath ↔ P17 power grant | Promise wording mistaken for enforceable magic | One promise instance, separate source-qualified enforcement/grant handler and receipts |
| DP20 | P33 appointment ↔ P11 service/lesson ↔ P31 due | Separate bookings could double-reserve time/tools or punish an unaccepted invite | Appointment references offer/commitment and actual reservation owner; no calendar purse/scheduler |
| DP21 | P23 ambition ↔ P28 intent ↔ P12 arc | Typed user input or goal checkmark could execute work or clone progress | P28 stores interpreted goal ref; P23 owns aspiration; P12 owns admitted graph |
| DP22 | P12 NPC plan ↔ P19 SocialPlan ↔ NP/CR4 maker plan | Two controllers can spend one person's stock/time | Domain plan refs use one scheduler/reservation host; actor-local beliefs and means |
| DP23 | P11 institution ↔ P27 leading group ↔ P33 rank | Membership/office/certification/competence/fame conflated | Faction identity plus typed membership/office/assessment records; separate source-defined consequences |
| DP24 | P19 lineage ↔ P27 disciple ↔ CR4 maker school | Same teaching edge stored three times | Typed biological, teaching and organizational relations with distinct actual lesson evidence |
| DP25 | P27 estate/death ↔ P16 succession ↔ PR/IT5 ↔ P30 family | Death account can transfer property or inherit memory automatically | Life owner confirms ending; temporal/custody owners transfer eligible carriers; family views reference receipts |
| DP26 | P27 crew expedition ↔ P21 venture ↔ P8 logistics | Three stage/cargo/profit ledgers can double-settle | Venture agreement binds actual expedition stages and supply manifest; one cargo/funds owner |

## DP3: presentation, packs, pacing and retention

| Code | Overlap pair | Conflict | Recommended merge |
|---|---|---|---|
| DP27 | P15 semantic frame ↔ P14 Account/Edition ↔ P37 textureCard | Rewording could regenerate facts or create new witness | One known semantic payload, separately pinned original expression revision |
| DP28 | P26 beatSpec/genre ↔ P12 graph ↔ P13 attachment | Authoring outline could override world means/canon causes | Compile metadata into supported P12 graph with P13 bindings; weights are preferences |
| DP29 | P26 gag/firsts ↔ P36 memory/usual ↔ D9 repetition | Separate rings can redefine novelty or prohibit old content | Registered distinct queries over receipts/exposure; local recurrence modifiers preserve legal positive routes |
| DP30 | P25 episodes ↔ P14 ChronicleEdition ↔ P16 idle reports | Session boundaries could settle or rerun work | One reading edition/cursor model over receipts; replay/acknowledgment is presentation only |
| DP31 | P35 codex ↔ CL collection ↔ P25 hero page | Hidden catalogue denominator or raw truth can leak | Observer-qualified collection/query API; known-entry indexes, no hidden totals |
| DP32 | P35 environmental ↔ P20 residue ↔ P36 traces/RX4 | Render could create damage/haunting/contamination | Physical producer owns state and receipt; all three render same survivor/observation refs |
| DP33 | P35 sound/TTS ↔ P15 realization ↔ P25 playback | Audio could repeat event delivery or reveal raw facts | Narrate only safe frozen edition; audio prefs/controller separate, no gameplay receipts from replay |
| DP34 | P22 content-pack metadata ↔ P7/P9 profile ↔ P15 authoring envelope | Pack, source, law, generator and expression revision collapsed | Single pack lock references independent immutable revisions; actual existing loaders unchanged until reviewed |
| DP35 | P22 story request ↔ P28 writers' room/intent | Editorial acceptance confused with NPC acceptance or play proof | Separate editorial request/acceptance artifact; all real gameplay commands still use domain hosts |
| DP36 | P22 bookmark ↔ P28 taste ↔ P32 play telemetry | Dwell/skip/silence treated as vote/consent; feedback imported twice | Explicit marks/revisions feed one taste epoch; telemetry opt-in separate and diagnostic |
| DP37 | D9 storyteller ↔ P28 taste ↔ P26 genre | Multiple selectors/draws or taste resurrecting hard-veto card | One P3 candidate pipeline: hard eligibility, declared local pacing/genre/taste, one saved selection draw |
| DP38 | D9 impacts ↔ P21 battle losses ↔ P23 suffering | Prose/absence/unfed status could become global pressure or morality | Actual measured declared impacts only; no hunger pressure or universal suffering score |
| DP39 | P13 branch ↔ P16 reset/crossover ↔ P24 carriers | Copied save or timeline text becomes in-fiction travel | Temporal manifest explicitly maps identity/means/memory/clocks/RNG; forecast remains separate |
| DP40 | P14 retention ↔ P18 hygiene ↔ P32 LOD | Redundant envelopes and different summary/pin semantics | BI4 shared consumer registry, capability-aware compaction; LOD independent from exact evidence |
| DP41 | P34 eviction ↔ BI2 append-only ↔ P31 future callbacks | Removed operation replays; all request pins fill capacity | Persistent operation directory, explicit pin lifecycle and declared coverage; no count-only reconstruction |
| DP42 | world_visit_history scans ↔ P20/P25 cosmetic refs | Every small scene ref may pin a whole visit indefinitely | Existing scan preserved; future accepted hard/soft ref schema, minimal endpoint/date snapshot where sufficient |
| DP43 | life_record/event_feed ↔ P14 exact history/P25 export | Lossy prose incorrectly treated as obligation authority | Keep legacy display; enrolled exact producers feed log, export labels coverage |
| DP44 | P18 explain/harness ↔ P32 continuity guard ↔ TL QA | Multiple simulators or a safe explanation treated as proof | One P18 harness; guard produces typed disposition, explanations query known outcome/evidence |

## DP4: crafting joins and live contradictions

| Code | Overlap pair | Conflict | Recommended merge |
|---|---|---|---|
| DP45 | P2 product observations ↔ CR1 body response ↔ P24 evidence | Same type law confused with person-specific dose/exposure | Product truth immutable; response owner actual recipient/route; knowledge retains exact protocol scope |
| DP46 | AU/CR3 queue ↔ P6/P8 production ↔ NP/CR4 NPC manufacture | Hero-only counter timer mistaken for actor-aware background scheduler | Reuse pure P2 resolver, existing jobs and selected actor means/clock adapters |
| DP47 | P11 N2 ↔ P8 trade supply ↔ EC/CR4 economy/P21 boom | Duplicate refill, scarcity multipliers or hidden-potency prices | One reconciled quote/stock owner, actual physical supplier and observer valuation |
| DP48 | MK2/IT biography ↔ P11 provenance ↔ P24 item story/P36 BC | Narrative brand mistaken for manufacturing truth or actual contributor | Stable copy/lot ref, receipt contributions and attributed mark separate |
| DP49 | WL/CR2 world laws ↔ P9/P10/P13 source profiles | Universal chemistry flattens exact identity/conservation/era | Pack lock selects local resolver and source evidence; no silent universal substitution |
| DP50 | Common older worktree/commit rules ↔ explicit P38 boundary | COMMON says main writes forbidden except P5 and directs branch commits | Later P38 instruction controls: docs in p38 only, no runtime/build/commit |
| DP51 | Crafting P26-P29 drafts ↔ story P26-P28 numbering | Same lane number identifies unrelated contracts | Use `crafting-lanes/P26-...` through P29 and CR1-CR4; story P26 remains beats, P27 journeys, P28 intent |
| DP52 | Dated root/P2 status ↔ current main merge | User input calls P2 unmerged; main now contains merged P1-P4 source | Record both timestamps and current shown merge/source. P38 claims no integrated native proof |
| DP53 | P34 committed S-2 ↔ dirty S-3/S-4 worktree | During inspection later producer code moved from dirty to committed; it can be confused with the original S-2 slice | Audit 6b0f1f32 separately from S-3/S-4 history changes; recheck current candidate before root integration |
| DP54 | P31 ConfidentialHolding/Evidence/Disclosure ↔ P14 belief/account ↔ P11 N5 | Confidential truth, owned document, believed claim and real disclosure could become another rumor database | Qualified circumstance owner; knowledge holding and message arrival use existing owners; InformationDeal binds one request/promise settlement |
| DP55 | P31 faith/practice ↔ P17 belief/source power ↔ P27 temple group | Prayer text or temple office could imply actual receiver/reception/grant | Practice, offering, actual reception and grant have distinct receipts and actual source handlers |
| DP56 | P35 AcceptedChallenge ↔ P23 ambition ↔ P12 recognition/P26 firsts | Goal text or no visible violations could falsely certify success | Typed goal evaluator with frozen scope/producers/coverage; new attempt keeps prior verdict, no reward from annotation |
| DP57 | P33 other outsiders ↔ P7 identity ↔ P16 selves/carriers/P24 forecasts | Similar origin/name/memories could share body/stock/knowledge automatically | Separate person/carrier entries and source-qualified entry manifests, explicit counterpart links only |
| DP58 | P33 session pacing ↔ D9 pacing/P28 taste ↔ P32 local logs | Attention estimate could change game time, infer taste or create a second selection draw | Separate local presentation preference/aggregate; one future-card pipeline, no wall-time world effects or implicit votes |

No new canon claims are made here. P9/P13/P26 source contradictions remain with their locators and source quality, rather than being resolved by structural consolidation. Unknown source rules are not global prohibitions. All proposed merge targets retain alternate lawful world profiles, powerful exceptions, optional meals and comfortable unfed play.
