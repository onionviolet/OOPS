# Domain rules

**Accepted 2026-10-18 as standing defaults.** One file for the five domain rulebooks
that Weibao accepted together: body and health (BHR), combat and conflict (CBR),
economy and trade (ECR), skills and learning (SLR), and presence and interaction
(PIR). Merged 2026-10-18 from five files with every code and rule text kept; the
old paths are short pointer stubs so links hold. Router and register:
[RULES_INDEX](RULES_INDEX.md). Each section below keeps its own intro and status
wording, so "Proposal" language inside a section is superseded by the acceptance
note at its top.


## Body and health rules

**Accepted 2026-10-18 as standing defaults** (Weibao: "accept based on base and existing rules"; checked against Rulebook 1–12 and AD1–AD38, no conflict found). Every rule reads as the ordinary case under AD5: a world or feature may propose an exception with an in-world reason and cost. Drafted for
every agent that designs or builds bodies, vitality, injury, illness, poison,
needs, healing, medicine, healers, recovery, aging effects and body change.
Weibao, 2026-10-17: "run a topic-expansion-audit round on body, health, injury
and medicine (G1), saving the palette and a proposed rulebook."

Each rule names the mistake it prevents. Rules marked **(accepted)** restate an
existing accepted decision (AD38, things work by how they work, accepted
2026-10-17, binds BHR21 and BHR30) and bind now through that decision; the rest are now accepted by the 2026-10-18 decision. Sources: AD13, AD19 and related AD lines in the
[rules index](RULES_INDEX.md), the
[part 35 palette](worlds/world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md)
(H35 codes) and [round 1 of the body and health palette](BODY_AND_HEALTH_CONSIDERATIONS_2026-10-17.md)
(BHC codes). Mechanics, numbers and slices in those palettes stay proposals;
these rules constrain them. Every rule is a default; a world may state an
exception with an in-world reason and cost.

