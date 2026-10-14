# Foundational functions: default, earned, lost or cheat (proposal, 2026-10-13)

Weibao (2026-10-13): "Lets ponder foundational ideas and more? like wether some functions should exist by default or earned as cheats, stuff like game functions such as relationship stuff and more? more to consider?"

Proposals only. Nothing here is accepted. Rows follow Default + Dial + Reasonably where a dial fits.

What this pass adds beyond existing parts. Part 22 gives UI and quality-of-life features a home (base, base-play, world-cheat, sandbox, access) and a cheat test. Part 20 models relationships. Part 23 TN16 names "base against cheat" as a tension. This part asks the question one level down: about **life functions** (talk, marry, own, sign, travel, teach, worship) rather than panels, and splits every function into layers so "default or earned" gets a separate answer per layer instead of one per feature.

Read for this pass: parts 13, 19, 20, 22 and 23; `src/simulation_contracts.js` (action `requires` and `visibleWhen` predicates at `:108`, `condition` and `relationship` operations at `:44`); `src/chronicle.js:62` (`relationshipChange`); `src/people_knowledge.js`; `src/crush_social_facts.js`. Source-read, not browser-checked.

---

## 1. The layer stack (LS)

The core proposal: "should relationships exist by default?" has five answers, one per layer. Most confusion about default against cheat comes from asking it of the whole function at once.

| Code | Layer | Default home | Why it matters |
|---|---|---|---|
| LS1 | **Simulation.** The world runs the function whether you see it or not: NPCs remember you, ties form between NPCs, prices drift, debts accrue. | Always on. Never earned, never a cheat. | A relationship that only exists once you unlock its panel makes the world fake. The engine already stores `simulation.relationships` independent of any panel (`src/backlog_expansion_replacement.js:67`). |
| LS2 | **Verb.** What your character can do: chat, gift, ask a favor, propose, hire. | Default from body, place and role (section 2), not from progression. | An ordinary person can talk to a neighbor on day one. Gating talk behind a level reads as a game, not a life. |
| LS3 | **View.** What you can see about it: feelings as words, a memory list, numbers. | Words by play (part 20 UF, part 22 FI24); numbers as an Access setting. | Seeing more does not change the world, so it should not cost power. |
| LS4 | **Reach.** Scale, distance and upkeep: keeping forty bonds warm, writing letters, a secretary who remembers birthdays, a household that hosts. | Earned by play, items, servants, institutions. | This is where real progression lives for social play. You grow from "knows the baker" to "runs a salon". |
| LS5 | **Rule.** Breaking what locals believe is impossible: read hearts, charm, erase a bad first impression, compel loyalty, know true feelings exactly. | Cheat (part 22 cheat test). | Keeps "cheat" meaning a world's rule bent, with receipts and backlash. |

**Worked example, relationships.** NPCs hold opinions of you from the first minute (LS1). You can chat, gift and help at once (LS2). You see "warm", "wary" and the memories behind them after a few meetings; numbers are a setting (LS3). Letters, a standing dinner, a go-between and a club charter let you keep many ties alive (LS4). Reading a heart, a love potion or a loyalty geas are cheats with a tell and a lift-off memory (LS5, SF5).

**Same split for other functions.**

| Function | LS1 sim | LS2 verb | LS3 view | LS4 reach | LS5 rule |
|---|---|---|---|---|---|
| Trade | Prices move by supply, fear, renown (part 24 price notes) | Buy, sell, haggle | Price words; trend after practice | Broker, shop, standing orders, credit | Know a seller's floor, curse a coin |
| Travel | Roads have danger and time | Walk known routes | Map of known routes | Mounts, passes, beds, a carriage | Teleport, skip distance in a world without it |
| Combat | Enemies learn and flee | Fight, flee, yield | Your rough odds | Squad, stance drills, a second | Exact odds, rewind a blow |
| Crafting | Materials age, tools wear | Known recipes | Makeable now (`src/crafting_visibility.js`) | Workshop, apprentices, batches | Perfect quality, no material loss |
| Time | Clock runs while present | Wait until an event | Calendar, schedule | Helpers who act while you are away | Free skip, rewind, loops |
| Identity | People know you by face and name | Give a name, wear a hood | Who knows what about you (part 21) | Aliases, papers, a cover job | A face nobody remembers, a true name hidden |

