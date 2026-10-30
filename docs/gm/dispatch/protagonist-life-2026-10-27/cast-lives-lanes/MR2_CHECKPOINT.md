# MR2 checkpoint: memory effects (P3)

Status: **implemented, below floor**. Agent-verified headless candidate, not human-reviewed. Shared integration is prepared, not applied to this checkout. No commit, push, private-pack access or user-save access. Ownership of the five files below is released to the coordinator after the recorded checks.

Authority: [MR2 brief](MR2_MEMORY_EFFECTS_BRIEF.md), [MR1 checkpoint](MR1_CHECKPOINT.md), [design](../LEAD_LIFE_SYSTEMS_DESIGN.md) LSD301/303/331/333/352/356/357/361/373/377; AR1–AR16, AD36/38/43/45, MD1–MD3, CLR2/3/9/12 and FLR1–FLR6. This implements the authorized P3 consumer. It adds no accepted design decision or new world depth. Lead-first direction and reusable, name-free mechanisms remain the owning direction.

## Files and seam

| Owned file | Change |
| --- | --- |
| `src/person_memory_effects.js` | Effect-to-episode conversion, derived bond read, keyed reaction template, keyed daily gossip and detached save-candidate preparation; imports just memory, check keys and generation helpers |
| `tests/person_memory_effects.test.js` | Four focused tests: deduplication, derived/faded bonds, reactions, non-player gossip and detached preparation |
| `tests/person_memory_route.test.js` | Disposable patched native build, five existing regression files and the native UI/save journey, including zero-clock duplicate delivery and failed durable storage |
| `MR2_INTEGRATION.patch` | Carries MR1 registration forward, effect hook, existing bond fact read, workshop line and transactional persistence hook |
| `MR2_CHECKPOINT.md` | This receipt and input hashes |

MR1 source/tests need **no fixes**. Shared files in the patch are `domain_registry.js`, `simulation_effects.js`, `simulation_ui.js`, and `expansion_persistence.js`. The last hunk is necessary: memories must publish after durable saving, alongside the existing transaction. Calling a live memory command while planning an effect would leak trial outcomes and failed saves. `main.js` has no delivery hunk and net zero growth. Disposable test instrumentation is not part of the patch.

## CLR2 probe and route

| Input | Expected | Observed | Result |
| --- | ---: | ---: | --- |
| Existing player commands with relationship effects | At least 1 | 5 Village social commands: working habits, interruption, giving space, practical apology, word after work | PASS: selected `village.working_habits` |
| Existing person/attitude display | At least 1 | Workshop personal detail, inside Notebook → People → Craftsman & workshop | PASS: reuse existing paragraph |
| Existing relationship/panel regressions | Some | 53 tests across five unchanged files, executed against the patched disposable copy | PASS |

Target: **1920×1080**, desktop/laptop. Surface: the existing place-service/person detail paragraph in the workshop panel. Visible outcome: the craftsman's manner names the player's remembered action without exposing a bond number. Mobile, new panels, combat goals, crowds and private-world host wiring remain deferred.

Route kind: **fresh native game with a named meeting prerequisite fixture**. The fresh game speaks the elder's hello. The test then unlocks the craftsman dialogue through the normal rewards owner, replacing the earlier field-clear discovery prerequisite; it does not award the field clear, create a bond or insert an episode. It speaks the craftsman's hello and enrolls the existing workshop. The test opens Notebook and its People tab, expands the workshop and clicks the actual `village.working_habits` button with the headless actionability check. The named line appears in `#workshop_personal_detail`. This is not proof of the entire earned field-clear route.

Synthetic line: “Warmer toward you since you asked about his working habits.” The keyed alternative is “More at ease with you …”. A negative episode selects wary/cooler wording. The route has no explicit witness-presence list in its frozen effect context, so this slice records the affected person's episode and invents no witnesses.

## Mechanism and limits

D1: The existing relationship effect still writes its stored axis and legacy text unchanged. Its guarded delivery also stages an episode input on the detached plan. The receipt now uses key existence, so a receipt stamped at simulation clock zero also deduplicates. At persistence, the injected native calendar dates the episode, with simulation-clock offsets for earlier effects in a batched plan. A small template payload and event-pointer hash are stored in the fact ID; new reaction prose is rendered, not saved.

D2: **No double counting:** the derived read treats the stored axis as its baseline, subtracts the represented feeling for each still-detailed direct episode whose holder matches its origin, then adds kind weight × feeling × current vividness. Thus baseline 5 including a +3 effect reads as 2 + 3 at the event date and softens as the episode fades. Told copies have no mirrored local axis write to subtract. Existing stored axes are not rewritten by a read. Feelings use MR1's bounded integer range; any unrepresented fractional/large portion stays in the legacy baseline. This adapter deliberately preserves legacy effects. MR1 impressions do not retain axis/template metadata: compacted or forgotten details fall back to the stored baseline, and do not supply a named reaction. A later conversion of all legacy relationship consumers/compaction is not claimed here.

