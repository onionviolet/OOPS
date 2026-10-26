# Implementation practice core audit

Weibao, 2026-10-26: "Other rules and more to make future implementations
better? what else to consider? Continue accordingly". This follows the
[ability rules](../ABILITY_RULES.md) and [AD42](../RULES_INDEX.md#accepted-direction-rules-ad)
of 2026-10-25.

A repeatable audit of how implementation work goes wrong in this repo and which
rule, check or tool would have prevented it. Rounds extend this file; codes are
never restarted. Prefix IPC (unused before this round).

Status: proposals. Nothing here is accepted direction, changes a rulebook, or
authorizes a runtime or tooling change. Each proposal names the owner it would
land in.

## Round 1, 2026-10-26: what recurred on 2026-10-21 to 2026-10-25

### Evidence

A read-only sweep of 51 dispatch checkpoints and receipts, the reviews, the MCP
limits ledger and the rules index looked for patterns that repeat across two or
more lanes. Four citations were spot-checked directly: the tool-crack build lock,
review findings U1 and U4, and playtest P1.

| Code | Pattern | Lanes | Evidence | Consequence |
| --- | --- | --- | --- | --- |
| IPC1 | Native proof deferred by the single build output | 4+ | [tool-crack receipt](../gm/dispatch/tool-crack-2026-10-25/RECEIPT.md) line 9 ("Build lock: do not build... LOTM owns dist/index"); [hp-school receipt](../gm/dispatch/hp-school-progression-2026-10-25/RECEIPT.md) line 50; [master reconciliation](../gm/dispatch/master-reconciliation-2026-10-25/CHECKPOINT.md) | Lanes stop at "SOURCE READY, implemented-unverified"; every native journey is re-run in one late batch; a 181-path dirty-primary snapshot and 1,191 archived worktree files |
| IPC2 | Parallel or uncommitted work clobbers landed work, found late by review | 3+ | [uncommitted runtime review](../reviews/UNCOMMITTED_RUNTIME_REVIEW_2026-10-25.md) U2 (reference-crafting journey deleted), U3 (copied test imports missing exports), U1 (stale checkpoint); master-ready review F1 | Four high or medium defects found by review with about 174 paths in flight |
| IPC3 | A command writes, then persisting fails, with no rollback; or one copy of a fact updates and its siblings do not | 2 | Review U1 (baggage duplicated through a retained checkpoint), U4 (failed rust save leaves the setting changed) | Duplicated items; settings changed after a "failed" command |
| IPC4 | Harness and MCP wrapper defects mistaken for game defects | 2 | [playtest sweep](../reviews/PLAYTEST_SWEEP_2026-10-25.md) P1 (hidden loading text read as a blocker), BFA2, BMC1, BLD2, BLD3; about ten [MCP limits](../tools/game_mcp_limits.jsonl) entries | The first sweep rated zero systems playable; findings ranked against drifting builds |
| IPC5 | Proof through prepared fixtures where the feature is not naturally reachable | 3 | Reconciliation tool fixture "explicitly prepares practice, equipment and cave access"; LOTM q2 dose refusal "not reachable by play today"; sweep Meditation prerequisite | Honestly labelled, but entry routes stay unproven (MC3) |
| IPC6 | Seam found missing mid-lane, then an extension seam bolted on after a stop | 2 | hp-school receipt line 7 (lane stopped; coordinator authorized a new seam); engine-bindings checkpoint ("to avoid duplicate seams") | Stall and rework |
| IPC7 | Tests named by wave or slice | many files | [test leanness audit](../reviews/TEST_SUITE_LEANNESS_AUDIT_2026-10-25.md) R1-R6 | A large relocation round; already handled by the lean-tests rule |

Refuted or too thin to act on: hand-built commands beside an existing
descriptor (not seen in these sources; ABR6 covers it going forward), invented
numbers, cost vocabulary (one lane), generated-bundle merge conflicts, measured
token waste.

Rules that exist but were bypassed in practice: AR10, AR16 and AD36 (browser
proof, bypassed by IPC1); AR3, AR6 and AR7 (one authority, revalidate before
mutation, bypassed by IPC3); AR14 and AR15 (name the seam, reserve hot files;
IPC2, IPC6). For these the fix is a check or tool, not another rule.

### Root cause found for IPC1

`build.js` writes `dist/bundle.js` and then rewrites the tracked `index.html`
in place (lines 29 and 36-65). With every lane in the primary checkout (AD41),
one build changes files every other lane is testing against, so a lane that
builds must lock everyone else out. The lock follows from the build script, not
from the rules.

### ACCOUNT FOR NOW

| Code | Apply to the next implementation slice |
| --- | --- |
| IPC8 | **State the route kind in every receipt.** Each exercised route is "reached naturally from a fresh life" or "fixture-prepared (name)". The cheap check is the `yairpg-game` MCP walk from `game_new` (MC14); the browser run stays the UI proof. Owner: AD36 receipts. |
| IPC9 | **Every report carries its build identity.** Playtest, MCP and browser reports state the bundle SHA-256 (`game_freeze` returns it) and the tool version. A finding without one is not ranked against another build's findings. Owner: [GAME_MCP_LIMITS](../tools/GAME_MCP_LIMITS.md), playtest README. |
| IPC10 | **Check the tool before blaming the game.** A "blocker" from a wrapper or MCP is confirmed against the real DOM or a second route before it is ranked as a game defect; otherwise it goes to the limits ledger. Owner: GAME_MCP_LIMITS. |
| IPC11 | **A persisting command is one transaction.** Apply, persist, and on persist failure roll back every copy it touched (live state, checkpoints, paused copies). Tests for such commands include a throwing persist port. Owner: an AR6/AR7 application note in [ARCHITECTURE_RULES](../ARCHITECTURE_RULES.md). |
| IPC12 | **Name the seam before dispatch.** A runtime brief names the existing registry, descriptor or store it extends (AR14), checked against [SYSTEMS_REGISTER](../SYSTEMS_REGISTER.md) and, for abilities, [ABR5-ABR6](../ABILITY_RULES.md). A brief that cannot name one gets a short seam check first instead of a mid-lane stop. |

### LATER / DELEGATE (proposals, not dispatched)

| Code | Opportunity and owner | Suggested capability and effort | Done check |
| --- | --- | --- | --- |
| IPC13 | **Per-lane build output (fixes IPC1).** `build.js` takes an output directory (for example `BUILD_OUT=.lane-builds/<lane>`) and writes the bundle plus its own copy of `index.html` there, leaving tracked `index.html` and `dist/` alone. Adoption builds keep today's path. Owner: `build.js`, [shared worktree practice](../gm/SHARED_WORKTREE_PRACTICE.md). | Sonnet medium; one small tooling slice with a test; needs relative asset paths checked | Two lanes build at once in the primary checkout; `git status` shows no change to `index.html` or `dist/`; each lane's page loads in the browser with its own bundle hash |
| IPC14 | **Combined-candidate gate (fixes IPC2).** One command run before landing: full suite once, `check:arch`, `check:rules`, plus a fast check that every symbol a test imports still exists. Owner: AD36, SHARED_WORKTREE_PRACTICE. | Sonnet low-medium; script plus npm entry | A deliberately removed export fails the fast check in seconds, before the full suite |
| IPC15 | **Persist-failure test helper (enforces IPC11).** A shared fake persist port that throws, and a helper asserting state equals the pre-command snapshot. Owner: tests for persisting commands. | Sonnet medium | Review findings U1 and U4 each reproduce as a failing test before their fixes and pass after |
| IPC16 | **Natural-route check script (enforces IPC8).** A headless script per delivered route that reaches it by earned steps through the MCP and fails when a fixture is required. Owner: playtest/MCP tooling; builds on MC10. | Sonnet medium after the M1 walk names the routes | Each route reports natural or fixture with a bundle hash, in under a few minutes |
| IPC17 | **Compact MCP views (found by the M1 walk).** Every `game_look`/`game_click` reply repeats about 8k tokens of whole-screen text, so the [M1 route walk](../gm/dispatch/m1-route-walk-2026-10-26/ROUTES.md) got 6-8 calls per route instead of 40 and left routes unwalked. A delta or scoped-summary reply mode makes IPC16 affordable. Owner: [GAME_MCP_LIMITS](../tools/GAME_MCP_LIMITS.md), ledger entry 2026-10-26. | Sonnet medium in `scripts/mcp/` with a check in `game_mcp_check.mjs` | A 40-call route walk fits one agent's budget; a reply after one click carries only changed panels and actions |

### Rulebooks still missing (proposed order)

The index lists cheats, characters/companions, lives/continuation and time as
aspects without a dedicated rulebook. The recent work points to four rulebooks
that would most help future implementation, in this proposed default order:

1. **Content rows and census loading.** Every world's deepening now runs through
   census kinds mapped to seams (DWF165-DWF182): row identity, rung, sealed
   filter, the shallow-to-deep ladder and one row loader. Highest payoff because
   HP, LOTM and the next worlds all scale through it.
2. **Institutions, membership and missions.** `faction_rank.js`, the
   contribution store, lessons and duties recur in LOTM, HP, cultivation, Qud
   and the institution passes (implementation map C2, C19).
3. **People and companions.** Rows versus bespoke lives (DWF114), routines,
   knowledge of people, companions ([core audit](COMPANIONS_CORE_AUDIT.md)).
4. **Time, idle and away.** AD16-AD18 plus owning clocks; the master plan's MC5
   shows each slice re-deriving it.

Each would compose its existing owners the way [ABILITY_RULES](../ABILITY_RULES.md)
does. Under the index's rule, a new rulebook needs Weibao's request; this round
records the order, not the books.

Round verification: evidence from one read-only sonnet sweep with four direct
spot checks; `build.js` read in full. No runtime, tooling or rulebook edit.

## Round 2, 2026-10-26: a quality floor for implementation, absorption and execution

Weibao, 2026-10-26: "overarching things we should do and more? better rules?"
then "rules as in the implementation and absorption and execution rules to
achieve bare minimum of quality and extend quality and more?" Proposals only;
no runtime, tooling or rulebook edit in this round. Codes continue from IPC17.

### Evidence

Read this round: the rules index (register, core digest, AD1-AD42, AD36
workflow), WA1-WA21, WPR1-WPR32, round 1 above, the master plan's P1-P5 lens
and MC14, `package.json` scripts, `scripts/check_*.mjs` heads, the dispatch
folder and `src/` content modules. Not re-verified: round 1's lane citations.

| Code | Finding | Evidence | Consequence |
| --- | --- | --- | --- |
| IPC18 | The floor is written but scattered. Eleven rulebooks hold about 2,300 lines and roughly 400 codes; "a slice is not done unless" is split across AR10, WA19, WPR21, WPR32, UR70-UR75, IPC8-IPC9, AD36 and the master plan's P1-P5. No one page states the floor. | Register and line counts above; `RULES_INDEX` is 393 lines and already carries a core digest | A lane satisfies its focused test and build and still ships a feature with no description, no cost shown, no consumer and no natural route, while citing codes correctly |
| IPC19 | Rules bind by status, and the floor rules are mostly "proposed". WPR, GTR and ABR are proposed; lanes are told to cite them, but under the index's authority order a proposal binds only through the AD or standing line it restates. | Register status column | "Bare minimum" has no binding definition until a short floor set is accepted |
| IPC20 | Rule lines accrete history. AD40 is one 1,200-character paragraph of dated instructions; USER_VISION is 6,305 lines and PROJECT 2,057. An agent reading for the rule pays for the history every time. | AD40 row; `wc -l` | Context cost crowds out the reading that quality needs (source, consumer, test); rules get skimmed, which is the bypass pattern of round 1 |
| IPC21 | Execution evidence has no shape. 103 `CHECKPOINT.md` and 2 `RECEIPT.md` files in 227 dispatch folders record checks in free prose; WPR21's six review states and IPC8/IPC9's route kind and build hash are each asked for in a different owner. | `ls docs/gm/dispatch` | Reviewers and the integrator re-derive what was proven; "implemented-unverified" and "browser-verified" are not machine-distinguishable |
| IPC22 | Absorption's floor is defined (WA6 floor before deep, WA19 lint is not absorbed, DWF175 density is edges) but the only mechanical check is pack validity. Nothing counts rows without an edge or parts without a declared tier. | `check_content_authoring.mjs` compiles and runs a pack; `check_rule_pack.js` validates shape; no consumer or tier count | A census can land 100 shallow rows that nothing teaches, sells, needs or reveals; depth is reported by row count |
| IPC23 | Prose has a direction (later local-AI drafting) but no floor. UR70-UR75 define the shape of a description; no check reads descriptions at all. | `grep description:` hits 240 `src/` files; no lint | The weakest text ships unflagged, and the later drafting pass has no list of what to redo |
| IPC24 | Review is all-or-nothing. WPR18 reviews every world-pass return; AD36 item 5 says not to spawn reviewers for routine changes. Round 1's four high/medium defects (IPC2) were caught only by a late whole-tree review. | Round 1 IPC2; AD36 item 5 | Shared-seam and persistence changes get the same review as a content row: none until landing |

### ACT NOW (done)

Saved this round; recorded the request in
[USER_VISION](../USER_VISION.md#quality-floor-and-extension-rules-2026-10-26)
and the PROJECT summary. The compact MCP view (IPC17) landed in `97e2e45a3`, so
IPC16's route walks are now affordable; that changes IPC26 below from
"after a tool" to "next".

### ACCOUNT FOR NOW

| Code | Apply to the next implementation, absorption or execution slice |
| --- | --- |
| IPC25 | **Done 2026-10-26 as AD43 and the index floor section.** Original: **One-page floor, as an index section, not a new rulebook.** Add "Definition of done (floor)" beside AD36 in `RULES_INDEX`, restating existing codes only: F-build (bundle hash, IPC9), F-route (reached naturally from a fresh life or named fixture, IPC8), F-shown (description in UR70-UR75 shape, cost and failure feedback visible), F-used (the result has a consumer: an edge, a verb or a gate, DWF175, P3), F-kept (save, reload, import when persistence changes, AR10/WPR32), F-labelled (highest WPR21 state named). A slice missing any F-line is "implemented, below floor", never "done". Owner: RULES_INDEX; adds no authority (restates). |
| IPC26 | **Walk the route before the browser.** With compact replies landed, every runtime receipt includes an MCP walk from `game_new` to the changed behavior (MC14), recorded as natural or fixture. The browser run remains the UI proof. Owner: AD36 receipts; this is IPC8 made cheap. |
| IPC27 | **Receipt front matter.** Each checkpoint or receipt starts with a fixed block: `build:` hash, `route:` natural or fixture(name), `state:` one of WPR21's six, `viewport:` or n/a, `persistence:` checked, unchanged or n/a, `tests:` the focused file(s) run, `review:` none, diff-scoped or landing. Free prose follows. Owner: SHARED_WORKTREE_PRACTICE receipt guidance; lintable by IPC30. |
| IPC28 | **Rule line, then history.** A rule row holds one sentence of rule and one of reason; dated instructions that refined it go in a "history" line or ledger below the table, linked. Apply when next touching AD40, AD23 or AD33 (the three longest); do not rewrite the index for its own sake. Owner: RULES_INDEX conventions, WPR26. |
| IPC29 | **Review scales with the change kind (extends AD36 item 7).** Content rows on a proven mechanism: row lint plus one sampled journey, no reviewer. A new or changed shared seam, store, save slice or persisting command: a diff-scoped review at low effort before landing, in the combined-candidate gate (IPC14). Whole-tree reviews stay for reconciliation. Owner: AD36 workflow. |

### LATER / DELEGATE (proposals, not dispatched)

| Code | Opportunity and owner | Suggested capability and effort | Done check |
| --- | --- | --- | --- |
| IPC30 | **Receipt lint (enforces IPC27).** Extend `check_rules_index.mjs` or add `check_receipts.mjs`: every `CHECKPOINT.md`/`RECEIPT.md` touched in the diff carries the front-matter block with valid values; a `state:` of browser-verified or higher needs a `build:` hash. Owner: `scripts/`, `check:rules`. | Haiku or Luna low; small script with a fixture test | A receipt missing `route:` fails the check; existing receipts are grandfathered by date |
| IPC31 | **Orphan-row and tier check (enforces WA6, DWF175).** For each world pack and census family, count rows with no edge (nothing teaches, sells, needs, reveals or gates them) and parts with no declared tier; print per world. Owner: `check_content_authoring.mjs` or the DWF182 row loader. | Sonnet medium; needs the row loader's edge shape | A new shallow row with no edge is reported; the report lists LOTM and HP orphan counts with a build hash |
| IPC32 | **Description lint (floor for UR70-UR75).** For every player-facing definition: non-empty, an effect clause present, no raw IDs or snake_case leaking, length within bounds, no "placeholder/TODO". Emits the list the later local-AI drafting pass will work from. Owner: `check_content_authoring.mjs`; UI_RULES. | Haiku or Luna low for the lint; the drafting pass is a separate selected task | The lint reports a count per world; a definition with an ID in its text fails |
| IPC33 | **Done 2026-10-26: Weibao accepted the six floor lines as AD43** ([index](../RULES_INDEX.md#definition-of-done-the-floor-ad43)). Original proposal: **Floor set acceptance (resolves IPC19).** Ask Weibao to accept the six F-lines of IPC25 as binding, by name, leaving the proposed rulebooks they draw on at "proposed". One question, one answer. Owner: USER_VISION on acceptance; RULES_INDEX register. | User decision; trivial | The register's AD list gains one line, or the index floor section says "accepted (date)" |
| IPC34 | **Quality ladder above the floor.** Q0 builds and tests; Q1 the floor; Q2 idle and away behavior, return recap and an inspector or debug view for the new state (AD16-AD17); Q3 world fit (canon status, dials with in-world reasons, WA3/WPR5); Q4 polish (drafted prose, hover, report, UI tokens). Recorded as one field in the receipt and one column in the world completion standard's S-levels; no new ledger. Owner: MASTER_PLAYABILITY_PLAN P-lens, WORLD_COMPLETION_STANDARD. | Sonnet low; docs | Each delivered route in the M1 cards names its Q level; the next slice targets the lowest |
| IPC35 | **Proposed overarching order.** 1) IPC13 per-lane build, since every native proof waits on it; 2) IPC25 floor page and IPC27 receipt block, then IPC30 lint; 3) IPC26 route walks on the M1 cards with IPC9 hashes; 4) IPC31 orphan-row check before the next census load; 5) IPC32 description lint, feeding the later drafting pass. The four missing rulebooks of round 1 come after, content rows first. | Coordinator; sequence only | The master plan's A1 packet names this order or records why it differs |

