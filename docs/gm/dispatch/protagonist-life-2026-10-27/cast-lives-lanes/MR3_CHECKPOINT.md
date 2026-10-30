# MR3 checkpoint: trait temperament on memory

Status: **implemented, below floor**. Focused and native-fixture checks pass, agent-verified, not human-reviewed. No browser claim, commit or publication. Ownership is released to the coordinator. The coordinator owns the rebuilt 1920x1080 browser gate and committing these files.

```receipt
build: 375a4c08a93ac888835d108f2e46fffdab0405238bf02bfb7c8f4fcf9e4f24a1
route: fixture(craftsman meeting and workshop supplies; background native projection)
state: built
viewport: 1920x1080 pending coordinator browser
persistence: checked
tests: 21 memory/temperament cases verified across full run and targeted route rerun; 69 existing regressions; architecture PASS
review: diff-scoped
surface: memory leaf modules; six shared wiring/content files; main.js net zero
```

Authority: [MR3 brief](MR3_TRAIT_TEMPERAMENT_BRIEF.md), [systems design](../LEAD_LIFE_SYSTEMS_DESIGN.md) LSD393-LSD407, LSD431-LSD439, LSD441; AR1-AR16, AD36/38/43/45, MD1-MD3, CLR2/3/9/12, FLR1-FLR6. This is the requested P3b slice. Lead-first reusable mechanisms, desktop first and private canon separation remain unchanged. No accepted direction or deferred feature has been promoted.

## Probe and design choices

| Probe | Expected | Observed | Result |
| --- | --- | --- | --- |
| Simulation people with authored traits before MR3 | 0 | 0 of 109 | Definitions aggregate in `src/simulation_content.js`; registry reads retain authored data |
| Generated trait words | 6 | kind, curious, patient, practical, sociable, reserved | All mapped |
| Negative social command / practical apology | At least one each | `village.interrupt_work` / `village.practical_apology` | Both present; named native fixture journey under test |

D1: Derive temperament from trait words through `createTemperamentPort(personOf, registry)`. No temperament or derived bond is saved. The craftsman's authored **forgiving** trait is a proposal: practical restitution lets him return to his work. Default omitted or unknown words give the old MR1 numbers. Extended words are optional world palette entries, not canon assignments.

D2: Append `amends` at kind index 6; existing indices 0-5 and schema 1 stay intact. Existing schema-1 slices load byte-for-byte structurally unchanged. New writes add optional `tables: [limits id@rev, temperament id@rev]`. Missing metadata means the original baseline. Unsupported revisions reject with an explicit-migration error. Calling `remember` with a selected world table is the explicit baseline-to-that-table write: caps fold/forget then and the selected revision is recorded. A later arbitrary revision needs a migration supplied by its owner. Table revision changes must never be presented as a no-behavior structural update.

D3: Amends keep the original harm episode. They lower same-subject/same-axis earlier harm weight and contribute a temperament-scaled positive response. The paid apology is the first writer through the existing relationship-effect adapter. No native relationship axis is migrated or duplicated. Harm/amends ordering is day-granular, as in MR1; severity, new revenge behavior, trait drift, mood and group grudges remain outside this lane.

D4: Observed grudges require a still-vivid harm after 30 days; observed forgiveness requires an amends episode that softens the harm. Co-present living holders are observed about their treatment of the player at an existing transaction boundary. Persist observations in the existing simulation knowledge owner, then project the craftsman's `knownTraits` in his existing People record. Merely meeting him or asking his habits reveals no temperament. `revengeStub` returns a derived pending flag, with no goal writer or behavior.

D5: Frozen memory snapshots permit a WeakMap read cache and a bounded per-holder/day/profile bond cache. New episodes replace the snapshot; day, temperament and table identity/signature changes invalidate its derived entries. Only module-produced immutable snapshots are cached, so a caller's mutable object cannot leave stale cached truth. No ticking simulation or new timer is added.

## Trait table: memory.temperament@1

