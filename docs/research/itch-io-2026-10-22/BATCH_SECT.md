# Batch decode: sect and management cultivation games (2026-10-22)

Static reads of seven itch.io builds, per [the decode brief](DECODE_BRIEF.md).
Everything below is a proposal (AD32), not accepted direction. Raw files, hashes
and line locators are in gitignored `private/<slug>/`. Paraphrase only; no code or
prose is copied. Mapping codes: AD38 (mechanisms, not allowed-outcome lists) and
the rule families in `docs/RULES_INDEX.md`.

Labels: `source` = found in code; `stated-not-found` = claimed but absent;
`inferred` = reasoned from code, not directly shown.

## 1. Ascending the Dao (CygRyu), v0.3.5.1 line

- **Build**: HTML5, `html/19618518`, `js/game.js` 279,964 B, sha256 prefix
  d074795e. Plain JS, single-line minified; esbuild pretty-print only. Derived
  from Progress Knight (the page links the upstream repo). No license stated.
- **Systems**
  - Two interlocking ladders, `source`: the sect ladder (Servant to Grand
    Patriarch, 8 jobs) and the realm ladder (Qi Refining to True Immortal, 8 jobs).
    Each sect job above Outer Disciple unlocks only when a named realm job has
    reached a level (Inner Disciple needs Foundation 1, Core Disciple needs Core
    Formation 1, Elder needs Core Formation 10, Grand Elder needs Nascent Soul 1,
    and so on), plus a body skill and the previous sect rank at 10. Realm jobs are
    in turn gated by one skill (Qi Control at 400, 700, 1000, ...) and the
    previous realm at 10. Pretty-printed `game.pretty.js` ~3946 (requirement
    table). So "the sect refuses promotion if cultivation lags" is `source` as an
    unlock requirement; whether the UI states the reason was not checked (requirement
    rows are built at ~1758-1779).
  - Sect standing perk, `source` (~229-242): each unlocked sect rank adds a flat
    percentage to cultivation xp for the rest of that life.
  - Tribulation every 25 levels per task, `source` (~560-660). Progress seals at
    the cap. Choices: pay (cost = job income x level x 8, or 50 x level for skills,
    reduced by relics) or defy (base 50%, clamped 5 to 95%, modified by relics and
    one Righteous-path skill). Success adds a permanent 10% per tribulation to that
    task's xp (scaled by a relic factor). Failure removes 20% of the task's levels
    (at least 1) and zeroes xp. One relic grants a single reroll. Five auto-modes
    exist (manual, pay when affordable with a 30-day expense reserve, always defy,
    always pay, defy below a per-task level limit). The defy bonus counter is not
    in the rebirth reset list (~2237), so it very likely persists across lives
    (`inferred`).
  - Heretical path, `source` (~3197-3230): the Demonic Forge unlocks at 500
    Demonic Qi. Price grows 25% per forge; rarity table Rare/Epic/Mythical with a
    pity counter (two dry Rares force Epic or Mythical). Spending all remaining Qi
    ends the heretical path; a Renounce action exists. The forge yields relics, not
    flat stat bonuses.
  - Righteous path uses Merit with its own technique unlocks; the two paths seal
    each other's techniques unless a relic ("twin dao") is active.
  - Also present, not traced: pills with durations and rebirth-keeping flags,
    lifespan, a root/seed system, relic bag and adventure, an "ascension" ending
    with answered questions and ranks.
- **Representations**: one odds line itemizing the base chance and each
  modifier (~592); auto-resolved tribulations are summarized in one note every 10 s.
- **Improvements**: the "defy only below a level limit" auto-mode answers the
  cost of failure growing with level.
- **YAIR mapping**: the pay-or-gamble gate maps to body and realm breakthrough
  (`src/body_progression.js`, `src/proto23_world_content.js`) and AD38 (a
  cost-or-risk choice is a mechanism). No existing "pay for a safe breakthrough"
  choice was found by grep (not exhaustive). Paired sect/realm ladders have no
  direct equivalent found in `src`.

## 2. Patriarch: Murim Idle (BBK Solo Games), build v1.13.66

- **Build**: HTML5, `html/19033727`, one `index.html` of 61.4 MB (485 embedded
  base64 images), 2.2 MB once those are stripped. sha256 prefix 05ba5ce5. Readable
  inline JS, 8 languages. No license.
