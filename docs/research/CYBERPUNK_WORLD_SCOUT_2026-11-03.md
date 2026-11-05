# Cyberpunk world scout, 2026-11-03

Status: research proposal for Weibao, not accepted direction and not a spec. Web-only pass; no engine code was read or run, so every engine-fit statement about what the code lacks is inference. Source text is paraphrased. Evidence labels used throughout: **shown** (a source does it), **stated** (project docs say it), **inferred** (my reading, unchecked).

Evidence quality: most pages were read through a summarizing fetch tool, and several fan-wiki pages (Cyberpunk Fandom, Prima, ProGameGuides) returned 402/403. Rules numbers (Humanity costs, prices) come from secondary pages and forum posts, so treat them as illustrative until checked against the rulebooks. Items marked "recalled" are from general knowledge and were not re-fetched in this pass.

## 1. Verdict (inference)

A cyberpunk world is a medium-difficulty absorption if the first slice stays a street-level life in one city, and a hard one if it tries to include a navigable net, mind/body transfer and a live police system at once. Most of what makes the genre distinct is already close to the project's vocabulary: implants are making (BHR20), credit with dated terms is stated (ECR21), property has upkeep (ECR24), and identity is already split into carriers (IL1). What the engine most likely lacks (inferred, unchecked in code): (a) a shared budget that implants draw on and that costs something more than coin (humanity, essence, capacity, rejection drugs); (b) recurring monthly obligations that quietly drive the whole life loop (rent, lifestyle, immunosuppressants, debt); (c) a heat/pursuit state that is continuous and place-bound rather than a one-off event; (d) a second "place" (the net) with its own travel, danger and clock. The cheapest honest first slice is body budget + monthly obligations + fixer gigs; the net can start as a skill-gated action list on terminals and grow into a place later.

Project-side check: a docs-wide grep for "cyberpunk" found the north-star line (a one-line tech-world variant), BOOKSHELF_INSPIRATION, RESEARCH_IDLE_GAMES and this scout's sibling, docs/research/CYBERPUNK_COMMUNITY_SCOUT_2026-11-03.md (player/community leads, which also finds a wish for gradual, world-reactive cyberware costs). At this scout’s initial scan, no cyberpunk entry was found in USER_VISION, WORLD_CARDS or IDEA_INDEX beyond that variant lead. Later USER_VISION’s run-ending-threat section records the followup direction and its AD50adoption; this does not select a cyberpunkworld. The 2020 Empathy-zero takeover, Shadowrun's Essence-zero death and 2077's no-surrender police are secondary-reported source consequences; announcing pressure with usable exits is this scout’s proposed adaptation, not proof those sources supply every exit. ECR21 covers credit and debt only (its operative word is "hidden", see the 2026-11-03 note in DOMAIN_RULES), so these are not conflicts with it; they are high-dial settings under the RLEE proposal (RLEE10-RLEE13) and are not defaults here.

## 2. Per-source table of distinctive mechanisms

Light = rules-light (a number and a rule of thumb); Heavy = needs its own subsystem. Lists are what the sources do, including where they conflict with project ideas.

