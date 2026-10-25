# YAIR gap check for the itch.io batches (2026-10-22)

Read-only verification of every YAIR-side claim in `ITCH_IO_IDLE_SCREEN_2026-10-22.md` and the `BATCH_*.md` files. No `src` edits, no commits.

## Method

- Claims were pulled by grepping the screen report and all batches for "src", "grep", "not found", "no match", "already has" and "YAIR mapping" lines, then deduplicated (many batches repeat the same gap).
- Each claim was searched in `src/` by content with `rg` and `grep -E`, case-insensitive, using the claim's own terms plus synonyms. Hits in named owner files were read in place. `tests/` was checked only for wiring (for example `away_ledger`).
- Substring hits (for example `chronic` matching `chronicle`, `hospital` matching `hospitality`) were read and discarded when unrelated.
- Verdicts: CONFIRMED GAP (nothing implements it), PARTIAL (something related exists), EXISTS (implemented), UNCLEAR (not decidable from a content search). "WRONG" in the Note column marks a claim the batch got wrong; the Verdict still follows the scale.
- Direction was checked against `docs/RULES_INDEX.md` AD1-AD41. Searches are keyword-based, so CONFIRMED GAP means "no hit after reasonable synonyms", not a proof of absence.

## Table

| Code | Claim (paraphrased) | Source batch | Verdict | Evidence | Note |
|---|---|---|---|---|---|
| G01 | No age-driven chronic conditions with treat/manage/ignore and a falling health ceiling | BROAD:71,146 | CONFIRMED GAP | `chronic[^l]`, dementia, arthritis, aging: 0 hits in src | Lifespan and old-age ending exist (`src/chronicle.js:15-17`, `src/simulation.js:498,546`) but are not conditions. |
| G02 | No isolation or contact-decay state | BROAD:71 | CONFIRMED GAP | isolat/lonel: only unrelated "isolated scenario" in `src/expansion_engine.js:721` | |
| G03 | `npc_lives.js` is the base for a relationship status machine with restore | BROAD:87,149 | PARTIAL | `src/npc_lives.js:10,13,18` (static `spouseId`, scripted marriages) | No status states, no restore. The file is 53 lines. |
| G04 | `home_staff.js` "already has an owed-wage notion (line 42)" | BROAD:87 | PARTIAL | `src/home_staff.js:38,40` (orders are prefunded; cancel returns unearned wages); line 42 is `supply_staff` | WRONG: no owed wage exists, orders are finite and funded. No quitting logic either. |
| G05 | Family is not staff (spouse grace vs worker quits quickly) | BROAD:149 | CONFIRMED GAP | `home_staff.js` has cook, keeper, builder orders only; no quit/resign path | |
| G06 | One fact written into several NPC memories at once | BROAD:95 | PARTIAL | `src/relationship_view.js:38-41,79-80` (capped memories per source), `src/absorb_p23/host_joins/tranche_four.js:87` | Per-person memories exist; broadcast does not. |
| G07 | Sale odds with per-faction reputation and a visible breakdown | BROAD:119,148 | PARTIAL | `src/models/hero.js:58` (regional reputation), `src/simulation_effects.js:337`, `src/town_content.js:41`; `src/trade.js` has no reputation term | Stat breakdowns exist only for character stats (`src/display.js:4258`). |
| G08 | Flat-gauge trap list to run against body, reputation, household | BROAD:145 | UNCLEAR | Test checklist, not a code claim | Needs a headless run (screen IM31). |
| G09 | Purchasable away cap / banked away time not verified (YAIR has only a prepaid packing slice) | LIFE_A:67,129 | PARTIAL | `src/away_ledger.js:6-49` (`capMinutes`, `overflow:'bank'`, `bankedMinutes`, diminishing returns); only `tests/away_ledger.test.js` references it; `src/backlog_expansion_time.js` | WRONG on direction: AD18 already accepts banked unused time with improvable capacity. The ledger is not wired into runtime. |
| G10 | Completion count unlocks a standing routine | LIFE_A:19,133,224 | CONFIRMED GAP | `src/home_staff.js` (45 lines, finite funded orders); no `completionCount` | |
| G11 | Lethal-task guard for away time not verified | LIFE_A:19 | UNCLEAR | No away routines run in runtime (G09); AD19 makes native defeat unconsciousness | Largely moot under AD16/AD19. |
| G12 | Feelings as capped resources | LIFE_A:56,130 | CONFIRMED GAP | `src/everyday_life.js:2` states "No mood currency"; mood conditions at `:6-8` | Conflicts with the Village choice; batch already says alternative. |
| G13 | "Ids ever seen" codex count across lives | LIFE_A:174,225 | CONFIRMED GAP | `src/lore_history_state.js:3` `HISTORY_LIMIT=96`, receipts and pins only | |
| G14 | Per-generation record with a note on how the life was lived | LIFE_A:30,131,226 | PARTIAL | `src/life_experience.js:17-24` `lifeEpitaph` builds a deed-based epitaph; `:35` carries the bequest lesson | WRONG that nothing interpretive exists. A "well lived" test is still absent. |
| G15 | No wealth-tier home look | LIFE_A:134 | CONFIRMED GAP | `tier` in `src/home_*.js`: no wealth naming | |
| G16 | No requirement vocabulary keyed to "learned in an earlier life"; no past-life gate | LIFE_B:36, SCREEN F1 (I4-a) | PARTIAL | Typed requires/effects exist (`src/body_progression.js:27-31`, `src/storylet_content.js`); inherited lessons at `src/heir_inheritance.js:9,37,75` | WRONG that no typed vocabulary exists. A requirement atom for earlier-life completion is absent. |
| G17 | `familiarity` appears in 15 src files | LIFE_B:35 | EXISTS | 15 files, 56 hits; `src/body_progression.js:30`, `src/pocket_realm_scenes.js:50` | Count is right; it is a relationship axis, not the loop-familiarity meaning. |
| G18 | calamity, burnout, madness, cruel, deathMerchant: 0 hits | LIFE_B:71,146,164 | CONFIRMED GAP | 0 hits | |
| G19 | Hidden chain bonuses keyed to action order absent; `combo` 2 UI hits | LIFE_B:119 | CONFIRMED GAP | `combo` hits are `combobox` only (`src/command_palette.js:85`) | |
| G20 | `karma` appears once, in leisure_memory HOST_CONTRACT | LIFE_B:180 | EXISTS | `src/absorb_p23/leisure_memory/HOST_CONTRACT.md:56` | It says there is no universal karma statistic. |
| G21 | `hospital` has 6 src hits in home files; no eviction downgrade | LIFE_B:196-197 | CONFIRMED GAP | 6 files match, all `hospitality` (for example `src/home_inheritance.js:2`, `src/home_staff.js:41`); `eviction` hits unrelated | Count is misleading: there is no hospital concept. |
| G22 | No qi-field, pollution, turbid or diffusion system; homes not spatial | SCREEN F1, IM4 | CONFIRMED GAP | 0 hits for pollution/turbid/diffus/qi field; `src/home_model.js`, `home_building_model.js` have no grid, tile, adjacency, layout | AD33 defers procedural layouts, so the batch's framing is correct. |
| G23 | Heir is a single successor; no claimants, order, life estate | SCREEN IM3 | CONFIRMED GAP | `src/heir_inheritance.js` exports only derive/validate/apply leftovers and lines (`:33,71,85,103`) | |
| G24 | No inherited quality, root or trait from two parents; no delayed named-cause events | SECT:125-128,498 | PARTIAL | Only a display label: `src/character_bio.js:22` ("Inherited body trait"); `heir_inheritance.js` carries lessons and goods | Mechanism absent. |
| G25 | No cause-of-death terms in src; cause-keyed lessons are new | SCOUT:120-121,487 | PARTIAL | `src/defeat_domain.js:8,18-19` records a defeat cause (`combat` or `harm`, place, by) | WRONG that none exist, though it records unconsciousness, not death. |
| G26 | No orphan, grief, mourn or came-of-age events | SCOUT:314 | CONFIRMED GAP | Only unrelated "orphan" validators; `src/npc_lives.js` is scripted | The batch's own caveat is accurate. |
| G27 | No skill floor, near-miss or paths-not-taken records | SCOUT:381 | BUILT 2026-10-23 | skill_records.js, skillRecords slice; [notes](W3_INSTITUTIONS_NOTES.md) | |
| G28 | No genotype, allele, pedigree, breeding code | COMPANIONS:15, SCOUT:443, I1_DEEP:156,238 | CONFIRMED GAP | 0 hits for genotype/allele/phenotype/pedigree; `breed` hits only substrings | AD33 deprioritizes NPC-heavy work. |
| G29 | No bond-ritual, wish or "leaves for the wild" code; `companion_roster.js` is read-only | COMPANIONS:15,84-89,126 | CONFIRMED GAP | `src/companion_roster.js:22` is a 73-line projection; `wish` has no runtime hit | Same AD33 flag as G28. |
| G30 | No reasons text for job fit in household staff | COMPANIONS:91 | PARTIAL | `src/home_staff.js:30-42` gives refusal reasons via `check(...)`; no fit forecast | |
| G31 | No accepted LLM direction in RULES_INDEX, USER_VISION, PROJECT | SCOUT:447 | CONFIRMED GAP | `rg "LLM|language model"` returns nothing in those three files | |
| G32 | No toxicity or tolerance code in src | POTION:13 | PARTIAL | Toxin axis and dose routes: `src/craft_content_frontier.js:14,22,29,50-64`; `src/craft_resolver.js:25-26` | WRONG on toxicity. Tolerance, overdose and addiction are absent (only `cold_tolerance` stats). The pack is "not wired into live gameplay yet" (`:3`). |
| G33 | No failure-residue or tried-pair memory | POTION:14,88,245 | PARTIAL | Residue exists only as Sticky effect `src/active_effects.js:508` with a wipe (`src/field_care_content.js:16-17`) and retort residue `src/factorio_retort_host.js:14`; no failure-as-ingredient, no tried-pair ledger | |
| G34 | No effect-cancel table, no derived-name grammar | POTION:154,249 | PARTIAL | Ordered ops and reactions with catalyst, limit, reactants to products: `src/craft_resolver.js:13,25,54-62,106`; example `src/craft_content_frontier.js:57` (`bind-toxin`) | WRONG as stated: a reaction engine exists. An opposite-pair cancel table and product naming are absent. |
| G35 | "No such potion model in src" (order-dependent reactions, heat, tier vs grade) | I1_DEEP:376 | PARTIAL | Same evidence as G34 | WRONG. Heat-to-impurity and a tier/grade split are absent. |
| G36 | No per-property known/unknown display for crafting | POTION:230 | PARTIAL | `src/craft_content_frontier.js:19` hidden axis (`glow`); knowledge stages in effects (`src/body_progression.js:29`) | Hidden properties exist; the unknown vs known-none UI is unverified. |
| G37 | No experiment log with deduction panel | POTION:205 | CONFIRMED GAP | No deduction or experiment-log code | |
| G38 | No delayed-letter evidence route | POTION:137 | UNCLEAR | Event feed and news exist (`src/event_feed.js:46`); no letter route found | |
| G39 | No shape-error scoring, client modeling; `alloy_equipment.js` has one profile | CRAFTING:79-80 | CONFIRMED GAP | `src/alloy_equipment.js:6-8` single `alloy_profile` | |
| G40 | Traffic-built route speed gain absent | CRAFTING:117 | CONFIRMED GAP | `src/known_routes*.js` is a projection ("never makes quotes", `known_routes.js:1-2`); `traffic` 0 hits | |
| G41 | No faction tiers with rivals in src ("per-world standing in book_world_* only") | ECONOMY:18,188 | PARTIAL | Regional reputation `src/models/hero.js:58`; effect `src/simulation_effects.js:337`; `src/town_content.js:41-45` | WRONG that standing is only in book worlds. Tiers, rivals and backlash are absent. |
| G42 | No bills of exchange, insurance, credit terms, rumour trust, market memory | ECONOMY:18-20 | CONFIRMED GAP | 0 hits for insurance, bill of exchange, market memory; `credit` hits are roster text only | |
| G43 | No scheduled consequences | ECONOMY:19 | EXISTS | `src/simulation.js:496-497,557-560` (`onExpire`, `checks` with `due` and `interval`) | WRONG. |
| G44 | `expedition_content.js` Scout entry has no odds-shifting rumor or priced-scout fork | EXPLORE:32 | PARTIAL | `src/expedition_content.js:133-145` (4-minute scout, visible 60/40 outcomes, capability modifiers that transfer odds) | Priced fork with shown odds exists. A rumor that shifts odds does not. |
| G45 | No shared mood/feature/terrain triple prompt | EXPLORE:19 | UNCLEAR | Claim has no distinct search term; nothing obvious | |
| G46 | Lapsing storylets with authored miss effect, reported on return, "not present in storylet_deck.js" | PROGRESSION:79-80, 202; SCREEN:301 | EXISTS | `src/storylet_content.js:19,32,38,54,68,72` (`onExpire`); applied at `src/simulation.js:557-558`; reported at `src/event_feed.js:46`; `src/storylet_deck.js:100` | WRONG. The deck file is not the owner. What is missing is an offline run of the story clock. |
| G47 | No vow or soul-fork system | PROGRESSION:36, 207 | CONFIRMED GAP | `vow`, `soulFork`: 0 hits | |
| G48 | "No death while away" offline rule not in src | PROGRESSION:115 | PARTIAL | No offline gameplay is implemented (LIFE_A:129); AD16, AD19 (defeat is unconsciousness) already point this way | Moot as a gap. |
| G49 | Pity exists; shared streak across two roll types is new | PROGRESSION:139 | PARTIAL | `src/gen_kit.js:152-156`; per-source use at `src/craft_sources.js:196` | Correct. |
| G50 | No player-notes field; atlas of visited only | PROGRESSION:194 | PARTIAL | No free-text player note; a Journal and received-accounts pane exists (`src/ui/preview/main.js:35`) | Unverified for the atlas. |
| G51 | `src/items.js` already has pill toxin and impurity fields; purge commissions extend them | CULT_REST:94,175; SCREEN:356 | CONFIRMED GAP | `items.js:4042,4047` are iron ingot descriptions; toxin at `:1783-1793,4149` is frog material text; no `pill` | WRONG on existing fields. Purge and cap-raise commissions are absent. |
| G52 | No trust tiers or gift gating | CULT_REST:107 | CONFIRMED GAP | No gift-size or tier code; `gift` hits unrelated | |
| G53 | No peer ranking | CULT_REST:131 | CONFIRMED GAP | `src/life_record.js:5` `LIFE_KINDS` has no ranking | |
| G54 | No heart demon, tribulation, spiritual root, meridian | CULT_REST:60, I1_DEEP:156 | CONFIRMED GAP | One retired item id only (`src/save_compatibility.js:3`) | |
| G55 | Lifespan lives in `simulation.js` and `chronicle.js` | CULT_REST:60 | EXISTS | `src/simulation.js:498,546`, `src/chronicle.js:15-17` | Correct. |
| G56 | "No numeric respect system" (a correction of an earlier line) | CULT_REST:142 | EXISTS | `src/party_battle.js:57` (`axis:'respect'`); axes at `src/relationship_view.js:17-26` | WRONG: numeric relationship axes exist. |
| G57 | No pay-for-safe-breakthrough choice | SECT:56-59 | CONFIRMED GAP | `breakthrough` appears only in an unrelated combat comment | |
| G58 | A milestone count gating a title was not found | SECT:93 | EXISTS | `src/titles.js:1-14` (counter and threshold titles), `tests/titles.test.js` | WRONG. |
| G59 | No after-fight cause classifier | SECT:303 | PARTIAL | `src/defeat_domain.js:18-19` records a cause, but not a diagnosis | |
| G60 | No salience table or post-hoc story recognizer | PROCGEN:108 | CONFIRMED GAP | `salience` 0 hits; `recogniz` hits are item recognition | |
| G61 | `provenance` in 55 files; gravestone description is the new part | PROCGEN:108 | PARTIAL | 55 files (mostly book-world contracts, for example `src/book_world_player_agency_contracts.js:48`); epitaph exists at `src/life_experience.js:17-24` | Count right; the epitaph is half built. |
| G62 | No diplomacy, schism, heresy | PROCGEN:17,93 | BUILT 2026-10-23 | world history events; [notes](W3_INSTITUTIONS_NOTES.md) | |
| G63 | `generated_people.js` has one `relationship` string; no reciprocal labels | PROCGEN:77 | EXISTS | `src/generated_people.js:30,47` | Correct. |
| G64 | No expiring relationship issues | PROCGEN:170 | PARTIAL | Conditions expire (`src/simulation.js:497,540`); no issue/grievance record | |
| G65 | Seeded streams, name grammar, frontier campaign already exist | PROCGEN:14 | EXISTS | `src/seeded_streams.js`, `src/name_grammar.js`, `src/frontier_campaign.js` | Correct. |
| G66 | `src/models` encounter profile weight modifiers (7 files) | PROCGEN:144 | UNCLEAR | `rg weight src/models` hits only `src/models/person.js` (a Weightlifting skill) | Claim appears wrong; the count cannot be reproduced. |
| G67 | No rune-pair exhaustion grammar; no learned-by-contrast language | MAGIC:52,61 | CONFIRMED GAP | `src/techniques.js` has no rune, slot or combination grammar | |
| G68 | No log-depth laws, tribulation ramp, proficiency-to-aptitude rule, persistent exponent currency | I1_DEEP:160-162,379 | CONFIRMED GAP | No matching terms | S3 is close to the heir lesson carry (`heir_inheritance.js:37`) but not the same rule. |
| G69 | No sandboxed challenge runs with a shelved save | I1_DEEP:240 | PARTIAL | `src/scenario_facade.js`; `src/expansion_engine.js:721` ("isolated scenario") | |
| G70 | No talisman ordering craft | I1_DEEP:241 | CONFIRMED GAP | `talisman`: 0 hits | |
| G71 | YAIR calendar vs consumed time already separate | SCREEN IM5 | PARTIAL | Docs audit cited; runtime files `src/simulation_clock.js`, `src/realm_clock_leases.js` | Not traced in runtime. |
| G72 | `home_inheritance.js` conveys residences; staff and rank do not transfer | LIFE_A:131 | EXISTS | `src/home_inheritance.js:2` | Correct. |
| G73 | YAIR has a PC `lifeStage` with youth/adult/elder learning | SCOUT:315, 112-119 | EXISTS | `src/life_experience.js:1-8` | Correct. |
| G74 | Frostward-style builders and Moru memory records have no counterpart in `npc_lives.js` | SCOUT:293 | CONFIRMED GAP | `src/npc_lives.js` is 53 lines of scripted people | Capped memories live elsewhere (G06). |

