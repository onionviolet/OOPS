# Proto23 forks, protolike fork networks and similar games, 2026-10-30

Research only. Weibao asked for similar games on GitHub, their forks, and Proto23's
own GitHub history. No gameplay was run, nothing was installed or cloned into the
repo, and no runtime code changed. Findings are proposals (AD32), not decisions.
Rankings measure research value to YAIRPG, not game quality.

Does not redo: [CATA/NekoRPG/GauTech/Progress Knight/Sect Chronicle/Cultivation
Stories/Endless Path screening](PROTOLIKE_AND_CULTIVATION_DISCOVERY_2026-10-22.md),
[the four-reference deep trace](protolike-deep-2026-10-22/REPORT.md),
[Proto23 vs YAIRPG](proto23/PROTO23_VS_YAIRPG_2026-10-10.md),
[Proto23 source mechanisms](proto23/SOURCE_MECHANISMS_AND_ADOPTION_2026-10-13.md),
[the Xeus24 mod audit](proto23/xeus24-mod-2026-10-10/XEUS24_MOD_AUDIT_2026-10-10.md),
[the general idle-game list](../RESEARCH_IDLE_GAMES.md) and the
[Discord protolike sweep](PROTOLIKE_DISCORD_SWEEP_2026-10-24.md). The 46 forks of
`miktaew/yet-another-idle-rpg` and `-dev` were scanned earlier today in chat and are
not rescanned (Kuroiteiken/yairp, SchokoKaramel, OneMoreGuy, ArturLange/suraimu stay
as recorded there).

## Method and evidence labels

- Route: `gh api` and `gh search repos` on 2026-10-30. Fork lists come from the
  forks API (direct forks only). "Ahead" is the compare API's `ahead_by` against the
  parent's default branch. Where a fork's parent was itself a fork, the compare was
  rerun against the immediate parent to avoid inherited counts.
- Labels: **documented** = README, docs or commit messages say so; **source-read** =
  I read the named source files; **inferred** = my reading of either. Nothing was
  played or built, so no playability claim is made.
- Licence is its own column because it sets what the finding is good for. A repo with
  no declared licence is reference for ideas, not for code.
- Pins are the head commit (10 or more hex characters) read on 2026-10-30.

## Findings

