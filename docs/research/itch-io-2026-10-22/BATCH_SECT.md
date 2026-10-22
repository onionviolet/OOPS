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
  - "Enemies grow stronger after each defeat": `stated-not-found` (only region-run
    counters seen, not the formula).
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

## Top findings

1. **My Cultivation Sect has real two-parent inheritance** (quality, root tier,
   merged root elements, awakening chance, hidden born trait, surname stem), with
   pregnancy, twins, a population cap and adopt-out. It is the strongest lead for
   heir and household design; YAIR's heir line carries goods and standing but no
   parentage traits (grep of `src/heir_inheritance.js`).
2. **Ascending the Dao's tribulation is a clean pay-or-gamble gate**: explicit
   odds line, 20% level loss on failure, permanent per-task bonus on success, and
   auto-modes that cap exposure at a chosen level.
3. **Patriarch ties disciple promotion to a visible six-line checklist** that
   includes the player's own realm and sect reputation, and gates a postgame title
   on a capped, once-keyed milestone history.
4. **开宗立派 dropped forced events for a capped, expiring, optional queue**, with
   every choice ending in totals only; its fix matches YAIR's existing direction.
5. **Drifting Cloud's rebirth dialog lists what is kept and reset**, but no rival
   remembers the school, and the "territory bonuses persist" text likely
   contradicts the code.

## Verification

Read: the seven itch pages (header and iframe URLs), `game.js` (requirements table,
tribulation, forge, rebirth), Patriarch's inline script (disciple, promotion,
specialization, postgame, artifact fit), the Cocos main bundle (Config, breeding,
breakthrough, panels by grep), 开宗立派's inline script, Drifting Cloud's three
modules, the Godot scripts (sect, monk, game), and Office Immortal's grade, death
and prestige lines. Not read: Patriarch combat and expeditions; My Cultivation
Sect's hunt, home and trait tables; the Godot world and wasm; Office Immortal
combat; Ascending the Dao's adventure, ascension and relic detail; all art. Nothing
was executed. About 65 tool calls, one 429 on two itch pages (waited 90 s once), no
downloads beyond the HTML5 files and one `.pck`. Nothing committed.
