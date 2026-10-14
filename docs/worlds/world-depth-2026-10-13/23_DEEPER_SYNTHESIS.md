# Deeper synthesis: primitives, tensions, ways it can go (proposal, 2026-10-13)

Weibao (2026-10-13): "There are so many ways this can go, more to consider? Deeper stuff and more?"

This part reads parts 01 to 18 plus the sibling scratch parts S (dialogue
actions) and T (friends and relationships) together and writes the layer under
them: the few engine primitives most rows reduce to, the places parts pull
against each other or against accepted rules, the main directions the game can
take, ideas that appear only when parts are combined, duplicates and
contradictions, and one connected first arc. Parts U (renown and subtle
social stuff) and V (game features as unlocks, tools and cheats) arrived while
this was being written; their code findings, models and suggestions are folded
in below by code.

Everything is a proposal. Nothing here is accepted, built or run. Defaults come
with a dial and a reason. Sealed secrets appear by route rule only; this part
names no sealed truth and opens no new sealed slot. Franchise facts come from
the parts and keep their labels there.

**One live change since the parts were written.** Commit `643b7f1b` (FA17, R15
G5) wired the heir and replaced the one-lesson rule: `src/main.js:1601`
defines `beginHeir`, the chronicle panel now receives it with `heirPreview`
(`src/main.js:8245-8253`), and `src/heir_inheritance.js` derives and applies
leftovers (money after the kit debt, carried and worn goods, chest goods, the
Shack, written papers, the taught apprentice as recipient, half standing, open
elder obligations). The commit records seeded fixtures and browser evidence in
that lane's folder; this pass read the source and did not rerun or check that
evidence, and the change is not yet Weibao-accepted. Rows in parts 07, 11, 13
and 17 that call the heir "unwired" are stale (DC2-1). Still open in source:
the heir is named `'The heir'`, the milestone hard-codes `worldId:'base.frontier'`
(`src/life_experience_host.js:22,28`), and the whole expansion state is rebuilt
(`:20`), so people, ties, world instances and campaigns still do not carry.

Codes: UP (primitives), TN (tensions), WG (ways it can go), DA2 (deeper
angles; plain DA belongs to part S's dialogue actions), DC2 (duplicates and
contradictions), AR (first arc).

---

## 1. Underlying primitives (UP)

Most rows across 20 parts reduce to fifteen shapes. Building each once, with a
save decision, serves every row that leans on it. "Code today" cites the parts'
own findings (rechecked where noted); lines can drift on the dirty tree.

