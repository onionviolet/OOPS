# MR1 checkpoint: memory records (P2)

Status: **implemented, below floor**. Agent-verified, not human-reviewed. Public, name-free code; no commit, shared host edit, user-save access or publication. This lane owns exactly `src/person_memory.js`, `tests/person_memory.test.js`, `tests/person_memory_persistence.test.js`, this checkpoint and `MR1_INTEGRATION.patch`. Ownership is released to the coordinator for review and integration.

Authority and seam: [brief](MR1_MEMORY_RECORDS_BRIEF.md), [design sections 34–35](../LEAD_LIFE_SYSTEMS_DESIGN.md), LSD351–LSD362, LSD372–LSD375, P2 of LSD377; AR1–AR16, AD36/38/43/45, CLR2/3/9/12, MD1–MD3, FLR1–FLR6, GR1–GR17 and LSD139/363/381. The live PROJECT summary and USER_VISION lead-first/reusable-mechanisms direction agree with this bounded leaf. No new accepted direction, rulebook, UI, P3 effects or private-world wiring is introduced.

## Probe and choices

| Input | Expected | Observed | Gate / result |
|---|---|---|---|
| Existing relationship/household text stores | 3 | Simulation pairs, chronicle relationships, household life-event lists: 3 | Read-only and unchanged |
| Existing tests pinning those owners | Some | 9 selected existing test files, 91 tests | PASS unchanged |
| 300 holders × 40 episodes, UTF-8 JSON | Below 500,000 bytes | **499,711 bytes**, dictionary and slice envelope included; 12,000 distinct fact IDs, 300 subject/teller IDs, negative full-strength feelings, full certainty, five-digit days | PASS |

Additional prose storage found: `life_record.js` keeps a bounded lossy biography (recent milestones and yearly highlights, including literal fallbacks rendered by `memory_messages.js`). It is not another relationship owner and is left untouched.

D1: Keep a schema-1 compact tuple with a per-slice dictionary of opaque strings. This removes repeated subject/teller IDs without hashing away identity. The first five kinds are `helped`, `harmed`, `betrayed`, `witnessed`, `told`; `impression` is the compaction kind. Kind is preserved when telling, so a listener can still derive what they were told happened; the teller source marks hearsay.

D2: Default fade is hyperbolic, half-life 30 days × (1 + absolute feeling / 10), with 120 days as the base for harm/betrayal. It stays positive, so faint detail is not removed just by time passing. No vividness or bond axis is saved. These constants are replacement points for a future world dial, not universal world law.

D3: Default capacity is 300 holders and 40 total records per holder, including impressions, plus a hard 500,000-byte UTF-8 slice ceiling. Strong/young episodes rank ahead of weak/old ones; overflow folds into one dated impression per holder/subject. If a holder already represents 40 different subjects, a 41st subject refuses atomically: preserving one impression per subject cannot fit in 40 slots. Likewise, unusually long IDs reduce available byte capacity. The measured cap fixture is deliberately heavy, but it is not a claim that every possible 96-character Unicode ID or safe-integer day fits at full occupancy. Oversized states are refused, with the prior state untouched; no pointer or prose is truncated. These are bounded-lane limits for coordinator review, not an anti-cheat mechanism.

## Schema and ports

`memory = {schema: 1, ids: [opaqueId, ...], holders: {holderId: [tuple, ...]}}`.
Tuple: `[kindIndex, aboutRef, factRef, sourceRef, certainty, feeling, day]`; an impression appends its represented count. `factRef = -1` for impressions; `sourceRef = -1` means saw, `-2` inferred, otherwise a dictionary ref to the teller. Certainty is integer 0–100, feeling integer -100–100. Day is a nonnegative safe integer no later than the injected clock. Example:

```json
{"schema":1,"ids":["person.b","fact.a"],"holders":{"person.a":[[0,0,1,-1,90,20,1]]}}
```

`migrateMemory(undefined, day)` returns an empty slice; explicit null, unknown schemas, unknown kinds, invalid pointers, future days, duplicate impressions and extra record fields are rejected. No legacy text migration runs. `canonBaseline(holder, day)` currently returns none; `readMemories` can combine decoded deltas, an injected private baseline and detached `legacy-literal` rows. `legacyEpisodes` accepts rows from each existing store and an explicit clock-to-day conversion, preserving the literal string and recording its store. Callers own visibility filtering.

