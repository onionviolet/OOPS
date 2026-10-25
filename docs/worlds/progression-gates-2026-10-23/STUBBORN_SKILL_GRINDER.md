# Progression gate audit: The Stubborn Skill-Grinder in a Time Loop (83294)

Pass: WPR1 record. World: Royal Road fiction 83294 (X-RHODEN-X). Part: WPR14 power and growth subtleties, catalogued per GTR5. Mode: bounded read after reuse (WPR2). Date: 2026-10-23. Output owner: this file. Stop condition: gate catalog, engine mapping, proposed rows, new shapes, absences.

Status: everything below is a **proposal or a finding**, not an accepted decision (WPR, AGENTS design framing). Nothing here changes code, saves or PROJECT.md.

## 0. Source coverage and budget (WPR7, WPR23)

**Book 5 is stubbed.** Weibao notes Book 5 was removed from Royal Road for Kindle, so no Book 5 gate can be catalogued. This is a coverage edge, not a finding that Book 5 has no gates.

**The "ch 1-94 merged into 12 entries" description is wrong.** `83294-early.text.json` holds chapters 1, 2, 3 and then 88-94 (Book 1 closing chapters 4-87 are not in the file; the epub dropped them, with a store-page stub at index 3). `83294-middle` holds 96-100 (ch 95 missing). `83294-latest` holds 110-113 (ch 101-109 missing). So the text covers: the opening loops (Book 1), then jumps to a mid-series Orodan who is already Transcendent in some skills, has an Embodiment-level concept, and has lost and regained a System. How he got there is **not read**.

| Item | Value |
|---|---|
| Source words available | about 273k across the three files |
| Words read (estimate) | about 28k, under the 40k budget |
| Consecutive reads | ch 1 words 5500-7991 (about 2.5k, the first-death-to-loop-awareness stretch); ch 2 words 3023-3340 (about 0.3k) and 3900-4700 (about 0.8k, Observer orb scene). About 3.6k words consecutive |
| Keyword windows (excerpts) | Everything else: windows of 100-250 words around hits for level, threshold, title, Apprentice, Adept, Elite, Master, Observe, System, System space, retain, carry, limit, maximum, Calledro, plus all `[New Title]` and rank-bearing status lines extracted by regex from all 14 chapter entries |
| Not read | ch 4-87, 95, 101-109, 114 onward, all of Book 5; fan wiki; Learning Curve (the fan itch.io game named in an author note, ch 91) |
| Model | Single sonnet-class reader, no subagents |
| Source label | Machine-readable epub text, English original, no translation uncertainty |

Evidence labels: **shown** (the text depicts it), **stated** (a character or narrator says it), **inferred** (my reading), **proposed**. Locators are `chN` with the file as `early`, `middle`, `latest`. Private source text is not copied here beyond short facts.

## 1. Reuse check (WPR2)

`docs/research/skill-growth-2026-10-10/READ_HISTORY_AUDIT.md` row for 83294: "threshold titles G30, Observe as privilege, ranks Initiate/Apprentice/Adept/Elite". `docs/SKILLS_AND_TALENTS.md` G30 "Threshold titles: a use-XP number becomes a public title at fixed marks". Confirmed and **extended**: the ladder is longer than that row says (Initiate, Apprentice, Adept, Elite, Master, Grandmaster, Transcendent, and then Embodiment above it), and skills pass 100.

## 2. How the world's growth works (context for the gates)

