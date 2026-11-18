# Mechanism foundation: express nearly any ability as data (2026-11-18, proposals)

Register status: Proposal (AD32, AD56), paper plus one measuring script. Agent-read once, not human-reviewed. Nothing here edits `src/effect_grammar.js`, `src/world_effects.js` or `src/effect_host.js`; changes to them are proposed as diffs (MF9). Standing direction it serves: no forced weakness (the world pushes back through people), cheats in consideration (CHT1-CHT20), everything can become OP (CHT13), mechanisms not allowed-outcome lists (AD38).

Inputs: the extreme-abilities note (XA1-XA26, XM1-XM5, XG1-XG14, branch `claude/extreme-abilities-fbc141`, which also carries the F-numbers from the discourse findings: F3 delivery vs payload, F5 loops declare what carries, F7 reach is not bypassed unless shown, F9 a holder can be wrong about their power), the JoJo shapes (one conditional rule per Stand, the condition is the counterplay, six stat letters), `src/effect_grammar.js`, `src/world_effects.js`, `landEffect` in `src/effect_host.js`, palette rounds 13-14, and `docs/coverage/blocked_slugs.json`. Counts: the canonical list holds **76** slugs, not 75.

The answer to Weibao's question, short: **no, not all mechanisms are covered; 53.8% of the 22,922 blocked rows that name a mechanism sit on a substrate whose owner can already land every verb they need, and 100% map to some substrate** (MF3). The other 6,033 blocked rows are label debt (nothing named yet). Two families cannot be run at all and stay narrative: the fourth wall and save awareness through a screen-level hook (MF8).

## MF1 One mechanism shape

