# itch.io decode batch: engine-built and loop games (life B), 2026-10-22

Static reads only; nothing executed or committed. Raw files, hashes and line locators are in
`private/batch_life_b/NOTES.md` (gitignored) and the per-game folders. Everything below is a
proposal (AD32), paraphrased. No licenses were stated on any page or build, so ideas only.
Claims are labeled `source` (found in code or shipped data), `names-only` (type or member names
recovered, behavior unread), or `stated-not-found`.

## Terraformental (Unity WebGL 6, IL2CPP, v31 metadata) , engine-compiled

Build: itch iframe 17763579, Terraformental_WebGL, brotli `.unityweb`. The IL2CPP dumper's auto mode
failed on the wasm, so this is a **system map from metadata names**; method bodies and the CSV content
files in StreamingAssets were not read.

- **Systems (names-only, strong signal).** A data-driven action engine. Actions have trigger
  requirements and effects as typed objects. Requirement families include: action completed this
  loop, last loop, any previous loop, or never; loop count equal/ge/le; area visited in any loop;
  item picked up this loop or any loop; resource amount, rate, capacity; timed and persistent events
  running or resolving; no rover power. Effects include: alter completions and max completions of an
  action, set action progress, register speed or drain multipliers on actions, set a loop flag versus
  a normal flag, set-known-persistent, discover area or resource, clear queue, checkpoint autosave,
  random and chance wrappers. Separate loop-scoped and run-scoped data resets exist
  (ResetDataInsideLoop, ResetDataOutsideLoop). Items and logs track "unique across loops", "displayed
  this loop vs any loop". A familiarity system exists with partial-group familiarity and a per-loop
  reduction over a soft cap, plus a skill system with required skills.
- **Loop gate.** The loop-ended menu offers wake up or view the death state; a game-over menu offers
  loading the last action or last checkpoint. The developer claim that the loop starts only after
  surviving the first run is `stated-not-found` (no way to read the gating without bodies), but the
  loop-count and loop-started requirement types match it.
- **What crosses a loop (names-only).** Persistent actions and "known persistent" effects, loop flags,
  familiarity and skills, completion counts per action (this, last, all loops).
- **Representations (names-only).** Queue panel with per-action hover panels, "new actions" counter
  that flashes, PDA with map, notes, stats tabs; combined actions with collapsible groups.
- **YAIR mapping.** Closest owners: branch/offline clock and chronicle, carryover rules (AD10 to AD14,
  AD19, AD20, the continuation owner in `docs/worlds/`). YAIR already has `familiarity` mentions in 15 `src` files
  (for example `src/body_progression.js`). Not found in `src`: a typed requirement/effect vocabulary
  keyed to "completed in an earlier life vs this life". That vocabulary is the useful piece, and is
  consistent with the Shirania snapshot idea in the screen's I4 (not re-reported here).
- **Improvements.** None readable.

## Surviving Magic Academy as a Demon Lord (Unity 6000.6, v108 metadata) , engine-compiled

Build: itch iframe 19878782, 86 MB data. Dumper unsupported; used metadata identifiers and string
scan of 743 node records, 42 legacy records, 13 calamity records. Method bodies unread.

- **Systems (source, from shipped data text).** Free-choice node graph; selecting a node starts a
  timed action and completing it advances Calamity progress. "Leisure" nodes do not advance it.
  Other nodes can "delay Calamity by N steps" (up to 50), and one perk delays by 0 when revealing a
  node. Calamity is a combat that tests stats, passives and chosen build. Boss data carries scripted
  stamina-damage rules, last stand, and an overtime timer (names). Confirms the step-count calamity claim.
- **Demon Time (source + names).** A banked resource of seconds ("available (99.99s)", activated by a
  key) that temporarily speeds action time; many nodes grant "+N s Demon Time". Controller has
  DEMON_TIME_SCALE and NORMAL_TIME_SCALE constants. The claim that it keeps hunger and fatigue
  consistent is `stated-not-found`: hunger shows up only as scripted meals and a once-a-day meal hour
  in one location; no scaling code could be read.
- **Schedule queue and planner (names + source).** "Schedule Limit" is an upgradeable stat (+1, +4, +10
  nodes). A SmartPlannerController finds a path to a goal node, looks up which nodes provide a missing
  stat and which reveal nodes, with a search depth and an "opportunistic survival" step. This is a
  goal-driven auto-queue, not just a list.