| Code | Primitive and shape | Rows that reduce to it | Code today | Built once, it unlocks |
|---|---|---|---|---|
| UP1 | **Belief.** A fact an actor holds: key, stage (`seen` < `interpreted` < `understood`), value, basis (kind, attributedTo, situationId), and later a copy tag and a confidence word. | 14 RS1-RS17, RS25-RS36, SB10, JN8; 06 PW4, PW7, SG3; 07 RF11, EI9; 12 SX3, SX4; 15 HG4, SY3, SS9; 17 CL3-CL5, CL12, RT15; 05 CLH2; S DA1-DA3, DA14, DA20, IC6, IC7; T RM3, MF5 | Ladder at `src/simulation_effects.js:280-284` (rechecked: lower stage cannot replace, same stage replaces). Basis written at `src/lore_practice_content.js:25-27`, `src/book_world_mol_actions.js:17`; about 166 `attributedTo` uses (S X7). Gaps: no copy tag, no correct or dispute operation, few basis kinds, basis not shown in the notebook. | Honest notebooks, lies with a shelf life, reader foreknowledge that drifts in eight worlds (SX3), hint stages, letters across lives, AU evidence routes. |
| UP2 | **Receipt.** A typed memory record held by a person, group or institution about someone: kind, cause, time, witnessed flag, decay. | 10 PE5, IX5, IN6; 07 RF12; 01 OF4; 13 EO15, EO16, PF1, PF9; 11 UG8; U RN2-RN6, RN13, RE1-RE8; 16 EOX4, SCX3, SXF10; 17 CL13; 15 SY2; 18 PA7, PA10, PT14; S IC1, IC10, IC13; T RM2, RM6, UF2, UF4 | Relationship memories with a cause key that blocks farming, capped at 32 (`src/simulation_effects.js:284-292`, rechecked); chronicle memories (`src/chronicle.js:31-34,57-65`); grant receipts on sources (`src/expansion_engine.js:498-504`); typed-start selection receipt (`src/structured_pack_runtime.js:43`); observation receipts marked `private` or `witnessed` (`src/observation_channels.js:53,132`, U X11). Gaps: no decay, no institution holder, two parallel stores (T X5), renown held as three fixed region integers (`src/models/hero.js:31-35`, U X1). | Standing without new reputation regions (IX5), prices that remember, return reports, earned-option receipts, hint sighting logs, renown as a sum of receipts. |
| UP3 | **Witness set.** For any act: who was present, who could perceive it at their sight level, and who they can tell. | S X11, CF4, CF7, IC6; U RN8, RN9, RN12, RC6, X11; V DP5, DP12; 13 the "Witnessed" column of CA1-CA21, PF9; 14 SB4, SB8; T MF15, X4; 07 RF14; 03 BL16; 10 IX7; 15 HF20; 06 PW3; 17 CL30 | Required `audience` on structured commands (`src/structured_pack_definitions.js:84`); witness trust loss on attacks (`src/causal_story_host.js:248,259`); people view shows witnessed facts and hides private axes (`src/people_knowledge.js:29`); a witness flag when the village guard is present (`src/main.js:1207`, U X11). | Renown, masks and secret identities, lie-catching, "who saw you get your cheat", sight-gated log lines, all from one model. |
| UP4 | **Regard edge.** Directed axes plus typed ties plus a short mood between two actors, with group records on top. | 08 AK2, PML6; 09 QK1; 16 RLX1-RLX11; T RM1-RM15, MF1-MF15, RD1-RD17, RX1-RX10; S DA6, DA9, DA19, DA25; 17 CL9, CL13; 13 CA15; 05 CLL2, CLH3 | `simulation.relationships[actor][target]` (`src/simulation_contracts.js:218,250`); chronicle ties (`src/chronicle.js:29-34,78`); an unused gate fact `relationship.<axis>` (`src/simulation_effects.js:155`, rechecked); rebirth wipes both directions (`src/simulation.js:571,578`); the heir rebuild drops ties (`src/life_experience_host.js:20`). | Relationship AUs as data edits, friend payoffs, trust gates with no engine work, heirs met by their parent's friends. |
| UP5 | **Obligation with a clock.** Debtor, creditor, kind (debt, promise, oath, lease, duty, favor, contract), terms, deadline, status, scope (you, your line, your soul, your post). | 06 ST10; 11 DS6; 12 SX6; U RN11 expectation debt; V FR15; 13 CA17, CA18, EW28; 16 CAX3, CAX4, CAX6, SXF9; 17 CL14, CL18; S DA4, DA22, DA23, IC5, SG2; T RM5, RD1, RD17; 05 CLH1, CLC3; 08 HP10 | Elder ties `archiveDuty`, `dutyKept`, `grievance` (`src/chronicle.js`, shown at `src/people_knowledge.js:16-27`); favor cap (`src/village_career.js:49-50,158`); promise situation (`src/promise_content.js:17-40`); heir estate settles the kit debt and lists open obligations (`src/heir_inheritance.js`, rechecked); `expiresAt` on grants (13 CA18); claim settle (`src/simulation_effects.js:298`). | A promise ledger, debt-clock starts in five worlds, pacts and contracts, heirs who inherit duties, leased cheats. |
| UP6 | **Clock with an absence policy.** A played-minute instance clock, a calendar that maps it to local dates, a weekly beat, and a policy (freeze, ratio, catch up on entry, tended by someone). | 07 RF6, RF7, RF15; 06 MC2, PW9, SU5, SU6, SU10; 14 SC5, SC9, SC14-SC17, RS13, RS14, RS20; 05 CLI3, CLL3, CLC1-CLC3; 17 RT6, CL19; T RM7, RM8; 16 PX1, PX6, EOX5, EOX7; 01 OF2, OF10 | Freeze asserted (`src/world_instances.js:108-111`, rechecked); `planWorldClock` returns `absentBy` (`:310-346`); calendar helpers (`src/world_rhythm.js:5,20`); home calendar and weather only (`src/game_time.js:193-195`, `src/weather.js:37,194,198`); one prepaid escrow (`src/backlog_expansion_time.js:43-52`). | Festivals, drift between copies, worlds that move on between lives, idle work by helpers, two ages on the bio. |
| UP7 | **Situation.** A scheduled or caused happening with phases, a response window and a declared outcome for refusal and for doing nothing. | 07 EI10; 10 EV2, EV6, IX6; 01 OF14; 02 MOL6; 04 SL13; 06 ST6; 16 RLX4, AUX2, AUX11, WIX3; 15 EP10; S IC4, DA15; 13 EO4 | Caused events (`src/simulation_effects.js:375-377`); the promise situation with phases and a private truth (`src/promise_content.js:17-40`); situation basis (`src/causal_situations.js:52-57`). | Canon that runs without the player, abstention as a real choice, delayed consequences of words, divergence created in play. |
| UP8 | **Carrier with a manifest.** Anything that moves state across a boundary (world, life, copy, person, time), listing kept, converted, lost and waiting rows, with a cost and a chance to fail. | Rule 5; 17 CL1-CL32, CLW1-CLW8; 05 CLL1; 09 QK11; 11 MR4, SM10, AC9, AC16; 07 RF9, RF16; 10 AB5; 06 SU1-SU4, MC1, MC5, ST5; 14 SB10, JN7, RS16; 15 EP7, SY6; S CF8; T RD9, RX1, RX8 | Exact stock manifests (`src/realm_cargo.js:97,187`, `src/native_realm_traveler.js:15`); boundary rules (`src/realm_boundary_rules.js:2,103`); traveler modes (`src/realm_traveler_profiles.js:5`); heir leftovers now committed (`src/heir_inheritance.js`, `src/life_experience_host.js:11-30`, `src/main.js:1599-1604`). | One receipt grammar for heir, loop reset, crossing, AU copy plan, letters and the "while you were away" report. |
| UP9 | **Copy with a divergence patch.** A base definition plus a small patch compiled under a new ID, with a counterpart map and a provenance label. | 07 EI1-EI8, EI11, RF10; 06 PW1-PW13, ST7; 08 AK1-AK7; 09 QK1-QK12; 16 PX1-PX11, AUX1-AUX11, DTX8; 11 MR1, MR3, MR5, MR8; 10 LC6, PE8, IX8, AB7, IT6, IN4, EV5, MC2-7; 17 RT13; parallel rows in 01-05 | ID-prefix ownership (`src/structured_pack_definitions.js:32-60`); provenance per pack (`src/content_packs.js:120`) and parking (`:135`); instance continuity, era and parent fields (`src/world_instances.js:97-112`); facts from `initialFacts` (`:271-284`); whole hashed start snapshots (`src/structured_pack_runtime.js:14-16`); one active visit (`src/expansion_engine.js:142-143`). | AUs, era starts, heir and executor starts derived from a beginning, sandbox runs, copy experiments. |
| UP10 | **Tier per facet.** Depth tier T0 to T5 on each facet of an entity (place, schedule, trade, dialogue, memory), with canon weight and promotion triggers. | 10 DT0-DT9, FW3, SA9, MC2-3, MC2-8; 16 DTX1-DTX10; 11 UG12; 18 PN8; 06 WI6, WI7 | None at runtime. The nearest gate: the compiler rejects a capability with no consumer (`src/structured_pack_definitions.js:100`). | "Every little detail exists" with proof per template, a readiness gate for the picker, promotion that follows play. |
| UP11 | **Reveal grade.** Hidden, rumor, silhouette, fogged or known, opened by knowledge, skill, body or route, with sealed pointers kept opaque. | 13 EO9, EO10, EO14, PF2, PF6, CA2; V X1, FR1, DL1, DP1, LN9; 11 UG3, UG5, UG11, SM4, SM5; 06 ST12; 15 HG12, HG13, SS1-SS10, SY3, EP4; 07 RF13, RF19, EI11; 14 RS8, SB1, JN8; 10 LC7, DT8, SA6; 18 PA20 | Dormant sources ignored (`src/capabilities.js:54`); known-only discovery projection (`src/skill_discovery.js:1-40`); module eligibility and sticky discovery from save facts (`src/workspace_layout.js:7,84-111`, V X1); skill visibility thresholds (`src/models/skill.js:26,55,153`, V X2); cue policy (`src/native_discovery_policy.js:3`); palettes kept independent of sealed IDs (`src/workspace_views.js:44-45`, rechecked). | Spoiler-safe starts, earned panels, silhouettes, sealed routes, second reads of hints. |
| UP12 | **Meso ledger.** A unit (household, squad, shop, class, office) with members, duties, stock and favors, plus a weekly beat derived from receipts. | 14 SC4-SC13, JN5, JN9; 16 SCX5, DTX7; 10 IN3, IN5; T RM14, RD12; 11 DS3; 06 ST9; 17 CL16-CL18; S IC2, IC3, DA16; 13 EW12 | Village career (`src/village_career.js:4-8,12,136-182`); household lives (`src/npc_lives.js:5-22`, yearly at `:33`). | The weekly beat, appointed idle work, institution and office starts, office succession, duty rosters as loops. |
| UP13 | **Practice counter.** Use counts on an action, with thresholds that become log voice, tells, traits, titles or cheats. | 13 CA12, EW14, EW21, EW27, EW29, PF4; V FR10, FR12, T5; U SU4; 16 CAX1, EOX6, EOX11, SBX1-SBX11; 14 SB1-SB15; 06 SU3; 17 CL6; 18 PA1, PA3-PA5, PA11, PA21, PA22; T MF1, RX4 | Watchcraft reading and practice minutes (`src/village_career.js:4-8,161-170`); discover, learn, practice and use commands (`src/skill_expansion_content.js:3-70`); a death counter (`src/main.js:3622`, per part 18); title counters with a 5-second check (`src/titles.js:8-37`, `src/main.js:7653,7661-7682`, U X9). | Idle-native growth, habit cheats, quiet skills, gauges and titles, recognition by habit. |
| UP14 | **Source provenance.** How a capability arrived (origin), what carries it (carrier) and what it belongs to (scope: body, blood, soul, record). | 13 CA1-CA21, EW1-EW38, suggestions 1 and 2; V X14, FR2-FR15, DP8; 16 CAX1-CAX11; 17 RT9, CL2, CL15, CL31; 10 AB1, AB5; overview B7 | Four origins (`src/capabilities.js:5`, rechecked) validated at `src/expansion_engine.js:116`; grant fields (`:498-504`); `awakened` and `active` flags (`src/capabilities.js:54`). | Every cheat path as data, soul or blood scope for carries, "how you got it" lines, dormant silhouettes. |
| UP15 | **Profile record (layer L4).** A store outside any save: unlock receipts, codex, achievements, open-everything dials, favorites. | 13 EO1, EO11, EO12, EO17, PF5, PF6; 11 UG2, UG8, UG9, KA5, SM8, OS7; 17 CL7, CL8, CL31, RT12, NW1, NW2, NW6 | None. One save key (`src/main.js:349-350`); `hard_reset` clears that key (`:7005-7016`); layout and color keys survive a reset (`src/workspace_layout.js:32,53,76`). | Earned starts across new games, a player codex, start favorites, rarity shown as "lives that opened it". |

