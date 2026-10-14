# R7: proposed reward, market and prestige numbers

2026-10-14. **Proposals only.** No game code, build, personal save, schema, shared owner, commit or push changed. R7 follows [COMMON](../COMMON.md); Claude owns integration. Later request, verbatim: "more to consider? other stuff and more? save and extend accordingly Send out codex as useful".

Recommend an evidence-backed deed ledger, staged arc credit and a **cumulative** sublinear currency curve. Give repeated content a positive floor by world rules, keep most carryover as usable options, and cap ordinary carried numerical power inside each world. The default model favors deeper long lives, but faster endings, rising repeat rewards and mortality expose cases where short lives win. Do not describe the formulas as a proven long-life advantage.

Authority checked: `PROJECT.md:223-228` keeps ordinary skills useful and prestige separate from travel/ascension; `PROJECT.md:303-309` keeps one realm, one prestige layer and native content intact; `PROJECT.md:49-61` records live canon-first priorities and explicitly allows revising heir-only carryover. `docs/USER_VISION.md:33-62` preserves the world-order request. Part 22 sections 8 to 12 and its requested later rows remain proposals (`22_FEATURES_AS_CHEATS.md:221,337,471,567,671`). All numbers below are reversible defaults and dials, not selected production values.

## N1: live numerical anchors, source-read

“Shown” below means read in local source, not exercised in a browser. File references are repository-relative and refer to the live checkout read on this date.

| Code | Shown / stated fact and citation | Why it matters |
|---|---|---|
| N1a | Titles use thresholds: kills 1/100/1,000/10,000; crafts 10/250/2,500; books 1/5; lived years 1/5/10. Held-money title is 10,000. `src/titles.js:8-38`. | These are receipts for milestones, not an existing prestige price list. Money held and elapsed life alone should not become repeatable meta minting. |
| N1b | Typical title bonuses are +1% to +3% XP or +2% stats. Known held bonuses multiply; flats add. Granting excludes already held title IDs. `src/titles.js:10-37,69-88`. | Carrying every multiplicative title across lives would compound. Reuse evidence, rather than silently retaining all title bonuses. |
| N1c | The `deaths` titles actually say “lose consciousness,” including 25 knockouts. `src/titles.js:19-20`. | A knockout counter is not a genuine ended-life counter and does not justify currency per death. |
| N1d | Skill defaults: base XP 40, scaling 1.8, max level 60; cost scales geometrically. The leveling code computes cumulative thresholds with the geometric sum. `src/models/skill.js:22-30,84-85,201-238`. Combat overrides base XP to 60; Pest killer to 100 (`src/data/skills.js:28-43`). | Exact next-level XP varies by skill. With default 40/1.8, cumulative XP to levels 1/5/10 is 40/894.784/17,802.336 before rounding. Avoid treating a flat reward as universally equivalent. |
| N1e | Character/levelable base XP defaults to configured 10, scaling 1.6; thresholds also use a geometric sum. Skill gains have configured per-gain caps 0.1, or 0.25 for crafting. `src/components/levelable_component.js:21-27,64-90`; `src/config.js:25-30`. | Local XP and meta deeds are different quantities. The script does not reproduce the full native XP pipeline or its caps. |
| N1f | Village fieldwork pays `15 + round(25 * Farming/max_level)` per 120 in-world minutes; patrol pays 50 per 120 minutes. `src/data/locations.js:1931-1941,1977-1983`. | These give an existing local wage range, 7.5 to 20 units/hour for fieldwork and 25 for patrol, not measured player-time earning rates. |
| N1g | Money formatting currently uses wood units, 10 units/copper, 1,000/silver and 100,000/gold. `src/display.js:4217-4230`. | All proposed money examples use integer internal units. They are not all copper coins. |
| N1h | Trader constructor defaults to margin 3 and four-day refresh. The nearby margin comment says 2, but the executable default is 3. Village/suspicious/swamp trader data use 4/6/7. Haggling and reputation modify the margin, with positive reputation clipped at 1,000. `src/components/trader_component.js:30-54,141-145`; `src/data/traders.js:9-24`. | Item retail markup is already context-dependent. A bounty reward should not inherit a merchant's resale margin. |
| N1i | Saturation reduces sell value using `param/(param+sold)` and a 0.1 floor at its cap; sold-minus-recovered state matters, and recovery is bounded by sold count. `src/market_saturation.js:14-20,76-86,159-178,186-193`. Buy quotes apply merchant margin and item value, and stale quotes must be reviewed again. `src/trade.js:77-98,482-487`; price rounding `src/misc.js:101-109`. | There is an existing positive-floor economy pattern and quote discipline, but loot saturation does not implement a bounty labor market. |
| N1j | Eastern mill reward: money 500, XP 250, Village reputation 100 and two action unlocks. Bonemeal: money 6,000, XP 5,000, Town reputation 40. Farm threat quest: money 5,000, XP 50,000, Town reputation 60. `src/quests.js:346-370,394-406,437-442`. | Authored rewards mix access and numbers, and money is not proportional to XP. Keep native authored rewards intact; proposed generated rewards need their own templates. |
| N1k | Village expansion stages give reputation 20/120/20, but its final task is “To be continued” and final rewards remain TODO. Hidden training quests unlock dialogue or activity access. `src/quests.js:379-391,449-474`. Tasks and final quests have separate payout paths (`src/quests.js:127-175`); `src/rewards.js:15-20,68-95` distinguishes money, XP, skill XP and unlocks. | Arc installments have a useful analogue, but unfinished content is not a completed arc. Do not accidentally pay both an installment and the full parent award. |
| N1l | `buildLifeHeirSave` requires an ended life and fresh envelope, retains calendar/RNG, applies heir leftovers and carries life records/options. `src/life_experience_host.js:7-28`. Leftovers settle kit debt, pass money/goods/home and halve regional reputation by truncation; heir body/skills/XP stay fresh. `src/heir_inheritance.js:32-64,79-93`. | This is lineage transfer, not the proposed general deed currency. Prestige must not silently replace this existing continuation route. |

