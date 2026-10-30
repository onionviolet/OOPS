# Sonnet wave to Monday reset (2026-10-29 22:40, proposal)

Weibao: "send a wave of sonnet chats to work on implementation and also on pushing forward in absorbing a book in its entirety; about 50% weekly usage left, finish by Monday at 1." Proposal only; nothing is launched until he says go. Codes: AU1-AU15 (AD37), AD36, AD41, AD43.

## Budget (AU2, AU7)

- Meter at start [S]: weekly all-models **38%**, resets Mon 2026-11-02 12:59 EST; 5-hour **28%**. Shared with mythcorp, the vault and three live YAIRPG sessions.
- Proposed ceiling for this wave tree: **weekly 80%** (+42 points), leaving about 20 for other projects and Monday morning. Check `get_usage` between lanes; stop launching at 75%.
- 5-hour pacing: at most 3 Sonnet lanes at once; pause new launches when the 5-hour window passes 70%.
- Cost per Sonnet implementation lane is unmeasured. Inference from the reading table (about 1.3M haiku tokens per weekly point): one slice lane is likely 3-8 points. So the ceiling buys roughly 6-10 lanes. The pilot measures it.

## GPT (Codex) limits: every lane brief carries this section

Weibao, 2026-10-29: "Make sure the sonnet knows how to use my gpt limits." Codex runs on his ChatGPT subscription ($0 API) and was at **26%** at plan time (`codex_lane.mjs preflight`, 22:55). It is the bigger pool, so Sonnet lanes coordinate, review and integrate, and push bulk work to Codex.

**What goes to Codex**

| Work | Model, effort | Why |
| --- | --- | --- |
| Source extraction, enrich-in-place, census or rules rows over a fixed range, sweeps, lookups | `gpt-6-luna`, medium (AU5; the enrich route was proven on all 72 volume 1 shards) | Free, and good enough when the shape is fixed |
| Drafting a bounded code change with a named file set and a focused test | `gpt-6.1-sol`, medium | Judgment needed; saves Sonnet tokens |
| Anything else mechanical | `gpt-6-luna`, low | Default for Codex subagents |
| `gpt-6-astra` | Only after an advisor second opinion, reason stated in the brief | Global rule |

**What stays on Sonnet:** splitting work into briefs, reading results, the spot checks, merge decisions, and anything touching shared docs (USER_VISION, PROJECT, IDEA_INDEX).