Round verification: read-only inspection of the files named under Evidence;
`git diff --check` on the three edited docs. No runtime, tooling, rulebook or
index edit. No workers dispatched.

## Round 3, 2026-10-26: design practice, the mistakes agents make before code

Weibao, 2026-10-26: "what about design rules and considerations so the agents
dont make mistakes and stuff? more to conisder?" and "Consider looking through
the things that prompted us to create rules, or reusable systems, like the UI
text, wiring and more; look across the rules and chats and more?" His example:
the trait tooltip that read like its formula, which became UR70-UR75.
Proposals only; no runtime, tooling or rulebook edit. Codes continue from IPC35.

### Evidence

Two sweeps, both bounded:

- **Rule origins.** One haiku reader read the preamble of each rulebook and
  reusable system (UR70-75, UR59-64, UR65-69, AR, MR, SR, WA, WPR, GTR, ABR,
  GR, the five domain sections, AU, the design-defaults audit, the rules index,
  the mockup workbench, the game MCP ledger, the topic playbook, the shared
  worktree practice) plus the USER_VISION entry each links, and extracted the
  prompting words and the pain. Every one was written after Weibao noticed a
  mistake in something delivered; none was written before the mistake.
- **Chat corrections.** [`tools/correction_sweep.py`](tools/correction_sweep.py)
  streamed the project's Claude logs (274 files) and Codex sessions for this
  checkout, kept user-role messages under 700 characters containing a correction
  word, and dropped harness notices: 395 candidates from 2026-10-07 to
  2026-10-26, read in full. About 180 of the 2026-10-25 rows are relayed
  assistant text from a coordinator, not human words; the classes below cite
  only identifiable human messages. This is a sample, not a frequency estimate.

