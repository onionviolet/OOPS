# Xeus24 mod: process, test harness, userscript route, titles tests

Reader P. Source root: `.../scratchpad/xeus/` (read-only copy of PR 3, head b27d07a). Paths below are relative to it. Labels: SHOWN = stated in a file I read; INFERRED = my reading; UNKNOWN = not in my files. No web used.

## 0. Provenance caveats

- SHOWN: CLAUDE.md names the author only as "the author" and the fork as `Xeus24/23html.github.io` (CLAUDE.md:583). Pull request authorship is not in my files.
- INFERRED, not SHOWN: "heavy AI-agent assistance". CLAUDE.md is titled "working notes for Claude" (CLAUDE.md:1) and the desktop app's "cloud move" is mentioned (CLAUDE.md:586). That shows an agent was used; it does not show how much.
- SHOWN: README states none of the mod is endorsed by the author (README.md:230-232). No LICENSE file was in my read list: UNKNOWN.
- Doc drift inside the repo: package.json says version 22.0.0 (package.json:4) while the mod is 4.7 (README.md:67). README says CI runs Chromium and WebKit (README.md:204); the workflow runs chromium, webkit and firefox (.github/workflows/tests.yml:27). Both small, both SHOWN. `tests/docs.mjs` does not catch either (it checks version only against README and MOD-NOTES, docs.mjs:25-28).

## 1. Working rules and process (CLAUDE.md)

**Shape of the project.** One unminified game file with global `var`s; the mod is one `mod.js` loaded by one appended script tag, "the only change to index.html" so `git checkout index.html` is a clean undo (CLAUDE.md:5-19). Method is "wrap, don't edit", always preserving the return value (CLAUDE.md:25-40). SHOWN.

