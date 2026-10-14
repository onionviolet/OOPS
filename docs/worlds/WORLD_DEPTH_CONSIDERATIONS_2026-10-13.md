# World depth considerations (proposal, 2026-10-13)

Weibao's requests, in order: "deeper considerations for each world?", then
subtle stuff, a workflow to iterate worlds, parallel worlds and different
starting points, then required features and engine improvements, then a
canon-first priority with easy AU work, then relationship and start-point AUs,
then "how to consider implementing full world and fleshing out every little
detail and more? locations, people, interactions, ability and more?" Full quotes
and the recorded priority live in
[User vision](../USER_VISION.md#world-depth-and-canon-first-world-priority-2026-10-13).

Everything below and in the linked parts is a palette of proposals, not specs
and not accepted decisions. Pick what fits a world and moment. Sealed secrets
appear only by ID, route and status. Franchise facts from memory are labeled
"(general knowledge)" and need a source check before a pack relies on them.
Nothing here was built or run; every acceptance case is specified-not-run.

## Parts

| Part | Covers | Codes | Rows |
|---|---|---|---|
| [01 Home and hubs](world-depth-2026-10-13/01_HOME_AND_HUBS.md) | Original frontier, Proving ground, Reincarnation Paradise, Proto23 | OF, PG, RP, P23 | 113 |
| [02 Academy and magic](world-depth-2026-10-13/02_MOL_HP_JJK_DND.md) | Mother of Learning, Harry Potter, Jujutsu Kaisen, D&D | MOL, HP, JJK, DDC | 122 |
| [03 Bleach, Naruto, Elden Ring](world-depth-2026-10-13/03_BLEACH_NARUTO_ELDEN_RING.md) | Three franchise worlds | BL, NA, ER | 94 |
| [04 Fallout, Skyrim, book worlds](world-depth-2026-10-13/04_FALLOUT_SKYRIM_SL_TTKS.md) | Fallout, Skyrim, A Soldier's Life, TTKS | FO, SK, SL, TT | 125 |
| [05 Researched worlds](world-depth-2026-10-13/05_RESEARCHED_WORLDS.md) | 26 researched and candidate worlds, plus integration, loop, host and cultivation cluster defaults | CLI, CLL, CLH, CLC, per-world | about 340 |
| [06 Cross-world](world-depth-2026-10-13/06_CROSS_WORLD.md) | World iteration workflow and depth ledger, parallel worlds, starting points, subtle joins | WI, PW, ST, SU, MC, SG | 73 |
| [07 Required features and engine](world-depth-2026-10-13/07_REQUIRED_FEATURES_AND_ENGINE.md) | Feature families with code seams, engine improvements, build order, risks | RF, EI, BO, R | 53 |
| [08 Priority canon and AU](world-depth-2026-10-13/08_PRIORITY_CANON_AND_AU.md) | HP, D&D, A Soldier's Life, TTKS, MoL canon spines and easy AUs; AU kit | PHP, PDD, PSL, PTT, PML, AK | 67 + 48 cases |
| [09 More book worlds canon and AU](world-depth-2026-10-13/09_MORE_BOOK_WORLDS_CANON_AND_AU.md) | LOTM, Circle of Inevitability, Shadow Slave, Reverend Insanity, Worm, Legendary Mechanic, Omniscient Reader, A Novel Concept, Regressor's Tale; source coverage ranking | QLM, QCI, QSS, QRI, QWM, QLG, QOR, QNC, QRT, QK | 70 + 83 cases |
| [10 Full-world method](world-depth-2026-10-13/10_FULL_WORLD_METHOD.md) | Production method for a whole detailed world: census, depth tiers, card families, data over code, agents at scale, World1 lessons, D&D Phandalin worked example | FW, DT, LC, PE, IX, AB, IT, EV, IN, DC, SA, LW, MC2 | 106 |
| [11 Access and starts](world-depth-2026-10-13/11_ACCESS_AND_STARTS.md) | How the player reaches worlds, starts, AUs and copies; gating and a sandbox path; desktop start picker; new start kinds; mid-run access | X, AC, UG, SM, DS, MR, OS, KA | 96 |
| [12 Priority world starts](world-depth-2026-10-13/12_PRIORITY_WORLD_STARTS.md) | 80 new starts and a starter trio for each of HP, D&D, A Soldier's Life, TTKS, MoL, LOTM, Circle of Inevitability, Shadow Slave; cross-world start patterns | SHP, SDD, SSL, STT, SML, SLM, SCI, SSS, SX | 93 |
| [13 Earned options and cheats](world-depth-2026-10-13/13_EARNED_OPTIONS_AND_CHEATS.md) | Options earned by play, 21 cheat acquisition paths, each priority world's native path, progress feel | EO, CA, EW, PF | 88 |
| [14 Research, skills, scales](world-depth-2026-10-13/14_RESEARCH_SKILLS_SCALES.md) | In-game research, subtle skills, micro, meso and macro scales with worked chains, joins | RS, SB, SC, JN | 111 |
| [15 Jokes as hints](world-depth-2026-10-13/15_JOKES_AS_HINTS.md) | Throwaway jokes and gags that prove to be real pointers; hint grammar, sealed safety, per-world examples | HF, HG, SS, PW2, SY, EP, OA | 113 |
| [16 Expanded possibilities](world-depth-2026-10-13/16_EXPANDED_POSSIBILITIES.md) | Eleven possibility families, each in about 11 forms with look-alike pairs, plus shards | PX, SXF, AUX, RLX, EOX, CAX, RSX, SBX, SCX, DTX, WIX | 119 forms |
| [17 Carryover and retrofit](world-depth-2026-10-13/17_CARRYOVER_AND_RETROFIT.md) | Five save layers for carries, 32 carryover forms, per-world carry profiles, 18 retrofits of systems that fight the future direction, seven "needs Weibao" questions (NW1 to NW7) | CL, CLW, RT, NW | 65 |
| [18 Proto23 absorb](world-depth-2026-10-13/18_PROTO23_ABSORB.md) | Proto23 mechanics not yet in the 95-row absorption ledger, small feel touches, and what not to copy | PA, PT, PN | 59 |
| [19 Dialogue actions](world-depth-2026-10-13/19_DIALOGUE_ACTIONS.md) | 25 talk verbs with needs, effects, witnesses and memory; impact chains; desktop conversation form; per-world talk | X, DA, IC, CF, DW, SG | 111 |
| [20 Friends and relationships](world-depth-2026-10-13/20_FRIENDS_AND_RELATIONSHIPS.md) | Relationship dimensions and kinds, making friends, what bonds do, bonds across worlds and lives, per-world bonds, people UI | X, RM, MF, RD, RX, RW, UF | 120 |
| [22 Features as cheats](world-depth-2026-10-13/22_FEATURES_AS_CHEATS.md) | 39 game features with a recommended home (base, unlocked by play, in-world cheat, sandbox, always on), framings, lines that stay ungated, per-world tools, dials; parts 8-10 (2026-10-14) cover quest generators, action- and goal-driven quests, you as issuer, rival questers, shapes, failure, idle timing, per-world sources, too many offers, open world, endgame ladders, cross-world quests; part 11 book world endings (ending types, you at the climax, canon frontier, aftermath); part 12 long worlds, death mid-world, branch worlds, shelving runs, prestige; part 13 next life later, now or earlier in the same world, afterlife routes, paradox models, what the next life finds; part 14 randomization in quests, runs, deaths, worlds and branches; part 15 between lives, self across lives, meta shape, cross-world balance, surfaces, onboarding, testing; part 16 story across runs, story recognition, final ends, player authorship, sessions; part 17 parties, downtime, money of work, paperwork of death; part 18 endgame paths in depth (ruling, war, faith, mastery, founding, exploring); part 11 world table verified by R1; part 19 villain, monster and outsider play; part 20 overlap notice and reading guide; part 21 merged lane findings R2-R5 with inline corrections, override rules, build order, open choices and R7 numbers; part 22 micro details for boards, death, next lives, endings and the between; part 23 implementation implications; part 24 R6 paper playthrough gaps; part 25 comic world laws mapped to runs and endings; part 26 endgame refinements from R8; part 27 R9 corrections, R11 measurements, R10 micro | X, FI, FR, LN, FW2, DP, DL, T, QC, QL, QS, QT, QG, QX, QP, QO, QF, QR, QI, QV, QW, QA, QK, QN, QM, QE, QH, QZ, QB, RL, RB, RS, RP, RX, NT, NE, NP, NF, ND, RZ, MB, MS, MM, MW, MU, MO, MC, MT, XA, XS, XF, XP, XN, PP, PD, PM, PW, EG, OS, OV, LR, OC, RG, RT, RN, MD, IP, IS, IL, IA, IT, IX, PG, CR, EG2, CC, CM | 878 |
| [21 Renown and subtle](world-depth-2026-10-13/21_RENOWN_AND_SUBTLE.md) | Renown versus reputation, regard, rank and titles; how fame spreads, fades, is faked or split across identities; what it does; per-world renown; 22 small social details | X, RN, RE, RC, RW2, OS2, SU | 111 |
| [23 Deeper synthesis](world-depth-2026-10-13/23_DEEPER_SYNTHESIS.md) | 15 shared engine primitives, 17 tensions written as dials, 40 trajectories across 8 big directions, cross-part ideas, 29 duplicates and contradictions, and one connected first arc | UP, TN, WG, DA2, DC2, AR | 132 |
| [24 Titles](world-depth-2026-10-13/24_TITLES.md) | 17 kinds of title (achievement, power, office, epithet, brand, true name and more), how meaning depends on world, observer, place and time, title mechanics, per-world titles | X, TK, TD, TM, TW, SU | 93 |
| [28 Foundational functions](world-depth-2026-10-13/28_FOUNDATIONAL_FUNCTIONS.md) | Life functions (talk, marry, own, sign, travel, worship) split into five layers (simulation, verb, view, reach, rule) so default against earned against cheat is answered per layer; where defaults come from; functions you lose; social foundations; a placement test | LS, DS, NS, LF, SF, RC, PT, A | 65 |
| [29 Relationship prerequisites](world-depth-2026-10-13/29_RELATIONSHIP_PREREQUISITES.md) | The plumbing relationship play assumes (one store, identity, presence, clock, temperament, writers, readers, ties, carriers, view, save decision), what exists today, other life functions that share it, cheapest slices | RQ, SH, A, CQ, DV, BK | 174 |
| [30 Life stages and custom](world-depth-2026-10-13/30_LIFE_STAGES_AND_CUSTOM.md) | Body age and local life stages, era and household customs, world-specific ladders with source limits, succession and time joins, fixed 18+ romance floor, discovery, added prerequisites and five ranked slices | LSC, LSL, LSE, LSW, LSX, LSD, LSP, LSA | 106 |
| [31 Inner life, household, community](world-depth-2026-10-13/31_INNER_LIFE_HOUSEHOLD_COMMUNITY.md) | Spirits, loneliness, stress, hobbies, ambitions, trauma; home, housemates, chores, budget, caregiving; gossip, news, neighborhood standing, mutual aid, belonging | IL | 30 |
| [32 Social spine](world-depth-2026-10-13/32_SOCIAL_SPINE.md) | Navigable data/clock/writer/reader/view/content map, proposed canonical overlap clusters, contradictions with both sides, code-backed dependency graph, Village-first build order with save and desktop evidence, remaining contract gaps | SSP, SSC, SSX, SSV, SSB, SSG | 66 |
| [33 Institutions and communities](world-depth-2026-10-13/33_INSTITUTIONS_AND_COMMUNITIES.md) | Guilds, schools, sects, churches, courts, armies, banks, houses, secret societies; membership, ranks, dues, privileges, internal politics, revocation, founding; communities and belonging; per-world lore, entry routes and aftermath; joins and five save-aware slices | ICD, IKP, IOP, ICP, IWG, IXT, IDV, IPR, ISL, ICF | 132 |
| [34 Values, conscience and leisure](world-depth-2026-10-13/34_VALUES_CONSCIENCE_AND_LEISURE.md) | Values held by people not a karma bar, cosmic morality only where lore has it, regret and atonement, villain play allowed; free time, in-world games, gambling, arts, collections, vices, contests | VL | 26 |
| [35 Health, injury, illness and death](world-depth-2026-10-13/35_HEALTH_INJURY_ILLNESS_DEATH.md) | Current HP, conditions, injury, medicine, mortality and heirs with code evidence; health and care palette; priority-world lore/unknowns; death warnings and aftermath; safe idle recovery; desktop discovery; prerequisites and five cheapest slices with save impact | H35C, H35M, H35T, H35D, H35W, H35I, H35U, H35P, H35S | 87 |
| [36 Micro moments and small signals](world-depth-2026-10-13/36_MICRO_MOMENTS_AND_SMALL_SIGNALS.md) | One-line signals across people, body and things, world texture, interface and micro stories; one signal registry; true-only, cooldowns as adjectives, no hidden-layer leaks | MC | 48 |
| [37 Micro texture by world](world-depth-2026-10-13/37_MICRO_TEXTURE_BY_WORLD.md) | Code and save feasibility for MC1-MC48; 121 lore and original daily-life texture rows across 12 world groups; 13 rule-specific signals; five cheap Village slices; source and copyright limits | MTX | 150 |
| [38 Patterns, habits and quiet systems](world-depth-2026-10-13/38_PATTERNS_HABITS_AND_QUIET_SYSTEMS.md) | The world noticing your patterns, habits that form and carry over, tiny progress and know-how notes, systems that run without a panel | HB | 32 |
| [39 Overarching principles](world-depth-2026-10-13/39_OVERARCHING_PRINCIPLES.md) | Twelve recurring principles with a quick test each, four fixed lines, cross-part joins to keep as one state, subtle risks of breadth, noise, save growth and leaks | OA | 30 |
| [40 Implementation considerations](world-depth-2026-10-13/40_IMPLEMENTATION_CONSIDERATIONS.md) | Code seams, per-store save/compaction policies, OA17-OA24 architecture joins, authoring/lint, acceptance, proposed scale budgets and SSB1-SSB3 packet | IMC, IMS, IMJ, IMA, IMV, IMB, IMR, IMX, IMD | 70 |
| [41 Weaponcraft, runes and reveal cheats](world-depth-2026-10-13/41_WEAPONCRAFT_RUNES_AND_REVEAL_CHEATS.md) | Weapons as parts with fit, bonds, wear, commissions, law; runes as rules on carriers with grammar, fuel, capacity, bodies and places; 14 reveal cheats; the shared item, attachment, reveal and condition abstraction | WR, RU, RV, AX | 62 |
| [43 Reveal cheats for life systems](world-depth-2026-10-13/43_REVEAL_CHEATS_FOR_LIFE_SYSTEMS.md) | Insight cheats for ties, lies, memories, wants, identities, body and mind, habits, conscience, age, rumors, standing, institutions and customs, on one reveal-route schema; native skill versus cheat | LR | 22 |
| [Reincarnation Paradise priority (2026-10-14)](../gm/dispatch/paradise-priority-2026-10-14/COMMON.md) | Paradise joined the canon-first tier; lanes write a canon plan, beings/pets/bodies, derived worlds and missions, hub life/economy/people under `paradise-hub/` | SRP, ARP, PB, DM, HL | lanes running |
| [Nonhuman starts (2026-10-14)](NONHUMAN_STARTS_ENGINE_REQUIREMENTS_2026-10-14.md) | Engine requirements, spec, play per body kind, canon nonhumans, monster mechanics, transformation, senses/UI, society, bonds, progression, monster side | F, B, E, K, M, N | lanes running |
| [World core kit (2026-10-14)](WORLD_CORE_KIT_2026-10-14.md) | What every world needs to play in depth: 18 kit parts with floor and deep forms, a more-to-consider round per part, cross-cutting KX rows; Codex lanes W1-W6 for readiness, laws/power/combat, people/life, places/craft/loop/look, knowledge/canon/crossing/endings, engine and template | K, KX | lanes running |
| [Agent brief](world-depth-2026-10-13/00_AGENT_BRIEF.md) | The shared brief the eight research lanes followed | | |

Each world section in parts 01 to 05 ends with a "Smallest playable taste" and
has Starting points, Parallel versions and Subtle details subsections. D&D rows
in part 02 use `DDC` to stay distinct from the coverage map's `DND00` to `DND15`.

## What the pass found

- **World content is mostly code today.** `src/` has 59 `*_host.js` and 62
  `*_content.js` files, and the MoL cast is a hard-coded array. Part 10 proposes
  short authored cards per family (location, person, interaction, ability,
  item) compiled to structured pack rows, with depth tiers T0 to T5 so every
  detail exists at some tier without costing full proof.
- **World1 stalled on production, not on the standard.** Pack p08 spends most
  of its bytes on repeated preconditions; the ledger reached 3,803 rows against
  2 delivered units. Lints and computed coverage replace the hand ledger;
  browser proof runs per slice and per new verb template (part 10, LW rows).
- **AUs are cheap as overlays.** Base pack plus a divergence patch compiled to a
  new pack ID keeps existing saves' shape (part 07 EI1, EI2). Relationship flips
  reuse existing regard and witnessed memory; start shifts reuse existing
  content (AK2, AK3, QK rows).
- **Engine limits that true parallel copies hit:** world clocks assert frozen
  absence (`src/world_instances.js:108-111`), one active visit at a time
  (`src/expansion_engine.js:142-143`), and unknown reputation regions throw
  (`src/reputation_state.js:6-16`). These need one migration slice (part 07 BO10).
- **The heir path is built but unwired** (`buildLifeHeirSave` is never called;
  source-reading inference, not browser-checked).

## Recommended first arc (part 23)

"A Village life that hands something on": AR1 "who told me" lines (B1); AR2
people card in words, promise list and one trust-gated lesson (B12, B13); AR3
watch log that grows with practice (B2); AR4 three Village joke-hints (B4);
AR5 the Cyoria door with a per-world palette and a joke that clicks on arrival,
verified alongside PML1 (A1, B8); AR6 heir leftovers polish with R15 G5 (named
heir, graves list, "Lost" rows); AR7 inherited papers as notebook records and
the parent's Village nickname. Steps AR1 to AR3 and AR5 change no save shape;
AR4, AR6 and AR7 need save, reload and import checks. It exercises nine of the
fifteen primitives. Next after it: A2, Taiven as rival with a scheduled turn.

## Proposed build order

Canon-first priority applied; smallest playable first. Each item needs its own
rebuilt fresh-origin desktop check at 1366x768, 1440x900 and 1920x1080, plus
save, reload and import where persistence changes.

| Code | Slice | Why first | Gate |
|---|---|---|---|
| A1 | PML1: play through the built MoL Cyoria arc natively | Verification only; turns built-unverified into evidence | None beyond browser time |
| A2 | PML6: Taiven as rival retriever AU | Regard flip on an encounter that already runs; first relationship AU | MoL files only |
| A3 | Card compiler and lints (part 10 suggestions 1 and 2) | Makes every later world cheaper | Dev-only tooling |
| A4 | D&D Phandalin ST2 bag repair from cards, then ST3 shrine helper | First D&D native slice on open SRD rules | Needs A3 and one repair consumer |
| A5 | PHP1: HP summer 1991 supply week, then the cousin or ward AU | First native HP instance on existing jobs and starts | Source ledger is thin on canon voice |
| A6 | QLM1: LOTM lodger at the Morettis on the Tingen cover job | Best-covered next book world | New pack |

Cheap side builds found in parts 11 to 16, ordered by save impact:

| Code | Slice | Save impact |
|---|---|---|
| B1 | "Who told me" line and certainty word on knowledge notes and people cards (part 14; same as part 19 SG1) | None |
| B2 | Watch log wording that grows with practice, plus a recruit remark; weekly Village career summary (part 14) | None |
| B3 | Sandbox toggle for testing everything without spoiling (KA2) | Header flag |
| B4 | Hint cards with three Village joke-hints and two honest red herrings (OA1) | None |
| B5 | Choose a typed start instead of rolling, with "Surprise me" (KA3) | One receipt field |
| B6 | Wire the existing heir path and replace the "one lesson" text (KA1, part 17 RT1, RT3, RT4). Hand to the live foundation group that owns heir work (R15 G5, FA17), not a second writer | New save from old, needs save, reload and import check |
| B8 | Per-world palette ID read from each world definition, warm and cool kept as fallback (part 17 RT8) | None; UI lanes have released the files |
| B10 | Proto23 dojo strength gauge plus three titles (part 18 PA11) | None |
| B11 | Indoor place-name pipes and a fused time and weather label in the place header (part 18 PT1, PT2) | None |
| B12 | One optional lesson gated on trust through the unused `relationship.<axis>` fact; plain words ("warm", "owes you") instead of numbers; "you" and "they" labels on memories (part 20) | None |
| B13 | Read-only promise ledger; Village births, marriages and deaths as comfort or congratulate topics (part 19 SG2, SG3) | None |
| B14 | Feature home table as data read by the existing `discovered()` panel hooks; per-world label skins such as "Appraise" or "Pensieve" (part 22 T1, T4) | None |
| B15 | Assist settings group: hint density, spoiler guard, log detail beside font and color settings (part 22 T2) | New local storage key only |
| B16 | Reputation shown as words (unknown, heard of, known, liked, famous) including zero and negatives; a "known by" line on titles (part 21 SU1, SU2) | None; `display.js` has another writer's edits |
| B17 | Title ladder shows the top rung; optional reader lines per audience; a hidden flag so secret titles show no goal (part 24 SU1 to SU3) | None |
| B9 | Read-only life-end manifest: what this life would leave and through which carrier, carrying nothing yet (part 17 CL1) | None |
| B7 | More "how you got it" origins on sources, and dormant cheats shown as silhouettes (part 13) | Older builds reject new origin values |

Held: A Soldier's Life slices PSL5 (colleague is family) and PSL1 (morning
muster) are the cheapest builds overall, but that world is paused since
2026-10-12 and needs Weibao's explicit resume. Per-world presentation (BO1, V6
tints, B8) is now unblocked: those UI lanes released the workspace files.

## Stale findings to recheck

Foundation R15 G5 landed heir leftovers (`643b7f1b`, "Heir inherits what the
ended life left behind") during this pass. Heir findings written earlier in
parts 07, 11, 13 and 17 (heir drops nearly everything, "one lesson" text, unwired
button) may now be partly out of date; part 21 already sees half of each
reputation region carried (`src/heir_inheritance.js:51-55`). Reread the current
heir code before acting on B6, KA1 or RT1 to RT4.

## Open conflicts with live work

Checked again late on 2026-10-13 (part 18): the Vivid, UI density, Proto23 VFX
and 2026-10-11 absorption lanes have released their files. Foundation R15 holds
`main.js`, saves, tests and `dist/`, and its G5 group owns heir work, so slices
that touch those go through its integration window. A Soldier's Life stays
paused. Check live ownership again before any runtime write (part 07 R rows).