D3: Reaction detail defaults to visible while vividness is at least **0.25**, a replaceable world dial so faint memories stop dominating ordinary manner. The strongest relevant episode explains the reaction; a keyed person/subject/fact/bond/day draw picks its phrasing. An empty slice adds no line. The selected panel is English already, so no parallel Chinese renderer was added.

D4: At a native save transaction boundary, each living holder gets one daily gossip opportunity, recorded in existing simulation causes. A listener needs an existing nonzero derived bond of at least one unit, the same world and location, and a living simulation body. Strong detail defaults to at least one feeling unit, vividness 0.25 and certainty above 20. The strongest episode is told to a keyed listener with `tellMemory`, losing 20 certainty. Eligibility reads the start-of-step memory snapshot, so copies do not cascade around the room in one step. Repeated delivery of the same fact does not refresh its date or certainty. A daily opportunity with no listener does nothing and is spent for that holder; a new meeting can be tried on the next day. No travel or closed-browser catch-up is introduced. The daily check runs on an existing persistence boundary, not on rendering or an independent timer.

The chosen defaults and their costs are implementation proposals within P3, not new accepted rules. MR1 caps and opaque-ID limits still apply. The adapter does not migrate legacy prose or infer past episodes. Missing old-save memory uses MR1's empty migration. No new saved bond, vividness or reaction field is introduced.

## Checks and remaining floor

- C1: `node --test tests/person_memory_effects.test.js tests/person_memory_route.test.js tests/person_memory.test.js tests/person_memory_persistence.test.js` → PASS, 13 tests in the combined run. The final combined run uses the explicit meeting fixture and the normal expanded Notebook view; no discovery or pixel proof is inferred from the headless route.
- C2: `node --test tests/person_memory_route.test.js` → PASS, 1 route test; 53 patched existing regressions passed. This test runs `node --test --test-reporter=tap tests/simulation.test.js tests/everyday_life.test.js tests/simulation_ui_hidden.test.js tests/simulation_hidden_display.test.js tests/simulation_extensions.test.js` in a copied, patched tree with `NODE_TEST_CONTEXT` removed → 53 passed, zero failed; no existing test source changed.
- C3: `npm run check:arch` → PASS in the shared checkout. The patched disposable candidate also passes `node scripts/check_architecture.mjs` before adding test exports. Counts: `main.js` 10064/10115, `display.js` 6730/6767, `save_files.js` 310/310; 6 grandfathered main imports, 205 cyclic edges, no new edges/growth from MR2.
- C4: `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR2_INTEGRATION.patch` → PASS against the current unapplied host tree. Apply this combined patch, not MR1 followed by MR2.
- C5: `node build.js` with disposable `BUILD_OUT` → PASS within the route test. Final instrumented disposable bundle SHA-256: 465f8185c785d99c23b0da546224475f11fa8e724417196aaa3392fcd1741240. This is not the installed app bundle.
- C6: Whitespace/link/owned-file checks → PASS: local Markdown targets exist and five owned files have no trailing whitespace. `npm test`, `npm run check:rules` and the coordinator's normal candidate build remain coordinator checks; no rule/index edits were made here.

| Floor | Evidence / remaining gate |
| --- | --- |
| FLR1 Build | Rebuilt disposable candidate and hash above; coordinator's combined normal bundle pending |
| FLR2 Route | Fresh native meeting fixture and actual eligible workshop click passed headlessly; earned discovery route and rebuilt 1920×1080 browser proof pending |
| FLR3 Shown | Named line checked in rendered native panel text, absent before action and after faded-date fixture; pixel/layout proof pending |
| FLR4 Used | Relationship effects produce saved episodes; bond fact read and visible manner consume them; non-player co-present gossip tested |
| FLR5 Kept | Real Save → reload → Export → literal Import preserves episode and panel line; old slice-absent import adds no line; no user data used |
| FLR6 Labelled | Implemented, below floor; agent-verified headless candidate, not human-reviewed, not committed or installed |

## Coordinator steps

1. Recheck the host input hashes and `git apply --check`, then apply **MR2 only**. If MR1 was already applied, reconcile the registration hunk rather than registering `memory` twice. MR1's prepared patch remains unchanged.
2. Run the focused command above if relevant inputs changed, then the required combined build, architecture/rules checks and single full suite at commit. This lane makes no commit.
3. On a fresh test origin with the rebuilt normal bundle at 1920×1080, earn/unlock the craftsman meeting, meet him, enroll, open Notebook → People → Craftsman & workshop and ask about working habits. Record the visible named reaction, no-episode baseline and changed/faded case. Exercise Save, reload, Export and literal Import in that browser; record its normal bundle hash and any acceptance gap. Mobile remains deferred.

