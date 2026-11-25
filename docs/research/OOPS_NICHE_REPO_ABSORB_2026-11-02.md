# What OOPS can absorb from nine niche repos (2026-11-02)

**Source:** a Codex research run on 2026-11-02, kept until now outside the repo at `~/Documents/Codex/2026-11-02/oops-absorb/report.md`. Copied here on 2026-11-24 so the atlas idea registry can index it; codes OAB1-OAB15 were added at the port, the text is otherwise unchanged apart from two wordings adjusted for the docs check. Proposals (AD32): none of this is accepted or scheduled. File paths in other repos were checked by that run, not rechecked now.

Read-only research. Nothing in the OOPS repo was edited. Clones are shallow, in the session scratchpad, and nothing from them was run or installed. Six sonnet readers each studied one repo group and saved a longer note in the shared notes folder (`oops-absorb-*.md`). I spot-checked the OOPS side myself.

**Verified by reading** means a reader opened the file. **Inferred** means it went from names or sizes. I checked OOPS myself only for the items marked "OOPS check" below; the readers did not read OOPS code.

## Licenses at a glance

OOPS is MIT (`LICENSE`, Miktaew 2021). That decides what can be copied.

| Repo | License (verified) | Copy code? |
|---|---|---|
| dspace | MIT | Yes with notice; only ideas are worth it | <!-- slip-ok: ported research report, descriptive -->
| button-clicker | MIT | Yes, nothing worth copying |
| Yarl2 | CC0 | Yes, but it is C#, so it is a rewrite anyway |
| webidler | GPL-3.0; art is AI-generated plus game-icons.net | **No** |
| ruins | GPL-3.0; art has own terms | **No** |
| parasite | GPLv3, sold on Steam | **No** |
| nouron | Code GPLv3; texts and graphics CC BY-NC-SA 3.0 DE | **No** |
| blackbird | CC BY-NC-SA 4.0 | **No** (non-commercial, share-alike) |
| AngbandOS | Angband license: educational and not-for-profit only | **No** | <!-- slip-ok: ported research report, descriptive -->
| INCREMENTAL_GAME | No LICENSE file (all rights reserved) | **No** |
| immortalityidle | No license file; README says "use as much as you want, keep derived work open"; music is CC BY-NC-ND | **No** (ambiguous), ideas only | <!-- slip-ok: ported research report, descriptive -->

Every recommendation below is an idea or pattern to rewrite from scratch. This is not legal advice.

## Important correction first

Several ideas the readers liked are **already in OOPS**. OOPS check (grep and file heads, not a full audit):

