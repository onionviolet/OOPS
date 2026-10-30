# Progression gate rules

Weibao, 2026-10-23: "consider implementing ruleset to help absorb progression
gates and more? more to consider?"

A progression gate is any point where progress waits on something: a realm
bottleneck, a guild rank exam, a sect's admission token, a recipe you have not
learned, a body that cannot yet hold a technique, a start option, a panel that
has not appeared. Sources are full of them, and today each one is written by
hand in its own module. This rulebook fixes how a gate is absorbed from a
source, modelled in the engine and shown to the player, so the next world gets
its gates as data over one shape instead of a new script per gate.

It composes existing owners and adds only what none of them covers.

| Owner | What it keeps | Used here as |
| --- | --- | --- |
| `src/rules.js` `evaluateRule` | Pure fact rules returning `met`, `known`, `reasons` | The one gate evaluator (GTR9) |
| `src/check_contract.js` `requires` | A check blocked by an unmet rule | Gated attempts with risk (GTR14) |
| `src/native_unlock_transaction.js` | Unlocks staged before save, no reward replay on load | How a gate opens (GTR12) |
| `src/reveal_chain.js` | Earned lessons that reveal recipes and UI | Presentation gates (GTR18) |
| [Cheat library US1–US6, ST11–ST17](CHEAT_LIBRARY.md#unlocking-the-optional-start-and-keeping-progression-intact-2026-10-13), [UP1–UP10](CHEAT_LIBRARY.md#more-to-consider-the-status-window-unlock-progress-and-random-starts-2026-10-13) | Start and cheat unlocks, unlock progress | Meta gates (GTR19) |
| [Shounen world gating G1–G8](research/reincarnated-in-a-shounen-manga/YAIR_CONSIDERATIONS_2026-10-16.md#world-gating-and-similar-world-fixtures-2026-10-17) | Gating worlds by fit | World entry gates (GTR19) |
| [World pass rules](WORLD_PASS_RULES.md) WPR14, WPR31 | Rank gates in coverage, mechanism over item list | Absorbing gates in a pass (GTR5, GTR7) |
| [World absorption rules](WORLD_ABSORPTION_RULES.md) WA1–WA53, WAC9 | Laws as rules and gate modules | Where absorbed gates land (GTR7) |
| [Domain rules](DOMAIN_RULES.md) SLR, CBR, ECR, BHR | Skills and rust, queued outcomes, quotes, bodies | Gate kinds' own mechanisms (GTR3) |

Status: proposed 2026-10-23 from Weibao's request. Defaults for agents; a world
may propose an exception with a reason. Nothing here is accepted direction
except where a rule cites an AD line or Weibao's own words. It authorizes no
runtime change or migration of existing gates.

Direction this rulebook applies: Weibao's own remarks prefer guiding over
gating ("we would not be gating it", [famine XP, 2026-10-13](USER_VISION.md#food-benefits-and-famine-consideration-2026-10-13);
"dont constrain, guide?", [layered repair, 2026-10-17](TOOLS_AND_INSTRUMENTS_CONSIDERATIONS_2026-10-17.md#round-4-layered-repair-and-guiding-instead-of-gating-2026-10-17)),
and unlock gates are "a possible mechanism, not a selected universal
requirement" ([OD10](USER_VISION.md#overarching-direction-discussion-od10--q5-2026-10-15)).
So a gate here is a mechanism with costs, not a permission lock.

## Rules (GTR)

### What a gate is

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| GTR1 | **A gate is a fact rule over actual means.** Write each gate as: what it reads, its default threshold, the dial that moves it, the in-world reason and the cost of the routes around it (AD5, AD38). | Per world, per gate | "X requires Y" locks with no reason or alternative |
| GTR2 | **The gate reads the mechanism, not the label.** A realm bottleneck reads the body's capacity and foundation, not "is realm 3"; a guild rank reads the guild's record. If the mechanism is satisfied another way (a pill, a borrowed body, a forged record), the gate behaves accordingly, with that route's costs and risks (AD38). | A world law can make a route very costly, with its reason | Permission lists that miss reasonable routes |
| GTR3 | **Name the gate's kind and its owning mechanism.** Kinds: capacity (body or vessel), knowledge (method, recipe, route), credential (an institution's record), resource (cost paid), maturation (time, practice, growth), world state (an event or place), social (sponsor, permission, debt), law (a world rule), presentation (what the UI shows). The kind's own owner holds the mechanism (BHR, SLR, ECR, PIR, SR, UR). | A gate may combine kinds with `all`/`any` | One generic "level" stat standing in for every reason progress waits |
| GTR4 | **Gates pace and guide through actual means.** Record supported alternate routes and their actual costs, including none, or why none is currently known or available. Passive and idle progress accrues where the method still produces it, then follows the declared overflow policy (GTR16) ([famine direction](USER_VISION.md#food-benefits-and-famine-consideration-2026-10-13)). | The cost dial, from none to near-prohibitive | Hard walls; idle time wasted at a cap |

### Absorbing gates from a source

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| GTR5 | **Catalog each gate in a pass.** Record what it reads, who or what enforces it, what the text shows getting past it (cheats, exceptions, failures), what failing costs, and the evidence label and locator (WPR4, WPR14). | A tiny pass catalogs only the gates its slice touches | Gates rebuilt from memory or fan summaries |
| GTR6 | **Source absolutes describe the ordinary case.** "No one breaks through without X" becomes a default with the exceptions the text shows and any reasoned exception the world allows (2026-10-17 direction, AGENTS design framing). | Canon strictness per world | Copying a narrator's absolute into an engine wall |
| GTR7 | **Recurring gate shapes become shared descriptors with per-world rows.** Bottleneck, exam, token, sponsor, maturation timer and similar shapes are one mechanism each, with data rows per world (WPR31, WA1, WA5, WAC9). | A truly unique gate gets a local module that the pack names | A hundred one-off gate scripts |
| GTR8 | **Gates re-evaluate against the world you are in.** A carried power or rank meets the destination's gates by how it works there: earlier progress counts where its mechanism applies, and the world's own institutions decide whether they recognise a foreign credential (Rulebook 2–3, AD1). | Per world and per carrier | Free cross-world skips, or worlds that ignore what really carried |

### Runtime shape

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| GTR9 | **One evaluator.** New gates use `evaluateRule` (`met`, `known`, `reasons`) over caller-owned facts. Existing ad hoc gates stay as they are until a change touches them (AR1, no migration sweep). | None for new content | Parallel boolean checks that disagree |
| GTR10 | **Unknown is not unmet, and reasons follow means.** The player sees "you lack X" only when they could know X; otherwise "something is missing" or nothing. Reason text that names a sealed truth never reaches the player outside its discovery route (AD6, AD7, sealed secrets). | How much an appraisal or status window reveals, per world | Gate messages that spoil secrets or claim knowledge the character lacks |
| GTR11 | **Separate admission from continuing support.** A gate is evaluated when a new action, quote or commitment is made. Admitted work keeps its admission and quoted entitlement (the Paradise admission pattern, CBR queued outcomes, ECR quotes). Continuing support and newly committed stages follow their own declared checks; losing support settles through the existing owner and cancellation policy, rather than a rescan of all admission gates. | A world event may cancel queued work, as an event with its reason | Old saves and queued jobs breaking when a gate changes |
| GTR12 | **Opening is a staged transaction.** Effects stage before the save and publish after it; a reload never replays the reward (`native_unlock_transaction`). The opening is recorded as a saved fact with its cause. | None | Duplicate rewards and openings that vanish on reload |
| GTR13 | **Gates can close again, with a reason.** A revoked credential, an injured vessel or a lost sponsor closes what reads it; what was already learned or gained follows its own mechanism (SLR rust, BHR recovery), not an automatic wipe. | Whether openings persist, per gate | Either permanent unlocks that ignore loss, or loss that erases learning |
| GTR14 | **Evaluating is a pure read; attempting is a check.** Evaluation never spends, rolls or writes (`rules.js` contract). A risky attempt (a breakthrough, an exam) is a check with the gate as its `requires` and the risk in its outcomes (`check_contract`, GR1–GR17). | Per world: how often attempts can fail and what failure costs | Hidden side effects from merely looking at a gate |

### Pacing, legibility and players

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| GTR15 | **Show progress toward a gate the character knows about.** Use a progress bar or count where the character could measure it (AD40, UP1–UP10); a vague sense ("your foundation feels thin") where they could only feel it. | Precision follows the character's means | Invisible walls, or exact numbers the character could not have |
| GTR16 | **Overflow is absorbed, not silently lost.** Progress that hits a cap is banked, converted, spilled into a neighbour, or lost with a stated reason and pressure (stored foundation, strain, a rival noticing). | Per world and per gate: lost, banked, converted, pressure | Idle hours wasted at a cap without the player knowing |
| GTR17 | **Pacing options may loosen gates; an inspector shows them.** Proposal: player pacing dials can move gate thresholds within a life (the existing absorption-wave pacing options do not touch gates today and start off). A debug view lists gate state, inputs and reasons; inspection never mutates (AD22, Weibao is essentially the only player). | Per life | Rebalancing by editing content; untestable gates |
| GTR18 | **Presentation gates reveal, never hide what you already reached.** A panel or verb appears when its mechanism first comes up ([discovery-aware menus](USER_VISION.md#discovery-aware-overview-menus-2026-10-03), [UI gating](USER_VISION.md#proto23-full-source-ui-absorption-2026-10-13)); once revealed it stays reachable by default and closes only through GTR13 with a reason (memory loss, a lost status window); a test setting may reveal everything (UR rules govern the surface). | How early a world reveals: on first mention, first use or first understanding | UI unlocks that hide working systems or reset on reload |
| GTR19 | **Start, cheat and world-entry gates are possible mechanisms, not universal requirements.** Use US1–US6, ST11–ST17 and G1–G8 as palettes; warn about known losses rather than forbid entry ([OD10](USER_VISION.md#overarching-direction-discussion-od10--q5-2026-10-15), AD5). | Per world and per start mode | A mandatory unlock ladder before play |
| GTR20 | **NPCs meet the same gates.** An NPC's promotion, breakthrough or admission reads the same descriptor and facts, and fails or bypasses by the same routes (AD6). | Off-screen NPCs may resolve gates in summary | A player-only rule system the world does not live by |

### Found while building (round 2, 2026-10-23)

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| GTR21 | **Every cap names its overflow, and the player can learn it.** A cap states lost, banked, converted, spill or pressure (GTR16) where it is defined, and the surface that shows the cap says what happens to the excess once the character could know. | Per world and per cap | Today's silent losses: single-gain XP cap, locked-skill XP reset, Mistglass reserve and practice minutes ([overflow GTO1–GTO10](PROGRESSION_GATE_OVERFLOW_2026-10-23.md)) |
| GTR22 | **A finished track says what happens next.** "Maxed out" also says whether further progress is held, converted or inert, and what, if anything, reopens the track (a higher tier, a teacher, a world law). | Wording per world | Players grinding into a track that silently stopped counting |
| GTR23 | **Player-facing reasons come from authored text, never raw keys or errors.** A rule without an authored reason or hint shows the vague line; exception messages and fact keys stay author-side. Filter through an authored set where a module already does (`skill_expansion_host`). | None | Fact-key leaks through `rules.js`'s fallback reason and raw `e.message` in player notices ([inventory patterns](audits/PROGRESSION_GATE_INVENTORY_2026-10-23.md#4-patterns)) |
| GTR24 | **Hiding is a knowledge decision, not a display filter.** An option is hidden because the character cannot know it exists (GTR10, AD6); otherwise it shows as waiting, with what the character can tell about why. | Per world, how much a status window reveals | Silent display filters that make reachable progress look absent |
| GTR25 | **Credentials are records held by their institution.** A rank, tier, grade or membership is a fact owned by the issuing institution, with its rights and duties, not derived from level; other institutions decide whether they recognise it (GTR8). | Per institution | Rank computed from level, so revocation, forgery and foreign recognition cannot exist ([Paradise RPG48–RPG55](worlds/paradise-hub/PROGRESSION_GATES_2026-10-23.md#8-proposals-p)) |
| GTR26 | **Attempt limits are adjectives and visible when known.** A gate with limited attempts (trials, exams, breakthroughs) states how often, the cooldown or cost per attempt and the failure ladder, and shows "n of m" where the character would know it (AD22). | Per world and per gate | Unannounced one-strike walls; unlimited free retries that empty the gate of meaning |
| GTR27 | **A gate module counts once a player journey crosses it.** Descriptor, inspector row and test do not make a gate live; integration does (AR, AGENTS verification). An unwired gate is listed as such in the inventory. | None | Treating `breakthrough_trial`-style unwired modules as shipped progression |

### Found across book worlds (round 3, 2026-10-23)

Each rule below recurs in at least two of the [five world audits](worlds/progression-gates-2026-10-23/);
codes in brackets are the worlds' own proposal rows.

| Code | Rule | Dial | Mistake it prevents |
| --- | --- | --- | --- |
| GTR28 | **A reset names what carries, per asset class.** A loop, death, rebirth or world crossing lists each class (knowledge, skill, title, body, reserves, items, relations, quest state) as carried, partly carried (with rate) or dropped, and why. | Per world and per reset kind | Loops that silently keep or wipe the wrong things (SGX1, MLX1, MLX2, MLC1, SSX6) |
| GTR29 | **Overflow rows cover all five policies and can key on more than the world.** Lost, banked, converted, spill and pressure are each expressible; a row may vary by rank, place or teacher inside a world. | Per world, rank, place | Forcing pressure or conversion worlds into "lost" (SG Celestial skills, LMP4–LMP6, RIG37–RIG40, SSO1–SSO8, MLP1) |
| GTR30 | **Thresholds may scale with facts.** A dial can be an expression over facts (for example doubling per stage, tenfold per rank), stated in the row. | Per gate | Hand-tabled thresholds that drift from the world's own scaling (RIX3, SS rank-split limits) |
| GTR31 | **Gates can carry clocks.** A window that closes, an upkeep that lapses, a hazard that grows while ignored, or a calendar event cleared by surviving it is part of the gate, with an idle-safe pause where the world allows one. | Per world, how forgiving idle time is (AD19) | Gates that only read a snapshot and miss timing (RIX2, RIX7, LMX3, LMX7, SSX1, MLX6) |
| GTR32 | **A mismatch can reduce output instead of blocking.** Using power above your rank, out of role or against a neighbour's interference lowers yield or adds risk on a curve, rather than refusing. | Per world, the curve | Binary locks where the source shows partial success (RIX5, SGX4, LMX4, MLX6) |
| GTR33 | **Scarce supply lives in a world ledger.** Conserved, unique or singular things (characteristics, seats, one-of-a-kind items) are counted per world, so one holder's gain is another's absence; convergence and pull bias where they appear. | Per world | Free duplication of scarce progression keys (LMX1, LMX2, LMX8, RIX10) |
| GTR34 | **Opening a gate can consume, exclude or attach.** Crossing may spend the stock it read, close a rival path, or attach a mandatory cost (a flaw, an oath, a debt) that later gates read. | Per gate | Gates that open for free and leave no trace for later choices (SSX4, SSX5, SSX7, LMX6, RIX11) |
| GTR35 | **Reading a gate's state is itself a means.** Status reads, appraisals and outside assessments can be gated, costly, fallible or revealing to the reader's watchers (GTR10 says what may be shown; this says what the read costs). | Per world and per read method | Free perfect information about every gate (SGX3, LMX5, SSX9) |

## Absorbing a gate (checklist)

1. Name the gate, its kind (GTR3) and owning mechanism.
2. Catalog it from the source with evidence and the shown routes past it (GTR5, GTR6).
3. Write it as default, dial, reason and route costs (GTR1, GTR2, GTR4).
4. Map it to a shared descriptor row, or justify a local module (GTR7).
5. Wire it through `evaluateRule`, commitment-time checks and the staged opening (GTR9, GTR11, GTR12).
6. Decide what the player sees and how overflow behaves (GTR10, GTR15, GTR16).

## More to consider, round 1 (2026-10-23)

### ACT NOW (done)

- This rulebook, with its register and router rows in the [rules index](RULES_INDEX.md),
  Weibao's request in USER_VISION and one PROJECT line.

### ACCOUNT FOR NOW

| Code | Constraint on current work | Why |
| --- | --- | --- |
| GTC1 | Proposed application for selected new gates: use `evaluateRule` and commitment-time checks; no migration of existing gates is selected | Keeps lanes moving without a sweep nobody asked for |
| GTC2 | Gate `reason` strings are author text; route them through appraisal before display | Sealed secrets and AD6 already apply; gates are a new leak path |
| GTC3 | A gate change in content needs a save-compatibility note: what happens to work admitted under the old gate (GTR11) | Persistence changes need a migration or explicit decision (AGENTS safety) |
| GTC4 | Idle progress at a cap follows GTR16; a lane that adds a cap states its overflow behaviour | Passive progression direction applies across systems |

### LATER / DELEGATE

| Code | Item | Level and effort | Done check |
| --- | --- | --- | --- |
| GTL1 | Gate inventory: sweep `src/` (about 90 files mention unlocks, about 250 mention requires) into a table of file, gate kind, evaluator used, persistence | haiku, small | Table saved under `docs/audits/`, every row with a file and line |
| GTL2 | Shared gate descriptor over `evaluateRule`: `{id, kind, requires, reason, dial, routes, closes, overflow}`, with one existing gate (the herb lesson in `reveal_chain`) moved onto it | sonnet, medium | Focused test passes; the moved gate behaves the same after save, reload and import |
| GTL3 | Gate inspector in the debug view: gate state, inputs, known/met and reasons, read-only | sonnet, medium | Rebuilt browser check at 1920x1080 shows a real gate's state with no state change |
| GTL4 | Overflow policy for cultivation realms and skill caps (GTR16) as per-world rows | designer plus sonnet, small | One world's caps state lost, banked or converted, with a reason, in its owner |
| GTL5 | Reincarnation Paradise gate catalog (ranks, evaluations, world-entry requirements) as a WPR pass using GTR5 | haiku readers plus sonnet review, medium | Owner doc lists each gate with evidence label, routes past it and cost |

## Round 2: implementation (2026-10-23)

Weibao: "implement each accordingly, consider other necissary rules too".

| Item | State | Evidence |
| --- | --- | --- |
| GTL1 inventory | Done, research | [PROGRESSION_GATE_INVENTORY_2026-10-23](audits/PROGRESSION_GATE_INVENTORY_2026-10-23.md): about 60 rows; evaluateRule about 12 sites, about 25 ad hoc unlock checks, about 15 silent caps and filters; inferred rows labelled |
| GTL2 descriptor | Done, focused tests pass | `src/progression_gates.js` (`defineGate`, `evaluateGate`: dials, costed routes, closes, overflow, author versus player reasons); herb lesson moved in `src/reveal_chain.js` with unchanged behaviour; `tests/progression_gates.test.js` |
| GTL3 inspector | Done, browser checked | Gates chain in `src/chain_inspector.js`; the floating lens now has a solid fill. Rebuilt bundle, headless 1920x1080, `?harvest-inspector=1`, Options tab: herb gate shows waiting at 7/20, inventory and facts unchanged, no console errors ([screenshot](gm/dispatch/progression-gates-2026-10-23/gate-inspector-1920.png), [script](gm/dispatch/progression-gates-2026-10-23/gate_inspector_check.cjs)) |
| GTL4 overflow | Done, proposal | [PROGRESSION_GATE_OVERFLOW_2026-10-23](PROGRESSION_GATE_OVERFLOW_2026-10-23.md) GTO1–GTO17: current behaviour with file:line, frontier and Mistglass rows, descriptor fields, later items. No gameplay change |
| GTL5 Paradise catalog | Done, research from saved owners | [PROGRESSION_GATES_2026-10-23](worlds/paradise-hub/PROGRESSION_GATES_2026-10-23.md) RPG1–RPG55 and 11 honest absences; no source reread; Tier 8 penalty conflict kept both ways. Link from the hub brief and kit card waits for that file's current writer |

Checks (2026-10-23, dirty shared tree): focused `progression_gates`, `reveal_chain`, `chain_inspector` tests 18/18; `check:rules` pass; `check:rule-behavior` 36/36; full `npm test` 2660/2663, the three failures (`optional_ui` import order, `economy_standing` surface, and four new import cycles in `check:arch`) trace to another session's uncommitted `ui_extras.js`, `lives_carry_domain.js` and `economy_standing.js`; this change's UR65 color hit was fixed. Rebuilt headless browser check repeated after that fix.

New rules GTR21–GTR27 come from these returns. Next, as later items:

| Code | Item | Level and effort | Done check |
| --- | --- | --- | --- |
| GTL6 | Per-world single-gain overflow: **done 2026-10-23** (frontier banks, unlisted worlds lose with a stated reason; [record](PROGRESSION_GATE_OVERFLOW_2026-10-23.md#gtl6-implemented-per-world-single-gain-overflow-2026-10-23)). Remaining: max-level and locked-skill wording (GTR22), a fade dial, rows for other worlds | sonnet, small each | Rebuilt browser check per added row; save/reload/import keeps banks |
| GTL7 | Apply GTR23: authored fallback in `rules.js` callers that show reasons, and stop raw `e.message` in `crafting_frontier_runtime.js` notices | sonnet, small | Focused tests show no fact key or exception text in player output |
| GTL8 | Move the five duplicated `is_unlocked` panel reads in `main.js` onto descriptors when that code is next touched (GTR9, AR1 net zero) | sonnet, small, opportunistic | Inspector lists them; behaviour unchanged |
| GTL9 | Paradise first runtime slice from RPG55 (Tier 1 to 2 plus the 50-per-stat cap) as GTR25 credential records | designer plus sonnet, large | Played journey through a promotion with save/reload/import |

## Round 3: book-world audits (2026-10-23)

Weibao: "audit specific book worlds for more cases, like The Stubborn Skill-Grinder
In A Time Loop (Book 5 Stubbed) and more?"

| World | File | Gates | Source read | Notable |
| --- | --- | --- | --- | --- |
| The Stubborn Skill-Grinder in a Time Loop | [STUBBORN_SKILL_GRINDER](worlds/progression-gates-2026-10-23/STUBBORN_SKILL_GRINDER.md) | SKG1–SKG14, SGX1–SGX8 | About 28k words of saved Royal Road text; saved copies hold ch 1–3, 88–94, 96–100, 110–113 only; Book 5 stubbed | Public threshold titles, Observe as privilege, loop carry set, no hard skill cap |
| Lord of the Mysteries | [LORD_OF_THE_MYSTERIES](worlds/progression-gates-2026-10-23/LORD_OF_THE_MYSTERIES.md) | LMG1–LMG33, LMX1–LMX10 | Saved notes only | Digestion live in the slice; switching blocked rather than priced; conserved characteristics absent |
| Mother of Learning | [MOTHER_OF_LEARNING](worlds/progression-gates-2026-10-23/MOTHER_OF_LEARNING.md) | MLG1–MLG30, MLX1–MLX9 | Saved notes only | Built Cyoria has no loop; reserve carry kept as a contradiction (MLC1) |
| Shadow Slave | [SHADOW_SLAVE](worlds/progression-gates-2026-10-23/SHADOW_SLAVE.md) | SSG1–SSG52, SSX1–SSX13 | Saved notes only | Nightmare rank gates, core saturation, Aspect plus Flaw |
| Reverend Insanity | [REVEREND_INSANITY](worlds/progression-gates-2026-10-23/REVEREND_INSANITY.md) | RIG1–RIG57, RIX1–RIX13 | Saved notes only | Healing bottleneck windows, scaling thresholds, Gu upkeep, lifespan costs |

All rows are proposals. Four lanes relied on inherited locators without reopening
the novels; the Skill-Grinder lane is the only one with fresh source reading.
Every world except the frontier currently falls to the stated "lost" overflow row.

Later items from this round:

| Code | Item | Level and effort | Done check |
| --- | --- | --- | --- |
| GTL10 | **Pilot blocked 2026-10-23:** no candidate was both live and source-stated ([GTL10 report](gm/dispatch/progression-gates-2026-10-23/GTL10_REPORT.md)); needs a live consumer per its options (a)-(c). Original scope: extend `SKILL_GAIN_OVERFLOW` with converted, spill and pressure policies and an optional rank or place key (GTR29), then add the proposed rows for LOTM, Cyoria, Shadow Slave, Reverend Insanity and Skill-Grinder | sonnet, medium; balance rows need Weibao's play | Focused tests per policy; rebuilt browser check in one non-frontier world |
| GTL11 | Fact-scaled dials and clocked gates in `src/progression_gates.js` (GTR30, GTR31) | sonnet, medium | Tests for a doubling threshold and a window that closes; inspector shows both |
| GTL12 | Reset carry tables per world in `src/carry_ledger.js` (GTR28), starting with a loop reset | designer plus sonnet, medium | One world's reset carries and drops the listed classes after save, reload and import |
| GTL13 | Reopen source for the locators the four notes-only lanes inherited, where a row will be built | haiku readers, small per world | Each built row cites a reopened locator |

Suggestions, separate from the round: name gates in task records by GTR code
when a lane adds one; fold lessons from the first GTL pass into a "Lessons
carried in" section like WPR's.
