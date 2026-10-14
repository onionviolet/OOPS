# P33 rankings, media, calendar, outsiders, session pacing and defeat

2026-10-14. **DOCUMENTATION PROPOSAL COMPLETE.** Everything designed here is proposal. No P33 gameplay implementation, runtime edits, tests, builds, servers, browser play, private-save access, commits or merges. Root owns selection/integration/commits. [CHECKPOINT](CHECKPOINT.md) records scope and evidence. The explicit P33 instruction overrides COMMON.md's older worktree/build/worker-commit defaults; every P33 write stays in this directory.

## Outcome and delivery

Six domain papers extend root story AP1-AU1: [rankings](RANKINGS.md), [in-world media](IN_WORLD_MEDIA.md), [calendar](CALENDAR.md), [other outsiders](OTHER_OUTSIDERS.md), [session pacing](SESSION_PACING.md), [defeat arcs](DEFEAT_ARCS.md). [MORE](MORE.md) adds AP2-AP4, AQ2-AQ4, AR2-AR4, AS2-AS4, AT2-AT4, AU2-AU5 and five cross-domain experiments. These are options, not accepted product decisions or extra required gates.

Proposed visible outcome at 1366x768, checked later at 1600x1000: ordinary actions remain beside a useful public ladder/bulletin, known appointment conflicts, short/expanded episode views and recoverable loss choices. Mobile deferred. One realm/one prestige remains the milestone. Limits follow per-world adjectives; repeats remain reachable; food optional with comfortable unfed play and no hunger death. Public franchise summaries carry locators and SHOWN/STATED/INFERRED qualification, contradictions remain explicit, sealed truths appear only as IDs/routes/status. No raw canon prose or private-note quotation copied.

## Ranked slices, all proposed and gates OPEN

At most five dispatch candidates. Ports 22300 onward are suggestions, not live reservations, availability checks or launch authorization. Root assigns writers and checks ports before later implementation. A dependency is a real integrated API/consumer, not a requirement to finish every sibling proposal. Complete one selected playable checkpoint before taking the next.

| Rank / code | Reach it in play / payoff | Dependencies and proposed ownership | Port | Observable gate |
|---|---|---|---|---|
| 1 / S1 | Finish an actual joint repair → two differently framed bulletin accounts → investigate/correct one → a recipient revises a real offer. Short and expanded P25 views suit the current session | P14/P11 account/delivery plus one real domain receipt; P25 recap/episode, P15 rendering. AT1 soft size factor only through actual P3/D9 seam. New `media_profiles`/projection/view adapter; P14/P11 own stored accounts/claims/delivery, root feed/save/main joins. No separate feed store | 22300 | Received-only evidence, one real changed decision, original/corrected editions retained; short/long views have identical outcomes/costs. Future SOURCE and rebuilt natural desktop/persistence gates G1-G5 |
| 2 / S2 | Lose the agreed road contest → retain wounds/costs → receive a qualified optional lesson → practice and choose rematch/settlement or ordinary recovery | Native battle result, actual teacher/method and P12 arc; P31 only for accepted terms. New `defeat_hooks` admission/content adapter; battle/custody/life/debt owners remain exclusive; root persist bridge | 22310 | Lost versus win/withdraw controls, paid useful lesson without invented victory, free fallback preserved; exact post-loss and mid-recovery persistence. Capture/ransom/rescue remain separately qualified extensions |
| 3 / S3 | Receive two overlapping invitations → book or reschedule real lesson → let other pass harmlessly → later report and useful alternate meeting | P24 existing clock/boundary bindings, P11 provider/appointment, P31 obligation if accepted. New calendar conflict/projection/view adapter; booking owner retains terms/reservations, root scheduler/save joins | 22320 | No double booking; precise pending terms/travel/capacity; unaccepted expiry causes no penalty or freeze; accepted cancellation settles exact escrow; boundary subdivision and roundtrip |
| 4 / S4 | Rival completes funded work and moves an original public board → submit/observe/dispute own result → received edition triggers a genuine offer | P4 actual actor bridge/P7 names, executable work/contest consumer, P14 publication/AQ1 delivery. New board definition/adjudication/edition-reference module; judge/work owners apply results, root save/UI joins. Craft contest depends on CR4/P6 consumer, not just oral potency | 22330 | Independent rival cause changes placement, ties/retraction/certification separate, notice requires receipt; immutable editions and next draw persist; no rubber-band stats or hidden-build reveal |
| 5 / S5 | Meet two independent original outsiders with different supported means/memories → exchange evidence → change an actual prerequisite → one revises a plan after learning it | P16 identity, P24 memory/forecast, P13 scope/reservations, P12 plans, P4/native bridge; actual cheat source/verb. New outsider premise/goal adapter, no second people/cheat/memory store; root coordinated actor/source/save joins | 22340 | Separate identity/stock, one real autonomous action, relevant-only forecast change, claimed versus true origin distinct, sealed/public horizon safe; old saves invent no outsiders and reload does not respawn |