### Bodies and carriers

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| BHR1 | **Pointer: AD13.** Bodies are real (accepted). | A reskinned human for every species |
| BHR2 | **Put each harm on its actual carrier:** flesh, channels or energy body, mind, soul, or a held power instance. Healing one layer does not promise another. (H35M12) | One "heal" that silently restores soul, memory and curse damage |
| BHR3 | **Every fact names its scope** (GHS44: body, mind, soul, line, record) before it gets a save field. Body facts stay with the body and are keyed by body instance; mind and soul facts follow their carrier. (Today's simulation conditions are keyed by actor, lane B1-X6.) | Injuries lost on possession or wrongly kept on rebirth |
| BHR4 | **Each body kind declares its harm channels and its repair kind.** Organic bodies heal, constructs are repaired, spirits reform, plants regrow, all under one integrity contract. (BHC19) | A separate health engine per species, or a golem catching a cold |
| BHR5 | **HP, injury, illness and condition are different things.** HP is immediate strain; injury names damaged function; illness is an ongoing process; condition is the engine record for any of them. (H35M1) | Full HP read as "nothing wrong" |

### Truth and knowledge

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| BHR6 | **Own shown numbers are exact (accepted, AD8); unexpressed conditions are world truth.** A dormant or hidden condition becomes visible through a sign, a test or a fitting means, then is shown exactly. (BHC13) | Status windows that leak a sealed curse, or own HP shown as "???" |
| BHR7 | **Symptoms come before diagnosis.** The character reports what they feel and see with source and confidence; a diagnosis is a claim from an exam or means. (H35U1) | Author disease IDs printed on first cough |
| BHR8 | **Medical knowledge is a claim with a source.** Texts, teachings and opinions can be wrong; testing settles them. (BHC14, SR claim rules) | Every herbal treated as correct |
| BHR9 | **Reveal cheats and senses state the layer and precision they read.** (BHC16, AD26) | A flesh scan that sees soul wounds for free |

### Harm and cause

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| BHR10 | **Harm comes from an actual cause, recorded on the condition.** Ambient illness needs a named world reason. (BHC22, AD25) | "You got sick" with nothing to prevent |
| BHR11 | **Disclose before a lasting consequence.** Show the known risk, the local rule and a retreat or care route before an action that can leave permanent harm. (H35D2) | The first lost limb being the warning |
| BHR12 | **Severity is an adjective set per world and body.** One condition definition, with recovery time and impairment scaled by the world's healing level and the body's pace. (BHC23) | Fixed numbers that make a cultivator's scratch as slow as a farmer's |
| BHR13 | **Injury degrades control before it removes a verb.** It lowers the same control numbers a worse tool lowers and blocks a verb only past a severity the condition names. (BHC2) | Every scratch stopping every routine |

### Recovery, defeat and death

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| BHR14 | **Pointer: AD19.** Forgiving recovery (accepted). | Defeat as a hidden permanent tax |
| BHR15 | **Lasting injuries from defeat are a difficulty setting,** explained when chosen and applied to future play (AD21). (BHC21) | Battle Brothers harshness by default |
| BHR16 | **No hunger death; food is a boost (accepted).** Unfed ordinary play stays comfortable. Read as the ordinary case under AD5: an exception needs Weibao's direction plus an in-world reason and forewarning. | Survival-meter pressure in an idle game |
| BHR17 | **Unconscious, critical and dead are different states,** each with its own rules and rescue window. A counter named "deaths" is not terminal death. (H35D3, H35C2) | Old defeat counts read as mortality |
| BHR18 | **Lethal transitions wait at a reviewable boundary while away, by default.** Safe recovery can proceed; worsening caps at a nonlethal care-needed state until the player returns. Dial: a harsher setting or world the player chose with a forewarning (AD19, AD5) may let away time carry real danger. (H35I2, lane B1-X2) | Coming back to a dead character after closing the browser |
| BHR19 | **Pain relief, tissue repair, restored function and a cured cause can finish at different times.** Show the next useful milestone. (H35M10) | "Healed" meaning four different things |

### Medicine and treatment

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| BHR20 | **Medicine is making.** Remedies, surgery, implants, grafts and body runes use the making rules (MR1–MR36) with the body as substrate and the result as a condition with maker and provenance. (BHC9) | A separate surgery engine that ignores the making envelope |
| BHR21 | **A remedy works by how it works (accepted, AD38; MR1).** If its method reasonably works on this body by the mechanisms in play, it works, whether or not the healer understands it, the remedy was meant for this use, or it is on any list. Belief changes forecasts and names; belief heals only where the world's mechanism lets belief act. (BHC7, BHC32, BHC34) | Correct folk remedies that do nothing because unappraised; off-label uses refused by a target list |
| BHR22 | **Healing declares its cost and where the harm goes:** consumed, transferred, displaced, delayed or stored. (BHC10, MR5) | Free regrowth loops; transfer healing with no home |
| BHR23 | **One authority resolves combined effects** through declared interaction tags (stacks, cancels, amplifies, toxic together), and one owner holds each tolerance. (BHC11, lane B1-X7) | Each potion checking every other potion ad hoc |
| BHR24 | **Treating another person needs their consent or a declared emergency rule.** Care builds ties only when it actually happened. (BHC12, H35M11) | Affection or ownership standing in for consent |
| BHR25 | **Action text names the specific outcome:** restores HP, clears this condition, eases pain, repairs this function, with stock, time and cost. (H35U3) | One misleading "Heal" button |
| BHR26 | **Free rest and basic care stay workable beside faster paid options.** (H35T6) | Poor starts locked out of recovery |

### Work, time and idle

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| BHR27 | **A verb's requirements list body function, instrument and know-how together,** with the same missing-piece wording. (BHC1, TQ2, TQ6) | Three different "why can't I" messages |
| BHR28 | **Routines may reroute around injury through the chosen policy and actual means.** Stop at an important unresolved choice or when no permitted-by-policy fitting routine remains (AD16). (BHC6) | Silent idle loss, invented player choices, or work ignoring a broken arm |
| BHR29 | **Bodies wear and condition from meaningful work** using the tools wear shape; conditioning is a body fact, know-how is a mind fact. A carried skill in a new body keeps knowledge and recalibrates control. (BHC3–BHC5) | Rebirth wiping skill, or a new body moving exactly like the old one |

### Worlds

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| BHR30 | **Carried remedies and diseases work wherever their mechanism works (AD38).** A potion that draws on its own stored power works in a world without magic; one that needs ambient mana weakens or fails where there is none, because the mechanism is missing, not because of a label. Plain chemistry follows local physics. Cross-world contagion is off by default and enabled by a setting or story. (BHC17, BHC18, BHC33) | Potions that silently fail or silently work everywhere; plagues the player never chose |

### Open details

These stay open in the palettes: exact rates, severity bands, the first slice,
the condition interaction tag list, per-world healing levels, and which worlds
suppress which power types. Part 35's five cheapest slices (H35S1–H35S5) remain
the ranked proposals for a first build.

### Cross-audit application, 2026-10-18

BHR18/BHR28 use the shared routine stop and transaction owners, not a separate
health clock or blanket automatic reroute. A reroute follows the player's chosen
policy and actual available means; important unresolved choices still pause
under AD16. Unknown poisons and injuries act through truth (MR1); shown stop
reasons and diagnoses remain means-limited (AD6, AR8). Condition durations name
the affected body/faculty clock, including when the surrounding world is paused.
Multiple bodies need not share one personal age. See [G26–G28](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18).
This clarifies the proposed application; no health slice is selected.

## Combat rules

**Accepted 2026-10-18 as standing defaults** (Weibao: "accept based on base and existing rules"; checked against Rulebook 1–12 and AD1–AD38, no conflict found). Every rule reads as the ordinary case under AD5: a world or feature may propose an exception with an in-world reason and cost. Drafted for
every agent that designs or builds fights, encounters, enemies, weapons in use,
defeat, fleeing, pursuit, captives, duels, war or nonviolent conflict. Weibao,
2026-10-17, accepting the gap survey's topic-expansion-audit rounds; this is G2,
combat and conflict.

Each rule names the mistake it prevents. Rules marked **(accepted)** restate an
existing accepted decision and bind now through that decision; the rest are now accepted by the 2026-10-18 decision. Sources: AD lines in the [rules index](RULES_INDEX.md), the
[body and health rules](DOMAIN_RULES.md) (BHR), the
[tools palette](TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md) (TQ, IP) and
[round 1 of the combat palette](COMBAT_AND_CONFLICT_CONSIDERATIONS_2026-10-18.md)
(CBC, CBX). Mechanics, numbers and slices there stay proposals; these rules
constrain them. Every rule is a default; a world may state an exception with an
in-world reason and cost (AD5).

### Outcomes and defeat

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| CBR1 | **Pointer: AD19.** Forgiving recovery (accepted). | Defeat as a hidden permanent tax |
| CBR2 | **Every fight ends through one outcome publisher** with a typed outcome (unconscious, knocked out, yielded, routed, captured, withdrew, escaped, killed where allowed) and a separate cause. All code paths call it. (CBC1, CBC2, CBX1) | A body or law setting that works in one fight type only |
| CBR3 | **Winning has outcomes too:** killed, knocked out, let go, surrender accepted, captured, drove off. Loot and harvest follow the outcome. (CBC3, MF4) | A pelt taken from a neighbor who yielded |
| CBR4 | **What a winner does with the loser follows the winner's means and motive** (AD6, AD25), within the recovery floor of CBR1. (CBC5) | Every defeat ending in the same generic penalty |
| CBR5 | **Unconscious, downed, critical and dead are different states** with their own windows (BHR17); counters say which they count. (CBC4, CBX5) | Old unconsciousness counts read as deaths |
| CBR6 | **World danger and player recovery are separate dials.** The world card states how lethal defeat usually is; the recovery setting decides how much of it lands; a harsher world forewarns at entry. (AD19, CBX4, CBC37) | World cards and AD19 contradicting each other |
| CBR7 | **Pointer: AD20.** Locally unwinnable fights (accepted). | Every threat tuned to be beatable on the spot |
| CBR8 | **Fated characters survive through in-world agents** (escape, rescue, capture), and losing that fate removes the protection. (CBC6) | Invulnerable protagonists or scripted saves |

### Threats and enemies

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| CBR9 | **Threats develop from their actual causes (accepted, AD25).** Strength is source-authored; places and eras set danger. (CBC41) | Enemies that level with the player |
| CBR10 | **Beaten obstacles stay beaten (accepted, AD28).** A zone respawns from a stated source, and removing the source can stop it. (CBC7) | Endless waves with no reason |
| CBR11 | **Enemy difficulty comes from mechanisms and counters,** not only bigger numbers (Weibao, RNG and enemy systems). | Bosses that are just inflated HP |
| CBR12 | **Enemy templates describe actual yielding, fleeing, tracking and capture means.** Tags summarize modeled faculties rather than forbidding an otherwise supported mechanism (AD38). (CBC29, CBC30) | Animals negotiating without means, or a capable tracker disabled by a missing tag |

### Knowledge

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| CBR13 | **Pointer: AD8.** Learned opponent numbers, exact own stats (accepted). (CBC20, CBX3) | Full enemy stat blocks on first sight |
| CBR14 | **Intent, weakness and hidden abilities are learned fields** with source and confidence, per kind and per individual. (CBC20, CBC21) | Opponent 2 assumed identical to opponent 1 |
| CBR15 | **Fights are evidence for both sides.** A survivor learns your methods and can tell others through a real channel (AD6). (CBC22) | Fleeing enemies who forget everything |
| CBR16 | **Deception writes wrong beliefs, not wrong truth** (AD7). (CBC23) | Feints implemented as hidden stat modifiers |

### Weapons and gear

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| CBR17 | **Weapons are instruments.** They enable combat verbs with control numbers through the same profile shape as tools (TQ1, IP1). (CBC8) | A second stat path for weapons beside tools |
| CBR18 | **Things work by how they work (accepted, AD38).** Improvised weapons, off-label techniques and unplanned tactics work if the mechanisms in play reasonably support them, at their real cost and control. (CBC11, CBC38) | A permission list of what counts as a weapon or tactic |
| CBR19 | **Gear wears from what actually happened** (hits, blocks, parries, hard armor), and each instrument states what zero condition means. (TQ9, CBC9, CBC10) | Silent 10% swings from a "broken" sword |
| CBR20 | **Bonded or living weapons take conditions, not wear,** and heal by their own repair kind (BHR4, TQ141). (CBC13) | Sharpening a soul blade |
| CBR21 | **Power held in a weapon acts by its own law** and does not pass to a new wielder unless the world says so (TQ1). (CBC14) | Borrowed blades granting their owner's techniques |

### Bodies

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| CBR22 | **Injury lowers the same control numbers a worse weapon lowers** before it blocks a verb (BHR13). (CBC15) | Every scratch stopping the fight, or no effect until zero HP |
| CBR23 | **Disclose lasting risk before engaging** with a retreat route (BHR11). (CBC17) | The first lost limb being the warning |
| CBR24 | **Lasting injury from defeat is a difficulty setting** (BHR15), applied through the CBR2 publisher. | Injury rules that apply in native fights but not duels |

### Leaving, idle and away

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| CBR25 | **Leaving a live fight is a choice with a cost,** with a comfort setting that keeps a free exit (AD21). By default pursuit follows actors that can track. (CBC28, CBC29) | Free walk-outs, or every rat chasing you home |
| CBR26 | **Idle fights run on a stated policy paid from real stock;** no stock means the policy withdraws. (CBC24) | Free infinite idle combat |
| CBR27 | **Away combat stops at a downed state, a lasting-harm risk or a new kind of enemy** unless a harsher forewarned setting says otherwise (BHR18, AD16). (CBC25) | Returning to a dead or maimed character after closing the tab |

### Conflict beyond killing

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| CBR28 | **Captives remain people** with identity, relationships and legal status; what happens to them writes facts. (CBC31) | Prisoners as loot |
| CBR29 | **Killing writes law and memory:** witnesses, grudges and legal response, scaled by local law and licence. (CBC33) | Body counts with no social trace |
| CBR30 | **Conflict is wider than combat.** Debates, negotiations, intimidation and trials use the same outcome model, and most conflicts offer a nonviolent route where the opponent's motive allows. (CBC34, CBC35) | A life-sim where only fighters have stakes |

### Open details

These stay open in the palette: the outcome enum's final list, wear rates, the
flee check, the idle policy fields, per-world lethality and outs numbers, body
part depth, morale for the solo player, and the first slice. The palette's LATER
list (CBL1–CBL10) holds the ranked proposals for a first build.

### Cross-audit application, 2026-10-18

CBR2/CBR3 publish outcomes at the selected encounter's declared resolution
boundary. Reflect, rescue, healing and mutual defeat enqueue through the existing
transaction owner (AR3); callback registration order is not a combat rule.
Check one composed outcome rather than adding a test for every rule sentence.

CBR27 safety stops can inspect real consequences without granting the player
knowledge of their hidden cause. Watch lists are a separate policy input;
observer-safe explanations follow AD6–AD9/AR8. CBR25 withdrawal and interrupted
work settle actual spent/held resources before resumption (AR7, MR5).
CBR12/CBL7 capability tags summarize modeled faculties: a creature with actual
tracking means can track under AD38 even if a template omitted a selector tag.
See [G26/G28/G29/G30](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18).
Concrete ordering and policies remain proposals, not a newly selected fight slice.

## Economy rules

**Accepted 2026-10-18 as standing defaults** (Weibao: "accept based on base and existing rules"; checked against Rulebook 1–12 and AD1–AD38, no conflict found). Every rule reads as the ordinary case under AD5: a world or feature may propose an exception with an in-world reason and cost. Drafted for
every agent that designs or builds money, prices, merchants, trade, currencies,
credit, property, wealth and carryover of wealth. Weibao, 2026-10-18: "we might
want a core rules audit for rules accordingly", after five rounds in the
[markets palette](gm/dispatch/procgen-2026-10-13/p11/REQUESTS_AND_MARKETS.md).

Each rule names the mistake it prevents. Rules marked **(accepted)** restate an
existing accepted decision and bind now through it; the rest are now accepted by the 2026-10-18 decision.
Sources: AD lines in the [rules index](RULES_INDEX.md), the markets palette
(N, M, A codes), [OD11 EC1–EC5](worlds/MULTIVERSE_STRUCTURES.md#od11-local-economies-and-cross-world-value-2026-10-15)
and the [economy palette](ECONOMY_AND_TRADE_CONSIDERATIONS_2026-10-18.md) (ECC).
Every rule is a default; a world may state an exception with an in-world reason
and cost (AD5).

### Markets and prices

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR1 | **Pointer: AD27.** Local economies, intended arbitrage (accepted). (EC1, M16) | Prices normalized across worlds, or arbitrage treated as an exploit |
| ECR2 | **Selling to a local merchant is the default sink.** Transit, route risk and supply chains are added only where a world or player moves goods between markets. (M1) | A logistics simulation required before anything can be sold |
| ECR3 | **Price response is a per-good, per-place curve with a stated reason:** flat for fast-cycling staples, falling for durables, rising with reputation or trend, shifting for dated events. (M2) | One downward saturation curve for every good |
| ECR4 | **One reconciled quote formula** carries every price input; nothing stacks a new factor beside it. (N2, A9) | Saturation, haggling and scarcity multiplying into nonsense |
| ECR5 | **A price movement shows its cause** as the player knows it. (M5.4) | Unexplained decay that reads as a penalty |
| ECR6 | **Prices follow a reference basket per world** (meal, lodging, day's wage, basic tool). Exchange rates belong to each merchant or changer with a spread; comparing baskets only gives a designer's starting point. (ECC2, ECC3, ECX6) | Prices invented item by item, or one global rate that canon contradicts |

### Buyers and channels

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR7 | **Several channels can offer real choices:** convenience buyers, specialists, volume buyers, services, consignment and standing orders. Which wins follows local mechanisms; dominant means remain possible (AD28, AD38). (M3, M4, M10, M5.2) | Identical channels with no useful distinction, or forced balance overriding world law |
| ECR8 | **Buying and selling stay asymmetric by default,** so a full purse does not replace gathering and making. Worlds such as System shops may loosen this, and making then earns its place through quality and custom work. (M6) | Crafting made pointless by a shop that sells everything at fair prices |
| ECR9 | **Merchants price from what they can judge or believe.** Knowingly valuing a hidden property needs appraisal; bundle pricing, speculation and mistakes remain possible. A quote does not certify hidden truth. (N2, A7, AD6–AD9) | Prices leaking sealed truth or merchants acting omniscient |
| ECR10 | **Selling never destroys an item silently.** Sold goods enter the buyer's stock and can be bought back, and unique or quest items ask first and stay recoverable. Today a trader refresh deletes sold goods, so retention comes first. (M9, ECX3) | One misclick permanently losing a story item |
| ECR11 | **Repetitive selling can be automated** with rules that skip equipped, locked, quest and unique items and log their runs. (M8, A11) | An idle game with a manual-sale chore |
| ECR32 | **A merchant who can't buy says why** and names the alternatives (come back, consign, sell elsewhere). Purse state is shown as far as the player knows it. (ECC27) | Hidden caps that feel like bugs |

### Money and currencies

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR12 | **Money is whatever a world treats as money:** coin, commodity, power-bearing, institutional credit, System currency, social or metaphysical. Each states where its value comes from, and that decides whether it travels. (M13) | Every world defaulting to gold coins |
| ECR13 | **Universal currencies exist where an issuer or network spans worlds;** carried valuables keep value wherever the destination values them. (M7 correction, M16) | Treating locality as a wall |
| ECR14 | **Value depends on recognition, usability and access.** An item's price changes when a world learns what it is and whether its mechanism works there. (M14, AD38) | A mana crystal priced the same in a world with no way to use it |
| ECR15 | **Every monetary creation/destruction has a cause; transfers settle actual currency and custody once.** Intended money engines, asymmetric valuation and arbitrage remain allowed. This is accounting, not a universal conservation law for economic value. (ECC4, N5, AD22, AD27) | Coin/items duplicated or lost through publication; profitable trade mistaken for a bug |
| ECR16 | **One money authority:** one purse per currency and transactions through one seam. Use exact units appropriate to that currency and a plan for very large values. (ECC25, ECX1, A10, A15, A18; a target: 14+ direct writes exist today) | Features writing money directly, rounding loss and overflow in long idle runs |
| ECR33 | **Each currency states its time horizon** (now, this life, next life), and each reset states what happens to every horizon. (ECC29, ECC21) | A prestige reset silently deleting an economy |

### Wealth, exposure and safety

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR17 | **Wealth is information first.** Someone has to see or hear of it, the knowledge spreads within a scope and at a rate, and belief can differ from truth. (M25, SR) | Automatic theft rolls on carried gold |
| ECR18 | **Known wealth has many responses,** and theft needs an agent with motive, means and opportunity. A safe world can have none. (M25, M19 correction) | Thieves as a universal tax on success |
| ECR19 | **Losses move goods to a recorded destination** (thief, fence, lender, collector), and offline losses always appear in the recap. (A20, A8) | Silent drains while the player is away |

### Institutions, credit and law

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR20 | **Institutions are world data, and absence is valid.** Taxes, tolls, banks, guilds and changers exist where a world's society made them. (M26, M20 correction) | Every world getting a tax collector |
| ECR21 | **Credit has dated terms and forgiving defaults.** Missing a payment has in-world consequences, never a hidden game over. (M18, AD19) | Debt as an unannounced fail state |
| ECR22 | **A promise binds through its enforcer:** handshake, contract, guild, oath or System. With no enforcer, reputation is the only one. (ECC15, AD14) | Contracts that enforce themselves with no in-world agent |
| ECR23 | **Fraud and counterfeits write wrong beliefs, not wrong truth** (AD7). Appraisal and experience defend. (ECC16) | Scams implemented as hidden stat changes |

### Property and work

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR24 | **Owned things may give passive bonuses (accepted, AD31).** Ownership, custody and use stay separate, and property has upkeep and income. (ECC5, ECC6) | A deed acting as if you were standing in the house |
| ECR25 | **Property and wealth left in a world stay in that world** (AD4), changed only for dated reasons. (ECC7, M27) | A returning player finding their house reset or deleted |
| ECR26 | **Every world with money has an honest baseline income** tied to its basket, and other ways of earning compete with it. (ECC8) | A world where crafting is the only way to afford anything |

### Carryover and progression

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR27 | **Wealth crosses a life or world only through a carrier (accepted, AD11),** at the carrier's own valuation, with modest carryover by default and better carryover earned. (M27, continuation owner) | Free full carryover, or none at all |
| ECR28 | **Before an ending, the player sees what is likely to carry** as far as they know it; after it, the new start names what came from the old life. (M28, SC4) | Endings that feel like deletion |
| ECR29 | **Cross-save legacy starts are labelled settings,** read only an export and never touch the source save. (M27, A26, AGENTS safety) | A meta feature that corrupts or reads private saves |

### Balance and fun

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| ECR30 | **Grow the sinks, don't throttle income.** Each scale of wealth opens new things worth buying, a broken money engine is a payoff, and pushback comes from in-world agents with reasons (AD22, AD38). (M5, M24, ECC20) | Nerfs and invisible caps instead of new play |
| ECR31 | **The economy is optional to living.** A character can thrive without commerce, and economic depth is chosen per world and activity (CX1–CX8). (ECC1) | A life sim that requires running a business |

### Cross-audit application, 2026-10-18

ECR7's "none wins in every case" describes a useful ordinary design, not forced
balance: a world or exceptional means may produce a dominant channel (AD28,
AD38). ECR9 means merchants cannot knowingly price a hidden property without
appraisal; they may still pay for a bundle, rumor, option or mistaken belief.
A high quote alone does not certify the hidden truth (AD6–AD9, MR31).

ECR15 conserves transferred money/goods through one owner; creation, destruction
or conversion follows the actual mechanism and its source/sink, not a universal
ban on profitable or free outcomes (AD22/AD27). ECR16 integer units belong to
currencies whose divisibility supports them, not a forced coin model for every
metaphysical currency. Deferred sales/services settle spent versus reserved
value on interrupt (AR7); current atomic trades need no staged-job conversion.
Refresh/expiry uses the market's owning clock, and an away stop must not reveal
a merchant's hidden appraisal or purse (AR8). Proposed mechanisms retain their
status. See [G26–G30](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18).

## Skill and learning rules

**Accepted 2026-10-18 as standing defaults** (Weibao: "accept based on base and existing rules"; checked against Rulebook 1–12 and AD1–AD38, no conflict found). Every rule reads as the ordinary case under AD5: a world or feature may propose an exception with an in-world reason and cost. Drafted for
every agent that designs or builds skills, methods, techniques, practice,
lessons, teachers, manuals, talents that change learning, rust, skill loss, and
what skills do across lives, bodies and worlds. Weibao, 2026-10-18, on gap G3:
"work on /more-to-consider on this and implementation and improvement and more".

Each rule names the mistake it prevents. Rules marked **(standing)** or
**(accepted)** restate an existing rule or accepted decision and bind now through
it; the rest are now accepted by the 2026-10-18 decision. Sources: [round 1 of the skills and learning
palette](SKILLS_AND_LEARNING_CONSIDERATIONS_2026-10-18.md) (SLC codes),
[Skills and talents](SKILLS_AND_TALENTS.md), [skill mechanisms and
means](worlds/SKILL_MECHANISMS_AND_MEANS_2026-10-13.md) (M codes),
[making rules](MAKING_RULES.md#mastery) and the [continuation
owner](worlds/CONTINUATION_CHOICE_CONSIDERATION_2026-10-13.md) (CA2). Every rule
is a default; a world may state an exception with an in-world reason and cost.

### Layers

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR1 | **Competence has layers on different carriers:** understanding (memory), fluency (the body or faculty the practice shaped), source (core, pool, pact, grant; its own custody) and expression (derived now from body, tools and world). A world may collapse them when they never come apart. (SLC1–SLC3) | "Level 7 swordsman" meaning the same thing in a baby's body |
| SLR2 | **Pointer: MR21.** Mastery improves control, not truth (standing). | Skill that changes what iron or an herb is |
| SLR3 | **Expression needs actual means (accepted, AD6, AD38, CA2).** A method works wherever its mechanism works, and only there. | Skills that work by label in a world without their mechanism, or fail by label where the mechanism is present |

### Gaining

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR4 | **Every gain has a cause** (practice, instruction, text, demonstration, failure, insight, absorption, grant), and the cause decides which layer moved. Record the cause when a later system reads it. (SLC5) | Skills that appear with no answer to "where did that come from?" |
| SLR5 | **New information grows understanding; repetition grows fluency.** Harder variants, new materials, readable failures and corrections teach new things (standing, MR22: an identical observation reveals nothing new). Plain repetition keeps making the work faster, cheaper and steadier on a diminishing curve (standing, MR21; accepted, AD38). (SLC6, SLC78–SLC80; corrected 2026-10-18 round 3, SLX1) | Infinite knowledge from one repeated click, or practice that stops paying for no reason |
| SLR6 | **Feedback is a means.** Teachers, measuring tools, partners and readable outcomes raise what practice yields. (SLC7) | Tools and teachers that add nothing to learning |
| SLR7 | **Learning rate is an adjective** per world, body, skill and talent: challenge band, consolidation, aptitude. No universal formula. (SLC8, SLC9, SLC11) | One XP curve forced on every world |
| SLR8 | **Grants and aptitudes name the layer they give or multiply.** (SLC10, SLC11, SLC33) | A crossing that cannot tell whether a learned spell carries |

### Holding and losing

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR9 | **Loss names its layer and cause.** Ambient decay needs a world reason. (SLC13) | Skills that drop with nothing to prevent or repair |
| SLR10 | **Rust is a per-world dial, off by default.** When a world turns it on, it hits fluency by default, with a stated reason. (SLC14) | Upkeep chores in an idle game |
| SLR11 | **Regaining is faster than first learning (savings)** while understanding remains; the rate is a world and body dial. (SLC15) | Rebirth, rust and recovery that reset to zero |
| SLR12 | **Injury and body change lower expression before mastery** (pairs with proposed BHR13). Healing restores it; a lasting change may need adjustment practice. (SLC16) | A broken arm deleting swordsmanship |
| SLR13 | **Taken skills are conserved where the mechanism is transfer;** seals block expression and leave the skill in place. The simulation's copy and transfer operations are the model. (SLC17) | A stolen technique that vanishes from the universe |

### Teaching

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR14 | **Teaching passes understanding and feedback;** the student still builds fluency. A means that transfers fluency or memory directly works by its mechanism and says so. (SLC20, AD38) | Paid lessons that hand over finished mastery |
| SLR15 | **Teachers teach only what they hold, through means (accepted, AD6).** Teaching ability is its own competence. (SLC21) | Every NPC as an omniscient tutor |
| SLR16 | **Lessons are transactions** with consent, price, time and access, and guarded methods have keepers. (SLC24) | Free instant teaching from anyone present |
| SLR17 | **Pointer: MR23.** One learner resolver for everyone (standing). (SLC25) | Two learning economies and two balance passes |
| SLR18 | **Texts are claims with a source** and can be wrong or partial; testing settles them. (SLC26, BHR8) | Every manual treated as correct |
| SLR19 | **Rank and competence are separate facts.** A certificate, rank or office is recognition and access, not skill. (SLC27) | Revoking a title erasing what someone can do |

### Carrying across lives and worlds

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR20 | **Carry follows world and means (accepted, AD11, CA2).** Proposed default: understanding follows memory; fluency follows the body or faculty practice changed; sources and tools follow custody. Different carriers work through their actual mechanisms (AD38). (SLC28) | Full power copied or erased by a universal body-only assumption |
| SLR21 | **Carried understanding regrows fluency at a savings rate** in the new body, up to the remembered level by default. (SLC29) | Rebirth as either a free power copy or a pointless reset |
| SLR22 | **A carried skill without a mechanism in the current world is dormant:** known, shown and unexpressed, with a reason the character can know. Erasure needs a world reason and a warning. (SLC30, SLC35) | Skills silently deleted at a world border |
| SLR23 | **Methods can outlive their learner** through students, records and institutions, and later lives meet them as world facts. (SLC31) | Teaching with no lasting effect |

### Knowing and showing

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR24 | **Own skill numbers are exact (accepted, AD8);** the layer split appears once it exists. Others' skills are learned through means. (SLC34) | "???" on your own skills, or clutter on vanilla play |
| SLR25 | **Hidden and emergent skills surface through use or a fitting means (accepted, AD3).** (SLC35) | A skill list that spoils a world's secrets |
| SLR26 | **Away-time learning is batched in the recap (accepted, AD17).** (SLC36) | Forty level-up toasts on return |

### Implementation

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR27 | **One authority per learning fact; project, don't merge.** Native skills keep `skill_progress`, simulation methods keep `powers`; new learning facts go in a namespaced slice (AR6) with their layer and carrier named, and native XP needs no migration. (SLC37, SLC41, SLN1–SLN4) | A third skill store, or a migration of every old save for a design lens |

### Round 2 additions, 2026-10-18

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR28 | **Error is learnable.** Practice without feedback can build fluency in a mistake, and unlearning costs more than learning fresh, where a skill opts in. (SLC53) | Every repetition counting as progress |
| SLR29 | **A drill cap names its next route** (a harder drill, a teacher, a text, insight). (SLC68, MR24) | Prototype caps read as world law |
| SLR30 | **Reputation and competence update from different causes.** Others' belief in your skill comes from what they saw. (SLC47–SLC48, AD6) | NPCs who know your exact level by magic |
| SLR31 | **Prestige, rebirth and continuation share the layer carry rule** (SLR20); each reset declares survival per layer. (SLC69) | Three inconsistent answers to "what do I keep?" |
| SLR32 | **Insight and epiphany draws are seeded** in the save's RNG context (accepted, AD22, Rulebook 9). (SLC73) | Reload-scumming for a breakthrough |
| SLR33 | **Consequences for forbidden teaching come from in-world agents with reasons,** not game-level blocks (accepted, AD38). (SLC76) | A permission list on what may be taught |

### Round 3 additions, 2026-10-18

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| SLR34 | **Repetition gains diminish smoothly and do not stop by default;** a plateau is a world or skill dial and names what lifts it. (SLC80–SLC81) | Hard drill walls read as world law |
| SLR35 | **Real work is repetition too,** slower learning than a drill but paid in goods. (SLC82) | Drills as the only way to improve |
| SLR36 | **Memory means state take, copy or seal and the parts of memory they reach;** taken memory is conserved. (SLC88–SLC91, SLR13) | A "memory theft" that vanishes knowledge or grants full mastery by label |
| SLR37 | **Memory loss removes understanding, not fluency,** and memory gain gives understanding, not fluency, unless the means also changes the body. (SLC88–SLC89) | Stolen techniques as instant mastery |
| SLR38 | **Reading memories is appraisal through means (accepted, AD6),** and sealed truths stay behind their discovery route. (SLC92) | Mind reading as a spoiler machine |
| SLR39 | **The player's own memory loss is forewarned and recoverable by default,** with a known record of what was lost. (SLC97) | Silent loss of what the player built |

### Cross-audit application, 2026-10-18

SLR1/SLR20's body fluency is the default carrier model, not an accepted universal
claim that all fluency stays with flesh. AD11 accepts means-based carryover;
a soul, construct, copied faculty or loop may retain a different layer through
its actual mechanism (AD38). SLR37 follows the same qualification: transferring
a memory that also changes a faculty can affect execution, with that cause named.

Practice/lesson progress uses the learner or faculty's owning clock; teacher,
stock and place requirements use their actual clocks and custody. Interruption
settles spent tuition/effort and unspent reservations, retaining learned facts
at the real completed boundary (AR7). A frozen-world credit does not conjure a
teacher's participation. Apply [G27/G28/G30](reviews/SUBTLE_RULE_GAPS_2026-10-18.md#round-4-latest-audits-together-2026-10-18)
only when that seam is selected. Proposed layer schemas and new slices stay
proposals; this pass adds no native XP migration.

## Presence and interaction rules

**Accepted 2026-10-18 as standing defaults** (Weibao: "accept based on base and existing rules"; checked against Rulebook 1–12 and AD1–AD38, no conflict found). Every rule reads as the ordinary case under AD5: a world or feature may propose an exception with an in-world reason and cost. Drafted for
every agent that designs or builds who and what is present in a place, how the
player selects a person, station, event or way out, and how verbs act on them.
Weibao, 2026-10-18: "basic rules and more to help this get implemented?", after
nine rounds in the
[Around you considerations](AROUND_YOU_SUBJECT_ACTIONS_CONSIDERATIONS_2026-10-18.md)
(S, AY, AT, ST, ID, LP, AI and TF codes).

Each rule names the mistake it prevents. Rules marked **(accepted)** restate an
accepted decision or standing rule and bind now through it; the rest are now accepted by the 2026-10-18 decision. Every rule is a default; a world may state an exception with an
in-world reason and cost (AD5). The first build slice is in the
[S1-S4 packet](gm/dispatch/around-you-2026-10-18/S1_S4_PACKET.md).

### Presence

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR1 | **One home for who and what is here.** Around you lists people, stations, events and ways out for the current place. No other surface lists the same subjects at the same time (UR42). (S3, S4) | Two menus reaching the same people, as with the Talk dropdown |
| PIR2 | **Presence follows the world's own clocks.** Schedules, travel and events decide who is here; the list reads that state and never invents it. (TP1, ID9) | A list that drifts from where people actually are |
| PIR3 | **Absent people live elsewhere.** Known people who are not here appear in "People you know" with last seen and its age, never greyed in the here list. (AY31) | Here lists cluttered with people who are not here |
| PIR4 | **Companions are "With you", locals are "Here".** Travelling with the hero keeps a separate group. (AT7) | Companions vanishing on travel or mixing with locals |
| PIR5 | **Show only what the hero knows (accepted, sealed secrets, AD6, SR5).** Subjects, events and dates appear as known claims; sealed truths stay sealed. (TF6) | The list leaking an unmet person, a hidden event or a changed canon date |

### Selecting and acting

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR6 | **Pointer: UR35.** Selecting is free (accepted). | A click to read details that starts a conversation |
| PIR7 | **Verbs live in the bottom Actions panel.** A selected subject's verbs pin to the top of Actions; place verbs follow. Conversations render there too, so the act and its result share one place. (S1, S2) | Verbs split between the inspection card and the action panel |
| PIR8 | **One function per verb.** Every route to a verb (subject group, dialogue option, command, keyboard) calls the same native function with the same eligibility checks. (AY28, LP9, AT9) | Trade from the card and trade from dialogue behaving differently |
| PIR9 | **Unavailable verbs say why.** A blocked verb stays visible with its reason; a verb that would interrupt running work names what it stops. (AY2, ID3) | Silent grey buttons, or verbs that cancel a routine without warning |
| PIR10 | **Talking is always allowed for a displayable person.** Repeats cost time, not permission. (AY14) | People greyed out for having "nothing new to say" |
| PIR11 | **Keyboard reaches every verb.** Arrows move the selection; Enter on a selected row runs its first verb. (S5) | A mouse-only path for the most frequent action |
| PIR12 | **Selection is stable (accepted, UR52).** Ticks, away time and list changes never move the selection or steal focus; a subject that leaves gives a notice, not a silent jump. (AY4, AY10, ID2) | The inspected person changing under the cursor |
| PIR13 | **A conversation has an explicit exit.** Leave is listed last, Esc works, and the place returns with the selection kept. A world may make a scene non-leavable with a stated in-world reason. (AY3, AY29) | A conversation that strands the player or loses their place |

### New and heard

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR14 | **Heard is recorded per line with a fingerprint of its text.** Changed text counts as new again; greetings and flavor variants are excluded. (AY15, AY26) | Daily variation re-marking everyone, or real changes going unnoticed |
| PIR15 | **A mark is truthful.** A "new" dot counts only lines and content the hero can act on now. (AY24) | Markers that fire falsely and lose trust |
| PIR16 | **Three looks: new, heard, locked.** New is a small accent; heard is normal text with a quiet mark and stays clickable; locked is grey with a reason. Heard never borrows the disabled look. (AY23) | Players reading heard topics as unavailable |
| PIR17 | **The list shows a dot; the count lives in Actions.** Person marks are a setting, on by default. A "You could ask about…" hint may stand in for the dot. (AY25, AY32) | Badge noise across the people list |
| PIR18 | **Conversations keep authored order** and mark new lines in place; new-first ordering is a dial. (AY27) | Choices jumping position between visits |

### Time, idle and continuity

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR19 | **Choices are attended; repetition can run itself.** Talk never runs while away; routines, known travel and practice can. (AI1, ID6) | Away time auto-picking dialogue, or chores that need a click per day |
| PIR20 | **Away time stops before known events (accepted, AD16, for important choices).** By default idling pauses shortly before an event the hero knows is coming; per event the player may let it pass. (TF2) | A canon event skipped silently while idle |
| PIR21 | **Rewind shows what it undoes (accepted, D11 and CA5 for scope).** A checkpoint return lists, per subject, the history it undoes; memory, heard lines and cheat growth carry. (TF5, LP5, LP6) | Losing relationships to a rewind without warning |
| PIR22 | **Past-life knowledge is memory, not relationship (accepted, AD11, AD12).** People known from an earlier life show what is remembered; the new life still meets them. (LP5, LP8) | A fresh life that inherits friendships it never formed |

### Build and verification

| Code | Rule | Mistake it prevents |
| --- | --- | --- |
| PIR23 | **Pointer: AR3, AR6.** One authority per fact, namespaced save slice (accepted). Presence reads the existing location and NPC registries. | Parallel people lists, route tables or heard flags |
| PIR24 | **Retire a route only after its consumers move.** Text, hints and browser scripts that name a retired control move to the new route in the same change, with one log line telling the player where it went (UR13). (ID1) | Broken quest hints and a red browser suite after removing a menu |
| PIR25 | **Pointer: UR "Before you call it done", AD34.** Target-viewport evidence (accepted). | Claims based on the prebuilt bundle or a mobile check |

### Not covered here

Event storylets as content (ST2), maps (AT4), plans and replay (LP4), loops
(LP1-LP12) and time-skip verbs (TF1) keep their own owners when built. NPC-heavy
work stays deprioritized under AD33; PIR applies to the existing NPCs and to
new ones when a slice adds them.
