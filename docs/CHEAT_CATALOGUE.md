# Cheat catalogue

Proposal catalogue, 2026-11-10 (AD32); palette, not spec. Requested by Weibao: "Maybe types of cheats should be kept as a catalogue somehwere, do be drawn upon and implmented eventually? other stuff and more?" and "D5, we should look further into this?" Rules: [CHEAT_RULES](CHEAT_RULES.md) CHT1-CHT20. His standing line applies here too: "The idea that there is no forced weakness should honestly apply to everything", so the limits column is an optional per-card adjective list (CHT12), with no required drawback (default: none; dial: per card).

This page dedupes the roughly 95 cheats spread over the [library](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) (49 families, 20 gameplay families, AQ routes, 13 idea cards), the [cosmology](CHEAT_COSMOLOGY.md#simple-cheats) (simple cheats), [cheats by world](CHEATS_BY_WORLD.md) (about 90 book and game rows), the [simulator doc](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md) and the [core audit](audits/CHEAT_CORE_AUDIT.md) into types. A type is a shape of advantage; a card (CHT4) is one world's version with terms. Rows marked "new, agent addition" are common web-novel or game tropes the repo does not yet name; they are agent proposals, not accepted direction.

Reading the columns. **Backing** is the CHT5 list: soul, body, item, system, world law, patron, knowledge, concept. **Engine hooks** name the seam a card would use: power registry (ABR16, as `cheat.rehearsed_foe` does), knowledge carriers (KNW), time bank (`native-clock.forward`, Patient Furnace), making (crafting patterns), ties and standing, entry (WER and the CHT16 warning), carry ledger (AD11), gates, seeded streams, harvest. **Status** names built modules in `src/` (`cheat_definitions.js`, `cheat_cards.js`, `cheat_growth.js`, `rehearsed_foe.js`), "partly" where an engine piece exists without a cheat card, and "not built" otherwise.

What is built today, for orientation: the quiet base faculty (Continuing insight) with eight facets (True Appraisal, Loaded Dice, Fate Ledger, Earned Habit, Pattern Book, Heirloom Compact, Patient Furnace, Freshness Sense), a dormant quest-system card, a ring-spirit card with an unreliable voice, kind skins and a growth track, and one power-registry cheat (`cheat.rehearsed_foe`). Grants route through `applyStartGrants` from a start's `grants`.

## A. Information and foresight

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC1 | Appraisal eye | Read an object, body or person more closely before choosing | Body, system | Library of Heaven's Path flaw sight; Nine Eyes; analysis chips; litRPG "Appraisal" | Knowledge (timestamped readings), harvest | Charges, eye grade, readings age | built: `true-appraisal` | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC2 | Threat sight | Rate everyone by danger to you, scaled to your rank | System | Virtuous Demon system gauge | Knowledge, standing | Capped by rank | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC3 | Foresight ledger | Peek at a named future draw without advancing it | Knowledge, concept | Dinah in Worm; Cassie in Shadow Slave; Lord of the Mysteries divination | Seeded streams, knowledge | Calls per day, clarity grade | built: `fate-ledger` | [SIM](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md#telling-the-future-2026-10-10) |
| CTC4 | Rehearsal and simulator | Simulate a branch, rehearse a known foe, keep one result | System, knowledge | Life-simulator stories; Warlock A.I. Chip; Legendary Mechanic | Power registry, fork contract | Cost per run, sim error grade | partly: `cheat.rehearsed_foe` | [SIM](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md#the-simulator-as-one-idea-many-forms-2026-10-10) |
| CTC5 | Future knowledge | Act on what the reader or regressor knows will happen | Knowledge | Omniscient Reader; regressors; Legendary Mechanic | Knowledge carriers, carry ledger | Decays as history diverges | partly: knowledge carry, no card | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC6 | Daily intelligence | One piece of intel a day | System | Daily-intel system stories | Knowledge, rumor, notebook | Vague, one per day | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC7 | Freshness and provenance sense | Read how old a retained observation is | Body, knowledge | Original idea | Knowledge timestamps | Reading keeps original content | built: `freshness-sense` | [CORE](audits/CHEAT_CORE_AUDIT.md) |
| CTC8 | Seed cartographer | Read the structure of a run before living it | Knowledge, system | Noita seed tools (player-layer) | Seeded streams | Version of the algorithm | not built | [LIB](CHEAT_LIBRARY.md#5-seed-cartographer-seed-foreknowledge) |
| CTC9 | Inner voices | Faculties speak as separate advisors that can disagree | Soul, mind | Disco Elysium | Knowledge presentation, voice | Voices differ in reliability | partly: voice slice (`cheatVoice`) | [CBW](CHEATS_BY_WORLD.md#game-cheats-2026-10-10-codex) |
| CTC10 | Truth reading | Tell a lie, a mask or a hidden property from a plain thing | Body, concept | Lie-detector and mind-reading tropes (new, agent addition) | Knowledge, ties | Reads signs, not facts | not built | new, agent addition |
| CTC11 | Fourth-wall reading | Read the story, its characters and its scenario rules from outside | Concept, system | Omniscient Reader | Knowledge, world law | Understanding grows by use | not built | [COS](CHEAT_COSMOLOGY.md) |

## B. Time and loops

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC12 | Time loop | Repeat a fixed span, keep what the world allows | World law, soul | Mother of Learning; You Have Died Again; Idle Loops | Carry ledger, time bank | What persists is per world | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC13 | Death-menu regression | Die by choice or accident, pick what carries, restart from an anchor | Soul, system | Primordial Saint Sect's Book; Regressor's Tale; Re:Zero-style | Carry ledger, anchors | Carry slots, anchor count | partly: return and carry, no menu card | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC14 | Rebirth with memories | Start a new life with the old one's memory and base cheat | Soul, knowledge | Regression and transmigration novels | Carry ledger (AD11), entry | Memory entitlement per world | partly: carry of base cheat and memory | [COS](CHEAT_COSMOLOGY.md#haruhi-and-steinsgate-owned-worlds-memory-and-history-pushing-back-proposal-claude-2026-10-10) |
| CTC15 | Checkpoint save | Save and reload inside the fiction | System, item | Echo Anchor; You Have Died Again | Save envelope, anchors | Slots, what the world remembers | not built | [LIB](CHEAT_LIBRARY.md#1-echo-anchor-save-and-reload) |
| CTC16 | Away-time engine | Unused away time banks and spends forward by real rules | System, item | Auto-cultivation; Upload Labs and Bitburner offline | Time bank | Cap, real stops, one routine | built: `patient-furnace` | [LIB](CHEAT_LIBRARY.md#2-patient-furnace-offline-progress) |
| CTC17 | Time dilation room | Spend more subjective time than the world does | Item, world law | Renegade Immortal bead; pocket farm with fast time | Time bank, calendar | Hours per day, size | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC18 | Time stop or slow | Freeze or slow others for a span | Body, concept | Time-magic tropes (new, agent addition) | Combat turn seam, calendar | Span, who is exempt | not built | [COS](CHEAT_COSMOLOGY.md#time-cheats-by-how-they-work) |
| CTC19 | Revival schedule | Die and return on a timer or with charges | System, soul | A Novel Concept daily revival; Legendary Mechanic respawn; Elden Ring grace | Death handling, carry | Charges, XP penalty | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC20 | Retrocausal edit | Change a past fact and its consequences | Concept, world law | Steins;Gate; Haruhi | Calendar, continuity rules | History pushes back by degree | not built | [COS](CHEAT_COSMOLOGY.md#how-history-pushes-back-a-spectrum) |

## C. Growth and leveling

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC21 | Quiet continuing growth | Lived milestones earn insight that buys facets | Body, soul | The base cheat (CHT1-CHT3) | Gates, growth track | Insight pace, small reserves | built: `quiet-faculty` | [CORE](audits/CHEAT_CORE_AUDIT.md) |
| CTC22 | Quest and status system | Quests, points, a shop and a status window | System | Solo Leveling; Fated Villain; Legendary Mechanic; The Gamer | Power registry, status window | Quest pace, system reach | partly: `system-quests` card, dormant | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC23 | Effort pays off | Every action gives steady progress, no plateaus | Body, system | Effort-reward systems | Skill XP seam, pacing rules | Time still passes | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC24 | Sign-in and daily rewards | Rewards for checking in, bigger at significant places | System | Sign-in system stories | Calendar, map, entry | Rate, reachable places | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC25 | Achievement and title collector | Deeds pay rewards; titles carry effects and can evolve | System, concept | A Novel Concept titles; gamer systems | Standing, deed ledger | Which deeds count | not built | [LIB titles](CHEAT_LIBRARY.md#titles-achievements-and-rule-editing-cheats-2026-10-15) |
| CTC26 | Talent lottery | Draw talents on a schedule; keep, discard or reroll | World law, system | Yearly trait draws | Seeded streams, talents | Draws per period | not built | [SIM](SIMULATORS_AND_CHEAT_IMPLEMENTATION.md#talent-generation-considerations-2026-10-10) |
| CTC27 | Hidden-grade evolution | A trash-looking talent is secretly top grade and opens by a condition | Body, concept | Underdog cultivation; trash-talent tropes | Gates, knowledge | Condition found by play | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC28 | Max talent at birth | Everything starts at the top grade | Body | God-start stories | Start grants | World reacts by envy and attention | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC29 | Reading growth | Grow by reading books | Knowledge | Book-eater tropes; Mother of Learning study | Knowledge, making patterns | Books read | partly: learned methods feed insight | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC30 | Perfect comprehension | Understand any technique on seeing it | Soul, knowledge | Comprehension stories | Knowledge, skills | Access, body fit | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC31 | Instinct inheritance | Skills and instincts survive a reset | Soul, body | Increlution; Progress Knight | Carry ledger | Per-ledger carry | partly: stages carry | [LIB](CHEAT_LIBRARY.md#7-instinct-inheritance-what-survives-the-reset) |
| CTC32 | Prestige multiplier ledger | Compare and choose what a restart multiplies | System | Idling to Rule the Gods; Bitburner | Carry ledger, preview | Chosen per restart | not built | [LIB](CHEAT_LIBRARY.md#6-rebirth-ledger-prestige-multipliers) |
| CTC33 | Evolution and adaptation | Grow by eating, absorbing or surviving | Body | Monster starts; A Novel Concept adaptation; Genetic Ascension | Body state, harvest | Evolution points | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |

## D. Making and economy

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC34 | Perfect crafting | Crafts succeed or exceed | Skill, system | Perfect-pill alchemist stories | Making, quality grades | Materials still real | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC35 | Pattern memory | Remember a readable design and rebuild it in a new body | Knowledge | Factorio blueprints; Traveler's Pattern Book | Making, knowledge | Needs a method you can read | built: `pattern-book` | [LIB](CHEAT_LIBRARY.md#4-travelers-pattern-book-blueprints-and-records) |
| CTC36 | Duplication | Copy items at a cost | Item, system | I Shall Seal the Heavens copper mirror | Making, economy | Copy fuel, grade ceiling | not built | [CBW](CHEATS_BY_WORLD.md#er-gen-worlds) |
| CTC37 | Earned automation | A routine you did by hand runs finite stretches on its own | Body, system | Increlution; Melvor auto-eat | Harvest routine, time bank | Finite, existing tool and body rules | built: `earned-habit` | [LIB](CHEAT_LIBRARY.md#8-earned-habit-automation) |
| CTC38 | Gacha or lottery shop | Points buy random rewards | System | Gacha systems | Seeded streams, shop | Odds shown per dial | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC39 | Multiplier return | What you give returns multiplied | System | 10x to 10,000x return stories | Ties, standing, economy | Recipients are the bottleneck | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC40 | Equivalence ledger | Derived prices and exchange between goods | System, knowledge | Original card 13 | Economy, price path | Per world | not built | [LIB](CHEAT_LIBRARY.md#13-equivalence-ledger-derived-price-and-exchange-proposal-2026-10-23) |
| CTC41 | Territory and building | Building grants power; a base snowballs | System, item | Dungeon cores; territory systems | Home, making, defense | Materials, upkeep | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC42 | Pocket farm | A field with its own clock and soil | Item, world law | Pocket-farm novels | Time bank, harvest | Size, seeds | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC43 | Shop from elsewhere | Buy goods from a catalogue outside the world | System, patron | Paradise shops; sign-in shops | Economy, entry | Price may be years or memories | not built | [LIB](CHEAT_LIBRARY.md#routes-aq) |
| CTC44 | Heirloom and legacy | Nominate goods for a successor by local inheritance law | Item, institution | Rogue Legacy; Sunless Sea | Estate, ties | Debts settle through owners | built: `heirloom-compact` | [LIB](CHEAT_LIBRARY.md#3-heirloom-compact-legacy-and-succession) |

## E. Body and soul

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC45 | Special physique | A congenital body with its own functions | Body | Regressor's Tale physiques; Golden Thunder Body | Power registry, body | Diagnosis may be partial | not built | [CBW](CHEATS_BY_WORLD.md#other-books) |
| CTC46 | Regeneration and life force | Life force trains the body and heals it | Body | A Will Eternal Undying; Legendary Mechanic | Body, power registry | Energy is not refilled by healing | not built | [CBW](CHEATS_BY_WORLD.md#er-gen-worlds) |
| CTC47 | Body swap and possession | Live in other bodies and return | Soul | Fated Villain; ghost starts; Battle Brothers possession | Entry, ties | Hosts, return rules | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC48 | Shapeshift and mimic | Become what you have seen or eaten | Body | Monster mimic stories | Body, standing | Forms known | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC49 | Clones and many selves | Run several bodies at once | Soul, body | Blood Clone; five soul clones; Dao Body split | Actors, attention | Bodies, coordination | not built | [CBW](CHEATS_BY_WORLD.md#er-gen-worlds) |
| CTC50 | Harvest and absorb | Take what the defeated had and settle it | Body, system | Golden Natures; Soul Eater; Skill Eater; PowerOrigin | Harvest, power registry | Slots, daily caps | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC51 | Copy and plunder | Observe or touch to copy an ability | Body, system | Sharingan; Bookmark; download panel | Power registry, slots | Copy slots, target access | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC52 | Alternate physiology | Different needs: batteries, oil, no hunger | Body | Kenshi skeletons; Oxygen Not Included bionics | Body needs, care | Supply of its fuel | not built | [CBW](CHEATS_BY_WORLD.md#game-cheats-2026-10-10-codex) |
| CTC53 | Installed module | A skill or organ socketed into a body | Item, body | Skill boosters; prosthetics; Beyond the Timescape crystal | Power registry, items | Slots, custody of the part | not built | [CBW](CHEATS_BY_WORLD.md#game-cheats-2026-10-10-codex) |
| CTC54 | Sealed blessing | A locked gift you grow into or guard | Patron, body | Virtuous Demon sealed swordsmanship | Gates, knowledge | Seal strength, true grade hidden | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC55 | Rotating powers | Hold a few powers and swap them | Body | Eidolon in Worm | Power registry | Weakest right after a swap | not built | [CBW](CHEATS_BY_WORLD.md#worm) |
| CTC56 | Body from a vial or gene | Buy or take a power that rewrites the body | Institution, body | Worm Cauldron vials; Genetic Ascension | Body, economy | Odds, rare catalyst | not built | [CBW](CHEATS_BY_WORLD.md#worm) |
| CTC92 | Agelessness or a different clock for the body | The body stops aging, slows, or shows age differently (young body, spent lifespan; the soul ages instead) | Body, soul | Cultivation longevity, elven blood, "not aging could be a thing that the base cheats comes with" (Weibao, 2026-11-10) | Body clock (TMR3, TMR15), BHR | Per card | not built | [TIME_RULES](TIME_RULES.md) |
| CTC93 | Lifespan readout | The cheat shows lifespan: years left, what shortens or extends them, and the cost of a year-spending act before it is paid | Knowledge, body | Status panels that list lifespan; "make base cheat in charge of showing lifespan" (Weibao, 2026-11-10) | Body clock (TMR15), knownness (KNW1, KNW12) | Per card | not built | [TIME_RULES](TIME_RULES.md) |

## F. Companions and voices

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC57 | Ring spirit | A resident advisor in an item that teaches and talks | Soul, item | Ring-grandpa novels; Yan Ji in Fated Villain | Voice, ties, power registry | Reliability dial, item custody | built: `ring-spirit` card | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC58 | System as voice | An interface that talks and steers | System | Hologram AI; parasite systems | Voice, status window | Autonomy and steer dials | partly: system voice | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC59 | Summon and army | Recruit the dead or summoned and command them | Soul, system | Solo Leveling shadows; Battle Brothers; Cult of the Lamb | Followers, roster | Slots, upkeep | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC60 | Heroic spirit summoning | Call a world's dead heroes and bond them | Concept, soul | Kairos ship of the dead; Fate-style | Roster, ties | Spirit slots | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC61 | Follower power | Followers' growth feeds you | System | Disciple-return systems; god-sealing palace | Ties, standing | Care and loyalty | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC62 | Tamed or bonded creature | A creature companion that grows with you | Soul, item | Egg and beast-contract tropes (new, agent addition) | Ties, care | Bond, feeding | not built | new, agent addition |
| CTC63 | Instant teaching | Teach others perfectly | Knowledge, system | Disciple-return systems | Ties, education | Students | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |

## G. Luck and fate

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC64 | Roll override | Commit a low next roll | Concept | Loaded Dice; Disco Elysium debug path | Seeded streams | Charges, call stays until used | built: `loaded-dice` | [LIB](CHEAT_LIBRARY.md#10-loaded-dice-roll-override) |
| CTC65 | Fortune plunder and shield | Steal luck, shield from backlash | Concept, world law | Fated Villain; Reverend Insanity luck theft | Seeded streams, standing | Fortune points | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC66 | Outcome selection | Try branches and keep the best | Body, concept | Coil in Worm | Seeded streams, fork contract | Branches per day | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC67 | Incident director | A steward chooses which events happen | Concept, patron | RimWorld storytellers | Event director | Weighted by eligibility | not built | [LIB](CHEAT_LIBRARY.md#9-fate-steward-incident-director) |
| CTC68 | Protected fortune | Shielded from system or world backlash | Concept, patron | Fated Villain | Standing, world law | Can be drained by others | not built | [CBW](CHEATS_BY_WORLD.md#fated-villain) |
| CTC69 | Wish or edit | Spend a quota to change a fact | System, concept | Wish Upon the Stars | World rules, quotas | Daily quota, payment | not built | [LIB](CHEAT_LIBRARY.md#gameplay-by-cheat-family) |
| CTC70 | Karma bank | Deeds as currency; bank, spend, cleanse | Concept | Karma systems | Standing, deed ledger | Per world | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC71 | Debt to the future | Borrow from your future self and repay | Concept | Original; Gluttony | Time bank, economy | Interest | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |

## H. Space and storage

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC72 | Inventory space | Storage outside the world | Item, system | Pocket-space novels; Soldier's Life imprint | Carry weight, items | Capacity, living things | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC73 | Pocket world | Own and grow a small world | Item, world law | Fated Villain inner universe; Primordial loaned realm | Time bank, home | World size | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC74 | Portals and relay sight | Open portals; see across worlds | Body | Doormaker in Worm | Map, entry | Reserve, overdraw closes portals | not built | [CBW](CHEATS_BY_WORLD.md#worm) |
| CTC75 | Unerring direction | A knack for direction or balance far past the ordinary (default: by its card's reach) | Body, concept | "Never gets lost" tropes | Map, travel | Edges found by testing | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC76 | Safe haven | A place the world's threats cannot reach by default | World law, item | Sanctuary and grace sites; Elden Ring grace | Sites, danger | Terms per site | not built | new, agent addition |

## I. Social

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC77 | Language and speech | Talk to anyone or anything | Body, system | Beast and object speech | Talk view, ties | Languages known | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC78 | Charisma or aura | People are drawn to you | Body, concept | Ruler and saint tropes | Ties, standing | Followers, devotion | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC79 | Notice-me-not | Nobody pays attention to you | Concept, body | Absolute stealth tropes | Standing, observers | Attention kept low | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC80 | Contract and bargain | Make binding deals and enforce them | Concept, world law | Paradise contracts; devil pacts | Bindings (AD14), ties | Contracts, leverage | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC81 | Points from emotion | Earn points when people are shocked, angry or humiliated | System | Reaction-point novels | Standing, ties | Reputation fallout | not built | [COS](CHEAT_COSMOLOGY.md#simple-cheats) |
| CTC82 | Patron gift | A power lent or given by a being, with its own terms | Patron | Wang Lin's ring; Master of Steel sponsorship; World Will loan | Power registry terms (gift, lease, loan, lien, leash) | Terms per card | not built | [COS](CHEAT_COSMOLOGY.md#patron-gifts-what-can-and-cant-be-taken-back) |
| CTC83 | Parasite system | Generous rewards that steer you; win back freedom | System | Virtuous Demon Oracle of Yonder | Voice, steer and autonomy | Steer dial | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |

## J. World-crossing and meta

| ID | Type | What it does | Backing | Typical worlds and sources | Engine hooks | Usual limits (optional) | Status | Source |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| CTC84 | Hub contract | A standing arrangement with a hub that sends you between worlds | Patron, institution | Reincarnation Paradise; Hub-world novels | Entry (WER), economy | Reach and terms | not built | [LIB](CHEAT_LIBRARY.md#routes-aq) |
| CTC85 | Account unlock | A profile-level unlock that opens later options | Player layer | Tales of Maj'Eyal; Bitburner Source-Files | Carry ledger, start screen | Labeled player-layer | partly: optional starts | [CBW](CHEATS_BY_WORLD.md#game-cheats-2026-10-10-codex) |
| CTC86 | Selectable legacy | Choose a successor and what carries | Player layer, lineage | Sunless Sea; Rogue Legacy; Cultist Simulator | Carry ledger | Per-ledger carry | partly: heir code, dormant | [CBW](CHEATS_BY_WORLD.md#game-cheats-2026-10-10-codex) |
| CTC87 | Rule-editing cheat | Change what counts, how thresholds read or what a deed means | System, concept | Criterion-editing cheats | Gates, rule modules | Declared scope | not built | [LIB titles](CHEAT_LIBRARY.md#titles-achievements-and-rule-editing-cheats-2026-10-15) |
| CTC88 | Character switching | Hold several selves and switch | System | Theory of Magic Hall | Roster, saves | Per-self state | not built | [LIB](CHEAT_LIBRARY.md#11-hall-of-selves-character-switching) |
| CTC89 | Debug or authoring grant | A labeled test start for fixtures and creative play | Player layer | AQ14 | Start grants | Labeled, not natural | partly: `applyStartGrants` | [LIB](CHEAT_LIBRARY.md#routes-aq) |
| CTC90 | Dream walking | Act inside dreams, plant or steal | Soul | Shadow Slave Dream Realm | Entry, time bank | Dream time | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |
| CTC91 | Heroic or inheritance trial | A legacy from ancestors or strangers, claimed by a test | World law, knowledge | Reverend Insanity inheritances | Gates, sites | Per-trial terms | not built | [LIB](CHEAT_LIBRARY.md#more-cheat-types-2026-10-10) |

## How to draw from it

1. Pick a type by what the world and start need, not by rarity. The row's backing (CHT5) says where it goes when the player crosses worlds.
2. Write one card per CHT4: id, family, terms (gift, matured, lease, loan and so on), backing, kind for the skin (CHT6), hooks, and a state block. Put limits on the card as adjectives when the card wants them (CHT12). Declare the base cheat per start (CHT3) before any other cheat.
3. Pick the route (CHT8, AQ1-AQ14) and rarity dials: how common, who knows, how one learns it is real.
4. Choose the cheapest seam first. In order: a per-start grant through `applyStartGrants` (one `grants` entry per start); then a power-registry effect like `cheat.rehearsed_foe`; then a knowledge or time-bank facet like the existing eight modules. Growth tier effects wait on the persistence decision (IM40).
5. Add the entry line for the cheat's reach (CHT16). Cheats that talk state their reliability (CHT20).
6. Cheats that read or foresee show uncertainty by their grade and follow sealed-secret discovery routes (CHT19). Record the one-line result in the owning doc and add the row's Status here.

Candidate first picks (default order, dial: per wave), ranked by cheapness (agent proposal, no slice authorized): CTC6 daily intelligence (knowledge and rumor seams exist), CTC24 sign-in (calendar and map), CTC5 future knowledge as a card over the existing knowledge carry, CTC82 patron gift (terms already exist), CTC23 effort pays off (a pacing dial).

## More to consider

Codes continue this page. Searched the docs first: cheat meetings and winner rules already live in [cosmology](CHEAT_COSMOLOGY.md#when-cheats-meet-2026-10-10-codex), enemy cheats in the [library](CHEAT_LIBRARY.md#enemies-with-cheats-2026-10-10) and CHT18, so those are not repeated. The items below are gaps in those owners.

### ACCOUNT FOR NOW

- **CM1. No forced weakness across the catalogue.** Sweep the library, cosmology and by-world docs for "lever", "what limits it" and "cost" columns that read as mandatory. Effort: one grep and a reword pass. Done check: those columns are labeled optional, matching this page, and the log line of 2026-11-10 is linked from each.
- **CM2. Cheat-on-cheat stacking.** The meeting rules cover two holders; a single holder with several cheats (a system plus a ring plus a physique) has no stacking or order rule. Default: effects resolve through the power registry in a stated order. Effort: one paragraph in CHEAT_RULES. Done check: a worked example with three cards.
- **CM3. Sealed truth of a cheat.** A card's true origin or hidden grade (CTC27, CTC54) is a sealed secret; by default the panel shows what was found (CHT10). Effort: one line in the sealed-secret doc naming card fields as sealable. Done check: a test that a hidden grade is absent from the panel until its discovery route fires.
- **CM4. Cheats in non-lore runs.** Book-world starts that randomize the canon need a rule for whether a changed canon cheat still exists. Default: the card travels with the start declaration (CHT3); a world dial decides whether it is randomized. Effort: one rule row. Done check: a lore and a non-lore start listing the same cheat.
- **CM5. Cheat provenance record.** Each held card keeps how it was gained (route, day, who gave it) so a patron recall, a theft or a wrong-recipient delivery (AQ13) has a record. Effort: small, one field on the card. Done check: save, reload and import keep it.

### LATER

- **CM6. NPC cheat holders as data.** CHT18 allows them; no registry lists which canon people hold which type. Effort: medium, a table keyed by CTC ID. Done check: a lookup from NPC to card with terms.
- **CM7. Cheat inspector.** A debug and player view (default: read-only) listing held cards, backing, terms, reach, what stops working in the next world (feeds CHT16). Effort: medium, read-only panel over `cheat_cards`. Done check: renders for the base faculty and the ring spirit at 1920x1080.
- **CM8. Cheat difficulty and discovery modes.** A dial from "all cheats named up front" to "learn by use", plus a lore-free naming pass so the card text keeps PRS rules. Effort: small. Done check: one start per end of the dial.
- **CM9. Cheat budget per run for the player.** An optional readout of how many cheats a start holds and how many routes still open, for players who want to see the shape. Effort: small. Done check: panel line derived from state, nothing persisted.
- **CM10. Catalogue to cards pipeline.** A script that lists types with no card and their cheapest seam, so waves pick from this page. Effort: small, a script (default: read-only). Done check: output matches the Status column.