AT1's deeper adaptive inference is reachable beyond the explicit short/expanded control in S1; its independent future gates are in [SESSION_PACING](SESSION_PACING.md). The five rows group six domains without silently treating adaptive telemetry, PHO, supernatural finance or player captivity as implemented by a simpler result.

## Live audit and changed integration state

F1: main source has earned career ranks, reputation totals and titles, but the inspected paths do not establish a generated-rival public ladder. [AP1.2](RANKINGS.md#ap12-source-audited-seams) gives exact `village_career`, reputation and duel locators. Fame, certification and competence must remain separate.

F2: `src/event_feed.js:3-6,37-55,87-102` is an audience-filtered read-only projection. Chronicle invitations already expire: `src/chronicle.js:103-114`; its native calendar anchor is validated at 93-100. [AQ1](IN_WORLD_MEDIA.md) and [AR1](CALENDAR.md) extend those owners rather than creating another rumor store or clock.

F3: legacy defeat is consciousness loss/recovery, not terminal death, now at `src/main.js:3751-3766`; counter save/load at 4991/5416. Agreed duel loss floors HP at1 (`src/native_battle.js:55-67`); party loss retains costs/helper state (`src/party_battle.js:48-59,90-97`). Player-captures-NPC source at `src/causal_story_host.js:327-337` is not proof of the reverse player-capture route. [AU1](DEFEAT_ARCS.md) keeps these distinct.

F4: live main now includes `src/storylet_deck.js:29-40,47-74`, with eligibility/weighting and a single saved draw at a common boundary. `src/simulation.js:407,459-468,501-502` marks new storylet decisions nonblocking, schedules expiry and settles it. D9's earlier main-no-deck audit is historical. New pacing should attach here after compatible hook/validator design; current deck validator at `storylet_deck.js:87` fixes interval equality, so variable cadence needs an explicit compatibility decision, not a casual interval assignment. Candidate `once` at 33 is existing content policy, not authority to impose global lifetime caps on these new systems.

F5: task/root palette described P2 as unmerged. Live `git merge-base --is-ancestor proc/p2-mixing HEAD` returned0 during final audit. Branch tip was `f8fe699487c90ec06e83bfc020dfa8a6dc234705`; source fingerprints matched main and its worktree for all three mixture modules. Main's `src/main.js:1-3` now supplies mixture/generation seeds through P1 streams. Main continued to change through root work during this docs pass; [SOURCE_SNAPSHOT.json](SOURCE_SNAPSHOT.json) records the bounded final inspected inputs. This is observed integration, not a P33 merge or native recertification.

### P2 read-only source audit

Locators are relative to `.claude/worktrees/proc-p2-mixing/`; these three module bytes also matched main at inspection. Its [P2 REPORT](../../../../../.claude/worktrees/proc-p2-mixing/docs/gm/dispatch/procgen-2026-10-13/p2/REPORT.md) is prior worker-reported proof. This pass inspected source only and never reran or added its test counts.

| Code | SHOWN/SOURCE locator | What P33 can reuse / what it cannot infer |
|---|---|---|
| M1 | `src/mixture_state.js:15-45` | Retained ingredient/product truth, separate observations, methods and one job. Outsider/media observers require actual knowledge transfer; cannot read the hidden-method truth into a headline |
| M2 | `src/mixture_state.js:47-79` | Deterministic ratio/process resolution, canonical product ref and knowledge-limited description. Public contest needs a selected judge/test; unknown chemistry cannot be priced/ranked by hidden potency |
| M3 | `src/mixture_state.js:84-98` | Full-envelope holder/product/exposure validation retains consumed-source effect references. Loss/capture must preserve all actual holders and exposures, not recreate inventory from a label |
| M4 | `src/mixture_native.js:5-22,37-43` | Stock/money/product/observation/effect staging and durable write before publish. New appointments, commissions, audience payments or debt need coordinated owner staging, not external side effects after rendering |
| M5 | `src/mixture_native.js:23-33` | Learned method reserves one batch, due at clock + 3, shortage/cancel exact. Admission caps 1-999 and one vessel are current local slice controls, not a universal once rule or general parallel staffing model |
| M6 | `src/mixture_ui.js:21,23-37` | Pure preview/projection plus visible/ready UI polling advances one due batch and schedules next from current supplied clock. It does not establish headless, arbitrary catch-up, offline or simultaneous social appointment production |

A completion receipt adapter must originate in the durable commit domain. There is no P33 media/ranking hook in P2's current `commitMixturePlan`; one must be selected and owned explicitly before claiming the mixture drives public recognition. Keep stock/product/effect truth in P2; CR4 supplies maker/market social causes, CR3 automation, CR2 world law and CR1 body response.

## Reconciliations and owners read

| ID | Conflict or uncertainty | Disposition |
|---|---|---|
| C1 | COMMON's older worktree/build/commit instructions conflict with current docs-only lane | User P33 instruction controls; p33-only writes, no builds or commits |
| C2 | Prompt names crafting P26-P29; live PLAN/root palette call them CR1-CR4, while P26/P27/P28 are story lanes | Link subject owners [CR1 body](../cr1/CHECKPOINT.md), [CR2 laws](../cr2/CHECKPOINT.md), [CR3 play/automation](../cr3/REPORT.md), [CR4 makers](../cr4/CHECKPOINT.md). Story P26/P27 references are used only for their actual subject. No renames/sibling writes |
| C3 | Root palette and early worker docs say unmerged P2/no main deck | F4/F5 live source/history supersede those dated status claims; root's final integration/runtime proof still belongs to root |
| C4 | PHO crowd inference, ORV “chat,” MHA rankings and Persona-style calendar could be generalized too far | Qualified locators in each paper; speculation distinct from fact, indirect messages distinct from unrestricted chat, public rank distinct from strength, calendar adaptation distinct from exact Persona slot/penalty rules |
| C5 | Session fit could alter deadlines or defeat recovery could erase terminal laws | Attention is presentation/soft future selection only; domain loss/clock/terminal policy remains authoritative. Preserve offered versus accepted obligations and existing ordinary recovery |

Required context read: [status map](../../../../PROCEDURAL_GENERATION_STATUS_2026-10-13.md), [materials audit](../../../../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md), [research REPORT](../../../../research/procedural-materials-2026-10-13/REPORT.md), [deep REPORT](../../../../research/procedural-materials-2026-10-13/deep/REPORT.md), [PLAN](../PLAN.md), root crafting rounds 1-2, standing PROJECT/USER_VISION/AGENTS and COMMON. P6 [REPORT](../p6/REPORT.md)/[MORE](../p6/MORE.md) and family sections were reviewed for extension boundaries: [smithing](../p6/SMITHING.md), [tools/textiles](../p6/TOOLS_TEXTILES.md), [repair/salvage](../p6/REPAIR_SALVAGE.md), [cooking](../p6/COOKING.md), [coatings](../p6/COATINGS.md), [patterns](../p6/PATTERNS.md), [agriculture](../p6/AGRICULTURE.md), [constructs](../p6/CONSTRUCTS.md), [invention](../p6/TECHNIQUE_INVENTION.md), [buildings](../p6/BUILDINGS.md), [creative works](../p6/CREATIVE_WORKS.md). [P8 REPORT](../p8/REPORT.md), [P11 MORE](../p11/MORE.md), [P5 extras](../p5/EXTRA_IDEAS.md) remain owners, not duplicated specifications.

## Common future gates, not run

G1 SOURCE: deterministic admission/eligibility and typed cause→consumer; known/unreceived/private distinction; explicit revisions; no preview draws, double settlement, duplicate custody or fabricated NPC means. Check semantic controls specific to each row, not tests mirroring helpers.

G2 NATIVE: later authorized implementation rebuilds, then reaches paid acquisition/action→actual result→known consequence naturally at a fresh origin. Seeded-native fixtures may establish otherwise expensive controls, labelled separately. Agent docs and a matching source hash do not prove gameplay.

G3 PERSISTENCE: pending/completed Save/reload, Export and literal-file Import preserve resolved facts, accounts, observers, bookings, outcome costs, actor/cheat refs and next draws. Old absent-owner saves keep behavior; unsupported meaningful revisions reject before overwrite. Failed writes leave affected owners unchanged. Retention preserves active refs/coverage beyond the eight-row feed; no reconstructing causes from prose.

G4 UI/disclosure: rebuilt 1366x768 plus 1600x1000, comfortable text and useful independent panes/actions, keyboard/focus usable. Inspect headings, sorting, labels, accessibility text and summaries for hidden truth leaks. Sealed routes and source horizons apply before rendering.

G5 DIRECTION/human: no fixed global once restriction, forced exclusive story route, compulsory attention streak, stealth offline advance or hunger death. Canon laws/contradictions qualified. Human tone, severity and pacing acceptance remains open even after technical proof.

## Checks performed and remaining state

Documentation verification results are recorded in [DOC_CHECKS.json](DOC_CHECKS.json): nine required Markdown artifacts, 91 relative targets, nine fragments, 67 source line ranges, 20 semantic anchors, 20 fingerprinted source files, three matching P2 modules and five ranked ports passed. Whitespace and proposal markers also passed. These checks validate this packet and its bounded source citations only. They do not validate the proposed algorithms or certify canon source coverage beyond the described primary/inherited checks.

No new behavior is playable from P33. All runtime/native/persistence/build/UI/human gates above remain OPEN. Root can select a row using its live integration and sibling interfaces; this completed documentation packet creates no further execution authority.