All multipliers are dimensionless; omitted dials are 1 (slant 0). Each row's reason is in `TRAIT_TEMPERAMENTS`.

| Word | Dials | Reason |
| --- | --- | --- |
| kind | amends x1.5 | Takes repair generously |
| curious | recall x1.25 | Cues draw attention |
| patient | harm half-life x0.75 | Small hurts pass sooner |
| practical | amends x1.5 | Material repair matters |
| sociable | telling x1.5, certainty loss x0.75 | More listeners and clearer accounts |
| reserved | telling x0.1 | Usually keeps accounts to oneself |
| grudging | harm half-life x4, harm recall x1.5, amends x0.1 | Returns to hurts; apologies count little |
| forgiving | harm half-life x0.1, harm recall x0.75, amends x2 | Lets hurts pass and accepts repair |
| loyal | help half-life x30 | Favours stay vivid for years |
| ungrateful | help half-life x0.05 | Favours fade in days |
| reliable | certainty loss x0.5 | Careful accounts lose less detail |
| unreliable | feeling slant +50% | Retells stronger feelings |
| gullible | listener trust x1.25 | Gives accounts extra certainty |
| sceptical | listener trust x0.5 | Discounts received accounts |

Default daily telling retains MR2's 100% opportunity when a bonded listener is present. Sociability also widens the number of listeners (ceil of the telling multiplier), while reserved telling is rarer. Certainty remains bounded and no retelling exceeds its source's certainty. Draws are keyed by holder/day/listeners/fact and rate purpose; receipts still prevent daily replay.

## Limits table: memory.limits@1

One authority: `src/person_temperament.js`, `MEMORY_LIMITS` with `MEMORY_NUMBER_REASONS`. `memoryLimits(worldId, worlds)` overlays a table with its own id@rev; `person_memory.js` re-exports the same table for existing callers. Per-world injection is a port; this lane adds no settings panel.

| Number | Default | Reason |
| --- | --- | --- |
| holders | 300 | Bound detailed people per life |
| episodes | 40 per holder | Fold old detail over a long life |
| bytes | 500,000 UTF-8 | Bound the slice including dictionary and metadata |
| idLength | 96 characters | Compact opaque pointers |
| harmDays / otherDays | 120 / 30 days | Hurt lasts months; ordinary encounters weeks |
| feelingScale | 10 feeling points | Stronger feelings lengthen the half-life |
| tellingLoss | 20 percent points | Retellings lose certainty |
| reactionVividness | 25% | Fainter memories stop driving visible manner |
| tellingRate | 100% daily opportunity | Preserve MR2's default opportunity |
| traitObservationDays | 30 days | Wait for persistence before inferring a grudge |
| amendsWeight | 0.5 | Material repair softens prior harm |
| hearsayTrust | 100% | Baseline listener accepts teller certainty |
| witnessedWeight / toldWeight | 0.25 / 0.5 | Indirect accounts have less force |

Measured worst-case MR1 dictionary fixture at 300 x 40: **499,763 bytes**, including 52 new metadata bytes. As before, arbitrary long IDs at full occupancy do not all fit. Encoding rejects over-budget data; a lower-cap write folds or forgets weak records instead. Larger caps allow more entries and need a commensurate byte budget.

## Targets, sensitivity and cost

T1: A grudging non-player holder is cold at day 180 after an unapologised interruption.

T2: A forgiving non-player holder is warm within 30 days of material amends, with the harm episode still present. Two non-player holder IDs give trait-shaped, deterministic lines from the same histories.

T3: A loyal holder keeps help vivid at two years; an ungrateful holder's small favour is below reaction vividness at day 30.

The sweep moves every numeric limit and every numeric trait dial independently +/-25% against T1-T3 (four boolean assertions, because gratitude has two endpoints). Diagnostic output records each case. These are sensitivity results for these targets, not calibration of canon, capacity, gossip rates or all possible histories.