---

## 2. Where "default" comes from (DS)

There is no single global default. A function's default verb comes from this life's circumstances. Earned and cheat are then measured against that baseline, so the same function can be default in one life and a cheat in another.

| Code | Source | Default | Why it matters |
|---|---|---|---|
| DS1 | **Body.** Age, senses, voice, hands, health. | A child cannot sign a contract; a mute body writes or signs instead of speaking. | Starts feel different without new systems. Part 12 child and odd-body starts gain verb sets for free. |
| DS2 | **Skills the body already has.** Literacy, a language, a trade. | An illiterate start has no letters, contracts or books until taught (part 19 notes illiteracy). | Turns "learn to read" into a real unlock with a teacher, not a menu item. |
| DS3 | **World institutions.** Marriage, banks, courts, guilds, temples, schools exist only where the world has them. | A verb exists where its institution exists. No bank, no loan verb; a moneylender instead. | Worlds stay distinct (TN12). You never "unlock marriage"; you live where marriage exists, then someone agrees. |
| DS4 | **Role and station.** Noble, servant, soldier, student, outlaw. | A noble starts with servants and a seal; a cadet has a pay book and orders. | Role sets reach (LS4) at start. Trading station for reach is a life choice, not a menu. |
| DS5 | **Law and custom.** Who may marry whom, who may carry arms, who may enter a library section. | A verb can exist but be illegal; doing it writes a witness risk (UP3). | Separates "can't" from "mustn't". Breaking custom is play, not a cheat. |
| DS6 | **Era and technology.** Phones, printing, rail, scrying. | Tech that locals have is a tool. The same phone carried into a medieval world becomes a cheat. | Cheats are relative to the world, which matches part 22's test and gives carryover (part 17) a reason to feel strong. |

**Dial DS-D.** Baseline width per start: wide (most verbs open, sandbox feel) to narrow (a peasant child with few verbs). Reasonably: the start card shows the verbs this life begins with.

---

## 3. Functions you start without or lose (NS)

Defaults can also go away. Losing a function is a strong story driver and costs little to build, because the gate already exists as a predicate.

| Code | State | What it removes | Way back | Why it matters |
|---|---|---|---|---|
| NS1 | **Outlaw or banned** | Shops, guild halls, roads past a gate | Pardon, bribe, new papers, leave the region | A reputation hit becomes a felt verb change, not a number. |
| NS2 | **Prisoner, conscript, indentured** | Travel, free schedule, sometimes trade | Serve the term, escape, be bought out | Matches part 20 obligations with clocks (UP5). |
| NS3 | **Foreigner without the language** | Most talk, contracts, haggling | Learn the tongue, hire an interpreter (LS4) | An isekai start feels foreign through missing verbs. |
| NS4 | **Amnesia** | Your view of past ties (LS3) | Recovered memories, friends who remind you | The simulation still remembers you (LS1), so strangers greet you warmly. That gap is the hook. |
| NS5 | **Disgrace, excommunication, expulsion** | Institution features (part 22 FR4) | Penance, appeal, a rival institution | Revocation was already proposed; this ties it to verbs. |
| NS6 | **Injury or curse** | A sense, a hand, a voice | Healing, a tool, a workaround verb | A broken hand that opens "dictate a letter" is better than a flat penalty. |
| NS7 | **Cheat withdrawn** | A borrowed LS5 power | Renegotiate, pay the debt, live without | Part 13 CA18 return clauses, felt as lost verbs. |

**Line.** Part 22 LN1 to LN10 (accessibility, saves, pause, readable log) are never removed by any of these. A prisoner can still save the game.

