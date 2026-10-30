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

## Whole-book gaps pass, more to consider round 1 (2026-10-30 01:30)

Weibao: "how hard to go beyond just vol one, or at least have a coarse gaps pass through the entire book so that gaps workers can begin addressing? more to consider? That would be important to make features be more comprehensive?"

**Evidence [S]:**
- All 8 LOTM volumes are already read and merged in `m4-whole-book-2026-10-29/merged`.
  - Extras rows by volume: 5,450 / 27,633 / 25,547 / 21,836 / 19,899 / 11,309 / 8,766 / 3,840.
  - Scenes: 4,899. Registry: 12,294 ids.
- Shard grades are mostly B, with about 10% C per volume (volume 2 has 121 B and 16 C).
- `coverage_ledger.mjs` filters to volume 1 at line 8. Volumes 2-8 are about 22 times volume 1's rows.

**Effort:** low for a coarse pass. The rows exist; the work is a script change plus a clustering pass. That is about one Sonnet lane, a Sol draft and 8-16 free Luna lanes.

**Findings:**

ACT NOW
- **WB1, shape seams on the whole book.** The seams being built now (L4 rites and potions, L-A schedules) are being shaped from volume 1 alone. That risks a refactor once later volumes show wider shapes (AD45 allows it, but it is avoidable). Lanes sample later-volume rows of their kind before fixing a schema. Sent to `sw-rites` and `sw-absorb`.

ACCOUNT FOR NOW
- **WB2, coarse means mechanism grain, not row grain.** The game has only Tingen, so a row ledger over volumes 2-8 would read nearly 100% missing and tell a gap worker nothing. Each mechanism family gets one of three labels:
  - **has seam, content gap:** fill it with data.
  - **mechanism gap:** needs a new or extended seam.
  - **outside the seat:** not the lead's life.

  Example families: sequence advancement beyond 8 (HR2), the acting method, cities and regions, sea and long travel, secret gatherings, identities and personas, sealed artifacts, factions, wars and city-scale events.
- **WB3, script first, then Luna, then Sonnet.**
  1. A script counts rows per volume by kind, place, organization and rule kind, and flags ids new in each volume. This is free.
  2. Luna clusters each volume's rule and texture rows into families, citing ids and returning counts only. One lane per volume or half-volume, $0 API.
  3. Sonnet merges the families into the register and sets the labels against `src/`.
- **WB4, extend the existing gap register; don't fork it (PRF5).** Results go in as new rows of `docs/research/READING_GAP_MAP_2026-10-28.md`, codes GM20 onward, plus a whole-book section in LEDGER.md. Each row cites the volumes and counts that justify it.
- **WB5, spoilers.** Weibao plays this book's life. Gap names describe mechanisms ("a second persona with its own reputation"), not plot ("X is secretly Y"). Changed or randomized truths stay sealed by ID. Public franchise twists are not sealed, but they still stay out of gap titles.
- **WB6, order by the lead's path.** The register lists gaps in the order the lead's run meets them: the next city, the next sequence rungs, the first long journey. That way gap workers start where play will go next, not where row counts are biggest.

LATER / DELEGATE
- **WB7, repair grade-C shards in volumes 2-8.** Use the same script set-aside as volume 1. Free, mechanical. Level: Luna low or script. Done check: lint-clean counts per volume.
- **WB8, the same coarse pass over other books.** Mother of Learning, Harry Potter and Shadow Slave rows are read but unmerged; merging is free. A cross-book family table shows which seams serve several worlds, which is the strongest case for making a feature general. Level: Sonnet plus Luna. Done check: a family-by-book table in the gap map.
- **WB9, schema 1.5 step enrich for volumes 2-8.** Use the Luna enrich route proven on volume 1. Only needed when a slice replays those scenes. Level: Luna medium. Done check: the `luna_enrich.mjs check` counts.