- **Meta loop (source).** Reincarnation shows a score ledger, exploration progress, and pays "Shadow
  Comprehension" (a meta currency, boosted by "+50% gain" nodes). Ancestral Legacy: 42 origin cards drawn
  in steps by rarity weight, with a "deep trauma" roll that forces a trauma choice, cure conditions, and
  one-shot triggers (for example reaching Reading 20 grants stats). A temporal corruption meter grows
  from "cheated" steps; one origin slows that to a quarter. Menace is a negative stat on some nodes.
- **Representations.** Node-card map, hover tooltips with step progress, onboarding tips, journal,
  newspaper, objective pointer.
- **YAIR mapping.** Goal-driven queue planner vs YAIR's `schedule` code (68 files mention it; no
  planner seen by name). Origin card draw maps to heir/inheritance and life-origin work
  (`src/heir_inheritance.js`, `src/life_experience_host.js`), AD10 to AD14. "Cheating" time builds
  debt rather than being free maps to the branch/offline clock (a cost on speed-ups, AD5 dial and cost).
  `calamity`, `burnout`, `madness`: 0 hits in `src`.
- **Improvements.** Reincarnation-scoped perks are labeled "for this reincarnation", separating
  one-life buffs from permanent ones in text.

## ReCycler (Unity, IL2CPP v27, v0.95.2 "Prestige bugfix") , engine-compiled, dumper worked

Thin and stale (devlog 2021). Dump has 2,217 types; only about 45 are game code.

- **Systems (source, field level).** Each cycle splits time units across sleep, work, research, food,
  maintenance, slacking; a bank with interest and an investment value; tick rate and a slow tick rate.
  Jobs and research skills share one skill class with tiered base XP, reducible base XP, and a
  `MaxLevelMultiplier` with `MaxLevelReached`, which confirms the "bonus from best-ever level" claim.
  Prestige data holds auto-promote, research queue, permanent work and research bonuses, permanent time
  units, food cost reduction; "diminishing" appears in many bonus strings.
- **YAIR mapping.** Close to Progress Knight; nothing new beyond time-unit budgeting (see AD1 to AD8
  livelihood). Skip.

## Simultree (Unity, IL2CPP v27) , engine-compiled, dumper worked

- **Systems (source).** A timed simulation of entities and food on a grid; between runs a tree of
  unlockable entities, items, foods, and simulation parameters. Prestige scoring is a set of optional
  rules, each paying points times prestige level: all entities dead, more entities than at start,
  more food than at start, a birth or death event; points are also multiplied by 1 + level/10. A
  prestige choice screen picks unlocks. Reproduction is a data list of parameter sets.
- **YAIR mapping.** Nothing for the core; the "score rules chosen as unlocks" pattern is a small idea for
  run-end scoring. Skip beyond one line.

## Slime Reborn (Unity 6000.3, v39 metadata) , engine-compiled

Build: itch iframe 18554534-2148206, v0.1.2. Dumper unsupported; serialized definitions were
string-scanned (118 upgrades, 30 quests, 56 achievements, 21 encounters).

- **Systems (source).** Seven slime abilities used in a real-time loop with cooldowns; abilities gain
  XP through use, and the Intelligence stat speeds that. **Hidden combos** are real: 18 combo
  definitions. Two-step combos give a short bonus to the next different ability (+25% resource, Mass or
  buff strength; a few give +100% for a particular pair). Three-step chains grant named effects such as
  +60% of one resource, or "+250% Mass from Consume". A combo-discovered event and a combo tab exist, and
  a quest tells the player to try chaining different abilities. Confirms the hidden-combo claim.
- **Mutations (source).** 18 mutation definitions grouped per ability (Consume, Gather Wood, Gather
  Stone, Absorb Leaf, Vision). They are not bought: **exploration encounters carry discoveries**
  (watching a beetle, a rabbit, a spider, a merchant, a plant), and a discovery unlocks a mutation
  choice for that ability. The first mutation event says the choice is permanent. Mutations change an
  ability's cost, cooldown, yield, or add a side yield (for example Stone chipped loose by Wood).
  Confirms the mutation claim; "rebirth" is `stated-not-found` (no rebirth, prestige or death strings).