- **Systems** (richer than the page suggested)
  - Disciple record, `source` (~13132): rank (outer, inner, core), talent 1-5, cult
    level, training xp, assignment (idle, meditate, train, gather, mission),
    per-rank mission counters, trial level, specialization, pill totals, and a
    16-entry milestone history (joined, first mission, breakthrough, promoted),
    each keyed so it fires once (~13143-13160).
  - Promotion is a six-line checklist, `source` (~13081): disciple talent,
    disciple cult level, missions done at the current rank, the patriarch's own cult
    level, sect reputation, and a Qi plus stone cost. The player's realm gates the
    disciples' rank.
  - Specializations (qi, martial, gather, envoy, instructor) as multiplicative
    roles with a "master" tier; elder offices (training, mission, quartermaster,
    grand) unlock by sect rank and need a trial level; 10-minute change cooldown.
  - Artifacts fitted to individual disciples with a projected-fit score (~15109).
  - Postgame, `source` (~14565): the "legend disciple" must be core rank, past the
    last realm threshold and have at least five meaningful history entries.
  - Campaign ending, then a new sect; regional bosses show a fixed-opponent
    simulation before commit. Events key off per-region run counts.
  - "Enemies grow stronger after each defeat": see the second pass (`source`).
- **Representations**: per-disciple chronicle stories, roster scroll-state restore,
  sect-grounds walkers drawn from present disciples.
- **Improvements**: code comments record two rebalance passes (v1.1.51: Core rank
  stopped tripling output; Envoy bonuses stopped compounding) and a save-import
  hardening pass.
- **YAIR mapping**: once-keyed, capped per-person milestone history fits the
  chronicle and lore history (`src/lore_history_state.js`) and staff
  (`src/home_staff.js`); a visible requirement checklist for rank changes fits the
  UI rules (UR family). A milestone count gating a title was not found in `src`
  (grep, not exhaustive).

## 3. My Cultivation Sect (VoyageStudio)

- **Build**: HTML5, Cocos Creator 3.8.8, `html/19336066`; game code in
  `assets/main/index.js` 162,659 B (sha256 prefix b00f4822), SystemJS modules
  Config, State, DisciplePanel, EventsPanel, HomePanel, HuntPanel, SectPanel.
  Readable after pretty-printing. CrazyGames and Playgama SDK hooks. No license.
- **Systems** (the lineage claim holds, and goes further than stated)
  - Marriage, `source`: spouse links, affection, an "outer Dao companion" state,
    proposals from other sects as events, and affair/divorce/widowing rules with
    cooldowns (divorce 3 years, widowhood 1 year); an exposed affair can end in a
    killing.
  - Conception checked every 60 real seconds (5 game days per second): 20% plus
    trait bonuses, at most 3 children per person, 300-game-day pregnancy, adult at
    6 years, twins, a Fertility Elixir. If the mountain is full at birth the child
    is sent away.
  - Inheritance, `source` (`bearChild`): the child takes the parent's surname
    stem; quality from the better parent with some downward roll; root tier from the
    better parent (50%), the same parent (30%) or a fresh roll; root elements merged
    from both; a small awakening chance when parents share an element; a hidden
    "born trait" revealed later.
  - Breakthrough, `source` (~2392-2412): chance from a base, quality, root tier and
    trait, plus a marriage bonus and a dragon-egg bonus, minus an accumulating
    failure penalty; a guard scroll item blocks death. Failure can be lightning death
    or qi deviation, after which the disciple defects to the demonic path.
  - Win: 15 disciples ascend; ascending clears and widows the spouse.
  - A relation score toward other sects with yearly gifts at 50 or more.
- **Representations**: character sheet lines for parents, child age, pregnancy
  countdown, "Affection" versus "Admire" toward a named person.
- **Improvements**: none found.
- **YAIR mapping**: `src/npc_lives.js` has marriage content, but no inherited
  quality, root or trait from two parents was found in `src`
  (`src/heir_inheritance.js` carries belongings, standing and obligations, not
  talent). Candidate home: heir and household lines (`src/home_inheritance.js`,
  `src/home_staff.js`). Runaway population is answered here by a hard cap and
  adopt-out.

## 4. 开宗立派 P0 (lhg-yxhc)

- **Build**: HTML5, `html/19891661`, one `index.html` 382 KB with one inline
  script (760 lines), sha256 prefix d7e6773b. Plain JS, Chinese UI. No license.
