# itch.io idle and cultivation screen, 2026-10-22

Requested by Weibao: audit itch.io for useful material, starting from
[Path of the Idle Cultivator](https://wuxiadev.itch.io/idle-cultivation-path),
"and much much more". Follow-up the same day: download and decompile games for
representations, improvements, concepts and systems.

Scope: about 77 itch titles. 50 were screened from their developer pages by two
sonnet lanes (one cultivation, one non-cultivation life sim), and about 27 more
were seen in listings only. Four HTML5 builds were then read statically: I
fetched the exact files a browser loads and read their code. No game code was
executed, no native builds (Windows/Android, up to 744 MB) were downloaded, and
no accounts or purchases were made. Hashes and line locators are in the
gitignored [private trace](itch-io-2026-10-22/private/TRACE.md), along with both
lane tables.

Rules: AD32 (everything here is proposal), AD35 (deep details private), AD36,
AD37/AU1-AU3 (one coordinator, two lanes, two concurrent), and the research
router's unbiased lens. Order below is follow-up value for YAIR, not game
quality. Evidence labels: **source** = read in the served code; **stated** =
developer page or devlog; nothing was played.

Excluded as already covered: C1-C11 in
[protolike and cultivation discovery](PROTOLIKE_AND_CULTIVATION_DISCOVERY_2026-10-22.md)
and [additional cultivation](additional-cultivation-2026-10-22/REPORT.md)
(another chat's uncommitted work, not edited here), plus titles in
[RESEARCH_IDLE_GAMES](../RESEARCH_IDLE_GAMES.md) and
[NICHE_GAME_REFERENCES](../NICHE_GAME_REFERENCES.md). Codes use `I` so they do
not collide with C1-C11.

## Outcome

**F1: mostly worked versions of ideas YAIR already has, plus two new
ones.** YAIR's docs already discuss succession, heirlooms and lifespans, and
`src/heir_inheritance.js` and `src/home_inheritance.js` exist. For these, the
decoded code adds tuned rules and the developers' commented reasons. Two
mechanisms have no runtime counterpart in YAIR `src` (grep for pollution,
turbid, qi field or diffusion, and for past-life or earlier-life gating, found
nothing): Nine Peaks' spatial two-field qi map (I2-c) and Shirania's choices
that unlock only for a scene lived in an earlier life (I4-a).

**F2: the developers' page claims drifted from their code.** I1's devlog
describes a servant to disciple to elder production chain. Its current code
contains a migration that deletes servants and the servant house and converts
those ranks to elders and an army. Treat devlog claims as history until the
code confirms them.

**F3: three of the four decoded games tie mechanics to causes**, in the way
AD25 and AD38 describe. Nine Peaks charges karma only for deaths the sect
caused. Kinfolks prices each inheritance choice in standing with a specific
group. Shirania offers an option only if you actually lived the scene in an
earlier life.

## Decoded games

### I1: Path of the Idle Cultivator (wuxiadev)

HTML5 (itch shell iframes `cultivator-path.com`), Windows, Android, Steam early
access since 2026-09-05; v0.5.1. The itch page discloses AI-assisted code.
Bundle: 18.9 MB, identifiers renamed but strings intact.

| Code | Mechanism | Evidence | YAIR owner | Note |
| --- | --- | --- | --- | --- |
| I1-a | **Lifespan sets the calendar, and a time law adds work per day.** Calendar days per real second = max(1, max age / 2000) x days per month x speed setting. A "time" law multiplies only *action* days, not calendar days. | source | AD13, AD15, [branch clock audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md) | Long lives pass faster. The time law gets more done per year without aging you faster: two separate dials. |
| I1-b | **Rebirth keeps only flagged items.** Inventory is filtered to two soul items plus anything marked `persistOnRebirth`. Separately, a 2025-11 devlog says an owned sect keeps its spirit stones and passives. | source / stated (stale source, see F2) | AD11, AD14 | An explicit per-item carry flag is easy to audit. |
| I1-c | **Defense pressure follows your own conquest.** Difficulty scales with the highest city you invaded; undefended days cost 1% of resources. | stated (2025-11 devlog) | AD25 | Not confirmed in current code; the sect was reworked into an army afterwards (F2). |
| I1-d | **Voluntary reincarnation pays and death does not; one law per life.** | stated (page Q&A) | AD11, [death and reset](DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md) | Not traced in code. |

Also in code: a cave/dungeon system, divine beasts, a "multiverse door" endgame
encounter (dialogue only), and a `window.Debug` console with add-resource
commands shipped to players. Fate coins are withheld offline for anti-cheat
reasons. That does not apply to YAIR (AD22).

### I2: Nine Peaks (Charlequin)

HTML5 sect city builder. All code inline, unminified, heavily commented. No
license stated, so ideas only, no code copying.

| Code | Mechanism | Evidence | YAIR owner |
| --- | --- | --- | --- |
| I2-a | **Servants awaken on their own.** Monthly chance = base x qi *where they sleep* x hidden latent root x age bell curve (peak 19) x care (food, rest). About 10% of servants carry a real root. The player's watch list ranks by what a sect master could observe and leaves out the hidden root. A pity factor applies to the first awakening only. | source | Household staff (`home_staff.js`), AD6/AD8 (means decide, learned numbers) |
| I2-b | **Housing is the qi decision, fields are the labor decision.** The developer's comment explains the change. Labor drags workers away from veins, so tying absorption to the bed stops the two from fighting. | source | Home building and household panels |
| I2-c | **Two-field qi map.** Spirit qi diffuses from veins and decays with distance. Formation arrays are sealed pipes and nodes are taps. Turbid qi from furnaces, mines and the unburied dead spreads slower, lingers longer and suppresses spirit qi. | source | Sites and home placement (SR rules), world dials |
| I2-d | **Deaths are charged by cause.** Starvation and desertion cost karma and leave turbid qi where the person died; old-age deaths do neither. The comment explains that charging every death the same let normal aging slowly ruin the settlement. | source | AD25, AD38, home staff welfare |
| I2-e | **Wear degrades before it breaks.** Upkeep is 5% of build cost per month. Output declines below 70% condition rather than failing outright. | source | `home_model.js` upkeep, gear durability |

Reputation is a slow-moving blend of best realm, headcount, settled feng shui,
welfare and karma. Realm lifespans run 120 / 200 / 400 / 800 / 1500 / 3000.

### I3: Kinfolks (M Dawg)

HTML5 family clan sim across a century, v1.25, updated 2026-10-21. Inline code,
AI-assisted per page tags. No license stated.

| Code | Mechanism | Evidence | YAIR owner |
| --- | --- | --- | --- |
| I3-a | **Inheritance is a law, not a pick.** The deed goes to the youngest adult blood son, then the youngest daughter. A widow's life estate comes first when a blood heir waits under her. | source | `heir_inheritance.js`, `home_inheritance.js`, AD1 (per-world rules) |
| I3-b | **Partible land with priced alternatives.** Outlying land splits among the dead man's adult children, and a child already set up takes half. A buyout costs money and raises town standing. Keeping it undivided lowers ridge standing. | source | Same owners, local economies (AD27) |
| I3-c | **Heirlooms write their own history.** Each passing adds "Passed to X in year" and sometimes a dated deed line, capped at 14 lines. Value rises with age and number of lines. A Bible salesman's item is now forced to be a Bible (a fix noted in the code). | source | `material_lineage.js`, `lore_history_state.js` |
| I3-d | **Three standing groups (ridge, town, church)** move with specific acts such as tithing, feuds and mortgaging. | source / stated | Reputation and institutions |

The code is full of dated fix notes. One, from version 1.18, fixes a buyout
card that showed one price while the game charged a different one. These match
YAIR's "preview and settlement agree" checks and work as a list of failure
cases.

### I4: Progress Knight of Shirania (Wernerina)

HTML5 Progress Knight fork, updated about 2026-10-03. Three readable script
files. License unverified (the original Progress Knight is Unlicense).

| Code | Mechanism | Evidence | YAIR owner |
| --- | --- | --- | --- |
| I4-a | **Remembered scenes unlock choices.** An option tagged `remembers` appears only if that scene was lived in an earlier life. The snapshot is taken when the life begins. A plain lore scene can become a choice in a life that remembers it. | source | AD10-AD12 (journey across lives), `chronicle.js` |
| I4-b | **The thread.** The role you ascend is kept by a named villager for that branch, with their own line and lore. At rebirth you can pick it up and start the life in that role and level. The offer previews where the path leads. | source | AD11, companions |
| I4-c | **Helped NPCs keep paying across lives.** Someone you set on their way sends daily coins in later lives. | source | Relationship persistence |

## Representations and improvements (AD40)

Presentation choices seen in the decoded code:

- **Observable-only rankings (I2).** The servant watch list ranks by sleeping
  qi, age and care, and leaves out the hidden root. It shows what a sect master
  could judge, which fits AD6/AD8.
- **Decline before failure (I2).** Worn buildings lose output gradually so the
  player sees the decline before anything collapses.
- **Named keeper and road-ahead preview (I4).** The thread offer names the
  villager holding it, gives their line, and previews where the path leads, so
  a dead-end thread is chosen knowingly.
- **Object biographies (I3).** Each heirloom shows its history as short dated
  lines ending with who holds it now.
- **Combined threshold readout (I1).** Divine beast forms show "body + spirit,
  current / required" as one total toward the next form.

Design corrections the developers explain in their own comments, each a
reusable lesson:

- **I2:** absorption moved from where a servant stands to where they sleep,
  because labor kept pulling workers off the qi.
- **I2:** a pity factor applies only to the first awakening, so a bad seed does
  not leave the opening decades empty.
- **I2:** deaths are charged by cause rather than all alike.
- **I3:** dated fixes for preview/settlement mismatches and wrong item types
  from a generic loot table.

## Screened, not decoded

From the two lane tables. All are developer claims; each check says what would
prove real depth.

| Code | Game | Mechanism | Check |
| --- | --- | --- | --- |
| I5 | [Ascending the Dao](https://cygryu.itch.io/ascending-the-dao) (HTML5) | Sect rank and realm are separate ladders; the sect refuses promotion if cultivation lags. Every 25 levels, pay for a safe breakthrough or take a 50% gamble for a permanent bonus at the risk of losing levels. | Raise sect work only and see whether promotion stalls with a stated reason. |
| I6 | [Incremortal](https://incremortal-dev-sam.itch.io/incremortal) (HTML5) | Health drains constantly, so you queue tasks before death. Skills reset each life but "instincts" persist. Mastery unlocks priority automation. | After one death, compare which values reset and which persist. |
| I7 | [Cycle of the First Dawn](https://doorwatchers.itch.io/cycle-of-the-first-dawn) 1.4.0 | New since the [prior report](cultivation-idlers/REPORT.md): investigations need their prerequisite fact first; a journal and travel atlas persist across lives. | Try an investigation step before learning its fact. |
| I8 | [Lowmoor](https://lilchill-games.itch.io/lowmoor) | Offline time is capped at 4 hours, extendable to 24. The page credits a hireling, but code shows a legacy-shop upgrade at 1 hour per level ([BATCH_LIFE_A](itch-io-2026-10-22/BATCH_LIFE_A.md) round 2). | Resolved by decode. |
| I9 | [Great Expanse](https://vegros101.itch.io/great-expanse-road-to-immortality) | Offline: one in-world month per real hour; karma carries into the next life. | Check whether karma changes NPC behavior or only a number. |
| I10 | [Surviving Magic Academy as a Demon Lord](https://stripedbutterfly.itch.io/surviving-magic-academy-as-a-demon-lord) | A calamity arrives after a set number of steps; time scaling keeps hunger and fatigue consistent. | Skip prep and see whether failure changes the map. |
| I11 | [Terraformental](https://sh4dowsand.itch.io/terraformental) (723 ratings) | The time loop only starts after you survive a first run. | Find what crosses the loop boundary. |
| I12 | [开宗立派 P0](https://lhg-yxhc.itch.io/kaizong-lipai-p0) | A forced binary sect event every 90 seconds. The developer asks whether players read it as story or interruption. | Do the choices leave lasting state? |

The rest, about 38 screened titles, were thin, mobile-only, Windows-only,
abandoned or mostly prestige stacks. Those rows stay in the private lane
tables.

## Suggested follow-ups (proposals, not dispatched)

1. **Compare I3 against `heir_inheritance.js` / `home_inheritance.js`**: a
   per-world inheritance law (heir order, life estate, partible land with
   priced alternatives) and heirlooms that accumulate a deed history.
   Done check: two worlds with different inheritance laws produce different
   heirs from the same household.
2. **Compare I2-a/b/d against household staff**: awakening or talent from
   where people sleep plus care, and deaths charged by cause. Done check: a
   neglect death and an old-age death leave different state.
3. **Compare I4-a against `chronicle.js`**: a choice that appears only
   because a scene was lived in an earlier life. Done check: the same scene
   offers the option in life 2 only when life 1 lived it.
4. **Record I1-a in the branch clock audit**: lifespan scales the clock, and
   an earned time law is a second dial (AD15).
5. **Optional deeper decode**: Ascending the Dao (I5) and Incremortal (I6),
   both HTML5, by the same static route.

## Verification

Agent usage (AU2/AU12): two sonnet lanes, about 107k tokens / 40 tool calls
(cultivation) and 100k tokens / 33 tool calls (life sim); coordinator did the
decoding. itch rate-limited once (HTTP 429) while lanes ran in parallel; one
paced retry succeeded.

Done: page fetches, served-file downloads with SHA-256 hashes, static reads at
the locators in the trace, and esbuild used as a parse-only formatter. Not
done: no gameplay, so balance, reachability and long-play behavior are
unverified for every entry. No runtime files changed, so build and test gates
do not apply. Not committed.

## More to consider, round 1 (2026-10-22)

Codes `IM1`+ for this audit's consideration rounds. Evidence comes from quick
reads of YAIR source; nothing below is accepted direction (AD32).

### ACT NOW (done)

- **IM1: shared decode brief and limits.** Seven sonnet sessions now decode
  the roster under one brief:
  [DECODE_BRIEF](itch-io-2026-10-22/DECODE_BRIEF.md). It sets static reads
  only, no native downloads or execution, itch pacing and 429 backoff,
  separate output paths per chat, and the systems / representations /
  improvements / YAIR-mapping format.
- **IM2: devlog drift is a standing evidence rule for this wave.** Following
  F2, every batch labels claims `source` or `stated-not-found` and flags
  retired code. This is in the brief.

### ACCOUNT FOR NOW

- **IM3: YAIR's heir is a single successor, not a law.** `src/heir_inheritance.js`
  derives one heir from what the ended life left (lessons taught, carried items,
  obligations, the Shack). It has no notion of claimants, heir order, a
  spouse's life estate or divided land. Kinfolks (I3) is the worked example if
  that ever becomes a per-world rule (AD1). Any comparison should keep the
  current save shape (AR rules, migration needed) and treat inheritance law as
  a world dial, not a global default.
- **IM4: YAIR homes are not spatial.** `src/home_model.js` has no grid, tiles
  or adjacency, so Nine Peaks' qi-where-you-sleep and turbid-qi placement
  (I2-b/c) cannot be ported directly. The non-spatial core still works:
  awakening or talent odds from the *bed's* quality plus care, and deaths
  charged by cause. A spatial field depends on whether homes ever gain
  layouts. AD33 currently defers procedural layouts.
- **IM5: YAIR already separates calendar from consumed time.** The
  [branch clock audit](OFFLINE_TIME_AND_BRANCH_CLOCK_AUDIT_2026-10-14.md) F7
  shows native calendar minutes and expansion elapsed minutes are different
  coordinates. I1-a's "time law speeds action days, not aging" is therefore
  about which coordinate a world dial or technique scales, not a new clock.
- **IM6: past-life gating fits AD11 directly.** Memories carry by default, so
  a Shirania-style `remembers` option (I4-a) is "the character actually
  remembers this scene". It should read what the chronicle recorded as lived
  and known (AD6/AD7), not a global unlock flag, and stay world-scoped where
  the scene belongs to one world (AD4).
- **IM7: licensing decides reuse.** Nine Peaks, Kinfolks and most batches
  state no license, so they are ideas only. Office Immortal (MIT) and
  Existence Simulator (open source) are the only possible code-reuse
  candidates, and either would still need provenance and fit checks.

### LATER / DELEGATE

| Code | Item | Level / effort | Done check |
| --- | --- | --- | --- |
| IM8 | Compare Kinfolks' heir order, claimants and heirloom deed-lines against `heir_inheritance.js` / `home_inheritance.js`; propose a world-dial inheritance law with save migration notes. | sonnet, medium | A written proposal shows two worlds yielding different heirs from one saved household, with the migration listed. |
| IM9 | Prototype bed-quality-plus-care awakening odds for household staff (non-spatial I2-a), including an observable-only watch list. | sonnet, medium | A fixture shows a well-housed, fed servant awakening more often than a neglected one, and the UI ranks without the hidden value. |
| IM10 | Cause-charged deaths for household and settlement members: neglect leaves consequences (standing, resentment), old age does not. | sonnet, small | A test records different state after a neglect death and an old-age death. |
| IM11 | `remembers`-gated choice in one chronicle scene, as a single proof slice (AD11). | sonnet, small | The same scene offers the option in life 2 only when life 1 lived it; save, reload and import keep it. |
| IM12 | Heirloom biography lines in `material_lineage.js`: append dated holder and deed lines on transfer, value from age and history. | sonnet, small | An item passed twice shows two dated lines, and the lines survive export and import. |
| IM13 | After the decode wave, fold BATCH_* summaries into this report and run round 2 on the new systems. | coordinator | Every batch row is linked and labeled source or stated, and round 2 is saved here. |

Suggestions, not reasons to stop: decode the ~38 thin titles only if a batch
finds real systems behind a thin page; re-screen itch monthly for new
cultivation and life-sim releases with this same brief.

## Decode wave results

Each batch summary keeps its own findings, evidence labels and verification
line. Below are the headline findings per batch, condensed by the coordinator.
Spot checks against the decoded files: My Cultivation Sect's twin chance and
child-count code exist as described.

### BATCH_I1_DEEP: [Path of the Idle Cultivator, full systems](itch-io-2026-10-22/BATCH_I1_DEEP.md)

- **The save-migration list (about 470 names) is a design history.** Servants,
  stability, missions, teaching and tournaments were each built and then
  deleted; an army histogram replaced per-person sect management. This is
  evidence about the cost of tracking every person at scale.
- **Tribulation as a cash-out ramp.** Fixed turns, geometric damage, accept
  at any point, and consumable charms that raise risk and reward together.
- **Carryover rules.** Proficiency converts to talent at rebirth. Law depth
  persists while the chosen law resets.
- **Passive stations.** Status strings, pooled fair share, and no manual mode,
  all from the developer's own bug list.
- **Method.** The i18n table, in-game guide and changelog together give a
  near-complete spec of an obfuscated game without reading its logic.

### BATCH_SECT: [sect and management games](itch-io-2026-10-22/BATCH_SECT.md)

- **My Cultivation Sect: two-parent inheritance.** Quality, root tier, merged
  elements, awakening chance, a hidden born trait and a surname stem pass to
  children, with pregnancy, twins, a population cap and adoption. YAIR's heir
  line carries goods and standing but no parentage traits.
- **Ascending the Dao: pay-or-gamble gate.** An explicit odds line, 20% level
  loss on failure, a permanent bonus on success, and auto-modes that cap
  exposure.
- **Patriarch: visible promotion checklist.** Six lines, including the
  player's own realm and the sect's reputation.
- **开宗立派: forced events replaced.** The game moved to a capped, expiring,
  optional event queue.
- **Drifting Cloud: kept-versus-reset rebirth dialog.** No rival remembers the
  school, and one persistence claim contradicts the code.

### BATCH_PROGRESSION: [cultivation progression and story](itch-io-2026-10-22/BATCH_PROGRESSION.md)

- **Qingxuan: lapsing storylets.** The story clock runs offline. An event
  whose window closes applies an authored miss effect, reported on return.
  Correction (YAIR_GAP_CHECK): YAIR already has this. Storylets carry
  `onExpire` effects (`src/storylet_content.js`), applied when events expire
  at `src/simulation.js:557`. The return report is the part to compare.
- **Great Expanse: offline contract.** One in-world month per real hour, on
  the same simulation path as online play. Choices never fire while away, and
  you cannot die while away.
- **Reincarnation System: vows.** A per-life self-restriction that pays
  aptitude, validated so it must actually restrict.
- **Cycle of the First Dawn.** A free-text journal carried across lives, and
  an atlas that only shows what this life established.
- **Immortal Ascension.** One shared failure-pity streak across hunts and
  tribulations.

### BATCH_LIFE_A: [non-cultivation life sims](itch-io-2026-10-22/BATCH_LIFE_A.md)

- **Incremortal: death as the clock.** Decay grows with time alive. Life
  length converts to permanent max HP. Skills reset but instincts persist, and
  routines unlock from completion counts across lives.
- **Beggar's Life: tag-lock content grammar.** Requirement expressions and
  lock tags express class ladders and closed paths as data. Feelings are
  capped resources that modify other caps.
- **Lowmoor and Town Tycoon: away time is a bought, capped capacity.** The
  rate depends on what is working.
- **Lifeidle and ONE CLICK: legacy judged by how a life was lived, not
  wealth.**
- **Existence Simulator: stress makes time pass faster.**

Batch mapping caveat: several batches mapped to YAIR by name grep only. A
"not in `src`" claim means no obvious owner, not a verified gap.

### BATCH_LIFE_B: [engine-built and loop games](itch-io-2026-10-22/BATCH_LIFE_B.md)

- **Ascension Tower: death merchant.** Run-earned currency is spent at death
  before rebirth. The payout counts this run, not a best ever.
- **Terraformental: typed carryover vocabulary.** Requirements say "this
  life, last life or any life", and flags are scoped to the loop or the run.
  Only the names were readable; the bodies are compiled.
- **Surviving Magic Academy: planning and time debt.** A queue planner
  routes toward a goal node. A banked burst of fast time has a corruption
  cost.
- **Slime Reborn: discovery from observation.** Watching encounters unlocks
  mutations, and hidden combos are keyed to action order.
- **Trader Life and A Dark Cave.** Trader Life gives a limited rescue then a
  grace turn, and evicts by downgrading housing. A Dark Cave keeps its
  normal and cruel settings in one dial table (an AD5 data shape).

### BATCH_CULT_REST: [remaining cultivation titles](itch-io-2026-10-22/BATCH_CULT_REST.md)

- **Tụ Linh Quyết and Cultivators Chronicles: retention as a rebirth
  shop.** What a new life keeps (beasts, gear, techniques, starting realm,
  automation) is bought at rebirth.
- **Ninefold: a written no-loss promise for absence.** Work beds settle their
  value when collected and wait indefinitely.
- **Ascension Tower: gift-size gates and rumors.** Each bond tier needs a
  minimum gift, and rumors unlock from summed standing.
- **Idle Xanxia: impurity purges.** Timed purge commissions are gated by sect
  rank. Correction (YAIR_GAP_CHECK): `src/items.js` has no pill toxin or
  impurity fields. The related toxin axis lives in the unwired craft reaction
  engine (`src/craft_resolver.js`).
- **A Mortal's Path and Cultivation Genesis: chronicle text.** A narrator that
  avoids repeating itself, and a consequence line that depends on the build.

### BATCH_POTION: [potion and alchemy crafting](itch-io-2026-10-22/BATCH_POTION.md)

Shallow batch: only 3 of 8 decoded games were readable from source or data.

- **Hidden Grimoire: failure produces something and is remembered.** A
  failed pairing leaves a usable residue and is marked as tried, and that
  memory survives death. The bench names one of five reasons a combination
  cannot run. Recipe knowledge is permanent, while the brewed power belongs
  to one life.
- **CHROMA: a product's name encodes its composition.** A prefix grammar
  makes the name a readable procedure. The journal compares your plan
  against the batch you actually made.
- **Alchemyst Apprentice and Herbarium, page-stated only.** Testing on third
  parties gives delayed results and costs standing. The journal refuses
  conclusions that the recorded subject state and dose cannot support.

### BATCH_PROCGEN: [procedural generation](itch-io-2026-10-22/BATCH_PROCGEN.md)

- **Azgaar's Fantasy Map Generator (MIT): stored diplomacy and derived
  wars.** One diplomacy matrix decides wars from power and expansionism, with
  allies and vassals joining or defecting, and every step logged with its
  cause.
- **Seedship: a falling ledger.** Counters only ever fall. Events and the
  ending read them, so outcomes feel earned.
- **Talk of the Town (MIT): story recognition.** It finds triangles,
  rivalries and misanthropes in the finished simulation state instead of
  scripting them, and scores who matters to whom.
- **Eigengrau's generator (MIT): roll-plus-modifier stacks.** Descriptions
  are derived from the rolls, and relationship templates carry reciprocal
  labels.

### BATCH_SCOUT: [about 45 more itch titles](itch-io-2026-10-22/BATCH_SCOUT.md)

- **HUNGERHOLD: lessons by cause of death.** Each way of dying gives the next
  life a specific edge. A numeric succession-crisis formula and faction memory
  lines carry year stamps.
- **Peasant to King and House of Ashes: succession as a played scene.**
  Regencies and disputed successions are settled by gold, court or arms. A
  ruling on an inheritance quarrel rewrites both parties' traits and logs.
- **Frostward: housing drives pairing and births.** Survivor events cover
  being orphaned, widowed or coming of age homeless.
- **Noble.** Typed role requirements, plus a database of outcome usage that
  drives scene choice.
- **Not decoded yet:** Heirdeep, Mos Maiorum and Labor Omnia Vincit
  (multi-generation houses).

Play queue for possible future play, with what each session should confirm: [PLAY_QUEUE](itch-io-2026-10-22/PLAY_QUEUE.md).

### Genre audits and broad scout (second wave)

Six more sonnet sessions, same brief. Several earlier batches also got deeper
second to fifth passes after the first commit: I1 (alchemy, bloodlines,
galaxy invasion), SECT (My Cultivation Sect's grudges, rivalry, adventures and
succession), CULT_REST, LIFE_A, POTION (Hidden Grimoire's full recipe tree),
PROCGEN (Condition Unknown's witness knowledge) and SCOUT (Heirdeep, Physician
Simulator, Tiny Lives, Mos Maiorum). Each batch file has its own pass log.

- **[BATCH_BROAD](itch-io-2026-10-22/BATCH_BROAD.md), 41 screened, 8 decoded.**
  - EMERGENT - The Heir has a developer-measured list of flat-gauge traps.
    Passive play was easy, reputation acted as a timer, health stayed flat
    until 65, isolation had no consequence, and natural death existed in only
    one mode. Use it as a checklist for YAIR body, reputation and household
    systems.
  - EMERGENT also has age-driven chronic conditions with three responses
    (treat, manage, ignore), and a health ceiling that falls after a set age.
  - Collapse comes in two kinds, neglect versus burnout, decided by smoothed
    stress history.
  - Idle Fantasy Shop shows sale and hire acceptance as a visible sum of
    parts.
  - Medieval Merchant Simulator treats family differently from staff: a
    spouse gets a long grace period before leaving.
- **[BATCH_MAGIC](itch-io-2026-10-22/BATCH_MAGIC.md), about 30 screened, 3
  decoded.**
  - Runemaster shows only the runes that can legally come next. A single
    rune acts on the world: Earth opens walls (AD38).
  - Tasks of the Spell Looper recharges a spent rune only when its opposite
    is used.
  - Etsa Djavul is a magic conlang learnable by contrast.
- **[BATCH_CRAFTING](itch-io-2026-10-22/BATCH_CRAFTING.md), 30 screened, 7
  decoded.**
  - Hacksmith treats shape as a conserved, scored quantity (MR5).
  - Quality marks each change one named later stat.
  - Failed crafts become social debts and return as grudges.
  - Age of Iteration's trail wear is built by traffic and decays.
  - Stage costs list alternatives, so substitution is data.
- **[BATCH_EXPLORE](itch-io-2026-10-22/BATCH_EXPLORE.md), about 60 screened,
  8 read** (several from pages only).
  - PokeQuest: scouting has a stated, accurate price, and rumors are consumed
    when used (SR6/SR8/SR13).
  - Path Past The Mountain: instruments instead of a map (SR7/SR9).
  - Coop Catacombs: traces left by other agents change a revisited site
    (SR5/SR20).
  - Cartographomancer: errors in your map copies have consequences for
    whoever uses them.
- **[BATCH_COMPANIONS](itch-io-2026-10-22/BATCH_COMPANIONS.md), about 30
  screened, 7 decoded.**
  - DRGN: each creature's temperament decides which bonding rite works, and
    scenes become a capped memory list. Companions leave on a gene-driven
    clock unless bound.
  - Grim Brood: recursive kinship penalties, and you only know the
    phenotype until tested.
  - BEASTBLOOM: breeding intent works as a nudge.
  - Grim Brood villagers: wishes are predicates, and a villager leaves after
    two bad nights.
- **[BATCH_ECONOMY](itch-io-2026-10-22/BATCH_ECONOMY.md), about 150 listed,
  4 decoded.**
  - Silver Way: faction tiers with rivals and a deed table.
  - The Debt Ledger: failed obligations ratchet a standing rate.
  - Fivefold Crown: scheduled consequences with rising weight, and neighbor
    pairs that track owed favors.
  - Knowledge is paid for as payroll or a purchase, and goes stale.
  - Bills, insurance and forwards are priced from distance and route danger.

## More to consider, round 2 (2026-10-22, after the decode wave)

Cross-batch patterns. Codes continue from IM13.

### ACT NOW (done)

- **IM14: one refuted developer claim was corrected here.** Lowmoor's away
  cap comes from a legacy-shop upgrade, not a hireling. I8 now reflects the
  code.

### ACCOUNT FOR NOW

- **IM15: carryover is the most common lever, and the best games show it.**
  Drifting Cloud, Ascension Tower, Tụ Linh Quyết, Terraformental and I1 all
  make "kept versus reset" explicit, and some sell it. For AD11, a visible
  carry ledger at each crossing or death matters more than any single carry
  rule. "This life, last life, any life" scopes are a compact vocabulary for
  it.
- **IM16: failure teaching by cause converges across genres.** HUNGERHOLD
  gives lessons by death cause. Nine Peaks charges deaths by cause. Hidden
  Grimoire remembers failed combinations and why a bench refuses. These are
  one AD9 pattern: a failure records *what* failed and *why*, and later
  forecasts read that record.
- **IM17: lapsing events conflict with AD16 unless scoped.** AD16 stops
  away time at important choices. Qingxuan lets story windows close while
  you are away and applies a miss effect. YAIR already expires open events
  that are non-blocking or not undiscovered player decisions
  (`src/simulation.js:557`), so this scoping largely exists. Lapses fit only for events that are
  not important choices, or as a per-world dial with the reason stated.
- **IM18: per-person simulation has a demonstrated cost.** I1 built and then
  deleted servants, missions, teaching and tournaments in favor of an army
  histogram. Nine Peaks, My Cultivation Sect and Frostward do simulate people
  individually, but at settlement scale. This supports AD33's
  deprioritization of NPC-heavy work. Named household members can be
  individual while larger groups use aggregates.
- **IM19: lock grammars need dial-and-reason wording.** Beggar's Life's
  `require` and `lock` tags express closed paths as data. YAIR's framing
  forbids permission lists (AD38). A closure should carry its in-world reason
  and cost, so it reads as "the church will not take a known beggar" rather
  than "locked".
- **IM20: four open-source references are reuse candidates.** Azgaar,
  Eigengrau and Talk of the Town are MIT, as is Office Immortal. Reuse would
  still need provenance, attribution and a fit check. All other decoded games
  are ideas only.

### LATER / DELEGATE

| Code | Item | Level / effort | Done check |
| --- | --- | --- | --- |
| IM21 | Carry ledger proposal: one view listing what crosses each boundary (death, rebirth, world crossing), with scope labels. | sonnet, medium | A mock or doc shows the ledger for two worlds with different carry rules (AD11). |
| IM22 | Failure-record pattern for crafting and death: a record of what failed and why, read by forecasts (AD9). | sonnet, medium | A test shows a forecast changing after a recorded failure, and the record survives reload. |
| IM23 | Story recognizer over chronicle state, modeled on Talk of the Town: detect rivalries and debts in existing state for recaps. | sonnet, small spike | A fixture detects one rivalry from saved facts without new scripted content. |
| IM24 | World history derived from a stored relations matrix, modeled on Azgaar, for `lore_history_state.js` (AD4). | sonnet, medium | Two seeds produce different logged wars, each with a recorded cause. |
| IM25 | Item name grammar that encodes composition, modeled on CHROMA, for material lineage. | sonnet, small | A crafted item's name parses back to its inputs. |
| IM26 | Deeper reads left open: Heirdeep, Mos Maiorum, Labor Omnia Vincit; Peak Cultivator (obfuscated); Beggar's Life il2cpp code; the shallow potion entries. | sonnet, medium | Each gets a BATCH entry with source-labeled systems or a stated reason it cannot be read. |

Verification for the wave: nine sonnet sessions each wrote a BATCH file with
its own verification line and tool count (about 35 to 80 calls each). The
coordinator spot-checked one claim (My Cultivation Sect's twin and
inheritance code) and applied one correction (Lowmoor). Other batch claims
are each session's report and were not independently re-checked. Nothing
executed, no native downloads, nothing committed.

## More to consider, round 3 (2026-10-22, after the genre audits)

### ACCOUNT FOR NOW

- **IM27: "show why" is the most repeated good idea.** It appears as Idle
  Fantasy Shop's acceptance breakdown, EMERGENT's "Why" boxes and 12-week
  before/after reports, Hidden Grimoire's five refusal reasons, Patriarch's
  promotion checklist and Runemaster's legal-next filter. Any new YAIR
  decision surface should state its reasons in parts. Candidate for a UI rule
  check under the UR rules, not a new rule yet.
- **IM28: knowledge has a price and a shelf life across genres.** PokeQuest
  sells accurate scouting. Silver Way and The Debt Ledger sell price
  histories that go stale. Grim Brood shows only phenotype until tested.
  Etsa Djavul's language is learned by contrast. These are all AD6/AD8
  (means decide, learned numbers) with costs attached.
- **IM29: obligations are one ledger in several genres.** Crafting grudges
  from failed commissions, The Debt Ledger's ratcheting rate, Fivefold
  Crown's owed favors and Kinfolks' land claims all fit AD14 (bindings and
  duties carry by their own rules). A single obligations record read by
  several systems beats per-system debt counters.
- **IM30: EMERGENT's flat-gauge list is a ready test checklist.** Check YAIR
  body, reputation and household systems for passive play being easy,
  reputation that behaves as a timer, flat health until late age, isolation
  without consequence, and natural death in only one mode.

### LATER / DELEGATE

| Code | Item | Level / effort | Done check |
| --- | --- | --- | --- |
| IM31 | Run the IM30 flat-gauge checklist against current YAIR systems with a headless long-life run (`headless-bench` / `simfuzz` toolsets). | sonnet, medium | Each of the five traps marked present or absent, with the run's evidence. |
| IM32 | Obligations ledger proposal (IM29): one record that crafting, household, inheritance and economy write to and read from. | sonnet, medium | A doc maps three existing debt-like states onto one record shape with a migration note. |
| IM33 | Companion bond rite by temperament with capped scene memory, modeled on DRGN, for `src/companion_roster.js`. | sonnet, small | A fixture shows a preferred rite giving the larger gain and appending a memory line, with the cap enforced. |

## More to consider, round 4 (2026-10-23, leftover items and interactions)

Trigger: Weibao asked for the leftover items (orphan, grief and came-of-age events, genetics and companion wishes, diplomacy and schism, skill floor, spatial homes) despite AD33; recorded in [USER_VISION](../USER_VISION.md#leftover-itchio-items-built-as-small-per-world-dials-2026-10-23). They build as small per-world dials with a reason and cost. Codes continue from IM33. Evidence below was read from `src/` on 2026-10-23; nothing was run in a browser for this round.

### ACT NOW (done)

- **IM34: the aging Treat button now says why it is disabled.** `src/aging_contact_ui.js` gives the title "Only in the Village." or "Needs N coins." before the care text. Wording only; no rule, no behavior change. Not re-run in a browser.

### ACCOUNT FOR NOW

- **IM35: the obligations ledger is only partly the one ledger.** Written by `craft_grudge.js`, `economy_standing.js` and `household_fortunes_domain.js` (grep of `obligations_ledger` imports). Heir grievance and archive duty (`heir_inheritance`) and the career kit debt are adapters that read, not writers. The new orphan, grief and schism rows must write through it (AD14) rather than add counters, or IM32's point is lost.
- **IM36: `carries` disagrees across two owners.** The household resentment row is `carries: false`, but the carry ledger's frontier row says "Open obligations: carries, last life; grievance stays open". The heir's grievance carries; household resentment does not. Both are true and the row text is blanket. Split the row by source, with the reason, before orphan and grief events add more rows.
- **IM37: the carry ledger lists no economy, pledge or aging state.** Loans, house standing, a live insurance policy, broker claims, price memory, vows, a heart demon, conditions and contact have no row at death or rebirth. AD11 wants each crossing visible. Default proposals: loans settle from the estate first; standing halves like reputation; vows and demon drop with the body; contact score carries to the heir as inherited family warmth only where a world says so. Each needs a stated reason, as dials.
- **IM38: two "heart" effects share a word and a stat family.** Aging's `heart` condition (health, stamina ceilings) and pledges' heart demon (strength and agility, up to 30%) are different stats but stack in one late-life body. Check the combined ceiling for a 65-year-old with a failed tempering. Keep names distinct in text so "heart" is not read as one thing.
- **IM39: grief and orphan events collide with contact decay.** Aging contact already decays company. A death of the single named contact (`villageElder`) can both drop the score and fire a grief event, which counts one loss twice. Let the grief event be the single writer of that drop and mark the contact row as dead, not decayed.
- **IM40: the skill floor and aging ceilings are the same shape.** Aging has `FLOOR` for health and stamina (0.6 and 0.7); a skill floor is a floor on decay. Use one floor vocabulary (default, dial, reason per world), not a second set of constants.
- **IM41: debts that ease with time and vows that scar do not meet.** `eases` is per season on rows; a vow's scar and the heart demon's pressure are state on the trial, not ledger rows. A broken vow owed to a person (a pledge to a family member, a diplomacy oath) should be a duty row with a creditor, so the schism and diplomacy dials can read it.
- **IM42: trust gifts and credit can launder each other.** `peer_standing` allows any gift and charges trust; house credit lends against standing. A gift to a manor member and a loan from a house are separate purses, but a loan spent as gifts could buy tier. Price tier gain from coins that were not borrowed, or note the interaction as an allowed route with its cost (AD22 means no hardening; this is about readable cause, not an anti-exploit).
- **IM43: spatial homes must carry the household and fortune state they touch.** Staff, routines and obligations are keyed to the manor. A home layout that moves or splits the household needs the staff and routine ids to stay stable. Procedural layout stays out (AD33 kept for that part); an authored home with two or three rooms and a place per routine is the slice.
- **IM44: away time and company.** AD16 stops away time at important choices. A grief event, an orphaning or a schism offer is such a choice. Contact letters in transit (3 days) and treatment seasons (90 days) keep running through away time, so a coming-of-age or grief event must not be able to expire silently (see IM17).
- **IM45: blanket wording in shipped text.** These read as always-true and need a default and reason, or a world dial: "Nobody refuses a gift" (peer standing intro), "Both ease with decent treatment; nothing locks" (household record), "Kept whole across every life" (carry ledger codex row), "never to zero" (pledges ration text), "Open obligations carries" (IM36), and "Nothing is left to temper in this slice" is a slice statement, fine. Not edited here: each states a design choice, not wording; a world-specific reason should be added with the dial.

### LATER / DELEGATE

| Code | Item | Level / effort | Done check |
| --- | --- | --- | --- |
| IM46 | Split the carry ledger's obligation row by source and add rows for loans, standing, insurance, vows, demon, conditions and contact (IM36, IM37). | sonnet, small | A test lists each new row for `base.frontier` and one book world with its scope and reason; no row lacks a reason. |
| IM47 | Orphan, grief and came-of-age events as three storylets writing obligation or contact rows (IM35, IM39). | sonnet, medium | A fixture shows a death firing one grief event, one contact drop and one ledger row, and reload keeps them. |
| IM48 | One floor vocabulary for aging and a skill floor (IM40). | sonnet, small | One constants owner; a test shows both read it. |
| IM49 | Diplomacy and schism dials over duty rows (IM41). | sonnet, medium | A fixture breaks an oath and the creditor's row reads it; each dial shows a reason. |
| IM50 | Authored two-to-three-room home with stable staff and routine ids (IM43). | sonnet, medium | A fixture moves a routine between rooms with no id change; browser check at 1536 and 1920. |
| IM51 | Combined-ceiling check for aging plus heart demon at age 65 and above (IM38). | sonnet, small | A test reports the combined ceiling and that it stays above the stated floor. |
| IM52 | Add default, dial and reason to the IM45 texts. | sonnet, small | Each string reads from a world dial or names its reason; `check:rules` unaffected. |
| IM53 | Real long-life headless run over all new systems together (extends IM31). | sonnet, medium | A run of 60 in-game years records condition, contact, standing and ledger rows with no unbounded growth (see `LIMITS` in `economy_standing.js`). |

### Panel audit for IM27 (state reasons in parts)

IM27 checks each new decision surface against the UR rules (UR7 disabled reason, UR32 empty states, UR47 hover descriptions, UR63 commitment together). No rule is added.

| Panel | Reasons in parts | Gap |
| --- | --- | --- |
| Aging (`aging_contact_ui.js`) | Health and stamina reasons listed, plus the dial reason | Contact score has one sentence, not parts. Treat title fixed (IM34). |
| Economy standing (`economy_standing_ui.js`) | Price terms list each standing part with a title; credit rows give a reason | House row reasons live only in a hover title on a non-focusable row (UR47 expects keyboard focus too). The insurance line hardcodes "road danger 0.2 ... 7 coins" as text, not read from state. Borrow disabled by limit shows the row reason only. |
| Household (`household_fortunes_panel.js`) | Staff parts each carry a why; routines and obligations carry whys | The watch list shows one "circumstances" number with no parts. Standing and resentment are two numbers; their causes are only in the ledger lines below. |
| Peer standing (`peer_standing_panel.js`) | Each gift button has its eligibility note and consequence | The ranking is coins only; its basis is stated ("by coins in hand"). No gap. |
| Pledges (`pledges_ui.js`) | Tempering risk names stability, pressure and scar; "Not ready" lists reasons | Risk is shown as a total, not per vow. Swear is disabled with a title; Temper's title is only "Not ready yet." where the line above has the parts. |

Gaps are recorded for later; none needed more than the wording fix in IM34.

Verification: `src/` read for IM35 to IM44; panel files read in full; one source edit (`aging_contact_ui.js`, syntax-checked with `node --check`). No browser run, no test run, nothing committed.

## YAIR-side gap check (2026-10-22)

The batches' claims about YAIR's own code were mostly name greps. A sonnet
verifier checked 74 distinct claims against `src/` and `tests/`:
[YAIR_GAP_CHECK](itch-io-2026-10-22/YAIR_GAP_CHECK.md). Results: 33
confirmed gaps, 25 partial, 11 already exist, 5 unclear.

Claims the batches got wrong, now corrected where this report repeated them:

- Lapsing storylets exist (`onExpire`, `src/simulation.js:557`).
- Titles already gate on counters (`src/titles.js`).
- A craft reaction engine with a toxin axis and dose routes exists but is
  unwired (`src/craft_resolver.js`, `src/craft_content_frontier.js`).
- `src/items.js` has no pill toxin or impurity fields.
- Scheduled consequences exist.
- Numeric relationship axes, including respect, exist.
- A deed-based epitaph (`src/life_experience.js`) and a defeat-cause record
  (`src/defeat_domain.js`) exist.
- AD18 already accepts banked time.

The coordinator re-checked the first and seventh against source.

The five most consequential confirmed gaps:

1. No chronic conditions or isolation effects.
2. The heir is a single successor with no inheritance law or parentage
   traits (IM3).
3. No standing routines or unlocks from completion counts.
4. No credit, insurance, market memory or faction tiers.
5. No cross-life discovery codex.

AD33 defers spatial homes and deprioritizes the NPC-heavy gaps.

## Open gaps

Everything still open from this wave (tool blockers, unread code, play-only
questions, unreachable builds, YAIR-side gaps) is consolidated in
[OPEN_GAPS](itch-io-2026-10-22/OPEN_GAPS.md) with stable codes OG1+.


## Current cultivation absorption check, 2026-10-24

Weibao requested a mechanic-by-mechanic check of Path and the other researched itch cultivation games against current OOPS, saving what remains. The [absorption matrix](itch-io-2026-10-22/CULTIVATION_ABSORPTION_CHECK.md) covers 42 named entries and 154 mechanism/disposition rows; **CG01–CG30** consolidate the still-missing or partial mechanisms. This is a current-source audit over pinned research, not a new whole-source read or playable-completion receipt. The [open-gap owner](itch-io-2026-10-22/OPEN_GAPS.md#cultivation-absorption-refinement-2026-10-24) links it without replacing OG/IM history or selecting a new build wave.