**Lane L7, whole-book gaps:** Weibao said go 2026-10-30, with WB8 included ("Also other books"). Started as `sw-gaps` (`local_6db3be60`).
- Model: Sonnet, plus a Sol draft of `--volumes all` and the per-volume and new-id counts in `coverage_ledger.mjs`, plus Luna clustering lanes.
- Files: the coverage script and its test, the gap map rows from GM20 on, and a LEDGER.md whole-book section.
- Done check: every volume has its families labelled and ordered by the lead's path, ready to hand to gap workers.
- Estimated cost: one Sonnet lane (a few weekly points) and 8-16 Luna lanes.

## Long-term homes and character records (2026-10-30)

Weibao: "Everything here should be saved into something long term to address all of these?" and "Also we should work on digitalizing each character, stats wise, ability wise and everything?"

**Long-term homes:**
- WB1 became [WA48](../../../WORLD_ABSORPTION_RULES.md) (accepted).
- WB2-WB8 became WA49 (proposed). Its output, the GM20+ rows, lives in the [reading gap map](../../../research/READING_GAP_MAP_2026-10-28.md).
- WB7 and WB9 are queued under QR6 in the [idea index](../../../IDEA_INDEX.md#current-queue-routing-2026-10-18).
- His words are in [USER_VISION](../../../USER_VISION.md#whole-book-seams-gap-register-and-character-records-2026-10-30).
- This plan stays the dispatch record only.

**Character records (WA50, proposed).** What exists today: the cast records (`private_packs/lotm-cast/cast.json`, 1,500 people) carry `knows`, `relations`, `wants`, `tier` and counts. They have no power path or level, abilities, stats, items or money, and nothing is dated past the first reading. The rules for the pieces already exist (WA23 whereabouts, WA33 stat bands, WA40 held state, WA42 motives, WA43 tiers, hidden strength). What is missing is the join.

Options weighed:

| Option | Cost | Gives | Verdict |
| --- | --- | --- | --- |
| O1: full sheet for every registry person | about 12,000 ids, mostly crowd; Luna days | Uniform coverage | Over-models passers-by (WA43 mistake) |
| O2: stats only for people who fight | Small | Combat works | Misses the knowledge, money, routines and personas that drive the lead's days |
| O3 (unusual): no stored sheets; derive "as of chapter X" on demand from rows | Cheapest storage | Always current with re-reads | Nothing to calibrate or edit, so slow lookups in play; fine for crowd people only |
| **O4, default: tiered dated sheets** | About 50 principals full, about 300 recurring as bands, identity and routine, crowd derived on demand (O3) | Comprehensive where play looks; calibrated (WA33) | **Proposed** |

**Proposed lane L8**, needs Weibao's go:
- **Who does what:** Sonnet designs the sheet schema under WA48, sampling all 8 volumes. Luna fills one principal per lane from cited rows (`cite_paragraphs.mjs --id`). Sol drafts the loader and calibration test.
- **Pilot:** 5 LOTM principals, the lead included.
- **Done check:**
  - Each pilot sheet reads "as of" volume 1 and a later volume with different power and identity fields.
  - Each sheet reproduces 2 stated outcomes by band.
  - Sealed fields are gated.
- **Order:** start after L7's LOTM families land, so the schema covers every family that touches a person.

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
| 10-30 05:00 | L6 (readings session): Circle of Inevitability people/rules/texture on Luna, pilot 3 shards then 12 more (36 of 36 ok after one retry); 10 grade-C volume 1 shards now B | 44% | 72% | 27% |
| 10-30 01:35 | L4 slice 1: 3 divination query rows (coin, cane-dowsing, altar search/dream) in new `src/lotm_divination_rows.js` + 4-test file; Luna (3 launches: first two stopped on a print-to-stdout wording) + Sol medium; whistle/pendulum/mirror kept as gaps. Not wired into the pack yet | 45%  | 81% | 28% |
| 10-30 01:35 | L-A: T2 + TH2 committed (`0df26deaa`), below browser floor. Build/arch/rules pass; shared-tree full suite 4114/4119, remaining fails in other lane's `person_memory` edits; clean-worktree reruns timed out at load 100-225. Browser floor pending | 46% | 4% | 28% |