**F1. Proto23 has one source repo and a small, mostly cosmetic fork network.**
[`23html/23html.github.io`](https://github.com/23html/23html.github.io): last push
2022-10-22, head `e93a8cd617932fb698ff889b968a32f9a20d48f3` (the revision the earlier
audits pin), no licence declared, 18 stars, 13 forks. The owner has no other repo.
Keyword searches for `proto23`, `proto 23` and `23html` found no second source, mirror
or rewrite of the game. Two Chinese localization copies exist (`g8hh/proto23`, a Gitee
template README plus `chs.js` and an `inspector.js`; `15x15G/proto23`, `chs.js` plus a
workflow): documented as translation only, and the Proto23 file is a single HTML
page, so a `chs.js` overlay is the whole mod. `miktaew/proto23-re` is identical to
upstream (0 ahead), so it is a copy, not a rewrite. Sources: compare API per fork.

**F2. Twelve direct Proto23 forks; four carry real work and one is a different game
now.** Ahead counts against upstream `main`:

| Fork | Pushed | Ahead | What it adds | Label |
|---|---|---|---|---|
| Kuroiteiken/Echoes-Beneath | 2026-08-19 | 155 | see F3 | documented, docs read |
| MercuriusXeno/23html.github.io | 2026-07-30 | 104 | see F4 | documented |
| Xeus24/23html.github.io | 2026-10-08 | 44 | already audited | cited |
| tioluko/23html.github.io | 2025-05-13 | 12 | split CSS into `index.css`, small `index.html` trim, README | commit messages |
| zwospiel/copy-of-proto23 | 2023-05-06 | 5 | splits styles, audio and images into folders; a tab for viewing GitHub code | commit messages |
| yagdra-nihlahorn/proto23bugfix | 2024-06-12 | 4 | two-line `index.html` fix and README | diff stats |
| Skelly-Boi/proto23-clear-base | 2024-07-23 | 2 | number-notation edit for easier modding | diff stats |
| JustAnName/23html.github.io | 2023-04-20 | 1 | one skill and one effect for rank | commit message |
| bisclever, SteveHere, Deuxis/proto23-idle, miktaew/proto23-re | various | 0 | copies | compare API |

`Shuraken007/proto23` (85 ahead of upstream) is a snapshot of MercuriusXeno's
refactor: 0 ahead and 19 behind Mercurius, so it adds nothing and is not counted
separately.

**F3. Echoes Beneath (Kuroiteiken) is the most developed Proto23 continuation found,
and its docs audit Proto23's dead content.** Repo
[`Kuroiteiken/Echoes-Beneath`](https://github.com/Kuroiteiken/Echoes-Beneath), head
`f4ff4febb1dc232aa8f22291292f176a383eaa8f`, pushed 2026-08-19, no licence declared
(licence API 404), so ideas only. Same owner as the Turkish-localization YAIRP fork
already scanned; this is a different repo. The history is 155 commits dated
2026-08-16 to 2026-08-19 and the README says it "began as a fork" of Proto23 (the
name `Proto23` survives in an npm package and a stored key to keep saves working).
Documented changes, from the commit list and `docs/`:
- Source split into `js/core`, `data`, `systems`, `ui`, `world`, bundled to one
  file; 17-step `npm run check`; a browser regression suite. The README says bug
  fixes must extend regression coverage.
- Turkish localization; a redesigned changelog; versions v471 to v477 named in
  commits.
- Story chain extended past the original wolf hunt: Chapter III (the catacombs
  under the village) and Chapter IV (end of journey), a fourth journal panel for
  "what the player has worked out", a lore panel, and level rewards extended past 30
  (`docs/STORY.md`, `docs/REGIONS.md`).
- Background-tab handling: actions driven from the tick, "replayed time" announced
  after catch-up, energy drain derived from running cost instead of accumulated.
- Mastery tree finished, weapon mastery that tells against armour, ten previously
  unreachable titles made earnable, shields finished, general store that buys what
  you carry.
- `docs/PROPOSALS.md` is a developer audit of Proto23 content: whether resistance
  fields are read in combat ("mostly no"), 26 titles written and never granted, 19
  finished recipes nobody can learn, healing items with no repeatable source,
  armour class resistance counted twice with opposite signs.

Fit: high as a comparator. It is a second maintainer's answer to the same question
YAIRPG faces (what to do with content that exists but cannot be reached), and the
item list overlaps [PROTO23_VS_YAIRPG section 6](proto23/PROTO23_VS_YAIRPG_2026-10-10.md)
("bugs and unfinished parts, don't copy"). Cross-check, do not restate. The commit
cadence (155 commits in four days) is a labelled inference that the history is
batch or agent-assisted, which matters for how much weight its balance numbers get.

**F4. MercuriusXeno's fork is a TypeScript restructure with a "Cheater edition"
tweak, not new content.** `MercuriusXeno/23html.github.io`, head
`8d5cbd0859e5d968f19af659c1920b2444ed8293`, pushed 2026-07-30, no licence declared.
Documented: November 2024 commits add a drops pass ("slightly nerfed drops", missing
drops, a hammer perk fix, "Cheater edition"); 2026 commits are phased extraction of
the inline script into `src/` modules (data, game, ui, systems, locations), an event
bus decoupling game logic from the DOM, strict TypeScript, and a `CLAUDE.md`
describing the layout. Fit: low for mechanics, moderate as a record of how the
single-file `chs`/`data` globals decompose (its `CLASS_MAP.md` maps cryptic CSS and
function names to semantic ones). Our own seam work does not need it.

**F5. New Proto23-inspired games: three active, one dead.**
- `SardineMilk/incrpg` (IncRPG): head `24e2ada7247fd013f15342c85f322b5a922bd173`,
  pushed 2026-10-28, about 306 commits, no licence declared. Already known from the
  Discord sweep (F11 there: activities own meters, order-independent stat layers).
  This pass adds a source reading. **Source-read:** `src/data/actionsData.js`,
  `activitiesData.js`, `skillsData.js`, `conditionsData.js`. Content is a declarative
  vocabulary (`eff.*` effects, `evt.*` triggers, `sel.*` selectors by tag, `fml.*`
  formulas) so an action is data: `walk` gains XP in constitution, agility and wit
  on each tick and moves any active traversal activity's `distance` meter. A
  climbing activity has `height` and `grip` meters whose minimum triggers a fall
  with damage scaled by height. Skills form a tree where each parent levels from its
  children's XP (combat, resting, training, traversal, subterfuge, survival, labour,
  crafting, knowledge, social). A comment in `conditionsData.js` frames the game's
  "System" as imposed on the world, so sufficiently advanced magic can disable it.
  Fit: high for mechanism design (AD38 "things work by how they work"): selectors by
  tag plus meters is a concrete model of mechanisms rather than allowed-outcome lists.
  Not run; combat and persistence depth unknown.
- `Raynos/kami-kakushi`: head `ba9930c1e7`, pushed 2026-07-19, MIT, about 1,800
  commits, TypeScript, Edo-period farmhand story. Documented: the README preserves
  its seed prompt, which names Proto23 and YAIRPG as inspiration, plus a PRD with
  numbered ADRs, a story bible, a "no magic, mediocre start" intent and an
  unlock ladder where the UI grows with progress. Fit: moderate. Closest to this
  project's own process (decision records, canon bible, locked versus provisional
  intent); not a source of mechanics until its roadmap is read.