**Composites (what bigger features are made of).** Default reading for agents:
a joke-hint is UP1 + UP3 + UP11 with a UP2 sighting; a start card is UP9 +
UP11 + UP8; the heir is UP8 + UP5 + UP4 + UP12; an AU is UP9 + UP4 + UP7;
renown is UP2 summed over UP3 and moved by UP8 at UP6 speed; a cheat is UP14
grown by UP13 or bound by UP5; the return report is UP8 applied to UP6; an
earned option is UP15 or a lineage UP2 shown through UP11.

**Order that falls out.** UP1, UP2 and UP3 sit under the most rows and mostly
exist, so their display slices come first (zero save change). UP5 and UP12
have working one-off versions to generalize. UP6, UP9 runtime instancing and
UP15 carry the real migrations and the NW questions, so they come after play
shows what the cheap versions need.

---

## 2. Recurring tensions (TN)

Each is written as the dial that resolves it. The default leans on accepted
rules; the dial keeps every reasonable option reachable.

| Code | Where the pull is | Rows on each side | Dial that resolves it |
|---|---|---|---|
| TN1 | **Earned options against open sandbox.** | Earned: 13 EO2-EO10, PF6; 11 UG2-UG5. Open: 11 UG10, KA2, AC13; 13 EO11; Weibao's "everything possible, reasonably". | Provenance dial on every option: earned (with receipt), opened by choice (plain mark, PF12) or sandbox (stamped, writes no profile). Default earned, with the open switch one click away in settings. The record stays honest whichever way he plays. |
| TN2 | **Frozen absence against idle research, helpers and drift.** | Freeze: rule 7 table, `src/world_instances.js:108-111`, 14 CODE8. Moving: 14 RS13, SC15; 05 CLC1; 17 CL19; T RM7; 06 PW9; S CF9. | Two separate dials: absence policy per world (freeze, ratio, catch up, tended) and time source (played time elsewhere, wall-clock offline). Default: absent worlds freeze; work assigned before leaving runs on played meso time with handed-over stock; wall-clock offline for absent worlds stays off until Weibao opens it. |
| TN3 | **Renown against secret identity.** | Fame: 13 EO8; 06 MC1; 11 DS7; U RN2, RE1-RE11. Secrets: U RN8, RN9, RE12; T RM3; 16 RLX1, SBX3; 14 SB24; 13 EW33 True Names. | Standing attaches to handles (name, face, mask, office, soul, deed), as 17 CL9 proposes. Default: a receipt names the handle the witness saw; linking two handles is itself a belief someone has to learn, and an unmasking merges rows loudly (U RN9). Dial per world: how fast handles link (fast in a village, slow in a fog city). Both the famous and the unknown late game stay valid (U RE11, RE12). |
| TN4 | **Carryover against "no free carries".** | Carry: Weibao's 2026-10-13 direction; 17 CL1-CL32, CL31 meta source. Rule: rule 5 carrier, "knowledge doesn't automatically cross", NW5. | Every carry names a carrier, a layer (L1 to L5) and a cost. Default: the player codex informs Weibao and not the character; a letter, soul slot or teacher turns a page into character knowledge (CL12 bridge). Dial: carrier strength per world. |
| TN5 | **Detail density against proof cost.** | Density: Weibao's "every little detail"; 10 LC, PE, IX rows. Cost: 10 LW1-LW3 (3,803 ledger rows, 2 units shipped); 18 PN8 hollow stubs. | Tier per facet (UP10) with proof per template. Default floors by canon weight (DT6), promotion on play or reference, and a readiness gate so nothing below T2 appears in normal play (UG12). Dial: per-world floor for its signature family. |
| TN6 | **Sealed safety against fair discovery.** | Sealed: AGENTS rule; 15 SS1-SS10; 11 UG11; 17 NW6. Discovery: 15 HG1-HG14; 14 JN8, RS12; 06 PW3. | Stage ceiling: a hint or research line can raise a sealed entry to "suspected" and stops there (SS9); "known" needs the secret's own route. Player dial for hint eagerness (HG12) and world dial for density (HG11). |
| TN7 | **Canon fidelity against player impact.** | Canon: 09 QK2 (slot taken, canon adapts and is not restored), 08 PML-A10 (canon instance never shows the AU), 07 EI10. Impact: 16 AUX7 butterfly, S DA15 warn, 11 MR2. | Copy on divergence: the canon instance runs its clock; a player act that breaks a declared canon event forks a new instance labeled by its cause (DA2-3). Dial per world: inertia (how much canon pushes back before it forks). |
| TN8 | **Anti-farm and save integrity against solo-player freedom.** | Integrity: rule 9, 17 NW2, cause keys (`src/simulation_effects.js:287-289`). Freedom: memory "solo player, no once limits"; 13 PF5 rarity without caps. | Diminishing returns by kind of event (T RM6) instead of counts or caps; reload duplication is handled at the save layer, not by gameplay limits. Dial: harsh profile where profile unlocks can be lost (EO12). |
| TN9 | **Words over meters against legibility.** | Words: T UF3, 14 SB1, S CF14. Numbers: 18 PA1 stats journal, PA14 odds, PN5 hidden price drift as a warning. | Display dial: words by default, numbers on toggle. Rules that move prices or odds get posted or shown in history, whichever display is on (PN5 fix), so feel does not hide a rule the player can plan around. |
| TN10 | **Vanilla opening against the start picker.** | Vanilla: rule 8, 17 NW3, the Village start (`src/main.js:8019-8029`). Picker: 11 SM1-SM14, KA3, KA4; 17 RT5. | The vanilla Village descriptor stays the default start; the picker adds starts beside it. A non-Village default or a past-life reading of the opening waits for NW3. |
| TN11 | **One realm and one prestige layer against many succession routes.** | Scope: AGENTS "Scope"; 17 NW4. Routes: 17 CL16, CL19, CL21-CL28; 11 AC3-AC5. | Read prestige as one layer with route dials (heir now built; student, office, soul and loop as later dial values), each shipped as its own slice after NW4. Until then, routes beyond the heir stay design rows. |
| TN12 | **Shared engine against distinct worlds.** | Shared: 07 P5 three-world rule, 06 WI10. Distinct: 07 RF17 unique verbs, 15 HG11 density, 16 AUX6 genre. | Primitives are shared; each world sets its dial values, lore absolutes and one signature verb. Promotion to engine follows the three-world test with different local rules. |
| TN13 | **Parallel lanes against fast slices.** | Lanes: 07 R1-R13; R15 holds `src/main.js`, saves, tests and `dist/`; G5 owns heir work. Speed: Weibao's "smallest playable first". | Data and view slices that stay out of R15 files go first; anything touching `main.js`, saves or the heir queues for an R15 window or goes to G5. One writer per file area. |
| TN14 | **Many copies against readability.** | Many: 16 PX1-PX11, AUX1-AUX11; Weibao's parallel-worlds request. Fatigue: 08 AK2 (two flips per AU), W5 premise fatigue, 11 MR8 merge. | Copies per world and flips per copy are dials with low defaults; copies nobody visits fade into the archive (PW12, DTX10) with a last-visit window. |
| TN15 | **Knowing the player against character knowledge.** | Player-aware: 15 HF13, EP12; 17 CL7. Character: rule 6, "knowledge doesn't automatically cross". | Fourth-wall reach dial (R0 to R7 in PRESENTATION) and a labeled codex. Default: meta lines read game state from this save, not real-world data. |
| TN16 | **Features as base game against features as cheats.** | Base: the proposed default in USER_VISION; V X1, LN1-LN10. Cheat: lore meaning of breaking a world's rules; V FR5, the cheat layer; 13 EO14. | V's test settles most cases: a feature is a cheat in a world when its people lack it and having it breaks a rule they live by; otherwise it is a tool, service or setting. Framing dial per world (V DL2), with the base version kept beside any cheat version (V LN10). |
| TN17 | **Gate by fit against gate by power.** | Fit: 11 UG7, 18 PN3, rule 12 outliers. Power: native ladders (13 CA13), level-gated areas in sources. | Gates name a reason and a fix ("needs a permit", "needs a human adult body"); a strong visitor meets local supply and suppression dials (06 ST11, 07 RF16) instead of a number wall. |