| Source | Premise | Protagonist life | Distinctive mechanisms | Weight | Friction with project ideas |
|---|---|---|---|---|---|
| Cyberpunk 2020 (tabletop) | Corp-dominated near future; players are edgy specialists in a city | Pick one of ten roles (rockerboy, solo, netrunner, nomad, fixer, media, tech, medtech, corpo, lawman); a Lifepath table generates history, goals and relationship hooks | Cyberware costs Humanity; every 10 lost removes 1 Empathy; at zero Empathy the character becomes the GM's NPC. Netrunning runs on a faster clock than physical combat (seconds vs 3-second rounds) and uses decks loaded with programs. One universal "attribute + skill + d10 vs difficulty" check | Humanity light (one counter); netrunning heavy | The zero-Empathy "character is taken away" ending is a hard terminal state in the source; ECR21 covers debt only, so here it is a high-dial, announced pressure event with exits (RLEE10-RLEE12 proposal), not a default ending |
| Cyberpunk RED (tabletop) | Post-collapse timeline, Night City, megacorps back in force; local networks instead of a global net | Roles with a Role Ability; monthly Lifestyle (food tier, Kibble up to fresh food) plus Housing; first month free; nonpayment means paying food daily or sleeping rough with a daily Endurance check; downtime "Hustle" roll tied to Role; fixers broker jobs | Price tiers (Cheap 10, Expensive 500, Super Luxury 10,000 eb) so GMs can price anything. Cyberware has a creation-time Humanity cost and a dice cost when installed later; a forum thread (unverified) says max Humanity drops per installed item and only comes back by removal; fan sources say that fashionware and medical-grade ware cost none, and that the book has therapy rules for regaining Humanity (details not confirmed). NET is a physical server with "floors"; ICE and Black ICE/Demons guard deeper floors; jacking out resets defenses; Interface rank sets NET actions per turn (Reddit comment, unverified) | Economy light; Humanity medium; NET heavy | Housing covered by an employer for executives is a nice mechanism; the collapse of the organ market (cloning is cheaper than storage) is a source claim about one world's economy, not a rule |
| Cyberpunk 2077 (game systems) | Night City, fixers hand out work, street cred gates access | Fixers assign gigs; side work builds Street Cred (cap reported as 50), which unlocks vendors, cyberware and further gigs; ripperdocs install ware; cars and a garage | 2.0 replaced the old cyberware load with a Cyberware Capacity budget raised by perks, leveling and shards; secondary sources disagree on whether going over capacity gives debuffs only or something stronger, and agree V does not go cyberpsycho. Police: a 5-level Heat meter, MaxTac at the top, no bribes or surrender accepted once caught, pursuit ends when you are out of sight. Braindance lets V live recorded memories | Capacity light (single budget); police medium; braindance heavy | A police force that never accepts bribes or surrender conflicts with the project's "no blanket never" line; it is a tuning of that city, so use default and dial |
| Shadowrun | Magic returned, metahumans, megacorps with extraterritoriality, AAA/AA/A ranking | Freelance deniable runners hired by fixers; no System Identification Number (SIN) means invisible to the system; lifestyle bought in monthly increments | Essence starts at 6, drops with cyberware/bioware/nanotech and weakens magic; zero is death (cybermancy can hold it off). Ware grades (alpha, beta, delta) trade nuyen for less Essence loss (4th-edition figures: alpha costs double, 0.8 of Essence; later grades not confirmed). Magic and ware compete for the same budget. Wireless or wired Matrix access, riggers feel vehicle damage as biofeedback. Fake SINs have ratings (fan source) | Essence light; Matrix and rigging heavy; lifestyle light | Essence-zero death is another hard cap; magic-vs-ware exclusion is the most project-relevant idea (two progression paths drawing on one body budget) |
| Deus Ex (2000 and Human Revolution) | Conspiracy-laden near future; nanotech or implant augmentation | Agent of a covert or corporate employer; rewards come from quests and exploration | 2000: augmentations come in canisters, one per body area, installed permanently, powered by a bio-energy meter refilled by cells; HR: Praxis kits unlock and tier up augs, some use an energy meter, and augmented people must keep taking Neuropozyne, a scarce expensive anti-rejection drug. Hacking is a node graph with a countdown once alerted. Dialogue is a risk/reward minigame helped by a social aug | Aug slots light; Neuropozyne is a cheap, strong upkeep hook; hacking light as a minigame | "Permanent install" and "one per body area" are source rules for those games; the project's AD38 would treat a better arrangement that works by mechanism as valid |
| Neuromancer / Sprawl | 1980s view of a 2030s network world; cyberspace entered through a neural link | Case is a hustler whose nervous system was damaged by an angry employer; his chance at a cure is a job that comes with a poison clock | Cyberspace as a place entered by jacking in; ICE as the term for defenses; constructs (stored personality copies, e.g. the ROM-based Dixie Flatline); AI under legal limits (Turing Registry); the plot's central tool is leverage via a ticking body hazard | Mostly narrative; leverage-by-body-hazard is light | The novel does not describe debts or clinics in the pages read; "debt-driven desperate work" is a reading, not a shown rule |
| Altered Carbon | Cortical stacks hold minds; bodies (sleeves) are swapped | Rich Meths live very long with remote backups; most people resleeve once or twice; criminals can be held "on stack" and their sleeves sold; Catholics refuse resleeving and so cannot testify after murder | Real death only if the stack is destroyed (energy weapon) and no backup exists. UN law bans running one mind in two sleeves. Wealth buys continuity (backups, new bodies); poverty means the body you can afford | Stack/sleeve ownership heavy; the wealth-buys-continuity rule is light | Dual-sleeve ban is a world law; the project's palette approach (default, dial, reason) lets other worlds permit it |
| Ghost in the Shell | Cyberbrains plug brains into networks; prosthetic bodies | A police task force handles political and net crime; protagonist is a full-prosthesis Major | Cyberbrain exposure: heavier cyberization makes a mind hackable, and the worst hackers can take over a person's actions (ghost hacking). The Puppet Master storyline explores identity of a created mind. Franchise-level identity questions are present but the page read did not define "ghost" | Exposure-by-augment light; mind-takeover heavy | Takeover of the player character is a loss-of-control event; fits the project's wrong-belief handling (AD7) only if the cost is shown |
| Blade Runner | Tyrell-made replicants as off-world labor; Nexus-6 given a four-year life | Blade runners hunt escaped replicants; the Voight-Kampff test measures empathy responses | Built-in lifespan clock; implanted memories (Rachael) so a person may not know they are not human; empathy as a test | Lifespan light; implanted memory medium | A fixed four-year clock is a limit stated as a number; the project prefers limits as adjectives with a per-world dial |
| Quantum Cultivation (Jace Kang; published novel/audiobook, not confirmed as a web serial) | Future Kyoto; enhanced XHumans have had the genes needed for cultivation edited out | Ken is an unmodified Purebred janitor; an old martial figure and a hacker who sees the net as feudal Japan help him cultivate | Cultivation (Five Elements, Eight Trigrams) beats implants in the long run because tech removed the potential; network seen through a cultural metaphor; class split between augmented and purebred | Cultivation path heavy, but the project already has cultivation worlds | Directly supports "two paths, one body budget" and "magic in a tech world is studied" lines already in the north star |
| The Heretic Peacekeeper (Jeremy Bai) | Dystopia dated 916 NE, layered "Nine Heavens and Ten Earths" separated by class and forcefields | Detective squeezed between illegal cultivators and a state hunter unit (Black Corps) | Cultivation as outlawed internal-energy martial practice policed by the state; class layers as physical barriers | Class strata medium | Review says little of the cultivation mechanics, so treat as setting only |
| Other hybrids seen only as listings | The Sun's Blood (noir post-apocalypse cultivation), Mask of Humanity (cyberpunk assassin reborn into cultivation), The Man with Iron Skin (cultivation as code-weaponized philosophy) | not read | not read | n/a | Listings only; no mechanics verified. No confirmed Chinese web-novel xianxia/cyberpunk crossover was found in this pass |