- `shtosik/yet-another-idle-rpg`: head `20abdf3f4962bf7442d99a70cff3fbd283f899c7`,
  pushed 2026-10-30, no licence, TypeScript Angular. **Not a YAIRPG fork or port**;
  an unrelated radial-skill-tree, pets and camp-crafting idle RPG that reuses the
  name. Its `docs/ideas/` (prestige, offline progress, crafting stations, rune
  socketing, bounty board) and `docs/systems/` are a design backlog worth one skim.
  Low fit.
- `UristMcDorf/exalted-idle`: last push 2025-04-29, README says no content yet.
  Dead; listed so nobody rediscovers it.
- Stubs and unread: `BingusIsdad/Skill-Idle-RPG` (README is one line),
  `just-pointless/arkivia` (README "inspired by proto23", 321 KB), `old-man-gibson/ksgproto28`
  (6.5 MB, matched "proto23" in its README), `ZeroEraX/idle-proto-23`,
  `jezabelniel/Proto23` (empty, 2017). None read beyond metadata.

**F6. NekoRPG's English and Vue forks make it reachable without reading Chinese.**
Base `btly0711/NekoRPG` (README "deep-modified mod of Yet-Another-Idle-RPG", pushed
2026-09-20, no licence, 13 stars; seven direct forks). Documented by commits:
- `Dimava/NekoRPG` (123 ahead, pushed 2026-09-27, head `e299be78e1`): translates
  versions V3.51 to V3.53b, ports the UI to Vue "islands", adds
  `docs/migration-plan.md` and `docs/translation-merge.md`.
- `tangemicioglu/NekoRPG` (64 ahead, 2026-06-21, head `9364753a60`): English
  translation with a glossary and a bestiary fix; documents the final-arc dialogue.
- `MedKitty/NekoRPG` (21 ahead, dictionary-based translation overlay, AI-assisted per
  its description).
- `floatclouds2021/Otherworld` is a detached copy ("NekoRPG second mod"), 18 commits
  named V0.02 to V0.10 on 2026-09; the README is NekoRPG's, so what it changes is
  unknown.
`miktaew/NekoRPG` is 1 ahead. Fit: this is a path to re-read NekoRPG's realm
mechanics in English, not new mechanics. The NekoRPG findings already recorded
(F6 in the four-reference trace) stand.

**F7. The Progress Knight network is large; the useful branches are Quest and its
reskins.** `ihtasham42/progress-knight` has 96 direct forks, about three dozen
ahead; most are one to five commits. Lineage: Progress Knight, then
`Symb1/progress_knight_2` ("2.0", Unlicense, pushed 2026-10-23, head `c099d6f9e6`,
33 direct forks), then `indomit/progress_knight_2` (Progress Knight Quest, 441 ahead
of 2.0, pushed 2026-09-25, head `d03f8b65ad`, 48 stars, 84 direct forks). Documented:
Quest "contains 5 prestige layers with various unique mechanics". Branches worth
naming:
- `aneqinun/progress_cultivator` (71 ahead of Quest, 2026-05-12, head `2e6feafa69`):
  "xianxia edition" with "an alchemy mechanic", pills hidden until the job unlocks,
  renamed homes and milestones. Documented by README and commits.