**Default.** Every blocked verb shows a named reason and a way back when the character would know one ("barred: outlaw in Riverton. Pardons are sold at the magistrate."), per TN17.

---

## 4. Life functions inventory (LF)

Part 22 inventories interface features. These are the life functions underneath, with a default source and a typical cheat. Reference table, not a build list.

| Code | Function | Default source (DS) | Earned reach | Cheat version |
|---|---|---|---|---|
| LF1 | Speak, chat | Body, language | Oratory, a herald, a printed pamphlet | Command voice, tongues |
| LF2 | Read, write | Literacy | Library card, scribe, correspondence network | Read any script, read minds through letters |
| LF3 | Own property | Law, station | House, land, shop, vault | Pocket space, a home that follows you |
| LF4 | Sign contracts, swear oaths | Age, law | A notary, a seal, a guild guarantee | Binding oaths that magically enforce |
| LF5 | Partner, marry | Institution, consent of the other | A household, alliances by marriage | Love potion, fated bond |
| LF6 | Children, adoption, apprentices | Body, institution | A lineage (part 23 WG1), a school | Choose an heir's traits, raise faster |
| LF7 | Hire, employ | Money, station | Staff, a company | Loyal-by-design servants, summoned workers |
| LF8 | Learn from people | Someone willing to teach | Mentors, schools, a tutor on retainer | Copy a skill by watching once |
| LF9 | Teach others | A skill and a listener | Students who carry your methods | Implant knowledge |
| LF10 | Cross borders | Papers, roads | Passes, diplomatic status | Walk between worlds |
| LF11 | Carry arms | Law, station | A licence, a regiment | Hidden weapons nobody notices |
| LF12 | Worship, petition | Faith, temple | Clergy rank, a shrine | A god who answers directly |
| LF13 | Accuse, sue, testify | Courts, standing | A lawyer, a patron | Make a witness forget |
| LF14 | Borrow, lend | Banks or moneylenders | Credit lines, bonds | Debts that forget themselves |
| LF15 | Name yourself, take an alias | Custom | Papers for each name | A face nobody remembers |
| LF16 | Will and inheritance | Law, literacy | Executor friends (part 20 RD10) | Choose your reincarnation |
| LF17 | Rest, eat, need care | Body | A cook, a bed you own | No sleep, no hunger |
| LF18 | Die | Body | Insurance: an heir, a will, a shrine | A respawn point, a loop |

---

## 5. Social foundations (SF)

New relationship angles that part 20 does not cover.

| Code | Consideration | Why it matters |
|---|---|---|
| SF1 | **The people panel is your character's read, not the truth.** Default: each line is a belief (UP1) with a basis: "seems warm (shared three meals)". It can be wrong; a liar reads warm. The cheat view shows the truth and flags where your read was off. | Gives social play the same honest-uncertainty rule as odds and maps (part 23 DA2-12). |
| SF2 | **The other side is the gate.** Default: relationship verbs open by the NPC's state, not your level. "Propose" appears only when someone would plausibly say yes or when you are reckless enough to ask anyway. | You never unlock marriage; a person agrees. Matches the north star's life-sim feel. |
| SF3 | **Social bandwidth is soft.** Default: no hard cap on friends, but each tie needs time; spread thin and familiarity fades (part 20 RM7). Reach (LS4) such as letters, a standing dinner or a club raises the comfortable number. Dial: per world from relaxed to tight. Reasonably: a memory cheat or a secretary raises it further. | Turns "how many friends" into a resource choice without a magic number. |
| SF4 | **Automated upkeep has a tell.** Default: letters, gifts on schedule and a servant's visits keep familiarity but not trust. Close friends notice form letters ("the same card again"). Dial: tell strength per person temperament. | Lets idle play maintain a big circle while keeping close bonds personal. The Earned Habit cheat can automate socializing but carries this tell. |
| SF5 | **Rule-breaking social cheats leave receipts.** Default: charm, compulsion or a love potion writes a memory flagged as compelled. When it lifts, the NPC can remember (dial per world from never to always). Others who witness it react (UP3). | Keeps mind-affecting cheats as consequence, not a free win, with no refusal needed. |
| SF6 | **Introductions are the unlock for people.** Default: some people are only reachable through someone (part 20 MF9). The gate is the social graph, not a level. | Makes every friend a key and makes losing a friend close doors. |
| SF7 | **Observed verbs.** Default: some social verbs appear after your character sees someone use them: haggle after watching a haggle, bribe after seeing a bribe, a courtship custom after attending a wedding. | Verb discovery that the character could plausibly make. Rides the witness set (UP3) and knowledge records. |
| SF8 | **Founding is reach.** Default: starting a club, household, order or crew is an earned verb that needs members, a place and a reason; it then holds its own record (UP12). | The top of social progression is building structures, not maxing bars. |
| SF9 | **NPCs have the same layers.** Default: an NPC can lose a verb (outlawed), gain reach (a new patron) or hold a cheat. Their changes show in what they can do for you. | One rule for everyone keeps the world readable. Extends part 22 DP4. |