## 3. Mechanism palette (illustrative, not a spec)

Each row: mechanism, default, dial, reason. Codes are palette-local (CW = cyberpunk world).

### Body and augments

| Code | Mechanism | Default | Dial and reason |
|---|---|---|---|
| CW1 | One body budget that installs draw on (humanity, essence or capacity), with a cost kept separate from coin | A per-body pool that each implant reduces; shown in 2020/RED (Humanity), Shadowrun (Essence), 2077 (Capacity) | Pool size, whether it recovers, and what the low state does are set per world. The three sources disagree on what happens at the floor (NPC takeover, death, debuffs), which shows it is a dial |
| CW2 | Install cost has two parts: a first-time cost and a later-install cost | RED shows a smaller creation cost and a dice cost afterward (fan sources) | Dial: how quickly a body adapts; reason: installing at origin is cheaper than later surgery |
| CW3 | Grades of ware that trade price for less budget loss | Shadowrun grades; fashionware and medical-grade ware cost none in RED fan sources | Dial: how many grades a world has; reason: gives the rich a way to stay human and gives the poor a reason to take the cheap cost |
| CW4 | Rejection and upkeep as a clock | Deus Ex HR: a scarce drug taken to keep the body from rejecting implants | Dial: how often, how expensive, how scarce; reason: turns the implant into a recurring bill and a supply line |
| CW5 | Exposure grows with augmentation | Ghost in the Shell: heavy cyberization leaves a mind hackable | Dial: how exposed, to whom; reason: the implant lets others reach in |
| CW6 | Magic or cultivation shares the body budget with ware | Shadowrun (Essence weakens magic); Quantum Cultivation (tech removed the potential) | Dial: strong, weak or none per world; reason: makes the two progression paths trade off without a rule that forbids a mix |
| CW7 | Repair and parts for ware | Not mapped in the sources here beyond clinics and ripperdocs | Inferred: parts, maintenance and access to a doc are the natural grind |

