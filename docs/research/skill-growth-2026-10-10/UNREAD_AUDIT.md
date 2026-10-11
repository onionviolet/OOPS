# Unread audit: how growth works in Royal Road works Weibao hasn't marked

Date: 2026-10-10. Reader: research subagent. Framework: `docs/SKILLS_AND_TALENTS.md`, section "Ways to grow, and what a level means" (G1 to G22, L1 to L10). Companion to `docs/research/system-evolution-2026-10-10/SURVEY.md`, which covers Systems that change. This file does not repeat that survey; it covers how a *character* grows and what a level *means*.

## Method and honesty notes

- **Pool.** `docs/research/novels/royal-road-2026-10-10/catalog.tsv` (1,543 fictions). I dropped every id with `fav` or `follow` in `mine.tsv` or the catalog `mine` column. That left 1,156 unread works with at least one progression tag (Progression, LitRPG, GameLit, Cultivation, Super Heroes, Magic, Strategy, Non-Human Lead, Dungeon, Kingdom Building). Readlater-only ids stayed in and are flagged.
- **Ranking.** I sorted by followers and read the blurbs for roughly the top 500. Then I ran keyword scans over all 1,156 blurbs for odd hooks: level caps, level zero, curses, single XP sources, resets, debt, faith, audience, teaching, tropes and so on. Small works made the list when the hook was unusual.
- **Verification route.** Plain `curl` and WebFetch got a Cloudflare 403. I switched once to the built-in browser on public pages only. No login, no account actions. I read early chapters by fetching each public chapter page from inside that tab and pulling the paragraphs that matched growth keywords. So **READ means I read keyword-matched paragraphs from chapters 1 to 3, not whole chapters.** Twenty-three works were checked this way.
- **Labels.** STATED = catalog blurb or fiction page. READ = early-chapter text read this session. MEMORY = my recall, unverified. Where a claim is a character's guess inside the story, I say so.
- **Big names left out on purpose.** The Primal Hunter (36049), Mother of Learning (21220), He Who Fights With Monsters (26294), Defiance of the Fall (24709) and the Dungeon Crawler Carl book 6 entry are unread in his data, but the G table already uses them as examples. I don't re-audit them here.
- **Stubbed works.** Several are stubbed for Kindle (Mark of the Fool keeps chapters 1 to 7 only). Early chapters show setup, not later twists.
- **Limits.** These are early-chapter reads. A model that only shows up in book 3 is invisible here. No reviews or wiki pages were read.

## Table

RL = on his read-later list. Ratings and follower counts come from the harvest.