| Code | Mistake class (what Weibao had to correct) | Human evidence (date, short quote) | Rule or system it later produced |
| --- | --- | --- | --- |
| IPC36 | **Mechanism described instead of experience.** Text shows the formula, the internal label or a generic refusal, not what it does for the player. | 10-25 "describe what it does rather than the text right now"; 10-20 "rather than YAIR percentage based, how does other places show quality"; 10-26 "the prose and stuff still sucks"; a lane's own browser run found a disabled exam button saying only "circumstances missing" | UR70-UR75; PIR9; DRC9-DRC12 |
| IPC37 | **Agent-invented constraint, gate or absolute.** A paraphrase, milestone or "never/always" nobody asked for becomes a rule. | 10-09 "Remove the 'stop gate' you wrote down, I never asked for that"; 10-10 "Where did we create this rule ... What are other rules like that that we never established?"; 10-13 "'Nothing carries across lives except the heir.' That doesnt have to be the case"; 10-20 "remove any rules that force [1366x768]"; 10-19 "address flawed premises like this and save time" | Design-defaults audit (24 slips); AD5, AD32; RD1-RD13; viewport retirement |
| IPC38 | **Forced complexity on the ordinary route.** A deep model becomes an obligation in every world; checks and tests grow past their use. | 10-18 "for selling we dont need deep economy"; "We dont 'need' a collector for every world"; "We might be overthinking enemy observation"; 10-14 "we dont need a hour long browser check"; 10-23 "are we using too many unnecessary tests?"; 10-26 "we might be doing too much for that [logo]" | AD38; gripes review A3; lean tests (AD36 item 6-7); CX1-CX8 |
| IPC39 | **Process milestone delivered instead of the visible result.** Engine-ready, mocked-up or merged is reported where "I can see it in the app" was meant. | 10-16 "is the mockup system even useful? why not directly work on?"; "things look big for no reason ... lacking the necessary changes"; 10-21 "how come we dont have the font from proto23 extraction, nor the inventory"; "make sure the ... improvements actually show up. Check the current app"; 10-22 "verify the new work actually shows up"; 10-25 "f4 I just need to see it" | AR10; AD41; AD42; the floor AD43 (F2, F6); IPC1 |
| IPC40 | **Slice where "fully" was asked, or stale records of what is done.** | 10-21 "doing something fullly, not just the crafting journey but the complete system"; "Which of those are still actually missing now, and which have we already implemented?"; "reconcile the stale coverage records with what's actually done"; 10-22 "check that the shared docs are up to date ... so future chats are on the same page" | WPR23; IDEAS_LEFT inventory; systems register; MC rounds |
| IPC41 | **Not fitting to what exists.** New work ignores prior systems, audits and decomps. | 10-25 "we should write down our existing systems to help fit in better ... so that there isnt so much hoops"; 10-21 "What specific stuff was in proto23 or YAIR that we didnt have?"; 10-22 "Consider all the decomps we did before, still useful?"; "what happened to the audit on the other proto23 forks" | SYSTEMS_REGISTER; AR14; IPC12; WA1, WA5 |
| IPC42 | **Flat modelling: a thing as a drop, a price or a list instead of a process with means and aftermath.** The design does not stand in the character's seat. | 10-25 "Rather than simply being drops, we will need to process the creatures"; 10-18 "others have to see it" (theft); 10-10 "Alot of things should be decided by means, on both sides"; 10-21 "cant they build a nest in the wild? there is no need to buy stuff"; 10-09 "If I am teaching lana, why would I need to pay?" | AD6, AD38; WGP1 aftermath; BHR/ECR/PIR sections; MR |
| IPC43 | **Wrong reading of a short request.** The agent runs a long pass on the literal or the wrong level. | 10-10 "I meant lore as in world lore"; 10-16 "Oops, rather than math thing I meant map/representation style"; "rather than By world: it should be by type"; 10-18 "I dont mean meddlers, but ... a force dedicated to maintaining timelines"; 10-25 "I meant just consider from an archetecture's perspective" | sharpen skill; AD32 "resolve straightforward details" |
| IPC44 | **Panels designed alone, not on the populated screen; controls hidden.** | 10-15 "I just found the button but it wasnt obvious"; "everything should be viewable without scrolling too much"; 10-18 "so much space with the center middle panel, why not split it?"; "Cold shoudnt be a stat?"; "DOESNT TALK WITH SOMEONE ... OVERLAP WITH AROUND YOU"; 10-26 UI that does not shift | UR1-UR75; gripes F1; UIS1-UIS14 |
| IPC45 | **Findings saved in the wrong place or lost between chats.** | 10-16 "rather than just memory note, save long term notes"; "rather than memory update project.md or agents.md"; 10-23 "Dont save just to memory, save more strongly locally"; 10-26 "keep a record so we dont duplicate" | WPR27, WPR3; AD35; shared worktree practice |
| IPC46 | **Model and token waste.** | 10-07 "use sonnet to be token effective"; 10-10 "use lower level readers"; 10-23 "dont forget to use haiku"; 10-11 "hours? Stop, I will run in codex instead"; 10-16 "75% of my tokens going through one book" | AU1-AU15, AD37, WPR6 |

