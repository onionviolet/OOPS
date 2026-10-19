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