`recallMemory` uses CH1 `checkKey` and the existing resolver, with holder, full episode, cue identity/matches and period in the key. Draw address additionally supplies root, world, life, owning game time and event. Same inputs give the same receipt; no attempt counter is introduced. The default target is vividness × cue match (one match half strength, two or more full strength), rounded down to percent; no matched cue gives no success. Cue person/place/topic matches come from the fact owner; place/topic truth is not copied into this save. Receipts are author evidence, not an observer-safe UI projection. One resolver die per invocation; caller cadence/daily work budgeting remains caller-owned.

`tellMemory` keeps kind, about, fact and original event day, marks the teller, and lowers certainty by 20 points by default (floor zero). It neither schedules an encounter nor changes the truth log. `remember` returns a new slice; failed validation, subject capacity or byte admission leaves the prior slice intact. Compaction loses exact detail and averages feeling/certainty, retaining count and latest event date; recovering those facts later needs the external fact log.

## Coordinator integration

1. Review and apply `git apply docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_INTEGRATION.patch`. It imports the memory-domain factory and native calendar reader into `src/domain_registry.js`, then registers the `memory` namespace there. The existing registry already calls its validator from `validateSaveEnvelope` and its lifecycle hooks from native Save/load. No edit to main/display/save_files is needed.
2. The patch maps native calendar minutes to absolute days. A future private-world consumer must convert its own event clock to that basis or replace this injected port with its owning-clock contract. It must not mix chapter-relative days with absolute native days.
3. Review the owned files, rerun the two focused tests against the current combined candidate, then use the coordinator's full pre-commit gates. `npm test` is intentionally left to the committer. The lane has not installed the prepared patch in the shared checkout.

P3 needs: call the domain's `remember` command from a witnessed event; inject canon baseline on read without saving it; derive bond axes from episodes and current vividness; name a selected fact/episode in a reaction; route teller copies only along actual encounters/bonds; project character knowledge separately from author receipts. No stats, reactions, gossip transport, UI or private-world runtime consumer was added. The disposable fixture proves persistence through the registry; it does not prove transaction rollback for a future host command or a gameplay route. Future protected/canon-reserved details need an explicit retention policy before sharing this generic compaction path.

## Floor

| Code | Evidence / gap |
|---|---|
| FLR1 Build | Disposable real build SHA-256 `be522e00bde82059ed596d83becbe10c2f554bfddb8c0c8b54a32d7c639943bb`; no shared/installed bundle rebuilt. |
| FLR2 Route | Named synthetic fixture with `person.a/b/c`, 45 events, hearsay and folded impression; real headless native lifecycle, no earned gameplay route or browser proof. |
| FLR3 Shown | No player UI or descriptions in scope. |
| FLR4 Used | Pure recall/read/compaction consumers tested; no production gameplay consumer yet. |
| FLR5 Kept | Save, reload, Export and literal Import PASS through real validator and storage route in a disposable copy; absent slice migrates empty; invalid future day/kind refused. Same next recall receipt survives reload/import. |
| FLR6 Labelled | Implemented, below floor; agent-verified, not human-reviewed. Source and synthetic headless integration evidence only. |

## Checks

| Command | Result | Gaps |
|---|---|---|
| `node --test tests/person_memory.test.js tests/person_memory_persistence.test.js` | PASS 8/8; size 499,711 bytes; 500-seed recall sweep and three fixed-root goldens; real persistence fixture | No shared-host install, production consumer or browser/UI proof |
| `node --test tests/chronicle.test.js tests/chronicle_heir_snapshot.test.js tests/relationship_view.test.js tests/life_events.test.js tests/simulation.test.js tests/simulation_extensions.test.js tests/simulation_frame.test.js tests/simulation_validation_cache.test.js tests/simulation_optional_enrollment.test.js` | PASS 91/91, existing tests unchanged | Selected legacy-owner slice, not full suite |
| `npm run check:arch` | PASS; main -51, display -37, save_files 0 growth; 205 grandfathered cyclic edges | Shared checkout at check time |
| `node scripts/check_architecture.mjs` (disposable copy after patch, invoked by persistence test) | PASS; same growth and 205 grandfathered cyclic edges | No new cycle edges or protected-file growth |
| `git apply --check docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_INTEGRATION.patch` | PASS | Shared source may change before coordinator integration |

Initial test setup mistakes were corrected: a missing closing brace; comparing null-prototype maps to structured clones; guessed golden numbers replaced with the observed fixed-root draw values; and passing raw JSON to a file Import that expects encoded bytes. The final persistence test uses the literal exported file through the real Import function, not a replacement fixture reload.

## Input SHA-256