### Net and hacking

| Code | Mechanism | Default | Dial and reason |
|---|---|---|---|
| CW8 | Hacking as terminal access on a node graph | Deus Ex: path of nodes with ratings and a countdown after alert | Dial: nodes per target, countdown length; reason: one reusable action |
| CW9 | The net as a place with floors, guard programs and a reset on exit | RED NET Architecture (floors, Black ICE, Demons, reset when you jack out) | Dial: how many floors; reason: fits a dungeon-like floor model if the engine has sites (SR rules) |
| CW10 | A faster clock inside the net than outside | 2020: seconds vs 3-second rounds | Dial: ratio; reason: lets a short net run sit inside a long day |
| CW11 | Defenses that act (ICE with turns, biofeedback to the body) | RED Black ICE; Shadowrun rigging biofeedback | Dial: harm to the body; reason: makes the net risky rather than free |
| CW12 | Personality copies and AIs as net inhabitants | Neuromancer constructs; AI legal limits | Default: a few exist, rare and legally constrained; dial: how many and who may run one; reason: gives the net companions and enemies |

### Economy and debt

| Code | Mechanism | Default | Dial and reason |
|---|---|---|---|
| CW13 | Price tiers instead of item-by-item prices | RED eight tiers with round numbers | Dial: tier floors; reason: prices new things without a table |
| CW14 | Monthly lifestyle and housing as the main outflow | RED (food tier plus housing, nonpayment means rough sleeping and daily Endurance checks); Shadowrun monthly lifestyle | Dial: tiers and what a missed month does; reason: the recurring bill is the life loop, and ECR21 already requires forgiving defaults |
| CW15 | Housing capacity lets friends split rent | RED beds per dwelling | Dial: beds, security, night attacks; reason: ties money to relationships |
| CW16 | Employer-provided housing | RED executives; upgrades with Teamwork Level | Dial: ties to corp rank; reason: corp life trades freedom for security |
| CW17 | Hustle between jobs | RED 1d6 table by Role after seven free days | Dial: how many free days; reason: gives downtime income that scales with the role skill |
| CW18 | Loot and cyberware resale | RED: ware can be sold; organ market weak because cloning is cheaper | Dial: market depth; reason: shows an economy that reacts to technology |
| CW19 | Street cred as a gate to vendors and gigs | 2077 | Dial: cap and decay; reason: reputation as unlock |

### Factions and heat

| Code | Mechanism | Default | Dial and reason |
|---|---|---|---|
| CW20 | Fixers as brokers who hold the jobs | 2020/RED/2077/Shadowrun all use them | Dial: how many; reason: one hub per district gives relationship-driven work |
| CW21 | Corp ranking and extraterritoriality | Shadowrun AAA/AA/A, Corporate Court; land of a corp is sovereign | Dial: how many corps; reason: corporations act as hubs (the north star already says this) |
| CW22 | Heat as a continuous pursuit state | 2077 5-level meter, MaxTac at top, ends when out of sight | Dial: levels, bribe/surrender allowed or not; reason: continuous pressure rather than a fight |
| CW23 | Deniability as the service | Shadowrun runners hired so the client cannot be tied | Dial: how much; reason: pay is tied to the risk of being traced |
| CW24 | Class strata | Heretic Peacekeeper layered society with forcefields; Deus Ex augmented elite | Dial: barrier hardness; reason: space itself gates the life |

### Identity