MR2 defect found while exercising the real interruption/apology sequence: `hash64` returns `{lo, hi}`, but the old `.toString(16)` made every event token `[object Object]`. Different same-axis events could collapse. Tokens now concatenate the two padded hexadecimal lanes; a direct regression checks distinct causes. Existing marker-token records retain their old mirrored-axis read. Lost historical episodes cannot be recovered and no fabricated history is introduced.

Benchmark: 300 holders x 40 distinct subject bonds, 12,000 derived reads. The valid cap fixture shares 40 effect pointers across holders to stay under the byte cap; it exercises every bond consumer, not the distinct-fact size test. Initial cold/warm wall measurements were 44.18/17.64 ms. Under concurrent shared-machine load, later cold/warm wall values rose to 234.63/85.86 ms. Cold reads also exceeded the initial 50 ms budget, justifying the lazy cache. Latest optimization removes per-read profile serialization for identical profile objects. Both CPU and wall times are recorded; the assertion uses a 50 ms cached CPU budget to avoid treating another session's scheduling delay as this function's computation. Final standalone sample: cold **595.31 ms wall / 84.20 ms CPU**, cached **2.73 ms wall / 2.72 ms CPU**. A subsequent snapshot read-view optimization measured 420.66 / 68.44 ms cold wall/CPU and 2.85 / 2.83 ms cached wall/CPU. These are actual samples under concurrent work, not a guarantee of cold 50 ms latency. The final all-memory run measured cold **60.88 ms wall / 69.57 ms CPU**, cached **2.79 ms wall / 2.72 ms CPU**. Cold first reads remain a known cost; no claim is made that cold wall latency always fits 50 ms.

## Shared hunks

| File | Bounded change |
| --- | --- |
| `src/simulation_content.js` | One craftsman definition: proposal trait plus reason |
| `src/simulation_effects.js` | Import temperament port; use authored traits in derived relationship facts |
| `src/simulation_ui.js` | Import port; workshop reaction uses authored temperament |
| `src/people_knowledge.js` | Project witnessed traits in existing craftsman People row |
| `src/domain_registry.js` | Memory read command returns immutable snapshot; save still copies |
| `src/expansion_persistence.js` | Resolve definitions through temperament port; stage observations in existing knowledge owner before durable publication |

Six shared files; all were clean immediately before this lane edited them. No other shared source hunks or `main.js` changes. The apology command content stays unchanged; its existing material-cost relationship effect is adapted to `amends`. `npm run check:arch` passes with the same 205 grandfathered cyclic edges; no cycle growth. `main.js` is unchanged by MR3.

## Check receipt and coordinator steps

| Command | Result | Inputs / gaps |
| --- | --- | --- |
| `node --test tests/person_temperament.test.js tests/person_memory*.test.js` | 20/21 in the final combined run; the native route hit its inherited 270-second worker timeout after the apology assertions passed | 19 unit cases and the real persistence case passed. Final module input identity is in the output table below |
| `node --test tests/person_memory_route.test.js` | PASS 1/1 after extending the worker budget to 600 seconds; 337.72 seconds measured | Supersedes the timeout. Same source inputs and assertions; overall focused set is now **21 cases verified**. Temporary stage tracing was removed afterward, with no assertion or route change |
| `node --test tests/simulation.test.js tests/everyday_life.test.js tests/simulation_ui_hidden.test.js tests/simulation_hidden_display.test.js tests/simulation_extensions.test.js tests/people_knowledge.test.js tests/generated_people.test.js` | PASS 69/69 | Simulation effects, panel, content, generated people and witnessed People records |
| `node --test tests/simulation.test.js tests/everyday_life.test.js tests/simulation_ui_hidden.test.js tests/simulation_hidden_display.test.js tests/simulation_extensions.test.js` | PASS 53/53 on the updated leaf | Re-run while investigating the native timeout; no regression failure |
| `npm run check:arch` | PASS; no growth, 205 grandfathered cyclic edges | `main.js` 10067 lines versus baseline 10115; MR3 changes zero lines there |
| `npm run check:receipts -- --files docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR3_CHECKPOINT.md` | PASS | Receipt shape, not gameplay proof |
| `git diff --check -- <owned paths>` | PASS | No whitespace errors; no staging or commit |

