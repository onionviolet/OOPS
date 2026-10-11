# R1: Relationships audit (code, designs, research, gap map)

Read-only audit, 2026-10-10. Line numbers are from the live working tree under
`/Users/weiwei/code/yet-another-idle-rpg`. Nothing was run; this is a read of source and docs.
Labels: SHOWN = in code I read; STATED = in a doc; INFERRED = my reading. No sealed secret truths
are quoted anywhere below (mechanics only).

## 0. Headline

1. There is no relationship system. There are **five unrelated stores** that each hold a sliver
   of "people": (a) a directed `relationships` ledger in the simulation, (b) a separate
   chronicle relationship record used for one NPC (the Village elder), (c) an authored Village
   household with yearly births/marriages/deaths, (d) a "known people" projection that only
   reads other state, (e) the life record (a biography, explicitly "never an authority").
2. The numeric axes are **write-mostly**. Content writes `trust`, `respect`, `familiarity`,
   `esteem` but no content condition reads them, with one exception (elder trust gate,
   `chronicle.js:201`). The simulation exports them as facts `relationship.<axis>`
   (`simulation_effects.js:107`), and a repo-wide grep found no command that requires one.
3. Families (`npc_lives.js`) are hand-authored, time-driven, and **cannot be affected** by the
   player at all. Heirs carry a grave and one lesson; no person, tie or standing crosses.
4. The designs are rich (E3 section 9 opinion/memory/gossip, north-star heirs/followers/romance,
   rival chronicle) but are **all proposal**. The only accepted, quoted-Weibao relationship
   rules are broad (rulebook 1, 5, 6, heir direction).
5. Research is broad (RimWorld, CK3, Wildermyth, KoDP, Tale of Immortal, Vagrus, Sucker for Love,
   Crush Crush, Sunless Sea, Battle Brothers, books) and is well ahead of the code. Most
   packets say "reuse the directed ledger"; the gap is the consumers.

## 1. Code today

### 1.1 Directed ledger in the simulation (expansion system)

| Item | file:line | Detail |
|---|---|---|
| State | `src/simulation_contracts.js:206` | `simulation.relationships[actor][target] = {axes:{axis:number}, memories:[{cause,at,text}]}` |
| Validation | `simulation_contracts.js:234` | axis ids stable-id strings, finite values, memories max 32. Both ends must be registered people. No clamp (chronicle clamps, this does not). |
| Only writer | `src/simulation_effects.js:229-236` | effect `{type:'relationship', actor, target, axis, amount, text}`. Dedupe receipt `cause:actor:target:axis` stored in `s.causes` (`:233`), so a repeated cause cannot farm. Memory `text` falls back to the axis name. |
| Reader | `simulation_effects.js:107` | When a command has a target, facts `relationship.<axis>` are exposed to `requires`. No content uses them (grep). |
| Reset | `src/simulation.js:560, 567` | world-transition `reset:['relationships']` drops the actor's row and every row pointing at them. |
| Persistence | expansion schema 11, simulation schema 5 (PROJECT.md "Current status") | Part of `expansion.simulation`. No migration needed so far. |

Writers (about 30 content files contain a `type:'relationship'` effect). Representative ones:

| Who | file:line | Axis | Action that changes it | Player sees |
|---|---|---|---|---|
| Hired pathfinder | `src/helper_content.js` (hire, collect commands) | trust +1 | hire with coins+log; collect finished kit | People card memory line; helper departs (`life` effect, status `departed`) |
| Lio, association porter | `src/party_content.js` (`party.rest`) | trust +1 | rest/re-rig him (1 kit, 3 min) | People card for Lio |
| Mara, road rival | `src/frontier_campaign.js:4,18,21,29-40` | none (pursuit state, not relationship axes) | confront duel, settle (1 kit), conceal, decline, report | Pursuit notices in People |
| Tamsin, mill traveler | `src/promise_content.js:10` + `crush_social_content.js:15` | trust +0/+1 | meet/help/decline, patient or quick outing, decline outing | People card with "what happened" memories |
| Iona, parcel clerk | `src/exchange_content.js:41` | trust +1 | deliver fitted seal, return tool | People card |
| Old craftsman | `src/everyday_life.js:10,24,28` | respect, familiarity (+/-1) | ask preferences, interrupt | People card; also condition `REASSURED` |
| Nested hub / Lin, Brin, Ivo and other book/world cast | `src/feature_expansion_nested_*.js`, `book_world_*` | knowledge records, not axes | meeting scenes | People card via **knowledge**, not relationship (book worlds MoL/Paradise write `knowledge`, zero relationship effects) |

Axis names in use: `trust` (about 13 sites), `respect` (about 7), `familiarity` (about 6), `esteem` (1).
No `affection`, `fear`, `debt` or `grudge` in the simulation ledger today.