| Code | Mechanism | Default | Dial and reason |
|---|---|---|---|
| CW25 | System identity and its absence | Shadowrun SIN; fake SINs with ratings (fan source) | Default: lacking a record gates banks, housing and licenses; dial: how many services check it, and how well a forged rating passes; reason: the record is the key to ordinary life |
| CW26 | Mind storage, backups and sleeves | Altered Carbon | Dial: who can afford it, legal limits, real-death rule; reason: wealth buys continuity |
| CW27 | Implanted or edited memory | Blade Runner Rachael; Neuromancer constructs | Dial: detection; reason: the character may hold a wrong belief (AD7) |
| CW28 | Empathy or human-ness as a measured trait | Voight-Kampff; Empathy stat in 2020 | Dial: who measures; reason: a test can gate access |
| CW29 | Lifespan clock | Blade Runner four-year limit | Dial: length, whether it can be extended; reason: forces choices without a hard "once" |

### Daily-life loop

| Code | Mechanism | Default | Dial and reason |
|---|---|---|---|
| CW30 | Lifepath generated start | 2020/RED | Dial: how many hooks become live relationships; reason: relationship seeds from day one |
| CW31 | Role Ability as the lens for earning | RED | Dial: one per life; reason: the same hustle table yields different jobs |
| CW32 | Drugs and stims as consumed items | Neuropozyne (shown); other drugs recalled only | Dial: addiction; reason: already a project consumable row |
| CW33 | Vehicles as a garage with uses | 2077 garage and driving; Shadowrun riggers merge with vehicles | Dial: ownership upkeep; reason: nomads and runners need transport |
| CW34 | Braindance as recorded experience | 2077 | Dial: access and legality; reason: sells experience as a good and gives evidence a form |

### Pressure events that try to end the run (candidate mechanism, 2026-11-03)

Source: Weibao's idea (USER_VISION, "Run-ending threats a capable character can use"): events can try to end the run, and a capable enough character can use them to its advantage. The subsequent general threat-as-lever direction is accepted as AD50, with RLEE10–RLEE13as detail in RELATIONSHIPS_AND_CANON_CONSIDERATIONS; CW35–CW37specific adaptations remain proposals. Lore evidence is in docs/research/END_RUN_THREATS_LORE_SWEEP_2026-11-03.md.

