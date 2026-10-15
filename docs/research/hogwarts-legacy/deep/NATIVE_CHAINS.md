# Native chains and repeat route

2026-10-14. Static investigation of the owned Steam install. No game execution, injector, debugger attachment, user save, code unpacker or modified executable. The direct project and REA snapshots are analysis databases, not changes to the install. Full pseudocode and error envelopes are in [private native notes](../private/native/deep/CHAIN_NOTES.md).

## Identity and tools

| Input | Recorded identity |
|---|---|
| Steam | App 990080, build 20773316 |
| Executable | `Phoenix/Binaries/Win64/HogwartsLegacy.exe`, 450,656,768 bytes, PE x86-64, image base 0x140000000 |
| Executable SHA256, applies to every chain below | `b713e88e0034cb23562b7ffeba6febe5d6a679578215cb595e1644cfc56245a1` |
| Retained raw executable | Private workspace `extract/native/HogwartsLegacy.exe`, copied for future offline native work and hash-matched to the install |
| Ghidra | Homebrew 12.1.4 PUBLIC, explicit existing JDK 21.0.12.1 |
| REA | 6.4.0, pinned source archive `bb540826d65316c164d2de8ba4ef10f81a8ad073`; Node 22.23.3 |
| REA local patch | The first pass's declared launcher addition of `-noanalysis -max-cpu 2`; source patch and hashes retained. The generated profile still says ghidra-default and must be read with this receipt. |
| SDK | Roadou/HogwartsLegacy-SDK `12ffa8a46fb84e7ed13a528715dfd8bb5521594c`; **not build-matched**, names/signatures only |
| Extra disassembly | Existing Apple LLVM `/usr/bin/objdump`; its version and commands are retained in private verification |

The SDK's AddExperience/BreaksShield addresses differ from the fresh registrations. No SDK function address was used as a current entry. Name/function-pointer pairs were rediscovered from this PE. Selected property offsets and enum values were then checked in the current executable's reflection records. This is a selective match, not a claim that the entire public SDK layout matches.

## Chain ledger

All addresses are virtual addresses in the executable with the SHA256 above. A chain may include an exposed wrapper, its ordinary body, a thunk or a recovered runtime-function fragment. Names below describe the selected role and do not pretend that all anonymous helpers have recovered source names.

| Chain | Addresses and source binding | REA route | Direct Ghidra route and limit |
|---|---|---|---|
| N1, XP award/range/reward | AddExperience `0x1436365c0 -> 0x142d6c270`; GainExperienceByAction `0x143636b10 -> 0x142d738b0`; total-points lookup `0x142d775d0`; cached range accessor `0x142d89db0`; level-row loading region `0x142d7cdf2`; point updater `0x143110180` | First batch recovered both wrappers and bodies. Follow-up request for range helpers timed out at provider startup. | Spot check reproduced the selected AddExperience arithmetic. Direct follow-up recovered lookup/range/load code and the XP modifier getter `0x142ad7840`. Exact call registers and SQL strings were checked. Loader is a fragment with inherited-register warnings, not a complete boundary claim. See D1/D3. |
| N2, challenge-progress XP/exhaustion | ApplyKnowledgeAction `0x14353ebc0 -> 0x1429caf70 -> 0x142d738b0`; challenge loader region `0x1429d78be`; ApplyAchievementIncrease `0x14353e8f0 -> 0x1429cab50`; stat/criterion helpers `0x1429d66b0`, `0x1429cf9d0`, `0x1429cbbd0`, `0x1429ccd50`, `0x1429f17f0`, `0x1429f3990` | Follow-up batch failed before these procedures could be read. No successful REA result is claimed for them. | Direct fallback connects the ProgressExperience field to an eligible, not-already-complete action path and the named XP award consumer. Other helpers include persistence/notification/rule work, not automatically additional XP sources. All evaluation rules and initialization paths are not closed. See D2. |
| N3, shields/Hard exception | BreaksShield `0x1437fb4c0 -> 0x1432f1930 -> 0x142b91da0 -> 0x142b91200`; secondary state helper `0x142c4e880`; difficulty helper `0x142c809e0 -> 0x1431ca230`, also called by current GetCurrentGameDifficulty wrapper `0x1437b24d0` | First batch recovered BreaksShield's native body and the component dispatch. Follow-up component query timed out at provider startup. | Direct spot and helper pass recovered the ordinary tag-membership branches and the difficulty-gated popup bypass. Current reflection/enum/tag-asset joins bind the names. Boolean acceptance does not prove the shield was removed by every caller. See D4/D5. |
| N4, damage preparation | CalculateCharacterDamage `0x1437fb5c0 -> 0x1432f1a90`; record preparation `0x143032550`, `0x14303e520`, `0x14303d730`; target-state virtual slot 0x2e8 | First batch recovered the native body and the unresolved target-side dispatch. Preparation-helper follow-up timed out. | Direct fallback recovered base/instigator, tags/breakers and target/direction preparation. No final damage equation or complete modifier order was recovered. Target-side virtual implementation remains the decisive gap. See D6/D7. |
| N5, focus/combo/spend | AdjustFocus `0x143583510 -> 0x142ad3650`; by-name `0x1435835e0 -> 0x142ad38e0`; GetFocus `0x143585140`; GetFocusPercent `0x143585160`; UseFinisherFocus `0x1435896f0`; AdjustComboPoints `0x143583260 -> 0x142ad2a10`; positive-gain modifier helper `0x142ad7890` | First batches recovered adjustment, combo and getters. Follow-up spend/by-name queries timed out before procedure evidence. | Direct spot reproduces the selected adjustment arithmetic; fallback recovers map forwarding and cost negation/spend. Reflected costs and constants are checked in this PE, then joined to BP_Biped_Player defaults. Full orb callback, inherited combo thresholds and all eligibility/refusal routes remain OPEN. See D8. |
| N6, conversation choices/used state | SetBranchIDStateUsed `0x1435cad40 -> 0x142d0eb30`; ConversationComponent option enumeration `0x1435ca030 -> 0x142cfecf0` | Used-state wrapper/body recovered in the second successful batch. Option-enumeration follow-up timed out. | Direct spot confirms the selected used-state write; direct fallback retains the large option-enumeration body. Its complete virtual condition/effect evaluator is not reconstructed. No generic friendship increment follows. See D16..D18. |

