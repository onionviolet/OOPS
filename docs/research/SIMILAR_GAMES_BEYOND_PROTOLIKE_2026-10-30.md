# Similar games beyond the Proto23-likes, 2026-10-30

Research only. Weibao asked for "other similar games in general" that are not
protolikes. Nothing was installed, bought, signed into or run; no runtime code
changed. Findings are proposals (AD32), not decisions. Ranking measures research
value to YAIRPG's direction, not game quality. A later session decides what to
absorb (mechanic-absorption workflow, [systems register](../SYSTEMS_REGISTER.md)).

Applies [WPR1](../WORLD_PASS_RULES.md) (pass named: bounded source reads, output
owner this file, stop condition = candidates ranked and table saved), WPR4 (labels
with locators), WPR5 (defaults and dials, no blanket claims), WPR6 (haiku readers,
synthesis here), WPR19 (spot-checked two source claims below), WPR21 (highest state:
drafted, two claims source-spot-checked), WPR23 (every "not found" names its route)
and WPR27 (saved in the repo). Reconciled with AD5, AD6, AD33 (NPC-heavy work is
deprioritized, so NPC-system finds are marked as later) and AD38.

Does not redo: [the idle dossier](../RESEARCH_IDLE_GAMES.md) and
[engine references](IDLE_AND_SIM_ENGINE_REFERENCES_2026-10-14.md) (Kittens, Evolve,
Trimps, Idle Loops, NGU, Melvor, Dwarf Fortress, RimWorld, CDDA, Qud, CK3, Factorio),
[the protolike discovery](PROTOLIKE_AND_CULTIVATION_DISCOVERY_2026-10-22.md),
[the four-reference trace](protolike-deep-2026-10-22/REPORT.md),
[today's fork survey](PROTOLIKE_FORKS_AND_SIMILAR_GAMES_2026-10-30.md), and the
per-game folders already under `docs/research/` (among them wildermyth, kenshi,
stardew-valley, rimworld, caves-of-qud, tales-of-maj-eyal, dcss-dda-depth, nethack,
disco-elysium, cultist-simulator, book-of-hours, citizen-sleeper, king-of-dragon-pass,
battle-brothers, project-zomboid, vintage-story, sunless-sea, legends-of-idleon,
increlution, bitburner, discworld-mud, multi-realm-muds, scroll-of-taiwu, elin).

## Method and evidence labels

- Coverage test: a ripgrep of `docs/` (markdown, excluding novels and private
  folders) for about 150 game names. A name with zero or one hit and no folder under
  `docs/research/` counted as uncovered. Names with only a passing mention (Ostranauts
  6, Dominions 2, Majesty 2, Starsector 4) are treated as not researched.
- Four haiku readers took bounded candidate lists (open-source sims, MMO/MUD, text
  and life sims, idle/automation); notes are in the shared notes folder
  (`c_group_A.md` to `c_group_D.md`). I added two web searches (DragonRealms, EVE) and
  spot-checked two source claims by fetching the raw files myself.
- Labels: **source-verified** = a source file was opened (repo and path given);
  **developer-documented** = official docs, manual or devblog; **community-reported**
  = fan wiki, forum or review; **unverified** = named but not confirmed.
- Caveat on "source-verified": the readers fetched through a summarizing fetch tool,
  so most such lines mean the file was read through a summary, not the full text.
  Only the two lines marked "raw-checked" were confirmed against the raw file text.
- Licence is its own field. Copyleft (GPL, AGPL) sources are for reading design, not
  for pasting code; unlicensed or closed games are ideas only. No code is proposed
  for absorption here.
- Checked 2026-10-30. Pages that failed once were not retried in variants (Elanthipedia
  404, Lich doc 410, EVE support 403, Fandom wikis 402, Swarm Simulator repo 404).

## Findings

**F1. Veloren's background NPC simulation is the closest source-readable model for
"the world moves while you are away".** Veloren (GPL-3.0) keeps a separate
`rtsim` crate where NPCs are either loaded or simulated; only simulated ones get
coarse movement each tick, and the source's own TODO admits that simulated NPCs drop
queued actions. Source-verified: `rtsim/src/rule/simulate_npcs.rs`. Relevant to the
away ledger and bank owners. Proposal: when time passes while the player is away,
advance NPCs by coarse travel and keep an explicit list of which actions survive the
drop.

**F2. Veloren's relationship values fade, and strong feelings fade slower.** Each
NPC or faction holds one sentiment in -1..1; a tick moves it one step toward zero
with a probability that falls as the value grows. The doc comment gives about 26
minutes for a weak feeling, about 21 hours for friend or enemy and about 47 hours for
hero or villain; capacity is capped (128 NPC entries, 1024 faction entries) and the
weakest are dropped. Source-verified, raw-checked: `rtsim/src/data/sentiment.rs`
(`DECAY_TIME_FACTOR = 2500`, thresholds `POSITIVE 0.1`, `FRIEND 0.6`, `HERO 0.8`).
Real-time units suit a live game; a YAIRPG version would use world days. Proposal:
decay toward neutral with a per-entity cap, scaled by the world's own clock.

**F3. Veloren's skill groups give per-tool progression trees with a content-hash
respec.** `SkillGroupKind::Weapon(ToolKind)` makes one group per weapon type; XP maps
to skill points by a curve and unlocking needs prerequisites (`All` or `Any`). A
saved tree carries a SHA-256 of its definition so a changed tree forces a respec.
Source-verified (summary read): `common/src/comp/skillset/mod.rs`. The curve
constants were not checked against the RON manifests. Proposal: skill groups per
tool or material family, and a content hash on skill-tree data so a content change
is a visible respec event, not silent save drift (touches the save/migration rules).

**F4. Daggerfall Unity states "skills by use" as a single, readable formula.**
Uses needed to advance = `floor(skillValue × skillMult × careerMult × 1.04^level ×
2/5) + 1`. Raw-checked: `Assets/Scripts/Game/Formulas/FormulaHelper.cs`,
`CalculateSkillUsesForAdvancement` (MIT). Guild rank in `Guild.cs` is gated by
reputation, a count of qualifying skills (at least one "high" skill plus a minimum
total) and a 28-day cooldown; reputation below zero expels (source-verified, summary
read). Proposal: a use-count threshold that rises with current value, plus rank
gates that mix standing, skill count and a time floor, as defaults with per-world
dials.

**F5. Arx's code shows a weekly organization ledger and a multi-week investigation
roll.** Organization income is members × income-per-member × modifier/100 minus
members × cost-per-member; fame decays 0.5 per week while legend does not;
`AssetOwner.do_weekly_adjustment(week)` runs domain income, agent costs and
lifestyle charges, then sends a weekly report. An investigation costs a base 25
action points reduced by 5 × skill, with one active per week. Source-verified
(summary read): `world/dominion/models.py`, `web/character/investigation.py`
(MIT; default branch last pushed 2023, so it may differ from the live game).
Relevant to institutions, away time and clue-as-progress. Proposal: a weekly tick
that settles every standing arrangement and writes one report line the player reads
on return.

**F6. Ostranauts runs bodies, items and doors on one condition record and defines
actions as data.** A condition has an opposing condition removed first, a room-spread
flag, an immunity trigger and an expiry follow-up; tiers come from a stat-range rule
file (age tiers at 0/31/45/65/80), and threshold-modifier conditions shift them. An
interaction is a record: actor test, target test, duration, applied conditions, loot.
A verb appears only if both tests pass, so open/close show in opposite states.
Community-reported (wiki, `ostranauts.wiki.gg/wiki/Condition`, `Modding/Interactions`)
and source-verified (summary read) in a third-party MIT mod repo
`scitor/ostraJsonMods` (`MoreDoors/.../condtrigs_H1.json`,
`FastHatch/.../interactions.json`). The base game's own JSON was not opened. This is
the strongest match for per-world rules as data (AD38, FND5). Proposal: one
condition record shape shared by body, items and places, with each world supplying
its own threshold modifiers.

**F7. Dominions 6 shows per-province "scales" as paired dials that rewrite local
rules, bought with a point budget.** Order/turmoil, productivity/sloth,
heat/cold, growth/death, luck/misfortune and magic/drain each modify income,
resources, events, supplies or research per point; extremes carry penalties, and a
contested chance moves a province's scale toward the local dominion. Taking
negative scales refunds points. Community-reported only (illwiki, CC BY-NC-SA;
manual returned 404); several values are marked unverified. Proposal: a small set of
paired dials per world or life, set at creation by a point budget with refunds for
negative settings, and shifted in play by contested chance. Verify numbers before use.

**F8. SWGEmu's source gives a two-roll craft where material attributes set the
failure baseline.** `calculateExperimentationSuccess` combines an experimentation
skill, assembly-based failure mitigation, a tool effectiveness multiplier and a luck
roll into tiered results; `calculateExperimentationFailureRate` is
`50 + (ma − 500)/40 + expPoints − 5 × pointsUsed`. Source-verified (summary read):
`MMOCoreORB/src/server/zone/managers/crafting/CraftingManagerImplementation.cpp`
(AGPL-3.0: read for design, do not paste). The meaning of `ma` and the lab weighting
was not seen. Proposal: material quality sets baseline risk, a tool bonus scales the
outcome, and results are tiers.

**F9. Fabled Lands encodes a whole open-world campaign as one flag bag plus small
typed records, and treats death as a bought branch.** One string-to-string map holds
codewords, counters and per-section tick counts, keyed `book/section`; sections gate
with declarative `if codeword` tags. Titles are `{pattern, value}` records;
resurrection is a consumable deal storing a respawn address; ships carry cargo slots
and a dock. Source-verified (summary read): `flands/Codewords.java`, `Title.java`,
`Resurrection.java`, `Ship.java` in `volpe-jb/JavaFabledLands` (code GPL-2.0; book
text and art are copyrighted). Proposal: world-prefixed flag keys, ranks as records,
and death insurance as a located consumable.

**F10. Majesty's main command channel, by default, is a bounty that autonomous characters weigh
against their own temperament.** The player cannot order heroes; reward flags are
weighed against distance, danger and each hero's greed and class, and flags can be
raised but not lowered. Developer-documented (Majesty Gold HD manual, Steam CDN);
exact decision formula unverified. Proposal: villager or follower NPCs score posted
tasks by reward, distance, danger and temperament, and the UI names the refusal
reason ("won't fight skeletons: arrows do too little"). AD33 puts NPC-heavy work
later, so this is a later item.

**F11. Space Station 14 keeps reactions, jobs and objectives as data.** Reaction
prototypes list reactants, products, an optional minimum temperature, mixer category
and effects (an Ammonia entry has `minTemp: 370`); departments list roles by ID with a
weight; antagonist objectives are ID lists on a component whose failure path the file
does not show. Source-verified (summary read): `Resources/Prototypes/Recipes/Reactions/
chemicals.yml`, `Content.Server/Antag/AntagObjectivesSystem.cs`,
`Resources/Prototypes/Roles/Jobs/departments.yml` (MIT per the brief; LICENSE not
reopened). Proposal: a material-state reaction table where thermal gate and energy
cost are rows.

**F12. Screeps spends banked CPU in bursts, which is a ready metaphor for banked
away time.** Unused CPU refills a bucket capped at 10,000; a tick may overspend up to
500 while the bucket holds CPU. Developer-documented (`docs.screeps.com/cpu-limit.html`,
fetched) and source-verified (summary read) for the tick order in
`screeps/engine` `src/main.js` (licence ISC per the repo page; LICENSE not opened).
The community wiki and the official page differ on what happens at zero bucket.
Compare with the existing away bank before borrowing anything.

**F13. DragonRealms and EVE both turn "time away" into the learning mechanism, in
different ways.** DragonRealms: community-reported that experience goes into a
per-skill pool shown as a named mind state and drains over time (a 2010 forum thread
says intelligence raised the pool and wisdom helped clear it; dated, may have
changed; Elanthipedia was not reachable). EVE: community-reported that skills train by
wall-clock from a queue, rate = primary attribute + half the secondary per minute
(Alpha trains at half), and an empty queue wastes time (forum threads, Engadget 2008;
CCP's own page returned 403). Proposal: a per-skill absorption band that fills from use
and drains with time away, and a queue of declared study that runs at a stat-set rate.
Re-verify against the wiki before any numbers are used.

**F14. Idle games with explicit away rules are worth one comparison, not a
survey.** Clicker Heroes (developer-documented, official blog): the away run uses only
idle DPS and stops at a wall, not a clock, and its meta-currency is
`floor(5 × log10(total souls))`. Idle Clans (developer-documented, official wiki): the
offline cap is 12 hours, extendable by 6 via an in-game upgrade and by 6 more via a
premium token; the market takes 1% on sales. Proposal: an away run powered only by
automation the character owns, ending at a wall; away length as something earned.

**F15. Alter Ego and NEO Scavenger are single-idea leads, community-reported only.**
Alter Ego (1986): a life in seven age stages, each a tree of unopened category icons,
with a few traits (sources disagree on the set) shaping which follow-ups open; early
death comes from events. NEO Scavenger: recipes accept similar items as substitutes
and combat resolves by blood loss and shock across wound locations
(developer-documented store page; recipe and wound tables unread). Proposals: an
age-banded event deck with unopened category icons; recipes that list required
properties instead of item IDs.

**F16. Several named candidates produced nothing usable and are parked, not
dropped.** Wayward (repo 404, closed; use-based skills only community-reported),
Stonehearth (no engine source; promotion-by-crafted-tool is a store-page snippet),
Stendhal (GPL-2.0; no skill or crafting file found in the one directory listed), Swarm
Simulator (repo 404), Realm Grinder (wiki 402; three soft-reset types from snippets
only), Anti-Idle (no mechanics found), A Tale in the Desert (wiki page read but tech
unlock and carryover not on it). Route searched and failed is recorded so a later pass
does not assume it is empty (WPR23).

## Candidates

Ranked by research value to YAIRPG. Level = highest evidence reached.

| Rank | Candidate | Why it earns the slot | Licence | Level |
|---|---|---|---|---|
| C1 | [Veloren](https://gitlab.com/veloren/veloren) (F1-F3) | Readable offline NPC simulation, decaying sentiment, per-tool skill trees with respec hash | GPL-3.0 (read, do not paste) | source-verified; two files raw-checked |
| C2 | [Arx: arxcode](https://github.com/Arx-Game/arxcode) (F5) | Weekly organization ledger, clue investigation as multi-week roll | MIT | source-verified (summary) |
| C3 | [Daggerfall Unity](https://github.com/Interkarma/daggerfall-unity) (F4) | Skills-by-use formula and rank gating by standing, skills and time | MIT | source-verified; formula raw-checked |
| C4 | Ostranauts + [ostraJsonMods](https://github.com/scitor/ostraJsonMods) (F6) | Conditions and interactions as data across body, items and places | game closed; mod repo MIT | wiki + mod files (summary) |
| C5 | Dominions 6 (F7) | Paired world-rule dials bought by points, with contested spread | closed | community-reported |
| C6 | [SWGEmu Core3](https://github.com/SWGEmu/Core3) (F8) | Material attributes set craft risk; tiered results | AGPL-3.0 (read, do not paste) | source-verified (summary) |
| C7 | [JavaFabledLands](https://github.com/volpe-jb/JavaFabledLands) (F9) | One flag bag, rank records, bought resurrection | code GPL-2.0; text copyrighted | source-verified (summary) |
| C8 | Majesty (F10) | Bounty as the main command channel (default); temperament-weighted autonomy | closed | developer-documented |
| C9 | [Space Station 14](https://github.com/space-wizards/space-station-14) (F11) | Reactions, departments and objectives as data rows | MIT per brief | source-verified (summary) |
| C10 | [Screeps engine](https://github.com/screeps/engine) (F12) | CPU bucket as banked budget spent in bursts | ISC per repo page | developer-documented + summary |
| C11 | DragonRealms (F13) | Per-skill absorption pool draining over time | closed | community-reported |
| C12 | EVE Online (F13) | Wall-clock skill queue, stat-set rate, empty queue wastes time | closed | community-reported |
| C13 | Clicker Heroes (F14) | Away run stops at a wall; log-scaled meta currency | closed | developer-documented |
| C14 | Idle Clans (F14) | Away cap as an earned or bought line; player market | unknown | developer-documented |
| C15 | Alter Ego (F15) | Age-banded event deck, unopened category icons | proprietary | community-reported |
| C16 | NEO Scavenger (F15) | Substitution recipes; wound-location combat | closed | developer-documented (thin) |
| C17 | Wayward, Stonehearth, Stendhal, Swarm Simulator, Realm Grinder, Anti-Idle, A Tale in the Desert (F16) | Parked after failed or empty routes | mixed | unverified |

## Mechanism by owner

Owners are the live files a future absorption would touch. System numbers are the
sections of [PROGRESSION_WORLD_STATE](../systems/PROGRESSION_WORLD_STATE.md) (S4
skills, S5 titles and faction rank, S10 simulation, S11 schedules, S19 clocks) and
[MAKING_ITEMS_ECONOMY](../systems/MAKING_ITEMS_ECONOMY.md). Code owners are named
only where the file exists in `src/`.

| Mechanism | Candidate(s) | Our owner |
|---|---|---|
| NPCs advance in a coarse mode while the player is away, with a list of surviving actions | C1 (F1), C2 (F5) | `src/away_ledger.js`, `src/away_bank_domain.js`; S10; [DIRECTION_SUMMARY](../DIRECTION_SUMMARY.md) (time/offline); [NPC architecture](SIMULATION_AND_NPC_ARCHITECTURE_2026-10-14.md) |
| Relationship value decays toward neutral, strong feelings slower, capped per entity | C1 (F2) | [RELATIONSHIPS_AND_CANON](../RELATIONSHIPS_AND_CANON_CONSIDERATIONS_2026-10-18.md); [PRESENCE_AND_INTERACTION_RULES](../PRESENCE_AND_INTERACTION_RULES.md) (PIR) |
| Weekly settlement tick with one report line | C2 (F5) | S19 and `src/clock_owner.js`; `src/away_ledger.js` |
| Skill advance threshold from current value, level and a per-class multiplier | C3 (F4) | S4; [SKILLS_AND_LEARNING](../SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md) (SLR) |
| Per-tool or per-material skill group with prerequisite tree and respec on content change | C1 (F3) | S4; [ABILITY_RULES](../ABILITY_RULES.md) (ABR); persistence rules in S12 |
| Rank gated by standing, qualifying skill count and a time floor | C3 (F4) | S5; [PROGRESSION_GATE_RULES](../PROGRESSION_GATE_RULES.md) (GTR) |
| Condition record: opposite, tiers by stat range, expiry follow-up, shared by body/items/places | C4 (F6) | S16 tags and `docs/systems/COMBAT_PEOPLE_SITES_UI.md`; [BODY_AND_HEALTH_RULES](../BODY_AND_HEALTH_RULES.md) (BHR); [WORLD_DIALS_AND_INTERPRETER](../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md) |
| Actions as test-actor / test-target / apply records | C4 (F6), C9 (F11) | S11 expansion engine; [ENGINE_AUTHORING](../ENGINE_AUTHORING.md) |
| Paired world-rule dials with a point budget and refunds, contested spread | C5 (F7) | [WORLD_DIALS_AND_INTERPRETER](../WORLD_DIALS_AND_INTERPRETER_CONSIDERATIONS_2026-10-19.md); [WORLD_RULE_GRAMMARS](../WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md) |
| Material quality sets craft risk; tool bonus scales outcome; tiered result | C6 (F8) | [CRAFTING_ENGINE](../CRAFTING_ENGINE.md); [MAKING_RULES](../MAKING_RULES.md) (MR); [procedural materials audit](../PROCEDURAL_MATERIALS_AND_ALCHEMY_AUDIT_2026-10-13.md) |
| Recipes list required properties, not item IDs | C16 (F15) | [CRAFTING_ENGINE](../CRAFTING_ENGINE.md); MR; MAKING_ITEMS_ECONOMY |
| Reaction table with thermal gate and energy cost as rows | C9 (F11) | [GEAR_DEPTH considerations](../GEAR_DEPTH_BLACKSMITHING_CHEMISTRY_ENERGY_POWERS_CONSIDERATIONS_2026-10-20.md); MR |
| Flag bag with world-prefixed keys; ranks as records | C7 (F9) | S1 fact rules; S13 knowledge ([WORLD_SECRETS_AND_DISCOVERY](../worlds/WORLD_SECRETS_AND_DISCOVERY.md)) |
| Death as a bought, located branch | C7 (F9) | S14 body, lives, heirs; [death and reset considerations](DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md) |
| Age-banded event deck with unopened icons | C15 (F15) | [LIFE_SIM_NORTH_STAR](../LIFE_SIM_NORTH_STAR.md); [STARTS_ENDINGS_AND_RANDOMNESS_PALETTE](../STARTS_ENDINGS_AND_RANDOMNESS_PALETTE.md) |
| Temperament-weighted autonomous task choice with visible refusal reasons | C8 (F10) | [PIR](../PRESENCE_AND_INTERACTION_RULES.md); [COMPANIONS considerations](../COMPANIONS_FAMILIARS_AND_PETS_CONSIDERATIONS_2026-10-14.md); AD33 (later) |
| Banked budget spent in bursts | C10 (F12) | `src/away_bank_domain.js`; S19 |
| Per-skill absorption pool draining with time | C11 (F13) | S4; SLR; `src/away_ledger.js` |
| Wall-clock study queue at a stat-set rate | C12 (F13) | S19; SLR; `src/away_bank_domain.js` |
| Away run powered by owned automation, ending at a wall | C13 (F14) | `src/away_bank_domain.js`; DIRECTION_SUMMARY |
| Away length as an earned or purchasable line; player market | C14 (F14) | [ECONOMY_RULES](../ECONOMY_RULES.md) (ECR); DIRECTION_SUMMARY |
| Log-scaled meta currency across prestige | C13 (F14) | [DEATH_AND_RESET](DEATH_AND_RESET_CONSIDERATIONS_2026-10-10.md); Rulebook 4-5 |
| Wound locations with bleed, pain and shock thresholds | C16 (F15) | BHR; [COMBAT_RULES](../COMBAT_RULES.md) (CBR) |

## Coverage limits

- The coverage test was a name search. A game covered under a different name, or mentioned
  in passing inside a large doc, could be listed here as new. Check a candidate's name in `docs/`
  again before building on it.
- Most "source-verified" lines were read through a summarizing fetch tool, not the
  full text; only the Veloren sentiment constants and the Daggerfall advancement
  formula were checked against raw files by me. Numeric constants should be reread
  before they are copied (Veloren skill curve, Arx costs, SWGEmu failure formula,
  Dominions scale values).
- Closed games (Dominions, Majesty, DragonRealms, EVE, Alter Ego, NEO Scavenger,
  Clicker Heroes, Idle Clans) have no readable source. Their entries rest on manuals,
  wikis and forums, and several wiki fetches failed once and were not retried.
- No genre sweep beyond the listed groups: no Paradox pops/markets (Victoria 3),
  Starsector, Mount & Blade, Underrail, Songs of Syx, Kingdom Come, Pathologic or
  Elin-adjacent games, and no tabletop systems. Several already have notes or small
  mentions in `docs/`; none was reread here.
- Nothing was played or built, so no playability claim is made. Dated claims
  (DragonRealms 2010 thread, EVE Engadget 2008, Arx 2023 branch) may no longer match
  the live games.

## More to consider

**ACT NOW (this report settles it)**
- The pointer line is added at the top of `docs/RESEARCH_IDLE_GAMES.md`.
- Licence is recorded per find. Copyleft sources (Veloren, SWGEmu, JavaFabledLands)
  are design reading only; no code is proposed for absorption.

**ACCOUNT FOR NOW (constraints on live work, no new feature)**
- A1. `src/away_ledger.js` and `src/away_bank_domain.js` have uncommitted edits in the
  shared checkout. F1, F12-F14 are comparators for the next away-bank decision; do not
  change that lane from this report.
- A2. F2 (decaying sentiment) and F10 (bounty autonomy) are NPC-heavy; AD33 defers
  that work. Read them as later items unless Weibao reorders.
- A3. F3's content-hash respec touches the persistence rules (old-save compatibility
  is currently deferred); any use needs the migration or compatibility decision AGENTS
  requires.

**LATER / DELEGATE (proposals; none authorizes spawning)**

| Item | Level | Effort | Done check |
|---|---|---|---|
| L1. Read Veloren `rtsim` fully (events, `simulate_npcs`, site population) and compare with `away_ledger` | sonnet | medium | Table of each rtsim rule, our owner file and a keep/adapt/skip call; reopen trigger: next away-bank design round |
| L2. Open the Ostranauts base-game JSON (condition rules, interactions) and compare with S16 tags and the effect DSL | sonnet | medium | Mapping of condition fields to our tag/effect shapes; trigger: FND5 second-consumer question |
| L3. Re-read the Dominions 6 manual or illwiki and extract scale effects as data rows | haiku, then sonnet | low | Verified table of six scale pairs; trigger: a world-dials implementation round |
| L4. Raw-read the SWGEmu experimentation functions and Arx weekly adjustment code in full | haiku | low | Raw file excerpts of the formulas listed in F5 and F8 with file and function names |
| L5. Retry DragonRealms (Elanthipedia) and EVE (CCP support) through other routes | haiku | low | Developer-documented source for the mind-state and offline-queue rules, or a recorded "unreachable" |
| L6. Cover the genre gaps: Victoria 3 pops, Starsector, Mount & Blade, Songs of Syx, Kingdom Come | sonnet | medium | One ranked addendum to this file; trigger: Weibao asks for the wider net again |
