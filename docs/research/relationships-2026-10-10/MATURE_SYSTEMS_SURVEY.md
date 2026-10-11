# R2: Mature relationship systems, outside sources (research reader)

Date 2026-10-10. Scope: outside games and fiction only. The project's own code and docs are covered by the other reader. Compared against `docs/emergent/E3_LIVING_PEOPLE.md` sections 9 (opinion and memory), 13 (named enemies) and 14 (autonomy).

Labels: **[shown]** = a page or tool displayed it; **[stated]** = source text states it (wiki, dev, guide); **[inferred]** = my reading, not confirmed by the source. Source quality note: Fandom wikis (Persona, Mordor, Fire Emblem, Kenshi) returned HTTP 402 and a dev article for Nemesis was not retrievable, so those entries rest on search summaries and are marked weaker. Numbers I could not verify are marked UNVERIFIED rather than filled in.

---

## 1. Per-system notes

### 1.1 RimWorld (strongest numeric source)
Source: https://rimworldwiki.com/wiki/Opinion , https://rimworldwiki.com/wiki/Bond

- **Model.** Directed opinion pawn to pawn, about -100..+100 **[stated, implied by tiers: rival -100..-20, acquaintance -20..20, friend 20..100]**. Opinion = sum of (a) static offsets (beauty +-20 per level capped +-40, traits, blood family e.g. parent +30, sibling +20, cousin +10; spouse +30, lover +35, ex -15) and (b) timed "thoughts" with a duration and a stack limit. Hidden per-pair compatibility = 0.45*(1 - min(2, |age gap|/10)) plus a per-pair random value, mean 0.3 **[stated; hidden, dev mode only]**.
- **What changes it.** Random social interactions between nearby pawns, weighted by compatibility. Deep talk +15 (20 days, stack 10, stack factor x0.9), slight -5, insult -15, kind words +15. Actions: harmed me -15/10d, botched surgery -20/90d, rescued me +15 (x3) or +25/30d, recruited me +20/120d, crashed together +25/20d, sold my loved one -10/120d. Speeches +20..+40 or -15..-30 for 8 days. No steady decay; each thought just expires **[stated]**.
- **Feedback loop.** Insult/slight weight multiplied by opinion factor (x6 at -100, x4 at -50, x2 at -25, x1 at 0, x0.1 at +50, x0 at +100) and compatibility factor (x4 at -2.5 down to x0.4 at +3). Insult causes social fight at 4%, slight 0.5%, multiplied by stressors (malnutrition, drunk x4, bloodlust x4). Fights end in catharsis (+38) or anger (-22) 50/50, 20 days.
- **Romance.** Needs mutual attraction, age 16+, target opinion not negative; action every 12 days; success scaled by initiator beauty (ugly x0.3, pretty x2.3); zero if the target's opinion of their current partner is high (~+20). Rebuffed -10, failed -15, breakup -50, affair -70, divorce -70, honeymoon +40 **[stated]**.
- **Animal bonds.** Chance per event: 0.4% per wound tended, 1% on taming, 0.7% on training, 0.1% per 2,500 ticks near master. Master mood +5; bonded animal loss -8 for 20 days; given away -10 for 60 days; an animal has only one human bond, a human can have many **[stated]**.
- **Unlocks.** Romance, marriage, lovin' mood buffs, family inheritance of opinions, rescue/recruit grudges. Opinion gates mood, not abilities.
- **Shown.** Social tab lists every opinion with each reason and its remaining time **[shown]**. Compatibility is hidden **[stated]**.
- **Complaints** **[inferred from the page's own design and the Steam threads in search results, not verified]**: random insults and fights from low-opinion pairs feel arbitrary; romance randomness (beauty dominates); affairs; "mood spiral" cascades.

### 1.2 Crusader Kings III
Source: https://ck3.paradoxwikis.com/Opinion , https://ck3.paradoxwikis.com/Hooks , https://ck3.paradoxwikis.com/Schemes. The script-level definition files (opinion_modifiers, script_docs) could not be fetched; search returned only forum chatter. Marked UNVERIFIED for decay syntax.

- **Model.** Every character has an opinion of every other, stored as a sum of modifiers: permanent traits (Diplomacy skill +1 per point, Gallowsbait -2..-126, same dynasty +5), timed event modifiers (Attacked an Ally -25 for 3 years, Broke Truce -50 for 3 years), and scaling modifiers (tyranny). The page says some "grow or stay the same, but most decay to 0" **[stated]**; whether the decay is per-modifier timed expiry is UNVERIFIED but 3-year examples suggest per-modifier duration **[inferred]**.
- **Specialised opinion channels.** General, attraction (only toward matching preference, adults), vassal, courtier, child, same-dynasty, faith/virtue (+-10 depending on viewer's faith), and per-pair hostility malus (Astray -10, Hostile -20, Evil -30). One opinion number shown with a tooltip listing each channel **[shown]**.
- **Relations as role layer on top of opinion.** Friend (+60 opinion), Best Friend (+120), Crush/Lover (+60), Soulmate (+120), Bully-Victim (-20), Rival (-60), Nemesis (-120). Friend/Best Friend raise councilor efficiency (+20%/+30%); Rival/Nemesis cut it (-20%/-30%); Lover +25% fertility; death of a relation gives stress (+10 friend/lover, +35 rival). Friendship and conflict are mutually exclusive; love coexists with either; each character holds one of each lifelong type. Blood Brother gives Friend benefits plus a strong hook plus alliance **[stated]**.
- **Hooks (obligation currency).** Weak hook: one use, usually 10 years, adds acceptance bonus (Arrange Marriage +100). Strong hook: reusable with 5-year cooldown, forces acceptance (+200 marriage), and blocks the target from joining factions, declaring war or imprisoning the holder. Perpetual hook: reusable, never fades (Loyal Hostage, Filial Piety). One hook per pair at a time; new replaces older if stronger. Sources: Favor, Obligation, Indebted, Saved Life (permanent), Oath Debt (20 years), Blackmail (until exposed), Best Friend/Blood Brother (while relation lasts). Abandon Hook gives the target +50 opinion **[stated]**.
- **Secrets.** Characters acquire secrets by acts; found by random events or a spymaster task; discoverer chooses expose or blackmail. Criminal secret gives strong hook; Shunned gives weak hook; refusal exposes. Mutual: both must know the other has one **[stated]**.
- **Schemes.** Hostile schemes (murder, abduct, fabricate hook): success chance capped by Potential (skill up to 30%, agents the rest, cap 95%), needs Advantage, discovery chance (100 - Secrecy)% on execution, monthly breach chance (100 - Secrecy)/10%, 5 breaches auto-fail, grace period 6 months. Up to 5 agents each capped +50; agent acceptance leans on relations (Best Friend +100, Friend +50, Lover +25) and their closeness adds success (Spouse +30, Best Friend +30, Friend +20) **[stated]**. Personal schemes: Seduce (+20 opinion, lover, secrets, 40% fail penalty -10), Befriend (friend to best friend, ends rivalry, failure -20 and rival -15 with every courtier).
- **Unlocks.** Alliances, marriage, councillor bonuses, scheme agents, hooks, succession (opinion gates vassal obedience and factions), stress events.
- **Complaints** **[stated in search snippets: Paradox forum thread]**: late game dynasties with huge positive modifier stacks make opinion meaningless; modders add flat negatives or short timed penalties to counter bloat. Treat as a known failure mode: unbounded additive stacks.

### 1.3 The Sims 4
Sources: https://snootysims.com/wiki/sims-4/sims-4-sentiments-a-full-guide-on-how-they-work/ , https://simscommunity.info/2020/11/10/list-of-all-the-sentiments-in-the-sims-4/ , https://forums.ea.com/discussions/the-sims-4-gameplay-en/full-romance-bar-down-to-hardly-anything/8765371. No official numeric tables retrieved; point values for socials UNVERIFIED.

- **Model.** Two bars per pair, friendship (green) and romance (red), shown once a base level exists **[shown]**. Romance bar is symmetric between partners (both always at the same level) per a forum user **[stated, community]**. Sentiments are separate: temporary directed feelings from shared experience (Adoring, Close, Enamored, Motivating; Guilty, Hurt, Furious, Bitter), max 4 per target, a 5th replaces the weakest, differ per side, up to 84 total across packs, duration scales with intensity (hike short, betrayal long) **[stated]**.
- **Effects.** Sentiments change mood around the person and bias which social options the Sim picks (mean vs friendly) **[stated]**. Bars gate interactions (dark red romance means romantic socials rejected).
- **Decay.** Bars fade with no contact; the "Beloved" trait stops decay permanently **[stated, community]**. Cheating reportedly halves the romance bar or worse **[stated, forum]**.
- **Shown.** Relationship panel, sentiment book icon in conversation **[shown]**.
- **Complaints** **[stated]**: bar drop after neglect feels punishing; romance bar oddities; trophy-chasing of bars.

### 1.4 Dwarf Fortress
Sources: https://dwarffortresswiki.org/index.php/Relationship , https://dwarffortresswiki.org/Personality , search summary.

- **Model.** Per pair love/relationship value; types: kin, spiritual (deity), professional (master/apprentice), animal (pet/bonded), personal (passing acquaintance, long-term acquaintance, friendly terms, friend, close friend, kindred spirit, grudge, companion) **[stated]**.
- **Formation.** Idle dwarves on adjacent tiles chat; compatibility derives from personality facets (0 to 100). A facet gap (one above 60, other below 40) drives grudges; shared likes drive friendship **[stated]**. Rank 15: friend or grudge forms. About 40 (observed 31 to 42): friends become lovers if inclined. 50: may marry. Love scale: 50 to 74 friend, ~75 close friend, 100 kindred spirit; -50 to -100 disliked, hated, pure hate. Growth slows as it deepens **[stated]**.
- **Decay.** Dwarves who stop chatting lose acquaintances; in fortress mode, a dwarf with 50+ non-kin relations may drop passing acquaintances with no contact in the past year at new year. Grudges never forgotten in fortress mode but skill changes can shift opinions **[stated]**. (Mixed-version wiki; version-dependent.)
- **Grudge effects.** Unhappy thought on formation and when the grudgee dies; talking to a grudge can spike stress hugely **[stated]**.
- **Worldgen history.** Friendships from childhood, scholarly interests, performances, sports, war, and they carry over migration; grudges from business rivalry, sports, abusive rulers, religion **[stated]**. Deity worship is a relationship with levels (ardent, faithful, casual, dubious) and a prayer need **[stated]**.
- **Shown.** Relations tab per dwarf, Legends mode **[shown]**.
- **Complaints** **[inferred]**: stress cascades from grudges; relationships invisible until you open a tab.

### 1.5 Stardew Valley (cleanest numeric model)
Source: https://stardewvalleywiki.com/Friendship

- **Model.** One integer per villager, 250 points per heart. Non-candidates cap at 2,749 (10+ hearts); candidates cap at 2,249 (8 hearts) until a bouquet; spouse meter to 14 hearts (3,749). Heart events are gates at fixed hearts **[stated]**.
- **Gains.** Talk +20/day, gift by taste (Love +80, Like +45, Neutral +20, Dislike -20, Hate -40), quality x1.1/1.25/1.5 on liked and loved only, birthday x8, Winter Star x5, 1 gift per day per villager and 2 per week, bundles +500, Flower Dance +250 **[stated]**. Heart events: up to +250 or -1500 (Penny) **[stated]**.
- **Decay.** Applies only if you did not talk that day: -2/day for non-romanceable (floor at 10 hearts), -2/day pre-bouquet candidate (floor 8 hearts), -10/day after bouquet (floor 10), married -20/day with no floor **[stated]**. Breakup resets to 5 hearts, rebuild to 8.
- **Unlocks.** Dialogue, cutscenes, recipes, bedroom at 2 hearts, marriage at 10 hearts plus item plus housing; achievements for number of friends at tiers.
- **Shown.** Hearts on social tab **[shown]**. Schedules are fixed per day and weather so the player "knows" where people are.
- **Complaints** **[inferred]**: gift-spam optimisation, daily chore feeling (that is why caps and weekly limits exist), irrecoverable heart event penalties.

### 1.6 Persona 5 (weaker: search summaries only)
Source: https://www.pushsquare.com/guides/persona-5-royal-confidants-guide-where-to-find-all-confidants-and-how-to-rank-up-fast and Akechi guide, https://www.inverse.com/gaming/persona-5-royal-akechi-confidant-guide

- **Model.** Confidant rank 0 to 10 per person; rank-ups gated by calendar date (earliest dates), social stats (knowledge, charm) and prior rank; some do not advance every meeting; dialogue choices speed points **[stated]**. Some bonds are automatic with story (Akechi) **[stated]**.
- **Unlocks.** Each rank gives ability: e.g. Akechi rank 4 Sleuthing Mastery, rank 7 Harisen Recovery, rank 10 Protect and Endure; also Persona fusion bonuses (fused persona levels up for free) **[stated]**. Romance triggered by specific choices, not by max rank **[stated]**.
- **Key lesson [inferred].** Time is the currency: limited free slots forces tradeoffs, so a relationship is a scheduled investment with a visible payoff table. Exact point-per-hangout numbers UNVERIFIED.
- **Complaints** **[inferred]**: missable bonds with deadlines, optimisation guides override roleplay.

### 1.7 Mass Effect 2 / Dragon Age
Sources: https://masseffect2.wiki.fextralife.com/Loyalty+Missions , https://twinfinite.net/guides/mass-effect-2-thane-loyal-get-keep/ , https://thelearnedfangirl.com/?p=8236 , https://www.thegamer.com/dragon-age-origins-companion-approval-guide/

- **Mass Effect 2.** Loyalty is a binary-ish flag earned by completing a personal mission; some resolutions need a high Paragon or Renegade score in dialogue; wrong choice loses a companion's loyalty; a later conversation can recover it at a lower threshold; loyalty affects who survives the final mission **[stated]**. Romance is a flag tied to dialogue choices.
- **Dragon Age: Origins.** Approval scalar, roughly -100..+100 **[stated by one guide]**; gifts always raise it, preferred gifts more; high approval unlocks dialogue, bonuses, romance; very low causes companion to leave **[stated]**. Dragon Age 2 replaced this with two axes (friendship vs rivalry), where either extreme gives benefits and the middle is "lukewarm" **[stated]**.
- **Lessons.** Approval based on choices that matter to this person's values (trait-matched), loyalty unlock as an event that tests it, and consequences resolved at a climax (survival).
- **Complaints** **[stated]**: gift grinding in DAO; friendship-vs-rivalry can feel like a forced binary; "friendzone" unclear signalling.

### 1.8 Shadow of Mordor / War (Nemesis)
Sources: https://www.shacknews.com/article/101634/shadow-of-war---nemesis-system-explained , https://www.rpgsite.net/feature/6192-shadow-of-war-domination-guide-the-nemesis-system-betrayal-death-threats-resurrection-and-more-orc-dominating-mechanics-explained , https://www.gdcvault.com/play/1025150/contactUs (talk page; slides not retrieved).

- **Model.** Each captain: role, level (1 to 60), rank (grunt, captain, warchief, overlord), random strengths/weaknesses/angers/fears, and a log of events with the player (killed player, escaped, humiliated, cheated death) that feeds dialogue, scars and visuals **[stated]**.
- **Changes.** Orcs gain level and promotion by killing the player or winning Nemesis missions between themselves; shaming lowers level and relocates; rare "broken" or "frenzied" outcomes; blood brothers bonus and avenging **[stated]**. Player can dominate and use captains against others, causing betrayals **[stated]**.
- **Shown.** Army screen with intel; knowledge unlocked by interrogation; reaction lines **[shown/stated]**.
- **Lesson.** Memory only matters if it is cited back: dialogue and visible scars cashing the history. A memory with no read-back is invisible.
- **Complaints** **[inferred]**: the patent (WB 2021, unverified) discouraging imitators; repetition of dialogue; scale of stat inflation.

### 1.9 Fire Emblem supports (weak; per-point numbers UNVERIFIED)
Source: https://gamerguides.com/fire-emblem-awakening/guide/intro-and-gameplay/gameplay/support-relationships (summary).

- Rank C, B, A, S with a conversation at each; points come from being near/adjacent in battle; bonus to hit, avoid, crit and crit avoid from adjacent allies; S rank enables marriage; Awakening children inherit traits from parents **[stated]**. Exact point thresholds: UNVERIFIED.
- Lesson: relationship is earned in shared danger, paid out as combat stats, and capped in count (S only once).

### 1.10 Wildermyth (best match for legacy)
Source: https://wildermyth.com/wiki/Relationship

- **Model.** Three types with five levels: Friends (Crony, Confidant, Comrade, Companion, Bloodbond; +10..+30 block), Lovers (Crush to Soulmate; +1..+5 damage vs attackers of partner), Rivals (Peer to Rival; +25%..+100% stunt chance); Family is an overlay (coexists with friend or rival, not romance), no combat effect, only event pairing **[stated]**.
- **Points.** Level thresholds 20, 60, 120, 200, 300. Multiplier = clamp(((0.5 + (c1 + c2)/200) * (1 + |compat|/3)), 0.33, 3). Compat score counts shared 50+ personality stats minus incompatible ones; +4 or more leans romance, -2 or less leans rivalry **[stated]**.
- **Exclusivity.** Random romance requires neither in a romance; rivalry requires neither in rivalry. Players report one lover and one rival max **[stated community]**.
- **Legacy.** Romances and rivalries can be **locked**; locked ones resume at once when heroes return as legacy; friendships and family carry-over not stated **[stated]**. Hero deaths and retirement hand on kids and friends.
- **Lesson.** Extreme compatibility in either direction speeds the bond; mixed gives slow. Both love and hate are productive.

### 1.11 Kenshi, Mount & Blade
- **Kenshi.** Faction relations -100..100 with pairs default 0; rise by fighting their enemies, freeing captives, turning bounties; each faction tracked separately; bounties and enslavement from crime **[stated, https://pindrop.gg/kenshi/factions]**. Individual NPC loyalty coverage not found.
- **Bannerlord.** Persuasion system drives both relation gain and romance; charm perks boost relation gain; repeated failures sour things; companions leave based on character and loyalty **[stated, Wikipedia]**. Relation formulas UNVERIFIED.

### 1.12 Fiction-derived bonds as mechanics
No external wiki needed; these are my own constructions from CK3 hooks and Wildermyth locks **[inferred]**.

- **Fealty / oath.** Directed obligation with terms (levy, loyalty), a breach event, and a cost to the breaker. CK3 maps to Follower Oath (permanent weak hook) and Oath Debt (20-year strong hook).
- **Vow.** Self-imposed constraint on the holder (for example a monk's vow); breaking it removes an ability. Wildermyth locks are the same idea.
- **Sworn siblings / blood brothers.** Symmetric, one-per-person, strong hook plus kin-like opinion floor. CK3 Blood Brother (strong hook, alliance, one only); Mordor blood brothers avenge.
- **Master and disciple.** Directed, with skill transfer and heir claim; DF "apprentice/master" is a relation type.
- **Soul bond.** Symmetric, shared state (damage sharing, shared death penalty), persists across lives. Wildermyth soulmate and Sims "Beloved" (decay stops) show the "locked" end.

---

## 2. Mechanics catalog (codes)

Each line: what it is, the source, and how big. Codes are session-stable.

- **RL1 Opinion = sum of dated modifiers.** Each modifier has {id, value, expiresAt or permanent, stackLimit, stackFactor}. RimWorld (thoughts with duration and stack x0.9), CK3. Cheap to store; reason list is the UI.
- **RL2 Static offsets from kinship/role.** Family and role bases (RimWorld spouse +30, sibling +20; CK3 same dynasty +5).
- **RL3 Hidden compatibility.** Per-pair seed plus age gap (RimWorld) or personality overlap (Wildermyth, DF facets). Scales speed, not just direction.
- **RL4 Opinion-weighted hostility roll.** Chance of negative acts is a multiplier curve on opinion (RimWorld x6 at -100 down to x0 at +100).
- **RL5 Stressor-multiplied fights.** Existing hostility times need-state multipliers.
- **RL6 Timed memory with expiry and per-source stack cap.**
- **RL7 Slots-limited sentiment.** Max 4 active feelings per target, weakest replaced (Sims).
- **RL8 Asymmetry.** Sentiments and opinions are per-direction; only some role-relations are symmetric (Sims romance bar symmetric, Wildermyth locks).
- **RL9 Role-relations layered on opinion.** Friend/Best Friend/Rival/Nemesis/Lover/Soulmate with opinion floors and effects (CK3), exclusive pairs (friend xor rival) and at most one of a type.
- **RL10 Levelled bond with thresholds.** Points to levels 20/60/120/200/300 (Wildermyth), 250 per heart (Stardew), DF 15/40/50.
- **RL11 Gain multiplier from compatibility and temperament.** Wildermyth formula; clamp 0.33 to 3.
- **RL12 Daily contact decay with floors and tiers.** Stardew: -2/-10/-20 by tier with floors (rate scales with intimacy; marriage has no floor).
- **RL13 Gift taste table.** Per-person tastes (love/like/neutral/dislike/hate) x quality x special day x daily/weekly caps (Stardew).
- **RL14 Gift or act matched to values.** Approval from choices that fit the person (DAO, ME2).
- **RL15 Gates at levels.** Heart events, ability unlocks, marriage steps (Stardew, Persona, FE).
- **RL16 Calendar-gated advancement.** Earliest dates + stat prerequisites; rank advances only some meetings (Persona).
- **RL17 Scarce time currency.** Limited hangout slots force allocation (Persona).
- **RL18 Combat/adjacent payoffs.** Friend block, lover vengeance, rival crit chain (Wildermyth); FE adjacency.
- **RL19 Hook = spendable obligation.** Weak (one use, 10 years), strong (reusable, 5-year cooldown), perpetual (CK3). Source: favor, debt, saved life, oath, blackmail.
- **RL20 Secret + blackmail.** Knowledge as an asset convertible to a hook (CK3); mutual-knowledge condition.
- **RL21 Scheme with secrecy/discovery.** Potential, advantage, per-month breach chance (100 - secrecy)/10%, agents recruited through relations (CK3).
- **RL22 Loyalty mission.** Test event that converts approval into a durable flag or a loss (ME2); recoverable at a lower bar.
- **RL23 Nemesis log.** Event records feed rank, trait, dialogue and appearance; promotions follow wins (Mordor).
- **RL24 Rank by victory.** Power moves with outcomes of fights among NPCs, not only player fights.
- **RL25 Shaming/humiliation as a lever.** Lowers level, relocates, can break or enrage (Mordor).
- **RL26 Locked bonds survive death/rebirth.** Wildermyth locked romance/rivalry resume; Sims Beloved stops decay.
- **RL27 Exclusivity rules.** One lover, one rival, one blood brother; new bond replaces old (CK3, Wildermyth).
- **RL28 Kin and animal bonds as slow lottery.** Tiny per-event chances to bond (RimWorld 0.4% to 1%), plus mood tied to bonded losses.
- **RL29 Worship / duty as a relationship.** DF deity with levels and a recurring need; a relation can generate a need.
- **RL30 Acquaintance pruning.** DF: unused passing acquaintances dropped yearly when count is 50+.
- **RL31 Death-of-relation stress by relation tier.** CK3 +10 friend, +35 rival.
- **RL32 Transparent reasons UI.** List every modifier with remaining time (RimWorld, CK3) and a breakdown by channel.
- **RL33 Opinion channels.** Separate attraction, vassal, faction, same-dynasty channels so one number is not asked to do everything (CK3).
- **RL34 Diminishing returns near the top.** DF: love rises more slowly as it deepens; RimWorld stack x0.9.
- **RL35 Heart events (big signed deltas).** +250 or -1500 swings tied to story (Stardew); irrecoverable losses are a known complaint.

---

## 3. Recommended layered model for an idle life-sim

Layers, from cheap and always-present to expensive and rare. Each is a field or list on `relationships[a][b]` (directed), reusing the E3 axes (affection, trust, respect, fear, debt) rather than adding new ones.

1. **L1 Familiarity (RL10, RL12, RL30).** One integer 0..100 per pair, grows with contact (shared place and time, chat, work), decays slowly with floors (Stardew style: higher tiers decay faster but have floors, except contractual bonds). Gates who is shown and who can be a target. Prune passing acquaintances when a person has more than N (DF).
2. **L2 Opinion (RL1, RL2, RL4, RL6, RL34).** The E3 formula stays (opinion = affection + 0.5*trust + 0.3*respect - 0.2*fear - 10*grudge). Replace flat memory pruning with timed modifiers: {id, v, until, stackMax, stackFactor 0.9}. Store only a handful per pair (E3 already caps 5). Compute lazily at read, which fits idle play.
3. **L3 Trust (separate from affection) (RL19, RL22).** Trust moves slowly, up by kept promises and shared danger, down hard by betrayal; E3's axis already exists. Trust gates secrets, lending, and loyalty missions, because affection alone should not let someone borrow your sword.
4. **L4 Role-relations (RL9, RL26, RL27).** Typed, exclusive where noted: friend (levels 1 to 5), lover, rival, kin, master/disciple, sworn sibling, liege/vassal, oath-partner. Each has an opinion floor or ceiling, an effect table, and a "locked" flag that makes it survive death. Adopt the Wildermyth thresholds as the starting numbers (20/60/120/200/300) with a compatibility multiplier clamp (0.33 to 3).
5. **L5 Memories (RL6, RL7, RL23).** Max 5 per pair (E3), with the added rule that each memory has a **readback**: it must be cited by a line, a card, or a choice, else it expires early. Add 4-slot sentiments per target for the emotion layer (Sims); the weakest is replaced.
6. **L6 Shared history (RL23, RL24).** An append-only log on both people: events they both attended (battles, crimes, journeys), with tags. It is what generates blood-brother, rival, old-comrade, and "you were there" lines. Cap and compress old entries to a tally.
7. **L7 Obligations (RL19, RL20, RL21, RL22).** Hooks: weak (one use), strong (cooldown), perpetual (oaths, filial, vows). Sources: debts, saved life, blackmail, oath. A secret is a knowledge item convertible to a hook. Obligations decay by clock (10 years weak) except oath-based ones.

**Why this ordering.** L1 and L2 are numbers; L3 to L5 are what makes it feel like a person; L6 and L7 give plot. It also sidesteps the CK3 failure mode (additive bloat) by capping stack counts and by making the displayed opinion be a clamped sum.

### Anti-bloat rules (from complaints)
- Clamp opinion to +-100 and give each modifier a stack cap and a 0.9 stack factor (RimWorld).
- Prefer timed modifiers to permanent ones.
- Provide an optional global "cynicism" offset dial rather than letting positive stacks drift (CK3 modder workaround).
- Do not let a daily chore feel mandatory: give weekly caps or floors (Stardew), never silent permanent loss for absence unless the bond is contractual.

---

## 4. What works idle / offline

- **Lazy relaxation at read (E3 section 9 already does).** Expiry-based modifiers (RL1, RL6) are free: an item past `until` simply is not summed. Decay with floors (RL12) computes in closed form: `max(floor, v - rate*days)`.
- **Contact accrual as an integral.** While away, familiarity increases by (shared hours of co-location) times a rate, capped per day (Stardew daily caps keep it bounded).
- **Rolled events instead of simulated.** For pairs the player is not watching, roll the hostility/affection random interaction on a schedule: insult chance = base * opinionFactor * compatFactor (RL4), and fight chance = 4% per insult (RimWorld numbers as the starting point). Generate at most N per day per far pair.
- **Gifts and visits as scheduled tasks.** Standing orders: "visit X every week", "send a gift to Y on their birthday"; the day's one gift cap and weekly cap (RL13) stay in force.
- **Bond lotteries.** Animal-style tiny per-event bonding chances (RL28) suit offline: 0.1% per 2,500 ticks near master is trivial to simulate as a Poisson draw over elapsed ticks.
- **Schemes as timers.** CK3 schemes (monthly breach chance, discovery at execution) are natively tick-based and resolve in a batch on return, with a log.
- **Nemesis promotions offline.** NPC-vs-NPC contests decide rank (RL24); you can resolve in one pass on return.
- **Do not simulate offline.** Heart events and loyalty missions (RL15, RL22): they are authored scenes. Queue them as cards and hold them until the player is present, or let the in-character autonomy (E3 section 14) pick, with limits on irreversible choices, so the player cannot lose a lover or break a vow while away.

---

## 5. Persistence across lives and worlds

Design principle (from Wildermyth, CK3, Sims, DF worldgen): separate what **belongs to the person**, what **belongs to the pair**, and what **belongs to the line**.

1. **Pair-level locked bonds.** Wildermyth: locked romance/rivalry resume immediately when a hero returns. Same here: soulmate, sworn sibling, blood-brother, nemesis, master/disciple are flagged `locked` and stored on the pair record, surviving death or rebirth of either side; they are reinstated at level 1 or at half level, not zero.
2. **Heirs inherit a prior, not a bond.** CK3: opinion is not inheritable, except predecessor opinion for vassals. Do the same: the heir gets (a) a **predecessor opinion** modifier toward people the parent was close to or hostile with, size scaled (say 30% of parent's opinion, floor/cap +-20), decaying in 5 years, (b) kinship offsets (RimWorld parent +30, sibling +20), (c) inherited hooks: **perpetual** ones (Filial Piety), and **oath debts** (Follower Oath is permanent), and (d) a grudge heritage only when the grudge is severe and tagged `blood` (feud).
3. **Carrier objects.** A relationship can ride on an item or title: oath-sworn blade, family seat, a marriage token. When it changes owner, the pair record rebinds. Stored on the item as `bondsTo: personId`.
4. **Reincarnation and transmigration.** The soul is the carrier: a bond marked `soul` (soul bond, vow) persists across lives for both souls; the other person need not recognise you. Recognition is a separate flag (`remembers`) that can be gated by an ability so that the player knows and the NPC does not (Wildermyth's legacy return, with the twist of E3 section 13 where a regressor's foreknowledge becomes a belief).
5. **Cross-world carriers.** Only three things cross: (a) locked soul bonds, (b) named people who travel (E3 `travel`), (c) memory residue as a **reputation echo** with a cap (a famous deed gives a small opinion offset in a new world, as DF worldgen history pre-seeds friendships and grudges before play).
6. **Worldgen seeding.** Do what DF does: before play begins, simulate N years of cheap events (childhood friends, rivalries from business or sports, religious grudges) so that the starting cast has history. Record the seeding events as shared-history entries so lines can cite them.
7. **Locking policy as a dial.** A per-life switch: "bonds persist" (Wildermyth locked), "bonds fade" (CK3 default), "bonds are re-rolled" (fresh start). Matches the project's solo-player, no-fixed-limits stance: persistence is an adjective per world, not a rule.

---

## 6. How this compares with E3 section 9 (observations only)
- E3's opinion formula and 5-memory cap line up with RimWorld/CK3 patterns. Gaps seen from outside: no per-memory duration beyond halving, no typed role-relations table, no hooks beyond `debt`, no exclusivity rules, no compatibility factor, no sentiment slots, no stack cap per source.
- E3's daily axis relaxation (0.5 per day) is symmetric; Stardew-style tiered decay with floors and RimWorld-style timed expiry may read better. This is a suggestion, not a verified improvement.

---

## 7. Sources
- RimWorld: https://rimworldwiki.com/wiki/Opinion , https://rimworldwiki.com/wiki/Bond , https://rimworldwiki.com/wiki/Romance
- CK3: https://ck3.paradoxwikis.com/Opinion , https://ck3.paradoxwikis.com/Hooks , https://ck3.paradoxwikis.com/Schemes
- Sims 4: https://snootysims.com/wiki/sims-4/sims-4-sentiments-a-full-guide-on-how-they-work/ , https://simscommunity.info/2020/11/10/list-of-all-the-sentiments-in-the-sims-4/ , https://forums.ea.com/discussions/the-sims-4-gameplay-en/full-romance-bar-down-to-hardly-anything/8765371
- Dwarf Fortress: https://dwarffortresswiki.org/index.php/Relationship , https://dwarffortresswiki.org/Personality
- Stardew Valley: https://stardewvalleywiki.com/Friendship
- Persona 5: https://www.pushsquare.com/guides/persona-5-royal-confidants-guide-where-to-find-all-confidants-and-how-to-rank-up-fast , https://www.inverse.com/gaming/persona-5-royal-akechi-confidant-guide
- Mass Effect 2 / Dragon Age: https://masseffect2.wiki.fextralife.com/Loyalty+Missions , https://thelearnedfangirl.com/?p=8236 , https://www.thegamer.com/dragon-age-origins-companion-approval-guide/
- Nemesis: https://www.shacknews.com/article/101634/shadow-of-war---nemesis-system-explained , https://www.rpgsite.net/feature/6192-shadow-of-war-domination-guide-the-nemesis-system-betrayal-death-threats-resurrection-and-more-orc-dominating-mechanics-explained , GDC talk page https://www.gdcvault.com/play/1025150/contactUs
- Fire Emblem: https://gamerguides.com/fire-emblem-awakening/guide/intro-and-gameplay/gameplay/support-relationships
- Wildermyth: https://wildermyth.com/wiki/Relationship
- Kenshi: https://pindrop.gg/kenshi/factions ; Bannerlord: https://en.wikipedia.org/wiki/Mount_%26_Blade_II:_Bannerlord

## 8. Gaps to close if the numbers matter
- CK3 `opinion_modifiers` script files (decay syntax) and `script_docs`: not retrieved.
- Sims 4 point values per social and exact decay rates: not retrieved.
- Persona 5 point costs per hangout and per-rank thresholds: not retrieved.
- Fire Emblem support point values per chapter: not retrieved.
- DAO approval deltas, ME2 loyalty thresholds, Nemesis internal rank formulae: only secondary summaries.
- Bannerlord relation formulas and Kenshi individual loyalty: not found.