**How to run a Codex lane** (`scripts/codex_lane.mjs`, runbook: [Luna lane requirements](../protagonist-life-2026-10-27/READING_LUNA_LANE.md#requirements-reuse-for-any-reread-or-new-book))

1. `CODEX_LANE_MAX_USED=85 node scripts/codex_lane.mjs preflight` must print PASS. Run it before each launch batch.
2. Write the brief to a file: exact files it owns, exact source range or prompt file, output path, done check, "no commits, no web, no edits outside owned files".
3. `node scripts/codex_lane.mjs launch <lane-id> <brief.md> --model gpt-6-luna --effort medium`. Launch it from the Sonnet lane's own worktree, since Codex works in the launch directory. Lane ids must be unique, so prefix them `sw-<lane>-`.
4. `node scripts/codex_lane.mjs status` lists PID, exit state and last message (records live in `~/.codex/lanes/protagonist-life-2026-10-27/<lane>/`). Don't poll in a loop. Check when you would otherwise wait, and stop a lane by its PID only.
5. **Never trust a lane's one-line report.** Run the real check: `luna_enrich.mjs check`, `luna_lane.mjs ingest`, the focused test, or `git diff` on its owned files. Then confirm the model name in its session file.
6. Codex cannot write `.git`. The owning Sonnet lane commits Codex's files.
7. Use `launch`, never `resume`. `resume` takes no model option and fell back to another model once (TG1).

**Limits**

- At most 4 Codex lanes running at once across the whole wave. They share one window with Weibao's own Codex use.
- Stop launching at Codex 85%. Log Codex % beside Claude % in the ledger.
- Book text goes to Codex only under the existing private-output rule: prompts and replies live in gitignored `private/`, and tracked files carry ids, counts and grades only.

**Effect on the Claude budget:** when Codex drafts and Sonnet reviews, a slice should cost Sonnet maybe a third of doing it alone [I, unmeasured]. The pilot records both meters per lane.

## Which book, and what "absorb" means here

Default: **LOTM volume 1**, the book the lead's run already uses. It is fully read (ch 1-213, schema 1.4 people, rules, texture on all 72 shards; whole-book merge `m4-whole-book-2026-10-29/`). Absorbing it now means turning paid rows into game, not reading again.

- Sonnet chats do **not** read raw text. An agent reader costs 130-170k tokens a shard against about $0.02 by batch (READING_STATUS).
- Reading forward on the free route: Luna over a fixed request shape. Use enrich-in-place and the people, rules and texture passes, and pilot 3 shards before a range. The scenes pass stays Haiku batch, because Luna's scenes are about half as fine.
- Reading forward on the paid route: the Nov 1 API credit via the pending `plans/overnight_2026-11-01-*.json` files. That needs Weibao's go phrase per run file.
- The 10 grade-C volume 1 scene shards get the free script set-aside, folded into L2.

## Lanes

Each implementation lane gets its own worktree (AD41 allows it for overlapping writers), runs only its focused test file, and does not build `dist/`. The integrator alone builds, runs full `npm test`, `check:arch`, `check:rules`, and the browser floor (AD36, AD43).

| Lane | Sonnet does | Codex does | Files (owner) | Done check |
| --- | --- | --- | --- | --- |
| L0 Integrator | Merge, full gates, browser floor at desktop viewport | none | `dist/`, merge commits | Each merged slice at the AD43 floor or recorded "implemented, below floor" |
| L1 UI freeze | Diagnose, fix, browser check | none (needs the browser) | whatever the cause touches | Fresh-origin browser run reaches the LOTM panel; regression test. **Skip if "General UI improvements" already owns it.** |
| L2 Absorption ledger | Spec the coverage script, review it, rank the missing list | Sol medium writes `coverage_*.mjs`; Luna low runs the grade-C set-aside | `scripts/lead_run/coverage_*.mjs`, `LEDGER.md` here (ids and counts only) | Ledger reproducible; ranked top 20 feeds wave 2 |
| L3 Schedules (GM1) | Design the seam, review, commit | Luna medium pulls Tingen routine rows into a data file; Sol medium drafts the module and test | new schedule module + LOTM pack rows | Focused test: person absent outside window, present inside |
| L4 Rites and potions (GM17) | Pick rows, review, commit | Luna checks each row against `cite_paragraphs.mjs` output; Sol drafts recipe rows | `lotm_formula_rows.js`, ritual data | Focused test on one recipe from cited rows |
| L5 Places and services (GM19) | Pick cells, review, commit | Luna fills cells from the affordance matrix with locators | LOTM place data | Focused test: one new service usable at its place and hours |
| L6 Read forward (free) | Write the plan, grade results, update READING_STATUS | Luna medium: 3-shard pilot of people, rules and texture on the next unread text, then the range if it grades B or better | private `lead-run-*` folders | Pilot grades and name accuracy recorded; no tracked book text |

Wave 2 (from L2's ranked list, after the pilot): GM18 dated calendar and news, GM3 who-knows-what, GM2 attitudes with basis, GM5 opening hours.

## Go and overlap check (2026-10-30 00:45)

Weibao: "Go ahead, watch for overlap with other concurrent chats." The overlap check changed the pilot:

| Found | Effect |
| --- | --- |
| UI freeze fixed in `5b9a449bb` by "Book indexing and re-read strategy" | **L1 dropped** |
| "Overnight LOTM absorption coordinator (Sonnet)" (`local_ab64a973`) already runs the LOTM absorption line ([cast-lives card](../protagonist-life-2026-10-27/CAST_LIVES_CARD.md)). It has been idle since 10-29 16:31 after Weibao interrupted it. It owns the uncommitted `src/book_world_lotm_{host,state,cast_host}.js` and `tests/cast_*` edits (T2 journey fix candidate, TH2 test fixes) | A **fresh Sonnet successor (L-A)** takes over that line from its checkpoints rather than running beside it. The 1,134-message original is not resumed because it is too expensive to carry. L-A also acts as integrator (L0). |
| `src/cast_schedule.js` already exists (lane L2 of the cast-lives line) | **L3 dropped** as a separate lane. Schedule gaps go to L-A from the ledger |
| "Resume the lead's book readings" (`local_fb1fcc38`, Sonnet) owns READING_STATUS and the Luna route | **L6 goes to that session** as a follow-up instead of a new chat |
| "Book indexing" runs memory plan P3b and the Codex lane MR3; "General UI improvements" runs UI adoption; "Relationship web representation" works in its own worktree | L-A and L2 stay out of `person_memory*`, `ui_components.js`, `workspace_*`, `panel_reveal.js` and `village_workspace.js` |

Pilot as launched: **L-A** (absorption successor and integrator), **L2** (ledger; new files only, shared checkout), **L6** (follow-up to the readings session). L4 and L5 wait for L2's ranked list and go to L-A's queue.

## Order and stop rules

1. Before any launch: find the owner of the uncommitted `src/book_world_lotm_{cast_host,host,state}.js` and `tests/cast_*` edits; L3-L5 cut from HEAD and must not clobber them at merge.
2. Pilot: L1 (or skip), L2, L3, plus L6. L6 is mostly Codex, so it is cheap on Claude. Sample `get_usage` and `codex_lane.mjs preflight` after about two hours, and write the measured points per lane for both meters here.
3. Scale: L4, L5 when the pilot shows a lane under 8 points; wave 2 after L2's list.
4. Stop: weekly 75% (no new lanes), 80% (lanes checkpoint and stop); any lane that fails its focused test twice comes back to the integrator.
5. Sunday night: integrator merges what passed; everything else is checkpointed with the next exact step.

## Ledger

| Time | Event | Claude weekly | Claude 5-hour | Codex highest |
| --- | --- | --- | --- | --- |
| 10-29 22:40 | Plan written, nothing launched | 38% | 28% | 26% (22:55) |
| 10-30 00:46 | Pilot launched: sw-absorb (`local_98b0ec09`), sw-ledger (`local_2498dc0e`), L6 sent to readings session `local_fb1fcc38` | 41% | 51% (resets 01:30) | 26% |
| 10-30 01:20 | L2 ledger done: script + test (3 pass), LEDGER.md, grade-C set-aside already applied by another session (10/10 lint clean, 11 rows aside) | 41% (sampled 00:46) | 51% | 27% |