## N2: what the idle-games research contributes

The dated dossier is **stated research**, not newly verified reference-game behavior. No new web claim or imported reference balance formula is made here.

| Code | Local dossier evidence | Inference for these proposals / why it matters |
|---|---|---|
| N2a | Chosen capability/object retention, rather than another XP exponent: `docs/RESEARCH_IDLE_GAMES.md:81-89,173`. | Make a blueprint, contact or usable technique an attractive carryover; optional numerical growth should not be the whole system. |
| N2b | Additive versus multiplicative stacking example: `docs/RESEARCH_IDLE_GAMES.md:133-135`. | Declare the meta bonus group explicitly. Repeated life bonuses should not each become another independent multiplier. |
| N2c | Progress Knight reset/XP contrast and candidate blueprint/contact legacy: `docs/RESEARCH_IDLE_GAMES.md:273,327-335`. | Distinguish character, lineage and meta retention. The dossier does not supply a validated YAIRPG currency curve. |
| N2d | No completion-time/balance measurements; track time to next decision and repeated clicks: `docs/RESEARCH_IDLE_GAMES.md:231-243`. | Simulated time and deed supply below are assumptions. Native playtests must later supply actual durations and mortality. |
| N2e | Knowledge of a recurring condition can open a route; a supplied extraordinary power can dominate suitable encounters without hidden enemy scaling: `docs/RESEARCH_IDLE_GAMES.md:295,331,384`. | World caps apply to ordinary meta carry, not a blanket ban on explicitly extraordinary premises. Earlier places can retain distinct decisions and resources. |

## N3: deed value and evidence

Proposed credit for a committed outcome:

```text
v = b_kind * (1 + 0.25*s) * c * q * r_world(n)
s = authored consequence scope, 0..3
c = authored challenge/commitment factor, default 1, range 0.75..1.25
q = verified contribution or outcome fraction, 0..1
n = occurrence count for this repeat family across the player's meta history
```

