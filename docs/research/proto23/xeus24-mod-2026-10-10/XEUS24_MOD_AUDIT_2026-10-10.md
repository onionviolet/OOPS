# Xeus24 Proto23 mod: audit and what YAIRPG takes

2026-10-10. Research only. Findings and proposals are not accepted decisions.
Companion to the [original Proto23 audit](../PROTO23_VS_YAIRPG_2026-10-10.md).

## 1. Source and coverage

- **What it is**: Xeus24's open pull request 3 on `23html/23html.github.io`,
  head `b27d07a` (v4.7, 2026-09-05 to 2026-10-07). The mod is all in
  `mod.js` (14,038 lines), loaded by one script tag added to the author's
  untouched `index.html`. It also ships a 4,128-line design record
  (`MOD-NOTES.md`), an agent rulebook (`CLAUDE.md`), 48 Playwright tests, CI
  in three browsers, and a userscript build.
- **License**: none. It's kept in the local repository-bank mirror
  (`proto23.git`, refs/pull/3) and is not in git here. We absorb ideas, not
  code or text.
- **Read in full**: all of `MOD-NOTES.md` and `mod.js`, the docs, and the
  key tests, split across six Sonnet readers. Their reports, with a line
  cite for every claim, are in [readers/](readers/):
  - N1: notes, lines 1-2048
  - N2: notes, lines 2049-4128
  - M1, M2, M3: `mod.js` in three ranges
  - P: process and tests
- **Not run**: the mod itself was never played. Its numbers are the mod
  author's own measurements.

## 2. What the mod is, in short

The mod is a long fan expansion that keeps the original game playable by
removing one line. It fixes the original's bugs (some our audit found, and
eight it did not), stretches progression to level 110, and adds:

- cultivation realms with pill bottlenecks
- elemental procs
- an opened Catacombs and a Pill Tower
- a duel ladder
- 2-5 star crafting
- titles with ranks and Renown
- save slots and backups
- a pacing setting
- hidden-tab catch-up
- a generated in-game wiki

Its strongest asset is method. Every change is measured against the stock
game in the same browser, balance numbers live in a committed baseline file,
and each bug becomes a rule plus a test.

## 3. Findings

| Code | Finding |
|---|---|
| F1 | **Titles are the mod's biggest system and the direct input to O1.** Five generated titles per skill, at levels 25, 50, 75, 90 and 110 (465 titles), plus flagship and finished author titles, about 585 in all. Rank 1-10 is derived from the earning level. Each title boosts its own skill's XP by 5-30%, but only the worn one counts. **Renown** is a skill levelled by titles held (steps 2 to 550). Each Renown level makes lower-rank titles passive and adds ×1.05 to all stats (×1.63 at level 10). M1, M2 and N1 §6 have the details. |
| F2 | **The generated names don't work.** The mod's own comments admit "rank word of skill" names blur together. Hand-written names for real-life counters (cat pats, years at home) carry more character. This shaped O1. |
| F3 | **Save-safety lessons.** The original game doubled the title list on every load (241 held became 481). The fix counts from the catalog, never from a rebuilt list. Grant flags are positional, so the catalog has to be append-only. Bonuses are reconciled each tick from a saved record and never stacked. YAIRPG's `character.titles` is a keyed object, so the doubling bug can't happen here. |
| F4 | **Original Proto23 bugs our audit missed.** Rank-7 title tooltip crash. About 30 title tiers never granted. Death energy goes negative from level 11. Shield Mastery defence goes negative at high levels. Luck never raises crit. Item class is derived from the id number. 19 of 62 recipes can't be learned. See N2. |
| F5 | **Process worth copying.** A two-build diff (mod vs vanilla, same measurements). A committed balance baseline JSON. A docs-numbers check. A "render every tooltip" audit. CI across Chromium, WebKit and Firefox. A bug ledger written as symptom, rule, test. See P. |
| F6 | **What we already have.** Open selling with saturation, component and quality crafting, parent skills and category grouping, a geometric capped XP curve, an `unsellable` tag, save migration, one backup save. |
| F7 | **Cultivation design notes**, relevant to any future cultivation world: a bottleneck you work at rather than shop at, a wall sized to the climb, a qi deviation timer on the saved clock, tribulation as a fraction of max HP, and pill prices that follow the realm you failed. M3 and N2 cover these. |

