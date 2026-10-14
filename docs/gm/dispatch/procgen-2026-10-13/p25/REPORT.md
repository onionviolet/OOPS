# P25: presentation and export of generated stories

2026-10-14. **PROPOSAL ONLY.** Documentation delivery, with a read-only source audit. No runtime implementation, UI behavior, save parser, leak scanner or canon authentication is claimed. No runtime edits, build, browser run, test suite, private-save access, commit, server or agent launch. All writes are under P25; root owns integration and commits.

## Delivered extensions

| Root code | Concrete addition | Owner here |
|---|---|---|
| T1 | Session boundaries separate from world advancement; frozen generated titles, three-part recaps, late corrections and incomplete coverage | [EPISODES](EPISODES.md), T1.1-T1.5; [MORE](MORE.md), T1.6-T1.8 |
| E3 / T2 | Stories workspace, thread/episode navigation, knowledge-safe filters, occurred/learned timeline lanes, authored-map pins and list fallback | [VIEWS](VIEWS.md), E3.1/E3.2 and T2.1-T2.4; [MORE](MORE.md), E3.3-E3.5/T2.5-T2.7 |
| T3 | Urgent/interesting/ambient attention separate from blocking/expiry; one owner response route, stable focus, honest digest and reading cursor | [TRIAGE](TRIAGE.md), F1-F5/T3.1-T3.4; [MORE](MORE.md), T3.5/T3.6 |
| U1 / U2 | Receipt-backed hero wiki; original light-novel summaries/chapters; shared final-byte disclosure/canon-prose/evidence gates | [EXPORTS](EXPORTS.md), U0/U1/U2; [MORE](MORE.md), U1.2/U1.3/U2.2-U2.4 |
| U3 | Detached extraction from one explicitly player-chosen file, reviewed legend capsule, separate confirmation to admit; legend/ghost/ancestor/branch distinctions | [EXPORTS](EXPORTS.md), U3.1/U3.2; [MORE](MORE.md), U3.3/U3.4 |

Every surface has a low-fidelity Markdown/ASCII desktop sketch and a missing-data path. Target 1366x768 and 1600x1000. Visible proposal: list/filter, readable selected story and evidence/current-control panes share useful desktop space; mobile optimization deferred. These dimensions are future verification targets, not rendered proof.

## Live source audit and its limits