- **Resources as stat tiers.** Wood, Stone, Minerals each grant a body bonus while held (toughness,
  shield, hardness) and are consumed by some abilities, so carrying is itself a build.
- **YAIR mapping.** Discovery by observing a creature or place that unlocks a specialization is a fit for
  skill/learning rules (SLR) and site exploration (SR1 to SR24, AD3); `mutation` has 67 `src` hits but in
  other senses. Hidden chain bonuses keyed to action order are not in `src` (`combo`: 2 UI hits).

## Ascension Tower (plain JS client plus server, localized to 7 languages) , readable

Build: itch iframes `ascension-tower-production.up.railway.app`; client and shared data files fetched
(56 files, no obfuscation). The server is authoritative; its code is not served.

- **Systems (source).** "Abyss" is a one-way run entered at a tower floor; the only exit is death
  (client guard comment and codex text). Death opens a **Death Merchant** before the next life: a stock
  of archive items sold for World Fragments earned that run, with five tier prices (10, 20, 40, 140,
  1000), plus a top-end essence lot costing three currencies. After the merchant, the player picks a new
  race from a random offered set; the choice is irreversible. Reincarnation XP comes from kills only and
  is banked server-side so it cannot be lost to death. Persistent gear layers (ancient gear, a nine-slot
  constellation set, museum, forge upgrades) survive reincarnation; ancient gear's bonus budget is kept
  small because it banks across lives.
- **Prestige math (source, comments).** A second prestige layer ("ascension") has a **rising bar**: the
  nth needs level 1000 + 250(n-1) and pays n points; overshooting pays nothing extra. The dev explains
  the old per-250-levels payout made "sit high and cash out" optimal, which they replaced to force the
  intended loop.
- **Improvements (source, changelog).** Trophies roll on abyss death by this run's depth only (none
  below floor 10, 10% at floor 10, +10% per 5 floors); a stale personal best counts for nothing, so
  spamming shallow reincarnations pays nothing. A bug where a stat cap was clamped after rolls and a
  desync that forced an unearned reincarnation were both fixed.
- **Representations.** Class tree with tiers and branches, bestiary, museum, codex tab with a long
  versioned changelog written for players.
- **YAIR mapping.** Death-time shop spending a run-earned currency is a new fit for continuation
  (rulebook 4 to 5, AD10 to AD14, AD19). Rising-bar prestige and "payout keyed to this run, not best
  ever" are design corrections for any rebirth reward. `deathMerchant`: 0 hits in `src`.

## A Dark Cave (React/Vite, lazily loaded chunks per language) , minified, readable enough

Build: itch iframe 19653438 plus the developer's `llms-full.txt` (facts: web game, Steam release planned
27 Oct 2026, playtime under 5 hours for a speed run). Read the state-adjacent chunks `loop`, `cruelMode`,
`estateUpgradeMax`, and string counts in `state` and `game`.

- **Systems (source).** A tick loop tracks timed condition states (feast, great feast, solstice, curse,
  frostfall, fog, disgust, focus, mining boost, brimstone flux, staring deer, forest fear) with end
  times. Villager deaths per tick from starvation and freezing; a **madness** track with six tiers whose
  per-tier death chances differ; blood-moon sacrifice that grows per occurrence; attack waves with a
  casualty cap and building damage chance. Confirms villager jobs, waves, trading; companion
  storylines are `stated-not-found` (3 string hits only).
- **Cruel mode as a data table (source).** One file holds every difficulty dial as a normal/cruel pair:
  success chance penalty, madness gain, stranger arrival odds, death odds per villager, wave casualty
  scale, repair factors. This is the shape of AD5/AD22 "default, dial, reason", already as code.
- **YAIR mapping.** Settlement tick and madness tiers vs `src/home_staff.js` household staff (no
  `madness` or `cruel` hits in `src`). The single dial table is the useful pattern. Otherwise a
  clone-class game: skip further.

## Cyberpunk Life (React, minified) , 1.3 MB bundle, pretty-printed with esbuild

Build: itch iframe to `gameplaya.fr/CyberpunkLife/`, v0.8. It is a job-ladder incremental (Tramp, App
slave, Kitchen worker, Factory worker, ...) plus a hacking minigame, shop, clinic, gang, politics.