Scope refers to what changed, not raw character level or a world's combat power tier. A local healer, founder, villain, explorer or scholar can all produce consequential deeds. Use the same weights for equivalent outcomes on different sides of a conflict. No moral score or requirement to kill is implied. No credit for waiting, dying, travel entry, merely accepting a quest, receiving a copied item, or moving money between owners. A real travel discovery or saved knowledge application can count separately. A scheduled climax happening without you does not grant a full closure bonus: suggested role fractions are absent 0, meaningful witness 0.10, substantive supporter 0.25 and integral resolver 1, adjusted to the authored outcome. Witness knowledge and the same closure receipt must not pay twice for one finding.

| Code | Kind / default base `b_kind` | Why it matters |
|---|---|---|
| N3a | Resolved small outcome or meaningful help: 2 | Provides ordinary-life progress. A real new beneficiary/problem must exist; repeat button presses do not create a new outcome. |
| N3b | Verified discovery or useful mastery/application milestone: 4 | Makes scholarship, crafting and exploration eligible without a quest. Rereading an unchanged clue is not a new finding; re-experiencing it in a real new life uses its repeat family. |
| N3c | Independent completed Ambition: 12 | Rewards sustained personal goals. Player text, relabeling an old goal or inventing tiny goals does not authorize new credit. Templates need state predicates. |
| N3d | Arc: 20 total, paid in installments below | A failed long life keeps achieved milestones. No final-ending prerequisite. |
| N3e | Ending/resolution: 40 incremental closure bonus | Rewards complete outcomes without making them the entire payout. Canon/changed/prevented outcomes use comparable effort and contribution; no spoiler truth is needed in reports. |

Families use `(worldPackId, continuity ruleset, outcome archetype, causal objective)`. New eras and starts can count as new **occurrences**, while their family repeat history continues. A fresh instance UUID, copied branch, alternate quest wording or death does not refresh `n`. Different methods for the same goal share its family; genuinely different outcomes can have different families. Freeze challenge, scope, repeat index and formula version when an episode begins. All installments retain that multiplier, even if an heir completes them later.

Parent/child credit has declared budgets: the ending's 40 is a distinct closure bonus and excludes its arc budgets; an Ambition “finish this same arc” refers to the arc receipt and adds zero duplicate credit. An unrelated craft Ambition can add 12. The simulation assumes its Ambition and discoveries are independent. This matters more than the exact weights.

For raw title counters, an optional bridge is `2*log2(1+x/x0)` credit on evidence-backed lifetime progress, paid only as the difference from the prior credited value. Choose `x0` by activity. It is not simulated here and is not the preferred first slice: raw kill/craft counters lack outcome context. Knockouts, money held and playtime get no direct bridge by default. Existing native titles and their bonuses stay intact.

## N4: arc credit, partial success and incomplete lives (RL4, RP4)

Use three **authored milestones**, not arbitrary percent of elapsed time:

| Code | Milestone / share of arc's 20 | Why it matters |
|---|---|---|
| N4a | Established a useful foothold: 20%, or 4 | Short lives can achieve something real. A meter reaching 20% by waiting does not count. |
| N4b | Resolved the central obstacle/prepared a lasting result: 30%, or 6 | Mid-story death preserves a substantial result. |
| N4c | Closed the arc: 50%, or 10 | Completion has value, but does not re-award the full 20. |

Payout is `v_stage = 20 * stage_share * scope_factor * c * q_stage * r(n)`. Unreached stages give zero; reached stages survive death, retirement or shelving. A partial result uses an authored outcome fraction: saving two of three comparable objectives gives `q=2/3` for that stage, rather than an invented completion. World-state reversal can produce another causal episode but cannot erase or replay the same receipt.

In the model, the first long life killed immediately after unit 5 has 34 deeds and currency entitlement 9.07157, versus 124 deeds and 26.07997 at unit 10. That prefix includes one finished arc and the next arc's foothold. An heir continuing the same unfinished arc shares its stage receipts and repeat index. The model's repeated lives instead assume real new episodes.

Arc credit accrues as a durable entitlement. Claiming currency belongs to an explicit prestige transaction. Merely shelving, traveling, creating a branch, dying or viewing a recap does not itself perform prestige. A shelved chapter can offer a separate prestige choice if the player ends that life, consistent with RP1/RS1. Declining prestige preserves the earned ledger for a later choice.

