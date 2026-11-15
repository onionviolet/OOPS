# Refinement, will and canon time (2026-11-14, round 1)

Findings and proposals, not accepted decisions. A read-only source pass over the foundation engines, with no code changed and nothing played. It answers Weibao's three questions (2026-11-14):

- Is the foundation run current, and how should lanes connect?
- Does refinement cover steps, odd steps, other aspects, defeat into submission and other criteria?
- How should a world built around canon use scheduled events, seasons and timing?

Codes RWT1 onward are this doc's own. They cite PC, OR, PS, KW, TMR, MR and AD codes where those own the rule. Every new line is a default with a dial and a reason (AD56: ideas that open play are working defaults; limits wait for Weibao).

Input identity: master `da06a080b`. The foundation run's Wave 19 is uncommitted in the same tree (`src/ri_wild_gu.js`, `src/ri_wolf_tide.js`, `src/gu_refiner_registry.js`, `src/hp_duel_mastery.js`, `src/world_packs/book_gu_lead_wild_refinement.js`, their tests and `WAVE_19_CHECKPOINT.md`).

## Findings

| Code | Finding | Evidence |
| --- | --- | --- |
| RWT1 | **The wolf and its parts have two owners.** Daily-loops committed per-night eyes, pelts, meat, tallies and their prices to the patrol. Wave 19's uncommitted `RI_WOLF_PARTS` says it owns the same parts (PS2). Both lanes worked in the same hour without seeing each other. | `1633cc3c8` (`src/ri_lead_day_facts.js`, `src/world_packs/book_gu_lead_day.js`); `src/ri_wolf_tide.js` `riWolfParts` |
| RWT2 | **The foundation run's picture predates about 30 commits.** Wave 19's input is `601cf3f8b` and its bundle came from `2c95b5a01`. The combat terms (`fight_terms.js`), the kill-or-spare choice, the wolf-parts direction and the play-surface rounds landed after it. | `git log 601cf3f8b..da06a080b` |
| RWT3 | **The item ids do line up.** The wild-refinement pack reads `RI_DAY_ITEMS` from the day lane, so the cow route spends the same eye the board pays ten merit for. That is a real trade-off, not a bug. | `book_gu_lead_wild_refinement.js:8` |
| RWT4 | **The wild Gu cannot fail.** Nothing ever passes `controlFailed: true` to the wild route, so "The wild Gu slipped your hold" is unreachable. Other hosts do pass it: Keeper fusion on a rush, the workshop's rushed attempt, the Keeper's advance quench. | `ri_wild_gu.js:89-99`; `gu_keeper_fusion.js:191`, `gu_workshop.js:423`, `gu_keeper_refinement.js:106` |
| RWT5 | **Wearing down a will is a fixed price, not a contest.** It costs 20 parts or, cowed, 8 parts and an eye. The Gu's rank, kind, temperament, hunger or injury change nothing, and neither do the refiner's will, rank or realm. Canon says a Gu master's will wears out the Gu's (RIG12), so the price should come from both sides. | `RI_WILD_GU_DIALS` |
| RWT6 | **Gu refinement is a separate stage engine, older than the kernel.** `gu_refinement.js` has ordered stages with material inputs, per-role control failure (destroy or injure), precursor advancement, a unique Immortal key and a vital-bond carry. Stage `minutes` are not read by the engine; the host keeps the clock. Stages have no condition, no odds, no quality and no branch. | `gu_refinement.js:10-138` |
| RWT7 | **The shared working kernel already has most of what refinement lacks.** Each step has its own deadline (KW2, KW5). Readers and authority are asked at the step's own time, so a step can read the calendar, place, weather or a person (KW6, KW12). A step can refuse with a reason (KW8) or give per-step odds and costs (KW15). It separates what the maker saw from the truth (KW9) and keeps one versioned save (KW10). It has no branching: an alternative path is a second method row. | `docs/KERNEL_WORKING_CONTRACT.md` KW1-KW16; `src/kernel_working.js` |
| RWT8 | **Defeat has outcomes, but nothing comes after them.** `contest.js` ends in `yielded`, `captured` or `surrender_accepted`. Fight terms offer `take_alive` ("bound and kept"). No reader turns a beaten, cowed or captured creature, Gu or person into obedience, ownership or a cheaper claim. The only taming-shaped mechanics are the Liquor Worm's familiarity and wine timing (`gu_liquor_worm.js`) and the wolf eye as an input. | `contest.js:26-27`, `fight_terms.js:6-13`; no `tame` or `submit` reader in `src` |
| RWT9 | **MR44 is cheap to meet.** The precursor path already rewrites the same specimen in place. A same-kind claim keeps the wild Gu the same individual if it relaxes `rank < recipe.rank`. Today the wild specimen is consumed and a new one is made. | `gu_refinement.js:32-33`, `:105-107` |
| RWT10 | **The Gu world has no calendar.** `world_calendar_content.js` has profiles for the frontier, MoL, Paradise and Hogwarts (through its binding), and none for Reverend Insanity. No `ri_*` file or Gu lead pack reads a date or season. Canon dates his first night as "the second wolf tide this year", and nothing can place that. | `world_calendar_content.js`; grep of `src/ri_*.js`, `src/world_packs/book_gu_lead*.js` |
| RWT11 | **Canon timing exists as data, but only lint reads it.** The lead-run beat files (`lead-run/1.3`) carry date anchors, day offsets, time of day and a precision label per scene. Only `scripts/lead_run/*` reads them. The files are under `private/`, so a runtime copy can carry ids, dates and locators only. | `docs/research/novels/*/private/lead-run-*/…_scenes.jsonl` |
| RWT12 | **The event book is generic but has one consumer and no recurrence.** `world_events.js` has `canon_beat`, `festival`, `curfew` and `disaster` kinds, dated, anchored and ordinal placement, restrictions and who-knows. Only LOTM's cities and events, gatherings and travel use it. It has no repeating placement, so an annual wolf tide or a school term can't be one row. `cast_schedule.js` has recurrences for people, and `npc_schedule.js` competes with it (AREA_GUIDE). | `world_events.js:6-7`; AREA_GUIDE "Schedules and presence" |
| RWT13 | **Seasons are one shared quarter-of-the-year rule.** `projectCalendar` picks spring, summer, autumn or winter as month ÷ 3. Only the frontier profile turns seasons on. Gathering, craft sources, climate and sky read it. TMR2 already says seasons are world data. | `world_calendar.js:7`, `:31` |