## SHA-256 input identities

Hashes below identify the live inputs read for this lane at handoff. The route test independently builds from a copied current tree; its bundle hash above identifies that disposable candidate. Shared-checkout movement after these hashes requires a fresh integration check.

| Input | SHA-256 |
| --- | --- |
| `AGENTS.md` | `28df652b0d6dd23eece5a934669a5867880b806a7d2bd85aa680f06d01b1bf47` |
| `docs/GROUND_RULES.md` | `5f164d8086e9d9b8eaccf0f55f9263fc3678f93918811d27b63560186742bc0a` |
| `PROJECT.md` | `966c6aa18ae7ac2daa566c51292bd6af1dbcc4b65952161be5b46bdd3914d37d` |
| `docs/USER_VISION.md` | `4034586d6b683128a656dc5d2396b794bb59ffee96dfaaacb10ea11709ccc20f` |
| `.claude/rules/runtime-code.md` | `ebc70ac414a53e4fd29632b86c2dd1e554b99af10810f02a65d3eb9096d8f507` |
| `.claude/rules/player-ui.md` | `edfaf9121522e015c0efa8f520ef272309df23bc2346cb9e364c1afe4350daf1` |
| `docs/ARCHITECTURE_RULES.md` | `28ce1b5339cd0055d4a44cc93a7af7a9d261952ce9a3cfbb5b1517b2ecee5a3b` |
| `docs/UI_RULES.md` | `6b6a6f5fdb1f10d669fc66add4877bb3b61d3171280ef84944f2833dc6cdacd5` |
| `docs/LEAD_LIFE_RULES.md` | `2687f617f3fa051b7e3fd8267ccf5bd0c29b6550c6792e3fe2a6fed47ce1df99` |
| `docs/LEAD_LIFE_GUIDE.md` | `a209b5474bf43798831e2401a25c65590c7f5a65bfb2a7ab270cb21f6df4750b` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/CAST_LIVES_CARD.md` | `8477b101916d2152ae577b09681a00f6254b2c1e055d749fb11a7a77a4684f82` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/COORDINATOR_HANDOFF_2026-10-28.md` | `8aaba8a07d1ae900f109c16039da0709a6a9f31228be8caff9e109b292c388b2` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md` | `e17659db635614ab8f14d0cf1d40bc4260d743d7f53ec51f5e792e8cb3bdf96f` |
| `src/person_memory.js` | `32cc21ea6c5c3d87da91fffecfa68f25a5291c05535153909f133009e69eac26` |
| `src/check_keys.js` | `391d2ae7bf4279318b5455e87c44ec4dfb60019e0c47cb1d52c4e45e28769209` |
| `src/gen_kit.js` | `bbbd05aea220aae5f1a8af48252f771851ad089690c9e68f2be0e19c99d38ec4` |
| `src/domain_registry.js` | `d8c0ffd423e1dbcb00dc9098e3e9eacb815cb5346e3dfa76c3229282a16ce07b` |
| `src/simulation_effects.js` | `834a310ac85ca5af94bfa5d13fe27c7eac76fd629f66cd915da00e3b2843d91d` |
| `src/simulation.js` | `2f3bdb49559630943f2f069e81abc395842f6ff979786b592b0f84abd8dd2dda` |
| `src/simulation_ui.js` | `45ad7ea1e33582de866b3cba56659a2191ca78c15a2e692d291d9337945ab946` |
| `src/expansion_persistence.js` | `d51c85a3cc450bc996f1b6158b1e022307d484d3589ab4948bc46ada76a71892` |
| `src/everyday_life.js` | `cabf413b30aa7928aa651e0c172fd9aba88c4f283581694c84ece9fa1c908215` |
| `src/simulation_content.js` | `e66d8685a7f77cb987a64b11e3079e826e8dac3f1653da655276bb37fd4cbc5a` |
| `src/world_rhythm.js` | `3cf3f252ec073c0011ac8471e4fedcd313a8a7f7fe35c6adfc3591e8111553df` |
| `src/main.js` | `56e0989e56a2f5e9e4341addacaeeb92b2d484ae344c58f06d67a9e143475394` |
| `src/adventure_notebook.js` | `aa61e97ba807843ce338c668e79f079971b47c188adf0528f33d59f315f3575f` |
| `src/workspace_layout.js` | `e4a2bc82184aeb45ee9864df40e917b5d3a48450b45fcdce615d9f71cb6a3514` |
| `src/seat_profiles.js` | `618ac3196c12edef27167a30c3a1863b28f1250e2bf68e0c8b2efae155f6adc3` |
| `src/data/dialogues.js` | `54665152b8ab468fc45d83cc5f006dbd9e3a67f1fef5e7a943fa6773379ad040` |
| `src/data/npcs.js` | `69961a41bed7428f23a2f57f38f06200c8b68f306477e482ae2eb92775e6ec15` |
| `src/components/dialogue_component.js` | `33e4cc1c432ab784e143967a22c40914e1880c0c9bfd04d78e56b694b6db41f5` |
| `scripts/check_architecture.mjs` | `a507b19e20e277b6cdd5f1d1bad0f9eeac180d9647843fc7a2920b626dfdbb6f` |
| `scripts/headless/runner.mjs` | `d3c0beb4aa949fc9ffd31087aa466f33dd96964fd5cbe651c0b3c38c0997cc0a` |
| `package.json` | `0a5266bd58baac5c5015d4e87648619c2bd084e9b983f5dc874913c956bbae91` |
| `tests/person_memory.test.js` | `e21be7e261132b18e2bc9b992ca3029b150cc95dc7677b482482bcd0dcf0fd6c` |
| `tests/person_memory_persistence.test.js` | `396aab9628946130bf0cac8c0b61de5e4e1ad40bc5582fa4c32e8e808e013348` |
| `tests/simulation.test.js` | `04ed85fdfee321cf075b32d7c8934d5504a7066ffe009312ec0469d6a22f7011` |
| `tests/everyday_life.test.js` | `2374c243b43b294aef212ecef18ed9a079fa619fe59efb6c0a2fd28960f0dd81` |
| `tests/simulation_ui_hidden.test.js` | `ec3d51e48dd236d078c41e03b3ea5790d02dd229d67eb4fd3fda0978579ee583` |
| `tests/helpers/rt_slice1_fixtures.mjs` | `97fdc63390373d595da0b583fabbe11d0e4598e34f1bec0565ca77d35be4bab3` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR2_MEMORY_EFFECTS_BRIEF.md` | `468e12e6932df794161322ef2dc28d59f9b5fec52a2d220803836d92a955cd3c` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_CHECKPOINT.md` | `37f45c8262de913e4fae8e7baa2b0083b563ba746468c04a65714585ac360763` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_INTEGRATION.patch` | `4d318e2b860503ebaaa1416c8ac946f9888af266c962a1fc5158e9b7c73d9347` |