| # | Title | RR id | Rating / followers | RL | Growth (G) | Level means (L) | Distinctive mechanic | Label |
|---|---|---|---|---|---|---|---|---|
| 1 | Mark of the Fool | 41618 | 4.60 / 13.3k | | G1, G8, new **G26** | L1, L5 | Five fated Marks per generation, ranked socially. The Fool's Mark interferes with combat and divinity but greatly speeds up learning any other skill. He hunts for holes in the interference (he can still cast magic). | READ ch 2 to 4 |
| 2 | You Have Died Again | 98283 | 4.60 / 0.6k | RL | G16, G2 | new **L11**, new **L12** | Every adventurer has a personal level cap; he is stuck at 50. Level 100 is the world maximum. The loop boss comes back one level higher each loop (134 to 135). Skill levels mostly shorten cooldowns. | READ ch 1, glossary |
| 3 | The Game at Carousel | 65629 | 4.80 / 10.8k | | new **G28**, G13 | new **L13** | Players get a horror-movie Archetype (Major or Minor) and equip Tropes as cards. Plot Armor is a stat that tropes can halve. Film Buff's predictions must happen "On-Screen", and the more predictions you make, the weaker they get. Enemies have hidden tropes too. | READ ch 1 to 3 |
| 4 | The Hundred Reigns | 139212 | 4.76 / 17.0k | | new **G24**, G16 | new **L14** | The Overlord Class is one seat. Normally the Crimson Throne gives it to whoever kills the holder; this time it was bequeathed. It starts at level 1 in a new holder. A few "original Classes" are the roots that all others derive from. The holder can roll back to coronation up to 100 times. | READ ch 1 to 3 |
| 5 | Bloodline Tree | 140337 | 4.53 / 4.4k | | new **G23**, G17, G9 | L7 | A seed in his mind turns descendants into feedback: each child born raises his own talent, which breaks his bottleneck. Inheritance runs upward, from child to ancestor. | READ ch 1 to 2 |
| 6 | Mage Among Superheroes | 48355 | 4.47 / 3.3k | | G2, new **G29** | L6 + L5 | Aspect of the Barbarian (called a curse): he can only gain XP from combat, in a peaceful world. Everyone else gets XP from reading and study too. Until adulthood, level is expected to match age. | READ ch 1 to 2 |
| 7 | Paladin of the Forsaken Lands | 115624 | 4.73 / 5.3k | | new **G30**, G20 | L3 | He stays classless at level 0 for years, turning down class offers while waiting for a rare one. His non-level "Sanctuary" keeps growing from what he gathers. Others reach class tiers just by surviving the region. | READ ch 1 to 2 |
| 8 | Mythshaper | 104817 | 4.58 / 9.9k | | new **G27**, G1 | L4 | "Ways" are tiered practice tracks (Way of Running IV, 1000/1000). Finishing one *awakens* a locked attribute (Attributes 1/8) and opens the next Way. Hard work is rewarded with points. | READ ch 1 to 3 |
| 9 | Gifted | 181303 | 4.66 / 15.8k | | G1, G8, G11 | new **L15** (character guess) | Myriad Paths system. All stats start at exactly 100, and the MC guesses they are percentages of his own body's potential. A "Talented" attribute at 100% means +20% Path speed. A demon absorbed in the womb is still hungry. | READ ch 1 to 3, STATED |
| 10 | Prestige Grinding | 95231 | 4.19 / 5.4k | | new **G25**, G15 | L2, two scales | On death, [Prestige] resets all levels and skills to zero and doubles skill XP. The status shows Talent Level and Growth Factor, fixed at 1 for everyone else, plus a hidden Body Level in the millions next to a class level of 49. | READ ch 1, STATED |
| 11 | The QuestWright | 121243 | 4.41 / 3.6k | | new **G31**, G18 | L5 | At 18 the System gives a Calling (combat, trade or administrator). His is the rare QuestWright: he drafts and assigns Quests and gains XP "through smart delegation". Trade Callings are "the glue". | READ ch 1 to 3, STATED |
| 12 | The Humble Life of a Skill Trainer | 30737 | 4.50 / 7.8k | | G21, G1 | L1, L3 | The trainer raises clients' skills (Pain Tolerance by needlework) and gains his own [Trainer] skill and odd skills like [Backstab] along the way. Guilds want monopolies on who may teach their skill. | READ ch 1 to 2 |
| 13 | Lazy Loops: An Idle LitRPG | 168961 | 4.41 / 3.9k | | G16, G1 | L1 | "The harder you try, the faster you die." Effort burned out his parents' mana channels. School-of-magic levels (Enchantment 48). Passive [Efficiency]. An effort-averse loop hero. | READ ch 1 to 3 |
| 14 | Arrogant Young Master Template A Variation 4 | 28601 | 4.63 / 11.6k | | G9, G8, G2 | L2 | The status splits each cultivation method into Power, Comprehension (24/32) and a Stage that tracks yours. Comprehension of a manual is its own bar beside realm. Blurb: "What would a Xianxia MC do?" | READ ch 1 to 2 |
| 15 | Qi Like Tar | 172245 | 4.46 / 3.2k | | G9 | L2, talent = speed | Talent is *measured* by qi speed. His slow qi also refuses to be moved, which resists poison and pressure. The flaw and the defense are the same trait. | READ ch 1, STATED |
| 16 | Immovable Mage | 39344 | 4.52 / 4.3k | | G9, G8 | L4 | Talent is scored on "pillars of mana foundation". Terry tops control but has "aspect impairment": he can't cast. A Greenhouse matches parents by recorded talent. | READ prologue 1 to 2 |
| 17 | Singer Sailor Merchant Mage | 45370 | 4.43 / 7.9k | | G1 | L1 | The System runs from the womb (Level 0, 0/100 XP) before birth. Theme: jack of all trades. | READ prologue, ch 1 |
| 18 | Merchant Crab | 68106 | 4.51 / 3.9k | | G2, G12 | L2 | A crab gets XP when adventurers die in traps near his pond ("Level 7 Wizard slain by Cleverly Placed Trap"). He trades loot for pie. He grows from kills he doesn't make. | READ ch 1 to 3 |
| 19 | Pale Lights | 65058 | 4.82 / 10.0k | | G14 | L8 | Thieves and others hold contracts with old gods. His goddess Fortuna has grown too weak to touch the world. The patron's own strength is part of the ladder. | READ ch 1, MEMORY for the rest |
| 20 | The 108 | 174050 | 4.76 / 8.7k | | G16 | L9 | 108 gods pick avatars for a game. Time picks a cellist who "cannot lose". Weak-to-strong through loops; perception gets unlocked. | READ ch 1, STATED |
| 21 | Everybody Loves Large Chests | 8894 | 4.55 / 17.0k | RL | G11, G5 | L2 | A mimic levels by eating adventurers (+2 all attributes per level) and learns by watching how prey used items. | READ prologue, ch 1 |
| 22 | 1% Lifesteal | 72301 | 4.58 / 12.0k | | G11 | L5 | "Archhumans" are a wealthy talented class; mortals don't get paid for kills. A lifesteal talent makes him stronger with every enemy killed. | STATED, READ ch 1 to 2 (setting only) |
| 23 | The Great Core's Paradox | 40888 | 4.56 / 5.5k | RL | G5, G14 | L7 | A snake that is the sole creation of a Great Core. Growth is tied to its creator. "Coreless" enemies. | STATED |
| 24 | The Truck Effect | 86577 | 4.71 / 1.1k | RL | G18 | L3, L8 | An assassin of a multiversal House of Fate is promised ascent for each reincarnator he dispatches. His reality-altering "Defects" keep him at the bottom. | STATED |
| 25 | Beware of Chicken | 39408 | 4.77 / 36.7k | | G9, G14 | L2 (rejected) | He refuses the fight-to-grow path and farms. His land, animals and household cultivate around him. | STATED, MEMORY |
| 26 | Chrysalis | 22518 | 4.65 / 19.9k | | G5, G11, G14 | L2 | Reborn as an ant. Biomass buys mutations, evolution menus, and a colony that grows with him. | STATED, MEMORY |
| 27 | Dungeon Life / Blue Core | 54476 / 25082 | 4.66 / 13.2k; 4.59 / 13.0k | | G14, G20 | L4 | Dungeon cores that grow from visitors, not kills. Blue Core rejects the monster-and-slave core models. | STATED, MEMORY |
| 28 | The Dungeon Without a System | 48893 | 4.65 / 14.2k | | G20, G22-ish | none | A core with no System; growth by experimenting with mana; other people can't classify him. | STATED |
| 29 | The Sect Leader System | 76359 | 4.50 / 4.5k | | G31, G14 | L5 | Sect-management growth from a middle manager. | STATED |
| 30 | My Magus Academy is Run by Players?! | 75790 | 4.27 / 4.4k | | G31 | L5 | A System summons "players" who grind missions for his academy. | STATED |
| 31 | Arcane Chef | 117146 | 4.71 / 6.4k | | G1 | L5 | A rare class "with no known history or levelling path"; cooking classes rank as Servant class. | STATED |
| 32 | The Hedge Wizard | 43181 | 4.59 / 5.4k | | G13, G8 | L1 | His master's Book of Infinite Pages binds to his soul. Realism-focused gamelit. | STATED |
| 33 | Dao of Language | 148605 | 4.61 / 2.0k | | G8 | L2 | She is barred from the fast "path of slaughter". Hidden masters out-cultivate fighters without ever fighting; for her the route is language. | STATED, READ prologue |
| 34 | The Story Mage | 104998 | 3.73 / 0.5k | RL | G28 | L13 | A side character chasing "the power of Story" and plot armor. | STATED |
| 35 | Bob the Walking Bank | 159053 | 4.37 / 3.1k | | G11, G5 | L2 | A mimic that must eat ever more treasure to evolve: wealth is the XP. | STATED |
| 36 | The Celestial Auditor | 195252 | n/a / 1 | | G12 | L8 | Every wisp of qi is a karmic loan. Tiny work, listed only as the cleanest example of L8. | STATED |
| 37 | Life of an endless Grind | 191032 | n/a / 1 | | G2 | L3, L5 | The Ledger gives a life-rank at sixteen, and that rank sets food, housing and medicine. Tiny work, listed for L3. | STATED |

