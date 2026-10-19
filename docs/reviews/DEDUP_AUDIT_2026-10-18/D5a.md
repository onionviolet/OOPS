# D5a: docs/gm (excluding docs/gm/dispatch) duplicate and consistency audit, 2026-10-18

Area: `docs/gm/` top level (about 33 .md/.json files, 7 GM prompts, README, SHARED_WORKTREE_PRACTICE, PROJECT_LOG) plus all subfolders except `dispatch/` and every `private/` folder. 2,593 files on disk, 1,303 outside `private/`, 1,284 tracked. Read-only audit; this is the only file written.

## Summary

| Severity | Count |
| --- | --- |
| high | 2 |
| med | 9 |
| low | 7 |
| total | 18 |

By type: dup 7, contradiction 5, stale-link 3, orphan 1, rule-violation 2.

Method: md5 of every file, paragraph-hash and line-set overlap across all .md, a relative-link and anchor resolver over every non-private .md (with `:line` suffixes stripped), tracked-versus-ignored check of link targets, inbound-reference grep for orphans, and targeted reads. Labels: VERIFIED means I checked both sides; SUSPECTED means one side or the intent is inferred.

Link results (non-private, non-dispatch .md): 129 unresolved relative links. 44 are in one file (F1), 78 are in frozen history snapshots whose relative paths were not rewritten after the move (F11), 7 are live (F12). The 35 `file.js:123` style links all resolve once the line suffix is stripped. No file outside `docs/gm` links to a missing path under `docs/gm` (excluding dispatch).

## Findings

### D5a-F1 (dup, med, VERIFIED): recovered engine guide is a near-copy of the live guide, with 44 dead links
- `docs/gm/book-world-completion-2026-10-06/RECOVERED_ENGINE_AUTHORING.md` (68,278 B, 272 lines) versus `docs/ENGINE_AUTHORING.md` (75,354 B, 290 lines). `diff` shows 5 changed lines (116, 165, 168, 182, 191, all link targets) and an appended section at lines 273-290 of the live file. Everything else is byte-identical. The brief's "copy under ENGINE_AUTHORING.md" is this file; no file with the plain name exists under docs/gm.
- The recovery receipt `book-world-completion-2026-10-06/AUTHORING_RECOVERY.md` says the file preserves the exact bytes before an accidental JSON overwrite. That job is finished; the live guide has since absorbed it.
- The copy's links are relative to `docs/`, not to its new folder, so 44 resolve nowhere (`../PROJECT.md#...`, `ENGINE_EXPANSION.md#...`, `PLAYTEST.md#...`; lines 37, 41, 57, 116, 165, 168, 182, 191, 199, 227). The five rewritten lines also point at `../PROJECT.md#...` anchors that moved to `gm/PROJECT_LOG.md` in the live guide, so the copy is both stale and unreadable.
- Why it matters: two authorities for engine authoring rules; an agent grepping a rule can land in the older one.
- Fix: keep only the recovery receipt and the SHA256 table in `AUTHORING_RECOVERY.md`. The bytes are in git history (the receipt names both digests). Delete the copy or move it under a `history/` folder with a "frozen, links not live" banner. Owner: `docs/ENGINE_AUTHORING.md`.

### D5a-F2 (dup, med, VERIFIED): "before" snapshots embed full copies of PROJECT.md and the plan, again and again
- 57 tracked files whose names say BEFORE, HISTORY, SNAPSHOT or ORIGINALS total 4.09 MB. The biggest embed canonical docs as JSON strings:
  - `book-world-player-agency/BEFORE_STATE.json` (563 KB)
  - `book-world-completion-2026-10-06/BEFORE_CANONICAL.json` (409 KB), `audit-implementation/remainder/BEFORE_CANONICAL.json` (374 KB), `world-completion-2026-10-06/BEFORE_CANONICAL.json` (370 KB), `home-social-base-2026-10-07/BEFORE_CANONICAL.json` (227 KB)
  - `audit-absorption-2026-10-07/history/BEFORE_FINAL_OWNERS.json` (308 KB), `multi-world-paths-2026-10-07/BEFORE_OWNERS.json` (220 KB)
  - `world-implementation/history/REVIEW_STATE_BEFORE_SKILL_DISCOVERY_2026_10_05.md` (352 KB, 51% line overlap with `world-implementation/IMPLEMENTATION_PLAN.md`)
  - `audit-absorption-2026-10-07/history/BEFORE_RECONCILIATION_CURRENT.md` (130 KB)