All 68 independent +/-25% perturbations (15 limit numbers and 19 trait dials) break **none** of the four stated target assertions. This does not claim capacity or gossip calibration against these same targets.

Native proof: fresh life, real elder/craftsman greetings with a named meeting unlock fixture, enroll, ask habits, named fixture grants three logs and one coin, commission the kit, interrupt, read wary projection, pay the practical apology, read softened projection. The actual harm and amends episodes are distinct and both retained. `forgiving` stays unknown before conduct and is recorded only after the amends soften harm. The exact softened line and memory slice survive native Save, reload, Export and literal Import. A failed durable write does not publish the candidate memory. The native route bundle SHA-256 is the receipt build hash. The separate persistence fixture bundle is `6de71c44ccea940ec9748e29608b73f2624b79bb5c1b55254f59e6f455ac3441`.

Native fixture limits: foreground headless timer settling repeatedly exceeded the old worker budget. The disposable copied `main.js` marks the document hidden and pauses decorative MutationObservers; the worker also clears the harness's attribute-polling observers at settle boundaries and uses `settleMs=0` between native commands. Command predicates, native costs, transaction/save code, reload, Export and literal Import remain real. Workshop projection text is asserted explicitly. CSS actionability and foreground observer behavior remain for the coordinator browser; production `main.js` and the harness are unchanged. The route now has a 600-second worker budget and a 660-second outer test budget to cover measured native reload cost during concurrent work.

The native sequence also reproduced a large-calendar defect: fractional half-life harm could be fractionally less vivid than a same-day favour because `halfLife + day - episode.day` rounded after adding a large date. Computing the integer age first fixes it. A day-360000 regression proves fresh forgiving harm has vividness exactly 1 and wins the reaction tie over a friendly memory. The target native sequence now passes this same case.

| Floor | Evidence / remaining gate |
| --- | --- |
| FLR1 | Disposable fixture build hash recorded above; normal rebuilt browser bundle remains coordinator-owned |
| FLR2 | Native fresh-life fixture journey PASS; rebuilt 1920x1080 browser still pending |
| FLR3 | Real workshop/People projections and existing one-log apology label checked natively; foreground visibility/layout pending |
| FLR4 | Derived relationship axes, workshop manner, gossip and witnessed People traits consume the episodes and dials |
| FLR5 | Native Save, reload, Export and literal Import PASS, plus old absent-slice and malformed-save checks in the persistence fixture |
| FLR6 | **Implemented, below floor**; agent-verified native fixture, not human-reviewed or browser-verified |

Coordinator: run the rebuilt 1920x1080 browser journey with the named meeting/supply fixture, commission, interrupt and pay the practical apology. Observe wary then softened manner, retained harm and new amends, and learned forgiving trait only after conduct; Save/reload/Export/Import. Use a disposable trait override fixture for the same-history grudging/forgiving comparison, restoring the authored proposal afterward. Run the full suite once at integration under AD36, review only owned paths, then commit without a co-author trailer. No push authorization is implied.

Known limits / replacement points: day-granular amends ordering; cold first-read cost above the cached 50 ms CPU budget; one selected limits-table revision for the memory slice; no settings panel; the persistence host currently resolves built-in simulation definitions (dynamic/private definition owners must supply equivalent lookup wiring when opting in). These are ports for consuming lanes, not new mandatory work here. No revenge behavior, mood, trait drift, group grudges, severity or secrecy was added.

## Input SHA-256 before edits

These are the startup inputs, not hashes of unrelated sessions' later changes. Files read after the initial snapshot are identified in the final receipt.

