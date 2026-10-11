# YAIRPG expansion project

A single-player browser idle RPG built on Yet Another Idle RPG, inspired by
Proto23 and cultivation/progression fiction. Weibao directs and reviews the
playable result; agents implement. Personal creative project.

## Vision

- Multiple worlds with distinct rules, economies and progression, plus
  meaningful interactions between them.
- Dense stats and interconnected skills where ordinary skills stay useful late.
- Deepen existing YAIRPG systems as well as adding new ones.
- The starting world is a full campaign of its own, alongside the others.
- Prestige/rebirth, kept separate from travel and ascension.

Full original requests: [User vision](docs/USER_VISION.md). Design families:
[Idea index](docs/IDEA_INDEX.md). Candidate world families and the original
expansion proposal: [log](docs/gm/PROJECT_LOG.md#expansion-design-proposal).

## Accepted decisions

- **First milestone:** one realm and one prestige layer. This sequences
  delivery; it does not cap the vision.
- **Branch dimension (2026-10-03):** the expanded setting is its own branch of
  YAIRPG, distinct from the original developer's continuity.
- **Vanilla stays intact (2026-10-03):** inherited opening, native quests,
  stats, professions, equipment and center-menu play. New story is opt-in. No
  forced restart, cultivation or second world on entry.
- **Cultivation slice retired (2026-10-01):** Jade Hollow is archived; its
  saved data stays dormant. Cultivation remains a possible later path.
- **Original UI is the baseline (2026-10-02):** extend existing panels and
  center actions rather than adding separate windows.
- **Worlds:** original worlds and direct book/anime/game settings are both
  allowed. A referenced book is not automatically a direct adaptation, and no
  final favorite list is required to start.
- **Reference games:** Theory of Magic and Path of Achra lead the research
  shortlist (with Orb of Creation, Siralim Ultimate, Loop Hero). Your
  Chronicle's expansion/balance principles are accepted as review criteria.
- **Defeat:** native defeat stays unconsciousness and recovery. True death,
  run endings and rewind remain proposals.

- **D1 ordinary skill to technique loop (2026-10-07):** authorized S-O2 plus
  M-P2 as one native alloy, one crafted item and one equipment-sensitive
  technique application. Springsteel and its numbers are implementation
  proposals awaiting playable acceptance; see the
  [D1 checkpoint](docs/gm/d1-alloy-equipment-2026-10-07/CHECKPOINT.md).
- **Bonuses from furniture and more (2026-10-11):** furniture, fixtures,
  accessories and similar owned things may give passive bonuses, as in
  Proto23. This replaces the earlier "fixtures without passive bonuses"
  choice. Specific numbers stay proposals. Absorption wave:
  [absorb-2026-10-11](docs/gm/dispatch/absorb-2026-10-11/ASSIGNMENT.md).

Still undecided: realm names, main story, skill roster, reset and retention
rules, balance, and which book worlds become campaigns.

- **Anything is possible (2026-10-09, Weibao):** where a design has several
  reasonable answers, implement them as player choices instead of picking
  one (for example: teaching can cost coins, time, a favor, or nothing).
  Defaults stay modest; the alternatives are always reachable.
  Refined 2026-10-10: options exist when a world, person or event makes
  them possible; beyond that, anything is possible in some obscure way or
  by carrying over from a prior run.
- **Rulebook (2026-10-10, Weibao):** twelve rules in
  [docs/RULES_FROM_SCRATCH.md](docs/RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10).
  Key points: each world makes its own rules (no global defaults); book
  worlds follow their book; bodies carry real stats; things cross only via
  a carrier; readings can be wrong; outliers exist; only Weibao's words
  are accepted. Agent-made "rules" were rewritten
  ([audit](docs/DESIGN_DEFAULTS_AUDIT.md)). Heirs inherit what the previous
  life left behind (code change pending).
- **Book worlds (2026-10-09, Weibao):** recreate read books directly, with
  premises free to change (canon, divergent, remix, swapped premise).
  Direct recreations live in a private pack outside git and outside
  `dist/bundle.js`; the public fork keeps original names. First book world:
  book world 1 (source identity retained in private research).

- **JJK and odd worlds (2026-10-10, Weibao):** JJK can be a book world
  set in any era (past, current, future) chosen per run; innate techniques
  can come by any route; borrowed ideas can also live in an odd world where
  they work differently; and the world should react to odd records (a
  courtroom domain judging real save history is wanted). Design in
  [docs/worlds/jujutsu/WORLD_BRIEF.md](docs/worlds/jujutsu/WORLD_BRIEF.md).

- **Natural course (2026-10-10, Weibao):** every world continues its
  natural lore or canon unless sufficiently disturbed. A standard for all
  worlds; each world sets its own dials. Details (proposals):
  [docs/TIMELINES_AND_DIVERGENCE.md](docs/TIMELINES_AND_DIVERGENCE.md).

- **Hidden world specialness (2026-10-10, Weibao):** "I wont know whats so
  special about them myself until its discovered or uncovered using
  relevant skill." A world's signature rules start hidden and are found in
  play through fitting skills or other routes. Details (proposals):
  [docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md](docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md).
- **Sealed secrets (2026-10-10, Weibao):** "make sealing the standard rule
  for agents, but of course we stll need to consider implementation and
  more". Agents use secrets freely to build and test but never show a
  truth to Weibao outside play unless he asks. Rule in
  [AGENTS.md](AGENTS.md#sealed-secrets); implementation proposals in the
  [discovery doc](docs/worlds/WORLD_SECRETS_AND_DISCOVERY.md#sealed-secrets-standard-rule-2026-10-10).
- **Hidden intent (2026-10-10, Weibao):** the player knows only what their
  character knows. NPCs can hate or target you for any reason (a system
  tag, a Todd-style judgment in Re:Zero) and you stay unaware unless a fitting
  identification skill or other route reveals it.
- **Knowledge and means, both ways (2026-10-10, Weibao):** "its
  not like enemies would have access to stuff like those.... unless they
  do?" and "Its unlikely for me to know stuff about them unless I use a
  certain thing to check... everything needs to make sense in their
  respective worlds." Clarified: "not the world let you observe but
  rather the means you have on hand." Neither side knows more than the
  means it actually holds can reveal (a skill, power, item, contact,
  access or prior knowledge); by default both keep plain impressions
  (heard of, saw fight, fought). Means travel with their holder and can
  be gained or lost; a world only sets how common each means is.
  Widened (Weibao): "Alot of things should be decided by means, on both
  sides." Knowing, finding, reaching, communicating, harming, defending,
  healing, making, persuading, hiding, enduring, timing, remembering and
  legitimacy all follow the means each side holds; NPC plans use the
  same gate as the player. Means principle and appraisal levels and types:
  [docs/MEANS_AND_APPRAISAL.md](docs/MEANS_AND_APPRAISAL.md).
  Details (proposals):
  [enemy side](docs/PRESENTATION_AND_FOURTH_WALL.md#enemy-knowledge-stays-in-the-fiction-2026-10-10),
  [both ways](docs/PRESENTATION_AND_FOURTH_WALL.md#knowledge-works-both-ways-2026-10-10).
- **Playable system entity (2026-10-10, Weibao):** "Why not?" Playing as
  a system that guides a host is allowed where a world supports it.
  Details (proposals):
  [held systems](docs/LIFE_SIM_NORTH_STAR.md#weibaos-answers-and-follow-up-2026-10-10).

## Current status (2026-10-07)

- **Branch:** `codex/gameplay-foundations`, on the v0.6 development foundation
  (see [v0.6 migration](docs/V06_MIGRATION.md)).
- **Build:** bundle `7c4fe2b159f0`, 1,254 simulation commands, 52
  controllers, 24 conditions, 7 plans. Save schema: expansion 11,
  simulation 5, plus optional `proto23Village` and `motherOfLearning1`.
- **Destinations:** home world `base.frontier`; nested hub, Saltworks and
  Archive; Folded Glasshouse; Tidemark; Paradise hub and Goa; Mother of
  Learning Cyoria; Proto23 village branch. Depth is uneven, so ten IDs do not
  mean ten finished worlds.
- **Four-game home-world checkpoint (2026-10-07):** DF stock reports,
  Book of Hours manual study, ONI nursery renewal and a Cult-inspired Eda
  assessor agreement have bounded native browser, save/reload/import and
  consumer evidence. The shared bundle matches the combined preview; see
  [delivery and playable review](docs/gm/non-factorio-absorption-2026-10-07/REPORT.md).
  These are original prototype behaviors. Balance, natural progression and
  unplayed branches remain in their
  [acceptance backlog](docs/gm/non-factorio-absorption-2026-10-07/ACCEPTANCE_BACKLOG.md).
- **Other verification stays with each owner.** These local proofs do not
  verify all worlds or earlier waves. D1 has automated evidence with its browser
  gate open in [its checkpoint](docs/gm/d1-alloy-equipment-2026-10-07/CHECKPOINT.md).
  Life-record, household and experience lanes retain their own receipts.
  Wave-specific gates remain in `docs/gm/<wave>/ACCEPTANCE_BACKLOG.md`.

Wave-by-wave delivery history: [project log](docs/gm/PROJECT_LOG.md).

## Village career proposal (2026-10-09)

Original playable proposal, awaiting Weibao's fiction and balance acceptance:
Village's native patrol is available from the opening. Tessa lends a lantern
and baton for one existing two-hour, 50-coin round. Leaving early earns no
career credit. The custody ledger requires returning the kit or recording a
50-coin debt; another loan waits until the kit is returned or its debt paid.
The kit is job custody, not an equippable item or a stat bonus.

Three ranks use completed native work and returned kits, with no career XP:
Apprentice, Dependable worker (two full shifts/two returns), Mentor (five/five).
Tessa remembers the last shift and kit resolution; each claimed promotion
adds one career biography entry. Optional `village_career` schema 2 defaults
to an empty career on old saves, without invented history, debt or rewards.
Schema 1 careers migrate additively, retaining earned ranks, shift counts and
kit custody while starting the new study fields empty.
An old saved patrol without career data continues as its original native job;
newly started Village patrols use the career contract.

Evidence and remaining acceptance: [village career report](docs/gm/dispatch/village-career-2026-10-09/REPORT.md)
and [checkpoint](docs/gm/dispatch/village-career-2026-10-09/CHECKPOINT.md).

## Village practical study proposal (2026-10-09)

Original playable proposal, awaiting Weibao’s fiction and balance acceptance:
after Dependable worker, Tessa gives one native six-minute Watchcraft notes
book. Completed native reading is **known**; five minutes of native Village
meditation rehearsing calm sector scanning is **practiced**. A new full native
patrol is **executable** only with the career’s loaned lantern and baton in
custody. That round pays 50 base coins plus a proposed 10-coin clear-report
bonus. Early departure earns neither. The center menu shows all three states
and the current/next payout; the first successful use adds one life entry.

This reuses native books, meditation, patrol and life record, plus optional
career schema 2. Existing Eda clearance study, Proto23 cutting practice and
Shack workshop content remain their own methods. No new XP track or world.
The three old unsupported-schema tests are repaired; both parts’ verification
and remaining director review are owned by the
[village study report](docs/gm/dispatch/village-study-2026-10-09/REPORT.md)
and [checkpoint](docs/gm/dispatch/village-study-2026-10-09/CHECKPOINT.md).

## Next step

1. Playtest the current build from a fresh origin: base opening, one home-world
   loop, one book world, then save, reload and import.
2. Work through the acceptance backlogs, starting with save compatibility.
3. Only then start the next content wave.

## Repository

- Fork: https://github.com/onionviolet/yet-another-idle-rpg (public)
- Upstream: https://github.com/miktaew/yet-another-idle-rpg
- Keep the MIT license and upstream attribution.
- Source in `src/` (content `src/data/`, models `src/models/`, shared state
  `src/components/`). The browser loads `dist/bundle.js`, built by esbuild.
- Node >= 22.13: `npm ci`, `npm test`, `npm run build`.
- Serve: `python3 -m http.server 8123 --bind 127.0.0.1`, open
  http://127.0.0.1:8123. Use a separate fresh origin for tests and one game
  tab per origin. Saving needs Web Locks (localhost or HTTPS, not file://).
- Private save exports in `~/Downloads/Games/` stay untouched.
- `docs/research/novels/` is local-only (gitignored): derived notes from
  copyrighted books, kept out of the public repo.

Other owners: [playtest log](docs/PLAYTEST.md),
[engine contracts](docs/ENGINE_EXPANSION.md),
[creative proposals](docs/DIRECTION_SYNTHESIS.md),
[superseded prototypes](docs/PROTOTYPE_HISTORY.md),
[GM workflow](docs/GAME_MASTER_PROMPT.md).

## Village Mentor teaching proposal (2026-10-09)

Historical prototype, superseded by the Village choices proposal below.
Original playable proposal, awaiting Weibao's fiction and balance acceptance:
a Mentor can ask Tessa to assign Iona, one adult recruit registered in the
existing Village lives. During a new practiced Watchcraft patrol with the
loaned lantern and baton, five shared minutes teach Iona the known/practiced
method. The completed round shares 10 coins with her, paying the Mentor 50
instead of the normal Watchcraft 60. The choice shows its time and wage cost;
early departure pays nothing, while completed lesson minutes are retained.

Trained Iona can take one two-hour solo patrol at a time. Her round advances
on the common played clock while the player remains in Village, pauses
elsewhere, and pays the career a proposed 10-coin stipend on her report.
She remembers the named teacher; only her first solo round adds a biography.
The report, stipend and biography publish together after a successful save.
Optional career schema 3 upgrades schemas 1/2 additively, preserving earned
history, study and custody, with no invented recruit or stipend. No new
NPC ticking loop, party, world or prestige.

[Play instructions and evidence](docs/gm/dispatch/village-mentor-2026-10-09/REPORT.md),
[checkpoint](docs/gm/dispatch/village-mentor-2026-10-09/CHECKPOINT.md).

## Optional book world 1 proposal (2026-10-09)

A generic runtime loader and gitignored private first slice are implemented as
proposals awaiting director fiction/balance acceptance. Village departure is
opt-in. Four premise choices, three colleagues, one timed supply duty with
kit/stock custody and local pay, and distinct temporary/permanent storage
methods are playable in the original center menu. Local logistics recognition
and existing Village references stay separate from native career promotion.

Public source and bundle contain generic pack support only. Missing packs
leave the base opening available; removed packs retain dormant progress and
return to Village, with reinstallation restoring access without replayed wages.
Phase B began after the village-choices source release. Tests pass 273/273;
rebuilt fresh-browser present/absent, duty/storage/return, old-save and actual
save/reload/import proofs are in the dispatch receipts. Later campaign depth
and unexercised branches remain explicitly open.

[Playable report](docs/gm/dispatch/soldiers-life-world-2026-10-09/REPORT.md),
[checkpoint](docs/gm/dispatch/soldiers-life-world-2026-10-09/CHECKPOINT.md) and
[acceptance backlog](docs/gm/dispatch/soldiers-life-world-2026-10-09/ACCEPTANCE_BACKLOG.md).

## Village choices proposal (2026-10-09)

Implements the accepted player-choice principle and Weibao’s teaching addendum;
fiction and numbers remain proposals for playable review. A Mentor chooses
Paid mentor by default (60-coin round plus a 10-coin post-funded training
stipend), taught on your shift (10 lost wages because you patrolled less,
50 total), Time (a fresh full two-hour unpaid shift), Favor (normal 60 plus
one owed covered shift), or Free (normal 60 with no obligation). All lessons
occupy five shared native minutes; Time occupies the full shift. Old withheld-
wage lessons retain their history as “taught on your shift,” never a fee to Iona.

Iona can spend one owed favor covering a two-hour Village round for 50 coins,
without player career credit. After her first solo return, she may offer five
coins of tuition from her own first solo stipend; accepting or declining is
explicit and remembered. Dependable workers may learn Watchcraft through
six native meditation minutes with Tessa instead of reading her six-minute
book; both still require five separate practice minutes and the loaned kit
for execution. The written notes remain obtainable after personal instruction.

Optional career schema 4 migrates schemas 1–3 additively, preserving history,
study and kit custody without invented favors, tuition or teaching stipends.
The existing return/debt/payment choices remain. No new world, prestige,
NPC timer or XP track.

[Audit, play path and evidence](docs/gm/dispatch/village-choices-2026-10-09/REPORT.md),
[checkpoint and source reservation](docs/gm/dispatch/village-choices-2026-10-09/CHECKPOINT.md).

## Absorption wave proposals (2026-10-11)

v0.6 development Days 2–7 content is merged while retaining fork extensions and the existing guild save ID. Furniture bonuses now derive from existing native housing, earned fixtures and owned books/kits. Numbers and the rack/bench recovery/study interpretation are proposals. Native Shack sleep and save/reload/import are browser verified; other furnishing branches remain in the [wave backlog](docs/gm/dispatch/absorb-2026-10-11/ACCEPTANCE_BACKLOG.md). Current integration owner: [checkpoint](docs/gm/dispatch/absorb-2026-10-11/CHECKPOINT.md).

Absorption C1 proposal: four craftable native amulets offer +2 points item-craft chance, +5% relative drops, 5% markup reduction or safe-location tier1 cooking. One native amulet slot makes these mutually exclusive preparations. Native costs/skills/custody remain authoritative; no new save domain. Craft/luck/portable cooking and save roundtrip browser verified.

Absorption C2 proposal: native food-poison exposure trains resistance, idle local searches have a capped rising chance and finite finds, Village runners offer help/decline, and a midday bread table returns each game day. Additive absorb_local_life schema1 defaults empty on old saves and rejects unsupported schemas. Core browser journey and persistence verified; alternatives remain in the wave backlog.

Absorption D proposal: an original Waypost Fort repair quest connects native salvage, smelting and a cellar ledger. A finite funded supply board buys stock without Village career credit; learned source rows and disclosed clear milestones reuse real progress. Additive fort_supply schema1 rejects unsupported records and defaults empty on old saves. Strong generated-hero browser proof covers the full chain, two payments and persistence; natural balance remains open.

Absorption E1 proposal: independent default-off home-world hunger and weather settings. Hunger drains on played native time and scales ordinary earned XP from80% to100%; native meals restore fullness even with a retained meal buff. A saved seasonal weather cycle layers modest temperature/fog changes onto native weather, retaining native rain. Other-world/offline meters pause; disabling freezes values. pacing_e1 schema1 is additive, unsupported schemas reject. Browser verifies settings, meals, weather expiry, native sleep, disabled freeze and exact state/XP save roundtrip.