## N5: prestige currency and sublinear growth (RP2, MM3)

Let `E` be cumulative effective deeds, including repeat factors and partial contribution. Recommend:

```text
F(E) = 10 * ((1 + E/20)^alpha - 1), alpha = 0.65
new entitlement = F(E_after) - F(E_before)
prestige claim = total entitled currency - total already issued currency
spendable = total issued currency - total spent currency
```

Use cumulative differences, not `sum(F(deeds_this_life))`. The rejected separate-life curve pays 15.07727 for five 10-deed lives versus 12.57586 for one 50-deed life, a 19.89% split advantage. With cumulative differences, identical effective deeds pay identically regardless of life/prestige boundaries. The ten-cycle simulation checks that property, including empty resets. Preserve fractional credit; do not round each death upward or discard tiny claims. A later implementation needs fixed precision plus carried remainder, or a documented numeric representation and rounding contract.

For `0<alpha<1`, `F'` stays positive and falls as deeds grow, and `F''<0`. Growth is sublinear and unbounded; repeat play never hits an account-wide “once” cutoff. Changing alpha changes reward magnitude, but cannot change strategy ranking when every strategy uses the same cumulative curve and total effective deeds. Long lives win only when they achieve more valuable outcomes per relevant time/risk, not because concavity magically favors them.

No per-reset currency grant, permanent free boon or automatic extra slot by life count. Otherwise a zero-deed reset could still farm the most valuable part of prestige. Costs are denominated in currency, not deed totals; spending never resets `E` or the issuance high-water mark.

## N6: sideways carry, world caps and earned boons (RP3, MM1-MM2, RZR7)

Recommended currency purchases are reusable **options**: a justified start, contact, blueprint, technique familiarity or alternative route. Illustrative prices are 10 for a small option, 25 for a broader start/route, 50 for a major capability option. Each still needs its earned predicate and world compatibility. These prices are design dials, not simulated utility or proof that all options exist. A cheat slot does not grant a cheat, its source or unlimited execution.

For ordinary numerical carry, choose one declared additive meta group:

```text
global familiar bonus = 0.20 * (1 - exp(-L/100))
world bonus = min(c_world, global familiar bonus)
L = lifetime earned currency F(E), independent of spending
c_world = 0.10 for an ordinary early-world premise
```

This gives at most +10% in the example early world and approaches +20% globally. Do not apply it separately to damage, health, XP, money and every action rate. Choose the supported channel in the future world rule. Existing within-life title bonuses are separate and not silently revoked. Explicit overwhelming-power starts, cheats and local laws can permit another cap, including zero or no cap; disclose that premise. No enemy scaling is added to cancel a chosen exceptional power.

For boons, draw without replacement from **earned, eligible, affordable** options; commit the offered IDs and RNG state before showing them. Default offered count `min(eligible, 3 + min(2, floor(log2(1 + L/50))))`; choose one. This yields three choices initially, four at `L=50`, five at `L=150`, when that many eligible options exist. Extra choice thresholds are earned, not life-count rewards. If the pool is empty, keep the currency and use ordinary continuation. If one foundational option is earned, provide deterministic access rather than requiring lucky draws.

Choosing a new permanent unlock spends its price. Choosing an already owned loadout changes selection, with no new stacking bonus. One active legacy selection is a first-slice default, adjustable by actual world slots; no universal one-time purchase or replay limit is imposed. Slot expansions need explicit world and acquisition rules and are outside this simulation. It does not sample boon utility or prove that a favored legacy is balanced.

Early worlds stay **numerically** relevant because local deeds retain their weight, meta carry is clipped and access, resources, relationships and methods remain local. The script only verifies the new ordinary meta bonus bound. It cannot prove combat difficulty, interesting choices, rare rewards, extraordinary imports or human acceptance. Do not claim early-world gameplay balance from a capped percentage alone.

## N7: repeat payout modes (RP7, DL27)