- Parsed the four BEFORE_CANONICAL files: the embedded `PROJECT.md` (142-162 KB), `IMPLEMENTATION_PLAN.md` (111-115 KB) and `RUN.json` (90-102 KB) overlap 97-100% line for line across files.
- Why it matters: roughly 2.5 MB of the same old PROJECT.md text, searchable by grep, each copy a stale "accepted decision" source. Git already holds each state.
- Fix: replace each with a one-line receipt (commit SHA plus SHA256 of the pre-state), unless the digest check in a delivery receipt reads the bytes. If a validator reads them, leave a single shared archive. Owner: git history, with receipts in each folder's `BUILD.json`/`DELIVERY.md`. SUSPECTED that no validator reads them: only `world-completion-2026-10-06/BEFORE_CANONICAL.json:1097` mentions another snapshot by path; I did not check scripts outside docs/gm.

### D5a-F3 (dup, med, VERIFIED): twelve ASSIGNMENT.md files repeat the same boilerplate
- `docs/gm/world-implementation/second-pass/{experience,regions,powers,combat,bases,items,society,timelines,foundations,authoring,runtime-efficiency,token-efficiency,engine-absorption}/ASSIGNMENT.md` (12 hash-identical paragraphs each, 4.7-5.0 KB per file). Identical paragraphs: the 2026-10-04 user ask, "Authority and exclusive scope", "Execution: keep configured top-level settings", "Return: a decision summary around 500 words...", "Acceptance:" and "Read additional files only when...". About 3.1 KB per file is shared; only the "Role:", "Boundary" and "Targeted starting inputs" sections differ.
- `second-pass/missing-feature-audit/INPUT_SNAPSHOT.json` and `second-pass/absorption-incorporation/INPUT_SNAPSHOT.json` are byte-identical (22,881 B).
- Why it matters: the GM prompt rule is "link, not copy". A change to the return format has to be made in twelve places, and they have already been frozen at different times.
- Fix: put the shared block in `second-pass/README.md` (or a new `COMMON.md`), and have each ASSIGNMENT link to it and keep only role, boundary and inputs. Point the second INPUT_SNAPSHOT at the first. Owner: `second-pass/README.md`.

### D5a-F4 (dup, med, VERIFIED): feature-wave deliveries, resume joins and checkpoints copy one another
- `feature-wave/features/DELIVERY.md` and `feature-wave/features/DELIVERY_REFINEMENT_11aaa9cbfc69.md`: 67% shared lines; paragraphs at 662, 670 and 381 characters are identical (for example "One durable publisher still owns native inventory, money, gear...").
- `feature-wave/ink/DELIVERY.md` and `feature-wave/legibility/DELIVERY.md`: five identical paragraphs (723, 512, 414, 295 characters, among others).
- `feature-wave/{ink,legibility,repositories}/RESUME_JOIN.md`: the "Fresh source-only checks: Node syntax, esbuild memory bundles..." (563 chars) and the "Parent /root transferred the interrupted predecessors..." (306 chars) paragraphs appear in all three; 36-50% line overlap.
- `feature-wave/features/book-world-subtleties/CHECKPOINT.md` and `.../nested-campaign/continued-life/BOOK_CHECKPOINT_BEFORE_11aaa9cbfc69.md`: 60% overlap, two identical paragraphs (691 and 679 chars).
- `feature-wave/features/society/CHECKPOINT.md` and `.../destination/CHECKPOINT.md`: two identical paragraphs; `feature-wave/backlog/CHECKPOINT.md` and `DELIVERY.md` share a 470-char "Final static integration repair" paragraph.
- Why it matters: DELIVERY, CHECKPOINT and RESUME_JOIN are meant to be different views (output, resume state, join) but carry the same claims, so status drifts between the copies.
- Fix: DELIVERY keeps outputs; CHECKPOINT keeps resume state and links to DELIVERY for the rest. Snapshots named `*_BEFORE_*` are history and should say so on line 1. Owner per folder: `DELIVERY.md`.