- `r-zander/progress-station` (736 ahead of the original, GPL-3.0, pushed 2026-08-19,
  head `f6969f0d0e`): a sci-fi reskin and rebuild; README lists 6 modules, 34
  operations, 10 factions with 120 battles, 4 sectors, a boss and a roguelite loop.
  Fit: a worked example of the same chassis carrying a different world.
- `frosttear/progress-knight-llm` (21 ahead): documents a fixed original bug (after
  the second rebirth type the max-level bonus was reset), multiplier breakdowns on
  click, and LLM-written life reviews. The breakdown is a UI idea; the LLM story
  layer is outside this project's direction.
- `TerraTectra/progress-knight-reality-break` (16 ahead): meta layer ("multiverse",
  "Evil perks by universe", observer placeholder). `rodriar000/progress-knight`
  (54 ahead): background-time recovery, persisted preferences, save-safety.
- `Delzi/progress-knight-modern` (modern-day setting), `villanovasoft/progresso-cavaleiro`
  (33, Portuguese), `CameronGott/progress-knight` (60, 2021 dev diary with dynamic
  tooltips and a town buildings tab), `ReignOfRaining/NyaNyaKnight` (28, art/skin).
Licence: Unlicense across the Knight line, except Progress Station (GPL-3.0). The
lineage is already how `Patji-dev/lianara` credits itself (F10).

**F8. Idle Loops has an active continuation chain.** `omsi6/omsi6.github.io` (head
`fa21477d42`, pushed 2023-11-21) has 117 network forks but 37 direct. The live
line is `lloyd-delacroix/omsi-loops` (254 ahead, pushed 2024-01-15, head
`5008c4a1fa`), then `dmchurch/omsi-loops` (352 ahead of Lloyd, default branch
`dmchurch`, head `0d859ff994`, pushed 2026-10-30), whose recent commits tag release
`3P.1.3` and add accessibility labels (`aria-label`, row numbering, checkbox labels).
`Tomnar9/omsi-loops` is 3 ahead of dmchurch, so it adds nothing. No licence on any of
them. Documented: dmchurch's `NOTES` folder and a `wasm-rationals` branch exist; not
read. Fit: the accessibility pass is a recent precedent for labelled idle-game
controls (compare the label pass already logged in this repo); mechanics were
audited earlier from Omsi's version.

**F9. Immortality Idle, GauTech and CultivationIdle have no useful fork networks.**
`GauTech/experimental-idle-rpg` has 0 forks. `shlocko/CultivationIdle` has 1 fork,
0 ahead. `immortalityidle/immortalityidle.github.io` has 47 forks: the largest,
`animaesuriens/immortalityidle-andysfork.github.io` (138 ahead, 2026-02-12, head
`a4f8bc345c`), says it contains personal UI and quality-of-life changes; the next is 7
ahead. So nothing mechanical beyond the base.