What the two sweeps agree on: every rulebook answered one of these classes
after the fact, and the rules that stopped the mistake are the ones that got a
check (UR65's contract test, AR16's architecture gate, GR16's three tests, the
MCP limits ledger). Prose rules alone recurred (IPC36 was corrected on 10-20
and again on 10-25; IPC37 on 10-09, 10-10, 10-13, 10-19 and 10-20). So "rules
so agents don't make mistakes" means two things, neither of which is another
rulebook: a short pre-flight on the brief, before the lane starts, and a lint on
the output, before Weibao sees it.

### ACCOUNT FOR NOW: the design pre-flight

Eight lines a brief or design note answers before dispatch, each restating an
existing code. Owner on acceptance: a "Design pre-flight" section in
`RULES_INDEX` beside the floor, and the task packet in
[GAME_IMPLEMENTER_TEMPLATE](../GAME_IMPLEMENTER_TEMPLATE.md). A brief that
cannot answer a line gets a short design check first, not a lane (IPC12).

| Line | The brief states | Stops | Restates |
| --- | --- | --- | --- |
| PRF1 Reading | One sentence restating what Weibao asked, at the level meant, and the assumptions it rests on (viewport, what exists, who plays). | IPC43, IPC37 premises | sharpen; AD32 |
| PRF2 Player sentence | The sentence the player reads when the thing works, and the one they read when it cannot run. Written before the model. | IPC36 | UR70-UR75, PIR9 |
| PRF3 Ordinary route | The simple default route and one exceptional case with its in-world reason and cost. No obligation on every world. | IPC38 | AD5, AD38, WPR5 |
| PRF4 Mechanism, means, aftermath | How it happens, who can know or do it (both sides), and what follows: who saw, who pays, who remembers. Checked from the character's seat: would this person really pay, buy or know this? | IPC42 | AD6, AD38, WGP1 |
| PRF5 Fit | The register row, seam, descriptor or prior audit it extends, by name; "none found" is allowed only after the lookup. | IPC41 | AR14, IPC12, SYSTEMS_REGISTER |
| PRF6 Ring | Which ring of the loop this slice covers (producer, consumer, failure, persistence, UI) and where the live missing list lives. "Full" means all five. | IPC40 | WPR30, master plan P3 |
| PRF7 Screen | For UI: the populated 1920×1080 screen it lands on, in the real app, with what it displaces. | IPC39, IPC44 | AD34, UR1-UR75, gripes F1 |
| PRF8 Constraints | Every constraint in the brief is Weibao's quote, an AD code, or a default with a dial and reason. No agent-authored gate, milestone or "never". | IPC37 | AD5, AD32, design-defaults audit |

Not new rules: each line exists today in a rulebook that was written after the
mistake. The pre-flight moves the question to the moment the brief is written.

### LATER / DELEGATE (proposals, not dispatched)

| Code | Opportunity and owner | Suggested capability and effort | Done check |
| --- | --- | --- | --- |
| IPC47 | **Doc lint for the two commonest slips (IPC37).** In `check_rules_index.mjs` or a sibling: flag "never/always/only" in rule and considerations docs with no "default", "dial" or "unless" within the same row or paragraph, and "accepted" with no USER_VISION/PROJECT link or Weibao quote on the line. Crude counts today: about 1,300 never/always hits and about 400 unlinked "accepted" lines across `docs/*.md`, mostly legitimate, so the lint reports new hits in the diff only and grandfathers the rest. Owner: `scripts/`, DESIGN_DEFAULTS_AUDIT. | Haiku or Luna low; small script plus fixture | A new rule row reading "X never Y" without a dial fails; an existing one does not |
| IPC48 | **Pre-flight in the brief template.** Add PRF1-PRF8 as the first block of the task packet in GAME_IMPLEMENTER_TEMPLATE and the lane brief shape in SHARED_WORKTREE_PRACTICE; the coordinator refuses to dispatch a brief with an empty line. | Sonnet low; docs | The next three lane briefs carry the block; one is sent back for an empty PRF5 |
| IPC49 | **Repeatable correction sweep.** Keep [`tools/correction_sweep.py`](tools/correction_sweep.py) as the audit's tool; rerun it for each gripes round instead of hand-reading logs (both 2026-10-18 gripes reviews were manual). Improve: drop relayed assistant text (lines starting "Retained source order" or "[n] assistant:"), and group by class with a keyword map. Owner: this audit. | Haiku low; script edit | A rerun on the same logs prints only human messages, grouped by IPC36-IPC46 |
| IPC50 | **Prior-work lookup line (enforces PRF5).** One index of what exists to fit to: SYSTEMS_REGISTER rows, census families (DWF165-DWF182), decomp and absorption audits by topic, so P5 is one grep. Owner: SYSTEMS_REGISTER, or a "where to look first" table in RULES_INDEX's router. | Sonnet low; docs | A brief for "creature processing" finds the gathering/processing owner and the Minecraft absorption row in one lookup |
| IPC51 | **Pre-flight acceptance (mirrors IPC33).** Ask Weibao to accept PRF1-PRF8 as binding on briefs, by name. | User decision; trivial | The index gains the section and an AD line, or the audit records "proposed" |