## Answers in short

- **Is the foundation run current?** No. It is the right owner of Wave 19, though, and the resume block and checkpoint are its handoff. It should reconcile against HEAD (RWT1, RWT2) before committing. A fresh chat is needed only if it reports that it lost its context.
- **Engine only for now?** Keep engine-first with a named consumer (OR1, PC95). The next gaps (RWT4 to RWT13) are engine gaps, and Fang Yuan's day is already waiting to consume them.
- **Does refinement cover it all?** Steps and failure, yes. Odd steps, timing, odds, quality and submission, no. The kernel (RWT7) is where those belong, not more fields on `gu_refinement.js`.

## Dispositions

### ACT NOW (to the foundation-run owner, before Wave 19 commits)

- **RWT14. One owner for wolf parts.** Default (proposal): daily-loops owns per-night yields and prices, because that is world data its patrol reads. `ri_wolf_tide.js` keeps the mechanism (population, foe, per-wolf parts by size) and the day lane draws from it. The alternative is to drop `RI_WOLF_PARTS` and read the day lane's rows. Settle it in a message between the two chats, not by both editing. Done check: one table names eye, pelt and meat counts, and the other imports it.
- **RWT15. Recheck Wave 19 against HEAD.** Rebuild and rerun `test:changed` on the combined tree. `fight_terms.js` and the kill rule landed after its input. Done check: a receipt line with the new input identity.

### ACCOUNT FOR NOW (constraints on the next refinement and time work)

- **RWT16. New making steps run on the kernel.** A new refinement, taming or claim method is a kernel method whose steps read their conditions through ports. `gu_refinement.js` stays the settlement for Gu identity (unique key, vital bond, provenance). It is not grown with conditions, odds or branches. Reason: KW6, KW8 and KW15 already do this in one owner (PC12 compression).
- **RWT17. A failure the text names must be reachable.** If a result line describes a failure, some input must produce it, or the line goes. Applies to RWT4 at once.
- **RWT18. Engine lanes ship mechanisms; consumer lanes own world tables.** Prices, nightly yields and the patrol's weights belong to the lane whose loop reads them. The engine lane exports the law and a keyed draw. Before building a world-fact table, a lane checks the play-surface checkpoint's owner rows and names itself there in the same commit (PS61-PS66, OR6).

