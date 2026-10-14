# Top three previously undocumented deeper systems

Ranked PROPOSALS by YAIRPG payoff and missing prior implementation evidence. All results are SHOWN static reads of build 25097075 except deductions marked INFERRED. No source prose, code or assets should be copied into gameplay. This is a short resolver deepening, with caller/lifecycle gaps retained.

## D1: monster assembly and growth

**Payoff:** original nonhuman identity can alter progression and combat rather than merely decorate a name. Prior lanes had the table and helper names but did not trace the resolver.

MonsterMaker at 0x140b0e09b initializes temporary description/art/color/strength and three ability slots. Its rand()%5 draw chooses a three-part path for residues 0 and 1, and a two-part path for 2..4. Data/monsters.txt has 105 physical rows, 35 each for categories 1, 2 and 3. The native path is Data/Monsters.txt; the inventory's case differs, so reference matching is case-insensitive.

The three-part path selects category 1, then 2, then 3 through rejected random row draws. The two-part path begins with category 2. Category 1 sets strength and ability 1; categories 2/3 add strength and fill abilities 2/3. Each row also supplies a count of dot-delimited art segments and descriptive remainder. The two-part result leaves ability 1 at zero. A final RandomColour supplies presentation color. Nominal path mass is 2/5 versus 3/5; this does not certify platform RNG uniformity or all combinations' usefulness. No bounded fallback is shown if an eligible category is removed.

MonsterLeveller at 0x140b1c6c1 selects slot 1, 2 or 3 from MonsterUp, increments level, subtracts 100 XP and adds newLevel+1 strength. Starting from level L, one call gains L+2 strength. INFERRED for n calls without other changes: total gain is n(L+2)+n(n-1)/2, costing 100n XP. The helper has no internal XP eligibility check.

A bounded MonsterViewer caller at 0x140b0f704-0x140b0f777 checks the selected monster's XP>99, sets MonsterUp and invokes the helper. The same nearby third-slot branch adds 5 XP before the check; the full activity/cost gate before that branch is unread. This establishes one >=100 gate, not every training path or a multi-level while loop. The helper clears selection/pause-control scratch state and has explicit XP/strength receipts, optional art, sound and pause suppression.

The save writer directly retains 33 fields for three monster slots: identity/presentation, strength, three abilities, feeding state, XP and level. Trainer, pit and challenge fields add more state. No save/reload was exercised.

**UNREAD:** ability meaning/effects, MonsterFight budgets, feeding prices, all XP sources, trainer cadence and other caller gates. Private locators: `_Z12MonsterMakerv.c.txt/.asm`, `_Z15MonsterLevellerv.c.txt/.asm`, selected caller windows and the earlier save-schema.json.

**PROPOSAL P4:** generation foundation plus `docs/worlds/NONHUMAN_PROGRESSION_AND_BALANCE_2026-10-14.md` should join one original part trait to a real progression/combat consumer. Show applied growth and preserve identity across save/reload/import. The source's three-slot cap and 100-XP coefficient are not YAIRPG requirements.

## D2: directed starting relations

**Payoff:** Province War can separate a faction's directed view, initial bias and treaty state. Prior documentation identified diplomacy but did not recover this writer.

GenerateRelations at 0x140ac6427 removes and recreates Data/Relations.txt, then writes fourteen rows of fifteen values each. Each row has one fixed 100 at columns 0..13 respectively and fourteen independent RelationRand calls. The full matrix therefore contains 210 values: 14 fixed and 196 random. It is not a demonstrated 14x14 symmetric relation matrix. Full private writer schema records every cell's bias input and negative flag. Row/column faction identities and the extra column's reader meaning remain unread.

RelationRand at 0x140a3a214 takes original input R in Randomiser1. For R>0 it first draws d=rand()%R, then a rand()%2 sign choice and rand()%10 magnitude k. In the ordinary path the result is d-k or d+k. When RelationsMinus==1, the result instead becomes -R-k or -R+k, discarding d while still consuming its RNG draw. It clears RelationsMinus before returning. For R=0 the initial modulo draw is skipped. Negative R inputs were not identified in this writer.

Thus R=10 with negative bias yields -19..-1; R=5 with negative bias can yield -14..4. The latter can become positive despite the negative-bias flag. In the last five rows, a positive final value sets BanditTruce1..5 respectively. Those tests set flags; they do not clamp the written values. The prior main save census retains BanditTruce1..5 at writer indices 277..281, so the flags and generated relation file have separate persistence evidence. The initializer has no shown corresponding zeroing in those five checks, so reset ownership needs a caller read.

**INFERRED:** separate calls make relations directed unless a downstream reader imposes symmetry. Initialization is hard-coded bias plus noise, not proof of emergent diplomacy or faction AI. The live generated file was excluded from the private capture; only its code-derived schema is retained.

**UNREAD:** DiplomacyRelation/IndieDiplo consumers, faction/column mapping, reset cadence, truce effects and whether save companions isolate relation state. Private locators: `_Z17GenerateRelationsv.c.txt/.asm`, `_Z12RelationRandv.asm`, `relation-writer-schema.json`. RelationRand's formula was checked directly in assembly rather than spending another analysis batch.

**PROPOSAL P5:** the existing NPC/Province War owners should keep directed relation, enforceable agreement and truce as separate facts. A changed relation needs a real negotiation/action reader; a save/import gate should include generated companion state where required. Original social coefficients remain local design choices.

## D3: quest composition

**Payoff:** connect generated descriptive variety to actual item/place/person facts and objectives. Prior lanes had quest text and the helper name without its resolver.

QuestGenerator at 0x140ad7b3e counts Data/QuestItem.txt, selects a random row, parses its integer prefix as questItemValue and uses the remainder as questItem. The table has 718 physical rows. The place stage draws rand()%96; outcomes include complete named places, a SmallHaven intact/ruined state branch and prefixes that request a second rand()%77 noun draw. One personal possessive place calls Name while saving and restoring Name1/Name2, demonstrating scratch-state hygiene rather than a new durable person record.

The giver stage draws rand()%50 but defines only cases 0..26. Residues 27..49 take a default FarmerTypeRand path after setting FarmerTypeNoSpace. INFERRED nominal default mass is 23/50; 50 draw slots are not 50 distinct giver types. Item, place and giver selection do not prove semantic compatibility between every combination.

The helper produces four scratch outputs: questItem, questItemValue, questPlace and questGiver. Its shown body does not contain objective progress, travel feasibility, reward payment or a journal resolver. Those exact scratch fields were not found in the prior direct writer-field census. That bounded absence does not exclude callers retaining composed prose or derived quest state elsewhere. Candidate call sites are retained privately, but the byte-level scan is a routing aid, not complete call-graph or reachability proof.

**UNREAD:** full caller reward/objective chains, item value use, journal persistence and whether generated place wording always maps to an explorable location. Private locators: `_Z14QuestGeneratorv.c.txt/.asm`, QuestItem capture and `new-calls.json`.

**PROPOSAL P3:** `docs/CHARACTERS_AND_WORLD_EVENTS.md` and the existing generation foundation should generate descriptions from stable records with validated feasibility, then join an objective, payer, reward and durable outcome. Preserve reasonable repeated routes; descriptive variety alone is not a playable quest.

References: [aspect map](ASPECTS.md), [save baseline](../pass-2026-10-14-rea/SAVE_FORMAT_DIGEST.md), [Province War fit](../pass-2026-10-14-rea/PROVINCE_WAR_FIT.md), [private evidence index](PRIVATE_REFERENCE_INDEX.md).