Round verification: haiku reader output read in full and spot-checked against
docs/USER_VISION.md:6243, docs/UI_RULES.md:34 and docs/ARCHITECTURE_RULES.md:5;
chat sweep rows cited above re-read at their dates. `git diff --check` on the
edited docs; `npm run check:rules`. No runtime, tooling or rulebook edit; the
sweep script is saved as audit evidence, not a project check.

## Round 4, 2026-10-26: foundation rules, procedural, modular and stack

Weibao, 2026-10-26: "What about rules like procedural stuff. modularization,
foundation programming language and more?" Read as the technical foundation:
procedural generation (GR1-GR17), modularization (AR1-AR16 and the modularity
rounds) and the implementation stack (AD39, the TS10-TS17 round), plus the
content and rule DSL, since "foundation language" can mean either. Proposals
only; no runtime, tooling or rulebook edit. Codes continue from IPC51.

### Evidence

| Code | Finding | Evidence | Consequence |
| --- | --- | --- | --- |
| IPC52 | **Generation has an accepted contract but no conformance count.** GR1-GR17 were accepted 2026-10-18 after four generators each invented their own draw, pick, freeze and fallback. GR16 asks three tests per generator and GR12 a reader per generator; nothing lists the generators or which ones have them. | About 97 `src/` modules mention receipts with generate or draw; 15 test files carry a golden or seed sweep; `gen_kit.js` and `relic_generator.js` are the named generators | The next generator can land GR-shaped or not, and nobody can tell without reading it; the write-only generator (GR12) is the generation form of a slice below floor F4 |
| IPC53 | **Modular debt is frozen, not shrinking.** The architecture check holds a baseline the project may only shrink: 6 imports of `main.js`, 205 cycle edges, `main.js` 10,115 and `display.js` 6,767 lines. The modularity assessment chose extraction over rewrite (OV8, O2/P1) and the 2026-10-25 D2 round cut two couplings, but no round owns a burn-down target. | `scripts/architecture_baseline.json`; D2 round LATER table (five Sol/Luna items, none dispatched) | Each new feature pays AR1's net-zero line and the baseline never grows, which is good; it also never gets smaller unless a lane chooses to, so the hot files stay the clobber point of IPC2 |
| IPC54 | **The stack question is answered and keeps being re-asked.** Godot and Rust came up on 2026-10-14; Rust, threads and "from an architecture's perspective" on 2026-10-25. Round 7 (TS10-TS17) ranked the options with measurements: keep JS, optional one-file `checkJs` pilot, worker and WASM low until a pure resolver boundary and a profiled numeric bottleneck exist, Tauri very low beside AD39. | Stack doc lines 1483-1765; chat sweep 10-25 | Each re-ask costs a fresh pass (IPC46) unless the ranked table is the standing answer with a reopen condition |
| IPC55 | **The content DSL grows by consumer, which is right, and has no stated stop rule.** Content helpers moved to a leaf kit (DWF121), `rule_modules.js` compiles world laws, structured packs compile descriptors; the modularity assessment explicitly rejects a universal game-rule language. | DWF121; `src/check_rule_pack.js`; modularity assessment P2 | Without a stop rule, the next absorbed world is a temptation to grow a general language instead of adding rows over shared verbs (WA1, WA5, OV5) |

### ACCOUNT FOR NOW

| Code | Apply to the next foundation, generator or stack change |
| --- | --- |
| IPC56 | **A generator lands with its receipt lines.** The receipt names the generator's address shape (GR1-GR2), its reader (GR12), its three tests (GR16) and its budget (GR11). Missing any of the four is "implemented, below floor" (AD43 FLR4 and FLR6 applied to generation). Owner: GR, AD36 receipts. |
| IPC57 | **Every runtime receipt states its change surface (AR13).** One line: core-owner files touched (`main.js`, `display.js`, `save_files.js`, `simulation.js`), new cycle edges (must be zero), registration lines added and paid for. The architecture check already computes most of it; the receipt makes it visible per slice. Owner: AD36 receipts, AR13, IPC27 front matter (`surface:`). |
| IPC58 | **Each extraction round names a burn-down target.** A structural round (AR9, AR15) states which baseline number it lowers and by how much, proves no behavior change by the same journey before and after, and records the new baseline. Rounds that only add exemptions are not extraction rounds. Owner: AR15, D2 round LATER items. |
| IPC59 | **Stack questions route to the ranked table; reopen on measurement, not opinion.** A language, engine, framework, threading or WASM proposal cites TS10-TS17, adds a measured cost the table lacks (profile, save size, test wall time under matched load) and a reversible spike with a parity fixture. Without new measurement, the answer is the table. Weibao's direction change still reopens anything. Owner: stack doc round 7, AD39. |
| IPC60 | **The content DSL grows only by the second consumer.** A new DSL construct, rule module kind or pack field needs two real rows from two worlds that read it (AR11, WA20); otherwise it is a row over an existing verb. "Everything is data and commands" (OV5, WA1, WA5) stays the default; a general rule language stays off the table without a demonstrated gap. Owner: WA, AR11, content kit. |

### LATER / DELEGATE (proposals, not dispatched)

| Code | Opportunity and owner | Suggested capability and effort | Done check |
| --- | --- | --- | --- |
| IPC61 | **Generator census (enforces IPC56).** A script lists every module exporting a GR1-shaped `generate`, its reader, its tests (seed sweep, golden, save/reload) and its declared budget; prints the non-conforming ones. Companion to IPC31's orphan-row check. Owner: `scripts/`, GR16. | Sonnet low-medium; needs the generator shape detector | The list names every generator with four yes/no columns and a build hash; a new unshaped generator appears as non-conforming |
| IPC62 | **Cycle burn-down ledger (enforces IPC58).** Keep the 205 edges as a dated ledger grouped by strongly connected component with an owner per group; each extraction round removes one group and records it. Builds on the D2 round's five LATER items. Owner: `architecture_baseline.json`, ARCHITECTURE_RULES. | Sonnet medium per group; Luna small for the ledger | The baseline shrinks by a named group per round; the same native journey passes before and after on a rebuilt desktop bundle |
| IPC63 | **One-file `checkJs` pilot (TS10, already ranked 3).** Run `tsc --allowJs --checkJs --noEmit` on one pure leaf such as `src/clear_state.js` on a disposable branch; keep it outside the gate until its errors are useful. Owner: stack doc TS10. | Haiku or Luna low; half a day | The pilot reports its error count and whether any is a real shape bug; no gate change |
| IPC64 | **Pure resolver boundary before any worker or WASM talk (TS12 precursor).** Carve one pure `resolveBatch()`-style function with a fixed large fixture and a benchmark; only then does a worker or WASM spike have a boundary to move. Owner: stack doc TS11-TS12, AR3. | Sonnet medium; one module and fixture | The fixture runs in isolation with identical output to the in-game path; its cost is measured under matched load |
| IPC65 | **Foundation acceptance (mirrors IPC33, IPC51).** Ask Weibao whether IPC56-IPC60 bind as defaults with dials, recorded as one AD line "Foundation changes: generators ship their four lines, receipts state change surface, extraction rounds burn down, stack and DSL grow by measurement and second consumer." | User decision; trivial | The index gains the line, or this round records "proposed" |