`n` starts at 1 and follows the family ledger across fresh canon starts, lives and branches. The default diminishes on the **same outcome**, not on every activity in a world. Completing new arcs inside the same first realm can remain valuable without forcing travel.

| Code | World mode / formula | Default interpretation / why it matters |
|---|---|---|
| N7a | Diminishing: `r(n)=0.35 + 0.65/sqrt(n)` | Default meta credit. Multipliers at occurrences 1/2/10/100 are 1/0.80962/0.55555/0.415; limit 0.35. Known routes remain worth repeating. Ordinary contracted money is priced separately, not cut by the soul's replay count. |
| N7b | Steady: `r(n)=1` | Appropriate for a genuine repeated service/loop premise. Every real occurrence remains equally valuable. No account-wide “once” rule. |
| N7c | Rising: `r(n)=min(1.5, 1+0.15*log2(n))` | Available for mastery/escalating-loop worlds. Its cap prevents unlimited multiplier growth but does not prevent farming. Recommend using it where the next occurrence actually adds commitment, consequence or challenge; unchanged cheap openers keep a different family mode. |

None is a global restriction on solo play. World adjectives choose the mode and parameters. A rising world can intentionally favor repetition; report that tradeoff instead of pretending all modes favor long lives. Completed story beats cannot pay repeatedly inside an unchanged state unless that world actually regenerates them. Continuity forks share ancestor receipts; a branch label grants no new currency. Prestige makes a fresh template eligible for new occurrences while branches remain places, as RP5/RP6 describe.

## N8: bounty money and local quest rewards (PM1)

Recommended generated contract quote, in a world's own currency:

```text
P0 = w*T + C
requested = P0 * (1+2*d) * (1+u) * clamp(((J+4)/(A+4))^0.25, 0.5, 2)
quoted = floor(min(requested, B/max(1,J)))
```

`w` is the local reference wage; `T` is expected in-world labor/travel time; `C` is supplied-material reimbursement; danger `d` and urgency `u` lie in `[0,1]`. `A` is effective available, qualified adventurer capacity and `J` is comparable unmet job demand over the same region/time window. Count capability-weighted supply, not every NPC with an “adventurer” tag. `B` is the unreserved issuer/board budget for that pool. One pool snapshot gives provisional quotes; acceptance reserves escrow and recomputes remaining offers. Advertised accepted payout remains fixed, unless an explicit renegotiation occurs.

No unfunded issuer conjures money. If the cap falls below credible cost, show the low-paying plea or a funded noncash alternative, and let it remain untaken. Danger can make a task unattractive despite its higher quote. Urgency describes world consequences, not a requirement to log in; expiry/closed-browser policies remain separate.

The example uses `w=25`, `T=4`, `C=0`, so `P0=100`. Patrol's source wage supports that **illustrative local reference**, not a conversion from simulation play units to game hours. With danger 0.25, urgency 0.25 and equal demand/supply, the integer quote is 187. More hunters reduce it to 140; scarce hunters raise it to 231. A 40-job monster boom with total treasury 2,000 caps each job at 50, while a funded response quotes 249. See [N16 tables](TABLES.md#n16-bounty-market-examples).

**Conflict in PM1's causal wording:** a monster boom increases demand for hunters; it does not inherently reduce labor prices. The cut needs finite budgets, easier targets, more available hunters or abundant sellable loot. Existing loot saturation supports the last mechanism, not a direct rule for bounty pay. Keep these causes distinct.

For a generated quest's local XP, a candidate completion supplement is `q * min(0.10*X_ref, 0.25*practiceXP_expected)`, where `X_ref` is the next-level interval for the template's declared native skill band, fixed when the offer is generated. Practice XP still follows native processing. This avoids raising the same cheap quest's award simply because the player leveled up. Some quests instead unlock access and give no XP. Faction/relationship consequences use authored outcome tables, not a universal reputation conversion. The XP supplement is not in the currency simulation and must be checked against native caps before implementation; do not overwrite existing authored quests.

## N9: offer density and storyteller pacing (QX12, QN11)