### 1.2 Chronicle relationships (the elder) (expansion system, separate store)

| Item | file:line | Detail |
|---|---|---|
| State | `src/chronicle.js:29-35` | `chronicle.relationships[actorId] = {axes, ties, memories}`; axes clamped to +/-100; `ties` are booleans/strings/numbers; max 64 owners, 32 memories. |
| Writer | `chronicle.js:57-65` `relationshipChange` | the only function that edits it. |
| Seed | `chronicle.js:78` | `villageElder` begins `trust 0, respect 0, role acquaintance`, "no inherited favors assumed". |
| Actions | `chronicle.js:132` (archive duty kept, trust +1, tie `dutyKept`); `:188` (pledge, tie `archiveDuty`); `:205-206` (three-coin settlement closes grievance, trust +1, "attack remains remembered"); `:257-259` (spar: trust/respect up; assault: trust -3, fear, tie `grievance`) | |
| Reader | `chronicle.js:187-210` | `r.axes.trust >= 1` gates a lesson; ties gate inheritance, debrief, settlement, new challenge. This is the **only** place an axis acts as a gate. |
| Display | `src/people_knowledge.js:17-30` `knownPeopleView`; `src/people_ui.js:3-29`; `src/chronicle_ui.js:76` | Shows ties as prose lines and memories (newest first). Axis numbers are never shown. |
| Death | `chronicle.js:273-281` `createHeirChronicle` | New chronicle is built fresh via `createChronicle`; **relationships do not carry**. Only `knowledge[lesson]` and a `grave` summary carry (`:277`). |

### 1.3 Village household (`src/npc_lives.js`, original, no engine owner)

| Item | file:line | Detail |
|---|---|---|
| Create | `npc_lives.js:5-23` | Fixed cast: Maia and Oren (married), Lio (4), Neri (born +3 yrs), Rhea (marries Lio), Nima (born later). Death year = birth + 65 + hash%20. Events: birth/marriage/death with canned text. |
| Schema | `npc_lives.js:25-33` | schema 1; people (id, name, birthYear, joinedYear, deathYear, parents[], spouseId), events, news (max 16). Max 32 people. |
| Advance | `npc_lives.js:36-39` | By calendar year only; adds events to news. No player input. |
| Recruit | `npc_lives.js:49-55` + `main.js:1853,1860,6832` | Iona (patrol recruit) added as a person with no spouse or parents. |
| UI | `src/npc_lives_ui.js:1-11`, `main.js:7657-7660` | "Village neighbors" `<details>`: name, age, "child of", "married to", news. Button "Get to know your neighbors". |
| Persistence | `main.js:337,4621,4724`; `life_experience_host.js:23-24` | `save.npc_lives`, advanced on load/save; **copied to the heir save** untouched. |
| Link to other systems | none | Not a simulation person (E3 V17). Nothing in the household reacts to the player; no ledger entry; "Lio" name also exists as a party porter (`party_content.js`), "Neri" as route apprentice/resident (`audit_remainder_home_content.js:181`), "Iona" as a parcel clerk (`exchange_content.js`). These are **different people with the same names** (INFERRED; E3 V19 flags the Oren clash only). |

### 1.4 Life record and heirs

