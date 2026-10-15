# Family inventory and remaining implementation scope

SHOWN inventory; INFERRED owner routing. This is the 32-row family list, including every named-only or partly documented system. The machine map also retains every one of the 143 helpers, 255 tables and 28 inherited unread rows. No inventory node is silently called complete. Counts are catalogs, not distinct gameplay system totals.

| ID | System | Family | New bounded read | Still open |
|---|---|---|---|---|
| I01 | kingdom/faction identity | identity | Prior only | Prior generation/name digests; combined flags partial; full lifecycle remains open |
| I02 | race traits and effects | body | Prior only | Prior native generation reads; stacking partial; full lifecycle remains open |
| I03 | typed/generated names | identity | Prior only | Prior REA resolver trace; lifecycle partial; full lifecycle remains open |
| I04 | portrait/flag/currency/crown/building/weapon/phrase | identity | Prior only | Generation call composition documented; most individual grammars undocumented; full lifecycle remains open |
| I05 | hero/mercenary/adventurer background | social | S02, S03, S04 | Hero selection and retained stories documented; adventurer resolver undocumented; full lifecycle remains open |
| I06 | contextual conversations | social | S05, S09, S11 | Prior census only; now native path index, exact caller gates partial; full lifecycle remains open |
| I07 | advice | knowledge | Prior only | Previously undocumented; now eligibility/redraw/clear traced; full lifecycle remains open |
| I08 | jokes, insults and entertainment | social | S05 | Prior inventory; selection/effects mostly undocumented; full lifecycle remains open |
| I09 | petitions and reactions | events | Prior only | Prior dispatch and one petition traced; full branching partial; full lifecycle remains open |
| I10 | exploration and discovered sites | events | S12 | Prior selected dispatch; city/site chains undocumented; full lifecycle remains open |
| I11 | quest composition | events | S08 | Previously undocumented; now tuple resolver traced, objective consumers unread; full lifecycle remains open |
| I12 | calendar/annual reports | clock | S15 | Prior selected report/dispatch; now bounded phase order and initial seeding; full lifecycle remains open |
| I13 | treasury/harvest/wages/tax/trade/tribute/bank | economy | Prior only | Prior arithmetic and menu loops; whole economy partial; full lifecycle remains open |
| I14 | recruitment/training/delegation | economy | S04, S10, S15 | Prior selected trace; manual markets and training undocumented; full lifecycle remains open |
| I15 | deployment/battles/raids/siege/assassins | combat | Prior only | Prior casualty/return/mercenary setup; round/event/army model partial; full lifecycle remains open |
| I16 | arena/champions/tournaments/bets | combat | S04, S10 | Prior selected arena; tournament/champion/full events undocumented; full lifecycle remains open |
| I17 | monsters/pit/trainer | body | S06, S07 | Previously undocumented; now assembly/leveling/one gate traced; fight/trainer effects partial; full lifecycle remains open |
| I18 | initial faction relations/truces | social | S01 | Previously undocumented; now initialization/truce writes traced; consumer mapping unread; full lifecycle remains open |
| I19 | diplomacy/opponent choices | social | S01 | Prior menu observations; actual action model undocumented; full lifecycle remains open |
| I20 | staff/council/nobility | social | S02, S05 | Prior roster/save paths; decisions and roster schemas undocumented; full lifecycle remains open |
| I21 | goblin/bandit communities | world_simulation | S14 | Prior generation calls; community action rules undocumented; full lifecycle remains open |
| I22 | local tribes/camps/travelers | world_simulation | S08, S09, S10 | Prior inventory; local policy/economy chains undocumented; full lifecycle remains open |
| I23 | black market | economy | Prior only | Prior menu/pool inventory; transaction model undocumented; full lifecycle remains open |
| I24 | dice/brawling/drinking | minigames | Prior only | Inventory only; scoring and rewards undocumented; full lifecycle remains open |
| I25 | children, tutor and local characters | social | S11, S13 | Inventory only; local consequences undocumented; full lifecycle remains open |
| I26 | ceremonies/celebrations/throne | events | Prior only | Inventory only; transaction/closure mostly undocumented; full lifecycle remains open |
| I27 | menu/difficulty/confirmation | ui | Prior only | Inventory only; onboarding sequence undocumented; full lifecycle remains open |
| I28 | information and art | ui | Prior only | Source presentation observations; full surfaces undocumented; full lifecycle remains open |
| I29 | audio and display controls | ui | Prior only | Now quiet level feedback traced; full audio/settings unread; full lifecycle remains open |
| I30 | saving/loading/deleting | save | S02, S03, S04 | Prior detailed schema; string/migration/companion lifecycle partial; full lifecycle remains open |
| I31 | authored Extras and start data | content_authoring | Prior only | Prior inventory; full semantics undocumented; full lifecycle remains open |
| I32 | endgame/time expiry/last battle | endings | Prior only | Inventory only; endings/meta-loop undocumented; full lifecycle remains open |

## Owner gaps

G01 is a rule-depth gap, not an owner gap: LIFE_SIM_NORTH_STAR already covers games and gambling; the checked synthesis does not supply a complete bet settlement contract.

G02 is a rule-depth gap, not an owner gap: the thematic UI owner explicitly covers ambient sound, category volume/mute and reduced motion. Console interruption details remain unlocated.

No completely ownerless family was established in the checked set. FAMILY_MAP marks no_owner_verified=false for the whole audit. Rule-depth gaps must not be reported as missing owners. Body, lineage, knowledge and production already have owners even where Warsim evidence is absent.

All named helper and table locators, family, coverage, K codes, packet IDs and topic-palette paths: [FAMILY_MAP.json](FAMILY_MAP.json). All mapping rows are proposal routing, not assignments or implementation acceptance.