### D5a-F5 (dup, low, VERIFIED): two life-sim folders carry the same intake and assignment text
- `life-sim-experience-2026-10-07/NOVEL_SOURCE_INTAKE_2026-10-08.md` and `life-sim-foundation-2026-10-07/NOVEL_SOURCE_INTAKE_2026-10-08.md` (1,078 B each) differ by one word ("experience" versus "foundation", line 3). Neither file name is referenced anywhere else in the repo.
- `life-sim-experience-2026-10-07/ASSIGNMENT.md` and `life-sim-foundation-2026-10-07/ASSIGNMENT.md` share the "Read first: AGENTS.md, PROJECT.md, [the north-star doc]..." and "Dispatched 2026-10-07 by Claude Code..." paragraphs.
- Fix: keep one intake file in a parent location and link from both, or keep the two with a link to `dispatch/novel-wave-2026-10-08/ASSIGNMENT.md` only. Owner: that dispatch ASSIGNMENT.

### D5a-F6 (dup, low, VERIFIED): frozen prompt originals duplicate each other and git
- `history/2026-10-06-iteration-originals.md` (118,217 B) and `history/2026-10-13-prompt-slim-originals.md` (41,725 B): 81% of the smaller file's lines occur in the larger (both contain a verbatim `GAME_MASTER_PROMPT.md`). Both are verbatim from git history and have 0 inbound links (README links the first only).
- Fix: keep one, or neither with commit SHAs. Owner: `docs/GAME_MASTER_PROMPT.md` plus git.

### D5a-F7 (contradiction, med, VERIFIED): README tells readers a historical file is current policy
- `docs/gm/README.md:79` says [GM_CAPACITY_AND_SUCCESSION](dispatch/GM_CAPACITY_AND_SUCCESSION.md) "is the current human-authorized policy". That file's own banner (line 3) says "Historical (marked 2026-10-13)... not current policy" and points to GAME_MASTER_PROMPT's "Delegation and succession". The current budget policy is `docs/AGENT_USAGE_RULES.md` (AU1-AU15 / AD37: two concurrent generated agents by default), which the old file's "four-role cap removed, six lanes" wording does not reflect.
- Same README, other stale lines: `:27` "Latest finite runtime delivery, 2026-10-06" (later deliveries exist: 2026-10-07 absorption and book-world waves, 2026-10-15 quiet-continuation); `:41` "current five deep source families" (the Skyrim/Fallout/Elden Ring deprioritization is appended, but 15 `docs/worlds/*/` folders now hold all eight owner files, so "five" and the "Chat 01a10487... completed" table are 2026-10-04 snapshots); `:39` ORIGIN_SCENARIO row "Prompt ready; master directly authors" (no later status).
- Why it matters: the README is the entry point of the role system.
- Fix: rewrite the README as a short index: roles table linking prompts and owner files, no chat IDs, no dated delivery paragraphs; link AGENT_USAGE_RULES for capacity. Owner: `docs/GAME_MASTER_PROMPT.md` for roles and `docs/AGENT_USAGE_RULES.md` for capacity.

### D5a-F8 (contradiction, med, VERIFIED): handoff says "nothing committed" and "not yet quoted" but both are false now
- `docs/gm/OVERARCHING_DIRECTION_HANDOFF_2026-10-15.md:8` "Nothing is committed. Both docs below are untracked." The file itself is tracked, and so are the two owners it links (`docs/OVERARCHING_DESIGN_CORE_AUDIT_2026-10-15.md`, `...METHOD_PROMPT...`, VERIFIED by link resolution).
- `:19-20` says the quotes "Lets ciscuss, but we need to consider the gameplay representations..." are not yet quoted in USER_VISION. They are, at `docs/USER_VISION.md:3277`.
- The file calls itself a handoff to a future session, but later sections (line 213 onward) record the work done; an agent reading line 8 first can redo it.
- Fix: delete the first-paragraph claims or mark them "as of the handoff, superseded below". Owner: the file's own "Current resume" section.