## 4. Ideas worth taking, ranked (proposals)

| Code | Idea | Fit |
|---|---|---|
| O1 | Titles for lifetime counters | **Implemented today**, see section 5 |
| O1b | Rank colours, a worn title, Renown as a collection payoff | Later O1 iterations, only if titles feel good |
| A1 | Two-build baseline: a committed balance JSON plus a docs-numbers check | Process. Cheap, and catches silent balance drift (like the XP bug in section 5) |
| A2 | "What next" readiness page built from live gates | UI. Fits the life-sim legibility goal |
| A3 | Generated in-game codex from live data | Medium. Check the fork's notebook first |
| A4 | Hidden-tab catch-up (no combat replay, capped, recursion guard) | Cheap cousin of offline progress |
| A5 | Backup rotation of 3, undoable restore, Safari export reminder | Save safety |
| A6 | Skill rarity shown as a word as well as a colour | Small |

## 5. O1 implementation (implemented, browser-verified)

**What shipped (proposal content, reversible):**
- [src/titles.js](../../../../src/titles.js): 26 hand-written titles in four
  families (combat, endurance, craft and gathering, life). Each is driven
  by a lifetime counter and has a small optional bonus (+1-3% skill XP, or
  +0.5-3% to a stat).
- Bonuses are derived from held titles on every refresh (`setTitleBonus`
  replaces, never adds), so reloading can't stack them.
- [src/titles_ui.js](../../../../src/titles_ui.js): a Titles panel in the
  Bio tab. It shows held and locked titles, progress counts and the bonus
  text.
- Main loop: a check every 5 seconds of play, plus a silent back-fill on
  load ("Titles recognized from your past: …").
- Save: uses the `character.titles` field that upstream YAIRPG reserved and
  left empty (`{id: {at}}`). Old saves stored `{}`, so no migration is
  needed (an explicit compatibility decision). Unknown ids are kept but
  grant nothing.

**Base-game bugs found and fixed, because O1 depended on them:**
1. **Bestiary kills were never recorded.** After the combat rewrite the hero
   attacks and enemies defend, but `kill_target` only counted attacker
   targets. `enemy_killcount` and the bestiary stayed empty (`src/main.js`,
   kill_target). Inherited from upstream dev.
2. **`game_stats.total_kills` is never incremented** in this fork. Titles
   read kills from the bestiary counts instead.
3. **Every skill XP multiplier was ignored.** An operator-precedence bug in
   `getSkillXPGain` (`src/components/levelable_component.js`) made it
   always return 1. Inherited from upstream dev. **This fix changes
   pacing**: book, race, milestone and category XP bonuses that were
   silently dead now apply. In the test save, Evasion went from ×1 to ×1.1
   and Combat from ×1 to ×1.05 before titles.

Not fixed and out of scope: the skill tooltip prints the literal text
`${skill.xp_scaling}` (`src/display.js`, `update_displayed_skill_xp_gain`).

**Checks run:**
- `node --test tests/titles.test.js`: 6/6 pass (threshold, no double grant,
  normalization, derived bonus after reload, years, view text).
- `npm test`: 279/279 pass.
- `node build.js` rebuilt the bundle.
- Browser, fresh origin `127.0.0.1:18231`:
  - new hero, elder dialogue, Infested field
  - first real kill logged "Title earned: Blooded" through the game tick
  - save and reload keep it with no repeat message
  - a simulated older save (titles cleared, 120 past kills) back-filled
    "Blooded, Hunter" silently
  - Combat XP read ×1.05 without Hunter and ×1.07 with it, the same across
    two reloads
  - "Back Again" was granted live on a real defeat
  - export then import, after wiping titles and kills in storage, restored
    the titles from the file
  - no console errors

**Acceptance backlog (not verified):**
- Weibao plays it and judges the feel.
- Long-horizon titles (years, 10k kills, crafts) haven't been reached in
  play.
- The pacing shift from fix 3 needs a judgment call.
- Panel layout on narrow screens.
- Keyboard access.