- **Systems**
  - "Forced binary event every 90 seconds" is **refuted for this build**: a v2 log
    line says events became optional pickup. One opportunity spawns every 90
    game-seconds into a queue (max 3, each expires after 180 game-seconds); the
    player opens it when ready, and the game pauses while the modal is open
    (`source`, ~140-141, 520-570).
  - Six events (beast tide, secret realm, passing master, spirit vein, demonic
    provocation, immortal market), two options each. Outcomes are immediate
    resource, reputation, building level or disciple changes tested against
    current power or head count. Nothing is stored except totals: no event memory,
    no branching.
  - Second-layer prestige "Branching Out": at sect level 3, wipe disciples,
    buildings, stones and reputation for lineage points (reputation/100 + 10 per
    sect level + fragments/10), and choose one lineage precept from three (best
    first disciple, 30% cheaper buildings, +50% event rewards), stackable by
    generation.
  - Event picks also grant 1-3 lineage fragments, so events feed prestige.
  - Disciples are only id, name, quality and one trait.
  - Offline: a button simulates 8 hours of resources and states that no events
    are generated.
- **Representations**: list-then-detail modal that prints both options' effects
  before choosing, with a countdown on each pending event.
- **Improvements**: the v1 to v2 move from forced to queued is the author's own
  answer to the popup-versus-interruption question.
- **YAIR mapping**: supports queued, optional, expiring events (no change
  needed). The fragment-feeds-prestige and choose-one-precept-per-generation parts
  map to prestige and heir design. Thin otherwise.

## 5. Xianxia Sect Simulator (saltymint)

- **Build**: Godot 4.6.1 web export, `html/16675370`, `index.pck` 30,984,144 B
  (sha256 prefix 8b0cbf85); the 37.7 MB wasm was not read. The standalone PCK was
  read with the existing `extract_pck.py` after appending its expected trailer to a
  scratch copy (451 files, all MD5 verified); `decode_gdc.py` decoded 31 of 31
  scripts, 0 errors. No license.