### D5a-F9 (contradiction, med, VERIFIED): SHARED_WORKTREE_PRACTICE disagrees with AGENTS on push, and is half incident log
- `docs/gm/SHARED_WORKTREE_PRACTICE.md:57` "Push waits for Weibao's yes" and `AGENTS.md:233` the same, but `SHARED_WORKTREE_PRACTICE.md:67-68` "Merge those that pass their gates... and push under the existing push authorization". USER_VISION records only "Push still waits for a yes" (`:282`); no standing push authorization is recorded for merge-before-dispatch. One of the two lines is wrong.
- `:72` "isolated index (R15 G10 method)" has no resolvable definition (G10 appears only in `dispatch/ui-foundation-2026-10-15/NEXT_PARTS_2026-10-15.md` and `R14_FOLLOWUP_CONSIDERATIONS.md`).
- Lines 100-end (about 70 lines) are a one-off 2026-10-17 cleanup log. Its "Remove on yes" rows (`:156-157`) were executed later in the same file ("Removal on Weibao's yes... all 25 removed"), so the table now reads as open work. The 37-versus-36-versus-17 worktree counts exist only in prose.
- `runs/launch.py` (`:79`) names no canonical file: 41 tracked `launch.py` copies exist (all under `docs/gm/dispatch/`, 22 distinct hashes). This overlaps D5b's area; the owner decision belongs there.
- Rules that AGENTS.md restates (zero-loss check, pathspec commits, no stash/reset/force, no `pkill -f`) agree; no wording drift found there. Also 3 of those rules are copied again into dispatch briefs (`pkill` appears in `modular-seams-2026-10-16/BRIEF.md`, `feature-scout-2026-10-14/SESSIONS.md`, `ui-foundation-2026-10-15/COMMON.md`, and others), which is cross-area.
- Fix: change `:67-68` to "push only on Weibao's yes" (or record the authorization in USER_VISION and cite it); move the cleanup log to `docs/gm/history/` or `docs/reviews/` and leave a two-line link; mark its tables "executed". Owner: AGENTS.md for the short rules, this file for recipes only.

### D5a-F10 (contradiction, med, VERIFIED): LOTM plan keeps the AR code that RULES_INDEX says to rename
- `docs/RULES_INDEX.md` tension T7 says: LOTM planning docs use AR1-AR11 for audit rules, ARCHITECTURE_RULES owns AR1-AR16; "Cite the LOTM set as 'LOTM AR' with its link."
- `docs/gm/LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md` still uses bare `AR1`...`AR10` in the table at `:362-372` and at `:481` ("AR1-AR10"); `LOTM_INITIATION_DESIGN_DISCUSSION_2026-10-15.md` has 4 more. No "LOTM AR" string exists in either file.
- Why it matters: Rulebook citation by code (AGENTS.md) now hits the wrong rule.
- Fix: rename to `LOTM-AR1..` in both files (document-only). Owner: the LOTM plan.

### D5a-F11 (stale-link, low, VERIFIED): frozen snapshots moved with unrewritten relative links
78 unresolved links in files that are copies of older files placed into history or evidence folders:
- `causal-endings/evidence/CHECKPOINT_BEFORE_SOURCE_RELEASE_2026_10_06.md` (16)
- `history/2026-10-13-prompt-slim-originals.md` (14; for example `:29,144,206` link `gm/dispatch/GM_CAPACITY_AND_SUCCESSION.md`)
- `feature-wave/features/nested-campaign/continued-life/WORLD_IMPLEMENTATION_CHECKPOINT_REV13.md` (12), `NESTED_CHECKPOINT_BEFORE_11aaa9cbfc69.md` (7), `BOOK_CHECKPOINT_BEFORE_11aaa9cbfc69.md` (4)
- `audit-absorption-2026-10-07/history/CHECKPOINT_REVISIONS_10_11.md` (12), `BEFORE_RECONCILIATION_CURRENT.md` (7), `CHECKPOINT_STARTUP_TO_ACS_SELECTION.md` (6)
- Also `WORLD_IMPLEMENTATION_CHECKPOINT_REV13.md` is a snapshot of `world-implementation/CHECKPOINT.md` stored under feature-wave (header "Canonical planning and implementation dispatch checkpoint", 32 differing lines from the live one), so it is also mis-filed.
- Fix: a banner "frozen copy; links are relative to the original location" on each, or rewrite links once. Low because they are labelled history.

### D5a-F12 (stale-link, low, VERIFIED): live dead links
- `observation-power/trailblaze/REPORT.md:77` and `CHECKPOINT.md:17`, and `world-implementation/second-pass/runtime-efficiency/DEPENDENCIES.md:35-36` (3 links), point to `/Users/weiwei/.codex/visualizations/2026/10/04/01a1056b.../*.json`; that directory does not exist.
- `world-implementation/second-pass/authoring/DEPENDENCIES.md:15` anchors `worlds/original-frontier/REPORT.md#exact-integration-work-to-include-in-the-combined-plan`; the headings now are "Concrete delivery", "Source reuse and actual gaps", and so on.
- `d1-alloy-equipment-2026-10-07/fixture/README.md:3` anchors `../CHECKPOINT.md#A1-single-remaining-playable-acceptance-gate-for-weibao`; the heading is "A1 remaining in-browser acceptance steps".
- Fix: drop the three machine-local links (keep the numbers in the text if they matter), repair both anchors.