Use separate clocks for background board entries and interruptions. When a real eligible pool exists, generate the next procedural board interval as `gap=Uniform(0.5,1.5)/lambda`, in supported **in-world days**. Thus quiet minimum is `0.5/lambda`, pity maximum is `1.5/lambda`, and expected spacing is `1/lambda`. Authored beats retain priority; a due generated opportunity waits or becomes a quiet log entry, never displaces an important authored decision. Pity is an upper spacing bound while eligible work exists, not a promise to fabricate quests.

| Code | Adjective / `lambda` per day | Expected per illustrative 90-day season | Quiet / pity days | Why it matters |
|---|---|---|---|---|
| N9a | Sparse: `2/90` | 2 | 22.5 / 67.5 | Matches “two jobs a season.” A quiet frontier should not receive a universal hourly pity job. |
| N9b | Settled: 0.25 | 22.5 | 2 / 6 | Regular work without a constant feed. |
| N9c | Busy: 2 | 180 | 0.25 / 0.75 | Jobs can outnumber a person's capacity while the board remains readable. |
| N9d | Saturated: 8 | 720 | 0.0625 / 0.1875 | Dense work is world flavor, not hundreds of notifications. |

These are adjective presets, not verified assignments to specific source worlds or the native calendar's season length. They can be scaled with actual local needs. Goal match and proximity sort existing work rather than mint extra paid quests from each click. Default foreground presentation is three highlighted opportunities plus an expandable board/log; that is a display default, not an offer/acceptance/replay cap. Default procedural notification spacing is five **foreground session minutes**, with a digest for bursts. An urgent authored story moment can use a separate reviewed interruption rule. No new UI is implemented by R7.

Commit due time, generated offer IDs, pool revision, selected template/entities and RNG state. Reload continues the interval, it does not redraw it. An ineligible pool holds the pity clock; restoring eligibility uses its remaining time. Sparse worlds can legitimately stay quiet. Frozen/offline worlds do not acquire a new clock policy from this proposal. This lane's density simulation assumes eligibility continuously and no authored interruptions; it tests arrival counts/bounds only, not demand depletion, expiry, NPC competition or notification presentation.

## N10 to N17: simulation and sensitivity results

Run from repo root: `python3 docs/gm/dispatch/runs-and-endings-2026-10-14/r7/simulate.py`. Standard library only. [Script](simulate.py), [all tables](TABLES.md), [cycle CSV](cycles.csv), [sensitivity CSV](sensitivity.csv), [full numeric output](simulation.json).

The model has **no world-combat feedback**, native XP or boon utility. All deed scope/challenge/contribution factors are 1. Durations include setup implicitly but are invented productive-play units, not measured real hours. Repeated lives revisit the same finite family set; no manufactured novelty bonus or mandatory second world is used. The varied long life can take place within one realm. Eligible fresh episodes are assumed even for tiny lives; if a real world does not replenish them, tiny-life farming performs worse than this generous benchmark.

| Code | Strategy episode / base deeds per life | Ten-cycle framing / why it matters |
|---|---|---|
| N10a | Short: 2 time units, one help 2, discovery 4, first arc foothold 4 = 10 | One life per prestige; progress without an ending. |
| N10b | Long: 10 units, three arcs 60, ending 40, independent Ambition 12, two discoveries 8, two small outcomes 4 = 124 | One life per prestige; tests the value of deeper completed consequences, not lifespan itself. |
| N10c | Many short: each life 0.5 units, small outcome 2 and discovery 4 = 6 | Four lives per prestige, ten prestige cycles. The ledger can span declined-prestige deaths, but new episodes must be legitimate. Changing to prestige every life gives the same currency for the same deeds. |
| N10d | Grind one world/ending: 6 units, one arc 20, ending 40, small outcome 2 = 62 | One life per prestige; same ending family repeated. Does not imply every life in that world has diminished rewards. |

Ten cycles yield long 105.17 currency, grind 64.50, many-short 26.72, short 16.13, but consume 100/60/20/20 units respectively. That is not a fair time-efficiency ranking by itself. At an equal **100-unit** budget:

| Code | Strategy | Prestiges / completed lives | Effective deeds, including pending | Banked currency | Earned pending currency | Why it matters |
|---|---|---|---|---|---|---|
| N11a | Short | 50 / 50 | 257.89 | 45.32 | 0 | Earns steadily despite no ending. |
| N11b | Long | 10 / 10 | 838.69 | 105.17 | 0 | Wins these default time/deed assumptions. |
| N11c | Many short | 50 / 200 | 524.75 | 75.68 | 0 | Rapid life changes alone do not grant extra permanent rewards. |
| N11d | Grind one ending | 16 / 16 | 626.93 | 84.73 | 1.08 | Four units of the next life earn stages but have not completed another prestige. |

| Code | Answer / sensitivity | Why it matters |
|---|---|---|
| N18a | **Does a long life beat many short ones?** Default: yes, 105.17 versus 75.68, about 1.39× at equal time. Steady repeat mode is nearly tied, 137.76 versus 134.70. If rising applies to unchanged easy openers too, many-short wins 176.97 versus 167.13. | Prefer a reward for deeper deeds, not a universal promise that longer is always better. Use rising where the world adds real commitment, or intentionally accept its farming emphasis. |
| N18b | **Does grinding one ending dominate?** Default six-unit ending: no, 85.80 total entitlement versus 105.17 long. Compress the same 62-deed ending to four units and grind wins 109.65; five units gives 96.39. One-unit clears yield 246.26. | Diminishing rewards do not repair an arbitrarily fast high-value ending. Calibrate that ending's scope/contribution/closure bonus or deliberately accept the specialty; do not impose a universal “once.” |
| N18c | **Do early worlds remain meaningful?** New ordinary numerical carry remains at or below +10% for every strategy, even with large deed histories. Local deed value does not vanish and the default repeat floor stays 0.35. | This bounds the proposed numerical channel. Actual early-world combat, choices and useful rewards remain untested; caps alone do not prove meaningful gameplay. |
| N18d | **What if long lives are dangerous?** First-attempt exponential death hazard 0.05/unit gives long expected deed rate 11.05/unit versus tiny 11.92; at 0.2 the rates are 8.00 versus 11.69. Reached milestones survive. | Even modest mortality reverses the fresh-life rate in this schedule. This analytic stress is not a full repeat-adjusted ten-cycle death simulation. Move meaningful checkpoints earlier, tune the world hazard/commitment or offer safer deep routes; do not force lethal worlds to share the safe-world target. |
| N18e | **What if the growth exponent changes?** The CSV includes 0.5/0.65/0.8 across all three repeat modes, four strategies and an equal-time budget. | A common monotone curve cannot change the effective-deed ranking. Alpha is a pacing dial, not a substitute for fixing outcome rewards or timing. |
| N18f | **What do the market and density tests show?** Bounty pay responds to danger, urgency, qualified labor and available funds; sparse/settled/busy/saturated presets produced 22/220/1,783/7,193 arrivals over 900 days with fixed seeds. | Offer counts match intended orders of magnitude; they do not validate a living economy or board readability. The bounded interval includes both quiet and pity behavior. |

## N19: recommended defaults and dials