Round verification: read `architecture_baseline.json` counts, the stack doc's
round 7 ranking and D2 round, GR1-GR17, AR1-AR16 and the modularity
assessment's P2 and decision sections; generator and test counts are crude
greps, labelled as such. No runtime, tooling or rulebook edit.

## Round 5, 2026-10-26: the fix, ground rules, carry-out queue and optimization

Weibao, 2026-10-26: "how to fix this? creating ground rules? More to consider?
optimization?", then "project.md? other stuff and more? There might be alot of
implementation/coordinators you might need to work with" and "make sure all of
our loose plans is fufiled, and our ideas can be carried out?" "Optimization"
is read as process and token cost, not game performance (the stack doc owns
that). Codes continue from IPC65.

### Evidence

| Code | Finding | Evidence | Consequence |
| --- | --- | --- | --- |
| IPC66 | **Every session loads about 7,100 words of instructions before reading a rule, and the working agreement three times.** `~/.claude/user-preferences.md`, the repo `CLAUDE.md` and `AGENTS.md` each carry the same 1,347-word agreement block; Codex loads it again from `~/.codex/AGENTS.md`. Subagents inherit the same files. | `wc -w` on the auto-loaded files; `grep -c 'Working agreement'` | About 4,000 duplicate words (roughly 5,500 tokens) per session and per subagent, before any task reading |
| IPC67 | **The rule corpus is 47,000 words and the direction corpus 86,000.** Twelve rulebooks plus the index; PROJECT and USER_VISION together. The core digest and the router exist, but no page was short enough to be binding on its own. | `wc -w` | Agents skim; prose rules recur (round 3) |
| IPC68 | **Open plans live in at least five ledgers with no state.** The ideas inventory's consolidated rows, the master plan's M1-M5 and MC rows, the IPC LATER tables, the D2 round's LATER table and the DWF LATER rows each hold dispatchable packets; none records queued, running or landed, and nothing says which coordinator holds which. Today four Claude processes, a Codex app-server and one worktree (`m2-blocked-reasons`) are active on this checkout. | IDEAS_LEFT consolidated rows; master plan; D2 round; `git worktree list`; `ps` | "Loose plans" are rows with an owner but no dispatch state; two coordinators can pick the same row or none can find it |
| IPC69 | **Coordinator entry points did not carry the floor.** Until this round the GM prompt, the implementer template's task packet, the shared worktree practice, `.claude/rules/runtime-code.md` and PROJECT's standing priorities named rulebooks but not a definition of done or a pre-flight. | Files read this round | A coordinator could dispatch a correctly cited brief that still produced a below-floor slice |

### ACT NOW (done this round)

- [GROUND_RULES](../GROUND_RULES.md): one page, read first. Authority (accepted), pre-flight PRF1-PRF8 (proposed), floor FLR1-FLR6 (accepted, AD43), foundation FND1-FND5 (proposed), process (accepted). Registered in the index; linked from AGENTS first line, the index's step 0, PROJECT standing priorities, the GM prompt, the implementer template (PRE-FLIGHT and GATE lines), the shared worktree practice (receipt block) and the runtime rule file. Code prefixes checked unused repo-wide (DP, FL and FN collided with crafting, companion and performance palettes).
- Round 3's pre-flight codes renamed DP→PRF and the index floor labels F→FLR to avoid the collisions above.

### ACCOUNT FOR NOW

| Code | Apply from now on |
| --- | --- |
| IPC70 | **One carry-out queue, with state.** Dispatchable packets from every ledger are listed once in the queue below with owner, model, effort, done check and state (queued, running by whom, landed, dropped with reason). A coordinator that selects a row sets its state before dispatch and clears it on landing; LATER tables elsewhere keep their design detail and point here. Owner: this audit; the master plan's "Immediate next packet" links it. |
| IPC71 | **Check for other coordinators before taking a row.** `git worktree list`, running `claude`/`codex` processes and the linked-sessions list are checked before dispatch; a row marked running is not taken twice. Owner: SHARED_WORKTREE_PRACTICE, GM prompt. |
| IPC72 | **Ground rules first, detail on demand.** A brief cites GROUND_RULES codes and at most the rulebook sections the task touches; it does not paste rulebooks. Owner: AD36 item 5, implementer template. |

### Carry-out queue (2026-10-26)

Order is dependency and value per effort. State is maintained here. Rows marked
"proposed rule" bind only after Weibao accepts them by name.

