# D2: pack-driven topic talk with choices

Status: **implemented, below floor**. Agent-verified synthetic engine and native
headless fixture, not browser-verified or human-reviewed. [Brief](D2_TOPIC_TALK_BRIEF.md).
No commit, staging, stash, reset, force, push, private-pack edit or player-save access.
Ownership is released to the coordinator for review and integration.

## Direction, seam and ownership

The lead-life direction in PROJECT.md and USER_VISION agrees with this bounded
native talk mechanism. Canon talks and their source locators remain private pack
work; this lane adds no canon content or replay-success claim. X4 Resume 1's
family counts are actor-unknown hypotheses, not confirmed lead coverage.

Rules applied: AR1-AR16, AD6-AD8, AD36, AD38, AD43, AD45, MD1-MD3,
CLR1-CLR12, LSD60 and LSD139. UI patch follows
[the player UI rule](../../../../../.claude/rules/player-ui.md), UR42 and
UR70-UR75, CL228/CL243. No mode setting, cheat or changed past commitment.

| Owned file | Delivery |
| --- | --- |
| `src/cast_topic_talk.js` | Name-free descriptor adapter, complete choice quotes, receipt projection |
| `tests/cast_topic_talk.test.js` | Two synthetic people, three topics; engine and disposable native fixtures |
| `D2_INTEGRATION.patch` | Prepared cast-host registration, native host projection/admission and existing place-panel UI hunks; **not applied in shared checkout** |
| `D2_SAVE_INTEGRATION.patch` | Prepared exact admitted-job lookup in native validator; **not applied in shared checkout** |
| `D2_CHECKPOINT.md` | This receipt |

Public outputs use synthetic IDs. Only these five paths were written. Existing
unrelated changes were retained. `src/book_world_lotm_cast_host.js` remains P7's
shared file; coordinator reconciles the prepared hunks with P7. No `main.js`,
core save writer, clock or transaction owner was edited. The registration goes
through the existing cast `createSimulationRegistry` site. The new leaf has no
imports, so it introduces no cycle. Prepared changes to the domain host, UI and
validator remain outside shared-source ownership.

Target: the populated **1920x1080 desktop** existing place panel. Visible outcome:
a person disclosure contains topic disclosures, the perspective tag "Your
conversation", each branch's minutes, inputs, effects and current blocked reason.
The existing greeting path remains available. No new panel, CSS or navigation;
mobile work is deferred. Headless DOM checks are not desktop layout evidence.

## CLR2 data probe

| Input | Expected | Observed | Gate |
| --- | --- | --- | --- |
| Talk-like commands and cast reach | Inventory | `deriveCast` creates zero-minute `cast_talk_*` greeting commands for local principal records; recurring and role records have no greeting generator. Current local pack: 8 principal, 12 recurring, 16 role records, before remote filtering. Topic rows can target any instantiated known person, independent of tier. | PASS |
| Existing native stock | Inventory | Simulation commands own time, costs, participant occupancy, support loss/refund; knowledge effects own receiver/stage/basis; directed relationship effects own axes and dated memories; gameplay reputation effects own existing region standing; event effects own keyed delayed checks. Native dialogue/response and pathway assessment commands already exist, but do not interpret cast topic rows. | PASS |
| Place-act definition/quote/commit/report route | Inventory | `definePlaceActs` -> cast registry install; `quotePlaceActs` -> native host view; host `act` -> preview then `commitSimulationCommand`; existing clock settles job; knowledge receipt -> `settlePlaceActReports` -> existing persisted Reports publication. Local pack has 9 household acts, 0 topic rows. | PASS |

The inventories came from current source and local pack counts. No missing gate
or below-half input count. H1's validator defect is explicitly covered by the
native fixture, not inferred from JSON serialization. P6's tier optimization is
retained: participating topic jobs use the existing job-participant promotion
path, without a new context or promotion store.

## Pack contract and behavior

`topicTalks` is optional: `{talks:[...]}`. Missing data produces no definitions,
controls, facts or receipts. A row supplies `id`, runtime `personId`, `topicId`,
`label`, `description`, positive integer `minutes` and nonempty `choices`.
Optional `knowledgeKey`, `knowledgeReason`, `place`, `hour`, `hourReason` and
native `requires` express admission. Hours are 0-23 in the host's existing cast
calendar. The prepared native context supplies `topicTalk.hour`; no clock is saved.
An hour selects when a talk may start; crossing the hour during accepted work does
not retroactively cancel it. Knowledge and authored continuing requirements are
rechecked at completion, together with both participants' continued presence.