### D5a-F13 (stale-link, med, VERIFIED): D1 checkpoint cites 19 log files that git ignores
- `docs/gm/d1-alloy-equipment-2026-10-07/CHECKPOINT.md:39,40,42,43,69,79-81,104,116,118-120` link `*.log` files; `.gitignore:28` (`*.log`) ignores all of them (also `non-factorio-absorption-2026-10-07/FINAL_BUILD.log`). They exist on this disk only. On a clean checkout or the public push, the evidence the checkpoint relies on (test counts, build SHA) is absent.
- Broader: 311 tracked-.md links in the area point to untracked targets; 74 to `docs/research/novels` (intentional, gitignored), 122 to `private/` (intentional by the sealed rule), and the remaining 115 are the `.log` links above plus `private/` JSON that tracked closure docs cite.
- Fix: for D1, either commit the 19 logs with `git add -f` (they are small) or copy the pass/fail line into the checkpoint. The novels and private links are by design.

### D5a-F14 (contradiction, med, VERIFIED): D1 checkpoint and PROJECT.md disagree on whether the browser gate passed
- `d1-alloy-equipment-2026-10-07/CHECKPOINT.md:123-125` ("A1 remaining in-browser acceptance steps") says the repair is "implemented-unverified in a browser" and lists steps A1a-A1d to run. Lines 132-146 of the same file ("Browser acceptance run, observed by Claude Code, 2026-10-08") record A1a-A1e as passed in a real browser.
- `PROJECT.md:1200` says D1 "has automated evidence with its browser gate open".
- The true state per the file's last line: Claude's browser run passed; only Weibao's human balance acceptance remains.
- Fix: retitle the A1 section "Superseded: steps run on 2026-10-08" and reword PROJECT.md:1200 to "human balance acceptance open". Owner: this CHECKPOINT.

### D5a-F15 (contradiction, med, VERIFIED): checkpoints still claim live writers, servers and sessions
- `nethack/CHECKPOINT.md:7,15,21` "Current shared writer: Features/Book-world GM 01a10dc5..., verified active"; "Features01a10dc5 is active and acquired the shared integration". Dated 2026-10-06. Later checkpoints show it released (`feature-wave/features/DELIVERY.md` records the final integration).
- `world-implementation/engine/CHECKPOINT.md:11` "Current static review server http://127.0.0.1:18628/, exec session14470... serves matching final bundle" (2026-10-05).
- `book-world-completion-2026-10-06/MOL_CHECKPOINT.md`, `home-social-base-2026-10-07/CHECKPOINT.md` and the `second-pass/*/CHECKPOINT.md` files (statuses like "runtime remains held", "pending assigning-master review") are also 2026-10-04..07 states; the held runtime was delivered in `world-implementation/frontier-runtime/` on 2026-10-05.
- Why it matters: an agent resuming from these will "inspect the live writer" that is gone, or treat released runtime as held.
- Fix: a one-line "Historical as of <date>; live status in PROJECT.md and <folder>/DELIVERY.md" header on each completed-wave CHECKPOINT; do not edit the body. Owner: PROJECT.md for status.

### D5a-F16 (rule-violation, low, VERIFIED): "short summary" claim about PROJECT.md is false now
- `docs/gm/PROJECT_LOG.md:3` and `CLAUDE.md:10` say the root PROJECT.md is a "short summary". It is 1,496 lines and 112,830 bytes (PROJECT_LOG: 167,840 B).
- Fix: change PROJECT_LOG:3 to "archived on 2026-10-07; PROJECT.md has grown again, see its queue navigation". Owner: PROJECT.md.

### D5a-F17 (rule-violation, low, SUSPECTED): blanket "never" in the LOTM plan
`LOTM_INITIATION_IMPLEMENTATION_PLAN_2026-10-15.md:163,176,187,285` ("Navigation is never...", "never on render", "Sleep never removes...", "never refund real performed work"). Most are engine-transaction invariants (defensible); `:285` and `:287` read as design absolutes without a default/dial/reason. No "accepted" mislabeling of agent proposals found in the top-level files (grep of `accepted ...` patterns hit only status-correct uses). Fix: add the in-world reason or label as "first-slice default". Owner: the LOTM plan.

