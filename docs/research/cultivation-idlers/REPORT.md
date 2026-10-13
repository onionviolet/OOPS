# Cultivation browser idlers: source audit (2026-10-13)

Four browser cultivation idlers, read beside the existing [Immortality Idle](../immortality-idle/REPORT.md), [Tale of Immortal](../tale-of-immortal/) and [Amazing Cultivation Simulator](../amazing-cultivation-simulator/) lanes.

**Answer first.** Two of them add things the earlier lanes lack.

- **Cycle of the First Dawn** is the strongest reference. Its written design law (F1) says a system stays invisible until earned, never disappears once seen, and its labels deepen with understanding. That matches YAIR's sealed-secrets and discovery direction better than any earlier lane. Its breakthroughs are **skill trials, not dice** (F2): failing a major one seals half your elemental power for five lifetimes' worth of lived years, carried across reincarnation. Nobody dies of it, but failure costs lives of time.
- **Path of the Idle Cultivator** makes every breakthrough a 50-turn tribulation duel that usually kills you, so death is the planned engine of the next life (F9). It adds a dantian with size, purity and demonic corruption (F10), and soul weapons kept across all lives.
- **Infinite Dao** is a deterministic career-ladder idler where lifespan is the main currency (F12), close to Groundhog Life.
- **Idle Xanxia** is a combat floor-climber where the realm is a label for level (F13). Lowest fit, but its save engineering is strong (F14).

Findings and packets are proposals, not accepted decisions.

Labels: verified (code) = read statically in the downloaded build; verified (page) = official page or plain HTML; inferred = this lane's assessment. Nothing was executed.

## Sources

| Game | URL | Build | Version and hash | License |
|---|---|---|---|---|
| Cycle of the First Dawn (DoorWatchers) | https://doorwatchers.itch.io/cycle-of-the-first-dawn | HTML5, readable unminified ES modules (~102 files) | Beta 1.3.4 Hotfix 4, save schema 64; src sha256 `ffc07ef9a9b1dcf70ec6c35175b64cfe14fca2a2f165e82351df5750fb38378a` | None stated; all rights reserved by default; ideas only. AI-assisted per the developer |
| Path of the Idle Cultivator (Wuxia Dev) | https://wuxiadev.itch.io/idle-cultivation-path, https://cultivator-path.com/, Steam 5007580 | HTML5, obfuscated 18.9 MB bundle | sha256 `42029c9283d2cd43d20787b932027aea8344a8a2d108e545b97698db713ea404` | Proprietary; stopped at page level |
| Infinite Dao (Compression) | https://compreesion.itch.io/infinite-dao | HTML5, Vite/React minified | Beta 2.0; sha256 `f2f9a5d71809fbe7d5d7f59fa2e7122333fe9ef65095907a6c5a59e67c386b02` | None stated |
| Idle Xanxia (Cezae) | https://cezae.itch.io/idle-xanxia (also Steam Early Access) | HTML5, Vite minified | Alpha v0.7.1; sha256 `8367b5fa39d301511b7536ed45a038807b581422fcefc9180fedfd40aa5d5fbd` | None stated; AI-assisted per the page |

Locators below are file:line in Cycle's `src/`, or line numbers in beautified copies of the Infinite Dao and Idle Xanxia bundles kept in session scratch.

## Findings