| # | Packet | Source | Owner on landing | Model / effort | Done check | State |
| --- | --- | --- | --- | --- | --- | --- |
| Q1 | Per-lane build output: `build.js` writes to `BUILD_OUT` and leaves tracked `index.html` and `dist/` alone | IPC13 | `build.js`, SHARED_WORKTREE_PRACTICE | Sonnet medium | Two lanes build at once; `git status` shows no `index.html`/`dist/` change; each page loads its own bundle hash | adopted in primary working tree; concurrent build/browser proof passed; source branch retained unmerged; [adoption](../gm/dispatch/carry-out-queue-2026-10-26/PRIMARY_ADOPTION.md) |
| Q2 | Receipt front matter plus lint | IPC27, IPC30 | `scripts/check_receipts.mjs`, `check:rules` | Haiku or Luna low | A receipt missing `route:` fails; older receipts grandfathered by date | adopted in primary working tree with explicit legacy coverage and new-receipt validation; combined checks in [adoption](../gm/dispatch/carry-out-queue-2026-10-26/PRIMARY_ADOPTION.md) |
| Q3 | Doc lint: absolutes without a dial, "accepted" without a link, diff-scoped | IPC47 | `scripts/`, DESIGN_DEFAULTS_AUDIT | Haiku or Luna low | A new "X never Y" row without a dial fails; existing rows pass | recovered into primary working tree; heuristic diagnostic, not a universal gate; [adoption](../gm/dispatch/carry-out-queue-2026-10-26/PRIMARY_ADOPTION.md) |
| Q4 | MCP route walks of the M1 play cards with bundle hashes, friction into one M2 slice | IPC26, master plan A1, MC14 | m1-route-walk checkpoint | Sonnet medium | Each card reports natural or fixture with a hash; the M2 slice is named | queued (m1-route-walk partially done 2026-10-26) |
| Q5 | Orphan-row and tier check for absorbed content | IPC31, WA6, DWF175 | `check_content_authoring.mjs` or the DWF182 loader | Sonnet medium | Per-world orphan counts with a hash; a new edge-less row is reported | queued, after DWF182 lands |
| Q6 | Description lint (UR70-UR75 floor), emitting the redo list for the later local-AI prose pass | IPC32 | `check_content_authoring.mjs`, UI_RULES | Haiku or Luna low | Count per world; an ID in player text fails | recovered into primary working tree; missing fields now inventoried as unassessed; [adoption](../gm/dispatch/carry-out-queue-2026-10-26/PRIMARY_ADOPTION.md) |
| Q7 | Generator census: every GR1-shaped generator with reader, three tests, budget | IPC61, FND1 | `scripts/`, GR16 | Sonnet low-medium | Four yes/no columns per generator with a hash | adopted in primary working tree; static-signal report, not semantic conformance; branch retained unmerged; [adoption](../gm/dispatch/carry-out-queue-2026-10-26/PRIMARY_ADOPTION.md) |
| Q8 | Cycle burn-down ledger by strongly connected component, one group per extraction round | IPC62, FND3, D2 LATER | `architecture_baseline.json`, ARCHITECTURE_RULES | Luna small ledger, Sonnet medium per group | Baseline shrinks by a named group; same journey before and after | recovered into primary working tree; ledger groups 205 baseline cycle edges, no cycles removed; [adoption](../gm/dispatch/carry-out-queue-2026-10-26/PRIMARY_ADOPTION.md) |
| Q9 | Pre-flight in the brief template and the GM prompt | IPC48 | GAME_IMPLEMENTER_TEMPLATE, GM prompt | docs | PRE-FLIGHT line present; one packet sent back for an empty PRF5 | landed 2026-10-26 (template and prompt lines); the send-back check is pending first use |
| Q10 | Prior-work lookup table for PRF5 | IPC50 | SYSTEMS_REGISTER or the index router | Sonnet low | A "creature processing" brief finds its owner and absorption row in one lookup | blocked: G1 launch exited before work, CLI workspace routing discovery failed; branch codex/q10-prior-work-2026-10-26 at 97e2e45a3 |
| Q11 | Repeatable correction sweep: drop relayed assistant text, group by class | IPC49 | `docs/audits/tools/correction_sweep.py` | Haiku low | Rerun prints only human messages grouped by IPC36-IPC46 | blocked: G1 launch exited before work, CLI workspace routing discovery failed; branch codex/q11-correction-sweep-2026-10-26 at 97e2e45a3 |
| Q12 | One-file `checkJs` pilot on a disposable branch | IPC63, TS10 | stack doc | Haiku or Luna low | Error count and whether any is real; no gate change | blocked: G1 launch exited before work, CLI workspace routing discovery failed; branch codex/q12-checkjs-pilot-2026-10-26 at 97e2e45a3 |
| Q13 | Pure resolver boundary with fixture and benchmark | IPC64, TS11-TS12 | stack doc, AR3 | Sonnet medium | Isolated run matches in-game output; cost measured under matched load | queued, after Q8's first group |
| Q14 | Load one copy of the working agreement: keep it in the home files both tools read, drop the spliced copy from repo `AGENTS.md`/`CLAUDE.md` or the reverse | IPC66 | Weibao's vault template and sync script | user decision; Haiku low to apply | A session loads the agreement once; `grep -c` across the auto-loaded files returns 1 | queued, needs Weibao's choice of which copy stays |
| Q15 | Rule rows: one sentence of rule, history in a dated ledger (AD40, AD23, AD33 first) | IPC28 | RULES_INDEX | Haiku low | The three rows are one sentence each with a history link; `check:rules` passes | blocked: G1 launch exited before work, CLI workspace routing discovery failed; branch codex/q15-rule-rows-2026-10-26 at 97e2e45a3 |
| Q16 | Accept PRF1-PRF8 and FND1-FND5 as binding | IPC51, IPC65 | USER_VISION, RULES_INDEX | user decision | Index register status says accepted with a date | waiting on Weibao |
| Q17 | Master plan A1 then the first M2 slice, then the first dependency-ready M3 pursuit (book worlds and menus first) | master plan, 2026-10-26 direction | incumbent checkpoints | per packet | Each route at the FLR floor with a receipt | A1 in progress elsewhere (m1-route-walk); not taken by this session |
| Q18 | The saved ideas with no runtime: the ideas inventory's consolidated rows and the four missing rulebooks (content rows, institutions, people, time) | IDEAS_LEFT, round 1 | their owners | per row | Each row either enters this queue with a packet or is marked "not selected" with the date | delivered: primary docs/audits/IDEAS_TRIAGE_2026-10-26.md, 224 lines, top 20, 12 spot checks; not committed |

### LATER / DELEGATE (proposals, not dispatched)

| Code | Opportunity and owner | Suggested capability and effort | Done check |
| --- | --- | --- | --- |
| IPC73 | **State column on every LATER table.** Add `state` to the LATER tables in the master plan, D2 round, DWF and this audit, defaulting to "queued" or "not selected"; the queue above is the roll-up. Owner: each table's doc. | Haiku low; mechanical | No LATER row lacks a state; the roll-up matches |
| IPC74 | **Queue check.** A small script lists Q-rows and their states, flags rows "running" with no linked session or worktree, and rows "landed" without a receipt link. Owner: `scripts/`, this audit. | Haiku low | A stale "running" row is reported within one run |
| IPC75 | **PROJECT as a current table.** PROJECT's newest-first prose entries repeat USER_VISION; keep the standing priorities and accepted decisions, and turn the dated entries into one table of current state with a link per row. Owner: PROJECT, needs Weibao's yes because it reshapes the shared owner. | Sonnet medium; docs, zero-loss check | PROJECT under 600 lines with every current link intact |

Round verification: `wc -w` and `grep -c` on the auto-loaded files; `git worktree list` and a process scan; reads of the five entry points before editing them; `git diff --check` and `npm run check:rules` after. Docs and one rule file edited, hunk-only; no runtime or tooling change; no workers dispatched.

## Round 6, 2026-10-26: outcomes, check coverage and finishing the wave

Weibao asked what came from the improved rules, then supplied the earlier
Claude rollout and invoked `more-to-consider`. This is a bounded review of
that rollout against the queue, dispatch ledger and selected tooling sources.
Applicable direction: AD32, AD36, AD41–AD43; WPR18–WPR23 and WPR27 for evidence
and storage. Findings below are proposals, not additional binding rules or an
instruction to launch more workers. No existing queue state is changed here.

### ACT NOW (completed in this review)

Corrected the inherited status in this record: the pasted launch report is a
historical snapshot. The [wave ledger](../gm/dispatch/carry-out-queue-2026-10-26/README.md)
now records G1 complete, Q1/Q2/Q7 committed on branches but unmerged,
Q3/Q6/Q8 blocked with uncommitted work, Q10/Q11/Q12/Q15 blocked before work,
and Q18 delivered as an uncommitted primary document. Branch heads for the
three committed deliveries were inspected; none is merged into the inspected
primary HEAD. Blockers and tests here are ledger-reported unless explicitly
identified as source inspection; no process liveness claim is made.

The demonstrated primary-checkout outcomes are AD43's explicit delivery floor,
the ground-rules entry point and coordinator/template links, a queue with
ownership/state, and the [ideas triage](IDEAS_TRIAGE_2026-10-26.md).
The triage explicitly excludes exhaustive per-row treatment of the inventory's
other sections (its C1). It improves traceability; it does not prove that every
saved idea has been scheduled or fulfilled. PRF/FND remain proposed.

### ACCOUNT FOR NOW

