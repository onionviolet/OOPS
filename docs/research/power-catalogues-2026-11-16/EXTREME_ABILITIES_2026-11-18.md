# Extreme abilities against the effect engine (2026-11-18, proposals)

Register status: Proposal (AD32, AD56). Paper lane: no runtime code was written or run, so every "lowers to" line is a reading of `src/effect_grammar.js`, `src/world_effects.js`, `src/effect_host.js` and `src/world_substrate.js` as they stand on this branch, agent-read once, not human-reviewed and not executed. A claim that an op "exists" cites the file; a claim that something "cannot land" comes from the same files and should be re-checked by a second reader before a build slice leans on it.

Weibao asked for three options together: O2 the paper stress test, O3 the insane abilities, O4 the idea that weird abilities are effects whose target is the engine itself. His standing direction frames all of it: no forced weakness (the world pushes back through people), cheats are back in consideration (CHT1-CHT20, `docs/CHEAT_RULES.md`), everything can become OP (CHT13), things work by how they work (AD38), mechanisms not allowed-outcome lists. LOTM canon is open in development; sealed truths go by ID only.

Inputs read: [CHEAT_RULES](../../CHEAT_RULES.md), [VISION_DIGEST](../../VISION_DIGEST.md), the Wish Upon the Stars note in [LIFE_SIM_NORTH_STAR](../../LIFE_SIM_NORTH_STAR.md#novel-wave-findings-2026-10-09), rounds 13 and 14 of the [palette README](README.md), the core axioms CR1-CR7 (PWC84), the community findings F1-F10 on branch `claude/discourse-cheats-718ca5` (cited below as F-numbers, tier `community`), and the four effect files above. The pin store (PSA29) is unbuilt; where this note uses it, it is a proposal.

## How to read an entry

The existing effect sentence has seven slots (`defineEffectGrammar`): **verb | object | target | time | carrier | cost | limits**. Verbs are the twelve in `EFFECT_VERBS` (move, add, remove, transform, bind, release, sense, conceal, copy, block, end, alter); objects are the fixed list in `EFFECT_OBJECTS`. An entry gives the sentence, then how it lowers: W ops (`add`, `remove`, `move`, `property`, `law_add`, `law_params`, `law_remove`, `publish`, `lifecycle`) and the K law that settles it (existing laws such as `kernel_oath`, `area_field_law`, `item_bound_law`, `form_transformation_law`, or a proposed one marked **new**). `landEffect` then applies it. "Meets" names two other abilities it interacts with. "Gaps" points at the XG codes in the ranked list. Targets in a sentence use the seven grammar targets; the W target shapes (`having`, `within`, `present`, `place`, `marked`) arrive through `details.target`.

Meta-target tag (O4): **P** power row is the target, **R** a rule (law field, dial) is the target, **T** the timeline is the target, **O** none of the three (a holder, a created agent or a soul).

Mechanism rule used throughout (AD38): an ability is described by what happens inside the world that makes the outcome occur, so that a cheaper or odder route to the same outcome works by the same mechanism, and a counter can target the mechanism.

---

## Part 1: the abilities

### Take, copy, stop and steal a power

#### XA1 Absorb a power (P)
- **Sentence:** `move | working | touched | lasting | body | essence | limits: [capacity, intake-kind]`
- **Lowers to:** no W act (`working` is null in `W_OBJECT_OF`); publishes `effect.move.working` for owner K. Intended settlement: a **new** `power_transfer_law` that moves a power row from the source holder's kit to the absorber's kit with CHT4 terms (`source: digested`), plus a `remove` of the intake resource.
- **Mechanism:** the absorber has an intake organ (a mouth, a hand, a ritual) that breaks a target power into a stored kit entry. What matters is the intake loop (F4): the ability is as good as who it can reach and how much kit it holds. The source loses the power just if the intake is a *move*; a *copy* intake leaves it.
- **Variants:** (a) *digest*: the power must be killed or drained first, the kit entry is permanent but lossy, cost is time and body; (b) *tithe*: the power is taken a use at a time from a living source, who feels it as tiredness and notices by means (a person, AD6), no resource cost to the absorber; (c) *echo*: the kit entry decays unless the absorber keeps meeting the source, so absorbing is a relationship.
- **Meets:** XA3 (a negated source has nothing to take, or the negation comes with it); XA22 (a soul-backed power travels with the soul, CHT5, so the intake must take the soul, not just the body).
- **Gaps:** XG1, XG2.

#### XA2 Copy a power (P)
- **Sentence:** `copy | working | touched | lasting | body | attention | limits: [seen-used, one-slot]`
- **Lowers to:** `copy` accepts `working` in `VERB_ACCEPTS` but lowers to a publish just (no W act). The existing W copy (`copy|property`, with `from`) is for holder properties, not rows. Settled by the **new** power-transfer law with `terms: loan` or `copy`.
- **Mechanism:** the copier has to have *witnessed the working run* (a K working record is the evidence, `kernel_working.js` receipts). The copy is built from the observed steps, so it inherits just the steps seen. That makes a half-seen power a broken copy, which is a mechanism and not a nerf.
- **Variants:** (a) *one slot*: just one copied power at a time, overwritten by the next; (b) *shadow*: the copy just runs while the original holder is within reach (a leash term); (c) *understood*: the copier also learns the reasons, so the copy can be taught on (a knowledge row, N owner).
- **Meets:** XA4 (steal vs copy: a stolen power is gone from the source, a copy is not); XA26 (a copied condition may come without its condition, so the copy misfires: the holder is wrong about its own power, F9).
- **Gaps:** XG1, XG4 (what the copier believes it has).

#### XA3 Negate a power (P, with R)
- **Sentence:** `block | working | touched | sustained | concept | essence | limits: [scope: powers-using-verb-X]`
- **Lowers to:** `block` accepts `working`; `lowerEffect` sets `stops = 'remove'` for kind `working`, which is the wrong stop (a power is not a quantity). The W `block` writes a `law_add` field with `params {verb, object}`; for a power the field must read the power row's id. So it lands as a publish today.
- **Mechanism:** negation is a *field laid over the target* that makes one verb on one object fail while it holds. It does not remove the power; the power row is intact and returns when the field ends. This is why the counter is simple: end the field (`end`, `alter`).
- **Variants:** (a) *suppress the holder*: every power the holder owns stops; (b) *suppress the working*: just workings started after contact are cancelled (needs XG7: delivery vs payload); (c) *suppress the channel*: the power works but its carrier (a voice, a gesture, an item) is blocked, so it is a partial counter (F3).
- **Meets:** XA18 (a sure-hit domain overrides a suppression just by the domain's stated reach, F7); XA7 (a loop restores the field's end time, so a negation can be rewound out of existence).
- **Gaps:** XG2, XG7.

#### XA4 Steal a power (P)
- **Sentence:** `move | working | touched | lasting | item | essence | limits: [source-aware, terms]`
- **Lowers to:** same as XA1, with `terms` as the lever: gift, loan, lien, leash, burdened loan (CHT4). A theft is a *lien taken without consent*: the row moves and carries a lien the old holder can name.
- **Mechanism:** the thief takes the **backing** (CHT5): an item, a name, a debt, a soul thread. A power backed by an item moves with the item; a soul-backed one cannot be moved without XA23. So stealing is first learning what backs the power (F9: the holder may not know).
- **Variants:** (a) *deed-theft*: the power is moved by taking the thing that proves ownership (XA14 sets the rule that a deed counts); (b) *claim-theft*: just the use is moved; the old holder is still the owner, so the new user pays a due; (c) *clean-theft*: the row moves and the old holder forgets having it (a memory edit through XA6/XA22), which is a second ability and shows in the receipt.
- **Meets:** XA14 (ownership rules decide what "theft" means in a world); XA16 (a vow on the old holder follows the power, or stays with the person, per the vow's term).
- **Gaps:** XG1, XG2.

### Wishes

#### XA5 Wish Upon the Stars (P, R or T, whichever the wish names)
- **Sentence:** a wish is a *router*: it names a target sentence and pays for it. `alter | working | self | triggered | wish | donor-payment | limits: [feasible, charge-today, valid-payment]`
- **Lowers to:** three separate checks (the Wish Upon the Stars note): **(1) feasible**, the wished sentence must be a legal assembly (`checkEffect` and `assembleEffect`, the five checks); **(2) charge left today**, a quantity with a daily refresh (a W quantity plus a K deadline, `kernel_working.js` `workingDeadlines`); **(3) payment valid**, a `cost` row paid by `details.payer` (a donor): `sentenceCosts` already publishes `{kind, amount, payer}`. Settlement order is feasible, charge, payment, so a refused wish costs nothing. The wished sentence then lands through `landEffect` as any other.
- **Mechanism:** the "wish engine" is a market of equivalences: the world prices a change as a bundle of costs (a skill, a memory, a body part, a stat) and takes them from a donor, who may be the wisher. The pricing is the existing scope tiers (`scopeOf`) so a bigger wish costs more by one curve (CR1).
- **Variants:** (a) *self-payment*: the wisher pays; cheap wishes are possible but the wisher loses what they paid; (b) *donor-payment*: a consenting donor pays, so wishes become a social act, and the donor's consent is a visible fact (F1 spirit: costs are visible); (c) *debt wish*: the wish is granted now and a lien is attached to the wisher (a loan term), so the world pushes back through the creditor, not through a rule.
- **Meets:** XA6 (repeated tweaks stabilize into a technique); XA1 (an absorbed skill can be used as payment, which turns every absorb into a currency).
- **Gaps:** XG1 (a donor's skill is a power row that must move), XG4 (the wisher's belief about feasibility can be wrong), XG12.

#### XA6 Wish stabilization: a tweak becomes a technique (P)
- **Sentence:** `add | working | self | lasting | wish | attention | limits: [same-tweak-repeated]`
- **Lowers to:** counts landings of the same sentence shape per holder (the provenance ledger keeps sources per quantity, `ledgerCap: 24`), and past a threshold **creates a power row** (`lifecycle create` with `kind: 'working'`; E12 creates holders, not rows, so a row-creating op is **new**).
- **Mechanism:** the world notices that this holder keeps asking for the same change and stops charging it as a wish: the pattern becomes a cheap standing practice. This is how a custom technique arises without anyone designing it (PSA-style "generated, not typed").
- **Variants:** (a) *threshold by count* (default 5); (b) *threshold by novelty*: only wishes that differed in cost each time (the tweaks are the point); (c) *stabilized by a witness*: a teacher or rival who saw it names it, so the technique has a name and spreads (knowledge row, N).
- **Meets:** XA2 (a copy of a stabilized technique is cheaper than the wish); XA21 (a system may offer to "register" the technique for points).
- **Gaps:** XG1 (a row-creating op).

### Time

#### XA7 Time loop (T)
- **Sentence:** `alter | time | self | lasting | concept | lifespan | limits: [carried-state, others-recall]`
- **Lowers to:** `time` maps to `law:*` in `W_OBJECT_OF`, so it can just `alter` a law field; there is no snapshot restore op. The existing `deriveSnapshot(world, at, {branch})` in `src/anchor_snapshots.js` derives a world at a time from base events and a branch; read once, I believe it serves authored story windows, not a live W holder world, which is unverified. A loop needs: a **pin** of the world state at the anchor (PSA29), a **restore** op, and a **carried set** (properties and memories that survive the restore).
- **Mechanism (F5):** the loop *declares what carries*: the protagonist's memory, a named list of properties, and optionally others' recall. Everything else is restored from the pin. Harm persistence is a stated property of the loop (a restored wound is erased in the world but not in the person who remembers it).
- **Variants:** (a) *clean loop*: just the holder's memory carries, the rest is the world's replay; (b) *loop with dependents*: a named person also carries (their recall is a carried property); (c) *drift loop*: the restore is from the nearest pin, not the same one, so the world differs a little each time (variance just fills what the source leaves open, from the variance direction).
- **Meets:** XA8 and XA9 (nested time edits need a rule for which pin wins); XA3 (a suppression's end time is pinned state, so it is restored with the world, which is why a negation can be looped out).
- **Gaps:** XG6, XG12.

#### XA8 Rewind a thing or an area (T)
- **Sentence:** `transform | form | area | instant | body | essence | limits: [to-pin, own-pin-only]`
- **Lowers to:** `transform` on `form` is an existing W act (`property:form`); a rewind sets properties back to a stored value (`property` op with `value` from a pin). Today the grammar has no "to a stored value" source: `transform` takes `properties` in `details`, so a caller may pass them, but nothing stores the prior values.
- **Mechanism:** a local restore, not the loop: the caster pins a holder (or a place) before the change and restores that holder's *properties* from the pin. It does not touch other holders, so the world's other facts stay (a thing returned to unbroken does not undo the noise it made).
- **Variants:** (a) *auto pin*: the caster has a short rolling pin of whatever they touched (cost: attention); (b) *rewind by receipt*: the restore is built from the provenance ledger by reversing the named effects (an undo, not a replay); (c) *rewind the person*: restores vitality and form but not memory or lifespan (a carried set again).
- **Meets:** XA10 (a rewound draw can be re-drawn with luck shifted); XA19 (a rewound area leaves the domain's field alone unless the pin included it).
- **Gaps:** XG6 (the pin store), XG12.

#### XA9 Time skip (T)
- **Sentence:** `end | working | area | triggered | concept | lifespan | limits: [erased-interval, observers-lose-it]`
- **Lowers to:** `alter` a `law:*` field that suppresses the clock for the area's holders during the interval, and lets the caster alone act. There is no "run the world for N minutes with some holders frozen" op; the substrate's `advance` is global (`segmentBudget`), so a skip needs a per-holder clock field (a law field kind `clock.hold` read by the advance loop, **new**).
- **Mechanism:** nothing is erased; the others are *held* while the caster acts. That is why their memory has a gap and the caster's does not, and why the interval is *real time spent* by the caster (their food, wounds and aging advance).
- **Variants:** (a) *held others*: the area's holders do not act; (b) *erased interval*: the interval is cut from history (a pin plus replay without it), which makes it a loop variant; (c) *speed*: the caster's clock runs faster than theirs, so it is a sustained effect, not a stop.
- **Meets:** XA3 (a suppressed power cannot reach a skipped interval); XA24 (a Stand rule "no one remembers what I did" is a skip by another mechanism).
- **Gaps:** XG6, XG11 (the clock field is a rule edit by place), XG12.

### Fate and luck

#### XA10 Luck edit (R)
- **Sentence:** `add | luck | touched | lasting | concept | attention | limits: [named-draws, net-conserved]`
- **Lowers to:** `luck` is a quantity in `EFFECT_OBJECTS` but `W_OBJECT_OF.luck` is null and `OBJECT_OWNER.luck = 'P'`: the engine waits for the generator contract to shift the weights of named draws (PC82). So it lands as a publish just.
- **Mechanism:** luck is not a stat; it is a **weight on draws** the holder takes part in. A luck edit changes the weights of named draws (a tool breaking, a meeting, a fall) with the sum conserved (CR4), so luck given to one is luck taken from the draws of another.
- **Variants:** (a) *personal*: the holder's own draws; (b) *local*: draws in a place (a law-field scope); (c) *scheduled*: a luck debt that repays later, so luck is borrowed against the same holder (a lien).
- **Meets:** XA11 (a pinned fate overrides a weight); XA15 (being noticed is a draw: luck shifts who notices).
- **Gaps:** XG5.

#### XA11 Fate edit (R and pin)
- **Sentence:** `bind | relation | touched | delayed | concept | memory | limits: [one-outcome, named-address]`
- **Lowers to:** `bind` sets a mark (`property:marks`); a fate edit needs a **pinned outcome at an address** (the pin store, PSA29): "the next draw at address A returns value V". The pin store gives pinned canon values and named exceptions; a pinned future draw is a new use of it.
- **Mechanism:** fate is a **pre-written result for one named draw**. The caster does not make it happen; they write what the draw will return. Interference is possible because the pin is a row someone can find and rewrite (XA3 on the pin, or a counter-pin).
- **Variants:** (a) *pin a result*: one draw; (b) *pin a thread*: a chain of draws that must stay consistent (CHT: no contradictions, so a later pin that conflicts is refused with its reason); (c) *read-only fate*: the caster can read the pin but not write it (divination, XG4).
- **Meets:** XA10 (a pin ignores the weights); XA7 (a loop restores the pin along with the world unless it was in the carried set).
- **Gaps:** XG5, XG6 (pin store), XG4.

### Conceptual powers

The four below are the cases the coexistence section (Part 2) puts in one world. Each is a **rule target**: it edits a law field scoped to a place or a holder, with a stated reach (F7).

#### XA12 Power over "distance" (R)
- **Sentence:** `alter | law | area | sustained | concept | essence | limits: [reach: positions, not forms]`
- **Lowers to:** `law:*` accepts `alter`; the W `alter` adds a law field on the target scope with `kind` and `params`, or edits a field's params (`law_params`). The distance concept is a field `kind: 'distance'` read by `resolveReach` (`world_effects.js`, `within` target) so that a place's link costs can be shrunk, stretched or looped.
- **Mechanism:** distance is not teleportation; it edits the **cost of the links** in the place graph (`link_set`, E10). A folded path is a cheaper link; a stretched one a dearer link. Something with no link cost to change (a thing inside the caster's own body) is outside it, which is the stated reach.
- **Variants:** (a) *fold*: links cheap, travel and reach shortened (a melee reach becomes a ranged one); (b) *stretch*: links dear, so pursuit and sure-hit slow (counters XA18 by making "within" fail); (c) *loop*: a link returns to its own place, a trap.
- **Meets:** XA18 (a sure-hit field needs "within" to hold, so distance can defeat it only if the domain's stated reach does not include the distance rule); XA15 (noticing needs reach).
- **Gaps:** XG8 (the object slot has no `distance`; it works just through a `law` field), XG11.

#### XA13 Power over "sharpness" (R)
- **Sentence:** `alter | law | touched | sustained | concept | essence | limits: [reach: edges and cuts]`
- **Lowers to:** a field `kind: 'sharpness'` read by the damage law (`remove vitality` and `transform form` consult it). It is the first conceptual power whose property is a **number a thing already has**: sharpness is a property on blades, teeth and glass. W has `property:<name>` objects (`parseObject`), but the grammar's `object` slot lists just the fixed set, so a sentence cannot name `property:sharpness` today.
- **Mechanism:** the caster edits the property *and* the rule that reads it, so a thin edge cuts what a thick one cannot. Because other powers also read sharpness (a cut, a pierce), this one is shared by everyone in the world and that is why it needs a stated reach.
- **Variants:** (a) *edge giving*: raise sharpness on a thing (a bound thing, `item_bound_law`); (b) *edge taking*: lower it, so blades dull and glass will not cut (a counter to a sharp-based attack); (c) *edge as concept*: cuts what has no edge (a conceptual cut, which by F7 works only on what its stated reach lists, default: not bypassed).
- **Meets:** XA3 (negation by sharpness: "cannot cut" as suppression); XA14 (an edge can cut a claim, but only if ownership is a thing with an edge, which is a stated reach).
- **Gaps:** XG8.

#### XA14 Power over "ownership" (R)
- **Sentence:** `alter | relation | marked | lasting | concept | attention | limits: [reach: possession, not use]`
- **Lowers to:** `relation` lowers to `property:marks` (`bind`, `release`). Ownership becomes a **mark with a rule**: whoever holds the mark may use, move or give the thing, and holders of other marks may not without a bind-break. A world rule field `kind: 'ownership'` reads it in `move`/`transform` acts.
- **Mechanism:** the power does not take; it **changes who the rule says the owner is**. A sword in a thief's hand is still the old owner's by the field, so the thief can swing it but not give it away or lose it.
- **Variants:** (a) *deed*: owner is whoever holds a thing (a paper), a social ownership; (b) *claim*: owner is whoever has the strongest claim (a social fact, rank and kin, a relation count); (c) *blood*: ownership follows kin (a lineage row, a property that cannot be moved by `move`).
- **Meets:** XA4 (theft depends on which ownership rule is live); XA16 (a vow is a promise of ownership of a future act).
- **Gaps:** XG8, XG11.

#### XA15 Power over "being noticed" (R)
- **Sentence:** `conceal | information | area | sustained | concept | attention | limits: [reach: noticing, not presence]`
- **Lowers to:** `conceal` and `sense` run on W channels for any object (`concealedFrom`, `channel`). "Noticed" is a **channel**: conceal on channel `notice` hides the holder from sense acts on that channel. `info` objects publish for owner N.
- **Mechanism:** the holder is not invisible; they are **not selected by attention**. A sense act on channel `notice` returns nothing for them, but a hand that bumps into them lands normally. That also explains the failure: anything that does not need noticing (a spray, a sure-hit area) still hits.
- **Variants:** (a) *forgettable*: the concealment applies after the fact (a memory conceal, N); (b) *shown to few*: just named holders can notice (a whitelist, a social power); (c) *flood*: all attention in the area is drawn to the holder (a sense bait), a counter-use that makes the holder the target.
- **Meets:** XA18 (a domain that hits "everyone in reach" ignores noticing); XA25 (an auto-acting Stand not noticed still acts).
- **Gaps:** XG4 (what others believe), XG8.

### Binding vows

#### XA16 Binding vow with a visible cost (P)
- **Sentence:** `bind | working | self | lasting | vow | lifespan | limits: [stated-gain, stated-break-effect]`
- **Lowers to:** `kernel_oath.js` (KW36-KW39) is the K owner: a sworn term, a break consequence, a duty found at its deadline. The grammar's `limits` slot is an open text set, not a typed condition; the vow's **gain** (what the ability gets) and **break effect** are not in the sentence. A vow lowers to a `bind` of a mark plus a K oath row; the oath row carries the term.
- **Mechanism (F1):** the vow makes a power stronger *because* the cost is stated and visible: the holder gives up a condition, the world records it as a term on the power row (a `leash` term, CHT4), and breaking it triggers a typed consequence. The proportionality check is a comparison of the stated gain to the stated cost.
- **Variants:** (a) *self vow*: the holder binds their own power; (b) *mutual vow*: two holders bind each other, so the break effect falls on whichever breaks; (c) *hidden-term vow*: the term is not shown (a trap), which breaks F1's proportionality, so a world with a hidden-term vow gets it by a flagged default, not as normal.
- **Meets:** XA4 (a stolen power's vow follows or stays by its term); XA17 (a vow on another person is a rule target).
- **Gaps:** XG9.

#### XA17 Geas on another person (R)
- **Sentence:** `bind | relation | bound | lasting | vow | memory | limits: [consent-or-defeat, noticeable]`
- **Lowers to:** a law field scoped to the other person (`law_add`, `scope: <holder>`) that forbids a named verb on a named object (a `block` field), or demands one (a `kernel_oath` duty). Mind control must be noticeable (limiting-line answer, 2026-11-10), so the field has a `noticed: true` property the person can read.
- **Mechanism:** the geas is not a will override; it is a **rule on the target's acts**, which the target can see in themselves. The person who is bound still decides; the world refuses the forbidden acts.
- **Variants:** (a) *by consent* (a contract); (b) *by defeat* (a bound loser); (c) *by trick* (the consent was obtained by a false statement; the field holds but the person learns of the trick by a means, and a witness can void it).
- **Meets:** XA16 (a vow is a self-binding geas); XA20 (a system may issue geases as quest terms).
- **Gaps:** XG9, XG11.

### Domains and sure-hit fields

#### XA18 Domain: a sure-hit field (R)
- **Sentence:** `alter | law | area | sustained | concept | essence | limits: [reach: delivery, payload]`
- **Lowers to:** `area_field_law.js` is the existing K owner of area fields. A domain adds a field `kind: 'sure-hit'` in the place scope, read by the contact path (`contactDetails` in `effect_host.js`, which today runs barriers and reflection). The field turns "no clear path" into "path granted" for the domain's effects, and turns the target's barriers into stated resistances.
- **Mechanism (F3):** a domain splits **delivery** (it by design arrives) from **payload** (what it does). A counter can stop the delivery (a barrier that out-reaches it) or the payload (a protection), and may stop just one.
- **Variants:** (a) *complete domain*: delivery and payload both fixed; (b) *incomplete domain*: delivery holds but payload can be negated (the usual canon gap); (c) *open domain*: no walls, wide and thin, so more reach and less payload.
- **Meets:** XA19 (clash of domains); XA12 (distance edits "within", which the domain reads).
- **Gaps:** XG7 (the sentence has one verb, not delivery plus payload), XG2.

#### XA19 Domain clash and barrier (R vs R)
- **Sentence:** `block | working | area | sustained | concept | essence | limits: [reach: delivery]`
- **Lowers to:** a barrier field in the same place as XA18. `spellContactBarrier` (called from `contactDetails`) finds a barrier on the target that stops a `verb|object`; a domain needs a *rule for two fields claiming one place*. Settlement order is fixed (pack order, then law order, then holder id, `composeSubstrate`), so a tie is deterministic but arbitrary.
- **Mechanism:** each field states its reach. The one whose stated reach includes the other's concept wins on that axis; an unshown reach is not assumed (F7). If neither lists the other, both stand and the overlap goes to the later settlement by a stated rule (default: the field whose caster is closer to the center).
- **Variants:** (a) *dominant*: a stated reach over the other's concept wins outright; (b) *coexist*: both hold and each protects its own; (c) *collapse*: both are damped (a cost to both, a loser by a margin).
- **Meets:** XA18 (the basic clash); XA24 (a Stand's rule is a domain with one condition).
- **Gaps:** XG2, XG7, XG11.

### Systems and cheat interfaces

#### XA20 System interface with quests and an agenda (O, grants P)
- **Sentence:** `add | working | self | triggered | system | attention | limits: [quest-gated, agenda]`
- **Lowers to:** a **holder** (`kind: 'thing'`, E12 create) with properties `reliability` and `agenda` hidden from the player (CHT20), a reactor that publishes quests and grants power rows by the same op as XA21. The `voice` is a surface, not an engine thing.
- **Mechanism:** the system is a *person-like holder with its own aims*. What it offers is shaped by those aims, so a system serving a hidden goal rewards what it wants. The player's reading is by evidence, not a window (CHT2 keeps the base cheat quiet).
- **Variants:** (a) *honest*: reliability high, agenda shown; (b) *booster*: rewards fast growth, agenda to be fed; (c) *captured*: the system is run by another party, so its offers are a leash.
- **Meets:** XA21 (the shop); XA26 (the system holds the player's power conditions).
- **Gaps:** XG10.

#### XA21 Cheat shop: spend points for a power row (P)
- **Sentence:** `add | working | self | instant | system | essence | limits: [price-listed, one-per-day]`
- **Lowers to:** `add` does not accept `working` (`VERB_ACCEPTS.add = quantity, thing, knowledge`), so a purchase cannot add a power row. The **new** power-transfer law with `source: gift` or `purchase` fills it.
- **Mechanism:** a priced exchange: points are a W quantity, a power row has a price by the same scope curve as a wish (CR1), and the row arrives with terms. Because "everything can become OP", the shop has no cap by rule; its limit is what points the world lets the holder earn.
- **Variants:** (a) *fixed catalogue*; (b) *generated offers* (the shop's stock follows the holder's history); (c) *loan shop*: rows arrive as loans with a lien (XA5's debt wish).
- **Meets:** XA5 (the wish and the shop share a price curve); XA20 (the shop is a system's face).
- **Gaps:** XG1.

### Soul states

#### XA22 Soul split and anchor (O)
- **Sentence:** `transform | soul | self | lasting | soul | lifespan | limits: [one-anchor, noticeable]`
- **Lowers to:** `soul` is a `thing` in `EFFECT_OBJECTS` but `W_OBJECT_OF.soul` is null and `OBJECT_OWNER.soul = 'L'`: no W act and no owner behavior is wired; it publishes `effect.transform.soul` and waits. A soul would be a holder (`lifecycle split` exists in W, E12) whose parts can be moved, hidden, bound and returned.
- **Mechanism:** a soul is **a holder with properties** (a wholeness level, a bond, a location), not a number. A split makes a child holder bound to an object (an anchor); the whole is reduced by the split and the anchor can restore it when merged back (`merge`).
- **Variants:** (a) *horcrux style*: the anchor keeps the person from ending, but wholeness is lowered by each split; (b) *backup*: a copy of the soul rests in an item (`copy`), the original is intact; (c) *tethered*: the soul is lent out and the holder is weaker at a distance (a distance rule, XA12).
- **Meets:** XA23 (seizure acts on soul parts); XA1 (an absorbed soul-backed power needs XA22's part moved).
- **Gaps:** XG3.

#### XA23 Soul seizure and possession (O)
- **Sentence:** `move | soul | touched | sustained | soul | essence | limits: [overpower, noticed-by-host]`
- **Lowers to:** `move` accepts `thing`, so `move|soul` is legal in the grammar; no W act exists for soul (above). A holder-to-holder move of a soul holder, with the body holder's `mind` left to its own owner (`OBJECT_OWNER.mind = 'A'`, also unwired).
- **Mechanism:** a possessor holds the target's soul part and acts through the body, so the **host's soul is the contested resource**: the host fights the possession by its own wholeness and by noticing (mind control must be noticeable).
- **Variants:** (a) *temporary lease*: terms say when it returns; (b) *shared*: both souls act, the body is a committee; (c) *evicted*: the host's soul is moved to an anchor and the body is empty until it returns.
- **Meets:** XA22 (an anchor is an eviction target); XA17 (possession is the strong form of geas, and shows).
- **Gaps:** XG3, XG13.

### JoJo-style Stands

#### XA24 Rule-imposing Stand (R)
- **Sentence:** `alter | law | bound | sustained | stand | attention | limits: [condition: touched-by-rule]`
- **Lowers to:** a law field with a **trigger predicate**: "whoever X, then Y". The field's `kind` is `rule`, `params` hold the predicate. W fields carry `kind`, `params`, `scope` and `until` (`law_add`), and a reactor reads the predicate, but there is no predicate language: it is hand-written per reactor.
- **Mechanism:** the Stand is a **rule that attaches to anyone who matches its condition**; the effect follows from the rule, and what the Stand "is" is the rule plus the one agent who maintains it. The fan finding (F7) says a rule-imposing Stand "just works": it resolves by its demonstrated action, not by a diagram, so the grammar should store *the demonstrated rule*, not a power level.
- **Counterplay is the condition (jojo-readers lane, wiki tier, Luna-read, unchecked):** of 172 Stands, 35 are conditional triggers and 17 rule-imposing, and a Stand ability is usually one rule per Stand ("when X touches, looks at or says Y, then Z"). The condition is the counterplay: a person who learns it avoids, spoofs or satisfies it on purpose. So the trigger must be a **typed primitive** `{on: touch|sight|speech|name|presence|time, by: who, then: sentence}` stored on the field, visible to the inspector and answerable by a counter, not a hand-written reactor (XG11).
- **Variants:** (a) *touch rule*: the condition is contact; (b) *name rule*: the condition is a name said or known (a knowledge row); (c) *absolute rule*: the condition is existence in the area, and the Stand needs the area to hold (a domain).
- **Stand stats (same lane):** six letters A-E plus Infinite or Null (Power, Speed, Range, Durability, Precision, Potential); Range letters map to metres, and Potential falls as the user masters the Stand. Default: stats are a world's display dial over the stated reach and the existing scope tiers, not new engine state; Potential is a growth term (CHT11). Hamon and Spin are not this entry: they are resource-gated body techniques (breath and blood flow; rotation fed by an object), which lower to ordinary `add`/`transform` acts with a W quantity as the gate.
- **Meets:** XA18 (rule vs domain); XA9 (a time-skip Stand is this with "the interval").
- **Gaps:** XG11, XG13.

#### XA25 Auto-acting Stand (O)
- **Sentence:** `add | thing | self | sustained | stand | attention | limits: [independent-will, range]`
- **Lowers to:** a **created holder** (`lifecycle create`, E12) with its own reactor that acts when a condition holds (`time: triggered`). The independence question (inter.c4): does it act on a will of its own or as a puppet of the holder? The grammar has no flag for that, so it is a property `will: independent | puppet`.
- **Mechanism:** the Stand is an **agent the holder cannot fully steer**. It acts by its own standing orders, so the holder is in a relationship with it. The cost is not a stat; it is that it may do the wrong thing.
- **Variants:** (a) *puppet*: acts only when the holder acts; (b) *autonomous*: acts without the holder, even asleep; (c) *drifting*: its standing orders follow its own history, so it changes with use.
- **Meets:** XA15 (an unnoticed Stand still acts); XA26 (a Stand with a condition may fail to act).
- **Gaps:** XG13.

#### XA26 Stand with a condition, and a holder who is wrong (P)
- **Sentence:** `bind | working | self | lasting | stand | attention | limits: [condition, not-fully-known]`
- **Lowers to:** the condition is a term on the power row (CHT4) and the holder's **belief** is separate from the row (F9). No such belief store exists: knowledge rows are owner N, unwired for `information` and `memory`.
- **Mechanism (F9):** what the holder believes the power does is not what it does. Use shows them more. The difference is the story: a power can be used wrongly for years because the holder not saw its other edges.
- **Variants:** (a) *wrong scope*: the holder thinks it is narrower than it is; (b) *wrong cost*: the holder thinks it is free and it draws on something unseen; (c) *wrong source*: the holder thinks it is theirs and it is a loan.
- **Meets:** XA2 (a copy built from a wrong belief inherits it); XA16 (a vow may be unknown to the holder, which breaks F1, so flagged).
- **Gaps:** XG4.

---

## Part 2: conceptual powers in one world (XC codes)

**Test world (original, illustrative, not canon):** call it the Reach. Four conceptual powers live in it, taken from XA12-XA15: **Distance** (the Warden's fold), **Sharpness** (the Edge), **Ownership** (the Deed), **Notice** (the Hush). The question is how they coexist without contradiction when two of them act on the same fact.

- **XC1 One owner per fact (AR1).** Each concept owns one property or channel: Distance owns link cost, Sharpness owns the `sharpness` property, Ownership owns the `marks` mark `owner`, Notice owns the channel `notice`. A power acts on another concept's fact just **through a verb** (a cut is a `remove` that reads Sharpness; a fold is a `law_params` on a link). No two powers write the same property, so there is no contradiction to resolve in state.
- **XC2 A power is a law field with a stated reach.** Each field carries `{concept, reach: [concepts it passes], layer}`. A field's reach is what its source says (F7); an unshown reach is *not* assumed. A power in the Reach that was not shown to cut Ownership does not cut it.
- **XC3 Resistance has a scope too.** A resistance is a field with `{concept, resists: [concepts], scope}`. The Hush resists being Noticed, not being cut. The Deed resists being moved by `move`, not being destroyed.
- **XC4 Default: not bypassed when unshown (F7).** A power against a resistance passes only if its reach lists the resistance's concept. This default is a dial (`reachDefault: stopped | passes`), default `stopped`.
- **XC5 Matrix (default, per world):**

| Attacker \ Defender | Distance | Sharpness | Ownership | Notice |
| --- | --- | --- | --- | --- |
| **Distance** | stand (both) | passes (folds the cut's reach) | stopped | stopped |
| **Sharpness** | stopped | stand | stopped (cut does not take) | stopped |
| **Ownership** | stopped | stopped | stand | stopped |
| **Notice** | stopped | stopped | stopped | stand |

  "stand" means two instances of one concept: the field with the stronger stated reach wins its own fact, ties go to the settlement order. The matrix is mostly *stopped* because the default is not-bypassed; a Warden who has been **shown** folding a blade's reach adds one `passes` row, and that row is evidence, not a rule.
- **XC6 Axioms.** CR1 (cost grows with magnitude, reach and duration): a wider stated reach costs more. CR2 (a higher rank overcomes a lower one unless a counter applies): the concept's rank decides only the tie of two fields of one concept. CR3 (every effect has a limit, a counter or an upkeep): the stated reach *is* the limit, as an adjective (AD55, CHT12: no compulsory weakness; the reach is a state, not a nerf). CR4 (what a power consumes is conserved): luck and distance cost are conserved in the place graph. CR5 (effects act through the twelve verbs): each concept acts through `alter law` plus the verbs on its fact. CR6 (power passes by a stated channel) and CR7 (stacking follows a world rule: here highest-reach-only for the same concept).
- **XC7 AD21 in-world rules.** Each power is an in-world rule with a cause and scope: "the Warden's fold holds in this valley while the Warden stands in it" is a `law_add` with `scope` and `until`. When the Warden dies or leaves, the field lapses (`law.lapsed` is a built-in kind). That is how conceptual powers coexist: each is a *local rule with an owner*, not a world law.
- **XC8 Pushback through people.** The world pushes back by who notices and who cares: the Deed's holders sue, the Hush's holders are hunted when seen, the Warden's folds are mapped by surveyors who sell the map. No power carries a forced weakness.
- **Check by example.** Distance folds a link so that a blade's reach shortens; Sharpness cuts the folded link. By XC5, Sharpness against Distance is *stopped*, so the cut cannot cut a link; the blade cuts what is in front of it. Ownership moves a deed; Notice hides the thief; by XC5 neither passes the other, so the thief holds an owned thing that nobody notices, and the owner's field still marks them: the world resolves by what each said it could do. No contradiction arises because no two fields wrote one fact.
- **Where it breaks.** A power whose reach is *"everything"* (a stated absolute) would pass every row; by AD56 that is allowed with a world reason and is shown in the matrix as an exception row, listed for Weibao, not defaulted. Two powers of the *same* concept with equal stated reach produce a tie, resolved by settlement order, which is deterministic and arbitrary; flag that tie to the player as a ruling by the world, not by a roll.

---

## Part 3: the O4 meta-targets (XM codes)

**Tagging.** Of the 26 abilities (my own tags, one reader):

| Target | Abilities | Count |
| --- | --- | --- |
| P power rows | XA1, XA2, XA3, XA4, XA6, XA16, XA21, XA26 | 8 |
| R rules (local dial or law field) | XA10, XA11, XA12, XA13, XA14, XA15, XA17, XA18, XA19, XA24 | 10 |
| T timeline | XA7, XA8, XA9 | 3 |
| Router (a wish names any target) | XA5 | 1 |
| Not one of the three | XA20 (a holder), XA22 (a soul), XA23 (a soul), XA25 (a created agent) | 4 |

- **XM1 Verdict: yes, three targets cover most (22 of 26, 85%), plus the wish as a router.** The four left are not "bigger" abilities; they are about *another kind of thing*: an agent or a soul that is itself a holder with its own reactor. **Proposal:** a fourth target, **agents** (created holders with their own standing orders and properties such as will, reliability and wholeness), which E12 `lifecycle` already creates; XA20, XA22, XA23 and XA25 become one slice. Default: leave it as a candidate until the three targets are built; dial: build the agent target first for a world whose lead is an agent holder (a Stand world).
- **XM2 Powers as targets.** Needs the verb grammar to accept `move`, `add` and `remove` on `working` (today just release, copy, block, end, alter, sense and conceal), and an act that lands on a **power row** (today `working` lowers to null, so the effect publishes and waits for K). Terms (CHT4) are the transfer's parameters: gift, digested, matured, lease, loan, lien, leash, burdened loan, bound item. **Sent to the coordinator on 2026-11-18**, because the parallel `power-target` slice depends on it (XG1).
- **XM3 Rules as targets.** Mostly built: W `alter` adds, edits and removes law fields on a holder or place scope with `until` (`world_effects.js`, `law_add`, `law_params`, `law_remove`), so a local rule is a field. What is missing is: (a) a **place-scoped override of a world dial** (the SUBSTRATE_DIALS are world-wide; only field params are local); (b) an **open object slot** so a field can name `property:<name>` or a concept (XG8); (c) a **predicate** for conditions (XG11).
- **XM4 Timeline as a target.** Needs a **snapshot pin** (the pin store, PSA29), a **restore** op, and a **carried set**. The existing `anchor_snapshots.js` derives a world at a time from base events plus a branch; whether it can pin a live W holder world is unverified from the head of the file I read. Default: the pin store is built once and serves canon pins, cheat pins and loop pins (PSA29); the loop's `carried` set is a stated list on the loop card (F5).
- **XM5 Interaction between the three.** A wish (XA5) is a router over all three; a loop (XA7) restores *power rows and rules* too unless they are in the carried set; a stolen power (XA4) edits P and, by its terms, R (a lien is a rule on the thief). Per-world dial: `loopRestores: [world, powers, rules]`, default `world` only, so a loop restores what happened to the world and leaves what the holder *has* (their power rows) alone unless the card says otherwise.

---

## Part 4: gap list and proposals (XG codes)

Counts below are the **blocked ledger rows by slug**, upper bounds that overlap (a row can carry two slugs). A gap "unlocks" a row only up to the PSA28 bar (25% of a slug dry-runs) and only when an entry point calls the law (PWC127: cost is per law and per entry point, not per row; form-transformation moved about 1,200 rows with one law). So the order below ranks the ceiling, then the dependency order says what to build first.

| Rank | Code | Gap | Where it fails | Blocked rows unlocked (ceiling) | Abilities that hit it |
| --- | --- | --- | --- | --- | --- |
| 1 | XG2 | **Power-vs-power resolver with stated reach** (scoped resistance, default not bypassed) | No law reads two power rows against each other; `contactDetails` handles barriers on W holders only | power-interaction **1,417** | XA1, XA3, XA4, XA18, XA19 + XC |
| 2 | XG3 | **Soul as an object with an owner** | `soul` is a `thing` with no W act and no wired owner (L); nothing holds wholeness, anchor or seat | soul-state **1,232** + soul-binding **110** = 1,342 | XA22, XA23, XA1 |
| 3 | XG4 | **Belief vs truth, feasibility and unreadable-by** (divination, what the holder thinks) | `information` and `memory` have no W act; owner N unwired for these; no "holder believes X while the rule says Y" | divination + divination-fate **966** | XA2, XA5, XA11, XA15, XA26 |
| 4 | XG1 | **Power rows as movable things** (`move`, `add`, `remove` on `working`; a row-creating op) | `VERB_ACCEPTS` excludes them; `working` is null in `W_OBJECT_OF` | power-transfer **398** (and a prerequisite to most of XG2's copy, steal and negate rows) | XA1, XA2, XA3, XA4, XA5, XA6, XA21 |
| 5 | XG6 | **Timeline restore with carried set and the pin store** | `time` lowers to `law:*`, `alter` just; no restore op; PSA29 unbuilt | time-manipulation **210** + time-loop **48** = 258 | XA7, XA8, XA9, XA11 |
| 6 | XG5 | **Luck as draw weights** (owner P) | `luck` is null in `W_OBJECT_OF`; waits for the generator contract (PC82) | luck-mechanism **151** | XA10, XA11 |
| 7 | XG9 | **Vow as a typed term** (gain, break effect, visibility) | `limits` is an open text set; `kernel_oath.js` holds the oath but the sentence cannot state gain or break effect | vow-cost **92** | XA16, XA17 |
| 8 | XG10 | **Agent holder with hidden reliability and agenda** (system interface) | Expressible with holders and properties, but no template; the reactor that publishes quests is per world | system-interface **68** | XA20 |
| 9 | XG7 | **Delivery split from payload** (F3) | A sentence has one verb; a counter stops the whole thing | none by slug; makes partial counters possible for XG2's 1,417 and the domain rows | XA3, XA18, XA19 |
| 10 | XG8 | **Open object slot** (`property:<name>` and concept objects) | `EFFECT_OBJECTS` is a closed list (EF2); W already parses `property:<name>` | none by slug; every conceptual-power row | XA12, XA13, XA14, XA15 |
| 11 | XG11 | **Place-scoped rule override and a typed trigger primitive** (a dial or law with `until`; `{on, by, then}` so the condition is data a counter can read) | Dials are world-wide (`SUBSTRATE_DIALS`); a field's trigger is a hand-written reactor. Wiki-tier JoJo counts put 35 conditional-trigger and 17 rule-imposing Stands behind this one primitive | none by slug (about 52 of 172 Stands)  | XA9, XA12, XA14, XA17, XA19, XA24 |
| 12 | XG14 | **Conceptual and time Stands need a state the grammar lacks:** a rule field (a law field whose kind carries the rule) and a time-flow field (a per-holder clock, see XA9). About 12 of 172 Stands (6 conceptual, 6 time); each stays a labelled gap until XG8, XG11 and XG6 land | `time` lowers to `law:*`, no clock field; no rule-field kind | none by slug | XA9, XA24 |
| 12 | XG13 | **Independent agent flag and standing orders** | Created holders exist (E12); no `will` flag or orders language | none by slug | XA23, XA24, XA25 |
| 13 | XG12 | **Interaction budget and an inspector** (cross-cutting, below) | `landEffect` returns status and reason, not which laws were consulted; no per-cause chain cap | none by slug; protects every row | all |

**Dependency order (default build order, dial: per the world that needs it first):** XG1 (movable rows; the power-target slice) -> XG2 (resolver) -> XG7 (delivery split) share one chain; XG8 and XG11 are small grammar edits that open the conceptual powers; XG6 needs the pin store (PSA29) first; XG3 and XG4 are owner-side work (L and N) that no grammar edit fixes; XG5 waits for the generator contract.

**Top five by ceiling: XG2, XG3, XG4, XG1, XG6.** XG1 is the cheapest and unblocks the most abilities (7), so it is the first build even though its own row count is fourth.

### Proposal: interaction budget (XG12a)
- **Default:** a per-cause-root cap on landings in one advance, `interactionBudget` (default 64), a **speed guard, not a balance rule** (AD22: Weibao is the only player, so no abuse hardening). Over budget, further landings are recorded as `damped` with the reason and the cause chain, as `cascadeDepth` (default 4) already does for reacting levels; the existing `chainCap: 200` only trims the effect records kept for chains, so it does not stop a long chain.
- **Dial:** per world and per place (a Stand world sets it higher; a slow-life world lower). Reason: ability stacks (absorb, loop, wish, domain) multiply landings, and 8 GB machines are the performance target (VISION_DIGEST).
- **Done check:** a chain of ten stacked abilities settles under the cap with a stated `damped` tail, not a stall.

### Proposal: inspector (XG12b)
- **Default:** `explainLanding(world, causeId)` returns one object: the sentence parts, the K law and the rows it read, each **check in order** (feasible, charge, payment for a wish; reach and resistance for a clash), the barrier or blocker if any (`contactDetails` reasons, `outcome.blocked`), the reactors that answered, the budget used, and the final status with a one-line reason a player can read (PRS vocabulary for player text; the object is for developers). It reads the provenance ledger (`ledgerCap: 24` sources per quantity) and `landEffect`'s existing `status` and `reason`; what is new is that a law *records which rows it consulted*, which `landEffect` does not keep today.
- **Dial:** detail level (developer full object, player a Reports line, none).
- **Reason:** F9 and F10: holders and readers both reconstruct hidden rules by evidence, so "why did this resolve this way" is a play feature, not only a debug tool, and a stack of extreme abilities is unreadable without it.
- **Done check:** a clash of two domains (XA19) returns a chain saying which stated reach won, or that none was shown and the settlement order decided.

### Proposals, AD32 wording (each: default, dial, reason)
- **XP1. Power rows move through the effect grammar.** Default: `move`, `add` and `remove` accept `working`; a **new** `power_transfer_law` settles them with CHT4 terms and publishes to the power registry. Dial: terms and backing per world (CHT5). Reason: XG1; without it steal, absorb, copy and the shop cannot land.
- **XP2. A power-vs-power resolver reads stated reach.** Default: attacker's reach lists the defender's concept to pass; otherwise stopped (F7). Dial: `reachDefault`. Reason: XG2 and the Part 2 matrix; one rule instead of one clash table per pair.
- **XP3. Delivery and payload are two parts of a domain or sure-hit sentence.** Default: one sentence may carry `delivery` and `payload`; a counter names which half it stops (F3). Dial: per ability. Reason: XG7; partial counters are the most reused gap in the evidence.
- **XP4. The object slot accepts `property:<name>`.** Default: allowed when the world's property table lists the name. Dial: none. Reason: XG8; W already parses it, so a conceptual power needs no new grammar primitive (EF2 asks for a second consumer, which XA13 and XA14 are).
- **XP5. Loops, rewinds and fate edits share the pin store.** Default: PSA29 once, with a carried set on every loop card. Dial: `loopRestores`. Reason: XG6, XM4.
- **XP6. Vows carry a typed term.** Default: `{gain, cost, breakEffect, visible}`; hidden terms are flagged, not forbidden. Dial: per card. Reason: XG9 and F1; it keeps "no forced weakness" because the term is the holder's choice.
- **XP7. Agents are a fourth meta-target.** Default: a created holder with `will`, `reliability`, `agenda` and standing orders (Stands, systems, souls). Dial: per world. Reason: XM1; four abilities do not fit P, R or T.
- **XP8. The interaction budget and the inspector (above).**

### Messages sent
- 2026-11-18, to the coordinator (parent session): XG1 as a grammar gap that changes the power-target slice (move, add, remove on `working`; `working` lowers to no W act). Sent when found, before this document was written.

### Open for a second reader
- Every "no W act" line (soul, luck, working, information, memory, mind, force, lifespan) comes from `W_OBJECT_OF` and `OBJECT_OWNER` in two files. A second reader should check whether a reactor elsewhere (`world_packs/`) already answers `effect.move.working` or `effect.alter.time` before XG1, XG3 or XG6 are built.
- The tag table in Part 3 is one reader's judgment; recount with a second tagger before treating 85% as a number.
- The blocked-row ceilings overlap and none has been dry-run against a proposed law.