## Coordinator review and integration (2026-10-29)

Applied in the shared checkout; `MR2_INTEGRATION.patch` is regenerated from the live diff of the four shared files
(`git apply -R --check` passes), so the route tests treat it as integrated.

Defects found and fixed during integration:
- The memory clock port threw "Invalid game calendar" on any envelope without a valid game time, which broke a dozen
  other domains' tests (beat ledger, home, pledges, tools and others). The port now falls back to no future-day bound.
- The memory domain wrote a `memory` key into every save, even when empty, changing every save's shape. An empty
  memory now writes no key; old and new saves without memories look the same.
- The persistence hook published `undefined` as the memory state when the save had no memories yet, which wiped the
  domain before the first real episode. It now publishes the candidate slice.
- The MR1 persistence test now accepts MR2's carried-forward registration as integrated; the MR1 and MR2 tests accept
  an absent key as an empty memory.

Checks:
- Focused: `node --test tests/person_memory*.test.js tests/beat_ledger.test.js tests/home_domain.test.js tests/pledges.test.js tests/tools_domain.test.js`: PASS 38/38.
- Patched owner regressions (simulation, everyday life, hidden display, extensions): PASS inside the route test.
- `npm test`: 4091/4093. The two failures are `tests/facts_frame.test.js` "fresh life" save-byte comparison, which
  also failed in a run before MR2 existed, passes 9/9 alone with MR2 applied, and has another session's uncommitted
  edits. Recorded as flaky, not caused by MR2.
- `npm run check:arch`: PASS, no growth.

Browser floor (FLR2/FLR3): **not met.** A rebuilt headless Chrome run at 1920x1080 from a fresh origin
(scratch script, bundle SHA-256 `621fbd2f…ab78fe`) froze after "Follow local people and work": one page call took about
19 s, with about 200 long tasks in 3 s (worst 2.3 s). The same run with MR2 reversed froze the same way, so the freeze
predates MR2. A CPU profile puts the time in `refresh` of `decorateActionComponents` in `src/ui_components.js` (the UIV1
disabled-reason decorator, last changed 2026-10-27): its MutationObserver keeps re-triggering itself on the workshop
panel. Until that is fixed, the workshop line has headless route evidence only. State: implemented, below floor;
agent-verified, not human-reviewed.