Each choice supplies `id`, `label`, `report`, native `effects`, optional native
`costs`, optional `requires` and optional additional `minutes`. Command identity
is `<row.id>.<choice.id>`. Quotes include actual resolved cost/effect arrays and
readable summaries before commit, including refusal branches. Existing native
preview and commit revalidate the same definitions; the host's current canon
constraint decision also applies. A schedule-aware `castTalkPreview` port supplies
observer-safe away reasons both when quoting and immediately before committing.
Unknown people stay hidden through the existing known-person facts.

Knowledge effects require their actual basis. Relationship effects reuse
`simulation.relationships`; standing effects reuse gameplay reputation and
therefore require a region already owned there. There is no second bond or
standing store. LSD60's later bond consolidation remains separate; no ownerless
relationship delta was invented. Other effect families are rejected by this
social adapter rather than silently dropped. An optional follow-on is a native
`event` effect referring to an already registered event, with native delay.
Native event checks use keyed seeds; this adapter performs no draws or ordinal
allocation. Registering new event definitions remains the event owner's job.

Both actors participate in the native job, so an occupied or absent participant
refuses admission. If presence/support is lost before completion, native refund
semantics return reserved inputs and award no talk effect. The extra receipt
knowledge retains the topic, choice and participants in its observation basis.
The Reports port publishes completed receipts after persistence and uses an
existing world-fact marker to avoid redisplay duplicates. It retains the latest
occurrence per command, like H1; it is not a new historical event ledger.

## Persistence and integration

**No new save slice, schema, save writer or migration.** Knowledge, relationships,
existing standing, event checks, standard JSON jobs and additive world facts use
their existing owners. Pre-D2 saves remain valid and do not acquire an invented
choice. The validator patch adds `castTopicCommands` to the existing exact
admitted-definition lookup; revision, actor, cancellation, costs and effects
checks remain in force. The fixture rejects a modified saved effect.

Apply/reconcile both prepared patches with P7, then rebuild the combined
candidate. The integration patch includes the UI and domain-host hunks needed to
make controls reachable; cast registration alone is not a player journey.
The focused test applies the patches to a disposable copy, or recognizes an
already applied patch using reverse-check, without mutating shared sources.
Its temporary main exports exist only in that copy. The native fixture loads a
named synthetic observation to introduce the second person, then clicks the
actual place-panel choice. This is a fixture route, not an earned canon route.

Missing packs retain the existing read-only policy. No dormant topic-job bypass
is added: a pending job still requires its matching admitted definition/pack to
pass the native validator, as H1's pending object work does. Pack-loss recovery
for pending topic work is not newly verified. Private pack authoring, generator
retention of `topicTalks`, source-qualified talks and natural replay scoring are
coordinator/content-lane work. No live pack was adopted by this lane.

## Checks and input identity

Final test input is the two owned files plus both prepared patches, applied to a
disposable copy of the then-current shared source. Shared HEAD observed during
receipt: `061f242f7dd9c568c1ea5e5736d53b4e648f4eff`; unrelated concurrent edits are
not claimed as this lane's work.

| Command | Result | Gaps |
| --- | --- | --- |
| `node --test tests/cast_topic_talk.test.js` | PASS 6/6 | Quotes, refusal, knowledge/hour/place gates, away port, both receivers' knowledge, directed relationship, existing standing, follow-on checks, participant loss/refund; patched real native pending Save/reload, settlement, Save/reload, literal Export/Import, tampered-job rejection, pre-D2 save. Synthetic/headless only. |
| `BUILD_OUT=/tmp/yairpg-d2-build npm run build` in `/tmp/yairpg-d2-integrated-r7j9z1_g` | PASS, prepared host/UI/validator patches applied; Ink artifact check passes | Frozen disposable build, no desktop browser journey |
| `npm run check:arch` in shared checkout and patched disposable candidate | PASS, main -59, display -37, save writer 0 growth; 6 grandfathered imports, 205 cyclic edges | Existing baseline retained; no new cycle or core growth |
| `git apply --check --whitespace=error <each D2 patch>` | PASS | Application/whitespace only; coordinator reconciles concurrent host edits |
| `node scripts/lane_review.mjs` with the five exact grants/paths | PASS, 2 source/test files, 118 private names, zero name hits, top-level awaits or outside grants | Static scope/publication review; prepared added lines also self-reviewed |
| Python checkpoint-link and owned-source/doc/added-patch-line whitespace check | PASS | Local links and whitespace only; unified-diff context prefixes retained |
| Full `npm test`, `check:rules`, rebuilt 1920x1080 browser | Not run by lane | Coordinator's combined gate; rules/index unchanged |

