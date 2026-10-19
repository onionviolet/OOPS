# Titles: power, achievement and more, and why it matters dependingly (2026-10-13)

> Code namespace 2026-10-19 (no codes renamed): SU rows here are local to this part; SU3 is also defined in NONHUMAN_SENSES_SCALE_AND_UI, skyrim/SOURCE_LEDGER and parts 06 and 21. Outside this file cite `24_TITLES#SU3`. See [reserved prefixes](../../RULES_INDEX.md#reserved-prefixes-2026-10-19).

Weibao (2026-10-13): "Titles can be power, achievement, and much more, and it matters dependingly? More to consider?"

Proposals only. Nothing here is accepted. Rows follow Default + Dial + Reasonably. Franchise facts are general knowledge unless a repo file is cited. Sealed secrets are referred to by ID only.

What this pass adds beyond existing docs: part 21 treats a title as one of six renown words (RN1) and suggests an audience line (SU1). Part 18 rejects auto-equip (PN4). Part 13 has True Names (EW33). This file is about the title itself: its kinds, its readers, its mechanics and its per-world native form. It does not repeat the RW2 renown rows in part 21; it builds on them.

Read for this pass: `src/titles.js`, `src/titles_ui.js`, every grep reader of titles, parts 13, 15, 17, 18, 21 and 22, G8 micro (`docs/gm/dispatch/idea-expansion-2026-10-11/micro/REPORT.md`), `docs/SKILLS_AND_TALENTS.md`, `docs/CHEAT_LIBRARY.md`, `docs/RESEARCH_LITRPG_SYSTEMS.md`, `docs/RIVALS_IDENTITIES_AND_FATE.md`, `docs/worlds/original-frontier/CAMPAIGN.md`.

## 1. Code today (X)

| Code | Consideration | Why it matters |
|---|---|---|
| X1 | **Two title owners exist and do not meet.** Native lifetime titles: `character.titles` as `{id: {at}}` (`src/titles.js:2`, `src/models/hero.js:30`), saved at `src/main.js:4938`, loaded at `:5348`. Simulation titles: `s.titles[actor][id] = {issuer, worldId, cause, at}` with grant and remove (`src/simulation_effects.js:358-360`, contract `src/simulation_contracts.js:74`, shape `:218`). G8 F3 already names this split (`micro/REPORT.md:17`). | The simulation owner already has the fields a social title needs (issuer, world, cause, removal). The native owner has the panel and the bonus. Any "title that matters dependingly" chooses a bridge, not a third owner. |
| X2 | **Native titles are 27 counter thresholds in four families** (`src/titles.js:5-38`), granted every 5 s by `refresh_titles` (`src/main.js` function `refresh_titles`; the cited `:7665` to `:8095` anchors predate 2026-10-19 drift) over counters derived from saved state (`:7674-7695`), and back-filled silently on load (`:8095`). | Pure achievement record. No issuer, no witness, no world, no audience. |
| X3 | **Bonuses are derived, never stored**: `titleBonuses` sums flats, multiplies multipliers and XP multipliers (`src/titles.js:81-91`); `Hero.setTitleBonus` writes them into a dedicated `titles` slot (`src/models/hero.js:95-103`, slots at `src/models/stat_haver.js:56`, `:67`), and XP reads it at `src/models/person.js:643`. | Power titles already work, at a small scale (1 to 3 percent). Every held title applies at once: there is no worn title, no conflict and no context. |
| X4 | **Simulation titles expose a fact and nothing else.** Each held id becomes `facts["title.<id>"] = true` (`src/simulation_effects.js:129`). A grep of `src/`, `stories/` and `private_packs/` found no authored effect that grants a simulation title. | The issuer-aware owner is a live contract with zero content. The first authored office or epithet would be its first proof. |
| X5 | **No removal path for native titles.** `grantEarnedTitles` only adds (`src/titles.js:74-78`); G8 F3 notes no inspected removal or hidden policy. | Revocable offices, stripped ranks and decaying epithets cannot live in the native owner as is. They fit X1's simulation owner. |
| X6 | **The panel shows everything.** `titleView` lists every catalog row with name, text, bonus and progress (`src/titles.js:106-111`); the UI renders locked rows with their exact goal (`src/titles_ui.js:19-22`). | Fine for achievements. Wrong for a secret title, a brand or a sealed-route title: the locked row would spoil it. A `hidden` display rule is needed before any such title is authored (G8 MICRO-P2, `micro/REPORT.md:83`). |
| X7 | **"Years" counts from a fixed date, not the character's birth.** `TITLE_START` is 999-04-01 (`src/titles.js:3`, `:45-48`); G8 F5 flags it (`micro/REPORT.md:19`). | A later-era start, an heir or another world's calendar would earn or miss Settled In and Old Hand for the wrong reason. Per-world or per-life anchors need a life-start field. |
| X8 | **Heirs drop native titles.** `buildLifeHeirSave` copies only time, NPC lives, options and life record into a fresh envelope (`src/life_experience_host.js:8-25`, part 17 line 20). | A parent's titles vanish with them. Part 21 SU5 suggests a nickname line; carrying a hereditary title needs an explicit policy, not silent loss. |
| X9 | **Old boolean title records are dropped on load (inferred).** `normalizeTitles` keeps a record only if it is an object (`src/titles.js:59-66`); the v0.6 fixture saves `titles: {surveyor: true}` (`tests/v06_migration.test.js:7`). The comment at `:56` says unknown ids are kept. | Small mismatch between comment and code. Harmless today (no catalog id `surveyor`), but worth a look before titles cross saves or worlds. Not run, read only. |
| X10 | **Design docs already lean "title is social first".** `docs/SKILLS_AND_TALENTS.md:44`, `:54` ("A title is a social fact first. Effects are optional per world"); Village campaign says titles are optional observed recognition, not a second XP currency (`docs/worlds/original-frontier/CAMPAIGN.md:71`, `:253`); part 10 IN5 says a title alone grants nothing (`10_FULL_WORLD_METHOD.md:126`). | Reported as found: these sit beside native titles that do grant XP bonuses (X3) and Weibao's "titles can be power". TK and TD below treat power as a per-world dial, so both readings stay reachable. |

## 2. What a title can be (TK)

Each kind lists: who grants it, who can see it, what it does, how it is lost.

| Code | Consideration | Why it matters |
|---|---|---|
| TK1 | **Achievement record.** Granted by the game (a counter, X2). Seen by the player; NPCs only if a witness or a record channel exists (part 21 RN5). Does: a small bonus or nothing, plus a biography line. Lost: by default not lost; dial a "practice" tag that marks hall-earned ones lighter (`01_HOME_AND_HUBS.md:85`, `:116`). | The native base. Everything else here is a layer on top. |
| TK2 | **Power title (LitRPG).** Granted by a system or world law at a deed (`docs/SKILLS_AND_TALENTS.md:500` G18, `:576` G30). Seen by anyone who can read status in that world. Does: stats, a skill, a new action, a resistance. Lost: when the system that granted it does not reach (off-world), or by a rule the title states. | The "titles can be power" reading. Reasonably: the power belongs to the granting system, so it can switch off in a world without one. |
| TK3 | **Office or rank.** Granted by an institution (guild, army, Ministry, church, faction). Seen by members and anyone who checks the roll. Does: authority, pay, access, duties and orders (`docs/RIVALS_IDENTITIES_AND_FATE.md:146`, `:186`). Lost: revoked, resigned, term ends, the institution falls. | Fits X1's simulation owner exactly: issuer plus remove. A revoked office leaves a "former" record (TM10). |
| TK4 | **Noble or hereditary title.** Granted by a crown or a line of succession. Seen by everyone in that realm's society; meaningless in many others. Does: land, income, precedence, obligations, enemies. Lost: attainder, a lost succession contest, a revolution, abdication. Passes: to an heir by the realm's rule. | The one kind built to cross lives (X8). Dial: whether an heir inherits title, debt, or both. |
| TK5 | **Epithet given by people.** Granted by an audience, not an authority: "the Butcher", "Kettle-boy". Seen by that audience, spreads by carriers (part 21 RN3, RN5). Does: shapes greetings, prices, who seeks you out. Lost: fades if unrepeated; replaced by a louder one. Variants: earned, mocking, ironic (the coward called "Brave"), false (credited for someone else's deed, RN4). | The most "dependingly" kind: you do not choose it and different towns may give you different ones. |
| TK6 | **Secret or hidden title.** Granted by a hidden order, a god, a sealed truth. Seen only by insiders or a specific sense. Does: lets insiders recognize you, opens hidden doors. Lost: expelled, the order dies, exposure turns it into a brand. | Needs X6's hidden display rule. A sealed-route title shows as an unnamed slot until its discovery route, never its truth. |
| TK7 | **Curse or brand.** Granted by an enemy, a court, a god or the deed itself (kinslayer, oathbreaker, marked). Seen by those with the sense or the law to read it, sometimes by everyone. Does: penalties, hunters, refused service, sometimes a dark perk. Lost: atonement, a cure, a pardon, outliving everyone who reads it. | Titles do not have to be good. A brand is a title the player would remove if they could, which gives a quest. |
| TK8 | **System-assigned label.** Granted by an in-world system or administration: a class tag, a threat level, an ID category, a purity grade. Seen by whoever reads the system. Does: sorts you into treatment. Lost: reassessment, fraud, the system going down. | Distinct from TK2: it is a label about you, not a power for you. TTKS B4 purity and B5 inspection fit here (TW rows). |
| TK9 | **Religious or mythic name.** Granted by a god, a rite or a spell; includes true names and honorific names. Seen by the divine or the initiated. Does: power and also exposure: knowing it lets others reach or command you (EW33, `13_EARNED_OPTIONS_AND_CHEATS.md:142`; part 21 RW2-LM1, RW2-SS1). Lost: rarely; a god's death, a name burned out. | The kind where the title is both a key and a leash. |
| TK10 | **Alias.** Granted by yourself. Seen by whoever meets that face. Does: carries its own renown rows (part 21 RN9). Lost: unmasked, abandoned, stolen by an impostor (part 21 OS2-6). | A self-issued title. It is the cheapest way to have a second reputation. |
| TK11 | **Job class.** Granted by a system, a school or a guild exam. Seen by status readers or by how you work. Does: shapes skill growth and actions. Lost: reclassing, prestige, a broken vow. | Overlaps TK2 and TK3. Kept separate because many worlds treat class as what you are, not what you did. |
| TK12 | **Honorific.** Granted by custom: Master, Doctor, Professor, Elder, Sensei, Sir. Seen by everyone using the address. Does: changes how NPCs speak to you, who defers, who resents. Lost: by social fall, or by moving where the honorific means nothing. | Pure dialogue texture with real effect: a "Professor" gets library access without asking. |
| TK13 | **Title as a debt or duty.** Granted by a patron, an oath, an inheritance with strings (RIVALS `:110`: "a title may grant power while binding conduct"). Seen by the creditor and anyone the duty touches. Does: power or status while the duty is kept; a penalty when broken. Lost: fulfilled, renegotiated, transferred, defaulted. | Makes a title a contract. Good late-game content: the strong returning character holds titles that keep calling on them. |
| TK14 | **Record or first.** "First to climb", "fastest clear", "last survivor". Granted by a ledger. Seen by readers of that ledger. Does: renown and a target on your back. Lost: a rival breaks the record; dial: the historical first stays while "current holder" moves (`docs/RESEARCH_LITRPG_SYSTEMS.md:488`). | Splits "first ever" (permanent) from "best now" (contestable), which keeps fairness with rivals. |
| TK15 | **Borrowed or proxy title.** "Envoy of X", "Hand of the King", "acting captain". Granted by someone else's authority for a task. Seen by those who honor the lender. Does: their weight in your mouth. Lost: task ends, lender dies or disowns you. | Lets a low-level character speak with high authority for a while, with the lender's enemies included. |
| TK16 | **Relation title.** "Ward of", "apprentice to", "chosen of", "consort", "sworn sibling". Granted by a person. Seen by their circle. Does: borrowed protection, borrowed enemies (part 21 RW2-SS3). Lost: the bond breaks. | Bridges titles and relationships (part 20) without a new system. |
| TK17 | **Joke title that turns real.** A silly counter title whose name is literal in another world (part 15 HF15). Granted by the game. Seen by the player. Does: nothing, until the other world reads it. | Long-horizon hint carried by the cheapest kind (TK1). |

## 3. It matters dependingly (TD)

| Code | Consideration | Why it matters |
|---|---|---|
| TD1 | **A title has a value per reader, not one value.** Default: each title row carries reader rules: audience, stance (respect, fear, contempt, indifference, hostility, legal ban), and which effect that stance has. Dial: how many readers a world authors. Reasonably: unauthored readers default to "never heard of it". | The core of "dependingly". Dragon Slayer: respected in the burned town, feared by the dragon-cult village, illegal where dragons are protected, worthless off-world. |
| TD2 | **Four reader axes.** Default: world (whose law), observer (who exactly), place (which town or institution), time (which era, before or after a scandal). Dial per title: which axes it cares about. | Keeps the model small. Most titles need one axis; a few need all four. |
| TD3 | **Off-world worth.** Default: an office or noble title is worth nothing where its issuer is unknown; an achievement keeps its bonus only if the game, not a world, granted it; a power title depends on the granting system reaching that world (TK2). Dial: a few universal titles (multiverse records, TK14). | Answers "does my D&D knighthood count at Hogwarts?" honestly: as a story, not as rank. |
| TD4 | **Same deed, opposite titles.** Default: two factions name one deed differently (liberator and traitor, Order of Merlin and Undesirable). Each audience holds its own title for you. | Makes a single act read differently by where you stand, without random noise. |
| TD5 | **Prices.** Default: a respected title shaves margins with the audience that respects it; a feared one raises some prices (protection money stops) and lowers others (merchants rush you out); a banned one refuses service. Reuses the reputation-margin formula (`src/components/trader_component.js:141-146`, part 21 X5) per audience. | One existing formula gives titles a felt economic effect. Needs part 21 X6's floor before any negative reader. |
| TD6 | **Access.** Default: some doors read titles: guild halls, restricted sections, war councils, temples. Dial: whether a door checks the title or just your claim to it (TM9 fakes). | Turns a title into a key, which is how offices and honorifics actually work. |
| TD7 | **Dialogue.** Default: NPCs address you by the title their audience uses (TK12) and pick lines by stance. Dial: how often the title is spoken. Reuses `display_conditions` (part 21 SU3). | The cheapest visible "it matters". Hearing "Slayer" in one town and "that butcher" in the next is the whole idea in two lines. |
| TD8 | **Danger.** Default: some titles attract challengers, hunters or attention from above (TK9; part 21 RW2-LM1). Dial: per world how loud a title is. Reasonably: being unknown is safety in some worlds. | Makes "hide your title" a real choice with a cost (lost respect, lost access). |
| TD9 | **Renown interplay.** Default: a title is a label; renown is how far it is known (part 21 RN1). A title held with zero renown does nothing socially until a carrier spreads it. Dial: issuing bodies that announce titles (a gazette, a ceremony) seed renown at once. | Prevents the title and renown systems from double-counting. |
| TD10 | **Time changes the reading.** Default: a title's stance can flip after an event (a war ends, a regime changes, a scandal breaks). An old title becomes nostalgic, embarrassing or criminal. | A strong returning character finds their old titles re-read by a new era (part 21 RC8). |
| TD11 | **Who saw it decides who honors it.** Default: a counter title (TK1) has no witnesses until it is witnessed; a witnessed receipt (`src/observation_channels.js:53`, `:132`, part 21 X11) lets an audience grant an epithet (TK5). | Turns private achievements into public titles through an existing building block, not a reward table. |
| TD12 | **Self-view versus world-view.** Default: the panel shows the titles you hold; a second view, "what they call you here", shows the local readings. Dial: the second view needs a skill or a friend to tell you. | The player can hold a title nobody here respects, or be called something they never earned. Both are honest states. |
| TD13 | **Titles that read you back.** Default: some institutions check whether you still meet a title's standard (a knight who stops serving, a prefect who breaks rules). Dial: how often they check. | Gives offices a living cost and makes revocation (TK3) a consequence, not a random event. |

## 4. Title mechanics (TM)

| Code | Consideration | Why it matters |
|---|---|---|
| TM1 | **Held is not worn.** Default: the collection keeps every held title; one worn title is shown by choice (part 18 PN4 rejects auto-equip, `18_PROTO23_ABSORB.md:96`). Dial: whether a world reads the worn title, all titles, or only the ones it knows. | Separates collection from identity, which also lets "what to show" become a choice. |
| TM2 | **Wear per audience.** Default: a small set of presets (formal, street, guild, hidden) choose which title shows where. Dial: per-world defaults so a new player never manages it. | "Choose what to show per audience" with no micromanagement. |
| TM3 | **Effects by kind, not all at once.** Default: achievement bonuses stay always-on and small (X3); power titles apply in their system's reach; office effects apply while the office holds; epithets have social effects only. Dial: a world can make the worn title the only active power title. | Keeps X3's derived model and avoids stacking dozens of bonuses as the catalog grows. |
| TM4 | **Conflicts.** Default: a few pairs exclude each other socially (holy knight and branded heretic, guard captain and gang name); holding both is allowed, being seen with both triggers a reaction. Dial: hard exclusions only where a world's lore says so. | Matches RIVALS `:154` (identities stack and conflict, no universal one-slot rule). |
| TM5 | **Stacking and tiers.** Default: a family ladder (Hunter, Slayer, Scourge) shows the top earned rung as the name, with lower rungs kept as history. Bonuses of a ladder stack as today. Dial: replace-on-upgrade for worlds where a rank supersedes. | Small UI fix with no save change: the save already holds each rung by id. |
| TM6 | **Evolution.** Default: a title can grow (Apprentice to Journeyman to Master) or decay (Champion to Former Champion) by a rule in its row: more deeds, time unused, a rival's rise. Dial: decay off for achievements. | "Titles that grow or decay" without a new owner: a decayed form is a new id in the same family. |
| TM7 | **Carried across lives.** Default: achievements are profile records (kept); hereditary titles pass by the realm's rule (TK4); epithets survive as the parent's name in the heir's world (part 21 SU5); offices end at death. Dial: an heir can disown the name. Fixes X8 with an explicit policy. | One rule per kind is clearer than one rule for all titles. |
| TM8 | **Carried across worlds.** Default: titles travel as records; their effects re-evaluate in the new world (TD3). A title can also be re-issued natively (the local guild recognizes a foreign master after a test). | Crossing keeps history and avoids importing power that the destination did not grant. |
| TM9 | **Fake, bought and stolen titles.** Default: a bought patent, a forged letter, a borrowed uniform or an impostor's claim gives the social effect until tested; a crack exists (a check, a witness, a skill demonstration, part 21 RN7). Dial: some worlds sell real titles (noble patents), which are bought, not fake. | Lockhart-style routes become a general mechanic with a failure state. |
| TM10 | **Revocation leaves a mark.** Default: a revoked title becomes a "former" record that some audiences read worse than never having had it, and some read as martyrdom. | Losing a title is content, not a deletion. Needs the simulation owner's remove (X1) plus a history row. |
| TM11 | **Titles in a parallel copy.** Default: titles earned in a projection, simulation, loop or rehearsal carry a "copy" tag; the real world honors them only through what crossed (memory, skill), not the title itself (TTKS B2/B3 summaries, `docs/LIFE_SIM_NORTH_STAR.md:7317-7337`). Dial: a world with a challenge board may record submitted-world titles as real. | Keeps rehearsal fame from leaking into the real ledger, which also fits MoL's loop (TW-ML1). |
| TM12 | **Hidden rows and counts.** Default: secret, sealed-route and brand titles do not list their goal while unheld; the panel shows "an unread line" at most, and the count excludes them (G8 MICRO-P2). | Needed before TK6 or TK7 content exists (X6). |
| TM13 | **Title as a hint.** Default: a title's name or text can point at another world or a sealed route (part 15 HF15, EP11), revealing only when that world reads it. Sealed routes are named by ID, never by truth. | Uses titles' permanence: they sit in the biography for years waiting to click. |
| TM14 | **Title opens a feature.** Default: a counter title can open a feature with a receipt (part 22 FR10, FI26, T5). Dial: per world. | Titles become the soft unlock layer that part 22 already wants, with no new gate type. |
| TM15 | **Titles NPCs hold.** Default: rivals and notables carry titles from the same rows, so "Captain", "Saint" and "the Unbeaten" are comparable to yours. | Rivals become legible. Part 21 X10 notes NPCs have no renown of their own yet. |

## 5. Per world (TW)

### Harry Potter (`docs/worlds/harry-potter/`)
| Code | Consideration | Why it matters |
|---|---|---|
| TW-HP1 | **School offices with a term.** Prefect, Head Boy or Girl, Quidditch captain are TK3 offices with a school-year term and Head of House as issuer (general knowledge). Default: they expire at graduation and leave a TK14 record. | A clean first case of offices with expiry and an issuer. Part 21 RW2-HP2 covers revocation; this adds term and record. |
| TW-HP2 | **The Dark Mark as a brand that is also membership.** A TK7 brand and a TK6 secret title at once (general knowledge). Default: it lets insiders summon you and lets Aurors convict you; its reading flips between eras (TD10). | The strongest "same title, opposite readers" case in canon. |
| TW-HP3 | **Wizard honorifics versus Muggle ones.** "Professor", "Healer", "Minister" mean little in Muggle London; a Muggle doctorate means little at the Ministry. Default: TD3 within one world, across the Statute's line. | Shows that off-world worth also happens inside one world. |
| TW-HP4 | **Epithets the press invents.** "The Boy Who Lived", "Undesirable No. 1" (general knowledge). Default: the Prophet can issue an epithet (TK5) to the whole wizarding audience at once, with its own spin. | A press channel as a title issuer, which no other priority world has as strongly. |

### D&D / Forgotten Realms (`docs/worlds/dnd/`)
| Code | Consideration | Why it matters |
|---|---|---|
| TW-DD1 | **Level titles as an old-school label.** Early editions named levels per class ("Myrmidon", "Conjurer") (general knowledge). Default: shown as a flavor TK8 label that rises with level, off by default. | A cheap nostalgic dial that fits TM5 ladders. |
| TW-DD2 | **Epic boons as power titles.** 5e epic boons past level 20 are TK2 powers granted by a deed or patron (general knowledge). Default: the late-game reason to keep playing D&D at full strength. | Late-game usefulness with a native form. |
| TW-DD3 | **Noble patents and land grants.** Default: a TK4 title with a keep, taxes and a lord above you; it means nothing in a rival realm. | Hereditary titles with real upkeep, which feeds the heir system. |
| TW-DD4 | **Divine marks.** A paladin's oath and a cleric's divine favor are TK13 titles with conduct duties (general knowledge). Default: breaking the oath strips power and leaves an Oathbreaker brand (TK7). | A title that is power, duty and possible brand in one row. |

### A Soldier's Life (held, design only; private pack owners)
| Code | Consideration | Why it matters |
|---|---|---|
| TW-SL1 | **Rank is acting before it is substantive.** Default: a field promotion is a TK15 acting title that can be confirmed or reversed after the battle. | Rank as a live state, not a single grant. Part 21 covers rank and repute ladders; this adds acting rank. |
| TW-SL2 | **Decorations versus their story.** Default: a medal is a TK14 record; who pinned it on and why is a story audiences read differently (TD4). | A soldier world's version of "same title, opposite readers". |
| TW-SL3 | **Rank off duty.** Default: rank reads in camp, half-reads in a garrison town, not at all at home. | TD2 place axis inside one world. |

### TTKS (five books; `docs/LIFE_SIM_NORTH_STAR.md:7294`)
| Code | Consideration | Why it matters |
|---|---|---|
| TW-TT1 | **B1: the replaced person's titles.** Inferred from the replacement premise. Default: you inherit their job title, degrees and honorifics as a TM9 borrowed set; the crack is a colleague who knew them well. | Titles you hold without earning them, with a native reason to fear a check. |
| TW-TT2 | **B2: simulated-life titles.** Inferred from the simulator summary. Default: titles earned in a simulated run come back as memory of the deed, not as the title (TM11). | A native test case for the copy tag. |
| TW-TT3 | **B3: submitted-world titles.** Default: titles earned in a submitted world stay real there; titles from unsubmitted attempts are rehearsal only. | The dial on TM11 set the other way in one book. |
| TW-TT4 | **B4: purity as a system-assigned label.** Inferred from the summary (purity is a measured class). Default: a TK8 label that sets treatment; you hide or fake your reading (TM9). | The cleanest TK8 case among the priority worlds. |
| TW-TT5 | **B5: inspector's badge and stamps.** Default: the office (TK3) carries liability; each stamp is a small record of your rulings. Revocation follows a bad admission. | Office as a job loop with real consequences. |

### Mother of Learning (`docs/worlds/mother-of-learning/`)
| Code | Consideration | Why it matters |
|---|---|---|
| TW-ML1 | **Titles reset; the deed stays known to you.** Default: every in-loop title (class rank, guild grade, epithet) resets at restart (part 21 RW2-ML1); the profile keeps a private "you earned this once" record. | Shows the split between world-held and self-held titles. |
| TW-ML2 | **Mage certification grades.** Inferred: mage guild grading is a TK3 rank tested by exam. Default: a looper can re-sit the exam each loop to unlock access fast. | A title as a repeatable speedrun key. |
| TW-ML3 | **The family label.** Default: "the younger brother of" is a TK16 relation title strangers use before your name. | A label the loop cannot erase, since it predates it. Ties into MOL-SEAL-1 only by ID if investigation draws on it. |

### Lord of the Mysteries (Fog City)
| Code | Consideration | Why it matters |
|---|---|---|
| TW-LM1 | **Sequence names as pathway titles.** Each Sequence has a name (Seer, Clown, Magician) (general knowledge). Default: a TK11 job class that is also a TK2 power and shows only to Beyonders. | Class, power and secret in one row. |
| TW-LM2 | **Honorific names as a TK9 risk.** Part 21 RW2-LM1 covers fame drawing attention. New: holding an honorific name of your own makes prayers reach you, which is power and exposure. Dial: how loud each name is. | A title that changes who can contact you. |
| TW-LM3 | **Code names in a club.** Default: a secret society's code names are TK6 titles that insiders read and outsiders cannot link to faces. | Clean secret-title case. |
| TW-LM4 | **Church ranks as offices.** Default: Nighthawk or church ranks are TK3 offices with duties, and their cover stories suppress the deed behind the title (part 21 RW2-LM4). | Offices whose public face hides the job. |

### Circle of Inevitability
| Code | Consideration | Why it matters |
|---|---|---|
| TW-CI1 | **Loop-bound epithets.** Inferred from the looping village. Default: an epithet earned inside the loop resets; one earned outside persists (part 21 RW2-CI1 covers gossip). | Titles follow the same two clocks. |
| TW-CI2 | **Pen name as a title.** Default: a byline is a TK10 alias whose renown grows in print (part 21 RW2-CI2). New: editors grant columns and names a reader trusts. | Office given to an alias, not a face. |
| TW-CI3 | **Sequence names, as in LOTM.** Default: same TK11 plus TK2 rule; local pathways set which names exist. | Keeps the two worlds consistent where they share lore. |

### Shadow Slave (The Dreaming)
| Code | Consideration | Why it matters |
|---|---|---|
| TW-SS1 | **Rank tiers as system labels.** Sleeper, Awakened, Ascended and beyond (general knowledge) are TK8 labels that set public treatment. | A public ladder separate from personal titles. |
| TW-SS2 | **True Names as power and leash.** Part 21 RW2-SS1 and EW33 cover it. New: a TM12 hidden rule; a True Name shows to you, and to others only if they learn it. Book recognition already says a nickname does not acquire a True Name (`src/feature_expansion_book_recognition.js:2172-2174`). | The repo's existing guard becomes the title display rule. |
| TW-SS3 | **Clan names and Legacy titles.** Default: a TK4 hereditary title with real duties inside a clan; outsiders read it as celebrity (part 21 RW2-SS3). | Hereditary titles with a modern public. |

### Village (home, `docs/worlds/original-frontier/`)
| Code | Consideration | Why it matters |
|---|---|---|
| TW-VL1 | **Village titles are descriptive.** Village campaign keeps titles as optional observed recognition (`CAMPAIGN.md:71`, `:253`). Default: Village readers grant epithets only, not powers; native counter bonuses stay as they are (X3). | Keeps the home rule and the native catalog both true. |
| TW-VL2 | **The elder names you.** Default: one Village epithet per life, granted by the elder after a witnessed deed, used by every Village NPC after. | A first TK5 epithet with one clear issuer. |
| TW-VL3 | **Nicknames from blunders.** Default: a funny loss gives a mocking epithet that fades with a better deed. | Warm texture; mocking titles are part of "dependingly". |
| TW-VL4 | **Village as the home ledger.** Default: titles from other worlds show in the Village as stories the innkeeper tells, without their foreign effects (TD3). | Home becomes where all titles are heard, which motivates coming back. |

## 6. Suggestions (SU), ranked cheapest first

Ownership checked 2026-10-13: `src/titles.js` and `src/titles_ui.js` have one commit (`73519a0a`), no uncommitted edits in the tree, and part 18 lists them released (`18_PROTO23_ABSORB.md:114`). No active dispatch claims them (grep of R15, crafting-screen and settings-pass dispatch folders). Foundation R15 holds `src/main.js`, saves, tests and `dist/` (`docs/gm/dispatch/foundation-adoption-next-2026-10-13/rounds/r15/BRIEF.md`). Confirm before writing.

| Code | Consideration | Why it matters |
|---|---|---|
| SU1 | **Ladder display (TM5).** In `src/titles_ui.js`, show the top held rung of a counter ladder as the title name and the rest as history. Save impact: none. Owner: titles UI (released). | Pure display; the save already keys rungs by id. |
| SU2 | **Reader lines on catalog rows (TD1, builds on part 21 SU1).** Add optional `readers: [{audience, stance, text}]` to `title_catalog` entries in `src/titles.js` and show them in the panel. Save impact: none (save stays `{id: {at}}`). Owner: titles files (released). | The smallest "it matters dependingly" with text only. |
| SU3 | **Hidden rows (TM12, fixes X6).** Add an optional `hidden` flag that `titleView` respects (no goal or count while unheld). Save impact: none. Owner: titles files plus a unit test in R15's window. | Needed before any secret, brand or sealed-route title is authored. |
| SU4 | **Worn title (TM1).** Add `character.worn_title` (optional, default absent = top earned) and a select in the panel; nothing reads it yet except the panel and the character name line. Save impact: one optional field, absent on old saves; `normalizeTitles` untouched; `src/save_files.js:107` needs no change, but load in `main.js:5348` needs one line. Owner: titles UI plus Foundation R15 for main.js and a reload test. | Rejects auto-equip (PN4) and gives the first player-chosen identity. |
| SU5 | **First simulation-issued title (X4).** Author one Village epithet (TW-VL2) as a `title` grant effect with an issuer, and a textline that reads `title.<id>` (`src/simulation_effects.js:129`). Save impact: additive simulation titles row; old saves have `{}`. Owner: simulation content owner plus `src/data/dialogues.js`; tests and rebuild in R15's window. | First proof of the issuer-aware owner, with removal available for later. |

Not suggested now: native removal (X5) and heir title carry (X8, TM7) touch saves and heir schema; they wait for an explicit compatibility decision. X9's boolean drop needs a look by the saves owner, not a change here.

Sealed secrets touched: MOL-SEAL-1 (route reference only).