| Code | Label | Finding |
|---|---|---|
| F1 | verified (code) | **Cycle: Universal Revelation Rule.** `data.js:5-13`: locked systems are invisible, a revealed thing stays revealed, labels deepen with understanding. Enforced in practice: tabs appear only when earned (`main.js:11340-11360`), no collection fractions or 1-of-N checklists are shown (`techniques.js:635`). |
| F2 | verified (code) | **Cycle: breakthroughs are skill trials, failure costs lifetimes.** No realm dice. A Core 0 plus 9 Mortal Cores, each with a private and a public name (`paragon_towns.js:17-27`), gated by element levels, resolved town histories, Qi and physically reaching places (`techniques.js:1197-1309`). Each breakthrough is a trial: a timed Body path or an untimed Mind pattern puzzle, with a free tutorial pass (`core_trials.js:1-14`, `game.js:28585-28641`). Failing a major Core attempt applies a "Heaven seal" suppressing 50% of every elemental affinity for 5x the lifespan at failure, counted in lived years across reincarnations; failed condensation disperses the committed Qi to regather over 2x lifespan. Neither kills; completed stages are kept (`game.js:28925-28978`). |
| F3 | verified (code) | **Cycle: reincarnation keeps nearly everything learned.** `reincarnate()` (`game.js:43712`) keeps all of `meta`: action mastery, persistent inventory, affinities, techniques, Core, enemy knowledge, zone familiarity, milestones, the bonded beast and last persistent equipment. A new life restarts at 16 in the home village with no money (`game.js:4444`). No heirs. Optional auto-reincarnate and remembered fast-start modes. |
| F4 | verified (code) | **Cycle: lifespan is a ledger, not a realm reward.** Base max age 60 (`data.js:31`); Longevity actions add years by mastery rank up to 100, with further capped sources summed in `lifespanBreakdown` (`game.js:24682`). Physical decline starts at 50% of lifespan, up to a 45% penalty (`data.js:32-33`). Combat loss costs 3-5 days of recovery and kills only if that passes max age. |
| F5 | verified (code) | **Cycle: elements without rolled roots.** 10 elements (`data.js:49-52`). Each life's village sect element comes from a seeded shuffle bag, so every element appears once per cycle. Affinity is permanent, grows from cultivated Qi with steep diminishing returns, gain = gross x 0.015 x multipliers x (1 + a/100)^-4 (`game.js:25105-25130`). |
| F6 | verified (code) | **Cycle: action evolution.** Each work action has 5 named evolutions, one per 100 mastery ranks; XP needed = 327 x rank^0.35 (`game.js:4537`). Towns are huge: 45 dual-element towns with 45 jobs each, 10 element houses, imperial districts with rank-banded jobs. |
| F7 | verified (code) | **Cycle: time-fed discovery.** Wilderness discoveries roll once per 100 cumulative lived years in that region, starting at 1% and rising 1.5 points per miss (`wilderness.js:20-27`). Each wilderness series has 20 one-time discoveries: 1 technique plus 19 permanent bonuses. Relics have a 75k-kill pity timer. |
| F8 | verified (code) | **Cycle: progression-neutral living world.** `lower_realm_life*.js` provide baseline regional life, rotating ambient events, and "posture moments" where mundane local work changes as a regional tyrant escalates, with overlays for later political states. They grant no rewards and set no flags. Authored milestones save only [catalogue id, compact facts] and rebuild text from game data (`authored_milestones.js:89-95`). |
| F9 | verified (page) | **Path: failure-expected breakthroughs.** Every realm ends in a 50-turn tribulation duel most cultivators lose; death feeds rebirth. 50 realms in 7 tiers; origins per life (common, sword, palm, demonic, beast-bond, Heaven Chosen). |
| F10 | verified (page HTML) | **Path: dantian as a vessel** with size, purity, impurity %, demonic % with demonic damage, attunement and a develop meter. |
| F11 | verified (page) | **Path: permanent carry and a founded sect.** Soul power buys permanent upgrades; soul weapons and a Legacy Vault persist across all lives. You found a sect, set its alignment from righteous to demonic, recruit and equip disciples, and send them on missions. |
| F12 | verified (code) | **Infinite Dao: lifespan as currency.** 9 realms with fixed Qi costs and lifespan bonuses; breakthrough is deterministic (no roll), blocked only by death or full impurity. Missions, 5-50 year books and Dao meditation spend years while the world freezes. Rebirth keeps upgrades, scrolls, achievements, discovered skills, read books and Dao progress, and carries XP as 1 + maxLevel x k per job and skill. Eating herbs adds impurity that never decays within a life; at 100, Qi stops ("Qi Deviation"). Alchemy rolls skill + cauldron + random against difficulty into six quality tiers. No offline progress across reloads. |
| F13 | verified (code) | **Idle Xanxia: realm = level label.** Realm derives purely from character level; levels come from combat XP. Rebirth is a soul-or-body choice (+1 Aspect slot up to 8, or +1 stat point per level up to 10); once both cap, permanent-elixir impurity governs further rebirths. Rebirth pills restart you at a higher level. No lifespan at all. |
| F14 | verified (code) | **Save engineering.** Cycle: binary codec with varints, a string table and compression; sectioned envelope where older builds refuse newer saves and unknown fields survive in an extension section; a `_previous` backup slot. Idle Xanxia: 5 slots, a v0-to-v10 migration chain, a "lastGood" recovery path, checksummed `.save` exports. Infinite Dao: field-by-field default backfill, no version. |
| F15 | verified (code) | **Offline models differ.** Cycle banks offline time as Time Points spent on paid high speeds (about 500:1 into simulated time). Idle Xanxia estimates up to 8 h analytically from sampled encounters on the current floor, shown as a receipt. Infinite Dao has none across reloads. |

**New versus earlier lanes:** F1, F2's trial-based breakthrough with multi-life seal, F7, F8, F9, F10 and F11's founded sect are new. F3, F4 and F12 overlap Immortality Idle and Groundhog Life. Chance-based realm ladders are already covered by ACS and Tale of Immortal.

## How YAIRPG compares

- **Reveal law:** hidden skill names (`src/models/skill.js`), discovery cue policy (`src/native_discovery_policy.js`), observation channels (`src/observation_channels.js`). No single project-wide reveal rule and no deepening labels.
- **Breakthroughs:** no realm trial. Cultivation book profiles are source pins only (`src/feature_expansion_book_cultivation.js`). Staged practice exists in `src/techniques.js`.
- **Carry:** heir leftovers only (`src/heir_inheritance.js`); fixed 80-year lifespan (`src/chronicle.js`).
- **Vessel state:** body conditions (`src/body_progression.js`) have no purity or corruption axis.
- **Institutions:** agreed duties (`src/agreed_duty_*.js`); no founded institution.
- **Saves:** versioned migrations (`src/save_compatibility.js`, `src/save_files.js`) are comparable to Cycle and ahead of Infinite Dao.

Packets: [IMPLEMENTATION_PACKETS.md](IMPLEMENTATION_PACKETS.md). Touches: [SMALL_TOUCHES.md](SMALL_TOUCHES.md). Coverage: [CHECKPOINT.md](CHECKPOINT.md).