Hashes below capture the relevant files read and directly exercised dependencies at receipt time. Other sessions may change these inputs after this lane. Disposable bundle identity is recorded above.

| File | SHA-256 |
|---|---|
| `AGENTS.md` | `66ed88ce8791c24d444031c416da933e84e588bc323bdc9b5fbbd700b03327aa` |
| `docs/GROUND_RULES.md` | `5f164d8086e9d9b8eaccf0f55f9263fc3678f93918811d27b63560186742bc0a` |
| `docs/RULES_INDEX.md` | `626e30491e410e212c58bbac52506928c08c675a4a4e1801b4e566241f2a80c2` |
| `docs/ARCHITECTURE_RULES.md` | `28ce1b5339cd0055d4a44cc93a7af7a9d261952ce9a3cfbb5b1517b2ecee5a3b` |
| `.claude/rules/runtime-code.md` | `ebc70ac414a53e4fd29632b86c2dd1e554b99af10810f02a65d3eb9096d8f507` |
| `PROJECT.md` | `8b1eace172cf2c7d5723b1bc6019ff95dfdd1c0686d96f2cc2bb67628094f1ba` |
| `docs/USER_VISION.md` | `4034586d6b683128a656dc5d2396b794bb59ffee96dfaaacb10ea11709ccc20f` |
| `docs/GENERATION_FOUNDATION_RULES_2026-10-14.md` | `1a8b112f52209ef97e28dd8584bc43fff2fa3c2f0649b0b389c499919d74a0a1` |
| `docs/gm/SHARED_WORKTREE_PRACTICE.md` | `e32386fc6651fb547415b9e2f11ed139c1fa53beb48c1ad1e16d4b5ce6142584` |
| `docs/RULEBOOKS_FOR_WORLDS_AND_GM_CONSIDERATIONS_2026-10-14.md` | `6d32dc0f6c6b200f6e5c4365f4a84c01b75fd882466ac955b0c8c0a25acef5f5` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/CAST_LIVES_CARD.md` | `8477b101916d2152ae577b09681a00f6254b2c1e055d749fb11a7a77a4684f82` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md` | `05eb42982e8412fe8f030cdfa6a7362d2b98518f33d3438cb22f61ddcbc97b26` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_MEMORY_RECORDS_BRIEF.md` | `7a3dd63b05587138befaf188732db2649f5f93e30a9722f4432e357df425eca6` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/CH1_CHECKPOINT.md` | `a0caf9dc67a718e1667106a2111a1326efb661d11e05bb5fd637ce85fd559aa4` |
| `src/gen_kit.js` | `bbbd05aea220aae5f1a8af48252f771851ad089690c9e68f2be0e19c99d38ec4` |
| `src/check_keys.js` | `391d2ae7bf4279318b5455e87c44ec4dfb60019e0c47cb1d52c4e45e28769209` |
| `src/check_resolver.js` | `3cdebe3999fe4a634889440e4b98d688d5644f38075da851ec2cc94b1088119d` |
| `src/check_contract.js` | `20c1f0b118d1b5f9cb40ebd3b195a6f2aff0cc3d67f5d3671bebf2aaa40c4410` |
| `src/domain_registry.js` | `d8c0ffd423e1dbcb00dc9098e3e9eacb815cb5346e3dfa76c3229282a16ce07b` |
| `src/world_rhythm.js` | `3cf3f252ec073c0011ac8471e4fedcd313a8a7f7fe35c6adfc3591e8111553df` |
| `src/save_files.js` | `70d1ef3f7e8fbc2561df294a38a1ca5c4d539930b53d6e5fdd7e62271713b1aa` |
| `src/main.js` | `56e0989e56a2f5e9e4341addacaeeb92b2d484ae344c58f06d67a9e143475394` |
| `src/chronicle.js` | `8fc0d6df8bd222eb8b912397b0569b123c75b8ff5a112792c6dae1630080be4f` |
| `src/relationship_view.js` | `69d1b37d8c2dae474d2cffeb738c104daf38d513d0227680e8540bf66c512945` |
| `src/life_events.js` | `709055e7f14fe934bb424390a971f06ca42a276640a2e5f507ed8c84c82f013c` |
| `src/simulation_effects.js` | `834a310ac85ca5af94bfa5d13fe27c7eac76fd629f66cd915da00e3b2843d91d` |
| `src/simulation.js` | `2f3bdb49559630943f2f069e81abc395842f6ff979786b592b0f84abd8dd2dda` |
| `src/people_knowledge.js` | `2eba6691d3d6a0f840a14522418a2d93b31df7f0679e534c5f4c4e81c5ed39c4` |
| `src/memory_messages.js` | `70a0242ec995ea3a6731c0ca4482ef7a7f5d459663668881077d62a694c06d43` |
| `src/life_record.js` | `ad255232c69d57e931f4d40c1f50bf04c389b3cf5f725674a78b6338c6c40a30` |
| `src/generated_people.js` | `49acbbe3b33d6abdd6f692dde475e145ff190bdc068a46660dcf845352bc3bc9` |
| `tests/cast_card_integration.test.js` | `ca3dfc07f196af838ced9a7c0b83ae7808196d4991fe200ffdbef2b73164f0e9` |
| `tests/skill_records_persistence.test.js` | `0139a31fd8878c03e4052e6d25a3b453f5f56c5a32ef7895724e2f6d619d1c49` |
| `scripts/headless/runner.mjs` | `d3c0beb4aa949fc9ffd31087aa466f33dd96964fd5cbe651c0b3c38c0997cc0a` |
| `scripts/check_architecture.mjs` | `a507b19e20e277b6cdd5f1d1bad0f9eeac180d9647843fc7a2920b626dfdbb6f` |
| `tests/chronicle.test.js` | `234fbb1baaf84f7843445bcfc559173830d0667e993b1bbd0aacb61ecfa01d7d` |
| `tests/chronicle_heir_snapshot.test.js` | `077262efc5564451efe27f1e624f61a21378856b10c0b409fdbeedd3ccc83c0b` |
| `tests/relationship_view.test.js` | `fa766d1f3d32bcd26a1fd4e5c685ae1ab4f947f45d101ac47f14a5cc18dbda7f` |
| `tests/life_events.test.js` | `bd4b1a41dc6e8388afd0d6004159a369ea458421cd627abd7210eadc34b3e042` |
| `tests/simulation.test.js` | `04ed85fdfee321cf075b32d7c8934d5504a7066ffe009312ec0469d6a22f7011` |
| `tests/simulation_extensions.test.js` | `064ca0bc1158399a92516e8eb038ebff09cefe99661b481d0b0e8c1e09505689` |
| `tests/simulation_frame.test.js` | `af67606551941dbe7c54f5a7af7c035db1871c27bd8919c389eb83b8b4f2908c` |
| `tests/simulation_validation_cache.test.js` | `5aec241becae648e083cba6fc94d69125e7a3720a7fe3a6685191dcc459c7172` |
| `tests/simulation_optional_enrollment.test.js` | `61fc7e22ebdf74584fdd5edcc15dafda085babc7a417b8b9e710f813ea2fd33b` |
| `src/person_memory.js` | `fdb793747825fd2a171b30a9bd624d3e490270f4c6e171d3ee3f88fb4ce277e9` |
| `tests/person_memory.test.js` | `12e40f23365058afaab53a9d29fe075fc9f026a81cbfab8bd20cba2c7f59680d` |
| `tests/person_memory_persistence.test.js` | `396aab9628946130bf0cac8c0b61de5e4e1ad40bc5582fa4c32e8e808e013348` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_INTEGRATION.patch` | `4d318e2b860503ebaaa1416c8ac946f9888af266c962a1fc5158e9b7c73d9347` |

## Coordinator review (2026-10-29)

- Design fix: `remember` refused a 41st distinct subject, so anyone who had met 40 people could not remember a new
  one. It now forgets the weakest whole subject first (LSD360: losing a minor acquaintance is forgetting), then folds
  detail as before; the other 40 keep their detail. The test now pins that the new person is remembered and no one else
  is reduced to an impression.
- `node --test tests/person_memory.test.js tests/person_memory_persistence.test.js`: PASS 8/8 after the fix.
- The nine legacy-owner test files: PASS 91/91 unchanged. `npm run check:arch`: PASS, no growth.
  `git apply --check MR1_INTEGRATION.patch`: PASS; **not applied**, held for P3 so the slice lands with its first consumer.
- `npm test`, twice: 4082 pass with 2 then 4 failures, a different set each run, all in other features' disposable-copy
  integration tests (cast cards, journeys, making, inference, divination, ability). Those six files run alone: PASS
  33/33. None imports `person_memory.js` or `check_keys.js`, and other sessions had uncommitted edits in the LOTM host and
  cast test files during the runs. Recorded as load or concurrent-edit flakes, not caused by this lane; the full suite is
  not clean in this checkout right now.
- Canon sweep of the public files: no names.
