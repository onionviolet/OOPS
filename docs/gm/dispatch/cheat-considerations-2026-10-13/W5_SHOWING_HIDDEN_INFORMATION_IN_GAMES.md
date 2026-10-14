# W5: Showing hidden information in games and fiction

Research draft, researched 2026-10-14; dispatch filename retains 2026-10-13. Considerations and proposals, not accepted rules or an implementation report. Scope: status window, SH4 True Appraisal, and nearby information powers. Only this document was authored. No code, save, build, installation, commit or runtime verification is claimed.

## Authority, evidence and reading key

Read against [AGENTS.md](../../../../AGENTS.md), [PROJECT.md](../../../../PROJECT.md), [USER_VISION.md](../../../USER_VISION.md), and [CHEAT_LIBRARY.md](../../../CHEAT_LIBRARY.md), especially “subtle stuff, round 2” and “cheats that show things.” The library calls these palettes and its build order reversible. This report does not promote A11–A13 or any new suggestion into director acceptance. Desktop/laptop remains the primary eventual presentation target; illustrative review viewport: 1366×768. Mobile optimization, engine work, additional lenses and gameplay acceptance are deferred here. No YAIRPG sealed truth is included; hypothetical examples below are invented, public examples.

**Shown** means a visible interface or fictional presentation supported by the linked material, not personally playtested here. **Stated** means a manual, developer, researcher or community reference describes the mechanism; source type is identified when material. **Inferred** means this report's interpretation of player feeling, failure mode or YAIRPG fit, not an empirical player study. **Unverified** marks memory-only details or claims for which adequate confirmation was unavailable. A search excerpt is weaker evidence than a retrieved page, and a fan summary is weaker than a checked chapter or episode. Neither implies current patch verification.

Every survey entry separates evidence from **Inferred play effects** and a proposed **Default + Dial + Reasonably**. These are starting points, adjustable world choices and proportional reasons to depart from them. They are not absolutes or binary choices.

F1: Information can move tension from guessing to choosing. F2: precision, freshness, credibility and prediction horizon are different properties. F3: an idle life-sim benefits when a reveal enables a new action rather than demanding repeated inspection. These are design inferences from the comparisons below, not measured effects.

## Odds and honesty

### G1: XCOM, particularly XCOM 2

**Shown/Stated:** XCOM 2 displays a shot's chance to hit. A community examination of configuration/code reports hidden player aim multipliers on Rookie/Veteran and miss-streak assistance on Rookie/Veteran/Commander, with Legend excluded from those assistance categories. This supports “displayed and effective odds can differ,” not “XCOM secretly punishes good odds.” The report is from 2016; exact contemporary platform, expansion and mod behavior is unverified. [Configuration-based account](https://gaming.stackexchange.com/questions/254347/how-do-the-different-difficulty-levels-vary/254965). The [XCOM 2 manual](https://www.feralinteractive.com/en/manuals/xcom2/latest/linux/) provides the interface context. This finding is not generalized to every XCOM title.

**Inferred play effects:** Numbers invite commitment and counterfactual regret: “I took the best shot and still lost.” Assistance may soften bad streaks, yet discovering a hidden transform can damage trust even when it helped. One miss at high odds does not establish dishonest RNG. Across long idle batches, selective memory and differing conditions can make a truthful rate feel wrong too.

**YAIRPG fit:** TR2/TR3 and SH4 favor an inspectable distinction between base score and effective probability; SE1 is a plausible risk-aversion effect, not a demonstrated universal response. **Default:** label effective odds when known, estimates when not. **Dial:** qualitative risk, approximate ranges, detailed odds, declared luck assistance. **Reasonably:** a benevolent system could describe protective luck without exposing every roll; a deceptive patron could issue attributed estimates rather than letting the neutral UI silently misstate probability. OV2/TR4 preserve the difference.

### G2: Fire Emblem's two-RN “true hit”