**How the author directs the agent (INFERRED from the document's form).** CLAUDE.md is not a task list. It is a ledger of bugs the agent or author already hit, each written as: the mistake, the measured symptom, the rule, the test that now holds it. Examples: id clash doubled the sheet 1,2,4,8,16 (CLAUDE.md:677-682); a hidden panel overflow from a glyph (CLAUDE.md:385-388); a function-valued tooltip printing source (CLAUDE.md:380-384). Pointers are always to a named test file. There is also a second long file, `MOD-NOTES.md`, "the full design record" to read "before changing anything in that area" (CLAUDE.md:21-23). I did not receive MOD-NOTES.md: UNKNOWN content.

**Standing rules worth listing (all SHOWN):**
- Append-only for anything the save indexes by position: milestones, skills, converged skills created unconditionally at load (CLAUDE.md:44-60, 753-756).
- Derive, never restate: realms from `MOD_RANK_AT` (CLAUDE.md:431-434), wiki pages from live data so coverage tests count from the game (CLAUDE.md:847-852), What-next calls each system's own gate (CLAUDE.md:405-409), rarity and title rank derived from level (CLAUDE.md:497-498, 721-723).
- Mutating saved fields needs delta tracking in a flag, or it compounds per load (CLAUDE.md:57-59, 281-345). Two contributors to one field need a shared registry with one writer (CLAUDE.md:331-344).
- Ids and names are primary keys; check both across all namespaces (CLAUDE.md:667-717, 770-788).
- Never edit the author's content: his changelog must stay byte-identical to upstream, enforced by script (CLAUDE.md:573-581).
- Every change gets a changelog entry "literal on purpose", even a README edit (CLAUDE.md:568-571).
- Bump `MOD.version` for any change a save could notice, or the pre-update backup is skipped (CLAUDE.md:946-947).
- Section 0 (backup) must be first in the file, with no dependencies (CLAUDE.md:935-939).
- Finish a change with `npm run check` plus the relevant test script (CLAUDE.md:963-966).

**Balance-measurement method (SHOWN).**
- Measure through the game's own `dmg_calc` and `hit_calc`; never a stat ratio, because damage is subtractive and ratios hid a 63,000-swing fight (CLAUDE.md:170-190, README.md:170-182).
- "Nothing is replicated, everything is measured": the enemy model samples the real functions inside a probe that parks side effects (CLAUDE.md:183-187).
- Model the player AT each cap, since the full ladder is reachable (CLAUDE.md:129-130); an early-game script walks the real opening route with a fresh character (earlybal header, tests/README.md:64).
- Compare to the per-spawn target, not the dial; fold in hit rate; use equivalence (a +-5% band), not significance (CLAUDE.md:252-265). Student's t with the wider row between table rows (CLAUDE.md:252-254, tests/lib/stats.mjs:23-39).
- Stratify on crits and top up an empty stratum rather than fall back to a plain mean; that fallback silently dropped 30% of damage (CLAUDE.md:266-274, tests/README.md:146-151).
- Park `giveSkExp` in any sampler, because sampling levels the player mid-measurement (CLAUDE.md:224-226, tests/README.md:174-181).
- Pin balance in a committed JSON; an intended change reruns with `UPDATE=1` and "the diff is the review" (CLAUDE.md:228-232, tests/baseline.mjs:15-16, 100-103).
- Economy rule: no required price over 10% of the climb it gates, in hours of best income open at that tier (CLAUDE.md:464-467, econ.mjs header).
- Cross-product sweep before calling balance finished: 3,720 matchups (CLAUDE.md:234-236).

**"Measured against the original" harness (SHOWN).** `tests/vanilla.mjs` loads the same server twice; in one page a route fulfils `**/mod.js` with an empty body, which "IS the author's game exactly" (vanilla.mjs:5-9, 46). The same measurement code runs in both and may not call any `MOD_*` symbol (vanilla.mjs:8-9, 56-58). Assertions are explicit about where the mod must match (character exp curve level for level, vanilla.mjs:61-64; every skill cost below `vanillaTo` equals his `expnext` read from his page, vanilla.mjs:81-82; default multipliers, vanilla.mjs:99-104) and where it may differ (Scaled fights: gap printed, not asserted, only bounds, vanilla.mjs:19-31, 192-204). Equal-progression comparison converts the original's skill level through cumulative xp (vanilla.mjs:166-172). It records that an earlier comparison was wrong because the curves were unmatched (vanilla.mjs:33-36). `fights.mjs` repeats the two-page approach spawn by spawn with `random()` seeded on both (fights.mjs header, tests/README.md:104).

**Docs-numbers checks (SHOWN).** `tests/docs.mjs` (46 lines, no browser) reads section count, version, script count, and the suite's duration from source and fails if README / tests README / CLAUDE.md / MOD-NOTES disagree (docs.mjs:20-43). It also checks `run.sh` lists every script file and vice versa (docs.mjs:31-34). Gap: it did not catch the 22.0.0 vs 4.7 or the two-browser vs three-browser CI claims.

## 2. Test harness

- **Tooling (SHOWN).** Playwright (`playwright ^1.48.0`), plain Node ESM scripts, no test framework; `http-server` for serving (package.json:14-17). 52 `.mjs` files in `tests/` (wc listing) of which `run.sh` lists 48 by name (run.sh:26); README says 48 (README.md:188).
- **Engine switch.** `tests/lib/browser.mjs` picks chromium / webkit / firefox by `BROWSER` env (browser.mjs:10-19). WebKit exists because it caught skill rows wrapping under a classic scrollbar that headless Chromium never showed (tests/README.md:38-46, workflow comment tests.yml:22-23).
- **Readiness.** `settle(page)` waits two game ticks counted from the tick the page already had; it replaced a flat 4.5 s sleep (browser.mjs:21-33, CLAUDE.md:976-978).
- **Runner.** `run.sh` starts `http-server -c-1` and polls with curl until it answers (run.sh:29-47). The `-c-1` flag exists because an hour of cache served a stale `mod.js` and produced a phantom failure (run.sh:30-35, tests/README.md:158-166). Four jobs run at once by default, each script launches its own browser (fresh profile, so saves cannot collide), logs are printed in list order, then per-script seconds slowest first (run.sh:14-16, 62-100). Exit is nonzero if any script threw. About 75 seconds total (CLAUDE.md:981-982).
- **Script convention.** Each file: header comment says what and why, a local `check(cond, what)` that prints ok/FAIL and collects failures, `pageerror` collected and failed on, final PASS line (titles.mjs:23-24, 155-159). Scripts use `page.evaluate` into the game's own globals; they do not click much, except picker and slot tests that drive the real UI (saveslots header, titlepicker.mjs:26-35).
- **Save-compat fixtures (SHOWN).** `tests/fixtures/v1-save.txt` plus `v1-save.meta.json` is a real save from the pre-consolidation build (100 discovered skills). `savecompat.mjs` calls the real `load()` on it, then asserts: no throw, the game's error screen not shown (opacity check on `dom.error`), five `ontick()` calls do not throw, base-game skill level and `p` survive, a flagship skill's milestone flags land in the same slots, appended perks start ungranted unless the level already earns them, merged-away skills are absent (savecompat.mjs:21-78). It deliberately checks alignment rather than exact array length so legitimate appended milestones do not fail it (savecompat.mjs:59-64). Only one fixture exists (ls fixtures); UNKNOWN whether newer-version fixtures were ever added.
- **Other save-safety tests (SHOWN).** `audit.mjs` checks every milestone is ascending and does something (CLAUDE.md:47-49); `audit2.mjs` save size with all skills maxed (~16 KB), reload intact (tests/README.md:63); `backups.mjs` asserts the snapshot precedes section 1 and backs up exactly the blob the game is about to read (backups header, tests/README.md:99); `slotsettings.mjs`, `saveslots.mjs`, `ranks.mjs` (flag survives save/load), `ids.mjs` (title and id duplication across load, ids.mjs:158-205).
- **Baseline.** `tests/baselines/balance.json`, compared per key; it reports changed, added and gone keys, and drops numbers that differ between two spawns of the same creature as "unstable" rather than recording a flapping baseline (baseline.mjs:8-13, 84, 105-116). It lifts the player builder out of `allareas.mjs` by string slicing so the two files cannot describe different characters (baseline.mjs:18, 33-35).
- **Time faking.** `catchup.mjs` fakes a hidden tab by moving the loop's last-tick timestamp back, then calls `ontick()` by hand (catchup.mjs:3-6, 20-33). Asserts: 1 s = 1 tick; 600 s replays ~600 ticks and the running action's seconds; a day is capped at an hour; combat is never replayed; `setCatchUp(0)` turns it off, persists to localStorage, and appears in the settings snapshot that travels in the save (catchup.mjs:35-58). Same idiom as `road.mjs`, which stands in for `random()` per rule check (tests/README.md:101).
- **Content-quality tests (SHOWN).** `tooltips.mjs` renders all ~1,370 tooltips through the game's `dscr` and fails on function source, `undefined`, `NaN`, `[object` (header, tests/README.md:106). `screens.mjs` draws every location with a 60-character name and checks fixed 22px choice rows for wrapping (tests/README.md:84). `wiki.mjs` counts coverage from game data. `names.mjs` checks duplicate display names. `grademark.mjs` checks a non-colour grade marker.
- **CI.** One job, matrix chromium / webkit / firefox, `fail-fast: false`, Node 20, `npm ci`, Playwright browser cache keyed on the lockfile hash, then `npm run check`, `tests/authorfiles.sh`, `npm test` (tests.yml:18-61). Changelog notes `package-lock.json` was ignored, so every GitHub run had failed at install until 4.7 (changelog/mod-changelog.html:56-61 region, dated 2026/10/07).
- **Author-files guard.** `authorfiles.sh` diffs against `upstream/main` (or fetches it read-only in CI); changelog must be byte-identical; `index.html` may differ only by a blank line, the comment and the one script tag, checked by exact string compare of added lines (authorfiles.sh:10-43).

## 3. Userscript distribution route (SHOWN)

- Why: the hosted game at 23html.github.io has no mod tag. A userscript manager wraps scripts in a function, which would make every `var` local and hide the console commands and everything the game reaches by name. So the userscript does not run the mod; at document-end it appends `mod.js` as an inline `<script data-p23-mod>` into the page's own global scope (build-userscript.mjs:8-19, 75-78).
- Guards: bail if `MOD` already exists (local copy or fork serving it), bail if the page lacks `global`/`you` objects (not the game), warn in console if `global.ver` differs from the version the build was tested against, and expose `MOD_USERSCRIPT.builtFor` so the mod can tell the player in game (build-userscript.mjs:60-73, small.mjs header).
- Embeds the mod's changelog as a string because the author's site has no `mod-changelog.html` (build-userscript.mjs:19, 73).
- Metadata: `@match` on the exact hosted URL, `@run-at document-end`, `@grant none`, `@downloadURL` and `@updateURL` both the raw GitHub URL, so managers auto-update (build-userscript.mjs:41-54). Version is scraped by regex from `mod.js`; game version from `global.ver=` in `index.html` (build-userscript.mjs:37-39).
- Stale-build protection: `--check` mode exits 1 if the committed file differs from a fresh build; wired into `npm run check` and CI (build-userscript.mjs:83-92, package.json:10). `tests/userscript.mjs` also runs the committed file against the author's page with `mod.js` blocked, checks the whole mod is live, a save made under it reloads, key-item detection reads the game's source not the mod's injected copy, and the script does nothing on a page that already has the mod (userscript header, tests/README.md:105).
- Consequence for source scans: anything reading game source from `document.scripts` must go through `MOD_gameSource()` which skips the injected tag (CLAUDE.md:988-991).
- Two other hosting routes: fork's GitHub Pages from repo root with `.nojekyll` (README.md:51-61), and local file or `http-server -c-1` (README.md:40-49). Saves are per origin, so moving between routes uses export/import (README.md:59-61).
- Risk acknowledged by the author: turning the userscript off leaves mod fields in the save; advises downloading a backup first (README.md:30-32). Safari data clearing is the reason for a once-a-day backup reminder (README.md:34-38).

## 4. Version timeline (changelog/mod-changelog.html; headers counted: 36 entries)

All dates are as written in the file (YYYY/MM/DD).

| Version | Date | Headline (SHOWN, header lines only; I read the 4.7 text, not the older bodies) |
|---|---|---|
| 2.0 | 2026/09/07 | first changelog entry (line 853-854) |
| 2.1 to 2.9 | 09/08 (2.1-2.8), 09/08 (2.9) | nine versions in one day (lines 707-851) |
| 3.0, 3.1 | 09/09 | (lines 676, 632) |
| 3.2 | 09/11 | (line 585) |
| 3.3 to 3.5 | 09/15 | (lines 556, 521, 485) |
| 3.6, 3.7 | 09/16 | (lines 453, 425) |
| 3.8, 3.9 | 09/23 | 3.9 fixed hpTrack (changelog line 347 refers to "the exact mistake v3.9 fixed for hpTrack") |
| 4.0 | 09/25 | realm code, body maximums via `stat_r` fix (CLAUDE.md:318-329) |
| 4.1, 4.2 | 09/26 | 4.2 matched the original's pacing (CLAUDE.md:120, vanilla.mjs comments "Mod before 4.2") |
| 4.3, 4.4 | 09/27 | 4.3 "polish" fixes (polish.mjs header), rank-duel margin to 1.4 (CLAUDE.md:272-273) |
| 4.5, 4.6 | 09/28 | 4.6: Fights Original/Scaled, wall sized to climb, panel updater (CLAUDE.md:132-166, 389-399, 449-457) |
| 4.7 | 09/28 to 10/07 (eight sub-entries) | settings travel in save, Safari backup reminder, userscript version notice (09/28); housekeeping 09/29; pills and hosting, small 09/30; wiki search, background-tab catch-up, dishes and screen fix, creature gear, pill for the wall 10/07 |

INFERRED: build span 09/07 to 10/07 matches the task brief. The mod went from 2.0 to 4.7 in 30 days, roughly one version per day in the first fortnight, which fits an agent-driven loop but does not prove one. Note in YAIRPG terms: the author versions per change, not per wave.

## 5. TITLES for O1 (tests/titles.mjs, tests/titlepicker.mjs, plus ids.mjs title block)

Context: in this mod titles are mod-generated per skill (five per skill at levels 25/50/75/90/110, CLAUDE.md:497-501) and have exp bonuses and ranks. O1 for YAIRPG is titles for lifetime counters, so the transferable part is the behavior assertions, not the skill-specific generation.

### 5a. `titles.mjs` assertions (all SHOWN)
1. **Coverage:** every skill grants at least 4 titles (note CLAUDE.md says five; the test floor is four, titles.mjs:47 vs CLAUDE.md:499); all ten ranks populated (titles.mjs:48).
2. **Rank derived from the level that earns it:** every rank-10 title is earned exactly at level 110 (titles.mjs:49-50); no rank 3+ title is earned below level 18, the original complaint of "rank assigned by feel" (titles.mjs:51-52, 5-7); each rung of the level ladder maps to a strictly higher rank (titles.mjs:57-60).
3. **Completion gate sanity:** the top renown step wants more than 85% but fewer than 100% of all titles, "near-completion, not trivial" (titles.mjs:53-54).
4. **Earned is not worn:** with renown 0, giving a rank-10 title changes nothing; wearing it adds the title's exp bonus to the skill; taking it off restores the exact prior value (titles.mjs:62-83).
5. **Passive by renown:** a rank-3 title is inert at renown 2 and applies at renown 3 without wearing (titles.mjs:85-98).
6. **No stacking:** 30 repeated bonus applications leave the value unchanged; a real `save(true)` then page reload yields the same value, "not doubled" (titles.mjs:100-118). Bug guarded: the bonus writes to a saved field (`skl.<x>.p`) that is restored after milestones fire (CLAUDE.md:503-505, 560-563); reconciled against a record in flags (`mod_ttlxp`) like section 13 does for `you.res`.
7. **Tooltips per rank:** for each of the ten ranks, find a title of that rank, call the game's `dscr` type 5, require no throw, a non-empty label colour, a "Rank " line, and ten distinct colours (titles.mjs:120-153). Bug guarded: the game's rank 7 branch sets `this.dl`, undefined in a type 5 call, never run before because the base game topped out at rank 5 (titles.mjs:144-147, CLAUDE.md:506-509).
8. Page errors collected and fail the test (titles.mjs:19, 155-156).

### 5b. `titlepicker.mjs` assertions (all SHOWN)
Background: generated titles took the pool from 120 to 585 and made the picker a scroll of hundreds of rows (titlepicker.mjs:5-8). The picker is a second listener on `dom.d3` rather than a replacement, because cloning would lose `update` and the tooltip (titlepicker.mjs:10-12).
1. **Small collections stay flat:** with only starting titles, no row has a caret (titlepicker.mjs:37-40).
2. **Collapse:** after levelling five skills to 90 and granting two story titles, rows < titles held (titlepicker.mjs:42-56).
3. **A group per skill with more than one title,** count derived at runtime, not hard-coded, so the test does not need retuning when setup earns one more (titlepicker.mjs:57-69). Each group header shows its count in parentheses (titlepicker.mjs:70).
4. **Non-skill ladders group by stem:** at least 8 ladders and 35 titles in them; every ladder has a readable label, not a key stem; no label names a ladder that does not exist (orphan check); at least one ladder shows in this picker (titlepicker.mjs:72-96). Family of one is not a family (CLAUDE.md:536-537).
5. **Stem-collision guard:** "Thrasher" (`ttl.thr`, smashing dojo equipment) must not be filed under Throwing (`skl.thr`) by a bare stem match, while numbered tiers `tghs1`, `srd3`, `dth4` are read correctly (titlepicker.mjs:97-107, CLAUDE.md:526-531).
6. **Header = best held, not first earned,** compared by rank (titlepicker.mjs:109-118).
7. **Base-game and generated titles group together** (titlepicker.mjs:120-123).
8. **Caret behavior:** expanding does not change the worn title, keeps the picker open, shows indented children, row count rises; other groups stay collapsed; second click re-collapses to zero indented rows (titlepicker.mjs:125-151).
9. **Select from inside a group:** wears it, closes the window (`ttlscrnopn` false, element gone) (titlepicker.mjs:153-164).
10. **Story titles with no skill stay plain loose rows** (titlepicker.mjs:166-176).

### 5c. Title-list integrity in `ids.mjs` (SHOWN, ids.mjs:158-205)
- Bug: `giveTitle` pushes to both `global.titles` and `global.titlese`; `load()` rebuilds from the save by index and then appends all of `titlese`, so titles earned that session appear twice (241 measured as 481) (CLAUDE.md:707-713).
- Test: earn 40 titles, `save(true)`, `load()`, assert length equals distinct count after one and two loads, no holes, and the worn title still in the list. A second test hand-doubles the list plus a null and asserts the repair function returns it exactly (ids.mjs:166-205). The rule: do not fix at the source, repair on load, and count from `ttl` rather than from the array (CLAUDE.md:714-717).

### 5d. What O1 can take (INFERRED)
- Derive title tier from the counter threshold; never hand-assign. Test the extremes (lowest and highest tier at the right thresholds) and the original complaint form (high tier too early).
- Separate "earned" from "applied". If any title grants a bonus, test earned-only, worn, removed, and survives save then reload without doubling (the bonus is persisted state, the classic compounding bug).
- Test the display path for every tier (hover or render), not just the data; the rank-7 branch had never executed.
- If many titles per counter, group in the picker; assert the grouping is derived and every label is readable, with an orphan-label check.
- Guard prefix/stem matching if titles are grouped by id stem.
- Add a pageerror collector and the double-load duplicate test for any list that is both pushed to and rebuilt on load.
- Check the completion goal (e.g. top step needs ">85% but <100%") against the live count so it cannot drift when titles are added.
- Gap in this suite (SHOWN absence): no test asserts titles are granted at the counter thresholds via the real game tick, only that they exist; `polish.mjs` does that for four finished titles (polish.mjs header). For lifetime counters, that grant-at-threshold check is the part O1 must add.

## 6. Lessons for YAIRPG

YAIRPG comparison (SHOWN by listing): `tests/` holds 39 `*.test.js` files run by `node --test tests/*.test.js` (package.json line 8), with Node-level unit tests such as `save_compatibility.test.js` that use synthetic objects (`prepareFoundationSave`, `retainRetiredContent`), and `scripts/*_browser.cjs` browser drivers (listing; `ui_helpers.cjs` has a Playwright-style locator API). There is no `.github` directory (ls). I did not inspect how `*_browser.cjs` are invoked: UNKNOWN. YAIRPG AGENTS.md already requires rebuild, exercise in a browser from a fresh test origin, save/reload/import for persistence changes, and "implemented-unverified" labels (AGENTS.md Verification section).

| # | Lesson | Class | Why |
|---|---|---|---|
| L1 | Real-save fixture loaded through the real `load()`, with an alignment-not-length assertion | ADAPT | YAIRPG has `save_compatibility.test.js` and `v06_migration.test.js` on synthetic objects; a captured real save per schema era would add the "game's error screen did not show, ontick x5 did not throw" check. |
| L2 | Committed balance baseline JSON, diff is the review, drop unstable numbers | ADOPT | YAIRPG has no committed numeric baseline in what I saw (UNKNOWN beyond the tests listing). Cheap and fits "show playable results" because a balance change becomes a visible diff. |
| L3 | Two-page vanilla vs mod comparison (block the mod file, same measurement) | ADAPT | YAIRPG is a fork of Proto23; the same trick (route a bundle to empty, or load upstream build) could prove "unchanged where we claim unchanged". Needs the upstream bundle served alongside; `dist/bundle.js` is modified in working tree, so check it first. |
| L4 | Derive, don't restate (tiers/ranks from one table; wiki counts from live data) | ALREADY-HAVE in spirit | YAIRPG AGENTS.md prefers PROJECT.md decisions; for O1 titles ADOPT: derive tiers from counter thresholds. |
| L5 | Docs-numbers test (counts, version, suite time read from source) | ADOPT | 46 lines, no browser, catches the drift YAIRPG's many generated docs invite. Extend it to check the version field too, which this repo missed. |
| L6 | Author-files guard (`authorfiles.sh`): upstream attribution/LICENSE untouched, diff against upstream | ADAPT | AGENTS.md says "Preserve upstream attribution and LICENSE"; a script that diffs LICENSE and listed files against `upstream` enforces it. YAIRPG is a heavy fork, so the guard would list protected files, not "only one tag". |
| L7 | Bug ledger in agent instructions: mistake, measured symptom, rule, owning test | ADAPT | Strong format. YAIRPG's AGENTS.md is a rulebook; a separate `docs/` ledger of persistence/id traps with test pointers would serve agents without bloating AGENTS.md. |
| L8 | `settle()` ticks instead of sleeps; `-c-1` no-cache server; parallel jobs with fresh profiles | ADAPT | Applies to `scripts/*_browser.cjs` if they sleep or share profiles (UNKNOWN). |
| L9 | CI matrix across browser engines, lockfile-keyed browser cache | NOT-RELEVANT now / ADOPT later | YAIRPG has no `.github`; the user's rule is to name one authoritative gate. A single-engine CI is the realistic step,. Which engines matter for YAIRPG is UNKNOWN. |
| L10 | Userscript injection route (append inline script at DOMContentLoaded, stale-build `--check`) | NOT-RELEVANT | YAIRPG is its own fork with its own bundle, not a mod of a hosted page. The stale-generated-file `--check` idea does apply to `dist/bundle.js` (ADAPT): a test that fails when dist is not rebuilt from src, which AGENTS.md ("do not claim a change works based on the prebuilt bundle") already worries about. |
| L11 | Confidence intervals / equivalence bands for heavy-tailed balance samples; top up empty strata | ADAPT | Only if YAIRPG gets sampled balance scripts (idle RPG with crits or RNG). Keep the principle: compare to the per-sample target, use a band, and report "too wide to conclude" separately. |
| L12 | Save-schema discipline: append-only positional data, delta-tracked mutations of saved fields, bump version to trigger pre-update backup | ADAPT | YAIRPG's rule is "migration or explicit compatibility decision"; the delta-tracking and idempotent single-writer registry patterns are concrete implementations for lifetime-counter-derived bonuses (O1). |
| L13 | Every change gets a changelog line, even non-gameplay | NOT-RELEVANT / ADAPT | YAIRPG records decisions in PROJECT.md; a literal "every change" rule is heavy for solo creative-director flow. |
| L14 | Tooltip/render-all audit (every description renders as text, no NaN/undefined/function source) | ADOPT | Directly catches the class of bug that no logic test sees. Applies to titles O1 (render each tier's text). |
| L15 | Process caveat: tests that write to the save and run against shared profiles | ADOPT (as a warning) | Their README warns tests mutate saves (tests/README.md:167-172). YAIRPG already says keep saves private; keep browser tests on a fresh origin as AGENTS.md says. |