### LATER / DELEGATE (each a proposal with a level, effort and done check)

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| RWT19 | **Will as a contest, not a price.** Defaults: the essence needed scales with the Gu's will (rank, kind temperament, hunger and injury lower it) against the refiner's (realm, rank, steadiness). A run can fail at a stage with an odds read (KW15). A failed run leaves the Gu warier, so the next try costs more. Dials: the scale per world, a temperament table. | sonnet, medium | The same Gu costs less when it is starving or injured; a rank-two Gu can beat a rank-one refiner; "slipped your hold" occurs in a seeded test |
| RWT20 | **Defeat into submission.** A won fight, a cowing aura, hunger, a bribe of food, familiarity over days or a binding Gu writes a `subdued` fact (`{by, how, strength, at, decays}`) on the specimen or creature. Claim, refinement and taming methods read it as a discount or a precondition. Contest outcomes `yielded`, `captured` and `surrender_accepted`, and the `take_alive` term, are the first writers. The wolf eye becomes one way to cow a Gu, not a recipe input. The fact fades over time, a dial per world. | sonnet, medium-large | Fang Yuan beats a wild Gu in a contest and the claim costs less; a captured wolf held two days without food is easier to bind; nothing new is hand-written per kind |
| RWT21 | **Taming as a kernel method family.** One law, many worlds: the same steps (subdue, hold, mark, keep) with world operations. Examples: a Gu master's essence mark, the slave path's enslaving Gu, a hippogriff's bow (respect, not defeat), a Beyonder's sealed artifact (containment). Each world adds operation rows, not a new engine. | sonnet, large | Two worlds tame through one law with different operations; the save round-trips |
| RWT22 | **Same individual on claim (MR44).** A claim keeps the wild specimen's id, traits and history, and changes only holder and control. | haiku-to-sonnet, small | The refined Gu's id equals the wild one's; its provenance names the patrol find |
| RWT23 | **Step conditions from the world.** Kernel steps read the time of day, season, weather, place and moon phase through ports. Defaults: a condition that fails blocks with a reason, or lowers odds where the source says it only helps. Canon rows cite where a step needs night, moonlight or a still sea. | sonnet, medium | One Gu method refuses by day with a reason and runs at night; a quote shows the time it can start |
| RWT24 | **A Gu-world calendar.** Add a Reverend Insanity profile with the anchor dated from the beat files (RWT11): the second wolf tide of the year. Seasons on, with their effects declared in data (TMR2). | sonnet, small-medium | His first screen shows a date and season; `day_strip` reads it |
| RWT25 | **Recurring events in the event book.** A repeating placement (`every: {years, months, days}`, `from`, `until`, `phaseDays`) for the annual wolf tide, school terms, festivals and markets. Keep `cast_schedule.js` for people, and settle `npc_schedule.js` as the controller view or retire it (AREA_GUIDE, competing owners). | sonnet, medium | The wolf tide opens and closes each year from one row; LOTM's dated rows still pass |
| RWT26 | **Canon beats compiled into events.** A build step reads the lead-run beat files and emits ids, anchors, offsets, time bands and locators (no prose) into each world's event book as `canon_beat` rows. They then follow the natural-course standard (OD7, OD8): beats happen unless disturbed, and their stop points are the known events of TMR8. | sonnet, medium | Klein's, Harry's and Fang Yuan's first ten beats appear as dated events; a skip stops at the next one; nothing under `private/` is copied |
| RWT27 | **Tide phases drive the world.** The wolf tide has phases (early, peak with the wolf king, ebb), read by patrol weights, wolf size, prices of eyes and herbs, the clan's mood and who stands on the wall. This is the "tide phase that moves encounter weights over the season" Wave 19 left for later. | sonnet, medium | Weights differ by phase in a seeded test; Reports names the phase change |
| RWT28 | **Seasons with consequences per world.** Seasons and their effects are profile data: what grows (moon orchid petals for Moonlight diets), what hibernates, what spoils faster, which roads close, which festivals land. Gathering, spoilage, Gu diets and travel read one season reader. | sonnet, medium | Spoilage and a gather yield change with the season in one world, from data |
| RWT29 | **Timing literacy in the UI.** The day strip and quotes say when a thing can next happen and why ("Moonlight refines best at night; 4 h to dusk"), and what canon is coming that the character knows about (PIR20, who-knows). Waits on the UI owners (OR2, OR6). | sonnet, small, UI lane | A blocked timed step shows its next window; an unknown canon beat stays hidden |
| RWT30 | **Ripeness and windows.** Some steps have a best moment rather than a gate: a Gu at its hungriest, a potion off the heat at the right minute, a sowing window. The odds or quality peak there and fall off either side (a curve, a dial per row). | sonnet, medium | Quality differs by timing in a seeded test; the quote names the best minute |

