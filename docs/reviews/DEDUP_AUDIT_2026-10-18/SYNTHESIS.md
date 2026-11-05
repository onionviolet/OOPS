# Duplicate and consistency audit: synthesis (2026-10-18)

Read-only audit by 12 Sonnet agents (S1-S4 src, T tests, D1-D2 top-level docs, D3 worlds, D4 reviews/audits, D5a gm, D5b gm/dispatch, D6 research). Each report lists exact paths, VERIFIED or SUSPECTED labels, and its own coverage gaps. Findings are proposals, not accepted decisions; nothing was edited except these reports. Counts below are as the agents reported them (D5a's own "2 high" tag was wrong; it is 9 med, 9 low).

| Report | Findings |
|---|---|
| S1 src 1-185 | 18 (3 high) |
| S2 src 186-370 | 22 (2 high) |
| S3 src 371-538 + merged files | 12 (1 high) |
| S4 src subfolders | 24 (2 high) |
| T tests | 23 (0 high) |
| D1 docs top 1 | 24 (3 high) |
| D2 docs top 2 + USER_VISION | 20 (2 high) |
| D3 worlds | 15 (1 high) |
| D4 reviews/audits | 22 (4 high) |
| D5a gm | 18 (0 high) |
| D5b dispatch | 17 (4 high) |
| D6 research | 14 (0 high) |

Merge check: the earlier merge left no conflict markers or duplicated hunks in main.js, simulation.js or simulation_effects.js (S3).

## Cross-area themes (same problem found by several agents)

**X1. Helper boilerplate cloned across src (S1-F1, S2-F1/F5/F6/F7, S3-F1, S4-F1, T-F5..F7).** `eq/all/check/natural/object/copy/same` and effect builders (`money/item/know`) are redeclared in about 79 files, and have drifted (argument order of `stamina`, JSON depth limits 16/24/30/32, `same` meaning stringify vs structural, `fail` having three meanings). The test side repeats it: the esbuild stub loader in 10 tests, hand-rolled fake DOMs in 8. Fix: one no-import leaf module (not `simulation_contracts.js`, which creates cycles) plus one shared test harness.

**X2. Cloned world binding stacks (S1-F3, S2-F2, S3-F2).** `book_world_mol_native`/`paradise_native` are 88% identical; `proto23_world_native`, `feature_expansion_nested_native`, `feature_expansion_destination_*` and four `steam_*` stacks share large blocks. Related stale claim: S2-F13 says two modules call Mother of Learning and Paradise unbound while native modules exist.

**X3. Hash/RNG copies (S3-F4, S4).** FNV and xorshift pasted in simulation.js, simulation_resolution.js, start_records.js, expansion_engine.js; `gen_kit.js` duplicates `mix32` from `seeded_streams.js`. Combat hit/evade math lives in three places (S4-F10).

**X4. Architecture ratchets do not bite (S1-F11, S2-F11, S3-F9, T-F12).** `check_architecture.mjs` passes with main.js +49 lines, display.js +103, save_files.js +54 over baseline; a 56-module import cycle exists (removing `simulation_effects.js:50` import shrinks it to 37); `trade.js` still imports main.js; main.js has 13 unused imports; `core_ratchets.baseline.json` allows 60 `Math.random` calls against 24 real.

**X5. Real runtime defects found while auditing (verify before trusting).**
- S4-F6: `src/data/traders.js:27,32` use template "Cafe trader", which does not exist (`inventory_templates.js` defines "Cat cafe"); `trader_component.js:118-122` indexes it unguarded. Inferred, not run.
- S4-F7 / T-F20: `src/mods/glassmaking.js` imports a missing file.
- T-F20: `src/absorb_p23/repeat_search/panel.js` is never mounted.
- S4-F9: seven "(proposal)" panels mounted on Local actions at `main.js:10009-10021`, against UR2.

**X6. Rule-code collisions (D1-F2, D2-F1/F2, D3-F1/F2).** Registered prefixes (CX, GR, SR, AU, MR, AR, AD) and others (SU3, NX1-NX10, OM3, WT2, IL12, CW3) are reused for unrelated local tables; sealed-secret "S1.." IDs collide with ordinary S-codes, and the `sealed/` folders that WORLD_SECRETS_AND_DISCOVERY points to do not exist. Four weaponcraft palettes overlap with colliding codes.

**X7. Acceptance status drift (D1-F1, D2-F4, D4-F2, D4-F1, D5a-F14).** RULES_INDEX lists GR/CX as "never binding" while the register and PROJECT.md say accepted. IDEA_INDEX and three core audits still call BHR/CBR/ECR/SLR "Proposed" while RULES_INDEX says "Accepted 2026-10-18" (D4 found no USER_VISION entry recording that acceptance, which needs Weibao's confirmation, not an agent edit). Six review passages say "M3 remains stopped" while the modular-seams checkpoint says it passed. AGENTS.md cites AD1-AD36 (index has AD38) and UR41-UR48 (UR49 exists).

**X8. Stale "never implemented / no name" claims (D3-F7, D4-F4/F5).** Docs say `buildLifeHeirSave` is never called and "no cheat is implemented" and "no game name is selected"; `src/main.js:2763` calls the heir builder, `src/cheat_cards.js` exists, OOPS was accepted. Line anchors into main.js/display.js are 1,000+ lines off (D3-F5, 355 of 4,598 sampled); 20 `file.js:N` citations are not links.

**X9. Duplicated docs and snapshots (D1-F12, D4-F3, D5a-F1/F2/F3, D3-F3).** `docs/ENGINE_AUTHORING.md` vs `docs/gm/book-world-completion-2026-10-06/RECOVERED_ENGINE_AUTHORING.md` (5 changed link lines, 44 dead links); the Core-rule reconciliation block pasted into six audits; 57 BEFORE/HISTORY snapshots (4.1 MB); 12 near-identical ASSIGNMENT.md; about 34% of `world-core-kit-2026-10-14/cards/` is identical template text; the viewport decision is restated in 8 places with drift, and THEMATIC_UI_AND_INFORMATION_DESIGN still sets 1366x768 as the default (D2-F6) against the 1920x1080 primary target.

**X10. Repository bulk and state conflicts (D5b, D6).** Dispatch holds 12,074 files (1.9 GB), 809 MB tracked, 482 byte-identical clusters (125 MB redundant between tracked files); drifted copies of `src/` live in three dispatch folders (main.js copies about 1.4 MB each); 41 `launch.py` copies in 22 variants; 265 files hardcode a Playwright path. Research has 66 identical-file groups (about 2.7 MB) and 278 unresolved relative links. State conflicts: `world1-full-completion` STATE.json says active while CHECKPOINT.md says ended and PROJECT.md:539 says paused; FUTURE_ACQUISITION_QUEUE says Magical Diaries is not owned though a finished pass exists; three sets of queue edits were never applied; four owners give different game counts. `SHARED_WORKTREE_PRACTICE.md:67` says push under existing authorization while AGENTS.md says push waits for a yes.

## Suggested order (proposal, for Weibao's call)

1. Fix the doc truth first, cheap and risk-free: X7 and X8 status/anchor drift, AGENTS.md counts, the SHARED_WORKTREE push line. Needs the USER_VISION acceptance question answered (X7).
2. X5 defects: the traders template name, the glassmaking import, the unmounted panel. Small, each needs a regression and a browser check.
3. X1/X3 as one structural change (shared leaf module), separate from behavior per AR rules, then X2 clones one stack at a time.
4. X4: make the architecture check fail on growth and refresh baselines in the same change.
5. X6 code collisions: add a prefix register entry rule, then rename local tables.
6. X9/X10 repo bulk: dedupe tracked evidence and snapshots; this touches history-like material, so decide what is kept as dated history first.

## Limits

Agents skimmed or machine-checked, not line-read: big palettes (LIFE_SIM_NORTH_STAR, ENGINE_EXPANSION), about 4,000 of USER_VISION's 5,300 lines, two 3,000-line book data tables and main.js/items.js (grep only), 114 CHECKPOINT.md bodies, per-game research dossiers. Tests were not run, the full suite was not run, nothing was built or browser-checked. SUSPECTED items (D4-F12, D4-F15, S4-F6's runtime throw) need verification before action.


## Content reconciliation, 2026-11-04 (B160)

The entire synthesis, FIXES_DOCS/FIXES_RUNTIME, L1–L4/L6 reports and [follow-up checkpoint](FOLLOWUP_CHECKPOINT.md) were read. The original twelve shard bodies are separate inputs, not newly reviewed through this synthesis. Keep VERIFIED versus SUSPECTED, sampled/grep-only versus body review, and source defects versus exercised behavior distinct. Historical counts, architecture baselines, cached file sizes, line locators and acquisition/manifests are dated inputs, not current inventories.

The follow-up records supersede the original suggested queue at their exact scope: equivalent leaf/hash extraction, one native-binding stack, ratchet/cycle/trade injection, test harness and headless stub fixes, doc corrections and recorded integration. Deliberately different helper return types, defaults, depth limits, argument orders, clock/hash variants and combat calculation/readout semantics were left distinct. Duplication alone does not establish a shared behavior contract. The gen-kit import-free test was a named constraint; native recipe seeded Proxy handling is separately qualified in B145, not a blanket ambient-RNG verdict. The repeat-search alternative consumer also prevents equating an unmounted obsolete panel with absent gameplay.

Later checkpoint sections record merged work and subsequent R51/runner/cafe/profile fixes, qualifying earlier unmerged and baseline-failure statements. The combined trial still had one R51 failure before the later scoped repair; cafe proof covered first fill, not epoch refresh, and Paradise full active restore remained unexercised. No fresh full suite, current architecture census, current UI acceptance or all migrated-path proof was obtained here. Current live rule owners settle authority; this old acceptance-confirmation question does not require Weibao to restate established decisions. Snapshot/dispatch bulk removal, sealed-ID changes, seven panel relocations and future clone extraction are not authorized by this read. Preserve their useful proposals and history without deleting evidence or dispatching their suggested order.


## D1/D2 content follow-through, 2026-11-04 (B161)

D1-F1–F24 and D2-F1–F20, their additional notes and full coverage/skip lists were read. A concrete contradiction inside this audit is resolved by the owning record: D1-F21 and D2-F4 already cite the October 18 USER_VISION acceptance quote, while synthesis X7 repeats D4’s claim that no record exists. The current [acceptance record and subsequent confirmation](../../USER_VISION.md#proposal-rulebooks-accepted-2026-10-18) explicitly preserve both Weibao’s original acceptance and October 19 confirmation, state the core-rule condition and identify D4-F2 as wrong. No repeat confirmation is needed. This qualification also applies to FIXES_DOCS’s historical acceptance question. Original audit text remains as history.

Current [reserved-prefix owner](../../RULES_INDEX.md#reserved-prefixes-2026-10-19) now reserves the registered namespaces, assigns bare codes to their rule owner and requires file-qualified external local citations. D1/D2’s requested registry is not wholly missing; historical local-code observations still need specific current-input checks rather than a mass rename. The present register and PROJECT shape supersede their old rule counts, 1496-line status summary and suggested next AD number. Do not edit user quotations, frozen snapshots or verbatim roundtrip payloads to make their old wording look current.

Retain the substantive design constraints behind the duplicate findings: knowledge-filter return recaps, actual imported mechanisms rather than permission tags, meaningful compatibility decisions rather than universal migration, independent source/test/browser/persistence/install/integration dimensions, and current desktop direction. Engineering and authority rules are not automatically softened by a search for “never.” Distinct weaponcraft companions, seeded fixtures and pinned recovered authoring files need unique-content/provenance accounting before any consolidation; duplicate bytes or thin index coverage do not authorize deletion. Their machine scans and sampled large palettes do not confer complete semantic review of those bodies, raw captures or current runtime. New implementation, blanket renames and audit-wide source verification remain outside this reconciliation.


## D3/D4 content follow-through, 2026-11-04 (B162)

D3’s fifteen and D4’s twenty-two findings were read in full with their stated scan, sample and excluded-body coverage. D3’s 983 multiply-defined codes were not 983 confirmed semantic collisions; only about fifteen examples were compared. Its “one in three readers” estimate was not a measured usability result. Repeated NPC display names are not an established world-qualified ID defect. A missing proposed file is different from an evidence claim naming a missing test, and a private-pack absence inference cannot be settled by public-tree grep alone. Preserve secret IDs/routes without exposing underlying truth or choosing a new registry scheme here.

D3’s cards/template and recovery-copy findings preserve a useful maintenance concern, but duplicate bytes do not permit discarding unique world deltas, chronology or evidence. Frozen source-line citations may still identify a historical build even when they no longer locate live symbols. Existing L6 follow-through and separately reviewed current owners qualify named stale claims; this read does not certify every world, primary source, leaked-secret path, full-save restoration or current command count. D4-F2’s acceptance-record error is now explicitly corrected in [its own report](D4.md#content-reconciliation-and-f2-correction-2026-11-04-b162). Both shards retain their original evidence and exclusions, and neither becomes a new implementation queue.


## D5a/D5b/D6 content follow-through, 2026-11-04 (B163)

D5a-F1–F18, D5b-F1–F17 and D6-F1–F14 were read in full, including negative results, suspect labels and skipped bodies. Their file/byte/hash/link inventories are historical structural coverage, not semantic review of thousands of documents, screenshots, private profiles or source payloads. D5a’s “2 high” summary is already corrected by this synthesis: its actual findings are nine medium and nine low. D5b-F16 reports no duplicated fenced JSON finding; F17 explicitly leaves secret review unperformed. Do not turn either into a defect count.

Keep the preservation requirements ahead of proposed deletion: an input snapshot can contain uncommitted dirty bytes that a commit SHA cannot reproduce; confirm actual recoverability and referenced validators before any future replacement. Identical before/after images can document an unchanged surface, and identical reload/import payloads can be the intended identity assertion. Neither proves every intended change worked, nor establishes mislabeling without the capture’s purpose. Verbatim outbound, failed-attempt, captured response and reconciled prompt files have different provenance roles. A repeated validation template is not separate per-game evidence. Recovery copies, unique assignment boundaries, historical tombstones and raw evidence remain intact. None of these reports authorizes untracking, moving, deleting, rewriting history or altering private profiles.

Later fix/checkpoint records qualify selected stale M3, push, census, queue and browser-gate claims. Original shared-tree counts, capacity policies, model settings, active thread IDs and source/tool availability do not survive as current leases or recommendations. Database LOCK files are not writer reservations. No REPORT filename within two directory levels is not proof that a dispatched job produced no result. Source-game-relative references and frozen links retain their input context. A broad index may route useful owners, but does not close their substantive review.

Research access, entitlement, source-read coverage, dossier availability and played implementation remain separate. Roadwarden reference-only versus no direct dossier can coexist; Magical Diary’s recorded payload pass does not prove present entitlement. Report/directory/manifest/game counts have different denominators. Derived hashes and paraphrase inventories are not automatically forbidden raw prose; D6-F12 did not establish that breach, and its engine-content comparison remained unchecked. Old acquisition patches, donor rankings and tool suggestions are retained proposals, not current purchase/download/research orders. Current source acquisition and tool registry owners govern any later authorized work. No library, external sources, game payloads or private saves were opened.


## T/S2 content follow-through, 2026-11-04 (B164)

T-F1–F23 and S2-F1–F22 were read with their complete negative checks and sampled-body exclusions. Historical static importer reachability, direct test-name references and line-count baselines do not establish today’s runtime coverage. B159’s current away-bank source supersedes T’s blanket test-only away-ledger statement; current registry and claim/native owner evidence remains separately scoped. Static source presence still does not prove gameplay or every supported import, and test-only infrastructure can remain a deliberate inert pilot. No “no direct test” census is promoted to no testing at all.

S2-F2’s “only world ID tables differ” is too strong: its own findings and L2’s full extraction report identify different validation guards, state/activation namespaces, owner counts, messages and calendar contracts. The later shared base covered the named MoL/Paradise pair while preserving nine differences; it did not merge all five stacks. L1 preserved return-type, argument-order, default, error, equality, JSON-depth and encoding differences instead of silently choosing one behavior. A common helper name is not a shared semantic contract. Likewise, proposed Frontier HOME constants and a shared 360-day calendar cannot silently impose one home or clock law on every world/body. Source citation metadata in a shipped data table is not by itself a runtime dependency on private files or a raw-prose breach.

L3/L4 and the later issue pass qualify named ratchet, helper, todo, crafting-stub and village-route findings. Keep meaningful independent optional-family regressions even when their assertion shape repeats. Test-count literals can express an authored finite contract; changing each to data.length would sometimes become a tautology and changing each to a floor can hide missing content. Decide from the invariant rather than mechanically removing duplication. Fixture moves, browser test regrouping/skipping, replay canonicalization, helper extraction and source deletions are not selected here. Reusing unchanged semantic receipts is different from trusting an old import graph or a suite count. No runtime checks were rerun or behavior edits made by this reconciliation.


## S3/S4 content follow-through, 2026-11-04 (B165)

S3-F1–F12/O1–O3 and S4-F1–F24 were read with clean checks and explicit source/data exclusions. S3 explicitly judged duplicated behavior by normalized text rather than runtime output. L1/L3 and later follow-up qualify named equivalent hash/helper extraction, trade-host injection, unused imports and ratchet repair, not every remaining source family. Do not route a proposed shared leaf back through a heavy cyclic contract owner merely because an older shard suggests that import. World-pack coverage lint and manifest-loader schemas remain distinct contracts; current registry/save wiring supersedes historical total absence without making the schemas interchangeable.

Several suggested unifications need substantive contract decisions. The cottage predicates include different schema, agreement and capacity conditions, so similarly named checks may answer different questions. Equipment-copy helpers return IDs, booleans or throw and may apply next-ID bounds; preserving those obligations matters. L1 compared the three hit/evade computations and found different stat, alive-count, skill, shield and encounter-hook inputs. Removing two copies as if identical could change truth or displayed odds. The local balance JSON is guarded historical data, not automatically useless because a test is its reader. Public first-slice exports and deliberate test-only APIs are not deletable solely from static reachability.

The cafe key mismatch, glassmaking deletion and repeat-search alternative consumer have exact later repair records; cafe browser proof covers first fills, not every later epoch. Proposed seven-panel promotion violation remains a suspected authority issue in S4 itself, not established by “proposal” labels or a narrow PROJECT grep. Exposure’s no-hunger-death rule does not imply immunity from every physical hazard. Future clock/daylight/constants, item-registration and injected-dependency changes need their actual consumer and world law; shrinking a baseline alone does not repair coupling. No new code refactor, panel move, item deletion, gate reset or source-wide conformity claim follows this review.


## S1 content follow-through and shard coverage, 2026-11-04 (B166)

S1-F1–F18, every clean check and exclusion were read. All twelve original dedup shard reports, this synthesis and the named follow-up reports now have their own full-content reconciliation receipts. This is report-body coverage, not full reading or renewed verification of the thousands of source/docs/test inputs those shards scanned or sampled. Their original input identities, IDs, proposed repairs, exclusions and useful history remain preserved.

S1 adds concrete contract cautions to the shared extraction findings. Structural equality is not a universal “strict superset” of JSON-stringify equality: undefined fields, key order, prototypes and supported data shapes can have deliberate validation semantics. Minimum health for strenuous combat-fit versus home activity may reasonably differ; one body mechanism does not force every task to have the same readiness threshold. Likewise, owned, held, equipped, reserved and available are different predicates. A broader cause grammar need not make every cause kind valid for every receipt. An exported hook can be a deliberate public surface, and this shard’s unused-export parser skipped later declarators. None of those scans justifies mechanical removal or accepting previously invalid state.

Later L1/L2/L3 records qualify named primitive/hash extraction, one book-native pair, cycle reduction and growth enforcement. Current bank wiring qualifies the old test-only away statement, while full unattended routines and player rewind remain different questions. Old scorecard branch status and crafting wiring are separately reconciled at their owners. Frontier constants, authored pay bounds, source-pin paths and old table counts are historical or local contracts, not new universal world laws. No remaining helper rewrite, module-key trimming, unexport sweep, price restriction or compatibility migration was selected. Continue with other loose document families; the audit’s suggested order does not replace current lead/UI priorities.
