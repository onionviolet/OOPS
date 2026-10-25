# Implementation map: abilities, procedures and subtle integrations from the world passes (2026-10-23)

Status: **proposal; docs-only architecture pass.** Nothing here is an accepted decision, selects a world, authorizes a build, a migration, a commit or a push. Module names marked "proposed" are descriptions of a seam, not reserved names (no code is created or renamed by this file). Every number quoted from a pass keeps that pass's label (shown, stated, inferred, proposed, authored); this file adds no source claims and fills no source gap (WA8).

Rules applied: WPR4, WPR5 (defaults, dials, reasons), WPR30-WPR32, WA1, WA5, WA7, WA13, WA14, WA17, WA20, AR1-AR16, GR1-GR17, GTR1-GTR20, AD5, AD6-AD8, AD15-AD17, AD22, AD36, AD38. Target viewport for every UI line: desktop 1920x1080; mobile deferred (AD34).

Current-status reconciliation: [R2 report](../gm/dispatch/overarching-reconciliation-2026-10-23/R2_REPORT.md),
2026-10-23. Superseded status wording is preserved verbatim in [R2 history](../gm/dispatch/overarching-reconciliation-2026-10-23/R2_SUPERSEDED.md).
The class cards remain proposals; newly wired source does not make their broader designs accepted or delivered.

Owner of this file: it is the cross-world implementation index. Each pass doc keeps its own findings (WPR3); this file cites them by locator and never copies their tables.

## 0. Reading guide

### 0.1 Passes read and their state when read

| Prefix used below | Pass doc | State at read time |
|---|---|---|
| LOTM | `LORD_OF_THE_MYSTERIES_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` (F1-F29, EF1-EF11, X1-X8) | landed, source-spot-checked |
| RI | `REVEREND_INSANITY_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md` (F1-F10, sections 2-9, C1-C8) | landed, drafted with spot checks |
| ORV | `OMNISCIENT_READERS_VIEWPOINT_...` (EF1-EF11, C1-C6; its F1-F10 are advice angles, not source findings) | landed, spot-checked |
| RP | `REINCARNATION_PARADISE_FACILITIES_AND_SUBTLE_DETAILS_2026-10-23.md` (F1-F29 across three rounds) | landed |
| RPD | `paradise-hub/DERIVED_WORLD_INSTITUTIONS_AND_HUNTER_BENEFITS_2026-10-23.md` (sections 1-9) | landed |
| RPG | `paradise-hub/PROGRESSION_GATES_2026-10-23.md` (RPG1-RPG8 read) | landed, inherited locators, no source row reopened |
| SS | `SHADOW_SLAVE_INSTITUTIONS_...` (F1-F11, EF1-EF10, C1-C6) | landed |
| COI | `CIRCLE_OF_INEVITABILITY_...` (F1-F24, E1-E8, C1-C7) | landed |
| MOL | `MOTHER_OF_LEARNING_...` (F1-F10, section 9 facts, C1-C8, K13) | landed |
| HP | `HARRY_POTTER_...` (F1-F23, E1-E6, floor card) | landed during this pass (it was 8 KB with a manifest only when first listed, about 48 KB when re-read); findings after the first ten E rows were not re-read |

Not yet included (pending when this file was resumed): the A Soldier's Life, TTKS and Regressor's Tale passes; classes may gain members when they land. The eight pass docs above plus the Paradise gate catalog had landed when this file was written. Finding codes repeat across docs (every pass has an F1), so every locator below carries its prefix, for example LOTM F10 or RI F1. Queue codes Q1-Q6 are the LOTM build queue; this file uses C (mechanism class), I (integration), B (build step), PC (pass-versus-code contradiction), OQ (open question) and A (action) so none collide.
The initial pass excluded A Soldier's Life, TTKS and A Regressor's Tale while pending. R2 now inspected their status headers, engine-facts tables and review limits, without reopening novels or reading their full findings. They add bounded class coverage, not runtime selection:

| Prefix | Landed owner and inspected coverage | Existing classes touched; limits |
|---|---|---|
| SL | [A Soldier's Life](A_SOLDIERS_LIFE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md), sections 10 and 15 | C1 entry/testing; C2 command/status; C3 enlistment; C9 access; C13 discipline; C16 debt; C19 healing. Owner reports 21 spot-checked claim groups; runtime stays paused. No price rows promoted by R2 |
| TT | [TTKS](TTKS_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md), header, section 13 coverage and 14.5/14.9 | Five distinct book-worlds, not one ladder. EF12 challenge C3/C4; EF14-16 office/service C2/C19; EF17 currencies C14/C16; EF18 choice C1; EF20 compensation C16. Owner says docs only, source-spot-checked; no shared values inferred across the five worlds |
| ART | [A Regressor's Tale](REGRESSORS_TALE_INSTITUTIONS_ROLES_AND_SUBTLE_DETAILS_2026-10-23.md), sections 9 and 15 | C1 intake; C2 belt/duty; C7 ticket venue; C8 fine; C11 hidden stage; C19 teaching/travel service. Owner reports 30+ spot-checked locators; source profile is unactivated, no playable branch inspected |

The initial ten prefix rows above describe their original read states (RP/RPD/RPG share one world); HP's later findings remain outside that read. Findings retain world prefixes because codes repeat. Q1-Q6 are LOTM queue codes; C, I, B, PC, OQ and A below keep their original meanings. This partial index adds no completion grade for any world.

Other docs read: AGENTS.md, RULES_INDEX (core digest), WORLD_PASS_RULES, WORLD_ABSORPTION_RULES, ARCHITECTURE_RULES, GENERATION_FOUNDATION_RULES, ABILITY_AUTHORING (causal contract and variants), PROGRESSION_GATE_RULES, the LOTM lives-and-regions QUEUE. The PIR, ECR and SLR rule texts now live in DOMAIN_RULES and were not reopened; they are cited by code only where PROGRESSION_GATE_RULES or the passes name them.

### 0.2 The unifying idea in one paragraph

Across nine worlds the passes describe about nineteen recurring shapes. Each shape has one shared verb, one row a world supplies, and one owning seam. The shared layer owns identity, custody, transactions, knowledge, clocks and save (AR12); the world owns nouns, numbers and laws (WA5). A class below merges worlds by verb and row shape, never by outcome, so a Gu auction and a Dokkaebi auction share the bidding verb and keep their own steps, fees, leaks and refund rules as data.

## 1. Honesty line: built, source-implemented, documented only

Git and file state as read on 2026-10-23 from `git status`, `git log` and file headers. A test count proves its own slice only (portable rules).

| State | What | Evidence |
|---|---|---|
| **Built (committed, in `master`)** | `src/ascension_paths.js` (path descriptor, `pathView`), `src/book_world_lotm_path.js` Seer pathway and digestion-by-acting to Sequence 8, `src/reveal_chain.js`, `src/rules.js`, `src/check_contract.js`, `src/domain_registry.js`, `src/simulation_contracts.js`, `src/native_trade_transaction.js`, `src/trade.js`, MOL pack under `src/world_packs/book_mol_pack.js`, world-pack lint and registry | `git log` shows `b6e9332dc` for the ascension and Seer files; the others are tracked and unmodified in `git status` |
| **Built and played, uncommitted** | LOTM Q1 Corpse Collector pathway. Its checkpoint (`docs/gm/dispatch/lotm-q1-2026-10-23/CHECKPOINT.md`) reports 22 engine tests passing, `check:arch` passing and a browser run at 1920x1080 on a fresh origin including a reload mid-job; the 1366x768 layout, the Seer ladder replayed in browser, ability use in an encounter and a hand-edited two-pathway save were not exercised. Files: modified `src/book_world_lotm_{actions,content,envelope,host,ids,path,state,ui}.js` and untracked `tests/lotm_corpse_collector.test.js`. Another session owns it; this file touched none of it | `git status`: M on the LOTM files, `??` on the test; test and browser results are the checkpoint's, not re-run here. Q2 districts is in flight in the same files |
| **Source-implemented, uncommitted, leaf only** | `src/progression_gates.js` (`defineGate`, `evaluateGate`), `src/obligations_ledger.js`, `src/vow_rules.js`, `src/carry_ledger.js`, `src/economy_standing.js`, `economy_standing_domain.js`, `economy_standing_ui.js`, `tests/progression_gates.test.js` | all `??` in `git status`. `vow_rules.js` and `obligations_ledger.js` state in their own headers that they are not wired into save or gameplay; `economy_standing.js` imports the obligations ledger and `household_fortunes_domain.js` imports `collectObligations`, so some wiring exists but persistence was not verified here |
| **Documented only** | every class C4, C6, C10 (as a mechanism), C12, C13, C14 (as a conversion registry), C15 (as a pack record kind), C18 (as a document record), plus the shared forms of C2, C3, C5, C7, C8, C9, C11, C16, C17, C19; all pass findings; the whole HP, RI, ORV, SS, COI, RP runtime; MOL's source loop | grep of `src` finds no auction module, no jurisdiction resolver, no clearance or group rule, no loss-of-control mechanism beyond strings and text fields, no hearing procedure |

Nothing in this file was run, built or played. Anything above labelled built means committed, not browser-verified by this pass (WA19).
The initial nine-world survey describes about nineteen recurring shapes. Each shape has one shared verb, one row a world supplies, and one owning seam. The shared layer owns identity, custody, transactions, knowledge, clocks and save (AR12); the world owns nouns, numbers and laws (WA5). A class below merges worlds by verb and row shape, never by outcome, so a Gu auction and a Dokkaebi auction share the bidding verb and keep their own steps, fees, leaks and refund rules as data.

## 1. Honesty line: built, source-implemented, documented only

Current source inspected for R2 at HEAD `547209e82c29e897e6b602a4ef5d8e8ab46b3ebf` plus the exact dirty-input hashes in [R2 checks](../gm/dispatch/overarching-reconciliation-2026-10-23/R2_CHECKS.json). Shared working-tree files are moving inputs. The original committed/untracked inventory is historical, not a current delivery claim.

| State | What | Evidence and limit |
|---|---|---|
| **Source present; baseline delivery elsewhere** | Ascension descriptors, native transactions and registry, MOL/HP pack infrastructure and existing Paradise branch | Original survey remains in R2 history. R2 did not rebuild or establish app adoption; use PROJECT's current routing and its receipts |
| **Wired; owner-reported browser proof** | LOTM Q1 second pathway and Q2 districts | [Q1](../gm/dispatch/lotm-q1-2026-10-23/CHECKPOINT.md) reports 22 engine tests and Corpse Collector journey. [Q2](../gm/dispatch/lotm-q2-2026-10-23/CHECKPOINT.md) reports 29 engine tests, both district journeys, Seer to Clown, mid-act reload and literal save import at 1920x1080. District teams remain records, not embodied supervisors; broader encounter/pacing checks stay open |
| **Wired source; focused test definitions inspected** | B2 pathway/assessor factory, B3 cause rows and switching-record validation | `book_world_lotm_pathways.js`, `lotmPathwayCommands`, row-driven validator and view; `tests/lotm_pathway_rows.test.js` contains stub-third-pathway, cause and flagged-save cases. No B2/B3 browser receipt located; test file read, not run. Q1/Q2 proof predates these inputs |
| **Wired source, not leaf-only** | Progression gate used by chain inspector; obligations consumed by household/economy; standing domain imported by trade; carry ledger/codex domain imported by UI extras | Inspected producer/import/registry edges and save/load hooks. [Lives receipt](../gm/dispatch/itch-wiring-2026-10-23/lives-carry-wiring.md) proves its bounded inheritance/codex journey. This does not prove all shared contract/status designs or every crossing |
| **Documented proposal beyond bounded implementations** | Generic auction, hearing, conversion registry, institution/status/contract/document shapes; broader C10 pressure/trigger/recovery mechanism; source-loop and later source-world coverage | LOTM has concrete district and cause rows; Paradise has an existing optional campaign, and HP has pack infrastructure. Their newly researched institutions are not thereby implemented. R2 did not audit each world's full runtime |

No gameplay, tests or builds were run by R2. Receipt results above remain attributed to their owners and input scope. Normal-app entry/adoption, publication and director acceptance are separate; localhost LOTM proof does not establish normal-app availability.

## 2. Seams relied on (read-only survey)

| Seam file | What exists | What is missing for this map |
|---|---|---|
| `src/ascension_paths.js` | `definePath`, `pathView`; crossing types quota, structure, insight, trial, ingest, digest, consume, recognition, bodyPoint; stages with `failure` text; position is derived from facts, nothing saved | Crossings test one numeric `need` per fact; no `all`/`any`/`not`, dials, attempts, examiner or clock; failure is text, not a mechanism |
| `src/book_world_lotm_{ids,actions,content,state,envelope,host,ui,path,domain}.js` | One branch, authored commands via a local `cmd()` helper, flags in actor facts, resources for acting counts, `state.lotm` fixed at schema 1 (queue gate) | Second pathway was added by copying commands, flags, validator lines and view branches under a `cc.` prefix; no pathway factory |
| `src/book_world_lotm_{ids,actions,content,state,envelope,host,ui,path,domain}.js` | One branch, authored commands via a local `cmd()` helper, flags in actor facts, resources for acting counts, `state.lotm` fixed at schema 1 (queue gate) | Current `book_world_lotm_pathways.js` supplies pathway/assessor/cause rows; actions, validator and ladder read them. Broader generic pack extraction remains a proposal; B2/B3 browser parity not established here |
| `src/book_world_mol_{actions,content,host,ids,native,state}.js`, `src/world_packs/book_mol_pack.js`, `src/world_pack_registry.js` | Commands, powers, conditions, encounters are pack data installed through `packNative('book.mol')`; the actions file is a freeze plus a fact reader (WA17 pattern) | The LOTM branch has not been moved to this shape |
| `src/world_pack.js`, `world_pack_loader.js`, `world_pack_manifest.js`, `world_pack_save.js`, `world_pack_population.js`, `world_packs/book_hp_pack.js` | Pure pack lint and kit coverage, pins, save, population with seeded streams | No institution, status, venue or contract record kind in pack lint |
| `src/progression_gates.js`, `src/rules.js` | `defineGate` (kind, requires, reason, costed routes, closes, overflow, dials), `evaluateGate`, `evaluateRule` | Not imported by ascension crossings; no attempt counter, no group-count leaf |
| `src/check_contract.js`, `src/check_resolver.js` | Fair-die check profiles, exact odds, `prepareCheck`, `outcome`, `applyCheckPolicy`; resolver has stream keys | No weighted outcome-distribution catalog with top-contributor reasons (GR9) wired to a table |
| `src/capabilities.js`, `structured_ability_runtime.js`, `techniques.js`, `technique_content.js`, `feature_expansion_powers.js` | Source and capability providers (kinds skill, equipment, knowledge, trait, bloodline, technique, condition, world, support), stacking, powers with energy | Not a cause-keyed hazard model |
| `src/simulation_contracts.js` | Command ops incl. `transfer` and `custody`, `knowledge` with stages and basis, claims, relationships, faculties, powers, titles, sites, jobs with costs, effects, duration and cancellation; `state.simulation.custody` rows `{owner,count,at}` | No two-sided hold with verify step; no offer-with-expiry record |
| `src/native_trade_transaction.js`, `trade.js`, `market_saturation.js`, `economy_domain.js`, `economy_standing*.js` | Quote fingerprint and synchronous revalidation; vendor trade with host callbacks; standing tiers, loans, insurance, price memory, rumour draw and view (untracked) | No auction, no stock refresh with banked attempts, no bound-goods flag, no multi-currency conversion by status |
| `src/obligations_ledger.js` | Record `{kind coin/favor/grievance/duty, debtor, creditor, amount, why, source, since, eases, carries}`, adapters from household, career, heirs | Header: not wired to save or gameplay; no vouching or sponsor kind |
| `src/native_trade_transaction.js`, `trade.js`, `market_saturation.js`, `economy_domain.js`, `economy_standing*.js` | Quote fingerprint and synchronous revalidation; vendor trade with host callbacks; standing tiers, loans, insurance, price memory, rumour draw and view; trade imports domain host and domain registers save/load | No auction, no stock refresh with banked attempts, no bound-goods flag, no multi-currency conversion by status |
| `src/obligations_ledger.js` | Record `{kind coin/favor/grievance/duty, debtor, creditor, amount, why, source, since, eases, carries}`, adapters from household, career, heirs | Header retains the earlier unwired claim, but household imports `collectObligations` and economy writes/reads ledger state. No single migrated writer authority or vouch/sponsor kind established |
| `src/simulation_clock.js`, `away_ledger.js`, `realm_clock_leases.js`, `realm_boundary_rules.js`, `expansion_engine.js` (checkpoint and rewind of scenarios), `backlog_expansion_time.js`, `carry_ledger.js` | Engine timers, banked-minute ledger, clock leases over the played clock, scenario checkpoint and rewind, carry rules by boundary (death, rebirth, world crossing) | No loop-restart boundary; no deadline-with-death clause; no cadence-gated exam window |
| `src/people_knowledge.js`, `world_knowledge.js`, `action_legibility.js` | Witnessed-content projection, authored identity versus player knowledge, retained observations and explicit disclosure | No priced-claim or perishable-knowledge model |
| `src/region_view.js` | Read-only list of connected places with travel time | No authority, jurisdiction or response resolver (SR1-SR24 are docs) |
| `src/domain_registry.js`, `save_files.js` | Domain lifecycle (id, deps, initialState, save, validate, migrate, load, tick, projection); envelope validators | Expansion engine was not opened beyond its export list and imports |
| `src/audit_remainder_offers_content.js` | A bespoke escrow: a client's price moves into a `supply_escrow` resource until delivery or decline | Single-feature, not a shared held-lot record |
| `src/agreed_duty_*.js`, `feature_expansion_society.js` | Agreements with durable receipts between society actors | Scoped to one feature; the nearest existing contract-receipt pattern |
| `src/vow_rules.js` | Data-driven vows, bonus while kept, scar when broken, plain JSON slice `progression.vows@1` | Unwired; scar is the nearest "pressure" shape for loss of control |
| `src/vow_rules.js` | Data-driven vows, bonus while kept, scar when broken, plain JSON slice `progression.vows@1` | Header says unwired; `pledges.js` and `pledges_content.js` import these rules, and native composition configures `pledges_domain.js`. That does not make LOTM pressure/trigger/recovery implemented |

## 3. Mechanism classes and their cards

Format: **Members** list the passes' abilities and systems with locators. The **card** gives verb, row shape, seam, procedural parts (GR1-GR17), save, away time, UI and the smallest slice. Values in rows are examples of fields, not authored numbers.

Procedural parts follow one convention. Stream keys use the GR2 form `purpose/subject/slot` and are scoped to world and life (GR14). The owning clock is named (GR17). Each generator states a budget (GR11), a reader (GR12), freeze-on-reveal (GR3) and the three tests (GR16: seed sweep, golden snapshot for three seeds, save/reload/import gives the same next value). Where a class needs no generator it says so.

### C1 Ascension ladder with typed crossings (digest by acting, ingest, exam, recognition)

**Members**
- LOTM: Seer and Corpse Collector ladders; digest by acting; assessment by a senior deacon, not the local captain; three-year wait on the previous potion; dose ingest as the irreversible step (LOTM F9, F18, EF3, X3, X4; queue Q1, Q6).
- RI: sect ladder outer to supreme elder with 3-, 8- and 15-year exams and loyalty missions; rank floors for roles (RI F4, section 2 sect row, section 6).
- RP: Tier 1 to 9 promotion missions with a three-attempt counter, rings, survival tests (RPD 9.3, RPG1-RPG8, RP F11, F14, F26).
- SS: Awakening, civil "seventh rank" scale beside Spell ranks (SS F3, C2).
- MOL: first-circle certification, mentor year, Guild categories (MOL F3, F4).
- HP: OWL/NEWT grades, class entry set by the teacher, Auror entry thresholds, Apparition at 17 (HP F9, F10, F21, E5).
- ORV: constellation sponsor stages are covered by C2; the Story/overwrite limit is C10.

| Field | Entry |
|---|---|
| Verb | Cross to the next stage when the stage's crossings are met; some crossings are acts (digest), some are held items (ingest), some are another person's judgment (recognition). |
| Row shape (world supplies) | The existing path descriptor: stages with crossings `{id, type, label, fact, need, irreversible}`, grants, failure. Proposed optional additions, all additive: crossing `gate` (a `defineGate` id) so a crossing can use all/any/not and dials; `clock` (cadence or wait, with the owning clock); `examiner` (a role fact, so the authored Warden Hale is replaceable by a senior deacon, LOTM X3); `attempts` (max and consequence). |
| Owning seam | Exists: `ascension_paths.js` `definePath`/`pathView` (committed). Missing: crossing-to-gate link (two evaluators exist: `pathView.met` and `evaluateGate`, against GTR9), attempts, examiner, cadence, and a pathway factory. LOTM currently copies a pathway by hand (see PC1). |
| Owning seam | Exists: `ascension_paths.js` `definePath`/`pathView` (committed). Missing: crossing-to-gate link (two evaluators exist: `pathView.met` and `evaluateGate`, against GTR9), attempts and cadence in the shared crossing evaluator. LOTM now has a local pathway factory and assessor rows (PC1/PC2); this is not yet a generic ascension examiner mechanism. |
| Procedural | Exam and assessment outcomes: stream `ladder/{pathId}/exam:{stage}/attempt:{n}` scoped to world and life, clock = world clock, via `check_contract.js`; budget one draw per attempt; reader = the promotion command; freeze the shown outcome. No generator for the ladder itself. |
| Save | Position is derived from facts (nothing saved today). Attempts as an actor resource `{world}.{path}.attempts.{stage}`; cadence start as a fact timestamp. Additive actor facts and resources, `state.lotm` stays at schema 1 (queue gate); other worlds add an optional slice through the registry (AR2, AR6) under the 2026-10-17 compatibility decision. |
| Away time | Digestion by acting advances only through acts the player chose; a cadence wait (three years in LOTM F18) runs on the world clock and banks while away (AD15-AD17). The ladder never advances a stage on its own. |
| UI | Existing path panel (`pathView` ladder with felt state). Add a "next window opens" line; shows count of acts as a plain record (LOTM view already does). |
| Smallest slice and test | Q6: third pathway as a row plus the examiner role. Test: three descriptors built from one row factory produce identical command shapes; an old save with only Seer facts loads unchanged; the exam read from data. |
| Unlocks | LOTM Q1 (done in tree), Q6; RI sect slice; Paradise tier slice; MOL certification; HP class entry. |

### C2 Status bundle: right, duty, attempts, revocation (rank ladder with right plus duty)

**Members**
- RP: each tier step pairs a right with a duty or cost; Tier 5 rights and five duties together; contractor, employee, Hunter statuses and the routes between them; Hunter level separate from tier (RP F11, F26, F10, F14; RPD 1, 9.3; RPG5).
- ORV: membership as a rights bundle (gold unlocks listings, platinum a meeting right); mortal sponsor keeps two functions; station king and representative (ORV F5, EF3, EF8, EF9).
- LOTM: civil staff versus formal member versus captain; contract, pay, secrecy (LOTM F7, F8, F17, EF1, X2).
- RI: purple thorn token, sect rank, clan seat (RI F3, F8).
- SS: citizenship with tracking and Gate duty; knight without oath (SS F3, EF4).
- HP: house membership, prefect, Head of House gatekeeping (HP F6, F7, F9).
- MOL: certification, badge and licence are three separate things (MOL F4).
- COI: civil staff protection for survivors (COI F6).

| Field | Entry |
|---|---|
| Verb | Hold a status; its rights and duties arrive as one record; duties come due; attempts and revocation follow stated causes (GTR13). |
| Row shape | `{id, holder kind, rights:[gate ids or capability grants], duties:[{trigger, check, penalty}], pay or fee, attempts:{max, onFail}, closes:{reason}, leave:{terms}}`. Dials: who sets the bundle (a notice, a world rule, a notarized contract). |
| Owning seam | Rights: `progression_gates.js` `defineGate` kind credential or social with `closes` revocable (exists, untracked). Duties: `obligations_ledger.js` kind duty (exists, unwired). Titles live in `state.simulation.titles` (`simulation_contracts.js`). Missing: the bundle record, attempt counter, duty trigger and leave terms. |
| Owning seam | Rights: `progression_gates.js` `defineGate` kind credential or social with `closes` revocable (exists, untracked). Duties: `obligations_ledger.js` kind duty (household/economy consumers exist, not a general duty trigger). Titles live in `state.simulation.titles` (`simulation_contracts.js`). Missing: the bundle record, attempt counter, duty trigger and leave terms. |
| Procedural | Duty missions drawn from a table: `status/{statusId}/duty:{n}`, world clock, small budget (at most a few per cycle), reader = the duty command. Authored when the world names the duty. |
| Save | Optional slice via `domain_registry.js` or actor facts; plain JSON; additive. |
| Away time | A duty that falls due while away becomes a deferred obligation with an `eases` window; it does not auto-fail. Revocation needs a stated cause and shows a log line on return. |
| UI | Status panel: rights, duties with next due, attempts left, how it can end. Only reasons the character can know (GTR10). |
| Smallest slice and test | LOTM Q3/Q4: civil staff (weekly pay, secrecy duty) versus formal member. Test: a bundle with right, duty and three attempts; failing the third converts the status once; reload equals before. |
| Unlocks | Q3, Q4; later RI sect rank, Paradise tier, HP houses, ORV membership. |

### C3 Term contract: offer, answer window, scope, duration, exit, penalty

**Members**
- LOTM: civil staff offer with an answer window, five-year term, lifetime secrecy, address revealed after consent; one-week hire of a clerk (LOTM F7, F8, EF1).
- ORV: stream contract (split, down payment, exclusivity, breach destroys both); co-sponsor contract (ten uses a day, five years, no renewal); mortal sponsor contract blocks others; Temporary Pledge with nine clauses (ORV section 3, 4, EF5).
- RP: Witch Guild contract owes a contract and a door only; notarized contracts and tablets; employee leave terms with two readings kept (RP F25, section 12; RPD 1).
- RI: patron staffing a client, vouching into a caravan (RI section 3, F9).
- SS: clan patronage, adoption, marriage (SS F4, EF9).
- MOL: tenancy, mentor assignment by quota, courier errands for a priest tutor (MOL section 3).
- COI: outside patron limits what a member may sell (COI F7, E7).
- HP: guardian permission form (HP E5).

| Field | Entry |
|---|---|
| Verb | Offer, accept or decline, perform, breach or exit. Quote the terms, then revalidate at commit (AR7). |
| Row shape | `{id, parties as roles, scope, duration + clock, exit terms, penalty, hidden clauses (knowledge-gated), renewal, exclusivity, notary}`. Dials: split ratios, down payment, window length. |
| Owning seam | Exists: `simulation_contracts.js` claims and relationships, jobs with costs and cancellation, `agreed_duty_*` receipts (one feature), `obligations_ledger.js` for performance debt, `check_contract.js` for breach resolution. Missing: a generic contract record with exit, penalty and an offer-expiry clock. |
| Procedural | Offer terms (split, down payment) drawn per offer: `contract/{offerer}/{subject}/seq:{n}` on the world clock; a bargaining check can move them (ORV shows 7:3, then 8:2, then 10:0 as a negotiation). Budget one offer per meeting. Fallback authored. |
| Save | Contract rows additive; accepted terms frozen (GR3). |
| Away time | An unanswered offer expires on the world clock with a log line; a running term accrues duty and pay and is summarized on return. |
| UI | A contract sheet before accept with total cost. Fine print appears only if the character could know it (AD6); the sheet says terms may be incomplete when they are. |
| Smallest slice and test | Q3 civil-staff contract. Test: an offer with a three-day answer window expires while the player is away; accepting after expiry fails with the reason; reload mid-term keeps the accrued pay. |
| Unlocks | Q3; ORV streamer start; RI caravan and patron starts; MOL tenancy. |

### C4 Priced offer with a hidden cost or an outcome distribution

**Members**
- LOTM: a one-penny wish machine, first use free, twisted wishes, third worst; judged above a grade-2 item (LOTM F22, EF9).
- ORV: sponsor coins that carry speed, attack or defense penalties; a 3,500 C deduction hidden in fine print; bundled purchases that make a total look like an item price (ORV section 4, 7, F4, EF6, C1).
- RP: Skill Upgrade Hall sells a risky trial with a reward distribution; Abyss Shop repeat price and refresh reset; Honor Shop mention penalty (RP F6, F8, F4).
- RI: recipe lots skip appraisal to avoid leaking; frenzied bidding about twice market (RI section 2, 4).
- SS: stimulant trades a week of lucidity for an equal crash (SS section 6).

| Field | Entry |
|---|---|
| Verb | Quote visible terms, commit, resolve a weighted outcome, reveal; repeat rules modify the next quote. |
| Row shape | `{id, visible lines, hidden lines (gated by knowledge), outcome table with integer weights and reasons, repeat modifier, refresh reset, first-use rule}`. |
| Owning seam | `check_contract.js` and `check_resolver.js` for draws; `native_trade_transaction.js` for the quote fingerprint; `action_legibility.js` for what the character has actually been told. Missing: a weighted outcome catalog with "why this?" reasons (GR9) and hidden-line disclosure tied to knowledge. |
| Procedural | `offer/{offerId}/use:{k}`, scoped to world and life, clock = world clock; table `id@rev` layered by world overlay (GR8); budget one draw per use; reader = the use command; the revealed result is frozen (GR3). |
| Save | Use counter as a resource; result row frozen. Additive. |
| Away time | None passively. An offer on a channel can lapse when its operator is not broadcasting (ORV EF1). |
| UI | Quote shows the total the character can know; a "terms not fully known" marker only when the character could suspect it (GTR10). |
| Smallest slice and test | One sealed-item-adjacent twisted offer (wish machine). Test: seed sweep keeps outcomes inside the table and the top contributor is reportable; reload gives the same next outcome. |
| Unlocks | LOTM sealed-item slice (Q4 neighbor); ORV Bag and sponsors; Paradise pod and Abyss Shop. |

### C5 Escrow broker trade and barter

**Members**
- LOTM: broker holds money and item until the buyer verifies; informant share; market band plus rarity premium; flat church offer; sale agent commission with a price floor; equal-value barter (LOTM F10, F11, F13, F14, F15, EF4, EF5; queue Q5).
- RP: team-promotion scroll haggled from a 4,000,000 ask to a 1,000,000 deposit card; trade market stalls; Eighth-tier consignment with a notarization fee (RP section 4; RPD 9.3). The Honor Shop is the opposite case: bound, no exchange (RP F4).
- ORV: General Exchange with sales history; Temporary Pledge swap checked by a lie-detecting skill (ORV section 3).
- MOL: a teleport broker for a foreign fare (MOL F2).
- COI: gold per question to an intermediary (COI F9).
- RI: no escrow found where searched (RI section 2 "not found"); pawn and loans are C16.

| Field | Entry |
|---|---|
| Verb | Stage a trade into a held record, verify, then release or return both sides. |
| Row shape | `{broker role, hold rule, verify method, broker cut as percent plus floor, barter equal-value test, reputation stake, hold expiry, failure outcomes}`. Dials: premium size, verification method. |
| Owning seam | Exists: `native_trade_transaction.js` (quote, revalidation), `simulation_contracts.js` `custody` op and cost, and one bespoke pattern in `audit_remainder_offers_content.js` (a client price held in a `supply_escrow` resource). Missing: a shared two-sided held-lot record with a verify step and expiry. |
| Procedural | Counterparty offers: `broker/{city}/{day}/offer:{n}` with a price band layered by region and rarity (GR8) and an integer premium weight; verification outcome (genuine or forged): `broker/{offerId}/verify`. Clock = world clock. Budget at most six offers a day and one verify draw per held lot. Reader = the buy and verify commands. Frozen on reveal. |
| Save | Held lots as custody rows plus a receipt; additive. |
| Away time | A hold persists; an unverified hold returns to both sides at expiry (proposed default, dial per world). |
| UI | A "broker holds" panel with money and item lines and a verify action. |
| Smallest slice and test | Q5: one trade completes, one fails verification, both leave records. Test: a forged lot fails verify and each party is made whole; reload in the middle of a hold reconstructs it with no duplicated item. |
| Unlocks | Q5; RP trade market; ORV exchange. |

### C6 Auction: open outcry versus sealed bid

**Members**
- RI: Shang auction is open outcry with base bid, steps that shrink with price, silent numbered private rooms, secret lot order leaked to allies, bluff bidding permitted; the Jia trade house uses sealed bids (RI F1, F2, C8).
- RP: auction hosts, ticket fee, seller commission (via HUB_LIFE in RP section 4); Eighth-tier consignment fee (RPD 9.3).
- ORV: auction house with a 500,000 C opening, no self-bid, no refund on sold lots, dokkaebi loans (ORV section 3).
- LOTM: the edition has no auction term; trades are boards, private rooms and brokered sales (LOTM section 7). Do not carry an auction to LOTM.

| Field | Entry |
|---|---|
| Verb | List a lot, run a bidding session, settle. |
| Row shape | `{house, mode open or sealed, base rule, step table by price band, rooms, fee or commission or deposit (RI: not found, leave unset), lot categories, self-bid rule, refund rule, leak policy}`. |
| Owning seam | Missing. Grep finds no auction code in `src`. Settlement can reuse `native_trade_transaction.js` and custody; `market_saturation.js` is a resource trickle, not bidding. |
| Procedural | Heaviest generator in the map. Lot list `auction/{house}/session:{i}/lots`; rival ceilings `auction/{house}/session:{i}/lot:{n}/bidder:{k}` (integer weights with contributors); price band from a layered table (GR8); bluff premium draw. Clock = world clock session index. Budget: at most 30 lots, 12 bidders per lot, about 400 draws per session, cost class medium. Reader = the bid command and the leak. Freeze the lot list once shown, and each result once settled (GR3). |
| Save | Session record frozen on reveal; player bids are commands; additive. |
| Away time | Sessions at fixed intervals resolve; an unseen session regenerates from its address; standing ceilings the player set earlier settle in a summary (proposal). |
| UI | Lot list and a bid console; a quiet-room bid is announced by number. |
| Smallest slice and test | One session, five lots, three rivals, open outcry. Test: sold price at or above base, steps match the table, same seed gives the same sale, reload after bid 3 continues identically. |
| Unlocks | RI auction slice; ORV auction; RP hub auction. Not in the LOTM queue. |

### C7 Venue with an access right, stock and refresh (shops, tokens, markets, memberships)

**Members**
- ORV: the Bag exists only while the dokkaebi's channel is open; five free searches a day then 100 C; gold and platinum memberships (ORV EF1, EF2, EF3, section 3).
- RP: Honor Shop (five rules, bound goods, stock refreshes on return, level gates summoning, banked refresh); Abyss Shop (credit-hidden stock); Title Shop and Forging Disc; Test Hall hourly modes; Statistics Hall flat fee; rights fog; Flat-Rate Sale Authority (RP F1, F3, F4, F7, F8, F13; RPD 2, 9.4).
- RI: tribal market zoned by strength, purple thorn token for rooms and free dissection, rock-gambling den (RI F7, F8).
- HP: Diagon Alley shops, Gringotts vaults, Ministry visitor entrance (HP F2, F4, places).
- SS: Sanctuary park market, a Memory shop living on one sale a month (SS F8, F9).
- MOL: magic shop with legal rods, rural board paying in goods (MOL section 2). LOTM: Psychology Alchemists stock (LOTM F6, F13).

| Field | Entry |
|---|---|
| Verb | Enter if the access gate holds, browse stock, buy or use. |
| Row shape | `{venue, operator and its availability, access gate (defineGate), fee, hours or channel clock, stock table by tag query, refresh rule (interval, banking, reset), binding on goods, repeat price rule, fog rule}`. |
| Owning seam | Exists: `trade.js`, `trader_templates` (tested), `market_saturation.js`, vendor factions in `economy_standing.js`, `progression_gates.js` for access, `panel_reveal.js` and `reveal_chain.js` for fog. Missing: operator-state availability, a bound-goods flag on item instances, banked refresh attempts. |
| Procedural | Stock draw `venue/{id}/refresh:{i}/slot:{k}` by tag query (GR7) layered core, world, region (GR8) with integer weights and contributors (GR9); the venue's own clock (channel) or the world clock (GR17); budget per refresh; stock seen persists until the next refresh (GR3). Reader = the buy command. |
| Save | Stock snapshot plus refresh index and banked count; bound flag on the item instance (needs the items owner, flag as additive). |
| Away time | Refresh counters advance and banked attempts accrue to the dial's cap; nothing is bought for the player. |
| UI | Shop panel; fog rows show a sign without contents until the right exists. |
| Smallest slice and test | One gated shop with refresh and one bound item. Test: banked refreshes across a reload give the same next stock; a bound item cannot be sold. |
| Unlocks | ORV Bag; Paradise Honor Shop; RI market; HP Diagon Alley. |

### C8 Jurisdiction, region and territory effects

**Members**
- LOTM: Tingen split by faith (Nighthawks north and west, Mandated Punishers at the docks, Machinery team at the university area); worship first, territory second, then up to the royal family (LOTM F1, F2, EF2; queue Q2).
- COI: only two churches may preach in the republic; Bureau 8 versus Hivemind versus Inquisition; first-round force rule (COI F1, F2, F3, F11, E1, E2).
- MOL: police and Guild overlap bridged by favors; rural versus Cyoria rules (MOL F5, F7).
- HP: underage-magic detection by the Trace, Statute of Secrecy, Ministry departments (HP F12, F13, F16, E1, E2).
- RP: no fighting in the hub outside the arena; derived-world institutions tagged LOCAL, PARADISE-PROVIDED or PARADISE-RESTRICTED (RP section 7; RPD 3, 8).
- ORV: station kingdoms held by a flag on a timer; a king needs reputation as well (ORV EF8, EF9).
- RI: clan city free for trade with managed edges; sanctuary-style holds (RI C2, section 2). SS: Gate duty and tracking (SS EF4).

| Field | Entry |
|---|---|
| Verb | Act in a region; the region says who has authority, who responds and what the act costs. |
| Row shape | `{region, authority claims:[{holder, basis faith/territory/flag/license, strength}], escalation, act-cost modifiers by tag, secrecy rule, detection method, response table}`. |
| Owning seam | Exists: `region_view.js` (travel list only), `simulation_contracts.js` sites, location ids (`LOTM_LOCATIONS`), `FACTION_BY_REGION` in `economy_standing.js`, `rules.js` facts. Missing: an authority resolver (SR1-SR24 exist as rules text only). |
| Procedural | Responder choice when an act is detected: `region/{id}/day:{d}/response:{n}`, world clock, weights with contributors, budget at most five per day; no generator for static districts. |
| Save | Region id is already location state; response events as log rows. Additive. |
| Away time | Patrols and responses are summarized; a region's authority does not change while away without an event with a reason. |
| UI | The places list gains an "answers to" line and the act-cost change shown in the log (Q2 done check). |
| Smallest slice and test | Q2: two districts. Test: walking between them changes the supervisor and the shown cost. |
| Unlocks | Q2, Q4; COI first-round rows; HP Ministry detection. |

### C9 Clearance grade, group rule, sealed-item custody, oath-bound secrecy

**Members**
- LOTM: grade 2 needs bishop or team-captain clearance; grade 3 needs a group of three or more and formal-member clearance; a cathedral holds a few; secrecy agreements; an oath that binds the oath-taker's mind and cannot be perceived [S] (LOTM F3, F4, F20, EF6, EF7).
- COI: four grades 3 to 0, smaller is more dangerous; churches share serials; mystical items fuse a characteristic with strong negative effects (COI F17, E4).
- MOL: a door or badge keyed to the owner's mana; licence separate from skill (MOL section 9).
- HP: wand recorded at the Ministry desk; Gringotts vault key plus escort (HP F4, E3).
- RP: revealing Paradise or the Honor Shop is punished; a Hunter alias is undetectable to Void factions (RP section 7, F15).
- SS: Memories transfer only in person (SS EF7).

| Field | Entry |
|---|---|
| Verb | Request, handle or store a graded item; custody changes need the right clearance and, for some grades, a group present. |
| Row shape | `{grade, required clearance as role or count or group, custody location, holders, handling effects, breach consequence}`. Grade tables are per world; LOTM and COI grades are not merged by number. |
| Owning seam | `progression_gates.js` (credential plus social kind), `simulation_contracts.js` custody, command `coLocated` and `participants`. Missing: a group-presence leaf ("n participants hold clearance X") and a grade registry. |
| Procedural | Only the item's negative side effect row, drawn once per item address `sealed/{itemAddr}` and frozen; budget tiny; reader = the handling command. |
| Save | Custody rows exist; clearance as a status (C2). |
| Away time | Sealed items stay put; no invented drift. |
| UI | A handling prompt names the clearance and group if the character knows them; otherwise a vague line (GTR10). |
| Smallest slice and test | Q4. Test: one actor cannot move a grade-3 item; three present with clearance can; reload keeps custody. |
| Unlocks | Q4; COI sealed items; MOL keyed doors. |

### C10 Cause-keyed loss of control and backlash

**Members**
- LOTM: promotion needs three years plus an exam because many lose control each year; masks reshape personality; a corrupted bishop; stated causes (skip a sequence, wrong-pathway potion, switching, rushed residue) are in the queue note (LOTM F18, F21, F23; QUEUE "account for now").
- COI: Demons above Sequence 6 lose control on a cadence; a daily body reset keeps only characteristic changes (COI F16, F19).
- SS: the Flaw is a compulsion, silence builds pain; stimulant crash (SS section 6).
- ORV: overwrite beyond mastery loses part of the Story [S]; probability storm erases a defiant dokkaebi (ORV section 7).
- MOL: soul ritual potions wreck normal function for a time; half the reserve to hold a shield (MOL section 6).
- RI: Gu backlash was not read (RI section 6 "Not read").

| Field | Entry |
|---|---|
| Verb | A cause adds pressure; a stage reads pressure and may trigger a loss event; rest, ritual or support lowers it. |
| Row shape | `{cause id, pressure delta, who can know it, stage effects (signs), trigger table, recovery routes, irreversible flag}`. Default: every trigger traces to a stated cause; no cause, no pressure. |
| Owning seam | Missing as a mechanism. Today: strings in LOTM files and the path `failure` text. Nearest shapes: `vow_rules.js` scar pressure, `breakthrough_trial` (cited there), `check_contract.js`. |
| Owning seam | Partial: `LOTM_LOSS_CAUSES` and derived block facts gate accept/ingest/assessment, and `loc.switching` qualifies a multi-pathway record. No inspected producer triggers that flag through play, pressure stages or recovery. Nearest shapes: `vow_rules.js` scar pressure, `breakthrough_trial` (cited there), `check_contract.js`. |
| Procedural | Trigger check per stage: `loss/{lifeId}/{pathId}/stage:{s}/check:{n}`, world clock, weights show the top cause contributors (GR9); budget one per stage per day; reader = the stage command. |
| Save | Pressure as an actor resource; cause log as facts. Additive. |
| Away time | Pressure eases on rest at a dial rate; no passive trigger without a recorded cause. |
| UI | Signs in words (felt state), no numbers (GTR15). |
| Smallest slice and test | A "wrong-pathway potion" cause row for the existing Seer and Corpse Collector ladders. Test: each listed cause adds pressure; an ordinary day adds none. |
| Unlocks | Completes Q1 honestly; precondition for Q6; COI Demon rows; ORV Story limit. |
| Smallest slice and test | Cause rows now exist for both ladders, with focused test definitions. A later selected pressure mechanism would need a cause-to-consequence journey and recovery proof; do not reopen row creation as absent. |
| Unlocks | Supports Q6 cause coverage; broader backlash and other-world consumers remain proposed, not a new completion gate for Q1. |

### C11 Information as a priced good: appraisal, rumor, perishable knowledge, private venues

**Members**
- RI: a tip sold for 400,000; intelligence arm secret by policy, leaks lot order; forecast broker near the banned betting line; shop spree known in three days (RI F5, F7, section 4).
- ORV: metered search; foreknowledge is dated, partial and re-priced; leaks cost probability [S]; rumors spread regardless of truth (ORV EF2, EF11, section 5).
- LOTM: coin divination as a yes/no test; the hidden club trades by rite and info among members is reportedly free (R) (LOTM F24, F26).
- COI: gathering reached by incantation, two-hour cap, leave by changing the closing line, members sell texts or information (COI F7, F15, E7).
- SS: government pays contribution points for information; the library keeps in-person access to avoid a trail (SS F5).
- MOL: gossip misleads as often as it helps; offers carry the giver's incentive (MOL section 4, F10).
- HP: owl post, Daily Prophet for a coin (HP F5). RP: guide tablet notarized by Paradise (RP section 2).

| Field | Entry |
|---|---|
| Verb | Buy, sell, verify or leak a claim; what the buyer learns is a knowledge write separate from the world truth (GR5). |
| Row shape | `{good id, truth ref (sealed owner), seller story, price band, verify method, shelf life, leak consequence, venue rules (cap, entry)}`. |
| Owning seam | Exists: `people_knowledge.js`, `world_knowledge.js`, `action_legibility.js`, the `knowledge` op with stage and basis in `simulation_contracts.js`, and `economy_standing.js` price memory and rumour draw/view. Missing: priced claim with verification, perishable knowledge, gathering venue. |
| Procedural | Rumor spread `rumor/{factId}/day:{d}`; claim quality (true, half-true, false) frozen at sale with the truth held separately; text rendered from fact ids (GR15). World clock; budget at most a few rumors per day; reader = the verify and sell commands. |
| Save | Knowledge rows with basis; truth stays in the sealed owner; additive. |
| Away time | Rumors diffuse on the world clock; a bought tip loses value on its shelf life. |
| UI | A claims ledger: source, confidence label, age. |
| Smallest slice and test | A verify step inside Q5. Test: a half-truth tip is sold; verifying reveals the part that was false; the projection never contains the sealed truth (AR8). |
| Unlocks | Q5; RI; ORV; COI gatherings. |

### C12 Fraud, abuse and counter-patterns

**Members**
- RP: purchased judicial post that becomes a recurring tribute trap; paid councillors and a staged hearing; a fake first guide; asylum referral lowers credit (RP F18, F19, F28, section 2).
- RI: auction bluff bidding; banned betting house; rival steward slander (RI F1, section 2, 3).
- ORV: hostile sponsor coins, hidden deduction, a custom-only rule used to refuse service (ORV F3, F4, EF4).
- LOTM: forged or unverifiable formulas, a characteristic returned through an intermediary to avoid suspicion (LOTM F12, F13).
- MOL: a detective tutors to offload a quota case (MOL F10). COI: a children informant net (COI F10).

| Field | Entry |
|---|---|
| Verb | A pattern pairs an incentive or deception with a detection route and a consequence. |
| Row shape | `{pattern id, kind forgery/bait/hidden clause/bribe/impersonation/front, tells, detection checks, victim loss, aftermath}`; NPCs use the same patterns (GTR20, GR13). |
| Owning seam | `check_contract.js` (detection), `people_knowledge.js` (tells), `economy_standing.js` (standing hit), `obligations_ledger.js`. Missing: the pattern catalog. |
| Procedural | Scam offers `fraud/{venue}/day:{d}/offer:{n}`; the hidden truth (forged or genuine) is a truth write, the tells are knowledge writes (GR5); budget small; frozen on reveal. |
| Save | Hidden truth row in the sealed owner; additive. |
| Away time | NPC schemes resolve in a summary. |
| UI | Tells appear in appraisal text only when known. |
| Smallest slice and test | A forged formula in Q5. Test: forged and genuine lots are indistinguishable without the verify step and distinguishable with it. |
| Unlocks | Q5; Paradise hub guide; RI auction bluff. |

### C13 Sanction, hearing and aftermath

**Members**
- LOTM: local team seals the matter first, headquarters audits later; witnesses sign secrecy; a record trail (LOTM F12, F27, EF11).
- RI: clan justice by elder discretion; jail by default; penalty softened by usefulness; exile for the betting house (RI F3, section 7).
- RP: Arbitration Hall verdict takes effect after five days; killing a senior local official ends local standing; an Execution Department needs two signatures (RPD 3 V24; RP F23).
- HP: charge text, accused may bring witnesses, verdict by a show of hands, Azkaban for Unforgivables, expulsion as the school's top penalty (HP F12-F17).
- COI: destruction as the official answer when outsiders cannot solve a case (COI F22). ORV: Bureau three-step punishment, probability debt, injury fee in coins (ORV EF7). MOL: letters to parents, expulsion (MOL section 7).

| Field | Entry |
|---|---|
| Verb | Report, investigate, hear, sanction, record. |
| Row shape | `{offence, detector, forum, steps with delays, defence rights, penalty ladder with a discretion dial, softening factors, record effects}`. |
| Owning seam | Missing as a shared procedure. Pieces: `economy_standing.js` deeds, `obligations_ledger.js`, command effects, queued outcomes (CBR) for delays. |
| Procedural | Verdict draw weighted by evidence and usefulness with reasons: `case/{caseId}/verdict`, world clock, one draw per case, frozen. |
| Save | Case row; additive. |
| Away time | Hearings proceed on the world clock; a five-day delay can land while away and shows on return. |
| UI | Summons card and a case ledger. |
| Smallest slice and test | The secrecy-signature cleanup after a breach (LOTM F12) as a two-step case. Test: a case opened at day 0 with a delay of five days settles once at day 5 whether the player is present or away. |
| Unlocks | Q2/Q4 follow-ups; RP derived worlds; HP hearing; RI clan sanction. |

### C14 Benefit economy by tier (converted currencies, quotas, overflow)

**Members**
- RP: Honor Medals convert to Temporal Power at 1 to 10 because the shop is a Hunter authority; shop level and refresh; potion quotas with no compensation for overflow; Tier 5 free stalls and room expansion; a faction keeps its own points (RP F12, F13, F22, F24; RPD 2, 9.4, 9.7).
- ORV: coins buy stats, shop items, memberships, penalties; coins become probability (ORV section 5, EF10).
- RI: stipend ladder 3 to 100 stones a week (reused from earlier notes, RI section 3); token benefits.
- LOTM: weekly pay 2 pounds 10 soli plus an allowance, 4.5 for a formal member (LOTM F17).
- SS: three stores of value that do not freely convert; stipend in shards (SS EF6, section 4). MOL: points on a job board (MOL F3). HP: Ministry fines and wages (HP F2).

| Field | Entry |
|---|---|
| Verb | Earn in a local unit, convert at a rate that depends on status, spend in gated venues, handle overflow. |
| Row shape | `{currency, issuer, converts:[{to, rate or market, authority}], overflow policy lost/banked/converted/spill/pressure, cap, refresh}`. A rate may be unknown or market-set (SS C1). |
| Owning seam | `economy_domain.js`, `economy_standing.js`, `trade.js` money; overflow policies already exist in `progression_gates.js` (`OVERFLOW_POLICIES`); `carry_ledger.js` for cross-life carry. Missing: a conversion registry conditioned on status. |
| Procedural | None beyond venue stock (C7). |
| Save | Wallets as resources per currency; additive. |
| Away time | Quotas refresh per cycle on the world clock; overflow follows the row (GTR16). |
| UI | Wallet strip showing currencies the character knows. |
| Smallest slice and test | LOTM weekly pay with a salary-advance deduction (C16). Test: conversion at the status rate versus the ordinary rate; overflow banked or lost exactly as declared. |
| Unlocks | Q3; Paradise benefits; ORV memberships. |

### C15 Derived-world institution as a pack module

**Members**
- RP derived worlds: Arbitration Hall and Execution Department; Judgment Hall, posts for sale, Underground Market, housing market, warehouses and arrays; Healing Institute shop, Academic Faction, Repair Hall, Treatment Academy; World Passage board, Dead Ash market, Hunter's Guild board; Flat-Rate Sale Authority; Peak Communication Platform; GCD rank points and shop; Witch Guild (RPD 3, 9.1, 9.2).
- Teaching institutes: Dragon Academy, Academy Tower, asylum referrals, Blind Eye Study Tower (RPD 9.5).
- The same record fits LOTM church teams (LOTM F1-F6), SS Academy, Army and Sanctuary (SS section 2), MOL Academy, Guild and police (MOL section 2), HP Ministry departments and St Mungo's (HP places), COI Bureau 8 and Hivemind (COI F2).

| Field | Entry |
|---|---|
| Verb | Instantiate an institution from a template; its fields feed the other classes. |
| Row shape | RPD section 8: `{purpose, who staffs, fee, access gate, penalty, bribe path, origin tag LOCAL/PARADISE-PROVIDED/PARADISE-RESTRICTED, change for a Hunter}`. Add a `forum` link (C13) and `venue` link (C7) so the record is a composition, not a new rule system. |
| Owning seam | Exists: `world_pack.js` lint, `world_pack_registry.js` `packNative`, the MOL pack as the installed-definition pattern. Missing: an institution record kind in pack lint and the WA14 carry edge for restricted rows. |
| Procedural | Staff and clients through `world_pack_population.js` (stream keys exist); budget declared by the pack (WA16). |
| Save | Pack revision and fingerprint pin (WA10, WA21); institution state is the state of its parts. |
| Away time | Hours follow the world's clock; nothing special. |
| UI | An institution row in the places list. |
| Smallest slice and test | One institution record (Arbitration Hall) with three consumers: forum (C13), bribe path (C12), status effect (C2). Test: the record round-trips as plain data and hashes stably. |
| Unlocks | Paradise derived worlds; reuse for LOTM church teams. |

### C16 Credit, standing, debt and favors

**Members**
- RI: vouching into a caravan is a favor the sponsor sells later; informal stone lenders; pawned Gu; elder status as collateral (RI F9, F10).
- RP: credit rating lowered by investing in an asylum referral; Void Tree credit hides stock; purchased post owes tribute; the 4,000 PC exemption leaf (RP F8, F18, F28, F10).
- ORV: probability debt for a punished dokkaebi; monthly patronage (ORV section 4, 5).
- LOTM: salary advance repaid, a formula advanced against future contribution, a company share left in custody, informant share (LOTM F6, F11, F17, F25).
- SS: poverty priced in years of savings (SS F11). COI: outside patron duty (COI F7).

| Field | Entry |
|---|---|
| Verb | Owe, lend, vouch, call in; standing shifts by deeds. |
| Row shape | The existing obligation row (`kind coin/favor/grievance/duty`, debtor, creditor, amount, why, source, since, eases, carries) plus standing tiers and loan terms from `economy_standing.js`. Proposed kinds: `vouch` and `sponsor`. |
| Owning seam | `obligations_ledger.js` and `economy_standing.js` with its domain (all untracked). Missing: persistence verification, vouching, credit as a venue gate fact. |
| Owning seam | `obligations_ledger.js` and `economy_standing.js` with trade-host binding and registered save/load domain. Persistence not exercised by R2; vouching and credit as a venue gate remain proposals. |
| Procedural | None required; interest is not stated in RI, so leave unset (WA8). |
| Save | Standing schema exists with validate and migrate; verify wiring before relying on it. |
| Away time | `eases` per season; a favor due while away becomes an overdue row, not a loss. |
| UI | A ledger tab. |
| Smallest slice and test | Q3: pay a salary advance back over weeks. Test: weekly deduction, reload mid-repayment. |
| Unlocks | Q3; RI caravan; Paradise credit gating. |

### C17 Clocks: loop carry, trial and scenario timers, cadences, away time

**Members**
- MOL: month restart at 2 past midnight on festival night; knowledge and skill carry, money refills; first-day storm; the repo's visitor keeps a frozen clock (MOL F6, K13, C6).
- COI: daily reset to a 6 a.m. baseline; Circle Inhabitant nine uses per charge, 3 to 9 resets, cooldown; gathering two-hour cap; watch drift and a phantom bell (COI F15, F16, F19).
- ORV: scenario timers with a death clause, 5-minute white flag, 10- and 12-day station goals, search quota, channel open hours, sponsor selection countdown (ORV section 6).
- RP: ring with a 134 hour limit, 3-natural-day survival test, shop refresh every 10 natural days, promotion attempt counter (RPD 1, 9.3; RP F13, F14).
- SS: induction cadence monthly then weekly near the solstice; Dream Realm clock; stimulant week (SS section 5).
- LOTM: three-year promotion wait; night-door custom (LOTM F18, F19). RI: auction intervals, exam cadence 3/8/15, a 13-day market run (RI section 5). HP: term calendar, OWL weeks (HP F18, F19).

| Field | Entry |
|---|---|
| Verb | Name the clock owner; bank, lease or carry time; resolve a deadline. |
| Row shape | `{clock, owner world/body/space, unit, cycle, deadline consequence, carry set (WA14 edge records), away policy}`. |
| Owning seam | Exists: `simulation_clock.js` (engine timers), `away_ledger.js` `computeAway`, `realm_clock_leases.js`, `realm_boundary_rules.js`, `expansion_engine.js` scenario checkpoint, preview and rewind, `carry_ledger.js` boundaries. Missing: a loop-restart boundary with a carry set, a deadline-with-death clause, a cadence window for exams. |
| Procedural | GR17 applies to every draw: key by the owning clock, never ticks; segmented and catch-up processing keep the same draws. |
| Save | Ledgers additive; MOL's loop only if Weibao selects it (OQ6). |
| Away time | Per AD15-AD17; the row states what continues. |
| UI | A clock strip of clocks the character can read (a drifting watch is a world fact the character may not detect). |
| Smallest slice and test | A cadence window for the Q6 exam. Test: equal draws between one long catch-up and many short steps (GR17). |
| Unlocks | Q6; MOL loop; ORV scenarios; RP rings. |

### C18 Identity, papers, aliases and start profiles

**Members**
- LOTM: papers 8 pounds, clothes about 12, passage 4 pounds a leg, official certificate for an ocean ticket; assets and obligations carry, name papers and cash do not; old ties stay known to the teams (LOTM F16, F25, EF10; queue Q3).
- COI: start inside a loop; first-novel cast as remote patrons (COI F20, F21).
- RP: appearance masking 500 PC; Hunter alias costs permission levels then Soul Coins per use; employee origin routes (RP section 2, F15, section 12).
- ORV: sponsorless streamer start; reader foreknowledge starts (ORV section 8, EF11). SS: outskirts resident, drafted officer, shopkeeper (SS section 7). RI: caravan mortal, tribal trader, sect recruit (RI section 7). MOL: visitor start versus the source's student (MOL section 7). HP: Muggle-raised entrant told by one guide (HP F22).

| Field | Entry |
|---|---|
| Verb | Choose a start package; hold, buy, forge or lose documents; get recognized or not. |
| Row shape | WA13 start `{body, means, debts, access, knowledge, carry edges, documents:[{id, issuer, price, vouchers, who detects}]}`. |
| Owning seam | Exists: `lives_carry_domain.js` and `carry_ledger.js` (boundary rules), the LOTM entry profile constant and `entryProfile` envelope field, `world_pack_registry.js`. Missing: a start-profile registry beyond one constant and a document record. |
| Procedural | None; authored starts. An optional generated background follows GR with a budget. |
| Save | `entryProfile` already sits in the LOTM envelope, so a second profile id is additive. |
| Away time | Not applicable. |
| UI | Start selector (existing for LOTM branch entry; confirm before building). |
| Smallest slice and test | Q3. Test: two profiles enroll, earn, spend and save differently. |
| Unlocks | Q3; ORV, SS, RI, HP starts later. |

### C19 Service and team roles: teaching, healing, staff, party

**Members**
- RP: Test Hall tutor hours with no suspend and no refund; employee guide briefing at 50 PC; Dragon Academy knowledge in kind; asylum scouts paid per referral (RP F3, section 2, 4; RPD 9.5, 9.6).
- MOL: mentor quota, a tutor whose lesson serves his own case, a priest tutor, a job board team of exactly four (MOL section 3, F9, F10).
- SS: survival teacher, combat instructor, handler, cohort roles, rare healers (SS section 3, EF10).
- ORV: helper recruitment with fixed roles; dokkaebi as broker (ORV section 6, 4). HP: prefect, Head of House, St Mungo's wards (HP F6, F7, F9). RI: caravan vice leader, manager recruit with a rank floor, assassin team (RI section 3).

| Field | Entry |
|---|---|
| Verb | Hire or use a role that owes a service and may refuse; lessons produce a lead, an insight or a technique, not a guaranteed skill (ABILITY_AUTHORING: teaching and learned result are separate). |
| Row shape | PIR role row `{role, offers, refuses, price or owes, quality variable, failure effect, how met}`; lesson `{hours, price, teacher quality, output type, refund rule, interruptible}`. |
| Owning seam | PIR and SLR in DOMAIN_RULES; `skill_expansion_*`, `techniques.js`, `technique_content.js` for learned output; command jobs with `duration` and `cancellation` none or forfeit (LOTM `cmd`) for non-suspendable hours; `feature_expansion_society.js` for residents who enter by explicit meeting. Missing: priced lesson with a quality draw and role quotas. |
| Procedural | Lesson outcome `lesson/{teacher}/{student}/slot:{n}` with teacher quality table `id@rev`; world clock; budget one per lesson; frozen. |
| Save | Skill rows exist; lesson receipt additive. |
| Away time | A lesson is a job that completes; a missed slot returns nothing. |
| UI | Role cards with price, owed service and refusal reasons the character can know. |
| Smallest slice and test | A weekly mentor meeting plus one lesson in the MOL floor. Test: a one-hour lesson cannot be paused or refunded and yields the declared output type. |
| Unlocks | MOL floor; RP Test Hall; SS Academy; HP classes. |

Class count: **19**.

## 4. Subtle-integrations matrix

Each row is a pair (or triple) of classes that interact, the failure the pair must avoid, and the governing rule codes. Items marked * are the ten most important for the report.

| Code | Pair | Failure to avoid | Governing codes |
|---|---|---|---|
| I1* | C17 clock x C3 contract | A term, answer window or accrual counted on the wrong clock (a frozen visitor clock versus the world clock), or an offer that expires while the player is away with no log line | GR17, AR12 clocks, AD15-AD17, AR7, GTR11 |
| I2* | C9 custody x C5 escrow | A held item counted in two owners, or lost on reload mid-hold; the buyer's money and the seller's item must be made whole on failure | AR3, AR7, ECR quotes, custody op in `simulation_contracts.js` |
| I3* | C11 knowledge x C5/C12 appraisal | A negative reading taken as proof of safety (the LOTM findings text warns of this); hidden fine print shown to a character who could not know; verify leaking the sealed truth | AD6, AD7, AD8, GR5, AR8, GTR10 |
| I4* | C9 clearance x C8 region | Clearance from one faith or jurisdiction granting access in another; a group count that includes people with no standing | LOTM EF2, EF6, GTR8 |
| I5* | C1 ladder x C10 loss of control | A second or third pathway added as data without its cause rows, bypassing the Seer slice's failure rules; a save validator that forbids a cause instead of modelling its consequence | GTR2, AD38, QUEUE account-for-now, LTS laws |
| I6* | C14 benefit tier x C7 venue x economy | A status-only exchange rate leaking into ordinary prices; overflow lost silently; a Hunter-only rate applied to non-Hunters | GTR16, ECR, AD22, RP F12 |
| I7* | C12 fraud x C13 justice | The victim sanctioned for being defrauded; detection that is omniscient; NPCs exempt from the same patterns | GTR20, GR13, AD6, RP F18-F19 |
| I8* | C2 status x C3 contract | A right granted without its duty; revocation with no stated cause; a duty missed while away converting to a loss | GTR13, GTR4, AD19 (forgiving recovery) |
| I9* | C17 loop carry x C16 debt x C11 knowledge | Debts, favors and foreknowledge crossing a restart or world edge by default, or foreknowledge working everywhere; locals reading a returner as an outlier | WA14, GTR8, carry ledger boundaries, MOL K13 |
| I10* | C18 identity x C9 clearance x C8 region | New papers erasing known ties (LOTM F25 says old ties stay known to the teams); an alias detected by the wrong party | LOTM EF10, WA13, AD6 |
| I11 | C6 auction x C11 leak x C16 credit | A leaked lot order with no consequence, or credit gating stock the character could not know about | RI F1, RP F8 |
| I12 | C7 refresh x C17 away | Regenerating a stock the player already saw; banked refresh growing without a cap | GR3, GR10, GTR16 |
| I13 | C19 lesson x C17 clock x C10 | A non-suspendable lesson interrupted by another job; soul or mind training with no pressure row | AR7 interrupted work, ABILITY_AUTHORING causal contract |
| I14 | C15 institution x C12 bribe x C13 forum | A bribe path that always works; an institution whose forum and fee disagree | RP F19, WPR5 |
| I15 | C8 jurisdiction x C13 sanction | A mixed case with no rule for which forum tries it | LOTM F2, COI F2 |
| I16 | C3 contract x C9 oath | An oath or secrecy clause the player cannot perceive being treated as a visible rule | LOTM EF7, AD6 |
| I17 | C11 information x C14 economy | A visible spending spree not moving price or attention; a tip priced with no seller risk | RI F7, F5; `observePrice` in `economy_standing.js` |
| I18 | C1 ladder x C17 clock | Authored act counts mistaken for the source's digestion rate; away time digesting a potion | LOTM X4, LTS11 |
| I19 | C4 offer x C3 contract | A hidden clause that binds without ever being learnable | ORV F3, F4, AR8 |
| I20 | C2 status x C7 venue | Rights fog showing contents before the right exists, or hiding what was reached | GTR18, RP section 7 |
| I21 | C13 hearing x C17 away | A verdict landing while away with no summary on return | CBR queued outcomes, GTR11 |
| I22 | Generators x save (C4, C6, C7, C11) | A table edit rewriting a seen result or price | GR3, GR10, WA10 |
| I23 | C19 role x C8 region | A mentor or handler present in a region where the character has no standing | PIR, LOTM F1 |
| I24 | C19 teaching x skill rust | Learned output treated as permanent mastery | SLR (DOMAIN_RULES), ABILITY_AUTHORING variants |

## 5. Ranked build order

Respecting the LOTM queue (`docs/gm/dispatch/lotm-lives-regions-2026-10-23/QUEUE.md`). Q1 is done per its checkpoint (uncommitted) and Q2 districts is in flight in the LOTM files in another session; this order starts after them and defers to their ownership. Each step names classes it builds once and later steps reuse. Every step carries the queue gates: ownership check, additive save fields, a focused test file, a played journey at 1920x1080, no commit without Weibao's yes. Rank is a proposal, not a selection.

| Step | Queue slice | Classes built once | Reused later by | Why this position |
|---|---|---|---|---|
| B1 | Q1 second pathway (done per checkpoint, uncommitted) | C1 second consumer | Q6, RI, Paradise | Proved that a second ladder is a descriptor; the commands were still copied by hand |
| B2 | Extraction E1: per-pathway command-set factory (structural move, WA17); the checkpoint names it as the next refactor and the two `request_assessment` commands as the merge point for a data-driven assessor row | C1 | Q6 and any later pathway | Do this before Q6 and coordinate with Q2, which is editing the same LOTM files: the second pathway was copied by hand into actions, state validator and view (PC1); a third copy triples the drift. Prove with the same journey before and after (AR9) |
| B3 | Cause rows for loss of control | C10 | Q6, COI, ORV | The queue says loss of control must stay tied to stated causes; a data row stops a third pathway bypassing it (I5) |
| B4 | Q2 districts | C8 | Q4, Q5, C13 forums, COI | One region owner; jurisdiction split by faith feeds clearance and who responds |
Respect the [LOTM queue](../gm/dispatch/lotm-lives-regions-2026-10-23/QUEUE.md) and current file owners. Its early in-flight wording is dated: Q1/Q2 now have receipts, and B2/B3 have newer source than those receipts. This table is a proposed dependency order, not authorization to repeat completed source work or run an extra wave. Queue gates and current desktop evidence rules remain applicable.
| Step | Queue slice | Classes built once | Reused later by | Why this position |
|---|---|---|---|---|
| B1 | Q1 second pathway (done per checkpoint, uncommitted) | C1 second consumer | Q6, RI, Paradise | Initial Q1 proved a second descriptor; the hand-copied command shape has since been replaced by B2 rows |
| B2 | Extraction E1: pathway factory and assessor rows **source-implemented** | C1 | Q6 and later pathways | `lotmPathwayCommands` and row-driven validator/view inspected; stub-third-pathway test definition exists. Before/after rebuilt browser parity is not established by R2; do not recopy commands |
| B3 | Cause rows and switching-record support **source-implemented, bounded** | C10 | Q6, later COI/ORV | Five cause rows, command gates and `loc.switching` validator support exist; no inspected gameplay producer for a triggered switching consequence or pressure/recovery journey |
| B4 | Q2 districts **wired and receipt-proven** | C8 | Q4, Q5, forums, COI | Q2 records both district journeys and persistence at 1920x1080. Other teams remain attributed records, and off-shift/mid-walk browser gaps stay in its checkpoint |
| B5 | Q3 second life | C18, C3, C16 (advance), C2 (civil staff) | Q4, ORV and RI starts | Start profile, contract and pay are the three things a life needs |
| B6 | Q4 clearance | C9, C2 (formal member), group-presence leaf | RI sect rank, Paradise tier, HP houses | Extraction E2: write the status bundle world-neutral here, because this is its first full consumer; prove the seam with a second world's rows as a fixture (AR11, WA20), not as runtime |
| B7 | Q5 broker trade | C5, C11 verify step, C12 forged lot | RP trade market, ORV exchange | Extraction E3: the held-lot record, a shared form of the bespoke escrow in `audit_remainder_offers_content.js` |
| B8 | Q6 third pathway and senior-deacon exam | C1 (data only), C17 cadence | RI exam cadence, Paradise attempts | Proves that a pathway is a row; the authored Warden Hale becomes a replaceable examiner |
| B9 | After the queue: C13 hearing, then C7 venue, then C14 conversions | C13, C7, C14 | RP, ORV, RI, HP | Hearing follows Q2/Q4; venue and conversions follow the first economy consumers |
| B10 | Later: C6 auction, C15 pack institution record, C4 offers, C19 lessons, C17 loop | each | RI, ORV, RP, MOL | None is in the LOTM queue; each waits for a selected world |

Extraction flags before a third world needs them:
- **C2 status bundle** is already wanted by LOTM (Q3, Q4), RI, RP, ORV, SS and HP passes. Write it world-neutral at B6.
- **C3 contract** and **C16 debt** are wanted by LOTM (Q3), ORV and RI. Write contract with an expiry clock at B5.
- **C17 clock owner** declarations are needed by every timed row; name the owner in each row from B5 on (GR17), even before a shared clock module exists.
- **C7 venue** is wanted by ORV and RP and partly by LOTM stock. Extract at B9, before ORV or RP is selected.
- **C11** claims ledger is wanted by LOTM Q5, RI and ORV; build the verify step at B7 and keep the ledger shape neutral.

AR12 reminder: the shared layer holds the verb, the validator and the row shape; outcomes stay in world data. If a card starts needing per-world branches inside the shared code, that is the signal to split the class (AR11, AR13).

## 6. Contradictions between the passes and the code

| Code | Pass says | Code says | Treatment (no code changed) |
|---|---|---|---|
| PC1 | LOTM queue: loss of control must stay tied to its stated causes, and region and life rows should be data over shared verbs (WPR31) | `book_world_lotm_state.js` rejects a save holding both pathways, which turns a stated cause of loss of control into a wall; actions, state asserts and the path view carry parallel `cc.` copies of the Seer rows | Q1's checkpoint records the refusal as deliberate and engine-tested. Default: keep Hale withholding the second dose as an institutional rule (Q1 does), add cause rows at B3, and replace the validator wall with a consequence row at B2/B3. A change of this kind needs its own lane |
| PC2 | LOTM X3: a senior deacon examines (F9) | The Seer and Corpse Collector `recognition` crossings name Warden Hale | Authored stand-in; keep the label authored and make the examiner a row (C1) |
| PC3 | LOTM X4: digestion is half a year to three years (F18) | 6 acts (Seer) and 4 acts (Corpse Collector) | Authored dial; keep as prototype values, with the source rate as the reference |
| PC4 | LOTM X3 is warden versus deacon; the church wait is three years (F18) | The Q1 checkpoint and a code comment on `LOTM_CC_ACTS` cite "source note X3" for a recruit waiting about a year | Probably a different X3 (the checkpoint cites its own deep-dive note); the LOTM pass shows three years. Check before repeating either number |
| PC1 | Causes should be modelled, not blocked by an unconditional save wall (WPR31, AD38) | Current validator accepts multi-pathway records only with `book.lotm.loc.switching`; actions, asserts and view now read pathway/cause rows | **Earlier finding superseded.** Institutional withholding remains the default. Focused test definitions cover flagged validation; no inspected action produces a triggered loss-of-control consequence. Broader gameplay proof remains open; see R2 history |
| PC2 | LOTM X3: a senior deacon examines (F9) | `LOTM_ASSESSORS` now makes Hale an explicit authored `warden_prescreen` with `sourceKind: senior deacon` | Row extraction exists; source examiner is still a future consumer. Keep authored divergence, no canon promotion claim |
| PC3 | LOTM X4: digestion is half a year to three years (F18) | 6 acts (Seer) and 4 acts (Corpse Collector) | Authored dial; keep as prototype values, with the source rate as the reference |
| PC4 | LOTM pass X3 is the authored warden/deacon distinction; F18/X4 carry waiting/digestion references | `LOTM_CC_ACTS` comment still says about a year, source note X3; Q1 and queue preserve that unresolved locator | Open provenance check. Neither code comment nor this map establishes the correct source wait; keep acts/counts authored until the actual source locator is checked |
| PC5 | GTR9: one evaluator for gates | `ascension_paths.js` evaluates crossings with its own numeric comparison; `progression_gates.js` evaluates gates through `rules.js` | Link crossing to gate (C1 optional `gate` field). Existing crossings stay |
| PC6 | MOL C2, C3: crowns are authored only; the pack values differ from the kit card | `book_mol_pack.js` uses crowns | Keep the label authored; do not claim source support |
| PC7 | SS C1: the kit card said no shard-as-cash conversion, but the source shows market conversion | n/a (documentation) | Conversion rows allow "market, no fixed rate" (C14) |
| PC8 | RP: employee leave has two readings kept (RPD leave terms) | n/a | Leave terms are data; load both candidate rows, mark neither accepted |
| PC9 | ORV C1: the repo reader's 15,000 C contract price is stale (10,000 C list) | n/a | Use 10,000 in any pack row |
| PC10 | LOTM section 7: the edition has no auction term | RI and ORV have auctions | Auction rows are per world; do not add an auction to LOTM |
| PC11 | COI C5: the sequel has no Nighthawks or Mandated Punishers | n/a | Church team rows are per world; shared record, no shared names |

Unverified by this pass: what the Paradise runtime means by `tier` in `book_world_paradise_*.js` (grep shows tier fields in the host, state, carriers and actions files; it was not opened to see whether tier is a bundle or a number).
Paradise clarification (R2): existing host and state owners implement optional campaign entry/return, visits and a finite mission. This invalidates the earlier blanket "whole RP runtime documented only" label. Its tier/status bundle semantics were not audited; RPD/RPG's wider benefits remain proposals.

## 7. Open questions as proposals (defaults, no either/or)

| Code | Question | Proposed default |
|---|---|---|
| OQ1 | Where does the status bundle live? | A world-neutral leaf with an optional registry slice, first consumer LOTM Q4, name not reserved here |
| OQ2 | When is the pathway factory extracted? | After Q1 lands and before Q6, as a structural move with the same journey before and after (AR9) |
| OQ3 | Should a crossing reference a gate? | Yes, as an optional field; existing crossings unchanged |
| OQ4 | How is switching pathways modelled? | Keep Hale's dose withholding for the slice, add a "wrong-pathway potion" cause row at B3, and let a later lane decide the validator change |
| OQ2 | When is the pathway factory extracted? | Local extraction exists in current source. Remaining check is its exact input proof, then reuse for a selected Q6; no new extraction dispatched here |
| OQ3 | Should a crossing reference a gate? | Yes, as an optional field; existing crossings unchanged |
| OQ4 | How is switching pathways modelled? | Current default withholds the other dose; cause rows and flag-qualified validation exist. No inspected gameplay trigger or recovery route; broader consequence design remains proposed |
| OQ5 | What is the held-lot record? | A custody-based record with a pair of holders, verify step and expiry, extending the existing custody op |
| OQ6 | Is a loop-restart boundary added to the carry ledger now? | No. Only if Weibao selects the MOL canon loop (MOL K13 already says opt-in) |
| OQ7 | How are pass findings cited across worlds? | World prefix plus code, as in section 0 |
| OQ8 | When do auctions run? | On world-clock windows with standing ceilings settled in summary; built after Q6 |
| OQ9 | What happens to an offer that expires while away? | It lapses with a log line on return; the player may ask again, possibly at a changed price |
| OQ10 | How are values labelled in rows? | Source, authored or proposed on every number, with the locator for source values (WPR4) |

## 8. More-to-consider round (WPR24)

**ACT NOW (done in this file)**
- Mechanism classes merged by verb and row shape (19), with world-prefixed locators.
- Honesty line from git state; contradictions PC1-PC11 recorded.
- Integration matrix with ten flagged pairs.

**ACCOUNT FOR NOW (constraints on current work)**
1. Q1 is played but uncommitted; the Corpse Collector pathway proves the descriptor, not command-level generality, until B2 shows the factory.
1. Q1/Q2 have owner-reported play proof; B2 now has a local factory and a stub-third-pathway test definition. Generality, exact-input browser parity and normal-app delivery remain distinct.
2. Any LOTM price table needs a band plus a premium, never a single price (LOTM F13-F15); the same applies to RI auction prices that carry U labels.
3. Do not copy RI or ORV price rows into a pack before the locator is opened (WPR19).
4. A new class must name its clock owner on day one (GR17).
5. Search costs and fees marked "not found" stay unset (WA8).

**LATER/DELEGATE**

| Item | Level | Effort | Done check |
|---|---|---|---|
| A1: Pathway factory design note | sonnet | S | A one-page row shape that regenerates today's Seer and Corpse Collector commands identically |
| A1: Pathway factory parity | sonnet | S | Factory and assessor rows exist; close remaining evidence by the owner's bounded before/after journey, not by writing a duplicate design |
| A2: Status bundle row and fixture from two worlds | sonnet | M | A fixture using LOTM Q4 and RP tier rows validates and round-trips as plain data |
| A3: Held-lot record spec | sonnet | S | A stepped test spec for completed and failed trades |
| A4: Generator register (auction, stock, offer, broker, rumor, response, lesson, verdict) with budgets and tests | sonnet | M | Each row has stream key, clock, budget, reader and the three GR16 tests named |
| A5: Verify pass on pass rows that feed first slices (LOTM F10-F17; RP F8, F13) | haiku readers plus sonnet judge | M | Each price or fee locator opened and labelled |
| A6: Audit `book_world_paradise_*` tier handling against RPD 9.3 | haiku | S | A note saying whether tier is a bundle or a number |
| A7: Cross-world fixture for C7 venue (Honor Shop and Bag rows) | sonnet | M | Two venue rows share one validator, refresh and banking behaviour in a test |

Separate short suggestions (not reasons to stop): give every pass a one-line "classes touched" header so this map stays current; add the mechanism class code to each pass's engine-facts table.

## 9. Files that should link to this document

- `docs/WORLD_PASS_RULES.md` (implementation passes WPR30-WPR32, and a lesson that finding codes need a world prefix)
- `docs/RULES_INDEX.md` router row for world absorption and implementation
- `docs/gm/dispatch/lotm-lives-regions-2026-10-23/QUEUE.md` (extraction flags B2, B3, B6, B7)
- `docs/worlds/world-core-kit-2026-10-14/cards/lord-of-mysteries.md` and the other kit cards (class membership)
- Each pass doc's "files needing links" section, starting with the nine listed in section 0.1
- `docs/WORLD_ABSORPTION_RULES.md` (WA1 and WA5 example classes)
- `docs/PROGRESSION_GATE_RULES.md` (C1 crossing-to-gate link, OQ3)
- `docs/worlds/paradise-hub/PROGRESSION_GATES_2026-10-23.md` (C2 status bundle)

## 10. Review state (WPR21)

Highest state reached: drafted. Not rules-reconciled in detail with DOMAIN_RULES (PIR, ECR, SLR, CBR texts were not reopened), not built, not browser-verified, not director-accepted. Source facts come from the pass docs, not the novels; no novel was read. The code survey was read-only and partial: `expansion_engine.js`, `trade.js` and the Paradise runtime were opened only as far as headers, export lists and greps. Nothing was run, built or committed.
Highest map review state remains drafted, with R2 source/status reconciliation. DOMAIN_RULES was not reopened in detail and novels were not read. Later pass coverage is bounded to the sections named in 0.1. Named runtime owners and test definitions were inspected, but R2 ran no gameplay, tests or builds and makes no director-acceptance, package, install or publication claim. The map's proposed shared mechanisms remain distinct from the concrete leaf and consumer implementations in section 1.