## Round 2: taking someone else's Gu, and what follows (2026-11-14)

Weibao asked about "the lore implications of stealing gu and more? other aspects? that can be a drama point too". Evidence is from the committed reading synthesis (`docs/research/novels/full-book/reverend-insanity/`). Labels: **stated** (the notes say it), **inferred** (from stated cases), **proposal** (authored).

### What canon shows

- **A refined Gu carries its master's imprint.** Fang Yuan removes his imprint from one half of Bone Flesh Unity before Bai refines it (RI-c0230-01, stated). Bai refines a bought Poison Vow Gu herself in 15 minutes so Fang Yuan cannot alter it (RI-c0272-03, stated). Whoever holds a Gu without its imprint has a body, not a tool (inferred).
- **Theft happens, and the haul can sit unused.** Fang Yuan steals Bai's Relic, Stone Aperture and Water Shield Gu (ch143). Two chapters later they are held, and the Relic and Stone Aperture are unused (RI-c0145-02, stated). The notes don't give the reason; an imprint still to break fits (inferred).
- **Framing and witness knowledge are part of it.** Fang Yuan frames Bai for the Man Shi group's deaths and turns Qing Shu's party against him with a false accusation (ch134, ch139, stated). What the guards and assassins saw differs from the plan (the Water Image case: "revealed knowledge is not retroactive witness knowledge", stated).
- **Denial by destruction.** Bai self-detonates Frost Demon Gu and sacrifices his arm rather than be taken (ch139, stated). Restricted self-destruction keeps selected Gu intact (dog-army notes, stated).
- **A master's death frees or kills their Gu.** Dogs can die with their enslavement Gu; their natural Gu can function, die or flee (stated). Vital Gu already die with their master in code (`vitalMaster`).
- **Lending is not giving.** A loan keeps the lender's will and control while the borrower supplies fuel (stated; `Overlapping Shadow is a loan after a refused reward`). Clan Gu at the start are clan property lent to students (Wave 19 and earlier lead-life notes, stated in those docs).
- **Theft can end in pardon.** Fei's theft is real, yet a risky performance and an investigation yield pardon and promotion (stated). Outcomes follow people and institutions, not a fixed penalty.

### Findings

| Code | Finding | Evidence |
| --- | --- | --- |
| RWT31 | **No Gu has an imprint field.** Specimens have `holder`, `alive`, `vitalMaster` and an Immortal `uniqueKey` claim (`gu_world_claims.js`). Custody and control are mostly the same thing. Moving `holder` hands over a working Gu with nothing to break. | `gu_refinement.js`, `gu_world_claims.js` exports |
| RWT32 | **Theft code exists for other things, not Gu.** `steal` and `theft` appear in fights, economy standing, the LOTM collector and story requests. None of these covers a living Gu, its imprint or its owner's response. | grep of `src` |
| RWT33 | **The pieces a theft drama needs already exist.** `world_events.js` has who-knows and learned-day. The kernel separates what was observed from the truth (KW9). `person_memory` and person ties carry grudges. Contest outcomes include `captured`. A theft slice is mostly wiring. | AREA_GUIDE rows |

### Proposals (defaults with dials and reasons)