---

## 6. Rules as content (RC)

Separate from functions: the game's rules themselves (drift, decay, memory, prices).

| Code | Consideration | Why it matters |
|---|---|---|
| RC1 | **People teach the rules.** Default: a rule is stated by a fitting NPC the first time it matters ("friends forget you if you vanish for a season"). Dial: hint density (part 22 DL6). | A rule becomes world flavor and a hint at once. |
| RC2 | **Fair first bite.** Default: a rule that can cost something permanent warns once before it bites. A lost friendship can be the warning; a lost life cannot. | Protects the player without removing stakes. |
| RC3 | **A world's rules can differ and be learned.** Default: drift, decay or price behavior can differ per world and is discovered like lore. | Distinct worlds through rules, not just skins (TN12). |

---

## 7. Placement test (PT)

A quick ladder for placing any new function, layer by layer. Stop at the first yes.

1. **PT1.** Is it comfort, accessibility or save safety? Then it is a setting or a line (part 22 LN).
2. **PT2.** Would the world run it anyway? Then the simulation layer is always on.
3. **PT3.** Could an ordinary person of this body, role and place do it? Then it is a default verb for that life (DS).
4. **PT4.** Does it only make it bigger, farther, faster or automatic? Then it is earned reach.
5. **PT5.** Does it break what locals believe is impossible? Then it is a cheat for that world.
6. **PT6.** None of the above? It is likely sandbox-only or does not belong.

This refines part 22's single cheat test into a ladder and agrees with its recommended policy.

---

## 8. Suggestions, cheapest first

| Code | Build | Save impact |
|---|---|---|
| A1 | **Layer column on part 22's feature home table (T1).** Each row gets LS1 to LS5 homes. | None. Data only. |
| A2 | **Verbs from life facts.** Gate social and legal actions with the existing `requires` and `visibleWhen` predicates (`src/simulation_contracts.js:108`) reading age, literacy, status and location facts. | None if the facts exist; otherwise additive facts. |
| A3 | **Blocked-verb reason line.** Where a predicate hides a verb the character would know about, show the reason and the way back (NS default). | None. Presentation. |
| A4 | **Observed verbs (SF7).** On witnessing an act, write a knowledge key; the verb's `visibleWhen` reads it. Uses the existing `knowledge` operation (`src/simulation_contracts.js:44`). | Additive knowledge rows. |
| A5 | **One restriction state as a condition.** Outlaw in one Village-adjacent place, using the `condition` operation, blocking the shop with a named fix. | Additive condition row; needs a compatibility note for old saves (none carry it). |

Smallest taste that shows the whole idea: A2 plus A3 on one start, an illiterate or foreign life whose missing verbs show their reasons and come back through a teacher.