## New growth models and level meanings

These are the most useful findings. Codes continue the framework's numbering and are proposals, not accepted decisions.

### New growth models

- **G23 Upward inheritance.** Power flows from descendants to the ancestor. A child's birth, and later the child's talents, feed back into the parent. Bloodline Tree (READ). This flips G17. It turns family, marriage and child-rearing into a growth path, which suits the life-sim north star. Time scale: years.
- **G24 Office class (seat succession).** The power belongs to a seat, not a person. One holder at a time. It passes by killing the holder or by bequest, and the new holder starts at level 1 in a class that is mighty by name. Some classes are "originals" that others derive from. Hundred Reigns (READ). Levels measure time in office. Heirs, usurpers and assassins become progression mechanics.
- **G25 Diegetic prestige.** A character resets their own levels to zero for a permanent growth multiplier, and the world can see the counter ("Prestige 0", Growth Factor 1). Prestige Grinding (READ ch 1). YAIRPG's prestige layer exists outside the fiction. This version puts it inside a character, so NPCs and rivals can do it too, and death can trigger it.
- **G26 Domain-split mark.** One gift speeds every skill in some domains and actively blocks others. The block is a puzzle with holes to find. Mark of the Fool (READ). This differs from a talent bonus: it is a map of yes and no zones, and the fun is finding where its edges leak.
- **G27 Practice tracks that unlock attributes.** Repeated activity fills tiered tracks ("Ways"). Finishing a track awakens an attribute that was locked, then opens the next tier. Mythshaper (READ). This sits between G1 and G18: practice unlocks the stat itself, not just a skill level. It fits YAIRPG's skill milestones directly.
- **G28 Narrative role and tropes.** Power comes from a story role (an Archetype) and equipped Tropes. Plot Armor is a stat. Some powers only work when observed ("On-Screen"), and repeated use weakens them within a storyline. Enemies carry hidden tropes that the right skill reveals. The Game at Carousel (READ); The Story Mage (STATED). This suits the presentation and fourth-wall docs.
- **G29 Single XP channel.** A person can only earn XP from one source, and the world may not offer it. Mage Among Superheroes (READ). It makes a world's *economy of XP* a setting trait: a peaceful world starves a combat-only learner. Moving to another world becomes a growth decision.
- **G30 Deferred commitment.** You stay at level 0 or unclassed on purpose and turn offers down to qualify for a rarer one, while a non-level resource grows. Paladin of the Forsaken Lands (READ). The cost is falling behind peers. Choosing *when* to take a class becomes a decision.
- **G31 Delegation growth.** You level when tasks you assign, design or manage are completed by others. QuestWright (READ/STATED), Sect Leader System and Magus Academy (STATED). This differs from G14 (power from belief) and G21 (teaching a skill). It rewards logistics and judging others.