- **Systems** (about 950 lines of script)
  - Sect capacity 100 disciples (+50 per level). A monthly tick cultivates each
    disciple; a yearly tick ages, collects stones and recruits from region villages
    (each village 1 in 3 per year if open and not full) (`source`).
  - Positions (outer, inner, elder, leader) have fixed slot counts; promotion only
    works if the next position has a free slot. Each position has a monthly stone
    allocation drawn from sect stock that boosts Qi gain; realms produce stones.
    So "disciples consume and produce stones" is `source`.
  - Qi gain = talent x physique over a realm- and stage-scaled efficacy, times
    region qi density and the best affinity-matched manual in the library.
  - Breakthrough: needs 100 qi at the last stage; a roll reduced by 2 x talent
    against the realm's chance; failure drops 1-3 stages and zeroes qi.
  - Sect upgrade: the cost variable is a local reset to 10,000 on every call, so
    its scaling line has no effect (`inferred`; fits the page's cost complaint). It
    also mutates shared position resources.
  - A world map with other sects exists; its contents were not read.
- **Representations**: roster sortable by realm, talent, affinity, qi, age.
- **Improvements**: none.
- **YAIR mapping**: slot-limited positions with a stone budget per position is a
  minimal allocation model; YAIR household staff already goes further. Low value.

## 6. Drifting Cloud Chronicles (mdoge00)

- **Build**: HTML5, Vite, `html/19498340`; `index-COlxwVe-.js` 78,096 B, `util`
  21,559 B, `save` 6,266 B; readable after pretty-printing. Page sha256 prefix
  2ec6a227. No license.
- **Systems**
  - Carry-over bundle, `source` (`Yn`, ~1018): rebirth keeps the school name,
    founded flag and founding art, learned arts, manuals, karma upgrade levels,
    achievements, unlocks, fragments, karma total, lives count, lifetime stats and
    clock. Reset: realm, gear, path progress, per-life kills, and disciples (re-seeded
    to 2 x the Legacy upgrade level if a school was founded). The confirm dialog
    names this list. Karma gained scales with realm and layer reached (power 1.5),
    3 per flagged milestone, and the square root of life kills.
  - "Deeds" are achievements and stats. **No NPC or rival references the prior
    school name**: it appears only in the player's header and sect screens, and the
    rival list is fixed (`stated-not-found`).
  - Sect unlocks at the summit; naming is a gate. Sect wars: assign disciples to
    vanguard, bulwark and quartermaster, run a 150 s campaign, seize up to 3
    territories per rival for stat bonuses. The text says territory bonuses
    persist across lives, but the rebirth copy list omits the territory record, so
    they most likely reset (`inferred`, text versus code mismatch).
  - Two hidden paths (Blood Moon, Hidden Needle) are bought with karma (30 and 25),
    then selectable at the next rebirth.
- **Representations**: the rebirth dialog states exactly what is kept and what resets.
- **Improvements**: none in comments.
- **YAIR mapping**: an explicit kept/reset list in the prestige UI is a good
  pattern; YAIR's persistence docs (AR family) could name the carry bundle the same
  way. No rival-memory feature to borrow.

## 7. Office Immortal (bluezinger), 1.0.0, code MIT

- **Build**: HTML5, Vite, `html/19686244-2129973`, `assets/index-kDUeIy10.js`
  279,434 B (sha256 prefix b4c182aa), readable after pretty-printing. Code license
  MIT per itch metadata; art and text AI-assisted per the page.
- **Systems**: confirmed floor loss on death (one floor), tribulation boss at each
  realm cap, five item grades with weights 600/280/90/27/3 and 0 to 5 affixes by
  grade, sell versus salvage (stones versus essence), per-affix reroll with
  essence, three paths, reincarnation for Insight from the highest floor, capped
  offline progress. Standard tower idle.
- **YAIR mapping**: none recommended; gear depth is already covered.

## Second pass: the parts left unread in the first pass

Added after Weibao asked for the skipped parts to be read. Same labels.

### My Cultivation Sect: individual lives, the part that matters most

- **Adventure table**, `source` (Config `adventures`, `runAdventures`,
  `applyAdventure`): every adult, non-grounded disciple rolls an adventure every
  150 game-seconds (a "lucky" trait doubles rolls). Twenty weighted outcomes,
  most common are stones, exp, resources; rare ones are the interesting part:
  romance with an outer-sect cultivator, meeting an outer friend, abduction,
  a mysterious pendant (30% death by possession, otherwise a level), a mysterious egg
  that hatches into a sect beast after 3 to 10 years and gives a sect-wide stat bonus,
  an abandoned baby adopted as a new disciple, inner demons (halve exp, or a stacking
  breakthrough penalty), a late senior's cave, a market bargain that can lose 50 stones,
  a "favor" that is repaid years later.
- **Delayed returns**, `source` (`checkMissingReturn`, `checkFavorRepay`):
  an abducted disciple goes missing 0.2 to 5 years; 25% never return, the rest
  come back with gear, a fragment or a cultivation jump. A rescued rogue cultivator
  returns 1 to 3 years later with a gift, named in the log after the disciple who
  helped them.
- **Death and succession**, `source` (`killDisciple`, `checkReincarnation`):
  on death the dead disciple's gear passes to the spouse or a random adult child;
  the spouse is widowed with a remarriage cooldown. A ledger keeps the last 10
  dead; 20% are scheduled to reincarnate 18 game-years later with the same name,
  gender, quality, root tier, root elements and born trait ("bearing the same
  look"), or "found another home" if the mountain is full.
- **Grudges**, `source` (`checkGrudge`): a child born while a parent was
  spurned carries a grudge flag; at adulthood there is a 30% chance they turn
  demonic and seek revenge on the sect.
- **Rivalry**, `source` (`checkRivalry`): two disciples who both like the same
  person can fight for them; the loser sulks for a stretch (reduced cultivation).
- **Traits**: 18 adult traits (e.g. a flirty trait with 10x affair chance, a
  solitude trait that blocks romance for a flat stat bonus, a jinxed trait that
  halves qi deviation), 6 innate born traits that are hidden until revealed by a
  fragment or event (e.g. one embezzles sect stones yearly).
- **Roots**: 7 elements, 5 tiers from mixed (0.7x) to peerless (1.6x); a "root wash"
  item re-rolls with 50% success.
- **Hunts**, `source` (Config `huntTiers`): team of 3, 30-day cooldown, 5 demon
  tiers; each has a required strength and a separate power value.
- **Sect-level rebirth**, `source` (`rebirth`): the only carry is the count of
  ascended disciples (`legacy`), worth 2% cultivation each.
- **YAIR mapping**: this is the closest match to YAIR's lives and household
  systems (`src/npc_lives.js`, `src/home_staff.js`, `src/heir_inheritance.js`,
  `src/lore_history_state.js`). Ideas, all proposals: delayed-return events with a
  named cause (abduction, favor), a death ledger with a chance of return, gear
  passing to a named heir by relationship, a pendant-style gamble with a stated
  death rate. Check against AD38 and the lives/recovery rules before use.

### Patriarch: Murim Idle

- **Enemy growth, `source`** (~12855): required power = base power x growth
  (default 1.32) ^ wins against that enemy, and rewards fall after a per-enemy
  count of "full reward" wins (default 3). The page claim is true.
- **Regions** (~11788): five regions with danger, reward and unlock gates
  combining sect rank, a win count on a named enemy, cult level and a boss kill.
  Regional bosses use a deterministic fixed-opponent simulation.
- **After-fight diagnosis, `source`** (~12940-12976): after a fight the game
  classifies the cause (lost disciple availability, no war charge, low armor
  penetration, poor endurance, or low damage) and prints rounds-to-kill versus
  rounds-to-fall as advice. It also previews the result before committing.
- **World events, `source`** (~11860): eight events, comment states they are
  not random: each fires once after a specific world milestone, with a 2 minute
  cooldown, 3 choices that each cost and gain stated amounts, change faction
  relations, and may require power, sect rank or a building level. A comment says
  the numbers in the choice data are the single source for both preview and result.
- Five factions with relation scores and envoy costs; artifacts owned by
  patriarch or disciple, earned by combat or expedition counts.
- **YAIR mapping**: the diagnosis pattern fits the combat rules (CBR family) and
  the UR family (state the reason); milestone events with data-driven preview
  fit the sites/exploration rules. Grep found no after-fight cause classifier in `src`.

### Xianxia Sect Simulator

- World is a stub: `world.gd` only prints, the world template holds an empty tile
  list; resources are binary and were not decoded. Talent roll is heavily skewed
  (about 92% in 1 to 3, 0.1% in 8 to 10), physiques are rare overrides rolled
  against a rarity number, affinity defaults to fire 65%, water 20%, earth 10%,
  wood 4%, metal 1%. Nothing more of value.

### Office Immortal

- **Offline is the same simulation**, `source` (~840-850, ~1190-1205): the combat
  tick is a pure event-driven function over a cloned state with a seeded rng
  stored in the state; offline progress just runs that function for up to
  8 hours (plus 1 hour per "Flexible Hours" rank, max 8) and returns a summary
  of floors, levels, kills, drops kept, sold and salvaged, boosts that ended. No
  separate offline formula.
- Prestige: Insight from highest floor (floor squared over 50, from floor 10);
  four passives bought with doubling costs and rank caps (xp +10%, treasure
  find +5%, offline cap, +2 stat points).
- Realm names are job titles (Intern, Associate, Team Lead, Manager, ... Chairman).
- Three paths differ in primary stat, crit and damage multipliers, lifesteal and a
  burst rule (Talisman: every 5th hit x5).
- **YAIR mapping**: matches the branch/offline clock direction; the single
  shared tick for online and offline avoids drift. Already close to what YAIR does.

### Ascending the Dao

- **Ascension trial**, `source` (~908-1000): after True Immortal 25 the trial asks
  three questions two game years apart, each answered Steady, Measured or Bold,
  with stated hold chances and points. Points (0 to 9) set a rank 1 to 4 for one of
  three endings (righteous, heretical, both). Results are seeded from the save's
  root seed, life number and stage, so reloading does not re-roll. A later trial can
  raise a rank but never lower it; bonuses have a soft cap. Offline answers default
  to Steady.
- **Spiritual root**, `source` (~369-452): derived from the same seed and life
  number, so a given life's root is fixed; revealed at Qi Refining by a test.
  Element count sets speed grade, quality sets position inside it; elements boost
  matching skills.
- **Ruin search**, `source` (~2722-2830): four ruins; entry fee is days of your
  best abode's expense; income falls to 20% while away; the chance of finding a
  relic and of danger both rise with days spent (quadratic accumulation), a
  warning appears before danger, and a realm bonus helps up to 1.5x.
- **Life summary**, `source` (~2840): each life ends with gains, and records are
  compared with previous bests ("first life: everything is the mark to beat").
- **YAIR mapping**: seed plus life number is a clean anti-save-scum rule for
  one-time rolls (AD22 says anti-cheat hardening beyond save integrity is not a
  priority, so this is optional). The ruin search with a rising hazard and a fee
  fits sites/exploration (SR family).

### Drifting Cloud Chronicles

- **War math, `source`**: win chance = 0.5 + 0.4 x log2(vanguard power / enemy
  defense) + up to 10% from quartermasters, clamped 3 to 95%. Enemy defense
  multiplies 1.6x per territory already taken. Loss kills about 15% of the
  committed disciples, reduced by the share of bulwark; a lost campaign may reduce
  training.
- Buildings (training hall, meditation hall, garden, library, treasury) gated by
  realm; each gives a per-level percentage, max level 10, cost x1.7 per level.

## Third pass: remaining unread parts

### My Cultivation Sect: sect-level events, offline, crafting

- **Offline settlement**, `source` (`settleOffline`): capped at 720 minutes; it
  adds grain and wood, subtracts disciple upkeep by realm, and adds cultivation
  exp but clamps each disciple's exp to one point below the next level. So offline
  never breaks through, ages, marries or triggers life events; those need the
  player present.
- **Inter-sect layer**, `source` (`checkSectEvents`, `raidSect`): one open sect
  event at a time (buy grain, buy gear, joint hunt, marriage, challenge) from a
  rival sect. Relation of 50 or more yields yearly gifts; -50 or less invites raids
  that either get repelled (stones gained) or plunder grain. A player-led crusade
  needs hostile relations and has a cooldown; it sends the top three disciples and
  the win chance is their tier sum over three rolled enemy tiers. Success costs 20
  relation, failure costs 10 and pays compensation. Rewards scale with the total
  of all disciples' tiers.
- **Demon revenge**, `source`: expelled or fallen ex-disciples are kept in a list
  and each year may return; the sect's strongest member fights at tier over tier
  plus theirs, killing them 30% of the time.
- **Egg hatching**, `source`: 6 beast types by weight; the dragon adds a sect-wide
  breakthrough bonus, others give the carrier a stat bonus.
- **Gongfa and scrolls**: fragments buy sect-wide cultivation levels (+8% each,
  cost 4 + 4n); root wash costs 2 fragments (50% up, a smaller chance down by
  tier, else unchanged with elements re-rolled); a life elixir adds 15 to 30 years
  for 6 fragments plus grain; a dead disciple can be revived from the ledger
  (`revive`).
- **Gear** is generic: 5 slots, 4 qualities, tiers, an optional bonus line, craft
  one or ten, batch sell or salvage, auto-equip best by value. Nothing distinctive.
- **YAIR mapping**: offline excluding life events is a deliberate choice worth
  comparing with the branch/offline clock rules in `docs/RULES_INDEX.md` before
  use. The one-open-at-a-time inter-sect event with relation-driven gifts and raids
  fits the sites/exploration and companions rules.

### Patriarch: expeditions, tournaments, alchemy

- **Expedition**, `source` (~16602): pick region, party and duration; refused if
  party power is below the required value; reward and artifact bonuses are fixed
  at departure and stored on the run. Completion records an `expedition:<region>`
  milestone on each member. Offline play runs the same stepped simulation and
  finishes an expedition mid-gap if its timer ends.
- **Tournaments**, `source` (~11810, ~12198): three tiers; required power = base x
  growth (1.25 to 1.30) ^ wins; the outcome is three deterministic thresholds
  (62%, 82%, 100% of required), so a loss is partial and never random; repeat
  rewards drop to about 35% of the first; cooldowns 10, 30 and 60 minutes; each is
  hosted by a faction.
- **Faction conflicts**: required power scales by 1.30^wins and rises with how
  hostile the relation is.
- **Alchemy**: four recipes (disciple-targeted: spirit, bone, insight; sect-wide:
  war charge), gated by sect rank and library level. The war charge appears as a
  named reason in the combat diagnosis.
- **YAIR mapping**: deterministic threshold outcomes with a stated preview fit the
  preview-before-commit direction; no new owner.

### Office Immortal: floors and shop

- A floor is 9 basic enemies, one elite and one boss, scaled by 1.2^floor with a
  separate xp curve; tribulation bosses use realm-named audits ("Annual
  Appraisal", "Hostile Takeover", "Heavenly Audit"). A rotating shop offers chests
  and timed boosts (xp, treasure, stones). Combat is a timeline of next-event times
  (attack, qi, wind-up, pending effects) processed in order, which is why offline
  can reuse it.

### Ascending the Dao: relics and pills

- **Relic structure**, `source` (~2367): five rarities decide stat rows (1, 2, 2,
  3, 4) and scale; reroll cost grows 1.35x per reroll; bag slots 3 to 10 and equip
  slots 1 to 4 are bought with stones or unlocked by mastering a path.
- **Uniques that bend a rule**, `source` (~3275): Tribulation Magnet (tribulations
  come sooner and defy rewards are multiplied), Sect Seal (larger per-rank perk),
  Unbroken Vow (a righteous rebirth keeps more levels), Borrowed Time (once per
  life, survive old age), Twin Dao (righteous techniques work on the heretical
  path), plus Karmic Wheel, Patience, Hoarder, Virtue Returns, Rebirth Spark. Each
  is an exception with a stated condition, not a flat stat.
- **Pills**: timed multipliers, some kept through rebirth, five alchemy tiers gated
  by realm and cost, with path-aware effects (data near the top of `game.js`).
- **YAIR mapping**: relics that change a stated rule, each with its own text,
  match the "default, dial and reason" framing in AGENTS.md. A candidate for the
  gear depth or body progression lanes; not accepted.

### Xianxia Sect Simulator: resource values

Decoded with a small `.res` reader written in the session scratchpad (the existing
tools do not read `.res`). Realms: Mortal, Qi Refining, Foundation, Core Formation,
Nascent Soul, Soul Formation, and Void Amalgamation; breakthrough chance falls
80, 70, 60, 50 to 30 at the top. Stone production per disciple jumps 4, 16, 1024,
4096, 16384, far steeper than the stone allocation caps (outer 1/10, inner 10/100,
elder 50/500, leader 100/1000), a likely source of the page's cost-scaling
complaints. Positions have fixed slot counts (100, 50, 5, 1). Physiques roll against
a rarity number (Heaven's Chosen 1 in 50,000 at 5x talent; Four Elements and Abyss
1 in 10,000; "Cat Ears" is a joke at 500x talent, 1 in a billion). Regions carry
qi density and a village count that drives recruitment.

## Fourth pass: trials, offices, affixes, guide text, pills

- **Patriarch trials and elder offices**, `source` (~11944, ~12120): two trial
  levels per disciple, each needing rank, cult level, disciple power, sect rank
  and a Qi plus stone cost; trial level 1 unlocks a specialization, and trial
  levels unlock elder offices (training, mission, quartermaster, grand). An elder in
  office does half normal work and 75% of normal combat power as the duty cost.
  Office quality = 3.5% + talent, cult level and trial bonuses, +3% if the
  specialization matches, capped at 22%. Only one disciple per office, 10-minute
  change cooldown. Disciple pills (qi, power) stack to 5 doses at +4% each.
- **Faction relation changes region math**, `source` (~12170): a friendly
  controlling faction lowers the region's required power 8% and raises rewards 12%;
  a hostile one raises required power 18% and reputation reward 20%. Relations are
  clamped to -100..100, with envoys buying +10 up to 60.
- **Office Immortal affixes**, `source` (~99): 9 affix stats (crit chance and
  damage, attack speed, lifesteal, max hp, defence, qi regen, stone find, treasure
  find) with a low/high range scaled by item level and a roll per affix; three
  immortal uniques (damage, max hp, attack speed); three "arrays" (binding,
  illusion, killing) that attach to gear, with strength by grade. Each affix keeps a
  stored roll so rerolling one affix cannot repeat another.
- **My Cultivation Sect guide text** states the design intent: disciples
  "cultivate, train, stir trouble, and grow on their own" while the player "points
  the way"; no grain means disciples flee; failed breakthrough wounds the Dao Heart
  and a scroll ward insures key attempts; adventures are meant to be read as a
  story in an Adventure Log where a golden name opens a person's detail.
  `source` for upkeep: realm-based grain upkeep list in Config (`upkeepLinggu`).
- **Ascending the Dao pills**, `source` (data near top of `game.js`): seven pills,
  three kept through rebirth (technique xp x2, job xp and pay x2, all xp x1.5)
  and five alchemy pills that double xp for the pair of realm jobs they match and add
  0.8x path-category xp, with durations of 1 to 2 years that stack up to a maximum.
  Alchemy is revealed by Qi Refining.
- **Godot wasm**: engine binary only (Godot 4.6.1); game logic is in the decoded
  scripts, so nothing further to read there.

## Top findings

1. **My Cultivation Sect's individual-life layer** is the richest lead: two-parent
   inheritance of quality, root tier, merged root elements and a hidden born trait;
   plus delayed-return events (abduction, favors repaid years later), death ledger
   with 20% reincarnation, gear passing to spouse or adult child, grudges and
   rivalries. YAIR's heir code carries goods and standing but no parentage traits or
   delayed named-cause events (grep of `src/heir_inheritance.js` and `src/npc_lives.js`).
2. **Ascending the Dao's tribulation and ascension trial**: explicit odds line,
   20% level loss, permanent per-task bonus, auto-modes that cap exposure, and a
   seeded three-question trial that cannot be re-rolled by reloading.
3. **Patriarch's after-fight diagnosis and milestone events**: a lost fight is
   classified by cause with rounds-to-kill versus rounds-to-fall, and world events
   fire once on a milestone with preview numbers taken from the same data as the result.
4. **Patriarch's promotion checklist and history-gated legend title**: six visible
   requirements including the player's realm and sect reputation; a capped, once-keyed
   per-person milestone history gates a postgame title.
5. **开宗立派 and Office Immortal as confirmations**: events are a capped, expiring,
   optional queue with totals-only results, and offline progress should be the same
   tick as online (both match current YAIR direction).

## Verification

Read in the first pass: the seven itch pages (headers, iframe URLs), `game.js`
(requirements, tribulation, forge, rebirth), Patriarch's disciple, promotion,
specialization, postgame and artifact code, the Cocos bundle (Config, breeding,
breakthrough), 开宗立派's whole script, Drifting Cloud's three modules, the Godot
scripts, Office Immortal's grades and prestige.
Read in the second pass: My Cultivation Sect's trait, root, adventure, death,
reincarnation, grudge and rivalry code; Patriarch's regions, events, enemy growth and
combat diagnosis; Ascending the Dao's ascension, root seed, ruin search and life
summary; Office Immortal's offline and prestige; Drifting Cloud's war and buildings;
the Godot world stub.
Third pass added: My Cultivation Sect's offline, inter-sect, crafting and scroll
code; Patriarch's expeditions, tournaments and alchemy; Office Immortal's floors and
shop; Ascending the Dao's relics; the Godot `.res` values.
Fourth pass added Patriarch trials, offices and faction modifiers, Office Immortal
affixes, My Cultivation Sect guide text and Ascending the Dao pills. Not read: art
and audio, the Godot engine wasm, and individual translation strings. Nothing was
executed. About 130 tool calls in total, one 429 on two itch pages (waited 90 s once), no downloads
beyond the HTML5 files and one `.pck`. Nothing committed.

## Gap ledger

| Gap | Status | Evidence or locator |
|---|---|---|
| Ascending the Dao: does the UI state why a sect rank is locked | closed | `game.pretty.js` ~1750-1790: the next locked row lists each unmet requirement as task, current level over required level (only unmet ones shown) |
| Patriarch "enemies grow stronger" | closed | `stripped.html` ~12855, growth per win |
| Drifting Cloud rival remembers school name | closed, not found | rival list fixed; school name only in own header and sect screens |
| Drifting Cloud territory bonuses persist across lives | closed, inferred reset | rebirth copy list (`index-COlxwVe-.pretty.js` ~1018) omits `conq`; page text says persist; needs play to confirm |
| My Cultivation Sect outcomes of hunt, home, crafting, offline | closed | `main.pretty.js` 2625-2640, 2852-2916, 2949-2995 |
| Godot wasm | unreadable: engine binary, no game logic | scripts and `.res` values decoded instead |
| Godot world map contents | closed | stub: `world.gd` prints only, empty tile list |
| Art and audio assets | low value: not mechanisms | Patriarch base64 images, Cocos and Godot textures |
| Per-language translation strings | low value: same mechanics in 8 languages | Patriarch, Office Immortal |
| Server-side behavior (cloud sync, ads, leaderboards) | server-side | Office Immortal sync codes, My Cultivation Sect ad hooks; client code only |
| Real feel of pacing, odds and UI | needs play | nothing was executed |