- Banked offline time (immortalityidle's best idea): `src/away_bank_domain.js` already banks real time away as game minutes the player spends through the native clock, with a 7-day cap.
- Saved seeded RNG streams and a "deck" stream family: `src/seeded_streams.js`, `src/hash_rng.js`. This covers most of Yarl2's RNG and monster-deck ideas.
- Many-seed fight calibration with target bands: `scripts/calibrate_fights.mjs` plus `scripts/calibration/`.
- Generator checks (`scripts/check_generators.mjs`), a planner fuzz test (`tests/invention_planner_fuzz.test.js`), and `tests/simfuzz`.

So those are dropped from the top list. What remains is what I did not find in OOPS.

## Ranked top 5 to absorb

**OAB1 · Gate-necessity simulation for quest and progression chains** (dspace)
- What: `frontend/src/utils/simulateQuest.js`, `docs/design/quest-process-necessity-simulation.md` and `tests/questProcessNecessitySimulation.test.ts`. The simulator computes the inventory a player holds when entering a quest. The test fails if a gated step is already satisfied (content can be skipped) or a finish path is unreachable. Verified: design doc and simulator. Not read: the test body.
- Fit: OOPS's current focus is Klein's contiguous 146-stage campaign, where a skippable or unreachable stage is the likely defect. I found no such script in `scripts/` (names like `check_lead_bot.mjs` may overlap; compare first).
- Effort: 2 to 4 days.
- License: MIT, ideas only anyway. <!-- slip-ok: ported research report, descriptive -->

**OAB2 · Closed-form balance layer with a Monte Carlo cross-check, plus a labelled-assumptions economy planner** (ruins, nouron)
- What: ruins keeps one shared formula package used by both game and balance tool (`internal/balance/doc.go`, `docs/balance/approach.md`), a test that checks the closed form against Monte Carlo (`markov_test.go`), and a generated baseline report held against target difficulty by day. nouron's `tools/economy-model.php` keeps every assumption in one labelled array overridable from the command line and flags the bottleneck resource each turn. Verified: both docs and tool structure. I did not read the numbers.
- Fit: OOPS has Monte Carlo fight tables but, as far as I found, no formula layer or economy planner. This is the cheapest way to tune the many world economies without playing.
- Effort: medium, per domain. Start with combat time-to-kill and hunger or money.
- License: GPL-3 both, so rewrite from the idea.

**OAB3 · Flaky-test soak runner** (blackbird, ruins)
- What: blackbird's `bin/soak-tests.js` runs the suite N times, stops at the first failure and prints the random seed. ruins has a `grill` repeat target. Verified for blackbird.
- Fit: ~690 tests run under the load limiter (`scripts/slot_run.mjs`) with concurrency 4, which is where order and timing flakes appear. I found no equivalent (`desktop_soak.cjs` is a different thing).
- Effort: half a day.
- License: CC BY-NC-SA, rewrite from the idea.

**OAB4 · One effect record with a declared combining rule** (webidler, INCREMENTAL_GAME)
- What: webidler turns affixes, passives and masteries into one record (stat, modifier kind, value) with a condition enum and triggers (`shared/src/data/modifier.rs`, `stat_effect.rs`, `conditional_modifier.rs`). INCREMENTAL_GAME has named "questions" answered by upgrades and combined with a declared reducer (ADD, MULTIPLY, OR, PRIORITY) in `src/ev_q_definitions.lua` and `src/modules/reducers.lua`. Verified: file structure and names. Inferred: how Increased and More stack.
- Fit: lets new content change a stat without touching central code. I did not compare against OOPS's modifier code, so the first step is a half-day comparison. Apply only to new systems; a retrofit across ~1000 modules would take weeks. <!-- slip-ok: ported research report, descriptive -->
- Effort: 1 to 2 days for new systems after the comparison.
- License: GPL-3 and none: take the ideas, not the code.

**OAB5 · Shared import limits table and save-loader fuzzing** (dspace, ruins)
- What: dspace's `frontend/src/utils/importBudgets.js` is one frozen table for bytes, depth, node count, key count and string size, with path-only errors and a ban on `__proto__` keys. ruins fuzzes its save loader and tests that every saved component serializes safely (`internal/save/serde_safety_test.go`, fuzz corpus). Verified: dspace file; ruins by file list and docs. OOPS check: my grep for a shared limits table found nothing, but OOPS handles `__proto__` per module.
- Fit: OOPS imports world packs and saves, and AD22 says integrity is the one thing worth hardening.
- Effort: 1 to 2 days.
- License: MIT and GPL-3: take the ideas, not the code.

## Smaller ideas worth a note (not top 5)

- **OAB6** Tiered affix families with weights and item-level gates (webidler `data/item_affixes/*.json`). Only if OOPS wants rollable items.
- **OAB7** Schema metadata on registries to feed validation and docs (AngbandOS `CONTRIBUTING.md`; blackbird `Record.define` that throws on bad data at registration).
- **OAB8** Text templating with a "woven twice" guard (blackbird `docs/reference/weaver-system.md`). Fits the life-sim prose direction.
- **OAB9** First-time "memories" that persist across lives (immortalityidle `achievement.service.ts`). Could pair with sealed-secret discovery.
- **OAB10** Lifespan as named, explained buckets (immortalityidle `character.service.ts`).
- **OAB11** Leftover-work carry so slow rate output does not round down to zero (immortalityidle `followers.service.ts`).
- **OAB12** Mod save contract: JSON-safe bucket, error names the bad path, active mods recorded (parasite `parasite-mod-sdk/docs/11-save-data-pitfalls.md`).
- **OAB13** Bot playtester with play-style profiles over seeds (nouron `Playtest.php`). Large; OOPS already has a headless game MCP, so extend that instead.
- **OAB14** A content-record hardening ledger (dspace `hardening.js`). Risk of bloating records.
- **OAB15** Behavior-tree NPC schedules (Yarl2 `Planner.cs`). Only if NPC daily schedules are on the roadmap.

## Per repo

**dspace** (MIT). Astro and Svelte educational quest game; no prestige or combat, so little mechanical overlap. Useful: findings 1 and 5 above. Timestamp-derived process timers (`gameState/processes.js`) are a pattern OOPS's time bank already covers in spirit. Its 524-line `AGENTS.md` is longer than OOPS's own guideline; nothing to adopt there. Server and cloud-sync parts are irrelevant.

**webidler** (GPL-3). Rust, server-authoritative; no offline progress, about 7 test markers. Useful: the unified effect model (idea 4), manifests that reject unknown JSON fields (`backend/src/game/data/manifest.rs`; compare with `Verify_Game_Objects`, about a day), skill mastery as persistent per-skill XP with an upgrade shop (`skill_mastery.rs`), prestige costs held in data (`data/temple/*.json`), and Legacy realms that park old characters after a big rebalance (`realms.rs`). Its 1208-line visual passive-tree editor (`tools/src/pages/passives.rs`) shows a local content editor is feasible, 2 to 5 days per registry. I did not search exhaustively for balance tooling.

**immortalityidle** (no license, ambiguous). Angular/TypeScript. Its banked-time idea is already in OOPS. Remaining ideas are the small ones listed above (memories, lifespan buckets, leftover work). Structure is weaker than OOPS: 6.9k-line services, no registry or validator, no visible save migration. Low yield.

**INCREMENTAL_GAME** (no license). One idea: event and reducer buses, plus a single `getValues(level)` that feeds both tooltip and logic so text cannot drift from behavior (small). Its prestige-tree-as-JSON with a different tree per prestige is mildly interesting. Otherwise nothing useful.

**button-clicker** (MIT). About 900 lines, plain localStorage persist with no versioning. Nothing useful. Not worth more time.

**blackbird** (CC BY-NC-SA). Reviewed at systems level only. Useful: the soak runner (idea 3), `Record.define` validation, requirements as composable predicates, the weaver guard, balance report scripts from data, and tasks as markdown with front matter compiled into an index. Its consent model shows the computed chance before the player commits, a UI pattern worth copying in spirit. I did not read its save handling.

**ruins** (GPL-3). Go. Useful: ideas 2, 3 and 5. Many-seed connectivity test per planner type (`mapplanner/metaplan_connectivity_test.go`) is a small fit for OOPS sites, though `check_generators.mjs` may already cover similar ground. Its save version handling is only "reject if not equal", weaker than OOPS's migrations. The AST-walking lint rules duplicate OOPS's `check:rules` and `check:arch`.

**Yarl2** (CC0). C#. Seeded RNG saved with the game and monster decks are already in OOPS (`seeded_streams.js` includes a `deck` family). Behavior-tree NPC schedules and one-line content formats are possible but low priority. No tests found.

**AngbandOS** (Angband license, non-commercial). About 9.9k C# files. The lesson is mechanical consistency: engine and game pack split, behavior as small named classes, schema metadata read by reflection to generate docs. That is a long-term direction, not a task. Formula expressions in data were inferred from project names, not read. Test suite unconfirmed.

**parasite** (GPLv3). Haxe roguelike. Useful: timed effects with add and remove hooks, spawn budgets with chance, cooldown and cap growing with cult size (`src/cult/Ordeal.hx`, `Effect.hx`), a human-readable ordeal table that a repo rule forces to be updated in the same commit (`reports/cult-ordeals.md`), and checking generators across thousands of seeds (`tools/genrun.mjs`). The faction escalation code was only skimmed. The rest is tactical AI and rendering. Worth a skim only.

**nouron** (GPLv3, assets CC BY-NC-SA). Useful: idea 2, plus seeded-roll tests born from a real overflow bug (`tests/Unit/GameTickSeededRollTest.php`) and an ADR saying event listeners may observe but never change state the tick reads. Balance quality itself was not judged; the numbers were not read. No offline catch-up to learn from.

## Not worth more time

button-clicker (nothing useful), INCREMENTAL_GAME (one cheap trick, license blocks code), immortalityidle (best idea already built), parasite and AngbandOS (skim only if a specific question comes up).

## One-line recommendation

Try first: a gate-necessity simulation (idea 1) over the Klein campaign stages, with the half-day flaky-test soak runner (idea 3) as a warm-up.