### New level meanings

- **L11 Frequency.** A level makes a skill available more often, not harder. Cooldowns drop from 10 s to 3 s to 1 s. You Have Died Again glossary (READ). In an idle game this is a natural meaning: a level means more uses per day.
- **L12 Personal ceiling.** Everyone has their own cap, so your level means "how close you are to *your* limit". The cap is the real talent. You Have Died Again (STATED). Breaking a personal cap becomes a story event, not an XP number.
- **L13 Narrative weight.** A level or stat is how protected you are by the story (Plot Armor), not how strong you are. Carousel (READ). Low-weight characters die to small things; high-weight ones survive the improbable.
- **L14 Tenure in a seat.** Level is time and deeds in an office, attached to the seat. Hundred Reigns (READ). It resets with each new holder.
- **L15 Percent of own potential.** Stats read as a share of what your current body can do, so 100 can mean a weak baby at full capacity. Gifted (READ; the MC's guess, unconfirmed). Same number, different person, different meaning.

### Near-misses (variants of existing codes, worth a note)

- **Level-for-age norm** (Mage Among Superheroes, READ): until adulthood, level should match age. This is L6 plus L5. Falling behind is a social stain.
- **Inverse talent** (Qi Like Tar, READ): the trait that slows growth also gives resistance. One axis, two signs.
- **Growth from kills you didn't make** (Merchant Crab, READ): trap credit. A home that kills for you is a growth source (G14 or G20 variant).
- **Hidden second scale** (Prestige Grinding, READ): class level 49 next to a Body Level of 8,185,625. A small visible number over a huge hidden one.
- **Comprehension per manual** (Arrogant Young Master, READ): each technique has its own Comprehension bar and a Stage that follows the user's realm. Understanding and power are tracked apart.

## Standout subtleties

- **Bottom versus top.** A "worst" assignment is often the best puzzle: the Fool's Mark, a Film Buff (a minor archetype that "dies early"), an administrator Calling, an unknown cooking class, a lifesteal of 1%. The framing to steal: the society ranks the role low, and the rules give it an odd lever that the ranking misses.
- **Display of growth.** Carousel hands out powers as physical *tickets*. Mythshaper shows attribute slots as 1/8 locked. Prestige Grinding shows "Status: Dead (Prestige 0)". Interface design itself tells you what the world values.
- **System clashes.** AYMT puts a game-style status (XP, skill points) on top of a cultivation world. Merchant Crab gives a non-human a level system it doesn't understand ("the wizard had been a seven, which ... was more than two"). The Dungeon Without a System confuses everyone by having none.
- **Costs.** Lazy Loops: effort burns mana channels, so laziness is self-preservation. Carousel: each prediction weakens the next. Paladin: classless years mean falling behind. Fool: active interference. Celestial Auditor: qi is a loan with interest.
- **Social layer of talent.** Immovable Mage's Greenhouse matches parents by recorded talent. Skill Trainer guilds police who may teach. 1% Lifesteal's archhumans own a district. Levels and talents shape housing, marriage and law, which is the life-sim angle.
- **Enemies grow too.** The loop boss in You Have Died Again gains a level per loop. A loop hero's knowledge grows, and so does the threat.

## Top 8 to read or deep-dive next (for the game)

Ranked by how much new mechanics they would give YAIRPG, not by prose quality.

1. **The Game at Carousel** (65629, 4.80, 10.8k). The fullest new model (G28, L13). Tropes as equippable cards, Plot Armor as a stat, observed-only powers, diminishing predictions. Direct fit for the presentation and fourth-wall work.
2. **The Hundred Reigns** (139212, 4.76, 17.0k). Office classes (G24, L14) plus a capped loop count. It gives rival heirs, succession and "original classes" a mechanical form.
3. **Mark of the Fool** (41618, 4.60, 13.3k). The domain-split mark (G26) is a clean design for a talent with yes and no zones, and finding its leaks makes good play. Early chapters only; the rest is on Kindle.
4. **You Have Died Again** (98283, 4.60, 0.6k). **On his read-later.** Personal caps (L12), cooldown levels (L11) and a boss that grows each loop. Small audience, high rating, already queued.
5. **Bloodline Tree** (140337, 4.53, 4.4k). Upward inheritance (G23) makes family a growth engine. Strong life-sim fit.
6. **Mythshaper** (104817, 4.58, 9.9k). Ways that unlock attributes (G27) map almost one-to-one onto YAIRPG's skill milestones. The cheapest new model to prototype.
7. **The QuestWright** (121243, 4.41, 3.6k). Delegation growth (G31): a non-combat path built on logistics and managing others. Good for a support or manager build.
8. **Mage Among Superheroes** (48355, 4.47, 3.3k). A single XP channel (G29) plus level-for-age shows why moving between worlds can be a growth choice.

Also on his read-later and worth a skim for this topic: **The Truck Effect** (86577), for promotion by kill quota with Defects as a ceiling, and **Everybody Loves Large Chests** (8894), for consumption growth from the monster side. Paladin of the Forsaken Lands (115624) is the best example of deferred commitment (G30), if a ninth slot is wanted.
