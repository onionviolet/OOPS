# Tools for reconciling OOPS rules with play

Status: proposal, 2026-10-31. This report answers Weibao's request to inspect reconciliation work and recommend what to make. AD32 applies: recommendations here change no accepted direction, active lane ownership or execution budget. No runtime implementation is authorized by this report.

## Evidence and present boundary

Read the current AGENTS, GROUND_RULES, VISION_DIGEST, PROJECT, rule register, reconciliation audit rounds 3–6, refinement implementation tracker, systems audit, L2b checkpoint and the existing rule-behavior/receipt scripts. Source inspection is bounded, not a fresh semantic audit of every rule or a replay of gameplay. The checkout is shared and dirty.

- F1: [Reconciliation rounds 4–6](RULES_RECONCILIATION_AUDIT_2026-10-30.md#round-4-reconciliation-applied-2026-10-31) record citation/parser, owner-link, proposal-source and document-lint fixes. These older defects should not be reopened from earlier rounds without a current reproduction.
- F2: The [implementation tracker](../gm/dispatch/refinement-audits-2026-10-31/IMPLEMENTATION_TRACKER.md) distinguishes delivered opening/interaction work, L2b below-floor health work, and queued knowledge, general UI, access/save, making/progression and interaction work. Its runtime plan stopped at its finite allowance ceiling. This research does not resume it or dispatch workers.
- F3: [check_rule_behavior.mjs](../../scripts/check_rule_behavior.mjs) routes four groups to existing tests and explicitly disclaims whole-rule compliance. Its saves group still describes opaque retired-content retention and cites MR33; compare its selected tests with the current documented override before using that label as a policy summary.
- F4: [check_receipts.mjs](../../scripts/check_receipts.mjs) validates receipt fields and limited combinations. It does not verify that a cited build exists, that evidence inputs remain current, or that an entire journey meets the delivery floor. Valid formatting and actual proof are distinct.
- F5: The [systems audit](../gm/dispatch/refinement-audits-2026-10-31/SYSTEMS_RULES_AUDIT_RECEIPT.md) provides concrete integration counterexamples: observer provenance, publication across fight/native health, permission display versus enforcement, and distinct occurrences collapsed by identical text. These are recorded findings at their stated inputs, not newly reproduced defects in this report.

## Proposed build order

### P1: extend the existing rule-to-evidence map

Start with one connected combat journey, using the current L2b/L2c records. Extend the existing behavior-check route and receipt vocabulary rather than introducing another universal workflow.

Each selected claim needs: rule code and authority/status locator; world and exception scope; state owner, producer and receiving consumer; named scenario; test or browser evidence; input identity; route kind; persistence scope; unresolved gap and reopen trigger. Prefer references into current owners over copied rule text. Let one scenario reference several rules, but state which particular claims it demonstrates.

Report structural validity, focused regression, connected host/browser evidence and delivery separately. Unknown coverage stays unknown. Avoid a global percentage of rules satisfied: a citation, unit test and native journey have different meanings, and a rule can have many clauses.

Acceptance: a valid receipt with a missing artifact is reported unresolved; a fixture never becomes earned-route evidence; changing a relevant input marks only affected claims stale; existing unselected rules gain no invented failure or completion status. A content-row change can reuse unchanged mechanism proof under AD36/AD43.

Suggested executor: Sol medium, bounded tooling work. No agent dispatched. Reopen when the current runtime owner resumes verification or selects evidence tooling; it is not a prerequisite to continuing unrelated gameplay.

### P2: reusable connected scenario fixtures

After the selected lane has authority to resume, preserve useful journeys in the existing test/playtest/MCP routes. Start by finishing the existing L2b browser harness, not writing a competing one. Then cover L3's absent observer/later attributed account and distinct occurrence identity; L5's permission boundary; selected making interruption and failed publication when that consumer is selected.

Each journey traces preview, command revalidation, transaction, visible result and applicable save/reload/export/import. Cover one meaningful rejection or interruption. Keep deterministic fixture controls out of normal saves; report fixture and earned entry independently. Preserve source-specific clocks and lifecycle distinctions rather than installing one universal time/reset law.

Acceptance: the selected journey exercises real host/storage boundaries, preserves prior bytes on rejected publication where applicable, and agrees across authoritative state and observer-safe UI. Existing focused tests stay system-organized. Browser proof uses an isolated rebuilt snapshot, fresh test origin and 1920×1080; no private saves or visible windows.

Suggested executor: substantive integration by the current lane's authorized model/effort, not a new worker assignment. Reopen on explicit resumption within its finite budget.

### P3: add evidence freshness to the receipt tooling

Use existing manifests and bundle hashes. Add an opt-in comparison that reports unchanged, relevant-input-changed, artifact-missing or not-recorded. An installed build is a separate fact from a successful candidate build. Documentation-only changes need not invalidate an unrelated combat journey; source-pack and generator revisions can invalidate a world route even when JavaScript is unchanged.

Acceptance: two disposable manifests demonstrate both relevant drift and unaffected evidence reuse; a nonexistent hash/artifact cannot appear current; no automatic rebuild, install or claim promotion. Keep the implementation tracker authoritative for lane status and render any summary from its references.

Suggested executor: Sol medium, small-to-medium; reopen when repeated manual manifest comparisons justify it. Do not duplicate the existing source crosswalk or coverage ledger.

### P4: a narrow task-context command, then a read-only inspector

Under AD32, first expose a command selecting the applicable existing rule codes, owner links, accepted/proposed distinctions, current lane and relevant evidence for a named system. No semantic truth claims from filename matches. Missing mappings are explicit; a human/agent resolves actual applicability from owners. This is a thin convenience over RULES_INDEX and systems/README, not a second rulebook or mandatory pre-flight.

If repeated tracing still costs time, expose the same selected claim in a development inspector: authoritative owner, observer-admitted explanation, quote/commit result, clock domain and publication receipt. Private developer diagnostics and player-visible explanations have separate projections; sealed truths stay out of chat, shared reports and ordinary UI.

Acceptance: the combat task returns existing owners without treating proposed LSD/PRF/FND rules as binding; a read leaves state unchanged; absent-observer diagnostics do not leak into player text or shared artifacts. The UI follows DESIGN and the current desktop priority.

Suggested executor: Sol medium; reopen on a second demonstrated consumer or recurring trace failure. A generated Markdown/JSON view is the first delivery; a dashboard is optional.

## What to borrow from the linked repositories

| Candidate | Useful mechanism | Disposition for OOPS |
|---|---|---|
| [Matt Pocock domain-modeling](https://github.com/mattpocock/skills/blob/main/skills/engineering/domain-modeling/SKILL.md) | Resolve ambiguous terms with scenarios and source/code checks | Adapt into existing owners when terminology actually disagrees. Do not create a competing glossary or interview for every task. |
| [Impeccable](https://github.com/pbakaus/impeccable) | Targeted UI critique, task-focused app mode and rendered review | Trial after selecting a real UI task. DESIGN, desktop-first scope and world-specific expression remain authority. Generic mobile or aesthetic defaults do not override them. |
| [Graphify](https://github.com/Graphify-Labs/graphify) | Extracted dependency navigation | Optional benchmark on three known producer/consumer questions against current search. Its graph can propose navigation edges, not acceptance authority or proof of behavior. Keep private sources and secrets out of shared outputs. |
| [Diagram Design](https://github.com/cathrynlavery/diagram-design) | Clear shareable system diagrams | Optional for one selected transaction/knowledge flow. Existing Markdown/Mermaid is cheaper for frequently edited maps. |
| [Ponytail](https://github.com/DietrichGebert/ponytail), [Superpowers](https://github.com/obra/superpowers), [Addy's pack](https://github.com/addyosmani/agent-skills) | Simplification and engineering checklists | Reference material. Existing AR/AD36/AD43 and lane practice already cover much of this; broad auto-triggered workflows risk duplicate planning, gates and tests. |

The prior repository review inspected all ten READMEs and selected skill files. No third-party package has been installed or benchmarked locally. Comparative effectiveness remains untested.

## More to consider

ACT NOW (done): inspected current owners and existing tools, distinguished already repaired documentation from pending connected proof, and saved this proposal. Runtime work and stopped lanes were left unchanged.

ACCOUNT FOR NOW: a rule has authority, applicability and evidence, which are separate questions. Evidence has input identity and route scope. New source findings may change a world-specific contract without invalidating the whole shared engine. Incomplete knowledge is not a fictional gameplay lock. Common infrastructure can share transaction/provenance mechanics while world laws remain distinct. Optional human review is not a blocking delivery state.

LATER / DELEGATE: P1–P4 are ranked proposals with acceptance/reopen conditions above. Do not add a universal gate, reopen every legacy document, build an all-repository knowledge graph first, or count tests as whole-game compliance. Prefer one rule-to-play trace made reliable before widening its coverage.

## Verification

Under AD32, this report changes no runtime, accepted rule, lane ownership, save, package or installation. Current structural check results are appended after execution; no gameplay/full-suite outcome is claimed.

Observed before this report was added: `npm run check:rules` PASS, 30 register rows, 46 AD codes, 861 relative links, zero warnings; receipts PASS, 18 checked and 317 explicit legacy paths skipped. `npm run check:docs` FAIL on four lines in other shared-tree documents (economy considerations, USER_VISION, RI institutions and RI cross-game comparison). These were not edited by this task. Results describe the checked snapshot.

Final report verification: `npm run check:docs` PASS after correcting three diagnostic-triggering phrases in this proposal; the four earlier external diagnostics were no longer present in the concurrently edited tree. Five local file targets exist; fragments were not separately checked. Scoped `git diff --check` and report whitespace check PASS. No runtime tests/build, installation, worker dispatch, commit or push.

## Round 2: skill fit, worktree trimming and lifecycle costs

Weibao asked whether a skill is needed, what else to consider and whether worktree trimming helps. These are proposals under AD32. This round performed read-only inventory; it removed no worktree, branch, process or local artifact.

### D1: a short project reconciliation skill with deterministic helpers

A narrow `oops-reconcile` skill would help repeated reconciliation requests. Its trigger is reconciling named rules, audits, lanes or delivery claims in OOPS, not every edit. Keep its instructions to selecting a bounded tranche, resolving authority from existing owners, classifying disagreement, tracing the selected claim through its consumer, checking evidence freshness and updating the existing task record. Link current owners rather than copying rulebooks, dated statuses or model/budget settings into the skill.

Keep worktree retirement as a conditional branch linked to SHARED_WORKTREE_PRACTICE, not part of every gameplay audit. Existing mechanic-absorption, session-handoff and topic-expansion-audit have different jobs; do not route this lightweight reconciliation through a broad research/dispatch/commit cycle. The old audit-reconciliation method contains historical milestone/review wording, so it is evidence of prior practice rather than an executable authority to copy unchanged.

Suggested delivery: first implement one report-only inventory helper and one selected-claim evidence check; wrap the proven path in the short skill after a representative use. Repo-owned shared source can have discovery links for both harnesses, following the existing mechanic-absorption pattern after inspecting its link setup. No new skill, helper, hook or automatic task was installed in this round. Skill-creator guidance was inspected for fit, not executed as a creation request.

### F6: current registered worktree inventory

48 registered worktrees: primary plus 47 secondary. All paths existed and Git status returned successfully. Relative to the sampled primary master tip:

| Secondary group | Count | Apparent directory size | Meaning |
|---|---:|---:|---|
| HEAD reachable from master, tracked/untracked status clean | 17 | 38.22 GiB | Initial retirement candidates, but every one had a visible process cwd and ignored entries. None is cleared for removal. |
| HEAD reachable from master, local changes present | 10 | 17.79 GiB | Inspect and preserve local work/artifacts before classifying retirement. Two had visible cwd users. |
| HEAD not reachable from master | 20 | 42.19 GiB | Preserve. Check semantic/patch equivalence and receiving consumers before deciding whether work is missing or already landed differently. Every one had a visible cwd user. |

These are apparent `du -sk` sizes, not measured reclaimable physical space; APFS sharing, links and retained archives can change actual savings. A clean Git status omits ignored artifacts. The inventory found 81 ignored directory/file entries across the 17 merged-clean worktrees; entries are not file counts. The primary checkout was excluded from cleanup sizing and classification.

A second visible-process scan found commands named claude, disclaimer, zsh, Python and sleep using secondary cwd paths (90 matched processes). A process is a reason to resolve ownership, not proof that useful work is progressing. No process was stopped. The scan does not establish absence of all open files, terminal references, app chat bindings or concurrent owners.

### P5: report-only worktree retirement helper

Extend the existing primary-checkout procedure with a repeatable inventory, not a new cleanup policy. For each worktree report current HEAD/base, reachability, patch-equivalence status when needed, dirty and ignored artifacts, visible process use, owner/task pointer, candidate disposition, archive reference and exact reason to keep or retire. Preserve branches. Recognize detached checkouts and missing registrations separately.

The read-only command should avoid recursively scanning nested worktrees as project source. This round's initial broad file search entered nested .claude/worktrees and returned duplicated historical paths; subsequent inspection used explicit owners and Git worktree inventory. Excluding those trees from selected analysis commands prevents stale rules and duplicate evidence from being mistaken for current owners. Do not blanket-ignore their unique source work from integration review.

A future explicit retirement mode rechecks identity/status/process ownership immediately before mutation, archives unique evidence and local artifacts with a hash manifest and restore instructions, then uses plain git worktree remove within existing authorization. Do not automate force removal, stop somebody else's worker, clear primary or delete branches to make the report green. A changed HEAD or file fingerprint invalidates that candidate's prior approval/preflight.

Acceptance proposal: disposable fixtures distinguish clean merged, dirty merged, unmerged, patch-equivalent, ignored-artifact, process-used and missing-directory cases. Read-only execution leaves Git state unchanged. The execution plan stops on changed candidate identity and preserves recoverable artifacts; partial retirement records completed and untouched paths individually. Suggested executor: Sol medium, bounded helper; no dispatch. Reopen when a cleanup owner is selected.

### More to consider, round 2 dispositions

ACT NOW (done): inventoried Git worktrees, reachability, local status, apparent directory sizes, ignored entries and visible cwd users; saved the categories and proposed skill/helper boundary here. No deletion or runtime work.

ACCOUNT FOR NOW: distinguish integration from retirement. An unmerged HEAD may be patch-equivalent or superseded; ancestry alone does not decide. A merged HEAD can still contain unique uncommitted or ignored work. Archive references used by receipts may need a stable replacement path before retirement. Detached build snapshots and ignored .lane-builds can consume space outside this inventory. Keep dependencies regenerable while preserving evidence/private packs and avoiding symlink-target traversal during archive/removal. A skill should reduce repeated decisions, not create another mandatory review cycle. Existing paused/allowance-limited lanes retain their own resumption conditions.

LATER / DELEGATE: P5 report-only helper, then owner-confirmed retirement of eligible lanes; the 17 merged-clean paths are a first review group, not a removal list. Compare storage before/after actual retirement rather than claiming this inventory freed space. Skill construction follows one proven selected reconciliation path. No broad audit or dashboard is necessary to begin.

### Inventory detail

Paths below are repository-local worktree names where applicable. Status is a snapshot, not deletion authorization. Missing/locked/prunable Git metadata was not observed in this scan.

| Worktree | HEAD reachable from master | Dirty status entries | Visible cwd user | Apparent GiB |
|---|---|---:|---|---:|
| `/private/tmp/claude-501/gate-wire` | yes | 3 | none observed | 1.72 |
| `/private/var/folders/xb/njlqv84d65zbhd229mkw85zh0000gn/T/yairpg-adopt/worktree` | yes | 1 | none observed | 1.72 |
| `/Users/weiwei/.codex/worktrees/q1-lane-build/yet-another-idle-rpg` | yes | 1 | none observed | 1.65 |
| `/Users/weiwei/.codex/worktrees/q2-receipt-lint/yet-another-idle-rpg` | yes | 8 | none observed | 1.65 |
| `/Users/weiwei/.codex/worktrees/q3-doc-lint/yet-another-idle-rpg` | yes | 5 | none observed | 1.65 |
| `/Users/weiwei/.codex/worktrees/q6-description-lint/yet-another-idle-rpg` | yes | 5 | none observed | 1.65 |
| `/Users/weiwei/.codex/worktrees/q7-generator-census/yet-another-idle-rpg` | yes | 1 | none observed | 1.65 |
| `/Users/weiwei/.codex/worktrees/q8-cycle-ledger/yet-another-idle-rpg` | yes | 5 | none observed | 1.65 |
| `bk-benefits-5b89ef` | yes | 0 | yes | 2.19 |
| `bk-coi-8a8143` | yes | 0 | yes | 2.22 |
| `bk-forms-9dc578` | yes | 0 | yes | 2.28 |
| `bk-gaps-c82fdb` | yes | 0 | yes | 2.28 |
| `bk-hp-83e61f` | yes | 3 | yes | 2.22 |
| `bk-land-ecb3eb` | yes | 0 | yes | 2.34 |
| `bk-making-ui-faf1b3` | yes | 0 | yes | 2.20 |
| `bk-mol-ceda03` | yes | 0 | yes | 2.27 |
| `bk-party-ae89b6` | yes | 0 | yes | 2.25 |
| `bk-progression-569618` | yes | 0 | yes | 2.24 |
| `bk-scout-cc90b8` | yes | 0 | yes | 2.18 |
| `bk-seams-5e4ce1` | yes | 0 | yes | 2.18 |
| `bk-ss-6f266e` | yes | 3 | yes | 2.24 |
| `bk-ui-directions-65b80d` | yes | 0 | yes | 2.28 |
| `combat-surface-3901fa` | yes | 0 | yes | 2.34 |
| `great-ritchie-bf0b79` | no | 0 | yes | 2.09 |
| `pathway-card-ladder-051efb` | yes | 0 | yes | 2.26 |
| `rep-abilities-6f77c2` | yes | 0 | yes | 2.23 |
| `rep-body-6297cb` | no | 0 | yes | 2.10 |
| `rep-character-sheet-860fe6` | no | 0 | yes | 2.09 |
| `rep-combat-0445ef` | no | 0 | yes | 2.09 |
| `rep-crafting-c0b04e` | no | 1 | yes | 2.27 |
| `rep-economy-24e336` | no | 0 | yes | 2.09 |
| `rep-family-tree-b87ca8` | no | 0 | yes | 2.09 |
| `rep-first-hour-31ff38` | no | 0 | yes | 2.09 |
| `rep-items-6f02d9` | no | 3 | yes | 2.09 |
| `rep-knowledge-b16f3d` | no | 0 | yes | 2.09 |
| `rep-maps-be2acb` | no | 0 | yes | 2.09 |
| `rep-mixing-6a1576` | no | 3 | yes | 2.09 |
| `rep-organizations-09fe68` | no | 2 | yes | 2.09 |
| `rep-relationship-web-1adecf` | no | 0 | yes | 2.25 |
| `rep-research-e34f54` | no | 4 | yes | 2.09 |
| `rep-rituals-70a5e6` | no | 4 | yes | 2.09 |
| `rep-spacetime-466c46` | no | 0 | yes | 2.09 |
| `rep-talk-d8d734` | no | 3 | yes | 2.09 |
| `rep-time-8afe25` | no | 4 | yes | 2.10 |
| `rep-worlds-173cee` | no | 0 | yes | 2.10 |
| `ui-identity-449fe5` | yes | 0 | yes | 2.27 |
| `ui-integration-8e9e92` | yes | 0 | yes | 2.19 |

Round checks: Git ancestry/status inventory completed for 48 registered paths; ignored/size/cwd scan completed for 47 secondary paths. No full open-file or app-chat ownership check, semantic integration review, artifact archive, gameplay test, worktree removal, commit or push. Document diagnostics are checked separately below.

Round 2 final verification: `npm run check:docs` PASS; scoped `git diff --check` and explicit report whitespace check PASS. Changes remain local and uncommitted.

## Round 3: reusable helpers built and finished Q lanes retired

Weibao authorized helpers and skill creation, testing on current reconciliation, safe finished-worktree trimming and saving/updating the result; he requested reuse across future projects. This round implements the workflow tools, not gameplay or a new product rule (AD32). Existing paused runtime budgets and other chats' ownership remain unchanged.

### Delivered reusable route

`reconcile-project` lives at `/Users/weiwei/.codex/skills/reconcile-project/SKILL.md`. Claude discovers the same source through `/Users/weiwei/.claude/skills/reconcile-project`, a symlink. No project instructions, automatic hooks, recurring jobs or default model policies changed. The skill uses the selected project's authority and task owners rather than OOPS-specific codes, rulebook layouts or delivery requirements.

- `scripts/evidence.py`: explicit claim/authority/route byte snapshots and input/artifact drift checks; missing or changed bytes are reported separately. Snapshot freshness does not prove the claim, complete dependency coverage or backdate historical proof. It refuses root escape and overwriting an existing manifest.
- `scripts/worktrees.py`: metadata-only inventory by default, selected `--target` content fingerprints, visible open-file/process checks and explicit archive-backed retirement. Primary, locked, unmerged, staged, submodule, unsupported nested/special-file and process-used/unknown cases remain protected. Caller names an integration ref, owner-release evidence and regenerable exclusions; branches remain.
- Recovery archives preserve local tracked/untracked/ignored file bytes, symlink targets, modes and deletion markers, and record the exact checkout commit and archive hash. Private recovery material stays outside the public repository. Explicitly excluded node_modules can be regenerated. The command creates no archive when an early guard rejects the candidate.

### Live reconciliation trial

Used L2b's current receipt, three named source/test files and its existing delivery status. All three source hashes match those written in the L2b checkpoint. The new manifest's subsequent check reported unchanged selected inputs and receipt. This establishes selected byte identity, not complete bundle identity, browser correctness or AD43 closure. L2b remains implemented, below floor; no gameplay tests/build/browser or paused lane was resumed.

The original full-content scan was stopped by its exact PID after showing poor scaling across ignored content. The helper now makes broad inventory metadata-only and hashes one selected candidate for retirement. Mac /var-to-/private/var root normalization was corrected after a failing test. Independent review identified staged-only archive loss and an ambiguous recovery HEAD; the helper now rejects staged work and records the exact commit.

### Retirement result

Six Q lanes were terminal in their coordinator record and their source was adopted/refined in primary under PRIMARY_ADOPTION and the October 26 master reconciliation checkpoint. Fresh ancestry checks found their HEADs reachable from current master. Visible open-file/process scans were known and empty for each candidate at retirement; no worker was stopped. Local leftovers were archived and verified before clearing that retired isolated checkout and plain git worktree remove. Current user authorization selected the cleanup; the earlier G1 no-deletion scope did not authorize it by itself.

| Retired lane | Archived local entries | Recovery directory |
|---|---:|---|
| q1-lane-build | 8 | `/Users/weiwei/.codex/research/oops-retirement-2026-10-31/q1-lane-build` |
| q2-receipt-lint | 8 | `/Users/weiwei/.codex/research/oops-retirement-2026-10-31/q2-receipt-lint` |
| q3-doc-lint | 12 | `/Users/weiwei/.codex/research/oops-retirement-2026-10-31/q3-doc-lint` |
| q6-description-lint | 12 | `/Users/weiwei/.codex/research/oops-retirement-2026-10-31/q6-description-lint` |
| q7-generator-census | 8 | `/Users/weiwei/.codex/research/oops-retirement-2026-10-31/q7-generator-census` |
| q8-cycle-ledger | 12 | `/Users/weiwei/.codex/research/oops-retirement-2026-10-31/q8-cycle-ledger` |

Git branches were retained. No primary files/index were restored or cleared. Other active, unmerged or uncertain-owner worktrees stayed. The two old temporary build/adoption checkouts were not assumed owner-released merely because they had no cwd user in the earlier scan. No claim of measured physical disk savings is made. The earlier round's 48-row table remains historical; a fresh inventory is recorded below.

### More to consider, round 3

ACT NOW (done): created and linked the generic skill, implemented two helpers, tested fixtures and current L2b evidence, retired the six finished lanes with verified recovery archives, and updated this owner. No commit/push or normal app change.

ACCOUNT FOR NOW: owner release precedes destructive cleanup; a fingerprint is not a filesystem lock. A new user can race the final process scan, so the helper is for retired lanes, not an automatic background garbage collector. Process visibility can be incomplete; unknown scans retain. Archives contain sensitive local material. Patch-equivalence remains a separate review when ancestry is unmerged. Detached snapshots, nested repositories and staged state need explicit handling rather than forced cleanup. A broad metadata inventory does not have a retirement fingerprint; use --target. Optional comparison roots permit explicit relocated evidence checks, while omission of a dependency remains a coverage limitation.

LATER / DELEGATE: use the skill on the next named project reconciliation; extend it for an actual repeated failure rather than copying OOPS rules into every project. Future improvements can include structured import of existing manifests and a project-specific context map, with a real second consumer before adding a dashboard. No workers or cleanup loop are dispatched by this proposal (AD32).

### Checks

Three fixture tests pass, covering evidence drift/missing artifacts/root escape; dirty merged retirement and archive recovery including ignored evidence and symlinks; branch retention; changed-plan, active-process, staged, primary and unmerged guards. The bundled quick_validate.py passes via an isolated uv/PyYAML runtime. No project dependency was added. Independent forward-test results and final document checks follow below.

Final live inventory: 42 registered worktrees, primary plus 41 secondary; 21 secondary HEADs reachable from master and 20 outside its ancestry. Independent forward-test passed in an isolated generic project with native lsof checks, full archive recovery and primary/staged-only/unmerged rejection. Six archive hashes and absent retired paths were rechecked. Selected evidence and after-inventory JSON are retained under `/Users/weiwei/.codex/research/oops-retirement-2026-10-31/`. Final `check:docs` flagged one concurrent UI_FEEDBACK_AUDIT_RECEIPT line outside this task; this report and cleanup notes had no diagnostics. No runtime verification, app change, commit or push.

Final structural validation: `npm run check:rules` PASS (30 register rows, 46 AD codes, 866 links, zero warnings; 18 receipts checked). Skill validation PASS. Scoped whitespace checks PASS on this report, shared worktree practice and the Q dispatch cleanup note.

## Round 4: audit rounds, guides and incorporation options

Weibao asked to look across rounds/audits, reconciliation options, guide material and incorporating features from the original list, with more to consider. This pass maps existing work; it does not adopt proposals, change the coordinator's queue, install third-party packages or resume stopped lanes (AD32). “Guide” is treated as navigation and explanation; guild/institution gameplay is also routed below in case that was intended.

### Scope and coverage

The [audit/review census](reconciliation-tooling-2026-10-31/audit-review-census.json) indexes 191 non-private Markdown files under docs/audits and docs/reviews at their recorded hashes, with 68 numeric-round heading locators. This is not a semantic read of all 191 documents. Parts, lettered passes and rounds outside those directories are not included in that heading count. Dispatches, research and world palettes are a larger population; the selected routes below were section-read separately rather than falsely added to a whole-project denominator.

Section-read or sampled: WRITEUP_REGISTER states/intake/routing/register/decisions/adoption, IDEA_INDEX front-door routes, systems/README cross-cutting/system routes, OWNER_DOCS_AUDIT, LEAD_LIFE_GUIDE opening/coverage/drift/procedure, IPC round headings and queue/adoption findings, Q18 and nested triage scope/ranked examples, supersession method and status helper, current refinement tracker, current UI receipt round headings and round 14, engine planning brief and dependency-map headings, similar-games absorption classifications/picks, gameplay-loops catalogue, cross-novel scout examples and institution representations. Earlier rounds in this report retain their own inspection limits.

### New findings

| Code | Evidence | Implication |
|---|---|---|
| F7 | Existing [plan-group checker](tools/plan_review_status.py) successfully rechecked its historical 778-record inventory: 70 section-reviewed, 708 indexed-only, 519 ungrouped indexed-only, 23 unchanged controls eligible to skip duplicate execution review. The [JSON snapshot](reconciliation-tooling-2026-10-31/plan-routing-snapshot.json) preserves each group's actual drift state. | Use this existing skip/reopen mechanism. These are its inventory's coverage labels, not 778 current tasks or a count of missing gameplay. SG09 still needs successor mapping; changed owner/evidence calls for relationship review before rereading descendants. |
| F8 | [WRITEUP_REGISTER](../gm/WRITEUP_REGISTER.md) still describes PROJECT as the place acceptance must be recorded and retains older launch/default-seat questions, while current AGENTS/PROJECT route accepted direction through user words and owning rulebooks/AD lines. Its October 27 adjustable adoption has a dated scope. | A focused register pass should reconcile those rows against actual later owners. Do not ask old questions again, blanket-adopt new October 31 rows under the old adoption, or infer all rows remain unread. This report does not silently rewrite their substantive statuses. |
| F9 | [Lead-life guide](../LEAD_LIFE_GUIDE.md) explicitly covers LSD1–LSD256 while its design source reaches LSD470. It is a reading aid and already warns that planning outruns consumers. Its latest procedure links additional source/engine/UI requirements. | Keep the declared guide boundary. A selected later LSD row needs a supplement or direct source pointer, not an invented claim that the whole design was explained. Add explanations only when they help an active task or answer a real reading question. |
| F10 | [Engine map](../gm/dispatch/refinement-audits-2026-10-31/ENGINE_UI_DEPENDENCY_MAP.md) explicitly covers MC1–MC134; the [UI receipt](../gm/dispatch/refinement-audits-2026-10-31/UI_FEEDBACK_AUDIT_RECEIPT.md) now reaches MC173. Round 14 already distinguishes identified, UI-specified, engine-connected and journey-verified. | Reconcile MC135–MC173 by existing family and exception. Some rows refine workflow/knowledge boundaries rather than add a screen or mechanism. Preserve MC1–MC134's original scope; do not rebuild it from scratch or count 39 newer codes as 39 unimplemented features. |
| F11 | [Nested triage](IDEAS_NESTED_TRIAGE_2026-10-26.md) already closes a routing exclusion in Q18 without claiming implementation. [Systems front door](../systems/README.md) already joins rules, representation, code map, palette and inspector. | Avoid another universal idea ledger, glossary or one-new-file-per-system effort. Follow original IDs into current owners and keep distinct consequences visible when several ideas fold together. A blank inspector cell is not proof of absent gameplay. |
| F12 | OOPS already has [workbench freshness](../../prototypes/workbench/freshness.mjs): source/output identity and sketch/native-shell/archived fidelity are independent. Its two focused tests passed in this pass. | The new generic evidence helper is a portable fallback, not a replacement for this stronger project-specific UI meaning. Future adapters should read the incumbent manifest and fidelity rather than create a second freshness verdict. |

### Five reconciliation options

| Code | Option and existing home | Bounded result | Cost and tradeoff |
|---|---|---|---|
| O4 | Guide/register refresh: WRITEUP_REGISTER + systems front door + lead-life guide | Reconcile the selected high-use rows with current authority/trackers, replace obsolete open-question routing, and name each guide's covered/unread range. Keep old execution history. | Small-to-medium judgment/document pass; improves the next handoff, but does not fix runtime. Recommended first navigation action. |
| O5 | Delta crosswalk: existing ENGINE_UI_DEPENDENCY_MAP and current world plans | Account for MC135–MC173 once, classified as existing family refinement, new consumer, source gap, UI gap, workflow constraint or duplicate. Each consequential row names its actual owner and next check. | Medium synthesis; avoid reopening stable MC1–MC134 rows unless their inputs changed. Recommended next traceability action. |
| O6 | Connected-proof reconciliation: existing IMPLEMENTATION_TRACKER L2b onward | Finish the currently selected below-floor slice at its promised scope, then follow the coordinator's existing order; attach relevant newer audit counterexamples without turning all proposals into gates. | Runtime/browser/persistence work under that lane's authorization and allowance. Largest immediate effect on play; this report does not resume it. |
| O7 | Historical-family reconciliation: SUPERSESSION_GROUPS, Q18 and nested triage | On a selected family, resolve changed owner/evidence relationships and SG09 successors, retain unique ideas and retire duplicate execution instructions. | Potentially large if indiscriminate. Bound by one selected system/world; grouping establishes routing, not source or gameplay review. |
| O8 | Feature absorption: similar-games plan, world palettes and mechanic-absorption route | Pick a sourced, fitting mechanism, compare the incumbent, connect one actual useful consumer and verify its journey. Keep the complete feature family visible beyond that slice. | Medium-to-large depending on source and engine gaps. Cheap wiring can precede new infrastructure, but “not found in a search” is not absence proof. |

Recommended shape: O4 makes the current work readable; O5 closes the newer mapping residue; O6 remains the route to finishing the already selected runtime work. O7 runs when a family is selected, and O8 supplies a concrete consumer when that family needs depth. This is a proposal, not a replacement queue. The rejected default is a fresh all-doc rewrite/full audit before any further gameplay, because it rereads unchanged history and delays usable results.

### Which guides to use for which question

| Question | Existing guide/owner | Boundary |
|---|---|---|
| What is the game currently trying to achieve? | PROJECT + VISION_DIGEST; USER_VISION for exact requests | Summary is not an independent source of direction. |
| Which rule applies and is it standing? | RULES_INDEX and the linked rulebook | Registered proposal remains a proposal. |
| Where does a mechanic plug in? | systems/README → one of the three code-map guides | Static mapping does not prove a current consumer or delivery. |
| How does a book become a playable life? | LEAD_LIFE_GUIDE field/system matrix, joins and section 10; current world plan | Declared source horizon, LSD scope and world exceptions stay visible. |
| What happened to an audit idea? | IDEA_INDEX → Q18/nested triage/writeup row → original owner | Routing coverage is not implementation. |
| What should the next runtime owner do? | Current refinement tracker and its exact checkpoint | Old launch prompts and report recommendations do not displace it. |
| What can be skipped or reopened? | Supersession groups/status helper; original input manifests; workbench freshness for UI studies | No blanket exemption for an entire folder or changed owner. |
| What is worth borrowing from another game? | Similar-games absorption plan and gameplay-loop catalogue, then world-specific research/palette | Source, shape, implemented adaptation and verified play are separate. |

A compact task view can link these existing answers. It should show only the selected system's chain, not duplicate the content into another “master guide.” For a user-facing guide, explain the player's actual goal, available actions, means, costs, feedback and return, with known blockers from live projections. Developer terms, source coverage counters and undiscovered facts stay outside it.

### Incorporating useful features from the original ten skill repositories

These adaptations use the earlier repository inspection in this chat, not a new version audit or demonstrated local benefit. No package was installed here.

| Repository | Feature worth considering | Concrete OOPS destination and acceptance |
|---|---|---|
| Matt Pocock skills | Resolve terminology with scenarios, code checks and selective decisions | Use the existing owner to distinguish possession/control, knowledge/access, skill/grant and fixture/earned route. A selected ambiguous term resolves without changing world-specific meaning. No mandatory interview or competing glossary. |
| Impeccable | Targeted critique and rendered UI review with task-focused app mode | Trial one coordinator-selected screen against DESIGN at 1920×1080 and 14/21 px. Compare real task success and retained behavior, not preference for a generic style; mobile remains deferred. |
| Graphify | Dependency navigation | Trial three known producer/consumer questions against rg + existing code maps. Measure correct edges and missed dynamic registrations, time and maintenance. Graph edges do not establish authority, secrets disclosure or transaction correctness. |
| Diagram Design | Clear transaction/knowledge flow diagrams | One selected source → owner → command → publication → observer diagram in an existing guide. Preserve editable Mermaid for frequently changing flows; verify arrows against code. |
| Ponytail | Reuse/simplification review | Apply to one selected seam after its actual consumer is understood. Judge fewer duplicate authorities and retained behavior; shorter code alone does not justify removing creative depth or world exceptions. |
| Superpowers | Clear execution packets and useful verification discipline | Borrow a missing packet element into the existing lane record when demonstrated. Do not install a second automatic planning/approval/TDD/dispatch lifecycle. |
| Addy's agent-skills | Focused API/interface/review checklists | Use a selected shared-seam review as reference; retain AR/AD36/AD43 authority and current test commands. No automatic commit-per-task behavior. |
| Taste-skill | Distinct visual directions plus screenshot comparison | Reserve for a selected redesign study; compare disposable variants in the existing workbench. A full art-direction cycle is expensive for routine UI corrections. |
| Hallmark | Before/after preservation of links, fields and handlers | Useful candidate for a bounded behavior-preservation check around one redesign. Prefer existing keyboard/return/focus tests where available; DOM inventory alone cannot prove real event/transaction wiring. Alternative to a full design pack, not another layer to stack. |
| Anatomy | Interactive spatial/system illustrations | Park until a selected mechanism genuinely needs spatial explanation, such as a supported process layout. Pretty SVG geometry cannot create a spatial gameplay consumer or prove source fidelity. |

First adaptation choices: task-specific terminology checks and a rendered critique of one real screen. The useful tooling addition after that is an adapter into incumbent evidence manifests/fidelity, if repeated selected tasks need it. Graph navigation is an experiment, not the foundation for reconciliation.

### Gameplay-feature incorporation, including guilds/institutions

The similar-games list already classifies covered, deepen, new and poor-fit mechanisms. Promising examples to reconcile, not automatic builds: ingredient quality reaching an actual brewing hazard reader (PC63); study queue/absorption with the existing learning/time owners (SLC110); an arrangement-backed return line that reads actual pay/dues; and a condition record with a demonstrated second-world reader. The plan's dated “lane running” and “not blocked” wording needs current ownership checks before selection. Covered property-based substitution and retained discoveries should be reused rather than implemented again.

If “guild” was intended: use ORGANIZATIONS and ECONOMY_AND_INSTITUTIONS round 3. A useful slice is role/membership → actual entitlement or duty → real access/payment/work consumer → suspension/leaving consequences, with retained competence distinguished from permission. Guild, school, sect, church and employer can share accounting/provenance without becoming one universal rank ladder. Existing MoL access-display/enforcement mismatch is a concrete comparison, not proof that all guild functions are absent. New membership simulation or roster depth is not required to repair that one contract.

World-loop choices stay in their own source owners: LOTM investigation/preparation/aftermath, HP taught practice with a useful result, RI upkeep/combination/economy, MoL retained knowledge with source-specific reset rules. The original games offer shapes, not new laws for the book worlds. Readiness for source qualification differs from readiness for runtime.

### More to consider, round 4 dispositions

ACT NOW (done): saved the bounded census and live historical-group drift snapshot, section-read the key guide/round families, ran the existing group checker and two workbench freshness tests, identified concrete reconciliation choices, and registered this report. No new gameplay, package installation, cleanup, worker dispatch, commit or push.

ACCOUNT FOR NOW: preserve original idea IDs and source consequences when deduplicating. Distinguish content drift from owner/authority drift and evidence freshness from UI fidelity. A changed guide should not invalidate unchanged runtime proof; a changed source pack can invalidate a route despite unchanged JavaScript. World/source/life stage, observer and run-mode are part of applicability. Aggregate counts/search/badges can disclose facts that the detail view correctly hides (MC170); partial irreversible work may settle across several owners (MC171); replay restrictions must not become fictional world laws (MC172). These are selected-task counterexamples, not new universal runtime gates.

LATER / DELEGATE: O4 small-to-medium Sol-medium synthesis, done when selected current rows resolve to live owners with obsolete asks retired at source; O5 medium Sol-medium synthesis, done when MC135–MC173 have explicit retained IDs/dispositions and consequential consumers/gaps; O6 uses the current coordinator's authorized route and effort with its existing floor; O7 one selected family, bounded extraction then judgment on conflicts; O8 selected sourced consumer through mechanic-absorption. Reopen O4/O5 when their owner is assigned, O7 when a changed group affects selected work, O8 when the coordinator selects that mechanism. No agent is dispatched by this report.

Checks and limits: plan_review_status.py --check PASS (routing drift reported, not resolved); node --test prototypes/workbench/freshness.test.mjs PASS 2/2. Audit/review inventory is filename/hash/round-locator coverage; selected sections are identified above. No comprehensive semantic audit, all-source reading, new current-shell trial, runtime test suite or gameplay completion is claimed. Document/link checks follow below.

Round 4 final checks: `check:rules` PASS (30 register rows, 46 AD codes, 866 relative links, zero warnings; 18 receipts checked). `check:docs` still flags the concurrent UI feedback receipt line 1113, outside this task; zero diagnostics in this report/register addition. All 15 report-relative file targets exist; fragments not separately validated. Both JSON artifacts parse; scoped diff/explicit prose whitespace checks PASS. No runtime, source acquisition, package install, worker dispatch, worktree mutation, commit or push.


## Round 5: O4/O5 applied and skill lessons retained

Weibao authorized O4 guide/register reconciliation, O5 MC135–MC173 mapping, reusable skill improvements and preservation of other chats’ work. AD32/AD36/AD44 and the existing owners govern this documentation pass; no new product direction or runtime gate was introduced.

### Applied corrections

| Code | Before | Applied result and boundary |
|---|---|---|
| O4A | Register treated PROJECT as acceptance owner, described every row as October 27 material and conflated registration/commit state | Register now routes user direction to USER_VISION and owning rulebooks/AD lines, PROJECT to focus, scopes the dated adoption and keeps commit state separate. Original adopted direction was preserved. |
| O4B | Five old questions still implied a fresh launch vote, a global first engine task, one clock choice and a beside-seat default | Replaced with current dispositions and owner pointers. Later owners establish launched lead work, the lead main line and LOTM opening date. HP/WER unresolved particulars and tuning remain local questions when a selected task actually needs them. No invented answers or fresh dispatch. |
| O4C | Lead/canon/reader register rows carried obsolete launch/read-count assumptions | Refreshed those selected rows using current reading, guide and runtime owners. Old exact hunks retained in the [O4 history](reconciliation-tooling-2026-10-31/o4-superseded-register.json); unrefreshed rows remain dated snapshots, not silently certified current. |
| O4D | Guide scope and front-door “none” cells could be mistaken for full design coverage or absent mechanics | Lead guide explicitly retains LSD1–LSD256 coverage with later LSD source routing; both guides point to current tracker and incremental map. Missing documentation/inspector mapping is not absence of gameplay. |
| O5A | Engine map’s declared original scope ended at MC134 | Added an [incremental supplement](../gm/dispatch/refinement-audits-2026-10-31/ENGINE_UI_DEPENDENCY_MAP.md#incremental-supplement-mc135mc173), 39 original codes with family, classification, chain, owner/qualification, next distinguishing check. Original map and other chats’ existing additions preserved. |
| O5B | New workflow, dispatch, source and UI rows could be treated as a single feature backlog | Historical dispatches, standing-contract routing, readiness corrections, feature refinements, source-dependent proposals and cross-screen constraints are distinct. No new engine family was needed for this mapping scope; no source-dependent feature was declared implemented. |
| SK1 | Generic skill lacked explicit guide/delta-map and native-tool reuse guidance | Added concise reusable guidance in reconcile-project: project-native tools first, guide versus authority versus queue, dated-adoption scope, preserve IDs/consequences and map selected delta with explicit residue. The same source is linked for Claude; no OOPS paths/codes/queue or budgets were copied into it. |

### More to consider, round 5

ACT NOW (done): applied O4/O5, retained exact superseded hunks and [machine-readable delta rows](reconciliation-tooling-2026-10-31/mc135-173-crosswalk.json), updated register/pass log and reusable skill. No runtime, source reading/acquisition, worktree cleanup, external message, commit or push.

ACCOUNT FOR NOW: MC174 onward is outside this named tranche if new rounds arrive; source-hash drift is reported rather than silently inherited. A mapped code can contain several practical consequences, so the row preserves its exception and original source locator. Workflow rows add no fictitious command and research reports grant no canonical law. An earlier guide horizon can remain intentionally partial; extending it requires the actual selected material. Coverage labels do not replace state-owner evidence or a current test. Local guide improvements do not reset another lane’s execution allowance or reopen its files.

LATER / DELEGATE: reconcile the next explicitly selected situation window into the incumbent world plan, using the existing field/system matrix and the mapped owner/gap. Reopen a delta map when a new selected code or changed owner affects it, rather than a broad all-round reread. The runtime coordinator retains L2b and subsequent delivery choices. Judgment-capable synthesis, bounded to the selected residue; done check is original IDs with no silently dropped consequences and actual consumer/proof or named gap. No task was dispatched here.

### Verification scope

Document validation checks code coverage, family references, source identity, local links/anchors and preserved original hunks; skill validation checks discovery/schema. These do not validate source canon, runtime, browser, persistence or installation. Final command results follow below. Two concurrent document-lint diagnostics outside the task’s paths were observed during checking and left to their owners.


Round 5 additional consideration: an append after MC173 can change the receipt’s whole-file hash without changing this tranche. Check selected clauses and relevant owner dependencies before reopening all 39 rows; retain the original source revision and record the reviewed delta rather than relabel an old review current. Added this incremental-evidence distinction to the reusable skill. A later new family remains possible if a real selected consumer needs it; this pass’s “no new family required” is a mapping result, not a design prohibition (AD32/AD36).

Round 5 final validation: original MC1–MC134 table still has its 134 ordered unique rows; supplement has exactly the 39 ordered unique codes MC135–MC173. JSON rows match the rendered table, family references resolve, and the source receipt matches its recorded hash at check time. Local target/fragment scan of five touched Markdown owners checked 594 links with zero issues using the project checker’s slug convention; this is no live renderer/click proof. `npm run check:rules` PASS (30 register rows, 46 AD codes, 873 relative links, zero warnings; 18 receipts checked). Skill validator PASS. Scoped diff/whitespace checks PASS. `check:docs` still reports the two concurrent diagnostics in LOTM_SITUATION_UI_COVERAGE and DOWNLOAD_SCOUT_NEXT, outside this task; no diagnostics in this pass’s edits. Current change remains local/uncommitted, and other chats’ source changes and original MC mapping were preserved.


## Round 6: L2b evidence freshness reconciliation, 2026-11-01

Scope: this reconcile-project invocation selects the existing L2b health delivery claim, not runtime resumption, a new audit family or worktree retirement. AD32/AD36/AD43 apply. The [implementation tracker](../gm/dispatch/refinement-audits-2026-10-31/IMPLEMENTATION_TRACKER.md) retains coordination and runtime ownership; the [L2b receipt](../gm/dispatch/refinement-audits-2026-10-31/L2B_COMBAT_HEALTH_RECEIPT.md) retains the exact continuation route and compatibility question. O4/O5 remain completed at their recorded documentation scope.

| ID | Classification | Current evidence and consequence |
|---|---|---|
| F1 | Compatible historical evidence; limited input drift | Recompared all 1,815 paths in `l2b-evidence/inputs.sha256` against this checkout: zero missing, two changed (`scripts/check_doc_slips.mjs`, `scripts/check_rules_index.mjs`). Manifest SHA-256 remains `13a7f0752a2b5597e71a2948bde05a41eb77c427d6ef323eb4576dbc9b09dfe2`. The listed runtime/test inputs match. This is selected-byte freshness, not a new build or proof that unlisted dependencies match. The prior all-input match remains a historical statement at coordinator integration. |
| F2 | Missing proof, not missing implementation | Source still stages player health/stamina through `plan.native` in `tempo_fight.js`; `ui/combat_situation.js` still rounds the displayed HP upward. The receipt records the native storage/publication boundary and focused rejection fixture. The 39-test result and isolated bundle are historical evidence on the receipt's inputs, not a newly executed test or current combined-app journey. No browser report was obtained by that lane. |
| F3 | Explicit compatibility gap and retained ownership | Already-saved discrepant in-progress fights, full-host rejected writes, damage/healing display agreement, Save/reload/Export/literal Import and L2a interaction regression remain unverified. Tracker and receipt agree on **implemented, below floor**. Resume through that coordinator's finite allowance and current-input rebuild procedure; this documentation request does not extend the stopped runtime allowance or start L2c. |

Checks: Python SHA-256 comparison of the existing 1,815-row manifest completed; relevant source projections and tracker/receipt status inspected. No runtime tests, build, browser, persistence, installation, commit or push performed. This round refreshes only the selected L2b claim; other lanes, later MC coverage and historical reports retain their own scopes. Local link/whitespace validation is recorded after checking below.

Round 6 validation: both local Markdown file targets resolve; appended-section trailing-whitespace check PASS. No rule/index changes, so no rules or runtime suite was run. Local/uncommitted documentation only.


## Round 7: broader gap reconciliation, 2026-11-01

Weibao: "Continue with the all reconciliation gap, keeping other chats’ work intact." This round accounts for all named reconciliation options in this report, refreshes the native routing inventory, adds the newer MC delta and resolves the selected documentation gaps. It does not claim every historical proposal has been source-reviewed or implemented. AD32/AD36/AD41/AD43 apply. Existing runtime and LOTM source/mapper/coverage/checkpoint writers retain their files. Rejected defaults: a fresh universal audit ledger or competing readers/runtime slice; use existing owners and their explicit remaining work.

### Applied corrections

| ID | Prior gap | Result and distinguishing boundary |
|---|---|---|
| F1 | The MC crosswalk ended at MC173 while later coverage, dispatch and return-flow records existed | [MC174–MC179 supplement](reconciliation-tooling-2026-10-31/mc174-179-crosswalk.json) retains six original IDs once, actual owner locators, source/checkpoint hashes and next checks. MC179's two sections are one identity with distinct body/learning, companion, observer, duty and durable-return consequences retained. Original MC1–MC173 mapping is untouched. |
| F2 | Interim source receipt wording could be mistaken for latest qualification status | The [whole-life checkpoint](../gm/dispatch/lotm-whole-life-2026-11-01/CHECKPOINT.md) now records PARTIAL, stopped at its observed 75% ceiling. It records 39 individually qualified source/actor/UI proposals, strict opening 39, engine-connected 0 and journey-verified 0 for this run. The historical 337 opening candidates are not 337 qualified scenes. Counts are a checkpoint snapshot, not new source review by this reconciliation. |
| F3 | SG09 had no individual navigation successor pointers | [48 exact original locators](reconciliation-tooling-2026-10-31/sg09-successor-navigation-2026-11-01.json) now route to 15 retained checkpoint owners. [Native ledger](../reviews/plan-rule-reconciliation-2026-10-18/SUPERSESSION_GROUPS.md#sg09-navigation-reconciliation-2026-11-01) explains the boundary: navigation supplied; unique-content/semantic supersession remains unqualified. Catalog timestamps, hashes and skip flags were preserved. |
| F4 | Saves route text could present optional opaque-retention tests as mandatory old-state policy | `scripts/check_rule_behavior.mjs` now labels those tests as the existing mechanism and explicitly qualifies AR6/MR33 by the October 17/18 decisions. No test selection, save behavior or policy changed. The existing three tests pass through the actual optional route. |

### Complete disposition of the named options

| Original ID | Present reconciliation result | Remaining owner or reopen condition |
|---|---|---|
| P1 | Selected health trace recorded below; no new universal evidence schema or compliance percentage | Actual host/browser evidence remains L2b's missing proof. Extend native receipts only when that consumer is resumed. |
| P2 | Existing L2b harness is the reusable scenario; no duplicate created | L2b coordinator owns its interrupted full-host route; L3/L5/L6 own later scenarios. |
| P3 | Generic skill evidence helper and native manifests already provide selected-byte comparison; no second project freshness engine required | Native workbench fidelity remains authoritative for UI studies. Unrecorded dependencies and missing artifacts cannot become current evidence. |
| P4 | RULES_INDEX, systems front door and current trackers remain task-context routes | A new command/inspector remains optional, reopened by a recurring tracing failure or second concrete consumer; not a reconciliation blocker. |
| P5 | Worktree helper already exists; prior six-lane retirement receipt remains historical | Further retirement needs exact owner release, process/artifact checks and action authorization. No new deletion, process stop or archive mutation in this round. |
| O4 | Selected guide/register corrections remain at round 5's scope | Later LOTM qualification counts belong to the live checkpoint; no rewrite of its receiver-owned coverage or mapper. |
| O5 | MC135–MC173 remains its pinned tranche; MC174–MC179 now has an incremental supplement | Whole-file source hash drift from appends does not certify or invalidate every earlier clause. Original receipt/review identity is retained; future changed relevant blocks need comparison. MC180 onward, if appended later, is outside this round. |
| O6 | L2b remains implemented, below floor; L2a/L1 evidence belongs to their earlier bundles | Existing implementation tracker owns runtime sequencing and its stopped finite allowance. The later 75% source/planning allowance does not renew the distinct stopped runtime allocation. L2c/L3–L7 remain queued, not newly failed or dispatched. |
| O7 | Nine native supersession groups rechecked; SG09 navigation supplied; Q18 and nested triage retain their existing coverage | [Routing snapshot](reconciliation-tooling-2026-10-31/routing-2026-11-01.json) retains changed owner/evidence relations and four changed member locators. 519 frozen ungrouped paths remain indexed-only; semantic/source/content review is not closed by routing. Reopen the relevant selected relationships/consumers. |
| O8 | Similar-games and cross-novel research remain source-qualified proposals in their owning palettes | No mechanism is selected by this reconciliation; the incumbent consumer/build order and source-specific fit govern absorption. No acquisition or new source reading performed. |

Q18's nested exclusion was already closed as routing by [nested triage](IDEAS_NESTED_TRIAGE_2026-10-26.md), including retained original identities and limits. This round does not invent another nested backlog, silently reset its source hash or equate an inventory assertion with tested gameplay. The 778-record historical plan inventory has 70 section-reviewed and 708 indexed-only records; nine groups contain 189 controls, with 23 unchanged controls eligible to skip duplicate execution review. Those labels retain their exact native meaning.

### Selected producer/state/consumer trace

The unchanged selected L2b runtime inputs still expose this chain: `tempo_fight.js:stagePlayerVitals` stages player HP/stamina offsets after moves/settlement; `expansion_persistence.js:persistExpansionPlan` writes those into the detached envelope through the storage boundary; `main.js` calls persistence before `publishNativeVitals(plan.native, character)`; `native_gameplay_adapter.js:publishNativeVitals` publishes the native offsets; `ui/combat_situation.js:tempoSituation` supplies rounded visible HP while preserving precise meter values. This is current source inspection of ownership/order, not proof of host error recovery or browser agreement. AD6–AD8/AR3/AR10 and the existing L2b receipt apply to that selected path.

The round 6 comparison reused the historical manifest's listed runtime inputs; source packs, environment, external build tools and absent browser results remain outside that byte claim. Existing 39-test and bundle receipts are not backdated. Old mismatched in-progress fights, damage/healing, rejected host storage writes, Save/reload/Export/literal Import and relevant L2a interaction regression remain the exact missing journey/compatibility checks.

### Verification and preservation

New artifacts are reconciliation snapshots, not evidence of new gameplay. Shared doc additions were appended from fresh disk contents; source/mapper/coverage/checkpoint files of other chats were not edited. Under AD32, no accepted rule or priority changed, so no rules-register rewrite or full runtime suite is appropriate. Commands, integrity results and remaining scope follow after final checks.


Round 7 final checks: `node scripts/check_rule_behavior.mjs saves` PASS 3/3 existing tests; `python3 docs/audits/tools/plan_review_status.py --check` PASS structural routing with drift retained. [Integrity receipt](reconciliation-tooling-2026-10-31/round7-validation.json): 48 unique SG09 routes to 15 retained owners, six MC identities/seven source blocks, current input hashes match, nine local links/fragments resolve, appended-section whitespace PASS. Scoped `git diff --check` PASS. All other previously dirty tracked file hashes matched the pre-write baseline at final comparison. This preservation check excludes pre-baseline changes and untracked files; no other writer's changes were reverted.

`npm run check:docs` remains FAIL on two diagnostics in `docs/research/DOWNLOAD_SCOUT_NEXT_2026-10-31.md` (lines 168 and 335 at check time); no diagnostics in this pass's paths. The first run also found two phrasing diagnostics in the new round, which were corrected before the final run. No runtime build, full suite, browser journey, persistence exercise, installation, source-book reading, worktree retirement, commit or push performed. Changes remain local/uncommitted. Remaining work is substantive qualification or gameplay at its incumbent owner, not hidden by this routing pass.


## Round 8: historical control semantics reconciled, 2026-11-01

The subsequent user request explicitly leaves L2b and whole-LOTM qualification with their existing owners. [Native reconciliation round 4](../reviews/PLAN_RULE_RECONCILIATION_2026-10-18.md#round-4-historical-control-semantics-2026-11-01) replaces round 7's navigation-only SG09 boundary for the selected execution-state clauses: 48 original controls, 15 distinct family dispositions and nine group relationships. Unique source/mechanic content and incomplete gameplay remain outside this control review. The 519 frozen ungrouped indexed-only paths retain their prior coverage.

The native catalog now pins successor/supplier dependencies for SG09, and its optional dependency checker has five passing focused regressions. Reviewed unchanged inputs permit skipping duplicate control review across 189 existing grouped records; this is neither a new full-content review count nor a gameplay completion count. Original catalog/text/hashes are retained in the native round's history; its checks receipt records current validation and preservation. No L2b/whole-LOTM/runtime/bundle/save/source-pack mutation, reader dispatch, worktree retirement, commit or push occurred.