- Skills are use-XP numbers with automatic level-up messages, shown in a Status screen. Life-and-death combat gives the largest gains: "rate of skill gain commensurate with the danger" (stated, `early`/ch2). Coddled training gives slightly above regular training (stated, ch2).
- Gains are huge when the loop makes death free: about fifty fights in a day took Combat Mastery 11 to 32 and Physical Fitness 21 to 31 (shown, ch2).
- Each level at higher ranks is worth far more than a low level: "difference between Sword Mastery 9 and 10 wasn't anywhere near" the gap at higher echelons (stated, ch2).
- Combat Mastery is an "amplifier" skill that multiplies the others (stated, ch2).
- A Blessing (Warrior's Heart) raises learning rate for warrior skills (shown, ch1). Blessings are rare (about one in a thousand, stated, ch1).
- The loop returns Orodan to the same night (keening harpy wail) with his skills, new skills and a title kept and the world reset (shown, ch1). Later chapters reveal he is the Custodian's chosen looper, and the loop is fed by his own System and a time-loop mechanism he can power himself (stated, `early`/ch94, `latest`/ch110, partial).

## 3. Gate catalog (GTR5)

Columns follow GTR5: reads, enforcer, default, dial, in-world reason, routes past it with cost, failure cost, overflow, carry, visibility, evidence.

### SKG1: Rank bands of a skill (Initiate / Apprentice / Adept / Elite / Master / Grandmaster / Transcendent)

| Field | Finding |
|---|---|
| Kind | maturation, with a credential face (SKG2) and a capacity face (SKG5) |
| Reads | The skill's own number |
| Enforcer | The System itself (the standard one is "empowered by the Eldritch Boundless One", stated early ch92); recognition is by the Observer orb/spell |
| Default marks | Apprentice at 30, Adept at 50, Elite at 70, Master at 90, Grandmaster at 100, Transcendent above 100 (title seen at 101 for Unarmed Combat and 102 for Physical Fitness). Inferred from title-gain lines: Cleaning 30 stated "threshold of 30 ... Cleaning Apprentice" (shown, `early`/ch1); Club 29 to 30 Club Apprentice, Mining 49 to 52 Mining Adept, Fire Magic 68 to 70 Fire Elite, Wrestling 88 to 92 Wrestling Master, Sword 99 to 100 Sword Grandmaster, Unarmed 100 to 101 Unarmed Transcendent (shown, `middle`/ch97, ch100, `early`/ch91). "Adept-level threshold of 50" is stated outright (ch2). Master at 90 is inferred from one bracket (88 to 92), not a single-step gain |
| Dial | Per skill. Some skills show no title in the extracted lines (Combat Mastery 139 to 148 has none), so the title set is per skill kind: amplifier or meta skills inferred to carry no public title. Not confirmed |
| Reason | The System recognises the fixed marks as milestones in a shared knowledge repository: "increasing knowledge being rewarded by a greater connection to the System's repository" (stated, `early`/ch92) |
| Routes past | None needed; the number advances with use. Faster routes: lethal combat, a teacher, a loop (SKG6, SKG7) |
| Failure cost | A mark can be crossed without being ready (Orodan's Observer-orb readings are accurate but not tactical; see SKG5) |
| Overflow | Not shown. Levels past 100 keep going (Incipience of Infinity 188, Combat Mastery 148), so there is no hard cap at 100. A "soft" shape appears at ranks (SKG9) |
| Carry across loop | Skill numbers carry (SKG10) |
| Visibility | The owner sees the number, rank word and a title once the mark is crossed. Others see only the titles the owner chooses to display (SKG2) |

### SKG2: Threshold titles as public credentials

| Field | Finding |
|---|---|
| Kind | credential and presentation |
| Reads | A rank mark (SKG1), plus the owner's choice of which titles are active |
| Enforcer | The System issues the title; other people read it through Observe or the Observer orb |
| Default | One active title shown at start (Sword Apprentice); later Orodan shows three (Wainwrighting, Weaving, Alchemy) and can change the active title (shown, ch2, `early`/ch88) |
| Social effect | A sergeant's whole manner changes on seeing Combat Apprentice, Shield Apprentice and Physical Apprentice plus three uncommon skills and a rare one: deferential, offers transfer to the county seat and academy sponsorship (shown, ch2). Master-level enchanter titles are tested by evaluators who then raise social status (stated, `early`/ch88). A militia private with Initiate cleaning is joked at for the low title (shown, ch1) |
| Dial | How many titles display; which institutions demand a title as entry |
| Reason | Titles are compact proof of skill that cannot be faked while the System issues them |
| Routes past | Hide titles by not displaying them (cost: no social benefit); mask by choosing unrelated titles (cost: a militia uniform plus Weaving/Alchemy titles looked suspicious, shown, `early`/ch88) |
| Failure cost | Conspicuous mismatch draws questions or state attention |
| Carry across loop | Titles carry; an earned title is listed under "Available Titles" and "One Who Has Experienced Death" appeared as a new title after the first death (shown, ch1) |
| Visibility | Titles not chosen are not shown even by orb: "Available titles were not shown only the ones someone chose to display" (stated, ch2) |

### SKG3: Observe as privilege, with a public substitute

| Field | Finding |
|---|---|
| Kind | knowledge and social |
| Reads | The target's chosen titles and skills; a Blessing is read by a diviner or a priest of the god, not by Observe or the orb (stated, ch2) |
| Enforcer | The Observe spell is "taught to all nobles and students of any academy" (stated, ch3); everyone else uses an Observer orb that works only if the target "voluntarily placed their hand" on it (stated, ch2) |
| Default | Commoners cannot read anyone; guards and nobles can (stated, ch1: "Observe skill that all nobles and their guards knew") |
| Dial | Who teaches the spell; orb availability. Orbs are commonplace, "artificers' solution ... widespread across the continent" (stated, ch2) |
| Reason | Gatekeeping knowledge by estate and schooling; the orb democratises it only for willing subjects |
| Routes past | Fight by feel: Orodan estimates Adept level by who pressures him (shown, ch3); Identify skill later reads others (Identify 6 to 15, shown early ch91) |
| Failure cost | Misjudged opponent tiers. The "feel" is "decently reliable" not exact (stated, ch3) |
| Carry | A learned Observe or Identify skill carries as a skill |
| Visibility | The one reading sees skills and chosen titles but not sealed or unchosen information |

### SKG4: Rarity of a skill (Common / Uncommon / Rare / Exquisite / Mythical / Legendary / Celestial)

| Field | Finding |
|---|---|
| Kind | law and capacity |
| Reads | The skill's rarity word on the Status line |
| Enforcer | The System at skill creation |
| Evidence | Rarity words seen: Uncommon, Rare, Legendary (Vitality Refining 24, `latest`/ch110), Exquisite (Burst Casting), Mythical (Balance Maker 15 to 49), Celestial (Domain of Perfect Cleaning, reaching 155-160). Common stated for Calligraphy (`early`/ch91) |
| Default and dial | Not found as numbers: no stated cap, growth multiplier or cost per rarity in the read windows. Inferred: higher rarity skills appear from extreme events (Unyielding Vitality (Rare) arrived while being killed repeatedly, shown, ch2) |
| Routes past | Extreme conditions and repeated lethal practice produce rarer skills |
| Failure cost / overflow | A Celestial skill is a danger: it radiates detectable System power and drew hunters from multiple worlds when first acquired (stated, `latest`/ch110) |
| Visibility | Shown on the owner's Status line |

### SKG5: Rank as capability gate (what a mark allows)

| Field | Finding |
|---|---|
| Kind | capacity |
| Default | An Elite-level elemental mastery allows control of the external element at the cost of mana; Dimensionalism lets him alter dimensional forces; Space Mastery lets him alter an enemy's spatiomancy (stated, `middle`/ch98) |
| Other effects | A cleaning aura of 100 m forms at high Cleaning (shown, `early`/ch88); body enchanting for living objects becomes possible at specific thresholds (inferred, `middle`/ch98 "five levels away from crossing into the Adept threshold") |
| Dial | Per skill kind; each skill states what its Elite and Master marks permit |
| Routes past | Someone else's help can push a student across a threshold (an expert team attempts to push Elemental Living Enchantment and Fire Resistance past a mark, shown, ch98) |
| Failure cost | A failed push can injure the subject (insect student burned past comfort, shown, ch98) |
| Visibility | Observed by what a person can do; the mark itself is on the Status |

### SKG6: Learning-rate gates (average, talent, Blessing, lethality)

| Field | Finding |
|---|---|
| Kind | maturation |
| Default | "Calledro's Average": an academy-taught norm for how long first levels of a skill take; a "hundred hour rule" for acquiring a new skill from nothing (stated, `early`/ch91, ch93). A new craft skill costs untrained novices a week or more (stated, ch91) |
| Dial | Talent, Blessing, existing related skills ("an Apprentice-level Construction skill, an Elite-level Alchemy skill and ... Adept Laborer" beat the rule, stated, ch93), prior manuals studied (stated, ch93), teacher (stated, ch93) |
| Reason | The standard System rewards understanding and a base of knowledge |
| Routes past | Study theory first; a teacher; a related skill; lethal pressure. Some skills defy the average even at common rarity (calligraphy, shown, ch91) |
| Failure cost | Time spent without first level |
| Visibility | Taught by academies; Orodan had to infer the exceptions |

### SKG7: Danger-scaled gains (the whetstone)

| Field | Finding |
|---|---|
| Kind | resource and maturation |
| Default | Gains scale with how close the battle is to death; a single battle moved three levels of Combat Mastery (shown, ch1). Counter-intuitively, fighting an opponent one rank above (Adept) over about forty loops gave Orodan repeated large gains and the Perfect Parry, Evasiveness, Dying Struggle skills (shown, ch2) |
| Dial | Opponent rank relative to self; opponent's ability to actually kill; whether Orodan holds back to a rank (he "limits himself to the Apprentice-level" in a sparring, shown, `early`/ch91) |
| Reason | The System rewards risk |
| Routes past | Spar at a lower rank for safety (cost: smaller gains, inferred) |
| Failure cost | Death is free inside the loop, costly outside |
| Overflow | Not shown; there is no stated per-event cap on skill gain in the windows read (SKG9 absence) |

### SKG8: System connection as a dial (the crutch)

| Field | Finding |
|---|---|
| Kind | knowledge and law |
| Reads | Whether the character is connected to "the System's central glyph of knowledge" |
| Enforcer | The Eldritch-Boundless-One-backed standard System, or Orodan's own separate System (stated, `early`/ch93: "where Orodan had his own System, everyone else used the standard one") |
| Default | A connected user gains by repetition and insight; the System "often functioned as a crutch, hindering true understanding" (stated, ch93) |
| Dial | Connected or cut. Cut: skills still work but awkwardly if the number was a crutch (Club Mastery 15 felt "awkward and clumsy" with the connection cut, shown ch93); levels "caught up" and recognised later once real skill existed (Spear Mastery 36 appeared, stated ch93) |
| Reason | Numbers follow understanding, not the reverse, for a strong practitioner |
| Routes past | Build understanding from basics and study with experts (stated, `latest`/ch110) |
| Failure cost | Brute-force repetition by System assistance stops being the best path (stated, ch110) |
| Carry | Real skill survives disconnection; the number is a record of it |
| Evidence | stated and shown, partial; how he lost and regained the System is **not read** |

### SKG9: Soft caps, danger and pressure at high levels

| Field | Finding |
|---|---|
| Kind | law and world state |
| Default | No hard cap at 100: Combat Mastery 148, Incipience of Infinity 188, Domain of Perfect Cleaning 160 (shown, middle and latest). Beyond Grandmaster at 100 the title becomes Transcendent |
| Pressure | Raising certain skills pulls dangerous attention: a skill level gained "quick" with the sense of "approaching doom", and "more skill levels would only bring him nearer to something truly bad" (shown, `latest`/ch113); two concepts (Cleanliness, Infinity) grow toward a threshold where balance is lost (stated, ch111) |
| Reason | Concept skills carry a will of their own |
| Routes past | Balance them with a third skill (Eidolon of Violence is described as crushing both and bringing them under heel, stated, ch111) |
| Failure cost | Loss of control; Cleanliness once "went out of control" (stated, ch111) |
| Overflow | Pressure, in GTR16's sense: excess does not vanish, it becomes risk |
| Visibility | Felt by the owner, not on the Status line |

### SKG10: What the loop carries and what it does not

| Item | Carries | Does not carry | Evidence |
|---|---|---|---|
| Skill levels and new skills | Yes: Sword 34 to 35 after the first death; skills from the previous loop listed on awakening (shown, ch1, ch3) | Nothing observed lost; "how it carried over across repeats, Orodan did not know" (stated, ch2) | shown |
| Titles | Yes, as "Available Titles" | | shown, ch1 |
| Blessing | Yes (listed after first loop) | The god does not remember granting it (stated, ch1) | shown |
| Mental scars and grief | Yes: "mental scars and wounds carried over just fine" (stated, `early`/ch88) | | stated |
| Knowledge | Yes: he remembers events, guard routines, boss patterns | NPC memory resets; a priest who believed him was killed the same day (shown, ch1) | shown |
| Wounds and body | | Reset to the awakening state: the body is whole at the start (shown, ch1) | shown |
| Items | Mostly not: he wakes in his hovel, a loop-start state (shown, ch1) | Carried items not observed in the windows; later chapters carry artifacts physically only by bringing them each loop | inferred |
| World events | | World resets to the harpy-wail night (shown, ch1) | shown |
| Allies' knowledge | Via Fenton's orb, allies' alternate selves sync memories and skill levels ("the orb retains skill level gains") (stated, `early`/ch92) | Without the orb, allies reset | stated |
| Loop duration | | Loops stop at the end of the cycle (five days after Embodiment, then outside forces arrive), "a time limit" (stated, `early`/ch91) | stated |
| Cost of looping | Carry also includes persistent attention from beyond (hunters, Hegemony descents, Embodiers) as the Status grows | | stated, shown |

### SKG11: Trials and external responses at Transcendence

| Field | Finding |
|---|---|
| Kind | world state and social |
| Default | Reaching Transcendence summons a "trial" and the Hegemony's descent. Once a person passes the trial in one loop, later loops no longer trigger it (stated, `middle`/ch97 "once he had Transcendence in one loop, the elf wouldn't be bothered by the trial or the Hegemony's descent in following ones") |
| Dial | Whether the person has already passed; Orodan no longer gets trials since passing his first and disconnecting from the System (stated, `early`/ch91) |
| Reason | The Hegemony enforces access to the transcendent tier |
| Routes past | Pass once; the loop makes that permanent for the person |
| Failure cost | Combat against a descending force, or kill-on-sight by the Hegemony; the descended force can be driven off if a stronger being intervenes (shown, ch97) |
| Visibility | Public: the world sees the descent |

### SKG12: System space as boundary

| Field | Finding |
|---|---|
| Kind | world state and law |
| Default | "System space" is the region the System covers; it has a boundary with the outside universe where invaders arrive; defending it is the looping goal at Book 3-4 ("Train. Protect System Space. Die. Repeat.", `latest`/ch110) |
| Reads | Location relative to the boundary. A soul taken past the boundary is "irretrievable" (stated, ch112) |
| Enforcer | The Administrators (Warrior, Custodian, Mage, Master of Death, and others) |
| Dial | Boundary strength; whether an item, skill or person originates inside. Pulling something from outside System space back in time drew Anomaly #3 (stated, ch110) |
| Reason | The loop and the System cover the same space; what lies beyond is not supported by the loop |
| Routes past | Leave System space deliberately (cost: loop does not protect; can be slain and not return, as the Mage's wormhole threatens, shown ch111); trade with factions inside |
| Failure cost | Permanent death of a soul if taken past the boundary |
| Carry | The loop mechanism works inside; whether it extends past the boundary is **not read** |
| Visibility | Known to Administrators and Orodan; not to ordinary people |

### SKG13: Admission and social ranks by skill

| Field | Finding |
|---|---|
| Kind | credential and social |
| Default | Entry to the county-seat academy is by militia sponsorship after an orb reading (stated, ch2); an enchanter's Master title is evaluated by a national panel (stated, `early`/ch88); some nations have a Grandmaster per skill, and a young nation might not (stated, ch88) |
| Reason | A young state pools its few high skills |
| Routes past | Fraud is hard because the orb reads true; a strong person can show lower titles (cost: loses perks) |
| Evidence | stated and shown at specific scenes only; I did not read the Book 1 institutions chapters |

### SKG14: Opponent-driven gains and NPC behaviour exploits

| Field | Finding |
|---|---|
| Kind | world state |
| Default | NPC behaviour depends on how the fight goes: killing all seven guards makes the Adept fight at full seriousness and the second Adept not appear unless a guard survives to fetch her (shown, ch3) |
| Reason | The world is scripted by cause and effect, so the loop's training is limited by what the world sends |
| Dial | Which NPCs show up and when |
| Routes past | Choose which guard to leave alive |
| Evidence | shown, ch3 |

## 4. Engine coverage (a): what already exists, with file:line checked

| Gate | Engine piece | What it covers | Gap |
|---|---|---|---|
| SKG1 rank bands | `src/models/skill.js:157-172` (`names` keyed by level: rank name by highest key at or below level) | Rank words per skill by level, e.g. `{0:'Initiate', 30:'Apprentice', 50:'Adept'}` | Not a credential, no social effect; `max_level = 60` at `skill.js:22` blocks skills past 60 unless a row sets it; Book skills past 100 need higher `max_level` |
| SKG1 marks as rewards | `skill.js:206-213` (milestones unlock skills/recipes/quests) and `skill.js:303-305` (milestone stats and xp_multipliers) | Per-level unlock and bonus hooks | Milestones grant stats and unlocks, not public titles or recognition |
| SKG1 titles list | `levelable_component.js:56` has a `titles: {}` object in state | A title store exists | Whether it supports active vs available titles and display choice was not traced; check before using |
| SKG2 credentials | `src/progression_gates.js:32-47` (`defineGate`, `kind: 'credential'`) and `GTR25` | Gate descriptor with kind, reason, routes, `closes: 'revocable'` | No per-world title ledger or recognition by an institution; GTR25 is a rule only |
| SKG3 Observe | `src/progression_gates.js:52-67` (`evaluateGate` with `knows`, `VAGUE_HINT`) | Author-side vs player-shown reasons (GTR10) | No "what a reader can see of another's status" gate; `src/status_window.js:1-15` is a self-view panel |
| SKG5 capability marks | milestones at `skill.js:206-213` | Unlocks at a level | Needs a "may do X at mark" gate kind with a per-skill row; fits GTR3 capacity but the engine row is absent |
| SKG6 learning rate | `skill.js:303-305` `xp_multipliers`, and `levelable_component.js:132-136` (`getSkillXPGain`) | Multipliers on XP gain | No "related skill boosts new skill" row seen; unverified |
| SKG9 overflow / pressure | `src/skill_overflow_domain.js:10-19` (per-world row table), `:35-50` (settle) and `levelable_component.js:138-141` (the call at the single-gain cap) | `lost` vs `banked` for the single-gain cap with `limitLevels` and `drainRatio` | Covers only the per-gain cap. The `pressure` policy in `OVERFLOW_POLICIES` (`progression_gates.js:14`) has no implementation in this table; `skill_overflow_domain.js:37` returns `Math.min(xp, cap)` for any non-banked policy |
| SKG10 loop carry | `src/carry_ledger.js:20-29` (`WORLD_RULES` keyed `base.frontier`, `book.paradise.hub`; rows with `boundary`, `carries`, `scope`) and `src/lives_carry_domain.js` | A per-world carry table with boundaries `death`, `rebirth`, `world crossing` | No `loop reset` boundary; no `loop` row for this world; `FRONTIER` row for "Body, skills and levels" is `drops` at `carry_ledger.js:16`, the reverse of this world's default |
| SKG12 System space | None | | Absent |
| SKG13 admission | `progression_gates.js` kinds only | | No institution record store |

Not found in the engine, searched with `grep -rln` for "time loop|time_loop|timeloop|mother-of-learning" in `src` (hits only in `book_world_player_agency_contracts.js`, `feature_expansion_book_recognition.js`, `main.js`, `backlog_expansion_time.js`): a time-loop reset boundary or loop-count state. I did not read those four files for loop state.

## 5. Proposed per-world rows (b)

All rows are proposals. World id is a placeholder (`book.stubborn-skill-grinder`). Values are defaults with a dial and a reason.

### 5.1 Skill overflow row (GTR16, GTR21, GTL6 table)

```
'book.stubborn-skill-grinder': {
  policy: 'banked',
  limitLevels: 3,
  drainRatio: 2,
  reason: 'A near-death fight teaches in a flood; the lesson settles over later practice rather than vanishing. In this world the System rewards danger, so one big battle is worth more than a sitting of drilling.'
}
```

Why banked: the source shows a single battle awarding large multi-level gains (Combat Mastery 11 to 14 in one fight, ch1) and the loop makes repeated lethal fights the central practice, so silently losing a big lesson would run against the world's rule. The existing frontier row holds one level of XP at `drainRatio` 1; this world sits above it because danger-scaled learning is the point (SKG7).

Dials, defaults and what moves them (proposals):

| Dial | Default | Moves it |
|---|---|---|
| `limitLevels` | 3 | Blessing of Agathor-style learning bonus raises it; System disconnection (SKG8) lowers it to 1 because levels follow understanding, not reward |
| `drainRatio` | 2 | A teacher or manual study (SKG6) raises it; fatigue or a missing related skill lowers it |
| Pressure at Celestial skills | Off at base; proposed `pressure` row for Celestial-rarity skills (SKG9) | Rarity of the skill |

Caveat: `settleCappedSkillGain` supports only `lost` and `banked` today (`skill_overflow_domain.js:37`); a `pressure` policy needs new code. The `limitLevels: 3` and `drainRatio: 2` dial values are proposals that exceed the frontier row; the draining rule at `skill_overflow_domain.js:44-46` caps a release at `drainRatio` times the fresh gain, so the value is bounded.

### 5.2 Loop-retention gate rows (carry ledger shape, SKG10)

Proposal: add a fourth boundary `loop reset` to `carry_ledger.js` `BOUNDARIES`, then a table for this world.

| Boundary | What | Carries | Scope | Note |
|---|---|---|---|---|
| loop reset | Skill levels and new skills | carries | any life | Default; the dial is System connection (SKG8) |
| loop reset | Titles and Blessings | carries | any life | Active title choice is the player's |
| loop reset | Knowledge of events, routes and people | carries | any life | Others forget unless synced |
| loop reset | Memory of loss, mental wounds | carries | any life | Stated in `early`/ch88 |
| loop reset | Body, wounds, injuries | drops | this life | Wakes whole, at the awakening night |
| loop reset | World state, NPC memory | drops | this life | Reset to the harpy-wail night |
| loop reset | Items and money | drops | this life | Default; an exception route is a bound item (inferred, not shown) |
| loop reset | Ally progress | drops | this life | Unless synced by Fenton's orb (shown, `early`/ch92), in which case it carries for that ally |
| loop reset | Quest state | drops | this life | The Quest reissues each loop (shown, ch1) |

### 5.3 Rank-band rows (SKG1, SKG2), proposed data

Per-skill `names` table of `{0:'Initiate', 30:'Apprentice', 50:'Adept', 70:'Elite', 90:'Master', 100:'Grandmaster', 101:'Transcendent'}` with a world dial `titleMarks` that a skill row may override. `max_level` per skill raised past 100 for concept skills. These marks are inferred from the title lines in section 3; the 90 mark rests on one bracket, so a world pass should recheck it.

### 5.4 Gate descriptor stubs (GTR1, GTR3)

| Gate id | Kind | Reads | Reason | Routes (cost) |
|---|---|---|---|---|
| `skg.rank.elite_external_element` | capacity | Elemental mastery at the Elite mark | The System lets a mastery command the external element once it passes the mark | Mana cost per use; a student pushed across by experts at injury risk |
| `skg.observe.read_status` | knowledge | Target's displayed titles | Observe taught to nobles and students | Orb with target's consent; feel in combat with reduced accuracy |
| `skg.transcendence.trial` | world state | Skill at Transcendent mark and first-time flag | The Hegemony enforces access | Pass once; a stronger being driving the descent off |
| `skg.system.boundary` | world state | Location inside System space | The boundary separates loop-supported space from outside | Leave deliberately; risk of permanent loss |

## 6. New gate shapes not covered by GTR1-GTR27 (c)

Proposed rule text, prefix SGX. Each is a default with a dial and reason; none is accepted.

| Code | Proposed rule | Dial | Mistake it prevents |
|---|---|---|---|
| SGX1 | **A loop boundary is a named carry boundary.** A time-loop or reset world states what its reset carries per category (skills, titles, knowledge, wounds, items, ally progress, world state) in the carry ledger, with a scope and an in-world reason. The default carry is per world, not a global save rule. | Per world, per category, per ally (a sync device may carry for an ally) | Treating a loop as death-and-rebirth with the same drop table, or as a save slot |
| SGX2 | **A recognition ladder has marks, titles and capabilities as separate facts.** A mark (number) issues a title (credential), may unlock capabilities (SKG5) and may change how institutions treat the holder (GTR25), and each of the three is its own row so a world can issue a title without a capability or the reverse. | Per skill kind; which titles display | One "milestone" row that hands out stats, titles and respect together |
| SGX3 | **Reading another's status is a gate with its own routes.** Who may read what of whom (skills, chosen titles, hidden Blessing) is a knowledge gate with an enforcer (spell, device, consent) and an inference route (feel, behaviour) whose accuracy is a dial. The target may choose what to show. | Per world: privilege by estate, device availability, consent; accuracy of the inferred route | Exact opponent numbers shown to everyone, or hidden from everyone |
| SGX4 | **A skill number can be a crutch.** Where a system rewards repetition, the number may run ahead of understanding; disconnecting or switching to understanding-first training changes what the number does for the holder and how the recorded level catches up. | Connected or cut; whether the level catches up | Treating level as the only measure of ability |
| SGX5 | **Pressure at the top is overflow with a will.** A high-rarity or concept skill that grows past a balance point does not cap; it raises risk (attention, loss of control, attracted enemies). The overflow policy is `pressure` with a named cost and a balancing route. | Which skills; the balancing partner; severity | Uncapped growth that is free, or hard caps that stop concept skills |
| SGX6 | **Tier ascents summon a response, once per holder.** Crossing a high mark may call a world response (a trial, a descent, hunters). A holder who has passed it is not called again by the same mark in later loops or lives; the response is a world-state fact with its own record. | Per mark, per holder; whether the response recurs | Re-triggering the same gate every loop, or never having one |
| SGX7 | **Danger scales learning, with a stated risk model.** Where the world pays more for riskier practice, the rate is a function of how likely the practitioner is to die, and the table says what happens when death is free (a loop). The player can see the practice-risk-yield relationship through results. | The curve; whether holding back is allowed (a "limit myself to" route) | Free lethal grinding with no cost, or lethal-only teaching with no alternative |
| SGX8 | **A boundary is a region the progression covers.** A world whose progression (loop, System, Status) applies to a region states the boundary, what crosses it, and what happens to progress and to souls outside it. | Region; permeability; consequence outside | Assuming a progression system applies everywhere the character can travel |

Rule text avoids absolutes; each says "default" and gives a dial. Cross-check against GTR1-GTR27: GTR8 (carry across worlds) covers world crossing, not a reset inside one world; GTR13 (gates close again) and GTR16 (overflow) do not define a loop boundary or a pressure policy implementation; GTR25 (credentials) covers records, not the mark-title-capability split. Hence the proposals above.

## 7. Honest absences (d) (WPR23)

| Looked for | Searched where | Result |
|---|---|---|
| Numeric cap or soft-cap table for skill levels | Regex across all 14 chapter entries for "max level", "maximum", "diminish", "soft cap", "plateau", "cap" | No cap statement. Skills run past 100 (shown). One "diminish" hit is figurative (ch111). Diminishing returns on XP not found |
| Rarity effect on growth cost | Windows around Uncommon/Rare/Legendary/Celestial lines | Rarity words appear on status lines; no cost, cap or growth multiplier found |
| Class gates or attribute point gates | "Class", "stat point", "Attribute" counts per chapter (a few hits) | Hits are about "attributes" as physical traits and "class" as a type of person (the Class hits read as generic). No class system found; the world uses skills, titles, Blessings, no class selection seen |
| Perks or skill-point budgets | "Perk", "Skill Point", "Mastery Point" | None found |
| How Book 1 institutions gate admission (academy exams, guild ranks) | Chapters 4-87 are not in the files | Not read. Only the county-seat transfer offer (ch2) and the national panel evaluation (ch88) |
| How the System was lost and regained | Chapters 95, 101-109 not in files; windows with "losing his System" and "System-less" | Stated as past events only (`early`/ch92, ch93; `latest`/ch110). Not read |
| Whether the loop stops carrying under some condition | Windows around "carried over" and "retain" | Skill, mental and title carry shown; condition for failure to carry not found. Loop duration limit is stated (five days after Embodiment) |
| Item carry across a reset | "Items", "carry" windows | Not shown in the windows. Early chapters show a loop-start state in the same hovel |
| Book 5 | Epub chapter list for all three files | Book 5 is stubbed; no gate can be read |
| Fan game "Learning Curve" (itch.io, named in a ch91 author note) | Not searched | Not read |

## 8. Hand-off notes

- To land SKG10 in code, `carry_ledger.js` needs a fourth boundary and a world key; no loop state in `src` was found by name, and the four files that matched "time loop|mother-of-learning" were not read.
- To land 5.1, `skill_overflow_domain.js` needs one row; `limitLevels` 3 and `drainRatio` 2 are proposals that Weibao has not seen played.
- SGX codes are proposals for `docs/PROGRESSION_GATE_RULES.md`; nothing was added there.
- Verification state: source reading done; engine citations checked by reading the cited lines; no code run, nothing tested or played.