| Code | Evidence and consequence | Disposition |
| --- | --- | --- |
| IPC76 | **Branch delivery is not primary adoption.** Q1/Q2/Q7 have commits, but the ledger says unmerged; primary `package.json` still runs `check_rules_index.mjs` alone for `check:rules`. The rollout therefore has tooling candidates rather than active enforcement of all new checks. | Extend the existing Q-row states with branch delivery, integration and exercised-use evidence when those events occur. Reconcile shared package changes and preserve dirty primary work. This is the existing AD43/AD36 distinction, not another release gate. |
| IPC77 | **A passing lint can omit the intended population.** Q2 branch `ae9fb41a5`, `scripts/check_receipts.mjs`, uses cutoff `2026-10-27` and the immediate parent folder's date. It therefore excludes October 26 wave folders and undated nested receipt folders. Q6's uncommitted `scripts/check_descriptions.mjs` returns early when `description === undefined`, omitting absent fields from its definition population. | Before adopting these checks, compare selection against their intended contract: known eligible receipt paths and known player-facing definitions, with explicit exemptions for records that do not need prose. Report checked, skipped and unknown coverage. The source exclusions are verified; their precise false-negative counts are unmeasured. |
| IPC78 | **Syntax checks cannot establish design quality.** Q7 is explicitly a static census in the ledger. A declared reader/test/budget does not establish that the consumer uses the output correctly. Description field checks likewise cannot establish useful effect-first prose. | Retain a small actual-use sample and the existing natural/fixture distinction beside mechanical results. Calibrate on one known bad and one useful example. Avoid word matching that rejects legitimate in-world constraints or treats a quoted historical absolute as new policy. No additional whole-tree review or universal test is proposed. |

### LATER / DELEGATE (ranked proposals, not dispatched)

| Code | Opportunity, owner and suggested capability | Effort and done check |
| --- | --- | --- |
| IPC79 | **Finish one enabling loop before another tooling wave.** Existing G1/Q1/Q2 ownership: recover the permission/network-blocked artifacts through a working route, then integrate the dependency-ready build-output slice before expanding dispatch. Sol medium for integration judgment; Luna low for bounded recovery. | Small recovery, then scoped integration. Q1 still needs its already specified concurrent-build and page/hash proof; exercise one actual worker output through review/adoption. Keep Q17's book-world work moving when independent. No new tooling milestone blocks gameplay. |
| IPC80 | **Measure whether the rules save corrections.** Extend the existing correction-sweep/Q11 owner with a small dated comparison of the next few comparable deliveries: repeated user correction class, time to first playable result, and verification cost. Luna low for extraction, Sol medium for interpretation. | Small sample, no analytics subsystem. Record sample boundaries and check coverage; distinguish actual human corrections from pasted assistant text, and keep personal log excerpts out of public artifacts. Report whether recurrence improved or remains unknown. Dispatch count and rule count are not success measures. |

Verification: bounded source/ledger reads and branch-head/ancestry inspection;
no runtime, tooling, queue-state, accepted-direction, commit or push changes.
This round does not certify the workers' reported tests or repair their code.

## Round 7, 2026-10-26: primary adoption and the whole request

Weibao: “put into primary checkout, consider the stuff I was talking and if
that even considered or addressed? like general rules and more?” This selects
local adoption of the existing tooling and a request-coverage review. It does
not establish PRF/FND acceptance, publication, or completion of every saved idea.
[Primary adoption record](../gm/dispatch/carry-out-queue-2026-10-26/PRIMARY_ADOPTION.md)
owns source identities, checks and remaining gaps. No new IPC codes or rules
are introduced by this round.

### ACT NOW (addressed in this adoption)

| Original concern | What exists in primary now | What that proves and what remains |
| --- | --- | --- |
| General rules and a bare minimum of quality | GROUND_RULES digest, accepted AD43 floor, proposed PRF/FND prompts and underlying standing rulebooks. Corrected the template's blank-field stop gate and GM/runtime wording that treated proposed prompts as mandatory. | Entry-point and authority reconciliation, not proof of fewer future mistakes. A generator census and description diagnostic are partial mechanical coverage. |
| Coordinators and implementers following the same direction | Master GM, world GM, implementer template, runtime guide, AGENTS, index and PROJECT link the relevant owners. Added the missing world-GM link and corrected master-GM read-order drift. | Newly recovered roles can find the floor, source authority and current queue. Existing running chats are not automatically refreshed by a file edit; their next recovery must read the current owners. |
| Loose plans and ideas being carried out | Q1/Q2/Q3/Q6/Q7/Q8 adopted as working-tree code; active queue cells link this receipt. Q18 triage remains linked, with its original C1 coverage exclusions intact. | A queue is traceability, not fulfillment. Book-world Q17 keeps its incumbent owner. The nested inventory outside Q18's selected sections is still untriaged at that granularity. |
| Optimization rather than another layer of process | Concurrent isolated build output; generator scan caches source/test reads and does not run the census when imported for its detector test; reports reuse existing owners. | Less build contention demonstrated. The earlier duplicated instruction loading has not been fixed, and no net token/time saving is measured here. |
| Enforcement that catches the original mistakes | Receipt validator runs with check:rules; includes newly created same-day/nested receipts and reports legacy skips explicitly. Description inventory accounts for absent fields. Doc-slip diagnostic includes untracked Markdown. | Shape/selection coverage is tested. Writing quality, user authority and real consumer behavior still need scoped judgment and existing gameplay proof. Doc lint remains optional because it produces heuristic matches in ordinary procedural/report prose. |

Round-6 clarification: the original Q2 prompt explicitly requested the October
27 cutoff. The worker followed its assignment. IPC77 identified a selection
limit, not a failure to follow that brief; this adoption changes the selection
policy for new receipts. Existing receipts are kept in a fixed named legacy
inventory instead of silently excluded by a date guess.

### ACCOUNT FOR NOW

Use the existing checks for the claim they support. The receipt schema checks
fields; it cannot establish that a browser run happened. Generator signal
matches do not establish three successful behavioral tests. Missing description
fields are an applicability-review inventory, not 1,959 confirmed prose defects.
The cycle ledger describes baseline groups and suggested responsibility areas;
it assigns no human/agent owner and demonstrates no reduction in cycles.

A local BUILD_OUT preview links current static assets and optional private pack
files. Record input identity for its evidence; it is not an immutable release
snapshot. Its isolated fresh browser contexts do not touch the player's app.

### LATER / DELEGATE (remaining work, not launched)

| Priority | Existing owner and next useful work | Capability / effort / done check |
| --- | --- | --- |
| First | Q11 / IPC80: verify the correction corpus excludes pasted assistant text, then compare a small set of comparable deliveries. Treat the earlier 395-message result as the prior sweep's output, not 395 independently verified human corrections. | Luna low extraction, Sol medium interpretation; small. Exact sample boundary, genuine-human/relay classification and recurrence/time comparison; no personal logs published. |
| Second | Q18 and the ideas inventory: continue triage of the explicitly excluded nested families when selecting their relevant work, retaining proposal/selected/implemented/proven distinctions. | Sol medium, bounded by one relevant family. Original idea IDs map to existing owner, execution state and next useful consumer; proposals do not silently become selected tasks. |
| Third | Q14: reduce duplicate instruction loading at the canonical vault/sync owner, rather than hand-edit generated repo copies. Preferred proposal is a single generated portable agreement per client plus repo-specific rules here, after checking both clients' loading paths. | Luna low inventory, Sol medium routing judgment; small. Both Claude and Codex retain the agreement and project rules with measured reduction; no cross-project sync changes made in this primary-only adoption. |

The per-lane build and report commands can support current gameplay work; these
follow-ups are not prerequisites for the next book-world slice. PRF/FND status
remains proposed without another repetitive acceptance question.