## Closing

### Five most consequential CONFIRMED GAPs

1. **G01 and G02: no age-driven chronic conditions, no isolation.** Lifespan exists, but nothing connects age, care choice and a falling ceiling. Owner direction is firm (AD13, BHR); this is the clearest body-side hole.
2. **G23 (with G24): heir is one successor with no law, order or parentage traits.** The carry code is lessons and goods only. Any inheritance-law or lineage idea must keep the save shape (AR rules).
3. **G10: no standing routine or completion-count unlock.** `home_staff.js` takes finite funded orders only. This is the base of AD16 away-time routines, so it gates the idle loop most directly.
4. **G42 (with G41): no credit, insurance, rumour trust, market memory or faction tiers.** ECR17-ECR23 state the policy but runtime has none; regional reputation exists but does not touch trade (`src/trade.js`).
5. **G13: no cross-life discovery codex.** `lore_history_state.js` keeps 96 receipts; a distinct-ids count across lives would be new and cheap.

Near misses worth knowing: G22 (qi field, no spatial homes) is a real gap but blocked by AD33; G28 and G29 (genetics, companion rites) are real gaps that AD33 deprioritizes.

### Claims the batches got wrong

- **G46:** lapsing storylets exist (`onExpire`, `src/storylet_content.js`, `src/simulation.js:557-558`, feed report at `src/event_feed.js:46`). Listed as a top finding in PROGRESSION and the screen.
- **G58:** counter-threshold titles exist (`src/titles.js`). SECT said none.
- **G32, G34, G35:** a crafting reaction engine with a toxin axis and dose routes exists (`src/craft_resolver.js`, `src/craft_content_frontier.js`), though unwired. POTION and I1_DEEP said no toxicity, no effect rules, "no such potion model".
- **G51:** `items.js` has no pill toxin or impurity fields. CULT_REST and the screen said it extends them.
- **G43:** scheduled consequences exist (`src/simulation.js:557-560`). ECONOMY said none.
- **G56:** numeric relationship axes including `respect` exist. CULT_REST "corrected" a line into a false claim.
- **G41:** reputation is not only in `book_world_*` (`src/models/hero.js:58`).
- **G04:** `home_staff.js` has no owed-wage notion; the cited line is a supply order.
- **G14, G25:** a deed-based epitaph (`src/life_experience.js:17`) and a defeat cause record (`src/defeat_domain.js:18`) exist; both were reported absent.
- **G16:** a typed requirement and effect vocabulary exists; only the earlier-life atom is missing.
- **G09:** AD18 already accepts banked unused time; LIFE_A called it "under consideration". The away ledger is also unwired.
- **G21:** the "6 hospital hits" are `hospitality`.
- **G66:** the "7 files" of weight modifiers in `src/models` cannot be reproduced.

### Direction flags (AD1-AD41)

- AD33 deprioritizes NPC-heavy work, which cuts across the companion and genetics proposals (G28, G29), orphan or grief events (G26) and the relationship state machine (G03). Procedural layouts stay deferred (G22).
- AD16, AD18 and AD19 already cover away routines, banked time and forgiving defeat. Death-while-away, pending death and lethal-task guards (G11, G48) are mostly settled direction, not gaps.
- Scope note: the screen's mapping caveat (SCREEN:326) says name-grep gaps are not verified gaps. This check confirms that caution was warranted.