| Input | SHA-256 |
| --- | --- |
| `AGENTS.md` | `28df652b0d6dd23eece5a934669a5867880b806a7d2bd85aa680f06d01b1bf47` |
| `PROJECT.md` | `ea7c4f1c28c95a1d922563c04816e7a1a1792055130b05b42aad6de4e03535ae` |
| `docs/GROUND_RULES.md` | `9117aed09159db2a2c0a6118edb6b82e12bd7c101a2ea89be101ac5c16896566` |
| `docs/VISION_DIGEST.md` | `3859d07f79bc176496e1e9d9ff37ab6c10f2666e0d5ec0feb2e9b61aadd204a1` |
| `docs/ARCHITECTURE_RULES.md` | `28ce1b5339cd0055d4a44cc93a7af7a9d261952ce9a3cfbb5b1517b2ecee5a3b` |
| `docs/RULES_INDEX.md` | `cbbd23c150389ddc2505bb90823819002707f2e002a62d4e6ca3a972f451ece2` |
| `docs/UI_RULES.md` | `1ee175443d461fff4b55f8a3cdaa75a39818ca5aed13c2fdffd51350dfe2a66d` |
| `.claude/rules/runtime-code.md` | `ebc70ac414a53e4fd29632b86c2dd1e554b99af10810f02a65d3eb9096d8f507` |
| `.claude/rules/player-ui.md` | `323f682c757751684ab5a4a46e2b2e5b6c31fe0cbb8ef3f2836ae049ef2146cd` |
| `docs/gm/SHARED_WORKTREE_PRACTICE.md` | `fd8859a2701987ffeac32b1ab140120dd15f059bc490157e220c2f48183a620f` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/LEAD_LIFE_SYSTEMS_DESIGN.md` | `8b3e19983ef48e47ef3a79813e686a37500b1f9c3429018781a754ddff5589f4` |
| `src/simulation_contracts.js` | `74ea9305ff0f1e455a09cbcb557afbb0578c4dc1dfe7a71c5be7a921a6749158` |
| `src/simulation_effects.js` | `c85876a9d6b2824e8650938a1237184119c2073f3c129c6d5236be98fda261a9` |
| `src/simulation_ui.js` | `edbe987f4661cd977e65e971c513a7dc613036e54deab675551de57bb06c714b` |
| `src/expansion_persistence.js` | `d26e710608f3c5e5ab918bf95e62d4951a12a6386cf69f2b58f141f0dc7e7e90` |
| `src/person_memory_effects.js` | `83ec9366684007407b14d05586f8279db5d6a4c1e4619d1b344e148e4f118615` |
| `src/generated_people.js` | `49acbbe3b33d6abdd6f692dde475e145ff190bdc068a46660dcf845352bc3bc9` |
| `src/simulation_content.js` | `e66d8685a7f77cb987a64b11e3079e826e8dac3f1653da655276bb37fd4cbc5a` |
| `src/people_knowledge.js` | `2eba6691d3d6a0f840a14522418a2d93b31df7f0679e534c5f4c4e81c5ed39c4` |
| `src/person_memory.js` | `32cc21ea6c5c3d87da91fffecfa68f25a5291c05535153909f133009e69eac26` |
| `src/domain_registry.js` | `470c6c5db8bcc6d0db07d9d7d80a1cabdcbe25bdc974e5fdf6b3b4f8a4ea0fa8` |
| `src/everyday_life.js` | `cabf413b30aa7928aa651e0c172fd9aba88c4f283581694c84ece9fa1c908215` |
| `tests/person_memory_persistence.test.js` | `4c99ceb5987e8c280f3e9afb0297e662c172cae01fecbab83931dc4dabb7075d` |
| `tests/person_memory.test.js` | `e21be7e261132b18e2bc9b992ca3029b150cc95dc7677b482482bcd0dcf0fd6c` |
| `tests/person_memory_effects.test.js` | `adbafac2ba4ece0a7f3ca9f43fe4dfe669aa1ec7e0f61c85613a762411326fe7` |
| `tests/person_memory_route.test.js` | `ab631b2822131d21f2605e424c5c495c5664cb7bf4bd9ad1d2343447ba6366f9` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_CHECKPOINT.md` | `37f45c8262de913e4fae8e7baa2b0083b563ba746468c04a65714585ac360763` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR1_MEMORY_RECORDS_BRIEF.md` | `7a3dd63b05587138befaf188732db2649f5f93e30a9722f4432e357df425eca6` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR2_CHECKPOINT.md` | `7e372f8bf7b1f3dcaea1ed9c488ef2f2746f9785a785729459bbca63fa1a5cdc` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR3_TRAIT_TEMPERAMENT_BRIEF.md` | `94fbd09d791f25884e380e0c9d3f22e795a7047c5ac45c007fb8d57eeb89923f` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR3_CHECKPOINT.md` | `ff5431cdae2fdc3d3a435e4cc59ced48053455150f751dd00bde5c5fb9033aaa` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/cast-lives-lanes/MR2_MEMORY_EFFECTS_BRIEF.md` | `468e12e6932df794161322ef2dc28d59f9b5fec52a2d220803836d92a955cd3c` |

## Changed-file inventory

Owned leaf files: `src/person_temperament.js`, `src/person_memory.js`, `src/person_memory_effects.js`.

Owned tests: `tests/person_temperament.test.js`, `tests/person_memory.test.js`, `tests/person_memory_persistence.test.js`, `tests/person_memory_route.test.js`. The existing `tests/person_memory_effects.test.js` is run but unchanged.

Shared files are exactly the six in the shared-hunk table. The fourteenth changed file is this checkpoint.

## Supplemental read inputs

SHA-256 measured after reading, for additional unchanged rule/tool/check inputs and the later focused test readers.

| Input | SHA-256 |
| --- | --- |
| `src/gen_kit.js` | `bbbd05aea220aae5f1a8af48252f771851ad089690c9e68f2be0e19c99d38ec4` |
| `scripts/headless/runner.mjs` | `d3c0beb4aa949fc9ffd31087aa466f33dd96964fd5cbe651c0b3c38c0997cc0a` |
| `scripts/headless/dom.mjs` | `5a997f3f3fd6bbdf072508e0aaa94f6ff0c4193d39d477b3ae4cbf3c972775bc` |
| `scripts/check_architecture.mjs` | `a507b19e20e277b6cdd5f1d1bad0f9eeac180d9647843fc7a2920b626dfdbb6f` |
| `scripts/check_receipts.mjs` | `dc1b73c22360ec5dd0dbb02031a571412c80e389d07f34a07811165c784a8500` |
| `docs/LEAD_LIFE_RULES.md` | `cc6e62ea8de270497ffbb753595c402fea5db1166ad92a5c74d3b517ae69a1b4` |
| `docs/gm/dispatch/protagonist-life-2026-10-27/COORDINATOR_HANDOFF_2026-10-28.md` | `8aaba8a07d1ae900f109c16039da0709a6a9f31228be8caff9e109b292c388b2` |
| `tests/simulation.test.js` | `04ed85fdfee321cf075b32d7c8934d5504a7066ffe009312ec0469d6a22f7011` |
| `tests/everyday_life.test.js` | `2374c243b43b294aef212ecef18ed9a079fa619fe59efb6c0a2fd28960f0dd81` |
| `tests/simulation_ui_hidden.test.js` | `ec3d51e48dd236d078c41e03b3ea5790d02dd229d67eb4fd3fda0978579ee583` |
| `tests/simulation_hidden_display.test.js` | `1e80f4348d1cc83537c88ad07bb00236991259581a2bc0cdf36c4abd1fc45836` |
| `tests/simulation_extensions.test.js` | `064ca0bc1158399a92516e8eb038ebff09cefe99661b481d0b0e8c1e09505689` |
| `tests/people_knowledge.test.js` | `4da1186fa2fe8c5f554723aa4e07fe0bb780240dacc2c68077ca1d52d3ff2247` |
| `tests/generated_people.test.js` | `a43b2c97c659731101f77dc41d74c9ae0812c4e3019d3abd5567daef2e57a6bc` |

## Final output SHA-256

Measured after the trace-only test cleanup. Native bundle inputs have the same gameplay code as these outputs; only worker tracing and the worker timeout changed after the combined run.

| Output | SHA-256 |
| --- | --- |
| `src/person_temperament.js` | `491f815419ae8cf3312f9f42cdef179a8b4f304591b86a0d638dadf919ffa29c` |
| `src/person_memory.js` | `cffd76679c8208363268d460bb378a319dd51cdeb68e166d52b0b1bf13877354` |
| `src/person_memory_effects.js` | `a4a70d9aa48d884a87054cff2c03b552084087ef02cbc597b0017a1a656b6c02` |
| `src/simulation_content.js` | `3390d22df3c69c868d085b43bf87ab3d41499f3bfd29e6d028b9b690a27dd759` |
| `src/simulation_effects.js` | `e4bb3392dd40bdc5197a0244d0cb619818fc1781d2a06c62ce997de51a1eb24c` |
| `src/simulation_ui.js` | `4276a121e1201dcc413e7a62bab602aae0aa4ac49c2702392e3449595302f30e` |
| `src/people_knowledge.js` | `45383852f23e205c5a5b27bcd9b506c77890620273ba9c74cf3e4c0c48ea7326` |
| `src/domain_registry.js` | `966ccacca0715831af877e9af32dc8d699354bb17f524e94b78a3a380227b71c` |
| `src/expansion_persistence.js` | `73b0aed9b7c98cb01956d6642c574cdc60254951984b7a05bb97bcedab40a8cc` |
| `tests/person_temperament.test.js` | `350829b25f013da74d5a6db8d83dea5d21054bf189422bb9f885d021eedc3ad2` |
| `tests/person_memory.test.js` | `a23a14101b6bbb30f52b5b80d134872159708f912775dc372af6d48a304b2f43` |
| `tests/person_memory_persistence.test.js` | `bf9c4a5718185b806bb3c7f69403e048ed0bf80e2d145744731f220bc53970f4` |
| `tests/person_memory_route.test.js` | `b7e3b5aeaf966fbdb1e2e1be1e431224e168022702c6c5a72df809bccfbbdb8d` |

Additional read inputs: `src/main.js` SHA-256 `3489afeca4eeda929425077ea83cb015765c3bfc83152e9ba215f7a8922c8ec1`; `src/ui_components.js` SHA-256 `da22884ef878a4ce2efa0263e3f8cc18b86da33bd4e6481fdbd81f387cd7b47f`. Neither file was changed by MR3.

## Coordinator review (2026-10-30)

- Browser floor met for the amends route: rebuilt bundle (SHA-256 `741d449b…f63a94a3`), fresh origin, headless Chrome at
  1920x1080, real pointer clicks (meeting and supplies by the named fixture). After "interrupt his counting" the
  workshop line reads "Wary of you since you interrupted his counting at the bench."; after the practical apology it
  reads "More at ease with you since you apologized and supplied a log. Lets the interruption rest after your amends.";
  the same after Save and reload; the player's knowledge gains the seen trait `forgiving`. Page call 87 ms under
  heavy machine load. Screenshots private in `docs/research/novels/lord-of-mysteries/private/cast-evidence-2026-10-29/mr3/`.
- Focused and owner tests (13 files): PASS 94/94. `npm run check:arch`: PASS, no growth.
- `npm test` could not finish cleanly: the machine sat at load average 150-180 from other sessions' processes. The
  failures were all disposable-copy integration tests (cast card, journeys, ability, body, divination, exchange,
  inference, making, topic talk). Each file passed when run alone after load fell: card 1/1, journeys 10/10, topic talk
  7/7, ability/body/divination/exchange 20 of 20 before an external kill, inference and making 11/11.
- Noted, not in scope: the workshop panel still lists other worlds' actions (for example spirit or deck actions) as
  visible buttons; that is existing panel content, not MR3.
- State: P3b at the floor for this route; agent-verified, not human-reviewed.
