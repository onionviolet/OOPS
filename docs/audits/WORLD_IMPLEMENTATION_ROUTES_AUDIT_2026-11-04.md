# World implementation routes: map and audit

**Reconciliation update, 2026-11-04:** F1–F4 have been applied to their existing guide/router/summary owners under the already recorded direction. F5 remains a check-scope observation. The [execution record](LOOSE_DOCUMENT_RECONCILIATION_2026-11-04.md) names exact dispositions and limits; the audit below retains its original proposal and verification history.

2026-11-04. Requested by Weibao: “visualize and audit the rules we have for various avenues of implementing worlds? From creating the UI to other stuff and more? Creating new features? other stuff?”

Status: source-level audit and proposed corrections. This report changes no standing rule, implementation priority or runtime behavior. The route inventory points to existing owners; it is not a new rulebook or universal checklist.

## Scope and evidence

Inspected the working files at HEAD `673508969fdd7c63cd0614724818e58ddccf3c30` plus existing local changes on 2026-11-04. The checkout has extensive unrelated documentation, runtime and generated changes. No prior local changes were edited or staged for this audit. Findings describe the inspected inputs, not a clean committed release.

Read the startup owners, rules router and relevant passages of the world/UI/lead-life owners, architecture rules, mechanic workflow and checker implementations. This is a breadth audit of routing, authority and delivery contracts, with targeted rule comparisons. It is not an exhaustive semantic audit of every domain rule, a new source-book read, or a gameplay compliance assessment. Domain coverage below follows the registered owner scopes; existence of guidance does not prove implementation.

Authority: latest user instruction → [USER_VISION](../USER_VISION.md) → owning accepted rules → summaries. Source-qualified law determines local behavior within that direction. Proposals remain proposals under AD32 even when registered or used as working prompts. The [previous reconciliation audit](RULES_RECONCILIATION_AUDIT_2026-10-30.md) already owns broad merge/reading-load proposals; this report adds route-specific findings rather than restarting them.

## The common shape

Choose the requested outcome and existing owner → locate the actual mechanism or named gap → implement the smallest complete selected loop → show its consequences through the observer-safe UI → prove the changed route → record the exact delivered state.

This is a dependency map, not a waterfall: UI design can expose a missing mechanism, a new source fact can change an early contract, and a consequence can reveal another existing consumer. A named engine/UI contract keeps those iterations connected (WA54–WA57). Commit, push, publication and normal-app adoption remain separate from technical verification.

## Avenues and their owners

| Route | When it applies | Existing owners and codes | Observable result and boundary |
|---|---|---|---|
| R1 UI and information design | Create/change controls, layouts, inspection, descriptions, scenes or Reports | [UI_RULES](../UI_RULES.md), [DESIGN](../../DESIGN.md), UR1–UR75 standing; later UR/UIV proposals retain their labels; SUI/RPT binding defaults; WA54 | Real producer, known-state projection, command and result; meaningful home and return. Desktop 1920×1080 is primary. Mockup workflow applies when layout is unsettled, not to every settled fix. |
| R2 Existing-system feature or content | Add an item, recipe, task, effect, service or new degree of a supported mechanism | [Systems register](../SYSTEMS_REGISTER.md), [systems front door](../systems/README.md), relevant domain owner, AD36/38, AR2/3/7/8 | Extend the current owner/verb before inventing a subsystem. Proven-mechanism content uses lint plus a sampled batch journey under AD36 item 7. New mechanics require their changed behavior to be proven. |
| R3 New/shared mechanism | Existing owners cannot express the requested operation | [Mechanic workflow](../gm/MECHANIC_ABSORPTION_WORKFLOW.md), AR11–AR14, WA5/48/54–57, AD51 | One owned state/transaction path with actual consumers. Design shared semantics where several worlds reasonably need them; later second-world use validates/revises the seam. Unique local behavior remains valid. Research stages trigger on a source gap. |
| R4 Book-world absorption | Turn held source evidence into playable world data and mechanisms | [WORLD_ABSORPTION_RULES](../WORLD_ABSORPTION_RULES.md), WA1–41 and WA48–50 accepted (AD32); WA54–60 standing; other groups keep their status; [WORLD_PASS_RULES](../WORLD_PASS_RULES.md) proposed workflow | Pinned source/era, qualified facts, world-specific laws and signature loop. A valid pack is not an absorbed world (WA19). Full-known-source design informs an early bounded slice without implementing all late powers. |
| R5 Protagonist developer campaign | Build and verify a book world through its lead's life | [LEAD_LIFE_RULES](../LEAD_LIFE_RULES.md), [guide §10](../LEAD_LIFE_GUIDE.md#10-lotm-first-ui-and-engine-implementation-procedure-2026-10-31), AD44, CLR, SUI/RPT | Source-defined route exercises real mechanisms and their UI. Developer canon policy is separate from ordinary player goals, starts and later open play. LOTM-first remains; HP's later selected parallel start is recorded in USER_VISION. |
| R6 Original, divergent or remix world | Author a world or change its premise | Rulebook 2–3, AD1–5, WA3/8/18, [entry rules](../WORLD_ENTRY_RULES.md), relevant domain owners | Declare premise, authored/generated status, local laws, viable start and signature loop. Shared pack shape does not require a book protagonist or book locators for authored facts. |
| R7 Entry, travel and alternate lives | New start, body/identity, crossing, carry or livelihood | [WORLD_ENTRY_RULES](../WORLD_ENTRY_RULES.md), WER1–17, AD10–18/23, WA13–14; see register for status | Coherent body, knowledge, means, obligations and first task; crossing settles actual carriers and time. Developer-route proof does not prove random-local hiring or ordinary-start coverage. |
| R8 Domain gameplay | Combat/health, economy, skills, crafting, social interaction, exploration or powers | [DOMAIN_RULES](../DOMAIN_RULES.md): BHR/CBR/ECR/SLR/PIR; [MAKING_RULES](../MAKING_RULES.md): MR; [site rules](../SITE_AND_EXPLORATION_RULES.md): SR; [ability rules](../ABILITY_RULES.md): ABR proposed; [gate rules](../PROGRESSION_GATE_RULES.md): GTR proposed | Each selected domain supplies its actual costs, means, failure and aftermath. A new ability is not automatically a new engine; a new meter without a use fails FLR4. |
| R9 Generation, routines and time | Fill source gaps, sample lives, simulate repeated work or catch-up | [generation foundation](../GENERATION_FOUNDATION_RULES_2026-10-14.md), GR1–17, CX4/5, AD15–18, AR3, WA7/10 | Stable versioned draws, budgets, actual clock owner, public recap, no reroll-by-inspection. Unknown source facts remain unknown; authored fills are labelled. |
| R10 Saves, refactoring and host delivery | Add state, extract a module, change pack revisions or package the app | [ARCHITECTURE_RULES](../ARCHITECTURE_RULES.md), AR6/9/10/15/16; [SAVES](../SAVES.md); AD39 host boundary | Explicit compatibility policy; new-state save/reload/Export/Import when changed. Separate structural and behavior changes. Packaging, installation and normal-app adoption are distinct evidence states. |
| R11 Research/audit without implementation | Resolve a source uncertainty, map coverage or evaluate a proposal | AD32/35/37, WPR evidence/reuse rules, [research playbook](../research/SOURCE_DEEP_DIVE_PLAYBOOK.md) | Qualified finding saved in its owner, with limits and reopen trigger. Does not authorize a new world, build, priority change or commit. |