AI tree/profile evidence is asset/SQLite evidence in [AI_DIGEST](AI_DIGEST.md). No native per-frame TAS/perception integrator or full attack-ticket arbiter was recovered. Those are not silently listed as completed native chains.

## Reflection and naming receipts

SHOWN examples in this PE:

| Record | Meaning established |
|---|---|
| `0x147c53d70`, `0x147c53da0`, `0x147c53dd0` | A/B/C breaker property records encode offsets 0x278/0x280/0x288. |
| `0x147c53e60`, `0x147c53e90`, `0x147c53ec0` | Control/HeavyDamage/Forceful property records encode 0x2a0/0x2a8/0x2b0. |
| `0x147c540e0` | StupefySpecialPopupImpactTag encodes offset 0x2f8. |
| `0x147beb700..0x147beb730` | Current enum pairs bind ordinary shield TypeA..TypeD to 1..4. |
| `0x147dcf810` | Current EDifficulty::Hard enum pair encodes 3. |
| `0x147afd568` | Current GainExperienceModifier property offset is 0x23b8, differing from the SDK's older field offset. |
| `0x147afc860` | FinisherFocusCost offset is 0x1d30. |

Native helper offsets are mapped to the independently parsed `Data/DA_GameplayTagLibrary.uasset`, not merely to inferred colors. `reflection-fields*.json`, `constants-enums.json`, fresh registrations and the exact source addresses are preserved privately. Some unused prototype/special enum values exist; they are not a complete live roster.

## REA outcome and comparison limits

The first session returned **18 status-ok entries across two batches**, including wrappers and getters. Cold/lazy native startup plus the first nine-entry request took 128.84 seconds; a warm nine-entry request took 3.16 seconds. An API success does not guarantee useful recovered semantics: selected protected/thunked getters yielded little interpretable code and were not used as mechanic proof.

A second session's 16-entry follow-up returned provider startup timeout errors. The whole request took 367.32 seconds; its errors include 180,000 ms startup budgets and launch diagnostics. These are failed attempts, not sixteen decompilations. The complete envelope remains private. The session was closed. This pass did not keep increasing the timeout or claim a decompiler-quality difference.

Direct Ghidra reused the existing `baseline` project. An initial command mistakenly named the project `HogwartsLegacy`; it failed before analysis. The next command used the observed `baseline.gpr`. Direct runs then supplied five comparison entries, two shield helpers and narrowly selected follow-up bodies/regions. They are fallback evidence after a real REA failure, not an alternate benchmark. Shared-machine load, lazy startup, differing function counts and the existing direct cache prevent a useful timing ranking. `/usr/bin/time -l` logs are retained; they are not presented as measured peak JVM RAM.

Both routes use the same Ghidra decompiler. They have uncertain types, thunks, partial boundaries, indirect dispatches and protected-code artifacts. This pass did not decrypt or execute those regions. Selected static control flow and cross-file joins are the authority; broad caller completeness, every function boundary and live behavior are not established.

## Repeat path

Private workspace remains `~/.codex/research/hogwarts-legacy/`. Reuse the existing extracts and baseline; do not re-extract a file already verified in `extract/HASHES.txt`.

| Step | Retained helper / input |
|---|---|
| Target selection | `tools/deep/inventory*.py`, current PE registration receipts; bounded exact names avoid treating a common suffix as a class-qualified method. |
| Wrapper/body selection | `native_prepare*.py`, `wrapper-calls*.json`, saved objdump output. PE exception-directory entries locate runtime ranges; the section is not named .pdata in this executable. Ranges can be fragments, not whole C++ functions. |
| REA | `rea_console.py`, `native-seeds-initial.tsv` and follow-up seeds, full MCP result/error envelopes, first-pass local patch. One local MCP session at a time, clean close. |
| Direct | `tools/ghidra/DeepSpot.java`; explicit JDK; existing dot-free `/tmp/hogwarts-legacy-ghidra-20261014` symlink; project name `baseline`; `-process HogwartsLegacy.exe -noanalysis -max-cpu 2`; exact roots passed as an argument. |
| Native field/name verification | `reflect_fields*.py`, `constants-enums.json`, `sql_xrefs.py`, `asm-xp-add.txt`, `asm-difficulty-wrapper.txt`. Raw string/enum/property records are retained. |
| Assets | `extract_assets.py`, `extract_more.py`, `extract_final.py`; retoc pin/settings inherited from [TOOLING](../TOOLING.md); CUE4Parse AssetRead with Hogwarts settings. 143 new selected packages parsed; no mappings added. |
| Readable archive | `archive_private.py`, `text_archive.py`, `finish_archive.py`; all shipped tables and full text, original parsed exports, readable graph/bytecode exports and native notes under gitignored private/. |

No new toolchain was installed in this pass. A changed build needs a fresh executable hash, registration scan, field/enum bindings and extraction/version review. An old pseudocode file or success envelope is not proof for a new build.