| Code | Mechanism | Default | Dial and reason |
|---|---|---|---|
| CW35 | Cyberpsychosis as a rising pressure event | Warning signs from the humanity or Empathy meter (CW1, CW28); a capable character with a medtech contact, the right drugs or a handler rides it, channels it into a scene (a frenzy used as a weapon, a lost week that shakes a tail), or sells it as a rumor; a weak one loses a scene, not the run | Dial: how far the full takeover (Cyberpunk 2020's zero Empathy) sits above the near-end; reason: community asks that the player be able to tip over without a binary switch (community scout, theme 2) |
| CW36 | Debt collectors and corp hits as an event with exits | Announced by the lender or fixer; exits: pay down, negotiate, flip the collector's boss, go dark under a new identity (CW25), or let the old life be taken and continue as an heir | Dial: severity and number of exits; reason: ECR21 requires dated terms and forgiving defaults for debt, and exits are what make the threat playable |
| CW37 | Identity burn with retire-and-inherit | A burned identity or a retirement is a chosen end that hands a legacy to an heir or a new sleeve (CW26) | Dial: what carries (GTR28, ECR28); reason: Idlepunk-style short runs with inheritance (community scout, section 3) |

## 4. Engine-fit gaps

Project vocabulary: skills, crafting/making, relationships, factions/organizations, time/clocks, economy. Labels: shown (a source), stated (project docs), inferred (my reading; no code checked).

| Gap | What is needed | Label and evidence |
|---|---|---|
| G1 Body budget pool | A per-body pool drained by installs, with a separate recovery rule | Shown: 2020, RED, Shadowrun, 2077. Stated: BHR20 says implants use making rules and the result is a condition with maker and provenance. Inferred: a shared pool across many implants and its low-state effect may not exist |
| G2 Install risk and later-install cost | Install event with first-time vs later cost and a chance of harm | Shown: RED (fan sources). Stated: BHR20. Inferred: no dedicated surgery flow |
| G3 Rejection and drug upkeep | Recurring cost to keep a body stable | Shown: Deus Ex HR Neuropozyne. Stated: SELVES_AND_ECHOES lists consumed items with addiction; north star "dependency and addiction". Inferred: a clock that stops the body working when the supply stops |
| G4 Monthly obligations | Rent, lifestyle tier, and consequences of missing them | Shown: RED, Shadowrun. Stated: ECR24 (property has upkeep and income), ECR21 (dated credit terms, forgiving defaults); S19 (clocks and recurring windows, `src/world_rhythm.js`) is the natural home. Inferred: a monthly bill wired to the life loop may not exist |
| G5 Heat | Continuous pursuit state by place | Shown: 2077. Stated: CHARACTERS_AND_WORLD_EVENTS has an occurrence, observation, report, response chain. Also stated: docs/ENCOUNTERS_AND_PURSUIT.md describes an implemented encounter/pursuit increment whose triggers include witnessing an offense, theft and debt (proposed content). Inferred: a visible per-district meter and an escalation ladder are not described in what I read |
| G6 Surveillance | Records and cameras as observation, tied to identity | Shown: Shadowrun SIN, GITS. Stated: the observation chain above, ECR17 (wealth is information). Inferred: automated omniscient observation is a new kind of observer |
| G7 Net as a place | Floors, guard programs, reset on exit, a faster clock | Shown: RED NET, 2020, Neuromancer. Stated: sites and exploration rules (SR1-SR24) and clocks (AD15-AD17). Inferred: a second travel layer is a new world type |
| G8 Hacking minigame or action | Node path with countdown | Shown: Deus Ex. Stated: SKILLS_AND_TALENTS lists hacking under engineering/programming as a skill family (one table row). Inferred: can start as a skill-gated action; no hacking action or minigame was searched for in code |
| G9 Identity swap and backups | Move a mind to a different body, with an identity carrier | Shown: Altered Carbon, GITS. Stated: IL1 (identity is not one resource), SELVES_AND_ECHOES, S14 lives and continuation. Inferred: this is the most expensive gap if mind storage must be playable |
| G10 Fake or absent ID | An identity record with a rating, bought or forged | Shown: Shadowrun (fan source). Stated: ECR23 (fraud writes wrong beliefs). Inferred: no ID records as gating objects |
| G11 Reputation with gates | Street cred and per-faction standing unlocking vendors and gigs | Shown: 2077. Stated: S5 titles and faction rank, ECR3 (price rising with reputation). Inferred: likely buildable; wiring to vendors and gigs is the work |
| G12 Gigs from a broker | A fixer who offers jobs scaled to standing | Shown: all four tabletop and game sources. Stated: jobs and opportunities in the expansion engine (S11). Inferred: broker as a person with their own cut and heat |
| G13 Vehicles | Owned vehicle with a garage and use | Shown: 2077, Shadowrun. Stated: not checked (a grep for vehicle/garage hit several docs I did not open). Inferred: probably thin |
| G14 Memory as media | Recorded experience as an item | Shown: 2077 braindance. Stated: S13 knowledge and sealed truth (adjacent). Inferred: needs an item that carries observations |
| G15 Mind takeover | Another agent controls the character for a time | Shown: GITS, 2020 (NPC takeover). Stated: not checked (a grep for possess/mind control/puppet hit combat, power and intro docs I did not open). Inferred: needs a pause-and-continue rule that respects the player |

## 5. Five candidate "different lives"

Each is a proposal, with one distinguishing loop, and the default and dial in the project's form.

1. **Fixer.** Loop: hold a client list, match jobs to runners, take a cut, and manage a standing that falls if a job traces back to you. Default: income scales with the number of live relationships; dial: how often a client's risk lands on the fixer; reason: the sources treat the fixer as the hub of work.
2. **Street doc (ripperdoc).** Loop: install and repair ware for people who cannot afford the corporate clinic, source parts and drugs, and keep patients alive past their rejection clock. Default: each patient is a recurring bill and relationship; dial: parts scarcity; reason: ties directly to BHR20 and the Neuropozyne idea.
3. **Netrunner.** Loop: scout a target's access points, run a short timed intrusion, extract, and return to a body that was left exposed. Default: runs are short and sit inside the day; dial: floors and countdown; reason: RED and Deus Ex give the two shapes (place vs minigame).
4. **Corp drone.** Loop: keep a rank ladder, housing covered by the company, and a clean ID in exchange for surveillance and a contract that restricts side work. Default: stability buys safety; dial: how tight the contract is; reason: RED executives' company housing and Shadowrun SIN-bound life are the contrast to runners.
5. **Nomad.** Loop: keep vehicles and a family convoy running, trade across territory, and defend routes where police and corps do not reach. Default: vehicle upkeep and route heat drive the loop; dial: size of convoy; reason: nomad is one of the ten 2020 roles and vehicle play is shown in 2077 and Shadowrun rigging. Evidence here is thin: the sources read gave no nomad mechanics beyond the role name and the vehicle systems.

## 6. Source links

- Cyberpunk RED / 2020: https://en.wikipedia.org/wiki/Cyberpunk_Red ; https://en.wikipedia.org/wiki/Cyberpunk_(role-playing_game) ; economy: https://rtalsoriangames.com/2020/11/06/cyberpunk-red-alert-the-economy/ ; Humanity, fashionware and medical-grade ware via search results: https://fantasygroundsunity.atlassian.net/wiki/spaces/FGCP/pages/2140766288/Cyberpunk+RED+Cyberware ; https://www.fantasygrounds.com/forums/archive/index.php/t-78309.html ; https://foundryvtt.com/packages/cpr-cyberpsychosis ; NET Architecture summary (page itself returned 402): https://cyberpunk.fandom.com/wiki/NET_Architecture
- Cyberpunk 2077: https://en.wikipedia.org/wiki/Cyberpunk_2077 ; 2.0 police: https://cyberpunk.net/en/news/48766/whats-coming-in-update-2-0-revamped-police ; capacity and cyberpsychosis summaries (secondary, pages returned 403 so only search snippets were read): https://primagames.com/tips/how-to-increase-cyberware-capacity-in-cyberpunk-2077-2-0 ; https://progameguides.com/cyberpunk-2077/how-cyberpsychosis-works-in-cyberpunk-2077-2-0/ ; street cred: https://www.pcgamesn.com/cyberpunk-2077/street-cred
- Shadowrun: https://en.wikipedia.org/wiki/Shadowrun ; 4th-edition Essence/grade/lifestyle snippets: https://gitea-lukarin.duckdns.org/lukas/server-admin-panel/media/branch/feature/move-to-svelte/assets/shadowrun/Shadowrun-4E-Corebook-p86.pdf (only the search snippet was read, not the page)
- Deus Ex: https://en.wikipedia.org/wiki/Deus_Ex_(video_game) ; https://en.wikipedia.org/wiki/Deus_Ex:_Human_Revolution
- Neuromancer: https://en.wikipedia.org/wiki/Neuromancer
- Altered Carbon: https://en.wikipedia.org/wiki/Altered_Carbon
- Ghost in the Shell: https://en.wikipedia.org/wiki/Ghost_in_the_Shell
- Blade Runner: https://en.wikipedia.org/wiki/Blade_Runner
- Hybrids: https://indiestorygeek.com/story/928 ; https://tantor.com/quantum-cultivation-jace-kang.html (page failed; used the search listing) ; https://fantasy-faction.com/?p=45494 ; listing-only: https://rankscroll.com/series/mask-of-humanity ; https://elevenreader.io/audiobooks/the-man-with-iron-skin-book-one/JqMSAPrWYEE0ZnFglyPt

Project docs consulted: docs/systems/README.md, docs/LIFE_SIM_NORTH_STAR.md (line 1629, "cyberpunk megacity with corporations as hubs"), docs/WORLD_RULE_GRAMMARS_AND_DERIVED_DETAIL_2026-10-19.md (DG-A to DG-D), docs/DOMAIN_RULES.md (BHR20, ECR17 to ECR24), docs/worlds/IDENTITY_LAWS_BY_WORLD_2026-10-14.md (IL1), docs/SELVES_AND_ECHOES.md.

## Open gaps in this pass

Not read: the Cyberpunk RED and Shadowrun 6th-edition rulebooks themselves (therapy rules, exact costs, SR6 lifestyle and SIN rules), 2077 Heat thresholds, Vik and ripperdoc rules, Shadowrun contacts and Edge (recalled, not fetched), Neuromancer debt and clinic detail, Deus Ex original augmentation count beyond the first page of text. A grammar-style derivation (DG9 format) was not attempted because no source was read in full.


## Content reconciliation B620: authority and source boundaries

F1: Full158-line cyberpunk world scout actualcontent reviewed, recovering initial truncated output with bounded1–45/46–100/101–158and141–158reads. All12source rows including listing-only hybrids, CW1–CW37palette, G1–G15engine-fit rows, fivecandidate lives, complete links/project-inputs and explicit unreadgaps were read. Every missing-engine statement was inferred without codeinspection in that originalpass; a grep hit/absence, summarizingfetch, searchsnippet, forumrule, blockedpage, recollection or listing does not become primary source/full-book/current engine evidence. No referenced web/PDF/rulebook page or new source body is opened here; historical observations stay historical, not present factual recommendations.

F2: Later USER_VISION7242–7247records the user’s followup instruction and AD50adoption built on AD5/AD38/AD22/AD6; RLEE10–RLEE13are its detail, adjustable exact agent wording remains distinct. The scout’s no-user-entry scan/proposal-only threat classification is therefore dated and now points to that successor. This accepts the general means-based threat-as-lever direction, not the37cyberpunk examples, a selected new world, mandatory net/implants/debt systems or any current buildorder. Actual working exits are a floor, not a closedlist or guaranteed rescue; capabilities can exploit threats without invented balancing tax. ECR21stays a credit/debt rule, not universalpermission for every lethal outcome.

F3: Keep capacity headroom, currentHumanity, maximumHumanity, Empathy, Essence/magicpotential, install origin/latercost, ongoing rejection-drug supply and existing bodycondition independent. The same body can host overlapping constraints without all values becoming onepool or mandatoryincompatibility. Shadowrunedition/RED/2020/2077patch/source-specific choices differ; exactmedicalware/therapy/grade/NET/reset/cost/heat/statcap claims are illustrative secondary evidence pending selected primaryquestion. DeusEx2000/HR, sourceplayerexceptions, novels/TV/franchisecontinuities must not blend. Price-tier convenience does not prove a live market, and an organ-economy claim is not everyworldeconomics.

F4: A camera/record service is an actualobserver with coverage/reach/custody/timestamp/retention/inference limits, not automaticallyomniscient; occurrence, observation, report, identity attribution and response remain separate. A net can be a site/traversal layer with supported clocks/remote-body exposure rather than necessarily a new worldtype. Mindtakeover/command agency/bodycontrol differs from AD7wrongbelief; disclosure alone does not implement control continuity. An exact locally sourcedfouryearlifespan or statutorytwo-sleeve ban need not conflict with default/dial/reason framing; actual law/biology/exceptions can be modeled without inventing a new absolutism or deleting the number.

F5: Preserve distinct fixer brokerage/actualcut and traceability, streetdoc parts/diagnosis/willingpatients/upkeep, netrunner actualaccess/time/bodyrisk, employeehousing/contract and nomad actualconvoy/route/vehicle loop. Thin nomadmechanics/source-level uncertainty remain explicit. Broker/reputation/ID/vehicle/memorymedia/remoteplace/genericmaking support need current producer/state/consumer checks before missing-system claims. No generalpublickarma, globalpoliceheat, magicalmedicalcertificate, obligatoryrentfor everylife, automaticgangretaliation, shortcampaign or forcedheir/sleeve continuation is adopted. Current PROJECTKlein/HPand Frontier/Mistglasshold govern. ActualAD50does not dispatch a world; sourcefacts and proposedadaptation exits remain separate. No current sourcecode/body/rulebookread, externalfetch, acquisition, worker, game/runtime/save/test/build/browser, deletion/move, commit/push occurs.