### D5a-F18 (orphan, low, SUSPECTED): 30 tracked .md files have no inbound reference
Basename grep over all tracked md/json/js/py (excluding novels) finds 0 hits for: 22 under `cross-audit-reconciliation-2026-10-15/` (`CLOSURE_RETURN_*.md` x5, `CLOSURE_ROOT_FINDINGS.md`, `DESIGN_EXTRACTION.md`, `FOUNDATION_EXTRACTION.md`, `RESEARCH_EXTRACTION.md`, `T02_*_RETURN.md` x6, `T03_*_RETURN.md` x5, `T04_*_RETURN.md`), `causal-endings/evidence/DEPTH_IMPLEMENTATION_BLUEPRINT.md`, `coordination/customization-c3-return-2026-10-12.md`, both `NOVEL_SOURCE_INTAKE_2026-10-08.md`, and `life-sim-foundation-2026-10-07/{EXPERIENCE_INTERFACE_REQUEST,HEIR_HOOK_RECIPE,PASS_F_PROPOSAL,RECORD_CONTRACT}.md`. The cross-audit ones are probably indexed by gitignored `private/REPORT_DISPOSITIONS.json`, which I did not read; the others are plain orphans. Also 71 more tracked md have only one reference (mostly SEMANTIC_* in the cross-audit folder).
Fix: add the orphans to their folder README or archive index; no deletion.

## Scripts (checked, no action)
Line-set overlap between sibling helper scripts is low (non-factorio `leaf_checks.mjs` x4: 6-16%; `browser_proof.cjs` x4: 4-16%; `air-wider/p1-4-browser.cjs`: 0-17%; `build_snapshot.mjs` pairs 17%). They share boilerplate (launching a browser, hashing) but not copied logic worth extracting. I did not run them or check that the `src` APIs they call still exist (SUSPECTED stale).

## Cross-area notes
- `docs/ENGINE_AUTHORING.md` carries the same wrong-relative-path class: its `ENGINE_EXPANSION.md#...` and `PLAYTEST.md#...` links resolve from `docs/`, so only the copy in F1 is broken; no action there.
- `private/` copies noticed by path only (not read): `cross-audit-reconciliation-2026-10-15/private/UA2_EVIDENCE_2026-10-16/current-runtime/docs/gm/feature-wave/ink/*` is a byte-identical mirror of the tracked `feature-wave/ink/*` (about 25 files, same md5), plus a mirrored `dist/bundle.js`. The private tree is 356 MB.
- `launch.py` (41 tracked copies, 22 hashes) and the repeated `pkill -f` rule in dispatch briefs belong to D5b.

## Coverage
Examined: all 1,303 non-private files under `docs/gm` outside `dispatch/` by hash and name; all .md for links, anchors and tracked-versus-ignored targets; all .md for paragraph and line duplication; the top-level README, SHARED_WORKTREE_PRACTICE, IDEABOARD_HANDOFF, MODEL_ROUTING_CODEX, OVERARCHING_DIRECTION_HANDOFF, LOTM plan and discussion, d1-alloy-equipment CHECKPOINT and fixture README, nethack and world-implementation/engine CHECKPOINT headers, cross-audit README/RESUME, the six GM prompt headers; history folder; `docs/AGENT_USAGE_RULES.md`, `docs/GAME_MASTER_PROMPT.md`, `docs/RULES_INDEX.md` T-table and `AGENTS.md` for cross-checks. Inbound-reference grep over all tracked md/json/js/cjs/mjs/py.

Skipped or partial: `docs/gm/PROJECT_LOG.md` (grepped and link-checked only, not read); every `private/` folder (hashed at path level only, contents not read); `docs/gm/dispatch/` (D5b); the JSON evidence files (807, only md5-compared); the 114 CHECKPOINT.md files were scanned by status line and keyword, not read one by one, so more stale-writer claims like F15 likely exist; the 70 KB `SEMANTIC_T11_EXTRA_AUDITS_C.md` and the other SEMANTIC_* files were not read; sealed-secret leakage was not systematically checked (I read no secret truths and saw none quoted in the files I opened); AR1-AR16 does not apply (no src in this area); I did not execute or verify the helper scripts.

## Not changed
No file was edited, staged, committed, stashed, built or run other than this report. Scratch scripts and corpus files were written only to the session scratchpad directory.