---

## 3. Ways it can go (WG)

Eight big open directions, each with distinct trajectories. They can mix;
each line says what the game feels like if that trajectory leads.

### WG1 Heir and succession (built in a first form, `src/heir_inheritance.js`)

| Code | Trajectory | Feels like | Leans on |
|---|---|---|---|
| WG1a | **Estate line.** Wills, executors, debts settled before goods pass, contested claims, family standing (CL9, CL14, SX5). | A small family saga where money, houses and grudges outlive you. | UP5, UP8, UP2 |
| WG1b | **Apprentice line.** The taught student becomes the next life and keeps what she really learned (CL16; the leftovers already pick "apprentice" as recipient). | A craft lineage; teaching is how you prestige. | UP12, UP13, UP4 |
| WG1c | **Office line.** You inherit a post with its files, cases and enemies (CL18, CL17). | Workplace drama across generations: the gate post, the garrison, the archive. | UP12, UP5, UP2 |
| WG1d | **Soul line.** Rebirth as a stranger decades later in a world your life changed (CL19, CL2, CL13). | Bittersweet return: old friends aged, your grave, your works unlabeled. | UP6 (world moves on), UP8, UP3 |
| WG1e | **World as heir.** No link at all; only buildings, laws and graves remain (CL20). | Archaeology of yourself; the world remembers what nobody tells you. | UP9 world state kept (RT2), UP11 |

### WG2 Parallel copies

| Code | Trajectory | Feels like | Leans on |
|---|---|---|---|
| WG2a | **Anthology shelf.** Each AU is its own pack, entered as its own start (EI1, BO2). | A shelf of what-if stories; clean, cheap, no cross-talk. | UP9 build-time |
| WG2b | **Living multiverse.** Several live instances per world with drift and counterparts (EI6-EI9, PW9). | Copies that age and diverge while you are elsewhere; your choices echo. | UP9 runtime, UP6, UP1 copy tags |
| WG2c | **Mystery of the copy.** You find out you are in a copy through tells (ST7, PW3, DS8). | A quiet uncanny game: a sign spelled wrong, someone alive who should not be. | UP11, UP1, UP3 |
| WG2d | **Laboratory.** Change one thing in a copy and compare (RSX10, PX8 notebook copy, PX2 frozen moment). | An experimentalist's multiverse; copies are instruments. | UP9, UP1, UP7 |
| WG2e | **Trade network.** Prices, goods and favors differ between copies (PW11, PX5 stitched copy). | A merchant between worlds; arbitrage with in-world friction. | UP8, UP5, UP2 |

### WG3 Start picker and access

| Code | Trajectory | Feels like | Leans on |
|---|---|---|---|
| WG3a | **Catalog picker.** Three-column desktop picker with eras, positions, dials and presets (SM2, SM3, SM6). | A toybox; fast for testing and replay. | UP9, UP11 |
| WG3b | **Doors only.** Every world is reached in fiction: charts, stations, invitations, summons (AC2, AC10, AC14). | Slower, immersive; access is play. | UP8, UP1 (knowledge as key, AC11) |
| WG3c | **Earned shelf.** Starts appear as you earn them, with silhouettes between (PF6, UG2). | A collection meta-game across lives. | UP15, UP11, UP2 |
| WG3d | **Life-cycle only.** New starts come from deaths, heirs, loops and rebirths (AC3-AC5, MR10). | A roguelite lineage; each start is a consequence. | UP8, UP5 |
| WG3e | **Storyteller deals.** Three sealed envelopes or a keeper's fogged offers (ST12, AC7). | A drafting or tarot feel; choice without spoilers. | UP11, UP9 |