| Item | file:line | Detail |
|---|---|---|
| Biography | `src/life_record.js:4-5` | kinds `beginning, journey, memory, birthday, career, loss, family, rumor, legacy`. Header: "a lossy biography, never an authority for rewards, relationships or quests". Only `beginning`, `journey` and `legacy` are produced by code (`life_record.js:55-75`, `life_experience_host.js:25`). `family`, `loss`, `rumor` are reserved kinds. |
| Lessons, age, epitaph | `src/life_experience.js:2-36` | three lessons; `lifeEpitaph` uses elder ties (`dutyKept`, `firstConcession`). |
| Heir build | `src/life_experience_host.js:9-25` | fresh body named "The heir", inherited: options, life_record (+ legacy line), npc_lives. UI still says "fresh body, one lesson" (RULES_FROM_SCRATCH.md#the-heir says replacement is pending). |
| Mortality | `chronicle.js:16-18,97-111` | open vs mortal lifespan; mortal ends at an age-derived deadline; "last year" memory flag. |

### 1.5 Companions, followers, rivals (code)

- **Party**: one porter, Lio. `party_content.js` + `party_battle.js:25-60`. Requires willing+able+present+own kit+stamina; interposes in one Mara contest. State is simulation person + faculty + `party.willing` fact. Consent withdrawal supported (`party_battle.js:`supportReasons). CHARACTERS_AND_WORLD_EVENTS.md#party says "no recruitable party system" in general; only this authored proof.
- **Hired pathfinder** (`helper_content.js`): bulk-like service worker, one `life` departed effect. Not a persistent companion.
- **Rival**: Mara (`frontier_campaign.js:18-40`), a "pursuit" (`pursuit_content.js`) with report/conceal/decline/settle; no grudge, debt or memory axes found. `ROAD_RIVAL` used by `party_battle.js:7`.
- **Followers/factions**: none in code (grep: no follower/faction state outside destination reputation).
- **Reputation (vanilla)**: `gameplay_transactions.js:42` regional `actor.reputation[key]`; vanilla `quests.js`, `display.js`. This is a **native vanilla system** (a numeric per-region value), separate from the expansion ledger.
- **Vanilla NPCs**: `src/data/npcs.js:63-68` village elder, guard, old craftsman, millers, suspicious man with `dialogue` components and textline availability; relationship-like state is dialogue/quest flags, not numbers. Expansion registers the elder and craftsman again as simulation/chronicle owners (double ownership, INFERRED).

### 1.6 Native vs expansion

| System | Native vanilla | Expansion |
|---|---|---|
| Dialogue textlines + quest flags | yes (`data/npcs.js`, `data/dialogues`) | extended by `chronicle` events |
| Regional reputation | yes (`gameplay_transactions.js`) | reused, no new owner |
| Directed relationship ledger | no | yes (simulation) |
| Chronicle ties (elder) | no | yes |
| Village household | no | yes (original, optional) |
| People panel | no | yes (`people_ui.js`, `simulation_ui.js:30`) |

### 1.7 What the player actually sees

A "People you know" panel: name, last-known location, bullet details, memory list. No numbers, no
opinion words, no portraits of "how they feel". A separate "Village neighbors" list of ages and
marriages. A "life record" panel. Epitaph for graves. That is the full relationship UX.

## 2. Designs (proposed vs accepted)

Accepted = PROJECT.md decisions or Weibao quoted words. Everything else is proposal.

### 2.1 Accepted

| Item | Where | What it says about relationships |
|---|---|---|
| Rulebook 1 (anything is possible, reasonably) | PROJECT.md#accepted-decisions; RULES_FROM_SCRATCH.md#the-rulebook-accepted-2026-10-10 | teaching can cost coins, time, a favor, or nothing; options come from the world/person/event |
| Rulebook 5 | RULES_FROM_SCRATCH.md#the-rulebook | **relationships cross worlds/lives only via a carrier** (soul, item, record, teacher, cheat, system, world rule) |
| Rulebook 6 | same | what anyone sees can be wrong (opinion readings, appraisals, rumors) |
| Rulebook 2/3 | same | each world makes its own social rules; book worlds follow their book |
| Rulebook 7 | same | lives age and end; absent worlds hold still |
| Heirs inherit what was left behind (quoted: "the heir should inherit according to what was left behind") | RULES_FROM_SCRATCH.md#the-heir | explicitly lists people (apprentices, family, friends, followers, rivals and enemies who remember), standing, debts, grudges, unfinished business. Code change pending. |
| Weibao request: followers/factions, dating mechanics, heirs & family (quoted prompts) | LIFE_SIM_NORTH_STAR.md#followers-and-factions, #romance-and-dating-mechanics, #heirs-families-and-life-beyond-the-first-character-proposal-2026-10-10 | The **requests** are his; the mechanics text under them is a Claude proposal. |
| Village career/study (original playable proposals "awaiting acceptance") | PROJECT.md | e.g. "Tessa remembers the last shift and kit resolution": remembered, not accepted |

### 2.2 Proposed (not accepted)

| Doc / section | What it proposes |
|---|---|
| `docs/emergent/E3_LIVING_PEOPLE.md` section 9 (lines 358-403) | Axes `trust, respect, fear, affection, debt` clamped +/-100; `opinion(a->b) = affection + 0.5 trust + 0.3 respect - 0.2 fear - 10 grudge`; `grudge` tag 1-9 decays 1/30 days; NPC-pair memory `{cause, at, k, w}` max 5 with weight halving every 60 days; lazy relaxation 0.5/day; unique cause key `npc:<person>:<tick>:<verb>`; **beliefs are not relationships**. |
| E3 section 10 (405-464) | `history.<eventId>` truth anchor, beliefs `{h, about, sev, flags, conf, hops, from, at}` (max 10), `gossip` verb with juice/share chance/conf formulas, distortion table (exaggerate 45, drop qualifier 30, soften 10, swap 3, embellish 12), correction and shame memory, regional reputation as weighted mean of beliefs (existing `reputation` effect becomes a cache). |
| E3 sections 3-6, 15 | needs (`belonging` -> `grieving` 14 days after a death, line 99), 12 traits (`jealous`, `vengeful`, `honest`...), 15 goals (`marry`, `raise_family`, `find_friends`, `get_revenge`, `prove_worth`), verbs mapped to engine effects, worked 30-day example for Maia/Oren/Iona. |
| E3 section 11 (466-525) | generated people; **births**: couple tagged `married/lover` monthly roll `0.04*comfort/100`, 270-day pregnancy, inherited traits plus 1 upbringing trait, parents' `family` tag affection 40 trust 30; promote the Village household into live people (Q1). |
| E3 section 13 (602-642) | named enemies/rivals: grudge on defeat (`grudge:player` 3, `ashamed`, `shame` memory), spared rival gets `debt`, `respect 15`, `make_amends` goal; arcs rise/clash/fall/ally/retire/win; fate multiplies cards up to x3 but not utility; in `hearth` and `hardscrabble` presets named enemies cannot `kill`. |
| E3 open questions Q1-Q5 (854-872) | promote household? preset? trait drift? how much of an NPC's reason is visible? days per year? All unanswered. |
| `docs/LIFE_SIM_NORTH_STAR.md#followers-and-factions` (1769-1805) | follower kinds, why they follow (money, protection, loyalty, ideology, love, debt, fear, binding power), each reason has its own break; leadership cap; faction card; faction outlives you. |
| North star `#romance-and-dating-mechanics` (1995-2022) | layers acquaintance -> friend -> close friend -> romance -> partner; routes needing presence; calendar pressure; gifts with taste; jealousy; cross-world/lifespan-gap romance; romance-as-power (dual cultivation, soul bond, anchor); breakups/divorce/grief as life events; **opt-out** so friendship layers work without romance. |
| North star `#heirs-families...` (3310-3396) | inheritance is what survived; legacy as gameplay (wills, caches, letters, apprentices); **loyalty is per person** (stay for love/pay, leave, take share, betray, claim leadership, become rival); heirs are people with own genes and wants; families live their own lives (marry, feud, found branches); ancestors as legends. |
| North star `#same-player-related-character` (3558+), `#what-persists` (3812+), `#lone-wolves` (3639+), `#open-threads...` (4414-4500, "NPCs live by the same rules": NPC heirs, recurring souls, lineage view) | link types (blood, soul, apprenticeship, heirloom, name/title, pact), four persistence layers (world, soul, meta, player), lone-wolf trade-offs, chronicle across lives, past lives compress to summaries. |
| `docs/RIVALS_IDENTITIES_AND_FATE.md#a-persistent-rivalry-system-for-this-game` (231-276) | "rival chronicle": triggers table (defeat, humiliation, theft, rescue, misconduct, lost backing, revealed disguise), each with a causal limit; Nemesis-style ingredients (recognition/memory, evidence/relationships, adaptation, goals, closure); reference-patent boundary (do not copy mechanics); first proof = one persistent Village-region peer. |
| `docs/ENEMY_PROTAGONISTS.md#more-consequences-worth-considering` (66-110) | mentors/partners/friends are not a single entourage; taking a mentor's role; rival stories intersect; player can outgrow a former protagonist; coalitions need real shared interest. |
| `docs/SELVES_AND_ECHOES.md#more-to-consider-expanded` (223-250) | rivals that learn your pattern; escaped shadows become rivals; mentor/student selves; companion echoes; friends unsettled by a shadow wearing your face. |
| `docs/FITTING_CHARACTERS_AND_TIMES.md` (74-100, 226-235) | "personal stakes over spectacle"; roles table (rival, mentor, nobody); arc moods. Guidance, not mechanics. |
| `docs/CHARACTERS_AND_WORLD_EVENTS.md` 35-61, 403-422 | interaction families (exchange, learning, joint work, personal bonds, conflict); retain only the dimensions a scene exercises; memories keep significant causes only; repeat interaction needs a renewal/cooldown; **no single universal favorability meter**; companion kinds (traveling, hireling, home contact, apprentice, summon) and refusal/consent. |
| `docs/worlds/DIALOGUE_AND_INTERACTIONS.md` | dialogue is written after the situation settles; evidence travels through an observer; each consequence has one owner. |
| `docs/worlds/SUCCESSION_BY_WORLD.md` | per-world continuity patterns for death, heirs, successors. |
| `docs/emergent/E8D_VOW_SYSTEM.md` | vows as relationship bonds: mutual vows, collective/sect oaths, oath-stones, witnesses, "oath-breakers find witnesses unwilling" (line 167), social vows (monastic/knightly) that change how people treat you (221). Powers as bonds. |
| `docs/research/LIVING_BESIDE_PROTAGONISTS_2026-10-10.md` | fan-fiction premise families (born in, outsider, replace a character...) and a proximity/knowledge model (e.g. unaware / aware and bound / aware and removed). |

Notable tension: E3 section 9 uses `affection, debt, fear` and clamps +/-100; the live simulation
ledger has no clamp and only trust/respect/familiarity/esteem. E3 also proposes NPC-pair memories
with weights, while the live ledger stores free text. Chronicle and simulation ledgers have
different shapes (`ties` exist only in the chronicle).

## 3. Existing research (mechanics already captured)

Paths relative to `docs/research/`. Games first, then books.

### 3.1 Games

| Source | Finding | Path |
|---|---|---|
| RimWorld | Attributed social memory: Insult -> recipient memory attributed to the other pawn; opinion contribution fades before expiry; 20-day memory, 2-day mood thought, per-person stack limit | `rimworld/REPORT.md` (section 3, line 43-47); `rimworld/FINDINGS.json` (insult attribution); `rimworld/BODY_SOCIAL_FINDINGS.json` |
| CK3 | Confiding stores who became trusted and shapes next conversation (1095-day cooldown, outsider opinions -10, confidant +5, creates friend relation + `has_been_confided_in`) | `crusader-kings-3/REPORT.md` F3; `crusader-kings-3/FINDINGS.json` ("Confiding produces a repeatable social routine") |
| CK3 | Disinheritance costs dynasty standing, conflicts with personality, changes rivalries and eligibility | `crusader-kings-3/REPORT.md` F1 |
| CK3 | Death memories are typed facts with participant IDs, dates, perspective rendering and relevance duration; participant references protect characters from save pruning | `crusader-kings-3/REPORT.md` F5; FINDINGS (death memory decision) |
| CK3 | Branch family gains identity and heirloom claim | `crusader-kings-3/FINDINGS.json` |
| Wildermyth | Death changes the survivor: lover grief grants a lasting buff (promise vs release), bound to the relationship; validator restores lover/rival only if neither side already has that type; legacy-locked relationships suppressed | `wildermyth/FINDINGS.json` (name "Death changes the survivor rather than ending their story", ~lines 128-154); `wildermyth/REPORT.md` F4 |
| Wildermyth | Childhood tags constrain later scenes; relationship ID in life-record milestone; broken IDs degrade to remembered name; annual summaries with counters | `wildermyth/IMPLEMENTATION_PACKETS.json` (lines 39, 53-55) |
| King of Dragon Pass | Gifts create one-way debts used later politically; public friendliness and private grudges differ; "obligation ledger whose gossip does not overwrite truth" | `king-of-dragon-pass/REPORT.md` F3; `FINDINGS.json` (Gifts create debts, line 86+) |
| KoDP | Advisors/ring members: sending one away removes capability; replacement takes seasons | `king-of-dragon-pass/REPORT.md` F2; `six-ages-2/FINDINGS.json` (advisors are aging people) |
| Six Ages 2 | Neglect becomes relationship consequences at coarse boundaries (other clans' `likesUs`, `fearsUs` change by caravan/emissary/raid presence) | `six-ages-2/FINDINGS.json` (~lines 152-155) |
| Tale of Immortal | Relation data: parent/children/sibling, married/lover/master/student, directed intimacy; marriage regret loses 50-80% intimacy; sect loyalty drops 4-8 on unpaid salary and +5 on backpay; NPC attributes amplified by post | `tale-of-immortal/FINDINGS.json`; `tale-of-immortal/REPORT.md` line 36 (childbirth, full marriage execution untraced) |
| Battle Brothers | Desertion follows severe mood with loyalty/support modifiers; business vs moral reputation distinct; noble houses with lineage traits | `battle-brothers/FINDINGS.json`; `REPORT.md` F2 |
| Vagrus | Bulk workforce vs named companions; companion quests award trust; loyalty feedback levels Off/Basic/Indicative; loyalty notification fatigue noted by players | `vagrus/FINDINGS.json`, `FINDINGS.md` |
| Cult of the Lamb | Follower state precedence (disease, injury, childhood...); low community faith picks eligible dissenters; loyalty items limit dissent; relationship modifiers enter productivity; proposed charter/version/member/duty slice | `cult-of-the-lamb/FINDINGS.json`; `cult-of-the-lamb/IMPLEMENTATION_PACKETS.md` |
| Crush Crush | Stage advance needs hearts + requirements, two-part acknowledgement; favorite training feeds affection; soft reset erases relationship progress while outfits/phone persist; YAIR's Tamsin outing was derived from its packets | `crush-crush/FINDINGS.json`; `crush-crush/IMPLEMENTATION_PACKETS.md` (lines 9-17, 51-65) |
| Sucker for Love: Crush Landing | A relationship remembers **how** a milestone happened (typed hearts); two equal scores can mean different histories; an episode can end without ending the life; "preparation is not a price-to-affection formula" | `sucker-for-love-crush-landing/REPORT.md`; `FINDINGS.json`; `IMPLEMENTATION_PACKETS.md` |
| Sunless Sea | Death as choice of what the next captain receives: rival takes a weapon, shipmate an officer, correspondent the chart, child unlocks a second selection, will protects home; contradicts part of YAIR's life-sim (most progress does not carry) | `sunless-sea/REPORT.md` lines 3-7; `IMPLEMENTATION_PACKETS.md` |
| Rogue Legacy | Lineage death record, frozen offer, traits RNG, class pool, compatibility, reroll | `rogue-legacy/FINDINGS.json` (lineage.*) |
| Cultist Simulator | A terminal ambition can still be refused for a relationship | `cultist-simulator/FINDINGS.json` |
| Book of Hours | Directed pair histories change later relationships; salon rivalry/peace deadlock; invitation/address/arrival states | `book-of-hours/FINDINGS.json` |
| Elin | Resident relations affect work efficiency; branch XP from member presence | `elin/REPORT.md` lines 19-23 |
| Caves of Qud | Reputation-priced NPC services (water ritual) recompute cost and recheck balance at selection | `caves-of-qud/NPC_FINDINGS.json`, `REPORT.md` |
| Dwarf Fortress | Culture stores policy judgments and value axes separately (no single reputation number); institutional succession rules | `dwarf-fortress/FINDINGS.json` |
| Noita | Directed herd-relation matrix (35 herds) beside tag matching | `noita/FINDINGS.json`, `BODY_WORLD_FINDINGS.json` |
| Citizen Sleeper 2 | Memory damage leaves a relationship one side remembers; friendships and obligations compete with maintenance | `citizen-sleeper-2/REPORT.md` F1/F14; `citizen-sleeper/REPORT.md` |
| Planescape: Torment | Records and relationships carry different things between lives | `planescape-torment/REPORT.md` lines 10, 23 |
| Theory of Magic | "Make an apprenticeship a chapter in a life" | `theory-of-magic/FINDINGS.json` |
| Your Chronicle | Training buys practical help, then craft changes a companion | `your-chronicle/FINDINGS.json`, `REPORT.md` |
| Increlution | No reviewed heir/family simulation (negative finding) | `increlution/FINDINGS.json` |
| Kenshi | Squad/faction DB decode (recruitment, relations); not summarized in REPORT, see `kenshi/FINDINGS.md`, `kenshi/second-pass/` | (not read in depth) |
| Idle social scout | Idle/social engine candidates | `idle-social-engine-scout-2026-10-06/REPORT.md` (not read in depth) |
| Engine analyses (already in repo) | Directed relationship memory, scene conditions, atomic aftermath | `docs/ENGINE_EXPANSION.md#encounter-driven-scenes-and-relationship-conditions-2026-10-02` |

### 3.2 Books / worlds (`research/novels/`, git-ignored)

| Source | Relationship-as-mechanic finding | Path |
|---|---|---|
| Lord of the Mysteries | L11 **heredity**: Seq 6/5 parents pass part of a characteristic to children involuntarily; enough children can drop the parent a Sequence (family is a power mechanic, ties into heirs). L12 names and attention: honorific names reach their owner; leaked names draw hostile attention. L9 Seq 4+ rituals also act as **anchors**; anchors lower madness risk and need a faith anchor to restart | `novels/lord-of-mysteries/PATHWAYS_DEEP_DIVE_2026-10-10.md` lines 50-54, 140-146, 219; `readers-2026-10-10/LOTM_PATHWAYS_C.md` lines 182, 399 |
| Shadow Slave | S10 Domains = territory plus **loyal people**, loyalty can drain to a rival; S11 **True Name** = anchor of self; losing fate means the world forgets you; Shadow Bond is an appraisal-visible bond, with the control question left open (SS-U01) | `novels/shadow-slave/SYSTEMS_DEEP_DIVE_2026-10-10.md` lines 59-61, 96; `WIKI_CROSSCHECK_2026-10-10.md` line 57; `WORLD_AUDIT.md` line 14, 33; `INTAKE.md` line 45 |
| Reverend Insanity | Living beside Fang Yuan as a **proximity/knowledge state** (unaware / aware and bound by a poison vow / aware and removed); partners bound by poison vows, people used until spent; clan is the opening (stipends, ceremony at 15) | `novels/reverend-insanity/SYSTEMS_DEEP_DIVE_2026-10-10.md` lines 112-130 |
| Re:Zero | Memory ledger persists across resets while relationships reset; isolation taboo; relationship-building from repeat knowledge; numbness counters | `novels/rezero/WORLD_AUDIT_2026-10-10.md` lines 18-39 |
| Mother of Learning | Which relationships/items survive a loop is an open design question; family relationship depicted | `novels/mother-of-learning/WORLD_AUDIT.md` lines 15-19 |
| Tokyo Ghoul | Hunger timer forces a feeding event on the nearest human, friend included | `novels/tokyo-ghoul/WORLD_AUDIT_2026-10-10.md` lines 8, 104 |
| Dungeon Meshi | Soul-bond strength decides revival method; companions used as shields; death as recoverable debt | `novels/dungeon-meshi/WORLD_AUDIT_2026-10-10.md` lines 81-88 |
| Omniscient Reader / Fated Villain / Regressor's Tale / LOTM audits | Cast tables with "knowledge, relationships, voice and availability" columns; witness/observer routes; memory vs relationship carry | `novels/<name>/WORLD_AUDIT.md` |
| Fan-fiction surveys + synthesis | Premise families (born in, outsider, replace a canon character), proximity states, two reusable templates | `research/LIVING_BESIDE_PROTAGONISTS_2026-10-10.md`; `novels/jujutsu-kaisen/`, `naruto/`, `harry-potter/` `FANFIC_SURVEY_2026-10-10.md` |
| JJK binding vows | Vow kinds and pricing | `docs/emergent/E8D_VOW_SYSTEM.md` (JJK section lines 179-262) |
| Succession per world | death/continuity patterns across the books | `docs/worlds/SUCCESSION_BY_WORLD.md` |

Caveats: several game reports are about economies or sim, not people; only the cited lines address
relationships. The Kenshi and idle-social scout folders were not mined.

## 4. Gap map

Legend: **I** implemented (in code, even if unverified), **D** designed (proposal doc with
mechanics), **R** researched-only (source mechanics captured, no YAIR design), **M** missing
(no code, no design, no research found). "I (thin)" means a stub exists. Verification states
for I items: source present; PROJECT.md/acceptance backlogs hold playable-gate status per wave
(I did not run anything).

| Need | Code | Design | Research | Notes |
|---|---|---|---|---|
| Relationship types / ties (friend, family, mentor, lover, rival, follower) | I (thin): chronicle `ties` map (`role: acquaintance`), household `spouseId`/`parents`; simulation ledger has no types | D: E3 relationship tags (`rival`, `grudge`, `family`, `follower`, `married`, `lover`), north-star layers | R: Tale of Immortal RelationData, Wildermyth lover/rival, CK3 | Two incompatible stores for types (ties vs tags) |
| Opinion axes | I (thin): `trust/respect/familiarity/esteem`; chronicle adds `fear` | D: affection/debt/fear + opinion formula (E3 s9) | R: RimWorld opinion, CK3 modifiers | No opinion readout; axes unclamped in simulation |
| Opinion vs familiarity vs trust distinct | I (thin): axes exist separately, never combined or shown | D partial: "keep only dimensions a scene uses" (CHARACTERS_AND_WORLD_EVENTS), opinion composite | R: Sucker for Love "equal scores, different histories" | Familiarity has 1 writer (`everyday_life.js:24`) |
| Axes acting on gameplay (gates, prices, willingness) | I (one): elder trust gate `chronicle.js:201` | D: E3 utility scoring uses opinion; scenes branch on relationship facts | R: Vagrus loyalty, Caves of Qud reputation pricing | Fact export exists, no content uses it |
| Memory of events | I: `memories[]` capped 32, with cause/at/text, deduped by cause | D: weighted `{k,w}` memories, decay (E3 s9) | R: RimWorld, CK3 typed death memories, Sucker for Love typed hearts | Free text, no kinds/weights, no decay |
| Display of relationships to player | I (thin): People panel (prose + memories), household list | D: Q4 how much reason is visible; north-star UI sections | R: Vagrus loyalty feedback tiers | No opinion words/trend, no relationship graph |
| Gossip / belief / rumor / reputation spread | M in code (`life_record` has reserved `rumor` kind; regional reputation is a numeric vanilla value) | D: full (E3 s10) | R: KoDP gossip-not-truth; DF culture judgments | Needs `history.<id>` truth anchor |
| Romance / courtship | M (only Tamsin outing is deliberately **not** affection: crush_social comment, `crush_social_content.js:1-2`) | D: north-star romance (layers, routes, jealousy, grief, opt-out); E3 `marry` goal | R: Crush Crush, Sucker for Love, Tale of Immortal marriage | The only shipped "outing" is a work proof |
| Marriage / births (NPC) | I (authored only): Lio-Rhea, births, in `npc_lives.js` | D: E3 s11 births with rolls | R: Tale of Immortal childbirth untraced | Player cannot marry or parent; household ignores player |
| Family and heirs (player) | I (thin): heir chronicle carries lesson + grave; npc_lives and life_record copied | D (rich): heirs/families/lone wolves/lineage; ACCEPTED direction (RULES_FROM_SCRATCH#the-heir) | R: Rogue Legacy, Sunless Sea, Wildermyth legacy, CK3 dynasty | Accepted direction is **not yet built**; code still "one lesson" |
| Loyalty of heirs' people (stay/leave/betray) | M | D (north star) | R: Battle Brothers desertion, Tale of Immortal sect loyalty, Vagrus | Needs persistent ledger across lives first |
| Rivals / nemesis | I (thin): Mara pursuit (`frontier_campaign.js`) with settle/decline/conceal/report | D: rival chronicle (RIVALS s231-276), E3 s13 grudges and arcs | R: Nemesis patent boundary, Wildermyth rival, Book of Hours deadlock | No grudge/debt/memory axes for Mara in the ledger (grep) |
| Companions | I (thin): Lio (consent, own kit, stamina, one contest) | D: companion kinds/refusal (CHARACTERS_AND_WORLD_EVENTS#party) | R: Vagrus, Your Chronicle, Battle Brothers retinue | No joined/left state generalization |
| Followers / retainers / students | M | D: north-star followers | R: Cult of the Lamb, Battle Brothers, Elin | Only a Village "recruit" Iona as a household record |
| Factions / organizations | M for relationships (vanilla/destination `reputation` only) | D: faction card; hubs | R: KoDP clan, Six Ages ring, DF culture, Battle Brothers houses | Separate from per-person ledger |
| Bonds as power (vows, anchors, soul bonds, True Names) | M | D: E8D vow system, north-star "romance as power", soul mode | R: LOTM anchors/heredity, Shadow Slave True Name/Shadow Bond/Domains, Reverend Insanity poison vows, JJK binding vows | E8D is the closest spec; no code |
| Death and grief | I (thin): villager deaths announced; graves/epitaphs for the player | D: E3 `belonging` -> `grieving` 14 days; north-star breakups/grief as life events | R: Wildermyth lover-death buff, CK3 death memories, Dungeon Meshi | Player-side loss of an NPC has no mechanic; `loss` kind unused |
| Cross-life persistence of relationships | M (chronicle relationships reset on heir; only `npc_lives` carries) | D: four persistence layers, link types | R: Re:Zero ledger vs relationships; Sunless Sea; Planescape | Rulebook 5 requires an explicit carrier |
| Cross-world persistence of relationships | M (book worlds use `knowledge`; transition `reset:['relationships']` exists as a policy) | D: romance across worlds, partners who cannot leave | R: Planescape | Rulebook 5 |
| Duplicated identity (same name, many roles) | Issue | n/a | n/a | Lio, Neri, Iona, Oren appear as household, party/exchange/home people; E3 V19 only notes Oren |
| Consent/opt-out | I: Lio consent, Tamsin consent, decline paths with no penalty | D: romance opt-out | n/a | Strongest existing convention; keep |
| Persistence/schema | I: three stores with separate validators (simulation 5, chronicle 1, npc_lives 1, life_record 1) | D: save-size budget (E3 s16) | R: CK3 participant pruning protection, Wildermyth broken IDs degrade to names | Any unification needs migrations |

## 5. Observations for planning (inference, not decisions)

- O1: The cheapest consumer wiring is to make the existing `relationship.<axis>` fact read by
  content (willingness, price, who offers what). It needs no schema change.
- O2: The two ledgers (simulation vs chronicle) should be reconciled before heirs carry people;
  rulebook 5 + the heir direction both need a persistent, per-person record.
- O3: Household vs live people is E3 Q1, still unanswered, and it blocks marriage, births,
  grief and heirs as family.
- O4: Typed memories (RimWorld/CK3/Sucker for Love agree) would let gossip, grief and callbacks
  read `kind` instead of free text.
- O5: Design docs conflict on axis set (E3: affection/debt/fear; code: trust/respect/familiarity/esteem;
  CHARACTERS_AND_WORLD_EVENTS: "no single favorability meter"). Not yet resolved.

## 6. Coverage and limits

- Read: `src/npc_lives*.js`, `people_knowledge.js`, `people_ui.js`, `life_record.js`,
  `life_experience*.js`, `chronicle.js` (relationship, heir and elder parts), `simulation_effects.js`,
  `simulation_contracts.js`, `party_*`, `helper_content.js`, `crush_social_*`, `promise_content.js`,
  `exchange_content.js`, `everyday_life.js`, `frontier_campaign.js`, grep of the rest of `src/`.
- Not read: `src/main.js` beyond grep hits; `src/data/dialogues*`; most world-completion content
  files; `tests/`. Playable/UI behavior not exercised.
- Research: scanned `FINDINGS.json` titles by keyword plus targeted lines; Kenshi and
  idle-social-scout not mined; no raw prose was read or reproduced.