## Findings and proposed corrections

### F1. A late shared-seam clarification has not reached the lead-life guide

**Verified contradiction, highest priority.** [USER_VISION line 7250](../USER_VISION.md#reasonable-things-get-abstracted-2026-11-03) explicitly says a second world validates/revises a seam and is not a precondition for designing it. AD51 and AR12 reflect this. [LEAD_LIFE_GUIDE line 570](../LEAD_LIFE_GUIDE.md#10-lotm-first-ui-and-engine-implementation-procedure-2026-10-31) still says a new shared seam is “justified by two real consumers”. That can block reasonable up-front shared design after the user specifically removed that reading.

Proposed correction: update that sentence to distinguish design justification from portability evidence. Default: design a seam from plausible shared semantics and known source pressures; validate or revise with a second different case. Dial: keep unique behavior local or split an overgeneralized seam. Reason: preserve AD51 without claiming untested portability. Do not turn a second-world fixture into permission to implement that entire world. Proposed FND5 remains a proposal and should not override AD51 either.

### F2. The broad new-world router sends originals through book-specific machinery

**Verified routing ambiguity.** The [router](../RULES_INDEX.md#router-what-applies-to-my-task) row “A new world or book adaptation” leads with AD44, CLR, SUI/RPT and the LSD design matrix. AD44 and the lead-life owner describe book-world development. WA18 explicitly includes original continuities. An original world can use shared engine, entry and loop rules without inventing a source protagonist, canon chain or paragraph ledger.

Proposed correction: keep a common world-pack/entry/domain route, then branch into book-source and protagonist rules when adapting a book. Reuse the existing router, not another mandatory document. Reason: the scope of the task should decide which guidance loads.

### F3. The mechanic router is broader than its linked workflow's trigger

**Verified routing mismatch; extra work is a plausible consequence, not a measured agent pattern.** [RULES_INDEX line 99](../RULES_INDEX.md#router-what-applies-to-my-task) applies MAW stages 0–7 to adding or absorbing any mechanic. The [workflow introduction](../gm/MECHANIC_ABSORPTION_WORKFLOW.md) scopes itself to work needing both research and code, and explicitly permits a settled slice to proceed directly. AD36 item 7 separately provides a cheaper route for content on a proven mechanism.

Proposed correction: make the router name the fit check first, then trigger MAW research/design stages for named uncertainties. Ordinary rows follow their actual mechanism lint and sampled journey. Keep real runtime completion gates. Reason: broad entry wording should not turn optional research rounds into a universal process.

### F4. The current-focus summary contains an expired task and omits a later selected start

**Verified current-state drift.** [PROJECT current focus](../../PROJECT.md#current-focus) still says “Batched reading before Nov 1” and describes credit expiring Nov 1. The audit date is Nov 4. USER_VISION's [Nov 3 HP instruction](../USER_VISION.md#harry-potter-protagonist-playthrough-starts-2026-11-03) selects a second lead-life start beside Klein, while PROJECT does not point to that selection. This does not prove the reading finished or establish HP's implementation state.

Proposed correction: reconcile those lines from the owning schedule/checkpoint and HP plan, archive expired timing text, and retain LOTM-first. Do not infer completion from the passed deadline. Reason: an agent beginning from PROJECT should see the current selected work and uncertainty.

### F5. Existing checks validate useful slices, not the whole rule system

**Verified enforcement boundary, not a broken check.** This checkout's `npm run check:rules` passed with one warning. It checked 30 register rows, 51 AD codes and 995 relative links; warned that a linked threat-lore file is untracked; validated 19 receipts while skipping 317 explicit legacy paths; and passed the direction-sync check. [check_receipts.mjs](../../scripts/check_receipts.mjs) discovers files named CHECKPOINT.md or RECEIPT.md and validates structured metadata. It does not replay their gameplay or inspect every differently named implementation receipt. [check_rule_behavior.mjs](../../scripts/check_rule_behavior.mjs) maps four focused groups and explicitly disclaims whole-rule compliance. [check_direction_sync.mjs](../../scripts/check_direction_sync.mjs) is warning-only by default and checks changed-file companions, not semantic propagation into every guide. F1 can coexist with a green result.

Proposed correction: keep these bounded checks and label their scope. For an accepted direction change, trace its directly affected router/guide consumers in the same change. A narrow regression may earn its cost if it protects a demonstrated recurring invariant; this audit does not recommend a new universal compliance suite or retroactively gating all legacy receipts.

## Representative source-level walkthroughs

| Task | Route through existing rules | Failure scenario worth checking | Proof scope |
|---|---|---|---|
| Add a recipe on an already proven crafting envelope | R2 → MR and current recipe schema → existing craft UI | Inputs/support change between quote and commit; no duplicate spend | Row lint and sampled journey per AD36; broaden when the mechanism changes |
| Add a world power whose control/reserve semantics several worlds need | R3 + R8 → AD51/WA55 shared semantics → local laws/numbers → producer/command/result/UI | A second world's carrier or support-loss behavior breaks the first abstraction | Focused mechanism tests and real selected-world journey; second case validates portability without selecting another full world |
| Repair a settled panel's blocked reason | R1 → UR70–75/AR8/PIR9 → existing projection and component | Unknown cause leaks through disabled text, or the reason becomes stale | Relevant focused check and rebuilt desktop journey; no new layout study by default |
| Create an original world's first livelihood loop | R6 + R7/R8 → authored premise → viable start → work/cost/result/use | Failed work leaves no viable next task; wrong world clock advances | Selected loop and failure path at runtime floor; book-specific CLR extraction is inapplicable |
| Open a random-local life in a book world | R4 + R7 → actual body/funds/knowledge/obligations → ordinary work route | Canon developer knowledge or already-employed status is silently copied | Ordinary entry and livelihood proof; Be Klein evidence does not substitute |

These are document/contract walkthroughs, not independent agent trials or executed gameplay tests.

## What already works well in the rules

The engine/UI boundary is unusually explicit: WA54 names supplier, owner, actor/body/world/clock, observer projection, command, consumer and persistence. Domain rules apply actual mechanisms instead of permission lists (AD38), and AD46/51 preserve world differences while allowing shared abstractions. The delivery floor rejects write-only state and proves an actual use. AD36 already distinguishes content from mechanisms and supports evidence reuse; AD42 prevents human review from becoming a false technical blocker. Those protections address concrete failures and should remain.

The needed improvement is propagation and routing, with a clear distinction between accepted direction, working proposals, implemented support and exercised behavior. No additional rulebook is proposed.

## Verification and disposition

| Check | Input and result | Limit |
|---|---|---|
| `npm run check:rules` | Inspected dirty checkout at the HEAD above: PASS; 30 rows, 51 AD codes, 995 links; one untracked-link warning; 19 receipts checked, 317 legacy paths skipped; direction sync PASS | Document/metadata evidence, not gameplay or semantic agreement |
| Audit relative links | 32 local file targets checked, zero missing | Anchor semantics remain with the source owners |
| Route explorer | Installed Chrome in headless mode at 736 px and 320 px; all 11 selections at each width and state restoration passed; no horizontal overflow or script errors; 736 px screenshot visually inspected | Default Playwright browser binaries were absent; switched to installed Chrome. This proves the explanatory visual, not the game's UI |
| Runtime build/tests/browser | Not run for this documentation-only audit | No runtime behavior changed or claimed |

Disposition: F1–F4 remain proposed source corrections; F5 documents a check boundary. This audit adds this report and a chat-scoped interactive route explorer. No standing owner was changed, no game code was edited, and nothing was committed or pushed.
