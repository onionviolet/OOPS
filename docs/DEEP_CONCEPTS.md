# Deep concepts beyond infinity

Proposal from chat, 2026-10-10. Weibao asked: "deep ideas like infinity and
more that we should consider and should be considering in implementation?"

These are **considerations**, not specs (see
[Fitting characters and times](FITTING_CHARACTERS_AND_TIMES.md)). Each one is
a palette for worlds, cheats and characters where it fits. Nothing here is
selected for a build.

## What already exists

Infinity is well covered: scale as relationships and five bounded infinity
expeditions ([north star](LIFE_SIM_NORTH_STAR.md#power-scaling-going-multiversal-and-levels-of-infinity-claudes-first-take-2026-10-08)),
the number cap as a cosmic edge (UC12 in [cheat cosmology](CHEAT_COSMOLOGY.md)),
JJK Infinity as Zeno text VFX ([presentation](PRESENTATION_AND_FOURTH_WALL.md)),
and the weight of infinite variants. Paradox, timelines, fate, selves and
true names also have owners. The concepts below had no owner as of this date.

## Shared rule

**Each deep concept is a rule the engine runs, not a flavor word.** If the
concept cannot change a decision, a number, or what the player can know, it
stays in lore. Each entry names its engine hook.

## Concepts

| ID | Concept | In the game | Engine hook |
|---|---|---|---|
| K1 | **Kinds of infinity** (countable vs uncountable, ordinals) | Some infinities are bigger. An endless dungeon you can list floor by floor is "countable"; a continuum coast between two points is not. Ordinal stairs: floor ω comes after every finite floor, and ω+1 after that. A cheat that "beats any finite number" still loses to ω | Progression stored as ordinal-like tuples (`[ω-count, finite]`) compared lexicographically, so "beyond all levels" is a real state, not `Infinity` |
| K2 | **Hilbert's hotel** | A full inn that can always take one more guest by shifting everyone. A hub with infinite rooms that is still "full". Bureaucrats who can always fit you in, at a cost to someone moved down the line | Generated, lazily materialized lists: room n exists only when visited. Shifting is a renumbering, cheap and exact |
| K3 | **Entropy and heat death** | Everything idles down. Fires cool, roads decay, memories blur, a universe slowly loses usable energy. Some worlds are near the end; a cheat that reverses entropy locally is huge and noticed | A per-world "usable energy" stock that only falls; local reversals export disorder elsewhere (conservation keeps it honest) |
| K4 | **Nothingness and zero** | The void between multiverses. Dividing by zero as a forbidden technique. A being whose power is absence: it removes, never adds. Zero as a stat floor that some cheats can push past (negative luck, negative existence) | Signed stats where negatives are legal and meaningful; explicit "absent" state distinct from 0 |
| K5 | **Self-reference and Gödel** | Any system powerful enough contains a true statement it cannot prove. Every System cheat has a blind spot about itself; an enemy can live in it. "This oath cannot be kept" style vows | Each System or rule set lists one sealed self-blind spot (secret ID, discovery route) |
| K6 | **Undecidability / halting** | Some prophecies cannot resolve until the event happens. Oracles that say "this question does not end". A simulator cheat that hangs on certain questions instead of answering | Simulation budget per query; an over-budget query returns "undecided" as a real result, never a guess |
| K7 | **Recursion and fixed points** | A dream inside a dream, a world inside an item, a game inside the game. A fixed point is a self that recursion cannot change: the "true self" past all masks | Nesting depth as state with a cost per layer; a fixed-point check (applying the transform again changes nothing) marks the stable form |
| K8 | **Eternal return** | Live the same life infinitely. Regression already exists; this adds the question: would you choose this life again? Some runs end on that question | Run-end reflection prompt that scores against the player's own stated wishes, not the game's |
| K9 | **Ship of Theseus** | Replace every limb, memory or soul fragment piece by piece. Who are you now? Bodies swapped across worlds, item instances that are "the same sword" after reforging | Identity as a lineage of changes with a continuity score; NPC recognition reads that score |
| K10 | **Free will vs determinism** | Fate on world cards already exists. Add: Laplace's demon as a being that knows everything about one world's present and therefore its future, until something outside the world (you) acts | Coarse event graph is deterministic per seed; outsider actions are the only source of divergence, logged as such |
| K11 | **Borges' library** | Every possible book exists; almost all are noise. The value is in finding. An archive world where search is the skill | Procedural content from a seed and an address; the address is the item. Search costs time, finds rise with skill |
| K12 | **Observation** | Unobserved things are undecided (lazy resolution already exists in timelines). Push it: some beings exist only while watched; some secrets change if you look wrong | Lazy fields that resolve on first read and then lock; a "who observed" record per resolution |
| K13 | **Emergence** | Ants are simple and the colony is smart. A city, a sect or a market as one mind that no member controls. A world will as emergent from its people | Aggregate actors whose decisions come from member state, not a script |
| K14 | **Compression and information** | Knowledge as a resource that shrinks when understood. A master's technique is a short rule; a novice's is a long list of cases. Insight literally shortens your skill tree | Skill descriptions with a "rule length"; insight replaces many entries with one rule |
| K15 | **Measure and probability** | Infinitely many outcomes but some count more. Luck cheats that move probability mass, not outcomes. Zero-probability events that still happen (outliers, cosmic events) | Luck edits weights, never picks results directly; outliers sample from a separate tiny-mass table |
| K16 | **Scale invariance** | Looks the same at every zoom: fractal worlds, a village ruled like an empire, a cell that is a universe. The zoom ladder already exists; this makes some worlds repeat at each rung | Reusable rule sets applied at several scope levels with different units |

## Engine considerations

| ID | Consideration | Why it matters |
|---|---|---|
| E1 | **JS numbers break at 1.8e308, and `JSON.stringify(Infinity)` writes `null`** | The engine uses plain JS numbers and has no big-number library. Any cosmic stat that reaches `Infinity` or `NaN` will save as `null` and load wrong. `save_files.js` and `expansion_persistence.js` check `isFinite` on specific fields only; there is no general guard. A save-wide guard (clamp or tag non-finite values) belongs in persistence before any infinity mechanic ships |
| E2 | **Infinity is a type, not a value** | Represent "infinite" as a tagged state (`{kind: 'unbounded', rank}`) so ω, uncountable and "beyond" compare correctly. Plain `Infinity` collapses all of them into one |
| E3 | **Big numbers if idle growth wants them** | If a world uses Antimatter-Dimensions-style growth, add a log-space or mantissa/exponent number type for that world only. Do not convert the whole engine |
| E4 | **Lazy everything** | Infinite rooms, libraries and variants must exist only when read. Store the seed and address, never the list |
| E5 | **Budgets on every unbounded loop** | Recursion, simulation and search need a hard step budget so a cheat cannot hang the tab. Over-budget is a game state (K6) |
| E6 | **Determinism for replays** | K10 and K12 need the same seed to give the same world. Keep randomness seeded per world and per query |

## Smallest proofs (ranked)

1. **E1 save guard.** Prevents a real data-loss bug and costs little. Do this
   before any infinity content.
2. **K1 ordinal stair** as one of the five infinity expeditions: floors 1, 2,
   3... then ω, using E2.
3. **K6 undecided oracle** in an existing prophecy or simulator cheat.

Open questions: which worlds want which concepts; whether K8's reflection
prompt fits the tone of every run.

## Implication abilities (2026-10-10, second pass)

Weibao: "What about abilities that has implications like adaptation, perfect
self, and probably many that I haven't considered right now?"

Adaptation ([E8E](emergent/E8E_ADAPTATION.md)) and perfect selves
([Selves and echoes](SELVES_AND_ECHOES.md#g1-and-g2-perfect-selves)) share a
shape: **the ability is a function over game state, not a number.** Adaptation
reads your history. A perfect self searches every way a fight could go. Once
an ability is a function, its logic reaches every system it touches: combat,
economy, identity, saves, other cheats and itself. Those consequences are the
content.

### The implication test

Run every function-shaped ability through these questions. Each answer is
either a feature, a limit or a counter. The world decides which.

| ID | Question | Example answer |
|---|---|---|
| T1 | **Trivial targets?** Does it apply to air, light, gravity, your own blood? | Accelerator's reflection must let oxygen and light through, or he suffocates blind. What he lets through is his weak point |
| T2 | **Self and allies?** Can it target the user, friends, or itself? | Adaptation applied to your own fatigue; Imagine Breaker also cancels healing magic |
| T3 | **Applied to itself?** | Copying a copier, adapting to adaptation, a perfect self of your perfect self (K5, K7) |
| T4 | **Stacked or repeated?** | Two absolute defenses collide; ten clones with shared memory learn ten times faster |
| T5 | **Offline and idle?** | What it does during 8 hours away. Adaptation keeps learning; a time-stop user ages alone |
| T6 | **Economy?** | Duplication, infinite storage or instant learning collapse a market. Prices, guilds and laws react |
| T7 | **Society?** | Who fears it, wants it, outlaws it, worships it. Mind reading ends privacy for everyone near you |
| T8 | **Information?** | What it reveals about the user. Every use leaves a signature (E7 observation) |
| T9 | **Edge of the rule?** | What exactly counts as "the same attack", "a lethal blow", "you"? The fuzzy edge is where clever play lives |
| T10 | **State footprint?** | What must be saved: a ledger, snapshots, a search tree. Rewind powers need history; prediction needs a seed |

### Ability shapes

Each row is a shape many sources share. "Implies" is the part that is easy to
miss.

| ID | Shape | Examples | Implies | Counter for a real reason |
|---|---|---|---|---|
| I1 | **Learns** | Mahoraga; poison tolerance; a rival learning your style | Needs a memory of what hit it; a society can learn too | Novelty, one-shot kills, attacks that change every time |
| I2 | **Optimizes** | Perfect self; Worm's Path to Victory | A search space and a budget (K6); "what counts as best" is a choice | Hidden information, other optimizers, goals it cannot express |
| I3 | **Copies or steals** | Sharingan; Rimuru's Predator; Rogue | Abilities must be data that can move; copying limits are per ability | Abilities tied to a body, bloodline or vow |
| I4 | **Negates** | Imagine Breaker; anti-magic | Every effect needs a "supernatural" tag; it cancels help too | Physical consequences of magic (a thrown rock stays thrown) |
| I5 | **Redirects** | Accelerator's vectors; Allomancy steel push | Everything has a direction; Newton's third law (pushing a coin pushes you) | Non-vector effects, things he must let through (T1) |
| I6 | **Rewinds** | Return by Death; Bites the Dust; Tatsuya's Regrowth (24 hours) | Snapshots and a window; what memories survive | Damage that spans longer than the window, attacks on memory |
| I7 | **Predicts** | Precognition; Laplace's demon (K10) | Determinism; two predictors make a loop | Outsiders, randomness, acting without deciding |
| I8 | **Reverses cause and effect** | Gae Bolg (the hit is decided before the throw) | Outcome resolves before process | Luck or fate strong enough to make the throw miss |
| I9 | **Conserves and exchanges** | FMA's equivalent exchange; Death's End's mass return | A ledger; arbitrage across worlds | Exchanges with hidden costs, debts called later |
| I10 | **Defines or names** | True names; authority; "what I say is law" | A parser and loopholes; Gödel holes (K5) | Literal readings, unnamed things |
| I11 | **Sees the end of things** | Shiki's Mystic Eyes of Death Perception | Everything, even abstract things, has a finite end | Things without an end (K1 infinity, K4 absence) |
| I12 | **Multiplies self** | Shadow clones with pooled memory | Parallel actions, faster idle, identity drift (K9) | Pooled pain and fatigue, which clone is real |
| I13 | **Remembers perfectly** | Borges' *Funes the Memorious* | Cannot forget, so cannot abstract (K14 inverse); trauma | Overload, too many details to act |
| I14 | **Stops time** | JoJo's The World; Touhou's Sakuya | Physically, frozen light would leave you blind and the air solid; each world decides how strict to be | Others who move in stopped time, entropy cost (K3) |
| I15 | **Accelerates time** | Made in Heaven | Offline progress as a weapon; everyone else ages | Things outside time, beings who adapt (I1) |
| I16 | **Bends probability** | Luck cheats; Hitchhiker's Infinite Improbability Drive | Edits weights, not results (K15) | Certain outcomes with probability 1 |
| I17 | **Grows forever** | The Gamer; level-up systems | Every curve hits K1 or E1 eventually; Goodhart (K27) | Stat caps by world, meaning beyond numbers |
| I18 | **Duplicates matter** | Item copying; Banach-Tarski (K25) | Market collapse (T6), unique items lose value | Unique specimens, souls, things that know they were copied |
| I19 | **Resets to zero** | Gold Experience Requiem | An infinite loop with no exit; a target that can never reach the result | Escapes that do not need reaching the result |
| I20 | **Hides from records** | Lord of the Mysteries' secret-keeping; fate-blind characters | The System and oracles have blind spots (K5, K12) | Physical traces, people who remember without records |
| I21 | **Grants wishes** | Genies; wish-granting cups | Wording matters; the wish is parsed (I10) | Literal readings, wishes that conflict |
| I22 | **Changes the world's rules** | Changing constants (K19); domains | A rule set per area; collisions | Rules that come before the change (canon events) |

Most of these appear somewhere in the existing docs under other names. What's
new here is the shared shape and the test. A new ability should be checked
against T1 to T10 before it gets numbers.

## Fiction that weaponizes math and physics

Weibao: "Has there been books where mathematical and physical concepts were
weaponized or used in some way?" Yes, many. This list is **from memory, not
yet checked against sources.** Verify before using any specific detail as a
book fact (PROJECT.md attribution rules apply).

### Hard science fiction

| Work | Concept used | Maps to |
|---|---|---|
| Liu Cixin, *The Three-Body Problem* trilogy | Sophons (unfolded protons that sabotage physics experiments and spy); the dark forest (game theory as a doctrine of interstellar war); a dimensional strike that flattens a solar system into 2D; slowing light inside a region as a shield | K18, K19, K21 |
| Liu Cixin, *Death's End* | Pocket universes must return their mass so the big universe can restart | I9, K3 |
| Liu Cixin, *Ball Lightning* | Macro-scale quantum effects that stay undecided until someone looks | K12 |
| Greg Egan, *Luminous* and *Dark Integers* | Two regions of math where a theorem has different truth; proving a theorem attacks the other side | K5, I10 |
| Greg Egan, *Permutation City* | A simulation runs no matter the order its steps are computed in | K31, offline progress |
| Greg Egan, *Orthogonal* trilogy | A universe with different geometry, so light and time behave differently | K19 |
| Ted Chiang, *Division by Zero* | A proof that arithmetic is inconsistent breaks a mathematician | K4, K5 |
| Ted Chiang, *Story of Your Life* | Physics as goal-seeking (light takes the fastest path); knowing the future changes how you live | I7, I8 |
| Ted Chiang, *Exhalation* | A mechanical universe slowly running out of air pressure | K3 |
| Isaac Asimov, *The Last Question* | Whether entropy can be reversed | K3 |
| Vernor Vinge, *A Fire Upon the Deep* | Zones of Thought: the laws of computation change with position in the galaxy | K19, I22 |
| Peter Watts, *Blindsight* | Aliens exploit gaps in human vision; consciousness may be unnecessary | T8 |
| David Langford, *BLIT* stories | Images that crash the human mind | K5, I10 |
| Neal Stephenson, *Snow Crash* | Language as a virus that rewrites the brain | I10 |
| Neal Stephenson, *Anathem* | Monastic theorists, many worlds, theory as a strategic asset | K10 |
| Douglas Adams, *Hitchhiker's Guide* | Infinite Improbability Drive; the Total Perspective Vortex (seeing your true scale destroys you) | K15, scale |
| Edwin Abbott, *Flatland* | Life in fewer dimensions; a higher being looks like magic | K18 |
| Rudy Rucker, *White Light* | A visit to Cantor's infinities, including a Hilbert hotel | K1, K2 |
| Hannu Rajaniemi, *The Quantum Thief* | Quantum cryptography and privacy as social law | K22 |
| Poul Anderson, *Tau Zero*; Joe Haldeman, *The Forever War* | Time dilation: the trip costs everyone at home years | K24 |

### Fantasy, anime and web novels

| Work | Concept used | Maps to |
|---|---|---|
| Charles Stross, *The Laundry Files* | Math and computation summon things from elsewhere; certain theorems are classified | K22, I10 |
| Brandon Sanderson, *Mistborn* | Allomancy pushes and pulls with Newton's third law | I5 |
| Brandon Sanderson, *The Rithmatist* | Chalk geometry as dueling magic | K23 |
| Yoon Ha Lee, *Ninefox Gambit* | Exotic weapons work only while enough people follow the calendar; heresy breaks physics | K26, K13 |
| *A Certain Magical Index* / *Railgun* | Accelerator's vector control; the railgun's electromagnetism; espers whose power rests on their own view of quantum reality | I5, K12 |
| *The Irregular at Magic High School* | Magic as editing information about matter; mass-to-energy conversion; restoring an object to its state up to 24 hours ago | I6, I9 |
| *Jujutsu Kaisen* | Gojo's Infinity as a converging series (Zeno) | K1, existing VFX |
| *Fullmetal Alchemist* | Equivalent exchange as conservation law | I9, K17 |
| *Puella Magi Madoka Magica* | An alien species harvests emotion to fight entropy | K3 |
| *Steins;Gate* | World lines and attractor fields | Timelines doc |
| *JoJo's Bizarre Adventure* | Stopped time, erased time, accelerated time, loops, return to zero | I14, I15, I19 |
| *Fate* series | Gae Bolg reverses cause and effect; the Mystic Eyes see where everything ends | I8, I11 |
| *Lord of the Mysteries* | A pathway that steals abstract things; secrecy hides you from divination | I20 |
| *Reverend Insanity* | Gu worms as portable rules; rewinding time with a cost | I6, I22 |

## More concepts

| ID | Concept | In the game | Engine hook |
|---|---|---|---|
| K17 | **Noether's theorem** (every symmetry gives a conservation law) | A world where energy is conserved because time is uniform. Break the symmetry (a place where time is uneven) and conservation breaks there too | Conservation checks tied to a world's symmetry flags |
| K18 | **Dimensionality** | Reducing a target to fewer dimensions (Three-Body); higher beings who see inside closed boxes (Flatland) | A dimension count per entity; higher can see and reach lower |
| K19 | **Physical constants as dials** | Change light speed, gravity or the strength of fire in an area; fine-tuned worlds that break if tweaked | World law values ([E9](emergent/E9_WORLD_LAWS.md)) editable per region |
| K20 | **Chaos** | Small actions with huge later effects; forecasts that only work a few days out | Divergence that grows with time since the change |
| K21 | **Game theory** | The dark forest; prisoner's dilemmas between sects; reputation as repeated play | NPC policies chosen from payoffs and memory |
| K22 | **Computational hardness** (easy to check, hard to find) | A cheat that solves hard problems breaks every lock, seal and cipher. Checking a proof is cheap; finding it is costly | Seals with separate solve and verify costs |
| K23 | **Topology** | Rooms with no inside, one-sided corridors, a maze where going far brings you back mirrored | Map links with a flip flag |
| K24 | **Relativity of time** | Fast travel ages you less than home; simultaneity depends on where you stand | Per-traveler clocks against per-world clocks (local clocks already exist) |
| K25 | **Banach-Tarski** | Split a sphere into pieces and reassemble two spheres; only possible with "unmeasurable" pieces | Duplication only for items tagged unmeasurable |
| K26 | **Arrow's impossibility** (no voting system is fair in every way) | Every council, sect or guild election has a flaw someone can exploit | Each institution names its voting rule and its known exploit |
| K27 | **Goodhart's law** (a measured number stops measuring once people chase it) | System stats get gamed; the System notices and changes the metric | Systems with a hidden real goal behind the visible stat |
| K28 | **Anthropic selection** | You only see worlds where you survived; regressors see a biased past | Notebook warns that a regressor's evidence is survivor-biased |
| K29 | **Maxwell's demon and the cost of forgetting** | A being that sorts heat for free; erasing memory costs energy | Memory wipe and sorting effects with energy costs |
| K30 | **Supertasks** (infinitely many steps in finite time) | Thomson's lamp: is it on or off after infinite flips? A technique that completes infinite work | Supertask results are undecided (K6) unless the world rules otherwise |
| K31 | **Order-independent computation** (*Permutation City*) | Offline progress is the world computing you in any order | Offline catch-up computed in chunks with the same result in any order |

### Smallest proofs for this pass (ranked)

1. **Implication test (T1 to T10) as a section of the ability authoring
   template** ([ABILITY_AUTHORING](worlds/ABILITY_AUTHORING.md)). It's free
   and improves every ability.
2. **I5 redirect** as one cheat with a T1 weak point (what it must let
   through).
3. **K22 seals** with separate solve and verify costs, because they plug
   into locks and secrets that already exist.