Earlier failures were corrected before the final passing run: the engine fixture
needed an existing reputation region initialized; a cancellation assertion
needed absent knowledge handling; the prepared UI hunk needed a closing
parenthesis; the native fixture initially attributed a knowledge effect to the
wrong situation. No production validator check was weakened. A symlinked scratch
architecture entry point initially did not execute its main guard; scripts were
copied and the check rerun with the actual printed counts above.

Final hashes and FLR receipt follow below.

| Frozen input | SHA-256 |
| --- | --- |
| `src/cast_topic_talk.js` | `0bf3082a940c4e1acdf47914d29e36354785e88f4299112fda18f1b7a9d225c4` |
| `tests/cast_topic_talk.test.js` | `a0dafb0671259ff49b34fffbad6a1563bd6b48cfd6971dc9d10d95dbf79678a5` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/D2_INTEGRATION.patch` | `d5b6d76a19a7ab2bec76cb76d171e5d156c4139068d8cc33908420c520351682` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/D2_SAVE_INTEGRATION.patch` | `b1fa8e9c52cfc7cf53e7461b1d90511504315fcf76c84727d0186871e1a7aa8a` |
| `/tmp/yairpg-d2-build/dist/bundle.js` | `dbc333cc93a1b3a2d75b214ae11116540a843682b660b0f1f862085efe15ef12` |

| Floor | Evidence and remaining gap |
| --- | --- |
| FLR1 Build | Patched disposable bundle built, hash above; shared live bundle not rebuilt by lane |
| FLR2 Route | Named synthetic native fixture clicks the real place-panel choice, both participants retained; natural canon and fresh-origin desktop route pending |
| FLR3 Shown | Quotes and disclosure/perspective DOM verified headlessly; rebuilt 1920x1080 visual/interaction proof pending |
| FLR4 Used | Agree/refuse change knowledge and existing directed bonds; knowledge opens a subsequent topic; standing and follow-on use existing native owners in engine fixture |
| FLR5 Kept | Real native pending and settled Save/reload plus Export/literal Import pass with prepared validator patch; no new save slice; browser persistence journey pending |
| FLR6 Labelled | Implemented, below floor; agent-verified synthetic/headless fixture, not human-reviewed |

Coordinator owns applying/reconciling patches, private content adoption, the full
pre-commit suite and the rebuilt fresh-origin 1920x1080 journey including native
Save/reload/Export/Import. Human review is optional. No lane processes remain
running after the reported checks; temporary candidate/build are under `/tmp`.

## Resume 1: integrated fixture and perspective fixes

The coordinator integrated D2 and the H1 validator lookup. The H1 fixture's
literal lookup check incorrectly treated the later D2 command family as absence
of the H1 fix, then tried to apply a stale patch. Its source check now detects
`castObjectCommands` anywhere in the validator lookup and retains the original
native persistence coverage. The control inventory now tags both topic-person
and topic disclosures `in-world`; a focused assertion checks the tag itself.
Rules: CL243, AD36, AR7, AR10, CLR9 and ON9. Owned changes in this resume:
`src/perspective_controls.js`, `tests/perspective_controls.test.js`,
`tests/place_acts.test.js`, and this checkpoint. No commit.

| Check | Result and gap |
| --- | --- |
| `node --test tests/place_acts.test.js tests/perspective_controls.test.js tests/cast_topic_talk.test.js tests/facts_frame.test.js` | PASS 21/21, including both native save fixtures and all three facts-frame game-minute comparisons. The earlier full-suite failure did not recur here; one passing combined run cannot establish whether it was order-dependent or identify its cause. |
| `npm run check:arch` | PASS, main -59, display -37, saves 0 growth; 6 grandfathered imports and 205 cycle edges. |
| `git diff --check -- src/perspective_controls.js tests/perspective_controls.test.js tests/place_acts.test.js` | PASS; tracked resume source/test whitespace only. |

Test input hashes: `src/perspective_controls.js` SHA-256
`64bb791320bf2f02c2b4ba2a5ab4e3a4051fedf21a890bbd072746833d7b0a51`;
`tests/perspective_controls.test.js` `f0f72dfb98730ebcd77c79707bd2378a0fba0aa9f207b71c54e204cd65311d8c`;
`tests/place_acts.test.js` `dc2806c5816554efa5c52144f8c56a1242cac1b0a595849707deee39cbb259dc`;
`src/book_world_lotm_state.js` `9981fb4a44fb1a289658aa8bad6448e2cae070c8468c944c8d99aa397c4729cf`.
The full pre-commit suite and rebuilt desktop browser gate remain with the
coordinator. This resume does not claim browser or human review.
