# Combat and conflict: considerations, 2026-10-18

Claude, 2026-10-18. A palette, not a spec. Nothing here is selected for a build.

Weibao (2026-10-17), after a survey of systems that crafting leans on but that
lack a rulebook, accepted a topic-expansion-audit round per gap; this is G2,
combat and conflict. G1 was [body and health](BODY_AND_HEALTH_CONSIDERATIONS_2026-10-17.md).

Rules applied: AD8 (opponent numbers are learned), AD19 (forgiving recovery),
AD20 (locally unwinnable situations), AD21 (difficulty changes explained), AD25
(cause-driven threats), AD28 (beaten obstacles stay beaten), AD38 (things work by
how they work), BHR1–BHR30 (proposed body rules), MR1–MR36 for anything made, and
AR1–AR16 for any seam. Rows marked MEMORY are recalled facts about games or
franchises awaiting a source check. No sealed secret is referenced. The proposed
rulebook distilled from this palette is [COMBAT_RULES](COMBAT_RULES.md)
(CBR1–CBR30).

## What already exists (read, not restated)

| Owner | Covers |
|---|---|
| [W2 laws, power core and combat grammar](worlds/world-core-kit-2026-10-14/W2_LAWS_POWER_COMBAT.md) | Per-world combat grammar (K10 rows), defeat defaults, threat rosters for HP, D&D, TTKS 1–5, MoL, LotM, CoI, Shadow Slave, JJK, Bleach, Fate, HxH, FMA, Naruto and more. K10 grammars are marked INFERRED by their author |
| [Encounters and pursuit](ENCOUNTERS_AND_PURSUIT.md) | Trigger, locator, access, contact and persistence split; four implemented nonlethal proofs; unbuilt persistence (wounds, grudges, debts, captives, recurring opponents) |
| [Battle Brothers audit](research/battle-brothers/REPORT.md) and its packets P1–P8 | Wounds, pay and food change people; separate harshness settings; useful work during recovery (P5); observed enemy methods (P7) |
| [Body and health rules](BODY_AND_HEALTH_RULES.md) and [palette](BODY_AND_HEALTH_CONSIDERATIONS_2026-10-17.md) | BHR11 disclose before lasting harm, BHR13 injury degrades control before removing a verb, BHR15 lasting injury from defeat is a setting, BHR17 unconscious, critical and dead are different, BHR18 lethal transitions wait while away, BHC31 shared defeat publisher, BHL7 first injury-on-defeat slice |
| [Tools and instruments](TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md) | Weapons as instruments: TQ1 three roles, TQ3 control not truth, TQ5 fit, TQ7 improvisation, TQ9 wear, TQ74 existing opt-in combat durability, IP2 wear from work, TQ141 wounded living tools, WX1–WX14 world weapon rows |
| [Weaponcraft, runes and inscription](WEAPONCRAFT_RUNES_AND_INSCRIPTION_CONSIDERATIONS_2026-10-14.md) (canonical of four weaponcraft palettes) | Weapons as made things, inscription, weapons with wills |
| [Direction synthesis OD12](DIRECTION_SYNTHESIS.md#od12-forgiving-recovery-direction-2026-10-15) and PROJECT "Defeat" decision | Defeat versus true death versus run progression vocabulary; native defeat stays unconsciousness |
| [Means and appraisal](MEANS_AND_APPRAISAL.md), [hidden strength and threat estimates](CHARACTERS_AND_WORLD_EVENTS.md#hidden-strength-combat-profiles-and-threat-estimates-2026-10-02) | What each side can know; local ranks versus matchup estimates |
| [RNG, encounters and source development](RNG_ENCOUNTERS_AND_SOURCE_DEVELOPMENT.md) | Enemy "systems": difficulty from mechanics and counters, not just numbers |
| [Rivals, identities and fate](RIVALS_IDENTITIES_AND_FATE.md), [enemy protagonists](ENEMY_PROTAGONISTS.md) | Cause-driven threats in detail, protagonists protected by fate rather than invulnerability, independent enemy arcs |
| [Nonhuman monster side](worlds/NONHUMAN_MONSTER_SIDE_2026-10-14.md) MF4 | Surrender, capture and live-body harvesting need explicit outcomes |
| War fits in `docs/research/warsim/` and `docs/research/hearts-of-iron-iv/` | Province-scale war, mostly for the separate province-war repo |
| Lanes this run (returned, folded below) | [C1 owner map and engine fit](gm/dispatch/combat-2026-10-18/C1_OWNERS_AND_ENGINE.md) (32 owners, 21 seams, 8 cheapest steps), [C2 references and worlds](gm/dispatch/combat-2026-10-18/C2_REFERENCES_AND_WORLDS.md) (14 games, about 30 world rows, angles CA1–CA15) |

**Weibao's own words** that set the bar (C1-U1 to U12): enemy systems should make
difficulty "not just numbers but also mechanics and special interactions";
automated gathering "with chance of big monster"; attacking a village chief who
turns out secretly powerful; protagonists hard to defeat through fate, not
scripts; final enemies that make lore sense; forgiving recovery with world danger
separate; threats that grow through their own causes; opponent numbers learned by
fighting or identify skills; full individual displays for several opponents.

**The gap.** Combat has the most code of any system and no rulebook. About 32
owners each hold a piece. Four things are missing across all of them: one outcome
model for how fights end (today only "unconsciousness" exists, through six
separate code paths), weapons and bodies feeding the same control numbers the
tools and body palettes use, a way to leave or settle a fight that is not free
walking away or death, and conflict that is not violence. Round 1 covers those.

## Corrections first

| Code | What was wrong | Fix |
|---|---|---|
| CBX1 | BHC31 counts three defeat routes. Code has at least six: three `kill_player` branches plus the Mara road duel (`src/native_battle.js`), the Lio party battle (`src/party_battle.js`) and the sluice battle (`src/feature_expansion_battle.js`), which end as won, lost, objective, escaped, withdrawn or yielded without calling `kill_player` (C1-X3, SHOWN) | A shared defeat publisher covers all six, or BHL7 states it is native-only. CBC1 below takes the first |
| CBX2 | The faint-departure branch is the normal native combat defeat, not an edge case: every native exchange runs through `runP23CombatExchange`, which sets `nativeLivingStrike` (C1-X4, INFERRED from code) | Any defeat hook must land in that branch first |
| CBX3 | AD8 (accepted 2026-10-16) says first sight shows impressions and `???`; the opponent projection still shows full stats as "native-legacy" (`src/combat_opponents_domain.js:5`, C1-X1, SHOWN) | Known runtime debt, not a design question. CBL5 migrates it |
| CBX4 | W2 world cards default defeat to injury, lost access or capture; AD19 says native defeat is unconsciousness; BHR15 makes lasting injury a setting (C1-X2) | Reconciled by AD19's split: a world's danger profile decides what a defeat can cost, the player's recovery setting decides how much of that lands, and a harsher world forewarns at entry. CBR6 records this |
| CBX5 | `total_deaths` increments on every unconsciousness (`src/main.js:4911`) | Any publisher adds its own defeat counter by outcome; the old counter stays for save compatibility (BHR17) |

## Round 1, 2026-10-18

### CBC-A. How fights end

| Code | Consideration | Default, dial and reason |
|---|---|---|
| CBC1 | **One defeat publisher with typed outcomes.** `stageP23Defeat` already writes `{kind:'unconsciousness', cause:'unknown'}` (C1-E12) | Default: every fight path calls one publisher with `{actor, outcome, cause, opponents, place}`; outcomes are unconscious, knocked out, yielded, routed, captured, withdrew, escaped and (where the world and mode allow) killed. Dial: worlds add outcomes (sealed, possessed, dissolved contract). Reason: body settings, memory, law and story all need to know how a fight ended, not just that it did |
| CBC2 | **Outcome and cause are separate fields.** A faint from blood loss and a faint from a sleep spell are both "unconscious" with different causes | Default: cause names the actual mechanism (BHR10). Reason: injury-on-defeat, testimony and later revenge read the cause, not the outcome |
| CBC3 | **Winning has outcomes too.** Today a win means kill, loot and next wave | Default: the victor's outcomes mirror the loser's: killed, knocked out, let go, accepted surrender, captured, drove off. Dial: monsters that cannot surrender, or that flee by instinct. Reason: MF4 (no pelt from a living neighbor) and captives (CBC31) need it |
| CBC4 | **Downed is a window, not a verdict** (BHR17, RimWorld and Kenshi MEMORY) | Default: a downed actor waits a short window in which allies, enemies or bystanders decide the outcome. Dial: window length by world lethality. Reason: rescue, robbery and capture happen in that window |
| CBC5 | **What the winner does with a downed player is the winner's choice, by means and motive** (AD6, AD25) | Default: a beast eats, a bandit robs, a guard arrests, a rival humiliates, a duelist walks away. Forgiving recovery (AD19) sets the floor: unless the world is forewarned as harsh, the result is recoverable. Reason: defeat reads as the world reacting, not as a generic penalty |
| CBC6 | **Protagonists survive by fate, not invulnerability** (Weibao, USER_VISION "player actions change the story") | Default: a fated character's defeat routes to escape, rescue or capture through an in-world agent; severing fate removes that. Reason: his words; keeps fights against them real |
| CBC7 | **Endless waves are a choice of place** | Default: a hostile zone respawns because something keeps coming (a den, a breach, a road). Clearing the cause can stop it (AD28). Dial: zones with no stated source keep today's behavior until authored. Reason: AD25 cause-driven threats |

### CBC-B. Weapons are instruments

| Code | Consideration | Default, dial and reason |
|---|---|---|
| CBC8 | **A weapon enables combat verbs with control numbers,** same shape as tool profiles (TQ1, IP1) | Default: cut, thrust, crush, block, parry, disarm, reach and draw speed, each with control fields; damage reads the verb's number. Reason: one instrument contract for picks and swords |
| CBC9 | **Wear from what actually happened** (TQ9, IP2) | Default: landed hits, blocks and parries wear the weapon and shield; misses wear little; a hit on hard armor wears more. Today only landed hits wear (TQ74). Dial: rate by material and world. Reason: combat feeds smiths and repair |
| CBC10 | **Broken means broken, stated per instrument** | Default: at zero condition an instrument declares what happens: still works badly (today's 10% floor), breaks, or stops the routine with a log line and offers the improvised fallback (TQ7). Reason: silent 10% swings read as a bug |
| CBC11 | **Improvised weapons work by how they work** (AD38) | Default: a chair, a hammer, a pot of oil or a torch works as the mechanism it is, with worse control and a chance to break. Reason: AD38; no permission list of weapon categories |
| CBC12 | **Fit and familiarity apply to weapons** (TQ5) | Default: a weapon used for months fits its owner; a picked-up enemy blade works at base. Reason: gives a favorite weapon a mechanical reason |
| CBC13 | **Living and bonded weapons are wounded, not worn** (TQ141, WX1) | Default: a bonded weapon's damage is a condition on that being, healed by its own repair kind (BHR4). Reason: a Zanpakutō is not sharpened |
| CBC14 | **Weapon power belongs to the weapon's carrier** (TQ1, GHS86) | Default: an enchantment or contained power acts by its own law; a borrowed weapon does not pass its former owner's power unless the world says so. Reason: one authority per fact |

### CBC-C. Bodies in a fight

| Code | Consideration | Default, dial and reason |
|---|---|---|
| CBC15 | **Injury lowers the same control numbers a worse weapon lowers** (BHR13) | Default: a cut arm reduces cut and parry control before it blocks the verb. Reason: one control model; injuries legible in the same preview |
| CBC16 | **Hits land somewhere, when the world's depth wants it** | Default: native combat stays abstract HP plus a "where" tag only when a lasting-injury setting is on. Dial: body-part depth per world and per difficulty (DF depth, MEMORY). Reason: depth chosen per activity (MR, CX) |
| CBC17 | **Disclose lasting risk before the fight** (BHR11) | Default: when an encounter can leave lasting harm under the current settings, the engage prompt names it with a retreat route. Reason: the first lost limb should not be the warning |
| CBC18 | **Strain, fear and morale are a second track** (CA7) | Default: off for the solo player at first; on for companions and humanlike enemies, who can flee, freeze or yield before HP ends. Dial: strong in horror worlds, absent for constructs. Reason: most real fights end when someone breaks |
| CBC19 | **Stamina and fatigue are body facts** (BHR29) | Default: today's stamina cost per attack stays; long fights add fatigue that carries briefly into work. Reason: a long fight should be felt in the afternoon's mining |

### CBC-D. Knowing the opponent

| Code | Consideration | Default, dial and reason |
|---|---|---|
| CBC20 | **Opponent facts are learned per kind and per individual** (AD8) | Default: first sight shows impressions; each fight, book, teacher or identify means fills fields with source and confidence; opponent 2 of a kind may differ. Reason: AD8 and Weibao's 2026-10-15 readability rounds |
| CBC21 | **Intent is a learned field** | Default: an opponent's next action shows only once fights or means support it (visible intent like Slay the Spire is a reward, MEMORY). Reason: his "intent is usually unknowable without experience" |
| CBC22 | **Fights are evidence for both sides** | Default: an enemy that survives learns your methods and tells others where it has a way to. Reason: AD6 both ways; gives fleeing enemies a cost |
| CBC23 | **Deception is a mechanism** | Default: feints, concealment and false strength are actions that write wrong beliefs, not hidden modifiers (Frieren, HxH). Reason: beliefs and truth stay separate (AD7) |

### CBC-E. Idle combat

| Code | Consideration | Default, dial and reason |
|---|---|---|
| CBC24 | **Idle fights run on a policy paid from real stock** (CA3, Melvor STATED) | Default: eat, withdraw and flee thresholds consume owned food and supplies; no stock means the policy withdraws. Reason: idling a fight costs what it burns |
| CBC25 | **Away combat stops before anything lethal or lasting** (BHR18, AD16) | Default: away time runs fights only in zones the player chose, and stops at a downed state, a lasting-harm risk or a new kind of enemy. Dial: harsher setting chosen with forewarning. Reason: nobody returns to a dead character from a closed tab |
| CBC26 | **Active control pays a little more** | Default: manual play may choose better targets or timing; idle play stays the main route. Reason: the game is idle first |
| CBC27 | **Gathering with a chance of a big monster** (Weibao, C1-U3) | Default: work in wild places can be interrupted by an encounter whose source is the place; the routine pauses and the policy decides (fight, flee, hide). Reason: his request; AD25 |

### CBC-F. Leaving and pursuit

| Code | Consideration | Default, dial and reason |
|---|---|---|
| CBC28 | **Leaving a live fight costs something** (C1-E13: walking out is free today) | Default: fleeing takes an escape check against the fastest living enemy; failure gives free exchanges. Dial: comfort setting keeps today's free exit (AD21). Reason: retreat should be a choice with weight |
| CBC29 | **Pursuit follows things that can track** (AD25) | Default: an enemy with a tracking means may open a short pursuit record (`src/pursuit.js` exists); others stop at the edge. Reason: cause-driven, reuses the existing pursuit schema |
| CBC30 | **Breaking off can be offered by either side** | Default: an outmatched or hurt side can offer to stop, pay or leave before or during contact (CA2). Dial: honor cultures, mindless monsters. Reason: most actors prefer not to fight to the end |

### CBC-G. Conflict without killing

| Code | Consideration | Default, dial and reason |
|---|---|---|
| CBC31 | **Captives are people** (CA8, Kenshi STATED) | Default: a captured actor keeps identity and can be released, ransomed, handed to law, recruited or kept, each with social and legal facts. Dial: legality by world. Reason: capture makes the richest follow-ups |
| CBC32 | **Subdue is a stance** (C1-S7) | Default: a subdue stance caps your damage short of killing and resolves the enemy as knocked out or yielded, with less loot and no harvest. Reason: MF4; nonlethal play inside native combat |
| CBC33 | **Killing has law and memory** (CA9) | Default: a killing writes witnessed facts, grudges and legal response; licensed killers and thin-law zones change how much. Reason: a body count is a social event |
| CBC34 | **Social conflict uses the same outcome model** | Default: a debate, negotiation, intimidation or trial ends in the same outcome set (yielded, withdrew, drove off) with its own verbs and stakes (Griftlands, Disco Elysium STATED/MEMORY). Reason: one outcome model; careers that never fight still have conflict |
| CBC35 | **Most conflicts have a nonviolent route** (CA10) | Default: payment, evidence, evacuation, reputation or law can settle a conflict where the opponent's motive allows. Dial: some threats yield only to force or a specific counter. Reason: a smith or clerk life should mature without combat |
| CBC36 | **Sparring and losing teach** (CA12) | Default: sparring trains at low risk; losing real fights grows toughness and opponent knowledge slowly. Reason: nonlethal progression for an idle player |

### CBC-H. Worlds and scale

| Code | Consideration | Default, dial and reason |
|---|---|---|
| CBC37 | **Each world card names its combat grammar, lethality and outs** (W2 K10) | Default: three numbers per world card: how lethal defeat usually is, how available healing is (BHC30), and which nonviolent outs exist. Reason: CBR6 needs them |
| CBC38 | **Off-label techniques work by mechanism** (AD38) | Default: a fire spell lights a barn, a healing art reverses a poison's effect on a weapon, a cooking skill makes a smoke screen, if the mechanisms in play support it. Reason: AD38; no technique category list |
| CBC39 | **Imported power meets local law** (CA15) | Default: a cross-world power works by its own law but draws local enforcement or suppression where the destination has it (WA rules, BHR30 pattern). Reason: being able to win is not permission to fight |
| CBC40 | **War is politics at a larger scale** (CA14) | Default: wars resolve by settlement terms; the player can contribute through logistics, rescue, supply or direct battle where the world supports it. Reason: a life-sim player is often behind the line; province war lives in its own repo |
| CBC41 | **Strength is source-authored** (CA13, AD25) | Default: opponents keep canon or authored strength; places and eras set danger. Event pressure can rise with a real cause. Reason: standing in ENCOUNTERS and world briefs |
| CBC42 | **Party fights share one engine** | Default: party and solo fights use the same strike math (`rollCombatStrike`) and the same outcome publisher; native real-time loops and saved duels converge over time. Reason: two strike engines drift (C1-E5 versus C1-E15) |

## ACT NOW (done this round)

- Saved this palette, the proposed [combat rules](COMBAT_RULES.md) CBR1–CBR30,
  the [core audit](audits/COMBAT_CORE_AUDIT.md) and lanes C1 and C2.
- Registered the rulebook in the RULES_INDEX register and router as a proposal.
- Recorded corrections CBX1–CBX5, including BHC31's undercount, here. The body
  palette is left to its owner; its next round should cite CBX1.

## ACCOUNT FOR NOW

Current work in these areas should respect these constraints even before any
combat build:

- Anything touching defeat lands in the faint-departure branch first (CBX2) and
  adds no new path that bypasses a future publisher.
- Do not reuse `total_deaths` as a death or defeat-outcome count (CBX5).
- New enemy templates name their source (den, road, breach) and whether they can
  yield, flee or track (CBC7, CBC29, CBC30).
- New weapon content uses instrument profiles (IP1) rather than a new stat path.
- New opponent display work moves toward AD8 learned facts, not away (CBX3).

## LATER / DELEGATE

Ranked cheapest first. Each is a proposal; none is selected.

| Code | Step | Level, effort | Done check |
|---|---|---|---|
| CBL1 | Extract `publishDefeat` with typed outcome and cause; call it from the three `kill_player` branches; default outcome unconscious (C1-S1, CBC1) | Medium, S | Behavior identical on a golden fight; the defeat record shows outcome and cause; save, reload and import keep the new counter  **Done 2026-10-19, implemented and browser-verified; not human-accepted.** See CBL1 evidence below |
| CBL2 | Wear on blocks and parries plus a per-instrument broken rule (C1-S3, CBC9, CBC10) | Low, S | Durability off: identical. On: blocks wear the shield, misses barely wear; a weapon at zero follows its declared rule; no save change |
| CBL3 | Route the three saved battles through the publisher (C1-S2, CBX1) | Medium, S–M | The duel, party and sluice battles write the same defeat record; BHL7's injury applies in all six paths when on**Done 2026-10-19 (publication only; BHL7 injury is a later consumer), implemented and browser-verified; not human-accepted.** See CBL3 evidence below |
| CBL4 | Subdue stance and enemy `yields_at` for humanlike templates, through the existing `planDefeat` hook (C1-S7, CBC32) | Medium, M | A Slums thug yields in subdue; no harvest from a yielded enemy; loot reduced; log names the outcome |
| CBL5 | AD8 migration of the opponent display to learned facts per kind (C1-S8, CBC20) | Medium, S–M | First sight shows impressions and `???`; kill count or identify fills fields; rebuilt browser check at 1920×1080 and 1366×768 |
| CBL6 | Flee with an escape check, comfort setting keeping the free exit (C1-S5, CBC28) | Medium, M | Failed flee gives free exchanges; success publishes escaped; the setting restores today's behavior |
| CBL7 | Short pursuit after fleeing a tracker (C1-S6, CBC29) | Low, M | Only templates with a tracking tag open a pursuit record; others end at the edge |
| CBL8 | Idle combat policy with eat and withdraw thresholds paid from stock (CBC24, CBC25) | Medium, M | Away fights consume food; with no food the policy withdraws; away time stops at downed |
| CBL9 | Source check for MEMORY rows (Mount & Blade, Darkest Dungeon, XCOM, Slay the Spire, Griftlands, Idle Clans; native combat in Kenshi, RimWorld and DF; C2 G1–G2) | Cheap reader, S | Each claim relabelled STATED with a locator or dropped |
| CBL10 | Per-world lethality, healing and outs numbers on each W2 card (CBC37) | Cheap writer, S per world | Every active world card names the three numbers |

## Round 2: related outcomes and interrupted work, 2026-10-18

**CBC43.** Reflection, rescue and mutual defeat compose through one transaction/reaction boundary (CBR2/CBR3, AR3, G29). Default: stable resolution and exactly one publication per actual outcome. Dial: the encounter's simultaneous or ordered law. Reason: a listener registering earlier is not an in-world advantage. Withdrawal also settles any interrupted work without refunding already used supplies (G28).

ACT NOW: reconcile the rule owner and repeatable audit routing where one exists.
ACCOUNT FOR NOW: apply this to a selected consumer; it adds no independent store,
clock or generic resolver. LATER: one synthetic composed case at that seam,
strong cross-domain agent, medium effort when selected; done by relevant source
checks and a useful rebuilt desktop journey with current-state persistence.
No runtime change or new implementation priority in this round.

## CBL1 evidence, 2026-10-19

Selected under the 2026-10-19 rulebook acceptance (task A4: highest-ranked
LATER items that fit the milestone). Rules: CBR2, CBR5, CBX2, CBX5, AR1–AR16,
AD36. No player-visible change by design: CBL1's done check asks for identical
behavior; CBL3/CBL4 are the consumers that will show outcomes.

**Change.** New registry domain `src/defeat_domain.js` (slice `defeat`,
`{schema:1, counts:{outcome:n}, last:{outcome, cause:{kind, place, by}}}`).
`publishDefeat` takes one of eight typed outcomes (unconscious, knocked_out,
yielded, routed, captured, withdrew, escaped, killed) and a separate cause; the
cause lists the opponents still standing by their shown names only (AD8).
`src/main.js`, growth 0: one import joined to the registry import line, the
domain added to the native strike transaction's bindings (a rolled-back strike
rolls back its publication), and one call in each of the three combat
`kill_player` branches. The leisure branch publishes inside its
`persistExpansion` write and undoes the record if the write throws.
`total_deaths` is untouched (CBX5); titles still read it.

**Compatibility decision.** Old saves have no slice and load an empty record;
the record is not seeded from `total_deaths`, which keeps the earlier history.
No migration of existing fields.

| Check | Result |
|---|---|
| `node --test tests/defeat_domain.test.js` (new) | 3/3: typed outcome and cause, refusals change nothing, failed durable write and transaction rollback restore the record, slice round trip, old save, seven malformed slices |
| `tests/headless/defeat_journey.test.js` (new) | 1/1: fresh save with no slice, walk to Cave room, beaten; `total_deaths` 1 and the usual log line; record `unconscious` by Wolf rat in Cave room; reload and Export/Import exact |
| Golden fight, same seed, HEAD copy versus HEAD plus this change | Canonical save identical except the new `defeat` key; message log identical; no errors |
| `npm run build && npm test` | build OK; 2246/2246 |
| `node --test tests/headless/*.test.js` | 7/7 |
| `npm run check:arch` | main.js growth 0; 6 main imports; 226 cyclic edges |
| `npm run check:rules` | PASS |
| Browser, fresh origin localhost:19551 (empty storage), 1920×1080, bundle `v0.6-42beae88f170` | Seeded a new hero with Nearby cave open; walked to Cave room; beaten by wolf rats; stored save and projection show the unconscious record; page reload keeps it; Export string taken, a second defeat made it 2, literal Import of the export restored 1; no console errors. Travel used DOM clicks on the exact elements (pointer clicks do not land in the emulated pane, as in M4) |

**Gaps and rule findings (for the conformance scan).**
- CBR2 says all code paths call the publisher. Still outside it: the three saved
  battles (CBL3), the structured-pack terminal death in
  `structured_life_runtime.js` (it raises `total_deaths` directly), and the
  non-combat collapse branch of `kill_player`, which is called every tick while
  health stays at zero and so cannot publish without a once-per-collapse guard.
- AR1 allows one registration line in `main.js` per feature, but `check:arch`
  holds `main.js` at zero growth with no headroom, so features join lines
  instead (this slice and M4 both did). Either the ratchet should grant one line
  per registered domain or AR1's wording should say "zero net growth".

## CBL3 evidence, 2026-10-19

Rules: CBR2, CBR5, CBX5, AR1, AD36. Target: desktop 1920x1080; mobile deferred. The three saved battles
and the structured-pack terminal death now publish through `publishDefeat` ([DRC4, DRC3](audits/DOMAIN_RULES_CONFORMANCE_2026-10-19.md)).

- Each pure battle step stages `plan.defeat` only when the player is the one reduced to 1 HP:
  road duel `src/native_battle.js`, Lio party `src/party_battle.js`, sluice `src/feature_expansion_battle.js`
  (`savedBattleLoss`, outcome unconscious, cause kind combat, `by` = the active opponents, `place` null because a
  saved battle sits in its own session). A win, withdrawal or Lio stepping out stages nothing.
- `persistExpansionPlan` (`src/expansion_persistence.js`) publishes `plan.defeat` inside the durable write: the
  record is in place while the save is built and undone if the write throws. No host or `main.js` change (growth 0).
- Structured pack: `reconcileStructuredLifePlan` stages a `killed` / `harm` record only in the branch that creates
  the `structuredDeath` proof, so it is once per life. `total_deaths` rules are unchanged (CBX5); no save-format
  change (the existing defeat slice validates it).
- Regressions: `frontier_campaign.test.js` (road duel: stage, rollback on quota failure, publish on success,
  withdrawal none), `party_battle.test.js` (party: same), `cooling_refinement.test.js` (sluice: non-fatal blow
  stages none, fatal stages unconscious naming tollkeepers), `structured_life_runtime.test.js` (killed once).
- Gates: `npm run build && npm test` 2254 pass; `node --test tests/headless/*.test.js` 8 pass; `check:arch`
  main.js growth 0; `check:rules` pass.
- Browser (rebuilt bundle, fresh origin `127.0.0.1:18741`, 1920x1080, generated fixture with the Lio party battle
  open and the player at low HP): the native timers played the duel to a `lost` result; the saved `defeat` slice
  read `{unconscious: 1}`, last cause combat by Mara, and was identical after reload. A same-fixture run with more
  HP resolved `won` with an empty slice. Sluice and structured death are covered by the unit regressions only
  (implemented-unverified in the browser).
- Not done: BHL7 injury consumer, per-battle outcomes other than unconscious (yield, escape), a CBL4 display.

## Round 3, 2026-10-30: damage and protection types, and skills worth borrowing

Asked by Weibao: absorb the good ideas from the two sibling forks and the checker, by implementing damage types
and protection types and more, with the skills as long-term inspiration. Proposals below stay proposals (AD32);
numbers marked proposal are agent-authored. Rules: AR3, AR9, AD5, AD38, CX2, CX8, CBR11.

### SHOWN (code read before building)

- `src/effect_dsl.js` already carried the 13 SRD damage types and a `resistance` op, but native combat used none of it. Every
  native hit was untyped "physical" text; `takeDamage` in `person.js` and `enemies.js` carried a TODO for damage types.
- `src/absorb_e3/elemental_affinities.js` (off by default) adds flat defense against air, earth and water attacks from worn gear. It
  stays; the new scalar applies after it (module header of `src/damage_types.js` lists the layer order).
- `combat.js` has a second, older type guess for harvest records (hammer is `blunt`, else `cut`). Left alone; a later pass can read
  `attackMix` instead (AR3).

### ACT NOW (done 2026-10-30, agent-verified at source level)

- **CBD1. Typed attack, typed protection.** `src/damage_types.js` (new, leaf): an attack is a weight mix over the SRD types plus an
  untyped `physical` bucket; a defender has per-type multipliers (above 1 weak, below 1 resists). Hit damage after the flat defense and
  chip floor is multiplied by the mix-weighted multiplier, one scalar through `mitigateCombatDamageFromStats(..., typeMultiplier)`.
  Default: undeclared attackers are all `physical` and undeclared defenders are 1, so existing content, saves and the three saved-battle
  engines behave as before. Dials: `PROTECTION_CAP` .5 and `WEAKNESS_CAP` 3 (reason: stacking pieces must not erase a type).
- **CBD2. Sources of the mix.** Enemy data: `attack_types`, `defense_types`. The hero: weapon family (sword slashing/piercing,
  axe slashing/bludgeoning, dagger piercing/slashing, spear piercing, hammer bludgeoning, unarmed bludgeoning; all proposal values).
  Worn armor: per-piece protection from the item's `protection_types` or, today, from its material name (chainmail, shell, alligator,
  hide, pelt, leather; proposal values), summed over worn slots.
- **CBD3. Shown.** The hit line names the type and, when the target's protection moved the hit by 5% or more, says "resisted", "weak
  spot" or "no effect". Enemy cards show the attack type and a tooltip with the defense multipliers (the Opponent card in `village_workspace.js` shows it on the Atk row; the Reports compact line carries type and note, 2026-10-30).
- **CBD4. Reward-key check.** `tests/reward_keys.test.js` walks every native location, dialogue and quest reward and fails on a key that
  `process_rewards` does not read (idea from Kuroiteiken/yairp). It found no real mistakes in current content.

### ACCOUNT FOR NOW

- Declared enemies today: wolf rats and wolves, boar, forest bear, red ants (acid share), river and stone crab, alligator, snapping
  turtle, suspicious wall. Every new enemy template states `attack_types` and, if armored, `defense_types` (CBR11, CBC7).
- Weapon and armor content declares `protection_types` directly instead of extending the name table (CX3: rules over pairs).

### LATER / DELEGATE (long-term palette; none selected, reopen triggers stated per CX8)

| Code | Idea | Level, effort | Done check and reopen trigger |
|---|---|---|---|
| CBD5 | **Unreachable-content check** (Kuroiteiken): a test that walks locations, quests, recipes and items and names any that no earned route reaches | Medium, S–M | Reports zero or a named allow list. Reopen when a content wave adds a gate |
| CBD6 | **Failure expert, auto-return** (SchokoKaramel): after fainting and fully resting, return to the combat zone on its own; a manual bed does not trigger it. Fits the idle-combat policy in CBL8 and the recovery setting in CBR6 | Medium, M | Off by default; a trained skill or setting turns it on; a fresh-life journey faints, rests, returns once. Reopen with CBL8 |
| CBD7 | **Skill palette from SchokoKaramel**: Cultivation (global XP multiplier trained by an activity), Gather efficiency (random extra yield), Gather speed (about -10% gather time per level), Lucky loot (drop chance x(1+.2 per level), XP when loot drops), Efficient training (training XP x(1+.1 per level)). Treat as a menu of ordinary-skills-stay-useful candidates (PROJECT.md vision), each a multiplier on an existing consumer | Low–Medium, S each | Each names its consumer, its trained-by activity and a cap or diminishing dial before it is built. Reopen when a skill-density pass starts |
| CBD8 | **Shield versus evasion.** Today `combat.js` rolls a block instead of an evade when a shield is held, so a weak shield can be worse than none. Typed protection does not resolve it: this is avoid versus mitigate. Default proposal: a failed block gets the evade roll at a penalty, and a shield's block chance never falls below the evade chance it replaced. Not built because it shifts balance for existing saves | Medium, S | Golden fight: shield-with-low-block is not worse than none; undo path via a setting. Reopen when combat balance is next tuned |
| CBD9 | Heavier type use: elements and magic (fire, cold, poison) on enemies and spells, immunities and per-world vocabularies (a world may drop or rename types, AD46), resistance skills trained by being hit (the TODO in `takeDamage`), armor piercing as a type-specific share, a block that stops only some types | Medium–High, M | Reopen when a book world needs an element or a ward |
| CBD10 | **Done 2026-10-30 (source level).** The lethal bound now applies the hero's per-type protection to the enemy's attack mix: the Attack fact carries `typeMultiplier` from `damage_types.js` and `hardestBlow` scales through `combat_math.scaleByType`, the same rounding as the hit. Elements stay excluded and the caveat says so. Still open from the original: learned-fact gating (CBL5, AD8), since native disclosure shows the attack today | Low, S | Bound number matches a typed fight (tests/combat_situation.test.js) |

## Round 4, 2026-10-30: depth and nuance pass (queued)

Weibao, 2026-10-30: "Might need a depth and nuance pass in the future, incorporating coating weapons with stuff, spar vs combat, other stuff and more?" Queued, not started: it opens after `combat-surface` lands the typed tempo fights and the combined fight surface ([wave plan](gm/dispatch/ui-identity-combat-2026-10-30/PLAN.md)), because most rows ride on that type mix and that surface. Every row is a palette entry (default, dial, reason), not a spec.

### LATER / DELEGATE (reopen when combat-surface is merged)

| Code | Idea | Level, effort | Done check |
|---|---|---|---|
| CBD11 | **Coatings.** Poison, oil, silver, blessed or alchemical coats (a potion poured on a blade where the world allows it) add a temporary layer to the attack mix through `damage_types.js`. Default: a set number of hits or minutes, worn faster by hard blocks; dials per world for strength, self-risk on a fumble and how visible it is to a watcher. Reason: preparation should matter as much as stats | Sonnet, M | A coated tempo fight shows the coat in the move mix and log, and the coat wears off on its stated schedule |
| CBD12 | **Spar versus real fight as a stakes dial.** Spar, first blood, yield, to the death. Agreed rules (blunted weapons, no coats, a referee or witnesses) cap harm and set what is learned: technique and opponent knowledge in a spar, toughness and standing in a real fight. Extends CBC36. Reason: one engine, many social meanings | Sonnet, M | The same opponent fought at two stakes gives different harm caps, lessons and report lines |
| CBD13 | **Breaking the terms.** A spar that turns real, a hidden coat, a second who steps in. Witnesses remember (P3c memory), standing and law react, and the other side may escalate. Reason: rules only matter if breaking them costs something in the world | Sonnet, M | Breaking an agreed term writes a remembered fact and changes the next meeting |
| CBD14 | **Fight culture per world.** Duels, arenas, sect challenges, dueling law, whether killing is legal, honor codes and what counts as cowardice, all declared per world (AD46) | Sonnet, S per world | Two worlds answer the same challenge with different terms and consequences |
| CBD15 | **Weapon and body condition.** Dull or notched edges, wet bowstrings, maintenance between fights, fatigue across a long fight, wounds by location (BHR) feeding the next fight | Sonnet, M | A neglected weapon and a tired fighter both show as named penalties with a reason |
| CBD16 | **Ways to win without killing.** Disarm, grapple, pin, capture, rout by intimidation, a bargain mid-fight; links CBC-G and the morale stages in COMBAT.md | Sonnet, M | A tempo fight can end in each of these, each with its own report line |
| CBD17 | **Place and conditions.** Terrain, light, weather, footing, reach and range as moves and modifiers, chosen by the place, not by a fixed table | Sonnet, M | One fixture place changes which moves are offered and their odds |
| CBD18 | **Fights that are not physical.** Spiritual, mental and social duels (a curse contest, a debate, a staring match) on the same tempo frame with their own harm kinds | Opus or Sonnet, L | One non-physical contest runs on the frame with its own vocabulary and settles a real stake |
| CBD19 | **Fights in the world's voice.** Report lines for blows, coats, yields and broken terms come from the per-world report voice table (`ui-identity` M4) | Sonnet, S | A LOTM fight and a fallback-world fight write differently worded but equally useful lines |


## Acceptance-prep CBL reconciliation, 2026-11-04

Content-reviewed [the October 19 prep's CBL1/CBL3 and O2/O5](reviews/ACCEPTANCE_PREP_2026-10-19.md). Its native defeat route and later this owner's saved-battle fixture are distinct evidence; neither proves every saved battle, structured death, injury consumer or natural journey. Current source still registers the `defeat` state/projection separately from its event publishers; no new battle or failed-write journey was run in this documentation pass (AD36/AD43).

The prep and older CBL3 prose call a missing outcome display “CBL4”. The actual CBL4 row names subdue stance and enemy yield, so do not turn that shorthand into evidence that CBL4 is an outcome panel. Keep an outcome-display gap with the combat representation/read-model owner when a selected task needs it; retain CBL4's original mechanic identity and scope. BHL7 injury and other outcomes keep their own producer and consumer requirements.

AD42 makes human play optional feedback. The prep's open taste questions remain useful, but its R3 wording is not a technical gate or permission to resume runtime work. Preserve the original receipt and its missing browser paths; a later source edit or unit pass cannot backdate their proof.


## Core-audit content reconciliation, B7, 2026-11-04

Reviewed the entire repeatable combat audit (C1/C2, CBC/CBX/CBL and its composed case). Keep two related reflect/rescue outcomes distinct while publishing each actual defeat/reward once through its real owner. Tracking and escape work through faculties, distance, body and available means, not a label permission list. These existing CBR/AD38 consequences constrain the selected outcome path; they do not add a new combat framework or make every historical battle a current gate (AD32/AD36).

Canonical CBR1–CBR30 live in DOMAIN_RULES; COMBAT_RULES is a compatibility stub. Old lane, viewport and compatibility evidence retains its date. Reopen the affected C1/C2 consumer when its actual rule/state/receiver changes; no runtime pass or worker was launched. Current live combat receipts retain their own status, including concurrent work not reverified here. [Full input/disposition](audits/reconciliation-2026-11-04/content-b7.json).


## Domain-scan reconciliation B118, 2026-11-04

The full [DRC audit](audits/DOMAIN_RULES_CONFORMANCE_2026-10-19.md#current-use-reconciliation-b118-2026-11-04) retains DRC2/3/4’s original closure receipts without renewing them. Selected current source still routes health-zero through a parent_location combat-zone test (DRC15), while defeat cause validation admits kind/place/by only (DRC14). These remain scoped findings for a selected fix, not authorization to change wake behavior, save schema or gameplay during documentation reconciliation. No runtime tests or fresh browser checks were run.


## Full combat-palette reconciliation, 2026-11-04

The initial gap paragraph and CBX route survey predate CBL1/CBL3. Their later receipts establish a publisher and selected saved-battle/structured-death publication at those inputs; they do not implement BHL7 injury, CBL4 subdue, every outcome or every browser journey. The CBL3 browser paragraph names a party-open fixture and a Mara duel result; preserve its stated route/result rather than treating that wording as three separately played battles. B118 and acceptance-prep keep current source limits separate from those historical runs (AD32, AD36, AD43).

CBD1–CBD4/CBD10 are source-level typed damage/protection work. The .5 protection floor, 3× weakness ceiling, material guesses and skill multipliers are local proposals/policies, not universal bans on immunity, overwhelming power or a world’s own vocabulary (AD5, AD38). CBD8 remains its distinct avoid-versus-mitigate question; typed damage alone does not close it. CBD5–CBD19 retain their consumer/reopen triggers and are not automatically selected because an old predecessor merged.

Separate actual harm/outcome/cause, visible facts, witnessed agreement, detected breach, attribution and enforcement. A spar’s stated rule cannot physically guarantee harmlessness without the mechanism to enforce it, and breaking a term need not impose a cost when no actor or mechanism can respond. Fleeing, improvisation, morale, pursuit and survival depend on actual means; CBC11’s poorer improvisation, CBC18’s absent construct morale and CBC28’s compulsory escape cost are defaults, not category laws. Keep optional nonviolent lives and paid idle policies without forcing repeated manual timing. Human review remains optional under AD42. No runtime or new build queue was selected.

## Pointer, 2026-11-09: fights and canon anchors

A code-shape read found that lead-world fights run on `tempo_fight` (Klein's fights, Harry's duel, four Gu windows), while `models/combat.js` stays the Village's. The calibration cases in `scripts/calibration/fight_cases.json` are proposal bands whose note says no canon fight existed in the first 24 chapters; the walks have since passed chapter 129 (Klein) and 140 (Fang Yuan). No lead-world fight code reads a potion or dose. The proposals that act on this are in the [atlas action register](audits/PROGRESS_ATLAS_2026-11-07_LONG_TERM.md#action-register-for-layx24-layx56-and-other-crafts-2026-11-09): LAYX30 (fights tuned to what decided them), LAYX40 (a fight you can lose) and LAYX47 (a brewed thing has a use). This doc's CB rows were not re-read against them, so some may already cover the same ground. Proposals only (AD32).

## What HP and damage should mean (2026-11-12)

Status: design proposal.

Start with the effect a move can reasonably have on a particular target. In the
Gu academy, compare the same throw against an exposed opponent, through an active
shield, and against a body reinforced by an applicable Gu. At later ranks also
check reach, target area, and whether the attack can engage a much larger body.
The source examples already used by the contest pack include the academy puppet
and the hunter encounter (RI vol. 1 ch. 22 and 65–70). The latter makes a clean
Moonblade dangerous to a mortal. It supplies no universal HP conversion.

| Representation | Walk the same Moonblade hit | Tradeoff |
| --- | --- | --- |
| Local HP and damage | A clean hit takes a substantial part of the academy partner's vitality. A real shield reduces the hit by what it intercepts. | Easy to read and compatible with current battles. One number compresses injury, disruption and recovery, so two very different hits can look equivalent. |
| Named wounds and conditions | The hit cuts the arm, so the next throw is harder. A vital strike can end the fight while the target can still move. | Gives location, treatment and retreat more meaning. Routine fights become harder to scan, and far settlement needs a summary that preserves the same consequential wounds. |
| Local vitality plus specific consequences | Show remaining ability to fight as vitality. Let existing harm and condition owners record a wound, destabilized power or similar lasting consequence when the mechanism produces it. A working can stop on impact even while vitality remains. | Proposed default for Gu and a candidate for other worlds. The combat owner settles the hit once and publishes the named consequence. A wound can affect later capability and treatment. Its severity does not deduct the same vitality a second time. |

**Working definitions.** Vitality is the body's remaining capacity to continue
under harm. A world can use a common internal calibration for physical tolerance
and show a percentage of each body's capacity. Stamina and essence each pay for
their own actions. Armor, cover and wards affect what reaches the body. Recovery
can replenish vitality, repair an injury or restore the use of a technique,
depending on what the remedy actually does. Two fresh opponents show 100% even
when one has a tougher body. Use a shared attack description and local response
to compare them. A rank difference
can change force, protection, speed, reach, precision, or what the target can
perceive. It does not have to raise every stat by the same factor. Named
exceptions follow from available methods, terrain, and the opponent's means.

**First comparisons.** The playable academy drill uses an authored 100 vitality
and 30 vs 45 damage on a clean hit. An initial blade costs four raw parts. Two
Liquor Worm conversions consume four raw parts to make two middle-stage parts
for the stronger blade. This isolates the effect of concentration and leaves
room for separate Gu combinations, injury, protection, and later ranks. A drill
stops at the first landed strike. A full fight can end by retreat, surrender,
disruption or incapacitation. The drill does not set a clean-hit count for any
of those outcomes.

An authored comparison through `resolveGuDefense` illustrates the scale. The
same 30 / 45 slashing packets land 30 / 45 on an exposed 100-vitality body,
5 / 20 behind 25 points of applicable guard, and 0 / 10 on a 180-vitality body
behind 35 points of guard. The last hit takes about 6% of that body's vitality.
The 25, 35 and 180 values illustrate distinct defenses and tolerance. They are
neither sourced values nor rank defaults.

**Next test.** Replay an exposed mortal, a guarded peer, and a higher-rank body
against the same source-grounded attack before changing any existing curves.
Keep actor, move, grade, exposure and defense explicit. Compare interruption,
injury and the next action or remedy, alongside vitality and recovery. If the
relative outcomes disagree with the source, identify whether penetration, body
tolerance, or effect size was wrong before raising a shared damage number.
Existing routes and saves keep their local scales until an owner has a tested
conversion and a reason to move.

## Pointer, 2026-11-12: fights at tie-in

Proposals on folding the live fight onto the contest, fun checks, the fight screen, fight kinds as five dials with presets (FK1–FK13), spell fights (SF1–SF6) and a usual frame per world (WS1–WS5) are in the [carry-out's tie-in considerations](PROCEDURAL_CARRY_OUT.md#tie-in-considerations-seam-fun-screen-and-the-fight-system-2026-11-12) and [its second round](PROCEDURAL_CARRY_OUT.md#round-2-kinds-of-fight-spell-fights-world-sense-the-gu-panel-and-enchanted-gear-2026-11-12). FK13 proposes per-contest stakes beside CBC32, CBC37 and CBR6. Nothing there changes CBR1–CBR30.

## Round 5: When a wand falls

**ACT NOW.** The [Chapter 11 replay](research/PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md#chapter-11-replay-and-an-interrupted-shield-charm)
checks a counter that clears two effects and an incoming jinx that changes
a cast already in preparation. The [disarm drills](research/PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md#one-disarm-two-encounter-outcomes)
compare supervised stoppage with attempted escape. In the supervised drill,
a spell already in flight can still land after the call.

### ACCOUNT FOR NOW

- **CBD20.** Settle the objective and the physical situation separately.
  A teacher can award the practice point when the wand drops, order both
  students to lower their wands and secure the loose one. A rescuer keeps
  covering the exit until the rescued person crosses. A disarmed pursuer
  can still block the doorway. CBR2, CBR18, CBR25.
- **CBD21.** Idle choices follow the objective and the facts the character
  can observe. Favor lowering the wand after a supervised win and taking
  cover after a hostile disarm. Escalation, an ambiguous surrender or a
  dangerous new arrival can be a reason to pause for input. Keep manual and
  idle play on the same cast and impact rules.
- **CBD22.** Record what remains dangerous after stoppage. A paid release
  can still hit, a restraint may hold and recovering a wand may change the
  balance again. A household charm can change the route or the footing if
  it can affect the actual surface. Aim, exposure and arrival time still
  matter. Show the difference between a blocked wind-up, a missed release
  and a landed effect that nobody has countered yet.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD23 | Have the shared contest publish a supervised win and a hostile escape from the same disarm facts. Include an opponent who offers surrender and someone who can accept it. | Sol, medium | Save during the offer and after acceptance. Each path publishes its outcome once, preserves the wand's actual custody and settles any released spell. |

## Round 6. What the winner does next

**ACT NOW.** The [headless duel and outcome recheck](research/PROCEDURAL_SPELLCRAFT_ENGINE_EVIDENCE_2026-11-11.md#chapter-11-and-camp-wards-recheck) verifies that the same wand loss can lead to a proctor's stop, accepted surrender, or withdrawal with pursuit. An accepted surrender cancels a pending cast and leaves a paid spell in flight to resolve.

### ACCOUNT FOR NOW

- **CBD24.** Set the stake before choosing a spell. In club practice the referee may call a touch, disarm, or yield and secure the wand. In a rescue, the same disarm buys a window to move someone to safety. Show the condition for a point or a successful rescue separately from what either body can still do. Practice and hostile encounters can share every impact rule. See CBR2 and AD38.
- **CBD25.** After disarm, make the wand's location a decision. A disarmed actor may duck out, call for help, move toward a loose wand, or use a separately learned wandless method if they can perform it. A nearby opponent can try to cover the wand, guard an exit, or accept surrender. Show who has custody and what remains dangerous. A falling body, a fire, a binding, and a released spell each have their own settlement.
- **CBD26.** Give manual and idle choice the same information. Show why a particular cast is available, what it needs at release, and what could intercept it at impact. An idle practice policy can honor the call and lower the wand. An escape policy can favor a clear path or a timely shield. Treat a household spell by its actual target and effect. Glisseo can change the escape route and send the caster's party down the same chute. Record where the spell landed and who was exposed, including bystanders.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD27 | Compare returning a loose wand in practice with both sides trying to reach it in a hostile encounter. | Sol, medium | Restore while the wand is loose and both actors are moving. The first successful recovery changes casting eligibility, while an already released spell settles from its saved origin. |
| CBD28 | Add an aftermath choice to a nonlethal win. | Sol, medium | Save at a surrender with an active restraint and a wounded participant. The outcome persists once, while Finite, aid, or leaving changes the remaining danger and the witnesses' responses. |

## Layered protection in shared-engine combat (proposal)

Build on CBD1–CBD3, CBD9 and the existing [ability resolution phases](ABILITY_RULES.md#implementation-guidelines). The native damage calculation already uses damage types and worn protection. Gu contests have an ordered defense resolver that spends capacity on matching damage types and phases. The Red Fire reconstruction currently settles damage on a resolved body. Its receipt establishes composition, cost and settlement for that fixture. [Native damage types](../src/damage_types.js) · [Gu defense](../src/gu_defense.js) · [Red Fire receipt](gm/dispatch/foundation-run-2026-11-12/RUN.md#red-fire-reconstruction-and-substitution)

| Stage | State the engine reads | Outcome to record |
| --- | --- | --- |
| Delivery | Attacker, target, reach, timing, active guards and the method of attack | What missed, what was intercepted and what made contact |
| Protection | Covered location when relevant, worn layers, their condition, active wards and the types of effect they can stop | Which layer absorbed, redirected or passed through an effect. Spend charges and apply wear through their owners where the rule calls for it. |
| Body and aftermath | What reached the body, its own resistance or vulnerability, and the rule for that effect | Damage, injury or another consequence that care, recovery and later actions can read |

Use one incoming effect and vary the actual equipment or ward. For example, compare Red Fire against the same target with ordinary clothing and with an active fire ward. Then check a second flame after the ward spends its last charge, and a physical blow under the same ward to check what the ward covers. Conditions, heat passing through, equipment damage and injury are separate outcomes where the world calls for them. Show the protection that mattered and the consequence the actor can observe. The existing zone and timing rules can cover reach and interception. A case involving a projectile crossing a gap, a ricochet or a structural collapse can justify local geometry at the needed precision. [Place graph](gm/dispatch/foundation-run-2026-11-12/W18_PLACE_GRAPH.md) · [Encounter views](../DESIGN.md#action-and-encounter-views-proposal)

The first headless proof belongs to E19's contest and living-body work. It records the incoming hit, each layer's absorbed amount and remaining capacity, innate resistance, and the harm that reached the body inbox. Clothing alone takes one point from each force-two flame and the body loses two vitality. A fresh fire ward stops the first flame and spends its two points. The next flame reaches the coat and the body loses one vitality. After save and restore, another cast agrees with uninterrupted play and the spent ward remains empty. A separate four-point physical hit leaves a fresh fire ward untouched. The coat absorbs one point and the body takes three. Giving the same body two points of innate physical resistance reduces that to one. These numbers are authored calibration. [Fixture](../tests/gu_flame_working.test.js)

**Rank and scaling.** Follow AD38, AD49 and the November 10 direction that rank and power can diverge. Derive a rank benefit from what advancement changes in that world. A stronger body can supply innate resistance to a particular effect. A greater reserve can fund more uses. A better source or higher output can change the incoming packet. Better control can change aim, reliability or waste. Check source comparisons at ordinary and exceptional cases, including a lower-ranked actor with an effective tool or technique. Keep the benefits on their respective owners so raising rank does not apply the same advantage twice. The existing Gu fuel law models grade mismatch and ability-specific stage modifiers. The protection fixture tests the resistance input. A world's actual rank-to-resistance mapping is a progression consumer to prove with its own source. [Gu fuel](../src/gu_fuel.js) · [Direction](gm/USER_VISION_LOG_2026-11.md#answers-on-the-limiting-lines-third-round-2026-11-10)

**Crafting consumer.** Use the same equipment state for crafted and acquired pieces. Materials and construction can change which effects a piece resists, its coverage and how much it can absorb. An enchantment can add a layer with a different response, capacity or recharge method. The proposed first making check is one ordinary garment and one altered version. Change one meaningful material, process or enchantment input, equip the resulting item, and show the difference under the same two hits. The fixture currently uses authored equipment records and models remaining absorption capacity. A recipe, per-location coverage, repair and ward recharge have separate consumers. [Making rules](MAKING_RULES.md)

### Reconstructing the pit fight from shared rules

E19, AD38, AD49, AD51, CFC3a, CFC7, CFC11 and CFC16. Use the confrontation from the hunters' arrival through the end of the fight as the first Gu combat calibration. Fang Yuan opens with a Moonlight Gu attack while closing. One hunter suffers a severe forearm wound, two kneel, and Wang Er stays up. Wang Er dodges the next blade and fires, Fang Yuan ducks and closes, and Wang Er drops the bow for fists. Fang Yuan slips and deflects the punches. When Wang Er turns into the sunlight, he detects the last blade late and takes a fatal head wound. The three blades, who was wounded or killed, and the order of these beats are source anchors. Tick counts, resource units and hit math are game calibration. [Chapter 66](https://roliascan.com/read/reverend-insanity/ch66-97413/)

**ACT NOW.** The [pit fixture](../src/contest_packs/gu_world.js) exercises the ordered chapter beats under a calibrated seed and uses the same contest for the Moonglow swap and a no-sun comparison. It uses the existing harm rung for hand function and checks the pending cast, wound and dropped bow across restore. The swap assumes a usable Rank Two specimen and the contest's ungraded reserve. [Fight evidence](gm/dispatch/foundation-run-2026-11-12/RUN.md#wang-er-fight-and-one-gu-swap)

**ACCOUNT FOR NOW.** The live chapter should pass the player's actual Gu, aperture, gear and surroundings into the shared actions. Player choices and opponent policies use the same reach, means and release checks. The chapter consumes the fight's results, including a different winner where play diverges. The saved burn case below can exercise the same injury-to-action relationship with treatment as its distinct outcome. The fixture uses one axis for local movement and infers facing from the opponent; terrain routes, treatment, and live inventory settlement still need their own consumers. [Contest contract](CONTEST_CONTRACT.md)

**LATER / DELEGATE.** Extend coverage one demonstrated interaction at a time. Little Light plus Moonlight from chapter 70 is a direct test that a support's altered reach changes a decision. Red Fire then tests whether separate flame packets can spend the same defense at different moments. A bounded systems pass can add either case with a sourced baseline, a single perturbation and a restored run, and reuse the same body and encounter rules where they fit. Broader search work reopens when one of these known recipes needs a binding or sequence the existing search cannot propose.

### Saved hand-burn idea

> Can we actually build the burn on a person next, where the ward blocks or reduces it, the burn changes what they can do with that hand, and treatment restores it? test save and reload too

This is a proposed E19 combat-to-body check. Run the same exposure against a person's hand with enough ward capacity to stop it, with partial protection, and with a spent ward. Apply any residual burn through the existing harm owner. Verify that one action requiring that hand changes accordingly and that treatment restores it. Save and reload with the burn active and during recovery. Compare the hand, the action's availability, and the ward's remaining charge with uninterrupted settlement. The existing Red Fire fixture verifies protection and residual harm. Hand injury, its action consumer, and treatment are open on that path.

Use this as evidence for the shared combat rules when a selected encounter needs it. The [foundation run](gm/dispatch/foundation-run-2026-11-12/RUN.md#procedural-combat-across-worlds) owns the order across worlds.

## Round 7. Play the same fight through text or sprites (2026-11-13)

Proposal for combat tie-in under AD32. Follow CBR13–CBR14 for what a fighter can observe, CFC4/CFC6/CFC16 for timing, interruption and restore, AR8 for projections, and UR91 for the difference between a settled effect and a response opportunity. The [encounter view proposal](../DESIGN.md#action-and-encounter-views-proposal) owns the display direction.

**ACT NOW.** Verified the existing headless [Wang Er restore case](../tests/contest_consumers.test.js) with `node --test --test-name-pattern 'restore after the arm wound' tests/contest_consumers.test.js` (1 passed). It resumes a pending cast after the bow drops. This is a starting state for the comparison. Text and sprite input parity remains untested.

### ACCOUNT FOR NOW

- **CBD29.** Let the text panel, animated board, or a combined view play one saved contest. Both read the same character-visible state and submit actions to the same resolver. Selecting a visible fighter or loose bow on the board can be a shortcut for selecting its entry in the list. A sprite can show a visible windup; a lunge, hit or interruption follows the event the engine settles. Cosmetic motion may be skipped and grants no reaction time. A real response window appears in both views at the same point on the contest clock.
- **CBD30.** Separate presentation from who makes decisions. Manual play exposes the same reachable targets, costs and response opportunities in either view. A player can also hand routine choices to a policy and take over at a decision point, with a pause on observable events they select, such as losing a weapon. Extra precision that changes outcomes, such as aiming at a particular body part or choosing a route around cover, needs a rule and an equivalent text command if the views are to remain equivalent. A simpler control preset may delegate such choices explicitly.
- **CBD31.** Draw the space the engine has. The Wang Er fixture has an axis for distance, which can become a side-on board. A room with routes around cover could use a top-down board when those routes affect play. Use readable actor and object markers first so art quality does not decide whether the layout helps.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD32 | At the selected Gu combat tie-in, compare a compact text list, a static side-on board and that same board with animation at 1920×1080. Use the existing Wang Er fight and its pending-cast state. | Sol, medium for one encounter | On the same seeded start and command sequence, match legal targets, costs, clock, interruptions, custody, injuries and outcome. Repeat while switching views with a cast pending, after restore, and with motion disabled. In play, compare whether the player can identify a reachable target, tell what is pending and choose a response when one exists. Count wrong or missed choices and time to commit. Alternate the order or use paired starts to reduce practice effects. Keep the board if it clarifies decisions, and judge animation separately against the static board for clarity and feel. |

Full movement controls, custom art and mobile presentation are outside this comparison. Test reuse on a second encounter before deciding how broadly to apply the view.

## Round 8. Make positioning legible through text (2026-11-13)

**ACT NOW.** Compared public developer writing and rules. [Skotos's proximity design](https://www.skotos.net/articles/proximitysystem.html) models positions relative to landmarks and people and describes an approach while it is underway. Its paper describes a partial implementation. [Fate Condensed](https://fate-srd.com/fate-condensed/challenges-conflicts-and-contests) uses named zones, adjacency, and terrain features that affect movement and reach. [Victor Gijsbers's Kerkerkruip interview](https://intfiction.org/t/interview-victor-gijsbers-on-kerkerkruip/12584) explains his choice to build tactics around preparation and reaction instead of space. [Achaea's combat help](https://www.achaea.com/game-help?what=basic-principles-of-combat-in-achaea) documents text combat with actions that recover on timers measured in seconds. These designs inform the proposal below.

### ACCOUNT FOR NOW

- **CBD33.** A text scene needs a persistent tactical readout. Lead with the objective, the fighter's location and visible threats. Group visible actors and items by landmark. Show routes, time, exposure and obstructions beside the destination choices. Show reach, line of sight, direction of cover, facing, height, posture or affected area when they change an available action. Keep brief changes in the fight log and offer free inspection of known details. Mark what was last seen separately from what can be confirmed now.
- **CBD34.** Resolve the same action in both views. A text control such as “Move to pillar via aisle” should name the same route as the board selection. Both can preview that the aisle is exposed and whether the fighter can reach cover before a readable release. Preview only what the fighter can reasonably judge. Recheck position, cover and means when the rules use them. Reuse the contest clock and event order (CFC4, CFC6); pausing at a decision is a proposed control, independent of how space is shown.
- **CBD35.** Match precision to the decisions in the scene. A line can support reach and retreat. A graph of named positions can support competing routes and cover from different directions. When two positions within one named area produce different shots or paths, offer more anchors or a keyboard-addressable grid with spoken or written descriptions. The two views use one representation of the geometry for any given fight.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD36 | Extend CBD32's comparison to a scene with two routes, directional cover, and a target or object that changes position. | Sol, medium for one follow-on encounter | From either view the player can identify who has a clear shot, find the route that breaks it and explain why it works. Run the same choices through both inputs and compare position, sight, deadline and result. If the command sets match but text players repeatedly miss a legal option, revise how they find or inspect it and compare again. |

## Round 9. What the existing Tempo controls prove (2026-11-13)

**ACT NOW.** Checked the [Fight card](../src/combat_situation_ui.js), [Tempo resolver](../src/tempo_fight.js) and [recorded desktop play](representations/COMBAT.md). The card offers timed moves, body-part aim for strikes, orders where applicable and one safe handover turn. The resolver accepts a foe ID. The card's standard attack buttons omit it, so the resolver selects the lowest-HP active opponent. Headless policies and the one-turn handover have different scope. `node --test tests/tempo_fight.test.js tests/tempo_location.test.js tests/tempo_host.test.js` passed 29 tests on the working tree. Desktop evidence comes from the recorded road-contest fixture build, not a fresh run. The [carry-out's T4](PROCEDURAL_CARRY_OUT.md#tie-in-considerations-seam-fun-screen-and-the-fight-system-2026-11-12) proposes the shared resolver tie-in.

### ACCOUNT FOR NOW

- **CBD37.** Start by exposing a named opponent choice in the existing action flow where multiple targets matter. A text option and a sprite click can submit the same foe ID. Recheck stale targets at commit and tell the player when an explicit target disappeared, since silently falling back could spend the move on a different foe. [Dwarf Fortress](https://bay12games.com/dwarves/features.html) separates detailed aimed attacks and reactions from the overhead map. [FTL](https://store.steampowered.com/app/212680/ftl_faster_than_light/) shows how pause and explicit crew or weapon orders can coexist with a running fight.
- **CBD38.** Treat ongoing delegation as a separate player control from a single safe action. [Final Fantasy XII](https://www.square-enix-games.com/en_GB/news/2019-review-final-fantasy-x-final-fantasy-xii) uses player-defined gambits. [Guild Wars command training](https://wiki.guildwars.com/wiki/Command_Training) demonstrates a location order that takes priority over a hero's skill use while they move. For YAIRPG, consider a visible policy, a one-action override, and a clear return to policy, with stock and consequences following CBR26. Report the rule that fired and pause or retreat when the policy cannot cover a changed situation.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD39 | At a selected multi-opponent tie-in, compare a one-action order against ongoing policy with an override. | Sol, medium for one encounter | Choose a named foe in each view, invalidate that target before commit, and verify no action goes to a different foe without the player's knowledge. Run several familiar encounters under the policy, spend actual supplies and exercise one stop condition. A manual override uses the same action rules and the player can see when the policy resumes. |

## Round 10. A working fight loop covers one kind of play (2026-11-13)

*Rounds 10 to 32 were written in one day. For what is built, spiked or still an idea, read [where rounds 10 to 32 stand](#where-rounds-10-to-32-stand-2026-11-13) first.*

The Village battler works for repeated clears. The player prepares a character, the battler exchanges timed attacks, and a clear advances the area's count and may pay rewards before the next group starts. That loop gives the player a reason to care about equipment and progress across several fights. Its completion logic is shaped around clearing groups. [Village round and rewards](../src/main.js#L4839)

**The coverage gap is at both ends of the fight.** A hunt, escape, training bout or authored confrontation can begin with different equipment, knowledge, terrain and objectives. Its ending may be a point scored, a quarry lost, a person driven off, or an injury or item that changes the next activity. If the playable route hands combat generic stats and receives a win flag, more attacks, more numbers or a spatial view will leave those connections missing. CBR2, CBR6, CBR25–CBR26 and CBR29 describe the intended range.

| Code | What works today | What the selected consumer still needs |
| --- | --- | --- |
| CBD40 | Village clears handle repeat play. Tempo handles deliberate exchanges with timed moves, aim and a safe one-turn handover. | Where sustained delegation is needed, the policy uses real supplies and the game shows when it needs a decision or ends the attempt. Keep detailed control available at the decisions that benefit from it. |
| CBD41 | Pursuit already has a native view and responses. The shared contest foundation can model reach, interruptions and different end states in fixtures, including the Gu hunt and Hogwarts duel. | The selected live encounter supplies its actual people, means and objective. It returns the result to the systems that use it, such as inventory, injuries, pursuit or chapter progression. Check each connection through the route that plays it. |
| CBD42 | The standalone Wang Er prototype shows that text and an animated board can play the same contest. | A view earns its space when it makes a choice easier to read. The prototype does not establish that terrain is needed or that the chapter consumes the outcome. |

When tie-in resumes, exercise one fight where the result changes the player's next action. For Fang Yuan, compare a loaded fight against one after changing or exhausting the actual carried means, and follow a win or withdrawal into the next activity. Show what the policy handled and what was worth deciding by hand. Use the existing [tie-in plan](PROCEDURAL_CARRY_OUT.md#tie-in-considerations-seam-fun-screen-and-the-fight-system-2026-11-12) and its T4/N2–N6 checks. This is a proposed comparison within the existing foundations-first order. Source and owner review only in this round.

## Round 11. What gives a fight its style (2026-11-13)

**ACT NOW.** Source review distinguishes two existing examples. In the [Fang Yuan capability fixture](../tests/fang_yuan_capability.test.js), feeding and controlling an acquired Gu changes what he can bring into the fight. In the [Hogwarts contest fixture](../tests/contest_consumers.test.js), a disarm affects the wand and a jinx affects composure or footing. These are headless evidence of different decisions and effects, with live adoption tracked separately.

### ACCOUNT FOR NOW

- **CBD43.** Describe a style by the decision it makes interesting. The [fight presets](PROCEDURAL_CARRY_OUT.md#round-2-kinds-of-fight-spell-fights-world-sense-the-gu-panel-and-enchanted-gear-2026-11-12) already describe stakes, endings, witnesses, means and scale. Pair these with what the player can read, when they need to act, and what the world remembers. A named spell that only changes a damage number can still suit a simple exchange. An actual disarm creates decisions about recovery, escape and defense while unarmed.
- **CBD44.** One world can have several styles, and a style can appear across worlds. A Hogwarts practice bout and an escape from a hostile caster may use the same charm and end differently. A Gu spar and a hunt can share an activation while rewarding restraint in one and positioning in the other. As an unusual LOTM comparison, test a confrontation where identifying the threat and choosing a prepared counter or exit is the main decision, then play out only the exchanges that change it. This is a proposed test, with the [LOTM combat audit](gm/dispatch/refinement-audits-2026-10-31/LOTM_COMBAT_DEEP_DIVE_2026-11-03.md) supplying context.
- **CBD45.** Share action timing, costs and settlement where the rules fit. Let techniques define their own means, targets and effects (AD38, CFC2–CFC8). Choose the view by what must be understood: a windup and release timeline for a counter, position and direction for reach or glare, a supplies and result summary for a repeatable clear. Manual and delegated control can use the same view. Offer only intent the character can read.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD46 | Compare the selected Gu fight with a supervised Hogwarts bout at their existing tie-in points. | Sol, medium per encounter | Name the decisive choice in each. Change one input and observe a different legal move, response, or aftermath. If the same policy and move sequence settle both for the same reason, check whether the expected world difference has a real consumer before changing the presentation. |

## Round 12. Let ordinary actions change a fight (2026-11-13)

**ACT NOW.** Traced the standard contest release and command paths. Most moves bind an entrant as actor and either that entrant or an opposing entrant as target. They already recheck reach and means at release. A body can interrupt a windup by landing a sufficient hit, and a timed handoff can be interrupted. These are useful foundations. The usual command shape still leaves actions on nearby objects, allies and ongoing workings to other paths. [Contest resolver](../src/contest.js) · [Timed handoff and guard tests](../tests/gu_moonblade_contest.test.js)

### ACCOUNT FOR NOW

- **CBD47.** Begin with a physical example of a missing action. Let a fighter use an ordinary world verb during the encounter, such as picking up a loose wand, closing a door or helping a wounded ally reach an exit. Address the actual object, person or place and let the existing owner settle it. A loose wand can be recoverable and still fail to restore casting if the hand is impaired or the character lacks the knowledge. A latch can block a person without blocking every effect.
- **CBD48.** Separate trying, reaching and completing. An action can be reasonable to start, then lose a route, target or tool while underway. Give the player the cost and risk they can judge at the start, settle from actual conditions when it matters, and preserve effects already paid for or released. This includes responses that target a specific cast, projectile or sustained effect where the world gives the fighter a way to perceive and affect it.
- **CBD49.** Let the surrounding world answer. A wounded bystander can flee, someone else can seize the wand, and an open exit can make retreat viable. Preserve who did what, what each observer could know and what happened to bodies, objects and stock. Manual and delegated choices need the same constraints. When mid-fight world responses matter, check near and unattended settlement against those responses before using the far summary path (CFC12).

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD50 | At the selected spell-combat tie-in, use the loose-wand case from CBD25/CBD27 to exercise an ordinary world interaction during a fight. | Sol, medium for one encounter | Compare an open recovery route with the same route blocked or the wand claimed before arrival. The player can try from known facts, the engine settles reach and custody once, a spell already in flight keeps its own resolution, and subsequent casting reads the resulting custody and bodily means. Restore during the attempt and compare with uninterrupted play. |

## Round 13. From attack bars to timing you can act on (2026-11-13)

**ACT NOW.** Traced the two clocks. The [Village bars](../src/models/combat.js) show progress through repeating attack cycles. The [contest](../src/contest.js#L585) advances to an actor's readiness or the next step of an action underway. The current [fight card](../src/combat_situation_ui.js) has a who-acts-next line. It can keep the combatants as anchors and show a shared ordering when several deadlines matter. This extends the proposed [encounter views](../DESIGN.md#action-and-encounter-views-proposal).

### ACCOUNT FOR NOW

- **CBD51.** Keep simple attack bars for repeating attacks. In a detailed fight, label each fighter's current state as ready, preparing a named action, moving, or recovering as applicable. Distinguish the next opportunity to act from a pending effect's release or arrival. An unread action can show the visible tell without revealing its identity, target or exact deadline. Label a paused decision and the condition under which auto will stop.
- **CBD52.** Put events on one time axis when their order changes the choice. Show the nearest relevant events with their source and target. On focus, preview where a proposed move would finish and when its useful effect begins if those differ. Text gives the same ordering in words. Separate already released effects from their caster when they can survive interruption. Use explicit uncertainty where the character cannot know the order, and explain a tie where it affects a choice. A preview describes the current situation, which can change before release.
- **CBD53.** Offer a short list when it can answer the question by itself. A timeline earns its space when it is easier to compare overlapping actions. Keep it fixed while the player reads or chooses. Text and the board can show the same clock, and animation takes its cues from settlement. A visible countdown gives the player a response only when the engine offers a legal window to use it.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD54 | Compare a short event list and an aligned timeline at the selected spell fight tie-in, using one response that can finish in time and one that arrives too late. | Sol, medium for one encounter | The player can say which response can matter before committing. The displayed order agrees with the settled events and remains readable with motion off. Show an unread cast, an interrupted windup and an effect whose caster is no longer active when it arrives, where the chosen rules support them. |

## Round 14. Rich fights without a click per fight (2026-11-13)

Weibao asked whether named places, an event list and verbs on any subject would put too many choices into normal daily fighting. It would if every fight exposed all of them. These are proposals.

**ACT NOW.** Checked what already answers this. CBC24–CBC27 and CBR26 give idle fights a policy paid from real stock and stop away play at a new kind of enemy. [CFC12](CONTEST_CONTRACT.md) makes near and far detail the same rule with equal outcomes (tested), and [N5](PROCEDURAL_CARRY_OUT.md#tie-in-considerations-seam-fun-screen-and-the-fight-system-2026-11-12) plans policy fights on it. The [contest](../src/contest.js) uses one default chooser for the player's auto-play and every other actor. CBD38 proposes a visible policy with an override. Source and owner review only. None of these yet says how many decisions a routine fight should ask for, or how a policy comes to exist without an editor.

### ACCOUNT FOR NOW

- **CBD55.** The chooser uses the detail, so the player does not have to. Places, cover and loose objects can change who wins and what the log says in a fight nobody touches, since auto-play and foes share one chooser. A daily fight can read "ducked behind the cart, lost the spear, finished with the knife" at zero clicks. Rich state and many prompts are separate dials.
- **CBD56.** A routine fight asks nothing by default. It pauses when something differs from the last time this policy handled this kind of fight: a new kind of foe (CBC25), a lost or dropped means, a risk of lasting harm, a changed objective, an opening the policy has no answer for. The dial is how much difference earns a pause, set per character and per place. A repeat with nothing new settles to a result line the player can open.
- **CBD57.** At a pause, lead with intents and keep moves one step away. Show the few intents whose likely results differ in the current situation, such as press, hold, get the wand, leave. The character's skill picks the footwork. The full move and target list stays available for anyone who wants it. Options that lead to the same result fold together, so the count follows the situation and not the size of the engine.
- **CBD58.** Daily fighting's real choices sit before the fight. What to carry, which Gu is fed, where to hunt, when to withdraw and what to do about a known foe are set once and persist. This is where preparation-led styles (CBD44) and the idle-first default (CBC26) meet: the nuance shows up as a different result from different preparation.
- **CBD59.** Let the policy grow from answers. When the player answers the same kind of pause the same way again, offer to keep that answer as a standing order ("recover my own weapon when the route is open"). The player can read, change or drop each order. This gives CBD38's visible policy a source in play and delays the need for an editor.
- **CBD60.** Two failures to watch. A policy that plays as well as a careful player leaves manual control with nothing to add, and a weak one turns daily fights into chores. CBC26's default (manual pays a little more) names the target. A pause that fires every fight is a missing standing order or a threshold set too low, and the game can say which.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD61 | Count decisions per fight as a recorded figure beside the result, headless first and then at the live tie-in (revised 2026-11-13, CBD308). | Sol, small | Repeat one familiar fight ten times under policy and record zero pauses. Change one input (a new foe kind, an emptied supply, a dropped weapon) and record one pause that names the difference. Answer it the same way twice, accept the standing order, and record zero pauses on the next repeat. Compare the policy result with a hand-played run. |

### Round 14 suggestions (separate from the palette)

- Add "decisions asked" to the fight review so tuning the pause threshold has a number to look at.
- When CBD46's two-style comparison runs, record each style's routine version alongside its detailed one.

## Round 15. How much world, what you see, and who is playing (2026-11-13)

Weibao asked whether this amounts to simulating a 2D or 3D world played through the current screen, whether the player sees the results of actions, whether it becomes a turn-based RPG, and what kinds of players it serves. These are proposals.

**ACT NOW.** Checked the owners. The [contest](../src/contest.js) advances a clock to the next actor's readiness and takes one choice there, with different moves costing different time. Its tuning values each carry a written reason. The [combat review](../src/combat_review.js) records dealt and taken totals with a diagnosis for Village fights. [Feedback rules](FEEDBACK_RULES.md) have no fight-specific line. [AD52 and the activity rules](ACTIVITY_ABSTRACTION_RULES.md) cover compressing repeated play with its choices intact. Source and owner review only.

### ACCOUNT FOR NOW

- **CBD62.** Model a tabletop scene. A fight holds the handful of relations that change a decision: who stands where among a few named places, who can reach or see whom, who holds what, and what is already under way. A continuous 2D or 3D world behind a text screen would cost far more and would decide things by geometry the text cannot tell. Working test: when a fact changes a result, the game can state that fact in a sentence. Detail the player could not have been told stays out of settlement by default, with hidden things (an unseen foe, a concealed door) kept as facts the character has yet to learn.
- **CBD63.** Every action shows its result at four moments. Before: what the character can judge about cost, time and risk. As it settles: one terse line naming the cause ("Bolt: stopped by the cart."). After: the changed state, such as a new place, a dropped item or a wound. Later: what the next activity inherits. A miss, a block and a wasted move each say why. The contest already records outcomes like "out of position", so much of this is wording and display over existing results.
- **CBD64.** Show routine fights by their turning points. A settled fight leads with the result and the two or three events that decided it, and the full log opens on request. This lets CBD55's unattended detail be read in a few seconds, and it gives the review a cause to report beside its totals.
- **CBD65.** Hand control feels turn-based, on a clock. At a pause the player picks one action with time to think, as in a turn-based RPG. The differences are that moves take different amounts of time, the order comes from readiness, foes act on the same clock, and a fight can end by leaving, yielding or losing a weapon. When the player lets go, the same fight runs by itself. One engine gives both the idle and the turn-based feel, and the player moves between them inside a fight.
- **CBD66.** Player types are moods of one player. Weibao is the main player (AD22), so the useful split is by what he wants from a given fight. Each needs a way in:

| Mood | Wants | Served by |
| --- | --- | --- |
| Watcher | Set it going and read what happened | Policy fights, turning-point results (CBD56, CBD64) |
| Preparer | Win by what was built and carried | Real loadout and stock entering the fight (CBD41, CBD58) |
| Tactician | Play the fights that matter by hand | Pauses with intents, timing and places (CBD52, CBD57) |
| Reader | A fight that reads as a scene with a consequence | Cause lines and aftermath (CBD63) |
| Avoider | Settle it by talk, stealth, leaving or a prepared counter | Endings other than a clear (CBR25, CBD44) |
| Tinkerer | Try the odd thing and have it work when it reasonably would | Verbs on any subject (CBD47, AD38) |

- **CBD67.** The mood changes per fight, so the switch belongs in the fight. Taking over, handing back and opening the full log are available at any pause. A per-character or per-place default covers the usual case.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD68 | Play one fight six ways, one per mood in CBD66, headless first and then at the live tie-in (revised 2026-11-13, CBD308). | Sol, medium | Each mood reaches a result through its own route without using another's controls. Each run shows a cause line for the deciding event and an aftermath the next activity reads. Note any mood with no route as a named gap. |

### Round 15 suggestions (separate from the palette)

- Add a fight line to the feedback rules once CBD63 has been tried in one encounter.
- Write one voice sample for cause lines per world before the tie-in writes them (PRS7).

## Round 16. Where the scene comes from, and one fight written out (2026-11-13)

Weibao asked to keep designing. This round takes the cost question the earlier rounds left open (who makes each fight's places) and writes one daily fight as it could read on screen. These are proposals.

**ACT NOW.** Checked the owners. The [fight presets FK1–FK11](PROCEDURAL_CARRY_OUT.md#round-2-kinds-of-fight-spell-fights-world-sense-the-gu-panel-and-enchanted-gear-2026-11-12) describe a kind of fight by five dials, and the Means dial already includes "what the place offers". A contest starts from a `place` id and reads holders at that place from the world record. No owner yet says how a place turns into the few named spots of CBD62. Source and owner review only.

### ACCOUNT FOR NOW

- **CBD69.** The place supplies the scene. A fight's named spots come from what the place already holds: its kind (slope, lane, hall, riverbank), the things recorded there (a cart, a fallen pine, a door) and its ways out. A place kind gives a small default layout, and recorded things add or replace spots. An authored confrontation can add detail by hand. A daily fight then costs no scene authoring, and a fight in the same place tomorrow uses the same pine.
- **CBD70.** Things in the scene are the world's things. The cart used as cover is the cart in the place record. If the fight breaks it, burns it or leaves a wand under it, the place keeps that afterwards (CBD49). Cover made up for a single fight would vanish at the end and could not be worn down, moved or prepared ahead of time.
- **CBD71.** Preparing the ground is a play style. Since the scene is the place, a fighter can choose where to meet a foe, move a cart across a lane the day before, or wait at the narrow spot. This gives CBD66's preparer and avoider something to do in space without any click during the fight. FK8 (holding a place) is the same idea at larger size.
- **CBD72.** The other side wants something too. A boar wants the intruder gone, a thief wants the purse, a duellist wants the point. A foe that reaches its aim or loses its reason leaves, yields or bargains by its own choice (CBC-A, FK dials). A scene with a way out makes those endings available to both sides, so fewer daily fights run to the last hit point.
- **CBD73.** Crowds read by place. With many fighters, the readout groups them ("three at the gate, one on the wall") and a pause offers intents against a group or a spot. One named foe gets its own line when it differs from its group in a way that changes a choice. This keeps a skirmish (FK9) inside the same choice budget as a duel (CBD57).

### One daily fight, written out

A sketch of the layout, to react to. Fang Yuan hunts a boar on a slope he has hunted before. The result and the lines after the choice were rewritten on 2026-11-13 in the terse register of CBD310; the pause's choice rows are still hand-written.

The unattended result (CBD56, CBD64):

```
East slope. 41 seconds. You: standing.
  Them    Boar: killed.
  Spent   Primeval essence 4 of 20.
  Hurt    Left forearm, grazed.
  What decided it
    Boar: charge fails, footing lost on the scree.
    You: moonblade hits the boar, flank.
[Open the full account]
```

The same hunt on a day the policy has no answer for (CBD33, CBD52, CBD57):

```
Hunt, east slope. You want the boar down before dark.

You     on the scree. Moonlight Gu ready. Essence under a third.
Boar    at the thicket edge, six paces off, turning toward you.
Here    a fallen pine between you and the thicket.
        the stream bank behind you, a way out.

Coming  2s  the boar charges (you can see it gather).

Paused: you have less essence than you have hunted this slope with.
  Step behind the pine (1s). The charge has to come around it.
  Loose the moonblade now (3s). It lands after the charge reaches you.
  Back off to the stream bank (3s). The hunt ends and the boar keeps the slope.
  More
```

After choosing the pine (CBD63, CBD59):

```
You: behind the pine.
Boar: charge slowed, around the pine.
You: moonblade hits the boar, flank.
Boar down, killed.
Fallen pine: gouged, thicket side.

Keep this as a standing order? "Take cover first when essence is under a third."
```

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD74 | Derive a scene from one existing place, headless first (revised 2026-11-13; the [scene layer spike](audits/SCENE_LAYER_SPIKE_2026-11-13.md) covers the first three checks). | Sol, medium | Start two fights at the same place on different days and get the same spots. Move or remove one recorded thing between them and see the scene and one available action change. Damage a thing during a fight and find the damage in the place record afterwards. Save and reload mid-fight and compare with an uninterrupted run. |

### Round 16 suggestions (separate from the palette)

- Put the three sketches above in front of the prototype-to-decision route as static mock-ups at desktop size before any engine work, since they are cheap to change.
- List the place kinds the Gu and Hogwarts openings already use, to see how many default layouts the first tie-ins need.

## Round 17. Layout, choices, environments and how a fight starts (2026-11-13)

Weibao asked how the screen changes when fight text lands in Reports, how to show choices, how fights differ by kind, result, world and environment (a school, for one), and how a fight's environment is set up. These are proposals.

**ACT NOW.** Checked the owners. [DSG1](../DESIGN.md) keeps You and the current focus as twin panels on top, the place and its actions in the middle and a full-height Reports column, with a full-screen view for weighty moments (UR5). The [encounter views proposal](../DESIGN.md#action-and-encounter-views-proposal) adds a zone sketch or timeline when a list is hard to follow. [FK1–FK11](PROCEDURAL_CARRY_OUT.md#round-2-kinds-of-fight-spell-fights-world-sense-the-gu-panel-and-enchanted-gear-2026-11-12) give kinds of fight as five dials, with Frame covering who watches and who steps in. Source and owner review only.

### ACCOUNT FOR NOW

- **CBD75.** A fight fills the panels already on screen. The current focus panel holds the objective, what is coming and any pause with its choices. The place panel is the scene, with people and things grouped by spot. The You panel shows means: essence, what is held, wounds. Reports receives cause lines as they settle and the result at the end. A routine fight touches Reports alone. A weighty fight can take the full screen and add the zone sketch or timeline.

```
+---------------------------+--------------------------------+----------------------+
| YOU                       | FOCUS: Hunt, east slope        | REPORTS              |
| Essence under a third     | Boar down before dark          |                      |
| Moonlight Gu ready        | Coming  2s  boar charges       | Boar: turned, facing |
| Left forearm: sound       | Paused: less essence than      | you.                 |
+---------------------------+ you have hunted here with      |                      |
| PLACE: east slope         |  1 Behind the pine   1s        | You: onto the scree. |
| Scree       you           |  2 Moonblade now     3s  late  |                      |
| Fallen pine (cover)       |  3 To the stream     3s  ends  |                      |
| Thicket edge  boar        |  More                          |                      |
| Stream bank (way out)     |                                |                      |
+---------------------------+--------------------------------+----------------------+
```

- **CBD76.** Reports tells and the focus panel asks. Reports scrolls, so a choice placed there could be lost under newer lines. Keep decisions in the focus panel and let Reports carry what happened, in order, in the world's voice (DSG13). The result block in Reports can open the full account and link to what changed: the wound, the gouged pine, the wand on the floor (UR92).
- **CBD77.** A choice row answers the same four questions each time: what, how long, what it costs, what it is likely to change. Mark the one the policy would take. Mark a response that would arrive too late. Show a blocked choice with its reason when the player would expect it to be there ("the wand: Flint is standing on it"). Focusing a row lights its spot or route in the place panel and shows where it would finish among the coming events. Number keys pick rows.
- **CBD78.** The result reads by what was at stake. A drill reports who touched first and what each learned. A duel reports the point, the wager and who watched. A hunt reports the quarry, the meat and what was spent. An escape reports who got away and what was left behind. Each side has its own line: what it gained, lost, learned and who saw. Totals of damage stay in the full account.
- **CBD79.** An environment brings four things to a fight: its spots (CBD69), its conditions (light, footing, noise, crowding, weather), the people who may step in, and the local rules with what answers afterwards. The same charm plays as three different fights in one school:

| Where | Spots and conditions | Who steps in | Rules and aftermath | Likely ending |
| --- | --- | --- | --- | --- |
| Corridor between lessons | Stairs, an alcove, a classroom door. Crowded, noise carries | A prefect or teacher, sooner the louder it gets | Magic in corridors is against the rules by default: points, detention, the year knows by dinner | One hit and scatter, or caught |
| Duelling club | A marked strip, onlookers at the walls | A referee who stops it at a disarm | Allowed. Standing among those watching | Disarmed or yielded |
| Forest at night | Roots, trunks, a slope. Dark, quiet | Nobody by default | Out of bounds. Injuries need explaining tomorrow | Driven off, hurt, or fled |

- **CBD80.** Other environments differ on the same four. A clan training ground has elders watching and rewards restraint. A mountain wild has nobody coming and the weather as a condition. A city street at night has gaslight, bystanders and a police whistle, and in a world where powers are hidden the cost of using one in view is exposure. A cramped room hampers long weapons and makes furniture matter. A banquet keeps a fight covert and social. A boat or rooftop adds footing and a fall. A dream or spirit setting changes which means count at all.
- **CBD81.** A fight starts by answering seven questions from existing state, in order. Why: the trigger and what each side wants. What kind: the nearest FK preset. Where: spots from the place, conditions from the hour and weather. Who: fighters, bystanders and those who may step in, each with the means they actually carry. Who knows: surprised, wary or waiting. Where each begins: from what they were doing, such as at a desk or at the thicket edge. How closely: policy or pause (CBD56). A question with no answer takes the kind's default. The first Reports line states the answers the character can perceive.
- **CBD82.** The environment acts during the fight. A bell, a teacher on the stairs, dusk or rain arrive on the same clock as the fighters' moves and appear under "Coming" when the character can notice them. This is how a corridor fight ends by intervention without a special rule.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD83 | Play the same charm exchange in the three school settings of CBD79. | Sol, medium each after the first tie-in | Each run starts from CBD81's seven answers with no hand-built scene for at least one. The three differ in ending, in who knows afterwards and in what the next day inherits. In the corridor, noise brings someone sooner and the player could see it coming. Layout follows CBD75 at desktop size with rebuilt browser evidence. |

### Round 17 suggestions (separate from the palette)

- Mock CBD75's layout for one routine and one paused fight at desktop size before engine work.
- Give each world's naming sheet a short list of place kinds with their usual interveners, so CBD81 has defaults to fall back on.

## Round 18. Unknowns, allies, pace, growth and what a world supplies (2026-11-13)

Weibao asked to keep designing. This round places earlier knowledge rules on the round 17 screen and takes five threads the 2026-11-13 rounds had not touched. These are proposals.

**ACT NOW.** Checked round 1 so this round adds to it. CBC20–CBC23 already make opponent facts and intent learned fields and deception a mechanism. CBC37–CBC39 give each world a combat grammar, off-label use by mechanism and cross-world powers under local law. CBC42 puts party and solo fights on one engine. RPT rules group repeated Reports lines with a count. Source and owner review only.

### ACCOUNT FOR NOW

- **CBD84.** Unknowns have a place on the screen. A foe's line shows what the character knows and how ("carries a revolver: you saw it"; "left hand in his pocket: unknown"). "Coming" shows a tell without a name when the action is unread (CBC21). A blank reads as a blank, so the player can tell an empty hand from an unseen one.

```
FOCUS: Howes Street, past midnight
The man by the gaslamp has stopped walking.

Him     dark coat, ten paces. Revolver under the coat (you saw the grip).
        Left hand in his pocket: unknown.
        He has not looked at the alley: he may not know it is there.
Coming  he is drawing breath to speak, or to do something else.

  1 Watch his hands (2s). You may learn what the pocket holds.
  2 Speak first (1s). He answers or he acts.
  3 Step toward the alley mouth (2s). Out of the lamplight.
  More
```

- **CBD85.** Looking is an action with a price. Watching, probing with a feint, or testing a ward spends time on the same clock and may fill a field. In a confrontation where recognition decides the outcome (CBD44), these are the main moves and blows are the short ending. What is learned stays with the character afterwards (CBC20).
- **CBD86.** The encounter starts before the first blow. First sight is the first pause when something is new: the player can avoid, speak, choose ground, prepare or strike first, and the other side has the same options when it noticed first (CFC5). A policy answers this pause for familiar meetings, which is how a routine hunt begins without a prompt.
- **CBD87.** Allies have their own aims and their own policy. An ally appears by spot like anyone else and their next action shows under "Coming". What the player can do depends on the tie: ask a friend, order a subordinate, signal a trained animal, each with a chance of being heard and followed. Someone to protect is an objective that lives in the scene, since they can be moved, hidden or sent to the way out (CBD47).
- **CBD88.** Fight text has a reading pace. A watched fight delivers lines at a rate the player sets and folds repeated plain lines into one with a count ("Wang Er: punch misses you (3 times)."), giving separate lines to events that change a place, a means, a wound or a choice. A pause holds the text still. An unattended fight writes its result and turning points (CBD64). The dial runs from each blow to result alone.
- **CBD89.** Two clocks, one conversion. A fight runs in seconds and the day runs in minutes and hours. A fight takes the game time it took plus what follows it (catching breath, binding a wound, dealing with the body or the witness), and the day clock advances by that. An unattended fight settles at once in real time and still spends its game time and stock (CBR26).
- **CBD90.** Growth shows as quieter fights and wider options. What the character did is what improves. A practised fighter's policy handles more without pausing, reads more tells, finishes common actions sooner and sees options a novice lacks. Knowing a place adds its spots before the fight starts, and knowing a kind of foe fills its fields. A new character's fights ask more and offer less, and that changes with use.
- **CBD91.** A world's fights are mostly rows. To fight in a new world the engine needs from that world: its moves written as what they do to bodies, things and places (AD38); the means those moves draw on; its place kinds with their usual conditions and interveners (CBD79); which endings are usual and what answers afterwards (FK dials, CBC37); and a report voice (CBD19). A move that needs an effect the engine lacks is the case that costs code. This is the feasibility answer for many worlds: list what a world's signature fights need and count the effects that are missing.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD92 | For Gu, Hogwarts and LOTM, fill CBD91's list from each world's existing moves and name the missing effects. | Sol, small per world, read-only | One table per world: moves on hand, means, place kinds, usual endings, voice sample, and each signature fight's missing effects with the nearest existing one. The count of missing effects ranks which world's fights are closest to playable. |
| CBD93 | At a selected LOTM tie-in, play one confrontation where looking decides it (CBD84–CBD86). | Sol, medium for one encounter | An unknown field is visible as unknown. A look action spends time and fills it or fails for a stated reason. The filled field changes an available choice. The same meeting replayed with the knowledge already held opens differently. |

### Round 18 suggestions (separate from the palette)

- CBD92 is read-only and could run before any tie-in, since it sizes the work for each world.
- Add fight reading pace to the existing speed and Reports settings instead of a new control.

## Round 19. Covering what nobody listed (2026-11-13)

Weibao asked "how to cover all the possibilities and more? Do we provide the options but then make selection automated unless otherwise?" Round 14 answers the second half in outline. This round takes the first half: how a short list of verbs reaches actions no one wrote down, and how the player asks for one that is not offered. These are proposals.

**ACT NOW.** Checked the owners. The [effect grammar](PROCEDURAL_FOUNDATION_PLAN.md#one-effect-grammar-for-every-world) has about ten verbs (move, add, remove, transform, bind, sense, conceal, copy, block, alter a law field) and `moveFromSentence` in the [contest](../src/contest.js) already builds a move from such sentences (CFC3a). A contest entrant holds a fixed list of move ids, and CFC1 binds actor and target to entrants. CBC11 and CBC38 already say improvised weapons and off-label techniques work by mechanism, without saying where the option comes from on screen. The [play beyond menus guidance](PLAY_BEYOND_MENU_SELECTORS_CONSIDERATIONS_2026-10-14.md) warns against promising a freeform experimentation engine, and [D1](EMERGENT_SYSTEMS.md#about-ai-writers-llms) lets outside text propose an action that the game then validates. Source and owner review only.

### ACCOUNT FOR NOW

- **CBD94.** Coverage comes from combining parts. An action is a verb, a subject, a means and sometimes a manner. The offered list at any moment is generated from what is in the scene and in hand. A lamp recorded as "holds oil, lit, breakable, light enough to throw" yields throw, pour, snuff and hand over without a lamp row. The check is CX3's: the tenth new object in a scene costs no code.
- **CBD95.** Things carry properties, and properties decide what can be done. A small shared vocabulary (heavy, sharp, lit, brittle, liquid, hinged, alive, held, fixed in place, loud) comes from the thing and material records that making and places already keep. A result nobody listed falls out when properties meet: spilled oil under a lit wand-tip, a wet floor under a charging boar. A world adds its own properties (warded, essence-bearing, cursed) as rows.
- **CBD96.** Three ways to reach an action, by default. Offered: the few intents of CBD57. Browsed: pick a person, thing or spot in the place panel and see what can be done to it. Composed: choose a means, a verb and a subject under "More". The composed route is how the player proposes something unlisted, and it needs no typing. Typing can filter the list. A typed sentence read by a model and turned into the same three parts is a later dial under D1, since the game still validates and settles it.

```
More > Do something else
  With   [the lamp oil]   (left hand)
  Do     [pour]  throw  hand over  drink  drop
  On     [the stairs below you]
  How    plainly  [quickly]  quietly

  Pour the lamp oil on the stairs, quickly (2s).
  You expect: the steps turn slick. Flint has to slow down or risk a fall.
  You do not know: whether it would catch from his wand-light.
  [Do it]
```

- **CBD97.** A proposal gets one of four answers, in the character's terms. It works, with time, cost and risk. It might work and the character cannot tell, so trying is the way to find out (CBD85). It does not work, with the missing piece named and the nearest thing that would: "You cannot lift the desk alone. Tipping it over is within reach (3s)." Or the mechanism is plausible and the game has no effect for it yet, which the game says as itself and writes to a wish list (CX6). The fourth answer is how "and more" grows from play: the list of things tried and unsupported is the build list.
- **CBD98.** Manner multiplies the list without new verbs. Quickly, carefully, quietly, hard and as a feint trade time, noise, risk and force on the same action. Manners that would give the same result here fold away (CBD57), so the row appears when it matters, such as a quiet step in a corridor where noise brings a prefect (CBD79).
- **CBD99.** What worked once is kept. An unlisted action the character pulled off becomes a known trick: it shows among the offered intents when the situation returns, the policy may use it, and it can be taught or copied by someone who saw it (CBC22). This ties CBD90's growth to invention, and it means the offered list for an old hand differs from a novice's in the same room.
- **CBD100.** Everyone draws from the same generator. Foes and bystanders get their options the same way (CFC15), limited by their own bodies, means and wits: a boar does not throw lamps, a thief might. The player can be on the receiving end of an action nobody listed. Budget by default (CX5): a chooser looks at the handful of generated options that touch its aim, and a law can widen that for a named, clever opponent.
- **CBD101.** The subject list is wider than fighters. A subject can be a person, a thing, a spot, a route, an effect already under way (CBD48), a bystander's attention, or a fact someone believes (CBC23). "Make the prefect look the other way" and "let him think the wand is broken" are then the same shape as "strike the boar": a verb on a subject by a means.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD102 | Held-out coverage count. Take about twenty fight actions from scenes in the three leads' books that no move row encodes, and try to write each as verb, subject, means and manner over existing properties. | Sol, small, read-only | A table with one row per action: composes today, composes with a new property row, or needs a new effect. The share in the first two columns is the coverage figure, and the third column is the list of missing effects (feeds CBD92). |
| CBD103 | Mock the browse and compose routes on CBD75's layout for one school corridor scene, at desktop size. | Sol, small, static mock-up | From the mock a reader can reach an action that is absent from the offered intents in three picks or fewer, and can see each of CBD97's four answers once. |
| CBD104 | When the first tie-in exists, generate options from one scene's recorded things instead of a fixed move list, for the player and one foe. | Sol, medium | Add a thing to the place record and a new action appears for both sides with no move row written. Remove it and the action goes. A composed action settles through the same resolver and save path as a listed one. |

### Round 19 suggestions (separate from the palette)

- Keep the wish list of CBD97 as a ledger file beside the game MCP limits ledger, since both record "wanted, not yet possible".
- CBD102 is read-only and pairs with CBD92: one pass could fill both tables per world.

## Round 20. How the policy picks, says why, and gets retuned (2026-11-13)

Second half of Weibao's question: "Do we provide the options but then make selection automated unless otherwise?" Round 14 says yes in outline. This round covers how the pick is made among options, how the player reads the reason, and the ways to overrule or adjust it. These are proposals.

**ACT NOW.** Read the two choosers. `defaultChoice` in the [contest](../src/contest.js) is a fixed order: flee, yield, side morale, guard when threatened, then the first affordable move in the entrant's own move order against the nearest or weakest open foe. Each entrant's `wants` (flee and yield thresholds, guards, a preferred target) is already a small policy record. [contest_choice.js](../src/contest_choice.js) adds three pieces through the chooser port: a scored chooser that rates candidates by harm dealt minus cost with a bonus for a finishing blow, and looks at more candidates at higher level; ordered policy rows with `when` conditions on health, a quantity or move count, a fallback move and a saved cursor; and `compareContestPolicies`, which runs named policies on identical seeds and reports outcomes and stock spent. By grep, its one importer is its own test file, so no played fight uses it yet. The reasons returned are generic ("best open move", "policy row", "scored 12/32 candidates"). Source review only.

### ACCOUNT FOR NOW

- **CBD105.** A policy is a short page of sentences. It has three parts in order: what the character wants and will not spend, standing orders (when this, do that), and what to do otherwise. This is the shape `wants` plus policy rows already have. By default the first order that applies is taken, which keeps the page readable top to bottom. The dial is how much the "otherwise" line thinks.

```
How Fang Yuan fights: hunts, east slope                stance: steady
  Wants     the quarry down. Leaves if essence falls under a tenth.
  Keeps     the liquor worm unless asked.
  1  Take cover first when essence is under a third.        used 4 times
  2  Recover my own weapon when the route is open.          used once
  3  Leave when a second beast shows.                       not yet used
  Otherwise  the best open move he knows.
  Asks first: anything new, lasting harm, a person's life.
```

- **CBD106.** "Otherwise" weighs options by what the character values. For a situation no order covers, the policy rates a handful of generated options (CBD94) on a few named values: progress toward the objective, harm risked, stock spent, time, and being seen. The existing scored chooser rates harm and cost alone, so an objective such as "get the wand" or "leave unseen" currently has no weight. Odds come from the same rule the fight runs on (CFC12), read through what the character knows (CBC20), so a feint can mislead a policy as it can a player.
- **CBD107.** Skill sets how well the policy thinks. A novice considers the obvious two options and judges them roughly. A practised fighter considers more, including tricks kept from earlier fights (CBD99), and judges timing better. The scored chooser's level already maps to candidate count. This gives CBD90 a mechanism and CBD60 a dial: the policy is as good as the character, and the player's hand adds what the character has yet to learn.
- **CBD108.** Each pick records its reason and the runner-up. The line names which order fired or which value decided, and what was passed over and why. Routine results show reasons for the turning points (CBD64), and the full account shows them for each action. Generic reasons like "policy row" are engine text and would be replaced by the order's own sentence.

```
0:12  Stepped behind the pine.   Order 1. Passed over: moonblade now (it would land late).
0:15  Loosed the moonblade.      Best open move. Passed over: waiting (the boar was turning).
```

- **CBD109.** Stance is the coarse retune. A stance is a named setting of the values in CBD106: careful, steady, all in, quiet (avoid being seen), sparing (save stock), merciful (CBC32's subdue). It can be set per character, per kind of fight and per place, and changed at any pause. Worlds can name their own stances. Most retuning would be one stance change, with orders for the specifics.
- **CBD110.** Four sizes of override, each one step from where the player already is. Once: take this action by hand and the policy resumes (CBD38). This fight: change stance or say "hold" or "leave" from now on. From now on: edit, reorder, pause or drop an order on the policy page. By example: open a finished fight's account, pick a moment, and say what should have happened.
- **CBD111.** Retune by example shows its effect before it is kept. From the picked moment the game drafts the order that would have produced the wanted action, then replays recent saved fights of that kind with and without it and reports the difference: "would have changed 2 of your last 10 hunts: one faster, one lost the quarry". `compareContestPolicies` and seeded restores (CFC16) are the existing parts. The player keeps, edits or discards the draft.
- **CBD112.** Orders can go stale or collide, and the game says so outside the fight. An order naming a Gu that is gone, a place that changed or a foe that no longer exists is flagged when preparing. Two orders that both apply resolve by position, with a one-time note. An order that led to a loss is marked in that result ("Order 1 sent you behind the pine. The pine was gone since the storm."). An order unused for a long stretch can be offered for removal.
- **CBD113.** The policy has a spending and consequence leash. By default it asks before acts that cannot be taken back: ending a person's life, using a one-use item, showing a hidden power in view, breaking a local rule before witnesses (CBD79). A stock cap per fight ("no more than a third of essence unasked") covers the rest. Each item on the ask-first list is a dial the player can loosen for a character or place. In away play an ask resolves to the cautious option (CBC25).
- **CBD114.** Foes have the same page, and it can be learned. A named opponent's habits are its orders and stance. Watching, fighting or asking around fills them in as learned fields (CBC21, CBC22), and a filled line changes the player's options: "it charges after turning" becomes something to prepare for. A foe that survives can add an order against what beat it. This is the opponents-who-remember inspiration in the digest, on a record the engine already keeps per entrant.
- **CBD115.** Orders belong to the character and can move between people. A teacher's orders can be taught, a subordinate can be given the player's page for a kind of fight, and a manual or drill can supply a starting page for a weapon or school. A new character or a new world starts from a stance and a taught page instead of an empty one, which answers where a policy comes from before the player has answered any pause (CBD59).

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD116 | Mock the policy page and the reasons in a full account at desktop size, for one hunt. | Sol, small, static mock-up | A reader can say what the character will do in three described situations from the page alone, and can find why one past action was taken and what was passed over. |
| CBD117 | At the first tie-in, give the scored chooser one value beyond harm and cost (objective progress), headless. | Sol, medium | On identical seeds, a "get the wand" objective changes at least one pick against the harm-only chooser, and the recorded reason names the objective. Existing chooser tests stay green. |
| CBD118 | Retune by example on saved fights, headless first. | Sol, medium, after CBD117 | From one logged moment, a drafted order reproduces the wanted action on replay. A with and without comparison over ten saved fights of the kind reports changed outcomes and stock. Discarding the draft leaves the saved policy byte-identical. |

### Round 20 suggestions (separate from the palette)

- Write the reason wording once per world voice (PRS7) before CBD108 is built, since reasons appear in routine results.
- Record in the area guide that `contest_choice.js` exists and has no played caller yet, so a tie-in lane finds it before writing another chooser.

## Round 21. Losing, contests that are not fights, and stopping in the middle (2026-11-13)

Three angles the 2026-11-13 rounds had not reached: what a loss looks like on the round 17 screen and what it opens, how a chase, an exam or an argument sits on the same frame, and what happens to a fight when the game is saved or closed partway. These are proposals.

**ACT NOW.** Checked round 1 and the contract so this adds to them. CBC4 makes downed a window, CBC5 gives the winner the choice, CBC6 routes a fated character's defeat, CBC34 puts social conflict on the same outcome model and CBC36 lets losing teach. [CFC14](CONTEST_CONTRACT.md) notes a debate or trial as a law whose moves land on standing or composure, marked as unbuilt. [pursuit.js](../src/pursuit.js) already runs the long form of a chase, with evidence leading travel between places. CFC16 saves the contest record and a reload continues to the same end (tested); the log lines I read hold time, actor, move and outcome, and I found no saved field for a pause with its offered choices. Source and owner review only.

### ACCOUNT FOR NOW

**Losing**

- **CBD119.** A loss is played as a scene. The downed window of CBC4 runs on the same frame with the player as its subject. What the player can do follows their state: a beaten, conscious character can speak, bargain, play dead or crawl for the way out, and an unconscious one has nothing to pick. Then the player reads where they wake and how they know what happened: seen, told by a witness, worked out from evidence, or blank. A blank is content ("you do not know who carried you here").
- **CBD120.** The cost of a loss is itemised, and each item names a way back by default (AD19). What was taken, now in someone's hands and traceable. What was hurt, with its healing route. Who saw, and what they now think. What the winner learned about the character's methods (CBC22). How much time passed. Each line is a lead the character can follow or leave, so a loss adds things to do. A harsher world, forewarned at entry, can shorten the ways back (CBX4).

```
You wake on the stream bank. It is past dark.
  Taken    the moonlight Gu is not on you. Drag marks lead uphill.
  Hurt     left forearm, deep. It needs binding before it will hold a blade.
  Seen     nobody you know of.
  Unknown  how long you lay here before the cold woke you.
What went wrong: the charge reached you with your essence already spent.
  It might have gone otherwise with more essence, or from behind the pine.
```

- **CBD121.** Most losses are partial, and the result says which part. The objective failed and the character walked away. The fight was won at a price above what it was worth. The fight was won and the point was lost (CBD20). The result line carries both halves, and the review names the turning point with what the character did not know at that moment, in a form the player can read.
- **CBD122.** A loss ends with what might have changed it. Up to three leads drawn from the turning point, limited to what the character could infer: more of a stock, a fact about the foe, different ground, help. They read as the character's own thoughts and can be wrong when the character's beliefs are wrong (CBC23). An unbeaten foe stays where it is and remembers (CBD114), a beaten one stays beaten (AD28), and the place keeps the damage (CBD70), so coming back is a different fight.
- **CBD123.** Losing on purpose is an option like any other. Throwing a spar to hide strength, yielding early to keep stock, or taking a beating so someone else gets out are stances and intents (CBD109). The world reads the result it saw, and the truth stays with the character (AD7). A watcher with the means to tell can see through it.

**Contests that are not fights**

- **CBD124.** Four parts of the frame carry over unchanged: sides with aims, a scene of subjects, a list of what is coming, and a quantity whose running out ends it. A kind of contest names its spots, its ending quantity and who steps in. The rest (pauses, intents, composed actions, policy, result by stake) is shared.

| Contest | Spots | Coming | What runs out | An unlisted action that fits |
| --- | --- | --- | --- | --- |
| Chase on foot | Stretches of the route, turnings, crowds, doors | The gap closing, a cart crossing, a dead end ahead | The gap, or breath | Tip a stall behind you |
| Written exam | The questions, the clock, the proctor's desk | Time calls, the proctor's walk | Time, then nerve | Skip ahead and come back |
| Argument | The people listening, the points raised | What the other is about to say | Composure, or the listeners' patience | Ask them a question instead |
| Sport or match | The field's zones, the goal, the referee | The ball's arrival, the whistle | Score against time, stamina | Play for the foul |
| Haggle | The goods, the other buyers, the door | The seller's next price, a rival's bid | Willingness on each side | Start to leave |
| Getting past unseen | Shadows, cover, the watcher's path | The watcher's turn, a noise | Attention | Send a noise elsewhere |

- **CBD125.** Routine ones settle to a line, as fights do. A familiar quiz, a daily haggle or a practised climb runs on the policy at zero prompts and pauses on something new (CBD56): a question of a kind the character has not met, a seller who will not move, a guard on a different round. The study, trade and stealth done beforehand are the preparation (CBD58).
- **CBD126.** A contest can change kind partway without changing screens. An argument becomes a shove, a duel ends in talk, a chase ends in hiding. The aim line and the ending quantity change and the options regenerate from the same scene. Raising it to violence is an action that the policy asks about first by default (CBD113), and the other side can do it too.
- **CBD127.** Close and long forms hand over to each other. A chase inside one place is the frame; once the quarry is out of sight it becomes the existing pursuit record, and contact reopens the frame. An exam is one sitting in a term's study. A trial is several arguments with days between. The frame covers the sitting and existing owners cover the span.

```
FOCUS: Common room, after curfew. You want Percy to let it go.
Percy   by the portrait hole, arms folded. Sure of the rule, less sure of you.
Here    six first-years pretending to read. The fire. The stairs up.
Coming  he is about to ask where you were.

  1 Tell him the truth, briefly (2s). He respects that, and then has to act on it.
  2 Ask what he is doing up (1s). Puts the question back on him.
  3 Say nothing and go up the stairs (3s). Ends it tonight. He remembers.
  More
```

**Stopping in the middle**

- **CBD128.** A pause is saved state. The question, what triggered it and the choices as offered are kept with the fight, so a reload shows the same pause. The choices are regenerated on load and compared; if they differ because the game changed between sessions, the pause says so. Reading pace position and any half-built composed action (CBD96) can be dropped on reload by default, since they are cheap to redo.
- **CBD129.** Closing the game holds a fight at its next question. A fight paused for the player waits, and no game time passes in it. A fight running on policy when the game closes continues under away rules to its end or its next ask, then holds (CBC25). The return summary leads with any fight that is waiting and what it is waiting for. The dial is how much away play may settle alone, set with CBD113's leash.
- **CBD130.** The same action after a reload gives the same result, and a different action gives a different future. This is how the seeded record already behaves (CFC16). It makes a reload a way to try another choice, which suits a sole player (AD22), and a poor way to fish for a luckier roll on the same choice.
- **CBD131.** What-if replay as a tool. From any logged moment of a finished or saved fight, branch a copy and play it differently as practice. The copy spends nothing and changes nothing in the world by default. It gives the tactician mood (CBD66) a place to learn a foe, and it is the hand-played form of CBD111's replay. Whether a replay may ever replace what really happened is a limit-shaped question and is listed for Weibao below.
- **CBD132.** A good pause can be kept as a scenario. A mid-fight state worth returning to ("the slope with low essence") saves as a named practice scenario and as a DEV fixture for verification (AD54). Later rule or policy changes can then be tried against situations that actually came up in play.
- **CBD133.** A saved fight whose rules changed underneath it has a stated fallback. A law carries a revision. By default a fight saved under an older revision finishes under the new one when its record still validates, and otherwise is called off from its starting state with what was spent returned and one line saying why. Old saves are disposable for now, so this is a low dial setting to record, with migrate-on-load as the later form.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD134 | At the first live tie-in, play one loss through to waking. | Sol, medium on top of the tie-in | The downed window offers the choices the character's state allows. The waking text itemises taken, hurt, seen and unknown. One taken item can be followed to its holder. A second visit to the same foe and place differs from the first. Save and reload inside the downed window and compare with an uninterrupted run. |
| CBD135 | One non-fight law, headless: an argument whose moves land on composure and the listeners' patience (CFC14). | Sol, medium | The same record, clock, chooser and save path run it with no change to the contest kernel. It ends by a typed outcome (yielded, withdrew, drove off). One composed action from CBD96 settles through it. A policy completes a familiar one with zero pauses. |
| CBD136 | Pause persistence. Save at a pause, reload, export and import. | Sol, small after a tie-in has pauses | The same question and choices appear after each route. Picking the same choice gives the same next event as an uninterrupted run. A changed law revision produces the CBD133 line. |
| CBD137 | What-if replay, headless first. | Sol, small to medium | Branch from a logged moment, play three different actions, and confirm the original record and world are byte-identical afterwards. |

### Round 21 suggestions (separate from the palette)

- For Weibao (a limit, so his call under AD56): whether a what-if replay can be promoted to replace the real result. The working default above is that it stays practice, with promotion as a dial.
- Angles still open for later rounds: fights at larger scale, cross-world fighters meeting on one frame, and sound and motion cues.
- CBD135 is the cheapest proof that the frame is wider than fighting, since it needs no scene or UI work.

## Round 22. The same frame at larger size (2026-11-13)

Weibao asked to keep designing. This round takes fights bigger than a handful of people: a street brawl of twenty, a clan raid, a battle. These are proposals.

**ACT NOW.** Checked the owners. CBC40 treats war as politics settled by terms, with the player often behind the line. FK8 (holding a place) and FK9 (skirmish and battle) are presets whose dials exist: crowding caps, a side that routs at `breakAt`, and far settlement (CFC12). CBD73 groups a crowd by spot on screen. The [sizing audit](audits/COMBAT_WORLD_SIZING_2026-11-13.md) lists third parties (G2) and allies with their own choosers (G7) as shared gaps. The contest budget is 400 meetings before a stalemate (CFC16), which a battle of individuals would pass quickly. Source and owner review only.

### ACCOUNT FOR NOW

- **CBD138.** Size changes the unit and keeps the frame. A spot becomes a part of the field (the gate, the wall, the ford). A fighter becomes a group with a count, a condition, its nerve and whoever leads it. A move becomes an order that takes minutes. Sides with aims, a scene, a list of what is coming and something that runs out all stay. Three working sizes: a skirmish of individuals (FK9), an engagement of groups in one place, and a battle of groups across several places over hours.
- **CBD139.** A group is a count until someone in it matters (CX4). "Nine clansmen at the gate, tired, holding" is enough to settle and to read. A member becomes a person with a line when the player can affect or learn about them: a friend, a rival, the one who shouts the order, the one who breaks. The player's own body stays individual at each size.
- **CBD140.** The seat decides the screen. A fighter in the line sees their own few spots, and the battle around them arrives as conditions and coming events ("the left is giving way"). A leader sees groups and gives orders. Someone behind the line (smith, healer, runner, CBC40) plays their own contest, such as getting arrows to the wall before the gate goes, with the battle as its clock. One battle then gives three different kinds of play, and a life that does not fight still has a part in it.

```
FOCUS: The east gate, second hour. Your squad holds the left of the gate.
You     at the cart barricade with five of yours. Spear sound. Winded.
Them    about a dozen at the gate mouth, pressing. More behind, number unknown.
Here    the barricade (cover). The well yard behind you, a way back.
Around  the right of the gate is holding. The wall above has stopped loosing.
Coming  soon   their second rush.
        later  someone on the wall is waving at you. You cannot hear him.

  1 Hold with the squad. They follow you while you stand.
  2 Send Bao up to the wall to find out (about 2 minutes, one fewer here).
  3 Fall back to the well yard. The left of the gate opens.
  More
```

- **CBD141.** Orders and news travel. An order to a group takes time to arrive, and can be misheard, lost with its runner or refused (CBD87). What a leader knows of a far group is as old as the last report, and the screen shows that age. A world's means shorten it: a signal Gu, a charmed coin, a horn code. This makes the knowledge rules matter at size and gives runners, signals and scouts real work.
- **CBD142.** One near frame inside a far one. The battle settles at group grain (CFC12's far detail) while the player's own surroundings run near. The outer feeds the inner's "Coming" (the gate breaks), and the inner feeds the outer (the player drops their champion and that group's nerve falls). Default budget: one near frame at a time, placed where the player is.
- **CBD143.** A strong individual at size works by mechanism. In worlds where one person outweighs a company, their moves address groups and spots as subjects: an effect over the gate mouth lowers a count and breaks nerve. Numbers push back the same way, through crowding, spent means (FK11) and attention split many ways. How far one person's power scales is the world's own fact (CBC41), read from its moves.
- **CBD144.** The result is told per seat (CBD78). The war line, the group's line and the character's own line can differ: "The gate fell. Your squad came out whole. You are owed for the wall." Losses are itemised at group size (CBD120), and the dead who had been promoted to people are named.
- **CBD145.** Long fights have lulls, and a lull is a pause with preparation in it. Between rushes the choices are binding wounds, resupply, moving, talking to the frightened, or sending word. A routine posting ("hold with my squad") runs on policy at zero prompts and pauses on something new, as a daily fight does (CBD56).

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD146 | Headless engagement: two groups as counted entrants with nerve, one near frame nested around a single fighter. | Sol, medium, after a tie-in | Finishes inside the meeting budget. An outer event appears in the inner frame's coming list. Changing the inner result changes the outer one on the same seed. Save and reload mid-engagement matches an uninterrupted run. |
| CBD147 | Write the same engagement from three seats (line, leader, behind the line) as static text at desktop size. | Sol, small, mock-up | Each seat's screen offers different choices from the same events, and a reader can say what each seat does not know. |

### Round 22 suggestions (separate from the palette)

- Read the war research in `docs/research/warsim/` for group nerve and report delay before CBD146, so the dials start from a source.
- A clan raid in the Gu opening and a school-wide brawl are the two nearest canon uses to size this against.

## Round 23. Fighters from different worlds on one frame (2026-11-13)

What happens when a Gu master meets a wizard, or a visitor brings a power the place has no word for. These are proposals.

**ACT NOW.** Checked the owners. CBC39 says an imported power works by its own law and meets local enforcement. A contest takes one law, and CFC3a already lets a move run an entrant's own working on that working's law, read back as effect sentences, with `quantityOf` mapping grammar objects onto a world's body quantities. [WER9](WORLD_ENTRY_RULES.md) states what carries across a crossing and WER12 makes how a world reads an outsider a dial. The foundation plan lists carrying a charm's effect into a Gu as FN6. Source and owner review only.

### ACCOUNT FOR NOW

- **CBD148.** A fight has a host and guests. The place's world is the host: its conditions, its interveners, its usual endings and its report voice. A visitor's moves arrive as sentences in the shared grammar, run their own working, and land on the host's bodies through a mapping. The cases worth designing are where the mapping is partial or missing.
- **CBD149.** A foreign effect meets a local body or defence in one of three ways, decided per pair of mechanisms and written as rows with an in-world reason. It maps: fire burns in either world. It maps in part: an effect on a soul meets a body whose world keeps no such quantity, and lands on the nearest thing with a stated conversion. It finds no purchase: there is nothing for it to act on, or nothing local that knows how to stop it. The third case cuts both ways, so being foreign can be a weakness or an opening.
- **CBD150.** A power needs its fuel, and the host may not supply it. Essence without primeval stones lasts as long as the carried stock. A wand works where the magic is in the caster. A visitor's fights therefore lean toward attrition (FK11) until they find a local substitute, and finding one is a long pursuit of its own (digest: long play).
- **CBD151.** Not knowing is the largest effect. Locals have no learned fields for a visitor's moves, so tells go unread (CBD84) and their policies pause, hesitate or overreact. The first use is the strongest, and each use teaches those who see it (CBC22). The visitor's standing choice is how much to show. The reverse holds too: the visitor's own policy has no orders for local threats and will ask more.
- **CBD152.** The world answers an outsider through its own people. Beyond enforcement (CBC39) there is curiosity, fear, worship, an offer, or capture for study, each from someone with a reason and the reach to act. The list of who may step in (CBD79) gains whoever in that world notices outsiders (WER12).
- **CBD153.** No shared power number. A cross-world matchup is read from the mechanisms: the odds come from sampling the fight itself (CFC12) and are shown as the character's estimate, with low confidence against an unknown kind. Rank in one world says little in another until the pair rows of CBD149 are known.
- **CBD154.** A fighter with two systems combines them by mechanism. Composed actions (CBD96) can take a means from each world, such as a charm cast on a Gu, when the pair rows allow it. The cost is whatever the mechanisms charge. Nothing is balanced by rule, and what pushes back is someone in the world who objects (design framing).
- **CBD155.** The host's voice describes what it does not know. A duelling club sees "a pale crescent of light that cut the strip in two", and the word moonblade appears once someone there has learned it. The visitor's own account uses their names. This keeps knowledge honest in Reports and gives a sealed or unfamiliar power its discovery route.

```
Duelling club, Thursday. Onlookers at the walls.
The new boy did not raise a wand.
  A pale crescent of light crossed the strip and split the practice dummy.
  Nobody in the room has a name for it.
Flitwick has stopped the bout. He is looking at the boy's hands.
Coming  a question you will have to answer.
```

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD156 | Headless: one Gu move entered in a Hogwarts duel law through the existing bridge. | Sol, small to medium | The move runs on its own law and lands on a host quantity. The test lists which effects mapped, mapped in part or found no purchase. The local chooser's recorded reason shows it had no answer the first time. |
| CBD157 | Pair table for Gu, Hogwarts and LOTM: each world's main effect kinds against the other two worlds' bodies and defences. | Sol, small per pair, read-only | One row per effect kind with maps, partial (conversion named) or no purchase, and the source or reasoning for each. Extends CBD92's per-world tables. |

### Round 23 suggestions (separate from the palette)

- CBD157 would also serve crossings outside fights (healing, potions, wards), so offer it to the world entry owner before writing it here alone.
- Decide the fuel answer (CBD150) per crossing method when a world pass fills WER9.

## Round 24. Sound, motion and the feel of a text fight (2026-11-13)

How a fight played in panels of text gets weight, rhythm and warning. These are proposals.

**ACT NOW.** Checked the owners. [UR91](UI_RULES.md) has one settled event drive its line, effect, sound and recap, text first, with silence available as an effect and reduced motion, an effects slider and a mute as player settings. UR62 binds cues to the actual subject and reconciles them on load. [settled_text_effects.js](../src/settled_text_effects.js) plays presentation after the save settles and holds no simulation. The versus view respects reduced motion. CBD29 says cosmetic motion grants no reaction time and CBD88 sets a reading pace. No owner lists which fight events get which cue. Source and owner review only.

### ACCOUNT FOR NOW

- **CBD158.** A cue row per kind of fight event. Each kind (a tell, a release, a landing, a miss, an interruption, a change of spot, a thing dropped or broken, an arrival, a pause, an ending) names its line, its mark in the place or You panel, its motion and its sound, any of which can be blank on purpose. Renderers read the settled event (UR91). This is the fight's share of CBD63's four moments.

| Event | Line | Mark | Motion | Sound |
| --- | --- | --- | --- | --- |
| A tell the character can read | "The boar gathers itself." | Entry under Coming | The entry steps in | A low breath |
| A landing that changes a means | "Your wand is out of your hand." | Wand appears under its new spot | The row moves once | A clatter, from that side |
| A plain exchange | Merged into one line | None | None | None |
| A pause | The question, in the focus panel | Focus panel edge held | Text stops | One soft tone |
| Lasting harm | Its own line, after a beat | You panel row changes | None | Silence |

- **CBD159.** In a text fight, timing and spacing are the motion. A turning point gets a line by itself and a short beat before it. Plain exchanges merge (CBD88). A long line reads slow and a short one reads fast, so cause lines for sudden events are written short (PRS rules). This costs no art and still works with motion, effects and sound turned off.
- **CBD160.** Lead the eye to what changed. When a subject changes spot, drops something or is hurt, its row marks once and settles. During a pause the screen holds still so the player can read (CBD53). Under watched auto-play, entries under "Coming" step upward as they near. Default: one marked change at a time, in the order the events settled.
- **CBD161.** Sound is something the character hears. Noise is already a scene condition (CBD79), so a whistle from the stairs can be heard, with a side, before any line names its source, and an unknown sound is an unread tell (CBD84). With sound off the same fact arrives as text ("a whistle, from the stairs"). A deafened or distracted character hears less, by the same rule.
- **CBD162.** Weight follows stake and rarity. A routine fight is a quiet result line. The first time something happens gets the fuller treatment and the hundredth is plain (UR91's ladder). The heaviest events (a death, a lasting wound, a treasured thing broken) get stillness and room on the page in place of a bigger effect.
- **CBD163.** A world has a cue palette. Gu fights and wand duels differ in what a tell sounds like and how a release moves, so cue rows are world data with a shared fallback. This adds a sixth item to what a world supplies (CBD91). A visitor's unknown power can use the host's "unfamiliar" cue until it is learned (CBD155).
- **CBD164.** Taking over is live at all times. Presentation does not eat input: a key that takes control or skips ahead works mid-line and mid-motion, and the fight state is already settled underneath (CBD29). Resuming from a pause gives one beat so the player sees what their choice did before the next event.
- **CBD165.** Cues do not queue up while away. A return shows the summary with no replayed effects, and at most one cue for the event that most needs attention, such as a fight waiting on a question (CBD129, UR62).
- **CBD166.** Each cue has a text equivalent, checked. With motion, effects and sound all off, a fight reads the same and offers the same warnings at the same moments. Fight reading pace joins the existing three settings (CBD88).

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD167 | Cue table as data for one hunt and one duel, shown in a mock at desktop size with settings on and off. | Sol, small to medium | Each event kind in the two fights has a row or a deliberate blank. With all three settings off, a reader gets each warning at the same moment as with them on. |
| CBD168 | Input during presentation, at the first tie-in with watched auto-play. | Sol, small | Pressing take-over during a line or motion gives control at the next decision with no event lost or repeated. Reload mid-presentation replays no reward and attaches no cue to the wrong subject. |

### Round 24 suggestions (separate from the palette)

- Add the cue row to each world's naming or voice sheet so text, mark and sound are written together.
- Angles still open: feuds and rivalries across many fights, what fighting pays and costs over a season, a first fight that teaches the screen, and companions or Gu that fight as beings in their own right.

## Round 25. Three shared gaps as things a player would feel (2026-11-13)

Weibao asked to keep designing on the [sizing audit](audits/COMBAT_WORLD_SIZING_2026-11-13.md)'s first three shared gaps: moves that address a thing, a place or another working (G1), third parties who arrive, watch and step in (G2), and what a fighter knows about a foe with a look action that fills it (G3). Earlier rounds named these on the screen (CBD47, CBD79, CBD82, CBD84, CBD85). This round gives each a mechanism with dials. These are proposals.

**ACT NOW.** Read the audit's nearest-existing column against the code. For G1 the contest binds targets to entrants (CFC1) and `drop` records where an item fell; the Hogwarts spell stack has a wand with a grip and a Finite that ends landed charms. For G2 the [tempo fight](../src/tempo_fight.js) already has a `channelNotice` dial (a concealed effect is caught by a perceive against conceal draw) and remembers a fight as one event per witness, and the duelling club has a proctor standing in a place. For G3 tempo foes carry a `learned` record and the contest has notice and surprise at the opening (CFC5). Source review only.

### ACCOUNT FOR NOW

**G1. Addressing things, places and workings**

- **CBD169.** A subject can be addressed when three things hold: the fighter can perceive it, can reach it, and has a means that acts on that kind of subject. Each of the three failing gives a different blocked reason ("you cannot see where it fell", "Flint is between you and it", "nothing you know ends a charm"). This is the test behind CBD97's answers, and it is the same test for a foe choosing against the player.
- **CBD170.** A thing has custody and condition. A loose thing is taken by whoever reaches it first. A held thing is addressed through its holder's grip, so a disarm, a snatch and a blow to the hand are three routes to the same change. A thing can be covered, kicked away, broken or hidden, and each leaves it somewhere in the place record (CBD70).

```
Things  your wand, under the bench by the east wall. Three paces, past Flint.
        Flint's wand, in his right hand. His grip is good.

  1 Go for your wand (3s). Flint can reach you on the way.
  2 Kick the bench over it (2s). Nobody gets it quickly.
  3 Jinx his wand hand: you have no wand. Blocked.
```

- **CBD171.** A place has state that moves can change: open or blocked, lit or dark, dry or slick, quiet or loud. Holding a doorway, dousing a lamp and flooding a step are moves on a spot. The change outlasts the move and by default outlasts the fight, and it applies to whoever is there, the mover included.
- **CBD172.** A working under way is a row the fighter can pick. It has a stage (gathering, released and travelling, or sustained) and something that holds it: the caster's attention, a gesture, a drawn circle, a fed Gu. What can answer it follows the stage. Gathering can be interrupted at its holder. Travelling can be blocked, dodged or met. Sustained ends when its holder is broken or its cost goes unpaid. An effect already landed is a condition on its subject and takes a remedy.

```
Coming  1s  Flint's jinx is in the air, toward you. Green, fast.
        4s  the shield you started will be up. Too late for this one.

  1 Drop behind the bench (1s). It meets the bench.
  2 Finish the shield anyway (4s). It covers the next one.
  3 Let it land and keep your aim (0s). You take it. Your own cast goes first.
```

- **CBD173.** A bound being is a subject apart from its master. A Gu, a familiar or a summoned thing has its own body, place and condition. It can be struck, seized, starved of what feeds it or turned, and its master can lose its use while standing unharmed. What the master feels through the bond is the world's own rule.
- **CBD174.** A working can be the stake. A ritual, a ward being raised or a long cast is progress on the clock, and the fight is about whether it finishes (CBD124's "what runs out"). It can be stopped at any of its holders: the celebrant, the altar things, the circle on the floor, the supply. Each is a different target with a different guard on it, so a fight around a ritual has several ways in.
- **CBD175.** Opponents use all of this by the same test. A foe can stand on the wand, bar the door or go for the Gu when its aim and wits suggest it (CBD100). A beast mostly addresses bodies. A trained duellist addresses the wand. The difference shows the player what kind of opponent this is.

**G2. Third parties who arrive, watch and step in**

- **CBD176.** Each bystander has attention that moves through stages: unaware, noticing, watching, deciding, acting. Noise, light, visible powers and how long the fight runs push it along, and distance, walls and the bystander's own business hold it back (CBD79). The screen shows the stage in words for those the character can perceive.

```
Around  two second-years at the alcove, watching.
        footsteps on the stairs above, coming down. A teacher's pace.
Coming  about 6s  whoever is on the stairs reaches the landing.

  1 One more jinx (2s). Loud. It will be seen.
  2 Lower your wand and walk (2s). You are a student in a corridor.
  3 Pull Flint into the alcove (3s). Out of the line of the stairs.
```

- **CBD177.** What a third party does on acting follows their aim and standing. A teacher stops it. A friend joins. A rival fetches someone. A stranger watches and talks later. A constable arrests whoever is still holding a weapon. These are rows on the kind of person, with the usual exceptions for individuals.
- **CBD178.** Attention can be worked on. Hiding the fight, moving it, ending it early, distracting the watcher or giving them a different story are actions on a bystander's attention or belief (CBD101). The other side can do the opposite and shout for help.
- **CBD179.** Help has a caller, a message and a journey. Reinforcements come because someone called (a shout, a signal Gu, a whistle), the call can be stopped or go unheard, and the helpers take real time to arrive from where they were. The player sees the call if the character can, and "Coming" shows the arrival once it is known.
- **CBD180.** A witness keeps what they saw, which can be less than what happened. Someone who came late saw who was standing over whom, and missed who struck first. Aftermath (points, arrest, reputation, a grudge) follows what witnesses believe, so the same fight can cost differently by who saw which part.
- **CBD181.** In a world where powers are hidden, being seen is a cost counted per watcher. Each watcher who caught a power in use holds a fact with a guess at its meaning, and what they do with it (tell, sell, pray, report) is theirs to choose. Tempo's concealment draw already decides who catches a concealed effect, so the missing part is what the watcher then holds.

**G3. Knowing the foe, and looking**

- **CBD182.** Each known fact about a foe carries where it came from and how sure it is: seen, told, read, inferred or assumed. The screen shows the basis in a word. An assumption looks different from an observation, so the player can tell which facts would be worth a look.
- **CBD183.** The estimate is computed from beliefs. "You think you can take him" comes from sampling the fight (CFC12) with the foe as the character believes him to be. A wrong belief gives a confident wrong estimate, which is how a village chief turns out to be far stronger than he looked (Weibao's own example in this file's opening). The estimate line names its weakest basis.

```
Him     the old chief. Unarmed (seen). Slow on the steps (seen).
        Has not fought in years (told, by his nephew).
        Strength: ordinary for his age (assumed).
You think: you would win this easily. That rests on an assumption.

  1 Watch how he moves when the boy drops the jar (a moment).
  2 Push past him.
  3 Leave it.
```

- **CBD184.** A look has three possible results beside time spent: the field fills, the field fills wrongly because the foe is showing a false front (CBC23), or the look is noticed. A noticed look tells the foe the character is wary and can start what it was meant to avoid. Skill at looking shifts the odds among the three.
- **CBD185.** Fighting teaches without a look action. Each exchange can fill fields about what was just used: reach, speed, a move's tell, how much it took out of him. Fields about what has not been shown stay empty. A foe who holds something back stays unknown in that part, and that is a reason for both sides to hold back.
- **CBD186.** The screen also shows what the foe seems to believe about the character, where the character can judge it: "he thinks you are unarmed", "she has seen the moonblade once". Hiding strength, feinting weakness and letting a rumour run are moves on that belief (CBD123), and the reveal is a move with one use per watcher.
- **CBD187.** Knowledge is kept by person and by kind, outside any one fight. What was learned about this man stays about him. What was learned about boars applies to the next boar with less confidence. Books, teachers and rumours fill the same fields before a fight, with their own basis word, and can be out of date.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD188 | G1 in the Hogwarts spell stack, after the loose-wand case (CBD50): one travelling jinx as a pickable row. | Sol, medium | Three answers by stage work or fail for the stated reason: interrupt while gathering, block or dodge in flight, remedy after landing. Each of perceive, reach and means failing gives its own blocked line. A foe picks the player's wand as a target once on a seeded run. |
| CBD189 | G2 as one corridor teacher with attention stages. | Sol, medium | Noise moves the stage sooner on the same seed. The arrival shows under Coming once footsteps are perceivable. A late arrival's record differs from an early watcher's, and the aftermath differs with it. |
| CBD190 | G3 headless: an estimate computed from believed fields. | Sol, small to medium | With one assumed field wrong, the quoted odds differ from the true odds and the estimate names that field as its weakest basis. A look fills it and the estimate moves. A noticed look changes the foe's opening. |

### Round 25 suggestions (separate from the palette)

- CBD190 can run before any tie-in and gives the village-chief case a test.
- When G2 is built, check whether tempo's per-witness fight memory can hold "which part they saw" before adding a new record.

## Round 26. One way of fighting across three engines (2026-11-13)

The sizing audit found three fight engines, with Gu on the contest, Hogwarts on two unjoined stacks and LOTM on the tempo fight. This round asks what they should share so a player meets one way of fighting in each world, without a rewrite as the entry price. These are proposals.

**ACT NOW.** Read what each engine hands to a screen. `tempoView` in the [tempo fight](../src/tempo_fight.js) returns a title, log lines, a who-acts-next strip, the player's means, moves with label, text, time cost, usable, odds word and blocked reason, aims, ally orders, and foes with a learned record. It has three named policies (aggressive, steady, safe) and a hand-over limited to safe moves. The [contest](../src/contest.js) returns an entrant view, a choice with a reason, and log lines of time, actor, move and outcome; positions are a line, and its policy pieces sit in [contest_choice.js](../src/contest_choice.js). The Hogwarts spell stack has named places, a wand as a thing and a proctor (audit F4). The [area guide](AREA_GUIDE.md#fights-and-harm) asks for no further fight loop beside these, and a test keeps LOTM modules out of `contest.js`. All fight paths already publish defeat through one publisher (CBL1, CBL3). Source review only.

### ACCOUNT FOR NOW

- **CBD191.** Share the edges and leave the middles. A player meets one way of fighting when six things match across worlds: the shape of the screen, how an answer is given, the policy page, when a fight pauses, how a result and its aftermath read, and where knowledge of a foe is kept. How a blow is worked out can stay different per engine, which CFC2 already allows inside the contest and which suits worlds that should feel different (AD5).
- **CBD192.** One view shape, filled as far as each engine goes. Each engine projects its state onto the same parts: aim, you and your means, people by spot, things, around, coming, choices, log (CBD75). A part an engine does not model is absent or reduced, and is not invented: a tempo fight shows one spot and its conditions line, and its who-acts-next strip fills "Coming".

| View part | Contest (Gu) | Spell stack (Hogwarts) | Tempo (LOTM) |
| --- | --- | --- | --- |
| Aim line | From the law's endings | Drill call or escape | From the opener |
| Means | Essence, Gu, held things | Wand grip, footing, speech | Health, stamina, loaded rounds |
| Spots | A line with reach | Named places and a path | One, with light and fog |
| Things | Dropped item position | The wand | Stock alone |
| Around | Absent | The proctor | Witness memory, after the fact |
| Coming | Running workings, with timing | Casts in flight | Next three to act |
| Choices | Move rows with reasons | Cast checks | Moves, aims, orders with odds words |

- **CBD193.** One answer shape. A player's answer is a verb, a subject, a means and a manner (CBD94). Each engine takes the part it understands: tempo's move, aim and order fit inside it, and so does a contest move with its target. An answer an engine cannot settle gets CBD97's fourth reply and goes on the wish list, which then doubles as a per-engine gap list measured from play.
- **CBD194.** One policy page over different choosers. Stance names map onto what each engine has: tempo's aggressive, steady and safe, and the contest's `wants`. Standing orders compile to policy rows on the contest and to a filter over tempo's policy pick. The ask-first list (CBD113) is checked on the chosen answer before it is committed, so it needs nothing from the engine.
- **CBD195.** One pause rule, read from the view. Whether something is new (a foe kind, a lost means, a risk of lasting harm, an arrival) can be judged from the projected view and the knowledge store, outside the engines. A routine LOTM street fight and a routine Gu hunt then go quiet by the same rule (CBD56).
- **CBD196.** One knowledge store. Learned fields about people and kinds live outside any engine (CBD187, and the audit's R4 default). Each engine reads them to decide what its view may show and writes what the fight revealed. Tempo's per-foe `learned` record would become a reader of it.
- **CBD197.** One result and aftermath. The publisher gives the typed outcome. The itemised result (CBD78, CBD120) reads from that record plus the place and custody changes. World-specific consequences stay where they are, such as LOTM's heat and wages.
- **CBD198.** One scene source. The place record supplies spots, things and conditions (CBD69), and each engine reads as much as it models. The spell stack reads the most today. An engine that reads less shows less (CBD192), which is an accurate picture of where it stands.
- **CBD199.** What should stay different, and be felt as the world. A Gu fight turns on what was fed and carried and on essence running down across reach. A wand duel turns on cast timing, who holds a wand and where people stand, often under a referee. An LOTM street fight is short, dangerous and counted in rounds, and what is known and who saw matter more than the exchange. With the edges shared, these read as worlds differing and not as three interfaces.
- **CBD200.** Join the Hogwarts stacks at the view first. Default route: the spell stack keeps its places, wand and casts; the contest supplies the clock, chooser, outcomes and save path; and a cast enters the contest as a move that runs its own working, which CFC3a's bridge already does for Gu. One fight would then see both. The dial is how much of the spell stack's scene the contest learns to read versus leaves to it, decided after the loose-wand case has been played.
- **CBD201.** Engines converge when a needed fight is cheaper on the other side. A Beyonder fight that needs workings, counters and a ritual stake (CBD174) is the likely moment for LOTM (audit R4). Until then each engine keeps working and the shared edges hide most of the seam. A projection check keeps this from drifting: one described situation, run through each engine's projection, fills the same view parts or names the ones it leaves out.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD202 | Write the view shape as a schema with two projections, tempo and contest, headless. | Sol, medium | One saved fight from each engine projects to the schema with no engine change. A table of filled, reduced and absent parts per engine comes out of the test and matches CBD192's. LOTM modules stay out of `contest.js`. |
| CBD203 | Render one live LOTM street fight through the shared layout from its projection, mock first, then at desktop size. | Sol, medium, after CBD202 | The existing fight plays to the same result as on the current card on a fixed seed. The player answers in the shared shape. Rebuilt browser evidence at 1920×1080. |
| CBD204 | Stance and pause mapping table for the three engines. | Sol, small, read-only | Each stance names its tempo policy and contest wants. Each pause trigger names the view field it reads. Triggers no engine can supply yet are listed. |

### Round 26 suggestions (separate from the palette)

- CBD202 is the smallest step that makes the three engines comparable, and it changes no fight.
- Record the "share the edges" default in the area guide's fights entry if Weibao takes it, so a tie-in lane does not start a merge by habit.
- Angles still open: feuds and rivalries across many fights, what fighting pays and costs over a season, a first fight that teaches the screen, companions or Gu that fight as beings in their own right, and gaps G4 to G7 in the same felt style as round 25.

## Round 27. The other four shared gaps as things a player would feel (2026-11-13)

Weibao asked for the [sizing audit](audits/COMBAT_WORLD_SIZING_2026-11-13.md)'s remaining shared gaps in the same style as round 25: scene conditions such as cover, terrain and darkness (G4), endings such as first blood, points and capture (G5), lasting conditions such as poison or slow (G6), and allies with their own choosers and orders to them (G7). Earlier rounds placed these on the screen (CBD33, CBD72, CBD79, CBD87) and round 1 set the outcome model (CBC3, CBC18, CBC31, CBC32). This round gives each a mechanism with dials. These are proposals.

**ACT NOW.** Read what exists. For G4 the [contest](../src/contest.js) has positions on a line, reach, a sun direction and a glare rule that cuts evasion against a visible projectile; the [tempo fight](../src/tempo_fight.js) has a conditions record (light, footing, weather, fog) feeding a mishap chance with a cap. For G5 the contest stops at a `limits.landed` count and has outcome names for captured and escaped. For G6 [affliction_track.js](../src/affliction_track.js) is a world-neutral staged affliction (exposure, onset, timed stages, a save at each stage's end, treatment) that no fight engine calls by my read. For G7 [tempo_allies.js](../src/tempo_allies.js) has three orders (cover me, take the same foe, fall back) whose chance of being followed reads bond, discipline, fear, noise and distance. Source review only.

### ACCOUNT FOR NOW

**G4. Cover, terrain and darkness**

- **CBD205.** A condition changes what can be perceived, reached or done, and says which. This reuses CBD169's three tests. Darkness works on perceiving. A slope, mud or a narrow stair works on reaching. Rain on a bowstring, wind on a thrown powder or a low ceiling over a long spear works on the means. A condition written this way needs no rule per move: it changes the tests and the moves follow.
- **CBD206.** Cover belongs to a spot and has a facing and a toughness. It protects against what comes from the far side, so a foe who moves around it has a clear line again. It stops what it is tough enough to stop: a bench stops a jinx and does little against a boar. Cover that is hit wears down, and a broken one leaves its remains in the place (CBD70).

```
Here    the fallen pine, between you and the thicket. Thick enough for a charge.
        It does not cover you from the scree side.
Boar    circling toward the scree. In about 3s the pine is no longer between you.

  1 Move with it, keep the pine between (2s, each time it circles).
  2 Stand and loose when it clears the pine (3s). One clean line.
  3 Climb onto the pine (2s). Higher. It cannot charge you there, and you cannot dodge.
```

- **CBD207.** Height, footing and room are terrain in three words. Height gives reach downward and a fall. Footing gives or takes speed and sets what a miss costs. Room decides which weapons and how many people fit, so a doorway turns four attackers into one at a time, which the crowding cap already expresses as a number.
- **CBD208.** Darkness is unequal by default. Each fighter sees by their own means: eyes, a lit wand, a sensing Gu, spirit vision, knowing the room. The screen shows what the character can make out, with last-known positions marked as such (CBD33). Making light shows the maker to everyone. Whoever sees better in the dark chooses when the fight is lit.

```
The lamp is out. You know this room. He does not.
Him     last heard by the dresser, breathing hard. Not seen.
You     by the door. He has not heard you move.

  1 Wait and listen (2s). You may place him.
  2 Strike where the breathing is (2s). A guess, with your knowledge of the room.
  3 Light the lamp (2s). You see him. He sees you.
```

- **CBD209.** Conditions change during a fight and can be changed on purpose. Dusk comes, rain starts, a fire spreads, smoke fills a room (CBD82). Fighters can make conditions as moves on a spot (CBD171): douse, flood, kindle, raise dust. The maker lives in the result along with everyone else unless their own means exempt them.
- **CBD210.** Places already carry tags that no rule reads (audit G4). Default route: give each existing tag one of CBD205's three effects before adding new tags, so old places gain conditions without re-authoring.

**G5. First blood, points and capture**

- **CBD211.** An ending is a condition someone is watching for. First blood, three touches, out of the ring, disarmed, pinned for a count, yielded: each is a rule of the occasion with a judge, who may be a referee, the opponent, the crowd or both fighters' honour. The fight stops when the judge calls it, which can be late, early or disputed (CBD20).
- **CBD212.** Scoring shapes how people fight. Under first touch, speed and reach count and heavy blows are wasted. Under points, a safe scoring move beats a risky strong one. Under "until one yields", wearing down nerve matters (CBC18). The policy's stance reads the ending in force, so the same character fights a drill and a brawl differently with no new orders.

```
Clan drill, first touch of three. Elder Mo is judging from the steps.
Score   you 1, Fang Zheng 1.
Coming  he is setting his feet for the long form. Slow. It would hurt, and score the same.

  1 Quick moonblade to the shoulder (1s). Likely first. One touch wins it.
  2 Slip inside his reach (2s). Safer. No touch yet.
  3 Take his blow and answer hard (3s). The elders notice restraint, and its absence.
```

- **CBD213.** Holding back is a skill with a failure. A fight to first blood can still maim, by a slip, by a means too strong for the occasion or on purpose. A move's force has a floor the fighter may be unable to go under, and control decides how often restraint holds (CBC32). A real accident and a staged one look alike to most watchers, which is something a rival can use.
- **CBD214.** Capture is a sequence. Bring the person to where they cannot leave (pinned, cornered, bound, asleep, out of means), keep them so, and move them. Each step has its own ways to fail and its own answers from the captive: slipping a grip, calling for help, bargaining, waiting. A capture that ends the fight starts a custody that continues after it (CBC31).
- **CBD215.** Taking alive costs more than striking down, by mechanism. It needs moves that hold without breaking, time under exposure, and usually more hands or a prepared means such as a rope, a sleeping draught or a sealing Gu. Taming a wild Gu or a beast is the same shape with the quarry's will as what runs out. The result line says what state the captive is in and who now holds them.
- **CBD216.** An ending can be refused or disputed. A beaten side may not accept the call, a judge may be partial, a first blood may be claimed and denied. A dispute is an argument on the same frame (CBD126), and can turn back into a fight with the rules gone.

**G6. Poison, slowing and other lasting conditions**

- **CBD217.** A lasting condition is a staged track on a body, and the staged affliction module already has the shape: how it got in, an onset, stages with their own effects and durations, a check at each stage's end, and treatment. In a fight it would be a landed effect that keeps acting on the fight's clock and carries on afterward on the day's clock (CBD89).
- **CBD218.** The player sees what the character can feel and name. Early stages read as sensations ("your fingers are slow on the left hand") with the cause unknown unless the character saw the dart, knows the smell or has a means to tell. The name, the course and the remedy are learned fields (CBD182). An unidentified condition is a reason to look, to retreat or to press before it worsens.

```
You     left forearm grazed. The cut is hot, and the hand is slow.
        You do not know what was on the blade.
Coming  it is getting worse. You cannot tell how fast.

  1 Bind above the cut (3s). It may slow whatever this is.
  2 Finish this quickly: press him (stance: all in).
  3 Break off for the stream bank (3s). You have not seen him tire.
```

- **CBD219.** A condition changes the fight by changing the clock. A slow poison makes the poisoner want delay and the poisoned want a quick end. A stimulant gives strength now for a debt later. A bleed sets a deadline. Each side's policy reads the conditions it knows about, which gives stalling, rushing and withdrawing real reasons.
- **CBD220.** Conditions are made, carried and delivered like other things. A poison has a maker, a dose, a carrier (blade, dart, cup, breath) and a route in, and it can miss, be wiped off, be spent or be found on its owner afterwards. Protection is by mechanism: thick hide stops a contact dose, and does nothing against one that is breathed.
- **CBD221.** Treatment in a fight is a move with a price, and after it a task. Binding, an antidote in the pouch, a purging Gu or a counter-charm take time under exposure and may need the right knowledge. Afterwards the track continues into rest, care and whoever can treat it (BHR rules), so a won fight can still be lost over the following days, with warning by default (AD19, BHR11).
- **CBD222.** Helpful and mixed conditions use the same track. A blessing, a draught, a berserk state or a possession has onset, stages and an end. Stacking and clashing are decided by what each acts on, with no fixed slot count.

**G7. Allies with their own minds, and orders to them**

- **CBD223.** An ally has the same page as anyone: an aim, a stance, standing orders and a leash (CBD105). They act on it unprompted. The player sees their next action under "Coming" and their state by spot. A good ally needs few orders because their page already suits the player's.
- **CBD224.** An order is a request across a tie. Whether it is heard depends on noise and distance, and whether it is followed depends on the tie, their discipline, their fear and whether it fits their own aim. Tempo's order chance already reads these. The player sees the odds as a word and, after a refusal, the reason the character can tell ("she did not hear", "he will not leave his brother").

```
Allies  Bao, at the barricade beside you. Steady. He means to hold.
        Old Shen, by the well, hurt. He means to reach the yard gate.
Coming  Bao is setting his spear for their rush.

  1 "Bao, cover Shen." (1s) Likely. He hears you and he likes Shen.
  2 "Shen, stay down." (1s) Uncertain. He is frightened and it is loud.
  3 Signal fall back (1s). Bao will follow. Shen cannot move fast enough.
```

- **CBD225.** Orders come in sizes. A single act ("cover me now"), a standing instruction for this fight ("keep them off the door"), and a plan agreed beforehand ("when I whistle, run"). Plans made before the fight need no hearing and cost no time during it, which makes drilling and briefing a form of preparation (CBD58, CBD115).
- **CBD226.** Allies ask and tell as well as obey. An ally can call a warning, ask for help, suggest a move or announce they are leaving. These arrive as events and sometimes as a pause when the answer matters. An ally who saw something the character did not is a source for a learned field, with "told" as its basis.
- **CBD227.** Working together has its own effects, by mechanism. Two people on one foe split its attention, one holding lets another strike, a healer behind a shield lasts longer. These fall out of crowding, cover and timing already in the engines, and a practised pair does them more reliably. Getting in each other's way is the same mechanism going wrong: a blocked line, a spell through a friend's spot.
- **CBD228.** What happens to allies outlasts the fight. Who was covered, who was left, who was ordered into harm and who was thanked all write to the tie (TIE rules). An ally's own judgement of the fight can differ from the player's. Trained animals, bound Gu and summoned things sit on the same scale with shorter pages and different ties (CBD173).

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD229 | G4 headless on the contest: one cover spot with facing and toughness, and unequal darkness. | Sol, medium | Moving around cover restores the line on the same seed. A blow tougher than the cover goes through. In the dark, the view of the fighter who knows the room differs from the other's, and making light changes both. |
| CBD230 | G5: a first-touch drill with a judge, and one capture, at the Gu tie-in. | Sol, medium | The same pair fights differently under first touch than under yield, by recorded picks. A held-back move fails to hold back at a rate set by control. A capture leaves a custody record that a later activity reads. |
| CBD231 | G6: land one staged affliction from a fight move, using the existing module. | Sol, small to medium | The track starts in the fight, shows as a sensation with no name, changes one side's policy pick, and continues on the day clock after the fight. Treatment in the fight costs time and changes the stage check. Save and reload mid-track matches an uninterrupted run. |
| CBD232 | G7: give one tempo ally a page and one refusal reason. | Sol, small to medium | The ally acts unprompted by its own aim. An order's odds word matches the draw's inputs. A refused order states a reason the character could tell. The tie record differs between covering and abandoning the same ally. |

### Round 27 suggestions (separate from the palette)

- CBD231 is the cheapest of the four, since the affliction module exists and has no fight caller yet.
- With rounds 25 and 27 done, all seven audit gaps have a felt design; the audit's order R5 (a live Gu entry, then G1, G2, G3) still looks right, with G6 as a small addition beside the Gu entry.
- Angles still open: feuds and rivalries across many fights, what fighting pays and costs over a season, a first fight that teaches the screen, and companions or Gu that fight as beings in their own right.

## Round 28. Crowds in one place, the scene as the place up close, and what the screen pattern gives other activities (2026-11-13)

Weibao asked: "Other aspects to consider? fights with so many people? general UI improvements too? world/scene engine?" This round covers what rounds 22, 25 and 26 leave open on those three. These are proposals.

**ACT NOW.** Checked the code and owners. [world_substrate.js](../src/world_substrate.js) has four holder kinds (place, body, thing, cohort), where a cohort is a counted group with shared properties and lifecycle acts to promote members into individuals and demote them back. Places can carry near or far detail. A link graph joins places, with link kinds, closed links, exits, neighbours and distance. The [duelling club pack](../src/world_packs/hp_duelling_club.js) builds its platforms, far floor and doorway as place holders joined by a sightline link, with each wand as a thing holder marked with its grip. [PC92b](PROCEDURAL_CARRY_OUT.md) proposes one world record per visited place, advanced in detail where the player is. [SR4](SITE_AND_EXPLORATION_RULES.md) tells a site to join existing owners and add no parallel stock, clock or truth, and SR13 keeps inspection free of cost. In [UI rules](UI_RULES.md) and [DESIGN.md](../DESIGN.md) I found a per-aspect history (UR92) and no single list of things waiting on the player. Source and owner review only.

### ACCOUNT FOR NOW

**Crowds in one place (eight to thirty people)**

- **CBD233.** Sort the screen by who is on you. Each other fighter stands in one of a few relations to the character: engaged with you, turning toward you, near and busy with someone else, or elsewhere in the room. The first two get their own lines. The rest fold into counts by spot (CBD73). A person moves up the list the moment they turn toward the character, and that move is itself a coming event.

```
FOCUS: The Three Brooms, a table has gone over. You want to reach Neville by the hearth.
On you   Flint, an arm's length off, swinging.
Turning  a seventh-year by the bar has seen your wand come out.
Near     four around the fallen table, on each other. Two Hufflepuffs trying to pull them apart.
Room     about a dozen pressing for the door. Rosmerta is shouting from behind the bar.
Coming   2s  Flint's swing.
         soon  the press at the door reaches you.

  1 Duck under and go for the hearth (2s). Flint is behind you after.
  2 Put Flint down first (3s). The seventh-year gets to you meanwhile.
  3 Go with the press toward the door (3s). Away from Neville.
```

- **CBD234.** Sides are loose and can change. A brawl can have three or more sides, people on no side, peacemakers and people who join whoever is winning. Side is a relation each person holds toward each other person or group, read from ties and aims, so a friend of both may hold someone back from each. A person can change it mid-fight with a reason: struck by their own side, a friend goes down, the teacher arrives.
- **CBD235.** The crowd is terrain that moves. Pushing through costs time by how dense and how willing. A press carries people toward where it is going. Panic is a condition on a group that spreads by sight and sound, and a crush at a door is a coming event with a place and a time. Standing on a table, getting behind the bar or reaching a wall are moves about the crowd as much as about any foe.
- **CBD236.** Harm goes astray. A missed blow, a spell past its target or a thrown chair lands on whoever is in its line, by the same reach and cover tests (CBD169, CBD206). Friends and bystanders can be hit, and who hit them is a fact with witnesses (CBD180). The choice row says when a move risks someone the character would mind hitting.
- **CBD237.** Settle by distance from the player. People on you or turning settle as individuals. People near settle as individuals when the budget allows and as pairs or knots otherwise. The room beyond settles as cohorts with a count, a mood and a direction, which is what the substrate's cohort holder is. Promotion is the existing lifecycle act: a face comes out of the count when they turn toward the character, are named, or do something that matters. Budget dial: how many individuals at once, by world and machine.
- **CBD238.** A crowd fight ends in pieces. It thins as people leave, it breaks when someone with standing arrives, or it burns out. The result for the character is about their own aim (reached Neville, got out, was seen with a wand out), with the room's outcome as a line of context. Who started it is an argument for afterwards (CBD216).

**The scene is the place, seen up close**

- **CBD239.** A spot is a small place inside a place. The substrate already allows this: place holders joined by links with kinds (sightline, path, door) and closed states, bodies and things with a place, cohorts, near and far detail. The duelling club is built this way. A scene is then the near-detail form of a place, and round 16's "named spots" need no new kind of record.
- **CBD240.** Spots appear when someone looks closely and stay where something changed. Entering near detail generates a place's spots from its kind and its recorded things (CBD69), keyed so the same place gives the same spots. Leaving folds them away again, keeping the spots where something now differs: the gouged pine, the wand under the bench, the door off its hinge (CX4, GW5). An unchanged slope costs nothing to store.
- **CBD241.** What a scene layer adds over the substrate, as five parts. A layout rule per place kind. A property vocabulary on things (CBD95). Attention per person present (CBD176). A coming-events list that belongs to the place. One conversion between scene seconds and world minutes (CBD89). None of the five is about fighting.
- **CBD242.** A fight is one mode of a scene. The mode is set by the aims of those present: hostile aims make it a fight, opposed but peaceful aims an argument or a haggle, one side hiding makes it stealth, no opposition makes it ordinary work in a room. The same scene can hold a conversation, a theft in progress, a potion on the boil and a search of a ruin, each using spots, things, attention and what is coming. A mode can change without the scene changing (CBD126).
- **CBD243.** One coming list per place, shown through what the character can notice. The kettle about to boil, the teacher on the stairs, the candle burning down, the guard's round and the boar's charge are entries on the same list. Each activity shows the entries that bear on it. This gives stealth its guard rounds, making its timers and exploration its hazards from one mechanism, and it is where interruptions come from (CBC27).
- **CBD244.** Sites and exploration are the nearest neighbour. A ruin's rooms and passages are places and links at near detail, a locked door is a closed link, a trap is a coming event with a trigger, and a survey is a look that fills fields (CBD184). The site rules already ask a site to use existing owners (SR4) and to keep inspection free (SR13), so the scene layer would be one of those owners. A fight in a ruin then needs no bridge between a site model and a fight model.
- **CBD245.** Detail follows the player, and everyone else runs coarse. Under PC92b's default a place the player is in runs near and other places run by rates. Within the near place the same split applies again (CBD237). An event far away that would matter here arrives as news with a delay (CBD141).
- **CBD246.** Scale down as well as up. A scene can be a tabletop: the parts of a lock, the stages of a ritual circle, the organs of a patient under a healer's hands. Spots, things, a coming list and what runs out apply there too. This is a later use to keep the vocabulary honest: if a word works for a battlefield and a workbench, it is probably the right word.

**What the screen pattern gives other activities**

- **CBD247.** "Focus asks, Place shows, Reports tells" (CBD75, CBD76) describes the whole game's panels. A decision belongs in the focus panel whatever raised it: a fight pause, a letter needing an answer, a choice at a crossroads, a brew at its critical moment. Reports keeps what happened. The place panel is the scene. A pointer for the UI owners; this palette changes none of their files.
- **CBD248.** The policy page generalises to any repeating activity. Wants, standing orders, an "otherwise" line, an ask-first list and recorded reasons (CBD105 to CBD113) fit a work routine, a travel leg, a shop, a study schedule and a household. One page shape per activity kind would let the player learn it once, and retune by example (CBD111) would work on a bad market day as it does on a lost hunt.
- **CBD249.** One "waiting on you" list. Everything paused for an answer across fights, routines, letters, visitors and expiring offers sits in one short list with what each waits for and what happens if it is left. Away play resolves items by their cautious default where they have one (CBC25) and leaves the rest waiting. The list is the first thing a return shows (CBD129).
- **CBD250.** A what-changed block after any activity. The itemised result (CBD78, CBD120) is the same block for a journey, a day's work, a conversation or a craft: what was gained, spent, hurt, learned and who saw, each line linked to its record (UR92). Sized by stake, so a routine day is one line.
- **CBD251.** What the focus panel gives up when a fight needs room. By default a routine fight takes none of it and writes to Reports. A paused fight takes the focus panel and parks what was there as one line in the waiting list. A weighty fight takes the full screen (UR5) and parks the rest. On ending, the parked activity returns with a note of what the fight changed for it ("the brew sat eleven minutes too long").
- **CBD252.** The four answers and the compose row are general. "Works, might work, does not because, cannot be settled yet" (CBD97) and choosing a means, a verb and a subject (CBD96) suit making, talk and exploration as well. One wish list across activities would then measure where the whole game most often says "not yet".

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD253 | Headless tavern brawl of about twenty on the substrate: a few individuals, the rest as cohorts. | Sol, medium, after a tie-in | Stays inside the stated individual budget. A cohort member is promoted when they turn toward the character and demoted after. A stray effect lands on a named bystander with a witness record. One person changes side for a stated reason. |
| CBD254 | Scene layer spike: generate spots for one existing place from its kind and things, enter and leave near detail. | Sol, medium, headless | The same place gives the same spots twice. A changed spot persists after leaving and an unchanged one stores nothing. The duelling club's hand-built places can be expressed as that place kind's layout plus overrides. |
| CBD255 | One coming list shared by two modes in one place: a potion on the boil and an argument. | Sol, small to medium, after CBD254 | Both activities read the same list. The argument running long spoils the brew at the stated time. Save and reload mid-scene matches an uninterrupted run. |
| CBD256 | Pointer packet for the UI owners: CBD247 to CBD252 as a one-page proposal against DESIGN.md, UI_RULES.md and the [UI design core audit](audits/UI_DESIGN_CORE_AUDIT.md). | Sol, small, read and write one page | Each proposal names the existing rule it extends or the gap it fills, and a static mock shows the waiting list and one what-changed block at desktop size. The owners decide what is adopted. |

### Round 28 suggestions (separate from the palette)

- CBD254 is the one that most changes later cost, since fights, stealth, making and sites would all read it; run it before any second hand-built scene.
- Offer CBD239 to CBD246 to the procedural foundation and site owners as a note, so the scene layer is designed once and not from inside combat.
- Angles still open: feuds and rivalries across many fights, what fighting pays and costs over a season, a first fight that teaches the screen, and companions or Gu that fight as beings in their own right.

## Round 29. Fights over time: rivals, what fighting pays, the first fight, and beings that fight beside you (2026-11-13)

Weibao asked to keep designing. Earlier rounds treat one fight at a time. This round looks across many: a rival met again and again, a season of fighting as a living, the first fight a new character or a new player meets, and Gu or companions that fight as beings of their own. These are proposals.

**ACT NOW.** Checked the owners. [Rivals, identities and fate](RIVALS_IDENTITIES_AND_FATE.md) holds the rival archetypes and young-master chains, and CBR15 already makes a fight evidence for both sides. CBR26 pays idle fights from real stock and CBR19 wears gear from what happened. The [opening rules](OPENING_RULES.md) ask for a first action that lands within a few presses and controls that use words the screen has already given (OPN3, OPN5), with no fight line. The source has a companion roster with opinions and wishes and a Gu keeper domain where a Gu is alive, fed and controlled. Source and owner review only.

### ACCOUNT FOR NOW

**The same opponent, many times**

- **CBD257.** A rivalry is a record that both sides add to. It holds the meetings so far, who won what, what each has learned of the other (CBD114, CBD187), what each owes or resents, and who else knows. The next meeting opens from that record: the rival comes prepared for what beat them, avoids the ground they lost on, or brings a friend.
- **CBD258.** Rivals grow between meetings by their own causes (AD25). They train, find a teacher, buy a means or lose their backing, on the world's clock and at a rate their circumstances allow. The player can learn of it through the channels that exist (talk, a duel list, a scar seen in passing), so a rematch can be scouted like any foe.
- **CBD259.** A rivalry has more ends than a death. It can settle by a decisive result both accept, a debt paid, a shared enemy, a move away, a marriage between houses, or by one side outgrowing the other until the fight is pointless. An ended rivalry stays in both histories and can reopen with a cause (AD28 covers what was beaten, and people are freer than obstacles).
- **CBD260.** Chains escalate through ties. Beating the young master brings the elder brother, then the steward, then the house (the chain pattern in the rivals doc). Each link is a person with reach and a reason, and each can be met by something other than a fight: an apology, a patron, proof, leaving the district. The screen shows the chain as far as the character knows it.

```
Fang Zheng, third meeting.
  Before   you 2, him 0. The first he blames on the sun. The second he does not talk about.
  Since    he has been seen at the elder's hall most evenings. He carries something new at his belt.
  He knows you open with the moonblade, and that you tire in a long exchange.
  You do not know what he carries.
```

**What fighting pays and costs over a season**

- **CBD261.** A fight has a ledger. In: what it yields (quarry, pay, a prize, standing, knowledge, a freed road). Out: stock spent, wear, wounds and the days they take, time, and what was seen. The result block already itemises one fight (CBD120, CBD250). Summed over a season it answers whether hunting this slope is a living.
- **CBD262.** Fighting for a living is a routine with a rate and a variance. A familiar hunt pays steadily and now and then goes badly. The policy page plus the ledger give the player the two numbers a routine needs in words: what a usual day brings and how bad a bad day is. A place gets worse or better as it is used: quarry thins, foes learn, prices for the yield move (AD25).
- **CBD263.** Recovery is the hidden cost and a play space. Wounds, spent essence, a tired Gu and worn gear set how soon the next fight is wise. Rest, care, repair and feeding are the other half of a fighter's week, and they are where healers, smiths and feeders earn. A character who fights less often and prepares more can come out ahead.
- **CBD264.** What a fight yields is taken, and taking has steps. Loot is the things that were there: the beast's body, the loser's purse, the dropped wand. Carrying it off needs time, hands and sometimes a right to it, and others may claim it (CBC33, CBR28). A yield left behind stays in the place for whoever comes next.
- **CBD265.** Not fighting has a ledger too. A road left to bandits, a challenge declined or a debt of honour unpaid each cost something by the world's own rules, and each can be paid another way (CBC35). The comparison belongs in the same season view, so the avoider's year can be judged against the fighter's.

**The first fight**

- **CBD266.** The first fight a character meets should be small in stake and whole in shape: a spar, a quarrel, a hen-house fox. It shows one pause, one choice with time and cost, one cause line and one what-changed block, and then goes quiet. Parts of the screen appear when first needed (things when something is dropped, "Around" when someone watches), each with one line of plain explanation in the interface voice.
- **CBD267.** Teach by the world, where the world has a teacher. A drill master, an older student or a father shows the stance, names the tell and judges the touch (CBD211). The lesson is an ordinary fight with a patient opponent and a judge who talks. A character with no teacher learns by losing a little, with forgiving defaults (AD19).
- **CBD268.** A new world's first fight teaches what is different there. A player who knows wand duels meets essence running down, or a street where being seen matters more than winning. One line at the first difference is enough ("Here, what you spend does not come back by morning"). This rides on the shared edges of CBD191.
- **CBD269.** The first policy is offered, not assumed. After the first hand-played fight of a kind, the game offers a starting page from the stance used and the teacher's page (CBD115), and says what it would have done differently. Zero-prompt fighting then begins with the player's agreement.

**Beings that fight beside you**

- **CBD270.** A bound being is a fighter with a short page and a body (CBD173, CBD228). A Gu, a familiar, a hound or a summoned thing has its own place in the scene, its own state (fed, tired, hurt, afraid, willing) and its own likely action under "Coming". Using it is closer to asking than to pressing a button, to the degree the world makes it a being.
- **CBD271.** Its condition is the limit on its use. A Gu that is underfed acts weakly or refuses, one that is hurt can die, and one pushed past its nature may turn or leave. The Gu keeper's alive, fed and controlled state is already what a fight should read (audit F5). The choice row shows the being's state beside the cost in essence.

```
You     Essence under half.
Yours   Moonlight Gu, in your palm. Fed yesterday. Steady.
        Liquor worm, at your belt. Hungry. It may not answer.
        The hound, at the pine, hackles up. He means to go for the boar's flank.

  1 Moonblade (3s). The Gu is willing.
  2 Refine essence through the worm (2s). Uncertain: it is hungry.
  3 Call the hound back (1s). Likely. He does not like it.
```

- **CBD272.** Beings can be targeted, taken and lost, and that is part of the stake. A foe can go for the Gu and a fight can end with the master unhurt and poorer. What the loss does to the master is the world's own rule (a bond's backlash, grief, nothing). The itemised result names them like people.
- **CBD273.** They remember and change. A hound that was sent into harm hesitates next time, a Gu used well grows, a familiar who saved its master is treated differently by both. This writes to the same tie and opinion records companions already have, at whatever depth the being's nature supports.
- **CBD274.** Many beings need few prompts. A master with a dozen Gu sets which are out, which are held back and in what order they are spent, as preparation (CBD58), and the policy handles the rest. A pause names a being when its state is the news ("the worm is not answering").

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD275 | Rivalry record, headless: three meetings with one opponent whose page changes after each. | Sol, medium, after policy rows are in a played fight | The second meeting's opening differs because of the first. The rival's between-meeting change has a stated cause and can be learned before the third. One non-fight ending closes the record. |
| CBD276 | Season ledger: sum the itemised results of thirty policy-run hunts on one fixture. | Sol, small to medium | Reports usual yield, worst day, stock and days of recovery spent. Thinning quarry lowers the rate over the run. The same season with fewer, better-prepared hunts is comparable in the same view. |
| CBD277 | First-fight script for one lead, as static text at desktop size. | Sol, small, mock-up | A reader new to the screen meets one pause, one choice, one cause line and one what-changed block in order, with each new screen part explained once, inside the opening rules' budgets. |
| CBD278 | Build contest entrants from a live keeper's own Gu, with state gating use (audit R2). | Sol, medium | A fed and controlled Gu is usable, a hungry one is uncertain with the reason shown, a dead or absent one is gone from the list. Feeding between two fights changes the second. |

### Round 29 suggestions (separate from the palette)

- CBD278 is the audit's nearest step for Gu and the natural first live tie-in.
- Sessions started from this round's request (2026-11-13) work on the pieces that need no tie-in: the scene layer spike (CBD254), the shared fight view (CBD202, CBD204), and the read-only coverage tables with the UI pointer packet (CBD102, CBD157, CBD256). Their results are findings until Weibao takes them.

## Pointer and corrections, 2026-11-13: first results on rounds 19 to 28

Five findings docs came back from the sessions started after round 29. All are proposals; the code is unit-tested, below the AD43 floor and not played.

| Item | Result | Where |
| --- | --- | --- |
| CBD254 scene layer | Spots work as ordinary place holders with no new record kind (CBD239 holds). Three substrate requests: a quiet way to place holders, an op that changes detail, and a place inside a place | [spike note](audits/SCENE_LAYER_SPIKE_2026-11-13.md), `src/scene_layer.js` |
| CBD202, CBD204 fight view | Both engines project onto one validated view. The contest is ahead on scene, tempo is ahead on words; aim and onlookers are thin in both. Ten engine requests | [projection note](audits/FIGHT_VIEW_PROJECTION_2026-11-13.md), `src/fight_view.js` |
| CBD102 coverage | 21 unlisted actions: 3 compose today, 11 need a property row, 7 need a new effect. The sample is not blind and leans to early arcs | [coverage count](audits/COMBAT_ACTION_COVERAGE_2026-11-13.md) |
| CBD157 pair table | First pass for Gu, Hogwarts and LOTM; most rows rest on inference and need a world pass or CBD156 | [pair table](audits/COMBAT_CROSS_WORLD_PAIRS_2026-11-13.md) |
| CBD256 UI pointers | Each of CBD247 to CBD252 has an existing rule it extends | [pointer packet](audits/COMBAT_UI_POINTERS_2026-11-13.md) |

**Corrections to the table under CBD192** (from the projection note, P1 to P8). Tempo has no aim line: an opener writes a title alone. Tempo's "witness memory" is the struck fighter's own memory, so onlookers are absent there as well. Tempo's scene has no things; rounds are a means. Tempo's two strikes carry no odds word. The contest logs data rows with no sentence, and a move's blocked reason is private to the engine. Gu carried by a contest entrant are not listed by the engine. Scene conditions sit better under "Around" than under "Spots" for both engines.

## Round 30. What a playthrough to watch needs (2026-11-13)

Weibao asked: "record a playthrough for me to watch, first, consider all the things that needs to be done and more?" This round lists what the recording has to get right before it is built. These are proposals.

**ACT NOW.** Checked what can be recorded today. No designed fight is reachable in the live game (sizing audit F2), so a recording of the game itself would show the old fight card. What exists headless: the Wang Er pit duel on the contest with its authored numbers, a tempo street fight fixture with a loaded revolver, `projectContest` and `projectTempoFight` onto one view shape, and the [Wang Er prototype](../prototypes/wang-er-duel/README.md) with its single-file build, sentence writer for contest log rows and headless browser check. The project's browser helper runs headless, which the background-only rule needs. Source review only.

### ACCOUNT FOR NOW

- **CBD279.** Record real engine runs on a proposed screen, and say which is which on the screen. The fights are settled by the engines on a fixed seed. The three-panel layout (CBD75), the pause rule, the sentences for contest log rows and the scripted answers are prototype pieces. A footer names them, so nothing staged reads as built (CX6).
- **CBD280.** Record frames, then play them. A script runs each fight in Node and writes a list of frames: the projected view, new Reports lines, and a note. A page plays the frames. This keeps the recording repeatable, lets it be re-recorded after any engine change, and leaves the frames as a comparison file for later view regressions (AD54).
- **CBD281.** Show the claims a viewer has to judge, one per scene. A routine fight that asks nothing and ends in a result with its turning points (CBD56, CBD64). The same fight with one pause, its choice rows with time, cost, the policy's pick and a blocked reason (CBD57, CBD77). What is coming, with tells (CBD52). A result told by stake (CBD78). A second engine on the same screen (CBD191).
- **CBD282.** Show absence as absence. A part the engine does not fill appears as an empty, labelled region with the projection's own reason ("no onlookers or arrivals"). The recording is then also a picture of what is missing, which is more useful to a director than a filled mock.
- **CBD283.** Keep a director's note apart from the game screen. One line under the screen says what the scene demonstrates and cites its codes. It is visibly outside the game, so the game text can be judged as game text.
- **CBD284.** Make it watchable at a reader's pace. Play, pause, step, speed and a scrub bar, with pauses that hold long enough to read the choices (CBD88). A video file is produced from the same page for watching without controls. Both are at desktop size, 1920 by 1080 (standing UI priority).
- **CBD285.** Say what the recording does not show. It is not the live game and does not meet the AD43 floor. The contest view has no knowledge filter, so it shows engine truth about foes. Wording is draft and has not been through the prose rules. Motion and sound cues (round 24) are absent.
- **CBD286.** Name what it should help decide, so feedback has somewhere to land: the panel roles, the choice row, how often a fight should pause, the result block, and whether two engines reading as one screen is worth the shared view.
- **CBD287.** More, for later recordings. The same player can replay a real saved fight once one exists (CBD131, CBD132). A scene-layer scene (CBD254) can be a third act when a fight reads its spots. Each tie-in can end by re-running the recorder, so the watchable record grows with the game.

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD288 | Re-record after the first live tie-in, from a real saved fight in the game. | Sol, small once the tie-in exists | The recorder reads a save, the player shows the same frames the game showed, and the footer no longer lists a staged piece that the tie-in built. |

### Round 30 suggestions (separate from the palette)

- Keep the recorder and player under `prototypes/fight-playthrough/` with output under `work/`, as the Wang Er prototype does.

## Pointer, 2026-11-13: the recorded playthrough

Round 30 is carried out in [prototypes/fight-playthrough](../prototypes/fight-playthrough/README.md): three scenes recorded from real engine runs and played on the proposed screen, as a page and a two-minute video under `work/fight-playthrough/`. Headless check at 1920 by 1080: 36 steps, no page errors, no panel overflow. It is a prototype, below the AD43 floor.

Making it turned up three gaps to add to the projection note's requests. A bridged move such as the moonblade carries no cost on its row, so the screen cannot say it costs essence. Its blocked reason reads "its own working cannot start", which hides the plain cause (not enough essence). The tempo engine drops the fight record with its last move, so the closing log lines cannot be shown; the result is read from what the engine writes back.

## Round 31. Problems and risks in the design so far (2026-11-13)

Weibao asked "More problems to consider?" This round lists what could go wrong with rounds 10 to 30, with a default handling for each. It adds no features. These are proposals.

**ACT NOW.** Checked which risks earlier rounds already name. CBD60 names a policy that leaves the hand nothing to add and one that makes fights a chore. CBD61 proposes counting decisions asked. CBD52 says a preview describes the current situation and can change. CBD240 keeps scene changes only where something changed. The [playthrough](../prototypes/fight-playthrough/README.md) showed two of these risks live: its Gu sentences are hand-written per move, and the moonblade row could show neither its cost nor a plain blocked reason. Owner and prototype review only.

### ACCOUNT FOR NOW

- **CBD289. Writing cost.** Cause lines, intent labels, blocked reasons and result lines all have to be generated from state, and a template over combinable actions reads flat or wrong ("You pour the lamp oil on the stairs, quickly."). Default handling: write per-verb sentence patterns with slots, plus authored lines for a world's signature moves, and run the player-text lint over generated samples (PRS rules). The cost grows with verbs times manners, so keep both lists short until the wording has been read in play.
- **CBD290. Preview honesty.** "Lands after the charge reaches you" comes from a look-ahead that hidden facts and chance can make wrong. Default handling: a preview states only what the character can judge, uses three confidence words at most (will, should, may), and a preview that turned out wrong is followed by a cause line saying what the character did not know. A preview the engine cannot compute is left off the row.
- **CBD291. Policy trust.** One unattended loss of something treasured can sour auto-play for good. The first-run leash matters more than how well the policy fights. Default handling: start with a tight ask-first list and a low stock cap (CBD113), loosen them by the player's own choice, and treat named or bonded things as ask-first until told otherwise.
- **CBD292. Four models of space.** The contest has a line, the spell stack has named places, tempo has a conditions line, and `scene_layer.js` now generates spots. Nothing says which one a new fight should use. Default handling: the substrate's places and links are the single store (CBD239), the scene layer writes to it, and each engine reads what it can (CBD198). Until an engine reads spots, a fight on it shows a line or one spot and says so. Decide this before a second hand-built scene.
- **CBD293. Untested combinations.** Actions composed from properties produce pairs nobody tried, and some will be absurd or broken. Default handling: test at property level (each property against each verb and each condition once), log composed actions that settle in play, and let an odd result be reported to the wish list (CBD97) with one click.
- **CBD294. Save growth.** Lasting changes in each place visited add up over a long life. Default handling: a place keeps changes that a later choice could read, and folds the rest into a summary line after a stated time ("old damage from a fight in spring"). Budget per place stated as a number (CX5). Nothing is forgotten by the character; detail is summarised in the record.
- **CBD295. Pause tuning has one player and no numbers.** Thresholds argued without data will be wrong. Default handling: record decisions asked, pauses skipped and overrides per fight first (CBD61), and change a threshold only against that record.
- **CBD296. The idle paradox.** If preparation plus policy decide routine fights, the fight itself may hold no fun. Two acceptable answers, by kind of fight: a routine fight's job is to feed other systems (stock, wounds, standing, knowledge, the season ledger) and be read in seconds; a fight that matters is played. The risk is a middle band that is neither quick nor interesting. Watch for fights that pause often and change little.
- **CBD297. Scope.** This thread grew from combat into a scene system, a policy system and a screen pattern, while the standing order is foundations first and the three leads. Default handling: treat rounds 19 to 30 as a palette, build only what a lead's next fight needs, and let the scene layer be owned by the foundation work it belongs to.
- **CBD298. Three engines and a projection to keep in step.** The shared view hides the seam and can also hide drift: each engine change can silently break a projection. Default handling: the projection test is part of each engine's focused tests, and the engine requests in the projection note are done where the engine lives so the projection stops rebuilding private logic.
- **CBD299. Engine words leak to the player.** "Its own working cannot start" reached the prototype screen. More such text will appear as more state is shown. Default handling: each blocked reason and outcome word has a player sentence or is hidden, checked by the existing vocabulary lint over projected views.
- **CBD300. A large pile of proposals.** This file holds about 260 proposal codes from one day, all still proposals. A long palette is hard to act on and easy to mistake for a plan. Default handling: distil the few defaults Weibao takes into the proposed combat rules, leave the rest here as palette, and have briefs cite the distilled lines.
- **CBD301. The recording can flatter the design.** It uses scripted answers, hand-written sentences and a staged "last time you had 16". Default handling: keep the footer that names staged parts, and replace each staged part with a built one as tie-ins land (CBD288).

### LATER / DELEGATE

| Code | Proposal | Level, effort | Done check |
| --- | --- | --- | --- |
| CBD302 | Sentence sample sheet: generate fifty lines from the playthrough's frames and the compose row, and read them against the prose rules. | Sol, small | A count of lines that read flat, wrong or engine-voiced, with the pattern that produced each. Decides whether CBD289's patterns are enough. |
| CBD303 | One page for Weibao: the ten defaults from rounds 10 to 30 most worth a yes or no, each in two lines. | Sol, small, read and write | Each line names its code, what changes if taken, and what it costs. The page records no decision itself. |

### Round 31 suggestions (separate from the palette)

- CBD292 and CBD297 are the two to settle before more is built, since they decide who owns the scene.
- CBD303 would turn this file from a pile into a short list of decisions.

### Weibao's replies to these problems, as leanings (2026-11-13)

He answered in the parent chat with questions, so these are leanings to design toward and are recorded as his words with proposed answers. Verified before writing: `publicCombatForecast` in [combat_review.js](../src/combat_review.js) gives seconds to kill and seconds to fall; Progress Quest sits unresearched at row 15 of the [acquisition queue](research/FUTURE_ACQUISITION_QUEUE_2026-10-13.md); the three derivation trials are in the [procedural systems proposal](research/OTHER_YAIR_PROCEDURAL_SYSTEMS_PROPOSAL_2026-11-11.md); PC95 is "engine first, tie-in later" in [the carry-out plan](PROCEDURAL_CARRY_OUT.md#engine-first-tie-in-later-pc95-2026-11-12).

- **CBD304. On losing.** His words: "maybe its harder for us to lose willy nilly? no irrecoverable stuff, unless you choose to go into a bad fight like that?" Proposed answer: a routine fight costs what can be got back (wounds heal, taken things can be traced, CBD120). Lasting loss needs a fight the character entered after a warning they could perceive, and "you cannot judge him" counts as a warning (CBD183). The forecast's seconds to kill and to fall can sort a fight into routine, risky or grave. A strong foe arriving in a routine makes the policy leave or ask (CBD56). A "keep safe" mark on treasured things stops the policy staking them (CBD291). A lethal canon world stays a dial forewarned at entry (CBX4). This tightens CBD291 and fits AD19.
- **CBD305. On Progress Quest.** His words: "Should we first absorb all the possibilities from progress quest?" Proposed answer: yes as the floor. It is the zero-decision case: fight, loot, a carry limit, sell, upgrade, quest and act bars, and terse generated lines. Get the silent routine loop reading well first and add pauses on top. This reorders the first playable toward CBD55, CBD64 and the season ledger (CBD261) ahead of pauses and composed actions. It needs a source dive, since the queue row is unresearched.
- **CBD306. On saves.** His words: "For saves, should we consider new saving system". Proposed answer: not for this. The scene spike stores what differs from a keyed layout and nothing else, which was three rows in its test. What is missing is the fade or summarise rule of CBD294. A wider save redesign is a separate question with its own owner.
- **CBD307. On the idle paradox.** His words: "consider the case of the original game too". Proposed answer: in the upstream game routine fights are worth running because they feed skill growth, drops for making and area progress. Routine fights here keep that job and add wounds, wear, knowledge of foes and standing (CBD296's first answer). The test for a routine fight is then what it feeds, and each kind of fight should name at least one reader (FLR4).
- **CBD308. On method.** His words: "How to work on the procedural systems in the same way?" Proposed answer: use the three trials the procedural work already uses. A known case: replay a canon fight and match its outcome and route. A controlled variation: change one input and explain the difference (CBD46, CBD61). An unlisted combination: an action nobody wrote that should work by its mechanisms (CBD102). Under PC95 the first proof is a headless fight read through `fight_view.js`, with the live tie-in after. Earlier lines here that say "at the first live tie-in" should be read in that order.
- **CBD309. On the engine.** His words: "What engine do we need to build?" Proposed answer: no new engine. Six parts over the substrate: the scene layer, an action generator with wider targets (G1), a chooser with a pause rule, the view projection, an event-to-text renderer, and the result publisher that exists. The scene layer over substrate places is the one model of space, with the contest's line as its one-row case (CBD292). Two of the six exist as spikes (`scene_layer.js`, `fight_view.js`) and one is built (the publisher).
- **CBD310. On the prose.** His words: "your prose kind of sucks sometimes" (which text is not yet settled; the parent chat asked). Proposed answer: split fight text in two. Terse factual lines generated from events, in the Progress Quest register ("Boar down. Essence: a fifth. Forearm grazed."). Rare authored lines in the world's voice, written from his samples (PRS7). Generated literary sentences are the weak middle and are dropped by default. This changes CBD289: fewer sentence patterns, plainer ones, and the sample sheet (CBD302) should compare both registers on the playthrough's frames. The sketches in rounds 16 to 29 and the playthrough's Gu sentences are in the weak middle and are examples of layout, not of voice.

## Round 32. Completing and revising (2026-11-13)

Weibao set the goal "complete accordingly and revise". This round carries out the next step the earlier rounds named, revises what they got wrong, and adds no new ideas. Proposals throughout.

**ACT NOW (done).**

- **Terse text, built (CBD310, CBD289, CBD299).** [fight_text.js](../src/fight_text.js) turns contest log rows into lines by one pattern per kind of event, folds repeated plain lines between turning points into one with a count (CBD88), and builds the itemised result (CBD78). Names and labels come from the caller. An id with no label gives no line, so engine words stay off the screen.
- **Three trials, passing (CBD308).** [fight_three_trials.test.js](../tests/fight_three_trials.test.js) runs the Gu pit duel headless through the contest, the shared view and the text. Known case: Fang Yuan stands, Wang Er is killed, three hunters yield. Controlled variation: with 4 essence he gets one moonblade, closes in and finishes by hand, Wang Er is out cold, and the result says what was spent and lost. Unlisted combination: a shove written as one effect sentence settles, is offered in the view and reads, with no code for it.
- **Playthrough re-recorded.** The [recorded playthrough](../prototypes/fight-playthrough/README.md) now takes its Gu lines and result from that module. Its hand-written sentences are gone and its footer says which parts remain staged.
- **Decision page written (CBD303).** [Ten defaults for a yes or no](audits/COMBAT_DEFAULTS_FOR_DECISION_2026-11-13.md), with one limit waiting on Weibao.

**Checks.** `node --test tests/fight_three_trials.test.js`: 5 pass. The playthrough's headless check at 1920 by 1080: 36 steps, no page errors, no panel overflow. Gate results for this change are in the chat report. Below the AD43 floor: no screen in the game reads any of this, and it has not been played in the game.

**Revised.**

- **Order of work.** Lines in rounds 10 to 21 that say "at the first live tie-in" are read as: headless proof first, then the tie-in, and the silent routine fight before pauses (CBD305, CBD308, PC95). The sizing audit's order is revised to match.
- **Sample wording.** The sketches in rounds 16 to 29 show layout. Their sentences are the weak middle register that CBD310 drops. What a contest fight reads like today:

```
You: moonblade hits First hunter, hands.
First hunter: yields, hurt.
Wang Er: bow shot misses you.
Wang Er: bow dropped.
Wang Er: punch misses you (3 times).
You: moonblade hits Wang Er, head, through the glare.
Wang Er down, killed.

The pit. 3.4 seconds. You: standing.
  Spent   Primeval essence 12 of 16.
  Hurt    Unhurt.
```

- **Turning points.** A plain hit on the player is left to the result's Hurt line. Counting each one as a turning point broke folding and made a long list.
- **Still staged or missing, in order of what blocks reading a fight.** The pause rule (CBD56). A plain blocked reason for a bridged move, which still reads "its own working cannot start" (CBD299, the projection note's request). Text for tempo fights, whose log is already sentences. Authored lines in a world's voice, which wait for samples. Spots from the scene layer in a fight.

## Pointer, 2026-11-13: the Gu fight slice (engine first)

The coordination chat relayed Weibao's sharpened goal ("make the most progress in in the combat, ui, and procedural systems") and asked for a built engine slice answering the [handoff's](gm/COMBAT_DESIGN_HANDOFF_2026-11-13.md) A1 and A2. Built headless, with no live-screen tie-in. Proposals; below the AD43 floor.

- **Real state in (CBD41, sizing F5).** [gu_fight_entry.js](../src/world_packs/gu_fight_entry.js) builds a contest entrant from the Gu a person keeps in the engine world: which Gu they have decides which Gu moves they bring. Lending the Little Light Gu to someone else removes the combined move. Whether a kept Gu is fed and controlled is still judged where the fight uses it, by the existing check.
- **A line for every row (CBD63, the lead audit's G8).** [fight_text.js](../src/fight_text.js) now types every contest row (hit, miss, blocked, failed, out of reach, done, yield, yield refused, down, out, withdraw, interrupted, handoff, routed, wait). A move that was paid for and came to nothing carries its cost: "You: little-light moonblade fails. 1 primeval essence spent." Cost is left off a hit, where the result is the news.
- **A consequence carried forward (FLR4).** `guFightCarry` reads the two worlds and returns typed rows: how each ended, what each spent and lost, which kept Gu came out hungrier. The existing reader in the test is the Jade Skin working: it funds a guard before the bout and refuses afterwards for lack of essence, with its own reason. The rows match after a save and reload of the world.
- **Evidence.** [gu_fight_entry.test.js](../tests/gu_fight_entry.test.js), five tests, and two new scenes in the [recorded playthrough](../prototypes/fight-playthrough/README.md).
- **Fixture-only.** The world is a test fixture (a ring, two people, four Gu). Attack and evasion are the caller's numbers, since no owner derives them from a body. Nothing in the live game starts this fight. The fight view's choices still read the entrant's stored Gu list and do not apply the live fed-and-controlled check.
- **Why this fixture and not the seed-5 pit duel.** The pit duel's fighters carry Gu as numbers on a profile. The ring fixture has Gu as bodies in the world with keepers and satiety, which is what "real state" needs.

## Where rounds 10 to 32 stand (2026-11-13)

One table for the whole day's work, so the rounds above can be read as a palette with a known state. Everything is a proposal. "Built headless" means source and focused tests exist and nothing in the game calls it. Nothing here meets the AD43 floor.

| Part | State | Evidence or owner round |
| --- | --- | --- |
| The problem: one fight question for every world | Described | Rounds 10 and 11; [sizing audit](audits/COMBAT_WORLD_SIZING_2026-11-13.md) |
| Terse fight lines and itemised result | Built headless. Lines for contest fights; the result block for both engines | [fight_text.js](../src/fight_text.js); `tests/fight_three_trials.test.js` |
| The Gu world's words for its moves, means and parts | Built as world data | `GU_FIGHT_LABELS` in gu_fight_entry.js |
| A type and a line for every row, cost shown when nothing came of it | Built headless | `fightAccount`; `tests/gu_fight_entry.test.js` |
| When a routine fight pauses, and what it remembers from the fight before | Built headless, both engines through the view | [fight_pause.js](../src/fight_pause.js); `tests/fight_pause.test.js` |
| One view shape for both engines | Built headless | [fight_view.js](../src/fight_view.js); [note](audits/FIGHT_VIEW_PROJECTION_2026-11-13.md) |
| A plain reason when a move's own working cannot start | Built headless | `contestBlock` in fight_view.js; three-trials test |
| Fighters built from the Gu kept in the world | Built on a fixture world | [gu_fight_entry.js](../src/world_packs/gu_fight_entry.js) |
| Consequences left in the world and read by the next working | Built on a fixture world | `guFightCarry`; Jade Skin working as the reader |
| Three trials: known case, controlled variation, unlisted combination | Passing for the Gu pit duel | `tests/fight_three_trials.test.js` |
| Spots from a place | Spiked, no caller | [scene layer spike](audits/SCENE_LAYER_SPIKE_2026-11-13.md) |
| A recording to watch | Recorded, five scenes. Staged: the layout, the fixture people's names, and the answers at each pause | [playthrough](../prototypes/fight-playthrough/README.md) |
| The screen: Focus asks, Place shows, Reports tells | Shown in the recording, no live screen | Round 17; [UI pointers](audits/COMBAT_UI_POINTERS_2026-11-13.md) for the UI owners |
| Policy page, stances, standing orders from answers, ask-first list | Idea; a scoring chooser exists with no played caller | Rounds 14 and 20 |
| Losing and what a routine fight may cost | Idea, with Weibao's leaning recorded | CBD304; round 21 |
| Moves on things, places and workings (G1) | Idea; the contest targets self or a foe | Rounds 12, 19 and 25 |
| Third parties who arrive and watch (G2); knowing a foe and looking (G3) | Idea; tempo has a concealment draw and a study step | Rounds 18 and 25 |
| Cover, conditions, endings, lasting conditions, allies (G4 to G7) | Idea | Round 27 |
| Composed actions from properties | Idea; one sentence-built move settles and reads | Round 19; trial 3 |
| Crowds, battles, cross-world fighters, cues, non-fight contests, stopping mid-fight | Idea | Rounds 21 to 24 and 28 |
| Authored lines in a world's voice | Waiting on voice samples | CBD310; PRS7 |
| Text for tempo fights | Not built; tempo's log is already sentences | Round 32 |
| A fight the live game starts on any of this | None | PC95: engine first |
| Working defaults | Ten in use as adjustable working defaults (AD56), one of them Weibao's own leaning | [working defaults page](audits/COMBAT_DEFAULTS_FOR_DECISION_2026-11-13.md) |
| What-if replay | Decided by Weibao 2026-11-14 ("Practice only"): by default a replay is practice and leaves the world as it was; the reason is that a fight then has one result | CBD131; direction log |
| What finishing means for this lane | Weibao 2026-11-14: tie one fight into the live game | direction log; the working defaults page |
| One fight in the live game | Built 2026-11-14 on the tempo fight card (proposal): a "Fight on until something changes" row plays a steady policy and hands back when the last move is gone, a new injury lands, health falls under half or the fight ends; a "Worth a look" line gives the reason to stop; the card shows an itemised result at the end. The result is kept with the life and was read back after save, reload and import in a headless browser; what counts as a known foe still lasts for the session | `tempo_fight_domain.js` `run`; `tests/tempo_fight_run.test.js` |

**Revised in place on 2026-11-13.** CBD61, CBD68 and CBD74 now say headless first. The round 15 example line, the round 16 result and after-choice sketches, the round 17 Reports column and the round 18 folding example use the terse register. Rounds 19 to 31 are unchanged; where one says "at the first live tie-in", read it in the order above. Round 32's list of what is still staged is superseded by this table: the pause rule and its memory, the plain blocked reason, the street fight's result block and the Gu labels are now built.