### WG4 Knowledge and research

| Code | Trajectory | Feels like | Leans on |
|---|---|---|---|
| WG4a | **Detective board.** Questions, hypotheses, negative results, convergence (RS1-RS7, HG4). | Deduction games: the notebook is the main screen. | UP1, UP3 |
| WG4b | **Information economy.** Knowledge as stock: sold, traded, stolen, faked (RS28, EP1, SK1, RS35). | A market where what you know has a price and a trail. | UP1, UP8, UP2 |
| WG4c | **Social web.** Facts move by gossip, lies and drift (S DA14, IC6, IC7; OF4). | A village gossip sim where your words come back changed. | UP1, UP3, UP2 |
| WG4d | **Family grimoire.** Papers, letters and annotated books pass down (CL12, RSX11, EW3; the heir's papers already carry). | Knowledge as inheritance; a line gets wiser. | UP8, UP1 |
| WG4e | **Player mastery first.** The codex grows for Weibao; the character catches up through carriers (CL7). | A meta-mastery game where the player is the expert and the body is new. | UP15, UP8 |

### WG5 Social life (dialogue, friends, renown)

| Code | Trajectory | Feels like | Leans on |
|---|---|---|---|
| WG5a | **Town with memory.** Receipts drive greetings, prices and offers (PE5, IX5, S IC10). | A cozy life sim where people remember small things. | UP2, UP4 |
| WG5b | **Intrigue.** Lies, secrets, threats, leverage bonds (S DA3, DA5, DA20; RLX10). | A spy or court game; every word is a risk. | UP1, UP3, UP7 |
| WG5c | **Long friendships.** Friends who wait, write, recur across lives and meet your heir (T RX2, RX6, RX7). | An emotional saga over generations. | UP4, UP8, UP6 |
| WG5d | **Legend builder.** Renown spreads by channel and drifts into story and song (U RN3, RN5, RC2; 06 MC1; World Deeds card). | You become a story other people tell wrong. | UP2, UP3, UP8 |
| WG5e | **Institutions first.** Houses, guilds, garrisons and their rosters (IN1-IN6, CL17). | Organizational life: rank, duty and politics. | UP12, UP5, UP2 |

### WG6 Idle and absence

| Code | Trajectory | Feels like | Leans on |
|---|---|---|---|
| WG6a | **Polite pause.** Strict freeze plus a rich return report (today's code plus SC17). | The world waits; coming back reads like a letter. | UP6, UP8 |
| WG6b | **Estate manager.** A home anchor and appointed helpers work while you are away (MC2, SC15, JN9). | Running a household or workshop from a distance. | UP12, UP6 |
| WG6c | **Lived time.** Offline time ages people and worlds (CLC2, RM7, the lived-time dial). | Bittersweet; absence costs something real. | UP6, UP4 |
| WG6d | **Ripening.** Only slow goods grow offline: trees, brews, answers, incubated ideas (EOX5, RS14). | A cozy garden; stepping away is rewarded gently. | UP6, UP7 |
| WG6e | **Mail-driven.** Absence produces letters, gossip and one hint per report (RD9, SY6, IC14). | Epistolary; the inbox is the idle reward. | UP8, UP2 |

### WG7 Cheats, earned power and features

| Code | Trajectory | Feels like | Leans on |
|---|---|---|---|
| WG7a | **Native ladder first.** Cheats are outliers on a world's own rungs (CA13, EW24, EW31). | Faithful to each source; power reads in the source's terms. | UP14, UP11 |
| WG7b | **Habit-grown.** Repetition sets into a trait (CA12, CAX1, EW14). | Idle-native mastery; the thousandth repair matters. | UP13, UP14 |
| WG7c | **Patron terms.** Grants with contracts and leashes (CA6, CA17, CAX3). | Faustian: every gift has a reader of the fine print. | UP5, UP14 |
| WG7d | **Artifact trail.** Cheats as items found, repaired, inherited and fought over (CA7, CAX8, CL29). | Loot archaeology across lives. | UP8, UP14, UP2 |
| WG7e | **Understood power.** Researching your own cheat raises reliability, not size (JN2, RS37). | You are a scientist of yourself. | UP1, UP14 |
| WG7f | **Features as tools and services.** Panels arrive as maps, library cards, servants, brokers and rituals with dues and loss (V FR2-FR4, FR9, FR13, DP2). | The interface is part of the world's economy; losing a card hurts. | UP11, UP5, UP8 |

### WG8 World production

| Code | Trajectory | Feels like (for Weibao as player) | Leans on |
|---|---|---|---|
| WG8a | **Cards and compiler.** Census, tiers and lints; wide worlds that deepen where touched (part 10). | Many worlds feel full at the edges early. | UP10, UP9 |
| WG8b | **Hand-built vertical slices.** Few worlds, each deep (World1's original method). | A few rich places, long waits between them. | UP10 high floors |
| WG8c | **Play-anchored growth.** Depth follows what he plays (WI12, MC2-3 attention heat, DTX9). | The worlds he lives in get richer; others wait. | UP10, UP2 |
| WG8d | **Cluster engines.** One engine per genre cluster with world skins (WI10; CLI, CLL, CLH, CLC). | Families of worlds that share rules and differ in voice. | UP6, UP9, UP12 |

---

## 4. Deeper angles (DA2)

Ideas that appear only when two or more parts are read together. Each names
the joined rows and the smallest taste.

| Code | Angle | Joins | Why it only shows when read together; smallest taste |
|---|---|---|---|
| DA2-1 | **Your lies seed a copy.** A hearsay copy (PX3) built from what was actually said in this save, so your uncaught lies and the gossip drift about you are true there. | 16 PX3, PX8; S DA3, IC6, IC7; 07 EI7 seeds | Lies stop being a skill check and become worldbuilding you authored by accident. Taste: one MoL tableau where a drifted rumor about you is a posted fact. |
| DA2-2 | **One habit, three readers.** The same practice counter is a friend's recognition key in an AU (RX4), a detector's tell (CLL5, TTKS replacement detection) and a cheat's growth (CA12). | T RX4; 05 CLL5; 04 TT1; 13 CA12; 06 SU3 | The thing that makes you known also makes you caught and makes you strong. Taste: a Village habit (checking exits) that the elder remarks on, a stranger notices and a title reads. |
| DA2-3 | **A warning forks the world.** Warning a canon character (DA15) against a scheduled canon event (EI10) and succeeding creates the AU instance in play, labeled by its cause, so the canon copy stays clean. | S DA15; 07 EI10, EI7; 08 PML-A10; 16 AUX2, WIX3; 11 MR2 | AUs stop being menu picks and become things you did. Taste: in a MoL copy, a warned resident stays home on a dated night; the instance gets a public label "the one where she stayed home". |
| DA2-4 | **Debts cross copies when memories do not.** Counterparts share history only up to the fork (PW5), but an oath scoped to a soul or line (CL14, CAX6) binds both copies' versions of you. | 06 PW5; 17 CL14; 16 CAX6; T RM5; S DA4 | The one thing that reliably crosses a copy is what you owe. Taste: a promise made in one copy shows as "binds your soul" on the copy plan receipt of another. |
| DA2-5 | **The life-end dialog is a start picker.** Each kept row (home, apprentice, papers, debt, standing) is a start line for the heir (EO7), and the same rows viewed by a stranger are an executor start (SXF3). | 17 CL1; 13 EO7; 16 SXF3; 11 MR10, SM2; `src/heir_inheritance.js` | One screen does three jobs, and the built leftovers already list the rows. Taste: "Begin at the Shack" and "Begin with the papers" as two heir starts from one ended life. |
| DA2-6 | **The economy of the dead.** Yearly Village deaths (`src/npc_lives.js:33`) run the same leftover derivation for NPCs, producing estates the player can buy from, claim, execute or grieve over. | T RD15; S DA18; 12 SX5; 16 SXF3; 17 CL11 | Succession becomes a world system, not a player screen. Taste: a villager's death opens a one-season estate sale with the widow as seller and a comfort topic. |
| DA2-7 | **Time arrives by carrier.** Every offline effect reaches the return report through a named carrier: a helper's report, a letter, gossip, a posted notice; one hint per report rides along. | 14 SC17; S IC14, CF9; 13 PF7; 15 SY6; T RD9; 17 rule 5 | Applying rule 5 to time itself makes the idle report consistent and spoiler-safe. Taste: the Village weekly beat delivered as "Iona's patrol notes" instead of a system box. |
| DA2-8 | **People are research subjects.** A person card is a question board: "what does Hessa want?" moves seen to understood; gift sense and good timing are research results; an NPC's lie is a wrong belief about them. | 14 RS1-RS5; T RM3, MF4, MF5; 16 SBX2, SBX6; S DA1 | Friendship and research use one ladder. Taste: asking twice about a tea preference and getting it right writes a bond memory. |
| DA2-9 | **Tier is memory size.** An NPC's tier on the memory facet sets how many receipts they hold and how fast they fade, so proof cost and NPC memory are one knob. | 10 DT9, PE5; 16 DTX4; T RM7; 17 CL13 | Shallow folk forget fast for an in-world reason; people who matter remember. Taste: a T1 stall keeper forgets your haggle by next week; the T3 smith does not. |
| DA2-10 | **A folk song as a divergence meter.** The same song exists in every copy; each copy's verse follows its divergence flags, so a player who knows the song carries a diff tool in their head. | 15 HF3, HG3; 06 PW3, PW4; 07 EI2, EI7; 15 SS4, SS5 for sealed variants | Tells, hints and copy comparison become one carrier. Taste: two Village copies where one verse names the mill differently. Sealed variants follow SS4 and SS5 per-candidate pools. |
| DA2-11 | **Sandbox is a copy with a test label.** The sandbox (KA2) reuses copy provenance (PW1), the seal lint (EI11) and slot trees (MR5), so testing gets no separate code path. | 11 KA2, UG10, UG11, MR1, MR5; 06 PW1; 07 EI11; 16 PX11 | One machinery for play, test and AU. Taste: "Branch to sandbox from here" makes a stamped slot that writes no profile. |
| DA2-12 | **Panel values are beliefs.** Every number a panel shows (odds, a map, a price trend, a schedule) is a UP1 belief with a stage and a basis: your observation, a broker's sale, a system's word. Panels can then be wrong in honest ways, go stale with an "as of" mark, be gossiped, sold or forged. | V DP7, FR9, DL5; 14 RS3, RS5; 18 PA14, PN5; S DA14; 15 EP1 | Joins V's features to the knowledge ladder, so a bought map is a bought belief and a rival's odds can beat yours. Taste: the combat odds line (PA14) shows "your guess, 6 fights seen" and sharpens with more fights. |
| DA2-13 | **Favors are the cross-world currency.** Coins convert at a bad rate between worlds (shards), but a favor owed by a person converts at par because it travels with them (RX1). | 16 shards; S DA22, DA23; T RD1, RX1; 06 MC6; 12 SX6 | Gives friends a hard economic role late in the game. Taste: a friend who followed you from home settles a Cyoria debt in labor. |
| DA2-14 | **Your joke makes your counterpart famous.** A joke you tell (EP6) spreads by gossip (DA14), crosses with a traveler at carrier speed (MC1), and in a copy your counterpart gets the credit (RLX2). | 15 EP6; S DA7, DA14, IC9; 06 MC1, PW5; 16 RLX2; U RN4, RN12, RC4 | Hints, gossip, renown and copies form one loop that produces a story by itself. Taste: a line in a copy's tavern credits "the other you" with the joke. |
| DA2-15 | **The heir hears what the parent could not.** Hints gated by body or skill (EP4, HG13) re-read differently in an heir with another body, so a lineage solves mysteries by changing observers. | 15 EP4, EP7, HG13; 17 CL3; T RX7 | Turns heir variety into investigation. Taste: the parent's inherited paper carries a joke the heir's sharper Perception flags as odd. |
| DA2-16 | **Rumors write obligations.** An inflated rumor (S IC7) sets an expectation in its audience (U RN11), stored as an obligation nobody signed (UP5); failing it costs standing, and the heir inherits it with the name (U RC5). | S IC7; U RN4, RN11, RC5; 17 CL14; T RM5 | Gossip, renown and succession meet in one row the player can see and choose to break. Taste: "the one who never refuses a fight" appears on the promise list with "set by rumor" as its source. |

---

## 5. Duplicates and contradictions (DC2)

| Code | Rows | Kind | Proposed reconciliation |
|---|---|---|---|
| DC2-1 | Overview "heir path built but unwired"; 07 grounding and RF8 step 1; 11 X8, KA1, MR10; 13 "button still reads fresh body, one lesson"; 17 RT1, RT4; overview B6 | Stale against live code | Commit `643b7f1b` wired the heir and scrubbed one-lesson; old heirs read as "begun under the earlier one-lesson rule" (`src/chronicle_ui.js:89`). Mark these rows landed with the lane's own evidence, pending Weibao's play acceptance. RT2 (state rebuilt) and RT3 (fixed name and world) stay open. |
| DC2-2 | Overview B9; 17 CL1 and suggestion 2 (read-only life-end manifest) | Mostly superseded | The ended-life dialog now lists leftovers (`heirLeftoverLines`). Rewrite B9 as "add Lost rows for what does not carry yet" (ties, promises, world facts, MoL and Paradise state), still derived and zero save. |
| DC2-3 | Overview B1; 14 suggestion 1; S SG1 | Duplicate | One slice: show basis and a certainty word on notebook and people lines. Part 14 owns it; S cites it. |
| DC2-4 | 06 PW7, SG3; 07 RF11, EI9; 08 AK7; 12 SX3 | Duplicate | One optional `instanceId`/`continuityId` and confidence on the basis (UP1). EI9 owns the migration. |
| DC2-5 | 08 AK1-AK7 and 09 QK1-QK12 | Duplicate kit, two names | AK2 = QK1, AK3 = QK4 plus QK5, AK6 = QK10, AK7 near QK11. Keep AK codes as canonical; QK rows become per-book uses that cite AK. Part 09 already asks for this. |
| DC2-6 | 11 KA2, UG10, UG11, AC13, OS4, OS6; 15 SY10; 16 DTX9; 11 X9 Proving Ground dev face; V T3, DL8 | Duplicate | One sandbox slice with a seal guard and seeded open; the hint gallery and "tell me more" marks are features of it (DA2-11). |
| DC2-7 | 11 KA3, KA4, SM2; 07 EI4, BO6, RF5; 06 SG2, ST12; 17 RT17; overview B5 | Duplicate in phases | One picker owner. Phase 1 KA3 (pick instead of roll, one receipt field); phase 2 KA4 (doors listed with public labels); phase 3 era grouping (EI4). |
| DC2-8 | 13 suggestion 1; 17 RT9; overview B7 | Duplicate | One additive change: new origins plus `carrier` and `scope` fields (UP14), released with one forward-only note. |
| DC2-9 | 13 suggestion 4 and EO1; 11 KA5; 17 RT12, L4 | Duplicate | One profile store (UP15), gated on NW1 and NW2. |
| DC2-10 | 13 suggestion 3 (`expansion.lineage.earned`); 17 L2 lineage and RT18; `src/heir_inheritance.js` schema 1 | Overlap with built code | Put a lineage earned list beside the heir leftovers schema rather than a separate block; `life_record` stays the lossy biography (RT18). |
| DC2-11 | 14 SC5, SC17 and suggestion 3; overview B2; S IC14, CF9; 13 PF7; 15 SY6, SY7 | Duplicate | One return report with three blocks and a social block, delivered by carriers (DA2-7). |
| DC2-12 | 10 PE5, IX5, IN6; 07 RF12; 16 SCX3, EOX4; S X8 use | Duplicate | One receipt primitive (UP2). IX5 (standing read from receipts) goes first because it avoids new reputation regions; RT11's hidden bucket is the safety net. |
| DC2-13 | S SG2, IC5, DA4; T RM5; 17 CL14; 06 ST10 | Duplicate | One obligation ledger (UP5), first as a read-only view of existing elder, promise and favor state. |
| DC2-14 | 13 CA12; 16 CAX1; 14 SB12; 13 EW14, EW21, EW27; 18 PA1; V T5, FR12; U SU4 | Duplicate | One practice counter (UP13) read by titles, quiet skills and habit cheats. |
| DC2-15 | 06 SU6, SG4; 07 RF15 | Duplicate | One two-age bio line. |
| DC2-16 | 07 RF1, BO1; 17 RT8; overview B8; V6 rows in 01-05 | Duplicate in sizes | B8 (palette ID from the world definition, warm and cool fallback) is the floor; BO1's Cyoria set is its first value. |
| DC2-17 | 07 BO1 "rain-shield icon when it rains (native rain)" in Cyoria; 07 grounding "other worlds have no calendar or weather" | Contradiction | Cyoria has no weather model in code. BO1's rain glyph waits for RF6 per-world weather or reads the home weather only while at home. The first arc avoids it (AR5). |
| DC2-18 | 09 QLM-AC2 "cover job runs while the game is closed"; 05 CLC1 seclusion offline; 16 EOX5; V DL7 "modest after BO10" against 07 "closed-browser time grants nothing" and RF7 "closed-browser time stays out of scope unless Weibao asks" against the RULES idle table (current activity continues offline, absent worlds frozen) | Contradiction, three ways | The RULES table is labeled a proposal inside RULES_FROM_SCRATCH; check its status with Weibao's record before building. Until then: code grants nothing offline (fact), RF7's line is a caution, and rows that assume offline income read as "under the RULES idle default once built" (TN2). |
| DC2-19 | 16 suggestion 1 PX2 "cheapest copy" against 07 BO10 (copies need instancing) | Apparent contradiction | Build PX2 as a site condition inside one instance (10 LC5 changed place), not a second instance; it needs no BO10. |
| DC2-20 | T X13 name reuse (Lio, Neri, Iona in two owners each) against S DW37 and 17 CL16 "Continue as Iona" | Contradiction in content | Decide same-or-different before CL16 or DW37 build on Iona. A display suffix is free; a merge touches saved IDs. |
| DC2-21 | T X12 rebirth wipes ties; heir rebuild drops ties; against the accepted heir rule's "people" and T RX7 | Gap against an accepted rule | The next G5 step is a people row on the leftovers (who remembers the parent, at what warmth), carried as a passed-on tie (RLX11), not a copied relationship. |
| DC2-22 | 15 HG5 hints before the world exists against 11 AC1 and SM5 (unvisited world names hidden) | Tension | Hint text names a surface, not the world (SS6 already shows place and speaker only); the retroactive link names the world after arrival. |
| DC2-23 | T "confide", "tease" against S verb names (confess DA8, joke DA7, keep a secret DA21) | Naming drift | Alias in S: confide = entrust a secret (DA21 from the other side); tease = joke with a sore-spot tone (DA7 plus CF13 tone). |
| DC2-24 | 13 EO17 import merges profile by union against 17 NW2 (rule 9 reload duplication) | Tension | Union is harmless for receipts with no gameplay effect (codex, trophies) and for earned starts that grant a different life (EO13). Anything that grants power on union waits for NW2. |
| DC2-25 | U X10: causal story actors use lowercase `village: 0` (`src/causal_story_actors.js:40-42`) while the hero uses `Village` (`src/models/hero.js:31-35`) | Contradiction in code | One region key spelling before any renown or IX5 slice reads both; a display alias is free, a saved-key change needs a migration decision. |
| DC2-26 | U X6: negative reputation raises trader margin with no floor (`src/components/trader_component.js:143`) | Latent risk | No authored source writes negative reputation today (U). Add a floor before the first infamy source, as U already advises. |
| DC2-27 | U RN13, SU2; T UF3; 14 SB1; S CF14 | Duplicate pattern | "Words by default, numbers on toggle" appears for renown, regard, quiet skills and social VFX. One display dial (TN9) serves all four. |
| DC2-28 | 18 PA13 pause after this fight; V LN3 global pause, X13 | Duplicate in sizes | PA13 is the first, smallest case of LN3; build it so a global pause can reuse the same stop hook. |
| DC2-29 | V FR1 skill-opened features; 14 SB6; 13 EO14 | Duplicate | One rule: a feature or verb can open at a skill or knowledge step, using `discovered()` facts (V X1) and skill thresholds (V X2). |

---

## 6. One coherent first arc (AR)

**"A Village life that hands something on."** One connected arc on the home
Village and the built Cyoria door, using the cheapest builds from the index (A1,
B1, B2, B4, B8, the heir now built under B6) and suggestions from parts 14, 15,
17, S and T. It shows nine primitives working together: UP1, UP2, UP3, UP4,
UP5, UP8, UP11, UP12, UP13. Target viewport: desktop at 1366x768, 1440x900 and
1920x1080; mobile deferred. Each slice needs a rebuild and a fresh-origin
browser pass at those sizes, plus save, reload and literal-file import where
the save column is not "none". Every acceptance line is specified, not run.

| Slice | What Weibao plays | Builds from | Primitives | Files and owner (check live ownership first) | Save impact |
|---|---|---|---|---|---|
| AR1 | **Who told me.** Notebook and people-card knowledge lines show their source and a certainty word: "heard from the elder, think", "your own inference", "checked". | B1; 14 suggestion 1; S SG1 | UP1, UP3 | `src/people_knowledge.js`, `src/adventure_notebook.js` view; wiring through the R15 root if it touches `main.js` | None; derived from stored `basis`. |
| AR2 | **People and promises.** The people card labels memory direction ("you", "they"), shows words instead of numbers ("warm", "owes you"), and a read-only promise list shows the elder's archive duty, the promise visitor and the recruit's favor. Lio offers one extra brace lesson once his trust reaches a threshold. Optional add: the reputation tab shows words for zero and negative standing too (U SU2), once the `display.js` writer is coordinated. | T suggestions 1-3; S SG2; U SU2; 13 PF1 | UP4, UP5, UP2 | `src/people_knowledge.js`, `src/people_ui.js`, a new view module for the ledger; `src/party_content.js` for the trust gate (content owner) | None; the gate reads the existing `relationship.trust` fact, the ledger is derived. |
| AR3 | **The week has a shape.** The watch log wording sharpens as practice grows; the recruit remarks once when her practice completes; a weekly line reads shifts, returns, debt, her solo patrols and favors, written as "Iona's patrol notes". | B2; 14 suggestions 2-3; DA2-7 | UP12, UP13, UP8 | `src/village_career.js` view paths and the log call (`src/display.js:770` voice class) | None if derived on view; a `lastBeat` marker would use the existing `migrateVillageCareer` path. |
| AR4 | **Jokes that might mean something.** Three Village joke-hints and two honest red herrings, spoken by the elder and villagers. One elder joke about "people who pay to keep the rain off their heads" points at Cyoria (public MOL25 texture, no sealed content). Sighted hints that pass a Perception check appear as unnamed "odd" notebook entries. | B4; 15 OA1, OA2, PW2-37 | UP1, UP11, UP2, UP3 | Static hint cards in a new data module; sighting set beside the notebook; lints SS1 and SS7 | OA1 none. OA2 adds one optional per-life set of seen hint IDs, migration defaults empty; needs save, reload and import. |
| AR5 | **Crossing and the click.** Reading the elder's chart and entering Cyoria (existing door, `src/book_world_mol_host.js:30-33`) shifts the frame to a Cyoria palette with warm and cool as fallback, and on first arrival the notebook links the elder's joke: the old line is re-quoted in the Village tint with "heard in the Village on day N, from the elder". Run the deferred native Cyoria journeys (PML1) in the same pass as verification. | B8; 17 RT8; 15 OA3, SY4, SY5; A1 | UP11, UP1, UP8 | `src/workspace_views.js:44-45` palette read, `styles/workspace.css` tokens; link derived from sightings plus visited worlds | None; palette and link are derived. PML1 is verification only. |
| AR6 | **What this life leaves.** At life end, the built leftovers dialog gains "Lost" rows for what does not carry yet (people ties, open promises, odd notebook entries) and lets the player name the heir; the heir milestone takes the ended actor's world; earlier graves stay in a list. | Built heir (`643b7f1b`); 17 RT3, CL1; DC2-2 | UP8, UP5, UP4 | Hand to R15-G5 (`src/heir_inheritance.js`, `src/life_experience_host.js`, `src/chronicle_ui.js`); no second writer | Heir save is new; `graves[]` as a versioned read of `inheritedFrom`; needs save, reload and import with old-rule and new-rule heir fixtures. |
| AR7 | **The parent's papers speak.** Inherited papers write notebook entries with a `record` basis attributed to the parent, so AR1 shows "written by <parent>"; if the parent had sighted the elder's joke, the paper carries that line, and the heir's own Perception can flag it again (DA2-15). The heir's first log line names what the Village called the parent, from the parent's highest title (U SU5). | 17 RT15, CL12; 15 EP7; U SU5; DA2-15 | UP1, UP8, UP11 | R15-G5 for the heir copy; basis kinds in the knowledge owner | Additive basis strings; the sighting copy reuses AR4's field through the heir builder; the nickname is one optional leftovers field defaulting to absent. Needs save, reload and import. |

**Why this order.** AR1 to AR3 are view-only and make existing state legible,
which every later slice reads. AR4 is the first save change and the smallest
one. AR5 pays off AR4 across a real boundary using a door that already runs.
AR6 and AR7 close the loop through the heir that G5 just built, so the arc ends
where Weibao's carryover question started.

**Deferred scope.** D&D, HP and the TTKS packs (A4 to A6), parallel copies and
runtime instancing (BO10), the profile store and its NW questions, renown and
per-world renown keys (wait for RT11, U), V's feature home table and assist settings (V T1, T2), mobile layouts. A Soldier's Life stays
paused. Next natural slice after AR7: A2 Taiven as rival with a scheduled turn
(16 RLX4), which adds UP7 and UP9 on the same Cyoria door.

**Remaining gate.** Each slice counts as playable after its rebuilt
fresh-origin desktop pass; fiction, feel and balance stay Weibao's acceptance.

---

Rows: UP 15, TN 17, WG 8 directions with 40 trajectories, DA2 16, DC2 29, AR 7.
Sealed IDs touched: none. The rule SS4 and SS5 are cited for sealed variants
without naming any slot.