**F10. The most relevant new work is a cluster of cultivation and life-sim
incrementals created in 2026, several with design records.** All documented from
READMEs unless marked; none run.
- **Lowbridge**, [`Kyuwyn/lowbridge`](https://github.com/Kyuwyn/lowbridge), head
  `137737d8bd5d7c5bdd685735bceb2ed01d999721`, pushed 2026-10-29, no licence, about 63
  commits, created 2026-10-21. An ordinary life in a mill village; the "first playable
  ends at Foundation". README documents: instant versus sustained action tempos;
  a bank of unused real time with objective stops and an Accelerate toggle ("an
  objective for one activity", it stops when full or unaffordable); methods that are
  learned, attuned into few slots, then used for qi, with "route keys" naming what a
  method is made of; a craft bench that needs furnished floor; "No age, lifespan or
  retry ends a journey. A failed attempt costs the time and the preparation it used,
  keeps everything you discovered"; import resumes a snapshot without adding the
  time since export; a second tab cannot run the same journey. It keeps ADRs
  (0021 to 0024), a simulation report of measured time to Foundation, a playtest sheet
  and a validator that fails a gate naming another chapter's record. It credits
  Arcanum: Theory of Magic as its inspiration and says it does not fork its runtime.
  The Discord sweep recorded someone planning an Arcanum-inspired game on 2026-10-07
  (#users-code); I did not verify that this is the same author.
- **Severed Heaven** (working title), [`janperolino/cultivationgame`](https://github.com/janperolino/cultivationgame),
  head `5deef48802825cf5861f52c13372d57246a2189c`, pushed 2026-10-25, no licence,
  about 563 commits, TypeScript and React, desktop-only 1920x1080 stage. Documented:
  a routine wheel of twelve double hours given to qi, body, soul, study, practice,
  sleep, post or craft with a bonus for keeping the hour; manuals placed on a bookcase
  and read in study hours, a finished manual shown on the skill tree as a jewel;
  per-person pages (nature, wants, trust, memory); a chronicle of the life with
  earlier lives a click away; map travel with encounters whose stance (avoid,
  careful, bold) settles easy ones; "one real hour is one year" at Qi Condensation;
  up to 12 hours of offline time. It also has a "Go in" scene mode written by an
  LLM through the player's own OpenRouter key. That layer sits outside this project's
  direction (mechanisms first); the rest is the closest match found to a life-sim
  with books as progression.
- **Hundred Lives to Ascend**, [`Tera-Dark/hundred-lives-to-ascend`](https://github.com/Tera-Dark/hundred-lives-to-ascend),
  head `4fd5c1923247cea85da44ed4dbed3fc932252e09`, pushed 2026-10-19, no licence,
  Chinese-language, two-life vertical slice. Documented: finite lifespan allocated
  across livelihood, cultivation and study; on reincarnation the character's cash and
  level reset, the account keeps points and records, "the world calendar, NPCs and
  regions keep moving", and physical heirlooms do not duplicate; two origins times
  two majors times two livelihoods; 19 staged feature introductions. Fit: a direct
  comparator for persistence of a world versus a person across lives.
- **Dao Tree**, [`TickTockBent/dao_tree`](https://github.com/TickTockBent/dao_tree),
  head `88ba8eee6aa04aeec2345eaefae5d2c02e1cdb2e`, pushed 2026-07-21, about 713
  commits. Licence conflict: README says MIT, the API says NOASSERTION; treat as
  unclear. Documented engineering that maps to our lanes: a `meets()` condition DSL,
  a prestige cascade compiled from persistence scopes (tree, life, eternal), data
  tables as the single source of every number, lint invariants over the data ("no dead
  multipliers, completability by construction, closed economies, optionality: optional
  systems are accelerants, never requirements"), and a headless actor-model pacing
  simulation with profiles from spine-only to competent optimizer. Its sibling
  `TickTockBent/dongfu` is a design record of dated calls (6 commits).
- **Lianara: Cycle of Ascension**, [`Patji-dev/lianara-cycle-of-ascension`](https://github.com/Patji-dev/lianara-cycle-of-ascension),
  head `7ffd66351fb24c368c162cc6f6c695b7587c66fb`, pushed 2026-09-19. Rights reserved
  for its additions (LICENSE says no modification or rehosting). Documents forty
  realms across lives, sect duties and a sanctuary; credits Progress Knight, 2.0 and
  Quest with written permission. Look, do not reuse.

**F11. Other active idle RPGs are lower fit.** `Heavenly3/Aetheria` (MIT, pushed
2026-10-29, head `c885caf95b26`): 21 skills with per-action mastery and prestige,
tiered tools, thieving heat and jail, fishing waters; documented, broad but
conventional. `Trobikus/ashen-crown` (head `b37f27e083`, 2026-10-28, licence not
standard): 5 continents, 50 areas, 217 skill nodes, a forging workshop; closed alpha.
`GoldenLys/REverse` (155 commits, story overhaul v3.6), `EdwardAThomson/RPG-Loom`
(deterministic core with optional AI quests), `netmobster/elsewhere-idle-cc`
(an idle RPG inside Claude Code), `Tera-Dark`-style Chinese cultivation games and
Roblox wikis surfaced in searches and were not pursued.

**F12. A third-party corpus analysis exists and covers games we have not read.**
[`jmyoon1/awesome-incremental-games-analysis`](https://github.com/jmyoon1/awesome-incremental-games-analysis),
head `f1f3152863`, created 2026-08-25, licence NOASSERTION. It says it deep-read 33
games and extracted 31 cross-game patterns, citing files and lines. Its game list
overlaps our covered set (A Dark Room, Candy Box 2, Evolve, Kittens, Level13,
Trimps, Progress Knight, Omsi Loops) and adds ones we do not hold: `vue-idle-xiuxian`
(a popular xianxia idle whose pill effects its note says are never read, so a
cautionary specimen), `gooboo`, `idlelands`, `1255-burgomaster`, `sharkgame`,
`synergism`, `space-company`, `merchant-js`, `swarm-simulator`, `prosperity-wars`,
`continuum-engine` and engine notes. Its pattern index includes "Offline progress:
simulation vs closed-form vs banked time vs none" (22 games), "Rule-delta prestige"
(3), "Time-loop prestige" (2), "UI-as-content unfolding" (10) and "Effect-source
aggregation" (12). This is a secondary source made by an unknown author; its claims
are leads, not evidence, until checked against the cited files.

**F13. Pattern across the 2026 cluster (inferred).** Lowbridge, Hundred Lives,
Severed Heaven, Dao Tree and kami-kakushi all ship decision records, design specs or
playtest sheets beside the code, and several were created within weeks of each
other (September and October 2026). I infer these are agent-assisted projects from
the presence of agent instruction files and the commit volume, not from any author
statement. The consequence is on weight: their balance numbers and "measured" times
come from simulations of their own design, and the useful part is the shape of the
decisions, not the numbers.

## Candidates

Ranked by research value to YAIRPG's direction (deeper systems, several progression
paths, mechanically distinct worlds, life-sim, books as progression).

| Rank | Candidate | Why it earns the slot | Licence | Pin |
|---|---|---|---|---|
| C1 | Lowbridge (F10) | Time bank with objective stops, action tempos, attunement slots and route keys, failure that keeps discoveries; the nearest comparator for the away-time and practice systems, with ADRs and a simulation report to read | none declared | `137737d8bd` |
| C2 | Hundred Lives to Ascend (F10) | A world and its people keep moving while the person resets; heirlooms do not duplicate | none declared | `4fd5c19232` |
| C3 | Severed Heaven (F10) | Day wheel, manuals read in study hours and set on a skill tree, people pages, life chronicle; skip its LLM scene layer | none declared | `5deef48802` |
| C4 | Dao Tree (F10) | Persistence scopes, data lint invariants, headless pacing sim with optionality proofs: verification patterns | MIT per README, NOASSERTION per API | `88ba8eee6a` |
| C5 | Echoes Beneath (F3) | A Proto23 continuation whose docs list reachable versus unreachable content and a story chain extension | none declared | `f4ff4febb1` |
| C6 | IncRPG (F5) | Tag selectors plus meters as a mechanism vocabulary; skill tree fed by children | none declared | `24e2ada724` |
| C7 | Progress Knight Quest and Progress Cultivator (F7) | Five prestige layers; an alchemy layer on the Knight chassis | Unlicense line | `d03f8b65ad`, `2e6feafa69` |
| C8 | jmyoon1 corpus (F12) | 33 source-cited game notes and 31 patterns; fastest route to unseen games | NOASSERTION | `f1f3152863` |
| C9 | NekoRPG English forks (F6) | Readable NekoRPG realm content and a documented Vue migration | none declared | `e299be78e1` |
| C10 | kami-kakushi (F5) | Same-style process (ADRs, story bible, locked versus provisional intent) in a no-magic setting | MIT | `ba9930c1e7` |
| C11 | dmchurch omsi-loops (F8) | Active Idle Loops line with an accessibility pass | none declared | `0d859ff994` |
| C12 | Progress Station (F7) | One chassis carrying a distinct world, with a boss and roguelite loop | GPL-3.0 | `f6969f0d0e` |

## Coverage limits

- Direct forks are the default scope (reason: the API returns nothing else). GitHub's forks API omits fork-of-fork networks, so forks of
  Xeus24's, Echoes' and Mercurius' repos (none exist for the first two; Mercurius has
  1, a snapshot) are known, but deeper Progress Knight and Idle Loops descendants are
  not. Progress Knight's 96 direct forks were scanned for ahead counts; forks one to
  two commits ahead are counted, not read. `GodlikeShimmyer/progress-knight` returned
  404 on compare.
- Search is keyword-biased. Multi-word `gh search repos` queries often returned
  nothing, so I used `topic:` and `in:readme` queries (about 40 in all). A small or
  untagged repo can be missed. Non-GitHub homes (itch.io, GitLab, Kongregate,
  Discord) were not searched, including Arcanum itself, which Lowbridge cites.
- Nothing was cloned, built or played. Every mechanic above is from READMEs,
  commit messages, repo docs and the four IncRPG data files I read.
- Not read: `dmchurch` NOTES, Kami-kakushi's PRD sections beyond the preamble,
  Lowbridge's design plan and ADRs, Severed Heaven and Hundred Lives source, the
  jmyoon1 notes beyond the index and one game note.
- The earlier `dHR-P/wuxian-lunhui` lead (404 in the 2026-10-22 pass) was not
  rechecked.

## More to consider

**ACT NOW (this report settles it)**
- The pointer line is added to the 2026-10-22 discovery doc.
- IncRPG, already a Discord-sweep find, now has a pinned source reading (F5), so the
  sweep's "public build, text read" note can cite this pass for the data model.
- Licence is recorded per find: just kami-kakushi, Aetheria and the Knight line
  (Unlicense) declare terms that allow reuse; everything else is ideas only. No code
  is proposed for absorption from this report.

**ACCOUNT FOR NOW (constraints on live work, no new feature)**
- A1. Lowbridge's away-time design is a comparator for `src/away_bank_domain.js`,
  which has uncommitted edits in the shared checkout. Do not change that lane from
  this report; read Lowbridge's design plan (C1) before the next away-bank decision.
- A2. LLM-written scenes (Severed Heaven's "Go in", the Knight LLM edition) fit
  neither AD38 (mechanisms, not generated outcomes) nor the background-only rule;
  read around them.
- A3. Echoes Beneath's unreachable-content audit overlaps the Proto23 section 6 list.
  A future pass should diff the two lists, not write a third.
- A4. The 2026 cluster's simulated pacing numbers are self-measured (F13); quote shapes
  of decisions, not numbers.

**LATER / DELEGATE (proposals; none authorizes spawning)**

| Item | Level | Effort | Done check |
|---|---|---|---|
| L1. Read Lowbridge design plan, ADRs 0021 to 0024 and the simulation report; compare banked time, tempo and attunement against `away_bank_domain` and the practice owners | sonnet | medium | Comparison table naming each Lowbridge rule, our owner file and a keep/differ/gap call, with pinned links; no code change |
| L2. Compare Hundred Lives' and Dao Tree's persistence scopes with our save and multi-life owners | sonnet | medium | One table of what survives a life/world change in each, mapped to our save rules; gaps listed as proposals |
| L3. Source-read Severed Heaven's routine wheel, manual/bookcase and people-page code, excluding the scene layer | sonnet | medium | Mechanism notes with file paths against pin `5deef48802`, plus a fit call against the life-sim and book-reading owners |
| L4. Extract the pattern notes for offline progress, rule-delta prestige, time-loop prestige and UI-as-content from the jmyoon1 corpus and spot-check three cited lines each | haiku, then sonnet to judge | low | Four one-paragraph extracts, each with a verified file/line, and a list of games not yet in our covered set |
| L5. Diff Echoes Beneath's PROPOSALS against Proto23 vs YAIRPG section 6 | haiku | low | Two lists merged by item, with each marked already-known or new |
| L6. Read English NekoRPG (Dimava) for realm-II content not yet recorded | haiku | low | Delta list against the four-reference trace F6 section |
| L7. Rerun the fork scans in about three months; the Dao Tree, Lowbridge and Severed Heaven repos are weeks old | haiku | low | Updated ahead counts and new heads for the pinned list |