- **RWT34. An imprint is a will on the Gu.** Each refined specimen carries `imprint: {by, strength, at}`. Claiming a Gu reads it: a wild Gu has none, so you wear down only its own will (RWT19). A Gu imprinted by someone else costs that will plus theirs, scaled by the strength of the mark. The owner can lift their own imprint at little cost (ch230). Dial: per world, how fast an absent master's imprint fades. Reason: the source treats ownership as will, not possession.
- **RWT35. Taking and claiming are two acts.** Taking is custody (pickpocket, loot, lift from a body, sweep a stash). Claiming is breaking the imprint. Between the two, the thief holds a Gu that won't answer, has to be fed, and may still be marked as someone else's (ch145, inferred). Default: a held, unclaimed Gu can't be used; it can be fed, sold, hidden or returned.
- **RWT36. The owner may notice.** Default (proposal): an owner senses a broken imprint at once if it is broken nearby, and otherwise later, through absence, a missed feeding or a hunt. Dial per world and rank. Reason: a mark is part of the owner's will; how sharp the sense is isn't stated, so it is a dial.
- **RWT37. A stolen Gu is evidence.** Until it is claimed, it is proof of whose it was: a clan Gu, a known kind seen on a known person, a feeding pattern. After claiming, its kind and history can still give it away to someone who knew it (MR44 keeps the individual). The event book's who-knows and the kernel's observed-versus-truth carry what each person knows.
- **RWT38. Owners can deny a theft.** A master can self-detonate a Gu or order it to flee rather than lose it (ch139, the dog notes). Default: costly, as in canon (a limb, the Gu itself). Dial: who can do it at what rank.
- **RWT39. Death changes the haul.** Looting the dead is its own case: vital Gu die with their master, natural Gu may function, die or flee (stated), and an imprint from a dead master fades or lingers per the RWT34 dial. A corpse's Gu are a race against flight.
- **RWT40. Clan property and lending.** Clan Gu are lent: the clan's mark sits under the student's, or the loan has a ledger row. Losing one, selling one or being robbed of one is a debt or an offence at the merit board, read by the existing standing and duty owners. Default: the clan asks first, and punishes per its customs (the institutions notes).
- **RWT41. Drama falls out of the state.** No scripted theft quests. Theft writes facts (who took what, who saw, whose imprint), and people react through what they already have: grudges in memory, ties, the clan's law, rumours in who-knows, and bounties as offers. That covers framing someone else (ch134), a pardon after an investigation (Fei), a fence who asks no questions, a victim who comes back stronger, and a Gu that slips back to its owner. Reason: AD38, things work by how they work.
- **RWT42. The same shape across worlds.** Possession and allegiance are separate in other sources too, which makes this a cross-world law with world operations, not a Gu special case. Hogwarts canon: a wand's allegiance passes to whoever defeats or disarms its master. Lord of the Mysteries canon: a sealed artifact keeps its own will and costs whoever carries it, and a Beyonder characteristic outlives its owner. The taming family (RWT21) and the imprint (RWT34) can share one law: hold, subdue, mark, keep, lose.
- **RWT43. Theft is also the player's risk.** NPCs can steal from the player by the same rules. Defaults: safeguards are mechanisms (refine at once, keep Gu in the aperture, a guard, a stash), not a toggle. Dial: how often the world tries, per world. Reason: AD22 means no anti-cheat, but a world that can steal from you makes ownership matter.

### LATER / DELEGATE (round 2)

| Code | Item | Level, effort | Done check |
| --- | --- | --- | --- |
| RWT44 | **The imprint field and claim cost** (RWT34, RWT35): add the field, make claims read it, and let an owner lift their own. Build after RWT19 and with RWT22. | sonnet, medium | A Gu marked by a stronger master costs more to claim than a wild one; lifting your own costs little; save round-trips |
| RWT45 | **A first theft slice in Fang Yuan's life** (RWT36, RWT37, RWT40, RWT41): take a classmate's or a corpse's Gu, then the owner's or clan's response through existing standing, ties and who-knows. A consumer for RWT44. | sonnet, medium-large; needs RWT44 | A stolen clan Gu leads to a board inquiry in a seeded run; a witness changes who is suspected; nothing is scripted per case |
| RWT46 | **Allegiance across worlds** (RWT42): one law with Gu imprint, wand allegiance and sealed-artifact will as operations. | sonnet, large; after RWT21 and RWT44 | Two worlds pass the same hold, subdue, mark, keep, lose test |

## Suggested order

RWT14 and RWT15 come first, so Wave 19 lands. Then RWT22, RWT17 and RWT19, which make the wild Gu honest for Fang Yuan's day. Then RWT24, RWT25 and RWT27, which give the wolf tide a calendar and phases with the same consumer. RWT20 and RWT21 come after the will contest exists, and RWT26 once two worlds have calendars. Each is a proposal under AD56; none removes an option.