| Code | Dial | Recommended default | Reasonable palette | Why it matters |
|---|---|---|---|---|
| N19a | Deed weights | 2 / 4 / 12 / 20 / 40, by the five outcome kinds | Per-template/world; preserve declared parent budgets | Balances ordinary lives against closure, without converting all XP or money. |
| N19b | Arc installments | 20% / 30% / 50% | Earlier milestones for lethal/long worlds; shares always sum to 100% | Preserves partial-earned credit and prevents duplicate closure pay. |
| N19c | Currency curve | Scale 10, reference deeds 20, alpha 0.65 | Alpha 0.5..0.8; tune price scale together | Sublinear growth with fair cumulative accounting. |
| N19d | Repeat meta | Diminishing, floor 0.35 | Floor 0.20..0.60; steady/rising world variants retained | Repeating known content still earns; variety can exist within a single world. |
| N19e | Rising mode | +0.15 per log2 occurrence, cap 1.5 | Slope 0.05..0.25, cap 1.25..2; cheap families can use another mode | Keeps rising possible and its farming consequence explicit. |
| N19f | Sideways option cost | 10 / 25 / 50 plus earned predicate | Tune by actual consequence and pool size | Currency buys different opportunities, rather than random unexplained strength. |
| N19g | Ordinary vertical carry | +20% asymptote, lifetime scale 100; early-world clip +10% | World clip 0..20% ordinarily; explicit exceptional premise can override | Prevents ordinary meta from escalating forever inside early worlds. |
| N19h | Boon draw | Three to five offered, choose one, no replacement | Earned breadth/affordability and world slots control access | Avoids reset-count growth; committed offers prevent reload rerolls. |
| N19i | Bounty sensitivity | Danger coefficient 2, urgency 1, labor elasticity 0.25, smoothing 4 | Elasticity 0.10..0.50; world wages, costs and budgets | Separates higher risk from oversupply and finite funding. |
| N19j | Density/pacing | N9 presets; gap 0.5..1.5 expected intervals | Cozy to saturated, eligibility-driven; clock rules unchanged | Changes world supply without forcing the player to take every bounty. |
| N19k | Visible offers/notifications | Three highlights, rest accessible; five session-minute spacing | Player filter/digest/quiet settings; urgent authored beats separate | Presentation restraint is not an acceptance cap or world scarcity rule. |

## N20: proposed persistence and compatibility decision

No migration is implemented. A future additive, versioned ledger needs: cumulative effective deeds, issued/spent currency and rounding remainder, outcome receipts, parent budgets/stages, family repeat counts, committed formula versions, eligible/owned/selected options and committed boon offers. Market records need issuer reserves, accepted escrow and quote revisions; generated offers need episode/entity IDs, next due time, RNG state and supported clock ownership. Receipts distinguish character, world instance, lineage and account meta owners.

Recommended old-save migration defaults the new ledger to empty/zero and leaves native titles, XP, quest completion, heir leftovers and existing world records intact. Do not infer retroactive multi-life currency from a title/knockout counter that lacks provenance. If retroactive recognition is later desired, use an explicit, recorded migration allowance supported by existing evidence, never repeated recalculation on load. Retain the original save before any future migration. A formula change freezes old credited amounts and applies a new version to new episodes rather than repricing spent history.

Stage commit and eventual prestige issuance must be atomic and idempotent. Import/export preserve the same receipt identity, issuance high-water mark, branch ancestry, RNG and escrow, with compatibility rules for merging imported instances into the same account history. A fork starts with inherited ancestor receipts, not a clean mint. Preserve unknown or dormant save fields. Do not turn lineage continuation into a prestige reset or treat travel as a claim transaction. RP5's fresh canon template and RP6's retained branch places are separate owners, not currencies.

## N21: verification and remaining gate

The small script executed successfully and produced ten-cycle tables for all four requested strategies, equal-time results, nine repeat-mode/exponent combinations, eight ending-speed cases, five analytic survival cases, seven market examples and four seeded density presets. Its 27 checks cover curve telescoping, zero-reset neutrality, arc/profile totals, repeat bounds, budget cap, the rejected per-life split advantage and seeded interval bounds. Mathematical verification is limited to this proposal model. [Source fingerprints](SOURCE_SNAPSHOT.json) record the read checkout; [reproducibility record](REPRODUCIBILITY.json) records the generated-output comparison. They do not claim a clean working tree.

Four generated outputs were byte-identical on rerun; local file links and whitespace passed. Concurrent changes to `docs/USER_VISION.md` were detected after fingerprinting, so relevant lines 33 to 62 were re-read and remain consistent with this proposal. Other fingerprinted sources had no drift at the check. Only this lane's artifacts were written by R7.

No native tests, build, browser game, persistence import or reference playthrough was needed for this docs-only lane, and none is claimed. A future selected slice needs actual measured outcome times, danger and option utility, followed by rebuilt desktop/laptop browser evidence and exact save/reload/import accounting. First milestone remains one realm and one prestige layer. The full market, branch atlas, multi-world/offline simulation and boon catalogue are later possibilities, not new required gates for the existing playable work.