[TRIAGE F1-F5](TRIAGE.md#f1-f5-inspected-source) records exact live feed/UI and P3 branch UI lines. Findings below extend those codes. **SHOWN/SOURCE** means inspected code, not a native gameplay observation. **STATED** refers to a named report/design/source owner; **INFERRED** is P25's bounded conclusion or proposal. Narrative evidence can use the same labels while keeping speaker, primary/secondary quality and confidence separate.

| Code | SHOWN/SOURCE file:line | Finding / concrete implication |
|---|---|---|
| F6 | [simulation.js](../../../../../src/simulation.js):395-410,423-438; [simulation_effects.js](../../../../../src/simulation_effects.js):281-292; [simulation_contracts.js](../../../../../src/simulation_contracts.js):217-218,249-250 | Occurrences freeze response arrays, discovered visibility and cause; response settlement stores `response.at/cause`; terminal display events prune past 100. Equal/higher-stage knowledge can replace the same key, memories retain 32 lines. Inference: capture qualified outcomes/corrections through P14 before display pruning; label what an actor actually learned. Do not parse text or frozen intended effects to infer applied history. |
| F7 | [life_record.js](../../../../../src/life_record.js):1,15,32-46,65-81 | Explicitly lossy biography, at most 64 recent entries and 200 year summaries; first four distinct highlight texts, older counts only. Migration starts at loaded date. Inference: readable legacy summary, not full chronological detail or a restored story. No fabricated old episodes or exact reconstructed wiki totals. |
| F8 | [world_visit_history.js](../../../../../src/world_visit_history.js):21-58,61-69 | Compaction validates/reconciles, retains references and selected ended visits; preview works on a detached copy. Inference: safe pattern for pure preview, but retained visits do not provide every journey beat or a complete map route. |
| F9 | [people_knowledge.js](../../../../../src/people_knowledge.js):6-7,12-39,47-55,76-105; [causal_story_host.js](../../../../../src/causal_story_host.js):458-503 | Introductions/received knowledge gate known people. Causal presentation excludes private receipts/purses/stats and uses received accounts; quoted actions/work remain live-owner controls. Inference: useful known-data sources, not permission to enumerate hidden cast or merge P4 IDs by name. |
| F10 | [causal_story_core.js](../../../../../src/causal_story_core.js):8-9,119-125,170-188,283-298; [causal_story_ids.js](../../../../../src/causal_story_ids.js):13; [causal_story_actors.js](../../../../../src/causal_story_actors.js):83-84; [causal_story_scenes.js](../../../../../src/causal_story_scenes.js):63-104; [causal_story_native.js](../../../../../src/causal_story_native.js):159,203,389-429 | Exact optional ledger with bounded 192 total/64 per-proof receipts, actual evidence/audience validation, private actor facts, scene projection and native publication/validation seams. Inference: narrow history adapter is possible; dumping raw receipts or invoking native load during legend extraction is unsuitable. Do not inject proposed editorial fields into exact validated causal records. |

`causal_story_content.js` was also inspected for command/knowledge/actual-completion shapes, notably lines 12-29,68-117,205-218 and 231-249. It contains authored original cases, not a generic generated-story exporter. `simulation_resolution.js:4-29` supplies seed/effect preparation, and `simulation_ui.js:55,84-95` displays waiting/events/filtered recent logs; neither supplies a retained literary history. The inspected modules need adapters bound by root, not guessed new exports.

## Contradictions and disposition proposals

| Code | Mismatch / evidence | Proposed resolution |
|---|---|---|
| R1 | Dated status map says no generators; P3/P4 branch reports state delivered decks/people and P3 UI exists in its worktree | Separate dated main baseline from isolated branch evidence. Root checks actual merge/served code before any live generation claim. P25 does not revise shared status or certify branch tests. |
| R2 | Main seen decisions globally wait and exclude expiry; P3 nonblocking decisions close safely; E2/E5 propose additional scoped/automatic behavior | Triage consumes actual blocking/deadline/owner policy, never deduces it from `decision`. UI proposals cannot introduce paid automatic choices or an offline scheduler. |
| R3 | Recent news cap eight and P3 local history cap five can be mistaken for complete story retention; life_record is lossy | Keep quick feed bounded while P14 owns retained selected outcome history and coverage. An export cannot recover disappeared facts by expanding prose. |
| R4 | Live feed retains focused rows; P3 rebuilds response cards when clock changes | Propose stable keyed controls/fresh quote checking using existing feed/causal patterns. Source risk only; P25 did not reproduce a native focus defect. |
| R5 | E6 book-pack exports may retain private saved prose and suggests a warning; U1/U2 invite readable shareable files | For new narrative exports require U0.2 projection and final-byte scans, original summaries and locators. A private full save is a different contract. Private-pack placement is not evidence that prose is export-safe. |
| R6 | Intro branch/offline rounds are broad proposals; P3 reports no closed-app advancement. Legend, ghost, ancestor and branch replay can look like one feature | Date recaps only from recorded progression and qualified clocks; keep future absence policy unselected. U3 capsule is an account, while P16/timeline/identity owners qualify actual presence, kinship or replay. No current-world history invented from an import. |
| R7 | E2/P3 authored once metadata exists while user rejects fixed once anti-abuse limits | Report current source honestly; new editorial/import recurrence uses cause-scoped transaction integrity and per-world adjectives. No new lifetime limit, source-hiding workaround or silent removal of existing claims. |

Canon contradiction summaries in [MORE](MORE.md#source-world-fit-without-turning-formatting-into-canon) retain P9/P10 qualification. P25 does not choose a source version or erase a contradictory speaker to make a neat biography. Primary source rereading is required only for a selected claim-dependent canon extension, not for a purely original receipt view.

## S1-S5: ranked future slices, all unselected

Ports are proposals from 21400, not reserved or listening. Root checks active writers/listeners before any selected build. Each slice ends with its own playable proof; none launches another worker from this document. Shared `main`, save, engine, simulation and Notebook joins stay root-serialized. Suggested new module areas below are ownership offers, not created files.

| Rank / ID | Visible route / bounded outcome | Dependencies and proposed owner area | Suggested port | Specific proof gate |
|---|---|---|---|---|
| 1 / S1 Triage | Ordinary activity continues → known live feed matter → correct owner panel → actual response → one settlement notice | Existing feed and causal projection; P3 only after integration for its additional cards. New safe feed adapter + keyed UI area; response mechanics stay existing owners. | 21400 | Compare blocking, nonblocking, expiring, away and busy states; no duplicates, paid auto-answer, hidden badge influence or lost countdown focus; persistence of pending state/reading cursor. |
| 2 / S2 Stories and episodes | Earn ordinary outcome → short recap → inspect sentence basis → close/rename episode → resume same open thread | P14 qualified retained receipts/coverage/edition, P15 deterministic titles/recaps; P12 grouping optional. Proposed `story_reader_*`/editorial metadata area. Narrow existing causal adapter can serve the initial record set. | 21410 | Honest occurrence/learned dates, incomplete old-save history, frozen titles, no render draws; Save/reload/import open and closed episodes and exact next gameplay draws. |
| 3 / S3 Timeline and authored map | Filter a known thread/person/place → inspect occurred/learned lanes → select authored place → return to same receipt | S2 reader, P13/time scope if branch-specific; authored node IDs and known geography. P20/P24 adapters only where selected. Proposed `story_timeline_*`/`story_map_*`. | 21420 | Missing date/coordinates fall back honestly; no future/hidden facets, no invented route; keyboard list/pin parity and same-ID scope isolation. |
| 4 / S4 Hero page and novel | Completed/corrected deed → receipt-backed infobox/history → select chapter set → preview/download original readable document | S2 retained editions, P15 evidence/attribution renderer and P18/U0.2 scan adapters; rich formats optional. Proposed `story_export_*`/`hero_page_*`. | 21430 | Every factual clause supported; contradictions preserved; final bytes including titles/TOC/metadata pass X1-X5; offline reading; exact reviewed preview/file identity, no game state/draw mutation. |
| 5 / S5 Chosen past-life legend | Choose a disposable known test file → detached extraction → cancel safely or explicitly admit reviewed account → read destination legend | S4 scan/delivery contract, verified pure supported save decoder, P14 capsule/account admission. P16 ghost/ancestor mechanics are future reachable extensions, not prerequisites for account-only proof. Proposed `story_legend_import_*`. | 21440 | No private-save enumeration/live loader call; unsupported/corrupt/ambiguous file fails before mutation; cancel/failed write leaves both sides unchanged; repeat capsule idempotent and distinct later legends permitted; exact destination account roundtrip. |

## G1-G5: future implementation and playable gates

All **OPEN / NOT RUN by P25**.

| Code | Required evidence for whichever slice root selects |
|---|---|
| G1 Authority / interfaces | Recover active file owners and integrated P1/P3/P4 status. Bind selected receipt/knowledge/clock/renderer seams and optional additive metadata compatibility; preserve dirty state and old absent-owner behavior. No extra lanes become mandatory through this report. |
| G2 Source / failure behavior | Appropriate focused source checks for selected pure projections, scope identity, draw isolation, missing evidence, stale terms, retention, failed publication and import rejection. Tests/build run only in future authorized implementation; no UI setting can execute domain consequences. |
| G3 Rebuilt desktop journey | Rebuild own candidate and verify served bytes; fresh isolated origin at 1366x768 and 1600x1000. Naturally earn the chosen outcome, read/inspect/filter/respond or export through real controls. Label natural, seeded-native and source evidence separately. Verify keyboard/focus, readable width, enlarged text and reduced motion as applicable; mobile deferred. |
| G4 Persistence / portability | Save/reload pending and settled states, actual native Export and literal-file Import to a second fresh origin. Compare scope, editions/titles, coverage/basis, reading cursors, pending owner state and next draws. Missing revision does not silently rewrite, reroll or grant prior-life goods. |
| G5 Disclosure / content / director | U0.2 X1-X5 for every narrative artifact, including map/recap/excerpt/legend sidecars. Synthetic secret/canon canaries plus qualified local review; reports ID/status only. Confirm supported clause evidence and attribution/locators. Human layout/title/prose/noise acceptance is recorded separately from machine gates. |

## Documentation verification

Read: root considerations first, COMMON, PLAN, PROJECT/USER_VISION/AGENTS, status map, read-only P3/P4 reports/UI, P5 D8/D9/EXTRA_IDEAS, P6 creative works, P7 guidelines, P9 shared/per-world source-timeline-contradiction sections, P10 report, P11 context/requests/dreams/information/MORE, E2/E5/E6/E7 relevant narrative/UI/retention sections, timelines, rivals, cosmic presentation, starts/ends palette and intro branch/time rounds. Sibling in-progress directories are cross-linked with no delivery assumption; P12 structure, P13 rules, P14 contract/chronicle, P15 pipeline and P17 contract informed the boundary. No private prose quotation or source-library modification.

Local documentation checks are recorded in [CHECKS.json](CHECKS.json): required files/proposal markers, relative links, source locator ranges, five-port table, Markdown fence pairing and basic private-source-path/blockquote markers. Manual disclosure/attribution review uses original synthetic examples, ID-only secret references, source-owner locators and no raw canon prose. These checks are a bounded documentation review, not a semantic proof of every possible leak or an implementation of X1/X2. CHECKPOINT records completion and resume authority.

Remaining playable gate: **root selects one bounded slice, assigns actual interfaces/ownership and obtains its own rebuilt desktop plus relevant persistence/export evidence**. Nothing in P25 is currently playable, committed or human-accepted.