**Stated:** In the classic two-RN scheme, two integers from 0–99 are averaged and compared with the displayed Hit threshold. The reference table gives displayed 70 as 82.30% effective hit, and 30 as 18.30%. This describes the cited scheme, not every Fire Emblem entry; the reference itself flags incomplete confirmation for one title. [Serenes Forest explanation and table](https://serenesforest.net/general/true-hit/).

**Inferred play effects:** Strong attacks feel dependable and weak attacks feel unlikely, reinforcing intuitive categories. A knowledgeable player can exploit the transform; a player treating the display as literal probability may distrust it. This is a probability transform, not appraisal uncertainty and not future sight.

**YAIRPG fit:** Supports OV1's shared observations but challenges equating a score with a percentage under SH4. **Default:** distinguish “Accuracy 70” from “Hit chance 82%.” **Dial:** each world's roll law, smoothing and explanation depth. **Reasonably:** preserve an unfamiliar local law as something to learn (SE7/SE3), while making a lens's claimed units intelligible. TR2 ranges should express uncertain knowledge, not conceal a known probability transform.

## Intent and limited perfect information

### G3: Slay the Spire

**Shown/Stated:** Enemy intent communicates the next action to help players choose their cards. Mega Crit's founders describe the interface-design problem in a direct developer interview. [Ars Technica War Stories](https://arstechnica.com/video/watch/war-stories-slay-the-spire-war-stories/?c=series). “Perfect information” here refers to a useful local forecast, not knowledge of the whole run, every future draw or all future enemy choices.

**Inferred play effects:** The player can feel clever about matching offense and defense instead of punished by an unseen attack. Multiple threats and limited resources still create tension. Failure modes include calculating every permutation and assuming an intent remains valid after changing relevant conditions.

**YAIRPG fit:** SH6/SH17, OV7 and TR3 can turn one imminent threat into a preparation decision. **Default:** show the next relevant action or phase and its known cost. **Dial:** category, damage range, exact target, conditional change warnings, forecast horizon. **Reasonably:** leave later choices uncertain; in unattended work, summarize intent changes at decision points rather than generating an alert each tick.

### G4: Into the Breach

**Stated:** Subset explicitly advertises telegraphed enemy attacks and planning counters; the wider attempts present randomly generated challenges. [Official game page](https://www.subsetgames.com/itb.html); [developer design postmortem](https://media.gdcvault.com/gdc2019/presentations/Into%20the%20Breach%20Postmortem%20Final.pdf).

**Inferred play effects:** Knowing an attack does not supply enough actions to save everything. Tension becomes triage, position and collateral effects. A dense board can produce analysis paralysis. “The attacks are known” also does not establish that every system, later turn or random event is known.

**YAIRPG fit:** SH6 Turn Sight plus SH2 Causality Lens supports “these jobs resolve before that interruption,” with meaningful preparation. It challenges the claim that information necessarily removes tension (OV8). **Default:** one settlement phase ahead, conditional on current commitments. **Dial:** forecasted targets, order and environmental effects. **Reasonably:** a high-grade tactical world can reveal the full immediate resolution while keeping limited time, fuel and competing obligations meaningful. This is intent/causal forecasting, not proof of SH1 reading an RNG stream.

## Identification, loot and curses

### G5: NetHack

**Stated:** Identification can come from use, price and other evidence. Object type and blessed/uncursed/cursed status are distinct knowledge; an identify scroll can reveal full identity and beatitude, while pets or altars provide other routes for checking beatitude. [Identification](https://nethackwiki.com/wiki/Identification), [identify scroll](https://nethackwiki.com/wiki/Scroll_of_identify), [BUC](https://nethackwiki.com/wiki/BCU). These are community references with version/source links, not a run conducted here.

**Inferred play effects:** An unknown item becomes an experiment or a gamble. Separating properties enables useful partial discoveries. Surprise can be memorable, but an irreversible curse attached to an innocuous equip action can feel like a trap, and established procedures can become repetitive chores.

**YAIRPG fit:** Strong support for SH4/SH11, TR2 and OV3 at the level of individual properties. **Default:** appraisal reveals the property it can actually read; “material identified” need not mean “curse excluded.” **Dial:** safe inspection, costly tests, use-to-learn, curse visibility and reversibility. **Reasonably:** a dangerous world can keep consequential experimentation, while ordinary idle equipment loops can use learned checks. Distinguish fictional corruption from FR1 save/schema quarantine; technical load failure is not evidence of an in-world curse.

### G6: Diablo, bounded here to Diablo II

**Stated:** Cain identifies inventory items; rescuing him changes access to that service. Gambling purchases reveal the previously unidentified item after purchase. [Blizzard's Act I NPC guide](https://classic.battle.net/diablo2exp/npcs/act1.shtml).

**Inferred play effects:** A delayed reveal creates anticipation and a reason to return to a familiar NPC. Bulk identification can make the ritual convenient. Once the reveal carries little choice, extra visits and clicks become friction. Loot identification does not itself establish a NetHack-style curse model.

**YAIRPG fit:** SH4, OV4/OV7 and a local specialist can reward knowledge without increasing raw power. **Default:** an intentional reveal beat for a meaningful unknown. **Dial:** specialist access, remote appraisal, bulk handling and ceremony frequency. **Reasonably:** after mastery, routine outputs could arrive already assessed; reserve surprise for properties the lens still cannot resolve.

### G7: Path of Exile, bounded to PoE 1

**Stated:** The official-hosted early community FAQ explains using a Scroll of Wisdom on an unidentified item and reports different sale currencies for identified versus unidentified items. This is historical documentation, not proof of all current recipes or PoE 2 behavior. [2012 FAQ](https://www.pathofexile.com/forum/view-thread/36608). A community report also identifies a possible information leak: a trade whisper naming an unidentified unique item. [Trade-interface report](https://www.pathofexile.com/forum/view-thread/3029714). The leak was reported in 2021 and was not reproduced here.

**Inferred play effects:** Deciding whether to reveal can have an economic consequence. High item volume can turn anticipation into inventory labor. Alternate interfaces can undermine discovery even if the main tooltip is carefully hidden.

**YAIRPG fit:** SH4/OV4 support reveals as events; SL1/SL2/SL5 challenge treating one panel as the whole spoiler boundary. **Default:** identification changes knowledge, with any economic consequences explained locally. **Dial:** reveal cost, specialist economics and batch size. **Reasonably:** audit ordinary exports, logs and help for accidental disclosure; do not turn a solo player's deliberate save inspection into a policing project (SL3/OV8).

## Appraisal, descriptions and people

### G8: Dark Souls item descriptions

**Shown/Stated:** Item flavor text, dialogue and environments provide story fragments. A direct interview with Souls translator Ryan Morris discusses localizing lore pieces including item descriptions. [Translator interview](https://gamegrin.com/articles/translating-dark-souls-a-chat-with-ryan-morris); [overview of the presentation](https://en.wikipedia.org/wiki/Dark_Souls_(video_game)). This is textual inspection, not evidence that Dark Souls implements a graded appraisal power.

**Inferred play effects:** Possessing an object gives a clue and invites interpretation. Reading feels like archaeology. Failure modes include obscure actionable mechanics, endless speculation and treating an evocative statement as a fully certified history.

**YAIRPG fit:** SH2/SH15, TR3/TR4 and SE7 support connecting artifacts with observed events. **Default:** distinguish measured properties from attributed lore. **Dial:** terse fact, local interpretation, competing accounts and optional deeper description. **Reasonably:** SH4 can resolve composition or wear without resolving who lied about an item's history. Exact physical inspection need not certify every narrative claim.

### G9: Monster Hunter, bounded to World

**Stated:** Monster research adds information about ecology, weak points/resistances and rewards to the reference material. The cited Japanese guide separates research knowledge from scoutfly guidance and lists the progression. [Research-level account](https://monsterhunter.jp/world/system/seitai.php). The attempted official manual route was unavailable, so specific unlock thresholds are not adopted as verified design facts here.

**Inferred play effects:** Observation becomes preparation: players learn which approach is useful. Coarse weakness grades can be readable while concealing important differences among body parts and attack types. A single grade may be mistaken for a universal damage guarantee.

**YAIRPG fit:** SH4, OV7 and SE7 support learning before force. **Default:** show a task-specific useful category, then refine it through evidence. **Dial:** numeric hit zones, material analysis, behavior notes and tracking assistance. **Reasonably:** avoid one “quality” grade swallowing durability, purity, compatibility and hazard. Treat “useful for this job” as separate from “rare.”

### G10: Dwarf Fortress thoughts and preferences

**Shown/Stated:** The inspection interface lists preferences; the thought system associates emotional responses with events. [Preferences](https://dwarffortresswiki.org/index.php/Preference), [Thought](https://dwarffortresswiki.org/index.php/Thought). The preference reference includes version caveats, so this report uses the presentation pattern rather than exact stress arithmetic.

**Inferred play effects:** A small dislike or treasured material can make a simulated person memorable and suggest a gift or a better home. Huge lists can become unreadable, and exhaustive mind access can shift care into optimizing a spreadsheet.

**YAIRPG fit:** SH2/SH13/SH16 and TR3 offer causal explanation; OV6 matters because colony-controller knowledge need not be ordinary character knowledge. **Default:** a few relevant, observed thoughts or preferences. **Dial:** disclosed speech, behavioral inference, empathic categories and explicit mind reading. **Reasonably:** reserve inner-state certainty for a lens/world that grants it, while plain summaries and on-demand receipts support LA4/LA5.

### G11: RimWorld social view

**Shown/Stated:** Each colonist's social tab shows opinions of other colonists and relatives; social interactions and traits affect those opinions and subsequent behavior. [Social view and opinion reference](https://rimworldwiki.com/wiki/Social).

**Inferred play effects:** Relationship changes become legible, and an insult can explain a conflict. Numerical access can encourage treating people as meters to manipulate. A positive opinion is easy to mistake for guaranteed agreement, attraction or consent; the simulation itself has additional conditions.

**YAIRPG fit:** SH12/SH16/SH18, TR3 and SE5. **Default:** keep “likes you,” “noticed you,” “owes you” and “would accept this request” distinct. **Dial:** named event receipts, broad sentiment, exact modeled opinion, context-specific objection. **Reasonably:** a strong appraisal power might reveal a real internal variable, but the UI can still explain that this is one variable at one time, not a binding future decision.

## Fog, last sighting and information age

### G12: Civilization last-seen tiles

**Stated:** Civilization VI's manual documents fog of war and exploration. [Official manual](https://downloads.2kgames.com/civilization/vi/manuals/eu/CIV_VI_25TH_ONLINE_MANUAL_AUS.pdf). **Unverified, memory-only:** explored but currently unseen areas retain a last-known representation while current units are hidden; exact update behavior for terrain, cities and ownership was not confirmed in the retrieved manual text. Do not assume every tile feature freezes identically across Civilization editions.

**Inferred play effects:** Remembered geography makes planning possible; knowing that it is not live intelligence makes scouting worthwhile. A map that looks current can generate false confidence. A universal aging timer also misleads: mountains and moving armies change at very different rates.

**YAIRPG fit:** SH3, TR1, OV2, SE6. **Default:** distinguish “observed at” from “currently visible.” **Dial:** field-specific aging, travel-report delay, update range and visible uncertainty. **Reasonably:** an old road survey can remain useful while a merchant's old price cannot; freshness should follow the fact's volatility rather than degrading all knowledge equally.

### G13: StarCraft, evidence bounded to StarCraft II

**Stated:** Blizzard's scouting guide emphasizes repeated scouting, checking structures and expansions, and tools such as Scanner Sweep, Observers and watchers. [Official scouting guide](https://news.blizzard.com/en-us/article/4488316/game-guide-scouting). **Unverified, memory-only:** exact remembered-building silhouettes and removal rules under fog were not checked here.

**Inferred play effects:** Intelligence is an active investment that enables counters; opponents can deny it. An unattended life-sim could inherit the useful information cost but accidentally import the obligation to keep looking constantly.

**YAIRPG fit:** SH3/SH8, OV5 and SE6. **Default:** learned reporting routines can gather scoped updates without repeated manual inspection. **Dial:** report cadence, paid scouts, local visibility and report interception. **Reasonably:** contested intelligence can be expensive and delayed, while a quiet home routine can stay legible. Avoid claiming an NPC knows an event merely because the engine processed it.

## Knowledge logs, hidden quests and interpretation

### G14: Outer Wilds ship log

**Shown/Stated:** The ship computer offers Map and Rumor views of learned information. [Computer reference](https://outerwilds.fandom.com/wiki/Computer). Mobius's patch notes confirm ship-log entries and visual clues as maintained elements of the experience. [Developer news](https://www.mobiusdigitalgames.com/news/category/outer-wilds). No plot solution or diegetic explanation of log persistence is reproduced here.

**Inferred play effects:** A connected memory of discoveries helps the player resume curiosity after absence. It can support exploration without prescribing a quest sequence. A “more to explore” flag may become checklist pressure, and naming an undiscovered node can reveal more than intended.

**YAIRPG fit:** SH2/SH8/SH9/SH15, OV4/OV7 and SL5. **Default:** retain observed clues and a small number of available leads. **Dial:** unanswered connections, broad presence signals, hints or exact conditions. **Reasonably:** record what supports a hidden quest without enumerating its sealed solution. Even a count of unknown things (SE4) is information that needs an earned route.

### G15: Return of the Obra Dinn

**Shown/Stated:** The logbook lets players revise identities and fates from evidence; correct solutions are generally validated in groups of three, with endgame exceptions. [Gameplay reference](https://en.wikipedia.org/wiki/Return_of_the_Obra_Dinn#Gameplay). This is a secondary account, not a local playthrough.

**Inferred play effects:** Separate evidence, hypothesis and confirmation make deduction feel earned. Grouped validation can discourage immediate one-at-a-time probing, but it can also strand a correct deduction beside uncertain ones and still permit guessing. The pattern is not proof that group validation prevents brute force.

**YAIRPG fit:** TR3/TR4 and SE7 support an evidence notebook. **Default:** label a hypothesis separately from an observed fact. **Dial:** independent corroboration, grouped confirmation, deliberate tests and certainty upgrades. **Reasonably:** keep a mistaken theory revisable rather than silently rewriting its history; avoid adding a mandatory three-answer ritual to ordinary idle appraisals.

### G16: Disco Elysium thought cabinet and skill checks

**Stated:** The developer describes displayed check chances/modifiers, two six-sided dice and different retry stakes for white versus red checks. Thoughts, equipment and world changes can affect checks. [Developer active-check essay](https://discoelysium.com/devblog/2016/10/06/active-skill-checks). The Thought Cabinet internalizes ideas with bonuses, penalties and other effects. [Thought Cabinet reference](https://discoelysium.wiki.gg/wiki/Thought_Cabinet). The former is pre-release design evidence, the latter a community account of the game.

**Inferred play effects:** Interpreting and adopting an idea can change the character rather than simply fill an encyclopedia. Visible odds invite preparation but also costume changes and optimization at every conversation. A voiced skill's assertion can feel authoritative even when it is a perspective. Exact reliability of each skill voice is unverified here.

**YAIRPG fit:** SH5/SH13/SH15, TR4/TR6 and SE7. **Default:** attribute a suggestion to its lens and preserve contrary evidence. **Dial:** confidence, voice, internalization effects and retry policy. **Reasonably:** a patron's advice can have an agenda without falsifying every numeric field; a thought's usefulness need not establish its truth. Known commitment costs can remain clear while outcomes remain uncertain.

## Suspicion and being read

### G17: Hitman, bounded to the 2016 game's manual

**Shown/Stated:** Instinct marks suspicious observers with a white dot and nearby crime witnesses with an orange glow; legal appearance depends on disguise and what is carried. The manual also describes overheard information revealing trackable opportunities. [Feral's official manual](https://www.feralinteractive.com/en/manuals/hitman/latest/linux/).

**Inferred play effects:** Observer-specific feedback makes stealth readable and recoverable: one person can be a threat while another accepts the disguise. It can also become staring at indicators. If witnesses, suspicion and distributed knowledge collapse into one global bar, the fiction stops making sense. Guided opportunities can help discovery but feel like following instructions.

**YAIRPG fit:** SH10/SH18/SH15, OV5, SE5 and TR3. **Default:** separate noticing, recognizing, suspecting, witnessing and reporting. **Dial:** observer identity, confidence, direction, exact threshold and report delay. **Reasonably:** “someone is examining you” could be available before knowing who or why; a high-grade lens can add the observer's own reading without revealing an unrelated sealed truth.

### G18: Assassin's Creed, bounded to Mirage

**Stated:** Ubisoft describes detection feedback spanning suspicious, detection and searching phases, with meters and animations intended to communicate context. [Official accessibility spotlight](https://www.ubisoft.com/en-us/studio/bordeaux/news/6LFboDyYkELeRQyXCyP04w/assassins-creed-mirage-accessibility-spotlight). This does not establish a single uniform suspicion model across the franchise.

**Inferred play effects:** A staged signal provides time to react and teaches the boundary between concealment and pursuit. It can encourage threshold gaming. Color-only meanings can be inaccessible or ambiguous when several observers disagree.

**YAIRPG fit:** SH10, LA1, OV5 and SE5. **Default:** labeled stages with a non-color cue and a readable cause when known. **Dial:** reaction time, distance, anonymity and meter granularity. **Reasonably:** a slow life-sim can offer a meaningful decision window under its existing time policy rather than requiring reflexes or implying new offline consequences.

### G19: The Sims, bounded to The Sims 4

**Shown/Stated:** The relationship panel lists relationships; EA documents configurable romantic jealousy boundaries and ways of learning about attraction preferences. [Official console manual](https://eaassets-a.akamaihd.net/eahelp/manuals/the-sims-4-ps4-na.pdf), [EA relationship/attraction guide](https://help.ea.com/en/articles/the-sims/the-sims-4/gender-romance-attraction-guide/). This is adjacent social-state visibility, not evidence of a universal Sims suspicion meter.

**Inferred play effects:** Legible reactions help players manage a household and understand interpersonal consequences. Bars can imply precise control over someone else's feelings. Hidden preferences can make interaction useful, while an unexplained reaction can feel arbitrary.

**YAIRPG fit:** SH13/SH16/SH18, TR3 and OV6. **Default:** reveal known boundaries and witnessed reactions in context. **Dial:** omniscient household view, conversational discovery, empathy or appraisal. **Reasonably:** separate a character's actual state, what the player controller sees and what another character could know. A relationship score need not be a prediction of every response.

## Future rolls, deterministic sequences and available pools

### G20: Pokémon RNG manipulation, bounded to Emerald

**Stated:** Smogon's research explains Emerald's fixed initial seed and timed RNG advancement, allowing players to target generated Pokémon properties. Different conditions affect advances. [Emerald RNG introduction](https://www.smogon.com/ingame/rng/emerald_rng_intro). This is external knowledge and execution technique, not an in-fiction future-sight window; it does not generalize unchanged across Pokémon generations.

**Inferred play effects:** Mastery converts uncertainty into timing and planning. It can become satisfying experimentation or tedious waiting and resets. If unrelated actions consume the same random sequence, a prediction may fail in ways that appear arbitrary.

**YAIRPG fit:** SH1/SH7, OV2/OV8 and TR3. **Default:** describe what is predicted: raw roll, eligible event or conditional outcome. **Dial:** stream scope, number of visible rolls, timing sensitivity and ability to choose consumption. **Reasonably:** separate streams and non-advancing peeks are candidate solutions, not verified YAIRPG capabilities here. Postpone them until the engine probe establishes the dependency. An exact next roll does not predict a success if modifiers or eligibility change.

### G21: Into the Breach as a future-view comparison

**Stated:** Its advertised telegraph gives enemy attack information before the player's response. [Subset's description](https://www.subsetgames.com/itb.html). **Unverified, memory-only:** exact reset-turn RNG reuse and grid-resistance reroll behavior were not investigated.

**Inferred play effects:** A committed intention can be visible yet remain alterable by intervention. This is a better analogy for a causal forecast than for an immutable prophecy.

**YAIRPG fit:** SH6 supports current resolution order; SH1 requires separate RNG evidence. **Default:** a forecast states its assumptions. **Dial:** intention-only, simulated next phase, stable roll preview or authored prophecy. **Reasonably:** label a changed prediction as superseded when intervention changes its premises, rather than having the lens quietly make a new claim under the old receipt.

### G22: Balatro deck view

**Stated, community-reported:** Players describe viewing deck composition and remaining cards. One discussion says the available-card view includes cards in hand as well as remaining cards, which matters for face-down hands. [Deck-view discussion](https://www.reddit.com/r/balatro/comments/1b7n13v). **Unverified, memory-only:** the view lists a sorted pool rather than exposing next-draw order; exact version, face-down obfuscation and pool semantics were not verified from game bytes or an official explanation.

**Inferred play effects:** Knowing the pool helps evaluate a draw without guaranteeing it. Players can feel informed while suspense survives. Pool, order and current hand are easy to conflate; interface side channels can disclose cards that are supposed to be unknown.

**YAIRPG fit:** SH4/TR2 can reveal possible outputs and weights; SH1 reveals an actual sequence and is a different reward. **Default:** distinguish “available outcomes” from “next outcome.” **Dial:** pool counts, distribution, exclusions and future order. **Reasonably:** disclose that distinction in plain language, including whether observed counts exclude committed results. SL1 applies to secondary views as well as the main card.

## Fictional information systems

These compare narrative affordances, not balanced playable systems. A story can skip uneventful checks and arrange revelations at useful moments; an idle life-sim needs its own cadence. Source scope varies below and is not presented as a full franchise audit.

### L1: Solo Leveling

**Stated, secondary:** A community summary describes the System's Status Window with level, health/mana, fatigue and attributes. [System summary](https://wikikai.com/wiki/solo-leveling/concepts/the-system/). The licensed publisher identifies the series but its catalog does not verify those detailed mechanics. [Yen Press series catalog](https://yenpress.com/series/solo-leveling-comic). **Unverified, memory-only:** precise early-chapter UI layout, unlock cadence and who can read each field were not checked against a licensed chapter or episode.

**Inferred play effects:** Quantified growth creates a private sense of competence and a contrast with public reputation. Repeated numerical confirmation can crowd out social, bodily and situational evidence. A directive system can also create pressure to obey.

**YAIRPG fit:** Status window, SH17/SH18, OV6/OV7 and TR6. **Default:** selected self-knowledge with understandable costs and earned reveal moments. **Dial:** private versus shared reading, quantified growth, quest authority and system voice. **Reasonably:** a lens can know the holder's capacity without knowing every opponent, motive or hidden quest; keep any backing's recommendations distinguishable from measurements.

### L2: The Gamer

**Stated:** The official WEBTOON synopsis says Jihan can perceive the world as a video game. [Official series page](https://m.webtoons.com/en/action/the-gamer/list?title_no=88). A fan reference describes Observe as a target-information skill obtained through observation. [Observe reference](https://the-gamer.fandom.com/wiki/Observe). Only the latter's indexed excerpt was available; its full page fetch failed. **Unverified, memory-only:** exact skill-level restrictions, readable fields and blocked-target behavior.

**Inferred play effects:** Looking itself becomes a useful action, and increased literacy can feel like growth. If every meeting starts with an automatic dossier, surprise and ordinary social interpretation weaken.

**YAIRPG fit:** SH4/SH9/SH18, OV3/OV7 and SE7. **Default:** a task-focused inspect with a visible grade. **Dial:** trained categories, range, effort, opposition and observer notice. **Reasonably:** after a familiar class of work is learned, provide concise automatic assessment rather than requiring a click on every identical object.

### L3: The Rising of the Shield Hero

**Stated, transcribed dialogue:** Episode 1's transcript explicitly introduces Status Magic and asks the heroes to check their statuses. [Episode transcript](https://transcripts.foreverdreaming.org/viewtopic.php?t=140413). A fan reference describes the leveling system and related powers. [Status Magic account](https://shield-hero.fandom.com/wiki/Magic/List_of_Magic). **Unverified, memory-only:** the exact ordinary inhabitant's access and cross-world calibration rules were not checked against the light novels; this transcript cannot verify visual screen details by itself.

**Inferred play effects:** A status interface can make world law learnable rather than function as a unique cheat. Familiar-looking interfaces can also prompt mistaken assumptions about unfamiliar rules.

**YAIRPG fit:** OV6, SE3/SE7 and SH14. **Default:** distinguish the local baseline from an exceptional lens. **Dial:** public level literacy, hero-only fields, local units and travel recalibration. **Reasonably:** an imported appraisal can honestly say its calibration is incomplete rather than making familiar labels promise universal equivalence.

### L4: Tensura's Great Sage

**Stated:** The official character page describes a voice heard only by Rimuru that explains events and sometimes supplies extra explanation. [Official Great Sage page](https://www.ten-sura.com/character/greatsage). **Unverified, memory-only:** the exact Analysis/Appraisal subskills, processing limits and exceptions were not confirmed from a bounded novel passage or episode. The official description verifies an explanatory voice, not unrestricted omniscience.

**Inferred play effects:** A companion can translate complexity into something usable and make discovery feel like collaboration. Excess explanation can remove inquiry; players can overtrust an authoritative voice or become overwhelmed by it.

**YAIRPG fit:** SH2/SH4/SH13, TR5 and LA4/LA5. **Default:** answer the selected question with an optional explanation. **Dial:** personality, explanation depth, processing delay and scope. **Reasonably:** refusals can describe a supported limitation without naming a hidden entity; a quiet/plain voice can preserve useful information without turning every tick into dialogue.

### L5: Overlord's information gathering

**Stated in an unofficial translated-text mirror:** A volume 3 passage describes divination countermeasures that detect the origin of observation; its spell list includes sensing and false-data effects. [Volume 3 mirrored passage](https://www.wuxiaworld.eu/chapter/overlord-ln-19). This is narrative-text evidence through an unofficial translation, not verification against the licensed edition. **Unverified, memory-only:** the exact False Data: Life/Mana outputs, anti-divination coverage and relative detection tiers.

**Inferred play effects:** Reconnaissance, deception and noticing the observer can make strong information powers strategically interesting. Endless nested countermeasures can make every result feel useless, or turn play into “inspect again with the better lens.”

**YAIRPG fit:** OV5, SH5/SH10/SH18, TR4/TR6 and SE2/SE5. **Default:** preserve source, scope and supported evidence for a discrepancy. **Dial:** concealment, forged readings, observable tells and counter-reconnaissance. **Reasonably:** reserve contested readings for contexts that provide useful follow-up actions; this inspiration does not require every ordinary item to lie or every appraisal to alert the whole world.

## HI patterns: synthesis, all inferred proposals

The grade ladder is useful for reveal granularity. The comparisons challenge using it as a single scale of reliability: an exact old observation can be less useful than a fresh range; a precise forged assertion can still be false; a next-roll value is not a causal outcome. “Future” could remain a lens capability while the fact retains its own precision, timestamp and conditions.

| ID | Pattern and supporting examples | Default | Per-world dial | Reasonably / YAIRPG fit |
| --- | --- | --- | --- | --- |
| HI1 | Label probability's meaning: XCOM, Fire Emblem | Effective probability or clearly labeled score/estimate | Roll law, assistance, explanation depth | TR2/TR3, SH4; familiarity is not proof that a displayed score is literal odds |
| HI2 | Reveal the next decision: Spire, Breach | One relevant action/phase | Horizon, targets, order | SH6, OV8; constraint can preserve tension despite immediate certainty |
| HI3 | Identify properties separately: NetHack, Monster Hunter | Task-relevant properties with separate grades | Curse, material, compatibility, hazard coverage | SH4/SH11, OV3; one successful identification need not certify everything |
| HI4 | Give revelation a beat, then compress repetition: Diablo, PoE | Meaningful reveal event and later batch handling | Specialist, cost, ceremony | OV4/OV7; learning can earn convenience rather than a permanent click tax |
| HI5 | Keep lore distinct from measurement: Souls, Shield Hero | Attributed account beside measured facts | Local laws, disputed history, calibration | TR4, SE3/SE7; exact composition does not certify the storyteller |
| HI6 | Show reasons behind relevant states: DF, RimWorld | Short causal receipt | Depth, mind access, emotional categories | SH2/SH13/SH16, TR3; support care and intervention rather than a complete psychological dossier |
| HI7 | Treat age as its own axis: Civ, StarCraft | Observed-at time and current visibility | Volatility, range, report delay | SH3, TR1, SE6; stale exact information can remain useful if its age is legible |
| HI8 | Separate evidence, hypothesis and confirmation: Outer Wilds, Obra Dinn | Revisable leads from earned discoveries | Hint depth, corroboration, confirmation | OV2/OV4, TR4, SH15; unknown-node names/counts also need a discovery route |
| HI9 | Track observers, not global suspicion: Hitman, Mirage | Known noticing/recognition/reporting stages | Identity, sensitivity, detection window | SH10/SH18, SE5; explicit acquisition paths make counterplay understandable |
| HI10 | Separate pool, roll and outcome: Balatro, Pokémon, Breach | Known possibilities and conditional forecasts | Stream peek, horizon, commitment | SH1/SH6, TR3; seeing a roll is stronger than knowing odds but weaker than knowing all consequences |
| HI11 | A lens is situated: Solo Leveling, Gamer, Great Sage, Overlord | Source and readable scope | Private/shared UI, voice, obstruction, forging | OV5/OV6, TR5/TR6; a reliable measurement channel can coexist with biased advice |
| HI12 | Knowledge earns an action: all comparisons | Reveal what changes preparation, work or investigation | Earned hints, automation and specialist access | OV7/OV8; evaluate new choices and reduced busywork, not just the number of exposed fields |
| HI13 | Access and quiet are part of information quality | Text/glyph alongside color; plain summary and on-demand detail | Voice, motion, sound, density | LA1–LA7; certainty is little use when its presentation cannot be read or interrupts unattended work |

## AP anti-patterns for an idle life-sim

| ID | Failure mode | More useful default | Dial and reasonable exception |
| --- | --- | --- | --- |
| AP1 | Every tick produces a receipt, warning or suspicion announcement | One return summary with inspectable causes | More detail for a chosen investigation; LA4 limits unsolicited stat announcements |
| AP2 | Constant stale markers imply constant manual refreshing | Update learned local routines and mark genuinely remote/contested reports | Delayed intelligence where travel or obstruction matters; TR1/SE6 |
| AP3 | All exact numbers appear current and authoritative | Separate precision, observation time and source | A genuinely live trusted lens can omit repetitive badges while retaining inspectable provenance |
| AP4 | “True Appraisal” reveals every identity, quest and motive at once | Scoped property resolution with earned disclosure | Broader omniscience can be a deliberate world fantasy; SL1/SL5 still protect undiscovered presentation routes |
| AP5 | Future sight becomes a compulsory wait-for-the-best-roll loop | Useful alternatives and limited relevant forecasts | Roll scheduling can be a chosen mastery game; avoid global RNG coupling as accidental work |
| AP6 | One number merges liking, suspicion, debt and consent | Separate facts and context-specific reactions | A world may expose modeled opinion exactly, with its meaning still bounded |
| AP7 | Every reading is forged, so improving the lens never pays | Routine readings become dependable; contested ones offer investigable evidence | Espionage worlds can raise deception frequency without making all evidence meaningless |
| AP8 | Help, export summaries, badges or empty panel labels spoil what the main UI hides | Apply the same earned knowledge boundary to ordinary surfaces | A deliberate spoiler/reveal mode can be explicit; this is not an anti-tamper requirement |
| AP9 | A refusal names the secret it is supposedly protecting | Explain only the limitation the observer can know | Even “something is hidden” needs an authorized presence grade; TR5/SE4 |
| AP10 | Increasing precision never changes what the player can do | Couple reveals to practical comparisons, preparation and leads | Cosmetic numerical pleasure can still be worthwhile as an optional fantasy |
| AP11 | Reading all details is required before an unattended routine is safe | Surface known costs and meaningful commitment changes concisely | A dangerous unfamiliar experiment can demand attention within its declared world policy |
| AP12 | A forecast changes invisibly after player intervention | Mark assumptions and superseded observations | Compact change receipts for routine shifts; detailed chain only on demand |

## Five concrete suggestions for status window + SH4 True Appraisal

All five are proposals. The suggested eventual proof is rebuilt desktop play at 1366×768 with a fresh test origin; persistence work additionally needs save/reload/import. No such proof was attempted in this research task.

1. **P1: Two lenses, one selected property.** Default: let the status window show a known range and let SH4 resolve that same fact, for example an invented tool's durability from `40–60` to `47/100`. Show source, reading time and grade in expandable detail. Dial: eligible property categories and exactness. Reasonably: do not add curses, mind reading or future rolls to prove reuse. Observable result: switching lenses improves knowledge without changing the tool itself or granting other hidden fields. Supports OV1/OV2, TR2 and HI3.

2. **P2: Keep an exact historical reading intact.** Default: after the invented tool is used, its earlier exact appraisal remains `47/100, before this job`; show a supported “may have changed” cue instead of silently replacing it with live truth. Dial: free continuous observation versus deliberate reinspection, determined by lens scope. Reasonably: familiar self-state can update live where justified; remote knowledge need not. Observable result: the player can distinguish old exact knowledge from a new reading without refreshing every tick. Supports SH3, TR1 and HI7; this does not authorize a separate SH3 implementation.

3. **P3: One practical comparison and one receipt.** Default: SH4 explains a consequential difference, such as “this material meets the selected job's durability requirement,” and the status window links one known gain/loss to its cause. Dial: terse statement, numerical comparison or expanded chain. Reasonably: use only existing authored facts and supported causality; do not invent certainty about unobserved causes. Observable result: appraisal changes a work choice, and the receipt explains an observed change. Supports SH2/SH4, TR3, OV4, HI6/HI12.

4. **P4: Make disagreements legible without a spoiler.** Default: retain a merchant estimate beside the player's different appraisal, each with source and time; use invented ordinary objects for the first example. An unavailable field gives only an observer-supported limitation. Dial: stale estimate, calibration gap, mistaken expertise or later deliberate deception. Reasonably: avoid making SH4 itself secretly unreliable before players can understand what it promises; a named source can still disagree. Observable result: the player can identify a discrepancy and investigate without the UI naming an undiscovered truth. Supports TR4/TR5, SE2/SE3, SL1/SL5 and HI5/HI11.

5. **P5: Quiet desktop presentation that survives absence.** Default: a compact status summary and selected-object appraisal detail fit the laptop workspace; returning from absence shows a brief change summary with optional receipts. Grade and age use words/glyphs as well as color. Dial: pinned fields, plain/flavored voice, expanded details, optional ceremony and sound. Reasonably: first discovery can be more expressive; repeat readings can be quiet. Observable result: keyboard and assistive reading expose the same earned facts, dormant settings/export summaries disclose no undiscovered lens, and longer text does not hide the selected action. Supports LA1–LA7, SL1/SL2/SL5 and HI13. Mobile layout remains deferred.

## V: What could not be verified

| ID | Verification limit | Consequence for this draft |
| --- | --- | --- |
| V1 | No games were launched or directly played; no YAIRPG code/runtime or engine probe was assessed | Shown/stated is documentary evidence; player feelings and YAIRPG fits are inferred; no implementation claim |
| V2 | XCOM aim-assist details derive from dated community config research; full wiki fetch failed | Broad displayed/effective distinction supported; exact current caps, multipliers, builds and expansions are not certified |
| V3 | The cited Fire Emblem account covers a particular two-RN scheme and includes a title-confirmation caveat | Numerical examples apply to that scheme, not all franchise entries; no claim about every game's crit/growth rolls |
| V4 | Official Monster Hunter manual route failed; research presentation uses a secondary guide | No asserted current universal research threshold or numeric star-to-damage conversion |
| V5 | Civilization PDF search extraction did not establish exact last-seen update rules; alternative wiki fetch failed | Last-seen representation details remain memory-only unverified; StarCraft building-memory details likewise unverified |
| V6 | Balatro wiki routes were robots-blocked; deck behavior uses community reports | Sorted pool versus draw order, hand membership and face-down leakage need a version-specific check |
| V7 | Licensed fiction chapters/episodes were not fully inspected; Gamer full wiki and Overlord wiki routes failed | Solo Leveling/Gamer field limits, Shield Hero universal access, Great Sage subskills and Overlord tiers remain unverified; no full-source audit claimed |
| V8 | Overlord mirror and Shield Hero transcript are unofficial routes | Quoted terminology and exact adaptation details are not certified against licensed editions; no raw prose copied |
| V9 | No behavioral study was used | Risk aversion, trust loss, analysis paralysis and reduced tension are hypotheses with plausible mechanisms, not universal measured responses |
| V10 | No dormant/awakened UI, exports, keyboard flow, screen reader, save/reload/import or desktop rebuild was exercised | SL/LA suggestions and the two-lens observable outcomes remain proposed acceptance examples, not passing gates |

The strongest directly supported mechanics are local telegraphs, separate identification properties, opinion/relationship inspection, developer-described check modifiers, observer-specific stealth feedback and deterministic RNG research. The uncertain fine details above are not prerequisites for adopting the broad considerations, and do not create new implementation gates.