Today a sentence has seven slots: `verb | object | target | time | carrier | cost | limits`. Keep them and add four, so every old sentence stays valid (absent slot = today's behavior).

| Part | Slots | Meaning | Default |
| --- | --- | --- | --- |
| **trigger** | new: `{on, by, then}` | `on`: `touch`, `sight`, `speech`, `name`, `presence`, `time`, `event:<kind>`. `by`: who or what satisfies it. `then`: the next shape (chains). Stored as data on the field or row so the inspector can show it and a counter can answer it. | absent = fires when used |
| **delivery** | `target` + `carrier` + new `reach` and `passes` | how it arrives: `reach` is `self`, `touch`, `range:N`, `area`, `sure-hit`; `passes` lists the concepts or barriers it is stated to get through (F7). | reach `touch`, passes `[]` |
| **payload** | `verb` + `object` (+ `details`) | what it does, on one substrate verb (MF2). | as today |
| **scope** | new | `self`, `holder:<id>`, `place:<id>`, `group`, `world`; the place where the effect is a law field. | `self` or the target |
| **duration** | `time` + new `until` | `instant`, `sustained`, `lasting`, `until:<event\|tick>`. | as today |
| **terms** | `cost` + CHT4 terms | gift, loan, lien, leash, burdened loan, backing (CHT5), who pays. | none |
| **limits** | `limits` | adjectives (how often, how much), not a fixed count (AD22). | none |

Why split delivery from payload: a counter can then stop one half (a barrier that out-reaches the delivery, a protection that blunts the payload), which is how partial counters work in the evidence (F3, XG7). Why a typed trigger: one conditional rule per Stand is most of what JoJo-style powers are, and the condition is the counterplay, so it must be data a person, a counter and the inspector can read (XG11).

**Default / dial / reason.** Default: shapes are plain objects checked by `checkEffect`; unknown parts are refused with a reason rather than ignored. Dial: per world, which trigger kinds exist. Reason: a closed part list keeps the engine checkable; extensibility lives in substrates and `property:<name>`, not in free-form parts.

## MF2 Substrates: nine, plus an open slot and a fallback tier

A substrate is a kind of thing abilities change. Each has **one W owner** (one authority per fact, AR1), a reactor that answers the verbs, and a small verb list. Source of the built/planned state: the files named in `mechanism_map.json`.

| Substrate | Owner | Verbs (built in bold) | Covers |
| --- | --- | --- | --- |
| **time** | planned `world_time` (the timeline lane builds restore) | hold, rate, snapshot, restore, skip, branch | stop, cut, haste, loops, rewinds, branches |
| **space** | position, `link_set` (E10) | **move**, **link**, portal, enter, contain, scale-of-places | teleport, portals, pockets, dimensions, storage, distance powers |
| **body** | quantities, `property:form`, `form_transformation_law` | **add**, **remove**, **transform**, **make**, scale | wounds, forms, disease, matter, crafting, size |
| **mind** | channels (built); knowledge owner N (unwired) | **sense**, **conceal**, forecast, believe, remember, compel, alter-state | perception, precognition, belief vs truth, memory, mind control, emotion |
| **chance** | generator contract PC82 (planned); pin store PSA29 (built, `src/pin_store.js`) | weight, pin, draw | luck, fate, plot armour, seeded draws |
| **powers** | `kernel_working`, `item_bound_law` | **run**, **bind-item**, **require**, move, copy, create, suppress, resolve, route | absorb, copy, steal, negate, grant, shop, wish routing |
| **rules** | law fields, `area_field_law` | **alter**, **block**, open-slot, trigger, override | domains, wards, conceptual powers, Stand rules, dial overrides by place |
| **relations** | marks, `kernel_oath` | **bind**, **release**, **oath**, contract, link, name, debt | ownership, vows, contracts, true names, karma, bonds |
| **beings** | lifecycle (E12) | **create**, **end**, **copy**, **split**, **merge**, revive, possess, anchor, will | summons, clones, souls, systems, Stands, death states |

**Open slot.** `property:<name>` (already parsed by W) lets any world name a new property; the property table says which substrate owns it (default `body`). Sharpness, size, notice and distance cost are properties plus a rule field that reads them (XC1). This is the extensibility valve: new properties need no new substrate.

**Arguments for the shape, with the alternatives I rejected.**
- *Added `beings`.* XM1 found four abilities (system, soul split, seizure, auto-acting Stand) fit none of power, rule and timeline: they are holders with their own reactor. Summons, clones, revival and possession are the same kind of thing, and E12 already creates, ends, copies, splits and merges holders. It is the fourth meta-target as a substrate.
- *Merged ownership, bonds, souls-as-bonds, names, contracts and debt into `relations`.* They are all a row between two parties with a term (CHT4). One owner (`kernel_oath` plus marks) settles them.
- *Merged knowledge and perception into `mind`.* Belief vs truth, unreadable-by, memory and forecast all hang on "what a holder holds as known"; splitting them would give XG4 two owners.
- *Kept `powers` apart from `rules`.* A power row is movable data (XG1: move, copy, create); a rule is a scoped field override. Different verbs, different counters (steal vs suppress).
- *Rejected a `meta` or `narrative` substrate.* No holder, place or draw exists to read. It is a fallback tier instead.

**Fallback tier (narrative-only).** Any sentence that states `trigger + delivery + payload` on a substrate verb is expressible. Anything else keeps its text, shows it through Reports lines and changes no state. So no ability is unrepresentable, only unrun; the measuring script counts how much sits at each tier.

**Default / dial / reason.** Default: nine substrates, each verb list closed until a review adds one. Dial: a world may add a substrate by naming its owner file and verbs in its pack. Reason: a closed list is what makes "can we cover anything" countable (MF3).

## MF3 Completeness check and the number

Files: [mechanism_map.json](mechanism_map.json) (each canonical slug, each XA and each family to a substrate and verbs; `built` per substrate), [scripts/mechanism_coverage.mjs](../../../scripts/mechanism_coverage.mjs), [tests/mechanism_coverage.test.js](../../../tests/mechanism_coverage.test.js). Run `node scripts/mechanism_coverage.mjs`; `--json` for data.

Row tiers: **owned** (every verb the slug needs is built), **partial** (some), **designed** (mapped, none built), **reading** (label debt: effect or roles unknown, ingredient and formula fills, rank; excluded from the mechanism denominator), **unmapped** (slug missing from the map; the test fails if any canonical slug is).

Measured 2026-11-18 on this branch (28,955 blocked rows, 76 slugs):

| Measure | Value |
| --- | --- |
| Rows that name a mechanism | 22,922 (79.2% of blocked rows) |
| Label debt (reading) | 6,033 |
| Mapped to a substrate | **100%** of mechanism rows |
| **Owner built for every verb** | **53.8%** (12,340 rows) |
| Owner built for some verb (owned plus partial) | 56.7% |
| Mapped but no verb built (designed) | 43.3% (9,921 rows) |
| XA abilities: owned / partial / designed | 5 / 4 / 17 of 26 |
| Families (below): owned / partial / designed / narrative-only | 2 / 1 / 10 / 2 of 15 |

By substrate (rows, owned, partial, designed): powers 5,144 / 3,005 / 0 / 2,139; mind 5,011 / 1,153 / 564 / 3,294; rules 4,370 / 3,803 / 97 / 470; body 3,179 / 3,179 / 0 / 0; beings 2,395 / 902 / 0 / 1,493; space 1,482 / 45 / 0 / 1,437; chance 553 / 0 / 0 / 553; relations 505 / 253 / 0 / 252; time 283 / 0 / 0 / 283.

**Read the number carefully (three caveats).** (1) It is a **ceiling for what a built owner could take**, not rows that run: body is 100% owned and its rows are still blocked, because blocking comes from a missing law or entry point (PWC127), not a missing verb. The number measures verbs; PWC128 (landings in ordinary play) measures use. (2) The slug-to-substrate map is one reader's judgment from slug names and a few sampled rows; many slugs have no `distinct` description. A second reader should recheck the top ten by rows before the number is quoted as settled. (3) "Built" means the verb exists in the cited file; it was read, not executed.

**The real gap list = verbs with no owner, ranked by blocked rows it would unlock (ceiling, overlaps none because each slug has one substrate):**

| Rank | Missing verb | Rows | Substrate |
| --- | --- | --- | --- |
| 1 | compel | 2,191 | mind |
| 2 | resolve | 1,417 | powers |
| 3 | anchor | 1,232 | beings (soul state) |
| 4 | contain | 947 | space |
| 5 | alter-state | 890 | mind |
| 6 | forecast | 647 | mind |
| 7 | open-slot | 511 | rules |
| 8 | pin, draw | 402 each | chance |
| 9 | move (power rows) | 398 | powers |
| 10 | enter | 354 | space |

Then create (324), contract (237), rate and hold (210 each), and the rest of time. Unmapped slugs: none. Unmapped abilities: **FA14 fourth wall** and **FA15 save and reload awareness** (narrative-only for now; see MF8). The XA-note gap codes agree: XG2 is `resolve`, XG3 `anchor`, XG4 `forecast` and `believe`, XG1 `move/create` on powers, XG6 time and `pin`.

## MF4 Interaction resolution

- **MF4a Same-substrate conflicts go by stated reach (F7).** Two effects on one fact: the one whose `passes` lists the other's concept wins on that axis; an unshown reach is not assumed. Default `reachDefault: stopped`. Dial: per world `passes`. Reason: the XC matrix; one rule instead of a clash table per pair. Equal reach is a tie, settled by MF4b and flagged to the player as a ruling by the world, not a roll.
- **MF4b Ordering of simultaneous effects: settlement layers.** Default order: (1) rules (fields shape everything after), (2) time (holds and rates decide who acts), (3) space and delivery, (4) powers (suppress, resolve), (5) payloads on body, mind and beings, (6) relations (terms attach to what landed), (7) chance (draws weigh last, against the final state). Within a layer: higher stated reach, then earlier cause id, then holder id (the existing `composeSubstrate` order). Dial: per world may move a layer by a stated reason. Reason: "suppression before payload" and "laws before acts" are the two orderings the evidence needs; the rest is determinism.
- **MF4c Chain budget as a speed guard.** `interactionBudget` (default 64 landings per cause root per advance, XG12a), overflow recorded as `damped` with its chain, never a stall. Restore writes count one each, so a loop cannot hide cost. Precog forecasts (MF7) run under their own budget in a sandbox. Dial: per world and place. Not a balance rule (AD22).
- **MF4d Inspector record.** Each law that settles part of a landing appends `{law, rows, verdict, reason}` to `consulted`; `explainLanding(causeId)` returns the ordered list, the reach comparison and the budget used. Reason: a stack of extreme abilities is unreadable without it, and holders reconstruct hidden rules by evidence (F9).

## Time substrate shape (shared with the timeline lane, sent to the coordinator 2026-11-18)

- **Clock.** A law field `kind: 'clock'` on a holder or place scope, `params {rate, until}`, default rate 1, 0 = hold. The advance loop reads each holder's effective rate (own field times place field). Stop, haste, slow and skip are all this one field; a "stopped time" ability is `rate: 0` on everyone in scope except the caster, with reach stated.
- **Pin vs restore point (provisional, 2026-11-18; the timeline lane reports the shape it settles on).** The PSA29 store on master (`src/pin_store.js`) is an address-to-value store: `pinAddress(space, ...ids)`, a value of JSON data up to 2,000 characters, two layers read in one place (manifest pins of kind `canon` or `exception`, then saved `cheat` pins), each with a reason. It cannot hold a world-state capture, so this note does **not** start a second store and does not call a capture a pin. Split: (1) **fate and draw pins** (chance.pin, plot armour, fixed visions, carried values) are ordinary PSA29 pins at addresses such as `pinAddress('draw', holderId, eventId)`; a power-made pin needs a third layer `power` (kind `fate`, with `expires` and the source power's id, saved in the `pins` slice, read after manifest and before cheat or by dial); (2) a **restore point** is a record owned by the time substrate, `{id, at, scope: {holders | place | world}, props: {holderId: {prop: value}}, carried, owner, expires}`, whose address in the pin store is only an index entry, `pinAddress('time.restore', holderId, id)` with a small value `{at, digest}`, so loops, rewinds and fate edits share one address space and one read without bloating it. Restore reads values from the record and lands them as `property` ops through `landEffect` with `cause: restore`, so MF4c and MF4d see them. `carried` is the stated list that survives (F5); memory is carried by default for the holder.
- **Verbs.** hold, rate, snapshot, restore, skip (= hold others plus advance the caster), branch (a restore point restored into a second world copy; needs branching worlds, `timeline-split`). A loop is a restore point at the anchor plus restore at the trigger; rewind-area is restore with place scope; the fate pin (PSA29) is a separate small pin at a draw address.
- **Dials.** `loopRestores: [world, powers, rules]` default `world`; `pinExpiry`.
- **Cut time** (remove an interval from history): snapshot, replay without the interval, and the replay is observed by no one; costs a replay, so it is budgeted like a forecast (MF7).

## MF5 Missing mechanism families

The XA list skipped these. Each is a short entry: sentence, substrate and verbs, mechanism, default and dial, gaps. They are in the map as FA1-FA15.

- **FA1 Teleport and blink (space: move).** `move | thing | self | instant | concept`. Mechanism: a link of cost zero that exists for one step (a transient portal, `link_set` open then closed), so teleport is the portal verb with a duration of one tick; a barrier that blocks `link` stops it. Default: needs a known destination (a place the holder has seen); dial: blind jumps land by a draw. Gap: `portal`.
- **FA2 Pocket dimension and other planes (space: enter, contain).** A place with its own link table, entered through a link; `dimension-travel`, `inner-world`, `world-travel` and `spatial-storage` rows. Mechanism: a place not reachable by ordinary links; a world copy only when it needs its own clock (then it is time.branch). Gap: `enter`, `contain` (about 1,300 rows).
- **FA3 Summoning (beings: create).** Create a holder bound to the caster by a relation term (`leash`, loan). The summon has its own reactor and standing orders. Default: upkeep is a cost the caster pays; dial: free until dismissed. Meets XA25.
- **FA4 Duplication and clones (beings: copy, will).** `copy` a holder; the copy's `will` is `puppet` or `independent`, its memory is the original's at copy time, and *who is the original* is a bond question, not a flag (relations: link). Default: the copy is independent and noticeable; dial: shared senses (mind: sense through a link).
- **FA5 Resurrection and death states (beings: revive).** Death is a holder state (`alive`, `dead`, `undead`, `dormant`) read by rules. Revive = restore the holder from a pin or recreate it from an anchor (soul), with terms (cost, whose body, what is lost). `death-checkpoint-rewind` is a pin taken at a trigger. Default: revival is a payload with a stated cost; dial: per world, who may be revived.
- **FA6 Possession (beings: possess).** Move the control of a holder's acts to another holder, leaving the host's soul in place and contesting. Must be noticeable by the host (mind control rule, 2026-11-10). Meets XA23.
- **FA7 Size and scale (body: scale).** A property `size` and rule fields that read it: reach, carry, damage, the cost of being seen, what fits where (space contain). Default: the cube law as a dial `scaleLaw` (linear, square, cube). Scale is a property edit; nothing else changes unless a rule reads it.
- **FA8 Emotion and mind control (mind: alter-state, compel).** State is a typed property (`mood`, `focus`, `fear`) that choices read; compel is a rule on the target's acts (XA17), noticeable, defeatable by wholeness and by noticing. Gap: `compel` is the largest unbuilt verb (2,191 rows).
- **FA9 Karma and debt (relations: debt).** A debt row between parties with an amount, a currency (luck, years, favours, a body part) and a collection trigger. Repayment draws from the debtor's chance weights (conserved, CR4), so karma is lien plus luck, not a hidden stat. Dial: whether debts are visible to the debtor.
- **FA10 Sympathetic links and true names (relations: link, name).** A link is a row that lets an effect on A land on B (a reach that ignores distance, stated); a name is a key row: knowing it (mind: believe) is the condition for `touch` at any distance. Both are counterplay-friendly: break the link, hide the name (mind: conceal).
- **FA11 Contracts (relations: contract).** A row with parties, clauses as typed `{trigger, then}` rules (MF1), consequences for breach, enforced by `kernel_oath`. Vows are one-party contracts. Hidden clauses are flagged, not forbidden (XP6).
- **FA12 Plot armour (chance: pin).** A pin on the draw address "this holder survives this event", with a budget and a reach; the world pushes back through whoever notices the pattern. Dial: the pin is visible or hidden.
- **FA13 Author power (rules: override).** An override at world scope with reach "everything": a stated absolute, allowed with an in-world reason and cost (AD56), listed for Weibao and never defaulted. It edits dials and law fields, so it is a rule target, not a new substrate.
- **FA14 Fourth wall (narrative-only).** Acts on the player's screen or the app, not on a holder, place or draw. Default: stays narrative (shown, no state change). A character may *speak* to the player through the Reports surface; nothing reads the player's real world.
- **FA15 Save and reload awareness (narrative-only today).** In fiction a reload is a restore of the whole world with the player's memory carried, so a loop-aware power is time.snapshot plus a reactor on a `world.restored` event. What is missing is that event published to reactors; with it, FA15 becomes mind and time rows. Proposal in MF9. Reading the player's actual save file stays out (privacy and saves are Weibao's).

## MF6 Where powers meet (summary)

The extreme-abilities note's XC matrix and this note's MF4 are one mechanism: stated reach decides, layers order, budget bounds, inspector explains. Conceptual powers (distance, sharpness, ownership, notice) are `rules.alter` on a `property:<name>` plus a field that reads it; none needs a new substrate.

## MF7 Precognition in real time

What the engine has: simulation advances by jumping between scheduled boundaries (`nextSimulationBoundary` and its siblings in `expansion_engine.js`), draws are seeded, and `deriveSnapshot` exists for authored story windows. The cost figures below are **estimates, not measurements**; MF7-M proposes the measurement.

| Route | Exact for | Blind to | Cost | Verdict |
| --- | --- | --- | --- | --- |
| **A** Analytic forecast from the scheduled-event list | what is already scheduled (crop clocks, deadlines, arrivals) | draws, anyone's new choice | O(scheduled events); microseconds; no clone | default on, because it is free; the base layer |
| **B** Fork a snapshot, run ahead in a worker with a ms budget and coarse detail | draws (if seeds are kept), chains, other holders' routines | the player's future choices, whatever coarse detail drops | one state clone plus advance over the horizon; budget 20-50 ms per frame slice; coarse = far holders and ambient lines off | for powers that see consequences |
| **C** Sample seeds for a probability spread | "how likely is X by T" | same as B | k times B (default k 8, dial 3-32) | for powers that show odds, not one future |
| **D** Cache keyed by `(revision, horizon, query)` | repeat looks | state changes (stale on change) | a revision counter bumped by landEffect on touched holders; by default invalidate the queries that read them | wraps B and C, so a seer watching a quiet room pays once |
| **E** PSA29 pin at a draw address for fixed visions | a vision that must come true | n/a | one small pin (2,000-character value cap) | default for "fate" powers, dial per power |

**Recommendation (default).** Layer them: A always, B for a power with depth, C when the power reports odds, D around both, E only when the power says the future is fixed. Visions are **read-only forecasts by default**: the future is a branch the holder can change by acting (self-defeating), so the cost of seeing is the budget, not a paradox. Dial per power: `visionKind: forecast | fixed | partial`.

- **Self-defeating vs fixed.** Forecast: runs B from the current state; if the seer then acts, the cache invalidates and the next look differs. Fixed: the vision writes a pin at the address ("the draw at the gate returns the knife"), so the world makes it true, and the seer's attempts to avert it are inputs to the same draw, which is how fixed visions come true through the effort to stop them. Fixed visions use PSA29 pins at draw addresses and need the store to refuse a contradicting pin with its reason (XA11); the `power` layer in the time section is the proposed way to save them.
- **Real time.** Each look gets a budget; when it runs out the result is **partial**: the cheapest layers answered, the rest shown as narrative ("something stirs by the river"); the default is a partial answer, with no freeze. A coarse level of detail means the forecast simulates only holders within the power's reach and places the seer has sensed.
- **Precog vs precog recursion.** A forecast runs other seers as fixed stochastic sources (their last-known forecast as a draw), depth cap 1 (dial up to 3); mutual forecasts share one interaction budget so two seers staring at each other settle at the cap and report `damped`. Unreadable-by (mind: conceal on the `forecast` verb) is a stated reach: a being the forecast cannot read returns "blank" at that position, which is also a tell.
- **Cost to the seer.** Time, attention or a cost row (sentence `cost`), by the power's terms; the engine's budget is a speed guard (AD22), the in-fiction cost is the holder's.
- **MF7-M Measure first.** Before building B: serialize a fresh-life state, time `structuredClone` and a one-season advance on the 8 GB target, and report ms. If a clone plus a day's advance exceeds the budget (the reason), C and B run on a coarse copy by default that holds only the reach's holders. Proposed done check: a forecast of 7 days under 50 ms on a fresh life, or a stated coarse level that does.

## MF8 What this does not cover

- Unmapped: FA14 (fourth wall), FA15 until `world.restored` exists. Stay narrative-only by rule, not neglect.
- Verbs with no owner (MF3 table) are the real gap; a verb owner lands only when an entry point calls it (PWC127, PWC131), so build order follows the table and the entry points, not row count alone.
- Not measured: blocked rows that would run after a verb exists (needs a dry-run at the PSA28 bar), and the cost of MF7 routes.

## MF9 Proposed diffs (not applied; other lanes own these files)

1. **`src/effect_grammar.js`.** Add optional parts to the sentence shape and to `checkEffect`: `trigger` (`{on, by, then}` with `on` in the world's trigger kinds), `reach`, `passes`, `scope`, `until`. Open `object` to `property:<name>` when the world's property table lists it (XP4). Add `move`, `add`, `remove` to `VERB_ACCEPTS.working` (XP1).
2. **`src/world_effects.js`.** Add `W_OBJECT_OF.working` as `power:<id>` once the power registry owner exists; add the `clock` law kind and `snapshot` and `restore` acts (time lane); accept `law_add` with a `trigger` param and place-scoped dial overrides (`law_add` kind `dial`, scope place, `until`).
3. **`src/effect_host.js`.** Make `landEffect` return `consulted: [{law, rows, verdict, reason}]` and `budgetUsed`; apply `interactionBudget` per cause root; publish `world.restored` after a restore; settle a clash by MF4a then MF4b order.
4. **New owners** (each its own lane, one writer): `power_transfer_law` (powers move, copy, create), `power_resolve_law` (powers resolve, stated reach), `soul` holder kind (beings anchor), `compel` rule (mind), `world_time` (time).

AD32 wording for each: *default* as stated in the section, *dial* as stated, *reason* as stated; none is an accepted decision until Weibao says so. Proposals that remove an option are none: every default above is an adjustable working default except the closed substrate list (MF2), which is the one limit and goes to Weibao first (AD56).

## MF10 Open for a second reader

- The slug-to-substrate map (MF3) is one reader's; recheck the ten largest slugs by rows (effect-unknown excluded, it is label debt).
- Layer order (MF4b) is a reasoned default with no playtest.
- The cost figures in MF7 are estimates.
- XA tags come from the extreme-abilities note, unchanged except for the substrate column.