- **Systems (source).** The developer's "time loop with linked phases" claim is only partly true: it is
  a Progress Knight style reincarnation. The reincarnation function carries an explicit keep list:
  shop, clinic, data cards, research, story, planner, meta, themes, options, team, missions, black
  market; it rebuilds jobs, skills, gears, homes, computer, gang and political influence, with job levels
  recomputed from stored levels and max levels. Karma accrues daily from wealth and influence but is
  **spendable only after reincarnation** (a pending versus banked split with the formula shown in the
  tooltip). A "Reincarnate" button shows once a meta counter is above zero.
- **YAIR mapping.** The explicit keep/rebuild map is a clean pattern; YAIR already has carry rules
  (AD10 to AD14), `karma` appears once in `src/absorb_p23/leisure_memory/HOST_CONTRACT.md`. Pending
  versus banked currency is a small idea. Skip the rest.

## Trader Life (single HTML, JS inlined in en and ru copies, v10.26) , plain

- **Systems (source).** Market sim (crypto, stocks, metals), with life pressure around it: six bars
  (stress, satiety, energy, health, reputation, heat). One turn is 12 hours; satiety falls 6 per turn;
  at zero satiety health drops 15. Stress does not recover alone, only through spending and street actions.
  Housing is a per-turn modifier to energy, stress and heat; failing rent evicts to a dorm and debt grows
  1% a turn. Hospital rescues are limited to two; the next zero health gives one grace turn then ends
  the career (a forgiving-then-final death rule). Police raids scale with heat and seize a stash. Sealed
  container lots on a dark market (contents unknown, unopened goods get lower offers), a mythic car list,
  rival archetypes, and a world-event table that modifies prices and costs. Confirms container bids and
  mythic cars; the "14 rival Forbes list" is partly there (a Forbes feed and rival archetypes exist; the
  count of 14 was not verified).
- **YAIR mapping.** Body and health rules BHR1 to BHR30 already cover bars; the **housing-as-modifier,
  limited-rescue-then-grace, eviction downgrade** trio is the transferable shape for home (`src/home_*`).
  `hospital` has 6 `src` hits in home files; no eviction downgrade was found. Otherwise a market game.

## Top findings

1. **Ascension Tower death merchant and rising-bar prestige.** Spend run-earned currency at death before
   rebirth; payout keyed to this run, not a best ever; each prestige bar rises and overshoot pays
   nothing (with the dev's reasoning). Owner: continuation (AD10 to AD14, AD19).
2. **Terraformental typed requirement and effect vocabulary.** "Completed this life, last life, any life",
   loop-scoped versus run-scoped flags, persistent-known effects, familiarity soft cap per loop. Names
   only; bodies unread. Owner: carryover rules and chronicle.
3. **Surviving Magic Academy goal-driven queue planner and cheated-time debt.** Auto-plan a path to a goal
   node via stat providers, a banked burst of faster time, and a corruption meter that grows from
   speed-ups. Owner: branch/offline clock and schedule code.
4. **Slime Reborn discovery-unlocked mutations and hidden order-keyed combos.** Observation encounters
   unlock a one-time specialization; chains of different actions give discovered bonuses. Owner: skill
   and learning rules (SLR), site exploration (SR1 to SR24).
5. **Trader Life limited rescue then grace turn, housing as per-turn modifiers, eviction downgrade;**
   with A Dark Cave's single normal/cruel dial table as the data shape for AD5. Owner: home and body rules.

## Verification

Read: store page and iframe index for all nine; Unity data and wasm for Terraformental, Surviving Magic,
ReCycler, Simultree, Slime Reborn (unpacked; metadata and shipped definitions read; IL2CPP dumped for
ReCycler and Simultree only); 56 client and shared files for Ascension Tower (not the server);
full pretty-printed Cyberpunk Life bundle by targeted grep; Trader Life en code by targeted read;
A Dark Cave entry bundle plus 6 chunks and the dev facts file. Not read: Terraformental StreamingAssets
CSVs, Unity method bodies for the three dumper-unsupported builds, A Dark Cave per-language event text,
Ascension Tower server logic, Cyberpunk Life hacking and gang code, Trader Life market engine. About 78
tool calls; two HTTP 429s on itch pages (one 90 s wait). No game code executed, no native downloads.
