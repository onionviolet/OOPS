# Progression gate overflow policy (GTL4)

**Status: Proposed 2026-10-23.** Agent proposal under
[GTR16](PROGRESSION_GATE_RULES.md) and GTC4. Nothing here is accepted direction
or a standing priority until Weibao says so; no code was changed. Codes use the
prefix GTO. Default, dial, reason and cost follow AGENTS.md design framing (AD5,
AD38): every row is the ordinary case for that world, not a wall.

Direction this serves: the game is idle, so passive progress must keep paying
while a gate waits ([famine/passive direction](USER_VISION.md#food-benefits-and-famine-consideration-2026-10-13),
GTR4). Offline accrual is still an explicit future clock decision; the only
catch-up today is a test hook (`src/main.js:9285-9289`, "No player offline policy
exists yet").

## 1. What the code does today

| # | Cap | Where | Excess now | Player sees it? |
|---|---|---|---|---|
| GTO1 | Skill max level (default 60) | `src/models/skill.js:22,192-238` | XP past the max-level threshold is added to `total_xp` (`skill.js:191`) but level and bar stop (`current_xp="Max"`, `xp_to_next_lvl=Infinity`, `skill.js:234-238`). Later gains only grow `total_xp`; nothing reads it as a bank. **Banked-but-inert** | Yes: "Max!"/"Maxed out!" (`display.js:5105-5118`, `5454-5462`), plus an option to hide maxed skills (`main.js:3105`). Not shown: that the XP no longer does anything |
| GTO2 | Parent skill spill | `src/components/levelable_component.js:150-158` | A child that out-levels its parent also grants the parent up to the difference; the child keeps its full gain, so this **mirrors** XP rather than moving it (corrected 2026-10-23, [GTL10 report](gm/dispatch/progression-gates-2026-10-23/GTL10_REPORT.md) F1). Earlier wording called it **spilled into neighbour** (the one existing GTR16 spill) | No message |
| GTO3 | Per-gain XP cap (0.1 of next level; crafting 0.25) | `src/config.js:29-30`, `levelable_component.js:135-137`, `main.js:843` | The excess of a single gain is **dropped**, not queued. Bypassed with `cap_gained_xp:false` (`main.js:2221,4106,5487`) | No |
| GTO4 | `can_level=false` skills | `skill.js:180-182` | All XP set to 0. **Lost** | Unclear |
| GTO5 | Hero character level (`LevelableComponent.addXP`) | `levelable_component.js:65-90` | No cap found; level grows without limit. **No overflow** | n/a |
| GTO6 | Mistglass condensate reserve (capacity 10000 sub-units, 125/min, so 80 min to fill) | `src/absorb_p23/world_adaptation/profile.js:8`, credit clamp `index.js:92` | Production past capacity is **lost** (`credited` is clamped; no remainder is stored). Practice drills run "even with a full reserve" (`techniques.js:6-7`) | Reserve and capacity shown (`index.js:144`); the loss is not stated |
| GTO7 | Mistglass practice minutes (Integrated at 48) | `techniques.js:13,27` (`Math.min(48,...)`), stage `techniques.js:17` | Minutes past 48 are **lost**; the method has no further stage | Stage label only; unclear whether the player knows the track is finished |
| GTO8 | Path `ceiling` (world cap or flame count) | `src/ascension_paths.js:42-57` | A crossing past the ceiling is blocked even if every fact is met (`capped`). Facts supplied by the caller keep counting, so progress is **held, not lost** | `capped` is in the view; no reason text field |
| GTO9 | Breakthrough failure setback | `src/breakthrough_trial.js:46` (`progress * setback / 1000` lost), pressure added | Stated **loss with pressure** (heart-demon pressure). The module is "not wired into live gameplay yet" (`breakthrough_trial.js:10`) | Designed to be previewable; unwired |
| GTO10 | Cultivation realms in the base frontier world | none in code | The frontier has no realm ladder. Its only caps are skills (GTO1-GTO4) and body conditions | n/a |

What is silently lost today: GTO3 (single-gain excess), GTO4, GTO6 and GTO7.
What is inert but retained: GTO1. GTO2 mirrors rather than absorbs (see its row), so no current cap conserves its excess.

## 2. Proposed policy rows

Vocabulary (GTR16): **banked** (kept toward later use), **converted** (turned
into another currency), **spilled** (pushed into a neighbour), **lost with
pressure** (stated reason and cost). A row is a default; its dial moves it.

### Base frontier world (`base.frontier`), skills

| Cap | Default policy | Dial | In-world reason | Cost or pressure | Player sees |
|---|---|---|---|---|---|
| Skill at max level (GTO1) | **Converted:** excess XP feeds a small "familiarity" bank per skill that lowers the cost of the related maintenance (rust, SLR) and grows the parent skill slowly. Never wasted idle | Conversion rate; 0 turns it into a plain bank | Long practice past mastery still keeps the hands in shape and teaches the wider craft | Small: the bank has its own soft cap, so it is not an infinite stat | Skill row says "Mastered: further practice is kept as familiarity (n)" instead of a bare "Maxed out!" |
| Child skill past its parent (GTO2) | **Mirrored** into the parent (today's behaviour), keep; a conserving spill would change every world and needs Weibao's call | Spill fraction (today: up to the full difference) | A specialty teaches the general craft | None | A line in the skill tooltip |
| Single-gain XP cap (GTO3) | **Banked** as a short-lived "unspent practice" that drains into later gains at the cap rate; lasts until the activity ends | Bank lifetime and drain rate | A big lesson digests over several sittings | Unspent practice fades if the character stops; no hard loss inside one session | A small "digesting" count on the skill row |
| Locked skills, `can_level=false` (GTO4) | **Lost, with a stated reason** ("not yet unlocked / not learnable here") | Per skill: bank instead of lose, when the lock is a world state gate | The skill cannot be practiced yet | The wasted attempt, shown | Gate reason (GTR10) |
| Hero level (GTO5) | No cap by default | Per world cap | none | none | n/a |

### Mistglass conservatory (`p23.mistglass`), the cultivation world present in code

| Cap | Default policy | Dial | In-world reason | Cost or pressure | Player sees |
|---|---|---|---|---|---|
| Condensate reserve full, 10000 sub-units (GTO6) | **Converted or lost with pressure.** Default: excess mist condenses to the sluice and is lost, but a full reserve while a method drill runs adds **vessel strain** (a body condition that slows the next purification). A second route: **banked** into one dose of Cloudseed per N excess units (the existing dose item `p23.mistglass.dose`) | Dose conversion ratio; strain on or off; reserve capacity | A vessel holds only what it can hold; mist pressed past capacity strains the walls | Strain slows trials; dose route costs time and a tool | Reserve bar reads "full: running over" with the strain risk named; a conversion preview if the dose route is open |
| Practice minutes past Integrated, 48 min (GTO7) | **Banked** as "practiced depth," an uncapped count. It does not unlock a stage on its own; later paths or world content may read it (dial) | Minutes per depth point; which method reads it | Practice past full control still deepens the hand | None, apart from time | Method card: "Integrated; depth n" |
| Path ceiling (GTO8) | **Held:** quota facts keep accruing toward the next stage; the crossing opens when the owner lifts the ceiling | Owner-set ceiling per world; whether held progress decays (default no) | A world law or missing flame caps the stage | The wait itself; a rival noticing is an optional pressure | `capped` plus its reason (see GTO13) |
| Breakthrough failure (GTO9) | **Lost with pressure** (setback permille of progress, heart-demon pressure), per the existing trial rules; the lost share goes to stored foundation if a world sets the dial | Setback permille; foundation share | A failed push scatters part of what was gathered | Pressure raises the next risk | Risk quote before the attempt (GTR14) |

Cross-world note: a cultivation world with a realm ladder (for example the
domains catalogued in `docs/RESEARCH_CULTIVATION_PATHS.md`, ASC13 "stored energy
row with capacity") uses the Mistglass rows as the template: stored energy is the
bank, capacity is the dial, and spill goes to strain or to the next realm's
foundation.

## GTL6 implemented: per-world single-gain overflow (2026-10-23)

Weibao picked O3 (GTO3) and added "maybe make it depend on the world, since each
world might be different". `src/skill_overflow_domain.js` now owns a per-world row
table, `SKILL_GAIN_OVERFLOW`, applied where `LevelableComponent.addXPToSkill`
caps a gain. Rows are proposals; each world pass may add its own.

| World | Policy | Dial | In-world reason |
|---|---|---|---|
| `base.frontier` | banked | `limitLevels: 1` (bank holds up to one level of XP), `drainRatio: 1` (each fresh gain releases at most as much again, never past the cap) | A big lesson digests over several sittings |
| any unlisted world | lost, stated | none yet | Practice past one sitting's limit does not carry here |

Changes from the GTO3 proposal row: the bank does not fade when an activity
stops (that needs activity hooks; a fade dial stays LATER), and draining matches
the fresh gain instead of filling to the cap. A browser run showed that
cap-filling let a 12 HP regeneration tick pull 1,150 banked XP.

Persistence: optional `skill_overflow` save slice `{schema: 1, bank: {world: {skill: xp}}}`
through the domain registry. Old saves start empty; an empty bank writes no
slice; malformed slices are refused at validation. Banks are per world, so a
frontier bank never drains in another world. Shown as "· digesting n" on the
skill's XP line, with the world's reason as its tooltip. Not covered: the
native settlement quote cap in `main.js` (`p00NativeSkillXP`), crafting's own
cap, and the max-level (GTO1) and locked-skill (GTO4) wording.

Checks: `tests/skill_overflow.test.js` 4/4. Rebuilt headless 1920x1080 run on a
fresh origin ([script](gm/dispatch/progression-gates-2026-10-23/skill_overflow_check.cjs)):
real Regeneration gains drew from a seeded bank (gained = healed + drained,
drained at most equal to healed), the XP line read "1,221 / 1,500 · digesting
39,985" with the reason tooltip, and the bank survived reload and file import
with no console errors. The skills tab list hides Regeneration for this seeded
save ("No matches"), an existing list quirk, so the
[screenshot](gm/dispatch/progression-gates-2026-10-23/skill-overflow-skills-tab-1920.png)
shows the recent-learning line, not the bar. Gameplay feel is not yet played by
Weibao.

## 3. Implementation shape

Extend the GTL2 gate descriptor `{id, kind, requires, reason, dial, routes,
closes, overflow}` with:

```
overflow: {
  policy: 'bank' | 'convert' | 'spill' | 'lose',
  into: <bank id | resource id | neighbour gate/skill id | null>,
  rate: <permille or fraction of the excess>,     // dial
  softCap: <optional cap on the bank itself>,
  pressure: <condition id | null>,                // strain, rival notice
  reason: <player-facing text, subject to GTR10>,
  visible: 'exact' | 'felt' | 'hidden'            // precision follows means (GTR15)
}
```

Where it would apply (no code written):

- Skills: `Skill.add_xp` (`src/models/skill.js:175`) is the one place the excess is
  computed (the max-level branch at `skill.js:192-238`); return `{overflow}` there
  and let `LevelableComponent.addXPToSkill` (`levelable_component.js:111`) route it
  to the bank/spill. The per-gain cap (`levelable_component.js:135-137`) should
  hand back the clipped remainder for the "digesting" bank instead of dropping it.
- Mistglass: `prepareAdvance` (`src/absorb_p23/world_adaptation/index.js:80-92`)
  already computes `earned` and `credited`; the difference is the overflow.
  `advanceCultivation` (`techniques.js:22-30`) holds the 48-minute clamp.
- Paths: `pathView` (`src/ascension_paths.js:45`) gains an `overflow` and
  `cappedReason` field.
- Evaluation stays a pure read (GTR14); overflow is applied only inside the
  commitment or settlement step, with the same staged transaction as an opening
  (GTR12, `native_unlock_transaction`).
- Persistence: banks are new saved fields, so they need a save-compatibility
  note (GTC3) and a default of "empty" for old saves.

## 4. LATER items

Each needs Weibao's go-ahead; none is a required gate.

| Code | Item | Level | Effort | Done check |
|---|---|---|---|---|
| GTO11 | Accept, reject or revise the rows in section 2 and record in USER_VISION and PROJECT.md | designer | small | Weibao's instruction recorded; rows marked Accepted or struck |
| GTO12 | Show max-level skills as "Mastered" with the chosen overflow line; no mechanical change if the policy is plain bank | sonnet | small | Rebuilt browser check at 1920x1080 shows the changed skill row and a gain after max |
| GTO13 | Add `overflow` to the GTL2 gate descriptor and a `cappedReason` to `pathView` | sonnet | small | Focused test: a capped path still accrues facts and reports its reason; no state change from reading |
| GTO14 | Mistglass reserve overflow: strain condition and optional dose conversion, with a quote before any run past full | sonnet | medium | Focused test on `prepareAdvance` shows remainder converted or lost per dial; browser check of the reserve bar over capacity |
| GTO15 | Practice depth counter past 48 minutes with save validation (`techniques.js:13` currently rejects values above 48) | sonnet | small | Old saves load unchanged; reload and import keep the counter |
| GTO16 | Decide the offline clock policy so GTR4 "idle progress keeps accruing" is real at caps, then settle overflow for away time | designer | medium | Policy recorded; test hook `catch_up_ticks` shows banked, not lost, overflow |
| GTO17 | Audit `can_level=false` and per-gain-cap drops for silent losses in other worlds | haiku | small | Table of each drop site with a file:line |
